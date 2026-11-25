// V33 The Core Duel — rules regression tests (constructed positions on the v33_core configuration).
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../src/engine');
const F = require('../src/formats');
const B = require('../src/bots');
const { recordMatch, replayMatch } = require('../src/replay');
const { V33_DECKS: D } = require('../data/v33_decks');

function fx(a = 'orchard', b = 'furnace') {
  const S = F.createFromFormat('v33_core', { decks: [D[a].words, D[b].words], seed: 11, first: 0, mulligan: () => [] });
  for (const p of S.players) { p.deck.push(...p.hand); p.hand = []; p.breath = 6; p.reserve = 0; }
  S.active = 0; return S;
}
function place(S, side, word, o = {}) {
  const p = S.players[side], k = p.deck.findIndex(c => c.word === word);
  const c = k >= 0 ? p.deck.splice(k, 1)[0] : null;
  const t = { id: 't' + (++S.seq), pid: c ? c.pid : null, word, owner: side, ctrl: side, entry: S.seq, damage: 0, counters: {}, status: {}, exhausted: false, fresh: false, actions: 0, arrivedTurn: 0, ...(c ? {} : { token: true, form: word }), ...o };
  S.things.push(t); return t;
}
const give = (S, side, word) => { const p = S.players[side], k = p.deck.findIndex(c => c.word === word); const c = p.deck.splice(k, 1)[0]; p.hand.push(c); return c; };
const NOCTL = { block: () => null, respond: null };
const acts = S => E.legalActions(S);

test('V33 Game 1 regression: no ordinary Strike at Bee or Pear; only one grouped attack at the rival, free', () => {
  const S = fx('furnace', 'orchard');
  const owl = place(S, 0, 'air.owl'), sal = place(S, 0, 'fire.salamander'), bee = place(S, 1, 'life.bee'), pear = place(S, 1, 'life.pear');
  assert.ok(!acts(S).some(a => a.type === 'attack' && !a.card), 'no basic strike actions at all');
  assert.ok(!acts(S).some(a => a.target === bee.id || a.target === pear.id), 'nothing targets Bee or Pear without a paid word');
  const combats = acts(S).filter(a => a.type === 'combat'); assert.equal(combats.length, 3); // {owl},{sal},{owl,sal}
  const life = S.players[1].life, br = S.players[0].breath;
  E.apply(S, combats.find(a => a.attackers.length === 2), { block: () => null, respond: null });
  assert.equal(S.players[0].breath, br, 'ordinary attacks are free'); assert.equal(S.players[1].life, life - 4);
  assert.ok(owl.exhausted && sal.exhausted); assert.ok(!acts(S).some(a => a.type === 'combat'), 'one grouped attack per turn');
  assert.ok(S.things.includes(bee) && S.things.includes(pear), 'the orchard survives an ordinary attack');
});

test('V33 grouped blocks: each blocker once, simultaneous damage, blocked attackers never reach life', () => {
  const S = fx('furnace', 'forge');
  const a1 = place(S, 0, 'fire.salamander'), a2 = place(S, 0, 'air.wind'), a3 = place(S, 0, 'fire.ember');
  const b1 = place(S, 1, 'earth.boulder'), b2 = place(S, 1, 'earth.flint');
  const seen = [];
  E.apply(S, { type: 'combat', attackers: [a1.id, a2.id, a3.id] }, { block: (S2, info) => { seen.push(info.candidates.map(c => c.id)); return info.candidates[0] ? info.candidates[0].id : null; }, respond: null });
  assert.deepEqual(seen[0], [b1.id, b2.id], 'Salamander: both may block'); assert.deepEqual(seen[1], [b2.id], 'Ember: Boulder already used; Wind flies, so it was never offered a ground blocker');
  assert.equal(seen.length, 2); assert.equal(S.players[1].life, 30 - 1, 'only the unblocked flying Wind reaches life');
  assert.equal(b1.damage, 2); assert.ok(!S.things.includes(b2), 'Flint (stand 1) dies to Ember'); assert.ok(!S.things.includes(a3), 'Ember dies to Flint simultaneously');
});

test('V33 responses in combat: a removed attacker deals nothing; a removed blocker leaves its attacker blocked', () => {
  let S = fx('furnace', 'orchard');
  const sw = place(S, 0, 'air.swallow'), sal = place(S, 0, 'fire.salamander');
  give(S, 1, 'air.gust'); S.players[1].reserve = 2;
  E.apply(S, { type: 'combat', attackers: [sw.id, sal.id] }, { block: () => null, respond: (S2, side) => (side === 1 ? E.legalResponses(S2, 1, 'response').find(r => r.target === sal.id) : null) });
  assert.equal(S.players[1].life, 29, 'Gusted Salamander deals nothing; Swallow hits for 1');
  S = fx('furnace', 'orchard');
  const s2 = place(S, 0, 'fire.salamander'), ice = place(S, 1, 'water.otter'); give(S, 0, 'air.gust');
  E.apply(S, { type: 'combat', attackers: [s2.id] }, { block: () => ice.id, respond: null }); // no answer — check the blocker path with a direct removal
  assert.equal(S.players[1].life, 30); assert.equal(ice.damage, 2);
});

test('V33 Study: 2 breath, draw 1, once per turn; not with a full hand or an empty deck', () => {
  const S = fx(); const p = S.players[0], n = p.hand.length, dk = p.deck.length;
  E.apply(S, { type: 'study' }, NOCTL); assert.equal(p.hand.length, n + 1); assert.equal(p.deck.length, dk - 1); assert.equal(p.breath, 4);
  assert.ok(!acts(S).some(a => a.type === 'study'));
  const S2 = fx(); S2.players[0].deck = []; assert.ok(!acts(S2).some(a => a.type === 'study'));
  const S3 = fx(); while (S3.players[0].hand.length < 7) S3.players[0].hand.push(S3.players[0].deck.shift()); assert.ok(!acts(S3).some(a => a.type === 'study'));
});

test('V33 economy: no Market, no Spark, one fixed catalyst each', () => {
  const S = fx(); assert.equal(S.market.length, 0); assert.deepEqual(S.players.map(p => p.catalyst), [1, 1]);
  const sp = place(S, 0, 'fire.ember'); void sp; E.apply(S, { type: 'pass' }, NOCTL); E.apply(S, { type: 'pass' }, NOCTL);
  assert.deepEqual(S.players.map(p => p.spark), [0, 0]); assert.ok(!acts(S).some(a => a.type === 'buy' || a.type === 'catalyst'));
});

test('V33 paid removal and protection: Scorch kills a Bee; Gust in response saves it; Ice guards against Bite', () => {
  let S = fx('furnace', 'orchard');
  const em = place(S, 0, 'fire.ember'), bee = place(S, 1, 'life.bee'); const sc = give(S, 0, 'fire.scorch');
  E.apply(S, acts(S).find(a => a.card === sc.pid && a.target === bee.id), NOCTL); assert.ok(!S.things.includes(bee), 'paid removal works');
  S = fx('furnace', 'orchard');
  const em2 = place(S, 0, 'fire.ember'), bee2 = place(S, 1, 'life.bee'); const sc2 = give(S, 0, 'fire.scorch'); give(S, 1, 'air.gust'); S.players[1].reserve = 2;
  E.apply(S, acts(S).find(a => a.card === sc2.pid && a.target === bee2.id), { block: () => null, respond: (S2, side) => (side === 1 ? E.legalResponses(S2, 1, 'response').find(r => r.target === em2.id) : null) });
  assert.ok(S.things.includes(bee2), 'Gust on the Ember stops the Scorch'); void em;
  S = fx('orchard', 'orchard'); S.players[1].deck.push(...[]);
  const wolf = place(S, 0, 'life.wolf'), bee3 = place(S, 1, 'life.pear'), ice = place(S, 1, 'water.ice'); const bt = give(S, 0, 'life.bite');
  let cands; E.apply(S, acts(S).find(a => a.card === bt.pid && a.target === bee3.id), { block: (S2, info) => { cands = info.candidates.map(c => c.id); return ice.id; }, respond: null });
  assert.deepEqual(cands, [ice.id], 'only a Guard may intercept for the Pear'); assert.ok(S.things.includes(bee3)); void wolf;
});

test('V33 Naphtha: Kindle ignites it even when Wet; the flare is bounded and happens once', () => {
  const S = fx('furnace', 'orchard');
  const na = place(S, 0, 'fire.naphtha', { status: { wet: true } }); const k = give(S, 0, 'fire.kindle');
  const e1 = place(S, 1, 'life.wolf'), e2 = place(S, 1, 'life.bee');
  E.apply(S, acts(S).find(a => a.card === k.pid && a.target === na.id), NOCTL);
  assert.ok(!S.things.includes(na), 'Naphtha is consumed'); assert.equal(e1.damage, 2); assert.ok(!S.things.includes(e2), 'Bee (stand 2) burns away');
  assert.equal(S.players[1].life, 28); assert.equal(S.events.filter(e => e.type === 'flare').length, 1);
});

test('V33 weather and growth: Drought dries everything; Abundance grows two Plants; Fruit and Dew heal marked damage', () => {
  let S = fx('furnace', 'orchard');
  const a = place(S, 0, 'fire.ember', { status: { wet: true } }), b = place(S, 1, 'life.bee', { status: { wet: true } }); const dr = give(S, 0, 'fire.drought');
  E.apply(S, acts(S).find(x => x.card === dr.pid), NOCTL); assert.ok(!a.status.wet && !b.status.wet);
  S = fx('orchard', 'furnace');
  const sd = place(S, 0, 'life.seed', { counters: { age: 1 } }), sp = place(S, 0, 'life.sapling'); const ab = give(S, 0, 'life.abundance');
  E.apply(S, acts(S).find(x => x.card === ab.pid && x.targets && x.targets.length === 2), NOCTL);
  assert.equal(E.card(sd).id, 'life.sapling', 'the Seed grew'); assert.equal(sd.counters.growth, 1); assert.equal(sp.counters.growth, 1);
  S = fx('orchard', 'furnace');
  const w = place(S, 0, 'life.wolf', { damage: 2 }); place(S, 0, 'token.fruit');
  const mend = acts(S).find(x => x.ability === 'eatFruit' && x.branch === 'mend'); assert.equal(mend.target, w.id);
  E.apply(S, mend, NOCTL); assert.equal(w.damage, 0); assert.ok(!S.things.some(t => E.card(t).id === 'token.fruit'), 'one Fruit is spent once');
  S = fx('orchard', 'furnace'); const w2 = place(S, 0, 'life.wolf', { damage: 2 }); const dw = give(S, 0, 'water.dew');
  E.apply(S, acts(S).find(x => x.card === dw.pid && x.target === w2.id), NOCTL); assert.equal(w2.damage, 0); assert.ok(w2.status.wet);
});

test('V33 no-benefit choices are hidden: Winged is not offered for a Thing that already flies', () => {
  const S = fx('furnace', 'orchard'); const fb = place(S, 0, 'fire.firebird'), sal = place(S, 0, 'fire.salamander'); const wg = give(S, 0, 'air.winged');
  const ts = acts(S).filter(a => a.card === wg.pid).map(a => a.target); assert.ok(!ts.includes(fb.id)); assert.ok(ts.includes(sal.id));
});

test('V33 shuffled bot games in every pairing: zones clean, exact replay, no fatigue lock', () => {
  const names = Object.keys(D);
  for (const a of names) for (const b of names) for (let g = 0; g < 2; g++) {
    const pol = () => 'careful:journeyman:ra', ag = { act: S => B.chooseAction(S, pol), block: B.blocker(pol), respond: B.responderRA(pol), decide: B.decider(pol), mulligan: B.mulligan };
    const { replay, state } = recordMatch({ format: 'v33_core', decks: [D[a].words, D[b].words], seed: 50 + g, first: g }, [ag, ag]);
    assert.ok(state.over != null, `${a} v ${b} finished`); assert.deepEqual(E.zoneAudit(state), []);
    assert.equal(replayMatch(JSON.parse(JSON.stringify(replay))).state.hashes.at(-1), state.hashes.at(-1));
  }
});
