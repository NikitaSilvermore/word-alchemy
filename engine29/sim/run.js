// Reproducible paired benchmark:
// node sim/run.js <arithmetic> <gamesPerPairing> <seedBase> <out.json> [deckSet A|R] [responses on|off] [reserve on|off] [audit on|off] [initiative spec|none|reserve2|card|breath|spark] [market on|off]
// Games come in mirrored pairs: the same seed is played twice with the first player swapped.
'use strict';
const E = require('../src/engine');
const { chooseAction, controller, mulligan } = require('../src/bots');

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
// Same decks with Response words swapped in (one-for-one, same schools). 'tide' is a Water/Air/Word control deck.
const swap = (deck, pairs) => deck.map(w => pairs[w] || w);
const DECKS_R = {
  wall: swap(DECKS.wall, { 'earth.lead': 'water.sleep', 'water.eel': 'water.drench' }),
  furnace: swap(DECKS.furnace, { 'air.wind': 'air.gust' }),
  pack: swap(DECKS.pack, { 'air.wind': 'air.gust' }),
  venom: swap(DECKS.venom, { 'water.eel': 'water.dew', 'life.hare': 'water.sleep', 'water.ice': 'water.drench' }),
  quarry: swap(DECKS.quarry, { 'air.swallow': 'air.gust' }),
  tide: ['water.eel', 'water.otter', 'water.pike', 'water.ice', 'water.seep', 'water.drench', 'water.dew', 'water.sleep', 'water.frozen', 'water.tonic',
    'air.owl', 'air.hawk', 'air.swallow', 'air.crow', 'air.wind', 'air.gust', 'word.familiar', 'word.protect', 'word.doubt', 'water.thaw'],
};
// Stage E alchemy decks: each holds the ingredients of at least one recipe chain.
const DECKS_E = {
  forge: ['earth.lead', 'earth.silver', 'earth.clay', 'earth.iron', 'earth.stone', 'earth.boulder', 'earth.transmute', 'earth.crush', 'earth.guard',
    'fire.ember', 'fire.salamander', 'fire.firebird', 'fire.fire', 'fire.calcine', 'fire.kindle', 'fire.scorch', 'air.wind', 'air.owl', 'air.hawk', 'air.gust'],
  marsh: ['earth.clay', 'water.water', 'life.seed', 'life.grow', 'life.oak', 'life.sapling', 'water.eel', 'water.otter', 'water.pike', 'water.ice',
    'life.aloe', 'life.wolf', 'life.stag', 'life.mend', 'water.tonic', 'water.drench', 'water.dew', 'earth.stone', 'earth.guard', 'life.bite'],
  crypt: ['rot.adder', 'life.scarab', 'rot.rat', 'rot.spider', 'rot.leech', 'rot.yew', 'rot.barrow', 'rot.poison', 'word.familiar', 'word.word',
    'word.protect', 'word.separate', 'life.bite', 'life.mend', 'life.wolf', 'life.hare', 'life.stag', 'life.apothecary', 'word.doubt', 'life.grow'],
  lab: ['water.flask', 'word.familiar', 'word.word', 'water.vitriol', 'water.quicksilver', 'water.eel', 'water.otter', 'water.pike', 'water.tonic', 'water.dew',
    'water.sleep', 'water.seep', 'air.owl', 'air.hawk', 'air.crow', 'air.wind', 'air.gust', 'word.protect', 'word.doubt', 'word.separate'],
  quarry: DECKS_R.quarry,
  pack: DECKS_R.pack,
};
const { REF } = require('../data/reference_decks');
const SETS = { A: DECKS, R: DECKS_R, E: DECKS_E, REF };

function playOne(d0, d1, seed, arithmetic, first, pols, o = {}) {
  const set = SETS[o.set || 'A'];
  const S = E.createMatch({ decks: [set[d0], set[d1]], seed, arithmetic, first, reserve: o.reserve !== false, market: o.market !== false, initiative: o.initiative || 'spec', mulligan: o.mulligan === false ? null : mulligan });
  const pol = i => pols[i]; const ctl = controller(pol, { responses: o.responses !== false });
  const lifeAtRoundEnd = {}; let maxHitToPlayer = 0, lastRound = 0;
  for (let k = 0; k < 2000 && S.over == null; k++) {
    E.apply(S, chooseAction(S, pol), ctl);
    if (o.audit) { const z = E.zoneAudit(S); if (z.length) throw new Error('zone audit seed ' + seed + ': ' + z.join('; ')); }
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
    responses: S.stats.responses, answers: S.stats.answers, failed: S.stats.failed, cancelled: S.stats.cancelled,
    groundHits: S.stats.packets.filter(p => p.to === 'ground').length,
    buys: S.events.filter(e => e.type === 'buy').length, mulls: S.events.filter(e => e.type === 'mulligan').reduce((a, e) => a + e.n, 0),
    sparkLeft: S.players.map(p => p.spark),
    // per seat: index 0 = starting player, 1 = second player
    buySeat: [S.first, 1 - S.first].map(i => S.events.filter(e => e.type === 'buy' && e.side === i).length),
    firstBuyTurn: [S.first, 1 - S.first].map(i => { const e = S.events.find(e => e.type === 'buy' && e.side === i); return e ? e.turn : null; }),
    offSeat: [S.first, 1 - S.first].map(i => S.players[i].offSchoolBought),
    handEnd: [S.first, 1 - S.first].map(i => S.players[i].hand.length),
    deckEnd: [S.first, 1 - S.first].map(i => S.players[i].deck.length),
    fusions: S.stats.fusions, made: S.stats.made, transforms: S.stats.transforms, tokens: S.stats.tokens, catalystRefills: S.events.filter(e => e.type === 'catalyst').length,
    fatigueSeat: [S.first, 1 - S.first].map(i => S.players[i].fatigue),
  };
}

function main() {
  const [arith = 'v29', nStr = '200', seedStr = '1000', out = '/tmp/v29_sim.json', set = 'A', resp = 'on', resv = 'on', audit = 'off', initiative = 'spec', mkt = 'on'] = process.argv.slice(2);
  const o = { set, responses: resp === 'on', reserve: resv === 'on', audit: audit === 'on', initiative, market: mkt === 'on' };
  const n = +nStr, seed0 = +seedStr, names = Object.keys(SETS[set]), res = [];
  const POLS = [['careful', 'careful'], ['aggressive', 'aggressive'], ['aggressive', 'careful'], ['careful', 'aggressive']];
  for (let i = 0; i < names.length; i++) for (let j = i; j < names.length; j++) for (let g = 0; g < n; g++) {
    const seed = seed0 + i * 100000 + j * 10000 + (g >> 1); // identical seeds across models; g%2 swaps who starts
    res.push(playOne(names[i], names[j], seed, arith, g % 2, POLS[(g >> 1) % 4], o));
  }
  require('fs').writeFileSync(out, JSON.stringify(res));
  console.log(out, res.length);
}
if (require.main === module) main();
module.exports = { playOne, DECKS, DECKS_R, DECKS_E };
