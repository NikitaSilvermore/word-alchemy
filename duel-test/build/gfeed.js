/* Duel test (game copy): opens on the quick match, and asks for feedback after each duel with the duel's log attached. */
(function(){
'use strict';
const KEY='wa-duel-test-feedback';
let fb={games:[]};try{fb=JSON.parse(localStorage.getItem(KEY)||'{"games":[]}');}catch(e){}
const st=()=>{try{localStorage.setItem(KEY,JSON.stringify(fb));}catch(e){}};
const VN=()=>window.DTVNAME||'v0';
/* straight to the duelling bench: skip the title */
const toBench=()=>{try{const t=document.getElementById('ttl');if(t)t.remove();ttlUp=false;}catch(e){}
  try{if(!S||!S.live||S.over!=null||S.story||S.puz){fresh();}view='match';renderAll();}catch(e){}};
addEventListener('load',()=>setTimeout(()=>{toBench();},400));
/* a quiet badge so testers know which version they are on */
document.addEventListener('DOMContentLoaded',()=>{const b=document.createElement('div');b.id='dtv';b.textContent='Duel test';document.body.appendChild(b);});
let seen=null;
try{const _rm=renderMatch;renderMatch=function(){_rm.apply(this,arguments);try{if(typeof dtvPanel==='function')dtvPanel();}catch(e){}};}catch(e){}
if((window.DTV|0)>=4){try{PF.hints=0;}catch(e){}}
setInterval(()=>{try{if(typeof view!=='undefined'&&view!=='match'&&!document.getElementById('set'))toBench();}catch(e){}},500);
setInterval(()=>{try{
  if(typeof S==='undefined'||!S||view!=='match'||S.phase!=='over'||S.over==null)return;
  const id=(S.seed||'')+':'+S.turn+':'+S.over;if(seen===id)return;seen=id;
  setTimeout(()=>ask(),2600);
}catch(e){}},700);
function logText(){const won=S.over===0;
  return 'Variant: '+VN()+'\nResult: '+(won?'win':S.over===1?'loss':'draw')+'  Rival: '+(S.rival?S.rival.n:'?')+'  Turns: '+S.turn+'  Life: '+S.players.map(p=>p.life).join('/')+'\n\nLog:\n'+(S.log||[]).map(l=>l.x).join('\n');}
function ask(){
  if(document.getElementById('dtf'))return;const won=S.over===0;let sum=null;try{sum=window.DTV>=6&&window.dtvSummary?dtvSummary(S):null;}catch(x){}const log=(sum?sum.text+'\n\n':'')+logText();
  fb.games.push({at:new Date().toISOString(),won,turns:S.turn,variant:VN()});st();
  const e=document.createElement('div');e.id='dtf';
  e.innerHTML='<div class="dtfb"><button class="dtx" aria-label="Close">×</button><small>Duel test · duel '+fb.games.length+'</small><h3>'+(won?'You won.':'You lost.')+' How was it?</h3>'
   +(sum?sum.html:'')+'<div class="dts">'+[1,2,3,4,5].map(n=>'<button data-v="'+n+'">'+n+'</button>').join('')+'<span>1 dull · 5 great</span></div>'
   +'<label>Anything slow, unclear or annoying?</label><textarea data-q="annoying"></textarea><label>Best moment?</label><textarea data-q="best"></textarea>'
   +'<div class="dtb"><button class="dtgo" data-k="copy">Copy feedback and log</button><button data-k="dl">Download</button><button data-k="mail">Email</button></div><p class="dtm"></p></div>';
  document.body.appendChild(e);
  const ans={};let LG=null;try{LG=window.dtvLogSave?dtvLogSave({sum,log,full:()=>full(),ans,el:e}):null;}catch(x){}const msg=t=>e.querySelector('.dtm').textContent=t;
  e.querySelectorAll('.dts button').forEach(b=>b.onclick=()=>{e.querySelectorAll('.dts button').forEach(x=>x.classList.remove('on'));b.classList.add('on');ans.fun=b.dataset.v;if(LG)LG.update();});e.querySelectorAll('textarea').forEach(t=>t.addEventListener('change',()=>{if(LG)LG.update();}));
  const full=()=>{e.querySelectorAll('textarea').forEach(t=>ans[t.dataset.q]=t.value);return 'Word Alchemy duel test feedback\n'+Object.entries(ans).map(([k,v])=>k+': '+v).join('\n')+'\n\n'+log;};
  e.querySelector('.dtx').onclick=()=>{if(LG)LG.update();e.remove();};
  e.querySelector('[data-k=copy]').onclick=()=>{const t=full(),fbk=()=>{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy');}catch(x){}ta.remove();msg(ok?'Copied.':'Copy blocked here; use Download.');};
    if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>msg('Copied.'),fbk);else fbk();};
  e.querySelector('[data-k=dl]').onclick=async()=>{const fn='word-alchemy-duel-'+fb.games.length+'.txt';let d=null;try{d=window.claude&&window.claude.use?await window.claude.use('downloads'):null;}catch(x){}
    if(d){try{await d.save({filename:fn,data:full()});msg('Saved.');}catch(x){msg('Not saved. Use Copy instead.');}return;}
    const bl=new Blob([full()],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=fn;a.click();};
  e.querySelector('[data-k=mail]').onclick=()=>{location.href='mailto:?subject='+encodeURIComponent('Word Alchemy duel test')+'&body='+encodeURIComponent(full().slice(0,1800));};
}
const css=document.createElement('style');css.textContent='#top,#ttl,.home-menu [data-v=story],.home-menu [data-v=home],#view-home,#view-story{display:none!important}'+
 '#dtv{position:fixed;right:64px;top:20px;z-index:9990;font:600 11px/1 "Alegreya Sans",sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#e6d3a8;background:rgba(9,7,5,.78);border:1px solid rgba(230,196,94,.45);border-radius:999px;padding:6px 11px;pointer-events:none}'
+'#dtf{position:fixed;inset:0;z-index:9995;display:grid;place-items:center;background:rgba(6,4,2,.6)}'+'.dsum{margin:8px 0 14px;padding:10px 12px;border:1px solid rgba(138,106,47,.5);border-radius:8px;background:rgba(255,248,230,.45)}.dsh{font:400 20px/1.1 "IM Fell DW Pica",Georgia,serif;color:#23170d}.dsv{display:block;width:100%;height:auto;margin:6px 0}.dsd{margin:2px 0 6px;font-weight:700;color:#23170d}.dsum ul{margin:0;padding-left:18px}.dsum li{margin:2px 0;color:#2b1d10}'
+'.dtfb{position:relative;width:min(620px,92vw);max-height:calc(100vh - 24px);overflow-y:auto;box-sizing:border-box;background:#efe0bd url(assets/parch.jpg) center/cover;color:#23170d;border:3px solid #8a6a2f;border-radius:10px;padding:24px 30px;font:16px/1.45 "Alegreya Sans",sans-serif;box-shadow:0 30px 80px rgba(0,0,0,.8)}'
+'.dtfb small{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#7a2a14;font-weight:700}.dtfb h3{font:400 30px/1.15 "IM Fell DW Pica",serif;margin:4px 0 12px}'
+'.dts{display:flex;gap:8px;align-items:center}.dts button{width:42px;height:42px;border-radius:50%;border:2px solid #8a6a2f;background:#fffaee;font:20px "IM Fell DW Pica",serif;color:#23170d;cursor:pointer}.dts button.on{background:#8e1d10;color:#fff6e6}.dts span{font-size:13px;color:#5a4128;margin-left:6px}'
+'.dtfb label{display:block;font-weight:700;margin:12px 0 4px}.dtfb textarea{width:100%;box-sizing:border-box;min-height:56px;border:1px solid #8a6a2f;border-radius:6px;background:#fffaee;color:#23170d;font:inherit;padding:6px}'
+'.dtb{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap}.dtb button{padding:9px 14px;border-radius:8px;border:2px solid #8a6a2f;background:#fffaee;color:#23170d;font:600 15px "Alegreya Sans",sans-serif;cursor:pointer}.dtb .dtgo{background:#8e1d10;border-color:#6a140b;color:#fff6e6}'
+'.dtx{position:absolute;right:12px;top:8px;background:none;border:0;font-size:28px;color:#3a2614;cursor:pointer}.dtm{color:#2d5a1e;font-weight:700;margin:8px 0 0}';
document.head.appendChild(css);
})();
