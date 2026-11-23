/* Rules check: watches the duel engine and flags anything the rules can't explain.
   Off by default. Turn it on in the settings ("Rules check"); it is stored under its own key (wa-dt-rulescheck) and never touches saved progress.
   The simulator turns it on with window.RCSIM=1 and reads window.RC.log. */
(function(){
'use strict';
const RC=window.RC={log:[],blocks:[],dmg:[],depth:0,on:false};
const KEY='wa-dt-rulescheck';
RC.on=!!window.RCSIM;try{if(localStorage.getItem(KEY)==='1')RC.on=true;}catch(e){}
RC.set=function(v){RC.on=!!v||!!window.RCSIM;try{if(v)localStorage.setItem(KEY,'1');else localStorage.removeItem(KEY);}catch(e){}};
const isGr=t=>t.props.includes('ground')||t.props.includes('spell');
const flyP=t=>t.props.includes('flying')||t.props.includes('bird');
const nameOf=t=>t?(t.title||t.w):'?';
const STLIM={frozen:2,asleep:3,bound:2,blind:2};
let ACT=null;
function snap(S){return{life:S.players.map(p=>p.life),ink:S.players.map(p=>p.ink),hand:S.players.map(p=>p.hand.slice()),
  things:S.things.map(t=>({id:t.id,w:t.w,side:t.side,owner:t.owner,vig:t.vig,st:Object.assign({},t.st),props:t.props.slice(),inN:(t.inCards||[]).length,fresh:t.fresh,acted:t.acted,quick:!!(t.st&&t.st.quick)})),turn:S.turn};}
function cards(S,i){const p=S.players[i];let n=p.hand.length+p.deck.length+p.discard.length+(p.silence||[]).length+(p.veil?1:0)+(p.fell?1:0);
  for(const t of S.things)if(!t.token&&t.owner===i)n+=1;for(const t of S.things)if(t.owner===i&&t.inCards)n+=t.inCards.length;
  if(S.clime&&S.clime.owner===i)n+=1;return n;}
function short(S){return S.things.map(t=>(t.side?'R:':'Y:')+nameOf(t)+' '+t.vig+(Object.keys(t.st).filter(k=>t.st[k]).length?'['+Object.keys(t.st).filter(k=>t.st[k]).join(',')+']':'')).join('; ')+' | life '+S.players[0].life+'/'+S.players[1].life;}
function flag(S,type,card,msg){const e={type,card:card||'',msg,act:ACT?ACT.label:'',turn:S.turn,board:short(S)};RC.log.push(e);if(RC.log.length>4000)RC.log.shift();try{if(RC.onFlag)RC.onFlag(e);}catch(x){}return e;}
RC.flag=flag;
/* ---- block legality ---- */
function blockWhy(S,a,b,verb,via){const bad=[],why=[];
  if(!a||!b)return{ok:true,why:'no attacker'};
  const aF=flies(a),bF=flies(b);
  if(b.side===a.side)bad.push('blocker is on the attacker’s side');
  if(inert(b))bad.push(nameOf(b)+' is '+(b.st.asleep?'asleep':b.st.frozen?'frozen':b.st.bound?'bound':b.st.blind?'blinded':'stone'));
  if(a.st.occult)bad.push(nameOf(a)+' is hidden: it cannot be blocked');
  if(a.props.includes('stealth'))bad.push(nameOf(a)+' moves unseen');
  if(ghost(a))bad.push(nameOf(a)+' is a spirit: nothing can block it');
  if(['seep','scorch'].includes(verb))bad.push(verb+': nothing can block it');
  if(aF&&!bF)bad.push(nameOf(a)+' flies and '+nameOf(b)+' does not: only a flyer can stop a flyer');
  if(!aF&&bF&&!b.st.guarding)bad.push(nameOf(b)+' is up in the air and not on guard: it cannot stand in the way of something on the ground');
  if(b.props.includes('fleeting'))bad.push(nameOf(b)+' is fleeting');
  if(via!=='guard'&&ghost(b))bad.push(nameOf(b)+' is a spirit and cannot step in');
  if(S.braveNow)bad.push('courage: nothing can stand in its way');
  if(S.players[a.side]&&S.players[a.side].gnosis)bad.push('gnosis: nothing can step in this turn');
  if(via==='guard')why.push(nameOf(b)+' is on guard');else if(via==='chosen')why.push(nameOf(b)+' was chosen to defend');else why.push(nameOf(b)+' stepped in ('+via+')');
  if(aF&&bF)why.push('both fly');else if(!aF&&bF)why.push(nameOf(b)+' flies but is on guard');else if(!aF)why.push(nameOf(a)+' is on the ground');
  return{ok:!bad.length,why:why.join('; '),bad:bad.join('; ')};}
RC.blockWhy=blockWhy;
function hook(){
  if(RC.hooked)return;RC.hooked=true;
  const _bo=blockOf;blockOf=function(S,o,c,a){const r=_bo.apply(this,arguments);try{if(RC.on&&!S.quiet&&o&&o.k==='p'&&r&&r.k==='t'&&a&&a.k==='t'){const b=r.t,via=b.st.guarding?'guard':(c&&c.def===b.id)?'chosen':'place';
      const v=typeof CURV!=='undefined'?CURV:null;const w=blockWhy(S,a.t,b,v,via);const rec={turn:S.turn,att:nameOf(a.t),attSide:a.t.side,blocker:nameOf(b),verb:v,via,ok:w.ok,why:w.why,bad:w.bad||''};RC.blocks.push(rec);if(RC.blocks.length>20000)RC.blocks.shift();
      if(!w.ok)flag(S,'illegalBlock',b.w,nameOf(b)+' blocked '+nameOf(a.t)+' ('+v+'): '+w.bad);}}catch(e){}return r;};
  const _ps=poison;poison=function(S,e,m){const r=_ps.apply(this,arguments);try{if(RC.on&&!S.quiet&&e&&e.k==='t'&&e.t&&(e.t.st.poisoned||0)>3)flag(S,'poisonCap',e.t.w,nameOf(e.t)+' holds '+e.t.st.poisoned+' doses (max 3).');}catch(x){}return r;};
  const live=X=>{try{return X===S;}catch(e){return false;}};
  const wrap=(name,label)=>{const f=window[name];window[name]=function(S){if(!RC.on||RC.depth>0||!S||!S.players||S.quiet||window.DTVDRY||!live(S)){RC.depth++;try{return f.apply(this,arguments);}finally{RC.depth--;}}
    const pre=snap(S),c0=[cards(S,0),cards(S,1)];ACT=label(S,arguments);RC.depth++;let r;try{r=f.apply(this,arguments);}finally{RC.depth--;}
    try{check(S,pre,c0,ACT,r);}catch(e){flag(S,'checkError','',String(e&&e.message||e));}ACT=null;return r;};};
  wrap('resolve',(S,a)=>{const who=a[1],sen=a[2]||{},h=S.players[who].hand;const ws=[];for(const r of [sen.subj,sen.obj])if(r&&r.k==='card'&&h[r.i])ws.push(h[r.i]);if(sen.verb!=null)ws.push(h[sen.verb]);for(const i of sen.adjs||[])ws.push(h[i]);if(sen.clime!=null)ws.push(h[sen.clime]);
    const st=sen.subj&&sen.subj.k==='thing'?findThing(S,sen.subj.id):null;const v=sen.kverb||(sen.verb!=null?h[sen.verb]:null);
    return{kind:'say',who,verb:v,subj:st,card:ws[0]||(st&&st.w)||'',words:ws,label:(who===0?'You: ':'Rival: ')+(st?nameOf(st)+' ':'')+ws.join(' ')+(sen.kverb?' '+sen.kverb:'')};});
  wrap('startTurn',(S,a)=>({kind:'start',who:a[1],label:'start of '+(a[1]===0?'your':'rival')+' turn'}));
  wrap('endTurn',(S,a)=>({kind:'end',who:a[1],label:'end of '+(a[1]===0?'your':'rival')+' turn'}));
  wrap('react',(S,a)=>({kind:'fuse',who:a[1],label:'fusion by '+(a[1]===0?'you':'rival')}));
}
const TAKERS=['lure','tame','summon'];
function check(S,pre,c0,act,r){
  const okSay=act.kind!=='say'||(r&&r.ok!==false);
  for(let i=0;i<2;i++){const p=S.players[i];
    if(!Number.isFinite(p.life)||!Number.isInteger(p.life))flag(S,'badLife',act.card,(i?'Rival':'Your')+' life is '+p.life+'.');
    if(!Number.isFinite(p.ink)||p.ink<0||!Number.isInteger(p.ink))flag(S,'badBreath',act.card,(i?'Rival':'Your')+' breath is '+p.ink+' (was '+pre.ink[i]+', well '+(p.well||0)+').');}
  const ids={};let n=[0,0];
  for(const t of S.things){
    if(ids[t.id])flag(S,'dupThing',t.w,'Two things share id '+t.id+'.');ids[t.id]=1;
    if(t.side!==0&&t.side!==1)flag(S,'badSide',t.w,nameOf(t)+' has side '+t.side+'.');
    if(t.owner!==0&&t.owner!==1)flag(S,'badOwner',t.w,nameOf(t)+' has owner '+t.owner+'.');
    if(!Number.isFinite(t.vig)||!Number.isInteger(t.vig))flag(S,'badVigour',t.w,nameOf(t)+' has vigour '+t.vig+'.');
    else if(t.vig<=0)flag(S,'deadStanding',t.w,nameOf(t)+' stands with '+t.vig+' vigour.');
    if((t.st.poisoned||0)>3)flag(S,'poisonCap',t.w,nameOf(t)+' holds '+t.st.poisoned+' doses.');
    if(!isGr(t)&&t.w!=='ash')n[t.side]++;
    const was=pre.things.find(x=>x.id===t.id);
    if(was&&was.side!==t.side){const v=act.verb;const ok=(act.kind==='say'&&(TAKERS.includes(v)||act.words.includes('lure')||act.words.includes('tame')||act.words.includes('summon')))||(act.kind==='start'&&S.things.some(x=>x.props.includes('magnet')&&x.side===t.side));
      if(!ok)flag(S,'sideChange',t.w,nameOf(t)+' moved to '+(t.side===0?'your':'the rival’s')+' side.');}
    if(was&&was.owner!==t.owner&&!(was.side!==t.side))flag(S,'ownerChange',t.w,nameOf(t)+' changed keeper without changing side.');
    if(act.kind==='end'&&act.who===t.side){t.rcT=(t.rcT||0)+1;if(t.props.includes('fleeting')&&t.rcT>3)flag(S,'overstay',t.w,nameOf(t)+' is fleeting but has stood for '+t.rcT+' turns.');
      if(t.props.includes('spell')&&/Lasts 4 turns/.test((W[t.w]||{}).gloss||'')&&t.rcT>5)flag(S,'overstay',t.w,nameOf(t)+' should last 4 turns but has stood for '+t.rcT+'.');}
    for(const k in STLIM){if(t.st[k]){const a=t.rcAge=t.rcAge||{};if(act.kind==='end'&&act.who===t.side)a[k]=(a[k]||0)+1;if(a[k]>STLIM[k]+(k==='asleep'&&t.st.torpid?1:0))flag(S,'stuckStatus',t.w,nameOf(t)+' has been '+k+' for '+a[k]+' of its turns.');}else if(t.rcAge&&t.rcAge[k])t.rcAge[k]=0;}
  }
  for(let i=0;i<2;i++)if(n[i]>MAXFIELD)flag(S,'overfull',act.card,(i?'Rival':'Your')+' side holds '+n[i]+' things (max '+MAXFIELD+').');
  /* attacks: fresh things and things that already acted */
  if(act.kind==='say'&&okSay&&act.subj&&ATTACKV.includes(act.verb)){const t=act.subj,w=pre.things.find(x=>x.id===t.id);
    if(w&&okSay&&S.things.includes(t)&&t.side===act.who){if(w.fresh&&!t.props.includes('swift')&&!w.quick&&!(act.words||[]).includes('quick'))flag(S,'freshAttack',t.w,nameOf(t)+' attacked on the turn it arrived without being swift.');
      if(w.acted&&!w.quick)flag(S,'doubleAct',t.w,nameOf(t)+' attacked after it had already acted this turn.');}}
  /* nothing gained or lost by accident */
  const c1=[cards(S,0),cards(S,1)];
  for(const x of pre.things)if(x.inN&&!S.things.some(t=>t.id===x.id))c0[x.owner]-=x.inN;
  if(c1[0]!==c0[0]||c1[1]!==c0[1]){const d=[c1[0]-c0[0],c1[1]-c0[1]];const v=act.verb,ws=act.words||[];
    const steal=act.kind==='say'&&(v==='steal')&&d[act.who]===1&&d[1-act.who]===-1;
    const take=act.kind==='say'&&(TAKERS.includes(v))&&d[act.who]+d[1-act.who]===0;
    if(!steal&&!take)flag(S,'cardCount',act.card,'Cards changed: you '+(d[0]>=0?'+':'')+d[0]+', rival '+(d[1]>=0?'+':'')+d[1]+'.');}
}
RC.check=check;RC.cards=cards;
/* ---- the switch, and the warning shown during your own play ---- */
function ui(){try{const p=document.querySelector('.dtvp');if(p&&!p.querySelector('.rc-sw')){const d=document.createElement('div');d.className='rc-sw';
    d.innerHTML='<label><input type="checkbox"'+(RC.on?' checked':'')+'> <b>Rules check</b></label><span>Shows a small warning whenever a rule breaks in your duel. Off by default.</span>';
    p.appendChild(d);d.querySelector('input').onchange=e=>{e.stopPropagation();RC.set(e.target.checked);};d.onclick=e=>e.stopPropagation();}}catch(e){}}
setInterval(ui,700);
const css=document.createElement('style');css.textContent='.rc-sw{margin-top:10px;padding-top:10px;border-top:1px solid rgba(230,196,94,.3);display:flex;flex-direction:column;gap:4px}.rc-sw label{display:flex;align-items:center;gap:8px;cursor:pointer;color:#f3e4c2;font:600 14px "Alegreya Sans",sans-serif}.rc-sw label b{display:inline;margin:0;font-size:13px;letter-spacing:.12em}.rc-sw input{width:18px;height:18px;accent-color:#d14a35}.rc-sw span{font-size:13px;line-height:1.35;color:#e8dcc0}'
 +'#rc-warn{position:fixed;left:12px;bottom:12px;z-index:9999;max-width:min(420px,calc(100vw - 24px));display:flex;flex-direction:column;gap:6px;pointer-events:none}'
 +'#rc-warn .rcw{pointer-events:auto;background:#1a0f08;color:#fbeedd;border:1px solid #d14a35;border-left:4px solid #e0643f;border-radius:8px;padding:8px 30px 8px 10px;font:500 13px/1.35 "Alegreya Sans",sans-serif;box-shadow:0 6px 18px rgba(0,0,0,.45);position:relative}'
 +'#rc-warn .rcw b{display:block;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:#ffb59c;margin-bottom:2px}#rc-warn .rcw i{display:block;font-style:normal;color:#e8dcc0;font-size:12px;margin-top:3px}#rc-warn button{position:absolute;top:4px;right:6px;background:none;border:0;color:#fbeedd;font-size:16px;cursor:pointer;padding:2px 4px}';
(document.head||document.documentElement).appendChild(css);
RC.onFlag=function(e){if(window.RCSIM)return;try{let box=document.getElementById('rc-warn');if(!box){box=document.createElement('div');box.id='rc-warn';box.setAttribute('role','status');box.setAttribute('aria-live','polite');document.body.appendChild(box);}
  const el=document.createElement('div');el.className='rcw';const esc=x=>String(x).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  el.innerHTML='<b>Rules check'+(e.card?' · '+esc(e.card):'')+'</b>'+esc(e.msg)+(e.act?'<i>During: '+esc(e.act)+'</i>':'')+'<button aria-label="Dismiss">×</button>';el.querySelector('button').onclick=()=>el.remove();
  box.appendChild(el);while(box.children.length>4)box.firstChild.remove();setTimeout(()=>el.remove(),15000);}catch(x){}};
if(typeof resolve==='function')hook();else document.addEventListener('DOMContentLoaded',hook);
})();
