// Crop-healing stall check: the Orchard side always takes a heal (pollinate for life/mend, eat Fruit, Feast) whenever one is legal.
// Compares game length and life healed against the same seeds with the ordinary bot. usage: node tools/three_heal_stress.js [games]
'use strict';
const E = require('../src/engine'), F = require('../src/formats'), B = require('../src/bots');
const { THREE_DECKS: D } = require('../data/v33_decks');
const N = +(process.argv[2] || 24), tier = 'journeyman:ra';
const isHeal = (S, a) => (a.type === 'ability' && a.ability === 'pollinate' && a.branch !== 'fruit') || (a.type === 'ability' && /eatFruit|fruit/i.test(a.ability || '')) || (a.type === 'spell' && S.players[S.active].hand.some(h => h.pid === a.card && E.card(h).id === 'life.feast'));
function run(forced) {
  const out = { games: 0, rounds: 0, maxRounds: 0, unfinished: 0, heals: 0, healed: 0, orchardWins: 0 };
  for (const opp of Object.keys(D)) for (let k = 0; k < N; k++) {
    const seed = 7700 + k, first = k % 2, pol = i => 'careful:' + tier;
    const S = F.createFromFormat('v33_core3', { decks: [D.orchard.words, D[opp].words], seed, first, mulligan: B.mulligan });
    const ctl = B.controller(pol); E.setDecider(S, B.decider(pol));
    let n = 0;
    for (; n < 4000 && S.over == null; n++) {
      let act = B.chooseAction(S, pol);
      if (forced && S.active === 0) { const h = E.legalActions(S).find(a => isHeal(S, a)); if (h) act = h; }
      if (S.active === 0 && isHeal(S, act)) out.heals++;
      const l0 = S.players[0].life; E.apply(S, act, ctl); out.healed += Math.max(0, S.players[0].life - l0);
    }
    out.games++; out.rounds += S.round; out.maxRounds = Math.max(out.maxRounds, S.round); if (S.over == null) out.unfinished++; if (S.over === 0) out.orchardWins++;
  }
  out.avgRounds = +(out.rounds / out.games).toFixed(1); delete out.rounds; return out;
}
console.log(JSON.stringify({ ordinary: run(false), healWhenever: run(true) }, null, 1));
