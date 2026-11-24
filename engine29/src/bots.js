// Bot policies for V29. Visibility (§3.3, §10): a bot decides from public state plus its own hand.
// Every lookahead runs on a redacted copy in which the rival's hand and both deck orders are hidden,
// so a decision cannot depend on private information.
'use strict';
const E = require('./engine');

const HIDDEN = '?';
function redact(S, viewer) {
  const r = S.rand; delete S.rand;
  const c = structuredClone(S); S.rand = r;
  c.rand = () => 0.5;
  for (const p of c.players) {
    if (p.i !== viewer) p.hand = p.hand.map((x, k) => ({ pid: HIDDEN + p.i + '_' + k, word: HIDDEN, owner: p.i }));
    p.deck = p.deck.map((x, k) => ({ pid: HIDDEN + 'd' + p.i + '_' + k, word: HIDDEN, owner: p.i }));
  }
  for (const t of c.things) if (t.ctrl !== viewer && t.status.concealed) { t.word = HIDDEN; t.form = undefined; t.mods = undefined; t.quals = []; t.lineage = t.lineage ? [] : t.lineage; } // identity hidden
  c.registry = null; c.mseed = null; c.redacted = true; // future market offers are hidden too
  return c;
}
const clone = S => redact(S, S.active);

function value(S, me, w) {
  if (S.over === me) return 1e6; if (S.over === 1 - me) return -1e6; if (S.over === 'draw') return 0;
  const P = S.players, side = i => S.things.filter(t => t.ctrl === i);
  const thingV = t => {
    const out = E.incapacitated(t) ? 0.5 : 1;
    return out * E.curStrike(S, t) * w.str + Math.max(0, E.remainingOf(S, t)) * w.st - (t.status.burning ? 2 : 0) - (t.status.poison || 0) + (t.status.ward ? 0.5 : 0)
      + (w.alchemy || 0) * alchemyWorth(t);
  };
  const board = i => side(i).reduce((a, t) => a + thingV(t), 0) + (P[i].ground ? 1 + 0.2 * E.groundRemaining(P[i].ground) : 0);
  return w.life * (P[me].life - P[1 - me].life) + board(me) - board(1 - me) + w.hand * (P[me].hand.length - P[1 - me].hand.length)
    - 1.5 * (P[me].poison - P[1 - me].poison) + w.spark * (P[me].spark - P[1 - me].spark) + 0.5 * (P[me].catalyst - P[1 - me].catalyst) + (P[1 - me].life <= 0 ? 1e5 : 0);
}

// worth of a known card in hand beyond the flat hand-size term: cheap Things and in-school words are easiest to use
function cardWorth(S, me, word) {
  const d = E.card({ word }), p = S.players[me];
  return 0.25 * d.cost + (d.type === 'thing' ? 0.3 : 0) + (p.schools.includes(d.school) ? 0.2 : 0);
}

// one partial mulligan: keep a hand with at least two cheap Things; otherwise set aside everything else
function mulligan(S, i) {
  const h = S.players[i].hand, d = c => E.card(c);
  const cheap = h.filter(c => d(c).type === 'thing' && d(c).cost <= 2);
  if (cheap.length >= 2) return h.filter(c => d(c).cost >= 3 && d(c).type !== 'thing').map(c => c.pid).slice(0, 1);
  return h.filter(c => !(d(c).type === 'thing' && d(c).cost <= 2)).map(c => c.pid);
}

// Worth a one-ply search cannot see: engines, recursion and progress along a recipe chain or ladder.
const ENGINE = { energy: 1.6, gold: 1.6, lifeHeal: 1.2, worldTree: 2.5, stone: 2.5 };
const FORM_PROGRESS = { 'earth.tin': 0.6, 'earth.copper': 0.6, 'earth.silver': 1.2, 'earth.gold': 2, 'life.sapling': 0.8, 'life.oak': 1.5, 'life.willow': 1.2 };
function alchemyWorth(t) {
  const c = E.card(t);
  let v = (ENGINE[c.upkeep] || 0) + (FORM_PROGRESS[c.id] || 0);
  if (t.lineage) v += 0.8 + (c.made ? 0.5 * (c.kw || []).includes('final') + 0.4 * ((c.schools || []).length) : 0.6 * ((t.mods && t.mods.infusions.length) || 0));
  if (c.rebirth) v += 1.5;
  if (t.token) v -= 0.3;
  return v;
}

const POLICIES = {
  aggressive: { life: 1.4, str: 0.7, st: 0.35, hand: 0.4, blockAt: 6, hold: 0.35, spark: 0.2, alchemy: 1 },
  careful: { life: 1.0, str: 0.55, st: 0.55, hand: 0.6, blockAt: 3, hold: 0.6, spark: 0.2, alchemy: 1 },
};

// defender's blocking choice (public information only)
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
      if (!info.target && !info.ground) { // attack on me
        const lethal = S.players[me].life <= dmg + 2;
        if (dmg < w.blockAt && !lethal) continue;
        sc = (survives ? 6 : 0) + (kills ? 4 : 0) + (lethal ? 50 : dmg) - (survives ? 0 : bv * 0.6);
      } else if (info.ground) {
        const g = S.players[me].ground; if (E.groundRemaining(g) > dmg) continue;
        sc = 3 + (survives ? 3 : -bv * 0.6) + (kills ? 3 : 0);
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

// Breath kept for the rival's turn is worth something only when the hand holds a cheap Response.
function holdValue(S, me, w) {
  const p = S.players[me];
  const rs = p.hand.filter(c => c.word !== HIDDEN && E.card(c).r && E.card(c).cost <= 2);
  if (!rs.length || !S.rules.reserve) return 0;
  return w.hold * Math.min(2, p.breath, Math.max(...rs.map(c => E.card(c).cost)));
}

// Clause windows: evaluate each legal Response by resolving the pending Clause on a redacted copy.
// The defender cannot see an answer coming, so it assumes none.
function responder(policyOf) {
  return (S, side, kind) => {
    const opts = E.legalResponses(S, side, kind);
    if (!opts.length) return null;
    const w = POLICIES[policyOf(side)];
    const run = opt => {
      const c = redact(S, side);
      if (opt) E.addResponse(c, side, opt, { block: null });
      E.resolveClause(c);
      const spent = opt ? E.card(S.players[side].hand.find(x => x.pid === opt.card)).cost : 0;
      return value(c, side, w) - (kind === 'answer' ? 0.4 * spent : 0) - (opt ? 0.6 : 0); // a card used is a card gone
    };
    let best = null, bestV = run(null) + 0.4;
    for (const o of opts) { let v; try { v = run(o); } catch (e) { continue; } if (v > bestV) { bestV = v; best = o; } }
    return best;
  };
}

function controller(policyOf, { responses = true } = {}) {
  return { block: blocker(policyOf), respond: responses ? responder(policyOf) : null };
}

function chooseAction(S, policyOf) {
  const me = S.active, w = POLICIES[policyOf(me)], blk = blocker(policyOf);
  const acts = E.legalActions(S).filter(a => a.type !== 'pass');
  const base = value(S, me, w) + holdValue(S, me, w);
  let best = null, bestV = base + 0.05; // must strictly improve on doing nothing
  for (const a of acts) {
    const c = clone(S);
    try { E.apply(c, a, { block: blk, respond: null }); } catch (e) { continue; }
    const bonus = a.type === 'deploy' || a.type === 'ground' ? 0.8 : a.type === 'buy' ? cardWorth(S, me, S.market[a.slot].word) : 0;
    const v = value(c, me, w) + holdValue(c, me, w) + bonus;
    if (v > bestV) { bestV = v; best = a; }
  }
  return best || { type: 'pass' };
}

module.exports = { chooseAction, blocker, responder, controller, mulligan, POLICIES, clone, redact, value };
