/* v18: your deck. Seven starter decks, a deck builder with "Complete my deck", a market stocked by school, and rivals with school decks.
   Decks are 20 words, up to 3 schools, at most 2 of a word. The random deck stays as "Wild draw".
   Gated on DTV>=18. Load last. Saves its own key only (wa-dt18-deck); nothing else is touched. */
(function(){
'use strict';
if(!(window.DTV>=18))return;
const KEY='wa-dt18-deck',SIZE=20,MAXS=3,COPIES=2;
const STARTERS={fire:['fire','ember','ember','salamander','phoenix','naphtha','saltpetre','phosphorus','glass','smith','pitch','torch','torch','burn','burn','kindle','scorch','scorch','burning','drought'],
 water:['water','brine','brine','dew','ice','vitriol','quicksilver','elixir','otter','otter','eel','pike','toad','seep','seep','drench','wash','dissolve','sodden','rain'],
 air:['air','wind','owl','bat','bat','crow','wasp','magpie','locust','hawk','hawk','swallow','peacock','winged','winged','blow','steal','quick','storm','squall'],
 earth:['earth','lead','iron','iron','copper','salt','clay','lodestone','tower','boulder','boulder','obsidian','knife','flint','crush','crush','guard','guard','leaden','desert'],
 life:['seed','seed','oak','nettle','bramble','ivy','willow','stag','boar','wolf','wolf','hare','bear','grow','ripen','bite','bite','mend','crown','spring'],
 rot:['adder','adder','spider','scorpion','toadstool','nightshade','hemlock','shadow','rat','rat','spore','leech','ghost','toxify','toxify','venomous','haunt','plague','night','wither'],
 word:['scribe','scribe','word','word','bard','alchemist','hermit','unnamed','homunculus','silence','gnosis','miser','nemesis','scream','protect','enchant','lure','hermetic','eternal','strike']};
const SNAME={fire:'Kindling',water:'Tide',air:'High Air',earth:'Bulwark',life:'Grove and Pack',rot:'Slow Poison',word:'The Library'};
const SROUTE={fire:'Burn the rival directly',water:'Wash blockers away, then seep past',air:'Strike over the ground',earth:'Wall up, then crush through',life:'Outgrow and outlast',rot:'Poison, slowly',word:'Learn, then speak'};
const SCH=['fire','water','air','earth','life','rot','word'],SN={fire:'Fire',water:'Water',air:'Air',earth:'Earth',life:'Life',rot:'Rot',word:'The Word'};
const COL={fire:'#c8412b',water:'#2f6fa3',air:'#8fa3b8',earth:'#a8742a',life:'#4f8a3c',rot:'#6b4580',word:'#b8913a'};
const PARTNER={fire:['air','earth','rot'],water:['life','rot','word'],air:['fire','life','word'],earth:['fire','life','word'],life:['water','air','earth'],rot:['fire','water','word'],word:['water','air','earth','rot']};
const ROUTEW={fire:['scorch','burn','kindle','torch','bonfire','firebrand','wildfire','burning','naphtha','saltpetre','phosphorus'],water:['seep','wash','tide','drench','dissolve','sodden'],air:['winged','squall','blow','quick'],earth:['crush','guard','leaden','boulder'],life:['bite','grow','ripen','crown','stampede','feral'],rot:['toxify','venomous','poison','miasma','haunt','plague','pestilence'],word:['gnosis','scream','nemesis','silence','echo']};
window.DTV18STARTERS=STARTERS;
const sch=w=>{try{return w==='strike'?null:(SCHOOLOF[w]||schoolOf(w));}catch(e){return null;}};
const NO=['vessel','fuse','conjoin','be'];
const pool=()=>ALLWORDS.filter(w=>W[w]&&!W[w].token&&!NO.includes(w)&&!(window.DTVX7||[]).includes(w)&&!(window.TIER4||[]).includes(w));
function role(w){const d=W[w];if(!d)return 'support';const s=sch(w);if(s&&ROUTEW[s].includes(w))return 'route';if(d.t==='adj')return 'adjective';if(d.t==='clime')return 'ground';if(d.t==='noun'){const p=d.props||[];if(p.includes('ground'))return 'ground';if(p.includes('event')||p.includes('spell'))return 'support';return 'body';}return 'support';}
const RN={body:'Things that stand',route:'Its way to win',support:'Spells and helpers',adjective:'Adjectives',ground:'Ground and weather'};
const RS={body:'thing',route:'way to win',support:'spell or helper',adjective:'adjective',ground:'ground'};
function load(){try{return JSON.parse(localStorage.getItem(KEY)||'null')||{mode:'starter',starter:'fire',custom:[]};}catch(e){return {mode:'starter',starter:'fire',custom:[]};}}
function store(c){try{localStorage.setItem(KEY,JSON.stringify(c));}catch(e){}}
function check(d){const n={},ss=new Set();for(const w of d){n[w]=(n[w]||0)+1;const s=sch(w);if(s)ss.add(s);}const over=Object.keys(n).filter(w=>n[w]>COPIES);
  const why=d.length!==SIZE?(d.length<SIZE?'Add '+(SIZE-d.length)+' more':'Take out '+(d.length-SIZE)):ss.size>MAXS?'Up to '+MAXS+' schools':over.length?'At most '+COPIES+' of '+over[0]:'';return {ok:!why,why,schools:[...ss]};}
window.dtv18Check=check;
function myDeck(){const c=load();if(c.mode==='custom'&&check(c.custom).ok)return c.custom.slice();if(c.mode==='starter'&&STARTERS[c.starter])return STARTERS[c.starter].slice();return null;}
/* ---- "Complete my deck": fill by school, then role, then cost; show why ---- */
function complete(d0){const d=d0.slice(),why=[],have={};for(const w of d)have[w]=(have[w]||0)+1;
  let ss=[...new Set(d.map(sch).filter(Boolean))];if(!ss.length)ss=[SCH[Math.floor(Math.random()*7)]];
  if(ss.length===1){const p=PARTNER[ss[0]];ss.push(p[Math.floor(Math.random()*p.length)]);}
  ss=ss.slice(0,MAXS);const main=ss[0];const P=pool().filter(w=>ss.includes(sch(w))||w==='strike');
  const want={body:10,route:5,support:2,adjective:1,ground:2},cnt={body:0,route:0,support:0,adjective:0,ground:0};for(const w of d)cnt[role(w)]++;
  const fuses=w=>{let n=0;try{for(const x of d)if(W[x].t==='noun'&&W[w].t==='noun'&&window.dtvRx&&dtvRx(w,x))n++;}catch(e){}return n;};
  {const atk=ROUTEW[main].concat(['bite','crush','cut','sting','seep','strike']).find(v=>W[v]&&W[v].t==='verb'&&P.includes(v)&&!have[v]);if(atk&&!d.some(w=>W[w].t==='verb')&&d.length<SIZE){d.push(atk);have[atk]=1;cnt[role(atk)]++;why.push({w:atk,why:'a verb so your things can act'});}}
  let guard=0;while(d.length<SIZE&&guard++<200){const need=Object.keys(want).sort((a,b)=>(cnt[a]-want[a])-(cnt[b]-want[b]))[0];
    const bySch=w=>(sch(w)===main?3:1)+Math.random()*2;const costs={};for(const x of d){const c=W[x].syl||1;costs[c]=(costs[c]||0)+1;}
    const ev=w=>(W[w].props||[]).includes('event'),evN=d.filter(ev).length;
    const ok=w=>role(w)===need&&(have[w]||0)<(ev(w)?1:COPIES)&&!(ev(w)&&evN>=2)&&((costs[W[w].syl||1]||0)<SIZE*.4);
    const c=P.filter(ok).map(w=>({w,s:bySch(w)+Math.min(3,fuses(w))*.5+(W[w].t==='verb'?1:0)-Math.max(0,(W[w].syl||1)-2)*.8})).sort((a,b)=>b.s-a.s)[0];
    const pick=c?c.w:P.filter(w=>(have[w]||0)<COPIES).sort(()=>Math.random()-.5)[0];if(!pick)break;
    d.push(pick);have[pick]=(have[pick]||0)+1;const r=role(pick);cnt[r]++;const f=fuses(pick);
    why.push({w:pick,why:(r==='route'?SROUTE[sch(pick)]||'a way to win':r==='body'?(sch(pick)===main?'another '+SN[main]+' thing to stand':(/^[AEIOU]/.test(SN[sch(pick)]||'')?'an ':'a ')+(SN[sch(pick)]||'')+' thing for the partner school'):r==='ground'?'ground or weather for '+(SN[sch(pick)]||'your school'):r==='adjective'?'an adjective for your things':'a spell or helper')+(f?' · fuses with '+f+' of your words':'')});}
  return {deck:d,why};}
window.dtv18Complete=complete;
/* ---- decks in the duel: yours, and a school deck for the rival ---- */
const _dd=window.dtvDeck;window.dtvDeck=function(d,me){if(window.DTVMAIN||window.SIMRUN)return _dd(d,me);
  if(me===1){const m=myDeck();if(m){window.DTVRAND=m;return m.slice();}return _dd(d,me);}
  if(me===2){const k=SCH[Math.floor(Math.random()*7)];window.DTVRIVAL=STARTERS[k].slice();window.DTV18RIVAL=k;return STARTERS[k].slice();}
  return _dd(d,me);};
/* ---- the market follows the decks: 40% your schools, 40% the rival's, 20% the rest ---- */
const _ng=newGame;newGame=function(seed,o){const S=_ng.apply(this,arguments);try{if(!S||!S.supply||!S.supply.length||!o)return S;
  const sA=new Set((o.deck||[]).map(sch).filter(Boolean)),sB=new Set((o.rivalDeck||[]).map(sch).filter(Boolean));if(!sA.size&&!sB.size)return S;
  const all=S.shop.concat(S.supply),gA=[],gB=[],gC=[];for(const w of all){const s=sch(w);(sA.has(s)?gA:sB.has(s)?gB:gC).push(w);}
  const out=[];const take=g=>g.length?g.splice(Math.floor(Math.random()*g.length),1)[0]:null;
  while(gA.length||gB.length||gC.length){const r=Math.random();let w=r<.4?take(gA):r<.8?take(gB):take(gC);if(w==null)w=take(gA)||take(gB)||take(gC);out.push(w);}
  S.shop=[];S.supply=out;refillShop(S);S.mkt18=1;}catch(e){console.error(e);}return S;};
/* ---- the lobby: choose a deck ---- */
function deckLine(d){const n={};for(const w of d){const s=sch(w);if(s)n[s]=(n[s]||0)+1;}return SCH.filter(s=>n[s]).map(s=>'<i style="background:'+COL[s]+';flex:'+n[s]+'" title="'+SN[s]+': '+n[s]+'"></i>').join('');}
function lobby(){try{const old=[...document.querySelectorAll('#view-lobby *')].find(e=>e.children.length<=3&&/^Your deck: /.test(e.textContent.trim())&&!e.closest('.d18'));if(old){let box=old;while(box.parentElement&&box.parentElement.children.length===1&&!box.parentElement.querySelector('.d18,.dtvp'))box=box.parentElement;if(!box.querySelector('.d18,.dtvp,button'))box.style.display=load().mode==='wild'?'':'none';}}catch(e){}
  const l=document.querySelector('#view-lobby .home.lobby > div, #view-match .home.lobby > div');if(!l)return;let e=l.querySelector('.d18');
  const c=load(),h='<b>Your deck</b><div class="d18g">'+SCH.map(s=>'<button data-d18="st:'+s+'" class="'+(c.mode==='starter'&&c.starter===s?'on':'')+'" style="--c:'+COL[s]+'"><span>'+SNAME[s]+'</span><small>'+SN[s]+' · '+SROUTE[s]+'</small></button>').join('')
   +'<button data-d18="wild" class="'+(c.mode==='wild'?'on':'')+'"><span>Wild draw</span><small>A random deck every duel</small></button>'
   +'<button data-d18="custom" class="'+(c.mode==='custom'?'on':'')+'"><span>My deck</span><small>'+(check(c.custom||[]).ok?'20 words · '+check(c.custom).schools.map(s=>SN[s]).join(', '):'Build your own: 20 words, up to 3 schools')+'</small></button></div>'
   +(myDeck()?'<div class="d18bar">'+deckLine(myDeck())+'</div>':'')+'<button class="d18edit" data-d18="edit">Open the deck builder</button>';
  if(!e){e=document.createElement('div');e.className='d18';l.appendChild(e);}if(e._h!==h){e.innerHTML=h;e._h=h;}}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-d18]');if(!b)return;ev.preventDefault();ev.stopPropagation();const c=load(),v=b.dataset.d18;
  if(v.startsWith('st:')){c.mode='starter';c.starter=v.slice(3);}else if(v==='wild')c.mode='wild';else if(v==='custom'){if(check(c.custom||[]).ok)c.mode='custom';else{store(c);openB();return;}}else if(v==='edit'){openB();return;}
  store(c);try{sfx('tick');}catch(e){}lobby();},true);
/* ---- the deck builder ---- */
let B=null;
function openB(){const c=load();B={deck:(c.custom&&c.custom.length?c.custom:(STARTERS[c.starter]||[])).slice(),f:null,q:'',why:{}};drawB();}
function closeB(){const e=document.getElementById('b18');if(e)e.remove();B=null;}
function drawB(){let e=document.getElementById('b18');if(!B){if(e)e.remove();return;}if(!e){e=document.createElement('div');e.id='b18';document.body.appendChild(e);}
  const P=pool().filter(w=>(!B.f||sch(w)===B.f||(B.f==='plain'&&!sch(w)))&&(!B.q||w.includes(B.q))).sort((a,b)=>(SCH.indexOf(sch(a))-SCH.indexOf(sch(b)))||a.localeCompare(b));
  const n={};for(const w of B.deck)n[w]=(n[w]||0)+1;const ck=check(B.deck);
  const byRole={};for(const w of B.deck)(byRole[role(w)]=byRole[role(w)]||[]).push(w);
  const tag=w=>{const s=sch(w);return '<i class="b18s" style="background:'+(s?COL[s]:'#777')+'"></i>';};
  e.innerHTML='<div class="b18c" role="dialog" aria-modal="true" aria-labelledby="b18h"><header><h3 id="b18h">Deck builder</h3><p>20 words from up to 3 schools, at most 2 of a word. Made words never go in a deck: you make them by fusing.</p><button class="b18x" data-b18="close" aria-label="Close">✕</button></header>'
   +'<div class="b18cols"><section class="b18pool"><div class="b18f">'+['all'].concat(SCH).concat(['plain']).map(s=>'<button data-b18="f:'+s+'" class="'+((B.f||'all')===s?'on':'')+'"'+(COL[s]?' style="--c:'+COL[s]+'"':'')+'>'+(s==='all'?'All':s==='plain'?'Plain':SN[s])+'</button>').join('')+'<input data-b18="q" placeholder="Find a word" value="'+esc(B.q)+'" aria-label="Find a word"></div>'
   +'<div class="b18list">'+P.map(w=>'<button data-b18="add:'+esc(w)+'" class="b18w'+((n[w]||0)>=COPIES?' full':'')+'" data-pv="'+esc(w)+'">'+tag(w)+'<b>'+esc(w)+'</b><small>'+(W[w].syl||1)+' · '+RS[role(w)]+'</small>'+(n[w]?'<em>×'+n[w]+'</em>':'')+'</button>').join('')+'</div></section>'
   +'<section class="b18deck"><div class="d18bar big">'+deckLine(B.deck)+'</div><p class="b18n'+(ck.ok?' ok':'')+'">'+B.deck.length+' of 20'+(ck.why?' · '+esc(ck.why):' · ready')+(ck.schools.length?' · '+ck.schools.map(s=>SN[s]).join(', '):'')+'</p>'
   +Object.keys(RN).map(r=>byRole[r]?'<h4>'+RN[r]+' ('+byRole[r].length+')</h4><div>'+[...new Set(byRole[r])].map(w=>'<button data-b18="rm:'+esc(w)+'" class="b18d" data-pv="'+esc(w)+'" title="'+esc(B.why[w]||'Tap to take one out')+'">'+tag(w)+esc(w)+(n[w]>1?' ×'+n[w]:'')+(B.why[w]?'<small>'+esc(B.why[w])+'</small>':'')+'</button>').join('')+'</div>':'').join('')
   +'<div class="b18b"><button class="b18btn main" data-b18="complete">Complete my deck</button><button class="b18btn" data-b18="clear">Clear</button>'
   +'<button class="b18btn" data-b18="copy">Copy a starter</button><button class="b18btn main" data-b18="save"'+(ck.ok?'':' disabled')+'>Use this deck</button></div></section></div></div>';}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('#b18 [data-b18]');if(!b||!B)return;const v=b.dataset.b18;if(v==='q')return;ev.preventDefault();ev.stopPropagation();
  if(v==='close'){closeB();return;}
  if(v.startsWith('f:')){B.f=v.slice(2)==='all'?null:v.slice(2);}
  else if(v.startsWith('add:')){const w=v.slice(4),n=B.deck.filter(x=>x===w).length;if(n<COPIES&&B.deck.length<SIZE){const t=B.deck.concat([w]);if(check(t).schools.length<=MAXS)B.deck.push(w);}}
  else if(v.startsWith('rm:')){const i=B.deck.lastIndexOf(v.slice(3));if(i>=0)B.deck.splice(i,1);delete B.why[v.slice(3)];}
  else if(v==='complete'){const r=complete(B.deck);B.deck=r.deck;for(const x of r.why)B.why[x.w]=x.why;}
  else if(v==='clear'){B.deck=[];B.why={};}
  else if(v==='copy'){const c=load();B.deck=(STARTERS[c.starter]||STARTERS.fire).slice();B.why={};}
  else if(v==='save'){if(!check(B.deck).ok)return;const c=load();c.custom=B.deck.slice();c.mode='custom';store(c);closeB();try{lobby();}catch(x){}return;}
  try{sfx('tick');}catch(x){}drawB();},true);
document.addEventListener('input',ev=>{if(ev.target&&ev.target.matches&&ev.target.matches('#b18 [data-b18=q]')&&B){B.q=ev.target.value.trim().toLowerCase();const pos=ev.target.selectionStart;drawB();const i=document.querySelector('#b18 [data-b18=q]');if(i){i.focus();i.setSelectionRange(pos,pos);}}});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape'&&B)closeB();});
setInterval(()=>{try{lobby();const t=document.querySelector('.r15');if(t&&window.DTV18RIVAL&&!t.querySelector('.r18')){t.insertAdjacentHTML('beforeend','<span class="r18">Deck: '+SNAME[DTV18RIVAL]+' ('+SN[DTV18RIVAL]+')</span>');}}catch(e){}},500);
const css=document.createElement('style');css.textContent=
 '.d18{margin-top:14px;max-width:520px;background:rgba(9,7,5,.84);border:1px solid rgba(230,196,94,.45);border-radius:12px;padding:12px 14px;color:#f3e4c2}.d18>b{font:600 12px/1 Cinzel,serif;letter-spacing:.12em;text-transform:uppercase;color:#e8c987}'
+'.d18g{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-top:8px}.d18g button{text-align:left;background:#1c150f;border:1px solid #5a4528;border-left:4px solid var(--c,#8a7a5a);border-radius:6px;color:#f3e6c8;padding:6px 8px;cursor:pointer}'
+'.d18g button span{display:block;font:600 14px/1.2 "IM Fell English",Georgia,serif}.d18g button small{display:block;font-size:11.5px;line-height:1.25;color:#d9c79f;margin-top:2px}.d18g button.on{background:#3a2712;border-color:#e8c987;box-shadow:0 0 0 1px #e8c987 inset}'
+'.d18bar{display:flex;height:8px;border-radius:4px;overflow:hidden;margin-top:10px;background:#2a2118}.d18bar i{display:block}.d18bar.big{height:12px;margin:0 0 6px}'
+'.d18edit{margin-top:10px;background:none;border:1px solid #8a6a34;color:#f1d48a;border-radius:6px;padding:6px 12px;font:600 13px/1 Cinzel,serif;cursor:pointer}'
+'#b18{position:fixed;inset:0;z-index:9100;background:rgba(6,4,2,.78);display:flex;align-items:center;justify-content:center}.b18c{width:min(1180px,96vw);height:min(820px,94vh);background:#17110c;border:1px solid #b08a45;border-radius:10px;color:#f3e6c8;display:flex;flex-direction:column;padding:16px 18px}'
+'.b18c header{position:relative}.b18c h3{font:600 22px/1.2 Cinzel,serif;color:#f1d48a;margin:0}.b18c header p{margin:4px 0 10px;font-size:14px;color:#e6d6b0}.b18x{position:absolute;right:0;top:0;background:none;border:0;color:#f3e6c8;font-size:20px;cursor:pointer}'
+'.b18cols{display:grid;grid-template-columns:1.35fr 1fr;gap:16px;flex:1;min-height:0}.b18pool,.b18deck{display:flex;flex-direction:column;min-height:0}.b18deck{overflow:auto}'
+'.b18f{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px}.b18f button{background:#241a12;border:1px solid #5a4528;border-bottom:3px solid var(--c,#8a7a5a);color:#f3e6c8;border-radius:4px;padding:4px 8px;font-size:13px;cursor:pointer}.b18f button.on{background:#4a3416;border-color:#e8c987}'
+'.b18f input{flex:1;min-width:120px;background:#0f0b08;border:1px solid #5a4528;color:#f3e6c8;border-radius:4px;padding:4px 8px;font-size:13px}'
+'.b18list{overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:4px;align-content:start}'
+'.b18w{position:relative;display:flex;align-items:center;gap:6px;text-align:left;background:#211811;border:1px solid #4a3a24;border-radius:5px;color:#f3e6c8;padding:5px 7px;cursor:pointer}.b18w b{font:600 14px/1.1 "IM Fell English",Georgia,serif;flex:1}.b18w small{font-size:11px;color:#cdb98f}.b18w em{position:absolute;right:4px;top:2px;font-size:11px;font-style:normal;color:#f1d48a}.b18w.full{opacity:.5}'
+'.b18s{display:inline-block;width:8px;height:8px;border-radius:50%;flex:none}.b18n{font-size:14px;margin:0 0 6px;color:#f1a98c}.b18n.ok{color:#bfe3a4}.b18deck h4{margin:10px 0 4px;font:600 12px/1 Cinzel,serif;letter-spacing:.08em;color:#e8c987;text-transform:uppercase}'
+'.b18d{display:inline-flex;flex-direction:column;align-items:flex-start;gap:1px;margin:2px;background:#241a12;border:1px solid #5a4528;border-radius:5px;color:#f3e6c8;padding:4px 8px;font:14px/1.2 "IM Fell English",Georgia,serif;cursor:pointer;text-align:left}.b18d small{font:11.5px/1.25 Georgia,serif;color:#d9c79f;max-width:260px}'
+'.b18d .b18s{margin-right:5px}.b18b{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;position:sticky;bottom:0;background:#17110c;padding-top:6px}.r18{display:block;margin-top:2px;color:#e8c987}'
+'.b18btn{background:#241a12;border:1px solid #8a6a34;color:#f3e6c8;border-radius:6px;padding:8px 14px;font:600 14px/1 Cinzel,serif;cursor:pointer}.b18btn.main{background:#5a3d12;border-color:#e8c987;color:#fff4d6}.b18btn:disabled{opacity:.45;cursor:default}';
(document.head||document.documentElement).appendChild(css);
})();
