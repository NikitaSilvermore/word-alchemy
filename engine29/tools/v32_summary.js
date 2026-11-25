// Summarise sim/out32/*.json: win rate with a 95% Wilson interval, rounds, module funnels and event counts.
'use strict';
const fs = require('fs'), path = require('path');
const dir = process.argv[2] || path.join(__dirname, '../sim/out32');
const wil = (k, n) => { if (!n) return [0, 0]; const z = 1.96, p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d; return [c - h, c + h]; };
const out = {};
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'SUMMARY.json').sort()) {
  const r = JSON.parse(fs.readFileSync(path.join(dir, f))), rows = r.rows, n = rows.length, w = rows.filter(x => x.win === 'win').length;
  const sum = (sel) => rows.reduce((a, x) => { for (const [k, v] of Object.entries(sel(x) || {})) a[k] = (a[k] || 0) + v; return a; }, {});
  const fun = {}; for (const x of rows) for (const [k, v] of Object.entries(x.fun)) { fun[k] = fun[k] || { offered: 0, chosen: 0 }; fun[k].offered += v.offered; fun[k].chosen += v.chosen; }
  const w5 = rows.reduce((a, x) => { a[x.w5] = (a[x.w5] || 0) + 1; return a; }, {});
  const byOpp = {}; for (const x of rows) { byOpp[x.opp] = byOpp[x.opp] || [0, 0]; byOpp[x.opp][1]++; if (x.win === 'win') byOpp[x.opp][0]++; }
  const [lo, hi] = wil(w, n);
  out[f.replace('.json', '')] = { arm: r.arm, tier: r.tier, invite: r.invite, n, win: +(100 * w / n).toFixed(1), ci95: [+(100 * lo).toFixed(1), +(100 * hi).toFixed(1)], rounds: +(rows.reduce((a, x) => a + x.rounds, 0) / n).toFixed(1),
    byOpp, causes: rows.reduce((a, x) => { if (x.win !== 'loss' && x.win !== 'win') return a; a[x.cause] = (a[x.cause] || 0) + 1; return a; }, {}), me: sum(x => x.me), rival: sum(x => x.rival), w5stage: w5, displaced: rows.reduce((a, x) => a + x.displaced, 0),
    funnel: Object.fromEntries(Object.entries(fun).filter(([k]) => k !== 'attack').map(([k, v]) => [k, `${v.chosen}/${v.offered}`])) };
}
console.log(JSON.stringify(out, null, 1));
