"use strict";
/* ---- your standing between matches: gold, rank, the words you own, your deck ---- */
const RANKS=[
 {n:'Nigredo I',xp:0,perk:'Six breath a turn. Decks of 12 to 28 words, two copies of each. The shop sells plain words.'},
 {n:'Nigredo II',xp:3,perk:'The shop begins to stock rarer words.'},
 {n:'Nigredo III',xp:7,perk:'The furnace opens: refine a word you own.'},
 {n:'Albedo I',xp:12,perk:'The shop stocks potent words. Decks of up to 28.'},
 {n:'Albedo II',xp:18,perk:'Seven breath a turn.'},
 {n:'Albedo III',xp:25,perk:'Exalting: refine a word a second time.'},
 {n:'Citrinitas I',xp:33,perk:'The shop stocks the great words.'},
 {n:'Citrinitas II',xp:42,perk:'A hand of seven words.'},
 {n:'Citrinitas III',xp:52,perk:'Decks of up to 32.'},
 {n:'Rubedo I',xp:63,perk:'Eight breath a turn.'},
 {n:'Rubedo II',xp:75,perk:'Your things can know three verbs.'},
 {n:'Rubedo III',xp:90,perk:'The Great Work is done. You begin every match with 5 more life.'}
];
const QUICKLIFE=20,STORYLIFE=30,DECKMIN=12, REROLL=5, REFINE=[40,90], STOCK=8;
function newProfile(){const owned={};STARTER.forEach(w=>owned[w]=(owned[w]||0)+1);return{v:1,gold:30,xp:0,wins:0,losses:0,owned,deck:STARTER.slice(),up:{},stock:[],found:{},mig:12,rs:2};}
let PF=newProfile(), store=null, saving=Promise.resolve();
function rankOf(xp){let r=0;RANKS.forEach((k,i)=>{if(xp>=k.xp)r=i;});return r;}
function perks(r){return{ink:6+(r>=4?1:0)+(r>=9?1:0),hand:6+(r>=7?1:0),maxVerbs:2+(r>=10?1:0),deckMax:r>=8?36:r>=3?32:28,copies:2,tier:r>=6?4:r>=3?3:r>=1?2:1,refine:r>=5?2:r>=2?1:0,life:r>=11?5:0};}
function pk(){return perks(rankOf(PF.xp));}
function migrate(p){if(!p||p.v!==1||!p.owned||!Array.isArray(p.deck))return p;
  if((p.rs||0)<2){for(const k of Object.keys(p))delete p[k];Object.assign(p,newProfile());return p;}
  if(p.owned.and){p.owned.fuse=(p.owned.fuse||0)+p.owned.and;delete p.owned.and;}p.deck=p.deck.map(w=>w==='and'?'fuse':w);if(p.up&&p.up.and){p.up.fuse=p.up.and;delete p.up.and;}if(Array.isArray(p.stock))p.stock=p.stock.map(w=>w==='and'?'fuse':w);if(p.st&&p.st.wd&&p.st.wd.and){p.st.wd.fuse=1;delete p.st.wd.and;}
  if(p.owned.brimstone){p.owned.fire=(p.owned.fire||0)+p.owned.brimstone;}p.deck=p.deck.map(w=>w==='brimstone'?'fire':w).filter(w=>W[w]);
  for(const w of Object.keys(p.owned))if(!W[w])delete p.owned[w];if(p.up)for(const w of Object.keys(p.up))if(!W[w])delete p.up[w];if(Array.isArray(p.stock))p.stock=p.stock.filter(w=>W[w]);
  if((p.mig||0)<12){if(!p.owned.blow){p.owned.blow=1;if(p.deck.length<perks(rankOf(p.xp||0)).deckMax)p.deck.push('blow');}if((p.mig||0)>=11)p.mig=12;}
  if((p.mig||0)<11){const first=(p.mig||0)<10;p.found=p.found||{};for(const w of ['water','earth','air','fuse','fuse']){p.owned[w]=(p.owned[w]||0)+1;if(p.deck.length<perks(rankOf(p.xp||0)).deckMax)p.deck.push(w);}if(!first)p.mig=12;}
  if((p.mig||0)<10){p.mig=12;if(!p.owned.enchant){p.owned.enchant=1;if(p.deck.length<perks(rankOf(p.xp||0)).deckMax)p.deck.push('enchant');}}
  return p;}
const EVFIT={enchant:()=>true,gild:()=>true,name:()=>true,awaken:p=>!p.includes('minded'),temper:p=>p.includes('metal')||p.includes('sharp'),distil:p=>p.includes('liquid'),ripen:p=>p.includes('plant'),tame:p=>p.includes('beast'),crown:p=>p.includes('living')};
const isEvent=w=>W[w].t===NOUN&&W[w].props.includes('event');
function okProfile(p){return p&&p.v===1&&typeof p.gold==='number'&&p.owned&&Array.isArray(p.deck)&&p.deck.every(w=>W[w])&&Object.keys(p.owned).every(w=>W[w]);}
function loadLocal(){try{const p=migrate(JSON.parse(localStorage.getItem('word-alchemy-profile')||'null'));if(okProfile(p))PF=Object.assign(newProfile(),p);}catch(e){}}
function save(){
  achCheck();PF.rev=(PF.rev||0)+1;
  try{localStorage.setItem('word-alchemy-profile',JSON.stringify(PF));}catch(e){}
  if(store){clearTimeout(save.t);save.t=setTimeout(()=>{const body=JSON.parse(JSON.stringify(PF));saving=saving.then(()=>store.set(body)).catch(()=>new Promise(r=>setTimeout(r,4000)).then(()=>store.set(body))).catch(()=>{});},1500);}
}
function rewardFix(){if(PF.rw2)return;PF.rw2=1;const st=sSt();let any=false;for(const n of STORY.nodes)if(st.done[n.id]&&n.word&&W[n.word]&&!st.hoard[n.word]){sLearn(n.word,n);st.log.push({n:n.id,r:'note',d:today(),x:(n.who?n.who.n:n.place)+' also gave me the word “'+n.word+'”.'});any=true;}if(any)save();}
function grant3(){if(PF.g3||!(PF.fam&&PF.fam.name==='Sasha'))return;PF.g3=1;const st=sSt(),n=sNode('hale');if(n&&!st.done.hale){st.done.hale=Date.now();sLearn(n.word,n);st.log.push({n:'hale',r:'win',d:today(),first:1,w:n.word});PF.wins=(PF.wins||0)+1;PF.xp=(PF.xp||0)+3;PF.gold+=30;bump('matches');st.at='hale';save();if(view==='story')renderAll();}}
function grant2(){if(PF.g2||!(PF.fam&&PF.fam.name==='Sasha'))return;PF.g2=1;const st=sSt();let last=null;for(const id of ['roux','reeve']){const n=sNode(id);if(n&&!st.done[id]){st.done[id]=Date.now();sLearn(n.word,n);st.log.push({n:id,r:'win',d:today(),first:1,w:n.word});PF.wins=(PF.wins||0)+1;PF.xp=(PF.xp||0)+3;PF.gold+=30;bump('matches');PF.last={r:'win',n:n.who.n,p:n.who.p,gold:30};last=n;}}
  if(last){st.pend={kind:'learn',id:last.id,w:last.word};try{localStorage.removeItem('word-alchemy-match');}catch(e){}if(S&&S.story){S.live=false;}view='story';jS.tab='map';jS.sel=null;jS.pop=null;}save();renderAll();}
function grant1(){if(PF.g1||!(PF.fam&&PF.fam.name==='Sasha'))return;PF.g1=1;const st=sSt(),n=sNode('roux');if(n&&!st.done.roux){st.done.roux=Date.now();sLearn(n.word,n);st.log.push({n:'roux',r:'win',d:today(),first:1,w:n.word});st.pend={kind:'learn',id:'roux',w:n.word};PF.wins=(PF.wins||0)+1;PF.xp=(PF.xp||0)+3;PF.gold+=30;bump('matches');PF.last={r:'win',n:n.who.n,p:n.who.p,gold:30};PF.pro=1;}save();view='story';jS.tab='map';jS.sel=null;renderAll();}
async function linkStore(){
  try{
    if(!(window.claude&&window.claude.use))return;
    const db=await window.claude.use('db'),user=await window.claude.use('user');if(!db||!user)return;
    const id=await user.id();if(!id)return;
    store=db.doc('data/users/'+id+'/profile');
    const snap=await store.get(),d=snap&&snap.exists?snap.data():null;
    migrate(d);if(okProfile(d)&&((d.rev||0)>(PF.rev||0)||(!(d.rev||PF.rev)&&(d.xp>PF.xp||(d.xp===PF.xp&&(d.wins+d.losses)>=(PF.wins+PF.losses)))))){PF=Object.assign(newProfile(),JSON.parse(JSON.stringify(d)));renderAll();}
    else save();
    grant1();grant2();grant3();try{rewardFix();}catch(e){}
  }catch(e){}
}
function pick(arr,n){const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a.slice(0,n);}
function restock(){const t=pk().tier,ok=ALLWORDS.filter(w=>tierOf(w)<=t),isV=w=>W[w].t===VERB,vs=pick(ok.filter(isV),3);PF.stock=pick(vs.concat(pick(ok.filter(w=>!vs.includes(w)),STOCK-vs.length)),STOCK);}
function inDeck(w){return PF.deck.filter(x=>x===w).length;}
function stars(w,up){const n=(up||PF.up)[w]||0;return n?' <img class="star" src="assets/ds/star'+n+'.webp" alt="'+(n===2?'exalted':'refined')+'" title="'+(n===2?'Exalted':'Refined')+'">':'';}

/* ---- the match ---- */
let S, view='home', prevHand=null, bk='cards', jm=false;try{jm=localStorage.getItem('word-alchemy-jm')==='1';}catch(e){}
function setJm(v){jm=!!v;try{localStorage.setItem('word-alchemy-jm',jm?'1':'0');}catch(e){}}
const JV=['story','deck','scrip','book','shop','ach'];
let ui={adjs:[],subj:null,verb:null,kverb:null,obj:null,clime:null,msg:'',discard:false},toss='discard';
const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const TYPE={noun:'thing',verb:'verb',adj:'adjective',cat:'category',clime:'weather'};
function readyVerbs(t){if(!S||S.phase!=='play'||t.side!==0||t.acted||!(t.verbs&&t.verbs.length))return[];
  const objs=[null,{k:'player',i:1}].concat(S.things.filter(x=>x!==t).map(x=>({k:'thing',id:x.id})));
  return t.verbs.filter(w=>objs.some(o=>{try{return validate(S,0,{adjs:[],subj:{k:'thing',id:t.id},verb:null,kverb:w,obj:o,clime:null}).ok;}catch(e){return false;}}));}
function readyThings(){return S.things.filter(t=>readyVerbs(t).length);}
function clearUi(){ui={adjs:[],subj:null,verb:null,kverb:null,obj:null,clime:null,msg:'',discard:false};}
function sen(){return{adjs:ui.adjs.slice(),subj:ui.subj,verb:ui.verb,kverb:ui.kverb,obj:ui.obj,clime:ui.clime};}
function usedIdx(){const u=ui.adjs.slice();if(ui.verb!=null)u.push(ui.verb);if(ui.clime!=null)u.push(ui.clime);if(ui.subj&&ui.subj.k==='card')u.push(ui.subj.i);if(ui.obj&&ui.obj.k==='card')u.push(ui.obj.i);return u;}
function same(a,b){return a&&b&&a.k===b.k&&(a.k==='thing'?a.id===b.id:a.i===b.i);}
/* ---- achievements: [id, name, what to do, tier 1-5, stat, threshold] ---- */
const ACHG=[0,10,25,75,250,1000],ACHT=['','Lead','Copper','Silver','Gold','The Stone'];
const ACH=[
 ['m1','First Words','Finish your first match',1,'matches',1],['w1','First Blood','Win a match',1,'wins',1],['rx1','It Reacts','Make your first reaction',1,'rx',1],
 ['b1','A New Word','Buy a word from the shop',1,'bought',1],['q1','Errand Run','Complete a daily quest',1,'quests',1],['rf1','Into the Furnace','Refine a word',1,'refined',1],
 ['br1','Something From Nothing','Bring forth a thing',1,'brought',1],['cl1','Weather Talk','Speak a weather or season',1,'clime',1],['sp1','Hocus','Cast a spell',1,'spells',1],['gr1','Groundwork','Lay an element on your ground',1,'ground',1],
 ['m10','Apprentice','Finish 10 matches',1,'matches',10],['m50','Journeyman','Finish 50 matches',2,'matches',50],['m100','Regular at the Bench','Finish 250 matches',3,'matches',250],['m250','Fixture','Finish 1,000 matches',4,'matches',1000],['m500','Part of the Furniture','Finish 5,000 matches',5,'matches',5000],
 ['w5','Getting the Hang','Win 5 matches',1,'wins',5],['w10','Sharp Tongue','Win 10 matches',2,'wins',10],['w25','Silver Tongue','Win 25 matches',2,'wins',25],['w50','Golden Tongue','Win 100 matches',3,'wins',100],['w100','Orator','Win 300 matches',4,'wins',300],['w250','The Last Word','Win 1,000 matches',5,'wins',1000],
 ['s3','On a Roll','Win 3 matches in a row',2,'best',3],['s5','Unanswerable','Win 5 matches in a row',3,'best',5],['s10','Lost for Words','Win 10 matches in a row',4,'best',10],['s25','Speechless','Win 25 matches in a row',5,'best',25],['s50','Silence Falls','Win 50 matches in a row',5,'best',50],
 ['f8','Brief','Win within 8 rounds',2,'win8',1],['f6','Laconic','Win within 6 rounds',3,'win6',1],['f5','One-Liner','Win within 5 rounds',4,'win5',1],['f4','A Single Breath','Win within 4 rounds',5,'win4',1],['f1','The First Word Is the Last','Win in the very first round',4,'win1r',1],['f6x10','Man of Few Words','Win within 6 rounds, 25 times',4,'win6',25],['f5x50','Nothing More to Say','Win within 5 rounds, 50 times',5,'win5',50],
 ['cl5','By a Breath','Win with 5 life or less',3,'close',1],['cl1x','On the Last Syllable','Win with exactly 1 life',4,'win1',1],['cl5x5','Nine Lives','Win with 5 life or less, 25 times',5,'close',25],
 ['hi40','Barely Scratched','Win with 40 life or more',2,'hiLife',40],['hi55','Untouchable','Win with 55 life or more',3,'hiLife',55],['hi60','Not a Mark','Win without ending below your starting life',4,'flawless',1],['hi60x','Beyond Reach','Win without ending below your starting life, 25 times',5,'flawless',25],
 ['long','War of Attrition','Win a match that lasts 20 rounds',2,'longWin',1],['pure','Plain Speaking','Win without making a reaction',2,'plainWin',1],['norx5','Brute Force','Win 25 matches without a reaction',3,'plainWin',25],
 ['unlost','Not a Scratch on Them','Win without losing a single thing',3,'cleanWin',1],['unl10','Good Shepherd','Win without losing a thing, 10 times',4,'cleanWin',10],['unl50','None Shall Fall','Win without losing a thing, 50 times',5,'cleanWin',50],
 ['sy50','Chatterbox','Speak 100 sentences',1,'said',100],['sy500','Talkative','Speak 1,000 sentences',2,'said',1000],['sy2k','Loquacious','Speak 10,000 sentences',3,'said',10000],['sy25k','Never Shuts Up','Speak 25,000 sentences',4,'said',25000],['sy10k','The Endless Sentence','Speak 100,000 sentences',5,'said',100000],
 ['wd25','Wordy','Speak 25 different words',1,'words',25],['wd60','Well Read','Speak 60 different words',2,'words',60],['wd100','Walking Dictionary','Speak 100 different words',3,'words',100],['wd150','Lexicographer','Speak 150 different words',4,'words',150],['wdall','Every Word in the Book','Speak every word in the game',5,'words',-1],
 ['aj25','Colourful Language','Use 50 adjectives',1,'adjs',50],['aj250','Purple Prose','Use 1,000 adjectives',3,'adjs',1000],['aj10k','Gilded Lily','Use 10,000 adjectives',4,'adjs',10000],
 ['vb100','Doing Words','Use 250 verbs',2,'verbs',250],['vb1k','Man of Action','Use 5,000 verbs',3,'verbs',5000],['vb25k','Perpetual Motion','Use 25,000 verbs',4,'verbs',25000],
 ['br50','Menagerie','Bring forth 50 things',1,'brought',50],['br500','Maker','Bring forth 1,000 things',2,'brought',1000],['br10k','Creator','Bring forth 10,000 things',4,'brought',10000],['br2k','Demiurge','Bring forth 50,000 things',5,'brought',50000],
 ['k10','Breaker','Destroy 25 of your opponents’ things',1,'kills',25],['k100','Wrecker','Destroy 250 things',2,'kills',250],['k500','Ruin','Destroy 2,500 things',3,'kills',2500],['k10k','Desolation','Destroy 10,000 things',4,'kills',10000],['k1500','Nothing Left Standing','Destroy 50,000 things',5,'kills',50000],
 ['mk5','Clean Sweep','Destroy 5 things in one match',2,'mKills',5],['mk10','Scorched Earth','Destroy 10 things in one match',3,'mKills',10],['mk15','Salt the Fields','Destroy 15 things in one match',4,'mKills',15],['mk25','Extinction','Destroy 25 things in one match',5,'mKills',25],
 ['h10','Heavy Hand','Deal 15 to your opponent in one sentence',2,'maxHit',15],['h20','Hammer Blow','Deal 30 in one sentence',3,'maxHit',30],['h50','Thunderclap','Deal 50 in one sentence',4,'maxHit',50],['h30','Coup de Grâce','Deal 100 in one sentence',5,'maxHit',100],
 ['bu10','Firestarter','Set 25 things burning',1,'burn',25],['bu100','Pyromaniac','Set 500 things burning',3,'burn',500],['bu5k','The Great Fire','Set 5,000 things burning',4,'burn',5000],
 ['fz10','Cold Snap','Freeze 10 things',2,'freeze',10],['fz50','Deep Winter','Freeze 250 things',3,'freeze',250],['fz2k','Ice Age','Freeze 2,500 things',4,'freeze',2500],
 ['dr10','Wet Blanket','Drench 25 things',1,'drench',25],['dr100','Deluge','Drench 500 things',3,'drench',500],['dr5k','The Flood','Drench 5,000 things',4,'drench',5000],
 ['po10','Bad Medicine','Poison 25 things',1,'poison',25],['po100','Borgia','Poison 500 things',3,'poison',500],['po5k','Plague Bearer','Poison 5,000 things',4,'poison',5000],
 ['hd5','Sleight of Hand','Play 5 things hidden',2,'hid',5],['hd50','Unseen Hand','Play 100 things hidden',3,'hid',100],['hd1k','Never There','Play 1,000 things hidden',4,'hid',1000],
 ['cl20','Weatherwise','Speak weather or seasons 20 times',2,'clime',20],['cl100','Stormcaller','Speak weather or seasons 500 times',3,'clime',500],['cl5k','Master of Seasons','Speak weather or seasons 5,000 times',4,'clime',5000],
 ['sp25','Conjuror','Cast 25 spells',2,'spells',25],['sp200','Sorcerer','Cast 500 spells',3,'spells',500],['sp5k','Archmage','Cast 5,000 spells',4,'spells',5000],
 ['gr25','Landscaper','Lay 25 elements',2,'ground',25],['gr200','Terraformer','Lay 500 elements',3,'ground',500],['gr5k','World Builder','Lay 5,000 elements',4,'ground',5000],
 ['rx10','Dabbler','Make 10 reactions',1,'rx',10],['rx100','Experimenter','Make 100 reactions',2,'rx',100],['rx1k','Chemist','Make 1,000 reactions',3,'rx',1000],['rx10k','Mad Chemist','Make 10,000 reactions',4,'rx',10000],['rx500','Prime Mover','Make 50,000 reactions',5,'rx',50000],
 ['mr3','Chain Reaction','Make 3 different reactions in one match',2,'mRx',3],['mr5','Runaway Reaction','Make 5 different reactions in one match',3,'mRx',5],['mr8','Critical Mass','Make 8 different reactions in one match',4,'mRx',8],['mr12','Transmutation of All Things','Make 12 different reactions in one match',5,'mRx',12],
 ['fd5','Curious','Discover 5 reactions',1,'found',5],['fd10','Inquisitive','Discover 10 reactions',2,'found',10],['fd20','Natural Philosopher','Discover 20 reactions',3,'found',20],['fd35','Keeper of Secrets','Discover 35 reactions',4,'found',35],['fdall','The Whole Grimoire','Discover every reaction',5,'found',-2],
 ['ow40','Collector','Own 40 different words',1,'owned',40],['ow70','Hoarder of Words','Own 70 different words',2,'owned',70],['ow100','Librarian','Own 100 different words',3,'owned',100],['ow140','Polyglot','Own 140 different words',4,'owned',140],['owall','The Complete Lexicon','Own every word',5,'owned',-1],
 ['b10','Good Customer','Buy 10 words',1,'bought',10],['b50','Patron','Buy 100 words',3,'bought',100],['b150','Keeps the Shop Open','Buy 500 words',4,'bought',500],
 ['rf5','Refiner','Refine 5 words',2,'refined',5],['rf20','Master Refiner','Refine 25 words',3,'refined',25],['rf60','Purist','Refine 75 words',4,'refined',75],['rfall','Nothing Left Impure','Refine every word',5,'refined',-1],
 ['ex1','Exalted','Exalt a word',2,'exalted',1],['ex10','Gilder','Exalt 10 words',3,'exalted',10],['ex40','Midas','Exalt 50 words',4,'exalted',50],['exall','All That Glitters','Exalt every word',5,'exalted',-1],
 ['g500','Nest Egg','Hold 500 ink at once',2,'gold',500],['g2k','Strongbox','Hold 5,000 ink at once',3,'gold',5000],['g25k','Dragon’s Hoard','Hold 25,000 ink at once',4,'gold',25000],['g100k','King’s Ransom','Hold 100,000 ink at once',5,'gold',100000],
 ['e1k','Earner','Earn 1,000 ink in all',2,'earned',1000],['e10k','Prosperous','Earn 25,000 ink in all',3,'earned',25000],['e100k','Magnate','Earn 100,000 ink in all',4,'earned',100000],['e50k','Croesus','Earn 1,000,000 ink in all',5,'earned',1000000],
 ['q10','Reliable','Complete 10 daily quests',2,'quests',10],['q50','Dutiful','Complete 100 daily quests',3,'quests',100],['q500','Devoted','Complete 500 daily quests',4,'quests',500],['q200','Vocation','Complete 2,000 daily quests',5,'quests',2000],
 ['d3','Three Mornings','Win on 3 different days',1,'days',3],['d14','A Month of Mornings','Win on 30 different days',3,'days',30],['d60','Half a Year','Win on 180 different days',4,'days',180],['d200','A Thousand and One Nights','Win on 1,000 different days',5,'days',1000],
 ['r3','Blackening','Reach Nigredo III',1,'rank',2],['r4','Whitening','Reach Albedo',2,'rank',3],['r7','Yellowing','Reach Citrinitas',3,'rank',6],['r10','Reddening','Reach Rubedo',4,'rank',9],['r12','The Great Work','Reach the final rank',4,'rank',11],
 ['a25','Decorated','Earn 25 achievements',2,'ach',25],['a50','Distinguished','Earn 50 achievements',3,'ach',50],['a90','Illustrious','Earn 100 achievements',4,'ach',100],['all','Magnum Opus','Earn every other achievement',5,'ach',-3]
];
const EMB={matches:'quills',wins:'laurel',best:'chain',win8:'hourglass',win6:'hourglass',win5:'hourglass',win4:'hourglass',win1r:'hourglass',longWin:'hourglass',close:'candle',win1:'candle',hiLife:'shield',flawless:'shield',plainWin:'fist',cleanWin:'crook',said:'scroll',words:'book',adjs:'feather',verbs:'arrow',brought:'egg',clime:'vane',spells:'wand',ground:'wheel',hid:'curtain',kills:'pot',mKills:'tower',maxHit:'hammer',burn:'flame',freeze:'snow',drench:'wave',poison:'vial',rx:'flasks',mRx:'retort',found:'key',owned:'cards',bought:'purse',refined:'crucible',exalted:'crown',gold:'chest',earned:'chest',quests:'note',days:'sun',ach:'star'};
function achPic(a){if(a[0]==='all')return INL['em/stone.jpg'];if(a[4]==='rank')return 'assets/ds/g'+Math.min(3,Math.floor(a[5]/3))+'.webp';return INL['em/'+(EMB[a[4]]||'star')+'.jpg'];}
function aval(k){const s=PF.st||{};switch(k){case'owned':return Object.keys(PF.owned).filter(w=>PF.owned[w]>0).length;case'found':return Object.keys(PF.found||{}).length;case'rank':return rankOf(PF.xp);case'gold':return PF.gold;case'wins':return PF.wins||0;case'matches':return Math.max(s.matches||0,(PF.wins||0)+(PF.losses||0));
  case'words':return Object.keys(s.wd||{}).length;case'refined':return Object.values(PF.up||{}).filter(v=>v>=1).length;case'exalted':return Object.values(PF.up||{}).filter(v=>v>=2).length;case'ach':return Object.keys(PF.ach||{}).length;}return s[k]||0;}
const aneed=a=>a[5]===-1?ALLWORDS.length:a[5]===-2?Object.keys(RX).length:a[5]===-3?ACH.length-1:a[5];
function bump(k,n){PF.st=PF.st||{};PF.st[k]=(PF.st[k]||0)+(n==null?1:n);}
function bmax(k,v){PF.st=PF.st||{};if(v>(PF.st[k]||0))PF.st[k]=v;}
let wrQ=[],wrOn=false,wrArmed=false,wrT=[];
addEventListener('pointerdown',()=>{wrArmed=true;try{aliveInit();}catch(e){}},{capture:true,once:true});
function aliveInit(){if(typeof PF==='undefined'||!PF||!PF.owned||PF.alivev)return;PF.alive=PF.alive||{};for(const w in PF.owned)if(PF.owned[w]>0)PF.alive[w]=1;PF.alivev=1;}
function isAlive(w){return true;}
function firstBreath(ws){return;aliveInit();if(!PF.alive)return;const nw=[...new Set(ws)].filter(w=>W[w]&&PF.owned[w]>0&&!PF.alive[w]);if(!nw.length)return;for(const w of nw)PF.alive[w]=1;save();setTimeout(()=>{sfx('shimmer');callout(nw.length>1?'First breath':'First breath · '+nw[0],'heal');},650);}
function wordReveal(w){if(!wrArmed||!W[w])return;wrQ.push(w);setTimeout(wrPump,80);}
function wrPump(){if(wrOn||!wrQ.length)return;if(document.getElementById('load')||document.getElementById('vs')){setTimeout(wrPump,500);return;}
  wrOn=true;const w=wrQ.shift(),d=W[w],t=tierOf(w),own=PF.owned[w]||0,alive=isAlive(w),kind=d.t===NOUN?(isEvent(w)?'spell':'thing'):d.t===VERB?'verb':d.t===ADJ?'adjective':'word';
  const e=document.createElement('div');e.id='wrev';e.className='t'+t+(alive?' alive':'');e.style.setProperty('--rune','url('+runeOf(w)+')');e.setAttribute('role','dialog');e.setAttribute('aria-label',(own>1?'Another copy of ':'A new word: ')+w);e.tabIndex=-1;
  e.innerHTML='<div class="wr-box"><small class="wr-kick">'+(own>1?'Another copy':'A new word')+'</small>'
    +'<div class="wr-stage"><img class="wr-rays" src="assets/ach/rays.webp" alt=""><i class="wr-fx fx-pl"></i><i class="wr-fx fx-ro"></i><i class="wr-fx fx-ri"></i><i class="wr-fx fx-sg"></i><i class="wr-fx fx-fl"></i><i class="wr-fx fx-sh"></i><i class="wr-fx fx-sp"></i><i class="wr-fx fx-cf"></i><div class="wr-card">'+fullFace(w,{ink:d.syl,lv:PF.up[w]||0,up:PF.up})+'<i class="wr-wet"></i></div><div class="wr-leaf"><span class="cf back"></span><span class="wr-seal"><i></i></span></div><i class="wr-wisp"></i></div>'
    +'<div class="ach-plate wr-plate"><b'+(w.length>12?' class="sm"':'')+'>'+[...w].map((c,i)=>'<span style="--i:'+i+'">'+(c===' '?'&nbsp;':esc(c))+'</span>').join('')+'</b></div>'
    +'<span class="wr-tier">'+['','A plain','A rare','A potent','A great'][t]+' '+kind+'</span>'
    +'<em class="wr-line">'+(own>=4?'Four copies. The Scriptorium can refine it now.':own>1?'You hold '+own+' of these now.':'Scribed in ink, spoken aloud. It is yours.')+'</em>'
    +'<span class="wr-skip">tap to go on</span></div>';
  document.body.appendChild(e);try{e.focus();}catch(x){}
  const hold=[0,520,640,900,1250][t],go=(ms,f)=>wrT.push(setTimeout(f,ms)),fin=()=>{wrT.forEach(clearTimeout);wrT=[];e.classList.add('s1','s2','s3','done');};
  const close=()=>{wrT.forEach(clearTimeout);wrT=[];e.classList.add('out');setTimeout(()=>{e.remove();wrOn=false;wrPump();try{if(view==='story'&&!document.getElementById('wrev')&&!jS.pop)renderStory();}catch(x){}},RM?10:260);};
  e.addEventListener('click',()=>{if(e.classList.contains('done'))close();else fin();});
  e.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '||ev.key==='Escape'){ev.preventDefault();ev.stopPropagation();if(e.classList.contains('done'))close();else fin();}});
  if(RM){fin();sfx('shimmer');return;}
  sfx('page');
  go(hold,()=>{e.classList.add('s1');sfx('tick');});
  go(hold+330,()=>{e.classList.add('s2');sfx('page');});
  go(hold+1250,()=>{e.classList.add('s3');sfx(t>=4?'achBig':t===3?'ach':'shimmer');});
  go(hold+1250+[0,500,600,800,1000][t],()=>e.classList.add('done'));}
let achBusy=false,achQ=[],achShowing=false;
function achCheck(){if(achBusy||!PF||!PF.owned)return;achBusy=true;PF.ach=PF.ach||{};if((PF.achv||0)<2){for(const a of ACH)if(PF.ach[a[0]]&&aval(a[4])<aneed(a))delete PF.ach[a[0]];for(const k of Object.keys(PF.ach))if(!ACH.some(a=>a[0]===k))delete PF.ach[k];PF.achv=2;}let got=false,loop=true;
  while(loop){loop=false;for(const a of ACH){if(PF.ach[a[0]])continue;if(aval(a[4])>=aneed(a)){PF.ach[a[0]]=Date.now();PF.gold+=ACHG[a[3]];bump('earned',ACHG[a[3]]);achQ.push(a);got=loop=true;}}}
  achBusy=false;if(got){save();if(typeof renderNav==='function'&&S)renderNav();achPump();}}
function achPump(){if(achShowing||!achQ.length)return;if(document.getElementById('load')||document.getElementById('vs')||document.getElementById('jpop')||document.getElementById('end')){setTimeout(achPump,700);return;}
  achShowing=true;let a=achQ.shift(),more=0;if(achQ.length>3){more=achQ.length;achQ=[];}
  const e=document.createElement('div');e.className='achpop t'+a[3];e.setAttribute('role','status');
  e.innerHTML='<img class="ach-rays" src="assets/ach/rays.webp" alt=""><div class="ach-top"><img class="ach-wings" src="assets/ach/wings.webp" alt=""><div class="ach-badge"><img class="ach-pic" src="'+achPic(a)+'" alt=""><img class="ach-ring" src="'+INL['ach/s'+a[3]+'.webp']+'" alt=""></div></div><small class="ach-kick">Achievement · '+ACHT[a[3]]+'</small><div class="ach-plate"><b'+(a[1].length>19?' class="sm"':'')+'>'+esc(a[1])+'</b></div><span class="ach-how">'+esc(a[2])+'</span><em class="ach-tag">+'+ACHG[a[3]]+' ink'+(more?' · and '+more+' more':'')+'</em>';
  document.body.appendChild(e);sfx(a[3]>=4?'achBig':'ach');
  setTimeout(()=>e.classList.add('out'),RM?2600:3600);setTimeout(()=>{e.remove();achShowing=false;achPump();},RM?2900:4100);}
const ACATS=[['all','All'],['match','Matches',['matches','wins','best','win8','win6','win5','win4','win1r','win1','flawless','close','hiLife','longWin','plainWin','cleanWin']],['speech','Speech',['said','words','adjs','verbs','brought','clime','spells','ground','hid']],['ruin','Destruction',['kills','mKills','maxHit','burn','freeze','drench','poison']],['rx','Reactions',['rx','mRx','found']],['coll','Collection',['owned','bought','refined','exalted','gold','earned']],['work','The Work',['quests','days','rank','ach']]];
let acS={cat:'all',sel:null,show:'all'};
function renderAch(){if(view!=='ach')return;const host=$('view-ach');PF.ach=PF.ach||{};
  if(!host.querySelector('.achscene'))host.innerHTML='<div class="scene achscene"><div class="scenetop"><h2 class="ac-h">Feats</h2><div class="chips" id="ac-cats"></div><span class="ctr" id="ac-ctr"></span></div><div class="ac-cols"><div class="ac-list" id="ac-list"></div><div class="ac-mid" id="ac-mid"></div><aside class="ac-det" id="ac-det"></aside></div></div>';
  const cat=ACATS.find(c=>c[0]===acS.cat)||ACATS[0];let list=ACH.filter(a=>!cat[2]||cat[2].includes(a[4]));if(acS.show==='done')list=list.filter(a=>PF.ach[a[0]]);else if(acS.show==='todo')list=list.filter(a=>!PF.ach[a[0]]);
  if(!acS.sel||!list.some(a=>a[0]===acS.sel))acS.sel=list.length?list[0][0]:null;
  const done=Object.keys(PF.ach).length,gold=ACH.filter(a=>PF.ach[a[0]]).reduce((s,a)=>s+ACHG[a[3]],0);
  $('ac-cats').innerHTML=ACATS.map(c=>{const l=ACH.filter(a=>!c[2]||c[2].includes(a[4]));return '<button class="chip'+(acS.cat===c[0]?' on':'')+'" data-act="accat" data-v="'+c[0]+'">'+c[1]+' <small>'+l.filter(a=>PF.ach[a[0]]).length+'/'+l.length+'</small></button>';}).join('')
    +'<span class="sep"></span>'+[['all','All'],['todo','To do'],['done','Earned']].map(([k,l])=>'<button class="chip'+(acS.show===k?' on':'')+'" data-act="acshow" data-v="'+k+'">'+l+'</button>').join('');
  $('ac-ctr').innerHTML='<img src="'+INL['ach/s4.webp']+'" alt="" style="width:28px;height:28px"><b>'+done+'/'+ACH.length+'</b><small>earned · '+gold+' ink</small>';
  const old=$('ac-list'),sc=old.scrollTop;
  old.innerHTML=list.map(a=>{const got=PF.ach[a[0]],n=Math.min(aval(a[4]),aneed(a)),need=aneed(a);return '<button class="ac-row t'+a[3]+(got?' got':'')+(acS.sel===a[0]?' on':'')+'" data-act="acsel" data-v="'+a[0]+'"><span class="rp"><img class="p" src="'+achPic(a)+'" alt=""><img class="r" src="'+INL['ach/s'+a[3]+'.webp']+'" alt=""></span><span><b>'+esc(a[1])+'</b><u><i style="width:'+Math.round(100*n/need)+'%"></i></u></span><em>'+(got?'<img src="assets/fr/seal.webp" alt="earned">':n+'/'+need)+'</em></button>';}).join('')||'<p class="ac-none">Nothing here.</p>';
  old.scrollTop=sc;
  const a=ACH.find(x=>x[0]===acS.sel);if(!a){$('ac-mid').innerHTML='';$('ac-det').innerHTML='';fit();return;}
  const got=PF.ach[a[0]],need=aneed(a),n=Math.min(aval(a[4]),need);
  $('ac-mid').innerHTML='<div class="ac-big t'+a[3]+(got?' got':'')+'">'+(got?'<img class="ach-rays" src="assets/ach/rays.webp" alt="">':'')+'<img class="ac-wings" src="assets/ach/wings.webp" alt=""><div class="ac-badge"><img class="ach-pic" src="'+achPic(a)+'" alt=""><img class="ach-ring" src="'+INL['ach/s'+a[3]+'.webp']+'" alt=""></div></div><div class="ac-plate"><b'+(a[1].length>19?' class="sm"':'')+'>'+esc(a[1])+'</b></div><p class="ac-tier t'+a[3]+'">'+ACHT[a[3]]+' tier</p>';
  $('ac-det').innerHTML='<div class="ac-status'+(got?' got':'')+'">'+(got?'Earned'+' · '+new Date(got).toLocaleDateString():'In progress')+'</div><h3>'+esc(a[1])+'</h3>'
    +'<h4>To earn it</h4><p class="ac-how">'+esc(a[2])+'.</p><div class="ac-prog"><u><i style="width:'+Math.round(100*n/need)+'%"></i></u><b>'+n+' / '+need+'</b></div>'
    +'<h4>Reward</h4><div class="ac-rew"><em class="ach-tag">+'+ACHG[a[3]]+' ink</em><span>'+(got?'Paid into your purse.':'Paid the moment you earn it.')+'</span></div>'
    +'<h4>Tier</h4><div class="ac-tiers">'+[1,2,3,4,5].map(t=>'<span class="'+(t===a[3]?'on':'')+'"><img src="'+INL['ach/s'+t+'.webp']+'" alt=""><small>'+ACHT[t]+'</small></span>').join('')+'</div>';
  fit();}
/* ---- the journey: region one ---- */
const STORY={region:'The Black Country',stage:'Nigredo · the blackening',nodes:[
 {id:'roux',kind:'duel',main:1,x:11.5,y:64,place:'Emberwick',spot:'The scriptorium',who:{n:'Anselm Roux',p:10,role:'Your master'},need:[],word:'fuse',life:-22,
  rule:'A lesson, not a fight: he begins with only 19 life to your 30.',
  deck:['toad','crow','leech','lead','wormwood','owl','fire','water','strike','strike','bite','mend','burning','sodden','ancient','guard'],
  lines:{meet:'Seven years you have ground my ink and copied my twelve words. Before you take the road, show me you can make a sentence stand.',again:'Again. A sentence is a thing with a spine. Find it.',won:'Good. Now go and find the Alchemist. They say the Alchemist knows the last word, the one that finishes the world. Ask everyone you beat. Take fuse with you.',win:'Good. That is the first one I could not have written for you.',lose:'No. You are reciting. Say only what you mean to happen.'}},
 {id:'reeve',kind:'duel',main:1,x:30.8,y:34.2,place:'Colliers’ Wood',spot:'The charcoal clamps',who:{n:'Lucan Reeve',p:8,role:'Charcoal burner'},need:['roux'],word:'oak',life:-16,clime:'drought',
  rule:'Drought holds over the wood: flames gain 1 every turn, plants and liquids lose 1.',
  deck:['oak','fire','fire','flint','pitch','saltpetre','naphtha','salamander','crow','lead','iron','burn','burn','strike','strike','crush','blow','burning','burning','ancient','guard','air','earth'],
  lines:{meet:'Oak is dear this year. Shade dearer. I sold the grove to pay for the Measurers’ drought relief, and the relief came. Mind your sleeves.',again:'Back for more smoke? Bring water this time, or bring nothing that burns.',won:'Oak is yours. Leave something standing.',win:'Hah. Banked my own fire against me. Fair.',lose:'Everything you brought was kindling. Think on what does not burn.'}},
 {id:'hedge',kind:'find',board:1,x:21.5,y:49,place:'The Burnt Hedge',spot:'Where the stubble fires got away',need:['roux'],words:['earth','air'],art:'fire',bg:'reeve',
  text:'A long bramble hedge, black at one end where last year’s stubble fire ran into it. There is a wasps’ nest deep in the thorns that the village wants gone, and nobody is willing to reach in.',
  lesson:'The four elements are laid on your ground, not sent to fight. They cannot be attacked, and each works by itself every turn: fire spreads to something that will burn opposite, and whatever burns chokes its keeper.',
  puz:{mark:'A wasps’ nest',life:2,ink:1,turns:4,things:[['bramble',1]],hand:['fire'],goal:'Smoke out the wasps’ nest within four turns. It has 2 life and sits in a bramble. You have one word.',hint:'Lay the fire on your ground, then let turns pass. You do not have to do anything else: watch what the fire does by itself.'}},
 {id:'vane',kind:'find',board:1,x:7,y:40,place:'The Weathercock',spot:'On the hill above Emberwick',need:['roux'],words:['rain','spring'],art:'rain',bg:'roux',
  text:'An iron weathercock on a post, older than the scriptorium, and a scarecrow some apprentice before you left leaning against it. The sky is undecided. Your master used to say the weather is the one word everyone has to obey.',
  lesson:'Weather is spoken alone, as a whole sentence. It lies over the whole board for both sides and works every turn, on whole kinds of thing: under rain, every plant gains 1 a turn.',
  puz:{mark:'A scarecrow',life:5,ink:4,turns:2,hand:['wormwood','rain','strike'],goal:'Knock down the scarecrow within two turns. It has 5 life, and wormwood strikes for only 2.',hint:'Say the rain first, alone. Then bring the wormwood and strike. Let the turn pass, and strike again with the verb it remembers.'}},
 {id:'cross',kind:'find',board:1,x:6.5,y:86,place:'The Plague Cross',spot:'Where the village left its ink in vinegar',need:['roux'],words:['plague'],art:'plague',bg:'thorne',
  text:'A worn stone cross at the parish edge, with a hollow in its foot where plague-year villagers left payment for bread. Something has been living under it since: the miller calls it the rat-king, and will not come past here after dark.',
  lesson:'A spell is not a thing that fights. It settles on one side, cannot be attacked, works by itself for four of its keeper’s turns, and then fades. You may keep three at once.',
  puz:{mark:'The rat-king',life:2,ink:2,turns:4,hand:['plague'],goal:'Be rid of the rat-king within four turns. It has 2 life. You have one word, and it is not a creature.',hint:'Say the spell and it settles on the other side. Then let turns pass and read the Chronicle.'}},
 {id:'bellows',kind:'find',board:1,x:39,y:21,place:'The Bellows Rock',spot:'A gap in the ridge where the wind never stops',need:['reeve'],words:['blow','owl'],art:'blow',bg:'reeve',
  text:'Above the charcoal clamps the ridge splits, and the wind comes through the gap hard enough to lean on. The colliers hang a paper lantern on the far side each night to see how the wind sits. Tonight it is just out of reach.',
  lesson:'Anything with wings or wind can blow. What it blows is carried across everything opposite: blow a fire and the other side burns; blow something wet, poisonous or bright and that crosses instead.',
  puz:{mark:'A paper lantern',life:2,ink:2,things:[['fire',0]],hand:['crow','blow'],goal:'Burn the paper lantern this turn. It has 2 life, and your fire lies on your own ground.',hint:'A fire on the ground cannot attack. Bring the crow and have it blow your fire: crow, blow, then tap the fire.'}},
 {id:'oldyew',kind:'find',x:17,y:83,place:'The Old Yew',spot:'A tree older than the village',need:['roux'],words:['yew','ancient'],art:'yew',bg:'thorne',
  text:'A yew stands alone on the heath in a ring of its own dead needles. Nobody planted it and nobody remembers it young. Someone has stood a straw mark against the wall beyond it, for practice.',
  lesson:'One sentence can bring a thing forth, describe it, and set it to work, all at once. An adjective changes what the thing is.',
  puz:{mark:'A straw mark',life:8,ink:3,hand:['yew','ancient','strike'],goal:'Break the straw mark this turn. It has 8 life, and a yew strikes for only 5.',hint:'Put all three words into a single sentence: adjective, thing, verb, then the mark.'}},
 {id:'shrine',kind:'find',x:55,y:45,place:'The Lantern Shrine',spot:'A wayside lamp nobody admits to lighting',need:['ashdown'],words:['moth','quick'],art:'moth',bg:'thorne',
  text:'A stone niche by the Crowstone path holds a lantern that is always lit. One pale moth has been circling it, the carvings say, since before the carvings. A paper charm hangs from the niche: two blows will tear it, and a moth lands only one.',
  lesson:'A thing remembers a verb it has used and can use it again for nothing. Quick lets a thing act twice in a turn.',
  puz:{mark:'A paper charm',life:2,ink:3,hand:['moth','quick','strike'],goal:'Tear the paper charm this turn. It has 2 life, and a moth strikes for 1.',hint:'Strike once so the moth learns the verb. Make the moth quick. Then tap the moth and use the verb it now knows, for free.'}},
 {id:'nest',kind:'find',x:47,y:76,place:'The Nest in the Reeds',spot:'Something large laid this',need:['ashdown'],words:['egg'],art:'egg',bg:'ashdown',rx:'egg+fire',
  text:'Deep in the reeds, on a raft of woven stems, lies a single egg the size of your two fists. It is warm. The fen-folk have hung an iron bell beside it to scare off whatever laid it. The bell has 12 life, and it is very loud.',
  lesson:'Fuse joins two things to make a third. A thing made by a reaction you have never made before also makes every blow you strike that duel 2 harder.',
  puz:{mark:'The iron bell',life:12,ink:4,hand:['egg','fire','fuse','bite'],goal:'Silence the iron bell this turn. It has 12 life.',hint:'Fuse the egg and the fire, and see what hatches. A beast’s bite hits for twice its vigour.'}},
 {id:'riddle',kind:'riddle',x:38.7,y:80,place:'The Riddle Stone',spot:'A standing stone on the heath',need:['reeve'],word:'ink',
  text:'I dined on a song and was none the wiser.\nI swallowed a sermon and learned no prayer.\nA thief in the dark, I grew fat upon wisdom\nand flew from the page with nothing to say.\nSay what I am called.',
  ans:['moth','bookmoth','book-moth','book moth','bookworm','book worm','a moth'],hint:'It eats the page, not the meaning.'},
 {id:'ashdown',kind:'duel',main:1,x:42.3,y:58.5,place:'Blackwater Fen',spot:'The eel-house',who:{n:'Mara Ashdown',p:2,role:'Fen-wife'},need:['reeve'],word:'tame',life:-10,clime:'flood',
  rule:'The fen is in flood: liquids gain 1 every turn and things of fire lose 2.',
  deck:['tame','toad','toad','leech','leech','adder','hemlock','nightshade','wormwood','water','swamp','brine','poison','poison','drench','bite','sleep','sleep','venomous','venomous','sodden','mend','rain'],
  lines:{meet:'Our grandfathers found it. The name came in somebody else’s sack. The Measurers cannot register a herb with no name of its own, so I may not use it. Sit.',again:'Still dry behind the ears. Good. Sit down again.',won:'Tame is yours. You may know a thing before you know what to call it.',win:'Well. You let it work instead of hurrying it. That is the whole art.',lose:'You kept striking at what was already dying. Patience is a verb here.'}},
 {id:'quill',kind:'duel',x:59.2,y:86.9,place:'The Drowned Bridge',spot:'A fellow journeyman, going the other way',who:{n:'Tobias Quill',p:6,role:'Journeyman'},need:['ashdown'],pick:['twin','loan','boar','peacock','quick','ancient','yew'],life:0,
  rule:'A wager between equals: he begins with a crow already on his side.',things:['crow'],
  deck:['toad','owl','crow','leech','fire','water','earth','air','fuse','fuse','blow','lead','enchant','strike','strike','bite','crush','sleep','mend','guard','burning','sodden','venomous','ancient','burn','poison'],
  lines:{meet:'Tobias Quill, journeyman. I have three more words than you, which ought to save us time.',again:'Double or nothing? I have been practising.',won:'I still have the sheet. I have not decided what it is worth.',win:'Ha! Beaten by the ink-grinder. I am telling no one.',lose:'A year’s head start, that is all it is. You will catch me.'}},
 {id:'thorne',kind:'duel',main:1,x:63.2,y:29.3,place:'Crowstone',spot:'The churchyard',who:{n:'Edda Thorne',p:3,role:'Sexton'},need:['ashdown'],word:'sacred',life:-6,clime:'night',
  rule:'It is always night at Crowstone: what is brought forth here comes hidden, and night creatures gain 1 every turn.',
  deck:['sacred','crow','crow','owl','owl','moth','bat','shadow','yew','hemlock','lichen','wither','wither','haunt','bite','sleep','forget','occult','ancient','frozen','guard','strike','hunger'],
  lines:{meet:'A name on stone is not a mouth. They opened this grave for its inscription. I sold a formula myself last winter, to mend the roof. Sit down among them.',again:'Again.',won:'Sacred is yours. Ask whose time, and who signed.',win:'Hm.',lose:'You could not see it. So you did not name it.'}},
 {id:'hale',kind:'duel',main:1,gate:1,x:79.8,y:62.4,place:'The Black Gate',spot:'The toll-house at the border',who:{n:'Corvin Hale',p:7,role:'Keeper of the Black Gate'},need:['thorne'],word:'stag',life:5,things:['crow','shadow'],
  rule:'The Keeper’s trial: he begins with 33 life to your 30, and a crow and a shadow already stand on his side.',
  deck:['stag','plague','fire','pitch','crow','crow','owl','toad','leech','adder','shadow','hemlock','burn','burn','poison','poison','wither','haunt','strike','strike','bite','crush','burning','venomous','occult','ancient','guard','sleep','night','fuse','water'],
  lines:{meet:'The stag knows a boundary without a deed. My charter puts the fence before the people. I did not write it. Sit.',again:'The gate has stood four hundred years. It can wait for you to be ready.',won:'You have the road. I cannot vouch for its account of you.',win:'There. Burnt, drowned and buried, and still standing. That is the blackening done.',lose:'You brought three countries’ words and used one. Come back when they speak to each other.'}}
]};
const famName=cap=>PF.fam&&PF.fam.name?PF.fam.name:(cap?'Your magpie':'your magpie');
const MAGL=[['Nothing in your purse? Then look, and remember.','Empty pockets. I will hold these for another day.'],['One ink buys one small thing. Choose.','A thin purse. Spend it well.'],['Shiny, shiny. I found these on the wing.','Fresh from other people’s windowsills. Do not ask.','Look what the road left lying about.'],['Such a heavy purse! Let me lighten it.','Rich today. Take two, I shall not tell.']];
function famLine(c){const l=MAGL[c<=0?0:c===1?1:c<5?2:3];return l[(S?S.turn:0)%l.length];}
const sNode=id=>STORY.nodes.find(n=>n.id===id);
/* ---- immersion: your name, voice, journal, letters, the road ---- */
const TITLES={humble:'the Patient',proud:'the Bold',sly:'the Canny'},STANCES=['humble','proud','sly'];
function meSt(){if(!PF.me||typeof PF.me!=='object')PF.me={};PF.me.st=PF.me.st||{};return PF.me;}
const meStage=()=>PF.story&&PF.story.done&&PF.story.done.hale?1:0,meImg=big=>meStage()?'assets/me/'+meStage()+(big?'b':'')+'.jpg':'assets/player.jpg';
const meName=()=>PF.me&&PF.me.name?PF.me.name:'journeyman';
function meTitle(){const s=meSt().st,k=STANCES.slice().sort((a,b)=>(s[b]||0)-(s[a]||0))[0];return(s[k]||0)>=2?TITLES[k]:'';}
const meFull=()=>meName()+(meTitle()?' '+meTitle():'');
const sFill=(x,n)=>String(x).replace(/\{fam\}/g,famName(true)).replace(/\{name\}/g,meName()).replace(/\{He\}/g,n&&n.who&&n.who.g==='f'?'She':'He').replace(/\{he\}/g,n&&n.who&&n.who.g==='f'?'she':'he').replace(/\{his\}/g,n&&n.who&&n.who.g==='f'?'her':'his');
const WHOG={roux:'m',reeve:'m',ashdown:'f',quill:'m',thorne:'f',hale:'m'};
const TALK={
 roux:{humble:['I am ready to be corrected, master.','Then you have learned the first thing. Sit.'],proud:['I could write your twelve words in my sleep.','Then wake up and write a thirteenth.'],sly:['What will you give me if I win?','Hah. A word, and the door. Both are worth having.']},
 reeve:{humble:['Teach me what does not burn.','Honest, at least. Stand upwind.'],proud:['I have carried fire for seven years.','A candle is not a clamp. Come and see.'],sly:['What do they pay you for a sack of that?','Less than it costs me. Sit. You are good for a laugh.']},
 ashdown:{humble:['I have time. Show me the slow words.','Good. Most arrive in a hurry and leave in one.'],proud:['I beat the charcoal burner. Water does not frighten me.','It is not the water you should mind.'],sly:['They say you know which eels are worth selling.','And which travellers. Sit down.']},
 quill:{humble:['You were always the better hand, Tobias.','Flattery! The road has taught you something.'],proud:['A year’s start will not save you.','There is the ink-grinder I remember.'],sly:['Loser buys supper?','Loser buys supper. I am already hungry.']},
 thorne:{humble:['(Say nothing, and bow.)','(She nods, once.)'],proud:['I am not afraid of the dark.','No. Not yet.'],sly:['Who is in the newest grave?','Someone who asked.']},
 hale:{humble:['I ask leave to pass, Keeper.','Asked properly. It will still cost you.'],proud:['Open the gate. I have earned it three times over.','Then earn it a fourth.'],sly:['What did my master’s letter say of me?','That you would ask that.']}};
const ORC=25,ORCNO=['doubt','measure','unnamed','philosopher\u2019s stone'];
const TOLLOK={w_stair:'Then it may go first. Up you go.',w_flats:'That will travel better than your explanation. Cross.',w_sunk:'I cannot find it. Ten. Go on, then.',y_hay:'You may cross, and mind you do not trample your answer.',y_assay:'It has survived a question. Go up.',y_sleep:'Still at it. Now you know what it does without you. Go on.'};
const STANCETAG={humble:'+4 life',proud:'full breath \u00b7 +10 ink if you win \u00b7 {he} gets +4 life',sly:'+2 ink'};
const STANCEFX={humble:'Steady: you begin with 4 more life.',proud:'A stake: you open with full breath, {he} begins with 4 more life, and a win pays 10 more ink.',sly:'Canny: you begin with 2 ink for {fam}.'};
const HEARD={reeve:'Roux’s apprentice, then. He writes that you can join two things and get a third.',ashdown:'Lucan sent word that you stood his fire. He was sour about it.',quill:'I heard a journeyman had beaten the fen-wife. I hoped it was you, {name}.',thorne:'Mara sent eels. And your name.',hale:'Fire, fen and grave, they tell me. {name}, is it.'};
const RUMOUR={roux:'Lucan Reeve fights under a drought. Whatever you bring that is wet or green will dwindle. Bring things that do not burn.',reeve:'The fen is in flood. Mara’s liquids swell every turn and fire drowns there. She poisons, and waits.',ashdown:'At Crowstone it is always night and everything arrives hidden. You cannot name what you cannot see, so reach for categories.',quill:'The Keeper wants fire, fen and grave in one hand. Bring something that burns, something that waits and something set apart.',thorne:'Corvin Hale begins with a crow and a shadow already standing. Deal with them before they deal with you.',hale:'Beyond the gate the country turns white. No one on this side has words for it.'};
const EVENTS={
 reeve:{t:'On the road to Colliers’ Wood',x:'A carter has put a wheel in the ditch and is swearing at it in three dialects. His load is charcoal, bound for Emberwick.',o:[
  ['Put your shoulder to the wheel','It takes an hour and ruins your sleeves. He pays you in ink and in gossip about the burner.',{gold:12,seen:1},'Helped a carter out of a ditch on the Colliers’ road. He paid me, and told me one thing Reeve keeps in his hand.'],
  ['Walk on, and let {fam} look over his cart','She comes back very pleased with herself.',{coins:2},'Walked past a carter in a ditch. {fam} did not. She had two ink for me at the next table.']]},
 ashdown:{t:'The edge of Blackwater Fen',x:'The causeway is under a foot of black water. A ferryman with a flat boat wants ten ink to pole you across to the eel-house.',o:[
  ['Pay the ferryman','You arrive dry and rested.',{gold:-10,life:3},'Paid a ferryman ten ink to cross the fen dry. Worth it.'],
  ['Wade','You arrive soaked to the chest, with something heavy caught in your boot.',{gold:15,life:-2},'Waded the causeway to save ten ink and found fifteen in the mud. Arrived wet and cold.']]},
 quill:{t:'The Drowned Bridge',x:'Someone has left a supper laid out on the parapet: bread, an onion, a stoppered jug. There is no one in sight.',o:[
  ['Leave it be','A voice from under the arch says: “Honest. Good. I hate eating alone.”',{rlife:-3},'Left a stranger’s supper alone on the bridge. It was Tobias Quill’s. He was pleased, and careless after.'],
  ['Eat','It is very good. The voice from under the arch is less pleased.',{life:3,rlife:3},'Ate a supper on the bridge that turned out to be Tobias Quill’s. He fought harder for it.']]},
 thorne:{t:'The hill below Crowstone',x:'A crow drops something bright on the path in front of you: a thin silver ring, grave-cold. {fam} is on it before it stops rolling.',o:[
  ['Let her keep it','She will be insufferable, and generous.',{coins:2},'A crow dropped a ring at Crowstone and {fam} kept it. She brought me two ink at the next table to make up for it.'],
  ['Carry it up and lay it on the newest grave','The sexton watches you do it and says nothing, which from her is a great deal.',{rlife:-3},'Laid a dropped ring on a grave at Crowstone. The sexton saw. She went easier on me than she meant to.']]},
 hale:{t:'Within sight of the Black Gate',x:'A man in half a uniform steps out of the gorse. He has left the Keeper’s service in a hurry, and will sell what he knows of Corvin Hale’s habits for twenty ink.',o:[
  ['Pay him','He talks for some time.',{gold:-20,seen:2},'Bought a deserter’s account of the Keeper for twenty ink. Two of his words are no secret now.'],
  ['Send him on his way','You will meet the Keeper as he is.',{xp:1},'A deserter offered to sell me the Keeper’s habits. I would rather find them out for myself.']]}};
const INS={vane:['The notebook says rain; the soil says when.','The garden has answered more precisely than the book.'],hedge:['One side is charcoal; the other still has washing out.','The fire eats where it is fed.'],cross:['The plague has gone; its prohibition has not.','A protection can remain after its reason.'],oldyew:['Three names have grown into the same trunk.','The newest cut has not made the old ones lies.'],bellows:['The fire wants the wind that the nest cannot bear.','The owl has kept its house.'],shrine:['The moths wear what they mean on their wings.','Quick has gone where you did not put it.'],nest:['The shell is wet, warm, and much too large.','Every colour holds without becoming the only colour.'],riddle:['What can keep a voice without keeping its owner?','Ink, then; mind what you put in it.']},
 TAGS={hedge:'A tin tag is nailed to the firebreak post, stamped with a number. The cottages behind it are still standing.',cross:'Someone has nailed a small tin tag to the foot of the cross, stamped with a number.',oldyew:'Below the three carved names, a tin tag has been nailed into the bark. It is the newest thing on the tree.'};
const LETTERS={
 oldyew:{x:st=>'{name},\nI trust the horse has discovered which of you is in charge.\nRemember that knowing a word includes knowing when it is a bad idea. You have met something ancient; consider what it survived by changing.\nIf you hear of the Alchemist, ask what became of the last pupil. People are less guarded about the unsuccessful.\nA. R.',o:[
  ['“What should I have noticed about the yew?”','He sends one line about the charcoal burner’s deck, and nothing about the yew.',{seenAt:'reeve',seen:1},'Asked my master what I should have noticed about the yew. He told me something about Lucan Reeve instead.'],
  ['“The horse knows. So do I.”','He sends fifteen ink “for oats, since the horse is in charge”.',{gold:15},'Told my master the horse and I had settled who was in charge. He sent money for oats.'],
  ['“Who was the last pupil?”','He does not answer the question. Two days later: “Good. Keep asking it of other people.”',{xp:2},'Asked my master who the last pupil was. He did not say, and told me to keep asking.']]},
 reeve:{x:st=>'{name},\nLucan writes that you stood his fire'+((st.lost.reeve||0)?' at the '+nth((st.lost.reeve||0)+1)+' asking':' at the first asking')+'. He is not a man who writes, so I take it as praise.\nAn oak is a good first word to win: slow, and hard to kill. Do not hide behind it.\nAsk on the road for the Alchemist. And if men with measuring rods ask about you, you know twelve words and no more.\nThe fen is next. Go slowly there.\nA. R.',o:[
  ['“It was easier than you warned.”','He sends fifteen ink “for new sleeves”.',{gold:15},'Wrote to my master that the wood was easy. He sent money for sleeves, which is his way of calling me a liar.'],
  ['“It cost me more than I expected.”','He sends back a single line about what waits in the fen.',{seenAt:'ashdown',seen:1},'Wrote to my master what the wood cost me. He answered with one line about the fen, and it was worth more than money.']]},
 ashdown:{x:st=>{const t=meTitle();return '{name},\nSo Mara has taught you to tame. She taught me the same thirty years ago, and I have never been sure which of us she meant it for.\nYou have now a word that stands and a word that gentles. Notice which one you reach for first.\n'+(t===TITLES.proud?'I hear you have been announcing yourself at every door. Good. Someone should.\n':t===TITLES.humble?'I hear you have been asking leave at every door. Stop when it stops working.\n':t===TITLES.sly?'I hear you have been asking what things cost. You did not get that from me.\n':'')+'Crowstone will give you nothing to look at.\nA. R.';},o:[
  ['“I reach for the strong thing.”','He sends fifteen ink and one word: “Naturally.”',{gold:15},'Told my master I still reach for the strong thing first. He sent fifteen ink and the word “Naturally.”'],
  ['“I am learning to wait.”','He sends nothing. Two days later, a single line: “Good.”',{xp:2},'Told my master I am learning to wait. He made me wait two days for his answer, which was “Good.”']]},
 thorne:{x:st=>'{name},\nEdda Thorne does not write, but her crows came, so I know.\nSacred is a word I have never once managed to say with a straight face. See that you do better.\nYou will stand before Corvin Hale next. He was my apprentice before you. I did not tell you that.\nBeat him kindly.\nA. R.',o:[
  ['“Why did you not tell me?”','He answers with two of Hale’s words, and no explanation.',{seenAt:'hale',seen:2},'Asked my master why he never told me about Hale. He sent two of the Keeper’s words and no answer.'],
  ['“I will beat him as he deserves.”','He sends twenty ink and: “That is what I am afraid of.”',{gold:20},'Told my master I would beat Hale as he deserves. He sent twenty ink and said that was what he was afraid of.']]}};
const nth=n=>['','first','second','third','fourth','fifth','sixth','seventh'][n]||n+'th';
function sGlimpse(id,k){const n=sNode(id),st=sSt();if(!n||!n.deck)return[];const got=[];const pool=[...new Set(n.deck)].filter(w=>W[w]&&!PF.owned[w]&&!(st.seen[id]||[]).includes(w));for(let i=0;i<k&&pool.length;i++){const w=pool.splice(Math.floor(Math.random()*pool.length),1)[0];(st.seen[id]=st.seen[id]||[]).push(w);got.push(w);}return got;}
function sBoon(id,fx){const st=sSt();st.boon=st.boon||{};const b=st.boon[id]=st.boon[id]||{};for(const k of['life','coins','rlife'])if(fx[k])b[k]=(b[k]||0)+fx[k];}
/* ---- surprises: now and then the road adds something nobody offered ---- */
const TWISTS=[
 {x:'Half a mile on, {fam} drops something bright into your hand and will not say where she got it.',fx:{gold:8},n:'{fam} brought me eight ink on the road and would not say whose it had been.'},
 {x:'Somebody has chalked a single line on a milestone. You copy it down before the rain takes it.',fx:{xp:1},n:'Copied a line off a milestone. I do not know who wrote it.'},
 {x:'A stranger going the other way looks at you twice, then tells you one thing about the person you are riding to meet.',fx:{seen:1},n:'A stranger on the road told me one word my next opponent keeps.'},
 {x:'That night your purse is lighter than it was. There is a neat slit in the lining.',fx:{gold:-6},n:'Somebody slit my purse on the road. Six ink gone.',need:6},
 {x:'You sleep badly under a hedge and arrive stiff.',fx:{life:-1},n:'Slept under a hedge. Arrived stiff.'},
 {x:'A woman at a gate hands you bread still warm, and waves off your thanks.',fx:{life:2},n:'A woman gave me warm bread at a gate and wanted nothing for it.'}];
const PTWISTS=[
 {x:'Before you sit, {he} pushes a little ink across the table. “For the road. Do not thank me.”',fx:{gold:6}},
 {x:'As {he} squares {his} hand, one card shows its face for a breath. You both pretend it did not.',fx:{seen:1}},
 {x:'Somebody has been at this table before you. There is a line scratched into the wood, and you read it twice.',fx:{xp:1}},
 {x:'{fam} has been under the table. She comes up with a coin of ink and a guilty look.',fx:{coins:1}}],
 LTWISTS=[
 {x:'Folded into the letter is a twist of paper with ink in it, and no word about why.',fx:{gold:10}},
 {x:'On the back, in another hand: one line you were never meant to see. You keep it.',fx:{xp:1}},
 {x:'The seal has been lifted and pressed down again. Somebody else has read this first.',fx:{}}];
function parleyTwist(id){const st=sSt();st.ptw=st.ptw||{};if(st.ptw[id]||st.done[id])return null;st.ptw[id]=1;if(Math.random()>.35){save();return null;}const i=Math.floor(Math.random()*PTWISTS.length);sApply(id,PTWISTS[i].fx);save();return i;}
function twistRoll(id){if(Math.random()>.4)return null;const ok=TWISTS.map((t,i)=>i).filter(i=>!(TWISTS[i].need>PF.gold));const i=ok[Math.floor(Math.random()*ok.length)];sApply(id,TWISTS[i].fx,TWISTS[i].n);return i;}
function sApply(id,fx,note){const st=sSt();if(fx.gold)PF.gold=Math.max(0,PF.gold+fx.gold);if(fx.xp)PF.xp+=fx.xp;if(fx.seen)sGlimpse(fx.seenAt||id,fx.seen);sBoon(id,fx);if(note)st.log.push({n:id,r:'note',d:today(),x:sFill(note)});}
function fxText(fx){const o=[];if(fx.gold>0)o.push('+'+fx.gold+' ink');if(fx.gold<0)o.push(fx.gold+' ink');if(fx.xp)o.push('+'+fx.xp+' step'+(fx.xp>1?'s':'')+' forward');if(fx.seen)o.push('learn '+fx.seen+' of their words');if(fx.life>0)o.push('+'+fx.life+' life in your next duel here');if(fx.life<0)o.push(fx.life+' life in your next duel here');if(fx.coins)o.push('+'+fx.coins+' ink in your next duel here');if(fx.rlife<0)o.push('they begin '+(-fx.rlife)+' life down');if(fx.rlife>0)o.push('they begin with '+fx.rlife+' more life');return o.join(' · ');}
function famSay(){const st=sSt(),l=st.log.filter(e=>e.r==='win'||e.r==='loss').slice(-1)[0];if(!l)return 'So this is the road. It is longer than the rafters.';
  if(l.r==='loss')return 'You lost. I saw. I will say nothing, at length.';if(l.rd&&l.rd<=4)return 'Quick work, that last one. I had barely settled.';if(l.rd&&l.rd>=10)return 'I thought we would grow old at that last table.';if(l.life!=null&&l.life<=10)return 'That last one was closer than you will admit.';return 'Shiny things ahead. I can smell them.';}
function questLine(st){const d=k=>st.done[k];
  if(st.end)return 'The last word is unsaid. Say the next one.';
  if(d('d_gate'))return 'Voss is answered. Go to the Unfinished House. They will ask for your best word.';
  if(st.recall===1)return 'Roux has called you home. Voss holds Emberwick. Fight your way back: Saltmere, the Gate, the Fen, the Wood.';
  if(d('y_gate'))return 'You refused Voss\u2019s chair. Now show a world can be safe without one owner.';
  if(d('y_fen'))return 'The Alchemist is a seat: owner of every word. It is being kept for you.';
  if(d('w_gate'))return 'Find the Alchemist. This is the country of Voss, who numbered every word.';
  if(d('w_fair'))return 'The Measurers hold a paper with your name on it. Roux signed it.';
  if(d('hale'))return 'Find the Alchemist. Beware the Measurers, who put a number on every word.';
  if(d('roux'))return 'Find the Alchemist, who knows the last word. Win words from everyone you beat.';
  return 'Show your master you can make a sentence stand.';}
function jBeats(text){const o=[];String(text).split(/(\u201c[^\u201d]*\u201d)/).forEach(s=>{s=s.trim();if(!s)return;if(s[0]==='\u201c'){let q=s.slice(1,-1).trim();if(/,$/.test(q))q=q.slice(0,-1)+'.';o.push({t:'them',x:q});}else if(s.replace(/[^a-z]/gi,'').length>18)o.push({t:'n',x:s});});return o;}
const SHOTS={roux:[1,2,3,4],reeve:[1,2],ashdown:[1,2],quill:[1,2],thorne:[1,2],hale:[1,2],w_salt:[1,2],w_alembic:[1,2],w_glass:[1,2],w_mill:[1,2],w_fair:[1,2],w_gate:[1,2],y_mill:[1,2],y_orchard:[1,2],y_hives:[1,2],y_dial:[1,2],y_barn:[1,2],y_gate:[1,2],r_salt:[1,2],r_hale:[1,2],r_ashdown:[1,2],r_reeve:[1,2],r_roux:[1,2],d_weir:[1,2],d_breach:[1,2],d_kiln:[1,2],d_copper:[1,2],d_bench:[1,2],d_gate:[1,2]},OPEN={roux:'Emberwick, the night before you take the road. One lamp is still lit in the teaching house.',reeve:['Colliers’ Wood, after dark. The clamps are burning low, and the last shade oaks are coming down.','Every stump has a small tin tag nailed to it, stamped with a number.'],ashdown:['Blackwater Fen. One lantern on the plank walk, and a woman hauling an eel trap out of black water.','She sets the trap down on top of a rack of drying herbs, as if to hide it.'],quill:['The Drowned Bridge at dusk. A young man sits on the parapet with his legs over the flood.','He is copying something off a printed sheet. He stops when he sees you, and reads the top line again.'],thorne:['Crowstone. Someone is digging in the churchyard by the light of a lantern set on a stone.','She is not digging a grave. She is filling one in.'],hale:['The Black Gate. The bar is down across the moor road, and the keeper has already seen you.','On his table: the gate ledger, open, and a tin tag he has not yet nailed up.'],w_salt:'Saltmere. The pans are steaming under a hard sky, and one woman is still raking salt.',w_alembic:'The Alembic House. One copper still is lit, and a man is bent over the drip of it.',w_glass:'The Glasshouse at the head of the Ice Stair. Frost on every pane, and one furnace burning.',w_mill:'The Moon Mill. The great wheel is turning with no one at it, and a woman is feeding the stone.',w_fair:'The Frost Fair, out on the ice. Lanterns down a row of stalls, and a smell of chestnuts.',w_gate:'The White Gate. Snow on the battlements, and the keeper standing alone before the doors.',y_mill:'The Tithe Mill at sundown. The wheel is turning, and the miller is weighing the last sack.',y_orchard:'The Walled Orchard. The iron gate stands open, and a woman is up a ladder among the pears.',y_hives:'The Skep Yard. Straw hives along the hedge, and a man in the shed drawing off mead.',y_dial:'The Gnomon. One tall stone on the hill, its shadow lying long across the grass.',y_barn:'The Tithe Barn. Sacks to the rafters, and someone asleep in the last of the hay.',y_gate:'The Gold Gate. Two obelisks, a chair set in the middle of the road, and a man waiting beside it.',r_salt:'Saltmere again. The pans are cold, and there is a seal on the boiling-house door.',r_hale:'The Black Gate. New palings run out from it across the common, and the doors are shut.',r_ashdown:'Blackwater Fen. The channel is stopped with bundled reed, and a loaded boat sits behind it.',r_reeve:'Colliers\u2019 Wood. The whole wood is stacked and burning in rows, and one man stands in the road.',r_roux:'Emberwick. The teaching house is on fire, and a man in black stands by the well with a paper in his hand.',d_weir:'The Red Weir. The dyke is leaking at the palings, and a woman is packing straw into it by lantern.',d_breach:'The Breach House. A hole in the wall the size of a cart, and a woman fitting bricks back one at a time.',d_kiln:'The Red Kiln. The fire door is open, and a man is feeding it with his back to the racks.',d_copper:'The Common Copper. One great pot over a fire in the open, a long table, and everyone at it.',d_bench:'The Giving Bench. A stone seat under an old tree at the top of the terraces, and someone you know sitting on it.',d_gate:'The Red Gate. A brick arch, a lit street beyond it, and one man in black standing in the way.'};
function hereBg(n){return SHOTS[n.id]?'assets/sc/'+n.id+'_1.jpg':n.who&&BGP[bgOf(n.id)]?'assets/bgp/'+bgOf(n.id)+'.jpg':FDART[n.id]?'assets/fd/'+n.id+'.jpg':TK[n.id]?tkImg(n.id,'_l'):'assets/bgp/roux.jpg';}
function hereHtml(n,st){const d=document.createElement('div');d.innerHTML=sideHtml(n);
  const acts=[...d.querySelectorAll('button[data-act]')].filter(b=>!b.disabled&&b.dataset.act!=='jans').map(b=>{let t=b.textContent.trim();if(b.dataset.act==='jduel'&&n.who)t=st.done[n.id]?'Duel '+n.who.n+' again':'Speak to '+n.who.n;return '<button class="jtk-o" data-act="'+b.dataset.act+'" data-v="'+esc(b.dataset.v||'')+'"><b>'+esc(t)+'</b></button>';});
  const two=s=>{const m=String(s||'').match(/[^.!?]+[.!?]+["”]?/g)||[String(s||'')];return m.slice(0,2).join(' ').trim();};
  const line=n.who?n.who.n+', '+String(n.who.role||'').replace(/^[A-Z]/,c=>c.toLowerCase())+'. '+(n.spot||'')+'.':n.kind==='riddle'?(n.spot||''):two(n.text||n.spot);
  return '<div class="jst" style="--bg:url('+hereBg(n)+')"><div class="jst-box"><div class="jst-say end"><h2 class="jhere-t">'+esc(n.place)+'</h2><p class="jst-l n">'+esc(sFill(line,n))+'</p>'+(INS[n.id]?'<p class="jins">\u201c'+esc(INS[n.id][st.done[n.id]?1:0])+'\u201d</p>':'')+(TAGS[n.id]?'<p class="jst-l n jtag">'+esc(TAGS[n.id])+'</p>':'')+'</div>'
    +'<div class="jst-foot">'+'<div class="jtk-opts">'+acts.join('')+'<button class="jtk-o" data-act="jtab" data-v="map"><b>Open the map</b></button></div></div></div>'
    +(n.kind==='riddle'?'<aside class="jhere-side jside-p">'+sideHtml(n)+'</aside>':'')+'</div>';}
const HIC={map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',words:'<rect x="4.5" y="3.5" width="10" height="14" rx="1.5" transform="rotate(-9 9.5 10.5)"/><rect x="9.5" y="6.5" width="10" height="14" rx="1.5"/>',journal:'<path d="M5 4h11a3 3 0 013 3v13H8a3 3 0 01-3-3z"/><path d="M5 17a3 3 0 013-3h11M9 8.5h6"/>',oracle:'<circle cx="12" cy="10" r="6.5"/><path d="M7.5 19.5h9l-1.4-3H8.9zM9.4 8.2a3 3 0 012.8-2"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>',exit:'<path d="M10 4H5v16h5M14 8l4 4-4 4M18 12H9"/>',back:'<path d="M11 6l-6 6 6 6M5 12h14"/>'};
function hic(k){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+HIC[k]+'</svg>';}
function hudHtml(n,st,here){const r=rankOf(PF.xp),cur=RANKS[r],next=RANKS[r+1],pct=next?Math.round(100*(PF.xp-cur.xp)/(next.xp-cur.xp)):100;
  const back=here?'':'<button class="hud-back" data-act="jtab" data-v="here">'+hic('back')+'<span>'+(jS.tab==='map'?'Close the map':'Back to '+esc(n.place))+'</span><kbd>Esc</kbd></button>'+(jS.tab==='map'?'<div class="hud-reg"><b>'+esc(REG[jS.reg||0].region)+'</b><small>'+esc(REG[jS.reg||0].stage)+'</small></div>':'');
  if(!here&&jS.tab!=='map')return back;
  const d=(k,a,v,l,key)=>'<button class="hud-d d-'+k+'" data-act="'+a+'"'+(v?' data-v="'+v+'"':'')+' aria-label="'+l+'"><i>'+hic(k)+'</i><span>'+l+(key?' <kbd>'+key+'</kbd>':'')+'</span></button>';
  return '<button class="hud-me" data-act="profile" aria-label="You: '+esc(meName())+'"><img src="'+meImg()+'" alt=""><span><b>'+esc(meName())+'</b><em><u style="width:'+pct+'%"></u></em><small>'+esc(cur.n)+' · '+PF.gold+' ink</small></span></button>'
    +'<div class="hud-quest"><b>Your road</b><p>'+esc(questLine(st))+'</p><button class="hud-chap" data-act="chsel" style="--em:url(assets/ui/ch_'+chapNow().em+'.webp)" aria-label="Chapters"><i></i><span>'+esc(chapNow().lab+' \u00b7 '+chapNow().t)+'</span></button></div>'
    +'<nav class="hud-wheel" aria-label="Journey">'+d('map','jtab','map','Map','M')+d('words','go','deck','Words')+d('journal','jtab','chron','Journal')+d('oracle','jorc','','Oracle')+'</nav>'
    +'<div class="hud-sys"><button data-act="settings" aria-label="Settings">'+hic('gear')+'</button><button data-act="jexit" aria-label="Back to the title screen">'+hic('exit')+'</button></div>'+back;}
function jImm(){const on=view==='story',sub=!on&&jm&&typeof JV!=='undefined'&&JV.includes(view)&&view!=='match';document.body.classList.toggle('jimm',on);document.body.classList.toggle('jsub',!!sub);let h=document.getElementById('jhere'),u=document.getElementById('jhud');
  if(!on&&!sub){if(h)h.remove();if(u)u.remove();return;}
  if(!u){u=document.createElement('div');u.id='jhud';document.body.appendChild(u);}
  if(sub){if(h)h.remove();u.className='sub';const T=[['deck','Deck'],['scrip','Scriptorium'],['book','Grimoire'],['ach','Feats']];
    u.innerHTML='<button class="hud-back" data-act="go" data-v="story">'+hic('back')+'<span>Back to the road</span></button><nav class="hud-tabs" aria-label="Wordhoard">'+T.map(t=>'<button data-act="go" data-v="'+t[0]+'"'+(view===t[0]?' class="on" aria-current="page"':'')+'>'+t[1]+'</button>').join('')+'</nav><div class="hud-ink"><img src="'+INL['ic/coin.png']+'" alt="">'+PF.gold+' ink</div>';return;}
  const st=sSt(),n=sNode(st.at)||STORY.nodes[0],here=jS.tab==='here',page=jS.tab==='hoard'||jS.tab==='chron';
  if(jS.tab==='map'){if(h)h.remove();}else{if(!h){h=document.createElement('div');h.id='jhere';document.body.appendChild(h);}h.className=page?'dim':'';const key=(page?'p':'h')+n.id+'|'+Object.keys(st.done).length+'|'+PF.gold+'|'+Object.keys(st.trade||{}).length;if(h.dataset.k!==key){h.dataset.k=key;h.innerHTML=page?'<div class="jst" style="--bg:url('+hereBg(n)+')"></div>':hereHtml(n,st);}}
  u.className=here?'here':jS.tab==='map'?'map':'page';u.innerHTML=hudHtml(n,st,here);
  if(page)u.innerHTML+='<nav class="hud-tabs" aria-label="Journal">'+[['chron','Journal'],['hoard','Words won']].map(t=>'<button data-act="jtab" data-v="'+t[0]+'"'+(jS.tab===t[0]?' class="on" aria-current="page"':'')+'>'+t[1]+'</button>').join('')+'</nav>';}
function figOf(img){const m=/assets\/(\w+)\/([\w-]+)\.\w+$/.exec(img||'');return m?'assets/fig/'+m[1]+'_'+m[2]+'.webp':'';}
/* ---- extra story pictures per place: 3 the approach, 4 the detail, 5 afterwards. Used only once all three have loaded ---- */
const XS={reeve:'The cart track into the wood. Smoke between the trunks, and the sound of an axe.',ashdown:'The plank walk out into the fen. Black water either side, and one light ahead.',quill:'The road ends at the river. The bridge is under it to the knees.',thorne:'The lych-gate at Crowstone. Crows on every stone, and none of them moving.',hale:'The moor road runs straight at a wall. There is one way through it.'},xsGot={};
const sh2=(id,k)=>(SHOTS[id]||[]).length===2?'assets/sc/'+id+'_'+k+'.jpg':'';
const xsU=(id,k)=>'assets/sc/'+id+'_'+k+'.jpg',xsOk=id=>!!XS[id]&&xsGot[id+3]&&xsGot[id+4]&&xsGot[id+5];
function xsPre(id){if(!XS[id])return;[3,4,5].forEach(k=>{if(xsGot[id+k]!=null)return;xsGot[id+k]=0;const im=new Image();im.onload=()=>{xsGot[id+k]=1;jShot.ok[xsU(id,k)]=(im.naturalWidth/Math.max(1,im.naturalHeight));};im.src=xsU(id,k);});}
const jShot={cur:'',ok:{}};function jPre(u){if(!u||jShot.ok[u])return;const im=new Image();im.onload=()=>{jShot.ok[u]=(im.naturalWidth/Math.max(1,im.naturalHeight));};im.src=u;}
function jstShot(r){let s=[];try{s=JSON.parse(r.dataset.shots||'[]');}catch(e){}if(!s.length)return;s.forEach(jPre);const u=s[Math.min(s.length-1,+r.dataset.i)];if(!u||r.dataset.cur===u)return;r.dataset.want=u;r.dataset.cl=/_2\.jpg$/.test(u)?1:0;const im=new Image();im.onload=()=>{jShot.ok[u]=(im.naturalWidth/Math.max(1,im.naturalHeight));if(r.dataset.want!==u||r.dataset.cur===u||!r.isConnected)return;r.dataset.cur=u;jShot.cur=u;const old=[...r.querySelectorAll('.jst-shot')],l=document.createElement('i');const wd=jShot.ok[u]>2;r.dataset.wd=wd?1:0;l.className='jst-shot in'+(wd?' wd':'');l.style.backgroundImage='url('+u+')';(old[old.length-1]||r.firstChild).after(l);setTimeout(()=>old.forEach(x=>x.remove()),1000);};im.src=u;}
function jstShow(r){setTimeout(()=>jstShot(r),0);const i=+r.dataset.i,ls=r.querySelectorAll('.jst-l');ls.forEach((p,k)=>p.hidden=k!==i);const p=ls[i],w=p?p.dataset.who:'n';r.dataset.sp=w;const nm=r.querySelector('.jst-name');nm.hidden=w==='n';if(w!=='n')nm.querySelector('b').textContent=w==='them'?r.dataset.them:w==='fam'?r.dataset.fam:r.dataset.me;const last=i>=ls.length-1;r.querySelector('.jst-foot').hidden=!last;r.querySelector('.jst-more').hidden=last;r.querySelector('.jst-say').classList.toggle('end',last);}
function jScene(o){const B=o.beats||[],nw=B.findIndex(x=>/new/.test(x.cls||'')),i0=!B.length?0:o.still?(nw>=0?nw:B.length-1):0,cur=B[i0],sp=cur?cur.t:'n',last=i0>=B.length-1,tn=o.them?o.them.name:'',fn=famName(true),mn=meName();
  const fig=(img,cls,fixed)=>'<div class="jst-fig '+cls+'"><img src="'+img+'" alt="" onerror="if(this.dataset.fb){this.src=this.dataset.fb;this.dataset.fb=\'\';this.parentNode.classList.add(\'ph\')}else this.style.visibility=\'hidden\'"></div>';
  if(o.beats&&o.beats.some(b=>b&&b.sh)){let last=o.bg||'';o.shots=o.beats.map(b=>last=(b.sh||last));}
  const _sh=o.shots||[],_u=_sh.length?_sh[Math.min(_sh.length-1,i0)]:'',shot0=_u&&jShot.cur===_u&&jShot.ok[_u]?_u:'';
  return '<div class="jst'+(o.them?'':' solo')+(/assets\/ev\//.test(o.bg||'')?' wide':'')+'" data-i="'+i0+'" data-sp="'+sp+'" data-them="'+esc(tn)+'" data-me="'+esc(mn)+'" data-fam="'+esc(fn)+'" data-shots="'+esc(JSON.stringify(o.shots||[]))+'"'+(shot0?' data-cur="'+esc(shot0)+'"':'')+' data-wd="'+(shot0&&jShot.ok[shot0]>2?1:0)+'" data-cl="'+(/_2\.jpg$/.test(_u||o.bg||'')?1:0)+'"'+''+(o.bg?' style="--bg:url('+o.bg+')"':'')+'>'
    +'<i class="jst-shot'+(shot0?' on'+(jShot.ok[shot0]>2?' wd':'')+'" style="background-image:url('+shot0+')':'')+'"></i><i class="jst-bars"></i>'+(o.kicker?'<small class="jst-k" style="--em:url(assets/ui/ch_'+chapNow().em+'.webp)">'+esc(o.kicker)+'</small>':'')+fig(meImg(),'me')+(o.them?fig(o.them.img,'them'):'')
    +'<div class="jst-box"><button class="jst-say'+(last?' end':'')+'" data-act="jnext" aria-label="Go on"><span class="jst-name"'+(sp==='n'?' hidden':'')+'><b>'+esc(sp==='them'?tn:sp==='fam'?fn:mn)+'</b></span>'
    +B.map((x,k)=>'<p class="jst-l '+x.t+'" data-who="'+x.t+'"'+(k===i0?'':' hidden')+'>'+esc(x.x)+'</p>').join('')
    +'<span class="jst-more"'+(last?' hidden':'')+' aria-hidden="true">▸</span></button>'
    +'<div class="jst-foot"'+(last?'':' hidden')+'>'+o.foot+'</div></div></div>';}
function greet(n,arr){const st=sSt(),lost=st.lost[n.id]||0,done=st.done[n.id],fin=(st.fin||{})[n.id],parts=[];
  if(done){parts.push(fin?'You ended it with “'+fin+'” last time. Not twice.':n.lines.again);}
  else if(lost){parts.push(n.lines.again);if(lost>=3)parts.push('That makes '+(lost+1)+' times you have sat down here.');}
  else{if(HEARD[n.id]&&n.need.some(k=>st.done[k]))parts.push(HEARD[n.id]);parts.push(n.lines.meet);if(meTitle()&&(n.id==='hale'||n.id==='quill'))parts.push('They are calling you '+meFull()+' on the road.');}
  return arr?parts.map(x=>sFill(x,n)):sFill(parts.join(' '),n);}
function hardOf(n){const th=n.deck.find(w=>W[w]&&W[w].t===NOUN&&!W[w].props.includes('ground')&&!W[w].props.includes('spell')&&!isEvent(w));return{life:8,thing:th};}
function tradeOf(n){return[...new Set(n.deck)].find(w=>W[w]&&!W[w].token&&!PF.owned[w]&&!STARTER.includes(w))||null;}
function jLine(e){const n=sNode(e.n);if(e.r==='note')return esc(e.x);if(!n)return '';const who=n.who?n.who.n:'the Riddle Stone',rd=e.rd?' in '+e.rd+(e.rd===1?' round':' rounds'):'';
  if(e.r==='miss')return 'Stood at '+esc(n.place)+' and guessed wrong. It did not laugh. Stones don’t.';
  if(n.kind==='riddle')return 'Answered '+esc(n.place)+(e.w?', and it gave me the word <b>'+esc(e.w)+'</b>':'')+'.';
  if(e.r==='loss')return 'Lost to '+esc(who)+' at '+esc(n.place)+rd+(e.lb?'. That is '+(e.lb+1)+' times now':'')+'. '+sFill('{He}',n)+' said: “'+esc(n.lines.lose)+'”';
  const g=sFill('{he}',n),o=['Beat '+esc(who)+' at '+esc(n.place)+rd+(e.hard?', on '+sFill('{his}',n)+' own terms':'')+(e.lb?', at the '+nth(e.lb+1)+' asking':'')+'.'];
  if(e.st)o.push(e.st==='humble'?'I went in asking to be taught.':e.st==='proud'?'I went in boasting, and had to make it good.':'I went in asking questions.');
  if(e.fin)o.push('I ended it with “'+esc(e.fin)+'”'+(e.life!=null&&e.life<=10?', with only '+e.life+' life left in me.':'.'));else if(e.life!=null&&e.life<=10)o.push('I had only '+e.life+' life left in me.');
  if(e.first&&e.w)o.push(g.charAt(0).toUpperCase()+g.slice(1)+' gave me the word <b>'+esc(e.w)+'</b>.');
  return o.join(' ');}
function meCard(){const m=meSt(),t=meTitle(),own=[...new Set(PF.deck)].filter(w=>W[w]).sort();
  return '<div class="jme-card"><img src="'+meImg()+'" alt=""><div><h3>'+esc(meName())+(t?' <em>'+esc(t)+'</em>':'')+'</h3><small>Journeyman of Emberwick · apprentice of Anselm Roux'+(t?'':' · no name on the road yet')+'</small>'
   +'<div class="jme-f"><label>My deck is called <input id="j-deckn" type="text" maxlength="22" value="'+esc(m.deck||'')+'" placeholder="The apprentice’s dozen" autocomplete="off"></label><label>My signature word is <select id="j-sig"><option value="">none yet</option>'+own.map(w=>'<option'+(m.sig===w?' selected':'')+'>'+esc(w)+'</option>').join('')+'</select></label></div></div></div>';}
/* place ambience */
function ambTone(f0,f1,d,type,v,dl){const a=AC,t=a.currentTime+(dl||0),o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.03);g.gain.exponentialRampToValueAtTime(0.0001,t+d);o.connect(g);g.connect(a.amb);o.start(t);o.stop(t+d+.05);}
function ambWind(d,v,f){const a=AC,t=a.currentTime,s=a.createBufferSource(),fl=a.createBiquadFilter(),g=a.createGain();s.buffer=a.nz;s.loop=true;fl.type='bandpass';fl.Q.value=1.1;fl.frequency.setValueAtTime(f,t);fl.frequency.linearRampToValueAtTime(f*1.9,t+d/2);fl.frequency.linearRampToValueAtTime(f,t+d);g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+d/2);g.gain.linearRampToValueAtTime(0.0001,t+d);s.connect(fl);fl.connect(g);g.connect(a.amb);s.start(t);s.stop(t+d+.1);}
const ambPlace=()=>view==='match'&&S&&S.live&&S.story?S.story:view==='story'&&jS.tab==='map'?jS.sel:null;
function placeAmb(){if(!AC||AC.state!=='running'||muted)return;const p=ambPlace(),r=Math.random();if(!p)return;
  if(p==='reeve'){if(r<.5)for(let i=0;i<3;i++)crackle(AC.currentTime+Math.random()*.8);if(r>.93)ambTone(90,55,.3,'sine',.12);}
  else if(p==='ashdown'||p==='quill'||p==='riddle'&&r<.1){if(r<.14){ambTone(210,150,.13,'square',.035);ambTone(215,150,.13,'square',.035,.19);}else if(r<.3)ambTone(900+Math.random()*500,300,.09,'sine',.05);else if(r>.93)ambWind(3,.05,300);}
  else if(p==='thorne'){if(r<.08){ambTone(640,430,.16,'sawtooth',.03);ambTone(620,410,.18,'sawtooth',.03,.26);}else if(r>.82)ambWind(4.5,.09,260);}
  else if(p==='hale'){if(r<.16)ambWind(5,.1,200);else if(r>.9){ambTone(62,48,.5,'sine',.2);ambTone(62,48,.5,'sine',.14,.7);}}
  else if(p==='roux'){if(r<.1)for(let i=0;i<3;i++)crackle(AC.currentTime+i*.09+Math.random()*.05);}}
setInterval(()=>{try{placeAmb();}catch(e){}},1100);
const BGP={roux:1,reeve:1,ashdown:1,quill:1,thorne:1,hale:1,w_gate:1,w_mill:1,w_alembic:1,w_glass:1,w_salt:1,y_barn:1,y_dial:1,y_gate:1,y_hives:1,y_mill:1,y_orchard:1,r_ashdown:1,r_hale:1,r_reeve:1,r_roux:1,r_salt:1,d_gate:1,d_copper:1,d_bench:1,d_kiln:1,d_breach:1,d_weir:1},TK={d_bread:1,d_steps:1,d_wicket:1,y_sleep:1,y_assay:1,y_hay:1,w_sunk:1,w_flats:1,w_stair:1},tkImg=(id,s)=>s==='_l'?'assets/tk/'+id+'_l.jpg':INL['tk/'+id+'_m.jpg'];
function sSt(){if(!PF.story||typeof PF.story!=='object')PF.story={};const s=PF.story;s.done=s.done||{};s.lost=s.lost||{};s.log=s.log||[];s.hoard=s.hoard||{};s.seen=s.seen||{};s.ev=s.ev||{};s.let=s.let||{};s.fin=s.fin||{};s.hard=s.hard||{};s.trade=s.trade||{};s.boon=s.boon||{};if(!s.at||!sNode(s.at)){const d=STORY.nodes.filter(n=>n.main&&s.done[n.id]);s.at=d.length?d[d.length-1].id:'roux';}return s;}
const REG=[{region:'The Black Country',stage:'Nigredo · the blackening'},{region:'The White Road',stage:'Albedo · the whitening'}];
const FDART={hedge:1,vane:1,cross:1,bellows:1,oldyew:1,shrine:1,nest:1,w_tarn:1,w_acorn:1,w_kiln:1,w_hide:1,w_heron:1,y_fen:1,y_lode:1,y_brook:1,y_acre:1,y_town:1,d_cinder:1,d_hearth:1,d_house:1,d_sieve:1,d_table:1},fdImg=(n,m)=>FDART[n.id]?(m?INL['fd/'+n.id+'_m.jpg']:'assets/fd/'+n.id+'.jpg'):'assets/art/'+n.art+'.jpg';
Object.assign(TALK,{
 w_salt:{humble:['I was told you teach what things are.','I teach nothing. I boil. Watch the pan.'],proud:['I came through the Black Gate. Salt will not stop me.','The gate lets through what burns. I keep what is left.'],sly:['How much is a sack of that worth across the border?','More than a journeyman. Sit.']},
 w_glass:{humble:['I have never fought in the cold.','Then you will learn quickly, or not at all.'],proud:['I flew a toad up your stair.','And I shall freeze it to my floor.'],sly:['Which of these would break first, if I leaned on it?','You would. Sit down carefully.']},
 w_alembic:{humble:['Forty years. I have had the word fuse for a fortnight.','Then you still have all your fingers. Sit.'],proud:['I have made a phoenix from an egg.','Everyone has. Make me something I have not seen.'],sly:['What is in the sealed flask on the top shelf?','My retirement. Hands on the table.']},
 w_mill:{humble:['I cannot see your side of the table.','No. That is rather the point of it.'],proud:['I am not afraid of the dark, or of you.','You were not listening. I am not what is in it.'],sly:['Who do you grind for, at this hour?','Whoever pays before sunrise. Sit.']},
 w_fair:{humble:['You have got better, Tobias.','I have got a chestnut stall. It concentrates the mind.'],proud:['Twice, then.','Oh, we are counting? Good. So am I.'],sly:['Loser minds the stall for an hour?','Done. Mind the brazier, it bites.']},
 w_gate:{humble:['I know one road well, Keeper, and two by sight.','Honest. It will not help you, but it is noted.'],proud:['Changed, made and hidden. Open the gate.','You have the words. Now show me you have the grammar.'],sly:['Has anyone ever simply walked round?','The mountain has opinions about that.']}});
Object.assign(HEARD,{w_salt:'Corvin sent a rider. He says you carry fire, fen and grave in one hand.',w_glass:'The toll-woman sent a feather up ahead of you. She does that when she is impressed.',w_alembic:'The raker says you made something in front of him. He has not stopped talking about it.',w_mill:'The child at the lane told me she could not find what you put down. She is never wrong.',w_fair:'Roux’s other apprentice! I heard you were through the Black Gate, {name}.',w_gate:'One road, at least. They tell me your name is {name}.'});
Object.assign(RUMOUR,{w_salt:'Three roads leave Saltmere and each one is barred. The heronry has the word for the high road, the snow hide for the low, and the middle wants only fuse.',w_glass:'The Keeper of the White Gate fights under winter. Bring nothing green and nothing wet, or bring fire to keep it alive.',w_alembic:'Every reaction new to you adds 2 to your blows for that duel. Against the Keeper, make three before you strike once.',w_mill:'The Keeper uses plague and time. They fade after four turns. You do not have to answer a spell, only outlast it.',w_fair:'The Keeper begins with an owl. Only a flier can stop a flier, so bring wings or bring something it cannot see.',w_gate:'Past the gate the country turns gold. They say words there are worth what they can grow.'});
Object.assign(EVENTS,{
 w_glass:{t:'On the Ice Stair',x:'Halfway up, a step has sheared off. A glass-carrier coming down with a full frame on his back is stuck above the gap, and he cannot put the frame down.',o:[
  ['Brace the gap and hand him across','It costs you an hour and most of the feeling in your hands. He gives you a pane-cutter’s ink and a warning about the Glasshouse.',{gold:12,seen:1},'Helped a glass-carrier over a broken step on the Ice Stair. He told me one word Sabine keeps.'],
  ['Climb past on the outside','You arrive first, warm from the climb, and alone.',{life:3},'Climbed round a stuck glass-carrier on the Ice Stair. Arrived warm and ahead of the news.']]},
 w_alembic:{t:'Crossing the Salt Flats',x:'A mile out, the crust gives under one boot and brine wells up. There is a staked line of planks running the long way round, and a straight white mile directly ahead.',o:[
  ['Take the planks','Slow, dry and dull. You arrive with your temper intact.',{rlife:-3},'Took the long planked way over the Salt Flats. Arrived dry, and Ibrahim took me for a patient man.'],
  ['Go straight across','You go through twice to the knee and find, the second time, what someone else lost there.',{gold:18,life:-2},'Cut straight across the Salt Flats, went through the crust twice, and came out eighteen ink richer and very cold.']]},
 w_mill:{t:'In the Sunk Road',x:'The lane is black under its roof of snow. Something small is keeping pace with you along the top of the bank. {fam} has gone very quiet on your shoulder.',o:[
  ['Leave 1 ink on the bank and walk on','When you look back the ink is gone and there are no footprints.',{gold:-5,rlife:-4},'Left 1 ink for whatever was following me down the Sunk Road. It was taken, and the miller was easier on me than she meant to be.'],
  ['Send {fam} up to look','She comes back with nothing to report and two ink she will not account for.',{coins:2},'Sent {fam} to see what was following us in the Sunk Road. She saw nothing and came back two ink up.']]},
 w_gate:{t:'Below the White Gate',x:'A pedlar has set up at the foot of the pass, selling hot wine and what she calls intelligence. For fifteen ink she will tell you what the Keeper opened with against the last three who tried.',o:[
  ['Buy the wine and the intelligence','The wine is better than the intelligence, but both are real.',{gold:-15,seen:2,life:2},'Bought hot wine and gossip below the White Gate. Two of the Keeper’s words are no secret now.'],
  ['Buy neither','You go up cold and unbriefed, which is how the Keeper prefers people.',{xp:1},'Bought nothing from the pedlar below the White Gate. I would sooner meet the Keeper as she is.']]}});
Object.assign(LETTERS,{
 y_fen:{x:st=>'{name},\nIf you have reached the hut in the reeds, you have seen my handwriting on the wall.\nThe chair was drawn for you. Not because the world chose you: because I put your name beside it. Seven years, twelve words, one apprentice to be weighed at the end. That was the paper I signed with Voss.\nI hoped an ordinary person, taught slowly, would refuse what a great adept would take. I did not trust you to choose. That part I cannot teach away.\nA. R.',o:[
  ['“You sold seven years of my life.”','He does not argue. He sends thirty ink and one line: “Yes. Spend it on something I would not approve of.”',{gold:30},'Told my master he sold seven years of my life. He agreed, and paid, and did not ask to be forgiven.'],
  ['“Then tell me how to refuse it.”','A long letter comes back. The short of it: stop collecting, and start giving away.',{xp:3},'Asked my master how to refuse the Alchemist’s chair. He says: stop collecting, and start giving away.']]},
 y_dial:{x:st=>'{name},\nI used to think the great work needed a vessel that could hold everything. A kettle has corrected me. It must also pour, and it ought to stop before the kitchen burns.\nVoss will offer you a better vessel at his gate: every word yours, for ever, and nothing lost again. He means it kindly.\nAsk him who may lift the lid, who must stay inside, and who is allowed to say it is finished.\nA. R.',o:[
  ['“And if I want what he offers?”','He writes back: “Then you will be very safe and quite alone. I was, for a while.” And a hint about Voss.',{seenAt:'y_gate',seen:2},'Asked my master what happens if I take what Voss offers. Very safe and quite alone, he says. He told me two of Voss’s words.'],
  ['“I will ask him.”','He sends twenty ink and: “Ask loudly. He prefers it quiet.”',{gold:20},'Promised my master I would ask Voss who may lift the lid. He says to ask it loudly.']]},
 w_salt:{x:st=>'{name},\nSo you are through the Black Gate and into the white. Corvin wrote. He was civil about it, which means you beat him properly.\nIsolde Varn will have given you enchant. I held that word back from you for seven years. It is the only one I ever kept from an apprentice, and you will see why the first time you use it carelessly.\nIsolde will have written you into the Measurers’ book. She must. Their Assessor, Aurel Voss, reads that book, and he has been waiting seven years to find you in it.\nThree roads. Take the one you understand least.\nA. R.',o:[
  ['“Why did you keep it from me?”','He answers at length, for once, and encloses twenty ink “for the reading of it”.',{gold:20},'Asked my master why he kept enchant from me. He wrote four pages and paid me to read them.'],
  ['“Which road did you take?”','One line comes back: “All three. In the wrong order.” And a hint about the Keeper.',{seenAt:'w_gate',seen:1},'Asked my master which road he took. All three, he says, in the wrong order. He told me one thing about the Keeper.']]},
 w_gate:{x:st=>{const n=['w_glass','w_alembic','w_mill'].filter(k=>st.done[k]).length;return '{name},\nYsolt Frane has let you through. She has let through perhaps a dozen in my lifetime, and I was not the quickest of them.\n'+(n>=3?'I hear you walked all three roads before you tried her. That is more than I asked, and exactly what I hoped.\n':n===2?'Two roads of the three. Go back for the third when the gold country bores you. It will.\n':'One road only. You were always in a hurry. Go back for the others; they will keep.\n')+'You carry a phoenix now. Do not waste it on a fight you could win without it.\nThere is something I should have told you before you left: about the twelve words, and a paper I signed. Voss keeps the Gold Gate. He will tell it his way. Hear mine first, when you come home.\nA. R.';},o:[
  ['“Then I will write and tell you what is there.”','He sends twenty-five ink and: “See that you do.”',{gold:25},'Promised my master I would write and tell him what lies past the White Gate. He never got that far himself.'],
  ['“Come and see it yourself.”','A long silence. Then: “Perhaps. Keep a place at the table.”',{xp:2},'Told my master to come and see the gold country himself. He said perhaps, and to keep a place at the table.']]}});
const TALKG={humble:['I have come to learn.','Then sit, and lose slowly.'],proud:['I have come to win.','Everyone does. Sit.'],sly:['What is your word worth to you?','More than you are carrying.']};
const mine=S=>S.things.filter(t=>t.side===0);
const R2=[
 {id:'w_salt',rg:1,kind:'duel',main:1,x:8,y:58,place:'Saltmere',spot:'The salt pans',who:{n:'Isolde Varn',p:1,role:'Salt-boiler',g:'f'},need:['hale'],word:'enchant',life:-8,
  rule:'She boils a thing down to what it is: her deck is built on enchant, which makes an adjective a thing’s nature for good.',
  deck:['enchant','enchant','burning','frozen','venomous','ancient','owl','toad','crow','leech','salt','brine','water','strike','strike','bite','guard','mend','sodden','lead'],
  lines:{meet:'From the black side. I boil salt, and I write down every word that crosses my pans. Yours too. It is the Measurers’ law. Sit.',again:'Again. Watch what the adjective becomes, not what it does.',won:'Enchant is yours. I still have to write you into their book. Their Assessor, Voss, reads it. I am sorry.',win:'Yes. You stopped dressing them up and changed them.',lose:'You painted your beasts. I salted mine.'}},
 {id:'w_heron',rg:1,kind:'find',board:1,x:19,y:28,place:'The Frozen Heronry',spot:'Nests in the ice, and one boar beneath',need:['w_salt'],words:['winged','bat'],art:'winged',
  text:'The herons have gone south and left their nests rimed white in the alders. Under the trees a boar roots at the frozen ground and will not let anything past on foot. A snow lantern stands on the far bank.',
  lesson:'A winged thing flies. Nothing on the ground can step in front of it: only another flier can defend against a flier.',
  puz:{mark:'A snow lantern',life:2,ink:3,things:[['boar',1,'g']],hand:['winged','toad','strike'],goal:'Put out the snow lantern this turn. It has 2 life, and a boar stands guard in front of it.',hint:'The boar blocks anything that walks. Give the toad wings in the same sentence that sends it to strike.'}},
 {id:'w_hide',rg:1,kind:'find',board:1,x:20,y:86,place:'The Snow Hide',spot:'A fowler’s blind, long abandoned',need:['w_salt'],words:['occult','shadow'],art:'occult',
  text:'A hide of woven willow, drifted over until it is only a shape in the snow. From inside, the fowler could see everything and nothing could see him. A boar is rooting between you and an ice bell hung on the far thorn.',
  lesson:'A hidden thing lies face down. The other side cannot single it out, and cannot defend against what they cannot see.',
  puz:{mark:'An ice bell',life:2,ink:4,things:[['boar',1,'g']],hand:['occult','toad','strike'],goal:'Break the ice bell this turn. It has 2 life, and a boar stands guard in front of it.',hint:'The boar can only stop what it can see. Bring the toad forth hidden, in the same sentence that sends it to strike.'}},
 {id:'w_kiln',rg:1,kind:'find',board:1,x:29,y:57,place:'The Lampblack Kiln',spot:'Where the ink of three counties is burned',need:['w_salt'],words:['elixir'],art:'ink',rx:'ash+water',
  text:'A squat brick kiln, black inside and out. The lampblack men make ink here from ash and snowmelt, and then, to see whether it is good, they burn a little. A frozen lock holds the kiln door. It has 9 life.',
  lesson:'Reactions chain. Ash and water make ink; ink and fire boil off as three more breath to spend. And each reaction new to you makes every blow you strike that duel 2 harder.',
  puz:{mark:'A frozen lock',life:9,ink:6,hand:['ash','water','fuse','fire','fuse','lead','strike'],goal:'Break the frozen lock this turn. It has 9 life, lead strikes for 5, and you have only 6 breath.',hint:'Fuse ash and water. Then fuse the fire with the breath you made: it pays you back. Two new reactions add 4 to the blow.'}},
 {id:'w_stair',rg:1,kind:'find',show:1,x:37,y:20,place:'The Ice Stair',spot:'The high road. Barred.',need:['w_salt'],words:[],art:'winged',
  text:'A stair cut into the glacier, and at its foot a toll-woman in a feather cloak. “Nothing walks up this,” she says. “Show me a thing with wings that was not born with them, and you may climb.”',
  lesson:'The high road is open. It leads to the Glasshouse.',
  puz:{own:1,mark:'The toll-woman',life:99,ink:9,goal:'From your own deck, make a winged thing that does not fly by nature.',hint:'You need the adjective winged, and a thing that is not a bird, bat or moth. The Frozen Heronry has the word.'},
  test:S=>mine(S).some(t=>t.props.includes('flying')&&!W[t.w].props.includes('flying')&&!W[t.w].props.includes('bird'))},
 {id:'w_flats',rg:1,kind:'find',show:1,x:39,y:55,place:'The Salt Flats',spot:'The middle road. Barred.',need:['w_kiln'],words:[],art:'salt',
  text:'A white plain to the horizon, and one man with a rake standing where the road enters it. “Nothing born crosses this,” he says. “Show me a thing that was made, from two things that were not it.”',
  lesson:'The middle road is open. It leads to the Alembic House.',
  puz:{own:1,mark:'The raker',life:99,ink:9,goal:'From your own deck, make a thing by fusing two others.',hint:'You need fuse and two things that react: fire and water, earth and water, egg and fire. Your Grimoire lists the ones you know.'},
  test:S=>mine(S).some(t=>t.made)},
 {id:'w_sunk',rg:1,kind:'find',show:1,x:37,y:88,place:'The Sunk Road',spot:'The low road. Barred.',need:['w_salt'],words:[],art:'occult',
  text:'A lane worn so deep between its banks that the snow has roofed it over. A child sits at the mouth of it with her eyes shut. “I only let through what I cannot find,” she says. “Put something on the road. I will count to ten.”',
  lesson:'The low road is open. It leads to the Moon Mill.',
  puz:{own:1,mark:'The child',life:99,ink:9,goal:'From your own deck, bring forth a thing that is hidden.',hint:'You need the adjective occult, or a thing that is dark by nature. The Snow Hide has the word.'},
  test:S=>mine(S).some(t=>t.st.occult)},
 {id:'w_acorn',rg:1,kind:'find',board:1,x:47,y:37,place:'The Acorn Bed',spot:'A forester’s frame under the snow',need:['w_glass'],words:['boar'],art:'oak',rx:'earth+seed',
  text:'A cold frame of old glass, and under it black earth kept soft all winter. The forester who built it is long gone and a drift has shut the frame. Something in there wants to be an oak. The drift has 11 life.',
  lesson:'What a reaction makes can react again. Earth and life make a seed; earth and the seed make an oak, at once, with no years of waiting.',
  puz:{mark:'A snowdrift',life:11,ink:6,hand:['earth','life','fuse','earth','fuse','strike'],goal:'Break through the snowdrift this turn. It has 11 life and you have nothing that can strike.',hint:'Fuse earth and life. Then fuse the second earth with the seed you made. Then set what grows to strike.'}},
 {id:'w_tarn',rg:1,kind:'find',board:1,x:67,y:34,place:'Thunder Tarn',spot:'A lake that keeps its own weather',need:['w_acorn'],words:['storm','air'],art:'storm',rx:'cloud+energy',
  text:'A round black tarn in a bowl of white hills. The shepherds say the weather here is not sent but made, and that anyone with the four elements in their pocket can make it.',
  lesson:'Weather can be made as well as spoken. Air and water make cloud; air and fire make energy; cloud and energy make a storm, which strikes one thing on each side every turn.',
  puz:{mark:'The still tarn',life:99,ink:8,hand:['air','water','fuse','air','fire','fuse','fuse'],goal:'Raise a storm over the tarn this turn. You have the elements and nothing else.',hint:'Fuse air and water. Fuse air and fire. Then fuse the two things you have made.'},
  test:S=>!!(S.clime&&S.clime.w==='storm')},
 {id:'w_glass',rg:1,kind:'duel',main:1,x:55,y:18,place:'The Glasshouse',spot:'At the head of the Ice Stair',who:{n:'Sabine Okoro',p:4,role:'Glassblower',g:'f'},need:['w_stair'],word:'vast',life:-6,clime:'winter',
  rule:'Winter holds the Glasshouse: plants and liquids lose 1 every turn, wet things freeze, and frost things gain 1.',
  deck:['glass','glass','sand','fire','fire','frozen','frozen','brittle','vast','owl','crow','bat','strike','strike','cut','cut','blow','guard','ancient','quicksilver','lead','winged'],
  lines:{meet:'You flew something up my stair. Good. I blow the Measurers’ sealed jars. I also keep one with a hole in it. Sit.',again:'Everything you bring freezes. Bring things that do not mind.',won:'Vast is yours. Leave a flaw in everything you make. It is how the air gets in.',win:'There. You stopped fighting the winter and used it.',lose:'You brought green things to a glasshouse in winter.'}},
 {id:'w_alembic',rg:1,kind:'duel',main:1,x:57,y:54,place:'The Alembic House',spot:'Across the Salt Flats',who:{n:'Ibrahim Sol',p:9,role:'Distiller',g:'m'},need:['w_flats'],word:'golem',life:-6,things:['fire','water'],
  rule:'A house of reactions: he begins with fire and water already on his ground, and he will fuse them.',
  deck:['fuse','fuse','fuse','fire','water','earth','air','earth','air','lead','egg','salt','strike','strike','crush','bite','toad','owl','ancient','guard','burning','mend'],
  lines:{meet:'So you can make one thing from two. The Measurers began with a dream: an angel said, rule the world by number. I keep the paper. Sit.',again:'You are still counting your creatures. Count your reactions.',won:'Golem is yours. In all these years nobody asked who sent that angel. You might.',win:'Good. You made more than you brought.',lose:'Every reaction I found made my blows harder. You found none.'}},
 {id:'w_mill',rg:1,kind:'duel',main:1,x:55,y:86,place:'The Moon Mill',spot:'At the end of the Sunk Road',who:{n:'Petra Lind',p:5,role:'Night miller',g:'f'},need:['w_sunk'],word:'muse',life:-6,clime:'night',
  rule:'The mill grinds only by night: everything arrives hidden, and she fights with spells that settle and work by themselves.',
  deck:['plague','hunger','time','debt','rumour','shadow','shadow','owl','bat','moth','occult','haunt','haunt','wither','sleep','strike','bite','guard','ancient','forget','crow','yew'],
  lines:{meet:'You came by the low road. The Measurers want one licensed song for every mill. A mill with one song jams. Sit.',again:'You are fighting my creatures. I have hardly any. Look at what is settling on you.',won:'Muse is yours. A second voice changes any working. Never keep only one.',win:'You let them fade and outlasted them. Good.',lose:'Four turns each, and you never once looked at them.'}},
 {id:'w_fair',rg:1,kind:'duel',x:71,y:70,place:'The Frost Fair',spot:'A fellow journeyman, selling chestnuts',who:{n:'Tobias Quill',p:6,role:'Journeyman',g:'m'},need:['w_salt'],any:['w_tarn','w_alembic','w_mill'],pick:['salamander','peacock','gild','crown','eternal','loan','twin'],life:0,things:['owl'],
  rule:'A rematch between equals: he begins with an owl already on his side.',
  deck:['toad','owl','crow','stag','fire','water','earth','air','fuse','fuse','blow','enchant','winged','strike','strike','bite','crush','sleep','mend','guard','burning','frozen','venomous','ancient','tame','quick'],
  lines:{meet:'I said the next country! I clerk for the Measurers now. They pay on time. Chestnut?',again:'Best of three. Best of five. I am not proud.',won:'Take your pick. And listen: they hold a paper with your name on it. Roux signed it, seven years ago. I was not meant to tell you.',win:'Twice! I am going to start telling people I taught you.',lose:'There. One each. I feel much better.'}},
 {id:'w_gate',rg:1,kind:'duel',main:1,gate:1,x:87,y:46,place:'The White Gate',spot:'The frost-house at the border',who:{n:'Ysolt Frane',p:11,role:'Keeper of the White Gate',g:'f'},need:['w_fair'],word:'phoenix',life:4,clime:'winter',things:['owl'],
  rule:'The Keeper’s trial: winter lies over the gate, she begins with 32 life to your 30, and an owl already stands on her side.',
  deck:['enchant','enchant','frozen','frozen','winged','occult','vast','ancient','owl','owl','bat','stag','glass','water','fire','fuse','strike','strike','bite','cut','blow','guard','mend','plague','time','sacred'],
  lines:{meet:'One road is enough to reach me. Voss would fix every word for ever. I keep the ones that must change to stay alive. Show me which kind you are.',again:'The other roads are still open behind you. There is no shame in walking them.',won:'Pass. Phoenix is yours: what burns and comes back changed. Beyond this the country turns gold, and the gold country is Voss’s.',win:'Changed, made and hidden, and it held. That is the whitening done.',lose:'You know one road well. Go back and learn another.'}}
];
STORY.nodes.push(...R2);
const R3=[
 {id:'y_mill',rg:2,kind:'duel',main:1,x:58.3,y:18.1,place:'The Tithe Mill',spot:'First mill of the gold country',who:{n:'Odo Garth',p:12,role:'Tithe-miller',g:'m'},need:['w_gate'],word:'ripen',life:-2,
  rule:'He works by the year, not the turn: his deck holds four seasons and he changes the weather to suit what he has planted.',
  deck:['spring','harvest','rain','drought','nettle','nettle','bramble','ivy','willow','oak','grow','grow','ripen','strike','strike','sting','bind','guard','mend','wormwood','saffron','boar','toad','ancient'],
  lines:{meet:'Through the white gate, and in a hurry. The Measurers’ weights are fair. What they ask me to fill with them is not. Sit and wait with me.',again:'You spent everything at once again. Plant something and leave it alone.',won:'Ripen is yours. A thing ripens, and then it stops. Voss has forgotten the second part.',win:'There. You waited, and then you did not need to hurry.',lose:'You struck on the first turn and had nothing left on the fourth.'}},
 {id:'y_town',rg:2,kind:'find',board:1,x:75.1,y:23.4,place:'Aurel',spot:'The clock town, where three roads leave',need:['y_mill'],words:['saffron','laurel'],art:'ripen',
  text:'A town of honey-coloured stone built round a clock that has never been right. Three roads leave the square, to the orchard, the hives and the dial, and each has somebody standing in it. Under the clock hangs a brass weight the town would like brought down. It has 10 life.',
  lesson:'Ripen brings a plant to fullness: it gains 4, and everything it does from then on counts double.',
  puz:{mark:'The clock weight',life:10,ink:5,hand:['nettle','ripen','strike'],goal:'Bring down the clock weight this turn. It has 10 life, and a nettle strikes for 1.',hint:'Bring the nettle forth. Ripen it. Then send it to strike: 5 vigour, counted twice.'}},
 {id:'y_acre',rg:2,kind:'find',board:1,x:70.8,y:34.2,place:'The Long Acre',spot:'A strip of corn nobody has cut',need:['y_town'],words:['harvest','bramble'],art:'spring',
  text:'One long field left standing after all the others were cut, with a scarecrow at the far end that the rooks have stopped believing in. The farmer says it will come down when the corn is ready and not before. The scarecrow has 12 life.',
  lesson:'Weather works for you every turn it lasts. Under spring a plant gains 2 at the start of each of your turns, so what you plant first is worth most.',
  puz:{mark:'The scarecrow',life:12,ink:3,turns:3,hand:['spring','bramble','strike'],goal:'Bring down the scarecrow in three turns. It has 12 life, a bramble strikes for 3, and you have 3 breath a turn.',hint:'Turn one: say Spring, then bring the bramble forth and leave it. End the turn. It grows by 2 each turn, and a thing that knows strike strikes again for nothing.'}},
 {id:'y_brook',rg:2,kind:'find',board:1,x:90.7,y:37.1,place:'The Ore Brook',spot:'Where the stream runs grey over the stones',need:['y_town'],words:['lead','iron'],art:'lead',rx:'lava+lead',
  text:'A brook that runs the colour of pewter, and beside it the ruin of a bloomery where somebody once tried to make silver out of what the water carried. The furnace door is rusted shut. It has 15 life.',
  lesson:'The great work is a chain. Earth and fire make lava; lead and lava make silver. A made thing keeps the vigour of both its parents, and every new reaction makes your blows 2 harder.',
  puz:{mark:'The furnace door',life:15,ink:8,hand:['earth','fire','fuse','lead','fuse','strike'],goal:'Break the furnace door this turn. It has 15 life, and lead strikes for 5.',hint:'Fuse earth and fire. Fuse the lead with the lava you made. Then set the silver to strike.'}},
 {id:'y_lode',rg:2,kind:'find',board:1,x:83.9,y:26.4,place:'The Lode Field',spot:'A field the ploughs go round',need:['y_town'],words:['lodestone','time'],art:'lodestone',
  text:'A field with one black stone in it that every plough in the parish has been bent on. Nails walk towards it. Across the ditch an iron-bound gatepost stands guard over a brass sun the dial-keeper wants back. The sun has 5 life.',
  lesson:'Some things work by themselves at the start of your turn. Put them down early and let the turns do the rest: a lodestone drags one metal across from the other side every turn.',
  puz:{mark:'The brass sun',life:5,ink:4,turns:2,things:[['lead',1,'g']],hand:['lodestone','strike'],goal:'Bring down the brass sun in two turns. It has 5 life, and a lump of lead stands guard in front of it.',hint:'Bring the lodestone forth and end your turn. Do not hit the lead: you want it whole when it comes across.'}},
 {id:'y_fen',rg:2,kind:'find',board:1,x:92.3,y:29.8,place:'The Reed Fen',spot:'An adept’s hut, long empty',need:['y_brook'],words:['quicksilver','alchemist'],art:'quicksilver',rx:'energy+quicksilver',
  text:'A hut on stilts in the reeds with a cold athanor inside and one sentence chalked on the wall: lead to water, air to fire, and the two together over a flame. Under it is a list of names, each crossed out, each with the same title: The Alchemist. The last line is blank, and someone has drawn a chair beside it.',
  lesson:'The longest chain there is. Lead and water make quicksilver; air and fire make energy; and with a fire still burning on your side, energy and quicksilver make the philosopher’s stone. And now you know: the Alchemist is not a person. It is a seat, the owner of every word, and it is being kept for someone.',
  puz:{mark:'The cold athanor',life:99,ink:9,hand:['lead','water','fuse','air','fire','fuse','fire','fuse'],goal:'Make the philosopher’s stone this turn. You have two fires and you will need both.',hint:'Fuse lead and water. Fuse air and one fire. Bring the second fire forth to be your furnace. Then fuse the two things you made.'},
  test:S=>mine(S).some(t=>t.w==='philosopher’s stone')},
 {id:'y_hay',rg:2,kind:'find',show:1,x:69.2,y:16.6,place:'The Hay Gate',spot:'The orchard road. Barred.',need:['y_town'],words:[],art:'harvest',
  text:'A five-barred gate with a woman sitting on it, shelling peas into her apron. “Nothing gets hurried up this road,” she says. “Show me a plant you have brought to eight or better, and take as long as three turns about it.”',
  lesson:'The orchard road is open. It leads to the Walled Orchard.',
  puz:{own:1,mark:'The pea-sheller',life:99,ink:9,turns:3,goal:'From your own deck, grow a plant to 8 vigour or more within three turns.',hint:'Spring, rain, grow, ripen and ancient all make a plant larger. The Long Acre shows how the weather does it for you.'},
  test:S=>mine(S).some(t=>t.props.includes('plant')&&t.vig>=8)},
 {id:'y_assay',rg:2,kind:'find',show:1,x:74.3,y:14.6,place:'The Assay Stone',spot:'The hive road. Barred.',need:['y_town'],words:[],art:'transmute',
  text:'A flat black stone by the road, scored with a thousand streaks of metal, and a man with a jeweller’s glass screwed into one eye. “Anyone can carry silver up this road,” he says. “Show me a metal you made, from things that were not metal when you set out.”',
  lesson:'The hive road is open. It leads to the Skep Yard.',
  puz:{own:1,mark:'The assayer',life:99,ink:9,turns:2,goal:'From your own deck, make a metal by reaction within two turns.',hint:'Lead and lava make silver; fire and stone make iron. Each needs something you must make first. The Ore Brook shows the chain.'},
  test:S=>mine(S).some(t=>t.made&&t.props.includes('metal'))},
 {id:'y_sleep',rg:2,kind:'find',show:1,x:80.3,y:18.6,place:'The Sleeper’s Stile',spot:'The dial road. Barred.',need:['y_town'],words:[],art:'time',
  text:'A stile with an old man asleep against it and a hat over his face. Without moving the hat he says: “Put something down that goes on working while you do nothing. Then do nothing. Wake me on the third turn if it is still at it.”',
  lesson:'The dial road is open. It leads to the Gnomon.',
  puz:{own:1,mark:'The sleeper',life:99,ink:9,turns:3,goal:'From your own deck, say a spell that settles and works by itself, and have it still standing on your third turn.',hint:'Plague, hunger, time, debt, rumour and their kind are spells: said once, they stand for four turns. Say one, then end your turn twice.'},
  test:S=>S.left<=1&&S.things.some(t=>t.owner===0&&t.props.includes('spell'))},
 {id:'y_orchard',rg:2,kind:'duel',main:1,x:65.0,y:11.5,place:'The Walled Orchard',spot:'At the end of the orchard road',who:{n:'Marigold Thrupp',p:13,role:'Orchard-wife',g:'f'},need:['y_hay'],word:'abundance',life:2,clime:'spring',
  rule:'Spring holds the orchard: every plant gains 2 a turn and everything else living gains 1. Hers were planted before you arrived.',
  deck:['oak','oak','willow','ivy','bramble','nettle','laurel','saffron','grow','grow','ripen','ripen','crown','abundance','strike','strike','sting','bind','guard','mend','ancient','thorny','boar','rain'],things:['oak'],
  lines:{meet:'You grew something at my gate. My wall keeps the pears safe. It also keeps the hungry out, and Voss calls that order.',again:'They get bigger every turn you leave them. So do not leave them.',won:'Abundance is yours. Open a gate before the fruit turns. I am going to open mine.',win:'You cut mine back and let yours stand. That is all gardening is.',lose:'You watched them grow. I did tell you they would.'}},
 {id:'y_hives',rg:2,kind:'duel',main:1,x:73.8,y:7.6,place:'The Skep Yard',spot:'At the end of the hive road',who:{n:'Osric Meade',p:14,role:'Mead-maker',g:'m'},need:['y_assay'],word:'transmute',life:2,things:['fire','water'],
  rule:'The bees were the first alchemists: he begins with fire and water on his ground, chains one reaction into the next, and turns what he makes to gold that pays him every turn.',
  deck:['fuse','fuse','fuse','fire','water','earth','air','lead','lead','iron','quicksilver','transmute','alchemist','homunculus','gild','gild','strike','strike','crush','guard','mend','toad','owl','saffron','burning'],
  lines:{meet:'Flowers into honey, honey into mead. The Measurers’ recipe is perfect and has never once fermented. Show me yours.',again:'You made one thing and stopped. Make something out of that.',won:'Transmute is yours. A vessel needs a wall and an air-hole. Voss only believes in walls.',win:'Three things deep, and the third one bit me. Good.',lose:'My gold paid me four turns running while you looked for a second reaction.'}},
 {id:'y_dial',rg:2,kind:'duel',main:1,x:82.1,y:12.5,place:'The Gnomon',spot:'At the end of the dial road',who:{n:'Zenobia Hart',p:15,role:'Dial-keeper',g:'f'},need:['y_sleep'],word:'eternal',life:2,clime:'noon',
  rule:'Noon stands over the dial: nothing stays hidden, bright things and plants gain 1 a turn, and night creatures lose 1. She fights with what outlasts you.',
  deck:['time','time','nemesis','debt','hunger','plague','eternal','eternal','scarab','scarab','amber','laurel','peacock','radiant','sacred','stag','crow','strike','strike','bite','guard','mend','ancient','miser'],
  lines:{meet:'I want one hour that never leaves me. Voss has promised me that. You have come to tell me it cannot be had.',again:'You keep killing my beetles. Count how many times.',won:'Eternal is yours. And you, holding the cards: keep your hand still a moment. See how patiently the apprentice waits for you.',win:'There. You were still standing when my spells ran out.',lose:'Everything I put down came back. Nothing of yours did.'}},
 {id:'y_barn',rg:2,kind:'duel',x:92.0,y:8.3,place:'The Tithe Barn',spot:'A fellow journeyman, asleep in the hay',who:{n:'Tobias Quill',p:6,role:'Journeyman',g:'m'},need:['y_town'],any:['y_orchard','y_hives','y_dial'],pick:['salamander','peacock','gild','crown','loan','twin','quick','alchemist','time'],life:4,things:['stag'],
  rule:'A third meeting: he has learned patience, more or less, and begins with a stag already on his side.',
  deck:['toad','owl','crow','stag','boar','fire','water','earth','air','fuse','fuse','enchant','winged','ripen','strike','strike','bite','crush','mend','guard','burning','ancient','tame','quick','spring','oak','scarab','twin'],
  lines:{meet:'You! I am the tithe examiner now. This grain is sound, and I am ordered to keep it from the people who grew it. Best of three?',again:'I can do this all harvest. I have nowhere to be.',won:'Take your pick. Then let the grain go. I have resigned. Write it down that I yielded.',win:'Three countries and you have beaten me in all of them. I am beginning to take it personally.',lose:'Ha! There. I knew the cheese was good for something.'}},
 {id:'y_gate',rg:2,kind:'duel',main:1,gate:1,x:74.7,y:43.9,place:'The Gold Gate',spot:'The obelisks at the border',who:{n:'Aurel Voss',p:16,role:'Assessor-General of the Measurers',g:'m'},need:['y_barn'],word:'measure',life:8,clime:'harvest',things:['gold','oak'],
  rule:'The man who numbered every word: harvest lies over the gate, he begins with 34 life to your 30, and gold and an oak already stand on his side and pay him every turn.',
  deck:['fuse','fuse','lead','water','fire','air','earth','transmute','gild','alchemist','oak','willow','laurel','ripen','crown','time','nemesis','eternal','scarab','stag','strike','strike','bite','crush','guard','mend','ancient','sacred','abundance','harvest'],
  lines:{meet:'I am Aurel Voss. I put the numbers on your cards, and they have kept a great many people alive. I can make your best word one that nobody ever loses. Sit.',again:'I am paid every turn you take. Take fewer, or stop my gold.',won:'Then go on into the red country, and show me a world that can afford your refusal. Take measure. It was mine.',win:'You outgrew me, outmade me and outlasted me. That is the yellowing done.',lose:'You came to finish quickly. This is the country where that does not work.'}}
];
STORY.nodes.push(...R3);REG.push({region:'The Yellow Country',stage:'Citrinitas · the yellowing'});
Object.assign(HEARD,{y_mill:'Ysolt sent word down the pass. She says you finish things quickly. We shall see about that.',y_orchard:'The pea-sheller says you grew something on her gate and did not fidget.',y_hives:'The assayer scratched your silver on his stone and has been in a temper since.',y_dial:'The old man at the stile woke up to tell me about you. He does not wake up.',y_barn:'{name}! Three countries! Do not tell me how many roads you have walked, I have walked none.',y_gate:'One road. They say your name is {name} and that you are in a hurry.'});
Object.assign(RUMOUR,{y_gate:'Voss numbered every word there is. He will offer you the Alchemist’s chair. Nobody who took it was ever seen again as themselves.',y_mill:'Three roads leave Aurel and each is barred. The orchard road wants something grown, the hive road something made, the dial road something left alone.',y_orchard:'The Keeper of the Gold Gate is paid every turn by what stands on his side. Whoever cannot stop his gold should not start.',y_hives:'There is an empty hut in the Reed Fen with the whole of the great work chalked on its wall.',y_dial:'What she kills comes back, and what you kill of hers comes back too. Bring something that takes rather than kills.'});

/* ---- the recall: the road home ---- */
const RET=[
 {id:'r_salt',rg:1,rc:1,kind:'duel',main:1,x:25.6,y:39.6,bgAs:'w_salt',place:'Saltmere, sealed',spot:'The road home. The salt pans are under the Measurers’ seal.',who:{n:'Isolde Varn',p:1,role:'Salt-boiler, under orders',g:'f'},need:['w_salt'],word:'salt',life:0,things:['brine'],
  rule:'The road home: she holds the customs gate on Voss’s order, with brine already on her side. She does not want to.',
  deck:['enchant','enchant','frozen','frozen','venomous','ancient','owl','toad','crow','leech','salt','salt','brine','water','strike','strike','bite','guard','guard','mend','sodden','lead','measure'],
  lines:{meet:'They have sealed my pans and every word chest in Saltmere. I am ordered to hold you here. I wrote you into their book. This is what came of it.',again:'I still have my orders. Break them for me.',won:'Go. I have broken my own seal. Take this: it is the page I wrote about you. Voss rode south with a copy three days ago.',win:'Good. Now run.',lose:'I am sorry. The seal holds.'}},
 {id:'r_hale',rc:1,kind:'duel',main:1,x:26.4,y:55.6,bgAs:'hale',place:'The Black Gate, fenced',spot:'The road home. New palings cut the common in two.',who:{n:'Corvin Hale',p:7,role:'Keeper, bound by his charter',g:'m'},need:['r_salt'],word:'boar',life:2,things:['stag'],
  rule:'The road home: the Measurers’ fence stands across the moor road and families wait on the wrong side. He begins with a stag on guard.',
  deck:['stag','stag','boar','owl','crow','oak','iron','strike','strike','bite','crush','guard','guard','guard','ancient','sacred','tame','bind','mend','measure','winter'],
  lines:{meet:'My charter says the fence comes before the people. I have read it forty times tonight hoping it says something else. Sit.',again:'The fence stands while I do.',won:'The road is open. I kept my oath to a line on a map. I will keep the next one to the people on it. Roux’s house is burning. Go.',win:'Then the charter is wrong, and I am glad of it.',lose:'The fence stands.'}},
 {id:'r_ashdown',rc:1,kind:'duel',main:1,x:27.1,y:82.9,bgAs:'ashdown',place:'Blackwater Fen, blocked',spot:'The road home. The channel is stopped with licensed reed.',who:{n:'Mara Ashdown',p:2,role:'Fen-wife, holding the relief boat',g:'f'},need:['r_hale'],word:'adder',life:2,clime:'fog',
  rule:'The road home: fog lies on the fen, so neither side can single out the other’s things. She is keeping a boat of medicine for her own hamlets.',
  deck:['adder','adder','toad','leech','leech','hemlock','nightshade','willow','poison','poison','sting','bite','bind','tame','mend','venomous','sodden','occult','swamp','water','strike','fog'],
  lines:{meet:'That boat is medicine, and it stays in the fen. Emberwick can look to itself. I learned that from the Measurers: keep what is yours.',again:'It stays in the fen.',won:'Take the boat through. I have been keeping people out as hard as Voss keeps them in. I am coming with you.',win:'Aye. That was not mine to keep.',lose:'It stays.'}},
 {id:'r_reeve',rc:1,kind:'duel',main:1,x:15.7,y:76.2,bgAs:'reeve',place:'Colliers’ Wood, cordoned',spot:'The road home. The wood is stacked and numbered for burning.',who:{n:'Lucan Reeve',p:8,role:'Charcoal burner, made to hold the road',g:'m'},need:['r_ashdown'],word:'pitch',life:2,clime:'drought',things:['fire'],
  rule:'The road home: drought, and a fire already burning on his ground. His crew are held until he stops you.',
  deck:['fire','fire','pitch','pitch','oak','oak','flint','burn','burn','strike','strike','crush','blow','burning','burning','ancient','guard','mend','ash','air','boar','measure'],
  lines:{meet:'They numbered every tree and took my crew. I hold this road or my men stay in irons. I know what that makes me. Mind your sleeves.',again:'I hold the road.',won:'Enough. I will not burn a wood to keep a fence. We are coming with you, with every sack of charcoal we have.',win:'Good. Now I have no excuse.',lose:'The road is held.'}},
 {id:'r_roux',rc:1,kind:'duel',main:1,gate:1,x:5.6,y:90.4,bgAs:'roux',place:'Emberwick, burning',spot:'Home. The teaching house is on fire.',who:{n:'Aurel Voss',p:16,role:'Assessor-General of the Measurers',g:'m'},need:['r_reeve'],word:'doubt',life:10,clime:'drought',things:['tower','fire'],
  rule:'Voss himself: drought, a tower and a fire already on his ground, and he measures your things so they can never grow. He begins with 35 life to your 30.',
  deck:['measure','measure','measure','tower','fire','fire','iron','iron','lead','stag','owl','oak','strike','strike','crush','crush','cut','guard','guard','burn','ancient','sacred','time','nemesis','transmute','gild','alchemist','harvest'],
  lines:{meet:'So this is the apprentice in the agreement. Roux signed seven years of you to me, and I have come to weigh the result. Give me the books and the bird and nobody need be hurt.',again:'The agreement stands until you can show it false.',won:'You taught a word to someone and they used it without you. My paper says you cannot. Very well: the paper is wrong. I will make you a better offer at my own gate.',win:'A counter-example. I dislike those.',lose:'Weighed, and found wanting. As agreed.'}}
];
STORY.nodes.push(...RET);
Object.assign(TALK,{
 r_salt:{humble:['I am not angry with you, Isolde.','You should be. Sit.'],proud:['Then I will break the seal myself.','I was hoping you would say that.'],sly:['What did the page say about me?','More than twelve words’ worth.']},
 r_hale:{humble:['Let the families through, Corvin. Then stop me if you must.','I cannot do one without the other. Sit.'],proud:['I beat you once at this gate.','You did. I have been grateful ever since.'],sly:['What does the charter say about fire?','Nothing. They never think of fire.']},
 r_ashdown:{humble:['There are sick people in Emberwick too.','There are sick people everywhere, child.'],proud:['Then I will take the boat.','You will try.'],sly:['Who taught you “keep what is yours”?','A man with a measuring rod. Sit.']},
 r_reeve:{humble:['I will get your men out, Lucan.','Do not promise. Just sit.'],proud:['I stood your fire once.','This one is bigger.'],sly:['What happens to a cordon with no wood?','You always were Roux’s.']},
 r_roux:{humble:['Let the people out of the house first.','They are protected where they are. That is what a measure is for.'],proud:['I am not in your agreement. I never signed it.','No. Your master signed for you. That is rather the point.'],sly:['What does the paper say I cannot do?','Teach. It says you can only copy.']}});
Object.assign(HEARD,{r_roux:'{name}. I have read a great deal about you.'});
const bgOf=id=>{if(BGP[id])return id;const n=sNode(id);return n&&n.bgAs||id;};
function storyTick(st){
  if((st.done.w_kiln||st.done.w_gate)&&!st.recall){st.recall=1;st.log.push({n:'w_kiln',r:'note',d:today(),x:'A letter from Roux: Voss has put a measure round Emberwick. I am called home.'});return {kind:'tell',id:st.at,k:'A rider finds you',bg:'assets/ev/recall.jpg',letter:'Come home.\nVoss has put a measure round Emberwick and calls the people inside it protected. He wants my books, the bird, and the apprentice named in my agreement.\nBring your twelve copybooks. The road will be watched: Saltmere, the Gate, the Fen, the Wood. Our own neighbours hold it for him.\nI should have told you why.\nA. R.',btn:'Turn for home',cam:'r_salt'};}
  if(st.done.r_roux&&st.recall===1){st.recall=2;st.log.push({n:'r_roux',r:'note',d:today(),x:'The teaching house burned. The twelve copybooks did not. Roux told me what he signed.'});return {kind:'tell',id:'r_roux',k:'Emberwick, in the ashes',bg:'assets/ev/ashes.jpg',them:{img:rvImg({p:10}),name:'Anselm Roux',role:'Your master'},beats:[{t:'n',x:'The house is gone, and every book in it. Your twelve copybooks were in your saddlebag. The people you fought on the road are eating from one pot in the yard.'},{t:'them',x:'I helped Voss invent the numbers on your cards. Then I signed him seven years of one apprentice, kept to twelve words, to be weighed at the end.'},{t:'them',x:'The twelve words kept you safe. They also kept you small, and I chose that for you. You need not call me master.'},{t:'n',x:'He gives you the old stove door, bent into a little lidded pot: a hearth you can carry. “Whatever you win out there, bring it home and cook it. A word nobody else can use is only a weapon.”'}],btn:'Take the road again'};}
  if(st.done.w_gate&&st.recall===2&&!st.crack2){st.crack2=1;st.log.push({n:'w_gate',r:'note',d:today(),x:'Emberwick is not on the map any more. My journal still shows it. I was there.'});return {kind:'tell',id:'w_gate',k:'The map',bg:'assets/ev/crack2.jpg',beats:[{t:'n',x:'You unroll the map to mark the gate. Where Emberwick was, there is open moor. No village, no name, not even a road end.'},{t:'n',x:'Your journal still has the sketch you made of it. You were born there.'},{t:'fam',x:'“Somebody has stopped saying it. Keep your own account of home.”'}],btn:'Roll up the map'};}
  return null;}
function bestWord(){const ws=[...new Set(PF.deck)].filter(w=>W[w]&&W[w].t===NOUN&&W[w].vig&&!W[w].props.includes('event')).sort((a,b)=>(W[b].vig+2*(PF.up[b]||0))-(W[a].vig+2*(PF.up[a]||0)));return ws[0]||null;}

/* ---- the Red Country ---- */
const R4=[
 {id:'d_weir',rg:3,kind:'duel',main:1,x:75,y:56.5,place:'The Red Weir',spot:'The dyke road into the red country',who:{n:'Ruth Sallow',p:17,role:'Dyke reeve',g:'f'},need:['y_gate'],word:'flood',life:4,clime:'flood',things:['willow'],
  rule:'Flood lies over the weir: everything is soaked, fires go out, liquids gain 1 a turn, and herbs, metals and heavy things lose 1. She begins with a willow.',
  deck:['willow','willow','water','water','brine','swamp','toad','leech','adder','drench','drench','bind','strike','strike','bite','guard','guard','mend','sodden','ancient','measure','flood','oak'],
  lines:{meet:'Do not be grand with the river; there are kitchens below us. Voss’s numbers hold this dyke. I am not sorry about that.',again:'The water does not care how much you have learned.',won:'The dyke held, which is more than I can say for the Assessor. Flood is yours. Beyond here they are asking who should keep the keys.',win:'It held.',lose:'Mind the kitchens.'}},
 {id:'d_hearth',rg:3,kind:'find',board:1,x:78.3,y:76.4,place:'The Hearth Without a House',spot:'A bridge, a fire, and no walls. Three roads leave it.',need:['d_weir'],words:['abyss'],art:'abyss',
  text:'A hearth built on the bridge itself, with four kinds of ash in it: black, white, yellow and red. People from every country you have crossed are cooking at it. Nobody owns it. An iron grate bars the far side of the bridge. It has 12 life.',
  lesson:'Opposites meet. Join a word to its true opposite and the sentence counts double: the heavy made winged, fire laid on frost, the sacred on the foul.',
  puz:{mark:'The iron grate',life:12,ink:3,hand:['winged','lead','strike'],goal:'Break the iron grate this turn. It has 12 life, lead strikes for 5, and you have 3 breath.',hint:'Lead is heavy. Give it wings in the same sentence that sends it to strike: opposites count double, and a first saying lands 2 harder.'}},
 {id:'d_sieve',rg:3,kind:'find',board:1,x:70.2,y:74.2,place:'The Reed Sieve',spot:'The brick road. A screen of reeds, clogged solid.',need:['d_hearth'],words:['sculpt'],art:'sculpt',
  text:'Someone has tried to stop the water by stopping everything. The reed screen is packed with clay and the seedlings below are dry. A clay plug holds it shut. It has 7 life.',
  lesson:'Sculpt cuts one of your things away to finish another: the first takes all the vigour and all the nature of the second.',
  puz:{mark:'The clay plug',life:7,ink:6,hand:['crow','adder','sculpt','strike'],goal:'Break the clay plug this turn. It has 7 life. A crow strikes for 2 and an adder for 2.',hint:'Bring both forth. Sculpt the crow from the adder. Then send the crow.'}},
 {id:'d_wicket',rg:3,kind:'find',show:1,x:64.6,y:72.6,place:'The Wicket',spot:'The brick road. Barred.',need:['d_sieve'],words:[],art:'masked',
  text:'A garden gate in a brick wall, and a woman leaning on it. “Show me a wall that knows what a door is for,” she says. “Something of yours that stands guard, and something of yours that can go over it.”',
  lesson:'The brick road is open. It leads to the Breach House.',
  puz:{own:1,mark:'The gate tender',life:99,ink:9,turns:2,goal:'From your own deck, have one thing standing guard and one thing that flies, within two turns.',hint:'Guard is a verb. Birds, bats and moths fly, and winged gives wings to anything.'},
  test:S=>mine(S).some(t=>t.st.guarding)&&mine(S).some(t=>t.props.includes('flying')||t.props.includes('bird'))},
 {id:'d_breach',rg:3,kind:'duel',main:1,x:60.4,y:71,place:'The Breach House',spot:'At the end of the brick road',who:{n:'Hester Clay',p:18,role:'Brickmaker',g:'f'},need:['d_wicket'],word:'orrery',life:4,things:['tower'],
  rule:'A house of walls: she begins with a tower that pays her every turn, and guards everything. Walls do not stop what flies or what is hidden.',
  deck:['tower','iron','iron','lead','oak','golem','boar','stag','guard','guard','guard','crush','crush','strike','strike','leaden','ancient','fixed','measure','mend','earth','fire','temper'],
  lines:{meet:'I sold them walls that only I was licensed to mend. Then the smoke came and nobody inside could open a window.',again:'A wall is a fine thing until you are behind it.',won:'Leave the gate with the people who live here. Orrery is yours: a little model of the sky, to keep someone else’s weather off your own house.',win:'There. A door.',lose:'Solid work, that.'}},
 {id:'d_cinder',rg:3,kind:'find',board:1,x:84,y:75.6,place:'The Cinder Bed',spot:'The kiln road. Spent ash, and something green in it.',need:['d_hearth'],words:['scintilla','unnamed'],art:'scintilla',rx:'earth+seed',
  text:'A bed of cold cinders, and in it the same plain herb you saw in the fen, with no name on its label. Nothing here is wet, and a seed wants water. A crust of slag covers the bed. It has 14 life.',
  lesson:'A scintilla is a spark. While it is yours, your reactions need no condition: no water, no furnace, no dark.',
  puz:{mark:'The slag crust',life:14,ink:8,hand:['scintilla','earth','life','fuse','earth','fuse','strike'],goal:'Break the slag crust this turn. It has 14 life, nothing here is wet, and a seed will not take without water.',hint:'Bring the scintilla forth first. Then fuse earth and life, fuse earth and the seed, and set the oak to strike.'}},
 {id:'d_steps',rg:3,kind:'find',show:1,x:88.2,y:74.8,place:'The Cooling Steps',spot:'The kiln road. Barred.',need:['d_cinder'],words:[],art:'measure',
  text:'Racks of pots cooling on a stair, and a man with his palm held an inch from the nearest. “The book says another hour,” he says. “Show me something of yours you have stopped. Fixed, so that it will not change again.”',
  lesson:'The kiln road is open. It leads to the Red Kiln.',
  puz:{own:1,mark:'The kiln watcher',life:99,ink:9,turns:2,goal:'From your own deck, make one of your things fixed, so that it will not change again.',hint:'The adjective fixed does it. So does the verb measure, which you took from Voss.'},
  test:S=>mine(S).some(t=>t.st.fixed||t.st.measured)},
 {id:'d_kiln',rg:3,kind:'duel',main:1,x:92,y:73.4,place:'The Red Kiln',spot:'At the end of the kiln road',who:{n:'Ellis Vetch',p:19,role:'Kiln keeper',g:'m'},need:['d_steps'],word:'flux',life:4,clime:'drought',things:['fire','fire'],
  rule:'Drought, and two fires on his ground that he cannot put out. Everything he has burns, and he no longer knows how to stop it.',
  deck:['fire','fire','pitch','naphtha','phosphorus','salamander','salamander','phoenix','burn','burn','burn','blow','strike','strike','bite','burning','burning','radiant','ancient','guard','ash','air','flint'],
  lines:{meet:'The kiln does not care how much you have learned. My teacher died and I have recited her firing ever since. I do not know which part of it matters.',again:'It is still burning. So am I.',won:'It is done; have the decency to stop. Flux is yours. All flows, she used to say. I only ever heard the first half.',win:'Out. At last.',lose:'Another firing, then.'}},
 {id:'d_table',rg:3,kind:'find',board:1,x:73,y:79.6,place:'The Borrowed Table',spot:'The table road. Two households, and no supper.',need:['d_hearth'],words:['resonant'],art:'resonant',
  text:'A trestle in the road with two families at it and two crows in the stores, one guarding the other. Whatever you do to one crow, the other only watches.',
  lesson:'What harms a resonant thing harms every thing of the same word, on both sides. Lay it on the right thing and one blow lands everywhere.',
  puz:{mark:'The second crow',life:99,ink:7,things:[['crow',1,'g'],['crow',1]],hand:['resonant','lead','strike'],goal:'Clear both crows from the stores this turn. One stands guard over the other.',hint:'Lay resonant on the guarding crow: an adjective on a rival thing costs 2 more breath. Then send the lead to strike. The guard steps in, and its twin feels the same blow.'},
  test:S=>!S.things.some(t=>t.side===1&&t.w==='crow')},
 {id:'d_bread',rg:3,kind:'find',show:1,x:69.6,y:81,place:'The Bread Toll',spot:'The table road. Barred.',need:['d_table'],words:[],art:'abundance',
  text:'A baker with an oven on a cart across the lane. “Show me that somebody will eat after you have gone,” she says. “One of your things that has learned two verbs, and can do them without you saying them.”',
  lesson:'The table road is open. It leads to the Common Copper.',
  puz:{own:1,mark:'The road baker',life:99,ink:9,turns:3,goal:'From your own deck, teach one of your things two verbs within three turns.',hint:'A living thing remembers a verb the first time it uses one from your hand. Use two different verbs with the same thing.'},
  test:S=>mine(S).some(t=>(t.verbs||[]).length>=2)},
 {id:'d_copper',rg:3,kind:'duel',main:1,x:66.6,y:82.2,place:'The Common Copper',spot:'At the end of the table road',who:{n:'Joan Bell',p:20,role:'Kettle mender and public cook',g:'f'},need:['d_bread'],word:'gnosis',life:4,things:['shepherdess'],
  rule:'A public kitchen: she begins with a shepherdess, so nothing on either side stays hidden and her beasts cannot be tamed away. She fights with many small things that feed each other.',
  deck:['shepherdess','pelican','apothecary','scribe','wormwood','aloe','saffron','laurel','boar','stag','crow','mend','mend','crown','abundance','strike','strike','bite','guard','sacred','resonant','spring','doubt'],
  lines:{meet:'Everyone wants a common pot until it is their turn to scrub it. I am of the order you have been hearing about. We have kept a great deal safe by keeping it to ourselves.',again:'Still your turn to scrub.',won:'You may have the word; the washing remains. Gnosis: seeing a thing for yourself. Come to the unfinished house when Voss is answered. We have something to ask of you.',win:'Fair. Pass the cloth.',lose:'Back to the sink with you.'}},
 {id:'d_bench',rg:3,kind:'duel',x:86.8,y:59.3,place:'The Giving Bench',spot:'A fellow journeyman, on the terraces',who:{n:'Tobias Quill',p:21,role:'Formerly of the Measurers',g:'m'},need:['d_hearth'],any:['d_breach','d_kiln','d_copper'],pick:['ordeal','attractor','angel','tower','masked','twin','eternal','phoenix'],life:6,things:['stag'],
  rule:'A last meeting between equals: he begins with a stag, and he is not trying to beat you so much as to be seen losing properly.',
  deck:['toad','owl','crow','stag','boar','fire','water','earth','air','fuse','fuse','enchant','winged','ripen','strike','strike','bite','crush','mend','guard','burning','ancient','quick','scarab','twin','doubt','resonant','sculpt'],
  lines:{meet:'I have brought the one word I used to keep to myself. I want to give it away in front of someone. You will do. Best of one?',again:'Again, then. I am in no hurry any more.',won:'Take your pick, for the last time. I remember every word I gave you. They simply need not answer to me.',win:'Four countries. I shall tell people I taught you.',lose:'Ha. One, at the very end.'}},
 {id:'d_gate',rg:3,kind:'duel',main:1,gate:1,x:77.7,y:89.6,place:'The Red Gate',spot:'The walled town at the end of the road',who:{n:'Aurel Voss',p:16,role:'Assessor-General of the Measurers',g:'m'},need:['d_bench'],word:'angel',life:14,clime:'harvest',things:['tower','gold','orrery'],
  rule:'The last duel: harvest, and a tower, gold and an orrery already on his ground. Your weather will not touch him, his things are measured, and he begins with 37 life to your 30.',
  deck:['measure','measure','measure','tower','orrery','gold','iron','iron','stag','stag','oak','golem','strike','strike','crush','crush','cut','guard','guard','guard','ancient','sacred','fixed','time','nemesis','transmute','gild','alchemist','attractor','angel','harvest'],
  lines:{meet:'I can keep the houses standing; can you promise as much? One owner, one measure, and nothing lost again. Refuse me a second time and you had better have something to put in its place.',again:'The houses are still standing. That is my whole argument.',won:'You have broken my warrant; see that you mend the sluice. Angel is yours. It carried me a message once. I never did learn who sent it.',win:'A door in the wall, and the wall still standing. I did not think it could be done.',lose:'One owner. One measure. Sleep safely.'}},
 {id:'d_house',rg:3,kind:'find',show:1,x:69.5,y:61.7,place:'The Unfinished House',spot:'Walls, a roof, an open door, and no master’s chair',need:['d_gate'],words:[],art:'gnosis',
  text:'The stove bricks from Emberwick are warm in the hearth. There is a bowl for everyone, and one for you. Roux is among the witnesses and does not speak first.',
  lesson:'The road goes on.',
  puz:{own:1,mark:'The witnesses',life:99,ink:9,goal:'Give away your best word.',hint:''}}
];
STORY.nodes.push(...R4);REG.push({region:'The Red Country',stage:'Rubedo · the reddening'});
Object.assign(HEARD,{d_weir:'So you are the one who said no to the Assessor at his own gate.',d_breach:'The gate tender says you showed her a wall with a door in it.',d_kiln:'The watcher says you knew when to stop. I never have.',d_copper:'The baker says something of yours can feed itself. Good. Sit.',d_bench:'{name}! I resigned. Did they tell you? I resigned.',d_gate:'{name}. You have walked my roads, eaten at their table, and still you come.'});
Object.assign(RUMOUR,{d_weir:'Three roads leave the hearth on the bridge: brick, kiln and table. Each one ends in someone who kept a good thing too tightly.',d_breach:'At the Red Gate Voss has an orrery: your weather will not touch his side. Bring an orrery of your own, or do not rely on weather.',d_kiln:'Voss measures your things so they can never grow. Bring things that are strong when they arrive.',d_copper:'They say there is a house past the gate with no master’s chair in it, and that you will be asked for your best word there.',d_gate:'Doubt unmakes a spell. Voss leans on time and nemesis.'});
function dailyHand(){const d=today();let h=2166136261;for(const c of String(d)){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}const r=()=>{h=Math.imul(h^(h>>>15),2246822507);h=Math.imul(h^(h>>>13),3266489909);h^=h>>>16;return (h>>>0)/4294967296;},pick=l=>l.splice(Math.floor(r()*l.length),1)[0];
  const ok=w=>W[w]&&!W[w].token,N=ALLWORDS.filter(w=>ok(w)&&W[w].t===NOUN&&!W[w].props.includes('event')&&!W[w].props.includes('spell')&&!W[w].props.includes('ground')&&!W[w].props.includes('burden')&&!W[w].props.includes('blank')),A=ALLWORDS.filter(w=>ok(w)&&W[w].t===ADJ),V=ATTACKV.slice(),G=ALLWORDS.filter(w=>ok(w)&&W[w].props&&W[w].props.includes('ground')&&['fire','water','earth','air'].includes(w));
  return [pick(N),pick(N),pick(N),pick(A),pick(A),pick(V),pick(V),'fuse',pick(G),pick(G)];}
STORY.nodes.push({id:'daily',hid:1,kind:'find',board:1,x:-60,y:-60,place:'Sentence of the day',spot:'',need:[],words:[],art:'ink',text:'',lesson:'',puz:{mark:'The whetstone',life:999,ink:7,get hand(){return dailyHand();},goal:'Sentence of the day: the same ten words for everyone. Do as much harm to the whetstone as you can in one turn, with 7 breath.',hint:''},test:()=>false});
function dailyScore(){if(!S||S.puz!=='daily')return;const sc=999-S.players[1].life;PF.daily=PF.daily&&PF.daily.d===today()?PF.daily:{d:today(),best:0};if(sc>PF.daily.best){PF.daily.best=sc;save();}}
{const a=sNode('ashdown');a.noatk=1;a.deck=a.deck.filter(w=>!ATTACKV.includes(w)).concat(['poison','poison','drench','sleep','plague','hemlock','nightshade','dissolve','burn','hunger'].filter(w=>W[w]));a.rule='No blows are struck in the fen: no strike, bite, crush, cut or sting, for either of you, and your attack verbs stay at home. Win by poison, fire, drowning, hunger and ruin.';}
for(const n of STORY.nodes)if(n.who&&!n.who.g)n.who.g=WHOG[n.id]||'m';
{const WP={"roux": [4.2, 89.1], "vane": [4.2, 76.4], "cross": [10.5, 93.5], "hedge": [11.9, 85.9], "oldyew": [17.7, 91.5], "reeve": [14.3, 74.9], "bellows": [11.4, 65.1], "riddle": [24.5, 89.9], "ashdown": [25.7, 81.7], "nest": [32.2, 90.8], "shrine": [30.6, 73.7], "quill": [40.7, 88.6], "thorne": [39.4, 71.0], "hale": [25.0, 54.6], "w_salt": [24.3, 38.3], "w_heron": [14.6, 35.6], "w_hide": [33.9, 39.1], "w_kiln": [23.9, 31.7], "w_stair": [9.3, 24.4], "w_glass": [15.0, 8.8], "w_acorn": [27.5, 6.1], "w_tarn": [38.1, 8.1], "w_flats": [22.5, 16.1], "w_alembic": [31.2, 18.3], "w_sunk": [34.5, 30.9], "w_mill": [41.3, 33.7], "w_fair": [38.1, 23.9], "w_gate": [45.4, 21.5]};for(const n of STORY.nodes)if(WP[n.id]){n.x=WP[n.id][0];n.y=WP[n.id][1];}}
const sOpen=n=>(!n.rc||sSt().recall>=1)&&n.need.every(k=>sSt().done[k])&&(!n.any||n.any.some(k=>sSt().done[k]));
const sHide=(n,st)=>n.hid||(n.rc&&!st.recall)||(st.crack2&&(n.id==='roux'||n.id==='r_roux'));
let jS={tab:'here',sel:null,pop:null};
function readyLv(n){const dk=PF.deck.filter(w=>W[w]),P=dk.reduce((s,w)=>s+tierOf(w)+1.5*(PF.up[w]||0),0)/Math.max(1,dk.length),duels=STORY.nodes.filter(x=>x.kind==='duel'),i=duels.indexOf(n),E=1.2+1.0*Math.max(0,i)/Math.max(1,duels.length-1);
  let heat=0;for(const e of sSt().log.filter(e=>e.r==='win'||e.r==='loss').slice(-3))heat+=e.r==='loss'?-3:e.rd<=1?4:e.rd<=2?3:e.rd<=4?1:0;heat=Math.max(0,Math.min(8,heat));
  return Math.max(0,Math.min(6,Math.round((P-E)*5)+heat));}
function readyApply(n){const L=readyLv(n);S.lv=L;if(!L)return;const b=S.players[1],lv=L>=3?1:0,nT=L>=6?3:L>=4?2:L>=2?1:0;b.life+=5*L;
  if(lv)for(const w of new Set(n.deck))if(W[w])S.up[1][w]=Math.max(S.up[1][w]||0,lv);
  const ns=[...new Set(n.deck)].filter(w=>W[w]&&W[w].t===NOUN&&!isEvent(w)&&!W[w].props.includes('spell')&&!W[w].props.includes('ground')&&!W[w].props.includes('egg')).sort((x,y)=>W[y].vig-W[x].vig).slice(0,nT),q=S.quiet;S.quiet=true;
  for(const w of ns){const t=addThing(S,w,1,1,true);if(t){t.vig+=2*lv;t.st.guarding=1;}}S.quiet=q;
  say(S,n.who.n+' has heard how you fight, and comes ready: '+5*L+' more life'+(ns.length?', '+ns.join(' and ')+' already standing guard':'')+(lv?', and '+(n.who.g==='f'?'her':'his')+' words '+(lv>1?'twice ':'')+'illuminated':'')+'. Worth '+3*L+' more gold if you win.');}
function storyStart(id,stance,hard){const n=sNode(id);if(!n||n.kind!=='duel'||!sOpen(n))return;const p=perks(rankOf(PF.xp));if(PF.deck.length<DECKMIN||PF.deck.length>p.deckMax){view='deck';renderAll();return;}
  const st0=sSt(),bn=st0.boon[id]||{},hd=hard?hardOf(n):null;
  S=newGame((Date.now()%2147483647)|0,{deck:n.noatk?PF.deck.filter(w=>!ATTACKV.includes(w)):PF.deck.slice(),market:n.noatk?ALLWORDS.filter(w=>!ATTACKV.includes(w)):undefined,up:Object.assign({},PF.up),ink:p.ink,hand:p.hand,maxVerbs:p.maxVerbs,life:STORYLIFE-LIFE+(stance==='humble'?4:0)+(bn.life||0),rivalDeck:n.deck.filter(w=>W[w]),rivalLife:Math.round((LIFE+n.life)/2)-LIFE+(stance==='proud'?4:0)+(bn.rlife||0)+(hd?hd.life:0)});
  S.rules=14;S.stat={kills:0,said:0};S.newF=[];prevHand=null;S.story=id;S.stance=stance||null;S.hard=!!hard;S.mid=Date.now();S.rival={n:n.who.n,p:n.who.p,rank:n.who.role};
  if(n.noatk)S.noatk=1;say(S,n.place+'. '+n.rule,'t');readyApply(n);say(S,'A story duel: you begin at '+S.players[0].life+' life, '+n.who.n+' at '+S.players[1].life+'.');
  if(stance){const tk=(TALK[id]||TALKG)[stance];say(S,'You: “'+tk[0]+'”');say(S,n.who.n+': “'+tk[1]+'”');S.retort=tk[1];say(S,sFill(STANCEFX[stance],n));meSt().st[stance]=(meSt().st[stance]||0)+1;}
  if(stance==='proud')S.players[0].ink=S.cfg.ink;if(stance==='sly')S.players[0].coins+=2;if(bn.coins)S.players[0].coins+=bn.coins;
  if(bn.life||bn.rlife||bn.coins)say(S,'What happened on the road comes with you to the table.');delete st0.boon[id];
  if(hd){if(hd.thing)addThing(S,hd.thing,1,1,true);say(S,sFill('On {his} own terms: {he} begins with '+hd.life+' more life'+(hd.thing?' and a '+hd.thing+' in play':'')+'.',n));}
  for(const w of n.things||[])if(W[w])addThing(S,w,1,1,true);
  if(n.clime&&W[n.clime]){S.clime={w:n.clime,owner:1,made:true};say(S,Cap(n.clime)+' lies over the board.');if(typeof climeArrive==='function')climeArrive(S);}
  S.log0=S.log.length;S.live=true;clearUi();settings(false);vsScreen();}
function storyEnd(){const n=sNode(S.story),st=sSt(),win=S.over===0&&!S.quit;if(!n)return;
  st.log.push({n:n.id,r:win?'win':'loss',d:today(),rd:Math.max(1,Math.ceil(S.turn/2)),fin:win?S.lastV||null:null,st:S.stance||null,lb:st.lost[n.id]||0,life:Math.max(0,S.players[0].life),hard:S.hard?1:0});if(st.log.length>200)st.log.shift();
  if(win&&S.lastV)st.fin[n.id]=S.lastV;const boast=win&&S.stance==='proud';if(boast)PF.gold+=10;if(win&&S.lv)PF.gold+=3*S.lv;
  if(!win){st.lost[n.id]=(st.lost[n.id]||0)+1;const seen=[...new Set(n.deck)].filter(w=>W[w]&&!PF.owned[w]&&!(st.seen[n.id]||[]).includes(w));if(seen.length){const w=seen[Math.floor(Math.random()*seen.length)];(st.seen[n.id]=st.seen[n.id]||[]).push(w);jS.pop={kind:'glimpse',id:n.id,w};}else jS.pop={kind:'lost',id:n.id};}
  else if(!st.done[n.id]){st.done[n.id]=Date.now();if(n.pick){const opts=pick(n.pick.filter(w=>W[w]&&(PF.owned[w]||0)<1),3);jS.pop=opts.length?{kind:'pick',id:n.id,opts}:{kind:'won',id:n.id};}else{sLearn(n.word,n);const l=st.log[st.log.length-1];l.first=1;l.w=n.word;jS.pop={kind:'learn',id:n.id,w:n.word};if(n.id==='hale')st.log.push({n:'hale',r:'note',d:today(),x:'After the Black Gate the Chronicle wrote a line nobody said: \u201cThe winner inherits the speaker.\u201d'});}}
  else if(S.hard&&!st.hard[n.id]){st.hard[n.id]=1;PF.gold+=40;st.log[st.log.length-1].hard=1;jS.pop={kind:'won',id:n.id,hard:1};}
  else jS.pop={kind:'won',id:n.id};
  if(boast&&jS.pop)jS.pop.boast=1;
  jS.sel=n.id;st.pend=jS.pop;save();}
function findStart(id,own){const n=sNode(id);if(!n||n.kind!=='find'||!sOpen(n))return;const z=n.puz;if(z.own&&!own){own=S&&S.puz===id&&S.ownHand?S.ownHand:null;if(!own){jS.pop=n.show&&!(jS.pop&&jS.pop.kind==='toll')?{kind:'toll',id}:{kind:'pickhand',id,sel:[]};renderStory();return;}}
  S=newGame((Date.now()%2147483647)|0,{deck:STARTER.slice(),rivalDeck:STARTER.slice()});S.things=[];S.clime=null;S.log=[];
  const a=S.players[0],b=S.players[1];a.hand=z.own?own.slice():z.hand.slice();S.ownHand=z.own?own.slice():null;if(z.own)S.up=[Object.assign({},PF.up),{}];a.deck=[];a.discard=[];a.ink=z.ink;S.cfg.ink=z.ink;S.left=z.turns||1;S.turn=1;a.coins=0;b.hand=[];b.deck=[];b.discard=[];b.life=z.life;b.coins=0;S.shop=[];S.supply=[];S.active=0;S.phase='play';S.over=null;
  for(const x of z.things||[])if(W[x[0]]){addThing(S,x[0],x[1],x[1],true);if(x[2])S.things[S.things.length-1].st.guarding=1;}S.rules=14;S.stat={kills:0,said:0};S.newF=[];prevHand=null;S.puz=id;S.bg=FDART[n.id]?n.id:null;S.mid=Date.now();S.rival={n:z.mark,p:0,img:TK[n.id]?tkImg(n.id):n.show?'assets/rival.jpg':fdImg(n,1)};
  say(S,n.place+'. '+z.goal,'t');say(S,'You have '+z.ink+' ink'+((z.turns||1)>1?' a turn, '+z.turns+' turns,':'')+' and '+(z.own?'your own deck':z.hand.length+(z.hand.length===1?' word':' words'))+'. If it goes wrong, start again: it costs nothing.');S.log0=S.log.length;S.live=true;clearUi();settings(false);
  jS.pop=null;{const e=document.getElementById('jpop');if(e)e.remove();}view='match';renderAll();scrollTo(0,0);sfx('page');}
function findWait(){if(!S.puz||S.left<=1)return;fxArm();const p=S.players[0],keep=p.hand.slice();endTurn(S,0,false);if(S.players[1].life>0){startTurn(S,1);if(S.players[1].life>0){endTurn(S,1,false);startTurn(S,0);}}p.hand=keep;p.deck=[];p.discard=[];S.players[1].hand=[];S.players[1].deck=[];S.left--;S.active=0;if(S.players[1].life>0&&S.over!==0){S.over=null;S.phase='play';}clearUi();sfx('page');}
function findEnd(){const n=sNode(S.puz),st=sSt(),win=S.over===0&&!S.quit;S.live=false;S.endSeen=true;try{localStorage.removeItem('word-alchemy-match');}catch(e){}
  if(S.found&&S.found.length){PF.found=PF.found||{};for(const k of S.found)PF.found[k]=1;S.found=[];}
  if(n&&win){const first=!st.done[n.id];if(first){st.done[n.id]=Date.now();for(const w of n.words)if(W[w]&&!W[w].token)sLearn(w,n);if(n.rx){PF.found=PF.found||{};PF.found[n.rx]=1;}PF.gold+=15;PF.xp+=1;
      st.log.push({n:n.id,r:'note',d:today(),x:n.show?'Was let through at '+n.place+'.':'Stopped at '+n.place+' and came away with '+n.words.map(w=>'“'+w+'”').join(' and ')+'.'});}
    jS.pop=st.pend={kind:'found',id:n.id,first};sfx('shimmer');}
  jS.sel=n?n.id:jS.sel;jS.tab='map';save();view='story';renderAll();}
function sLearn(w,n){if(!W[w])return;aliveInit();wordReveal(w);const st=sSt();PF.owned[w]=(PF.owned[w]||0)+1;if(!st.hoard[w])st.hoard[w]={by:n.who?n.who.n:n.place,at:n.place,m:0,last:0};if(PF.deck.length<perks(rankOf(PF.xp)).deckMax&&!PF.deck.includes(w))PF.deck.push(w);}
function sUsed(ws){if(!PF.story||!S)return;const st=sSt(),mid=S.mid||(S.mid=Date.now());let ch=false;for(const w of ws){const h=st.hoard[w];if(h&&h.last!==mid){h.last=mid;h.m=(h.m||0)+1;ch=true;}}return ch;}
function camGeo(){const mp=$('j-map'),w=$('j-world');if(!mp||!w)return null;const vh=mp.clientHeight,vw=mp.clientWidth,ww=Math.max(vw,vh*1.5),wh=ww/1.5;w.style.width=ww+'px';w.style.height=wh+'px';return{mp,w,vh,vw,ww,wh};}
const jCl={};function jCloud(svg){const draw=im=>{const c=$('j-cloud');if(c){const x=c.getContext('2d');x.clearRect(0,0,1500,1000);x.drawImage(im,0,0,1500,1000);}};let im=jCl[svg];if(im){if(im.complete)draw(im);else im.addEventListener('load',()=>draw(im));return;}if(jCl.last&&jCl.last.complete)draw(jCl.last);im=jCl[svg]=new Image();im.onload=()=>{jCl.last=im;draw(im);};im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg);}
const HIQ={sw:1,ne:1,nw:1};function zHard(){const g=camGeo();return g?Math.max(3.2,Math.min(6,3072/(g.ww/2)/(window.devicePixelRatio||1))):3.2;}function zMax(){const g=camGeo(),c=jS.cam;if(!g||!c)return zHard();const cx=(g.vw/2-c.x)/(g.ww*c.z),cy=(g.vh/2-c.y)/(g.wh*c.z);return HIQ[(cy<.5?'n':'s')+(cx<.5?'w':'e')]?zHard():3.2;}
function jFresh(){const st=sSt();return !STORY.nodes.some(n=>st.done[n.id]);}
function camClamp(){const g=camGeo(),c=jS.cam;if(!g||!c)return;c.z=Math.max(1,Math.min(zHard(),c.z));c.x=Math.min(0,Math.max(g.vw-g.ww*c.z,c.x));c.y=Math.min(0,Math.max(g.vh-g.wh*c.z,c.y));}
function camSet(anim){const g=camGeo();if(!g)return;camClamp();g.w.style.transition=anim?'transform .55s cubic-bezier(.3,.8,.3,1)':'none';g.w.style.transform='translate('+jS.cam.x+'px,'+jS.cam.y+'px) scale('+jS.cam.z+')';g.mp.style.setProperty('--z',jS.cam.z);}
function camTo(id,anim,z){const g=camGeo(),n=sNode(id);if(!g||!n)return;const c=jS.cam=jS.cam||{x:0,y:0,z:jFresh()?zHard():2.3};if(z)c.z=z;c.x=g.vw/2-n.x/100*g.ww*c.z;c.y=g.vh/2-n.y/100*g.wh*c.z;camSet(anim);}
function camApply(centre){if(centre)camTo(centre,false);else camSet(false);}
let jDrag=null;
document.addEventListener('pointerdown',ev=>{const mp=ev.target.closest&&ev.target.closest('#j-map');if(!mp||ev.target.closest('.jzoom')||!jS.cam)return;jDrag={x:ev.clientX,y:ev.clientY,cx:jS.cam.x,cy:jS.cam.y,moved:false};});
document.addEventListener('pointermove',ev=>{if(!jDrag)return;const dx=ev.clientX-jDrag.x,dy=ev.clientY-jDrag.y;if(!jDrag.moved&&Math.abs(dx)+Math.abs(dy)<6)return;jDrag.moved=true;document.body.classList.add('jdragging');const k=zoomOf?1/(parseFloat((document.querySelector('.storyscene')||{style:{}}).style.zoom)||1):1;jS.cam.x=jDrag.cx+dx*k;jS.cam.y=jDrag.cy+dy*k;camSet(false);peekHide();});
document.addEventListener('pointerup',()=>{if(!jDrag)return;const m=jDrag.moved;jDrag=null;document.body.classList.remove('jdragging');if(m){jS.noClick=Date.now();}});
document.addEventListener('click',ev=>{if(jS.noClick&&Date.now()-jS.noClick<250&&ev.target.closest&&ev.target.closest('#j-map')){ev.stopPropagation();ev.preventDefault();}},true);
document.addEventListener('wheel',ev=>{const mp=ev.target.closest&&ev.target.closest('#j-map');if(!mp||!jS.cam)return;ev.preventDefault();const r=mp.getBoundingClientRect(),k=mp.clientWidth/r.width,mx=(ev.clientX-r.left)*k,my=(ev.clientY-r.top)*k,c=jS.cam,z0=c.z,z1=Math.max(1,Math.min(zMax(),z0*(ev.deltaY<0?1.12:1/1.12)));c.x=mx-(mx-c.x)*z1/z0;c.y=my-(my-c.y)*z1/z0;c.z=z1;camSet(false);},{passive:false});
/* ---- chapters: a title card the first time each part of the story opens ---- */
const CHAP=[
 {k:'p',em:'prologue',lab:'Prologue',t:'The Twelve Words',sub:'Emberwick',c:'#d9c79a',bg:'assets/sc/roux_1.jpg',open:st=>true,x:'Seven years of copying twelve plain words. Tonight your master asks to hear them spoken.'},
 {k:'1',em:'black',lab:'Chapter I',t:'The Black Country',sub:'Nigredo · the blackening',c:'#8fc7d6',bg:'assets/map/world_sw.jpg',open:st=>st.done.roux,x:'Win your words in open duel, the old way. Ask on the road for the Alchemist.'},
 {k:'2',em:'white',lab:'Chapter II',t:'The White Road',sub:'Albedo · the whitening',c:'#cfe4ff',bg:'assets/map/world_nw.jpg',open:st=>st.done.hale,x:'Past the Black Gate the road forks three ways, and a made thing is the only toll.'},
 {k:'3',em:'home',lab:'Chapter III',t:'The Road Home',sub:'Emberwick, measured',c:'#ff9a62',bg:'assets/sc/r_roux_1.jpg',open:st=>st.recall,x:'A rider, a letter, two words: come home.'},
 {k:'4',em:'yellow',lab:'Chapter IV',t:'The Yellow Country',sub:'Citrinitas · the yellowing',c:'#f3d76a',bg:'assets/map/world_ne.jpg',open:st=>st.done.w_gate,x:'Gold country. Everything here has a measure, and every measure has an owner.'},
 {k:'5',em:'red',lab:'Chapter V',t:'The Red Country',sub:'Rubedo · the reddening',c:'#ff7361',bg:'assets/map/world_se.jpg',open:st=>st.done.y_gate,x:'The last country. A hearth with no house, and a chair nobody will sit in.'}];
const famOf=w=>{const d=W[w]||{},P=d.props||[],h=(...a)=>a.some(x=>P.includes(x));if(tierOf(w)===4)return 'great';if(d.t===VERB)return 'verb';if(d.t===ADJ)return 'adjective';if(d.t!==NOUN)return 'air';
  if(h('event','spell'))return 'spell';if(h('beast','bird','serpent','human','minded'))return 'beast';if(h('plant','herb','wood','lichen'))return 'plant';if(h('flame','fireborn','spark','explosive','bright'))return 'fire';if(h('liquid','damp'))return 'water';if(h('wind','flying','spirit','fleeting'))return 'air';if(h('stone','metal','heavy','ground','salty'))return 'earth';return h('concept')?'spell':'earth';},
 runeOf=w=>'assets/fx/rune_'+famOf(w)+'.webp';
const TIERN=['','Plain','Rare','Great','Wonder'];
function rwPick(o){return '<small>'+esc(o.k)+'</small><h2>'+esc(o.t)+'</h2>'+(o.sub?'<p>'+esc(o.sub)+'</p>':'')+'<div class="rw" role="radiogroup" aria-label="Three words">'+o.opts.map((w,i)=>'<button class="rw-c t'+tierOf(w)+'" role="radio" aria-checked="false" data-w="'+esc(w)+'" style="--k:'+i+'" aria-label="'+esc(w+', '+TIERN[tierOf(w)]+' '+kindOfW(w))+'">'+jrune(w,o.card(w))+'<b>'+esc(w)+'</b><i>'+esc(TIERN[tierOf(w)]+' \u00b7 '+kindOfW(w))+'</i></button>').join('')+'</div><button class="rbtn rw-go" data-act="'+o.act+'" data-v="" disabled><span>Choose a word</span></button>';}
document.addEventListener('click',ev=>{const c=ev.target.closest&&ev.target.closest('.rw-c');if(!c)return;const box=c.closest('.jpbox'),go=box&&box.querySelector('.rw-go');box.querySelectorAll('.rw-c').forEach(x=>{x.classList.toggle('sel',x===c);x.setAttribute('aria-checked',x===c);});box.querySelector('.rw').classList.add('has');if(go){go.disabled=false;go.dataset.v=c.dataset.w;go.querySelector('span').textContent='Keep \u201c'+c.dataset.w+'\u201d';}try{sfx('tick');}catch(e){}});
const jrune=(w,h)=>'<div class="jrune t'+tierOf(w)+'" style="--rune:url('+runeOf(w)+')">'+h+'</div>';
/* ---- chapter screen: the six emblems, lit as you reach them ---- */
const chapNow=()=>{const st=sSt(),op=CHAP.filter(c=>c.open(st));return op[op.length-1]||CHAP[0];};
function chapSelect(){const old=document.getElementById('chsel');if(old){old.remove();return;}
  const st=sSt(),cur=chapNow(),e=document.createElement('div');e.id='chsel';e.setAttribute('role','dialog');e.setAttribute('aria-label','Chapters');
  e.innerHTML='<i class="cs-co a"></i><i class="cs-co b"></i><i class="cs-co c"></i><i class="cs-co d"></i><header><small>The Great Work</small><h1>Chapters</h1><i class="ch-rule"></i></header><div class="cs-row">'
    +CHAP.map((c,i)=>{const op=c.open(st),cu=c===cur;return '<button class="cs-ch'+(op?'':' shut')+(cu?' cur':'')+'" data-i="'+i+'" style="--c:'+c.c+';--em:url(assets/ui/ch_'+c.em+'.webp)"'+(op?'':' disabled')+' aria-label="'+esc(c.lab+', '+(op?c.t:'not yet reached'))+'"><i class="cs-em"></i>'+(cu?'<i class="cs-star"></i>':'')+'<small>'+esc(c.lab)+'</small><b>'+esc(op?c.t:'Not yet reached')+'</b><span>'+esc(op?c.sub:'')+'</span></button>';}).join('')
    +'</div><button class="rbtn cs-x"><span>Back</span></button>';
  document.body.appendChild(e);
  const close=()=>e.remove();e.querySelector('.cs-x').onclick=close;
  e.querySelectorAll('.cs-ch:not(.shut)').forEach(b=>b.onclick=()=>{close();chapShow(CHAP[+b.dataset.i]);});
  e.onkeydown=k=>{if(k.key==='Escape'){k.preventDefault();k.stopPropagation();close();}};
  setTimeout(()=>{try{(e.querySelector('.cs-ch.cur')||e.querySelector('.cs-x')).focus();}catch(x){}},60);sfx('page');}
document.addEventListener('click',ev=>{const b=ev.target.closest&&ev.target.closest('[data-act="chsel"]');if(b){ev.preventDefault();ev.stopPropagation();chapSelect();}},true);
addEventListener('load',()=>{try{for(let i=1;i<=5;i++)document.documentElement.style.setProperty('--mk'+i,'url('+INL['mk/'+i+'.png']+')');}catch(e){}});
function chapCheck(st){if(view!=='story'||document.getElementById('chap')||!(PF.pro&&PF.me&&PF.me.name))return;if(jS.pop||st.pend||document.getElementById('wrev')||document.getElementById('opn'))return;
  const op=CHAP.filter(c=>c.open(st));if(!st.chap){st.chap={};op.slice(0,-1).forEach(c=>st.chap[c.k]=1);}
  const c=op.find(c=>!st.chap[c.k]);if(c)chapShow(c,()=>{st.chap[c.k]=1;save();if(c.k!=='p'){jS.tab='map';renderStory();}});}
function chapShow(c,done){const old=document.getElementById('chap');if(old)old.remove();
  const e=document.createElement('div');e.id='chap';e.setAttribute('role','dialog');e.setAttribute('aria-label',c.lab+': '+c.t);e.style.setProperty('--c',c.c);e.style.setProperty('--bg','url('+c.bg+')');e.style.setProperty('--em','url(assets/ui/ch_'+c.em+'.webp)');
  e.innerHTML='<i class="ch-bg"></i><i class="ch-fr a"></i><i class="ch-fr b"></i><i class="ch-fr c"></i><i class="ch-fr d"></i>'
    +'<div class="ch-head"><small>'+esc(c.lab)+'</small><h1>'+esc(c.t)+'</h1><i class="ch-rule"></i><span class="ch-band">'+esc(c.sub)+'</span><p>'+esc(c.x)+'</p></div>'
    +'<div class="ch-floor"><i class="ch-ring r1"></i><i class="ch-ring r2"></i><i class="ch-ring r3"></i><i class="ch-card"></i></div>'
    +'<button class="rbtn ch-go"><span>Begin</span></button>';
  document.body.appendChild(e);const b=e.querySelector('.ch-go');let gone=false;
  const go=()=>{if(gone)return;gone=true;e.classList.add('out');if(done)done();sfx('page');setTimeout(()=>e.remove(),520);};
  b.onclick=go;e.onkeydown=k=>{if(k.key==='Enter'||k.key===' '||k.key==='Escape'){k.preventDefault();k.stopPropagation();go();}};
  setTimeout(()=>{try{b.focus();}catch(x){}},900);sfx('shimmer');}
function renderStory(){jImm();if(view!=='story')return;const host=$('view-story'),st=sSt();{const lp=jS.pop&&jS.pop.kind==='learn'?jS.pop:st.pend&&st.pend.kind==='learn'?st.pend:null;if(lp){jS.pop=null;st.pend=null;afterWin(lp.id);save();}}chapCheck(st);if(!jS.pop&&st.pend&&sNode(st.pend.id)){jS.pop=st.pend;jS.sel=st.pend.id;}
  if(!jS.pop&&PF.pro&&PF.fam&&PF.me&&PF.me.name){const lid=Object.keys(LETTERS).find(k=>st.done[k]&&st.let[k]==null);if(lid)jS.pop={kind:'letter',id:lid};else{const t=storyTick(st);if(t){jS.pop=st.pend=t;save();}}}
  if(!host.querySelector('.storyscene'))host.innerHTML='<div class="scene storyscene"><div class="scenetop"><div class="booktabs" id="j-tabs"></div><span class="j-reg" id="j-regn"></span><span class="jquest" id="j-quest"></span><span class="ctr" id="j-ctr"></span></div><div id="j-body"></div></div>';
  if(jS.reg==null)jS.reg=(sNode(st.at)||{}).rg||0;if(jS.sel&&sNode(jS.sel))jS.reg=sNode(jS.sel).rg||0;const RN=STORY.nodes.filter(n=>(n.rg||0)===jS.reg);
  $('j-regn').innerHTML='<b>'+esc(REG[jS.reg].region)+'</b><small>'+esc(REG[jS.reg].stage)+'</small>';{const q=$('j-quest');if(q)q.innerHTML='<small>Your road</small>'+esc(questLine(st));}
  $('j-tabs').innerHTML=[['map','The road'],['hoard','Words won'],['chron','Journal']].map(([k,l])=>'<button class="tab'+(jS.tab===k?' on':'')+'" data-act="jtab" data-v="'+k+'">'+l+'</button>').join('');
  const hw=Object.keys(st.hoard),kept=hw.filter(w=>st.hoard[w].m>=2).length,mains=RN.filter(n=>n.main);
  $('j-ctr').innerHTML='<img src="assets/fr/seal.webp" alt="" style="width:24px;height:24px"><b>'+mains.filter(n=>st.done[n.id]).length+'/'+mains.length+'</b><small>stamps · '+hw.length+(hw.length===1?' word':' words')+' in your hoard</small>';
  const body=$('j-body');
  if(jS.tab==='map'){
    if(!jS.sel||!sNode(jS.sel))jS.sel=(RN.find(n=>sOpen(n)&&!st.done[n.id])||RN[RN.length-1]).id;
    const nodeHtml=n=>{const open=sOpen(n),done=st.done[n.id],cls=(done?' done':open?' open':' shut')+(jS.sel===n.id?' sel':'')+(n.main?' main':'')+(n.gate?' gate':'')+' k-'+n.kind;
        return '<button class="jnode'+cls+'" style="left:'+n.x+'%;top:'+n.y+'%" data-act="jsel" data-v="'+n.id+'" aria-label="'+esc(n.place)+(done?', done':open?'':', not yet reachable')+'">'+(n.who?'<img src="'+rvImg({p:n.who.p})+'" alt="">':n.kind==='find'?(TK[n.id]?'<img src="'+tkImg(n.id,'_m')+'" alt="">':n.show?'<i>⛝</i>':'<img src="'+fdImg(n,1)+'" alt="">'):'<i>?</i>')+(done?'<img class="jst" src="assets/fr/seal.webp" alt="">':'')+(st.lost[n.id]&&!done?'<u title="Lost here">✕</u>':'')+'<span>'+esc(n.place)+'</span></button>';},
     me=r=>{const a=sNode(jS.walk||st.at);return (a.rg||0)===r?'<div class="jhorse" id="j-horse" style="left:'+a.x+'%;top:'+a.y+'%"><img class="rd-rest" src="'+INL['rd/rest.webp']+'" alt=""><img class="rd-a" src="'+INL['rd/a.webp']+'" alt=""><img class="rd-b" src="'+INL['rd/b.webp']+'" alt=""></div><div class="jme" id="j-me" style="left:'+a.x+'%;top:'+a.y+'%" title="'+esc(meFull())+'"><img src="'+meImg()+'" alt="You"></div>':'';},
     fogC=STORY.nodes.filter(n=>st.done[n.id]||sOpen(n)).map(n=>'<circle cx="'+(n.x*15).toFixed(1)+'" cy="'+(n.y*10).toFixed(1)+'" r="'+(st.done[n.id]?150:jFresh()?80:105)+'"/>').join('');
    const cloudSvg='<svg xmlns="http://www.w3.org/2000/svg" width="1500" height="1000" viewBox="0 0 1500 1000" preserveAspectRatio="none" aria-hidden="true"><defs><filter id="jcb" filterUnits="userSpaceOnUse" x="-200" y="-200" width="1900" height="1400"><feGaussianBlur stdDeviation="38"/></filter><filter id="jct"><feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="4" seed="7"/><feColorMatrix values="0 0 0 0 .62  0 0 0 0 .66  0 0 0 0 .74  0 0 0 1.5 -.28"/></filter><mask id="jcm"><rect width="1500" height="1000" fill="#fff"/><g fill="#000" filter="url(#jcb)">'+fogC+'</g></mask></defs><g mask="url(#jcm)"><rect width="1500" height="1000" fill="#0c1018" opacity=".9"/><rect width="1500" height="1000" filter="url(#jct)" opacity=".85"/></g></svg>';
    body.innerHTML='<div class="jcols"><div class="jmap jwm" id="j-map"><div class="jworld" id="j-world"><img class="jt" style="left:0;top:0;width:50.2604%;height:50.3906%" src="assets/map/world_nw.jpg" alt="" draggable="false"><img class="jt" style="left:49.7396%;top:0;width:50.2604%;height:50.3906%" src="assets/map/world_ne.jpg" alt="" draggable="false"><img class="jt" style="left:0;top:49.6094%;width:50.2604%;height:50.3906%" src="assets/map/world_sw.jpg" alt="" draggable="false"><img class="jt" style="left:49.7396%;top:49.6094%;width:50.2604%;height:50.3906%" src="assets/map/world_se.jpg" alt="" draggable="false">'
      +'<i class="jdrift" aria-hidden="true"></i><canvas class="jcloud" id="j-cloud" width="1500" height="1000" aria-hidden="true"></canvas>'
      +STORY.nodes.filter(n=>!sHide(n,st)&&(st.done[n.id]||sOpen(n)||n.need.some(k=>st.done[k]))).map(nodeHtml).join('')+me((sNode(jS.walk||st.at).rg)||0)
      +'</div><div class="jzoom"><button data-act="jzoom" data-v="1" aria-label="Zoom in">+</button><button data-act="jzoom" data-v="-1" aria-label="Zoom out">−</button><button data-act="jhome" aria-label="Centre on me" title="Centre on me">◎</button></div><p class="jhintm">Drag to move · scroll to zoom</p></div><aside class="jside-p" id="j-side"></aside></div>';
    jCloud(cloudSvg);
    const sn=sNode(jS.sel);if(jS.cam&&!jS.wm){jS.cam=null;}jS.wm=1;camApply(jS.cam?null:st.at);
    {const sd=$('j-side'),shut=sn&&!sOpen(sn);sd.innerHTML=shut?sideHtml(sn):'';sd.hidden=!shut;}
    if(jS.walk){const m=$('j-me'),to=sNode(st.at),fr=sNode(jS.walk);jS.walk=null;if(m){m.classList.add('riding');if(fr&&to.x<fr.x)m.classList.add('west');setTimeout(()=>{const k=$('j-me');if(k)k.classList.remove('riding');},1500);const hz=$('j-horse');if(hz){hz.classList.add('riding');if(fr&&to.x<fr.x)hz.classList.add('west');setTimeout(()=>{const k=$('j-horse');if(k)k.classList.remove('riding');},1500);}requestAnimationFrame(()=>requestAnimationFrame(()=>{m.style.left=to.x+'%';m.style.top=to.y+'%';if(hz){hz.style.left=to.x+'%';hz.style.top=to.y+'%';}}));}}
  }else if(jS.tab==='hoard'){
    body.innerHTML='<div class="jbook"><h3>The wordhoard of a journeyman</h3><p class="jlead">Every word you win on the road is yours at once. It goes into your hoard and your deck the moment it is given.</p><div class="jhoard">'+STORY.nodes.filter(n=>!n.show).map(n=>{const done=st.done[n.id],ws=n.words?n.words:n.word?[n.word]:Object.keys(st.hoard).filter(w=>st.hoard[w].at===n.place);
      const slot=w=>{const h=st.hoard[w];return h?'<figure class="kept"><div class="card mini static '+W[w].t+'" tabindex="0" data-pv="'+esc(w)+'">'+miniFace(w,{ink:W[w].syl,lv:PF.up[w]||0,up:PF.up})+'</div><figcaption>yours</figcaption></figure>':'';};
      return '<section class="'+(done?'done':'')+'"><header>'+(done?'<img src="assets/fr/seal.webp" alt="stamped">':'<i></i>')+'<div><b>'+esc(n.place)+'</b><small>'+(n.who?esc(n.who.n)+', '+esc(n.who.role.toLowerCase()):n.kind==='find'?'found on the road':'a riddle')+'</small></div></header>'+(ws.filter(w=>st.hoard[w]).map(slot).join('')||'<figure class="empty"><div class="jempty">?</div><figcaption>'+(sOpen(n)?'not yet won':'further down the road')+'</figcaption></figure>')+'</section>';}).join('')+'</div></div>';
  }else{
    const L=st.log.slice().reverse();body.innerHTML='<div class="jbook">'+meCard()+'<h3>My journal</h3><ol class="jchron">'+(L.map(e=>{const t=jLine(e);return t?'<li class="'+e.r+'"><time>'+esc(e.d||'')+'</time>'+t+'</li>':'';}).join('')||'<li>I have not yet left the scriptorium.</li>')+(PF.fam?'<li class="start">My master gave me a magpie from his rafters. I have named her '+esc(PF.fam.name)+'.</li>':'')+'<li class="start">I was bound apprentice to Anselm Roux of Emberwick, and for seven years I ground his ink and copied his twelve words.</li></ol></div>';
  }
  popHtml();fit();}
function findSide(n,open,done){const head='<h3>'+esc(n.place)+'</h3><p class="jspot">'+esc(n.spot)+'</p>';if(!open)return head+'<p class="jshut">You cannot reach this yet.</p>';
  const pic=n.show?(TK[n.id]?'<img class="jfindimg" src="'+tkImg(n.id,'_l')+'" alt="">':''):'<img class="jfindimg" src="'+fdImg(n)+'" alt="">',txt='<p class="jtxt">'+esc(n.text)+'</p>',ws=n.words.filter(w=>W[w]&&!W[w].token);
  if(done)return head+pic+txt+'<p class="jdone">'+(n.show?'You were let through.':'You came away with '+ws.map(w=>'<b>'+esc(w)+'</b>').join(' and ')+'.')+'</p><h4>'+(n.show?'Beyond':'What it taught')+'</h4><p class="jrum">'+esc(n.lesson)+'</p><button class="mbtn" data-act="jfind" data-v="'+n.id+'">Try it again</button>';
  return head+pic+txt+(n.show?'<h4>The toll</h4><p class="jrew">'+esc(n.puz.goal)+'</p>':'<h4>To be found here</h4><p class="jrew">'+(ws.length===1?'One word':'Two words')+(n.rx?', and a reaction for your Grimoire':'')+'.</p>')+'<button class="mbtn main" data-act="jfind" data-v="'+n.id+'">'+(n.show?'Answer':'Look closer')+'</button><p class="jfree">'+(n.show?'You will be shown your own deck. No opponent, no cost.':'A small puzzle on the board. '+((n.puz.turns||1)>1?n.puz.turns+' turns':'One turn')+', a fixed hand, no opponent.')+' Try as often as you like.</p>';}
function sideHtml(n){const st=sSt(),open=sOpen(n),done=st.done[n.id],lost=st.lost[n.id]||0;
  if(n.kind==='riddle')return '<h3>'+esc(n.place)+'</h3><p class="jspot">'+esc(n.spot)+'</p>'+(open?'<pre class="jriddle">'+esc(n.text)+'</pre>'+(done?'<p class="jdone">Answered. It taught you <b>'+esc(n.word)+'</b>.</p><p class="jins">\u201c'+esc(INS.riddle[1])+'\u201d</p>':'<div class="jans"><input id="j-ans" type="text" autocomplete="off" placeholder="Your answer" aria-label="Your answer"><button class="btn" data-act="jans">Say it</button></div>'+(lost?'<p class="jhint">'+(lost>=2?esc(n.hint):'Not that. The stone is patient.')+'</p>':'')+'<p class="jrew">Reward: a word.</p>'):'<p class="jshut">You cannot reach this yet.</p>');
  if(n.kind==='find')return findSide(n,open,done);
  const line=done?n.lines.won:lost?n.lines.again:n.lines.meet,seen=st.seen[n.id]||[];
  return '<div class="jwho"><img src="'+rvImg({p:n.who.p})+'" alt=""><div><h3>'+esc(n.who.n)+'</h3><small>'+esc(n.who.role)+'</small></div></div><p class="jspot">'+esc(n.place)+' · '+esc(n.spot)+'</p>'
    +(open?'<blockquote>'+esc(line)+'</blockquote><h4>House rule</h4><p class="jrule">'+esc(n.rule)+'</p><h4>'+(done?'Taught you':'Teaches')+'</h4><p class="jrew">'+(n.pick?(done?'Your pick of the road’s words.':'Your pick of one from three local words.'):(done?'<b>'+esc(n.word)+'</b>':'One word, kept secret until you win.'))+'</p>'
      +(seen.length&&!done?'<p class="jseen">Words you marked in '+(n.who.n.split(' ')[0])+'’s hand: <b>'+seen.map(esc).join(', ')+'</b></p>':'')
      +(done&&RUMOUR[n.id]?'<h4>'+esc(n.who.n.split(' ')[0])+' tells you</h4><p class="jrum">'+esc(RUMOUR[n.id])+'</p>':'')
      +'<button class="mbtn main" data-act="jduel" data-v="'+n.id+'">'+(done?'Duel again':lost?'Try again':'Duel')+'</button><p class="jfree">'+(done?'A friendly rematch.':'Losing costs nothing. You may try as often as you like.')+'</p>'
      +(done?(()=>{const hd=hardOf(n),tw=st.trade[n.id]?null:tradeOf(n);return (st.hard[n.id]?'<p class="jdone">Beaten on '+sFill('{his}',n)+' own terms.</p>':'<button class="mbtn" data-act="jhard" data-v="'+n.id+'">On '+sFill('{his}',n)+' terms</button><p class="jfree">'+sFill('{He}',n)+' begins with '+hd.life+' more life'+(hd.thing?' and a '+esc(hd.thing)+' in play':'')+'. The first win pays 40 ink.</p>')+(tw?'<button class="mbtn" data-act="jtrade" data-v="'+n.id+'"'+(PF.gold<25?' disabled':'')+'>Buy “'+esc(tw)+'” for 25 ink</button><p class="jfree">One word from '+sFill('{his}',n)+' own hand, once.</p>':'');})():'')
      :'<p class="jshut">'+(n.gate?'The gate is far off yet.':'You cannot reach this yet.')+'</p>');}
/* ---- the opening: context, your name, and a walk through the house in first person ---- */
const OPFALL={1:'assets/bgp/roux.jpg',2:'assets/bgp/roux.jpg',3:'assets/bgp/roux.jpg',4:'assets/sc/roux_1.jpg',5:'assets/sc/roux_1.jpg',6:'assets/sc/roux_1.jpg',7:'assets/sc/roux_1.jpg'},opOk={};
function opImg(k){if(k==='r1')return['assets/sc/roux_1.jpg',0];if(k==='r2')return['assets/sc/roux_2.jpg',0];if(!k)return['',0];return opOk[k]?['assets/op/'+k+'.jpg',0]:[OPFALL[k],1];}
function opSteps(){const nm=(PF.me&&PF.me.name)||'Apprentice',d=PF.opd||{},R='Anselm Roux';return [
 {k:'card',x:'In this country every word has a number, and every number has an owner. Tonight they come to number you.'},
 {k:'title'},
 {k:'name'},
 {k:'card',v:1,x:'“'+nm+'! He wants you. Now.”'},
 {k:'shot',im:1,blink:1,x:'The attic. The dead of night. Seven years under this beam.'},
 {k:'shot',im:2,x:'Twelve copybooks. Twelve words. He never let you learn a thirteenth.'},
 {k:'shot',im:3,x:'The stove is lit. He never lights it at night.'},
 {k:'shot',im:4,x:'Every jar has his label on it. Under each label, an older one, crossed out.'},
 {k:'choice',im:5,key:'door',x:'His door.',opts:[['Knock.','k'],['Walk in.','w']]},
 {k:'say',band:1,im:'r1',who:R,x:d.door==='w'?'“Seven years and still no knock. Sit down, '+nm+'.”':'“You knocked. Good. Sit down, '+nm+'.”'},
 {k:'say',im:'r1',who:R,x:'“Your term ended at midnight. I checked the paper twice. You are nobody’s apprentice tonight, and that will not last.”'},
 {k:'say',im:'r2',who:R,x:'“You know what the Measurers do. They gave every word a number so that no miller could sell a short sack. It worked. I helped them do it.”'},
 {k:'choice',im:'r2',key:'q1',who:R,x:'“Now Aurel Voss wants to finish the job. Every word fixed, every meaning owned, nobody permitted to teach one differently. He calls it keeping the world safe. He means keeping it still.”',opts:[['“What has that to do with me?”','a'],['“You helped them?”','b'],['Say nothing.','c']]},
 {k:'say',im:'r2',who:R,x:'“By morning you will be assessed, numbered and placed. Unless you are already on the road. There is an old right, older than their ledgers: a traveller may win a word from anyone who will duel for it in the open. They have not dared strike it out.”'},
 {k:'say',im:'r1',who:R,x:'“So you will walk. You will win words from people who use them for a living. A charcoal burner. A fen-wife. A man who keeps a gate. Each will teach you what their word does when it is not on a shelf.”'},
 {k:'choice',im:'r2',key:'q2',who:R,x:'“And ask after the Alchemist. Whoever finishes the sentence decides what the rest of us were for. I would like it to be someone who has been rained on.”',opts:[['“Why me?”','a'],['“Why now?”','b']]},
 d.q2==='b'?{k:'say',im:'r2',who:R,pre:'He looks at the paper on the bench, then turns it face down.',x:'“Because tonight is the last night I can choose.”'}:{k:'say',im:'r2',who:R,x:'“Because you are the only pupil I have, and I taught you twelve words properly instead of two hundred badly.”'},
 {k:'cards',im:6,x:'He lays out twelve cards. The apprentice’s dozen. Not copies this time. The words themselves.'},
 {k:'say',im:'r2',who:R,x:'“One more. You will get sure of yourself out there. This is the cure.”'},
 {k:'say',im:7,who:R,x:'“It is made of every meaning the Measurers threw out. It carries, it barters, it argues. It will sell you words for ink, and it will tell you when you are wrong.”'},
 {k:'say',im:7,who:'The magpie',x:'“You may buy a word from me. Whether you understand it remains inconveniently separate.”'},
 {k:'fam',im:7},
 {k:'say',im:'r2',who:R,x:'“Now. Before you go, show me that twelve words taught you something. Sit.”'}
 ];}
function openRun(){let e=document.getElementById('opn');if(e)return;const st=sSt();st.chap=st.chap||{};st.chap.p=1;PF.op=PF.op||0;PF.opd=PF.opd||{};
  e=document.createElement('div');e.id='opn';e.setAttribute('role','dialog');e.setAttribute('aria-label','The opening');
  e.innerHTML='<i class="op-bg"></i><i class="op-bg"></i><i class="op-sh"></i><i class="op-bars"></i><i class="op-lid a"></i><i class="op-lid b"></i><div class="op-body"></div><button class="op-skip" data-op="skip">Skip the opening</button>';document.body.appendChild(e);
  for(let k=1;k<=7;k++){const im=new Image();im.onload=()=>{opOk[k]=(im.naturalWidth/Math.max(1,im.naturalHeight));const s=opSteps()[PF.op];if(s&&s.im===k)opBg(s,true);};im.src='assets/op/'+k+'.jpg';}
  ['assets/sc/roux_1.jpg','assets/sc/roux_2.jpg','assets/bgp/roux.jpg'].forEach(jPre);
  e.addEventListener('click',ev=>{const b=ev.target.closest('[data-op]');if(b){ev.stopPropagation();opAct(b.dataset.op,b.dataset.v);return;}if(ev.target.closest('input,.op-cards'))return;opNext();});
  opDraw();}
addEventListener('keydown',ev=>{const e=document.getElementById('opn');if(!e)return;if(/INPUT/.test((ev.target||{}).tagName||'')){if(ev.key==='Enter'){ev.preventDefault();const b=e.querySelector('[data-op=name],[data-op=fam]');if(b)b.click();}ev.stopPropagation();return;}if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();ev.stopPropagation();opNext();}},true);
let opCur='';
function opBg(s,force){const e=document.getElementById('opn');if(!e)return;const [u,stand]=opImg(s.im),key=u+'|'+stand;if(key===opCur&&!force)return;opCur=key;const ls=e.querySelectorAll('.op-bg'),on=e.querySelector('.op-bg.on'),nx=on===ls[0]?ls[1]:ls[0];
  if(on){on.classList.remove('on');on.classList.add('out');}const wd=typeof s.im==='number'&&opOk[s.im]>2;e.classList.toggle('band',wd);nx.className='op-bg'+(stand?' stand':'')+(wd?' wd':'');nx.style.backgroundImage=u?'url('+u+')':'none';void nx.offsetWidth;nx.classList.add('on');}
function opDraw(){const e=document.getElementById('opn');if(!e)return;const S=opSteps();if(PF.op>=S.length){opEnd();return;}const s=S[PF.op],b=e.querySelector('.op-body');
  e.dataset.k=s.k;e.classList.toggle('bars',!!s.band||s.k==='cards');if(s.k==='cards'){const at=PF.op;setTimeout(()=>{if(PF.op===at&&e.isConnected)e.classList.remove('bars');},1500);}opBg(s);e.classList.toggle('blink',!!s.blink);if(s.blink){e.classList.remove('blink');void e.offsetWidth;e.classList.add('blink');}
  const go='<i class="op-go" aria-hidden="true"></i>',kick='<small class="op-k">Emberwick</small>';
  let h='';
  if(s.k==='card')h='<div class="op-card'+(s.v?' v':'')+'"><i class="op-em"></i><p>'+esc(s.x)+'</p>'+go+'</div>';
  else if(s.k==='title')h='<div class="op-card t"><i class="op-em big"></i><small>Prologue</small><h1>The Twelve Words</h1><i class="ch-rule"></i>'+go+'</div>';
  else if(s.k==='name')h='<div class="op-card"><p>Someone is calling your name up the stairs. What is it?</p><div class="op-in"><input id="op-name" type="text" maxlength="14" autocomplete="off" placeholder="Your name" aria-label="Your name"><button class="rbtn" data-op="name"><span>That is my name</span></button></div></div>';
  else if(s.k==='shot')h='<div class="op-tx">'+kick+'<p class="n">'+esc(s.x)+'</p>'+go+'</div>';
  else if(s.k==='say')h='<div class="op-tx">'+kick+(s.pre?'<p class="n">'+esc(s.pre)+'</p>':'')+'<b class="op-who">'+esc(s.who)+'</b><p>'+esc(s.x)+'</p>'+go+'</div>';
  else if(s.k==='choice')h='<div class="op-tx">'+kick+(s.who?'<b class="op-who">'+esc(s.who)+'</b><p>'+esc(s.x)+'</p>':'<p class="n">'+esc(s.x)+'</p>')+'<div class="op-opts">'+s.opts.map(o=>'<button class="jtk-o op-o" data-op="pick" data-v="'+o[1]+'"><b>'+esc(o[0])+'</b></button>').join('')+'</div></div>';
  else if(s.k==='cards')h='<div class="op-tx">'+kick+'<p class="n">'+esc(s.x)+'</p>'+go+'</div><div class="op-cards">'+STARTER.map((w,i)=>'<div class="card mini static '+W[w].t+'" style="--k:'+i+'" data-pv="'+esc(w)+'">'+miniFace(w,{ink:W[w].syl})+'</div>').join('')+'</div>';
  else if(s.k==='fam')h='<div class="op-tx">'+kick+'<p class="n">The magpie looks at you, then at your pockets. What is its name?</p><div class="op-in"><input id="op-fam" type="text" maxlength="14" autocomplete="off" placeholder="Its name" aria-label="Name your magpie"><button class="rbtn" data-op="fam"><span>Name the magpie</span></button></div></div>'+(opImg(7)[1]?'<img class="op-famimg" src="assets/fam.jpg" alt="">':'');
  b.innerHTML=h;b.classList.remove('in');void b.offsetWidth;b.classList.add('in');opFit();const i=b.querySelector('input');if(i)setTimeout(()=>{try{i.focus();}catch(x){}},80);}
function opFit(){const c=document.querySelector('#opn .op-cards');if(!c)return;const W=innerWidth,H=innerHeight,s=Math.max(W/1536,H/1024),ox=(W-1536*s)/2,oy=(H-1024*s)/2;let w=Math.min(620*s,W-24),g=Math.round(w*.018),col=(w-5*g)/6,l=Math.max(12,Math.min(W-w-12,ox+610*s-w/2));c.style.gridTemplateColumns='repeat(6,'+col.toFixed(1)+'px)';c.style.gap=g+'px';c.style.left=l+'px';c.style.top=(oy+592*s)+'px';c.style.right='auto';}
addEventListener('resize',()=>{try{opFit();}catch(e){}});
function opNext(){const e=document.getElementById('opn');if(!e)return;const s=opSteps()[PF.op];if(!s||s.k==='name'||s.k==='fam'||s.k==='choice')return;PF.op++;save();try{sfx('page');}catch(x){}opDraw();}
function opAct(a,v){const clean=x=>{x=(x||'').trim().replace(/[<>&"{}]/g,'').slice(0,14);return x?x.charAt(0).toUpperCase()+x.slice(1):'';};
  if(a==='skip'){const e=document.getElementById('opn');if(e)e.remove();PF.pro=1;delete PF.op;save();renderAll();return;}
  if(a==='name'){const n=clean(document.getElementById('op-name').value);if(!n){document.getElementById('op-name').focus();return;}meSt().name=n;}
  else if(a==='fam'){const n=clean(document.getElementById('op-fam').value);if(!n){document.getElementById('op-fam').focus();return;}PF.fam={name:n,d:today()};}
  else if(a==='pick'){const s=opSteps()[PF.op];PF.opd[s.key]=v;}
  PF.op++;save();try{sfx(a==='pick'?'tick':'shimmer');}catch(x){}opDraw();}
function opEnd(){const e=document.getElementById('opn');PF.pro=1;delete PF.op;save();if(e){e.classList.add('bye');setTimeout(()=>e.remove(),700);}renderAll();setTimeout(()=>{try{storyStart('roux');}catch(x){}},420);}
function popHtml(){let e=document.getElementById('jpop');const hadTalk=!!(e&&e.querySelector('.jpbox.talk'));if(e)e.remove();
  if(view==='story'&&!PF.pro&&!jS.pop){openRun();return;}
  if(0){e=document.createElement('div');e.id='jpop';
    e.innerHTML='<div class="jpbox wide"><small>Emberwick · the scriptorium</small><h2>The apprentice’s dozen</h2><p>For seven years you have ground ink for Anselm Roux and copied the same twelve words until your hand knew them without you: the things on his shelves, the two elements under his still, and the plain verbs of the bench.</p><div class="jdozen">'+STARTER.map(w=>'<div class="card mini static '+W[w].t+'" data-pv="'+esc(w)+'">'+miniFace(w,{ink:W[w].syl})+'</div>').join('')+'</div><p>They are all you own. Every other word in the world belongs to someone who will have to be persuaded to teach it.</p><button class="btn" data-act="jpro">Take up your hoard</button></div>';
    document.body.appendChild(e);return;}
  if(view==='story'&&PF.pro&&!(PF.me&&PF.me.name)&&!jS.pop){e=document.createElement('div');e.id='jpop';
    e.innerHTML='<div class="jpbox"><small>Emberwick · the scriptorium</small><h2>Your name</h2><img class="jfam" src="assets/player.jpg" alt=""><p>For seven years Anselm Roux has called you “apprentice”. On the road, people will want something to call you.</p><div class="jans"><input id="j-name" type="text" maxlength="14" autocomplete="off" placeholder="Your name" aria-label="Your name"><button class="btn" data-act="jname">That is my name</button></div><p class="jfree">It is written in your journal and spoken by those you meet.</p></div>';
    document.body.appendChild(e);const i=e.querySelector('#j-name');i.focus();i.addEventListener('keydown',ev=>{if(ev.key==='Enter')e.querySelector('[data-act=jname]').click();});return;}
  if(view==='story'&&!PF.fam&&!jS.pop){e=document.createElement('div');e.id='jpop';
    e.innerHTML='<div class="jpbox"><small>Emberwick · the scriptorium</small><h2>A parting gift</h2><img class="jfam" src="assets/fam.jpg" alt=""><blockquote>You will need someone to fetch and carry on the road. She was hatched in my rafters and she has stolen from me for seven years. Now she can steal for you.</blockquote><p>Anselm Roux gives you a <b>magpie</b>. In every duel she brings you words to buy with the ink you earn.</p><div class="jans"><input id="j-fam" type="text" maxlength="14" autocomplete="off" placeholder="Name her" aria-label="Name your magpie"><button class="btn" data-act="jfam">Name her</button></div><p class="jfree">A name, once given, cannot be changed.</p></div>';
    document.body.appendChild(e);const i=e.querySelector('#j-fam');i.focus();i.addEventListener('keydown',ev=>{if(ev.key==='Enter')e.querySelector('[data-act=jfam]').click();});return;}
  const p=jS.pop;if(!p||view!=='story')return;const n=sNode(p.id);if(!n)return;e=document.createElement('div');e.id='jpop';
  const card=w=>'<div class="jpc'+(isAlive(w)?'':' unsp')+'">'+fullFace(w,{ink:W[w].syl,lv:PF.up[w]||0,up:PF.up})+'</div>',who=n.who?n.who.n:n.place;
  let h='',wide=false,talk=false;const st=sSt(),mag='<p class="jmag"><img src="assets/fam.jpg" alt=""><span><b>'+esc(famName(true))+'</b> “'+esc(famSay())+'”</span></p>',opt=(act,i,lab,fx,dis)=>'<button class="jopt" data-act="'+act+'" data-v="'+i+'"'+(dis?' disabled':'')+'><b>'+esc(sFill(lab,n))+'</b><span>'+esc(fx)+(dis?' · you have not the ink':'')+'</span></button>';
  if(p.kind==='parley'){const tk=(TALK[n.id]||TALKG),said=p.said,bg=BGP[bgOf(n.id)]?'assets/bgp/'+bgOf(n.id)+'.jpg':'';talk=true;
    h=jScene({bg,shots:(SHOTS[n.id]||[]).map(k=>'assets/sc/'+n.id+'_'+k+'.jpg'),them:{img:rvImg({p:n.who.p}),name:n.who.n,role:n.who.role},kicker:n.place,still:!!said,beats:(OPEN[n.id]&&!sSt().done[n.id]?(xsOk(n.id)?[{t:'n',x:XS[n.id],sh:xsU(n.id,3)}]:[]).concat([].concat(OPEN[n.id]).map((x,k)=>xsOk(n.id)?{t:'n',x,sh:xsU(n.id,k?4:3)}:{t:'n',x,sh:sh2(n.id,1)})):[]).concat(greet(n,1).map(x=>xsOk(n.id)?{t:'them',x,sh:xsU(n.id,2)}:{t:'them',x,sh:sh2(n.id,2)})).concat(said?[{t:'me',x:sFill(tk[said][0],n),cls:' new'},{t:'them',x:sFill(tk[said][1],n),cls:' new late'}].concat(p.tw!=null&&PTWISTS[p.tw]?[{t:'n',x:sFill(PTWISTS[p.tw].x,n),cls:' new late'}]:[]):[]),
     foot:(said?'<p class="jtk-fx">'+esc(sFill(STANCEFX[said],n))+(p.tw!=null&&PTWISTS[p.tw]?' \u00b7 '+esc(fxText(PTWISTS[p.tw].fx)):'')+'</p><button class="btn jtk-go" data-act="jsit">Sit down at the table</button>'
       :'<small class="jtk-ask">You say</small><div class="jtk-opts">'+STANCES.map(s=>'<button class="jtk-o" data-act="jsay" data-v="'+s+'"><b>'+esc(sFill(tk[s][0],n))+'</b></button>').join('')+'</div>')
     +'<button class="lnk" data-act="jpopx">'+(said?'Not now':'Say nothing and step back')+'</button>'});}
  else if(p.kind==='event'){const E=EVENTS[n.id];talk=true;h=jScene({bg:'assets/ev/'+n.id+'.jpg',kicker:E.t,beats:jBeats(sFill(E.x,n)).concat([{t:'fam',x:'\u201c'+famSay()+'\u201d'}]),
     foot:'<small class="jtk-ask">What do you do?</small><div class="jtk-opts c'+E.o.length+'">'+E.o.map((o,i)=>{const dis=o[2].gold<0&&PF.gold<-o[2].gold;return '<button class="jtk-o" data-act="jev" data-v="'+i+'"'+(dis?' disabled':'')+'><b>'+esc(sFill(o[0],n))+'</b>'+(dis?'<i>you have not the ink</i>':'')+'</button>';}).join('')+'</div>'});}
  else if(p.kind==='evdone'){const E=EVENTS[n.id],o=E.o[p.i];talk=true;h=jScene({bg:'assets/ev/'+n.id+'.jpg',kicker:E.t,still:1,beats:[{t:'me',x:sFill(o[0],n),cls:' new'}].concat(jBeats(sFill(o[1],n)).map(x=>Object.assign(x,{cls:' new late'}))).concat(p.tw!=null&&TWISTS[p.tw]?[{t:'n',x:sFill(TWISTS[p.tw].x,n),cls:' new late'}]:[]),
     foot:'<p class="jtk-fx">'+esc(fxText(o[2]))+(p.tw!=null&&TWISTS[p.tw]?' \u00b7 '+esc(fxText(TWISTS[p.tw].fx)):'')+'</p><button class="btn jtk-go" data-act="jpopx">Ride on</button>'});}
  else if(p.kind==='toll'){talk=true;h=jScene({bg:TK[n.id]?tkImg(n.id,'_l'):FDART[n.id]?'assets/fd/'+n.id+'.jpg':'',them:{img:TK[n.id]?tkImg(n.id):fdImg(n,1),name:n.puz.mark,role:n.place},beats:jBeats(n.text),
     foot:'<small class="jtk-ask">You say</small><div class="jtk-opts c2"><button class="jtk-o" data-act="jtollgo"><b>Let me show you.</b><i>choose a hand from your own deck</i></button><button class="jtk-o" data-act="jpopx"><b>Not yet. I will come back.</b><i>nothing is lost by waiting</i></button></div>'});}
  else if(p.kind==='tell'){talk=true;h=jScene({bg:p.bg||'',them:p.them||null,kicker:p.k,beats:p.letter?[]:p.beats,foot:(p.letter?'<div class="jletter">'+esc(sFill(p.letter,n))+'<img class="jseal" src="assets/lt/seal.webp" alt=""></div>':'')+'<button class="btn jtk-go" data-act="jtellx">'+esc(p.btn||'Go on')+'</button>'});}
  else if(p.kind==='oracle'&&st.orc){h=rwPick({k:'The oracle glass',t:'Three words rise',sub:'You may keep one. The others sink back into the glass.',opts:st.orc,card,act:'jorcpick'});}
  else if(p.kind==='oracle'){talk=true;const o=st.orc;h=jScene({kicker:'The oracle glass',beats:o?[{t:'n',x:'Three words rise in the glass. You may keep one. The others sink.'}]:[{t:'n',x:'A ball of dark glass, wrapped in the magpie\u2019s own feathers. For ink it shows three words you do not know. You keep one.'},{t:'fam',x:'\u201cIt shows what it likes. I only carry it.\u201d'}],
     foot:o?'<div class="jpick">'+o.map(w=>'<button data-act="jorcpick" data-v="'+esc(w)+'" aria-label="Keep '+esc(w)+'">'+card(w)+'</button>').join('')+'</div>':'<div class="jtk-opts c2"><button class="jtk-o" data-act="jorclook"'+(PF.gold>=ORC?'':' disabled')+'><b>Look into the glass.</b><i>'+ORC+' ink'+(PF.gold>=ORC?'':' \u00b7 you have not the ink')+'</i></button><button class="jtk-o" data-act="jpopx"><b>Not now.</b><i>you have '+PF.gold+' ink</i></button></div>'});}
  else if(p.kind==='gift'){talk=true;const w=p.w;h=jScene({bg:'assets/ev/gift.jpg',them:{img:rvImg({p:20}),name:'Joan Bell',role:'For the Order of the Unfinished Vessel'},kicker:'The Unfinished House',beats:[{t:'n',x:'Walls, a roof, an open door and no master\u2019s chair. The stove bricks from Emberwick are warm. Roux stands among the witnesses and says nothing.'},{t:'them',x:'The Alchemist was to own every word. We ask the opposite. Give one away, for good, and let someone else use it while you only watch.'},{t:'them',x:w?'Your best word is \u201c'+w+'\u201d. It will leave your deck and your hoard. You will remember it. It will not answer to you again.':'You carry no word strong enough to matter. Then give us your hands instead.'},{t:'n',x:'Tobias has come to be the first to use it. Then you must choose what kind of keepers there should be.'}],
     foot:'<small class="jtk-ask">'+(w?'You give away \u201c'+esc(w)+'\u201d, and then':'Then')+'</small><div class="jtk-opts c2"><button class="jtk-o" data-act="jgift" data-v="A"><b>Join the Order, and keep its door open.</b><i>a keeper among keepers: safer, and nearer to power</i></button><button class="jtk-o" data-act="jgift" data-v="B"><b>Refuse the Order. Set the table in the road.</b><i>everyone may copy the work: freer, slower, and nobody to rescue you</i></button></div><button class="lnk" data-act="jpopx">Not yet. I am not ready to give it up.</button>'});}
  else if(p.kind==='letter'){const L=LETTERS[n.id];h='<small>A letter finds you at '+esc(n.place)+'</small><h2>From your master</h2><div class="jletter">'+esc(sFill(L.x(st),n))+'<img class="jseal" src="assets/lt/seal.webp" alt=""></div><p>How do you answer?</p><div class="jopts">'+L.o.map((o,i)=>opt('jlet',i,o[0],'')).join('')+'</div>';}
  else if(p.kind==='letdone'){const o=LETTERS[n.id].o[p.i];h='<small>Some days later</small><img class="jlt" src="assets/lt/letter.webp" alt=""><h2>His answer</h2><p>'+esc(sFill(o[1],n))+'</p>'+(p.tw!=null&&LTWISTS[p.tw]?'<p><em>'+esc(LTWISTS[p.tw].x)+'</em></p>':'')+'<p class="jfx">'+esc([fxText(o[2]),p.tw!=null&&LTWISTS[p.tw]?fxText(LTWISTS[p.tw].fx):''].filter(Boolean).join(' \u00b7 '))+'</p><button class="btn" data-act="jpopx">Go on</button>';}
  else if(p.kind==='pickhand'){const ws=[...new Set(PF.deck)].filter(w=>W[w]);wide=true;h='<small>'+esc(n.place)+'</small><h2>Choose your hand</h2><p>'+esc(n.puz.goal)+' Pick up to seven words from your deck to take in with you.</p><div class="jdozen jph">'+ws.map(w=>'<button class="card mini static '+W[w].t+(p.sel.includes(w)?' on':'')+'" data-act="jph" data-v="'+esc(w)+'" aria-pressed="'+p.sel.includes(w)+'">'+miniFace(w,{ink:W[w].syl,lv:PF.up[w]||0,up:PF.up})+'</button>').join('')+'</div><p class="jfx">'+p.sel.length+' of 7 chosen</p><div class="jans" style="justify-content:center;display:flex;gap:10px"><button class="btn" data-act="jphgo"'+(p.sel.length?'':' disabled')+'>Go in</button><button class="btn ghost" data-act="jpopx">Not yet</button></div>';}
  else if(p.kind==='found'&&n.show){talk=true;h=jScene({bg:TK[n.id]?tkImg(n.id,'_l'):FDART[n.id]?'assets/fd/'+n.id+'.jpg':'',them:{img:TK[n.id]?tkImg(n.id):fdImg(n,1),name:n.puz.mark,role:n.place},beats:[{t:'them',x:TOLLOK[n.id]||'Then go through.'},{t:'n',x:n.lesson}],foot:(p.first?'<p class="jtk-fx">The road is open \u00b7 +15 ink \u00b7 +1 step forward</p>':'')+'<button class="btn jtk-go" data-act="jpopx">Take the road</button>'});}
  else if(p.kind==='found')h='<small>'+esc(n.place)+'</small><h2>'+(n.show?'Let through':p.first?'Found on the road':'Done again')+'</h2>'+(p.first&&n.show?'<p class="jfx">The road is open · +15 ink · +1 step forward</p>':p.first?'<div class="jpick">'+n.words.filter(w=>!W[w].token).map(w=>jrune(w,card(w))).join('')+'</div><p>'+n.words.map(w=>'<b>'+esc(w)+'</b>').join(' and ')+(n.words.length>1?' are':' is')+' in your hoard and your deck.'+(n.rx?' The reaction is written in your Grimoire.':'')+'</p><p class="jfx">+15 ink · +1 step forward</p>':'')+(INS[n.id]?'<p class="jins">\u201c'+esc(INS[n.id][1])+'\u201d</p>':'')+'<blockquote>'+esc(n.lesson)+'</blockquote><button class="btn" data-act="jpopx">Back to the road</button>';
  else if(p.kind==='learn')h='<small>'+esc(n.place)+'</small><h2>A word is given</h2>'+jrune(p.w,card(p.w))+'<p>'+esc(who)+' taught you <b>'+esc(p.w)+'</b>. It is in your hoard'+(PF.deck.includes(p.w)?' and your deck':'')+'.</p>'+(n.lines?'<blockquote>'+esc(n.lines.win)+'</blockquote>':'')+(n.id==='hale'?'<div class="jcrack"><small>The Chronicle \u00b7 one more line, in no hand you know</small><b>The winner inherits the speaker.</b><span>Nobody at the table said it.</span></div>':'')+'<button class="btn" data-act="jpopx">Take it and go on</button>';
  else if(p.kind==='pick')h=rwPick({k:n.place,t:'Take your pick',sub:n.lines.win,opts:p.opts,card,act:'jpick'});
  else if(p.kind==='glimpse')h='<small>'+esc(n.place)+'</small><h2>Beaten, but not empty-handed</h2><blockquote>'+esc(n.lines.lose)+'</blockquote><p>You marked a word in '+esc(who.split(' ')[0])+'’s hand that you do not own:</p>'+jrune(p.w,card(p.w))+'<button class="btn" data-act="jpopx">Back to the road</button>';
  else if(p.kind==='lost')h='<small>'+esc(n.place)+'</small><h2>Beaten</h2><blockquote>'+esc(n.lines.lose)+'</blockquote><button class="btn" data-act="jpopx">Back to the road</button>';
  else h='<small>'+esc(n.place)+'</small><h2>'+(p.hard?'Beaten on '+sFill('{his}',n)+' own terms':'Well fought')+'</h2><blockquote>'+esc(n.lines?n.lines.win:'')+'</blockquote>'+(p.hard?'<p class="jfx">+40 ink</p>':'')+'<button class="btn" data-act="jpopx">Back to the road</button>';
  if(p.boast)h=h.replace('<button class="btn" data-act="jpopx">','<p class="jfx">+10 ink for making good your boast</p><button class="btn" data-act="jpopx">');
  e.innerHTML='<div class="jpbox'+(wide?' wide':'')+(p.kind==='parley'||talk?' talk':'')+'">'+h+'</div>';if(hadTalk&&e.querySelector('.jpbox.talk'))e.classList.add('steady');document.body.appendChild(e);{const r=e.querySelector('.jst');if(r)jstShot(r);}}
function afterWin(id){const st=sSt(),A=AFTER[id],n=sNode(id);if(!A||!n||(st.aft=st.aft||{})[id])return false;st.aft[id]=1;st.log.push({n:id,r:'note',d:today(),x:A.know});jS.pop={kind:'tell',id,bg:'assets/sc/'+id+'_2.jpg',them:{img:rvImg({p:n.who.p}),name:n.who.n,role:n.who.role},k:n.place,beats:A.beats.map(x=>typeof x==='string'?{t:'them',x,sh:xsOk(id)?xsU(id,2):''}:Object.assign({},x,{sh:xsOk(id)?xsU(id,5):''})),btn:A.btn||'Take the road'};return true;}
const AFTER={
 reeve:{beats:['\u201cTake the word, and leave something standing.\u201d',{t:'n',x:'He knocks a tin tag flat against a stump with the heel of his hand. There is a number stamped in it.'},'\u201cThey numbered you too, you know. A clerk came asking the week before you did.\u201d'],know:'The Measurers\u2019 relief saved Reeve\u2019s crew and cost him the grove. A clerk was asking about you a week before you left Emberwick.'},
 ashdown:{beats:['\u201cYou may know a thing before you know what to call it.\u201d',{t:'n',x:'She pulls the eel traps back over the herb rack. A tin tag hangs from the rack on a wire, face to the wall.'},'\u201cThat clerk asked what your master taught you. I said twelve words. He wrote down \u2018twelve\u2019 and looked pleased.\u201d'],know:'A herb with no name of its own cannot be registered, so it cannot lawfully be used. The Measurers already know exactly how many words you carry.'},
 quill:{beats:['\u201cYou chose well. I intend to make the others sufficient.\u201d',{t:'n',x:'He folds the printed sheet he was copying from. Your name is on it.'},'\u201cThe sheet says you belong to a research indenture. I do not know what that is. I do know they pay for people who do.\u201d',{t:'n',x:'He puts the sheet inside his coat. He does not offer it to you.'}],know:'There is a printed sheet with your name on it, and the words \u201cresearch indenture\u201d. Tobias Quill kept it. He means to earn a Measurer\u2019s certificate.'},
 thorne:{beats:['\u201cCarry one voice out of here while you can.\u201d',{t:'n',x:'She tamps the earth down on the opened grave. The stone above it has a tin tag where the inscription used to be.'},'\u201cIndenture? That is a word for selling time. Ask whose time, and who signed.\u201d'],know:'A word dies with its last speaker; the Measurers file it and call that keeping. An indenture is a sale of someone\u2019s time. Whose, and who signed?'},
 hale:{btn:'Take the tag and go through',beats:[{t:'n',x:'He raises the bar. Then he turns the gate ledger round on the table so that you can read it.'},{t:'n',x:'Your name is already there, in the property column, with a number and one line: held under indenture, A. Roux, seven years; to be assessed.'},'\u201cYou have the road. I cannot vouch for its account of you.\u201d',{t:'n',x:'There is a tin tag on the table that he has not nailed up. He puts it in your hand instead.'},{t:'n',x:'That night there is one more line in your journal, in no hand you know: The winner inherits the speaker. Nobody at the table said it.'}],know:'The Black Gate ledger lists you as property: held under indenture, A. Roux, seven years; to be assessed. Roux signed for you. You carry the tag Hale would not nail up.'}};
function storyAct(a,el){const st=sSt();
  if(a==='jpro'){PF.pro=1;save();sfx('page');renderStory();return true;}
  if(a==='jfam'){const v=($('j-fam').value||'').trim().replace(/[<>&"]/g,'').slice(0,14);if(!v){$('j-fam').focus();return true;}PF.fam={name:v.charAt(0).toUpperCase()+v.slice(1),d:today()};save();sfx('shimmer');renderStory();return true;}
  if(a==='jname'){const v=($('j-name').value||'').trim().replace(/[<>&"{}]/g,'').slice(0,14);if(!v){$('j-name').focus();return true;}meSt().name=v.charAt(0).toUpperCase()+v.slice(1);save();sfx('shimmer');renderStory();return true;}
  if(a==='jnext'){const r=el.closest('.jst');if(!r)return true;const i=+r.dataset.i,n=r.querySelectorAll('.jst-l').length;if(i>=n-1)return true;r.dataset.i=i+1;jstShow(r);sfx('tick');return true;}
  if(a==='jsay'){jS.pop.said=el.dataset.v;jS.pop.tw=parleyTwist(jS.pop.id);sfx('quill');renderStory();return true;}
  if(a==='jsit'){const id=jS.pop.id,v=jS.pop.said;jS.pop=null;{const e=document.getElementById('jpop');if(e)e.remove();}save();storyStart(id,v);return true;}
  if(a==='jph'){const p=jS.pop,w=el.dataset.v,i=p.sel.indexOf(w);if(i>=0)p.sel.splice(i,1);else if(p.sel.length<7)p.sel.push(w);else{sfx('nope');return true;}sfx('tick');el.classList.toggle('on',p.sel.includes(w));el.setAttribute('aria-pressed',p.sel.includes(w));const bx=el.closest('.jpbox'),c=bx.querySelector('.jfx'),g=bx.querySelector('[data-act=jphgo]');if(c)c.textContent=p.sel.length+' of 7 chosen';if(g)g.disabled=!p.sel.length;return true;}
  if(a==='jphgo'){const p=jS.pop;if(p&&p.sel.length)findStart(p.id,p.sel);return true;}
  if(a==='jfind'&&el.dataset.v==='d_house'){if(!sOpen(sNode('d_house')))return true;if(st.end){jS.pop={kind:'tell',id:'d_house',k:'The Unfinished House',bg:'assets/fd/d_house.jpg',beats:[{t:'fam',x:'\u201cNow say the next word.\u201d'}],btn:'Go on'};renderStory();return true;}
    const bw=(st.asked&&st.asked!=='-'&&PF.deck.includes(st.asked))?st.asked:bestWord();st.at='d_house';jS.pop={kind:'gift',id:'d_house',w:bw};sfx('page');renderStory();return true;}
  if(a==='jgift'){const p=jS.pop,w=p.w,e=el.dataset.v;if(w){PF.deck=PF.deck.filter(x=>x!==w);PF.owned[w]=0;delete PF.up[w];st.gave=w;}st.end=e;st.done.d_house=Date.now();PF.gold+=100;PF.xp+=5;
    st.log.push({n:'d_house',r:'note',d:today(),x:(w?'Gave away the word \u201c'+w+'\u201d for good. Tobias used it, and I only watched. ':'')+(e==='A'?'Joined the Order, on condition that its lid stays where the smallest hand can reach it.':'Refused the Order and set the table in the road, for anyone.')});
    jS.pop=st.pend={kind:'tell',id:'d_house',k:e==='A'?'Keep the opening':'Set the table in the road',bg:'assets/fd/d_house.jpg',beats:(e==='A'?[{t:'n',x:'You join them, on your terms. Their methods are written up where anyone can read them. A closure must have a reason, a door, and a date to look at it again.'},{t:'n',x:'You stay through the first winter to keep the dykes mended. Voss carries bricks. Roux teaches in a room he does not own.'},{t:'them',x:'Leave the lid where the smallest hand can reach it.'}]:[{t:'n',x:'You refuse the chair, and the Order with it. The vessel, the tests and every recipe go out on the road for anyone to copy.'},{t:'n',x:'It is slower. One village fires a kiln wrong and loses its winter stores. Nobody comes to save them. They mend the recipe and send it on.'},{t:'them',x:'Write the mistake beside the recipe.'}]).concat([{t:'n',x:'The last word is not said. The magpie turns her head to the blank end of the sentence.'},{t:'fam',x:'\u201cNow say the next word.\u201d'}]),them:{img:e==='A'?rvImg({p:5}):rvImg({p:6}),name:e==='A'?'Joan Bell':'Tobias Quill',role:''},btn:'The road goes on'};save();sfx('shimmer');renderAll();achCheck();return true;}
  if(a==='jfind'){findStart(el.dataset.v);return true;}
  if(a==='jtellx'){const p=jS.pop;jS.pop=null;st.pend=null;if(p.cam&&sNode(p.cam)){jS.sel=p.cam;jS.cam=null;jS.wm=0;}if(p.then){jS.pop={kind:'parley',id:p.then};}save();sfx('stamp');renderAll();return true;}
  if(a==='jorc'){jS.pop={kind:'oracle',id:st.at};sfx('shimmer');renderStory();return true;}
  if(a==='jorclook'){if(PF.gold<ORC)return true;const pool=ALLWORDS.filter(w=>W[w]&&!W[w].token&&!PF.owned[w]&&!ORCNO.includes(w)),wt=w=>[0,5,4,2,1][tierOf(w)],o=[];while(o.length<3&&pool.length){let r=Math.random()*pool.reduce((s,w)=>s+wt(w),0),k=0;for(;k<pool.length-1;k++){r-=wt(pool[k]);if(r<=0)break;}o.push(pool.splice(k,1)[0]);}if(!o.length)return true;PF.gold-=ORC;st.orc=o;save();sfx('coin');renderAll();jS.pop={kind:'oracle',id:st.at};renderStory();return true;}
  if(a==='jorcpick'){const w=el.dataset.v;if(!W[w])return true;if(!st.orc||!st.orc.includes(w))return true;st.orc=null;sLearn(w,{place:'the oracle glass'});st.log.push({n:st.at,r:'note',d:today(),x:'Looked into the oracle glass and kept the word \u201c'+w+'\u201d.'});jS.pop=null;save();sfx('shimmer');renderAll();achCheck();return true;}
  if(a==='jtollgo'){const id=jS.pop.id;jS.pop={kind:'pickhand',id,sel:[]};sfx('page');renderStory();return true;}
  if(a==='jhard'){storyStart(el.dataset.v,null,true);return true;}
  if(a==='jtrade'){const n=sNode(el.dataset.v),w=n&&tradeOf(n);if(!w||PF.gold<25||st.trade[n.id])return true;PF.gold-=25;st.trade[n.id]=w;sLearn(w,n);st.log.push({n:n.id,r:'note',d:today(),x:'Bought the word “'+w+'” from '+n.who.n+' for 25 ink.'});jS.pop=st.pend={kind:'learn',id:n.id,w};save();sfx('coin');renderAll();return true;}
  if(a==='jev'){const id=jS.pop.id,i=+el.dataset.v,o=EVENTS[id].o[i];if(o[2].gold<0&&PF.gold<-o[2].gold)return true;st.ev[id]=i;sApply(id,o[2],o[3]);const tw=twistRoll(id);jS.pop=st.pend={kind:'evdone',id,i,tw};save();sfx('page');renderAll();return true;}
  if(a==='jlet'){const id=jS.pop.id,i=+el.dataset.v,o=LETTERS[id].o[i];st.let[id]=i;sApply(o[2].seenAt||id,o[2],o[3]);let ltw=null;if(Math.random()<.35){ltw=Math.floor(Math.random()*LTWISTS.length);sApply(id,LTWISTS[ltw].fx);}jS.pop=st.pend={kind:'letdone',id,i,tw:ltw};save();sfx('quill');renderAll();return true;}
  if(a==='jzoom'){const g=camGeo(),c=jS.cam;if(g&&c){const z0=c.z,z1=Math.max(1,Math.min(zMax(),z0*(el.dataset.v>0?1.25:.8))),mx=g.vw/2,my=g.vh/2;c.x=mx-(mx-c.x)*z1/z0;c.y=my-(my-c.y)*z1/z0;c.z=z1;camSet(true);}return true;}
  if(a==='jhome'){camTo(st.at,true);return true;}
  if(a==='jtab'){jS.tab=el.dataset.v;sfx('page');peekHide();renderStory();return true;}
  if(a==='jsel'){const id=el.dataset.v,n=sNode(id);const mv=st.at!==id;jS.sel=id;jS.reg=n.rg||0;sfx('tick');if(n&&sOpen(n))setTimeout(()=>{if(view==='story'&&jS.sel===id&&jS.tab==='map'&&sSt().at===id){jS.tab='here';renderStory();}},mv?1700:300);if(n&&sOpen(n)&&st.at!==id){jS.walk=st.at;st.at=id;save();sfx('page');if(EVENTS[id]&&!st.done[id]&&st.ev[id]==null)setTimeout(()=>{if(view==='story'&&!jS.pop&&jS.sel===id){jS.pop={kind:'event',id};renderStory();}},1300);}renderStory();return true;}
  if(a==='jduel'){const id=el.dataset.v,n=sNode(id);if(!n||!sOpen(n))return true;if(st.at!==id){st.at=id;}jS.pop=EVENTS[id]&&!st.done[id]&&st.ev[id]==null?{kind:'event',id}:{kind:'parley',id};
    if(id==='y_gate'&&!st.asked){const bw=bestWord();st.asked=bw||'-';if(bw)st.log.push({n:'y_gate',r:'note',d:today(),x:'Voss offered me the Alchemist\u2019s chair. He named my strongest word, \u201c'+bw+'\u201d, as the one that would be asked of me.'});
      jS.pop={kind:'tell',id,k:'At the Gold Gate',bg:'assets/ev/offer.jpg',them:{img:rvImg({p:16}),name:'Aurel Voss',role:'Assessor-General'},then:id,beats:[{t:'them',x:'Before we sit. I am offering you the chair you saw drawn in the reeds. The Alchemist: keeper of every word, for ever. Nothing would be lost again.'},{t:'them',x:bw?'Your strongest word is \u201c'+bw+'\u201d. If you refuse me, the people beyond this gate will one day ask you to give that word away. I only ask you to keep things.':'If you refuse me, the people beyond this gate will ask you to give things away. I only ask you to keep them.'},{t:'me',x:'Who lifts the lid? Who has to stay inside? And who says when it is finished?'},{t:'them',x:'I do. They do. And I do. Sit down.'}],btn:'Refuse, and sit down'};save();}
    sfx('page');renderStory();return true;}
  if(a==='jpopx'){const was=jS.pop;jS.pop=null;st.pend=null;if(was&&was.kind==='learn'&&afterWin(was.id)){save();sfx('page');renderStory();return true;}save();sfx(was&&was.kind==='parley'?'tick':'stamp');renderStory();achCheck();return true;}
  if(a==='jpick'){const n=sNode(jS.pop.id),w=el.dataset.v;if(!W[w])return true;sLearn(w,n);const l=st.log[st.log.length-1];if(l){l.first=1;l.w=w;}jS.pop={kind:'learn',id:n.id,w};st.pend=jS.pop;save();sfx('shimmer');renderStory();return true;}
  if(a==='jans'){const n=sNode(jS.sel),v=($('j-ans').value||'').trim().toLowerCase();if(!v)return true;if(n.ans.includes(v)){st.done[n.id]=Date.now();sLearn(n.word,n);st.log.push({n:n.id,r:'win',d:today(),first:1,w:n.word});jS.pop={kind:'learn',id:n.id,w:n.word};save();sfx('shimmer');}else{st.lost[n.id]=(st.lost[n.id]||0)+1;st.log.push({n:n.id,r:'miss',d:today()});save();sfx('nope');}renderStory();return true;}
  return false;}
const RIVALS=[{n:'Isolde Varn',p:1},{n:'Mara Ashdown',p:2},{n:'Edda Thorne',p:3},{n:'Sabine Okoro',p:4},{n:'Petra Lind',p:5},{n:'Tobias Quill',p:6},{n:'Corvin Hale',p:7},{n:'Lucan Reeve',p:8},{n:'Ibrahim Sol',p:9},{n:'Anselm Roux',p:10}],RVART=21;
const rivalOf=()=>(S&&S.rival)||{n:'The rival',p:0},rvImg=r=>r.img?r.img:RVART>=r.p&&r.p?INL['rv/'+r.p+'.jpg']:'assets/rival.jpg',rvName=()=>rivalOf().n;
function fresh(){
  const r=rankOf(PF.xp),p=perks(r);
  const rivalDeck=r<1?STARTER.concat(['owl','hemlock','strike','crush','guard','ancient']):RIVAL0.concat(pick(ALLWORDS.filter(w=>tierOf(w)<=p.tier&&!RIVAL0.includes(w)),Math.min(14,2*r)));
  S=newGame((Date.now()%2147483647)|0,{deck:PF.deck.slice(),up:Object.assign({},PF.up),ink:p.ink,hand:p.hand,maxVerbs:p.maxVerbs,life:QUICKLIFE-LIFE,rivalDeck,rivalLife:QUICKLIFE-LIFE+(r<1?0:Math.min(4,r))});S.quick=true;say(S,'A quick match: first to break the other. You both begin near '+QUICKLIFE+' life.');
  S.rules=14;S.log0=S.log.length;S.stat={kills:0,said:0};S.newF=[];prevHand=null;{const pool=RIVALS.filter(x=>RVART?x.p<=RVART:x.p<=5),rr=rankOf(PF.xp),k=Math.max(0,Math.min(RANKS.length-1,rr+Math.floor(Math.random()*3)-1));S.rival=Object.assign({rank:RANKS[k].n},pool[Math.floor(Math.random()*pool.length)]);}clearUi();
}
const QP=[{id:'win',t:'Win a match',goal:1,gold:20},{id:'rx',t:'Make 3 reactions',goal:3,gold:20},{id:'kill',t:'Destroy 5 of your opponent’s things',goal:5,gold:15},{id:'say',t:'Speak 15 sentences',goal:15,gold:10},{id:'play',t:'Finish 2 matches',goal:2,gold:15}],DAILY=25;
const today=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate();};
function quests(){if(!PF.q||PF.q.d!==today()||!Array.isArray(PF.q.l))PF.q={d:today(),l:pick(QP,3).map(x=>({id:x.id,n:0,done:false}))};return PF.q;}
function settle(){
  if(S.over==null||S.paid)return;
  const win=S.over===0,purse=Math.max(0,S.players[0].coins),before=rankOf(PF.xp);
  const qt=!!S.quit,fav=!qt&&win&&Math.random()<0.05,base=qt?0:Math.round((win?27:11)*(0.78+Math.random()*0.44)*(fav?3:1)),kept=qt?0:Math.min(purse,win?20:8),gold=base+kept,xp=qt?0:win?3:1;
  const stt=S.stat||{},inc={win:win?1:0,rx:Object.keys((S.rxDone||[{}])[0]).length,kill:stt.kills||0,say:stt.said||0,play:1},qd=[];if(qt)for(const k in inc)inc[k]=0;let bonus=0,daily=0;
  for(const q of quests().l){const def=QP.find(x=>x.id===q.id);if(!def||q.done)continue;q.n=Math.min(def.goal,q.n+(inc[q.id]||0));if(q.n>=def.goal){q.done=true;bonus+=def.gold;qd.push({t:def.t,gold:def.gold});}}
  if(win&&PF.dayWin!==today()){PF.dayWin=today();daily=DAILY;}
  PF.gold+=gold+bonus+daily;PF.xp+=xp;if(win)PF.wins++;else PF.losses++;
  if(!qt){const rounds=Math.max(1,Math.ceil(S.turn/2)),life=S.players[0].life,nrx=Object.keys((S.rxDone||[{}])[0]).length;PF.st=PF.st||{};{const pr=[],seen=(PF.st.matches||0)>2;if(win){if(PF.st.fast&&rounds<PF.st.fast)pr.push('Your fastest win yet: '+rounds+(rounds===1?' round':' rounds'));if(!PF.st.fast||rounds<PF.st.fast)PF.st.fast=rounds;if(seen&&life>(PF.st.hiLife||0)&&(PF.st.wins||0)>2)pr.push('Your healthiest win yet: '+life+' life left');}if(seen&&(stt.kills||0)>(PF.st.mKills||0))pr.push('Most things destroyed in one duel: '+stt.kills);if(seen&&nrx>(PF.st.mRx||0))pr.push('Most reactions in one duel: '+nrx);S.praise=pr[0]||'';}bump('matches');bump('earned',gold+bonus+daily);bump('quests',qd.length);if(daily)bump('days');bmax('mKills',stt.kills||0);bmax('mRx',nrx);
    if(win){bump('streak');bmax('best',PF.st.streak);if(rounds<=8)bump('win8');if(rounds<=6)bump('win6');if(rounds<=5)bump('win5');if(rounds<=4)bump('win4');if(rounds<=1)bump('win1r');if(life===1)bump('win1');if(life>=LIFE)bump('flawless');if(rounds>=20)bump('longWin');if(life<=5)bump('close');bmax('hiLife',life);if(!nrx)bump('plainWin');if(!stt.lost)bump('cleanWin');bump('wins');}else PF.st.streak=0;}
  else{PF.st=PF.st||{};PF.st.streak=0;}
  if(S.story&&!S.sdone){S.sdone=1;try{storyEnd();}catch(e){}}
  const after=rankOf(PF.xp);S.paid={fav,praise:S.praise||'',base,kept,gold:gold+bonus+daily,xp,rankUp:after>before?after:null,quests:qd,daily,found:(S.newF||[]).slice(0,4)};
  restock();save();
}

const ART={ordeal:50,abyss:50,tower:50,flux:50,orrery:50,masked:50,measure:50,resonant:50,sculpt:50,doubt:50,angel:50,gnosis:50,attractor:50,unnamed:50,scintilla:50,shepherdess:50,feral:50,lure:55,ash:50,steam:50,swamp:50,lava:50,dust:50,cloud:50,life:50,gunpowder:50,alchemist:50,wasp:47,scribe:50,spider:50,adder:45,hermit:45,magpie:48,thief:50,bat:50,smith:42,miser:50,scarab:38,egg:50,ink:50,elixir:50,knife:50,alkahest:50,dew:50,homunculus:50,word:50,time:50,plague:50,hunger:50,rumour:50,debt:50,omen:50,dream:50,memory:50,echo:50,drink:50,eat:50,awaken:50,temper:50,distil:50,ripen:50,name:50,petrify:50,transmute:50,volatile:50,fixed:50,hermetic:50,corrosive:50,torpid:50,sacred:50,thorny:50,feeble:50,leaden:50,brittle:50,abundance:50,lullaby:50,reckoning:50,avalanche:50,windfall:50,amnesty:50,foundry:50,pestilence:50,erosion:50,stammer:50,golem:50,daemon:50,desert:50,drought:50,harvest:50,winter:50,spring:50,flames:50,sleepers:50,liquids:50,stones:50,birds:50,pstone:50,gild:50,tame:50,wake:50,rust:50,cut:50,sting:50,bind:50,haunt:50,blind:50,steal:50,flood:50,noon:50,fog:50,storm:50,energy:50,rune:50,crown:50,dissolve:50,scream:50,loan:50,nemesis:50,muse:50,apothecary:50,salamander:50,scorpion:50,locust:50,radiant:50,winged:50,forget:50,phosphorus:50,clay:50,amber:50,lodestone:50,sand:50,stone:50,obsidian:50,ouroboros:50,pelican:50,phoenix:50,peacock:50,stag:50,cockatrice:50,boar:50,twin:50,quick:60,eternal:50,occult:62,vast:50,rue:50,saffron:50,myrrh:50,aloe:50,air:50,ancient:50,fuse:50,beasts:50,bite:68,blow:50,bramble:50,brine:50,burn:50,burning:50,cedar:50,cinnabar:50,copper:50,crow:56,crush:50,drench:50,earth:50,enchant:50,fire:50,flint:45,frozen:50,glass:50,gold:50,grow:50,guard:50,hellebore:50,hemlock:50,iron:50,ivy:50,laurel:50,lead:50,leech:50,lichen:50,mandrake:50,mend:50,metals:50,mistletoe:50,mortals:50,moth:50,naphtha:50,nettle:50,night:50,nightshade:50,oak:50,owl:50,pitch:50,poison:50,quicklime:50,quicksilver:50,rain:50,realgar:50,salt:42,saltpetre:50,seed:58,shadow:50,silver:50,sleep:50,sodden:50,spirits:50,strike:62,toad:50,toadstool:50,venomous:50,vitriol:50,void:50,water:50,willow:50,wind:50,wither:50,wormwood:50,worts:50,yew:50},OG={OE:1,N:2,F:3,L:4,G:5,A:6,H:7,X:8};
const IC=n=>'<img src="'+INL['ic/'+n+'.png']+'" alt="">';
function artHtml(w,form){const d=W[w],a=form==='fire'&&ART.fire!=null&&ART[w]==null?'fire':w;
  return ART[a]!=null?'<span class="art" style="background-image:url(assets/art/'+a+'.jpg)"></span>':'<span class="art none" style="--og:url('+INL['og/'+OG[d.o]+'.png']+')"></span>';}
function stateChips(t){
  const s=t.st,o=[],base=W[t.w].props,add=(p,label,cls,ic)=>{if(t.props.includes(p)&&!base.includes(p))o.push('<i'+(cls?' class="'+cls+'"':'')+'>'+(ic?IC(ic):'')+label+'</i>');};
  if(s.burning)o.push('<i class="fire">'+IC('flame')+'burning</i>');if(s.frozen)o.push('<i>'+IC('snowflake')+'frozen</i>');if(s.sodden)o.push('<i>'+IC('water_drop')+'sodden</i>');if(s.asleep)o.push('<i>'+IC('sleep')+'asleep</i>');
  if(s.bound)o.push('<i>'+IC('chain_bound')+'bound</i>');if(s.blind)o.push('<i>'+IC('blind_eye')+'blinded</i>');if(s.stone)o.push('<i>'+IC('stone')+'stone</i>');
  if(s.poisoned)o.push('<i class="fire">'+IC('poison')+'poisoned</i>');if(s.guarding)o.push('<i class="good">'+IC('shield_guard')+'guarding</i>');if(s.occult)o.push('<i>'+IC('hidden')+'hidden</i>');if(s.volatile)o.push('<i>volatile</i>');
  if(s.measured)o.push('<i>measured</i>');else if(s.fixed)o.push('<i class="good">fixed</i>');if(s.masked)o.push('<i class="good">masked</i>');if(t.props.includes('resonant'))o.push('<i>resonant</i>');if(s.hermetic)o.push('<i class="good">'+IC('sealed')+'sealed</i>');if(s.grounded)o.push('<i>leaden</i>');if(s.quick)o.push('<i class="good">'+IC('quick')+'quick</i>');
  add('toxic','venomous');add('corrosive','corrosive');add('bright','radiant','good');add('sacred','sacred','good');add('brittle','brittle');add('flying','winged','good','wing');add('thorny','thorny');add('eternal','eternal','good');add('flammable','will burn');
  add('frost','frost');add('damp','soaking');add('lull','lulling');add('stealth','unblockable','good');add('swift','swift','good');add('potent','potent','good');add('named','named','good');add('hoard','pays a coin','good');
  if(t.props.includes('spell'))o.push('<i class="good">'+(t.left==null?SPELLTURNS:t.left)+' turns left</i>');
  if(t.acted&&t.side===0&&!t.props.includes('spell'))o.push('<i>acted</i>');
  return o.join('');
}
function thingHtml(t){
  const play=S.phase==='play';
  if(t.side===1&&t.st.occult)return '<div class="thing hidden" aria-label="A hidden thing" title="Something unseen"><span class="cf mini back"></span></div>';
  const pick=same(ui.subj,{k:'thing',id:t.id})||same(ui.obj,{k:'thing',id:t.id});
  const rv=readyVerbs(t),forms=t.forms||[],f=forms.length?' f-'+forms[forms.length-1]:'';
  return '<button class="thing'+(t.side===0?' mine':'')+(t.st.occult?' occ':'')+(pick?' pick':'')+(rv.length?' ready':'')+(t.acted&&t.side===0?' acted':'')+f+['burning','poisoned','frozen','asleep','sodden','bound','stone','blind','guarding','masked'].filter(k=>t.st[k]).map(k=>' st-'+k).join('')+(t.props.includes('swift')||t.st.quick?' st-swift':'')+(t.props.includes('sacred')?' st-sacred':'')+(ui.subj&&!same(ui.subj,{k:'thing',id:t.id})&&rxWord(S,0,ui.subj)&&rxOf(rxWord(S,0,ui.subj),t.w)?' reacts':'')+'" data-act="thing" data-id="'+t.id+'"'+(play?'':' disabled')+' title="'+esc(W[t.w].gloss+' Can '+abilities(t.props,t.st).join(', ')+'.')+'">'
    +miniFace(t.w,{vig:t.vig,title:t.title||t.w,form:forms.includes('fire')?'fire':''})+'<span class="stspr">'+['burning','poisoned','frozen','sodden','asleep','bound','blind','stone','guarding'].filter(k=>t.st[k]).slice(0,3).map(k=>'<img src="'+(INL['fx/'+k+'.webp']||'assets/fx/'+k+'.webp')+'" alt="" class="s-'+k+'">').join('')+'</span><span class="states">'+stateChips(t)+'</span>'+(t.verbs&&t.verbs.length?'<span class="knows">'+(rv.length?'Ready: '+esc(rv.join(', '))+', free':'Knows '+esc(t.verbs.join(', ')))+'</span>':'')+'</button>';
}
function whoHtml(i){
  const p=S.players[i],play=S.phase==='play',pick=same(ui.subj,{k:'player',i})||same(ui.obj,{k:'player',i});
  const st=(p.asleep?'<span class="tag">drowsy</span>':'')+(p.poisoned?'<span class="tag">poisoned</span>':'')+(p.sodden?'<span class="tag">soaked</span>':'')+(p.dazed?'<span class="tag">hampered</span>':'');
  const ctr=(ic,n,label)=>'<span class="ctr">'+IC(ic)+'<b>'+n+'</b><small>'+label+'</small></span>';
  const who='<button class="who'+(pick?' pick':'')+(p.poisoned?' st-poisoned':'')+(p.asleep?' st-asleep':'')+(p.sodden?' st-sodden':'')+(p.dazed?' st-dazed':'')+'" data-act="player" data-i="'+i+'"'+(play?'':' disabled')+' aria-label="'+(i===0?'You':'The rival')+', '+Math.max(0,p.life)+' life"><img src="'+(i===0?meImg():rvImg(rivalOf()))+'" alt="">'+(i===1&&S.rival?'<span class="nm">'+esc(S.rival.n)+'</span>':i===0&&PF.me&&PF.me.name&&S.story?'<span class="nm">'+esc(meFull())+'</span>':'')+'<span class="life">'+Math.max(0,p.life)+'</span></button>';
  if(i===1)return '<span class="backs" title="'+p.hand.length+' words in the rival’s hand">'+p.hand.slice(0,10).map(()=>'<img src="assets/back.jpg" alt="">').join('')+'</span>'+ctr('deck',p.hand.length,'in hand')+who+ctr('coin',p.coins,'ink')+(insight(S,1)?'<span class="ctr"><b>+'+insight(S,1)+'</b><small>to blows</small></span>':'')+st;
  return who+(insight(S,0)?'<span class="ctr" title="Each different reaction this match adds '+INSIGHT+' to every blow you strike at the rival"><b>+'+insight(S,0)+'</b><small>to blows</small></span>':'')+ctr('ink_drop',p.ink+'/'+((S.cfg&&S.cfg.ink)||6),'breath')+ctr('coin',p.coins,'ink')+ctr('deck',p.deck.length,'deck')+ctr('spent_pile',p.discard.length,'spent')+(p.dross?'<span class="ctr dross" title="Black matter: left by your things that were destroyed. The next thing you bring forth rises out of it with this much more vigour, up to 4."><b>'+p.dross+'</b><small>black matter</small></span>':'')+(S.over==null&&p.life>0&&p.life<=10&&!p.braved?'<span class="ctr brave" title="Courage: at 10 life or less, the first sentence you speak each turn costs no breath and cannot be defended against."><b>free</b><small>courage</small></span>':'')+st;
}
function subjProps(){const r=ui.subj;if(!r)return null;if(r.k==='thing'){const t=findThing(S,r.id);return t&&t.side===0?{p:t.props,st:t.st,w:t.title||t.w,verbs:t.verbs||[]}:null;}
  if(r.k==='card'){const w=S.players[0].hand[r.i],d=W[w];return d&&d.t===NOUN?{p:d.props,st:null,w}:null;}return null;}
const OGL={OE:'þ',N:'ᚱ',F:'ç',L:'æ',G:'Ω',A:'ع',H:'א',X:'☉'},SUBT=['beast','bird','plant','herb','wood','metal','stone','liquid','spirit','human','element','concept'];
const kindOfW=w=>isEvent(w)?'spell \u00b7 once':W[w].t===NOUN&&W[w].props.includes('spell')?'spell \u00b7 lasting':W[w].t===NOUN&&W[w].props.includes('ground')?'element':W[w].conj?'conjunction':TYPE[W[w].t],frameOf=w=>W[w].t,medOf=w=>isEvent(w)||(W[w].t===NOUN&&W[w].props.includes('spell'))?'event':W[w].t;
const ARTAS={'philosopher’s stone':'pstone'};
const artBg=(w,form)=>{w=ARTAS[w]||w;const a=form==='fire'&&ART[w]==null?'fire':w;return ART[a]!=null?'<span class="c-art" style="--fx:'+ART[a]+'%;background-image:url(assets/art/'+a+'.jpg)"></span>':'<span class="c-art none" style="--og:url('+INL['og/'+OG[W[w].o]+'.png']+')"></span>';};
const THINGS=ALLWORDS.concat(Object.keys(W).filter(w=>W[w].token)).filter(w=>W[w].t===NOUN&&!isEvent(w)&&w!=='ash'&&w!=='gold');
function reachTest(w){const d=W[w];
  if(d.t===CAT){const m=d.match;if(m==='#asleep')return null;if(m==='#flying')return n=>W[n].props.includes('bird')||W[n].props.includes('flying');if(m==='#burning')return n=>W[n].props.includes('flame')||W[n].props.includes('fireborn');return n=>W[n].props.includes(m);}
  if(d.t===CLIME){if(w==='storm')return n=>W[n].props.includes('metal')||W[n].props.includes('flying');if(w==='fog')return null;return n=>{try{return climeDv({clime:{w,owner:0},things:[]},{w:n,props:W[n].props,st:{},side:0})!==0;}catch(e){return false;}};}
  if(d.t===VERB){if(EVFIT[w])return w==='enchant'||w==='gild'||w==='name'?null:n=>EVFIT[w](W[n].props);if(d.kind==='agent'&&w!=='strike'&&w!=='guard')return n=>abilities(W[n].props,null).includes(w);}
  return null;}
const reachCache={};
function reachLine(w){const f=reachTest(w);if(!f)return '';const hit=reachCache[w]||(reachCache[w]=THINGS.filter(f)),inDeckN=PF.deck.filter(x=>W[x]&&W[x].t===NOUN&&hit.includes(x)).length,pct=Math.round(100*hit.length/THINGS.length);
  const lab=W[w].t===VERB&&!EVFIT[w]?'can do this':W[w].t===VERB?'can take this':'are touched';
  return '<i class="c-reach'+(inDeckN?'':' none')+'" title="'+hit.length+' of '+THINGS.length+': '+esc(hit.slice(0,40).join(', '))+'">'+pct+'% of things '+lab+' \u00b7 '+inDeckN+' in your deck</i>';}
function miniFace(w,o){o=o||{};const d=W[w],ev=isEvent(w),sp=d.t===NOUN&&(d.props.includes('spell')||d.props.includes('ground')),vig=sp?null:o.vig!=null?o.vig:(d.t===NOUN&&!ev?d.vig+2*(o.lv||0):null),name=o.title||w;
  const stt=o.title?'':stars(w,o.up);return '<span class="cf mini'+(vig!=null?' hs':'')+' f-'+frameOf(w)+((o.lv||(o.up&&o.up[w]))?' lv'+Math.min(2,(o.lv||o.up[w])):'')+'">'+artBg(w,o.form)+'<img class="c-frame" src="assets/fr/mini_'+frameOf(w)+'.webp" alt="">'
    +(o.ink!=null?'<span class="c-ink" title="'+o.ink+' breath"><b>'+o.ink+'</b></span>':'')+(o.coin!=null?'<span class="c-coin" title="'+o.coin+' ink">'+o.coin+'</span>':'<img class="c-med" src="assets/ds/f_'+medOf(w)+'.webp" alt="" title="'+kindOfW(w)+'">')
    +'<span class="c-w w'+(name.length>15?' xs':name.length>7?' sm':'')+(stt?' st':'')+'"><span class="c-n">'+esc(name)+'</span>'+stt+'</span>'+(vig!=null?'<span class="c-seal" title="vigour '+vig+'">'+vig+'</span>':'')+'</span>';}
function fullFace(w,o){o=o||{};const d=W[w],ev=isEvent(w),vig=d.t===NOUN&&!ev&&!d.props.includes('spell')&&!d.props.includes('ground')?d.vig+2*(o.lv||0):null,sub=d.t===NOUN&&!ev?SUBT.filter(p=>d.props.includes(p)).slice(0,2):[],tier=tierOf(w);
  const type=[kindOfW(w)].concat(sub).join(' · '),can=d.t===NOUN&&!ev?abilities(d.props,null).join(', '):'';
  return '<span class="cf full f-'+frameOf(w)+((o.lv||(o.up&&o.up[w]))?' lv'+Math.min(2,(o.lv||o.up[w])):'')+'">'+artBg(w)+'<img class="c-frame" src="assets/fr/full_'+frameOf(w)+'.webp" alt="">'
    +'<span class="c-ink" title="'+(o.ink!=null?o.ink:d.syl)+' breath"><b>'+(o.ink!=null?o.ink:d.syl)+'</b></span><span class="c-org" title="'+ORIGIN[d.o]+'">'+OGL[d.o]+'</span>'
    +'<span class="c-w w'+(w.length>13?' sm':'')+(stars(w,o.up)?' st':'')+'"><span class="c-n">'+esc(w)+'</span>'+stars(w,o.up)+'</span>'
    +(d.t===CLIME?'':'<span class="c-type"><span>'+esc(type)+'</span><span>'+esc(ORIGIN[d.o])+'</span></span>')
    +'<span class="c-txt'+(d.gloss.length+can.length>150?' sm':'')+'">'+(d.t===CLIME?'<small>Weather · '+esc(ORIGIN[d.o])+'</small>':'')+'<span>'+esc(d.gloss)+'</span>'+(can?'<em>Can '+esc(can)+'.</em>':'')+reachLine(w)+'</span>'
    +(vig!=null?'<span class="c-seal" title="vigour '+vig+'">'+vig+'</span>':'')+'<span class="c-gem g'+tier+'" title="'+['','plain','rare','potent','great'][tier]+'"></span></span>';}
function face(w,o){return miniFace(w,o);}
function rxPartners(a){const h=S.players[0].hand;return h.some(x=>W[x].t===NOUN&&rxOf(a,x))||S.things.some(t=>rxOf(a,t.w));}
function cardHtml(w,i,mode){
  const d=W[w],used=!mode&&usedIdx().includes(i),sp=!mode&&d.t===VERB?subjProps():null,sw=!mode&&ui.subj?rxWord(S,0,ui.subj):null,fit=(sw&&!used&&((w==='fuse'&&rxPartners(sw))||(d.t===NOUN&&!same(ui.subj,{k:'card',i})&&rxOf(sw,w))))||sp&&!sp.p.includes('event')&&(abilities(sp.p,sp.st).includes(w)||(EVFIT[w]&&EVFIT[w](sp.p))),lv=upOf(S,0,w);
  return '<button class="card mini '+d.t+(isEvent(w)?' event':'')+(used?' used':'')+(fit?' fit':'')+'" data-act="'+(mode||'card')+'" data-i="'+i+'"'+(S.phase==='play'||mode?'':' disabled')+'>'
    +miniFace(w,{ink:costOf(S,0,w),coin:mode==='buy'?price(w):null,lv,up:S.up[0]})+'<span class="tip">'+fullFace(w,{ink:costOf(S,0,w),lv,up:S.up[0]})+'</span></button>';
}
function renderMatch(){
  {const tb=$('table'),off=lsGet('word-alchemy-chron')==='0';tb.classList.toggle('nochron',off);const cb=$('chron-t');if(cb){cb.textContent=off?'Chronicle':'–';cb.title=off?'Open the Chronicle':'Hide the Chronicle';cb.setAttribute('aria-expanded',off?'false':'true');}}
  dailyScore();if(S.puz&&S.over==null){const pn=sNode(S.puz);if(pn.test?pn.test(S):S.players[1].life<=0)S.over=0;}
  if(S.puz&&!S.live)return;
  if(S.puz&&(S.over!=null||S.phase==='over')){findEnd();return;}
  if(S.phase==='over')settle();
  endScreen();
  renderCoach();
  $('rivalhead').innerHTML=whoHtml(1);
  $('youhead').innerHTML=whoHtml(0);
  const isSp=t=>t.props.includes('spell'),isG0=t=>t.props.includes('ground')&&!isSp(t),pips=(n,m)=>'<i class="pips" aria-label="'+n+' of '+m+'">'+Array.from({length:m},(_,k)=>'<u'+(k<n?' class="on"':'')+'></u>').join('')+'</i>',
   zone=(c,label,tip,n,m,inner)=>'<div class="zone '+c+'" title="'+tip+'"><small>'+label+(m?pips(n,m):'')+'</small><div class="ztiles" data-n="'+n+'">'+inner+'</div></div>',
   lane=(all,mine,extra)=>{const g=all.filter(isG0),s=all.filter(isSp),f=all.filter(t=>!isG0(t)&&!isSp(t));
    return zone('zg','Ground','The ground: elements and what they make. They cannot be attacked and do not attack or block. They work by their nature and through reactions.',g.length,MAXGROUND,g.map(thingHtml).join('')||'<span class="zghost">bare</span>')
     +zone('zf',mine?'Your side':'Rival’s side','Things here can act, attack and be attacked.',f.length,0,(f.length||extra?f.map(thingHtml).join(''):'<span class="empty">'+(mine?'Nothing on your side yet. Bring forth a noun from your hand.':'Nothing on the rival’s side.')+'</span>')+(extra||''))
     +zone('zs','Spells','Spells: standing effects. They cannot be attacked and do not fight. Each fades after '+SPELLTURNS+' of its keeper’s turns.',s.length,MAXSPELL,s.map(thingHtml).join('')||'<span class="zghost">none</span>');};
  $('rival').innerHTML=lane(S.things.filter(t=>t.side===1),false,pv?pvHtml():'');
  $('you').innerHTML=lane(S.things.filter(t=>t.side===0),true,'');
  {const cw=S.clime?S.clime.w:null,tb=$('table'),fresh=wxFor===S&&cw!==wxShown;
   if(cw){tb.dataset.wx=cw;tb.style.setProperty('--wxart','url(assets/art/'+cw+'.jpg)');}else{delete tb.dataset.wx;}
   $('clime').innerHTML='<small>Weather</small>'+(cw?'<div class="wxcard'+(fresh&&!RM?' arrive':'')+'" data-pv="'+esc(cw)+'">'+'<span class="wxface" style="background-image:url(assets/art/'+cw+'.jpg)"><b>'+esc(Cap(cw))+'</b></span>'+'</div><p class="wxgloss">'+esc(W[cw].gloss)+'</p>':'<div class="wxnone"><b>Fair weather</b><span>No weather or season has been spoken.</span></div>');
   if(fresh&&cw&&view==='match')climeIn(cw);wxFor=S;wxShown=cw;}
  {const tb=$('table'),bk0=S.story||S.bg,bk=S.puz?bk0:bk0&&bgOf(bk0),bg=bk&&(BGP[bk]||S.puz);tb.style.backgroundImage=bg?'url(assets/'+(S.puz?'fd/':'bgp/')+bk+'.jpg)':'';tb.classList.toggle('place',!!bg);tb.classList.toggle('compact',!!(S.puz&&!sNode(S.puz).board));tb.classList.toggle('nolife',!!(S.puz&&sNode(S.puz).test));}
  $('matmid').innerHTML='<i>Round '+Math.max(1,Math.ceil(S.turn/2))+'</i>';
  $('hand').innerHTML=S.players[0].hand.map((w,i)=>cardHtml(w,i,S.phase==='shop'?'toss':undefined)).join('')||'<span class="empty">Your hand is empty.</span>';
  {const cs=[...$('hand').querySelectorAll('.card')],n=cs.length,hh=S.players[0].hand;cs.forEach((c,i)=>{const o=i-(n-1)/2;c.style.setProperty('--r',(o*1.7).toFixed(2)+'deg');c.style.setProperty('--y',(o*o*1.3).toFixed(1)+'px');});
   if(prevHand&&hh.length>prevHand.length){for(let i=prevHand.length;i<n;i++)if(cs[i]){cs[i].style.animationDelay=((i-prevHand.length)*.09)+'s';cs[i].classList.add('drawn');}if(view==='match')sfx('page');}prevHand=hh.slice();}
  {const tb=document.querySelector('.table');if(tb)tb.classList.toggle('peril',S.phase!=='over'&&S.players[0].life<=12);}
  $('log').innerHTML=S.log.slice(-80).map(l=>'<div class="'+l.k+'">'+esc(l.x)+'</div>').join('');
  $('log').scrollTop=$('log').scrollHeight;
  renderBench();fit();
}
function countUp(el,to,ms){if(!el)return;if(RM||!to){el.textContent=to;return;}const t0=performance.now();const f=n=>{const k=Math.min(1,(n-t0)/ms);el.textContent=Math.round(to*k);if(k<1)requestAnimationFrame(f);};requestAnimationFrame(f);}
function endScreen(){
  let e=document.getElementById('end');
  if(!S||S.phase!=='over'||S.endSeen||view!=='match'){if(e)e.remove();return;}
  const pd=S.paid||{},stage=S.endStage||'result';if(e&&e.dataset.stage===stage)return;if(e)e.remove();
  e=document.createElement('div');e.id='end';e.dataset.stage=stage;
  const r=rankOf(PF.xp),cur=RANKS[r],next=RANKS[r+1],pct=next?Math.round(100*(PF.xp-cur.xp)/(next.xp-cur.xp)):100;
  const medal=(ic,id,label)=>'<div class="medal"><span><img src="assets/end/'+ic+'.webp" alt=""></span><b id="'+id+'">0</b><small>'+label+'</small></div>';
  if(stage==='rank'){const k=RANKS[pd.rankUp];
    e.className='rank';e.innerHTML='<div class="endbox"><div class="orb"><i style="background-image:url(assets/end/rank.jpg)"></i><em style="background-image:url(assets/end/ring_win.webp)"></em></div><div class="ban plain"><b>'+esc(k.n)+'</b></div>'
      +'<p class="endsub">You have reached a new stage of the Great Work.</p><p class="endperk">'+esc(k.perk)+'</p><div class="endbtns"><button class="gobtn" data-act="endnext" aria-label="Go on"><img src="assets/end/go.webp" alt=""></button></div></div>';}
  else{const win=S.over===0,lose=S.over===1,key=win?'win':lose?'lose':'draw';
    e.className=key;e.innerHTML='<div class="endbox"><div class="orb"><i style="background-image:url(assets/end/'+key+'.jpg)"></i><em style="background-image:url(assets/end/ring_'+(win?'win':'lose')+'.webp)"></em></div>'
      +'<div class="ban '+(win?'win':lose?'lose':'plain')+'"><b>'+(win?'Victory':lose?'Defeat':'Stalemate')+'</b></div>'
      +'<p class="endsub">'+(win?esc(rvName())+' is finished.':lose?'You are finished. '+esc(rvName())+' wins.':'Both of you fall together.')+'</p>'
      +'<div class="medals">'+medal('m_gold','m-gold','ink earned')+medal('m_vial','m-xp',pd.xp===1?'step forward':'steps forward')+medal('m_purse','m-kept','kept from the duel')+'</div>'
      +'<ul class="endlist">'+(pd.fav?'<li class="fav">A windfall: <b>three times the ink</b></li>':'')+(pd.praise?'<li class="praise">'+esc(pd.praise)+'</li>':'')+(pd.daily?'<li>First win of the day: <b>+'+pd.daily+' ink</b></li>':'')+(pd.quests||[]).map(q=>'<li>Quest done, '+esc(q.t)+': <b>+'+q.gold+' ink</b></li>').join('')+((pd.found||[]).length?'<li>Discovered: <b>'+pd.found.map(k=>esc(k.replace('+',' and '))).join(', ')+'</b></li>':'')+'</ul>'
      +'<div class="endbar" role="img" aria-label="'+esc(cur.n)+', '+pct+' percent of the way to the next rank"><u><i style="width:'+pct+'%"></i></u></div><p class="endrank">'+esc(cur.n)+(next?' · '+(next.xp-PF.xp)+(next.xp-PF.xp===1?' step to ':' steps to ')+esc(next.n):'')+' · '+PF.gold+' ink in all</p>'
      +'<div class="endbtns"><button class="gobtn" data-act="endnext" aria-label="Go on"><img src="assets/end/go.webp" alt=""></button></div></div>';}
  document.body.appendChild(e);
  if(stage==='rank'){sfx('shimmer');setTimeout(()=>sfx('bell'),350);}
  else setTimeout(()=>{countUp(document.getElementById('m-gold'),pd.gold||0,900);countUp(document.getElementById('m-xp'),pd.xp||0,500);countUp(document.getElementById('m-kept'),pd.kept||0,700);if(pd.gold)sfx('coin');},650);
}
function foresee(id){const C=JSON.parse(JSON.stringify(S));C.quiet=true;C.phase='bot';resolve(C,1,Object.assign({},C.pending,{def:id}));const t=id==null?null:C.things.find(x=>x.id===id);return{life:Math.max(0,S.players[0].life-C.players[0].life),left:t?t.vig:null};}
function slotsHtml(){const h=S.players[0].hand,cf=i=>miniFace(h[i],{ink:costOf(S,0,h[i]),lv:upOf(S,0,h[i]),up:S.up[0]}),
   face=r=>!r?'':r.k==='card'?cf(r.i):r.k==='player'?'<span class="sl-who"><img src="'+(r.i===0?meImg():rvImg(rivalOf()))+'" alt=""><em>'+(r.i===0?'you':esc(rvName().split(' ')[0]))+'</em></span>':(t=>t?miniFace(t.w,{vig:t.vig,title:t.title||t.w}):'')(findThing(S,r.id)),
   one=(c,l,x,n)=>'<div class="slot '+c+(x?' full':'')+'"><div class="sock'+(n>1?' many':'')+'">'+(x||'')+'</div><small>'+l+'</small></div>';
  if(ui.clime!=null)return '<div class="slots'+(ui.adjs.length?' two':' one')+'">'+(ui.adjs.length?one('a','adjective',ui.adjs.map(cf).join(''),ui.adjs.length):'')+one('w','weather',cf(ui.clime))+'</div>';
  return '<div class="slots">'+one('a','adjective',ui.adjs.map(cf).join(''),ui.adjs.length)+one('s','subject',face(ui.subj))+one('v','verb',ui.kverb&&W[ui.kverb]?miniFace(ui.kverb,{}):ui.verb!=null?cf(ui.verb):'')+one('o','object',face(ui.obj))+'</div>';}
function fit(){const de=document.documentElement,wide=innerWidth>=700;
  if(view==='home'||(view==='match'&&!live())){de.style.overflowY='';return;}
  const t=document.querySelector(view==='match'?'.table':view==='shop'?'.shopscene':view==='book'?'.bookscene':view==='ach'?'.achscene':view==='story'?'.storyscene':view==='scrip'?'.scripscene':'.deckscene');if(!t)return;
  if(view==='match'){const hd=$('hand'),n=hd.querySelectorAll('.card').length;hd.style.setProperty('--ov',n>1?Math.max(0,Math.ceil((n*132-hd.clientWidth)/(n-1)))+'px':'0px');}
  de.style.overflowY='';if(scrollY)scrollTo(0,0);
  for(let k=0;k<10;k++){const z=parseFloat(t.style.zoom)||1,r=t.getBoundingClientRect(),avail=innerHeight-(r.top+scrollY)-6;
    const want=Math.max(.35,Math.min(1,z*avail/r.height));if(Math.abs(want-z)<.004)break;t.style.zoom=want;}
  if(wide)de.style.overflowY='hidden';}
addEventListener('resize',()=>{document.querySelectorAll('.table,.scene').forEach(t=>t.style.zoom=1);fit();});
/* ---- the guide ---- */
function trial(s){try{const C=JSON.parse(JSON.stringify(S));C.quiet=false;C.log=[];C.found=[];const t=Object.assign({},s);if(needsDefence(C,0,t))t.def=botDefend(C,1,0,t);
    const core=X=>JSON.stringify([X.things.map(t=>[t.id,t.w,t.vig,t.side,t.props,t.st,t.verbs,t.forms]),X.players.map(p=>[p.life,p.poisoned,p.asleep,p.dazed,p.coins]),X.clime&&X.clime.w,X.rxDone]);
    const before=core(C),r=resolve(C,0,t);if(!r.ok)return null;const foe=X=>X.things.filter(t=>t.side===1),doom=X=>foe(X).filter(t=>t.st.burning||t.st.poisoned).length;
    return{same:core(C)===before,last:(C.log.filter(l=>l.k!=='s').pop()||{}).x||'',won:C.over===0,hurt:S.players[1].life-C.players[1].life,atk:!!C.atk,doom:doom(C)-doom(S),gone:foe(S).length-foe(C).length,
      disc:Object.keys(C.rxDone[0]).length-Object.keys(S.rxDone[0]).length,made:C.things.filter(t=>t.side===0).length-S.things.filter(t=>t.side===0).length};}catch(err){return null;}}
let adv={key:'',list:[]};
function advise(){const key=S.log.length+'|'+S.players[0].hand.join(',')+'|'+S.players[0].ink+'|'+S.things.map(t=>t.id+':'+t.vig+(t.acted?'a':'')).join(',');if(adv.key===key)return adv.list;
  const best={},put=(f,score,s,why)=>{if(score>0&&(!best[f]||score>best[f].score))best[f]={f,score,s,why};};
  let n=0;for(const s of candidates(S,0)){if(n>260)break;const v=validate(S,0,s);if(!v.ok)continue;n++;const r=trial(s);if(!r||r.same)continue;
    if(r.won)put('win',1000,s,'This finishes the rival.');
    if(r.disc>0)put('discovery',10+r.hurt,s,'A new reaction: every blow you strike at the rival lands '+INSIGHT+' harder for the rest of the match.');
    if(!r.atk&&(r.gone>0||r.doom>0))put('ruin',r.gone*10+r.doom*4+r.hurt,s,r.gone>0?'Destroys a rival thing without an attack: they lose '+RUIN+' life for it.':'Sets a rival thing burning or poisoned. It chokes them each turn and costs them '+RUIN+' life when it dies.');
    if(r.atk&&r.hurt>0)put('wound',r.hurt,s,'The rival loses '+r.hurt+' of '+S.players[1].life+' life.');
    if(r.made>0)put('grow',1+r.made,s,'Puts a thing on your side to work with.');}
  adv={key,list:['win','discovery','ruin','wound','grow'].filter(f=>best[f]).map(f=>best[f])};return adv.list;}
function danger(){const out=[],mine=S.things.filter(t=>t.side===0),burn=mine.filter(t=>t.st.burning),dying=mine.filter(t=>!t.token&&((t.st.burning&&t.vig<=2)||(t.st.poisoned&&t.vig<=1)));
  if(burn.length)out.push(Cap(burn.map(t=>t.title||t.w).join(' and '))+(burn.length>1?' are':' is')+' burning: the smoke costs you '+burn.length+' life a turn. Water or sodden puts it out.');
  if(dying.length)out.push(Cap(dying.map(t=>t.title||t.w).join(' and '))+' will die next turn, and its ruin costs you '+RUIN+' life.');
  if(S.players[0].life<=12)out.push('You are at '+S.players[0].life+' life.');return out;}
const FAML={win:'Finish',ruin:'Ruin',discovery:'Discovery',wound:'Attack',grow:'Build up'};
function guideHtml(){if(S.puz)return '';const d=danger(),a=ui.subj||ui.verb!=null||ui.adjs.length||ui.clime!=null?[]:advise();
  return (d.length?'<div class="warn">'+d.map(esc).join('<br>')+'</div>':'')+(a.length?'<div class="ways"><b>Ways forward this turn</b>'+a.map((x,i)=>'<button class="way" data-act="way" data-i="'+i+'"><em>'+FAML[x.f]+'</em><span>'+esc(describe(S,0,x.s))+'</span><small>'+esc(x.why)+'</small></button>').join('')+'</div>':'');}
function renderBench(){
  const b=$('bench');
  if(S.phase==='over'){const pd=S.paid||{};
    b.innerHTML='<h2>The end</h2><div class="over">'+(S.over===0?'The rival is finished. You win.':S.over===1?'You are finished. The rival wins.':'Both of you fall together.')+'</div>'
      +'<div class="hint">You take home '+pd.gold+' ink: '+pd.base+' for the match and '+pd.kept+' from the ink in your purse. You now have '+PF.gold+' ink.</div>'
      +(pd.rankUp!=null?'<div class="hint good"><strong>You reach '+esc(RANKS[pd.rankUp].n)+'.</strong> '+esc(RANKS[pd.rankUp].perk)+'</div>':'')
      +'<div class="btns">'+(jm?'<button class="btn" data-act="go" data-v="story">Back to the map</button><button class="btn ghost" data-act="go" data-v="deck">Your wordhoard</button>':'<button class="btn" data-act="new">Play again</button><button class="btn ghost" data-act="go" data-v="story">Journey</button><button class="btn ghost" data-act="go" data-v="home">Title screen</button>')+'</div>';return;}
  if(S.phase==='defend'&&S.pending){const opts=eligibleDef(S,0,attackerOf(S,1,S.pending));
    b.innerHTML='<h2>You are attacked</h2><div class="sentence">'+esc(describe(S,1,S.pending))+'</div><div class="hint">Put one of your things in the way, or take the blow yourself. A defender takes the hit and, if it survives, hits back.</div><div class="btns">'
      +opts.map(t=>{const f=foresee(t.id);return '<button class="btn" data-act="def" data-id="'+t.id+'">Defend with '+esc(t.title||t.w)+' ('+t.vig+'): '+(f.left==null?'it dies':'it lives with '+f.left)+(f.life?', you lose '+f.life:'')+'</button>';}).join('')+'<button class="btn ghost" data-act="def" data-id="">Take the blow: you lose '+foresee(null).life+' life</button></div>';return;}
  if(S.phase==='shop'){const p=S.players[0];
    b.innerHTML='<div class="famhead"><img src="assets/fam.jpg" alt=""><div><h2>'+esc(famName(true))+' lays out her finds</h2><p class="famsay">“'+esc(famLine(p.coins))+'”</p></div></div><div class="hint">You have '+p.coins+(p.coins===1?' coin':' coins')+'. A word you buy from her goes straight into your hand and stays in your deck for this match. Ink you keep goes home with you. Tapping a word in your hand '+(toss==='banish'?'banishes it from this match for 1 ink.':'discards it, to come round again later.')+'</div><div class="row market">'+S.shop.map((w,i)=>cardHtml(w,i,'buy')).join('')+'</div>'
      +'<div class="btns"><button class="btn" data-act="shopdone">Done, rival\u2019s turn</button><button class="btn ghost" data-act="refresh"'+(p.coins<1?' disabled':'')+'>Send her out again for 1 ink</button><button class="btn ghost" data-act="tossmode">'+(toss==='banish'?'Switch to discarding':'Switch to banishing')+'</button></div>';return;}
  if(S.phase==='bot'){b.innerHTML='<h2>The rival is speaking</h2><div class="sentence"><span class="ph">Wait for your turn.</span></div>';return;}
  if(ui.discard){b.innerHTML='<h2>Discarding</h2><div class="hint">Tap any word in your hand to discard it. It goes to your spent pile and you draw back up to a full hand next turn.</div><div class="btns"><button class="btn" data-act="discard">Done discarding</button></div>';return;}
  const s=sen(),v=validate(S,0,s),text=describe(S,0,s),sp=subjProps(),tr=v.ok?trial(s):null,dud=tr&&tr.same;
  const known=sp&&sp.verbs&&sp.verbs.length?'<div class="btns">'+sp.verbs.map(w=>'<button class="btn'+(ui.kverb===w?'':' ghost')+'" data-act="kverb" data-w="'+esc(w)+'">'+esc(w)+', free</button>').join('')+'</div>':'';
  const can=sp&&ui.verb==null&&!ui.kverb?sp.p.includes('event')?'<div class="hint">'+esc(Cap(sp.w))+' is a single-use spell. Say it alone: it happens once and is spent.</div>':'<div class="hint">'+esc(Cap(sp.w))+' can '+esc(abilities(sp.p,sp.st).join(', '))+'. Verbs in your hand that suit it are marked.'+(known?' It already knows:':'')+'</div>':'';
  b.innerHTML='<h2>'+(S.puz?'A find on the road':'Your sentence')+'</h2>'+(S.puz?'<div class="hint good">'+esc(sNode(S.puz).puz.goal)+((S.stat.said||0)>=2||S.players[0].ink<1||S.left<(sNode(S.puz).puz.turns||1)?' <em>Hint: '+esc(sNode(S.puz).puz.hint)+'</em>':'')+'</div>':'')+'<div class="senrow">'+slotsHtml()+'<div class="sentext"><div class="sentence">'+(text?esc(text):'<span class="ph">Tap words in your hand, and things or people on the table.</span>')+'</div>'
    +'<div class="hint'+((ui.msg||dud||(!v.ok&&!v.empty))?' bad':'')+'">'+esc(ui.msg||(v.ok?(dud?'This would do nothing. '+tr.last:(v.cost?'Costs '+v.cost+' breath.':'Costs no breath.')+(tr&&tr.won?' This finishes the rival.':'')):v.why))+'</div>'+can+known+guideHtml()+'</div></div>'
    +'<div class="btns acts"><button class="btn" data-act="speak"'+(v.ok?'':' disabled')+'>Speak</button><button class="btn ghost" data-act="clear">Clear</button>'+(S.puz&&(sNode(S.puz).puz.turns||1)>1?'<button class="btn ghost" data-act="pwait"'+(S.left>1?'':' disabled')+'>'+(S.left>1?'Let a turn pass<br><small>'+(S.left-1)+' left</small>':'No turns left')+'</button>':'')+'<button class="btn wax" data-act="end">'+(S.puz?'Start again':ui.endWarn?'End anyway':'End turn')+'</button></div>';
}

/* ---- the shop, the deck and the lexicon ---- */
function wordCard(w,foot){const d=W[w];
  return '<div class="card '+d.t+(isEvent(w)?' event':'')+' static">'+fullFace(w,{lv:PF.up[w]||0})+foot+'</div>';}
let dk={q:'',type:null,cost:null,page:0,sel:null,all:false};
const TORDER=['noun','verb','adj','cat','clime'],kindOf=w=>isEvent(w)||(W[w].t===NOUN&&W[w].props.includes('spell'))?'event':W[w].t,FILT=[['noun','Things'],['event','Spells'],['verb','Verbs'],['adj','Adjectives'],['cat','Categories'],['clime','Weather']];
const inkb=n=>'<span class="inkb"><b>'+n+'</b></span>';
function gwTrack(){const r=rankOf(PF.xp);return '<div class="gw" role="img" aria-label="The Great Work: you are at '+esc(RANKS[r].n)+'"><b>The Great Work</b>'+RANKS.map((k,i)=>'<i class="g'+Math.floor(i/3)+(i<=r?' lit':'')+(i===r?' now':'')+'" title="'+esc(k.n+': '+k.perk)+'" style="background-image:url(assets/ds/g'+Math.floor(i/3)+'.webp)"></i>').join('')+'</div>';}
function renderShop(){
  const p=pk(),r=rankOf(PF.xp),next=RANKS[r+1];if(!PF.stock.length){restock();save();}
  $('view-shop').innerHTML='<div class="scene shopscene"><img class="keeper" src="assets/ds/keeper.webp" alt="">'
    +'<div class="scenetop"><p class="say">“Words bought here are yours for good. Put them in your deck on the deck page.”</p><span class="ctr purse2"><img src="assets/ds/purse.webp" alt=""><b>'+PF.gold+'</b><small>ink</small></span></div>'
    +'<div class="stall">'+PF.stock.map((w,i)=>{const own=PF.owned[w]||0,full=own>=4,cost=copyPrice(w),can=!full&&PF.gold>=cost;
      return '<div class="lot'+(full?' sold':'')+'">'+wordCard(w,full?'<em class="rib sold"><span>sold</span></em>':own?'':'<em class="rib"><span>new</span></em>')+'<img class="easel" src="assets/ds/easel.webp" alt=""><button class="tagbtn" data-act="buyword" data-i="'+i+'"'+(can?'':' disabled')+' aria-label="'+(full?'You already have '+p.copies+' of '+esc(w):'Scribe '+esc(w)+' for '+cost+' ink')+'"><b>'+(full?'–':cost)+'</b><small>'+(full?'have '+own:own?'own '+own:'ink')+'</small></button></div>';}).join('')+'</div>'
    +'<div class="scenefoot">'+gwTrack()+'<button class="btn bell" data-act="reroll"'+(PF.gold<REROLL?' disabled':'')+'><img src="assets/ds/bell.webp" alt=""><span>Fresh stock<small>'+REROLL+' ink</small></span></button><button class="btn wax" data-act="go" data-v="match">Leave</button></div></div>'
    +'<details class="howbox"><summary>The Great Work: '+esc(RANKS[r].n)+(next?', '+(next.xp-PF.xp)+(next.xp-PF.xp===1?' step':' steps')+' to '+esc(next.n):'')+'</summary><p class="lead">You have '+PF.wins+(PF.wins===1?' win':' wins')+' and '+PF.losses+(PF.losses===1?' loss':' losses')+'. A win brings 30 ink and 3 steps, a loss 12 ink and 1 step, plus the ink left in your purse. Fresh stock arrives after every match. Your rival’s deck grows with you.</p>'
    +'<ol class="ranks">'+RANKS.map((k,i)=>{const st=i<r?'done':i===r?'now':'';return '<li class="'+st+'"><b>'+esc(k.n)+'</b> <small>'+(i<=r?(i===r?'you are here':'reached'):(k.xp-PF.xp)+' steps away')+'</small><span>'+esc(k.perk)+'</span></li>';}).join('')+'</ol></details>';
  fit();
}
function dkWords(){let ws=dk.all?ALLWORDS.slice():Object.keys(PF.owned).filter(w=>PF.owned[w]>0);
  if(dk.type)ws=ws.filter(w=>kindOf(w)===dk.type);if(dk.cost)ws=ws.filter(w=>dk.cost===5?W[w].syl>=5:W[w].syl===dk.cost);
  const q=dk.q.trim().toLowerCase();if(q)ws=ws.filter(w=>w.includes(q)||W[w].gloss.toLowerCase().includes(q));
  return ws.sort((a,b)=>((PF.owned[b]?1:0)-(PF.owned[a]?1:0))||(TORDER.indexOf(W[a].t)-TORDER.indexOf(W[b].t))||(W[a].syl-W[b].syl)||a.localeCompare(b));}
function dkGrid(){const p=pk(),ws=dkWords(),per=10,pages=Math.max(1,Math.ceil(ws.length/per));dk.page=Math.max(0,Math.min(dk.page,pages-1));const n=PF.deck.length;
  let big='';if(dk.sel&&W[dk.sel]){const w=dk.sel,own=PF.owned[w]||0,inn=inDeck(w),lv=PF.up[w]||0,canUp=lv<p.refine,cost=REFINE[lv];
    big='<div class="big" role="dialog" aria-label="'+esc(w)+'"><div class="bigcard">'+wordCard(w,'')+'</div><div class="bigside"><p><strong>'+(own?'You own '+own+', with '+inn+' in your deck.':'You do not own this word yet. '+(tierOf(w)<=p.tier?'Look for it in the shop.':'The shop will stock it at a higher rank.'))+'</strong></p>'
      +(own?'<button class="btn" data-act="dplus" data-w="'+esc(w)+'"'+(inn<Math.min(own,p.copies)&&n<p.deckMax?'':' disabled')+'>Add to deck</button><button class="btn ghost" data-act="dminus" data-w="'+esc(w)+'"'+(inn?'':' disabled')+'>Take one out</button>'
        +'<button class="btn ghost" data-act="go" data-v="scrip">'+(lv>=2?'Twice illuminated':lv?'Illuminated · to the Scriptorium':'Illuminate in the Scriptorium')+'</button>':'')
      +'<button class="btn ghost" data-act="dclose">Close</button></div></div>';}
  const MAG='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6"/><path d="M15.5 15.5 21 21"/></svg>';
  $('dk-grid').innerHTML='<button class="pg" data-act="dpage" data-d="-1"'+(dk.page?'':' disabled')+' aria-label="Previous page"><img src="assets/ds/arrow.webp" alt=""></button><div class="tray'+(dk.anim?' in':'')+'" style="--dir:'+(dk.dir||1)+'">'
    +(ws.slice(dk.page*per,dk.page*per+per).map((w,k)=>{const d=W[w],own=PF.owned[w]||0,inn=inDeck(w),cap=Math.min(own,p.copies);
      return '<div class="cell'+(own?'':' locked')+(own&&inn>=cap?' maxed':'')+(own&&!isAlive(w)?' unsp':'')+'" style="--k:'+k+'">'+(own&&!isAlive(w)?'<i class="unsp-t">unspoken</i>':'')+'<button class="card mini '+d.t+(isEvent(w)?' event':'')+'" data-act="dadd" data-w="'+esc(w)+'" data-pv="'+esc(w)+'" aria-label="'+esc(w)+(own?', '+inn+' of '+own+' in deck. Click to add.':', not owned')+'">'+face(w,{ink:d.syl,lv:PF.up[w]||0})+'</button>'
        +'<button class="insp" data-act="dsel" data-w="'+esc(w)+'" aria-label="Inspect '+esc(w)+'" title="Inspect and refine">'+MAG+'</button>'+(own?'':'<img class="lock" src="assets/ds/lock.webp" alt="">')
        +'<span class="pips">'+(own?Array.from({length:Math.min(own,6)},(_,i)=>'<i'+(i<inn?' class="on"':'')+'></i>').join(''):'<small>not owned</small>')+'</span></div>';}).join('')||'<p class="none">No words match.</p>')
    +'</div><button class="pg" data-act="dpage" data-d="1"'+(dk.page<pages-1?'':' disabled')+' aria-label="Next page"><img src="assets/ds/arrow.webp" alt=""></button><span class="pgn">Page '+(dk.page+1)+' of '+pages+'</span><span class="dkhint">Click a card to add it · right-click to take one out · scroll to turn the page</span>'+big;dk.anim=false;}
function dkSide(){const p=pk(),n=PF.deck.length,okN=n>=DECKMIN&&n<=p.deckMax,cnt={};PF.deck.forEach(w=>cnt[w]=(cnt[w]||0)+1);
  const old=document.querySelector('#dk-side .rows'),sc=old?old.scrollTop:0;
  const ws=Object.keys(cnt).sort((a,b)=>(W[a].syl-W[b].syl)||a.localeCompare(b)),bars=[1,2,3,4,5].map(c=>PF.deck.filter(w=>c===5?W[w].syl>=5:W[w].syl===c).length),mx=Math.max(1,...bars);
  const row=w=>'<button class="lrow '+W[w].t+(dk.flash===w?(cnt[w]>1?' bump':' new'):'')+'" data-act="dminus" data-w="'+esc(w)+'" data-pv="'+esc(w)+'" aria-label="'+esc(w)+', '+cnt[w]+' in deck. Click to take one out."'+(ART[w]!=null?' style="--art:url(assets/art/'+w+'.jpg)"':'')+'>'+inkb(W[w].syl)+'<span>'+esc(w)+stars(w)+'</span><b>×'+cnt[w]+'</b></button>';
  const groups=FILT.map(f=>{const g=ws.filter(w=>kindOf(w)===f[0]);return g.length?'<div class="lgrp"><span>'+f[1]+'</span><span>'+g.reduce((s,w)=>s+cnt[w],0)+'</span></div>'+g.map(row).join(''):'';}).join(''),rest=ws.filter(w=>!FILT.some(f=>kindOf(w)===f[0])).map(row).join('');
  $('dk-side').innerHTML='<h2>My deck</h2><div class="rows">'+(groups+rest||'<p class="lempty">Your deck is empty. Click cards to add them.</p>')+'</div>'
    +'<div class="lfoot"><div class="chart" role="img" aria-label="Words by breath cost">'+bars.map((b,i)=>'<span><i style="height:'+Math.round(100*b/mx)+'%"></i><small>'+(i===4?'5+':i+1)+'</small></span>').join('')+'</div>'
    +'<div class="lcount'+(okN?'':' bad')+'"><b>'+n+'/'+p.deckMax+'</b><small>'+(n<DECKMIN?'add '+(DECKMIN-n)+' more':n>p.deckMax?'take out '+(n-p.deckMax):'at least '+DECKMIN)+'</small></div><button class="btn wax" data-act="new"'+(okN?'':' disabled')+'>Play</button></div>';
  const rows=document.querySelector('#dk-side .rows');if(rows){rows.scrollTop=sc;if(dk.flash){const f=rows.querySelector('.lrow.new,.lrow.bump');if(f&&f.scrollIntoView)f.scrollIntoView({block:'nearest'});}}dk.flash=null;}
function dkBar(){return FILT.map(f=>'<button class="med'+(dk.type===f[0]?' on':'')+'" data-act="dfilt" data-t="'+f[0]+'" aria-pressed="'+(dk.type===f[0])+'"><img src="assets/ds/f_'+f[0]+'.webp" alt=""><small>'+f[1]+'</small></button>').join('')+'<span class="sep"></span>'+[1,2,3,4,5].map(c=>'<button class="chip ink'+(dk.cost===c?' on':'')+'" data-act="dcost" data-c="'+c+'" aria-label="Breath cost '+(c===5?'5 or more':c)+'"><span>'+(c===5?'5+':c)+'</span></button>').join('')
  +'<span class="sep"></span><button class="chip'+(dk.all?' on':'')+'" data-act="dall">'+(dk.all?'Showing every word':'Show words I lack')+'</button>';}
function renderDeck(){
  if(!$('dk-grid'))$('view-deck').innerHTML='<div class="scene deckscene"><div class="scenetop"><input id="dk-q" type="search" placeholder="Search words…" aria-label="Search words"><div id="dk-bar" class="chips"></div><span class="ctr" id="dk-gold"></span></div>'
    +'<div class="deckcols"><div id="dk-grid"></div><aside id="dk-side" aria-label="My deck"></aside></div></div>'
    +'<details class="howbox"><summary>How refining works</summary><p class="lead"><strong>Refining</strong> improves every copy of a word you own. A refined thing has 2 more vigour; exalted, 2 more again and it costs 1 less breath. A refined verb costs 1 less breath; exalted, its effect gains a multiple. A refined adjective costs nothing; exalted, it also gives 2 vigour. Refined categories and weather cost 1 less. A deck needs '+DECKMIN+' to '+pk().deckMax+' words, with at most '+pk().copies+' copies of each. Changes take effect in your next match.</p></details>';
  $('dk-bar').innerHTML=dkBar();$('dk-gold').innerHTML='<img src="assets/ds/coins.webp" alt=""><b>'+PF.gold+'</b><small>ink</small>';dkGrid();dkSide();fit();
}
document.addEventListener('input',e=>{if(e.target.id==='dk-q'){dk.anim=true;dk.dir=1;dk.q=e.target.value;dk.page=0;dk.sel=null;dkGrid();}});
function grimoire(){const ks=Object.keys(RX),f=PF.found||{};
  const th=w=>'<span class="rth"'+(ART[w]!=null?' style="background-image:url(assets/art/'+w+'.jpg)"':'')+'><em>'+esc(w)+'</em></span>',q='<span class="rth q"><em>?</em></span>';
  const FXN={scald:'scalds all opposite',blind:'blinds the living opposite',heal:'gives 3 life',blast:'a blast: 4 to all opposite',firestorm:'a firestorm',inkburst:'3 breath'};
  return '<div class="rxbook">'+ks.map(k=>{const x=RX[k];return f[k]?'<div class="rxrow">'+th(x.a)+'<i>+</i>'+th(x.b)+'<i>→</i>'+(x.r?th(x.r):'<span class="rth q"><em>✦</em></span>')+'<small>'+[x.need?NEED[x.need][0]:'',FXN[x.fx]||''].filter(Boolean).join('; ')+'</small></div>'
    :'<div class="rxrow">'+(PF.owned[x.a]?th(x.a):q)+'<i>+</i>'+q+'<i>→</i>'+q+'</div>';}).join('')+'</div>';}
let bkS={tab:'cards',page:0,type:null,dir:1,sel:null};
function bkWords(){let ws=ALLWORDS.slice();if(bkS.type)ws=ws.filter(w=>kindOf(w)===bkS.type);return ws.sort((a,b)=>((PF.owned[b]?1:0)-(PF.owned[a]?1:0))||(FILT.findIndex(f=>f[0]===kindOf(a))-FILT.findIndex(f=>f[0]===kindOf(b)))||(W[a].syl-W[b].syl)||a.localeCompare(b));}
function bkLeaf(html,head,foot,side){return '<div class="leaf '+side+'"><header>'+head+'</header><div class="leafbody">'+html+'</div><footer>'+foot+'</footer></div>';}
function renderLex(){if(view!=='book')return;const host=$('lex');
  if(!host.querySelector('.bookscene'))host.innerHTML='<div class="scene bookscene"><div class="scenetop"><div class="booktabs" id="bk-tabs"></div><div id="bk-bar" class="chips"></div><span class="ctr" id="bk-ctr"></span></div><div class="book" id="bk-book"></div></div>';
  const own=Object.keys(PF.owned).filter(w=>PF.owned[w]>0).length,nf=Object.keys(PF.found||{}).length,ks=Object.keys(RX),f=PF.found||{};
  $('bk-tabs').innerHTML=[['cards','Collection'],['rx','Reactions'],['rules','Rules']].map(([k,l])=>'<button class="tab'+(bkS.tab===k?' on':'')+'" data-act="bk" data-v="'+k+'" aria-pressed="'+(bkS.tab===k)+'">'+l+'</button>').join('');
  $('bk-bar').innerHTML=bkS.tab==='cards'?'':bkS.tab==='zz'?FILT.map(x=>'<button class="med'+(bkS.type===x[0]?' on':'')+'" data-act="bkfilt" data-t="'+x[0]+'" aria-pressed="'+(bkS.type===x[0])+'"><img src="assets/ds/f_'+x[0]+'.webp" alt=""><small>'+x[1]+'</small></button>').join(''):'';
  $('bk-ctr').innerHTML=bkS.tab==='rx'?'<img src="assets/ds/vial.webp" alt=""><b>'+nf+'/'+ks.length+'</b><small>reactions found</small>':'<img src="assets/ds/f_noun.webp" alt="" style="width:26px;height:26px"><b>'+own+'/'+ALLWORDS.length+'</b><small>words owned</small>';
  let L='',R='',pages=1,per;
  if(bkS.tab==='cards'){const ws=bkWords();per=15;pages=Math.max(1,Math.ceil(ws.length/per));bkS.page=Math.max(0,Math.min(bkS.page,pages-1));const part=ws.slice(bkS.page*per,(bkS.page+1)*per);
    if(!bkS.sel||!part.includes(bkS.sel))bkS.sel=part[0]||null;const s=bkS.sel,d=s&&W[s],n=s?PF.owned[s]||0:0,inD=s?PF.deck.filter(x=>x===s).length:0,cnt=k=>{const a=ALLWORDS.filter(w=>!k||kindOf(w)===k);return a.filter(w=>PF.owned[w]).length+' / '+a.length;};
    const rail='<nav class="cx-rail" aria-label="Kinds of word">'+[[null,'All words']].concat(FILT).map(x=>'<button class="cx-k'+(bkS.type===x[0]?' on':'')+'" data-act="bkfilt" data-t="'+(x[0]||'')+'" aria-pressed="'+(bkS.type===x[0])+'">'+(x[0]?'<img src="assets/ds/f_'+x[0]+'.webp" alt="">':'<i class="cx-all"></i>')+'<b>'+x[1]+'</b><small>'+cnt(x[0])+'</small></button>').join('')+'</nav>';
    const grid='<div class="cx-mid"><div class="cx-grid'+(bkS.anim?' in':'')+'">'+part.map((w,k)=>'<button class="cx-c'+(PF.owned[w]?'':' lockd')+(w===s?' on':'')+'" data-act="bksel" data-v="'+esc(w)+'" style="--k:'+k+'" aria-label="'+esc(w)+(PF.owned[w]?'':', not owned')+'" aria-pressed="'+(w===s)+'"><div class="card mini static '+W[w].t+'">'+miniFace(w,{ink:W[w].syl,lv:PF.up[w]||0,up:PF.up})+'</div></button>').join('')+'</div>'
      +'<div class="cx-pg"><button class="cx-ar" data-act="bkpage" data-d="-1"'+(bkS.page?'':' disabled')+' aria-label="Previous page"></button><span>Page '+(bkS.page+1)+' of '+pages+'</span><button class="cx-ar nx" data-act="bkpage" data-d="1"'+(bkS.page<pages-1?'':' disabled')+' aria-label="Next page"></button></div></div>';
    const det=s?'<aside class="cx-det t'+tierOf(s)+'" aria-live="polite"><div class="jpc cx-card'+(n?'':' lockd')+'">'+fullFace(s,{ink:d.syl,lv:PF.up[s]||0,up:PF.up})+'</div><h3>'+esc(s)+'</h3><i class="cx-band"></i><small>'+esc(TIERN[tierOf(s)]+' \u00b7 '+kindOfW(s))+'</small><p>'+esc(d.gloss||'')+'</p><dl><div><dt>Owned</dt><dd>'+n+'</dd></div><div><dt>In deck</dt><dd>'+inD+'</dd></div><div><dt>'+(n?'Copy':'Price')+'</dt><dd>'+goldPrice(s)+' ink</dd></div></dl></aside>':'<aside class="cx-det"><p>No words of this kind.</p></aside>';
    $('bk-book').innerHTML='<div class="codex">'+rail+grid+det+'</div>';bkS.anim=false;fit();return;}
  if(bkS.tab==='cards'){const ws=bkWords();per=8;pages=Math.max(1,Math.ceil(ws.length/(per*2)));bkS.page=Math.max(0,Math.min(bkS.page,pages-1));
    const cell=(w,k)=>{const d=W[w],n=PF.owned[w]||0;return '<figure class="'+(n?'':'lockd')+'" style="--k:'+k+'"><div class="card mini static '+d.t+'" tabindex="0" data-pv="'+esc(w)+'">'+miniFace(w,{ink:d.syl,lv:PF.up[w]||0,up:PF.up})+'</div><figcaption>'+(n?'owned · '+n:goldPrice(w)+' ink')+'</figcaption></figure>';};
    const leaf=(i,side)=>{const part=ws.slice((bkS.page*2+i)*per,(bkS.page*2+i+1)*per),kinds=[...new Set(part.map(kindOf))].map(k=>(FILT.find(x=>x[0]===k)||[0,k])[1]);
      return bkLeaf(part.length?'<div class="gal">'+part.map((w,k)=>cell(w,k+i*4)).join('')+'</div>':'<p class="leafnone">The rest of this page is blank.</p>','<h3>'+(kinds.join(' & ')||'—')+'</h3><span>'+(part.length?part.filter(w=>PF.owned[w]).length+' of '+part.length+' owned':'')+'</span>','<span>'+(bkS.page*2+i+1)+'</span>',side);};
    L=leaf(0,'l');R=leaf(1,'r');}
  else if(bkS.tab==='rx'){per=6;pages=Math.max(1,Math.ceil(ks.length/(per*2)));bkS.page=Math.max(0,Math.min(bkS.page,pages-1));
    const th=w=>'<span class="rth"'+(ART[w]!=null?' style="background-image:url(assets/art/'+w+'.jpg)"':'')+(W[w]?' data-pv="'+esc(w)+'"':'')+'><em>'+esc(w)+'</em></span>',q='<span class="rth q"><em>?</em></span>';
    const FXN={scald:'scalds all opposite',blind:'blinds the living opposite',heal:'gives 3 life',blast:'a blast: 4 to all opposite',firestorm:'a firestorm',inkburst:'3 breath'};
    const row=(k,i)=>{const x=RX[k];return f[k]?'<div class="rxrow" style="--k:'+i+'">'+th(x.a)+'<i>+</i>'+th(x.b)+'<i>→</i>'+(x.r?th(x.r):'<span class="rth q"><em>✦</em></span>')+'<small>'+[x.need?NEED[x.need][0]:'',FXN[x.fx]||''].filter(Boolean).join('; ')+'</small></div>'
      :'<div class="rxrow unk" style="--k:'+i+'">'+(PF.owned[x.a]?th(x.a):q)+'<i>+</i>'+q+'<i>→</i>'+q+'<small>not yet found</small></div>';};
    const leaf=(i,side)=>{const part=ks.slice((bkS.page*2+i)*per,(bkS.page*2+i+1)*per);return bkLeaf(part.map((k,j)=>row(k,j+i*3)).join('')||'<p class="leafnone">The rest of this page is blank.</p>','<h3>'+(i?'&nbsp;':'Reactions')+'</h3><span>'+(part.length?part.filter(k=>f[k]).length+' of '+part.length+' found':'')+'</span>','<span>'+(bkS.page*2+i+1)+'</span>',side);};
    L=leaf(0,'l');R=leaf(1,'r');}
  else{const how=document.querySelector('.howbox'),src=how?how.innerHTML.replace(/<summary>[\s\S]*?<\/summary>/,''):'';L='<div class="leaf rules"><header><h3>The rules</h3><span>scroll to read</span></header><div class="rulescroll">'+src+'</div></div>';}
  $('bk-book').innerHTML='<button class="pg" data-act="bkpage" data-d="-1"'+(bkS.page&&bkS.tab!=='rules'?'':' disabled')+' aria-label="Previous page"><img src="assets/ds/arrow.webp" alt=""></button><div class="spread'+(bkS.anim?' in':'')+(bkS.tab==='rules'?' one':'')+'" style="--dir:'+bkS.dir+'">'+L+R+'<i class="ribbon"></i></div><button class="pg" data-act="bkpage" data-d="1"'+(bkS.page<pages-1&&bkS.tab!=='rules'?'':' disabled')+' aria-label="Next page"><img src="assets/ds/arrow.webp" alt=""></button>';
  bkS.anim=false;fit();
}
const GEAR='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="3.2"/><path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.3 5.3l2.1 2.1M16.6 16.6l2.1 2.1M5.3 18.7l2.1-2.1M16.6 7.4l2.1-2.1"/><circle cx="12" cy="12" r="6.6"/></svg>';
function renderNav(){try{const n=sNode(sSt().at);if(n){document.documentElement.style.setProperty('--place','url('+hereBg(n)+')');jPre(hereBg(n));xsPre(n.id);(SHOTS[n.id]||[]).forEach(k=>jPre('assets/sc/'+n.id+'_'+k+'.jpg'));}}catch(e){}
  const r=rankOf(PF.xp),next=RANKS[r+1];
  if(JV.includes(view)||(view==='match'&&S&&(S.story||S.puz)&&live()))jm||setJm(true);
  const tab=(v,l,on,x)=>'<button class="tab'+(on?' on':'')+(x||'')+'" data-act="go" data-v="'+v+'">'+l+'</button>',hoard=['deck','scrip','book'].includes(view),duel=S&&(S.story||S.puz)&&live()&&S.over==null;
  const purse='<span class="purse" title="Ink"><img src="'+INL['ic/coin.png']+'" alt=""><b>'+PF.gold+'</b> ink</span>',gear='<button class="gear" data-act="settings" aria-label="Settings" title="Settings">'+GEAR+'</button>';
  $('nav').innerHTML=jm?
    tab('story','Map',view==='story')+tab('deck','Wordhoard',hoard)
    +(hoard?'<span class="subtabs">'+[['deck','Deck'],['scrip','Scriptorium'],['book','Grimoire']].map(x=>'<button class="stab'+(view===x[0]?' on':'')+'" data-act="go" data-v="'+x[0]+'">'+x[1]+'</button>').join('')+'</span>':'')
    +'<button class="tab whistle" data-act="jorc" title="'+esc(famName(true))+' carries an oracle glass: pay to look, see three words, keep one">Oracle</button>'
    +(duel?tab('match',S.puz?'The find':'The duel',view==='match',' hot'):'')
    +'<span class="navsp"></span>'+purse+'<span class="purse" title="'+(next?(next.xp-PF.xp)+(next.xp-PF.xp===1?' step to ':' steps to ')+esc(next.n):'The Work is complete')+'"><img src="assets/ds/g'+Math.min(3,Math.floor(r/3))+'.webp" alt=""><b>'+esc(RANKS[r].n)+'</b></span>'
    +'<button class="avatar'+(view==='ach'?' on':'')+'" data-act="profile" aria-label="Your profile and feats" title="'+esc(meFull())+'"><img src="'+meImg()+'" alt=""></button>'+gear
    +'<button class="leave" data-act="jexit" title="Leave the journey and go back to the title screen">Leave journey</button>'
    :'<span class="navsp"></span>'+(view==='match'?'<span class="navnote">Quick match</span>':'')+purse+gear+'<button class="leave" data-act="go" data-v="home">Title screen</button>';
  for(const v of ['match','shop','deck','home','book','ach','story','scrip'])$('view-'+v).hidden=view!==v;
  {const lob=view==='match'&&!live();$('view-match').hidden=view!=='match'||lob;$('view-lobby').hidden=!lob;if(lob)renderLobby();}
  if(renderNav.last!==view){const e=$('view-'+view);e.classList.remove('vin');void e.offsetWidth;e.classList.add('vin');renderNav.last=view;}
  document.body.classList.toggle('at-home',view==='home');
}
function vsScreen(){const r=rivalOf(),me=RANKS[rankOf(PF.xp)].n;let e=document.getElementById('vs');if(e)e.remove();
  e=document.createElement('div');e.id='vs';
  const side=(img,n,sub,cls)=>'<div class="vsp '+cls+'"><img src="'+img+'" alt=""><b>'+n+'</b><small>'+sub+'</small></div>';
  e.innerHTML='<div class="vsbox"><p id="vs-t">Finding an opponent</p><div class="vsrow">'+side('assets/player.jpg','You',esc(me),'')+'<span class="vsmid">against</span><span id="vs-r">'+side('assets/rival.jpg','…','searching','seek')+'</span></div></div>';
  if(S.story){const n=sNode(S.story);e.querySelector('#vs-t').textContent=n.place+' · '+n.spot;e.querySelector('#vs-r').innerHTML=side(rvImg(r),esc(r.n),esc(r.rank||''),'found');e.querySelector('.vsbox').insertAdjacentHTML('beforeend','<p class="vsrule"><b>House rule</b> '+esc(n.rule)+'</p><p class="vsskip">Click to begin</p>');}
  document.body.appendChild(e);let done=false;
  const go=()=>{if(done)return;done=true;view='match';renderAll();window.scrollTo(0,0);const hd=$('hand');hd.classList.add('deal');sfx('page');setTimeout(()=>hd.classList.remove('deal'),1100);e.classList.add('out');setTimeout(()=>e.remove(),320);setTimeout(()=>emote(S&&S.retort?S.retort:'Good luck.',true),900);};
  e.addEventListener('click',go);
  setTimeout(()=>{if(done||S.story)return;const t=document.getElementById('vs-t'),rr=document.getElementById('vs-r');if(!t)return;t.textContent='Opponent found';rr.innerHTML=side(rvImg(r),esc(r.n),esc(r.rank||''),'found');sfx('stamp');},RM?300:1200*SPD);
  setTimeout(go,S.story?7000:RM?1200:2900*SPD);}
/* the first-match coach */
const COACH=[['Bring a thing','Tap a noun in your hand (it has a red seal), then press Speak.',()=>S.things.some(t=>t.side===0&&!t.props.includes('ground')&&!t.props.includes('spell'))],
  ['Give it a verb','Tap your thing, then a verb in your hand, then Speak. It goes for your opponent.',()=>S.things.some(t=>t.side===0&&t.verbs&&t.verbs.length)],
  ['End your turn','Press End turn. Your magpie brings words to buy: take one, or move on.',()=>!!S.tutEnd],
  ['Make a reaction','Tap a thing, then “fuse”, then another thing. Each new reaction adds 2 to every blow you strike.',()=>Object.keys((S.rxDone||[{}])[0]).length>0]];
function renderCoach(){const c=$('coach');if(!c)return;if(PF.tut||!S||S.puz||S.phase==='over'){c.innerHTML='';return;}
  let k=S.tutK||0;while(k<COACH.length&&COACH[k][2]())k++;S.tutK=k;
  if(k>=COACH.length){PF.tut=1;save();c.innerHTML='<h3>First match</h3><ol><li class="now"><b>You have the basics</b><span>Everything else is in the Grimoire.</span></li></ol>';return;}
  c.innerHTML='<h3>First match <button data-act="tutskip">Skip</button></h3><ol>'+COACH.map((s,i)=>'<li class="'+(i<k?'done':i===k?'now':'')+'"><b>'+s[0]+'</b><span>'+s[1]+'</span></li>').join('')+'</ol>';}
const live=()=>!!(S&&S.live);
function renderLobby(){const p=pk(),n=PF.deck.length,ok=n>=DECKMIN&&n<=p.deckMax,L=PF.last,cnt=k=>PF.deck.filter(w=>kindOf(w)===k).length;
  const aside=(document.querySelector('#view-home .home-rank')||{}).outerHTML||'';
  $('view-lobby').innerHTML='<div class="home lobby"><div><p class="home-kick">The duelling bench · quick match</p><h2 class="lob-title">Find a match</h2><p class="lob-quick">A short duel: you both begin at '+QUICKLIFE+' life, so it is over in a few minutes.</p>'
    +(L?'<p class="lob-last '+(L.r==='win'?'win':L.r==='loss'?'loss':'')+'"><img src="'+rvImg({p:L.p})+'" alt=""><span>Last match: <b>'+(L.r==='win'?'Victory':L.r==='loss'?'Defeat':'Draw')+'</b> against '+esc(L.n)+(L.gold?' · +'+L.gold+' ink':'')+'</span></p>':'<p class="home-sub">You will be matched with an opponent near your rank.</p>')
    +'<div class="home-menu"><button class="mbtn main" data-act="new"'+(ok?'':' disabled')+'>Find an opponent</button><button class="mbtn" data-act="go" data-v="story">Journey<small>change your deck and buy words there</small></button><button class="mbtn" data-act="go" data-v="home">Title screen</button></div>'
    +'<p class="lob-deck'+(ok?'':' bad')+'">'+(ok?'Your deck: <b>'+n+' words</b> · '+cnt('noun')+' things, '+cnt('verb')+' verbs, '+cnt('adj')+' adjectives, '+cnt('event')+' spells.':'<b>Your deck has '+n+' words.</b> It needs '+DECKMIN+' to '+p.deckMax+' before you can play.')+'</p></div>'+aside+'</div>';}
function inPlay(){return S&&S.phase!=='over'&&S.over==null&&((S.log||[]).length>(S.log0==null?1:S.log0)||S.things.length>0);}
const COIN='<img src="'+INL['ic/coin.png']+'" alt="gold">';
function renderHome(){
  const r=rankOf(PF.xp),next=RANKS[r+1],f=Object.keys(PF.found||{}).length,tot=Object.keys(RX).length,go=live()&&S.over==null;
  $('view-home').innerHTML='<div class="home"><button class="gear" data-act="settings" aria-label="Settings" title="Settings">'+GEAR+'</button>'
    +'<div><p class="home-kick">A card game of living words</p><h2 class="home-title logo"><img src="assets/logo.webp" alt="Word Alchemy"></h2><p class="home-sub">Every card is a word. Every sentence does what it says.</p>'
    +'<div class="home-menu">'+'<button class="mbtn main" data-act="go" data-v="story">Journey<small>'+(go&&(S.story||S.puz)?'a duel is waiting for you':'the wordsmith’s road · single player')+'</small></button>'+(go&&!(S.story||S.puz)?'<button class="mbtn" data-act="go" data-v="match">Continue match<small>your quick match is waiting</small></button><button class="mbtn" data-act="new">New quick match</button>':'<button class="mbtn" data-act="new">Quick match<small>a short duel with your deck</small></button>')
    +''+'<button class="mbtn soon" disabled>Multiplayer<small>against other wordsmiths · coming</small></button></div></div>'
    +'<aside class="home-rank" aria-label="Your standing"><div class="hr-seal"><img src="assets/ds/g'+Math.min(3,Math.floor(r/3))+'.webp" alt=""></div><div class="hr-ban"><b>'+esc(RANKS[r].n)+'</b></div>'
    +'<p class="hr-next">'+(next?(next.xp-PF.xp)+(next.xp-PF.xp===1?' step to ':' steps to ')+esc(next.n):'The Great Work is complete.')+'</p><div class="hr-bar"><i style="width:'+(next?Math.round(100*(PF.xp-RANKS[r].xp)/Math.max(1,next.xp-RANKS[r].xp)):100)+'%"></i></div>'
    +'<div class="hr-stats"><div><img src="assets/end/m_gold.webp" alt=""><b>'+PF.gold+'</b><small>ink</small></div><div><img src="assets/end/m_purse.webp" alt=""><b>'+PF.wins+'–'+PF.losses+'</b><small>won–lost</small></div><div><img src="assets/end/m_vial.webp" alt=""><b>'+f+'/'+tot+'</b><small>reactions</small></div></div>'
    +'<div class="qnote"><h4>Daily quests</h4><ul><li'+(PF.dayWin===today()?' class="done"':'')+'><span>First win of the day</span><small>+'+DAILY+' ink</small></li>'+quests().l.map(q=>{const d=QP.find(x=>x.id===q.id);return d?'<li'+(q.done?' class="done"':'')+'><span>'+esc(d.t)+(q.done||d.goal<2?'':' <em>'+q.n+' of '+d.goal+'</em>')+'</span><small>+'+d.gold+' ink</small></li>':'';}).join('')+'</ul></div></aside></div>';
}
const lsNum=(k,d)=>{try{const v=parseFloat(localStorage.getItem(k));if(v>=0&&v<=1)return v;}catch(e){}return d;},lsSet=(k,v)=>{try{localStorage.setItem(k,v);}catch(e){}};
let vol=lsNum('word-alchemy-vol',.55),vMus=lsNum('word-alchemy-mus',.4),vAmb=lsNum('word-alchemy-amb',.45),SPD=lsNum('word-alchemy-spd',1)||1,bandOn=false;
/* music: slow modal pad with a far-off plucked line; ambience: room tone and a crackling fire. All synthesised. */
const MIDI=n=>440*Math.pow(2,(n-69)/12),CHORDS=[[38,45,53,57],[36,43,52,55],[41,48,53,57],[33,45,52,60],[38,45,50,53],[34,41,50,53]],PENT=[62,65,67,69,72,74,77];
function padNote(f,t,dur,v){const a=AC,g=a.createGain(),lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=900;lp.Q.value=.4;
  g.gain.setValueAtTime(0.0001,t);g.gain.linearRampToValueAtTime(v,t+dur*.35);g.gain.linearRampToValueAtTime(v*.8,t+dur*.7);g.gain.linearRampToValueAtTime(0.0001,t+dur);
  for(const d of[-5,6]){const o=a.createOscillator();o.type='triangle';o.frequency.value=f;o.detune.value=d;o.connect(lp);o.start(t);o.stop(t+dur+.1);}
  lp.connect(g);g.connect(a.mus);}
function pluck(f,t,v){const a=AC,o=a.createOscillator(),g=a.createGain();o.type='sine';o.frequency.value=f;g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(v,t+.02);g.gain.exponentialRampToValueAtTime(0.0001,t+2.6);o.connect(g);g.connect(a.mus);o.start(t);o.stop(t+2.7);}
function crackle(t){const a=AC,s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=a.nz;f.type='bandpass';f.frequency.value=900+Math.random()*2600;f.Q.value=2;
  const v=.05+Math.random()*.13;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(0.0001,t+.03+Math.random()*.05);s.connect(f);f.connect(g);g.connect(a.amb);s.start(t,Math.random()*.9);s.stop(t+.12);}
function band(){if(bandOn||!ac())return;bandOn=true;const a=AC;
  const s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=a.nz;s.loop=true;f.type='lowpass';f.frequency.value=220;g.gain.value=.11;s.connect(f);f.connect(g);g.connect(a.amb);s.start();
  let nextC=a.currentTime+.3,ci=0,nextK=a.currentTime+1,nextP=a.currentTime+5;
  setInterval(()=>{if(a.state!=='running')return;const now=a.currentTime;
    while(nextC<now+1.5){const ch=CHORDS[ci%CHORDS.length];ch.forEach((n,i)=>padNote(MIDI(n),nextC,11,i?.035:.06));ci+=Math.random()<.2?2:1;nextC+=9;}
    while(nextP<now+1.5){pluck(MIDI(PENT[Math.floor(Math.random()*PENT.length)]+(Math.random()<.25?12:0)),nextP,.03+Math.random()*.03);nextP+=[1.5,3,4.5,6,9][Math.floor(Math.random()*5)];}
    while(nextK<now+1.5){crackle(nextK);nextK+=Math.random()<.3?.05+Math.random()*.1:.3+Math.random()*1.8;}
  },700);}
document.addEventListener('pointerdown',()=>{if(!muted)band();},{passive:true});
let setAsk=false;
let scS={sel:null};const copyPrice=w=>goldPrice(w)*(1+(PF.up[w]||0));
function renderScrip(){if(view!=='scrip')return;const host=$('view-scrip'),ws=Object.keys(PF.owned).filter(w=>PF.owned[w]>0&&W[w]).sort((a,b)=>(PF.owned[b]-PF.owned[a])||a.localeCompare(b));
  const old=host.querySelector('.sc-grid'),sc=old?old.scrollTop:0;
  host.innerHTML='<div class="scene scripscene"><div class="scenetop"><div><h2 class="sc-h">The Scriptorium</h2><p class="say">“Bring me four of the same word and I will make you one that is worth the four.”</p></div><span class="ctr purse2"><img src="assets/ds/purse.webp" alt=""><b>'+PF.gold+'</b><small>ink</small></span></div>'
   +'<div class="sc-body"><div class="sc-grid">'+ws.map(w=>{const own=PF.owned[w],lv=PF.up[w]||0,price=copyPrice(w),can=own>=4&&lv<2;
     return '<div class="sc-cell'+(can?' ready':'')+'"><div class="card mini static '+W[w].t+'" tabindex="0" data-pv="'+esc(w)+'">'+miniFace(w,{ink:W[w].syl,lv,up:PF.up})+'</div><div class="sc-pips" aria-label="'+own+' owned">'+[0,1,2,3].map(k=>'<i'+(k<own?' class="on"':'')+'></i>').join('')+(own>4?'<b>+'+(own-4)+'</b>':'')+'</div>'
      +(lv>=2?'<span class="sc-max">Twice illuminated</span>':can?'<button class="btn sc-il" data-act="sillum" data-w="'+esc(w)+'">Illuminate</button>':'<button class="btn ghost" data-act="scopy" data-w="'+esc(w)+'"'+(PF.gold>=price?'':' disabled')+'>Copy out · '+price+'</button>')+'</div>';}).join('')+'</div>'
   +'<aside class="sc-side"><h3>Illumination</h3><p>Four copies of one word are bound into a single <b>illuminated</b> word. Its name is written in gold, and it is stronger for good. Illuminate it a second time and the whole card is gilded:</p><ul><li>a thing has 2 more vigour</li><li>a verb or adjective is exalted, and costs less breath</li></ul><p>An illuminated word can be illuminated once more, from four copies again.</p><h3>Copies</h3><p>The scribes will copy out any word you own for its price in ink. An illuminated word is finer work: copies cost double, and triple once it is twice illuminated. The oracle shows new words, and the road gives one of each word it teaches.</p></aside></div></div>';
  const g=host.querySelector('.sc-grid');if(g)g.scrollTop=sc;fit();}
const lsGet=k=>{try{return localStorage.getItem(k);}catch(e){return null;}};
function profile(open){let e=document.getElementById('prof');if(e)e.remove();if(!open)return;
  const s=PF.st||{},st=sSt(),r=rankOf(PF.xp),next=RANKS[r+1],m=meSt(),t=meTitle(),g=k=>aval(k)||0,wins=PF.wins||0,losses=PF.losses||0,played=Math.max(g('matches'),wins+losses),mains=STORY.nodes.filter(n=>n.main),done=mains.filter(n=>st.done[n.id]).length,got=ACH.filter(a=>PF.ach&&PF.ach[a[0]]).length;
  const used=Object.keys(st.fin||{}).map(k=>st.fin[k]),fav=used.length?used.slice().sort((x,y)=>used.filter(z=>z===y).length-used.filter(z=>z===x).length)[0]:null;
  const row=(l,v)=>'<div class="pf-row"><small>'+l+'</small><b>'+v+'</b></div>',badge=(q,n,l)=>'<div class="pf-q"><i style="background-image:url(assets/pf/'+q+'.webp)"><b>'+n+'</b></i><small>'+l+'</small></div>';
  const stage=meStage(),lands=[['Nigredo','The Black Country'],['Albedo','The White Road'],['Citrinitas','The Yellow Country'],['Rubedo','The Red Country']];
  e=document.createElement('div');e.id='prof';e.setAttribute('role','dialog');e.setAttribute('aria-modal','true');e.setAttribute('aria-label','Your profile');
  e.innerHTML='<div class="pf"><button class="profx" data-act="profx" aria-label="Close">×</button>'
   +'<div class="pf-l"><div class="pf-port"><img src="'+meImg(true)+'" alt=""><i></i></div>'
   +'<div class="pf-name"><b>'+esc(meName())+'</b></div><p class="pf-title">'+(t?esc(t)+' · ':'')+'Journeyman of Emberwick</p>'
   +'<div class="pf-meds">'+lands.map((L,i)=>{const on=i<stage||(i===0),past=i<stage;return '<div class="pf-med'+(past?' past':on?' on':' shut')+'" title="'+L[1]+'"><img src="'+(i===0&&!past?'assets/player.jpg':'assets/me/'+(i+ (past?1:0) > 4?4:(past?i+1:i+1))+'.jpg')+'" alt=""><i></i><small>'+L[0]+'</small></div>';}).join('')+'</div></div>'
   +'<div class="pf-sheet"><div class="pf-cart"><b>'+esc(RANKS[r].n)+'</b></div><div class="pf-ring" title="'+(next?(next.xp-PF.xp)+' steps to '+esc(next.n):'The Work is complete')+'"><img src="assets/ds/g'+Math.min(3,Math.floor(r/3))+'.webp" alt=""></div>'
   +'<p class="pf-next">'+(next?(next.xp-PF.xp)+(next.xp-PF.xp===1?' step to ':' steps to ')+esc(next.n):'The Work is complete')+(PF.fam?' · with '+esc(PF.fam.name)+' the magpie':'')+'</p>'
   +'<div class="pf-rows">'+row('Master','Anselm Roux')+row('Country',esc(REG[(sNode(st.at)||{}).rg||0].region))+row('Hoard',g('owned')+' words, '+Object.keys(st.hoard).length+' from the road')+row('Deck',esc(m.deck||'The apprentice’s dozen'))+row('Signature',(m.sig?esc(m.sig):'none chosen')+(fav?' · ends with '+esc(fav):''))+row('Record',played+' duels, '+wins+' won, '+(played?Math.round(100*wins/played):0)+'%')+'</div>'
   +'<div class="pf-qs">'+badge('q1',s.best||0,'best run')+badge('q2',g('found'),'reactions')+badge('q3',got,'feats')+badge('q4',s.kills||0,'destroyed')+'</div>'
   +'</div>'
   +'<div class="pf-btns"><button data-act="go" data-v="story"><span>Journal</span></button><button data-act="go" data-v="ach"><span>Feats</span></button><button data-act="go" data-v="deck"><span>Deck</span></button></div></div>';
  document.body.appendChild(e);e.addEventListener('click',ev=>{if(ev.target===e||ev.target.closest('[data-act=go]'))profile(false);});}
function settings(open){let e=document.getElementById('set');if(e)e.remove();if(!open){setAsk=false;return;}
  e=document.createElement('div');e.id='set';e.setAttribute('role','dialog');e.setAttribute('aria-modal','true');e.setAttribute('aria-label','Settings');
  const sl=(id,label,v)=>'<label class="setrow"><span>'+label+'</span><input type="range" id="'+id+'" min="0" max="1" step="0.05" value="'+v+'"'+(muted?' disabled':'')+'></label>';
  e.innerHTML='<div class="setbox"><h2>Settings</h2>'
    +'<div class="setrow"><span id="set-s">Sound</span><button class="sw" role="switch" aria-labelledby="set-s" aria-checked="'+(!muted)+'" data-act="mute"></button></div>'
    +sl('set-vol','Effects',vol)+sl('set-mus','Music',vMus)+sl('set-amb','Ambience',vAmb)
    +'<div class="setrow"><span>Animation speed</span><span class="seg"><button data-act="spd" data-v="1" aria-pressed="'+(SPD===1)+'">Normal</button><button data-act="spd" data-v="0.55" aria-pressed="'+(SPD!==1)+'">Fast</button></span></div>'
    +'<div class="setrow"><span id="set-m">Reduce motion</span><button class="sw" role="switch" aria-labelledby="set-m" aria-checked="'+RMU+'" data-act="rmset"></button></div>'
    +(setAsk===true?'<p class="setnote">This erases your ink, rank, words and deck for good.</p><div class="setbtns"><button class="btn danger" data-act="wipe">Erase everything</button><button class="btn ghost" data-act="wipeno">Keep my progress</button></div>'
      :(setAsk==='quit'?'<p class="setnote">Give up this match? It counts as a loss and pays nothing.</p><div class="setbtns"><button class="btn danger" data-act="quit">Surrender</button><button class="btn ghost" data-act="wipeno">Keep playing</button></div>':'')+(setAsk==='quit'?'':(view==='match'&&S&&S.over==null&&S.phase!=='over'?'<div class="setbtns"><button class="btn ghost" data-act="quitask">Surrender this match</button></div>':'')+'<div class="setbtns"><button class="btn ghost" data-act="tutagain">Replay the first-match guide</button><button class="btn ghost" data-act="wipeask">Reset progress</button></div>'
      +'<div class="setbtns">'+(view!=='home'?'<button class="btn ghost" data-act="go" data-v="home">Title screen</button>':'')+'<button class="btn" data-act="setclose">Done</button></div>'))+'</div>';
  document.body.appendChild(e);
  e.addEventListener('click',ev=>{if(ev.target===e)settings(false);});
  const bind=(id,key,fn)=>{const x=e.querySelector('#'+id);x.addEventListener('input',ev=>{fn(+ev.target.value);lsSet(key,ev.target.value);});};
  bind('set-vol','word-alchemy-vol',v=>{vol=v;if(AC)AC.fx.gain.value=v;});e.querySelector('#set-vol').addEventListener('change',()=>sfx('coin'));
  bind('set-mus','word-alchemy-mus',v=>{vMus=v;if(AC)AC.mus.gain.value=v;});bind('set-amb','word-alchemy-amb',v=>{vAmb=v;if(AC)AC.amb.gain.value=v;});
}
document.addEventListener('keydown',ev=>{if(ev.key==='Escape')settings(false);});
function renderAll(){renderNav();renderHome();renderMatch();if(view==='story')renderStory();else{jImm();const jp=document.getElementById('jpop');if(jp)jp.remove();}if(view==='ach')renderAch();if(view==='scrip')renderScrip();if(view==='book')renderLex();if(view==='shop')renderShop();if(view==='deck')renderDeck();renderLex();}
function keepMatch(){try{if(S&&S.live&&S.over==null&&!busy)localStorage.setItem('word-alchemy-match',JSON.stringify(S));else if(!S||!S.live||S.over!=null)localStorage.removeItem('word-alchemy-match');}catch(e){}}
function render(){keepMatch();renderNav();if(view==='home')renderHome();else if(view==='match'){renderMatch();if(fxQ){const q=fxQ;fxQ=null;if(S&&S.live)try{effects(q.b,q.n,false,false);}catch(e){}}}else if(view==='shop')renderShop();else if(view==='deck')renderDeck();else if(view==='ach')renderAch();else if(view==='story')renderStory();}

function pickCard(i){
  const w=S.players[0].hand[i],d=W[w];ui.msg='';
  if(usedIdx().includes(i)){ui.adjs=ui.adjs.filter(x=>x!==i);if(ui.verb===i)ui.verb=null;if(ui.clime===i)ui.clime=null;if(same(ui.subj,{k:'card',i}))ui.subj=null;if(same(ui.obj,{k:'card',i}))ui.obj=null;return;}
  if(d.t===CLIME){const a=ui.adjs.slice();clearUi();ui.adjs=a;ui.clime=i;return;}
  if(ui.clime!=null&&d.t!==ADJ)ui.clime=null;
  if(d.t===ADJ)ui.adjs.push(i);
  else if(d.t===VERB){ui.verb=i;ui.kverb=null;if(w==='fuse')ui.adjs=[];}
  else if(d.t===NOUN&&ui.verb!=null&&S.players[0].hand[ui.verb]==='fuse'&&ui.subj&&!isEvent(w)){ui.obj={k:'card',i};}
  else if(d.t===NOUN){if(!ui.subj||ui.subj.k==='card'&&W[S.players[0].hand[ui.subj.i]].t===NOUN)ui.subj={k:'card',i};else ui.msg='A noun from your hand can only be the subject. Objects must already be on the board.';}
  else if(d.t===CAT){if(!ui.subj)ui.subj={k:'card',i};else if(!ui.obj)ui.obj={k:'card',i};else ui.subj={k:'card',i};}
}
function pickRef(r){
  ui.msg='';ui.clime=null;
  if(same(ui.subj,r)){ui.subj=null;ui.kverb=null;return;}if(same(ui.obj,r)){ui.obj=null;return;}
  if(!ui.subj)ui.subj=r;else ui.obj=r;
}
/* ---- sound: made in the browser, no audio files ---- */
let AC=null,muted=false;try{muted=localStorage.getItem('word-alchemy-mute')==='1';}catch(e){}
function ac(){if(!AC){const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;AC=new C();AC.out=AC.createGain();AC.out.gain.value=muted?0:1;AC.out.connect(AC.destination);AC.fx=AC.createGain();AC.fx.gain.value=vol;AC.fx.connect(AC.out);AC.mus=AC.createGain();AC.mus.gain.value=vMus;AC.mus.connect(AC.out);AC.amb=AC.createGain();AC.amb.gain.value=vAmb;AC.amb.connect(AC.out);
    const n=AC.sampleRate,b=AC.createBuffer(1,n,n),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;AC.nz=b;}
  if(AC.state==='suspended')AC.resume();return AC;}
function tone(f0,f1,dur,type,vol,at){const a=AC,t=a.currentTime+(at||0),o=a.createOscillator(),g=a.createGain();o.type=type||'sine';o.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+.008);g.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(g);g.connect(a.fx);o.start(t);o.stop(t+dur+.03);}
function hiss(dur,vol,f0,f1,q,at,type){const a=AC,t=a.currentTime+(at||0),s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=a.nz;s.loop=true;f.type=type||'bandpass';f.Q.value=q||1;f.frequency.setValueAtTime(f0,t);if(f1&&f1!==f0)f.frequency.exponentialRampToValueAtTime(f1,t+dur);
  g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(vol,t+Math.min(.02,dur/4));g.gain.exponentialRampToValueAtTime(0.0001,t+dur);s.connect(f);f.connect(g);g.connect(a.fx);s.start(t,Math.random()*.5);s.stop(t+dur+.03);}
const SFX={
  ach(){[523,659,784,1047].forEach((f,i)=>{tone(f,f,.5,'triangle',.16,i*.09);tone(f*2,f*2,.35,'sine',.05,i*.09);});tone(131,131,.9,'sine',.25);hiss(.5,.08,4000,8000,1.5,.3);},
  achBig(){tone(98,98,1.4,'sine',.4);[392,523,659,784,1047,1319].forEach((f,i)=>{tone(f,f,.7,'triangle',.17,i*.08);tone(f*1.5,f*1.5,.5,'sine',.06,i*.08);});[523,659,784,1047].forEach(f=>tone(f,f,1.3,'sine',.11,.55));hiss(.9,.12,3000,9000,1.2,.5);},
  tick(){tone(1250,820,.045,'triangle',.11);hiss(.03,.05,3200,2400,2);},
  quill(){for(let i=0;i<4;i++)hiss(.07+Math.random()*.05,.16,2600+Math.random()*1800,1500,3,i*.085);},
  page(){hiss(.34,.2,500,1900,.8);tone(140,110,.25,'sine',.12);},
  thud(){tone(150,46,.2,'sine',.6);hiss(.09,.3,700,220,.9,0,'lowpass');},
  boom(){tone(110,34,.38,'sine',.75);hiss(.22,.4,900,160,.8,0,'lowpass');},
  crumble(){for(let i=0;i<6;i++)hiss(.06,.2,1400-i*170,600-i*60,2,i*.055);tone(200,60,.42,'triangle',.16);},
  chime(){tone(880,880,.3,'sine',.2);tone(1320,1320,.36,'sine',.13,.07);},
  shimmer(){[523,659,784,1047,1319].forEach((f,i)=>tone(f,f*1.01,.42,'sine',.15,i*.065));hiss(.6,.09,3000,7000,1.5);},
  bell(){[392,494,587,784].forEach((f,i)=>{tone(f,f,.95,'sine',.17,i*.03);tone(f*2.01,f*2.01,.5,'sine',.05,i*.03);});},
  drop(){hiss(.13,.16,2200,500,1);tone(190,70,.12,'sine',.38,.1);},
  coin(){tone(1975,1975,.09,'square',.045);tone(2637,2637,.24,'sine',.13,.06);},
  fire(){hiss(.55,.2,900,2800,.7);hiss(.3,.11,5000,2200,2,.1);},
  stamp(){tone(95,42,.22,'sine',.7);hiss(.07,.26,400,150,1,0,'lowpass');tone(620,300,.06,'triangle',.07,.02);},
  nope(){tone(180,130,.14,'sawtooth',.09);tone(150,100,.18,'sawtooth',.09,.11);},
  win(){[523,659,784,1047].forEach((f,i)=>tone(f,f,.5,'triangle',.18,i*.14));tone(1047,1047,1.1,'sine',.16,.56);tone(1319,1319,1.1,'sine',.11,.56);},
  lose(){[392,330,262,196].forEach((f,i)=>tone(f,f*.97,.55,'triangle',.17,i*.2));}
};
function sfx(n){if(muted||!SFX[n])return;try{if(ac())SFX[n]();}catch(e){}}

/* ---- feel: every sentence plays out instead of the board just changing ---- */
let busy=false,pv=null;
function pvOf(s){if(secretSay(S,1,s))return null;const h=S.players[1].hand,w=s&&s.subj&&s.subj.k==='card'?h[s.subj.i]:null;return w&&W[w].t===NOUN&&!isEvent(w)&&(s.verb!=null||s.kverb)?{w,adjs:(s.adjs||[]).map(i=>h[i])}:null;}
let wxFor=null,wxShown=null;
function climeIn(w){sfx('bell');setTimeout(()=>sfx(w==='storm'?'boom':w==='rain'||w==='flood'?'drop':'shimmer'),180);if(RM)return;let e=document.getElementById('wxin');if(e)e.remove();e=document.createElement('div');e.id='wxin';
  e.innerHTML='<div class="wxbig">'+'<span class="wxface" style="background-image:url(assets/art/'+w+'.jpg)"><b>'+esc(Cap(w))+'</b></span>'+'<h3>'+esc(Cap(w))+' settles over the board</h3><p>'+esc(W[w].gloss)+'</p></div>';document.body.appendChild(e);
  setTimeout(()=>{const b=e.firstChild,c=document.querySelector('#clime .wxcard'),s=b.querySelector('span');if(c&&s){const r=c.getBoundingClientRect(),q=s.getBoundingClientRect();b.style.transformOrigin=((q.left+q.width/2-b.getBoundingClientRect().left))+'px '+(q.height/2)+'px';b.style.transform='translate('+(r.left+r.width/2-q.left-q.width/2)+'px,'+(r.top+r.height/2-q.top-q.height/2)+'px) scale('+(r.width/q.width)+')';b.style.opacity='0';}},1750);setTimeout(()=>e.remove(),2500);}
function pvHtml(){const d=W[pv.w];return '<div class="thing" data-id="pv" title="'+esc(d.gloss)+'">'+miniFace(pv.w,{vig:d.vig+2*upOf(S,1,pv.w)})+'<span class="states">'+pv.adjs.map(a=>'<i>'+esc(a)+'</i>').join('')+'</span><span class="knows">Just played</span></div>';}
let RMU=false;try{RMU=localStorage.getItem('word-alchemy-rm')==='1';}catch(e){}let RM=RMU||matchMedia('(prefers-reduced-motion: reduce)').matches;document.body.classList.toggle('rm',RMU);const wait=ms=>new Promise(r=>setTimeout(r,ms*(typeof SPD==='number'?SPD:1)));
const zoomOf=()=>parseFloat((document.querySelector('.table')||{style:{}}).style.zoom)||1;
const elThing=id=>document.querySelector('.thing[data-id="'+id+'"]'),elWho=i=>document.querySelector('.who[data-i="'+i+'"]');
function snap(){const o={things:{},life:[S.players[0].life,S.players[1].life],coins:S.players[0].coins,over:S.over,pl:S.players.map(p=>({poisoned:p.poisoned,asleep:p.asleep,dazed:p.dazed,ink:p.ink})),clime:S.clime&&S.clime.w};
  for(const t of S.things){const el=elThing(t.id);o.things[t.id]={props:t.props.slice(),verbs:(t.verbs||[]).slice(),w:t.w,st:Object.assign({},t.st),vig:t.vig,forms:(t.forms||[]).length,side:t.side,rect:el?el.getBoundingClientRect():null,clone:el?el.cloneNode(true):null};}
  return o;}
function floatText(rect,txt,cls){if(!rect)return;const d=document.createElement('div');d.className='float '+cls;d.textContent=txt;d.style.left=(rect.left+rect.width/2)+'px';d.style.top=(rect.top+rect.height*.35)+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1300);}
function pulse(el,cls){if(!el)return;el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);setTimeout(()=>el.classList.remove(cls),900);}
function sayBanner(label,text){let b=document.getElementById('say');if(!b){b=document.createElement('div');b.id='say';document.querySelector('.table').appendChild(b);}
  b.innerHTML='<small>'+esc(label)+'</small><b>'+esc(text)+'</b>';b.className='on';}
function hideBanner(){const b=document.getElementById('say');if(b)b.className='';}
function sumBanner(t,delay){setTimeout(()=>{const d=document.createElement('div');d.className='sumb';const i=t.lastIndexOf(' = ');d.innerHTML='<span>'+esc(t.slice(0,i)).replace(/\(([^)]*)\)/g,'<small>$1</small>')+'</span><b>= '+esc(t.slice(i+3))+'</b>';document.body.appendChild(d);setTimeout(()=>d.remove(),2600);},RM?0:delay);}
function multBanner(n,labels){const d=document.createElement('div');d.className='mult';d.innerHTML=(n===''?'':'<b>×'+n+'</b>')+'<span>'+esc(labels.join(' · '))+'</span>';document.body.appendChild(d);setTimeout(()=>d.remove(),1500);}
function lunge(a,t){if(RM||!a||!t||a===t)return wait(60);const ra=a.getBoundingClientRect(),rt=t.getBoundingClientRect(),z=zoomOf();
  const dx=((rt.left+rt.width/2)-(ra.left+ra.width/2))*.72/z,dy=((rt.top+rt.height/2)-(ra.top+ra.height/2))*.72/z;a.style.zIndex=30;
  const an=a.animate([{transform:'translate(0,0) scale(1)'},{transform:'translate(0,'+(dy>0?-14:14)+'px) scale(1.06)',offset:.25},{transform:'translate('+dx+'px,'+dy+'px) scale(1.1)',offset:.62,easing:'cubic-bezier(.7,0,.9,.4)'},{transform:'translate(0,0) scale(1)'}],{duration:520,easing:'ease-out'});
  return new Promise(r=>{setTimeout(()=>{pulse(t,'struck');sfx('thud');r();},330);an.onfinish=()=>{a.style.zIndex='';};});}
function tick(el,from,to){if(!el||from===to)return;if(RM){el.textContent=Math.max(0,to);return;}const t0=performance.now(),dur=520;
  const f=now=>{const k=Math.min(1,(now-t0)/dur);el.textContent=Math.max(0,Math.round(from+(to-from)*k));if(k<1)requestAnimationFrame(f);};el.textContent=Math.max(0,from);requestAnimationFrame(f);}
function burst(rect,kind,big){if(!rect||RM)return;const d=document.createElement('div');d.className='fx fx-'+kind+(big?' big':'');d.style.left=(rect.left+rect.width/2)+'px';d.style.top=(rect.top+rect.height/2)+'px';
  let h='<i class="ring"></i><i class="core"></i>';for(let k=0;k<12;k++){const a=Math.random()*6.283,r=40+Math.random()*70;h+='<b style="--dx:'+(Math.cos(a)*r).toFixed(0)+'px;--dy:'+(Math.sin(a)*r-(kind==='fire'?40:kind==='water'?-30:0)).toFixed(0)+'px;--d:'+(Math.random()*.15).toFixed(2)+'s;--s:'+(5+Math.random()*9).toFixed(0)+'px"></b>';}
  d.innerHTML=h;document.body.appendChild(d);setTimeout(()=>d.remove(),1200);}
function rxBurst(rect){if(RM)return;const f=document.createElement('div');f.id='flash';document.body.appendChild(f);setTimeout(()=>f.remove(),750);burst(rect,'rx',true);setTimeout(()=>burst(rect,'heal'),160);sfx('shimmer');setTimeout(()=>sfx('bell'),120);}
function turnBanner(t){if(RM)return;let e=document.getElementById('turnb');if(e)e.remove();e=document.createElement('div');e.id='turnb';e.textContent=t;document.body.appendChild(e);setTimeout(()=>e.remove(),1300);}
let emoteAt=-9;const any=a=>a[Math.floor(Math.random()*a.length)];
function emote(t,force){if(!S||view!=='match'||(!force&&S.turn-emoteAt<3))return;emoteAt=S.turn;const w=elWho(1);if(!w)return;const r=w.getBoundingClientRect(),d=document.createElement('div');d.className='emote';d.textContent=t;d.style.left=(r.right+12)+'px';d.style.top=(r.top-6)+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),2700);}
function flyBack(){if(RM)return wait(0);const src=document.querySelector('.backs img:last-child'),dst=$('rival');if(!src||!dst)return wait(0);const a=src.getBoundingClientRect(),b=dst.getBoundingClientRect(),im=document.createElement('img');im.src='assets/back.jpg';im.className='flyback';im.style.left=a.left+'px';im.style.top=a.top+'px';document.body.appendChild(im);
  const an=im.animate([{transform:'none'},{transform:'translate('+(b.left+b.width/2-a.left)+'px,'+(b.top+b.height/2-a.top-20)+'px) rotate(200deg) scale(1.5)',opacity:.2}],{duration:380*SPD,easing:'cubic-bezier(.3,.1,.3,1)'});an.onfinish=()=>im.remove();sfx('page');return wait(300);}
const STFX={burning:['fire','Burning!','fire'],poisoned:['poison','Poisoned!','drop'],frozen:['frost','Frozen!','chime'],sodden:['water','Soaked!','drop'],asleep:['rx','Asleep','page'],bound:['hit','Bound fast!','thud'],blind:['hit','Blinded!','thud'],stone:['hit','Turned to stone!','crumble'],occult:['rx','Hidden','page'],guarding:['heal','On guard','tick'],quick:['heal','Quick!','chime'],fixed:['heal','Fixed','tick'],hermetic:['heal','Sealed','tick'],volatile:['rx','Volatile','page']};
const STOFF={burning:'Fire out',poisoned:'Cured',frozen:'Thawed',sodden:'Dried off',asleep:'Wakes!',bound:'Freed',blind:'Sees again',occult:'Revealed!',stone:'Flesh again'};
const PRFX={flying:'Winged!',toxic:'Venomous!',corrosive:'Corrosive!',bright:'Radiant!',sacred:'Sacred!',brittle:'Brittle!',thorny:'Thorny!',eternal:'Eternal!',beast:'Feral!',heavy:'Leaden!',swift:'Swift!',stealth:'Unseen!',potent:'Potent!',named:'Named!',hoard:'Gilded!'};
function fxTag(rect,txt,kind,big,slot){if(!rect)return;const d=document.createElement('div');d.className='fxtag fx-'+kind+(big?' big':'');d.textContent=txt;d.style.left=(rect.left+rect.width/2)+'px';d.style.top=(big?rect.bottom+18+(slot||0)*38:rect.top-4-(slot||0)*32)+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1700);}
const SPR={fixed:'hermetic',flying:'wings',toxic:'venom',corrosive:'poisoncloud',bright:'radiant',brittle:'frostsnap',thorny:'thorns',eternal:'enchant',beast:'feral',heavy:'leaden',swift:'quick',stealth:'occult',potent:'up',named:'spell'};
function fxSprite(rect,name,big){if(!rect||!name)return;const d=document.createElement('img');d.className='fxspr'+(big?' big':'');d.src=INL['fx/'+name+'.webp']||'assets/fx/'+name+'.webp';d.alt='';const w=Math.max(96,rect.width*(big?1.7:1.15));d.style.width=w+'px';d.style.left=(rect.left+rect.width/2)+'px';d.style.top=(rect.top+rect.height*.45)+'px';document.body.appendChild(d);setTimeout(()=>d.remove(),1100);}
function callout(txt,kind){const d=document.createElement('div');d.className='callout fx-'+kind;d.textContent=txt;document.body.appendChild(d);setTimeout(()=>d.remove(),1900);}
let fxQ=null;const fxArm=()=>{if(S&&view==='match')fxQ={b:snap(),n:S.log.length};};
function effects(b,logN,lunged,hadPv){let shake=false;{const Lx=S.log.slice(logN).map(l=>l.x);const om=Lx.find(x=>/^Opposites meet/.test(x));if(om){const m=$('mat');if(m){m.classList.remove('peacock');void m.offsetWidth;m.classList.add('peacock');setTimeout(()=>m.classList.remove('peacock'),2200);}callout(/three times/.test(om)?'Opposites \u00d7 3':'Opposites \u00d7 2','rx');if(S.oppF&&S.oppF.length){PF.opp=PF.opp||{};for(const k of S.oppF)PF.opp[k]=1;S.oppF=[];}}if(Lx.some(x=>/^Courage\./.test(x)))callout('Courage','rx');if(Lx.some(x=>/black matter/.test(x)))callout('Out of the black matter','rx');}const L0=S.log.slice(logN).map(l=>l.x).join(' '),atk=/\bbites?\b/.test(L0)?'bite':/\bcuts?\b/.test(L0)?'cut':/\bstings?\b/.test(L0)?'sting':/poison works|is poisoned/.test(L0)&&!/strikes|lashes|goes for/.test(L0)?'poisoncloud':/burn|fire|smoke/i.test(L0)&&!/strikes|lashes|goes for/.test(L0)?'ignite':'hit',z=zoomOf(),ev=[],nmOf=i=>i===0?'You are':(rvName().split(' ')[0])+' is';
  for(const id of Object.keys(b.things)){const was=b.things[id],now=S.things.find(t=>t.id===+id);
    if(!now){if(was.rect&&was.clone)ev.push({rect:was.rect,spr:'destroyed',kind:'hit',label:'Destroyed!',num:'−'+was.vig,cls:'bad',snd:'crumble',run:()=>{const g=document.createElement('div');g.className='dying';g.style.left=was.rect.left+'px';g.style.top=was.rect.top+'px';was.clone.style.zoom=z;was.clone.disabled=true;g.appendChild(was.clone);document.body.appendChild(g);setTimeout(()=>g.remove(),950);if(was.side===1&&S.stat){S.stat.kills++;bump('kills');}if(!RM)pulse(document.querySelector('.table'),'shake');}});continue;}
    const s0=was.st||{},s1=now.st||{},T=o=>ev.push(Object.assign({id:now.id,rect:was.rect},o));
    if(now.w!==was.w)T({spr:'fusion',kind:'rx',label:'Becomes '+now.w+'!',pulse:'evolve',snd:'shimmer',big:true});
    if((now.forms||[]).length>was.forms)T({spr:'enchant',kind:'rx',label:Cap(now.title||now.w)+'!',pulse:'evolve',snd:'shimmer',big:true});
    for(const p in PRFX)if(now.props.includes(p)&&!was.props.includes(p)&&now.w===was.w&&!((now.forms||[]).length>was.forms))T({spr:SPR[p]||p,kind:'heal',label:PRFX[p],pulse:'boon',snd:'chime'});
    for(const k in STFX)if(s1[k]&&!s0[k])T({spr:k==='burning'?'ignite':k==='sodden'?'splash':k==='frozen'?'frostsnap':k==='poisoned'?'poisoncloud':k==='volatile'?null:(SPR[k]||k),kind:STFX[k][0],label:STFX[k][1],pulse:k==='guarding'||k==='quick'?'boon':'hit',snd:STFX[k][2]});
    for(const k in STOFF)if(s0[k]&&!s1[k])T({kind:'heal',label:STOFF[k],pulse:'boon',snd:'tick'});
    if(now.vig<was.vig)T({spr:atk,kind:'hit',num:'−'+(was.vig-now.vig),cls:'bad',pulse:'hit',snd:lunged?null:'thud'});
    else if(now.vig>was.vig)T({spr:'up',kind:'heal',num:'+'+(now.vig-was.vig),cls:'good',label:'Stronger!',pulse:'boon',snd:'chime'});
    for(const v of now.verbs||[])if(!was.verbs.includes(v))T({kind:'heal',label:'Learns '+v,pulse:'boon',snd:'quill'});
    if(now.side!==was.side)T({spr:'spell',kind:'rx',label:'Changes sides!',pulse:'enter',snd:'bell',big:true});}
  for(const t of S.things)if(!b.things[t.id]&&!(hadPv&&t.side===1))ev.unshift({id:t.id,kind:'heal',pulse:'enter',snd:'drop',nob:true});
  for(const i of [0,1]){const d=S.players[i].life-b.life[i],p0=b.pl?b.pl[i]:{},p1=S.players[i],W_=o=>ev.push(Object.assign({who:i},o));
    if(d)W_({spr:d<0?atk:'heal',kind:d<0?'hit':'heal',num:(d<0?'−':'+')+Math.abs(d),cls:d<0?'bad big':'good big',pulse:d<0?'hit':'boon',big:d<=-6,snd:d<=-4?'boom':d<0?(lunged?null:'thud'):'chime',run:()=>{const el=elWho(i);if(el)tick(el.querySelector('.life'),b.life[i],S.players[i].life);if(d<=-4&&!RM)pulse(document.querySelector('.table'),'shake');}});
    if(p1.poisoned>(p0.poisoned||0))W_({spr:'poisoncloud',kind:'poison',label:'Poisoned!',pulse:'hit',snd:'drop',call:nmOf(i)+' poisoned!'});
    if(p1.asleep&&!p0.asleep)W_({spr:'asleep',kind:'rx',label:'Drowsy',pulse:'hit',snd:'page',call:nmOf(i)+' put to sleep!'});
    if(p1.dazed>(p0.dazed||0))W_({kind:'frost',label:'Hampered',pulse:'hit',snd:'thud',call:nmOf(i)+' hampered: less breath next turn'});}
  if(S.players[0].ink>(b.pl?b.pl[0].ink:99)&&S.active===0&&b.clime===(S.clime&&S.clime.w)&&logN>=0&&S.log.slice(logN).some(l=>/gain 3 ink|drink/i.test(l.x)))ev.push({who:0,spr:'ink',kind:'water',label:'+'+(S.players[0].ink-b.pl[0].ink)+' ink',pulse:'boon',snd:'drop'});
  const lines=S.log.slice(logN).map(l=>l.x);
  if(S.clime&&b.clime===S.clime.w&&lines.some(x=>/goes on|holds\b|The (rain|storm|flood|frost|drought|night|noon|spring|harvest|winter|desert)/i.test(x))){const c=document.querySelector('#clime .wxcard');if(c){pulse(c,'boon');fxTag(c.getBoundingClientRect(),Cap(S.clime.w)+' works','water');fxSprite(c.getBoundingClientRect(),'weather');}}
  {const cnt={};for(const e of ev)if(e.label){const k=(e.who!=null?'p'+e.who:'t'+e.id)+(e.big?'b':'');e.slot=(cnt[k]=(cnt[k]||0)+1)-1;}}
  const gap=RM?0:Math.min(420,2400/Math.max(1,ev.length))*SPD;
  ev.forEach((e,k)=>setTimeout(()=>{if(!S)return;const el=e.who!=null?elWho(e.who):e.id!=null?elThing(e.id):null,r=el?el.getBoundingClientRect():e.rect;if(!r)return;
    if(e.spr)fxSprite(r,e.spr,e.big);if(e.label)fxTag(r,e.label,e.kind,e.big,e.slot);if(e.num)floatText(r,e.num,e.cls);if(!e.nob&&!e.spr)burst(r,e.kind,e.big);if(e.pulse&&el)pulse(el,e.pulse);if(e.snd)sfx(e.snd);if(e.call)callout(e.call,e.kind);if(e.run)e.run();},k*gap));
  const m=lines.map(x=>/multiplied by (\d+)/.exec(x)).find(Boolean),after=ev.length*gap;
  if(m){const lab=[];if(lines.some(x=>/exalted/.test(x)))lab.push('Exalted');if(lines.some(x=>/potent/.test(x)))lab.push('Potent');setTimeout(()=>{multBanner(m[1],lab);sfx('bell');},after);}
  {const q=S.log.slice(logN).filter(l=>l.k==='q').map(l=>l.x.replace(/^The sum: /,'').replace(/\.$/,''));q.slice(-3).forEach((x,i)=>sumBanner(x,(m?1500:200)+i*1900));}
  if(S.players[0].coins>b.coins)setTimeout(()=>sfx('coin'),after);
  if(S.over!=null&&b.over==null)setTimeout(()=>sfx(S.over===0?'win':'lose'),after+200);}
async function act(who,sen,shown){
  busy=true;let r={ok:false};
  try{
    if(who===0){const v=validate(S,0,sen);if(!v.ok){ui.msg=v.why;sfx('nope');render();return v;}sfx('quill');}
    const b=snap(),logN=S.log.length;
    const isRx=sen.verb!=null&&S.players[who].hand[sen.verb]==='fuse';
    const usedW=who===0?[...(sen.adjs||[]),sen.subj&&sen.subj.k==='card'?sen.subj.i:null,sen.verb,sen.clime,sen.obj&&sen.obj.k==='card'?sen.obj.i:null].filter(i=>i!=null).map(i=>S.players[0].hand[i]).filter(w=>W[w]):[];
    if(who===1&&!shown&&(sen.verb!=null||sen.clime!=null||(sen.adjs||[]).length||(sen.subj&&sen.subj.k==='card')))await flyBack();
    let hadPv=!!pv;if(who===1&&!pv){pv=pvOf(sen);if(pv){hadPv=true;render();pulse(elThing('pv'),'enter');sfx('drop');await wait(RM?300:650);}}
    if(who===1&&!shown){sayBanner((S.rival?S.rival.n.split(' ')[0]:'The rival')+' says',secretSay(S,1,sen)?'…something you cannot make out.':describe(S,1,sen));sfx('page');await wait(RM?500:1000);}
    const a=sen.subj&&sen.subj.k==='thing'?elThing(sen.subj.id):(who===1&&pv?elThing('pv'):null);
    const tg=sen.def!=null?elThing(sen.def):sen.obj?(sen.obj.k==='thing'?elThing(sen.obj.id):sen.obj.k==='player'?elWho(sen.obj.i):null):null;
    const lunged=!!(a&&tg&&!RM);if(a&&tg)await lunge(a,tg);
    pv=null;r=resolve(S,who,sen);
    if(who===0){if(r.ok)clearUi();else ui.msg=r.why;}
    if(S.found&&S.found.length){PF.found=PF.found||{};let nw=0;for(const k of S.found)if(!PF.found[k]){PF.found[k]=1;nw++;(S.newF=S.newF||[]).push(k);}S.found=[];if(nw){save();renderLex();sfx('shimmer');setTimeout(()=>multBanner('',['New reaction found']),150);}}
    const newRx=!!(S.newF&&S.newF.length>(act.nf||0));act.nf=(S.newF||[]).length;
    if(who===0&&r.ok&&S.stat)S.stat.said++;
    if(who===0&&r.ok){firstBreath(usedW);sUsed(usedW);const lv=usedW.find(w=>W[w].t===VERB)||(typeof sen.kverb==='string'?sen.kverb:null);if(lv)S.lastV=lv;if(PF.me&&PF.me.sig&&usedW.includes(PF.me.sig)){setTimeout(()=>{sfx('chime');const el=elWho(0);if(el)burst(el.getBoundingClientRect(),'heal',true);},350);}}
    if(who===0&&r.ok){bump('said');PF.st.wd=PF.st.wd||{};for(const w of usedW){PF.st.wd[w]=1;const d=W[w],pr=d.props||[];
        if(d.t===ADJ){bump('adjs');if(w==='occult')bump('hid');}else if(d.t===VERB){if(w!=='fuse')bump('verbs');}else if(d.t===CLIME)bump('clime');else if(d.t===NOUN){if(isEvent(w)||pr.includes('spell'))bump('spells');else if(pr.includes('ground'))bump('ground');else bump('brought');}}
      if(isRx)bump('rx');bmax('maxHit',b.life[1]-S.players[1].life);
      for(const t of S.things){if(t.side!==1)continue;const s0=(b.things[t.id]||{}).st||{};for(const [k,n] of [['burning','burn'],['frozen','freeze'],['sodden','drench'],['poisoned','poison']])if(t.st[k]&&!s0[k])bump(n);}
      S.stat.minThings=1;achCheck();}
    if(S.stat){for(const id in b.things)if(b.things[id].side===0&&!S.things.some(t=>t.id==id))S.stat.lost=(S.stat.lost||0)+1;}
    render();effects(b,logN,lunged,hadPv);
    if(isRx&&r.ok){const nt=S.things.find(t=>!b.things[t.id]),el=nt&&elThing(nt.id),cb=$('clime');rxBurst((el||cb).getBoundingClientRect());}
    {const d0=S.players[0].life-b.life[0],d1=S.players[1].life-b.life[1];
     if(S.over===0&&b.over==null)emote('Well played.',true);else if(S.over===1&&b.over==null)emote('Good match.',true);
     else if(who===1&&d0<=-8)emote(any(['Feel that.','There.','That one counts.']));else if(who===0&&d1<=-8)emote(any(['Well struck.','Hm. Good.','I felt that.']));
     else if(who===0&&newRx)emote(any(['Clever.','I had not seen that one.','Interesting.']));}
    await wait(RM?200:(who===1?900:520));
  }finally{pv=null;hideBanner();busy=false;keepMatch();}
  return r;
}
function botLoop(){
  if(S.phase!=='bot')return;
  const step=()=>{
    if(S.phase!=='bot')return;
    if(S.over!=null){document.body.classList.remove('rthink');render();return;}
    if(S.botT!==S.turn){S.botT=S.turn;S.botN=0;}S.botN++;
    const s=S.players[1].ink>0&&S.botN<=14?botChoose(S,1):null;
    if(!s){botShop(S,1);fxArm();endTurn(S,1,true);startTurn(S,0);if(S.over==null)S.phase='play';clearUi();document.body.classList.remove('rthink');render();if(S.over==null){turnBanner('Your turn');sfx('bell');}return;}
    delete s.def;if(needsDefence(S,1,s)){S.pending=s;S.phase='defend';pv=pvOf(s);render();if(pv){pulse(elThing('pv'),'enter');sfx('drop');}return;}
    act(1,s).then(()=>setTimeout(step,250));
  };
  document.body.classList.add('rthink');setTimeout(step,(RM?500:1100+Math.random()*600)*SPD);
}
let peekEl=null,peekT=null;
function peekHide(){clearTimeout(peekT);peekEl=null;const p=document.getElementById('peek');if(p)p.className='';}
function dkNear(w){const c=[...new Set(PF.deck)].filter(x=>x!==w&&W[x]&&kindOf(x)===kindOf(w));if(!c.length)return null;return c.sort((a,b)=>Math.abs(W[a].syl-W[w].syl)-Math.abs(W[b].syl-W[w].syl)||Math.abs(tierOf(a)-tierOf(w))-Math.abs(tierOf(b)-tierOf(w))||a.localeCompare(b))[0];}
function peekShow(el){const w=el.dataset.pv;if(!W[w]||!document.body.contains(el))return;let p=document.getElementById('peek');if(!p){p=document.createElement('div');p.id='peek';document.body.appendChild(p);}
  const cmp=view==='deck'&&el.closest('#dk-grid')&&PF.owned[w]&&!PF.deck.includes(w)?dkNear(w):null,ff=x=>fullFace(x,{ink:W[x].syl,lv:PF.up[x]||0,up:PF.up});p.innerHTML=cmp?'<figure><figcaption>'+(PF.deck.includes(w)?'In your deck':'This word')+'</figcaption><div class="pk-c">'+ff(w)+'</div></figure><figure><figcaption>Nearest in your deck</figcaption><div class="pk-c">'+ff(cmp)+'</div></figure>':ff(w);p.classList.toggle('two',!!cmp);const r=el.getBoundingClientRect(),pw=cmp?624:300,ph=p.offsetHeight||430;let x=r.right+14;if(x+pw>innerWidth-8)x=r.left-pw-14;if(x<8)x=8;
  p.style.left=x+'px';p.style.top=Math.max(8,Math.min(innerHeight-ph-8,r.top+r.height/2-ph/2))+'px';p.className='on'+(cmp?' two':'');}
document.addEventListener('mouseover',ev=>{const el=ev.target.closest&&ev.target.closest('[data-pv]');if(el===peekEl)return;peekHide();if(!el||drag)return;peekEl=el;peekT=setTimeout(()=>peekShow(el),160);});
document.addEventListener('scroll',peekHide,true);document.addEventListener('pointerdown',peekHide,true);
document.addEventListener('contextmenu',ev=>{const c=ev.target.closest&&ev.target.closest('.cell [data-act=dadd]');if(!c)return;ev.preventDefault();const w=c.dataset.w,i=PF.deck.indexOf(w);if(i>=0){PF.deck.splice(i,1);save();sfx('tick');dkGrid();dkSide();}});
let wheelAt=0;document.addEventListener('wheel',ev=>{const inB=view==='book'&&ev.target.closest&&ev.target.closest('.spread:not(.one)');if(!inB&&(view!=='deck'||!ev.target.closest||!ev.target.closest('#dk-grid')||dk.sel))return;const now=Date.now();if(now-wheelAt<260||Math.abs(ev.deltaY)<8)return;wheelAt=now;const b=document.querySelector((inB?'#bk-book ':'#dk-grid ')+'.pg[data-d="'+(ev.deltaY>0?1:-1)+'"]');if(b&&!b.disabled)b.click();},{passive:true});
function flyTile(w,from,to){if(RM||!from||!to)return;const a=from.getBoundingClientRect(),b=to.getBoundingClientRect(),t=document.createElement('div');t.className='flytile';if(ART[w]!=null)t.style.backgroundImage='url(assets/art/'+w+'.jpg)';t.style.left=(a.left+a.width/2-48)+'px';t.style.top=(a.top+a.height/3-33)+'px';document.body.appendChild(t);
  const an=t.animate([{transform:'scale(1.2)'},{transform:'translate('+(b.left+b.width/2-a.left-a.width/2)+'px,'+(b.top+b.height/2-a.top-a.height/3)+'px) scale(.45)',opacity:.3}],{duration:360,easing:'cubic-bezier(.4,0,.2,1)'});an.onfinish=()=>t.remove();}
let drag=null,swallow=false;
document.addEventListener('click',ev=>{if(swallow){ev.stopPropagation();ev.preventDefault();}},true);
document.addEventListener('pointerdown',ev=>{const c=ev.target.closest('#hand .card[data-act=card]');if(!c||c.disabled||busy||!S||S.phase!=='play'||ev.button||ui.discard)return;drag={c,i:+c.dataset.i,x:ev.clientX,y:ev.clientY,g:null};});
document.addEventListener('pointermove',ev=>{if(!drag)return;const dx=ev.clientX-drag.x,dy=ev.clientY-drag.y;
  if(!drag.g){if(dx*dx+dy*dy<196)return;const r=drag.c.getBoundingClientRect(),g=document.createElement('div');g.className='dragghost';const cl=drag.c.cloneNode(true);cl.style.zoom=zoomOf();cl.style.transform='none';cl.style.width='124px';const tip=cl.querySelector('.tip');if(tip)tip.remove();g.appendChild(cl);document.body.appendChild(g);drag.g=g;drag.ox=r.left-drag.x;drag.oy=r.top-drag.y;drag.c.classList.add('dragging');document.body.classList.add('dragon');}
  drag.g.style.left=(ev.clientX+drag.ox)+'px';drag.g.style.top=(ev.clientY+drag.oy)+'px';});
const dragEnd=ev=>{if(!drag)return;const d=drag;drag=null;if(!d.g)return;d.g.remove();document.body.classList.remove('dragon');d.c.classList.remove('dragging');swallow=true;setTimeout(()=>{swallow=false;},60);
  if(ev.type==='pointercancel'||busy||S.phase!=='play')return;const hb=document.querySelector('.handbar').getBoundingClientRect();if(ev.clientY>=hb.top)return;
  const w=S.players[0].hand[d.i],dd=W[w];if(!dd||usedIdx().includes(d.i))return;
  const at=document.elementFromPoint(ev.clientX,ev.clientY),th=at&&at.closest('.thing[data-id]');
  if(th&&(dd.t===VERB||dd.t===ADJ)&&!ui.subj&&+th.dataset.id){const t=findThing(S,+th.dataset.id);if(t&&(t.side===0||dd.t===ADJ))pickRef({k:'thing',id:t.id});}
  pickCard(d.i);sfx('drop');const s=sen();
  if((dd.t===NOUN||dd.t===CLIME)&&!ui.msg&&!ui.adjs.length&&ui.verb==null&&!ui.kverb&&!ui.obj&&validate(S,0,s).ok){act(0,s);return;}
  render();};
document.addEventListener('pointerup',dragEnd);document.addEventListener('pointercancel',dragEnd);
document.addEventListener('click',ev=>{
  const el=ev.target.closest('[data-act]');if(!el||el.disabled)return;const a=el.dataset.act,w=el.dataset.w,p=pk(),warned=ui.endWarn;if(a==='endnext'){sfx('stamp');if((S.endStage||'result')==='result'&&S.paid&&S.paid.rankUp!=null)S.endStage='rank';else{S.endSeen=true;PF.last={r:S.quit||S.over===1?'loss':S.over===0?'win':'draw',n:rvName(),p:rivalOf().p,gold:(S.paid||{}).gold||0};save();S.live=false;if(S.story){if(!S.sdone){S.sdone=1;storyEnd();}view='story';jS.tab='map';}else view='match';renderAll();window.scrollTo(0,0);}endScreen();return;}
  if(a==='way'){const x=adv.list[+el.dataset.i];if(x){const s=x.s;clearUi();ui.adjs=(s.adjs||[]).slice();ui.subj=s.subj||null;ui.verb=s.verb==null?null:s.verb;ui.kverb=s.kverb||null;ui.obj=s.obj||null;ui.clime=s.clime==null?null:s.clime;sfx('tick');render();}return;}
  if(a[0]==='j'&&storyAct(a,el))return;if(a==='accat'){acS.cat=el.dataset.v;acS.sel=null;sfx('tick');renderAch();$('ac-list').scrollTop=0;return;}if(a==='acshow'){acS.show=el.dataset.v;acS.sel=null;sfx('tick');renderAch();$('ac-list').scrollTop=0;return;}if(a==='acsel'){acS.sel=el.dataset.v;sfx('tick');renderAch();return;}if(a==='bk'){bkS.tab=el.dataset.v;bkS.page=0;bkS.anim=true;bkS.dir=1;sfx('page');peekHide();renderLex();return;}if(a==='bksel'){bkS.sel=el.dataset.v;sfx('tick');renderLex();return;}if(a==='bkfilt'){bkS.type=bkS.type===el.dataset.t?null:(el.dataset.t||null);bkS.sel=null;bkS.page=0;bkS.anim=true;bkS.dir=1;sfx('tick');peekHide();renderLex();return;}if(a==='bkpage'){bkS.page+=+el.dataset.d;bkS.dir=+el.dataset.d;bkS.anim=true;sfx('page');peekHide();renderLex();return;}if(a==='settings'){sfx('tick');settings(true);return;}if(a==='scopy'){const c=copyPrice(w);if(W[w]&&PF.owned[w]>0&&PF.gold>=c){PF.gold-=c;PF.owned[w]++;save();sfx('quill');}renderAll();return;}if(a==='sillum'){const lv=PF.up[w]||0;if(W[w]&&PF.owned[w]>=4&&lv<2){PF.owned[w]-=3;PF.up[w]=lv+1;while(PF.deck.filter(x=>x===w).length>PF.owned[w])PF.deck.splice(PF.deck.lastIndexOf(w),1);bump('refined');save();sfx('shimmer');setTimeout(()=>sfx('bell'),150);const f=document.createElement('div');f.id='flash';document.body.appendChild(f);setTimeout(()=>f.remove(),750);}renderAll();return;}if(a==='chront'){lsSet('word-alchemy-chron',lsGet('word-alchemy-chron')==='0'?'1':'0');sfx('page');document.querySelectorAll('.table').forEach(t=>t.style.zoom=1);render();return;}if(a==='profile'){sfx('page');profile(true);return;}if(a==='profx'){profile(false);return;}if(a==='setclose'){settings(false);return;}if(a==='mute'){muted=!muted;lsSet('word-alchemy-mute',muted?'1':'0');if(AC)AC.out.gain.value=muted?0:1;if(!muted)band();sfx('tick');settings(true);return;}if(a==='spd'){SPD=+el.dataset.v;lsSet('word-alchemy-spd',SPD);settings(true);return;}if(a==='rmset'){RMU=!RMU;lsSet('word-alchemy-rm',RMU?'1':'0');RM=RMU||matchMedia('(prefers-reduced-motion: reduce)').matches;document.body.classList.toggle('rm',RMU);settings(true);return;}if(a==='tutagain'){PF.tut=0;if(S){S.tutK=0;S.tutEnd=false;}save();settings(false);renderAll();return;}if(a==='tutskip'){PF.tut=1;save();renderCoach();return;}if(a==='quitask'){setAsk='quit';settings(true);return;}if(a==='quit'){if(busy||!S||S.over!=null){settings(false);return;}settings(false);document.body.classList.remove('rthink');S.pending=null;say(S,'You surrender.');S.quit=true;S.players[0].life=0;S.over=1;S.phase='over';clearUi();render();return;}if(a==='wipeask'){setAsk=true;settings(true);return;}if(a==='wipeno'){setAsk=false;settings(true);return;}if(a==='wipe'){PF=newProfile();save();fresh();view='home';setAsk=false;settings(false);renderAll();return;}if(a==='go')settings(false);if(busy&&a!=='go')return;ui.endWarn=false;
  if(a==='card'||a==='thing'||a==='player'||a==='kverb'||a==='clear'||a==='toss'||a==='go')sfx('tick');else if(a==='end'||a==='shopdone')sfx('stamp');else if(a==='buy'||a==='buyword'||a==='refresh'||a==='reroll')sfx('coin');else if(a==='def')sfx('tick');
  if(a==='daily'){setJm(false);findStart('daily');return;}
  if(a==='jexit'){peekHide();profile(false);setJm(false);view='home';renderAll();window.scrollTo(0,0);return;}
  if(a==='go'){let v=el.dataset.v;peekHide();profile(false);if(v==='story'){setJm(true);jS.tab='here';}if(v==='home'&&jm)v='story';if(!jm&&JV.includes(v))v='home';dk.anim=true;dk.dir=1;view=v;renderAll();window.scrollTo(0,0);return;}
  if(a==='dadd'){const own=PF.owned[w]||0,cell=el.closest('.cell');peekHide();
    if(!own){dk.sel=w;sfx('tick');dkGrid();return;}
    if(inDeck(w)<Math.min(own,p.copies)&&PF.deck.length<p.deckMax){flyTile(w,el,document.querySelector('#dk-side .rows'));PF.deck.push(w);save();sfx('drop');dk.flash=w;dkGrid();dkSide();}
    else{sfx('nope');if(cell)pulse(cell,'nope');}return;}
  if(a==='dsel'){dk.sel=dk.sel===w?null:w;sfx('tick');dkGrid();return;}
  if(a==='dclose'){dk.sel=null;dkGrid();return;}
  if(a==='dfilt'){dk.anim=true;dk.dir=1;dk.type=dk.type===el.dataset.t?null:el.dataset.t;dk.page=0;dk.sel=null;sfx('tick');renderDeck();return;}
  if(a==='dcost'){dk.anim=true;dk.dir=1;const c=+el.dataset.c;dk.cost=dk.cost===c?null:c;dk.page=0;dk.sel=null;sfx('tick');renderDeck();return;}
  if(a==='dall'){dk.anim=true;dk.dir=1;dk.all=!dk.all;dk.page=0;sfx('tick');renderDeck();return;}
  if(a==='dpage'){dk.anim=true;dk.dir=+el.dataset.d;dk.page+=+el.dataset.d;dk.sel=null;sfx('page');dkGrid();return;}
  if(a==='new'){if(PF.deck.length<DECKMIN||PF.deck.length>p.deckMax){setJm(true);view='deck';renderAll();return;}if(jm)setJm(false);fresh();S.live=true;settings(false);vsScreen();return;}
  if(a==='buyword'){const word=PF.stock[+el.dataset.i],cost=word?copyPrice(word):0;if(word&&PF.gold>=cost&&(PF.owned[word]||0)<4){PF.gold-=cost;PF.owned[word]=(PF.owned[word]||0)+1;bump('bought');save();wordReveal(word);}renderAll();return;}
  if(a==='reroll'){if(PF.gold>=REROLL){PF.gold-=REROLL;restock();save();}renderAll();return;}
  if(a==='dplus'){if(inDeck(w)<Math.min(PF.owned[w]||0,p.copies)&&PF.deck.length<p.deckMax){PF.deck.push(w);save();}renderAll();return;}
  if(a==='dminus'){const i=PF.deck.indexOf(w);if(i>=0){PF.deck.splice(i,1);save();sfx('tick');}peekHide();if(view==='deck'){dkGrid();dkSide();}else renderAll();return;}
  if(a==='refine'){const lv=PF.up[w]||0,cost=REFINE[lv];if(lv<p.refine&&PF.gold>=cost){PF.gold-=cost;PF.up[w]=lv+1;save();}renderAll();return;}
  if(view!=='match')return;
  if(a==='def'){const s=S.pending;if(!s)return;S.pending=null;S.phase='bot';s.def=el.dataset.id?+el.dataset.id:null;render();act(1,s,true).then(botLoop);return;}
  if(a==='toss'){const i=+el.dataset.i,pl=S.players[0];if(toss==='banish'){if(pl.coins<1)S.log.push({k:'e',x:'Banishing a word costs 1 ink.'});else{const x=pl.hand.splice(i,1)[0];if(x){pl.coins--;S.log.push({k:'e',x:'You banish '+x+' from this match.'});}}}
    else{const x=pl.hand.splice(i,1)[0];if(x){pl.discard.push(x);S.log.push({k:'e',x:'You discard '+x+'.'});}}render();return;}
  if(a==='tossmode'){toss=toss==='banish'?'discard':'banish';render();return;}
  if(a==='refresh'){refresh(S,0);render();return;}
  if(a==='buy'){if(!buy(S,0,+el.dataset.i,true))S.log.push({k:'e',x:'Not enough ink for that word.'});render();return;}
  if(a==='shopdone'){if(S.phase!=='shop')return;S.phase='bot';fxArm();startTurn(S,1);render();turnBanner(rvName().split(' ')[0]+'’s turn');botLoop();return;}
  if(S.phase!=='play')return;
  if(a==='discard'){const on=!ui.discard;clearUi();ui.discard=on;}
  else if(a==='card'){const i=+el.dataset.i;if(ui.discard){const h=S.players[0].hand,x=h.splice(i,1)[0];if(x){S.players[0].discard.push(x);S.log.push({k:'e',x:'You discard '+x+'.'});}}else pickCard(i);}
  else if(a==='kverb'){ui.msg='';ui.kverb=ui.kverb===w?null:w;if(ui.kverb)ui.verb=null;}
  else if(a==='thing'){if(!ui.discard)pickRef({k:'thing',id:+el.dataset.id});}
  else if(a==='player'){if(!ui.discard)pickRef({k:'player',i:+el.dataset.i});}
  else if(a==='clear')clearUi();
  else if(a==='speak'){const s=sen();if(needsDefence(S,0,s))s.def=botDefend(S,1,0,s);act(0,s);return;}
  else if(a==='pwait'&&S.puz){findWait();}
  else if(a==='end'&&S.puz){findStart(S.puz);return;}
  else if(a==='end'&&!warned&&readyThings().length){const r=readyThings();clearUi();ui.endWarn=true;ui.msg=r.map(t=>Cap(t.title||t.w)+' can still '+readyVerbs(t).join(' or ')+' for free').join('. ')+'. Tap it to use it, or end the turn anyway.';}
  else if(a==='end'){S.tutEnd=true;fxArm();endTurn(S,0,false);clearUi();if(S.over==null)S.phase='shop';}
  render();
});
function preload(){const el=document.getElementById('load');if(!el)return;const bar=el.querySelector('i');
  const urls=['assets/bg.jpg','assets/ds/plate.webp','assets/parch.jpg','assets/back.jpg','assets/player.jpg','assets/rival.jpg'].concat(['noun','verb','adj','cat','clime'].flatMap(k=>['assets/fr/mini_'+k+'.webp','assets/fr/full_'+k+'.webp']),PF.deck.filter((w,i,a)=>a.indexOf(w)===i&&ART[w]!=null).map(w=>'assets/art/'+w+'.jpg'));
  let n=0,fin=false;const done=()=>{if(fin)return;fin=true;el.classList.add('out');setTimeout(()=>el.remove(),450);setTimeout(()=>Object.keys(ART).forEach(w=>{new Image().src='assets/art/'+w+'.jpg';}),1500);};
  setTimeout(done,5000);urls.forEach(x=>{const im=new Image();im.onload=im.onerror=()=>{n++;if(bar)bar.style.width=Math.round(100*n/urls.length)+'%';if(n>=urls.length)setTimeout(done,200);};im.src=x;});}
function start(data){
  loadLocal();
  const d=data&&data.S,ok=d&&d.rules===14&&d.cfg&&d.players&&d.things.every(t=>W[t.w])&&d.players.every(p=>p.hand.concat(p.deck,p.discard).every(w=>W[w]));
  let res=null;try{res=JSON.parse(localStorage.getItem('word-alchemy-match')||'null');}catch(e){}
  const rok=res&&res.live&&res.over==null&&res.rules===14&&res.cfg&&res.players&&res.things.every(t=>W[t.w])&&res.players.every(p=>p.hand.concat(p.deck,p.discard).every(w=>W[w]))&&(!res.story||sNode(res.story));
  if(rok){S=res;S.pending=S.pending||null;if(S.phase==='defend'&&!S.pending){S.phase='bot';}view='match';setJm(!!(S.story||S.puz));}
  else if(ok)S=d;else fresh();
  clearUi();renderAll();preload();setTimeout(achCheck,1500);setTimeout(()=>{grant1();grant2();grant3();try{rewardFix();}catch(e){}},300);if(S.phase==='bot')botLoop();
  linkStore();
}
try{if(window.claude&&window.claude.hot&&window.claude.hot.snapshot)window.claude.hot.snapshot(()=>({S}));}catch(e){}
if(window.claude&&window.claude.hot&&window.claude.hot.ready)window.claude.hot.ready(start);else start((window.claude&&window.claude.hot&&window.claude.hot.data)||{});

document.addEventListener('change',ev=>{const t=ev.target;if(t.id==='j-deckn'){meSt().deck=t.value.trim().replace(/[<>&"]/g,'').slice(0,22);save();}else if(t.id==='j-sig'){meSt().sig=t.value;save();sfx('tick');}});

addEventListener('keydown',ev=>{if(view!=='story'||document.getElementById('jpop')||document.getElementById('wrev')||/INPUT|TEXTAREA/.test((ev.target||{}).tagName||''))return;if((ev.key==='m'||ev.key==='M')&&(jS.tab==='here'||jS.tab==='map')){jS.tab=jS.tab==='map'?'here':'map';sfx('page');renderStory();}else if(ev.key==='Escape'&&jS.tab!=='here'){jS.tab='here';sfx('page');renderStory();}});
