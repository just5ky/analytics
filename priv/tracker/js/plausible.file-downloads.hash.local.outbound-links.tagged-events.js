!function(){"use strict";var o=window.location,r=window.document,n=r.currentScript,c=n.getAttribute("data-api")||new URL(n.src).origin+"/api/event";function e(e,t){if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return void console.warn("Ignoring Event: localStorage flag")}catch(e){}var a={};a.n=e,a.u=o.href,a.d=n.getAttribute("data-domain"),a.r=r.referrer||null,a.w=window.innerWidth,t&&t.meta&&(a.m=JSON.stringify(t.meta)),t&&t.props&&(a.p=t.props),a.h=1;var i=new XMLHttpRequest;i.open("POST",c,!0),i.setRequestHeader("Content-Type","text/plain"),i.send(JSON.stringify(a)),i.onreadystatechange=function(){4===i.readyState&&t&&t.callback&&t.callback()}}}function t(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,i="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;t&&t.href&&t.host&&t.host!==o.host&&((a||i)&&plausible("Outbound Link: Click",{props:{url:t.href}}),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!i||(setTimeout(function(){o.href=t.href},150),e.preventDefault()))}r.addEventListener("click",t),r.addEventListener("auxclick",t);var a=["pdf","xlsx","docx","txt","rtf","csv","exe","key","pps","ppt","pptx","7z","pkg","rar","gz","zip","avi","mov","mp4","mpeg","wmv","midi","mp3","wav","wma"],i=n.getAttribute("file-types"),l=n.getAttribute("add-file-types"),p=i&&i.split(",")||l&&l.split(",").concat(a)||a;function s(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,i="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;var r,n=t&&t.href&&t.href.split("?")[0];n&&(r=n.split(".").pop(),p.some(function(e){return e===r}))&&((a||i)&&plausible("File Download",{props:{url:n}}),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!i||(setTimeout(function(){o.href=t.href},150),e.preventDefault()))}function u(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,i="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;t&&t.href&&t.getAttribute("data-event-name")&&((a||i)&&d(t),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!i||(setTimeout(function(){o.href=t.href},150),e.preventDefault()))}function d(e){var t=e.getAttribute("data-event-name"),a=function(e){for(var t={},a=0;a<e.length;a++){var i,r=e[a].name;"data-event-"===r.substring(0,11)&&"data-event-name"!==r&&(i=r.replace("data-event-",""),t[i]=e[a].value)}return t}(e.attributes);e.href&&(a.url=e.href),plausible(t,{props:a})}r.addEventListener("click",s),r.addEventListener("auxclick",s),r.addEventListener("submit",function(e){e.target.getAttribute("data-event-name")&&(e.preventDefault(),d(e.target),setTimeout(function(){e.target.submit()},150))}),r.addEventListener("click",u),r.addEventListener("auxclick",u);var f=window.plausible&&window.plausible.q||[];window.plausible=e;for(var v,g=0;g<f.length;g++)e.apply(this,f[g]);function h(){v=o.pathname,e("pageview")}window.addEventListener("hashchange",h),"prerender"===r.visibilityState?r.addEventListener("visibilitychange",function(){v||"visible"!==r.visibilityState||h()}):h()}();