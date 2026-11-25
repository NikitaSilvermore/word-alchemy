// Summarises V30 experiment result files into a markdown table. usage: node tools/v30_summary.js results/v30_*.json
const fs = require('fs');
const { deckScores, fmt } = require('./v30_score');
const pct = (a, b) => b ? (100 * a / b).toFixed(1) + '%' : '—';
const rows = [], decks = {};
for (const f of process.argv.slice(2)) {
  if (!fs.existsSync(f)) continue;
  const G = JSON.parse(fs.readFileSync(f, 'utf8'));
  let firstW = 0, decided = 0, draws = 0, rounds = 0, buys = 0, bought = 0, bp = 0, blocked = 0, sat = 0, rr = 0, wr = 0, resp = 0, ans = 0, fus = 0, l3 = 0, kept = 0, used = 0, wo = 0, heal = 0, th = 0;
  for (const g of G) {
    if (g.win == null || g.win === 'draw') draws++; else { decided++; if (g.win === g.first) firstW++; }
    rounds += g.rounds; buys += g.buys; fus += g.fusions; resp += g.responses; ans += g.answers; if (g.lethalByR3) l3++;
    for (const r of g.res) {
      bought += r.bought; bp += r.boughtPlayed || 0; blocked += r.blockedDraws || 0; wr += r.windowsWithReserve || 0; wo += r.windowsWithOption || 0; heal += r.healed || 0; th += r.thingHealed || 0; kept += r.reserveKept; used += r.reserveUsed;
      const hb = Object.values(r.handByRound || {}); sat += hb.filter(h => h >= 7).length; rr += hb.length;
    }
  }
  decks[f] = deckScores(G);
  const n = G.length;
  rows.push(`| ${f.replace(/.*v30_/, '').replace('.json', '')} | ${n} | ${pct(firstW, decided)} | ${pct(draws, n)} | ${(rounds / n).toFixed(1)} | ${(buys / n).toFixed(1)} | ${pct(bp, bought)} | ${(blocked / n / 2).toFixed(2)} | ${pct(sat, rr)} | ${pct(resp, wr)} | ${pct(resp, wo)} | ${(ans / n).toFixed(2)} | ${pct(used, kept)} | ${(fus / n).toFixed(2)} | ${pct(l3, n)} | ${(heal / n / 2).toFixed(2)} / ${(th / n / 2).toFixed(2)} |`);
}
console.log('| run | games | first-seat wins | draws | rounds | buys/game | bought cards played | blocked draws/player | hand ≥7 rounds | responses per reserve window | responses per window with a legal response | answers/game | reserve used/kept | fusions/game | lethal by R3 | life / Thing damage healed per player |');
console.log('|' + '---|'.repeat(16));
console.log(rows.join('\n'));
for (const [f, d] of Object.entries(decks)) {
  console.log(`\n**${f.replace(/.*v30_/, '').replace('.json', '')} — deck score (mirrors excluded, draws count half)**\n`);
  console.log(Object.entries(d).sort((a, b) => b[1].score - a[1].score).map(([k, e]) => `- ${k}: ${fmt(e)}`).join('\n'));
}
