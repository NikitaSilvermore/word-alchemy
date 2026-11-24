/* The sandbox bots. One greedy chooser with a one-move look-ahead; two temperaments.
   aggressive: values the rival's life, strikes whenever it can. careful: values its own life, its board and its guards. */
(function(root,f){if(typeof module==='object'&&module.exports)module.exports=f;else root.WAS_BOT=f;})(this,function(E){
'use strict';
const DB=E.DB;
const STY={aggressive:{lo:1.55,lm:.9,g:.10,b:1,f:1.05},careful:{lo:1.05,lm:1.35,g:.34,b:1.1,f:1}};
function tv(G,t){const d=DB[t.id];let s=E.strikeOf(G,t);const st=t.kw.brittle&&!t.kw.annealed?1:t.st;
  let v=st*.5+s*.95+(d.made?3:d.cost*.5)+.4;if(t.kw.flying)v+=.5+s*.15;if(t.kw.toxic)v+=.5;if(t.kw.guardian)v+=.6;if(t.kw.hidden)v+=.4;if(t.kw.undying)v+=1.2;if(t.kw.named)v+=.3;
  v+=t.v.length*.4+t.ctr*.25-t.burn*1.1-t.psn*.9-t.frz*.8;if(t.unbl)v+=s*.4;if(t.left>0)v-=1.2/t.left;if(d.lad)v+=.5+t.age*.5;if(t.also)v+=1;return v;}
function ev(G,p,S){const me=G.pl[p],op=G.pl[1-p];if(G.over!=null)return G.over===p?1e6:G.over===2?-5e5:-1e6;
  let v=me.life*S.lm-op.life*S.lo-Math.min(me.poison,4)*1.6+Math.min(op.poison,4)*1.6;let mt=0,ot=0,mg=0,og=0;
  for(const t of me.board){v+=tv(G,t)*S.b;mt+=E.strikeOf(G,t);if(t.guard&&t.frz<=0)mg+=t.st;}
  for(const t of op.board){v-=tv(G,t)*S.f;ot+=E.strikeOf(G,t);if(t.guard&&t.frz<=0)og+=t.st;}
  v+=Math.min(mg,ot*1.5)*S.g-Math.min(og,mt*1.5)*S.g*.5;
  v+=me.hand.length*.75-op.hand.length*.75+me.breath*.02+(me.tax?-.6*me.tax:0)+(op.tax?.6*op.tax:0)+(op.stamNext?1:0);
  if(G.wx)v+=G.wx.own===p?.8:-.8;if(op.noblk===G.turn)v+=mt*.15;
  if(me.life<=6)v-=(7-me.life)*1.2;if(op.life<=6)v+=(7-op.life)*S.lo*.6;return v;}
/* one move for the side to play, or null to end the turn */
function choose(G,style,noise){const S=STY[style]||STY.careful,p=G.cur,ms=E.moves(G);if(!ms.length)return null;const base=ev(G,p,S);let best=null,bv=base+.05;
  for(const m of ms){const C=E.clone(G);E.apply(C,m);let v=ev(C,p,S);if(m.k==='buy')v-=.35;if(noise)v+=(E.rnd(G)-.5)*noise;if(v>bv){bv=v;best=m;}}
  return best;}
function takeTurn(G,style,noise){const p=G.cur;let n=0;while(G.over==null&&G.cur===p&&n++<40){const m=choose(G,style,noise);if(!m)break;E.apply(G,m);}
  if(G.over==null&&G.cur===p){const P=G.pl[p];if(P.cyc!==G.turn&&P.hand.length>=G.cfg.hand){let j=0;for(let i=1;i<P.hand.length;i++)if(DB[P.hand[i]].cost>DB[P.hand[j]].cost)j=i;E.apply(G,{k:'cyc',i:j});}
    E.apply(G,{k:'end'});}}
function playGame(cfg,d0,d1,seed,first,s0,s1,opt){const G=E.newGame(cfg,d0,d1,seed,first,opt);const st=[s0,s1];let guard=0;while(G.over==null&&guard++<200)takeTurn(G,st[G.cur],.3);if(G.over==null)G.over=2;return G;}
return {ev,choose,takeTurn,playGame,STY};});
