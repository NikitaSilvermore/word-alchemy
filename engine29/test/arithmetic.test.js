'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { E, DECKS, fixture, place, give, ground } = require('./helpers');
const { chooseAction, blocker } = require('../src/bots');
const { validateRegistry } = require('../src/cards');

const noBlock = () => null;
const blockWith = id => () => id;

test('registry is valid', () => assert.deepEqual(validateRegistry(), []));

test('deck legality: 20 distinct words, 1–3 schools', () => {
  assert.deepEqual(E.deckErrors(DECKS.earthWater), []);
  const dup = DECKS.earthWater.slice(0, 19).concat(['earth.boulder']);
  assert.ok(E.deckErrors(dup).some(e => /distinct/.test(e)));
});

test('spec §11 fixture: Boulder (2/8 with Tower Reach) crushes a 3/3 flyer: 4 packet, 3 to it, 1 overflow, no multipliers', () => {
  const S = fixture();
  ground(S, 0, 'earth.tower');
  const b = place(S, 0, 'earth.boulder', { counters: { bedrock: 2 } });
  const h = place(S, 1, 'air.hawk', { exhausted: true });
  const c = give(S, 0, 'earth.crush');
  S.players[1].life = 27;
  E.apply(S, { type: 'attack', subject: b.id, verb: 'crush', card: c.pid, target: h.id }, noBlock);
  assert.equal(S.stats.packets[0].n, 4);
  assert.ok(!S.things.includes(h));
  assert.equal(S.players[1].life, 26);
  assert.equal(b.damage, 0, 'exhausted target cannot retaliate');
});

test('Crush 6 vs remaining stand 3 gives exactly 3 overflow', () => {
  const S = fixture();
  const s = place(S, 0, 'earth.iron'); s.tempStrike = 2; // 4 strike + 2 crush = 6
  const e = place(S, 1, 'life.wolf', { exhausted: true }); // 2/3
  const c = give(S, 0, 'earth.crush');
  E.apply(S, { type: 'attack', subject: s.id, verb: 'crush', card: c.pid, target: e.id }, noBlock);
  assert.equal(S.players[1].life, 27);
});

test('no overflow when the crushed Thing survives', () => {
  const S = fixture();
  const s = place(S, 0, 'earth.lead');
  const e = place(S, 1, 'earth.boulder', { exhausted: true });
  const c = give(S, 0, 'earth.crush');
  E.apply(S, { type: 'attack', subject: s.id, verb: 'crush', card: c.pid, target: e.id }, noBlock);
  assert.equal(e.damage, 3); assert.equal(S.players[1].life, 30);
});

test('a direct unblocked attack on the rival deals its packet once, never packet plus overflow', () => {
  const S = fixture();
  const s = place(S, 0, 'earth.boulder');
  const c = give(S, 0, 'earth.crush');
  E.apply(S, { type: 'attack', subject: s.id, verb: 'crush', card: c.pid, target: 'rival' }, noBlock);
  assert.equal(S.players[1].life, 26);
});

test('strike and stand are independent: Bedrock and Guard raise stand only', () => {
  const S = fixture();
  const b = place(S, 0, 'earth.boulder', { counters: { bedrock: 2 } });
  b.tempStand = 2;
  assert.equal(E.curStrike(S, b), 2);
  assert.equal(E.standOf(S, b), 10);
});

test('healing removes marked damage but never raises maximum stand', () => {
  const S = fixture();
  const w = place(S, 0, 'life.wolf', { damage: 1 });
  const a = place(S, 0, 'life.apothecary');
  const m = give(S, 0, 'life.mend');
  E.apply(S, { type: 'remote', subject: a.id, card: m.pid, target: w.id }, noBlock);
  assert.equal(w.damage, 0); assert.equal(E.remainingOf(S, w), 3);
});

test('Boulder cannot Bite (no capability); Wolf can', () => {
  const S = fixture();
  const b = place(S, 0, 'earth.boulder'); const w = place(S, 0, 'life.wolf');
  const e = place(S, 1, 'life.hare');
  give(S, 0, 'life.bite');
  const bites = E.legalActions(S).filter(a => a.verb === 'bite');
  assert.ok(bites.every(a => a.subject === w.id));
  assert.ok(bites.some(a => a.target === e.id));
});

test('Bite cannot target a non-living Thing, and a non-living interceptor takes no Bite damage', () => {
  const S = fixture();
  const w = place(S, 0, 'life.wolf');
  const ice = place(S, 1, 'water.ice');
  const c = give(S, 0, 'life.bite');
  assert.ok(!E.legalActions(S).some(a => a.verb === 'bite' && a.target === ice.id));
  E.apply(S, { type: 'attack', subject: w.id, verb: 'bite', card: c.pid, target: 'rival' }, blockWith(ice.id));
  assert.equal(ice.damage, 0); assert.equal(S.players[1].life, 30);
});

test('grounded attacker cannot reach a flyer; Heavy + Tower gains Reach', () => {
  const S = fixture();
  const b = place(S, 0, 'earth.boulder'); const h = place(S, 1, 'air.hawk');
  assert.ok(!E.legalActions(S).some(a => a.subject === b.id && a.target === h.id));
  ground(S, 0, 'earth.tower');
  assert.ok(E.legalActions(S).some(a => a.subject === b.id && a.target === h.id));
});

test('a flyer attacking a ready grounded Thing takes retaliation', () => {
  const S = fixture({ first: 1 }); S.active = 1;
  const h = place(S, 1, 'air.hawk'); const st = place(S, 0, 'life.stag');
  E.apply(S, { type: 'attack', subject: h.id, verb: 'strike', target: st.id }, noBlock);
  assert.equal(st.damage, 3); assert.ok(!S.things.includes(h), 'stag strikes back for 3 and destroys the 3/3 hawk');
});

test('a blocker exhausted on commitment still retaliates; both lethal sides die in one batch', () => {
  const S = fixture();
  const a = place(S, 0, 'life.stag', { damage: 1 }); const d = place(S, 1, 'water.pike', { damage: 1 }); // 3 strike each into 3 remaining
  E.apply(S, { type: 'attack', subject: a.id, verb: 'strike', target: 'rival' }, blockWith(d.id));
  assert.ok(!S.things.includes(a) && !S.things.includes(d));
  assert.equal(S.players[1].life, 30);
});

test('flying attackers are blocked only by flyers or Reach', () => {
  const S = fixture();
  const h = place(S, 0, 'air.hawk'); place(S, 1, 'life.stag', {}); const br = place(S, 1, 'life.bramble');
  let seen = null;
  E.apply(S, { type: 'attack', subject: h.id, verb: 'strike', target: 'rival' }, (S2, info) => { seen = info.candidates.map(c => c.word); return null; });
  assert.deepEqual(seen, ['life.bramble']);
  void br;
});

test('poison decays 3, 2, 1 and caps at 3 doses', () => {
  const S = fixture();
  const p = S.players[0]; p.poison = 2;
  const sp = place(S, 1, 'rot.spider'); S.active = 1;
  const c = give(S, 1, 'rot.poison');
  E.apply(S, { type: 'remote', subject: sp.id, card: c.pid, target: 'rival' }, noBlock);
  assert.equal(p.poison, 3);
  const life0 = p.life; S.active = 0; E.startTurn(S);
  assert.equal(life0 - p.life, 3); assert.equal(p.poison, 2);
});

test('simultaneous lethal life totals are a draw', () => {
  const S = fixture();
  S.players[0].life = 1; S.players[1].life = 1; S.players[0].poison = 1; S.players[1].poison = 0;
  S.players[0].life -= 1; S.players[1].life -= 1; E.stateCheck(S);
  assert.equal(S.over, 'draw');
});

test('full hand skips the draw without fatigue; empty deck fatigue escalates 1, 2', () => {
  const S = fixture(); const p = S.players[0];
  for (let i = 0; i < 7; i++) p.hand.push({ pid: 'x' + i, word: 'earth.guard', owner: 0 });
  const life = p.life; S.active = 0; E.startTurn(S); assert.equal(p.life, life);
  p.hand = []; p.deck = []; E.startTurn(S); E.startTurn(S);
  assert.equal(life - p.life, 3);
});

test('legacy arithmetic reproduces the V28 burst; V29 removes it (same board)', () => {
  const run = ar => {
    const S = fixture({ arithmetic: ar, decks: [DECKS.earthWater, DECKS.fireAir] });
    S.players[0].main = 'earth';
    const b = place(S, 0, 'earth.boulder', { counters: { bedrock: 1 }, attuned: ar === 'legacy' });
    const e = place(S, 1, 'fire.ember', { exhausted: true });
    const c = give(S, 0, 'earth.crush');
    E.apply(S, { type: 'attack', subject: b.id, verb: 'crush', card: c.pid, target: e.id }, noBlock);
    return 30 - S.players[1].life;
  };
  const legacy = run('legacy'), v29 = run('v29');
  assert.equal(v29, 2); // strike 2 + crush 2 = 4 against ember stand 2: overflow 2
  assert.ok(legacy >= 3 * v29, `legacy ${legacy} vs v29 ${v29}`);
});

test('deterministic replay: same seed and policies give identical state hashes', () => {
  const play = () => {
    const S = E.createMatch({ decks: [DECKS.earthWater, DECKS.fireAir], seed: 42, arithmetic: 'v29' });
    const pol = () => 'careful'; const blk = blocker(pol);
    for (let k = 0; k < 400 && S.over == null; k++) E.apply(S, chooseAction(S, pol), blk);
    return S.hashes.join(',');
  };
  assert.equal(play(), play());
});
