/* V19 rules audit (23 Nov): every card works as its text says. Gated on DTV>=19; earlier versions play as before.
   Load after v18.js. Each fix names the card text it serves. */
(function(){
'use strict';
if(!((window.DTV|0)>=19))return;
const G=(w,s)=>{if(W[w])W[w].gloss=s;};
const AP=(w,s)=>{if(W[w]&&W[w].gloss.indexOf(s)<0)W[w].gloss=W[w].gloss.replace(/\s*$/,'')+' '+s;};
const flyP=t=>t.props.includes('flying')||t.props.includes('bird');
const one=a=>a&&a.length===1;
let LASTA=null;
{const _da=didAct;didAct=function(S,who,e,keep){if(e&&e.k==='t')LASTA=e.t;return _da.apply(this,arguments);};}

/* 1. harm is always a whole number (bite ×1.25, crush, seep halves): rounded up, as every percentage is */
{const _dm=damage;damage=function(S,e,n,cause){if(typeof n==='number'&&isFinite(n)&&!Number.isInteger(n))n=Math.ceil(n-1e-9);
  /* a curse that puts a thing to sleep does not wake it with its own 2 harm (torpid) */
  if(cause==='curse'&&e&&e.k==='t'&&e.t&&e.t.st&&e.t.st.asleep){const z=e.t.st.asleep;const r=_dm.apply(this,[S,e,n,cause]);if(e.t.st)e.t.st.asleep=z;return r;}
  try{const c=S&&S.cx;if(c&&c.pre&&e&&e.k==='t'&&e.t&&e.t.st&&e.t.st.guarding&&['attack','bite','crush','cut','sting','seep','fight','drench'].includes(cause)&&!/on guard/.test(c.pre))c.pre+=' −30% (on guard)';}catch(x){}
  return _dm.apply(this,[S,e,n,cause]);};}
{const _ps=poison;poison=function(S,e,m){if(typeof m==='number'&&!Number.isInteger(m))m=Math.max(1,Math.round(m));return _ps.apply(this,[S,e,m]);};}

/* 2. who may stand in the way. Only a flyer can stop a flyer; a flyer stands in the way of something on the ground only when on guard;
      spirits and fleeting things never step in; nothing blocks a spirit */
{const _cs=canStop;canStop=function(t,a){if(!_cs.apply(this,arguments))return false;
  if(a&&a.k==='t'){const at=a.t;if(ghost(at))return false;if(!flies(at)&&flies(t)&&!t.st.guarding)return false;}
  if(t.props.includes('fleeting')||ghost(t))return false;return true;};}
{const _ed=eligibleDef;eligibleDef=function(S,ds,att){const r=_ed.apply(this,arguments);try{if(!att)return r;const af=flies(att);
  return r.filter(t=>(!af||flies(t))&&(af||!flies(t)||t.st.guarding)&&!t.props.includes('fleeting')&&!ghost(t));}catch(e){return r;}};}

/* 3. what you take is yours: lure, tame and summon change the keeper too (it goes to your discard when it falls) */
for(const v of ['lure','tame','summon'])if(VERBF[v]){const f=VERBF[v];VERBF[v]=function(S,who,subs,objs,c){const was=(subs||[]).filter(e=>e&&e.k==='t').map(e=>({t:e.t,side:e.t.side,vig:e.t.vig}));const r=f.apply(this,arguments);
  for(const x of was){const t=x.t;if(S.things.includes(t)&&x.side!==who&&t.side===who){t.owner=who;}
    /* lure: if it cannot be taken, it takes 3 */
    else if(v==='lure'&&S.things.includes(t)&&x.side!==who&&t.side!==who&&!isG(t)){say(S,'It will not come, and the lure stings it.');damage(S,{k:'t',t},3,'lure');c.effect=true;}}
  return r;};}

/* 4. the bard draws on spells of The Word only (v19), not on every sentence of three words (v17) */
{const _rs=resolve;resolve=function(S,who,sen){const q=S&&S.quiet0;if(S)S.quiet0=1;try{return _rs.apply(this,arguments);}finally{if(S){if(q)S.quiet0=q;else delete S.quiet0;}}};}
G('bard','Each time you speak a spell of The Word, you draw a word. A speaker: your spells of The Word hit 2 harder (up to 3 speakers).');
for(const w of ['scribe','hermit','miser','alchemist','homunculus'])if(W[w])W[w].gloss=W[w].gloss.replace(/ ?A speaker: your spells of The Word hit 1 harder \(up to 2\)\./,'').replace(/\s*$/,'')+' A speaker: your spells of The Word hit 2 harder (up to 3 speakers).';

/* 4b. breath never goes below 0: the well pays for spells and weather, judged before the words leave the hand
       (spend looked at the hand after the words were taken out of it, so the well was skipped and breath went to -1) */
{const _rs=resolve,_wu=wellUse;resolve=function(S,who,sen){let wu=null;try{if(S&&S.players&&sen&&sen.veil==null)wu=_wu(S,who,sen);}catch(e){}
  if(wu==null)return _rs.apply(this,arguments);const prev=wellUse;wellUse=function(S2,w2,s2){if(S2===S&&w2===who)return wu;return _wu.apply(this,arguments);};try{return _rs.apply(this,arguments);}finally{wellUse=prev;}};}

/* 5. the extra each spell-verb promises on its card (lost when the verbs were rewritten in v8) */
const own=(S,who,es,n)=>{for(const e of es)if(e&&e.k==='t'&&S.things.includes(e.t)&&e.t.side===who&&!isG(e.t)){e.t.vig+=n;say(S,Cap(nm(S,e))+' also gains '+n+', and has '+e.t.vig+'.');}};
const foe=(S,who,es,n)=>{for(const e of es)if(e&&e.k==='t'&&S.things.includes(e.t)&&e.t.side!==who&&!isG(e.t)){say(S,Cap(nm(S,e))+' also takes '+n+'.');damage(S,e,n,'word');}};
const after=(v,fx)=>{if(!VERBF[v])return;const f=VERBF[v];VERBF[v]=function(S,who,subs,objs,c){const e0=c.effect;c.effect=false;const r=f.apply(this,arguments);const did=c.effect;c.effect=e0||did;if(did&&S.over==null)fx(S,who,subs||[],objs||[],c);return r;};};
after('distil',(S,w,s,o)=>own(S,w,s.concat(o),3));
after('ripen',(S,w,s,o)=>own(S,w,s.concat(o),3));
after('temper',(S,w,s,o)=>own(S,w,s.concat(o),4));
after('rust',(S,w,s,o)=>foe(S,w,s.concat(o),2));
after('wither',(S,w,s,o)=>foe(S,w,s.concat(o),3));
after('wake',(S,w)=>{drawN(S,w,1);say(S,(w===0?'You draw':'The rival draws')+' a word.');});
after('scream',(S,w,s,o,c)=>{const k=s.some(e=>e&&e.k==='t'&&e.t.w==='mandrake')?2:1;damage(S,P(1-w),k*(c.mult||1),'scream');});
/* events rewritten in v8 lost their extra */
if(EVENT.dream){const f=EVENT.dream;EVENT.dream=function(S,who,c){f.apply(this,arguments);if(S.over==null){say(S,'The dream takes 3 more from '+(who===0?'the rival':'you')+'.');damage(S,P(1-who),3,'dream');}c.effect=true;};}
if(EVENT.loan){const f=EVENT.loan;EVENT.loan=function(S,who,c){f.apply(this,arguments);S.players[who].life+=2;say(S,(who===0?'You gain':'The rival gains')+' 2 life.');c.effect=true;};}
/* reckoning works whenever the rival is there to take its 2 */
if(EVENT.reckoning)EVENT.reckoning=function(S,who,c){const l=S.things.filter(t=>!isG(t)&&t.side!==who&&t.vig<=4);say(S,l.length?'The reckoning. Every rival thing of vigour 4 or less is weighed and found wanting.':'The reckoning finds nothing small enough to fall.');
  for(const t of l)if(S.things.includes(t))destroy(S,t,'reckoning');damage(S,P(1-who),2,'word');c.effect=true;};
G('reckoning','A single-use spell: say it alone and it is spent. Every rival thing of vigour 4 or less is destroyed, and the rival takes 2. Your own side is untouched.');
/* blow: the rival always takes 3 when a thing is carried across */
if(VERBF.blow){const f=VERBF.blow;VERBF.blow=function(S,who,subs,objs,c){objs=(objs||[]).filter(o=>{if(o&&o.k==='t'&&o.t.side!==who){say(S,'The wind carries only your own things across.');return false;}return true;});arguments[3]=objs;const l0=S.players[1-who].life,e0=c.effect;c.effect=false;const r=f.apply(this,arguments);const did=c.effect;c.effect=e0||did;
  const carried=S.log.slice(-8).some(l=>/carries .* across/.test(String(l.x||'')));if(!did&&carried&&S.over==null){say(S,'The rival also takes 3.');damage(S,P(1-who),3,'wind');c.effect=true;}return r;};}

/* 6. a sentence that works is never refused as "won't work" because one line of it sounds like a failure
      (radiant, noon: "cannot survive the light"; blow: "nothing comes of it") */
function dig(X){try{return JSON.stringify([X.players.map(p=>[p.life,p.poisoned,p.asleep,p.dazed,(p.silence||[]).length,p.hand.length,p.coins,p.ink]),X.things.map(t=>{const s=Object.assign({},t.st||{});delete s.guarding;delete s.occult;delete s.masked;delete s.quick;return[t.id,t.w,t.side,t.vig,JSON.stringify(s),(t.props||[]).length];}),X.clime&&X.clime.w]);}catch(e){return Math.random();}}
{const _v=validate;validate=function(S,who,sen){const r=_v.apply(this,arguments);if(r&&!r.ok&&/^That won’t work: /.test(r.why||'')&&!window.DTVDRY&&sen&&sen.veil==null){
  let base=null;window.DTVDRY=1;try{base=_v.apply(this,arguments);}finally{window.DTVDRY=0;}if(!base||!base.ok)return r;
  let moved=false;window.DTVDRY=1;try{const C=JSON.parse(JSON.stringify(Object.assign({},S,{log:[]})));if(C.players[1-who])C.players[1-who].veil=null;const c0=dig(C);const cost=base.cost||0;C.players[who].ink=Math.max(C.players[who].ink,cost);
    const rr=resolve(C,who,JSON.parse(JSON.stringify(sen)));const c1=JSON.parse(JSON.stringify(C));if(rr&&rr.ok){/* spending breath and words alone is not an effect */c1.players[who].ink=JSON.parse(c0)[0][who][7];const D0=JSON.parse(c0),D1=JSON.parse(dig(c1));D0[0][who][5]=D1[0][who][5];moved=JSON.stringify(D0)!==JSON.stringify(D1);}}
  catch(e){moved=false;}finally{window.DTVDRY=0;try{SCUR=S;}catch(e){}}
  return moved?base:r;}return r;};}

/* 7. foundry: everything of yours that is not alive gains 1 at the start of your turn (it was switched off) */
{const _st=startTurn;startTurn=function(S,i){const r=_st.apply(this,arguments);try{if(S.over!=null)return r;const mine=S.things.filter(t=>t.side===i);
  if(mine.some(t=>t.props.includes('foundry'))){const l=mine.filter(t=>!isG(t)&&!t.props.includes('living')&&!ghost(t));if(l.length){say(S,'The foundry works. Everything '+(i===0?'of yours':'of the rival’s')+' that is not alive gains 1.');for(const t of l)if(!t.st.measured)t.vig+=1;}}}catch(e){console.error(e);}return r;};}

/* 8. ice: the first thing to strike it is frozen, even as the ice shatters; toxic things poison with seep and drench too */
{const _hit=hit;hit=function(S,o,n,cause){const a=LASTA;try{if(o&&o.k==='t'&&o.t&&o.t.props.includes('ice')&&!o.t.st.bit&&a&&a!==o.t&&S.things.includes(a)&&a.side!==o.t.side&&!a.st.frozen&&['attack','bite','crush','cut','sting','strike'].includes(cause)){o.t.st.bit=1;say(S,'The ice bites back: '+nm(S,{k:'t',t:a})+' is frozen.');cold(S,{k:'t',t:a});}}catch(x){}
  const r=_hit.apply(this,arguments);
  try{if(a&&['seep','drench'].includes(cause)&&a.props.includes('toxic')&&alive(S,o)&&(o.k==='p'||(o.t.props.includes('living')&&!o.t.props.includes('toxic'))))poison(S,o,1);}catch(x){}
  try{if(cause==='drench'&&S._dr)S._dr.push({o,a});}catch(x){}return r;};}

/* 9. drench: each liquid does what its card says (pitch makes things burn, dew cures poison, brine hurts plants, acid bites) */
if(VERBF.drench){const f=VERBF.drench;VERBF.drench=function(S,who,subs,objs,c){const prev=S._dr;S._dr=[];let r;try{r=f.apply(this,arguments);}finally{const hits=S._dr;S._dr=prev;
  for(const h of hits){const o=h.o,a=h.a;if(!a||!alive(S,o))continue;const ap=a.props;
    if(ap.includes('flammable')&&o.k==='t'&&!ghost(o.t)){addProp(o.t,'flammable');say(S,Cap(nm(S,o))+' is soaked in '+a.w+' and will burn.');}
    if(ap.includes('pure')){if(o.k==='p'){if(S.players[o.i].poisoned){S.players[o.i].poisoned=0;say(S,'The poison is washed out.');}}else if(o.t.st.poisoned){o.t.st.poisoned=0;say(S,'The poison is washed out.');}}
    if(ap.includes('salty')&&o.k==='t'&&o.t.props.includes('plant')&&!isG(o.t)){say(S,'Salt kills the root.');destroy(S,o.t,'wither');}
    if(ap.includes('corrosive')&&alive(S,o)){say(S,'The acid bites.');damage(S,o,2,'acid');}}}return r;};}
G('brine','Salt water. Kills the plants it drenches.');

/* 10. healing never takes life away (mend, drink and eat capped life at 60 even when you stood above it) */
for(const v of ['mend','drink','eat'])if(VERBF[v]){const f=VERBF[v];VERBF[v]=function(S){const ex=S.players.map(p=>Math.max(0,p.life-LIFE));S.players.forEach((p,i)=>p.life-=ex[i]);try{return f.apply(this,arguments);}finally{S.players.forEach((p,i)=>p.life+=ex[i]);}};}

/* 11. hit (the strike card) adds 2 when said from your hand: shown in the sum and on the card */
if(VERBF.strike){const f=VERBF.strike;VERBF.strike=function(S,who,subs,objs,c){if(c&&c.manner&&!c.pre){const a=(subs||[]).find(e=>e&&e.k==='t'&&e.t.side===who);if(a)c.pre=MT(a.t)+' might + '+c.manner+' (said from your hand)';}return f.apply(this,arguments);};}
AP('strike','Said from your hand, it hits 2 harder.');
/* Life beasts bite 25% harder (v17 tuning): named in the sum and on the card */
if(VERBF.bite){const f=VERBF.bite;VERBF.bite=function(S,who,subs,objs,c){const lb=(subs||[]).some(e=>e&&e.k==='t'&&e.t.props.includes('beast')&&schoolOf(e.t.w)==='life');if(lb){c.why=(c.why||[]).concat(['a Life beast bites 25% harder']);}try{return f.apply(this,arguments);}finally{/* a draining bite gives back whole life */for(const p of S.players)if(!Number.isInteger(p.life))p.life=Math.ceil(p.life-1e-9);if(lb&&c.why)c.why=c.why.filter(x=>x!=='a Life beast bites 25% harder');}};}
AP('bite','A Life beast bites 25% harder.');

/* 12. crush: might +50% in all (it was +30% then ×1.3 again: +69%); what is left over after it destroys the blocker goes through to the rival;
       it no longer carries on into a second thing behind */
if(VERBF.crush){const f=VERBF.crush;VERBF.crush=function(S,who,subs,objs,c){const m0=c.mult||1;const pre=new Map(S.things.filter(t=>t.side!==who).map(t=>[t,t.vig]));const L=S.log.length;
  const _h=hit,_b=blockOf;const seen=[],blk=[];
  blockOf=function(S2,o,c2,a){const r=_b.apply(this,arguments);if(r&&r.k==='t')blk.push(r.t);return r;};
  hit=function(S2,o,n,cause){if(cause==='crush'){if(seen.length)return;const a=LASTA;const k=a?Math.ceil(MT(a)*1.5*m0-1e-9):Math.ceil(n-1e-9);seen.push({o,n:k});if(a&&S2.cx===c)c.pre=MT(a)+' might +50% (a crush)';return _h.call(this,S2,o,k,cause);}return _h.apply(this,arguments);};
  let r;try{r=f.apply(this,arguments);}finally{hit=_h;blockOf=_b;}
  try{S.log=S.log.filter((l,i)=>i<L||!/^The blow carries on into |^The crush carries on through/.test(String(l.x||'')));
    const b=blk[0]||(seen[0]&&seen[0].o.k==='t'?seen[0].o.t:null),a=LASTA;
    if(b&&pre.has(b)&&!S.things.includes(b)&&S.over==null&&a){const n=seen[0]?seen[0].n:Math.ceil(MT(a)*1.5*m0-1e-9);const left=n-pre.get(b);if(left>0){say(S,'The crush carries on through: the rival takes '+left+'.');damage(S,P(1-who),left,'overflow');}}}catch(x){console.error(x);}
  return r;};}

/* 13. fusion: a made thing keeps the qualities its inputs were given (sealed, fixed, masked, a firebrand, its titles) */
{const _in=window.dtvIn;window.dtvIn=function(who,refs){const out=_in.apply(this,arguments);try{let k=0;for(const r of refs){const t=r&&r.k==='thing'?findThing(S,r.id):null;const o=out[k];if(r&&o&&(r.k!=='thing'||t)){if(t){o.q={verbs:(t.verbs||[]).filter(v=>!(v==='strike'&&t.inn)&&!(t.innv||[]).includes(v)),hermetic:!!t.st.hermetic,fixed:!!t.st.fixed,masked:!!t.st.masked,brand:!!t.brand,forms:(t.forms||[]).slice(),vasted:!!t.vasted};}k++;}}}catch(e){}return out;};}
{const _tr=window.dtvTrait;window.dtvTrait=function(bs,x,ins){_tr.apply(this,arguments);try{if(!x||!x.r)return;const t=S.things.find(q=>!bs.things[q.id]&&q.w===x.r);if(!t)return;
  const kept=[];for(const q of ins||[]){const k=q.q;if(!k)continue;for(const s of ['hermetic','fixed','masked'])if(k[s]&&!t.st[s]){t.st[s]=1;kept.push(s==='hermetic'?'sealed':s);}
    if(k.brand&&!t.brand){t.brand=1;addProp(t,'spark');kept.push('firebrand');}if(k.vasted)t.vasted=1;
    for(const f of k.forms||[]){t.forms=t.forms||[];if(!t.forms.includes(f)&&f!=='tame')t.forms.push(f);}
    for(const v of k.verbs||[]){t.verbs=t.verbs||[];if(!t.verbs.includes(v)){t.verbs.push(v);kept.push('knows '+v);}}}
  {const mx=(S.cfg&&S.cfg.maxVerbs)||2;const own=()=>(t.verbs||[]).filter(v=>!(v==='strike'&&t.inn)&&!(t.innv||[]).includes(v));while(own().length>mx){const v=own()[0];t.verbs.splice(t.verbs.indexOf(v),1);}}
  if(t.forms&&t.forms.length){const tr=(t.traits||[]).filter(a=>!t.forms.includes(a));t.title=tr.concat(t.forms).join(' ')+' '+t.w;}
  if(kept.length)say(S,Cap(t.title||t.w)+' keeps what its parts were given: '+kept.join(', ')+'.');}catch(e){console.error(e);}};}

/* 15. spore: when it dies by any cause, it poisons the thing opposite (it only did when it drifted away) */
{const _de=destroy;destroy=function(S,t,cause){const sp=t&&t.props&&t.props.includes('spore')&&S.things.includes(t)&&cause!=='gone'?t.side:null;const r=_de.apply(this,arguments);
  try{if(sp!=null&&!S.things.includes(t)){const o=S.things.filter(q=>q.side!==sp&&!isG(q)&&q.props.includes('living')).sort((a,b)=>b.vig-a.vig)[0];if(o){say(S,'The spore bursts: '+(o.title||o.w)+' is poisoned.');poison(S,{k:'t',t:o},1);}}}catch(e){}return r;};}
G('spore','Flies, and does not last. When it dies, the strongest living thing opposite is poisoned.');

/* 16. orrery: weather the rival speaks does not touch your side, from the moment it arrives (it only stopped the turn-by-turn part) */
{const guard=(name)=>{const f=window[name];window[name]=function(S,e){try{if(S&&S._orr!=null&&e&&((e.k==='p'&&e.i===S._orr)||(e.k==='t'&&e.t&&e.t.side===S._orr))){if(!S._orrSaid){S._orrSaid=1;say(S,'The orrery turns the weather aside from '+(S._orr===0?'your':'the rival’s')+' side.');}return false;}}catch(x){}return f.apply(this,arguments);};};
  for(const n of ['damage','wet','cold','heat','sleep','poison'])guard(n);
  const orrSide=(S,who)=>S.things.some(t=>t.side===1-who&&t.props.includes('orrery'))?1-who:null;
  const fixWx=S=>{try{if(!S||!S.clime)return;for(const t of S.things)if(t.wxb&&S.clime.owner!==t.side&&S.things.some(o=>o.side===t.side&&o.props.includes('orrery'))){t.vig-=t.wxb;t.wxb=0;}}catch(e){}};
  const _rs=resolve;resolve=function(S,who,sen){const cl=sen&&sen.clime!=null;const o=cl?orrSide(S,who):null;if(o!=null){S._orr=o;S._orrSaid=0;}let r;try{r=_rs.apply(this,arguments);}finally{if(o!=null){delete S._orr;delete S._orrSaid;}}fixWx(S);return r;};
  for(const n of ['startTurn','endTurn','react'])if(typeof window[n]==='function'){const f=window[n];window[n]=function(S){const r=f.apply(this,arguments);fixWx(S);return r;};}}

/* 14. card text that did not say what the card does */
G('burning','Sets alight anything that can burn or is alive. It burns for 4 a turn, and its keeper chokes on the smoke for 2. Whatever it bites, crushes, cuts or stings catches fire too.');
if(W.feral)W.feral.gloss=W.feral.gloss.replace(/A beast’s bite hits twice as hard\./,'As a beast, its bite hits 30% harder.');
AP('wash','Heavy things stand firm.');
G('rat','When it dies, the strongest living thing opposite is poisoned.');
if(W.haunt)W.haunt.gloss=W.haunt.gloss.replace(/ ?The haunted also takes 2\./,'');
if(W.scream)W.scream.gloss=W.scream.gloss;
})();
