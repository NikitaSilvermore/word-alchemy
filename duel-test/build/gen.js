const fs=require('fs'),vm=require('vm');const D='/home/claude/word-alchemy/duel-test/node';
var g;eval(fs.readFileSync(D+'/load.js','utf8').replace(/vm\.runInContext\("var S=newGame[\s\S]*$/,'').replace(/__dirname/g,JSON.stringify(D)).replace("const g=","g="));
g.CH=JSON.parse(fs.readFileSync('chart.json','utf8'));const out=vm.runInContext(`(function(){
const WB=window.WEB21,B=WB.base,KEEP=['special','named pair','hybrid','metal','potion','element','haunt'];
const sch=w=>(typeof SCHOOLOF!=='undefined'&&SCHOOLOF[w])||(WB.cards[w]&&WB.cards[w].sch)||null;
const body=w=>W[w]&&W[w].t===NOUN&&!['potion','burden','event','spell','ground','concept','clime'].some(p=>(W[w].props||[]).includes(p));
// families from existing chart entries
const fam={};
for(const k in B){const v=B[k];if(v[2]!=='chart')continue;const [a,b]=k.split('|');const sa=sch(a)||sch(b),sb=sch(b)||sch(a);if(!sa||!sb)continue;const key=[sa,sb].sort().join('|');const o=v[0];if(!body(o))continue;
  const t=v[1]<=2?0:v[1]===3?1:2;fam[key]=fam[key]||[{},{},{}];fam[key][t][o]=(fam[key][t][o]||0)+1;}
const FAM=CH;for(const k in FAM)for(const w of FAM[k])if(!W[w])throw 'missing '+w;
// fill empty tiers from neighbours
for(const k in FAM){}
const syl=w=>(W[w]&&W[w].syl)||1;const TR={fire:'fireborn',water:'sea-born',earth:'stone-skinned',air:'winged',life:'quickened',rot:'blighted',word:'learned'};
const N={},stat={kept:0,same:0,chart:0,none:0},why={};
for(const k in B){const v=B[k],[a,b]=k.split('|');
  if(KEEP.includes(v[2])){N[k]=v;stat.kept++;continue;}
  if(a===b){N[k]=v;stat.same++;continue;}
  {const ba=body(a),bb=body(b);if(ba!==bb){const th=ba?a:b,q=ba?b:a,sq=sch(q)||'word';const sum=syl(a)+syl(b),tt=sum<=3?2:sum<=5?3:4;N[k]=[th,tt,'take',TR[sq]];stat.take=(stat.take||0)+1;continue;}}
  const sa=sch(a)||sch(b),sb=sch(b)||sch(a);const key=sa&&sb?[sa,sb].sort().join('|'):null;const F=key&&FAM[key];
  if(!F){stat.none++;continue;}
  const sum=syl(a)+syl(b),t=sum<=3?0:sum<=5?1:2;let o=null;
  for(const tt of [t,2,1,0]){const c=F[tt];if(!o&&c!==a&&c!==b)o=c;}
  if(!o){stat.none++;continue;}
  N[k]=[o,t+2,'chart','',t];stat.chart++;}
return JSON.stringify({N,FAM,stat,syls:Object.keys(W).filter(w=>W[w].t===NOUN).reduce((m,w)=>{m[syl(w)]=(m[syl(w)]||0)+1;return m},{})});
})()`,g);
const o=JSON.parse(out);console.log(o.stat,o.syls);fs.writeFileSync('/home/claude/dtest/v14/web14.json',JSON.stringify(o.N));fs.writeFileSync('/home/claude/dtest/v14/fam.json',JSON.stringify(o.FAM,null,1));
const N=o.N;for(const k of ['debt|water','debt|tower','debt|wasp','abyss|centaur','erosion|oak','abyss|boar','fire|oak','crow|owl','adder|boar'])console.log(k,N[k]);
let ret=0,n=0;for(const k in N){n++;const [a,b]=k.split('|');if(a!==b&&(N[k][0]===a||N[k][0]===b))ret++;}console.log('entries',n,'returnInput(non-same)',ret);
