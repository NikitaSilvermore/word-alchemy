// Versioned competitive formats (§14.4 V30 foundation). A format pins every rules parameter a match depends on,
// so a replay or a Journey result can name exactly which rules produced it. Formats are additive: never edit one
// that has shipped; publish a new id instead.
'use strict';
const E = require('./engine');

const FORMATS = {
  // The V29 candidate exactly as specified (§3): second player starts with 1 reserve.
  grammar_v29_spec: { version: '0.29.0', status: 'reference', arithmetic: 'v29', initiative: 'spec', reserve: true, market: true, marketBreath: 0, variant: {} },
  // Stage H result: opening turns are 2 breath for the starting player and 5 for the second player
  // (first player wins 50.7% ±3.0 with Journeyman bots and 51.6% ±5.6 with Specialist bots in paired tests).
  grammar_v30_rc1: { version: '0.30.0-rc1', status: 'candidate', arithmetic: 'v29', initiative: 'combo2', reserve: true, market: true, marketBreath: 0, variant: {} },
  // Journey encounters use the candidate until a designer signs off a final competitive format.
  journey_standard: { version: '0.30.0-rc1', status: 'candidate', alias: 'grammar_v30_rc1' },
  // Only for comparison with the V28 maths; never for play.
  legacy_v28_maths: { version: '0.28-emulation', status: 'diagnostic', arithmetic: 'legacy', initiative: 'spec', reserve: true, market: true, marketBreath: 0, variant: {} },
};

function resolveFormat(id) {
  let f = FORMATS[id];
  if (!f) throw new Error('unknown format ' + id);
  if (f.alias) f = { ...FORMATS[f.alias], version: f.version, status: f.status };
  return { id, ...f };
}

function createFromFormat(id, { decks, seed, first = null, mulligan = null }) {
  const f = resolveFormat(id);
  const S = E.createMatch({ decks, seed, first, mulligan, arithmetic: f.arithmetic, initiative: f.initiative, reserve: f.reserve, market: f.market, marketBreath: f.marketBreath, variant: f.variant });
  S.formatId = id; S.formatVersion = f.version;
  return S;
}

module.exports = { FORMATS, resolveFormat, createFromFormat };
