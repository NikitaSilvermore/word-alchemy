/* v13: the overnight bug report, fixed as decided with Nikita (22 Nov).
   Everything here is gated on DTV>=13; older versions play exactly as before. */
(function(){
'use strict';
const V=window.DTV|0;if(!(V>=13))return;
const Y=i=>i===0?'You':'The rival',yr=i=>i===0?'your':'the rival’s',gains=i=>i===0?'gain':'gains',other=i=>i===0?'the rival':'you';

/* ---- requirements (pelican needs water, locust and bat need air): off for now ---- */
{const _ng=newGame;newGame=function(seed,cfg){const S=_ng(seed,cfg);if(S&&S.cfg)S.cfg.aspect=false;return S;};}

/* ---- traps: only curses can be laid face down ---- */
window.TRAPA=['burning','frozen','sodden','torpid','brittle','feeble','leaden','volatile'];

/* ---- the hidden layer, kept but printed and logged ---- */
const WXL={
 rain:o=>Y(o)+' '+gains(o)+' 3 life from the rain, and '+yr(o)+' things gain 1.',
 fog:o=>Y(o)+' '+gains(o)+' 4 life in the fog.',
 desert:o=>'The desert burns '+other(o)+' for 3.',
 drought:o=>'The drought burns '+other(o)+' for 2, and every plant and liquid opposite for 2.',
 flux:o=>'Flux strips every condition from the things opposite, and burns '+other(o)+' for 2.',
 harvest:o=>'Harvest: '+(o===0?'you get':'the rival gets')+' 2 coins, and '+yr(o)+' things gain 1.',
 night:o=>'Night: '+yr(o)+' things gain 1, and the dark takes 2 from '+other(o)+'.',
 storm:o=>'The storm’s first bolt strikes the strongest thing opposite for 4 (or '+other(o)+' for 3).'};
for(const k in WXL)if(WXB[k]){const f=WXB[k];WXB[k]=(S,o)=>{say(S,WXL[k](o)+' '+Y(o)+' '+(o===0?'draw':'draws')+' a word.');f(S,o);};}
const VXL={bind:'The bind also deals 2.',blow:'The blow also costs the rival 3.',distil:'Distil: the thing gains 3.',ripen:'Ripen: the thing gains 3.',temper:'Temper: the thing gains 4.',
 doubt:'Doubt: a word is drawn, and 2 harm.',guard:'Guard: +3, and a word is drawn.',haunt:'The haunting also deals 2.',lure:'The lure also deals 3.',petrify:'Petrify also deals 5.',
 rust:'Rust also deals 2.',wither:'Wither also deals 3.',scream:'The scream: 1 to every thing opposite, and 2 to the person.',sculpt:'Sculpt: +2.',wake:'Wake: +2, it may act again, and a word is drawn.'};
for(const k in VXL)if(VX[k]){const f=VX[k];VX[k]=(S,w,s,o)=>{say(S,VXL[k]);f(S,w,s,o);};}
const EXL={amnesty:w=>Y(w)+' '+gains(w)+' 3 life, and '+other(w)+' '+(w===0?'loses':'lose')+' 3.',dream:w=>'The dream takes 3 more from '+other(w)+'.',gnosis:w=>Y(w).replace('The rival','The rival’s')+' things gain 2; '+other(w)+' '+(w===0?'takes':'take')+' 2.',
 loan:w=>Y(w)+' '+gains(w)+' 2 life.',lullaby:w=>'The lullaby dazes '+other(w)+' for 2 turns and deals 2.',memory:w=>Y(w)+' '+gains(w)+' 4 life.',reckoning:w=>'Reckoning: every rival thing of 4 or less is destroyed, and 2 harm.'};
for(const k in EXL)if(EVX[k]){const f=EVX[k];EVX[k]=(S,w)=>{say(S,EXL[k](w));f(S,w);};}
const ARL={attractor:t=>'The attractor draws 2 words, and '+yr(t.side)+' other things gain 1.',erosion:t=>'Erosion arrives: '+(t.side===0?'you take':'the rival takes')+' 4.',phosphorus:t=>'Phosphorus flares: 3 to '+other(t.side)+'.',
 salamander:t=>'The salamander arrives 2 stronger and sets the first thing opposite alight.',saltpetre:t=>'Saltpetre blasts '+other(t.side)+' for 3.',tower:t=>'The tower rises: '+(t.side===0?'you gain':'the rival gains')+' 3 life and draw'+(t.side===0?'':'s')+' a word.'};
for(const k in ARL)if(ARRIVE[k]){const f=ARRIVE[k];ARRIVE[k]=(S,t)=>{say(S,ARL[k](t));f(S,t);};}

/* ---- card text: print the extras, and fix the ones that said the wrong thing ---- */
const G=(w,s)=>{if(W[w])W[w].gloss=s;},ADD=(w,s)=>{if(W[w]&&W[w].gloss&&!W[w].gloss.includes(s))W[w].gloss=W[w].gloss.replace(/\s*$/,'')+' '+s;};
const WXG={rain:'When it arrives, its caller gains 3 life, their things gain 1, and they draw a word. It falls only on the other side.',fog:'When it arrives, its caller gains 4 life and draws a word.',desert:'When it arrives, the other side takes 3, and its caller draws a word.',
 drought:'When it arrives, the other side takes 2, every plant and liquid opposite takes 2, and its caller draws a word.',flux:'When it arrives, every condition opposite falls away, the other side takes 2, and its caller draws a word.',
 harvest:'When it arrives, its caller gets 2 coins, their things gain 1, and they draw a word.',night:'When it arrives, its caller’s things gain 1, the other side takes 2, and its caller draws a word.',storm:'When it arrives, the strongest thing opposite takes 4 (or the other side takes 3), and its caller draws a word.'};
for(const k in WXG)ADD(k,WXG[k]);
const VXG={bind:'It also deals 2.',blow:'The rival also takes 3.',distil:'Your thing also gains 3.',ripen:'Your thing also gains 3.',temper:'Your thing also gains 4.',doubt:'Draw a word; the target (or the rival) also takes 2.',
 guard:'The guard also gains 3, and you draw a word.',haunt:'The haunted also takes 2.',lure:'If it cannot be taken, it takes 3.',petrify:'The target also takes 5.',rust:'Any rival thing it touches also takes 2.',wither:'Any rival thing it touches also takes 3.',
 sculpt:'The sculptor also gains 2.',wake:'It also gains 2, may act again, and you draw a word.'};
for(const k in VXG)ADD(k,VXG[k]);
if(W.scream)G('scream',(W.scream.gloss||'').replace(/Everything opposite takes 1, and so does the rival\.?/,'').trim()+' Everything opposite takes 1, and the rival takes 2.');
G('silence','Said alone, then spent. The rival forgets two words from their hand into the Silence. You draw a word.');
{const _si=EVENT.silence;EVENT.silence=function(S,who,c){const f=window.silence;silence=(S2,i,n)=>f(S2,i,Math.min(n,2));try{_si.apply(this,arguments);}finally{silence=f;}};}
ADD('memory','You gain 4 life.');ADD('loan','You also gain 2 life.');ADD('dream','The rival also takes 3.');
G('eternal','Destroyed, it returns to its keeper’s hand. On your own thing it also gains 2 as a blessing, then 30% more.');
for(const b of ['fixed','hermetic','quick','resonant','thorny'])if(W[b]&&!/\+2/.test(W[b].gloss||''))ADD(b,'On your own thing it also gives +2.');
G('tower','A grain tower. When it arrives you gain 3 life and draw a word. Each of your turns while it stands, you gain 1 life and 2 ink.');
G('rumour','Lands on your rival for 4 turns. While it stands, their sentences earn no ink.');
G('erosion',(W.erosion&&W.erosion.gloss||'').replace(/ladder/g,'metal'));
G('slag','What a destroyed metal leaves.');
/* attack verbs hit with strike, not stand */
for(const w in W){const d=W[w];if(d&&typeof d.gloss==='string'&&/for (its|plain) vigour/.test(d.gloss))d.gloss=d.gloss.replace(/for (its|plain) vigour/g,'for $1 might');}

/* ---- rumour fades after 4 of its keeper's turns ---- */
{const _st=startTurn;startTurn=function(S,i){const r=_st.apply(this,arguments);try{for(const t of S.things.slice())if(t.props.includes('rumour')&&t.side===i){t.rl=(t.rl==null?4:t.rl)-1;if(t.rl<=0){S.things.splice(S.things.indexOf(t),1);say(S,'The rumour on '+(i===0?'you':'the rival')+' dies away.');}}}catch(e){}return r;};}

/* ---- ground stays ground, spells stay spells ---- */
const keepKind=(t,g,sp)=>{if(g&&!t.props.includes('ground'))t.props.push('ground');if(sp&&!t.props.includes('spell'))t.props.push('spell');};
{const _ti=turnInto;turnInto=function(S,t,w){const g=isG(t),sp=t.props.includes('spell');_ti(S,t,w);keepKind(t,g,sp);};}
{const _be=become;become=function(S,t,w){const g=isG(t),sp=t.props.includes('spell');_be(S,t,w);keepKind(t,g,sp);};}

/* ---- the old metal ladder is gone; only the breath ladder remains ---- */
climb=function(){};fall=function(){return false;};

/* ---- a fresh thing cannot attack with any verb the turn it arrives; sealed things say what still reaches them ---- */
const norm=(S,who,sen)=>{try{const hand=S.players[who].hand,vw=sen&&(sen.kverb||(sen.verb!=null?hand[sen.verb]:null));if(vw==='steal'&&sen.obj&&((sen.obj.k==='player'&&sen.obj.i!==who)||(sen.obj.k==='thing'&&(findThing(S,sen.obj.id)||{}).side!==who))){const c=Object.assign({},sen);delete c.obj;return c;}}catch(e){}return sen;};
{const _v=validate;validate=function(S,who,sen){sen=norm(S,who,sen);const r=_v(S,who,sen);if(!r||!r.ok){if(r&&r.why&&/sealed\. You cannot single it out/.test(r.why))r.why='It is sealed: it cannot be singled out. A category (such as beasts) or something that touches every thing opposite still reaches it.';return r;}
 try{const hand=S.players[who].hand,vw=sen.kverb||(sen.verb!=null?hand[sen.verb]:null);if(vw&&sen.subj&&sen.subj.k==='thing'&&W[vw]&&W[vw].kind==='agent'){const t=findThing(S,sen.subj.id);if(t&&t.side===who){const st=t.st||{},why=st.frozen?'is frozen':st.asleep?'is asleep':st.bound?'is bound fast':st.stone?'has been turned to stone':null;if(why)return{ok:false,why:Cap(t.title||t.w)+' '+why+' and cannot act this turn.',cost:0};}}if(vw&&ATTACKV.includes(vw)&&sen.subj&&sen.subj.k==='thing'){const t=findThing(S,sen.subj.id);if(t&&t.side===who&&t.fresh&&!t.props.includes('swift')&&!t.st.quick)return{ok:false,why:Cap(t.title||t.w)+' has only just arrived. It can attack next turn.',cost:0};}}catch(e){}
 return r;};}

/* ---- every life change appears in the Chronicle ---- */
const LIFE_RE=/(You|The rival) (lose|loses|gain|gains) (\d+) life/g;
function logged(S,from,i){let d=0;for(const l of S.log.slice(from)){const x=String(l&&l.x!=null?l.x:l);let m;LIFE_RE.lastIndex=0;while((m=LIFE_RE.exec(x))){const who=m[1]==='You'?0:1;if(who!==i)continue;d+=(m[2][0]==='g'?1:-1)*(+m[3]);}}return d;}
function track(S,fn){if(!S||S.quiet||!S.players)return fn();const L=S.log.length,l0=[S.players[0].life,S.players[1].life];const r=fn();
 for(const i of [0,1]){const d=S.players[i].life-l0[i],rest=d-logged(S,L,i);if(rest)say(S,(i===0?(rest>0?'You gain ':'You lose '):(rest>0?'The rival gains ':'The rival loses '))+Math.abs(rest)+' life.');}return r;}
{const _st=startTurn;startTurn=function(S,i){return track(S,()=>_st.apply(this,arguments));};}
{const _et=endTurn;endTurn=function(S){return track(S,()=>_et.apply(this,arguments));};}

/* ---- a sentence that would not work cannot be spoken; and nothing crashes ---- */
let depth=0;
function dig(X){try{return JSON.stringify([X.players.map(p=>[p.life,p.poisoned,p.asleep,p.dazed,p.silence&&p.silence.length,p.coins]),X.things.map(t=>[t.id,t.w,t.side,t.vig,JSON.stringify(t.st||{}),(t.props||[]).length,t.title]),X.clime&&X.clime.w]);}catch(e){return Math.random();}}
function why(C,from){const ls=C.log.slice(from).map(l=>String(l&&l.x!=null?l.x:l)).filter(x=>!/^(You say|The rival says|The rival says something)/.test(x)&&x!=='Nothing happens.');return ls.length?ls[ls.length-1]:'That would do nothing.';}
{const _r=resolve;resolve=function(S,who,sen){sen=norm(S,who,sen);
 const run=T=>{try{return _r(T,who,sen);}catch(e){console.error('v13 resolve',e);try{window.dtvReportErr&&dtvReportErr(e);}catch(x){}if(T&&T.log&&!T.quiet)say(T,'The words fizzle.');return{ok:false,why:'Those words fizzle.'};}};
 if(depth||S.quiet){const r=run(S);if(r&&r.ok&&r.effect===false&&sen&&sen.veil==null)return{ok:false,why:'That would do nothing.',cost:0};return r;}
 if(sen&&sen.veil==null){let C=null,dig0=null;try{C=JSON.parse(JSON.stringify(S));dig0=dig(C);}catch(e){}
  if(C){const L=C.log.length;depth++;let r;try{r=run(C);}finally{depth--;}const sprang=C.log.slice(L).some(l=>/A hidden word springs/.test(String(l&&l.x!=null?l.x:l)));if(r&&r.ok&&r.effect===false&&!sprang&&sen.clime==null&&dig(C)===dig0)return{ok:false,why:why(C,L)+' (Nothing would happen, so it is not said.)',cost:0};}}
 return track(S,()=>run(S));};}

/* ---- attuned things carry a visible mark ---- */
const css=document.createElement('style');css.textContent='.dtv13 .thing.att13::after{content:"attuned";position:absolute;left:50%;top:-9px;transform:translateX(-50%);font:600 9px/1 "Alegreya Sans",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#f3e4c2;background:rgba(20,14,8,.9);border:1px solid rgba(230,196,94,.6);border-radius:8px;padding:2px 5px;pointer-events:none;z-index:7}';
document.head.appendChild(css);

function dec13(){if(typeof S==='undefined'||!S||!S.things)return;
 document.querySelectorAll('#table .thing[data-id]').forEach(el=>{const t=S.things.find(x=>String(x.id)===el.dataset.id);el.classList.toggle('hid13',!!(t&&t.side===1&&t.st&&t.st.occult));if(t&&t.side===1&&t.st&&t.st.occult){el.setAttribute('title','Something hidden');}});
 const it=document.querySelector('#rivalhead .intent i');if(it&&S.intent&&S.intent.sen&&!it.dataset.v13){it.dataset.v13=1;let x=it.textContent;
  for(const t of S.things)if(t.side===1&&t.st&&t.st.occult){const n=t.title||t.w;x=x.replace(new RegExp('\\b'+n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\b','i'),'something hidden');}
  const sj=S.intent.sen.subj;if(sj&&sj.k==='card'&&(S.intent.sen.verb!=null||S.intent.sen.kverb)){const w=S.players[1].hand[sj.i];if(w&&W[w]&&W[w].t===NOUN)x=x.replace(/\.$/,'')+' (bringing '+w+' out of its hand).';}
  it.textContent=x;}}
const _dec=window.dtvDecorate;window.dtvDecorate=function(){if(_dec)_dec();try{dec13();}catch(e){}try{document.body.classList.add('dtv13');document.querySelectorAll('#table .thing[data-id]').forEach(el=>{const t=S.things.find(x=>String(x.id)===el.dataset.id);el.classList.toggle('att13',!!(t&&t.att));});}catch(e){}};
/* ---- attacks show their base, and say when a hurt thing hits softer ---- */
for(const v of ATTACKV)if(VERBF[v]){const f=VERBF[v];VERBF[v]=function(S,who,subs,objs,c){try{const a=(subs||[]).find(e=>e&&e.k==='t');if(c&&a)c.att13=a.t;}catch(e){}return f.apply(this,arguments);};}
window.dtvBase13=function(S,n){try{const c=S.cx,a=c&&c.att13;if(!a||!window.MT)return null;const m=MT(a);if(m!==n)return null;const whole=window.MTW?MTW(a.w):m,nm2=(a.side===0?'your ':'the rival’s ')+(a.title||a.w);return n+' ('+nm2+'’s strike'+(whole>m?', hurt: '+whole+' when whole':'')+')';}catch(e){return null;}};
/* ---- protect says exactly what it gave ---- */
if(VERBF.protect){const f=VERBF.protect;VERBF.protect=function(S,who,subs,objs,c){const all=[].concat(subs||[],objs||[]).filter(e=>e&&e.k==='t'),v0=all.map(e=>e.t.vig);const r=f.apply(this,arguments);try{all.forEach((e,i)=>{const d=e.t.vig-v0[i];if(d>0)say(S,'Protected: +'+d+' (20%, rounded up), '+v0[i]+' to '+e.t.vig+'.');});}catch(x){}return r;};}

/* ================= stage 2 ================= */
/* ---- the rival: no harm to its own things, no re-protecting, no stacking a word twice ---- */
const HARM=['strike','bite','crush','cut','sting','poison','bind','drench','dissolve','haunt','blind','petrify','steal','drink','eat','decay','wither','rust','burn','calcine','lure','tame','measure','forget','sleep'];
{const _c=candidates;candidates=function(S,who){const out=_c(S,who);if(!(S&&S.players))return out;const hand=S.players[who].hand;
 return out.filter(sen=>{try{const vw=sen.kverb||(sen.verb!=null?hand[sen.verb]:null);const th=r=>r&&r.k==='thing'?findThing(S,r.id):null,so=th(sen.subj),oo=th(sen.obj);
  if(vw&&HARM.includes(vw)){if(oo&&oo.side===who)return false;if(!sen.obj&&so&&so.side===who&&W[vw]&&W[vw].kind!=='agent')return false;if(sen.obj&&sen.obj.k==='player'&&sen.obj.i===who)return false;}
  if(vw==='protect'||vw==='name'){const t=oo||so;if(t&&(t.props.includes('named')||(t.st&&t.st.named)))return false;}
  if(so&&(sen.adjs||[]).length&&!vw){const title=(so.title||'')+' '+(so.traits||[]).join(' ');if((sen.adjs||[]).some(i=>title.includes(hand[i])))return false;}
  return true;}catch(e){return true;}});};}
/* the rival takes a small blow rather than throw a thing away */
{const _bd=botDefend;botDefend=function(S,ds,who,sen){const best=_bd(S,ds,who,sen);if(best==null)return best;
 try{const C=JSON.parse(JSON.stringify(S));C.quiet=true;resolve(C,who,Object.assign({},sen,{def:best}));const dies=!C.things.some(t=>t.id===best);
  const D=JSON.parse(JSON.stringify(S));D.quiet=true;resolve(D,who,Object.assign({},sen,{def:null}));const hit=S.players[ds].life-D.players[ds].life;
  if(dies&&hit<Math.max(6,Math.ceil(S.players[ds].life*.25))&&!S.places)return null;}catch(e){}return best;};}
/* the rival doesn't sit on breath: if it has nothing better, it still says the best sentence that does something */
{const _bc=botChoose;botChoose=function(S,who){const r=_bc(S,who);if(r||!S||!S.players)return r;const p=S.players[who];if((p.ink||0)<2)return r;
 let best=null,bv=-Infinity;const base=evalState(S,who);for(const sen of candidates(S,who).slice(0,400)){if(sen.veil!=null)continue;try{const C=JSON.parse(JSON.stringify(S));C.quiet=true;const q=resolve(C,who,sen);if(!q||!q.ok||q.effect===false)continue;const v=evalState(C,who)-base;if(v>bv){bv=v;best=sen;}}catch(e){}}
 return best&&bv>-1?best:r;};}

/* ---- sentences read as sentences ---- */
{const _d=describe;describe=function(S,who,sen){const s=_d(S,who,sen);try{if(sen&&sen.veil==null&&sen.clime==null&&(sen.adjs||[]).length&&sen.verb==null&&!sen.kverb&&sen.subj&&sen.subj.k==='thing'&&!sen.obj){const hand=S.players[who].hand,t=findThing(S,sen.subj.id);if(t){const a=sen.adjs.map(i=>hand[i]);return 'Make '+nm(S,T(t))+' '+(a.length>1?a.slice(0,-1).join(', ')+' and '+a[a.length-1]:a[0])+'.';}}}catch(e){}return s;};}

/* ---- blocks: say why an attack can't be blocked ---- */
function noBlockWhy(S,who,sen){try{if(!sen.obj||sen.obj.k!=='player'||sen.obj.i===who||sen.clime!=null)return null;const hand=S.players[who].hand,vw=sen.kverb||(sen.verb!=null?hand[sen.verb]:null);if(!vw||!BLOCKABLE.includes(vw))return null;
 if(brave(S,who))return 'Courage: it cannot be blocked.';if((sen.adjs||[]).some(i=>['occult','masked'].includes(hand[i])))return 'It is hidden as it strikes: it cannot be blocked.';const att=attackerOf(S,who,sen);if(!att)return null;const n=Cap(att.title||att.w);
 if(att.st.occult)return n+' is hidden: it cannot be blocked.';if(att.props.includes('stealth'))return n+' moves unseen: it cannot be blocked.';if(att.props.includes('spirit')&&!att.props.includes('allthings'))return n+' is a spirit: nothing can block it.';
 const fly=(att.props.includes('bird')||att.props.includes('flying'))&&!att.st.sodden&&!att.st.grounded;const ds=1-who;
 if(S.things.some(t=>t.side===ds&&t.st.guarding&&takes(t,vw)&&!inert(t)&&(!fly||flies(t))))return 'A thing on guard steps in by itself.';
 if(!side(S,ds).some(t=>!isG(t)))return null;const el=eligibleDef(S,ds,att);if(!el.length)return fly?n+' flies: only a flier could block it, and '+(ds===0?'you have':'they have')+' none ready.':'Nothing '+(ds===0?'of yours':'of theirs')+' can block it.';return null;}catch(e){return null;}}
window.dtvNoBlockWhy=noBlockWhy;
{const _nd=needsDefence;needsDefence=function(S,who,sen){try{const hand=S.players[who].hand;if((sen.adjs||[]).some(i=>['occult','masked'].includes(hand[i])))return false;}catch(e){}return _nd.apply(this,arguments);};}
{const _r2=resolve;resolve=function(S,who,sen){if(S&&!S.quiet&&sen&&sen.def===undefined&&S.phase!=='defend'){const w=noBlockWhy(S,who,sen);if(w&&validate(S,who,sen).ok){const r=_r2(S,who,sen);if(r&&r.ok)say(S,'No block: '+w);return r;}}return _r2(S,who,sen);};}

/* ---- the interface ---- */
const onReady=f=>{const go=()=>setTimeout(()=>{try{f();}catch(e){console.error('v13 ui',e);}},0);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();};
onReady(()=>{
 /* deck counts on card faces use this duel's deck */
 if(typeof reachLine==='function'&&typeof reachTest==='function'){reachLine=function(w){const f=reachTest(w);if(!f)return '';let pool=[];try{const p=S&&S.players&&S.players[0];if(p)pool=[].concat(p.deck||[],p.hand||[],p.discard||[],(S.things||[]).filter(t=>t.side===0&&!t.token).map(t=>t.w));}catch(e){}
  const hit=THINGS.filter(f),mine=[...new Set(pool)].filter(x=>W[x]&&W[x].t===NOUN&&hit.includes(x)),pct=Math.round(100*hit.length/THINGS.length);
  const lab=W[w].t===VERB&&!EVFIT[w]?'can do this':W[w].t===VERB?'can take this':'are touched';
  return '<i class="c-reach'+(mine.length?'':' none')+'" title="'+(mine.length?'In this duel’s deck: '+esc(mine.join(', ')):'Nothing in this duel’s deck')+'">'+pct+'% of things '+lab+' · '+mine.length+' in this duel’s deck</i>';};}
 /* the face-down button only for curses */
 const css2=document.createElement('style');css2.textContent=
  '.dtv13 #dend,.dtv13 .endsheet,.dtv13 #view-match .end{max-height:100vh;overflow-y:auto}'
 +'.dtv13 .c-n,.dtv13 .c-w{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}'
 +'html.dtv13x,body.dtv13{overflow-x:hidden}'
 +'.dtv13 .intent{position:relative;z-index:3;max-width:100%}'
 +'.dtv13 .nob13{display:block;margin-top:6px;font-size:13px;color:#e8dcc0}'+'.dtv13 .thing.hid13 .cf>*:not(.c-frame){visibility:hidden}.dtv13 .thing.hid13 .cf{background:radial-gradient(circle at 50% 42%,#3b2a19,#140d08 72%);box-shadow:inset 0 0 0 3px rgba(201,162,74,.45)}.dtv13 .thing.hid13 .mtb,.dtv13 .thing.hid13 .states{display:none}';
 document.head.appendChild(css2);

 /* the hand keeps its places while the pointer is over it, so the next click lands where you aimed */
 let hk=null,inHand=false;document.addEventListener('pointerover',e=>{const h=document.getElementById('hand');if(!h)return;const now=h.contains(e.target);if(now&&!inHand){inHand=true;hk=null;}else if(!now&&inHand){inHand=false;hk=null;const gs=h.querySelectorAll('.ghost13');if(gs.length){gs.forEach(x=>x.remove());try{fit();}catch(x){}}}},true);
 window.dtvHand13=function(){try{const h=document.getElementById('hand');if(!h||typeof S==='undefined'||!S)return;const cur=S.players[0].hand.slice();
  if(!inHand||!hk){hk=cur;return;}
  let i=0;const holes=[];for(let k=0;k<hk.length;k++){if(i<cur.length&&hk[k]===cur[i])i++;else holes.push(k);}
  if(i!==cur.length||!holes.length||holes.length>4){hk=cur;return;}
  const cards=[...h.querySelectorAll(':scope > .card:not(.ghost13)')];if(cards.length!==cur.length)return;
  for(const k of holes){const g=document.createElement('div');g.className='card ghost13';g.setAttribute('aria-hidden','true');const ref=h.querySelectorAll(':scope > .card')[k];if(ref)h.insertBefore(g,ref);else h.appendChild(g);}
 }catch(e){}};
 const css3=document.createElement('style');css3.textContent='#hand .card.ghost13{visibility:hidden;pointer-events:none}.dtv13 .thing.idle13 .cf{filter:grayscale(.75) brightness(.62);transition:filter .3s}.dtv13 .thing.idle13:hover .cf{filter:grayscale(.4) brightness(.85)}.dtv13 .own13{margin:0 0 6px;padding:6px 8px;border-left:3px solid #e07a5f;background:rgba(224,122,95,.12);color:#f3e4c2;font-size:13px}';document.head.appendChild(css3);
 /* warn when a sentence turns on your own thing */
 window.dtvIdle13=function(){try{const on=typeof S!=='undefined'&&S&&S.phase==='play'&&S.active===0&&typeof readyVerbs==='function';document.querySelectorAll('#table .thing[data-id]').forEach(el=>{const t=on?S.things.find(x=>String(x.id)===el.dataset.id):null;el.classList.toggle('idle13',!!(t&&t.side===0&&!(t.props||[]).includes('ground')&&!readyVerbs(t).length));});}catch(e){}};
 window.dtvOwn13=function(){try{if(typeof ui==='undefined'||typeof S==='undefined'||!S||S.phase!=='play')return;const hand=S.players[0].hand,vw=ui.kverb||(ui.verb!=null?hand[ui.verb]:null);const th=r=>r&&r.k==='thing'?findThing(S,r.id):null,o=th(ui.obj),s=th(ui.subj);
  const mine=vw&&HARM.includes(vw)&&((o&&o.side===0)||(!ui.obj&&s&&s.side===0&&W[vw]&&W[vw].kind!=='agent'));const host=document.querySelector('.mguide');if(!host)return;let w=host.querySelector('.own13');
  if(!mine){if(w)w.remove();return;}if(!w){w=document.createElement('p');w.className='own13';host.prepend(w);}w.textContent='Careful: this turns '+vw+' on your own '+((o||s).title||(o||s).w)+'.';}catch(e){}};
 /* last match: record it when the duel ends, not only when the end sheet is clicked through */
 const _rm=window.renderMatch;if(typeof _rm==='function'){renderMatch=function(){const r=_rm.apply(this,arguments);try{if(S&&S.over!=null&&!S.last13&&!S.puz&&typeof PF!=='undefined'){S.last13=1;PF.last={r:S.quit||S.over===1?'loss':S.over===0?'win':'draw',n:(typeof rvName==='function'?rvName():(S.rival&&S.rival.n)||'the rival'),p:(typeof rivalOf==='function'?rivalOf().p:null),gold:(S.paid||{}).gold||0};if(typeof save==='function')save();}}catch(e){}
   try{if(S&&S.phase==='defend'&&S.pending){const bx=document.querySelector('.btns [data-act="def"][data-id=""]');if(bx&&!bx.dataset.sum13){const C=JSON.parse(JSON.stringify(S));C.phase='bot';const L=C.log.length;resolve(C,1,Object.assign({},C.pending,{def:null}));const sm=C.log.slice(L).map(l=>String(l.x||l)).find(x=>/^The sum:/.test(x));bx.dataset.sum13=1;if(sm){const h=document.createElement('span');h.className='nob13';h.textContent='If you take it: '+sm.replace(/^The sum: /,'');bx.parentElement.appendChild(h);}}}}catch(e){}
   try{window.dtvHand13&&dtvHand13();window.dtvOwn13&&dtvOwn13();window.dtvIdle13&&dtvIdle13();}catch(e){}
   return r;};}
});

})();
