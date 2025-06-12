//
{let e,t,r,o,n,l,s,f,i,h,w,a,d,u,_,c,S,g,y,b,m,v,j,x,O,V;s=Object.getPrototypeOf,i={},h=s(f={isConnected:1}),w=s(s),a=(e,t,r,o)=>(e??(setTimeout(r,o),new Set)).add(t),d=(e,t,o)=>{let n=r;r=t;try{return e(o)}catch(e){return console.error(e),o}finally{r=n}},u=e=>e.filter(e=>e.t?.isConnected),_=e=>n=a(n,e,()=>{for(let e of n)e.o=u(e.o),e.l=u(e.l);n=l},1e3),c={get val(){return r?.i?.add(this),this.rawVal},get oldVal(){return r?.i?.add(this),this.h},set val(o){r?.u?.add(this),o!==this.rawVal&&(this.rawVal=o,this.o.length+this.l.length?(t?.add(this),e=a(e,this,O)):this.h=o)}},S=e=>({__proto__:c,rawVal:e,h:e,o:[],l:[]}),g=(e,t)=>{let r={i:new Set,u:new Set},n={f:e},l=o;o=[];let s=d(e,r,t);s=(s??document).nodeType?s:new Text(s);for(let e of r.i)r.u.has(e)||(_(e),e.o.push(n));for(let e of o)e.t=s;return o=l,n.t=s},y=(e,t=S(),r)=>{let n={i:new Set,u:new Set},l={f:e,s:t};l.t=r??o?.push(l)??f,t.val=d(e,n,t.rawVal);for(let e of n.i)n.u.has(e)||(_(e),e.l.push(l));return t},b=(e,...t)=>{for(let r of t.flat(1/0)){let t=s(r??0),o=t===c?g(()=>r.val):t===w?g(r):r;o!=l&&e.append(o)}return e},m=(e,t,...r)=>{let[o,...n]=s(r[0]??0)===h?r:[{},...r],f=e?document.createElementNS(e,t):document.createElement(t);for(let[e,r]of Object.entries(o)){let o=t=>t?Object.getOwnPropertyDescriptor(t,e)??o(s(t)):l,n=t+","+e,h=i[n]??(i[n]=o(s(f))?.set??0),a=e.startsWith("on")?(t,r)=>{let o=e.slice(2);f.removeEventListener(o,r),f.addEventListener(o,t)}:h?h.bind(f):f.setAttribute.bind(f,e),d=s(r??0);e.startsWith("on")||d===w&&(r=y(r),d=c),d===c?g(()=>(a(r.val,r.h),f)):a(r)}return b(f,...n)},v=e=>({get:(t,r)=>m.bind(l,e,r)}),j=new Proxy(e=>new Proxy(m,v(e)),v()),x=(e,t)=>t?t!==e&&e.replaceWith(t):e.remove(),O=()=>{let r=0,o=[...e].filter(e=>e.rawVal!==e.h);do{t=new Set;for(let e of new Set(o.flatMap(e=>e.l=u(e.l))))y(e.f,e.s,e.t),e.t=l}while(++r<100&&(o=[...t]).length);let n=[...e].filter(e=>e.rawVal!==e.h);e=l;for(let e of new Set(n.flatMap(e=>e.o=u(e.o))))x(e.t,g(e.f,e.t)),e.t=l;for(let e of n)e.h=e.rawVal},V={add:b,tags:j,state:S,derive:y,hydrate:(e,t)=>x(e,g(t,e))},window.van=V;}
//
var pn=Object.defineProperty,hn=(e,t,n)=>t in e?pn(e,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[t]=n,C=(e,t,n)=>(hn(e,"symbol"!=typeof t?t+"":t,n),n),PetiteVue=function(e){"use strict";function t(e){if(a(e)){const n={};for(let s=0;s<e.length;s++){const i=e[s],o=d(i)?r(i):t(i);if(o)for(const e in o)n[e]=o[e]}return n}return d(e)||g(e)?e:void 0}const n=/;(?![^(]*\))/g,s=/:(.+)/;function r(e){const t={};return e.split(n).forEach((e=>{if(e){const n=e.split(s);n.length>1&&(t[n[0].trim()]=n[1].trim())}})),t}function i(e){let t="";if(d(e))t=e;else if(a(e))for(let n=0;n<e.length;n++){const s=i(e[n]);s&&(t+=s+" ")}else if(g(e))for(const n in e)e[n]&&(t+=n+" ");return t.trim()}function o(e,t){if(e===t)return!0;let n=h(e),s=h(t);if(n||s)return!(!n||!s)&&e.getTime()===t.getTime();if(n=a(e),s=a(t),n||s)return!(!n||!s)&&function(e,t){if(e.length!==t.length)return!1;let n=!0;for(let s=0;n&&s<e.length;s++)n=o(e[s],t[s]);return n}(e,t);if(n=g(e),s=g(t),n||s){if(!n||!s)return!1;if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const n in e){const s=e.hasOwnProperty(n),r=t.hasOwnProperty(n);if(s&&!r||!s&&r||!o(e[n],t[n]))return!1}}return String(e)===String(t)}function c(e,t){return e.findIndex((e=>o(e,t)))}const l=Object.assign,f=Object.prototype.hasOwnProperty,u=(e,t)=>f.call(e,t),a=Array.isArray,p=e=>"[object Map]"===y(e),h=e=>e instanceof Date,d=e=>"string"==typeof e,m=e=>"symbol"==typeof e,g=e=>null!==e&&"object"==typeof e,v=Object.prototype.toString,y=e=>v.call(e),b=e=>d(e)&&"NaN"!==e&&"-"!==e[0]&&""+parseInt(e,10)===e,x=e=>{const t=Object.create(null);return n=>t[n]||(t[n]=e(n))},_=/-(\w)/g,w=x((e=>e.replace(_,((e,t)=>t?t.toUpperCase():"")))),$=/\B([A-Z])/g,k=x((e=>e.replace($,"-$1").toLowerCase())),O=e=>{const t=parseFloat(e);return isNaN(t)?e:t};function S(e,t){(t=t||undefined)&&t.active&&t.effects.push(e)}const E=e=>{const t=new Set(e);return t.w=0,t.n=0,t},j=e=>(e.w&N)>0,A=e=>(e.n&N)>0,P=new WeakMap;let R=0,N=1;const T=[];let M;const B=Symbol(""),L=Symbol("");class W{constructor(e,t=null,n){this.fn=e,this.scheduler=t,this.active=!0,this.deps=[],S(this,n)}run(){if(!this.active)return this.fn();if(!T.includes(this))try{return T.push(M=this),F.push(V),V=!0,N=1<<++R,R<=30?(({deps:e})=>{if(e.length)for(let t=0;t<e.length;t++)e[t].w|=N})(this):I(this),this.fn()}finally{R<=30&&(e=>{const{deps:t}=e;if(t.length){let n=0;for(let s=0;s<t.length;s++){const r=t[s];j(r)&&!A(r)?r.delete(e):t[n++]=r,r.w&=~N,r.n&=~N}t.length=n}})(this),N=1<<--R,z(),T.pop();const e=T.length;M=e>0?T[e-1]:void 0}}stop(){this.active&&(I(this),this.onStop&&this.onStop(),this.active=!1)}}function I(e){const{deps:t}=e;if(t.length){for(let n=0;n<t.length;n++)t[n].delete(e);t.length=0}}function K(e){e.effect.stop()}let V=!0;const F=[];function z(){const e=F.pop();V=void 0===e||e}function H(e,t,n){if(!V||void 0===M)return;let s=P.get(e);s||P.set(e,s=new Map);let r=s.get(n);r||s.set(n,r=E()),function(e,t){let n=!1;R<=30?A(e)||(e.n|=N,n=!j(e)):n=!e.has(M),n&&(e.add(M),M.deps.push(e))}(r)}function J(e,t,n,s,r,i){const o=P.get(e);if(!o)return;let c=[];if("clear"===t)c=[...o.values()];else if("length"===n&&a(e))o.forEach(((e,t)=>{("length"===t||t>=s)&&c.push(e)}));else switch(void 0!==n&&c.push(o.get(n)),t){case"add":a(e)?b(n)&&c.push(o.get("length")):(c.push(o.get(B)),p(e)&&c.push(o.get(L)));break;case"delete":a(e)||(c.push(o.get(B)),p(e)&&c.push(o.get(L)));break;case"set":p(e)&&c.push(o.get(B))}if(1===c.length)c[0]&&Z(c[0]);else{const e=[];for(const t of c)t&&e.push(...t);Z(E(e))}}function Z(e,t){for(const n of a(e)?e:[...e])(n!==M||n.allowRecurse)&&(n.scheduler?n.scheduler():n.run())}const q=function(e,t){const n=Object.create(null),s=e.split(",");for(let r=0;r<s.length;r++)n[s[r]]=!0;return t?e=>!!n[e.toLowerCase()]:e=>!!n[e]}("__proto__,__v_isRef,__isVue"),D=new Set(Object.getOwnPropertyNames(Symbol).map((e=>Symbol[e])).filter(m)),G=X(),U=X(!0),Q=function(){const e={};return["includes","indexOf","lastIndexOf"].forEach((t=>{e[t]=function(...e){const n=le(this);for(let t=0,r=this.length;t<r;t++)H(n,0,t+"");const s=n[t](...e);return-1===s||!1===s?n[t](...e.map(le)):s}})),["push","pop","shift","unshift","splice"].forEach((t=>{e[t]=function(...e){F.push(V),V=!1;const n=le(this)[t].apply(this,e);return z(),n}})),e}();function X(e=!1,t=!1){return function(n,s,r){if("__v_isReactive"===s)return!e;if("__v_isReadonly"===s)return e;if("__v_raw"===s&&r===(e?t?re:se:t?ne:te).get(n))return n;const i=a(n);if(!e&&i&&u(Q,s))return Reflect.get(Q,s,r);const o=Reflect.get(n,s,r);return(m(s)?D.has(s):q(s))||(e||H(n,0,s),t)?o:fe(o)?i&&b(s)?o:o.value:g(o)?e?function(e){return ce(e,!0,ee,null,se)}(o):oe(o):o}}const Y={get:G,set:function(e=!1){return function(t,n,s,r){let i=t[n];if(!e&&!function(e){return!(!e||!e.__v_isReadonly)}(s)&&(s=le(s),i=le(i),!a(t)&&fe(i)&&!fe(s)))return i.value=s,!0;const o=a(t)&&b(n)?Number(n)<t.length:u(t,n),c=Reflect.set(t,n,s,r);return t===le(r)&&(o?((e,t)=>!Object.is(e,t))(s,i)&&J(t,"set",n,s):J(t,"add",n,s)),c}}(),deleteProperty:function(e,t){const n=u(e,t);e[t];const s=Reflect.deleteProperty(e,t);return s&&n&&J(e,"delete",t,void 0),s},has:function(e,t){const n=Reflect.has(e,t);return(!m(t)||!D.has(t))&&H(e,0,t),n},ownKeys:function(e){return H(e,0,a(e)?"length":B),Reflect.ownKeys(e)}},ee={get:U,set:(e,t)=>!0,deleteProperty:(e,t)=>!0},te=new WeakMap,ne=new WeakMap,se=new WeakMap,re=new WeakMap;function ie(e){return e.__v_skip||!Object.isExtensible(e)?0:function(e){switch(e){case"Object":case"Array":return 1;case"Map":case"Set":case"WeakMap":case"WeakSet":return 2;default:return 0}}((e=>y(e).slice(8,-1))(e))}function oe(e){return e&&e.__v_isReadonly?e:ce(e,!1,Y,null,te)}function ce(e,t,n,s,r){if(!g(e)||e.__v_raw&&(!t||!e.__v_isReactive))return e;const i=r.get(e);if(i)return i;const o=ie(e);if(0===o)return e;const c=new Proxy(e,2===o?s:n);return r.set(e,c),c}function le(e){const t=e&&e.__v_raw;return t?le(t):e}function fe(e){return Boolean(e&&!0===e.__v_isRef)}Promise.resolve();let ue=!1;const ae=[],pe=Promise.resolve(),he=e=>pe.then(e),de=e=>{ae.includes(e)||ae.push(e),ue||(ue=!0,he(me))},me=()=>{for(const e of ae)e();ae.length=0,ue=!1},ge=/^(spellcheck|draggable|form|list|type)$/,ve=({el:e,get:t,effect:n,arg:s,modifiers:r})=>{let i;"class"===s&&(e._class=e.className),n((()=>{let n=t();if(s)(null==r?void 0:r.camel)&&(s=w(s)),ye(e,s,n,i);else{for(const t in n)ye(e,t,n[t],i&&i[t]);for(const t in i)(!n||!(t in n))&&ye(e,t,null)}i=n}))},ye=(e,n,s,r)=>{if("class"===n)e.setAttribute("class",i(e._class?[e._class,s]:s)||"");else if("style"===n){s=t(s);const{style:n}=e;if(s)if(d(s))s!==r&&(n.cssText=s);else{for(const e in s)xe(n,e,s[e]);if(r&&!d(r))for(const e in r)null==s[e]&&xe(n,e,"")}else e.removeAttribute("style")}else e instanceof SVGElement||!(n in e)||ge.test(n)?"true-value"===n?e._trueValue=s:"false-value"===n?e._falseValue=s:null!=s?e.setAttribute(n,s):e.removeAttribute(n):(e[n]=s,"value"===n&&(e._value=s))},be=/\s*!important$/,xe=(e,t,n)=>{a(n)?n.forEach((n=>xe(e,t,n))):t.startsWith("--")?e.setProperty(t,n):be.test(n)?e.setProperty(k(t),n.replace(be,""),"important"):e[t]=n},_e=(e,t)=>{const n=e.getAttribute(t);return null!=n&&e.removeAttribute(t),n},we=(e,t,n,s)=>{e.addEventListener(t,n,s)},$e=/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*|\['[^']*?']|\["[^"]*?"]|\[\d+]|\[[A-Za-z_$][\w$]*])*$/,ke=["ctrl","shift","alt","meta"],Oe={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>"button"in e&&0!==e.button,middle:e=>"button"in e&&1!==e.button,right:e=>"button"in e&&2!==e.button,exact:(e,t)=>ke.some((n=>e[`${n}Key`]&&!t[n]))},Se=({el:e,get:t,exp:n,arg:s,modifiers:r})=>{if(!s)return;let i=$e.test(n)?t(`(e => ${n}(e))`):t(`($event => { ${n} })`);if("vue:mounted"!==s){if("vue:unmounted"===s)return()=>i();if(r){"click"===s&&(r.right&&(s="contextmenu"),r.middle&&(s="mouseup"));const e=i;i=t=>{if(!("key"in t)||k(t.key)in r){for(const e in r){const n=Oe[e];if(n&&n(t,r))return}return e(t)}}}we(e,s,i,r)}else he(i)},Ee=({el:e,get:t,effect:n})=>{n((()=>{e.textContent=Ce(t())}))},Ce=e=>null==e?"":g(e)?JSON.stringify(e,null,2):String(e),je=e=>"_value"in e?e._value:e.value,Ae=(e,t)=>{const n=t?"_trueValue":"_falseValue";return n in e?e[n]:t},Pe=e=>{e.target.composing=!0},Re=e=>{const t=e.target;t.composing&&(t.composing=!1,Ne(t,"input"))},Ne=(e,t)=>{const n=document.createEvent("HTMLEvents");n.initEvent(t,!0,!0),e.dispatchEvent(n)},Te=Object.create(null),Me=(e,t,n)=>Be(e,`return(${t})`,n),Be=(e,t,n)=>{const s=Te[t]||(Te[t]=Le(t));try{return s(e,n)}catch(r){console.error(r)}},Le=e=>{try{return new Function("$data","$el",`with($data){${e}}`)}catch(t){return console.error(`${t.message} in expression: ${e}`),()=>{}}},We={bind:ve,on:Se,show:({el:e,get:t,effect:n})=>{const s=e.style.display;n((()=>{e.style.display=t()?s:"none"}))},text:Ee,html:({el:e,get:t,effect:n})=>{n((()=>{e.innerHTML=t()}))},model:({el:e,exp:t,get:n,effect:s,modifiers:r})=>{const i=e.type,l=n(`(val) => { ${t} = val }`),{trim:f,number:u="number"===i}=r||{};if("SELECT"===e.tagName){const t=e;we(e,"change",(()=>{const e=Array.prototype.filter.call(t.options,(e=>e.selected)).map((e=>u?O(je(e)):je(e)));l(t.multiple?e:e[0])})),s((()=>{const e=n(),s=t.multiple;for(let n=0,r=t.options.length;n<r;n++){const r=t.options[n],i=je(r);if(s)a(e)?r.selected=c(e,i)>-1:r.selected=e.has(i);else if(o(je(r),e))return void(t.selectedIndex!==n&&(t.selectedIndex=n))}!s&&-1!==t.selectedIndex&&(t.selectedIndex=-1)}))}else if("checkbox"===i){let t;we(e,"change",(()=>{const t=n(),s=e.checked;if(a(t)){const n=je(e),r=c(t,n),i=-1!==r;if(s&&!i)l(t.concat(n));else if(!s&&i){const e=[...t];e.splice(r,1),l(e)}}else l(Ae(e,s))})),s((()=>{const s=n();a(s)?e.checked=c(s,je(e))>-1:s!==t&&(e.checked=o(s,Ae(e,!0))),t=s}))}else if("radio"===i){let t;we(e,"change",(()=>{l(je(e))})),s((()=>{const s=n();s!==t&&(e.checked=o(s,je(e)))}))}else{const t=e=>f?e.trim():u?O(e):e;we(e,"compositionstart",Pe),we(e,"compositionend",Re),we(e,(null==r?void 0:r.lazy)?"change":"input",(()=>{e.composing||l(t(e.value))})),f&&we(e,"change",(()=>{e.value=e.value.trim()})),s((()=>{if(e.composing)return;const s=e.value,r=n();document.activeElement===e&&t(s)===r||s!==r&&(e.value=r)}))}},effect:({el:e,ctx:t,exp:n,effect:s})=>{he((()=>s((()=>Be(t.scope,n,e)))))}},Ie=/([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/,Ke=/,([^,\}\]]*)(?:,([^,\}\]]*))?$/,Ve=/^\(|\)$/g,Fe=/^[{[]\s*((?:[\w_$]+\s*,?\s*)+)[\]}]$/,ze=(e,t,n)=>{const s=t.match(Ie);if(!s)return;const r=e.nextSibling,i=e.parentElement,o=new Text("");i.insertBefore(o,e),i.removeChild(e);const c=s[2].trim();let l,f,u,p,h=s[1].trim().replace(Ve,"").trim(),d=!1,m="key",v=e.getAttribute(m)||e.getAttribute(m=":key")||e.getAttribute(m="v-bind:key");v&&(e.removeAttribute(m),"key"===m&&(v=JSON.stringify(v))),(p=h.match(Ke))&&(h=h.replace(Ke,"").trim(),f=p[1].trim(),p[2]&&(u=p[2].trim())),(p=h.match(Fe))&&(l=p[1].split(",").map((e=>e.trim())),d="["===h[0]);let y,b,x,_=!1;const w=(e,t,s,r)=>{const i={};l?l.forEach(((e,n)=>i[e]=t[d?n:e])):i[h]=t,r?(f&&(i[f]=r),u&&(i[u]=s)):f&&(i[f]=s);const o=et(n,i),c=v?Me(o.scope,v):s;return e.set(c,s),o.key=c,o},$=(t,n)=>{const s=new nt(e,t);return s.key=t.key,s.insert(i,n),s};return n.effect((()=>{const e=Me(n.scope,c),t=x;if([b,x]=(e=>{const t=new Map,n=[];if(a(e))for(let s=0;s<e.length;s++)n.push(w(t,e[s],s));else if("number"==typeof e)for(let s=0;s<e;s++)n.push(w(t,s+1,s));else if(g(e)){let s=0;for(const r in e)n.push(w(t,e[r],s++,r))}return[n,t]})(e),_){for(let t=0;t<y.length;t++)x.has(y[t].key)||y[t].remove();const e=[];let n,s,r=b.length;for(;r--;){const c=b[r],l=t.get(c.key);let f;null==l?f=$(c,n?n.el:o):(f=y[l],Object.assign(f.ctx.scope,c.scope),l!==r&&(y[l+1]!==n||s===n)&&(s=f,f.insert(i,n?n.el:o))),e.unshift(n=f)}y=e}else y=b.map((e=>$(e,o))),_=!0})),r},He=({el:e,ctx:{scope:{$refs:t}},get:n,effect:s})=>{let r;return s((()=>{const s=n();t[s]=e,r&&s!==r&&delete t[r],r=s})),()=>{r&&delete t[r]}},Je=/^(?:v-|:|@)/,Ze=/\.([\w-]+)/g;let qe=!1;const De=(e,t)=>{const n=e.nodeType;if(1===n){const n=e;if(n.hasAttribute("v-pre"))return;let s;if(_e(n,"v-cloak"),s=_e(n,"v-if"))return((e,t,n)=>{const s=e.parentElement,r=new Comment("v-if");s.insertBefore(r,e);const i=[{exp:t,el:e}];let o,c;for(;(o=e.nextElementSibling)&&(c=null,""===_e(o,"v-else")||(c=_e(o,"v-else-if")));)s.removeChild(o),i.push({exp:c,el:o});const l=e.nextSibling;s.removeChild(e);let f,u=-1;const a=()=>{f&&(s.insertBefore(r,f.el),f.remove(),f=void 0)};return n.effect((()=>{for(let e=0;e<i.length;e++){const{exp:t,el:o}=i[e];if(!t||Me(n.scope,t))return void(e!==u&&(a(),f=new nt(o,n),f.insert(s,r),s.removeChild(r),u=e))}u=-1,a()})),l})(n,s,t);if(s=_e(n,"v-for"))return ze(n,s,t);if((s=_e(n,"v-scope"))||""===s){const e=s?Me(t.scope,s):{};t=et(t,e),e.$template&&Xe(n,e.$template)}const r=null!=_e(n,"v-once");r&&(qe=!0),(s=_e(n,"ref"))&&Qe(n,He,`"${s}"`,t),Ge(n,t);const i=[];for(const{name:e,value:o}of[...n.attributes])Je.test(e)&&"v-cloak"!==e&&("v-model"===e?i.unshift([e,o]):"@"===e[0]||/^v-on\b/.test(e)?i.push([e,o]):Ue(n,e,o,t));for(const[e,o]of i)Ue(n,e,o,t);r&&(qe=!1)}else if(3===n){const n=e.data;if(n.includes(t.delimiters[0])){let s,r=[],i=0;for(;s=t.delimitersRE.exec(n);){const e=n.slice(i,s.index);e&&r.push(JSON.stringify(e)),r.push(`$s(${s[1]})`),i=s.index+s[0].length}i<n.length&&r.push(JSON.stringify(n.slice(i))),Qe(e,Ee,r.join("+"),t)}}else 11===n&&Ge(e,t)},Ge=(e,t)=>{let n=e.firstChild;for(;n;)n=De(n,t)||n.nextSibling},Ue=(e,t,n,s)=>{let r,i,o;if(":"===(t=t.replace(Ze,((e,t)=>((o||(o={}))[t]=!0,""))))[0])r=ve,i=t.slice(1);else if("@"===t[0])r=Se,i=t.slice(1);else{const e=t.indexOf(":"),n=e>0?t.slice(2,e):t.slice(2);r=We[n]||s.dirs[n],i=e>0?t.slice(e+1):void 0}r&&(r===ve&&"ref"===i&&(r=He),Qe(e,r,n,s,i,o),e.removeAttribute(t))},Qe=(e,t,n,s,r,i)=>{const o=t({el:e,get:(t=n)=>Me(s.scope,t,e),effect:s.effect,ctx:s,exp:n,arg:r,modifiers:i});o&&s.cleanups.push(o)},Xe=(e,t)=>{if("#"!==t[0])e.innerHTML=t;else{const n=document.querySelector(t);e.appendChild(n.content.cloneNode(!0))}},Ye=e=>{const t={delimiters:["{{","}}"],delimitersRE:/\{\{([^]+?)\}\}/g,...e,scope:e?e.scope:oe({}),dirs:e?e.dirs:{},effects:[],blocks:[],cleanups:[],effect:e=>{if(qe)return de(e),e;const n=function(e,t){e.effect&&(e=e.effect.fn);const n=new W(e);t&&(l(n,t),t.scope&&S(n,t.scope)),(!t||!t.lazy)&&n.run();const s=n.run.bind(n);return s.effect=n,s}(e,{scheduler:()=>de(n)});return t.effects.push(n),n}};return t},et=(e,t={})=>{const n=e.scope,s=Object.create(n);Object.defineProperties(s,Object.getOwnPropertyDescriptors(t)),s.$refs=Object.create(n.$refs);const r=oe(new Proxy(s,{set:(e,t,s,i)=>i!==r||e.hasOwnProperty(t)?Reflect.set(e,t,s,i):Reflect.set(n,t,s)}));return tt(r),{...e,scope:r}},tt=e=>{for(const t of Object.keys(e))"function"==typeof e[t]&&(e[t]=e[t].bind(e))};class nt{constructor(e,t,n=!1){C(this,"template"),C(this,"ctx"),C(this,"key"),C(this,"parentCtx"),C(this,"isFragment"),C(this,"start"),C(this,"end"),this.isFragment=e instanceof HTMLTemplateElement,n?this.template=e:this.isFragment?this.template=e.content.cloneNode(!0):this.template=e.cloneNode(!0),n?this.ctx=t:(this.parentCtx=t,t.blocks.push(this),this.ctx=Ye(t)),De(this.template,this.ctx)}get el(){return this.start||this.template}insert(e,t=null){if(this.isFragment)if(this.start){let n,s=this.start;for(;s&&(n=s.nextSibling,e.insertBefore(s,t),s!==this.end);)s=n}else this.start=new Text(""),this.end=new Text(""),e.insertBefore(this.end,t),e.insertBefore(this.start,this.end),e.insertBefore(this.template,this.end);else e.insertBefore(this.template,t)}remove(){if(this.parentCtx&&((e,t)=>{const n=e.indexOf(t);n>-1&&e.splice(n,1)})(this.parentCtx.blocks,this),this.start){const e=this.start.parentNode;let t,n=this.start;for(;n&&(t=n.nextSibling,e.removeChild(n),n!==this.end);)n=t}else this.template.parentNode.removeChild(this.template);this.teardown()}teardown(){this.ctx.blocks.forEach((e=>{e.teardown()})),this.ctx.effects.forEach(K),this.ctx.cleanups.forEach((e=>e()))}}const st=e=>e.replace(/[-.*+?^${}()|[\]\/\\]/g,"\\$&"),rt=e=>{const t=Ye();if(e&&(t.scope=oe(e),tt(t.scope),e.$delimiters)){const[n,s]=t.delimiters=e.$delimiters;t.delimitersRE=new RegExp(st(n)+"([^]+?)"+st(s),"g")}let n;return t.scope.$s=Ce,t.scope.$nextTick=he,t.scope.$refs=Object.create(null),{directive(e,n){return n?(t.dirs[e]=n,this):t.dirs[e]},mount(e){if("string"==typeof e&&!(e=document.querySelector(e)))return;let s;return s=(e=e||document.documentElement).hasAttribute("v-scope")?[e]:[...e.querySelectorAll("[v-scope]")].filter((e=>!e.matches("[v-scope] [v-scope]"))),s.length||(s=[e]),n=s.map((e=>new nt(e,t,!0))),this},unmount(){n.forEach((e=>e.teardown()))}}},it=document.currentScript;return it&&it.hasAttribute("init")&&rt().mount(),e.createApp=rt,e.nextTick=he,e.reactive=oe,Object.defineProperty(e,"__esModule",{value:!0}),e[Symbol.toStringTag]="Module",e}({});
//

// >>> 241202 hjkim - 스택메뉴 / IMP그래프 RECENT경로 변경
const IMP_RECENT_URI = () => {
    // return "/FDC/work/bjy/impedance/recent/";
    // /data/SE01/F001/EIS/RECENT
    return `/data/${PLANT_FOLDER()}/${STACK_NAME()}/EIS/RECENT/`;
}
// <<< 241202 hjkim - 스택메뉴 / IMP그래프 RECENT경로 변경

var ImpedanceChart = {}; // Interface for barcode_chart.js

(function(ImpedanceChart) { // Variable Scope Isolation

/*
* folder=정상데이터_폴더&el=#imp1
*/

// >>> 231212 hjkim - FDC에서 진입시, 파라미터 처리
function get_qs_from_src() {
    var srcEl = document.currentScript;
    if(srcEl == null) return;
    return srcEl.src.split('?')[1]; 
}
function get_argv_from_qs(qs) {
    var kv_arr = qs.split("&");
    if (kv_arr.length == 0) {return { result: undefined }; }
    var r = {};
    for (var i = 0; i < kv_arr.length; ++i) {
        var kv = kv_arr[i].split("=", 2);
        if (kv.length == 1) r[kv[0]] = "";
        else r[kv[0]] = decodeURIComponent(kv[1].replace(/\+/g, " "));
    }
    return r;
}

/* -------------------------------------------------------------------------- */
/*                         스택진단메뉴 / 하단 그래프(고성능 UPLOT)           */
/* -------------------------------------------------------------------------- */
var UPLOT_LIB_LOADED = false;
// current path : /FDC/work/dev/js/imp.js
fn_load_css("../hjkim/lib/uPlot.min.css");
fn_load_js("/NEW/flot/color_palette.js", () => {
    fn_load_js("../hjkim/lib/uPlot.iife.min.js", () => { UPLOT_LIB_LOADED = true; });
});

function fn_load_js(src_url        , cb_init            ) {	
    var my_head = document.getElementsByTagName('head')[0];
    var my_js = document.createElement('script');
    my_js.type= 'text/javascript';
    my_js.async = true;
    my_js.src = src_url;
    if(cb_init !== null) my_js.onload = function (){if(typeof cb_init == "function"){cb_init();} };
    my_head.appendChild(my_js);
}
function fn_load_css(src_url        ) {
    var my_head = document.getElementsByTagName('head')[0];
    var my_css = document.createElement('link');
    my_css.type= 'text/css';
    my_css.async = true;
    my_css.rel = "stylesheet";
    my_css.href = src_url;
    my_head.appendChild(my_css);
}
// >>> 241202 hjkim - 버그 있는 retry 교체
function retry(condition       , interval       , limit       , fn_callback            ) {
    var RETRY_CNT = 0;
    let id = new Date().getTime()+(Math.random());
    window.BE_CALLED[id] = false;
    var _retry_id = setInterval((_id) => {
        // if((RETRY_CNT % 10) == 0) console.log("!@#$ retry : ", _id, condition, RETRY_CNT, eval(condition), window.BE_CALLED[_id] == false);
        if(eval(condition) && window.BE_CALLED[_id] == false) {
            window.BE_CALLED[_id] = true; RETRY_CNT = limit; fn_callback(); 
        } 
        if(RETRY_CNT > limit) { clearInterval(_retry_id); }
        RETRY_CNT++;
    }, interval, id);
}
// function retry(condition       , interval       , limit       , fn_callback            ) {
//     var _retry_cnt = 0;
//     if(eval(condition) || _retry_cnt > limit) { fn_callback(); }
//     var _retry_id = setInterval(() => {
//         // console.log("retry : ", condition, _retry_cnt);
//         if(eval(condition) || _retry_cnt > limit) {
//             fn_callback();
//             clearInterval(_retry_id);
//         }
//         _retry_cnt++;
//     }, interval);
// }
// <<< 241202 hjkim - 버그 있는 retry 교체

if(typeof TITLE !== "undefined" && TITLE.includes("스택진단")) {
    /* -------------------------------------------------------------------------- */
    /*                           스택진단 / 하단 그래프 초기화                    */
    /* -------------------------------------------------------------------------- */
    window.addEventListener("load", () => {
        g_el.fullcell_graph_body = document.querySelector(".widget.fullcell-graph .widget-body");
        g_el.fullcell_graph_calendex = document.querySelector(".widget.fullcell-graph .widget-body .inner-content div");
        g_el.hz_graph_img = document.querySelector(".widget.fullcell-graph .widget-body .inner-content .row .col img");
        g_el.hz_graph_result = document.querySelector(".widget.fullcell-graph .widget-body .inner-content .row .col .result");
        
        
        g_el.hz_graph_parents = g_el.hz_graph_img.parentNode;
        g_el.hz_graph_parents.style.marginTop = 0;
        
        // 디자인 시안 삭제
        g_el.hz_graph_img.remove();
        g_el.hz_graph_result.remove();
        
        // >>> 캘린덱스를 스택, 암페어 필터로 전환이용
        // g_el.fullcell_graph_calendex.querySelector("button").remove();
        // g_el.fullcell_graph_calendex.querySelector("button").remove();
        // g_el.fullcell_graph_calendex.querySelector("#daily").remove();
        // g_el.fullcell_graph_calendex.querySelector("#timely").remove();
        // <<< 캘린덱스를 스택, 암페어 필터로 전환이용
        
        // 그래프 그릴 자리 마련
        let placeholder = g_el.hz_graph_parents;
        const padding = 10;
        pl_w = g_el.fullcell_graph_body.clientWidth-(padding*2);
        pl_h = g_el.fullcell_graph_body.clientHeight-(padding*2);
        
        // 그래프 초기화 데이터
        let data = [
            [1546300800, 1546387200],    // x-values (timestamps)
            [        35,         71],    // y-values (series 1)
            [        90,         15],    // y-values (series 2)
        ];
        // 그래프 옵션
        let opts = {
            id: "hz_chart1", class: "hz-chart",
            width: pl_w, height: pl_h,
            series: [],
            scales: {
                x: { time: false, },
                y: {},
            },
            axies: [
                {},
                {
                    show: true,
                    space: 50,
                    side: 1, 
                    label: "Real Ohm",
                    labelGap:8, 
                    labelSize: 30,
                    // labelFont: "bold 12px Arial",
                    // font: "12px Arial",
                    // gap: 5,
                    size: 50,
                    scale: "y",
                    values: (u, vals, space) => vals.map(v => +v.toFixed(1) + "Ohm"),
                }
            ],
            padding: [null, 0, null, 0],
        };
        window.uplot_default_opt = opts;
        window.uplot_placeholder = placeholder;
        
        const drawPoints = (u, seriesIdx, idx0, idx1) => {
            const pxRatio = 1.5;
            const size = 5 * pxRatio;
            u.ctx.save();
            uPlot.orient(u, seriesIdx, (series, dataX, dataY, scaleX, scaleY, valToPosX, valToPosY, xOff, yOff, xDim, yDim, moveTo, lineTo, rect, arc) => {
                let d = u.data[seriesIdx];
                // u.ctx.fillStyle = series.stroke();
                u.ctx.strokeStyle = series.stroke();
                let deg360 = 2 * Math.PI;
                let p = new Path2D();
                
                for (let i = 0; i < d[0].length; i++) {
                    let xVal = d[0][i];
                    let yVal = d[1][i];
                    
                    if (xVal >= scaleX.min && xVal <= scaleX.max && yVal >= scaleY.min && yVal <= scaleY.max) {
                        let cx = valToPosX(xVal, scaleX, xDim, xOff);
                        let cy = valToPosY(yVal, scaleY, yDim, yOff);
                        
                        p.moveTo(cx + size/2, cy);
                        arc(p, cx, cy, size, 0, deg360);
                    }
                }
                u.ctx.stroke(p);
            });
            u.ctx.restore();
            return null;
        };
        
        const opts_scatter = {
            // title: "Scatter Plot",
            mode: 2,
            width: window.uplot_scatter_placeholder.clientWidth,
            height: window.uplot_scatter_placeholder.clientHeight-50,
            legend: { live: false, },
            hooks: {
                drawClear: [
                    u => { u.series.forEach((s, i) => { if (i > 0) s._paths = null; }); },
                ],
            },
            scales: {
                x: { time: false, },
                y: {},
            },
            series: [
                {},
                {
                    stroke: "blue",
                    paths: drawPoints,
                },
            ],
        };
        window.uplot_scatter_opts = opts_scatter;
        
        
        // g_el.fullcell_graph_calendex.remove();
        
    });
}

/* -------------------------------------------------------------------------- */
/*                      워커 쓰레드와 데이터 송수신                           */
/* -------------------------------------------------------------------------- */
// function _selectbox_wait(onoff        ) {
//     if(onoff == true) {
//         g_el.yearly.setAttribute("disabled",  true);
//         g_el.monthly.setAttribute("disabled", true);
//     } else {
//         g_el.yearly.removeAttribute("disabled");
//         g_el.monthly.removeAttribute("disabled");
//     }
// }

// >>> 240321 hjkim - 스택 상태 그래프
// >>> 240613 hjkim - Best Fit
var get_best_fit_cnt = 0;
function get_best_fit(min_x, min_y, max_x, max_y, XY_RATIO = 3.5) {
    if(min_x == null || min_y == null || max_x == null || max_y == null) return null;
    var fit_x_range = Math.abs(max_x - min_x);
    var fit_y_range = Math.abs(max_y - min_y);
    var r = null;
    var xy_ratio = (fit_x_range / fit_y_range);
    if((xy_ratio) < XY_RATIO) { r = "Y_FIT"; }
    else { r = "X_FIT"; }
    if(get_best_fit_cnt == 0) {
        console.log("#imp.j / fit_x_range, fit_y_range, xy_ratio : ", fit_x_range, fit_y_range, xy_ratio.toFixed(2), r);
    }
    return r;
}

//////////////////////////////////////////////////////////////////////////////
// 체크박스 선택된 값 안에서 최대값 구해서 selected.conf에 저장하는 함수
function handleDataResponse(allData) {
    let maxValues = {
      X1: -Infinity,
      X2: -Infinity,
      Y1: -Infinity,
      Y2: -Infinity,
    };
  
    // 최대값 계산
    allData.forEach((item) => {
      const { X1, X2, Y1, Y2 } = item;
      maxValues.X1 = Math.max(maxValues.X1, parseFloat(X1));
      maxValues.X2 = Math.max(maxValues.X2, parseFloat(X2));
      maxValues.Y1 = Math.max(maxValues.Y1, parseFloat(Y1));
      maxValues.Y2 = Math.max(maxValues.Y2, parseFloat(Y2));
    });
  
    const maxValueString = `X1=${maxValues.X1}\nX2=${maxValues.X2}\nY1=${maxValues.Y1}\nY2=${maxValues.Y2}`;
  
    // 그래프 그리기 (색상 정보 포함)
    const _grid_el = document.querySelector(".widget-body.d-grid");
    const _pholder_arr = _grid_el.querySelectorAll('.content-section>div:not(.float-end)');
    const canvasEl = _pholder_arr[0]; // 같은 캔버스에 그래프들 그리기
    const isRelative = getLocalStorage(`${PLANT_FOLDER()}/${STACK_NAME()}/org_chk`) === 'true';

    // 축 초기화
    ImpedanceChart.graph_axis_reset();
    window.g_micro_ohm.init = false;
    window.is_draw_xtick_label = false;
    window.is_draw_ytick_label = false;
  
    // 각 데이터에 대해 그래프를 그립니다.
    allData.forEach((item) => {
        const {
            data, color, ack_number,
            max_x, min_x,
            max_y, min_y,
            xaxis_max, yaxis_max
        } = item;
      
        if (isRelative) {
            const min_x_in_series = data.reduce((acc, d) => Math.min(acc, d[1]), Infinity);
            data.forEach(d => d[1] -= min_x_in_series);
        }

        const _opt = {
            PX_RANGE_PADDING__X: 0,
            PX_RANGE_PADDING__Y: 0,
            ack_number,
            max_x,
            min_x,
            max_y,
            min_y,
            BEST_FIT: get_best_fit(min_x, min_y, max_x, max_y),
            xaxis_max,
            yaxis_max
        };
        window.lastUsedGraphColor = color;
    });
}
window.handleDataResponse = handleDataResponse;

// <<< 240613 hjkim - Best Fit
window. color_cnt = 0;
const IS_UPLOT = 1;
channel2.port2.onmessage = (e) => {
    // >>> 250211 hjkim - 원점체크박스 상태저장
    const color = document.querySelector("#graph-btn").getAttribute("data-color") || null;
    let org_chk = getLocalStorage(`${PLANT_FOLDER()}/${STACK_NAME()}/org_chk`);
    if (e.data.msg === "DRAW_MULTIPLE_NYQUIST") {
        // 다중 데이터를 처리하는 새로운 메시지
        window.handleDataResponse(e.data.allData);
        return;
      }
    if(e.data.msg == "DRAW_NYQUIST" || e.data.msg == "DRAW_NYQUIST__RELATIVE") {
        if(org_chk == "true") e.data.msg = "DRAW_NYQUIST__RELATIVE";
        else  e.data.msg = "DRAW_NYQUIST";
    }
    // <<< 250211 hjkim -원점체크박스 상태저장
    switch(e.data.msg) {
        case "DRAW_IMPDATA":
            var _grid_el = document.querySelector(".widget-body.d-grid");
            var _pholder_arr = _grid_el.querySelectorAll('.content-section>div:not(.float-end)');
            var _e = { target: _pholder_arr[0] };
            ImpedanceChart.IAdd_series_in_imp_graph(_e, e.data.url, e.data.color);
        break;
        case "DRAW_NYQUIST":
            xsxe_ysye__scope.set_xs(e.data.min_x);
            xsxe_ysye__scope.set_xe(e.data.max_x);
            xsxe_ysye__scope.set_ys(e.data.min_y);
            xsxe_ysye__scope.set_ye(e.data.max_y);
            var _grid_el = document.querySelector(".widget-body.d-grid");
            var _pholder_arr = _grid_el.querySelectorAll('.content-section>div:not(.float-end)');
            var _pad_x = (_pholder_arr[0].clientWidth  / 3) * 1;
            var _pad_y = (_pholder_arr[0].clientHeight / 3) * 1;
            // >>> 240612 hjkim - Refactoring :: Intro. Param. Obj.
            var _opt = {
                PX_RANGE_PADDING__X: 0,
                PX_RANGE_PADDING__Y: 0,
                SHIFT_X: e.data.min_x,
                ack_number: e.data.ack_number,
                max_x: e.data.max_x,
                min_x: e.data.min_x,
                max_y: e.data.max_y,
                min_y: e.data.min_y,
                // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
                BEST_FIT: get_best_fit(e.data.min_x, e.data.min_y, e.data.max_x, e.data.max_y),
                xaxis_max: e.data.xaxis_max,
                yaxis_max: e.data.yaxis_max,
                // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
            };
            ImpedanceChart._draw_imp_data(e.data.data, e.data.color, _pholder_arr[0], _opt);
            // ImpedanceChart._draw_imp_data(e.data.data, e.data.color, _pholder_arr[0], _pad_x, _pad_y, 0, 50 /* 우측으로 쉬프트 */, e.data.ack_number, e.data.max_x);
            // <<< 240612 hjkim - Refactoring :: Intro. Param. Obj.
        break;
        case "DRAW_NYQUIST__RELATIVE":
            // >>> 240604 hjkim - 원점 시프트
            let max_x_in_series = e.data.data.reduce((acc, d) => { return d[1] > acc[1] ? d : acc; })[1];
            let min_x_in_series = e.data.data.reduce((acc, d) => { return d[1] < acc[1] ? d : acc; })[1];
            for(var i = 0; i < e.data.data.length; i++) {
                if(i == 0 || i == e.data.data.length-1) { console.log("#x, y BEFORE:", e.data.data[i], i); }
                // console.log("#e.data.data[i][1], e.data.min_x : ", e.data.data[i][1], e.data.min_x, e.data.data[i][1]-e.data.min_x);
                // e.data.data[i][1]-= e.data.min_x; // X축 시프트
                e.data.data[i][1]-= min_x_in_series; // X축 시프트
                if(i == 0 || i == e.data.data.length-1) { console.log("#x, y AFTER:", e.data.data[i], i); }
            }
            // <<< 240604 hjkim - 원점 시프트
            xsxe_ysye__scope.set_xs(0);
            // >>> 250217 hjkim - 원점 시프트 버그 수정
            // xsxe_ysye__scope.set_xe(e.data.max_x-e.data.min_x);
            xsxe_ysye__scope.set_xe(e.data.max_x);
            // <<< 250217 hjkim - 원점 시프트 버그 수정
            xsxe_ysye__scope.set_ys(e.data.min_y);
            xsxe_ysye__scope.set_ye(e.data.max_y);
            var _grid_el = document.querySelector(".widget-body.d-grid");
            var _pholder_arr = _grid_el.querySelectorAll('.content-section>div:not(.float-end)');
            var _pad_x = (_pholder_arr[0].clientWidth  / 3) * 1;
            var _pad_y = (_pholder_arr[0].clientHeight / 3) * 1;
            // >>> 240418 상대좌표계를 위한 설정
            ImpedanceChart.graph_axis_reset();          
            // >>> 240612 hjkim - Refactoring :: Intro. Param. Obj.
            var _opt = {
                PX_RANGE_PADDING__X: 0,
                PX_RANGE_PADDING__Y: 0,
                ack_number: e.data.ack_number,
                // >>> 250217 hjkim - 원점 시프트 버그 수정
                // max_x: e.data.max_x - e.data.min_x,
                max_x: e.data.max_x,
                min_x: e.data.min_x,
                max_y: e.data.max_y,
                min_y: e.data.min_y,
                // <<< 250217 hjkim - 원점 시프트 버그 수정
                BEST_FIT: get_best_fit(e.data.min_x, e.data.min_y, e.data.max_x, e.data.max_y),
                // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
                xaxis_max: e.data.xaxis_max,
                yaxis_max: e.data.yaxis_max,
                // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
            };
            ImpedanceChart._draw_imp_data(e.data.data, e.data.color, _pholder_arr[0], _opt);
            //ImpedanceChart._draw_imp_data(e.data.data, e.data.color, _pholder_arr[0], 0, 0, 3, 0 /*원점*/, e.data.ack_number, e.data.max_x-e.data.min_x);
            // <<< 240612 hjkim - Refactoring :: Intro. Param. Obj.
            // <<< 240418 상대좌표계를 위한 설정
        break;
        case "DRAW_NYQUIST__BESTFIT":
            console.log("#imp.js / e.data.zxy_axis_min : ", e.data.zxy_axis_min);
            console.log("#imp.js / e.data.zxy_axis_max : ", e.data.zxy_axis_max);
            console.log("#imp.js / :", (e.data.zxy_axis_min[1]));
            console.log("#imp.js / :", (e.data.zxy_axis_max[1]));
            console.log("#imp.js / :", (e.data.zxy_axis_min[2]));
            console.log("#imp.js / :", (e.data.zxy_axis_max[2]));
            xsxe_ysye__scope.set_xs(e.data.zxy_axis_min[1]);
            xsxe_ysye__scope.set_xe(e.data.zxy_axis_max[1]);
            xsxe_ysye__scope.set_ys(e.data.zxy_axis_min[2]);
            xsxe_ysye__scope.set_ye(e.data.zxy_axis_max[2]);
        break;
        case "UPDATE_DEFAULT_UPLOTOPT":
            var uplotopt_series = e.data.uplotopt_series;
            for(var i = 0; i < uplotopt_series.length; i++) {
                uplotopt_series[i].values = eval(uplotopt_series[i].values);
            }
            window.uplotopt_series = uplotopt_series;
            retry(`window.uplot_default_opt != undefined && window.uplot_default_opt["series"] != undefined`, 50, 10, () => {
                window.uplot_default_opt.series = uplotopt_series;
            });
        break;
        case "DRAW_HZDATA":
            if(g_el.uplot != undefined) {
                g_el.uplot.destroy();
                delete g_el.uplot;
            }
            const uplotdata = e.data.uplotdata;
            window.uplotdata = uplotdata;
            retry(`window.uplot_default_opt != null &&  window.uplotdata != null && window.uplot_placeholder != null`, 500, 10, () => {
                // _selectbox_wait(false);
                if(g_el.uplot == undefined) g_el.uplot = new uPlot(window.uplot_default_opt, window.uplotdata, window.uplot_placeholder)
            });
        break;
    }
}
if(TITLE.includes("스택진단")) {

    // >>> 250214 hjkim - stime을 파라미터로 달고 넘어 올 경우, /recent/ 여러개 그리기 생략
    if(location.search.includes("stime") == false) {

        // >>> 240912 hjkim - /recent/ 여러개 그리기
        channel2.port2.postMessage({
            msg: "GET_STACK__STREAM",
            // >>> 241204 hjkim - Nyquist 그래프 recent가 안나오는 버그
            response_msg: "DRAW_NYQUIST__RELATIVE",
            // <<< 241204 hjkim - Nyquist 그래프 recent가 안나오는 버그
            
            // >>> 241202 hjkim - 스택메뉴 / IMP그래프 RECENT경로 변경
            // url_dir: "/FDC/work/bjy/impedance/recent",
            url_dir: IMP_RECENT_URI(),
            // <<< 241202 hjkim - 스택메뉴 / IMP그래프 RECENT경로 변경
    
            compact : "",
        });
        // >>> 241202 hjkim - 스택메뉴 / IMP그래프 RECENT경로 변경

    }
    // <<< 250214 hjkim - stime을 파라미터로 달고 넘어 올 경우, /recent/ 여러개 그리기 생략

    channel2.port2.postMessage({ msg: "HZ_DATAFETCH", response_msg: ["UPDATE_DEFAULT_UPLOTOPT", "DRAW_HZDATA"],
        url: "/ALL/data/impedance/stk2/40A/"});
}

if(TITLE.includes("대시보드")) {
    var argv_qs, argv;
    // >>> 241203 hjkim - 대시보드에 Nyquist 그래프 recent 경로 변경
    // var DATA_URL = ["/FDC/work/bjy/impedance/normal/", "/FDC/work/bjy/impedance/recent/"];
    // var DATA_URL = [IMP_RECENT_URI(), IMP_RECENT_URI()];
    // <<< 241203 hjkim - 대시보드에 Nyquist 그래프 recent 경로 변경
    // >>> 250108 hjkim - Stack EIS Analysis 경로 변경
    // path : /data/{plant_id}/{fuelcell_id}/EIS/LATEST
    // example : /data/SE01/F002/EIS/LATEST
	var DATA_URL = ["/FDC/work/bjy/impedance/normal/", `/data/${PLANT_FOLDER()}/${STACK_NAME()}/EIS/LATEST/`];
    // >>> 250108 hjkim - Stack EIS Analysis 경로 변경
    var COLOR = ["#00cc00", "#0000cc"];
    argv_qs = get_qs_from_src();
    /* -------------------------------------------------------------------------- */
    /*                     대시모드 / 상단 그래프 초기화                          */
    /* -------------------------------------------------------------------------- */
    window.addEventListener("load", function() { 
        if(argv_qs != null) {
            // Parse Query String
            argv = get_argv_from_qs(argv_qs);
            var placeholder_el = document.querySelector(argv["el"]);
            
            // Run Impedance Chart
            Run_ImpedanceChart(ImpedanceChart);
            
            // >>> 240105 hjkim - 미디어 쿼리 대신 그래프 세로 길이 조정
            var component_h = document.querySelector(".widget.stack-status");
            // >>> 240305 hjkim - 사이즈 조정
            //var _h = component_h.clientHeight - 70;
            var _w = component_h.clientWidth/2;
            var _h = component_h.clientHeight-50;
            var _square = (_w < _h) ? _w : _h;
            // <<< 240305 hjkim - 사이즈 조정
            // <<< 240105 hjkim - 미디어 쿼리 대신 그래프 세로 길이 조정
            
            // Clear Placehodler
            placeholder_el.innerHTML = "";
            placeholder_el.style.background = "";
            ImpedanceChart.IImpedanceChart_init( placeholder_el, _w, _h );
            
            // >>> 240305 hjkim - 사이즈 조정
            //placeholder_el.style.width = "";
            placeholder_el.firstChild.style.width="";
            // <<< 240305 hjkim - 사이즈 조정
            
            // Get Data List
            var _content_arr = [];
            var _content_arr2 = [];
            var e = { target : placeholder_el };
            
            // 정상 데이터 루프
            access(DATA_URL[0], function(is_access, uri, contents) {
                _content_arr.push(contents);
                var imp_url_list = ImpedanceChart.IMerge_imp_data_list(_content_arr);
                for(var i = 0; i < imp_url_list.length; i++) {
                    // Draw Impedance Graph
                    var _url = `${DATA_URL[0]}${imp_url_list[i]}`;
                    var _color = COLOR[0];
                    ImpedanceChart.IAdd_series_in_imp_graph(e, _url, _color);
                }
                
                setTimeout(function() {
                    // 최근 데이터 루프
                    access(DATA_URL[1], function(is_access, uri, contents) {
                        _content_arr2.push(contents);
                        var imp_url_list = ImpedanceChart.IMerge_imp_data_list(_content_arr2);
                        for(var i = 0; i < imp_url_list.length; i++) {
                            // Draw Impedance Graph
                            var _url = `${DATA_URL[1]}${imp_url_list[i]}`;
                            var _color = COLOR[1];
                            ImpedanceChart.IAdd_series_in_imp_graph(e, _url, _color);
                        }
                    });
                }, 500);
                
            });
        }
    });
}
if(TITLE.includes("수소전지 그래프")) {
    // Run Impedance Chart
    Run_ImpedanceChart(ImpedanceChart || (ImpedanceChart = {}));
}
// <<< 231212 hjkim - FDC에서 진입시, 파라미터 처리

window.g_DEBUG = false;

/* -------------------------------------------------------------------------- */
/*                                 GLOBAL_VAR                                 */
/* -------------------------------------------------------------------------- */
window.g_drawn_imp_data = {}; // 그려진 임피던스 그래프 데이터 저장(for 범례 토글 시 사용)
window.g_legend_disallow_list = ["전체범위용",  "범위"];  // 범례(클릭대상) 숨김 단어 목록
window.g_keyword_disallow_list = ["전체범위용", "범위"]; // 키워드(말풍선) 무시 단어 목록

/* -------------------------------------------------------------------------- */
/*                                임피던스 데이터 목록                           */
/* -------------------------------------------------------------------------- */
window.g_imp_base_url_list = {};
window.g_imp_base_url_list["선별"] = "/ALL/data/impedance/imp_data_bak/";
window.g_imp_base_url_list["선별_기타포함"] = "/ALL/data/impedance/imp_data_edit_etc/";
window.g_imp_base_url_list["로그"] = "/ALL/data/impedance/imp_data/";
window.g_imp_base_url_list["선별_보정"] = "/ALL/data/impedance/imp_data_bak/post_data/";
window.g_imp_base_url_list["로그_보정"] = "/ALL/data/impedance/imp_data/post_data/";
window.g_imp_base_url_sel = "선별";

// 파일 파싱용 식별
window.g_imp_file_prefix = {};
window.g_imp_file_prefix["선별"] = "d";
window.g_imp_file_prefix["로그"] = "d";
window.g_imp_file_prefix["선별_보정"] = "post_d";
window.g_imp_file_prefix["로그_보정"] = "post_d";
/* -------------------------------------------------------------------------- */

function ImpedanceGraph(id) {
    this.init = function(id) {
        this.$id = id;
    }
    this.template = function() {
        return `<div id="${this.$id}"></div>`;
    }
    /* Constructor */
    this.init(id);
}

function FilterTable(id) {
    this.init = function(id) {
        this.$id = id;
    }
    this.template = function(A, B, C) {
        var style = "max-width: 300px;";
        return `
        <table style="${style}">
            <tbody id="${this.$id}">
            <tr><td>${A}</td></tr>
            <tr><td>${B}</td></tr>
            <tr><td>${C}</td></tr>
            </tbody>
        </table>
        `;
    }
    /* Constructor */
    this.init(id);
}

function ReferenceTable(id) {
    this.init = function(id) {
        this.$id = id;
    }
    this.template = function() {
        var style = "max-width: 300px; font-size: 12px;";
        return `
        <table style="${style}">
            <tbody id="${this.$id}">
            </tbody>
        </table>
        `;
    }
    /* Constroctor */
    this.init(id);
}


/* -------------------------------------------------------------------------- */
/*                               IMPEDANCE CHART                              */
/* -------------------------------------------------------------------------- */
function Run_ImpedanceChart(ImpedanceChart) {
    var g_curr_imp_data;
    var g_curr_filename;
    var g_normal_filtered_imp_data_list;
    var g_air_filtered_imp_data_list;
    var g_wat_filtered_imp_data_list;
    var g_thm_filtered_imp_data_list;
    var AXIS_MARGIN = { l: 50, t: 35, r: 35, b: 50 };//EUNG
    if(TITLE.includes("수소전지 그래프")) {
        AXIS_MARGIN = { l: 70, t: 35, r: 35, b: 70 };
    }
    var HORIZONTAL_TICK_SPACING = 10;
    var VERTICAL_TICK_SPACING = 10;
    var TICK_WIDTH = 5;
    var TICKS_LINEWIDTH = 1;
    var TICKS_COLOR = "grey";
    var AXIS_LINEWIDTH = 1.0;
    var GRID_LINEWIDTH = 1.0;
    // const AXIS_COLOR = "blue";
    var AXIS_COLOR = "grey";
    var AXIS_ORIGIN = { x: AXIS_MARGIN.l, y: -1 };
    var AXIS_TOP = AXIS_MARGIN.t;
    var AXIS_RIGHT = AXIS_MARGIN.r;
    var AXIS_WIDTH = AXIS_MARGIN.r - AXIS_MARGIN.l;
    var AXIS_HEIGHT = AXIS_MARGIN.b - AXIS_MARGIN.t;
    var NUM_VERTICAL_TICKS = AXIS_HEIGHT / VERTICAL_TICK_SPACING;
    var NUM_HORIZONTAL_TICKS = AXIS_WIDTH / HORIZONTAL_TICK_SPACING;
    var M_OHM = 1000; // 단위 변환 상수    
    // >>> 240305 hjkim - 
    var PX_RANGE_PADDING = 30;
    // if(TITLE.includes("스택진단")) {
    //     PX_RANGE_PADDING = 100;
    // }    
    // <<< 240305 hjkim - 
    /* -------------------------------------------------------------------------- */
    /*                                    MAIN                                    */
    /* -------------------------------------------------------------------------- */
    // >>> 250306 hjkim - Nyq. 축레이블
    function _get_range_convertor2(value_of_point_range, px_of_canvas_range, min_value_of_point, origin_px = 0) {
        var fn = function (px_of_canvas) {
            let ratio = value_of_point_range / (px_of_canvas_range-origin_px);
            return ((px_of_canvas-origin_px) * ratio) + min_value_of_point;
        };
        return fn;
    }
    // <<< 250306 hjkim - Nyq. 축레이블

    // >>> 250121 hjkim - 스택 그래프 사이즈 조정
    function _get_range_convertor(value_of_point_range, px_of_canvas_range, min_value_of_point, value_of_canvas_padding = 0) {
        /* 값을 주어진 모든 값의 최소값으로 뺀뒤, 이를 0px로 설정한다.
        그러기 위해서 해당 값을 주어진 모든 값의 최소~최대 범위로 분할 한 뒤,
        캔바스의 길이를 곱해서 확장한다. */
        var fn = function (value_of_point) {
            let ratio = px_of_canvas_range / value_of_point_range;
            return ((value_of_point - min_value_of_point) * ratio) + (value_of_canvas_padding * ratio);
        };
        return fn;
    }
    // <<< 250121 hjkim - 스택 그래프 사이즈 조정
    var g_impedence_canvas;
    const circle_radius = 10;
    window.g_micro_ohm = { init: false,
        min_x: 0, min_y: 0, max_x: 0, max_y: 0,
        range_x: function () { return (this.max_x - this.min_x + circle_radius ); },
        range_y: function () { return (this.max_y - this.min_y + circle_radius ); }
    };
    // >>> 240418 hjkim - 상대
    function graph_axis_reset() {
        window.g_micro_ohm.init = false;
    }
    ImpedanceChart.graph_axis_reset = graph_axis_reset;
    // <<< 240418 hjkim - 
    function IImpedanceChart_add_data(data, filename) {
        if (filename === void 0) { filename = "imp_Datplot"; }
        if (g_impedence_canvas == null)
        return;
        var ctx = get_ctx(g_impedence_canvas);
        if (ctx == null)
        return;
        // TODO: 제목 겹칩 버그로 인해 구현 보류
        // ctx.save();
        // draw_title(ctx, AXIS_WIDTH/2, AXIS_MARGIN.t, `Nyquist Plot: ${filename}`);
        // ctx.restore();
        // 스케일 조정을 위한 변수 계산
        var idx;
        (function (idx) {
            idx[idx["HZ"] = 0] = "HZ";
            idx[idx["X"] = 1] = "X";
            idx[idx["Y"] = 2] = "Y";
        })(idx || (idx = {}));
        ;
        if (window.g_micro_ohm.init == false) {
            window.g_micro_ohm.min_x = data.reduce(function (acc, d) { return d[idx.X] < acc[idx.X] ? d : acc; })[idx.X];
            window.g_micro_ohm.max_x = data.reduce(function (acc, d) { return d[idx.X] > acc[idx.X] ? d : acc; })[idx.X];
            window.g_micro_ohm.min_y = 0;
            window.g_micro_ohm.max_y = data.reduce(function (acc, d) { return d[idx.Y] > acc[idx.Y] ? d : acc; })[idx.Y];
            window.g_micro_ohm.init = true;
        }
        var px__x_range = Math.abs(AXIS_ORIGIN.x - AXIS_RIGHT)  - PX_RANGE_PADDING;
        var px__y_range = Math.abs(AXIS_ORIGIN.y - AXIS_TOP)    - PX_RANGE_PADDING;
        // const X_PX_PER_TICK = (px__x_range) / (mohm__x_range); // scale 산출
        // 그래프를 그리기 위해 mOhm 스케일을 px 스케일로 변경하는 함수
        var fn_ohm2px_x = _get_range_convertor(window.g_micro_ohm.range_x(), px__x_range, window.g_micro_ohm.min_x);
        var fn_ohm2px_y = _get_range_convertor(window.g_micro_ohm.range_y(), px__y_range, window.g_micro_ohm.min_y);
        // >>>>>>> 230620 hjkim - x축 레이블을 위한 스케일 컨버터
        var fn_px2ohm_x = _get_range_convertor(px__x_range, window.g_micro_ohm.range_x(), AXIS_ORIGIN.x, window.g_micro_ohm.min_x);
        var fn_px2ohm_y = _get_range_convertor(px__y_range, window.g_micro_ohm.range_y(), AXIS_ORIGIN.y, window.g_micro_ohm.min_y);
        // <<<<<<< 230620 hjkim - x축 레이블을 위한 스케일 컨버터
        // >>>>>>> 230609 hjkim - y값이 양수인 것만 통과
        data = data.filter(function (val, idx, arr) {
            if (val[2] > 0) return true;
            else return false;
        });
        
        // <<<<<<< 230609 hjkim - y값이 양수인 것만 통과
        LegendTable.filename_to_classify(filename, function (date, selected_color, legend_name, class_name) {
            
            // 2. 스캐터 차트 그림
            ctx.save();
            draw_scatter(ctx, data, fn_ohm2px_x, fn_ohm2px_y, selected_color);
            ctx.restore();
            
            // 3. 최대 최소값 표기
            ctx.save();
            draw_minmax(ctx, window.g_micro_ohm, PX_RANGE_PADDING, PX_RANGE_PADDING);
            ctx.restore();
            
            // 4. x축 틱레이블
            ctx.save();
            draw_xtick_label(ctx, fn_px2ohm_x);
            ctx.restore();
            
            // 5. y축 틱레이블
            ctx.save();
            draw_ytick_label(ctx, fn_px2ohm_y);
            ctx.restore();
            
        });
    }
    ImpedanceChart.IImpedanceChart_add_data = IImpedanceChart_add_data;
    function IImpedanceChart_init(placeholder, w = 800, h = 800, is_squared = false) {
        // >>> 240502 hjkim - 정사각형 그래프
        if(is_squared) { var _square = (w < h) ? w : h; w = _square; h = _square; }
        // <<< 240502 hjkim - 정사각형 그래프
        // data = [[], [], [hz, x, y], ..., []];
        // INIT 캔바스 엘리먼트
        var canvas = g_impedence_canvas = init_canvas(placeholder);
		// >>> 250313 hjkim - 레이어 1 추가: xy축 레이블용
		var canvas_layer1 = window.g_canvas_layer1 = init_canvas_layer1(placeholder, "nyq_xy_label");
		canvas_layer1.width  = w; // 너비 고정
        canvas_layer1.height = h; // 높이 고정
		// <<< 250313 hjkim - 레이어 1 추가: xy축 레이블용
        if (canvas == null)
        return;
        var ctx = get_ctx(canvas);
        if (ctx == null)
        return;
        // INIT 캔바스 크기
        // canvas.width = document.body.clientWidth / 2; // 창의 폭의 1/4
        canvas.width  = w; // 너미 고정
        canvas.height = h; // 높이 고정
        // >>> 240502 hjkim - 정사각형 그래프
        if(is_squared == false) canvas.style.width = '100%'; // 캔바스 디스플레이 크기
        // <<< 240502 hjkim - 정사각형 그래프
        // INIT 축설정
        AXIS_ORIGIN = { x: AXIS_MARGIN.l, y: canvas.height - AXIS_MARGIN.t };
        // console.log("#imp / AXIS_ORIGIN: ", AXIS_ORIGIN);
        AXIS_RIGHT = canvas.width - AXIS_MARGIN.r;
        AXIS_WIDTH = AXIS_RIGHT - AXIS_ORIGIN.x;
        AXIS_HEIGHT = AXIS_ORIGIN.y - AXIS_TOP;
        NUM_VERTICAL_TICKS = AXIS_HEIGHT / VERTICAL_TICK_SPACING;
        NUM_HORIZONTAL_TICKS = AXIS_WIDTH / HORIZONTAL_TICK_SPACING;
        // console.log("#imp / NUM_HORIZONTAL_TICKS", NUM_HORIZONTAL_TICKS, AXIS_WIDTH, HORIZONTAL_TICK_SPACING);
        // grid
        ctx.save();
        draw_horizontal_grid(ctx);
        draw_vertical_grid(ctx);
        ctx.restore();
        // draw_grid(ctx, 10, 10);
        
        // 1.축그림
        ctx.save();
        draw_axes(ctx);
        ctx.restore();
        
        // 2.축제목
        ctx.save();
        // draw_ytitle(ctx, AXIS_WIDTH/2, AXIS_ORIGIN.y-AXIS_HEIGHT/2, "-Imag impedance (mΩ)");
        draw_ytitle(ctx, AXIS_ORIGIN.x-20, AXIS_ORIGIN.y+60, "-Imag impedance (mΩ)"); //Eung
        // draw_xtitle(ctx, AXIS_WIDTH/2, AXIS_ORIGIN.y-AXIS_HEIGHT/2, "Real impedance (mΩ)");
        // draw_xtitle(ctx, AXIS_ORIGIN.x/2, AXIS_ORIGIN.y+35, "Real impedance (mΩ)");
        // draw_xtitle(ctx, 0, AXIS_ORIGIN.y+20, "Real impedance (mΩ)"); //Eung
        ctx.restore();
    }
    ImpedanceChart.IImpedanceChart_init = IImpedanceChart_init;
    function _draw_imp_data(data, color, _el, opt) {
        // >>> 240612 hjkim - Refactoring :: Intro. Param. Obj.
        // function _draw_imp_data(data, color, _el, PX_RANGE_PADDING__X = 30, PX_RANGE_PADDING__Y = 30, COMPACT_MODE = 0, SHIFT_X = 50, ack_number = 0, max_x = 500) {
        var PX_RANGE_PADDING__X = (opt == null || opt.PX_RANGE_PADDING__X == null) ? 30 : opt.PX_RANGE_PADDING__X;
        var PX_RANGE_PADDING__Y = (opt == null || opt.PX_RANGE_PADDING__Y == null) ? 30 : opt.PX_RANGE_PADDING__Y;
        var SHIFT_X             = (opt == null || opt.SHIFT_X == null) ? 25 : opt.SHIFT_X;
        var ack_number          = (opt == null || opt.ack_number == null) ? 0 : opt.ack_number;
        
        // >>> 250214 hjkim - max_x가 500~510 사이에서 그래프가 그려질때 생기는 버그
        var max_x = (opt == null || opt.max_x == null) ? 500 : opt.max_x;
        if(TITLE.includes("스택진단")) {
            max_x = (opt == null || opt.max_x == null) ? xsxe_ysye__scope.set_xe : opt.max_x;
        }
        // <<< 250214 hjkim - max_x가 500~510 사이에서 그래프가 그려질때 생기는 버그
        
        // >>> 240613 hjkim - Best Fit
        var BEST_FIT            = (opt == null || opt.BEST_FIT == null) ? null : opt.BEST_FIT;
        var XY_RATIO            = (opt == null || opt.XY_RATIO == null) ? 3.5 : opt.XY_RATIO;
        // <<< 240613 hjkim - Best Fit
        // <<< 240612 hjkim - Refactoring :: Intro. Param. Obj.
        var canvas_el, g_impedence_canvas_el;
        // 
        // 캔버스 식별
        if(0) {}
        else if(TITLE.includes("대시보드")) { canvas_el = _el.querySelector("[id^=\"impedence_graph__\"]"); }
        else if(TITLE.includes("수소전지 그래프")) { 
            canvas_el = document.querySelector("[id^=\"impedence_graph__\"]"); 
            g_impedence_canvas_el = canvas_el;
        } else canvas_el = _el.querySelector("canvas");
        // 
        if (canvas_el == null) { alert("캔바스를 찾을 수 없습니다."); return; }
        var ctx = get_ctx(canvas_el);
        if (ctx == null) { alert("캔바스 컨텍스트를 찾을 수 없습니다."); return; }
		
		// >>> 250313 hjkim - 레이어 1 추가: xy축 레이블용
		let ctx_layer1 = g_canvas_layer1.getContext("2d");
		// <<< 250313 hjkim - 레이어 1 추가: xy축 레이블용
        // 
        // 스케일 조정을 위한 변수 계산
        var idx = { HZ: 0, X: 1, Y: 2,
            0: "HZ", 1: "X", 2: "Y" };
        // 
        // >>> 250214 hjkim - 초과 범위 표시
        let max_x_in_series = data.reduce(function (acc, d) { return d[idx.X] > acc[idx.X] ? d : acc; })[idx.X];
        let min_x_in_series = data.reduce(function (acc, d) { return d[idx.X] < acc[idx.X] ? d : acc; })[idx.X];
        let max_y_in_series = data.reduce(function (acc, d) { return d[idx.Y] > acc[idx.Y] ? d : acc; })[idx.Y];
        let min_y_in_series = data.reduce(function (acc, d) { return d[idx.Y] < acc[idx.Y] ? d : acc; })[idx.Y];
        if(TITLE.includes("스택진단")) { // 스택진단일 경우, 넘어가는 값을 빨간색으로 표현
            let _input_arr = document.querySelectorAll(".widget.stack-state-graph .float-end .graph input");
            if(min_x_in_series < xsxe_ysye__scope.xs) { window.all_min_x = xsxe_ysye__scope.xs; _input_arr[1].style = "border: 2px solid black;"; }
            if(max_x_in_series > xsxe_ysye__scope.xe) { window.all_max_x = xsxe_ysye__scope.xe; _input_arr[2].style = "border: 2px solid black;"; }
            if(min_y_in_series < xsxe_ysye__scope.ys) { window.all_min_y = xsxe_ysye__scope.ys; _input_arr[3].style = "border: 2px solid black;"; }
            if(max_y_in_series > xsxe_ysye__scope.ye) { window.all_max_y = xsxe_ysye__scope.ye; _input_arr[4].style = "border: 2px solid black;"; }
        }
        // <<< 250214 hjkim - 초과 범위 표시

        // 고정좌표계
        if (window.g_micro_ohm.init == false) { // init = false 시점 이후 그려지는 모든 시계열 그룹에 대해서
            // >>> 250217 hjkim - 초과 범위(아웃라이어) 표시
            if(TITLE.includes("스택진단")) {
                window.g_micro_ohm.min_x = opt.min_x;
                window.g_micro_ohm.max_x = opt.max_x;
                window.g_micro_ohm.min_y = 0;
                window.g_micro_ohm.max_y = opt.max_y;
            } else {
                window.g_micro_ohm.min_x = min_x_in_series;
                window.g_micro_ohm.max_x = max_x_in_series;
                window.g_micro_ohm.min_y = 0;
                window.g_micro_ohm.max_y = max_y_in_series;
            }
            console.log("#g_micro_ohm.min_x : ", window.g_micro_ohm.min_x);
            console.log("#g_micro_ohm.min_y : ", window.g_micro_ohm.min_y);
            console.log("#g_micro_ohm.max_x : ", window.g_micro_ohm.max_x);
            console.log("#g_micro_ohm.max_y : ", window.g_micro_ohm.max_y);
            // <<< 250217 hjkim - 초과 범위(아웃라이어) 표시
            window.g_micro_ohm.max_x+= SHIFT_X;

            // >>> 250213 hjkim - FIX 체크 되었을 경우, max와 min값 고정
            if(TITLE.includes("스택진단") && is_xsxeysye_checked()) { 
                window.g_micro_ohm.max_x = xsxe_ysye__scope.xe;
                window.g_micro_ohm.min_x = xsxe_ysye__scope.xs;
                window.g_micro_ohm.max_y = xsxe_ysye__scope.ye;
                window.g_micro_ohm.min_y = xsxe_ysye__scope.ys;
            }
            // <<< 250213 hjkim - FIX 체크 되었을 경우, max와 min값 고정
        }

        // >>> 250217 hjkim - 원점 체크시 범위 재조정
        if(TITLE.includes("스택진단") && getLocalStorage(`${PLANT_FOLDER()}/${STACK_NAME()}/org_chk`) == 'true') {
            window.g_micro_ohm.min_x = 0;
            window.g_micro_ohm.max_x = (opt.max_x - opt.min_x)+SHIFT_X;
            xsxe_ysye__scope.xe = (opt.max_x - opt.min_x);
            SHIFT_X = 0;
        }
        // <<< 250217 hjkim - 원점 체크시 범위 재조정
        
        // console.log(`imp.js / min_x(${g_micro_ohm.min_x}), max_x(${g_micro_ohm.max_x})`);
        var px__x_range = Math.abs(AXIS_ORIGIN.x - AXIS_RIGHT) - PX_RANGE_PADDING__X;
        var px__y_range = Math.abs(AXIS_ORIGIN.y - AXIS_TOP) - PX_RANGE_PADDING__Y;
        // const X_PX_PER_TICK = (px__x_range) / (g_micro_ohm.range_x()); // scale 산출
        // 그래프를 그리기 위해 mOhm 스케일을 px 스케일로 변경하는 함수
        function _range(max, min) { const _circle_radius = 10; return max-min+_circle_radius; }

        // >>> 250217 hjkim - CONV 함수도 한번만 init
        if (window.g_micro_ohm.init == false) { // init = false 시점 이후 그려지는 모든 시계열 그룹에 대해서
        // >>> 250217 hjkim - CONV 함수도 한번만 init
            // >>> 250121 hjkim - 스택 그래프 사이즈 조정
            switch(BEST_FIT) {
                case "Y_FIT":
                    XY_RATIO = 0.285;
                    SHIFT_X = _range(window.g_micro_ohm.max_y, window.g_micro_ohm.min_y) * 0.1; // point 범위의 1%를 패딩
                    
                    // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
                    // px__y_range-= px__y_range*0.2; // 캔바스 범위의 20%를 패딩
                    // let y_range = _range(window.g_micro_ohm.max_y, window.g_micro_ohm.min_y);
                    let y_range = _range(opt.yaxis_max, 0);
                    window.fn_mohm2px_x = _get_range_convertor(y_range/XY_RATIO, px__x_range, window.g_micro_ohm.min_x);
                    window.fn_mohm2px_y = _get_range_convertor(y_range, px__y_range, window.g_micro_ohm.min_y, 0);
                    // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
                break;
                default:
                    // >>> 250328 kjlee - x_range를 잘못 계산한 버그
                    let x_range = _range(opt != undefined ? opt.xaxis_max : g_micro_ohm.max_x, 0);
                    // >>> 250423 jhkim - xaxis_max -> opt.xaxis_max로 변경 후 안 그려지던 그래프도 그려짐
                    // <<< 250328 kjlee - x_range를 잘못 계산한 버그
                    // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
                    //let x_range = _range(window.g_micro_ohm.max_x, 0);
                    window.fn_mohm2px_x = _get_range_convertor(x_range, px__x_range, window.g_micro_ohm.min_x, SHIFT_X);
                    window.fn_mohm2px_y = _get_range_convertor(x_range/XY_RATIO, px__y_range, window.g_micro_ohm.min_y, 0);
                    // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
                break;
            }
        // >>> 250217 hjkim - CONV 함수도 한번만 init
            window.g_micro_ohm.init = true;
        }
        // >>> 250217 hjkim - CONV 함수도 한번만 init
            // <<< 250121 hjkim - 스택 그래프 사이즈 조정
        // >>>>>>> 230609 hjkim - y값이 양수인 것만 통과
        data = data.filter(function (val, idx, arr) {
            if (val[2] > 0) return true;
            else return false;
        });
        // <<<<<<< 230609 hjkim - y값이 양수인 것만 통과


        // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
        if(TITLE.includes("스택진단") && is_xsxeysye_checked()) { 
            opt.xaxis_max = xsxe_ysye__scope.xe;
            opt.yaxis_max = xsxe_ysye__scope.ye;
        }
        // <<< 250321 hjkim - x,y 축 최대값 올림값 산출

        // >>> 250306 hjkim - Nyq. 축레이블
        if(TITLE.includes("스택진단")) {
            // let px__x_range = fn_mohm2px_x(window.g_micro_ohm.max_x) - fn_mohm2px_x(window.g_micro_ohm.min_x);
            let px__x_range = fn_mohm2px_x(window.g_micro_ohm.max_x)+52;
            window.px__x_range_debug = px__x_range;
            // window.fn_px2ohm_x = _get_range_convertor2( window.g_micro_ohm.range_x(),                px__x_range,   window.g_micro_ohm.min_x, AXIS_ORIGIN.x);
            // window.fn_px2ohm_y = _get_range_convertor2((window.g_micro_ohm.range_x() * XY_RATIO)+50, px__y_range,   window.g_micro_ohm.min_y, AXIS_ORIGIN.y);
            // 4. x축 틱레이블
            ctx_layer1.save();
            if(window.is_draw_xtick_label == undefined || window.is_draw_xtick_label == false) {
                
                // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
                if(BEST_FIT == "Y_FIT") {
                    draw_xtick_label2(ctx_layer1, [0, opt.yaxis_max/XY_RATIO], AXIS_RIGHT);
                } else {
                    draw_xtick_label2(ctx_layer1, [0, opt.xaxis_max], AXIS_RIGHT);
                }
                // draw_xtick_label(ctx_layer1, window.fn_px2ohm_x, AXIS_RIGHT);
                // draw_xtick_label(ctx, window.fn_px2ohm_x, fn_mohm2px_x(window.g_micro_ohm.max_x));
                // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
                window.is_draw_xtick_label = true;
            }
            ctx_layer1.restore();
            
            // 5. y축 틱레이블
            ctx_layer1.save();
            if(window.is_draw_ytick_label == undefined || window.is_draw_ytick_label == false) {
                
                // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
                if(BEST_FIT == "Y_FIT") {
                    draw_ytick_label2(ctx_layer1, [0, opt.yaxis_max]);
                } else {
                    draw_ytick_label2(ctx_layer1, [0, opt.xaxis_max/XY_RATIO]);
                }
                // draw_ytick_label2(ctx_layer1, window.fn_px2ohm_y);
                // draw_ytick_label(ctx_layer1, window.fn_px2ohm_y);
                // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
                window.is_draw_ytick_label = true;
            }
            ctx_layer1.restore();
        }
        // <<< 250306 hjkim - Nyq. 축레이블


        // 2. 스캐터 차트 그림
        ctx.save();
        console.log("draw_scatter 호출 전 color:", color);
        draw_scatter(ctx, data, window.fn_mohm2px_x, window.fn_mohm2px_y, color);
        ctx.restore();
    }
    ImpedanceChart._draw_imp_data = _draw_imp_data ;

    function IAdd_series_in_imp_graph(e, url, color) {
        if (color === void 0) { color = "blue"; }
        g_is_init_impedance_graph = true;
        g_is_init_ref_table = true;
        var doc = e.target.parentElement;
        var legend_el = doc.querySelector(".legend-table__signifier");
        if(window.g_DEBUG) console.log("legend_el", legend_el);
        // 토글기능
        if (legend_el != null && legend_el.innerHTML == "○") {
            // ------------------------- 토글 체크
            legend_el.innerHTML = "●";
            // 범례데이터 가져오기
            fopen(url, function (res) {
                if(window.g_DEBUG) {
                    console.log("IAdd_series_in_imp_graph BEFOR(res) : ", res);
                }
                var data = _parse_imp_data(res, function (arr) {
                    // ohm -> mohm 단위변환
                    arr[1] *= M_OHM; // x: Real Imp
                    arr[2] *= M_OHM * -1; // y: -Imag Imp
                });
                if(window.g_DEBUG) {
                    console.log("IAdd_series_in_imp_graph AFTER(data[0..2]) : ", data[0], data[1], data[2]);
                }
                // 그래프에 추가
                _draw_imp_data(data, color);

                // >>>>>>> 230731 hjkim - 체크 해제를 위해 추가된 그래프들은 저장
                // this.drawn_imp_data[url] = { data: data, color: color };
                window.g_drawn_imp_data[url] = { data: data, color: color };
                if(window.g_DEBUG) console.log(window.g_drawn_imp_data);
                // <<<<<<< 230731 hjkim - 체크 해제를 위해 추가된 그래프들은 저장ㄴ
            });
            
        } else if(legend_el != null) {
            // ------------------------- 토글 해제
            legend_el.innerHTML = "○";

            // 1. URL링크 삭제
            if(window.g_DEBUG) console.log("del before:", window.g_drawn_imp_data);
            delete window.g_drawn_imp_data[url];
            if(window.g_DEBUG) console.log("del after :", window.g_drawn_imp_data);
            
            // 2. 그래프 클리어
            ImpedanceChart.IClear_imp_graph_handler("GRAPH_ONLY");

            var keys = Object.keys(window.g_drawn_imp_data);
            if(window.g_DEBUG) console.log("keys:", keys);
            for(var i = 0; i < keys.length; i += 1) {
                var val = window.g_drawn_imp_data[keys[i]];
                // ImpedanceGraph.draw_imp_data(val.data, val.color, window.impedance_graph);
                _draw_imp_data(val.data, val.color);
            }
        } else {
		/* ====================================================
		 * 범례가 없는 경우
		 * ======================================================*/
        if(TITLE.includes("대시보드") || TITLE.includes("스택진단")) {
            // 범례데이터 가져오기
            fopen(url, function (res) {
                if(window.g_DEBUG) {
                    console.log("IAdd_series_in_imp_graph BEFOR(res) : ", res);
                }
                var data = _parse_imp_data(res, function (arr) {
                    // ohm -> mohm 단위변환
                    arr[1] *= M_OHM; // x: Real Imp
                    arr[2] *= M_OHM * -1; // y: -Imag Imp
                });
                if(window.g_DEBUG) {
                    console.log("IAdd_series_in_imp_graph AFTER(data[0..2]) : ", data[0], data[1], data[2]);
                }
                // 그래프에 추가
                _draw_imp_data(data, color, e.target);
                
                // >>>>>>> 230731 hjkim - 체크 해제를 위해 추가된 그래프들은 저장
                // this.drawn_imp_data[url] = { data: data, color: color };
                window.g_drawn_imp_data[url] = { data: data, color: color };
                if(window.g_DEBUG) console.log(window.g_drawn_imp_data);
                // <<<<<<< 230731 hjkim - 체크 해제를 위해 추가된 그래프들은 저장ㄴ
            });
        }
	}
    }
    ImpedanceChart.IAdd_series_in_imp_graph = IAdd_series_in_imp_graph;
    /* -------------------------------------------------------------------------- */
    /*                                FUNCTION SET                                */
    /* -------------------------------------------------------------------------- */
	// >>> 250313 hjkim - 레이어 1 추가: xy축 레이블용
	function init_canvas_layer1(container, layer_name) {
		if(container == null) { console.error("레이어 캔바스를 만들 컨테이너가 지정되지 않았습니다."); return null; }
		else {
			let c = document.createElement("canvas");
			c.id = layer_name + new Date().getTime();
			c.className = layer_name;
			c.style = ` width: 100%; height: 100%; position: absolute; top: 0; left: 0;`;
			container.appendChild(c);
			return c;
		}
	}
	// <<< 250313 hjkim - 레이어 1 추가: xy축 레이블용
    function init_canvas(container) {
        if (container == null) {
            console.error("그래프를 그릴 컨테이너가 없습니다.");
            return null;
        }
        else {
            container.style.position = "relative";
            var c = document.createElement("canvas");
            c.id = "impedence_graph__" + new Date().getTime();
            c.className = "impedence_graph";
            container.appendChild(c);
            return c;
        }
    }
    function get_ctx(canvas) {
        try {
            var ctx = canvas.getContext("2d");
            if (ctx == null) {
                console.error(".barcode_chart 캔버스 요소의 2D 문맥을 얻을 수 없습니다.");
            }
            return ctx;
        }
        catch (error) {
            console.error("캔버스 요소의 2D 문맥을 얻는 동안 에러가 발생함:", error);
            return null;
        }
    }
    // >>> 250217 hjkim - 스택진단 그래프에서 레이블이 겹치는 현상 수정
    window.series_cnt = 0;
    // <<< 250217 hjkim - 스택진단 그래프에서 레이블이 겹치는 현상 수정
    function draw_scatter(ctx, data, x_conv, y_conv, color) {
        if (color === void 0) { color = "blue"; }
        // >>> 250217 hjkim - 스택진단 그래프에서 레이블이 겹치는 현상 수정
        window.series_cnt++;
        // <<< 250217 hjkim - 스택진단 그래프에서 레이블이 겹치는 현상 수정
        for (var i = 0; i < data.length; i += 1) {
            var x = data[i][1];
            var y_1 = data[i][2];
            var x_px = x_conv(x);
            var y_px = y_conv(y_1);
            if(isNaN(x) || isNaN(y_1)) {
                console.log("draw_scatter(x,y):", x, y);
                console.log("draw_scatter(x_px,y_px):", x_px, y_px);
            }
            x_px = Math.round(AXIS_ORIGIN.x + x_px);
            y_px = Math.round(AXIS_ORIGIN.y - y_px);
            // STK  STYLE
            ctx.strokeStyle = color;
            var radius = 5;
            ctx.beginPath();
            ctx.arc(x_px, y_px, radius, 0, Math.PI * 2);
            ctx.stroke();
            // >>> 250217 hjkim - 처음과 끝점 검은점으로 표시 출력
            if(i == 0 || i == data.length-1) { 
                ctx.beginPath();
                ctx.strokeStyle = "#000000";
                ctx.arc(x_px, y_px, 1, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.strokeStyle = color;
            // <<< 250217 hjkim - 처음과 끝점 검은점으로 표시 출력
            // >>>>>>> 230620 hjkim - DEBUG
            if(i == 0 || i == data.length-1) { // 처음과 끝에 출력
                ctx.font = "13 px sans-serif";
                ctx.textAlign = "center";
                var value = `(${Math.round(x)}, ${Math.round(y_1)})`;
                // >>> 250217 hjkim - 스택진단 그래프에서 레이블이 겹치는 현상 수정
                // ctx.fillText(value, x_px, y_px-10 - (window.series_cnt*5) );
                ctx.fillText(value, x_px, y_px-10);
                // <<< 250217 hjkim - 스택진단 그래프에서 레이블이 겹치는 현상 수정
            }
            // <<<<<<< 230620 hjkim - DEBUG
        }
    }
    // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
    function draw_xtick_label2(ctx, min_max, RIGHT_END) {
        var TICKS = 27 * 2;
        var TICK_SPACING = AXIS_WIDTH / TICKS;

        const MIDDLE_OF_X_PX = 345;
        const WIDTH_OF_WINDOW = 80
        ctx.save();
        var SIZE = 13;
        ctx.font = SIZE + "px sans-serif";
        ctx.textAlign = "center";

        let min = min_max[0];
        let max = min_max[1];
        let kan = 51;
        let arr = Array.from({length: kan}, (_, i) => min + (i * (max - min)) / (kan - 1));
        var x_px = AXIS_MARGIN.l-5;
        arr.map((d, i) => {
            if(i % 2 == 0) {
                let tick_value = d;
                ctx.save();
                ctx.translate(x_px, AXIS_ORIGIN.y+15);
                ctx.rotate(Math.PI / 2);
                // ctx.fillText(tick_value, x_px, AXIS_ORIGIN.y+15);
                if(tick_value > 1000) {
                    tick_value = Math.round(tick_value / 1000) + "K";
                } else tick_value = Math.round(tick_value);
                ctx.fillText(tick_value, 0, 0);
                ctx.restore();
            }
                x_px += TICK_SPACING;
        });
        ctx.restore();
    }
    // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
    // >>>>>>> 230620 hjkim - x축 틱 레이블
    function draw_xtick_label(ctx, px2data, RIGHT_END) {
        var TICKS = 27 * 2;
        var TICK_SPACING = AXIS_WIDTH / TICKS;

        const MIDDLE_OF_X_PX = 345;
        const WIDTH_OF_WINDOW = 80
        ctx.save();
        var SIZE = 13;
        ctx.font = SIZE + "px sans-serif";
        ctx.textAlign = "center";
        // for(var x_px = AXIS_ORIGIN.x; x_px < RIGHT_END-50; x_px += 50) {
        for(var x_px = AXIS_ORIGIN.x-5; x_px < RIGHT_END; x_px += TICK_SPACING) {
            var tick_value = Math.round(px2data(x_px));
            let round_up = Math.round((tick_value/100)*100);
            if((tick_value - round_up) < 100) {
                //if(x_px < MIDDLE_OF_X_PX - WIDTH_OF_WINDOW || x_px > MIDDLE_OF_X_PX + WIDTH_OF_WINDOW) {
                ctx.save();
                ctx.translate(x_px, AXIS_ORIGIN.y+15);
                ctx.rotate(Math.PI / 2);
                // ctx.fillText(tick_value, x_px, AXIS_ORIGIN.y+15);
                ctx.fillText(tick_value, 0, 0);
                ctx.restore();
                //}
            }
        }
        // var last_tick_value = px2data(RIGHT_END);
        // ctx.save();
        // ctx.translate(RIGHT_END, AXIS_ORIGIN.y+15);
        // ctx.fillText(Math.round(last_tick_value), 0, 0);
        // ctx.restore();
        ctx.restore();
    }
    function draw_xtick_label(ctx, px2data, RIGHT_END) {
        var TICKS = 27 * 2;
        var TICK_SPACING = AXIS_WIDTH / TICKS;

        const MIDDLE_OF_X_PX = 345;
        const WIDTH_OF_WINDOW = 80
        ctx.save();
        var SIZE = 13;
        ctx.font = SIZE + "px sans-serif";
        ctx.textAlign = "center";
        // for(var x_px = AXIS_ORIGIN.x; x_px < RIGHT_END-50; x_px += 50) {
        for(var x_px = AXIS_ORIGIN.x-5; x_px < RIGHT_END; x_px += TICK_SPACING) {
            var tick_value = Math.round(px2data(x_px));
            let round_up = Math.round((tick_value/100)*100);
            if((tick_value - round_up) < 100) {
                //if(x_px < MIDDLE_OF_X_PX - WIDTH_OF_WINDOW || x_px > MIDDLE_OF_X_PX + WIDTH_OF_WINDOW) {
                ctx.save();
                ctx.translate(x_px, AXIS_ORIGIN.y+15);
                ctx.rotate(Math.PI / 2);
                // ctx.fillText(tick_value, x_px, AXIS_ORIGIN.y+15);
                ctx.fillText(tick_value, 0, 0);
                ctx.restore();
                //}
            }
        }
        // var last_tick_value = px2data(RIGHT_END);
        // ctx.save();
        // ctx.translate(RIGHT_END, AXIS_ORIGIN.y+15);
        // ctx.fillText(Math.round(last_tick_value), 0, 0);
        // ctx.restore();
        ctx.restore();
    }
    // <<<<<<< 230620 hjkim - x축 틱 레이블
    
    // >>> 250321 hjkim - x,y 축 최대값 올림값 산출
    function draw_ytick_label2(ctx, min_max) {
        const TICKS = 35;
        const TICK_SPACING = AXIS_HEIGHT / TICKS;

        const MIDDLE_OF_Y_PX = 345;
        const WIDTH_OF_WINDOW = 80
        ctx.save();
        var SIZE = 13;
        ctx.font = SIZE + "px sans-serif";
        ctx.textAlign = "center";

        let min = min_max[0];
        let max = min_max[1];
        let kan = 36;
        let arr = Array.from({length: kan}, (_, i) => min + (i * (max - min)) / (kan - 1));
        var TOP_END = AXIS_TOP;
        var y_px = AXIS_HEIGHT+AXIS_TOP;
        arr.map((d, i) => {
            if(i % 2 == 0) {
                let tick_value = Math.round(d);
                let round_up = Math.round((tick_value/100)*100);
                    if(y_px < MIDDLE_OF_Y_PX - WIDTH_OF_WINDOW || y_px > MIDDLE_OF_Y_PX + WIDTH_OF_WINDOW) {
                        if(tick_value > 1000) {
                            tick_value = Math.round(tick_value / 1000) + 'K';
                        }
                        ctx.fillText(tick_value, AXIS_ORIGIN.x-20, y_px+5);
                    }
            }
            y_px -= TICK_SPACING;
        });
        
        // var last_tick_value = y_px;
        // ctx.fillText(Math.round(last_tick_value), AXIS_ORIGIN.x-20, TOP_END);
        ctx.restore();
    }
    // <<< 250321 hjkim - x,y 축 최대값 올림값 산출
    // >>>>>>> 230623 hjkim - y축 틱 레이블
    function draw_ytick_label(ctx, px2data) {
        const TICKS = 35;
        const TICK_SPACING = AXIS_HEIGHT / TICKS;

        const MIDDLE_OF_Y_PX = 345;
        const WIDTH_OF_WINDOW = 80
        ctx.save();
        var SIZE = 13;
        ctx.font = SIZE + "px sans-serif";
        ctx.textAlign = "center";
        var TOP_END = AXIS_TOP;
        // for(var y_px = AXIS_ORIGIN.y; y_px > TOP_END; y_px -= 100) {
        for(var y_px = AXIS_ORIGIN.y; y_px > TOP_END; y_px -= TICK_SPACING) {
            var tick_value = Math.abs(Math.round(px2data(y_px)));
            let round_up = Math.round((tick_value/100)*100);
            if((tick_value - round_up) < 100) {
                if(y_px < MIDDLE_OF_Y_PX - WIDTH_OF_WINDOW || y_px > MIDDLE_OF_Y_PX + WIDTH_OF_WINDOW) {
                    ctx.fillText(tick_value, AXIS_ORIGIN.x-20, y_px+5);
                }
            }
            
        }
        var last_tick_value = Math.abs(px2data(TOP_END));
        ctx.fillText(Math.round(last_tick_value), AXIS_ORIGIN.x-20, TOP_END);
        ctx.restore();
    }
    // <<<<<<< 230623 hjkim - y축 틱 레이블
    
    // function draw_grid(ctx, step_x, step_y) {
    //     ctx.strokeStyle = 'lightgray';
    //     ctx.lineWidth = 0.5;
    //     // 세로 선
    //     for (var i = step_x + 0.5; i < ctx.canvas.width; i += step_x) {
    //         ctx.beginPath();
    //         ctx.moveTo(i, 0);
    //         ctx.lineTo(i, ctx.canvas.height);
    //         ctx.stroke();
    //     }
    //     // 가로 선
    //     for (var i = step_y + 0.5; i < ctx.canvas.height; i += step_y) {
    //         ctx.beginPath();
    //         ctx.moveTo(0, i);
    //         ctx.lineTo(ctx.canvas.width, i);
    //         ctx.stroke();
    //     }
    // }
    function draw_title(ctx, x, y, text) {
        if (text === void 0) { text = "Title"; }
        ctx.save();
        var SIZE = 12;
        if(TITLE.includes("수소전지 그래프")) {
            SIZE = 18;
        }
        ctx.font = SIZE + "px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(text, x, y - (SIZE / 2));
        ctx.restore();
    }
    function draw_xtitle(ctx, x, y, text) {
        if (text === void 0) { text = "YTitle"; }
        ctx.save();
        var SIZE = 11; //Eung
        if(TITLE.includes("수소전지 그래프")) {
            SIZE = 18;
        }
        ctx.font = SIZE + "px sans-serif";
        ctx.textAlign = "left";
        ctx.translate(x, y);
        ctx.fillText(text, AXIS_HEIGHT / 2, 0);
        ctx.restore();
    }
    
    function draw_ytitle(ctx, x, y, text) {
        if (text === void 0) { text = "YTitle"; }
        ctx.save();
        var SIZE = 11; //EUNG
        if(TITLE.includes("수소전지 그래프")) {
            SIZE = 18;
        }
        ctx.font = SIZE + "px sans-serif";
        ctx.textAlign = "left";
        ctx.translate(x, y);
        // ctx.rotate(-Math.PI/4);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(text, AXIS_HEIGHT / 2, 0);
        ctx.restore();
    }
    
    function draw_axes(ctx) {
        ctx.save();
        // Axis Style
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'black';
        _draw_horizontal_axis(ctx);
        _draw_vertical_axis(ctx);
        _draw_horizontal_axis_top(ctx);
        _draw_vertical_axis_right(ctx);
        // Tick Style
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = 'black';
        _draw_horizontal_axis_ticks(ctx);
        _draw_vertical_axis_ticks(ctx);
        _draw_horizontal_axis_ticks_top(ctx);
        _draw_vertical_axis_ticks_right(ctx);
        ctx.restore();
    }
    function draw_minmax(ctx, min_max, maxx_right_end=0, maxy_up_end=0) {
        var PADDING_POS = 30;
        ctx.save();
        var minx_text  = `|<--${Math.round(min_max.min_x)}(min_x)`;
        var maxx_text = `(max x)${Math.round(min_max.max_x)}-->|`;
        var miny_text  = `|<--${Math.round(min_max.min_y)}(min_y)`;
        var maxy_text = `(max_y)${Math.round(min_max.max_y)}-->|`;
        var SIZE = 13;
        ctx.fillStyle = "red";
        ctx.font = `${SIZE}px sans-serif`;
        ctx.textAlign = "left";
        ctx.translate(AXIS_ORIGIN.x, AXIS_ORIGIN.y);
        ctx.rotate(-Math.PI / 2);
        ctx.textAlign = "left";
        ctx.fillText(miny_text, 0, -PADDING_POS-5);
        ctx.textAlign = "right";
        ctx.fillText(maxy_text, AXIS_HEIGHT-maxy_up_end, -PADDING_POS-5);
        ctx.restore();
        
        ctx.save();
        ctx.fillStyle = "red";
        ctx.font = `${SIZE}px sans-serif`;
        ctx.textAlign = "left";
        ctx.fillText(minx_text,  AXIS_ORIGIN.x, AXIS_ORIGIN.y+PADDING_POS);
        ctx.textAlign = "right";
        ctx.fillText(maxx_text, AXIS_RIGHT-maxx_right_end, AXIS_ORIGIN.y+PADDING_POS);
        ctx.restore();
    }
    function _draw_horizontal_axis(ctx) {
        /* 0.5를 더해주는 이유는 (어떠 어떠한 이유로 해서) 결과적으로 라인이 더 뚜렷하게 나오기 때문이다. */
        ctx.beginPath();
        ctx.moveTo(AXIS_ORIGIN.x + 0.5, AXIS_ORIGIN.y + 0.5);
        ctx.lineTo(AXIS_RIGHT + 0.5, AXIS_ORIGIN.y + 0.5);
        ctx.stroke();
    }
    function _draw_horizontal_axis_top(ctx) {
        ctx.beginPath();
        ctx.moveTo(AXIS_ORIGIN.x + 0.5, AXIS_TOP + 0.5);
        ctx.lineTo(AXIS_RIGHT + 0.5, AXIS_TOP + 0.5);
        ctx.stroke();
    }
    function _draw_vertical_axis(ctx) {
        ctx.beginPath();
        ctx.moveTo(AXIS_ORIGIN.x + 0.5, AXIS_ORIGIN.y + 0.5);
        ctx.lineTo(AXIS_ORIGIN.x + 0.5, AXIS_TOP + 0.5);
        ctx.stroke();
    }
    function _draw_vertical_axis_right(ctx) {
        ctx.beginPath();
        ctx.moveTo(AXIS_RIGHT + 0.5, AXIS_ORIGIN.y + 0.5);
        ctx.lineTo(AXIS_RIGHT + 0.5, AXIS_TOP + 0.5);
        ctx.stroke();
    }
    function _draw_vertical_axis_ticks(ctx) {
        var delta_x;
        var TICKS = 35;
        var TICK_SPACING = AXIS_HEIGHT / TICKS;
        for (var i = 1; i < TICKS; ++i) {
            ctx.beginPath();
            if (i % 5 === 0)
            delta_x = TICK_WIDTH * 1.5;
            else
            delta_x = TICK_WIDTH;
            ctx.moveTo(AXIS_ORIGIN.x, 0.5 + AXIS_ORIGIN.y - i * TICK_SPACING);
            ctx.lineTo(AXIS_ORIGIN.x + delta_x, 0.5 + AXIS_ORIGIN.y - i * TICK_SPACING);
            ctx.stroke();
        }
    }
    function _draw_vertical_axis_ticks_right(ctx) {
        var delta_x;
        var TICKS = 35;
        var TICK_SPACING = AXIS_HEIGHT / TICKS;
        for (var i = 1; i < TICKS; ++i) {
            ctx.beginPath();
            if (i % 5 === 0)
            delta_x = TICK_WIDTH * 1.5;
            else
            delta_x = TICK_WIDTH;
            ctx.moveTo(AXIS_RIGHT, 0.5 + AXIS_ORIGIN.y - i * TICK_SPACING);
            ctx.lineTo(AXIS_RIGHT - delta_x, 0.5 + AXIS_ORIGIN.y - i * TICK_SPACING);
            ctx.stroke();
        }
    }
    function _draw_horizontal_axis_ticks(ctx) {
        var delta_y;
        var TICKS = 27 * 2;
        var TICK_SPACING = AXIS_WIDTH / TICKS;
        for (var i = 1; i < TICKS; ++i) {
            ctx.beginPath();
            if (i % 5 === 0)
            delta_y = TICK_WIDTH * 1.5;
            else
            delta_y = TICK_WIDTH;
            ctx.moveTo(0.5 + AXIS_ORIGIN.x + i * TICK_SPACING, AXIS_ORIGIN.y - delta_y);
            ctx.lineTo(0.5 + AXIS_ORIGIN.x + i * TICK_SPACING, AXIS_ORIGIN.y);
            ctx.stroke();
        }
    }
    function _draw_horizontal_axis_ticks_top(ctx) {
        var delta_y;
        var TICKS = 27 * 2;
        var TICK_SPACING = AXIS_WIDTH / TICKS;
        for (var i = 1; i < TICKS; ++i) {
            ctx.beginPath();
            if (i % 5 === 0)
            delta_y = TICK_WIDTH * 1.5;
            else
            delta_y = TICK_WIDTH;
            ctx.moveTo(0.5 + AXIS_ORIGIN.x + i * TICK_SPACING, AXIS_TOP);
            ctx.lineTo(0.5 + AXIS_ORIGIN.x + i * TICK_SPACING, AXIS_TOP + delta_y);
            ctx.stroke();
        }
    }
    function draw_horizontal_grid(ctx) {
        var TICKS = 35;
        var TICK_SPACING = AXIS_HEIGHT / TICKS;
        ctx.strokeStyle = 'lightgray';
        for (var i = 1; i < TICKS; ++i) {
            ctx.beginPath();
            ctx.moveTo(AXIS_RIGHT, 0.5 + AXIS_ORIGIN.y - i * TICK_SPACING);
            ctx.lineTo(AXIS_RIGHT - AXIS_WIDTH, 0.5 + AXIS_ORIGIN.y - i * TICK_SPACING);
            ctx.stroke();
        }
        ctx.strokeStyle = 'black';
    }
    function draw_vertical_grid(ctx) {
        var TICKS = 27 * 2;
        var TICK_SPACING = AXIS_WIDTH / TICKS;
        ctx.strokeStyle = 'lightgray';
        for (var i = 1; i < TICKS; ++i) {
            ctx.beginPath();
            ctx.moveTo(0.5 + AXIS_ORIGIN.x + i * TICK_SPACING, AXIS_TOP);
            ctx.lineTo(0.5 + AXIS_ORIGIN.x + i * TICK_SPACING, AXIS_TOP + AXIS_HEIGHT);
            ctx.stroke();
        }
        ctx.strokeStyle = 'black';
    }

    function IClear_imp_graph_handler(type = "GRAPH_ONLY") {
        ImpedanceChart.IClear_imp_graph(type);
    }
    ImpedanceChart.IClear_imp_graph_handler = IClear_imp_graph_handler;

    function IClear_imp_graph(type = "ALL") {
        // 그래프 초기화
        g_is_init_impedance_graph = false;
        g_is_init_ref_table = false;
        window.g_micro_ohm.init = false;
        var impedance_graph_el = document.querySelector("#imp_graph");
        impedance_graph_el.innerHTML = "";
        
        // 그래프 그리기
        IImpedanceChart_init(impedance_graph_el);

        switch(type) {
            default:
            case "ALL":
                // 키워드 입력부 클리어
                var filter_input_el = document.querySelector("#filterInput");
                filter_input_el.value = "";

                window.g_drawn_imp_data = {}; // 캐시데이터 삭제
                // 필터요소 초기화
                var filter_input_el = document.querySelector("#filterInput");
                filter_input_el.value = "";
                // >>> 기존코드
                // 범례 테이블 갱신
                // window.legend_table.refresh(window.g_filtered_imp_data_list);
                // <<< 기존코드
                // 범례 갱신
                var _base_url = window.g_imp_base_url_list[window.g_imp_base_url_sel];
                var data_tbl_el = document.querySelector("#ref_table");
                window.g_legend_table = new LegendTable(data_tbl_el, _base_url);
                break;
            case "GRAPH_ONLY":
                break;
        }
    }
    ImpedanceChart.IClear_imp_graph = IClear_imp_graph;

    function _parse_imp_data(d, cb) {
        var r = [];
        var arr = d.split("\n");
        for (var i = 0; i < arr.length; i++) {
            var arr_arr = [];
            arr_arr = arr[i].split(" ");
            if(window.g_DEBUG) {
                console.log("_parse_imp_data(arr_arr) : ", arr_arr);
            }
            var z = Number(arr_arr[0]);
            var x = Number(arr_arr[1]);
            var y = Number(arr_arr[2]);
            var arr_arr_n = [z, x, y];
            if(window.g_DEBUG) {
                console.log("_parse_imp_data(arr_arr_n) : ", arr_arr_n);
            }
            cb(arr_arr_n);
            r.push(arr_arr_n);
        }
        return r;
    }
    function fopen(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    callback(xhr.responseText.trim());
                    return true;
                }
                else
                return false;
            }
            else
            return false;
        };
        xhr.send();
    }
    function _string_to_color(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var color = '#';
        for (var i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }

    function IAllClick(classname) {
        var el = document.querySelectorAll(classname);
        for (var i = 0; i < el.length; i += 1) {
            var elm = el[i];
            elm.click();
        }
    }
    ImpedanceChart.IAllClick = IAllClick;
    
    var IMG_WIDTH = 1472;
    var IMG_HEIGHT = 575;
    function _get_img_height() {
        if (document.body.clientHeight > IMG_HEIGHT) {
            return g_barcode_tooltip_el.clientHeight;
        }
        else {
            return document.body.clientHeight;
        }
    }
    function _get_img_width() {
        if (document.body.clientWidth > IMG_WIDTH) {
            return IMG_WIDTH;
        }
        else {
            return document.body.clientWidth;
        }
    }
    function _get_img_half_width() {
        if (document.body.clientWidth > IMG_WIDTH) {
            return IMG_WIDTH / 2;
        }
        else {
            return document.body.clientWidth / 2;
        }
    }
    /* 툴팁 엘리먼트 위치 조정 */
    function adjust_position_over(top_pos, left_pos) {
        // >>>>>>> VERTICAL POSITION OVER
        if (top_pos < 0) {
            g_barcode_tooltip_el.style.top = "0px";
        }
        // else if((top_pos+g_barcode_tooltip_el.clientHeight) > e.clientY) {
        //     g_barcode_tooltip_el.style.top  = (dot.y-10)-g_barcode_tooltip_el.clientHeight +"px";
        // }
        // <<<<<<< VERTICAL POSITION OVER
        // >>>>>>> HORIZONTAL POSITION OVER
        if (left_pos < 0) {
            g_barcode_tooltip_el.style.left = "0px";
            // } else if((left_pos+g_barcode_tooltip_el.clientWidth) > window.innerWidth) {
        }
        else if ((left_pos + _get_img_width()) > document.body.clientWidth) {
            // g_barcode_tooltip_el.style.left = (document.body.clientWidth-g_barcode_tooltip_el.clientWidth) +"px";
            g_barcode_tooltip_el.style.left = (document.body.clientWidth - _get_img_width()) + "px";
        }
        // <<<<<<< HORIZONTAL POSITION OVER
    }
    
    function _ref_table_refresh(base_url, filtered_imp_data_list) {
        // >>>>>>> 정상 범례 분류
        // var normal_filtered_imp_data_list = filtered_imp_data_list.filter(function (val, idx, arr) {
        //     var re = ".*\uC815\uC0C1.*.txt";
        //     if (val) { return new RegExp(re, "gi").test(val); }
        //     else return false;
        // });
        // var air_filtered_imp_data_list = filtered_imp_data_list.filter(function (val, idx, arr) {
        //     var re = ".*\uACF5\uAE30.*.txt";
        //     if (val) { return new RegExp(re, "gi").test(val); }
        //     else return false;
        // });
        // var thm_filtered_imp_data_list = filtered_imp_data_list.filter(function (val, idx, arr) {
        //     var re = ".*\uC5F4.*.txt";
        //     if (val) { return new RegExp(re, "gi").test(val); }
        //     else return false;
        // });
        // var wat_filtered_imp_data_list = filtered_imp_data_list.filter(function (val, idx, arr) {
        //     var re = ".*\uBB3C.*.txt";
        //     if (val) { return new RegExp(re, "gi").test(val); }
        //     else return false;
        // });
        
        // >>>>>>> 230726 hjkim - 범례 테이블
        var data_tbl_el = document.querySelector("#ref_table");
        window.g_legend_table = new LegendTable(data_tbl_el, filtered_imp_data_list, base_url);
        // <<<<<<< 230726 hjkim - 범례 테이블
        
        // >>> 범례 테이블 스크롤 높이 조정
        // setTimeout(_adjust_legend_scroll_height, 500);
        // <<< 범례 테이블 스크롤 높이 조정
    }

    // ImpedanceChart.IRef_table_refresh = _ref_table_refresh;

    function merge_imp_data_list(content_arr, contents) {
        var imp_data_list = [];
        for(var i = 0; i < content_arr.length; i++) {
            // >>> impedance 데이터 URI 목록 추출
            var arr = extract_uri_list(content_arr[i]);
            imp_data_list = imp_data_list.concat(arr);
        }
        if(window.g_DEBUG) { console.log("merge_imp_data_list(imp_data_list):", imp_data_list); }
        // >>>>>>> 범례가 달린 파일만 처리
        var filtered_imp_data_list = imp_data_list.filter(function (val, idx, arr) {
            // post_d2024-12-02-17-47-16_imp_Data_NORMAL.txt
            // post_d2024-09-12-13-22_imp_Data_정상.txt
            // var url_regex = "^d[0-9]+-[0-9]+-[0-9]+-[0-9]+-[0-9]+_imp_Data.+.txt";
            // var url_regex = "d[0-9]+-[0-9]+-[0-9]+-[0-9]+-[0-9]+_imp_Data.+.txt";
            var url_regex = ".*d[0-9]+-[0-9]+-[0-9]+-[0-9]+-[0-9]+.*_imp_Data.+.txt";
            var URL_REGEX = new RegExp(url_regex, "gi");
            if (URL_REGEX.test(val)) { return true;  }
            else                     { return false; }
        });
		filtered_imp_data_list.sort();
        window.g_filtered_imp_data_list = filtered_imp_data_list;
        if(window.g_DEBUG) { console.log("merge_imp_data_list(g_filtered_imp_data_list):", window.g_filtered_imp_data_list); }
        
        // >>>>>>> 230728 hjkim - 키워드 목록 갱신
        if(window.keyword_list != null) window.keyword_list.refresh(filtered_imp_data_list);
        // <<<<<<< 230728 hjkim - 키워드 목록 갱신

        return filtered_imp_data_list;
    }
    ImpedanceChart.IMerge_imp_data_list = merge_imp_data_list;
    
    /* 임피던스 그래프 핸들러 */
    var g_is_init_impedance_graph = false;
    var g_is_init_ref_table = false;
    function IImpedance_graph_handler(info) {
        function zero_pad(n) { return (n < 10) ? "0" + n : n; }
        /* -------------------------------------------------------------------------- */
        /*                                   TOOLTIP                                  */
        /* -------------------------------------------------------------------------- */
        // console.log("#POS/get_clientY_in_page():", get_clientY_in_page(), get_barcode_canvasY_in_page());
        
        // >>>>>>> 230508 hjkim - 임피던스 그래프 Init
        if (!g_is_init_impedance_graph) {
            
            // g_barcode_tooltip_el.innerHTML = _get_imp_graph_html("imp_graph", "ref_table", "filter_table");
            
            // >>>>>>> 230727 hjkim - 다이얼로그

            // 스타일 목록
            var style  = "float:right; width:30px; height:30px; margin-top:10px; margin-right:10px;";
            var style2 = "width:100%; display:inline-block;";
            var style3 = "width:calc(100% - 350px); display:inline-block; position:relative; top:0; left:0; min-width:400px;";
            var style4 = "float:right; min-width:300px; height:100%; margin:0; padding:0;";
            var style5 = "max-height:800px; overflow:auto;";
            
            // 컴포넌트 목록
            var impedance_graph = new ImpedanceGraph("imp_graph");
            var filter_table    = new FilterTable("filter_table");
            var reference_table = new ReferenceTable("ref_table");
            // >>>>>>> 230725 hjkim - 범례 검색창
            var classification_menu = new ClassificationMenu(window.g_imp_base_url_list);
            var keyword_list        = new KeywordList();
                window.keyword_list = keyword_list;
            var search_input        = new SearchInput();
            // <<<<<<< 230725 hjkim - 범례 검색창

            // -----------------------------STYLE---------------------------------------------
            var _classification_menu_style = "width:calc(100% - 5px); padding:8px;";
            var _keyword_list_style = "font-size: 13px; font-weight: bold;";
            _keyword_list_style += "cursor:pointer; margin:2px; padding:2px; border:1px solid black;";
            _keyword_list_style += "border-radius:13px;display:inline-block; margin-top:5px;";
            var _check_all_style    = "padding:5px;";
            var _search_input_style = "padding:5px;";
            var _search_find_style  = "padding:5px;";
            var _clear_btn_style    = "padding:5px;";
            var _filter_tbl_style   = "max-width: 300px;";
            var _unicode_clear      = "&#129529;";
            var _unicode_find       = "&#128269;";
            var _unicode_chk_all    = "&#9989;";
            var _help_clear = "그래프와 범례를 클리어합니다.";
            var _help_chk_all = "범례를 클릭하여 반전합니다.";
            var _help_find = "키워드를 검색합니다.";

            /*
            ${keyword_list.$state.keyword_arr.map(item => {
                var _opacity = 88;
                var _hex_color = KeywordList.string_to_color(keyword) + _opacity;
                var _style = `background-color:${_hex_color}; ${_keyword_list_style}`;
                return `<span class="keword-list" style="${_style}" onclick="KeywordList.onclick_handler(this)">${item}</span>`
            })}
            */

            // -----------------------------HTML----------------------------------------------
            g_barcode_tooltip_el.innerHTML = `
            <section>
                <button onclick="ImpedanceChart.ILeftRight_toggle_handler()">↔</button>
                <button onclick="BarcodeChart.IClose_tooltip_handler()" style="${style}">X</button>
            </section>
            <div id="wrapper" style="${style2}">
                <div style="${style3}">${impedance_graph.template()}</div>
                <div style="${style4}">
                    
                    <table style="${_filter_tbl_style}">
                        <tbody id="imp_graph">
                        <tr><td>
                        <!-- 분류 메뉴 -->
                        <select style="${_classification_menu_style}" onchange ="ClassificationMenu.onchange_handler(event.target.value)">
                            ${classification_menu.$state.keys.map(item => `<option>${item}</option>`).join('')}
                        </select>
                        </td></tr>
                        <tr><td>
                        <!-- 키워드 풍선 -->
                        <div id="keyword_list_wrapper">
                            ${keyword_list.template()}
                        </div>
                        </td></tr>
                        <tr><td>
                        <!-- 검색 상자 -->
                        <tr><td>
                            <button style="${_clear_btn_style}"    title="${_help_clear}"   onclick="ImpedanceChart.IClear_imp_graph()">${_unicode_clear}</button>
                            <button style="${_check_all_style}"    title="${_help_chk_all}" onclick="ImpedanceChart.IAllClick('.legend_all')">${_unicode_chk_all}</button>
                            <input  style="${_search_input_style}" id="filterInput" type="text" onkeydown="SearchInput.onkeydown_handler(event)"/>
                            <button style="${_search_find_style}"  title="${_help_find}"    id="filterButton" onclick="SearchInput.onclick_handler()">${_unicode_find}</button>
                        </td></tr>
                        </tbody>
                    </table>

                    <div id="table-scroll" style="${style5}">${reference_table.template()}</div>
                </div>
            </div>`;
            // -----------------------------HTML----------------------------------------------
            // <<<<<<< 230727 hjkim - 다이얼로그

            var impedance_graph_el = document.querySelector("#imp_graph");
            IImpedanceChart_init(impedance_graph_el);
            g_is_init_impedance_graph = true;
        }
        // console.log("#imp / info : ", info);

        // >>>>>>> 1. 임피던스 데이터 목록 가져오기
        // var _base_url = window.g_imp_base_url_list[window.g_imp_base_url_sel];
        var _base_url = window.g_imp_base_url_list["로그"];
        var _content_arr = [];
        
        access(_base_url, function(is_access, uri, contents) {
            _content_arr.push(contents);
            var imp_list = merge_imp_data_list(_content_arr);
            handler(imp_list, _base_url);
        });
        
        // <<<<<<< 1. 임피던스 데이터 목록 가져오기

        function handler(imp_data_list, base_url) {
            // <<< impedance 데이터 URI 목록 추출
            // >>> 목록에서 현재 클릭한 box의 시간과 일치하는 url 경로 매칭
            var box_date = new Date(info.time);
            var y = zero_pad(box_date.getFullYear());
            var m = zero_pad(box_date.getMonth() + 1);
            var d = zero_pad(box_date.getDate());
            var h = zero_pad(box_date.getHours());
            var min = zero_pad(box_date.getMinutes());
            // 경로 : /ALL/data/impedance/imp_data/d2023-04-04-10-51_imp_Data.txt
            var url_regex = "d" + y + "-" + m + "-" + d + "-" + h + "-" + min + "_imp_Data.*.txt";
            var URL_REGEX = new RegExp(url_regex, "gi");
            var url = "";
            for (var i = 0; i < imp_data_list.length; i += 1) {
                var r = imp_data_list[i].match(URL_REGEX);
                if (r != null) {
                    url = base_url + "/" + r[0];
                    filename = r[0];
                }
            }
            if (url == "") {
                alert("매칭된 URL이 없습니다.");
                return;
            }
            // <<< 목록에서 현재 클릭한 box의 시간과 일치하는 url 경로 매칭
            // ### 1. INIT RIGHT SIDE CANVAS(impedence graph)
            var impedance_graph_el = document.querySelector("#imp_graph");
            fopen(url, function (res) {
                var data = _parse_imp_data(res, function (arr) {
                    // ohm -> mohm 단위변환
                    arr[1] *= M_OHM; // x: Real Imp
                    arr[2] *= M_OHM * -1; // y: -Imag Imp
                });
                g_curr_imp_data = data;
                g_curr_filename = filename;
                // 그래프 그리기
                IImpedanceChart_add_data(data, filename);
            });

            // 범례 갱신
            var data_tbl_el = document.querySelector("#ref_table");
            window.g_legend_table = new LegendTable(data_tbl_el, window.g_imp_base_url_list[window.g_imp_base_url_sel]);
            
            // if (!g_is_init_ref_table) {
            //     _ref_table_refresh(base_url, window.g_filtered_imp_data_list);
            //     g_is_init_ref_table = true;
            // }
        }
    }

    ImpedanceChart.IImpedance_graph_handler = IImpedance_graph_handler;

    function _adjust_legend_scroll_height() {
        var wrapper_el = document.querySelector("#imp_graph");
        var wrapper_h = wrapper_el === null || wrapper_el === void 0 ? void 0 : wrapper_el.clientHeight;
        var table_scroll_el = document.querySelector("#table-scroll");
        var saved_style = table_scroll_el === null || table_scroll_el === void 0 ? void 0 : table_scroll_el.getAttribute("style");
        table_scroll_el === null || table_scroll_el === void 0 ? void 0 : table_scroll_el.setAttribute("style", saved_style + ("max-height:" + wrapper_h + "px;"));
    }
    
    var g_is_right_side = true;
    function ILeftRight_toggle_handler() {
        var barcode_tooltip_el = document.querySelector("#barcode_tooltip");
        console.log(barcode_tooltip_el, g_is_right_side);
        if(g_is_right_side) {
            barcode_tooltip_el.style.left = "0px";
            barcode_tooltip_el.style.right = "";
            g_is_right_side = false;
        } else {
            barcode_tooltip_el.style.left = "";
            barcode_tooltip_el.style.right = "0px";
            g_is_right_side = true;
        }
    }
    ImpedanceChart.ILeftRight_toggle_handler = ILeftRight_toggle_handler;
    
}
// >>> 240226 hjkim - 
ImpedanceChart.Interface = Run_ImpedanceChart;
// <<< 240226 hjkim - 

})( ImpedanceChart );



/* -------------------------------------------------------------------------- */
/*                                Classification Menu                         */
/* -------------------------------------------------------------------------- */
// 검색어 선택박스 핸들러
ClassificationMenu.onchange_handler = function(imp_base_url_sel) {

    // 목록 받아오기
    window.g_imp_base_url_sel = imp_base_url_sel;
    var _base_url = window.g_imp_base_url_list[imp_base_url_sel];
    var _content_arr = [];
    
    // 키워드 입력부 클리어
    var filter_input_el = document.querySelector("#filterInput");
        filter_input_el.value = "";

    // 임피던스 목록 갱신
    access(_base_url, function(is_access, uri, contents) {
        _content_arr.push(contents);
        // 범례 갱신
        ImpedanceChart.IMerge_imp_data_list(_content_arr);
        // ImpedanceChart.IRef_table_refresh(_base_url, window.g_filtered_imp_data_list);
        // 범례 갱신
        var data_tbl_el = document.querySelector("#ref_table");
        window.g_legend_table = new LegendTable(data_tbl_el, window.g_imp_base_url_list[window.g_imp_base_url_sel]);
    });
}

function ClassificationMenu(base_url_obj, legend_table_inst) {

    this.init = function() {
        // 옵션 선택자
        this.$state = { 
            keys : Object.keys(base_url_obj),
        };
    }
    
    this.template = function() {
        // var style = "width: calc(33% - 5px); padding: 10px;";
        var style = "width: calc(33% - 5px); padding: 5px;";
        return `
        <select style="${style}"
            onchange ="ClassificationMenu.onchange_handler(event.target.value)">
            ${this.$state.keys.map(item => `<option>${item}</option>`).join('')}
        </select>`;
        /*
        return `
        <select id="sub_sel" style="${style}" 
            onchange ="ClassificationMenu.onchange_handler(0, event.target.value)">
            ${this.$state.sub.map(item => `<option>${item}</option>`).join('')}
        </select>
        <select id="amp_sel" style="${style}"
            onchange ="ClassificationMenu.onchange_handler(1, event.target.value)">>
            ${this.$state.amp.map(item => `<option>${item}</option>`).join('')}
        </select>
        <select id="etc_sel" style="${style}"
            onchange ="ClassificationMenu.onchange_handler(2, event.target.value)">>
            ${this.$state.etc.map(item => `<option>${item}</option>`).join('')}
        </select>
        `;
        */
    }

    /* Constructor */
    this.init();
}

/* -------------------------------------------------------------------------- */
/*                                KEYWORD LIST                                */
/* -------------------------------------------------------------------------- */
KeywordList.filename_to_keyword = function(filename, keyword_list) {
    // 파일명 파싱
    filename.substring(1, 11 + 6);
    var legend_name = filename.substring(17 + 10, filename.length - 4);
    var k_arr = legend_name.split("_");
    for(var i = 0; i < k_arr.length; i++) {
        keyword_list[k_arr[i]] = 1;
    }
}
KeywordList.onclick_handler = function(el) { 
    var input_el = document.querySelector("#filterInput");
    // console.log(el.innerText, input_el.value);
    if(input_el.value == "") { // 첫번째 키워드
        input_el.value = el.innerText;
    } else { // 두번째 키워드 이상
        
        if(input_el.value.indexOf(","+el.innerText) > -1) { // 토글 경우 1
            console.log("토글 경우 1");
            input_el.value = input_el.value.replace(","+el.innerText, "");
        } else if(input_el.value.indexOf(el.innerText+",") > -1) { // 토글 경우 2
            console.log("토글 경우 2");
            input_el.value = input_el.value.replace(el.innerText+",", "");
        } else if(input_el.value.indexOf(el.innerText) > -1) { // 토글 경우 3
            console.log("토글 경우 3");
            input_el.value = input_el.value.replace(el.innerText, "");
        } else { // 토글 아님
            console.log("토글 아님");
            input_el.value += ("," + el.innerText);
        }
    }

    var btn_el = document.querySelector("#filterButton");
    btn_el.click();
}
KeywordList.string_to_color = function(str) {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var color = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}

function KeywordList() {
    
    this.init = function() {
        this.$state = { keyword_arr: [],
                        disallow_list: window.g_keyword_disallow_list };
        this.$style = `font-size: 13px; font-weight: bold;
        cursor:pointer; margin:2px; padding:2px; border:1px solid black;
        border-radius:13px;display:inline-block; margin-top:5px;`;
    }

    this.render = function($target) {
        var html = this.template();
        $target.innerHTML = html;
    }

    this.sort = function(list_arr) {
        var keyword_hashmap = {};
        for(var i = 0; i < list_arr.length; i++) {
            KeywordList.filename_to_keyword(list_arr[i], keyword_hashmap);
        }
        this.$state.keyword_arr = Object.keys(keyword_hashmap);
        this.$state.keyword_arr.sort();
    }

    this.template = function() {
        var html = "";
        var opacity = "88";
        for(var i = 0; i < this.$state.keyword_arr.length; i++) {
            var keyword = this.$state.keyword_arr[i];
            // >>>>>>> 230817 hjkim - 키워드 필터 아웃
            if(keyword == "") continue;
            var is_filterout = false;
            for(var j = 0; j < this.$state.disallow_list.length; j += 1) {
                if(keyword.indexOf(this.$state.disallow_list[j]) > -1) {
                    is_filterout = true;
                    break;
                }
            }
            // <<<<<<< 230817 hjkim - 키워드 필터 아웃
            if(!is_filterout) {
                var hex_color = KeywordList.string_to_color(keyword)+opacity;
                var style = `background-color:${hex_color}; ${this.$style}`;
                html += `<span class="keword-list" style="${style}" onclick="KeywordList.onclick_handler(this)">${keyword}</span>`;
            }
        }
        return html;
    }

    this.clear = function() {
        var els = document.querySelectorAll(".keword-list");
        for(var i = 0; i < els.length; i++) {
            els[i].remove();
        }
    }

    this.refresh = function(list_arr) {
        this.clear();
        this.sort(list_arr);
        this.render(document.querySelector("#keyword_list_wrapper"));
    }

    /* Constructor */
    this.init();
}

/* -------------------------------------------------------------------------- */
/*                                SEARCH INPUT                                */
/* -------------------------------------------------------------------------- */

SearchInput.onkeydown_handler = function(e) {
    if(e.keyCode == 13) SearchInput.onclick_handler();
}

SearchInput.onclick_handler = function() {
    var input_el = document.querySelector("#filterInput");
    var text = input_el.value;
    var text_arr = text.split(",");
    var f_data = window.g_filtered_imp_data_list.filter(function(val, idx, arr) {
        var and_cnt = 0;
        for(var i = 0; i < text_arr.length; i++) {
            and_cnt += val.includes(text_arr[i]);
        }
        return (and_cnt == text_arr.length);
    });
    
    // >>>>>>> 230726 hjkim - 범례 테이블 갱신
    window.g_legend_table.refresh(f_data);
    // <<<<<<< 230726 hjkim - 범례 테이블 갱신
}

function SearchInput() {
    
    this.init = function() {
        this.$state = { list: [] };
    }

    this.template = function() {
        console.log("template", this.$state);
        var btn_style   = "width:60px; padding:10px;";
        var input_style = "padding:10px;";
        var btn2_style  = "width:60px; padding:10px;";
        return `
        <tr><td>
            <button style="${btn_style}" onclick="ImpedanceChart.IAllClick('.legend_all')">범례</button>
            <input  style="${input_style}" id="filterInput" type="text" onkeydown="SearchInput.onkeydown_handler(event)"/>
            <button style="${btn2_style}"  id="filterButton" onclick="SearchInput.onclick_handler()">Set</button>
        </td></tr>
        `;
    }

    /* Constructor */
    this.init();
}

/* -------------------------------------------------------------------------- */
/*                                LEGEND TABLE                                */
/* -------------------------------------------------------------------------- */

/* 파일명을 인수로 받아서 분류하는 함수 */
LegendTable.filename_to_classify = function(filename, cb) {

    var filename = filename.replace(window.g_imp_file_prefix[window.g_imp_base_url_sel], "");
    // 파일명 파싱
    var date = filename.substring(0, 16);
    var _PAD_STR_ = "_imp_data_";
    var _POSTFIX_ = ".txt";
    var legend_name = filename.substring(16 + _PAD_STR_.length, filename.length - _POSTFIX_.length);
    var class_name = "";
    var selected_color;
    // 범례색 분류
    if (0) { }
    else if (new RegExp(".*범위용.*", "gi").test(legend_name)) {
        selected_color = "#FFFFFFFF";
        class_name += " scope_point hidden";
    }
    else if (new RegExp(".*유량센서.*", "gi").test(legend_name)) {
        selected_color = "#FF0000";
        class_name += " flow_sensor";
    }
    else if (new RegExp(".*정상.*", "gi").test(legend_name)) {
        //selected_color = "#0EFF00";
        selected_color = "#C6CCC8";	//임시 색변환 231201 bjy.
        class_name += " normal_legend";
    }
    else if (new RegExp(".*공기.*", "gi").test(legend_name)) {
        // selected_color = "#51E1AD";
        selected_color = "#000000";	//임시 색변환 231201 bjy.
        //selected_color = "#0EFF00";
        class_name += " air_legend";
    }
    else if (new RegExp(".*물.*", "gi").test(legend_name)) {
        selected_color = "#5FAFF9";
        class_name += " water_legend";
    }
    else if (new RegExp(".*열.*", "gi").test(legend_name)) {
        selected_color = "#F49B9B";
        class_name += " thermal_legend";
    }
    else {
        selected_color = "black";
    }
    cb(date, selected_color, legend_name, class_name);
}

function LegendTable($target, base_url = "/ALL/data/impedance/imp_data") {
    
    this.init = function() {
        this.$state = { base_url: base_url,
                        disallow_list: window.g_legend_disallow_list };

        var self = this;
        var _content_arr = [];
        access(base_url, function(is_access, uri, contents) {
            _content_arr.push(contents);
            self.$state.list = ImpedanceChart.IMerge_imp_data_list(_content_arr);
            self.refresh(self.$state.list);
            // this.$target.innerHTML = "";
        });
    }
    
    this.render_callback = function(date, selected_color, legend_name, class_name, list_ith) {
        this.$target.innerHTML += this.template(date, selected_color, legend_name, class_name, list_ith);
    }
    
    this.template = function(date, selected_color, legend_name, class_name, list_ith) {
        var base  = this.$state.base_url;
        var style = `color:${selected_color}; cursor:pointer;`;
        var _legend_all_style= `cursor:pointer; text-decoration:underline; color:blue; text-overflow:ellipsis;`;
        var _tr_style = "";
        // >>>>>>> 230817 hjkim - 데이터 축설정 범례 hidden
        for(var i = 0; i < this.$state.disallow_list.length; i += 1) {
            if(legend_name.indexOf(this.$state.disallow_list[i]) > -1) {
                _tr_style = "display: none;"; 
                break;
            }
        }
        // <<<<<<< 230817 hjkim - 데이터 축설정 범례 hidden
        return `
        <tr class="legend-table" style="${_tr_style}"><td>
            <span class="${class_name} legend-table__signifier" style="${style}" onclick="ImpedanceChart.IAdd_series_in_imp_graph(event, '${base}/${list_ith}', '${selected_color}')">○</span>
            <span class="${class_name} legend_all" title="${legend_name}" style="${_legend_all_style}" onclick="ImpedanceChart.IAdd_series_in_imp_graph(event, '${base}/${list_ith}', '${selected_color}')">${date} : ${legend_name.substring(0, 14)}</span>
        </td></tr>
        `;
    }

    this.clear = function() {
        var els = document.querySelectorAll(".legend-table");
        for(var i = 0; i < els.length; i++) {
            els[i].remove();
        }
    }

    this.refresh = function(list_arr) {
        // >>>>>>> 230816 hjkim - 최신 순서로 정렬
        list_arr = list_arr.sort().reverse();
        if(window.g_DEBUG) { console.log("Legend Refresh(list_arr):", list_arr); }
        // <<<<<<< 230816 hjkim - 최신 순서로 정렬

        // >>>>>>> 230816 hjkim - 필터아웃
        // list_arr = list_arr.filter(function (val, idx, arr) {
        //     if(val.indexOf("post_") > -1) return false;
        //     else return true;
        // });
        // <<<<<<< 230816 hjkim - 필터아웃

        this.clear();
        var self = this;
        for(var i = 0; i < list_arr.length; i++) {
            LegendTable.filename_to_classify(list_arr[i], function (date, selected_color, legend_name, class_name) {
                self.render_callback(date, selected_color, legend_name, class_name, list_arr[i]);
            });
        }
    }
    
    /* Constructor */
    this.$target = $target;
    this.$state = {};
    this.init();
}

/* -------------------------------------------------------------------------- */
/*                    스택진단 / 상단(스택상태) 그래프                        */
/* -------------------------------------------------------------------------- */
// <<< 240321 hjkim - 스택 상태 그래프
// >>> 240423 hjkim - 체크박스
function parse_html(html_str) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(html_str, "text/html");
    return doc.body.firstChild; // body의 첫 번째 자식 요소를 반환
}
// <<< 240423 hjkim - 체크박스
if(TITLE.includes("스택진단")) {
    // >>> 250211 hjkim - 원점체크박스 상태저장
    // | ------------ | ---- | ----------------- | ---------- | ------------------ | ---------- | --------- |
    // |     항목     | 용량 | 브라우저OFF시휘발 | 만기일설정 | 서버사이드일괄제어 | 구현단순성 | 탭별Scope |
    // | ------------ | ---- | ----------------- | ---------- | ------------------ | ---------- | --------- |
    // | 세션스토리지 | 5MB  | O                 | X          | X                  | O          | O         |
    // | 쿠키         | 4KB  | X                 | O          | O                  | X          | X         |
    // | 로컬스토리지 | 5MB  | X                 | X          | X                  | O          | X         |
    // | indexedDB    | ?    | X                 | X          | X                  | X          | X         |
    // | ------------ | ---- | ----------------- | ---------- | ------------------ | ---------- | --------- |
    function setLocalStorage(key, value, type = "localstorage") {
        if(type == "localstorage") { localStorage.setItem(key, value); }
        if(type == "cookie") { document.cookie = `${key}=${value}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`; } // NOTE: Not Tested Yet.
    }
    function getLocalStorage(key, type = "localstorage") {
        if(type == "localstorage") { return localStorage.getItem(key); }
        if(type == "cookie") { return document.cookie.replace(/(?:(?:^|.*;\s*)${key}\s*\=\s*([^;]*).*$)|^.*$/, "$1"); } // NOTE: Not Tested Yet.
    }
    // <<< 250211 hjkim - 원점체크박스 상태저장
    const _grid_el = document.querySelector(".widget-body.d-grid");
    // >>> 241101 hjkim - 위젯 선택박스 토글로 인한 체크박스 이동
    const _org_chkbox_el = document.querySelector(".widget-body.d-grid div:nth-child(2)");
    // <<< 241101 hjkim - 위젯 선택박스 토글로 인한 체크박스 이동
    // >>> 240305 hjkim - 스택진단 메뉴 그래프 부착
    const _content_section_el = _grid_el.querySelector(".content-section");
    const _pholder_arr = _grid_el.querySelectorAll('.content-section>div:not(.float-end)');
    window.uplot_scatter_placeholder = _pholder_arr[0];
    const _img_el = _grid_el.querySelector('.content-section>div>img');
    
    // >>> 240425 hjkim - 체크박스(js-driven 버전)
    const {div, input, button, br} = van.tags;
    // >>> 250211 hjkim - 원점체크박스 상태저장
    let org_chk = getLocalStorage(`${PLANT_FOLDER()}/${STACK_NAME()}/org_chk`);
    var org_toggle = van.state(org_chk == "true" ? true : false);
    function org_chk_click_handler () {
        console.log("#org_chk_click_handler 1", org_toggle.val);
        org_toggle.val=!org_toggle.val;
        console.log("#org_chk_click_handler 2", org_toggle.val);
        setLocalStorage(`${PLANT_FOLDER()}/${STACK_NAME()}/org_chk`, org_toggle.val);
    }
    // <<< 250211 hjkim - 원점체크박스 상태저장
    window.org_state = van.state(0);
    const org_chkbox = div({style: `position:absolute; top:450px; right:30px; width:60px;`},
        // >>> 250212 hjkim - 원점체크박스 상태저장
        input({id:"shift_origin", type:"checkbox", checked:()=>org_toggle.val, onclick:org_chk_click_handler }), "원점", 
        br,
        button({class:"btn-of w-24", onclick:()=>{ org_chk_click_handler(); clear_graph(); show_graph(org_toggle.val, false); }}, 
        () => `${org_toggle.val == false ? "원점이동" : "절대값"}`), br,
        button({class: "btn-of w-24", onclick: all_clear_graph}, "클리어"), 
        // <<< 250212 hjkim - 원점체크박스 상태저장
    ); // DOM 생성
    van.derive(() => { // 체크박스와 org_toggle 상태 동기화
        try{
        var el = document.querySelector("#shift_origin");
        (org_toggle.val == false) ? el.removeAttribute("checked") : el.setAttribute("checked", "");
        return org_toggle.val;
        } catch(e) {}
    });
    
    // >>> 241101 hjkim - 위젯 선택박스 토글로 인한 체크박스 이동
    // van.add(_grid_el, org_chkbox); // 마운트
    van.add(_org_chkbox_el, org_chkbox); // 마운트
    // <<< 241101 hjkim - 위젯 선택박스 토글로 인한 체크박스 이동
    
    // <<< 240425 hjkim - 체크박스(js-driven 버전)

    // >>> 240423 hjkim - 체크박스(dom-driven 버전)
    // const _style = "position:absolute; top:450px; right:30px;";
    // const ctrlbox_str = `<div style="${_style}"><input id="shift_origin" type="checkbox" onclick="toggle_origin()"/>원점이동<br>
    // <button class="btn-of w-24" onclick="clear_graph()">클리어</button></div>`;
    // const ctrlbox_el = parse_html(ctrlbox_str);
    // _grid_el.appendChild(ctrlbox_el);
    // function toggle_origin() {
    //     var el = document.querySelector("#shift_origin");
    //     clear_graph();
    //     if(el.checked == true) show_graph(2);
    //     else show_graph(1);
    // }
    // <<< 240423 hjkim - 체크박스(dom-driven 버전)

    // 1. 초안 이미지 제거
    _img_el.remove();
    // 2. placeholder 사이즈 초기화
    _content_section_el.style.width = _grid_el.clientWidth +"px";
    _content_section_el.style.height= _grid_el.clientHeight+"px";
    _pholder_arr[0].style.height 	= _grid_el.clientHeight+"px";
    // <<< 240305 hjkim - 스택진단 메뉴 그래프 부착

    // 임피던스 차트 초기화
    ImpedanceChart.Interface(ImpedanceChart);
    ImpedanceChart.IImpedanceChart_init( _pholder_arr[0], _pholder_arr[0].clientWidth, _pholder_arr[0].clientHeight, false);
    // 
    // >>> 240417 hjkim - 그래프 보기 버튼 클릭
    window.addEventListener("load", () => {
        const show_graph_el = document.querySelector("#graph-btn"); // 그래프 보기 버튼
        const DELAY = { SINGLE: 250, DOUBLE: 500, TRIPLE: 750, TIMEOUT: 1000};
        var click = { counter: 0, first: 0 };
        var TIME_QUEUE = [];
        show_graph_el.addEventListener("click", () => { 
            window.org_state.val++;
            click.counter+= 1;
            var relative_time = new Date().getTime() - click.first;
            if(click.counter == 1) { // <-- 싱글 클릭
                click.first = new Date().getTime();
                TIME_QUEUE.push(setTimeout(single_click_handler, DELAY.SINGLE));
                TIME_QUEUE.push(setTimeout(double_click_handler, DELAY.DOUBLE));
                TIME_QUEUE.push(setTimeout(triple_click_handler, DELAY.TRIPLE));
                TIME_QUEUE.push(setTimeout(timeout_handler,      DELAY.TIMEOUT));
            } else if( (click.counter == 2) && relative_time <= DELAY.DOUBLE ) { // <-- 더블클릭
                clearTimeout(TIME_QUEUE[0]); // SINGLE CLICK 취소
            } else if( (click.counter == 3) && relative_time <= DELAY.TRIPLE ) { // <-- 트리플클릭
                clearTimeout(TIME_QUEUE[0]); // SINGLE CLICK 취소
                clearTimeout(TIME_QUEUE[1]); // DOUBLE CLICK 취소
            } else { // <-- 타임아웃
                clearTimeout(TIME_QUEUE[0]); // SINGLE CLICK 취소
                clearTimeout(TIME_QUEUE[1]); // DOUBLE CLICK 취소
                clearTimeout(TIME_QUEUE[2]); // TRIPLE CLICK 취소
                click.counter = 0;
            }
        });
        // 핸들러 함수
        function single_click_handler() { 
            const color = window.lastUsedGraphColor;
            show_graph(org_toggle.val, false, "LB", "normal", color);
            clear_time_queue(); 
        }
        function double_click_handler() { clear_graph(); clear_time_queue(); }
        function triple_click_handler() { /* NOP */ clear_time_queue(); }
        function timeout_handler() { clear_time_queue(); }
        function clear_time_queue() { TIME_QUEUE.map(tq => clearTimeout(tq)); click.counter = 0; TIME_QUEUE = []; }
    });
    // <<< 240417 hjkim - 그래프 보기 버튼 클릭
}

// 파일까지 전부 삭제
function all_clear_graph() {
    window.clearSelectedDirectory();
    // >>> 250217 hjkim - 스택진단 그래프에서 레이블이 겹치는 현상 수정
    window.series_cnt = 0;
    // <<< 250217 hjkim - 스택진단 그래프에서 레이블이 겹치는 현상 수정
	// >>> 250313 hjkim - 레이어 1 추가: xy축 레이블용
	window.is_draw_xtick_label = false;
	window.is_draw_ytick_label = false;
	// <<< 250313 hjkim - 레이어 1 추가: xy축 레이블용
    // >>> 250214 hjkim - xsxeysye 초기화
    init_xsxeysye();
    // <<< 250214 hjkim - xsxeysye 초기화
    // >>> 250214 hjkim - xsxeysye 자동갱신
    // let _input_arr = document.querySelectorAll(".widget.stack-state-graph .float-end .graph input");
    // _input_arr[1].value = xsxe_ysye__scope.xs;
    // _input_arr[2].value = xsxe_ysye__scope.xe;
    // _input_arr[3].value = xsxe_ysye__scope.ys;
    // _input_arr[4].value = xsxe_ysye__scope.ye;
    // <<< 250214 hjkim - xsxeysye 자동갱신
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]:checked');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    var el = document.querySelector(".impedence_graph").parentElement;
    el.innerHTML = "";
    ImpedanceChart.IImpedanceChart_init(el, el.clientWidth, el.clientHeight);
    ImpedanceChart.graph_axis_reset();
}

// 화면에 그래프만 지움
function clear_graph() {
    // >>> 250217 hjkim - 스택진단 그래프에서 레이블이 겹치는 현상 수정
    window.series_cnt = 0;
    // <<< 250217 hjkim - 스택진단 그래프에서 레이블이 겹치는 현상 수정
	
	// >>> 250313 hjkim - 레이어 1 추가: xy축 레이블용
	window.is_draw_xtick_label = false;
	window.is_draw_ytick_label = false;
	// <<< 250313 hjkim - 레이어 1 추가: xy축 레이블용

    // >>> 250214 hjkim - xsxeysye 초기화
    init_xsxeysye();
    // <<< 250214 hjkim - xsxeysye 초기화

    // >>> 250214 hjkim - xsxeysye 자동갱신
    // let _input_arr = document.querySelectorAll(".widget.stack-state-graph .float-end .graph input");
    // _input_arr[1].value = xsxe_ysye__scope.xs;
    // _input_arr[2].value = xsxe_ysye__scope.xe;
    // _input_arr[3].value = xsxe_ysye__scope.ys;
    // _input_arr[4].value = xsxe_ysye__scope.ye;
    // <<< 250214 hjkim - xsxeysye 자동갱신

    var el = document.querySelector(".impedence_graph").parentElement;
    el.innerHTML = "";
    ImpedanceChart.IImpedanceChart_init(el, el.clientWidth, el.clientHeight);
    ImpedanceChart.graph_axis_reset();
}

// >>> 240927 hjkim - xs,xe,ys,ye사용 체크박스
function is_xsxeysye_checked() {
    let _checkbox = document.querySelector(".widget.stack-state-graph .float-end .graph input:nth-child(1)");
    return _checkbox.checked;
}
function get_xsxeysye() {
    let _input = document.querySelectorAll(".widget.stack-state-graph .float-end .graph input");
    return [_input[1].value*1, _input[2].value*1, _input[3].value*1, _input[4].value*1];
}
function init_xsxeysye() {
    let _input = document.querySelectorAll(".widget.stack-state-graph .float-end .graph input");
    for(let i = 0; i < _input.length; i++) {
        _input[i].style = "";
    }
}
// <<< 240927 hjkim - xs,xe,ys,ye사용 체크박스

// 세션 ID 관리 함수
function getSessionId() {
    let sessionId = document.cookie.split('; ')
        .find(row => row.startsWith('SESS_ID='))
        ?.split('=')[1];
    
    return sessionId;
}

// >>> 250212 hjkim - 원점체크박스 상태저장
// function show_graph(is_origin = false, is_init = false, compact = "LB") {
function show_graph(is_origin = false, is_init = false, compact = "LB", mode = "normal", color = null) {
    console.log("#show_graph", is_origin, mode, color);

    var _response_msg = is_origin ? "DRAW_NYQUIST__RELATIVE" : "DRAW_NYQUIST";
    var _compact = is_origin ? compact : "";
    var sessionId = getSessionId();

    if (!color && window.lastUsedGraphColor) {
        color = window.lastUsedGraphColor;
    }

    const msgData = {
        msg: "GET_STACK__STREAM",
        response_msg: _response_msg,
        url_dir: "/data/SES/" + sessionId + "/selected",
        compact: _compact,
        color : color
    };
    if (is_xsxeysye_checked()) {
        const [xs, xe, ys, ye] = get_xsxeysye();
        Object.assign(msgData, { xs, xe, ys, ye });
    }
    channel2.port2.postMessage(msgData);
}
    
// >>> 240425 hjkim - xsxe_ysye 구현(DOM-driven 버전)
if(TITLE.includes("스택진단")) {
    
    // >>> 250214 hjkim - stime을 파라미터로 달고 넘어 올 경우, fixed 풀기
    location.search.includes("stime") ? setLocalStorage(`${PLANT_FOLDER()}/${STACK_NAME()}/fix_chk`, 'false') : null;
    // <<< 250214 hjkim - stime을 파라미터로 달고 넘어 올 경우, fixed 풀기

    // >>> 250210 hjkim - 고정체크박스 상태저장
    let fix_chk = getLocalStorage(`${PLANT_FOLDER()}/${STACK_NAME()}/fix_chk`);
	let chk_box = document.querySelector(".widget.stack-state-graph .float-end .graph input:nth-child(1)");
    chk_box.checked = (fix_chk == null) ? true : (fix_chk === 'true');
    console.log("#chk_box.checked", chk_box.checked);
    chk_box.addEventListener("click", function(e) {
        setLocalStorage(`${PLANT_FOLDER()}/${STACK_NAME()}/fix_chk`, e.target.checked); // 체크박스 상태 저장
    });
	// <<< 250210 hjkim - 고정체크박스 상태저장
    // ELEMENT DEFINITION
    const xsxe_ysye__placeholder = document.querySelector(".graph");
    const xsxe_ysye__input_el = xsxe_ysye__placeholder.querySelectorAll(".input-setting-value input");
    if(xsxe_ysye__input_el.length = 4) {
        xsxe_ysye__input_el[0].setAttribute("v-model", "xs");
        xsxe_ysye__input_el[1].setAttribute("v-model", "xe");
        xsxe_ysye__input_el[2].setAttribute("v-model", "ys");
        xsxe_ysye__input_el[3].setAttribute("v-model", "ye");
    }
    // SCOPE DEFINITION
    var xsxe_ysye__scope = {
        xs: 0, xe: 1, ys: 2, ye: 3,
        set_xs(n) { this.xs = n; }, 
        set_xe(n) { this.xe = n; },
        set_ys(n) { this.ys = n; },
        set_ye(n) { this.ye = n; },
    };
    // MOUNT
    PetiteVue.createApp(xsxe_ysye__scope).mount(xsxe_ysye__placeholder);
}
// <<< 240425 hjkim - xsxe_ysye 구현(DOM-driven 버전)
if(TITLE.includes("스택진단")) {
	function zoom_out() {
		console.log("TODO: 줌 아웃");
		console.log("(1)그래프 클리어");
		clear_graph();
		console.log("(2)BESTFIT 요청");
		// 메시지 송신
		channel2.port2.postMessage({ msg: "GET_BESTFIT",
            response_msg: "DRAW_NYQUIST__BESTFIT"});
	}
}
if(TITLE.includes("스택진단")) {
	/*
	window.addEventListener("load", init_tag_btn);
	function init_tag_btn() {
		var btn_el_arr = document.querySelectorAll(".main.tag-selector");
		const sch_btn = document.querySelector(".stk-sch-btn");
		const check_all = document.querySelector("#search-all-checkbox");
		btn_el_arr.forEach(el => 
			el.addEventListener("click", () => {
				window.data_tbl_row_cnt = document.querySelector("#stack_search_table").childElementCount;
				setTimeout(()=> { sch_btn.click(); }, 50);
				retry(`window.data_tbl_row_cnt != document.querySelector("#stack_search_table").childElementCount`, 50, 10, 
				() => { check_all.checked = false; check_all.click(); });
			})
		);
	}
	*/
	// >>>>>> 240610 bugfix: dialog layout problem
	function init_right_down_dialog() {
		const _el1 = document.querySelector(".widget.state-diagnosis").parentElement;
		const _el2 = document.querySelector(".widget.diagnosis-log").parentElement;
		const _row_el = document.createElement("div");
		_row_el.className = "row";
		_el1.parentElement.append(_row_el);
		_row_el.append(_el1);
		_row_el.append(_el2);
	}
	const _el1 = document.querySelector(".widget.state-diagnosis").parentElement.parentElement;
	if(!_el1.className.includes("row"))init_right_down_dialog();
	// <<<<<< 240610 bugfix: dialog layout problem
	
}