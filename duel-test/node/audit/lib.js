/* audit harness: minimal boards in the real V19 engine */
window.AU=(function(){
const A={};
A.reset=function(o){o=o||{};try{fresh();}catch(e){}
  S.things=[];S.clime=null;S.turn=o.turn||8;S.active=0;S.tox=null;S.over=null;S.law=null;S.places=null;S.phase='play';S.fz=[0,0];S.quiet=false;
  for(const p of S.players){p.hand=[];p.deck=['ink','ink','ink','ink','ink','ink','ink','ink','ink','ink'];p.discard=[];p.life=o.life||60;p.ink=99;p.ink0=99;p.poisoned=0;p.asleep=0;p.dazed=0;p.veil=null;p.coins=0;p.ban=null;p.silence=[];p.dross=0;p.carry=0;p.well=0;p.gnosis=0;p.ordeal=0;p.fell=null;p.braved=true;p.top=60;p.attune=o.attune||null;}
  S.log=[];return S;};
A.put=function(w,side,o){o=o||{};const t=addThing(S,w,side,o.owner!=null?o.owner:side,!!o.token);if(o.fresh!=null)t.fresh=o.fresh;else t.fresh=0;t.acted=false;if(o.vig!=null)t.vig=o.vig;if(o.st)Object.assign(t.st,o.st);if(o.props)for(const p of o.props)if(!t.props.includes(p))t.props.push(p);return t;};
/* say(who, spec): spec = {s:'word'|thing|'me'|'rival', v:'verb', kv:'verb'(known), o:'word'|thing|'me'|'rival', a:['adj'], c:'clime', def:thing|null} */
A.say=function(who,sp){const p=S.players[who];const words=[];const idx=w=>{words.push(w);return words.length-1;};const sen={};
  const ref=x=>{if(x==null)return null;if(x==='me')return{k:'player',i:who};if(x==='rival')return{k:'player',i:1-who};if(typeof x==='object')return{k:'thing',id:x.id};return{k:'card',i:idx(x)};};
  sen.adjs=(sp.a||[]).map(idx);sen.subj=ref(sp.s);if(sp.v)sen.verb=idx(sp.v);if(sp.kv)sen.kverb=sp.kv;sen.obj=ref(sp.o);if(sp.c)sen.clime=idx(sp.c);if(sp.def!==undefined)sen.def=sp.def?sp.def.id:null;else sen.def=null;
  p.hand=words.concat(sp.extra||[]);p.ink=sp.ink!=null?sp.ink:99;const L=S.log.length;let r;try{r=resolve(S,who,sen);}catch(e){r={ok:false,why:'THROW '+e.message};}
  A.last=S.log.slice(L).map(l=>l.x);return r;};
A.T=t=>S.things.includes(t);
A.mine=(who)=>S.things.filter(t=>t.side===who);
A.log=()=>(A.last||[]).join(' | ');
A.snap=()=>({life:S.players.map(p=>p.life),ink:S.players.map(p=>p.ink),things:S.things.map(t=>({id:t.id,w:t.w,side:t.side,owner:t.owner,vig:t.vig,props:t.props.join(','),st:JSON.stringify(t.st)}))});
A.endTurn=(i)=>{endTurn(S,i,true);};A.start=(i)=>{startTurn(S,i);};
A.cycle=(n)=>{for(let k=0;k<(n||1);k++){endTurn(S,0,true);startTurn(S,1);endTurn(S,1,true);startTurn(S,0);}};
return A;})();
'lib ok'
