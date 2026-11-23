/* v17: seven ways to win. Each school gets its own route to the rival, and the words that carry it.
   Fire burns the rival directly; Air strikes over blockers; Rot poisons; Water washes blockers away and seeps past;
   Earth walls up, then crushes through; Life outgrows and outlasts; The Word learns, then speaks.
   Gated on DTV>=17; load after v16.js. */
(function(){
'use strict';
const V=window.DTV|0;if(!(V>=17))return;
const pc=(n,p)=>Math.max(1,Math.ceil(n*p));
const NEW=[];
/* word, origin, breath, stand, props, gloss, school, strike/stand ratio */
function N(w,o,syl,vig,props,gloss,sch,ratio){n_(w,o,syl,vig,props,gloss);NEW.push(w);SCHOOLOF[w]=sch;if(ratio!=null&&window.DTVRO)DTVRO[w]=ratio;}
function Vb(w,o,syl,kind,obj,gloss,sch){v_(w,o,syl,kind,obj,gloss);NEW.push(w);SCHOOLOF[w]=sch;}
function Ad(w,o,gloss,sch){a_(w,o,1,gloss);NEW.push(w);SCHOOLOF[w]=sch;}
/* ---- Fire: Burn ---- */
N('torch','F',1,2,'flammable bright spark','A lit torch. Each of your turns the rival takes 1.','fire',1);
N('cinderling','X',2,3,'beast living fireborn swift','A little beast of living cinders. Swift: it can strike the turn it arrives.','fire',1);
N('bonfire','OE',3,6,'flame fireborn bright ground','Ground. Each of your turns the rival takes 1, and your hot things gain 1.','fire');
Vb('scorch','F',1,'agent','req','A hot thing of yours deals half its might to a thing or to the rival. Nothing can block it.','fire');
Ad('firebrand','OE','Its hits also burn the rival for 1.','fire');
N('wildfire','OE',3,1,'event','A single-use spell: say it alone and it is spent. Every burning thing takes 3, and the rival takes 1 for each burning thing.','fire');
/* ---- Water: Tide ---- */
N('otter','OE',1,3,'beast living damp swift','Sleek and quick. Sea-born and swift: it can strike the turn it arrives, and it can seep.','water',.67);
N('eel','OE',2,4,'fish living damp','Slips through anything: it can seep.','water',.75);
N('pike','OE',2,3,'fish living damp sharp','A river wolf with a mouthful of needles. Sea-born: it can seep.','water',1.3);
N('mist','OE',1,3,'liquid flying fleeting','A drift of mist. Out of reach of the ground, and it can seep. It is gone after two turns.','water',.34);
Vb('wash','OE',3,'agent','req','A liquid or sea-born thing of yours washes a rival thing no stronger than itself back to its keeper’s hand. A made thing is washed out of the match.','water');
N('tide','OE',4,1,'event','A single-use spell: say it alone and it is spent. Every rival thing weaker than your strongest sea-born thing goes back to its keeper’s hand (made things are gone), and you draw a word.','water');
/* ---- Air: Over ---- */
N('hawk','OE',2,3,'beast bird living flying sharp','A hunting hawk with a hooked beak. Flies.','air',1.3);
N('swallow','OE',1,2,'beast bird living flying swift','Swift: it can strike the turn it arrives. In Spring it arrives 20% stronger.','air',1);
N('squall','OE',4,1,'event','A single-use spell: say it alone and it is spent. Every flyer of yours strikes the rival now, at half its might.','air');
/* ---- Earth: Walls, then overflow ---- */
N('boulder','OE',2,7,'stone heavy','A great rolling stone. It stands guard from the moment it arrives, and a thing on guard can stop even a flyer.','earth',.3);
/* ---- Life: Outgrow and outlast ---- */
N('wolf','OE',2,4,'beast living sharp','Hunts in a pack: it arrives 20% stronger for each other beast of yours.','life',1);
N('hare','OE',1,2,'beast living swift','Swift: it can strike the turn it arrives.','life',1);
N('bear','OE',4,8,'beast living heavy','Huge and slow to anger. It can crush.','life',.75);
N('stampede','OE',3,1,'event','A single-use spell: say it alone and it is spent. Each beast of yours charges the strongest thing opposite; what is left over after a kill goes through to the rival.','life');
/* ---- Rot: Poison ---- */
N('ghost','OE',2,4,'spirit dark flying','A cold presence. Flies, and can haunt.','rot',.5);
N('rat','OE',1,2,'beast living dark toxic','When it dies, the strongest thing opposite is poisoned.','rot',1);
N('miasma','G',3,1,'event','A single-use spell: say it alone and it is spent. Every living rival thing is poisoned, and so is the rival.','rot');
/* ---- The Word: Learn, then speak ---- */
N('bard','F',2,4,'living human minded voiced','Each time you say a sentence of three or more words, you draw a word.','word',.5);
N('lexicon','G',2,3,'concept spell','While it is yours, every fusion costs 1 less breath. Lasts 4 turns.','word');
for(const w of NEW){if(!ALLWORDS.includes(w))ALLWORDS.push(w);try{if(window.WEB21&&!WEB21.cards[w])WEB21.cards[w]={sch:SCHOOLOF[w],tier:(W[w].syl>=3?3:2),t:W[w].t};}catch(e){}}
window.DTV17NEW=NEW;
const BURNC='fire';
/* ---- engine: the routes ---- */
const hot=t=>CAN.hot(p=>t.props.includes(p))||(t.st&&t.st.burning);
const wetT=t=>t.props.includes('liquid')||t.props.includes('damp');
const flyT=t=>(t.props.includes('flying')||t.props.includes('bird'));
const own=(e,who)=>e&&e.k==='t'&&e.t.side===who;
/* abilities: hot things scorch, wet things wash */
const _ab=abilities;abilities=function(props,st){const a=_ab(props,st);if(props.includes('spell')||props.includes('ground')||props.includes('event'))return a;const h=p=>props.includes(p);
  if(CAN.hot(h)||(st&&st.burning))a.splice(a.length-1,0,'scorch');if(h('liquid')||h('damp'))a.splice(a.length-1,0,'wash');return a;};
VERBF.scorch=function(S,who,subs,objs,c){const ag=agents(S,who,subs,e=>e.k==='t'&&hot(e.t),'cannot scorch: only a hot thing can.');
  for(const a of ag)for(const o of objs){if(!alive(S,a)||!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;didAct(S,who,a);const n=pc(MT(a.t)*c.mult,.5);say(S,Cap(nm(S,a))+' scorches '+nm(S,o)+' for '+n+'.');damage(S,o,n,'scorch');c.effect=true;}};
VERBF.wash=function(S,who,subs,objs,c){const ag=agents(S,who,subs,e=>e.k==='t'&&wetT(e.t),'cannot wash: only a liquid or sea-born thing can.');
  for(const a of ag)for(const o of objs){if(!alive(S,a)||!alive(S,o))continue;if(o.k!=='t'||o.t.side===who){say(S,'Wash carries away a rival thing, not a person.');continue;}
   const t=o.t;if(t.vig>a.t.vig||isG(t)||t.props.includes('heavy')){say(S,Cap(nm(S,o))+' is too heavy for '+nm(S,a)+' to wash away.');continue;}
   didAct(S,who,a);S.things.splice(S.things.indexOf(t),1);dropVerbs(S,t);if(!t.token)S.players[t.owner].hand.push(t.card);say(S,Cap(nm(S,a))+' washes '+(t.title||t.w)+(t.token?' out of the match.':' back to its keeper’s hand.'));c.effect=true;}};
/* crush: what is left over after a kill goes through to the rival */
const _cr=VERBF.crush;VERBF.crush=function(S,who,subs,objs,c){const pre=(objs||[]).filter(o=>o&&o.k==='t'&&o.t.side!==who).map(o=>({t:o.t,v:o.t.vig}));const ags=(subs||[]).filter(e=>own(e,who)).map(e=>e.t);
  const r=_cr.apply(this,arguments);try{for(const p of pre)if(!S.things.includes(p.t)&&ags.length){const a=ags[0];const n=Math.ceil(MT(a)*1.3)*(c.mult||1);const left=n-p.v;if(left>0&&S.over==null){say(S,'The crush carries on through: the rival takes '+left+'.');damage(S,P(1-who),left,'overflow');}}}catch(x){}return r;};
/* adjectives: firebrand */
ADJF.firebrand=(S,who,e)=>{if(e.k!=='t'){say(S,'Only a thing can carry a firebrand.');return false;}e.t.brand=1;addProp(e.t,'spark');say(S,Cap(nm(S,e))+' carries a firebrand: its hits also burn the rival.');return true;};
const _da=didAct;didAct=function(S,who,e,keep){const r=_da.apply(this,arguments);try{if(e&&e.k==='t'&&e.t.brand&&e.t.side===who&&S.over==null){damage(S,P(1-who),1,'firebrand');}}catch(x){}return r;};
/* events */
EVENT.wildfire=(S,who,c)=>{const b=S.things.filter(t=>t.st.burning||t.props.includes('flame'));for(const t of b.slice())if(S.things.includes(t))damage(S,T(t),3,'fire');const n=b.filter(t=>t.side!==who).length+b.filter(t=>t.side===who).length;
  say(S,'Wildfire: every burning thing takes 3'+(n?', and the rival takes '+n:'')+'.');if(n)damage(S,P(1-who),n,'wildfire');c.effect=true;};
EVENT.tide=(S,who,c)=>{const mine=S.things.filter(t=>t.side===who&&wetT(t)&&!isG(t));const top=mine.reduce((m,t)=>Math.max(m,t.vig),0);
  const go=S.things.filter(t=>t.side!==who&&!isG(t)&&t.vig<top);for(const t of go){S.things.splice(S.things.indexOf(t),1);dropVerbs(S,t);if(!t.token)S.players[t.owner].hand.push(t.card);}
  say(S,go.length?'The tide goes out and takes '+go.map(t=>t.title||t.w).join(', ')+' with it.':'The tide finds nothing weaker than your strongest sea-born thing.');drawN(S,who,1);c.effect=true;};
EVENT.squall=(S,who,c)=>{const f=S.things.filter(t=>t.side===who&&flyT(t)&&!isG(t)&&!t.st.sodden&&!t.st.frozen&&!t.st.asleep);if(!f.length){say(S,'You have nothing in the air for the squall to carry.');return;}
  let n=0;for(const t of f){n+=Math.ceil(MT(t)/2);}say(S,'The squall carries every flyer of yours over the rival’s heads: '+n+' in all.');damage(S,P(1-who),n,'over');c.effect=true;};
EVENT.stampede=(S,who,c)=>{const bs=S.things.filter(t=>t.side===who&&t.props.includes('beast')&&!isG(t)&&!t.st.asleep&&!t.st.frozen);if(!bs.length){say(S,'You have no beasts to stampede.');return;}
  for(const b of bs){if(S.over!=null)break;let m=MT(b);const foe=S.things.filter(t=>t.side!==who&&!isG(t)&&!t.props.includes('spell')).sort((a,c2)=>c2.vig-a.vig)[0];
   if(foe){const v=foe.vig;say(S,Cap(b.title||b.w)+' charges '+(foe.title||foe.w)+'.');damage(S,T(foe),m,'trample');m=S.things.includes(foe)?0:m-v;}
   if(m>0){say(S,Cap(b.title||b.w)+' runs on into the rival: '+m+'.');damage(S,P(1-who),m,'trample');}}c.effect=true;};
EVENT.miasma=(S,who,c)=>{const l=S.things.filter(t=>t.side!==who&&t.props.includes('living')&&!isG(t));for(const t of l)poison(S,T(t),1);poison(S,P(1-who),1);say(S,'A miasma settles: '+l.length+' rival things and the rival are poisoned.');c.effect=true;};
/* arrivals: swift things can act at once; boulder guards; wolf hunts in a pack; swallow loves spring */
const _add=addThing;addThing=function(S,w,sd,owner,token,card){const t=_add.apply(this,arguments);try{if(!t||isG(t))return t;
  if(t.props.includes('swift')){t.fresh=0;t.acted=false;if(bodyStrikes(t.props)&&t.verbs&&!t.verbs.includes('strike'))t.verbs.unshift('strike');t.inn=1;}
  if(w==='boulder')t.st.guarding=1;
  if(w==='wolf'){const k=S.things.filter(q=>q!==t&&q.side===sd&&q.props.includes('beast')).length;if(k){t.vig+=pc(t.vig,.2*k);say(S,'The wolf finds its pack: '+k+' other beast'+(k>1?'s':'')+', and it arrives '+(20*k)+'% stronger.');}}
  if(w==='swallow'&&S.clime&&S.clime.w==='spring')t.vig+=pc(t.vig,.2);}catch(e){}return t;};
/* every turn: torch and bonfire burn the rival; bonfire feeds your fire */
const _st=startTurn;startTurn=function(S,i){const r=_st.apply(this,arguments);try{if(S.over!=null)return r;const mine=S.things.filter(t=>t.side===i);
  const tor=mine.filter(t=>t.w==='torch').length+mine.filter(t=>t.w==='bonfire').length;if(tor){say(S,'Torch and fire scorch the other side: '+tor+'.');damage(S,P(1-i),tor,'torch');}
  if(mine.some(t=>t.w==='bonfire'))for(const t of mine)if(!isG(t)&&hot(t))t.vig+=1;checkOver(S);}catch(e){console.error(e);}return r;};
/* rat: its death poisons the strongest thing opposite */
const _de=destroy;destroy=function(S,t,cause){const was=t&&t.w==='rat'&&S.things.includes(t)?t.side:null;const r=_de.apply(this,arguments);try{if(was!=null&&!S.things.includes(t)){const o=S.things.filter(q=>q.side!==was&&!isG(q)&&q.props.includes('living')).sort((a,b)=>b.vig-a.vig)[0];if(o){poison(S,T(o),1);say(S,'The rat’s bite festers: '+(o.title||o.w)+' is poisoned.');}}}catch(e){}return r;};
/* bard: a sentence of three or more words draws a word */
const _rs=resolve;resolve=function(S,who,sen){const r=_rs.apply(this,arguments);try{if(r&&r.ok&&!S.quiet0&&S.things.some(t=>t.side===who&&t.w==='bard')){const n=(sen.subj?1:0)+(sen.verb!=null||sen.kverb?1:0)+(sen.obj?1:0)+((sen.adjs||[]).length);if(n>=3){drawN(S,who,1);say(S,'The bard takes up the tale: '+(who===0?'you draw':'the rival draws')+' a word.');}}}catch(e){}return r;};
/* tuning round 1: flyers keep their old might; The Word's people are sturdier */
for(const w of ['scribe','hermit','miser','alchemist','homunculus','word','unnamed','bard','apothecary','shepherdess'])if(W[w]&&SCHOOLOF[w]==='word')W[w].vig+=5;
/* tuning round 2 */
W.hawk.vig=2;W.otter.vig=2;W.boulder.vig=9;
let LASTA=null;
const _da2=didAct;didAct=function(S,who,e,keep){if(e&&e.k==='t')LASTA=e.t;return _da2.apply(this,arguments);};
/* Rot: a toxic thing's blows poison what they hit */
const _hit=hit;hit=function(S,o,n,cause){const a=LASTA;const r=_hit.apply(this,arguments);try{if(a&&a.props.includes('toxic')&&['attack','bite','cut','sting','fight','crush','strike'].includes(cause)&&alive(S,o)&&(o.k==='p'||o.t.props.includes('living'))&&!(o.k==='t'&&o.t.props.includes('toxic')))poison(S,o,1);}catch(x){}return r;};
/* Life: what grows, outgrows. Each of your turns your Life things gain 1, up to 5 in all */
const _st2=startTurn;startTurn=function(S,i){const r=_st2.apply(this,arguments);try{if(S.over!=null)return r;for(const t of S.things)if(t.side===i&&!isG(t)&&schoolOf(t.w)==='life'&&(t.grown17||0)<6){t.vig+=2;t.grown17=(t.grown17||0)+2;}}catch(e){}return r;};
/* Water: seep finds the gap, but loses some force on the way */
const _sp=VERBF.seep;VERBF.seep=function(S,who,subs,objs,c){const m0=c.mult;c.mult=(c.mult||1)*.5;try{return _sp.apply(this,arguments);}finally{c.mult=m0;}};
/* Earth: crush hits 50% harder, not 30% */
const _cr2=VERBF.crush;VERBF.crush=function(S,who,subs,objs,c){const m0=c.mult;c.mult=(c.mult||1)*1.3;try{return _cr2.apply(this,arguments);}finally{c.mult=m0;}};
/* tuning round 3 */
const _mt3=window.MT;window.MT=function(t){const m=_mt3(t);try{if(t&&t.props&&(t.props.includes('flying')||t.props.includes('bird'))&&!isG(t))return Math.max(1,m-Math.round(t.vig*.3));}catch(e){}return m;};
window.MTW=function(w,vig){const d=W[w];if(!d||d.t!==NOUN)return null;return window.MT({w,props:d.props,vig:vig!=null?vig:d.vig});};
if(window.DTVRO)Object.assign(DTVRO,{scribe:.7,hermit:.6,alchemist:.7,bard:.7,wolf:1.2,bear:.9,boulder:.5});
/* tuning round 4: Life outlasts (heals 1 a turn for each Life thing, up to 3); Earth's heavy things hit 20% harder */
const _st4=startTurn;startTurn=function(S,i){const r=_st4.apply(this,arguments);try{if(S.over!=null)return r;const n=Math.min(3,S.things.filter(t=>t.side===i&&!isG(t)&&schoolOf(t.w)==='life'&&t.props.includes('living')).length);if(n){S.players[i].life+=n;say(S,(i===0?'You gain ':'The rival gains ')+n+' life from the living green.');}}catch(e){}return r;};
const _mt4=window.MT;window.MT=function(t){const m=_mt4(t);try{if(t&&t.props&&t.props.includes('heavy')&&!isG(t)&&schoolOf(t.w)==='earth')return m+Math.round(t.vig*.3);}catch(e){}return m;};
window.MTW=function(w,vig){const d=W[w];if(!d||d.t!==NOUN)return null;return window.MT({w,props:d.props,vig:vig!=null?vig:d.vig});};
/* tuning round 5: a flyer up in the air cannot stand in the way of something on the ground, unless it is on guard */
const _ed=eligibleDef;eligibleDef=function(S,ds,att){const r=_ed.apply(this,arguments);try{if(att&&!(att.props.includes('flying')||att.props.includes('bird')))return r.filter(t=>!(t.props.includes('flying')||t.props.includes('bird'))||t.st.guarding);}catch(e){}return r;};
const _bi=VERBF.bite;VERBF.bite=function(S,who,subs,objs,c){const lb=(subs||[]).some(e=>e&&e.k==='t'&&e.t.props.includes('beast')&&schoolOf(e.t.w)==='life');const m0=c.mult;if(lb)c.mult=(c.mult||1)*1.25;try{return _bi.apply(this,arguments);}finally{c.mult=m0;}};
/* tuning round 6: The Word speaks. Each sentence of three or more words you say makes the rival take 1 for each voiced Word person of yours (up to 3) */
const _rs6=resolve;resolve=function(S,who,sen){const r=_rs6.apply(this,arguments);try{if(r&&r.ok&&S.over==null&&!(window.DTV>=19)){const n=(sen.subj?1:0)+(sen.verb!=null||sen.kverb?1:0)+(sen.obj?1:0)+((sen.adjs||[]).length);
  if(n>=3){const k=Math.min(3,S.things.filter(t=>t.side===who&&!isG(t)&&t.props.includes('voiced')&&schoolOf(t.w)==='word').length);if(k){say(S,'The words carry: the '+(who===0?'rival':'other side')+' takes '+k+'.');damage(S,P(1-who),k,'word');checkOver(S);}}}}catch(e){}return r;};
/* Air: the squall carries each flyer at half its might */
/* text for the reworked words */
const G=(w,s)=>{if(W[w])W[w].gloss=s;};
G('guard',(W.guard.gloss||'').replace(/\s*$/,'')+' A thing on guard can stop even a flyer.');
G('seep','Hits for half its might. Nothing can block it. Any liquid or sea-born thing can seep: it finds the gap.');
G('crush','A heavy thing crushes for its might +50%. If it destroys the thing in its way, what is left over goes through to the rival. A frozen or brittle defender shatters.');
})();
