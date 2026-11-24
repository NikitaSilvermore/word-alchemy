/* How much does one story word matter? Each home deck is played with the word and with the word swapped for the next card on its list,
   against the whole theme field. Also at a 20-card, two-copy "today-like" table. node storywords.js levels.json games -> results/storywords.json */
const cp=require('child_process'),fs=require('fs');const E=require('./load.js');const {overrides}=require('./tune.js');
const levels=JSON.parse(fs.readFileSync(process.argv[2]));const games=+process.argv[3]||64;const tune=overrides(levels);const themes=Object.keys(E.THEMES);
const HOME={pear:'orchard',keystone:'masonry',snowflake:'frost',magnify:'tiny',conjoin:'herbal',resonant:'naming',time:'ledger',crucible:'metal',rhinoceros:'quarry',margin:'naming',meridian:'scribes','green book':'woodland',folio:'paper',guard:'hedgerow'};
const REC=fs.existsSync('recommended.json')?JSON.parse(fs.readFileSync('recommended.json')):{deck:10,hand:5,dur:1.5,grave:true,market:false};
function variants(size,copies){const out=[];for(const w in HOME){const h=HOME[w];const full=E.THEMES[h].core.concat(E.THEMES[h].sup);let base=E.deckOf(h,size,copies);
    let withW=base.slice(),without;if(!withW.includes(w)){/* swap the last word for it */withW[withW.length-1]=w;without=base.slice();}
    else{const spare=full.find(c=>!base.includes(c)&&c!==w);without=base.map(c=>c===w?spare:c);if(copies>1){/* one copy of the story word only */let seen=false;withW=withW.map(c=>{if(c!==w)return c;if(!seen){seen=true;return c;}return spare;});}}
    out.push({w,h,withW,without});}return out;}
function run(name,cfg,size,copies){const V=variants(size,copies);const entries=themes.map(id=>({id,copies,label:id}));const groups=themes.map(()=>0);
  for(const v of V){entries.push({id:v.h,list:v.withW,label:v.w+'+'});groups.push(1);entries.push({id:v.h,list:v.without,label:v.w+'-'});groups.push(1);}
  const spec={name,cfg:Object.assign({},cfg,{deck:size,copies}),games,tune,entries,groups,seed:4242};fs.writeFileSync('results/_swspec.json',JSON.stringify(spec));cp.execFileSync('node',['run.js','results/_swspec.json','results/_sw.json'],{stdio:'ignore'});
  const R=JSON.parse(fs.readFileSync('results/_sw.json'));const res={};V.forEach((v,i)=>{const a=R.deck[themes.length+2*i],b=R.deck[themes.length+2*i+1];const c=a.cards[v.w]||{dr:0,pl:0,plW:0,dmg:0};
    res[v.w]={home:v.h,wrWith:a.w/a.g,wrWithout:b.w/b.g,delta:a.w/a.g-b.w/b.g,drawn:c.dr/a.g,played:c.pl/a.g,wrWhenPlayed:c.plW/(c.pl||1),wrWhenNot:(a.w-c.plW)/((a.g-c.pl)||1),dmgShare:c.dmg/(a.dmg||1),games:a.g};});return res;}
const out={recommended:run('story-rec',REC,REC.deck||10,1),today:run('story-today',{hand:6,dur:1,grave:false,market:true},20,2)};
fs.writeFileSync('results/storywords.json',JSON.stringify(out));
for(const k of ['recommended','today']){console.log('== '+k);for(const w in out[k]){const r=out[k][w],pc=x=>(x*100).toFixed(1);console.log(w.padEnd(11),r.home.padEnd(9),'with',pc(r.wrWith),'without',pc(r.wrWithout),'Δ',pc(r.delta),'drawn',pc(r.drawn),'played',pc(r.played),'wr played/not',pc(r.wrWhenPlayed)+'/'+pc(r.wrWhenNot),'dmg',pc(r.dmgShare));}}
