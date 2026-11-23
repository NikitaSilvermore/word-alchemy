/* v14: the fusion law. One clear rule for every pair, the result always worth having, and every fusion shown before it is made.
   Gated on DTV>=14; older versions play exactly as before. */
(function(){
'use strict';
if(!(window.DTV>=14))return;
const SCH={life:'Life',rot:'Rot',fire:'Fire',water:'Water',earth:'Earth',air:'Air',word:'the Word'};
const TP={fireborn:'fireborn','sea-born':'damp','stone-skinned':'stone',winged:'flying',quickened:'swift',blighted:'toxic',learned:'minded',haunted:'spirit'};
const TX={fireborn:'burns what it hits',damp:'cannot be set alight',stone:'shrugs off blows',flying:'strikes from above',swift:'acts first',toxic:'poisons what it hits',minded:'learns and remembers',spirit:'passes through walls'};
const KP=['beast','bird','plant','herb','wood','metal','stone','liquid','spirit','human','element','concept','living','minded','voiced','mortal','flesh','ground','spell','fleeting','dead','remains','event','potion','insect','serpent','fish','sprout','seed','ice','ember','spark','egg','burden'];
const SIZE=['small','middling','great'];
const sch=w=>(typeof SCHOOLOF!=='undefined'&&SCHOOLOF[w])||((window.WEB21.cards[w]||{}).sch)||'word';
function rule(x){if(!x)return '';const L=x.layer;
  if(x.cat)return 'A catalyst recipe: it works because '+(x.cat[0]==='#'?'the weather is '+x.cat.slice(1):x.cat[0]==='@'?'you have something '+x.cat.slice(1)+' on your side':'you have '+x.cat+' on your side')+'.';
  if(L==='special'||L==='named pair')return 'A named recipe.';
  if(L==='metal')return 'The metal ladder: it climbs one rung.';
  if(L==='grown')return 'Like feeds like: it grows.';
  if(L==='take'||L==='element')return 'Taking in: it keeps its name and becomes '+x.trait+'.';
  if(L==='haunt')return 'Taking in a spirit: it keeps its name and becomes haunted.';
  if(L==='hybrid')return 'Two creatures make a hybrid with both their gifts: '+SCH[sch(x.a)]+' with '+SCH[sch(x.b)]+(x.tier>=2?', '+SIZE[Math.min(2,x.tier-2)]:'')+'.';
  if(L==='quality')return 'Two qualities make a stronger one: '+SCH[sch(x.a)]+' with '+SCH[sch(x.b)]+'.';
  if(L==='potion')return 'A potion: poured at once, and a flask is kept.';
  if(L==='chart'){const a=sch(x.a),b=sch(x.b);return 'The chart: '+(a===b?SCH[a]+' with '+SCH[a]:SCH[a]+' with '+SCH[b])+', '+SIZE[x.tier-2>=0?Math.min(2,x.tier-2):0]+' (by breath).';}
  return '';}
window.dtv14Rule=rule;
/* the inputs as they stand now */
function inOf(who,r){if(!r)return null;if(r.k==='thing'){const t=findThing(S,r.id);if(!t)return null;return {w:t.w,vig:t.vig,mt:isG(t)?0:MT(t),name:t.title||t.w,traits:(t.traits||[]).slice(),props:t.props.slice(),board:true};}
  const w=S.players[who].hand[r.i];if(!w||!W[w])return null;const vig=W[w].vig+2*upOf(S,who,w),p=W[w].props||[],body=!['ground','spell','event','burden','potion'].some(q=>p.includes(q));return {w,vig,mt:body?(MTW(w,vig)||0):0,name:w,traits:[],props:p.slice()};}
/* what a fusion will make, worked out exactly as it will be made */
function pred(who,ra,rb){const A=inOf(who,ra),B=inOf(who,rb);if(!A||!B)return null;window.DTVSIDE=who;const x=rxOf(A.w,B.w);if(!x||!x.r||!W[x.r])return null;
  const cost=rxLevel(A.w,B.w,x),r=x.r,d=W[r],o={A,B,x,r,cost,rule:rule(x)};
  if(d.t===CLIME){o.kind='clime';o.name=r;o.say='becomes the weather';return o;}
  if((d.props||[]).includes('potion')){o.kind='potion';o.name=r;o.say='poured at once';return o;}
  const tr=[];for(const q of [A,B])for(const k of q.traits)if(!tr.includes(k))tr.push(k);if(x.trait&&x.trait!=='grown'&&!tr.includes(x.trait))tr.push(x.trait);
  const props=(d.props||[]).slice();for(const q of [A,B])for(const p of q.props)if(!KP.includes(p)&&!props.includes(p))props.push(p);for(const k of tr)if(TP[k]&&!props.includes(TP[k]))props.push(TP[k]);
  const sum=A.vig+B.vig;
  const vig=Math.max(d.vig,sum+2),m0=window.MT0({w:r,props,vig}),need=Math.max(A.mt||0,B.mt||0)+1,mt=Math.max(m0,need);
  o.kind='thing';o.vig=vig;o.mt=mt;o.mb=mt-m0;o.traits=tr;o.props=props;o.name=(tr.length?tr.join(' ')+' ':'')+r;o.ready=A.board||B.board;return o;}
window.dtv14Pred=pred;
const st=q=>q.mt?'might '+q.mt+' · vigour '+q.vig:'vigour '+q.vig;
function trade(p){if(!p)return '';const g='you give '+esc(p.A.name)+(p.A.mt?' ('+st(p.A)+')':'')+' and '+esc(p.B.name)+(p.B.mt?' ('+st(p.B)+')':'')+' and '+p.cost+' breath';
  if(p.kind!=='thing')return g+' · you get '+esc(p.name)+', '+p.say;
  const nw=p.traits.filter(k=>!p.A.traits.includes(k)&&!p.B.traits.includes(k)).map(k=>TP[k]&&TX[TP[k]]?k+': '+TX[TP[k]]:k);
  return g+' · you get '+esc(p.name)+': '+st(p)+(nw.length?' · '+nw.join(', '):'')+(p.ready?' · can act at once':' · acts next turn');}
window.dtv14Trade=trade;
/* might: a bonus from the law sits on top of what the thing is */
const MT0=window.MT;window.MT0=MT0;window.MT=function(t){const m=MT0(t);return t&&t.mb&&t.vig>0?m+t.mb:m;};
window.MTW=function(w,vig){const d=W[w];if(!d||d.t!==NOUN)return null;return MT0({w,props:d.props,vig:vig!=null?vig:d.vig});};
/* keep the inputs' numbers for the law */
const _in=window.dtvIn;window.dtvIn=function(who,refs){const out=_in(who,refs);try{const q=refs.map(r=>inOf(who,r)).filter(Boolean);out.forEach((o,i)=>{if(q[i]){o.vig=q[i].vig;o.mt=q[i].mt;}});}catch(e){}return out;};
/* the value rule, applied as the thing is made */
const _tr=window.dtvTrait;window.dtvTrait=function(bs,x,ins){_tr(bs,x,ins);try{if(!x||!x.r)return;const t=S.things.find(q=>!bs.things[q.id]&&q.w===x.r);if(!t||isG(t)||t.props.includes('spell'))return;
  for(const k of t.traits||[])if(TP[k]&&!t.props.includes(TP[k]))t.props.push(TP[k]);
  const sum=(ins||[]).reduce((s,q)=>s+(q.vig||0),0),need=Math.max(0,...(ins||[]).map(q=>q.mt||0))+1;
  t.vig=Math.max(t.vig,sum+2);t.mb=0;const m0=MT0(t);t.mb=Math.max(0,need-m0);
  for(let i=S.log.length-1,n=0;i>=0&&n<6;i--,n++){const l=S.log[i];if(l&&l.x&&(/ become .*, with \d+ vigour/.test(l.x)||/ feeds the .*: it grows to \d+/.test(l.x)))S.log.splice(i,1);}
  say(S,Cap(x.a)+' and '+x.b+' make '+(t.title||t.w)+': strike '+MT(t)+', stand '+t.vig+'. '+rule(x));}catch(e){console.error(e);}};
/* which of my words fuse with which, and what each pair makes */
function refs(){const p=S.players[0],o=[];p.hand.forEach((w,i)=>{if(W[w]&&W[w].t===NOUN&&!isEvent(w))o.push({k:'card',i,w});});for(const t of S.things)if(t.side===0&&!isG(t))o.push({k:'thing',id:t.id,w:t.w});return o;}
const same=(a,b)=>a.k===b.k&&(a.k==='card'?a.i===b.i:a.id===b.id);
function elOf(r){return r.k==='card'?document.querySelector('#hand .card[data-i="'+r.i+'"]'):document.querySelector('#you .thing[data-id="'+r.id+'"]');}
function put(el,cls,h,tip){if(!el)return;let b=el.querySelector(':scope>.'+cls);if(h==null){if(b)b.remove();return;}if(!b){b=document.createElement('span');b.className=cls;el.appendChild(b);}if(b.innerHTML!==h)b.innerHTML=h;b.title=tip||'';}
function anchor(){const p=S.players[0],v=(p.vat||[]);if(v.length===1)return v[0];const s=ui.subj;if(!s)return null;if(s.k==='card'){const w=p.hand[s.i];return w&&W[w]&&W[w].t===NOUN&&!isEvent(w)?{k:'card',i:s.i,w}:null;}if(s.k==='thing'){const t=findThing(S,s.id);return t&&t.side===0?{k:'thing',id:t.id,w:t.w}:null;}return null;}
function marks(){if(!S||!S.live||S.over!=null)return;const R=refs(),me=S.phase==='play'&&S.active===0,left=!(S.fz&&S.fz[0]===S.turn),have=(S.players[0].ink||0)+(S.players[0].well||0);
  const a=me&&left?anchor():null,full=(S.players[0].vat||[]).length>=2;
  for(const r of R){const el=elOf(r);if(!el)continue;
    if(!me||!left||full){put(el,'f14',null);put(el,'f14l',null);continue;}
    if(a){if(same(a,r)){put(el,'f14l',null);put(el,'f14','⚗','Picked: its partners show what they make');el.querySelector('.f14').classList.add('on');continue;}
      const p=pred(0,a,r);put(el,'f14',null);
      if(!p){put(el,'f14l',null);continue;}
      const sh=p.kind==='thing'?esc(p.name)+' · '+p.mt+'/'+p.vig:esc(p.name);
      put(el,'f14l','→ '+sh+'<b>'+(p.cost>have?'needs '+p.cost:p.cost+' breath')+'</b>',trade(p));el.querySelector('.f14l').classList.toggle('no',p.cost>have);continue;}
    put(el,'f14l',null);let n=0;for(const q of R)if(!same(q,r)&&pred(0,r,q))n++;
    put(el,'f14',n?'⚗'+(n>1?'<small>'+n+'</small>':''):null,n?'Fuses with '+n+' of your words. Pick it to see what each makes.':'');}}
const _dec=window.dtvDecorate;window.dtvDecorate=function(){if(_dec)_dec();try{marks();}catch(e){console.error(e);}};
/* the fusion panel: real numbers, the trade, and the law it follows */
const _pn=window.dtvPanel;window.dtvPanel=function(){_pn();try{const e=document.getElementById('dfz'),p=S.players[0],v=p.vat||[];if(!e)return;
  const old=e.querySelector('.f14t');if(old)old.remove();if(v.length!==2)return;const q=pred(0,v[0],v[1]);if(!q)return;
  if(q.kind==='thing'){const out=e.querySelector('.fz-out');if(out)out.innerHTML=miniFace(q.r,{vig:q.vig,title:q.traits.length?q.name:null})+'<i class="f14m" title="Might">'+q.mt+'</i>';window.DTVOUT={w:q.r,vig:q.vig,name:q.name};}
  const t=document.createElement('p');t.className='f14t';t.innerHTML='<span>'+trade(q)+'</span><em>'+esc(q.rule)+'</em>';const b=e.querySelector('.fz-fire');e.insertBefore(t,b||null);}catch(x){console.error(x);}};
/* the rival weighs a fusion by what it really makes */
window.DTV14GAIN=function(who,ra,rb){const q=pred(who,ra,rb);if(!q)return null;if(q.kind!=='thing')return 3;return q.mt+q.vig/2-Math.max(q.A.mt,q.B.mt)-Math.max(q.A.vig,q.B.vig)/2-q.cost+1;};
/* the law, written into How to play and the Grimoire's rules */
function lawHtml(){const C=window.CHART14||{},Q=window.QCHART14||{},S7=['life','rot','fire','water','earth','air','word'],CR=['beast','bird','human','serpent','insect','spirit','fish'],cr=w=>W[w]&&CR.some(p=>(W[w].props||[]).includes(p)),rows=[];
  for(let i=0;i<7;i++)for(let j=i;j<7;j++){const k=[S7[i],S7[j]].sort().join('|');const h=(C[k]||[]).map(w=>cr(w)?w:'—');rows.push('<tr><th>'+SCH[S7[i]]+' + '+SCH[S7[j]]+'</th><td>'+h.join('</td><td>')+'</td><td class="q">'+(Q[k]||'—')+'</td></tr>');}
  return '<div class="f14law"><h4>The fusion law</h4><p>Put two words in the vat. Before you fuse, it shows what you will get, its strike and stand, the breath it costs and the rule it follows. Not everything fuses: only pairs that make sense. The first rule that fits decides:</p><ol>'
  +'<li><b>Named recipes and ladders.</b> Owl and crow make an eagle; tin climbs to copper, copper to iron; a catalyst on your side can open a recipe.</li>'
  +'<li><b>Taking in.</b> A thing with an element, a quality, a spell or a spirit keeps its name and takes a trait from that school: fireborn (Fire), sea-born (Water), stone-skinned (Earth), winged (Air), quickened (Life), blighted (Rot), learned (the Word), haunted (a spirit). Oak and fire make a fireborn oak.</li>'
  +'<li><b>Like feeds like.</b> Two of the same grow into one.</li>'
  +'<li><b>Two creatures make a hybrid</b> by their schools, in three sizes by the breath of the two words: up to 3 small, 4 to 5 middling, 6 or more great. It keeps both their gifts.</li>'
  +'<li><b>Two qualities make a stronger one.</b> Fire and water make steam; air and water make cloud; earth and rot make the abyss.</li>'
  +'<li><b>Anything else does not fuse.</b> Two objects with no recipe (an oak and a knife) stay as they are.</li></ol>'
  +'<p><b>Always worth it.</b> A thing you make has at least 2 more stand than the two together, strikes at least 1 harder than the harder of the two, and keeps their traits and gifts. Made from something already on your side, it can act at once.</p>'
  +'<p><b>Cost.</b> 1 breath for a small fusion, 2 for a middling one, 3 for a great one. One fusion a turn.</p>'
  +'<table class="f14ch"><caption>Hybrids: small · middling · great · and the quality two qualities make</caption>'+rows.join('')+'</table>'
  +'<p>Words that can fuse wear a flask (⚗). Pick one and each partner shows what it makes and what it costs.</p></div>';}
setInterval(()=>{try{document.querySelectorAll('.howbox').forEach(h=>{if(!h.querySelector('.f14law'))h.insertAdjacentHTML('beforeend',lawHtml());});}catch(e){}},700);
const css=document.createElement('style');css.textContent=
 '.f14{position:absolute;top:4px;left:4px;z-index:6;font:600 12px/1 Cinzel,serif;color:#f6dfa0;background:#1d1510;border:1px solid #8a6a34;border-radius:3px;padding:3px 4px;pointer-events:none;box-shadow:0 0 6px rgba(246,223,160,.35)}'
+'.f14 small{font-size:9px;margin-left:2px;vertical-align:top}.f14.on{background:#5a3d12;color:#fff4d6;border-color:#f6dfa0}'
+'.f14l{position:absolute;left:3px;right:3px;top:3px;z-index:6;font:600 11.5px/1.25 "IM Fell English",Georgia,serif;color:#fbecc4;background:rgba(22,15,10,.94);border:1px solid #b08a45;border-radius:3px;padding:3px 4px;pointer-events:auto;text-align:center}'
+'.f14l b{display:block;font:600 10px/1.2 Cinzel,serif;color:#f6dfa0;letter-spacing:.04em}.f14l.no{opacity:.82}.f14l.no b{color:#f1a98c}'
+'#dfz .f14t{margin:6px 0 4px;font:13px/1.35 "IM Fell English",Georgia,serif;color:#f3e6c8;max-width:34em}#dfz .f14t em{display:block;font-style:italic;color:#e8c987;margin-top:2px}'
+'#dfz .fz-out{position:relative}#dfz .f14m{position:absolute;left:-6px;bottom:-6px;font:700 13px/1 Cinzel,serif;color:#fff1d0;background:#7a2c1a;border:1px solid #f0b48a;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-style:normal}'
+'#hand .card,#you .thing{position:relative}'
+'.f14law{margin-top:1em}.f14law ol{padding-left:1.2em}.f14law li{margin:.3em 0}.f14ch{border-collapse:collapse;margin:.6em 0;font-size:.92em}.f14ch caption{text-align:left;font-style:italic;padding-bottom:.3em}.f14ch th{text-align:left;padding:2px 10px 2px 0;font-weight:600;white-space:nowrap}.f14ch td{padding:2px 8px;border-left:1px solid rgba(128,100,60,.35)}.f14ch td.q{font-style:italic}';
(document.head||document.documentElement).appendChild(css);
})();
