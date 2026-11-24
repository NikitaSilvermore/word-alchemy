/* Word Alchemy small-deck sandbox: a standalone duel engine.
   It is a model of the duel, not the live engine: a sentence is "thing", "thing + action", "quality + thing",
   a weather or a spell. Nothing here reads or writes the live game or its saves.
   Runs in Node (simulator) and in the browser (playable sandbox). */
(function(root,f){if(typeof module==='object'&&module.exports)module.exports=f();else root.WAS=f();})(this,function(){
'use strict';
const DB={},RX={},THEMES={},ORDER=[];
const CFG={life:30,hand:5,deck:10,dur:1.5,remember:true,grave:true,market:false,maxB:7,field:5,drawPer:2,fade:11,copies:1};
function def(id,o){o.id=id;o.kw=o.kw||[];o.on=o.on||{};DB[id]=o;ORDER.push(id);return o;}
function recipe(a,b,r){RX[a<b?a+'|'+b:b+'|'+a]=r;}
function rx(a,b){return RX[a<b?a+'|'+b:b+'|'+a]||null;}
/* ---- rng ---- */
function rnd(G){let t=G.s=(G.s+0x6D2B79F5)|0;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return((t^(t>>>14))>>>0)/4294967296;}
function shuffle(G,a){for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd(G)*(i+1));const x=a[i];a[i]=a[j];a[j]=x;}return a;}
/* ---- helpers ---- */
const is=(t,k)=>!!t.kw[k];
const mine=(G,p)=>G.pl[p].board;
const foes=(G,p)=>G.pl[1-p].board;
function seen(G,p){/* rival things p may single out */const o=G.pl[1-p].board,seer=G.pl[p].board.some(t=>t.kw.seer);return seer?o:o.filter(t=>!t.kw.hidden);}
const top=a=>{let b=null;for(const t of a)if(!b||t.st>b.st)b=t;return b;};
const low=a=>{let b=null;for(const t of a)if(!b||t.st<b.st)b=t;return b;};
const cnt=(a,k)=>{let n=0;for(const t of a)if(t.kw[k])n++;return n;};
function fire(G,t,k,a,b){const h=DB[t.id].on[k];if(h)h(G,t,a,b);if(t.also)for(const id of t.also){const g=DB[id].on[k];if(g)g(G,t,a,b);}}
function has(t,k){if(DB[t.id].on[k])return true;if(t.also)for(const id of t.also)if(DB[id].on[k])return true;return false;}
function say(G,x){if(G.log)G.log.push(x);}
const nm=t=>t.title||DB[t.id].name||t.id;
const who=(G,p)=>G.names?G.names[p]:(p?'Rival':'You');
function pile(G,p){return G.cfg.grave?G.pl[p].grave:G.pl[p].disc;}
/* ---- things ---- */
function mkThing(G,p,id){const d=DB[id];const st=Math.max(1,Math.round(d.st*(d.tok?1:G.cfg.dur)));
  const t={uid:G.uid++,id,own:p,st,mx:st,bsk:0,kw:{},q:[],v:[],fresh:true,acted:false,guard:true,wait:false,age:0,burn:0,psn:0,frz:0,wet:0,ctr:0,unbl:0,extra:0,inp:null,base:null,left:d.left||0};
  for(const k of d.kw)t.kw[k]=1;return t;}
function put(G,p,id,o){const P=G.pl[p];if(P.board.length>=G.cfg.field)return null;const t=mkThing(G,p,id);if(o&&o.inp)t.inp=o.inp;if(o&&o.ready)t.fresh=false;P.board.push(t);
  say(G,who(G,p)+': '+nm(t)+' arrives ('+strikeOf(G,t)+'/'+t.st+').');
  if(G.wx&&G.wx.id==='wind'&&t.kw.flying)t.fresh=false;
  fire(G,t,'arrive');
  for(const o2 of P.board.slice())if(o2!==t&&P.board.includes(o2)&&P.board.includes(t))fire(G,o2,'ally',t);
  for(const o2 of G.pl[1-p].board.slice())if(P.board.includes(t))fire(G,o2,'foe',t);
  return t;}
function strikeOf(G,t){const d=DB[t.id];let s=d.sk+t.bsk;if(t.kw.stoop&&t.wait)s+=2;if(d.on.atk)s+=d.on.atk(G,t);if(t.also)for(const id of t.also){const a=DB[id].on.atk;if(a)s+=a(G,t);}
  for(const v of t.v){const a=DB[v].atk;if(a)s+=a(G,t);}for(const q of t.q){const a=DB[q].atk;if(a)s+=a(G,t);}
  for(const o of G.pl[t.own].board){if(o===t)continue;const a=DB[o.id].on.aura;if(a)s+=a(G,o,t);if(o.also)for(const id of o.also){const a2=DB[id].on.aura;if(a2)s+=a2(G,o,t);}}
  if(G.wx){const a=DB[G.wx.id].atk;if(a)s+=a(G,t);}
  return s>0?s:0;}
function buff(G,t,sk,st){if(t.kw.measured){if(sk>0)sk=0;if(st>0)st=0;}t.bsk+=sk;if(st){t.st+=st;t.mx+=st;if(t.st<=0)kill(G,t);}}
function mend(G,t,n){const b=t.st;t.st=Math.min(t.mx,t.st+n);return t.st-b;}
function life(G,p,n){const P=G.pl[p];P.life=Math.min(G.cfg.life+10,P.life+n);if(G.st)G.st[p].heal+=n;}
function face(G,p,n,src,route){if(n<=0||G.over!=null)return 0;const P=G.pl[p];if(route==='burn'&&src!=='burning')for(const t of G.pl[1-p].board)if(t.kw.lens)n++;if(P.shield){const k=Math.min(P.shield,n);P.shield-=k;n-=k;if(n<=0)return 0;}P.life-=n;
  if(G.st&&src){const s=G.st[1-p];s.dmg[src]=(s.dmg[src]||0)+n;s.route[route||'strike']=(s.route[route||'strike']||0)+n;s.tot+=n;}
  say(G,who(G,p)+' lose'+(G.names?'s ':(p?'s ':' '))+n+' life'+(src?' ('+(DB[src]?DB[src].name:src)+')':'')+'.');
  for(const t of P.board.slice())if(P.board.includes(t)&&has(t,'owner'))fire(G,t,'owner',n);
  checkOver(G);return n;}
function hurt(G,t,n,src,re){if(n<=0)return 0;const P=G.pl[t.own];if(!P.board.includes(t))return 0;
  if(t.kw.living&&!t.kw.worldtree&&!re){const w=P.board.find(x=>x.kw.worldtree);if(w)return hurt(G,w,n,src,1);}
  if(t.kw.resonant&&!re){for(let s=0;s<2;s++)for(const x of G.pl[s].board.slice())if(x!==t&&x.id===t.id)hurt(G,x,n,src,1);}
  if(t.kw.armour)n=Math.max(1,n-1);
  if(t.kw.brittle&&!t.kw.annealed)n=t.st;
  if(t.kw.structure&&!t.kw.keystone&&n>=t.st&&P.board.some(x=>x.kw.keystone)){n=t.st-1;if(n<=0)return 0;}
  const d=Math.min(n,t.st);t.st-=n;if(G.st&&src){const s=G.st[1-t.own];s.tdmg[src]=(s.tdmg[src]||0)+d;}
  if(t.st<=0){if(G.st&&src){G.st[1-t.own].kills++;}kill(G,t,src);}return d;}
function route(G,p,id){/* where a card goes when it leaves play */if(!id||DB[id].tok||DB[id].made)return;pile(G,p).push(id);}
function leave(G,t){const P=G.pl[t.own];const i=P.board.indexOf(t);if(i<0)return false;P.board.splice(i,1);return true;}
function cardsOf(t){const o=[];if(t.tmp){for(const q of t.q)o.push(q);return o;}if(t.inp)for(const x of t.inp)o.push(x);else o.push(t.base||t.id);for(const q of t.q)o.push(q);return o;}
function kill(G,t,src){const P=G.pl[t.own];if(!leave(G,t))return;say(G,nm(t)+' is destroyed.');const d=DB[t.id];
  let kept=false;if(t.kw.undying&&!d.tok&&!t.tmp){kept=true;}else if(!d.tok&&!t.tmp&&!t.inp)for(const o of P.board.slice()){const h=DB[o.id].on.keep;if(h&&h(G,o,t)){kept=true;break;}}
  if(kept&&(!t.inp||d.made)){P.hand.push(d.made?t.id:(t.base||t.id));for(const q of t.q)route(G,t.own,q);say(G,nm(t)+' returns to its keeper’s hand.');}
  else for(const id of cardsOf(t))route(G,t.own,id);
  fire(G,t,'die',src);
  for(let s=0;s<2;s++)for(const o of G.pl[s].board.slice())if(G.pl[s].board.includes(o)&&has(o,'anyDie'))fire(G,o,'anyDie',t);
  if(G.st)G.st[t.own].lost++;}
function bounce(G,t){const P=G.pl[t.own];if(t.kw.named)return;if(!leave(G,t))return;const d=DB[t.id];if(t.tmp){for(const q of t.q)P.disc.push(q);return;}say(G,nm(t)+' goes back to its keeper’s hand.');
  if(d.tok)return;if(t.inp){for(const id of t.inp)P.disc.push(id);}else P.hand.push(t.base||t.id);for(const q of t.q)P.disc.push(q);}
function exile(G,t){leave(G,t);}
function psn(G,p,n){if(G.pl[p].board.some(t=>t.id==='salt'))return;G.pl[p].poison=Math.min(6,G.pl[p].poison+n);}
function tpsn(G,t,n){if(t.kw.living&&!t.kw.toxic&&!t.kw.glazed&&!G.pl[t.own].board.some(x=>x.id==='salt'))t.psn=Math.min(3,t.psn+n);}
function ign(G,t){if(!t.kw.fireborn&&!t.wet&&!t.kw.stone&&!t.kw.metal){t.burn=Math.max(t.burn,2);t.frz=0;}}
function frz(G,t){t.frz=t.wet?2:1;t.burn=0;}
function wet(G,t){if(t.kw.glazed)return;t.wet=3;t.burn=0;}
function draw(G,p,n){const P=G.pl[p];for(let k=0;k<n;k++){if(!P.deck.length){if(!P.disc.length)return;P.deck=shuffle(G,P.disc);P.disc=[];}const id=P.deck.pop();P.hand.push(id);if(G.st)G.st[p].drawn[id]=1;}}
function br(G,p,n){G.pl[p].breath=Math.max(0,G.pl[p].breath+n);}
function dis(G,p){const P=G.pl[p];if(!P.hand.length)return null;const i=Math.floor(rnd(G)*P.hand.length);const id=P.hand.splice(i,1)[0];P.disc.push(id);say(G,who(G,p)+' drop'+(G.names||p?'s':'')+' a word.');return id;}
function pack(G,p){if(!G.sup.length)return;const id=G.sup[(G.supI++)%G.sup.length];G.pl[p].hand.push(id);if(G.st)G.st[p].drawn[id]=1;}
function fetch(G,p,pred){const P=G.pl[p];for(const a of [P.deck,P.disc]){const i=a.findIndex(id=>pred(DB[id]));if(i>=0){P.hand.push(a.splice(i,1)[0]);return true;}}return false;}
function raise(G,p,pred,to){const a=pile(G,p);let k=-1;for(let i=a.length-1;i>=0;i--)if(pred(DB[a[i]])){k=i;break;}if(k<0)return null;
  const id=a[k];if(to==='board'){if(DB[id].type!=='thing'||G.pl[p].board.length>=G.cfg.field)return null;a.splice(k,1);if(G.st)G.st[p].raised++;return put(G,p,id);}
  a.splice(k,1);G.pl[p].hand.push(id);if(G.st)G.st[p].raised++;say(G,who(G,p)+': '+DB[id].name+' comes back from the '+(G.cfg.grave?'graveyard':'discard')+'.');return id;}
function evolve(G,t,to){const lost=t.mx-t.st,bst=t.mx-Math.max(1,Math.round(DB[t.id].st*G.cfg.dur));t.base=t.base||t.id;const was=nm(t);t.id=to;const d=DB[to];
  t.mx=Math.max(1,Math.round(d.st*G.cfg.dur))+bst;t.st=Math.max(1,t.mx-lost);for(const k of d.kw)t.kw[k]=1;t.age=0;say(G,was+' becomes '+nm(t)+'.');if(G.st){G.st[t.own].evo++;G.st[t.own].played[to]=1;}if(d.on.arrive)d.on.arrive(G,t);}
function checkOver(G){if(G.over!=null)return;const a=G.pl[0].life<=0,b=G.pl[1].life<=0;if(a&&b)G.over=2;else if(a)G.over=1;else if(b)G.over=0;}
/* ---- costs ---- */
function costOf(G,p,id){const d=DB[id],P=G.pl[p];let c=d.cost;if(d.type==='spell'||d.type==='weather'){for(const t of P.board)if(t.kw.cheapspell)c--;}
  if(d.type==='thing'&&d.kw.includes('structure')&&P.board.some(t=>t.id==='scaffold'))c--;
  if(P.red)c-=P.red;if(P.stam)c+=1;return c<0?0:c;}
function fuseCost(G,p,r){let c=DB[r].cost;for(const t of G.pl[p].board){if(t.kw.crucible||t.id==='scintilla'||t.id==='alchemist'||t.id==='lexicon'||t.id==='homunculus')c--;}return c<0?0:c;}
function speakers(P){let n=0;for(const t of P.board){if(t.kw.speaker)n++;if(t.kw.speaker2)n++;}return Math.min(3,n);}
/* ---- game ---- */
function newGame(cfg,d0,d1,seed,first,opt){const C=Object.assign({},CFG,cfg||{});opt=opt||{};
  const G={cfg:C,s:(seed|0)||1,turn:0,cur:first||0,first:first||0,over:null,uid:1,wx:null,mk:[],sup:[],supI:0,pl:[],st:null,log:opt.log?[]:null,names:opt.names||null};
  const decks=[d0,d1];for(let i=0;i<2;i++)G.pl.push({life:C.life,breath:0,maxB:0,spark:0,poison:0,tax:0,red:0,stam:0,shield:0,noblk:-1,fz:-1,cyc:-1,spells:0,pc:0,stamNext:0,deck:shuffle(G,decks[i].slice()),hand:[],disc:[],grave:[],board:[]});
  if(opt.stats!==false)G.st=[0,1].map(()=>({dmg:{},tdmg:{},route:{},tot:0,heal:0,drawn:{},played:{},order:[],fuse:0,evo:0,kills:0,lost:0,raised:0,bought:0,minDiff:0}));
  if(C.market){G.sup=shuffle(G,ORDER.filter(id=>!DB[id].th&&!DB[id].tok&&!DB[id].made&&DB[id].rar!=='S'));for(let i=0;i<4;i++)G.mk.push(G.sup[G.supI++]);}
  for(let i=0;i<2;i++){draw(G,i,C.hand);opening(G,i);}
  startTurn(G,G.cur);return G;}
function opening(G,p){const P=G.pl[p],ok=id=>DB[id].type==='thing'&&DB[id].cost<=2;if(P.hand.some(ok))return;const k=P.deck.findIndex(ok);if(k<0||!P.hand.length)return;let j=0;for(let i=1;i<P.hand.length;i++)if(DB[P.hand[i]].cost>DB[P.hand[j]].cost)j=i;const x=P.hand[j];P.hand[j]=P.deck[k];P.deck[k]=x;if(G.st){G.st[p].drawn[P.hand[j]]=1;}}
function startTurn(G,p){G.turn++;G.cur=p;const P=G.pl[p],C=G.cfg;P.maxB=Math.min(C.maxB,P.maxB+1);P.breath=P.maxB-P.tax+(G.turn===2?1:0);if(P.breath<0)P.breath=0;P.tax=0;P.red=0;P.stam=P.stamNext;P.stamNext=0;P.spells=0;P.pc=0;
  if(C.market)P.spark=Math.min(8,P.spark+1);
  const round=Math.ceil(G.turn/2);if(round>=C.fade){const n=round-C.fade+1;say(G,'The Fading: '+who(G,p)+' lose'+(G.names||p?'s ':' ')+n+'.');P.life-=n;checkOver(G);if(G.over!=null)return;}
  if(P.poison>0){face(G,p,Math.min(4,P.poison),'poison','poison');P.poison--;if(G.over!=null)return;}
  const clock=P.board.some(t=>t.kw.clock);
  for(const t of P.board.slice()){if(!P.board.includes(t))continue;t.wait=!t.acted&&!t.fresh;t.fresh=false;t.acted=false;t.guard=true;t.age++;
    if(t.frz>0){t.frz--;t.acted=true;}if(t.wet>0)t.wet--;
    if(t.burn>0){t.burn--;hurt(G,t,2,'burning');face(G,p,1,'burning','burn');if(G.over!=null)return;if(!P.board.includes(t))continue;}
    if(t.psn>0){hurt(G,t,t.psn,'poison');if(!P.board.includes(t))continue;}
    if(t.left>0){t.left--;if(t.left===0){say(G,nm(t)+' fades.');kill(G,t);continue;}}
    if(t.kw.bedrock&&t.ctr<3){t.ctr++;buff(G,t,0,1);}
    if(clock&&!t.kw.clock)t.age++;
    const d=DB[t.id];if(d.lad&&t.age>=d.lad.n){evolve(G,t,d.lad.to);}
    fire(G,t,'turn');if(clock&&!t.kw.clock&&P.board.includes(t)&&G.over==null)fire(G,t,'turn');if(G.over!=null)return;}
  if(G.wx){if(G.wx.own===p){G.wx.left--;}const h=DB[G.wx.id].turn;if(h)h(G,p);if(G.wx&&G.wx.left<=0){say(G,'The '+DB[G.wx.id].name+' passes.');G.wx=null;}if(G.over!=null)return;}
  if(G.turn>1){let n=C.drawPer;while(n-->0&&P.hand.length<C.hand)draw(G,p,1);}
  if(G.st){const d=G.pl[p].life-G.pl[1-p].life;if(d<G.st[p].minDiff)G.st[p].minDiff=d;if(-d<G.st[1-p].minDiff)G.st[1-p].minDiff=-d;}}
function endTurn(G){const p=G.cur,P=G.pl[p];for(const t of P.board.slice()){if(P.board.includes(t))fire(G,t,'end');if(!G.cfg.remember)t.v.length=0;}
  checkOver(G);if(G.over!=null)return;if(G.turn>=80){G.over=2;return;}startTurn(G,1-p);}
/* ---- moves ----
   {k:'play',i,t}  hand index i, on my thing uid t (actions, qualities on my own things)
   {k:'atk',t}  {k:'fuse',a,b} refs {h:i}|{b:uid}  {k:'buy',i}  {k:'cyc',i}  {k:'end'} */
function thing(G,p,uid){return G.pl[p].board.find(t=>t.uid===uid)||null;}
function canAtk(G,t){return !t.acted&&(!t.fresh||t.kw.swift)&&t.frz<=0&&!t.kw.structure&&strikeOf(G,t)>0;}
function blocker(G,t){const o=1-t.own,O=G.pl[o];if(O.noblk===G.turn)return null;const fl=t.kw.flying;let b=null;
  for(const x of O.board){if(!x.guard||x.frz>0)continue;if(fl&&!x.kw.flying&&!x.kw.reach)continue;if(x.kw.tiny&&!t.kw.tiny)continue;if(!b||(x.kw.guardian?1e3:0)+x.st>(b.kw.guardian?1e3:0)+b.st)b=x;}return b;}
function hitHooks(G,t,tg,d){fire(G,t,'hit',tg,d);for(const v of t.v.slice()){const f=DB[v].hit;if(f)f(G,t,tg,d);}for(const q of t.q.slice()){const f=DB[q].hit;if(f)f(G,t,tg,d);}}
function flag(t,k){for(const v of t.v)if(DB[v][k])return true;for(const q of t.q)if(DB[q][k])return true;return !!DB[t.id][k];}
function attack(G,t){const p=t.own,o=1-p,P=G.pl[p];let s=strikeOf(G,t);t.acted=true;if(t.extra){t.extra--;t.acted=false;}t.wait=false;if(!t.kw.guardian)t.guard=false;if(t.kw.hidden&&!DB[t.id].kw.includes('hidden'))delete t.kw.hidden;
  const fly=t.kw.flying;let nb=!!t.unbl;if(!nb){const u=DB[t.id].on.unbl;if(u&&u(G,t))nb=true;}if(!nb&&P.board.some(x=>x.kw.span)&&cnt(P.board,'structure')>=3)nb=true;if(!nb&&P.board.some(x=>x.kw.bridge))nb=true;let b=nb?null:blocker(G,t);t.unbl=0;let rt=fly?'over':'strike';
  if(b&&flag(t,'seep')){s=Math.ceil(s/2);b=null;rt='seep';}
  if(b){let d=s-(b.kw.guardian&&t.id!=='steel'?2:0);if(d<1)d=1;const before=b.st;say(G,nm(t)+' strikes; '+nm(b)+' stands in the way and takes '+Math.min(d,b.kw.brittle?before:d)+'.');
    const dealt=hurt(G,b,d,t.id);const alive=G.pl[o].board.includes(b);
    if(alive&&t.kw.toxic)tpsn(G,b,1);if(alive&&t.burn>0)ign(G,b);
    fire(G,b,'blk',t);if(b.kw.thorny&&P.board.includes(t))hurt(G,t,1,b.id);
    if(!alive&&d>before&&(t.kw.heavy||flag(t,'crush'))&&G.over==null){say(G,'The blow carries through.');face(G,o,d-before,t.id,'crush');}
    if(P.board.includes(t))hitHooks(G,t,b,dealt);}
  else{say(G,nm(t)+' strikes the '+(G.names?G.names[o]:(o?'rival':'you'))+' for '+s+'.');face(G,o,s,t.id,rt);if(t.kw.toxic)psn(G,o,1);if(G.over==null&&P.board.includes(t))hitHooks(G,t,null,s);}
  checkOver(G);}
function legalTargets(G,p,id){const d=DB[id];if(d.type==='action'||(d.type==='quality'&&!d.foe)){return G.pl[p].board.filter(t=>(!d.need||d.need(t,G))&&!(d.learn&&t.v.includes(id))&&!(d.type==='quality'&&t.q.includes(id)));}return null;}
function canPlay(G,p,i){const P=G.pl[p],id=P.hand[i],d=DB[id];if(costOf(G,p,id)>P.breath)return false;
  if(d.type==='thing')return P.board.length<G.cfg.field;if(d.type==='action'||(d.type==='quality'&&!d.foe))return legalTargets(G,p,id).length>0;
  if(d.type==='quality'&&d.foe)return seen(G,p).length>0;if(d.ok)return d.ok(G,p);return true;}
function play(G,p,i,uid){const P=G.pl[p],id=P.hand[i],d=DB[id];P.breath-=costOf(G,p,id);P.red=0;P.hand.splice(i,1);P.pc++;if(G.st){G.st[p].played[id]=1;if(G.st[p].order.length<5)G.st[p].order.push(id);}
  if(d.type==='thing'){put(G,p,id);}
  else if(d.type==='action'){const t=thing(G,p,uid);say(G,who(G,p)+': '+nm(t)+' '+d.name+'.');if(d.learn){t.v.push(id);if(t.v.length>2)t.v.shift();}
    if(t.id==='clay')buff(G,t,1,1);if(d.use)d.use(G,t);P.disc.push(id);}
  else if(d.type==='quality'){let t;if(d.foe){t=d.pick?d.pick(G,p):top(seen(G,p));}else t=thing(G,p,uid);if(!t){P.disc.push(id);}else{say(G,who(G,p)+': '+d.name+' '+nm(t)+'.');
      if(d.foe){P.disc.push(id);d.apply(G,t);}else{t.q.push(id);if(t.id==='clay'||t.id==='rhinoceros')buff(G,t,1,1);if(d.apply)d.apply(G,t);}}}
  else if(d.type==='weather'){say(G,who(G,p)+': the weather turns to '+d.name+'.');G.wx={id,own:p,left:3};if(d.arr)d.arr(G,p);for(let s=0;s<2;s++)for(const t of G.pl[s].board.slice())fire(G,t,'wx');P.disc.push(id);}
  else if(d.type==='spell'){say(G,who(G,p)+' speak'+(G.names||p?'s ':' ')+d.name+'.');P.spells++;d.cast(G,p);if(d.sch==='word'&&G.over==null){const n=2+speakers(P);say(G,'The spell lands for '+n+'.');face(G,1-p,n,id,'spell');}
    if(d.keep)P.disc.push(id);else pile(G,p).push(id);}
  if(G.over==null)for(const t of P.board.slice()){if(!P.board.includes(t))continue;if(t.kw.margin&&d.sch!==DB[t.base||t.id].sch&&d.sch!=='plain')buff(G,t,0,1);if(has(t,'play'))fire(G,t,'play',d);}
  checkOver(G);}
function fuseOpts(G,p){const P=G.pl[p],o=[];if(P.fz===G.turn)return o;const src=[];P.hand.forEach((id,i)=>{if(DB[id].type==='thing')src.push({id,ref:{h:i}});});for(const t of P.board)if(!t.inp)src.push({id:t.id,ref:{b:t.uid},t});
  for(let x=0;x<src.length;x++)for(let y=x+1;y<src.length;y++){const r=rx(src[x].id,src[y].id);if(!r)continue;if(DB[r].cat&&!P.board.some(t=>t.id===DB[r].cat||t.id==='scintilla'))continue;const c=fuseCost(G,p,r);if(c>P.breath)continue;const onb=(src[x].t?1:0)+(src[y].t?1:0);if(P.board.length-onb>=G.cfg.field)continue;o.push({k:'fuse',a:src[x].ref,b:src[y].ref,r,c});}return o;}
function fuse(G,p,m){const P=G.pl[p];P.breath-=m.c;P.fz=G.turn;const inp=[],q=[];let ready=false,hs=[];
  for(const r of [m.a,m.b]){if(r.b!=null){const t=thing(G,p,r.b);inp.push(t.base||t.id);for(const x of t.q)q.push(x);if(!t.fresh&&!t.acted)ready=true;leave(G,t);}else hs.push(r.h);}
  hs.sort((a,b)=>b-a);for(const h of hs){inp.push(P.hand[h]);if(G.st)G.st[p].played[P.hand[h]]=1;P.hand.splice(h,1);}
  say(G,who(G,p)+' fuse'+(G.names||p?'s ':' ')+inp.map(x=>DB[x].name).join(' and ')+'.');if(G.st){G.st[p].fuse++;G.st[p].played[m.r]=1;}
  if(P.board.some(x=>x.id==='alchemist'))draw(G,p,1);const t=put(G,p,m.r,{inp,ready});if(t)for(const x of q){t.q.push(x);const d=DB[x];if(d.apply&&!d.foe)d.apply(G,t);}checkOver(G);}
function buy(G,p,i){const P=G.pl[p],id=G.mk[i];P.spark-=price(id);P.hand.push(id);G.mk[i]=G.sup[(G.supI++)%G.sup.length];if(G.st){G.st[p].bought++;G.st[p].drawn[id]=1;}say(G,who(G,p)+' buy'+(G.names||p?'s ':' ')+DB[id].name+' from the market.');}
const price=id=>Math.max(1,DB[id].cost+1);
function cycle(G,p,i){const P=G.pl[p];P.cyc=G.turn;P.disc.push(P.hand.splice(i,1)[0]);draw(G,p,1);}
function apply(G,m){const p=G.cur;if(G.over!=null)return;switch(m.k){case 'play':play(G,p,m.i,m.t);break;case 'atk':{const t=thing(G,p,m.t);if(t&&canAtk(G,t))attack(G,t);break;}
  case 'fuse':fuse(G,p,m);break;case 'buy':buy(G,p,m.i);break;case 'cyc':cycle(G,p,m.i);break;case 'end':endTurn(G);break;}}
function moves(G){const p=G.cur,P=G.pl[p],o=[];if(G.over!=null)return o;const seenIds={};
  for(let i=0;i<P.hand.length;i++){const id=P.hand[i];if(seenIds[id])continue;seenIds[id]=1;if(!canPlay(G,p,i))continue;const tg=legalTargets(G,p,id);if(tg){for(const t of tg)o.push({k:'play',i,t:t.uid});}else o.push({k:'play',i});}
  for(const f of fuseOpts(G,p))o.push(f);
  if(G.cfg.market)for(let i=0;i<G.mk.length;i++)if(price(G.mk[i])<=P.spark&&P.hand.length<G.cfg.hand+1)o.push({k:'buy',i});
  for(const t of P.board)if(canAtk(G,t))o.push({k:'atk',t:t.uid});
  return o;}
function clone(G){const c={cfg:G.cfg,s:G.s,turn:G.turn,cur:G.cur,first:G.first,over:G.over,uid:G.uid,wx:G.wx?{id:G.wx.id,own:G.wx.own,left:G.wx.left}:null,mk:G.mk.slice(),sup:G.sup,supI:G.supI,st:null,log:null,names:null,pl:[]};
  for(const P of G.pl){const b=[];for(const t of P.board){const x=Object.assign({},t);x.kw=Object.assign({},t.kw);x.q=t.q.slice();x.v=t.v.slice();if(t.inp)x.inp=t.inp.slice();if(t.also)x.also=t.also.slice();b.push(x);}
    c.pl.push({life:P.life,breath:P.breath,maxB:P.maxB,spark:P.spark,poison:P.poison,tax:P.tax,red:P.red,stam:P.stam,shield:P.shield,noblk:P.noblk,fz:P.fz,cyc:P.cyc,spells:P.spells,pc:P.pc,stamNext:P.stamNext,deck:P.deck.slice(),hand:P.hand.slice(),disc:P.disc.slice(),grave:P.grave.slice(),board:b});}return c;}
const E={fire,has,fuseCost,speakers,DB,RX,THEMES,ORDER,CFG,def,recipe,rx,rnd,shuffle,is,mine,foes,seen,top,low,cnt,say,nm,pile,put,strikeOf,buff,mend,life,face,hurt,kill,bounce,exile,psn,tpsn,ign,frz,wet,draw,br,dis,pack,fetch,raise,evolve,checkOver,costOf,newGame,startTurn,endTurn,thing,canAtk,blocker,attack,legalTargets,canPlay,play,fuseOpts,fuse,buy,price,cycle,apply,moves,clone,mkThing};
return E;});
