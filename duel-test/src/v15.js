/* v15: the price of making, cards that say what they are, a bounded match, and the Grimoire.
   Gated on DTV>=15; older versions play exactly as before. */
(function(){
'use strict';
if(!(window.DTV>=15))return;
const sch=w=>(typeof SCHOOLOF!=='undefined'&&SCHOOLOF[w])||((window.WEB21.cards[w]||{}).sch)||null;
const TAKE=['take','element','haunt'],NAMED=['special','named pair'],LADDER=['metal'];
const ROMAN=['','I','II','III'];
const thingOf=r=>r&&r.k==='thing'?findThing(S,r.id):null;

/* ---- 1. the price of making ---- */
/* Final things, and rungs that have only just arrived, cannot fuse */
window.dtv15Block=function(who,ra,rb,x){const ts=[thingOf(ra),thingOf(rb)].filter(Boolean);
  const fin=ts.find(t=>t.final);if(fin&&!NAMED.includes(x.layer))return Cap(fin.title||fin.w)+' is Final: it cannot fuse again';
  const lad=LADDER.includes(x.layer)||(x.layer==='named pair'&&['sapling','oak','willow'].includes(x.r));
  const nu=ts.find(t=>t.fresh&&!t.made);if(lad&&nu)return Cap(nu.w)+' arrived this turn: a rung cannot climb yet';return null;};
/* each trait already held makes taking in dearer; the weather lends its school; some rivals fuse cheaply */
window.dtv15Cost=function(who,ra,rb,x){let d=0;const ts=[thingOf(ra),thingOf(rb)].filter(Boolean);
  if(TAKE.includes(x.layer))for(const t of ts)d+=(t.traits||[]).length;
  if(S.clime&&W[S.clime.w]){const cs=sch(S.clime.w);if(cs&&(sch(x.a)===cs||sch(x.b)===cs))d-=1;}
  if(who===1&&S.house==='fuse'&&!(S.fz&&S.fz[1]===S.turn))d-=1;return d;};
window.dtv15CostWhy=function(who,ra,rb,x){const o=[];const ts=[thingOf(ra),thingOf(rb)].filter(Boolean);
  if(TAKE.includes(x.layer)){const n=ts.reduce((s,t)=>s+(t.traits||[]).length,0);if(n)o.push('+'+n+' for the trait'+(n>1?'s':'')+' it already has');}
  if(S.clime&&W[S.clime.w]){const cs=sch(S.clime.w);if(cs&&(sch(x.a)===cs||sch(x.b)===cs))o.push('−1: '+S.clime.w+' lends its school');}return o.join(' · ');};
/* made things keep what went into them; when they go, it goes with them */
const _tr=window.dtvTrait;window.dtvTrait=function(bs,x,ins){_tr(bs,x,ins);try{if(!x||!x.r)return;const t=S.things.find(q=>!bs.things[q.id]&&q.w===x.r);if(!t)return;
  const who=t.owner!=null?t.owner:t.side,p=S.players[who],gone=[];
  for(const q of ins||[]){const k=p.discard.lastIndexOf(q.w);if(k>=0){p.discard.splice(k,1);gone.push(q.w);}}
  t.inCards=(t.inCards||[]).concat(gone);t.made=true;
  if(!TAKE.includes(x.layer)&&x.layer!=='grown'){t.tier15=Math.max(1,Math.min(3,(x.tier||2)-1));if(x.tier>=4)t.final=1;}
  else t.tier15=t.tier15||0;
  if(gone.length)say(S,'What went into '+(t.title||t.w)+' is bound to it: if it is destroyed or sent back, '+gone.join(' and ')+' '+(gone.length>1?'leave':'leaves')+' the match with it.');
  if(t.final)say(S,Cap(t.title||t.w)+' is Final: it cannot fuse again.');
  if(who===0&&!TAKE.includes(x.layer)&&x.r!==x.a&&x.r!==x.b){PF.made15=PF.made15||{};const first=!PF.made15[x.r];PF.made15[x.r]=(PF.made15[x.r]||0)+1;
    if(first){try{multBanner('',['Written in the Grimoire',Cap(x.r)]);}catch(e){}say(S,Cap(x.r)+' is written in your Grimoire.');}try{save();}catch(e){}}
}catch(e){console.error(e);}};

/* ---- 3. a bounded match: the Fading, a draw at round 20, the Second Wind, one mulligan ---- */
const _sec=window.dtvSecond;window.dtvSecond=function(S,i){
  if(S.second===i&&!S.secondDone&&i===0){S.secondDone=1;S.sw=1;say(S,'You go second: you hold a Second Wind, +1 breath on any turn you choose.');}
  else _sec(S,i);
  try{if(i===1&&S.house==='breath'&&!S.houseDone){S.houseDone=1;S.players[1].ink+=1;say(S,(S.rival?S.rival.n.split(' ')[0]:'The rival')+'’s house rule: 1 more breath on her first turn.');}
    const R=Math.ceil(S.turn/2);
    if(R>20&&S.over==null){S.over=2;S.how='time';S.phase='over';say(S,'Round 20 passes and neither of you has fallen: a draw.');return;}
    if(R>=13){const n=R-12;say(S,'The Fading: the ink is thinning. '+(i===0?'You lose ':'The rival loses ')+n+' life.');damage(S,P(i),n,'fade');checkOver(S);}}catch(e){console.error(e);}};
function mullHtml(){const p=S.players[0];return '<div class="m15c" role="dialog" aria-modal="true" aria-labelledby="m15h"><h3 id="m15h">Your first hand</h3><p>Tap any words to send back. They are shuffled into your deck and you draw as many again. You can do this once.</p><div class="m15row">'
  +p.hand.map((w,i)=>'<button class="m15w'+(S.m15sel&&S.m15sel[i]?' on':'')+'" data-m15="'+i+'" aria-pressed="'+!!(S.m15sel&&S.m15sel[i])+'"><b>'+esc(w)+'</b><small>'+esc(W[w]?(W[w].t==='noun'?'thing':W[w].t==='adj'?'adjective':W[w].t==='clime'?'weather':W[w].t):'')+(sch(w)?' · '+esc(sch(w)):'')+'</small></button>').join('')
  +'</div><div class="m15b"><button class="btn" data-m15="go">'+(S.m15sel&&Object.values(S.m15sel).some(Boolean)?'Send back and draw':'Keep this hand')+'</button></div></div>';}
function mull(){let e=document.getElementById('m15');const want=S&&S.live&&S.over==null&&!S.puz&&!S.m15done&&S.phase==='play'&&S.active===0&&S.turn<=2&&typeof view!=='undefined'&&view==='match';
  if(!want){if(e)e.remove();return;}if(!e){e=document.createElement('div');e.id='m15';document.body.appendChild(e);}const h=mullHtml();if(e.innerHTML!==h)e.innerHTML=h;}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-m15]');if(!b)return;ev.preventDefault();ev.stopPropagation();const p=S.players[0];S.m15sel=S.m15sel||{};
  if(b.dataset.m15==='go'){const idx=Object.keys(S.m15sel).filter(k=>S.m15sel[k]).map(Number).sort((a,c)=>c-a);const back=idx.map(i=>p.hand.splice(i,1)[0]);
    for(const w of back)p.deck.push(w);for(let i=p.deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[p.deck[i],p.deck[j]]=[p.deck[j],p.deck[i]];}
    for(let k=0;k<back.length&&p.deck.length;k++)p.hand.push(p.deck.shift());S.m15done=1;S.m15sel=null;if(back.length)say(S,'You send back '+back.length+(back.length>1?' words':' word')+' and draw again.');try{keepMatch();}catch(e){}render();return;}
  const i=+b.dataset.m15;S.m15sel[i]=!S.m15sel[i];mull();},true);

/* ---- 5. rivals: marked as computer rivals, each with a house rule ---- */
const HOUSE=[['life','Starts with 3 more life.'],['fuse','Her first fusion each turn costs 1 less breath.'],['stand','Her things arrive with 1 more stand.'],['breath','1 more breath on her first turn.']];
function houseSet(){if(!S||!S.live||S.house||S.puz)return;const n=(S.rival&&S.rival.n)||'rival';let h=0;for(const c of n)h=(h*31+c.charCodeAt(0))>>>0;S.house=HOUSE[h%HOUSE.length][0];
  if(S.house==='life'){S.players[1].life+=3;}say(S,(S.rival?S.rival.n:'The rival')+' is a computer rival. House rule: '+HOUSE.find(x=>x[0]===S.house)[1]);}
const _add=window.addThing;window.addThing=function(S,w,sd,owner,token,card){const t=_add.apply(this,arguments);try{if(S&&S.house==='stand'&&sd===1&&t&&!isG(t)&&!(t.props||[]).includes('spell'))t.vig+=1;}catch(e){}return t;};
function rivalTag(){if(!S||!S.rival||S.puz)return;const h=HOUSE.find(x=>x[0]===S.house);const html='<b>Computer rival</b>'+(h?'<span>'+esc(h[1])+'</span>':'');
  let d=document.getElementById('r15');const bub=[...document.querySelectorAll('#view-match *')].filter(e=>/means to say/.test(e.textContent)&&e.children.length<=3).sort((a,b)=>a.textContent.length-b.textContent.length)[0];
  if(!d){d=document.createElement('div');d.id='r15';d.className='r15';document.body.appendChild(d);}if(d.innerHTML!==html)d.innerHTML=html;
  const ref=bub||[...document.querySelectorAll('#view-match *')].find(e=>e.children.length===0&&e.textContent.trim()===S.rival.n);d.style.display=view==='match'&&S.over==null&&ref?'':'none';
  if(ref){const r=ref.getBoundingClientRect();d.style.left=Math.round(r.left)+'px';d.style.top=Math.round(r.bottom+6)+'px';}}

/* ---- 2. cards that say what they are ---- */
const KIND=[['human','Person'],['beast','Beast'],['bird','Bird'],['serpent','Serpent'],['insect','Insect'],['fish','Fish'],['spirit','Spirit'],['plant','Plant'],['wood','Wood'],['metal','Metal'],['stone','Stone'],['liquid','Liquid']];
const PROP=[['flying','Flies'],['fireborn','Fireborn'],['swift','Swift'],['heavy','Heavy'],['toxic','Toxic'],['sharp','Sharp'],['flammable','Flammable'],['living','Living']];
function pips(props){const o=[];for(const [k,l] of KIND)if(props.includes(k)&&o.length<1)o.push(l);for(const [k,l] of PROP)if(props.includes(k)&&o.length<2&&!(l==='Living'&&o.some(x=>['Person','Beast','Bird','Serpent','Insect','Fish','Plant'].includes(x))))o.push(l);return o;}
const ST=[['burning','Burning'],['sodden','Wet'],['frozen','Frozen'],['poisoned','Poisoned'],['asleep','Asleep']];
function put(el,cls,h,tip){let b=el.querySelector(':scope>.'+cls);if(h==null){if(b)b.remove();return;}if(!b){b=document.createElement('span');b.className=cls;el.appendChild(b);}if(b.innerHTML!==h)b.innerHTML=h;if(tip!=null)b.title=tip;}
function cards(){const p=S.players[0];
  document.querySelectorAll('#table .thing[data-id]').forEach(el=>{const t=S.things.find(x=>String(x.id)===el.dataset.id);if(!t)return;
    const pp=isG(t)?[]:pips(t.props||[]);put(el,'p15',pp.length?pp.map(x=>'<i>'+x+'</i>').join(''):null,'What it is');
    const sts=ST.filter(([k])=>t.st&&t.st[k]).map(x=>x[0]);ST.forEach(([k])=>el.classList.toggle('s15-'+k,sts.includes(k)));
    el.classList.toggle('m15f',!!t.made&&!isG(t));put(el,'t15',t.made&&t.tier15?ROMAN[t.tier15]+(t.final?' · Final':''):null,t.made?'Made'+(t.final?', Final: it cannot fuse again':'')+(t.inCards&&t.inCards.length?'. Holds '+t.inCards.join(' and '):''):'');});
  document.querySelectorAll('#hand .card[data-i]').forEach(el=>{const w=p.hand[+el.dataset.i];const d=W[w];if(!d||d.t!=='noun'){put(el,'p15',null);return;}const pp=pips(d.props||[]);put(el,'p15',pp.length?pp.map(x=>'<i>'+x+'</i>').join(''):null,'What it is');});}
/* every sentence shows all it will do */
const _trial=window.trial;window.trial=function(s){const r=_trial(s);try{if(r){const C=JSON.parse(JSON.stringify(S));C.quiet=false;C.log=[];C.found=[];const t=Object.assign({},s);if(needsDefence(C,0,t))t.def=botDefend(C,1,0,t);resolve(C,0,t);
  r.all=C.log.filter(l=>l.k!=='s'&&l.k!=='t'&&l.x).map(l=>l.x).filter(x=>!/^(You say|The sum)/.test(x)).slice(0,5);window.T15=r;}else window.T15=null;}catch(e){window.T15=null;}return r;};
function bench(){const st=document.querySelector('#bench .sentext');if(!st)return;const old=st.querySelector('.w15');const r=window.T15;
  const h=r&&r.all&&r.all.length&&!r.same?'<b>What will happen</b><ul>'+r.all.map(x=>'<li>'+esc(x)+'</li>').join('')+'</ul>':null;
  if(!h){if(old)old.remove();return;}if(old){if(old.innerHTML!==h)old.innerHTML=h;return;}const d=document.createElement('div');d.className='w15';d.innerHTML=h;const hint=st.querySelector('.hint');if(hint)hint.after(d);else st.appendChild(d);}
/* the Second Wind button */
function wind(){const a=document.querySelector('#bench .btns.acts');if(!a)return;let b=a.querySelector('.sw15');const ok=S.sw===1&&S.phase==='play'&&S.active===0&&S.over==null;
  if(!ok){if(b)b.remove();return;}if(!b){b=document.createElement('button');b.className='btn ghost sw15';b.dataset.sw15='1';b.innerHTML='Second Wind<br><small>+1 breath, once</small>';a.insertBefore(b,a.lastElementChild);}}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-sw15]');if(!b)return;ev.preventDefault();ev.stopPropagation();if(S.sw!==1)return;S.sw=2;S.players[0].ink+=1;say(S,'You take your Second Wind: +1 breath.');try{keepMatch();}catch(e){}render();},true);
/* the vat says why a fusion costs what it does */
const _pn=window.dtvPanel;window.dtvPanel=function(){_pn();try{const e=document.getElementById('dfz'),p=S.players[0],v=p.vat||[];if(!e||v.length!==2)return;window.DTVSIDE=0;const x=rxOf(v[0].w,v[1].w);if(!x||!x.r)return;
  const why=dtv15CostWhy(0,v[0],v[1],x),t=e.querySelector('.f14t em');if(why&&t&&!t.querySelector('.c15'))t.insertAdjacentHTML('beforeend','<span class="c15"> Cost: '+esc(why)+'.</span>');
  if(!['take','element','haunt','grown'].includes(x.layer)&&x.tier>=4&&t&&!t.querySelector('.f15'))t.insertAdjacentHTML('beforeend','<span class="f15"> A great result: it will be Final.</span>');}catch(err){}};

/* ---- 5. the Grimoire: every made word, a silhouette until you make it ---- */
function madeList(){if(window.M15L)return window.M15L;const B=window.WEB21.base,s=new Set();for(const k in B){const v=B[k],[a,b]=k.split('|');if(['take','element','haunt','grown','potion'].includes(v[2]))continue;if(v[0]===a||v[0]===b||!W[v[0]])continue;s.add(v[0]);}
  for(const k in window.WEB21.cat)for(const c of window.WEB21.cat[k])if(W[c[1]])s.add(c[1]);
  return window.M15L=[...s].sort((a,b)=>(sch(a)||'').localeCompare(sch(b)||'')||a.localeCompare(b));}
function grim(){try{if(typeof bkS==='undefined'||bkS.tab!=='rx')return;const host=document.getElementById('bk-book');if(!host||host.dataset.g15==='1')return;
  const L=madeList(),f=PF.made15||{},n=L.filter(w=>f[w]).length,SN={life:'Life',rot:'Rot',fire:'Fire',water:'Water',earth:'Earth',air:'Air',word:'The Word'};
  const how=w=>{const B=window.WEB21.base;for(const k in B)if(B[k][0]===w&&!['take','element','haunt','grown'].includes(B[k][2])){const [a,b]=k.split('|');if(a!==w&&b!==w)return a+' + '+b;}return '';};
  const cell=w=>f[w]?'<div class="g15c on" data-pv="'+esc(w)+'"'+(typeof ART!=='undefined'&&ART[w]!=null?' style="--a:url(assets/art/'+w+'.jpg)"':'')+'><b>'+esc(w)+'</b><small>'+esc(how(w))+(f[w]>1?' · made '+f[w]+' times':'')+'</small></div>':'<div class="g15c"><b>?</b><small>'+esc(SN[sch(w)]||'')+'</small></div>';
  host.innerHTML='<div class="g15"><header><h3>The Grimoire</h3><span>'+n+' of '+L.length+' made words found</span></header><p>Every word you make is written here. The rest wait as silhouettes; the law in How to play says how each school pair fuses.</p><div class="g15g">'+L.map(cell).join('')+'</div></div>';host.dataset.g15='1';
  const ctr=document.getElementById('bk-ctr');if(ctr)ctr.innerHTML='<b>'+n+'/'+L.length+'</b><small>made words found</small>';}catch(e){console.error(e);}}
const _rl=window.renderLex;if(_rl)window.renderLex=function(){const h=document.getElementById('bk-book');if(h)h.dataset.g15='';_rl.apply(this,arguments);grim();};

/* ---- run with every render ---- */
const _dec=window.dtvDecorate;window.dtvDecorate=function(){if(_dec)_dec();try{houseSet();cards();bench();wind();mull();rivalTag();}catch(e){console.error(e);}};
setInterval(()=>{try{if(typeof view!=='undefined'&&view==='book')grim();const m=typeof view!=='undefined'&&view==='match'&&S&&S.live&&S.over==null;const r=document.getElementById('r15');if(r&&!m)r.style.display='none';const q=document.getElementById('m15');if(q&&!m)q.remove();}catch(e){}},400);

const css=document.createElement('style');css.textContent=
 '.p15{position:absolute;left:4px;right:4px;bottom:31%;z-index:5;display:flex;flex-wrap:nowrap;gap:2px;justify-content:center;pointer-events:none}'
+'.p15 i{font:600 9px/1 Cinzel,serif;white-space:nowrap;font-style:normal;letter-spacing:.03em;color:#f6ead0;background:rgba(18,13,9,.86);border:1px solid rgba(214,180,110,.55);border-radius:2px;padding:2px 3px}'
+'.thing.m15f{box-shadow:0 0 0 2px #c9a04a,0 0 10px rgba(240,200,110,.55)!important}'
+'.t15{position:absolute;right:4px;top:4px;z-index:6;font:700 10px/1 Cinzel,serif;color:#1b1208;background:linear-gradient(#f4dc9a,#c9a04a);border-radius:2px;padding:2px 4px;pointer-events:auto}'
+'.thing.s15-burning::after,.thing.s15-sodden::after,.thing.s15-frozen::after,.thing.s15-poisoned::after,.thing.s15-asleep::after{content:"";position:absolute;inset:0;pointer-events:none;z-index:4;border-radius:inherit;mix-blend-mode:screen}'
+'.thing.s15-burning::after{background:radial-gradient(ellipse at 50% 100%,rgba(255,120,30,.55),transparent 65%)}'
+'.thing.s15-sodden::after{background:linear-gradient(180deg,rgba(60,140,230,.05),rgba(60,140,230,.45))}'
+'.thing.s15-frozen::after{background:linear-gradient(135deg,rgba(220,240,255,.55),rgba(160,210,255,.15));mix-blend-mode:normal;opacity:.6}'
+'.thing.s15-poisoned::after{background:radial-gradient(ellipse at 50% 60%,rgba(110,200,60,.45),transparent 70%)}'
+'.thing.s15-asleep::after{background:rgba(40,40,90,.35);mix-blend-mode:multiply}'
+'.w15{margin-top:6px;font-size:13px;line-height:1.35;color:#f1e6cc}.w15 b{font:600 11px/1 Cinzel,serif;letter-spacing:.06em;color:#e8c987;text-transform:uppercase}.w15 ul{margin:3px 0 0;padding-left:1.1em}.w15 li{margin:1px 0}'
+'#m15{position:fixed;inset:0;z-index:9000;background:rgba(6,4,2,.72);display:flex;align-items:center;justify-content:center}'
+'.m15c{background:#17110c;border:1px solid #b08a45;border-radius:10px;padding:20px 24px;max-width:760px;color:#f3e6c8;box-shadow:0 10px 40px rgba(0,0,0,.6)}.m15c h3{font:600 22px/1.2 Cinzel,serif;color:#f1d48a;margin:0 0 6px}.m15c p{margin:0 0 14px;font-size:15px}'
+'.m15row{display:flex;gap:8px;flex-wrap:wrap}.m15w{background:#241a12;border:1px solid #6d5430;border-radius:6px;color:#f3e6c8;padding:10px 12px;min-width:96px;text-align:left;cursor:pointer}.m15w b{display:block;font:600 16px/1.2 "IM Fell English",Georgia,serif}.m15w small{color:#d8c49a;font-size:12px}'
+'.m15w.on{background:#4a1d14;border-color:#f0a080;text-decoration:line-through;text-decoration-color:rgba(255,200,180,.8)}.m15b{margin-top:16px;text-align:right}'
+'.r15{position:fixed;z-index:50;text-align:left;font-size:12px;line-height:1.3;color:#f1e6cc;background:rgba(12,9,6,.88);border:1px solid rgba(214,180,110,.5);border-radius:5px;padding:4px 8px;max-width:220px;pointer-events:none}.r15 b{display:block;font:600 9.5px/1.2 Cinzel,serif;letter-spacing:.08em;text-transform:uppercase;color:#e8c987}'
+'.g15{padding:18px 24px;color:#2a1c10;height:100%;overflow:auto}.g15 header{display:flex;justify-content:space-between;align-items:baseline}.g15 h3{margin:0}.g15 p{font-size:14px}'
+'.g15g{display:grid;grid-template-columns:repeat(auto-fill,minmax(112px,1fr));gap:6px}.g15c{border:1px dashed rgba(70,50,30,.45);border-radius:5px;padding:6px;min-height:58px;background:rgba(60,40,20,.07);text-align:center}'
+'.g15c b{display:block;font:600 14px/1.2 "IM Fell English",Georgia,serif}.g15c small{font-size:11px;color:#4d3a24}.g15c.on{border:1px solid #9c7a3c;background:linear-gradient(rgba(255,248,230,.72),rgba(255,248,230,.86)),var(--a,none) center/cover}';
(document.head||document.documentElement).appendChild(css);
})();
