/* Sandbox card set, part 2: Life, Rot, The Word, Plain Speech and the Hermetic Order, ladder rungs, tokens, made-only cards and recipes. */
(function(root,f){if(typeof module==='object'&&module.exports)module.exports=f;else root.WAS_CARDS2=f;})(this,function(E,H){
'use strict';
const {DB,def,recipe,face,hurt,kill,buff,mend,life,psn,tpsn,ign,frz,wet,draw,br,put,bounce,raise,foes,mine,seen,top,low,cnt,is,dis,pack,fetch,pile}=E;
const {T,A,Q,W,S,most,spellish,schAtk}=H;
const opp=t=>1-t.own;
const absorb=(G,t,o)=>{/* t takes o into itself: stats, kinds and nature */buff(G,t,E.strikeOf(G,o),o.st);for(const k in o.kw)if(k!=='structure')t.kw[k]=1;t.also=(t.also||[]).concat([o.id],o.also||[]);t.title=E.nm(t)+'-'+E.nm(o);
  E.exile(G,o);const P=G.pl[t.own];if(!o.tmp&&!DB[o.id].tok){const add=(o.inp||[o.base||o.id]).slice();t.inp=(t.inp||[t.base||t.id]).slice();for(const id of add)t.inp.push(id);}for(const q of o.q)t.q.push(q);};

/* =========================== LIFE · The Long Enclosure =========================== */
/* The Orchard: Variety */
T('pear','life','orchard',2,1,4,'plant tree fruit living','Variety: +1 strike for each differently named thing beside it (up to 3), and each of your turns you gain 1 life for each different fruit you grow (up to 2). Sameness: if two things beside it share a name, it gives nothing.',
 {atk(G,t){const s={};let dup=false,n=0;for(const x of mine(G,t.own)){if(x===t)continue;if(s[x.id])dup=true;else{s[x.id]=1;n++;}if(x.id==='pear')dup=true;}return dup?0:Math.min(3,n);},
  turn(G,t){const s={};let dup=false;const all={};for(const x of mine(G,t.own)){if(x!==t&&(all[x.id]||x.id==='pear'))dup=true;all[x.id]=1;if(x.kw.fruit)s[x.id]=1;}if(!dup)life(G,t.own,Math.min(2,Object.keys(s).length));}},'S|new (the pear of the Atlas)');
T('apple','life','orchard',2,2,4,'plant tree fruit living','Each of your turns it mends your most hurt thing by 2.',{turn(G,t){const x=most(G,t.own);if(x)mend(G,x,2);}},'C|adapts aloe');
T('quince','life','orchard',2,1,5,'plant tree fruit living','Slow to sweeten: after 2 of your turns it gains +2/+2.',{turn(G,t){if(t.age===2)buff(G,t,2,2);}},'U|new');
T('blossom','life','orchard',1,0,2,'plant flower living','Stands for 2 turns. When it arrives your trees gain +0/+2. When it falls, you draw a word.',{arrive(G,t){for(const x of mine(G,t.own))if(x.kw.tree)buff(G,x,0,2);},die(G,t){draw(G,t.own,1);}},'C|new').left=2;
A('graft','life','orchard',2,'One of your plants takes your weakest other plant into itself: the sum of their strike and stand, and both natures.',{use(G,t){const o=low(mine(G,t.own).filter(x=>x!==t&&x.kw.plant));if(o)absorb(G,t,o);},need:(t,G)=>!!t.kw.plant&&mine(G,t.own).some(x=>x!==t&&x.kw.plant)},'U|keeps graft');
S('windfall','life','orchard',1,'Fruit on the ground: you gain 2 life for each fruit tree you have, and draw a word.',(G,p)=>{life(G,p,2*cnt(mine(G,p),'fruit'));draw(G,p,1);},'C|keeps windfall (new sense)',{});
T('orchard keeper','life','orchard',3,2,5,'person living','Your trees have +1 strike. When a tree of yours dies, a sapling is planted.',{aura:(G,t,o)=>o.kw.tree?1:0,anyDie(G,t,o){if(o.own===t.own&&o.kw.tree)put(G,t.own,'sapling');}},'R|adapts druid');
/* Hedgerow and pack */
T('wolf','life','hedgerow',2,2,2,'beast living','Pack: it arrives with +1/+1 for each other beast of yours.',{arrive(G,t){const n=cnt(mine(G,t.own),'beast')-1;if(n>0)buff(G,t,n,n);}},'C|keeps wolf');
T('hare','life','hedgerow',1,1,2,'beast living swift','Swift.',null,'C|keeps hare');
T('hound','life','hedgerow',2,2,3,'beast living guardian','Guardian.',null,'C|new');
T('stag','life','hedgerow',3,3,4,'beast living','Your other beasts have +1 strike.',{aura:(G,t,o)=>o.kw.beast?1:0},'R|keeps stag');
T('bramble','life','hedgerow',2,1,5,'plant living thorny guardian','Guardian. Thorny: whatever strikes it takes 1.',null,'C|keeps bramble');
T('fox','life','hedgerow',2,3,2,'beast living hidden','Hidden: the rival cannot single it out.',null,'U|new');
S('stampede','life','hedgerow',3,'Your beasts charge the strongest rival thing with all their strike together. What is left over hits the rival.',(G,p)=>{let s=0;for(const x of mine(G,p))if(x.kw.beast)s+=E.strikeOf(G,x);if(!s)return;const f=top(foes(G,p));if(!f){face(G,1-p,s,'stampede');return;}const o=s-f.st;hurt(G,f,s,'stampede');if(o>0)face(G,1-p,o,'stampede','crush');},'R|keeps stampede',{ok:(G,p)=>mine(G,p).some(x=>x.kw.beast)});
/* Managed woodland: the plant ladder */
T('seed','life','woodland',1,0,2,'plant living','Plant it. After 2 of your turns it is a sapling, and after 2 more an oak.',null,'C|keeps seed').lad={to:'sapling',n:2};
T('oak','life','woodland',4,3,8,'plant tree living heavy guardian','Guardian, heavy. Slow, vast and hard to kill.',null,'R|keeps oak');
T('willow','life','woodland',2,1,5,'plant tree living','Its bark eases pain: each of your turns you gain 1 life and lose 1 poison.',{turn(G,t){life(G,t.own,1);const P=G.pl[t.own];if(P.poison>0)P.poison--;}},'C|keeps willow');
T('coppice','life','woodland',3,0,6,'plant living structure','Cut it and it comes again: each of your turns it sends up a sapling, if you have none.',{turn(G,t){if(!mine(G,t.own).some(x=>x.id==='sapling'))put(G,t.own,'sapling');}},'R|new');
T('woodward','life','woodland',2,2,4,'person living','Each of your turns your seeds and saplings count one turn closer, and your trees gain +0/+1.',{turn(G,t){for(const x of mine(G,t.own)){if(x.id==='seed'||x.id==='sapling')x.age++;if(x.kw.tree)buff(G,x,0,1);}}},'U|new');
A('grow','life','woodland',1,'A plant of yours gains +1/+3. A seed or sapling also jumps a stage.',{use(G,t){if(DB[t.id].lad&&(t.id==='seed'||t.id==='sapling'))E.evolve(G,t,DB[t.id].lad.to);buff(G,t,1,3);},need:t=>!!t.kw.plant},'C|keeps grow');
T('ivy','life','woodland',2,1,4,'plant living','Climbs and binds: when it arrives, the strongest rival thing cannot act on its next turn.',{arrive(G,t){const f=top(seen(G,t.own));if(f)f.frz=Math.max(f.frz,1);}},'C|keeps ivy');
/* Herbalists and the Nameless Herbal */
T('aloe','life','herbal',1,0,3,'plant herb living','Each of your turns it mends your most hurt thing by 2.',{turn(G,t){const x=most(G,t.own);if(x)mend(G,x,2);}},'C|keeps aloe');
T('rue','life','herbal',1,1,2,'plant herb living hidden','The herb of grace. Hidden. When it arrives, all poison on your side is cured and you gain 2 life.',{arrive(G,t){G.pl[t.own].poison=0;for(const x of mine(G,t.own))x.psn=0;life(G,t.own,2);}},'C|keeps rue');
T('herbalist','life','herbal',2,1,4,'person living','Each of your turns you gain 2 life.',{turn(G,t){life(G,t.own,2);}},'U|adapts apothecary');
T('comfrey','life','herbal',1,0,3,'plant herb living','Knitbone. When it arrives, your most hurt thing heals fully and gains +0/+1.',{arrive(G,t){const x=most(G,t.own);if(x){x.st=x.mx;buff(G,x,0,1);}}},'C|new');
Q('poultice','life','herbal',1,'A thing of yours heals fully, gains +0/+2, and its poison and fire are drawn out.',{apply(G,t){t.st=Math.max(t.st,t.mx);buff(G,t,0,2);t.psn=0;t.burn=0;}},'C|adapts mend');
T('mandrake','life','herbal',2,2,3,'plant herb living toxic','Toxic. Its scream: when it arrives, every rival thing takes 1.',{arrive(G,t){for(const f of foes(G,t.own).slice())hurt(G,f,1,'mandrake');}},'U|keeps mandrake');
A('conjoin','life','herbal',2,'Join one of your living things with your weakest other living thing into one impossible creature: the sum of their strike and stand, both names, both natures.',{use(G,t){const o=low(mine(G,t.own).filter(x=>x!==t&&x.kw.living));if(o)absorb(G,t,o);},need:(t,G)=>!!t.kw.living&&mine(G,t.own).some(x=>x!==t&&x.kw.living)},'S|keeps conjoin (the Nameless Herbal)');
/* Micrographia: tiny things, dangerous by their relationships */
T('flea','life','tiny',1,1,1,'insect living tiny','Tiny. +1 strike for each beast or person on the rival’s side: it lives on its hosts.',{atk(G,t){let n=0;for(const f of foes(G,t.own))if(f.kw.beast||f.kw.person)n++;return Math.min(3,n);}},'C|new (Hooke’s flea)');
T('mite','life','tiny',1,1,1,'insect living tiny','Tiny. When it arrives, it settles on the strongest rival thing: −2 strike.',{arrive(G,t){const f=top(seen(G,t.own));if(f)f.bsk-=2;}},'C|new');
T('aphid','life','tiny',1,0,2,'insect living tiny','Tiny. Each of your turns your ants gain +1/+1 and you gain 1 life.',{turn(G,t){for(const x of mine(G,t.own))if(x.id==='ant')buff(G,x,1,1);life(G,t.own,1);}},'C|new');
T('ant','life','tiny',1,1,2,'insect living tiny','Tiny. +1 strike for each other tiny thing of yours.',{atk(G,t){return Math.min(4,cnt(mine(G,t.own),'tiny')-1);}},'C|new');
T('bee','life','tiny',2,2,2,'insect living tiny flying','Tiny, flies. When it hits, your weakest plant gains +1/+1 and you gain 1 life.',{hit(G,t){const x=low(mine(G,t.own).filter(y=>y.kw.plant));if(x)buff(G,x,1,1);life(G,t.own,1);}},'U|new');
T('weevil','life','tiny',1,1,1,'insect living tiny','Tiny. When it arrives it eats a rival plant of stand 3 or less; if there is none, it gains +1/+1.',{arrive(G,t){const f=low(seen(G,t.own).filter(x=>x.kw.plant));if(f&&f.st<=3)kill(G,f,'weevil');else buff(G,t,1,1);}},'C|adapts locust');
Q('magnify','life','tiny',2,'Under the glass: a tiny thing doubles its strike and stand and is tiny no longer. Anything else gains +1/+1.',{apply(G,t){if(t.kw.tiny){buff(G,t,E.strikeOf(G,t),t.st);delete t.kw.tiny;}else buff(G,t,1,1);}},'S|new (Hooke’s Micrographia)');
/* Life support */
T('bear','life','',4,4,7,'beast living heavy','Heavy: wind and water cannot move it.',null,'U|keeps bear');
T('boar','life','',3,4,4,'beast living heavy swift','Heavy, swift.',null,'U|keeps boar');
T('nettle','life','',1,1,3,'plant herb living thorny','Thorny: whatever strikes it takes 1.',null,'C|keeps nettle');
A('bite','life','',1,'It learns to bite: +1 strike, +2 for a beast.',{learn:true,atk:(G,t)=>t.kw.beast?2:1},'C|keeps bite');
S('mend','life','',1,'You gain 3 life, and your most hurt thing heals fully.',(G,p)=>{life(G,p,3);const x=most(G,p);if(x)x.st=x.mx;},'C|keeps mend',{});
S('tame','life','',3,'A rival beast of stand 4 or less comes to your side.',(G,p)=>{const f=top(seen(G,p).filter(x=>x.kw.beast&&x.st<=4&&!x.kw.named));if(!f||G.pl[p].board.length>=G.cfg.field)return;E.exile(G,f);f.own=p;f.fresh=true;f.guard=true;G.pl[p].board.push(f);},'R|keeps tame',{ok:(G,p)=>G.pl[p].board.length<G.cfg.field&&seen(G,p).some(x=>x.kw.beast&&x.st<=4&&!x.kw.named)});
A('ripen','life','',1,'A plant of yours gains +1/+2. Anything on a ladder also climbs a rung.',{use(G,t){if(DB[t.id].lad)E.evolve(G,t,DB[t.id].lad.to);if(t.kw.plant)buff(G,t,1,2);},need:t=>!!t.kw.plant||!!DB[t.id].lad},'C|keeps ripen');
Q('thorny','life','',1,'+0/+2, and whatever strikes it takes 1.',{apply(G,t){buff(G,t,0,2);t.kw.thorny=1;}},'C|keeps thorny');
Q('feral','life','',1,'Wild: +1 strike, and it is swift.',{apply(G,t){buff(G,t,1,0);t.kw.swift=1;t.fresh=false;},need:t=>!t.kw.structure},'C|keeps feral');
Q('sacred','life','',1,'+0/+1, and the rival cannot single it out.',{apply(G,t){buff(G,t,0,1);t.kw.hidden=1;t.kw.sacred=1;}},'C|keeps sacred');
W('spring','life','',1,'While it lasts: Life things have +1 strike, and each turn your weakest thing gains +0/+1.',{atk:schAtk('life'),turn(G,p){const x=low(G.pl[p].board);if(x&&G.wx.own===p)buff(G,x,0,1);}},'C|keeps spring');
W('harvest','life','',2,'While it lasts: Life things have +1 strike, and whoever called it gains 1 life a turn for each plant they grow (up to 3).',{atk:schAtk('life'),turn(G,p){if(G.wx.own===p)life(G,p,Math.min(3,cnt(G.pl[p].board,'plant')));}},'U|keeps harvest');
S('abundance','life','',3,'Every living thing of yours gains +1/+2.',(G,p)=>{for(const x of mine(G,p).slice())if(x.kw.living)buff(G,x,1,2);},'R|keeps abundance',{ok:(G,p)=>mine(G,p).some(x=>x.kw.living)});

/* =========================== ROT · Sallow Fen =========================== */
/* The paper mill: Salvage */
T('rag','rot','paper',1,1,2,'paper','When it dies, a spell comes back from your graveyard to your hand.',{die(G,t){raise(G,t.own,c=>c.type==='spell','hand');}},'C|new');
T('pulp','rot','paper',1,1,3,'paper','When it arrives, the newest thing in your graveyard goes to the bottom of your deck, and you draw a word.',{arrive(G,t){const a=pile(G,t.own);for(let i=a.length-1;i>=0;i--)if(DB[a[i]].type==='thing'){G.pl[t.own].deck.unshift(a.splice(i,1)[0]);break;}draw(G,t.own,1);}},'C|new');
T('palimpsest','rot','paper',2,0,1,'paper','Written over: it arrives as the strongest thing in either graveyard, with its strike, stand and nature, under its own name.',{arrive(G,t){let b=null;for(let s=0;s<2;s++)for(const id of pile(G,s)){const d=DB[id];if(d.type==='thing'&&id!=='palimpsest'&&(!b||d.sk+d.st>b.sk+b.st))b=d;}if(!b)return;t.bsk=b.sk;t.mx=t.st=Math.max(1,Math.round(b.st*G.cfg.dur));for(const k of b.kw)t.kw[k]=1;t.also=[b.id];t.title='palimpsest ('+b.name+')';}},'R|adapts unnamed');
T('papermaker','rot','paper',2,2,4,'person living','Whenever another thing of yours dies, you draw a word.',{anyDie(G,t,o){if(o.own===t.own)draw(G,t.own,1);}},'U|new');
S('page','rot','paper',1,'A recycled page: the newest thing in your graveyard returns to your hand.',(G,p)=>{raise(G,p,c=>c.type==='thing','hand');},'C|new',{ok:(G,p)=>pile(G,p).some(id=>DB[id].type==='thing')});
S('salvage','rot','paper',2,'Two words come back from your graveyard to your hand.',(G,p)=>{raise(G,p,c=>c.id!=='salvage','hand');raise(G,p,c=>c.id!=='salvage','hand');},'U|adapts memory',{ok:(G,p)=>pile(G,p).length>0});
T('ragpicker','rot','paper',2,3,3,'person living hidden','Hidden. When it hits the rival, the newest word in their graveyard comes to your hand.',{hit(G,t,tg){if(!tg){const a=pile(G,opp(t));if(a.length)G.pl[t.own].hand.push(a.pop());}}},'U|adapts thief');
/* The peat bog: Poison */
T('adder','rot','bog',2,2,3,'beast serpent living toxic','Toxic: its hits poison.',null,'C|keeps adder');
T('hemlock','rot','bog',1,0,3,'plant herb living toxic','When it dies, the rival takes 2 doses of poison.',{die(G,t){psn(G,opp(t),2);}},'C|keeps hemlock');
T('nightshade','rot','bog',2,0,4,'plant herb living toxic','Each of your turns the strongest living rival thing is poisoned.',{turn(G,t){const f=top(foes(G,t.own).filter(x=>x.kw.living&&!x.kw.toxic));if(f)tpsn(G,f,1);}},'U|keeps nightshade');
T('leech','rot','bog',1,1,2,'beast living','What it takes from the rival, you gain as life.',{hit(G,t,tg,d){if(!tg)life(G,t.own,d);}},'C|keeps leech');
Q('venomous','rot','bog',1,'+1 strike, and it becomes toxic: its hits poison.',{apply(G,t){buff(G,t,1,0);t.kw.toxic=1;}},'C|keeps venomous, toxify');
S('miasma','rot','bog',3,'Every living rival thing is poisoned, and the rival takes 2 doses.',(G,p)=>{for(const f of foes(G,p))tpsn(G,f,1);psn(G,1-p,2);},'R|keeps miasma');
T('bog','rot','bog',2,0,5,'structure','Each of your turns it holds the strongest rival thing on the ground fast: it cannot act on its next turn.',{turn(G,t){const f=top(foes(G,t.own).filter(x=>!x.kw.flying));if(f)f.frz=Math.max(f.frz,1);}},'U|adapts swamp');
/* The mushroom wood: death feeds it */
T('toadstool','rot','mushroom',1,0,3,'fungus living toxic','Gains +1/+1 whenever anything dies.',{anyDie(G,t){buff(G,t,1,1);}},'C|keeps toadstool');
T('spore','rot','mushroom',1,1,1,'fungus living flying','Flies, and lasts 2 turns. When it dies, the strongest living rival thing takes 2 doses of poison.',{die(G,t){const f=top(foes(G,t.own).filter(x=>x.kw.living));if(f)tpsn(G,f,2);}},'C|keeps spore').left=2;
T('mycelium','rot','mushroom',2,0,4,'fungus living structure','Each of your turns the rival takes 1 for every 2 words in your graveyard (up to 3).',{turn(G,t){const n=Math.min(3,Math.floor(pile(G,t.own).length/2));if(n)face(G,opp(t),n,'mycelium','poison');}},'R|new');
T('rotlog','rot','mushroom',2,0,5,'structure','When a living rival thing dies, the rival takes a dose of poison. When a living thing of yours dies, a spore rises.',{anyDie(G,t,o){if(!o.kw.living)return;if(o.own===t.own){if(o.id!=='spore')put(G,t.own,'spore');}else psn(G,opp(t),1);}},'U|adapts barrow');
T('puffball','rot','mushroom',1,0,2,'fungus living','When it dies, every living rival thing is poisoned and the rival takes a dose.',{die(G,t){for(const f of foes(G,t.own))tpsn(G,f,1);psn(G,opp(t),1);}},'C|new');
T('rat','rot','mushroom',1,2,2,'beast living toxic','Toxic. When it dies, the strongest living rival thing is poisoned.',{die(G,t){const f=top(foes(G,t.own).filter(x=>x.kw.living));if(f)tpsn(G,f,1);}},'C|keeps rat');
S('decay','rot','mushroom',2,'Destroy your weakest thing: the strongest rival thing loses that much stand, +2.',(G,p)=>{const x=low(mine(G,p));if(!x)return;const n=x.st+2;kill(G,x,null);const f=top(seen(G,p));if(f)hurt(G,f,n,'decay');},'U|keeps decay',{ok:(G,p)=>mine(G,p).length>0});
/* Fermentation, undertakers and physicians: what is buried works on */
T('yeast','rot','ferment',1,0,2,'fungus living','Each of your turns your weakest other thing gains +1/+1.',{turn(G,t){const x=low(mine(G,t.own).filter(y=>y!==t));if(x)buff(G,x,1,1);}},'C|new');
Q('ferment','rot','ferment',1,'+1/+1 now. A cask also turns to ale at once.',{apply(G,t){buff(G,t,1,1);if(t.id==='cask')E.evolve(G,t,'ale');t.fer=2;}},'C|keeps ferment');
T('undertaker','rot','ferment',2,2,4,'person living','When he arrives, the two newest words in the rival’s graveyard are buried for good. Whenever anything dies, you gain 1 life.',{arrive(G,t){const a=pile(G,opp(t));a.pop();a.pop();},anyDie(G,t){life(G,t.own,1);}},'U|new');
T('physician','rot','ferment',3,1,5,'person living','When he arrives, the strongest living thing in your graveyard returns to your side.',{arrive(G,t){const a=pile(G,t.own);let b=-1;for(let i=0;i<a.length;i++){const d=DB[a[i]];if(d.type==='thing'&&d.kw.includes('living')&&a[i]!=='physician'&&(b<0||d.st+d.sk>DB[a[b]].st+DB[a[b]].sk))b=i;}if(b>=0&&G.pl[t.own].board.length<G.cfg.field){const id=a.splice(b,1)[0];put(G,t.own,id);if(G.st)G.st[t.own].raised++;}}},'R|adapts apothecary');
T('barrow','rot','ferment',3,0,6,'structure stone','Each of your turns a shade rises for every 4 words in your graveyard (one a turn).',{turn(G,t){if(pile(G,t.own).length>=4)put(G,t.own,'shade');}},'R|keeps barrow (now learnable)');
T('ghost','rot','ferment',2,2,2,'spirit flying hidden','Flies. Hidden.',null,'U|keeps ghost');
T('mould','rot','ferment',1,0,3,'fungus living','Each of your turns the weakest rival thing loses 1 stand for good.',{turn(G,t){const f=low(foes(G,t.own));if(f)buff(G,f,0,-1);}},'C|new');
/* Rot support */
T('shadow','rot','',1,2,2,'spirit hidden','Hidden.',null,'C|keeps shadow');
T('spider','rot','',2,2,4,'beast living toxic guardian reach','Guardian, toxic. Its web reaches flyers: it can block them.',null,'U|keeps spider');
T('yew','rot','',2,0,5,'plant tree living toxic guardian thorny','Guardian. Every part is poison: whatever strikes it takes 1.',null,'C|keeps yew');
T('scorpion','rot','',3,3,4,'beast living toxic thorny','Toxic. Whatever strikes it takes 1.',null,'U|keeps scorpion');
S('wither','rot','',2,'The strongest rival thing loses 3 stand; a plant loses 5.',(G,p)=>{const f=top(seen(G,p));if(f)hurt(G,f,f.kw.plant?5:3,'wither');},'C|keeps wither',{ok:(G,p)=>seen(G,p).length>0});
S('rust','rot','',1,'The strongest rival metal or structure loses 4 stand.',(G,p)=>{const f=top(seen(G,p).filter(x=>x.kw.metal||x.kw.structure));if(f)hurt(G,f,4,'rust');},'C|keeps rust',{ok:(G,p)=>seen(G,p).some(x=>x.kw.metal||x.kw.structure)});
S('haunt','rot','',2,'The strongest rival thing goes back to its keeper’s hand. Sacred and named things cannot be haunted.',(G,p)=>{const f=top(seen(G,p).filter(x=>!x.kw.sacred&&!x.kw.named));if(f)bounce(G,f);},'U|keeps haunt',{ok:(G,p)=>seen(G,p).some(x=>!x.kw.sacred&&!x.kw.named)});
A('poison','rot','',1,'It learns poison: its hits poison, and the strongest living rival thing is poisoned now.',{learn:true,use(G,t){t.kw.toxic=1;const f=top(seen(G,t.own).filter(x=>x.kw.living));if(f)tpsn(G,f,1);}},'C|keeps poison');
Q('occult','rot','',1,'Hidden: the rival cannot single it out, and its next strike cannot be blocked.',{apply(G,t){t.kw.hidden=1;t.unbl=1;}},'C|keeps occult, masked');
Q('feeble','rot','',1,'A rival thing weakens: −2 strike, and it takes 2.',{foe:true,apply(G,t){t.bsk-=2;hurt(G,t,2,'feeble');}},'C|keeps feeble');
W('night','rot','',1,'While it lasts: Rot things have +1 strike, and things that arrive are hidden.',{atk:schAtk('rot'),turn(G,p){for(const t of G.pl[p].board)if(t.age<=1&&G.wx.own===p)t.kw.hidden=1;}},'C|keeps night');
S('plague','rot','',2,'Every living thing on both sides is poisoned, and the rival takes a dose.',(G,p)=>{for(let s=0;s<2;s++)for(const t of G.pl[s].board)tpsn(G,t,1);psn(G,1-p,1);},'U|keeps plague');
T('abyss','rot','',3,0,4,'structure','The first thing of yours destroyed each turn climbs back into your hand.',{keep(G,t,o){if(t.ctr===G.turn||o===t)return false;t.ctr=G.turn;return true;}},'R|keeps abyss');

/* =========================== THE WORD · Quire =========================== */
/* The printing house: Editions */
T('press','word','press',3,0,6,'structure','The first spell you speak each turn is printed: its words work twice.',{play(G,t,c){if(c.type==='spell'&&t.ctr!==G.turn&&G.over==null){t.ctr=G.turn;E.say(G,'The press prints it again.');c.cast(G,t.own);}}},'R|adapts echo');
T('type','word','press',1,0,3,'structure metal speaker','Movable type. A speaker: the first spell of The Word you speak each turn hits 1 harder.',null,'C|new');
T('ink','word','press',1,0,2,'liquid','A well of ink, lasting 4 turns: 1 more breath each of your turns.',{turn(G,t){br(G,t.own,1);}},'C|keeps ink').left=4;
S('edition','word','press',2,'A new edition: two spells come back from your graveyard to your hand.',(G,p)=>{raise(G,p,c=>c.type==='spell'&&c.id!=='edition','hand');raise(G,p,c=>c.type==='spell'&&c.id!=='edition','hand');},'U|new',{ok:(G,p)=>pile(G,p).some(id=>DB[id].type==='spell'&&id!=='edition')});
T('printer','word','press',2,2,4,'person living speaker','A speaker. Gains +1 strike whenever you speak a spell.',{play(G,t,c){if(c.type==='spell')buff(G,t,1,0);}},'U|new');
S('proof','word','press',1,'Read the proof: draw two words.',(G,p)=>draw(G,p,2),'C|adapts omen');
S('pamphlet','word','press',1,'The rival takes 1 for each spell you have spoken this turn, this one included.',(G,p)=>face(G,1-p,G.pl[p].spells,'pamphlet','spell'),'C|adapts rumour');
/* Scribes and the colleges: Speakers */
T('scribe','word','scribes',1,1,4,'person living speaker','A speaker: the first spell of The Word you speak each turn hits 1 harder (up to 3 speakers).',null,'C|keeps scribe');
T('bard','word','scribes',2,2,4,'person living speaker','A speaker. The first spell you speak each turn, you draw a word.',{play(G,t,c){if(c.type==='spell'&&t.ctr!==G.turn){t.ctr=G.turn;draw(G,t.own,1);}}},'U|keeps bard');
T('hermit','word','scribes',2,1,5,'person living speaker hidden','A speaker. Hidden: the rival cannot single him out.',null,'U|keeps hermit');
Q('rune','word','scribes',1,'Carved with a rune: +1/+1, and it counts as a speaker.',{apply(G,t){buff(G,t,1,1);t.kw.speaker=1;}},'C|keeps rune');
S('omen','word','scribes',2,'Read the omen: draw two words.',(G,p)=>draw(G,p,2),'U|keeps omen');
S('silence','word','scribes',2,'The rival drops two words from their hand.',(G,p)=>{dis(G,1-p);dis(G,1-p);},'U|keeps silence',{once:true});
S('gnosis','word','scribes',3,'Draw three words. For the rest of this turn nothing can block your things.',(G,p)=>{draw(G,p,3);G.pl[1-p].noblk=G.turn;},'R|keeps gnosis');
/* Names and translators: the Margin */
A('name','word','naming',1,'Give a thing a name of its own: +1/+1, and no rival word can send it away or take it. Clay that has stood a turn wakes, named, as a golem.',{use(G,t){t.kw.named=1;if(t.id==='clay'&&!t.fresh){E.evolve(G,t,'golem');}buff(G,t,1,1);}},'C|keeps name');
T('translator','word','naming',2,1,4,'person living speaker','A speaker. She carries meaning across: the first word you play each turn costs 1 less.',{turn(G,t){G.pl[t.own].red=Math.max(G.pl[t.own].red,1);}},'U|new');
Q('resonant','word','naming',2,'One string, many notes: +1/+1 for each other thing anywhere that shares its name, and whatever harms it harms every thing of that name, on both sides.',{apply(G,t){let n=0;for(let s=0;s<2;s++)for(const x of G.pl[s].board)if(x!==t&&x.id===t.id)n++;buff(G,t,n,n);t.kw.resonant=1;}},'S|keeps resonant (Fludd’s monochord)');
T('unnamed','word','naming',2,0,1,'','A thing with no word: it arrives with the strike and stand of the strongest thing opposite.',{arrive(G,t){const f=top(foes(G,t.own));if(f){t.bsk=E.strikeOf(G,f);t.mx=t.st=f.st;}}},'U|keeps unnamed');
S('true name','word','naming',3,'Speak the true name of the strongest rival thing: it is unmade. A named thing cannot be.',(G,p)=>{const f=top(seen(G,p).filter(x=>!x.kw.named));if(f)kill(G,f,'true name');},'R|keeps true name (now learnable)',{ok:(G,p)=>seen(G,p).some(x=>!x.kw.named)});
S('enchant','word','naming',1,'Your strongest thing shakes off every bad condition, heals fully and may act again.',(G,p)=>{const t=top(mine(G,p).filter(x=>!x.kw.structure))||top(mine(G,p));if(!t)return;t.frz=0;t.burn=0;t.psn=0;t.wet=0;t.st=Math.max(t.st,t.mx);t.acted=false;t.fresh=false;},'C|keeps enchant',{ok:(G,p)=>mine(G,p).length>0});
Q('twin','word','naming',3,'There are two of it: a second one arrives beside it.',{apply(G,t){const c=put(G,t.own,t.id);if(c){c.tmp=1;c.bsk=t.bsk;c.st=t.st;c.mx=t.mx;for(const k in t.kw)c.kw[k]=1;}},need:(t,G)=>G.pl[t.own].board.length<G.cfg.field},'R|keeps twin');
/* The publisher's ledger: accumulation */
S('loan','word','ledger',0,'3 more breath now. The debt: 1 less breath next turn.',(G,p)=>{br(G,p,3);G.pl[p].tax+=1;},'C|keeps loan, debt',{});
T('miser','word','ledger',2,1,5,'person living speaker','A speaker. He keeps what you do not spend: up to 2 unspent breath come back next turn.',{end(G,t){t.ctr=Math.min(2,G.pl[t.own].breath);},turn(G,t){if(t.ctr){br(G,t.own,t.ctr);t.ctr=0;}}},'U|keeps miser');
T('ledger','word','ledger',2,0,4,'structure paper','Each of your turns it gains a mark. At 3 marks it pays out: you draw two words and gain 2 breath, and it starts again.',{turn(G,t){t.ctr++;if(t.ctr>=3){t.ctr=0;draw(G,t.own,2);br(G,t.own,2);}}},'U|new');
T('publisher','word','ledger',3,2,5,'person living speaker','A speaker. Whenever you play your third word in a turn, the rival takes 3.',{play(G,t){if(G.pl[t.own].pc===3)face(G,opp(t),3,'publisher','spell');}},'R|new');
Q('measure','word','ledger',1,'A rival thing is measured: it loses every gain it has had, and can gain no more.',{foe:true,apply(G,t){const base=Math.max(1,Math.round(DB[t.id].st*(DB[t.id].tok?1:G.cfg.dur)));if(t.bsk>0)t.bsk=0;if(t.mx>base){t.mx=base;if(t.st>base)t.st=base;}t.kw.measured=1;}},'U|keeps measure');
T('surveyor','word','ledger',2,2,3,'person living','When he arrives, if the rival has more things than you, you draw two words; otherwise one.',{arrive(G,t){draw(G,t.own,foes(G,t.own).length>mine(G,t.own).length?2:1);}},'U|new');
T('time','word','ledger',3,0,3,'structure clock','The pendulum. Everything else of yours that works at the start of your turn works twice, and your ladders climb twice as fast.',null,'S|keeps time (Huygens’s clock)');
/* Word support */
T('word','word','',2,2,5,'','Grows by +0/+1 every time you speak a spell or call a weather, and by +1 strike every second time.',{play(G,t,c){if(spellish(c)){t.ctr++;buff(G,t,t.ctr%2===0?1:0,1);}}},'U|keeps word');
T('alchemist','word','',3,2,5,'person living speaker','A speaker. Your fusions cost 1 less, and each fusion you make gives you a word.',null,'R|keeps alchemist');
S('echo','word','',1,'The newest spell in your graveyard is spoken again.',(G,p)=>{const a=pile(G,p);for(let i=a.length-1;i>=0;i--){const d=DB[a[i]];if(d.type==='spell'&&d.id!=='echo'){d.cast(G,p);return;}}},'U|keeps echo',{ok:(G,p)=>pile(G,p).some(id=>DB[id].type==='spell'&&id!=='echo')});
S('reckoning','word','',3,'Every rival thing of stand 3 or less is destroyed.',(G,p)=>{for(const f of foes(G,p).slice())if(f.st<=3)kill(G,f,'reckoning');},'R|keeps reckoning');
S('stammer','word','',2,'Every word the rival says next turn costs 1 more breath.',(G,p)=>{G.pl[1-p].stamNext=1;},'U|keeps stammer');
S('scream','word','',2,'Everything opposite takes 1.',(G,p)=>{for(const f of foes(G,p).slice())hurt(G,f,1,'scream');},'C|keeps scream');
S('dispel','word','',1,'The weather ends, and the strongest rival thing loses every gain and every quality.',(G,p)=>{G.wx=null;const t=top(seen(G,p));if(t){DB.measure.apply(G,t);delete t.kw.measured;for(const k of ['guardian','hidden','flying','toxic','thorny','speaker','swift'])if(!DB[t.id].kw.includes(k))delete t.kw[k];}},'C|keeps dispel, doubt');
Q('protect','word','',1,'+0/+2, and the rival cannot single it out.',{apply(G,t){buff(G,t,0,2);t.kw.hidden=1;}},'C|keeps protect, hermetic');
Q('eternal','word','',2,'Destroyed, it returns to its keeper’s hand.',{apply(G,t){t.kw.undying=1;}},'R|keeps eternal');
S('summon','word','',2,'A rival thing of stand 3 or less comes to your side.',(G,p)=>{const f=top(seen(G,p).filter(x=>x.st<=3&&!x.kw.named));if(!f||G.pl[p].board.length>=G.cfg.field)return;E.exile(G,f);f.own=p;f.fresh=true;f.guard=true;G.pl[p].board.push(f);},'U|keeps summon',{once:true,ok:(G,p)=>G.pl[p].board.length<G.cfg.field&&seen(G,p).some(x=>x.st<=3&&!x.kw.named)});
A('awaken','word','',2,'A thing that could not strike comes alive: +3 strike, and it is a structure no longer.',{use(G,t){delete t.kw.structure;t.kw.living=1;buff(G,t,3,0);},need:t=>!!t.kw.structure},'U|keeps awaken');
T('lexicon','word','',1,0,3,'structure paper','Your fusions cost 1 less.',null,'C|keeps lexicon');

/* =========================== PLAIN SPEECH and the HERMETIC ORDER (no school) =========================== */
A('hit','plain','',1,'Plain Speech. It learns to hit: +1 strike, and it may strike at once.',{learn:true,atk:()=>1,use(G,t){t.fresh=false;},need:t=>!t.kw.structure},'C|keeps hit');
Q('guard','plain','',1,'The first word. It always stands in the way first, takes 2 less from every blow, gains +0/+2, and keeps guarding even when it strikes.',{apply(G,t){t.kw.guardian=1;t.kw.warded=1;t.guard=true;buff(G,t,0,2);}},'S|keeps guard (the first word)');
T('meridian','plain','',2,0,4,'structure','The duelling court. Each of your turns: if you have less life than the rival you gain 1 breath; otherwise your strongest thing gains +1 strike.',{turn(G,t){if(G.pl[t.own].life<G.pl[opp(t)].life)br(G,t.own,1);else{const x=top(mine(G,t.own).filter(y=>!y.kw.structure));if(x)buff(G,x,1,0);}}},'S|new (the Meridian)');
S('green book','plain','',1,'The Order’s natural history: a living thing comes from your deck or discard into your hand.',(G,p)=>{fetch(G,p,c=>c.type==='thing'&&c.kw.includes('living'));},'S|new (the Green Book)',{});
Q('margin','plain','',1,'A note in the margin: +1/+1, and +0/+1 more whenever you play a word of a school other than its own.',{apply(G,t){buff(G,t,1,1);t.kw.margin=1;}},'S|new (the Margin)');
S('folio','plain','',2,'Nothing leaves the Folio: your graveyard is shuffled into your deck, and you draw two words.',(G,p)=>{const P=G.pl[p],a=pile(G,p);while(a.length)P.deck.push(a.pop());E.shuffle(G,P.deck);draw(G,p,2);},'S|new (the Open Folio)',{});

/* =========================== LADDER RUNGS AND TOKENS (never in a deck) =========================== */
const K=(id,sch,sk,st,kw,text,on,o)=>{const d=def(id,Object.assign({name:id,sch,th:'',type:'thing',cost:0,sk,st,kw:kw?kw.split(' '):[],text,on:on||{},tok:true,rar:'—',repl:''},o||{}));return d;};
K('sapling','life',1,4,'plant tree living','The middle stage of a seed. After 2 of your turns it is an oak.',null,{lad:{to:'oak',n:2},layer:'ladder',repl:'keeps sapling'});
K('gold','earth',3,7,'metal heavy named','The top of the metal ladder. Incorruptible: no rival word can send it away. 1 more breath each of your turns.',{turn(G,t){br(G,t.own,1);}},{layer:'ladder',repl:'keeps gold'});
K('ale','water',0,4,'liquid','What the cask became. Each of your turns you gain 2 life and your weakest thing gains +0/+1.',{turn(G,t){life(G,t.own,2);const x=low(mine(G,t.own).filter(y=>y!==t));if(x)buff(G,x,0,1);}},{layer:'ladder',repl:'adapts cordial'});
K('blade','fire',4,4,'metal','What the ingot became.',null,{layer:'ladder',repl:'adapts knife'});
K('ash','fire',0,1,'ash','What fire leaves behind. With an ember it is a phoenix.',null,{layer:'token',repl:'keeps ash'});
K('shade','rot',2,1,'spirit flying','A shade from the barrow. Flies, and lasts 2 turns.',null,{layer:'token',left:2,repl:'adapts wraith'});
K('golem','earth',2,4,'heavy guardian named made','Clay given a name. Guardian, heavy. It keeps every shape the clay was given. Not alive: it cannot be poisoned.',null,{layer:'great',repl:'keeps golem',recipeText:'clay + the action name'});

/* =========================== MADE-ONLY CARDS (fusion) =========================== */
/* value rule from the duel test: stand at least the sturdier input +2, strike at least the harder input +1 */
const M=(id,sch,a,b,kw,text,on,o)=>{const A_=DB[a],B=DB[b];if(!A_||!B)throw new Error('recipe input missing: '+a+' '+b);o=o||{};
  const d=def(id,Object.assign({name:id,sch,th:'',type:'thing',cost:o.fc||2,sk:Math.max(A_.sk,B.sk)+1+(o.dsk||0),st:Math.max(A_.st,B.st)+2+(o.dst||0),kw:kw?kw.split(' '):[],text,on:on||{},made:true,tok:false,rar:o.great?'Great':'Made',repl:o.repl||'',inputs:[a,b],cat:o.cat||null,layer:o.great?'great':'made',mk:{dsk:o.dsk||0,dst:o.dst||0,fsk:o.x&&o.x.sk!=null?o.x.sk:null,fst:o.x&&o.x.st!=null?o.x.st:null}},o.x||{}));
  recipe(a,b,id);return d;};
/* the great recipes */
M('phoenix','fire','ash','ember','bird flying fireborn undying living','Renewal through loss. Flies. Destroyed, it returns to your hand. Whatever it hits catches fire.',{hit(G,t,tg){if(tg)ign(G,tg);}},{great:true,dsk:1,repl:'keeps phoenix (now made only)'});
M('ouroboros','rot','seed','mycelium','beast serpent living undying','Endings feed beginnings. Gains +1/+1 whenever a thing of yours dies. Destroyed, it returns to your hand.',{anyDie(G,t,o){if(o.own===t.own)buff(G,t,1,1);}},{great:true,cat:'brimstone',dsk:2,dst:2,repl:'keeps ouroboros'});
M('world tree','life','oak','bee','plant tree living heavy guardian worldtree','Separate lives, one whole. Harm to any other living thing of yours falls on the World Tree instead. You gain 2 life each of your turns.',{turn(G,t){life(G,t.own,2);}},{great:true,fc:3,dst:3,repl:'keeps world tree'});
M('philosopher’s stone','earth','silver','quicksilver','structure named','Magnificent, and not the goal. Each of your turns every other thing of yours gains +1/+1. It cannot strike.',{turn(G,t){for(const x of mine(G,t.own).slice())if(x!==t)buff(G,x,1,1);}},{great:true,fc:3,x:{sk:0},repl:'keeps philosopher’s stone'});
/* Air */
M('eagle','air','owl','crow','bird living flying seer stoop','Flies. Stoop +2. Nothing opposite stays hidden.',null,{repl:'keeps eagle'});
M('griffin','air','falcon','stag','beast bird living flying heavy','Flies. Heavy: its blows carry through.',null,{repl:'keeps griffin'});
M('thunderbird','air','petrel','thunderhead','bird living flying','Flies. +2 strike while any weather stands. When it hits the rival, they take 2 more.',{atk:(G,t)=>G.wx?2:0,hit(G,t,tg){if(!tg)face(G,opp(t),2,'thunderbird','spell');}},{repl:'keeps thunderbird'});
M('herald','air','pigeon','scribe','bird living flying speaker','Flies. A speaker. When it arrives you draw two words.',{arrive(G,t){draw(G,t.own,2);}},{repl:'keeps herald'});
M('loaf','air','grain','yeast','','Bread. Each of your turns you gain 3 life.',{turn(G,t){life(G,t.own,3);}},{repl:'new'});
M('windpump','air','windmill','sluice','structure','The fen drainers’ mill. Each of your turns you gain 1 breath and the rival takes 2.',{turn(G,t){br(G,t.own,1);face(G,opp(t),2,'windpump','tide');}},{repl:'new',x:{sk:0}});
M('firebird','air','hawk','torch','bird living flying fireborn swift','Flies, swift. Whatever it hits catches fire, and the rival is burned for 1.',{hit(G,t,tg){if(tg)ign(G,tg);face(G,opp(t),1,'firebird','burn');}},{repl:'keeps firebird'});
M('oracle','word','hermit','owl','person living speaker seer hidden','A speaker. Hidden. Each of your turns you draw a word.',{turn(G,t){draw(G,t.own,1);}},{repl:'keeps oracle'});
/* Water */
M('hydra','water','eel','adder','beast serpent living seaborn toxic','Sea-born, toxic. It regains 2 stand each of your turns.',{turn(G,t){mend(G,t,2);}},{repl:'keeps hydra',x:{seep:true}});
M('otterhound','water','otter','hound','beast living seaborn swift guardian','Sea-born, swift, guardian. It seeps.',null,{repl:'new',x:{seep:true}});
M('aqueduct','water','lock','arch','structure guardian','Guardian. Whatever strikes it is held. Each of your turns the rival takes 2.',{blk(G,t,a){a.frz=Math.max(a.frz,1);},turn(G,t){face(G,opp(t),2,'aqueduct','tide');}},{repl:'new',x:{sk:0}});
M('steam','water','ice','ember','flying','Fire and water, by salt. Flies. When it arrives everything opposite is soaked and takes 2.',{arrive(G,t){for(const f of foes(G,t.own).slice()){wet(G,f);hurt(G,f,2,'steam');}}},{cat:'salt',repl:'keeps steam'});
M('bog hag','rot','toad','nightshade','person living toxic','Toxic. Each of your turns the rival takes a dose of poison.',{turn(G,t){psn(G,opp(t),1);}},{repl:'keeps bog hag'});
M('cider','life','apple','cask','liquid','Orchard and brewhouse. Each of your turns you gain 2 life and every thing of yours gains +0/+1.',{turn(G,t){life(G,t.own,2);for(const x of mine(G,t.own))if(x!==t)buff(G,x,0,1);}},{repl:'adapts cordial',x:{sk:0}});
/* Earth */
M('colossus','earth','boulder','granite','stone heavy guardian','Stone stood up and walking. Guardian, heavy.',null,{dst:2,repl:'keeps colossus'});
M('steel','earth','iron','ingot','metal heavy','Iron folded in the fire. Heavy. Guardians take its blows in full.',null,{dsk:1,repl:'keeps steel'});
M('bridge','earth','arch','span','structure guardian span bridge','The bridge, finished. Your things cannot be blocked while it stands.',null,{dst:3,x:{sk:0},repl:'new (Tess Harrow’s bridge)'});
M('tinderbox','earth','flint','tinder','tool','When it arrives, every rival thing catches fire.',{arrive(G,t){for(const f of foes(G,t.own))ign(G,f);}},{repl:'new'});
M('athanor','fire','furnace','crucible','structure fireborn','The alchemists’ furnace. Each of your turns the rival is burned for 2 and your ladder things count a turn closer.',{turn(G,t){face(G,opp(t),2,'athanor','burn');for(const x of mine(G,t.own))if(DB[x.id].lad)x.age++;}},{x:{sk:0},repl:'adapts philosophical egg'});
M('architect','word','surveyor','mason','person living speaker','A speaker. Each of your turns every structure of yours gains +0/+1.',{turn(G,t){for(const x of mine(G,t.own))if(x.kw.structure)buff(G,x,0,1);}},{repl:'keeps architect'});
/* Fire */
M('gunpowder','fire','saltpetre','brimstone','','Keep it from fire, or bring it to fire. When it dies, everything opposite takes 4 and the rival is burned for 4.',{die(G,t){for(const f of foes(G,t.own).slice())hurt(G,f,4,'gunpowder');face(G,opp(t),4,'gunpowder','burn');}},{repl:'keeps gunpowder',x:{sk:0,st:2}});
M('telescope','fire','lens','orrery','structure glass cheapspell seer','See far. Your spells and weather cost 1 less, nothing opposite stays hidden, and each of your turns you draw a word.',{turn(G,t){draw(G,t.own,1);}},{x:{sk:0},repl:'new'});
M('firedrake','fire','cinderling','salamander','beast living flying fireborn','Flies. Whatever it hits catches fire.',{hit(G,t,tg){if(tg)ign(G,tg);}},{repl:'keeps firedrake'});
/* Life */
M('wild hunt','life','wolf','stag','beast living swift','Swift. When it arrives, your other beasts may act again.',{arrive(G,t){for(const x of mine(G,t.own))if(x.kw.beast&&x!==t){x.acted=false;x.fresh=false;}}},{repl:'adapts centaur'});
M('homunculus','word','mandrake','alchemist','person living speaker','A little person grown in a flask. A speaker who counts twice. Your fusions cost 1 less.',null,{great:false,repl:'keeps homunculus (now made only)',x:{kw:['person','living','speaker','speaker2']}});
M('panacea','life','aloe','comfrey','plant herb living','When it arrives you gain 6 life and every state on your side is cleared. Each of your turns you gain 2 life.',{arrive(G,t){life(G,t.own,6);G.pl[t.own].poison=0;for(const x of mine(G,t.own)){x.psn=0;x.burn=0;x.frz=0;x.wet=0;}},turn(G,t){life(G,t.own,2);}},{repl:'keeps panacea'});
M('colony','life','ant','aphid','insect living tiny','Tiny. Each of your turns it gains +1/+1 and an ant marches out.',{turn(G,t){buff(G,t,1,1);const a=put(G,t.own,'ant');if(a)a.tmp=1;}},{repl:'new'});
M('hedge','life','bramble','ivy','plant living structure guardian thorny','A laid hedge. Guardian, thorny. Whatever strikes it cannot act on its next turn.',{blk(G,t,a){a.frz=Math.max(a.frz,1);}},{dst:2,x:{sk:0},repl:'new'});
/* Rot */
M('pestilence','rot','rat','flea','insect beast living tiny toxic','Rat and flea. Each of your turns every living rival thing is poisoned and the rival takes a dose.',{turn(G,t){for(const f of foes(G,t.own))tpsn(G,f,1);psn(G,opp(t),1);}},{repl:'keeps pestilence, plague'});
M('wraith','rot','ghost','shadow','spirit flying hidden','Flies. Hidden. Nothing can block it.',{unbl:()=>true},{repl:'keeps wraith'});
M('lich','rot','barrow','scribe','person spirit speaker undying','A scholar who would not die. A speaker. Destroyed, it returns to your hand.',null,{repl:'keeps lich',x:{sk:3}});
M('paper','rot','rag','pulp','paper cheapspell','Rag and pulp made new. When it arrives you draw two words. Your spells and weather cost 1 less.',{arrive(G,t){draw(G,t.own,2);}},{repl:'new',x:{sk:0}});
M('book','word','pulp','ink','structure paper speaker','Discarded pages, bound. A speaker. Each of your turns you draw a word.',{turn(G,t){draw(G,t.own,1);}},{repl:'adapts grimoire',x:{sk:0}});
M('wight','rot','undertaker','barrow','person spirit','The barrow’s keeper. Whatever it destroys rises on your side as a shade.',{hit(G,t,tg){if(tg&&!G.pl[tg.own].board.includes(tg))put(G,t.own,'shade');}},{repl:'keeps wight'});
/* The Word */
M('sage','word','scribe','bard','person living speaker','Knows every name. A speaker who counts twice. The first word you play each turn costs 1 less.',{turn(G,t){G.pl[t.own].red=Math.max(G.pl[t.own].red,1);}},{repl:'keeps sage',x:{kw:['person','living','speaker','speaker2']}});
M('broadside','word','press','type','structure paper','Printed and posted. Whenever you speak a spell, the rival takes 2.',{play(G,t,c){if(c.type==='spell')face(G,opp(t),2,'broadside','spell');}},{x:{sk:0},repl:'new'});
M('mint','word','ledger','silver','structure metal cheapspell','The publisher’s money. 1 more breath each of your turns, and your spells and weather cost 1 less.',{turn(G,t){br(G,t.own,1);}},{x:{sk:0},repl:'adapts miser'});
/* made cards follow their inputs: call this again whenever card numbers are retuned */
E.remake=function(){for(const id in DB){const d=DB[id];if(!d.made||!d.mk)continue;const A_=DB[d.inputs[0]],B=DB[d.inputs[1]];d.sk=d.mk.fsk!=null?d.mk.fsk:Math.max(A_.sk,B.sk)+1+d.mk.dsk;d.st=d.mk.fst!=null?d.mk.fst:Math.max(A_.st,B.st)+2+d.mk.dst;}};
return {absorb};});
