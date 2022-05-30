!function(){"use strict";var e,t,a,o=window.location,l=window.document,p=l.getElementById("plausible"),s=p.getAttribute("data-api")||(e=p.src.split("/"),t=e[0],a=e[2],t+"//"+a+"/api/event");function i(e,t){if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return void console.warn("Ignoring Event: localStorage flag")}catch(e){}var a={};a.n=e,a.u=o.href,a.d=p.getAttribute("data-domain"),a.r=l.referrer||null,a.w=window.innerWidth,t&&t.meta&&(a.m=JSON.stringify(t.meta)),t&&t.props&&(a.p=t.props);var i=p.getAttributeNames().filter(function(e){return"event-"===e.substring(0,6)}),n=a.p||{};i.forEach(function(e){var t=e.replace("event-",""),a=p.getAttribute(e);n[t]=n[t]||a}),a.p=n,a.h=1;var r=new XMLHttpRequest;r.open("POST",s,!0),r.setRequestHeader("Content-Type","text/plain"),r.send(JSON.stringify(a)),r.onreadystatechange=function(){4===r.readyState&&t&&t.callback&&t.callback()}}}var n=["pdf","xlsx","docx","txt","rtf","csv","exe","key","pps","ppt","pptx","7z","pkg","rar","gz","zip","avi","mov","mp4","mpeg","wmv","midi","mp3","wav","wma"],r=p.getAttribute("file-types"),c=p.getAttribute("add-file-types"),u=r&&r.split(",")||c&&c.split(",").concat(n)||n;function d(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,i="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;var n,r=t&&t.href&&t.href.split("?")[0];r&&(n=r.split(".").pop(),u.some(function(e){return e===n}))&&((a||i)&&plausible("File Download",{props:{url:r}}),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!i||(setTimeout(function(){o.href=t.href},150),e.preventDefault()))}function f(e){for(var t=e.target,a="auxclick"===e.type&&2===e.which,i="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;t&&t.href&&t.getAttribute("data-event-name")&&((a||i)&&v(t),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!i||(setTimeout(function(){o.href=t.href},150),e.preventDefault()))}function v(e){var t=e.getAttribute("data-event-name"),a=function(e){for(var t={},a=0;a<e.length;a++){var i,n=e[a].name;"data-event-"===n.substring(0,11)&&"data-event-name"!==n&&(i=n.replace("data-event-",""),t[i]=e[a].value)}return t}(e.attributes);e.href&&(a.url=e.href),plausible(t,{props:a})}l.addEventListener("click",d),l.addEventListener("auxclick",d),l.addEventListener("submit",function(e){e.target.getAttribute("data-event-name")&&(e.preventDefault(),v(e.target),setTimeout(function(){e.target.submit()},150))}),l.addEventListener("click",f),l.addEventListener("auxclick",f);var g=window.plausible&&window.plausible.q||[];window.plausible=i;for(var w,m=0;m<g.length;m++)i.apply(this,g[m]);function h(){w=o.pathname,i("pageview")}window.addEventListener("hashchange",h),"prerender"===l.visibilityState?l.addEventListener("visibilitychange",function(){w||"visible"!==l.visibilityState||h()}):h()}();