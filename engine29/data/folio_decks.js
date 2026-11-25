// V31 Living Folio pack decks (file 05). B lists use the module words; the A ablations swap each new word for a
// same-school rc1 word so the lists can be played under grammar_v30_rc1 for paired comparison.
'use strict';
const O_B = ['life.bee', 'life.pear', 'life.hazel', 'life.feast', 'life.seed', 'life.sapling', 'life.bramble', 'life.grow', 'life.rose', 'life.wolf', 'life.hare', 'life.plants',
  'water.water', 'water.dew', 'water.otter', 'water.seep', 'air.wind', 'air.gust', 'air.owl', 'air.herald'];
const F_B = ['earth.copper', 'earth.silver', 'earth.garnet', 'earth.shape', 'earth.guard', 'earth.boulder', 'earth.iron', 'earth.flint', 'earth.crush', 'earth.temper',
  'fire.smith', 'fire.ember', 'fire.scorch', 'fire.calcine', 'fire.kindle', 'word.writ', 'word.scribe', 'word.protect', 'word.doubt', 'word.scream'];
const M_B = ['life.pear', 'life.seed', 'life.sapling', 'life.bee', 'life.bramble', 'life.grow', 'life.feast', 'life.wolf',
  'rot.mould', 'rot.rat', 'rot.barrow', 'rot.decay', 'rot.wither', 'rot.exhume', 'rot.adder', 'rot.poison', 'rot.spider', 'water.water', 'water.dew', 'water.otter'];
const swap = (d, m) => d.map(w => m[w] || w);
const FOLIO_DECKS = {
  O_orchard_crosswind: { words: O_B, modules: ['orchard'], note: 'The orchard in a crosswind' },
  F_seal_cutter: { words: F_B, modules: ['workshop'], note: 'The seal-cutter' },
  M_returning_garden: { words: M_B, modules: ['orchard', 'decay'], note: 'The returning garden' },
};
const ABLATIONS = { // A ablations (rc1-legal): file 05 "Fair paired substitutions"
  O_A: swap(O_B, { 'life.bee': 'life.scarab', 'life.hazel': 'life.aloe', 'life.feast': 'life.abundance' }),
  F_A: swap(F_B, { 'earth.garnet': 'earth.clay', 'earth.shape': 'earth.transmute', 'word.writ': 'word.omen' }),
  M_A: swap(M_B, { 'life.bee': 'life.scarab', 'life.feast': 'life.abundance', 'rot.mould': 'rot.toadstool' }),
};
module.exports = { FOLIO_DECKS, ABLATIONS, O_B, F_B, M_B };
