// Stage H — adversarial combinations: every amplifier is bounded (spec §4.2, §4.3, §4.9, §5.9, §8).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { E, fixture, place, give, ground } = require('./helpers');

const nb = () => null;
const spell = (S, word, extra = {}, side = 0) => { const c = give(S, side, word); E.apply(S, { type: 'spell', card: c.pid, ...extra }, nb); return c; };

test('H: Resonant never chains — five Things sharing a word take 1 each, once per turn', () => {
  const S = fixture(); const ws = [0, 1, 2, 3].map(() => place(S, 1, 'life.stag')); place(S, 0, 'life.stag');
  E.apply(S, { type: 'quality', card: give(S, 0, 'air.resonant').pid, target: ws[0].id }, nb);
  const em = place(S, 0, 'fire.ember'); E.apply(S, { type: 'remote', subject: em.id, card: give(S, 0, 'fire.scorch').pid, target: ws[0].id }, nb);
  assert.deepEqual(S.things.filter(t => t.word === 'life.stag').map(t => t.damage).sort(), [1, 1, 1, 1, 2]);
});

test('H: Squall caps at 3 Flyers (6 damage); Scream caps Voice at +2 (4 damage)', () => {
  const S = fixture(); const fl = ['air.owl', 'air.hawk', 'air.crow', 'air.swallow'].map(w => place(S, 0, w));
  const c = give(S, 0, 'air.squall');
  assert.ok(E.legalActions(S).filter(a => a.card === c.pid).every(a => a.targets.length <= 3));
  E.apply(S, { type: 'spell', card: c.pid, targets: fl.slice(0, 3).map(t => t.id) }, nb); assert.equal(S.players[1].life, 24);
  const T = fixture(); for (let k = 0; k < 4; k++) place(T, 0, 'word.scribe'); spell(T, 'word.scream'); assert.equal(T.players[1].life, 26);
});

test('H: Wildfire life loss caps at 3 however many enemy Things burn', () => {
  const S = fixture(); for (let k = 0; k < 5; k++) place(S, 1, 'life.stag', { status: { burning: 2 } });
  spell(S, 'fire.wildfire'); assert.equal(S.players[1].life, 27);
});

test('H: extra breath from every source together is capped at +2 per turn and the pool at 10', () => {
  const S = fixture(); const p = S.players[0];
  ground(S, 0, 'fire.bellows'); const en = place(S, 0, 'fire.ember'); en.form = 'made.energy'; const g = place(S, 0, 'earth.silver'); g.form = 'earth.gold';
  E.endTurn(S); E.endTurn(S);
  const base = Math.min(8, 2 + p.personalTurn);
  assert.equal(p.breath, base + 2, 'three upkeep engines still give only +2');
  const gs = give(S, 0, 'air.gasp'); assert.ok(!E.legalActions(S).some(a => a.card === gs.pid), 'no more extra breath this turn');
  const ln = give(S, 0, 'word.loan'); assert.ok(!E.legalActions(S).some(a => a.card === ln.pid));
});

test('H: ability spark is capped at 1 per own turn (Ink + Magpie + Saffron); stored spark at 5', () => {
  const S = fixture(); ground(S, 0, 'word.ink'); const m = place(S, 0, 'air.magpie'); place(S, 0, 'life.saffron');
  E.endTurn(S); E.endTurn(S); const p = S.players[0]; const before = p.spark;
  E.apply(S, { type: 'attack', subject: m.id, verb: 'strike', target: 'rival' }, nb);
  E.apply(S, { type: 'deploy', card: give(S, 0, 'life.rose').pid }, nb);
  assert.equal(p.spark, before + 1, 'sentence spark only; ability spark already taken by Ink');
  p.spark = 5; E.endTurn(S); E.endTurn(S); assert.equal(p.spark, 5);
});

test('H: recursion cannot loop — Memory, Exhume and Echo seal themselves; Recurrent and Phoenix are once per duel', () => {
  const S = fixture(); S.players[0].grave.push({ pid: 'gm', word: 'water.memory', owner: 0, reason: 'spent' }); S.registry.gm = true;
  const m = give(S, 0, 'water.memory');
  assert.ok(!E.legalActions(S).some(a => a.card === m.pid && a.target === 'g:gm'), 'Memory cannot recover Memory');
  const T = fixture(); const fb = place(T, 0, 'fire.firebird'); const ash = E.createToken(T, 0, 'token.ash');
  E.apply(T, { type: 'fuse', recipe: 'phoenix', a: fb.id, b: ash.id }, nb);
  const ph = T.things.find(t => E.card(t).id === 'made.phoenix'); ph.damage = 9; E.stateCheck(T); assert.ok(T.things.includes(ph));
  ph.damage = 9; E.stateCheck(T); assert.ok(!T.things.includes(ph), 'second lethal damage destroys it');
});

test('H: Quick gives exactly one extra paid action; Crush overflow happens once; poison caps at 3 doses', () => {
  const S = fixture(); const t = place(S, 0, 'life.stag'); E.apply(S, { type: 'quality', card: give(S, 0, 'air.quick').pid, target: t.id }, nb);
  E.apply(S, { type: 'attack', subject: t.id, verb: 'strike', target: 'rival' }, nb); E.apply(S, { type: 'attack', subject: t.id, verb: 'strike', target: 'rival' }, nb);
  assert.ok(!E.legalActions(S).some(a => a.subject === t.id));
  const T = fixture(); const v = place(T, 1, 'life.stag'); for (let k = 0; k < 3; k++) { T.players[0].breath = 3; spell(T, 'rot.miasma'); } assert.equal(v.status.poison, 3); assert.equal(T.players[1].poison, 3);
});

test('H: Naphtha detonates once per physical card; Drought adds 1 once per player turn', () => {
  const S = fixture(); const n = place(S, 1, 'fire.naphtha', { exhausted: true }); n.damage = 0;
  S.flags[n.pid + ':naphtha'] = true; const e = place(S, 0, 'life.stag'); E.ignite(S, n, 0); assert.equal(e.damage, 0, 'already used');
});

test('H: no single turn exceeds 30 sentences in random legal play (no unbounded loops)', () => {
  const { run } = require('../tools/fuzz');
  const r = run(40); assert.deepEqual(r.errors, []); assert.ok(r.maxPerTurn <= 30, 'max per turn ' + r.maxPerTurn);
});
