!function(){"use strict";var e,t,a,s=window.location,c=window.document,d=c.getElementById("plausible"),p=d.getAttribute("data-api")||(e=d.src.split("/"),t=e[0],a=e[2],t+"//"+a+"/api/event");function f(e){console.warn("Ignoring Event: "+e)}function n(e,t){if(/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(s.hostname)||"file:"===s.protocol)return f("localhost");if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return f("localStorage flag")}catch(e){}var a=d&&d.getAttribute("data-include"),n=d&&d.getAttribute("data-exclude");if("pageview"===e){var r=!a||a&&a.split(",").some(u),i=n&&n.split(",").some(u);if(!r||i)return f("exclusion rule")}var o={};o.n=e,o.u=t&&t.u?t.u:s.href,o.d=d.getAttribute("data-domain"),o.r=c.referrer||null,o.w=window.innerWidth,t&&t.meta&&(o.m=JSON.stringify(t.meta)),t&&t.props&&(o.p=t.props),o.h=1;var l=new XMLHttpRequest;l.open("POST",p,!0),l.setRequestHeader("Content-Type","text/plain"),l.send(JSON.stringify(o)),l.onreadystatechange=function(){4===l.readyState&&t&&t.callback&&t.callback()}}function u(e){return s.pathname.match(new RegExp("^"+e.trim().replace(/\*\*/g,".*").replace(/([^\.])\*/g,"$1[^\\s/]*")+"/?$"))}}function r(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,n="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;t&&t.href&&t.getAttribute("data-event-name")&&((a||n)&&i(t),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!n||(setTimeout(function(){s.href=t.href},150),e.preventDefault()))}function i(e){var t=e.getAttribute("data-event-name"),a=function(e){for(var t={},a=0;a<e.length;a++){var n,r=e[a].name;"data-event-"===r.substring(0,11)&&"data-event-name"!==r&&(n=r.replace("data-event-",""),t[n]=e[a].value)}return t}(e.attributes);e.href&&(a.url=e.href),plausible(t,{props:a})}c.addEventListener("submit",function(e){e.target.getAttribute("data-event-name")&&(e.preventDefault(),i(e.target),setTimeout(function(){e.target.submit()},150))}),c.addEventListener("click",r),c.addEventListener("auxclick",r);var o=window.plausible&&window.plausible.q||[];window.plausible=n;for(var l=0;l<o.length;l++)n.apply(this,o[l])}();