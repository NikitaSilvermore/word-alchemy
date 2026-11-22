/* guard: a person reference with no person behind it (seen with some categories) used to crash the turn */
try{const _okP=(S,e)=>!(e&&e.k==='p'&&!S.players[e.i]);for(const f of ['sleep','heat','cold','wet','poison']){const g=window[f];if(typeof g==='function')window[f]=function(S,e){if(!e||!_okP(S,e))return false;return g.apply(this,arguments);};}}catch(e){}
/* guard: drop person references with no person behind them before any verb runs */
try{if(typeof VERBF!=='undefined')setTimeout(()=>{for(const k in VERBF){const f=VERBF[k];if(f.__g)continue;const g=function(S,who,subs,objs){const ok=e=>e&&!(e.k==='p'&&!S.players[e.i]);arguments[2]=(subs||[]).filter(ok);arguments[3]=(objs||[]).filter(ok);return f.apply(this,arguments);};g.__g=1;VERBF[k]=g;}},0);}catch(e){}
/* the tincture had no effect written, so fusing into it broke the turn */
try{if(typeof EVENT!=='undefined'&&!EVENT.tincture){EVENT.tincture=function(S,who,c){const p=S.players[who];p.life=Math.min(LIFE,p.life+4);p.poisoned=0;say(S,(who===0?'You drink':'The rival drinks')+' the tincture: 4 life back, and the poison leaves.');c.effect=true;};if(W.tincture)W.tincture.gloss='Drunk at once: restores 4 life and washes out poison.';}}catch(e){}
/* v8: the verbs round. Percentages, no minds, seep, toxify, summon, sacrifice, protect, dispel, ladders. */
(function(){
'use strict';
const V=window.DTV|0;if(!(V>=8))return;
const pc=(n,p)=>Math.max(1,Math.ceil(n*p)),up=(t,p)=>{if(t.st&&t.st.measured)return 0;const n=pc(t.vig,p);t.vig+=n;return n;};
const own=(e,who)=>e.k==='t'&&e.t.side===who;
const one=subs=>subs.length===1;

/* ---- words ---- */
v_('seep','OE',1,'agent','req','Hits for its vigour. Nothing can block it. Any liquid can seep: it finds the gap.');
v_('toxify','L',2,'agent','req','Poisons a rival thing, and the poison spreads: each of your turns it reaches one more thing on the board, then the rival. It stops only when every poisoned thing is dead or healed. Needs a toxic thing.');
v_('summon','L',4,'affect','none','A rival thing of 9 or less comes to your side. Protected things can’t be summoned.');
v_('sacrifice','OE',1,'affect','none','Destroy one of your things: gain breath, a third of its vigour (rounded up).');
v_('protect','OE',1,'affect','none','A thing gains 10% and is protected: it can’t be stolen, lured, tamed or summoned. Clay wakes as a golem.');
v_('dispel','L',1,'affect','none','Removes one spell the rival has standing, and shows anything hidden.');
W.forget.kind='affect';W.forget.obj='none';
for(const w of ['seep','toxify','summon','sacrifice','protect','dispel'])if(!ALLWORDS.includes(w))ALLWORDS.push(w);
const ARTX={seep:'drench',toxify:'poison',summon:'lure',sacrifice:'calcine',protect:'name',dispel:'doubt'};const setA=()=>{try{Object.assign(ARTAS,ARTX);}catch(e){}};document.addEventListener('DOMContentLoaded',setA);setTimeout(setA,0);
for(const w of ['graft','sculpt','separate','calcine','poison','name','doubt'])if(!DTVX7.includes(w))DTVX7.push(w);
if(!ATTACKV.includes('seep'))ATTACKV.push('seep');
const G={
 bite:'A beast bites for its vigour +30%. A person bites for plain vigour. Sacred things can’t be bitten.',
 crush:'A heavy thing crushes for its vigour +30%. A frozen or brittle defender shatters.',
 cut:'A sharp thing cuts for its vigour +30%. Can cut your own thing free of bonds.',
 sting:'Hits for its vigour +50%. Wasps, nettles, scorpions and thorny things can sting.',
 drench:'Hits for its vigour and soaks the target. Any liquid can drench. Soaked things won’t burn and can’t fly.',
 dissolve:'The target loses 50% of its vigour. Any liquid or corrosive thing can dissolve. On a person: 30% of the dissolver’s vigour.',
 haunt:'A rival thing goes back to its keeper’s hand. Spirits and dark things haunt. Salt and sacred things can’t be haunted.',
 eat:'A beast or person eats a smaller thing and gains 50% of its vigour. Eating something toxic poisons the eater.',
 scream:'Everything opposite takes 1, the rival 2. Wakes every sleeper. A mandrake’s scream does double.',
 guard:'It defends for you automatically and is 30% stronger while it does. It stops guarding when it acts.',
 transmute:'Spell. One of your things climbs one rung of its ladder. A crucible makes it two.',
 temper:'Spell. A metal or blade gains 30% and guards; it can’t rust or shatter. Any other thing of yours gains 20%.',
 distil:'Spell. A liquid gains 30% and becomes potent. Any other thing of yours gains 20%.',
 ripen:'Spell. A plant gains 30% and becomes potent; a seed or sapling jumps a stage. Any other thing of yours gains 20%.',
 ferment:'Spell. In two turns, one of your things gains 50% and becomes potent.',
 coagulate:'Spell. One of your things gains 20% and can never be changed again.',
 measure:'Spell. A rival thing can’t gain vigour any more.',
 enchant:'Spell. One of your things shakes off every bad condition and can act again.',
 gild:'Spell. A thing turns gold: +30%, and it pays you 1 ink a turn. It counts as metal.',
 awaken:'Spell. A non-living thing comes alive: +30%, and it can strike. Clay or stone wakes as a golem.',
 crown:'Spell. A living thing gains 30%; others of its kind on your side gain 10%.',
 forget:'Spell. A thing loses its adjectives and learned verbs. Said of the rival: they drop a word from hand.',
 sleep:'Spell. A beast or person falls asleep.',
 wake:'Spell. Sleepers wake. A stone thing comes back with +20% and can act.',
 thaw:'Spell. Every frozen thing wakes; yours gain 20%.',
 kindle:'Spell. One of your things gains 30%, and its hits set things on fire this turn.',
 grow:'Spell. A plant gains 20%, more if soaked. Seeds count a turn closer.',
 wither:'Spell. A plant loses 50%; any other rival thing loses 30%.',
 rust:'Spell. A metal loses 50%; any other rival thing loses 20%. Gold and quicksilver don’t rust.',
 lure:'Spell. A rival thing of 3 or less, not a beast, comes to your side.',
 tame:'Spell. A rival beast of 6 or less comes to your side. Your own beast gains 2 and guards instead.'};
for(const k in G)if(W[k])W[k].gloss=G[k];
for(const k of ['summon','sacrifice','protect','dispel'])W[k].gloss='Spell. '+W[k].gloss;
window.DTVSPELLV=w=>W[w]&&W[w].t===VERB&&(W[w].kind==='affect'||W[w].kind==='impersonal');
for(const w in W)if(window.DTVSPELLV(w)&&W[w].kind==='affect'&&!EVOLVE.includes(w))EVOLVE.push(w);
const _ds=describe;describe=function(S,who,sen){const r=_ds.apply(this,arguments);return typeof r==='string'?r.replace(/ seeps (the rival|you)\b/,' seeps into $1'):r;};

/* born knowing: spells are cast, not known */
const IN=window.DTVINNV||{};IN.alchemist=['mend'];IN.homunculus=['+'];IN.smith=['+'];IN.owl=['+'];delete IN.shepherdess;delete IN.scribe;delete IN.seed;delete IN.lichen;
for(const k in IN)IN[k]=IN[k].map(v=>v==='poison'?'toxify':v);

/* ---- ladders ---- */
const LAD=[['Metal',['lead','tin','iron','copper','quicksilver','silver','gold']],['Earth',['sand','clay','stone','obsidian']],['Fire',['ember','salamander','phoenix']],
 ['Remedy',['dew','elixir','azoth','quintessence','philosopher’s stone']],['Acid',['vitriol','alkahest']],['Tree',['seed','sapling','oak','world tree']],
 ['Serpent',['adder','basilisk','hydra','ouroboros']],['Dead',['shadow','wraith','wight','lich']],['Made',['golem','automaton','colossus']],
 ['Learning',['scribe','alchemist','sage','oracle']],['Sky',['cloud','lightning','thunderbird']],['Word',['sigil','grimoire','true name']]].map(([n,r])=>[n,r.filter(w=>W[w])]);
const ladOf=w=>LAD.find(l=>l[1].includes(w));window.DTVLAD=LAD;window.DTVLADOF=ladOf;

/* ---- helpers ---- */
const HITC=['attack','bite','crush','cut','sting','seep','fight','drench'];
const _dmg=damage;damage=function(S,e,n,cause){if(e&&e.k==='t'&&e.t&&e.t.st&&e.t.st.guarding&&n>0&&HITC.includes(cause)){const m=Math.max(1,Math.round(n/1.3));if(m<n){say(S,'On guard, '+nm(S,e)+' takes '+m+' instead of '+n+'.');n=m;}}return _dmg(S,e,n,cause);};
const hb=(S,a,o,o0)=>{if(o!==o0&&o.k==='t'&&a.k==='t'&&alive(S,a)&&alive(S,o)&&!inert(o.t)&&!bodiless(o)){const n=o.t.st.guarding?pc(MT(o.t),1.3):MT(o.t);say(S,Cap(nm(S,o))+' hits back'+(o.t.st.guarding?', 30% harder on guard':'')+'.');_dmg(S,a,n,'fight');}};
hitBack=hb;
const toHand=(S,t)=>{S.things.splice(S.things.indexOf(t),1);dropVerbs(S,t);if(!t.token)S.players[t.owner].hand.push(t.card);};
const prot=t=>t.props.includes('named');
const F=VERBF;

/* ---- verbs ---- */
F.seep=function(S,who,subs,objs,c){const ag=agents(S,who,subs,e=>e.k==='t'&&e.t.props.includes('liquid')&&!e.t.st.frozen,'cannot seep: only a liquid can.');
 for(const a of ag){for(const o of objs){if(!alive(S,a))break;if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;didAct(S,who,a);say(S,Cap(nm(S,a))+' seeps past every guard to '+nm(S,o)+'.');hit(S,o,MT(a.t)*c.mult+(c.manner||0),'seep');c.effect=true;touch(S,a,o,c);}}};
F.toxify=function(S,who,subs,objs,c){const ag=agents(S,who,subs,e=>has(e,'toxic'),'has no poison in it.');
 for(const a of ag){for(const o of objs){if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;if(o.k==='p'){say(S,'Only a thing can be toxified: the poison spreads from it.');continue;}
   if(o.t.side===who){say(S,'Only a rival thing can be toxified.');continue;}didAct(S,who,a);if(poison(S,o,1)){S.tox={who};say(S,'The poison will spread, one thing each of '+(who===0?'your':'the rival’s')+' turns.');c.effect=true;}}}};
F.drench=function(S,who,subs,objs,c){const ag=agents(S,who,subs,e=>e.k==='t'&&e.t.props.includes('liquid')&&!e.t.st.frozen,'cannot drench: only a liquid can.');
 for(const a of ag){for(const o0 of objs){if(!alive(S,a))break;const o=blockOf(S,o0,c,a);if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;didAct(S,who,a);
   say(S,Cap(nm(S,a))+' drenches '+nm(S,o)+'.');hit(S,o,MT(a.t)*c.mult,'drench');if(alive(S,o))wet(S,o);c.effect=true;touch(S,a,o,c);hb(S,a,o,o0);}}};
F.dissolve=function(S,who,subs,objs,c){const ag=agents(S,who,subs,e=>e.k==='t'&&(e.t.props.includes('liquid')||e.t.props.includes('corrosive')),'cannot dissolve anything.');
 for(const a of ag){didAct(S,who,a);const uni=a.t.props.includes('universal');let used=false;
  for(const o0 of objs){const o=blockOf(S,o0,c,a);if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
   if(o.k==='p'){const n=pc(MT(a.t),.3)*c.mult;say(S,Cap(nm(S,a))+' eats into '+nm(S,o)+'.');damage(S,o,n,'acid');c.effect=true;used=true;continue;}
   if(!uni&&o.t.props.includes('incorruptible')){say(S,'Gold cannot be dissolved.');continue;}
   const n=pc(o.t.vig,.5)*c.mult;say(S,Cap(nm(S,o))+' dissolves: it loses half.');damage(S,o,n,'acid');c.effect=true;used=true;}
  if(uni&&used&&alive(S,a)){say(S,'Nothing can hold the universal solvent.');destroy(S,a.t,'gone');}}};
CAN.haunt=h=>h('spirit')||h('dark');
F.haunt=function(S,who,subs,objs,c){const ag=agents(S,who,subs,e=>e.k==='t'&&canT('haunt',e.t),'cannot haunt: only spirits and dark things can.');
 for(const a of ag){for(const o of objs){if(!alive(S,a))break;if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
   if(o.k==='p'){say(S,'Only a thing can be haunted.');continue;}if(o.t.side===who){say(S,'Only a rival thing can be haunted.');continue;}
   if(isG(o.t)){say(S,Cap(nm(S,o))+' cannot be moved.');continue;}if(warded(S,o.t.side)){say(S,Cap(nm(S,a))+' cannot cross the salt.');continue;}
   if(o.t.props.includes('sacred')){say(S,Cap(nm(S,o))+' is sacred and cannot be haunted.');continue;}if(prot(o.t)){say(S,Cap(nm(S,o))+' is protected and cannot be haunted.');continue;}
   didAct(S,who,a);const lab=Cap(nm(S,o)),tk=o.t.token;toHand(S,o.t);say(S,Cap(nm(S,a))+' haunts '+lab.toLowerCase().replace(/^the rival’s/,'the rival’s')+'. '+lab+(tk?' fades and is gone.':' flees back to its keeper’s hand.'));c.effect=true;}}};
F.eat=function(S,who,subs,objs,c){const ag=agents(S,who,subs,e=>e.k==='p'||e.t.props.includes('beast')||e.t.props.includes('human'),'has no mouth to eat with.');
 for(const a of ag){for(const o of objs){if(!alive(S,a))break;if(!alive(S,o))continue;
   if(o.k==='p'||!(o.t.props.includes('living'))||isG(o.t)){say(S,Cap(nm(S,o))+' cannot be eaten.');continue;}if(window.DTV>=11&&o.t.side===who){say(S,'Only a rival thing can be eaten.');continue;}if(a.k==='t'&&o.t===a.t)continue;
   if(a.k==='t'&&(window.DTV>=11?o.t.vig*2>a.t.vig:o.t.vig>=a.t.vig)){say(S,Cap(nm(S,o))+' is too big for '+nm(S,a)+' to eat'+(window.DTV>=11?': it can only swallow something half its size or less.':'.'));continue;}if(a.k==='t'&&!reach(S,a,o))continue;
   didAct(S,who,a);const n=pc(o.t.vig,window.DTV>=11?.3:.5),pr=o.t.props.slice();say(S,Cap(nm(S,a))+' '+vb(a,'eat','eats')+' '+nm(S,o)+'.');destroy(S,o.t,'eaten');c.effect=true;
   if(a.k==='p'){const p=S.players[a.i];p.life=Math.min(LIFE,p.life+n);say(S,Cap(nm(S,a))+' '+vb(a,'gain','gains')+' '+n+' life.');}else if(!a.t.st.measured){a.t.vig+=n;say(S,Cap(nm(S,a))+' gains '+n+' and has '+a.t.vig+'.');}
   if((pr.includes('thorny')||pr.includes('sting'))&&alive(S,a)){say(S,'It stings going down.');damage(S,a,1,'sting');}
   if(pr.includes('toxic')&&alive(S,a)){say(S,'It was poison.');poison(S,a,1);}}}};
F.scream=function(S,who,subs,objs,c){const ag=agents(S,who,subs,e=>has(e,'voiced'),'has no voice.');
 for(const a of ag){didAct(S,who,a);const k=(a.k==='t'&&a.t.w==='mandrake'?2:1)*c.mult;say(S,Cap(nm(S,a))+' '+vb(a,'scream','screams')+'.');
  for(const t of S.things.slice())if(t.side===1-who&&!isG(t)&&S.things.includes(t))damage(S,T(t),k,'scream');damage(S,P(1-who),(window.DTV>=11?1:2)*k,'scream');
  let woke=false;for(const t of S.things)if(t.st.asleep){t.st.asleep=0;woke=true;}for(const p of S.players)if(p.asleep){p.asleep=0;woke=true;}if(woke)say(S,'Every sleeper wakes.');c.effect=true;}};

/* ---- spells ---- */
const spell=(fn)=>function(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;fn(S,who,e,c,one(subs));}};
F.transmute=spell((S,who,e,c,o1)=>{if(!own(e,who)){if(o1)say(S,'Only your own things can be transmuted.');return;}const t=e.t,l=ladOf(t.w);if(!l){if(o1)say(S,Cap(nm(S,e))+' cannot be transmuted: it is on no ladder.');return;}
 const up2=S.things.some(x=>x.side===who&&x.props.includes('crucible'))?2:1;let moved=0;
 for(let k=0;k<up2;k++){const r=l[1].indexOf(t.w);if(r<0||r>=l[1].length-1)break;const nx=l[1][r+1],wasG=isG(t),toG=W[nx].props.includes('ground')||W[nx].props.includes('spell');
   if(toG!==wasG&&full(S,who,nx)){say(S,'There is no room for '+nx+'.');break;}const old=t.vig;turnInto(S,t,nx);t.vig=Math.max(old+1,W[nx].vig);if(toG)t.pl=-1;else if(wasG)t.pl=placeFor(S,who);moved++;}
 if(!moved){if(o1)say(S,Cap(nm(S,e))+' is at the top of its ladder already.');return;}say(S,Cap(nm(S,e))+' climbs the '+l[0]+' ladder: '+t.w+', with '+t.vig+'.');c.effect=true;});
const buff=(form,test,good,p1,p2,extra)=>spell((S,who,e,c,o1)=>{if(!own(e,who)){if(o1)say(S,'Only your own things can be '+form+'.');return;}const t=e.t;if(isG(t)){if(o1)say(S,'Ground cannot be '+form+'.');return;}
 const g=test(t),n=pc(t.vig,g?p1:p2)*c.mult;if(!evolve(S,t,form,t.st.measured?0:n)){if(o1)say(S,Cap(nm(S,e))+' is '+form+' already.');return;}if(g&&extra)extra(S,t);c.effect=true;});
F.temper=buff('tempered',t=>t.props.includes('metal')||t.props.includes('sharp'),'metal',.3,.2,(S,t)=>{t.props=t.props.filter(p=>p!=='brittle');addProp(t,'incorruptible');if(!inert(t)){t.st.guarding=1;say(S,Cap(nm(S,T(t)))+' stands guard.');}});
F.distil=buff('distilled',t=>t.props.includes('liquid'),'liquid',.3,.2,(S,t)=>addProp(t,'potent'));
const _rip=buff('ripe',t=>t.props.includes('plant'),'plant',.3,.2,(S,t)=>addProp(t,'potent'));
F.ripen=function(S,who,subs,objs,c){const e=subs[0];if(e&&own(e,who)&&e.t.props.includes('sprout')){nextStage(S,e.t);c.effect=true;return;}return _rip(S,who,subs,objs,c);};
F.coagulate=buff('coagulated',()=>true,'',.2,.2,(S,t)=>{t.st.fixed=1;say(S,'It can never be changed again.');});
F.ferment=spell((S,who,e,c,o1)=>{if(!own(e,who)||isG(e.t)||e.t.st.ferment){if(o1)say(S,'Only your own things can ferment, once.');return;}e.t.st.ferment=2;say(S,Cap(nm(S,e))+' begins to work. In two turns it gains '+(window.DTV>=11?'30%':'half again')+'.');c.effect=true;});
F.measure=spell((S,who,e,c,o1)=>{if(e.k==='p'||isG(e.t)){if(o1)say(S,'Only a thing can be measured.');return;}const t=e.t;if(t.st.measured){if(o1)say(S,Cap(nm(S,e))+' is measured already.');return;}t.st.measured=1;t.mv=t.vig;say(S,Cap(nm(S,e))+' is measured at '+t.vig+'. It can never gain vigour.');c.effect=true;});
F.enchant=spell((S,who,e,c,o1)=>{if(!own(e,who)){if(o1)say(S,'Only your own things can be enchanted.');return;}const t=e.t,ills=['poisoned','frozen','bound','blind','asleep','sodden','burning'].filter(s=>t.st[s]);
 for(const s of ills)t.st[s]=0;const re=t.acted||t.nonAtk;t.acted=false;t.nonAtk=false;if(!ills.length&&!re){if(o1)say(S,Cap(nm(S,e))+' needs nothing: it is well and ready already.');return;}
 say(S,Cap(nm(S,e))+' is enchanted'+(ills.length?': '+ills.join(', ')+' fall away':'')+(re?', and it may act again':'')+'.');c.effect=true;});
F.gild=spell((S,who,e,c,o1)=>{if(e.k==='p'||isG(e.t)||ghost(e.t)){if(o1)say(S,'Gold cannot hold to '+nm(S,e)+'.');return;}const t=e.t;if(!evolve(S,t,'golden',t.st.measured?0:pc(t.vig,.3)*c.mult)){if(o1)say(S,Cap(nm(S,e))+' is golden already.');return;}['metal','bright','incorruptible','hoard'].forEach(p=>addProp(t,p));t.gild=1;c.effect=true;});
F.awaken=spell((S,who,e,c,o1)=>{if(e.k==='p'||isG(e.t)){if(o1)say(S,Cap(nm(S,e))+' cannot be awakened.');return;}const t=e.t;
 if(t.w==='clay'||t.props.includes('stone')){const was=Cap(nm(S,e)),old=t.vig;turnInto(S,t,'golem');t.vig=Math.max(W.golem.vig,old+pc(old,.3));say(S,was+' wakes as a golem.');c.effect=true;return;}
 if(t.props.includes('living')){if(o1)say(S,Cap(nm(S,e))+' is alive already.');return;}if(!evolve(S,t,'waking',t.st.measured?0:pc(t.vig,.3)*c.mult))return;addProp(t,'living');if(!t.verbs.includes('strike')){t.verbs.unshift('strike');t.inn=1;}c.effect=true;});
F.crown=spell((S,who,e,c,o1)=>{if(e.k==='p'||!e.t.props.includes('living')){if(o1)say(S,'Only something living can wear a crown.');return;}const t=e.t;if(!evolve(S,t,'crowned',t.st.measured?0:pc(t.vig,.3)*c.mult)){if(o1)say(S,Cap(nm(S,e))+' is crowned already.');return;}c.effect=true;
 const kind=['beast','plant','human','spirit'].find(k=>t.props.includes(k));if(kind)for(const o of side(S,t.side))if(o!==t&&o.props.includes(kind)&&!isG(o)){const n=up(o,.1);if(n)say(S,Cap(nm(S,T(o)))+' rallies to its sovereign and has '+o.vig+'.');}});
F.protect=spell((S,who,e,c,o1)=>{if(e.k==='p'||isG(e.t)){if(o1)say(S,'Only a thing on the board can be protected, not ground.');return;}const t=e.t;
 if(t.w==='clay'){turnInto(S,t,'golem');t.vig=Math.max(t.vig,W.golem.vig);addProp(t,'named');say(S,'Protected, the clay wakes as a golem.');c.effect=true;return;}
 if(t.props.includes('blank')){const tg=side(S,1-t.side).filter(x=>!isG(x)&&!x.st.occult&&!x.st.masked).sort((a,b)=>b.vig-a.vig)[0];if(!tg){say(S,'There is nothing opposite to copy.');return;}turnInto(S,t,tg.w);t.vig=Math.max(t.vig,tg.vig);c.effect=true;return;}
 if(!evolve(S,t,'protected',t.st.measured?0:pc(t.vig,window.DTV>=11?.2:.1))){if(o1)say(S,Cap(nm(S,e))+' is protected already.');return;}addProp(t,'named');c.effect=true;});
F.forget=function(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;
  if(e.k==='p'){const p=S.players[e.i];if(!p.hand.length){say(S,'Nothing is left in that hand to forget.');continue;}const i=Math.floor(rnd(S)*p.hand.length),w=p.hand.splice(i,1)[0];p.discard.push(w);say(S,Cap(nm(S,e))+' '+vb(e,'forget','forgets')+' a word'+(e.i===0?': '+w:'')+'.');c.effect=true;continue;}
  const t=e.t;if(isG(t)){if(one(subs))say(S,'Ground cannot forget.');continue;}const base=(W[t.w].props||[]).slice(),had=(t.forms||[]).length||t.verbs.some(v=>!(v==='strike'&&t.inn)&&!(t.innv||[]).includes(v));
  if(!had){if(one(subs))say(S,'Nothing is there to forget: '+nm(S,e)+' has no adjectives or learned verbs.');continue;}
  const keep=t.verbs.filter(v=>(v==='strike'&&t.inn)||(t.innv||[]).includes(v));dropVerbs(S,t);t.verbs=keep;t.forms=[];t.title=null;t.props=base;t.vig=Math.min(t.vig,W[t.w].vig);say(S,Cap(nm(S,e))+' forgets everything it was given, and has '+t.vig+'.');c.effect=true;}};
F.wake=spell((S,who,e,c,o1)=>{if(e.k==='p'){const p=S.players[e.i];if(p.asleep){p.asleep=0;say(S,Cap(nm(S,e))+' '+vb(e,'wake','wakes')+'.');c.effect=true;}else if(o1)say(S,'Nobody there is asleep.');return;}const t=e.t;
 if(t.st.stone&&t.was){t.props=t.was;t.was=null;t.st={};up(t,.2);t.acted=false;say(S,Cap(nm(S,e))+' wakes from stone with '+t.vig+', and may act.');c.effect=true;return;}
 if(t.st.asleep){t.st.asleep=0;say(S,Cap(nm(S,e))+' wakes.');c.effect=true;}else if(o1)say(S,Cap(nm(S,e))+' is not asleep.');});
F.thaw=function(S,who,subs,objs,c){let n=0;for(const t of S.things.slice())if(t.st.frozen){t.st.frozen=0;n++;if(t.side===who)up(t,.2);}if(n){say(S,'Everything frozen thaws, and what is yours comes back 20% stronger.');c.effect=true;}else say(S,'Nothing is frozen to thaw.');};
F.kindle=spell((S,who,e,c,o1)=>{if(!own(e,who)||isG(e.t)){if(o1)say(S,'Only your own things can be kindled.');return;}const t=e.t;t.st.kindle=1;const n=up(t,.3*c.mult);say(S,Cap(nm(S,e))+' is kindled: '+n+' stronger, and its hits set things alight this turn.');c.effect=true;});
F.grow=spell((S,who,e,c,o1)=>{if(e.k==='p'||!e.t.props.includes('plant')){if(o1)say(S,Cap(nm(S,e))+' is no plant: only plants grow.');return;}if(clime(S,'winter')||clime(S,'drought')||clime(S,'desert')){say(S,'Nothing grows in '+S.clime.w+'.');return;}
 const t=e.t,n=up(t,(t.st.sodden?.4:.2)*c.mult);say(S,Cap(nm(S,e))+' grows '+n+(t.st.sodden?', drinking the wet,':'')+' to '+t.vig+'.');c.effect=true;if(t.props.includes('sprout')){t.st.grow=(t.st.grow||0)+1;if(t.st.grow>=2)nextStage(S,t);}});
F.wither=spell((S,who,e,c,o1)=>{if(e.k==='p'||isG(e.t)){if(o1)say(S,'Only a thing can wither.');return;}const t=e.t,pl=t.props.includes('plant');if(!pl&&t.side===who){if(o1)say(S,'Only a plant or a rival thing withers.');return;}
 const n=pc(t.vig,pl?.5:.3)*c.mult;say(S,Cap(nm(S,e))+' withers'+(pl?', losing half':'')+'.');damage(S,e,n,'wither');c.effect=true;});
F.rust=spell((S,who,e,c,o1)=>{if(e.k==='p'||isG(e.t)){if(o1)say(S,'Only a thing can rust.');return;}const t=e.t,m=t.props.includes('metal');if(!m&&t.side===who){if(o1)say(S,'Only a metal or a rival thing rusts.');return;}
 if(t.props.includes('incorruptible')||(m&&t.props.includes('liquid'))){say(S,Cap(nm(S,e))+' cannot rust.');return;}const n=pc(t.vig,m?.5:.2)*c.mult;say(S,Cap(nm(S,e))+' rusts'+(m?', losing half':'')+'.');damage(S,e,n,'rust');c.effect=true;});
F.dispel=function(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;let any=false;
  const kill=t=>{say(S,Cap(nm(S,T(t)))+' is dispelled.');destroy(S,t,'spent');any=true;};
  if(e.k==='p'){const sd=e.i;for(const t of side(S,sd))if(t.st.occult||t.st.masked){t.st.occult=0;t.st.masked=0;any=true;say(S,Cap(nm(S,T(t)))+' is shown for what it is.');}
    const sp=S.things.find(t=>t.owner===sd&&t.props.includes('spell'));if(sp)kill(sp);}
  else if(e.t.props.includes('spell'))kill(e.t);else if(e.t.st.occult||e.t.st.masked){e.t.st.occult=0;e.t.st.masked=0;say(S,Cap(nm(S,e))+' is shown for what it is.');any=true;}
  if(any)c.effect=true;else say(S,'Nothing is there to dispel.');}};
F.summon=spell((S,who,e,c,o1)=>{if(e.k==='p'){if(o1)say(S,'Only a thing can be summoned.');return;}const t=e.t;if(t.side===who){if(o1)say(S,Cap(nm(S,e))+' is on your side already.');return;}
 if(isG(t)){say(S,Cap(nm(S,e))+' cannot be moved.');return;}if(prot(t)){say(S,Cap(nm(S,e))+' is protected and cannot be summoned.');return;}if(t.vig>9){say(S,Cap(nm(S,e))+' is too strong to summon: it has more than 9.');return;}
 if(full(S,who)){say(S,'Your side is full: there is no room for it.');return;}const lab=Cap(nm(S,e));t.side=who;t.pl=placeFor(S,who);t.st.guarding=0;t.acted=true;say(S,lab+' is summoned to your side.'.replace('your',who===0?'your':'the rival’s'));c.effect=true;});
F.sacrifice=spell((S,who,e,c,o1)=>{if(!own(e,who)||isG(e.t)){if(o1)say(S,'Only one of your own things can be sacrificed.');return;}const t=e.t,n=Math.max(1,Math.ceil(t.vig/3)),lab=Cap(nm(S,e));destroy(S,t,'spent');S.players[who].ink+=n;say(S,lab+' is sacrificed: '+n+' breath.');c.effect=true;});
/* lure and tame respect protection already ('named') */

/* ---- what things can do ---- */
const _ab=abilities;abilities=function(props,st){if(props.includes('spell')||props.includes('ground'))return _ab(props,st);const h=p=>props.includes(p),a=[];if(st&&st.stone)return['nothing: it is stone'];if(h('event'))return[];
 if(!h('concept'))a.push('strike');if(h('beast')||h('human'))a.push('bite');if(h('heavy')||h('wood')||h('stone'))a.push('crush');if(CAN.cut(h))a.push('cut');if(CAN.sting(h))a.push('sting');
 if(h('liquid'))a.push('seep','drench');if(h('toxic'))a.push('toxify');if(CAN.bind(h))a.push('bind');if(h('liquid')||h('corrosive'))a.push('dissolve');if(CAN.blow(h))a.push('blow');
 if(CAN.hot(h)||(st&&st.burning))a.push('burn');if(CAN.blindp(h)||(st&&st.burning))a.push('blind');if(CAN.haunt(h))a.push('haunt');if(CAN.petrify(h))a.push('petrify');if(CAN.steal(h))a.push('steal');
 if(['herb','adept','nurse','herbalist','elixir','pure'].some(h))a.push('mend');if(h('beast')||h('human'))a.push('eat');if(h('living'))a.push('drink');if(h('voiced'))a.push('scream');a.push('guard');return a;};

/* ---- turn: gold pays, poison spreads ---- */
const _st=startTurn;startTurn=function(S,i){const r=_st.apply(this,arguments);try{if(S.over!=null)return r;
  const g=S.things.filter(t=>t.side===i&&t.gild).length;if(g){S.players[i].ink+=g;say(S,(i===0?'Your gold pays ':'The rival’s gold pays ')+g+' ink.');}
  if(S.tox&&S.tox.who===i){const any=S.things.some(t=>t.st.poisoned);if(!any){S.tox=null;say(S,'The poison has run its course.');}
   else{const cand=S.things.filter(t=>!isG(t)&&t.props.includes('living')&&!t.props.includes('toxic')&&!t.st.poisoned&&!t.st.fixed);if(cand.length){const t=cand[Math.floor(rnd(S)*cand.length)];say(S,'The poison spreads to '+nm(S,T(t))+'.');poison(S,T(t),1);}
    else{say(S,'Everything is poisoned. It spreads to '+nm(S,P(1-i))+'.');poison(S,P(1-i),1);}}}}catch(e){console.error(e);}return r;};
})();

/* v9: the colour pie. Schools on every card, weather by school, evolve with breath. */
(function(){
'use strict';
const V=window.DTV|0;if(!(V>=9))return;
const pc=(n,p)=>Math.max(1,Math.ceil(n*p));
/* ---- schools: empty out The Word ---- */
Object.assign(SCHOOLOF,{homunculus:'fire',alchemist:'fire',apothecary:'life',hermit:'earth',miser:'earth',muse:'air',lullaby:'water',
 beasts:'life',worts:'life',plants:'life',metals:'earth',stones:'earth',spirits:'rot',birds:'air',liquids:'water',sleepers:'water',flames:'fire',
 sleep:'water',wake:'air',bite:'life',cut:'earth',sting:'air',bind:'life',blind:'fire',petrify:'earth',steal:'air',drink:'water',eat:'life',forget:'water',scream:'air',awaken:'life',sacrifice:'fire',seep:'water',toxify:'rot',
 occult:'rot',volatile:'air',fixed:'earth',corrosive:'water',radiant:'fire',torpid:'water',sacred:'life',brittle:'earth',leaden:'earth',ancient:'earth',vast:'life',feeble:'rot',feral:'life',thorny:'life',resonant:'air',masked:'rot',
 ordeal:'fire',attractor:'earth',desert:'earth',winter:'earth',fog:'rot',flux:'air'});
const SC={fire:['Fire','#c8412b','#fff'],water:['Water','#2f6fa3','#fff'],earth:['Earth','#a8742a','#fff'],air:['Air','#d9dee3','#1c2430'],life:['Life','#4f8a3c','#fff'],rot:['Rot','#5b3a6b','#fff'],word:['The Word','#c9a24a','#2a1e08']};
const OPP={fire:'water',water:'fire',earth:'air',air:'earth',life:'rot',rot:'life'};
window.DTVSC=SC;window.DTVSCHOOL=w=>{try{return schoolOf(w);}catch(e){return 'word';}};
/* ---- weather by school ---- */
const WX={drought:'fire',noon:'fire',rain:'water',flood:'water',desert:'earth',winter:'earth',storm:'air',flux:'air',spring:'life',harvest:'life',night:'rot',fog:'rot'};
const XT={drought:'Nothing stays wet.',noon:'Nothing stays hidden.',rain:'Fires go out.',flood:'Everything is soaked.',desert:'Nothing flies.',winter:'Wet things freeze.',storm:'Lightning hits one thing a side each turn.',flux:'Every condition falls away each turn.',spring:'Sleepers wake; eggs hatch.',harvest:'Plants pay 1 ink a turn.',night:'New things arrive unseen.',fog:'Nothing can be singled out.'};
for(const c in WX)if(W[c]){const u=WX[c];W[c].gloss='While it lasts: '+SC[u][0]+' things are 20% stronger, '+SC[OPP[u]][0]+' things 20% weaker. '+XT[c];}
window.DTVWX=c=>WX[c]?{up:WX[c],down:OPP[WX[c]]}:null;
climeDv=function(){return 0;};
const _fl=flies;flies=function(t){if(typeof SCUR!=='undefined'&&SCUR&&clime(SCUR,'desert'))return false;return _fl(t);};
function wxSync(S){if(!S||!S.things)return;const c=S.clime&&S.clime.w,m=WX[c];
 for(const t of S.things){if(isG(t)){t.wxb=0;continue;}const b=t.wxb||0,base=t.vig-b,s=schoolOf(t.w);let want=0;if(m&&s===m)want=pc(base,.2);else if(m&&s===OPP[m])want=-pc(base,.2);
  if(want!==b){t.vig=Math.max(1,base+want);t.wxb=t.vig-base;}}}
window.dtvWxSync=wxSync;
const _rs=resolve;resolve=function(S){const r=_rs.apply(this,arguments);try{wxSync(S);}catch(e){}return r;};
const _rx=react;react=function(S){const r=_rx.apply(this,arguments);try{wxSync(S);}catch(e){}return r;};
const _st=startTurn;startTurn=function(S){const r=_st.apply(this,arguments);try{wxSync(S);}catch(e){}return r;};

/* ---- in tune: words of a thing's own school are 20% stronger, of the opposite school 20% weaker ---- */
function tuneOf(S,who,sen){if(!sen||sen.veil!=null||sen.clime!=null)return null;const hand=S.players[who].hand,vw=sen.kverb||(sen.verb!=null?hand[sen.verb]:null);if(vw&&FUSEW.includes(vw))return null;
 const word=vw||((sen.adjs||[]).length?hand[sen.adjs[0]]:null);if(!word||!W[word])return null;const ws=schoolOf(word);if(!ws||ws==='word')return null;
 const s=sen.subj;let ts=null;if(s&&s.k==='thing'){const t=findThing(S,s.id);if(!t||t.side!==who)return null;ts=schoolOf(t.w);}else if(s&&s.k==='card'&&W[hand[s.i]]&&W[hand[s.i]].t===NOUN)ts=schoolOf(hand[s.i]);
 if(!ts||ts==='word')return null;const f=ts===ws?1.2:OPP[ts]===ws?0.8:null;if(!f)return null;
 return{who,f,ws,ts,lab:f>1?'in tune: '+SC[ws][0]:'against the grain: '+SC[ws][0]+' on '+SC[ts][0]};}
window.dtvTune=tuneOf;
const _dm9=damage;damage=function(S,e,n,cause){const T=S&&S.tune;if(T&&n>0&&e&&((e.k==='p'&&e.i!==T.who)||(e.k==='t'&&e.t&&e.t.side!==T.who))){const n2=T.f>1?Math.ceil(n*1.2):Math.max(1,Math.floor(n*0.8));
  if(n2!==n){const c=S.cx;if(S.atk&&c&&(c.mult||1)===1)c.pre=(c.pre||String(n))+(T.f>1?' +20%':' −20%')+' ('+T.lab+')';else say(S,(T.f>1?'In tune: ':'Against the grain: ')+n2+' instead of '+n+'.');n=n2;}}return _dm9.call(this,S,e,n,cause);};
const _rs9=resolve;resolve=function(S,who,sen){let T=null;try{T=tuneOf(S,who,sen);}catch(e){}if(!T)return _rs9.apply(this,arguments);
 const before={};for(const t of S.things)before[t.id]=t.vig-(t.wxb||0);S.tune=T;let r;try{r=_rs9.apply(this,arguments);}finally{S.tune=null;}
 try{if(r&&r.ok!==false)for(const t of S.things){const b=before[t.id];if(b==null||t.side!==who)continue;const d=t.vig-(t.wxb||0)-b;if(d<=0||(t.st&&t.st.measured))continue;
   const x=T.f>1?Math.ceil(d*.2):-Math.ceil(d*.2);if(!x)continue;t.vig=Math.max(1,t.vig+x);say(S,(T.f>1?'In tune ('+SC[T.ws][0]+'): ':'Against the grain: ')+nm(S,T_(t))+(x>0?' gains '+x+' more':' gains '+(-x)+' less')+', and has '+t.vig+'.');}}catch(e){console.error(e);}
 return r;};
const T_=t=>T(t);
/* ---- evolve with breath ---- */
for(const w of ['transmute'])if(!DTVX7.includes(w))DTVX7.push(w);
const ladOf=window.DTVLADOF;
window.dtvEvoCost=(S,t)=>{const l=ladOf&&ladOf(t.w);if(!l)return null;const r=l[1].indexOf(t.w);if(r<0||r>=l[1].length-1)return null;const cr=S.things.some(x=>x.side===t.side&&x.props.includes('crucible'));return Math.max(0,(t.evo||0)+1-(cr?1:0));};
window.dtvCanEvo=(S,who,t)=>{if(!t||t.side!==who||isG(t)&&!(ladOf(t.w)))return false;const c=dtvEvoCost(S,t);if(c==null||t.evoT===S.turn)return false;const l=ladOf(t.w),nx=l[1][l[1].indexOf(t.w)+1],toG=W[nx].props.includes('ground')||W[nx].props.includes('spell');if(toG!==isG(t)&&full(S,who,nx))return false;return S.players[who].ink>=c;};
window.dtvEvolve=function(S,who,t){if(!dtvCanEvo(S,who,t))return false;const c=dtvEvoCost(S,t),l=ladOf(t.w),nx=l[1][l[1].indexOf(t.w)+1],wasG=isG(t),toG=W[nx].props.includes('ground')||W[nx].props.includes('spell');
 S.players[who].ink-=c;const old=t.vig-(t.wxb||0),from=t.w;turnInto(S,t,nx);t.wxb=0;t.vig=Math.max(old+1,W[nx].vig);if(toG)t.pl=-1;else if(wasG)t.pl=placeFor(S,who);t.evo=(t.evo||0)+1;t.evoT=S.turn;
 say(S,(who===0?'You evolve ':'The rival evolves ')+from+' into '+nx+(c?' for '+c+' breath':' for nothing')+'. '+Cap(nx)+' has '+t.vig+'.','s');wxSync(S);return true;};
const _rf=window.dtvRivalFuse;window.dtvRivalFuse=function(){let ev=false;try{if(S&&S.botEv!==S.turn){S.botEv=S.turn;const p=S.players[1];
  const c=S.things.filter(t=>dtvCanEvo(S,1,t)).map(t=>({t,c:dtvEvoCost(S,t)})).filter(x=>p.ink-x.c>=1||x.c===0).sort((a,b)=>a.c-b.c||b.t.vig-a.t.vig)[0];if(c)ev=dtvEvolve(S,1,c.t);}}catch(e){console.error(e);}
 const r=_rf?_rf.apply(this,arguments):false;if(ev&&!r){try{render();}catch(e){}}return r||ev;};
/* ---- marks on cards ---- */
const SIG={fire:'<path d="M12 4 21 19H3z"/>',water:'<path d="M12 20 21 5H3z"/>',air:'<path d="M12 4 21 19H3zM6.5 13h11"/>',earth:'<path d="M12 20 21 5H3zM6.5 11h11"/>',life:'<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/>',rot:'<circle cx="12" cy="10" r="5.5"/><path d="M12 15.5V21M9 18.5h6"/>',word:'<path d="M12 3 15 12 12 21 9 12zM3 12h18"/>'};
const gem=s=>'<span class="sgem" data-s="'+s+'" title="'+SC[s][0]+'" style="--sc:'+SC[s][1]+';--sf:'+SC[s][2]+'"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">'+SIG[s]+'</svg></span>';
window.DTVGEM=gem;
window.dtvDecorate=function(){if(typeof S==='undefined'||!S)return;const p=S.players[0];
 try{const v=document.querySelector('.slots .slot.v');if(v){let T=null;if(typeof ui!=='undefined'&&ui)T=tuneOf(S,0,{subj:ui.subj,verb:ui.verb,kverb:ui.kverb,adjs:ui.adjs});v.classList.toggle('tune',!!(T&&T.f>1));v.classList.toggle('grain',!!(T&&T.f<1));v.style.setProperty('--sc',T?SC[T.ws][1]:'transparent');v.title=T?(T.f>1?'In tune: 20% stronger':'Against the grain: 20% weaker'):'';}}catch(e){}
 const put=(el,w)=>{if(!el||!w||!W[w])return;const g=el.querySelector(':scope>.sgem');if(g)g.remove();el.dataset.sch=schoolOf(w)||'word';};
 document.querySelectorAll('#hand .card').forEach(el=>put(el,p.hand[+el.dataset.i]));
 document.querySelectorAll('#mdraw .card').forEach(el=>put(el,(S.shop||[])[+el.dataset.i]));
 document.querySelectorAll('#table .thing[data-id]').forEach(el=>{const t=S.things.find(x=>String(x.id)===el.dataset.id);if(!t)return;put(el,t.w);
  const b=el.querySelector(':scope>.evo'),ok=S.phase==='play'&&dtvCanEvo(S,0,t),cost=dtvEvoCost(S,t);
  if(t.side!==0||cost==null||t.evoT===S.turn){if(b)b.remove();return;}
  const l=ladOf(t.w),nx=l[1][l[1].indexOf(t.w)+1],h='<button class="evo'+(ok?'':' off')+'" data-evo="'+t.id+'" title="Evolve into '+nx+' for '+cost+' breath"><span>▲</span>'+cost+'</button>';
  if(b){if(b.outerHTML!==h)b.outerHTML=h;}else el.insertAdjacentHTML('beforeend',h);});};
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('.evo');if(!b)return;e.stopPropagation();e.preventDefault();if(b.classList.contains('off')||S.phase!=='play')return;
 const t=S.things.find(x=>String(x.id)===b.dataset.evo);if(t&&dtvEvolve(S,0,t)){try{sfx('page');}catch(x){}try{keepMatch();}catch(x){}render();}},true);
document.addEventListener('pointerdown',e=>{if(e.target.closest&&e.target.closest('.evo'))e.stopPropagation();},true);
})();

/* v10: might and vigour. Might is how hard it hits; vigour is how much it can take. The ratio follows what the thing is. */
(function(){
'use strict';
const V=window.DTV|0;
const RO={knife:1.3,glass:1.2,flint:1,obsidian:1,wasp:1.2,scorpion:.9,egg:.1,'philosophical egg':.15,salt:.3,clay:.4,ivy:.4,lichen:.3,bellows:.5,dew:.3,elixir:.3,brine:.5,rue:.3,myrrh:.2,amber:.3,gold:.4,
 smith:.8,thief:.7,golem:.5,colossus:.5,knight:.7,troll:.6,behemoth:.8,'world tree':.5,oak:.4,steel:1,lightning:1.2,naphtha:1.2,gunpowder:3,stag:.8,boar:.7,
 toad:.4,leech:.5,moth:.4,egg2:0,pelican:.4,peacock:.4,scarab:.4,owl:.6,crow:.6,magpie:.5,bat:.6,adder:.8,spider:.6,salamander:.8,phoenix:.8,ouroboros:.6,
 shepherdess:.4,apothecary:.3,hermit:.3,scribe:.3,miser:.3,alchemist:.5,homunculus:.6,'bog hag':.6,sage:.4,oracle:.4,druid:.5,mirror:.3,gnome:.4,barrow:.3,ash:.5,sand:.5,slag:.5,carrion:.5,ice:.6,spore:.4,seed:.2,sapling:.3,'philosopher’s stone':.8};
function ratio(t){const w=t.w,p=t.props||[],h=x=>p.includes(x);if(RO[w]!=null)return RO[w];let r=.5;
 if(h('beast'))r+=.1;if(h('sharp'))r+=.25;if(h('sting'))r+=.15;if(h('fireborn'))r+=(V>=11?.3:.2);if(h('explosive'))r+=.4;if(h('corrosive'))r+=.2;if(h('toxic'))r+=.05;if(h('spirit'))r+=.1;if(h('flying'))r+=(V>=11?-.1:.05);if(h('swift'))r+=.1;if(h('brittle'))r+=.15;
 if(h('plant'))r-=.15;if(h('wood'))r-=.1;if(h('stone'))r-=.15;if(h('stubborn'))r-=.15;if(h('sacred'))r-=.1;if(h('eternal'))r-=.1;if(h('herb'))r-=.1;if(['adept','scribe','seer','hermit','hoard','herbalist','nurse'].some(h))r-=.15;
 return Math.max(.2,Math.min(1.3,r));}
window.DTVRATIO=ratio;window.DTVRO=RO;
window.MT=function(t){if(!(V>=10)||!t||!t.props)return t?t.vig:0;if(isG(t))return t.vig;return Math.max(1,Math.round(t.vig*ratio(t)));};
window.MTW=function(w,vig){const d=W[w];if(!d||d.t!==NOUN)return null;return window.MT({w,props:d.props,vig:vig!=null?vig:d.vig});};
if(!(V>=10))return;
const HB=(S,a,o,o0)=>{if(o!==o0&&o.k==='t'&&a.k==='t'&&alive(S,a)&&alive(S,o)&&!inert(o.t)&&!bodiless(o)){const m=MT(o.t),n=o.t.st.guarding?Math.max(1,Math.ceil(m*1.3)):m;say(S,Cap(nm(S,o))+' hits back for '+n+(o.t.st.guarding?', 30% harder on guard':'')+'.');damage(S,a,n,'fight');}};
hitBack=HB;
/* show it */
const _dec=window.dtvDecorate;window.dtvDecorate=function(){if(_dec)_dec();try{const p=S.players[0];
 const put=(el,m)=>{if(!el)return;let b=el.querySelector(':scope>.mtb');if(m==null){if(b)b.remove();return;}const h='<i>'+m+'</i>';if(!b){el.insertAdjacentHTML('beforeend','<span class="mtb" title="Might: how hard it hits">'+h+'</span>');}else if(b.innerHTML!==h)b.innerHTML=h;};
 document.querySelectorAll('#table .thing[data-id]').forEach(el=>{const t=S.things.find(x=>String(x.id)===el.dataset.id);put(el,t&&!isG(t)&&!t.props.includes('spell')?MT(t):null);});
 document.querySelectorAll('#hand .card').forEach(el=>{const w=p.hand[+el.dataset.i];const d=W[w];put(el,d&&d.t===NOUN&&!d.props.includes('event')&&!d.props.includes('spell')&&!d.props.includes('ground')?MTW(w,d.vig+2*upOf(S,0,w)):null);});
 document.querySelectorAll('#mdraw .card').forEach(el=>{const w=(S.shop||[])[+el.dataset.i];const d=W[w];put(el,d&&d.t===NOUN&&!d.props.includes('event')&&!d.props.includes('spell')&&!d.props.includes('ground')?MTW(w):null);});
}catch(e){console.error(e);}};
})();

/* v11: balance from the simulations */
(function(){
'use strict';
const V=window.DTV|0;if(!(V>=11))return;
const pc=(n,p)=>Math.max(1,Math.ceil(n*p));
/* nerfs: the strongest deck leaned on vast, eat, ferment and obsidian */
ADJF.vast=(S,who,e)=>{if(e.t.vasted){say(S,Cap(nm(S,e))+' is already as vast as a word can make it.');return false;}e.t.vasted=1;e.t.vig+=pc(e.t.vig,.3);say(S,Cap(nm(S,e))+' is vast, and has '+e.t.vig+' vigour.');return true;};
if(W.vast)W.vast.gloss='+30% vigour, and so +30% might.';
if(W.eat)W.eat.gloss='A beast or person eats a rival thing half its size or less and gains 30% of its vigour. Eating something toxic poisons the eater.';
if(W.ferment)W.ferment.gloss='Spell. In two turns, one of your things gains 30% and becomes potent.';
if(W.obsidian){W.obsidian.vig=6;W.obsidian.gloss='Volcanic glass: the keenest edge, and it shatters. All edge, little body.';}if(window.DTVRO)DTVRO.obsidian=1.2;
/* buffs: The Word and Water were far behind */
if(W.word)W.word.vig=5;if(W.silence)W.silence.syl=1;if(W.dew)W.dew.vig=4;if(W.brine)W.brine.vig=5;if(W.pitch)W.pitch.vig=4;if(W.flint)W.flint.vig=4;
if(W.protect)W.protect.gloss='Spell. A thing gains 20% and is protected: it can’t be stolen, lured, tamed, summoned or haunted. Clay wakes as a golem.';
if(W.lure)W.lure.gloss='Spell. A rival thing of 5 or less, not a beast, comes to your side.';
const _el=ADJF.eternal;ADJF.eternal=(S,who,e)=>{const r=_el(S,who,e);if(r&&e.t.side===who){const n=pc(e.t.vig,.3);e.t.vig+=n;say(S,'Eternal, it stands '+n+' stronger.');}return r;};
if(W.eternal)W.eternal.gloss='Destroyed, it returns to its keeper’s hand. On your own thing it also gives +30% vigour.';
EVENT.omen=function(S,who,c){const o=S.players[1-who];if(who===0)say(S,'The omen shows the rival’s hand: '+(o.hand.join(', ')||'nothing')+'.');else say(S,'The rival reads an omen of your hand.');const p=S.players[who];for(let k=0;k<2;k++){if(!p.deck.length&&p.discard.length){p.deck=shuffle(S,p.discard);p.discard=[];}if(p.deck.length)p.hand.push(p.deck.pop());}c.effect=true;};
if(W.omen)W.omen.gloss='Said alone, then spent. You read the rival’s hand and draw two words.';
EVENT.dream=function(S,who,c){for(const t of side(S,1-who).slice()){if(isG(t)||!S.things.includes(t))continue;damage(S,T(t),t.st.asleep?4:2,'dream');}damage(S,P(1-who),4,'dream');c.effect=true;};
if(W.dream)W.dream.gloss='Said alone, then spent. Everything opposite takes 2 (asleep things 4), and the rival takes 4.';
if(W.ink)W.ink.gloss='A well of ink. While it stands you get 1 more breath and 1 ink each turn. Lasts 4 turns.';


/* v11, pass 3 */
if(W.ember)W.ember.vig=6;if(W.smith)W.smith.vig=6;if(W.naphtha)W.naphtha.vig=6;
const _addT=addThing;addThing=function(S,w,sd,owner,token,card){const t=_addT.apply(this,arguments);try{if(w==='unnamed'&&!S.quiet){const tg=side(S,1-sd).filter(x=>!isG(x)&&!x.st.occult&&!x.st.masked).sort((a,b)=>b.vig-a.vig)[0];if(tg){turnInto(S,t,tg.w);t.vig=Math.max(t.vig,tg.vig);say(S,'The unnamed thing takes the shape of '+tg.w+'.');}}}catch(e){}return t;};
if(W.unnamed)W.unnamed.gloss='A thing with no word. When it arrives it becomes the strongest thing standing opposite.';
if(typeof EVENT!=='undefined'&&EVENT.loan){EVENT.loan=function(S,who,c){const p=S.players[who];p.ink+=3;say(S,(who===0?'You borrow':'The rival borrows')+' 3 breath now.');if(!full(S,who,'debt')){addThing(S,'debt',who,who,true);say(S,'A debt settles on '+nm(S,P(who))+'.');}c.effect=true;};if(W.loan)W.loan.gloss='Said alone, then spent. You gain 3 breath now, and a debt settles on your own side.';}
if(W.crucible)W.crucible.gloss='While it stands on your ground, every evolve costs 1 less breath.';
/* v11, pass 2 */
if(W.scream)W.scream.gloss='Everything opposite takes 1, and so does the rival. Wakes every sleeper. A mandrake’s scream does double.';
if(window.DTVRO){DTVRO.wasp=.7;}if(W.eat)W.eat.syl=2;
const _lu=VERBF.lure;VERBF.lure=function(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e)||e.k!=='t')continue;const t=e.t;if(t.side===who||isG(t)){if(subs.length===1)say(S,Cap(nm(S,e))+' cannot be lured.');continue;}
 if(t.props.includes('named')){say(S,Cap(nm(S,e))+' is protected and cannot be lured.');continue;}if(t.vig>5){say(S,Cap(nm(S,e))+' is too strong to lure: it has more than 5.');continue;}if(full(S,who)){say(S,'Your side is full: there is no room for it.');continue;}
 const lab=Cap(nm(S,e));t.side=who;t.pl=placeFor(S,who);t.st.guarding=0;t.acted=true;say(S,lab+' is lured to '+(who===0?'your':'the rival’s')+' side.');c.effect=true;}};
if(W.lure)W.lure.gloss='Spell. A rival thing of 5 or less, of any kind, comes to your side.';
const _dr=VERBF.drink;VERBF.drink=function(S,who,subs,objs,c){const L=S.log.length;const r=_dr.apply(this,arguments);if(S.log.slice(L).some(l=>/ drinks? /.test(String(l.x||l)))){const a=subs.find(e=>alive(S,e));if(a&&a.k==='t'&&!a.t.st.measured){a.t.vig+=2;say(S,'Refreshed: '+nm(S,a)+' gains 2.');}else{const p=S.players[who];p.life+=2;say(S,'Refreshed: 2 life.');}}return r;};
if(W.drink)W.drink.gloss='Drink one of your liquids: get what it gives, and the drinker gains 2.';
const _bi=VERBF.bind;VERBF.bind=function(S,who,subs,objs,c){const a=subs.find(e=>e&&e.k==='t'&&alive(S,e));const was=objs.map(o=>o.k==='t'&&o.t&&!o.t.st.bound);const r=_bi.apply(this,arguments);
 if(a)objs.forEach((o,i)=>{if(was[i]&&o.k==='t'&&alive(S,o)&&o.t.st.bound){const n=Math.max(1,Math.ceil(MT(a.t)*.5));say(S,'The binding crushes: '+n+'.');damage(S,o,n,'bind');}});return r;};
if(W.bind)W.bind.gloss='Hold a thing still for a turn and squeeze it for half your might. A bound person has 2 less breath.';
const _st=startTurn;startTurn=function(S,i){const r=_st.apply(this,arguments);try{if(S.over==null&&S.things.some(t=>t.side===i&&t.w==='ink')){S.players[i].ink+=1;}}catch(e){}return r;};
})();
