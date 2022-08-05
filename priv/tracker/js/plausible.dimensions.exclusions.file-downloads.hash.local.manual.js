!function(){"use strict";var s=window.location,f=window.document,d=f.currentScript,g=d.getAttribute("data-api")||new URL(d.src).origin+"/api/event";function v(e){console.warn("Ignoring Event: "+e)}function e(e,t){try{if("true"===window.localStorage.plausible_ignore)return v("localStorage flag")}catch(e){}var r=d&&d.getAttribute("data-include"),a=d&&d.getAttribute("data-exclude");if("pageview"===e){var i=!r||r&&r.split(",").some(p),n=a&&a.split(",").some(p);if(!i||n)return v("exclusion rule")}function p(e){return s.pathname.match(new RegExp("^"+e.trim().replace(/\*\*/g,".*").replace(/([^\.])\*/g,"$1[^\\s/]*")+"/?$"))}var o={};o.n=e,o.u=t&&t.u?t.u:s.href,o.d=d.getAttribute("data-domain"),o.r=f.referrer||null,o.w=window.innerWidth,t&&t.meta&&(o.m=JSON.stringify(t.meta)),t&&t.props&&(o.p=t.props);var l=d.getAttributeNames().filter(function(e){return"event-"===e.substring(0,6)}),c=o.p||{};l.forEach(function(e){var t=e.replace("event-",""),r=d.getAttribute(e);c[t]=c[t]||r}),o.p=c,o.h=1;var u=new XMLHttpRequest;u.open("POST",g,!0),u.setRequestHeader("Content-Type","text/plain"),u.send(JSON.stringify(o)),u.onreadystatechange=function(){4===u.readyState&&t&&t.callback&&t.callback()}}var t=["pdf","xlsx","docx","txt","rtf","csv","exe","key","pps","ppt","pptx","7z","pkg","rar","gz","zip","avi","mov","mp4","mpeg","wmv","midi","mp3","wav","wma"],r=d.getAttribute("file-types"),a=d.getAttribute("add-file-types"),p=r&&r.split(",")||a&&a.split(",").concat(t)||t;function i(e){for(var t=e.target,r="auxclick"===e.type&&2===e.which,a="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;var i,n=t&&t.href&&t.href.split("?")[0];n&&(i=n.split(".").pop(),p.some(function(e){return e===i}))&&((r||a)&&plausible("File Download",{props:{url:n}}),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!a||(setTimeout(function(){s.href=t.href},150),e.preventDefault()))}f.addEventListener("click",i),f.addEventListener("auxclick",i);var n=window.plausible&&window.plausible.q||[];window.plausible=e;for(var o=0;o<n.length;o++)e.apply(this,n[o])}();