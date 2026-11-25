// V30 foundation — versioned formats, reproducible replays, Journey encounter contract, idempotent rewards.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { FORMATS, resolveFormat, createFromFormat } = require('../src/formats');
const { recordMatch, replayMatch } = require('../src/replay');
const J = require('../src/journey');
const { REF } = require('../data/reference_decks');

test('V30: formats are versioned; the candidate pins the stage H initiative rule; aliases resolve', () => {
  assert.equal(resolveFormat('grammar_v30_rc1').initiative, 'combo2');
  assert.equal(resolveFormat('journey_standard').initiative, 'combo2');
  assert.equal(resolveFormat('grammar_v29_spec').initiative, 'spec');
  const S = createFromFormat('grammar_v30_rc1', { decks: [REF.D1_living_sky, REF.D2_lockkeepers_wall], seed: 3, first: 0 });
  assert.equal(S.formatVersion, '0.30.0-rc1');
  for (const f of Object.values(FORMATS)) assert.ok(f.version);
});

test('V30: a recorded match replays input-for-input to identical state hashes and result', () => {
  const agents = [J.botAgent('careful:journeyman'), J.botAgent('aggressive:journeyman')];
  const { replay, state } = recordMatch({ format: 'grammar_v30_rc1', decks: [REF.D3_furnace_wind, REF.D6_returning_earth], seed: 77, first: 1 }, agents);
  assert.ok(replay.inputs.length > 20 && state.over != null);
  const r = replayMatch(JSON.parse(JSON.stringify(replay)));
  assert.ok(r.ok); assert.equal(r.state.hashes.at(-1), state.hashes.at(-1));
  const bad = JSON.parse(JSON.stringify(replay)); const i = bad.inputs.findIndex(x => x.kind === 'act' && x.value.type !== 'pass'); bad.inputs[i].value = { type: 'pass' };
  assert.throws(() => replayMatch(bad), /diverged|mismatch|illegal/);
});

test('V30: Journey encounter contract returns a stable result; rewards are paid once however often it is replayed', () => {
  const contract = { encounterId: 'bramble_cross_dorothea_01', opponentId: 'dorothea_finch_1', format: 'journey_standard', onWin: 'dorothea_first_win', onLoss: 'dorothea_first_loss', rewardWord: 'air.owl' };
  assert.deepEqual(J.validateContract(contract), []);
  assert.ok(J.validateContract({ ...contract, rewardWord: 'made.phoenix' }).length, 'made-only forms are never rewards');
  let res = null;
  for (let s = 1; s < 12 && (!res || res.outcome !== 'win'); s++) res = J.runEncounter(contract, { playerDeck: REF.D6_returning_earth, playerAgent: J.botAgent('careful:specialist'), seed: s });
  assert.equal(res.outcome, 'win'); assert.equal(res.next, 'dorothea_first_win'); assert.equal(res.formatVersion, '0.30.0-rc1'); assert.ok(res.replayId);
  let p = J.applyResult(J.newProfile(), res);
  assert.equal(p.owned['air.owl'], 1);
  p = J.applyResult(p, res); assert.equal(p.owned['air.owl'], 1, 'replay/resume pays nothing twice');
  const again = J.runEncounter(contract, { playerDeck: REF.D6_returning_earth, playerAgent: J.botAgent('careful:specialist'), seed: res.replay.seed });
  assert.equal(again.replayId, res.replayId, 'same inputs, same replay id');
  assert.deepEqual(Object.keys(J.RIVALS).length, 10);
});

// §6 interpretation: a Guard block that loses its protected target. Reference semantics (rc1, unchanged):
// once committed, the block is the attack's recipient. The protected Thing leaving does not cancel or redirect the attack;
// the Guard still takes it and still strikes back. If the Guard itself leaves, the attack misses (no redirect).
test('V30: Guard block holds when the protected target disappears; a vanished blocker makes the attack miss', () => {
  const { fixture, place, E } = require('./helpers');
  for (const gone of ['target', 'blocker']) {
    const S = fixture(); S.active = 1;
    const att = place(S, 1, 'fire.salamander'), tgt = place(S, 0, 'water.eel'), grd = place(S, 0, 'water.ice');
    assert.ok(E.has(S, grd, 'guard'));
    const life0 = S.players[0].life, dmg0 = grd.damage;
    E.apply(S, { type: 'attack', subject: att.id, verb: 'strike', target: tgt.id }, {
      block: (S2, info) => { assert.ok(info.candidates.some(b => b.id === grd.id)); return grd.id; },
      respond: (S2, side) => { if (side === 0) E.leaveField(S2, gone === 'target' ? S2.things.find(t => t.id === tgt.id) : S2.things.find(t => t.id === grd.id), 'bounced'); return null; },
    });
    assert.deepEqual(E.zoneAudit(S), []);
    if (gone === 'target') { const g = S.things.find(t => t.id === grd.id); assert.ok(!g || g.damage > dmg0, 'the Guard takes the hit'); }
    else assert.ok(!S.things.find(t => t.id === tgt.id).damage, 'no redirect to the original target');
    assert.equal(S.players[0].life, life0);
  }
});
