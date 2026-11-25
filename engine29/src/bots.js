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
      + (w.alchemy || 0) * alchemyWorth(t, S);
  };
  const board = i => side(i).reduce((a, t) => a + thingV(t), 0) + (P[i].ground ? 1 + 0.2 * E.groundRemaining(P[i].ground) : 0);
  const proc = i => (w.alchemy || 1) * (S.processes || []).filter(x => x.open && x.owner === i).reduce((a, x) => a + (x.family === 'bear' ? 1.4 : 1.0), 0); // C-life: a pending output, discounted
  return w.life * (P[me].life - P[1 - me].life) + board(me) - board(1 - me) + proc(me) - proc(1 - me) + w.hand * (P[me].hand.length - P[1 - me].hand.length)
    - 1.5 * (P[me].poison - P[1 - me].poison) + w.spark * (P[me].spark - P[1 - me].spark) + 0.5 * (P[me].catalyst - P[1 - me].catalyst)
    + (S.sky ? (S.sky.caster === me ? 1.2 : -1.2) : 0) + (P[1 - me].burden ? 1 : 0) - (P[me].burden ? 1 : 0) // lasting effects a one-ply view under-rates + (P[1 - me].life <= 0 ? 1e5 : 0);
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
// V31 (formats with modules only): preparation and future outputs a one-ply search cannot see
const FOLIO_WORTH = { 'token.fruit': 1.2, 'earth.setting': 0.6, 'made.signet': 1.6, 'earth.garnet': 0.4, 'rot.mould': 0.5 };
function folioWorth(S, t) {
  const c = E.card(t); let v = FOLIO_WORTH[c.id] || 0;
  if (E.trait(S, t, 'carrier') && S.things.some(h => h.ctrl === t.ctrl && E.trait(S, h, 'pollination') === E.trait(S, t, 'carrier'))) v += 0.5; // a working pollination pair
  if (E.trait(S, t, 'pollination') && S.things.some(h => h.ctrl === t.ctrl && E.trait(S, h, 'carrier') === E.trait(S, t, 'pollination'))) v += 0.5;
  if ((c.id === 'earth.copper' || c.id === 'earth.silver') && S.things.some(o => o.ctrl === t.ctrl && E.card(o).id === 'earth.garnet')) v += 0.3; // a jewel waiting for a setting
  if (c.id === 'earth.setting' && S.things.some(o => o.ctrl === t.ctrl && E.card(o).id === 'earth.garnet')) v += 0.6;
  return v;
}
function alchemyWorth(t, S) {
  const c = E.card(t);
  let v = (ENGINE[c.upkeep] || 0) + (FORM_PROGRESS[c.id] || 0) + (S && S.rules.modules && S.rules.modules.length ? folioWorth(S, t) : 0);
  if (t.lineage) v += 0.8 + (c.made ? 0.5 * (c.kw || []).includes('final') + 0.4 * ((c.schools || []).length) : 0.6 * ((t.mods && t.mods.infusions.length) || 0));
  if (c.rebirth) v += 1.5;
  if (t.token) v -= 0.3;
  return v;
}

const styleOf = pol => String(pol).split(':')[0];
const tierOf = pol => String(pol).split(':')[1] || 'journeyman';
// Optional third segment ':ra' = response-aware (V30 C2). Same visibility rules: redacted copies, own hand, public state.
const raOf = pol => String(pol).split(':')[2] === 'ra';
// tuning knobs for the response-aware policy (diagnostics may override through RA_OPTS)
const RA_OPTS = { hold: false, samples: true, cardPen: 0.3, threshold: 0.2, deny: 1.0 }; // hold: true lost head-to-head (41%); see report
// §10.4 difficulty tiers. depth = own-turn plies searched; beam = children kept per ply; noise = chance of a
// weaker-but-legal pick; samples = sampled rival hands used to anticipate a reply from reserve.
const TIERS = {
  apprentice: { depth: 1, beam: 1, noise: 0.45, responses: false },
  initiate: { depth: 1, beam: 1, noise: 0.15, responses: true },
  journeyman: { depth: 1, beam: 1, noise: 0, responses: true },
  specialist: { depth: 2, beam: 4, noise: 0, responses: true },
  expert: { depth: 2, beam: 4, noise: 0, responses: true, samples: 2 },
  master: { depth: 3, beam: 4, noise: 0, responses: true, samples: 3 },
};
const TIER_ORDER = Object.keys(TIERS);

const POLICIES = {
  aggressive: { life: 1.4, str: 0.7, st: 0.35, hand: 0.4, blockAt: 6, hold: 0.35, spark: 0.2, alchemy: 1 },
  careful: { life: 1.0, str: 0.55, st: 0.55, hand: 0.6, blockAt: 3, hold: 0.6, spark: 0.2, alchemy: 1 },
  // V31 engine-building pilot: same public information, values preparation and future outputs (alchemy, processes) more
  builder: { life: 1.0, str: 0.55, st: 0.55, hand: 0.6, blockAt: 3, hold: 0.6, spark: 0.2, alchemy: 2.2 },
};

// defender's blocking choice (public information only)
function blocker(policyOf) {
  return (S, info) => {
    const me = 1 - info.attacker.ctrl, w = POLICIES[styleOf(policyOf(me))];
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
function holdValue(S, me, w, ra = false) {
  const p = S.players[me], cap = S.rules.reserveCap || 2;
  if (!ra || !RA_OPTS.hold) { // unchanged reference policy
    const r0 = p.hand.filter(c => c.word !== HIDDEN && E.card(c).r && E.card(c).cost <= 2);
    if (!r0.length || !S.rules.reserve) return 0;
    return w.hold * Math.min(2, p.breath, Math.max(...r0.map(c => E.card(c).cost)));
  }
  const rs = p.hand.filter(c => c.word !== HIDDEN && E.card(c).r && respCost(S, c) <= cap);
  if (!rs.length || !S.rules.reserve) return 0;
  const need = Math.min(...rs.map(c => respCost(S, c)));
  // response-aware: keeping enough breath for the cheapest Response is worth more when the rival has something to answer
  const threat = S.things.some(t => t.ctrl !== me && E.curStrike(S, t) > 0) || S.players[1 - me].hand.length > 2;
  return p.breath >= need ? w.hold * (threat ? 1.6 : 0.6) * need + 0.4 * Math.min(rs.length, 2) : 0;
}
// a Response's reserve cost under the current format (cheaper-response experiments lower it, never below 1)
function respCost(S, c) { const d = E.card(c), disc = S.rules.responseDiscount && S.rules.responseDiscount[d.id]; return Math.max(1, d.cost - (disc || 0)); }
// future damage a rival Thing cannot deal while it sleeps, is frozen or bound (value() only half-discounts it)
function denied(S, me) { return S.things.filter(t => t.ctrl !== me && E.incapacitated(t)).reduce((a, t) => a + E.curStrike(S, t), 0); }

// Clause windows: evaluate each legal Response by resolving the pending Clause on a redacted copy.
// The defender cannot see an answer coming, so it assumes none.
function responder(policyOf) {
  return (S, side, kind) => {
    const opts = E.legalResponses(S, side, kind);
    if (!opts.length) return null;
    const w = POLICIES[styleOf(policyOf(side))];
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

// Response-aware Clause play: every legal Response (and passing) is resolved on a redacted copy; the cost of a
// Response is the worth of the card spent (reserve that is not used is lost at the next Renew anyway), plus breath
// for an answer; denying a rival Thing's next attack counts. Only the deciding side's hand and public state are used.
function responderRA(policyOf) {
  return (S, side, kind) => {
    const opts = E.legalResponses(S, side, kind);
    if (!opts.length) return null;
    const w = POLICIES[styleOf(policyOf(side))], hand = S.players[side].hand;
    const run = opt => {
      const c = redact(S, side);
      if (opt) E.addResponse(c, side, opt, { block: null });
      E.resolveClause(c);
      const card = opt && hand.find(x => x.pid === opt.card);
      const pen = opt ? RA_OPTS.cardPen * cardWorth(S, side, card.word) + (kind === 'answer' ? 0.4 * respCost(S, card) : 0) : 0;
      return value(c, side, w) + RA_OPTS.deny * w.str * denied(c, side) - pen;
    };
    let best = null, bestV = run(null) + RA_OPTS.threshold;
    for (const o of opts) { let v; try { v = run(o); } catch (e) { continue; } if (v > bestV) { bestV = v; best = o; } }
    return best;
  };
}

function controller(policyOf, { responses = true } = {}) {
  const tierResp = side => TIERS[tierOf(policyOf(side))].responses || raOf(policyOf(side));
  const r = responder(policyOf), ra = responderRA(policyOf);
  return { block: blocker(policyOf), respond: responses ? (S, side, kind) => (!tierResp(side) ? null : raOf(policyOf(side)) ? ra(S, side, kind) : r(S, side, kind)) : null };
}

// Decisions raised during resolution (§4.6). Bots answer from what the deciding player can see.
function decider(policyOf) {
  return (S, side, kind, options, dflt) => {
    if (kind === 'select') { let bk = dflt, bv = -1e9; options.forEach((w, k) => { const v = cardWorth(S, side, w); if (v > bv) { bv = v; bk = k; } }); return bk; }
    if (kind === 'debt') { const want = options.includes('spark') && (S.players[side].life <= 6 || S.players[side].spark >= 3) ? 'spark' : 'life'; return options.indexOf(want); }
    return dflt; // documented defaults for the rest
  };
}

// deterministic per-state pseudo-random number (keeps every run reproducible)
// The response-aware policy seeds from the redacted state, so even its randomness cannot vary with hidden cards or deck order.
function stateRand(S, salt, pub = false) { let h = parseInt(E.hashState(pub ? redact(S, S.active) : S), 16) ^ salt; return () => { h = (h + 0x6D2B79F5) | 0; let t = Math.imul(h ^ (h >>> 15), 1 | h); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// Plausible rival hands for anticipation: the rival's declared schools are public; words already seen are excluded (singleton).
function sampleRivalHand(S, me, r) {
  const rv = S.players[1 - me];
  const seen = new Set(rv.grave.map(g => g.word).concat(rv.sealed.map(g => g.word), S.things.filter(t => t.owner === rv.i && t.pid).map(t => t.word)));
  const mods = (S.rules && S.rules.modules) || [];
  const pool = Object.values(require('./cards').BY_ID).filter(c => (c.deckLegal || (c.folio && !c.made && !c.transformedOnly && mods.includes(c.folio))) && rv.schools.includes(c.school) && !seen.has(c.id)).map(c => c.id);
  return rv.hand.map((x, k) => ({ pid: '?s' + k, word: pool.length ? pool[Math.floor(r() * pool.length)] : HIDDEN, owner: rv.i }));
}

function stepValue(S0, c, me, w, a, ra = false) {
  let bonus = a.type === 'deploy' || a.type === 'ground' ? 0.8 : a.type === 'buy' ? cardWorth(S0, me, S0.market[a.slot].word) : 0;
  if (a.type === 'spell' && a.sacrifice && a.targets && S0.rules.modules && S0.rules.modules.length) { // V31 Feast: readied bodies are future strikes this turn, if breath allows
    const p = c.players[me]; let k = p.breath;
    for (const id of a.targets) { const t = c.things.find(x => x.id === id); if (t && !t.exhausted && k >= 1) { bonus += 0.8 * E.curStrike(c, t); k--; } }
  }
  return value(c, me, w) + holdValue(c, me, w, ra) + bonus;
}
function tryApply(c, a, ctl) { try { E.apply(c, a, ctl); return true; } catch (e) { return false; } }

function chooseAction(S, policyOf) {
  const me = S.active, pol = policyOf(me), w = POLICIES[styleOf(pol)], T = TIERS[tierOf(pol)], blk = blocker(policyOf), ra = raOf(pol);
  const samples = T.samples || (ra && RA_OPTS.samples && S.players[1 - me].reserve > 0 ? 1 : 0);
  const acts = E.legalActions(S).filter(a => a.type !== 'pass');
  const base = value(S, me, w) + holdValue(S, me, w, ra);
  // ply 1: every legal sentence, applied to a redacted copy (rival assumed not to respond)
  const kids = [];
  for (const a of acts) { const c = clone(S); if (!tryApply(c, a, { block: blk, respond: null })) continue; kids.push({ a, c, v: stepValue(S, c, me, w, a, ra) }); }
  kids.sort((x, y) => y.v - x.v);
  // deeper plies: continue each of the best `beam` lines within this turn; a line's worth is its best continuation (or stopping)
  if (T.depth > 1) {
    const extend = (node, depth) => {
      if (depth <= 1 || node.c.over != null || node.c.active !== me) return node.v;
      const next = E.legalActions(node.c).filter(a => a.type !== 'pass' && a.type !== 'buy');
      const gs = [];
      for (const a of next) { const c = clone(node.c); if (!tryApply(c, a, { block: blk, respond: null })) continue; gs.push({ a, c, v: stepValue(node.c, c, me, w, a, ra) + (node.v - value(node.c, me, w) - holdValue(node.c, me, w, ra)) }); }
      gs.sort((x, y) => y.v - x.v);
      let best = node.v;
      for (const g of gs.slice(0, T.beam)) best = Math.max(best, extend(g, depth - 1));
      return best;
    };
    for (const k of kids.slice(0, T.beam)) k.deep = extend(k, T.depth);
    for (const k of kids) if (k.deep === undefined) k.deep = k.v;
  } else for (const k of kids) k.deep = k.v;
  // anticipation: replay the best candidates against sampled rival hands answering from reserve
  if (samples) {
    const r = stateRand(S, 7, ra), rival = ra ? responderRA(policyOf) : responder(policyOf);
    for (const k of kids.slice(0, T.beam)) {
      let tot = 0;
      for (let s = 0; s < samples; s++) {
        const c = clone(S); c.players[1 - me].hand = sampleRivalHand(S, me, r);
        const ctl = { block: blk, respond: (S2, side, kind) => (side !== me ? rival(S2, side, kind) : null) };
        tot += tryApply(c, k.a, ctl) ? stepValue(S, c, me, w, k.a, ra) : k.v;
      }
      k.deep += tot / samples - k.v; // adjust the line by the expected cost of a reply
    }
  }
  const ranked = kids.filter(k => k.deep > base + 0.05).sort((x, y) => y.deep - x.deep);
  if (!ranked.length) return { type: 'pass' };
  if (T.noise) { const r = stateRand(S, 13, ra); if (r() < T.noise) return ranked[Math.min(ranked.length - 1, 1 + Math.floor(r() * 2))].a; }
  return ranked[0].a;
}

module.exports = { RA_OPTS, chooseAction, blocker, responder, responderRA, raOf, controller, decider, mulligan, POLICIES, TIERS, TIER_ORDER, clone, redact, value, sampleRivalHand };
