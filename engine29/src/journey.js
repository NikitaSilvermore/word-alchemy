// Journey encounter contract (§14.5). The duel is a pure function of (format, decks, seed, inputs); the Journey only
// reads a stable result. Rewards are idempotent: replaying or resuming an encounter never pays twice. Match resources
// (breath, spark, catalyst) never leave the match; permanent flags are kept separately and never alter duel rules.
'use strict';
const B = require('./bots');
const { recordMatch } = require('./replay');
const { resolveFormat } = require('./formats');
const { REFERENCE_DECKS } = require('../data/reference_decks');
const { BY_ID } = require('./cards');

// Rival registry: §10.3 rivals → reference decks and intended AI tier (§10.4).
const RIVALS = {
  dorothea_finch_1: { deck: 'D1_living_sky', tier: 'apprentice' },
  pieter_bream: { deck: 'D2_lockkeepers_wall', tier: 'initiate' },
  mara_flint: { deck: 'D3_furnace_wind', tier: 'journeyman' },
  hester_bale: { deck: 'D4_orchard', tier: 'journeyman' },
  tess_harrow: { deck: 'D5_clay_and_gold', tier: 'specialist' },
  ruth_spindle: { deck: 'D6_returning_earth', tier: 'specialist' },
  dorothea_finch_2: { deck: 'D4B_experimentalist', tier: 'expert' },
  ambrose_tickell: { deck: 'D7_speaking_house', tier: 'expert' },
  dorothea_finch_3: { deck: 'D8_garden_of_endings', tier: 'master' },
  lucan_reeve: { deck: 'D5B_patient_ruin', tier: 'master' },
};

function botAgent(policy) {
  const pol = () => policy, ctl = B.controller(pol), dec = B.decider(pol);
  return { mulligan: B.mulligan, act: S => B.chooseAction(S, pol), block: ctl.block, respond: ctl.respond, decide: dec };
}

// contract: { encounterId, opponentId, opponentDeckId?, format, onWin, onLoss, rewardWord? }
function validateContract(c) {
  const errs = [];
  for (const k of ['encounterId', 'opponentId', 'format', 'onWin', 'onLoss']) if (!c[k]) errs.push('missing ' + k);
  if (c.opponentId && !RIVALS[c.opponentId]) errs.push('unknown opponent ' + c.opponentId);
  try { resolveFormat(c.format); } catch (e) { errs.push(e.message); }
  if (c.rewardWord && !(BY_ID[c.rewardWord] && BY_ID[c.rewardWord].deckLegal)) errs.push('reward is not a collectible word ' + c.rewardWord);
  return errs;
}

// The player's agent supplies inputs (a UI, or a bot for testing). The player sits in seat 0.
function runEncounter(contract, { playerDeck, playerAgent, seed, first = 0, concede = null }) {
  const errs = validateContract(contract); if (errs.length) throw new Error(errs.join('; '));
  const rv = RIVALS[contract.opponentId];
  const oppDeck = REFERENCE_DECKS[contract.opponentDeckId || rv.deck].words;
  const agents = [playerAgent, botAgent('careful:' + rv.tier)];
  const { replay, state } = recordMatch({ format: contract.format, decks: [playerDeck, oppDeck], seed, first }, agents);
  const outcome = concede ? 'concession' : state.over === 0 ? 'win' : state.over === 'draw' ? 'draw' : 'loss';
  const discoveries = [...new Set(state.events.filter(e => e.type === 'made' && e.side === 0).map(e => e.recipe))];
  const played = state.stats.res[0].played;
  return {
    encounterId: contract.encounterId, opponentId: contract.opponentId, outcome,
    winner: state.over === 'draw' ? 'draw' : state.over === 0 ? 'player' : 'rival',
    format: contract.format, formatVersion: replay.formatVersion, replayId: replay.id,
    next: outcome === 'win' ? contract.onWin : contract.onLoss,
    rewardEligible: outcome === 'win' && !!contract.rewardWord, rewardWord: contract.rewardWord || null,
    discoveries, // recipes the player actually formed in this duel
    masteryEvents: Object.entries(played).map(([word, n]) => ({ word, uses: n })),
    replay,
  };
}

// Persistent profile: separate flags for learnt / scribed / owned / mastered / discovered, plus a reward ledger.
function newProfile() { return { learnt: {}, scribed: {}, owned: {}, mastered: {}, discovered: {}, rewardsPaid: {}, applied: {} }; }
function applyResult(profile, result) {
  const p = JSON.parse(JSON.stringify(profile));
  if (p.applied[result.replayId]) return p; // resuming or replaying a finished duel changes nothing
  p.applied[result.replayId] = true;
  for (const r of result.discoveries) p.discovered[r] = true; // never marked unless formed in real play
  for (const m of result.masteryEvents) p.mastered[m.word] = (p.mastered[m.word] || 0) + m.uses; // use counts; mastery thresholds belong to the Journey
  if (result.rewardEligible && !p.rewardsPaid[result.encounterId]) { // idempotent: one payment per encounter, ever
    p.rewardsPaid[result.encounterId] = result.replayId;
    p.owned[result.rewardWord] = (p.owned[result.rewardWord] || 0) + 1;
  }
  return p;
}

module.exports = { RIVALS, botAgent, validateContract, runEncounter, newProfile, applyResult };
