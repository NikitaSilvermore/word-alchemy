// Builds atlas/data/atlas_data.json: word records from the engine's card registry and the game's own card text,
// plus relationships observed by running the real engine (tools/probe.js). usage: node tools/build_data.js [scale]
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), cp = require('child_process');
const ROOT = path.resolve(__dirname, '../..');
const E = require(ROOT + '/engine29/src/engine'), F = require(ROOT + '/engine29/src/formats');
const { BY_ID } = require(ROOT + '/engine29/src/cards');
const { THREE_DECKS } = require(ROOT + '/engine29/data/v33_decks');
const { loadGameText } = require('./game_text');
const P = require('./probe');
const scale = +(process.argv[2] || 1);
const FMT = P.FMT, fmt = F.resolveFormat(FMT), MODS = fmt.variant.modules;
const T0 = Date.now();

// ---------- build identity ----------
const sha = f => crypto.createHash('sha256').update(fs.readFileSync(ROOT + '/' + f)).digest('hex').slice(0, 16);
const SRC = ['engine29/src/engine.js', 'engine29/src/cards.js', 'engine29/src/formats.js', 'engine29/data/v33_decks.js', 'playtest/src/main.js'];
let commit = 'unknown'; try { commit = cp.execSync('git -C ' + ROOT + ' rev-parse --short HEAD').toString().trim(); } catch (e) { /* not a repo */ }
const dirty = (() => { try { return cp.execSync('git -C ' + ROOT + ' status --porcelain -- engine29 playtest/src').toString().trim().split('\n').filter(Boolean); } catch (e) { return []; } })();
const build = { format: FMT, rules: fmt.version, modules: MODS, commit, gameSourceChanged: dirty, hashes: Object.fromEntries(SRC.map(f => [f, sha(f)])), generated: new Date().toISOString(), label: 'Core Duel — Room to Grow · rules ' + fmt.version };

// ---------- source references ----------
const cardsSrc = fs.readFileSync(ROOT + '/engine29/src/cards.js', 'utf8').split('\n'), engSrc = fs.readFileSync(ROOT + '/engine29/src/engine.js', 'utf8').split('\n');
const lineOf = (lines, re) => { const k = lines.findIndex(l => re.test(l)); return k < 0 ? null : k + 1; };
const linesOf = (lines, re) => lines.map((l, k) => (re.test(l) ? k + 1 : 0)).filter(Boolean);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const G = loadGameText(MODS);
const textSource = id => { const ui = fs.readFileSync(ROOT + '/playtest/src/main.js', 'utf8'); for (const tb of ['THREE_TEXT', 'CORE_TEXT', 'FOLIO_TEXT', 'MADE_TEXT']) { const i = ui.indexOf('const ' + tb + ' = {'); if (i < 0) continue; const j = ui.indexOf('\n};', i); if (ui.slice(i, j).includes("'" + id + "'")) return 'playtest/src/main.js ' + tb; } return 'engine29/data/spec_catalogue.json (via main.js SPEC_BY)'; };

// ---------- probes ----------
const core = P.run({ seed: 101, perPair: Math.round(36 * scale), rounds: 4 });
const coreTemplates = { ...P.TEMPLATES };
const enabled = Object.values(BY_ID).filter(c => c.deckLegal || (c.folio && !c.transformedOnly && !c.made && MODS.includes(c.folio))).map(c => c.id);
// vocabulary decks: every enabled word in some legal 20-word deck (grouped by school, padded within school)
const bySchool = {}; for (const id of enabled) (bySchool[BY_ID[id].school] = bySchool[BY_ID[id].school] || []).push(id);
const order = Object.keys(bySchool).flatMap(s => bySchool[s]), VOC = {};
for (let k = 0; k < order.length; k += 20) {
  let w = order.slice(k, k + 20);
  if (w.length < 20) { const sch = BY_ID[w[0]].school; for (const id of bySchool[sch].concat(order)) { if (w.length >= 20) break; if (!w.includes(id)) w.push(id); } }
  const errs = E.deckErrors(w, MODS); if (errs.length) throw new Error('vocab deck ' + k + ': ' + errs.join('; '));
  VOC['voc' + (k / 20 + 1)] = { name: 'Vocabulary ' + (k / 20 + 1), words: w };
}
const vocNames = Object.keys(VOC);
const voc = P.run({ seed: 202, perPair: Math.round(5 * scale), rounds: 3, decks: VOC, pairs: vocNames.flatMap(a => vocNames.map(b => [a, b])) });
const vocTemplates = { ...P.TEMPLATES };

// ---------- words ----------
const inDeck = {}; for (const [k, d] of Object.entries(THREE_DECKS)) for (const w of d.words) (inDeck[w] = inDeck[w] || []).push(k);
const coreForms = new Set(Object.values(core.pools).flat()), vocForms = new Set(Object.values(voc.pools).flat());
const ART = new Set(require(ROOT + '/playtest/src/art_index.json'));
const words = {};
for (const c of Object.values(BY_ID)) {
  const id = c.id;
  const origin = inDeck[id] ? 'starting' : coreForms.has(id) ? 'created' : enabled.includes(id) ? 'enabled' : vocForms.has(id) ? 'enabled-form' : 'code';
  const key = id.split('.').pop();
  words[id] = { id, name: G.nm(id), school: c.school, type: c.type, cost: c.cost, strike: c.strike, stand: c.stand, props: c.props || [], kw: c.kw || [], cap: c.cap || [],
    ladder: c.ladder || null, spell: c.spell || null, ability: c.ability || null, response: !!c.r, folio: c.folio || null, made: !!c.made, transformedOnly: !!c.transformedOnly,
    text: G.textOf(id) || '', origin, decks: inDeck[id] || [], art: ART.has(key) ? key : null,
    src: { card: 'engine29/src/cards.js:' + lineOf(cardsSrc, new RegExp("'" + esc(id) + "'")), text: textSource(id),
      engine: [...new Set([c.spell, c.ability && c.ability.id].filter(Boolean))].flatMap(k => linesOf(engSrc, new RegExp("case '" + esc(k) + "'")).slice(0, 4).map(l => 'engine29/src/engine.js:' + l)) } };
  const extra = Object.keys(c).filter(k => !['id', 'school', 'type', 'cost', 'strike', 'stand', 'props', 'deckLegal', 'ladder', 'kw', 'cap', 'spell', 'ability', 'r', 'folio', 'made', 'transformedOnly', 'name'].includes(k));
  if (extra.length) words[id].flags = Object.fromEntries(extra.map(k => [k, c[k]]));
}

// ---------- relationships ----------
const FAM = {
  damage: 'Damage', destroy: 'Destroy', healing: 'Healing', cleansing: 'Cleansing (poison)', wetting: 'Wetting', drying: 'Drying', ignition: 'Ignition', extinguish: 'Putting out fire',
  protection: 'Protection', readiness: 'Readiness', control: 'Exhaust and bind', movement: 'Return to hand', draw: 'Draw and selection', growth: 'Growth', strengthening: 'Strengthening (Might)',
  transformation: 'Transformation', creation: 'Creation', counter: 'Countering a word', quality: 'Attaching a quality', breath: 'Extra breath', consumption: 'Consumption (sacrifice)', rival: 'Damage to the rival', lifegain: 'Life gain', poison: 'Poison',
};
function famOf(e) {
  switch (e.k) {
    case 'damage': return 'damage'; case 'destroyed': return 'destroy'; case 'heal': return 'healing';
    case 'status+': return e.status === 'wet' ? 'wetting' : e.status === 'burning' ? null : e.status === 'ward' ? 'protection' : ['bound', 'asleep', 'frozen', 'blinded', 'grounded'].includes(e.status) ? 'control' : null;
    case 'status-': return e.status === 'wet' ? 'drying' : e.status === 'burning' ? 'extinguish' : null;
    case 'flag': return e.flag === 'defOnly' ? 'readiness' : 'protection';
    case 'ready': return 'readiness'; case 'exhaust': return e.side === 'theirs' ? 'control' : null;
    case 'counter+': return e.counter === 'growth' ? 'growth' : e.counter === 'might' ? 'strengthening' : null;
    case 'life+': return e.who === 'me' ? 'lifegain' : null; case 'life-': return e.who === 'rival' ? 'rival' : null;
    case 'breath+': return e.who === 'me' ? 'breath' : null;
    case 'poison-': return 'cleansing'; case 'poison+': return 'poison'; case 'draw': return 'draw';
    case 'sacrificed': return e.side === 'mine' ? 'consumption' : null;
    case 'event': return e.type === 'bounce' ? 'movement' : e.type === 'ward' ? 'protection' : e.type === 'shield' ? 'protection' : e.type === 'ignite' ? 'ignition' : e.type === 'attach' ? 'quality' : null;
    default: return null;
  }
}
const ops = {}, edges = {}, recipes = {}, transforms = {}, creates = {}, combatNotes = {}, examples = [];
const opKey = (act, resp) => {
  const a = resp || act;
  if (a.type === 'fuse') return { id: 'recipe:' + a.recipe, kind: 'recipe', label: 'Vessel fusion', timing: 'Main', source: null };
  if (a.type === 'ability') return { id: 'ability:' + (a.subject && a.subject.form) + ':' + a.ability, kind: 'ability', ability: a.ability, label: a.ability, timing: resp ? 'Response' : 'Main', source: a.subject && a.subject.form };
  if (a.word) return { id: (a.type === 'deploy' ? 'deploy:' : a.type === 'ground' ? 'ground:' : 'card:') + a.word, kind: a.type === 'deploy' ? 'deploy' : a.type === 'ground' ? 'ground' : 'card', label: G.nm(a.word), timing: resp ? (a.kind === 'answer' ? 'Answer' : 'Response') : 'Main', source: a.word };
  return { id: a.type, kind: a.type, label: a.type, timing: a.type === 'upkeep' ? 'Upkeep' : 'Main', source: null };
};
const modeOf = a => { const m = []; for (const k of ['mode', 'branch', 'recipe', 'verb']) if (a[k] != null) m.push(k + ':' + a[k]); if (a.ash != null) m.push('ash:' + a.ash); if (a.endorse) m.push('stamped'); if (a.sacrifice) m.push('with a sacrifice'); if (a.ready) m.push('ready'); if (a.discard) m.push('discard'); return m.join(' '); };
let CUR = null; // offered snapshots of the layer being ingested
function mineAt(rec) { const sn = CUR && CUR[rec.pos]; return sn ? [...new Set(sn.field.filter(f => f.side === 'mine').map(f => f.form))] : null; }
function cop(obj, rec) { const m = mineAt(rec); if (!m) return; obj.co = obj.co == null ? m : obj.co.filter(f => m.includes(f)); }
function addEx(rec) { const sn = CUR && CUR[rec.pos]; examples.push({ d: rec.deck, o: rec.opp, act: rec.act, resp: rec.response || null, fx: rec.effects, field: sn ? sn.field : null, hand: sn ? sn.hand : null }); return examples.length - 1; }
function addEdge(layer, o) {
  const key = [o.verb, o.fam, o.from, o.to, o.side, o.op, o.mode].join('|');
  const e = edges[key] || (edges[key] = { id: 'e' + crypto.createHash('md5').update(key).digest('hex').slice(0, 10), verb: o.verb, fam: o.fam, from: o.from, to: o.to, side: o.side, op: o.op, mode: o.mode || '', n: 0, layers: [], costs: [], consumes: [], exhausts: [], ex: null });
  e.n++; cop(e, o.rec); if (!e.layers.includes(layer)) e.layers.push(layer);
  if (o.cost != null && !e.costs.includes(o.cost)) e.costs.push(o.cost);
  for (const c of o.consumes || []) if (!e.consumes.includes(c)) e.consumes.push(c);
  for (const c of o.exhausts || []) if (!e.exhausts.includes(c)) e.exhausts.push(c);
  if (e.ex == null) e.ex = o.ex();
}
function ingest(res, layer) {
  CUR = res.offered;
  const baseFx = new Map();
  for (const rec of res.records) if (!rec.response && !rec.error) baseFx.set(rec.rid, new Set((rec.effects || []).map(x => JSON.stringify(x))));
  for (const rec of res.records) {
    if (rec.error || !rec.effects) continue;
    const act = rec.act, resp = rec.response;
    let fx = rec.effects;
    if (resp) {
      const b = baseFx.get(rec.base) || new Set();
      if (fx.some(x => x.k === 'event' && x.type === 'cancelled') && ![...b].some(x => x.includes('"cancelled"'))) {
        const countered = act.word || (act.subject && act.subject.form) || act.type, op = opKey(act, resp);
        const o = ops[op.id] || (ops[op.id] = { ...op, n: 0, layers: [], modes: [], costs: [] }); o.n++; if (!o.layers.includes(layer)) o.layers.push(layer);
        let exi = null; addEdge(layer, { verb: 'answers', fam: 'counter', from: resp.word || (resp.subject && resp.subject.form), to: countered, side: 'theirs', op: op.id, mode: '', ex: () => (exi == null ? (exi = addEx(rec)) : exi), rec });
      }
      const tgt = new Set([resp.target, ...(resp.targets || [])].filter(t => t && t.form).map(t => t.form));
      fx = fx.filter(x => !b.has(JSON.stringify(x)) && !['token', 'made', 'breath', 'draw', 'rival-hand+'].includes(x.k) && (x.form ? tgt.has(x.form) || tgt.has(x.to) || tgt.has(x.from) : ['life+', 'life-', 'poison-'].includes(x.k)));
      if (!fx.length) continue;
      if (resp.side !== 0) { // the responder is the rival: turn every side round so 'mine' means the responder's
        const flip = v => ({ mine: 'theirs', theirs: 'mine', me: 'rival', rival: 'me' }[v] || v);
        fx = fx.map(x => ({ ...x, side: flip(x.side), who: flip(x.who) }));
      }
    }
    const op = opKey(act, resp), mode = modeOf(resp || act);
    const o = ops[op.id] || (ops[op.id] = { ...op, n: 0, layers: [], modes: [], costs: [] }); o.n++; if (!o.layers.includes(layer)) o.layers.push(layer); if (mode && !o.modes.includes(mode)) o.modes.push(mode);
    const breath = (fx.find(x => x.k === 'breath') || {}).n; if (breath != null && !resp && !o.costs.includes(breath)) o.costs.push(breath);
    const consumed = fx.filter(x => x.k === 'sacrificed' && x.side === 'mine').map(x => x.form);
    const exhausted = fx.filter(x => x.k === 'exhaust' && x.side === 'mine').map(x => x.form);
    let exi = null; const ex = () => (exi == null ? (exi = addEx(rec)) : exi);
    if (act.type === 'combat' && !resp) { for (const x of fx.filter(x => x.k === 'event' && ['rebirth', 'spill', 'flare', 'bound-miss', 'ignite', 'shielded'].includes(x.type))) { const k = (x.form || '?') + '|' + x.type; combatNotes[k] = (combatNotes[k] || { form: x.form, type: x.type, n: 0, ex: ex() }); combatNotes[k].n++; } continue; }
    const src = op.kind === 'recipe' ? null : op.source;
    for (const x of fx) {
      if (x.k === 'transform') {
        const by = op.kind === 'upkeep' ? 'upkeep' : op.id;
        const k = [x.from, x.to, by, mode].join('|');
        const t = transforms[k] || (transforms[k] = { from: x.from, to: x.to, op: by, mode: op.kind === 'upkeep' ? '' : mode, regress: x.regress, n: 0, layers: [], costs: [], consumes: [], ex: ex() });
        t.n++; cop(t, rec); if (!t.layers.includes(layer)) t.layers.push(layer); if (breath != null && !t.costs.includes(breath)) t.costs.push(breath); for (const c of consumed) if (!t.consumes.includes(c)) t.consumes.push(c);
        continue;
      }
      if (x.k === 'made') {
        const a = resp || act, ins = [a.a, a.b].filter(Boolean).map(i => (i.ground ? 'ground:' : '') + (i.form || i)).sort();
        const k = [x.recipe, ins.join('+'), x.form].join('|');
        const r = recipes[k] || (recipes[k] = { recipe: x.recipe, inputs: ins, output: x.form, op: op.id, by: src, n: 0, layers: [], costs: [], ex: ex() });
        r.n++; cop(r, rec); if (!r.layers.includes(layer)) r.layers.push(layer); if (breath != null && !r.costs.includes(breath)) r.costs.push(breath);
        continue;
      }
      if (x.k === 'token') {
        const by = op.kind === 'upkeep' ? (fx.some(y => y.k === 'event' && y.type === 'espalier') ? 'made.espalier' : null) : (src || op.id);
        if (!by) continue; // a token made during the turn cycle by something the probe cannot name: not recorded
        const k = [by, x.form, op.id, mode].join('|');
        const c = creates[k] || (creates[k] = { from: by, to: x.form, op: op.id, mode, n: 0, layers: [], costs: [], consumes: [], ex: ex() });
        c.n++; cop(c, rec); if (!c.layers.includes(layer)) c.layers.push(layer); if (breath != null && !c.costs.includes(breath)) c.costs.push(breath); for (const q of consumed) if (!c.consumes.includes(q)) c.consumes.push(q);
        continue;
      }
      const fam = famOf(x); if (!fam || !src) continue;
      if (x.k === 'sacrificed' && x.form === src) continue; // paying with itself is a cost, shown on the op
      const to = x.form || (x.who === 'me' ? 'you' : x.who === 'rival' ? 'rival' : null); if (!to) continue;
      if (x.k === 'event' && x.type === 'attach') { addEdge(layer, { verb: 'supports', fam, from: src, to, side: x.side || 'mine', op: op.id, mode, cost: breath, ex, rec }); continue; }
      const side = x.side || (x.who === 'me' ? 'mine' : x.who === 'rival' ? 'theirs' : null);
      if (fam === 'consumption') { addEdge(layer, { verb: 'consumes', fam, from: src, to, side, op: op.id, mode, cost: breath, ex, rec }); continue; }
      addEdge(layer, { verb: side === 'mine' || to === 'you' ? 'supports' : 'answers', fam, from: src, to, side, op: op.id, mode, cost: breath, consumes: consumed, exhausts: exhausted, ex, rec });
    }
  }
}
ingest(core, 'core'); ingest(voc, 'vocabulary');

// eligibility evidence: for each operation, which present forms were offered as targets, and which were present but never offered
function eligibility(res, layer, acc) {
  for (const snap of res.offered) {
    const byOp = {};
    for (const a of snap.acts) { const op = opKey(a).id; const ts = [a.target, a.a, a.b, ...(a.targets || [])].filter(t => t && t.form); (byOp[op] = byOp[op] || new Set()); for (const t of ts) byOp[op].add(t.side + ':' + t.form); if (a.type === 'pass') continue; }
    for (const [op, set] of Object.entries(byOp)) {
      const e = acc[op] || (acc[op] = { offered: {}, present: {}, layers: [] }); if (!e.layers.includes(layer)) e.layers.push(layer);
      for (const t of set) e.offered[t] = (e.offered[t] || 0) + 1;
      for (const f of snap.field) { const k = f.side + ':' + f.form; e.present[k] = (e.present[k] || 0) + 1; }
    }
  }
}
const elig = {}; eligibility(core, 'core', elig); eligibility(voc, 'vocabulary', elig);
for (const [op, e] of Object.entries(elig)) {
  e.never = Object.fromEntries(Object.entries(e.present).filter(([k, n]) => !e.offered[k] && n >= 5 && Object.keys(e.offered).length));
  delete e.present;
}
// how often a word in hand had no legal use at all (core layer only)
const handUse = {};
for (const snap of core.offered) for (const w of new Set(snap.hand)) { const h = handUse[w] || (handUse[w] = { held: 0, usable: 0 }); h.held++; if (snap.acts.some(a => a.word === w)) h.usable++; }

// ---------- engine refusals for named invalid relationships (deliberate negative checks) ----------
function fixture(deck, opp, mine = [], theirs = []) {
  const S = F.createFromFormat(FMT, { decks: [THREE_DECKS[deck].words, THREE_DECKS[opp].words], seed: 5, first: 0, mulligan: () => [] });
  for (const p of S.players) { p.deck.push(...p.hand); p.hand = []; p.breath = 8; }
  const put = (side, w, o = {}) => { const p = S.players[side], k = p.deck.findIndex(c => c.word === w); const c = k >= 0 ? p.deck.splice(k, 1)[0] : null; const t = { id: 't' + (++S.seq), pid: c ? c.pid : null, word: w, owner: side, ctrl: side, entry: S.seq, damage: 0, counters: {}, status: {}, exhausted: false, fresh: false, actions: 0, arrivedTurn: 0, ...o }; S.things.push(t); return t; };
  const give = (side, w) => { const p = S.players[side], k = p.deck.findIndex(c => c.word === w); const c = p.deck.splice(k, 1)[0]; p.hand.push(c); return c; };
  for (const w of mine) put(0, w); for (const w of theirs) put(1, w);
  return { S, put, give };
}
const checks = [];
{ const { S, give } = fixture('forge', 'orchard', ['earth.iron']); const sh = give(0, 'earth.shape3'); const iron = S.things[0];
  checks.push({ id: 'chk-iron-signet', claim: 'Iron can be Shaped into a Signet', verdict: E.legalActions(S).some(a => a.card === sh.pid && a.branch === 'earth.signet3') ? 'legal' : 'refused', reason: E.shape3Why(S, 0, iron, 'earth.signet3') || null, offered: E.legalActions(S).filter(a => a.card === sh.pid).map(a => a.branch), words: ['earth.iron', 'earth.shape3', 'earth.signet3'] }); }
{ const { S } = fixture('orchard', 'forge', ['life.bee', 'life.hazel']); const [bee, hazel] = S.things;
  checks.push({ id: 'chk-bee-hazel', claim: 'Bee can pollinate Hazel', verdict: E.legalActions(S).some(a => a.ability === 'pollinate' && a.subject === bee.id && a.target === hazel.id) ? 'legal' : 'refused', reason: E.pollinationWhy(S, bee, hazel) || null, words: ['life.bee', 'life.hazel'] }); }
{ const { S, give } = fixture('orchard', 'forge', ['life.pear', 'life.oak']); const g = give(0, 'life.graft3');
  checks.push({ id: 'chk-oak-graft', claim: 'Oak can be a Graft rootstock (Pear + Oak → Espalier)', verdict: E.legalActions(S).some(a => a.card === g.pid) ? 'legal' : 'refused', reason: E.legalActions(S).some(a => a.card === g.pid) ? null : 'No Graft is offered: Oak is not a listed rootstock (Graft joins Pear or Apple with Sapling or another fruit tree)', words: ['life.graft3', 'life.pear', 'life.oak'] }); }
{ const { S, put, give } = fixture('furnace', 'orchard', [], ['life.wolf']); const na = put(0, 'fire.naphtha', { status: { wet: true } }); const k = give(0, 'fire.kindle');
  checks.push({ id: 'chk-wet-naphtha', claim: 'Kindle can Ignite a Wet Naphtha', verdict: E.legalActions(S).some(a => a.card === k.pid && a.target === na.id && a.mode === 'ignite') ? 'legal' : 'refused', reason: E.igniteWhy(S, na) || null, words: ['fire.kindle', 'fire.naphtha'] }); }
{ const { S, give } = fixture('forge', 'orchard', ['earth.copper']); const t = give(0, 'earth.transmute');
  const offered = E.legalActions(S).filter(a => a.card === t.pid).map(a => a.branch);
  checks.push({ id: 'chk-copper-gold', claim: 'Copper can be Transmuted straight to Gold', verdict: offered.includes('earth.gold') ? 'legal' : 'refused', reason: 'Transmute offers only ' + (offered.join(', ') || 'nothing') + ' from Copper (one ladder step at a time)', words: ['earth.transmute', 'earth.copper', 'earth.gold'] }); }
{ const { S } = fixture('forge', 'orchard', ['earth.copper', 'earth.lead']); const s = S.things[0]; s.form = 'earth.signet3';
  const seal = E.legalActions(S).filter(a => a.ability === 'seal');
  checks.push({ id: 'chk-signet-self', claim: 'A Signet can Ward itself', verdict: seal.some(a => a.target === s.id) ? 'legal' : 'refused', reason: seal.some(a => a.target === s.id) ? null : 'Seal is offered on ' + seal.length + ' other friendly Thing(s), never on the Signet itself', words: ['earth.signet3'] }); }

// ---------- authoritative recipe table (engine29/src/recipes.js + engine ESPALIER/FOLIO tables) ----------
const R = require(ROOT + '/engine29/src/recipes');
const recipeTable = [...R.NAMED.map(r => ({ ...r, table: 'recipes.js NAMED' })), ...R.INFUSIONS.map(r => ({ ...r, table: 'recipes.js INFUSIONS' })), ...E.ESPALIER.map(r => ({ ...r, table: 'engine.js ESPALIER (three)' })), ...(E.FOLIO_RECIPES || []).map(r => ({ ...r, table: 'engine.js FOLIO_RECIPES' }))]
  .map(r => ({ id: r.id, table: r.table, out: r.out || null, outInThisBuild: r.out === 'made.golem' && MODS.includes('three') ? 'made.golem3' : r.out || null, cost: r.cost, a: r.a, b: r.b, mod: r.mod || null, module: r.module || null, forbid: { kw: r.forbidKw || null, props: r.forbidProps || null }, school: r.school || null,
    observed: Object.values(recipes).filter(x => x.recipe === r.id).reduce((n, x) => n + x.n, 0), observedLayers: [...new Set(Object.values(recipes).filter(x => x.recipe === r.id).flatMap(x => x.layers))] }));

// ---------- assemble ----------
const vocDecks = Object.fromEntries(Object.entries(VOC).map(([k, v]) => [k, { name: v.name, words: v.words }]));
const out = {
  build, families: FAM,
  decks: Object.fromEntries(Object.entries(THREE_DECKS).map(([k, d]) => [k, { key: k, name: d.name, schools: d.schools, pitch: d.pitch, plan: d.plan, words: d.words, forms: core.pools[k].filter(f => !d.words.includes(f)) }])),
  frozenDecks: { note: 'Earlier deck lists (V33) are kept in the game code but are not the current decks.', keys: Object.keys(require(ROOT + '/engine29/data/v33_decks').V33_DECKS) },
  vocabularyDecks: vocDecks,
  recipeTable, words, ops, edges: Object.values(edges), recipes: Object.values(recipes), transforms: Object.values(transforms), creates: Object.values(creates), combat: Object.values(combatNotes),
  eligibility: elig, handUse, checks, examples,
  probe: { core: { positions: core.offered.length, applied: core.records.length, errors: core.records.filter(r => r.error).length }, vocabulary: { positions: voc.offered.length, applied: voc.records.length, errors: voc.records.filter(r => r.error).length }, templates: { core: coreTemplates, vocabulary: vocTemplates }, seconds: (Date.now() - T0) / 1000 },
};
fs.mkdirSync(path.resolve(__dirname, '../data'), { recursive: true });
fs.writeFileSync(path.resolve(__dirname, '../data/atlas_data.json'), JSON.stringify(out));
const cnt = o => Object.values(out.words).filter(w => w.origin === o).length;
console.log(JSON.stringify({ secs: out.probe.seconds, probe: { core: out.probe.core, vocabulary: out.probe.vocabulary }, words: { starting: cnt('starting'), created: cnt('created'), enabled: cnt('enabled'), enabledForm: cnt('enabled-form'), codeOnly: cnt('code') }, ops: Object.keys(ops).length, edges: out.edges.length, recipes: out.recipes.length, transforms: out.transforms.length, creates: out.creates.length, combat: out.combat.length, checks: checks.map(c => c.id + ':' + c.verdict + ' — ' + c.reason), examples: examples.length, bytes: fs.statSync(path.resolve(__dirname, '../data/atlas_data.json')).size }, null, 1));
