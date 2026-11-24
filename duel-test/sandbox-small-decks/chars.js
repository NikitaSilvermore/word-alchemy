/* Deck-list search for the character decks. Card numbers are fixed (the tuned set); only the choice of ten words changes.
   Each round tries single swaps from the character's own pool against the whole theme field and keeps the list nearest 50%.
   node chars.js levels.json rounds games  -> chars.json */
const cp=require('child_process'),fs=require('fs');const E=require('./load.js');const {overrides}=require('./tune.js');
const levels=JSON.parse(fs.readFileSync(process.argv[2]));const rounds=+process.argv[3]||6,games=+process.argv[4]||16;const tune=overrides(levels);
const TH=E.THEMES,SUP=E.SUP;const core=(...t)=>[].concat(...t.map(x=>TH[x].core));const sup=(...s)=>[].concat(...s.map(x=>SUP[x]));
const POOL={dorothea1:core('hedgerow','falconry').concat(sup('life','air')),dorothea2:core('woodland','orchard').concat(sup('life','earth','water')),
 dorothea3:core('woodland','mushroom','paper','ferment','barge','herbal').concat(sup('life','rot','water')),ruth:core('paper','ferment','mushroom').concat(sup('rot'),['folio']),
 mara:core('glass','foundry','wildfire','storm').concat(sup('fire','air')),pieter:core('locks','masonry','quarry').concat(sup('water','earth')),ambrose:core('ledger','press','metal').concat(sup('word','earth'))};
const KEEP=4;/* the first four words are the character's signature and never change */
let cur=fs.existsSync('chars.json')?JSON.parse(fs.readFileSync('chars.json')):{};for(const k in E.CHARS)if(!cur[k])cur[k]=E.CHARS[k].list.slice();
const themes=Object.keys(TH);let seedN=1;
function evalLists(cands){const entries=themes.map(id=>({id,label:id})).concat(cands.map((c,i)=>({id:c.k,list:c.list.slice(0,10),label:'c'+i})));
  const spec={name:'chars',cfg:{deck:10,hand:5},games,tune,entries,groups:themes.map(()=>0).concat(cands.map(()=>1)),seed:(seedN++)*7717};fs.writeFileSync('results/_chspec.json',JSON.stringify(spec));
  cp.execFileSync('node',['run.js','results/_chspec.json','results/_ch.json'],{stdio:'ignore'});const R=JSON.parse(fs.readFileSync('results/_ch.json'));
  return cands.map((c,i)=>{const D=R.deck[themes.length+i];return D.w/(D.g-D.d||1);});}
const rnd=()=>Math.random();
for(let r=0;r<rounds;r++){const cands=[];for(const k in cur){cands.push({k,list:cur[k]});const ten=cur[k].slice(0,10),pool=[...new Set(POOL[k])].filter(x=>!ten.includes(x));
    for(let n=0;n<9&&pool.length;n++){const l=cur[k].slice();const pos=KEEP+Math.floor(rnd()*(10-KEEP));const inn=pool[Math.floor(rnd()*pool.length)];const j=l.indexOf(inn);const out=l[pos];l[pos]=inn;if(j>=0)l[j]=out;else l.push(out);cands.push({k,list:l});}}
  const wr=evalLists(cands);const best={};cands.forEach((c,i)=>{const d=Math.abs(wr[i]-.5);if(!best[c.k]||d<best[c.k].d-0.01)best[c.k]={d,wr:wr[i],list:c.list};});
  for(const k in best)cur[k]=best[k].list;console.log('round '+r+': '+Object.keys(best).map(k=>k+' '+(best[k].wr*100).toFixed(0)).join(', '));fs.writeFileSync('chars.json',JSON.stringify(cur));}
for(const k in cur)console.log(k+': '+cur[k].slice(0,10).join(', '));
