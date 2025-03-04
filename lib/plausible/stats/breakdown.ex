defmodule Plausible.Stats.Breakdown do
  use Plausible.ClickhouseRepo
  use Plausible
  use Plausible.Stats.Fragments

  import Plausible.Stats.{Base, Imported, Util}
  require OpenTelemetry.Tracer, as: Tracer
  alias Plausible.Stats.Query

  @no_ref "Direct / None"
  @not_set "(not set)"

  @session_metrics [:visits, :bounce_rate, :visit_duration]

  @revenue_metrics on_full_build(do: Plausible.Stats.Goal.Revenue.revenue_metrics(), else: [])

  @event_metrics [:visitors, :pageviews, :events] ++ @revenue_metrics

  @event_props Plausible.Stats.Props.event_props()

  def breakdown(site, query, property, metrics, pagination, opts \\ [])

  def breakdown(site, query, "event:goal" = property, metrics, pagination, opts) do
    site = Plausible.Repo.preload(site, :goals)

    {event_goals, pageview_goals} = Enum.split_with(site.goals, & &1.event_name)
    events = Enum.map(event_goals, & &1.event_name)
    event_query = %Query{query | filters: Map.put(query.filters, "event:name", {:member, events})}

    if !Keyword.get(opts, :skip_tracing), do: trace(query, property, metrics)

    event_results =
      if Enum.any?(event_goals) do
        revenue_goals =
          on_full_build do
            Enum.filter(event_goals, &Plausible.Goal.Revenue.revenue?/1)
          end

        site
        |> breakdown(event_query, "event:name", metrics, pagination, skip_tracing: true)
        |> transform_keys(%{name: :goal})
        |> cast_revenue_metrics_to_money(revenue_goals)
      else
        []
      end

    {limit, page} = pagination
    offset = (page - 1) * limit

    page_results =
      if Enum.any?(pageview_goals) do
        page_exprs = Enum.map(pageview_goals, & &1.page_path)
        page_regexes = Enum.map(page_exprs, &page_regex/1)

        from(e in base_event_query(site, query),
          order_by: [desc: fragment("uniq(?)", e.user_id)],
          limit: ^limit,
          offset: ^offset,
          where:
            fragment(
              "notEmpty(multiMatchAllIndices(?, ?) as indices)",
              e.pathname,
              ^page_regexes
            ) and e.name == "pageview",
          group_by: fragment("index"),
          select: %{
            index: fragment("arrayJoin(indices) as index"),
            goal: fragment("concat('Visit ', ?[index])", ^page_exprs)
          }
        )
        |> select_event_metrics(metrics -- @revenue_metrics)
        |> ClickhouseRepo.all()
        |> Enum.map(fn row -> Map.delete(row, :index) end)
      else
        []
      end

    zip_results(event_results, page_results, :goal, metrics)
  end

  def breakdown(site, query, "event:props:" <> custom_prop = property, metrics, pagination, opts) do
    {currency, metrics} =
      on_full_build do
        Plausible.Stats.Goal.Revenue.get_revenue_tracking_currency(site, query, metrics)
      else
        {nil, metrics}
      end

    {_limit, page} = pagination

    none_result =
      if page == 1 && include_none_result?(query.filters[property]) do
        none_query = Query.put_filter(query, property, {:is, "(none)"})

        from(e in base_event_query(site, none_query),
          select: %{},
          select_merge: %{^custom_prop => "(none)"},
          having: fragment("uniq(?)", e.user_id) > 0
        )
        |> select_event_metrics(metrics)
        |> ClickhouseRepo.all()
      else
        []
      end

    if !Keyword.get(opts, :skip_tracing), do: trace(query, property, metrics)

    breakdown_events(site, query, "event:props:" <> custom_prop, metrics, pagination)
    |> Kernel.++(none_result)
    |> Enum.map(&cast_revenue_metrics_to_money(&1, currency))
    |> Enum.sort_by(& &1[sorting_key(metrics)], :desc)
  end

  def breakdown(site, query, "event:page" = property, metrics, pagination, opts) do
    event_metrics = Enum.filter(metrics, &(&1 in @event_metrics))
    session_metrics = Enum.filter(metrics, &(&1 in @session_metrics))

    event_result = breakdown_events(site, query, "event:page", event_metrics, pagination)

    event_result =
      if :time_on_page in metrics do
        pages = Enum.map(event_result, & &1[:page])
        time_on_page_result = breakdown_time_on_page(site, query, pages)

        Enum.map(event_result, fn row ->
          Map.put(row, :time_on_page, time_on_page_result[row[:page]])
        end)
      else
        event_result
      end

    new_query =
      case event_result do
        [] ->
          query

        pages ->
          Query.put_filter(query, "visit:entry_page", {:member, Enum.map(pages, & &1[:page])})
      end

    if !Keyword.get(opts, :skip_tracing), do: trace(new_query, property, metrics)

    if Enum.any?(event_metrics) && Enum.empty?(event_result) do
      []
    else
      {limit, _page} = pagination

      session_result =
        breakdown_sessions(site, new_query, "visit:entry_page", session_metrics, {limit, 1})
        |> transform_keys(%{entry_page: :page})

      metrics = metrics ++ [:page]

      zip_results(
        event_result,
        session_result,
        :page,
        metrics
      )
      |> Enum.map(&Map.take(&1, metrics))
    end
  end

  def breakdown(site, query, property, metrics, pagination, opts) when property in @event_props do
    if !Keyword.get(opts, :skip_tracing), do: trace(query, property, metrics)
    breakdown_events(site, query, property, metrics, pagination)
  end

  def breakdown(site, query, property, metrics, pagination, opts) do
    if !Keyword.get(opts, :skip_tracing), do: trace(query, property, metrics)
    breakdown_sessions(site, query, property, metrics, pagination)
  end

  defp zip_results(event_result, session_result, property, metrics) do
    null_row = Enum.map(metrics, fn metric -> {metric, nil} end) |> Enum.into(%{})

    prop_values =
      Enum.map(event_result ++ session_result, fn row -> row[property] end)
      |> Enum.uniq()

    Enum.map(prop_values, fn value ->
      event_row = Enum.find(event_result, fn row -> row[property] == value end) || %{}
      session_row = Enum.find(session_result, fn row -> row[property] == value end) || %{}

      null_row
      |> Map.merge(event_row)
      |> Map.merge(session_row)
    end)
    |> Enum.sort_by(& &1[sorting_key(metrics)], :desc)
  end

  defp include_none_result?({:is, value}), do: value == "(none)"
  defp include_none_result?({:is_not, "(none)"}), do: false
  defp include_none_result?({:member, values}), do: Enum.member?(values, "(none)")
  defp include_none_result?({:not_member, values}), do: !Enum.member?(values, "(none)")
  defp include_none_result?({:matches, _}), do: false
  defp include_none_result?(_), do: true

  defp breakdown_sessions(_, _, _, [], _), do: []

  defp breakdown_sessions(site, query, property, metrics, pagination) do
    from(s in query_sessions(site, query),
      order_by: [desc: fragment("uniq(?)", s.user_id), asc: fragment("min(?)", s.start)],
      select: %{}
    )
    |> filter_converted_sessions(site, query)
    |> do_group_by(property)
    |> select_session_metrics(metrics, query)
    |> merge_imported(site, query, property, metrics)
    |> apply_pagination(pagination)
    |> ClickhouseRepo.all()
    |> transform_keys(%{operating_system: :os})
    |> remove_internal_visits_metric(metrics)
  end

  defp breakdown_events(_, _, _, [], _), do: []

  defp breakdown_events(site, query, property, metrics, pagination) do
    from(e in base_event_query(site, query),
      order_by: [desc: fragment("uniq(?)", e.user_id)],
      select: %{}
    )
    |> do_group_by(property)
    |> select_event_metrics(metrics)
    |> merge_imported(site, query, property, metrics)
    |> apply_pagination(pagination)
    |> ClickhouseRepo.all()
    |> transform_keys(%{operating_system: :os})
  end

  defp breakdown_time_on_page(_site, _query, []) do
    %{}
  end

  defp breakdown_time_on_page(site, query, pages) do
    if FunWithFlags.enabled?(:window_time_on_page) do
      window_breakdown_time_on_page(site, query, pages)
    else
      neighbor_breakdown_time_on_page(site, query, pages)
    end
  end

  defp neighbor_breakdown_time_on_page(site, query, pages) do
    q =
      from(
        e in base_event_query(site, Query.remove_event_filters(query, [:page, :props])),
        select: {
          fragment("? as p", e.pathname),
          fragment("? as t", e.timestamp),
          fragment("? as s", e.session_id)
        },
        order_by: [e.session_id, e.timestamp]
      )

    {base_query_raw, base_query_raw_params} = ClickhouseRepo.to_sql(:all, q)

    select =
      if query.include_imported do
        "sum(td), count(case when p2 != p then 1 end)"
      else
        "round(sum(td)/count(case when p2 != p then 1 end))"
      end

    pages_idx = length(base_query_raw_params)
    params = base_query_raw_params ++ [pages]

    time_query = "
      SELECT
        p,
        #{select}
      FROM
        (SELECT
          p,
          p2,
          sum(t2-t) as td
        FROM
          (SELECT
            *,
            neighbor(t, 1) as t2,
            neighbor(p, 1) as p2,
            neighbor(s, 1) as s2
          FROM (#{base_query_raw}))
        WHERE s=s2 AND p IN {$#{pages_idx}:Array(String)}
        GROUP BY p,p2,s)
      GROUP BY p"

    {:ok, res} = ClickhouseRepo.query(time_query, params)

    if query.include_imported do
      # Imported page views have pre-calculated values
      res =
        res.rows
        |> Enum.map(fn [page, time, visits] -> {page, {time, visits}} end)
        |> Enum.into(%{})

      from(
        i in "imported_pages",
        group_by: i.page,
        where: i.site_id == ^site.id,
        where: i.date >= ^query.date_range.first and i.date <= ^query.date_range.last,
        where: i.page in ^pages,
        select: %{
          page: i.page,
          pageviews: fragment("sum(?) - sum(?)", i.pageviews, i.exits),
          time_on_page: sum(i.time_on_page)
        }
      )
      |> ClickhouseRepo.all()
      |> Enum.reduce(res, fn %{page: page, pageviews: pageviews, time_on_page: time}, res ->
        {restime, resviews} = Map.get(res, page, {0, 0})
        Map.put(res, page, {restime + time, resviews + pageviews})
      end)
      |> Enum.map(fn
        {page, {_, 0}} -> {page, nil}
        {page, {time, pageviews}} -> {page, time / pageviews}
      end)
      |> Enum.into(%{})
    else
      res.rows |> Enum.map(fn [page, time] -> {page, time} end) |> Enum.into(%{})
    end
  end

  defp window_breakdown_time_on_page(site, query, pages) do
    import Ecto.Query

    windowed_pages_q =
      from e in base_event_query(site, Query.remove_event_filters(query, [:page, :props])),
        select: %{
          next_timestamp: over(fragment("leadInFrame(?)", e.timestamp), :event_horizon),
          next_pathname: over(fragment("leadInFrame(?)", e.pathname), :event_horizon),
          timestamp: e.timestamp,
          pathname: e.pathname,
          session_id: e.session_id
        },
        windows: [
          event_horizon: [
            partition_by: e.session_id,
            order_by: e.timestamp,
            frame: fragment("ROWS BETWEEN CURRENT ROW AND 1 FOLLOWING")
          ]
        ]

    timed_page_transitions_q =
      from e in subquery(windowed_pages_q),
        group_by: [e.pathname, e.next_pathname, e.session_id],
        where: e.pathname in ^pages,
        where: e.next_timestamp != 0,
        select: %{
          pathname: e.pathname,
          transition: e.next_pathname != e.pathname,
          duration: sum(e.next_timestamp - e.timestamp)
        }

    no_select_timed_pages_q =
      from e in subquery(timed_page_transitions_q),
        group_by: e.pathname

    timed_pages_q =
      if query.include_imported do
        # Imported page views have pre-calculated values
        imported_timed_pages_q =
          from i in "imported_pages",
            group_by: i.page,
            where: i.site_id == ^site.id,
            where: i.date >= ^query.date_range.first and i.date <= ^query.date_range.last,
            where: i.page in ^pages,
            select: %{
              page: i.page,
              time_on_page: sum(i.time_on_page),
              visits: sum(i.pageviews) - sum(i.exits)
            }

        timed_pages_q =
          from e in no_select_timed_pages_q,
            select: %{
              page: e.pathname,
              time_on_page: sum(e.duration),
              visits: fragment("countIf(?)", e.transition)
            }

        "timed_pages"
        |> with_cte("timed_pages", as: ^timed_pages_q)
        |> with_cte("imported_timed_pages", as: ^imported_timed_pages_q)
        |> join(:full, [t], i in "imported_timed_pages", on: t.page == i.page)
        |> select(
          [t, i],
          {
            fragment("if(empty(?),?,?)", t.page, i.page, t.page),
            (t.time_on_page + i.time_on_page) / (t.visits + i.visits)
          }
        )
      else
        from e in no_select_timed_pages_q,
          select: {e.pathname, fragment("sum(?)/countIf(?)", e.duration, e.transition)}
      end

    timed_pages_q
    |> Plausible.ClickhouseRepo.all()
    |> Map.new()
  end

  defp do_group_by(
         %Ecto.Query{from: %Ecto.Query.FromExpr{source: {"events" <> _, _}}} = q,
         "event:props:" <> prop
       ) do
    from(
      e in q,
      where: has_key(e, :meta, ^prop),
      select_merge: %{^prop => get_by_key(e, :meta, ^prop)},
      group_by: get_by_key(e, :meta, ^prop),
      order_by: {:asc, get_by_key(e, :meta, ^prop)}
    )
  end

  defp do_group_by(
         %Ecto.Query{from: %Ecto.Query.FromExpr{source: {"events" <> _, _}}} = q,
         "event:name"
       ) do
    from(
      e in q,
      group_by: e.name,
      select_merge: %{name: e.name},
      order_by: {:asc, e.name}
    )
  end

  defp do_group_by(
         %Ecto.Query{from: %Ecto.Query.FromExpr{source: {"events" <> _, _}}} = q,
         "event:page"
       ) do
    from(
      e in q,
      group_by: e.pathname,
      select_merge: %{page: e.pathname},
      order_by: {:asc, e.pathname}
    )
  end

  defp do_group_by(
         %Ecto.Query{from: %Ecto.Query.FromExpr{source: {"events" <> _, _}}} = q,
         "event:page_match"
       ) do
    case Map.get(q, :__private_match_sources__) do
      match_exprs when is_list(match_exprs) ->
        from(
          e in q,
          group_by: fragment("index"),
          select_merge: %{
            index: fragment("arrayJoin(indices) as index"),
            page_match: fragment("?[index]", ^match_exprs)
          },
          order_by: {:asc, fragment("index")}
        )
    end
  end

  defp do_group_by(q, "visit:source") do
    from(
      s in q,
      group_by: s.referrer_source,
      select_merge: %{
        source: fragment("if(empty(?), ?, ?)", s.referrer_source, @no_ref, s.referrer_source)
      },
      order_by: {:asc, s.referrer_source}
    )
  end

  defp do_group_by(q, "visit:country") do
    from(
      s in q,
      where: s.country_code != "\0\0" and s.country_code != "ZZ",
      group_by: s.country_code,
      select_merge: %{country: s.country_code},
      order_by: {:asc, s.country_code}
    )
  end

  defp do_group_by(q, "visit:region") do
    from(
      s in q,
      where: s.subdivision1_code != "",
      group_by: s.subdivision1_code,
      select_merge: %{region: s.subdivision1_code},
      order_by: {:asc, s.subdivision1_code}
    )
  end

  defp do_group_by(q, "visit:city") do
    from(
      s in q,
      where: s.city_geoname_id != 0,
      group_by: s.city_geoname_id,
      select_merge: %{city: s.city_geoname_id},
      order_by: {:asc, s.city_geoname_id}
    )
  end

  defp do_group_by(q, "visit:entry_page") do
    from(
      s in q,
      group_by: s.entry_page,
      select_merge: %{entry_page: s.entry_page},
      order_by: {:asc, s.entry_page}
    )
  end

  defp do_group_by(q, "visit:exit_page") do
    from(
      s in q,
      group_by: s.exit_page,
      select_merge: %{exit_page: s.exit_page},
      order_by: {:asc, s.exit_page}
    )
  end

  defp do_group_by(q, "visit:referrer") do
    from(
      s in q,
      group_by: s.referrer,
      select_merge: %{
        referrer: fragment("if(empty(?), ?, ?)", s.referrer, @no_ref, s.referrer)
      },
      order_by: {:asc, s.referrer}
    )
  end

  defp do_group_by(q, "visit:utm_medium") do
    from(
      s in q,
      where: fragment("not empty(?)", s.utm_medium),
      group_by: s.utm_medium,
      select_merge: %{
        utm_medium: s.utm_medium
      }
    )
  end

  defp do_group_by(q, "visit:utm_source") do
    from(
      s in q,
      where: fragment("not empty(?)", s.utm_source),
      group_by: s.utm_source,
      select_merge: %{
        utm_source: s.utm_source
      }
    )
  end

  defp do_group_by(q, "visit:utm_campaign") do
    from(
      s in q,
      where: fragment("not empty(?)", s.utm_campaign),
      group_by: s.utm_campaign,
      select_merge: %{
        utm_campaign: s.utm_campaign
      }
    )
  end

  defp do_group_by(q, "visit:utm_content") do
    from(
      s in q,
      where: fragment("not empty(?)", s.utm_content),
      group_by: s.utm_content,
      select_merge: %{
        utm_content: s.utm_content
      }
    )
  end

  defp do_group_by(q, "visit:utm_term") do
    from(
      s in q,
      where: fragment("not empty(?)", s.utm_term),
      group_by: s.utm_term,
      select_merge: %{
        utm_term: s.utm_term
      }
    )
  end

  defp do_group_by(q, "visit:device") do
    from(
      s in q,
      group_by: s.screen_size,
      select_merge: %{
        device: fragment("if(empty(?), ?, ?)", s.screen_size, @not_set, s.screen_size)
      },
      order_by: {:asc, s.screen_size}
    )
  end

  defp do_group_by(q, "visit:os") do
    from(
      s in q,
      group_by: s.operating_system,
      select_merge: %{
        operating_system:
          fragment("if(empty(?), ?, ?)", s.operating_system, @not_set, s.operating_system)
      },
      order_by: {:asc, s.operating_system}
    )
  end

  defp do_group_by(q, "visit:os_version") do
    from(
      s in q,
      group_by: s.operating_system_version,
      select_merge: %{
        os_version:
          fragment(
            "if(empty(?), ?, ?)",
            s.operating_system_version,
            @not_set,
            s.operating_system_version
          )
      },
      order_by: {:asc, s.operating_system_version}
    )
  end

  defp do_group_by(q, "visit:browser") do
    from(
      s in q,
      group_by: s.browser,
      select_merge: %{
        browser: fragment("if(empty(?), ?, ?)", s.browser, @not_set, s.browser)
      },
      order_by: {:asc, s.browser}
    )
  end

  defp do_group_by(q, "visit:browser_version") do
    from(
      s in q,
      group_by: [s.browser, s.browser_version],
      select_merge: %{
        browser: fragment("if(empty(?), ?, ?)", s.browser, @not_set, s.browser),
        browser_version:
          fragment("if(empty(?), ?, ?)", s.browser_version, @not_set, s.browser_version)
      },
      order_by: {:asc, s.browser_version}
    )
  end

  defp sorting_key(metrics) do
    if Enum.member?(metrics, :visitors), do: :visitors, else: List.first(metrics)
  end

  defp transform_keys(results, keys_to_replace) do
    Enum.map(results, fn map ->
      Enum.map(map, fn {key, val} ->
        {Map.get(keys_to_replace, key, key), val}
      end)
      |> Enum.into(%{})
    end)
  end

  defp apply_pagination(q, {limit, page}) do
    offset = (page - 1) * limit

    q
    |> Ecto.Query.limit(^limit)
    |> Ecto.Query.offset(^offset)
  end

  defp trace(query, property, metrics) do
    Query.trace(query, metrics)

    Tracer.set_attributes([
      {"plausible.query.breakdown_property", property}
    ])
  end

  on_full_build do
    defp cast_revenue_metrics_to_money(results, revenue_goals) do
      Plausible.Stats.Goal.Revenue.cast_revenue_metrics_to_money(results, revenue_goals)
    end
  else
    defp cast_revenue_metrics_to_money(results, _revenue_goals), do: results
  end
end
