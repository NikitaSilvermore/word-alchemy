// Diagnostic scenario fixtures (§3.8). Constructed positions, labelled as fixtures: they are not claimed to be
// reachable in a normal match. Each builds a fresh state under the rc1 reference rules; the human is player 0.
'use strict';
const F = require('../../engine29/src/formats');
const E = require('../../engine29/src/engine');
const { REF } = require('../../engine29/data/reference_decks');

function base(first = 0) {
  const S = F.createFromFormat('grammar_v30_rc1', { decks: [REF.D1_living_sky, REF.D2_lockkeepers_wall], seed: 4242, first, mulligan: () => [] });
  for (const p of S.players) { p.deck.push(...p.hand); p.hand = []; p.breath = 8; p.reserve = 0; p.spark = 0; }
  S.market = S.market.map(() => null); // keep the fixture about the mechanic
  S.ptFixture = true;
  return S;
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
};
for (const [id, f] of Object.entries(FIXTURES)) { f.id = id; const b = f.build; f.build = () => { const S = b(); S.ptFixtureId = id; return S; }; }
module.exports = { FIXTURES };
