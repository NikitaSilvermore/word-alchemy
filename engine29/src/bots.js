// Bot policies for V29: they see only public state plus their own hand (no peeking at decks or rival hand).
'use strict';
const E = require('./engine');

function clone(S) { const r = S.rand; delete S.rand; const c = structuredClone(S); S.rand = r; c.rand = () => 0.5; return c; }

function value(S, me, w) {
  if (S.over === me) return 1e6; if (S.over === 1 - me) return -1e6; if (S.over === 'draw') return 0;
  const P = S.players, side = i => S.things.filter(t => t.ctrl === i);
  const board = i => side(i).reduce((a, t) => a + E.curStrike(S, t) * w.str + Math.max(0, E.remainingOf(S, t)) * w.st - (t.status.burning ? 2 : 0) - (t.status.poison || 0), 0);
  return w.life * (P[me].life - P[1 - me].life) + board(me) - board(1 - me) + w.hand * (P[me].hand.length - P[1 - me].hand.length)
    - 1.5 * (P[me].poison - P[1 - me].poison) + (P[1 - me].life <= 0 ? 1e5 : 0);
}

const POLICIES = {
  aggressive: { life: 1.4, str: 0.7, st: 0.35, hand: 0.4, blockAt: 6 },
  careful: { life: 1.0, str: 0.55, st: 0.55, hand: 0.6, blockAt: 3 },
};

// defender's blocking choice
function blocker(policyOf) {
  return (S, info) => {
    const me = 1 - info.attacker.ctrl, w = POLICIES[policyOf(me)];
    const dmg = E.curStrike(S, info.attacker) + info.bonus;
    let best = null, bestScore = 0;
    for (const b of info.candidates) {
      const survives = E.remainingOf(S, b) > dmg;
      const kills = E.curStrike(S, b) >= E.remainingOf(S, info.attacker);
      const bv = E.curStrike(S, b) + E.remainingOf(S, b);
      let sc;
      if (!info.target) { // attack on me
        const lethal = S.players[me].life <= dmg + 2;
        if (dmg < w.blockAt && !lethal) continue;
        sc = (survives ? 6 : 0) + (kills ? 4 : 0) + (lethal ? 50 : dmg) - (survives ? 0 : bv * 0.6);
      } else { // guard a friendly thing
        const tv = E.curStrike(S, info.target) + E.remainingOf(S, info.target);
        if (E.remainingOf(S, info.target) > dmg) continue;
        sc = (survives ? tv : tv - bv) + (kills ? 3 : 0);
      }
      if (sc > bestScore) { bestScore = sc; best = b.id; }
    }
    return best;
  };
}

function chooseAction(S, policyOf) {
  const me = S.active, w = POLICIES[policyOf(me)], blk = blocker(policyOf);
  const acts = E.legalActions(S).filter(a => a.type !== 'pass');
  const base = value(S, me, w);
  let best = null, bestV = base + 0.05; // must strictly improve on doing nothing
  for (const a of acts) {
    const c = clone(S);
    try { E.apply(c, a, blk); } catch (e) { continue; }
    // count breath spent on development as an investment, not a loss
    const v = value(c, me, w) + (a.type === 'deploy' || a.type === 'ground' ? 0.8 : 0);
    if (v > bestV) { bestV = v; best = a; }
  }
  return best || { type: 'pass' };
}

module.exports = { chooseAction, blocker, POLICIES, clone, value };
