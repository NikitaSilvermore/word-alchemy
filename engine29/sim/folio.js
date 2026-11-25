// V31 Living Folio — controlled comparisons (Stage 4). Paired deals: the same seed is played twice with seats swapped.
// Every arm records, for the SUBJECT deck, a decision-level funnel for each module process:
//   drew (both inputs reached hand/field) → offered (a legal module action at a Main decision) → chosen → resolved / failed
//   → payoff used, plus disruption (module objects removed by the rival) and "offered but an ordinary move was preferred".
// usage: node sim/folio.js <arm> <dealsPerOpponent> <seed> <out.json> [policyTier]
'use strict';
const E = require('../src/engine');
const F = require('../src/formats');
const B = require('../src/bots');
const { REF } = require('../data/reference_decks');
const { FOLIO_DECKS, ABLATIONS, O_B, F_B, M_B } = require('../data/folio_decks');

const swap = (d, m) => d.map(w => m[w] || w);
const ARMS = {
  // package O (orchard) — against Furnace Wind first, then Returning Earth
  O_B: { deck: O_B, format: 'folio_b_orchard', opp: ['D3_furnace_wind', 'D6_returning_earth'] },
  O_A: { deck: ABLATIONS.O_A, format: 'grammar_v30_rc1', opp: ['D3_furnace_wind', 'D6_returning_earth'] },
  O_B_abundance: { deck: swap(O_B, { 'life.feast': 'life.abundance' }), format: 'folio_b_orchard', opp: ['D3_furnace_wind', 'D6_returning_earth'] }, // single-word Feast trial
  // package F (workshop)
  F_B: { deck: F_B, format: 'folio_b_workshop', opp: ['D2_lockkeepers_wall', 'D6_returning_earth'] },
  F_A: { deck: ABLATIONS.F_A, format: 'grammar_v30_rc1', opp: ['D2_lockkeepers_wall', 'D6_returning_earth'] },
  F_B_nowrit: { deck: swap(F_B, { 'word.writ': 'word.omen' }), format: 'folio_b_workshop', opp: ['D2_lockkeepers_wall', 'D6_returning_earth'] },
  // package M (decomposition + orchard words)
  M_B: { deck: M_B, format: 'folio_b_garden', opp: ['D7_speaking_house', 'D3_furnace_wind'] },
  M_A: { deck: ABLATIONS.M_A, format: 'grammar_v30_rc1', opp: ['D7_speaking_house', 'D3_furnace_wind'] },
  M_B_toadstool: { deck: swap(M_B, { 'rot.mould': 'rot.toadstool' }), format: 'folio_b_garden', opp: ['D7_speaking_house', 'D3_furnace_wind'] },
  // legacy controls so a rebuilt list is not credited to new rules
  D4_ref: { deck: REF.D4_orchard, format: 'grammar_v30_rc1', opp: ['D3_furnace_wind', 'D6_returning_earth'] },
  D5_ref: { deck: REF.D5_clay_and_gold, format: 'grammar_v30_rc1', opp: ['D2_lockkeepers_wall', 'D6_returning_earth'] },
  // C-life (isolated): same lists, the orchard and workshop relationships become delayed public processes
  O_C: { deck: O_B, format: 'folio_c_life', opp: ['D3_furnace_wind', 'D6_returning_earth'] },
  F_C: { deck: F_B, format: 'folio_c_life', opp: ['D2_lockkeepers_wall', 'D6_returning_earth'] },
  // combined modules: the three B lists against each other
  ALL_OvF: { deck: O_B, format: 'folio_b_all', oppDecks: { F_seal_cutter: F_B } },
  ALL_MvF: { deck: M_B, format: 'folio_b_all', oppDecks: { F_seal_cutter: F_B } },
  ALL_OvM: { deck: O_B, format: 'folio_b_all', oppDecks: { M_returning_garden: M_B } },
};

const MOD_ACTION = a => a.ability === 'bear' ? 'bear' : a.ability === 'shapeStart' ? 'shape' : a.type === 'complete' ? 'complete' : a.ability === 'pollinate' ? 'pollinate' : a.ability === 'shapeWork' ? 'shape' : a.ability === 'signet' ? 'signet' : a.ability === 'mould' ? 'mould'
  : a.recipe === 'set' ? 'set' : a.endorse ? 'writ' : null;
function cardMod(S, a) {
  if (!a.card) return null; const c = S.players[S.active].hand.find(h => h.pid === a.card); if (!c) return null;
  const id = E.card(c).id; return id === 'life.feast' ? 'feast' : id === 'earth.shape' ? 'shape' : id === 'word.writ' ? 'writ' : null;
}
const modOf = (S, a) => MOD_ACTION(a) || cardMod(S, a);
const INPUTS = { // which words make each process possible at all (drew = all of one row seen)
  pollinate: [['life.bee', 'life.pear'], ['air.wind', 'life.hazel']],
  bear: [['life.bee', 'life.pear'], ['air.wind', 'life.hazel']],
  feast: [['life.feast']],
  shape: [['earth.shape', 'earth.copper'], ['earth.shape', 'earth.silver'], ['fire.smith', 'earth.copper'], ['fire.smith', 'earth.silver']],
  set: [['earth.garnet', 'earth.copper'], ['earth.garnet', 'earth.silver']],
  writ: [['word.writ']],
  mould: [['rot.mould']],
};

function play(arm, deckOpp, oppName, seed, subjectSide, pols) {
  const f = F.resolveFormat(arm.format);
  const decks = subjectSide === 0 ? [arm.deck, deckOpp] : [deckOpp, arm.deck];
  const S = E.createMatch({ decks, seed, first: 0, initiative: f.initiative, variant: f.variant, mulligan: B.mulligan, marketBreath: f.marketBreath });
  const pol = i => pols[i]; const ctl = B.controller(pol); E.setDecider(S, B.decider(pol));
  const me = subjectSide, seen = new Set(), fun = {};
  const bump = (k, f2) => { fun[k] = fun[k] || { offered: 0, chosen: 0, declined: 0, resolved: 0, failed: 0 }; fun[k][f2]++; };
  for (let k = 0; k < 2000 && S.over == null; k++) {
    for (const c of S.players[me].hand) seen.add(c.word);
    for (const t of S.things) if (t.ctrl === me) seen.add(t.word);
    let a;
    if (S.active === me) {
      const legal = E.legalActions(S), offered = new Set(legal.map(x => modOf(S, x)).filter(Boolean));
      a = B.chooseAction(S, pol);
      const ch = modOf(S, a);
      for (const m of offered) { bump(m, 'offered'); if (m === ch) bump(m, 'chosen'); else bump(m, 'declined'); }
    } else a = B.chooseAction(S, pol);
    const before = S.events.length;
    E.apply(S, a, ctl);
    if (S.active === me || true) for (const e of S.events.slice(before)) if (e.type === 'failed' && e.act && modOf0(e.act)) bump(modOf0(e.act), 'failed');
  }
  // resolved processes (by events) and payoffs
  const ev = S.events, mineT = id => true; void mineT;
  const count = (pred) => ev.filter(pred).length;
  const res = {
    pollinate: count(e => e.type === 'pollinated' && thingSide(S, e) === me),
    feast: count(e => e.type === 'feast'), set: count(e => e.type === 'made' && e.recipe === 'set' && e.side === me),
    shape: count(e => e.type === 'transform' && e.to === 'earth.setting'), writ: count(e => e.type === 'endorse'), mould: count(e => e.type === 'sealed' && e.why === 'mould'),
    signet: count(e => e.type === 'signet-named'),
    bear: count(e => e.type === 'process-completed' && e.family === 'bear'),
  };
  const procs = (S.processes || []).filter(x => x.owner === me).reduce((a, x) => { const k = x.family + ':' + (x.closed || 'open'); a[k] = (a[k] || 0) + 1; return a; }, {});
  for (const [m, n] of Object.entries(res)) if (n) { fun[m] = fun[m] || { offered: 0, chosen: 0, declined: 0, resolved: 0, failed: 0 }; fun[m].resolved = n; }
  const drew = {}; for (const [m, rows] of Object.entries(INPUTS)) if (arm.deck.some(w => rows.some(r => r.includes(w)))) drew[m] = rows.some(r => r.every(w => seen.has(w))) ? 1 : 0;
  const fruitUse = { eaten: count(e => e.type === 'declare' && e.side === me && e.act.ability === 'eatFruit'), feast: res.feast ? count(e => e.type === 'declare' && e.side === me && e.act.sacrifice && /fruit/.test(String(tokWord(S, e.act.sacrifice)))) : 0 };
  const lost = count(e => (e.type === 'token-gone' || e.type === 'unmade') && e.how !== 'sacrificed' && e.how !== 'expired'); // module objects removed by combat/bounce (both sides; rough)
  return { arm: arm.name, opp: oppName, seed, subjectSide, first: S.first, win: S.over === 'draw' ? 'draw' : S.over == null ? 'cap' : S.over === me ? 'win' : 'loss', rounds: S.round,
    life: [S.players[me].life, S.players[1 - me].life], fun, drew, procs, fruitUse, lost, pols, lifeLost: S.stats.res[1 - me].lifeLost, hash: S.hashes.at(-1) };
}
function modOf0(act) { return act.ability === 'pollinate' ? 'pollinate' : act.ability === 'shapeWork' ? 'shape' : act.ability === 'mould' ? 'mould' : act.ability === 'signet' ? 'signet' : act.recipe === 'set' ? 'set' : act.endorse ? 'writ' : null; }
function thingSide(S, e) { const t = S.events.find(x => x.type === 'token' && x.tid === e.fruit); return t ? t.side : null; }
function tokWord() { return 'fruit'; }

function main() {
  const [armId, nStr = '20', seedStr = '50000', out = '/tmp/folio.json', tier = 'journeyman:ra'] = process.argv.slice(2);
  const arm = { ...ARMS[armId], name: armId }; if (!ARMS[armId]) throw new Error('unknown arm ' + armId);
  const opps = arm.oppDecks || Object.fromEntries(arm.opp.map(k => [k, REF[k]]));
  const out1 = [], t0 = Date.now(); let oi = 0;
  for (const [oname, od] of Object.entries(opps)) {
    for (let g = 0; g < +nStr; g++) {
      const seed = +seedStr + oi * 1000 + g; // the same seeds for every arm: paired by deal
      const style = process.env.FOLIO_STYLE ? process.env.FOLIO_STYLE : g % 2 ? 'aggressive' : 'careful';
      const pols = side => { const p = [style + ':' + tier, (process.env.FOLIO_OPP_STYLE || style) + ':' + tier]; return side === 0 ? p : [p[1], p[0]]; }; // subject gets `style`
      for (const side of [0, 1]) out1.push(play(arm, od, oname, seed, side, pols(side)));
    }
    oi++;
  }
  require('fs').writeFileSync(out, JSON.stringify(out1));
  console.log(out, out1.length, ((Date.now() - t0) / 1000).toFixed(0) + 's');
}
if (require.main === module) main();
module.exports = { ARMS, play };
