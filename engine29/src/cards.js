// V29 "The Grammar" — prototype card registry (subset for stages A–C).
// Stats and rules follow spec §8. Only effects listed here are implemented;
// anything else in the spec is disabled for this stage, never approximated.
'use strict';

// p = properties, cap = capabilities, kw = keywords
const T = (id, school, cost, strike, stand, p, extra = {}) =>
  ({ id, school, type: 'thing', cost, strike, stand, props: p, deckLegal: true, ...extra });
const A = (id, school, cost, extra) => ({ id, school, type: 'action', cost, deckLegal: true, ...extra });
const S = (id, school, cost, extra) => ({ id, school, type: 'spell', cost, deckLegal: true, ...extra });
const G = (id, school, cost, stand, extra) => ({ id, school, type: 'ground', cost, stand, deckLegal: true, ...extra });

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
  // Air
  T('air.owl', 'air', 2, 2, 2, ['living', 'beast', 'bird', 'winged', 'sharp', 'body', 'flammable'], { kw: ['flying'] }),
  T('air.hawk', 'air', 3, 3, 3, ['living', 'beast', 'bird', 'winged', 'sharp', 'body', 'flammable'], { kw: ['flying'] }),
  T('air.swallow', 'air', 1, 1, 1, ['living', 'beast', 'bird', 'winged', 'body', 'flammable'], { kw: ['flying', 'swift'] }),
  T('air.crow', 'air', 2, 1, 3, ['living', 'beast', 'bird', 'winged', 'body', 'flammable'], { kw: ['flying'] }),
  T('air.wind', 'air', 2, 1, 3, ['body'], { kw: ['flying'] }), // wingless flight
  S('air.gasp', 'air', 1, { spell: 'gasp' }),
  S('air.gust', 'air', 2, { spell: 'gust', r: true }),
  // Earth
  T('earth.boulder', 'earth', 3, 2, 6, ['stone', 'body'], { kw: ['heavy', 'guard', 'bedrock'] }),
  T('earth.stone', 'earth', 2, 1, 4, ['stone', 'body'], { kw: ['heavy'] }),
  T('earth.lead', 'earth', 1, 1, 3, ['metal', 'body'], { kw: ['heavy'] }),
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
  T('life.bramble', 'life', 2, 1, 4, ['living', 'plant', 'body', 'flammable'], { kw: ['reach'] }),
  T('life.aloe', 'life', 2, 0, 3, ['living', 'plant', 'herb'], { cap: ['mend'], upkeep: 'aloe' }),
  T('life.apothecary', 'life', 3, 2, 3, ['living', 'person', 'body', 'flammable'], { cap: ['mend'] }),
  A('life.bite', 'life', 1, { verb: 'bite', bonus: 1 }),
  A('life.mend', 'life', 1, { verb: 'mend', remote: true, r: true }),
  // Water
  T('water.eel', 'water', 1, 1, 2, ['living', 'beast', 'seaborn', 'body']),
  T('water.otter', 'water', 2, 2, 3, ['living', 'beast', 'seaborn', 'body', 'flammable'], { kw: ['swift'], cap: ['bite'] }),
  T('water.pike', 'water', 3, 3, 4, ['living', 'beast', 'seaborn', 'body'], { cap: ['bite'] }),
  T('water.ice', 'water', 2, 0, 4, [], { kw: ['heavy', 'guard'] }),
  A('water.seep', 'water', 1, { verb: 'seep', remote: true, dmg: 2 }),
  S('water.tonic', 'water', 2, { spell: 'tonic' }),
  S('water.dew', 'water', 1, { spell: 'dew', r: true }),
  A('water.drench', 'water', 1, { verb: 'drench', remote: true, r: true }),
  S('water.frozen', 'water', 2, { spell: 'frozen', r: true }),
  S('water.thaw', 'water', 1, { spell: 'thaw', r: true }),
  S('water.sleep', 'water', 2, { spell: 'sleep', r: true }),
  // Rot
  T('rot.rat', 'rot', 1, 1, 2, ['living', 'beast', 'body', 'flammable'], { onDeath: 'poison1' }),
  T('rot.adder', 'rot', 2, 2, 2, ['living', 'beast', 'serpent', 'body'], { kw: ['venomous'], cap: ['bite'] }),
  T('rot.spider', 'rot', 2, 2, 2, ['living', 'beast', 'body'], { kw: ['venomous'], cap: ['bite'] }),
  T('rot.leech', 'rot', 2, 1, 3, ['living', 'beast', 'seaborn', 'body'], { cap: ['bite'], leech: true }),
  T('rot.yew', 'rot', 3, 1, 4, ['living', 'plant', 'tree', 'toxic', 'body', 'flammable'], { onDeath: 'poison1' }),
  T('rot.wormwood', 'rot', 2, 0, 3, ['living', 'plant', 'herb', 'toxic'], { upkeep: 'wormwood' }),
  A('rot.poison', 'rot', 1, { verb: 'poison', remote: true }),
  // The Word (fusion text of Familiar is disabled until stage E)
  T('word.familiar', 'word', 2, 1, 2, ['living', 'beast', 'body', 'flammable']),
  S('word.protect', 'word', 1, { spell: 'protect', r: true }),
  S('word.doubt', 'word', 2, { spell: 'doubt', r: true, responseOnly: true }),
];

const BY_ID = Object.fromEntries(CARDS.map(c => [c.id, c]));

// Derived capabilities (spec §5.3). Explicit `cap` adds to these.
function capabilities(card, kws) {
  const p = card.props || [], c = new Set(card.cap || []);
  if (p.includes('body')) c.add('strike');
  if (kws.has('heavy')) c.add('crush');
  if (p.includes('sharp')) c.add('cut');
  if (p.includes('hot')) { c.add('burn'); c.add('scorch'); }
  if (p.includes('seaborn') || p.includes('liquid')) { c.add('seep'); c.add('drench'); }
  if (p.includes('toxic') || kws.has('venomous')) c.add('poison');
  return c;
}

function validateRegistry() {
  const errs = [];
  for (const c of CARDS) {
    if (!/^(fire|water|air|earth|life|rot|word)\.[a-z_]+$/.test(c.id)) errs.push('bad id ' + c.id);
    if (c.id.split('.')[0] !== c.school) errs.push('school mismatch ' + c.id);
    if (!Number.isInteger(c.cost) || c.cost < 1) errs.push('cost ' + c.id);
    if (c.type === 'thing' && !(Number.isInteger(c.strike) && Number.isInteger(c.stand))) errs.push('stats ' + c.id);
  }
  return errs;
}

module.exports = { CARDS, BY_ID, capabilities, validateRegistry };
