// Stage D (economy) regression tests — spec §3.1–3.2, §4.2–4.5, §14.4.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { E, DECKS, fixture, place, give } = require('./helpers');
const B = require('../src/bots');
const { playOne } = require('../sim/run');

const noBlock = () => null;
const audit = S => assert.deepEqual(E.zoneAudit(S), []);
const match = (o = {}) => E.createMatch({ decks: [DECKS.earthWater, DECKS.fireAir], seed: 5, first: 0, ...o });

test('D: opening — 5 each, starting player skips first draw, second player draws on its first turn', () => {
  const S = match();
  assert.equal(S.players[0].hand.length, 5);
  assert.equal(S.players[1].hand.length, 5);
  E.apply(S, { type: 'pass' });
  assert.equal(S.players[1].hand.length, 6);
  audit(S);
});

test('D: one partial mulligan — set-aside cards go back into the deck, hand size kept, deterministic', () => {
  const pick = (S, i) => S.players[i].hand.slice(0, 3).map(c => c.pid);
  const S1 = match({ mulligan: pick }), S2 = match({ mulligan: pick });
  assert.deepEqual(S1.players.map(p => p.hand.map(c => c.pid)), S2.players.map(p => p.hand.map(c => c.pid)));
  const S0 = match();
  const firstThree = S0.players[0].hand.slice(0, 3).map(c => c.pid);
  assert.equal(S1.players[0].hand.length, 5);
  assert.equal(S1.players[0].deck.length, 15);
  for (const pid of firstThree) assert.ok(S1.players[0].deck.some(c => c.pid === pid), 'set-aside card shuffled back');
  assert.throws(() => E.applyMulligan(S1, 0, []), /one mulligan/);
  audit(S1);
});

test('D: singleton decks — duplicate words rejected', () => {
  assert.ok(E.deckErrors(DECKS.earthWater.slice(0, 19).concat(['water.eel'])).some(e => /distinct/.test(e)));
});

test('D: spark — +1 guaranteed each own turn, +1 for the first successful paid hand sentence, none for a basic strike, cap 5', () => {
  const S = fixture();
  S.players[0].spark = 0; S.players[0].sentenceSpark = false;
  const t = place(S, 0, 'life.stag');
  E.apply(S, { type: 'attack', subject: t.id, verb: 'strike', target: 'rival' }, noBlock);
  assert.equal(S.players[0].spark, 0, 'basic strike earns nothing');
  const c = give(S, 0, 'water.eel');
  E.apply(S, { type: 'deploy', card: c.pid }, noBlock);
  assert.equal(S.players[0].spark, 1);
  const c2 = give(S, 0, 'life.hare');
  E.apply(S, { type: 'deploy', card: c2.pid }, noBlock);
  assert.equal(S.players[0].spark, 1, 'only the first sentence each turn');
  S.players[0].spark = 5; S.players[0].sentenceSpark = false;
  const c3 = give(S, 0, 'water.otter');
  E.apply(S, { type: 'deploy', card: c3.pid }, noBlock);
  assert.equal(S.players[0].spark, 5, 'cap 5');
  const M = match(); const before = M.players[1].spark;
  E.apply(M, { type: 'pass' });
  assert.equal(M.players[1].spark, before + 1, 'guaranteed income at the market step');
});

test('D: spark — countered, failed, Ward-absorbed and off-turn sentences earn none', () => {
  const S = fixture();
  const t = place(S, 0, 'life.stag'); const k = give(S, 0, 'fire.kindle');
  const d = give(S, 1, 'word.doubt'); S.players[1].reserve = 2;
  E.apply(S, { type: 'spell', card: k.pid, target: t.id }, { block: noBlock, respond: (S2, side, kind) => kind === 'response' ? { type: 'spell', card: d.pid, target: 'node:0' } : null });
  assert.equal(S.players[0].spark, 0, 'countered');
  assert.equal(S.players[1].spark, 0, 'off-turn response');
  const v = place(S, 1, 'life.hare'); v.status.ward = true;
  const g = give(S, 0, 'air.gust');
  E.apply(S, { type: 'spell', card: g.pid, target: v.id }, noBlock);
  assert.equal(S.players[0].spark, 0, 'absorbed by Ward: no effect, no spark');
});

test('D: market — 5 offers by origin (2 own, 2 rival, 1 outside), no duplicates, reproducible from the seed', () => {
  const a = match(), b = match();
  assert.deepEqual(a.market, b.market);
  assert.equal(a.market.length, 5);
  const sA = a.players[0].schools, sB = a.players[1].schools;
  const sch = o => E.card({ word: o.word }).school;
  assert.ok(sA.includes(sch(a.market[0])) && sA.includes(sch(a.market[1])));
  assert.ok(sB.includes(sch(a.market[2])) && sB.includes(sch(a.market[3])));
  assert.ok(!sA.includes(sch(a.market[4])) && !sB.includes(sch(a.market[4])));
  audit(a);
});

test('D: purchase — own school 2 spark, off-school 3 and once per duel, one purchase per turn, slot empty until next market step', () => {
  const S = match();
  const p = S.players[0]; p.spark = 5;
  const own = S.market.find(o => p.schools.includes(E.card({ word: o.word }).school));
  const off = S.market.find(o => !p.schools.includes(E.card({ word: o.word }).school));
  assert.equal(E.priceOf(S, 0, own.word), 2); assert.equal(E.priceOf(S, 0, off.word), 3);
  E.apply(S, { type: 'buy', slot: off.slot });
  assert.equal(p.spark, 2); assert.equal(S.market[off.slot], null);
  const bought = p.hand.at(-1); assert.equal(bought.word, off.word); assert.ok(/^m/.test(bought.pid), 'distinct physical card');
  assert.ok(!E.legalActions(S).some(a => a.type === 'buy'), 'one purchase per own turn');
  E.apply(S, { type: 'pass' }); E.apply(S, { type: 'pass' });
  assert.notEqual(S.market[off.slot], null, 'replenished at the next market step');
  p.spark = 5;
  for (const o of S.market) if (o && !p.schools.includes(E.card({ word: o.word }).school)) assert.ok(!E.legalActions(S).some(a => a.type === 'buy' && a.slot === o.slot), 'second off-school purchase refused');
  audit(S);
});

test('D: copy limit — at most 2 of any word through deck + market; buying needs hand space; no Clause opens', () => {
  const S = match();
  const p = S.players[0]; p.spark = 5;
  const o = S.market.find(x => p.schools.includes(E.card({ word: x.word }).school));
  p.acquired[o.word] = 2;
  assert.ok(!E.legalActions(S).some(a => a.type === 'buy' && a.slot === o.slot));
  p.acquired[o.word] = 1;
  while (p.hand.length < 7) p.hand.push(p.deck.shift());
  assert.ok(!E.legalActions(S).some(a => a.type === 'buy'), 'full hand');
  p.deck.unshift(p.hand.pop());
  let asked = false;
  E.apply(S, { type: 'buy', slot: o.slot }, { respond: () => { asked = true; return null; } });
  assert.equal(asked, false, 'market purchases do not open a response window');
  assert.equal(p.acquired[o.word], 2);
});

test('D: catalyst — start 1, max 1; replenishing costs 2 spark and uses the turn\'s purchase', () => {
  const S = match(); const p = S.players[0];
  assert.equal(p.catalyst, 1);
  p.spark = 5;
  assert.ok(!E.legalActions(S).some(a => a.type === 'catalyst'), 'already full');
  p.catalyst = 0;
  E.apply(S, { type: 'catalyst' });
  assert.equal(p.catalyst, 1); assert.equal(p.spark, 3);
  assert.ok(!E.legalActions(S).some(a => a.type === 'buy'));
});

test('D: market refresh at the start of round 3 replaces remaining offers; never duplicates', () => {
  const S = match();
  const pol = () => 'careful', ctl = B.controller(pol);
  let r2 = null;
  while (S.round < 3 && S.over == null) { if (S.round === 2 && S.active === 1) r2 = S.market.map(o => o && o.word); E.apply(S, { type: 'pass' }); }
  const r3 = S.market.map(o => o && o.word);
  assert.ok(r2);
  assert.notDeepEqual(r3, r2, 'offers replaced (seeded; equal by chance is very unlikely)');
  audit(S); void ctl;
});

test('D: extra breath capped at 2 per turn and the pool at 10', () => {
  const S = fixture(); const p = S.players[0];
  p.breath = 10; p.extraBreath = 0;
  const g = give(S, 0, 'air.gasp');
  E.apply(S, { type: 'spell', card: g.pid }, noBlock);
  assert.equal(p.breath, 10, '10 − 1 paid + 1 granted: pool cap 10 bounds the grant'); assert.equal(p.extraBreath, 1);
  p.breath = 4;
  const g2 = give(S, 0, 'air.gasp');
  E.apply(S, { type: 'spell', card: g2.pid }, noBlock);
  assert.equal(p.extraBreath, 2, 'only 1 more allowed this turn'); assert.equal(p.breath, 4);
  give(S, 0, 'air.gasp');
  assert.ok(!E.legalActions(S).some(a => a.type === 'spell' && E.card(S.players[0].hand.find(c => c.pid === a.card)).spell === 'gasp'), 'no further extra breath this turn');
});

test('D: bots cannot see future market offers', () => {
  const S = match();
  const c = B.redact(S, 0);
  assert.equal(c.mseed, null);
});

test('D: paired first-player games are true mirrors (same seed, starts swapped) and replay deterministically', () => {
  const a = playOne('wall', 'pack', 900, 'v29', 0, ['careful', 'careful'], { set: 'R', audit: true });
  const b = playOne('wall', 'pack', 900, 'v29', 1, ['careful', 'careful'], { set: 'R', audit: true });
  assert.equal(a.seed, b.seed); assert.notEqual(a.first, b.first);
  assert.deepEqual(playOne('wall', 'pack', 900, 'v29', 0, ['careful', 'careful'], { set: 'R' }), a);
});

test('D: initiative variants change only the second player', () => {
  const s = match({ initiative: 'card' }), b = match({ initiative: 'breath' }), z = match({ initiative: 'spark' });
  assert.equal(s.players[1].hand.length, 6); assert.equal(s.players[0].hand.length, 5);
  E.apply(b, { type: 'pass' }); assert.equal(b.players[1].breath, 2 + 1 + 1);
  assert.equal(z.players[1].spark, 2); assert.equal(z.players[0].spark, 1);
});
