'use strict';
const E = require('../src/engine');
const { CARDS } = require('../src/cards');

// 20 distinct legal words from up to three schools
const DECKS = {
  earthWater: ['earth.boulder', 'earth.stone', 'earth.lead', 'earth.iron', 'earth.flint', 'earth.tower', 'earth.guard', 'earth.crush', 'earth.cut',
    'water.eel', 'water.otter', 'water.pike', 'water.ice', 'water.seep', 'water.tonic', 'life.wolf', 'life.hare', 'life.bite', 'life.mend', 'life.bramble'],
  fireAir: ['fire.ember', 'fire.salamander', 'fire.firebird', 'fire.smith', 'fire.torch', 'fire.burn', 'fire.scorch', 'fire.kindle',
    'air.owl', 'air.hawk', 'air.swallow', 'air.crow', 'air.wind', 'air.gasp', 'rot.rat', 'rot.adder', 'rot.spider', 'rot.poison', 'rot.leech', 'rot.yew'],
};

// synthetic fixture: empty boards and hands, chosen breath
function fixture({ arithmetic = 'v29', decks = [DECKS.earthWater, DECKS.fireAir], first = 0, seed = 7 } = {}) {
  const S = E.createMatch({ decks, seed, arithmetic, first });
  S.synthetic = true;
  for (const p of S.players) { p.deck.push(...p.hand); p.hand = []; p.breath = 8; p.reserve = 0; }
  return S;
}
function place(S, side, word, o = {}) {
  const t = { id: 't' + (++S.seq), pid: 'fx' + S.seq, word, owner: side, ctrl: side, entry: S.seq, damage: o.damage || 0, counters: o.counters || {}, status: o.status || {}, exhausted: !!o.exhausted, fresh: !!o.fresh, actions: 0, arrivedTurn: 0, attuned: !!o.attuned };
  S.things.push(t); S.registry[t.pid] = true; return t;
}
function give(S, side, word) { const c = { pid: 'h' + (++S.seq), word, owner: side }; S.players[side].hand.push(c); S.registry[c.pid] = true; return c; }
function ground(S, side, word) { const g = { pid: 'g' + (++S.seq), word, owner: side, damage: 0 }; S.players[side].ground = g; S.registry[g.pid] = true; return g; }

module.exports = { E, DECKS, fixture, place, give, ground, CARDS };
