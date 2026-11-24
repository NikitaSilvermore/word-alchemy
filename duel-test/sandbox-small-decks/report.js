/* Turns the result files into the report's tables (markdown) and its data. node report.js -> out/report.json, out/report.md */
const fs=require('fs');const E=require('./load.js');const {summarise,matrix,cards}=require('./sum.js');
const R=n=>{const f='results/'+n+'.json';return fs.existsSync(f)?JSON.parse(fs.readFileSync(f)):null;};
const pc=(x,d)=>(x*100).toFixed(d==null?1:d)+'%';
function extra(Rn){/* how much of a deck a player sees and uses */let seen=0,used=0,n=0,dead=0;Rn.deck.forEach((D,i)=>{const dk=[...new Set(Rn.decks[i])];let s=0,u=0,dd=0;for(const c of dk){const x=D.cards[c]||{dr:0,pl:0};s+=x.dr/D.g;u+=x.pl/D.g;dd+=x.dr?1-x.pl/x.dr:0;}seen+=s/dk.length;used+=u/dk.length;dead+=dd/dk.length;n++;});return {seen:seen/n,used:used/n,dead:dead/n};}
function line(name,label){const r=R('sw_'+name);if(!r)return null;const a=summarise(r).all,x=extra(r);return Object.assign({label,name},a,x);}
const out={};const md=[];
const T=(title,head,rows)=>{md.push('### '+title,'','| '+head.join(' | ')+' |','| '+head.map(()=>'---').join(' | ')+' |',...rows.map(r=>'| '+r.join(' | ')+' |'),'');};
const cols=l=>[l.label,pc(l.firstWin),l.rounds.toFixed(1),pc(l.seen,0),pc(l.used,0),l.fuse.toFixed(2),pc(l.decided,0),pc(l.comeb,0),l.topH.toFixed(2),pc(l.openVar,0),pc(l.wrSd),l.outside+'/'+l.n];
const HEAD=['Setting','First player wins','Rounds','Deck seen per game','Deck played per game','Fusions per player','One card decides','Comebacks','Finisher variety (bits)','Different openings','Spread of deck win rates (sd)','Decks outside 45–55%'];
/* grid */
out.grid=[];for(const d of [8,10,12,20])for(const h of [3,4,5,6,7]){const l=line(`deck${d}_hand${h}`,`${d} words, hand ${h}`);if(l){l.deck=d;l.hand=h;out.grid.push(l);}}
T('Deck size by hand size',HEAD,out.grid.map(cols));
out.dur=[];for(const d of [1,1.5,2])for(const r of ['remember','forget']){const l=line(`dur${d}_${r}`,`stand ×${d}, actions ${r==='remember'?'remembered':'last one turn'}`);if(l)out.dur.push(l);}
T('Durability',HEAD,out.dur.map(cols));
out.gm=[];for(const g of ['On','Off'])for(const m of ['On','Off']){const l=line(`grave${g}_market${m}`,`graveyard ${g.toLowerCase()}, market ${m.toLowerCase()}`);if(l){const r=R(`sw_grave${g}_market${m}`);l.raised=summarise(r).all.raised;l.bought=r.deck.reduce((s,D)=>s+D.bought/D.g,0)/r.deck.length;out.gm.push(l);}}
T('Graveyard and market',HEAD.concat(['Words bought per player']),out.gm.map(l=>cols(l).concat([l.bought.toFixed(2)])));
out.copies=[];for(const c of [1,2,3]){const l=line('copies'+c,c===1?'one of each':'up to '+c+' of a word');if(l)out.copies.push(l);}
T('Copies (each field plays itself)',HEAD,out.copies.map(cols));
function cross(name,groups){const r=R('sw_'+name);if(!r)return null;const g=groups.map(()=>({g:0,w:0}));r.deck.forEach((D,i)=>{const k=r.spec.groups[i];g[k].g+=D.g-D.d;g[k].w+=D.w;});return groups.map((n,i)=>({group:n,wr:g[i].w/g[i].g,games:g[i].g}));}
out.copiesVs={2:cross('copies2_vs_1',['one of each','two of each']),3:cross('copies3_vs_1',['one of each','three of each'])};
out.schools=[];for(const s of [1,2,3]){const l=line('schools'+s,s+' school'+(s>1?'s':''));if(l)out.schools.push(l);}
T('Schools per deck (each field plays itself)',HEAD,out.schools.map(cols));
out.schoolsCross=cross('schools_cross',['1 school','2 schools','3 schools']);
out.today=[line('today_like','Today-like: 20 words, hand 6, stand as printed, 2 copies, market, no graveyard'),line('recommended','Recommended')].filter(Boolean);
T('Today-like table against the recommended one',HEAD,out.today.map(cols));
/* per-school routes and graveyard use, from the graveyard on/off runs */
function bySchool(name){const r=R(name);if(!r)return null;const o={};r.deck.forEach((D,i)=>{const id=r.ids[i];const sc=E.THEMES[id]?E.THEMES[id].sch:null;if(!sc)return;const x=o[sc]||(o[sc]={g:0,w:0,raised:0,route:{},dmg:0});x.g+=D.g;x.w+=D.w;x.raised+=D.raised;x.dmg+=D.dmg;for(const k in D.route)x.route[k]=(x.route[k]||0)+D.route[k];});return o;}
out.graveSchool={on:bySchool('sw_graveOn_marketOff'),off:bySchool('sw_graveOff_marketOff')};
function byDeck(name){const r=R(name);if(!r)return null;const S=summarise(r);const o={};S.rows.forEach(x=>o[x.id]=x);return o;}
out.graveDeck={on:byDeck('sw_graveOn_marketOff'),off:byDeck('sw_graveOff_marketOff')};out.marketDeck={on:byDeck('sw_graveOn_marketOn'),off:byDeck('sw_graveOn_marketOff')};
/* final matrix */
function mergeFinal(){let M=null;const add=(x,y)=>{for(const k in y){if(typeof y[k]==='number')x[k]=(x[k]||0)+y[k];else if(y[k]&&typeof y[k]==='object'&&!Array.isArray(y[k])){x[k]=x[k]||{};add(x[k],y[k]);}}};
  for(let k=1;k<=4;k++){const r=R('final_'+k);if(!r)continue;if(!M){M=r;continue;}M.games+=r.games;add(M.pair,r.pair);for(let i=0;i<M.deck.length;i++)add(M.deck[i],r.deck[i]);}return M;}
const F=mergeFinal();if(F){const S=summarise(F);out.final={all:Object.assign(S.all,extra(F)),rows:S.rows.map((r,i)=>Object.assign(r,{name:E.titleOf(r.id),sch:E.THEMES[r.id]?E.THEMES[r.id].sch:'character',deck:F.decks[i]})),matrix:matrix(F),ids:F.ids};
  out.final.cards={};F.ids.forEach((id,i)=>{out.final.cards[id]=cards(F,i).filter(c=>F.decks[i].includes(c.id)||E.DB[c.id]&&(E.DB[c.id].made||E.DB[c.id].tok)&&c.drawn+c.playRate>0);});}
out.story=R('storywords');
fs.mkdirSync('out',{recursive:true});fs.writeFileSync('out/report.json',JSON.stringify(out));fs.writeFileSync('out/report.md',md.join('\n'));console.log(md.join('\n'));
console.log('copies vs',JSON.stringify(out.copiesVs));console.log('schools cross',JSON.stringify(out.schoolsCross));
