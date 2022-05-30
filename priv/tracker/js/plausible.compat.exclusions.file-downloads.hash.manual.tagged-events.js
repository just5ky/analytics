!function(){"use strict";var e,t,a,u=window.location,s=window.document,c=s.getElementById("plausible"),d=c.getAttribute("data-api")||(e=c.src.split("/"),t=e[0],a=e[2],t+"//"+a+"/api/event");function f(e){console.warn("Ignoring Event: "+e)}function r(e,t){if(/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(u.hostname)||"file:"===u.protocol)return f("localhost");if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return f("localStorage flag")}catch(e){}var a=c&&c.getAttribute("data-include"),r=c&&c.getAttribute("data-exclude");if("pageview"===e){var i=!a||a&&a.split(",").some(p),n=r&&r.split(",").some(p);if(!i||n)return f("exclusion rule")}var o={};o.n=e,o.u=t&&t.u?t.u:u.href,o.d=c.getAttribute("data-domain"),o.r=s.referrer||null,o.w=window.innerWidth,t&&t.meta&&(o.m=JSON.stringify(t.meta)),t&&t.props&&(o.p=t.props),o.h=1;var l=new XMLHttpRequest;l.open("POST",d,!0),l.setRequestHeader("Content-Type","text/plain"),l.send(JSON.stringify(o)),l.onreadystatechange=function(){4===l.readyState&&t&&t.callback&&t.callback()}}function p(e){return u.pathname.match(new RegExp("^"+e.trim().replace(/\*\*/g,".*").replace(/([^\.])\*/g,"$1[^\\s/]*")+"/?$"))}}var i=["pdf","xlsx","docx","txt","rtf","csv","exe","key","pps","ppt","pptx","7z","pkg","rar","gz","zip","avi","mov","mp4","mpeg","wmv","midi","mp3","wav","wma"],n=c.getAttribute("file-types"),o=c.getAttribute("add-file-types"),l=n&&n.split(",")||o&&o.split(",").concat(i)||i;function p(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,r="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;var i,n=t&&t.href&&t.href.split("?")[0];n&&(i=n.split(".").pop(),l.some(function(e){return e===i}))&&((a||r)&&plausible("File Download",{props:{url:n}}),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!r||(setTimeout(function(){u.href=t.href},150),e.preventDefault()))}function g(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,r="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;t&&t.href&&t.getAttribute("data-event-name")&&((a||r)&&v(t),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!r||(setTimeout(function(){u.href=t.href},150),e.preventDefault()))}function v(e){var t=e.getAttribute("data-event-name"),a=function(e){for(var t={},a=0;a<e.length;a++){var r,i=e[a].name;"data-event-"===i.substring(0,11)&&"data-event-name"!==i&&(r=i.replace("data-event-",""),t[r]=e[a].value)}return t}(e.attributes);e.href&&(a.url=e.href),plausible(t,{props:a})}s.addEventListener("click",p),s.addEventListener("auxclick",p),s.addEventListener("submit",function(e){e.target.getAttribute("data-event-name")&&(e.preventDefault(),v(e.target),setTimeout(function(){e.target.submit()},150))}),s.addEventListener("click",g),s.addEventListener("auxclick",g);var m=window.plausible&&window.plausible.q||[];window.plausible=r;for(var w=0;w<m.length;w++)r.apply(this,m[w])}();