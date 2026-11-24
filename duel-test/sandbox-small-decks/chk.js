/* node chk.js levels.json cfgjson games -> win rate per deck with its tuning level */
const cp=require('child_process'),fs=require('fs');const E=require('./load.js');const {overrides}=require('./tune.js');const {summarise}=require('./sum.js');
const levels=JSON.parse(fs.readFileSync(process.argv[2]));const spec={name:'chk',chars:fs.existsSync('chars.json')?JSON.parse(fs.readFileSync('chars.json')):null,cfg:JSON.parse(process.argv[3]||'{}'),games:+process.argv[4]||24,tune:overrides(levels),seed:Math.floor(Math.random()*1e6)};
fs.writeFileSync('results/_cspec.json',JSON.stringify(spec));cp.execFileSync('node',['run.js','results/_cspec.json','results/_chk.json'],{stdio:'ignore'});
const R=JSON.parse(fs.readFileSync('results/_chk.json'));const S=summarise(R);const a=S.all;
console.log(`first ${(a.firstWin*100).toFixed(1)} rounds ${a.rounds.toFixed(1)} decided ${(a.decided*100).toFixed(0)} comeb ${(a.comeb*100).toFixed(0)} outside ${a.outside}/${a.n} sd ${(a.wrSd*100).toFixed(1)}`);
console.log(S.rows.slice().sort((x,y)=>y.wr-x.wr).map(r=>r.id+' '+(r.wr*100).toFixed(0)+(levels[r.id]!=null?'['+levels[r.id]+']':'')+' r'+r.rounds.toFixed(1)).join(' | '));
