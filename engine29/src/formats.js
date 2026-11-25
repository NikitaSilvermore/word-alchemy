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
  // V30 Crucible experiments — each changes ONE lever against the frozen rc1 reference.
  grammar_v30_exp_price34: { version: '0.30.0-exp.price34', status: 'experiment', base: 'grammar_v30_rc1', variant: { priceOwn: 3, priceOff: 4 } },
  grammar_v30_exp_nosentence: { version: '0.30.0-exp.nosentence', status: 'experiment', base: 'grammar_v30_rc1', variant: { sentenceSpark: false } },
  grammar_v30_exp_income2: { version: '0.30.0-exp.income2', status: 'experiment', base: 'grammar_v30_rc1', variant: { incomeEvery: 2 } },
  grammar_v30_exp_buy2: { version: '0.30.0-exp.buy2', status: 'experiment', base: 'grammar_v30_rc1', variant: { buyEvery: 2 } },
  grammar_v30_exp_reserve3: { version: '0.30.0-exp.reserve3', status: 'experiment', base: 'grammar_v30_rc1', variant: { reserveCap: 3 } },
  grammar_v30_exp_cheapresp: { version: '0.30.0-exp.cheapresp', status: 'experiment', base: 'grammar_v30_rc1', variant: { responseDiscount: { 'water.sleep': 1, 'water.frozen': 1, 'air.gust': 1, 'word.doubt': 1 } } },
  // V31 Living Folio — model B (Expanded Grammar). Each module is a separate format; 'all' combines them. Market and
  // every other lever stay at the rc1 reference so module effects are never confused with price experiments.
  folio_b_orchard: { version: '0.31.0-b.orchard', status: 'experiment', base: 'grammar_v30_rc1', variant: { modules: ['orchard'] } },
  folio_b_workshop: { version: '0.31.0-b.workshop', status: 'experiment', base: 'grammar_v30_rc1', variant: { modules: ['workshop'] } },
  folio_b_decay: { version: '0.31.0-b.decay', status: 'experiment', base: 'grammar_v30_rc1', variant: { modules: ['decay'] } },
  folio_b_garden: { version: '0.31.0-b.garden', status: 'experiment', base: 'grammar_v30_rc1', variant: { modules: ['orchard', 'decay'] } },
  folio_b_all: { version: '0.31.0-b.all', status: 'experiment', base: 'grammar_v30_rc1', variant: { modules: ['orchard', 'workshop', 'decay'] } },
  // V31 model C-life (isolated harness): the orchard's Bear and the workshop's Shape become public, interruptible processes
  // completed at the owner's next Main for 1 breath. Ordinary victory only. Set, Feast, Writ, Mould keep their B timing.
  folio_c_life: { version: '0.31.0-c.life', status: 'experiment', base: 'grammar_v30_rc1', variant: { modules: ['orchard', 'workshop', 'clife'] } },
  // Only for comparison with the V28 maths; never for play.
  legacy_v28_maths: { version: '0.28-emulation', status: 'diagnostic', arithmetic: 'legacy', initiative: 'spec', reserve: true, market: true, marketBreath: 0, variant: {} },
};

function resolveFormat(id) {
  let f = FORMATS[id];
  if (!f) throw new Error('unknown format ' + id);
  if (f.alias) f = { ...FORMATS[f.alias], version: f.version, status: f.status };
  if (f.base) f = { ...FORMATS[f.base], version: f.version, status: f.status, variant: { ...FORMATS[f.base].variant, ...f.variant } };
  return { id, ...f };
}

function createFromFormat(id, { decks, seed, first = null, mulligan = null }) {
  const f = resolveFormat(id);
  const S = E.createMatch({ decks, seed, first, mulligan, arithmetic: f.arithmetic, initiative: f.initiative, reserve: f.reserve, market: f.market, marketBreath: f.marketBreath, variant: f.variant });
  S.formatId = id; S.formatVersion = f.version;
  return S;
}

module.exports = { FORMATS, resolveFormat, createFromFormat };
