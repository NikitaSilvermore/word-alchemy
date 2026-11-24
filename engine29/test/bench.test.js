// Stage G — decisions, tiers, hidden-information discipline and reproducible benchmark runs.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { E, fixture, place } = require('./helpers');
const B = require('../src/bots');
const { deckBench, ladder, digest } = require('../sim/bench');

test('G: choices raised during resolution are decisions; a decider changes the outcome', () => {
  const run = pick => {
    const S = fixture(); const rat = place(S, 0, 'rot.rat'); const a = place(S, 1, 'life.stag'), b = place(S, 1, 'life.hare');
    E.setDecider(S, (S2, side, kind, options) => (kind === 'poisonTarget' ? options.indexOf(pick === 'hare' ? b.id : a.id) : 0));
    rat.damage = 9; E.stateCheck(S);
    return [a.status.poison || 0, b.status.poison || 0, S.events.some(e => e.type === 'decision' && e.kind === 'poisonTarget')];
  };
  assert.deepEqual(run('stag'), [1, 0, true]);
  assert.deepEqual(run('hare'), [0, 1, true]);
});

test('G: an out-of-range decider answer falls back to the documented default', () => {
  const S = fixture(); const rat = place(S, 0, 'rot.rat'); const a = place(S, 1, 'life.stag'); place(S, 1, 'life.hare');
  E.setDecider(S, () => 99); rat.damage = 9; E.stateCheck(S); assert.equal(a.status.poison, 1);
});

test('G: every tier returns a legal action; higher tiers search deeper', () => {
  for (const t of B.TIER_ORDER) {
    const S = E.createMatch({ decks: [require('./helpers').DECKS.earthWater, require('./helpers').DECKS.fireAir], seed: 31 });
    for (let k = 0; k < 6 && S.over == null; k++) { const a = B.chooseAction(S, () => 'careful:' + t); assert.ok(E.legalActions(S).some(x => JSON.stringify(x) === JSON.stringify(a)), t); E.apply(S, a, B.controller(() => 'careful:' + t)); }
  }
  assert.ok(B.TIERS.master.depth > B.TIERS.journeyman.depth && B.TIERS.master.samples > 0);
});

test('G: anticipation samples rival hands from public information only — the real hand never changes the choice', () => {
  for (const seed of [41, 42, 43]) {
    const S = E.createMatch({ decks: [require('./helpers').DECKS.earthWater, require('./helpers').DECKS.fireAir], seed });
    const pol = () => 'careful:expert';
    for (let k = 0; k < 8 && S.over == null; k++) E.apply(S, B.chooseAction(S, pol), B.controller(pol));
    if (S.over != null) continue;
    const a1 = B.chooseAction(S, pol); const rv = S.players[1 - S.active]; const keep = rv.hand;
    rv.hand = rv.hand.map(c => ({ ...c, word: 'word.doubt' })); const a2 = B.chooseAction(S, pol); rv.hand = keep;
    assert.deepEqual(a1, a2);
  }
});

test('G: benchmark runs are reproducible to the digest; mirrored pairs share a seed', () => {
  const r1 = deckBench('A', 'journeyman', 2, 500, '0/5'), r2 = deckBench('A', 'journeyman', 2, 500, '0/5');
  const pair = deckBench('A', 'journeyman', 2, 500, '0/1').slice(0, 2);
  assert.equal(digest(r1), digest(r2));
  assert.equal(pair[0].seed, pair[1].seed); assert.notEqual(pair[0].first, pair[1].first);
  const l = ladder('REF', 4, 500, ['apprentice', 'journeyman'], '0/4');
  assert.ok(l.length >= 1 && l[0].tiers.length === 2);
  assert.ok(r1[0].res[0].breathSpent >= 0 && typeof r1[0].res[0].lifeLost === 'object', 'resource log present');
});
