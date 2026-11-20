/* Artifact build only: many small pictures travel in a few pack files, unpacked in the browser. */
(()=>{const PK=PACKMAP,P={},U={},rx=/assets\/(?:[a-z]+\/)?[\w\-]+\.(?:jpg|png|webp)/g;
 const nm=v=>{const m=String(v||'').match(/assets\/(?:[a-z]+\/)?[\w\-]+\.(?:jpg|png|webp)/);return m?m[0]:'';};
 function load(pk){if(P[pk])return P[pk];return P[pk]=fetch('assets/pack/'+pk+'.json').then(r=>{if(!r.ok)throw 0;return r.json();}).then(o=>{for(const k in o){const b=atob(o[k][1]),a=new Uint8Array(b.length);for(let i=0;i<b.length;i++)a[i]=b.charCodeAt(i);U[k]=URL.createObjectURL(new Blob([a],{type:o[k][0]}));}sweep();}).catch(()=>{});}
 function fix(s,again){let want=0;const o=s.replace(rx,m=>{if(U[m])return U[m];if(PK[m]){want=1;load(PK[m]).then(again);}return m;});return o;}
 function fixEl(el){if(!el||el.nodeType!==1)return;for(const a of ['src','style']){const v=el.getAttribute(a);if(!v||v.indexOf('assets/')<0)continue;const n=fix(v,()=>fixEl(el));if(n!==v)el.setAttribute(a,n);}}
 function fixStyles(){document.querySelectorAll('style').forEach(s=>{const t=s.textContent;if(t.indexOf('assets/')<0)return;const n=fix(t,fixStyles);if(n!==t)s.textContent=n;});}
 function sweep(){fixStyles();document.querySelectorAll('[src*="assets/"],[style*="assets/"]').forEach(fixEl);}
 const d=Object.getOwnPropertyDescriptor(HTMLImageElement.prototype,'src');
 Object.defineProperty(HTMLImageElement.prototype,'src',{configurable:true,get(){return d.get.call(this);},set(v){const k=nm(v);if(k&&k===String(v)&&PK[k]){if(U[k]){d.set.call(this,U[k]);return;}const me=this;load(PK[k]).then(()=>{if(U[k])d.set.call(me,U[k]);});return;}d.set.call(this,v);}});
 new MutationObserver(ms=>{for(const m of ms){if(m.type==='attributes')fixEl(m.target);else m.addedNodes.forEach(n=>{if(n.nodeType!==1)return;fixEl(n);n.querySelectorAll&&n.querySelectorAll('[src*="assets/"],[style*="assets/"]').forEach(fixEl);});}}).observe(document.documentElement,{subtree:true,childList:true,attributes:true,attributeFilter:['src','style']});
 fixStyles();addEventListener('DOMContentLoaded',sweep);})();
