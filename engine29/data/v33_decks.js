// V33 The Core Duel — three curated research decks (20 distinct words, at most three schools). Offline test decks only.
'use strict';
const V33_DECKS = {
  orchard: { name: 'The Orchard', schools: 'Life · Water · Air', pitch: 'Grow a garden that fruits, feeds and heals. Bee and Pear, Wind and Hazel make Fruit; Seeds become Oaks; Ice and Bind keep the orchard alive.',
    words: ['life.bee', 'life.pear', 'life.hazel', 'life.feast', 'life.seed', 'life.sapling', 'life.grow', 'life.abundance', 'life.plants', 'life.wolf', 'life.bramble', 'life.bite', 'life.bind',
      'water.water', 'water.dew', 'water.ice', 'water.otter', 'air.wind', 'air.gust', 'air.owl'] },
  furnace: { name: 'The Furnace', schools: 'Fire · Air', pitch: 'Fast, hot and loud. Fliers and fire-beasts press the rival; Burn and Scorch pick off key pieces; Kindle the Naphtha for a flare; Calcine to Ash and raise a Phoenix.',
    words: ['fire.ember', 'fire.torch', 'fire.fire', 'fire.salamander', 'fire.firebird', 'fire.naphtha', 'fire.burn', 'fire.scorch', 'fire.kindle', 'fire.calcine', 'fire.wildfire', 'fire.drought',
      'air.swallow', 'air.owl', 'air.wind', 'air.gust', 'air.blow', 'air.gasp', 'air.winged', 'air.herald'] },
  forge: { name: 'The Clay Court', schools: 'Earth · The Word', pitch: 'Slow stone, sharp words. Wall up with Boulder and Guard, read your deck with Omen and Scribe, raise a Golem from Clay and Word, and climb Lead to Gold. Protect and Doubt answer.',
    words: ['earth.clay', 'earth.lead', 'earth.copper', 'earth.silver', 'earth.iron', 'earth.flint', 'earth.boulder', 'earth.crucible', 'earth.transmute', 'earth.guard', 'earth.crush', 'earth.metals',
      'word.word', 'word.scribe', 'word.familiar', 'word.bard', 'word.omen', 'word.protect', 'word.doubt', 'word.awaken'] },
};
module.exports = { V33_DECKS };
