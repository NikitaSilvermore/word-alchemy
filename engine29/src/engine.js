// V29 "The Grammar" — headless authoritative engine, stages A–C (subset).
// One reducer and one legal-action generator serve tests, bots and simulation.
// Arithmetic models: 'v29' (spec §4.9, integer, additive, one packet, one overflow)
// and 'legacy' (emulation of the V28 percentage pipeline, for paired comparison only).
//
// Stage B: stable physical IDs, zones with reasons, damageable Ground, illegal-sentence reasons,
//          zone invariant audit.
// Stage E: Vessel fusion (named and compositional recipes), computed catalysts, physical lineage, release,
//          Separate, metal and plant ladders, tokens, sacrifice costs, Recurrent, Phoenix and Ouroboros.
// Stage C: reserve, bounded Clause (declaration → blocker → defender response → active answer →
//          reverse resolution with revalidation), Response cards, controller-relative expiry,
//          deterministic trigger order, event log.
'use strict';
const { BY_ID, capabilities } = require('./cards');
const R = require('./recipes');

const FORMAT = {
  id: 'grammar_v29_test', life: 30, deckSize: 20, openingHand: 5, handCap: 7, slots: 5,
  breathCap: 8, extraBreathCap: 2, poolCap: 10, reserveCap: 2, secondPlayerReserve: 1,
  roundCap: 15, poisonCap: 3, bedrockCap: 2, growthCap: 3, mightCap: 2, qualityCap: 2,
  sparkCap: 5, catalystCap: 1, catalystPrice: 2, ownPrice: 2, offPrice: 3, offSchoolBuysPerDuel: 1, copyLimit: 2,
  marketOrigins: ['A', 'A', 'B', 'B', 'X'], marketRefreshRounds: [3, 6, 9, 12, 15],
};
// Experimental economy overrides for stage D/H tests only (never set in normal play): WA_ECON=price3|nosentence
if (process.env.WA_ECON === 'price3') { FORMAT.ownPrice = 3; FORMAT.offPrice = 4; }
const NO_SENTENCE_SPARK = process.env.WA_ECON === 'nosentence';
// Market diagnostics (test only): WA_MKT=norefresh | p2refresh (refresh at the second player's step) | from2 (no purchases in round 1) | nobuy (offers shown, never purchasable)
const MKT = process.env.WA_MKT || '';
if (MKT === 'norefresh') FORMAT.marketRefreshRounds = [];
// Fair-initiative variants for stage D experiments. 'spec' is the V29 candidate (P2 starts with 1 reserve).
const INITIATIVE = {
  spec: { p2Reserve: 1 },
  none: { p2Reserve: 0 },
  reserve2: { p2Reserve: 2 },
  card: { p2Reserve: 1, p2ExtraCard: 1 },
  breath: { p2Reserve: 1, p2FirstTurnBreath: 1 },
  spark: { p2Reserve: 1, p2Spark: 2 },
  // stage H candidates
  p1slow: { p2Reserve: 1, p1FirstTurnBreath: -1 },          // starting player's first turn has 2 breath, not 3
  p1hand4: { p2Reserve: 1, p1HandMinus: 1 },               // starting player opens with 4 words
  breath2: { p2Reserve: 1, p2FirstTurnBreath: 2 },
  combo: { p2Reserve: 1, p2FirstTurnBreath: 1, p1FirstTurnBreath: -1 },
  combo2: { p2Reserve: 1, p2FirstTurnBreath: 2, p1FirstTurnBreath: -1 },
};

// ---------- decisions (§4.6: every choice is a legal decision) ----------
// A match may carry a decider(S, side, kind, options) -> index. Kept outside the state so copies stay plain data;
// a copy without one (bot lookahead, replay without input) uses each decision's documented default.
const DECIDERS = new WeakMap();
function setDecider(S, fn) { DECIDERS.set(S, fn); }
function decide(S, side, kind, options, dflt = 0) {
  if (!options.length) return -1;
  const fn = DECIDERS.get(S);
  let k = fn ? fn(S, side, kind, options, dflt) : dflt;
  if (!Number.isInteger(k) || k < 0 || k >= options.length) k = dflt;
  event(S, 'decision', { side, kind, n: options.length, k });
  return k;
}

// ---------- RNG ----------
function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
function shuffle(arr, r) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ---------- setup ----------
function deckErrors(deck) {
  const e = [];
  if (deck.length !== FORMAT.deckSize) e.push('deck must have ' + FORMAT.deckSize + ' words');
  if (new Set(deck).size !== deck.length) e.push('words must be distinct');
  const sch = new Set();
  for (const id of deck) { const c = BY_ID[id]; if (!c) { e.push('unknown ' + id); continue; } if (!c.deckLegal) e.push('not deck-legal ' + id); sch.add(c.school); }
  if (sch.size < 1 || sch.size > 3) e.push('1–3 schools');
  return e;
}

function mainSchool(deck) {
  const n = {}; for (const id of deck) { const s = BY_ID[id].school; n[s] = (n[s] || 0) + 1; }
  return Object.entries(n).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? -1 : 1))[0][0];
}

function createMatch({ decks, seed = 1, arithmetic = 'v29', first = null, reserve = true, market = true, initiative = 'spec', mulligan = null, marketBreath = 0, variant = {} }) {
  decks.forEach((d, i) => { const e = deckErrors(d); if (e.length) throw new Error('deck ' + i + ': ' + e.join('; ')); });
  const r = rng(seed);
  let nextId = 1;
  const S = {
    format: FORMAT.id, arithmetic, seed, turn: 0, round: 0, active: 0, over: null, seq: 0, ev: 0,
    rules: { reserve, market, initiative, marketBreath, freeStrike: !!variant.freeStrike, draws: variant.draws || 1,
      // V30 experiment levers (defaults = rc1 reference)
      priceOwn: variant.priceOwn || FORMAT.ownPrice, priceOff: variant.priceOff || FORMAT.offPrice, sentenceSpark: variant.sentenceSpark !== false,
      incomeEvery: variant.incomeEvery || 1, buyEvery: variant.buyEvery || 1, reserveCap: variant.reserveCap || FORMAT.reserveCap, responseDiscount: variant.responseDiscount || null }, mseed: (seed ^ 0x5bd1e995) >>> 0, market: [],
    rand: r, log: [], events: [], hashes: [], clause: null, registry: {}, flags: {},
    players: decks.map((d, i) => ({
      i, life: FORMAT.life, breath: 0, reserve: 0, extraBreath: 0, personalTurn: 0, fatigue: 0, poison: 0,
      spark: 0, catalyst: 1, sentenceSpark: false, abilitySpark: false, bought: false, offSchoolBought: 0, discountUsed: 0,
      schools: [...new Set(d.map(w => BY_ID[w].school))].sort(), fusedTurn: 0, phoenixUsed: false, ouroUsed: false, barrowTurn: 0, potionTurn: 0, acquired: Object.fromEntries(d.map(w => [w, 1])), mulliganed: false,
      deck: shuffle(d.map(w => ({ pid: 'c' + i + '_' + (nextId++), word: w, owner: i })), r),
      hand: [], grave: [], sealed: [], ground: null, main: mainSchool(d), usedVerbs: {}, leechUsed: false,
    })),
    things: [], // field instances
    stats: { res: [0, 1].map(() => ({ breathSpent: 0, breathWasted: 0, reserveKept: 0, reserveUsed: 0, sparkGained: 0, sparkSpent: 0, drawn: 0, bought: 0, played: {}, lifeLost: {}, healed: 0 })), packets: [], firstLethalRound: null, responses: 0, answers: 0, failed: 0, cancelled: 0, made: {}, fusions: 0, transforms: 0, tokens: 0 },
  };
  for (const p of S.players) for (const c of p.deck) S.registry[c.pid] = true;
  S.active = first != null ? first : (r() < 0.5 ? 0 : 1);
  S.first = S.active;
  const ini = INITIATIVE[initiative], p2 = S.players[1 - S.first];
  if (reserve) p2.reserve = ini.p2Reserve; // §3.2 second-player compensation
  for (const p of S.players) for (let k = 0; k < FORMAT.openingHand + (p === p2 ? ini.p2ExtraCard || 0 : -(ini.p1HandMinus || 0)); k++) p.hand.push(p.deck.shift());
  if (ini.p2Spark) p2.spark = ini.p2Spark;
  // one partial mulligan each, starting player first (§3.2)
  for (const i of [S.first, 1 - S.first]) applyMulligan(S, i, mulligan ? mulligan(S, i) : []);
  if (market) for (let k = 0; k < FORMAT.marketOrigins.length; k++) S.market.push(newOffer(S, k));
  startTurn(S);
  return S;
}

// ---------- mulligan (§3.2) ----------
function applyMulligan(S, i, pids) {
  const p = S.players[i];
  if (p.mulliganed) throw new Error('one mulligan only');
  p.mulliganed = true;
  if (!pids || !pids.length) { event(S, 'mulligan', { side: i, n: 0 }); return; }
  const aside = pids.map(pid => takeCard(p, pid));
  for (let k = 0; k < aside.length; k++) p.hand.push(p.deck.shift());
  p.deck = shuffle(p.deck.concat(aside), S.rand);
  event(S, 'mulligan', { side: i, n: aside.length });
}

// ---------- market (§4.4) ----------
// separate integer RNG state so offers are reproducible and independent of deck shuffles
function mnext(S) {
  if (S.mseed == null) throw new Error('market RNG is not visible to this view');
  S.mseed = (S.mseed + 0x6D2B79F5) >>> 0; let t = S.mseed;
  t = Math.imul(t ^ (t >>> 15), 1 | t); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
const ALL_SCHOOLS = ['air', 'earth', 'fire', 'life', 'rot', 'water', 'word'];
function marketPool(school) { return Object.values(BY_ID).filter(c => c.deckLegal && c.school === school && c.market !== false).map(c => c.id).sort(); }
function newOffer(S, k) {
  const origin = FORMAT.marketOrigins[k];
  const A = S.players[S.first].schools, Bs = S.players[1 - S.first].schools;
  let schools = origin === 'A' ? A : origin === 'B' ? Bs : ALL_SCHOOLS.filter(x => !A.includes(x) && !Bs.includes(x));
  if (!schools.length) schools = ALL_SCHOOLS;
  const shown = new Set(S.market.filter(Boolean).map(o => o.word));
  const order = schools.slice();
  // choose school first, then word; skip schools whose pool is exhausted; never retry forever
  while (order.length) {
    const sc = order.splice(Math.floor(mnext(S) * order.length), 1)[0];
    const pool = marketPool(sc).filter(w => !shown.has(w));
    if (pool.length) return { slot: k, origin, word: pool[Math.floor(mnext(S) * pool.length)] };
  }
  return null;
}
function marketStep(S) {
  const p = S.players[S.active];
  if ((p.personalTurn - 1) % S.rules.incomeEvery === 0) gainSpark(S, p, 'income'); // guaranteed income (cadence is an experiment lever)
  if (!S.rules.market) return;
  const refresh = (MKT === 'p2refresh' ? S.active !== S.first : S.active === S.first) && FORMAT.marketRefreshRounds.includes(S.round);
  for (let k = 0; k < S.market.length; k++) if (refresh || !S.market[k]) { S.market[k] = null; S.market[k] = newOffer(S, k); }
  event(S, 'market', { refresh, offers: S.market.map(o => o && o.word) });
}
function priceOf(S, side, word) { return S.players[side].schools.includes(BY_ID[word].school) ? S.rules.priceOwn : S.rules.priceOff; }
function sparkFor(S, n) { // first qualifying successful paid hand-card sentence this own turn
  const p = S.players[n.side];
  if (NO_SENTENCE_SPARK || !S.rules.sentenceSpark || n.side !== S.active || n.kind === 'response' || !n.cardUsed || n.noEffect || n.noSpark || p.sentenceSpark) return;
  p.sentenceSpark = true; gainSpark(S, p, 'sentence');
}

function mightFor(S, n) { // Word: first other successful hand-card sentence each own turn grants 1 Might
  const p = S.players[n.side];
  if (n.side !== S.active || n.kind === 'response' || !n.cardUsed || n.noEffect) return;
  for (const t of S.things) if (t.ctrl === n.side && card(t).mightOnSentence && t.pid !== n.cardPid && t.mightTurn !== p.personalTurn) {
    t.mightTurn = p.personalTurn; t.counters.might = Math.min(FORMAT.mightCap, (t.counters.might || 0) + 1);
  }
}

// ---------- helpers ----------
const say = (S, x) => { S.log.push(x); };
const event = (S, type, o = {}) => { S.events.push({ n: ++S.ev, turn: S.turn, type, ...o }); };
const HIDDEN = { id: '?', type: 'hidden', cost: 0, strike: 1, stand: 3, props: ['body'], kw: [] }; // a card a redacted view cannot see (placeholder belief)
const card = c => BY_ID[c.form || c.word] || HIDDEN; // current form (ladders/made) or printed word
const MOD0 = { strike: 0, stand: 0, props: [], kw: [], kwRemove: [], cap: [], infusions: [], schools: [] };
// one modifier view: fusion infusions + physical Quality attachments + the Law's virtual Quality (+ Awaken's Body)
function qualityDefs(t) {
  const q = (t.quals || []).map(a => BY_ID[a.word].qual);
  if (t.lawQual && !(t.quals || []).some(a => a.word === t.lawQual)) q.push(BY_ID[t.lawQual].qual); // no extra copy of the same effect
  return q;
}
function modsOf(t) {
  const base = t.mods || MOD0, q = qualityDefs(t);
  if (!q.length && !t.extraProps) return base;
  const m = { ...MOD0, ...base, props: base.props.concat(t.extraProps || []), kw: base.kw.slice(), kwRemove: base.kwRemove.slice(), cap: (base.cap || []).slice() };
  for (const d of q) {
    if (d.notHeavy && ((card(t).kw || []).includes('heavy') || m.kw.includes('heavy'))) continue; // a Heavy host cannot be Winged
    m.strike += d.strike || 0; m.stand += d.stand || 0;
    m.props = m.props.concat(d.props || []); m.kw = m.kw.concat(d.kw || []); m.kwRemove = m.kwRemove.concat(d.kwRemove || []); m.cap = m.cap.concat(d.cap || []);
    for (const f of ['firebrand', 'resonant', 'rustImmune', 'brittleImmune']) if (d[f]) m[f] = true;
  }
  return m;
}
function propsOf(t) { const m = modsOf(t); return m.props.length ? [...new Set((card(t).props || []).concat(m.props))] : (card(t).props || []); }
function kws(S, t) {
  const m = modsOf(t);
  const k = new Set((card(t).kw || []).concat(m.kw));
  for (const x of m.kwRemove) k.delete(x);
  if (t.tempGuard) k.add('guard');
  const g = S.players[t.ctrl].ground;
  if (g && card(g).static === 'heavyReach' && k.has('heavy')) k.add('reach');
  if (t.status.wet && prop(t, 'winged')) k.delete('flying');
  if (S.sky && card(S.sky).weather === 'desert' && prop(t, 'winged')) k.delete('flying'); // wingless flyers unaffected
  if (k.has('heavy') && prop(t, 'winged') && !(card(t).kw || []).includes('heavy')) k.delete('flying'); // wing-derived flight suppressed while Heavy
  return k;
}
function caps(S, t) { const m = modsOf(t); return capabilities({ ...card(t), props: propsOf(t), cap: (card(t).cap || []).concat(m.cap || []) }, kws(S, t)); }
function has(S, t, k) { return kws(S, t).has(k); }
function prop(t, p) { return propsOf(t).includes(p); }
function maxStand(S, t) { return card(t).stand + modsOf(t).stand + (t.counters.bedrock || 0) + (t.counters.growth || 0) + (t.tempStand || 0); }
function curStrike(S, t) {
  let s = card(t).strike + modsOf(t).strike + (t.counters.might || 0) + (t.tempStrike || 0);
  if (card(t).packBonus && S.things.some(o => o !== t && o.ctrl === t.ctrl && prop(o, 'beast'))) s += 1;
  if (S.arithmetic === 'legacy') { s += t.attuned ? 2 : 0; s += (t.counters.bedrock || 0) + (t.tempStand || 0); } // legacy: stand growth feeds strike
  if (t.status.blinded) s -= 2;
  return Math.max(0, s);
}
function legacyStand(S, t) { return S.arithmetic === 'legacy' && t.attuned ? 2 : 0; }
function standOf(S, t) { return maxStand(S, t) + legacyStand(S, t); }
function remainingOf(S, t) { return standOf(S, t) - t.damage; }
function groundRemaining(g) { return card(g).stand - (g.damage || 0); }
function incapacitated(t) { return !!(t.status.asleep || t.status.frozen || t.status.bound); }
// counters respect Measured and their caps; "added at cap do not count as gained"
function addCounter(S, t, k, n = 1) {
  if (t.status.measured && ['growth', 'might', 'bedrock'].includes(k)) return 0;
  const cap = { growth: FORMAT.growthCap, might: FORMAT.mightCap, bedrock: FORMAT.bedrockCap }[k] || 99;
  const before = t.counters[k] || 0, after = Math.min(cap, before + n); t.counters[k] = after;
  if (after > before && k === 'growth') growthGained(S, t);
  return after - before;
}
function growthGained(S, t) { // Pear: first time another friendly Plant gains Growth during its controller's own turn
  const p = S.players[t.ctrl];
  if (t.ctrl !== S.active || !prop(t, 'plant')) return;
  for (const pr of S.things.filter(o => o !== t && o.ctrl === t.ctrl && card(o).pear)) {
    if (pr.pearTurn === p.personalTurn) continue; pr.pearTurn = p.personalTurn;
    if (!S.things.some(o => o.ctrl === t.ctrl && card(o).id === 'token.fruit')) createToken(S, t.ctrl, 'token.fruit');
  }
}
function gainAbilitySpark(S, p) { if (p.abilitySpark) return false; p.abilitySpark = true; gainSpark(S, p, 'ability'); return true; }
function gainSpark(S, p, why) { const g = Math.min(FORMAT.sparkCap, p.spark + 1) - p.spark; p.spark += g; S.stats.res[p.i].sparkGained += g; if (why !== 'income') event(S, 'spark', { side: p.i, why }); }
function canIgnite(t) { return prop(t, 'flammable') && !t.status.wet; }
// Ignite = apply/refresh Burning (2 ticks), no implied damage; Wet prevents (§5.5, §5.7)
function ignite(S, t, bySide) {
  if (!t || !canIgnite(t)) return false;
  t.status.burning = 2; event(S, 'ignite', { tid: t.id });
  if (bySide != null && bySide === S.active && t.ctrl !== bySide && S.sky && card(S.sky).weather === 'drought') {
    const p = S.players[bySide]; if (p.droughtTurn !== p.personalTurn) { p.droughtTurn = p.personalTurn; damageThing(S, t, 1); }
  }
  if (card(t).naphtha && t.pid && !S.flags[t.pid + ':naphtha']) { // first time this physical card is Ignited in the duel
    S.flags[t.pid + ':naphtha'] = true;
    for (const o of S.things.filter(o => o.ctrl !== t.ctrl)) damageThing(S, o, 2);
    if (S.things.includes(t)) destroy(S, t);
  }
  return true;
}
function destroy(S, t) { if (rebirthAvailable(S, t)) { t.damage = 999; return; } if (leaveField(S, t, 'destroyed')) deathTrigger(S, t); }
// control change: empty slot required; ownership kept; becomes Fresh and exhausted (§5.12)
function takeControl(S, t, side) {
  if (S.things.filter(o => o.ctrl === side).length >= FORMAT.slots) return false;
  t.ctrl = side; t.fresh = true; exhaust(t); t.tempGuard = false; event(S, 'control', { tid: t.id, side }); return true;
}
function enemy(S, i) { return S.players[1 - i]; }
function thingById(S, id) { return S.things.find(t => t.id === id); }
function exhaust(t) { t.exhausted = true; t.tempGuard = false; } // temporary Guard ends when it next exhausts (§8 Guard)
const isR = d => !!d.r;

// ---------- zones (stage B) ----------
function toGrave(S, c, reason) {
  const e = { pid: c.pid, word: c.word, owner: c.owner, reason };
  S.players[c.owner].grave.push(e);
  event(S, 'grave', { pid: c.pid, reason });
}
function newThing(S, side, o) {
  const p = S.players[side];
  const t = { id: 't' + (++S.seq), pid: null, owner: side, ctrl: side, entry: S.seq, damage: 0, counters: {}, status: {}, exhausted: false, fresh: true, actions: 0, arrivedTurn: p.personalTurn, ...o };
  S.things.push(t); return t;
}
function createToken(S, side, id) {
  if (S.things.filter(t => t.ctrl === side).length >= FORMAT.slots) { event(S, 'token-failed', { side, id }); return null; } // never displace
  const t = newThing(S, side, { word: id, form: id, token: true });
  S.stats.tokens++; event(S, 'token', { side, id, tid: t.id }); return t;
}
// public lineage record of a fusion ingredient (§7.4)
function lineageRecord(o, isGround) {
  if (isGround) return { pid: o.pid, word: o.word, owner: o.owner, ground: true, damage: o.damage || 0 };
  if (o.token) return { token: o.form, owner: o.owner };
  if (o.lineage) return { made: true, word: o.word, form: o.form, mods: o.mods || null, lineage: o.lineage, owner: o.owner };
  return { pid: o.pid, word: o.word, form: o.form || o.word, owner: o.owner };
}
function lineagePids(recs, out = []) { for (const r of recs || []) { if (r.pid) out.push(r); if (r.lineage) lineagePids(r.lineage, out); } return out; }
function release(S, recs, reason, sealed) {
  for (const r of lineagePids(recs)) { if (sealed) { S.players[r.owner].sealed.push({ pid: r.pid, word: r.word, owner: r.owner }); event(S, 'sealed', { pid: r.pid }); } else toGrave(S, r, reason); }
}
// remove a Thing from the field; `how` decides its destination (§5.12). Returns true when it is a death.
function retireQuals(S, t) { for (const a of t.quals || []) toGrave(S, a, 'retired'); t.quals = []; }
function leaveField(S, t, how) {
  S.things = S.things.filter(x => x !== t);
  retireQuals(S, t);
  if (t.token) { event(S, 'token-gone', { tid: t.id, how }); return how === 'destroyed' || how === 'sacrificed'; }
  if (t.lineage) {
    release(S, t.lineage, how === 'bounced' ? 'dissolved' : how === 'expired' ? 'retired' : 'released', how === 'sealed');
    event(S, 'unmade', { tid: t.id, how });
    return how === 'destroyed' || how === 'sacrificed';
  }
  if (how === 'bounced') {
    const o = S.players[t.owner], c = { pid: t.pid, word: t.word, owner: t.owner };
    if (o.hand.length >= FORMAT.handCap) toGrave(S, c, 'bounced-full-hand'); else o.hand.push(c);
    return false;
  }
  if (how === 'sealed') { S.players[t.owner].sealed.push({ pid: t.pid, word: t.word, owner: t.owner }); return false; }
  toGrave(S, t, how);
  return how === 'destroyed' || how === 'sacrificed';
}

// every registered physical card is in exactly one zone
function zoneAudit(S) {
  const seen = {}, errs = [];
  const put = (pid, z) => { if (seen[pid]) errs.push(`${pid} in ${seen[pid]} and ${z}`); else seen[pid] = z; };
  for (const p of S.players) {
    p.deck.forEach(c => put(c.pid, 'deck' + p.i)); p.hand.forEach(c => put(c.pid, 'hand' + p.i));
    p.grave.forEach(c => put(c.pid, 'grave' + p.i)); p.sealed.forEach(c => put(c.pid, 'sealed' + p.i));
    if (p.ground) put(p.ground.pid, 'ground' + p.i);
    if (p.hand.length > FORMAT.handCap) errs.push('hand over cap P' + p.i);
    if (S.things.filter(t => t.ctrl === p.i).length > FORMAT.slots) errs.push('field over slots P' + p.i);
    if (p.reserve > S.rules.reserveCap) errs.push('reserve over cap P' + p.i);
    if (p.spark > FORMAT.sparkCap || p.spark < 0) errs.push('spark out of range P' + p.i);
    if (p.breath > FORMAT.poolCap) errs.push('pool over cap P' + p.i);
    for (const [w, n] of Object.entries(p.acquired)) if (n > FORMAT.copyLimit) errs.push('copy limit ' + w);
  }
  S.things.forEach(t => { if (t.pid) put(t.pid, 'field'); for (const r of lineagePids(t.lineage)) put(r.pid, 'lineage'); for (const a of t.quals || []) put(a.pid, 'attached'); });
  if (S.clause) S.clause.nodes.forEach(n => { if (n.card) put(n.card.pid, 'pending'); for (const c of n.extra || []) put(c.pid, 'pending'); });
  if (S.sky) put(S.sky.pid, 'sky');
  if (S.law) S.law.cards.forEach(c => put(c.pid, 'law'));
  for (const p of S.players) if (p.burden) put(p.burden.pid, 'burden' + p.i);
  for (const t of S.things) if ((t.quals || []).length > FORMAT.qualityCap) errs.push('too many qualities on ' + t.id);
  if (S.market.filter(Boolean).length !== new Set(S.market.filter(Boolean).map(o => o.word)).size) errs.push('duplicate market offer');
  for (const pid of Object.keys(S.registry)) if (!seen[pid]) errs.push(pid + ' missing');
  for (const pid of Object.keys(seen)) if (!S.registry[pid]) errs.push(pid + ' unregistered');
  return errs;
}

// ---------- damage (spec §4.9) ----------
function packet(S, src, base, verb) {
  const steps = [['base strike', base]];
  let n = base;
  if (S.arithmetic === 'legacy') {
    const pl = S.players[src.ctrl];
    if (verb === 'crush') { n = Math.ceil(n * 1.5 - 1e-9); steps.push(['crush ×1.5', n]); }
    if (verb === 'bite') { n = Math.ceil(n * 1.3 * (card(src).school === 'life' && prop(src, 'beast') ? 1.25 : 1) - 1e-9); steps.push(['bite ×1.3(×1.25)', n]); }
    if (card(src).school === pl.main) { n = Math.round(n * 1.2); steps.push(['in tune ×1.2', n]); }
    if (!pl.usedVerbs[verb]) { n += 2; steps.push(['said first time +2', n]); }
  }
  return { n: Math.max(0, n), steps };
}

function damageThing(S, t, n, fromResonance) {
  if (n <= 0) return;
  t.damage += n; if (t.status.asleep) delete t.status.asleep;
  if (!fromResonance && modsOf(t).resonant && t.resonantTurn !== S.turn) { // first time each turn; resonance never re-triggers
    t.resonantTurn = S.turn;
    for (const o of S.things.filter(o => o !== t && o.word === t.word)) damageThing(S, o, 1, true);
  }
}
function heal(S, t, n) { const d = Math.min(t.damage, Math.max(0, n)); t.damage -= d; if (d) S.stats.res[t.ctrl].thingHealed = (S.stats.res[t.ctrl].thingHealed || 0) + d; }
// player life gain, capped at starting life; records only what was actually gained (stats only, never in the state hash)
function gainLife(S, pi, n, why) { const p = S.players[pi], g = Math.max(0, Math.min(FORMAT.life - p.life, n)); p.life += g; if (g) { const r = S.stats.res[pi]; r.healed += g; r.healedBy = r.healedBy || {}; r.healedBy[why] = (r.healedBy[why] || 0) + g; } return g; }
function loseLife(S, pi, n, why) { if (n <= 0) return; S.players[pi].life -= n; const L = S.stats.res[pi].lifeLost; L[why] = (L[why] || 0) + n; say(S, `P${pi} loses ${n} life (${why}).`); }

function refreshLaw(S) {
  for (const t of S.things) {
    const L = S.law, base = BY_ID[t.form || t.word];
    // membership from the underlying form's intrinsic category, ignoring Law-granted changes; Named and Fixed excluded
    t.lawQual = L && (base.props || []).includes(L.category) && !t.status.named && !(t.quals || []).some(a => a.word === 'earth.fixed') ? L.qual : null;
  }
}
function stateCheck(S) {
  refreshLaw(S);
  let changed = true;
  while (changed) {
    changed = false;
    let dead = S.things.filter(t => remainingOf(S, t) <= 0);
    for (const t of dead.filter(t => rebirthAvailable(S, t))) { // Phoenix replacement: no death, no release
      S.players[t.ctrl].phoenixUsed = true; t.damage = 0; exhaust(t); event(S, 'rebirth', { tid: t.id }); say(S, `${t.word} is reborn.`);
    }
    dead = dead.filter(t => remainingOf(S, t) <= 0);
    if (dead.length) {
      changed = true;
      for (const t of dead) { leaveField(S, t, 'destroyed'); say(S, `${t.word} (P${t.ctrl}) is destroyed.`); }
      // §5.11: active player's triggers first, then source entry order, then stable id
      const ordered = dead.slice().sort((a, b) => (a.ctrl === S.active ? 0 : 1) - (b.ctrl === S.active ? 0 : 1) || a.entry - b.entry || (a.id < b.id ? -1 : 1));
      for (const t of ordered) deathTrigger(S, t);
    }
    for (const p of S.players) if (p.ground && groundRemaining(p.ground) <= 0) {
      changed = true; const g = p.ground; p.ground = null; toGrave(S, g, 'destroyed'); say(S, `${g.word} (P${p.i}) is destroyed.`);
    }
  }
  const dead = S.players.filter(p => p.life <= 0);
  if (dead.length && S.over == null) {
    S.over = dead.length === 2 ? 'draw' : (1 - dead[0].i);
    if (S.stats.firstLethalRound == null) S.stats.firstLethalRound = S.round;
  }
}

function rebirthAvailable(S, t) { return !!card(t).rebirth && !S.players[t.ctrl].phoenixUsed; }
function recoverFromGrave(S, pid, owner) {
  const p = S.players[owner], k = p.grave.findIndex(g => g.pid === pid);
  if (k < 0 || p.hand.length >= FORMAT.handCap) return false;
  const g = p.grave.splice(k, 1)[0]; p.hand.push({ pid: g.pid, word: g.word, owner: g.owner }); event(S, 'recover', { pid }); return true;
}
function deathTrigger(S, t, how) {
  event(S, 'death', { tid: t.id, ctrl: t.ctrl, made: !!t.lineage, token: !!t.token, how: how || 'destroyed' });
  const pc = S.players[t.ctrl];
  if (how === 'sacrificed' && card(t).onSacrifice === 'poison1') poisonTrigger(S, t);
  if (prop(t, 'living')) for (const cr of S.things.filter(o => card(o).crowMight && o.ctrl === S.active)) { // Crow: first Living death during each own turn
    const cp = S.players[cr.ctrl]; if (cr.crowTurn !== cp.personalTurn) { cr.crowTurn = cp.personalTurn; addCounter(S, cr, 'might'); }
  }
  if (t.pid && !t.lineage && !t.token && prop(t, 'living')) { // Amber: recover another friendly original Living Thing, then sacrifice Amber
    const am = S.things.find(o => o.ctrl === t.ctrl && card(o).amber && o.pid && !S.flags[o.pid + ':amber']);
    if (am) { S.flags[am.pid + ':amber'] = true; recoverFromGrave(S, t.pid, t.owner); if (leaveField(S, am, 'sacrificed')) deathTrigger(S, am, 'sacrificed'); }
  }
  if (t.pid && has(S, t, 'recurrent') && !S.flags[t.pid + ':recurrent']) { // physical card's once-per-duel flag
    S.flags[t.pid + ':recurrent'] = true; recoverFromGrave(S, t.pid, t.owner);
  }
  if (card(t).ouroboros && !pc.ouroUsed) {
    pc.ouroUsed = true;
    const r = lineagePids(t.lineage).find(x => S.players[x.owner].grave.some(g => g.pid === x.pid));
    if (r) recoverFromGrave(S, r.pid, r.owner);
  }
  if (t.pid && !t.lineage && prop(t, 'living') && t.ctrl === S.active && pc.ground && card(pc.ground).carrionOnDeath && pc.barrowTurn !== pc.personalTurn) {
    pc.barrowTurn = pc.personalTurn; createToken(S, t.ctrl, 'token.carrion');
  }
  if (card(t).onDeath === 'poison1') poisonTrigger(S, t);
}
function poisonTrigger(S, t) {
  // target chosen by the controller at resolution among eligible visible enemy Living Things (default: strongest)
  const opts = S.things.filter(o => o.ctrl !== t.ctrl && prop(o, 'living') && !o.status.concealed).sort((a, b) => curStrike(S, b) - curStrike(S, a) || a.entry - b.entry);
  const tg = opts[decide(S, t.ctrl, 'poisonTarget', opts.map(o => o.id))];
  event(S, 'trigger', { source: t.id, ctrl: t.ctrl, what: 'poison1', target: tg ? tg.id : null });
  if (tg) addPoison(S, tg, 1);
}
function addPoison(S, target, n) {
  if (target.word && target.ctrl !== undefined) { // thing
    if (!prop(target, 'living')) return;
    target.status.poison = Math.min(FORMAT.poisonCap, (target.status.poison || 0) + n);
  } else target.poison = Math.min(FORMAT.poisonCap, target.poison + n);
}

// ---------- turn structure (§4.1) ----------
function startTurn(S) {
  const p = S.players[S.active];
  S.turn++; p.personalTurn++;
  if (S.active === S.first) S.round++;
  p.reserve = 0; // unused reserve is discarded at own Renew
  p.breath = Math.max(0, Math.min(FORMAT.breathCap, 2 + p.personalTurn) - (p.tax || 0)); p.tax = 0; p.extraBreath = 0; p.leechUsed = false; // Loan's one-use tax
  p.sentenceSpark = false; p.abilitySpark = false; p.bought = false; p.discountUsed = 0;
  if (p.personalTurn === 1 && S.active !== S.first) p.breath += INITIATIVE[S.rules.initiative].p2FirstTurnBreath || 0;
  if (p.personalTurn === 1 && S.active === S.first) p.breath = Math.max(0, p.breath + (INITIATIVE[S.rules.initiative].p1FirstTurnBreath || 0));
  for (const t of S.things) if (t.ctrl === S.active) { t.exhausted = false; t.fresh = false; t.actions = 0; t.quickUsed = false; }
  event(S, 'renew', { side: p.i });
  // Sky and Law expire at the caster's second subsequent Renew, before upkeep
  if (S.sky && S.sky.caster === p.i && p.personalTurn >= S.sky.until) { toGrave(S, S.sky, 'retired'); event(S, 'sky-expired', { word: S.sky.word }); S.sky = null; }
  if (S.law && S.law.caster === p.i && p.personalTurn >= S.law.until) { retireLaw(S); }
  // upkeep: burning and poison as one simultaneous batch
  const batch = [];
  for (const t of S.things.filter(t => t.ctrl === S.active)) {
    if (t.status.burning) { batch.push(() => { damageThing(S, t, 2); t.status.burning--; }); }
    if (t.status.poison) { batch.push(() => { damageThing(S, t, t.status.poison); t.status.poison--; }); }
  }
  if (p.poison) { const d = p.poison; batch.push(() => { loseLife(S, p.i, d, 'poison'); p.poison--; }); }
  batch.forEach(f => f()); stateCheck(S); if (S.over != null) return;
  for (const t of S.things.filter(t => t.ctrl === S.active).sort((a, b) => a.entry - b.entry)) {
    if (!S.things.includes(t)) continue;
    if (has(S, t, 'bedrock') && t.arrivedTurn < p.personalTurn) addCounter(S, t, 'bedrock');
    const u = card(t).upkeep;
    if (u === 'energy' || u === 'gold') gainExtraBreath(p, 1);
    if (u === 'lifeHeal') gainLife(S, p.i, 1, 'life');
    if (u === 'worldTree') {
      gainLife(S, p.i, 2, 'world tree');
      const o = S.things.filter(o => o !== t && o.ctrl === p.i && prop(o, 'living') && (o.counters.growth || 0) < FORMAT.growthCap).sort((a, b) => a.entry - b.entry)[0];
      if (o) addCounter(S, o, 'growth');
    }
    if (u === 'stone') { const k = decide(S, p.i, 'stoneUpkeep', ['draw', 'breath'], p.hand.length <= 3 && p.deck.length ? 0 : 1); if (k === 0) drawCard(S, p); else gainExtraBreath(p, 1); }
    if (card(t).lifespan) { t.age = (t.age || 0) + 1; if (t.age >= card(t).lifespan) { leaveField(S, t, 'expired'); say(S, `${t.word} disperses.`); continue; } }
    if (card(t).ladder === 'plant' && ['life.seed', 'life.sapling'].includes(card(t).id)) ageUp(S, t);
    if (u === 'aloe') { const d = S.things.filter(o => o.ctrl === p.i && o.damage > 0).sort((a, b) => a.entry - b.entry)[0]; if (d) heal(S, d, 1); }
    if (u === 'wormwood') { if (p.poison) p.poison--; else { const d = S.things.find(o => o.ctrl === p.i && o.status.poison); if (d) d.status.poison--; } }
  }
  if (p.ground && card(p.ground).upkeep === 'torch') { loseLife(S, 1 - p.i, 1, 'torch'); }
  if (p.ground && card(p.ground).upkeep === 'fireGround') {
    const v = S.things.filter(o => o.ctrl !== p.i && canIgnite(o) && o.damage > 0 && !o.status.burning).sort((a, b) => a.entry - b.entry)[0];
    if (v) ignite(S, v, null);
  }
  const gu = p.ground && card(p.ground).upkeep;
  if (gu === 'bellows') gainExtraBreath(p, 1);
  if (gu === 'ink') gainAbilitySpark(S, p);
  if (gu === 'reorder2') reorderTop(S, p, 2);
  if (gu === 'earthGround') { const pl = S.things.filter(o => o.ctrl === p.i && prop(o, 'plant') && (o.counters.growth || 0) < FORMAT.growthCap).sort((a, b) => a.entry - b.entry)[0]; if (pl) addCounter(S, pl, 'growth'); }
  weatherUpkeep(S, p);
  if (p.burden && card(p.burden).burden === 'debt') { // spend 1 spark or lose 1 life (policy: spark when available)
    const opts = p.spark > 0 ? ['spark', 'life'] : ['life'];
    if (opts[decide(S, p.i, 'debt', opts)] === 'spark') { p.spark--; S.stats.res[p.i].sparkSpent++; } else loseLife(S, p.i, 1, 'debt');
    if (--p.burden.ticks <= 0) { toGrave(S, p.burden, 'retired'); p.burden = null; }
  }
  if (p.ground && card(p.ground).upkeep === 'waterGround') {
    const opts = S.things.filter(o => o.ctrl === p.i).sort((a, b) => (b.status.burning ? 1 : 0) - (a.status.burning ? 1 : 0) || b.damage - a.damage || a.entry - b.entry);
    const f = opts[decide(S, p.i, 'waterGround', opts.map(o => o.id))]; // choose a friendly Thing (default: Burning, then most damaged)
    if (f) { f.status.wet = true; delete f.status.burning; heal(S, f, 1); }
  }
  stateCheck(S); if (S.over != null) return;
  if (!(S.active === S.first && p.personalTurn === 1)) for (let k = 0; k < S.rules.draws; k++) { drawCard(S, p); stateCheck(S); if (S.over != null) return; } // §15 Q1 experiment: draws per turn
  stateCheck(S); if (S.over != null) return;
  marketStep(S);
  const R0 = S.stats.res[p.i];
  R0.handByRound = R0.handByRound || {}; R0.handByRound[S.round] = p.hand.length; // occupancy after draw and market step
  if (fusionOptions(S, p.i).length) R0.fusionTurns = (R0.fusionTurns || 0) + 1;
  if (S.round <= 3 && !legalActions(S).some(a => a.type !== 'pass' && a.type !== 'buy')) R0.earlyNoPlay = (R0.earlyNoPlay || 0) + 1;
  R0.turns = (R0.turns || 0) + 1;
}
// owner's own deck top: inspect and reorder (deterministic policy: cheapest first)
function perms(a) { return a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map(r => [x].concat(r))); }
function reorderTop(S, p, n) {
  const top = p.deck.splice(0, n), orders = perms(top.map((c, i) => i));
  const dflt = orders.findIndex(o => o.every((v, i) => i === 0 || card(top[o[i - 1]]).cost <= card(top[v]).cost)); // default: cheapest first
  const k = decide(S, p.i, 'reorder', orders.map(o => o.map(i => top[i].word)), Math.max(0, dflt));
  p.deck.unshift(...orders[k].map(i => top[i]));
}
// inspect top n; take the first card matching `pick` into hand if room; the rest go to the bottom in order
function selectTop(S, p, n, pick) {
  const top = p.deck.splice(0, n);
  const elig = top.map((c, i) => i).filter(i => pick(top[i]));
  const j = elig.length && p.hand.length < FORMAT.handCap ? decide(S, p.i, 'select', elig.map(i => top[i].word)) : -1; // owner sees these
  const k = j >= 0 ? elig[j] : -1;
  if (k >= 0) p.hand.push(top.splice(k, 1)[0]);
  p.deck.push(...top); return k >= 0;
}
function weatherUpkeep(S, p) {
  if (!S.sky) return;
  const w = card(S.sky).weather, mine = S.things.filter(o => o.ctrl === p.i).sort((a, b) => a.entry - b.entry);
  const orrery = p.ground && card(p.ground).static === 'orrery';
  if (w === 'rain') { const d = mine.find(o => o.damage > 0); if (d) heal(S, d, 1); }
  if (w === 'drought') for (const o of mine) delete o.status.wet;
  if (w === 'storm' && !orrery) { const o = mine.find(o => !has(S, o, 'flying')); if (o) damageThing(S, o, o.status.wet ? 2 : 1); }
  if (w === 'winter') { const o = mine.find(o => o.status.wet); if (o) { o.status.frozen = true; delete o.status.wet; } }
  if (w === 'spring') {
    const pl = mine.find(o => plantNext(S, o)); if (pl) ageUp(S, pl);
    const d = mine.find(o => prop(o, 'living') && o.damage > 0); if (d) heal(S, d, 1);
  }
  if (w === 'harvest' && mine.some(o => prop(o, 'plant')) && !mine.some(o => card(o).id === 'token.fruit')) createToken(S, p.i, 'token.fruit');
}
function retireLaw(S) { for (const c of S.law.cards) toGrave(S, c, 'retired'); event(S, 'law-ended', {}); S.law = null; refreshLaw(S); }
function gainExtraBreath(p, n) { const g = Math.max(0, Math.min(n, FORMAT.extraBreathCap - p.extraBreath, FORMAT.poolCap - p.breath)); p.breath += g; p.extraBreath += g; return g; }
// ---------- ladders (§7.5) ----------
const METAL_NEXT = { 'earth.lead': ['earth.tin', 'earth.copper'], 'earth.tin': ['earth.silver'], 'earth.copper': ['earth.silver'], 'earth.silver': ['earth.gold'] };
function transform(S, t, to) {
  const from = card(t).id;
  t.prevForms = (t.prevForms || []).concat(from); t.form = to; t.ladderTurn = S.players[t.ctrl].personalTurn;
  S.stats.transforms++; event(S, 'transform', { tid: t.id, from, to }); say(S, `${t.word} becomes ${to}.`);
}
function plantNext(S, t) {
  const id = card(t).id; if (id === 'life.seed') return 'life.sapling';
  if (id === 'life.sapling') { const g = S.players[t.ctrl].ground; return g && card(g).id === 'water.water' ? 'life.willow' : 'life.oak'; }
  return null;
}
function ageUp(S, t) { // one age event; at age 2 advance one edge (max one plant stage per own turn) and reset
  const nx = plantNext(S, t); if (!nx) return;
  t.counters.age = Math.min(2, (t.counters.age || 0) + 1);
  if (t.counters.age >= 2 && t.ladderTurn !== S.players[t.ctrl].personalTurn) { transform(S, t, nx); t.counters.age = 0; }
}

function drawCard(S, p) {
  if (p.hand.length >= FORMAT.handCap) { S.stats.res[p.i].blockedDraws = (S.stats.res[p.i].blockedDraws || 0) + 1; return; }
  if (!p.deck.length) { p.fatigue++; loseLife(S, p.i, p.fatigue, 'fatigue'); return; }
  p.hand.push(p.deck.shift()); S.stats.res[p.i].drawn++;
}
function endTurn(S) {
  const p = S.players[S.active];
  for (const t of S.things) {
    t.tempStrike = 0; t.tempStand = 0; t.kindled = false; // "this turn" modifiers
    if (t.ctrl === p.i) { t.tempGuard = false; for (const k of ['wet', 'frozen', 'asleep', 'bound', 'blinded', 'grounded']) delete t.status[k]; } // controller-relative End
  }
  stateCheck(S);
  p.reserve = S.rules.reserve ? Math.min(S.rules.reserveCap, p.breath) : 0;
  S.stats.res[p.i].reserveKept += p.reserve; S.stats.res[p.i].breathWasted += p.breath - p.reserve;
  p.breath = 0;
  event(S, 'end', { side: p.i, reserve: p.reserve });
  if (S.over == null && S.active !== S.first && S.round >= FORMAT.roundCap) S.over = 'draw';
  if (S.over != null) return;
  S.active = 1 - S.active;
  startTurn(S);
}

// ---------- legality ----------
function ready(S, t, onTurn) { // can initiate an action
  if (t.exhausted || incapacitated(t)) return false;
  if (t.fresh && !has(S, t, 'swift')) return false;
  return onTurn ? t.actions < (t.quickUsed ? 2 : 1) : true; // Quick readies once for one more paid action
}
const isOriginal = t => !!t.pid && !t.lineage && !t.token;
const pushable = (S, t, maxSt) => !has(S, t, 'heavy') && maxStand(S, t) <= maxSt; // Push vs Heavy fails
const saltProtects = (S, side) => { const g = S.players[side].ground; return !!(g && card(g).static === 'salt'); };
function combos(arr, kmin, kmax) {
  const out = [];
  const rec = (start, cur) => { if (cur.length >= kmin) out.push(cur.slice()); if (cur.length === kmax) return; for (let i = start; i < arr.length; i++) { cur.push(arr[i]); rec(i + 1, cur); cur.pop(); } };
  rec(0, []); return out;
}
function canAct(S, t) { return t.ctrl === S.active && ready(S, t, true); }
function contactReach(S, att, target) {
  if (target && target.word && target.ctrl !== undefined && has(S, target, 'flying')) return has(S, att, 'flying') || has(S, att, 'reach');
  return true;
}
// target: thing, 'ground' or null (rival)
function eligibleBlockers(S, defender, att, target) {
  const protectsOther = !!target;
  return S.things.filter(b => b.ctrl === defender && !b.exhausted && !incapacitated(b) && b !== target
    && (!protectsOther || has(S, b, 'guard'))
    && (!has(S, att, 'flying') || has(S, b, 'flying') || has(S, b, 'reach')));
}

const COMBAT = { strike: 0, bite: 1, crush: 2, cut: 1 };
const HOSTILE_SPELLS = new Set(['gust', 'sleep', 'frozen']);

// Targets for a spell card played by `side` in `mode` ('main' | 'response' | 'answer').
function spellTargets(S, side, d, mode) {
  const mine = S.things.filter(t => t.ctrl === side), foes = S.things.filter(t => t.ctrl !== side && !t.status.concealed), all = mine.concat(foes);
  const hidden = S.things.filter(t => t.ctrl !== side && t.status.concealed);
  const p = S.players[side];
  switch (d.spell) {
    case 'guard': case 'kindle': return mine.map(t => t.id);
    case 'protect': return mine.filter(t => !t.status.ward).map(t => t.id);
    case 'dew': return mine.map(t => t.id).concat(p.poison ? ['self'] : []);
    case 'thaw': return all.filter(t => t.status.frozen).map(t => t.id);
    case 'frozen': return all.filter(t => t.status.wet && !t.status.frozen).map(t => t.id);
    case 'sleep': return all.filter(t => prop(t, 'living') && (prop(t, 'beast') || prop(t, 'person')) && !t.status.asleep).map(t => t.id);
    case 'gust': return foes.filter(t => !has(S, t, 'heavy') && curStrike(S, t) <= 2).map(t => t.id);
    case 'gasp': return mode === 'main' && p.extraBreath < FORMAT.extraBreathCap ? [null] : [];
    case 'tonic': return mode === 'main' && (p.life < FORMAT.life || p.poison) ? [null] : [];
    case 'grow': return mode === 'main' ? mine.filter(t => prop(t, 'plant') && ((t.counters.growth || 0) < FORMAT.growthCap || plantNext(S, t))).map(t => t.id) : [];
    case 'separate': return mode === 'main' && p.fusedTurn !== p.personalTurn ? mine.filter(t => separable(S, t)).map(t => t.id) : [];
    case 'doubt': {
      if (mode === 'main') return hidden.map(t => 'reveal:' + t.id); // Main alternative: reveal an enemy Concealed Thing
      if (!S.clause) return [];
      // pending rival Spell, Quality, Weather, Burden or Law, total printed cost <= 3
      return S.clause.nodes.map((n, k) => ({ n, k })).filter(({ n }) => n.side !== side && !n.cancelled && n.card
        && ['spell', 'quality', 'weather', 'burden', 'category'].includes(card(n.card).type) && (n.totalCost || card(n.card).cost) <= 3).map(({ k }) => 'node:' + k);
    }
    case 'wildfire': return mode === 'main' && all.some(t => t.status.burning) ? [null] : [];
    case 'memory': return mode === 'main' && p.hand.length - 1 < FORMAT.handCap ? p.grave.filter(g => ['action', 'spell'].includes(BY_ID[g.word].type) && BY_ID[g.word].cost <= 2 && g.word !== 'water.memory').map(g => 'g:' + g.pid) : [];
    case 'tame': return mode === 'main' && mine.length < FORMAT.slots ? foes.filter(t => isOriginal(t) && prop(t, 'beast') && curStrike(S, t) <= 2 && !t.status.named).map(t => t.id) : [];
    case 'summon': return mode === 'main' && mine.length < FORMAT.slots ? foes.filter(t => isOriginal(t) && BY_ID[t.word].cost <= 2 && !t.status.named).map(t => t.id) : [];
    case 'rust': return mode === 'main' ? foes.filter(t => prop(t, 'metal') && !has(S, t, 'incorruptible') && !modsOf(t).rustImmune).map(t => t.id) : [];
    case 'wither': return mode === 'main' ? foes.filter(t => prop(t, 'living')).map(t => t.id) : [];
    case 'exhume': return mode === 'main' && mine.length < FORMAT.slots ? p.grave.filter(g => BY_ID[g.word].type === 'thing' && BY_ID[g.word].cost <= 2).map(g => 'g:' + g.pid) : [];
    case 'miasma': case 'scream': case 'silence': return mode === 'main' ? [null] : [];
    case 'omen': return mode === 'main' && p.deck.length ? [null] : [];
    case 'gnosis': return mode === 'main' && p.deck.length ? [null] : [];
    case 'echo': return mode === 'main' && !p.echo ? [null] : [];
    case 'loan': return mode === 'main' && p.extraBreath < FORMAT.extraBreathCap && !p.tax ? [null] : [];
    case 'reckoning': return mode === 'main' && foes.some(t => maxStand(S, t) <= 2) ? [null] : [];
    case 'name': return mode === 'main' ? mine.filter(t => !t.status.named).map(t => t.id) : [];
    case 'measure': return mode === 'main' ? foes.filter(t => !t.status.measured).map(t => t.id) : [];
    case 'awaken': return mode === 'main' ? mine.filter(t => !prop(t, 'living') && !prop(t, 'body')).map(t => t.id) : [];
    case 'dispel': {
      const tg = [];
      for (const t of all) for (const a of t.quals || []) tg.push('q:' + a.pid);
      if (S.sky) tg.push('sky'); if (S.law) tg.push('law');
      for (const t of hidden) tg.push('reveal:' + t.id); // alternative: reveal an enemy Concealed Thing
      S.players.forEach(q => { if (q.burden) tg.push('burden:' + q.i); });
      return tg;
    }
  }
  return [];
}

// Plays of hand cards for `side`. mode 'main' = active player's Main; 'response'/'answer' = Clause windows.
function cardPlays(S, side, mode) {
  const p = S.players[side], out = [];
  const budget = mode === 'response' ? p.reserve : p.breath;
  const onTurn = side === S.active;
  const mine = S.things.filter(t => t.ctrl === side), foes = S.things.filter(t => t.ctrl !== side && !t.status.concealed); // Concealed: not individually targetable
  const free = FORMAT.slots - mine.length;
  for (const c of p.hand) {
    const d = card(c);
    const eff = mode !== 'main' && S.rules.responseDiscount && S.rules.responseDiscount[d.id] ? Math.max(1, d.cost - S.rules.responseDiscount[d.id]) : d.cost;
    if (eff > budget) continue;
    if (mode !== 'main' && !isR(d)) continue;
    if (mode === 'main' && d.responseOnly) continue;
    if (d.type === 'thing') { if (free > 0) out.push({ type: 'deploy', card: c.pid }); continue; }
    if (d.type === 'ground') { out.push({ type: 'ground', card: c.pid }); continue; }
    if (mode === 'main') {
      if (d.type === 'weather') { out.push({ type: 'weather', card: c.pid }); continue; }
      if (d.type === 'burden') { out.push({ type: 'burden', card: c.pid }); continue; }
      if (d.type === 'category') { if (p.deck.length) out.push({ type: 'spell', card: c.pid }); continue; } // standalone Catalogue
      if (d.type === 'quality') {
        for (const t of S.things.filter(t => (d.anyTarget ? true : d.enemyTarget ? t.ctrl !== side : t.ctrl === side) && qualityFits(S, t, d))) {
          const q = t.quals || [];
          if (q.length < FORMAT.qualityCap) out.push({ type: 'quality', card: c.pid, target: t.id });
          else for (const a of q) out.push({ type: 'quality', card: c.pid, target: t.id, replace: a.pid }); // designate the replacement at declaration
        }
        continue;
      }
      if (d.spell === 'tide') { for (const tg of combos(foes.filter(t => pushable(S, t, 4)).map(t => t.id), 1, 2)) out.push({ type: 'spell', card: c.pid, targets: tg }); continue; }
      if (d.spell === 'squall') { for (const tg of combos(mine.filter(t => has(S, t, 'flying') && canAct(S, t)).map(t => t.id), 1, 3)) out.push({ type: 'spell', card: c.pid, targets: tg }); continue; }
      if (d.spell === 'abundance') {
        for (const tg of combos(mine.filter(t => prop(t, 'living')).map(t => t.id), 1, 3)) for (const m of tg) out.push({ type: 'spell', card: c.pid, targets: tg, might: m });
        continue;
      }
      if (d.spell === 'graft') {
        if (p.fusedTurn !== p.personalTurn) for (const h of mine) for (const dn of mine) if (h !== dn && graftOk(S, side, h, dn)) out.push({ type: 'spell', card: c.pid, target: h.id, donor: dn.id });
        continue;
      }
      if (d.spell === 'decay') { for (const sac of mine) for (const f of foes) out.push({ type: 'spell', card: c.pid, target: f.id, sacrifice: sac.id }); continue; }
      if (d.spell === 'be') { // only as a compound Law: Category + Be + Lawful Quality, all three costs paid
        for (const cat of p.hand.filter(x => card(x).type === 'category')) for (const q of p.hand.filter(x => card(x).lawful)) {
          if (d.cost + card(cat).cost + card(q).cost <= budget) out.push({ type: 'law', card: c.pid, category: cat.pid, qual: q.pid });
        }
        continue;
      }
    }
    if (['tide', 'squall', 'abundance', 'graft', 'decay', 'be'].includes(d.spell)) continue;
    if (d.spell === 'transmute') {
      if (mode === 'main') for (const t of mine) for (const to of (METAL_NEXT[card(t).id] || [])) if (t.ladderTurn !== p.personalTurn) out.push({ type: 'spell', card: c.pid, target: t.id, branch: to });
      continue;
    }
    if (d.spell === 'calcine') {
      if (mode === 'main') for (const sac of mine) { out.push({ type: 'spell', card: c.pid, target: 'rival', sacrifice: sac.id }); for (const f of foes) out.push({ type: 'spell', card: c.pid, target: f.id, sacrifice: sac.id }); }
      continue;
    }
    if (d.type === 'spell') { for (const tg of spellTargets(S, side, d, mode)) out.push(tg == null ? { type: 'spell', card: c.pid } : { type: 'spell', card: c.pid, target: tg }); continue; }
    if (d.type !== 'action') continue;
    const subjects = mine.filter(t => ready(S, t, onTurn) && caps(S, t).has(d.verb));
    for (const s of subjects) {
      if (d.verb in COMBAT) {
        if (mode !== 'main') continue; // contact attacks are Main-only
        out.push({ type: 'attack', subject: s.id, verb: d.verb, card: c.pid, target: 'rival' });
        for (const f of foes) if (contactReach(S, s, f) && (d.verb !== 'bite' || (prop(f, 'living') && !has(S, f, 'sacred')))) out.push({ type: 'attack', subject: s.id, verb: d.verb, card: c.pid, target: f.id });
        if (enemy(S, side).ground && d.verb !== 'bite') out.push({ type: 'attack', subject: s.id, verb: d.verb, card: c.pid, target: 'ground' });
        if (d.verb === 'cut') for (const f of mine.filter(t => t.status.bound && contactReach(S, s, t))) out.push({ type: 'remote', subject: s.id, verb: 'cut', card: c.pid, target: f.id }); // free a Bound friend
      } else if (d.verb === 'bind') {
        for (const f of foes.filter(t => contactReach(S, s, t) && !t.status.bound)) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
      } else if (mode !== 'main') {
        if (d.verb === 'mend') for (const f of mine.filter(t => t.damage > 0)) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
        if (d.verb === 'drench') for (const f of S.things.filter(t => !t.status.wet)) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
      } else if (d.verb === 'wash') {
        for (const f of foes.filter(t => pushable(S, t, 4))) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
      } else if (d.verb === 'haunt') {
        if (!saltProtects(S, 1 - side)) for (const f of foes.filter(t => !has(S, t, 'sacred') && maxStand(S, t) <= 4)) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
      } else if (d.verb === 'dissolve') {
        for (const f of foes) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
        if (enemy(S, side).ground) out.push({ type: 'remote', subject: s.id, card: c.pid, target: 'ground' });
      } else if (d.verb === 'blow') {
        for (const pay of mine.filter(t => t !== s && !t.exhausted && !incapacitated(t))) for (const mode2 of ['hot', 'liquid', 'toxic'].filter(x => prop(pay, x))) {
          const elig = foes.filter(t => mode2 === 'hot' ? canIgnite(t) : mode2 === 'toxic' ? prop(t, 'living') : true).map(t => t.id);
          for (const tg of combos(elig, 1, 2)) out.push({ type: 'remote', subject: s.id, card: c.pid, payload: pay.id, mode: mode2, targets: tg });
        }
      } else if (d.verb === 'mend') {
        for (const f of mine.filter(t => t.damage > 0)) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
      } else if (d.verb === 'drench') {
        for (const f of S.things.filter(t => !t.status.wet)) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
      } else if (d.verb === 'burn') {
        for (const f of foes.filter(t => prop(t, 'flammable') && !t.status.wet && (t.status.burning || 0) < 2)) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
      } else {
        out.push({ type: 'remote', subject: s.id, card: c.pid, target: 'rival' });
        for (const f of foes) if (d.verb !== 'poison' || prop(f, 'living')) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
      }
    }
  }
  return out;
}

function legalActions(S) {
  if (S.over != null) return [{ type: 'pass' }];
  const p = S.players[S.active], out = [{ type: 'pass' }];
  out.push(...cardPlays(S, S.active, 'main'));
  if (!p.bought && MKT !== 'nobuy' && !(MKT === 'from2' && S.round < 2)) {
    if (S.rules.market && p.hand.length < FORMAT.handCap) for (const o of S.market) {
      if (!o) continue;
      const price = priceOf(S, p.i, o.word), off = price === FORMAT.offPrice;
      if (p.spark < price || (off && p.offSchoolBought >= FORMAT.offSchoolBuysPerDuel) || (p.acquired[o.word] || 0) >= FORMAT.copyLimit) continue;
      if (p.breath < S.rules.marketBreath) continue; // stage H variant: buying also costs breath
      if ((p.personalTurn - 1) % S.rules.buyEvery !== 0) continue; // purchase-cadence experiment
      out.push({ type: 'buy', slot: o.slot });
    }
    if (p.catalyst < FORMAT.catalystCap && p.spark >= FORMAT.catalystPrice) out.push({ type: 'catalyst' });
  }
  out.push(...fusionOptions(S, p.i));
  out.push(...abilityOptions(S, p.i));
  const foes = S.things.filter(t => t.ctrl !== p.i && !t.status.concealed);
  if (p.breath >= (S.rules.freeStrike ? 0 : 1)) for (const s of S.things.filter(t => t.ctrl === p.i && canAct(S, t) && caps(S, t).has('strike') && curStrike(S, t) > 0)) {
    out.push({ type: 'attack', subject: s.id, verb: 'strike', target: 'rival' });
    for (const f of foes) if (contactReach(S, s, f)) out.push({ type: 'attack', subject: s.id, verb: 'strike', target: f.id });
    if (enemy(S, p.i).ground) out.push({ type: 'attack', subject: s.id, verb: 'strike', target: 'ground' });
  }
  return out;
}

function qualityFits(S, t, d) {
  const q = d.qual, cur = t.quals || [];
  if (cur.some(a => a.word === d.id)) return false; // no duplicate attached word
  if ((cur.some(a => a.word === 'earth.fixed'))) return false; // Fixed: no new attachments
  if (q.needsProp && !prop(t, q.needsProp)) return false;
  if (q.notHeavy && has(S, t, 'heavy')) return false;
  return true;
}
// native activated abilities (Main sentences, not hand cards: no sentence spark)
function abilityOptions(S, side) {
  const p = S.players[side], out = [], mine = S.things.filter(t => t.ctrl === side), foes = S.things.filter(t => t.ctrl !== side && !t.status.concealed);
  for (const t of mine) {
    const ab = card(t).ability; if (!ab || ab.cost > p.breath) continue;
    if (ab.sacrificeSelf) { if (incapacitated(t)) continue; } else if (!canAct(S, t)) continue;
    if (ab.id === 'heal2') for (const f of mine.filter(o => o.damage > 0)) out.push({ type: 'ability', subject: t.id, ability: ab.id, target: f.id });
    if (ab.id === 'tend') { for (const f of mine.filter(o => o.damage > 0)) out.push({ type: 'ability', subject: t.id, ability: ab.id, target: f.id, branch: 'heal' }); for (const f of mine.filter(o => o.status.poison)) out.push({ type: 'ability', subject: t.id, ability: ab.id, target: f.id, branch: 'cure' }); }
    if (ab.id === 'etch') for (const f of foes.filter(o => prop(o, 'metal') || prop(o, 'stone'))) out.push({ type: 'ability', subject: t.id, ability: ab.id, target: f.id });
    if (ab.id === 'alkahest') { for (const f of foes) out.push({ type: 'ability', subject: t.id, ability: ab.id, target: f.id }); if (enemy(S, side).ground) out.push({ type: 'ability', subject: t.id, ability: ab.id, target: 'ground' }); } // target declared before the sacrifice
    if (ab.id === 'eatFruit') { if (p.life < FORMAT.life) out.push({ type: 'ability', subject: t.id, ability: ab.id, branch: 'life' }); for (const f of mine.filter(o => o.status.poison)) out.push({ type: 'ability', subject: t.id, ability: ab.id, target: f.id, branch: 'cure' }); }
  }
  return out;
}
function graftOk(S, side, h, dn) { // two compatible friendly Plants (§7.3); fusion ingredient rules apply
  const desc = { thing: true, props: ['living', 'plant'], host: true };
  if (!ingredientOk(S, side, desc, h, false) || !ingredientOk(S, side, { thing: true, props: ['living', 'plant'] }, dn, false)) return false;
  if (h.fresh && dn.fresh) return false;
  const m = modsOf(h); if (m.infusions.length >= R.MAX_INFUSIONS || m.infusions.includes('grafted')) return false;
  return maxStand(S, h) + 2 - h.damage - dn.damage > 0;
}

// Clause windows: `side` may play one eligible Response. kind = 'response' (defender, reserve) | 'answer' (active, breath)
function legalResponses(S, side, kind) {
  if (!S.clause || S.over != null) return [];
  if (kind === 'response' && (side === S.active || S.clause.nodes.length !== 1)) return [];
  if (kind === 'answer' && (side !== S.active || S.clause.nodes.length !== 2)) return [];
  return cardPlays(S, side, kind);
}

// Why a proposed sentence is illegal (UI explanation). Returns null when legal.
function whyIllegal(S, act) {
  if (legalActions(S).some(a => sameAction(a, act))) return null;
  const p = S.players[S.active];
  if (act.card) {
    const c = p.hand.find(x => x.pid === act.card);
    if (!c) return 'that word is not in your hand';
    const d = card(c);
    if (d.cost > p.breath) return `${d.id} costs ${d.cost}; you have ${p.breath} breath`;
    if (d.responseOnly) return `${d.id} can only be spoken as a response`;
    if (d.type === 'thing' && S.things.filter(t => t.ctrl === p.i).length >= FORMAT.slots) return 'no empty field slot';
  }
  if (act.type === 'fuse') {
    const recipe = recipeById(act.recipe); if (!recipe) return 'no such recipe';
    if (p.fusedTurn === p.personalTurn) return 'the Vessel has already been used this turn';
    const a = refObj(S, p.i, act.a), b = refObj(S, p.i, act.b);
    if (!a || !b) return 'ingredient missing';
    for (const [o, g] of [[a, act.a === 'ground'], [b, act.b === 'ground']]) {
      if (g) continue;
      if (o.owner !== p.i || o.ctrl !== p.i) return `${o.word} must be controlled and owned`;
      if (has(S, o, 'final')) return `${o.word} is Final`;
      if (o.exhausted) return `${o.word} is exhausted`;
      if (incapacitated(o)) return `${o.word} cannot act`;
    }
    if (![a, b].some((o, k) => !(k ? act.b === 'ground' : act.a === 'ground') && !o.fresh)) return 'at least one ingredient must be a mature Thing';
    const pv = previewFusion(S, p.i, recipe, a, act.a === 'ground', b, act.b === 'ground');
    if (!pv) return 'these ingredients do not match the recipe';
    if (pv.cost > p.breath) return `fusion costs ${pv.cost}; you have ${p.breath} breath`;
    if (pv.catalyst && p.catalyst < 1) return 'an opposed-school recipe needs a catalyst';
  }
  if (act.subject) {
    const s = thingById(S, act.subject);
    if (!s || s.ctrl !== p.i) return 'subject is not your Thing';
    if (s.exhausted) return `${s.word} is exhausted`;
    if (incapacitated(s)) return `${s.word} cannot act`;
    if (s.fresh && !has(S, s, 'swift')) return `${s.word} arrived this turn and is not Swift`;
    if (act.verb && !caps(S, s).has(act.verb)) return `${card(s).id.split('.')[1]} lacks the ${act.verb} capability`;
    const tg = act.target && act.target !== 'rival' && act.target !== 'ground' ? thingById(S, act.target) : null;
    if (tg && act.verb in COMBAT && !contactReach(S, s, tg)) return `${tg.word} is flying; ${s.word} has neither Flying nor Reach`;
    if (tg && act.verb === 'bite' && !prop(tg, 'living')) return `bite needs a living object`;
    if (act.target === 'ground' && act.verb === 'bite') return 'bite cannot target Ground';
  }
  return 'not a legal sentence now';
}

// ---------- the Vessel (§7.1–7.4) ----------
function schoolsOf(o, isGround) {
  if (isGround || o.token) return [card(o).school];
  const c = card(o); return [...new Set((c.schools || [c.school]).concat(modsOf(o).schools))];
}
function ingredientOk(S, side, desc, o, isGround, resolving) {
  if (!o) return false;
  if (!!desc.ground !== !!isGround) return false;
  if (isGround) return o.owner === side && card(o).id === desc.form;
  if (o.ctrl !== side || o.owner !== side) return false; // controlled and owned
  if (has(S, o, 'final')) return false;
  if (!!desc.token !== !!o.token) return false;
  if ((o.exhausted && !resolving) || incapacitated(o)) return false; // ready, not incapacitated (own committed exhaustion is fine at resolution)
  if (desc.form && card(o).id !== desc.form) return false;
  if (desc.props && !desc.props.every(x => prop(o, x))) return false;
  if (desc.host && card(o).made) return false; // named forms are not compositional hosts
  return true;
}
function fusionPrice(S, side, base) {
  const disc = S.things.some(t => t.ctrl === side && card(t).fusionDiscount) ? 1 : 0; // max one fusion discount
  return Math.max(2, base - disc);
}
function catalystNeeded(S, a, aG, b, bG) { return R.opposedAcross(schoolsOf(a, aG), schoolsOf(b, bG)); }
function previewFusion(S, side, recipe, a, aG, b, bG) {
  if (!ingredientOk(S, side, recipe.a, a, aG) || !ingredientOk(S, side, recipe.b, b, bG)) return null;
  if (a === b) return null;
  const things = [a, b].filter((o, k) => !(k ? bG : aG));
  if (!things.some(t => !t.fresh)) return null; // at least one mature Thing
  if (recipe.mod) { // compositional
    const m = modsOf(a);
    if (m.infusions.length >= R.MAX_INFUSIONS || m.infusions.includes(recipe.id)) return null;
    if ((recipe.forbidKw || []).some(k => has(S, a, k)) || (recipe.forbidProps || []).some(x => prop(a, x))) return null;
  }
  const dmg = (a.damage || 0) + (b.damage || 0);
  const stand = recipe.mod ? card(a).stand + modsOf(a).stand + (recipe.mod.stand || 0) : BY_ID[recipe.out].stand;
  if (stand - dmg <= 0) return null; // previewed result would be destroyed: illegal at declaration
  return { cost: fusionPrice(S, side, recipe.cost), catalyst: catalystNeeded(S, a, aG, b, bG), dmg, stand };
}
function fusionOptions(S, side) {
  const p = S.players[side];
  if (p.fusedTurn === p.personalTurn) return [];
  const objs = S.things.filter(t => t.ctrl === side).map(t => ({ o: t, g: false, ref: t.id }));
  if (p.ground) objs.push({ o: p.ground, g: true, ref: 'ground' });
  const out = [];
  for (const recipe of R.NAMED.concat(R.INFUSIONS)) for (const x of objs) for (const y of objs) {
    if (x === y) continue;
    const pv = previewFusion(S, side, recipe, x.o, x.g, y.o, y.g);
    if (!pv || pv.cost > p.breath || (pv.catalyst && p.catalyst < 1)) continue;
    out.push({ type: 'fuse', recipe: recipe.id, a: x.ref, b: y.ref });
  }
  return out;
}
const recipeById = id => R.NAMED.find(r => r.id === id) || R.INFUSIONS.find(r => r.id === id);
const refObj = (S, side, ref) => ref === 'ground' ? S.players[side].ground : thingById(S, ref);
function resolveFuse(S, n) {
  const side = n.side, p = S.players[side], recipe = recipeById(n.act.recipe);
  const a = refObj(S, side, n.act.a), b = refObj(S, side, n.act.b), aG = n.act.a === 'ground', bG = n.act.b === 'ground';
  // revalidate; the ingredients' own committed exhaustion does not invalidate them
  if (!ingredientOk(S, side, recipe.a, a, aG, true) || !ingredientOk(S, side, recipe.b, b, bG, true)) return false;
  if (aG && a.pid !== n.groundPid) return false; if (bG && b.pid !== n.groundPid) return false;
  const lineage = [lineageRecord(a, aG), lineageRecord(b, bG)];
  const dmg = (a.damage || 0) + (b.damage || 0);
  const keepQuals = recipe.mod ? (a.quals || []) : []; // compositional: host keeps its attachments; named: none
  if (recipe.mod) { if (!bG) retireQuals(S, b); } else { if (!aG) retireQuals(S, a); if (!bG) retireQuals(S, b); }
  for (const [o, g] of [[a, aG], [b, bG]]) { if (g) p.ground = null; else S.things = S.things.filter(x => x !== o); } // consumed: no death, no sacrifice
  let t;
  if (recipe.mod) {
    const m0 = modsOf(a), m = recipe.mod;
    const mods = { strike: m0.strike + (m.strike || 0), stand: m0.stand + (m.stand || 0), props: m0.props.concat(m.props || []), kw: m0.kw.concat(m.kw || []),
      kwRemove: m0.kwRemove.concat(m.kwRemove || []), infusions: m0.infusions.concat(recipe.id), schools: m0.schools.concat(recipe.school), igniteOnHit: m0.igniteOnHit || !!m.igniteOnHit };
    t = newThing(S, side, { word: a.word, form: a.form, mods, lineage, damage: dmg, exhausted: true, fresh: true, quals: keepQuals });
  } else {
    t = newThing(S, side, { word: recipe.out, form: recipe.out, lineage, damage: dmg, exhausted: true, fresh: true });
  }
  t.madeTurn = p.personalTurn;
  S.stats.fusions++; S.stats.made[recipe.id] = (S.stats.made[recipe.id] || 0) + 1;
  event(S, 'made', { side, recipe: recipe.id, tid: t.id }); say(S, `P${side} fuses ${recipe.id}.`);
  if (card(t).onMade === 'seekSpell') { // Homunculus: inspect top 3, take a Spell if present
    const top = p.deck.splice(0, 3), k = top.findIndex(c => card(c).type === 'spell');
    if (k >= 0 && p.hand.length < FORMAT.handCap) p.hand.push(top.splice(k, 1)[0]);
    p.deck.push(...top);
  }
  return true;
}
function separable(S, t) { return t.lineage && t.owner === t.ctrl && !has(S, t, 'final'); }
function resolveSeparate(S, n, t) {
  const side = n.side, p = S.players[side];
  if (!t || t.ctrl !== side || !separable(S, t)) return false;
  const recs = t.lineage, gr = recs.filter(r => r.ground), th = recs.filter(r => !r.ground);
  const after = S.things.filter(x => x.ctrl === side && x !== t).length;
  if (after + th.length > FORMAT.slots || (gr.length && p.ground)) return false; // insufficient space: fail
  retireQuals(S, t);
  S.things = S.things.filter(x => x !== t);
  recs.forEach((r, k) => {
    const dmg = k === 0 ? t.damage : 0; // current damage to the primary ingredient
    if (r.ground) { p.ground = { pid: r.pid, word: r.word, owner: r.owner, damage: dmg }; return; }
    const o = { word: r.word, damage: dmg, exhausted: true, fresh: true, owner: r.owner };
    if (r.token) Object.assign(o, { word: r.token, form: r.token, token: true });
    else if (r.made) Object.assign(o, { form: r.form, mods: r.mods || undefined, lineage: r.lineage });
    else Object.assign(o, { pid: r.pid, form: r.form !== r.word ? r.form : undefined });
    newThing(S, side, o);
  });
  event(S, 'separated', { tid: t.id }); return true;
}

// arrival (deploy, revival): printed arrival effects and arrival watchers. Made results and transformations never arrive.
function reveal(S, t) { delete t.status.concealed; event(S, 'reveal', { tid: t.id, word: t.word }); }
function arrive(S, t) {
  const p = S.players[t.ctrl], oa = card(t).onArrive;
  if (oa === 'concealed') t.status.concealed = true;
  if (S.sky && card(S.sky).weather === 'night' && isOriginal(t) && t.ctrl === S.active && p.nightTurn !== p.personalTurn) { p.nightTurn = p.personalTurn; t.status.concealed = true; } // persists after Night leaves
  event(S, 'arrive', { id: t.id, pid: t.concealed || t.status.concealed ? null : t.pid });
  if (card(t).revealOnArrive) { const hs = S.things.filter(o => o.ctrl !== t.ctrl && o.status.concealed); const k = decide(S, t.ctrl, 'owlReveal', ['none'].concat(hs.map(h => h.id)), hs.length ? 1 : 0); if (k > 0) reveal(S, hs[k - 1]); } // Owl: optional reveal
  if (oa === 'herald') selectTop(S, p, 2, c => true); // policy: the top word
  if (oa === 'reorder2') reorderTop(S, p, 2);
  if (oa === 'rose' && S.things.some(o => o !== t && o.ctrl === t.ctrl && prop(o, 'flower')) && !S.things.some(o => o.ctrl === t.ctrl && card(o).id === 'token.blossom')) {
    const b = createToken(S, t.ctrl, 'token.blossom'); if (b) flowerEntered(S, b);
  }
  flowerEntered(S, t);
}
function flowerEntered(S, t) { // Saffron: first time another Flower enters your field each own turn
  if (!prop(t, 'flower') || t.ctrl !== S.active) return;
  const p = S.players[t.ctrl];
  for (const sf of S.things.filter(o => o !== t && o.ctrl === t.ctrl && card(o).saffron)) if (sf.saffronTurn !== p.personalTurn) { sf.saffronTurn = p.personalTurn; gainAbilitySpark(S, p); }
}
function resolveAbility(S, n, tg) {
  const a = n.act, side = n.side, p = S.players[side];
  if (!n.selfSacrificed && !thingById(S, a.subject)) return false; // subject removed: fails, costs stay paid
  switch (a.ability) {
    case 'heal2': if (!tg || tg.ctrl !== side) return false; heal(S, tg, 2); return true;
    case 'tend': if (!tg || tg.ctrl !== side) return false; if (a.branch === 'cure') { if (tg.status.poison) tg.status.poison--; } else heal(S, tg, 2); return true;
    case 'etch': if (!tg || tg.ctrl === side || !(prop(tg, 'metal') || prop(tg, 'stone'))) return false; if (wardBlocks(S, n, tg)) return true; damageThing(S, tg, 3); return true;
    case 'alkahest': {
      if (a.target === 'ground') { const g = enemy(S, side).ground; if (!g) return false; g.damage = 999; return true; } // destroyed by the state check
      if (!tg || tg.ctrl === side) return false; if (wardBlocks(S, n, tg)) return true; destroy(S, tg); return true;
    }
    case 'eatFruit': if (a.branch === 'life') { gainLife(S, side, 2, 'fruit'); return true; } if (!tg || tg.ctrl !== side) return false; if (tg.status.poison) tg.status.poison--; return true;
  }
  return false;
}
function resolveGraft(S, n, h, dn) {
  const side = n.side;
  if (!h || !dn || h.ctrl !== side || dn.ctrl !== side || !ingredientOk(S, side, { thing: true, props: ['living', 'plant'], host: true }, h, false, true)
    || !ingredientOk(S, side, { thing: true, props: ['living', 'plant'] }, dn, false, true)) return false;
  const tags = ['orchard', 'herb', 'flower'].filter(x => prop(dn, x)); // donor's botanical family tags, no printed ability text
  const m0 = modsOf(h);
  const mods = { ...MOD0, ...(h.mods || {}), stand: (h.mods ? h.mods.stand : 0) + 2, props: ((h.mods && h.mods.props) || []).concat(tags), infusions: ((h.mods && h.mods.infusions) || []).concat('grafted'), schools: ((h.mods && h.mods.schools) || []).concat('life') };
  void m0;
  const lineage = [lineageRecord(h, false), lineageRecord(dn, false)], dmg = h.damage + dn.damage;
  retireQuals(S, dn); // compositional: host keeps its attachments, the donor's retire
  const hq = h.quals; S.things = S.things.filter(x => x !== h && x !== dn);
  const t = newThing(S, side, { word: h.word, form: h.form, mods, lineage, damage: dmg, exhausted: true, fresh: true, quals: hq });
  S.stats.fusions++; S.stats.made.grafted = (S.stats.made.grafted || 0) + 1;
  event(S, 'made', { side, recipe: 'grafted', tid: t.id }); return true;
}

function takeCard(p, pid) { const k = p.hand.findIndex(c => c.pid === pid); if (k < 0) throw new Error('card not in hand ' + pid); return p.hand.splice(k, 1)[0]; }

// ---------- the Clause (§4.8) ----------
// ctl: { block(S, info) -> blockerId|null, respond(S, side, kind) -> action|null }  (a bare function is treated as block)
function normCtl(ctl) { if (typeof ctl === 'function') return { block: ctl, respond: null }; return ctl || {}; }

// step 1–2: validate, commit costs and exhaustion, move card to pending, commit blocker/retaliation
function declare(S, act, side, kind, ctl) {
  const p = S.players[side];
  const node = { type: act.type, side, kind, act, card: null, cancelled: false };
  let d = null;
  if (act.card) { node.card = takeCard(p, act.card); d = card(node.card); node.cardUsed = true; node.cardPid = node.card.pid; }
  let cost = d ? d.cost : (act.type === 'attack' ? (S.rules.freeStrike ? 0 : 1) : 0); // §15 Q4 experiment: free basic Strike
  if (act.type === 'fuse') cost = 0; // priced below once ingredients are known
  if (act.type === 'ability') cost = card(thingById(S, act.subject)).ability.cost;
  if (act.type === 'law') { // compound: Category + Be + Lawful Quality; one sentence, all three costs
    node.extra = [takeCard(p, act.category), takeCard(p, act.qual)];
    cost += node.extra.reduce((a, c) => a + card(c).cost, 0); node.totalCost = cost;
  }
  const courage = act.type === 'attack' && S.arithmetic === 'legacy' && p.life <= 8 && kind === 'main';
  if (courage) cost = 0;
  if (kind !== 'main' && d && S.rules.responseDiscount && S.rules.responseDiscount[d.id]) cost = Math.max(1, cost - S.rules.responseDiscount[d.id]); // never zero-cost
  if (kind === 'response') { if (cost > p.reserve) throw new Error('reserve'); p.reserve -= cost; S.stats.res[side].reserveUsed += cost; }
  else { if (cost > p.breath) throw new Error('cannot afford'); p.breath -= cost; S.stats.res[side].breathSpent += cost; }
  if (node.card) { const pl = S.stats.res[side].played; pl[node.card.word] = (pl[node.card.word] || 0) + 1; if (/^m/.test(node.card.pid)) S.stats.res[side].boughtPlayed = (S.stats.res[side].boughtPlayed || 0) + 1; }
  for (const id of [act.subject, act.payload, act.type === 'fuse' ? act.a : null, act.type === 'fuse' ? act.b : null].concat(act.targets && act.type === 'spell' && d && d.spell === 'squall' ? act.targets : [])) {
    const t = id && id !== 'ground' && thingById(S, id); if (t && t.status.concealed) reveal(S, t); // reveal before it acts or fuses
  }
  if (act.type === 'fuse') {
    const recipe = recipeById(act.recipe), a = refObj(S, side, act.a), b = refObj(S, side, act.b);
    const pv = previewFusion(S, side, recipe, a, act.a === 'ground', b, act.b === 'ground');
    if (pv.cost > p.breath) throw new Error('cannot afford'); p.breath -= pv.cost; node.paid = pv.cost; S.stats.res[side].breathSpent += pv.cost;
    if (pv.catalyst) { p.catalyst--; node.catalyst = true; } // consumed at declaration, never refunded
    p.fusedTurn = p.personalTurn; // allowance consumed at declaration
    node.ids = [act.a, act.b]; node.groundPid = p.ground ? p.ground.pid : null;
    for (const r of [act.a, act.b]) if (r !== 'ground') exhaust(thingById(S, r));
  }
  if (d && (d.spell === 'separate' || d.spell === 'graft')) p.fusedTurn = p.personalTurn; // counts as the Vessel use
  if (act.sacrifice) { // sacrifice as additional cost: a death, not a Destroy; triggers resolve before the window
    const v = thingById(S, act.sacrifice); node.sacrificedWasCarrion = card(v).id === 'token.carrion';
    if (leaveField(S, v, 'sacrificed')) deathTrigger(S, v, 'sacrificed');
    event(S, 'sacrifice', { tid: v.id });
  }
  if (act.payload) exhaust(thingById(S, act.payload)); // Blow payload exhausts as an additional cost
  if (d && d.spell === 'squall') for (const id of act.targets) { const f = thingById(S, id); exhaust(f); f.actions++; }
  if (act.type === 'ability' && card(thingById(S, act.subject)).ability.sacrificeSelf) {
    const f = thingById(S, act.subject); node.selfSacrificed = true;
    if (leaveField(S, f, 'sacrificed')) deathTrigger(S, f, 'sacrificed');
  } else if (act.subject) { const s = thingById(S, act.subject); exhaust(s); if (side === S.active) s.actions++; }
  if (act.type === 'attack') {
    const s = thingById(S, act.subject), def = 1 - side;
    const tgThing = act.target !== 'rival' && act.target !== 'ground' ? thingById(S, act.target) : null;
    node.groundPid = act.target === 'ground' ? enemy(S, side).ground.pid : null;
    node.bonus = d ? (d.bonus || 0) : 0;
    const cands = courage ? [] : eligibleBlockers(S, def, s, tgThing || (act.target === 'ground' ? 'ground' : null));
    let blocker = null;
    if (cands.length && ctl.block) {
      const id = ctl.block(S, { attacker: s, verb: act.verb, target: tgThing, ground: act.target === 'ground', candidates: cands, bonus: node.bonus });
      blocker = cands.find(b => b.id === id) || null;
    }
    node.blocker = blocker ? blocker.id : null;
    if (blocker) { if (blocker.status.concealed) reveal(S, blocker); exhaust(blocker); }
    node.retaliates = false;
    if (!blocker && tgThing && !tgThing.exhausted && !incapacitated(tgThing) && curStrike(S, tgThing) > 0) { node.retaliates = true; exhaust(tgThing); }
  }
  event(S, 'declare', { side, kind, act: { ...act } });
  return node;
}

function apply(S, act, ctl) {
  if (S.over != null) return;
  ctl = normCtl(ctl);
  if (!legalActions(S).some(a => sameAction(a, act))) throw new Error('illegal action ' + JSON.stringify(act) + ': ' + whyIllegal(S, act));
  if (act.type === 'pass') { endTurn(S); S.hashes.push(hashState(S)); return; }
  if (act.type === 'buy' || act.type === 'catalyst') { economy(S, act); S.hashes.push(hashState(S)); return; } // no response window
  S.clause = { nodes: [] };
  S.clause.nodes.push(declare(S, act, S.active, 'main', ctl));
  stateCheck(S); // cost-generated automatic events resolve before the window
  if (S.over == null && ctl.respond) {
    const R1 = S.stats.res[1 - S.active], ro = legalResponses(S, 1 - S.active, 'response').length;
    R1.windows = (R1.windows || 0) + 1; if (ro) R1.windowsWithOption = (R1.windowsWithOption || 0) + 1; if (S.players[1 - S.active].reserve > 0) R1.windowsWithReserve = (R1.windowsWithReserve || 0) + 1;
    const r = ctl.respond(S, 1 - S.active, 'response');
    if (r) {
      addResponse(S, 1 - S.active, r, ctl);
      const a = ctl.respond(S, S.active, 'answer');
      if (a) addResponse(S, S.active, a, ctl);
    }
  }
  resolveClause(S);
  S.hashes.push(hashState(S));
}

function economy(S, act) {
  const p = S.players[S.active];
  p.bought = true;
  if (act.type === 'catalyst') { p.spark -= FORMAT.catalystPrice; S.stats.res[p.i].sparkSpent += FORMAT.catalystPrice; p.catalyst = FORMAT.catalystCap; event(S, 'catalyst', { side: p.i }); return; }
  const o = S.market[act.slot], price = priceOf(S, p.i, o.word);
  p.breath -= S.rules.marketBreath; S.stats.res[p.i].breathSpent += S.rules.marketBreath;
  p.spark -= price; S.stats.res[p.i].sparkSpent += price; S.stats.res[p.i].bought++; if (price === FORMAT.offPrice) p.offSchoolBought++;
  p.acquired[o.word] = (p.acquired[o.word] || 0) + 1;
  const c = { pid: 'm' + p.i + '_' + (++S.seq), word: o.word, owner: p.i };
  if (S.registry) S.registry[c.pid] = true;
  p.hand.push(c); S.market[act.slot] = null; // slot stays empty until the next market step
  S.stats.res[p.i].boughtSchools = S.stats.res[p.i].boughtSchools || { own: 0, off: 0 }; S.stats.res[p.i].boughtSchools[price === S.rules.priceOff && price !== S.rules.priceOwn ? 'off' : 'own']++;
  event(S, 'buy', { side: p.i, word: o.word, price, pid: c.pid }); say(S, `P${p.i} buys ${o.word} for ${price} spark.`);
}

function addResponse(S, side, act, ctl) {
  const kind = S.clause.nodes.length === 1 ? 'response' : 'answer';
  if (!legalResponses(S, side, kind).some(a => sameAction(a, act))) throw new Error('illegal ' + kind + ' ' + JSON.stringify(act));
  S.clause.nodes.push(declare(S, act, side, kind, normCtl(ctl)));
  S.stats[kind === 'response' ? 'responses' : 'answers']++;
  stateCheck(S);
}

// step 5: answer → response → original, each revalidated; triggers and lethal checks between nodes
function resolveClause(S) {
  const nodes = S.clause.nodes;
  for (let k = nodes.length - 1; k >= 0; k--) {
    const n = nodes[k];
    const flush = why => { if (n.card) toGrave(S, n.card, why); for (const c of n.extra || []) toGrave(S, c, why); n.card = null; n.extra = null; };
    if (S.over != null) { flush('unresolved'); continue; }
    if (n.cancelled) { S.stats.cancelled++; event(S, 'cancelled', { k }); flush('countered'); continue; }
    const ok = resolveNode(S, n, k);
    if (!ok) { S.stats.failed++; event(S, 'failed', { k, act: n.act }); }
    const sp = S.players[n.side];
    if (n.card && ok && card(n.card).seal) { sp.sealed.push(n.card); event(S, 'sealed', { pid: n.card.pid }); n.card = null; } // Memory, Exhume, Echo
    if (n.card && ok && card(n.card).type === 'action' && n.side === S.active && sp.echo === sp.personalTurn && sp.hand.length < FORMAT.handCap) {
      sp.echo = 0; sp.hand.push(n.card); event(S, 'echoed', { pid: n.card.pid }); n.card = null; // returns instead of being spent
    }
    flush(ok ? 'spent' : 'failed'); // spent one-use word (deploy/ground/quality/weather moved theirs already)
    if (ok && n.act.subject && n.side === S.active) { // Quick: ready once after the first successful paid action
      const q = thingById(S, n.act.subject);
      if (q && q.ctrl === S.active && has(S, q, 'quick') && !q.quickUsed && q.actions === 1 && (n.cardUsed || n.type === 'attack' || n.type === 'ability')) { q.quickUsed = true; q.exhausted = false; event(S, 'quick', { tid: q.id }); }
    }
    if (n.act.verb && ok) S.players[n.side].usedVerbs[n.act.verb] = true;
    if (ok) { sparkFor(S, n); mightFor(S, n); }
    stateCheck(S);
  }
  S.clause = null;
}

function wardBlocks(S, n, t) { // hostile non-combat single-target node vs Ward
  if (!t || t.ctrl === n.side || !t.status.ward) return false;
  delete t.status.ward; n.noEffect = true; event(S, 'ward', { target: t.id }); say(S, `${t.word}'s Ward absorbs it.`); return true;
}

function resolveNode(S, n, k) {
  const a = n.act, side = n.side, p = S.players[side];
  const d = n.card ? card(n.card) : null;
  const special = x => ['rival', 'ground', 'self', 'sky', 'law'].includes(x) || /^(node|g|q|burden|reveal):/.test(String(x));
  const tg = a.target && !special(a.target) ? thingById(S, a.target) : null;
  if (a.type !== 'attack' && a.target && tg === undefined && !special(a.target)) return false; // target left play
  switch (a.type) {
    case 'deploy': {
      if (S.things.filter(t => t.ctrl === side).length >= FORMAT.slots) return false; // never displace
      const c = n.card; n.card = null;
      const t = newThing(S, side, { pid: c.pid, word: c.word, owner: c.owner, attuned: S.arithmetic === 'legacy' && card(c).school === p.main });
      arrive(S, t);
      say(S, t.status.concealed ? `P${side} brings forth a concealed word.` : `P${side} brings forth ${c.word}.`); // never leak a Concealed identity
      return true;
    }
    case 'ground': {
      const c = n.card; n.card = null;
      if (p.ground) toGrave(S, p.ground, 'retired');
      p.ground = { pid: c.pid, word: c.word, owner: c.owner, damage: 0 }; say(S, `P${side} lays ${c.word}.`);
      if (card(c).onArrive === 'draw1') drawCard(S, p);
      return true;
    }
    case 'quality': {
      const def = card(n.card);
      if (!tg || !(def.anyTarget || (def.enemyTarget ? tg.ctrl !== side : tg.ctrl === side)) || !qualityFits(S, tg, def)) return false;
      tg.quals = tg.quals || [];
      if (a.replace) { const k2 = tg.quals.findIndex(x => x.pid === a.replace); if (k2 < 0) return false; toGrave(S, tg.quals.splice(k2, 1)[0], 'retired'); } // old retires only on resolution
      if (tg.quals.length >= FORMAT.qualityCap) return false;
      if (def.enemyTarget && wardBlocks(S, n, tg)) return true;
      tg.quals.push(n.card); n.card = null; event(S, 'attach', { tid: tg.id, word: def.id }); return true;
    }
    case 'weather': {
      if (S.sky) toGrave(S, S.sky, 'retired'); // new Weather replaces old only on resolution
      const c = n.card; n.card = null;
      S.sky = { pid: c.pid, word: c.word, owner: c.owner, caster: side, until: p.personalTurn + 2 };
      const w = card(c).weather;
      if (w === 'rain') for (const t of S.things) { t.status.wet = true; delete t.status.burning; }
      if (w === 'winter') for (const t of S.things) if (t.status.wet) { t.status.frozen = true; delete t.status.wet; }
      event(S, 'sky', { word: c.word }); return true;
    }
    case 'burden': {
      const r = enemy(S, side); if (r.burden) toGrave(S, r.burden, 'retired');
      const c = n.card; n.card = null; r.burden = { pid: c.pid, word: c.word, owner: c.owner, ticks: 2 }; return true;
    }
    case 'law': {
      if (S.law) retireLaw(S);
      const cards = [n.extra[0], n.card, n.extra[1]]; n.card = null; n.extra = null;
      S.law = { cards, category: card(cards[0]).category, qual: cards[2].word, caster: side, until: p.personalTurn + 2 };
      refreshLaw(S); event(S, 'law', { category: S.law.category, qual: S.law.qual }); return true;
    }
    case 'ability': return resolveAbility(S, n, tg);
    case 'spell': return resolveSpell(S, n, d, tg);
    case 'fuse': return resolveFuse(S, n);
    case 'remote': {
      const s = thingById(S, a.subject); if (!s) return false; // subject removed: action fails, costs stay paid
      if (d.verb === 'mend') { if (!tg || tg.ctrl !== side) return false; heal(S, tg, 3); return true; }
      if (d.verb === 'blow') { // subject and payload must both remain present
        if (!thingById(S, a.payload)) return false;
        const ts = a.targets.map(id => thingById(S, id)).filter(t => t && t.ctrl !== side);
        if (!ts.length) return false;
        for (const t of ts) {
          if (ts.length === 1 && wardBlocks(S, n, t)) continue;
          if (a.mode === 'hot') ignite(S, t, side); else if (a.mode === 'liquid') { t.status.wet = true; delete t.status.burning; } else addPoison(S, t, 1);
        }
        return true;
      }
      if (tg && tg.ctrl !== side && wardBlocks(S, n, tg)) return true; // consumed Ward: the node resolves with no effect on it
      if (d.verb === 'drench') { if (!tg) return false; tg.status.wet = true; delete tg.status.burning; if (prop(tg, 'hot')) damageThing(S, tg, 1); return true; }
      if (d.verb === 'burn') { if (!tg || !canIgnite(tg)) return false; ignite(S, tg, side); return true; }
      if (d.verb === 'bind') { if (!tg || tg.ctrl === side || !contactReach(S, s, tg)) return false; tg.status.bound = true; return true; }
      if (d.verb === 'cut') { if (!tg || tg.ctrl !== side) return false; delete tg.status.bound; return true; } // free a Bound friend
      if (d.verb === 'wash') { if (!tg || tg.ctrl === side || !pushable(S, tg, 4)) return false; bounce(S, tg); return true; }
      if (d.verb === 'haunt') { if (!tg || tg.ctrl === side || has(S, tg, 'sacred') || maxStand(S, tg) > 4 || saltProtects(S, tg.ctrl)) return false; bounce(S, tg); return true; }
      if (d.verb === 'dissolve') {
        if (a.target === 'ground') { const g = enemy(S, side).ground; if (!g) return false; g.damage = (g.damage || 0) + 3; return true; }
        if (!tg) return false; damageThing(S, tg, ['metal', 'stone', 'liquid'].some(x => prop(tg, x)) ? 3 : 2); return true;
      }
      if (d.verb === 'poison') { addPoison(S, tg || enemy(S, side), 2); return true; }
      const victim = tg || enemy(S, side); // scorch / seep: fixed remote damage, no block, no retaliation
      const pk = packet(S, s, d.dmg, d.verb); record(S, s, d.verb, pk, victim);
      if (tg) damageThing(S, tg, pk.n); else loseLife(S, victim.i, pk.n, d.verb);
      say(S, `P${side}: ${s.word} ${d.verb}s.`); return true;
    }
    case 'attack': return resolveAttack(S, n);
  }
  return false;
}

function resolveSpell(S, n, d, tg) {
  const side = n.side, p = S.players[side], a = n.act;
  const friendly = tg && tg.ctrl === side;
  if (d.type === 'category') { selectTop(S, p, 3, c => card(c).type === 'thing' && (card(c).props || []).includes(d.category)); say(S, `P${side} catalogues ${d.category}s.`); return true; }
  switch (d.spell) {
    case 'guard': if (!friendly) return false; tg.tempStand = (tg.tempStand || 0) + 2; tg.tempGuard = true; break; // readiness still required to block
    case 'kindle': if (!friendly) return false; tg.tempStrike = (tg.tempStrike || 0) + 1; tg.kindled = true; break;
    case 'protect': if (!friendly) return false; tg.status.ward = true; break;
    case 'dew':
      if (a.target === 'self') { if (p.poison) p.poison--; break; }
      if (!friendly) return false; tg.status.wet = true; delete tg.status.burning; if (tg.status.poison) tg.status.poison--; break;
    case 'thaw': if (!tg || !tg.status.frozen) return false; delete tg.status.frozen; if (friendly) heal(S, tg, 1); break;
    case 'frozen': if (!tg || !tg.status.wet) return false; if (wardBlocks(S, n, tg)) return true; tg.status.frozen = true; break;
    case 'sleep': if (!tg || !prop(tg, 'living')) return false; if (wardBlocks(S, n, tg)) return true; tg.status.asleep = true; break;
    case 'gust': {
      if (!tg || tg.ctrl === side || has(S, tg, 'heavy') || curStrike(S, tg) > 2) return false;
      if (wardBlocks(S, n, tg)) return true;
      bounce(S, tg); break;
    }
    case 'gasp': { const g = Math.min(2, FORMAT.extraBreathCap - p.extraBreath, FORMAT.poolCap - p.breath); p.breath += g; p.extraBreath += g; break; }
    case 'tonic': {
      gainLife(S, p.i, 3, 'tonic'); if (p.poison) p.poison--;
      if (p.ground && card(p.ground).potionBonus && p.potionTurn !== p.personalTurn) { p.potionTurn = p.personalTurn; gainLife(S, p.i, 1, 'potion ground'); }
      break;
    }
    case 'transmute': {
      if (!friendly || tg.ladderTurn === p.personalTurn || !(METAL_NEXT[card(tg).id] || []).includes(a.branch)) return false;
      transform(S, tg, a.branch); break;
    }
    case 'grow': {
      if (!friendly || !prop(tg, 'plant')) return false;
      addCounter(S, tg, 'growth');
      ageUp(S, tg); break;
    }
    case 'calcine': {
      if (a.target === 'rival') loseLife(S, 1 - side, 3, 'calcine');
      else { if (!tg || tg.ctrl === side) return false; if (wardBlocks(S, n, tg)) return true; damageThing(S, tg, 3); }
      createToken(S, side, 'token.ash'); break;
    }
    case 'separate': if (!resolveSeparate(S, n, tg)) return false; n.noSpark = true; break; // spell-assisted fusion: no sentence spark
    case 'graft': { if (!resolveGraft(S, n, tg, thingById(S, a.donor))) return false; n.noSpark = true; break; }
    case 'wildfire': {
      const foesBurning = S.things.filter(t => t.ctrl !== side && t.status.burning).length; // counted at the beginning of resolution
      for (const t of S.things.filter(t => t.status.burning)) damageThing(S, t, 2);
      loseLife(S, 1 - side, Math.min(3, foesBurning), 'wildfire'); break;
    }
    case 'tide': {
      const ts = a.targets.map(id => thingById(S, id)).filter(t => t && t.ctrl !== side && pushable(S, t, 4));
      if (!ts.length) return false;
      for (const t of ts) bounce(S, t); break;
    }
    case 'memory': {
      const pid = a.target.slice(2), g = p.grave.find(x => x.pid === pid);
      if (!g || !recoverFromGrave(S, pid, side)) return false; break;
    }
    case 'squall': loseLife(S, 1 - side, 2 * a.targets.length, 'squall'); break; // one batch; the Flyers paid as cost
    case 'abundance': {
      const ts = a.targets.map(id => thingById(S, id)).filter(t => t && t.ctrl === side && prop(t, 'living'));
      if (!ts.length) return false;
      for (const t of ts) addCounter(S, t, 'growth');
      const m = ts.find(t => t.id === a.might); if (m) addCounter(S, m, 'might'); break;
    }
    case 'tame': case 'summon': {
      const okT = tg && tg.ctrl !== side && isOriginal(tg) && !tg.status.named && (d.spell === 'tame' ? prop(tg, 'beast') && curStrike(S, tg) <= 2 : BY_ID[tg.word].cost <= 2);
      if (!okT) return false; if (wardBlocks(S, n, tg)) return true;
      if (!takeControl(S, tg, side)) return false; break;
    }
    case 'decay': {
      if (!tg || tg.ctrl === side) return false; if (wardBlocks(S, n, tg)) return true;
      damageThing(S, tg, n.sacrificedWasCarrion ? 4 : 3); break;
    }
    case 'rust': {
      if (!tg || tg.ctrl === side || !prop(tg, 'metal') || has(S, tg, 'incorruptible') || modsOf(tg).rustImmune) return false;
      if (wardBlocks(S, n, tg)) return true;
      const from = card(tg).id; let back = null; // damage and regression in one batch
      if (from === 'earth.silver') back = (tg.prevForms || []).filter(f => f === 'earth.tin' || f === 'earth.copper').pop() || ['earth.tin', 'earth.copper'][decide(S, side, 'rustBranch', ['earth.tin', 'earth.copper'])]; // effect controller chooses
      if (from === 'earth.tin' || from === 'earth.copper') back = 'earth.lead';
      damageThing(S, tg, 3);
      if (back) { tg.form = back === tg.word ? undefined : back; event(S, 'transform', { tid: tg.id, from, to: back, regress: true }); }
      break;
    }
    case 'wither': {
      if (!tg || tg.ctrl === side || !prop(tg, 'living')) return false; if (wardBlocks(S, n, tg)) return true;
      if (prop(tg, 'plant')) { tg.counters.growth = Math.max(0, (tg.counters.growth || 0) - 2); damageThing(S, tg, 2); } else damageThing(S, tg, 1);
      break;
    }
    case 'exhume': {
      const pid = a.target.slice(2), k2 = p.grave.findIndex(x => x.pid === pid);
      if (k2 < 0 || S.things.filter(t => t.ctrl === side).length >= FORMAT.slots) return false;
      const g = p.grave.splice(k2, 1)[0];
      const t = newThing(S, side, { pid: g.pid, word: g.word, owner: g.owner }); // original form, undamaged, ready and Fresh, normal arrival
      event(S, 'revive', { pid: g.pid }); arrive(S, t); break;
    }
    case 'miasma': for (const t of S.things.filter(t => t.ctrl !== side && prop(t, 'living'))) addPoison(S, t, 1); addPoison(S, enemy(S, side), 1); break;
    case 'omen': selectTop(S, p, 3, c => true); break; // policy: take the top card; others to the bottom
    case 'gnosis': drawCard(S, p); stateCheck(S); if (S.over == null) drawCard(S, p); for (const t of S.things.filter(t => t.ctrl !== side && t.status.concealed)) reveal(S, t); break;
    case 'name': if (!friendly) return false; tg.status.named = true; break;
    case 'measure': if (!tg || tg.ctrl === side) return false; if (wardBlocks(S, n, tg)) return true; tg.status.measured = true; break;
    case 'awaken': if (!friendly || prop(tg, 'living')) return false; tg.extraProps = (tg.extraProps || []).concat('body'); addCounter(S, tg, 'might'); break;
    case 'echo': p.echo = p.personalTurn; break;
    case 'loan': gainExtraBreath(p, 2); p.tax = 1; break;
    case 'silence': {
      const r = enemy(S, side); event(S, 'reveal-hand', { side: r.i, n: r.hand.length });
      const el = r.hand.filter(c => ['action', 'spell'].includes(card(c).type) && card(c).cost <= 3).sort((x, y) => card(y).cost - card(x).cost);
      const pick = el[decide(S, side, 'silence', el.map(c => c.word))]; // revealed hand: caster chooses
      if (pick) { r.hand.splice(r.hand.indexOf(pick), 1); toGrave(S, pick, 'discarded'); }
      break;
    }
    case 'scream': {
      const voice = Math.min(2, S.things.filter(t => t.ctrl === side && prop(t, 'speaker') && !incapacitated(t)).length);
      loseLife(S, 1 - side, 2 + voice, 'scream');
      for (const t of S.things) delete t.status.asleep;
      for (const b of S.things.filter(t => t.ctrl === side && card(t).bard)) if (b.bardTurn !== p.personalTurn) { b.bardTurn = p.personalTurn; drawCard(S, p); break; }
      break;
    }
    case 'reckoning': {
      const doomed = S.things.filter(t => t.ctrl !== side && maxStand(S, t) <= 2);
      for (const t of doomed) leaveField(S, t, 'destroyed');
      for (const t of doomed) deathTrigger(S, t); break; // simultaneous
    }
    case 'dispel': {
      const x = String(a.target);
      if (x.startsWith('reveal:')) { const h = thingById(S, x.slice(7)); if (!h || !h.status.concealed) return false; reveal(S, h); }
      else if (x === 'sky') { if (!S.sky) return false; toGrave(S, S.sky, 'retired'); S.sky = null; }
      else if (x === 'law') { if (!S.law) return false; retireLaw(S); }
      else if (x.startsWith('burden:')) { const q = S.players[+x.slice(7)]; if (!q.burden) return false; toGrave(S, q.burden, 'retired'); q.burden = null; }
      else { const pid = x.slice(2), h = S.things.find(t => (t.quals || []).some(q => q.pid === pid)); if (!h) return false; toGrave(S, h.quals.splice(h.quals.findIndex(q => q.pid === pid), 1)[0], 'retired'); }
      break;
    }
    case 'doubt': {
      if (String(a.target).startsWith('reveal:')) { const h = thingById(S, a.target.slice(7)); if (!h || !h.status.concealed) return false; reveal(S, h); break; }
      const k = +String(a.target).split(':')[1], victim = S.clause.nodes[k];
      if (!victim || victim.cancelled || !victim.card) return false;
      victim.cancelled = true; break;
    }
    default: return false;
  }
  say(S, `P${side} speaks ${n.card.word}.`);
  return true;
}

// Push: return to owner's hand with state reset; full hand sends it to Grave (not a death)
function bounce(S, t) {
  leaveField(S, t, 'bounced'); // made forms dissolve to Grave, tokens vanish: no death
  event(S, 'bounce', { id: t.id, pid: t.pid }); say(S, `${t.word} is blown back to P${t.owner}'s hand.`);
}

function record(S, src, verb, pk, tg) { const to = tg.ctrl !== undefined ? 'thing' : tg.word ? 'ground' : 'player'; S.stats.packets.push({ round: S.round, side: src.ctrl, verb, n: pk.n, to, toPlayer: to === 'player', steps: pk.steps }); }

// §4.7 combat at resolution: one simultaneous batch of attack and legal retaliation
function resolveAttack(S, n) {
  const a = n.act, att = thingById(S, a.subject), defender = 1 - n.side;
  if (!att) return false; // subject removed
  let recipient = null, retaliator = null, ground = null;
  if (n.blocker) {
    recipient = thingById(S, n.blocker);
    if (!recipient) { say(S, `P${n.side}: the blocker is gone; the attack misses.`); return false; } // no redirect
    if (!incapacitated(recipient)) retaliator = recipient;
  } else if (a.target === 'ground') {
    ground = enemy(S, n.side).ground;
    if (!ground || ground.pid !== n.groundPid) return false;
  } else if (a.target !== 'rival') {
    recipient = thingById(S, a.target);
    if (!recipient || recipient.ctrl === n.side) return false;
    if (!contactReach(S, att, recipient)) return false; // revalidate reach of a direct target
    if (n.retaliates && !incapacitated(recipient)) retaliator = recipient;
  }
  let base = curStrike(S, att) + (n.bonus || 0);
  const pa = S.players[att.ctrl];
  if (!recipient && !ground && modsOf(att).firebrand && pa.firebrandTurn !== pa.personalTurn) { pa.firebrandTurn = pa.personalTurn; base += 1; } // Firebrand: first unblocked hit on rival
  let pk = packet(S, att, base, a.verb);
  if (a.verb === 'bite' && recipient && (!prop(recipient, 'living') || has(S, recipient, 'sacred'))) pk = { n: 0, steps: pk.steps.concat([['bite vs non-living/Sacred', 0]]) };
  record(S, att, a.verb, pk, recipient || ground || enemy(S, n.side));
  const ret = retaliator ? curStrike(S, retaliator) : 0;
  const before = recipient ? remainingOf(S, recipient) : 0;
  if (recipient) damageThing(S, recipient, pk.n);
  else if (ground) ground.damage = (ground.damage || 0) + pk.n;
  else loseLife(S, defender, pk.n, a.verb);
  if (ret > 0) damageThing(S, att, ret);
  if (ret > 0 && card(retaliator).stingBind && remainingOf(S, att) > 0 && prop(att, 'living')) att.status.bound = true; // Bramble
  if (pk.n > 0) {
    const alive = recipient && remainingOf(S, recipient) > 0;
    if (has(S, att, 'venomous')) { if (!recipient && !ground) addPoison(S, enemy(S, att.ctrl), 1); else if (alive) addPoison(S, recipient, 1); }
    if (card(att).wetOnHit && alive) { recipient.status.wet = true; delete recipient.status.burning; }
    if ((card(att).igniteOnHit || modsOf(att).igniteOnHit || att.kindled) && alive) ignite(S, recipient, att.ctrl);
    if (card(recipient || {}).wetAttacker && S.things.includes(att) && recipient.iceTurn !== S.turn) { recipient.iceTurn = S.turn; att.status.wet = true; delete att.status.burning; } // Ice
    if (!recipient && !ground && card(att).magpie && att.magpieTurn !== S.players[att.ctrl].personalTurn) { att.magpieTurn = S.players[att.ctrl].personalTurn; gainAbilitySpark(S, S.players[att.ctrl]); }
    if (card(att).leech && !S.players[att.ctrl].leechUsed && !ground && (!recipient || prop(recipient, 'living'))) { S.players[att.ctrl].leechUsed = true; gainLife(S, att.ctrl, 1, 'leech'); }
  }
  if (a.verb === 'crush' && recipient && pk.n > before && before >= 0 && !rebirthAvailable(S, recipient)) { // overflow once, never from Ground
    let over = pk.n - Math.max(0, before);
    if (S.arithmetic === 'legacy') {
      const pl = S.players[att.ctrl];
      if (card(att).school === pl.main) over = Math.round(over * 1.2);
      if (!pl.usedVerbs.overflow) { over += 2; pl.usedVerbs.overflow = true; }
    }
    record(S, att, 'overflow', { n: over, steps: [['overflow', over]] }, enemy(S, att.ctrl));
    loseLife(S, defender, over, 'crush overflow');
  }
  say(S, `P${att.ctrl}: ${att.word} ${a.verb}s ${recipient ? recipient.word : ground ? ground.word : 'P' + defender} for ${pk.n}${n.blocker ? ' (blocked)' : ''}${ret ? `, takes ${ret} back` : ''}.`);
  return true;
}

function sameAction(a, b) {
  return a.type === b.type && a.slot === b.slot && a.card === b.card && a.subject === b.subject && a.verb === b.verb && (a.target || null) === (b.target || null)
    && a.recipe === b.recipe && a.a === b.a && a.b === b.b && a.sacrifice === b.sacrifice && a.branch === b.branch
    && a.payload === b.payload && a.mode === b.mode && a.donor === b.donor && a.might === b.might && a.replace === b.replace
    && a.category === b.category && a.qual === b.qual && a.ability === b.ability && JSON.stringify(a.targets || null) === JSON.stringify(b.targets || null);
}

function hashState(S) {
  const pub = JSON.stringify({ t: S.turn, a: S.active, p: S.players.map(p => [p.life, p.breath, p.reserve, p.hand.map(c => c.pid), p.deck.map(c => c.pid), p.grave.map(c => c.pid + c.reason), p.poison, p.spark, p.catalyst, p.ground && [p.ground.pid, p.ground.damage]]), m: S.market.map(o => o && o.word), sky: S.sky && S.sky.pid, law: S.law && S.law.cards.map(c => c.pid), bd: S.players.map(p => p.burden && [p.burden.pid, p.burden.ticks]), th: S.things.map(t => [t.id, t.pid, t.form, t.ctrl, t.damage, t.exhausted, t.fresh, t.counters, t.status, t.mods, t.lineage && lineagePids(t.lineage).map(r => r.pid), (t.quals || []).map(q => q.pid)]) });
  let h = 2166136261; for (let i = 0; i < pub.length; i++) { h ^= pub.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16);
}

// Engine behaviour revisions. Formats pin rules parameters; this pins engine behaviour inside a format.
// A replay records the revision it was made under; replaying under a later one is hash-checked action by action.
const REVISION = { id: 'r30.1', log: [
  { id: 'r30.0', note: 'V30 foundation (commit 69c5e05).' },
  { id: 'r30.1', note: 'Alkahest gains its printed ability (1 breath, sacrifice: destroy an enemy Thing or damageable Ground). Changes play only in matches where Alkahest is made. Healing is now recorded in stats (not in the state hash).' },
] };

module.exports = {
  REVISION, FORMAT, INITIATIVE, createMatch, setDecider, applyMulligan, priceOf, legalActions, legalResponses, apply, addResponse, resolveClause, whyIllegal, zoneAudit,
  fusionOptions, previewFusion, abilityOptions, addCounter, ignite, modsOf, maxStand, propsOf, caps, qualityDefs, recipeById, decide, schoolsOf, lineagePids, createToken, leaveField, transform, prop,
  curStrike, remainingOf, standOf, groundRemaining, packet, deckErrors, hashState, card, has, kws, stateCheck, endTurn, startTurn, incapacitated,
};
