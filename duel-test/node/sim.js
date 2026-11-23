/* headless bot-vs-bot simulator for the duel test */
(function(){
const SIM=window.SIM={};
const _dd=window.dtvDeck;
SIM.randDeck=()=>_dd([],2);
const NO=['vessel','fuse','conjoin','be'];
const ok=w=>W[w]&&!W[w].token&&!NO.includes(w)&&!DTVX7.includes(w);
SIM.pool=()=>ALLWORDS.filter(ok);
const P=w=>W[w].props||[],T=w=>tierOf(w);
const noun=w=>W[w].t===NOUN&&!P(w).includes('ground')&&!P(w).includes('spell')&&!P(w).includes('event');
const fighter=w=>noun(w)&&['beast','human','heavy','sharp','fireborn'].some(k=>P(w).includes(k))&&!P(w).includes('herb')&&W[w].vig>=5&&T(w)<=3;
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
/* a deck built to the same shape as the random deck, drawing from a school set first, then neutral words */
SIM.schoolDeck=function(schools){const all=SIM.pool(),inS=w=>schools.includes(schoolOf(w)),neu=w=>schoolOf(w)==='word';
 const d=[];const take=(f,n)=>{let a=shuffle(all.filter(w=>f(w)&&inS(w)&&!d.includes(w)));if(a.length<n)a=a.concat(shuffle(all.filter(w=>f(w)&&neu(w)&&!d.includes(w)&&!a.includes(w))));if(a.length<n)a=a.concat(shuffle(all.filter(w=>f(w)&&!d.includes(w)&&!a.includes(w))));for(const w of a.slice(0,n))d.push(w);};
 take(fighter,2);take(w=>noun(w)&&T(w)<=2,2);take(w=>noun(w)&&T(w)===3,1);take(w=>W[w].t===NOUN&&P(w).includes('ground')&&T(w)<=2,2);
 take(w=>(W[w].t===NOUN&&P(w).includes('spell')&&T(w)<=2)||(W[w].t==='clime'&&T(w)<=2),1);
 take(w=>ATTACKV.includes(w),1);take(w=>W[w].t===VERB&&!ATTACKV.includes(w)&&!FUSEW.includes(w),2);take(w=>W[w].t===ADJ,2);take(w=>w==='mend'||W[w].t===NOUN&&P(w).includes('event'),1);
 return d.slice(0,14);};
/* fusion for either side, same judgement as the rival's */
function fuse(S,who){S.fz=S.fz||[0,0];if(S.fz[who]===S.turn)return false;const p=S.players[who];let best=null;
 const hn=p.hand.map((w,i)=>({w,i})).filter(o=>W[o.w]&&W[o.w].t===NOUN&&!isEvent(o.w));
 for(let x=0;x<hn.length;x++)for(let y=x+1;y<hn.length;y++){const r=rxOf(hn[x].w,hn[y].w);if(!r||!r.r)continue;const c=rxLevel(hn[x].w,hn[y].w,r);if(p.ink<c)continue;
  const g=window.DTV14GAIN?(DTV14GAIN(who,{k:'card',i:hn[x].i},{k:'card',i:hn[y].i})||0):((W[r.r]&&W[r.r].vig||0)+tierOf(r.r)*2-c-((W[hn[x].w].vig||0)+(W[hn[y].w].vig||0))/2);if(!best||g>best.g)best={g,a:hn[x],b:hn[y],r,c};}
 if(!best||best.g<=0)return false;if(W[best.r.r].t===NOUN&&full(S,who,best.r.r))return false;
 S.fz[who]=S.turn;p.ink-=best.c;window.DTVSIDE=who;const bs={things:{}};for(const t of S.things)bs.things[t.id]=1;
 const ra={k:'card',i:best.a.i},rb={k:'card',i:best.b.i};const ins=dtvIn(who,[ra,rb]);react(S,who,{subj:ra,obj:rb},{mult:1,effect:false});try{dtvTrait(bs,best.r,ins);}catch(e){}
 settleS(S);checkOver(S);S.st.fuse[who]++;return true;}
function evolve(S,who){const p=S.players[who];if(!window.dtvCanEvo)return;const c=S.things.filter(t=>dtvCanEvo(S,who,t)).map(t=>({t,c:dtvEvoCost(S,t)})).filter(x=>p.ink-x.c>=1||x.c===0).sort((a,b)=>a.c-b.c||b.t.vig-a.t.vig)[0];if(c&&dtvEvolve(S,who,c.t))S.st.evo[who]++;}
function lossOf(S,from){let m=0;for(const l of S.log.slice(from)){const x=String(l.x||l);const r=/(?:You lose|The rival loses) (\d+) life/.exec(x);if(r)m=Math.max(m,+r[1]);}return m;}
function turn(S,who){if(who===0&&S.sw===1){S.players[0].ink+=(S.swN||1);S.sw=2;}evolve(S,who);if(S.over!=null)return;fuse(S,who);
 for(let n=0;n<10&&S.over==null;n++){window.DTVDRY=1;let s=null;try{s=botChoose(S,who);}finally{window.DTVDRY=0;}if(!s)break;
  const L=S.log.length;const r=resolve(S,who,s);if(!r||r.ok===false)break;const v=S.log.slice(L).map(l=>String(l.x||l)).join(' ');S.st.said[who]++;
  const vw=s.kverb||(s.verb!=null?null:null);settleS&&settleS(S);checkOver(S);}
 if(S.over==null){try{botShop(S,who);}catch(e){}}}
SIM.play=function(d0,d1,opt){opt=opt||{};window.dtvDeck=(d,me)=>me===1?d0.slice():me===2?d1.slice():d;try{fresh();}finally{window.dtvDeck=_dd;}
 S.phase='sim';S.st={fuse:[0,0],evo:[0,0],said:[0,0],dmg:[{},{}]};window.SIMS=S;const first=opt.first!=null?opt.first:(Math.random()<.5?0:1);
 if(first===1){S.second=0;const p=S.players[0];p.ink=0;p.ink0=0;S.turn=0;startTurn(S,1);}else S.second=1;
 let who=first,maxHit=[0,0],hist=[];const life=()=>[S.players[0].life,S.players[1].life];hist.push(life());
 for(let k=0;k<60&&S.over==null;k++){const L=S.log.length;turn(S,who);const h=lossOf(S,L);if(h>maxHit[who])maxHit[who]=h;if(S.over!=null)break;endTurn(S,who,true);checkOver(S);if(S.over!=null)break;who=1-who;startTurn(S,who);hist.push(life());}
 hist.push(life());const win=S.over==null?-1:S.over;
 let behind=0;if(win>=0){for(const h of hist){const d=h[win]-h[1-win];if(d<behind)behind=d;}}
 return {win,first,turns:S.turn,rounds:Math.ceil(S.turn/2),life:life(),maxHit,behind,fuse:S.st.fuse,evo:S.st.evo,said:S.st.said,dmg:S.st.dmg,decks:[(S.players[0].deck0||[]),(S.players[1].deck0||[])]};};
const gen=g=>Array.isArray(g)?g:g.gen==='rand'?SIM.randDeck():g.gen==='school'?SIM.schoolDeck(g.s):g.gen==='complete'&&window.dtv18Complete?dtv18Complete(g.seed||[]).deck:g.gen==='starter'&&window.DTV18STARTERS?DTV18STARTERS[g.s].slice():g;
SIM.batch=function(specs){const out=[];for(const sp of specs){try{const t0=performance.now();const a=gen(sp.d0),b=gen(sp.d1);const r=SIM.play(a,b,sp.opt);r.d=[a,b];r.ms=Math.round(performance.now()-t0);r.tag=sp.tag;out.push(r);}catch(e){out.push({err:String(e&&e.stack||e).slice(0,300),tag:sp.tag});}}return out;};
})();

/* damage to a player, by route */
(function(){const ROUTE=c=>/fire|flame|burn|heat|blast|scorch|wildfire|bonfire|torch|firebrand/.test(c)?'burn':/poison|miasma|plague|pestilence|blight|venom/.test(c)?'poison':/seep|wash|tide|drench/.test(c)?'tide':/overflow|crush/.test(c)?'crush':c;
 let LAST=null;const _da=didAct;didAct=function(S,who,e){if(e&&e.k==='t')LAST=e.t;return _da.apply(this,arguments);};
 const _d=damage;damage=function(S,e,n,cause){const before=e&&e.k==='p'?S.players[e.i].life:null;const r=_d.apply(this,arguments);
  try{if(S.st&&S.st.dmg&&before!=null){const lost=before-S.players[e.i].life;if(lost>0){let k=ROUTE(String(cause||'?'));if(['attack','fight','bite','cut','sting','strike','hit','?'].includes(k)&&LAST&&(LAST.props.includes('flying')||LAST.props.includes('bird')))k='over';const m=S.st.dmg[1-e.i];m[k]=(m[k]||0)+lost;}}}catch(x){}return r;};})();
