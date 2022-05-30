!function(){"use strict";var o=window.location,u=window.document,c=u.currentScript,s=c.getAttribute("data-api")||new URL(c.src).origin+"/api/event";function e(e,t){if(!(window._phantom||window.__nightmare||window.navigator.webdriver||window.Cypress)){try{if("true"===window.localStorage.plausible_ignore)return void console.warn("Ignoring Event: localStorage flag")}catch(e){}var n={};n.n=e,n.u=o.href,n.d=c.getAttribute("data-domain"),n.r=u.referrer||null,n.w=window.innerWidth,t&&t.meta&&(n.m=JSON.stringify(t.meta)),t&&t.props&&(n.p=t.props);var a=c.getAttributeNames().filter(function(e){return"event-"===e.substring(0,6)}),i=n.p||{};a.forEach(function(e){var t=e.replace("event-",""),n=c.getAttribute(e);i[t]=i[t]||n}),n.p=i,n.h=1;var r=new XMLHttpRequest;r.open("POST",s,!0),r.setRequestHeader("Content-Type","text/plain"),r.send(JSON.stringify(n)),r.onreadystatechange=function(){4===r.readyState&&t&&t.callback&&t.callback()}}}function t(e){for(var t=e.target,n="auxclick"===e.type&&2===e.which,a="click"===e.type;t&&(void 0===t.tagName||"a"!==t.tagName.toLowerCase()||!t.href);)t=t.parentNode;t&&t.href&&t.getAttribute("data-event-name")&&((n||a)&&i(t),t.target&&!t.target.match(/^_(self|parent|top)$/i)||e.ctrlKey||e.metaKey||e.shiftKey||!a||(setTimeout(function(){o.href=t.href},150),e.preventDefault()))}function i(e){var t=e.getAttribute("data-event-name"),n=function(e){for(var t={},n=0;n<e.length;n++){var a,i=e[n].name;"data-event-"===i.substring(0,11)&&"data-event-name"!==i&&(a=i.replace("data-event-",""),t[a]=e[n].value)}return t}(e.attributes);e.href&&(n.url=e.href),plausible(t,{props:n})}u.addEventListener("submit",function(e){e.target.getAttribute("data-event-name")&&(e.preventDefault(),i(e.target),setTimeout(function(){e.target.submit()},150))}),u.addEventListener("click",t),u.addEventListener("auxclick",t);var n=window.plausible&&window.plausible.q||[];window.plausible=e;for(var a,r=0;r<n.length;r++)e.apply(this,n[r]);function l(){a=o.pathname,e("pageview")}window.addEventListener("hashchange",l),"prerender"===u.visibilityState?u.addEventListener("visibilitychange",function(){a||"visible"!==u.visibilityState||l()}):l()}();