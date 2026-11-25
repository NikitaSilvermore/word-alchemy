// Summarises V30 experiment result files into a markdown table. usage: node tools/v30_summary.js results/v30_*.json
const fs = require('fs');
const pct = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '—';
const rows = [], decks = {};
for (const f of process.argv.slice(2)) {
  if (!fs.existsSync(f)) continue;
  const G = JSON.parse(fs.readFileSync(f, 'utf8'));
  let firstW = 0, decided = 0, draws = 0, rounds = 0, buys = 0, bought = 0, bp = 0, blocked = 0, sat = 0, rr = 0, wr = 0, resp = 0, ans = 0, fus = 0, l3 = 0, kept = 0, used = 0;
  for (const g of G) {
    if (g.win == null || g.win === 'draw') draws++; else { decided++; if (g.win === g.first) firstW++; }
    rounds += g.rounds; buys += g.buys; fus += g.fusions; resp += g.responses; ans += g.answers; if (g.lethalByR3) l3++;
    for (const r of g.res) {
      bought += r.bought; bp += r.boughtPlayed || 0; blocked += r.blockedDraws || 0; wr += r.windowsWithReserve || 0; kept += r.reserveKept; used += r.reserveUsed;
      const hb = Object.values(r.handByRound || {}); sat += hb.filter(h => h >= 7).length; rr += hb.length;
    }
    if (g.mode === 'decks' && g.win != null && g.win !== 'draw') for (const s of [0, 1]) { const k = g.d[s]; decks[f] = decks[f] || {}; const e = decks[f][k] = decks[f][k] || [0, 0]; e[1]++; if (g.win === s) e[0]++; }
  }
  const n = G.length;
  rows.push(`| ${f.replace(/.*v30_/, '').replace('.json', '')} | ${n} | ${pct(firstW, decided)} | ${pct(draws, n)} | ${(rounds / n).toFixed(1)} | ${(buys / n).toFixed(1)} | ${pct(bp, bought)} | ${(blocked / n / 2).toFixed(2)} | ${pct(sat, rr)} | ${pct(resp, wr)} | ${(ans / n).toFixed(2)} | ${pct(used, kept)} | ${(fus / n).toFixed(2)} | ${pct(l3, n)} |`);
}
console.log('| run | games | first-seat wins | draws | rounds | buys/game | bought cards played | blocked draws/player | hand ≥7 rounds | responses per reserve window | answers/game | reserve used/kept | fusions/game | lethal by R3 |');
console.log('|' + '---|'.repeat(14));
console.log(rows.join('\n'));
for (const [f, d] of Object.entries(decks)) {
  console.log(`\n**${f.replace(/.*v30_/, '').replace('.json', '')} — deck win rates (mirrors count for both seats)**\n`);
  console.log(Object.entries(d).sort((a, b) => b[1][0] / b[1][1] - a[1][0] / a[1][1]).map(([k, [w, t]]) => `- ${k}: ${pct(w, t)} (${t})`).join('\n'));
}
