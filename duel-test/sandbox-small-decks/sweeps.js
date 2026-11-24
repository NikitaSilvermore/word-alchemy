/* The option sweeps. node sweeps.js levels.json <group> [games]   groups: grid dur gm copies schools today
   Every run uses the same tuned card numbers; only the option under test changes. Base = the recommended table unless stated. */
const cp=require('child_process'),fs=require('fs');const E=require('./load.js');const {overrides}=require('./tune.js');const {summarise}=require('./sum.js');
const levels=JSON.parse(fs.readFileSync(process.argv[2]));const group=process.argv[3];const games=+process.argv[4]||16;const tune=overrides(levels);
const CH=fs.existsSync('chars.json')?JSON.parse(fs.readFileSync('chars.json')):null;if(CH)for(const k in CH)E.CHARS[k].list=CH[k];
const BASE=Object.assign({deck:10,hand:5,dur:1.5,remember:true,grave:true,market:false,copies:1},fs.existsSync('recommended.json')?JSON.parse(fs.readFileSync('recommended.json')):{});
const themes=Object.keys(E.THEMES);const specs=[];
const S=(name,cfg,extra)=>specs.push(Object.assign({name,cfg:Object.assign({},BASE,cfg),games,tune,chars:CH},extra||{}));
if(group==='grid')for(const d of [8,10,12,20])for(const h of [3,4,5,6,7])S(`deck${d}_hand${h}`,{deck:d,hand:h});
if(group==='dur')for(const d of [1,1.5,2])for(const r of [true,false])S(`dur${d}_${r?'remember':'forget'}`,{dur:d,remember:r});
if(group==='gm')for(const g of [true,false])for(const m of [true,false])S(`grave${g?'On':'Off'}_market${m?'On':'Off'}`,{grave:g,market:m});
if(group==='copies'){for(const c of [1,2,3])S(`copies${c}`,{copies:c},{field:themes});
  /* head to head: every theme's deck with copies against every other theme's one-of-each deck */
  for(const c of [2,3]){const entries=themes.map(id=>({id,label:id})).concat(themes.map(id=>({id,copies:c,label:id+'×'+c})));S(`copies${c}_vs_1`,{},{entries,groups:themes.map(()=>0).concat(themes.map(()=>1))});}}
if(group==='schools'){S('schools1',{}, {field:themes});S('schools2',{}, {build:'mix2',field:themes});S('schools3',{}, {build:'mix3',field:themes});
  const entries=themes.map(id=>({id,label:id})).concat(themes.map(id=>({id,mix:2,label:id+'+1'})),themes.map(id=>({id,mix:3,label:id+'+2'})));
  S('schools_cross',{}, {entries,groups:themes.map(()=>0).concat(themes.map(()=>1),themes.map(()=>2))});}
if(group==='today'){S('today_like',{deck:20,hand:6,dur:1,remember:true,grave:false,market:true,copies:2});S('recommended',{});}
for(const sp of specs){const f='results/sw_'+sp.name+'.json';fs.writeFileSync('results/_sspec.json',JSON.stringify(sp));cp.execFileSync('node',['run.js','results/_sspec.json',f],{stdio:'ignore'});
  const R=JSON.parse(fs.readFileSync(f));const a=summarise(R).all,pc=x=>(x*100).toFixed(1);
  console.log([sp.name,a.games,'first',pc(a.firstWin),'rounds',a.rounds.toFixed(1),'sd',a.roundSd.toFixed(1),'fuse',a.fuse.toFixed(2),'evo',a.evo.toFixed(2),'raised',a.raised.toFixed(2),'decided',pc(a.decided),'comeb',pc(a.comeb),'finH',a.topH.toFixed(2),'openVar',pc(a.openVar),'wr',pc(a.wrMin)+'-'+pc(a.wrMax),'sd',pc(a.wrSd),'outside',a.outside+'/'+a.n].join(' '));}
