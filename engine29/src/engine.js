// V29 "The Grammar" — headless authoritative engine, stages A–B (subset).
// One reducer and one legal-action generator serve tests, bots and simulation.
// Arithmetic models: 'v29' (spec §4.9, integer, additive, one packet, one overflow)
// and 'legacy' (emulation of the V28 percentage pipeline, for paired comparison only).
'use strict';
const { BY_ID, capabilities } = require('./cards');

const FORMAT = {
  id: 'grammar_v29_test', life: 30, deckSize: 20, openingHand: 5, handCap: 7, slots: 5,
  breathCap: 8, extraBreathCap: 2, roundCap: 15, poisonCap: 3, bedrockCap: 2,
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

function createMatch({ decks, seed = 1, arithmetic = 'v29', first = null }) {
  decks.forEach((d, i) => { const e = deckErrors(d); if (e.length) throw new Error('deck ' + i + ': ' + e.join('; ')); });
  const r = rng(seed);
  let nextId = 1;
  const S = {
    format: FORMAT.id, arithmetic, seed, turn: 0, round: 0, active: 0, over: null, seq: 0,
    rand: r, log: [], events: [], hashes: [],
    players: decks.map((d, i) => ({
      i, life: FORMAT.life, breath: 0, extraBreath: 0, personalTurn: 0, fatigue: 0, poison: 0,
      deck: shuffle(d.map(w => ({ pid: 'c' + i + '_' + (nextId++), word: w, owner: i })), r),
      hand: [], grave: [], ground: null, main: mainSchool(d), usedVerbs: {}, leechUsed: false,
    })),
    things: [], // board instances
    stats: { packets: [], firstLethalRound: null },
  };
  S.active = first != null ? first : (r() < 0.5 ? 0 : 1);
  S.first = S.active;
  for (const p of S.players) for (let k = 0; k < FORMAT.openingHand; k++) p.hand.push(p.deck.shift());
  startTurn(S);
  return S;
}

// ---------- helpers ----------
const say = (S, x) => { S.log.push(x); };
const card = c => BY_ID[c.word];
function kws(S, t) {
  const k = new Set(card(t).kw || []);
  for (const q of t.tempKw || []) k.add(q);
  const g = S.players[t.ctrl].ground;
  if (g && card(g).static === 'heavyReach' && k.has('heavy')) k.add('reach');
  if (t.status.wet && (card(t).props || []).includes('winged')) k.delete('flying');
  return k;
}
function caps(S, t) { return capabilities(card(t), kws(S, t)); }
function has(S, t, k) { return kws(S, t).has(k); }
function prop(t, p) { return (card(t).props || []).includes(p); }
function maxStand(S, t) {
  let s = card(t).stand + (t.counters.bedrock || 0) + (t.tempStand || 0);
  return s;
}
function remaining(S, t) { return maxStand(S, t) - t.damage; }
function curStrike(S, t) {
  let s = card(t).strike + (t.tempStrike || 0);
  if (card(t).packBonus && S.things.some(o => o !== t && o.ctrl === t.ctrl && prop(o, 'beast'))) s += 1;
  if (S.arithmetic === 'legacy') { s += t.attuned ? 2 : 0; s += (t.counters.bedrock || 0) + (t.tempStand || 0); } // legacy: stand growth feeds strike
  return Math.max(0, s);
}
function legacyStand(S, t) { return S.arithmetic === 'legacy' && t.attuned ? 2 : 0; }
function standOf(S, t) { return maxStand(S, t) + legacyStand(S, t); }
function remainingOf(S, t) { return standOf(S, t) - t.damage; }
function incapacitated(t) { return !!(t.status.asleep || t.status.frozen || t.status.bound); }
function enemy(S, i) { return S.players[1 - i]; }
function thingById(S, id) { return S.things.find(t => t.id === id); }

// ---------- damage (spec §4.9) ----------
// Returns the packet that would be dealt. Legacy reproduces V28 multiplicative steps.
function packet(S, src, base, verb, toPlayer) {
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
      for (const t of dead) { S.players[t.owner].grave.push({ pid: t.pid, word: t.word, owner: t.owner }); say(S, `${t.word} (P${t.ctrl}) is destroyed.`); }
      const ordered = dead.slice().sort((a, b) => (a.ctrl === S.active ? -1 : 1) - (b.ctrl === S.active ? -1 : 1) || a.entry - b.entry);
      for (const t of ordered) deathTrigger(S, t);
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
    const tg = S.things.filter(o => o.ctrl !== t.ctrl && prop(o, 'living')).sort((a, b) => curStrike(S, b) - curStrike(S, a) || a.entry - b.entry)[0];
    if (tg) addPoison(S, tg, 1);
  }
}
function addPoison(S, target, n) {
  if (target.pid !== undefined && target.word) { // thing
    if (!prop(target, 'living')) return;
    target.status.poison = Math.min(FORMAT.poisonCap, (target.status.poison || 0) + n);
  } else target.poison = Math.min(FORMAT.poisonCap, target.poison + n);
}

// ---------- turn structure (§4.1) ----------
function startTurn(S) {
  const p = S.players[S.active];
  S.turn++; p.personalTurn++;
  if (S.active === S.first) S.round++;
  p.breath = Math.min(FORMAT.breathCap, 2 + p.personalTurn); p.extraBreath = 0; p.leechUsed = false;
  for (const t of S.things) if (t.ctrl === S.active) { t.exhausted = false; t.fresh = false; t.actions = 0; }
  // upkeep: burning and poison as one simultaneous batch
  const batch = [];
  for (const t of S.things.filter(t => t.ctrl === S.active)) {
    if (t.status.burning) { batch.push(() => { t.damage += 2; t.status.burning--; }); }
    if (t.status.poison) { batch.push(() => { t.damage += t.status.poison; t.status.poison--; }); }
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
  // draw
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
  for (const t of S.things) { t.tempStrike = 0; t.tempStand = 0; t.tempKw = []; }
  stateCheck(S);
  p.breath = 0; // reserve not implemented until stage C
  if (S.over == null && S.active !== S.first && S.round >= FORMAT.roundCap) S.over = 'draw';
  if (S.over != null) return;
  S.active = 1 - S.active;
  startTurn(S);
}

// ---------- legality ----------
function canAct(S, t) { return t.ctrl === S.active && !t.exhausted && !incapacitated(t) && (!t.fresh || has(S, t, 'swift')) && t.actions < 1; }
function contactReach(S, att, target) { // target: thing or player
  if (target.word && has(S, target, 'flying')) return has(S, att, 'flying') || has(S, att, 'reach');
  return true;
}
function eligibleBlockers(S, defender, att, targetThing) {
  return S.things.filter(b => b.ctrl === defender && !b.exhausted && !incapacitated(b) && b !== targetThing
    && (!targetThing || has(S, b, 'guard'))
    && (!has(S, att, 'flying') || has(S, b, 'flying') || has(S, b, 'reach')));
}

const COMBAT = { strike: 0, bite: 1, crush: 2, cut: 1 };
function legalActions(S) {
  if (S.over != null) return [{ type: 'pass' }];
  const p = S.players[S.active], out = [{ type: 'pass' }];
  const foes = S.things.filter(t => t.ctrl !== p.i);
  const mine = S.things.filter(t => t.ctrl === p.i);
  const free = FORMAT.slots - mine.length;
  const affordable = c => card(c).cost <= p.breath;
  for (const c of p.hand) {
    const d = card(c);
    if (!affordable(c)) continue;
    if (d.type === 'thing' && free > 0) out.push({ type: 'deploy', card: c.pid });
    if (d.type === 'ground') out.push({ type: 'ground', card: c.pid });
    if (d.type === 'spell') {
      if (d.spell === 'guard' || d.spell === 'kindle') for (const t of mine) out.push({ type: 'spell', card: c.pid, target: t.id });
      if (d.spell === 'gasp' && p.extraBreath < FORMAT.extraBreathCap) out.push({ type: 'spell', card: c.pid });
      if (d.spell === 'tonic' && (p.life < FORMAT.life || p.poison)) out.push({ type: 'spell', card: c.pid });
    }
    if (d.type === 'action') {
      for (const s of mine.filter(t => canAct(S, t) && caps(S, t).has(d.verb))) {
        if (d.verb in COMBAT) {
          if (d.verb !== 'bite' || true) out.push({ type: 'attack', subject: s.id, verb: d.verb, card: c.pid, target: 'rival' });
          for (const f of foes) if (contactReach(S, s, f) && (d.verb !== 'bite' || prop(f, 'living'))) out.push({ type: 'attack', subject: s.id, verb: d.verb, card: c.pid, target: f.id });
        } else if (d.verb === 'mend') {
          for (const f of mine.filter(t => t.damage > 0)) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
        } else if (d.verb === 'burn') {
          for (const f of foes.filter(t => prop(t, 'flammable') && !t.status.wet && (t.status.burning || 0) < 2)) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
        } else {
          out.push({ type: 'remote', subject: s.id, card: c.pid, target: 'rival' });
          for (const f of foes) if (d.verb !== 'poison' || prop(f, 'living')) out.push({ type: 'remote', subject: s.id, card: c.pid, target: f.id });
        }
      }
    }
  }
  if (p.breath >= 1) for (const s of mine.filter(t => canAct(S, t) && caps(S, t).has('strike') && curStrike(S, t) > 0)) {
    out.push({ type: 'attack', subject: s.id, verb: 'strike', target: 'rival' });
    for (const f of foes) if (contactReach(S, s, f)) out.push({ type: 'attack', subject: s.id, verb: 'strike', target: f.id });
  }
  return out;
}

function takeCard(p, pid) { const k = p.hand.findIndex(c => c.pid === pid); if (k < 0) throw new Error('card not in hand ' + pid); return p.hand.splice(k, 1)[0]; }
function pay(S, p, n) { if (n > p.breath) throw new Error('cannot afford'); p.breath -= n; }

// apply one action; `blockFn(S, info) -> blockerId|null` is the defender's decision
function apply(S, act, blockFn) {
  if (S.over != null) return;
  const p = S.players[S.active];
  const legal = legalActions(S).some(a => sameAction(a, act));
  if (!legal) throw new Error('illegal action ' + JSON.stringify(act));
  if (act.type === 'pass') { endTurn(S); return; }
  if (act.type === 'deploy') {
    const c = takeCard(p, act.card); pay(S, p, card(c).cost);
    const t = { id: 't' + (++S.seq), pid: c.pid, word: c.word, owner: c.owner, ctrl: p.i, entry: S.seq, damage: 0, counters: {}, status: {}, tempKw: [], exhausted: false, fresh: true, actions: 0, arrivedTurn: p.personalTurn, attuned: S.arithmetic === 'legacy' && card(c).school === p.main };
    S.things.push(t); say(S, `P${p.i} brings forth ${c.word}.`);
  } else if (act.type === 'ground') {
    const c = takeCard(p, act.card); pay(S, p, card(c).cost);
    if (p.ground) p.grave.push(p.ground);
    p.ground = c; say(S, `P${p.i} lays ${c.word}.`);
  } else if (act.type === 'spell') {
    const c = takeCard(p, act.card); const d = card(c); pay(S, p, d.cost);
    const t = act.target ? thingById(S, act.target) : null;
    if (d.spell === 'guard') { t.tempStand = (t.tempStand || 0) + 2; t.tempKw = (t.tempKw || []).concat(['guard']); }
    if (d.spell === 'kindle') t.tempStrike = (t.tempStrike || 0) + 1;
    if (d.spell === 'gasp') { const g = Math.min(2, FORMAT.extraBreathCap - p.extraBreath); p.breath += g; p.extraBreath += g; }
    if (d.spell === 'tonic') { p.life = Math.min(FORMAT.life, p.life + 3); if (p.poison) p.poison--; }
    p.grave.push(c); say(S, `P${p.i} speaks ${c.word}.`);
  } else if (act.type === 'remote') {
    const c = takeCard(p, act.card); const d = card(c); pay(S, p, d.cost);
    const s = thingById(S, act.subject); s.exhausted = true; s.actions++;
    const tg = act.target === 'rival' ? enemy(S, p.i) : thingById(S, act.target);
    if (d.verb === 'mend') heal(S, tg, 3);
    else if (d.verb === 'burn') tg.status.burning = 2;
    else if (d.verb === 'poison') { if (tg.word) addPoison(S, tg, 2); else addPoison(S, tg, 2); }
    else { // scorch / seep: remote fixed damage, no block, no retaliation
      const pk = packet(S, s, d.dmg, d.verb, !tg.word);
      record(S, s, d.verb, pk, tg);
      if (tg.word) tg.damage += pk.n; else loseLife(S, tg.i, pk.n, d.verb);
    }
    p.usedVerbs[d.verb] = true; p.grave.push(c); say(S, `P${p.i}: ${s.word} ${d.verb}s.`);
  } else if (act.type === 'attack') {
    let c = null, d = null;
    if (act.card) { c = takeCard(p, act.card); d = card(c); }
    const cost = d ? d.cost : 1;
    const courage = S.arithmetic === 'legacy' && p.life <= 8;
    pay(S, p, courage ? 0 : cost);
    const s = thingById(S, act.subject); s.exhausted = true; s.actions++;
    combat(S, s, act.verb, act.target === 'rival' ? null : thingById(S, act.target), d ? (d.bonus || 0) : 0, blockFn, courage);
    p.usedVerbs[act.verb] = true;
    if (c) p.grave.push(c);
  }
  stateCheck(S);
  S.hashes.push(hashState(S));
}

function record(S, src, verb, pk, tg) { S.stats.packets.push({ round: S.round, side: src.ctrl, verb, n: pk.n, toPlayer: !tg.word, steps: pk.steps }); }

// §4.7 combat: one simultaneous batch of attack and legal retaliation
function combat(S, att, verb, targetThing, bonus, blockFn, unblockable) {
  const defender = 1 - att.ctrl;
  const cands = unblockable ? [] : eligibleBlockers(S, defender, att, targetThing);
  let blocker = null;
  if (cands.length && blockFn) {
    const id = blockFn(S, { attacker: att, verb, target: targetThing, candidates: cands, bonus });
    blocker = cands.find(b => b.id === id) || null;
  }
  if (blocker) blocker.exhausted = true;
  const recipient = blocker || targetThing; // null = rival
  let retaliator = null;
  if (recipient && !incapacitated(recipient) && curStrike(S, recipient) > 0) {
    if (recipient === blocker) retaliator = blocker;
    else if (!recipient.exhausted) { retaliator = recipient; recipient.exhausted = true; }
  }
  const base = curStrike(S, att) + bonus;
  let pk = packet(S, att, base, verb, !recipient);
  // Bite deals no damage to a non-living or Sacred interceptor
  if (verb === 'bite' && recipient && !prop(recipient, 'living')) pk = { n: 0, steps: pk.steps.concat([['bite vs non-living', 0]]) };
  record(S, att, verb, pk, recipient || enemy(S, att.ctrl));
  const ret = retaliator ? curStrike(S, retaliator) : 0;
  const before = recipient ? remainingOf(S, recipient) : 0;
  // apply batch
  if (recipient) recipient.damage += pk.n; else loseLife(S, defender, pk.n, verb);
  if (ret > 0) att.damage += ret;
  // on-hit riders
  if (pk.n > 0) {
    if (has(S, att, 'venomous')) { if (!recipient) addPoison(S, enemy(S, att.ctrl), 1); else if (remainingOf(S, recipient) > 0) addPoison(S, recipient, 1); }
    if (card(att).igniteOnHit && recipient && prop(recipient, 'flammable') && remainingOf(S, recipient) > 0 && !recipient.status.wet) recipient.status.burning = 2;
    if (card(att).leech && !S.players[att.ctrl].leechUsed && (!recipient || prop(recipient, 'living'))) { S.players[att.ctrl].leechUsed = true; S.players[att.ctrl].life = Math.min(FORMAT.life, S.players[att.ctrl].life + 1); }
  }
  // Crush overflow: once, unmodified (v29) / re-amplified (legacy)
  if (verb === 'crush' && recipient && pk.n > before && before >= 0) {
    let over = pk.n - Math.max(0, before);
    if (S.arithmetic === 'legacy') {
      const pl = S.players[att.ctrl];
      if (card(att).school === pl.main) over = Math.round(over * 1.2);
      if (!pl.usedVerbs.overflow) { over += 2; pl.usedVerbs.overflow = true; }
    }
    record(S, att, 'overflow', { n: over, steps: [['overflow', over]] }, enemy(S, att.ctrl));
    loseLife(S, defender, over, 'crush overflow');
  }
  say(S, `P${att.ctrl}: ${att.word} ${verb}s ${recipient ? recipient.word : 'P' + defender} for ${pk.n}${blocker ? ' (blocked)' : ''}${ret ? `, takes ${ret} back` : ''}.`);
}

function sameAction(a, b) { return a.type === b.type && a.card === b.card && a.subject === b.subject && a.verb === b.verb && (a.target || null) === (b.target || null); }

function hashState(S) {
  const pub = JSON.stringify({ t: S.turn, a: S.active, p: S.players.map(p => [p.life, p.breath, p.hand.map(c => c.pid), p.deck.map(c => c.pid), p.poison, p.ground && p.ground.pid]), th: S.things.map(t => [t.id, t.pid, t.ctrl, t.damage, t.exhausted, t.fresh, t.counters, t.status]) });
  let h = 2166136261; for (let i = 0; i < pub.length; i++) { h ^= pub.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16);
}

module.exports = { FORMAT, createMatch, legalActions, apply, curStrike, remainingOf, standOf, packet, deckErrors, hashState, card, has, kws, stateCheck, combat, endTurn, startTurn };
