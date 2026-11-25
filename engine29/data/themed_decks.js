// V30 Crucible themed and counter decks (§4 Priority B). Starter = simple curve; tuned = denser plan.
// Not reference fixtures: these are test lists and may change. Every list is validated by test.
'use strict';
const D = (...ids) => ids;
const THEMED = {
  T_fire_burn: D('fire.ember', 'fire.salamander', 'fire.firebird', 'fire.smith', 'fire.naphtha', 'fire.torch', 'fire.burn', 'fire.scorch', 'fire.kindle', 'fire.calcine', 'fire.wildfire', 'fire.drought', 'fire.firebrand', 'fire.bellows',
    'air.swallow', 'air.owl', 'air.wind', 'air.blow', 'air.gasp', 'air.gust'),
  T_air_evasion: D('air.swallow', 'air.owl', 'air.hawk', 'air.crow', 'air.magpie', 'air.wind', 'air.herald', 'air.winged', 'air.quick', 'air.squall', 'air.gust', 'air.gasp', 'air.storm', 'air.blow', 'air.orrery',
    'life.hare', 'life.wolf', 'life.bite', 'life.feral', 'life.mend'),
  T_earth_endurance: D('earth.boulder', 'earth.stone', 'earth.iron', 'earth.flint', 'earth.lead', 'earth.amber', 'earth.tower', 'earth.guard', 'earth.crush', 'earth.cut', 'earth.temper', 'earth.leaden', 'earth.salt', 'earth.winter',
    'water.ice', 'water.pike', 'water.tonic', 'water.drench', 'water.dew', 'water.sleep'),
  T_water_control: D('water.eel', 'water.otter', 'water.pike', 'water.ice', 'water.seep', 'water.wash', 'water.tide', 'water.dew', 'water.drench', 'water.frozen', 'water.thaw', 'water.sleep', 'water.tonic', 'water.rain', 'water.memory',
    'word.protect', 'word.doubt', 'word.dispel', 'word.scribe', 'word.omen'),
  T_life_growth: D('life.seed', 'life.sapling', 'life.oak', 'life.willow', 'life.bramble', 'life.ivy', 'life.pear', 'life.rose', 'life.saffron', 'life.wolf', 'life.stag', 'life.grow', 'life.abundance', 'life.spring',
    'life.harvest', 'life.thorny', 'life.bind', 'earth.earth', 'earth.guard', 'earth.boulder'),
  T_rot_poison: D('rot.rat', 'rot.adder', 'rot.spider', 'rot.spore', 'rot.toadstool', 'rot.yew', 'rot.leech', 'rot.poison', 'rot.miasma', 'rot.venomous', 'rot.decay', 'rot.wither', 'rot.barrow', 'rot.debt',
    'life.hare', 'life.wolf', 'life.bite', 'life.scarab', 'life.mend', 'life.aloe'),
  T_rot_recursion: D('rot.rat', 'rot.ghost', 'rot.leech', 'rot.wormwood', 'rot.barrow', 'rot.decay', 'rot.exhume', 'rot.haunt', 'rot.rust', 'rot.wither', 'rot.feeble',
    'life.scarab', 'life.hare', 'life.wolf', 'earth.amber', 'earth.boulder', 'earth.stone', 'earth.guard', 'earth.crush', 'earth.flint'),
  T_word_speakers: D('word.scribe', 'word.bard', 'word.hermit', 'word.word', 'word.familiar', 'word.grimoire', 'word.scream', 'word.be', 'word.name', 'word.omen', 'word.silence', 'word.protect', 'word.doubt', 'word.reckoning',
    'life.beasts', 'life.feral', 'life.wolf', 'life.hare', 'life.stag', 'life.bite'),
  T_grand_work: D('earth.silver', 'earth.clay', 'earth.transmute', 'earth.crucible', 'earth.boulder', 'earth.guard', 'fire.ember', 'fire.firebird', 'fire.calcine', 'fire.kindle',
    'air.wind', 'air.owl', 'air.swallow', 'air.gust', 'air.gasp', 'earth.stone', 'earth.iron', 'fire.salamander', 'fire.scorch', 'earth.crush'),
};
// counters aimed at specific archetypes
const COUNTERS = {
  C_anti_poison: D('fire.ember', 'fire.salamander', 'fire.firebird', 'fire.torch', 'fire.scorch', 'fire.kindle', 'fire.wildfire', 'fire.calcine',
    'earth.boulder', 'earth.stone', 'earth.iron', 'earth.guard', 'earth.crush', 'earth.salt', 'water.ice', 'water.pike', 'water.tonic', 'water.dew', 'water.sleep', 'water.drench'),
  C_anti_air: D('earth.boulder', 'earth.tower', 'earth.stone', 'earth.iron', 'earth.guard', 'earth.crush', 'earth.leaden', 'earth.desert', 'life.bramble', 'life.ivy', 'life.rose', 'life.thorny', 'life.bind', 'life.stag', 'life.wolf',
    'water.pike', 'water.drench', 'water.ice', 'water.sleep', 'water.tonic'),
};
module.exports = { THEMED, COUNTERS, ALL: { ...THEMED, ...COUNTERS } };
