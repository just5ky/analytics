!function(){"use strict";var s=window.location,g=window.document,d=g.currentScript,w=d.getAttribute("data-api")||new URL(d.src).origin+"/api/event";function f(e){console.warn("Ignoring Event: "+e)}function e(e,t){try{if("true"===window.localStorage.plausible_ignore)return f("localStorage flag")}catch(e){}var n=d&&d.getAttribute("data-include"),r=d&&d.getAttribute("data-exclude");if("pageview"===e){var a=!n||n&&n.split(",").some(o),i=r&&r.split(",").some(o);if(!a||i)return f("exclusion rule")}function o(e){return s.pathname.match(new RegExp("^"+e.trim().replace(/\*\*/g,".*").replace(/([^\.])\*/g,"$1[^\\s/]*")+"/?$"))}var u={};u.n=e,u.u=t&&t.u?t.u:s.href,u.d=d.getAttribute("data-domain"),u.r=g.referrer||null,u.w=window.innerWidth,t&&t.meta&&(u.m=JSON.stringify(t.meta)),t&&t.props&&(u.p=t.props);var l=d.getAttributeNames().filter(function(e){return"event-"===e.substring(0,6)}),c=u.p||{};l.forEach(function(e){var t=e.replace("event-",""),n=d.getAttribute(e);c[t]=c[t]||n}),u.p=c,u.h=1;var p=new XMLHttpRequest;p.open("POST",w,!0),p.setRequestHeader("Content-Type","text/plain"),p.send(JSON.stringify(u)),p.onreadystatechange=function(){4===p.readyState&&t&&t.callback&&t.callback()}}var t=window.plausible&&window.plausible.q||[];window.plausible=e;for(var n=0;n<t.length;n++)e.apply(this,t[n])}();