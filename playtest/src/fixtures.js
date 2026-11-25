// Diagnostic scenario fixtures (§3.8). Constructed positions, labelled as fixtures: they are not claimed to be
// reachable in a normal match. Each builds a fresh state under the rc1 reference rules; the human is player 0.
'use strict';
const F = require('../../engine29/src/formats');
const E = require('../../engine29/src/engine');
const { REF } = require('../../engine29/data/reference_decks');
const { FOLIO_DECKS } = require('../../engine29/data/folio_decks');
const SC = require('./scenario');

function base(first = 0) {
  const S = F.createFromFormat('grammar_v30_rc1', { decks: [REF.D1_living_sky, REF.D2_lockkeepers_wall], seed: 4242, first, mulligan: () => [] });
  for (const p of S.players) { p.deck.push(...p.hand); p.hand = []; p.breath = 8; p.reserve = 0; p.spark = 0; }
  S.market = S.market.map(() => null); // keep the fixture about the mechanic
  S.ptFixture = true;
  return S;
}
function fbase(first = 0, fmt = 'folio_b_all') { // V31 fixtures: Expanded Grammar with all three modules (or C-life)
  const S = F.createFromFormat(fmt, { decks: [fmt === 'folio_c_life' ? FOLIO_DECKS.O_orchard_crosswind.words : FOLIO_DECKS.M_returning_garden.words, FOLIO_DECKS.F_seal_cutter.words], seed: 4343, first, mulligan: () => [] });
  for (const p of S.players) { p.deck.push(...p.hand); p.hand = []; p.breath = 8; p.reserve = 0; p.spark = 0; }
  S.market = S.market.map(() => null); S.ptFixture = true; return S;
}
function place(S, side, word, o = {}) {
  const t = { id: 't' + (++S.seq), pid: 'fx' + S.seq, word, owner: side, ctrl: side, entry: S.seq, damage: 0, counters: {}, status: {}, exhausted: false, fresh: false, actions: 0, arrivedTurn: 0, ...o };
  S.things.push(t); if (t.pid) S.registry[t.pid] = true; return t;
}
function give(S, side, word) { const c = { pid: 'fh' + (++S.seq), word, owner: side }; S.players[side].hand.push(c); S.registry[c.pid] = true; return c; }
function ground(S, side, word) { const g = { pid: 'fg' + (++S.seq), word, owner: side, damage: 0 }; S.players[side].ground = g; S.registry[g.pid] = true; return g; }
function grave(S, side, word) { const g = { pid: 'fy' + (++S.seq), word, owner: side, reason: 'spent' }; S.players[side].grave.push(g); S.registry[g.pid] = true; return g; }

const FIXTURES = {
  response: {
    title: 'A useful response', text: 'Attack with your Stag. The rival holds Guard with 2 reserve and may protect its Pike; you can answer with Kindle.',
    build: () => { const S = base(); place(S, 0, 'life.stag'); give(S, 0, 'fire.kindle'); give(S, 0, 'life.bite'); place(S, 1, 'water.pike'); give(S, 1, 'earth.guard'); S.players[1].reserve = 2; return S; },
  },
  defend: {
    title: 'Defend with reserve', text: 'It is the rival\'s turn. You kept 2 reserve and hold Gust and Dew: block, respond, or let it through.',
    build: () => { const S = base(1); place(S, 1, 'life.wolf'); place(S, 1, 'life.stag'); give(S, 1, 'life.bite'); place(S, 0, 'life.hare'); place(S, 0, 'earth.boulder'); give(S, 0, 'air.gust'); give(S, 0, 'water.dew'); S.players[0].reserve = 2; return S; },
  },
  interrupted: {
    title: 'An interrupted action', text: 'Seep the rival with your Otter. The rival may Gust the Otter away first: the action fails and its costs stay paid.',
    build: () => { const S = base(); place(S, 0, 'water.otter'); give(S, 0, 'water.seep'); give(S, 1, 'air.gust'); S.players[1].reserve = 2; return S; },
  },
  fusion: {
    title: 'Fixed fusion and the Vessel', text: 'Ember and Wind are mature: open the Vessel for Energy. Clay with Water Ground makes Swamp. One fusion per turn.',
    build: () => { const S = base(); place(S, 0, 'fire.ember'); place(S, 0, 'air.wind'); place(S, 0, 'earth.clay'); ground(S, 0, 'water.water'); S.players[0].breath = 8; return S; },
  },
  separate: {
    title: 'Separate a made Thing', text: 'Your Energy (Ember + Wind) carries 1 damage. Separate restores both, damage to the primary ingredient.',
    build: () => { const S = base(); const t = place(S, 0, 'made.energy', { form: 'made.energy', pid: null, damage: 1, lineage: [{ pid: 'fl1', word: 'fire.ember', form: 'fire.ember', owner: 0 }, { pid: 'fl2', word: 'air.wind', form: 'air.wind', owner: 0 }] });
      void t; S.registry.fl1 = S.registry.fl2 = true; give(S, 0, 'word.separate'); return S; },
  },
  ladder: {
    title: 'Ladders', text: 'Transmute your Lead (choose Tin or Copper). Grow your Seed: it is one age from Sapling. One step per own turn each.',
    build: () => { const S = base(); place(S, 0, 'earth.lead'); place(S, 0, 'life.seed', { counters: { age: 1 } }); give(S, 0, 'earth.transmute'); give(S, 0, 'life.grow'); return S; },
  },
  grave: {
    title: 'Grave recursion', text: 'Memory recovers Kindle; Exhume revives your fallen Wolf. Both seal themselves when they succeed.',
    build: () => { const S = base(); grave(S, 0, 'fire.kindle'); grave(S, 0, 'life.wolf'); give(S, 0, 'water.memory'); give(S, 0, 'rot.exhume'); S.players[0].breath = 6; return S; },
  },
  concealed: {
    title: 'Concealed', text: 'The rival has a Concealed Thing. You cannot target it until it is revealed: try Owl, or Doubt\'s reveal.',
    build: () => { const S = base(); place(S, 1, 'word.hermit', { status: { concealed: true } }); place(S, 1, 'life.stag'); give(S, 0, 'air.owl'); give(S, 0, 'word.doubt'); place(S, 0, 'fire.ember'); give(S, 0, 'fire.scorch'); return S; },
  },
  law: {
    title: 'A Law', text: 'Beasts + Be + Feral: every Beast on both sides gains Feral until your second Renew from now.',
    build: () => { const S = base(); give(S, 0, 'word.be'); give(S, 0, 'life.beasts'); give(S, 0, 'life.feral'); place(S, 0, 'life.wolf'); place(S, 1, 'life.stag'); place(S, 1, 'earth.stone'); return S; },
  },
  poison: {
    title: 'Poison', text: 'Your Spider is Venomous; Miasma poisons every enemy Living Thing and the rival. Doses tick at the owner\'s upkeep, cap 3.',
    build: () => { const S = base(); place(S, 0, 'rot.spider'); place(S, 0, 'rot.rat'); give(S, 0, 'rot.miasma'); give(S, 0, 'rot.poison'); place(S, 1, 'life.stag', { status: { poison: 1 } }); place(S, 1, 'life.wolf'); return S; },
  },
  // ---- V31 Living Folio (model B) ----
  f_pollen: {
    format: 'folio_b_all', title: 'Folio · who can pollinate what', text: 'Bee (insect) and Wind (wind) beside Pear (insect-pollinated) and Hazel (wind-pollinated). Click a carrier: only the matching tree is offered. Inspect any of them to see why. The rival holds Gust and Drench (Wet grounds a Bee, not the Wind).',
    build: () => { const S = fbase(); place(S, 0, 'life.bee'); place(S, 0, 'air.wind'); place(S, 0, 'life.pear'); place(S, 0, 'life.hazel'); place(S, 1, 'water.otter'); give(S, 1, 'air.gust'); give(S, 1, 'water.drench'); S.players[1].reserve = 2; return S; },
  },
  f_feast: {
    format: 'folio_b_all', title: 'Folio · Feast for a second wave', text: 'Your Wolf and Otter have already struck and are exhausted. Eat the Fruit with Feast to ready them; a second Strike still costs 1 breath. Or keep the Fruit to block or heal.',
    build: () => { const S = fbase(); place(S, 0, 'life.wolf', { exhausted: true, actions: 1 }); place(S, 0, 'water.otter', { exhausted: true, actions: 1 }); place(S, 0, 'token.fruit', { form: 'token.fruit', token: true, pid: null }); give(S, 0, 'life.feast'); S.players[0].breath = 4; place(S, 1, 'earth.boulder'); return S; },
  },
  f_workshop: {
    format: 'folio_b_all', title: 'Folio · from Copper to Signet', text: 'Work Copper into a Setting (Shape in hand, or Smith\'s native ability), then next turn Set it with Garnet in the Vessel to make a Signet. Silver is Sacred; shaping it gives that up. Inspect the Signet: it shows its Setting and Garnet and the original Copper.',
    build: () => { const S = fbase(); place(S, 0, 'fire.smith'); place(S, 0, 'earth.copper'); place(S, 0, 'earth.silver'); place(S, 0, 'earth.garnet'); give(S, 0, 'earth.shape'); give(S, 0, 'word.writ'); place(S, 1, 'word.scribe'); place(S, 1, 'earth.boulder'); return S; },
  },
  f_signet: {
    format: 'folio_b_all', title: 'Folio · Signet endorses a Writ', text: 'A finished Signet (Setting from Copper + Garnet). Endorse Writ by exhausting it to exhaust two rival blockers, then attack. The rival holds Doubt with 2 reserve; a countered Writ keeps its costs.',
    build: () => { const S = fbase(); S.registry.fls1 = S.registry.fls2 = true; place(S, 0, 'made.signet', { form: 'made.signet', pid: null, lineage: [{ pid: 'fls1', word: 'earth.copper', form: 'earth.setting', owner: 0 }, { pid: 'fls2', word: 'earth.garnet', form: 'earth.garnet', owner: 0 }] }); place(S, 0, 'earth.iron'); place(S, 0, 'fire.ember'); give(S, 0, 'word.writ'); place(S, 1, 'earth.boulder'); place(S, 1, 'water.ice'); give(S, 1, 'word.doubt'); S.players[1].reserve = 2; return S; },
  },
  f_mould: {
    format: 'folio_b_all', title: 'Folio · Mould returns the dead to the soil', text: 'Your Grave holds a Seed that died, a Pear that was sacrificed and a Rose you discarded. Mould can seal only a Plant that died. It feeds Growth and age to your Sapling, and Growth on another Plant makes your Pear fruit.',
    build: () => { const S = fbase(); place(S, 0, 'rot.mould'); place(S, 0, 'life.sapling'); place(S, 0, 'life.pear'); const y = (w, r) => { const g = grave(S, 0, w); g.reason = r; }; y('life.seed', 'destroyed'); y('life.bramble', 'sacrificed'); y('life.rose', 'discarded'); give(S, 0, 'rot.exhume'); return S; },
  },
  f_clife: {
    format: 'folio_c_life', title: 'C-life · a crop and a Setting that take a turn', text: 'Start Bear (Bee + Pear) or Shape (Smith + Copper): the work is public and completes at your next turn for 1 breath. Meanwhile the rival can Gust the Bee or Rust the Copper to break it. One process at a time.',
    build: () => { const S = fbase(0, 'folio_c_life'); place(S, 0, 'life.bee'); place(S, 0, 'life.pear'); place(S, 0, 'fire.smith'); place(S, 0, 'earth.copper'); place(S, 1, 'fire.ember'); give(S, 1, 'air.gust'); give(S, 1, 'rot.rust'); S.players[1].reserve = 2; return S; },
  },
};

// ---- V32 The Workshop: every V32 fixture is a scenario spec, so it can be opened in the scenario editor and changed ----
const side = (list, o = {}) => ({ list, field: [], hand: [], grave: [], deckTop: [], deckRest: 'rest', ground: null, life: 30, breath: 6, reserve: 0, spark: 2, ...o });
const SPECS = {
  v_visit: { format: 'v32_visit', title: 'V · visit an opened orchard', text: 'The rival opened its Pear to visitors at its last End. Your Bee may visit (1 breath, exhausts the Bee): the rival gets the Fruit, you privately reorder your top two cards. You may also simply decline. Try it with the rival holding Gust in reserve: if it bounces the Pear, the attempt fails and its cost stays paid.',
    active: 0, invites: [{ kind: 'orchard', owner: 1, host: 0 }],
    sides: [side('V01_neighbours_orchard', { field: [{ word: 'life.bee' }, { word: 'life.wolf' }], hand: ['air.gust'], deckTop: ['life.feast', 'life.pear'] }), side('V04_orchard_cellar', { field: [{ word: 'life.pear' }, { word: 'life.hare' }], breath: 0, reserve: 2, spark: 2 })] },
  v_host: { format: 'v32_visit', title: 'V · open your orchard to the rival', text: 'Plan an invitation for your Pear (free; it opens at your End and lasts until your next Renew). The rival\'s Bee may visit during its turn — the Fruit would be yours. Or keep your orchard closed. Inspect the Pear to see whether an invitation is possible.',
    active: 0, sides: [side('V04_orchard_cellar', { field: [{ word: 'life.pear' }, { word: 'life.wolf' }], hand: ['life.feast'] }), side('V01_neighbours_orchard', { field: [{ word: 'life.bee' }, { word: 'life.hare' }], breath: 0, reserve: 1 })] },
  h_heat: { format: 'v32_heat', title: 'H · borrow the rival\'s heat', text: 'The rival lent its Torch. Borrow it to work your Copper into a Setting: 1 breath, and 1 spark paid to the rival when you declare. If the rival Gusts the Copper away in response, the fee stays paid. You also hold Shape — the private alternative at 2 breath.',
    active: 0, invites: [{ kind: 'heat', owner: 1 }],
    sides: [side('V03_seal_engraver', { field: [{ word: 'earth.copper' }, { word: 'earth.garnet' }, { word: 'earth.iron' }], hand: ['earth.shape', 'word.writ'], breath: 5, spark: 2 }), side('V13_giver_of_fire', { ground: 'fire.torch', field: [{ word: 'fire.ember' }], hand: ['air.gust'], breath: 0, reserve: 2, spark: 3 })] },
  r_roles: { format: 'v32_r6', title: 'R · who may strike, intercept, strike back', text: 'Six core rows: Wolf does all three; Oak may intercept but never strikes or strikes back; Bee, Silver, Garnet and Fruit do none. Attack with your Wolf and see who the rival can put in the way. Inspect any Thing for its permissions. Switch the rules version in the editor to compare Fruit-only and the broader overlay.',
    active: 0, sides: [side('V08_patient_predator', { field: [{ word: 'life.wolf' }, { word: 'life.hare' }], hand: ['life.bite'] }), side('V11_world_tree_maker', { field: [{ word: 'life.oak' }, { word: 'token.fruit' }, { word: 'life.wolf' }], breath: 0, reserve: 1 })] },
  c_supply: { format: 'v32_supply', title: 'Capacity · the supply space', text: 'Five general spaces are full. The sixth space takes only stock and products (Clay, Copper, Silver, Garnet, Setting, Signet, Fruit). Bring forth Copper: it goes to the supply space. Then work it into a Setting and Set it — try bringing forth a Wolf instead to see the refusal.',
    active: 0, sides: [side('V03_seal_engraver', { field: [{ word: 'earth.iron' }, { word: 'earth.boulder' }, { word: 'earth.flint' }, { word: 'fire.ember' }, { word: 'word.scribe' }], hand: ['earth.copper', 'earth.shape', 'earth.garnet'], breath: 8 }), side('V08_patient_predator', { field: [{ word: 'life.wolf' }], breath: 0 })] },
  w5_success: { format: 'v32_w5', title: 'W5 · the work completes', text: 'Your World Tree (grown Clay + Water → Swamp, Seed + Swamp → Life, Oak + Life) gave Growth to your Wolf at upkeep. Declare the work (2 breath). It completes at the start of your next Main, after a full rival turn, if the Tree and the Wolf (still bearing Growth) survive and you are alive.',
    active: 0, sides: [side('V11_world_tree_maker', { field: [{ word: 'made.world_tree', grants: [1] }, { word: 'life.wolf', counters: { growth: 1 } }, { word: 'earth.boulder' }], hand: ['earth.guard'], breath: 6 }), side('V08_patient_predator', { field: [{ word: 'life.hare' }], breath: 0, reserve: 0 })] },
  w5_disrupt: { format: 'v32_w5', title: 'W5 · ordinary disruption', text: 'Same claim, but the rival has a Stag and Bite: on its turn it can kill your Hare (the beneficiary). If the Hare leaves play or loses its Growth, the claim breaks — no win, no refund.',
    active: 0, sides: [side('V11_world_tree_maker', { field: [{ word: 'made.world_tree', grants: [1] }, { word: 'life.hare', counters: { growth: 1 } }], breath: 6 }), side('V08_patient_predator', { field: [{ word: 'life.stag' }, { word: 'life.wolf' }], hand: ['life.bite'], breath: 0, spark: 2 })] },
  w5_interrupt: { format: 'v32_w5', title: 'W5 · interrupted declaration', text: 'The rival keeps 2 reserve and Gust. When you declare the work, it can bounce the World Tree in response: the declaration fails, the 2 breath stays spent, and the Tree dissolves (its ingredients go to your Grave).',
    active: 0, sides: [side('V11_world_tree_maker', { field: [{ word: 'made.world_tree', grants: [1] }, { word: 'life.wolf', counters: { growth: 1 } }], breath: 6 }), side('V08_patient_predator', { field: [{ word: 'life.hare' }], hand: ['air.gust'], breath: 0, reserve: 2 })] },
  w5_lethal: { format: 'v32_w5', title: 'W5 · earlier life lethal', text: 'You can declare, but you are at 3 life and the rival has four ready attackers; your Tree and Wolf can block only two. Ordinary life loss is checked first: if you die on the rival\'s turn the work never completes. Compare declaring with blocking or racing — and open "Why not?".',
    active: 0, sides: [side('V11_world_tree_maker', { field: [{ word: 'made.world_tree', grants: [1] }, { word: 'life.wolf', counters: { growth: 1 } }], life: 3, breath: 6 }), side('V08_patient_predator', { field: [{ word: 'life.stag' }, { word: 'life.wolf' }, { word: 'air.hawk' }, { word: 'rot.adder' }], breath: 0 })] },
  cv_fruit: { format: 'v32_b', title: 'Creation · what is a Fruit for?', text: 'You have a Fruit, Feast, two exhausted attackers and an untapped Bee. Compare: eat it (heal 2), Feast it to strike again now, keep it as a blocker, or keep it for later. Open "Why not?" to see how the planner ranks each, and why.',
    active: 0, sides: [side('V01_neighbours_orchard', { field: [{ word: 'life.wolf', exhausted: true }, { word: 'water.otter', exhausted: true }, { word: 'token.fruit' }, { word: 'life.bee' }, { word: 'life.pear' }], hand: ['life.feast'], life: 22, breath: 4 }), side('V08_patient_predator', { field: [{ word: 'life.hare' }], life: 14, breath: 0 })] },
  cv_setting: { format: 'v32_b', title: 'Creation · Copper now, or a Setting later?', text: 'Your Copper can strike now (2) — or be worked into a Setting (Shape, 2 breath), then Set with the Garnet next turn for a Signet that endorses Writ. Open "Why not?" to see whether the planner calls the workshop line inferior, too slow or unaffordable. Try the Shape-at-1 rules version from the editor.',
    active: 0, sides: [side('V03_seal_engraver', { field: [{ word: 'earth.copper' }, { word: 'earth.garnet' }, { word: 'earth.iron' }], hand: ['earth.shape', 'word.writ'], breath: 5, spark: 1 }), side('V08_patient_predator', { field: [{ word: 'life.wolf' }, { word: 'life.hare' }], life: 18, breath: 0 })] },
};
for (const [id, spec] of Object.entries(SPECS)) { const fx = SC.asFixture({ ...spec, seed: 7, market: 'empty' }); FIXTURES[id] = { ...fx, id: undefined, v32: true }; }
for (const [id, f] of Object.entries(FIXTURES)) { f.id = id; const b = f.build; f.build = () => { const S = b(); S.ptFixtureId = id; return S; }; }
module.exports = { FIXTURES, SPECS };
