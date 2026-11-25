// Browser entry for the V30 playtest: one bundle exposing the authoritative engine and its helpers.
'use strict';
module.exports = {
  E: require('./engine'), B: require('./bots'), F: require('./formats'), R: require('./recipes'), RP: require('./replay'),
  CARDS: require('./cards'), REF: require('../data/reference_decks'), THEMED: require('../data/themed_decks'), SPEC: require('../data/spec_catalogue.json'),
};
