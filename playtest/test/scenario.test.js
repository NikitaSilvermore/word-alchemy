// V32 scenario editor model: every V32 fixture validates and builds; illegal edits are refused with a reason;
// a scenario match replays exactly from the spec stored in its replay.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../../engine29/src/engine');
const B = require('../../engine29/src/bots');
const SC = require('../src/scenario');
const { FIXTURES, SPECS } = require('../src/fixtures');
const { createController, restoreController } = require('../src/controller');

test('every V32 fixture is a legal scenario with a clean zone audit', () => {
  for (const id of Object.keys(SPECS)) { const f = FIXTURES[id]; assert.deepEqual(SC.validate(f.spec).errors, [], id); assert.deepEqual(E.zoneAudit(f.build()), [], id); }
});
test('illegal edits are explained, not built', () => {
  const sp = JSON.parse(JSON.stringify(FIXTURES.w5_success.spec));
  sp.sides[0].hand.push('fire.ember'); assert.match(SC.validate(sp).errors.join(), /not in this side's list/);
  sp.sides[0].hand = ['life.wolf']; assert.match(SC.validate(sp).errors.join(), /placed twice/);
  sp.sides[0].hand = []; sp.sides[0].field.push({ word: 'life.hare' }, { word: 'life.pear' }, { word: 'life.sapling' }, { word: 'water.otter' }); assert.match(SC.validate(sp).errors.join(), /spaces/);
  const sp2 = JSON.parse(JSON.stringify(FIXTURES.h_heat.spec)); sp2.format = 'v32_b'; assert.match(SC.validate(sp2).errors.join(), /heat invitation needs/);
  assert.throws(() => SC.build(sp2));
  const c = SC.compatibility(FIXTURES.r_roles.spec, ['v32_b', 'v32_rfruit', 'v32_r6', 'v32_rext', 'grammar_v30_rc1']);
  assert.deepEqual(c.filter(x => x.ok).map(x => x.id), ['v32_b', 'v32_rfruit', 'v32_r6', 'v32_rext']); assert.ok(c.find(x => x.id === 'grammar_v30_rc1').why);
});
test('a scenario match replays from the spec in its replay', () => {
  const spec = JSON.parse(JSON.stringify(FIXTURES.w5_interrupt.spec));
  const C = createController({ format: spec.format, decks: [], seed: 0, first: spec.active, humanSide: 0, botPolicy: 'careful:journeyman:ra', fixture: SC.asFixture(spec) }, {});
  C.start(); let k = 0;
  while (C.S.over == null && k++ < 300) {
    if (C.pending) { const q = C.pending; C.answer(q.type === 'mulligan' ? [] : q.type === 'decide' ? q.dflt : null); continue; }
    if (C.isBotTurn()) C.botAct(); else C.act(B.chooseAction(C.S, () => 'careful:planner'));
  }
  const rep = JSON.parse(JSON.stringify(C.replay())); assert.ok(rep.scenario);
  const R = restoreController(rep, {}, Object.assign({}, FIXTURES, { __fromSpec: SC.asFixture }));
  assert.equal(R.S.hashes.at(-1), rep.finalHash);
});
