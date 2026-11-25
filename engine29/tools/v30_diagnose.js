// C3/C4 diagnosis: per deck, how it wins and loses, and what fusion contributes. usage: node tools/v30_diagnose.js results/v30_rc1_REF.json
const { deckScores } = require('./v30_score');
const G = require(require('path').resolve(process.argv[2]));
const D = {}; let fG = 0, fW = 0, nf = 0, nW = 0; const made = {};
for (const g of G) {
  for (const s of [0, 1]) {
    const k = g.d[s], r = g.res[s], o = g.res[1 - s], e = D[k] = D[k] || { n: 0, w: 0, dealt: {}, rounds: 0, wasted: 0, spent: 0, heal: 0, played: {} };
    e.n++; if (g.win === s) e.w++; e.rounds += g.rounds; e.wasted += r.breathWasted; e.spent += r.breathSpent; e.heal += r.healed || 0; e.th = (e.th || 0) + (r.thingHealed || 0);
    for (const [src, v] of Object.entries(o.lifeLost)) e.dealt[src] = (e.dealt[src] || 0) + v;
    for (const [w, v] of Object.entries(r.played)) e.played[w] = (e.played[w] || 0) + v;
  }
  for (const [m, v] of Object.entries(g.made || {})) made[m] = (made[m] || 0) + v;
  if (g.fusions) { fG++; } else nf++;
}
const SC = deckScores(G);
console.log('| deck | score* | damage dealt by source (per game) | breath wasted | life healed/game | Thing damage healed/game | most-played |'); console.log('|---|---|---|---|---|---|---|');
for (const [k, e] of Object.entries(D).sort((a, b) => SC[b[0]].score - SC[a[0]].score)) {
  const dealt = Object.entries(e.dealt).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([s, v]) => `${s} ${(v / e.n).toFixed(1)}`).join(', ');
  const top = Object.entries(e.played).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([w, v]) => `${w.split('.')[1]} ${(v / e.n).toFixed(1)}`).join(', ');
  console.log(`| ${k} | ${(100 * SC[k].score).toFixed(1)}% | ${dealt} | ${(100 * e.wasted / (e.wasted + e.spent)).toFixed(0)}% | ${(e.heal / e.n).toFixed(1)} | ${(e.th / e.n).toFixed(1)} | ${top} |`);
}
console.log('\n*Score: mirrors excluded, draws count half — the same definition as every other V30 table. Damage, healing and play counts include mirrors.');
console.log(`\nGames with at least one fusion: ${fG} of ${G.length} (${(100 * fG / G.length).toFixed(0)}%). Made forms: ${JSON.stringify(made)}`);
