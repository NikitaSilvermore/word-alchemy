// Engine probe for the Atlas: builds many random but legal-looking positions with the real engine (Room to Grow rules),
// asks the engine's own legal-action generator what each side may do, applies every offered action to a copy, and records
// what actually changed (engine events + state diff). Every relationship in the Atlas's "verified" layer has at least one
// such witness. Nothing is inferred from tags, themes or deck membership.
'use strict';
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
const E = require(ROOT + '/engine29/src/engine'), F = require(ROOT + '/engine29/src/formats');
const { BY_ID } = require(ROOT + '/engine29/src/cards');
const { THREE_DECKS: D } = require(ROOT + '/engine29/data/v33_decks');
const FMT = 'v33_core3_room';
let DECKS = D;

function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const pick = (r, a) => a[Math.floor(r() * a.length)];
const shuffle = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function snap(S) { const rr = S.rand; delete S.rand; const c = structuredClone(S); if (rr) { S.rand = rr; c.rand = rr; } return c; }
const formOf = t => t.form || t.word;

// forms the probe has seen created, with the exact thing fields the engine gave them (word, form, token, lineage)
const TEMPLATES = {};
function noteTemplate(t) { const f = formOf(t); if (!TEMPLATES[f] && (t.form || t.token || t.lineage) && !(BY_ID[f] && BY_ID[f].deckLegal && !t.form)) TEMPLATES[f] = { word: t.word, form: t.form, token: !!t.token, lineage: t.lineage || null, from: t.word }; }

function build(r, dA, dB, poolA, poolB) {
  const S = F.createFromFormat(FMT, { decks: [DECKS[dA].words, DECKS[dB].words], seed: Math.floor(r() * 1e9), first: 0, mulligan: () => [] });
  for (const p of S.players) { p.deck.push(...p.hand); p.hand = []; }
  S.active = 0;
  const put = (side, f) => {
    const p = S.players[side], tpl = TEMPLATES[f];
    const printed = tpl ? tpl.word : f, k = p.deck.findIndex(c => c.word === printed);
    if (k < 0 && !tpl) return null;             // that printed card is already used
    if (tpl && !tpl.token && !tpl.lineage && k < 0) return null; // a transformed card needs its printed card
    const c = k >= 0 && !(tpl && (tpl.token || tpl.lineage)) ? p.deck.splice(k, 1)[0] : null;
    const st = BY_ID[f] && BY_ID[f].stand || 2;
    const t = { id: 't' + (++S.seq), pid: c ? c.pid : null, word: tpl ? tpl.word : f, owner: side, ctrl: side, entry: S.seq, damage: r() < .25 ? Math.floor(r() * Math.max(1, st - 1)) + (st > 1 ? 1 : 0) : 0, counters: {}, status: {}, exhausted: r() < .2, fresh: r() < .08, actions: 0, arrivedTurn: 0 };
    if (t.damage >= st) t.damage = st - 1;
    if (tpl) { if (tpl.form) t.form = tpl.form; if (tpl.token) t.token = true; if (tpl.lineage) t.lineage = structuredClone(tpl.lineage); }
    const cd = BY_ID[f] || {};
    if (cd.ladder === 'plant' || (cd.props || []).includes('plant')) { if (r() < .4) t.counters.age = 1; if (r() < .4) t.counters.growth = 1 + Math.floor(r() * 2); }
    if (r() < .12) t.status.wet = true;
    if (r() < .05 && (cd.props || []).includes('flammable')) t.status.burning = true;
    S.things.push(t); return t;
  };
  for (const [side, pool] of [[0, poolA], [1, poolB]]) {
    const n = Math.floor(r() * 8); let placed = 0;
    for (const f of shuffle(r, pool)) { if (placed >= n) break; if (put(side, f)) placed++; }
  }
  for (const side of [0, 1]) { const p = S.players[side], k = p.deck.findIndex(c => BY_ID[c.word].type === 'ground'); if (k >= 0 && r() < .35) { const c = p.deck.splice(k, 1)[0]; p.ground = { pid: c.pid, word: c.word, owner: c.owner, damage: 0 }; } }
  // hands: P0 gets 3-9 of its remaining words (shuffled), P1 3-6 (for responses)
  for (const [side, lo, hi] of [[0, 3, 9], [1, 3, 6]]) { const p = S.players[side]; p.deck = shuffle(r, p.deck); const n = lo + Math.floor(r() * (hi - lo + 1)); p.hand = p.deck.splice(0, Math.min(n, p.deck.length)); }
  const P0 = S.players[0], P1 = S.players[1];
  P0.breath = 6 + Math.floor(r() * 5); P0.reserve = 0; P1.breath = 0; P1.reserve = Math.floor(r() * 4);
  P0.life = 18 + Math.floor(r() * 13); P1.life = 18 + Math.floor(r() * 13);
  if (r() < .1) P0.poison = 1;
  for (const p of S.players) p.personalTurn = Math.max(p.personalTurn, 3);
  return S;
}

// what changed between two states, as plain facts
function diff(A, B, ev0) {
  const out = [];
  const byId = new Map(A.things.map(t => [t.id, t])), byId2 = new Map(B.things.map(t => [t.id, t]));
  const side = t => (t.ctrl === 0 ? 'mine' : 'theirs');
  for (const e of B.events.slice(ev0)) {
    if (e.type === 'transform') { const t = byId2.get(e.tid) || byId.get(e.tid); out.push({ k: 'transform', from: e.from, to: e.to, side: t ? side(t) : '?', regress: !!e.regress }); if (t && !TEMPLATES[e.to]) TEMPLATES[e.to] = { word: t.word, form: e.to === t.word ? undefined : e.to, token: !!t.token, lineage: t.lineage || null, from: t.word }; }
    else if (e.type === 'made') { const t = byId2.get(e.tid); out.push({ k: 'made', recipe: e.recipe, form: t ? formOf(t) : null, side: e.side === 0 ? 'mine' : 'theirs' }); if (t) noteTemplate(t); }
    else if (e.type === 'token') { out.push({ k: 'token', form: e.id, side: e.side === 0 ? 'mine' : 'theirs' }); const t = byId2.get(e.tid); if (t) noteTemplate(t); }
    else if (e.type === 'death') { const t = byId.get(e.tid); out.push({ k: e.how === 'sacrifice' ? 'sacrificed' : 'destroyed', form: t ? formOf(t) : '?', side: t ? side(t) : '?', how: e.how }); }
    else if (['rebirth', 'spill', 'flare', 'bounce', 'ignite', 'ignite-failed', 'shield', 'shielded', 'ward', 'writ', 'pollinated', 'feast', 'espalier', 'apple-fruit', 'bound-miss', 'abundance-strike', 'revive', 'recover', 'separated', 'unmade', 'control', 'attach', 'sealed', 'folio-failed', 'failed', 'cancelled'].includes(e.type)) {
      const tid = e.tid || e.id || e.target, t = tid ? (byId.get(tid) || byId2.get(tid)) : null; out.push({ k: 'event', type: e.type, form: t ? formOf(t) : null, side: t ? side(t) : null, why: e.why || null });
    }
  }
  for (const [id, b] of byId2) {
    const a = byId.get(id); if (!a) continue;
    const f = formOf(b), s = side(b);
    if ((b.damage || 0) > (a.damage || 0)) out.push({ k: 'damage', form: f, side: s, n: b.damage - a.damage });
    if ((b.damage || 0) < (a.damage || 0)) out.push({ k: 'heal', form: f, side: s, n: a.damage - b.damage });
    for (const st of new Set([...Object.keys(a.status), ...Object.keys(b.status)])) {
      if (!a.status[st] && b.status[st]) out.push({ k: 'status+', form: f, side: s, status: st });
      if (a.status[st] && !b.status[st]) out.push({ k: 'status-', form: f, side: s, status: st });
    }
    for (const c of new Set([...Object.keys(a.counters), ...Object.keys(b.counters)])) if ((b.counters[c] || 0) > (a.counters[c] || 0) && c !== 'age') out.push({ k: 'counter+', form: f, side: s, counter: c });
    if (!a.exhausted && b.exhausted) out.push({ k: 'exhaust', form: f, side: s });
    if (a.exhausted && !b.exhausted) out.push({ k: 'ready', form: f, side: s });
    for (const key of ['shield3', 'defOnly', 'g3']) if (!a[key] && b[key]) out.push({ k: 'flag', flag: key, form: f, side: s });
    if (a.ctrl !== b.ctrl) out.push({ k: 'control', form: f });
  }
  for (const [i, s] of [[0, 'me'], [1, 'rival']]) {
    const d = B.players[i].life - A.players[i].life;
    if (d > 0) out.push({ k: 'life+', who: s, n: d }); if (d < 0) out.push({ k: 'life-', who: s, n: -d });
    if ((B.players[i].poison || 0) < (A.players[i].poison || 0)) out.push({ k: 'poison-', who: s });
    if ((B.players[i].poison || 0) > (A.players[i].poison || 0)) out.push({ k: 'poison+', who: s });
  }
  const h0 = A.players[0].hand.length, h1 = B.players[0].hand.length;
  const drew = B.players[0].deck.length < A.players[0].deck.length; if (drew) out.push({ k: 'draw', n: A.players[0].deck.length - B.players[0].deck.length });
  const backToHand = B.players[1].hand.length > A.players[1].hand.length; if (backToHand) out.push({ k: 'rival-hand+' });
  if (B.players[0].breath < A.players[0].breath) out.push({ k: 'breath', n: A.players[0].breath - B.players[0].breath });
  for (const [i, who] of [[0, 'me'], [1, 'rival']]) if ((B.players[i].extraBreath || 0) > (A.players[i].extraBreath || 0)) out.push({ k: 'breath+', who, n: B.players[i].extraBreath - (A.players[i].extraBreath || 0) });
  void h0; void h1;
  return out;
}

function describeAct(S, a) {
  const thing = id => { const t = S.things.find(x => x.id === id); if (t) return { form: formOf(t), side: t.ctrl === S.active ? 'mine' : 'theirs' }; if (id === 'ground') { const g = S.players[S.active].ground; return { form: g ? g.word : 'ground', side: 'mine', ground: true }; } if (id === 'self') return { form: 'self', side: 'me' }; return null; };
  const handWord = pid => { for (const p of S.players) { const c = p.hand.find(h => h.pid === pid); if (c) return c.word; } return null; };
  const o = { type: a.type };
  if (a.card) o.word = handWord(a.card);
  if (a.subject) o.subject = thing(a.subject);
  if (a.ability) o.ability = a.ability;
  for (const k of ['mode', 'branch', 'recipe', 'ash', 'verb']) if (a[k] !== undefined) o[k] = a[k];
  for (const k of ['target', 'a', 'b', 'sacrifice', 'ready', 'endorse', 'mend', 'donor', 'host', 'tree']) if (a[k]) o[k] = thing(a[k]) || a[k];
  if (a.targets) o.targets = a.targets.map(thing);
  if (a.attackers) o.attackers = a.attackers.map(thing);
  if (a.discard) o.discard = handWord(a.discard);
  return o;
}

function run({ seed = 1, perPair = 60, rounds = 3, responses = true, decks: deckMap = D, pairs = null } = {}) {
  DECKS = deckMap; for (const k of Object.keys(TEMPLATES)) delete TEMPLATES[k];
  const r = rng(seed), records = [], offered = [];
  const decks = Object.keys(DECKS);
  const deckThings = d => DECKS[d].words.filter(w => BY_ID[w].type === 'thing');
  const pools = {}; for (const d of decks) pools[d] = new Set(deckThings(d));
  for (let round = 0; round < rounds; round++) {
    for (const [dA, dB] of (pairs || decks.flatMap(x => decks.map(y => [x, y])))) for (let n = 0; n < perPair; n++) {
      const S = build(r, dA, dB, [...pools[dA]], [...pools[dB]]);
      let acts; try { acts = E.legalActions(S); } catch (e) { continue; }
      const field = S.things.map(t => ({ form: formOf(t), side: t.ctrl === 0 ? 'mine' : 'theirs', wet: !!t.status.wet, exhausted: t.exhausted, damaged: !!t.damage }));
      offered.push({ deck: dA, opp: dB, field, hand: S.players[0].hand.map(c => c.word), acts: acts.filter(a => a.type !== 'combat').map(a => describeAct(S, a)) });
      const combat = acts.filter(a => a.type === 'combat'), rest = acts.filter(a => a.type !== 'combat' && a.type !== 'pass');
      const chosen = rest.concat(shuffle(r, combat).slice(0, 2));
      for (const a of chosen) {
        const desc = describeAct(S, a);
        const windows = [];
        const go = (respPick) => {
          const C = snap(S), ev0 = C.events.length;
          const ctl = { block: (S2, info) => (info.candidates.length && r() < .6 ? pick(r, info.candidates).id : null),
            respond: (S2, side, kind) => { const opts = E.legalResponses(S2, side, kind); if (!respPick) { if (opts.length) windows.push({ side, kind, opts: opts.map(o => describeAct(S2, o)), raw: opts }); return null; } if (respPick.used) return null; respPick.used = true; return opts.find(o => JSON.stringify(o) === respPick.key) || null; } };
          try { E.apply(C, a, ctl); } catch (e) { return { error: String(e.message || e).slice(0, 200) }; }
          return { effects: diff(S, C, ev0), over: C.over };
        };
        const res = go(null), rid = records.length, pos = offered.length - 1;
        records.push({ rid, pos, deck: dA, opp: dB, round, act: desc, ...res });
        if (responses) for (const w of windows.slice(0, 1)) for (const o of shuffle(r, w.raw).slice(0, 3)) {
          const rr = go({ key: JSON.stringify(o) });
          records.push({ rid: records.length, base: rid, pos, deck: dA, opp: dB, round, act: desc, response: { side: w.side, kind: w.kind, ...describeAct(S, o) }, ...rr });
        }
      }
      // upkeep: end my turn, let the rival pass, see what changed at the start of my next turn
      const C = snap(S), ev0 = C.events.length;
      try { E.apply(C, { type: 'pass' }, { block: () => null, respond: null }); if (C.over == null && C.active === 1) { C.players[1].hand = C.players[1].hand.slice(0, 7); E.apply(C, { type: 'pass' }, { block: () => null, respond: null }); }
        records.push({ rid: records.length, pos: offered.length - 1, deck: dA, opp: dB, round, act: { type: 'upkeep' }, effects: diff(S, C, ev0).filter(x => ['transform', 'token', 'made', 'counter+', 'event'].includes(x.k)) }); } catch (e) { /* ignore */ }
    }
    // grow the pools with every form the engine actually produced for that deck's side
    for (const rec of records) if (rec.round === round && rec.effects) for (const x of rec.effects) {
      const f = x.k === 'transform' ? x.to : (x.k === 'made' || x.k === 'token') ? x.form : null;
      if (f && x.side === 'mine' && TEMPLATES[f]) pools[rec.deck].add(f);
      if (f && x.side === 'theirs' && TEMPLATES[f]) pools[rec.opp].add(f);
    }
    for (const rec of records) if (rec.round === round && rec.effects) for (const x of rec.effects) if (x.k === 'transform' && !TEMPLATES[x.to]) { /* captured below */ }
  }
  return { records, offered, pools: Object.fromEntries(Object.entries(pools).map(([k, v]) => [k, [...v]])), templates: TEMPLATES };
}
module.exports = { run, build, diff, describeAct, TEMPLATES, FMT };
if (require.main === module) {
  const t0 = Date.now(); const out = run({ seed: +(process.argv[2] || 1), perPair: +(process.argv[3] || 20), rounds: +(process.argv[4] || 2) });
  const errs = out.records.filter(x => x.error);
  console.log(JSON.stringify({ secs: (Date.now() - t0) / 1000, records: out.records.length, errors: errs.length, errSample: errs.slice(0, 3).map(e => e.error), pools: out.pools, templates: Object.keys(out.templates) }, null, 1));
}
