!function(){"use strict";var t,e,a,p=window.location,d=window.document,f=d.getElementById("plausible"),g=f.getAttribute("data-api")||(t=f.src.split("/"),e=t[0],a=t[2],e+"//"+a+"/api/event");function v(t){console.warn("Ignoring Event: "+t)}function n(t,e){if(/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(p.hostname)||"file:"===p.protocol)return v("localhost");if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return v("localStorage flag")}catch(t){}var a=f&&f.getAttribute("data-include"),n=f&&f.getAttribute("data-exclude");if("pageview"===t){var r=!a||a&&a.split(",").some(s),i=n&&n.split(",").some(s);if(!r||i)return v("exclusion rule")}var o={};o.n=t,o.u=e&&e.u?e.u:p.href,o.d=f.getAttribute("data-domain"),o.r=d.referrer||null,o.w=window.innerWidth,e&&e.meta&&(o.m=JSON.stringify(e.meta)),e&&e.props&&(o.p=e.props);var u=f.getAttributeNames().filter(function(t){return"event-"===t.substring(0,6)}),l=o.p||{};u.forEach(function(t){var e=t.replace("event-",""),a=f.getAttribute(t);l[e]=l[e]||a}),o.p=l;var c=new XMLHttpRequest;c.open("POST",g,!0),c.setRequestHeader("Content-Type","text/plain"),c.send(JSON.stringify(o)),c.onreadystatechange=function(){4===c.readyState&&e&&e.callback&&e.callback()}}function s(t){return p.pathname.match(new RegExp("^"+t.trim().replace(/\*\*/g,".*").replace(/([^\.])\*/g,"$1[^\\s/]*")+"/?$"))}}function r(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,n="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;e&&e.href&&e.getAttribute("data-event-name")&&((a||n)&&i(e),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!n||(setTimeout(function(){p.href=e.href},150),t.preventDefault()))}function i(t){var e=t.getAttribute("data-event-name"),a=function(t){for(var e={},a=0;a<t.length;a++){var n,r=t[a].name;"data-event-"===r.substring(0,11)&&"data-event-name"!==r&&(n=r.replace("data-event-",""),e[n]=t[a].value)}return e}(t.attributes);t.href&&(a.url=t.href),plausible(e,{props:a})}d.addEventListener("submit",function(t){t.target.getAttribute("data-event-name")&&(t.preventDefault(),i(t.target),setTimeout(function(){t.target.submit()},150))}),d.addEventListener("click",r),d.addEventListener("auxclick",r);var o=window.plausible&&window.plausible.q||[];window.plausible=n;for(var u=0;u<o.length;u++)n.apply(this,o[u])}();