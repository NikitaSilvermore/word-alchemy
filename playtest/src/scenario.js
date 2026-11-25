// V32 scenario editor model (no DOM). A scenario is a JSON spec: a rules version, and for each side a legal 20-word list
// from which the position takes its words (field, hand, grave, Ground, the top of the deck); everything not placed stays in
// the deck below the chosen top cards. Tokens and made forms are allowed on the field and get the documented lineage.
// Every spec is validated by the engine's own rules before it builds; switching rules version re-validates and explains.
'use strict';
const E = require('../../engine29/src/engine');
const F = require('../../engine29/src/formats');
const { BY_ID } = require('../../engine29/src/cards');
const { REFERENCE_DECKS } = require('../../engine29/data/reference_decks');
const { THEMED, COUNTERS } = require('../../engine29/data/themed_decks');
const { FOLIO_DECKS } = require('../../engine29/data/folio_decks');
const { V2_DECKS } = require('../../engine29/data/v32_decks');

const LISTS = {};
for (const [k, v] of Object.entries(V2_DECKS)) LISTS[k] = { label: v.note, words: v.words };
for (const [k, v] of Object.entries(FOLIO_DECKS)) LISTS[k] = { label: 'V31 ' + v.note, words: v.words };
for (const [k, v] of Object.entries(REFERENCE_DECKS)) LISTS[k] = { label: k.replace(/_/g, ' '), words: v.words };
for (const [k, v] of Object.entries(THEMED)) LISTS[k] = { label: 'Themed ' + k.slice(2).replace(/_/g, ' '), words: v };
for (const [k, v] of Object.entries(COUNTERS)) LISTS[k] = { label: 'Counter ' + k.slice(2).replace(/_/g, ' '), words: v };
const listWords = l => (Array.isArray(l) ? l : LISTS[l] ? LISTS[l].words : null);

// made forms the editor can place, with the documented ingredients (lineage) and the module they need
const MADE = {
  'made.swamp': { needs: null, lin: () => [{ w: 'earth.clay' }, { w: 'water.water', ground: true }] },
  'made.life': { needs: null, lin: () => [{ w: 'life.seed' }, { made: 'made.swamp' }] },
  'made.world_tree': { needs: null, lin: () => [{ w: 'life.oak' }, { made: 'made.life' }] },
  'made.energy': { needs: null, lin: () => [{ w: 'fire.ember' }, { w: 'air.wind' }] },
  'made.signet': { needs: 'workshop', lin: () => [{ w: 'earth.copper', form: 'earth.setting' }, { w: 'earth.garnet' }] },
};
const TRANSFORMED = { 'earth.setting': { from: 'earth.copper', needs: 'workshop' }, 'earth.gold': { from: 'earth.lead', needs: null } };
const TOKENS = { 'token.fruit': 'orchard', 'token.ash': null, 'token.blossom': null, 'token.carrion': null };

const ingredients = m => MADE[m].lin().flatMap(r => (r.made ? ingredients(r.made) : [r.w]));
function cardLegal(id, mods) { const c = BY_ID[id]; return !!c && (c.deckLegal || (c.folio && !c.transformedOnly && !c.made && mods.includes(c.folio))); }

function validate(spec) {
  const errors = [], notes = [];
  let f; try { f = F.resolveFormat(spec.format); } catch (e) { return { errors: ['unknown rules version ' + spec.format], notes }; }
  const mods = (f.variant && f.variant.modules) || [];
  const FMT = E.FORMAT, cap = { general: mods.includes('cap6') ? 6 : mods.includes('supply4') ? 4 : FMT.slots, supply: mods.includes('supply') || mods.includes('supply4') ? 1 : 0 };
  if (![0, 1].includes(spec.active)) errors.push('choose which side acts first');
  spec.sides.forEach((sd, i) => {
    const who = i === 0 ? 'You' : 'Rival', words = listWords(sd.list);
    if (!words) { errors.push(`${who}: choose a word list`); return; }
    const de = E.deckErrors(words, mods); if (de.length) errors.push(`${who}: the list is not legal under ${spec.format} — ${de.join('; ')}`);
    const used = new Map(), use = (w, zone) => { if (!words.includes(w)) errors.push(`${who}: ${w} is not in this side's list (${zone})`); else if (used.has(w)) errors.push(`${who}: ${w} is placed twice (${used.get(w)} and ${zone}) — every word is a single card`); else used.set(w, zone); };
    for (const t of sd.field || []) {
      const w = t.word;
      if (TOKENS[w] !== undefined) { if (TOKENS[w] && !mods.includes(TOKENS[w])) errors.push(`${who}: ${w} needs the ${TOKENS[w]} module`); continue; }
      if (MADE[w]) { if (MADE[w].needs && !mods.includes(MADE[w].needs)) errors.push(`${who}: ${w} needs the ${MADE[w].needs} module`); for (const iw of ingredients(w)) if (words.includes(iw)) use(iw, 'ingredient of ' + w.split('.')[1]); notes.push(`${who}: ${w.split('.')[1]} is placed already made; its ingredients come from the list where present, otherwise they are fixture-made`); continue; }
      if (TRANSFORMED[w]) { if (TRANSFORMED[w].needs && !mods.includes(TRANSFORMED[w].needs)) errors.push(`${who}: ${w} needs the ${TRANSFORMED[w].needs} module`); use(TRANSFORMED[w].from, 'field (worked into ' + w.split('.')[1] + ')'); continue; }
      const c = BY_ID[w]; if (!c || c.type !== 'thing') { errors.push(`${who}: ${w} is not a Thing`); continue; }
      use(w, 'field');
      if ((t.damage || 0) >= c.stand) errors.push(`${who}: ${w} would already be destroyed (damage ${t.damage} ≥ stand ${c.stand})`);
    }
    const n = (sd.field || []).length, ineligible = (sd.field || []).filter(t => !['earth.clay', 'earth.copper', 'earth.silver', 'earth.garnet', 'earth.setting', 'made.signet', 'token.fruit', 'water.cider'].includes(t.word)).length;
    if (n > cap.general + cap.supply) errors.push(`${who}: ${n} Things but this rules version has ${cap.general}${cap.supply ? ' + ' + cap.supply + ' supply' : ''} spaces`);
    else if (ineligible > cap.general) errors.push(`${who}: only stock and products (Clay, Copper, Silver, Garnet, Setting, Signet, Fruit) can use the supply space`);
    for (const w of sd.hand || []) use(w, 'hand');
    for (const w of sd.grave || []) use(w, 'grave');
    for (const w of sd.deckTop || []) use(w, 'deck top');
    if (sd.ground) { if (!BY_ID[sd.ground] || BY_ID[sd.ground].type !== 'ground') errors.push(`${who}: ${sd.ground} is not a Ground`); else use(sd.ground, 'Ground'); }
    if ((sd.hand || []).length > FMT.handCap) errors.push(`${who}: hand over ${FMT.handCap}`);
    for (const w of (sd.hand || []).concat(sd.deckTop || [], sd.grave || [])) if (BY_ID[w] && !cardLegal(w, mods)) errors.push(`${who}: ${w} is not legal under ${spec.format}`);
    const life = sd.life == null ? FMT.life : sd.life; if (!(life >= 1 && life <= FMT.life)) errors.push(`${who}: life must be 1–${FMT.life}`);
    if (!(sd.breath >= 0 && sd.breath <= FMT.poolCap)) errors.push(`${who}: breath must be 0–${FMT.poolCap}`);
    if (!(sd.reserve >= 0 && sd.reserve <= ((f.variant && f.variant.reserveCap) || FMT.reserveCap))) errors.push(`${who}: reserve must be 0–${FMT.reserveCap}`);
    if (!(sd.spark >= 0 && sd.spark <= FMT.sparkCap)) errors.push(`${who}: spark must be 0–${FMT.sparkCap}`);
    if (sd.deckRest === 'none' && !(sd.deckTop || []).length) notes.push(`${who}: empty deck — drawing will cause fatigue`);
    for (const t of sd.field || []) for (const g of t.grants || []) if (!mods.includes('w5')) errors.push(`${who}: recorded World Tree Growth only matters under the W5 rules version`); else if (!sd.field[g]) errors.push(`${who}: Growth grant points at an empty field position`);
  });
  for (const inv of spec.invites || []) {
    if (inv.kind === 'orchard' && !(mods.includes('visit') || mods.includes('visit_draw'))) errors.push('an orchard invitation needs a V (visit) rules version');
    if (inv.kind === 'heat' && !mods.includes('heat')) errors.push('a heat invitation needs the H (heat) rules version');
    if (inv.kind === 'heat' && !['fire.fire', 'fire.torch'].includes((spec.sides[inv.owner] || {}).ground)) errors.push('a heat invitation needs Fire or Torch as the host\'s Ground');
    if (inv.kind === 'orchard' && !((spec.sides[inv.owner] || {}).field || [])[inv.host]) errors.push('the orchard invitation points at an empty field position');
  }
  return { errors, notes };
}

// which rules versions this spec is compatible with, and why not for the others
function compatibility(spec, formatIds) { return formatIds.map(id => { const r = validate({ ...spec, format: id }); return { id, ok: !r.errors.length, why: r.errors[0] || null }; }); }

function build(spec) {
  const v = validate(spec); if (v.errors.length) throw new Error(v.errors[0]);
  const lists = spec.sides.map(sd => listWords(sd.list));
  const S = F.createFromFormat(spec.format, { decks: lists, seed: spec.seed || 7, first: spec.active, mulligan: () => [] });
  let seq = 0; const reg = pid => { S.registry[pid] = true; return pid; };
  spec.sides.forEach((sd, i) => {
    const p = S.players[i], pool = p.hand.concat(p.deck); p.hand = []; p.deck = [];
    const take = w => { const k = pool.findIndex(c => c.word === w); return k < 0 ? null : pool.splice(k, 1)[0]; };
    const pidFor = w => { const c = take(w); return c ? c.pid : reg('sx' + i + '_' + (++seq)); }; // from the list where present
    const lin = recs => recs.map(r => r.made ? { made: true, form: r.made, owner: i, lineage: lin(MADE[r.made].lin()) } : r.ground ? { ground: true, pid: pidFor(r.w), word: r.w, owner: i } : { pid: pidFor(r.w), word: r.w, ...(r.form ? { form: r.form } : {}), owner: i });
    const placed = [];
    for (const t of sd.field || []) {
      const base = { id: 't' + (++S.seq), owner: i, ctrl: i, entry: S.seq, damage: t.damage || 0, counters: { ...(t.counters || {}) }, status: { ...(t.status || {}) }, exhausted: !!t.exhausted, fresh: !!t.fresh, actions: 0, arrivedTurn: 0 };
      let th;
      if (TOKENS[t.word] !== undefined) th = { ...base, pid: null, word: t.word, form: t.word, token: true };
      else if (MADE[t.word]) th = { ...base, pid: null, word: t.word, form: t.word, lineage: lin(MADE[t.word].lin()) };
      else if (TRANSFORMED[t.word]) { const c = take(TRANSFORMED[t.word].from); th = { ...base, pid: c.pid, word: c.word, form: t.word }; }
      else { const c = take(t.word); th = { ...base, pid: c.pid, word: c.word }; }
      S.things.push(th); placed.push(th);
    }
    (sd.field || []).forEach((t, k) => { if (t.grants) placed[k].wtGrants = t.grants.map(g => placed[g].id); });
    for (const w of sd.hand || []) p.hand.push(take(w));
    for (const w of sd.grave || []) { const c = take(w); c.reason = 'destroyed'; p.grave.push(c); }
    if (sd.ground) p.ground = { ...take(sd.ground), damage: 0 };
    const top = (sd.deckTop || []).map(take);
    p.deck = (sd.deckRest === 'none' ? [] : pool.splice(0)).concat(top.slice().reverse()); // the deck's top is the end of the array
    p.life = sd.life == null ? E.FORMAT.life : sd.life; p.breath = sd.breath; p.reserve = sd.reserve; p.spark = sd.spark;
    if (sd.deckRest === 'none') for (const c of pool) p.sealed.push(c); // words not used are set aside (sealed), so nothing vanishes
  });
  for (const inv of spec.invites || []) {
    const owner = S.players[inv.owner];
    S.invites = (S.invites || []).concat({ id: 'inv' + (++S.seq), kind: inv.kind, owner: inv.owner, host: inv.kind === 'orchard' ? S.things.filter(t => t.ctrl === inv.owner)[inv.host].id : null, groundPid: inv.kind === 'heat' ? owner.ground.pid : null });
  }
  if (spec.market === 'empty') S.market = S.market.map(() => null);
  E.stateCheck(S);
  S.ptFixture = true; S.ptScenario = true;
  const audit = E.zoneAudit(S); if (audit.length) throw new Error('zone audit: ' + audit[0]);
  return S;
}
// a fixture object for the controller (replays store the spec itself, so a scenario always replays)
function asFixture(spec) { return { id: 'scenario', title: spec.title || 'Scenario', text: spec.text || '', format: spec.format, spec, build: () => { const S = build(spec); S.ptFixtureId = 'scenario'; return S; }, first: spec.active }; }

function blank(format = 'v32_b') {
  return { title: 'New scenario', text: '', format, active: 0, seed: 7, market: 'empty', invites: [],
    sides: [{ list: 'V03_seal_engraver', field: [], hand: [], grave: [], deckTop: [], deckRest: 'rest', ground: null, life: 30, breath: 6, reserve: 0, spark: 2 },
      { list: 'V08_patient_predator', field: [], hand: [], grave: [], deckTop: [], deckRest: 'rest', ground: null, life: 30, breath: 0, reserve: 2, spark: 2 }] };
}
module.exports = { ingredients, LISTS, MADE, TRANSFORMED, TOKENS, validate, compatibility, build, asFixture, blank, listWords };
