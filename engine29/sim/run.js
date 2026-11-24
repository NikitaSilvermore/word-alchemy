// Reproducible paired benchmark: node sim/run.js <arithmetic> <gamesPerPairing> <seedBase> <out.json>
'use strict';
const E = require('../src/engine');
const { chooseAction, blocker } = require('../src/bots');

const DECKS = {
  wall: ['earth.boulder', 'earth.stone', 'earth.lead', 'earth.iron', 'earth.flint', 'earth.tower', 'earth.guard', 'earth.crush', 'earth.cut',
    'water.eel', 'water.otter', 'water.pike', 'water.ice', 'water.seep', 'water.tonic', 'life.wolf', 'life.hare', 'life.bite', 'life.mend', 'life.bramble'],
  furnace: ['fire.ember', 'fire.salamander', 'fire.firebird', 'fire.smith', 'fire.torch', 'fire.burn', 'fire.scorch', 'fire.kindle',
    'air.owl', 'air.hawk', 'air.swallow', 'air.crow', 'air.wind', 'air.gasp', 'rot.rat', 'rot.adder', 'rot.spider', 'rot.poison', 'rot.leech', 'rot.yew'],
  pack: ['life.wolf', 'life.stag', 'life.hare', 'life.bramble', 'life.aloe', 'life.bite', 'life.mend', 'life.apothecary',
    'air.owl', 'air.hawk', 'air.swallow', 'air.crow', 'air.wind', 'air.gasp', 'fire.salamander', 'fire.ember', 'fire.scorch', 'fire.kindle', 'fire.burn', 'fire.torch'],
  venom: ['rot.rat', 'rot.adder', 'rot.spider', 'rot.leech', 'rot.yew', 'rot.wormwood', 'rot.poison', 'life.wolf', 'life.hare', 'life.stag', 'life.bite', 'life.mend', 'life.aloe',
    'water.eel', 'water.otter', 'water.pike', 'water.seep', 'water.tonic', 'water.ice', 'life.bramble'],
  quarry: ['earth.boulder', 'earth.stone', 'earth.lead', 'earth.iron', 'earth.flint', 'earth.tower', 'earth.guard', 'earth.crush', 'earth.cut',
    'fire.smith', 'fire.ember', 'fire.salamander', 'fire.torch', 'fire.burn', 'fire.scorch', 'fire.kindle', 'fire.firebird', 'air.owl', 'air.hawk', 'air.swallow'],
};

function playOne(d0, d1, seed, arithmetic, first, pols) {
  const S = E.createMatch({ decks: [DECKS[d0], DECKS[d1]], seed, arithmetic, first });
  const pol = i => pols[i]; const blk = blocker(pol);
  const lifeAtRoundEnd = {}; let maxHitToPlayer = 0, lastRound = 0;
  for (let k = 0; k < 2000 && S.over == null; k++) {
    E.apply(S, chooseAction(S, pol), blk);
    if (S.round !== lastRound) { lifeAtRoundEnd[lastRound] = S.players.map(p => p.life); lastRound = S.round; }
  }
  lifeAtRoundEnd[lastRound] = S.players.map(p => p.life);
  // largest damage to a player in a single turn, from per-packet records grouped by round and side
  const perTurn = {};
  for (const pk of S.stats.packets) if (pk.toPlayer) { const k = pk.round + ':' + pk.side; perTurn[k] = (perTurn[k] || 0) + pk.n; }
  const packetsMax = Math.max(0, ...S.stats.packets.filter(p => p.toPlayer).map(p => p.n));
  maxHitToPlayer = Math.max(0, ...Object.values(perTurn));
  const r2 = lifeAtRoundEnd[2] || lifeAtRoundEnd[lastRound];
  return {
    d: [d0, d1], seed, first, win: S.over, rounds: S.round, life: S.players.map(p => p.life),
    maxTurnDamage: maxHitToPlayer, maxPacket: packetsMax,
    halfLostByR2: r2 ? r2.some(l => l <= 15) : false,
    lethalByR3: S.over !== null && S.over !== 'draw' && S.round <= 3,
    leadR2: r2 ? (r2[0] === r2[1] ? -1 : (r2[0] > r2[1] ? 0 : 1)) : -1,
  };
}

function main() {
  const [arith = 'v29', nStr = '200', seedStr = '1000', out = '/tmp/v29_sim.json'] = process.argv.slice(2);
  const n = +nStr, seed0 = +seedStr, names = Object.keys(DECKS), res = [];
  const POLS = [['careful', 'careful'], ['aggressive', 'aggressive'], ['aggressive', 'careful'], ['careful', 'aggressive']];
  for (let i = 0; i < names.length; i++) for (let j = i; j < names.length; j++) for (let g = 0; g < n; g++) {
    const seed = seed0 + i * 100000 + j * 10000 + g; // identical seeds across arithmetic models
    res.push(playOne(names[i], names[j], seed, arith, g % 2, POLS[(g >> 1) % 4]));
  }
  require('fs').writeFileSync(out, JSON.stringify(res));
  console.log(out, res.length);
}
if (require.main === module) main();
module.exports = { playOne, DECKS };
