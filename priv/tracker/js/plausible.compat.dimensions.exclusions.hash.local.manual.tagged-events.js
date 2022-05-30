!function(){"use strict";var e,t,a,p=window.location,d=window.document,f=d.getElementById("plausible"),g=f.getAttribute("data-api")||(e=f.src.split("/"),t=e[0],a=e[2],t+"//"+a+"/api/event");function v(e){console.warn("Ignoring Event: "+e)}function n(e,t){if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return v("localStorage flag")}catch(e){}var a=f&&f.getAttribute("data-include"),n=f&&f.getAttribute("data-exclude");if("pageview"===e){var r=!a||a&&a.split(",").some(s),i=n&&n.split(",").some(s);if(!r||i)return v("exclusion rule")}var u={};u.n=e,u.u=t&&t.u?t.u:p.href,u.d=f.getAttribute("data-domain"),u.r=d.referrer||null,u.w=window.innerWidth,t&&t.meta&&(u.m=JSON.stringify(t.meta)),t&&t.props&&(u.p=t.props);var o=f.getAttributeNames().filter(function(e){return"event-"===e.substring(0,6)}),l=u.p||{};o.forEach(function(e){var t=e.replace("event-",""),a=f.getAttribute(e);l[t]=l[t]||a}),u.p=l,u.h=1;var c=new XMLHttpRequest;c.open("POST",g,!0),c.setRequestHeader("Content-Type","text/plain"),c.send(JSON.stringify(u)),c.onreadystatechange=function(){4===c.readyState&&t&&t.callback&&t.callback()}}function s(e){return p.pathname.match(new RegExp("^"+e.trim().replace(/\*\*/g,".*").replace(/([^\.])\*/g,"$1[^\\s/]*")+"/?$"))}}function r(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,n="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;t&&t.href&&t.getAttribute("data-event-name")&&((a||n)&&i(t),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!n||(setTimeout(function(){p.href=t.href},150),e.preventDefault()))}function i(e){var t=e.getAttribute("data-event-name"),a=function(e){for(var t={},a=0;a<e.length;a++){var n,r=e[a].name;"data-event-"===r.substring(0,11)&&"data-event-name"!==r&&(n=r.replace("data-event-",""),t[n]=e[a].value)}return t}(e.attributes);e.href&&(a.url=e.href),plausible(t,{props:a})}d.addEventListener("submit",function(e){e.target.getAttribute("data-event-name")&&(e.preventDefault(),i(e.target),setTimeout(function(){e.target.submit()},150))}),d.addEventListener("click",r),d.addEventListener("auxclick",r);var u=window.plausible&&window.plausible.q||[];window.plausible=n;for(var o=0;o<u.length;o++)n.apply(this,u[o])}();