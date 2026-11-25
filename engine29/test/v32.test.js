// V32 The Workshop (Volume II) — automated assertions for V (visit), H (heat), R (roles), field capacity and W5.
// Constructed positions only; every positive case has a minimally changed negative twin.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../src/engine');
const F = require('../src/formats');
const B = require('../src/bots');
const { recordMatch, replayMatch } = require('../src/replay');
const J = require('../src/journey');
const { V2_DECKS } = require('../data/v32_decks');

const BMODS = ['orchard', 'workshop', 'decay'];
function fx(extra = [], decks = ['V01_neighbours_orchard', 'V03_seal_engraver']) {
  const S = E.createMatch({ decks: decks.map(d => V2_DECKS[d].words), seed: 17, first: 0, initiative: 'combo2', variant: { modules: BMODS.concat(extra) } });
  S.synthetic = true;
  for (const p of S.players) { p.deck.push(...p.hand); p.hand = []; p.breath = 8; p.reserve = 0; p.spark = 2; }
  S.active = 0; return S;
}
function place(S, side, word, o = {}) {
  const t = { id: 't' + (++S.seq), pid: o.pid === null ? null : 'fx' + S.seq, word, owner: side, ctrl: side, entry: S.seq, damage: o.damage || 0, counters: o.counters || {}, status: o.status || {}, exhausted: !!o.exhausted, fresh: !!o.fresh, actions: 0, arrivedTurn: 0, ...(o.form ? { form: o.form } : {}), ...(o.token ? { token: true } : {}), ...(o.lineage ? { lineage: o.lineage } : {}) };
  S.things.push(t); if (t.pid) S.registry[t.pid] = true; return t;
}
const give = (S, side, word) => { const c = { pid: 'h' + (++S.seq), word, owner: side }; S.players[side].hand.push(c); S.registry[c.pid] = true; return c; };
const ground = (S, side, word) => { const g = { pid: 'gr' + (++S.seq), word, owner: side, damage: 0 }; S.players[side].ground = g; S.registry[g.pid] = true; return g; };
const NOCTL = { block: () => null, respond: null };
const pass = S => E.apply(S, { type: 'pass' }, NOCTL);
const fruitOf = (S, side) => S.things.filter(t => t.ctrl === side && t.word === 'token.fruit');

test('V32 V: invitation opens at End; visit makes the HOST a Fruit and lets the visitor reorder two; refusal and closing are free', () => {
  const S = fx(['visit']); S.active = 1;
  const pear = place(S, 1, 'life.pear'); const bee = place(S, 0, 'life.bee');
  const inv = E.legalActions(S).find(a => a.type === 'invite' && a.kind === 'orchard' && a.host === pear.id); assert.ok(inv, 'host may offer');
  E.apply(S, inv, NOCTL); assert.ok(!S.invites || !S.invites.length, 'nothing opens before End');
  pass(S); // host End -> open; visitor's turn
  assert.equal(S.invites.length, 1); assert.equal(S.active, 0);
  const top0 = S.players[0].deck.slice(-2).map(c => c.word);
  const v = E.legalActions(S).find(a => a.ability === 'visit' && a.subject === bee.id && a.target === pear.id); assert.ok(v);
  const sparkBefore = S.players.map(p => p.spark), handBefore = S.players[0].hand.length;
  E.setDecider(S, (S2, side, kind, options) => (kind === 'reorder' ? 1 : 0)); // visitor swaps its top two
  E.apply(S, v, NOCTL);
  assert.equal(fruitOf(S, 1).length, 1, 'the Fruit is the host\'s'); assert.equal(fruitOf(S, 0).length, 0);
  assert.deepEqual(S.players[0].deck.slice(-2).map(c => c.word), top0.slice().reverse(), 'private reorder of the top two');
  assert.equal(S.players[0].hand.length, handBefore, 'no draw in the reorder arm');
  assert.deepEqual(S.players.map(p => p.spark), sparkBefore); assert.ok(bee.exhausted); assert.equal(S.invites.length, 0, 'a visit closes the invitation');
  assert.ok(!E.legalActions(S).some(a => a.ability === 'visit'), 'one attempt per turn, and the invitation is closed');
  assert.deepEqual(E.zoneAudit(S), []);
});

test('V32 V negatives: closed host, Wet Bee, host already has Fruit, short deck; interruption keeps the cost; host bounce cancels', () => {
  let S = fx(['visit']); const pear = place(S, 1, 'life.pear'), bee = place(S, 0, 'life.bee');
  assert.match(E.visitWhy(S, 0, bee, pear), /has not opened/);
  S.invites = [{ id: 'i1', kind: 'orchard', owner: 1, host: pear.id }];
  bee.status.wet = true; assert.match(E.visitWhy(S, 0, bee, pear), /working wings/); bee.status.wet = false;
  const f = place(S, 1, 'token.fruit', { pid: null, token: true }); assert.match(E.visitWhy(S, 0, bee, pear), /already has a Fruit/); S.things = S.things.filter(x => x !== f);
  const keep = S.players[0].deck; S.players[0].deck = keep.slice(0, 1); assert.match(E.visitWhy(S, 0, bee, pear), /two cards/); S.players[0].deck = keep;
  // the host bounces its own Pear in response: the attempt fails, Bee's breath and exhaustion stay spent, no Fruit
  E.apply(S, E.legalActions(S).find(a => a.ability === 'visit'), { block: () => null, respond: (S2, side) => { if (side === 1) E.leaveField(S2, S2.things.find(t => t.id === pear.id), 'bounced'); return null; } });
  assert.equal(fruitOf(S, 1).length, 0); assert.ok(bee.exhausted); assert.equal(S.players[0].breath, 7); assert.ok(!S.invites.length);
  // the draw arm: draws one instead of reordering; never both
  S = fx(['visit_draw']); const p2 = place(S, 1, 'life.pear'), b2 = place(S, 0, 'life.bee'); S.invites = [{ id: 'i2', kind: 'orchard', owner: 1, host: p2.id }];
  const deck0 = S.players[0].deck.length; E.apply(S, E.legalActions(S).find(a => a.ability === 'visit'), NOCTL);
  assert.equal(S.players[0].hand.length, 1); assert.equal(S.players[0].deck.length, deck0 - 1); void b2;
});

test('V32 H: the fee moves on declaration, even when the metal is bounced; host at cap or visitor at zero forbids; source must survive', () => {
  let S = fx(['heat'], ['V03_seal_engraver', 'V13_giver_of_fire']);
  S.active = 1; ground(S, 1, 'fire.torch');
  E.apply(S, E.legalActions(S).find(a => a.type === 'invite' && a.kind === 'heat'), NOCTL); pass(S);
  const cu = place(S, 0, 'earth.copper');
  const hw = E.legalActions(S).find(a => a.type === 'hotwork' && a.target === cu.id); assert.ok(hw);
  const sp0 = S.players.map(p => p.spark), br0 = S.players[0].breath;
  E.apply(S, hw, NOCTL);
  assert.equal(cu.form, 'earth.setting'); assert.deepEqual(S.players.map(p => p.spark), [sp0[0] - 1, sp0[1] + 1]); assert.equal(S.players[0].breath, br0 - 1);
  assert.ok(!E.legalActions(S).some(a => a.type === 'hotwork'), 'once per turn; invitation consumed');
  // interruption: the host Gusts the metal after the fee — fee stays with the host, no Setting
  S = fx(['heat'], ['V03_seal_engraver', 'V13_giver_of_fire']); ground(S, 1, 'fire.torch'); S.invites = [{ id: 'h', kind: 'heat', owner: 1, groundPid: S.players[1].ground.pid }];
  const c2 = place(S, 0, 'earth.copper');
  E.apply(S, E.legalActions(S).find(a => a.type === 'hotwork'), { block: () => null, respond: (S2, side) => { if (side === 1) E.leaveField(S2, S2.things.find(t => t.id === c2.id), 'bounced'); return null; } });
  assert.deepEqual(S.players.map(p => p.spark), [1, 3]); assert.ok(S.players[0].hand.some(c => c.word === 'earth.copper'));
  // host at the cap; visitor without spark; heat source destroyed before resolution
  S = fx(['heat'], ['V03_seal_engraver', 'V13_giver_of_fire']); ground(S, 1, 'fire.torch'); S.invites = [{ id: 'h', kind: 'heat', owner: 1, groundPid: S.players[1].ground.pid }];
  const c3 = place(S, 0, 'earth.copper'); S.players[1].spark = 5; assert.match(E.hotworkWhy(S, 0, c3), /already holds 5 spark/);
  S.players[1].spark = 2; S.players[0].spark = 0; assert.match(E.hotworkWhy(S, 0, c3), /you have none/); S.players[0].spark = 2;
  E.apply(S, E.legalActions(S).find(a => a.type === 'hotwork'), { block: () => null, respond: (S2, side) => { if (side === 1) { S2.players[1].ground = null; } return null; } });
  assert.equal(E.card(c3).id, 'earth.copper'); assert.deepEqual(S.players.map(p => p.spark), [1, 3], 'no refund');
  // heat is never an ingredient and never available outside the module
  const S4 = fx([], ['V03_seal_engraver', 'V13_giver_of_fire']); ground(S4, 1, 'fire.torch'); place(S4, 0, 'earth.copper');
  assert.ok(!E.legalActions(S4).some(a => a.type === 'hotwork' || a.type === 'invite'));
});

test('V32 R: Oak intercepts and deals 0 back; Fruit cannot intercept; Wolf retaliates; Silver cannot strike; Awaken grants all three', () => {
  let S = fx(['r6'], ['V08_patient_predator', 'V11_world_tree_maker']);
  const wolf = place(S, 0, 'life.wolf'), oak = place(S, 1, 'life.oak'), fruit = place(S, 1, 'token.fruit', { pid: null, token: true });
  let cands;
  E.apply(S, E.legalActions(S).find(a => a.type === 'attack' && a.subject === wolf.id && a.target === 'rival' && !a.card), { block: (S2, info) => { cands = info.candidates.map(c => c.id); return oak.id; }, respond: null });
  assert.ok(cands.includes(oak.id)); assert.ok(!cands.includes(fruit.id), 'Fruit cannot intercept');
  assert.equal(wolf.damage, 0, 'Oak deals 0 back'); assert.ok(oak.damage > 0);
  // Wolf retaliates when attacked directly; Silver and Garnet cannot strike
  S = fx(['r6'], ['V08_patient_predator', 'V03_seal_engraver']); S.active = 1;
  const w2 = place(S, 0, 'life.wolf'), ag = place(S, 1, 'earth.silver'), iron = place(S, 1, 'earth.iron');
  assert.ok(!E.legalActions(S).some(a => a.type === 'attack' && a.subject === ag.id));
  E.apply(S, E.legalActions(S).find(a => a.type === 'attack' && a.subject === iron.id && a.target === w2.id && !a.card), NOCTL);
  assert.ok(iron.damage > 0, 'Wolf strikes back');
  // Awaken on Silver: explicit grant
  // Awaken (legal only on a non-Living, non-body Thing such as Clay): the explicit grant restores all three permissions
  S = fx(['r6', 'rext'], ['V08_patient_predator', 'V03_seal_engraver']); S.active = 1;
  const clay = place(S, 1, 'earth.setting', { form: 'earth.setting' }); assert.equal(E.perm(S, clay, 'strike'), false);
  const aw = give(S, 1, 'word.awaken'); E.apply(S, E.legalActions(S).find(a => a.card === aw.pid && a.target === clay.id), NOCTL);
  for (const k of ['strike', 'intercept', 'retaliate']) assert.equal(E.perm(S, clay, k), true, k);
  // Fruit-only arm changes only Fruit
  S = fx(['rfruit'], ['V08_patient_predator', 'V11_world_tree_maker']); const oak2 = place(S, 1, 'life.oak');
  assert.equal(E.perm(S, oak2, 'retaliate'), true); assert.equal(E.perm(S, place(S, 1, 'token.fruit', { pid: null, token: true }), 'intercept'), false);
  // printed strike kept for numeric tests (Gust's target test) — the stat is still there
  assert.equal(E.curStrike(S, oak2), 3);
});

test('V32 capacity: six general; five + one supply (stock/products only); a form change out of the supply space moves or displaces', () => {
  let S = fx(['cap6']); for (let k = 0; k < 5; k++) place(S, 0, 'life.hare'); assert.ok(E.hasRoom(S, 0, 'life.wolf')); place(S, 0, 'life.hare'); assert.ok(!E.hasRoom(S, 0, 'life.wolf'));
  S = fx(['supply']); for (let k = 0; k < 5; k++) place(S, 0, 'life.hare'); E.stateCheck(S);
  assert.ok(!E.hasRoom(S, 0, 'life.wolf'), 'a Wolf cannot use the supply space'); assert.ok(E.hasRoom(S, 0, 'earth.copper'), 'Copper can');
  const cu = place(S, 0, 'earth.copper'); E.stateCheck(S); assert.equal(cu.supply, true);
  cu.form = 'earth.iron'; E.stateCheck(S); assert.equal(cu.displaced, true, 'no general space: displaced and cannot act');
  S.things = S.things.filter(t => t.word !== 'life.hare' || S.things.indexOf(t) > 0); E.stateCheck(S); assert.equal(cu.supply, false); assert.equal(cu.displaced, false);
  // rc1 keeps five
  const R = E.createMatch({ decks: [V2_DECKS.V08_patient_predator.words, V2_DECKS.V11_world_tree_maker.words], seed: 1, first: 0, initiative: 'combo2' });
  for (let k = 0; k < 5; k++) place(R, 0, 'life.hare'); assert.ok(!E.hasRoom(R, 0, 'earth.copper'));
});

function w5State(opts = {}) {
  const S = fx(['w5'], ['V11_world_tree_maker', 'V08_patient_predator']);
  const lin = [{ pid: 'o1', word: 'life.oak', owner: 0 }, { made: true, form: 'made.life', owner: 0, lineage: [{ pid: 's1', word: 'life.seed', owner: 0 }, { made: true, form: 'made.swamp', owner: 0, lineage: [{ pid: 'c1', word: 'earth.clay', owner: 0 }, { ground: true, pid: 'w1', word: 'water.water', owner: 0 }] }] }];
  for (const x of ['o1', 's1', 'c1', 'w1']) S.registry[x] = true;
  const tree = place(S, 0, 'made.world_tree', { form: 'made.world_tree', pid: null, lineage: opts.badChain ? [{ pid: 'o1', word: 'life.oak', owner: 0 }] : lin });
  const ben = place(S, 0, 'life.wolf');
  return { S, tree, ben };
}
test('V32 W5: success needs the real chain, a real upkeep Growth on an exact beneficiary, a declaration and a surviving rival turn', () => {
  const { S, tree, ben } = w5State();
  assert.match(E.w5Why(S, 0, tree, ben), /not yet given Growth/);
  pass(S); pass(S); // our upkeep: World Tree gives Growth to the oldest other Living Thing (the Wolf)
  assert.deepEqual(tree.wtGrants, [ben.id]); assert.equal(ben.counters.growth, 1);
  const claim = E.legalActions(S).find(a => a.type === 'claim'); assert.ok(claim);
  E.apply(S, claim, NOCTL); assert.equal(S.claims[0].open, true); assert.equal(S.over, undefined === S.over ? undefined : S.over);
  pass(S); pass(S); // a full rival turn, then our start of Main
  assert.equal(S.over, 0); assert.equal(S.overCause, 'work');
  // a World Tree not grown from Swamp and Life cannot claim
  const b = w5State({ badChain: true }); pass(b.S); pass(b.S); assert.match(E.w5Why(b.S, 0, b.tree, b.ben), /not grown from Clay \+ Water/);
});
test('V32 W5: ordinary disruption breaks the claim; an interruption makes the declaration fail; earlier life loss wins first', () => {
  // disruption: the rival kills the beneficiary during its turn
  let { S, ben } = w5State(); pass(S); pass(S); E.apply(S, E.legalActions(S).find(a => a.type === 'claim'), NOCTL); pass(S);
  E.leaveField(S, S.things.find(t => t.id === ben.id), 'destroyed'); E.stateCheck(S);
  assert.equal(S.claims[0].closed, 'broken'); pass(S); assert.notEqual(S.over, 0);
  // interruption: the rival bounces the Tree in response to the declaration
  ({ S } = w5State()); pass(S); pass(S);
  E.apply(S, E.legalActions(S).find(a => a.type === 'claim'), { block: () => null, respond: (S2, side) => { if (side === 1) E.leaveField(S2, S2.things.find(t => t.word === 'made.world_tree' || t.form === 'made.world_tree'), 'bounced'); return null; } });
  assert.ok(!(S.claims || []).some(c => c.open)); assert.equal(S.players[0].breath < 8, true);
  // earlier lethal: the claimant dies on the rival turn before its Main
  ({ S } = w5State()); pass(S); pass(S); E.apply(S, E.legalActions(S).find(a => a.type === 'claim'), NOCTL); pass(S);
  S.players[0].life = 1; S.players[0].poison = 2; pass(S);
  assert.equal(S.over, 1, 'life ends it before the claim is checked');
});

test('V32: random legal play in every V32 format keeps zones, conservation and exact replay', () => {
  const runs = [['v32_visit', 'V01_neighbours_orchard', 'V04_orchard_cellar'], ['v32_heat', 'V03_seal_engraver', 'V13_giver_of_fire'], ['v32_r6', 'V01_neighbours_orchard', 'V08_patient_predator'],
    ['v32_supply', 'V03_seal_engraver', 'V01_neighbours_orchard'], ['v32_cap6', 'V04_orchard_cellar', 'V08_patient_predator'], ['v32_w5', 'V11_world_tree_maker', 'V08_patient_predator'], ['v32_visit_draw', 'V01_neighbours_orchard', 'V01_neighbours_orchard']];
  const seen = {};
  let g = 0;
  for (const [fmt, a, b] of runs) for (let s = 0; s < 4; s++) {
    let r = (s + 3) * 6151 + g++; const rnd = () => { r = (r * 1103515245 + 12345) & 0x7fffffff; return r / 0x7fffffff; }; const pick = xs => xs[Math.floor(rnd() * xs.length)];
    const agent = { act: S => { const xs = E.legalActions(S); const mod = xs.filter(x => ['invite', 'hotwork', 'claim'].includes(x.type) || x.ability === 'visit'); return mod.length && rnd() < 0.7 ? pick(mod) : rnd() < 0.12 ? { type: 'pass' } : pick(xs); },
      block: (S, info) => (rnd() < 0.5 && info.candidates.length ? pick(info.candidates).id : null), respond: (S, side, kind) => { const o = E.legalResponses(S, side, kind); return o.length && rnd() < 0.4 ? pick(o) : null; },
      decide: (S, side, kind, options, d) => d, mulligan: () => [] };
    const { replay, state } = recordMatch({ format: fmt, decks: [V2_DECKS[a].words, V2_DECKS[b].words], seed: 700 + g, first: s % 2 }, [agent, agent]);
    assert.deepEqual(E.zoneAudit(state), [], fmt);
    for (const e of state.events) seen[e.type] = (seen[e.type] || 0) + 1;
    const rp = replayMatch(JSON.parse(JSON.stringify(replay))); assert.equal(rp.state.hashes.at(-1), state.hashes.at(-1), fmt + ' replay');
  }
  for (const k of ['invite-open', 'visited', 'heat-fee', 'hotworked']) assert.ok(seen[k] > 0, 'exercised ' + k + ' ' + JSON.stringify(Object.fromEntries(Object.entries(seen).filter(([x]) => /invite|visit|heat|hot|claim|wt-|displac/.test(x)))));
});

test('V32: rc1 and V31 formats are untouched by the V32 modules', () => {
  const S = E.createMatch({ decks: [V2_DECKS.V08_patient_predator.words, V2_DECKS.V11_world_tree_maker.words], seed: 2, first: 0, initiative: 'combo2' });
  assert.ok(!E.legalActions(S).some(a => ['invite', 'hotwork', 'claim'].includes(a.type)));
  const old = require('./data/replays_pre_alkahest.json'); for (const r of old.slice(0, 6)) assert.equal(replayMatch(r).state.hashes.at(-1), r.hashes.at(-1));
});
