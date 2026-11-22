/* Duel test versions, one change at a time on top of the live game.
   v0 live game · v1 + one row of five, weather and caption between · v2 + fusion on the row · v3 + first-player rule */
(function(){
'use strict';
const V=window.DTV|0;
const NAMES=['v0 · the live game','v1 · one row of five','v2 · + fusion on the row','v3 · + who goes first','v4 · lab board, one win, fusing for breath','v5 · + the fusion web v2.1','v6 · + the new board layout','v7 · + simpler rules','v8 · + the verbs round','v9 · + the colour pie','v10 · + might and vigour','v11 · + balanced by simulation','v12 · + strike and stand'];
const DESC=['The live game, unchanged.','The board as one row of five a side, with the weather and a live caption between. No places.','Drag one of your things onto another of yours to fuse them, once a turn, if they react. Costs 1 breath (2 for a potent result, 3 for a great one); breath in the well pays first.','A coin decides who goes first. The second player gets +1 breath on their first turn, +2 in the well and one extra card.','The Duel Lab board. The only way to win is to bring the rival to 0 life. No vessel, fuse or conjoin cards: put two cards from your hand in the fusion panel and fuse them for breath (or drag one of your things onto another). One fusion a turn.','The fusion web v2.1 replaces the old reactions: about 18,500 pairs, 65 new cards (dragons, gnomes, sylphs, the Rebis and the rest), traits such as rooted or haunted, and catalysts: some pairs make something greater when the right weather is up or the right thing stands on your row. Fusion costs 1 breath for a rare result, 2 potent, 3 Great, 4 Wonder. A thing made from something already on the table can act at once. Owl and crow make an eagle. Fleeting things (spores) cannot step in front of an attack.','The board mock-up layout: rails left, rows in the centre with Sky, sentence and Market between, one Ground per side, hand along the bottom, Chronicle, fuse and End turn on the right. The market opens any time in your turn; End turn goes straight to the rival.','Simpler rules: unspent breath carries over (no well); a sentence that would not work cannot be spoken; no opposites, ruin, curse, retorts or hidden bonuses; potent is a third more harm; one action per thing per turn; alchemy colours are flavour only; no laws, claim or rune; categories are beasts, birds, metals and plants.','Verbs simplified: amounts are percentages; bite, crush and cut +30%, sting +50%; seep (liquids, unblockable); toxify spreads; drench, dissolve, haunt, eat, scream reworked; guard 30% stronger; spell-like verbs are spells; summon and sacrifice; protect and dispel; transmute climbs 12 ladders.','Schools are colours: a sigil on every card. The Word is emptied into the six. Each weather raises one school 20% and lowers its opposite 20%. Ladders: evolve a thing for breath (1, then 2, then 3…); the transmute card is gone. A word of a thing’s own school is 20% stronger; of the opposite school, 20% weaker.','Things have two numbers: might (how hard they hit) and vigour (how much they can take). The split follows what the thing is: a knife is all edge, an oak all endurance. Hurt things hit softer.','Tuned from 6,000 simulated duels: vast, eat, ferment and obsidian toned down; The Word and Water lifted (word, silence, omen, dream, ink, eternal, protect, lure, and sturdier liquids).','Might is now strike (how hard a thing hits) and vigour is now stand (how much it can take before it falls). Strike sits bottom left, stand bottom right. Names and places only: the game plays exactly as v11.'];
window.DTVNAME=NAMES[V]||('v'+V);
/* ---- v5: the fusion web v2.1 ---- */
const WEB=window.WEB21||null;window.DTVSIDE=0;
if(V>=5&&WEB){
  for(const w in WEB.NEW){if(W[w])continue;const n=WEB.NEW[w];W[w]={t:NOUN,o:'X',syl:n[2]||2,vig:n[0]||3,props:String(n[1]||'').split(' ').filter(Boolean),gloss:n[4]||'',token:true};}
  if(!W.eagle)W.eagle={t:NOUN,o:'OE',syl:2,vig:6,props:['beast','bird','living','flying','keen','sharp'],gloss:'Owl and crow made one: the king of the high air. Sees what is hidden and strikes from above.',token:true};
  WEB.base['crow|owl']=['eagle',3,'named pair',''];WEB.cards.eagle={sch:'air',tier:3,asp:['bird','beast'],t:'noun'};
  for(const w in WEB.cards){const c=WEB.cards[w];if(!W[w])continue;if(c.sch)SCHOOLOF[w]=c.sch;const t=c.tier;if(t>=4&&!TIER4.includes(w))TIER4.push(w);else if(t===3&&!TIER3.includes(w)&&!TIER4.includes(w))TIER3.push(w);}
}
const TRN=w=>w;
window.dtvRx=function(a,b){if(!WEB)return null;const k=[a,b].sort().join('|'),side=window.DTVSIDE|0;
  const mine=(typeof S!=='undefined'&&S)?S.things.filter(t=>t.side===side):[];
  for(const c of (WEB.cat[k]||[])){const cond=c[0];let ok=false;
    if(cond[0]==='#')ok=!!(S&&S.clime&&S.clime.w===cond.slice(1));else if(cond[0]==='@')ok=mine.some(t=>t.props.includes(cond.slice(1))||(t.forms||[]).includes(cond.slice(1)));else ok=mine.some(t=>t.w===cond);
    if(ok&&W[c[1]])return {a,b,r:c[1],tier:c[2],layer:c[3],trait:c[4]||'',cat:cond};}
  const v=WEB.base[k];if(!v||!W[v[0]])return null;return {a,b,r:v[0],tier:v[1],layer:v[2],trait:v[3]||''};};
/* traits and abilities carry through every fusion: fireborn crow + toad = fireborn winged toad, and it still feeds on the dead */
const KINDP=['beast','bird','plant','herb','wood','metal','stone','liquid','spirit','human','element','concept','living','minded','voiced','mortal','flesh','ground','spell','fleeting','dead','remains','event','potion','insect','serpent','fish','sprout','seed','ice','ember','spark'];
window.dtvIn=function(who,refs){return refs.map(r=>{if(r.k==='thing'){const t=findThing(S,r.id);return t?{w:t.w,board:true,ready:!t.fresh&&!t.acted&&!t.nonAtk&&!isG(t),traits:(t.traits||[]).slice(),props:t.props.slice()}:null;}const w=S.players[who].hand[r.i];return w&&W[w]?{w,traits:[],props:(W[w].props||[]).slice()}:null;}).filter(Boolean);};
window.dtvTrait=function(bs,x,ins){if(V<5||!x)return;const t=S.things.find(q=>!bs.things[q.id]&&q.w===x.r);if(!t)return;
  const tr=[];for(const q of ins||[])for(const k of q.traits)if(!tr.includes(k))tr.push(k);if(x.trait&&x.trait!=='grown'&&!tr.includes(x.trait))tr.push(x.trait);
  t.traits=tr;if(tr.length)t.title=tr.join(' ')+' '+t.w;
  const got=[];for(const q of ins||[])for(const p of q.props)if(!KINDP.includes(p)&&!t.props.includes(p)){t.props.push(p);got.push(q.w+':'+p);}
  t.inh=(t.inh||[]).concat(got);
  /* made from something already on the table: it has not just arrived, and can act at once */
  if((ins||[]).some(q=>q.board)){t.fresh=V>=8&&!(ins||[]).some(q=>q.ready)?1:0;t.acted=false;if(bodyStrikes(t.props)&&!t.verbs.includes('strike')){t.verbs.unshift('strike');}t.inn=1;}};
window.dtvDeck=function(d,me){if(me===1)window.DTVRAND=null;if(V>=6&&me){const r=dtvRand();if(me===1)window.DTVRAND=r;else window.DTVRIVAL=r;return r;}return V>=4?d.filter(w=>!['vessel','fuse','conjoin'].includes(w)):d;};
/* v6: a fresh random deck every duel, built to a shape so it can always fight */
function dtvRand(){const NO=['vessel','fuse','conjoin','be'],P=w=>W[w].props||[],ok=w=>W[w]&&!W[w].token&&!NO.includes(w),T=w=>tierOf(w);
  const all=ALLWORDS.filter(w=>ok(w)&&!(V>=7&&DTVX7.includes(w))),pk=(arr,n,out)=>{arr=arr.filter(w=>!out.includes(w));for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];}return arr.slice(0,n);};
  const noun=w=>W[w].t===NOUN&&!P(w).includes('ground')&&!P(w).includes('spell'),fighter=w=>V>=8?(noun(w)&&['beast','human','heavy','sharp','fireborn'].some(k=>P(w).includes(k))&&!P(w).includes('herb')&&!P(w).includes('event')&&W[w].vig>=5&&T(w)<=3):(noun(w)&&(P(w).includes('beast')||P(w).includes('human'))&&T(w)<=2);
  const d=[];const add=a=>{for(const w of a)d.push(w);};
  add(pk(all.filter(fighter),2,d));
  add(pk(all.filter(w=>noun(w)&&T(w)<=2),2,d));
  add(pk(all.filter(w=>noun(w)&&T(w)===3),1,d));
  add(pk(all.filter(w=>W[w].t===NOUN&&P(w).includes('ground')&&T(w)===1),2,d));
  {const sp=Math.random()<.5;add(pk(all.filter(w=>sp?(W[w].t===NOUN&&P(w).includes('spell')&&T(w)<=2):(W[w].t==='clime'&&T(w)<=2)),1,d));}
  add(pk(['strike','bite','crush','sting','cut','poison','seep'].filter(w=>all.includes(w)),1,d));
  add(pk(all.filter(w=>W[w].t===VERB&&T(w)<=2),2,d));
  add(pk(all.filter(w=>W[w].t===ADJ&&T(w)<=2),2,d));
  add(pk(['mend'].concat(all.filter(w=>(W[w].t===NOUN||W[w].t===VERB)&&T(w)<=2)),1,d));
  return d;}


/* ---- version picker on the duelling bench, and the corner tag ---- */
function picker(){const l=document.querySelector('#view-lobby .home.lobby > div, #view-match .home.lobby > div');if(!l||l.querySelector('.dtvp'))return;
  const d=document.createElement('div');d.className='dtvp';
  d.innerHTML='<b>Test version</b>'+NAMES.map((n,i)=>'<button data-dtv="'+i+'"'+(i===V?' class="on"':'')+'>'+n+'</button>').join('')+'<p>'+DESC[V]+(V>1?' Includes everything in the earlier versions.':'')+'</p>';
  l.appendChild(d);d.querySelectorAll('button').forEach(b=>b.onclick=ev=>{ev.stopPropagation();try{localStorage.setItem('wa-duel-test-ver',b.dataset.dtv);}catch(e){}location.reload();});}
setInterval(()=>{try{picker();const t=document.getElementById('dtv');if(t)t.textContent='Duel test · '+NAMES[V];}catch(e){}},500);

/* ---- v1: one row of five with sockets, the caption in the middle band ---- */
window.dtvRow=function(f,extra,mine){let h=f.map(thingHtml).join('')+(extra||'');const n=f.length+(extra?1:0);for(let k=n;k<MAXFIELD;k++)h+='<i class="sock" aria-hidden="true"></i>';return h;};
window.dtvCap=function(){const L=(S.log||[]).filter(l=>l.k!=='t'&&l.x&&!/^(Your turn|The rival’s turn)/.test(l.x));const x=L.length?L[L.length-1].x:'';return '<span class="dcap">'+esc(x.replace(/^(You say|The rival says): /,''))+'</span>';};

/* ---- v2: fusion on the row ---- */
const fzCost=w=>{const t=tierOf(w);return t>=4?3:t===3?2:1;};
function fzOk(S,who,a,b){if(!a||!b||a===b||a.side!==who||b.side!==who)return null;window.DTVSIDE=who;const x=rxOf(a.w,b.w);if(!x||!x.r)return null;
  const p=S.players[who],c=fzCost(x.r);if(S.fz&&S.fz[who]===S.turn)return null;if((p.ink||0)+(p.well||0)<c)return null;return {x,c};}
function fzPay(S,who,c){const p=S.players[who],k=Math.min(p.well||0,c);p.well-=k;p.ink-=c-k;}
function fzDo(who,a,b){const q=fzOk(S,who,a,b);if(!q)return false;
  const bs=snap(),logN=S.log.length;S.fz=S.fz||[0,0];S.fz[who]=S.turn;fzPay(S,who,q.c);
  say(S,(who===0?'You fuse ':'The rival fuses ')+a.w+' and '+b.w+'.','s');
  window.DTVSIDE=who;const xx=rxOf(a.w,b.w),ins=dtvIn(who,[{k:'thing',id:a.id},{k:'thing',id:b.id}]);react(S,who,{subj:{k:'thing',id:a.id},obj:{k:'thing',id:b.id}},{mult:1,effect:false});dtvTrait(bs,xx,ins);settleS(S);checkOver(S);
  if(S.found&&S.found.length){PF.found=PF.found||{};for(const k of S.found)if(!PF.found[k]){PF.found[k]=1;setTimeout(()=>multBanner('',['New reaction found']),150);}S.found=[];}
  render();effects(bs,logN,false,false);const nt=S.things.find(t=>!bs.things[t.id]),el=nt&&elThing(nt.id);if(el)rxBurst(el.getBoundingClientRect());
  try{keepMatch();}catch(e){}return true;}
window.dtvRivalFuse=function(){if(V<2)return false;const mine=S.things.filter(t=>t.side===1);let best=null;
  for(let i=0;i<mine.length;i++)for(let j=i+1;j<mine.length;j++){const q=fzOk(S,1,mine[i],mine[j]);if(!q)continue;const gain=(W[q.x.r]&&W[q.x.r].vig||0)-(mine[i].vig+mine[j].vig)/2+tierOf(q.x.r);if(!best||gain>best.g)best={a:mine[i],b:mine[j],g:gain};}
  if(!best||best.g<0)return false;sayBanner((S.rival?S.rival.n.split(' ')[0]:'The rival')+' fuses',best.a.w+' and '+best.b.w);setTimeout(hideBanner,1100);return fzDo(1,best.a,best.b);};
let dz=null;
document.addEventListener('pointerdown',e=>{if(V<2||e.button||typeof S==='undefined'||!S||S.phase!=='play'||S.active!==0||busy)return;const t=e.target.closest&&e.target.closest('#you .thing[data-id]');if(!t)return;
  const a=findThing(S,+t.dataset.id);if(!a)return;dz={a,el:t,x:e.clientX,y:e.clientY,moved:false,g:null};},true);
addEventListener('pointermove',e=>{if(!dz)return;if(!dz.moved&&Math.hypot(e.clientX-dz.x,e.clientY-dz.y)>9){dz.moved=true;
    const g=dz.el.cloneNode(true);g.id='dfzg';document.body.appendChild(g);dz.g=g;dz.el.style.opacity='.35';
    let any=false;document.querySelectorAll('#you .thing[data-id]').forEach(o=>{const b=findThing(S,+o.dataset.id);if(fzOk(S,0,dz.a,b)){o.classList.add('dfz');any=true;}});
    if(!any)ui.msg=S.fz&&S.fz[0]===S.turn?'You have already fused this turn.':'Nothing on your row reacts with '+dz.a.w+(rxAny(dz.a)?' that you can afford':'')+'.';}
  if(dz.moved){dz.g.style.left=e.clientX+'px';dz.g.style.top=e.clientY+'px';}});
function rxAny(a){return S.things.some(t=>t.side===0&&t!==a&&rxOf(a.w,t.w));}
addEventListener('pointerup',e=>{if(!dz)return;const d=dz;dz=null;if(d.g)d.g.remove();d.el.style.opacity='';document.querySelectorAll('.dfz').forEach(o=>o.classList.remove('dfz'));
  if(!d.moved)return;e.stopPropagation();swallowClick();
  d.g&&(d.g.style.display='none');const o=document.elementFromPoint(e.clientX,e.clientY),tt=o&&o.closest&&o.closest('#you .thing[data-id]');
  if(tt){const b=findThing(S,+tt.dataset.id);if(!fzDo(0,d.a,b)){sfx('nope');render();}}else if(V>=4&&o&&o.closest&&o.closest('#dfz')){if(fzLeft(0)&&typeof vatAdd==='function'&&vatAdd({k:'thing',id:d.a.id,w:d.a.w}))sfx('page');else sfx('nope');render();}else render();},true);
function swallowClick(){const f=ev=>{ev.stopPropagation();ev.preventDefault();removeEventListener('click',f,true);};addEventListener('click',f,true);setTimeout(()=>removeEventListener('click',f,true),300);}

/* ---- v4: the fusion panel: two cards from the hand fuse for breath ---- */
function vatCost(a,b){const x=rxOf(a,b);return x&&x.r?rxLevel(a,b,x):0;}
function fzLeft(who){return !(S.fz&&S.fz[who]===S.turn);}
function canPay(who,c){const p=S.players[who];return (p.ink||0)+(p.well||0)>=c;}
const refW=(who,r)=>r.k==='card'?S.players[who].hand[r.i]:((findThing(S,r.id)||{}).w);
const refOk=(who,r)=>r&&(r.k==='card'?S.players[who].hand[r.i]===r.w:(()=>{const t=findThing(S,r.id);return !!t&&t.side===who&&t.w===r.w;})());
const sameRef=(a,b)=>a.k===b.k&&(a.k==='card'?a.i===b.i:a.id===b.id);
function vatFire(who,ra,rb){window.DTVSIDE=who;const p=S.players[who],a=refW(who,ra),b=refW(who,rb),x=a&&b?rxOf(a,b):null;if(!x||!x.r||!fzLeft(who))return false;const c=rxLevel(a,b,x);if(!canPay(who,c))return false;
  const bs=snap(),logN=S.log.length;S.fz=S.fz||[0,0];S.fz[who]=S.turn;fzPay(S,who,c);
  say(S,(who===0?'You fuse ':'The rival fuses ')+a+' and '+b+' for '+c+' breath.','s');
  const R=r=>r.k==='card'?{k:'card',i:r.i}:{k:'thing',id:r.id};
  const ins=dtvIn(who,[ra,rb]);react(S,who,{subj:R(ra),obj:R(rb)},{mult:1,effect:false});dtvTrait(bs,x,ins);settleS(S);checkOver(S);
  if(S.found&&S.found.length){PF.found=PF.found||{};for(const k of S.found)if(!PF.found[k]){PF.found[k]=1;setTimeout(()=>multBanner('',['New reaction found']),150);}S.found=[];}
  render();effects(bs,logN,false,false);const nt=S.things.find(t=>!bs.things[t.id]),el=nt&&elThing(nt.id);rxBurst((el||document.getElementById('dfz')||document.body).getBoundingClientRect());try{keepMatch();}catch(e){}return true;}
function previewName(vat,r){const tr=[];for(const q of vat){if(q.k==='thing'){const t=findThing(S,q.id);for(const k of (t&&t.traits)||[])if(!tr.includes(k))tr.push(k);}}if(r.trait&&r.trait!=='grown'&&!tr.includes(r.trait))tr.push(r.trait);return tr.length?tr.join(' ')+' ':'';}
function candRef(){const p=S.players[0],s=ui.subj;if(!s)return null;
  if(s.k==='card'){const w=p.hand[s.i];return w&&W[w]&&W[w].t===NOUN&&!isEvent(w)?{k:'card',i:s.i,w}:{bad:w};}
  if(s.k==='thing'){const t=findThing(S,s.id);return t&&t.side===0?{k:'thing',id:t.id,w:t.w}:null;}return null;}
function vatAdd(r){const p=S.players[0];p.vat=p.vat||[];if(!r||r.bad||p.vat.length>=2||p.vat.some(q=>sameRef(q,r)))return false;p.vat.push(r);return true;}
function inhChips(){if(V<5)return;for(const t of S.things){if(!t.inh||!t.inh.length)continue;const el=document.querySelector('.thing[data-id="'+t.id+'"] .states');if(!el||el.querySelector('.dinh'))continue;const by={};for(const g of t.inh){const [w,p]=g.split(':');(by[w]=by[w]||[]).push(p);}for(const w in by){const i=document.createElement('i');i.className='good dinh';i.title='Kept from '+w+': '+by[w].join(', ');i.textContent='from '+w;el.appendChild(i);}}}
window.dtvPanel=function(){if(V<4)return;try{inhChips();}catch(e){}try{const bn=document.getElementById('bench');if(bn)bn.classList.toggle('dempty',!(ui.subj||ui.obj||ui.verb!=null||ui.kverb||(ui.adjs&&ui.adjs.length)||ui.clime!=null||ui.msg));}catch(e){}
  const tb=document.getElementById('table');if(!tb)return;let e=document.getElementById('dfz');
  if(!S||view!=='match'||!S.live||S.over!=null){if(e)e.remove();return;}
  if(!e){e=document.createElement('div');e.id='dfz';tb.appendChild(e);}
  const p=S.players[0];p.vat=(p.vat||[]).filter(r=>r&&r.k&&refOk(0,r));const v=p.vat.map(r=>r.w),play=S.phase==='play'&&S.active===0;
  const cand=play?candRef():null,canPut=!!(cand&&!cand.bad&&p.vat.length<2&&!p.vat.some(q=>sameRef(q,cand)));
  if(S.vatArm!=null&&canPut){vatAdd(cand);S.vatArm=null;clearUi();sfx('page');setTimeout(render,0);return;}
  window.DTVSIDE=0;const r=v.length===2?rxOf(v[0],v[1]):null,pw=r&&r.r,cost=r?rxLevel(v[0],v[1],r):0,ok=!!pw&&play&&fzLeft(0)&&canPay(0,cost),have=(p.ink||0)+(p.well||0);
  const rvig=q=>{if(!q)return 0;if(q.k==='thing'){const t=findThing(S,q.id);return t?t.vig:0;}const w=p.hand[q.i];return W[w]?W[w].vig+2*upOf(S,0,w):0;},rface=q=>{if(q&&q.k==='thing'){const t=findThing(S,q.id);if(t)return miniFace(t.w,{vig:t.vig,title:t.title||null});}return miniFace(q.w,{vig:rvig(q)});};
  const outV=pw&&W[pw]?(()=>{let x=Math.max(W[pw].vig,rvig(p.vat[0])+rvig(p.vat[1]));const gp=(W[pw].props||[]).includes('ground');if(S.cfg&&S.cfg.gw2&&(!gp||!['fire','water','earth','air','wind'].includes(pw)))x=Math.max(1,x+MADEPLUS);return x;})():null;
  const sock=k=>'<button class="fz-sock'+(v[k]?' on':'')+(S.vatArm===k?' arm':'')+'" data-d="vput"'+(play&&fzLeft(0)?'':' disabled')+' aria-label="'+(v[k]?esc(v[k])+': take it back':'Empty socket')+'">'+(v[k]?rface(p.vat[k]):'<i class="fz-ring"></i>')+(p.vat[k]&&p.vat[k].k==='thing'?'<i class="fz-tag">on the table</i>':'')+'</button>';
  window.DTVOUT=pw?{w:pw,vig:outV,name:previewName(p.vat,r)+pw}:null;
  e.className='fz'+(canPut?' can':v.length===2?(pw?' ready':' dud'):'');
  const lab=!fzLeft(0)?'You have fused this turn':!play?'Wait for your turn':v.length===2?(pw?(canPay(0,cost)?'They react':'Needs '+cost+' breath · you have '+have):'These two do not react'):canPut?'Tap a socket to put '+esc(cand.w)+' in':(cand&&cand.bad?'Only things can be fused, not '+esc(W[cand.bad]&&W[cand.bad].t==='verb'?'verbs':W[cand.bad]&&W[cand.bad].t==='adj'?'adjectives':'that'):S.vatArm!=null?'Now tap a thing in your hand or on your side':'Tap or drag two things here, from your hand or your side');
  e.innerHTML='<small>'+lab+'</small>'
   +'<div class="fz-row">'+sock(0)+'<i class="fz-plus">+</i>'+sock(1)+'<i class="fz-arrow">→</i><span class="fz-out">'+(pw&&W[pw]?miniFace(pw,{vig:outV}):'<i class="fz-ring q">'+(v.length===2?'✕':'?')+'</i>')+'</span></div>'
   +'<button class="fz-fire" data-d="vfire"'+(ok?'':' disabled')+'>'+(pw?'Fuse into '+esc(previewName(p.vat,r)+pw)+' · '+cost+' breath'+(r.cat?' · catalyst':''):'fuse')+'</button>';};
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('#dfz')){e.preventDefault();e.stopPropagation();}},true);
document.addEventListener('pointerdown',e=>{const b=e.target.closest&&e.target.closest('#dfz [data-d]');if(!b)return;e.preventDefault();e.stopPropagation();if(b.disabled||!S||S.phase!=='play')return;const p=S.players[0];p.vat=p.vat||[];
  if(b.dataset.d==='vput'){const k=[...b.parentNode.querySelectorAll('.fz-sock')].indexOf(b);if(p.vat[k]){p.vat.splice(k,1);sfx('tick');}else{const c=candRef();if(c&&!c.bad&&vatAdd(c)){clearUi();sfx('page');}else if(p.vat.length<2){S.vatArm=k;sfx('tick');}}}
  else if(b.dataset.d==='vfire'&&p.vat.length===2){const [a,c]=p.vat;p.vat=[];clearUi();if(!vatFire(0,a,c)){sfx('nope');ui.msg='The fusion will not take.';}else sfx('shimmer');}
  render();},true);
addEventListener('pointerup',e=>{try{if(V<4||typeof drag==='undefined'||!drag||!drag.g)return;const o=document.elementFromPoint(e.clientX,e.clientY);if(!o||!o.closest||!o.closest('#dfz'))return;
  const d=drag;drag=null;d.g.remove();document.body.classList.remove('dragon');d.c.classList.remove('dragging');const p=S.players[0];const w=p.hand[d.i];
  if(S.phase==='play'&&fzLeft(0)&&W[w]&&W[w].t===NOUN&&vatAdd({k:'card',i:d.i,w}))sfx('page');else sfx('nope');
  e.stopPropagation();swallowClick();render();}catch(x){}},true);
/* the rival fuses too: from her hand or her row, when it helps */
const _rf=window.dtvRivalFuse;window.dtvRivalFuse=function(){if(V<4)return _rf();if(!fzLeft(1))return false;window.DTVSIDE=1;const p=S.players[1];let best=null;
  const hn=p.hand.map((w,i)=>({w,i})).filter(o=>W[o.w]&&W[o.w].t===NOUN&&!isEvent(o.w));
  for(let x=0;x<hn.length;x++)for(let y=x+1;y<hn.length;y++){const r=rxOf(hn[x].w,hn[y].w);if(!r||!r.r)continue;const c=rxLevel(hn[x].w,hn[y].w,r);if(!canPay(1,c))continue;const g=(W[r.r]&&W[r.r].vig||0)+tierOf(r.r)*2-c-((W[hn[x].w].vig||0)+(W[hn[y].w].vig||0))/2;if(!best||g>best.g)best={g,a:hn[x].i,b:hn[y].i,w:[hn[x].w,hn[y].w]};}
  if(best&&best.g>0){sayBanner((S.rival?S.rival.n.split(' ')[0]:'The rival')+' fuses',best.w.join(' and '));setTimeout(hideBanner,1100);return vatFire(1,{k:'card',i:best.a,w:best.w[0]},{k:'card',i:best.b,w:best.w[1]});}
  return _rf();};

/* ---- v3: a coin decides who goes first; the second player is compensated ---- */
window.dtvFirst=function(){if(V<3||!S)return;S.second=0;
  if(Math.random()<.5){ // the rival goes first: undo the player's opening turn
    S.second=0;const p=S.players[0];p.ink=0;p.ink0=0;S.turn=0;startTurn(S,1);S.phase='bot';
    setTimeout(()=>{try{render();turnBanner((S.rival?S.rival.n.split(' ')[0]:'The rival')+' goes first');botLoop();}catch(e){}},2600);}
  else S.second=1;};
window.dtvSecond=function(S,i){if(V<3||S.second!==i||S.secondDone)return;S.secondDone=1;const p=S.players[i];
  p.ink+=1;p.ink0=(p.ink0||0)+1;if(V>=6){say(S,(i===0?'You go':'The rival goes')+' second: +1 breath this turn.');return;}p.well=(p.well||0)+2;drawN(S,i,1);say(S,(i===0?'You go':'The rival goes')+' second: +1 breath this turn, +2 in the well and an extra word.');};

const css=document.createElement('style');css.textContent=
 '.dtvp{margin-top:18px;max-width:520px;background:rgba(9,7,5,.82);border:1px solid rgba(230,196,94,.45);border-radius:12px;padding:12px 14px;color:#f3e4c2}'
+'.dtvp b{display:block;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:#e6d3a8;margin-bottom:8px}'
+'.dtvp button{margin:0 6px 6px 0;padding:7px 11px;border-radius:999px;border:1px solid rgba(230,196,94,.5);background:rgba(30,20,10,.9);color:#f3e4c2;font:600 13px "Alegreya Sans",sans-serif;cursor:pointer}'
+'.dtvp button.on{background:#8e1d10;border-color:#d14a35;color:#fff6e6}.dtvp p{margin:6px 0 0;font-size:14px;line-height:1.4;color:#e8dcc0}'
+'#dfzg{position:fixed;z-index:9500;pointer-events:none;transform:translate(-50%,-60%) rotate(-3deg) scale(1.05);filter:drop-shadow(0 14px 18px rgba(0,0,0,.7)) drop-shadow(0 0 10px rgba(214,168,255,.7))}'
+'.thing.dfz{animation:dfzp 1s ease-in-out infinite}@keyframes dfzp{50%{filter:drop-shadow(0 0 16px #d6a8ff) brightness(1.15)}}'
+(V>=1&&V<4?'body .table.v2 .mat{background:var(--dmat) center/100% 100% no-repeat!important}':'')+(V>=1?''
 +'body .table.v2 .zone.zf .ztiles{display:flex;justify-content:center;align-items:center;gap:20px;flex-wrap:nowrap}'
 +'body .table.v2 .zone.zf .ztiles .sock{width:104px;flex:none}'
 +'body .table.v2 .zone.zf .ztiles .thing{flex:0 0 112px;margin-left:0}'
 +'body .table.v2 .matmid{display:flex!important;align-items:center;justify-content:center;gap:18px}'
 +'.dcap{font-family:var(--display);font-size:21px;color:#f6ead0;text-shadow:0 2px 4px #000,0 0 12px #000;max-width:70%;text-align:center;line-height:1.2}':'')
+(V>=4?'body .table.v2 #clime>small,#coach,body .table.v2 .waychip,body .table.v2 .ways,body .table.v2 .bench.dempty .sentext,body .table.v2 .wxnone{display:none!important}'
 +'body .table.v2 .board{grid-template-rows:auto minmax(0,1fr) auto auto!important}body .table.v2 .bench{height:auto!important;max-height:150px;min-height:0!important;padding-top:8px!important;padding-bottom:8px!important;align-self:end}body .table.v2 .bench .senrow{min-height:0}body .table.v2 .bench{display:flex!important;align-items:center;justify-content:space-between;gap:16px}body .table.v2 .bench .btns.acts{display:flex!important;flex-direction:row!important;align-items:center;gap:12px;margin:0!important;grid-column:auto!important;grid-row:auto!important}body .table.v2 .bench .btns.acts .btn.wax{margin:0!important}'
 +'body .table.v2 .handbar{padding-right:330px!important;box-sizing:border-box}'
 +'body .table.v2 .zone>small,body .table.v2 .zone.zf .ztiles .sock,body .table.v2 .zghost,body .table.v2 .zone .empty,body .table.v2 .bench .guide,body .table.v2 .bench .way,body .table.v2 .bench>h2{display:none!important}'
 +'body .table.v2 .hud .hrow small{display:none}'
 +'#dfz{position:absolute;right:18px;bottom:14px;z-index:30;width:330px;padding:12px 14px 14px;border-radius:16px;background:rgba(9,12,20,.86);border:1px solid rgba(143,208,255,.4);box-shadow:0 0 22px rgba(80,150,255,.2),0 12px 30px rgba(0,0,0,.6);display:grid;gap:8px;justify-items:center;color:#e6f3ff;font:600 12px/1.3 "Alegreya Sans",sans-serif}'
 +'#dfz small{letter-spacing:.12em;text-transform:uppercase;color:#bfe0ff;text-align:center}'
 +'#dfz .fz-row{display:flex;align-items:center;gap:8px}#dfz .fz-plus,#dfz .fz-arrow{font-style:normal;font-size:22px;color:#8fd0ff}'
 +'#dfz .fz-sock,#dfz .fz-out{width:70px;height:96px;border-radius:10px;border:1.5px dashed rgba(143,208,255,.5);background:radial-gradient(ellipse at 50% 40%,rgba(143,208,255,.14),rgba(0,0,0,.4) 75%);display:grid;place-items:center;padding:0;cursor:pointer}'
 +'#dfz .fz-sock:disabled{cursor:default}#dfz.can .fz-sock:not(.on){border-color:#ffd98a;box-shadow:0 0 14px rgba(255,214,120,.6);animation:sockglow 1.6s ease-in-out infinite}'
 +'#dfz .fz-sock .cf,#dfz .fz-out .cf{width:66px}#dfz .fz-ring{font-style:normal;font-size:22px;color:#8fd0ff}'
 +'#dfz .fz-sock{position:relative}#dfz .fz-tag{position:absolute;bottom:-14px;left:50%;transform:translateX(-50%);font-style:normal;font-size:9px;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;color:#ffe3a3;background:rgba(9,7,5,.9);padding:1px 6px;border-radius:999px}#dfz .fz-sock.arm{border-color:#ffd98a;box-shadow:0 0 14px rgba(255,214,120,.7)}#dfz.ready .fz-out{border-color:#d6a8ff;box-shadow:0 0 16px rgba(214,168,255,.7)}#dfz.dud .fz-out{border-color:rgba(255,120,100,.6)}'
 +'#dfz .fz-fire{min-width:200px;padding:8px 16px;border-radius:999px;border:1px solid #6a4a14;background:linear-gradient(180deg,#f3d98f,#b0822c);color:#1e1206;font:700 15px "Alegreya Sans",sans-serif;cursor:pointer}'
 +'#dfz .fz-fire:disabled{background:rgba(143,208,255,.12);color:#9fb6cc;border-color:rgba(143,208,255,.3);cursor:default}':'');
document.head.appendChild(css);

/* v6: how the duel went: life each turn, the turn it was decided, the best play on each side */
window.dtvSnap=function(S,i){try{S.dh=S.dh||[];S.dh.push({i,t:S.turn,l:[S.players[0].life,S.players[1].life],g:S.log.length});}catch(e){}};
window.dtvSummary=function(S){const H=(S.dh||[]).slice();if(H.length<1)return null;
  H.push({i:-1,t:S.turn,l:[S.players[0].life,S.players[1].life],g:S.log.length});
  const rv=(S.rival&&S.rival.n?S.rival.n.split(' ')[0]:'The rival'),rnd=t=>Math.max(1,Math.ceil(t/2)),seg=[];
  for(let k=0;k<H.length-1;k++){const a=H[k],b=H[k+1];const lines=(S.log||[]).slice(a.g,b.g).map(l=>l.x||'');
    seg.push({who:a.i,t:a.t,dy:b.l[0]-a.l[0],dr:b.l[1]-a.l[1],lines});}
  const said=(sg,who)=>sg.lines.filter(x=>who===0?/^You say:/.test(x):/^The rival says:|^[A-Z][a-z]+ says:/.test(x)).map(x=>x.replace(/^[^:]+:\s*/,''));
  const best=who=>{let m=null;for(const sg of seg){if(sg.who!==who)continue;const v=who===0?(-sg.dr+Math.max(0,sg.dy)):(-sg.dy+Math.max(0,sg.dr));if(v>0&&(!m||v>m.v))m={v,sg};}return m;};
  const bR=best(1),bY=best(0);
  /* decided: the last time the lead changed hands, counting the winner */
  const lead=l=>Math.sign(l[0]-l[1]);let dec=null;const W0=S.over;
  for(let k=0;k<H.length;k++){const s=lead(H[k].l),want=W0===0?1:W0===1?-1:0;if(want&&s===want){if(dec==null)dec=k;}else dec=null;}
  const fin=H[H.length-1].l;
  /* chart */
  const w=540,h=130,pad=26,mx=Math.max(1,...H.map(x=>Math.max(x.l[0],x.l[1]))),n=Math.max(1,H.length-1);
  const X=k=>pad+k*(w-pad*2)/n,Y=v=>h-18-Math.max(0,v)*(h-36)/mx,pth=j=>H.map((x,k)=>(k?'L':'M')+X(k).toFixed(1)+' '+Y(x.l[j]).toFixed(1)).join(' ');
  const decX=dec!=null&&dec>0?X(dec):null;
  const svg='<svg class="dsv" viewBox="0 0 '+w+' '+h+'" role="img" aria-label="Life each turn: you '+H.map(x=>x.l[0]).join(', ')+'; '+rv+' '+H.map(x=>x.l[1]).join(', ')+'">'
    +'<line x1="'+pad+'" y1="'+(h-18)+'" x2="'+(w-pad)+'" y2="'+(h-18)+'" stroke="#8a6a2f" stroke-opacity=".5"/>'
    +(decX!=null?'<line x1="'+decX+'" y1="8" x2="'+decX+'" y2="'+(h-18)+'" stroke="#23170d" stroke-dasharray="3 4" stroke-opacity=".55"/><text x="'+(decX+5)+'" y="16" font-size="11" fill="#4b3824">decided</text>':'')
    +'<path d="'+pth(1)+'" fill="none" stroke="#9a2b1c" stroke-width="2.5" stroke-linejoin="round"/>'
    +'<path d="'+pth(0)+'" fill="none" stroke="#1f5f8f" stroke-width="2.5" stroke-linejoin="round"/>'
    +'<text x="'+(w-pad)+'" y="'+(Y(fin[0])-6)+'" text-anchor="end" font-size="12" font-weight="700" fill="#1f5f8f">You '+fin[0]+'</text>'
    +'<text x="'+(w-pad)+'" y="'+(Y(fin[1])+(Math.abs(Y(fin[1])-Y(fin[0]))<14?18:-6))+'" text-anchor="end" font-size="12" font-weight="700" fill="#9a2b1c">'+esc(rv)+' '+fin[1]+'</text>'
    +'<text x="'+pad+'" y="'+(h-4)+'" font-size="11" fill="#4b3824">Round 1</text><text x="'+(w-pad)+'" y="'+(h-4)+'" text-anchor="end" font-size="11" fill="#4b3824">Round '+rnd(S.turn)+'</text></svg>';
  const decTxt=W0==null||W0===-1?'No one held the lead to the end.':dec==null?'It was settled only at the very end.':dec===0?(W0===0?'You':'They')+' led from the first turn and never gave it up.':'Decided in round '+rnd(H[dec].t)+': '+(W0===0?'you':esc(rv))+' took the lead then and kept it.';
  const play=(m,who)=>{if(!m)return '<li><b>'+(who===0?'Your best turn':esc(rv)+'’s best turn')+':</b> none that hurt.</li>';const s=said(m.sg,who),hurt=who===0?-m.sg.dr:-m.sg.dy,heal=who===0?Math.max(0,m.sg.dy):Math.max(0,m.sg.dr);
    return '<li><b>'+(who===0?'Your best turn':esc(rv)+'’s best turn')+'</b> (round '+rnd(m.sg.t)+'): '+(s.length?'“'+esc(s.join(' / '))+'”':'no sentence')+' · '+(hurt>0?hurt+' harm':'')+(hurt>0&&heal>0?', ':'')+(heal>0?heal+' mended':'')+'</li>';};
  const html='<div class="dsum"><b class="dsh">How it went</b>'+svg+'<p class="dsd">'+decTxt+'</p><ul>'+play(bR,1)+play(bY,0)+'</ul></div>';
  const text='How it went\nLife by turn (you / rival): '+H.map(x=>x.l[0]+'/'+x.l[1]).join(' · ')+'\n'+decTxt.replace(/<[^>]+>/g,'')+'\nRival best: '+(bR?'round '+rnd(bR.sg.t)+' '+said(bR.sg,1).join(' / ')+' ('+(-bR.sg.dy)+' harm)':'none')+'\nYour best: '+(bY?'round '+rnd(bY.sg.t)+' '+said(bY.sg,0).join(' / ')+' ('+(-bY.sg.dr)+' harm)':'none');
  return {html,text};};


/* v6: born knowing. Some things arrive already able to do their own work; healers, thieves and binders do not come with strike. */
const INNV={wormwood:['mend'],rue:['mend'],aloe:['mend'],willow:['mend','+'],apothecary:['mend'],alchemist:['mend','transmute'],pelican:['mend','+'],dew:['drench'],
  thief:['steal'],magpie:['steal','+'],ivy:['bind'],pitch:['bind'],spider:['bind','+'],salt:['guard'],ice:['guard','+'],golem:['guard','+'],
  smith:['temper','+'],homunculus:['transmute','+'],copper:['blind','+'],peacock:['blind','+'],phosphorus:['blind','+'],owl:['doubt','+'],
  shepherdess:['tame'],scribe:['name'],seed:['grow'],lichen:['grow'],bellows:['blow','+'],mandrake:['scream'],crow:['steal','+'],daemon:['haunt','+'],flint:['burn','+']};
window.DTVINNV=INNV;
if(V>=6&&W.steal){W.steal.obj='none';W.steal.gloss='Takes a word from the rival’s hand.';}
window.dtvInnate=function(S,t){if(!(V>=6)||!t)return;const m=INNV[t.w];if(!m){if(t.innv){t.verbs=(t.verbs||[]).filter(v=>!t.innv.includes(v));t.innv=null;}return;}
  const keep=m.includes('+'),vs=m.filter(v=>v!=='+'&&W[v]);t.verbs=(t.verbs||[]).filter(v=>!(t.innv||[]).includes(v));
  if(!keep&&t.inn){t.inn=0;t.verbs=t.verbs.filter(v=>v!=='strike');}
  for(const v of vs)if(!t.verbs.includes(v))t.verbs.push(v);t.innv=vs;};


/* ---- v7: simpler rules ---- */
window.DTVX7=['be','claim','rune','mortals','sleepers','flames','worts','conjoin'];
if(V>=7){try{c_('plants','OE',1,'plant','Every plant on the board.');if(!ALLWORDS.includes('plants'))ALLWORDS.push('plants');}catch(e){}
  for(const w in W){const d=W[w];if(d&&d.gloss)d.gloss=d.gloss.replace(/ ?A spell: it stands for 4 of its keeper’s turns, cannot be attacked, and does not fight\./,' Lasts 4 turns.');}}
/* a sentence that would not work cannot be spoken: try it on a copy of the table first */
const FZ=/^(Only |Nothing |Nobody |There is nothing|There is no room|Teeth close)|cannot |can’t |can't |knows nothing|is too |has neither|is no [a-z]+\.|has no [a-z]+ to|has nothing|nothing to |not worth|needs a |meets nothing|feels nothing|nothing more|nothing worse|nothing comes of it|finds nothing|was never awake|does not sleep|only just slept|will not turn|only dries|only feeds|only makes|out of reach|already\.$/,FZX=/^(Courage|You say|The rival says|The omen|The angel|Until |Your turn|The rival’s turn)|only \d+ breath/;
const _val=validate;
validate=function(S,who,sen){const r=_val(S,who,sen);if(!(V>=7)||!r||!r.ok||window.DTVDRY||!sen||sen.veil!=null)return r;window.DTVDRY=1;let why=null;
  try{const C=JSON.parse(JSON.stringify(Object.assign({},S,{log:[]})));if(C.players[1-who])C.players[1-who].veil=null;resolve(C,who,JSON.parse(JSON.stringify(sen)));why=(C.log||[]).map(l=>l.x||'').find(x=>FZ.test(x)&&!FZX.test(x))||null;}
  catch(e){why=null;window.DTVERR=String(e&&e.stack||e).slice(0,300);}finally{window.DTVDRY=0;try{SCUR=S;}catch(e){}}
  return why?{ok:false,why:'That won’t work: '+why.replace(/^That won’t work: /,''),cost:r.cost}:r;};

})();
