/* v16: school identity. Words move to the school they belong to, kinds that link a school's words, verbs that reach their school's things, clean card text.
   Gated on DTV>=16; older versions play exactly as before. Load after v13.js. */
(function(){
'use strict';
const V=window.DTV|0;if(!(V>=16))return;
const P_=(w,...ps)=>{if(W[w])for(const p of ps)if(!W[w].props.includes(p))W[w].props.push(p);};
const G=(w,s)=>{if(W[w])W[w].gloss=s;};
/* ---- 1. the moves ---- */
const MOVES={myrrh:'life',alchemist:'word',homunculus:'word',flint:'earth',quicklime:'fire',bellows:'fire',mend:'life',toad:'water',wake:'earth',
 scream:'word',echo:'word',sting:'life',orrery:'air',miser:'word',hermit:'word',measure:'word',attractor:'word',awaken:'word',hunger:'rot'};
Object.assign(SCHOOLOF,MOVES);
try{for(const w in MOVES)if(window.WEB21&&WEB21.cards[w])WEB21.cards[w].sch=MOVES[w];}catch(e){}
window.DTV16MOVES=MOVES;
/* ---- 2. kinds that link a school ---- */
P_('leech','dark');P_('thief','dark');P_('hellebore','dark');P_('toadstool','dark');P_('smith','spark');P_('glass','bright');P_('scintilla','spark');P_('yew','dark');P_('nightshade','dark');P_('spider','dark');P_('toad','damp');
/* ---- 3. verbs that reach their school's things ---- */
const wet=t=>t.props.includes('liquid')||t.props.includes('damp');
/* sea-born (damp) things seep, drench and distil like liquids */
function asLiquid(fn){return function(S,who,subs,objs,c){const added=[];for(const e of subs||[])if(e&&e.k==='t'&&e.t.props.includes('damp')&&!e.t.props.includes('liquid')){e.t.props.push('liquid');added.push(e.t);}
  try{return fn.apply(this,arguments);}finally{for(const t of added){const i=t.props.indexOf('liquid');if(i>=0)t.props.splice(i,1);}}};}
for(const v of ['seep','drench','distil'])if(VERBF[v])VERBF[v]=asLiquid(VERBF[v]);
/* frozen holds a wet thing for two turns; thaw hurts what is frozen opposite */
const _thaw=VERBF.thaw;VERBF.thaw=function(S,who,subs,objs,c){const opp=S.things.filter(t=>t.st.frozen&&t.side!==who);_thaw.apply(this,arguments);for(const t of opp)if(S.things.includes(t)){damage(S,T(t),2,'thaw');c.effect=true;}};
/* wake: a stone or metal thing of yours stirs */
const _wake=VERBF.wake;VERBF.wake=function(S,who,subs,objs,c){const r=_wake.apply(this,arguments);try{for(const e of subs||[])if(e&&e.k==='t'&&e.t.side===who&&(e.t.props.includes('stone')||e.t.props.includes('metal'))&&S.things.includes(e.t)){e.t.vig+=Math.max(1,Math.ceil(e.t.vig*.2));e.t.acted=false;say(S,Cap(nm(S,e))+' stirs: 20% stronger, and it may act again.');c.effect=true;}}catch(x){}return r;};
/* sting: a toxic stinger also poisons */
const _sting=VERBF.sting;VERBF.sting=function(S,who,subs,objs,c){const r=_sting.apply(this,arguments);try{for(const e of subs||[])if(e&&e.k==='t'&&e.t.props.includes('toxic'))for(const o of objs||[])if(o&&alive(S,o)&&(o.k==='p'||o.t.props.includes('living'))){poison(S,o,1);}}catch(x){}return r;};
/* plants can bind; hot things are bright enough to blind */
const _bind=CAN.bind,_bl=CAN.blindp;CAN.bind=h=>_bind(h)||h('plant')&&(h('wood')||h('binder'));CAN.blindp=h=>_bl(h)||CAN.hot(h);
const _ab=abilities;abilities=function(props,st){const a=_ab(props,st);if(props.includes('damp')&&!props.includes('ground')&&!props.includes('spell')){for(const v of ['seep','drench'])if(!a.includes(v))a.splice(a.length-1,0,v);}return a;};
/* liquids and spirits name their whole family */
const _mc=matchCat;matchCat=function(S,cat){if(cat==='liquids')return S.things.filter(t=>wet(t)&&!t.props.includes('named')).map(T);
  if(cat==='spirits')return S.things.filter(t=>(t.props.includes('spirit')||t.props.includes('dark'))&&!t.props.includes('named')).map(T);return _mc(S,cat);};
/* feral: on a plant, thorns */
/* aloe mends your most hurt thing each turn; cedar makes your plants sturdier; wormwood keeps your side clean of poison */
const _st=startTurn;startTurn=function(S,i){const r=_st.apply(this,arguments);try{if(S.over!=null)return r;const mine=S.things.filter(t=>t.side===i);
  if(mine.some(t=>t.w==='aloe')){const h=mine.filter(t=>!isG(t)&&t.top&&t.vig<t.top).sort((a,b)=>(b.top-b.vig)-(a.top-a.vig))[0];if(h){const n=Math.min(2,h.top-h.vig);h.vig+=n;say(S,'The aloe mends '+(h.title||h.w)+' by '+n+'.');}}
  if(mine.some(t=>t.w==='wormwood'))for(const t of mine)if(t.st.poisoned){t.st.poisoned=0;say(S,'Wormwood draws the poison out of '+(t.title||t.w)+'.');}}catch(e){console.error(e);}return r;};
const _add=addThing;addThing=function(S,w,sd,owner,token,card){const t=_add.apply(this,arguments);try{if(t&&!isG(t)){t.top=Math.max(t.top||0,t.vig);
  if(t.props.includes('plant')&&S.things.some(q=>q.side===sd&&q.w==='cedar'&&q!==t)){const n=Math.max(1,Math.ceil(t.vig*.2));t.vig+=n;t.top+=n;}}}catch(e){}return t;};
/* gust: places are gone, so the wind takes the weakest */
if(EVENT.gust)EVENT.gust=function(S,who,c){const o=S.things.filter(t=>t.side!==who&&!isG(t)&&!t.props.includes('heavy')).sort((a,b)=>a.vig-b.vig)[0];
  if(!o){say(S,'The gust finds nothing light enough to carry off.');return;}S.things.splice(S.things.indexOf(o),1);dropVerbs(S,o);if(!o.token)S.players[o.owner].hand.push(o.card);say(S,'The gust carries '+(o.title||o.w)+(o.token?' away for good.':' back to its keeper’s hand.'));c.effect=true;};
/* decay: places are gone, so it takes the strongest thing opposite */
if(VERBF.decay)VERBF.decay=function(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e)||e.k!=='t'||e.t.side!==who||isG(e.t)){if(subs.length===1)say(S,'Only one of your own things can be given to decay.');continue;}
  const t=e.t,v=t.vig,o0=(objs||[]).find(o=>o&&o.k==='t'&&o.t.side!==who&&alive(S,o)),op=o0?o0.t:S.things.filter(x=>x.side!==who&&!isG(x)).sort((a,b)=>b.vig-a.vig)[0];
  destroy(S,t,'spent');say(S,Cap(t.w)+' rots away'+(op?', and '+nm(S,T(op))+' rots with it, losing '+v+'.':'.'));if(op)damage(S,T(op),v,'blight');c.effect=true;}};
/* ---- 4. card text: the right currency, one total each, nothing that points at removed rules ---- */
G('gold','Made by transmuting. Incorruptible. Gives you 1 more breath a turn.');
G('gild','Spell. A thing turns gold: +30%, and it gives you 1 more breath a turn. It counts as metal.');
G('dream','Said alone, then spent. Everything opposite takes 2 (asleep things 4), and the rival takes 7.');
G('memory','A single-use spell: say it alone and it is spent. Two spent words return to your hand, and you gain 4 life.');
G('petrify','A cockatrice, a serpent or a stone turns a living thing to stone, and it takes 5.');
G('peacock','A hundred eyes in its tail. Bright: it can blind.');
G('gust','A single-use spell: say it alone and it is spent. The lightest thing opposite is blown back to its keeper’s hand (a made thing is gone). Heavy things stand firm.');
G('decay','Destroys one of your own things; a rival thing (the strongest, unless you name one) loses that much vigour.');
G('seep','Hits for its might. Nothing can block it. Any liquid or sea-born thing can seep: it finds the gap.');
G('drench','Hits for its might and soaks the target. Any liquid or sea-born thing can drench. Soaked things won’t burn and wet wings won’t fly.');
G('thaw','Spell. Every frozen thing wakes; yours gain 20%, and every frozen rival thing takes 2.');
G('wake','Spell. Sleepers wake. A stone or metal thing of yours gains 20% and may act again. You draw a word.');
G('sting','Hits for its might +50%. Wasps, nettles, scorpions and thorny things can sting; a toxic stinger also poisons.');
G('liquids','Every liquid and sea-born thing on the board.');G('spirits','Every spirit and dark thing on the board.');
G('aloe','Cool sap that mends: each of your turns it mends your most hurt thing by 2.');
G('cedar','Temple timber. Sacred. Your plants arrive 20% sturdier while it stands.');
G('wormwood','Bitter herb: each of your turns it draws the poison out of everything on your side.');
G('toad','Poison in its skin. Lives in water and on land: it can seep and drench.');
G('smith','Swings a hammer that strikes sparks: it can crush and burn.');
G('glass','Cuts, and catches the light: it can blind. Shatters at the first blow.');
for(const w of ['spider','yew','nightshade'])if(W[w]&&!/dark/i.test(W[w].gloss))W[w].gloss=W[w].gloss.replace(/\s*$/,'')+' Dark: it can haunt.';
})();
