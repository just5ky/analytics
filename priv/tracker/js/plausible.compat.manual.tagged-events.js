!function(){"use strict";var t,e,a,r=window.location,i=window.document,o=i.getElementById("plausible"),l=o.getAttribute("data-api")||(t=o.src.split("/"),e=t[0],a=t[2],e+"//"+a+"/api/event");function u(t){console.warn("Ignoring Event: "+t)}function n(t,e){if(/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(r.hostname)||"file:"===r.protocol)return u("localhost");if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return u("localStorage flag")}catch(t){}var a={};a.n=t,a.u=e&&e.u?e.u:r.href,a.d=o.getAttribute("data-domain"),a.r=i.referrer||null,a.w=window.innerWidth,e&&e.meta&&(a.m=JSON.stringify(e.meta)),e&&e.props&&(a.p=e.props);var n=new XMLHttpRequest;n.open("POST",l,!0),n.setRequestHeader("Content-Type","text/plain"),n.send(JSON.stringify(a)),n.onreadystatechange=function(){4===n.readyState&&e&&e.callback&&e.callback()}}}function s(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,n="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;e&&e.href&&e.getAttribute("data-event-name")&&((a||n)&&c(e),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!n||(setTimeout(function(){r.href=e.href},150),t.preventDefault()))}function c(t){var e=t.getAttribute("data-event-name"),a=function(t){for(var e={},a=0;a<t.length;a++){var n,r=t[a].name;"data-event-"===r.substring(0,11)&&"data-event-name"!==r&&(n=r.replace("data-event-",""),e[n]=t[a].value)}return e}(t.attributes);t.href&&(a.url=t.href),plausible(e,{props:a})}i.addEventListener("submit",function(t){t.target.getAttribute("data-event-name")&&(t.preventDefault(),c(t.target),setTimeout(function(){t.target.submit()},150))}),i.addEventListener("click",s),i.addEventListener("auxclick",s);var d=window.plausible&&window.plausible.q||[];window.plausible=n;for(var p=0;p<d.length;p++)n.apply(this,d[p])}();