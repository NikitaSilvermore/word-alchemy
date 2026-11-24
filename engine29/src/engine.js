// V29 "The Grammar" — headless authoritative engine, stages A–C (subset).
// One reducer and one legal-action generator serve tests, bots and simulation.
// Arithmetic models: 'v29' (spec §4.9, integer, additive, one packet, one overflow)
// and 'legacy' (emulation of the V28 percentage pipeline, for paired comparison only).
//
// Stage B: stable physical IDs, zones with reasons, damageable Ground, illegal-sentence reasons,
//          zone invariant audit.
// Stage C: reserve, bounded Clause (declaration → blocker → defender response → active answer →
//          reverse resolution with revalidation), Response cards, controller-relative expiry,
//          deterministic trigger order, event log.
'use strict';
const { BY_ID, capabilities } = require('./cards');

const FORMAT = {
  id: 'grammar_v29_test', life: 30, deckSize: 20, openingHand: 5, handCap: 7, slots: 5,
  breathCap: 8, extraBreathCap: 2, poolCap: 10, reserveCap: 2, secondPlayerReserve: 1,
  roundCap: 15, poisonCap: 3, bedrockCap: 2,
};

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

function createMatch({ decks, seed = 1, arithmetic = 'v29', first = null, reserve = true }) {
  decks.forEach((d, i) => { const e = deckErrors(d); if (e.length) throw new Error('deck ' + i + ': ' + e.join('; ')); });
  const r = rng(seed);
  let nextId = 1;
  const S = {
    format: FORMAT.id, arithmetic, seed, turn: 0, round: 0, active: 0, over: null, seq: 0, ev: 0,
    rules: { reserve },
    rand: r, log: [], events: [], hashes: [], clause: null, registry: {},
    players: decks.map((d, i) => ({
      i, life: FORMAT.life, breath: 0, reserve: 0, extraBreath: 0, personalTurn: 0, fatigue: 0, poison: 0,
      deck: shuffle(d.map(w => ({ pid: 'c' + i + '_' + (nextId++), word: w, owner: i })), r),
      hand: [], grave: [], sealed: [], ground: null, main: mainSchool(d), usedVerbs: {}, leechUsed: false,
    })),
    things: [], // field instances
    stats: { packets: [], firstLethalRound: null, responses: 0, answers: 0, failed: 0, cancelled: 0 },
  };
  for (const p of S.players) for (const c of p.deck) S.registry[c.pid] = true;
  S.active = first != null ? first : (r() < 0.5 ? 0 : 1);
  S.first = S.active;
  if (reserve) S.players[1 - S.first].reserve = FORMAT.secondPlayerReserve; // §3.1 second-player compensation
  for (const p of S.players) for (let k = 0; k < FORMAT.openingHand; k++) p.hand.push(p.deck.shift());
  startTurn(S);
  return S;
}

// ---------- helpers ----------
const say = (S, x) => { S.log.push(x); };
const event = (S, type, o = {}) => { S.events.push({ n: ++S.ev, turn: S.turn, type, ...o }); };
const card = c => BY_ID[c.word];
function kws(S, t) {
  const k = new Set(card(t).kw || []);
  if (t.tempGuard) k.add('guard');
  const g = S.players[t.ctrl].ground;
  if (g && card(g).static === 'heavyReach' && k.has('heavy')) k.add('reach');
  if (t.status.wet && (card(t).props || []).includes('winged')) k.delete('flying');
  return k;
}
function caps(S, t) { return capabilities(card(t), kws(S, t)); }
function has(S, t, k) { return kws(S, t).has(k); }
function prop(t, p) { return (card(t).props || []).includes(p); }
function maxStand(S, t) { return card(t).stand + (t.counters.bedrock || 0) + (t.tempStand || 0); }
function curStrike(S, t) {
  let s = card(t).strike + (t.tempStrike || 0);
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
    if (p.reserve > FORMAT.reserveCap) errs.push('reserve over cap P' + p.i);
  }
  S.things.forEach(t => put(t.pid, 'field'));
  if (S.clause) S.clause.nodes.forEach(n => n.card && put(n.card.pid, 'pending'));
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

function damageThing(S, t, n) { if (n <= 0) return; t.damage += n; if (t.status.asleep) delete t.status.asleep; }
function heal(S, t, n) { t.damage = Math.max(0, t.damage - n); }
function loseLife(S, pi, n, why) { if (n <= 0) return; S.players[pi].life -= n; say(S, `P${pi} loses ${n} life (${why}).`); }

function stateCheck(S) {
  let changed = true;
  while (changed) {
    changed = false;
    const dead = S.things.filter(t => remainingOf(S, t) <= 0);
    if (dead.length) {
      changed = true;
      S.things = S.things.filter(t => !dead.includes(t));
      for (const t of dead) { toGrave(S, t, 'destroyed'); say(S, `${t.word} (P${t.ctrl}) is destroyed.`); }
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

function deathTrigger(S, t) {
  if (card(t).onDeath === 'poison1') {
    // target chosen at resolution and validated (deterministic choice pending a player prompt)
    const tg = S.things.filter(o => o.ctrl !== t.ctrl && prop(o, 'living')).sort((a, b) => curStrike(S, b) - curStrike(S, a) || a.entry - b.entry)[0];
    event(S, 'trigger', { source: t.id, ctrl: t.ctrl, what: 'poison1', target: tg ? tg.id : null });
    if (tg) addPoison(S, tg, 1);
  }
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
  p.breath = Math.min(FORMAT.breathCap, 2 + p.personalTurn); p.extraBreath = 0; p.leechUsed = false;
  for (const t of S.things) if (t.ctrl === S.active) { t.exhausted = false; t.fresh = false; t.actions = 0; }
  event(S, 'renew', { side: p.i });
  // upkeep: burning and poison as one simultaneous batch
  const batch = [];
  for (const t of S.things.filter(t => t.ctrl === S.active)) {
    if (t.status.burning) { batch.push(() => { damageThing(S, t, 2); t.status.burning--; }); }
    if (t.status.poison) { batch.push(() => { damageThing(S, t, t.status.poison); t.status.poison--; }); }
  }
  if (p.poison) { const d = p.poison; batch.push(() => { loseLife(S, p.i, d, 'poison'); p.poison--; }); }
  batch.forEach(f => f()); stateCheck(S); if (S.over != null) return;
  for (const t of S.things.filter(t => t.ctrl === S.active).sort((a, b) => a.entry - b.entry)) {
    if (has(S, t, 'bedrock') && t.arrivedTurn < p.personalTurn) t.counters.bedrock = Math.min(FORMAT.bedrockCap, (t.counters.bedrock || 0) + 1);
    const u = card(t).upkeep;
    if (u === 'aloe') { const d = S.things.filter(o => o.ctrl === p.i && o.damage > 0).sort((a, b) => a.entry - b.entry)[0]; if (d) heal(S, d, 1); }
    if (u === 'wormwood') { if (p.poison) p.poison--; else { const d = S.things.find(o => o.ctrl === p.i && o.status.poison); if (d) d.status.poison--; } }
  }
  if (p.ground && card(p.ground).upkeep === 'torch') { loseLife(S, 1 - p.i, 1, 'torch'); }
  stateCheck(S); if (S.over != null) return;
  if (!(S.active === S.first && p.personalTurn === 1)) drawCard(S, p);
  stateCheck(S);
}
function drawCard(S, p) {
  if (p.hand.length >= FORMAT.handCap) return;
  if (!p.deck.length) { p.fatigue++; loseLife(S, p.i, p.fatigue, 'fatigue'); return; }
  p.hand.push(p.deck.shift());
}
function endTurn(S) {
  const p = S.players[S.active];
  for (const t of S.things) {
    t.tempStrike = 0; t.tempStand = 0; t.kindled = false; // "this turn" modifiers
    if (t.ctrl === p.i) { t.tempGuard = false; for (const k of ['wet', 'frozen', 'asleep', 'bound', 'blinded']) delete t.status[k]; } // controller-relative End
  }
  stateCheck(S);
  p.reserve = S.rules.reserve ? Math.min(FORMAT.reserveCap, p.breath) : 0;
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
  return onTurn ? t.actions < 1 : true;
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
  const mine = S.things.filter(t => t.ctrl === side), foes = S.things.filter(t => t.ctrl !== side), all = S.things;
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
    case 'doubt': {
      if (mode === 'main' || !S.clause) return [];
      return S.clause.nodes.map((n, k) => ({ n, k })).filter(({ n }) => n.side !== side && !n.cancelled && n.card && card(n.card).type === 'spell' && card(n.card).cost <= 3).map(({ k }) => 'node:' + k);
    }
  }
  return [];
}

// Plays of hand cards for `side`. mode 'main' = active player's Main; 'response'/'answer' = Clause windows.
function cardPlays(S, side, mode) {
  const p = S.players[side], out = [];
  const budget = mode === 'response' ? p.reserve : p.breath;
  const onTurn = side === S.active;
  const mine = S.things.filter(t => t.ctrl === side), foes = S.things.filter(t => t.ctrl !== side);
  const free = FORMAT.slots - mine.length;
  for (const c of p.hand) {
    const d = card(c);
    if (d.cost > budget) continue;
    if (mode !== 'main' && !isR(d)) continue;
    if (mode === 'main' && d.responseOnly) continue;
    if (d.type === 'thing') { if (free > 0) out.push({ type: 'deploy', card: c.pid }); continue; }
    if (d.type === 'ground') { out.push({ type: 'ground', card: c.pid }); continue; }
    if (d.type === 'spell') { for (const tg of spellTargets(S, side, d, mode)) out.push(tg == null ? { type: 'spell', card: c.pid } : { type: 'spell', card: c.pid, target: tg }); continue; }
    if (d.type !== 'action') continue;
    const subjects = mine.filter(t => ready(S, t, onTurn) && caps(S, t).has(d.verb));
    for (const s of subjects) {
      if (d.verb in COMBAT) {
        if (mode !== 'main') continue; // contact attacks are Main-only
        out.push({ type: 'attack', subject: s.id, verb: d.verb, card: c.pid, target: 'rival' });
        for (const f of foes) if (contactReach(S, s, f) && (d.verb !== 'bite' || prop(f, 'living'))) out.push({ type: 'attack', subject: s.id, verb: d.verb, card: c.pid, target: f.id });
        if (enemy(S, side).ground && d.verb !== 'bite') out.push({ type: 'attack', subject: s.id, verb: d.verb, card: c.pid, target: 'ground' });
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
  const foes = S.things.filter(t => t.ctrl !== p.i);
  if (p.breath >= 1) for (const s of S.things.filter(t => t.ctrl === p.i && canAct(S, t) && caps(S, t).has('strike') && curStrike(S, t) > 0)) {
    out.push({ type: 'attack', subject: s.id, verb: 'strike', target: 'rival' });
    for (const f of foes) if (contactReach(S, s, f)) out.push({ type: 'attack', subject: s.id, verb: 'strike', target: f.id });
    if (enemy(S, p.i).ground) out.push({ type: 'attack', subject: s.id, verb: 'strike', target: 'ground' });
  }
  return out;
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

function takeCard(p, pid) { const k = p.hand.findIndex(c => c.pid === pid); if (k < 0) throw new Error('card not in hand ' + pid); return p.hand.splice(k, 1)[0]; }

// ---------- the Clause (§4.8) ----------
// ctl: { block(S, info) -> blockerId|null, respond(S, side, kind) -> action|null }  (a bare function is treated as block)
function normCtl(ctl) { if (typeof ctl === 'function') return { block: ctl, respond: null }; return ctl || {}; }

// step 1–2: validate, commit costs and exhaustion, move card to pending, commit blocker/retaliation
function declare(S, act, side, kind, ctl) {
  const p = S.players[side];
  const node = { type: act.type, side, kind, act, card: null, cancelled: false };
  let d = null;
  if (act.card) { node.card = takeCard(p, act.card); d = card(node.card); }
  let cost = d ? d.cost : (act.type === 'attack' ? 1 : 0);
  const courage = act.type === 'attack' && S.arithmetic === 'legacy' && p.life <= 8 && kind === 'main';
  if (courage) cost = 0;
  if (kind === 'response') { if (cost > p.reserve) throw new Error('reserve'); p.reserve -= cost; }
  else { if (cost > p.breath) throw new Error('cannot afford'); p.breath -= cost; }
  if (act.subject) { const s = thingById(S, act.subject); exhaust(s); if (side === S.active) s.actions++; }
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
    if (blocker) exhaust(blocker);
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
  S.clause = { nodes: [] };
  S.clause.nodes.push(declare(S, act, S.active, 'main', ctl));
  stateCheck(S); // cost-generated automatic events resolve before the window
  if (S.over == null && ctl.respond) {
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
    if (S.over != null) { if (n.card) toGrave(S, n.card, 'unresolved'); n.card = null; continue; }
    if (n.cancelled) { S.stats.cancelled++; event(S, 'cancelled', { k }); if (n.card) toGrave(S, n.card, 'countered'); n.card = null; continue; }
    const ok = resolveNode(S, n, k);
    if (!ok) { S.stats.failed++; event(S, 'failed', { k, act: n.act }); }
    if (n.card) { // spent one-use word (deploy/ground moved it already)
      toGrave(S, n.card, ok ? 'spent' : 'failed'); n.card = null;
    }
    if (n.act.verb && ok) S.players[n.side].usedVerbs[n.act.verb] = true;
    stateCheck(S);
  }
  S.clause = null;
}

function wardBlocks(S, n, t) { // hostile non-combat single-target node vs Ward
  if (!t || t.ctrl === n.side || !t.status.ward) return false;
  delete t.status.ward; event(S, 'ward', { target: t.id }); say(S, `${t.word}'s Ward absorbs it.`); return true;
}

function resolveNode(S, n, k) {
  const a = n.act, side = n.side, p = S.players[side];
  const d = n.card ? card(n.card) : null;
  const tg = a.target && !['rival', 'ground', 'self'].includes(a.target) && !String(a.target).startsWith('node:') ? thingById(S, a.target) : null;
  if (a.type !== 'attack' && a.target && tg === undefined && !['rival', 'ground', 'self'].includes(a.target) && !String(a.target).startsWith('node:')) return false; // target left play
  switch (a.type) {
    case 'deploy': {
      if (S.things.filter(t => t.ctrl === side).length >= FORMAT.slots) return false; // never displace
      const c = n.card; n.card = null;
      const t = { id: 't' + (++S.seq), pid: c.pid, word: c.word, owner: c.owner, ctrl: side, entry: S.seq, damage: 0, counters: {}, status: {}, exhausted: false, fresh: true, actions: 0, arrivedTurn: p.personalTurn, attuned: S.arithmetic === 'legacy' && card(c).school === p.main };
      S.things.push(t); say(S, `P${side} brings forth ${c.word}.`); event(S, 'arrive', { id: t.id, pid: t.pid });
      return true;
    }
    case 'ground': {
      const c = n.card; n.card = null;
      if (p.ground) toGrave(S, p.ground, 'retired');
      p.ground = { pid: c.pid, word: c.word, owner: c.owner, damage: 0 }; say(S, `P${side} lays ${c.word}.`);
      return true;
    }
    case 'spell': return resolveSpell(S, n, d, tg);
    case 'remote': {
      const s = thingById(S, a.subject); if (!s) return false; // subject removed: action fails, costs stay paid
      if (d.verb === 'mend') { if (!tg || tg.ctrl !== side) return false; heal(S, tg, 3); return true; }
      if (tg && wardBlocks(S, n, tg)) return true; // consumed Ward: the node resolves with no effect on it
      if (d.verb === 'drench') { if (!tg) return false; tg.status.wet = true; delete tg.status.burning; if (prop(tg, 'hot')) damageThing(S, tg, 1); return true; }
      if (d.verb === 'burn') { if (!tg || tg.status.wet) return false; tg.status.burning = 2; return true; }
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
    case 'tonic': p.life = Math.min(FORMAT.life, p.life + 3); if (p.poison) p.poison--; break;
    case 'doubt': {
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
  S.things = S.things.filter(x => x !== t);
  const o = S.players[t.owner], c = { pid: t.pid, word: t.word, owner: t.owner };
  if (o.hand.length >= FORMAT.handCap) toGrave(S, c, 'bounced-full-hand'); else o.hand.push(c);
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
  const base = curStrike(S, att) + (n.bonus || 0);
  let pk = packet(S, att, base, a.verb);
  if (a.verb === 'bite' && recipient && !prop(recipient, 'living')) pk = { n: 0, steps: pk.steps.concat([['bite vs non-living', 0]]) };
  record(S, att, a.verb, pk, recipient || ground || enemy(S, n.side));
  const ret = retaliator ? curStrike(S, retaliator) : 0;
  const before = recipient ? remainingOf(S, recipient) : 0;
  if (recipient) damageThing(S, recipient, pk.n);
  else if (ground) ground.damage = (ground.damage || 0) + pk.n;
  else loseLife(S, defender, pk.n, a.verb);
  if (ret > 0) damageThing(S, att, ret);
  if (pk.n > 0) {
    const alive = recipient && remainingOf(S, recipient) > 0;
    if (has(S, att, 'venomous')) { if (!recipient && !ground) addPoison(S, enemy(S, att.ctrl), 1); else if (alive) addPoison(S, recipient, 1); }
    if ((card(att).igniteOnHit || att.kindled) && alive && prop(recipient, 'flammable') && !recipient.status.wet) recipient.status.burning = 2;
    if (card(att).leech && !S.players[att.ctrl].leechUsed && !ground && (!recipient || prop(recipient, 'living'))) { S.players[att.ctrl].leechUsed = true; S.players[att.ctrl].life = Math.min(FORMAT.life, S.players[att.ctrl].life + 1); }
  }
  if (a.verb === 'crush' && recipient && pk.n > before && before >= 0) { // overflow once, never from Ground
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

function sameAction(a, b) { return a.type === b.type && a.card === b.card && a.subject === b.subject && a.verb === b.verb && (a.target || null) === (b.target || null); }

function hashState(S) {
  const pub = JSON.stringify({ t: S.turn, a: S.active, p: S.players.map(p => [p.life, p.breath, p.reserve, p.hand.map(c => c.pid), p.deck.map(c => c.pid), p.grave.map(c => c.pid + c.reason), p.poison, p.ground && [p.ground.pid, p.ground.damage]]), th: S.things.map(t => [t.id, t.pid, t.ctrl, t.damage, t.exhausted, t.fresh, t.counters, t.status]) });
  let h = 2166136261; for (let i = 0; i < pub.length; i++) { h ^= pub.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16);
}

module.exports = {
  FORMAT, createMatch, legalActions, legalResponses, apply, addResponse, resolveClause, whyIllegal, zoneAudit,
  curStrike, remainingOf, standOf, groundRemaining, packet, deckErrors, hashState, card, has, kws, stateCheck, endTurn, startTurn, incapacitated,
};
