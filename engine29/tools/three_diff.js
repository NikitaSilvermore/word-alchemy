// Live diff: every candidate card/form row against the live engine (v33_core control and the v33_core3 trial).
// Writes three/LIVE_DIFF.csv and prints a summary. Static fields are compared mechanically; behaviour is the
// reviewed note below (what the trial build actually does, by reading/testing the code — see test/three.test.js).
'use strict';
const fs = require('fs'), path = require('path');
const E = require('../src/engine'), F = require('../src/formats');
const { BY_ID, capabilities } = require('../src/cards');
const csv = f => { const t = fs.readFileSync(path.join(__dirname, '../three', f), 'utf8'); const rows = []; let row = [], cell = '', q = false; for (let i = 0; i < t.length; i++) { const ch = t[i]; if (q) { if (ch === '"' && t[i + 1] === '"') { cell += '"'; i++; } else if (ch === '"') q = false; else cell += ch; } else if (ch === '"') q = true; else if (ch === ',') { row.push(cell); cell = ''; } else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; } else if (ch !== '\r') cell += ch; } if (cell || row.length) { row.push(cell); rows.push(row); } const h = rows.shift(); return rows.filter(r => r.length > 1).map(r => Object.fromEntries(h.map((k, i) => [k, r[i] || '']))); };
const LIVE_ID = { 'life.graft': 'life.graft3', 'reserve.apple': 'life.apple', 'reserve.tinder': 'fire.tinder', 'lf.shape': 'earth.shape3', 'reserve.hammer': 'earth.hammer', 'lf.writ': 'word.writ3', 'form.espalier': 'made.espalier', 'form.phoenix': 'made.phoenix', 'form.golem': 'made.golem3', 'form.engraved_signet': 'earth.signet3', 'form.gold': 'earth.gold' };
// reviewed behaviour of the trial build (T = changed under 'three' to the candidate; L = live V33 already matches; D = divergence kept, reported)
const NOTE = {
  'life.bee': 'T: pollination is a choice — Fruit (room and none), heal 2 life, or heal 2 marked damage on a friendly Living Thing; one attempt per player per own turn shared with Wind; flight required (Wet grounds Bee)',
  'life.pear': 'L: live growthGained already makes a Fruit the first time another friendly Plant gains Growth on your turn (room and none)',
  'life.hazel': 'T: Wind pollinates Hazel with the same three outputs and the shared allowance; Wind is wingless so Wet does not stop it',
  'life.feast': 'T: heal up to 2 on one or two friendly Living Things; optionally sacrifice a Fruit to ready one mature exhausted Thing for defence only until your next Renew (cannot attack, act, carry or fuse). V31/V33 "second wave" readying is not used',
  'life.seed': 'L', 'life.sapling': 'T: gains Bind capability; Graft rootstock. Ageing unchanged (Willow with Water Ground, else Oak)',
  'life.grow': 'L: +1 Growth and one age event (stage change at age 2, one stage per turn)',
  'life.abundance': 'T: one or two friendly Plants +1 Growth each; each chosen Tree with ≥2 Growth then gets +2 Strike this turn; no ageing (the V33 ageing revision is off)',
  'life.graft': 'T: new sense life.graft3 (display Graft). Archived life.graft (Grafted host) untouched. Vessel R01 → Espalier, 2 Breath, no catalyst, Vessel use consumed',
  'life.wolf': 'L: packBonus +1 while another friendly Beast', 'life.bramble': 'L: Reach; sting-binds a surviving Living attacker after positive retaliation',
  'life.bite': 'L: +1, reachable Living Thing or the rival; Sacred target illegal', 'life.bind': 'T: Sapling, Willow and Espalier may also Bind; Response timing as live; under three a Bound attacker in a committed group deals no damage',
  'water.water': 'L: upkeep choose a Thing: Wet and heal 1', 'water.dew': 'T: one mode — Wet one visible Thing (any side; Ward applies), heal 2 on a friendly Living Thing, or remove one poison (you or a friendly Living Thing). The V33 combined heal is off',
  'reserve.apple': 'T: new card life.apple 3 Breath 1/4; arrival makes a Fruit if you control another Flower and no Fruit (room permitting); insect-pollinated', 'water.otter': 'L',
  'air.wind': 'L', 'air.gust': 'L: Strike ≤2 non-Heavy enemy Thing returns to hand (made forms dissolve; tokens vanish)', 'air.owl': 'L: optional reveal on arrival',
  'fire.ember': 'L', 'fire.torch': 'L', 'fire.fire': 'L', 'fire.salamander': 'L', 'fire.firebird': 'L: Phoenix ingredient (R06 live recipe, 3 Breath, Ash token admitted)',
  'fire.naphtha': 'T: Wet prevents ignition again (V33 oil-on-water revision off); first successful Ignite destroys it and deals 3 at once to the two oldest visible enemy Things; no life damage; once per physical card per duel (flag by pid)',
  'fire.burn': 'T: may target your own dry Flammable Thing as well as the rival\'s', 'fire.scorch': 'L: 2 to a visible enemy Thing or the rival',
  'fire.kindle': 'T: choose — Ignite one of your dry Flammable Things, or +1 Strike and combat ignition this turn; ignition fails on a Wet target with a stated reason',
  'fire.calcine': 'T: sacrifice cost; 3 to a visible enemy Thing or the rival; Ash only if chosen at declaration, room and none; countered → sacrifice stands, no Ash',
  'fire.wildfire': 'T: one or two visible enemy Things: 1 each, or 3 to each Burning at resolution, applied together; never life; no Burning requirement to cast',
  'fire.drought': 'L (V33): entry dries every Thing; upkeep dries active player\'s Things; first own-turn hostile Ignite +1 damage', 'air.swallow': 'L', 'air.blow': 'T: a Feast defence-only Thing cannot be the payload',
  'air.gasp': 'L', 'air.winged': 'L (V33): not offered to a Thing that already flies',
  'reserve.tinder': 'T: new card fire.tinder 1 Breath 0/1; Main, 1 Breath, sacrifice: Ignite a visible dry Flammable Thing other than itself; if it was yours and caught, Ash (room and none). Fresh may be used',
  'earth.clay': 'T: Main, 1 Breath, sacrifice Clay (Fresh or exhausted): the next positive damage packet to another friendly Thing before your next Renew is reduced by up to 3. Golem ingredient',
  'earth.lead': 'L', 'earth.copper': 'T: Shape edges added (Hammer, Signet); one metal change per instance per turn shared with Transmute', 'earth.silver': 'T: Shape edge to Signet added', 'earth.iron': 'T: Shape edge to Hammer added',
  'earth.flint': 'L: Burn explicit; Cut derives from Sharp', 'earth.boulder': 'L: Bedrock +1 at upkeep, cap 2',
  'earth.crucible': 'T: temper added — Main, 1 Breath, exhaust a mature ready damaged Metal: heal 2 from it, once per own turn. Fusion discount live (−1, floor 2)',
  'earth.transmute': 'L', 'earth.guard': 'T: Reach and +2 Stand until your next Renew (live V33 gave temporary Guard + 2 Stand this turn); expiry can kill',
  'earth.crush': 'T: never targets the rival or a Ground; overflow measured on damage actually dealt (after Clay shield); none if Phoenix rebirth prevents death',
  'lf.shape': 'T: new sense earth.shape3 (display Shape). Archived earth.shape (Setting) untouched', 'word.word': 'L', 'word.scribe': 'L',
  'reserve.hammer': 'T: new card earth.hammer 3 Breath 2/3 Metal Tool; Main, 1 Breath + exhaust: 2 to a visible damaged enemy Thing or the enemy Ground. Same definition for drawn and shaped Hammer',
  'lf.writ': 'T: new sense word.writ3 (display Writ): exhaust a ready visible enemy Thing with Strike ≤2; or stamp by exhausting your mature ready Signet as a cost to exhaust one or two ready enemy Things of any Strike',
  'word.omen': 'L', 'word.protect': 'L', 'word.doubt': 'L: cannot cancel abilities, combat, Actions or a bare Vessel fusion',
  'word.awaken': 'T: any friendly non-living Thing (live excluded Bodies); a Body only gains the Might',
  'token.fruit': 'L (V33): eat for 2 life, 2 marked damage on a Living Thing, or one poison; can pay for Feast', 'token.ash': 'L',
  'form.espalier': 'T: new made.espalier 3/5 Reach, Bind; upkeep: Fruit (none and room) or +1 Growth to another friendly Plant', 'form.phoenix': 'L: 4/4 Flying, once per player per duel destruction replacement (clear damage, exhaust)',
  'form.golem': 'T: new made.golem3 (display Golem) 4/5 Heavy Guard Reach; ordinary attack spills excess through a destroyed blocker once. Archived made.golem 3/5 untouched',
  'form.engraved_signet': 'T: new form earth.signet3 (display Signet) 0/4 Metal Instrument; Main, 1 + exhaust: Ward another friendly Thing lacking Ward; or pays Writ\'s stamp. Archived made.signet (Setting + Garnet) and reserve Signet Ground untouched',
  'life.oak': 'L', 'life.willow': 'T: gains Bind', 'earth.tin': 'L', 'form.gold': 'L: upkeep +1 Breath within the extra-income cap',
};
const S0 = F.createFromFormat('v33_core3', { decks: [require('../data/v33_decks').THREE_DECKS.orchard.words, require('../data/v33_decks').THREE_DECKS.forge.words], seed: 1, first: 0, mulligan: () => [] });
const out = [['row_kind', 'candidate_id', 'live_id', 'type', 'breath(c/l)', 'strike(c/l)', 'stand(c/l)', 'static_match', 'behaviour']];
let mism = 0;
const add = (kind, cid, x, type, b, st, sd) => {
  const lid = LIVE_ID[cid] || cid, d = BY_ID[lid];
  if (!d) { out.push([kind, cid, 'MISSING', type, '', '', '', 'no', NOTE[cid] || '']); mism++; return; }
  const num = v => (v === '' || v === '—' || v == null ? null : +v);
  const lb = d.type === 'thing' || d.type === 'ground' || d.type === 'spell' || d.type === 'action' || d.type === 'weather' || d.type === 'quality' ? (kind === 'form' ? null : d.cost) : null;
  const ok = (num(b) == null || num(b) === lb) && (num(st) == null || num(st) === (d.strike ?? null)) && (num(sd) == null || num(sd) === (d.stand ?? null));
  if (!ok) mism++;
  out.push([kind, cid, lid, d.type, `${b}/${lb ?? ''}`, `${st}/${d.strike ?? ''}`, `${sd}/${d.stand ?? ''}`, ok ? 'yes' : 'NO', NOTE[cid] || 'L']);
};
for (const r of csv('01_Core_Cards.csv')) add('card', r.card_id, r, r.type, r.breath, r.strike, r.stand);
for (const r of csv('01_Result_Forms.csv')) add('form', r.form_id, r, r.kind, '', r.strike, r.stand);
fs.writeFileSync(path.join(__dirname, '../three/LIVE_DIFF.csv'), out.map(r => r.map(v => /[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : v).join(',')).join('\n') + '\n');
console.log('rows', out.length - 1, 'static mismatches', mism, '| changed (T)', out.filter(r => /^T/.test(r[8])).length, '| live (L)', out.filter(r => /^L/.test(r[8])).length, '| divergence (D)', out.filter(r => /^D/.test(r[8])).length);
for (const r of out.slice(1)) if (r[7] !== 'yes') console.log(' mismatch', r.join(' | '));
void S0; void E; void capabilities;
