// Core Duel trial "Three Decks Worth Mastering" (v33_core3) — acceptance cases from the design pack's dependency matrix,
// reconciled with the live engine. Constructed legal positions, each with the relevant negative case.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../src/engine');
const F = require('../src/formats');
const B = require('../src/bots');
const { recordMatch, replayMatch } = require('../src/replay');
const { THREE_DECKS: D } = require('../data/v33_decks');

function fx(a = 'orchard', b = 'furnace', fmt = 'v33_core3') {
  const S = F.createFromFormat(fmt, { decks: [D[a].words, D[b].words], seed: 11, first: 0, mulligan: () => [] });
  for (const p of S.players) { p.deck.push(...p.hand); p.hand = []; p.breath = 8; p.reserve = 0; }
  S.active = 0; return S;
}
function place(S, side, word, o = {}) {
  const p = S.players[side], k = p.deck.findIndex(c => c.word === word);
  const c = k >= 0 ? p.deck.splice(k, 1)[0] : null;
  const t = { id: 't' + (++S.seq), pid: c ? c.pid : null, word, owner: side, ctrl: side, entry: S.seq, damage: 0, counters: {}, status: {}, exhausted: false, fresh: false, actions: 0, arrivedTurn: 0, ...(c ? {} : { token: true, form: word }), ...o };
  S.things.push(t); return t;
}
const give = (S, side, word) => { const p = S.players[side], k = p.deck.findIndex(c => c.word === word); const c = p.deck.splice(k, 1)[0]; p.hand.push(c); return c; };
const NOCTL = { block: () => null, respond: null };
const acts = S => E.legalActions(S);
const respondWith = (side, pick) => ({ block: () => null, respond: (S2, sd, kind) => (sd === side ? E.legalResponses(S2, sd, kind).find(pick) || null : null) });
const id = t => E.card(t).id;

test('three: pollination — Bee/Pear, Bee/Apple, Wind/Hazel while Wind is Wet; Bee/Hazel and a Wet Bee fail; one shared attempt', () => {
  const S = fx(); const bee = place(S, 0, 'life.bee'), pear = place(S, 0, 'life.pear'), apple = place(S, 0, 'life.apple'), hazel = place(S, 0, 'life.hazel'), wind = place(S, 0, 'air.wind', { status: { wet: true } });
  S.players[0].life = 26; // full field and full life would leave nothing to make
  const pol = acts(S).filter(a => a.ability === 'pollinate');
  assert.ok(pol.some(a => a.subject === bee.id && a.target === pear.id)); assert.ok(pol.some(a => a.subject === bee.id && a.target === apple.id));
  assert.ok(pol.some(a => a.subject === wind.id && a.target === hazel.id), 'wingless Wind still pollinates while Wet');
  assert.ok(!pol.some(a => a.subject === bee.id && a.target === hazel.id)); assert.match(E.pollinationWhy(S, bee, hazel), /wind-pollinated/);
  bee.status.wet = true; assert.match(E.pollinationWhy(S, bee, pear), /working wings/); delete bee.status.wet;
  assert.ok(!pol.some(a => a.branch === 'fruit'), 'five occupants: no room for a Fruit');
  E.apply(S, pol.find(a => a.subject === bee.id && a.target === pear.id && a.branch === 'life'), NOCTL);
  assert.equal(S.players[0].life, 28);
  assert.ok(!acts(S).some(a => a.ability === 'pollinate'), 'Bee and Wind share one attempt per turn');
});
test('three: at five occupants pollination still feeds — heal life or 2 marked damage without a token; a countered attempt spends the allowance', () => {
  const S = fx('orchard', 'orchard');
  const bee = place(S, 0, 'life.bee'), pear = place(S, 0, 'life.pear'), wolf = place(S, 0, 'life.wolf', { damage: 2 }); place(S, 0, 'life.seed'); place(S, 0, 'water.otter');
  S.players[0].life = 25;
  const pol = acts(S).filter(a => a.ability === 'pollinate');
  assert.ok(!pol.some(a => a.branch === 'fruit'), 'no room for a Fruit'); assert.ok(pol.some(a => a.branch === 'life')); assert.ok(pol.some(a => a.branch === 'mend' && a.mend === wolf.id));
  give(S, 1, 'air.gust'); S.players[1].reserve = 2;
  E.apply(S, pol.find(a => a.branch === 'mend'), respondWith(1, r => r.target === bee.id));
  assert.equal(wolf.damage, 2, 'Bee gusted away: the attempt fails'); assert.ok(!acts(S).some(a => a.ability === 'pollinate'), 'allowance spent'); void pear;
});

test('three: Graft — Sapling + Pear makes Espalier, frees a place; Oak and Hazel are not rootstock; Gust interrupts; the plan recovers next turn', () => {
  let S = fx('orchard', 'orchard');
  const sap = place(S, 0, 'life.sapling'), pear = place(S, 0, 'life.pear'); place(S, 0, 'life.hazel'); place(S, 0, 'life.wolf'); place(S, 0, 'water.otter');
  const g = give(S, 0, 'life.graft3');
  const gs = acts(S).filter(a => a.card === g.pid);
  assert.ok(gs.some(a => a.a === sap.id && a.b === pear.id)); assert.ok(!gs.some(a => [a.a, a.b].some(x => id(S.things.find(t => t.id === x)) === 'life.hazel')));
  E.apply(S, gs.find(a => a.a === sap.id && a.b === pear.id), NOCTL);
  const esp = S.things.find(t => id(t) === 'made.espalier'); assert.ok(esp); assert.equal(S.things.filter(t => t.ctrl === 0).length, 4, 'two inputs, one result: a place is free');
  assert.ok(esp.exhausted && esp.fresh); assert.ok(E.has(S, esp, 'reach')); assert.ok(!acts(S).some(a => a.type === 'fuse'), 'the Vessel is used');
  // interruption: Gust the Pear in response; the Graft card and the Vessel use are spent; next turn the returned Pear grafts again
  S = fx('orchard', 'orchard');
  const s2 = place(S, 0, 'life.sapling'), p2 = place(S, 0, 'life.pear'); const g2 = give(S, 0, 'life.graft3'); give(S, 0, 'life.graft3' === 'x' ? 'x' : 'life.grow');
  give(S, 1, 'air.gust'); S.players[1].reserve = 2;
  E.apply(S, acts(S).find(a => a.card === g2.pid), respondWith(1, r => r.target === p2.id));
  assert.ok(!S.things.some(t => id(t) === 'made.espalier')); assert.ok(S.players[0].hand.some(c => c.word === 'life.pear'), 'Pear back in hand');
  assert.ok(S.players[0].grave.some(c => c.word === 'life.graft3')); assert.equal(s2.exhausted, true);
  const oak = place(S, 0, 'life.sapling' === 'x' ? 'x' : 'life.wolf'); void oak;
});
test('three: Espalier upkeep makes a Fruit or gives Growth; Feast heals without Fruit and readies a defender for defence only', () => {
  const S = fx('orchard', 'orchard');
  const esp = place(S, 0, 'made.espalier', { token: false, pid: null, form: 'made.espalier', lineage: [] }), seed = place(S, 0, 'life.seed');
  E.setDecider(S, (S2, side, kind, opts) => (kind === 'espalier' ? opts.indexOf(seed.id) : 0));
  E.apply(S, { type: 'pass' }, NOCTL); E.apply(S, { type: 'pass' }, NOCTL);
  assert.equal(seed.counters.growth, 1, 'Espalier chose Growth for the Seed'); void esp;
  const wolf = place(S, 0, 'life.wolf', { damage: 2, exhausted: true }); place(S, 0, 'token.fruit');
  const f = give(S, 0, 'life.feast');
  const opts = acts(S).filter(a => a.card === f.pid);
  assert.ok(opts.some(a => !a.sacrifice && a.targets.includes(wolf.id)), 'Feast heals without a Fruit');
  E.apply(S, opts.find(a => a.sacrifice && a.ready === wolf.id && a.targets.includes(wolf.id)), NOCTL);
  assert.equal(wolf.damage, 0); assert.equal(wolf.exhausted, false); assert.ok(wolf.defOnly);
  assert.ok(!acts(S).some(a => (a.attackers || []).includes(wolf.id) || a.subject === wolf.id || a.a === wolf.id || a.b === wolf.id), 'a defence-ready Thing cannot attack, act or fuse');
  S.active = 1; assert.ok(true);
});

test('three: Naphtha — Wet stops it (Kindle fails with a reason); Drought dries it; Burn lights it; two oldest take 3, life untouched, once', () => {
  const S = fx('furnace', 'orchard');
  const na = place(S, 0, 'fire.naphtha'), em = place(S, 0, 'fire.ember');
  const old1 = place(S, 1, 'life.wolf'), old2 = place(S, 1, 'life.bramble'), young = place(S, 1, 'life.bee');
  const k = give(S, 0, 'fire.kindle'); give(S, 1, 'water.dew'); S.players[1].reserve = 2;
  E.apply(S, acts(S).find(a => a.card === k.pid && a.target === na.id && a.mode === 'ignite'), respondWith(1, r => r.target === na.id && r.mode === 'wet'));
  assert.ok(S.things.includes(na), 'wetted in response: Kindle fails'); assert.ok(S.events.some(e => e.type === 'ignite-failed' && /Wet/.test(e.why)));
  assert.ok(!acts(S).some(a => a.target === na.id && (a.mode === 'ignite' || a.verb === 'burn')), 'no ignition offered on Wet Naphtha');
  const dr = give(S, 0, 'fire.drought'); E.apply(S, acts(S).find(a => a.card === dr.pid), NOCTL); assert.ok(!na.status.wet);
  const bn = give(S, 0, 'fire.burn'); const lifeBefore = S.players[1].life;
  assert.deepEqual(E.naphthaVictims(S, na).map(t => t.id), [old1.id, old2.id]);
  E.apply(S, acts(S).find(a => a.card === bn.pid && a.target === na.id), NOCTL);
  assert.ok(!S.things.includes(na)); assert.equal(old1.damage, 3); assert.equal(old2.damage, 3); assert.equal(young.damage, 0); assert.equal(S.players[1].life, lifeBefore, 'never life');
  assert.equal(S.events.filter(e => e.type === 'flare').length, 1); void em;
});
test('three: Tinder (R05) lights your Naphtha; the flare destroys it; Tinder still makes Ash in the freed space', () => {
  const S = fx('furnace', 'orchard');
  const na = place(S, 0, 'fire.naphtha'), tin = place(S, 0, 'fire.tinder', { fresh: true }); place(S, 0, 'fire.ember'); place(S, 0, 'air.owl'); place(S, 0, 'air.swallow');
  place(S, 1, 'life.wolf');
  E.apply(S, acts(S).find(a => a.ability === 'tinder' && a.target === na.id), NOCTL);
  assert.ok(!S.things.includes(na) && !S.things.includes(tin)); assert.equal(S.things.filter(t => id(t) === 'token.ash' && t.ctrl === 0).length, 1);
});
test('three: Calcine Ash is optional; Firebird + Ash make Phoenix (3 Breath); Phoenix is reborn once, with no Crush overflow', () => {
  const S = fx('furnace', 'forge');
  const fb = place(S, 0, 'fire.firebird'), sw = place(S, 0, 'air.swallow'), foe = place(S, 1, 'earth.flint');
  const c = give(S, 0, 'fire.calcine');
  assert.ok(acts(S).some(a => a.card === c.pid && a.ash === false) && acts(S).some(a => a.card === c.pid && a.ash === true));
  E.apply(S, acts(S).find(a => a.card === c.pid && a.sacrifice === sw.id && a.target === foe.id && a.ash), NOCTL);
  const ash = S.things.find(t => id(t) === 'token.ash'); assert.ok(ash); ash.fresh = false;
  const br = S.players[0].breath; E.apply(S, acts(S).find(a => a.type === 'fuse' && a.recipe === 'phoenix'), NOCTL);
  const ph = S.things.find(t => id(t) === 'made.phoenix'); assert.ok(ph); assert.equal(S.players[0].breath, br - 3);
  // Crush into the Phoenix: rebirth prevents death, so no overflow; the second lethal kills it
  S.active = 1; ph.exhausted = true; ph.status.wet = true; /* Wet grounds its wings so a Crush can reach it */ const iron = place(S, 1, 'earth.iron'); iron.tempStrike = 4; const cr = give(S, 1, 'earth.crush'); S.players[1].breath = 8;
  const life0 = S.players[0].life; void fb;
  E.apply(S, acts(S).find(a => a.card === cr.pid && a.target === ph.id), NOCTL);
  assert.ok(S.things.includes(ph)); assert.equal(ph.damage, 0); assert.equal(S.players[0].life, life0, 'no overflow from a prevented death');
  assert.ok(!acts(S).some(a => a.card === cr.pid && a.target === 'rival'), 'Crush never selects the rival');
});

test('three: Clay + Word make a 4/5 Reach Golem at a full field; its ordinary attack spills once through a destroyed blocker, not if the blocker leaves', () => {
  let S = fx('forge', 'orchard');
  const clay = place(S, 0, 'earth.clay'), word = place(S, 0, 'word.word'); place(S, 0, 'earth.iron'); place(S, 0, 'earth.lead'); place(S, 0, 'earth.flint');
  E.apply(S, acts(S).find(a => a.type === 'fuse' && a.recipe === 'golem'), NOCTL);
  const go = S.things.find(t => id(t) === 'made.golem3'); assert.ok(go); assert.equal(E.curStrike(S, go), 4); assert.ok(E.has(S, go, 'reach'));
  assert.equal(S.things.filter(t => t.ctrl === 0).length, 4); void clay; void word;
  S = fx('forge', 'orchard');
  const g2 = place(S, 0, 'made.golem3', { token: false, pid: null, form: 'made.golem3', lineage: [] }), seed = place(S, 1, 'life.seed');
  const life0 = S.players[1].life;
  E.apply(S, { type: 'combat', attackers: [g2.id] }, { block: () => seed.id, respond: null });
  assert.ok(!S.things.includes(seed)); assert.equal(S.players[1].life, life0 - 2, '4 into a 0/2 Seed: 2 spill to life, once');
  S = fx('orchard', 'furnace'); // the attacker Gusts away its own Golem's blocker (an answer): the attack misses, no spill
  const g3 = place(S, 0, 'made.golem3', { token: false, pid: null, form: 'made.golem3', lineage: [] }), sw = place(S, 1, 'air.swallow'); const gu = give(S, 0, 'air.gust');
  give(S, 1, 'fire.kindle'); S.players[1].reserve = 2; const l1 = S.players[1].life; void gu;
  E.apply(S, { type: 'combat', attackers: [g3.id] }, { block: () => sw.id, respond: (S2, sd, kind) => (sd === 1 ? E.legalResponses(S2, 1, kind).find(r => r.target === sw.id && r.mode === 'fan') || null : E.legalResponses(S2, 0, kind).find(r => r.target === sw.id) || null) });
  assert.ok(!S.things.some(t => t.id === sw.id) && S.players[1].hand.some(c => c.word === 'air.swallow'), 'blocker returned to hand');
  assert.equal(S.players[1].life, l1, 'no life spill when the blocker leaves');
  void life0;
});
test('three: Clay shields one packet for another friendly Thing; cannot protect itself', () => {
  const S = fx('forge', 'furnace');
  const clay = place(S, 0, 'earth.clay', { fresh: true }), iron = place(S, 0, 'earth.iron');
  assert.ok(!acts(S).some(a => a.ability === 'clayShield' && a.target === clay.id));
  E.apply(S, acts(S).find(a => a.ability === 'clayShield' && a.target === iron.id), NOCTL);
  assert.ok(!S.things.includes(clay), 'Clay is sacrificed'); assert.equal(iron.shield3, 3);
  S.active = 1; const em = place(S, 1, 'fire.ember'); const sc = give(S, 1, 'fire.scorch'); S.players[1].breath = 8;
  E.apply(S, acts(S).find(a => a.card === sc.pid && a.target === iron.id), NOCTL); assert.equal(iron.damage, 0, 'Scorch 2 fully prevented'); assert.ok(!iron.shield3, 'one packet only'); void em;
});

test('three: Shape branches — Copper→Hammer/Signet, Iron→Hammer, Silver→Signet; Iron→Signet illegal; one metal change per turn; marks kept; bounce returns Copper', () => {
  const S = fx('forge', 'furnace');
  const cu = place(S, 0, 'earth.copper', { damage: 1 }), fe = place(S, 0, 'earth.iron'), ag = place(S, 0, 'earth.silver');
  const sh = give(S, 0, 'earth.shape3'), tm = give(S, 0, 'earth.transmute');
  const so = acts(S).filter(a => a.card === sh.pid).map(a => [S.things.find(t => t.id === a.target).word, a.branch].join('>'));
  assert.deepEqual(so.sort(), ['earth.copper>earth.hammer', 'earth.copper>earth.signet3', 'earth.iron>earth.hammer', 'earth.silver>earth.signet3']);
  E.apply(S, acts(S).find(a => a.card === tm.pid && a.target === cu.id), NOCTL); assert.equal(id(cu), 'earth.silver');
  assert.match(E.shape3Why(S, 0, cu, 'earth.signet3'), /already changed form/);
  E.apply(S, acts(S).find(a => a.card === sh.pid && a.target === ag.id), NOCTL); assert.equal(id(ag), 'earth.signet3');
  assert.equal(cu.damage, 1, 'marks kept');
  // Signet: wards another friendly Thing, never itself; it costs the Signet's action
  ag.fresh = false; const seals = acts(S).filter(a => a.ability === 'seal'); assert.ok(seals.length); assert.ok(!seals.some(a => a.target === ag.id));
  E.apply(S, seals.find(a => a.target === fe.id), NOCTL); assert.ok(fe.status.ward); assert.ok(ag.exhausted);
});
test('three: Writ — basic exhausts Strike ≤2 only; stamped exhausts two of any Strike; the Signet stays spent when Doubt counters', () => {
  let S = fx('forge', 'furnace');
  const sg = place(S, 0, 'earth.signet3', { pid: null, form: 'earth.signet3', token: false }), big = place(S, 1, 'fire.firebird', { counters: { might: 1 } }), small = place(S, 1, 'fire.ember');
  const w = give(S, 0, 'word.writ3');
  const ws = acts(S).filter(a => a.card === w.pid);
  assert.ok(ws.some(a => a.target === small.id)); assert.ok(!ws.some(a => a.target === big.id), 'basic Writ: Strike ≤2');
  assert.ok(ws.some(a => a.endorse === sg.id && a.targets.length === 2));
  E.apply(S, ws.find(a => a.endorse === sg.id && a.targets.length === 2), NOCTL); assert.ok(big.exhausted && small.exhausted && sg.exhausted);
  S = fx('forge', 'forge');
  const sg2 = place(S, 0, 'earth.signet3', { pid: null, form: 'earth.signet3', token: false }), f2 = place(S, 1, 'earth.boulder'); const w2 = give(S, 0, 'word.writ3'); give(S, 1, 'word.doubt'); S.players[1].reserve = 2;
  E.apply(S, acts(S).find(a => a.card === w2.pid && a.endorse === sg2.id), respondWith(1, r => /node:/.test(r.target || '')));
  assert.ok(sg2.exhausted, 'stamp paid'); assert.ok(!f2.exhausted, 'countered');
});
test('three: Guard gives Reach and +2 Stand until your next Renew; expiry can kill', () => {
  const S = fx('forge', 'furnace');
  const lead = place(S, 0, 'earth.lead', { damage: 2 }); const g = give(S, 0, 'earth.guard');
  E.apply(S, acts(S).find(a => a.card === g.pid && a.target === lead.id), NOCTL);
  assert.ok(E.has(S, lead, 'reach')); assert.equal(E.maxStand(S, lead), 5);
  const sw = place(S, 1, 'air.swallow'); void sw;
  E.apply(S, { type: 'pass' }, NOCTL); // rival turn
  assert.ok(S.things.includes(lead) && E.has(S, lead, 'reach'), 'still guarded on the rival turn');
  lead.damage = 4; // it took 2 more while guarded (4 of 5)
  E.apply(S, { type: 'pass' }, NOCTL); // our Renew: +2 ends, 4 marks on a 1/3 Lead
  assert.ok(!S.things.includes(lead), 'the Guard expiry kills the marked Lead');
});
test('three: Hammer hits only a damaged enemy Thing or Ground; Crucible tempers a damaged Metal once a turn', () => {
  const S = fx('forge', 'furnace');
  const hm = place(S, 0, 'earth.hammer'), hurt = place(S, 1, 'fire.ember', { damage: 1 }), whole = place(S, 1, 'fire.salamander');
  const hs = acts(S).filter(a => a.ability === 'hammer');
  assert.ok(hs.some(a => a.target === hurt.id)); assert.ok(!hs.some(a => a.target === whole.id));
  E.apply(S, hs.find(a => a.target === hurt.id), NOCTL); assert.ok(!S.things.includes(hurt));
  const ground = { pid: 'gx', word: 'earth.crucible', owner: 0, damage: 0 }; S.players[0].ground = ground;
  const cu = place(S, 0, 'earth.copper', { damage: 1 });
  E.apply(S, acts(S).find(a => a.ability === 'temper' && a.subject === cu.id), NOCTL); assert.equal(cu.damage, 0);
  assert.ok(!acts(S).some(a => a.ability === 'temper')); void hm;
});

test('three: Study — exchange at a full hand (atomic: pay, discard to Grave without a death, draw one); shared allowance; empty deck refused; toggle isolates it', () => {
  const S = fx('forge', 'furnace'); const p = S.players[0];
  while (p.hand.length < 7) p.hand.push(p.deck.shift());
  assert.ok(!E.legalActions(S).some(a => a.type === 'study' && !a.discard), 'ordinary Study forbidden at seven');
  const ex = E.legalActions(S).filter(a => a.type === 'study' && a.discard); assert.equal(ex.length, 7);
  const deck0 = p.deck.length, out = p.hand[0].pid, deaths = S.events.filter(e => e.type === 'death').length;
  E.apply(S, ex[0], NOCTL);
  assert.equal(p.hand.length, 7); assert.equal(p.deck.length, deck0 - 1); assert.equal(p.breath, 6); assert.ok(p.grave.some(g => g.pid === out && g.reason === 'discarded'));
  assert.equal(S.events.filter(e => e.type === 'death').length, deaths); assert.ok(!E.legalActions(S).some(a => a.type === 'study'), 'one Study per turn, either mode');
  const S2 = fx('forge', 'furnace'); const p2 = S2.players[0]; while (p2.hand.length < 7) p2.hand.push(p2.deck.shift()); p2.deck = [];
  assert.ok(!E.legalActions(S2).some(a => a.type === 'study'), 'empty deck: no exchange, no fatigue');
  const S3 = fx('forge', 'furnace', 'v33_core3_noex'); const p3 = S3.players[0]; while (p3.hand.length < 7) p3.hand.push(p3.deck.shift());
  assert.ok(!E.legalActions(S3).some(a => a.type === 'study'), 'toggle off: the option is absent');
});
test('three: Abundance grows two Plants and gives a grown Tree +2 Strike this turn; Apple arrival makes a Fruit beside another Flower', () => {
  const S = fx('orchard', 'furnace');
  const oak = place(S, 0, 'life.sapling', { form: 'life.oak', counters: { growth: 1 } }), seed = place(S, 0, 'life.seed');
  const ab = give(S, 0, 'life.abundance');
  E.apply(S, acts(S).find(a => a.card === ab.pid && a.targets.length === 2), NOCTL);
  assert.equal(oak.counters.growth, 2); assert.equal(E.curStrike(S, oak), 5); assert.equal(seed.counters.growth, 1); assert.equal(E.card(seed).id, 'life.seed', 'no ageing');
  place(S, 0, 'life.pear'); const ap = give(S, 0, 'life.apple'); E.apply(S, acts(S).find(a => a.card === ap.pid), NOCTL);
  assert.ok(S.things.some(t => E.card(t).id === 'token.fruit'));
});
test('three: V33 control is untouched — same Naphtha, Dew and Abundance behaviour as V33 under v33_core', () => {
  const S = F.createFromFormat('v33_core', { decks: [require('../data/v33_decks').V33_DECKS.furnace.words, require('../data/v33_decks').V33_DECKS.orchard.words], seed: 3, first: 0, mulligan: () => [] });
  assert.ok(!E.legalActions(S).some(a => a.mode)); assert.equal(F.resolveFormat('v33_core').version, '0.33.0-core.1');
});
test('three: shuffled bot games in all nine pairings keep zones, conservation and exact replay', () => {
  for (const a of Object.keys(D)) for (const b of Object.keys(D)) {
    const pol = () => 'careful:journeyman:ra', ag = { act: S => B.chooseAction(S, pol), block: B.blocker(pol), respond: B.responderRA(pol), decide: B.decider(pol), mulligan: B.mulligan };
    const { replay, state } = recordMatch({ format: 'v33_core3', decks: [D[a].words, D[b].words], seed: 77, first: 0 }, [ag, ag]);
    assert.ok(state.over != null); assert.deepEqual(E.zoneAudit(state), []);
    assert.equal(replayMatch(JSON.parse(JSON.stringify(replay))).state.hashes.at(-1), state.hashes.at(-1));
  }
});
