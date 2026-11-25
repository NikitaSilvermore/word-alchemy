// Freely shuffled bot games on the Core Duel trial: how often each deck's flagship actions are available and chosen,
// consecutive attack-only turns, and full hand/field turns without a worthwhile (non-attack, non-Study) action.
// usage: node tools/three_games.js <gamesPerPairing> <tier> [format] [out.json]
'use strict';
const E = require('../src/engine'), F = require('../src/formats'), B = require('../src/bots');
const { THREE_DECKS: D } = require('../data/v33_decks');
const [N = 6, tier = 'journeyman:ra', fmt = 'v33_core3', out = ''] = process.argv.slice(2);
const word = (S, pid) => { for (const p of S.players) { const c = p.hand.find(h => h.pid === pid); if (c) return E.card(c).id; } return null; };
function fam(S, a) {
  const me = S.active, t = a.subject && S.things.find(x => x.id === a.subject), tg = a.target && S.things.find(x => x.id === a.target);
  if (a.type === 'combat') return 'attack';
  if (a.type === 'study') return a.discard ? 'study-exchange' : 'study';
  if (a.type === 'fuse') return 'fuse:' + a.recipe;
  if (a.type === 'ability') { if (a.ability === 'pollinate') return 'pollinate'; if (a.ability === 'tinder') return tg && E.card(tg).naphtha ? 'naphtha-ignite' : 'tinder'; return a.ability; }
  const w = a.card && word(S, a.card);
  if (w === 'life.graft3') return 'graft';
  if (w === 'life.feast') return a.sacrifice ? 'feast-defend' : 'feast-heal';
  if (w === 'life.abundance') return 'abundance';
  if ((w === 'fire.kindle' && a.mode === 'ignite') || (w === 'fire.burn' && tg && tg.ctrl === me)) return tg && E.card(tg).naphtha ? 'naphtha-ignite' : 'self-ignite';
  if (w === 'fire.calcine') return a.ash ? 'calcine-ash' : 'calcine';
  if (w === 'earth.shape3') return 'shape:' + a.branch.split('.')[1];
  if (w === 'earth.transmute') return 'transmute';
  if (w === 'word.writ3') return a.endorse ? 'writ-stamped' : 'writ';
  if (a.type === 'deploy') return 'deploy';
  return null;
}
const FLAG = { orchard: ['graft', 'pollinate', 'feast-heal', 'feast-defend', 'abundance'], furnace: ['naphtha-ignite', 'fuse:phoenix', 'calcine-ash', 'tinder'], forge: ['fuse:golem', 'shape:hammer', 'shape:signet3', 'transmute', 'writ-stamped', 'seal', 'hammer', 'clayShield', 'temper'] };
const res = {}; const names = Object.keys(D); let g = 0;
for (const a of names) for (const b of names) for (let k = 0; k < +N; k++) {
  const seed = 9000 + g++, first = k % 2, st = [(k % 2 ? 'aggressive' : 'careful') + ':' + tier, (k % 2 ? 'careful' : 'aggressive') + ':' + tier];
  const S = F.createFromFormat(fmt, { decks: [D[a].words, D[b].words], seed, first, mulligan: B.mulligan });
  const pol = i => st[i], ctl = B.controller(pol); E.setDecider(S, B.decider(pol));
  const deckOf = [a, b]; const turn = [null, null]; const streak = [0, 0], maxStreak = [0, 0];
  const flush = i => { const T = turn[i]; if (!T) return; const r = res[deckOf[i]] = res[deckOf[i]] || { turns: 0, avail: {}, chosen: {}, attackOnly: 0, maxAttackOnlyStreak: 0, stuckFull: 0, fullTurns: 0, wins: 0, games: 0, rounds: 0 };
    r.turns++; for (const f of T.avail) r.avail[f] = (r.avail[f] || 0) + 1; for (const f of T.chosen) r.chosen[f] = (r.chosen[f] || 0) + 1;
    const dev = [...T.chosen].filter(f => !['attack', 'study'].includes(f));
    const ao = T.chosen.has('attack') && !dev.length; if (ao) { r.attackOnly++; streak[i]++; maxStreak[i] = Math.max(maxStreak[i], streak[i]); } else streak[i] = 0;
    if (T.full) { r.fullTurns++; if (!dev.length) r.stuckFull++; } turn[i] = null; };
  for (let n = 0; n < 3000 && S.over == null; n++) {
    const i = S.active;
    if (!turn[i] || turn[i].pt !== S.players[i].personalTurn) { flush(i); turn[i] = { pt: S.players[i].personalTurn, avail: new Set(), chosen: new Set(), full: S.players[i].hand.length >= 7 && S.things.filter(t => t.ctrl === i).length >= 5 }; }
    for (const x of E.legalActions(S)) { const f = fam(S, x); if (f) turn[i].avail.add(f); }
    const act = B.chooseAction(S, pol), f = fam(S, act); if (f) turn[i].chosen.add(f);
    E.apply(S, act, ctl);
  }
  for (const i of [0, 1]) { flush(i); const r = res[deckOf[i]]; r.games++; r.rounds += S.round; if (S.over === i) r.wins++; r.maxAttackOnlyStreak = Math.max(r.maxAttackOnlyStreak, maxStreak[i]); }
}
const summary = {};
for (const [d, r] of Object.entries(res)) summary[d] = { games: r.games, winPct: +(100 * r.wins / r.games).toFixed(1), avgRounds: +(r.rounds / r.games).toFixed(1), turns: r.turns, attackOnlyTurnsPct: +(100 * r.attackOnly / r.turns).toFixed(1), longestAttackOnlyStreak: r.maxAttackOnlyStreak, fullHandAndFieldTurns: r.fullTurns, fullTurnsWithNoDevelopment: r.stuckFull,
  flagship: Object.fromEntries(FLAG[d].map(f => [f, `${r.chosen[f] || 0} chosen / ${r.avail[f] || 0} turns available`])) };
console.log(JSON.stringify({ format: fmt, tier, gamesPerPairing: +N, summary }, null, 1));
if (out) require('fs').writeFileSync(out, JSON.stringify({ format: fmt, tier, gamesPerPairing: +N, summary, raw: res }, null, 1));
