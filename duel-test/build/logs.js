/* Duel test: every finished duel is saved to the artifact's db, and a Logs view lists them live.
   Without db (signed out, or not available) nothing here shows and the game runs as before. */
(function(){
'use strict';
const V=window.DTV|0,VN=()=>window.DTVNAME||('v'+V);
let DB=null,dbTried=false;
const getDb=async()=>{if(dbTried)return DB;dbTried=true;try{DB=window.claude&&window.claude.use?await window.claude.use('db'):null;}catch(e){DB=null;}return DB;};

/* ---------- tracking during the duel, read-only (for the flags) ---------- */
const TR={s:null,life:[],atk:{},dbl:[],err:[]};
const live=x=>{try{return typeof S!=='undefined'&&x===S&&x&&!x.quiet&&x.players&&x.log;}catch(e){return false;}};
const fresh=x=>{if(TR.s!==x){TR.s=x;TR.life=[];TR.atk={};TR.dbl=[];TR.err=[];}};
const LIFE_RE=/(You|The rival) (lose|loses|gain|gains) (\d+) life/g;
function logged(x,from,i){let d=0;for(const l of x.log.slice(from)){const s=String(l&&l.x!=null?l.x:l);let m;LIFE_RE.lastIndex=0;while((m=LIFE_RE.exec(s))){if((m[1]==='You'?0:1)!==i)continue;d+=(m[2][0]==='g'?1:-1)*(+m[3]);}}return d;}
function wrap(name){const f=window[name];if(typeof f!=='function')return;
 window[name]=function(x,who,sen){if(!live(x))return f.apply(this,arguments);fresh(x);const L=x.log.length,l0=[x.players[0].life,x.players[1].life];
  if(name==='resolve'){try{const hand=x.players[who].hand,vw=sen&&(sen.kverb||(sen.verb!=null?hand[sen.verb]:null));if(vw&&typeof ATTACKV!=='undefined'&&ATTACKV.includes(vw)&&sen.subj&&sen.subj.k==='thing'){const k=x.turn+':'+sen.subj.id;TR.atk[k]=(TR.atk[k]||0)+1;if(TR.atk[k]===2){const t=findThing(x,sen.subj.id);TR.dbl.push({line:L,text:(t?(t.title||t.w):'a thing')+' attacked twice in turn '+x.turn});}}}catch(e){}}
  let r;try{r=f.apply(this,arguments);}catch(e){TR.err.push({line:x.log.length,text:String(e&&e.message||e)});throw e;}
  try{for(const i of [0,1]){const d=x.players[i].life-l0[i],rest=d-logged(x,L,i);if(rest)TR.life.push({line:Math.max(L,x.log.length-1),text:(i===0?'You':'The rival')+' '+(rest>0?'gained ':'lost ')+Math.abs(rest)+' life with no line saying so ('+name+')'});}}catch(e){}
  return r;};}
const hook=()=>{wrap('resolve');wrap('startTurn');wrap('endTurn');};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(hook,0));else setTimeout(hook,0);
window.dtvReportErr=e=>{try{if(typeof S!=='undefined'&&S)fresh(S);TR.err.push({line:S&&S.log?S.log.length:0,text:String(e&&e.message||e)});}catch(x){}};
addEventListener('error',ev=>{try{if(typeof view!=='undefined'&&view==='match'&&typeof S!=='undefined'&&S&&S.phase!=='over')window.dtvReportErr(ev.error||ev.message);}catch(e){}});

/* ---------- flags, from the log ---------- */
const TRAPA=()=>window.TRAPA||['burning','frozen','sodden','torpid','brittle','feeble','leaden','volatile'];
function sumOk(s){const m=/^The sum: (.+) = (-?\d+)(, at least 1)?\.$/.exec(s);if(!m)return true;let e=m[1];for(let k=0;k<4;k++)e=e.replace(/\([^()]*\)/g,'');e=e.replace(/−/g,'-').trim();
 if(/[%×*a-z]/i.test(e))return true;const t=/^(-?\d+)((?:\s*[+-]\s*\d+)*)$/.exec(e);if(!t)return true;let v=+t[1];const re=/([+-])\s*(\d+)/g;let q;while((q=re.exec(t[2])))v+=(q[1]==='+'?1:-1)*(+q[2]);return v===+m[2];}
function flagsOf(log){const L=log.map(l=>String(l&&l.x!=null?l.x:l)),out=[];let seg=0;const segOf=[];
 L.forEach((x,i)=>{if(/^(You say|The rival says|[A-Z][a-z]+ says)(:| something)/.test(x))seg++;segOf[i]=seg;});
 L.forEach((x,i)=>{
  if(/^The sum:/.test(x)&&!sumOk(x))out.push({type:'badSum',line:i,text:x});
  let m=/^(.+?) and (.+?) become (.+?)(?:,| with |\.)/.exec(x);if(m){const a=m[1].toLowerCase(),b=m[2].toLowerCase(),z=m[3].toLowerCase();if(z===a||z===b)out.push({type:'sameNameFusion',line:i,text:x});}
  if(/fuses .+ and .+\.$/.test(x)&&!/for \d+ breath/.test(x))out.push({type:'freeFusion',line:i,text:x});
  m=/^A hidden word springs: ([a-z-]+)!/.exec(x);if(m&&!TRAPA().includes(m[1]))out.push({type:'trapOnAttacker',line:i,text:x+' (not a curse: it helps the attacker)'});
  if(/now knows how to/.test(x)){const sg=segOf[i];if(L.some((y,j)=>segOf[j]===sg&&/has no|cannot|won’t work|won't work/.test(y)))out.push({type:'learnedOnFail',line:i,text:x});}
 });
 for(const f of TR.life)out.push({type:'unloggedLife',line:f.line,text:f.text});
 for(const f of TR.dbl)out.push({type:'doubleAttack',line:f.line,text:f.text});
 for(const f of TR.err)out.push({type:'error',line:f.line,text:f.text});
 return out.sort((a,b)=>a.line-b.line);}

/* ---------- save once when the end sheet opens; later rating and notes update the same doc ---------- */
const bytes=s=>new TextEncoder().encode(s).length;
window.dtvLogSave=function(ctx){const api={update(){}};
 (async()=>{const db=await getDb();if(!db)return;const x=S;if(!x||x.over==null)return;
  const id=Date.now()+'-'+Math.random().toString(36).slice(2,8),ref=db.collection('games').doc(id);
  const full=ctx.full(),body=ctx.log,head=full.slice(0,full.length-body.length-2);
  const sd=(ctx.sum&&ctx.sum.data)||{};const P=x.players;
  const deckOf=i=>{const r=i===0?window.DTVRAND:window.DTVRIVAL;if(Array.isArray(r)&&r.length)return r.slice();const p=P[i];return [].concat(p.deck||[],p.hand||[],p.discard||[]);};
  const flags=flagsOf(x.log||[]);
  const doc={savedAt:new Date().toISOString(),version:{n:V,label:VN(),build:window.DTVBUILD||''},rival:(x.rival&&x.rival.n)||'the rival',
   result:x.quit||x.over===1?'loss':x.over===0?'win':'draw',turns:x.turn,rounds:Math.max(1,Math.ceil(x.turn/2)),lifeMe:P[0].life,lifeRival:P[1].life,
   lifeByTurn:(sd.lifeByTurn||[]).map(a=>({me:a[0],rival:a[1]})),decidedRound:sd.decidedRound==null?null:sd.decidedRound,myDeck:deckOf(0),rivalDeck:deckOf(1),
   myBest:sd.myBest||null,rivalBest:sd.rivalBest||null,rating:null,notes:{annoying:'',best:''},
   flags,flagCount:flags.length,flagTypes:[...new Set(flags.map(f=>f.type))],
   txtHead:head,log:(x.log||[]).map(l=>({k:l.k||'e',x:String(l.x)})),txtBody:body,chunkCount:0};
  let chain=Promise.resolve(),failed=false;const note=()=>{if(failed)return;failed=true;try{const p=ctx.el.querySelector('.dtm');if(p&&!p.textContent){p.style.color='#8e1d10';p.textContent='Log not saved. Use Download to keep it.';}}catch(e){}};
  const put=async()=>{if(bytes(JSON.stringify(doc))>240000){const pay=JSON.stringify({log:doc.log,txtBody:doc.txtBody});const parts=[];for(let i=0;i<pay.length;i+=60000)parts.push(pay.slice(i,i+60000));
    delete doc.log;delete doc.txtBody;doc.chunkCount=parts.length;for(let n=0;n<parts.length;n++)await ref.collection('chunks').doc(String(n)).set({n,part:parts[n]});}
   await ref.set(doc);};
  chain=chain.then(put).catch(e=>{window.dtvReportErr&&0;note();});
  api.update=()=>{chain=chain.then(async()=>{const a=ctx.ans||{};ctx.el.querySelectorAll('textarea').forEach(t=>a[t.dataset.q]=t.value);const f=ctx.full(),h=f.slice(0,f.length-body.length-2);
    const nx={rating:a.fun?+a.fun:null,notes:{annoying:a.annoying||'',best:a.best||''},txtHead:h};
    if(nx.rating===doc.rating&&nx.notes.annoying===doc.notes.annoying&&nx.notes.best===doc.notes.best&&h===doc.txtHead)return;Object.assign(doc,nx);await ref.update(nx);}).catch(()=>note());};
 })();
 return {update(){api.update();}};};

/* ---------- the Logs view ---------- */
let GAMES=[],unsub=null,loadT=null,state='idle',F={v:'',r:'',res:'',flag:false,ft:''},sel=null;
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const css=document.createElement('style');css.textContent=
 '#dlogs{position:fixed;inset:0;z-index:9996;background:#120d08;color:#efe3c8;font:15px/1.4 "Alegreya Sans",system-ui,sans-serif;display:flex;flex-direction:column}'
+'#dlogs[hidden]{display:none}#dlogs header{display:flex;align-items:center;gap:14px;padding:12px 20px;border-bottom:1px solid #4a3920}'
+'#dlogs h2{margin:0;font:400 26px/1.1 "IM Fell DW Pica",Georgia,serif;color:#f3e4c2}#dlogs .lsum{color:#d9c8a4;font-size:14px}'
+'#dlogs button,#dlogs select{font:600 14px "Alegreya Sans",sans-serif;color:#f3e4c2;background:#2a1d11;border:1px solid #8a6a2f;border-radius:6px;padding:6px 10px;cursor:pointer}'
+'#dlogs button:hover{background:#3a2816}#dlogs button:focus-visible,#dlogs select:focus-visible,#dlogs tr:focus-visible{outline:2px solid #e6c46a;outline-offset:1px}'
+'#dlogs .sp{flex:1}#dlogs .lfilt{display:flex;flex-wrap:wrap;gap:10px;align-items:center;padding:10px 20px;border-bottom:1px solid #2e2314}'
+'#dlogs .lfilt label{display:flex;gap:6px;align-items:center;font-size:14px;color:#d9c8a4}'
+'#dlogs .lmain{flex:1;overflow:auto;padding:0 20px 20px}#dlogs table{width:100%;border-collapse:collapse;font-size:14px}'
+'#dlogs th{position:sticky;top:0;background:#120d08;text-align:left;font-weight:700;color:#d9c8a4;padding:8px 8px;border-bottom:1px solid #4a3920;white-space:nowrap}'
+'#dlogs td{padding:6px 8px;border-bottom:1px solid #261c10;white-space:nowrap}#dlogs tbody tr{cursor:pointer}#dlogs tbody tr:hover{background:#21170e}'
+'#dlogs .win{color:#9fd38a}#dlogs .loss{color:#f0a08a}#dlogs .fl{color:#f0c46a;font-weight:700}#dlogs .msg{padding:40px 0;text-align:center;color:#d9c8a4}'
+'#dlogs .ldet{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.3fr);gap:18px;padding-top:14px}'
+'#dlogs .box{border:1px solid #3a2c18;border-radius:8px;padding:12px 14px;margin-bottom:14px}#dlogs h3{margin:0 0 8px;font:700 13px/1 "Alegreya Sans",sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#d9c8a4}'
+'#dlogs .meta{font-size:15px;color:#efe3c8;margin:0 0 10px}#dlogs .deck{font-size:14px;color:#efe3c8}#dlogs .flags li{margin:3px 0}#dlogs .flags a{color:#f0c46a}'
+'#dlogs .logpre{font:13px/1.45 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#efe3c8;background:#0b0805;border:1px solid #3a2c18;border-radius:8px;padding:10px 12px;max-height:60vh;overflow:auto;white-space:pre-wrap}'
+'#dlogs .logpre div.hl{background:#5a3a0c;outline:1px solid #e6c46a}#dlogs .acts{display:flex;gap:8px;flex-wrap:wrap;margin:8px 0 12px}'
+'#dlogs svg text{fill:#d9c8a4;font:11px "Alegreya Sans",sans-serif}#dlogs .okmsg{color:#9fd38a;font-size:14px}'
+'.dlogsbtn{margin-top:10px}';
document.head.appendChild(css);
function root(){let r=document.getElementById('dlogs');if(!r){r=document.createElement('div');r.id='dlogs';r.hidden=true;r.setAttribute('role','dialog');r.setAttribute('aria-label','Duel logs');document.body.appendChild(r);
 r.addEventListener('click',onClick);r.addEventListener('change',onChange);r.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.dataset&&e.target.dataset.id){sel=e.target.dataset.id;render();}});}return r;}
function subscribe(){if(unsub){try{unsub();}catch(e){}unsub=null;}state='loading';render();clearTimeout(loadT);
 loadT=setTimeout(()=>{if(state==='loading'){state='timeout';render();}},10000);
 try{unsub=DB.collection('games').orderBy('savedAt','desc').limit(1000).onSnapshot(s=>{GAMES=s.docs.map(d=>Object.assign({id:d.id},d.data()));if(!s.metadata||!s.metadata.fromCache){clearTimeout(loadT);}state='ok';render();},e=>{clearTimeout(loadT);state='error';render();});}catch(e){clearTimeout(loadT);state='error';render();}}
async function open(){const db=await getDb();if(!db)return;const r=root();r.hidden=false;if(!unsub)subscribe();else render();if(location.hash!=='#logs')history.replaceState(null,'','#logs');}
function close(){const r=root();r.hidden=true;sel=null;if(location.hash==='#logs')history.replaceState(null,'',location.pathname+location.search);}
const fmt=s=>{try{const d=new Date(s);return d.toLocaleDateString(undefined,{day:'numeric',month:'short'})+' '+d.toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});}catch(e){return s;}};
const vl=g=>g.version&&g.version.label||'?';
function filtered(){return GAMES.filter(g=>(!F.v||vl(g)===F.v)&&(!F.r||g.rival===F.r)&&(!F.res||g.result===F.res)&&(!F.flag||(g.flagCount||0)>0)&&(!F.ft||(g.flagTypes||[]).includes(F.ft)));}
function opts(list,cur,all){return '<option value="">'+all+'</option>'+[...new Set(list)].sort().map(v=>'<option'+(v===cur?' selected':'')+' value="'+esc(v)+'">'+esc(v)+'</option>').join('');}
function graph(g){const L=(g.lifeByTurn||[]);if(L.length<2)return '';const w=520,h=150,pad=26,mx=Math.max(1,...L.map(a=>Math.max(a.me,a.rival)));
 const X=k=>pad+k*(w-pad*2)/(L.length-1),Y=v=>h-20-Math.max(0,v)*(h-36)/mx,p=key=>L.map((a,k)=>(k?'L':'M')+X(k).toFixed(1)+' '+Y(a[key]).toFixed(1)).join(' ');
 return '<svg viewBox="0 0 '+w+' '+h+'" width="100%" role="img" aria-label="Life by turn: you '+L.map(a=>a.me).join(', ')+'; rival '+L.map(a=>a.rival).join(', ')+'"><line x1="'+pad+'" y1="'+(h-20)+'" x2="'+(w-pad)+'" y2="'+(h-20)+'" stroke="#6a5530"/>'
  +'<path d="'+p('rival')+'" fill="none" stroke="#e07a5f" stroke-width="2.5"/><path d="'+p('me')+'" fill="none" stroke="#7fb3e0" stroke-width="2.5"/>'
  +'<text x="'+(w-pad)+'" y="'+(Y(L[L.length-1].me)-6)+'" text-anchor="end">You '+L[L.length-1].me+'</text><text x="'+(w-pad)+'" y="'+(Y(L[L.length-1].rival)+14)+'" text-anchor="end">Rival '+L[L.length-1].rival+'</text></svg>';}
const DETAIL={};
async function full(g){if(g.chunkCount&&!DETAIL[g.id]){let s='';for(let n=0;n<g.chunkCount;n++){const d=await DB.collection('games').doc(g.id).collection('chunks').doc(String(n)).get();s+=d.exists?d.data().part:'';}try{DETAIL[g.id]=JSON.parse(s);}catch(e){DETAIL[g.id]={log:[],txtBody:''};}}
 return g.chunkCount?DETAIL[g.id]:{log:g.log||[],txtBody:g.txtBody||''};}
const txtOf=(g,f)=>(g.txtHead||'')+'\n\n'+(f.txtBody||'');
function render(){const r=root();if(r.hidden)return;
 if(sel){const g=GAMES.find(x=>x.id===sel);if(!g){sel=null;return render();}
  r.innerHTML='<header><h2>Duel log</h2><span class="lsum">'+esc(fmt(g.savedAt))+'</span><span class="sp"></span><button data-a="list">All games</button><button data-a="back">Back to the bench</button></header><div class="lmain"><div class="msg">Loading the log…</div></div>';
  full(g).then(f=>{if(sel!==g.id)return;const fl=g.flags||[];
   r.querySelector('.lmain').innerHTML='<div class="ldet"><div>'
    +'<div class="box"><p class="meta"><b class="'+esc(g.result)+'">'+esc(g.result==='win'?'Win':g.result==='loss'?'Loss':'Draw')+'</b> against '+esc(g.rival)+' · '+esc(vl(g))+' · '+g.rounds+(g.rounds===1?' round':' rounds')+' ('+g.turns+(g.turns===1?' turn)':' turns)')+' · life '+g.lifeMe+' / '+g.lifeRival+(g.decidedRound?' · decided in round '+g.decidedRound:'')+'</p>'
    +'<div class="acts"><button data-a="copy" data-id="'+esc(g.id)+'">Copy log</button><button data-a="dl" data-id="'+esc(g.id)+'">Download .txt</button><span class="okmsg" aria-live="polite"></span></div>'+graph(g)+'</div>'
    +'<div class="box"><h3>Notes</h3><p class="meta">Rating: '+(g.rating?g.rating+' of 5':'not given')+'</p><p class="meta">Slow, unclear or annoying: '+esc(g.notes&&g.notes.annoying||'—')+'</p><p class="meta">Best moment: '+esc(g.notes&&g.notes.best||'—')+'</p>'
    +'<p class="meta">Your best: '+(g.myBest?esc('round '+g.myBest.round+', “'+g.myBest.text+'”, '+g.myBest.harm+' harm'):'—')+'</p><p class="meta">Rival best: '+(g.rivalBest?esc('round '+g.rivalBest.round+', “'+g.rivalBest.text+'”, '+g.rivalBest.harm+' harm'):'—')+'</p></div>'
    +'<div class="box"><h3>Flags ('+fl.length+')</h3>'+(fl.length?'<ul class="flags">'+fl.map(x=>'<li><a href="#" data-a="go" data-line="'+x.line+'">'+esc(x.type)+'</a> · '+esc(x.text)+'</li>').join('')+'</ul>':'<p class="meta">None.</p>')+'</div>'
    +'<div class="box"><h3>Your deck</h3><p class="deck">'+esc((g.myDeck||[]).join(', '))+'</p><h3>Rival’s deck</h3><p class="deck">'+esc((g.rivalDeck||[]).join(', '))+'</p></div>'
    +'</div><div><h3>Chronicle</h3><div class="logpre">'+(f.log||[]).map((l,i)=>'<div id="ll-'+i+'">'+esc(l.x)+'</div>').join('')+'</div></div></div>';});
  return;}
 const G=filtered(),n=G.length,w=G.filter(g=>g.result==='win').length,avg=n?(G.reduce((a,g)=>a+(g.rounds||0),0)/n):0;
 const FT=[...new Set(GAMES.flatMap(g=>g.flagTypes||[]))];
 let body;
 if(state==='loading'&&!GAMES.length)body='<div class="msg">Loading logs…</div>';
 else if((state==='timeout'||state==='error')&&!GAMES.length)body='<div class="msg">Couldn’t load logs. <button data-a="retry">Retry</button></div>';
 else if(!GAMES.length)body='<div class="msg">No games yet. Finish a duel and it appears here.</div>';
 else body='<table><thead><tr><th>When</th><th>Version</th><th>Rival</th><th>Result</th><th>Rounds</th><th>Final life</th><th>Rating</th><th>Flags</th></tr></thead><tbody>'
  +G.map(g=>'<tr tabindex="0" data-id="'+esc(g.id)+'"><td>'+esc(fmt(g.savedAt))+'</td><td>'+esc(vl(g))+'</td><td>'+esc(g.rival)+'</td><td class="'+esc(g.result)+'">'+esc(g.result)+'</td><td>'+(g.rounds||'')+'</td><td>'+g.lifeMe+' / '+g.lifeRival+'</td><td>'+(g.rating||'—')+'</td><td'+((g.flagCount||0)?' class="fl"':'')+'>'+(g.flagCount||0)+'</td></tr>').join('')+'</tbody></table>'+(state==='timeout'?'<p class="msg">These may be out of date: the logs aren’t answering.</p>':'');
 r.innerHTML='<header><h2>Duel logs</h2><span class="lsum">'+n+' game'+(n===1?'':'s')+(n?' · win rate '+Math.round(100*w/n)+'% · average '+avg.toFixed(1)+' rounds':'')+'</span><span class="sp"></span><button data-a="back">Back to the bench</button></header>'
  +'<div class="lfilt"><label>Version <select data-f="v">'+opts(GAMES.map(vl),F.v,'All')+'</select></label><label>Rival <select data-f="r">'+opts(GAMES.map(g=>g.rival),F.r,'All')+'</select></label>'
  +'<label>Result <select data-f="res">'+opts(['win','loss','draw'],F.res,'All')+'</select></label><label><input type="checkbox" data-f="flag"'+(F.flag?' checked':'')+'> Has flags</label><label>Flag type <select data-f="ft">'+opts(FT,F.ft,'Any')+'</select></label></div>'
  +'<div class="lmain">'+body+'</div>';}
function onChange(e){const k=e.target.dataset&&e.target.dataset.f;if(!k)return;F[k]=e.target.type==='checkbox'?e.target.checked:e.target.value;render();}
async function onClick(e){const a=e.target.closest('[data-a]');const tr=e.target.closest('tr[data-id]');
 if(!a&&tr){sel=tr.dataset.id;render();return;}if(!a)return;e.preventDefault();const k=a.dataset.a;
 if(k==='back'){close();return;}if(k==='list'){sel=null;render();return;}if(k==='retry'){subscribe();return;}
 if(k==='go'){const el=document.getElementById('ll-'+a.dataset.line);if(el){document.querySelectorAll('#dlogs .logpre .hl').forEach(x=>x.classList.remove('hl'));el.classList.add('hl');el.scrollIntoView({block:'center'});}return;}
 if(k==='copy'||k==='dl'){const g=GAMES.find(x=>x.id===a.dataset.id);if(!g)return;const t=txtOf(g,await full(g)),ok=m=>{const s=document.querySelector('#dlogs .okmsg');if(s)s.textContent=m;};
  if(k==='copy'){const fb=()=>{const ta=document.createElement('textarea');ta.value=t;document.body.appendChild(ta);ta.select();let r=false;try{r=document.execCommand('copy');}catch(x){}ta.remove();ok(r?'Copied.':'Copy blocked here; use Download.');};if(navigator.clipboard)navigator.clipboard.writeText(t).then(()=>ok('Copied.'),fb);else fb();return;}
  const fn='word-alchemy-duel-'+g.id+'.txt';let d=null;try{d=window.claude&&window.claude.use?await window.claude.use('downloads'):null;}catch(x){}
  if(d){try{await d.save({filename:fn,data:t});ok('Saved.');}catch(x){ok('Not saved.');}return;}const bl=new Blob([t],{type:'text/plain'}),an=document.createElement('a');an.href=URL.createObjectURL(bl);an.download=fn;an.click();}}
window.dtvLogsOpen=open;window.dtvLogsGames=()=>GAMES;
/* the Logs button on the bench, once db is known to work */
setInterval(()=>{try{if(!DB)return;const l=document.querySelector('#view-lobby .home.lobby > div, #view-match .home.lobby > div');if(!l||l.querySelector('.dlogsbtn'))return;const b=document.createElement('button');b.className='mbtn dlogsbtn';b.type='button';b.textContent='Logs';b.onclick=e=>{e.stopPropagation();open();};const m=l.querySelector('.home-menu');(m||l).appendChild(b);}catch(e){}},800);
const fromHash=()=>{if(location.hash==='#logs')open();};
addEventListener('hashchange',fromHash);
setTimeout(async()=>{await getDb();fromHash();},50);
})();
