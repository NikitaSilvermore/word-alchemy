// node sim/report.js results/a.json [results/b.json ...] — prints spec §12.2 metrics per file
'use strict';
const med = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const pct = (a, q) => { const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(q * s.length))]; };
const ci = (k, n) => { const p = k / n, h = 1.96 * Math.sqrt(p * (1 - p) / n); return `${(100 * p).toFixed(1)}% ±${(100 * h).toFixed(1)}`; };
for (const f of process.argv.slice(2)) {
  const r = require(require('path').resolve(f));
  const dec = r.filter(g => g.win === 0 || g.win === 1);
  const out = {
    games: r.length, draws: r.length - dec.length,
    firstPlayerWin: ci(dec.filter(g => g.win === g.first).length, dec.length),
    medianRounds: med(r.map(g => g.rounds)), p10Rounds: pct(r.map(g => g.rounds), 0.1), p90Rounds: pct(r.map(g => g.rounds), 0.9),
    maxTurnDamage_median: med(r.map(g => g.maxTurnDamage)), maxTurnDamage_p90: pct(r.map(g => g.maxTurnDamage), 0.9), maxTurnDamage_max: Math.max(...r.map(g => g.maxTurnDamage)),
    maxPacket_max: Math.max(...r.map(g => g.maxPacket)),
    turnOf20Plus: ci(r.filter(g => g.maxTurnDamage >= 20).length, r.length),
    lethalByRound3: ci(r.filter(g => g.lethalByR3).length, r.length),
    halfLifeLostByRound2: ci(r.filter(g => g.halfLostByR2).length, r.length),
    leaderAtRound2Won: ci(dec.filter(g => g.leadR2 === g.win).length, dec.filter(g => g.leadR2 >= 0).length),
  };
  // per-deck aggregate win rate (mirrors excluded)
  const decks = {};
  for (const g of dec) { if (g.d[0] === g.d[1]) continue; for (const s of [0, 1]) { const k = g.d[s]; decks[k] = decks[k] || [0, 0]; decks[k][1]++; if (g.win === s) decks[k][0]++; } }
  out.deckWinRates = Object.fromEntries(Object.entries(decks).map(([k, [w, n]]) => [k, (100 * w / n).toFixed(1) + '%']));
  console.log(f, JSON.stringify(out, null, 1));
}
