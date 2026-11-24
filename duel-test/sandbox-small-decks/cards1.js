/* Sandbox card set, part 1: helpers, Air, Water, Earth, Fire.
   Every card's text says exactly what its code does. `m` is "rarity|what it does to a current card". */
(function(root,f){if(typeof module==='object'&&module.exports)module.exports=f;else root.WAS_CARDS1=f;})(this,function(E){
'use strict';
const {DB,def,face,hurt,kill,buff,mend,life,psn,tpsn,ign,frz,wet,draw,br,put,bounce,raise,foes,mine,seen,top,low,cnt,is,dis,pack,fetch,pile}=E;
const meta=(o,m,cost)=>{const a=(m||'').split('|');o.rar=a[0]||(cost<=1?'C':cost===2?'U':'R');o.repl=a[1]||'';};
const H={};
H.T=(id,sch,th,cost,sk,st,kw,text,on,m)=>{const o=def(id,{name:id,sch,th,type:'thing',cost,sk,st,kw:kw?kw.split(' '):[],text,on:on||{}});meta(o,m,cost);return o;};
H.A=(id,sch,th,cost,text,o,m)=>{const d=def(id,Object.assign({name:id,sch,th,type:'action',cost,text},o||{}));meta(d,m,cost);return d;};
H.Q=(id,sch,th,cost,text,o,m)=>{const d=def(id,Object.assign({name:id,sch,th,type:'quality',cost,text},o||{}));meta(d,m,cost);return d;};
H.W=(id,sch,th,cost,text,o,m)=>{const d=def(id,Object.assign({name:id,sch,th,type:'weather',cost,text},o||{}));meta(d,m,cost);return d;};
H.S=(id,sch,th,cost,text,cast,m,o)=>{const d=def(id,Object.assign({name:id,sch,th,type:'spell',cost,text,cast},o||{}));meta(d,m,cost);return d;};
H.most=(G,p)=>{let b=null;for(const t of mine(G,p))if(t.mx>t.st&&(!b||t.mx-t.st>b.mx-b.st))b=t;return b;};
H.sw=k=>(G,t)=>t.kw[k]||DB[t.id].sch===k?1:0;
H.spellish=c=>c.type==='spell'||c.type==='weather';
const {T,A,Q,W,S,most,spellish}=H;
const opp=t=>1-t.own;
const schAtk=s=>(G,t)=>DB[t.base||t.id].sch===s?1:0;
H.schAtk=schAtk;

/* =========================== AIR · Bramble Cross =========================== */
/* Falconry: Stoop (a bird that waited strikes +2) */
T('hawk','air','falconry',2,3,2,'bird living flying stoop','Flies. Stoop: +2 strike if it waited last turn.',null,'C|keeps hawk');
T('kestrel','air','falconry',1,1,2,'bird living flying swift stoop','Flies, swift. Stoop: +2 strike if it waited last turn.',null,'C|new');
T('falcon','air','falconry',3,3,4,'bird living flying stoop','Flies. Stoop +2. When it hits the rival, their weakest thing takes 2.',{hit(G,t,tg){if(!tg){const f=low(seen(G,t.own));if(f)hurt(G,f,2,'falcon');}}},'R|adapts eagle');
T('falconer','air','falconry',2,1,4,'person living','Your birds return to your hand when they fall.',{keep:(G,t,o)=>!!o.kw.bird},'U|adapts shepherdess');
Q('hood','air','falconry',1,'A thing of yours rests under the hood: it heals fully, and its next strike cannot be blocked.',{apply(G,t){t.st=Math.max(t.st,t.mx);t.unbl=1;}},'C|adapts masked');
A('lure','air','falconry',1,'Swing the lure: a flyer of yours gains +1 strike and may strike again this turn.',{use(G,t){t.acted=false;t.fresh=false;buff(G,t,1,0);},need:t=>!!t.kw.flying},'U|keeps lure (now Air)');
T('mews','air','falconry',2,0,5,'structure','Birds that arrive while it stands are swift and gain +1 stand.',{ally(G,t,o){if(o.kw.bird){o.fresh=false;buff(G,o,0,1);}}},'U|new');
/* Windmills: Grind (breath from the wind) */
T('windmill','air','mill',3,0,6,'structure','Each of your turns you gain 1 breath, 2 while any weather stands.',{turn(G,t){br(G,t.own,G.wx?2:1);}},'R|adapts bellows');
T('miller','air','mill',2,2,4,'person living','Gains +1/+1 whenever you play a word that costs 3 or more.',{play(G,t,c){if(c.cost>=3)buff(G,t,1,1);}},'U|new');
T('grindstone','air','mill',2,1,5,'stone heavy','Each of your turns it grinds 1 from the weakest rival thing.',{turn(G,t){const f=low(foes(G,t.own));if(f)hurt(G,f,1,'grindstone');}},'U|adapts erosion');
T('grain','air','mill',1,0,3,'plant living','Each of your turns you gain 1 life.',{turn(G,t){life(G,t.own,1);}},'C|adapts saffron');
Q('sail','air','mill',1,'+1 strike; +2 while any weather stands.',{atk:(G,t)=>G.wx?2:1},'C|new');
S('chaff','air','mill',2,'Chaff in the wind: no rival thing can block this turn.',(G,p)=>{G.pl[1-p].noblk=G.turn;},'U|adapts dust');
T('weathercock','air','mill',1,0,3,'structure metal','When the weather arrives or changes, you draw a word.',{wx(G,t){draw(G,t.own,1);}},'C|new');
/* The Fair: Deliver and take (things happen when these reach the rival) */
T('magpie','air','fair',2,2,2,'bird living flying','Flies. When it hits the rival, they have 1 less breath next turn.',{hit(G,t,tg){if(!tg)G.pl[opp(t)].tax=1;}},'U|keeps magpie');
T('courier','air','fair',2,2,3,'person living swift','Swift. When it hits the rival, you draw a word.',{hit(G,t,tg){if(!tg)draw(G,t.own,1);}},'U|adapts herald');
T('pigeon','air','fair',1,1,1,'bird living flying','Flies. When it arrives, you draw a word.',{arrive(G,t){draw(G,t.own,1);}},'C|new');
T('cutpurse','air','fair',2,2,3,'person living hidden','Hidden. When it hits the rival, they drop a word from their hand.',{hit(G,t,tg){if(!tg)dis(G,opp(t));}},'U|adapts thief');
T('pedlar','air','fair',3,2,5,'person living','When he arrives, a word from his pack (the market supply) joins your hand.',{arrive(G,t){pack(G,t.own);}},'R|new');
S('letter','air','fair',1,'A letter arrives: draw two words.',(G,p)=>draw(G,p,2),'C|adapts windfall (old sense)');
T('kite','air','fair',1,0,2,'flying','Flies. While it flies, the first word you play each turn costs 1 less.',{turn(G,t){G.pl[t.own].red=1;}},'C|adapts muse');
/* Storm-watching: Charge (spells and weather build the storm) */
T('thunderhead','air','storm',3,0,5,'flying','Flies. Gains a charge when you play a spell or weather. Each of your turns the rival takes 1 per charge (up to 3).',{play(G,t,c){if(spellish(c))t.ctr=Math.min(3,t.ctr+1);},turn(G,t){if(t.ctr)face(G,opp(t),t.ctr,'thunderhead','spell');}},'R|adapts cloud');
S('lightning','air','storm',3,'Hits the strongest rival thing for 5. What is left over hits the rival.',(G,p)=>{const f=top(seen(G,p));if(!f){face(G,1-p,3,'lightning','spell');return;}const o=5-f.st;hurt(G,f,5,'lightning');if(o>0)face(G,1-p,o,'lightning','spell');},'R|adapts lightning');
S('squall','air','storm',2,'Every flyer of yours strikes the rival for 1, and the rival takes 1 more.',(G,p)=>face(G,1-p,1+cnt(mine(G,p),'flying'),'squall','over'),'U|keeps squall');
S('gale','air','storm',2,'Blows the strongest rival thing that is not heavy back to its keeper’s hand.',(G,p)=>{const f=top(seen(G,p).filter(x=>!x.kw.heavy&&!x.kw.named));if(f)bounce(G,f);},'U|adapts gust');
T('petrel','air','storm',2,2,2,'bird living flying','Flies. Gains +1/+1 whenever you play a spell or weather.',{play(G,t,c){if(spellish(c))buff(G,t,1,1);}},'U|new');
T('orrery','air','storm',2,0,4,'structure metal cheapspell','Your spells and weather cost 1 less.',null,'U|keeps orrery');
T('weatherglass','air','storm',1,0,3,'glass','When it arrives, a weather comes from your deck or discard into your hand.',{arrive(G,t){fetch(G,t.own,c=>c.type==='weather');}},'C|new');
/* Air support */
T('air','air','',1,0,2,'element flying','An element. Your other flyers have +1 strike.',{aura:(G,t,o)=>o.kw.flying?1:0},'C|keeps air');
T('owl','air','',1,1,3,'bird living flying seer','Flies. Nothing opposite stays hidden while it watches.',null,'C|keeps owl');
T('bat','air','',1,2,1,'beast living flying','Flies.',null,'C|keeps bat');
T('crow','air','',2,1,3,'bird living flying','Flies. Gains +1/+1 whenever a living thing dies.',{anyDie(G,t,o){if(o.kw.living)buff(G,t,1,1);}},'U|keeps crow');
T('swallow','air','',1,1,1,'bird living flying swift','Flies, swift. +1 strike in Spring.',{atk:(G,t)=>G.wx&&G.wx.id==='spring'?1:0},'C|keeps swallow');
T('wasp','air','',1,1,1,'insect living flying toxic tiny','Flies. Toxic: its hits poison.',null,'C|keeps wasp');
A('blow','air','',1,'A thing of yours is carried across: its next strike cannot be blocked.',{use(G,t){t.unbl=1;}},'C|keeps blow');
S('steal','air','',2,'Take a random word from the rival’s hand.',(G,p)=>{const O=G.pl[1-p];if(O.hand.length){const i=Math.floor(E.rnd(G)*O.hand.length);G.pl[p].hand.push(O.hand.splice(i,1)[0]);}},'U|keeps steal',{ok:(G,p)=>G.pl[1-p].hand.length>0});
Q('winged','air','',1,'It flies.',{apply(G,t){t.kw.flying=1;},need:t=>!t.kw.flying&&!t.kw.structure},'C|keeps winged');
Q('quick','air','',1,'+0/+2, and it may act at once and twice this turn.',{apply(G,t){buff(G,t,0,2);t.fresh=false;t.acted=false;t.extra=1;},need:t=>!t.kw.structure},'U|keeps quick');
W('wind','air','',1,'While it lasts: Air things have +1 strike, and flyers arrive swift.',{atk:schAtk('air')},'C|adapts wind, flux');
W('storm','air','',2,'While it lasts: Air things have +1 strike. Each turn lightning hits the strongest thing of whoever did not call it for 2.',{atk:schAtk('air'),turn(G,p){if(G.wx.own!==p){const f=top(G.pl[p].board);if(f)hurt(G,f,2,'storm');}}},'R|keeps storm');
S('gasp','air','',0,'You catch your breath: 2 more breath this turn.',(G,p)=>br(G,p,2),'C|keeps gasp');

/* =========================== WATER · The Thousand Reaches =========================== */
/* Locks and sluices: Head (patient control; the opposite of the flood) */
T('lock','water','locks',2,0,5,'structure guardian','Guardian. Whatever strikes it is held: it cannot act on its next turn.',{blk(G,t,a){a.frz=Math.max(a.frz,1);}},'U|adapts ice');
T('sluice','water','locks',2,0,4,'structure','Each of your turns it gains 1 head. At 3 head it opens: the rival takes 5 and it starts again.',{turn(G,t){t.ctr++;if(t.ctr>=3){t.ctr=0;face(G,opp(t),5,'sluice','tide');}}},'U|new');
T('weir','water','locks',3,0,6,'structure','Things that arrive opposite are caught: they cannot act on their next turn.',{foe(G,t,o){o.frz=Math.max(o.frz,1);}},'R|adapts swamp');
T('lockkeeper','water','locks',2,2,4,'person living','While you have a structure, he cannot be blocked.',{unbl:(G,t)=>mine(G,t.own).some(x=>x.kw.structure)},'U|new');
T('canal','water','locks',1,0,3,'structure liquid','Each of your turns every structure of yours mends 1.',{turn(G,t){for(const x of mine(G,t.own))if(x.kw.structure)mend(G,x,1);}},'C|new');
S('floodgate','water','locks',3,'Open the gates: every rival thing of stand 3 or less is washed back to its keeper’s hand, +1 stand for each structure you have. Heavy things stand firm.',(G,p)=>{const n=3+cnt(mine(G,p),'structure');for(const f of foes(G,p).slice())if(f.st<=n&&!f.kw.heavy&&!f.kw.named)bounce(G,f);},'R|adapts tide');
T('cistern','water','locks',1,0,3,'structure','Holds what you do not spend: up to 2 unspent breath come back next turn.',{end(G,t){t.ctr=Math.min(2,G.pl[t.own].breath);},turn(G,t){if(t.ctr){br(G,t.own,t.ctr);t.ctr=0;}}},'C|new');
/* Fisheries: Seep (sea-born things slip past a guard for half) */
T('otter','water','fishery',1,2,2,'beast living seaborn swift','Sea-born, swift. Seeps: a guard cannot stop it, but it hits for half.',null,'C|keeps otter').seep=true;
T('eel','water','fishery',2,2,4,'fish living seaborn','Sea-born. Seeps: a guard cannot stop it, but it hits for half.',null,'C|keeps eel').seep=true;
T('pike','water','fishery',2,4,2,'fish living seaborn','Sea-born. Seeps: a guard cannot stop it, but it hits for half.',null,'U|keeps pike').seep=true;
T('heron','water','fishery',2,2,3,'bird living flying','Flies. When it arrives, it eats a rival thing of stand 2 or less.',{arrive(G,t){const f=low(seen(G,t.own));if(f&&f.st<=2)kill(G,f,'heron');}},'U|new');
Q('net','water','fishery',2,'A rival thing is netted: it cannot act for 2 turns and cannot fly.',{foe:true,apply(G,t){t.frz=2;delete t.kw.flying;}},'U|adapts bind');
T('fisherman','water','fishery',3,2,5,'person living','Your sea-born things have +1 strike.',{aura:(G,t,o)=>o.kw.seaborn?1:0},'R|new');
S('tide','water','fishery',3,'Every rival thing weaker than your strongest sea-born thing is washed back to its keeper’s hand.',(G,p)=>{const m=top(mine(G,p).filter(x=>x.kw.seaborn));if(!m)return;for(const f of foes(G,p).slice())if(f.st<m.st&&!f.kw.heavy&&!f.kw.named)bounce(G,f);},'R|keeps tide',{ok:(G,p)=>mine(G,p).some(x=>x.kw.seaborn)});
/* Barges and brewers: Cargo (what was spent comes back) */
T('barge','water','barge',3,0,6,'structure','Each of your turns it brings the newest word in your discard back to your hand.',{turn(G,t){const P=G.pl[t.own];if(P.disc.length&&P.hand.length<G.cfg.hand+1)P.hand.push(P.disc.pop());}},'R|adapts memory');
T('bargeman','water','barge',2,2,4,'person living','When he arrives, an action comes back from your discard to your hand.',{arrive(G,t){const P=G.pl[t.own];const i=P.disc.findIndex(id=>DB[id].type==='action');if(i>=0)P.hand.push(P.disc.splice(i,1)[0]);}},'U|new');
T('towhorse','water','barge',3,3,5,'beast living heavy','Heavy. When it arrives, the next word you play this turn costs 2 less.',{arrive(G,t){G.pl[t.own].red=2;}},'U|new');
T('cask','water','barge',1,0,3,'structure','Ferments: after 2 of your turns it becomes ale.',null,'C|adapts flask').lad={to:'ale',n:2};
T('brewer','water','barge',2,1,4,'person living','Each of your turns you gain 1 life, 2 if a cask or ale stands beside him.',{turn(G,t){life(G,t.own,mine(G,t.own).some(x=>x.id==='cask'||x.id==='ale')?2:1);}},'U|new');
S('cargo','water','barge',2,'Unload: draw two words and gain 1 breath.',(G,p)=>{draw(G,p,2);br(G,p,1);},'U|new');
T('hops','water','barge',1,1,2,'plant living','When it dies, you gain 3 life.',{die(G,t){life(G,t.own,3);}},'C|new');
/* Frost: wet things freeze hard (Kepler's snowflake) */
T('snowflake','water','frost',1,0,2,'ice flying','No two alike. When it arrives, the strongest rival thing freezes. If that thing was wet, every rival thing freezes.',{arrive(G,t){const f=top(seen(G,t.own));if(!f)return;const w=f.wet>0;frz(G,f);if(w)for(const x of foes(G,t.own))frz(G,x);}},'S|new (Kepler’s snowflake)');
T('ice','water','frost',1,0,4,'ice guardian','Guardian. The first thing to strike it each turn is frozen.',{blk(G,t,a){frz(G,a);}},'C|keeps ice');
Q('frozen','water','frost',1,'A rival thing freezes: it cannot act on its next turn (two turns if wet), its fire goes out, and it takes 2.',{foe:true,apply(G,t){frz(G,t);hurt(G,t,2,'frozen');}},'C|keeps frozen');
S('hail','water','frost',2,'Every rival thing takes 1. Wet or frozen things take 3.',(G,p)=>{for(const f of foes(G,p).slice())hurt(G,f,f.wet>0||f.frz>0?3:1,'hail');},'U|new');
T('icicle','water','frost',2,3,2,'ice brittle','Brittle. Whatever it hits is frozen.',{hit(G,t,tg){if(tg)frz(G,tg);}},'U|new');
S('thaw','water','frost',1,'Every frozen thing wakes. Rival ones take 3 and are left wet; yours gain +1/+1.',(G,p)=>{for(let s=0;s<2;s++)for(const t of G.pl[s].board.slice())if(t.frz>0){t.frz=0;if(s===p)buff(G,t,1,1);else{wet(G,t);hurt(G,t,3,'thaw');}}},'C|keeps thaw');
W('winter','water','frost',2,'While it lasts: Water things have +1 strike, and every wet thing freezes at the start of its keeper’s turn.',{atk:schAtk('water'),turn(G,p){for(const t of G.pl[p].board)if(t.wet>0&&t.frz<=0){t.frz=0;t.acted=true;}}},'U|keeps winter (now Water)');
/* Water support */
T('water','water','',1,0,3,'element liquid','An element. Each of your turns it soaks the strongest rival thing and puts out the fires on your side.',{turn(G,t){const f=top(foes(G,t.own));if(f)wet(G,f);for(const x of mine(G,t.own))x.burn=0;}},'C|keeps water');
T('toad','water','',1,1,3,'beast living seaborn toxic','Sea-born and toxic: it seeps, and its hits poison.',null,'C|keeps toad').seep=true;
T('quicksilver','water','',3,2,5,'metal liquid toxic','Toxic. The catalyst that lets Air and Earth fuse.',null,'R|keeps quicksilver');
A('seep','water','',1,'It learns to seep: a guard cannot stop it, but then it hits for half.',{learn:true,seep:true},'C|keeps seep');
A('drench','water','',1,'It learns to drench: +1 strike, and whatever it hits is soaked.',{learn:true,atk:()=>1,hit(G,t,tg){if(tg)wet(G,tg);}},'C|keeps drench');
A('wash','water','',2,'Your thing washes the strongest rival thing no stronger than itself back to its keeper’s hand.',{use(G,t){const f=top(seen(G,t.own).filter(x=>x.st<=t.st&&!x.kw.heavy&&!x.kw.named));if(f)bounce(G,f);},need:(t,G)=>seen(G,t.own).some(x=>x.st<=t.st&&!x.kw.heavy&&!x.kw.named)},'U|keeps wash');
S('dissolve','water','',2,'The strongest rival thing loses half its stand.',(G,p)=>{const f=top(seen(G,p));if(f)hurt(G,f,Math.ceil(f.st/2),'dissolve');},'U|keeps dissolve',{ok:(G,p)=>seen(G,p).length>0});
Q('sodden','water','',1,'A rival thing is soaked for 3 turns: it will not burn, it cannot fly, and it has −1 strike.',{foe:true,apply(G,t){wet(G,t);delete t.kw.flying;t.bsk-=1;}},'C|keeps sodden');
Q('torpid','water','',2,'A rival thing falls into deep sleep: it cannot act for 2 turns.',{foe:true,apply(G,t){t.frz=Math.max(t.frz,2);}},'U|keeps torpid, sleep, lullaby');
W('rain','water','',1,'While it lasts: Water things have +1 strike, fires go out, and things that arrive are wet.',{atk:schAtk('water'),arr(G,p){for(let s=0;s<2;s++)for(const t of G.pl[s].board){t.burn=0;}},turn(G,p){for(const t of G.pl[p].board){t.burn=0;if(t.age<=1)t.wet=Math.max(t.wet,2);}}},'C|keeps rain');
W('flood','water','',3,'The river no one commands. While it lasts, every thing on the ground that is not heavy takes 1 at the start of its keeper’s turn, on both sides.',{turn(G,p){for(const t of G.pl[p].board.slice())if(!t.kw.flying&&!t.kw.heavy&&!t.kw.seaborn)hurt(G,t,1,'flood');}},'R|keeps flood');
S('dew','water','',1,'Purest water: you gain 3 life, and all poison on your side is washed out.',(G,p)=>{life(G,p,3);G.pl[p].poison=0;for(const t of mine(G,p))t.psn=0;},'C|keeps dew');
S('memory','water','',2,'Two spent words come back from your graveyard to your hand, and you gain 2 life.',(G,p)=>{raise(G,p,()=>true,'hand');raise(G,p,()=>true,'hand');life(G,p,2);},'U|keeps memory');
S('elixir','water','',3,'You gain 6 life, and every thing of yours heals fully.',(G,p)=>{life(G,p,6);for(const t of mine(G,p))t.st=Math.max(t.st,t.mx);},'R|keeps elixir');

/* =========================== EARTH · The Milefields =========================== */
/* The Bridge: Build (structures, piece by piece) */
T('arch','earth','masonry',2,0,5,'structure','Gains +0/+1 for each other structure of yours when it arrives.',{arrive(G,t){const n=cnt(mine(G,t.own),'structure')-1;if(n>0)buff(G,t,0,n);}},'U|new');
T('pier','earth','masonry',1,0,4,'structure guardian','Guardian.',null,'C|adapts tower');
T('span','earth','masonry',3,0,6,'structure span','While you have 3 or more structures, the bridge stands: your things cannot be blocked.',null,'R|new');
T('keystone','earth','masonry',2,0,3,'structure keystone','While it stands, your other structures cannot fall below 1 stand. If the keystone falls, every structure of yours takes 3.',{die(G,t){for(const x of mine(G,t.own).slice())if(x.kw.structure)hurt(G,x,3,null);}},'S|new (Tess Harrow’s bridge)');
Q('mortar','earth','masonry',1,'+0/+3. A structure also becomes a guardian.',{apply(G,t){buff(G,t,0,3);if(t.kw.structure)t.kw.guardian=1;}},'C|adapts coagulate');
T('scaffold','earth','masonry',1,0,2,'structure','Stands for 3 turns. Structures cost you 1 less while it stands. When it comes down, your strongest structure gains +0/+3.',{die(G,t){const x=top(mine(G,t.own).filter(y=>y.kw.structure));if(x)buff(G,x,0,3);}},'C|new').left=3;
T('mason','earth','masonry',2,2,4,'person living','Each of your turns she adds +0/+2 to your weakest structure.',{turn(G,t){const x=low(mine(G,t.own).filter(y=>y.kw.structure));if(x)buff(G,x,0,2);}},'U|adapts architect');
/* The metal ladder: lead to gold */
T('lead','earth','metal',1,1,4,'metal heavy toxic','Heavy, toxic. After 3 of your turns it becomes tin.',null,'C|keeps lead').lad={to:'tin',n:3};
T('tin','earth','metal',2,1,6,'metal guardian','Guardian. After 3 of your turns it becomes silver.',null,'C|keeps tin').lad={to:'silver',n:3};
T('copper','earth','metal',2,3,3,'metal swift','Swift. After 3 of your turns it becomes silver.',null,'U|keeps copper').lad={to:'silver',n:3};
T('silver','earth','metal',3,3,6,'metal named','No rival word can send it away. After 3 of your turns it becomes gold.',null,'R|keeps silver').lad={to:'gold',n:3};
A('transmute','earth','metal',2,'One of your things climbs one rung of its ladder now (two with a crucible). Anything else gains +1/+1.',{use(G,t){let n=mine(G,t.own).some(x=>x.id==='crucible')?2:1;let did=false;while(n-->0&&DB[t.id].lad){E.evolve(G,t,DB[t.id].lad.to);did=true;}if(!did)buff(G,t,1,1);}},'U|keeps transmute');
T('smelter','earth','metal',3,0,5,'structure fireborn','Each of your turns every ladder thing of yours counts one turn closer.',{turn(G,t){for(const x of mine(G,t.own))if(DB[x.id].lad)x.age++;}},'R|adapts foundry');
T('crucible','earth','metal',2,0,4,'structure heavy crucible','Your fusions cost 1 less, and transmute climbs two rungs.',null,'S|keeps crucible (Agricola’s mining book)');
/* Quarry and bedrock */
T('boulder','earth','quarry',2,1,6,'stone heavy guardian bedrock','Guardian, heavy. Bedrock: +0/+1 each turn it stays, up to +3.',null,'C|keeps boulder');
T('granite','earth','quarry',3,3,6,'stone heavy bedrock','Heavy: its blows carry through. Bedrock: +0/+1 each turn it stays, up to +3.',null,'U|adapts stone');
T('quarryman','earth','quarry',2,3,3,'person living','Tremor: when he hits, every other rival thing on the ground takes 1.',{hit(G,t,tg){for(const f of foes(G,t.own).slice())if(f!==tg&&!f.kw.flying)hurt(G,f,1,'quarryman');}},'U|new');
T('flint','earth','quarry',1,2,2,'stone','Strikes sparks: whatever it hits catches fire.',{hit(G,t,tg){if(tg)ign(G,tg);}},'C|keeps flint');
T('obsidian','earth','quarry',2,5,1,'stone brittle','Brittle. All edge, little body.',null,'U|keeps obsidian');
S('avalanche','earth','quarry',3,'Every rival thing that cannot fly takes 2, +1 for each heavy thing you have.',(G,p)=>{const n=2+cnt(mine(G,p),'heavy');for(const f of foes(G,p).slice())if(!f.kw.flying)hurt(G,f,n,'avalanche');},'R|keeps avalanche');
T('lodestone','earth','quarry',2,1,5,'stone heavy guardian reach','Guardian, heavy. It pulls flyers down: it can block them.',null,'U|keeps lodestone');
/* Potters and the Golem: Shape */
T('clay','earth','pottery',1,0,3,'clay','It wants a shape: every quality or action you give it also adds +1/+1. Name it and it wakes as a golem.',null,'C|keeps clay');
T('potter','earth','pottery',2,1,4,'person living','When he arrives, a lump of clay arrives beside him.',{arrive(G,t){const c=put(G,t.own,'clay');if(c)c.tmp=1;}},'U|new');
T('kiln','earth','pottery',2,0,5,'structure fireborn','Each of your turns your clay and pots gain +1/+1.',{turn(G,t){for(const x of mine(G,t.own))if(x.kw.clay||x.kw.pot)buff(G,x,1,1);}},'U|new');
T('urn','earth','pottery',1,0,3,'pot brittle','Brittle. When it breaks, you draw two words.',{die(G,t){draw(G,t.own,2);}},'C|adapts vessel');
A('wheel','earth','pottery',1,'Shape a thing of yours on the wheel: +1/+2.',{use(G,t){buff(G,t,1,2);}},'C|adapts sculpt');
Q('glaze','earth','pottery',1,'+0/+2. It cannot be poisoned, burned or soaked.',{apply(G,t){buff(G,t,0,2);t.kw.fireborn=1;t.kw.toxic=t.kw.toxic||0;t.psn=0;t.burn=0;t.wet=0;t.kw.glazed=1;}},'C|adapts fixed');
T('brick','earth','pottery',1,1,3,'structure clay','A fired block. +0/+1 for each other structure of yours when it arrives.',{arrive(G,t){const n=cnt(mine(G,t.own),'structure')-1;if(n>0)buff(G,t,0,n);}},'C|adapts sand');
/* Earth support */
T('earth','earth','',1,0,4,'element','An element. Each of your turns your weakest other thing gains +0/+1.',{turn(G,t){const x=low(mine(G,t.own).filter(y=>y!==t));if(x)buff(G,x,0,1);}},'C|keeps earth');
T('iron','earth','',2,3,4,'metal heavy','Heavy: its blows carry through.',null,'U|keeps iron');
T('salt','earth','',1,0,3,'stone','Nothing on your side can be poisoned. The catalyst that lets Fire and Water fuse.',{turn(G,t){G.pl[t.own].poison=0;for(const x of mine(G,t.own))x.psn=0;}},'C|keeps salt');
T('amber','earth','',1,0,2,'stone','When a living thing of yours would die, it returns to your hand instead, and the amber is spent.',{keep(G,t,o){if(o.kw.living&&mine(G,t.own).includes(t)){E.exile(G,t);E.pile(G,t.own).push('amber');return true;}return false;}},'U|keeps amber');
T('tower','earth','',2,0,5,'structure','When it arrives you gain 3 life and draw a word.',{arrive(G,t){life(G,t.own,3);draw(G,t.own,1);}},'U|keeps tower');
T('rhinoceros','earth','',4,4,6,'beast living heavy armour','Armoured: every blow does 1 less. Drawn from hearsay: each quality on it adds +1/+1 more.',null,'S|new (Dürer’s Rhinoceros)');
A('crush','earth','',1,'It learns to crush: +1 strike, and what is left over after it destroys a guard carries through to the rival.',{learn:true,crush:true,atk:()=>1},'C|keeps crush');
A('cut','earth','',1,'It learns to cut: +2 strike.',{learn:true,atk:()=>2},'C|keeps cut');
A('temper','earth','',1,'Temper a thing of yours: +1/+2; a metal gains +2/+3.',{use(G,t){if(t.kw.metal)buff(G,t,2,3);else buff(G,t,1,2);}},'C|keeps temper');
Q('petrify','earth','',3,'A rival thing turns to stone: it takes 3 and cannot act for 2 turns.',{foe:true,apply(G,t){t.frz=Math.max(t.frz,2);hurt(G,t,3,'petrify');}},'R|keeps petrify');
Q('ancient','earth','',1,'Old and strong: +1/+3.',{apply(G,t){buff(G,t,1,3);}},'C|keeps ancient');
Q('leaden','earth','',1,'A rival thing grows heavy: it cannot fly, it is no longer swift, and it has −2 strike.',{foe:true,apply(G,t){delete t.kw.flying;delete t.kw.swift;t.bsk-=2;}},'C|keeps leaden');
W('desert','earth','',2,'While it lasts: Earth things have +1 strike, and flyers have −1 strike.',{atk:(G,t)=>(DB[t.base||t.id].sch==='earth'?1:0)-(t.kw.flying?1:0)},'U|keeps desert');

/* =========================== FIRE · The Cinder Ports =========================== */
/* Glass and lenses: bright, brittle, focused */
T('glass','fire','glass',1,3,1,'glass brittle','Brittle: the first blow shatters it.',null,'C|keeps glass');
T('lens','fire','glass',2,0,2,'glass brittle lens','Brittle. Focus: every burn you deal to the rival does 1 more.',null,'U|new');
Q('anneal','fire','glass',1,'+0/+2, and a brittle thing is brittle no longer.',{apply(G,t){t.kw.annealed=1;buff(G,t,0,2);}},'C|adapts temper');
T('glassblower','fire','glass',2,2,3,'person living','Each of your turns, if you have no glass, she blows one.',{turn(G,t){if(!mine(G,t.own).some(x=>x.id==='glass')){const g=put(G,t.own,'glass');if(g)g.tmp=1;}}},'U|new');
T('furnace','fire','glass',3,0,6,'structure fireborn','Each of your turns the rival is burned for 1, and your glass things gain +1 strike.',{turn(G,t){face(G,opp(t),1,'furnace','burn');for(const x of mine(G,t.own))if(x.kw.glass)buff(G,x,1,0);}},'R|adapts bonfire');
T('prism','fire','glass',2,0,2,'glass brittle','Brittle. When it arrives, the strongest rival thing is dazzled: it cannot act on its next turn.',{arrive(G,t){const f=top(seen(G,t.own));if(f)f.frz=Math.max(f.frz,1);}},'U|adapts peacock');
T('mirror','fire','glass',2,0,3,'glass brittle','Brittle. Whenever you lose life, the rival loses 1.',{owner(G,t,n){if(!G.mir){G.mir=1;face(G,opp(t),1,'mirror','burn');G.mir=0;}}},'U|adapts nemesis');
/* Foundry and forge: Heat */
T('bellows','fire','foundry',2,0,4,'tool','Leather lungs: 1 more breath each of your turns.',{turn(G,t){br(G,t.own,1);}},'U|keeps bellows');
T('smith','fire','foundry',2,3,4,'person living','Strikes sparks: whatever he hits catches fire.',{hit(G,t,tg){if(tg)ign(G,tg);}},'U|keeps smith');
T('anvil','fire','foundry',2,0,6,'structure metal heavy guardian thorny','Guardian. Whatever strikes it takes 1. Your metal things have +1 strike.',{aura:(G,t,o)=>o.kw.metal?1:0},'U|new');
T('forge','fire','foundry',3,0,5,'structure fireborn','Each of your turns your strongest thing that can strike gains +1 strike.',{turn(G,t){const x=top(mine(G,t.own).filter(y=>!y.kw.structure));if(x)buff(G,x,1,0);}},'R|adapts foundry');
A('hammer','fire','foundry',1,'It learns the hammer: +2 strike, and what is left over after it destroys a guard carries through.',{learn:true,crush:true,atk:()=>2},'C|new');
T('ingot','fire','foundry',1,0,3,'metal','Raw metal. After 2 of your turns it is a blade.',null,'C|adapts slag').lad={to:'blade',n:2};
S('quench','fire','foundry',1,'Your strongest metal thing (or strongest thing) gains +1/+3 and stops burning; a metal gains +2/+4.',(G,p)=>{const m=top(mine(G,p).filter(x=>x.kw.metal))||top(mine(G,p));if(!m)return;m.burn=0;if(m.kw.metal)buff(G,m,2,4);else buff(G,m,1,3);},'C|new',{ok:(G,p)=>mine(G,p).length>0});
/* Saltworks: Sacrifice (what you burn away, burns the rival) */
T('brine','fire','saltworks',1,0,3,'liquid','Boil it away: when it dies you gain 2 breath.',{die(G,t){br(G,t.own,2);}},'C|keeps brine (now Fire)');
T('salter','fire','saltworks',2,2,4,'person living','Whenever another thing of yours dies, the rival is burned for 2.',{anyDie(G,t,o){if(o.own===t.own)face(G,opp(t),2,'salter','burn');}},'U|new');
A('calcine','fire','saltworks',1,'Burn one of your own things to ash: the rival is burned for its strike +2, and ash is left.',{use(G,t){const s=E.strikeOf(G,t)+2,p=t.own;kill(G,t,null);face(G,1-p,s,'calcine','burn');const a=put(G,p,'ash');}},'U|keeps calcine');
S('sacrifice','fire','saltworks',1,'Destroy your weakest thing: you gain 3 breath and draw a word.',(G,p)=>{const x=low(mine(G,p));if(!x)return;kill(G,x,null);br(G,p,3);draw(G,p,1);},'C|keeps sacrifice',{ok:(G,p)=>mine(G,p).length>0,keep:true});
T('saltpetre','fire','saltworks',2,0,3,'stone','When it arrives the rival is burned for 2. When it dies, for 3.',{arrive(G,t){face(G,opp(t),2,'saltpetre','burn');},die(G,t){face(G,opp(t),3,'saltpetre','burn');}},'U|keeps saltpetre');
T('pitch','fire','saltworks',1,1,3,'liquid','Whatever it hits catches fire. When it dies, the strongest rival thing catches fire.',{hit(G,t,tg){if(tg)ign(G,tg);},die(G,t){const f=top(foes(G,t.own));if(f)ign(G,f);}},'C|keeps pitch');
T('naphtha','fire','saltworks',2,0,2,'liquid','When it dies it bursts: everything opposite takes 2.',{die(G,t){for(const f of foes(G,t.own).slice())hurt(G,f,2,'naphtha');}},'U|keeps naphtha');
/* Beacon and wildfire: Burning */
T('torch','fire','wildfire',1,1,2,'tool','Each of your turns the rival is burned for 1.',{turn(G,t){face(G,opp(t),1,'torch','burn');}},'C|keeps torch');
T('ember','fire','wildfire',2,2,4,'fireborn','Never burns away. Whatever it hits catches fire.',{hit(G,t,tg){if(tg)ign(G,tg);}},'U|keeps ember');
T('cinderling','fire','wildfire',2,3,2,'beast living fireborn swift','Swift.',null,'U|keeps cinderling');
T('bonfire','fire','wildfire',3,0,6,'structure fireborn','Each of your turns the rival is burned for 1 and your fire-born things gain +0/+1.',{turn(G,t){face(G,opp(t),1,'bonfire','burn');for(const x of mine(G,t.own))if(x.kw.fireborn&&x!==t)buff(G,x,0,1);}},'R|keeps bonfire');
T('tinder','fire','wildfire',1,0,2,'plant','When it dies, the strongest rival thing catches fire, the rival is burned for 2, and ash is left.',{die(G,t){const f=top(foes(G,t.own));if(f)ign(G,f);face(G,opp(t),2,'tinder','burn');put(G,t.own,'ash');}},'C|new');
S('wildfire','fire','wildfire',3,'Every rival thing catches fire, and the rival is burned for 1 for each thing already burning.',(G,p)=>{let n=0;for(let s=0;s<2;s++)for(const t of G.pl[s].board)if(t.burn>0)n++;for(const f of foes(G,p))ign(G,f);face(G,1-p,1+n,'wildfire','burn');},'R|keeps wildfire');
T('salamander','fire','wildfire',3,3,5,'beast living fireborn','When it arrives it lights the strongest rival thing. +1 strike for each burning thing.',{arrive(G,t){const f=top(seen(G,t.own));if(f)ign(G,f);},atk(G,t){let n=0;for(let s=0;s<2;s++)for(const x of G.pl[s].board)if(x.burn>0)n++;return Math.min(3,n);}},'R|keeps salamander');
/* Fire support */
T('fire','fire','',1,0,3,'element fireborn','An element. Each of your turns it spreads: the weakest rival thing catches fire.',{turn(G,t){const f=low(foes(G,t.own));if(f)ign(G,f);}},'C|keeps fire');
T('phosphorus','fire','',2,0,3,'stone','Light-bearer. When it arrives, the rival is burned for 3.',{arrive(G,t){face(G,opp(t),3,'phosphorus','burn');}},'U|keeps phosphorus');
T('brimstone','fire','',2,2,4,'stone toxic','Toxic. The catalyst that lets Life and Rot fuse.',null,'R|keeps brimstone (now learnable)');
T('scintilla','fire','',1,0,2,'spark','A spark. Your fusions need no catalyst and cost 1 less.',null,'U|keeps scintilla');
A('burn','fire','',1,'It learns to burn: +1 strike, and whatever it hits catches fire.',{learn:true,atk:()=>1,hit(G,t,tg){if(tg)ign(G,tg);}},'C|keeps burn');
A('scorch','fire','',1,'A thing of yours burns the rival for half its strike +1. Nothing can block it.',{use(G,t){face(G,opp(t),Math.ceil(E.strikeOf(G,t)/2)+1,'scorch','burn');}},'C|keeps scorch');
A('kindle','fire','',1,'A thing of yours gains +2 strike and may strike at once.',{use(G,t){buff(G,t,2,0);t.fresh=false;},need:t=>!t.kw.structure},'C|keeps kindle');
Q('blind','fire','',1,'A rival thing is dazzled: it cannot act on its next turn, and it is no longer hidden.',{foe:true,apply(G,t){t.frz=Math.max(t.frz,1);delete t.kw.hidden;}},'C|keeps blind');
Q('burning','fire','',1,'A rival thing catches fire: it burns for 2 a turn and its keeper chokes for 1, and it takes 1 now.',{foe:true,apply(G,t){ign(G,t);hurt(G,t,1,'burning');}},'C|keeps burning');
Q('radiant','fire','',1,'+1 strike. Nothing opposite stays hidden from it.',{apply(G,t){buff(G,t,1,0);t.kw.seer=1;}},'C|keeps radiant');
Q('firebrand','fire','',1,'Its hits also burn the rival for 1.',{hit(G,t){face(G,opp(t),1,'firebrand','burn');}},'C|keeps firebrand');
W('drought','fire','',1,'While it lasts: Fire things have +1 strike, nothing stays wet, and burning things take 1 more each turn.',{atk:schAtk('fire'),turn(G,p){for(const t of G.pl[p].board.slice()){t.wet=0;if(t.burn>0)hurt(G,t,1,'drought');}}},'C|keeps drought');
W('noon','fire','',1,'While it lasts: Fire things have +1 strike, and nothing stays hidden.',{atk:schAtk('fire'),arr(G,p){for(let s=0;s<2;s++)for(const t of G.pl[s].board)delete t.kw.hidden;},turn(G,p){for(const t of G.pl[p].board)delete t.kw.hidden;}},'C|keeps noon');
return H;});
