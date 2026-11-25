// V32 The Workshop — controlled comparisons. Paired deals: every seed is played twice with seats swapped.
// usage: node sim/v32.js <arm> <dealsPerOpponent> <seed> <out.json> [tier] [invite=never|heuristic|always]
'use strict';
const E = require('../src/engine');
const F = require('../src/formats');
const B = require('../src/bots');
const { REF } = require('../data/reference_decks');
const { V2_DECKS: V } = require('../data/v32_decks');
const D = k => (V[k] ? V[k].words : REF[k]);

const ARMS = {
  // W5 reachability (life plus work) — the Maker against a patient predator and a wall
  W5: { deck: 'V11_world_tree_maker', format: 'v32_w5', opp: ['V08_patient_predator', 'D2_lockkeepers_wall'] },
  W5_ctrl: { deck: 'V11_world_tree_maker', format: 'v32_b', opp: ['V08_patient_predator', 'D2_lockkeepers_wall'] },
  // V — visiting an opposing orchard (reorder arm, draw arm, control)
  V: { deck: 'V01_neighbours_orchard', format: 'v32_visit', opp: ['V04_orchard_cellar'] },
  V_draw: { deck: 'V01_neighbours_orchard', format: 'v32_visit_draw', opp: ['V04_orchard_cellar'] },
  V_ctrl: { deck: 'V01_neighbours_orchard', format: 'v32_b', opp: ['V04_orchard_cellar'] },
  // H — borrowing the rival's heat
  H: { deck: 'V03_seal_engraver', format: 'v32_heat', opp: ['V13_giver_of_fire'] },
  H_ctrl: { deck: 'V03_seal_engraver', format: 'v32_b', opp: ['V13_giver_of_fire'] },
  H2: { deck: 'V02_bellows_ingot', format: 'v32_heat', opp: ['V13_giver_of_fire'] },
  H2_ctrl: { deck: 'V02_bellows_ingot', format: 'v32_b', opp: ['V13_giver_of_fire'] },
  // R — permissions: Fruit only, six core rows, broader overlay, control
  R_ctrl: { deck: 'V01_neighbours_orchard', format: 'v32_b', opp: ['V08_patient_predator', 'V11_world_tree_maker'] },
  R_fruit: { deck: 'V01_neighbours_orchard', format: 'v32_rfruit', opp: ['V08_patient_predator', 'V11_world_tree_maker'] },
  R_six: { deck: 'V01_neighbours_orchard', format: 'v32_r6', opp: ['V08_patient_predator', 'V11_world_tree_maker'] },
  R_ext: { deck: 'V01_neighbours_orchard', format: 'v32_rext', opp: ['V08_patient_predator', 'V11_world_tree_maker'] },
  // field capacity — same lists
  C5: { deck: 'V03_seal_engraver', format: 'v32_b', opp: ['V01_neighbours_orchard', 'V08_patient_predator'] },
  C6: { deck: 'V03_seal_engraver', format: 'v32_cap6', opp: ['V01_neighbours_orchard', 'V08_patient_predator'] },
  C5s: { deck: 'V03_seal_engraver', format: 'v32_supply', opp: ['V01_neighbours_orchard', 'V08_patient_predator'] },
  // creation value — Shape at 1 breath (own configuration) against the printed price
  Shape2: { deck: 'V03_seal_engraver', format: 'v32_b', opp: ['V08_patient_predator', 'D2_lockkeepers_wall'] },
  Shape1: { deck: 'V03_seal_engraver', format: 'v32_shape1', opp: ['V08_patient_predator', 'D2_lockkeepers_wall'] },
};

const modOf = (S, a) => {
  if (a.type === 'invite') return 'invite-' + a.kind; if (a.type === 'hotwork') return 'hotwork'; if (a.type === 'claim') return 'claim';
  if (a.ability === 'visit') return 'visit'; if (a.ability === 'signet') return 'signet'; if (a.recipe === 'set') return 'set';
  if (a.card) { const c = S.players[S.active].hand.find(h => h.pid === a.card); const id = c && E.card(c).id; if (id === 'earth.shape') return 'shape'; if (id === 'life.feast') return 'feast'; if (id === 'word.writ') return 'writ'; }
  if (a.type === 'attack') return 'attack';
  return null;
};
function w5Stage(S, me) {
  const mine = S.things.filter(t => t.ctrl === me), f = t => E.card(t).id;
  let st = 0;
  if (S.events.some(e => e.type === 'made' && e.side === me && /swamp/.test(e.form || e.recipe || ''))) st = 1;
  if (S.events.some(e => e.type === 'made' && e.side === me && /life/.test(e.form || e.recipe || ''))) st = Math.max(st, 2);
  if (S.events.some(e => e.type === 'made' && e.side === me && /world_tree/.test(e.form || e.recipe || ''))) st = Math.max(st, 3);
  if (mine.some(t => f(t) === 'made.world_tree' && E.w5Chain(t))) st = Math.max(st, 4);
  if (S.events.some(e => e.type === 'wt-growth' && e.side === me)) st = Math.max(st, 5);
  if (S.events.some(e => e.type === 'claim-declared' && e.side === me)) st = Math.max(st, 6);
  if (S.over === me && S.overCause === 'work') st = 7;
  return st;
}

// W5 chain pilot (reachability upper bound with legal, public-information play): takes any legal step along
// Clay + Water → Swamp, Seed + Swamp → Life, Oak + Life → World Tree, growing Seed/Sapling, deploying chain parts and
// declaring the work; otherwise it plays as its tier would. No hidden information is used.
const CHAIN_WORDS = new Set(['earth.clay', 'water.water', 'life.seed', 'life.sapling', 'life.oak']);
function chainPick(S, pol) {
  const xs = E.legalActions(S), me = S.active, hand = S.players[me].hand, word = pid => (hand.find(h => h.pid === pid) || {}).word;
  const pick = f => xs.find(f);
  return pick(a => a.type === 'claim') || pick(a => a.type === 'fuse' && ['world_tree', 'life', 'swamp'].includes(a.recipe))
    || pick(a => a.card && word(a.card) === 'life.grow' && S.things.some(t => t.id === a.target && ['life.seed', 'life.sapling'].includes(E.card(t).id)))
    || pick(a => (a.type === 'deploy' || a.type === 'ground') && CHAIN_WORDS.has(word(a.card)))
    || B.chooseAction(S, pol);
}
function play(arm, oppName, seed, subjectSide, pols) {
  const f = F.resolveFormat(arm.format);
  const decks = subjectSide === 0 ? [D(arm.deck), D(oppName)] : [D(oppName), D(arm.deck)];
  const S = E.createMatch({ decks, seed, first: 0, initiative: f.initiative, variant: f.variant, mulligan: B.mulligan, marketBreath: f.marketBreath });
  const pol = i => pols[i]; const ctl = B.controller(pol); E.setDecider(S, B.decider(pol));
  const me = subjectSide, fun = {};
  const bump = (k, f2) => { fun[k] = fun[k] || { offered: 0, chosen: 0 }; fun[k][f2]++; };
  const seen = new Set();
  for (let k = 0; k < 2000 && S.over == null; k++) {
    for (const c of S.players[me].hand) seen.add(c.word); for (const t of S.things) if (t.owner === me && t.word) seen.add(t.word); if (S.players[me].ground) seen.add(S.players[me].ground.word);
    const a = S.active === subjectSide && process.env.V32_CHAIN ? chainPick(S, pol) : B.chooseAction(S, pol);
    if (S.active === me) { const offered = new Set(E.legalActions(S).map(x => modOf(S, x)).filter(Boolean)); for (const m of offered) bump(m, 'offered'); const ch = modOf(S, a); if (ch) bump(ch, 'chosen'); }
    E.apply(S, a, ctl);
  }
  const ev = S.events, cnt = (t, side) => ev.filter(e => e.type === t && (side == null || e.side === side)).length;
  const sideEv = side => Object.fromEntries(['invite-open', 'invite-void', 'invite-cancelled', 'visited', 'heat-fee', 'hotworked', 'wt-growth', 'claim-declared', 'claim-broken', 'claim-failed'].map(t => [t, cnt(t, side)]).filter(x => x[1]));
  return { arm: arm.name, opp: oppName, seed, subjectSide, pols, win: S.over === 'draw' ? 'draw' : S.over == null ? 'cap' : S.over === me ? 'win' : 'loss', cause: S.overCause || 'life', rounds: S.round,
    life: [S.players[me].life, S.players[1 - me].life], fun, me: sideEv(me), rival: sideEv(1 - me), w5: w5Stage(S, me), parts: ['earth.clay', 'water.water', 'life.seed'].filter(w => seen.has(w)).length + (seen.has('life.oak') || seen.has('life.sapling') ? 1 : 0), displaced: ev.filter(e => e.type === 'displaced').length, hash: S.hashes.at(-1) };
}

function main() {
  const [armId, nStr = '10', seedStr = '62000', out = '/tmp/v32.json', tier = 'journeyman:ra', invite = 'heuristic'] = process.argv.slice(2);
  if (!ARMS[armId]) throw new Error('unknown arm ' + armId);
  B.V32_OPTS.invite = invite;
  const arm = { ...ARMS[armId], name: armId }, rows = [], t0 = Date.now();
  arm.opp.forEach((oname, oi) => {
    for (let g = 0; g < +nStr; g++) {
      const seed = +seedStr + oi * 1000 + g, style = g % 2 ? 'aggressive' : 'careful';
      const subj = (process.env.V32_SUBJECT_STYLE || (tier.startsWith('planner') ? 'builder' : style)) + ':' + tier, opp = style + ':' + (process.env.V32_OPP_TIER || 'journeyman:ra');
      for (const side of [0, 1]) rows.push(play(arm, oname, seed, side, side === 0 ? [subj, opp] : [opp, subj]));
    }
  });
  require('fs').writeFileSync(out, JSON.stringify({ arm: armId, tier, invite, n: rows.length, ms: Date.now() - t0, rows }));
  const w = rows.filter(r => r.win === 'win').length;
  console.log(armId, tier, invite, 'games', rows.length, 'subject wins', w, (100 * w / rows.length).toFixed(1) + '%', 'secs', ((Date.now() - t0) / 1000).toFixed(0));
}
if (require.main === module) main();
module.exports = { ARMS, play };
