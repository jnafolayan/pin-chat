!function(e){var t={};function n(o){if(t[o])return t[o].exports;var r=t[o]={i:o,l:!1,exports:{}};return e[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)n.d(o,r,function(t){return e[t]}.bind(null,r));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t){!function(){document.addEventListener("DOMContentLoaded",function(){document.querySelector("#loginForm").addEventListener("submit",()=>{const n=document.querySelector("#username");c=n.value,e.classList.remove("active"),t.classList.add("active"),l(()=>d({broadcast:!0,type:"join",data:{username:c}}))}),r.addEventListener("keypress",function(e){const t=this.value;"enter"===e.key.toLowerCase()&&(this.value="",l(()=>d({broadcast:!0,type:"msg",data:{username:c,msg:t}})))}),function(){if(!WebSocket)return;(u=new WebSocket("ws://localhost:8080")).onopen=function(){s=!0,a.forEach(e=>e()),console.log("Opened...")},u.onclose=function(){s=!1},u.onmessage=function({data:e}){const{type:t,data:o}=JSON.parse(e);"join"===t?(i(`${o.username===c?"You":o.username} joined the chat.`,"cpu"),n.innerHTML=o.count):"msg"===t&&i(o.msg,o.username);console.log(e)}}()},!1);const e=document.querySelector(".login"),t=document.querySelector(".room"),n=document.querySelector(".clients-count"),o=document.querySelector(".messages"),r=document.querySelector("#userMsg");let u,c="",s=!1;const a=[];function i(e,t){const n=t===c?"own":"cpu"===t?"cpu":"other";o.innerHTML+=`\n\t\t\t<div class="msg ${n}">\n\t\t\t\t${"cpu"!==t?'<span class="by">'+t+"</span>":""}\n\t\t\t\t<span class="body">${e}</span>\n\t\t\t</div>\n\t\t`}function l(e){s?e():a.push(e)}function d(e){u.send(JSON.stringify(e))}}()}]);