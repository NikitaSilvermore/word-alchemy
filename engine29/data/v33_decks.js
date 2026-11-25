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
// Core Duel "Three Decks Worth Mastering" lists (six slots changed from V33: Plants→Graft, Ice→Apple; Herald→Tinder;
// Metals→Shape, Familiar→Hammer, Bard→Writ). Plans are the short lobby descriptions.
const THREE_DECKS = {
  orchard: { name: 'The Orchard', schools: 'Life · Water · Air',
    pitch: 'Spend the harvest or grow the canopy. Bee and Wind pollinate for Fruit or healing; Seeds become Oaks; Graft two trees into an Espalier that keeps producing.',
    plan: 'Open on Seed or Sapling and a blocker. Before combat, decide: attack with two trees, or Graft them into one Espalier (3/5 Reach) that frees a place and makes Fruit or Growth every upkeep. Abundance turns grown trees into a strong attack. Feast heals and stands a defender up.',
    words: ['life.bee', 'life.pear', 'life.hazel', 'life.feast', 'life.seed', 'life.sapling', 'life.grow', 'life.abundance', 'life.graft3', 'life.wolf', 'life.bramble', 'life.bite', 'life.bind',
      'water.water', 'water.dew', 'life.apple', 'water.otter', 'air.wind', 'air.gust', 'air.owl'] },
  furnace: { name: 'The Furnace', schools: 'Fire · Air',
    pitch: 'Keep the firebird or spend the fuel. Kindle or Tinder lights your Naphtha for a flare on the two oldest enemies; Calcine leaves Ash; Firebird and Ash become a Phoenix.',
    plan: 'Open with a cheap flyer or Ember and a way to ignite. Naphtha is a visible threat: fire it while the rival\'s two oldest Things are worth hitting. If Rain wets it, Drought dries the field. Calcine an exhausted attacker into Ash, then fuse Firebird + Ash into a 4/4 Phoenix that is reborn once.',
    words: ['fire.ember', 'fire.torch', 'fire.fire', 'fire.salamander', 'fire.firebird', 'fire.naphtha', 'fire.burn', 'fire.scorch', 'fire.kindle', 'fire.calcine', 'fire.wildfire', 'fire.drought',
      'air.swallow', 'air.owl', 'air.wind', 'air.gust', 'air.blow', 'air.gasp', 'air.winged', 'fire.tinder'] },
  forge: { name: 'The Clay Court', schools: 'Earth · The Word',
    pitch: 'Decide what the metal is for. Copper can climb to Silver, become a Hammer that finishes the wounded, or an engraved Signet that seals protection and stamps Writ. Clay + Word make a 4/5 Golem.',
    plan: 'Wall up with Clay, Boulder and Guard. Pivot on Copper: keep its attack, Transmute toward Silver and Gold, Shape a Hammer, or Shape a Signet. Clay can shield a survivor. Golem has Reach; send it forward to spill damage through a destroyed blocker.',
    words: ['earth.clay', 'earth.lead', 'earth.copper', 'earth.silver', 'earth.iron', 'earth.flint', 'earth.boulder', 'earth.crucible', 'earth.transmute', 'earth.guard', 'earth.crush', 'earth.shape3',
      'word.word', 'word.scribe', 'earth.hammer', 'word.writ3', 'word.omen', 'word.protect', 'word.doubt', 'word.awaken'] },
};
module.exports = { V33_DECKS, THREE_DECKS };
