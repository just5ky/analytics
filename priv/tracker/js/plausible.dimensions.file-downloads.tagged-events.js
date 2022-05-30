!function(){"use strict";var o=window.location,p=window.document,s=p.currentScript,l=s.getAttribute("data-api")||new URL(s.src).origin+"/api/event";function c(t){console.warn("Ignoring Event: "+t)}function t(t,e){if(/^localhost$|^127(\.[0-9]+){0,2}\.[0-9]+$|^\[::1?\]$/.test(o.hostname)||"file:"===o.protocol)return c("localhost");if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return c("localStorage flag")}catch(t){}var a={};a.n=t,a.u=o.href,a.d=s.getAttribute("data-domain"),a.r=p.referrer||null,a.w=window.innerWidth,e&&e.meta&&(a.m=JSON.stringify(e.meta)),e&&e.props&&(a.p=e.props);var i=s.getAttributeNames().filter(function(t){return"event-"===t.substring(0,6)}),n=a.p||{};i.forEach(function(t){var e=t.replace("event-",""),a=s.getAttribute(t);n[e]=n[e]||a}),a.p=n;var r=new XMLHttpRequest;r.open("POST",l,!0),r.setRequestHeader("Content-Type","text/plain"),r.send(JSON.stringify(a)),r.onreadystatechange=function(){4===r.readyState&&e&&e.callback&&e.callback()}}}var e=["pdf","xlsx","docx","txt","rtf","csv","exe","key","pps","ppt","pptx","7z","pkg","rar","gz","zip","avi","mov","mp4","mpeg","wmv","midi","mp3","wav","wma"],a=s.getAttribute("file-types"),i=s.getAttribute("add-file-types"),u=a&&a.split(",")||i&&i.split(",").concat(e)||e;function n(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,i="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;var n,r=e&&e.href&&e.href.split("?")[0];r&&(n=r.split(".").pop(),u.some(function(t){return t===n}))&&((a||i)&&plausible("File Download",{props:{url:r}}),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!i||(setTimeout(function(){o.href=e.href},150),t.preventDefault()))}function r(t){for(var e=t.target,a="auxclick"===t.type&&2===t.which,i="click"===t.type;e&&(void 0===e.tagName||"a"!==e.tagName.toLowerCase()||!e.href);)e=e.parentNode;e&&e.href&&e.getAttribute("data-event-name")&&((a||i)&&d(e),e.target&&!e.target.match(/^_(self|parent|top)$/i)||t.ctrlKey||t.metaKey||t.shiftKey||!i||(setTimeout(function(){o.href=e.href},150),t.preventDefault()))}function d(t){var e=t.getAttribute("data-event-name"),a=function(t){for(var e={},a=0;a<t.length;a++){var i,n=t[a].name;"data-event-"===n.substring(0,11)&&"data-event-name"!==n&&(i=n.replace("data-event-",""),e[i]=t[a].value)}return e}(t.attributes);t.href&&(a.url=t.href),plausible(e,{props:a})}p.addEventListener("click",n),p.addEventListener("auxclick",n),p.addEventListener("submit",function(t){t.target.getAttribute("data-event-name")&&(t.preventDefault(),d(t.target),setTimeout(function(){t.target.submit()},150))}),p.addEventListener("click",r),p.addEventListener("auxclick",r);var f=window.plausible&&window.plausible.q||[];window.plausible=t;for(var v,g=0;g<f.length;g++)t.apply(this,f[g]);function h(){v!==o.pathname&&(v=o.pathname,t("pageview"))}var w,m=window.history;m.pushState&&(w=m.pushState,m.pushState=function(){w.apply(this,arguments),h()},window.addEventListener("popstate",h)),"prerender"===p.visibilityState?p.addEventListener("visibilitychange",function(){v||"visible"!==p.visibilityState||h()}):h()}();