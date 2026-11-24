/* Simulation runner. Plays every deck in a field against every other, with both bot styles in both seats and both turn orders,
   in at most 2 worker processes. Usage: node run.js '<json spec>' out.json
   spec: {name, cfg:{deck,hand,dur,remember,grave,market,copies}, build:'theme'|'mix2'|'mix3'|'vs' , games (per pairing, rounded to 8), field:[ids], tune:{card:{sk,st,cost}}} */
const cp=require('child_process'),fs=require('fs'),path=require('path');
function buildDecks(E,spec){const size=spec.cfg.deck||10,copies=spec.cfg.copies||1,TH=E.THEMES;let ids=spec.field||E.FIELD,decks;
  if(spec.entries){/* explicit field: [{id,label,copies,mix}] */ids=spec.entries.map(e=>e.label||e.id);decks=spec.entries.map(e=>e.list?e.list:e.mix?E.mixOf([e.id].concat(TH[e.id].cross.slice(0,e.mix-1)),size,e.copies||1):E.deckOf(e.id,size,e.copies||copies));return {ids,decks};}
  if(spec.build==='mix2'||spec.build==='mix3'){ids=ids.filter(id=>TH[id]);decks=ids.map(id=>E.mixOf([id].concat(TH[id].cross.slice(0,spec.build==='mix2'?1:2)),size,copies));}
  else decks=ids.map(id=>E.deckOf(id,size,copies));
  if(spec.swap)for(const k in spec.swap){const i=ids.indexOf(k);if(i>=0)decks[i]=spec.swap[k];}
  return {ids,decks};}
function applyTune(E,tune){if(!tune)return;for(const id in tune){const d=E.DB[id];if(!d)continue;for(const k in tune[id])d[k]=tune[id][k];}E.remake();}
const STY=[['aggressive','aggressive'],['aggressive','careful'],['careful','aggressive'],['careful','careful']];
function blankDeck(){return {g:0,w:0,d:0,fg:0,fw:0,turns:0,turns2:0,fuse:0,evo:0,raised:0,bought:0,decided:0,comeb:0,heal:0,dmg:0,top:{},open:{},openN:0,cards:{},route:{},ag:0,aw:0,cg:0,cw:0};}
function work(spec,part,parts){const E=require('./load.js');applyTune(E,spec.tune);if(spec.chars)for(const k in spec.chars)E.CHARS[k].list=spec.chars[k];const {ids,decks}=buildDecks(E,spec);const n=ids.length,per=Math.max(8,Math.round((spec.games||80)/8)*8);
  const pair={},deck=ids.map(blankDeck);let pi=0,games=0;
  for(let i=0;i<n;i++)for(let j=i+1;j<n;j++){if(spec.groups&&spec.groups[i]===spec.groups[j])continue;if((pi++)%parts!==part)continue;const P=pair[i+','+j]={g:0,a:0,b:0,d:0,fw:0,turns:0};
    for(let k=0;k<per;k++){const st=STY[k%4],first=(k>>2)&1,seed=(i*7919+j*104729+k*15485863+(spec.seed||1))|0;
      const G=E.bot.playGame(spec.cfg,decks[i],decks[j],seed,first,st[0],st[1]);games++;const rounds=Math.ceil(G.turn/2);
      P.g++;P.turns+=rounds;if(G.over===0)P.a++;else if(G.over===1)P.b++;else P.d++;if(G.over===G.first)P.fw++;
      for(let s=0;s<2;s++){const D=deck[s?j:i],S=G.st[s],win=G.over===s;D.g++;if(win)D.w++;if(G.over===2)D.d++;if(G.first===s){D.fg++;if(win)D.fw++;}
        D.turns+=rounds;D.turns2+=rounds*rounds;D.fuse+=S.fuse;D.lost=(D.lost||0)+S.lost;D.evo+=S.evo;D.raised+=S.raised;D.bought+=S.bought;D.heal+=S.heal;D.dmg+=S.tot;
        if(st[s]==='aggressive'){D.ag++;if(win)D.aw++;}else{D.cg++;if(win)D.cw++;}
        let tc=null,tm=0;for(const c in S.dmg){if(S.dmg[c]>tm){tm=S.dmg[c];tc=c;}}
        if(win){if(tc&&tm>=S.tot*.5)D.decided++;if(S.minDiff<=-Math.round(spec.cfg.life?spec.cfg.life*.27:8))D.comeb++;if(tc)D.top[tc]=(D.top[tc]||0)+1;}
        for(const r in S.route)D.route[r]=(D.route[r]||0)+S.route[r];
        if(D.openN<400){D.openN++;const o=S.order.slice(0,3).join('>');D.open[o]=(D.open[o]||0)+1;}
        for(const c in S.drawn){const x=D.cards[c]||(D.cards[c]={dr:0,drW:0,pl:0,plW:0,dmg:0});x.dr++;if(win)x.drW++;}
        for(const c in S.played){const x=D.cards[c]||(D.cards[c]={dr:0,drW:0,pl:0,plW:0,dmg:0});x.pl++;if(win)x.plW++;}
        for(const c in S.dmg){const x=D.cards[c]||(D.cards[c]={dr:0,drW:0,pl:0,plW:0,dmg:0});x.dmg+=S.dmg[c];}}}}
  return {ids,decks,pair,deck,games};}
function merge(a,b){if(!a)return b;a.games+=b.games;Object.assign(a.pair,b.pair);
  const add=(x,y)=>{for(const k in y){if(typeof y[k]==='number')x[k]=(x[k]||0)+y[k];else{x[k]=x[k]||{};add(x[k],y[k]);}}};
  for(let i=0;i<a.deck.length;i++)add(a.deck[i],b.deck[i]);return a;}
if(process.argv[2]==='--worker'){process.on('message',m=>{const r=work(m.spec,m.part,m.parts);process.send(r,()=>process.exit(0));});}
else if(require.main===module){const spec=JSON.parse(process.argv[2].startsWith('{')?process.argv[2]:fs.readFileSync(process.argv[2],'utf8'));const out=process.argv[3]||'out.json';const parts=Math.min(2,spec.procs||2);
  let res=null,done=0;const t0=Date.now();
  for(let p=0;p<parts;p++){const c=cp.fork(__filename,['--worker']);c.on('message',r=>{res=merge(res,r);if(++done===parts){res.spec=spec;res.secs=(Date.now()-t0)/1000;fs.writeFileSync(out,JSON.stringify(res));console.log((spec.name||'run')+': '+res.games+' games in '+res.secs.toFixed(0)+'s -> '+out);}});c.send({spec,part:p,parts});}}
module.exports={work,merge,buildDecks,applyTune};
