/* Balance tuner. Each theme has a level; a level is a fixed, reversible list of small changes to that theme's own seven cards
   (+1 stand, +1 strike, 1 cheaper; or the reverse). Each pass plays the whole field and moves each theme's level towards 50%.
   Usage: node tune.js '<cfg json>' passes games [levels.json]   -> writes levels.json and tune.json (card overrides) */
const cp=require('child_process'),fs=require('fs');
const E=require('./load.js');const {summarise}=require('./sum.js');
const BASE={};for(const id in E.DB){const d=E.DB[id];BASE[id]={sk:d.sk,st:d.st,cost:d.cost};}
const PINS=['loan','mite','pear','keystone','snowflake','magnify','conjoin','resonant','time','crucible'];
function overrides(levels){const T={};const get=id=>T[id]||(T[id]=Object.assign({},BASE[id]));
  for(const th in levels){if(th==='_extra')continue;const L=levels[th],core=th.startsWith('sup:')?E.SUP[th.slice(4)].filter(id=>E.DB[id].sch===th.slice(4)):E.THEMES[th].core,n=Math.abs(L),up=L>0,vis={};let done=0,guard=0;
    for(let s=0;done<n&&guard<200;s++,guard++){const id=core[s%core.length],d=E.DB[id];if(PINS.includes(id))continue;const o=get(id);vis[id]=(vis[id]||0)+1;const v=vis[id];
      if(d.type==='thing'){if(up){if(v%2===0&&BASE[id].sk>0&&o.sk<BASE[id].sk+2)o.sk++;else if(o.st<BASE[id].st+4)o.st++;else continue;}
        else{if(v%2===0&&o.sk>Math.max(0,BASE[id].sk-2)&&o.sk>0)o.sk--;else if(o.st>Math.max(1,BASE[id].st-3))o.st--;else if(o.sk>Math.max(1,BASE[id].sk-2))o.sk--;else continue;}done++;}
      else{if(v>2)continue;if(up){if(o.cost>1&&o.cost>BASE[id].cost-1)o.cost--;else continue;}else{if(o.cost<BASE[id].cost+2)o.cost++;else continue;}done++;}}}
  if(levels._extra)for(const id in levels._extra){const o=get(id),x=levels._extra[id];for(const k in x)o[k]+=x[k];}
  for(const id in T){const o=T[id],b=BASE[id];if(o.sk===b.sk&&o.st===b.st&&o.cost===b.cost)delete T[id];}return T;}
module.exports={overrides,BASE};
if(require.main===module){const cfg=JSON.parse(process.argv[2]),passes=+process.argv[3]||10,games=+process.argv[4]||24,lf=process.argv[5]||'levels.json';
  let levels={};if(fs.existsSync(lf))levels=JSON.parse(fs.readFileSync(lf));for(const th in E.THEMES)if(levels[th]==null)levels[th]=0;for(const sc in E.SUP)if(levels['sup:'+sc]==null)levels['sup:'+sc]=0;
  const prev={},damp={};for(let p=0;p<passes;p++){const tune=overrides(levels);const spec={name:'tune'+p,cfg,games,tune,chars:fs.existsSync('chars.json')?JSON.parse(fs.readFileSync('chars.json')):null,seed:1000+p*17+Math.floor(Math.random()*1e6)};fs.writeFileSync('results/_tspec.json',JSON.stringify(spec));
    cp.execFileSync('node',['run.js','results/_tspec.json','results/_tune.json'],{stdio:'ignore'});const R=JSON.parse(fs.readFileSync('results/_tune.json'));const S=summarise(R);
    const th=S.rows.filter(r=>E.THEMES[r.id]);const out=th.filter(r=>r.wr<.45||r.wr>.55).length;const chars=S.rows.filter(r=>!E.THEMES[r.id]).map(r=>r.id+' '+(r.wr*100).toFixed(0)).join(', ');
    const worst=th.slice().sort((x,y)=>Math.abs(y.wr-.5)-Math.abs(x.wr-.5)).slice(0,5).map(r=>r.id+' '+(r.wr*100).toFixed(0)+'['+levels[r.id]+']').join(' ');
    console.log(`pass ${p}: themes ${(Math.min(...th.map(r=>r.wr))*100).toFixed(1)}–${(Math.max(...th.map(r=>r.wr))*100).toFixed(1)} sd ${(S.all.wrSd*100).toFixed(1)} outside ${out}/${th.length} | rounds ${S.all.rounds.toFixed(1)} first ${(S.all.firstWin*100).toFixed(1)} | ${chars} || ${worst}`);
    const bySch={};for(const r of th){const sc=E.THEMES[r.id].sch;(bySch[sc]=bySch[sc]||[]).push(r.wr);}
    const late=p>=passes*0.4;
    const FRZ=!!process.env.FREEZE;
    if(!FRZ)for(const sc in bySch){const m=bySch[sc].reduce((x,y)=>x+y,0)/bySch[sc].length;let d=Math.round((.5-m)*100/6);d=Math.max(-1,Math.min(1,d));if(late&&Math.abs(m-.5)<.04)d=0;const k='sup:'+sc;levels[k]=Math.max(-14,Math.min(14,(levels[k]||0)+d));}
    const MM=+process.env.MAXMOVE||99;const movers=new Set(th.slice().sort((x,y)=>Math.abs(y.wr-.5)-Math.abs(x.wr-.5)).slice(0,MM).map(r=>r.id));
    for(const r of th){if(!movers.has(r.id))continue;const err=.5-r.wr;let dd=Math.round(err*100/5);if(Math.abs(err)<(+process.env.THRESH||.03))dd=0;dd=Math.max(-3,Math.min(3,dd));const sg=Math.sign(err),pv=prev[r.id]||0;
      if(FRZ)dd=Math.max(-1,Math.min(1,dd));
      if(pv&&sg&&sg!==pv){damp[r.id]=(damp[r.id]||0)+1;}if(damp[r.id]){dd=Math.max(-1,Math.min(1,dd));if(damp[r.id]>=3&&Math.abs(err)<.06)dd=0;}
      if(sg)prev[r.id]=sg;levels[r.id]=Math.max(-16,Math.min(16,levels[r.id]+dd));}
    if(!FRZ){const med=a=>{const s=a.slice().sort((x,y)=>x-y);return s[Math.floor(s.length/2)];};const tk=Object.keys(E.THEMES),sk=Object.keys(E.SUP).map(x=>'sup:'+x);const m1=med(tk.map(k=>levels[k])),m2=med(sk.map(k=>levels[k]));
      for(const k of tk)levels[k]-=Math.sign(m1)*Math.min(2,Math.abs(m1));for(const k of sk)levels[k]-=Math.sign(m2)*Math.min(2,Math.abs(m2));}
    fs.writeFileSync(lf,JSON.stringify(levels));fs.writeFileSync('tune.json',JSON.stringify(overrides(levels)));}
  console.log(JSON.stringify(levels));}
