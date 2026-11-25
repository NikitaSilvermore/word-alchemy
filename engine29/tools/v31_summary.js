// V31 Living Folio — summary of the controlled comparisons (sim/folio.js output).
// Score = (wins + draws/2) / games for the subject deck. Paired differences resample whole deals (both seats of one seed
// and opponent) with a fixed bootstrap seed. usage: node tools/v31_summary.js <dir> [prefix]
'use strict';
const fs = require('fs'), path = require('path');
const dir = process.argv[2] || 'results/v31', pre = process.argv[3] || '';
const load = n => { const f = path.join(dir, pre + n + '.json'); return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null; };
const sc = g => g.win === 'win' ? 1 : g.win === 'loss' ? 0 : 0.5;
let bs = 12345; const rnd = () => { bs = (bs * 1103515245 + 12345) & 0x7fffffff; return bs / 0x7fffffff; };
function deals(G) { const m = new Map(); for (const g of G) { const k = g.opp + ':' + g.seed; if (!m.has(k)) m.set(k, []); m.get(k).push(sc(g)); } return m; }
function ci(vals) { const n = vals.length, res = []; for (let b = 0; b < 1000; b++) { let s = 0; for (let i = 0; i < n; i++) s += vals[Math.floor(rnd() * n)]; res.push(s / n); } res.sort((a, b) => a - b); return [res[25], res[974]]; }
function score(G) { const d = [...deals(G).values()].map(v => v.reduce((a, b) => a + b, 0) / v.length); const m = d.reduce((a, b) => a + b, 0) / d.length; const [lo, hi] = ci(d); return { m, lo, hi, n: G.length }; }
function paired(GB, GA) {
  const a = deals(GA), b = deals(GB), diffs = [];
  for (const [k, v] of b) if (a.has(k)) diffs.push(v.reduce((x, y) => x + y, 0) / v.length - a.get(k).reduce((x, y) => x + y, 0) / a.get(k).length);
  if (!diffs.length) return null; const m = diffs.reduce((x, y) => x + y, 0) / diffs.length; const [lo, hi] = ci(diffs); return { m, lo, hi, n: diffs.length };
}
const pct = x => (100 * x).toFixed(1) + '%', sp = x => (x >= 0 ? '+' : '') + (100 * x).toFixed(1);
function funnel(G) {
  const out = {}, n = G.length;
  for (const g of G) {
    for (const [m, f] of Object.entries(g.fun || {})) { const o = out[m] = out[m] || { drew: 0, games: 0, offeredG: 0, offered: 0, chosen: 0, resolved: 0, failed: 0 }; o.offered += f.offered; o.chosen += f.chosen; o.resolved += f.resolved; o.failed += f.failed; if (f.offered) o.offeredG++; }
    for (const [m, d] of Object.entries(g.drew || {})) { const o = out[m] = out[m] || { drew: 0, games: 0, offeredG: 0, offered: 0, chosen: 0, resolved: 0, failed: 0 }; o.games++; o.drew += d; }
  }
  return Object.entries(out).map(([m, o]) => `| ${m} | ${o.games ? pct(o.drew / o.games) : '—'} | ${pct(o.offeredG / n)} | ${(o.offered / n).toFixed(2)} | ${o.offered ? pct(o.chosen / o.offered) : '—'} | ${(o.resolved / n).toFixed(2)} | ${(o.failed / n).toFixed(2)} |`).join('\n');
}
const ARMS = [['O_B', 'O_A', 'Orchard package (Bee/Pear, Hazel/Wind, Feast) vs A ablation'], ['O_B_abundance', 'O_A', 'Orchard with Abundance instead of Feast vs A'], ['O_B', 'O_B_abundance', 'single word: Feast vs Abundance (both B)'],
  ['F_B', 'F_A', 'Workshop package (Shape, Garnet, Signet, Writ) vs A ablation'], ['F_B_nowrit', 'F_A', 'Workshop without Writ vs A'], ['F_B', 'F_B_nowrit', 'single word: Writ vs Omen (both B)'],
  ['M_B', 'M_A', 'Garden package (Mould + orchard words) vs A ablation'], ['M_B_toadstool', 'M_A', 'Garden with Toadstool instead of Mould vs A'], ['M_B', 'M_B_toadstool', 'single word: Mould vs Toadstool (both B)'],
  ['O_C', 'O_B', 'C-life vs B (same Orchard list)'], ['F_C', 'F_B', 'C-life vs B (same Workshop list)']];
console.log('| comparison | arm score (95% CI) | baseline score | paired difference, points (95% CI) | deals |'); console.log('|---|---|---|---|---|');
for (const [b, a, label] of ARMS) {
  const GB = load(b), GA = load(a); if (!GB || !GA) continue;
  const sb = score(GB), sa = score(GA), d = paired(GB, GA);
  console.log(`| ${label} | ${pct(sb.m)} (${pct(sb.lo)}–${pct(sb.hi)}) | ${pct(sa.m)} | ${d ? `${sp(d.m)} (${sp(d.lo)} to ${sp(d.hi)})` : '—'} | ${d ? d.n : 0} |`);
}
console.log('\n| arm | games | score (95% CI) | mean rounds | by opponent |'); console.log('|---|---|---|---|---|');
for (const f of fs.readdirSync(dir).filter(f => f.startsWith(pre) && f.endsWith('.json') && (pre || !/^(spec|bld)_/.test(f))).sort()) {
  const G = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')), s = score(G);
  const by = {}; for (const g of G) { by[g.opp] = by[g.opp] || []; by[g.opp].push(sc(g)); }
  console.log(`| ${f.replace(pre, '').replace('.json', '')} | ${G.length} | ${pct(s.m)} (${pct(s.lo)}–${pct(s.hi)}) | ${(G.reduce((a, g) => a + g.rounds, 0) / G.length).toFixed(1)} | ${Object.entries(by).map(([k, v]) => k.split('_')[0] + ' ' + pct(v.reduce((a, b) => a + b, 0) / v.length)).join(', ')} |`);
}
console.log('\n**Process funnel per game (subject deck).** drew = both inputs of a working pair reached hand or field; offered = share of games with at least one legal module action at a Main decision; chosen = share of offers taken; resolved / failed per game.\n');
for (const n of ['O_B', 'F_B', 'M_B', 'O_C', 'F_C', 'ALL_OvF', 'ALL_MvF', 'ALL_OvM']) { const G = load(n); if (!G) continue; console.log(`\n*${n}*\n\n| process | drew | games offered | offers/game | chosen | resolved/game | failed/game |\n|---|---|---|---|---|---|---|\n${funnel(G)}`); }
