!function(){"use strict";var o=window.location,p=window.document,l=p.currentScript,c=l.getAttribute("data-api")||new URL(l.src).origin+"/api/event";function t(t,e){try{if("true"===window.localStorage.plausible_ignore)return void console.warn("Ignoring Event: localStorage flag")}catch(t){}var r={};r.n=t,r.u=e&&e.u?e.u:o.href,r.d=l.getAttribute("data-domain"),r.r=p.referrer||null,r.w=window.innerWidth,e&&e.meta&&(r.m=JSON.stringify(e.meta)),e&&e.props&&(r.p=e.props);var a=l.getAttributeNames().filter(function(t){return"event-"===t.substring(0,6)}),i=r.p||{};a.forEach(function(t){var e=t.replace("event-",""),r=l.getAttribute(t);i[e]=i[e]||r}),r.p=i;var n=new XMLHttpRequest;n.open("POST",c,!0),n.setRequestHeader("Content-Type","text/plain"),n.send(JSON.stringify(r)),n.onreadystatechange=function(){4===n.readyState&&e&&e.callback&&e.callback()}}function e(t){for(var e=t.target,r="auxclick"===t.type&&2===t.which,a="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;e&&e.href&&e.host&&e.host!==o.host&&((r||a)&&plausible("Outbound Link: Click",{props:{url:e.href}}),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!a||(setTimeout(function(){o.href=e.href},150),t.preventDefault()))}p.addEventListener("click",e),p.addEventListener("auxclick",e);var r=["pdf","xlsx","docx","txt","rtf","csv","exe","key","pps","ppt","pptx","7z","pkg","rar","gz","zip","avi","mov","mp4","mpeg","wmv","midi","mp3","wav","wma"],a=l.getAttribute("file-types"),i=l.getAttribute("add-file-types"),s=a&&a.split(",")||i&&i.split(",").concat(r)||r;function n(t){for(var e=t.target,r="auxclick"===t.type&&2===t.which,a="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;var i,n=e&&e.href&&e.href.split("?")[0];n&&(i=n.split(".").pop(),s.some(function(t){return t===i}))&&((r||a)&&plausible("File Download",{props:{url:n}}),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!a||(setTimeout(function(){o.href=e.href},150),t.preventDefault()))}p.addEventListener("click",n),p.addEventListener("auxclick",n);var u=window.plausible&&window.plausible.q||[];window.plausible=t;for(var f=0;f<u.length;f++)t.apply(this,u[f])}();