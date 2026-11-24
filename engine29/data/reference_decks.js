// Spec §10.1–10.2 reference decks (versioned, fixed IDs). Rival labels from §10.3.
'use strict';
const L = (school, names) => names.map(n => school + '.' + n.toLowerCase());
const REFERENCE_DECKS = {
  D1_living_sky: { rival: 'Dorothea Finch I', words: [...L('life', ['Hare', 'Wolf', 'Stag', 'Bramble', 'Aloe', 'Bite', 'Mend', 'Abundance', 'Beasts', 'Scarab']), ...L('air', ['Swallow', 'Owl', 'Hawk', 'Crow', 'Magpie', 'Winged', 'Gust', 'Quick', 'Herald', 'Storm'])] },
  D2_lockkeepers_wall: { rival: 'Pieter Bream', words: [...L('water', ['Eel', 'Otter', 'Pike', 'Ice', 'Water', 'Drench', 'Wash', 'Seep', 'Tonic', 'Rain']), ...L('earth', ['Boulder', 'Stone', 'Iron', 'Flint', 'Tower', 'Guard', 'Crush', 'Cut', 'Salt', 'Desert'])] },
  D3_furnace_wind: { rival: 'Mara Flint', words: [...L('fire', ['Ember', 'Torch', 'Fire', 'Bellows', 'Salamander', 'Firebird', 'Naphtha', 'Burn', 'Scorch', 'Kindle', 'Calcine', 'Wildfire']), ...L('air', ['Swallow', 'Owl', 'Wind', 'Gust', 'Winged', 'Blow', 'Gasp', 'Squall'])] },
  D4_orchard: { rival: 'Hester Bale', words: [...L('life', ['Seed', 'Sapling', 'Oak', 'Willow', 'Pear', 'Rose', 'Aloe', 'Bramble', 'Grow', 'Graft', 'Harvest', 'Plants']), ...L('earth', ['Earth', 'Clay', 'Boulder', 'Guard']), ...L('water', ['Water', 'Rain', 'Dew', 'Tonic'])] },
  D5_clay_and_gold: { rival: 'Tess Harrow', words: [...L('earth', ['Lead', 'Tin', 'Copper', 'Silver', 'Clay', 'Boulder', 'Iron', 'Flint', 'Crucible', 'Transmute', 'Guard', 'Crush']), ...L('word', ['Word', 'Scribe', 'Familiar', 'Name', 'Protect', 'Doubt', 'Awaken', 'Separate'])] },
  D6_returning_earth: { rival: 'Ruth Spindle', words: [...L('rot', ['Rat', 'Adder', 'Spider', 'Spore', 'Leech', 'Barrow', 'Decay', 'Poison', 'Wither', 'Exhume', 'Wormwood', 'Miasma']), ...L('life', ['Hare', 'Wolf', 'Scarab', 'Seed', 'Aloe', 'Bite', 'Mend', 'Abundance'])] },
  D7_speaking_house: { rival: 'Ambrose Tickell', words: [...L('word', ['Scribe', 'Bard', 'Hermit', 'Word', 'Grimoire', 'Omen', 'Protect', 'Doubt', 'Dispel', 'Scream', 'Be']), ...L('air', ['Owl', 'Herald', 'Gust', 'Winged', 'Quick', 'Gasp']), ...L('life', ['Hare', 'Wolf', 'Beasts'])] },
  D8_garden_of_endings: { rival: 'Dorothea Finch III', words: [...L('life', ['Seed', 'Sapling', 'Oak', 'Willow', 'Pear', 'Scarab', 'Grow', 'Graft', 'Mend']), ...L('rot', ['Rat', 'Adder', 'Barrow', 'Decay', 'Exhume', 'Wither']), ...L('water', ['Water', 'Rain', 'Dew', 'Tonic', 'Memory'])] },
  D4B_experimentalist: { rival: 'Dorothea Finch II', words: [...L('life', ['Seed', 'Sapling', 'Oak', 'Willow', 'Aloe', 'Bramble', 'Grow', 'Graft', 'Wolf', 'Stag', 'Bite', 'Abundance']), ...L('earth', ['Earth', 'Clay', 'Boulder', 'Guard']), ...L('water', ['Water', 'Rain', 'Dew', 'Tonic'])] },
  D5B_patient_ruin: { rival: 'Lucan Reeve', words: [...L('earth', ['Lead', 'Clay', 'Boulder', 'Iron', 'Flint', 'Crucible', 'Transmute', 'Guard', 'Crush']), ...L('rot', ['Rat', 'Barrow', 'Rust', 'Decay', 'Wither', 'Ghost']), ...L('word', ['Word', 'Scribe', 'Name', 'Protect', 'Doubt'])] },
};
module.exports = { REFERENCE_DECKS, REF: Object.fromEntries(Object.entries(REFERENCE_DECKS).map(([k, v]) => [k, v.words])) };
