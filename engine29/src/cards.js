// V29 "The Grammar" — prototype card registry (subset for stages A–E).
// Stats and rules follow spec §8. Only effects listed here are implemented;
// anything else in the spec is disabled for this stage, never approximated.
'use strict';

// p = properties, cap = capabilities, kw = keywords
const T = (id, school, cost, strike, stand, p, extra = {}) =>
  ({ id, school, type: 'thing', cost, strike, stand, props: p, deckLegal: true, ...extra });
const A = (id, school, cost, extra) => ({ id, school, type: 'action', cost, deckLegal: true, ...extra });
const S = (id, school, cost, extra) => ({ id, school, type: 'spell', cost, deckLegal: true, ...extra });
const G = (id, school, cost, stand, extra) => ({ id, school, type: 'ground', cost, stand, deckLegal: true, ...extra });
const Q = (id, school, cost, qual, extra) => ({ id, school, type: 'quality', cost, qual, deckLegal: true, ...extra });
const W = (id, school, cost, extra) => ({ id, school, type: 'weather', cost, deckLegal: true, ...extra });
const B = (id, school, cost, extra) => ({ id, school, type: 'burden', cost, deckLegal: true, ...extra });
const C = (id, school, cost, category) => ({ id, school, type: 'category', cost, category, deckLegal: true });


const CARDS = [
  // Fire
  T('fire.ember', 'fire', 1, 1, 2, ['hot', 'body']),
  T('fire.salamander', 'fire', 2, 2, 3, ['living', 'beast', 'body', 'hot', 'flammable'], { cap: ['bite'], igniteOnHit: true }),
  T('fire.firebird', 'fire', 3, 2, 2, ['living', 'beast', 'bird', 'winged', 'body', 'hot', 'flammable'], { kw: ['flying', 'swift'], igniteOnHit: true }),
  T('fire.smith', 'fire', 3, 3, 3, ['living', 'person', 'body', 'flammable'], { cap: ['crush', 'burn'] }),
  G('fire.torch', 'fire', 1, 2, { upkeep: 'torch' }),
  A('fire.burn', 'fire', 1, { verb: 'burn', remote: true }),
  A('fire.scorch', 'fire', 2, { verb: 'scorch', remote: true, dmg: 2 }),
  S('fire.kindle', 'fire', 1, { spell: 'kindle', r: true }),
  G('fire.fire', 'fire', 2, 3, { upkeep: 'fireGround', reagent: 'fire' }),
  S('fire.calcine', 'fire', 2, { spell: 'calcine', sacrifice: true }),
  G('fire.bellows', 'fire', 2, 3, { upkeep: 'bellows' }),
  T('fire.naphtha', 'fire', 2, 0, 3, ['liquid', 'flammable'], { naphtha: true }),
  S('fire.wildfire', 'fire', 4, { spell: 'wildfire' }),
  W('fire.drought', 'fire', 2, { weather: 'drought' }),
  Q('fire.firebrand', 'fire', 1, { props: ['hot'], firebrand: true }, { lawful: true }),
  // Air
  T('air.owl', 'air', 2, 2, 2, ['living', 'beast', 'bird', 'winged', 'sharp', 'body', 'flammable'], { kw: ['flying'], revealOnArrive: true }),
  T('air.hawk', 'air', 3, 3, 3, ['living', 'beast', 'bird', 'winged', 'sharp', 'body', 'flammable'], { kw: ['flying'] }),
  T('air.swallow', 'air', 1, 1, 1, ['living', 'beast', 'bird', 'winged', 'body', 'flammable'], { kw: ['flying', 'swift'] }),
  T('air.crow', 'air', 2, 1, 3, ['living', 'beast', 'bird', 'winged', 'body', 'flammable'], { kw: ['flying'], crowMight: true }),
  T('air.wind', 'air', 2, 1, 3, ['body'], { kw: ['flying'], cap: ['blow'] }), // wingless flight
  T('air.magpie', 'air', 2, 1, 2, ['living', 'beast', 'bird', 'winged', 'body', 'flammable'], { kw: ['flying'], magpie: true }),
  T('air.herald', 'air', 2, 1, 3, ['living', 'person', 'body', 'flammable'], { onArrive: 'herald' }),
  G('air.air', 'air', 2, 3, { upkeep: 'reorder2' }),
  G('air.orrery', 'air', 3, 4, { static: 'orrery' }),
  Q('air.winged', 'air', 1, { props: ['winged'], kw: ['flying'], cap: ['blow'], notHeavy: true }, { lawful: true }),
  Q('air.quick', 'air', 2, { kw: ['quick'] }),
  Q('air.resonant', 'air', 2, { resonant: true }, { anyTarget: true }),
  A('air.blow', 'air', 2, { verb: 'blow', remote: true }),
  W('air.storm', 'air', 3, { weather: 'storm' }),
  S('air.squall', 'air', 4, { spell: 'squall' }),
  C('air.birds', 'air', 1, 'bird'),
  S('air.gasp', 'air', 1, { spell: 'gasp' }),
  S('air.gust', 'air', 2, { spell: 'gust', r: true }),
  // Earth
  T('earth.boulder', 'earth', 3, 2, 6, ['stone', 'body'], { kw: ['heavy', 'guard', 'bedrock'] }),
  T('earth.stone', 'earth', 2, 1, 4, ['stone', 'body'], { kw: ['heavy'] }),
  T('earth.lead', 'earth', 1, 1, 3, ['metal', 'body'], { kw: ['heavy'], ladder: 'metal' }),
  T('earth.tin', 'earth', 2, 1, 3, ['metal', 'body'], { ladder: 'metal' }),
  T('earth.copper', 'earth', 2, 2, 2, ['metal', 'body'], { ladder: 'metal' }),
  T('earth.silver', 'earth', 3, 2, 4, ['metal', 'body'], { kw: ['sacred'], ladder: 'metal' }),
  T('earth.gold', 'earth', 4, 2, 4, ['metal', 'body'], { kw: ['incorruptible'], ladder: 'metal', deckLegal: false, ladderOnly: true, upkeep: 'gold' }),
  T('earth.clay', 'earth', 1, 0, 3, ['clay']),
  S('earth.transmute', 'earth', 2, { spell: 'transmute' }),
  G('earth.crucible', 'earth', 2, 4, { fusionDiscount: 1 }),
  G('earth.earth', 'earth', 2, 3, { upkeep: 'earthGround' }),
  G('earth.salt', 'earth', 1, 2, { static: 'salt' }),
  T('earth.amber', 'earth', 2, 0, 3, ['material'], { amber: true }),
  Q('earth.temper', 'earth', 2, { stand: 2, rustImmune: true, brittleImmune: true, needsProp: 'metal' }),
  Q('earth.leaden', 'earth', 1, { kw: ['heavy'], stand: 1, kwRemove: ['flying'] }, { lawful: true, anyTarget: true }),
  Q('earth.fixed', 'earth', 2, { kw: ['fixed'] }),
  W('earth.desert', 'earth', 2, { weather: 'desert' }),
  W('earth.winter', 'earth', 2, { weather: 'winter' }),
  C('earth.metals', 'earth', 1, 'metal'),
  T('earth.iron', 'earth', 2, 2, 4, ['metal', 'body'], { kw: ['heavy'] }),
  T('earth.flint', 'earth', 1, 2, 1, ['stone', 'sharp', 'body'], { cap: ['burn'] }),
  G('earth.tower', 'earth', 3, 5, { static: 'heavyReach' }),
  S('earth.guard', 'earth', 1, { spell: 'guard', r: true }),
  A('earth.crush', 'earth', 2, { verb: 'crush', bonus: 2 }),
  A('earth.cut', 'earth', 1, { verb: 'cut', bonus: 1 }),
  // Life
  T('life.wolf', 'life', 2, 2, 3, ['living', 'beast', 'body', 'flammable'], { cap: ['bite'], packBonus: true }),
  T('life.stag', 'life', 3, 3, 4, ['living', 'beast', 'body', 'sharp', 'flammable']),
  T('life.hare', 'life', 1, 1, 2, ['living', 'beast', 'body', 'flammable'], { kw: ['swift'] }),
  T('life.bramble', 'life', 2, 1, 4, ['living', 'plant', 'body', 'flammable'], { kw: ['reach'], cap: ['bind', 'sting'], stingBind: true }),
  T('life.aloe', 'life', 2, 0, 3, ['living', 'plant', 'herb'], { cap: ['mend'], upkeep: 'aloe' }),
  T('life.apothecary', 'life', 3, 2, 3, ['living', 'person', 'body', 'flammable'], { cap: ['mend'], ability: { id: 'tend', cost: 1 } }),
  A('life.bite', 'life', 1, { verb: 'bite', bonus: 1 }),
  A('life.mend', 'life', 1, { verb: 'mend', remote: true, r: true }),
  T('life.seed', 'life', 1, 0, 2, ['living', 'plant', 'flammable'], { ladder: 'plant' }),
  T('life.sapling', 'life', 2, 1, 3, ['living', 'plant', 'tree', 'body', 'flammable'], { ladder: 'plant' }),
  T('life.oak', 'life', 4, 3, 6, ['living', 'plant', 'tree', 'body', 'flammable'], { kw: ['heavy'] }),
  T('life.willow', 'life', 3, 1, 5, ['living', 'plant', 'tree', 'herb', 'body', 'flammable'], { cap: ['mend'], ability: { id: 'heal2', cost: 1 } }),
  S('life.grow', 'life', 1, { spell: 'grow' }),
  T('life.scarab', 'life', 2, 1, 2, ['living', 'beast', 'insect', 'body'], { kw: ['sacred', 'recurrent'] }),
  T('life.pear', 'life', 2, 1, 3, ['living', 'plant', 'tree', 'orchard', 'flower', 'body', 'flammable'], { pear: true }),
  T('life.rose', 'life', 2, 1, 3, ['living', 'plant', 'flower', 'body', 'flammable'], { kw: ['reach'], cap: ['sting'], onArrive: 'rose' }),
  T('life.saffron', 'life', 2, 0, 2, ['living', 'plant', 'flower', 'herb'], { saffron: true }),
  T('life.ivy', 'life', 2, 1, 3, ['living', 'plant', 'body', 'flammable'], { kw: ['reach'], cap: ['bind'] }),
  S('life.graft', 'life', 2, { spell: 'graft' }),
  S('life.abundance', 'life', 3, { spell: 'abundance' }),
  W('life.spring', 'life', 2, { weather: 'spring' }),
  W('life.harvest', 'life', 2, { weather: 'harvest' }),
  A('life.bind', 'life', 1, { verb: 'bind', r: true }),
  S('life.tame', 'life', 3, { spell: 'tame' }),
  Q('life.thorny', 'life', 1, { kw: ['reach'], cap: ['sting'] }, { lawful: true }),
  Q('life.feral', 'life', 1, { strike: 1, cap: ['bite'] }, { lawful: true }),
  C('life.beasts', 'life', 1, 'beast'),
  C('life.plants', 'life', 1, 'plant'),
  // Water
  T('water.eel', 'water', 1, 1, 2, ['living', 'beast', 'seaborn', 'body']),
  T('water.otter', 'water', 2, 2, 3, ['living', 'beast', 'seaborn', 'body', 'flammable'], { kw: ['swift'], cap: ['bite'] }),
  T('water.pike', 'water', 3, 3, 4, ['living', 'beast', 'seaborn', 'body'], { cap: ['bite'] }),
  T('water.ice', 'water', 2, 0, 4, [], { kw: ['heavy', 'guard'], wetAttacker: true }),
  A('water.seep', 'water', 1, { verb: 'seep', remote: true, dmg: 2 }),
  S('water.tonic', 'water', 2, { spell: 'tonic', potion: true }),
  G('water.water', 'water', 2, 3, { upkeep: 'waterGround', reagent: 'water' }),
  G('water.flask', 'water', 1, 2, { potionBonus: true }),
  T('water.vitriol', 'water', 2, 1, 3, ['liquid', 'body'], { cap: ['dissolve'], ability: { id: 'etch', cost: 2 } }),
  T('water.quicksilver', 'water', 1, 0, 2, ['liquid', 'metal'], { kw: ['incorruptible'] }),
  A('water.wash', 'water', 2, { verb: 'wash', remote: true }),
  S('water.memory', 'water', 2, { spell: 'memory', seal: true }),
  W('water.rain', 'water', 2, { weather: 'rain' }),
  S('water.tide', 'water', 4, { spell: 'tide' }),
  A('water.dissolve', 'water', 2, { verb: 'dissolve', remote: true }),
  S('water.dew', 'water', 1, { spell: 'dew', r: true }),
  A('water.drench', 'water', 1, { verb: 'drench', remote: true, r: true }),
  S('water.frozen', 'water', 2, { spell: 'frozen', r: true }),
  S('water.thaw', 'water', 1, { spell: 'thaw', r: true }),
  S('water.sleep', 'water', 2, { spell: 'sleep', r: true }),
  // Rot
  T('rot.rat', 'rot', 1, 1, 2, ['living', 'beast', 'body', 'flammable'], { onDeath: 'poison1' }),
  T('rot.adder', 'rot', 2, 2, 2, ['living', 'beast', 'serpent', 'body'], { kw: ['venomous'], cap: ['bite'] }),
  T('rot.spider', 'rot', 2, 2, 2, ['living', 'beast', 'body'], { kw: ['venomous'], cap: ['bite', 'bind'] }),
  T('rot.leech', 'rot', 2, 1, 3, ['living', 'beast', 'seaborn', 'body'], { cap: ['bite'], leech: true }),
  T('rot.yew', 'rot', 3, 1, 4, ['living', 'plant', 'tree', 'toxic', 'body', 'flammable'], { onDeath: 'poison1' }),
  T('rot.wormwood', 'rot', 2, 0, 3, ['living', 'plant', 'herb', 'toxic'], { upkeep: 'wormwood' }),
  A('rot.poison', 'rot', 1, { verb: 'poison', remote: true }),
  G('rot.barrow', 'rot', 2, 3, { carrionOnDeath: true }),
  T('rot.spore', 'rot', 1, 0, 1, ['living', 'fungus'], { kw: ['flying'], onDeath: 'poison1' }),
  T('rot.toadstool', 'rot', 1, 0, 2, ['living', 'fungus', 'toxic'], { onSacrifice: 'poison1' }),
  T('rot.ghost', 'rot', 3, 2, 3, ['spirit', 'dark', 'body'], { kw: ['flying'], cap: ['haunt'] }),
  T('rot.shadow', 'rot', 2, 1, 2, ['spirit', 'dark', 'body'], { cap: ['haunt'], onArrive: 'concealed' }),
  S('rot.decay', 'rot', 2, { spell: 'decay', sacrifice: true }),
  S('rot.rust', 'rot', 2, { spell: 'rust' }),
  S('rot.wither', 'rot', 2, { spell: 'wither' }),
  A('rot.haunt', 'rot', 2, { verb: 'haunt', remote: true }),
  S('rot.exhume', 'rot', 3, { spell: 'exhume', seal: true }),
  S('rot.miasma', 'rot', 3, { spell: 'miasma' }),
  W('rot.night', 'rot', 2, { weather: 'night' }),
  Q('rot.venomous', 'rot', 2, { kw: ['venomous'] }, { lawful: true, anyTarget: true }),
  B('rot.debt', 'rot', 2, { burden: 'debt' }),
  Q('rot.feeble', 'rot', 1, { strike: -1 }, { enemyTarget: true }),
  // The Word
  T('word.word', 'word', 1, 0, 3, ['body'], { mightOnSentence: true }),
  T('word.familiar', 'word', 2, 1, 2, ['living', 'beast', 'body', 'flammable'], { fusionDiscount: 1 }),
  S('word.separate', 'word', 2, { spell: 'separate' }),
  T('word.scribe', 'word', 2, 1, 3, ['living', 'person', 'body', 'speaker', 'flammable'], { onArrive: 'reorder2' }),
  T('word.bard', 'word', 3, 2, 3, ['living', 'person', 'body', 'speaker', 'flammable'], { bard: true }),
  T('word.hermit', 'word', 2, 1, 3, ['living', 'person', 'body', 'speaker', 'flammable'], { onArrive: 'concealed' }),
  G('word.grimoire', 'word', 2, 2, { onArrive: 'draw1', upkeep: 'reorder2' }),
  G('word.ink', 'word', 2, 3, { upkeep: 'ink' }),
  S('word.omen', 'word', 1, { spell: 'omen' }),
  S('word.name', 'word', 1, { spell: 'name' }),
  S('word.measure', 'word', 2, { spell: 'measure' }),
  S('word.dispel', 'word', 2, { spell: 'dispel', r: true }),
  S('word.echo', 'word', 2, { spell: 'echo', seal: true }),
  S('word.silence', 'word', 3, { spell: 'silence' }),
  S('word.scream', 'word', 2, { spell: 'scream', voiced: true }),
  S('word.reckoning', 'word', 4, { spell: 'reckoning' }),
  S('word.be', 'word', 2, { spell: 'be', lawOnly: true }),
  S('word.awaken', 'word', 2, { spell: 'awaken' }),
  S('word.summon', 'word', 4, { spell: 'summon' }),
  S('word.loan', 'word', 1, { spell: 'loan' }),
  S('word.gnosis', 'word', 3, { spell: 'gnosis' }),
  S('word.protect', 'word', 1, { spell: 'protect', r: true }),
  S('word.doubt', 'word', 2, { spell: 'doubt', r: true }),
];

// Tokens (§5.13): generated Things, never cards, never market offers
const TK = (id, school, strike, stand, props, extra = {}) => ({ id, school, type: 'thing', cost: 0, strike, stand, props, token: true, deckLegal: false, market: false, ...extra });
const TOKENS = [
  TK('token.ash', 'fire', 0, 1, ['material']),
  TK('token.fruit', 'life', 0, 1, ['food'], { ability: { id: 'eatFruit', cost: 1, sacrificeSelf: true } }),
  TK('token.blossom', 'life', 0, 1, ['living', 'plant', 'flower']),
  TK('token.carrion', 'rot', 0, 2, ['organic']),
];

// Made-only forms of the named recipes (§9). `schools` = recorded affiliations for catalyst checks.
const MD = (id, schools, strike, stand, props, extra = {}) => ({ id, school: schools[0], schools, type: 'thing', cost: 0, strike, stand, props, made: true, deckLegal: false, market: false, ...extra });
const MADE = [
  MD('made.energy', ['fire', 'air'], 0, 3, [], { upkeep: 'energy' }),
  MD('made.steam', ['fire', 'water'], 1, 2, ['body'], { cap: ['seep'], wetOnHit: true, lifespan: 2 }),
  MD('made.swamp', ['earth', 'water'], 1, 4, ['liquid', 'body']),
  MD('made.golem', ['earth', 'word'], 3, 5, ['clay', 'stone', 'body'], { kw: ['heavy', 'guard'] }),
  MD('made.homunculus', ['water', 'word'], 2, 3, ['living', 'person', 'speaker', 'body'], { onMade: 'seekSpell' }),
  MD('made.phoenix', ['fire'], 4, 4, ['living', 'beast', 'bird', 'winged', 'hot', 'body'], { kw: ['flying', 'final'], rebirth: true }),
  MD('made.alkahest', ['water'], 0, 3, ['liquid'], { kw: ['final'], ability: { id: 'alkahest', cost: 1, sacrificeSelf: true } }),
  MD('made.ouroboros', ['rot', 'life'], 3, 4, ['living', 'beast', 'serpent', 'body'], { kw: ['venomous', 'final'], cap: ['bite'], ouroboros: true }),
  MD('made.life', ['life', 'earth', 'water'], 0, 4, ['living'], { upkeep: 'lifeHeal' }),
  MD('made.world_tree', ['life', 'earth', 'water'], 2, 7, ['living', 'plant', 'tree', 'body'], { kw: ['guard', 'final'], upkeep: 'worldTree' }),
  MD('made.quintessence', ['fire', 'air', 'earth', 'water'], 2, 4, ['body']),
  MD('made.philosophers_stone', ['earth', 'word', 'fire', 'air', 'water'], 3, 6, ['stone', 'metal', 'body'], { kw: ['final'], upkeep: 'stone' }),
];

// V31 Expanded Grammar (B) test vocabulary — only legal in formats whose variant.modules lists the module.
// Never deck-legal in rc1, never in the market, never sampled by bots outside those formats.
const FX = (o, module) => ({ ...o, deckLegal: false, market: false, folio: module });
const FOLIO = [
  FX(T('life.bee', 'life', 1, 1, 2, ['living', 'beast', 'insect', 'body', 'winged', 'flammable'], { kw: ['flying'], carrier: 'insect' }), 'orchard'),
  FX(T('life.hazel', 'life', 2, 0, 4, ['living', 'plant', 'tree', 'orchard', 'flower', 'flammable'], { pollination: 'wind' }), 'orchard'),
  FX(S('life.feast', 'life', 2, { spell: 'feast' }), 'orchard'),
  FX(S('earth.shape', 'earth', 2, { spell: 'shape' }), 'workshop'),
  FX(T('earth.garnet', 'earth', 1, 0, 3, ['stone', 'jewel', 'settable']), 'workshop'),
  FX(S('word.writ', 'word', 3, { spell: 'writ' }), 'workshop'),
  FX(T('rot.mould', 'rot', 1, 0, 2, ['living', 'fungus', 'decomposer'], { ability: { id: 'mould', cost: 1 } }), 'decay'),
];
// transformed-only and made-only forms of the workshop module
const FOLIO_FORMS = [
  { id: 'earth.setting', school: 'earth', type: 'thing', cost: 0, strike: 0, stand: 3, props: ['metal', 'socket'], deckLegal: false, market: false, folio: 'workshop', ladderOnly: true, transformedOnly: true },
  MD('made.signet', ['earth'], 0, 4, ['metal', 'artefact', 'instrument'], { folio: 'workshop', ability: { id: 'signet', cost: 1 } }),
];
// Core Duel "Three Decks Worth Mastering" trial vocabulary (module 'three'). New senses get their own stable ids;
// `name` is the display headword. Never deck-legal outside the module; archived senses (life.graft, earth.shape,
// word.writ, made.signet, made.golem, reserve Signet Ground) keep their meanings.
const THREE = [
  FX(T('life.apple', 'life', 3, 1, 4, ['living', 'plant', 'tree', 'flower', 'orchard', 'body', 'flammable'], { pollination: 'insect', appleArrive: true }), 'three'),
  FX(T('fire.tinder', 'fire', 1, 0, 1, ['flammable'], { ability: { id: 'tinder', cost: 1, sacrificeSelf: true } }), 'three'),
  FX(T('earth.hammer', 'earth', 3, 2, 3, ['metal', 'body', 'tool'], { cap: ['crush'], ability: { id: 'hammer', cost: 1 } }), 'three'),
  FX(S('life.graft3', 'life', 2, { spell: 'graft3', name: 'Graft' }), 'three'),
  FX(S('earth.shape3', 'earth', 2, { spell: 'shape3', name: 'Shape' }), 'three'),
  FX(S('word.writ3', 'word', 3, { spell: 'writ3', name: 'Writ' }), 'three'),
];
const THREE_FORMS = [
  { id: 'earth.signet3', name: 'Signet', school: 'earth', type: 'thing', cost: 0, strike: 0, stand: 4, props: ['metal', 'instrument'], deckLegal: false, market: false, folio: 'three', ladderOnly: true, transformedOnly: true, ability: { id: 'seal', cost: 1 } },
  MD('made.espalier', ['life'], 3, 5, ['living', 'plant', 'tree', 'orchard', 'flammable', 'body'], { folio: 'three', kw: ['reach'], cap: ['bind'], upkeep: 'espalier' }),
  MD('made.golem3', ['earth', 'word'], 4, 5, ['clay', 'stone', 'body'], { folio: 'three', name: 'Golem', kw: ['heavy', 'guard', 'reach'], golemSpill: true }),
];
// B overlays on unchanged rc1 words (apply only while the module is active)
const OVERLAYS = { orchard: { 'life.pear': { pollination: 'insect' }, 'air.wind': { carrier: 'wind' } }, workshop: { 'fire.smith': { ability: { id: 'shapeWork', cost: 2 } } } };

// Stage H experiments only (never in normal play): WA_PATCH=miasma4,oak3 adjusts printed costs for a controlled test.
for (const patch of String(process.env.WA_PATCH || '').split(',').filter(Boolean)) {
  const f = patch.match(/^([a-z_]+):([a-z]+)=(\d+)$/); // name:field=value, e.g. boulder:stand=5
  if (f) { const c = CARDS.find(x => x.id.split('.')[1] === f[1]); if (c) c[f[2]] = +f[3]; continue; }
  const m = patch.match(/^([a-z_]+?)(\d+)$/); if (!m) continue;
  const c = CARDS.find(x => x.id.split('.')[1] === m[1]); if (c) c.cost = +m[2];
}
const BY_ID = Object.fromEntries(CARDS.concat(TOKENS, MADE, FOLIO, FOLIO_FORMS, THREE, THREE_FORMS).map(c => [c.id, c]));

// Derived capabilities (spec §5.3). Explicit `cap` adds to these.
function capabilities(card, kws) {
  const p = card.props || [], c = new Set(card.cap || []);
  if (p.includes('body')) c.add('strike');
  if (kws.has('heavy')) c.add('crush');
  if (p.includes('sharp')) c.add('cut');
  if (p.includes('hot')) { c.add('burn'); c.add('scorch'); }
  if (p.includes('seaborn') || p.includes('liquid')) { c.add('seep'); c.add('drench'); c.add('wash'); }
  if (p.includes('winged')) c.add('blow');
  if (p.includes('spirit') || p.includes('dark')) c.add('haunt');
  if (p.includes('toxic') || kws.has('venomous')) c.add('poison');
  return c;
}

function validateRegistry() {
  const errs = [];
  for (const c of CARDS) {
    if (!/^(fire|water|air|earth|life|rot|word)\.[a-z_]+$/.test(c.id)) errs.push('bad id ' + c.id);
    if (c.ladderOnly && c.deckLegal) errs.push('ladder-only form is deck-legal ' + c.id);
    if (c.type === 'ground' && !Number.isInteger(c.stand)) errs.push('ground stand ' + c.id);
    if (c.type === 'quality' && !c.qual) errs.push('quality def ' + c.id);
    if (c.disabled && c.deckLegal) errs.push('disabled word is deck-legal ' + c.id);
    if (c.id.split('.')[0] !== c.school) errs.push('school mismatch ' + c.id);
    if (!Number.isInteger(c.cost) || c.cost < 1) errs.push('cost ' + c.id);
    if (c.type === 'thing' && !(Number.isInteger(c.strike) && Number.isInteger(c.stand))) errs.push('stats ' + c.id);
  }
  for (const c of TOKENS.concat(MADE)) if (c.deckLegal || !Number.isInteger(c.strike) || !Number.isInteger(c.stand)) errs.push('template ' + c.id);
  return errs;
}

module.exports = { THREE, THREE_FORMS, CARDS, TOKENS, MADE, FOLIO, FOLIO_FORMS, OVERLAYS, BY_ID, capabilities, validateRegistry };
