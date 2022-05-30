!function(){"use strict";var s=window.location,f=window.document,d=f.currentScript,g=d.getAttribute("data-api")||new URL(d.src).origin+"/api/event";function v(t){console.warn("Ignoring Event: "+t)}function t(t,e){if(/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(s.hostname)||"file:"===s.protocol)return v("localhost");if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return v("localStorage flag")}catch(t){}var a=d&&d.getAttribute("data-include"),r=d&&d.getAttribute("data-exclude");if("pageview"===t){var i=!a||a&&a.split(",").some(p),n=r&&r.split(",").some(p);if(!i||n)return v("exclusion rule")}var o={};o.n=t,o.u=e&&e.u?e.u:s.href,o.d=d.getAttribute("data-domain"),o.r=f.referrer||null,o.w=window.innerWidth,e&&e.meta&&(o.m=JSON.stringify(e.meta)),e&&e.props&&(o.p=e.props);var c=d.getAttributeNames().filter(function(t){return"event-"===t.substring(0,6)}),l=o.p||{};c.forEach(function(t){var e=t.replace("event-",""),a=d.getAttribute(t);l[e]=l[e]||a}),o.p=l,o.h=1;var u=new XMLHttpRequest;u.open("POST",g,!0),u.setRequestHeader("Content-Type","text/plain"),u.send(JSON.stringify(o)),u.onreadystatechange=function(){4===u.readyState&&e&&e.callback&&e.callback()}}function p(t){return s.pathname.match(new RegExp("^"+t.trim().replace(/\*\*/g,".*").replace(/([^\.])\*/g,"$1[^\\s/]*")+"/?$"))}}function e(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,r="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;e&&e.href&&e.host&&e.host!==s.host&&((a||r)&&plausible("Outbound Link: Click",{props:{url:e.href}}),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!r||(setTimeout(function(){s.href=e.href},150),t.preventDefault()))}f.addEventListener("click",e),f.addEventListener("auxclick",e);var a=["pdf","xlsx","docx","txt","rtf","csv","exe","key","pps","ppt","pptx","7z","pkg","rar","gz","zip","avi","mov","mp4","mpeg","wmv","midi","mp3","wav","wma"],r=d.getAttribute("file-types"),i=d.getAttribute("add-file-types"),o=r&&r.split(",")||i&&i.split(",").concat(a)||a;function n(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,r="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;var i,n=e&&e.href&&e.href.split("?")[0];n&&(i=n.split(".").pop(),o.some(function(t){return t===i}))&&((a||r)&&plausible("File Download",{props:{url:n}}),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!r||(setTimeout(function(){s.href=e.href},150),t.preventDefault()))}function c(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,r="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;e&&e.href&&e.getAttribute("data-event-name")&&((a||r)&&l(e),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!r||(setTimeout(function(){s.href=e.href},150),t.preventDefault()))}function l(t){var e=t.getAttribute("data-event-name"),a=function(t){for(var e={},a=0;a<t.length;a++){var r,i=t[a].name;"data-event-"===i.substring(0,11)&&"data-event-name"!==i&&(r=i.replace("data-event-",""),e[r]=t[a].value)}return e}(t.attributes);t.href&&(a.url=t.href),plausible(e,{props:a})}f.addEventListener("click",n),f.addEventListener("auxclick",n),f.addEventListener("submit",function(t){t.target.getAttribute("data-event-name")&&(t.preventDefault(),l(t.target),setTimeout(function(){t.target.submit()},150))}),f.addEventListener("click",c),f.addEventListener("auxclick",c);var u=window.plausible&&window.plausible.q||[];window.plausible=t;for(var p=0;p<u.length;p++)t.apply(this,u[p])}();