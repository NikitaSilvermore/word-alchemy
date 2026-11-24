// Adversarial speed probe: each reference deck, played by an aggressive bot, against an opponent who never acts or blocks.
// Reports the fastest kill and the largest single-turn damage — the ceiling of each deck's amplification.
// node tools/probe.js [tier=specialist] [seeds=4]
'use strict';
const E = require('../src/engine');
const B = require('../src/bots');
const { REF } = require('../data/reference_decks');
function probe(tier = 'specialist', seeds = 4) {
  const rows = [];
  for (const [name, deck] of Object.entries(REF)) {
    const kills = [], maxTurn = [];
    for (let s = 0; s < seeds; s++) {
      const S = E.createMatch({ decks: [deck, REF.D2_lockkeepers_wall], seed: 900 + s, first: s % 2, mulligan: B.mulligan });
      const pol = i => (i === 0 ? 'aggressive:' + tier : 'careful:apprentice');
      const ctl = { block: () => null, respond: null };
      for (let k = 0; k < 3000 && S.over == null; k++) E.apply(S, S.active === 0 ? B.chooseAction(S, pol) : { type: 'pass' }, ctl);
      const per = {}; for (const pk of S.stats.packets) if (pk.toPlayer && pk.side === 0) per[pk.round] = (per[pk.round] || 0) + pk.n;
      const lost = S.stats.res[1].lifeLost; const perRound = Object.values(per);
      kills.push(S.over === 0 ? S.round : 99); maxTurn.push(Math.max(0, ...perRound));
      void lost;
    }
    rows.push({ deck: name, fastestKillRound: Math.min(...kills), medianKillRound: kills.sort((a, b) => a - b)[Math.floor(kills.length / 2)], maxTurnDamage: Math.max(...maxTurn) });
  }
  return rows;
}
if (require.main === module) { const rows = probe(process.argv[2], +(process.argv[3] || 4)); console.table(rows); require('fs').writeFileSync('results/stageH_probe.json', JSON.stringify(rows, null, 1)); }
module.exports = { probe };
