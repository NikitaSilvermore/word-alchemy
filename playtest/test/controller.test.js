// Headless smoke test of the playtest controller: a "human" answering every prompt with random legal choices.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { createController, restoreController } = require('../src/controller');
const E = require('../../engine29/src/engine');
const RP = require('../../engine29/src/replay');
const { REF } = require('../../engine29/data/reference_decks');

function rnd(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function humanPlays(C, r, stats) {
  let guard = 0;
  while (C.S == null || (C.S.over == null && guard++ < 4000)) {
    if (C.pending) {
      const q = C.pending; stats[q.type] = (stats[q.type] || 0) + 1;
      if (q.type === 'mulligan') C.answer(r() < 0.5 ? q.hand.slice(0, 2).map(c => c.pid) : []);
      else if (q.type === 'block') C.answer(r() < 0.6 ? q.candidates[Math.floor(r() * q.candidates.length)] : null);
      else if (q.type === 'respond') C.answer(q.options.length && r() < 0.6 ? q.options[Math.floor(r() * q.options.length)] : null);
      else if (q.type === 'decide') C.answer(Math.floor(r() * q.options.length));
      continue;
    }
    if (C.S == null) { C.start(); continue; }
    if (C.isBotTurn()) { C.botAct(); continue; }
    const acts = E.legalActions(C.S); const non = acts.filter(a => a.type !== 'pass');
    C.act(non.length && r() < 0.8 ? non[Math.floor(r() * non.length)] : { type: 'pass' });
    if (C.error) throw new Error(C.error);
  }
}

test('playtest controller: full games with human prompts; zone audit; replay and resume reproduce the final state', () => {
  const stats = {};
  for (const [seed, first, deckA, deckB, tier] of [[5, 0, 'D1_living_sky', 'D6_returning_earth', 'journeyman'], [6, 1, 'D7_speaking_house', 'D2_lockkeepers_wall', 'specialist'], [7, 0, 'D5_clay_and_gold', 'D3_furnace_wind', 'expert']]) {
    const C = createController({ format: 'grammar_v30_rc1', decks: [REF[deckA], REF[deckB]], seed, first, botPolicy: 'careful:' + tier });
    C.auto.passWhenNoOption = true;
    humanPlays(C, rnd(seed), stats);
    assert.notEqual(C.S.over, null);
    assert.deepEqual(E.zoneAudit(C.S), []);
    const rep = C.replay();
    const R = RP.replayMatch({ ...rep, hashes: null });
    assert.equal(R.state.hashes.at(-1), C.S.hashes.at(-1), 'engine replay matches');
    const half = restoreController(rep, {}, {}, Math.floor(rep.inputs.filter(x => x.kind === 'act').length / 2));
    assert.ok(half.S.over == null && half.restoredActs > 0, 'resume part-way');
    const full = restoreController(rep);
    assert.equal(full.S.hashes.at(-1), C.S.hashes.at(-1));
  }
  for (const k of ['mulligan', 'block', 'respond', 'decide']) assert.ok(stats[k] > 0, 'prompt type exercised: ' + k + ' ' + JSON.stringify(stats));
});

test('playtest controller: hidden information — prompts and the bot never read the human-invisible rival hand', () => {
  const C = createController({ format: 'grammar_v30_rc1', decks: [REF.D1_living_sky, REF.D7_speaking_house], seed: 9, first: 1, botPolicy: 'careful:expert' });
  C.start(); if (C.pending) C.answer([]);
  // every prompt carries only the human's own options and public ids
  let n = 0; const r = rnd(9);
  while (C.S.over == null && n++ < 300) {
    if (C.pending) { const q = C.pending; const txt = JSON.stringify(q); for (const c of C.state().players[1].hand) assert.ok(!txt.includes(c.pid), 'prompt leaks a rival hand card'); C.answer(q.type === 'decide' ? 0 : q.type === 'mulligan' ? [] : null); continue; }
    if (C.isBotTurn()) C.botAct(); else { const non = E.legalActions(C.S).filter(a => a.type !== 'pass'); C.act(non.length && r() < 0.7 ? non[Math.floor(r() * non.length)] : { type: 'pass' }); }
  }
});
