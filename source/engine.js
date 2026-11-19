"use strict";
const NOUN='noun',VERB='verb',ADJ='adj',CAT='cat',CLIME='clime';
const ORIGIN={X:'Every tongue',OE:'Old English',N:'Norse',F:'French',L:'Latin',G:'Greek',A:'Arabic',H:'Hebrew'};
const W={};
const n_=(w,o,syl,vig,props,gloss,token)=>{W[w]={t:NOUN,o,syl,vig,props:props.split(' '),gloss,token:!!token};};
const v_=(w,o,syl,kind,obj,gloss)=>{W[w]={t:VERB,o,syl,kind,obj,gloss};};
const a_=(w,o,syl,gloss)=>{W[w]={t:ADJ,o,syl:1,gloss};};
const c_=(w,o,syl,match,gloss)=>{W[w]={t:CAT,o,syl,match,gloss};};
const s_=(w,o,syl,gloss)=>{W[w]={t:CLIME,o,syl,gloss};};
/* ---- things: plants ---- */
n_('mandrake','G',2,3,'plant herb living toxic voiced flammable','A root shaped like a man. Its scream harms every mind that hears it.');
n_('wormwood','OE',2,2,'plant herb living flammable','Bitter herb that mends.');
n_('hemlock','OE',2,2,'plant herb living toxic flammable','A poison that passes for parsley.');
n_('mistletoe','OE',3,2,'plant herb living sacred parasite','Sacred parasite. Feeds on trees. No beast will bite it.');
n_('yew','OE',1,5,'plant wood living toxic flammable','Graveyard tree. Every part is poison.');
n_('lichen','G',2,1,'plant living lichen','Grows each turn while there is stone on the board.');
n_('nettle','OE',2,1,'plant herb living sting flammable','Stings whatever it is set against.');
n_('ivy','OE',2,2,'plant living binder','Climbs and binds.');
n_('bramble','OE',2,3,'plant living binder sting thorny flammable','Binds, stings, and hurts whatever eats it.');
n_('nightshade','OE',2,2,'plant herb living toxic','Sweet black berries. Deadly.');
n_('oak','OE',1,7,'plant wood living flammable','Slow, vast and hard to kill. Burns well.');
n_('willow','OE',2,6,'plant wood herb living flammable','Its bark eases pain, so it can mend.');
n_('toadstool','OE',2,1,'plant living toxic','Poison in a pretty cap.');
n_('rue','F',1,2,'plant herb living sacred','The herb of grace. Mends, and no beast will bite it.');
n_('saffron','A',2,2,'plant herb living hoard','Worth more than gold by weight. Pays 1 ink a turn.');
n_('myrrh','G',1,2,'flammable sacred','Holy resin. No spirit can haunt it and no beast will bite it.');
n_('aloe','G',2,2,'plant herb living','Cool sap that mends.');
n_('laurel','L',2,3,'plant herb living sacred','The victor’s leaf. Sacred.');
n_('hellebore','G',3,2,'plant herb living toxic','Winter rose. Once a cure for madness, always a poison.');
n_('cedar','G',2,5,'plant wood living flammable sacred','Temple timber. Sacred.');
/* ---- things: substances ---- */
n_('quicksilver','OE',3,3,'metal liquid toxic','Mercury, the metal that flows.');
n_('fire','OE',1,3,'fireborn bright flame','A living flame. Whatever it hits catches fire, and whatever hits it is burned. Water hurts it.');
n_('saltpetre','L',3,2,'stone flammable explosive','Nitre. Touch it with fire and it bursts.');
n_('vitriol','L',3,3,'liquid corrosive','Acid that eats metal, stone and flesh.');
n_('alkahest','A',3,2,'liquid corrosive universal','The universal solvent. Dissolves anything, then itself.');
n_('lead','OE',1,5,'metal heavy toxic','Dull, heavy, slow poison. Gold in waiting.');
n_('iron','OE',2,6,'metal heavy','Heavy and honest. Rusts.');
n_('copper','L',2,4,'metal bright','Polished, it dazzles.');
n_('silver','OE',2,4,'metal bright sacred','Bright and pure. No spirit can haunt it.');
n_('salt','OE',1,2,'stone ward','A line of salt. No spirit can haunt your side while it stands.');
n_('flint','OE',1,2,'stone sharp spark','Cuts, and strikes sparks: it can burn things without being alight.');
n_('glass','OE',1,2,'brittle sharp','Cuts. Shatters at the first blow.');
n_('amber','A',2,3,'stone flammable preserve','When a living thing of yours would die, amber keeps it: it returns to your hand and the amber is spent.');
n_('realgar','A',3,3,'stone toxic flammable','Ruby of arsenic. Poison that burns.');
n_('cinnabar','G',3,3,'stone toxic cinnabar','Red ore. Roast it and it becomes quicksilver.');
n_('lodestone','OE',2,4,'stone heavy magnet','Each turn it drags one metal across from the other side.');
n_('obsidian','L',4,3,'stone sharp brittle','Volcanic glass. The keenest edge, and it shatters.');
n_('pitch','L',1,2,'liquid flammable binder','Sticky tar. Binds, and whatever it drenches will burn.');
n_('naphtha','G',2,2,'liquid flammable explosive','Rock oil. Bursts at a spark.');
n_('brine','OE',1,2,'liquid salty','Salt water. Kills the plants it drenches.');
n_('dew','OE',1,1,'liquid pure','Purest water. Drenching with it also cures poison.');
n_('elixir','A',3,2,'liquid elixir','Whoever drinks it is restored by 6.');
n_('ink','G',1,1,'liquid hoard','A well of ink. It gives you 1 ink a turn while it stands, to scribe new words with.');
n_('bellows','OE',2,2,'heavy inkwell blower','Leather lungs. Gives you 1 more breath a turn while it stands. It can blow.');
n_('gasp','ON',1,1,'event','A single-use spell: say it alone and it is spent. You catch your breath: 3 more breath this turn.');
n_('quicklime','OE',2,2,'stone quicklime','Burns when wet: soak it and it scalds everything beside it.');
n_('phosphorus','G',3,2,'stone flammable bright pyro','Light-bearer. Catches fire by itself in the open air.');
n_('knife','N',1,2,'metal sharp','Cuts.');
/* ---- things: creatures ---- */
n_('salamander','G',4,3,'beast living fireborn','Lives in flame and carries it to others.');
n_('toad','OE',1,2,'beast living toxic','Poison in its skin.');
n_('leech','OE',1,1,'beast living drain','What it bites out of others, it gives to its keeper.');
n_('owl','OE',1,3,'beast bird living minded voiced keen nocturnal','Sees what is hidden.');
n_('moth','OE',1,1,'beast living flying moth nocturnal','Leaves for the brightest light. Dies in flame.');
n_('crow','OE',1,2,'beast bird living minded voiced carrion','Grows whenever something living dies.');
n_('ouroboros','G',4,3,'beast serpent living eternal','The serpent that eats its tail. Destroyed, it returns to your hand.');
n_('wasp','OE',1,1,'beast living flying sting toxic','Flies, stings, poisons.');
n_('spider','OE',2,1,'beast living toxic binder','Binds its prey, then poisons it.');
n_('adder','OE',2,2,'beast serpent living toxic','Britain’s one venomous snake.');
n_('magpie','F',2,2,'beast bird living minded voiced thief','Steals ink and gold.');
n_('bat','N',1,2,'beast living flying nocturnal','Flies out of reach of anything on the ground.');
n_('stag','OE',1,5,'beast living sharp','Antlers that cut.');
n_('boar','OE',1,5,'beast living heavy','Bites and crushes.');
n_('scarab','L',2,2,'beast living sacred eternal','Sacred beetle. Destroyed, it returns to your hand.');
n_('scorpion','G',3,2,'beast living sting toxic desertborn','A sting with poison behind it.');
n_('phoenix','G',2,4,'beast bird living fireborn eternal bright','Born of fire. Destroyed, it returns to your hand.');
n_('cockatrice','F',3,3,'beast bird living petrifier','Hatched by a toad from a cock’s egg. Its look turns the living to stone.');
n_('locust','L',2,1,'beast living flying','Flies in and eats what grows.');
n_('peacock','OE',2,3,'beast bird living bright voiced','A hundred eyes in its tail. Dazzles.');
n_('pelican','G',3,4,'beast bird living nurse','Feeds its young with its own blood: it can mend others at a cost of 1 to itself.');
n_('egg','N',1,1,'brittle egg','Fragile, and it can do nothing until it hatches. Two turns on it hatches into something you cannot predict, 3 stronger than its kind.');
/* ---- things: people ---- */
n_('homunculus','L',4,2,'living human minded voiced adept','A little person grown in a flask. Knows the art.');
n_('alchemist','A',3,3,'living human minded voiced adept','Turns metal to gold and mends the living.');
n_('scribe','L',1,2,'living human minded voiced scribe','While yours, you hold one more word in hand.');
n_('hermit','G',2,3,'living human minded voiced hermit','Lives sealed away. The other side cannot single it out.');
n_('thief','OE',1,2,'living human minded voiced thief','Steals ink and gold.');
n_('smith','OE',1,4,'living human minded voiced heavy','Swings a hammer: can crush.');
n_('miser','L',2,2,'living human minded voiced hoard','Pays you 1 ink a turn.');
n_('golem','H',2,6,'heavy minded made','Clay given a mind. Not alive, so it cannot be bitten, poisoned or put to sleep.');
n_('apothecary','G',5,3,'living human minded voiced herbalist','Mends again and again without being used up.');
/* ---- things: spirits and ideas ---- */
n_('echo','G',2,1,'event','A single-use spell: say it alone and it is spent. Your next verb this turn happens twice.');
n_('shadow','OE',2,2,'spirit dark','Arrives unseen. Nothing with teeth can hurt it. Light destroys it.');
n_('debt','F',1,2,'concept burden debt','Lands on your rival. Costs them 1 ink a turn, or blood.');
n_('memory','L',3,1,'event','A single-use spell: say it alone and it is spent. Two spent words return to your hand.');
n_('rumour','F',2,2,'concept burden rumour','Lands on your rival. While it stands, their sentences earn no ink.');
n_('hunger','OE',2,2,'concept hunger','While it stands, every beast loses 1 at the start of its keeper’s turn.');
n_('dream','OE',1,2,'event','A single-use spell: say it alone and it is spent. Everything asleep on the other side takes 3, and so does a drowsy rival.');
n_('plague','L',1,3,'concept burden plague','Lands on your rival. Each turn it poisons one more living thing there.');
n_('time','OE',1,3,'concept time','While it stands, the strongest thing on each side loses 1 every turn.');
n_('word','OE',1,1,'spirit minded voiced wordling','Grows by 1 every time you say a sentence that works.');
n_('daemon','G',2,3,'spirit minded voiced','A spirit with a will. Haunts hard.');
n_('omen','L',2,1,'event','A single-use spell: say it alone and it is spent. You read the rival’s hand and draw a word.');
n_('muse','G',1,1,'spirit muse','While she is yours, you hold one more word in hand.');
n_('nemesis','G',3,2,'spirit nemesis','Whenever you lose life, your rival loses 2.');
n_('rune','N',1,1,'concept rune','While it is yours, alliteration is worth twice as much.');
n_('abundance','L',3,1,'event','A single-use spell: say it alone and it is spent. Every living thing on your side gains 3.');
n_('lullaby','OE',3,1,'event','A single-use spell: say it alone and it is spent. Every beast and person on the other side falls asleep.');
n_('reckoning','OE',3,1,'event','A single-use spell: say it alone and it is spent. Everything on either side with vigour 2 or less is destroyed.');
n_('avalanche','F',4,1,'event','A single-use spell: say it alone and it is spent. Everything on the other side that cannot fly loses 2.');
n_('windfall','OE',2,1,'event','A single-use spell: say it alone and it is spent. You gain 3 breath and 1 ink.');
n_('amnesty','G',3,1,'event','A single-use spell: say it alone and it is spent. Every lasting spell on both sides fades at once.');
n_('foundry','F',2,2,'concept foundry','While it stands, everything of yours that is not alive gains 1 at the start of your turn.');
n_('pestilence','L',3,2,'concept burden pestilence','Lands on your rival. While it stands, every living thing there loses 1 at the start of their turn.');
n_('erosion','L',3,2,'concept burden erosion','Lands on your rival. While it stands, everything there that is not alive loses 1 at the start of their turn.');
n_('stammer','OE',2,2,'concept burden stammer','Lands on your rival. While it stands, every word they say costs 1 more breath.');
n_('loan','N',1,2,'event','A single-use spell: say it alone and it is spent. You gain 4 ink now, and a debt settles on your own side.');
n_('philosopher’s stone','X',5,5,'allthings beast plant herb wood living human minded voiced metal stone liquid spirit heavy sharp sting toxic binder corrosive bright adept thief petrifier flammable','It is all things at once, so it can use every verb and every category names it. It is kin to every word and alliterates with every word.');
W['philosopher’s stone'].wild=true;
n_('gold','OE',1,4,'metal bright incorruptible heavy hoard','Made by transmuting. Incorruptible. Pays 1 ink a turn.',true);
n_('ash','OE',1,1,'dust','What fire leaves behind. Feeds the next thing that grows.',true);
/* ---- categories ---- */
c_('beasts','F',1,'beast','Every beast on the board, on both sides.');
c_('worts','OE',1,'plant','Old word for plants. Every plant on the board.');
c_('metals','G',2,'metal','Every metal on the board.');
c_('spirits','L',2,'spirit','Every spirit on the board.');
c_('mortals','L',2,'living','Everything living, including both of you.');
c_('birds','OE',1,'#flying','Everything that flies.');
c_('stones','OE',1,'stone','Every stone on the board.');
c_('liquids','L',2,'liquid','Every liquid on the board.');
c_('sleepers','OE',2,'#asleep','Everything asleep, and anyone drowsy.');
c_('flames','F',1,'#burning','Everything that is on fire.');
/* ---- verbs ---- */
v_('sleep','OE',1,'affect','none','Beasts and people fall asleep and miss a turn. Nothing else can.');
v_('wake','OE',1,'affect','none','Sleepers wake. A thing turned to stone wakes alive again.');
v_('grow','OE',1,'affect','none','Plants gain 2. More if sodden or fed with ash. Not in winter or drought.');
v_('wither','OE',2,'affect','none','Plants lose 3.');
v_('rust','OE',1,'affect','none','Metals lose 2, or 4 if sodden. Gold and quicksilver do not rust.');
v_('burn','OE',1,'both','opt','Alone: a flammable thing catches fire. With an object: something burning, born of fire, or able to spark burns it.');
v_('strike','OE',1,'agent','req','Anything with a body strikes the rival for its vigour, each in its own way: beasts go for the throat, liquids splash, spirits chill.');
v_('bite','OE',1,'agent','req','A beast bites the rival for twice its vigour. A person can bite too, for plain vigour.');
v_('crush','F',1,'agent','req','A heavy thing crushes the rival for twice its vigour; stones and trees crush for plain vigour. A frozen or brittle defender shatters.');
v_('cut','N',1,'agent','req','A sharp thing cuts the rival for twice its vigour, and reaps a plant that defends for three times. Thorns cut for plain vigour. It can also cut your own thing free of bonds.');
v_('sting','OE',1,'agent','req','A sting hits the rival for 1 more than its vigour, and no defender can step in front of it.');
v_('poison','F',2,'agent','req','A toxic thing poisons something living.');
v_('bind','OE',1,'agent','req','Vines, webs, pitch and serpents hold a thing still for a turn. A bound person has 2 less breath.');
v_('drench','OE',1,'agent','req','A liquid soaks its object and puts out fire.');
v_('dissolve','L',2,'agent','req','A corrosive thing destroys its object, or costs a person 3 life.');
v_('haunt','F',1,'agent','req','A spirit drives a thing with a mind back to its keeper’s hand, or costs a person 2 life. A debt, rumour or plague can haunt a person for 1.');
v_('blind','OE',1,'agent','req','A bright or burning thing dazzles a creature so it cannot act for a turn. Ash thrown in the eyes does the same. A blinded person has 2 less breath.');
v_('petrify','L',3,'agent','req','A cockatrice, a serpent or a stone turns a living thing to stone.');
v_('steal','OE',1,'agent','req','A thief takes 2 ink from a person, or carries off gold. A crow takes 1.');
v_('mend','F',1,'agent','req','A herb, dew or elixir (used up) or a healer restores 3; elixir restores 6. A poisonous herb poisons instead.');
v_('transmute','L',2,'agent','req','An adept, a scribe or a pure substance turns a metal into gold and keeps it.');
v_('drink','OE',1,'agent','req','Something living drinks a liquid and takes what follows. Plants drink, and you can too.');
v_('eat','OE',1,'agent','req','A beast or person eats a plant and gains 2. A beast swallows a smaller creature whole. Acid eats metal and stone. You can eat too.');
v_('forget','OE',2,'both','opt','Alone: a person drops a word; a thing with a mind loses its conditions and the verbs it knew. With an object: a mind forgets a spirit or idea out of existence, or strips a thing bare of conditions and verbs.');
v_('scream','N',1,'agent','none','Wakes every sleeper. A mandrake’s scream harms everything with a mind.');
v_('enchant','F',2,'affect','none','Say it with an adjective and a thing: the adjective becomes the thing’s nature for good, at twice its strength. The thing shakes off every ill and may act again at once. A burning owl becomes a fire owl with 6 more vigour, and its blows set things alight.');
v_('gild','OE',1,'affect','none','Turns a thing golden: it gains 4, counts as metal, cannot be corroded, and pays you 1 ink a turn.');
v_('awaken','OE',3,'affect','none','Gives life, a mind and a voice to a thing that had none: it gains 2 and can now forget, scream, sleep and be haunted.');
v_('temper','L',2,'affect','none','Hardens a metal or a blade: it gains 4, can no longer rust or shatter.');
v_('distil','L',2,'affect','none','Concentrates a liquid: it gains 2 and everything it does counts double.');
v_('ripen','OE',2,'affect','none','Brings a plant to fullness: it gains 4 and everything it does counts double.');
v_('lure','F',1,'affect','none','One of the rival’s things with 3 vigour or less, that is not a beast, comes over to your side. Beasts must be tamed instead.');
v_('tame','OE',1,'affect','none','Your own beast gains 2 and stands guard. A rival’s beast of vigour 6 or less comes over to your side.');
v_('crown','F',1,'affect','none','Something living gains 3, and every other thing of its kind on its side gains 1.');
v_('name','OE',1,'affect','none','Gives a thing a name of its own: it gains 1, and no category can reach it any more.');
v_('guard','F',1,'agent','none','Stands in front of you until it does something else. A guard on the ground cannot stop a flier.');
/* ---- adjectives ---- */
a_('burning','OE',2,'Sets alight anything that can burn or is alive. It burns for 2 a turn, and whatever it bites, crushes, cuts or stings catches fire too.');
a_('frozen','OE',2,'Stops a thing acting for a turn. Puts out fire.');
a_('sodden','OE',2,'Soaks a thing. Wet things will not burn, and wet wings will not fly.');
a_('occult','L',1,'Hidden. Your thing lies face down, cannot be singled out, and its attacks cannot be defended against.');
a_('venomous','F',3,'Makes a thing toxic: every attack it makes now poisons.');
a_('volatile','L',3,'Evaporates: back to its owner’s hand when their turn ends.');
a_('fixed','L',1,'Nothing can change its condition again.');
a_('hermetic','G',3,'Sealed. The other side cannot single it out.');
a_('corrosive','L',3,'Gives a thing the bite of acid: its attacks do 2 more, and it can dissolve.');
a_('radiant','L',3,'Shines: reveals the hidden, destroys shadows, and blinds whatever creature it attacks.');
a_('torpid','L',2,'Deep sleep, a turn longer than usual.');
a_('sacred','L',2,'No beast will bite it and no spirit can haunt it.');
a_('brittle','OE',2,'The first blow shatters it.');
a_('leaden','OE',2,'Heavy: it can crush, and it cannot fly.');
a_('winged','N',1,'It flies, out of reach of anything on the ground. Only fliers can defend against it.');
a_('ancient','F',2,'Old and strong: 3 more vigour, so it hits 3 harder.');
a_('vast','L',1,'Twice the vigour, so twice the blow.');
a_('feeble','F',2,'Half the vigour.');
a_('feral','L',2,'Wild as a beast: it can bite, cut and sting. A beast’s bite hits twice as hard.');
a_('thorny','OE',2,'It can sting, and hurts whatever eats it.');
a_('twin','OE',1,'There are two of it.');
a_('eternal','L',3,'Destroyed, it returns to its keeper’s hand.');
a_('quick','OE',1,'It may act twice this turn.');
/* ---- weather and seasons: spoken alone, they change the whole board until another replaces them ---- */
s_('rain','OE',1,'Everything is soaked and fires go out. While it lasts, every plant gains 1 a turn and nothing stays alight.');
s_('spring','OE',1,'Sleepers wake. While it lasts, plants gain 2 a turn, everything else living gains 1, and eggs hatch at once.');
s_('harvest','OE',2,'While it lasts, every plant pays its keeper 1 ink a turn and loses 1.');
s_('winter','OE',2,'While it lasts, plants and liquids lose 1 a turn, wet things freeze, and frost things gain 1.');
s_('drought','OE',1,'While it lasts, liquids and plants lose 1 a turn and flames gain 1.');
s_('desert','L',2,'Nothing stays wet and nothing grows. While it lasts, plants lose 2 a turn and liquids lose 1, but serpents and scorpions gain 1.');
s_('flood','OE',1,'Everything is soaked and fires go out. While it lasts, liquids gain 1 a turn; flames lose 2; herbs, metals and heavy things lose 1.');
s_('storm','OE',1,'While it lasts, lightning strikes one thing on each side every turn for 3. It finds metal first, then whatever stands tallest.');
s_('night','OE',1,'Every new thing arrives unseen. While it lasts, spirits, shadows and night creatures gain 1 a turn; day birds and bright things lose 1.');
s_('noon','L',1,'Nothing stays hidden. While it lasts, bright things, flames and plants gain 1 a turn; spirits, shadows and night creatures lose 1.');
s_('fog','N',1,'While fog lasts, neither side can single out the other’s things. Only categories reach them.');

const STARTER=['toad','crow','leech','lead','wormwood','fire','water','strike','bite','mend','burning','sodden'];
const RIVAL0=['toad','owl','crow','leech','wormwood','hemlock','fire','water','earth','air','fuse','fuse','blow','lead','enchant','strike','strike','bite','crush','sleep','mend','guard','burning','sodden','venomous','ancient','frozen'];
/* ---- the elements, and what is made rather than bought ---- */
n_('water','OE',2,2,'liquid element','An element. Puts out fire and soaks what it meets.');
n_('earth','OE',1,3,'element heavy','An element. Solid ground.');
n_('air','F',1,1,'element flying','An element. Light, and out of reach of the ground.');
n_('void','F',1,1,'element dark concept','An element. Nothing at all, and hard to see.');
n_('steam','OE',1,2,'flying damp','Made of fire and water. Soaks what it hits.',true);
n_('swamp','OE',1,3,'liquid binder','Made of earth and water. Each turn it holds one of the other side’s things fast for a turn. Nothing is caught twice.',true);
n_('lava','L',2,5,'fireborn bright heavy','Made of earth and fire. Molten rock: it burns what it touches.',true);
n_('dust','OE',1,1,'flying','Made of air and earth. It gets in every eye.',true);
n_('energy','G',3,2,'bright inkwell','Made of air and fire. Gives you 1 more breath a turn.',true);
n_('cloud','OE',1,2,'flying damp','Made of air and water. Rain in waiting.',true);
n_('stone','OE',1,5,'stone heavy','Made when lava cools. Hard and patient.',true);
n_('sand','OE',1,1,'stone','Made of stone worn down.',true);
n_('clay','OE',1,2,'stone','Made of dust and water. It wants a shape.',true);
n_('life','OE',1,2,'living','Made of swamp and energy. The first stirring.',true);
n_('seed','OE',1,1,'plant living','Made of life and earth. It wants soil or water.',true);
n_('gunpowder','OE',3,1,'flammable','Made of saltpetre and ash. Keep it from fire, or bring it to fire.',true);
n_('wind','OE',1,2,'wind flying','Moving air. It can blow one of your things across everything opposite.');
v_('blow','OE',1,'agent','req','Wind, air or anything with wings carries one of your things across the other side: everything there, and the rival, is touched by what it is.');
const NATURE={fire:['spreads','Each turn it spreads to something flammable opposite.'],water:['quench','Each turn it puts out one fire on your side.'],lava:['cooling','It cools to stone after two turns.'],steam:['fleeting','It is gone after two turns.'],dust:['fleeting','It settles after two turns.'],
 cloud:['raining','Each turn it rains on one thing opposite.'],void:['devour','Each turn it eats 1 from the strongest thing opposite.'],earth:['soil','Each turn every plant on your side gains 1, up to 9.'],air:['fan wind','Each turn every flame on your side gains 1, up to 8. It can blow.'],
 seed:['sprout','With earth on your side it becomes an oak; with water, a willow.'],swamp:['mire','Each turn it holds fast one thing opposite.'],life:['quicken','Each turn you gain 1 life.']};
for(const w of Object.keys(NATURE)){NATURE[w][0].split(' ').forEach(p=>W[w].props.push(p));W[w].gloss+=' '+NATURE[w][1];}
function turnInto(S,t,w){const was=Cap(nm(S,T(t)));t.w=w;t.title=null;t.forms=[];t.props=W[w].props.slice();t.vig=Math.max(t.vig,W[w].vig);t.age=0;say(S,was+' becomes '+w+'.');}
function nature(S,i,t){
  const pr=t.props,foe=S.things.filter(x=>x.side===1-i),mine=S.things.filter(x=>x.side===i),pick=a=>a.length?a[Math.floor(rnd(S)*a.length)]:null,me=Cap(nm(S,T(t)));
  if(pr.includes('spell')){t.left=(t.left==null?SPELLTURNS:t.left)-1;if(t.left<=0){S.things.splice(S.things.indexOf(t),1);if(!t.token)S.players[t.owner].discard.push(t.card);say(S,me+' fades.');}return;}
  if(t.st.frozen||t.st.stone||t.st.asleep)return;t.age=(t.age||0)+1;
  if(pr.includes('fleeting')&&t.age>2){S.things.splice(S.things.indexOf(t),1);say(S,me+(t.w==='dust'?' settles and is gone.':' drifts away.'));return;}
  if(pr.includes('cooling')&&t.age>2){turnInto(S,t,'stone');return;}
  if(pr.includes('sprout')){const to=mine.some(x=>x.props.includes('soil'))?'oak':mine.some(x=>x!==t&&(x.props.includes('liquid')||x.props.includes('damp')))?'willow':null;if(to){say(S,me+' takes root.');turnInto(S,t,to);return;}}
  if(pr.includes('spreads')&&!t.st.sodden){const x=pick(foe.filter(x=>x.props.includes('flammable')&&!x.st.burning&&!x.st.sodden&&!x.st.frozen&&!x.st.fixed&&visible(x,i)));if(x){say(S,me+' spreads.');heat(S,T(x),1);}}
  if(pr.includes('quench')){const x=pick(mine.filter(x=>x.st.burning));if(x){say(S,me+' runs to the fire.');wet(S,T(x));}}
  if(pr.includes('raining')){const x=pick(foe.filter(x=>!x.st.sodden&&visible(x,i)));if(x){say(S,me+' rains.');wet(S,T(x));}}
  if(pr.includes('devour')){const x=foe.filter(x=>visible(x,i)).sort((a,b)=>b.vig-a.vig)[0];if(x){say(S,me+' eats at '+nm(S,T(x))+'.');damage(S,T(x),1,'void');}}
  if(pr.includes('soil'))for(const x of mine)if(x.props.includes('plant')&&S.things.includes(x)&&x.vig<9){x.vig++;say(S,Cap(nm(S,T(x)))+' feeds on the earth and has '+x.vig+'.');}
  if(pr.includes('fan'))for(const x of mine)if(x!==t&&x.props.includes('fireborn')&&!x.st.sodden&&x.vig<8){x.vig++;say(S,'The air feeds '+nm(S,T(x))+': '+x.vig+'.');}
  if(pr.includes('mire')){const x=pick(foe.filter(x=>!x.st.bound&&!x.mired&&!x.props.includes('flying')&&!ghost(x)&&visible(x,i)));if(x){x.st.bound=dur(S,x.side);say(S,me+' holds '+nm(S,T(x))+' fast.');}}
  if(pr.includes('quicken')){S.players[i].life++;say(S,'Life stirs: '+(i===0?'you gain':'the rival gains')+' 1 life.');}
}
const HATCH=['crow','adder','owl','magpie','bat','scarab','toad'],HATCHR=['salamander','peacock','pelican','cockatrice','phoenix','scorpion'];
/* ---- the hermetic words ---- */
v_('doubt','F',1,'affect','none','Doubt a thing: a spell is unmade, and anything hidden or masked is shown. Doubt a person: everything they have hidden is shown and one spell they keep is unmade.');
v_('sculpt','L',2,'affect','req','Cut one of your own things away to finish another: the subject gains all the vigour and all the nature of the object, which is destroyed.');
v_('measure','L',2,'affect','none','Fixes a thing by number. No adjective changes it again, and it can never gain vigour.');
a_('resonant','L',1,'What harms this thing harms every thing of the same word, on both sides.');
a_('masked','F',1,'The other side cannot single it out, and no light shows it, until it acts.');
s_('flux','L',1,'Nothing lasts. While it lasts, every state on every thing falls away at the start of its keeper\u2019s turn: burning, frozen, soaked, poisoned, bound, blinded, asleep, hidden.');
n_('orrery','L',3,2,'heavy orrery','A model of the heavens. While it stands on your ground, weather the rival spoke does not touch your side.');
n_('tower','F',2,5,'heavy hoard tower','A grain tower. It pays its keeper two ink a turn, and every turn it stands everything on the other side gains 1.');
n_('abyss','G',3,2,'abyss','Ground that holds what falls. The first of your things destroyed each turn climbs back out at the start of your next turn.');
n_('ordeal','F',2,1,'event','A single-use spell: say it alone and it is spent. Your life falls to 1. If you are alive at the start of your next turn it returns to what it was, and 10 more.');
n_('angel','G',2,1,'event','A single-use spell: say it alone and it is spent. The rival\u2019s hand is shown, and their strongest word is forbidden them for their next turn.');
n_('gnosis','G',3,1,'event','A single-use spell: say it alone and it is spent. Draw three words. For the rest of this turn nothing can step in front of what you send.');
n_('attractor','L',3,1,'concept attractor','While it stands, at the start of each of your turns it draws the word you lack: an attack if you hold none, else a thing, else your strongest word.');
n_('unnamed','OE',1,1,'blank','A thing with no word. Name it, and it becomes the strongest thing standing opposite for the rest of the duel.');
n_('scintilla','L',2,1,'bright catalyst','A spark. While it is yours, your reactions need no condition: no furnace, no thaw, no wet, dark or dry.');
n_('shepherdess','OE',3,3,'living human minded voiced seer','She sees. While she stands nothing on either side stays hidden or masked, and your beasts cannot be tamed away.');
W.peacock.gloss+=' While it stands on your side, opposites count three times, not twice.';
const GROUNDW=['fire','water','earth','air','void','wind','steam','swamp','lava','dust','energy','cloud','life','orrery','tower','abyss'],MAXGROUND=4;for(const w of GROUNDW)W[w].props.push('ground');
const SPELLW=['rune','nemesis','muse','time','hunger','debt','rumour','plague','ink','foundry','pestilence','erosion','stammer','attractor'],MAXSPELL=3,SPELLTURNS=4;for(const w of SPELLW){W[w].props.push('spell');W[w].gloss+=' A spell: it stands for '+SPELLTURNS+' of its keeper\u2019s turns, cannot be attacked, and does not fight.';}
const isG=t=>t.props.includes('ground')||t.props.includes('spell');let CURV=null;const takes=(t,v)=>!isG(t)&&!(v==='bite'&&(!(t.props.includes('living')||t.props.includes('brittle'))||t.props.includes('sacred')));
v_('fuse','L',1,'join','req','Fuses two things so that they react and become a third: fuse fire and water to make steam.');
W.fuse.conj=true;
const RX={},rx=(a,b,r,fx,need)=>{RX[[a,b].sort().join('+')]={a,b,r,fx,need};};
const NEED={
 furnace:['with a fire burning on your side',(S,who,ex)=>S.things.some(t=>t.side===who&&!ex.includes(t)&&(t.props.includes('fireborn')||t.st.burning)),'That needs a furnace: a fire burning on your side.'],
 thaw:['outside winter',(S)=>!clime(S,'winter'),'Nothing quickens in winter.'],
 wet:['outside drought and desert',(S)=>!clime(S,'drought')&&!clime(S,'desert'),'Nothing takes root in dry ground.'],
 dry:['while the powder is dry',(S,who,ex)=>!clime(S,'rain')&&!clime(S,'flood')&&!ex.some(t=>t.st.sodden),'The powder is damp. It will not catch.'],
 dark:['away from noon',(S)=>!clime(S,'noon'),'Not under the noon sun.']};
rx('fire','water','steam','scald');rx('earth','water','swamp');rx('earth','fire','lava');rx('air','earth','dust','blind');rx('air','fire','energy');rx('air','water','cloud');
rx('lava','water','obsidian');rx('air','lava','stone');rx('air','stone','sand');rx('stone','water','sand');rx('fire','sand','glass');rx('fire','stone','iron');rx('lead','lava','silver');
rx('dust','water','clay');rx('clay','life','golem',null,'furnace');rx('energy','swamp','life','heal','thaw');rx('life','stone','egg',null,'thaw');rx('earth','life','seed',null,'wet');rx('earth','seed','oak',null,'wet');rx('seed','water','willow');
rx('life','swamp','toad');rx('egg','fire','phoenix');rx('air','egg','crow');rx('earth','egg','adder');rx('egg','swamp','salamander');rx('crow','fire','phoenix');rx('fire','owl','phoenix');
rx('lead','water','quicksilver');rx('energy','quicksilver','philosopher’s stone',null,'furnace');rx('lead','philosopher’s stone','gold');rx('energy','iron','lodestone');rx('salt','water','brine');
rx('ash','saltpetre','gunpowder');rx('fire','gunpowder',null,'blast','dry');rx('life','void','shadow',null,'dark');rx('energy','void','daemon',null,'dark');rx('cloud','water','rain');rx('cloud','energy','storm');rx('cloud','void','night');rx('cloud','earth','fog');
rx('air','energy','wind');rx('wind','fire',null,'firestorm');rx('ash','water','ink');rx('fire','ink',null,'inkburst');rx('steam','iron','rust');
const rxOf=(a,b)=>RX[[a,b].sort().join('+')]||null;
function rxWord(S,who,r){if(!r)return null;if(r.k==='card'){const w=S.players[who].hand[r.i];return W[w]&&W[w].t===NOUN&&!W[w].props.includes('event')?w:null;}if(r.k==='thing'){const t=findThing(S,r.id);return t?t.w:null;}return null;}
function react(S,who,sen,c){
  const p=S.players[who],take=r=>{if(r.k==='card'){const w=p.hand[r.i];return{w,vig:W[w].vig+2*upOf(S,who,w),card:r.i,forms:[],extra:[]};}const t=findThing(S,r.id);return{w:t.w,vig:t.vig,t,forms:(t.forms||[]).slice(),extra:t.props.filter(q=>!W[t.w].props.includes(q))};};
  const A=take(sen.subj),B=take(sen.obj),x=rxOf(A.w,B.w);
  [A,B].filter(q=>q.card!=null).sort((m,n)=>n.card-m.card).forEach(q=>{p.hand.splice(q.card,1);p.discard.push(q.w);});
  for(const q of [A,B])if(q.t){const i=S.things.indexOf(q.t);if(i>=0){S.things.splice(i,1);dropVerbs(S,q.t);if(!q.t.token)S.players[q.t.owner].discard.push(q.t.card);}}
  S.found=S.found||[];const key=[A.w,B.w].sort().join('+');if(who===0)S.found.push(key);c.effect=true;S.atk=false;if(!S.rxDone[who][key]){S.rxDone[who][key]=1;say(S,'A new reaction. Every blow '+(who===0?'you strike':'the rival strikes')+' at the person now lands '+insight(S,who)+' harder.');}
  if([['fire','water'],['air','earth'],['energy','void'],['life','void']].some(q=>q.includes(A.w)&&q.includes(B.w)&&A.w!==B.w)){p.ink+=2;say(S,'Opposites meet in the vessel. '+(who===0?'You gain':'The rival gains')+' 2 breath.');}
  const foe=()=>S.things.filter(t=>t.side===1-who).slice();
  if(x.r&&W[x.r].t===CLIME){say(S,Cap(A.w)+' and '+B.w+' become '+x.r+'.');if(S.clime&&!S.clime.made)S.players[S.clime.owner].discard.push(S.clime.w);S.clime={w:x.r,owner:who,made:true};say(S,Cap(x.r)+' settles over the board.');climeArrive(S);return;}
  if(x.r==='rust'){say(S,'Steam and iron: rust takes every metal on the other side.');for(const t of foe())if(t.props.includes('metal')&&!t.props.includes('incorruptible'))damage(S,T(t),3,'rust');return;}
  if(x.r){const t=addThing(S,x.r,who,who,true);t.vig=Math.max(t.vig,A.vig+B.vig);t.made=true;t.forms=t.forms||[];
    const keep=['toxic','corrosive','bright','sacred','flying','thorny','eternal','frost','damp','lull','stealth','swift','potent','incorruptible','hoard','sting','sharp','metal','named'];
    for(const q of [A,B]){for(const f of q.forms)if(!t.forms.includes(f))t.forms.push(f);for(const x2 of q.extra)if(keep.includes(x2))addProp(t,x2);}
    if(t.forms.length)t.title=t.forms.join(' ')+' '+t.w;
    say(S,Cap(A.w)+' and '+B.w+' become '+nm(S,T(t)).replace(/^(your|the rival’s) /,'')+', with '+t.vig+' vigour'+(t.forms.length?'. It keeps what they were':'')+'.');}
  if(x.fx==='scald'){say(S,'The steam scalds everything opposite.');for(const t of foe()){damage(S,T(t),1,'scald');}}
  else if(x.fx==='blind'){say(S,'Dust flies in every eye opposite.');for(const t of foe())if(S.things.includes(t)&&t.props.includes('living')){t.st.blind=2;say(S,Cap(nm(S,T(t)))+' is blinded.');}}
  else if(x.fx==='heal'){p.life+=3;say(S,(who===0?'You gain':'The rival gains')+' 3 life.');}
  else if(x.fx==='blast'){say(S,'Fire and gunpowder: everything opposite is caught in the blast.');for(const t of foe())damage(S,T(t),4,'fire');damage(S,P(1-who),4,'blast');}
  else if(x.fx==='firestorm'){say(S,'Wind and fire: a firestorm crosses the board.');for(const t of foe())if(S.things.includes(t))heat(S,T(t),1);damage(S,P(1-who),2,'fire');}
  else if(x.fx==='inkburst'){p.ink+=3;say(S,'The breath boils off as vapour. '+(who===0?'You gain':'The rival gains')+' 3 breath.');}
}
const BASE=['mandrake','wormwood','hemlock','mistletoe','yew','lichen','quicksilver','fire','saltpetre','vitriol','alkahest','lead','salamander','toad','leech','owl','moth','crow','homunculus','alchemist','ouroboros','echo','shadow','debt','memory','beasts','worts','metals','spirits','mortals','sleep','grow','wither','burn','strike','bite','crush','poison','drench','mend','transmute','dissolve','forget','scream','guard','enchant','gild','tame','blow','wind','void','water','earth','air','fuse','rain','spring','burning','frozen','sodden','occult','venomous','volatile','fixed','hermetic','corrosive','radiant','torpid','ancient','vast','feeble','winged','quick','winter','night'];
const ALLWORDS=Object.keys(W).filter(w=>!W[w].token);
const PPROPS=['living','human','minded','mortal','flesh','voiced'];
const ATTACKV=['strike','bite','crush','cut','sting'], CURSE=2;
const MAXFIELD=6, INK=6, LIFE=60, SHOP=5, INSIGHT=2, RUIN=4;
const OPP=[['hot','cold'],['hot','wet'],['hidden','bright'],['swift','slow'],['vast','feeble'],['old','new'],['holy','foul'],['living','dead'],['fixed','volatile'],['heavy','winged']];
const ADJTAG={burning:'hot',frozen:'cold',sodden:'wet',occult:'hidden',masked:'hidden',radiant:'bright',quick:'swift',torpid:'slow',vast:'vast',feeble:'feeble',ancient:'old',sacred:'holy',venomous:'foul',corrosive:'foul',fixed:'fixed',volatile:'volatile',leaden:'heavy',winged:'winged'};
const VERBTAG={burn:'hot',drench:'wet',sleep:'slow',poison:'foul',haunt:'dead',petrify:'fixed',measure:'fixed'};
const OPPNAME={hot:'fire',cold:'frost',wet:'water',hidden:'the hidden',bright:'the bright',swift:'the quick',slow:'the slow',vast:'the vast',feeble:'the feeble',old:'the old',new:'the new',holy:'the sacred',foul:'the foul',living:'the living',dead:'the dead',fixed:'the fixed',volatile:'the fleeting',heavy:'the heavy',winged:'the winged'};
function tagsOf(props,st,w,forms){const h=p=>props.includes(p),o=[];st=st||{};forms=forms||[];
  if(st.burning||h('fireborn')||h('flame')||h('pyro')||w==='fire'||w==='lava')o.push('hot');if(st.frozen||h('frost'))o.push('cold');if(st.sodden||h('liquid')||h('damp'))o.push('wet');
  if(st.occult||st.masked||h('dark')||h('stealth'))o.push('hidden');if(h('bright'))o.push('bright');if(h('swift')||st.quick)o.push('swift');if(st.asleep||h('lull'))o.push('slow');
  if(forms.includes('titan'))o.push('vast');if(forms.includes('elder'))o.push('old');if(h('egg')||h('sprout'))o.push('new');if(h('sacred'))o.push('holy');if(h('toxic')||h('corrosive')||st.poisoned)o.push('foul');
  if(h('spirit')||w==='ash')o.push('dead');else if(h('living'))o.push('living');if(st.fixed)o.push('fixed');if(st.volatile)o.push('volatile');if(h('heavy'))o.push('heavy');if(h('flying')||h('bird'))o.push('winged');return o;}
function oppOf(src){for(const [a,b] of OPP)for(const A of src)for(const B of src){if(A===B||!(A.played||B.played))continue;if(A.tags.includes(a)&&B.tags.includes(b))return[a,b];}return null;}
function brave(S,who){const p=S.players[who];return p.life>0&&p.life<=10&&!p.braved;}
function settleS(S){const seer=S.things.some(t=>t.props.includes('seer'));for(const t of S.things){if(t.st.measured){if(t.mv==null||t.vig<t.mv)t.mv=t.vig;else t.vig=t.mv;}if(seer&&(t.st.occult||t.st.masked)){t.st.occult=0;t.st.masked=0;}}}
function weatherAdj(S,list){const A=S.clime&&S.clime.adjs;if(!A||!A.length)return 0;const q=S.quiet;let n=0;S.quiet=true;for(const a of A)for(const t of list){if(!S.things.includes(t)||isG(t)||t.st.fixed)continue;try{if(ADJF[a](S,t.side,T(t),{mult:1,ingr:[]}))n++;}catch(e){}}S.quiet=q;return n;}
const insight=(S,who)=>INSIGHT*Object.keys((S.rxDone||[{},{}])[who]).length;

function rnd(S){S.seed=(S.seed+0x6D2B79F5)|0;let t=Math.imul(S.seed^(S.seed>>>15),1|S.seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;}
function shuffle(S,a){for(let i=a.length-1;i>0;i--){const j=Math.floor(rnd(S)*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const T=t=>({k:'t',t}), P=i=>({k:'p',i});
function has(e,p){return e.k==='p'?PPROPS.includes(p):e.t.props.includes(p);}
function alive(S,e){return e.k==='p'||S.things.includes(e.t);}
function Cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function nm(S,e){if(e.k==='p')return e.i===0?'you':'the rival';const t=e.t;if(t.st.occult&&t.side===1)return 'something unseen';return(t.side===0?'your ':'the rival’s ')+(t.title||t.w);}
function vb(e,pl,sg){return(e.k==='p'&&e.i===0)?pl:sg;}
function say(S,x,k){if(!S.quiet)S.log.push({k:k||'e',x});}
function side(S,i){return S.things.filter(t=>t.side===i);}
function dur(S,sd){return S.active===sd?2:1;}
function full(S,sd,w){const pr=w&&W[w]?W[w].props:[];if(pr.includes('spell'))return S.things.filter(t=>t.side===sd&&t.props.includes('spell')).length>=MAXSPELL;const g=pr.includes('ground');return g?S.things.filter(t=>t.side===sd&&t.props.includes('ground')).length>=MAXGROUND:S.things.filter(t=>t.side===sd&&t.w!=='ash'&&!isG(t)).length>=MAXFIELD;}
function inert(t){return !!(t.st.asleep||t.st.frozen||t.st.bound||t.st.blind||t.st.stone);}
function flies(t){return(t.props.includes('bird')||t.props.includes('flying'))&&!t.st.sodden&&!t.st.grounded&&!inert(t);}
function ghost(t){return(t.props.includes('spirit')||t.props.includes('concept'))&&!t.props.includes('allthings');}
function clime(S,w){return !!(S.clime&&S.clime.w===w);}
function handSize(S,i){return((S.cfg&&S.cfg.hand)||6)+S.things.filter(t=>t.side===i&&(t.props.includes('scribe')||t.props.includes('muse'))).length;}

const WORDPLAY=false; /* kin and alliteration multipliers: parked for a later redesign */
function newGame(seed,o){
  o=o||{};
  const S={seed:seed|0,turn:0,active:0,players:[],things:[],clime:null,nextId:1,log:[],over:null,phase:'play',quiet:false,
    cfg:{ink:o.ink||INK,hand:o.hand||6,maxVerbs:o.maxVerbs||2},up:[o.up||{},{}]};
  S.rxDone=[{},{}];const decks=[o.deck||STARTER,o.rivalDeck||STARTER],life=[LIFE+(o.life||0),LIFE+(o.rivalLife==null?9:o.rivalLife)];
  for(let i=0;i<2;i++)S.players.push({life:life[i],coins:0,ink:0,deck:shuffle(S,decks[i].slice()),hand:[],discard:[],asleep:0,rested:0,poisoned:0,sodden:0,dazed:0,earned:0,echoed:false});
  S.shop=[];S.supply=shuffle(S,(o.market||ALLWORDS).filter(w=>W[w]&&!W[w].token));refillShop(S);
  draw(S,1);startTurn(S,0);opening(S,0);opening(S,1);S.players[0].ink=Math.ceil(S.cfg.ink/2);S.players[1].coins=1;say(S,'You go first, so you begin with '+S.players[0].ink+' breath. Your opponent begins with 1 ink.');
  return S;
}
function opening(S,i){const p=S.players[i],isA=w=>ATTACKV.includes(w),isN=w=>W[w].t===NOUN&&!W[w].props.includes('concept');
  for(const want of [isA,isN]){if(p.hand.some(want))continue;const k=p.deck.findIndex(want);if(k<0)continue;
    let j=-1;for(let x=p.hand.length-1;x>=0;x--){const w=p.hand[x];if((isA(w)&&p.hand.filter(isA).length===1)||(isN(w)&&p.hand.filter(isN).length===1))continue;j=x;break;}
    if(j<0)continue;const out=p.hand[j];p.hand[j]=p.deck[k];p.deck[k]=out;}}
function upOf(S,who,w){return(S.up&&S.up[who]&&S.up[who][w])||0;}
function costOf(S,who,w){return cost0(S,who,w)+(S&&S.things&&S.things.some(t=>t.side===who&&t.props.includes('stammer'))?1:0);}
function cost0(S,who,w){const d=W[w],lv=upOf(S,who,w);if(!lv)return d.syl;
  if(d.t===NOUN)return lv>=2?Math.max(1,d.syl-1):d.syl;if(d.t===VERB)return Math.max(0,d.syl-1);if(d.t===ADJ)return 0;return Math.max(0,d.syl-1);}
/* ---- the shop outside the match: how rare each word is ---- */
const TIER4=['philosopher’s stone','phoenix','nemesis','alkahest','cockatrice','crown'];
const TIER3=['resonant','orrery','ordeal','sculpt','measure','angel','abyss','gnosis','attractor','shepherdess','flux','reckoning','avalanche','pestilence','lullaby','abundance','golem','oak','iron','boar','stag','lodestone','amber','elixir','apothecary','daemon','omen','muse','rune','time','plague','twin','vast','quick','eternal','storm','petrify','scribe','ouroboros','salamander','homunculus','alchemist','transmute','mandrake'];
function tierOf(w){return TIER4.includes(w)?4:TIER3.includes(w)?3:(BASE.includes(w)||STARTER.includes(w)||RIVAL0.includes(w))?1:2;}
function goldPrice(w){return[0,20,35,60,120][tierOf(w)];}
function refillShop(S){const isV=w=>W[w]&&W[w].t===VERB;while(S.shop.length<SHOP&&S.supply.length){const need=SHOPVERBS-S.shop.filter(isV).length,left=SHOP-S.shop.length;let k=0;if(need>=left){k=S.supply.findIndex(isV);if(k<0)k=0;}S.shop.push(S.supply.splice(k,1)[0]);}}
const SHOPVERBS=2;
function price(w){const d=W[w];return d.syl+1+(d.vig>=5?1:0)+(d.vig>=8?1:0);}
function draw(S,i){const p=S.players[i],n=handSize(S,i);while(p.hand.length<n){if(!p.deck.length){if(!p.discard.length)break;p.deck=shuffle(S,p.discard);p.discard=[];}p.hand.push(p.deck.pop());}}
function addThing(S,w,sd,owner,token,card){
  const t={id:S.nextId++,w,card:card||w,side:sd,owner,token:!!token,vig:W[w].vig,props:W[w].props.slice(),st:{},verbs:[],acted:false};
  if(!token)t.vig+=2*upOf(S,owner,w);
  S.things.push(t);
  if(!clime(S,'noon')){if(t.props.includes('dark'))t.st.occult=1;if(clime(S,'night')&&!t.props.includes('bright')&&!token)t.st.occult=1;}
  if(t.props.includes('hermit'))t.st.hermetic=1;
  return t;
}
function become(S,t,w){if(!t.token)S.players[t.owner].discard.push(t.card);t.w=w;t.token=true;t.props=W[w].props.slice();t.vig=W[w].vig;t.st={};t.forms=[];t.title=null;}
function dropVerbs(S,t){if(t.verbs)t.verbs=[];}
function checkOver(S){if(S.over!=null)return;const a=S.players[0].life<=0,b=S.players[1].life<=0;if(a&&b)S.over=2;else if(a)S.over=1;else if(b)S.over=0;if(S.over!=null)S.phase='over';}

const CAUSE={reckoning:'is weighed and found wanting',avalanche:'is buried',blight:'rots away',erosion:'wears away to nothing',fire:'burns away',acid:'is dissolved',bite:'is killed',poison:'succumbs to poison',wither:'withers to nothing',used:'is used up',forgot:'is forgotten and ceases to be',light:'cannot survive the light',blast:'is blown apart',quench:'is put out for good',fumes:'chokes',flame:'flies into the flame',scream:'dies of the scream',drained:'is drained dry',gone:'evaporates',crush:'is crushed',shatter:'shatters',rust:'rusts away',drunk:'is drunk to the last drop',eaten:'is eaten',slake:'slakes and crumbles',time:'crumbles with age',hunger:'starves',dream:'dies in its sleep',sting:'is stung to death',cut:'is cut down',spent:'is spent',fight:'falls in the fight',weather:'does not survive the weather',lightning:'is struck dead',attack:'is destroyed',scald:'is scalded to nothing'};
function destroy(S,t,cause){
  const ruined=!S.atk&&S.things.includes(t)&&!t.token&&t.w!=='ash'&&cause!=='spent'&&cause!=='forgot'&&cause!=='eaten'?t.side:null;
  const i=S.things.indexOf(t);if(i<0)return;
  const label=Cap(nm(S,T(t)));S.things.splice(i,1);dropVerbs(S,t);
  const living=t.props.includes('living');
  const amber=living&&!t.token&&cause!=='forgot'&&cause!=='eaten'?S.things.find(x=>x.side===t.side&&x.props.includes('preserve')):null;
  const body=!t.token&&!isG(t)&&cause!=='forgot'&&cause!=='eaten'&&cause!=='spent',pl=S.players[t.side];if(body)pl.dross=Math.min(6,(pl.dross||0)+1);
  if(body&&!pl.fell&&S.things.some(x=>x.side===t.side&&x.props.includes('abyss'))){pl.fell=t.card;say(S,label+' '+(CAUSE[cause]||'is destroyed')+', and falls into the abyss.');}
  else if(t.props.includes('eternal')&&!t.token&&cause!=='forgot'){S.players[t.owner].hand.push(t.card);say(S,label+' is destroyed, and returns to hand.');}
  else if(amber){S.players[t.owner].hand.push(t.card);say(S,label+' '+(CAUSE[cause]||'is destroyed')+', but the amber keeps it. It returns to hand.');destroy(S,amber,'spent');}
  else{if(!t.token)S.players[t.owner].discard.push(t.card);say(S,label+' '+(CAUSE[cause]||'is destroyed')+'.');}
  if(cause==='fire'&&t.props.includes('flammable')&&!S.things.some(x=>x.w==='ash'&&x.side===t.side)){addThing(S,'ash',t.side,t.side,true);say(S,'Ash is left behind.');}
  if(living)for(const c of S.things)if(c.props.includes('carrion')){c.vig++;say(S,Cap(nm(S,T(c)))+' feeds on the death and grows to '+c.vig+'.');}
  if(ruined!=null&&!S.inRuin){S.inRuin=true;say(S,'Its ruin is felt.');damage(S,P(ruined),RUIN,'ruin');S.inRuin=false;}
}
function damage(S,e,n,cause){
  if(n<=0||!alive(S,e))return;
  {const c=S.cx,direct=c&&!S.inRuin&&!S.nem&&S.atk;let b=0,nv=0,ex=0;if(e.k==='p'&&S.atk&&S.atkWho===1-e.i&&!S.inIns){if(!S.insDone){b=insight(S,S.atkWho);if(b)S.insDone=true;}if(!S.novDone&&c&&c.nov&&!S.inRuin&&!S.nem){nv=c.nov;S.novDone=true;}if(c&&c.ex&&!S.exDone&&!S.inRuin&&!S.nem){ex=c.ex;S.exDone=true;}}const pre=direct&&c.pre?c.pre:null;if(c)c.pre=null;
   if(direct&&(b||nv||ex||c.mult>1||pre)){const m=c.mult,base=n%m===0?n/m:null;let s=pre?pre+(m>1?' × '+m+' ('+((c.why&&c.why.join(', '))||'multiplied')+')':''):base!=null&&m>1?base+' × '+m+' ('+((c.why&&c.why.join(', '))||'multiplied')+')':String(n);if(b)s+=' + '+b+' ('+(S.atkWho===0?'your':'the rival’s')+' '+(b/INSIGHT===1?'discovery':b/INSIGHT+' discoveries')+')';if(nv)s+=nv>0?' + '+nv+' (said for the first time)':' \u2212 '+(-nv)+' (said before)';if(ex)s+=' + '+ex+' (an exalted verb)';say(S,'The sum: '+s+' = '+Math.max(1,n+b+nv+ex)+'.','q');}
   n=Math.max(1,n+b+nv+ex);}
  if(e.k==='p'){S.players[e.i].life-=n;say(S,Cap(nm(S,e))+' '+vb(e,'lose','loses')+' '+n+' life.');
    if(!S.nem){const k=S.things.filter(t=>t.side===e.i&&t.props.includes('nemesis')).length;if(k){S.nem=true;say(S,'Nemesis answers.');damage(S,P(1-e.i),2*k,'nemesis');S.nem=false;}}
    return;}
  if(e.t.props.includes('resonant')&&!S.inRes){S.inRes=true;for(const x of S.things.filter(x=>x!==e.t&&x.w===e.t.w)){say(S,'The same note sounds in '+nm(S,T(x))+'.');damage(S,T(x),n,cause);}S.inRes=false;if(!alive(S,e))return;}
  const t=e.t;t.vig-=n;t.st.asleep=0;
  if(t.vig<=0){say(S,Cap(nm(S,e))+' takes '+n+' harm, more than it can bear.');destroy(S,t,cause);}else say(S,Cap(nm(S,e))+' takes '+n+' harm and has '+t.vig+' left.');
}
function hit(S,o,n,cause){if(o.k==='t'&&o.t.props.includes('brittle')){say(S,Cap(nm(S,o))+' is brittle.');destroy(S,o.t,'shatter');return;}damage(S,o,n,cause);}
function heat(S,e,m){
  if(!alive(S,e))return false;const x=clime(S,'drought')?1:0;
  if(e.k==='p'){const p=S.players[e.i];if(p.sodden){p.sodden=0;say(S,Cap(nm(S,e))+' '+vb(e,'are','is')+' soaked through, so the fire only dries '+vb(e,'you','them')+'.');return true;}
    say(S,Cap(nm(S,e))+' '+vb(e,'are','is')+' burned.');damage(S,e,2*m+x,'fire');return true;}
  const t=e.t,n=Cap(nm(S,e));
  if(t.st.fixed){say(S,n+' is fixed and does not change.');return false;}
  if(t.st.bound){t.st.bound=0;say(S,'The bonds on '+nm(S,e)+' burn away.');}
  if(t.props.includes('fireborn')){say(S,n+' is at home in flame.');return false;}
  if(t.props.includes('damp')){say(S,n+' is too wet through to burn.');return false;}
  if(t.st.frozen){t.st.frozen=0;t.st.sodden=1;say(S,n+' thaws and is left sodden.');return true;}
  if(t.st.sodden){t.st.sodden=0;say(S,n+' steams dry.');return true;}
  if(t.props.includes('cinnabar')){say(S,'Roasted, '+nm(S,e)+' gives up its quicksilver.');become(S,t,'quicksilver');return true;}
  if(ghost(t)){say(S,'Fire passes straight through '+nm(S,e)+'.');return false;}
  if(t.props.includes('flammable')||t.props.includes('living')){
    if(t.st.burning){say(S,n+' is already burning.');return false;}
    if(t.props.includes('explosive')){say(S,n+' bursts.');const sd=t.side;destroy(S,t,'blast');for(const o of side(S,sd))damage(S,T(o),4*m,'blast');damage(S,P(sd),4*m,'blast');return true;}
    t.st.burning=1;t.st.occult=0;say(S,n+' catches fire.');return true;}
  if(t.props.includes('liquid')){say(S,n+' boils.');damage(S,e,1*m,'fire');return true;}
  say(S,n+' glows and is unharmed.');return false;
}
function wet(S,e){
  if(!alive(S,e))return false;
  if(e.k==='p'){S.players[e.i].sodden=1;say(S,Cap(nm(S,e))+' '+vb(e,'are','is')+' soaked.');return true;}
  const t=e.t,n=Cap(nm(S,e));
  if(t.st.fixed){say(S,n+' is fixed and does not change.');return false;}
  if(t.st.frozen){say(S,n+' is already ice.');return false;}
  if(t.props.includes('quicklime')){say(S,n+' meets water and burns.');const sd=t.side;destroy(S,t,'slake');for(const o of side(S,sd))damage(S,T(o),2,'scald');return true;}
  if(t.st.burning){t.st.burning=0;say(S,n+' is put out.');}
  if(t.props.includes('fireborn')){say(S,n+' hisses in the wet.');damage(S,e,2,'quench');if(!alive(S,e))return true;}
  if(ghost(t)){say(S,'Water falls through '+nm(S,e)+'.');return false;}
  if(clime(S,'drought')||clime(S,'desert')){say(S,'The dry air takes the water at once.');return true;}
  t.st.sodden=1;say(S,n+' is sodden.');
  if(clime(S,'winter')){say(S,'In winter, the wet turns to ice.');cold(S,e);}
  return true;
}
function cold(S,e){
  if(!alive(S,e))return false;
  if(e.k==='p'){say(S,Cap(nm(S,e))+' '+vb(e,'shiver','shivers')+', nothing more.');return false;}
  const t=e.t,n=Cap(nm(S,e));
  if(t.st.fixed){say(S,n+' is fixed and does not change.');return false;}
  if(ghost(t)){say(S,'Cold means nothing to '+nm(S,e)+'.');return false;}
  if(t.props.includes('frost')){say(S,n+' is at home in the cold.');return false;}
  t.st.burning=0;
  if(t.props.includes('fireborn')){say(S,n+' cannot bear the cold.');damage(S,e,3,'quench');if(!alive(S,e))return true;}
  t.st.frozen=dur(S,t.side)+(t.st.sodden?1:0);t.st.sodden=0;t.st.guarding=0;say(S,n+' freezes.');return true;
}
function sleep(S,e,extra){
  if(!alive(S,e))return false;
  if(e.k==='p'){const p=S.players[e.i];if(p.rested||p.asleep){say(S,Cap(nm(S,e))+' '+vb(e,'have','has')+' only just slept.');return false;}p.asleep=1;say(S,Cap(nm(S,e))+' '+vb(e,'grow','grows')+' drowsy and will have half breath next turn.');return true;}
  const t=e.t,n=Cap(nm(S,e));
  if(t.st.fixed){say(S,n+' is fixed and does not change.');return false;}
  if(!(t.props.includes('beast')||t.props.includes('human'))){say(S,n+(t.props.includes('plant')?' does not sleep.':' cannot sleep. It was never awake.'));return false;}
  if(t.st.rested||t.st.asleep){say(S,n+' has only just slept.');return false;}
  t.st.asleep=dur(S,t.side)+(extra||0);t.st.guarding=0;say(S,n+' falls asleep.');return true;
}
function poison(S,e,m){
  if(!alive(S,e))return false;
  if(e.k==='p'){S.players[e.i].poisoned+=2*m;say(S,Cap(nm(S,e))+' '+vb(e,'are','is')+' poisoned.');return true;}
  const t=e.t,n=Cap(nm(S,e));
  if(t.st.fixed){say(S,n+' is fixed and does not change.');return false;}
  if(!t.props.includes('living')){say(S,n+' has no blood to poison.');return false;}
  if(t.st.poisoned){say(S,n+' is already poisoned.');return false;}
  t.st.poisoned=1;say(S,n+' is poisoned.');return true;
}
function reveal(S,sd){let any=false;for(const t of side(S,sd))if(t.st.occult){t.st.occult=0;any=true;say(S,Cap(nm(S,T(t)))+' is revealed.');}return any;}
function shine(S){reveal(S,0);reveal(S,1);for(const d of S.things.slice())if(d.props.includes('dark'))destroy(S,d,'light');}
function climeDv(S,t){const c=S.clime&&S.clime.w,h=p=>t.props.includes(p);if(!c)return 0;
  switch(c){
    case 'rain':return(h('plant')?1:0)-(h('fireborn')?1:0);
    case 'spring':return h('plant')?2:h('living')?1:0;
    case 'harvest':return h('plant')?-1:0;
    case 'winter':return(h('plant')?-1:0)+(h('liquid')?-1:0)+(h('frost')?1:0);
    case 'drought':return(h('liquid')?-1:0)+(h('plant')?-1:0)+(h('fireborn')?1:0);
    case 'desert':return(h('plant')?-2:0)+(h('liquid')?-1:0)+(h('serpent')||h('desertborn')?1:0);
    case 'flood':return(h('liquid')?1:0)-(h('fireborn')?2:0)-(h('herb')&&!h('liquid')?1:0)-((h('heavy')||h('metal'))&&!h('liquid')&&!h('fireborn')?1:0);
    case 'night':return(h('spirit')||h('nocturnal')||h('dark'))?1:(h('bird')||h('bright'))?-1:0;
    case 'noon':return(h('spirit')||h('nocturnal')||h('dark'))?-1:(h('bright')||h('fireborn')||h('plant'))?1:0;
  }return 0;}
const CLIMELINE={rain:'The rain goes on.',spring:'Spring quickens everything living.',harvest:'The harvest is gathered.',winter:'Winter bites.',drought:'The drought goes on.',desert:'The desert takes its share.',flood:'The flood rises.',night:'Night feeds what belongs to it.',noon:'Noon burns the spirits thin.'};
function climeArrive(S){const c=S.clime.w;
  if(c==='rain'||c==='flood'){for(const t of S.things.slice())wet(S,T(t));S.players[0].sodden=1;S.players[1].sodden=1;}
  if(c==='winter')for(const t of S.things.slice())if(t.st.sodden&&!t.st.frozen){say(S,'Winter takes hold.');cold(S,T(t));}
  if(c==='noon')shine(S);
  if(c==='drought'||c==='desert'||c==='noon')for(const t of S.things)t.st.sodden=0;
  if(c==='spring'){for(const t of S.things)if(t.st.asleep){t.st.asleep=0;say(S,Cap(nm(S,T(t)))+' wakes.');}for(const p of S.players)p.asleep=0;}
}
function climeTick(S,i){const c=S.clime&&S.clime.w;if(!c||c==='fog')return;const mine=side(S,i);
  if(S.clime.owner!==i&&mine.some(t=>t.props.includes('orrery'))){say(S,'The orrery turns '+c+' aside from '+(i===0?'your':'the rival\u2019s')+' side.');return;}
  if(c==='flux'){let n=0;for(const t of mine)for(const k of ['burning','frozen','sodden','poisoned','bound','blind','asleep','occult','masked'])if(t.st[k]){t.st[k]=0;n++;}const p=S.players[i];if(p.poisoned||p.asleep||p.sodden){p.poisoned=0;p.asleep=0;p.sodden=0;n++;}if(n)say(S,'All flows. Every state on '+(i===0?'your':'the rival\u2019s')+' side falls away.');return;}let said=false;const note=()=>{if(!said){say(S,CLIMELINE[c]);said=true;}};
  if(c==='storm'){say(S,'The storm breaks overhead.');const tg=mine.find(t=>t.props.includes('metal'))||mine.filter(t=>!ghost(t)).sort((a,b)=>b.vig-a.vig)[0];
    if(tg){say(S,'Lightning strikes '+nm(S,T(tg))+'.');damage(S,T(tg),5,'lightning');}else{say(S,'Lightning finds '+nm(S,P(i))+'.');damage(S,P(i),4,'lightning');}return;}
  for(const t of mine){if(!S.things.includes(t))continue;
    if(c==='rain'||c==='flood'){if(t.st.burning){t.st.burning=0;note();say(S,Cap(nm(S,T(t)))+' is put out.');}if(t.props.includes('quicklime')){wet(S,T(t));continue;}if(!ghost(t)&&!t.st.fixed&&!t.st.frozen)t.st.sodden=1;}
    if(c==='drought'||c==='desert'||c==='noon')t.st.sodden=0;
    if(c==='winter'){if(t.st.sodden&&!t.st.frozen){note();cold(S,T(t));}if((t.props.includes('serpent')||t.w==='toad')&&!t.st.asleep&&!t.st.rested&&!t.st.fixed){note();sleep(S,T(t),0);}}
    if(c==='spring'){if(t.st.asleep){t.st.asleep=0;note();say(S,Cap(nm(S,T(t)))+' wakes.');}if(t.props.includes('egg'))t.st.age=2;}
    if(c==='harvest'&&t.props.includes('plant')){note();S.players[i].coins++;}
    const dv=climeDv(S,t);if(dv>0){note();t.vig+=dv;say(S,Cap(nm(S,T(t)))+' gains '+dv+' and has '+t.vig+'.');}else if(dv<0){note();damage(S,T(t),-dv,'weather');}}
  if(c==='rain'||c==='flood')S.players[i].sodden=1;
}
const EVENT={
 gasp(S,who,c){S.players[who].ink+=3;say(S,(who===0?'You catch':'The rival catches')+' breath: 3 more this turn.');c.effect=true;},
 ordeal(S,who,c){const p=S.players[who];if(p.ordeal){say(S,'The ordeal is already upon '+nm(S,P(who))+'.');return;}p.ordeal=p.life;p.life=1;say(S,(who===0?'You take':'The rival takes')+' the ordeal. Life falls to 1.');c.effect=true;},
 angel(S,who,c){const o=S.players[1-who];if(who===0)say(S,'The angel shows the rival\u2019s hand: '+(o.hand.join(', ')||'nothing')+'.');else say(S,'An angel looks over your hand.');
   const pick=o.hand.filter(w=>ATTACKV.includes(w))[0]||o.hand.slice().sort((a,b)=>tierOf(b)-tierOf(a)||W[b].syl-W[a].syl)[0];if(pick){o.ban=pick;say(S,'It forbids '+(who===0?'the rival':'you')+' the word \u201c'+pick+'\u201d for a turn.');}c.effect=true;},
 gnosis(S,who,c){const p=S.players[who];for(let k=0;k<3;k++){if(!p.deck.length){if(!p.discard.length)break;p.deck=shuffle(S,p.discard);p.discard=[];}p.hand.push(p.deck.pop());}p.gnosis=1;say(S,(who===0?'You see':'The rival sees')+' it directly. Three words come to hand, and nothing can step in front of '+(who===0?'you':'them')+' this turn.');c.effect=true;},
 abundance(S,who,c){const l=side(S,who).filter(t=>t.props.includes('living')&&!isG(t));if(!l.length){say(S,'Nothing of '+(who===0?'yours':'the rival’s')+' is alive to flourish.');return;}say(S,'Abundance. Every living thing '+(who===0?'of yours':'of the rival’s')+' gains 3.');for(const t of l)t.vig+=3;c.effect=true;},
 lullaby(S,who,c){let n=0;for(const t of side(S,1-who))if((t.props.includes('beast')||t.props.includes('human'))&&!t.st.fixed&&!t.st.asleep&&!isG(t)){t.st.asleep=dur(S,t.side);t.st.guarding=0;n++;}if(n){say(S,'A lullaby. '+n+(n===1?' thing':' things')+' on '+(who===0?'the rival’s':'your')+' side fall'+(n===1?'s':'')+' asleep.');c.effect=true;}else say(S,'Nothing over there can be sung to sleep.');},
 reckoning(S,who,c){const l=S.things.filter(t=>!isG(t)&&t.vig<=2);if(!l.length){say(S,'The reckoning finds nothing small enough.');return;}say(S,'The reckoning. Everything of vigour 2 or less is weighed and found wanting.');for(const t of l)if(S.things.includes(t))destroy(S,t,'reckoning');c.effect=true;},
 avalanche(S,who,c){const l=side(S,1-who).filter(t=>!isG(t)&&!t.props.includes('flying')&&!t.props.includes('bird')&&!ghost(t));if(!l.length){say(S,'The avalanche finds nothing on the ground.');return;}say(S,'An avalanche comes down on '+(who===0?'the rival’s':'your')+' side.');for(const t of l)if(S.things.includes(t))damage(S,T(t),2,'avalanche');c.effect=true;},
 windfall(S,who,c){const p=S.players[who];p.ink+=3;p.coins+=1;say(S,(who===0?'You find':'The rival finds')+' a windfall: 3 breath and 1 ink.');c.effect=true;},
 amnesty(S,who,c){const l=S.things.filter(t=>t.props.includes('spell'));if(!l.length){say(S,'There are no spells standing to forgive.');return;}for(const t of l){S.things.splice(S.things.indexOf(t),1);if(!t.token)S.players[t.owner].discard.push(t.card);}say(S,'Amnesty. '+l.length+(l.length===1?' spell fades.':' spells fade.'));c.effect=true;},
 loan(S,who,c){const p=S.players[who];p.coins+=4;say(S,(who===0?'You take':'The rival takes')+' a loan of 4 ink.');if(!full(S,who)){addThing(S,'debt',who,who,true);say(S,'A debt settles on '+nm(S,P(who))+'.');}else{say(S,'With no room for the debt, it is paid in blood.');damage(S,P(who),2,'debt');}c.effect=true;},
 memory(S,who,c){const p=S.players[who];let n=0;while(n<2&&p.discard.length){const k=Math.floor(rnd(S)*p.discard.length),w=p.discard.splice(k,1)[0];p.hand.push(w);n++;say(S,who===0?'You remember '+w+'.':'The rival remembers a word.');}if(n)c.effect=true;else say(S,'There is nothing yet to remember.');},
 omen(S,who,c){const o=S.players[1-who];if(who===0)say(S,'The omen shows the rival’s hand: '+(o.hand.join(', ')||'nothing')+'.');else say(S,'The rival reads an omen of your hand.');const p=S.players[who];if(!p.deck.length&&p.discard.length){p.deck=shuffle(S,p.discard);p.discard=[];}if(p.deck.length)p.hand.push(p.deck.pop());c.effect=true;},
 echo(S,who,c){S.players[who].echoNext=true;say(S,'The air waits to repeat '+(who===0?'your':'the rival’s')+' next verb.');c.effect=true;},
 dream(S,who,c){let any=false;for(const t of side(S,1-who))if(t.st.asleep){any=true;say(S,'The dream finds '+nm(S,T(t))+'.');t.vig-=3;if(t.vig<=0)destroy(S,t,'dream');}
   if(S.players[1-who].asleep){any=true;say(S,'The dream finds '+nm(S,P(1-who))+'.');damage(S,P(1-who),3,'dream');}if(any)c.effect=true;else say(S,'Nobody on the other side is asleep to dream.');}
};
const addProp=(t,p)=>{if(t.props.includes(p))return false;t.props.push(p);return true;};

const FORM={
 resonant:{n:'echoing',v:2,add:['resonant']},
 masked:{n:'masked',v:1,add:[],set:['masked']},
 burning:{n:'fire',v:3,add:['fireborn','bright'],clr:['burning']},
 frozen:{n:'frost',v:3,add:['frost'],clr:['frozen']},
 sodden:{n:'rain',v:2,add:['damp'],clr:['sodden','burning']},
 venomous:{n:'venom',v:3,add:['toxic']},
 radiant:{n:'sun',v:3,add:['bright'],shine:true},
 occult:{n:'shade',v:2,add:['stealth'],clr:['occult']},
 winged:{n:'sky',v:2,add:['flying']},
 ancient:{n:'elder',v:5,add:[]},
 vast:{n:'titan',v:0,dbl:true,add:[]},
 corrosive:{n:'acid',v:2,add:['corrosive']},
 sacred:{n:'holy',v:3,add:['sacred']},
 thorny:{n:'thorn',v:2,add:['sting','thorny']},
 feral:{n:'wild',v:2,add:['beast','sharp','sting']},
 leaden:{n:'iron',v:4,add:['heavy','metal']},
 quick:{n:'swift',v:1,add:['swift']},
 eternal:{n:'undying',v:1,add:['eternal']},
 brittle:{n:'glass',v:3,add:['sharp','brittle']},
 torpid:{n:'dream',v:2,add:['lull'],clr:['asleep']},
 hermetic:{n:'sealed',v:2,add:[],set:['hermetic']},
 fixed:{n:'fixed',v:2,add:[],set:['fixed']}
};
function evolve(S,t,form,v){t.forms=t.forms||[];if(t.forms.includes(form))return false;const was=Cap(nm(S,T(t)));t.forms.push(form);t.title=t.forms.join(' ')+' '+t.w;t.vig+=v||0;say(S,was+' becomes '+nm(S,T(t)).replace(/^(your|the rival’s) (.)/,(m,a,b)=>('aeiou'.includes(b)?'an ':'a ')+b)+', with '+t.vig+' vigour.');return true;}
const EVOLVE=['enchant','gild','awaken','temper','distil','ripen','tame','crown','name','lure','doubt','sculpt','measure'];
const ADJF={
 resonant:(S,who,e)=>{if(e.k==='p'||!addProp(e.t,'resonant'))return false;say(S,Cap(nm(S,e))+' is made resonant: what harms it harms its like.');return true;},
 masked:(S,who,e)=>{if(e.k==='p')return false;if(e.t.side!==who){say(S,'Only its keeper can mask '+nm(S,e)+'.');return false;}if(e.t.st.masked)return false;e.t.st.masked=1;say(S,Cap(nm(S,e))+' goes masked.');return true;},
 burning:(S,who,e,c)=>heat(S,e,c.mult),
 frozen:(S,who,e)=>cold(S,e),
 sodden:(S,who,e)=>wet(S,e),
 torpid:(S,who,e)=>sleep(S,e,1),
 occult:(S,who,e)=>{if(e.k==='p'){say(S,'A person cannot be hidden.');return false;}if(e.t.side!==who){say(S,'Only its keeper can hide '+nm(S,e)+'.');return false;}if(clime(S,'noon')){say(S,'Nothing hides at noon.');return false;}if(e.t.st.burning||e.t.props.includes('bright')){say(S,Cap(nm(S,e))+' is too bright to hide.');return false;}e.t.st.occult=1;say(S,who===0?'Your '+e.t.w+' slips out of sight.':'Something slips out of sight.');return true;},
 venomous:(S,who,e)=>{if(!addProp(e.t,'toxic')){say(S,Cap(nm(S,e))+' is poisonous already.');return false;}say(S,Cap(nm(S,e))+' turns venomous.');return true;},
 corrosive:(S,who,e)=>{if(!addProp(e.t,'corrosive'))return false;say(S,Cap(nm(S,e))+' turns corrosive.');return true;},
 volatile:(S,who,e)=>{e.t.st.volatile=1;say(S,Cap(nm(S,e))+' turns volatile and will not last the turn.');return true;},
 fixed:(S,who,e)=>{e.t.st.fixed=1;say(S,Cap(nm(S,e))+' is fixed. Its condition will not change again.');return true;},
 hermetic:(S,who,e)=>{e.t.st.hermetic=1;say(S,Cap(nm(S,e))+' is sealed.');return true;},
 radiant:(S,who,e)=>{addProp(e.t,'bright');e.t.st.occult=0;say(S,Cap(nm(S,e))+' shines.');shine(S);return true;},
 sacred:(S,who,e)=>{if(!addProp(e.t,'sacred'))return false;say(S,Cap(nm(S,e))+' is made sacred.');return true;},
 brittle:(S,who,e)=>{if(!addProp(e.t,'brittle'))return false;say(S,Cap(nm(S,e))+' turns brittle.');return true;},
 leaden:(S,who,e)=>{addProp(e.t,'heavy');e.t.st.grounded=1;say(S,Cap(nm(S,e))+' grows heavy as lead.');return true;},
 winged:(S,who,e)=>{if(!addProp(e.t,'flying')){say(S,Cap(nm(S,e))+' flies already.');return false;}e.t.st.grounded=0;say(S,Cap(nm(S,e))+' takes wing.');return true;},
 ancient:(S,who,e)=>{e.t.vig+=3;say(S,Cap(nm(S,e))+' is ancient, and has '+e.t.vig+' vigour.');return true;},
 vast:(S,who,e)=>{if(e.t.vasted){say(S,Cap(nm(S,e))+' is already as vast as a word can make it.');return false;}e.t.vasted=1;e.t.vig*=2;say(S,Cap(nm(S,e))+' is vast, and has '+e.t.vig+' vigour.');return true;},
 feeble:(S,who,e)=>{if(e.t.vig<=1)return false;e.t.vig=Math.max(1,Math.floor(e.t.vig/2));say(S,Cap(nm(S,e))+' grows feeble, down to '+e.t.vig+'.');return true;},
 feral:(S,who,e)=>{const a=addProp(e.t,'beast'),b=addProp(e.t,'sharp'),d=addProp(e.t,'sting');if(!a&&!b&&!d){say(S,Cap(nm(S,e))+' is wild enough already.');return false;}say(S,Cap(nm(S,e))+' turns feral. It can bite, cut and sting.');return true;},
 thorny:(S,who,e)=>{addProp(e.t,'thorny');if(!addProp(e.t,'sting'))return false;say(S,Cap(nm(S,e))+' grows thorns.');return true;},
 eternal:(S,who,e)=>{if(e.t.token){say(S,Cap(nm(S,e))+' was made in play and has no word to return to.');return false;}if(!addProp(e.t,'eternal'))return false;say(S,Cap(nm(S,e))+' is made eternal.');return true;},
 quick:(S,who,e)=>{e.t.acted=false;e.t.st.quick=1;say(S,Cap(nm(S,e))+' is quick, and may act again.');return true;},
 twin:(S,who,e)=>{const t=e.t;if(full(S,t.side)){say(S,'There is no room for a twin.');return false;}const c=addThing(S,t.w,t.side,t.owner,true);c.props=t.props.slice();c.vig=t.vig;c.st.occult=t.st.occult;say(S,'Now there are two.');return true;}
};

function canStop(t,a){if(a&&a.k==='t'&&(a.t.st.occult||a.t.props.includes('stealth')))return false;return takes(t,CURV)&&!inert(t)&&(!(a&&a.k==='t'&&flies(a.t))||flies(t));}
function guardOf(S,e,a){if(e.k==='p'&&(S.braveNow||S.players[1-e.i].gnosis))return e;if(e.k==='p'){const g=S.things.find(t=>t.side===e.i&&t.st.guarding&&canStop(t,a));if(g){say(S,Cap(nm(S,T(g)))+' stands in the way.');return T(g);}}return e;}
function blockOf(S,o,c,a){
  if(o.k!=='p')return o;if(S.braveNow||S.players[1-o.i].gnosis)return o;if(a&&a.k==='t'&&a.t.props.includes('stealth'))return o;
  const g=S.things.find(t=>t.side===o.i&&t.st.guarding&&canStop(t,a));if(g){say(S,Cap(nm(S,T(g)))+' stands in the way.');return T(g);}
  if(c.def!=null){const t=findThing(S,c.def);if(t&&t.side===o.i&&canStop(t,a)){if(!c.told){say(S,Cap(nm(S,T(t)))+' steps in to defend.');c.told=true;}return T(t);}}
  return o;
}
function hitBack(S,a,o,o0){if(o!==o0&&o.k==='t'&&a.k==='t'&&alive(S,a)&&alive(S,o)&&!inert(o.t)&&!bodiless(o)){say(S,Cap(nm(S,o))+' hits back.');damage(S,a,o.t.vig,'fight');}}
function strikeWord(t){const h=p=>t.props.includes(p);return h('allthings')?'strikes':h('spirit')?'chills':h('liquid')?'splashes over':h('beast')?'goes for':h('human')?'strikes':h('plant')?'lashes at':h('heavy')?'slams into':'strikes';}
function agents(S,who,subs,need,why){
  const out=[],one=subs.length===1;
  for(const e of subs){if(!alive(S,e))continue;if(e.k==='t'&&e.t.props.includes('egg')){if(one)say(S,'An egg can do nothing until it hatches.');continue;}
    if(e.k==='t'){const t=e.t,st=t.st.asleep?'asleep':t.st.frozen?'frozen':t.st.bound?'bound fast':t.st.blind?'blinded':t.st.stone?'stone':'';if(st){if(one)say(S,Cap(nm(S,e))+' is '+st+'.');continue;}if(t.side===who&&t.acted&&!one)continue;}
    if(!need(e)){if(one)say(S,Cap(nm(S,e))+' '+why);continue;}
    out.push(e);}
  return out;
}
function didAct(S,who,e,keep){if(e.k==='t'){if(e.t.side===who){if(e.t.st.quick)e.t.st.quick=0;else e.t.acted=true;}e.t.st.occult=0;e.t.st.masked=0;if(!keep)e.t.st.guarding=0;}}
function canBeHot(e){return e.k==='t'&&(CAN.hot(p=>e.t.props.includes(p))||e.t.st.burning);}
function bodiless(o){return o.k==='t'&&ghost(o.t);}
function reach(S,a,o,o0){if(o0&&o!==o0)return true;if(o.k==='t'&&flies(o.t)&&!(a.k==='t'&&flies(a.t))){say(S,Cap(nm(S,o))+' is out of reach in the air.');return false;}return true;}
function touch(S,a,o,c){if(a.k!=='t')return;const ah=alive(S,a)&&(a.t.st.burning||a.t.props.includes('fireborn')),oh=o.k==='t'&&alive(S,o)&&(o.t.st.burning||o.t.props.includes('fireborn'));
  if(ah&&alive(S,o)&&!oh){say(S,'The fire goes with it.');if(heat(S,o,1))c.effect=true;}
  else if(oh&&alive(S,a)&&!a.t.st.burning&&!a.t.props.includes('fireborn')){say(S,'It was on fire.');heat(S,a,1);}
  if(!alive(S,a))return;const ap=a.t.props;
  if(ap.includes('frost')&&alive(S,o)){if(o.k==='p'){S.players[o.i].dazed+=1;say(S,'The frost numbs '+nm(S,o)+': 1 less breath next turn.');}else{say(S,'Frost goes with it.');cold(S,o);}}
  if(ap.includes('damp')&&alive(S,o)){say(S,'It soaks what it hits.');wet(S,o);}
  if(ap.includes('lull')&&alive(S,o)){say(S,'It brings sleep with it.');sleep(S,o,0);}
  if(ap.includes('toxic')&&alive(S,o)&&has(o,'living')&&!(o.k==='t'&&o.t.st.poisoned)){say(S,'It carries poison.');if(poison(S,o,1))c.effect=true;}
  if(ap.includes('corrosive')&&alive(S,o)){say(S,'The acid bites.');damage(S,o,2,'acid');}
  if(ap.includes('bright')&&o.k==='t'&&alive(S,o)&&!o.t.st.blind&&!o.t.st.fixed&&(o.t.props.includes('beast')||o.t.props.includes('human'))){o.t.st.blind=dur(S,o.t.side);o.t.st.guarding=0;say(S,Cap(nm(S,o))+' is dazzled and blinded.');}}
function warded(S,sd){return S.things.some(t=>t.side===sd&&t.props.includes('ward'));}

const VERBF={
 doubt(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;
   if(e.k==='p'){let any=false;for(const t of side(S,e.i))if(t.st.occult||t.st.masked){t.st.occult=0;t.st.masked=0;any=true;say(S,Cap(nm(S,T(t)))+' is shown for what it is.');}
     const sp=S.things.find(t=>t.owner===e.i&&t.props.includes('spell'));if(sp){say(S,Cap(nm(S,T(sp)))+' does not survive being doubted.');destroy(S,sp,'spent');any=true;}
     if(any)c.effect=true;else say(S,'There is nothing there to doubt.');continue;}
   const t=e.t;if(t.props.includes('spell')){say(S,Cap(nm(S,e))+' does not survive being doubted.');destroy(S,t,'spent');c.effect=true;continue;}
   if(t.st.occult||t.st.masked){t.st.occult=0;t.st.masked=0;say(S,Cap(nm(S,e))+' is shown for what it is.');c.effect=true;}else if(subs.length===1)say(S,'Doubt finds nothing false in '+nm(S,e)+'.');}},
 sculpt(S,who,subs,objs,c){const o=objs[0];for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'||!o||o.k!=='t'){say(S,'Sculpt needs a thing to finish and a thing to cut away.');continue;}
   const t=e.t,x=o.t;if(t===x){say(S,'A thing cannot be cut from itself.');continue;}if(t.side!==who||x.side!==who){say(S,'You can only sculpt with your own things.');continue;}if(isG(t)||isG(x)){say(S,'Ground and spells cannot be sculpted.');continue;}
   const v=x.vig;for(const q of x.props)if(!['ground','spell','event','egg','burden','blank','token'].includes(q))addProp(t,q);say(S,Cap(nm(S,o))+' is cut away.');destroy(S,x,'spent');t.vig+=v*c.mult;say(S,Cap(nm(S,e))+' takes all that it was, and has '+t.vig+' vigour.');c.effect=true;break;}},
 measure(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'){say(S,'A person will not be measured.');continue;}const t=e.t;if(isG(t)){if(subs.length===1)say(S,Cap(nm(S,e))+' has no number to fix.');continue;}
   if(t.st.measured){if(subs.length===1)say(S,Cap(nm(S,e))+' is measured already.');continue;}t.st.measured=1;t.st.fixed=1;t.mv=t.vig;say(S,Cap(nm(S,e))+' is measured at '+t.vig+'. It will never be more.');c.effect=true;}},
 blow(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&canT('blow',e.t),'has neither wind nor wings, and cannot blow.');
  for(const a of ag){didAct(S,who,a);for(const o of objs){
    if(!alive(S,o)||o.k!=='t'||o.t===a.t){say(S,'The wind needs a thing to carry.');continue;}
    if(o.t.props.includes('heavy')&&!o.t.props.includes('fireborn')){say(S,Cap(nm(S,o))+' is too heavy for the wind.');continue;}
    const op=o.t.props,rides=o.t.st.burning||['fireborn','toxic','corrosive','bright','frost','damp','lull','liquid'].some(p=>op.includes(p))||o.t.w==='dust';
    if(!rides){say(S,'The wind carries '+nm(S,o)+' across and nothing comes of it.');continue;}
    say(S,Cap(nm(S,a))+' blows '+nm(S,o)+' across everything opposite.');c.effect=true;
    const tg=S.things.filter(t=>t.side===1-who).map(T).concat([P(1-who)]);
    for(const x of tg){if(!alive(S,x)||!alive(S,o))continue;
      if(op.includes('liquid')&&!op.includes('damp'))wet(S,x);
      if(o.t.w==='dust'&&x.k==='t'&&x.t.props.includes('living')){x.t.st.blind=2;say(S,Cap(nm(S,x))+' is blinded.');}
      touch(S,o,x,c);}}}},
 enchant(S,who,subs,objs,c){
  for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'){say(S,'A person cannot be enchanted. Enchant a thing.');continue;}
   const t=e.t;let keys=(c.ingr||[]).slice();
   if(!keys.length){if(t.st.burning)keys.push('burning');else if(t.st.frozen)keys.push('frozen');else if(t.st.sodden)keys.push('sodden');else if(t.st.occult)keys.push('occult');else if(t.st.asleep)keys.push('torpid');}
   if(!keys.length){say(S,'Enchant needs an adjective to work with. Say it with one, or enchant a thing that is already burning, frozen, sodden, hidden or asleep.');continue;}
   for(const k of keys){const f=FORM[k];if(!f){say(S,'Nothing lasting can be made of '+k+'.');continue;}
    if(t.st.measured){say(S,Cap(nm(S,e))+' is measured and will not change.');continue;}
    if((t.forms||[]).includes(f.n)){say(S,Cap(nm(S,e))+' is that already.');continue;}
    for(const s of f.clr||[])t.st[s]=0;for(const s of f.set||[])t.st[s]=1;for(const p of f.add)addProp(t,p);
    if(f.n==='iron')t.st.grounded=1;if(f.n==='swift')t.st.quick=1;
    const il=2*upOf(S,who,k);if(evolve(S,t,f.n,(f.dbl?t.vig:f.v*2+il)*c.mult)){if(il)say(S,'The illuminated word gives '+il+' more.');c.effect=true;const ills=['poisoned','frozen','bound','blind','asleep','sodden'].filter(s=>t.st[s]&&!(f.set||[]).includes(s));if(t.st.burning&&f.n!=='fire'){t.st.burning=0;ills.push('burning');}for(const s of ills)t.st[s]=0;if(ills.length)say(S,'The enchantment burns off every ill upon it.');if(t.side===who&&t.acted){t.acted=false;say(S,Cap(nm(S,e))+' is made new, and may act again.');}}if(f.shine)shine(S);}}},
 gild(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'||ghost(e.t)){say(S,'Gold will not hold to '+nm(S,e)+'.');continue;}
   const t=e.t;if(!evolve(S,t,'golden',(4)*c.mult)){say(S,Cap(nm(S,e))+' is golden already.');continue;}['metal','bright','incorruptible','hoard'].forEach(p=>addProp(t,p));t.st.occult=0;c.effect=true;}},
 awaken(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'||e.t.props.includes('minded')){say(S,Cap(nm(S,e))+' '+vb(e,'are','is')+' awake already.');continue;}
   const t=e.t;if(!evolve(S,t,'waking',(2)*c.mult))continue;['living','minded','voiced'].forEach(p=>addProp(t,p));c.effect=true;}},
 temper(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'||!(e.t.props.includes('metal')||e.t.props.includes('sharp'))){if(subs.length===1)say(S,'Only metal and blades can be tempered.');continue;}
   const t=e.t;if(!evolve(S,t,'tempered',(4)*c.mult)){say(S,Cap(nm(S,e))+' is tempered already.');continue;}t.props=t.props.filter(p=>p!=='brittle');addProp(t,'incorruptible');c.effect=true;}},
 distil(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'||!e.t.props.includes('liquid')){if(subs.length===1)say(S,'Only a liquid can be distilled.');continue;}
   if(!evolve(S,e.t,'distilled',(2)*c.mult)){say(S,Cap(nm(S,e))+' is distilled already.');continue;}addProp(e.t,'potent');c.effect=true;}},
 ripen(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'||!e.t.props.includes('plant')){if(subs.length===1)say(S,'Only a plant can ripen.');continue;}
   if(!evolve(S,e.t,'ripe',(4)*c.mult)){say(S,Cap(nm(S,e))+' is ripe already.');continue;}addProp(e.t,'potent');c.effect=true;}},
 lure(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'){say(S,'A person cannot be lured away.');continue;}const t=e.t;
   if(t.side===who){if(subs.length===1)say(S,Cap(nm(S,e))+' is on your side already.');continue;}if(t.props.includes('ground')||t.props.includes('spell')){say(S,Cap(nm(S,e))+' cannot be moved.');continue;}
   if(t.props.includes('beast')){say(S,'A beast will not be lured. It must be tamed.');continue;}if(t.vig>3){say(S,Cap(nm(S,e))+' is too strong to lure.');continue;}if(full(S,who,t.w)){say(S,'There is no room for it on that side.');continue;}
   say(S,Cap(nm(S,e))+' is lured away and changes sides.');t.side=who;t.st.guarding=0;t.acted=true;c.effect=true;}},
 tame(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'||!e.t.props.includes('beast')){if(subs.length===1)say(S,'Only a beast can be tamed.');continue;}
   const t=e.t;if(t.side!==who){if(S.things.some(x=>x.side===t.side&&x.props.includes('seer'))){say(S,'The shepherdess keeps her flock.');continue;}if(t.vig>6){say(S,Cap(nm(S,e))+' is too strong to tame.');continue;}if(full(S,who)){say(S,'There is no room for it on that side.');continue;}
     say(S,Cap(nm(S,e))+' is tamed and changes sides.');t.side=who;t.st.guarding=0;t.acted=true;(t.forms=t.forms||[]).includes('tame')||t.forms.push('tame');t.title=t.forms.join(' ')+' '+t.w;c.effect=true;continue;}
   if(!evolve(S,t,'tame',(2)*c.mult)){say(S,Cap(nm(S,e))+' is tame already.');continue;}if(!inert(t))t.st.guarding=1;c.effect=true;}},
 crown(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'||!e.t.props.includes('living')){if(subs.length===1)say(S,'Only something living can wear a crown.');continue;}
   const t=e.t;if(!evolve(S,t,'crowned',(3)*c.mult)){say(S,Cap(nm(S,e))+' is crowned already.');continue;}c.effect=true;
   const kind=['beast','plant','human','spirit'].find(k=>t.props.includes(k));if(kind)for(const o of side(S,t.side))if(o!==t&&o.props.includes(kind)){o.vig++;say(S,Cap(nm(S,T(o)))+' rallies to its '+(t.side===who?'':'')+'sovereign and has '+o.vig+'.');}}},
 name(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'){say(S,'People have names already.');continue;}
   if(e.t.props.includes('blank')){const tg=side(S,1-e.t.side).filter(x=>!isG(x)&&!x.st.occult&&!x.st.masked).sort((a,b)=>b.vig-a.vig)[0];if(!tg){say(S,'There is nothing opposite to take a name from.');continue;}say(S,'The unnamed thing is given the name of what stands opposite.');turnInto(S,e.t,tg.w);e.t.vig=Math.max(e.t.vig,tg.vig);c.effect=true;continue;}
   if(!evolve(S,e.t,'named',(1)*c.mult)){say(S,Cap(nm(S,e))+' has a name already.');continue;}addProp(e.t,'named');c.effect=true;}},
 strike(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&!e.t.props.includes('concept'),'has no body to strike with.');
  for(const a of ag){const gh=ghost(a.t);for(const o0 of objs){if(!alive(S,a))break;const o=gh?o0:blockOf(S,o0,c,a);if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
    if(gh){didAct(S,who,a);const sd=o.k==='p'?o.i:o.t.side;if(warded(S,sd)){say(S,Cap(nm(S,a))+' cannot cross the salt.');continue;}
      if(!has(o,'living')||(o.k==='t'&&o.t.props.includes('sacred'))){say(S,Cap(nm(S,a))+' passes through '+nm(S,o)+' and leaves no mark.');continue;}
      say(S,Cap(nm(S,a))+' chills '+nm(S,o)+'.');damage(S,o,a.t.vig*c.mult,'attack');c.effect=true;continue;}
    if(bodiless(o)){say(S,Cap(nm(S,a))+' strikes at '+nm(S,o)+' and meets nothing.');didAct(S,who,a);continue;}
    if(!reach(S,a,o,o0))continue;didAct(S,who,a);
    say(S,Cap(nm(S,a))+' '+strikeWord(a.t)+' '+nm(S,o)+'.');hit(S,o,a.t.vig*c.mult,'attack');c.effect=true;touch(S,a,o,c);hitBack(S,a,o,o0);}}},
 sleep(S,who,subs,objs,c){for(const e of subs)if(sleep(S,e,0))c.effect=true;},
 wake(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'){const p=S.players[e.i];if(p.asleep){p.asleep=0;say(S,Cap(nm(S,e))+' '+vb(e,'wake','wakes')+'.');c.effect=true;}else if(subs.length===1)say(S,Cap(nm(S,e))+' '+vb(e,'are','is')+' not asleep.');continue;}
   if(e.t.st.stone&&e.t.was){e.t.props=e.t.was;e.t.was=null;e.t.st={};say(S,Cap(nm(S,e))+' wakes from stone, alive again.');c.effect=true;continue;}
   if(e.t.st.asleep){e.t.st.asleep=0;say(S,Cap(nm(S,e))+' wakes.');c.effect=true;}else if(subs.length===1)say(S,Cap(nm(S,e))+' is not asleep.');}},
 grow(S,who,subs,objs,c){
  for(const e of subs){if(!alive(S,e))continue;
   if(e.k==='p'||!e.t.props.includes('plant')){if(subs.length===1)say(S,Cap(nm(S,e))+' '+vb(e,'are','is')+' no plant and will not grow.');continue;}
   if(clime(S,'winter')||clime(S,'drought')||clime(S,'desert')){say(S,'Nothing grows in '+S.clime.w+'.');return;}
   let n=2*c.mult;if(e.t.st.sodden)n+=2;const a=S.things.find(t=>t.w==='ash'&&t.side===e.t.side);if(a){S.things.splice(S.things.indexOf(a),1);n+=2;say(S,'The ash feeds it.');}
   e.t.vig+=n;c.effect=true;say(S,Cap(nm(S,e))+' grows to '+e.t.vig+'.');}},
 wither(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'||!e.t.props.includes('plant')){if(subs.length===1)say(S,'Only green things wither.');continue;}say(S,Cap(nm(S,e))+' withers.');damage(S,e,3*c.mult,'wither');c.effect=true;}},
 rust(S,who,subs,objs,c){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'||!e.t.props.includes('metal')){if(subs.length===1)say(S,'Only metal rusts.');continue;}
   if(e.t.props.includes('incorruptible')||e.t.props.includes('liquid')){say(S,Cap(nm(S,e))+' does not rust.');continue;}say(S,Cap(nm(S,e))+' rusts.');damage(S,e,(2+(e.t.st.sodden?2:0))*c.mult,'rust');c.effect=true;}},
 burn(S,who,subs,objs,c,hasObj){
  if(!hasObj){for(const e of subs){if(!alive(S,e))continue;if(e.k==='p'){say(S,'People do not catch fire by being told to.');continue;}
     if(!e.t.props.includes('flammable')&&!e.t.props.includes('living')&&!e.t.st.frozen&&!e.t.st.sodden&&!e.t.props.includes('cinnabar')){if(subs.length===1)say(S,Cap(nm(S,e))+' will not catch.');continue;}if(heat(S,e,c.mult))c.effect=true;}return;}
  const ag=agents(S,who,subs,canBeHot,'has no fire to give.');
  for(const a of ag){didAct(S,who,a);for(const o of objs){const tg=blockOf(S,o,c,a);if(tg.k==='t'&&tg.t===a.t)continue;if(heat(S,tg,c.mult))c.effect=true;}}},
 bite(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&(e.t.props.includes('beast')||e.t.props.includes('human')),'has no teeth to bite with.');
  for(const a of ag){for(const o0 of objs){if(!alive(S,a))break;const o=blockOf(S,o0,c,a);if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
    if(bodiless(o)){say(S,'Teeth close on nothing. '+Cap(nm(S,o))+' has no body.');didAct(S,who,a);continue;}
    if(!reach(S,a,o,o0))continue;
    if(o.k==='t'&&!o.t.props.includes('living')&&!o.t.props.includes('brittle')){say(S,Cap(nm(S,a))+' breaks its teeth on '+nm(S,o)+'.');didAct(S,who,a);continue;}
    if(o.k==='t'&&o.t.props.includes('sacred')){say(S,'No beast will bite '+nm(S,o)+'.');continue;}
    didAct(S,who,a);const n=(a.t.vig+(a.t.props.includes('beast')?3:0))*c.mult,tox=o.k==='t'&&o.t.props.includes('toxic'),th=o.k==='t'&&o.t.props.includes('thorny');
    if(a.t.props.includes('beast'))c.pre=a.t.vig+' vigour + 3 (a beast’s bite)';say(S,Cap(nm(S,a))+' bites '+nm(S,o)+'.');hit(S,o,n,'bite');c.effect=true;
    if(a.t.props.includes('drain')){const p=S.players[a.t.side];p.life=Math.min(LIFE,p.life+n);say(S,'The blood goes to '+nm(S,P(a.t.side))+'.');}
    touch(S,a,o,c);
    if(th&&alive(S,a)){say(S,'Thorns.');damage(S,a,1,'sting');}
    if(tox&&alive(S,a)){say(S,'It was poisonous to bite.');poison(S,a,1);}
    hitBack(S,a,o,o0);}}},
 crush(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&['heavy','wood','stone'].some(p=>e.t.props.includes(p)),'is too light to crush anything.');
  for(const a of ag){for(const o0 of objs){if(!alive(S,a))break;const o=blockOf(S,o0,c,a);if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
    if(bodiless(o)){say(S,Cap(nm(S,a))+' falls through '+nm(S,o)+'. There is nothing to crush.');didAct(S,who,a);continue;}
    if(!reach(S,a,o,o0))continue;didAct(S,who,a);
    say(S,Cap(nm(S,a))+' crushes '+nm(S,o)+'.');c.effect=true;
    if(o.k==='t'&&o.t.st.frozen){say(S,'Frozen through, it breaks like glass.');destroy(S,o.t,'shatter');}else hit(S,o,(a.t.vig+(a.t.props.includes('heavy')?3:0))*c.mult,'crush');touch(S,a,o,c);hitBack(S,a,o,o0);}}},
 cut(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&canT('cut',e.t),'has no edge to cut with.');
  for(const a of ag){for(const o0 of objs){if(!alive(S,a))break;const o=blockOf(S,o0,c,a);if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
    if(bodiless(o)){say(S,'The edge passes through '+nm(S,o)+'.');didAct(S,who,a);continue;}
    if(o.k==='t'&&o.t.st.bound&&o.t.side===a.t.side){o.t.st.bound=0;didAct(S,who,a);say(S,Cap(nm(S,a))+' cuts '+nm(S,o)+' free.');c.effect=true;continue;}
    if(!reach(S,a,o,o0))continue;
    if(o.k==='t'&&!o.t.props.includes('living')&&!o.t.props.includes('brittle')){say(S,'The edge skates off '+nm(S,o)+'.');didAct(S,who,a);continue;}
    didAct(S,who,a);const plant=o.k==='t'&&o.t.props.includes('plant');
    say(S,Cap(nm(S,a))+(plant?' reaps ':' cuts ')+nm(S,o)+'.');hit(S,o,a.t.vig*c.mult*(a.t.props.includes('sharp')?(plant?3:2):1),'cut');c.effect=true;touch(S,a,o,c);hitBack(S,a,o,o0);}}},
 sting(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&canT('sting',e.t),'has no sting.');
  for(const a of ag){for(const o0 of objs){if(!alive(S,a))break;const o=guardOf(S,o0,a);if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
    if(bodiless(o)){say(S,'There is nothing in '+nm(S,o)+' to sting.');didAct(S,who,a);continue;}
    if(!reach(S,a,o,o0))continue;
    if(o.k==='t'&&!o.t.props.includes('living')&&!o.t.props.includes('brittle')){say(S,Cap(nm(S,o))+' feels nothing.');didAct(S,who,a);continue;}
    didAct(S,who,a);say(S,Cap(nm(S,a))+' stings '+nm(S,o)+'.');hit(S,o,(a.t.vig+1)*c.mult,'sting');c.effect=true;touch(S,a,o,c);
    if(a.t.props.includes('toxic')&&alive(S,o)&&has(o,'living'))poison(S,o,1);}}},
 poison(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>has(e,'toxic'),'has no poison in it.');
  for(const a of ag){didAct(S,who,a);for(const o0 of objs){const o=guardOf(S,o0,a);if(o.k==='t'&&o.t===a.t)continue;if(poison(S,o,c.mult))c.effect=true;}}},
 bind(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&canT('bind',e.t),'has nothing to bind with.');
  for(const a of ag){for(const o of objs){if(!alive(S,a))break;if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
    if(o.k==='p'){didAct(S,who,a);S.players[o.i].dazed+=2;say(S,Cap(nm(S,o))+' '+vb(o,'are','is')+' tangled, and will have 2 less breath next turn.');c.effect=true;continue;}
    if(bodiless(o)){say(S,Cap(nm(S,o))+' cannot be held.');didAct(S,who,a);continue;}
    if(!reach(S,a,o))continue;didAct(S,who,a);
    if(o.t.st.fixed){say(S,Cap(nm(S,o))+' is fixed and does not change.');continue;}
    o.t.st.bound=dur(S,o.t.side);o.t.st.guarding=0;say(S,Cap(nm(S,a))+' binds '+nm(S,o)+' fast.');c.effect=true;touch(S,a,o,c);}}},
 drench(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&(e.t.props.includes('liquid')||e.t.props.includes('damp')||e.t.st.sodden)&&!e.t.st.frozen,'is not wet enough to drench anything.');
  for(const a of ag){didAct(S,who,a);const ap=a.t.props;for(const o of objs){if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
    if(ap.includes('liquid')&&ap.includes('flammable')){if(o.k==='t'&&!bodiless(o)){addProp(o.t,'flammable');if(o.t.st.burning){say(S,'It only feeds the fire.');}else say(S,Cap(nm(S,o))+' is soaked in '+a.t.w+' and will burn.');c.effect=true;}else say(S,Cap(nm(S,o))+' '+vb(o,'are','is')+' smeared with '+a.t.w+', nothing worse.');continue;}
    if(wet(S,o))c.effect=true;
    if(alive(S,o)&&ap.includes('toxic')&&has(o,'living')){if(poison(S,o,1))c.effect=true;}
    if(alive(S,o)&&ap.includes('pure')&&has(o,'living')){if(o.k==='p'){if(S.players[o.i].poisoned){S.players[o.i].poisoned=0;say(S,'The poison is washed out.');c.effect=true;}}else if(o.t.st.poisoned){o.t.st.poisoned=0;say(S,'The poison is washed out.');c.effect=true;}}
    if(alive(S,o)&&ap.includes('salty')&&o.k==='t'&&o.t.props.includes('plant')){say(S,'Salt kills the root.');damage(S,o,2*c.mult,'wither');c.effect=true;}
    if(alive(S,o)&&ap.includes('elixir')&&has(o,'living')){if(o.k==='p'){const p=S.players[o.i];p.life=Math.min(LIFE,p.life+3);}else o.t.vig+=3;say(S,'The elixir restores 3.');c.effect=true;}
    if(alive(S,o)&&ap.includes('corrosive')){say(S,'The acid bites.');damage(S,o,2*c.mult,'acid');c.effect=true;}}}},
 dissolve(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&canT('dissolve',e.t),'cannot dissolve anything.');
  for(const a of ag){didAct(S,who,a);const uni=a.t.props.includes('universal');let used=false;
   for(const o0 of objs){const o=blockOf(S,o0,c,a);if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
    if(o.k==='p'){say(S,Cap(nm(S,a))+' eats into '+nm(S,o)+'.');damage(S,o,3*c.mult,'acid');c.effect=true;used=true;continue;}
    if(!uni&&o.t.props.includes('incorruptible')){say(S,'Gold does not corrode.');continue;}
    if(!uni&&bodiless(o)){say(S,'There is nothing in '+nm(S,o)+' to dissolve.');continue;}
    destroy(S,o.t,'acid');c.effect=true;used=true;}
   if(uni&&used&&alive(S,a)){say(S,'Nothing can hold the universal solvent.');destroy(S,a.t,'gone');}}},
 haunt(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&canT('haunt',e.t),'is nothing that haunts.');
  for(const a of ag){for(const o of objs){if(!alive(S,a))break;if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
    const sd=o.k==='p'?o.i:o.t.side;didAct(S,who,a);
    if(!a.t.props.includes('spirit')){if(o.k!=='p'){say(S,Cap(nm(S,a))+' can only weigh on a person.');continue;}say(S,Cap(nm(S,a))+' weighs on '+nm(S,o)+'.');damage(S,o,1*c.mult,'dread');c.effect=true;continue;}
    if(warded(S,sd)){say(S,Cap(nm(S,a))+' cannot cross the salt.');continue;}
    if(o.k==='p'){say(S,Cap(nm(S,a))+' haunts '+nm(S,o)+'.');damage(S,o,2*c.mult,'dread');c.effect=true;continue;}
    if(o.t.props.includes('sacred')){say(S,Cap(nm(S,o))+' is sacred. The haunting fails.');continue;}
    if(!o.t.props.includes('minded')){say(S,Cap(nm(S,o))+' has no mind to frighten.');continue;}
    const t=o.t,lab=Cap(nm(S,o));S.things.splice(S.things.indexOf(t),1);dropVerbs(S,t);if(!t.token)S.players[t.owner].hand.push(t.card);say(S,lab+' flees'+(t.token?' and is gone.':' back to hand.'));c.effect=true;}}},
 blind(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&(canT('blindp',e.t)||e.t.st.burning),'can neither dazzle nor darken.');
  for(const a of ag){for(const o of objs){if(!alive(S,a))break;if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;didAct(S,who,a);
    if(a.t.props.includes('dust')){say(S,'A fistful of '+a.t.w+' in the eyes.');S.things.splice(S.things.indexOf(a.t),1);dropVerbs(S,a.t);}
    if(o.k==='p'){S.players[o.i].dazed+=2;say(S,Cap(nm(S,o))+' '+vb(o,'are','is')+' dazzled, and will have 2 less breath next turn.');c.effect=true;continue;}
    if(o.t.props.includes('dark')){destroy(S,o.t,'light');c.effect=true;continue;}
    if(!(o.t.props.includes('beast')||o.t.props.includes('human')||o.t.props.includes('minded'))){say(S,Cap(nm(S,o))+' has no eyes to dazzle.');continue;}
    if(o.t.st.fixed){say(S,Cap(nm(S,o))+' is fixed and does not change.');continue;}
    o.t.st.blind=dur(S,o.t.side);o.t.st.guarding=0;say(S,Cap(nm(S,o))+' is blinded.');c.effect=true;}}},
 petrify(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&canT('petrify',e.t),'cannot turn anything to stone.');
  for(const a of ag){for(const o of objs){if(!alive(S,a))break;if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;didAct(S,who,a);
    if(o.k==='p'){say(S,Cap(nm(S,o))+' '+vb(o,'look','looks')+' away just in time, shaken.');damage(S,o,2*c.mult,'dread');c.effect=true;continue;}
    if(!o.t.props.includes('living')){say(S,Cap(nm(S,o))+' is not alive to be turned.');continue;}
    if(o.t.st.fixed){say(S,Cap(nm(S,o))+' is fixed and does not change.');continue;}
    say(S,Cap(nm(S,o))+' turns to stone.');o.t.was=o.t.props.slice();o.t.props=['stone','heavy'];o.t.st={stone:1};c.effect=true;}}},
 steal(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&canT('steal',e.t),'is no thief.');
  for(const a of ag){for(const o of objs){if(!alive(S,a))break;if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;didAct(S,who,a);const mine=S.players[a.t.side];
    if(o.k==='p'){if(o.i===a.t.side){say(S,'Stealing from its own keeper gains nothing.');continue;}const p=S.players[o.i],n=Math.min(p.coins,(a.t.props.includes('thief')?2:1)*c.mult);if(!n){say(S,Cap(nm(S,o))+' '+vb(o,'have','has')+' nothing to steal.');continue;}p.coins-=n;mine.coins+=n;say(S,Cap(nm(S,a))+' steals '+n+' coin'+(n>1?'s':'')+' from '+nm(S,o)+'.');c.effect=true;continue;}
    if(o.t.w!=='gold'){say(S,Cap(nm(S,o))+' is not worth stealing.');continue;}
    if(o.t.side===a.t.side||full(S,a.t.side)){say(S,'There is nowhere to carry it.');continue;}
    say(S,Cap(nm(S,a))+' carries off '+nm(S,o)+'.');o.t.side=a.t.side;c.effect=true;}}},
 mend(S,who,subs,objs,c){
  const ok=e=>e.k==='t'&&['herb','adept','nurse','herbalist','elixir','pure'].some(p=>e.t.props.includes(p));
  const ag=agents(S,who,subs,ok,'knows nothing of healing.');
  for(const a of ag){didAct(S,who,a);const healer=['adept','nurse','herbalist'].some(p=>a.t.props.includes(p)),herb=!healer,tox=herb&&a.t.props.includes('toxic');let did=false;
   for(const o of objs){if(!alive(S,o)||(o.k==='t'&&o.t===a.t))continue;
    if(!has(o,'living')){say(S,Cap(nm(S,o))+' is not alive to be mended.');continue;}
    if(tox){say(S,Cap(nm(S,a))+' is no medicine.');poison(S,o,c.mult);damage(S,o,1,'poison');c.effect=true;did=true;continue;}
    const n=(a.t.props.includes('elixir')?6:3)*c.mult;if(o.k==='p'){const p=S.players[o.i];p.life=Math.min(LIFE,p.life+n);p.poisoned=0;say(S,Cap(nm(S,o))+' '+vb(o,'are','is')+' mended to '+p.life+' life.');}
    else{o.t.vig+=n;o.t.st.poisoned=0;say(S,Cap(nm(S,o))+' is mended to '+o.t.vig+'.');}c.effect=true;did=true;}
   if(did&&alive(S,a)&&a.t.props.includes('nurse')){say(S,'It gives of its own blood.');damage(S,a,1,'drained');}
   if(herb&&alive(S,a))destroy(S,a.t,'used');}},
 transmute(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t'&&canT('transmute',e.t),'does not know the art.');
  for(const a of ag){didAct(S,who,a);for(const o of objs){if(!alive(S,o))continue;
    if(o.k==='p'||!o.t.props.includes('metal')){say(S,o.k==='p'||has(o,'living')?'Flesh will not turn to gold.':Cap(nm(S,o))+' is no metal and will not turn.');continue;}
    if(o.t.w==='gold'){say(S,'It is gold already.');continue;}
    const t=o.t,was=nm(S,o);become(S,t,'gold');
    if(t.side!==a.t.side&&!full(S,a.t.side))t.side=a.t.side;
    say(S,Cap(was)+' becomes gold, and '+nm(S,a)+' keeps it.');c.effect=true;}}},
 drink(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>has(e,'living'),'cannot drink.');
  for(const a of ag){for(const o of objs){if(!alive(S,a))break;if(!alive(S,o))continue;
    if(o.k==='p'||!o.t.props.includes('liquid')){say(S,Cap(nm(S,o))+' cannot be drunk.');continue;}
    if(o.t.st.frozen){say(S,Cap(nm(S,o))+' is frozen solid.');continue;}
    didAct(S,who,a);const pr=o.t.props.slice();say(S,Cap(nm(S,a))+' '+vb(a,'drink','drinks')+' '+nm(S,o)+'.');destroy(S,o.t,'drunk');c.effect=true;
    const heal=n=>{if(a.k==='p'){const p=S.players[a.i];p.life=Math.min(LIFE,p.life+n);p.poisoned=0;say(S,Cap(nm(S,a))+' '+vb(a,'are','is')+' restored to '+p.life+' life.');}else{a.t.vig+=n;a.t.st.poisoned=0;say(S,Cap(nm(S,a))+' is restored to '+a.t.vig+'.');}};
    if(pr.includes('universal')){say(S,'It dissolves the drinker from within.');damage(S,a,5,'acid');}
    else if(pr.includes('corrosive')){say(S,'It burns all the way down.');damage(S,a,3,'acid');}
    else if(pr.includes('elixir'))heal(6);
    else if(pr.includes('pure'))heal(1);
    else if(pr.includes('inkwell')){if(a.k==='p'){S.players[a.i].ink+=2;say(S,Cap(nm(S,a))+' '+vb(a,'gain','gains')+' 2 breath.');}else say(S,'It stains the tongue black.');}
    else if(pr.includes('toxic')||pr.includes('flammable'))poison(S,a,1);
    else say(S,'It only makes the thirst worse.');}}},
 eat(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='p'||e.t.props.includes('beast')||e.t.props.includes('human')||e.t.props.includes('corrosive'),'has no mouth to eat with.');
  for(const a of ag){for(const o of objs){if(!alive(S,a))break;if(!alive(S,o))continue;
    if(a.k==='t'&&a.t.props.includes('corrosive')&&!a.t.props.includes('beast')){if(o.k==='p'||!(o.t.props.includes('metal')||o.t.props.includes('stone'))){say(S,'Acid eats metal and stone. '+Cap(nm(S,o))+' '+vb(o,'are','is')+' neither.');continue;}
      didAct(S,who,a);if(o.t.props.includes('incorruptible')&&!a.t.props.includes('universal')){say(S,'Gold does not corrode.');continue;}say(S,Cap(nm(S,a))+' eats into '+nm(S,o)+'.');destroy(S,o.t,'acid');c.effect=true;continue;}
    if(a.k==='t'&&a.t.props.includes('beast')&&o.k==='t'&&o.t!==a.t&&o.t.props.includes('living')&&!o.t.props.includes('plant')){
      if(!reach(S,a,o))continue;didAct(S,who,a);if(o.t.vig>=a.t.vig){say(S,Cap(nm(S,o))+' is too big for '+nm(S,a)+' to swallow.');continue;}
      const tox=o.t.props.includes('toxic');say(S,Cap(nm(S,a))+' eats '+nm(S,o)+' whole.');destroy(S,o.t,'eaten');a.t.vig+=2;c.effect=true;if(tox&&alive(S,a)){say(S,'It was poison.');poison(S,a,1);}continue;}
    if(o.k==='p'||!o.t.props.includes('plant')){say(S,Cap(nm(S,o))+' is not food.');continue;}
    didAct(S,who,a);const pr=o.t.props.slice();say(S,Cap(nm(S,a))+' '+vb(a,'eat','eats')+' '+nm(S,o)+'.');destroy(S,o.t,'eaten');c.effect=true;
    if(a.k==='p'){const p=S.players[a.i];p.life=Math.min(LIFE,p.life+2);}else a.t.vig+=2;
    if(pr.includes('thorny')||pr.includes('sting')){say(S,'It stings going down.');damage(S,a,1,'sting');}
    if(pr.includes('toxic')&&alive(S,a)){say(S,'It was poison.');poison(S,a,1);}}}},
 forget(S,who,subs,objs,c,hasObj){
  if(!hasObj){for(const e of subs){if(!alive(S,e))continue;
    if(e.k==='p'){const p=S.players[e.i];if(!p.hand.length){say(S,Cap(nm(S,e))+' '+vb(e,'have','has')+' nothing left to forget.');continue;}
      const i=Math.floor(rnd(S)*p.hand.length),w=p.hand.splice(i,1)[0];p.discard.push(w);say(S,Cap(nm(S,e))+' '+vb(e,'forget','forgets')+' a word'+(e.i===0?': '+w:'')+'.');c.effect=true;continue;}
    if(!e.t.props.includes('minded')){if(subs.length===1)say(S,Cap(nm(S,e))+' has no mind to lose.');continue;}
    e.t.st={};dropVerbs(S,e.t);say(S,Cap(nm(S,e))+' forgets itself. Every condition falls away, and every verb it knew.');c.effect=true;}return;}
  const ag=agents(S,who,subs,e=>has(e,'minded'),'has no mind to forget with.');
  for(const a of ag){didAct(S,who,a);for(const o of objs){if(!alive(S,o))continue;
    if(o.k==='p'){say(S,'Nobody forgets a person standing in front of them.');continue;}
    if(a.k==='t'&&o.t===a.t)continue;
    if(bodiless(o)){destroy(S,o.t,'forgot');c.effect=true;continue;}
    o.t.st={};dropVerbs(S,o.t);say(S,Cap(nm(S,o))+' is forgotten for a moment. Every condition falls away, and every verb it knew.');c.effect=true;}}},
 scream(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>has(e,'voiced'),'has no voice.');
  for(const a of ag){didAct(S,who,a);
   if(a.k==='t'&&a.t.w==='mandrake'){say(S,'The mandrake screams.');for(const t of S.things.slice())if(t!==a.t&&t.props.includes('minded')&&t.props.includes('living'))damage(S,T(t),2*c.mult,'scream');damage(S,P(0),2*c.mult,'scream');damage(S,P(1),2*c.mult,'scream');c.effect=true;continue;}
   say(S,Cap(nm(S,a))+' '+vb(a,'scream','screams')+'.');let woke=false;for(const t of S.things)if(t.st.asleep){t.st.asleep=0;woke=true;}for(const p of S.players)if(p.asleep){p.asleep=0;woke=true;}
   if(woke){say(S,'Every sleeper wakes.');c.effect=true;}else say(S,'Nobody was asleep.');}},
 guard(S,who,subs,objs,c){
  const ag=agents(S,who,subs,e=>e.k==='t','cannot stand guard over '+(who===0?'yourself':'itself')+'.');
  for(const a of ag){if(a.t.side!==who)continue;didAct(S,who,a,true);a.t.st.guarding=1;say(S,Cap(nm(S,a))+' stands guard.');c.effect=true;}},
};

const CAN={blow:h=>h('wind')||h('flying')||h('bird')||h('blower'),cut:h=>h('sharp')||h('thorny')||h('sting')||h('bird')||h('brittle'),sting:h=>h('sting')||h('thorny')||h('serpent')||(h('beast')&&h('toxic')),
 bind:h=>h('binder')||h('serpent')||h('wood')||h('frost'),dissolve:h=>h('corrosive')||h('liquid'),haunt:h=>h('spirit')||h('burden')||h('dark')||h('nocturnal'),steal:h=>h('thief')||h('carrion')||h('dark')||h('nocturnal'),blindp:h=>h('bright')||h('dust')||h('dark')||h('damp'),petrify:h=>h('petrifier')||h('serpent')||h('stone'),transmute:h=>h('adept')||h('elixir')||h('pure')||h('cinnabar')||h('scribe'),hot:h=>h('fireborn')||h('spark')||h('explosive')||h('pyro')||h('flame')||h('quicklime')};
const canT=(k,t)=>CAN[k](p=>t.props.includes(p));
function abilities(props,st){if(props.includes('spell'))return['stand and work by itself'];if(props.includes('ground')){const b=abilities(props.filter(p=>p!=='ground'),st).filter(v=>!ATTACKV.includes(v)&&v!=='guard'&&v!=='eat'&&v!=='drink');return b.length?b:['act by its nature'];}
  const h=p=>props.includes(p),a=[];if(st&&st.stone)return['nothing: it is stone'];if(h('event'))return[];if(!h('concept'))a.push('strike');
  if(h('beast')||h('human'))a.push('bite');if(h('heavy')||h('wood')||h('stone'))a.push('crush');if(CAN.cut(h))a.push('cut');if(CAN.sting(h))a.push('sting');if(h('toxic'))a.push('poison');if(CAN.bind(h))a.push('bind');if(CAN.dissolve(h))a.push('dissolve');if(h('liquid')||h('damp')||(st&&st.sodden))a.push('drench');if(CAN.blow(h))a.push('blow');
  if(CAN.hot(h)||(st&&st.burning))a.push('burn');if(CAN.blindp(h)||(st&&st.burning))a.push('blind');if(CAN.haunt(h))a.push('haunt');if(CAN.petrify(h))a.push('petrify');if(CAN.steal(h))a.push('steal');
  if(['herb','adept','nurse','herbalist','elixir','pure'].some(h))a.push('mend');if(CAN.transmute(h))a.push('transmute');if(h('beast')||h('human')||h('corrosive'))a.push('eat');if(h('living'))a.push('drink');if(h('minded'))a.push('forget');if(h('voiced'))a.push('scream');a.push('guard');return a;}
function snd(w){if(/^kn/.test(w))return 'n';if(/^wr/.test(w))return 'r';if(/^ph/.test(w))return 'f';if(/^(qu|k|c[aoulr])/.test(w))return 'k';if(/^c[eiy]/.test(w))return 's';return w[0];}
function findThing(S,id){return S.things.find(t=>t.id===id);}
function secretSay(S,who,sen){if(who!==1||!sen||!sen.subj||sen.subj.k!=='card')return false;const h=S.players[1].hand,w=h[sen.subj.i],d=W[w];if(!d||d.t!==NOUN||clime(S,'noon')||d.props.includes('bright')||d.props.includes('ground')||d.props.includes('event'))return false;
  return (sen.adjs||[]).some(i=>h[i]==='occult')||d.props.includes('dark')||clime(S,'night');}
function visible(t,who){return t.side===who||!t.st.occult;}
function matchCat(S,cat){const m=W[cat].match;
  if(m==='#flying')return S.things.filter(t=>(t.props.includes('bird')||t.props.includes('flying'))&&!t.props.includes('named')).map(T);
  if(m==='#burning')return S.things.filter(t=>(t.st.burning||t.props.includes('flame'))&&!t.props.includes('named')).map(T);
  if(m==='#asleep'){const o=S.things.filter(t=>t.st.asleep&&!t.props.includes('named')).map(T);S.players.forEach((p,i)=>{if(p.asleep)o.push(P(i));});return o;}
  const out=S.things.filter(t=>t.props.includes(m)&&!t.props.includes('named')).map(T);if(m==='living')out.push(P(0),P(1));return out;}

function validate(S,who,sen){const r=validate0(S,who,sen);if(brave(S,who)){if(r.cost!=null)r.cost=0;if(!r.ok&&/^That needs \d+ breath/.test(r.why||''))return{ok:true,cost:0};}return r;}
function validate0(S,who,sen){
  const p=S.players[who],hand=p.hand,idx=[];
  const add=i=>{if(i==null)return true;if(i<0||i>=hand.length||idx.includes(i))return false;idx.push(i);return true;};
  for(const i of sen.adjs||[])if(!add(i)||W[hand[i]].t!==ADJ)return{ok:false,why:'That is not an adjective.'};
  if(!add(sen.verb)||!add(sen.clime))return{ok:false,why:'Choose different words.'};
  if(sen.subj&&sen.subj.k==='card'&&!add(sen.subj.i))return{ok:false,why:'Choose different words.'};
  if(sen.obj&&sen.obj.k==='card'&&!add(sen.obj.i))return{ok:false,why:'Choose different words.'};
  if(p.ban&&(idx.some(i=>hand[i]===p.ban)||sen.kverb===p.ban))return{ok:false,why:'The angel has forbidden you \u201c'+p.ban+'\u201d this turn.'};
  if(S.noatk&&(idx.some(i=>ATTACKV.includes(hand[i]))||ATTACKV.includes(sen.kverb)))return{ok:false,why:'No blows are struck here. Find another way.'};
  if(!idx.length&&!sen.kverb)return{ok:false,why:sen.subj?'Add a verb from your hand, or one this thing already knows.':'Tap a word in your hand, or one of your things, to begin.',empty:true};
  let cost=idx.reduce((a,i)=>a+costOf(S,who,hand[i]),0);
  const fail=why=>({ok:false,why,cost});
  if(sen.clime!=null){if(W[hand[sen.clime]].t!==CLIME||idx.length>1+(sen.adjs||[]).length||sen.verb!=null||sen.kverb||sen.subj||sen.obj)return fail('Weather is spoken on its own, or with adjectives laid on it.');return cost>p.ink?fail('That needs '+cost+' breath.'):{ok:true,cost};}
  if(sen.verb!=null&&hand[sen.verb]==='fuse'){
    if((sen.adjs||[]).length||sen.kverb)return fail('And joins two things and nothing else.');
    const a=rxWord(S,who,sen.subj),b=rxWord(S,who,sen.obj);
    if(!a)return fail('Choose the first thing to join: a noun from your hand or one of your things.');
    if(sen.subj.k==='thing'&&findThing(S,sen.subj.id).side!==who)return fail('The first thing must be your own.');
    if(!b)return fail('Now choose what to join it with: another noun from your hand, or a thing on the board.');
    if(sen.subj.k==='thing'&&sen.obj.k==='thing'&&sen.subj.id===sen.obj.id)return fail('A thing cannot react with itself.');
    for(const r of [sen.subj,sen.obj])if(r.k==='thing'){const t=findThing(S,r.id);if(!visible(t,who))return fail('That thing cannot be seen.');if(t.side!==who){if(t.st.hermetic||t.st.masked)return fail('It is sealed. You cannot single it out.');cost+=CURSE;}}
    const x=rxOf(a,b);if(!x)return fail('Nothing comes of '+a+' and '+b+'.');
    const ex=[sen.subj,sen.obj].filter(r=>r.k==='thing').map(r=>findThing(S,r.id));
    for(const t of ex){if(t.st.frozen&&!(a==='fire'||b==='fire'))return fail(Cap(t.title||t.w)+' is frozen solid. Only fire will react with it.');if(t.st.stone)return fail(Cap(t.title||t.w)+' is stone and will not react.');}
    if(x.need&&!S.things.some(t=>t.side===who&&t.props.includes('catalyst'))&&!NEED[x.need][1](S,who,ex))return fail(NEED[x.need][2]);
    if(x.r&&W[x.r].t===NOUN){const frees=[sen.subj,sen.obj].filter(r=>r.k==='thing'&&findThing(S,r.id).side===who).length;const fg=[sen.subj,sen.obj].filter(r=>r.k==='thing'&&findThing(S,r.id).side===who&&isG(findThing(S,r.id))===W[x.r].props.includes('ground')).length;if(!fg&&full(S,who,x.r))return fail(W[x.r].props.includes('ground')?'Your ground is full: it holds '+MAXGROUND+'.':'Your side of the board is full.');}
    return cost>p.ink?fail('That needs '+cost+' breath.'):{ok:true,cost};}
  if(sen.kverb&&sen.verb!=null)return fail('One verb at a time.');
  {const gv=sen.kverb||(sen.verb!=null?hand[sen.verb]:null),gs=sen.subj&&(sen.subj.k==='thing'?findThing(S,sen.subj.id):sen.subj.k==='card'&&W[hand[sen.subj.i]].t===NOUN?{props:W[hand[sen.subj.i]].props,w:hand[sen.subj.i]}:null);
   if(gv&&gv!=='doubt'&&gs&&gs.props.includes('spell'))return fail(Cap(gs.title||gs.w)+' is a spell. Say it alone: it stands and works by itself.');
   if(gv&&gs&&gs.props.includes('ground')&&(ATTACKV.includes(gv)||gv==='guard'))return fail(Cap(gs.title||gs.w)+' is part of the ground. It works by its nature and through reactions; it does not '+(gv==='guard'?'guard':'attack')+'.');}
  const vw=sen.kverb||(sen.verb!=null?hand[sen.verb]:null),vd=vw?W[vw]:null;
  if(vd&&vd.t!==VERB)return fail('That is not a verb.');
  if(vd&&vd.kind==='impersonal'){if(idx.length>1||sen.subj||sen.obj)return fail(Cap(vw)+' needs no subject. Say it alone.');return cost>p.ink?fail('That needs '+cost+' breath.'):{ok:true,cost};}
  if(!sen.subj)return fail('Choose a subject: a noun from your hand, a thing on the board, or a person.');
  const s=sen.subj;let sThing=null;const fog=clime(S,'fog');
  if(s.k==='card'){const d=W[hand[s.i]];if(d.t!==NOUN&&d.t!==CAT)return fail('The subject must be a noun.');
    if(d.t===NOUN&&d.props.includes('event')){if(idx.length>1||sen.obj||sen.kverb)return fail(Cap(hand[s.i])+' is a single-use spell. Say it alone.');return cost>p.ink?fail('That needs '+cost+' breath.'):{ok:true,cost};}
    if(d.t===NOUN){const sd=d.props.includes('burden')?1-who:who;if(full(S,sd,hand[s.i]))return fail(d.props.includes('spell')?'No more than '+MAXSPELL+' spells can stand on one side.':d.props.includes('ground')?'Your ground is full: it holds '+MAXGROUND+'.':'That side of the board is full.');}}
  else if(s.k==='thing'){sThing=findThing(S,s.id);if(!sThing||!visible(sThing,who))return fail('That thing cannot be seen.');if((sThing.st.hermetic||sThing.st.masked)&&sThing.side!==who)return fail('It is sealed. You cannot single it out.');if(fog&&sThing.side!==who)return fail('Fog hides it. Only a category can reach it.');
    if(sThing.side!==who)cost+=CURSE*(sen.adjs||[]).length;}
  if((sen.adjs||[]).length&&s.k==='player')return fail('Adjectives attach to things, not people. Try a category such as mortals.');
  if(sen.kverb&&!(sThing&&sThing.side===who&&(sThing.verbs||[]).includes(sen.kverb)))return fail('It does not know that verb.');
  if(sen.kverb&&sThing&&sThing.acted)return fail('It has already acted this turn.');
  if(!vd){if(sen.obj)return fail('To act on something a thing needs a verb: one from your hand, or one it already knows.');if(!(s.k==='card'&&W[hand[s.i]].t===NOUN)&&!(sen.adjs||[]).length)return fail('Add an adjective or a verb.');return cost>p.ink?fail('That needs '+cost+' breath.'):{ok:true,cost};}
  if(vd.obj==='req'&&!sen.obj)return fail(Cap(vw)+' needs an object. Tap a thing or a person.');
  if(vd.obj==='none'&&sen.obj)return fail(Cap(vw)+' takes no object.');
  const agent=vd.kind==='agent'||(vd.kind==='both'&&!!sen.obj);
  if(agent){if(sThing){if(sThing.side!==who)return fail('Only your own things act for you.');if(sThing.acted)return fail('It has already acted this turn.');}
    if(s.k==='player'&&s.i!==who)return fail('You cannot make the rival act.');}
  if(sen.obj){const o=sen.obj;if(o.k==='card'){if(W[hand[o.i]].t!==CAT)return fail('An object must be on the board, a person, or a category.');}
    else if(o.k==='thing'){const t=findThing(S,o.id);if(!t||!visible(t,who))return fail('That thing cannot be seen.');if((t.st.hermetic||t.st.masked)&&t.side!==who)return fail('It is sealed. You cannot single it out.');if(fog&&t.side!==who)return fail('Fog hides it. Only a category can reach it.');}}
  if(ATTACKV.includes(vw)&&sen.obj){const o=sen.obj;
    if(o.k==='card')return fail('An attack is aimed at a person, not a category.');
    if(o.k==='thing'){const t=findThing(S,o.id);if(t&&t.side!==who)return fail('An attack is aimed at the rival, not at one of their things. They choose whether something steps in.');}}
  return cost>p.ink?fail('That needs '+cost+' breath and you have '+p.ink+'.'):{ok:true,cost};
}
function describe(S,who,sen){
  const hand=S.players[who].hand;
  if(sen.clime!=null){const w=hand[sen.clime];return Cap((sen.adjs||[]).map(i=>hand[i]).concat(w).join(' '))+({drought:' sets in.',fog:' rolls in.',flux:' sets in.',noon:' strikes.',spring:' comes.',harvest:' comes.',desert:' spreads.',flood:' rises.',storm:' breaks.'}[w]||' falls.');}
  const vw=sen.kverb||(sen.verb!=null?hand[sen.verb]:null);
  if(vw==='fuse'){const a=rxWord(S,who,sen.subj),b=rxWord(S,who,sen.obj),x=a&&b?rxOf(a,b):null;return 'Fuse '+(a||'…')+' and '+(b||'…')+(x?(x.r?' to make '+x.r+'.':': they react.'):'.');}
  if(vw&&W[vw].kind==='impersonal')return 'It '+vw+'s.';
  const ref=r=>{if(!r)return null;if(r.k==='card')return{x:hand[r.i],pl:W[hand[r.i]].t===CAT};if(r.k==='player')return{x:nm(S,P(r.i)),pl:r.i===0};const t=findThing(S,r.id);return{x:t?nm(S,T(t)):'?',pl:false};};
  let parts=(sen.adjs||[]).map(i=>hand[i]);const s=ref(sen.subj),o=ref(sen.obj);
  if(vw&&EVOLVE.includes(vw)&&s&&!s.pl){const m=sen.subj.k==='thing'?s.x.match(/^(your|the rival’s) (.*)$/):null;const o2=vw==='sculpt'&&sen.obj?ref(sen.obj):null;return Cap(vw)+' '+(m?m[1]+' '+parts.concat(m[2]).join(' '):parts.concat(s.x).join(' '))+(o2?' from '+o2.x:'')+'.';}
  if(s){const m=sen.subj.k==='thing'&&parts.length?s.x.match(/^(your|the rival’s) (.*)$/):null;if(m)parts=[m[1],...parts,m[2]];else parts.push(s.x);}if(vw)parts.push(s&&s.pl?vw:(/(sh|ch|s|x)$/.test(vw)?vw+'es':/[^aeiou]y$/.test(vw)?vw.slice(0,-1)+'ies':vw+'s'));if(o&&vw==='steal'&&sen.obj.k==='player')parts.push('from');if(o)parts.push(o.x==='you'&&sen.subj&&sen.subj.k==='player'&&sen.subj.i===0?'yourself':o.x);
  return parts.length?Cap(parts.join(' '))+'.':'';
}
function resolve(S,who,sen){
  const bz=brave(S,who);const v=validate(S,who,sen);if(!v.ok)return v;
  const p=S.players[who],hand=p.hand;S.braveNow=false;
  S.sec=secretSay(S,who,sen);say(S,S.sec?'The rival says something you cannot make out.':(who===0?'You say: ':'The rival says: ')+describe(S,who,sen),'s');
  if(bz){p.braved=true;S.braveNow=true;say(S,'Courage. With so little left, this costs '+(who===0?'you':'the rival')+' nothing, and nothing can stand in its way.');}
  if(sen.verb!=null&&hand[sen.verb]==='fuse'){const c={mult:1,effect:false};p.ink-=v.cost;const vi=sen.verb,fix=r=>r&&r.k==='card'?{k:'card',i:r.i-(r.i>vi?1:0)}:r;hand.splice(vi,1);p.discard.push('fuse');
    react(S,who,{subj:fix(sen.subj),obj:fix(sen.obj)},c);if(p.earned<3){p.earned++;p.coins++;}S.braveNow=false;settleS(S);checkOver(S);return{ok:true};}
  S.cx=null;S.insDone=false;S.novDone=false;S.exDone=false;CURV=sen.kverb||(sen.verb!=null?hand[sen.verb]:null);S.atk=!!((sen.kverb||(sen.verb!=null?hand[sen.verb]:null))&&ATTACKV.includes(sen.kverb||hand[sen.verb]));S.atkWho=who;
  const adjW=(sen.adjs||[]).map(i=>hand[i]),cardVerb=sen.verb!=null?hand[sen.verb]:null,verbW=sen.kverb||cardVerb,climeW=sen.clime!=null?hand[sen.clime]:null;
  const sCard=sen.subj&&sen.subj.k==='card'?hand[sen.subj.i]:null,oCard=sen.obj&&sen.obj.k==='card'?hand[sen.obj.i]:null;
  const used=(sen.adjs||[]).slice();[sen.verb,sen.clime,sen.subj&&sen.subj.k==='card'?sen.subj.i:null,sen.obj&&sen.obj.k==='card'?sen.obj.i:null].forEach(i=>{if(i!=null)used.push(i);});
  used.sort((a,b)=>b-a).forEach(i=>hand.splice(i,1));
  for(const w of adjW)p.discard.push(w);if(sCard&&W[sCard].t===CAT)p.discard.push(sCard);if(oCard)p.discard.push(oCard);let keeper=null;
  p.ink-=v.cost;
  const c={mult:1,effect:false,def:sen.def},mark=S.log.length;
  const sT=sen.subj&&sen.subj.k==='thing'?findThing(S,sen.subj.id):null,oT=sen.obj&&sen.obj.k==='thing'?findThing(S,sen.obj.id):null;
  const names=adjW.slice();if(sCard)names.push(sCard);else if(sT)names.push(sT.w);if(verbW)names.push(verbW);if(oCard)names.push(oCard);else if(oT)names.push(oT.w);
  if(WORDPLAY&&names.length>=2){
    const real=names.filter(n=>!W[n].wild),wild=real.length<names.length;
    if(real.every(n=>snd(n)===snd(real[0]))){const r=S.things.some(t=>t.side===who&&t.props.includes('rune'))?2:1;c.mult+=r;say(S,(wild?'The stone answers to every sound. Alliteration':'Alliteration')+(r>1?', and the rune doubles it':'')+'.');}
    if(real.every(n=>W[n].o===W[real[0]].o)){c.mult+=1;say(S,wild?'The stone is kin to every word.':'Kin. Every word is '+ORIGIN[W[names[0]].o]+'.');}
  }
  if(S.atk){S.said=S.said||[{},{}];const key=[verbW,sCard||(sT&&sT.w)||'',adjW.slice().sort().join('+')].join('|'),k=S.said[who][key]||0;c.nov=k===0?2:k>=4?-2:k>=2?-1:0;S.said[who][key]=k+1;}
  if(climeW==null){const src=[];for(const a of adjW)if(ADJTAG[a])src.push({played:1,tags:[ADJTAG[a]]});if(cardVerb&&VERBTAG[cardVerb])src.push({played:1,tags:[VERBTAG[cardVerb]]});
    if(sCard&&W[sCard].t===NOUN)src.push({played:1,tags:tagsOf(W[sCard].props,null,sCard)});else if(sT)src.push({tags:tagsOf(sT.props,sT.st,sT.w,sT.forms)});else if(sen.subj&&sen.subj.k==='player')src.push({tags:['living']});
    if(oT)src.push({tags:tagsOf(oT.props,oT.st,oT.w,oT.forms)});else if(sen.obj&&sen.obj.k==='player'&&verbW&&!ATTACKV.includes(verbW))src.push({tags:['living']});
    const op=oppOf(src);if(op){const pk=S.things.some(t=>t.side===who&&t.w==='peacock');c.mult+=pk?2:1;say(S,'Opposites meet: '+OPPNAME[op[0]]+' and '+OPPNAME[op[1]]+'. It counts '+(pk?'three times, under the peacock\u2019s tail.':'double.'));S.oppF=S.oppF||[];if(who===0)S.oppF.push(op.join('+'));}}
  if(verbW&&upOf(S,who,verbW)>=2){c.ex=2;}
  if(verbW&&sT&&sT.props.includes('potent')){c.mult+=1;say(S,'It is potent: its work counts for more.');}
  {const L=S.log.slice(mark).map(l=>l.x),why=[];if(L.some(x=>/Alliteration/.test(x)))why.push(L.some(x=>/rune doubles/.test(x))?'alliteration, doubled by the rune':'alliteration');if(L.some(x=>/^Kin|kin to every/.test(x)))why.push('kin');if(L.some(x=>/exalted verb/.test(x)))why.push('exalted verb');if(L.some(x=>/potent/.test(x)))why.push('potent');if(L.some(x=>/^Opposites meet/.test(x)))why.push('opposites');c.why=why;S.cx=c;}
  if(c.mult>1)say(S,'The effect is multiplied by '+c.mult+'.');
  if(climeW){if(S.clime)S.players[S.clime.owner].discard.push(S.clime.w);S.clime={w:climeW,owner:who};say(S,Cap(climeW)+' settles over the board.');c.effect=true;
    climeArrive(S);if(adjW.length){S.clime.adjs=adjW.slice();const n=weatherAdj(S,S.things.slice());say(S,Cap(adjW.join(' '))+' '+climeW+': the word lies on everything the weather touches'+(n?', '+n+(n===1?' thing':' things')+' in all.':'.'));}}
  else if(verbW&&W[verbW].kind==='impersonal'){VERBF[verbW](S,who,[],[],c,false);}
  else{
    let subs;
    if(sCard&&W[sCard].t===NOUN&&W[sCard].props.includes('event')){EVENT[sCard](S,who,c);p.discard.push(sCard);subs=[];}
    else if(sCard&&W[sCard].t===NOUN){const d=W[sCard],sd=d.props.includes('burden')?1-who:who,t=addThing(S,sCard,sd,who,false);
      say(S,sd!==who?Cap(sCard)+' settles on '+nm(S,P(sd))+'.':(who===0?'You bring forth '+sCard+'.':(t.st.occult||S.sec?'The rival brings forth something unseen.':'The rival brings forth '+sCard+'.')));
      subs=[T(t)];c.effect=true;keeper=t;
      if(sd===who&&p.dross&&!isG(t)){const n=Math.min(4,p.dross);p.dross-=n;t.vig+=n;say(S,'It rises out of the black matter with '+n+' more vigour.');}
      if(S.clime&&S.clime.adjs&&weatherAdj(S,[t]))say(S,'The '+S.clime.adjs.join(' ')+' '+S.clime.w+' takes it too.');
      if(clime(S,'noon')&&t.props.includes('dark')){destroy(S,t,'light');subs=[];}}
    else if(sCard)subs=matchCat(S,sCard);
    else if(sT){subs=[T(sT)];keeper=sT;}
    else subs=[P(sen.subj.i)];
    if(sCard&&W[sCard].t===CAT&&!subs.length)say(S,'There are no '+sCard+' on the board.');
    c.ingr=adjW;
    if(verbW!=='enchant')for(const a of adjW)for(const e of subs.slice()){if(!alive(S,e)||e.k==='p'&&!['burning','frozen','sodden','torpid'].includes(a))continue;
      if(e.k==='t'&&e.t.st.fixed&&a!=='fixed'&&a!=='quick'){say(S,Cap(nm(S,e))+' is fixed and does not change.');continue;}
      if(ADJF[a](S,who,e,c))c.effect=true;
      if(upOf(S,who,a)>=2&&e.k==='t'&&alive(S,e)){e.t.vig+=2;say(S,'Exalted, the word gives 2 more vigour.');c.effect=true;}}
    const act=verbW;
    if(act){
      let objs=[];if(oCard){objs=matchCat(S,oCard);if(!objs.length)say(S,'There are no '+oCard+' on the board.');}else if(oT)objs=[T(oT)];else if(sen.obj)objs=[P(sen.obj.i)];
      const run=()=>VERBF[act](S,who,subs.filter(e=>alive(S,e)),objs.filter(e=>alive(S,e)),c,!!sen.obj);
      run();
      if(sen.kverb&&sT&&sT.side===who&&S.things.includes(sT)&&!(W[act].kind==='agent'||(W[act].kind==='both'&&!!sen.obj))){if(sT.st.quick)sT.st.quick=0;else sT.acted=true;}
      if(verbW&&p.echoNext){p.echoNext=false;say(S,'The echo repeats it.');for(const e of subs)if(e.k==='t'&&e.t.side===who)e.t.acted=false;run();}
    }
  }
  if(cardVerb){
    if(keeper&&keeper.side===who&&S.things.includes(keeper)&&W[cardVerb].kind!=='impersonal'&&c.effect&&!EVOLVE.includes(cardVerb)&&!keeper.verbs.includes(cardVerb)){
      keeper.verbs.push(cardVerb);if(keeper.verbs.length>((S.cfg&&S.cfg.maxVerbs)||2))keeper.verbs.shift();
      say(S,Cap(nm(S,T(keeper)))+' now knows how to '+cardVerb+'.');}
    p.discard.push(cardVerb);}
  if(S.log.length===mark&&!c.effect)say(S,'Nothing happens.');
  if(c.effect){
    for(const t of S.things)if(t.side===who&&t.props.includes('wordling'))t.vig++;
    if(p.earned<3){if(S.things.some(t=>t.side===who&&t.props.includes('rumour'))){if(!p.earned)say(S,'Rumour spoils the sale. No ink.');p.earned++;}else{p.coins++;p.earned++;}}}
  S.braveNow=false;settleS(S);checkOver(S);
  return{ok:true,effect:c.effect};
}

function startTurn(S,i){
  S.atk=false;S.cx=null;
  S.active=i;S.turn++;const p=S.players[i];
  say(S,(i===0?'Your turn':'The rival’s turn'),'t');
  for(const q of S.players)q.top=Math.max(q.top||0,q.life);
  p.ink=S.cfg.ink;p.earned=0;p.echoed=false;p.echoNext=false;p.coins+=1;p.braved=false;S.braveNow=false;
  if(p.ordeal){if(p.life>0){p.life=Math.min(LIFE,p.ordeal+10);say(S,(i===0?'You come':'The rival comes')+' through the ordeal, and '+(i===0?'stand':'stands')+' at '+p.life+' life.');}p.ordeal=0;}
  if(p.fell){const w=p.fell;p.fell=null;if(W[w]&&side(S,i).some(t=>t.props.includes('abyss'))&&!full(S,i,w)){addThing(S,w,i,i,false);say(S,Cap(w)+' climbs back out of the abyss.');}else if(W[w])p.discard.push(w);}
  if(p.asleep){p.ink=Math.floor(S.cfg.ink/2);p.asleep=0;p.rested=2;say(S,Cap(nm(S,P(i)))+' '+vb(P(i),'wake','wakes')+' slowly, with half breath.');}
  if(p.dazed){p.ink=Math.max(1,p.ink-p.dazed);p.dazed=0;say(S,Cap(nm(S,P(i)))+' '+vb(P(i),'have','has')+' only '+p.ink+' breath this turn.');}
  if(p.poisoned>0){p.poisoned--;say(S,'The poison works.');damage(S,P(i),2,'poison');}
  p.sodden=0;
  climeTick(S,i);
  {const nb=side(S,i).filter(t=>t.st.burning).length;if(nb){say(S,'Smoke from '+nb+(nb===1?' burning thing':' burning things')+' chokes '+nm(S,P(i))+'.');damage(S,P(i),nb*2,'smoke');}}
  {const mine=side(S,i),hs=p=>mine.some(t=>t.props.includes(p)),alive=t=>t.props.includes('living'),body=t=>!isG(t)&&!alive(t)&&!ghost(t);
   if(hs('foundry')){const l=mine.filter(body);if(l.length){say(S,'The foundry works. Everything '+(i===0?'of yours':'of the rival’s')+' that is not alive gains 1.');for(const t of l)t.vig+=1;}}
   if(hs('pestilence')){const l=mine.filter(t=>alive(t)&&!isG(t)&&!t.props.includes('sacred'));if(l.length){say(S,'Pestilence. Every living thing on '+(i===0?'your':'the rival’s')+' side sickens.');for(const t of l)if(S.things.includes(t))damage(S,T(t),1,'blight');}}
   if(hs('erosion')){const l=mine.filter(body);if(l.length){say(S,'Erosion wears at everything on '+(i===0?'your':'the rival’s')+' side that is not alive.');for(const t of l)if(S.things.includes(t))damage(S,T(t),1,'erosion');}}}
  if(S.things.some(t=>t.props.includes('hunger')))for(const t of side(S,i))if(t.props.includes('beast')&&S.things.includes(t)){say(S,Cap(nm(S,T(t)))+' goes hungry.');damage(S,T(t),1,'hunger');}
  if(S.things.some(t=>t.props.includes('time'))){const old=side(S,i).filter(t=>!ghost(t)).sort((a,b)=>b.vig-a.vig)[0];if(old){say(S,'Time wears at '+nm(S,T(old))+'.');damage(S,T(old),1,'time');}}
  for(const t of side(S,i)){
    if(!S.things.includes(t))continue;t.acted=false;nature(S,i,t);if(!S.things.includes(t))continue;const pr=t.props;if(pr.includes('swift'))t.st.quick=1;
    if(pr.includes('pyro')&&!t.st.burning&&!t.st.sodden&&!t.st.frozen&&!t.st.fixed){t.st.burning=1;t.st.occult=0;say(S,Cap(nm(S,T(t)))+' takes fire in the open air.');}
    if(t.st.burning){
      const nb=S.things.find(x=>x.side===i&&x!==t&&x.props.includes('flammable')&&!x.st.burning&&!x.st.sodden&&!x.st.frozen&&!x.st.fixed);
      if(nb){say(S,'The fire spreads.');heat(S,T(nb),1);}
      if(S.things.includes(t))damage(S,T(t),3+(clime(S,'drought')?1:0),'fire');
      if(!S.things.includes(t))continue;}
    if(t.st.poisoned){damage(S,T(t),2,'poison');if(!S.things.includes(t))continue;}
    if(pr.includes('hoard'))p.coins++;
    if(pr.includes('tower')){p.coins++;const l=side(S,1-i).filter(x=>!isG(x));if(l.length){say(S,'The tower is seen from across the field. Everything opposite gains 1.');for(const x of l)x.vig++;}}
    if(pr.includes('attractor')){const isA=w=>ATTACKV.includes(w),isN=w=>W[w].t===NOUN&&!W[w].props.includes('event')&&!W[w].props.includes('spell')&&!W[w].props.includes('ground'),pool=p.deck.concat(p.discard),best=l=>l.slice().sort((a,b)=>tierOf(b)-tierOf(a)||(W[b].vig||0)-(W[a].vig||0))[0];
      const w=!p.hand.some(isA)?pool.find(isA):!p.hand.some(isN)?best(pool.filter(isN)):best(pool);if(w){let k=p.deck.indexOf(w);if(k>=0)p.deck.splice(k,1);else p.discard.splice(p.discard.indexOf(w),1);p.hand.push(w);say(S,i===0?'The attractor draws \u201c'+w+'\u201d to your hand.':'The attractor draws a word to the rival\u2019s hand.');}}
    if(pr.includes('inkwell'))p.ink++;
    if(pr.includes('debt')){const nmx='Debt';if(p.coins>0){p.coins--;say(S,nmx+' takes 1 ink from '+nm(S,P(i))+'.');}else{say(S,nmx+' takes its due in blood.');damage(S,P(i),1,'debt');}}
    if(pr.includes('plague')){const v=side(S,i).find(x=>x.props.includes('living')&&!x.props.includes('sacred')&&!x.st.poisoned&&!x.st.fixed);say(S,'The plague spreads.');if(v)poison(S,T(v),1);else poison(S,P(i),1);}
    if(pr.includes('lichen')&&S.things.some(x=>x.props.includes('stone'))){t.vig++;}
    if(pr.includes('parasite')){const h=S.things.find(x=>x.props.includes('wood'));if(h){t.vig++;say(S,Cap(nm(S,T(t)))+' feeds on '+nm(S,T(h))+'.');damage(S,T(h),1,'drained');}}
    if(pr.includes('magnet')&&!inert(t)){const m=S.things.find(x=>x.side!==i&&x.props.includes('metal')&&!x.st.fixed);if(m&&!full(S,i)){say(S,Cap(nm(S,T(t)))+' drags '+nm(S,T(m))+' across.');m.side=i;m.st.guarding=0;}}
    if(pr.includes('egg')){t.st.age=(t.st.age||0)+1;if(t.st.age>=2){const pool=rnd(S)<.3?HATCHR:HATCH,hw=pool[Math.floor(rnd(S)*pool.length)];become(S,t,hw);t.vig=W[hw].vig+3;say(S,'The egg hatches. Out comes '+('aeiou'.includes(hw[0])?'an ':'a ')+hw+', strong from the shell, with '+t.vig+' vigour.');}}
    if(pr.includes('keen')&&!t.st.asleep)reveal(S,1-i);
    if(pr.includes('moth')){if(S.things.some(x=>x.st.burning)){destroy(S,t,'flame');continue;}
      const there=S.things.some(x=>x.side!==i&&x.props.includes('bright')),here=S.things.some(x=>x.side===i&&x.props.includes('bright'));
      if(there&&!here&&!full(S,1-i)){say(S,Cap(nm(S,T(t)))+' leaves for the brighter light.');t.side=1-i;}}
  }
  settleS(S);draw(S,i);checkOver(S);
}
function endTurn(S,i,dump){
  S.atk=false;S.cx=null;
  const p=S.players[i];if(p.rested>0)p.rested--;p.ban=null;p.gnosis=0;
  if(dump){p.discard.push(...p.hand);p.hand=[];}
  for(const t of side(S,i)){
    if(t.st.rested>0)t.st.rested--;
    if(t.st.asleep>0){t.st.asleep--;if(!t.st.asleep)t.st.rested=1;}
    t.st.quick=0;if(t.st.frozen>0)t.st.frozen--;if(t.st.bound>0){t.st.bound--;if(!t.st.bound)t.mired=1;}if(t.st.blind>0)t.st.blind--;
    if(t.st.volatile){S.things.splice(S.things.indexOf(t),1);dropVerbs(S,t);if(!t.token)S.players[t.owner].hand.push(t.card);say(S,Cap(nm(S,T(t)))+' evaporates'+(t.token?'.':' back to hand.'));}
  }
}
function buy(S,i,k,toHand){const w=S.shop[k],p=S.players[i];if(!w||p.coins<price(w))return false;p.coins-=price(w);(toHand?p.hand:p.discard).push(w);S.shop.splice(k,1);refillShop(S);say(S,(i===0?'You buy ':'The rival buys ')+w+'.');return true;}
function refresh(S,i){const p=S.players[i];if(p.coins<1||!S.supply.length)return false;p.coins--;S.supply.push(...S.shop);S.shop=[];refillShop(S);say(S,(i===0?'You pay':'The rival pays')+' 1 ink for fresh stock.');return true;}

/* ---- defending: when a player is attacked, they may put one of their things in the way ---- */
const BLOCKABLE=['strike','bite','crush','cut','burn','dissolve'];
function attackerOf(S,who,sen){const s=sen.subj;if(!s)return null;if(s.k==='thing'){const t=findThing(S,s.id);return t?{props:t.props,st:t.st,verb:sen.kverb||(sen.verb!=null?S.players[who].hand[sen.verb]:null)}:null;}
  if(s.k==='card'){const d=W[S.players[who].hand[s.i]];return d?{props:d.props||[],st:{},verb:sen.kverb||(sen.verb!=null?S.players[who].hand[sen.verb]:null)}:null;}return null;}
function eligibleDef(S,ds,att){const fly=att&&(att.props.includes('bird')||att.props.includes('flying'))&&!att.st.sodden&&!att.st.grounded;
  return side(S,ds).filter(t=>takes(t,att&&att.verb)&&!inert(t)&&!ghost(t)&&(!fly||flies(t)));}
function needsDefence(S,who,sen){
  if(!sen.obj||sen.obj.k!=='player'||sen.obj.i===who||sen.clime!=null)return false;if(brave(S,who)||S.players[who].gnosis)return false;
  const vw=sen.kverb||(sen.verb!=null?S.players[who].hand[sen.verb]:null);if(!vw||!BLOCKABLE.includes(vw))return false;
  if(!validate(S,who,sen).ok)return false;
  const att=attackerOf(S,who,sen);if(!att||att.st.occult||att.props.includes('stealth')||(att.props.includes('spirit')&&!att.props.includes('allthings')))return false;
  const fly=(att.props.includes('bird')||att.props.includes('flying'))&&!att.st.sodden&&!att.st.grounded;
  if(S.things.some(t=>t.side===1-who&&t.st.guarding&&takes(t,vw)&&!inert(t)&&(!fly||flies(t))))return false;
  return eligibleDef(S,1-who,att).length>0;
}
function botDefend(S,ds,who,sen){
  let best=null,bv=-Infinity;
  for(const id of [null,...eligibleDef(S,ds,attackerOf(S,who,sen)).map(t=>t.id)]){const C=JSON.parse(JSON.stringify(S));C.quiet=true;const r=resolve(C,who,Object.assign({},sen,{def:id}));if(!r.ok)continue;const v=evalState(C,ds);if(v>bv){bv=v;best=id;}}
  return best;
}
/* ---- computer opponent: tries every sentence it could say and keeps the best ---- */
function evalState(S,me){
  if(S.over!=null)return S.over===me?1e4:S.over===2?0:-1e4;
  const a=S.players[me],b=S.players[1-me];let v=(insight(S,me)-insight(S,1-me))*5+(a.life-b.life)*4+a.coins*0.3-b.coins*0.3-(a.asleep?4:0)+(b.asleep?4:0)-a.poisoned+b.poisoned-a.dazed*1.2+b.dazed*1.2+(a.ordeal?(Math.min(LIFE,a.ordeal+10)-a.life)*3.2:0)-(b.ordeal?(Math.min(LIFE,b.ordeal+10)-b.life)*3.2:0)+(b.ban?2:0)-(a.ban?2:0)+(a.gnosis?1.5:0)+((S.clime&&S.clime.w==='flux')?0.4*(S.things.filter(t=>t.side===me&&(t.st.burning||t.st.poisoned||t.st.frozen||t.st.bound||t.st.blind)).length-S.things.filter(t=>t.side!==me&&(t.st.burning||t.st.poisoned||t.st.frozen||t.st.bound||t.st.blind)).length):0)+a.hand.length*0.2;
  for(const t of S.things){const pr=t.props;let x=t.vig+2+climeDv(S,t)*3+(clime(S,'harvest')&&pr.includes('plant')?0.5:0)+(t.verbs?t.verbs.length*1.5:0)+(t.forms?t.forms.length*1.5:0)+(t.st.guarding?1:0)+(pr.includes('beast')&&!W[t.w].props.includes('beast')?1.2:0)+(t.st.occult?0.5:0)-(t.st.burning?2.5:0)-(t.st.poisoned?1:0)-(inert(t)?1.5:0)-(t.st.stone?2:0)-(t.st.volatile?2:0);
    if(pr.includes('hoard')||pr.includes('inkwell')||pr.includes('scribe')||pr.includes('muse')||pr.includes('nemesis')||pr.includes('swift')||pr.includes('stealth'))x+=2.5;
    if(pr.includes('resonant'))x+=S.things.filter(o=>o!==t&&o.w===t.w&&o.side!==t.side).length*2-S.things.filter(o=>o!==t&&o.w===t.w&&o.side===t.side).length*2;if(t.st.masked)x+=1.5;if(t.st.measured)x-=3;if(pr.includes('attractor')||pr.includes('orrery')||pr.includes('abyss')||pr.includes('tower')||pr.includes('seer')||pr.includes('catalyst'))x+=2.5;
    if(pr.includes('burden'))x=-3.5;if(t.w==='ash')x=0.3;if(pr.includes('egg'))x=3;v+=t.side===me?x:-x;}
  return v;
}
function candidates(S,who){
  const hand=S.players[who].hand,out=[],by=t=>hand.map((w,i)=>W[w].t===t?i:-1).filter(i=>i>=0);
  const nouns=by(NOUN),cats=by(CAT),verbs=by(VERB),adjs=by(ADJ),climes=by(CLIME);
  const seen=S.things.filter(t=>visible(t,who));
  const subjAll=[...nouns.map(i=>({k:'card',i})),...cats.map(i=>({k:'card',i})),...seen.map(t=>({k:'thing',id:t.id})),{k:'player',i:0},{k:'player',i:1}];
  const objAll=[...cats.map(i=>({k:'card',i})),...seen.map(t=>({k:'thing',id:t.id})),{k:'player',i:0},{k:'player',i:1}];
  for(const i of climes)out.push({clime:i});
  for(const t of seen)if(t.side===who&&!t.acted)for(const kv of t.verbs||[]){const d=W[kv],s={k:'thing',id:t.id};if(d.obj!=='req')out.push({subj:s,kverb:kv});if(d.obj!=='none')for(const o of objAll)out.push({subj:s,kverb:kv,obj:o});}
  for(const vI of verbs)if(hand[vI]==='fuse'){const ops=[...nouns.map(i=>({k:'card',i})),...seen.filter(t=>t.side===who).map(t=>({k:'thing',id:t.id}))],all=ops.concat(seen.filter(t=>t.side!==who).map(t=>({k:'thing',id:t.id})));
    for(const a of ops)for(const b of all){if(a===b)continue;const x=rxWord(S,who,a),y=rxWord(S,who,b);if(x&&y&&rxOf(x,y))out.push({subj:a,verb:vI,obj:b});}}
  for(const n of nouns){out.push({subj:{k:'card',i:n}});for(const a of adjs)out.push({adjs:[a],subj:{k:'card',i:n}});}
  for(const vI of verbs)if(hand[vI]==='enchant')for(const a of adjs){for(const t of seen)if(t.side===who)out.push({adjs:[a],subj:{k:'thing',id:t.id},verb:vI});for(const n of nouns)out.push({adjs:[a],subj:{k:'card',i:n},verb:vI});}
  for(const a of adjs){for(const t of seen)out.push({adjs:[a],subj:{k:'thing',id:t.id}});for(const cI of cats)out.push({adjs:[a],subj:{k:'card',i:cI}});}
  for(const vI of verbs){const d=W[hand[vI]];
    if(d.kind==='impersonal'){out.push({verb:vI});continue;}
    for(const s of subjAll){
      if(d.obj!=='req')out.push({subj:s,verb:vI});
      if(d.obj!=='none')for(const o of objAll){if(o.k==='card'&&s.k==='card'&&o.i===s.i)continue;out.push({subj:s,verb:vI,obj:o});}}}
  {const mineS=[...nouns.map(i=>({k:'card',i})),...seen.filter(t=>t.side===who&&!t.acted).map(t=>({k:'thing',id:t.id}))],foe={k:'player',i:1-who},foeT=seen.filter(t=>t.side!==who).map(t=>({k:'thing',id:t.id}));
   for(const vI of verbs)if(ATTACKV.includes(hand[vI]))for(const sb of mineS){for(const a of adjs){out.push({adjs:[a],subj:sb,verb:vI,obj:foe});for(const o of foeT.slice(0,3))out.push({adjs:[a],subj:sb,verb:vI,obj:o});for(const a2 of adjs)if(a2>a)out.push({adjs:[a,a2],subj:sb,verb:vI,obj:foe});}}
   for(const a of adjs)for(const a2 of adjs)if(a2>a){for(const n of nouns)out.push({adjs:[a,a2],subj:{k:'card',i:n}});for(const t of seen)if(t.side===who)out.push({adjs:[a,a2],subj:{k:'thing',id:t.id}});}}
  return out.filter(s=>validate(S,who,s).ok);
}
function botChoose(S,who){
  const base=evalState(S,who);let best=null,gain=0.25;
  for(const sen of candidates(S,who)){{const vw=sen.kverb||(sen.verb!=null?S.players[who].hand[sen.verb]:null),o=sen.obj;if(vw&&ATTACKV.includes(vw)&&o){if(o.k==='player'&&o.i===who)continue;if(o.k==='thing'){const ot=findThing(S,o.id);if(ot&&ot.side===who)continue;}}}if(needsDefence(S,who,sen))sen.def=botDefend(S,1-who,who,sen);const C=JSON.parse(JSON.stringify(S));C.quiet=true;const r=resolve(C,who,sen);if(!r.ok)continue;
    const g=evalState(C,who)-base-0.05*validate(S,who,sen).cost+rnd(S)*0.2;if(g>gain){gain=g;best=sen;}}
  return best;
}
function botShop(S,who){for(let n=0;n<2;n++){let k=-1;S.shop.forEach((w,i)=>{if(price(w)<=S.players[who].coins&&(k<0||price(w)>price(S.shop[k])))k=i;});if(k<0)return;buy(S,who,k);}}
if(typeof module!=='undefined')module.exports={OPP,OPPNAME,tagsOf,brave,RIVAL0,SPELLW,MAXSPELL,SPELLTURNS,GROUNDW,MAXGROUND,insight,INSIGHT,RUIN,NEED,RX,rxOf,rxWord,FORM,EVOLVE,EVENT,ATTACKV,CURSE,costOf,upOf,tierOf,goldPrice,TIER3,TIER4,climeDv,climeTick,needsDefence,botDefend,eligibleDef,attackerOf,W,ORIGIN,BASE,ALLWORDS,STARTER,abilities,newGame,resolve,validate,candidates,botChoose,botShop,startTurn,endTurn,evalState,describe,buy,refresh,price,matchCat};
