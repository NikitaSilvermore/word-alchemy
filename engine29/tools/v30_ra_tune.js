// Head-to-head of the response-aware policy (with RA_OPTS overrides) against the reference Journeyman, rc1, REF decks.
// usage: node tools/v30_ra_tune.js '<json overrides>' <n> <seed>
const B = require('../src/bots'); Object.assign(B.RA_OPTS, JSON.parse(process.argv[2] || '{}'));
const { ladder } = require('../sim/bench'); const f = require('../src/formats').resolveFormat('grammar_v30_rc1');
const G = ladder('REF', +process.argv[3] || 80, +process.argv[4] || 34000, ['journeyman', 'journeyman:ra'], '0/1', { initiative: f.initiative, variant: f.variant, marketBreath: f.marketBreath });
let w = 0, d = 0; for (const g of G) { const i = g.tiers.indexOf('journeyman:ra'); if (g.win === i) w++; else if (g.win == null || g.win === 'draw') d++; }
const p = (w + d / 2) / G.length; console.log(process.argv[2], G.length, 'RA score', (100 * p).toFixed(1) + '% ±' + (196 * Math.sqrt(p * (1 - p) / G.length)).toFixed(1));
