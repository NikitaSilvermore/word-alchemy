// WORD ALCHEMY — V30 "The Crucible" browser playtest. All rules come from engine29; this file only renders state
// and turns clicks into the engine's own legal actions.
'use strict';
const E = require('../../engine29/src/engine');
const B = require('../../engine29/src/bots');
const F = require('../../engine29/src/formats');
const R = require('../../engine29/src/recipes');
const { BY_ID, CARDS } = require('../../engine29/src/cards');
const { REFERENCE_DECKS } = require('../../engine29/data/reference_decks');
const { THEMED, COUNTERS } = require('../../engine29/data/themed_decks');
const SPEC = require('../../engine29/data/spec_catalogue.json');
const { createController, restoreController } = require('./controller');
const { FIXTURES } = require('./fixtures');
const ART = new Set(require('./art_index.json'));

const FMT_GROUPS = [
  ['Reference', [['grammar_v30_rc1', 'V30 rc1 — original market (2/3 spark)']]],
  ['Market comparison', [['grammar_v30_exp_price34', 'Market at 3/4 spark (experiment)']]],
  ['Other test variants', [['grammar_v30_exp_nosentence', 'No spark from sentences'], ['grammar_v30_exp_income2', 'Spark income every second turn'], ['grammar_v30_exp_buy2', 'Buy every second turn'], ['grammar_v30_exp_reserve3', 'Reserve cap 3'], ['grammar_v30_exp_cheapresp', 'Cheaper responses']]],
  ['Earlier', [['grammar_v29_spec', 'V29 specification']]],
];
const VERSION = 'V30 Crucible playtest 2';
const SCHOOLS = ['fire', 'water', 'air', 'earth', 'life', 'rot', 'word'];
const SCHOOL_NAME = { fire: 'Fire', water: 'Water', air: 'Air', earth: 'Earth', life: 'Life', rot: 'Rot', word: 'The Word' };
const TIERS = B.TIER_ORDER;
const store = { get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ } } };

// ---------- names and text ----------
const SPEC_BY = {}; for (const s of SPEC) if (s.school !== 'legacy') SPEC_BY[s.school + '.' + s.name.toLowerCase().replace(/[^a-z]+/g, '_').replace(/_$/, '')] = s;
const MADE_TEXT = {
  'made.energy': 'Fire/Air. Non-living. At your upkeep gain 1 extra breath (within the +2 limit).',
  'made.steam': 'Fire/Water. Body, Seep. Makes Things it damages in combat Wet. Disperses at its controller\'s second upkeep.',
  'made.swamp': 'Earth/Water. Liquid, Body. Life ingredient.',
  'made.golem': 'Earth/Word. Clay, Stone, Body. Heavy, Guard.',
  'made.homunculus': 'Water/Word. Living Person, Speaker, Body. On formation inspect the top 3 cards of your deck and take a Spell.',
  'made.phoenix': 'Fire. Living Beast, Bird, Winged, Hot, Body. Flying, Final. The first time it would be destroyed in the duel it is reborn instead: damage removed, exhausted.',
  'made.alkahest': 'Water. Liquid, Final. Main, 1 breath, sacrifice Alkahest: destroy an enemy Thing or damageable Ground.',
  'made.ouroboros': 'Rot/Life. Living Beast, Serpent, Body. Venomous, Bite, Final. Its controller\'s first Ouroboros death recovers one released ingredient to hand.',
  'made.life': 'Life/Earth/Water. Living. At your upkeep heal 1 life.',
  'made.world_tree': 'Life/Earth/Water. Living Plant, Tree, Body. Guard, Final. At your upkeep heal 2 life and give 1 Growth to your oldest other Living Thing.',
  'made.quintessence': 'Fire/Air/Earth/Water. Body. Philosopher\'s Stone ingredient.',
  'made.philosophers_stone': 'Earth/Word with elemental lineage. Stone, Metal, Body. Final. At your upkeep choose: 1 extra breath or draw 1.',
  'token.ash': 'Token. Material. Phoenix ingredient.', 'token.fruit': 'Token. Food. Main, 1 breath, sacrifice: heal 2 life or remove 1 poison from a friendly Thing.',
  'token.blossom': 'Token. Living Plant, Flower.', 'token.carrion': 'Token. Organic. Decay deals 4 when Carrion is its sacrifice.',
  'earth.gold': 'Transformed-only. Metal, Body, Incorruptible. At your upkeep gain 1 extra breath.',
};
const SPECIAL = { philosophers_stone: 'Philosopher\'s Stone', world_tree: 'World Tree' };
function nm(id) { if (!id) return ''; if (id === '?') return 'Hidden word'; const w = String(id).split('.').pop(); return SPECIAL[w] || w.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
function textOf(id) { return SPEC_BY[id] ? SPEC_BY[id].text : MADE_TEXT[id] || ''; }
function schoolOf(id) { const c = BY_ID[id]; return c ? c.school : 'word'; }
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const TYPE_NAME = { thing: 'Thing', action: 'Action', spell: 'Spell', ground: 'Ground', quality: 'Quality', weather: 'Weather', burden: 'Burden', category: 'Category' };

// ---------- app state ----------
const A = { view: store.get('wa30.view') || 'art', names: {}, screen: 'lobby', C: null, sel: null, why: null, inspect: null, modal: null, speed: 600, review: null, botTimer: null, flash: null };
const lobby = Object.assign({ ra: 'ra', mine: 'D1_living_sky', theirs: 'D2_lockkeepers_wall', tier: 'journeyman', style: 'careful', seat: 'first', seed: 1001, format: 'grammar_v30_rc1' }, store.get('wa30.lobby') || {});
function allDecks() {
  const custom = store.get('wa30.custom') || {};
  const out = [];
  for (const [k, v] of Object.entries(REFERENCE_DECKS)) out.push({ id: k, group: 'Reference decks (frozen)', label: k.replace(/_/g, ' ') + ' — ' + v.rival, words: v.words });
  for (const [k, v] of Object.entries(THEMED)) out.push({ id: k, group: 'Themed test decks', label: k.slice(2).replace(/_/g, ' '), words: v });
  for (const [k, v] of Object.entries(COUNTERS)) out.push({ id: k, group: 'Counter test decks', label: k.slice(2).replace(/_/g, ' '), words: v });
  for (const [k, v] of Object.entries(custom)) out.push({ id: 'custom:' + k, group: 'Your test decks', label: k, words: v });
  return out;
}
const deckById = id => allDecks().find(d => d.id === id) || allDecks()[0];

// ---------- the match ----------
const hooks = { changed: () => { save(); render(); }, prompt: () => render(), error: (C, e) => { A.flash = 'Engine refused that: ' + (C.error || e.message); render(); } };
function startMatch(cfgOverride) {
  stopBot();
  const d1 = deckById(lobby.mine), d2 = deckById(lobby.theirs);
  const first = lobby.seat === 'first' ? 0 : lobby.seat === 'second' ? 1 : (lobby.seed % 2);
  const cfg = cfgOverride || { format: lobby.format, decks: [d1.words, d2.words], deckNames: [d1.label, d2.label], seed: +lobby.seed, first, humanSide: 0, botPolicy: lobby.style + ':' + lobby.tier + (lobby.ra ? ':' + lobby.ra : '') };
  A.cfg = cfg; A.C = createController(cfg, hooks); A.sel = null; A.why = null; A.review = null; A.screen = 'match';
  A.C.start(); render();
}
function startFixture(id) {
  stopBot();
  const cfg = { format: 'grammar_v30_rc1', decks: [], seed: 0, first: FIXTURES[id].build().first, humanSide: 0, botPolicy: 'careful:' + lobby.tier, fixture: FIXTURES[id], deckNames: ['Fixture', 'Fixture'] };
  A.cfg = cfg; A.C = createController(cfg, hooks); A.sel = null; A.why = null; A.screen = 'match'; A.C.start(); render();
}
function save() {
  if (!A.C || A.review) return;
  const rep = A.C.replay(); rep.deckNames = A.cfg.deckNames; store.set('wa31.last', rep); store.set('wa31.left', false);
}
function stopBot() { if (A.botTimer) { clearTimeout(A.botTimer); A.botTimer = null; } }
function driveBot() {
  stopBot();
  const C = A.C; if (!C || A.review || !C.isBotTurn()) return;
  A.botTimer = setTimeout(() => { A.botTimer = null; if (!A.C || !A.C.isBotTurn()) return; A.C.botAct(); render(); }, A.speed);
}

// ---------- selection: narrowing the engine's legal actions ----------
const KEYS = ['type', 'card', 'subject', 'ability', 'recipe', 'a', 'b', 'category', 'qual', 'sacrifice', 'payload', 'mode', 'targets', 'target', 'branch', 'replace', 'might', 'donor', 'slot', 'verb'];
const KEY_LABEL = { type: 'What to do', card: 'Word', subject: 'Who acts', ability: 'Ability', recipe: 'Recipe', a: 'First ingredient', b: 'Second ingredient', category: 'Category', qual: 'Lawful Quality', sacrifice: 'Sacrifice (cost)', payload: 'Payload', mode: 'Property to blow', targets: 'Targets', target: 'Target', branch: 'Becomes', replace: 'Replace attachment', might: 'Gains Might', donor: 'Donor plant', slot: 'Offer', verb: 'Verb' };
const J = v => JSON.stringify(v == null ? null : v);
function baseCands() {
  const C = A.C; if (!C) return [];
  if (C.pending && C.pending.type === 'respond') return C.pending.options;
  if (C.pending || !C.S || C.S.over != null || C.S.active !== C.human || A.review) return [];
  return E.legalActions(C.S).filter(a => a.type !== 'pass');
}
function anchorMatch(a, an) {
  if (!an) return true;
  if (an.kind === 'card') return a.card === an.id || a.category === an.id || a.qual === an.id;
  if (an.kind === 'thing') return a.subject === an.id || a.a === an.id || a.b === an.id || a.sacrifice === an.id || a.payload === an.id || a.endorse === an.id || a.donor === an.id;
  if (an.kind === 'foe') return a.target === an.id || (a.targets || []).includes(an.id);
  if (an.kind === 'market') return a.type === 'buy' && a.slot === an.id;
  if (an.kind === 'vessel') return a.type === 'fuse';
  if (an.kind === 'ground') return a.type === 'fuse' && (a.a === 'ground' || a.b === 'ground');
  if (an.kind === 'catalyst') return a.type === 'catalyst';
  return true;
}
function selection() {
  const all = baseCands();
  if (!A.sel) return { all, cands: [], next: null };
  let cands = all.filter(a => anchorMatch(a, A.sel.anchor));
  for (const [k, v] of Object.entries(A.sel.fixed)) cands = cands.filter(a => J(a[k]) === v);
  let next = null;
  for (const k of KEYS) { const vals = new Set(cands.map(a => J(a[k]))); if (vals.size > 1) { next = k; break; } }
  const choices = next ? [...new Set(cands.map(a => J(a[next])))].map(v => JSON.parse(v)) : [];
  return { all, cands, next, choices };
}
function boardTargets(sel) { // values of the next key that correspond to something on the board
  const out = new Set();
  if (!sel || !sel.next) return out;
  for (const v of sel.choices) { if (typeof v === 'string') out.add(v); if (Array.isArray(v) && v.length === 1) out.add(v[0]); }
  return out;
}

// ---------- describing things ----------
function V() { return A.C ? A.C.state() : null; }
function who(side) { return A.C && side === A.C.human ? 'You' : 'Rival'; }
function thingName(S, id) {
  const t = S.things.find(x => x.id === id); if (!t) return (A.names[id] || 'a Thing') + ' (gone)';
  if (t.status.concealed && t.ctrl !== A.C.human) return 'a Concealed Thing';
  return nm(t.form || t.word) + (t.ctrl === A.C.human ? '' : ' (rival)');
}
function cardWord(S, pid) {
  for (const p of S.players) { const c = p.hand.concat(p.grave, p.sealed).find(x => x.pid === pid); if (c) return c.word; }
  if (S.clause) for (const n of S.clause.nodes) { if (n.card && n.card.pid === pid) return n.card.word; for (const c of n.extra || []) if (c.pid === pid) return c.word; }
  for (const t of S.things) for (const q of t.quals || []) if (q.pid === pid) return q.word;
  for (const t of S.things) if (t.pid === pid) return t.status.concealed && t.ctrl !== A.C.human ? '?' : t.word;
  for (const p of S.players) if (p.ground && p.ground.pid === pid) return p.ground.word;
  if (S.sky && S.sky.pid === pid) return S.sky.word;
  return null;
}
function valueLabel(S, key, v) {
  if (v == null) return '—';
  if (key === 'card' || key === 'category' || key === 'qual') return nm(cardWord(S, v) || v);
  if (key === 'replace') return 'Replace ' + nm(cardWord(S, v));
  if (key === 'slot') { const o = S.market[v]; return o ? nm(o.word) : 'from the market'; }
  if (key === 'recipe') return nm('made.' + v) || v;
  if (key === 'branch') return nm(v);
  if (key === 'mode') return { hot: 'Hot — ignite', liquid: 'Liquid — make Wet', toxic: 'Toxic — 1 poison' }[v] || v;
  if (key === 'ability') return { heal2: 'Heal 2', tend: 'Tend', etch: 'Etch (3 to Metal/Stone)', eatFruit: 'Eat fruit', alkahest: 'Dissolve (destroy)' }[v] || v;
  if (key === 'type') return { deploy: 'Bring forth', ground: 'Lay Ground', spell: 'Speak', attack: 'Attack', remote: 'Act', fuse: 'Fuse', ability: 'Ability', buy: 'Buy', catalyst: 'Refill catalyst', quality: 'Attach', weather: 'Weather', burden: 'Burden', law: 'Law' }[v] || v;
  if (Array.isArray(v)) return v.map(x => thingName(S, x)).join(' and ');
  return targetLabel(S, v);
}
function targetLabel(S, v) {
  if (v === 'rival') return A.C.human === (A.actor != null ? A.actor : S.active) ? 'the rival' : 'you';
  if (v === 'self') return A.C.human === (A.actor != null ? A.actor : S.active) ? 'yourself' : 'the rival';
  if (v === 'sky') return 'the Weather (' + nm(S.sky && S.sky.word) + ')';
  if (v === 'law') return 'the Law';
  if (v === 'ground') return 'a Ground';
  const s = String(v);
  if (s.startsWith('g:')) return nm(cardWord(S, s.slice(2))) + ' (Grave)';
  if (s.startsWith('q:')) return nm(cardWord(S, s.slice(2))) + ' (attached Quality)';
  if (s.startsWith('node:')) { const n = S.clause && S.clause.nodes[+s.slice(5)]; return 'the pending ' + (n && n.card ? nm(n.card.word) : 'sentence'); }
  if (s.startsWith('reveal:')) return 'reveal ' + thingName(S, s.slice(7));
  if (s.startsWith('burden:')) return 'the Burden on ' + (+s.slice(7) === A.C.human ? 'you' : 'the rival');
  if (S.things.some(t => t.id === v)) return thingName(S, v);
  if (/^t\d+$/.test(s)) return (A.names[s] || 'a Thing') + ' (gone)';
  return s;
}
function describe(S, a, actor) {
  A.actor = actor; try { return describe0(S, a); } finally { A.actor = null; }
}
function describe0(S, a) {
  if (!a) return 'Pass';
  const c = a.card ? nm(cardWord(S, a.card)) : '';
  const tgt = a.target != null ? ' → ' + targetLabel(S, a.target) : a.targets ? ' → ' + a.targets.map(x => thingName(S, x)).join(', ') : '';
  switch (a.type) {
    case 'pass': return 'End turn';
    case 'deploy': return 'Bring forth ' + c;
    case 'ground': return 'Lay ' + c + ' as Ground';
    case 'spell': return 'Speak ' + c + tgt + (a.branch ? ' (becomes ' + nm(a.branch) + ')' : '') + (a.sacrifice ? ', sacrificing ' + thingName(S, a.sacrifice) : '') + (a.donor ? ' with ' + thingName(S, a.donor) : '');
    case 'attack': return thingName(S, a.subject) + ' — ' + (a.card ? c : 'Strike') + tgt;
    case 'remote': return thingName(S, a.subject) + ' — ' + c + tgt + (a.payload ? ' (payload ' + thingName(S, a.payload) + ', ' + a.mode + ')' : '');
    case 'fuse': return 'Fuse ' + nm('made.' + a.recipe) + ': ' + (a.a === 'ground' ? 'your Ground' : thingName(S, a.a)) + ' + ' + (a.b === 'ground' ? 'your Ground' : thingName(S, a.b));
    case 'ability': return thingName(S, a.subject) + ' — ' + valueLabel(S, 'ability', a.ability) + tgt + (a.branch ? ' (' + a.branch + ')' : '');
    case 'buy': return 'Buy ' + valueLabel(S, 'slot', a.slot);
    case 'catalyst': return 'Refill the catalyst';
    case 'quality': return 'Attach ' + c + tgt + (a.replace ? ', replacing ' + nm(cardWord(S, a.replace)) : '');
    case 'weather': return 'Call ' + c + ' (Weather)';
    case 'burden': return 'Lay ' + c + ' on the rival';
    case 'law': return 'Law: ' + nm(cardWord(S, a.category)) + ' + Be + ' + nm(cardWord(S, a.qual));
  }
  return a.type;
}
function costOf(S, a) {
  const p = S.players[A.C.human];
  if (a.type === 'buy') return E.priceOf(S, p.i, S.market[a.slot].word) + ' spark';
  if (a.type === 'catalyst') return '2 spark';
  if (a.type === 'fuse') { const r = R.NAMED.concat(R.INFUSIONS).find(x => x.id === a.recipe); const o = id => id === 'ground' ? p.ground : S.things.find(t => t.id === id); const pv = E.previewFusion(S, p.i, r, o(a.a), a.a === 'ground', o(a.b), a.b === 'ground'); return pv ? pv.cost + ' breath' + (pv.catalyst ? ' + catalyst' : '') : '?'; }
  if (a.type === 'ability') { const t = S.things.find(x => x.id === a.subject); return t ? E.card(t).ability.cost + ' breath' : ''; }
  if (a.type === 'law') return [a.card, a.category, a.qual].reduce((s, pid) => s + BY_ID[cardWord(S, pid)].cost, 0) + ' breath';
  if (a.card) { const w = cardWord(S, a.card); return BY_ID[w].cost + (A.C.pending && A.C.pending.type === 'respond' && A.C.pending.kind === 'response' ? ' reserve' : ' breath'); }
  if (a.type === 'attack') return '1 breath';
  return '';
}

// prediction: apply on a copy the human could build (rival hand hidden), assuming no block and no reply
function predict(a) {
  const C = A.C, S0 = C.state();
  try {
    const c = B.redact(S0, C.human);
    if (C.pending && C.pending.type === 'respond') { E.addResponse(c, C.human, a, {}); E.resolveClause(c); }
    else E.apply(c, a, { block: () => null, respond: null });
    const out = [];
    for (const p of [0, 1]) { const d = c.players[p].life - S0.players[p].life; if (d) out.push(`${p === C.human ? 'Your' : 'Rival'} life ${S0.players[p].life} → ${c.players[p].life}`); }
    for (const t of S0.things) {
      if (t.status.concealed && t.ctrl !== C.human) continue;
      const n = c.things.find(x => x.id === t.id);
      if (!n) { out.push(`${thingName(S0, t.id)} leaves play`); continue; }
      if (n.damage > t.damage) out.push(`${thingName(S0, t.id)} takes ${n.damage - t.damage} (${Math.max(0, E.remainingOf(c, n))} left)`);
      if (n.damage < t.damage) out.push(`${thingName(S0, t.id)} heals ${t.damage - n.damage}`);
      for (const k of ['wet', 'burning', 'poison', 'asleep', 'frozen', 'bound', 'ward', 'concealed', 'named', 'measured']) if (!!n.status[k] !== !!t.status[k] || (k === 'poison' && n.status[k] !== t.status[k])) out.push(`${thingName(S0, t.id)}: ${k} ${n.status[k] ? (typeof n.status[k] === 'number' ? n.status[k] : 'on') : 'off'}`);
      if (n.ctrl !== t.ctrl) out.push(`${thingName(S0, t.id)} changes control`);
      if ((n.form || n.word) !== (t.form || t.word)) out.push(`${thingName(S0, t.id)} becomes ${nm(n.form || n.word)}`);
    }
    for (const n of c.things) if (!S0.things.some(t => t.id === n.id)) out.push(`${n.ctrl === C.human ? 'You gain' : 'Rival gains'} ${nm(n.form || n.word)}${n.lineage ? ' (made: Fresh and exhausted)' : ''}`);
    const me = C.human;
    if (c.players[me].spark !== S0.players[me].spark) out.push(`Your spark ${S0.players[me].spark} → ${c.players[me].spark}`);
    if (c.players[me].hand.length !== S0.players[me].hand.length) out.push(`Your hand ${S0.players[me].hand.length} → ${c.players[me].hand.length}`);
    if (c.over != null) out.push(c.over === me ? 'You would win' : c.over === 'draw' ? 'Draw' : 'You would lose');
    return out.length ? out : ['No visible change'];
  } catch (e) { return ['Prediction unavailable: ' + e.message]; }
}

// why something cannot be chosen now — always from the engine's own explanation
function whyNot(kind, id) {
  const C = A.C, S = C.S;
  if (C.pending) return 'Answer the current prompt first.';
  if (S.over != null) return 'The match is over.';
  if (S.active !== C.human) return 'It is the rival\'s turn.';
  if (kind === 'card') {
    const c = S.players[C.human].hand.find(x => x.pid === id); if (!c) return '';
    const d = BY_ID[c.word];
    const guess = { thing: 'deploy', ground: 'ground', quality: 'quality', weather: 'weather', burden: 'burden', category: 'spell', spell: 'spell' }[d.type];
    if (d.type === 'action') {
      const mine = S.things.filter(t => t.ctrl === C.human);
      if (!mine.length) return `${nm(c.word)} needs a Thing of yours to say it, and you have none.`;
      const p = S.players[C.human];
      if (d.cost + (d.verb in { strike: 1, bite: 1, crush: 1, cut: 1 } ? 0 : 0) > p.breath) return `${nm(c.word)} costs ${d.cost} breath; you have ${p.breath}.`;
      return `${nm(c.word)} is said by one of your Things. ` + mine.map(t => { const r = actorWhy(S, t); if (r) return `${nm(t.form || t.word)} ${r}`; if (!E.caps(S, t).has(d.verb)) return `${nm(t.form || t.word)} cannot ${d.verb} (it lacks that ability)`; return `${nm(t.form || t.word)} has no legal target for ${nm(c.word)} right now`; }).join('; ') + '.';
    }
    if (d.spell === 'be') return 'Be is only spoken as a Law: Category + Be + a Lawful Quality, all in hand and affordable.';
    const r = E.whyIllegal(S, { type: guess, card: c.pid });
    return r && r !== 'not a legal sentence now' ? r : `${nm(c.word)} has no legal target or use right now.`;
  }
  if (kind === 'thing') {
    const t = S.things.find(x => x.id === id); if (!t) return '';
    if (t.ctrl !== C.human) return `Nothing you can do right now targets ${thingName(S, t.id)}.`;
    if (E.trait(S, t, 'carrier')) { const hs = S.things.filter(h => h.ctrl === C.human && E.trait(S, h, 'pollination')); if (hs.length) return hs.map(h => `${nm(h.form || h.word)}: ${E.pollinationWhy(S, t, h) || 'can pollinate'}`).join('; '); }
    return thingWhy(S, t);
  }
  if (kind === 'target') {
    const sel = selection(); if (!sel.cands.length || !sel.next) return '';
    const hyp = { ...sel.cands[0], [sel.next]: id };
    return E.whyIllegal(S, hyp) || 'Not a legal choice for this sentence.';
  }
  return '';
}

// Plain reasons why one of your Things cannot act now (null = it can)
function actorWhy(S, t) {
  const st = t.status;
  if (st.asleep) return 'is Asleep'; if (st.frozen) return 'is Frozen'; if (st.bound) return 'is Bound';
  if (t.fresh && !E.has(S, t, 'swift')) return 'arrived this turn (Fresh) and can act from your next turn';
  if (t.exhausted) return 'is exhausted: it has already acted or blocked this turn';
  return null;
}
function thingWhy(S, t) {
  const p = S.players[A.C.human], n = nm(t.form || t.word), id = t.form || t.word;
  if (id === 'token.fruit') {
    const r = actorWhy(S, t); if (r) return `This Fruit ${r}. (To spend it on Feast, choose Feast from your hand.)`;
    if (p.breath < 1) return 'Eating a Fruit costs 1 breath; you have none left.';
    if (p.life >= 30 && !S.things.some(o => o.ctrl === A.C.human && o.status.poison)) return 'Eating a Fruit heals 2 life or cures 1 poison: your life is full and nothing of yours is poisoned. You can keep it to block, or spend it on Feast.';
  }
  const r = actorWhy(S, t); if (r) return `${n} ${r}.`;
  if (!E.caps(S, t).has('strike')) return `${n} has no Body, so it cannot Strike.${E.card(t).ability ? '' : ' It can still block.'}`;
  if (p.breath < 1) return `A Strike costs 1 breath; you have none left.`;
  const w = E.whyIllegal(S, { type: 'attack', subject: t.id, verb: 'strike', target: 'rival' });
  return w && w !== 'not a legal sentence now' ? `${n}: ${w}.` : `${n} has no legal action right now.`;
}

// ---------- card rendering ----------
const ICON = { str: '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M13 1.5 6.2 8.3l1.5 1.5L14.5 3V1.5zM3 9.7l1.2-1.2 3.3 3.3L6.3 13l-1-1-2 2-1.3-1.3 2-2z" fill="currentColor"/></svg>', std: '<svg class="ic" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 2.5 3v4.3C2.5 11 5 13.6 8 15c3-1.4 5.5-4 5.5-7.7V3z" fill="currentColor"/></svg>' };
function statusChips(S, t) {
  const st = t.status, out = [];
  if (t.exhausted) out.push(['Exhausted', 'x']); else if (t.fresh && !E.has(S, t, 'swift')) out.push(['Fresh', 'f']);
  if (E.has(S, t, 'guard')) out.push(['Guard', 'k']); if (E.has(S, t, 'flying')) out.push(['Flying', 'k']); else if (E.has(S, t, 'reach')) out.push(['Reach', 'k']);
  if (E.has(S, t, 'heavy')) out.push(['Heavy', 'k']); if (E.has(S, t, 'venomous')) out.push(['Venom', 'k']);
  if (st.burning) out.push(['Burning ' + st.burning, 'b']); if (st.poison) out.push(['Poison ' + st.poison, 'b']); if (st.wet) out.push(['Wet', 'c']);
  if (st.asleep) out.push(['Asleep', 'b']); if (st.frozen) out.push(['Frozen', 'b']); if (st.bound) out.push(['Bound', 'b']); if (st.ward) out.push(['Ward', 'c']);
  if (st.named) out.push(['Named', 'c']); if (st.measured) out.push(['Measured', 'c']); if (st.concealed) out.push(['Concealed', 'c']);
  if (t.ctrl !== t.owner) out.push(['Borrowed', 'c']);
  for (const q of t.quals || []) out.push([nm(q.word), 'q']);
  if (t.lawQual) out.push(['Law: ' + nm(t.lawQual), 'q']);
  for (const [k, v] of Object.entries(t.counters || {})) if (v && k !== 'age') out.push([`${k[0].toUpperCase() + k.slice(1)} ${v}`, 'c']);
  if (t.counters && t.counters.age) out.push(['Age ' + t.counters.age, 'c']);
  return out.map(([l, k]) => `<span class="chip ${k}">${esc(l)}</span>`).join('');
}
const artKey = id => String(id).split('.').pop();
function artWindow(id, name, text) {
  const s = schoolOf(id), k = artKey(id);
  if (text != null && A.view === 'text') return `<div class="art s-${s} txt"><span class="rtx">${esc(text)}</span></div>`;
  if (ART.has(k)) return `<div class="art s-${s} pic"><img src="assets/art/${k}.webp" alt="" loading="lazy" decoding="async"></div>`;
  if (text != null) return `<div class="art s-${s} txt"><span class="rtx">${esc(text)}</span><span class="pending">art pending</span></div>`;
  return `<div class="art s-${s}"><span class="glyph" aria-hidden="true">${esc(name.slice(0, 1))}</span><span class="pending">art pending</span></div>`;
}
const rulesBox = id => (A.view === 'text' || !ART.has(artKey(id)) ? propLine(id) : textOf(id));
function propLine(id) { const d = BY_ID[id]; return d && d.props && d.props.length ? d.props.join(' · ') : (d && d.kw ? d.kw.join(' · ') : ''); }
function thingCard(S, t, o = {}) {
  const hidden = t.status.concealed && t.ctrl !== A.C.human;
  const cls = ['card', 'board', t.exhausted ? 'exh' : '', o.hi ? 'hi' : '', o.sel ? 'sel' : '', o.dim ? 'dim' : ''].join(' ');
  if (hidden) return `<button class="${cls} back" data-thing="${esc(t.id)}" aria-label="Concealed rival Thing"><span class="backmark">Concealed</span>${o.hi ? '<span class="pick">Choose</span>' : ''}</button>`;
  const id = t.form || t.word, d = E.card(t), s = d.school || 'word';
  const rem = E.remainingOf(S, t), max = E.standOf(S, t);
  return `<button class="${cls}" data-thing="${esc(t.id)}" aria-label="${esc(nm(id))}, strike ${E.curStrike(S, t)}, stand ${rem} of ${max}${t.exhausted ? ', exhausted' : ''}">
    <img class="frame" src="assets/frames/short_${s}.webp" alt="">
    <span class="nm">${esc(nm(id))}</span><span class="gem">${d.made || d.token ? '' : d.cost}</span>
    ${artWindow(id, nm(id))}
    <span class="chips">${statusChips(S, t)}</span>
    <span class="stats"><span class="st s1">${ICON.str}${E.curStrike(S, t)}</span><span class="st s2${t.damage ? ' hurt' : ''}">${ICON.std}${rem}/${max}</span></span>
    ${o.hi ? '<span class="pick">Choose</span>' : ''}
    <span class="info" data-inspect-thing="${esc(t.id)}" role="button" tabindex="0" aria-label="Inspect ${esc(nm(id))}">i</span>
  </button>`;
}
function handCard(S, c, o = {}) {
  const d = BY_ID[c.word], s = d.school;
  const typeLine = TYPE_NAME[d.type] + (d.r ? ' · Response' : '') + (d.type === 'thing' ? ` · ${d.strike}/${d.stand}` : d.type === 'ground' ? ` · stand ${d.stand}` : '');
  const cls = ['card', 'hand', o.hi ? 'hi' : '', o.sel ? 'sel' : '', o.dim ? 'dim' : ''].join(' ');
  return `<button class="${cls}" data-card="${esc(c.pid)}" title="${esc(nm(c.word) + ' — ' + textOf(c.word))}" aria-label="${esc(nm(c.word))}, ${esc(typeLine)}, cost ${d.cost}. ${esc(textOf(c.word))}">
    <img class="frame" src="assets/frames/tall_${s}.webp" alt="">
    <span class="nm">${esc(nm(c.word))}</span><span class="gem">${d.cost}</span>
    ${artWindow(c.word, nm(c.word), textOf(c.word))}
    <span class="tl">${esc(typeLine)}</span><span class="rt${A.view !== 'text' && ART.has(artKey(c.word)) ? ' clamp' : ''}">${esc(rulesBox(c.word))}</span>
    ${o.hi ? '<span class="pick">Choose</span>' : ''}
    <span class="info" data-inspect-word="${esc(c.word)}" role="button" tabindex="0" aria-label="Inspect ${esc(nm(c.word))}">i</span>
  </button>`;
}

// ---------- render ----------
const root = () => document.getElementById('app');
function render() {
  if (A.screen === 'lobby') return renderLobby();
  if (A.screen === 'editor') return renderEditor();
  if (A.screen === 'fixtures') return renderFixtures();
  renderMatch();
  if (A.inspect) renderInspect();
  if (A.modal) renderModal();
  driveBot();
}

function renderLobby() {
  const decks = allDecks(), groups = [...new Set(decks.map(d => d.group))];
  const opts = sel => groups.map(g => `<optgroup label="${esc(g)}">${decks.filter(d => d.group === g).map(d => `<option value="${esc(d.id)}"${d.id === sel ? ' selected' : ''}>${esc(d.label)}</option>`).join('')}</optgroup>`).join('');
  const last = store.get('wa30.last');
  root().innerHTML = `<main class="lobby">
    <header class="lob-head"><h1>The Crucible</h1><p>${esc(VERSION)} · experimental rules <b>${esc(lobby.format)}</b>. Separate from the live game: nothing here touches your V28 collection.</p></header>
    <form id="lob" class="lob-grid">
      <label>Your deck<select id="l-mine">${opts(lobby.mine)}</select></label>
      <label>Rival deck<select id="l-theirs">${opts(lobby.theirs)}</select></label>
      <label>Rival skill<select id="l-tier">${TIERS.map(t => `<option${t === lobby.tier ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
      <label>Rival style<select id="l-style">${['careful', 'aggressive'].map(t => `<option${t === lobby.style ? ' selected' : ''}>${t}</option>`).join('')}</select></label>
      <label>Rival responses<select id="l-ra">${[['ra', 'Response-aware (holds reserve, answers)'], ['', 'Reference (rarely responds)']].map(([v, l]) => `<option value="${v}"${v === lobby.ra ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
      <label>Your seat<select id="l-seat">${[['first', 'You start'], ['second', 'Rival starts'], ['random', 'Seed decides']].map(([v, l]) => `<option value="${v}"${v === lobby.seat ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
      <label>Seed<span class="inrow"><input id="l-seed" type="number" inputmode="numeric" value="${esc(lobby.seed)}"><button type="button" id="l-dice" class="ghost">New</button></span></label>
      <label class="wide">Rules version<select id="l-format">${FMT_GROUPS.map(([g, list]) => `<optgroup label="${esc(g)}">${list.map(([k, l]) => `<option value="${k}"${k === lobby.format ? ' selected' : ''}>${esc(l)} · ${esc(F.resolveFormat(k).version)}</option>`).join('')}</optgroup>`).join('')}</select></label>
      <p class="wide small">For the market comparison, play the same decks and seed once with <b>Original market</b> and once with <b>Market at 3/4 spark</b>.</p>
      <div class="wide btns"><button type="button" id="l-start" class="go">Start match</button>
      ${last ? `<button type="button" id="l-resume">Resume last match${last.result != null ? ' (finished — review)' : ''}</button>` : ''}
      <button type="button" id="l-editor">Deck editor</button><button type="button" id="l-fix">Scenario fixtures</button><button type="button" id="l-load">Load a replay</button></div>
    </form>
    <section class="lob-decks"><h2>${esc(deckById(lobby.mine).label)}</h2><p class="dl">${deckById(lobby.mine).words.map(w => `<span class="dot s-${schoolOf(w)}"></span>${esc(nm(w))}`).join(' ')}</p>
    <h2>${esc(deckById(lobby.theirs).label)}</h2><p class="dl">${deckById(lobby.theirs).words.map(w => `<span class="dot s-${schoolOf(w)}"></span>${esc(nm(w))}`).join(' ')}</p></section>
  </main>`;
  const upd = () => { Object.assign(lobby, { mine: v('l-mine'), theirs: v('l-theirs'), tier: v('l-tier'), style: v('l-style'), seat: v('l-seat'), seed: +v('l-seed') || 1, format: v('l-format'), ra: v('l-ra') }); store.set('wa30.lobby', lobby); };
  const v = id => document.getElementById(id).value;
  for (const id of ['l-mine', 'l-theirs', 'l-tier', 'l-style', 'l-ra', 'l-seat', 'l-seed', 'l-format']) document.getElementById(id).addEventListener('change', () => { upd(); if (id === 'l-mine' || id === 'l-theirs') renderLobby(); });
  document.getElementById('l-dice').onclick = () => { document.getElementById('l-seed').value = 1 + Math.floor(Math.random() * 99999); upd(); };
  // artifact frames are sandboxed without form submission, so the form never submits: Start is a plain button
  document.getElementById('lob').onsubmit = e => { e.preventDefault(); };
  document.getElementById('l-start').onclick = () => { upd(); startMatch(); };
  document.getElementById('l-editor').onclick = () => { A.screen = 'editor'; A.ed = A.ed || { words: deckById(lobby.mine).words.slice(), name: 'My test deck', filter: 'all', q: '' }; render(); };
  document.getElementById('l-fix').onclick = () => { A.screen = 'fixtures'; render(); };
  document.getElementById('l-load').onclick = () => { A.screen = 'match'; A.modal = { kind: 'load' }; if (!A.C) { A.screen = 'lobby'; } render(); if (!A.C) renderModalOver(); };
  if (last) document.getElementById('l-resume').onclick = () => resumeFrom(last, last.result != null);
}
function renderModalOver() { A.modal = { kind: 'load' }; renderModal(); }

function resumeFrom(rep, review) {
  stopBot();
  try {
    const cfg = { format: rep.format, decks: rep.decks, seed: rep.seed, first: rep.first, humanSide: rep.humanSide || 0, botPolicy: rep.botPolicy, deckNames: rep.deckNames || ['', ''], fixture: rep.fixture ? FIXTURES[rep.fixture] : null };
    A.cfg = cfg;
    A.C = restoreController(rep, hooks, FIXTURES);
    A.review = review ? { rep, k: A.C.restoredActs, total: A.C.totalActs } : null;
    A.screen = 'match'; A.sel = null; A.modal = null; render();
  } catch (e) { A.flash = 'Could not load that replay: ' + e.message; A.screen = 'lobby'; render(); }
}
function reviewTo(k) {
  const rep = A.review.rep; k = Math.max(0, Math.min(A.review.total, k));
  A.C = restoreController(rep, hooks, FIXTURES, k); A.review.k = A.C.restoredActs; render();
}

function infoStrip(S, side) {
  const p = S.players[side], me = side === A.C.human;
  const it = (label, val, extra = '') => `<span class="pip${extra}"><b>${esc(val)}</b><small>${esc(label)}</small></span>`;
  return `<div class="strip ${me ? 'me' : 'them'}${S.active === side ? ' active' : ''}" data-rival="${me ? '' : 'rival'}">
    <span class="who">${me ? 'You' : 'Rival'}${S.first === side ? ' · started' : ''}${S.active === side && S.over == null ? ' · to act' : ''}</span>
    <button class="life${me ? '' : ' tgt'}" data-target="${me ? 'self' : 'rival'}" aria-label="${me ? 'Your' : 'Rival'} life ${p.life}"><b>${p.life}</b><small>life</small></button>
    ${it('breath', p.breath)}${it('reserve', p.reserve)}${it('spark', p.spark + '/5')}${it('catalyst', p.catalyst)}
    ${it('hand', p.hand.length)}${it('deck', p.deck.length)}
    <button class="pip lnk" data-zone="grave:${side}"><b>${p.grave.length}</b><small>grave</small></button><button class="pip lnk" data-zone="sealed:${side}"><b>${p.sealed.length}</b><small>sealed</small></button>
    ${p.poison ? it('poison', p.poison, ' bad') : ''}${p.burden ? `<span class="pip bad"><b>${esc(nm(p.burden.word))}</b><small>burden ×${p.burden.ticks}</small></span>` : ''}
    ${p.fatigue ? it('fatigue', p.fatigue, ' bad') : ''}<span class="schools">${p.schools.map(s => `<span class="dot s-${s}" title="${SCHOOL_NAME[s]}"></span>${SCHOOL_NAME[s]}`).join(' ')}</span>
  </div>`;
}
function groundSlot(S, side, hiSet) {
  const g = S.players[side].ground, me = side === A.C.human;
  if (!g) return `<div class="slot ground empty"><span>Ground</span></div>`;
  const d = BY_ID[g.word];
  const hi = (me && hiSet.has('ground')) || (!me && hiSet.has('ground') && !me);
  return `<button class="slot ground card board${hi ? ' hi' : ''}" data-ground="${side}"><img class="frame" src="assets/frames/short_${d.school}.webp" alt=""><span class="nm">${esc(nm(g.word))}</span><span class="gem">${d.cost}</span>${artWindow(g.word, nm(g.word))}<span class="stats"><span class="st s2${g.damage ? ' hurt' : ''}">${ICON.std}${d.stand - (g.damage || 0)}/${d.stand}</span></span>${hi ? '<span class="pick">Choose</span>' : ''}<span class="info" data-inspect-word="${esc(g.word)}" role="button" tabindex="0" aria-label="Inspect ${esc(nm(g.word))}">i</span></button>`;
}
function row(S, side, sel, hiSet) {
  const things = S.things.filter(t => t.ctrl === side);
  const slots = [];
  for (let k = 0; k < E.FORMAT.slots; k++) {
    const t = things[k];
    if (!t) { slots.push('<div class="slot empty"><span>Empty slot</span></div>'); continue; }
    const isSel = A.sel && A.sel.anchor && A.sel.anchor.kind === 'thing' && A.sel.anchor.id === t.id;
    const fixedVals = A.sel ? Object.values(A.sel.fixed) : [];
    slots.push(`<div class="slot">${thingCard(S, t, { hi: hiSet.has(t.id), sel: isSel || fixedVals.includes(J(t.id)) })}</div>`);
  }
  return `<div class="row ${side === A.C.human ? 'mine' : 'theirs'}">${groundSlot(S, side, side === A.C.human ? hiSet : new Set(hiSet.has('ground') && A.sel && A.sel.anchor && A.sel.anchor.kind !== 'vessel' && A.sel.anchor.kind !== 'ground' ? ['ground'] : []))}${slots.join('')}</div>`;
}

function renderMatch() {
  const C = A.C, S = C.state(); if (!S) { root().innerHTML = '<main class="lobby"><p>Starting…</p></main>'; if (C.pending) renderPromptOnly(); return; }
  const me = C.human, them = 1 - me;
  for (const t of S.things) if (!(t.status.concealed && t.ctrl !== me)) A.names[t.id] = nm(t.form || t.word) + (t.ctrl === me ? '' : ' (rival)');
  const sel = selection(), hiSet = boardTargets(sel);
  if (C.pending && C.pending.type === 'block') for (const id of C.pending.candidates) hiSet.add(id);
  if (C.pending && C.pending.type === 'decide' && ['poisonTarget', 'waterGround'].includes(C.pending.kind)) for (const id of C.pending.options) hiSet.add(id);
  const handHi = new Set(); for (const a of sel.all) { if (a.card) handHi.add(a.card); if (a.category) handHi.add(a.category); if (a.qual) handHi.add(a.qual); }
  const vesselN = sel.all.filter(a => a.type === 'fuse').length;
  const fmt = F.resolveFormat(A.cfg.format);
  root().innerHTML = `<div class="match">
  <header class="top">
    <button class="ghost" id="m-lobby">Lobby</button>
    <span class="title">The Crucible <small>${esc(A.cfg.fixture ? 'Fixture: ' + A.cfg.fixture.title : (A.cfg.deckNames || []).join(' vs '))}</small></span>
    <span class="meta">${esc(A.cfg.format)} ${esc(fmt.version)} · seed ${esc(A.cfg.seed)} · round ${S.round} · turn ${S.turn}${A.review ? ' · reviewing' : ''}</span>
    <label class="tog">Cards <select id="m-view"><option value="art"${A.view !== 'text' ? ' selected' : ''}>Art</option><option value="text"${A.view === 'text' ? ' selected' : ''}>Large text</option></select></label>
    <label class="tog"><input type="checkbox" id="m-autopass"${C.auto.passAll ? ' checked' : ''}> Auto-pass my responses</label>
    <label class="tog">Rival speed <select id="m-speed">${[[250, 'fast'], [600, 'normal'], [1100, 'slow']].map(([v, l]) => `<option value="${v}"${A.speed === v ? ' selected' : ''}>${l}</option>`).join('')}</select></label>
    <button class="ghost" id="m-export">Export replay</button><button class="ghost" id="m-rematch">Rematch</button><button class="ghost" id="m-swap">Swap seats</button>
  </header>
  ${A.review ? `<div class="reviewbar"><button id="rv-0">Start</button><button id="rv-p">Back</button><span>Action ${A.review.k} of ${A.review.total}</span><button id="rv-n">Forward</button><button id="rv-e">End</button>${A.C.S.over == null ? '<button id="rv-play" class="go">Play on from here</button>' : ''}</div>` : ''}
  <div class="main">
    <section class="board" aria-label="Board">
      ${infoStrip(S, them)}
      <div class="hand theirs">${S.players[them].hand.map(() => '<span class="cardback" aria-hidden="true"></span>').join('')}<span class="sr">${S.players[them].hand.length} cards in the rival's hand</span></div>
      ${row(S, them, sel, hiSet)}
      <div class="mid">${centre(S)}</div>
      ${row(S, me, sel, hiSet)}
      ${infoStrip(S, me)}
      <div class="hand mine">${S.players[me].hand.map(c => handCard(S, c, { hi: handHi.has(c.pid) && !A.sel, sel: A.sel && A.sel.anchor && A.sel.anchor.id === c.pid, dim: !handHi.has(c.pid) && !C.pending })).join('') || '<span class="empty">Your hand is empty.</span>'}</div>
    </section>
    <aside class="side">
      <div class="panel act" aria-live="polite">${actionPanel(S, sel, vesselN)}</div>
      <div class="panel market"><h3>Market</h3>${marketHTML(S, sel)}</div>
      <div class="panel chron"><h3>Chronicle</h3>${chronicleHTML()}</div>
    </aside>
  </div></div>`;
  bindMatch();
}
function renderPromptOnly() { if (A.C.pending && A.C.pending.type === 'mulligan') { A.modal = null; root().innerHTML = `<div class="match"><div class="main"><section class="board">${mulliganHTML()}</section></div></div>`; bindMatch(); } }

function centre(S) {
  const bits = [];
  if (S.sky) bits.push(`<span class="weather s-${schoolOf(S.sky.word)}"><b>Weather: ${esc(nm(S.sky.word))}</b> <small>called by ${who(S.sky.caster)}, ends at their turn ${S.sky.until}</small> <button class="lnk" data-inspect-word="${esc(S.sky.word)}">Read</button></span>`);
  if (S.law) bits.push(`<span class="weather"><b>Law: every ${esc(S.law.category)} has ${esc(nm(S.law.qual))}</b> <small>by ${who(S.law.caster)}, ends at their turn ${S.law.until}</small></span>`);
  if (S.clause && S.clause.nodes.length) {
    bits.push(`<div class="clause"><b>Pending sentence${S.clause.nodes.length > 1 ? 's — resolve last to first' : ''}</b><ol>${S.clause.nodes.map((n, k) => `<li class="${n.side === A.C.human ? 'me' : 'them'}"><span>${k === 0 ? 'Declared' : k === 1 ? 'Response' : 'Answer'} · ${who(n.side)}:</span> ${esc(describe(S, n.act, n.side))}${n.act.type === 'attack' ? ` <small>${n.blocker ? 'blocked by ' + esc(thingName(S, n.blocker)) : n.retaliates ? 'target will strike back' : 'unblocked'}</small>` : ''}${n.cancelled ? ' <small class="bad">cancelled</small>' : ''}</li>`).join('')}</ol></div>`);
  }
  if (S.over != null) bits.push(`<span class="result">${S.over === A.C.human ? 'You win' : S.over === 'draw' ? 'Draw' : 'The rival wins'} — round ${S.round}</span>`);
  if (!bits.length) bits.push(`<span class="turn">${S.active === A.C.human ? 'Your turn' : 'Rival\'s turn'} · round ${S.round}</span>`);
  return bits.join('');
}

function actionPanel(S, sel, vesselN) {
  const C = A.C;
  const flash = A.flash ? `<p class="flash">${esc(A.flash)}</p>` : '';
  if (A.review) return `<h3>Review</h3><p>Step through the recorded actions with the bar above. "Play on" continues as yourself from this point.</p>`;
  if (C.pending) return flash + promptHTML(S, sel);
  if (S.over != null) return flash + summaryHTML(S);
  if (S.active !== C.human) return flash + `<h3>Rival is thinking…</h3><p>${A.botTimer ? 'Its next sentence follows shortly.' : ''}</p>`;
  const p = S.players[C.human];
  if (!A.sel) {
    return flash + `<h3>Your turn</h3>
      <p>Choose a highlighted word in your hand, one of your Things, a market offer or the Vessel. ${A.why ? `<span class="why">${esc(A.why)}</span>` : ''}</p>
      <div class="btns"><button id="a-vessel"${vesselN ? '' : ' disabled'}>Vessel — fuse${vesselN ? ` (${vesselN})` : ''}</button>${sel.all.some(a => a.type === 'catalyst') ? '<button id="a-cat">Refill catalyst</button>' : ''}
      <button id="a-end" class="go">End turn${p.breath ? ` — keep ${Math.min(S.rules.reserveCap, p.breath)} reserve` : ''}</button></div>
      ${vesselN ? '' : '<p class="small">Vessel: no recipe has two ready, owned ingredients with at least one mature Thing, affordable now.</p>'}`;
  }
  return flash + builderHTML(S, sel, false);
}
function builderHTML(S, sel, inPrompt) {
  const fixed = Object.entries(A.sel.fixed).map(([k, v]) => `<li><span>${esc(KEY_LABEL[k] || k)}</span> ${esc(valueLabel(S, k, JSON.parse(v)))}</li>`).join('');
  const anchor = A.sel.anchor;
  const head = anchor ? (anchor.kind === 'card' ? nm(cardWord(S, anchor.id)) : anchor.kind === 'thing' ? thingName(S, anchor.id) : anchor.kind === 'foe' ? 'Ways to act on ' + thingName(S, anchor.id) : anchor.kind === 'vessel' ? 'The Vessel' : anchor.kind === 'market' ? 'Market offer' : anchor.kind === 'ground' ? 'Your Ground' : '') : '';
  const aw = anchor && anchor.kind === 'card' ? cardWord(S, anchor.id) : anchor && anchor.kind === 'thing' ? (S.things.find(t => t.id === anchor.id) || {}).form || (S.things.find(t => t.id === anchor.id) || {}).word : null;
  const reader = aw && BY_ID[aw] ? `<p class="reader">${esc(textOf(aw))}</p>` : '';
  if (!sel.cands.length) return `<h3>${esc(head)}</h3>${reader}<p class="why">${esc(A.why || 'Nothing legal to do with this now.')}</p><div class="btns"><button id="a-cancel">Back</button></div>`;
  let body = '';
  if (sel.next) {
    body = `<p class="step">${esc(KEY_LABEL[sel.next] || sel.next)}${boardTargets(sel).size ? ' — click a highlighted card or choose below' : ''}</p>
      <div class="choices">${sel.choices.map(v => `<button data-choose="${esc(J(v))}">${esc(sel.next === 'type' ? valueLabel(S, 'type', v) + ' — ' + describe(S, sel.cands.find(a => J(a.type) === J(v))) : valueLabel(S, sel.next, v))}</button>`).join('')}</div>
      ${A.why ? `<p class="why">${esc(A.why)}</p>` : ''}`;
  } else {
    const a = sel.cands[0];
    body = `<p class="sentence">${esc(describe(S, a))}</p><p class="cost">Cost: ${esc(costOf(S, a) || 'none')}</p>
      <div class="pred"><b>If ${inPrompt ? 'nothing else answers' : 'unblocked and unanswered'}:</b><ul>${predict(a).map(x => `<li>${esc(x)}</li>`).join('')}</ul><small>A legal declaration is not a guaranteed outcome: blocks, responses and revalidation can change it.</small></div>
      <div class="btns"><button id="a-confirm" class="go">${inPrompt ? 'Respond' : 'Declare'}</button></div>`;
  }
  return `<h3>${esc(head)}</h3>${reader}${fixed ? `<ul class="fixed">${fixed}</ul>` : ''}${body}<div class="btns"><button id="a-cancel">Back</button></div>`;
}
function promptHTML(S, sel) {
  const q = A.C.pending;
  if (q.type === 'mulligan') return mulliganHTML();
  if (q.type === 'block') {
    const att = S.things.find(t => t.id === q.attacker);
    const tgt = q.target === 'rival' ? 'you' : q.target === 'ground' ? 'your Ground' : thingName(S, q.target);
    const dmg = att ? E.curStrike(S, att) + (q.bonus || 0) : '?';
    const others = S.things.filter(t => t.ctrl === A.C.human && !q.candidates.includes(t.id));
    return `<h3>Block?</h3><p><b>${esc(att ? thingName(S, att.id) : 'An attacker')}</b> attacks ${esc(tgt)} with ${esc(q.verb)} for ${dmg}. Choose a blocker before any response. A blocker exhausts now and still strikes back.</p>
      <div class="choices">${q.candidates.map(id => { const b = S.things.find(t => t.id === id); return `<button data-block="${esc(id)}">${esc(thingName(S, id))} — ${E.curStrike(S, b)} strike, ${E.remainingOf(S, b)} stand left</button>`; }).join('')}<button data-block="null">No block</button></div>
      ${others.length ? `<p class="small">Cannot block: ${others.map(t => esc(nm(t.form || t.word)) + ' (' + esc(blockReason(S, t, att, q)) + ')').join('; ')}.</p>` : ''}`;
  }
  if (q.type === 'respond') {
    const r = S.players[A.C.human];
    const head = q.kind === 'response' ? `<h3>Respond?</h3><p>Pay from reserve (${r.reserve}). One response, then the attacker may answer once.</p>` : `<h3>Answer?</h3><p>The rival responded. You may answer once, paying from breath (${r.breath}).</p>`;
    if (A.sel) return head + builderHTML(S, sel, true);
    return head + `<div class="choices">${q.options.map((a, k) => `<button data-respond="${k}">${esc(describe(S, a))} · ${esc(costOf(S, a))}</button>`).join('')}<button data-respond="pass" class="go">Pass</button></div>`;
  }
  if (q.type === 'decide') {
    const lbl = o => {
      if (q.kind === 'reorder') return 'Top: ' + o.map(nm).join(', then ');
      if (Array.isArray(o)) return o.map(nm).join(', ');
      if (S.things.some(t => t.id === o)) return thingName(S, o);
      if (BY_ID[o]) return nm(o);
      return { draw: 'Draw 1', breath: '1 extra breath', spark: 'Pay 1 spark', life: 'Lose 1 life', none: 'Reveal nothing' }[o] || String(o);
    };
    const title = { poisonTarget: 'Choose who takes the poison', select: 'Choose a word to take', reorder: 'Order the top of your deck', silence: 'Choose a word to discard from the rival\'s revealed hand', stoneUpkeep: 'Philosopher\'s Stone', waterGround: 'Water Ground: choose a friendly Thing to make Wet and heal 1', debt: 'Debt: pay', owlReveal: 'Owl: reveal a Concealed Thing?', rustBranch: 'Rust: regress to' }[q.kind] || q.kind;
    return `<h3>${esc(title)}</h3><div class="choices">${q.options.map((o, k) => `<button data-decide="${k}"${k === q.dflt ? ' class="go"' : ''}>${esc(lbl(o))}</button>`).join('')}</div>`;
  }
  return '';
}
function blockReason(S, b, att, q) {
  if (b.exhausted) return 'exhausted';
  if (E.incapacitated(b)) return 'cannot act';
  if (q.target !== 'rival' && !E.has(S, b, 'guard')) return 'needs Guard to protect another';
  if (att && E.has(S, att, 'flying') && !E.has(S, b, 'flying') && !E.has(S, b, 'reach')) return 'the attacker flies; needs Flying or Reach';
  if (b.id === q.target) return 'it is the target';
  return 'not eligible';
}
function mulliganHTML() {
  const q = A.C.pending; A.mull = A.mull || new Set();
  return `<div class="mull"><h2>Opening hand</h2><p>Choose any words to set aside. You draw that many replacements; the set-aside words shuffle back into your deck. One mulligan only.</p>
    <div class="hand mine">${q.hand.map(c => `<span class="mwrap${A.mull.has(c.pid) ? ' out' : ''}">${handCard({}, c, { sel: A.mull.has(c.pid) }).replace('data-card=', 'data-mull=')}</span>`).join('')}</div>
    <div class="btns"><button id="mu-keep" class="go">${A.mull.size ? `Set aside ${A.mull.size} and draw` : 'Keep this hand'}</button></div></div>`;
}
function marketHTML(S, sel) {
  if (!S.market.length) return '<p class="small">No market in this mode.</p>';
  const buys = new Set(sel.all.filter(a => a.type === 'buy').map(a => a.slot));
  const p = S.players[A.C.human];
  return `<ul class="mkt">${S.market.map((o, k) => o ? `<li><span class="dot s-${schoolOf(o.word)}"></span><button class="lnk" data-inspect-word="${esc(o.word)}">${esc(nm(o.word))}</button><small>${esc(TYPE_NAME[BY_ID[o.word].type])} · ${BY_ID[o.word].cost}</small><span class="price">${E.priceOf(S, p.i, o.word)} spark</span>${buys.has(k) ? `<button data-buy="${k}">Buy</button>` : ''}</li>` : `<li class="emptyo">Empty until the next market step</li>`).join('')}</ul>
    <p class="small">Own school 2 spark, other schools 3 (once per duel). One purchase or catalyst refill per turn. Refresh at rounds 3, 6, 9, 12, 15.</p>`;
}
function prettify(line) {
  const me = A.C.human;
  return line.replace(/\b(fire|water|air|earth|life|rot|word|made|token)\.[a-z_]+/g, m => nm(m)).replace(/\bP([01])\b/g, (m, d) => (+d === me ? 'You' : 'Rival'))
    .replace(/\bYou (is|has|[a-z]+?)(?=[ .,:;!]|$)/g, (m, v) => 'You ' + (v === 'is' ? 'are' : v === 'has' ? 'have' : /(ch|sh|ss|x)es$/.test(v) ? v.slice(0, -2) : /[^s]s$/.test(v) ? v.slice(0, -1) : v))
    .replace(/\bt\d+\b/g, m => A.names[m] || 'a Thing');
}
function chronicleHTML() {
  const ch = A.C.chronicle.slice(-60).reverse();
  if (!ch.length) return '<p class="small">Sentences and their results appear here.</p>';
  const S = A.C.state();
  return `<ol class="chron">${ch.map(e => `<li class="${e.actor === A.C.human ? 'me' : 'them'}"><span class="when">R${e.round}</span> <b>${who(e.actor)}</b>: ${esc(e.act.type === 'pass' ? 'ends the turn' : describe(S, e.act, e.actor))}
    ${e.lines.length ? `<div class="lines">${e.lines.map(l => `<span>${esc(prettify(l))}</span>`).join('')}</div>` : ''}
    ${(e.events || []).filter(x => x.type === 'failed' || x.type === 'cancelled' || x.type === 'ward' || x.type === 'rebirth').map(x => `<span class="bad">${esc({ failed: 'A sentence failed on revalidation (target or subject gone); costs stay paid.', cancelled: 'A sentence was cancelled.', ward: 'Ward absorbed a hostile effect.', rebirth: 'Phoenix was reborn.' }[x.type])}</span>`).join('')}
    ${e.packets.length ? `<details><summary>Damage arithmetic</summary>${e.packets.map(p => `<div>${esc(p.verb)} → ${p.to}: ${p.steps.map(s => esc(s[0]) + ' ' + s[1]).join(', ')} = <b>${p.n}</b></div>`).join('')}</details>` : ''}</li>`).join('')}</ol>`;
}
function summaryHTML(S) {
  const me = A.C.human, res = S.stats.res;
  const lost = i => Object.entries(res[i].lifeLost).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ') || 'none';
  const t = res.map(r => r);
  return `<h3>${S.over === me ? 'You win' : S.over === 'draw' ? 'Draw' : 'The rival wins'}</h3>
    <p>Round ${S.round}, ${S.turn} turns. ${esc(A.cfg.format)}, seed ${esc(A.cfg.seed)}.</p>
    <table class="sum"><thead><tr><th></th><th>You</th><th>Rival</th></tr></thead><tbody>
    <tr><td>Life lost to</td><td>${esc(lost(me))}</td><td>${esc(lost(1 - me))}</td></tr>
    <tr><td>Breath spent / wasted</td><td>${t[me].breathSpent} / ${t[me].breathWasted}</td><td>${t[1 - me].breathSpent} / ${t[1 - me].breathWasted}</td></tr>
    <tr><td>Reserve kept / used</td><td>${t[me].reserveKept} / ${t[me].reserveUsed}</td><td>${t[1 - me].reserveKept} / ${t[1 - me].reserveUsed}</td></tr>
    <tr><td>Spark gained / spent</td><td>${t[me].sparkGained} / ${t[me].sparkSpent}</td><td>${t[1 - me].sparkGained} / ${t[1 - me].sparkSpent}</td></tr>
    <tr><td>Drawn / bought</td><td>${t[me].drawn} / ${t[me].bought}</td><td>${t[1 - me].drawn} / ${t[1 - me].bought}</td></tr>
    </tbody></table>
    <div class="btns"><button id="s-rematch" class="go">Rematch</button><button id="s-swap">Swap seats</button><button id="s-export">Export replay</button><button id="s-lobby">Lobby</button></div>`;
}

// ---------- inspector ----------
function renderInspect() {
  const S = A.C ? A.C.state() : null, x = A.inspect;
  let t = null, word = x.word;
  if (x.thing && S) { t = S.things.find(q => q.id === x.thing); if (t) word = t.form || t.word; }
  if (!word || !BY_ID[word]) { A.inspect = null; return; }
  const d = BY_ID[word], s = d.school;
  let detail = `<p><b>${esc(SCHOOL_NAME[s] || s)}</b> · ${esc(TYPE_NAME[d.type] || d.type)}${d.r ? ' · Response' : ''}${d.made ? ' · made form' : d.token ? ' · token' : ` · cost ${d.cost}`}${d.type === 'thing' ? ` · printed ${d.strike}/${d.stand}` : d.type === 'ground' ? ` · stand ${d.stand}` : ''}</p>
    <p class="rules">${esc(textOf(word))}</p>`;
  if (d.props && d.props.length) detail += `<p><b>Properties</b> ${esc(d.props.join(', '))}</p>`;
  if (d.kw && d.kw.length) detail += `<p><b>Keywords</b> ${esc(d.kw.join(', '))}</p>`;
  if (t) {
    const m = E.modsOf(t), base = d.strike, cur = E.curStrike(S, t);
    const parts = [['printed', base], ['infusions, Qualities, Law', m.strike], ['Might', t.counters.might || 0], ['this turn', t.tempStrike || 0]].filter(p => p[1]);
    const other = cur - parts.reduce((a, p) => a + p[1], 0) + (parts.find(p => p[0] === 'printed') ? 0 : base);
    const sp = [['printed', d.stand], ['infusions, Qualities, Law', m.stand], ['Bedrock', t.counters.bedrock || 0], ['Growth', t.counters.growth || 0], ['this turn', t.tempStand || 0]].filter(p => p[1]);
    detail += `<h4>Now</h4><p><b>Strike ${cur}</b> = ${parts.map(p => `${p[0]} ${p[1]}`).join(' + ')}${other && other !== base ? ` + other ${other - (parts.length ? 0 : base)}` : ''}</p>
      <p><b>Stand ${E.remainingOf(S, t)} of ${E.standOf(S, t)}</b> = ${sp.map(p => `${p[0]} ${p[1]}`).join(' + ')}, minus ${t.damage} marked damage</p>
      <p><b>Capabilities</b> ${esc([...E.caps(S, t)].join(', ') || 'none')}</p>
      <p><b>Keywords now</b> ${esc([...E.kws(S, t)].join(', ') || 'none')}</p>
      <p><b>Status</b> ${statusChips(S, t) || 'none'}</p>
      <p><b>Owner</b> ${who(t.owner)} · <b>controller</b> ${who(t.ctrl)}${t.word !== (t.form || t.word) ? ` · printed word ${esc(nm(t.word))}` : ''}</p>
      ${(t.quals || []).length ? `<p><b>Attached</b> ${t.quals.map(q => `${esc(nm(q.word))}: ${esc(textOf(q.word))}`).join(' · ')}</p>` : ''}
      ${t.lineage ? `<p><b>Lineage</b> ${esc(lineageText(t.lineage))}. If destroyed: one death; originals go to their owners' Graves. If bounced: dissolves to Grave without a death.</p>` : ''}`;
  }
  const html = `<div class="scrim" id="in-close"></div><div class="inspect" role="dialog" aria-label="Inspect ${esc(nm(word))}">
    <div class="bigcard"><img class="frame" src="assets/frames/tall_${s}.webp" alt=""><span class="nm">${esc(nm(word))}</span><span class="gem">${d.made || d.token ? '' : d.cost}</span>${artWindow(word, nm(word), textOf(word))}<span class="tl">${esc(TYPE_NAME[d.type] || '')}${d.type === 'thing' ? ` · ${d.strike}/${d.stand}` : ''}</span><span class="rt">${esc(propLine(word))}</span></div>
    <div class="detail"><h2>${esc(nm(word))}</h2>${detail}<p class="small">Artwork is pending: the frame and the data are current; old art is not an authority for printed stats.</p><div class="btns"><button id="in-x" class="go">Close</button></div></div></div>`;
  const el = document.createElement('div'); el.className = 'overlay'; el.innerHTML = html; document.body.appendChild(el);
  const close = () => { A.inspect = null; el.remove(); };
  el.querySelector('#in-close').onclick = close; el.querySelector('#in-x').onclick = close; el.querySelector('#in-x').focus();
  el.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
}
function lineageText(recs) { return recs.map(r => r.token ? nm(r.token) + ' (token)' : r.ground ? nm(r.word) + ' (Ground)' : r.made ? nm(r.form) + ' [' + lineageText(r.lineage || []) + ']' : nm(r.form || r.word)).join(' + '); }

// ---------- modals: export, load, zones ----------
function renderModal() {
  const m = A.modal; let html = '';
  if (m.kind === 'export') {
    const rep = A.C.replay(); rep.deckNames = A.cfg.deckNames; rep.exportedBy = VERSION;
    html = `<h2>Replay and debug bundle</h2><p>Local test mode only: it contains both decks, the seed and every input. Copy it and save it as a .json file, or paste it into "Load a replay" later.</p>
      <textarea id="ex-t" rows="12" readonly>${esc(JSON.stringify(rep))}</textarea><div class="btns"><button id="ex-copy" class="go">Copy</button><button id="mo-x">Close</button></div><p id="ex-msg" class="small"></p>`;
  }
  if (m.kind === 'load') html = `<h2>Load a replay</h2><p>Paste an exported replay, or choose its file.</p><textarea id="ld-t" rows="10" placeholder="{&quot;format&quot;:…}"></textarea><input type="file" id="ld-f" accept=".json,application/json"><div class="btns"><button id="ld-review" class="go">Review from the start</button><button id="ld-resume">Resume at the end</button><button id="mo-x">Close</button></div><p id="ld-msg" class="small"></p>`;
  if (m.kind === 'zone') {
    const S = A.C.state(), [z, side] = m.zone.split(':'); const list = S.players[+side][z];
    html = `<h2>${who(+side)} — ${z === 'grave' ? 'Grave' : 'Sealed'} (${list.length})</h2><ul class="zl">${list.map(c => `<li><span class="dot s-${schoolOf(c.word)}"></span><button class="lnk" data-inspect-word="${esc(c.word)}">${esc(nm(c.word))}</button>${c.reason ? `<small>${esc(c.reason)}</small>` : ''}</li>`).join('') || '<li>Empty</li>'}</ul><div class="btns"><button id="mo-x" class="go">Close</button></div>`;
  }
  const el = document.createElement('div'); el.className = 'overlay'; el.innerHTML = `<div class="scrim"></div><div class="modal" role="dialog">${html}</div>`; document.body.appendChild(el);
  const close = () => { A.modal = null; el.remove(); };
  el.querySelector('.scrim').onclick = close; const x = el.querySelector('#mo-x'); if (x) x.onclick = close;
  el.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  for (const b of el.querySelectorAll('[data-inspect-word]')) b.onclick = () => { A.inspect = { word: b.dataset.inspectWord }; renderInspect(); };
  if (m.kind === 'export') el.querySelector('#ex-copy').onclick = async () => { const t = el.querySelector('#ex-t'); try { await navigator.clipboard.writeText(t.value); el.querySelector('#ex-msg').textContent = 'Copied.'; } catch (e) { t.select(); el.querySelector('#ex-msg').textContent = 'Copy was refused here: the text is selected, press Ctrl+C or Cmd+C.'; } };
  if (m.kind === 'load') {
    const go = review => { let rep; try { rep = JSON.parse(el.querySelector('#ld-t').value); } catch (e) { el.querySelector('#ld-msg').textContent = 'That is not valid JSON.'; return; } close(); resumeFrom(rep, review); };
    el.querySelector('#ld-review').onclick = () => { go(true); if (A.review) reviewTo(0); };
    el.querySelector('#ld-resume').onclick = () => go(false);
    el.querySelector('#ld-f').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(t => { el.querySelector('#ld-t').value = t; }); };
  }
}

// ---------- events ----------
function bindMatch() {
  const C = A.C, on = (id, f) => { const e = document.getElementById(id); if (e) e.onclick = f; };
  on('m-lobby', () => { stopBot(); store.set('wa31.left', true); A.screen = 'lobby'; A.sel = null; render(); });
  on('m-export', () => { A.modal = { kind: 'export' }; renderModal(); }); on('s-export', () => { A.modal = { kind: 'export' }; renderModal(); });
  const rematch = swap => { stopBot(); const cfg = { ...A.cfg }; if (swap) cfg.first = 1 - cfg.first; if (cfg.fixture) return startFixture(cfg.fixture.id); A.C = createController(cfg, hooks); A.cfg = cfg; A.sel = null; A.review = null; A.C.start(); render(); };
  on('m-rematch', () => rematch(false)); on('s-rematch', () => rematch(false)); on('m-swap', () => rematch(true)); on('s-swap', () => rematch(true));
  on('s-lobby', () => { stopBot(); A.screen = 'lobby'; render(); });
  const ap = document.getElementById('m-autopass'); if (ap) ap.onchange = () => { C.auto.passAll = ap.checked; };
  const vw = document.getElementById('m-view'); if (vw) vw.onchange = () => { A.view = vw.value; store.set('wa30.view', A.view); render(); };
  const sp = document.getElementById('m-speed'); if (sp) sp.onchange = () => { A.speed = +sp.value; };
  if (A.review) { on('rv-0', () => reviewTo(0)); on('rv-p', () => reviewTo(A.review.k - 1)); on('rv-n', () => reviewTo(A.review.k + 1)); on('rv-e', () => reviewTo(A.review.total)); on('rv-play', () => { A.review = null; render(); }); }
  on('a-end', () => { A.flash = null; A.why = null; C.act({ type: 'pass' }); });
  on('a-vessel', () => { A.sel = { anchor: { kind: 'vessel' }, fixed: {} }; A.why = null; render(); });
  on('a-cat', () => { A.sel = { anchor: { kind: 'catalyst' }, fixed: {} }; render(); });
  on('a-cancel', () => { A.sel = null; A.why = null; render(); });
  on('a-confirm', () => {
    const sel = selection(); if (sel.cands.length !== 1) return;
    const a = sel.cands[0]; A.sel = null; A.why = null; A.flash = null;
    if (C.pending && C.pending.type === 'respond') C.answer(a); else C.act(a);
  });
  on('mu-keep', () => { const v = [...(A.mull || [])]; A.mull = null; C.answer(v); render(); });
  for (const b of document.querySelectorAll('[data-mull]')) b.onclick = e => { if (e.target.closest('[data-inspect-word]')) return; const pid = b.dataset.mull; A.mull = A.mull || new Set(); A.mull.has(pid) ? A.mull.delete(pid) : A.mull.add(pid); renderPromptOnly(); if (A.C.S) render(); };
  for (const b of document.querySelectorAll('[data-choose]')) b.onclick = () => choose(JSON.parse(b.dataset.choose));
  for (const b of document.querySelectorAll('[data-block]')) b.onclick = () => C.answer(b.dataset.block === 'null' ? null : b.dataset.block);
  for (const b of document.querySelectorAll('[data-respond]')) b.onclick = () => { const k = b.dataset.respond; if (k === 'pass') return C.answer(null); A.sel = { anchor: null, fixed: {} }; const o = C.pending.options[+k]; for (const key of KEYS) if (o[key] !== undefined) A.sel.fixed[key] = J(o[key]); render(); };
  for (const b of document.querySelectorAll('[data-decide]')) b.onclick = () => C.answer(+b.dataset.decide);
  for (const b of document.querySelectorAll('[data-buy]')) b.onclick = () => { A.sel = { anchor: { kind: 'market', id: +b.dataset.buy }, fixed: {} }; render(); };
  for (const b of document.querySelectorAll('[data-zone]')) b.onclick = () => { A.modal = { kind: 'zone', zone: b.dataset.zone }; renderModal(); };
  for (const b of document.querySelectorAll('[data-inspect-thing]')) b.onclick = e => { e.stopPropagation(); A.inspect = { thing: b.dataset.inspectThing }; renderInspect(); };
  for (const b of document.querySelectorAll('[data-inspect-word]')) b.onclick = e => { e.stopPropagation(); A.inspect = { word: b.dataset.inspectWord }; renderInspect(); };
  for (const b of document.querySelectorAll('[data-card]')) b.onclick = () => clickObj('card', b.dataset.card);
  for (const b of document.querySelectorAll('[data-thing]')) b.onclick = () => clickObj('thing', b.dataset.thing);
  for (const b of document.querySelectorAll('[data-ground]')) b.onclick = () => clickObj('ground', +b.dataset.ground);
  for (const b of document.querySelectorAll('[data-target]')) b.onclick = () => clickObj('target', b.dataset.target);
}
function choose(v) { const sel = selection(); A.sel.fixed[sel.next] = J(v); A.why = null; render(); }
function clickObj(kind, id) {
  const C = A.C; if (A.review) return;
  const q = C.pending;
  if (q && q.type === 'block') { if (q.candidates.includes(id)) C.answer(id); else if (kind === 'thing') { A.why = 'That Thing cannot block this attack.'; render(); } return; }
  if (q && q.type === 'decide') { const k = q.options.indexOf(id); if (k >= 0) C.answer(k); return; }
  const sel = selection();
  // a value for the current step?
  if (A.sel && sel.next) {
    const val = kind === 'ground' ? 'ground' : id;
    const hit = sel.choices.find(v => v === val || (Array.isArray(v) && v.length === 1 && v[0] === val));
    if (hit !== undefined) return choose(hit);
    if (kind === 'thing' || kind === 'target' || kind === 'ground') { A.why = whyNot('target', val); render(); return; }
  }
  // otherwise a new anchor
  if (kind === 'card') {
    const has = sel.all.some(a => a.card === id || a.category === id || a.qual === id);
    A.sel = { anchor: { kind: 'card', id }, fixed: {} }; A.why = has ? null : whyNot('card', id); render(); return;
  }
  if (kind === 'thing') {
    const t = C.state().things.find(x => x.id === id);
    if (t && t.ctrl === C.human && !q) { const has = sel.all.some(a => anchorMatch(a, { kind: 'thing', id })); A.sel = { anchor: { kind: 'thing', id }, fixed: {} }; A.why = has ? null : whyNot('thing', id); render(); return; }
    if (t && t.ctrl !== C.human && !q && sel.all.some(a => anchorMatch(a, { kind: 'foe', id }))) { A.sel = { anchor: { kind: 'foe', id }, fixed: {} }; A.why = null; render(); return; }
    A.why = whyNot('thing', id); render(); return;
  }
  if (kind === 'ground' && id === C.human && !q) { A.sel = { anchor: { kind: 'ground' }, fixed: {} }; A.why = sel.all.some(a => anchorMatch(a, { kind: 'ground' })) ? null : 'Your Ground can only be used as a fusion ingredient a recipe names.'; render(); }
}

// ---------- deck editor ----------
function renderEditor() {
  const ed = A.ed; const errs = E.deckErrors(ed.words);
  const pool = CARDS.filter(c => c.deckLegal && (ed.filter === 'all' || c.school === ed.filter) && (!ed.q || nm(c.id).toLowerCase().includes(ed.q.toLowerCase())));
  root().innerHTML = `<main class="editor"><header class="top"><button class="ghost" id="ed-back">Lobby</button><span class="title">Deck editor <small>test catalogue of 150 words — not your real collection</small></span></header>
  <div class="ed-grid"><section><div class="row-f">${['all'].concat(SCHOOLS).map(s => `<button class="fchip${ed.filter === s ? ' on' : ''}" data-f="${s}">${s === 'all' ? 'All' : SCHOOL_NAME[s]}</button>`).join('')}<input id="ed-q" type="search" placeholder="Search words" value="${esc(ed.q)}"></div>
    <ul class="pool">${pool.map(c => `<li><span class="dot s-${c.school}"></span><button class="lnk" data-inspect-word="${c.id}">${esc(nm(c.id))}</button><small>${TYPE_NAME[c.type]} ${c.cost}${c.type === 'thing' ? ` · ${c.strike}/${c.stand}` : ''}</small><button data-add="${c.id}"${ed.words.includes(c.id) ? ' disabled' : ''}>${ed.words.includes(c.id) ? 'In deck' : 'Add'}</button></li>`).join('')}</ul></section>
  <section class="deckcol"><label>Name<input id="ed-name" value="${esc(ed.name)}"></label><label>Start from<select id="ed-from"><option value="">—</option>${allDecks().map(d => `<option value="${esc(d.id)}">${esc(d.label)}</option>`).join('')}</select></label>
    <p class="${errs.length ? 'bad' : 'ok'}">${ed.words.length} / 20 words${errs.length ? ' — ' + esc(errs.join('; ')) : ' — legal'}</p>
    <ul class="pool">${ed.words.map(w => `<li><span class="dot s-${schoolOf(w)}"></span>${esc(nm(w))}<small>${TYPE_NAME[BY_ID[w].type]} ${BY_ID[w].cost}</small><button data-rem="${w}">Remove</button></li>`).join('')}</ul>
    <div class="btns"><button id="ed-save" class="go"${errs.length ? ' disabled' : ''}>Save and use as my deck</button></div></section></div></main>`;
  const on = (id, f) => { document.getElementById(id).onclick = f; };
  on('ed-back', () => { A.screen = 'lobby'; render(); });
  for (const b of document.querySelectorAll('[data-f]')) b.onclick = () => { ed.filter = b.dataset.f; render(); };
  document.getElementById('ed-q').oninput = e => { ed.q = e.target.value; const pos = e.target.selectionStart; render(); const q = document.getElementById('ed-q'); q.focus(); q.setSelectionRange(pos, pos); };
  document.getElementById('ed-name').onchange = e => { ed.name = e.target.value || 'My test deck'; };
  document.getElementById('ed-from').onchange = e => { if (e.target.value) { ed.words = deckById(e.target.value).words.slice(); render(); } };
  for (const b of document.querySelectorAll('[data-add]')) b.onclick = () => { if (ed.words.length < 20) ed.words.push(b.dataset.add); render(); };
  for (const b of document.querySelectorAll('[data-rem]')) b.onclick = () => { ed.words = ed.words.filter(w => w !== b.dataset.rem); render(); };
  for (const b of document.querySelectorAll('[data-inspect-word]')) b.onclick = () => { A.inspect = { word: b.dataset.inspectWord }; renderInspect(); };
  on('ed-save', () => { const c = store.get('wa30.custom') || {}; c[ed.name] = ed.words.slice(); store.set('wa30.custom', c); lobby.mine = 'custom:' + ed.name; store.set('wa30.lobby', lobby); A.screen = 'lobby'; render(); });
}

function renderFixtures() {
  root().innerHTML = `<main class="editor"><header class="top"><button class="ghost" id="fx-back">Lobby</button><span class="title">Scenario fixtures <small>constructed positions for testing one mechanic — not claimed reachable in a normal match</small></span></header>
    <ul class="fixtures">${Object.values(FIXTURES).map(f => `<li><h3>${esc(f.title)}</h3><p>${esc(f.text)}</p><button data-fx="${f.id}" class="go">Open fixture</button></li>`).join('')}</ul>
    <p class="small">Rival skill for fixtures: ${esc(lobby.tier)} (set it in the lobby).</p></main>`;
  document.getElementById('fx-back').onclick = () => { A.screen = 'lobby'; render(); };
  for (const b of document.querySelectorAll('[data-fx]')) b.onclick = () => startFixture(b.dataset.fx);
}

// ---------- boot ----------
function boot(data) {
  if (data && data.last) store.set('wa31.last', data.last);
  const last = store.get('wa31.last');
  if (last && last.result == null && !store.get('wa31.left')) { resumeFrom(last, false); return; } // carry on where you left off
  render();
}
if (typeof window !== 'undefined') {
  window.WA30 = { A, render, startMatch, startFixture, selection, E };
  if (window.claude && window.claude.hot && window.claude.hot.snapshot) window.claude.hot.snapshot(() => ({ last: A.C && !A.review ? A.C.replay() : store.get('wa30.last') }));
  const start = d => boot(d || {});
  if (window.claude && window.claude.hot && window.claude.hot.ready) window.claude.hot.ready(start); else start(window.claude && window.claude.hot ? window.claude.hot.data : {});
}
