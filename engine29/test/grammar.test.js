// Stage B (state and grammar) and stage C (interaction) regression tests — spec §11.1, §14.4.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { E, DECKS, fixture, place, give, ground } = require('./helpers');
const B = require('../src/bots');
const { playOne } = require('../sim/run');

const noBlock = () => null;
// scripted controller: blocker id, then defender response, then active answer
const script = ({ block = null, response = null, answer = null } = {}) => ({
  block: () => block,
  respond: (S, side, kind) => (kind === 'response' ? response : answer),
});
const audit = S => assert.deepEqual(E.zoneAudit(S), []);

// ---------- Stage B ----------
test('B: sentences — wolf bites stag is legal; boulder cannot bite; grounded boulder cannot crush a flying owl', () => {
  const S = fixture();
  const w = place(S, 0, 'life.wolf'), b = place(S, 0, 'earth.boulder');
  const stag = place(S, 1, 'life.stag'), owl = place(S, 1, 'air.owl');
  const bite = give(S, 0, 'life.bite'), crush = give(S, 0, 'earth.crush');
  assert.equal(E.whyIllegal(S, { type: 'attack', subject: w.id, verb: 'bite', card: bite.pid, target: stag.id }), null);
  assert.match(E.whyIllegal(S, { type: 'attack', subject: b.id, verb: 'bite', card: bite.pid, target: stag.id }), /lacks the bite capability/);
  assert.match(E.whyIllegal(S, { type: 'attack', subject: b.id, verb: 'crush', card: crush.pid, target: owl.id }), /flying/);
  ground(S, 0, 'earth.tower'); // Heavy + Tower gains Reach
  assert.equal(E.whyIllegal(S, { type: 'attack', subject: b.id, verb: 'crush', card: crush.pid, target: owl.id }), null);
  audit(S);
});

test('B: every physical card sits in exactly one zone through a whole seeded match', () => {
  const S = E.createMatch({ decks: [DECKS.earthWater, DECKS.fireAir], seed: 11 });
  const pol = () => 'careful', ctl = B.controller(pol);
  for (let k = 0; k < 600 && S.over == null; k++) { E.apply(S, B.chooseAction(S, pol), ctl); audit(S); }
  assert.notEqual(S.over, null);
});

test('B: physical IDs persist hand → field → grave, with the reason recorded', () => {
  const S = fixture();
  const c = give(S, 0, 'life.hare');
  E.apply(S, { type: 'deploy', card: c.pid }, noBlock);
  const t = S.things.find(x => x.pid === c.pid);
  assert.ok(t);
  const e = place(S, 1, 'life.stag', { exhausted: true });
  t.fresh = false; // let it act
  E.apply(S, { type: 'attack', subject: t.id, verb: 'strike', target: e.id }, noBlock);
  t.damage = 99; E.stateCheck(S);
  const g = S.players[0].grave.find(x => x.pid === c.pid);
  assert.equal(g.reason, 'destroyed');
  audit(S);
});

test('B: a full field never displaces — deployment is not legal', () => {
  const S = fixture();
  for (let k = 0; k < 5; k++) place(S, 0, 'water.eel');
  const c = give(S, 0, 'life.hare');
  assert.match(E.whyIllegal(S, { type: 'deploy', card: c.pid }), /no empty field slot/);
  assert.equal(S.things.filter(t => t.ctrl === 0).length, 5);
});

test('B: Ground is damageable and destroyed at 0; it never retaliates; Crush on Ground gives no overflow', () => {
  const S = fixture();
  ground(S, 1, 'fire.torch'); // stand 2
  const s = place(S, 0, 'earth.iron'); // 2 strike +2 crush = 4 vs stand 2
  const c = give(S, 0, 'earth.crush');
  E.apply(S, { type: 'attack', subject: s.id, verb: 'crush', card: c.pid, target: 'ground' }, noBlock);
  assert.equal(S.players[1].ground, null);
  assert.equal(S.players[1].life, 30, 'no overflow from Ground');
  assert.equal(s.damage, 0, 'Ground never retaliates');
  assert.equal(S.players[1].grave.at(-1).reason, 'destroyed');
  audit(S);
});

test('B: only a ready Guard Thing may intercept an attack on Ground', () => {
  const S = fixture();
  ground(S, 1, 'earth.tower');
  const att = place(S, 0, 'life.stag');
  const plain = place(S, 1, 'water.pike'), guard = place(S, 1, 'earth.boulder');
  let seen = null;
  E.apply(S, { type: 'attack', subject: att.id, verb: 'strike', target: 'ground' }, (S2, info) => { seen = info.candidates.map(b => b.id); return null; });
  assert.deepEqual(seen, [guard.id]);
  assert.ok(!seen.includes(plain.id));
});

test('B: Bite cannot target Ground', () => {
  const S = fixture();
  ground(S, 1, 'earth.tower');
  const w = place(S, 0, 'life.wolf'); const b = give(S, 0, 'life.bite');
  assert.match(E.whyIllegal(S, { type: 'attack', subject: w.id, verb: 'bite', card: b.pid, target: 'ground' }), /bite cannot target Ground/);
});

test('B: full-hand bounce goes to Grave (not a death)', () => {
  const S = fixture();
  const victim = place(S, 1, 'life.hare'); // 1/2, non-heavy
  for (let k = 0; k < 7; k++) give(S, 1, 'water.eel');
  const g = give(S, 0, 'air.gust');
  E.apply(S, { type: 'spell', card: g.pid, target: victim.id }, noBlock);
  assert.ok(!S.things.includes(victim));
  const e = S.players[1].grave.find(x => x.pid === victim.pid);
  assert.equal(e.reason, 'bounced-full-hand');
  audit(S);
});

test('B: UI/bot parity — every bot choice is a member of the shared legal-action list', () => {
  for (const seed of [3, 4, 5]) {
    const S = E.createMatch({ decks: [DECKS.earthWater, DECKS.fireAir], seed });
    const pol = () => 'aggressive', ctl = B.controller(pol);
    for (let k = 0; k < 400 && S.over == null; k++) {
      const a = B.chooseAction(S, pol);
      assert.ok(E.legalActions(S).some(x => JSON.stringify(x) === JSON.stringify(a)));
      E.apply(S, a, ctl);
    }
  }
});

// ---------- Stage C ----------
test('C: reserve — second player starts with 1; up to 2 kept at End; discarded at own Renew; never pays Main', () => {
  const S = E.createMatch({ decks: [DECKS.earthWater, DECKS.fireAir], seed: 2, first: 0 });
  assert.equal(S.players[1].reserve, 1);
  assert.equal(S.players[0].reserve, 0);
  S.players[0].breath = 3;
  E.apply(S, { type: 'pass' }); // P0 ends with 3 breath
  assert.equal(S.players[0].reserve, 2, 'capped at 2');
  assert.equal(S.players[1].reserve, 0, 'P1 unused reserve discarded at its Renew');
  E.apply(S, { type: 'pass' }); // back to P0
  assert.equal(S.players[0].reserve, 0, 'P0 reserve discarded at Renew');
  // Main plays are paid from breath only
  const T = fixture(); T.players[0].breath = 0; T.players[0].reserve = 2;
  const k = give(T, 0, 'fire.kindle'); place(T, 0, 'fire.ember');
  assert.ok(!E.legalActions(T).some(a => a.card === k.pid));
});

test('C: defender responds from reserve; answer uses ordinary breath; resolve answer → response → original; no fourth node', () => {
  const S = fixture();
  const att = place(S, 0, 'life.stag'); // 3/4
  const blk = place(S, 1, 'water.pike'); // 3/4 blocks
  S.players[1].reserve = 2; S.players[0].breath = 5;
  const guard = give(S, 1, 'earth.guard'); // defender: Pike +2 stand
  const kin = give(S, 0, 'fire.kindle'); // answer: Stag +1 strike
  const order = [];
  const ctl = {
    block: () => blk.id,
    respond: (S2, side, kind) => {
      order.push(kind);
      if (kind === 'response') return { type: 'spell', card: guard.pid, target: blk.id };
      if (kind === 'answer') return { type: 'spell', card: kin.pid, target: att.id };
      return null;
    },
  };
  E.apply(S, { type: 'attack', subject: att.id, verb: 'strike', target: 'rival' }, ctl);
  assert.deepEqual(order, ['response', 'answer'], 'exactly one response and one answer');
  assert.equal(S.players[1].reserve, 1); assert.equal(S.players[0].breath, 5 - 1 - 1);
  const decl = S.events.filter(e => e.type === 'declare').map(e => e.kind);
  assert.deepEqual(decl, ['main', 'response', 'answer']);
  const spent = S.events.filter(e => e.type === 'grave' && e.reason === 'spent').map(e => e.pid);
  assert.deepEqual(spent, [kin.pid, guard.pid], 'answer resolves first, then response');
  // packet 4 (3 + Kindle) into Pike 3/6 -> survives with 4 damage; Stag takes 3
  assert.equal(blk.damage, 4); assert.equal(att.damage, 3);
  assert.equal(E.legalResponses(S, 1, 'response').length, 0, 'clause closed');
  audit(S);
});

test('C: no answer window when the defender passes', () => {
  const S = fixture();
  const att = place(S, 0, 'life.hare');
  let asked = [];
  E.apply(S, { type: 'attack', subject: att.id, verb: 'strike', target: 'rival' }, { block: noBlock, respond: (S2, side, kind) => { asked.push(kind); return null; } });
  assert.deepEqual(asked, ['response']);
});

test('C: committed blocker returned by a response — attack misses, no redirect to rival', () => {
  const S = fixture();
  const att = place(S, 0, 'life.stag');
  const blk = place(S, 1, 'life.hare'); // 1/2 blocks
  const gust = give(S, 0, 'air.gust'); S.players[0].breath = 5; // the attacker answers by Gusting the committed blocker
  const dew = give(S, 1, 'water.dew'); S.players[1].reserve = 1;
  E.apply(S, { type: 'attack', subject: att.id, verb: 'strike', target: 'rival' },
    script({ block: blk.id, response: { type: 'spell', card: dew.pid, target: blk.id }, answer: { type: 'spell', card: gust.pid, target: blk.id } }));
  assert.ok(!S.things.includes(blk));
  assert.equal(S.players[1].life, 30, 'missed, not redirected');
  assert.equal(S.events.filter(e => e.type === 'failed').length, 2, 'Dew target gone, attack missed');
  audit(S);
});

test('C: subject removed before its action resolves — action fails, costs stay paid, card spent', () => {
  const S = fixture();
  const otter = place(S, 0, 'water.otter'); // 2 strike, non-heavy
  const seep = give(S, 0, 'water.seep');
  const gust = give(S, 1, 'air.gust'); S.players[1].reserve = 2;
  const before = S.players[0].breath;
  E.apply(S, { type: 'remote', subject: otter.id, card: seep.pid, target: 'rival' }, script({ response: { type: 'spell', card: gust.pid, target: otter.id } }));
  assert.equal(S.players[1].life, 30);
  assert.equal(S.players[0].breath, before - 1, 'no refund');
  assert.ok(S.players[0].hand.some(c => c.pid === otter.pid), 'Otter back in hand');
  assert.equal(S.players[0].grave.find(c => c.pid === seep.pid).reason, 'failed');
  audit(S);
});

test('C: countered spell — Doubt cancels a pending Spell; paid card and breath stay spent', () => {
  const S = fixture();
  const t = place(S, 0, 'life.stag');
  const kin = give(S, 0, 'fire.kindle');
  const doubt = give(S, 1, 'word.doubt'); S.players[1].reserve = 2;
  assert.ok(!E.legalActions(S).some(a => a.card === doubt.pid), 'Doubt is response-only');
  E.apply(S, { type: 'spell', card: kin.pid, target: t.id }, script({ response: { type: 'spell', card: doubt.pid, target: 'node:0' } }));
  assert.equal(E.curStrike(S, t), 3, 'Kindle cancelled');
  assert.equal(S.players[0].breath, 7);
  assert.equal(S.players[0].grave.find(c => c.pid === kin.pid).reason, 'countered');
  audit(S);
});

test('C: direct target becomes airborne after declaration — reach revalidated, attack fails', () => {
  const S = fixture();
  const att = place(S, 0, 'life.stag');
  const crow = place(S, 1, 'air.crow', { exhausted: true, status: { wet: true } }); // wet wings: grounded
  assert.ok(!E.has(S, crow, 'flying'));
  const tgt = { type: 'attack', subject: att.id, verb: 'strike', target: crow.id };
  E.apply(S, tgt, { block: noBlock, respond: (S2, side, kind) => { if (kind === 'response') { delete crow.status.wet; } return null; } }); // stand-in for an un-wetting effect
  assert.equal(crow.damage, 0);
  assert.equal(S.events.filter(e => e.type === 'failed').length, 1);
});

test('C: blocker incapacitated by a response still takes the damage but cannot retaliate', () => {
  const S = fixture();
  const att = place(S, 0, 'life.stag'); // 3/4
  const blk = place(S, 1, 'water.pike'); // 3/4
  const sl = give(S, 0, 'water.sleep');
  const dew = give(S, 1, 'water.dew'); S.players[1].reserve = 1;
  E.apply(S, { type: 'attack', subject: att.id, verb: 'strike', target: 'rival' },
    script({ block: blk.id, response: { type: 'spell', card: dew.pid, target: blk.id }, answer: { type: 'spell', card: sl.pid, target: blk.id } }));
  assert.equal(att.damage, 0, 'asleep blocker cannot retaliate');
  assert.equal(blk.damage, 3);
  assert.ok(!blk.status.asleep, 'positive damage wakes it');
});

test('C: Guard cannot bypass readiness; +2 stand ends at this End, Guard keyword at its controller End', () => {
  const S = fixture({ first: 0 });
  const tired = place(S, 0, 'life.stag', { exhausted: true });
  const g = give(S, 0, 'earth.guard');
  E.apply(S, { type: 'spell', card: g.pid, target: tired.id }, noBlock);
  assert.equal(E.standOf(S, tired), 6);
  const att = place(S, 1, 'life.hare'); // 1/2
  const friend = place(S, 0, 'water.eel');
  // exhausted Guard cannot intercept
  S.active = 1; tired.ctrl = 0;
  const seen = [];
  E.apply(S, { type: 'attack', subject: att.id, verb: 'strike', target: friend.id }, (S2, info) => { seen.push(...info.candidates.map(b => b.id)); return null; });
  assert.ok(!seen.includes(tired.id));
  // defender casts Guard off-turn on a ready Thing: +2 stand expires at this (rival's) End
  const S2 = fixture({ first: 1 });
  const rdy = place(S2, 0, 'life.stag'); const g2 = give(S2, 0, 'earth.guard'); S2.players[0].reserve = 1;
  const a2 = place(S2, 1, 'life.hare'); const cut = place(S2, 0, 'water.eel');
  E.apply(S2, { type: 'attack', subject: a2.id, verb: 'strike', target: 'rival' }, script({ response: { type: 'spell', card: g2.pid, target: rdy.id } }));
  assert.equal(E.standOf(S2, rdy), 6); assert.ok(E.has(S2, rdy, 'guard'));
  E.apply(S2, { type: 'pass' }); // P1's End: +2 stand gone; P0's Guard keyword lasts until P0's End
  assert.equal(E.standOf(S2, rdy), 4);
  assert.ok(E.has(S2, rdy, 'guard'));
  E.apply(S2, { type: 'pass' }); // P0's End
  assert.ok(!E.has(S2, rdy, 'guard'));
  void cut;
});

test('C: Ward (Protect) absorbs a hostile targeted Gust; the Thing stays', () => {
  const S = fixture();
  const t = place(S, 1, 'life.hare');
  const pr = give(S, 1, 'word.protect'); S.players[1].reserve = 1;
  const gust = give(S, 0, 'air.gust');
  // Protect played in response to Gust resolves first
  E.apply(S, { type: 'spell', card: gust.pid, target: t.id }, script({ response: { type: 'spell', card: pr.pid, target: t.id } }));
  assert.ok(S.things.includes(t));
  assert.ok(!t.status.ward, 'Ward consumed');
});

test('C: Kindle ignition rider — kindled attacker ignites a surviving flammable target', () => {
  const S = fixture();
  const a = place(S, 0, 'water.eel'); // 1/2, not hot
  const k = give(S, 0, 'fire.kindle');
  const v = place(S, 1, 'life.stag', { exhausted: true }); // flammable 3/4
  E.apply(S, { type: 'spell', card: k.pid, target: a.id }, noBlock);
  E.apply(S, { type: 'attack', subject: a.id, verb: 'strike', target: v.id }, noBlock);
  assert.equal(v.status.burning, 2);
});

test('C: two simultaneous death triggers — active player first, then entry order', () => {
  const S = fixture({ first: 0 });
  const mine = place(S, 0, 'rot.rat'); const theirs = place(S, 1, 'rot.rat');
  place(S, 0, 'life.stag'); place(S, 1, 'life.stag');
  theirs.entry = 1; mine.entry = 50; // the rival's rat entered first, but the active player's trigger still goes first
  mine.damage = 5; theirs.damage = 5; E.stateCheck(S);
  const tr = S.events.filter(e => e.type === 'trigger');
  assert.deepEqual(tr.map(e => e.source), [mine.id, theirs.id]);
});

test('C: visibility — a bot decision is identical whatever the rival holds in hand', () => {
  for (const seed of [21, 22, 23, 24]) {
    const S = E.createMatch({ decks: [DECKS.earthWater, DECKS.fireAir], seed });
    const pol = () => 'careful', ctl = B.controller(pol);
    for (let k = 0; k < 12 && S.over == null; k++) E.apply(S, B.chooseAction(S, pol), ctl);
    if (S.over != null) continue;
    const a1 = B.chooseAction(S, pol);
    const rival = S.players[1 - S.active];
    const saved = rival.hand; rival.hand = rival.hand.map(c => ({ ...c, word: 'air.gust' }));
    const a2 = B.chooseAction(S, pol);
    rival.hand = saved;
    assert.deepEqual(a1, a2);
  }
});

test('C: deterministic replay with responses on', () => {
  const run = () => playOne('wall', 'tide', 77, 'v29', 0, ['careful', 'aggressive'], { set: 'R', audit: true });
  assert.deepEqual(run(), run());
});

test('C/F: visibility — a bot decision is identical whatever a Concealed enemy Thing really is', () => {
  const { fixture, place } = require('./helpers');
  for (const word of ['word.hermit', 'life.stag', 'rot.ghost']) {
    const S = fixture(); const h = place(S, 1, word, { status: { concealed: true } }); place(S, 0, 'life.wolf'); place(S, 0, 'fire.ember');
    const pol = () => 'careful';
    const pick = B.chooseAction(S, pol);
    h.word = 'word.hermit'; const ref = B.chooseAction(S, pol);
    assert.deepEqual(pick, ref, word);
  }
});
