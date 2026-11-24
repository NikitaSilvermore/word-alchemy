// V29 fusion registry (spec §7, §9). Recipes are data: predicates, primary ingredient, output, cost.
// The catalyst requirement is computed from recorded school affiliations, never hand-written.
'use strict';
const { BY_ID, CARDS } = require('./cards');

const OPPOSED = [['fire', 'water'], ['air', 'earth'], ['life', 'rot']];

// ingredient descriptor: { thing|ground|token: true, form?: id | forms: [ids], school?, props?: [...] }
const NAMED = [
  { id: 'energy', out: 'made.energy', cost: 2, a: { thing: true, form: 'fire.ember' }, b: { thing: true, form: 'air.wind' } },
  { id: 'steam', out: 'made.steam', cost: 2, a: { thing: true, form: 'fire.ember' }, b: { ground: true, form: 'water.water' } },
  { id: 'swamp', out: 'made.swamp', cost: 2, a: { thing: true, form: 'earth.clay' }, b: { ground: true, form: 'water.water' } },
  { id: 'golem', out: 'made.golem', cost: 2, a: { thing: true, form: 'earth.clay' }, b: { thing: true, form: 'word.word' } },
  { id: 'homunculus', out: 'made.homunculus', cost: 3, a: { ground: true, form: 'water.flask' }, b: { thing: true, form: 'word.word' } },
  { id: 'phoenix', out: 'made.phoenix', cost: 3, a: { thing: true, form: 'fire.firebird' }, b: { token: true, form: 'token.ash' } },
  { id: 'alkahest', out: 'made.alkahest', cost: 3, a: { thing: true, form: 'water.vitriol' }, b: { thing: true, form: 'water.quicksilver' } },
  { id: 'ouroboros', out: 'made.ouroboros', cost: 3, a: { thing: true, form: 'rot.adder' }, b: { thing: true, form: 'life.scarab' } },
  { id: 'life', out: 'made.life', cost: 3, a: { thing: true, form: 'life.seed' }, b: { thing: true, form: 'made.swamp' } },
  { id: 'world_tree', out: 'made.world_tree', cost: 4, a: { thing: true, form: 'life.oak' }, b: { thing: true, form: 'made.life' } },
  { id: 'quintessence', out: 'made.quintessence', cost: 4, a: { thing: true, form: 'made.energy' }, b: { thing: true, form: 'made.swamp' } },
  { id: 'philosophers_stone', out: 'made.philosophers_stone', cost: 5, a: { thing: true, form: 'earth.gold' }, b: { thing: true, form: 'made.quintessence' } },
];

// Compositional infusions (§7.3): host keeps its form; the recipe adds a bounded modifier.
const LIVING_BEAST = { thing: true, props: ['living', 'beast'], host: true };
const INFUSIONS = [
  { id: 'fireborn', cost: 2, a: LIVING_BEAST, b: { ground: true, form: 'fire.fire' }, mod: { strike: 1, stand: 1, props: ['hot'], igniteOnHit: true }, school: 'fire' },
  { id: 'winged', cost: 2, a: LIVING_BEAST, b: { thing: true, form: 'air.wind' }, mod: { stand: 1, props: ['winged'], kw: ['flying'] }, school: 'air', forbidKw: ['heavy'] },
  { id: 'seaborn', cost: 2, a: LIVING_BEAST, b: { ground: true, form: 'water.water' }, mod: { stand: 1, props: ['seaborn'] }, school: 'water', forbidProps: ['seaborn'] },
  { id: 'stonebound', cost: 2, a: LIVING_BEAST, b: { thing: true, props: ['stone'] }, mod: { stand: 2, kw: ['heavy'], kwRemove: ['flying'] }, school: 'earth' },
];
const MAX_INFUSIONS = 2;

function opposedAcross(sa, sb) {
  return OPPOSED.some(([x, y]) => (sa.includes(x) && sb.includes(y)) || (sa.includes(y) && sb.includes(x)));
}

// Reachability (§9): can every named recipe be assembled from deck-legal words, ladders, token creators and other recipes?
const LADDERS = { 'earth.tin': ['earth.lead'], 'earth.copper': ['earth.lead'], 'earth.silver': ['earth.tin', 'earth.copper'], 'earth.gold': ['earth.silver'],
  'life.sapling': ['life.seed'], 'life.oak': ['life.sapling'], 'life.willow': ['life.sapling'] };
const TOKEN_CREATORS = { 'token.ash': ['fire.calcine'], 'token.carrion': ['rot.barrow'], 'token.fruit': [], 'token.blossom': [] };
function reachability() {
  const memo = {};
  const ok = (form, path = []) => {
    if (memo[form] !== undefined) return memo[form];
    if (path.includes(form)) return false;
    const c = BY_ID[form];
    let r = false, how = null;
    if (!c) r = false;
    else if (c.deckLegal) { r = true; how = 'deck'; }
    else if (c.token) { const cr = TOKEN_CREATORS[form] || []; r = cr.some(x => BY_ID[x] && BY_ID[x].deckLegal); how = 'token via ' + cr.join('/'); }
    else if (LADDERS[form]) { r = LADDERS[form].some(f => ok(f, path.concat(form))); how = 'ladder'; }
    if (!r && c && c.made) { const rec = NAMED.find(x => x.out === form); r = !!rec && ok(rec.a.form, path.concat(form)) && ok(rec.b.form, path.concat(form)); how = 'recipe'; }
    // ladder forms that are also deck-legal (e.g. Silver) are reachable directly
    memo[form] = r; void how;
    return r;
  };
  return NAMED.map(r => ({ recipe: r.id, a: r.a.form, b: r.b.form, reachable: ok(r.a.form) && ok(r.b.form), output: r.out, oneGround: !(r.a.ground && r.b.ground) }));
}

function validateRecipes() {
  const errs = [];
  for (const r of NAMED) {
    for (const k of ['a', 'b']) if (!BY_ID[r[k].form]) errs.push(`${r.id}: unknown ingredient ${r[k].form}`);
    if (!BY_ID[r.out] || !BY_ID[r.out].made) errs.push(`${r.id}: output not a made form`);
    if (r.cost < 2) errs.push(`${r.id}: price below 2`);
    if (r.a.ground && r.b.ground) errs.push(`${r.id}: two Grounds cannot coexist`);
  }
  for (const x of reachability()) if (!x.reachable) errs.push(`${x.recipe}: unreachable`);
  void CARDS;
  return errs;
}

module.exports = { NAMED, INFUSIONS, OPPOSED, MAX_INFUSIONS, LADDERS, opposedAcross, reachability, validateRecipes };
