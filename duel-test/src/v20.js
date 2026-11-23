/* v20 · Earth and Rot get a real plan.
   Earth: Bedrock (things that stay settle, +1 stand a turn, up to +3) and Tremor (a heavy Earth blow shakes every other rival thing on the ground for 1; flyers are above it).
   Rot: Death feeds the rot (each living death while you hold a Rot thing poisons the rival), Carrion rises (a poisoned rival thing that dies leaves carrion on your side),
        and Rot spreads (each of your turns, every poisoned rival thing passes a dose to one clean rival thing). */
(function(){if(!(window.DTV>=20))return;
const isRot=t=>t&&!isG(t)&&schoolOf(t.w)==='rot',isEarth=t=>t&&!isG(t)&&schoolOf(t.w)==='earth';
const flyer=t=>t.props.includes('flying')||t.props.includes('bird');
/* Earth: Bedrock + Rot spreads, both at the start of the owner's turn */
const _st=startTurn;startTurn=function(S,i){const r=_st.apply(this,arguments);try{if(S.over!=null)return r;
  let n=0;for(const t of S.things)if(t.side===i&&isEarth(t)&&(t.bed20||0)<3&&t.setT!==S.turn){t.vig+=1;t.bed20=(t.bed20||0)+1;n++;}
  if(n)say(S,'Bedrock: '+n+' Earth thing'+(n>1?'s settle':' settles')+' deeper, +1 stand.');
  if(S.things.some(t=>t.side===i&&isRot(t))){const sick=S.things.filter(t=>t.side!==i&&t.st.poisoned&&!isG(t));let k=0;
    for(const s of sick){const c=S.things.filter(t=>t.side!==i&&!isG(t)&&t.props.includes('living')&&!t.st.poisoned&&!t.props.includes('toxic')).sort((a,b)=>b.vig-a.vig)[0];if(c&&poison(S,T(c),1))k++;}
    if(k)say(S,'The rot spreads: '+k+' more rival thing'+(k>1?'s are':' is')+' poisoned.');}
  checkOver(S);}catch(e){console.error(e);}return r;};
/* Earth: Tremor, once per thing per turn */
const _hit=hit;hit=function(S,o,n,cause){const a=window.LASTA20;const r=_hit.apply(this,arguments);try{
  if(a&&isEarth(a)&&a.props.includes('heavy')&&['attack','crush','strike','fight'].includes(cause)&&a.trem20!==S.turn&&S.over==null){a.trem20=S.turn;
    const g=S.things.filter(t=>t.side!==a.side&&!isG(t)&&!flyer(t)&&!(o&&o.k==='t'&&o.t===t));
    if(g.length){say(S,'Tremor: the ground shakes under '+g.length+' rival thing'+(g.length>1?'s':'')+'. Flyers are above it.');for(const t of g.slice())if(S.things.includes(t))damage(S,T(t),1,'tremor');}}}catch(x){}return r;};
/* Rot: deaths feed it */
const _de=destroy;destroy=function(S,t,cause){const live=t&&S.things.includes(t)&&t.props.includes('living')&&!t.token,sd=t?t.side:null,sick=t&&t.st&&t.st.poisoned;
  const r=_de.apply(this,arguments);try{if(live&&!S.things.includes(t)&&S.over==null){
    for(const i of [0,1])if(S.things.some(x=>x.side===i&&isRot(x))){S.players[1-i].poisoned+=2;say(S,'Death feeds the rot: '+(i===0?'the rival':'you')+' take'+(i===0?'s':'')+' a dose of poison.');}
    if(sick&&S.things.some(x=>x.side===1-sd&&isRot(x))&&!full(S,1-sd,'carrion')){addThing(S,'carrion',1-sd,1-sd,true);say(S,'Carrion rises on the rot’s side.');}
    checkOver(S);}}catch(e){}return r;};
/* glosses */
try{if(window.dtvSchoolNote)dtvSchoolNote({earth:'Bedrock: your Earth things gain +1 stand each turn they stay, up to +3. Tremor: a heavy Earth blow shakes every other rival thing on the ground for 1. Flyers are above it.',
 rot:'Death feeds the rot: each living thing that dies poisons the rival. A poisoned rival thing that dies leaves carrion on your side. The rot spreads to one clean rival thing each turn.'});}catch(e){}
})();
