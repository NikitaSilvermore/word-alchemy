/* Board mock-up: the duel test (v5 rules) re-laid out in the other board's shape.
   Rails left (rival top, you bottom), rows in the centre with the air strip between,
   hand along the bottom, End turn + fusion + Chronicle on the right, market open any time. */
(function(){
'use strict';
if(!(window.DTV>=6))return;
window.MOCKB=true;
const $i=id=>document.getElementById(id);
function side(){let s=$i('mside');const tb=$i('table');if(!tb)return null;
  if(!s){s=document.createElement('div');s.id='mside';s.innerHTML='<div id="mend"></div>';tb.appendChild(s);}
  if(!$i('mmat')){const m=document.createElement('div');m.id='mmat';m.setAttribute('aria-hidden','true');tb.insertBefore(m,tb.querySelector('.board'));}
  tb.classList.remove('nochron');
  const ch=tb.querySelector('.chron');if(ch&&ch.parentNode!==s)s.appendChild(ch);
  const fz=$i('dfz');if(fz&&fz.parentNode!==s)s.insertBefore(fz,ch||null);
  return s;}
function endBtn(){const s=side();if(!s)return;const m=$i('mend'),b=document.querySelector('#bench [data-act="end"]');
  if(b){m.innerHTML='';m.appendChild(b);}
  else if(!document.querySelector('#bench .btns.acts')){const play=S&&S.phase==='play';
    m.innerHTML='<button class="btn wax" data-act="end" disabled>'+(S&&S.phase==='bot'?'Rival’s turn':S&&S.phase==='over'?'Over':'Wait')+'</button>';}}
function ground(){for(const id of ['rival','you']){const L=$i(id);if(!L)continue;
  const zg=L.querySelector('.zg .ztiles'),zs=L.querySelector('.zs .ztiles');const its=[...(zg?zg.querySelectorAll(':scope>.thing'):[]),...(zs?zs.querySelectorAll(':scope>.thing'):[])];
  let g=L.querySelector(':scope>.mground');if(!g){g=document.createElement('div');g.className='mground';L.appendChild(g);}
  const cap=MAXGROUND+MAXSPELL;g.innerHTML='<div class="mgh"><b>Ground</b><span>'+its.length+' of '+cap+'</span></div><div class="mgt" data-n="'+its.length+'"></div>';
  g.title='The ground: elements, what they make, and standing spells. Nothing here attacks, blocks or can be attacked. Spells fade after '+SPELLTURNS+' of their keeper’s turns.';
  const t=g.querySelector('.mgt');if(!its.length)t.innerHTML='<span class="mge">'+(id==='you'?'Bare. Elements and spells you speak settle here.':'Bare')+'</span>';else its.forEach(x=>t.appendChild(x));}
  {const bn=$i('bench');if(bn){let g=bn.querySelector('.mguide');if(!g){g=document.createElement('div');g.className='mguide';bn.appendChild(g);}
    const L=(S.log||[]).filter(l=>l.k!=='t').slice(-4).map(l=>'<p>'+esc(l.x)+'</p>').join('');
    g.innerHTML='<b>'+(S.phase==='play'&&S.active===0?'Your turn':S.phase==='bot'?'The rival is speaking':'The table')+'</b>'+L;g.scrollTop=g.scrollHeight;}}
  const c=document.querySelector('#clime>small');if(c)c.innerHTML='Sky<em>Round '+Math.max(1,Math.ceil(S.turn/2))+'</em>';const n=document.querySelector('#clime .wxnone b');if(n)n.textContent='Clear sky';
  const n2=document.querySelector('#clime .wxnone span');if(n2)n2.textContent='No weather or season has been spoken.';}
function courage(){const y=$i('youhead');if(!y)return;let c=y.querySelector('.mcour');const on=typeof brave==='function'&&S&&S.phase==='play'&&S.active===0&&brave(S,0);
  if(!on){if(c)c.remove();return;}if(!c){c=document.createElement('div');c.className='mcour';y.appendChild(c);}c.innerHTML='<b>Courage</b><span>Your next sentence costs nothing and can’t be blocked.</span>';}
function mkt(){const tb=$i('table');if(!tb||typeof S==='undefined'||!S)return;let b=$i('mkt');
  if(!b){b=document.createElement('button');b.id='mkt';b.type='button';b.setAttribute('data-mk','open');tb.appendChild(b);}
  const p=S.players[0],n=(S.shop||[]).length,cheap=(S.shop||[]).filter(w=>price(w)<=p.coins).length;
  b.innerHTML='<img src="assets/fam.jpg" alt=""><b>Market</b><span><i>'+p.coins+'</i> ink'+(n?' · '+cheap+' of '+n+' affordable':'')+'</span>';
  b.classList.toggle('can',cheap>0&&S.phase==='play');
  const d=$i('mdraw');if(d&&!d.hidden)drawer();}
function drawer(){const tb=$i('table');let d=$i('mdraw');
  if(!d){d=document.createElement('div');d.id='mdraw';d.hidden=true;tb.appendChild(d);}
  const p=S.players[0],play=S.phase==='play';
  d.innerHTML='<div class="mdh"><img src="assets/fam.jpg" alt=""><div><h2>'+esc(famName(true))+'’s market</h2><p>“'+esc(famLine(p.coins))+'”</p></div><span class="mink"><i>'+p.coins+'</i> ink</span><button class="mx" data-mk="close" aria-label="Close the market">×</button></div>'
   +'<div class="mcards">'+(S.shop||[]).map((w,i)=>'<div class="mslot'+(price(w)>p.coins||!play?' dear':'')+'">'+cardHtml(w,i,'buy')+'</div>').join('')+'</div>'
   +'<div class="mfoot"><span>'+(play?'Buy any time in your turn. A word you buy goes straight into your hand.':'The market opens again on your turn.')+'</span><button class="btn ghost" data-act="refresh"'+(p.coins<1||!play?' disabled':'')+'>Send her out again · 1 ink</button><button class="btn" data-mk="close">Back to the table</button></div>';}
document.addEventListener('click',e=>{const k=e.target.closest&&e.target.closest('[data-mk]');
  if(k){e.preventDefault();e.stopPropagation();const d=$i('mdraw')||(drawer(),$i('mdraw'));
    if(k.dataset.mk==='open'){drawer();d.hidden=!d.hidden;sfx(d.hidden?'tick':'page');}else{d.hidden=true;sfx('tick');}return;}
  const b=e.target.closest&&e.target.closest('#mdraw [data-act="buy"],#mdraw [data-act="refresh"]');
  if(b&&(!S||S.phase!=='play')){e.preventDefault();e.stopPropagation();sfx('nope');}},true);
addEventListener('keydown',e=>{if(e.key==='Escape'){const d=$i('mdraw');if(d&&!d.hidden){d.hidden=true;}}});
/* fit the 1920 x 1080 table to the window */
const _fit=fit;
fit=function(){try{document.body.classList.add('mock');document.body.classList.toggle('dtv7',window.DTV>=7);document.body.classList.toggle('dtv9',window.DTV>=9);if(typeof ARTAS!=='undefined')ARTAS.plants='worts';}catch(e){}
  if(typeof view==='undefined'||view!=='match'){return _fit.apply(this,arguments);}
  document.body.classList.add('induel');const t=document.querySelector('.table');if(!t)return;
  const z=Math.max(.3,Math.min(innerWidth/1920,innerHeight/1080));t.style.zoom=z;
  t.style.marginLeft=Math.max(0,(innerWidth/z-1920)/2)+'px';t.style.marginTop=Math.max(0,(innerHeight/z-1080)/2)+'px';
  const hd=$i('hand');if(hd){const n=hd.querySelectorAll('.card').length;hd.style.setProperty('--ov',n>1?Math.max(0,Math.ceil((n*168-hd.clientWidth)/(n-1)))+'px':'0px');}
  document.documentElement.style.overflowY='hidden';};
const _rm=renderMatch;
renderMatch=function(){_rm.apply(this,arguments);try{side();endBtn();mkt();ground();courage();if(window.dtvDecorate)dtvDecorate();}catch(e){console.error(e);}};
addEventListener('resize',()=>{try{fit();}catch(e){}});
document.addEventListener('DOMContentLoaded',()=>{document.body.classList.add('mock');const s=document.createElement('style');s.textContent=window.MOCKCSS||'';document.head.appendChild(s);});

/* ---- inspector: hover a card on the table or in hand: it shows big, and its back shows everything about it ---- */
function insHtml(el,ov){
  if(el.closest&&el.closest('#dfz')){const p=S.players[0],sk=el.closest('.fz-sock'),fake=w=>({dataset:{pv:w},classList:{contains:()=>false},closest:()=>null});
    if(sk){const k=[...document.querySelectorAll('#dfz .fz-sock')].indexOf(sk),q=(p.vat||[])[k];if(!q)return null;
      if(q.k==='thing'){const t=S.things.find(x=>String(x.id)===String(q.id)),te=document.querySelector('#table .thing[data-id="'+q.id+'"]');if(!t||!te)return null;const h=insHtml(te);if(h)h.front='<div class="ifr3">'+miniFace(t.w,{vig:t.vig,title:t.title||t.w})+'</div>';return h;}
      const w=p.hand[q.i];return W[w]?insHtml(fake(w)):null;}
    const o=window.DTVOUT;if(!o||!o.w||!W[o.w])return null;const h=insHtml(fake(o.w),{vig:o.vig,made:true,name:o.name});if(h)h.front='<div class="ifr3">'+miniFace(o.w,{vig:o.vig,title:o.name||o.w})+'</div>';return h;}const pr=x=>esc(String(x)),row=(k,v)=>v?'<div class="ir"><b>'+k+'</b><span>'+v+'</span></div>':'';const ladRow=w=>{const f=window.DTVLADOF&&window.DTVLADOF(w);if(!f)return '';return '<h5>'+f[0]+' ladder</h5><p class="ilad">'+f[1].map(x=>x===w?'<b>'+pr(x)+'</b>':pr(x)).join(' → ')+'</p>';};const pp=a=>a.map(p=>p==='named'?'protected':p);const schL=w=>{if(!(window.DTV>=9)||!window.DTVSC)return '';const k=DTVSCHOOL(w),c=DTVSC[k];return c?'<span class="isch">'+DTVGEM(k)+'<b style="color:'+(k==='word'||k==='air'?'#e8dcc0':c[1])+'">'+c[0]+'</b></span> · ':'';};
  if(el.classList.contains('thing')){const id=el.dataset.id;const t=S.things.find(x=>String(x.id)===String(id));if(!t)return null;const d=W[t.w]||{},base=d.vig||0,nm=t.title||t.w;
    const chips=[...el.querySelectorAll('.states i')].map(i=>'<li><b>'+pr(i.textContent.trim())+'</b>'+(i.title&&i.title!==i.textContent.trim()?' · '+pr(i.title):'')+'</li>').join('');
    const kn=(t.verbs||[]).map(v=>{const inn=(v==='strike'&&t.inn)||(t.innv||[]).includes(v);return '<li><b>'+pr(v)+'</b>'+(inn?' · born knowing it':' · learned')+(v==='strike'&&t.inn&&t.fresh?' · next turn':'')+'</li>';}).join('');
    const ab=(()=>{try{return abilities(t.props,t.st).join(', ');}catch(e){return '';}})();
    const inh={};for(const g of t.inh||[]){const [w,p]=g.split(':');(inh[w]=inh[w]||[]).push(p);}
    const back='<div class="ib"><h4>'+pr(Cap(nm))+'</h4><p class="ik">'+schL(t.w)+(t.side===0?'Yours':'The rival’s')+' · '+pr(pp((t.props||[]).filter(p=>!['living'].includes(p))).slice(0,6).join(', '))+'</p>'
      +(window.DTV>=10&&window.MT?'<div class="iv im"><i>'+MT(t)+'</i><span>might · how hard it hits</span></div>':'')+'<div class="iv"><i>'+t.vig+'</i><span>vigour'+(t.vig!==base?' · '+(t.vig>base?'+':'')+(t.vig-base)+' on its printed '+base:'')+'</span></div>'
      +(t.acted?'<p class="ist">Has acted this turn</p>':t.fresh&&t.inn?'<p class="ist">Just arrived: it can strike next turn</p>':'')
      +(kn?'<h5>Knows</h5><ul>'+kn+'</ul>':'')
      +(chips?'<h5>On it now</h5><ul>'+chips+'</ul>':'')
      +(t.parts?'<h5>Made from</h5><p>'+pr(t.parts.join(' + '))+'</p>':'')
      +(t.traits&&t.traits.length?'<h5>Traits</h5><p>'+pr(t.traits.join(', '))+'</p>':'')
      +(Object.keys(inh).length?'<h5>Kept from its makings</h5><ul>'+Object.keys(inh).map(w=>'<li><b>'+pr(w)+'</b> · '+pr(inh[w].join(', '))+'</li>').join('')+'</ul>':'')
      +(ab?'<h5>Can</h5><p>'+pr(ab)+'</p>':'')+ladRow(t.w)+(window.DTV>=9&&t.side===0&&window.dtvEvoCost&&dtvEvoCost(S,t)!=null?'<p class="ist">Evolve: '+dtvEvoCost(S,t)+' breath'+(t.evoT===S.turn?' (next turn)':'')+'</p>':'')+(t.wxb?'<p class="ist">Weather: '+(t.wxb>0?'+':'')+t.wxb+' from '+Cap(S.clime.w)+'</p>':'')+(t.st&&t.st.guarding&&window.DTV>=8?'<p class="ist">On guard: 30% stronger</p>':'')
      +(d.gloss?'<p class="ig">'+pr(d.gloss)+'</p>':'')+'</div>';
    return {front:'',back};}
  const ix=+el.dataset.i,w=!el.closest('#mdraw')&&!el.closest('#hand')?el.dataset.pv:el.closest('#mdraw')?(S.shop||[])[ix]:el.closest('#hand')?S.players[0].hand[ix]:el.dataset.pv;if(!w||!W[w])return null;const d=W[w];
  let rx='';try{const B=(window.WEB21||{}).base||{},o=[];for(const k in B){const [a,b]=k.split('|');if(a===w||b===w){o.push((a===w?b:a)+' → '+B[k][0]);if(o.length>=6)break;}}if(o.length)rx='<h5>Fuses with</h5><ul>'+o.map(x=>'<li>'+pr(x)+'</li>').join('')+'</ul>';}catch(e){}
  const ab=d.t===NOUN?(()=>{try{return abilities(d.props,{}).join(', ');}catch(e){return '';}})():'';
  const back='<div class="ib"><h4>'+pr(Cap(ov&&ov.name?ov.name:w))+'</h4><p class="ik">'+schL(w)+pr(d.t==='adj'?'adjective':d.t==='clime'?'weather':d.t==='cat'?'category':(window.DTVSPELLV&&window.DTVSPELLV(w))?'spell · cast it on a thing':d.t)+' · '+(d.syl||1)+' breath'+(d.t===NOUN?' · '+pr(pp(d.props||[]).slice(0,6).join(', ')):'')+'</p>'
    +(window.DTV>=10&&window.MTW&&d.t===NOUN&&d.vig!=null&&!(d.props||[]).includes('spell')&&!(d.props||[]).includes('event')&&!(d.props||[]).includes('ground')?'<div class="iv im"><i>'+MTW(w,ov&&ov.vig!=null?ov.vig:d.vig+2*upOf(S,0,w))+'</i><span>might · how hard it hits</span></div>':'')+(d.t===NOUN&&d.vig!=null&&!(d.props||[]).includes('spell')?'<div class="iv"><i>'+(ov&&ov.vig!=null?ov.vig:d.vig+2*upOf(S,0,w))+'</i><span>vigour'+(ov&&ov.made?' when it is made':'')+'</span></div>':'')
    +(DTVINNV&&DTVINNV[w]?'<h5>Born knowing</h5><p>'+pr(DTVINNV[w].filter(v=>v!=='+').join(', '))+(DTVINNV[w].includes('+')?' (and strike)':' (no strike)')+'</p>':'')
    +(ab?'<h5>Can</h5><p>'+pr(ab)+'</p>':'')+(d.t===NOUN?ladRow(w):'')+rx+(d.gloss?'<p class="ig">'+pr(d.gloss)+'</p>':'')+'</div>';
  return {front:'<div class="ifr2">'+fullFace(w,{ink:d.syl,lv:0})+'</div>',back};}
let insEl=null,insT=null;
function insHide(){clearTimeout(insT);insEl=null;const p=$i('dins');if(p)p.className='';}
function insShow(el){if(!document.body.contains(el)||typeof S==='undefined'||!S)return;const h=insHtml(el);if(!h)return;let p=$i('dins');if(!p){p=document.createElement('div');p.id='dins';document.body.appendChild(p);}
  p.innerHTML=(h.front?'<div class="if">'+h.front+'</div>':'')+h.back;p.className='on';const r=el.getBoundingClientRect(),pw=p.offsetWidth||620,ph=p.offsetHeight||420;
  const big=el.classList.contains('thing')&&!el.closest('#dfz')?Math.round(r.width*2.15+16):0;let x=r.right+16+big;if(x+pw>innerWidth-8)x=r.left-pw-16;if(x<8)x=Math.max(8,(innerWidth-pw)/2);let y=r.top+r.height/2-ph/2;y=Math.max(8,Math.min(innerHeight-ph-8,y));p.style.left=x+'px';p.style.top=y+'px';}
document.addEventListener('mouseover',ev=>{if(!document.body.classList.contains('mock'))return;const el=ev.target.closest&&ev.target.closest('#rival .thing,#you .thing,.mground .thing,#hand .card,#mdraw .card,#dfz .fz-sock.on,#dfz .fz-out');if(el===insEl)return;insHide();if(!el||el.classList.contains('hidden'))return;insEl=el;insT=setTimeout(()=>insShow(el),260);});
document.addEventListener('pointerdown',insHide,true);addEventListener('scroll',insHide,true);
})();
