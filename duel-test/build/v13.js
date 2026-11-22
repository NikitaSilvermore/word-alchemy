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
{const _v=validate;validate=function(S,who,sen){const r=_v(S,who,sen);if(!r||!r.ok){if(r&&r.why&&/sealed\. You cannot single it out/.test(r.why))r.why='It is sealed: it cannot be singled out. A category (such as beasts) or something that touches every thing opposite still reaches it.';return r;}
 try{const hand=S.players[who].hand,vw=sen.kverb||(sen.verb!=null?hand[sen.verb]:null);if(vw&&ATTACKV.includes(vw)&&sen.subj&&sen.subj.k==='thing'){const t=findThing(S,sen.subj.id);if(t&&t.side===who&&t.fresh&&!t.props.includes('swift')&&!t.st.quick)return{ok:false,why:Cap(t.title||t.w)+' has only just arrived. It can attack next turn.',cost:0};}}catch(e){}
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
function why(C,from){const ls=C.log.slice(from).map(l=>String(l&&l.x!=null?l.x:l)).filter(x=>!/^(You say|The rival says|The rival says something)/.test(x)&&x!=='Nothing happens.');return ls.length?ls[ls.length-1]:'That would do nothing.';}
{const _r=resolve;resolve=function(S,who,sen){
 const run=T=>{try{return _r(T,who,sen);}catch(e){console.error('v13 resolve',e);if(T&&T.log&&!T.quiet)say(T,'The words fizzle.');return{ok:false,why:'Those words fizzle.'};}};
 if(depth||S.quiet){const r=run(S);if(r&&r.ok&&r.effect===false&&sen&&sen.veil==null)return{ok:false,why:'That would do nothing.',cost:0};return r;}
 if(sen&&sen.veil==null){let C=null;try{C=JSON.parse(JSON.stringify(S));}catch(e){}
  if(C){const L=C.log.length;depth++;let r;try{r=run(C);}finally{depth--;}const sprang=C.log.slice(L).some(l=>/A hidden word springs/.test(String(l&&l.x!=null?l.x:l)));if(r&&r.ok&&r.effect===false&&!sprang)return{ok:false,why:why(C,L)+' (Nothing would happen, so it is not said.)',cost:0};}}
 return track(S,()=>run(S));};}

/* ---- attuned things carry a visible mark ---- */
const css=document.createElement('style');css.textContent='.dtv13 .thing.att13::after{content:"attuned";position:absolute;left:50%;top:-9px;transform:translateX(-50%);font:600 9px/1 "Alegreya Sans",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#f3e4c2;background:rgba(20,14,8,.9);border:1px solid rgba(230,196,94,.6);border-radius:8px;padding:2px 5px;pointer-events:none;z-index:7}';
document.head.appendChild(css);
const _dec=window.dtvDecorate;window.dtvDecorate=function(){if(_dec)_dec();try{document.body.classList.add('dtv13');document.querySelectorAll('#table .thing[data-id]').forEach(el=>{const t=S.things.find(x=>String(x.id)===el.dataset.id);el.classList.toggle('att13',!!(t&&t.att));});}catch(e){}};
})();
