// Diagnostic scenario fixtures (§3.8). Constructed positions, labelled as fixtures: they are not claimed to be
// reachable in a normal match. Each builds a fresh state under the rc1 reference rules; the human is player 0.
'use strict';
const F = require('../../engine29/src/formats');
const E = require('../../engine29/src/engine');
const { REF } = require('../../engine29/data/reference_decks');
const { FOLIO_DECKS } = require('../../engine29/data/folio_decks');

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
for (const [id, f] of Object.entries(FIXTURES)) { f.id = id; const b = f.build; f.build = () => { const S = b(); S.ptFixtureId = id; return S; }; }
module.exports = { FIXTURES };
