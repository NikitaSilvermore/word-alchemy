// Stage E (alchemy) regression tests — spec §5.12–5.13, §7, §9, §11.1, §14.4.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const { E, fixture, place, give, ground } = require('./helpers');
const R = require('../src/recipes');
const { BY_ID } = require('../src/cards');

const noBlock = () => null;
const audit = S => assert.deepEqual(E.zoneAudit(S), []);
const fuse = (S, recipe, a, b, ctl = noBlock) => E.apply(S, { type: 'fuse', recipe, a, b }, ctl);
// synthetic made object for fixtures (no physical card of its own)
const fake = (S, word, form) => { const t = place(S, 0, word); delete S.registry[t.pid]; t.pid = null; t.form = form; t.lineage = []; return t; };
const made = S => S.things.find(t => t.lineage && S.events.some(e => e.type === 'made' && e.tid === t.id));

test('E: recipe registry validates; every named recipe is reachable from deck-legal words, ladders and token creators', () => {
  assert.deepEqual(R.validateRecipes(), []);
  const r = R.reachability();
  assert.equal(r.length, 12);
  assert.ok(r.every(x => x.reachable), JSON.stringify(r.filter(x => !x.reachable)));
  assert.ok(!BY_ID['earth.gold'].deckLegal && !BY_ID['made.phoenix'].deckLegal && !BY_ID['token.ash'].deckLegal);
  assert.deepEqual(E.deckErrors(['earth.gold']).filter(e => /deck-legal/.test(e)).length, 1);
});

test('E: catalyst requirement is computed and matches the spec table for every named recipe', () => {
  const spec = { energy: false, steam: true, swamp: false, golem: false, homunculus: false, phoenix: false, alkahest: false, ouroboros: true, life: false, world_tree: false, quintessence: true, philosophers_stone: true };
  const schools = f => BY_ID[f].schools || [BY_ID[f].school];
  for (const r of R.NAMED) assert.equal(R.opposedAcross(schools(r.a.form), schools(r.b.form)), spec[r.id], r.id);
});

// one fixture per named recipe: place ingredients, fuse, check form, lineage, events, zones
const SETUPS = {
  energy: S => [place(S, 0, 'fire.ember').id, place(S, 0, 'air.wind').id],
  steam: S => { ground(S, 0, 'water.water'); return [place(S, 0, 'fire.ember').id, 'ground']; },
  swamp: S => { ground(S, 0, 'water.water'); return [place(S, 0, 'earth.clay').id, 'ground']; },
  golem: S => [place(S, 0, 'earth.clay').id, place(S, 0, 'word.word').id],
  homunculus: S => { ground(S, 0, 'water.flask'); return ['ground', place(S, 0, 'word.word').id]; },
  phoenix: S => { const fb = place(S, 0, 'fire.firebird'); const ash = E.createToken(S, 0, 'token.ash'); return [fb.id, ash.id]; },
  alkahest: S => [place(S, 0, 'water.vitriol').id, place(S, 0, 'water.quicksilver').id],
  ouroboros: S => [place(S, 0, 'rot.adder').id, place(S, 0, 'life.scarab').id],
  life: S => [place(S, 0, 'life.seed').id, fake(S, 'earth.clay', 'made.swamp').id],
  world_tree: S => [place(S, 0, 'life.oak').id, fake(S, 'life.seed', 'made.life').id],
  quintessence: S => [fake(S, 'fire.ember', 'made.energy').id, fake(S, 'earth.clay', 'made.swamp').id],
  philosophers_stone: S => { const g = place(S, 0, 'earth.silver'); g.form = 'earth.gold'; return [g.id, fake(S, 'fire.ember', 'made.quintessence').id]; },
};
for (const r of R.NAMED) {
  test(`E: named recipe ${r.id} — consumes both, no death or arrival, result Fresh and exhausted, damage summed, lineage public`, () => {
    const S = fixture(); S.players[0].breath = 10;
    const [a, b] = SETUPS[r.id](S);
    const pids = [a, b].map(x => x === 'ground' ? S.players[0].ground.pid : S.things.find(t => t.id === x).pid).filter(Boolean);
    const objA = a === 'ground' ? S.players[0].ground : S.things.find(t => t.id === a); objA.damage = 1;
    const cat = S.players[0].catalyst, spark = S.players[0].spark;
    E.apply(S, { type: 'fuse', recipe: r.id, a, b }, noBlock);
    const m = made(S);
    assert.ok(m, 'made');
    assert.equal(E.card(m).id, r.out);
    assert.equal(m.damage, 1, 'damage carried, not healed');
    assert.ok(m.fresh && m.exhausted);
    assert.deepEqual(E.lineagePids(m.lineage).map(x => x.pid).sort(), pids.sort());
    assert.equal(S.events.filter(e => e.type === 'death' || e.type === 'arrive').length, 0);
    const needs = ['steam', 'ouroboros', 'quintessence', 'philosophers_stone'].includes(r.id);
    assert.equal(cat - S.players[0].catalyst, needs ? 1 : 0, 'catalyst spent only for opposed schools');
    assert.equal(S.players[0].spark, spark, 'no sentence spark for fusion');
    audit(S);
  });
}

test('E: legality — mature Thing needed, ready, owned and controlled, Final excluded, one Vessel use per turn, lethal preview illegal', () => {
  const S = fixture();
  const em = place(S, 0, 'fire.ember', { fresh: true }), wi = place(S, 0, 'air.wind', { fresh: true });
  assert.match(E.whyIllegal(S, { type: 'fuse', recipe: 'energy', a: em.id, b: wi.id }), /mature/);
  wi.fresh = false; wi.exhausted = true;
  assert.match(E.whyIllegal(S, { type: 'fuse', recipe: 'energy', a: em.id, b: wi.id }), /exhausted/);
  wi.exhausted = false; wi.owner = 1;
  assert.match(E.whyIllegal(S, { type: 'fuse', recipe: 'energy', a: em.id, b: wi.id }), /owned/);
  wi.owner = 0; em.damage = 1; wi.damage = 2; // Energy 0/3: preview 3 − 3 = 0
  assert.match(E.whyIllegal(S, { type: 'fuse', recipe: 'energy', a: em.id, b: wi.id }), /do not match/);
  wi.damage = 0;
  fuse(S, 'energy', em.id, wi.id);
  const c = place(S, 0, 'earth.clay'), w = place(S, 0, 'word.word');
  assert.match(E.whyIllegal(S, { type: 'fuse', recipe: 'golem', a: c.id, b: w.id }), /already been used/);
  const ph = place(S, 1, 'fire.firebird'); ph.form = 'made.phoenix';
  assert.ok(E.has(S, ph, 'final'));
});

test('E: catalyst consumed at declaration; failed fusion keeps every cost and the surviving ingredient', () => {
  const S = fixture();
  ground(S, 0, 'water.water');
  const em = place(S, 0, 'fire.ember');
  const gust = give(S, 1, 'air.gust'); S.players[1].reserve = 2; // Ember strike 1: legal Gust target
  const b0 = S.players[0].breath;
  fuse(S, 'steam', em.id, 'ground', { block: noBlock, respond: (S2, side, kind) => kind === 'response' ? { type: 'spell', card: gust.pid, target: em.id } : null });
  assert.equal(S.players[0].catalyst, 0, 'catalyst spent');
  assert.equal(S.players[0].breath, b0 - 2);
  assert.ok(S.players[0].ground, 'surviving Ground ingredient remains');
  assert.ok(!S.things.some(t => t.lineage));
  assert.ok(!E.legalActions(S).some(a => a.type === 'fuse'), 'allowance spent');
  audit(S);
  // without a catalyst the opposed recipe is illegal
  const T = fixture(); ground(T, 0, 'water.water'); const e2 = place(T, 0, 'fire.ember'); T.players[0].catalyst = 0;
  assert.match(E.whyIllegal(T, { type: 'fuse', recipe: 'steam', a: e2.id, b: 'ground' }), /catalyst/);
});

test('E: destroying a made Thing is one death and releases every original card to its owner\'s Grave; tokens do not return', () => {
  const S = fixture();
  const fb = place(S, 0, 'fire.firebird'); const ash = E.createToken(S, 0, 'token.ash');
  fuse(S, 'phoenix', fb.id, ash.id);
  const ph = made(S);
  S.players[0].phoenixUsed = true; // rebirth already spent
  ph.damage = 99; E.stateCheck(S);
  assert.equal(S.events.filter(e => e.type === 'death').length, 1);
  const g = S.players[0].grave.find(x => x.pid === fb.pid);
  assert.equal(g.reason, 'released');
  assert.ok(!S.players[0].grave.some(x => /ash/.test(x.word)));
  audit(S);
});

test('E: bouncing a made Thing dissolves it to Grave without a death', () => {
  const S = fixture();
  const em = place(S, 0, 'fire.ember'), wi = place(S, 0, 'air.wind');
  fuse(S, 'energy', em.id, wi.id);
  const en = made(S);
  S.active = 1; S.players[1].breath = 5;
  const g = give(S, 1, 'air.gust');
  E.apply(S, { type: 'spell', card: g.pid, target: en.id }, noBlock);
  assert.equal(S.events.filter(e => e.type === 'death').length, 0);
  assert.deepEqual(S.players[0].grave.filter(x => x.reason === 'dissolved').map(x => x.pid).sort(), [em.pid, wi.pid].sort());
  audit(S);
});

test('E: Phoenix rebirth — first lethal damage prevented once, exhausted, no overflow; second time it dies', () => {
  const S = fixture({ first: 1 });
  const fb = place(S, 1, 'fire.firebird'); const ash = E.createToken(S, 1, 'token.ash');
  S.active = 1; fuse(S, 'phoenix', fb.id, ash.id); const ph = made(S);
  S.active = 0;
  const boulder = place(S, 0, 'earth.boulder'); ground(S, 0, 'earth.tower'); // Heavy gains Reach
  ph.exhausted = false;
  const cr = give(S, 0, 'earth.crush');
  ph.damage = 3; // 4/4 with 3 damage; Crush packet 4 would overflow 3
  E.apply(S, { type: 'attack', subject: boulder.id, verb: 'crush', card: cr.pid, target: ph.id }, noBlock);
  assert.ok(S.things.includes(ph)); assert.equal(ph.damage, 0); assert.ok(ph.exhausted);
  assert.equal(S.players[1].life, 30, 'no overflow through prevented destruction');
  ph.damage = 9; E.stateCheck(S);
  assert.ok(!S.things.includes(ph));
});

test('E: Ouroboros recovers one released ingredient on its first death; Recurrent Scarab returns once', () => {
  const S = fixture();
  const ad = place(S, 0, 'rot.adder'), sc = place(S, 0, 'life.scarab');
  fuse(S, 'ouroboros', ad.id, sc.id);
  const o = made(S); o.damage = 99; E.stateCheck(S);
  assert.ok(S.players[0].hand.some(c => c.pid === ad.pid), 'first released ingredient recovered');
  assert.ok(S.players[0].grave.some(c => c.pid === sc.pid), 'ingredients do not die individually: no Recurrent');
  const T = fixture();
  const s2 = place(T, 0, 'life.scarab'); s2.damage = 9; E.stateCheck(T);
  assert.ok(T.players[0].hand.some(c => c.pid === s2.pid));
  T.players[0].hand = T.players[0].hand.filter(c => c.pid !== s2.pid);
  const again = place(T, 0, 'life.scarab'); again.pid = s2.pid; again.damage = 9; E.stateCheck(T);
  assert.ok(T.players[0].grave.some(c => c.pid === s2.pid), 'flag spent: stays in Grave');
});

test('E: Separate restores the preceding ingredients Fresh and exhausted, damage to the primary, and consumes the Vessel', () => {
  const S = fixture();
  const em = place(S, 0, 'fire.ember'), wi = place(S, 0, 'air.wind');
  fuse(S, 'energy', em.id, wi.id);
  const en = made(S); en.damage = 1;
  E.endTurn(S); E.endTurn(S); // back to P0, Energy ready
  const sep = give(S, 0, 'word.separate');
  E.apply(S, { type: 'spell', card: sep.pid, target: en.id }, noBlock);
  const back = S.things.filter(t => [em.pid, wi.pid].includes(t.pid));
  assert.equal(back.length, 2);
  assert.equal(back.find(t => t.pid === em.pid).damage, 1); assert.equal(back.find(t => t.pid === wi.pid).damage, 0);
  assert.ok(back.every(t => t.fresh && t.exhausted));
  assert.ok(!E.legalActions(S).some(a => a.type === 'fuse'));
  assert.equal(S.events.filter(e => e.type === 'arrive').length, 0);
  audit(S);
  // a restored ingredient can die at once from the damage it inherits
  const T = fixture(); const e2 = place(T, 0, 'fire.ember'), w2 = place(T, 0, 'air.wind');
  fuse(T, 'energy', e2.id, w2.id); const en2 = made(T); en2.damage = 2; E.endTurn(T); E.endTurn(T);
  const sp2 = give(T, 0, 'word.separate');
  E.apply(T, { type: 'spell', card: sp2.pid, target: en2.id }, noBlock);
  assert.equal(T.players[0].grave.find(c => c.pid === e2.pid).reason, 'destroyed');
  audit(T);
});

test('E: Separate fails without room; Final forms cannot be separated', () => {
  const S = fixture();
  const ad = place(S, 0, 'rot.adder'), sc = place(S, 0, 'life.scarab');
  fuse(S, 'ouroboros', ad.id, sc.id); E.endTurn(S); E.endTurn(S);
  const sep = give(S, 0, 'word.separate');
  assert.ok(!E.legalActions(S).some(a => a.card === sep.pid), 'Final');
  const em = place(S, 0, 'fire.ember'), wi = place(S, 0, 'air.wind');
  fuse(S, 'energy', em.id, wi.id); E.endTurn(S); E.endTurn(S);
  for (let k = 0; k < 2; k++) place(S, 0, 'water.eel'); // field: Ouroboros, Energy, Eel, Eel = 4; restoring needs 2 after removing 1 → 5 ok
  place(S, 0, 'water.eel'); // now 5: removing Energy leaves 4, +2 = 6 > 5
  const en = S.things.find(t => E.card(t).id === 'made.energy');
  E.apply(S, { type: 'spell', card: sep.pid, target: en.id }, noBlock);
  assert.ok(S.things.includes(en), 'insufficient space: fails');
  assert.equal(S.players[0].grave.find(c => c.pid === sep.pid).reason, 'failed');
});

test('E: compositional — Fireborn wolf is +1/+1 Hot and ignites; carrier keeps its word; two infusions max, no duplicates; Heavy cannot be Winged', () => {
  const S = fixture();
  ground(S, 0, 'fire.fire');
  const w = place(S, 0, 'life.wolf');
  fuse(S, 'fireborn', w.id, 'ground');
  const fw = made(S);
  assert.equal(fw.word, 'life.wolf');
  assert.equal(E.curStrike(S, fw), 3); assert.equal(E.standOf(S, fw), 4);
  assert.ok(E.prop(fw, 'hot'));
  E.endTurn(S); E.endTurn(S);
  ground(S, 0, 'fire.fire');
  assert.ok(!E.fusionOptions(S, 0).some(a => a.recipe === 'fireborn'), 'duplicate infusion illegal');
  const st = place(S, 0, 'earth.stone');
  fuse(S, 'stonebound', fw.id, st.id);
  const sb = S.things.find(t => t.mods && t.mods.infusions.length === 2);
  assert.ok(E.has(S, sb, 'heavy'));
  E.endTurn(S); E.endTurn(S);
  place(S, 0, 'air.wind');
  assert.ok(!E.fusionOptions(S, 0).some(a => a.recipe === 'winged' && a.a === sb.id), 'max two infusions, and Heavy cannot be Winged');
  assert.equal(E.lineagePids(sb.lineage).length, 3);
  audit(S);
});

test('E: metal ladder — Transmute advances one edge per own turn, branch chosen at declaration; Gold is ladder-only and yields breath', () => {
  const S = fixture();
  const ld = place(S, 0, 'earth.lead');
  const t1 = give(S, 0, 'earth.transmute'), t2 = give(S, 0, 'earth.transmute');
  E.apply(S, { type: 'spell', card: t1.pid, target: ld.id, branch: 'earth.copper' }, noBlock);
  assert.equal(E.card(ld).id, 'earth.copper'); assert.equal(ld.word, 'earth.lead', 'printed word kept');
  assert.ok(!E.legalActions(S).some(a => a.card === t2.pid), 'one edge per own turn');
  E.endTurn(S); E.endTurn(S);
  E.apply(S, { type: 'spell', card: t2.pid, target: ld.id, branch: 'earth.silver' }, noBlock);
  assert.equal(E.card(ld).id, 'earth.silver');
  ld.form = 'earth.gold';
  const before = S.players[0];
  E.endTurn(S); E.endTurn(S);
  assert.equal(before.breath, Math.min(8, 2 + before.personalTurn) + 1, 'Gold: +1 breath at upkeep');
  ld.damage = 9; E.stateCheck(S);
  assert.equal(S.players[0].grave.find(c => c.pid === ld.pid).word, 'earth.lead', 'returns in printed form');
});

test('E: plant ladder — Seed ages at upkeep, becomes Sapling at 2, then Willow with Water Ground; Grow adds age; one stage per own turn', () => {
  const S = fixture();
  const sd = place(S, 0, 'life.seed');
  E.endTurn(S); E.endTurn(S); assert.equal(E.card(sd).id, 'life.seed'); assert.equal(sd.counters.age, 1);
  E.endTurn(S); E.endTurn(S); assert.equal(E.card(sd).id, 'life.sapling'); assert.equal(sd.counters.age, 0);
  const gr = give(S, 0, 'life.grow'); S.players[0].breath = 5;
  E.apply(S, { type: 'spell', card: gr.pid, target: sd.id }, noBlock);
  assert.equal(sd.counters.age, 1, 'Grow ages but the plant already advanced this turn');
  assert.equal(sd.counters.growth, 1);
  ground(S, 0, 'water.water');
  E.endTurn(S); E.endTurn(S);
  assert.equal(E.card(sd).id, 'life.willow');
  assert.equal(E.standOf(S, sd), 5 + 1, 'growth counter kept across transformation');
  assert.equal(S.events.filter(e => e.type === 'arrive' || e.type === 'death').length, 0);
});

test('E: sacrifice as a cost — death triggers resolve before the response window; Calcine creates Ash', () => {
  const S = fixture();
  const rat = place(S, 0, 'rot.rat'); const foe = place(S, 1, 'life.stag');
  const cal = give(S, 0, 'fire.calcine');
  let poisonAtWindow = null;
  E.apply(S, { type: 'spell', card: cal.pid, target: foe.id, sacrifice: rat.id }, { block: noBlock, respond: (S2, side, kind) => { if (kind === 'response') poisonAtWindow = foe.status.poison || 0; return null; } });
  assert.equal(poisonAtWindow, 1, 'Rat death trigger resolved before the response');
  assert.equal(foe.damage, 3);
  assert.ok(S.things.some(t => t.token && E.card(t).id === 'token.ash'));
  assert.equal(S.players[0].grave.find(c => c.pid === rat.pid).reason, 'sacrificed');
  audit(S);
});

test('E: tokens — never displace; Barrow makes Carrion on the first friendly original Living death each own turn', () => {
  const S = fixture();
  for (let k = 0; k < 5; k++) place(S, 0, 'water.eel');
  assert.equal(E.createToken(S, 0, 'token.ash'), null);
  assert.equal(S.things.filter(t => t.ctrl === 0).length, 5);
  const T = fixture(); ground(T, 0, 'rot.barrow');
  const a = place(T, 0, 'rot.rat'), b = place(T, 0, 'rot.rat');
  a.damage = 9; E.stateCheck(T); b.damage = 9; E.stateCheck(T);
  assert.equal(T.things.filter(t => t.token).length, 1, 'once per own turn');
});

test('E: Philosopher\'s Stone is assembled by real play: Silver→Gold, Energy, Swamp, Quintessence, Stone', () => {
  const S = fixture(); const p = S.players[0];
  const sv = place(S, 0, 'earth.silver');
  const tr = give(S, 0, 'earth.transmute');
  const next = () => { E.endTurn(S); E.endTurn(S); p.breath = 10; };
  p.breath = 10;
  E.apply(S, { type: 'spell', card: tr.pid, target: sv.id, branch: 'earth.gold' }, noBlock);
  fuse(S, 'energy', place(S, 0, 'fire.ember').id, place(S, 0, 'air.wind').id);
  next();
  ground(S, 0, 'water.water');
  fuse(S, 'swamp', place(S, 0, 'earth.clay').id, 'ground');
  next();
  const en = S.things.find(t => E.card(t).id === 'made.energy'), sw = S.things.find(t => E.card(t).id === 'made.swamp');
  fuse(S, 'quintessence', en.id, sw.id);
  next();
  p.catalyst = 1; // refilled by spark in a real game
  const q = S.things.find(t => E.card(t).id === 'made.quintessence');
  fuse(S, 'philosophers_stone', sv.id, q.id);
  const st = S.things.find(t => E.card(t).id === 'made.philosophers_stone');
  assert.ok(st);
  assert.equal(E.lineagePids(st.lineage).length, 5, 'Silver (as Gold), Ember, Wind, Clay and the Water Ground');
  audit(S);
});
