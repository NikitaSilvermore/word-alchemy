// One definition of a deck's result, used by every V30 table: mirrors excluded, draws (and round-cap games) count
// half, score = (wins + draws/2) / games. Also returns raw wins, draws and losses so nothing is hidden.
function deckScores(G) {
  const D = {};
  for (const g of G) {
    if (g.mode !== 'decks' || g.d[0] === g.d[1]) continue;
    for (const s of [0, 1]) {
      const e = D[g.d[s]] = D[g.d[s]] || { n: 0, w: 0, dr: 0, l: 0 };
      e.n++; if (g.win === s) e.w++; else if (g.win == null || g.win === 'draw') e.dr++; else e.l++;
    }
  }
  for (const e of Object.values(D)) e.score = (e.w + e.dr / 2) / e.n;
  return D;
}
const fmt = e => `${(100 * e.score).toFixed(1)}% (W${e.w} D${e.dr} L${e.l} of ${e.n})`;
module.exports = { deckScores, fmt };
