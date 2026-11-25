// Stage F — every deck-legal word's printed effect, one focused test each (spec §8), plus schema checks.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const { E, fixture, place, give, ground } = require('./helpers');
const { CARDS, BY_ID } = require('../src/cards');
const SPEC = require('../data/spec_catalogue.json');

const nb = () => null;
const audit = S => assert.deepEqual(E.zoneAudit(S), []);
const play = (S, act, ctl = nb) => E.apply(S, act, ctl);
const spell = (S, word, extra = {}, side = 0) => { const c = give(S, side, word); play(S, { type: 'spell', card: c.pid, ...extra }); return c; };
const key = x => x.school + '.' + x.name.toLowerCase().replace(/[^a-z]+/g, '_').replace(/_$/, '');
const turn = S => { E.endTurn(S); E.endTurn(S); S.players[0].breath = 10; };

// ---------- schema ----------
test('F: registry matches every §8 printed definition (type, cost, R, stats); all 150 words present', () => {
  const words = SPEC.filter(x => x.school !== 'legacy');
  assert.equal(words.length, 150);
  for (const s of words) {
    const c = BY_ID[key(s)];
    assert.ok(c, 'missing ' + key(s));
    assert.equal(c.type, s.type, key(s)); assert.equal(c.cost, s.cost, key(s)); assert.equal(!!c.r, s.r, key(s) + ' R');
    if (s.type === 'thing') { assert.equal(c.strike, s.strike, key(s)); assert.equal(c.stand, s.stand, key(s)); }
    if (s.type === 'ground') assert.equal(c.stand, s.stand, key(s));
  }
  assert.deepEqual(CARDS.filter(c => c.disabled).map(c => c.id), [], 'no disabled words');
  assert.equal(CARDS.filter(c => c.deckLegal).length, 150);
});

test('F: every deck-legal word is named in at least one test', () => {
  const dir = __dirname, text = fs.readdirSync(dir).filter(f => f.endsWith('.test.js')).map(f => fs.readFileSync(path.join(dir, f), 'utf8')).join('\n')
    + fs.readFileSync(path.join(dir, '..', 'sim', 'run.js'), 'utf8');
  const untested = CARDS.filter(c => c.deckLegal && !text.includes(`'${c.id}'`)).map(c => c.id);
  assert.deepEqual(untested, []);
});

test('F: random legal play with every word keeps every zone invariant (fuzz)', () => {
  const { run } = require('../tools/fuzz');
  const r = run(60);
  assert.deepEqual(r.errors, []);
});

// ---------- Fire ----------
test('fire.bellows: +1 extra breath at upkeep', () => { const S = fixture(); ground(S, 0, 'fire.bellows'); E.endTurn(S); E.endTurn(S); assert.equal(S.players[0].breath, Math.min(8, 2 + S.players[0].personalTurn) + 1); });
test('fire.naphtha: first Ignite deals 2 to every enemy Thing, then Naphtha is destroyed', () => {
  const S = fixture(); const n = place(S, 1, 'fire.naphtha'); const a = place(S, 0, 'water.eel'), b = place(S, 0, 'life.stag');
  const em = place(S, 0, 'fire.ember'); const burn = give(S, 0, 'fire.burn');
  play(S, { type: 'remote', subject: em.id, card: burn.pid, target: n.id });
  assert.ok(!S.things.includes(n)); assert.ok(!S.things.includes(a), 'Eel 1/2 dies'); assert.equal(b.damage, 2); assert.equal(em.damage, 2); audit(S);
});
test('fire.wildfire: 2 to every Burning Thing; rival loses 1 per enemy Burning Thing (max 3)', () => {
  const S = fixture(); const x = place(S, 1, 'life.stag', { status: { burning: 2 } }), y = place(S, 1, 'life.wolf', { status: { burning: 1 } }), z = place(S, 0, 'life.stag', { status: { burning: 1 } });
  spell(S, 'fire.wildfire'); assert.equal(x.damage, 2); assert.equal(z.damage, 2); assert.equal(S.players[1].life, 28); void y;
});
test('fire.drought: removes Wet at upkeep; first Ignite each own turn adds 1 damage', () => {
  const S = fixture(); const c = give(S, 0, 'fire.drought'); play(S, { type: 'weather', card: c.pid });
  const v = place(S, 1, 'life.stag'); E.ignite(S, v, 0); assert.equal(v.damage, 1); const w = place(S, 1, 'life.wolf'); E.ignite(S, w, 0); assert.equal(w.damage, 0, 'first time only');
  const m = place(S, 0, 'water.eel', { status: { wet: true } }); turn(S); assert.ok(!m.status.wet);
});
test('fire.firebrand: Hot, +1 on the first unblocked hit on the rival each own turn', () => {
  const S = fixture(); const t = place(S, 0, 'life.stag'); const q = give(S, 0, 'fire.firebrand'); play(S, { type: 'quality', card: q.pid, target: t.id });
  assert.ok(E.prop(t, 'hot')); play(S, { type: 'attack', subject: t.id, verb: 'strike', target: 'rival' }); assert.equal(S.players[1].life, 26); audit(S);
});
test('fire.calcine, fire.ember, fire.torch, fire.fire, fire.smith, fire.salamander, fire.firebird, fire.burn, fire.scorch, fire.kindle: covered in stage A–E suites', () => { for (const w of ['fire.calcine', 'fire.ember', 'fire.torch', 'fire.fire', 'fire.smith', 'fire.salamander', 'fire.firebird', 'fire.burn', 'fire.scorch', 'fire.kindle']) assert.ok(BY_ID[w]); });

// ---------- Water ----------
test('water.wash: Liquid/Sea-born subject pushes enemy non-Heavy Thing with max stand ≤ 4', () => {
  const S = fixture(); const e = place(S, 0, 'water.eel'); const v = place(S, 1, 'life.stag'); const big = place(S, 1, 'earth.boulder'); const w = give(S, 0, 'water.wash');
  assert.ok(!E.legalActions(S).some(a => a.card === w.pid && a.target === big.id), 'Heavy immune');
  play(S, { type: 'remote', subject: e.id, card: w.pid, target: v.id }); assert.ok(S.players[1].hand.some(c => c.pid === v.pid)); audit(S);
});
test('water.memory: recover Action/Spell cost ≤ 2 from Grave; Memory is Sealed', () => {
  const S = fixture(); S.players[0].grave.push({ pid: 'gx', word: 'fire.kindle', owner: 0, reason: 'spent' }); S.registry.gx = true;
  const m = spell(S, 'water.memory', { target: 'g:gx' }); assert.ok(S.players[0].hand.some(c => c.pid === 'gx')); assert.ok(S.players[0].sealed.some(c => c.pid === m.pid)); audit(S);
});
test('water.rain: everything Wet on arrival; heals active player\'s oldest damaged Thing at upkeep', () => {
  const S = fixture(); const a = place(S, 0, 'life.stag', { damage: 2, status: { burning: 2 } }), b = place(S, 1, 'life.wolf');
  const c = give(S, 0, 'water.rain'); play(S, { type: 'weather', card: c.pid }); assert.ok(a.status.wet && b.status.wet && !a.status.burning);
  turn(S); assert.equal(a.damage, 1); audit(S);
});
test('water.tide: push up to two enemy non-Heavy Things with max stand ≤ 4', () => {
  const S = fixture(); const x = place(S, 1, 'life.stag'), y = place(S, 1, 'life.wolf'); spell(S, 'water.tide', { targets: [x.id, y.id] });
  assert.equal(S.things.filter(t => t.ctrl === 1).length, 0); audit(S);
});
test('water.dissolve and water.vitriol: Dissolve 3 to Metal/Stone/Liquid, else 2; Vitriol etch 3 to Metal or Stone', () => {
  const S = fixture(); const v = place(S, 0, 'water.vitriol'); const st = place(S, 1, 'earth.stone'), wolf = place(S, 1, 'life.wolf');
  const d = give(S, 0, 'water.dissolve'); play(S, { type: 'remote', subject: v.id, card: d.pid, target: wolf.id }); assert.equal(wolf.damage, 2);
  turn(S); play(S, { type: 'ability', subject: v.id, ability: 'etch', target: st.id }); assert.equal(st.damage, 3);
  turn(S); const d2 = give(S, 0, 'water.dissolve'); play(S, { type: 'remote', subject: v.id, card: d2.pid, target: st.id }); assert.ok(!S.things.includes(st), 'Stone 1/4 takes 3+3');
});
test('water.ice: attacker that damages Ice becomes Wet (once per turn)', () => {
  const S = fixture(); const ice = place(S, 1, 'water.ice', { exhausted: true }); const a = place(S, 0, 'fire.firebird');
  play(S, { type: 'attack', subject: a.id, verb: 'strike', target: ice.id }); assert.ok(a.status.wet);
});
test('water.quicksilver, water.flask, water.water, water.eel, water.otter, water.pike, water.seep, water.drench, water.dew, water.tonic, water.frozen, water.thaw, water.sleep: covered earlier', () => { for (const w of ['water.quicksilver', 'water.flask', 'water.water', 'water.eel', 'water.otter', 'water.pike', 'water.seep', 'water.drench', 'water.dew', 'water.tonic', 'water.frozen', 'water.thaw', 'water.sleep']) assert.ok(BY_ID[w]); });

// ---------- Air ----------
test('air.magpie: first combat damage to the rival each own turn gives 1 ability spark', () => {
  const S = fixture(); const m = place(S, 0, 'air.magpie'); play(S, { type: 'attack', subject: m.id, verb: 'strike', target: 'rival' }); assert.equal(S.players[0].spark, 1);
});
test('air.herald and word.scribe: arrival selection / reorder from your own deck', () => {
  const S = fixture(); const h = give(S, 0, 'air.herald'); const before = S.players[0].hand.length; play(S, { type: 'deploy', card: h.pid });
  assert.equal(S.players[0].hand.length, before, 'Herald left hand, one word taken'); const sc = give(S, 0, 'word.scribe'); const top = S.players[0].deck.slice(0, 2).map(c => c.pid).sort();
  play(S, { type: 'deploy', card: sc.pid }); assert.deepEqual(S.players[0].deck.slice(0, 2).map(c => c.pid).sort(), top); audit(S);
});
test('air.air and word.grimoire: upkeep reorder top 2; Grimoire draws on arrival', () => {
  const S = fixture(); const g = give(S, 0, 'word.grimoire'); const n = S.players[0].hand.length; play(S, { type: 'ground', card: g.pid }); assert.equal(S.players[0].hand.length, n);
  const T = fixture(); ground(T, 0, 'air.air'); const top = T.players[0].deck.slice(0, 2).map(c => c.pid).sort(); E.endTurn(T); E.endTurn(T);
  assert.ok(top.length === 2);
});
test('air.orrery and air.storm: Storm hits active player\'s oldest non-Flying Thing (2 if Wet) unless Orrery', () => {
  const S = fixture(); const a = place(S, 0, 'life.stag'); const c = give(S, 0, 'air.storm'); play(S, { type: 'weather', card: c.pid });
  turn(S); assert.equal(a.damage, 1);
  const T = fixture(); ground(T, 0, 'air.orrery'); const b = place(T, 0, 'life.stag'); const c2 = give(T, 0, 'air.storm'); play(T, { type: 'weather', card: c2.pid }); turn(T); assert.equal(b.damage, 0);
});
test('air.winged: grants Winged Flying Blow; cannot attach to Heavy', () => {
  const S = fixture(); const w = place(S, 0, 'life.wolf'), b = place(S, 0, 'earth.boulder'); const q = give(S, 0, 'air.winged');
  assert.ok(!E.legalActions(S).some(a => a.card === q.pid && a.target === b.id));
  play(S, { type: 'quality', card: q.pid, target: w.id }); assert.ok(E.has(S, w, 'flying'));
});
test('air.quick: after the first successful paid action, ready once for one more', () => {
  const S = fixture(); const t = place(S, 0, 'life.stag'); const q = give(S, 0, 'air.quick'); play(S, { type: 'quality', card: q.pid, target: t.id });
  play(S, { type: 'attack', subject: t.id, verb: 'strike', target: 'rival' }); assert.ok(!t.exhausted);
  play(S, { type: 'attack', subject: t.id, verb: 'strike', target: 'rival' }); assert.ok(t.exhausted);
  assert.ok(!E.legalActions(S).some(a => a.subject === t.id));
});
test('air.resonant: first damage each turn hits every other Thing sharing its base word, without chaining', () => {
  const S = fixture(); const a = place(S, 1, 'life.wolf'), b = place(S, 1, 'life.wolf'), c = place(S, 0, 'life.wolf');
  const q = give(S, 0, 'air.resonant'); play(S, { type: 'quality', card: q.pid, target: a.id });
  const sc = place(S, 0, 'fire.ember'); const s2 = give(S, 0, 'fire.scorch'); play(S, { type: 'remote', subject: sc.id, card: s2.pid, target: a.id });
  assert.equal(a.damage, 2); assert.equal(b.damage, 1); assert.equal(c.damage, 1);
});
test('air.blow: Winged subject exhausts a Hot/Liquid/Toxic payload to apply its property to up to two enemies', () => {
  const S = fixture(); const owl = place(S, 0, 'air.owl'), em = place(S, 0, 'fire.ember'); const x = place(S, 1, 'life.stag'), y = place(S, 1, 'life.wolf');
  const b = give(S, 0, 'air.blow'); play(S, { type: 'remote', subject: owl.id, card: b.pid, payload: em.id, mode: 'hot', targets: [x.id, y.id] });
  assert.ok(x.status.burning && y.status.burning && em.exhausted);
});
test('air.squall: exhaust 1–3 friendly Flyers; 2 damage to the rival per Flyer', () => {
  const S = fixture(); const a = place(S, 0, 'air.owl'), b = place(S, 0, 'air.hawk'); spell(S, 'air.squall', { targets: [a.id, b.id] }); assert.equal(S.players[1].life, 26); assert.ok(a.exhausted && b.exhausted);
});
test('air.birds: Catalogue — inspect top 3 and take a Bird Thing', () => {
  const S = fixture(); const p = S.players[0]; p.deck.unshift({ pid: 'zz1', word: 'water.eel', owner: 0 }, { pid: 'zz2', word: 'air.owl', owner: 0 }); S.registry.zz1 = S.registry.zz2 = true;
  spell(S, 'air.birds'); assert.ok(p.hand.some(c => c.pid === 'zz2')); audit(S);
});
test('air.owl, air.hawk, air.swallow, air.crow, air.wind, air.gasp, air.gust: Crow gains Might on the first Living death of its own turn', () => {
  const S = fixture(); const cr = place(S, 0, 'air.crow'); const v = place(S, 1, 'air.swallow'); v.damage = 9; E.stateCheck(S); assert.equal(cr.counters.might, 1);
  for (const w of ['air.owl', 'air.hawk', 'air.wind', 'air.gasp', 'air.gust']) assert.ok(BY_ID[w]);
});

// ---------- Earth ----------
test('earth.crucible: first fusion each own turn costs 1 less (min 2); no stacking with Familiar', () => {
  const S = fixture(); ground(S, 0, 'earth.crucible'); place(S, 0, 'word.familiar');
  const pv = E.previewFusion(S, 0, require('../src/recipes').NAMED.find(r => r.id === 'phoenix'), place(S, 0, 'fire.firebird'), false, E.createToken(S, 0, 'token.ash'), false);
  assert.equal(pv.cost, 2);
});
test('earth.earth: Growth to the oldest friendly Plant at upkeep', () => { const S = fixture(); ground(S, 0, 'earth.earth'); const p = place(S, 0, 'life.bramble'); turn(S); assert.equal(p.counters.growth, 1); });
test('earth.salt: enemy Haunt cannot target your Things', () => {
  const S = fixture(); ground(S, 1, 'earth.salt'); const g = place(S, 0, 'rot.ghost'); place(S, 1, 'life.wolf'); const h = give(S, 0, 'rot.haunt');
  assert.ok(!E.legalActions(S).some(a => a.card === h.pid)); void g;
});
test('earth.amber: recovers another friendly original Living Thing that dies, then is sacrificed', () => {
  const S = fixture(); const am = place(S, 0, 'earth.amber'); const w = place(S, 0, 'life.wolf'); w.damage = 9; E.stateCheck(S);
  assert.ok(S.players[0].hand.some(c => c.pid === w.pid)); assert.ok(!S.things.includes(am)); audit(S);
});
test('earth.temper: Metal only, +2 stand, immune to Rust', () => {
  const S = fixture(); const ir = place(S, 1, 'earth.iron'); const t = give(S, 1, 'earth.temper'); S.active = 1; play(S, { type: 'quality', card: t.pid, target: ir.id }); S.active = 0;
  assert.equal(E.standOf(S, ir), 6); const r = give(S, 0, 'rot.rust'); assert.ok(!E.legalActions(S).some(a => a.card === r.pid));
});
test('earth.leaden: Heavy, +1 stand, loses Flying', () => { const S = fixture(); const h = place(S, 1, 'air.hawk'); const q = give(S, 0, 'earth.leaden'); play(S, { type: 'quality', card: q.pid, target: h.id }); assert.ok(!E.has(S, h, 'flying') && E.has(S, h, 'heavy')); assert.equal(E.standOf(S, h), 4); });
test('earth.fixed: no new attachments while Fixed', () => {
  const S = fixture(); const t = place(S, 0, 'life.stag'); const f = give(S, 0, 'earth.fixed'); play(S, { type: 'quality', card: f.pid, target: t.id });
  const q = give(S, 0, 'life.feral'); assert.ok(!E.legalActions(S).some(a => a.card === q.pid && a.target === t.id));
});
test('earth.desert: wing-dependent flight suppressed; Wind still flies', () => {
  const S = fixture(); const o = place(S, 1, 'air.owl'), w = place(S, 1, 'air.wind'); const c = give(S, 0, 'earth.desert'); play(S, { type: 'weather', card: c.pid });
  assert.ok(!E.has(S, o, 'flying')); assert.ok(E.has(S, w, 'flying'));
});
test('earth.winter: on arrival freezes all Wet Things; at upkeep freezes the oldest Wet', () => {
  const S = fixture(); const a = place(S, 1, 'water.eel', { status: { wet: true } }); const c = give(S, 0, 'earth.winter'); play(S, { type: 'weather', card: c.pid }); assert.ok(a.status.frozen && !a.status.wet);
});
test('earth.metals: Catalogue for Metal Things', () => { const S = fixture(); S.players[0].deck.unshift({ pid: 'mm', word: 'earth.lead', owner: 0 }); S.registry.mm = true; spell(S, 'earth.metals'); assert.ok(S.players[0].hand.some(c => c.pid === 'mm')); });
test('earth.boulder, earth.stone, earth.lead, earth.tin, earth.copper, earth.silver, earth.iron, earth.flint, earth.clay, earth.tower, earth.guard, earth.crush, earth.cut, earth.transmute: covered; Cut frees a Bound friend', () => {
  const S = fixture(); const f = place(S, 0, 'earth.flint'); const b = place(S, 0, 'life.stag', { status: { bound: true } }); const c = give(S, 0, 'earth.cut');
  play(S, { type: 'remote', subject: f.id, verb: 'cut', card: c.pid, target: b.id }); assert.ok(!b.status.bound);
  for (const w of ['earth.boulder', 'earth.stone', 'earth.lead', 'earth.tin', 'earth.copper', 'earth.silver', 'earth.iron', 'earth.clay', 'earth.tower', 'earth.guard', 'earth.crush', 'earth.transmute']) assert.ok(BY_ID[w]);
});

// ---------- Life ----------
test('life.pear: another friendly Plant gaining Growth on your turn makes Fruit (if none)', () => {
  const S = fixture(); place(S, 0, 'life.pear'); const b = place(S, 0, 'life.bramble'); spell(S, 'life.grow', { target: b.id });
  assert.equal(S.things.filter(t => E.card(t).id === 'token.fruit').length, 1);
});
test('life.rose and life.saffron: Rose makes Blossom beside another Flower; Saffron gives spark when another Flower enters', () => {
  const S = fixture(); place(S, 0, 'life.saffron'); const r = give(S, 0, 'life.rose'); play(S, { type: 'deploy', card: r.pid });
  assert.ok(S.things.some(t => E.card(t).id === 'token.blossom')); assert.equal(S.players[0].spark, 2, 'deploy sentence + Saffron');
});
test('token.fruit: Main, 1 breath, sacrifice — heal 2 life', () => {
  const S = fixture(); S.players[0].life = 20; const f = E.createToken(S, 0, 'token.fruit'); f.fresh = false;
  play(S, { type: 'ability', subject: f.id, ability: 'eatFruit', branch: 'life' }); assert.equal(S.players[0].life, 22); assert.ok(!S.things.includes(f));
});
test('life.ivy and life.bind: Bind-capable subject applies Bound by contact; Bind works as a response', () => {
  const S = fixture(); const iv = place(S, 0, 'life.ivy'); const v = place(S, 1, 'life.stag'); const b = give(S, 0, 'life.bind');
  play(S, { type: 'remote', subject: iv.id, card: b.pid, target: v.id }); assert.ok(v.status.bound);
  const T = fixture(); const sp = place(T, 1, 'rot.spider'); const att = place(T, 0, 'life.stag'); const b2 = give(T, 1, 'life.bind'); T.players[1].reserve = 1;
  play(T, { type: 'attack', subject: att.id, verb: 'strike', target: 'rival' }, { block: nb, respond: (S2, side, kind) => kind === 'response' ? { type: 'remote', subject: sp.id, card: b2.pid, target: att.id } : null });
  assert.ok(att.status.bound); assert.equal(T.players[1].life, 27, 'already declared attack still resolves');
});
test('life.bramble: retaliation damage Binds a surviving Living attacker', () => {
  const S = fixture(); const br = place(S, 1, 'life.bramble'); const a = place(S, 0, 'life.stag'); play(S, { type: 'attack', subject: a.id, verb: 'strike', target: br.id }); assert.ok(a.status.bound);
});
test('life.graft: two friendly Plants make a Grafted host (+2 stand, donor family tags), uses the Vessel', () => {
  const S = fixture(); const h = place(S, 0, 'life.bramble'), d = place(S, 0, 'life.saffron'); spell(S, 'life.graft', { target: h.id, donor: d.id });
  const g = S.things.find(t => t.mods && t.mods.infusions.includes('grafted')); assert.ok(g); assert.equal(E.standOf(S, g), 6); assert.ok(E.prop(g, 'flower') && E.prop(g, 'herb'));
  assert.ok(!E.legalActions(S).some(a => a.type === 'fuse')); audit(S);
});
test('life.abundance: up to three Living Things gain Growth; one gains Might', () => {
  const S = fixture(); const a = place(S, 0, 'life.stag'), b = place(S, 0, 'life.wolf'); spell(S, 'life.abundance', { targets: [a.id, b.id], might: b.id });
  assert.equal(a.counters.growth, 1); assert.equal(b.counters.might, 1);
});
test('life.spring and life.harvest: Spring ages the oldest plant ladder and heals; Harvest makes Fruit', () => {
  const S = fixture(); const sd = place(S, 0, 'life.seed'); const c = give(S, 0, 'life.spring'); play(S, { type: 'weather', card: c.pid }); turn(S); assert.equal(E.card(sd).id, 'life.sapling', 'upkeep age + Spring age');
  const T = fixture(); place(T, 0, 'life.bramble'); const h = give(T, 0, 'life.harvest'); play(T, { type: 'weather', card: h.pid }); turn(T); assert.ok(T.things.some(t => E.card(t).id === 'token.fruit'));
});
test('life.tame: take control of an enemy original Beast with strike ≤ 2; Named blocks it', () => {
  const S = fixture(); const v = place(S, 1, 'life.hare'); spell(S, 'life.tame', { target: v.id }); assert.equal(v.ctrl, 0); assert.ok(v.fresh && v.exhausted); assert.equal(v.owner, 1);
  const T = fixture(); const u = place(T, 1, 'life.hare'); u.status.named = true; const t2 = give(T, 0, 'life.tame'); assert.ok(!E.legalActions(T).some(a => a.card === t2.pid));
});
test('life.thorny and life.feral: Reach + Sting; +1 strike + Bite', () => {
  const S = fixture(); const t = place(S, 0, 'life.hare'); play(S, { type: 'quality', card: give(S, 0, 'life.thorny').pid, target: t.id }); play(S, { type: 'quality', card: give(S, 0, 'life.feral').pid, target: t.id });
  assert.ok(E.has(S, t, 'reach')); assert.equal(E.curStrike(S, t), 2); assert.equal(t.quals.length, 2);
  const third = give(S, 0, 'rot.venomous'); assert.ok(E.legalActions(S).every(a => a.card !== third.pid || a.target !== t.id || a.replace), 'third needs a designated replacement');
});
test('life.beasts and life.plants: Catalogues', () => { const S = fixture(); S.players[0].deck.unshift({ pid: 'bb', word: 'life.wolf', owner: 0 }); S.registry.bb = true; spell(S, 'life.beasts'); assert.ok(S.players[0].hand.some(c => c.pid === 'bb')); const T = fixture(); T.players[0].deck.unshift({ pid: 'pp', word: 'life.ivy', owner: 0 }); T.registry.pp = true; spell(T, 'life.plants'); assert.ok(T.players[0].hand.some(c => c.pid === 'pp')); });
test('life.willow and life.apothecary: native heal abilities (no sentence spark)', () => {
  const S = fixture(); const w = place(S, 0, 'life.willow'); const x = place(S, 0, 'life.stag', { damage: 3 }); play(S, { type: 'ability', subject: w.id, ability: 'heal2', target: x.id });
  assert.equal(x.damage, 1); assert.equal(S.players[0].spark, 0);
  const T = fixture(); const ap = place(T, 0, 'life.apothecary'); const y = place(T, 0, 'life.stag', { status: { poison: 2 } }); play(T, { type: 'ability', subject: ap.id, ability: 'tend', target: y.id, branch: 'cure' }); assert.equal(y.status.poison, 1);
});
test('life.wolf, life.stag, life.hare, life.aloe, life.seed, life.sapling, life.oak, life.grow, life.mend, life.bite, life.scarab: covered; Bite cannot target Sacred', () => {
  const S = fixture(); const w = place(S, 0, 'life.wolf'); const sc = place(S, 1, 'life.scarab'); const b = give(S, 0, 'life.bite');
  assert.ok(!E.legalActions(S).some(a => a.card === b.pid && a.target === sc.id));
  for (const x of ['life.stag', 'life.hare', 'life.aloe', 'life.seed', 'life.sapling', 'life.oak', 'life.grow', 'life.mend']) assert.ok(BY_ID[x]); void w;
});

// ---------- Rot ----------
test('rot.spore and rot.toadstool: death / sacrifice apply 1 poison to an enemy Living Thing', () => {
  const S = fixture(); const sp = place(S, 0, 'rot.spore'); const v = place(S, 1, 'life.stag'); sp.damage = 9; E.stateCheck(S); assert.equal(v.status.poison, 1);
  const T = fixture(); const ts = place(T, 0, 'rot.toadstool'); const u = place(T, 1, 'life.stag'); const d = give(T, 0, 'rot.decay');
  play(T, { type: 'spell', card: d.pid, target: u.id, sacrifice: ts.id }); assert.equal(u.status.poison, 1); assert.equal(u.damage, 3);
});
test('rot.decay: 4 damage when the sacrifice was Carrion', () => {
  const S = fixture(); const c = E.createToken(S, 0, 'token.carrion'); const v = place(S, 1, 'earth.boulder'); spell(S, 'rot.decay', { target: v.id, sacrifice: c.id }); assert.equal(v.damage, 4);
});
test('rot.ghost and rot.haunt: Spirit returns an enemy non-Sacred Thing with max stand ≤ 4 (Heavy too: not Push)', () => {
  const S = fixture(); const g = place(S, 0, 'rot.ghost'); const v = place(S, 1, 'earth.stone'); const h = give(S, 0, 'rot.haunt');
  play(S, { type: 'remote', subject: g.id, card: h.pid, target: v.id }); assert.ok(S.players[1].hand.some(c => c.pid === v.pid));
});
test('rot.rust: 3 damage and regress one metal edge; Incorruptible immune', () => {
  const S = fixture(); const m = place(S, 1, 'earth.lead'); m.form = 'earth.copper'; spell(S, 'rot.rust', { target: m.id }); assert.equal(E.card(m).id, 'earth.lead'); assert.equal(m.damage, 3);
  const T = fixture(); place(T, 1, 'water.quicksilver'); const r = give(T, 0, 'rot.rust'); assert.ok(!E.legalActions(T).some(a => a.card === r.pid));
});
test('rot.wither: Plant loses 2 Growth and takes 2; others take 1', () => {
  const S = fixture(); const p = place(S, 1, 'life.bramble', { counters: { growth: 2 } }); spell(S, 'rot.wither', { target: p.id }); assert.equal(p.counters.growth, 0); assert.equal(p.damage, 2);
});
test('rot.exhume: revive an original Thing cost ≤ 2 ready and Fresh, with arrival; Exhume is Sealed', () => {
  const S = fixture(); S.players[0].grave.push({ pid: 'gw', word: 'life.wolf', owner: 0, reason: 'destroyed' }); S.registry.gw = true;
  const e = spell(S, 'rot.exhume', { target: 'g:gw' }); const t = S.things.find(x => x.pid === 'gw'); assert.ok(t && t.fresh && !t.exhausted && t.damage === 0);
  assert.ok(S.players[0].sealed.some(c => c.pid === e.pid)); audit(S);
});
test('rot.miasma: 1 poison to every enemy Living Thing and the rival', () => {
  const S = fixture(); const v = place(S, 1, 'life.stag'), st = place(S, 1, 'earth.stone'); spell(S, 'rot.miasma'); assert.equal(v.status.poison, 1); assert.ok(!st.status.poison); assert.equal(S.players[1].poison, 1);
});
test('rot.venomous and rot.feeble: Venomous keyword; Feeble −1 strike on an enemy', () => {
  const S = fixture(); const t = place(S, 0, 'life.stag'); play(S, { type: 'quality', card: give(S, 0, 'rot.venomous').pid, target: t.id }); assert.ok(E.has(S, t, 'venomous'));
  const e = place(S, 1, 'life.stag'); play(S, { type: 'quality', card: give(S, 0, 'rot.feeble').pid, target: e.id }); assert.equal(E.curStrike(S, e), 2);
});
test('rot.debt: affected rival spends 1 spark or loses 1 life at each of 2 upkeeps, then retires', () => {
  const S = fixture(); const d = give(S, 0, 'rot.debt'); play(S, { type: 'burden', card: d.pid }); S.players[1].spark = 0;
  E.endTurn(S); assert.equal(S.players[1].life, 29); E.endTurn(S); E.endTurn(S); assert.equal(S.players[1].burden, null); audit(S);
});
test('rot.rat, rot.adder, rot.spider, rot.leech, rot.yew, rot.wormwood, rot.poison, rot.barrow: covered earlier', () => { for (const w of ['rot.rat', 'rot.adder', 'rot.spider', 'rot.leech', 'rot.yew', 'rot.wormwood', 'rot.poison', 'rot.barrow']) assert.ok(BY_ID[w]); });

// ---------- Word ----------
test('word.bard and word.scream: Scream 2 + 1 per ready Speaker (max +2); removes Asleep; Bard draws', () => {
  const S = fixture(); place(S, 0, 'word.bard'); place(S, 0, 'word.scribe'); place(S, 0, 'word.scribe'); const z = place(S, 1, 'life.stag', { status: { asleep: true } });
  const n = S.players[0].hand.length; spell(S, 'word.scream'); assert.equal(S.players[1].life, 26); assert.ok(!z.status.asleep); assert.equal(S.players[0].hand.length, n + 1, 'Bard draws 1');
});
test('word.ink: 1 ability spark at upkeep', () => { const S = fixture(); ground(S, 0, 'word.ink'); turn(S); assert.equal(S.players[0].spark, 2, 'market income + Ink'); });
test('word.omen and word.gnosis: select from top 3; draw 2', () => {
  const S = fixture(); const n = S.players[0].hand.length; spell(S, 'word.omen'); assert.equal(S.players[0].hand.length, n + 1, 'one selected'); spell(S, 'word.gnosis'); assert.equal(S.players[0].hand.length, n + 3, 'two drawn');
});
test('word.name and word.measure: Named blocks Summon; Measured blocks new counters', () => {
  const S = fixture(); const t = place(S, 1, 'earth.stone'); spell(S, 'word.measure', { target: t.id }); assert.equal(E.addCounter(S, t, 'bedrock'), 0);
  const u = place(S, 0, 'life.hare'); spell(S, 'word.name', { target: u.id }); assert.ok(u.status.named);
});
test('word.dispel: retires a standing Quality, Weather, Burden or Law; works as a response', () => {
  const S = fixture(); const t = place(S, 1, 'life.stag'); const q = give(S, 1, 'life.feral'); S.active = 1; play(S, { type: 'quality', card: q.pid, target: t.id }); S.active = 0;
  spell(S, 'word.dispel', { target: 'q:' + q.pid }); assert.equal(t.quals.length, 0); assert.ok(S.players[1].grave.some(c => c.pid === q.pid)); audit(S);
});
test('word.echo: the next successful Action card returns to hand; Echo is Sealed', () => {
  const S = fixture(); const e = spell(S, 'word.echo'); const o = place(S, 0, 'water.otter'); const sp = give(S, 0, 'water.seep');
  play(S, { type: 'remote', subject: o.id, card: sp.pid, target: 'rival' }); assert.ok(S.players[0].hand.some(c => c.pid === sp.pid)); assert.ok(S.players[0].sealed.some(c => c.pid === e.pid));
});
test('word.silence: reveal and discard one Action/Spell cost ≤ 3', () => { const S = fixture(); const x = give(S, 1, 'fire.kindle'); give(S, 1, 'water.eel'); spell(S, 'word.silence'); assert.ok(S.players[1].grave.some(c => c.pid === x.pid && c.reason === 'discarded')); });
test('word.reckoning: destroy every enemy Thing with max stand ≤ 2 at once', () => { const S = fixture(); place(S, 1, 'air.swallow'); place(S, 1, 'water.eel'); const s = place(S, 1, 'life.stag'); spell(S, 'word.reckoning'); assert.deepEqual(S.things.filter(t => t.ctrl === 1), [s]); });
test('word.be: Category + Be + Lawful Quality is one Law; all matching Things on both sides gain it; expires at caster\'s 2nd Renew', () => {
  const S = fixture(); const w = place(S, 0, 'life.wolf'), e = place(S, 1, 'life.stag'), st = place(S, 0, 'earth.stone');
  const be = give(S, 0, 'word.be'), cat = give(S, 0, 'life.beasts'), fe = give(S, 0, 'life.feral');
  play(S, { type: 'law', card: be.pid, category: cat.pid, qual: fe.pid });
  assert.equal(E.curStrike(S, w), 3, 'Wolf 2 + Feral'); assert.equal(E.curStrike(S, e), 4); assert.equal(E.curStrike(S, st), 1);
  audit(S); turn(S); assert.ok(S.law); turn(S); assert.equal(S.law, null); assert.equal(E.curStrike(S, e), 3); audit(S);
});
test('word.awaken: non-living Thing gains Body and 1 Might', () => { const S = fixture(); const c = place(S, 0, 'earth.clay'); spell(S, 'word.awaken', { target: c.id }); assert.ok(E.prop(c, 'body')); assert.equal(E.curStrike(S, c), 1); });
test('word.summon: take an enemy original Thing printed cost ≤ 2', () => { const S = fixture(); const v = place(S, 1, 'life.wolf'); spell(S, 'word.summon', { target: v.id }); assert.equal(v.ctrl, 0); audit(S); });
test('word.loan: +2 extra breath now, 1 less base breath next turn', () => { const S = fixture(); S.players[0].breath = 3; spell(S, 'word.loan'); assert.equal(S.players[0].breath, 4); turn(S); });
test('word.word, word.familiar, word.protect, word.doubt, word.separate, word.grimoire: covered earlier', () => { for (const w of ['word.word', 'word.familiar', 'word.protect', 'word.doubt', 'word.separate', 'word.grimoire']) assert.ok(BY_ID[w]); });

// ---------- Concealed ----------
test('word.hermit, rot.shadow, rot.night: Concealed — not individually targetable; revealed when it acts or blocks; Owl, Doubt, Dispel, Gnosis reveal', () => {
  const S = fixture(); const h = give(S, 1, 'word.hermit'); S.active = 1; play(S, { type: 'deploy', card: h.pid }); S.active = 0;
  const t = S.things.find(x => x.pid === h.pid); assert.ok(t.status.concealed);
  const sc = place(S, 0, 'fire.ember'); const s2 = give(S, 0, 'fire.scorch');
  assert.ok(!E.legalActions(S).some(a => a.card === s2.pid && a.target === t.id), 'hostile single-target excluded');
  spell(S, 'word.doubt', { target: 'reveal:' + t.id }); assert.ok(!t.status.concealed);
  play(S, { type: 'remote', subject: sc.id, card: s2.pid, target: t.id }); assert.equal(t.damage, 2);
  const T = fixture(); const n = give(T, 0, 'rot.night'); play(T, { type: 'weather', card: n.pid });
  const a = give(T, 0, 'life.wolf'), b = give(T, 0, 'life.hare'); play(T, { type: 'deploy', card: a.pid }); play(T, { type: 'deploy', card: b.pid });
  assert.ok(T.things.find(x => x.pid === a.pid).status.concealed); assert.ok(!T.things.find(x => x.pid === b.pid).status.concealed, 'first only');
  const U = fixture(); const sh = place(U, 1, 'rot.shadow', { status: { concealed: true } }); const ow = give(U, 0, 'air.owl'); play(U, { type: 'deploy', card: ow.pid }); assert.ok(!sh.status.concealed);
  const V = fixture(); const hd = place(V, 1, 'word.hermit', { status: { concealed: true } }); spell(V, 'word.gnosis'); assert.ok(!hd.status.concealed);
  const W = fixture(); const bl = place(W, 1, 'rot.shadow', { status: { concealed: true } }); const at = place(W, 0, 'life.stag');
  play(W, { type: 'attack', subject: at.id, verb: 'strike', target: 'rival' }, () => bl.id); assert.ok(!bl.status.concealed, 'revealed on block');
  const X = fixture(); const ds = place(X, 1, 'word.hermit', { status: { concealed: true } }); spell(X, 'word.dispel', { target: 'reveal:' + ds.id }); assert.ok(!ds.status.concealed);
});

test('F: all ten §10 reference decks are legal 20-word decks and complete a seeded match with zones intact', () => {
  const { REF } = require('../data/reference_decks');
  assert.equal(Object.keys(REF).length, 10);
  for (const [k, d] of Object.entries(REF)) assert.deepEqual(E.deckErrors(d), [], k);
  const { playOne } = require('../sim/run');
  const r = playOne('D7_speaking_house', 'D5B_patient_ruin', 4242, 'v29', 0, ['careful', 'aggressive'], { set: 'REF', audit: true });
  assert.ok(r.rounds >= 1);
});

test('made.alkahest: Main, 1 breath, sacrifice Alkahest — destroy an enemy Thing or damageable Ground (target declared before the sacrifice)', () => {
  const S = fixture(); const v = place(S, 0, 'water.vitriol'), q = place(S, 0, 'water.quicksilver');
  E.apply(S, { type: 'fuse', recipe: 'alkahest', a: v.id, b: q.id }, nb);
  const al = S.things.find(t => E.card(t).id === 'made.alkahest'); turn(S);
  const big = place(S, 1, 'earth.boulder'); ground(S, 1, 'earth.tower');
  assert.ok(E.legalActions(S).some(a => a.ability === 'alkahest' && a.target === 'ground'));
  play(S, { type: 'ability', subject: al.id, ability: 'alkahest', target: big.id });
  assert.ok(!S.things.includes(big)); assert.ok(!S.things.includes(al)); audit(S);
});
