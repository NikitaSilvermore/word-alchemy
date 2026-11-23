const fs=require('fs'),vm=require('vm');const D='/home/claude/word-alchemy/duel-test/node';
var g;eval(fs.readFileSync(D+'/load.js','utf8').replace(/vm\.runInContext\("var S=newGame[\s\S]*$/,'').replace(/__dirname/g,JSON.stringify(D)).replace("const g=","g="));
g.B0=JSON.parse(fs.readFileSync('/home/claude/fw2/web21.json','utf8')).base;g.QCH=JSON.parse(fs.readFileSync('qchart.json','utf8'));g.CH=JSON.parse(fs.readFileSync('chart.json','utf8'));const out=vm.runInContext(`(function(){
const WB=window.WEB21,B=B0,KEEP=['special','named pair','hybrid','metal','potion','element','haunt'];
const sch=w=>(typeof SCHOOLOF!=='undefined'&&SCHOOLOF[w])||(WB.cards[w]&&WB.cards[w].sch)||null;
const body=w=>W[w]&&W[w].t===NOUN&&!['potion','burden','event','spell','ground','concept','clime'].some(p=>(W[w].props||[]).includes(p));
// families from existing chart entries
const fam={};
for(const k in B){const v=B[k];if(v[2]!=='chart')continue;const [a,b]=k.split('|');const sa=sch(a)||sch(b),sb=sch(b)||sch(a);if(!sa||!sb)continue;const key=[sa,sb].sort().join('|');const o=v[0];if(!body(o))continue;
  const t=v[1]<=2?0:v[1]===3?1:2;fam[key]=fam[key]||[{},{},{}];fam[key][t][o]=(fam[key][t][o]||0)+1;}
const FAM=CH;for(const k in FAM)for(const w of FAM[k])if(!W[w])throw 'missing '+w;
// fill empty tiers from neighbours
for(const k in FAM){}
const CRP=['beast','bird','human','serpent','insect','spirit','fish'],crea=w=>W[w]&&CRP.some(p=>(W[w].props||[]).includes(p));const QC=QCH;const syl=w=>(W[w]&&W[w].syl)||1;const TR={fire:'fireborn',water:'sea-born',earth:'stone-skinned',air:'winged',life:'quickened',rot:'blighted',word:'learned'};
const N={},stat={kept:0,same:0,chart:0,none:0},why={};
for(const k in B){const v=B[k],[a,b]=k.split('|');
  if(KEEP.includes(v[2])){N[k]=v;stat.kept++;continue;}
  if(a===b){N[k]=v;stat.same++;continue;}
  {const ba=body(a),bb=body(b);if(ba!==bb){const th=ba?a:b,q=ba?b:a,sq=sch(q)||'word';const sum=syl(a)+syl(b),tt=sum<=3?2:sum<=5?3:4;N[k]=[th,tt,'take',TR[sq]];stat.take=(stat.take||0)+1;continue;}
  const sa=sch(a)||'word',sb=sch(b)||'word',key=[sa,sb].sort().join('|'),sum=syl(a)+syl(b),t=sum<=3?0:sum<=5?1:2;
  if(ba){if(!(crea(a)&&crea(b))){stat.drop=(stat.drop||0)+1;continue;}
    const F=FAM[key];let o=null,ut=t;for(const tt of (t===0?[0,1,2]:t===1?[1,2,0]:[2,1,0])){const c=F[tt];if(!o&&c!==a&&c!==b&&crea(c)){o=c;ut=tt;}}
    if(!o){stat.drop=(stat.drop||0)+1;continue;}N[k]=[o,ut+2,'hybrid','',ut];stat.hybrid=(stat.hybrid||0)+1;continue;}
  const gs=w=>['ground','spell'].some(p=>(W[w].props||[]).includes(p));
  if(!(gs(a)&&gs(b))){stat.drop=(stat.drop||0)+1;continue;}
  const o=QC[key];if(!o||o===a||o===b||!W[o]){stat.drop=(stat.drop||0)+1;continue;}
  N[k]=[o,t+2,'quality','',t];stat.quality=(stat.quality||0)+1;continue;}}
return JSON.stringify({N,FAM,stat,syls:Object.keys(W).filter(w=>W[w].t===NOUN).reduce((m,w)=>{m[syl(w)]=(m[syl(w)]||0)+1;return m},{})});
})()`,g);
const o=JSON.parse(out);console.log(o.stat,o.syls);fs.writeFileSync('/home/claude/dtest/v14/web16.json',JSON.stringify(o.N));fs.writeFileSync('/home/claude/dtest/v14/fam.json',JSON.stringify(o.FAM,null,1));
const N=o.N;for(const k of ['debt|water','debt|tower','debt|wasp','abyss|centaur','erosion|oak','abyss|boar','fire|oak','crow|owl','adder|boar'])console.log(k,N[k]);
let ret=0,n=0;for(const k in N){n++;const [a,b]=k.split('|');if(a!==b&&(N[k][0]===a||N[k][0]===b))ret++;}console.log('entries',n,'returnInput(non-same)',ret);
