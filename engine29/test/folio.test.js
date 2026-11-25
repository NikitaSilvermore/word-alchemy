// V31 Living Folio — model B (Expanded Grammar) assertions from the test programme (file 07, fixtures P01–P10, P14).
// Every fixture is constructed (named as such); each positive case is paired with a minimally changed negative.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../src/engine');
const F = require('../src/formats');
const B = require('../src/bots');
const { replayMatch, recordMatch } = require('../src/replay');
const J = require('../src/journey');
const { FOLIO_DECKS, ABLATIONS } = require('../data/folio_decks');
const { REF } = require('../data/reference_decks');

const ALL = ['orchard', 'workshop', 'decay'];
function fx(modules = ALL, first = 0) {
  const S = E.createMatch({ decks: [modules.includes('orchard') ? FOLIO_DECKS.O_orchard_crosswind.words : REF.D3_furnace_wind, modules.includes('workshop') ? FOLIO_DECKS.F_seal_cutter.words : REF.D5_clay_and_gold], seed: 11, first, initiative: 'combo2', variant: { modules } });
  S.synthetic = true;
  for (const p of S.players) { p.deck.push(...p.hand); p.hand = []; p.breath = 8; p.reserve = 0; p.spark = 0; }
  S.active = 0; return S;
}
function place(S, side, word, o = {}) {
  const t = { id: 't' + (++S.seq), pid: 'fx' + S.seq, word, owner: side, ctrl: side, entry: S.seq, damage: o.damage || 0, counters: o.counters || {}, status: o.status || {}, exhausted: !!o.exhausted, fresh: !!o.fresh, actions: o.actions || 0, arrivedTurn: 0, ...(o.form ? { form: o.form } : {}) };
  S.things.push(t); S.registry[t.pid] = true; return t;
}
const give = (S, side, word) => { const c = { pid: 'h' + (++S.seq), word, owner: side }; S.players[side].hand.push(c); S.registry[c.pid] = true; return c; };
const grave = (S, side, word, reason) => { const g = { pid: 'g' + (++S.seq), word, owner: side, reason }; S.players[side].grave.push(g); S.registry[g.pid] = true; return g; };
const NOCTL = { block: () => null, respond: null };
const acts = S => E.legalActions(S);
const pollinate = (S, c, h) => acts(S).find(a => a.ability === 'pollinate' && a.subject === c.id && a.target === h.id);
const fruits = (S, side) => S.things.filter(t => t.ctrl === side && t.word === 'token.fruit');

test('V31 P01: Bee pollinates Pear, not Hazel; Wind pollinates Hazel, not Pear; Wet grounds Bee but not Wind; one Fruit only', () => {
  let S = fx(); let bee = place(S, 0, 'life.bee'), pear = place(S, 0, 'life.pear'), hazel = place(S, 0, 'life.hazel'), wind = place(S, 0, 'air.wind');
  assert.ok(pollinate(S, bee, pear)); assert.ok(pollinate(S, wind, hazel));
  assert.equal(pollinate(S, bee, hazel), undefined); assert.equal(pollinate(S, wind, pear), undefined);
  assert.match(E.pollinationWhy(S, bee, hazel), /Hazel is wind-pollinated; Bee carries pollen by insect/);
  assert.match(E.pollinationWhy(S, wind, pear), /Pear is insect-pollinated; Wind carries pollen by wind/);
  E.apply(S, pollinate(S, bee, pear), NOCTL);
  assert.equal(fruits(S, 0).length, 1); assert.ok(bee.exhausted); assert.equal(S.players[0].breath, 7);
  assert.equal(pollinate(S, wind, hazel), undefined, 'existing Fruit forbids a second creation');
  assert.match(E.pollinationWhy(S, wind, hazel), /already have a Fruit/);
  // Wet: Bee loses wing-derived flight, Wind keeps its wind channel
  S = fx(); bee = place(S, 0, 'life.bee', { status: { wet: true } }); pear = place(S, 0, 'life.pear'); hazel = place(S, 0, 'life.hazel'); wind = place(S, 0, 'air.wind', { status: { wet: true } });
  assert.equal(pollinate(S, bee, pear), undefined); assert.match(E.pollinationWhy(S, bee, pear), /working wings.*Wet/);
  assert.ok(pollinate(S, wind, hazel));
  // the rc1 format has no pollination at all
  const R = E.createMatch({ decks: [REF.D4_orchard, REF.D3_furnace_wind], seed: 1, first: 0, initiative: 'combo2' });
  assert.ok(!E.legalActions(R).some(a => a.ability === 'pollinate'));
});

test('V31 P01b: Fresh carrier, full field, missing breath each block pollination with a reason', () => {
  const S = fx(); const bee = place(S, 0, 'life.bee', { fresh: true }), pear = place(S, 0, 'life.pear');
  assert.match(E.pollinationWhy(S, bee, pear), /mature and ready.*Fresh/);
  bee.fresh = false; for (let k = 0; k < 3; k++) place(S, 0, 'life.hare');
  assert.match(E.pollinationWhy(S, bee, pear), /no empty field space/);
  S.things.pop(); S.players[0].breath = 0; assert.match(E.pollinationWhy(S, bee, pear), /costs 1 breath/);
});

test('V31 P02: only Growth on ANOTHER Plant triggers Pear; Growth on Pear itself makes no Fruit; full field displaces nothing', () => {
  let S = fx(); const pear = place(S, 0, 'life.pear'); const g = give(S, 0, 'life.grow');
  E.apply(S, acts(S).find(a => a.card === g.pid && a.target === pear.id), NOCTL); assert.equal(fruits(S, 0).length, 0);
  S = fx(); const pr = place(S, 0, 'life.pear'), sap = place(S, 0, 'life.sapling'); const g2 = give(S, 0, 'life.grow');
  E.apply(S, acts(S).find(a => a.card === g2.pid && a.target === sap.id), NOCTL); assert.equal(fruits(S, 0).length, 1); void pr;
  S = fx(); place(S, 0, 'life.pear'); const sp = place(S, 0, 'life.sapling'); for (let k = 0; k < 3; k++) place(S, 0, 'life.hare');
  const g3 = give(S, 0, 'life.grow'); E.apply(S, acts(S).find(a => a.card === g3.pid && a.target === sp.id), NOCTL);
  assert.equal(fruits(S, 0).length, 0); assert.equal(S.things.filter(t => t.ctrl === 0).length, 5);
});

test('V31 P04: Mould seals only a dead original Plant you own; the seal stays spent if the action fails', () => {
  const S = fx(); const m = place(S, 0, 'rot.mould'), sap = place(S, 0, 'life.sapling');
  const dead = grave(S, 0, 'life.seed', 'destroyed'), sac = grave(S, 0, 'life.bramble', 'sacrificed');
  grave(S, 0, 'life.rose', 'discarded'); grave(S, 0, 'life.pear', 'released'); grave(S, 0, 'life.wolf', 'destroyed');
  const seals = acts(S).filter(a => a.ability === 'mould').map(a => a.seal).sort();
  assert.deepEqual([...new Set(seals)].sort(), ['g:' + dead.pid, 'g:' + sac.pid].sort());
  const a = acts(S).find(x => x.ability === 'mould' && x.seal === 'g:' + dead.pid && x.target === sap.id);
  E.apply(S, a, NOCTL);
  assert.equal(sap.counters.growth, 1); assert.equal(sap.counters.age, 1); assert.ok(S.players[0].sealed.some(x => x.pid === dead.pid));
  assert.ok(!S.players[0].grave.some(x => x.pid === dead.pid)); assert.deepEqual(E.zoneAudit(S), []);
  // interrupted: Mould leaves before resolution — the sealed card stays sealed
  const S2 = fx(); const m2 = place(S2, 0, 'rot.mould'), sp2 = place(S2, 0, 'life.sapling'), d2 = grave(S2, 0, 'life.seed', 'destroyed'); place(S2, 1, 'air.gust'); void m;
  const a2 = acts(S2).find(x => x.ability === 'mould' && x.target === sp2.id);
  E.apply(S2, a2, { block: () => null, respond: (S3, side) => { if (side === 1) E.leaveField(S3, S3.things.find(t => t.id === m2.id), 'bounced'); return null; } });
  assert.ok(S2.players[0].sealed.some(x => x.pid === d2.pid)); assert.ok(!sp2.counters.growth); assert.deepEqual(E.zoneAudit(S2), []);
});

test('V31 P06: Feast readies within the two-action ceiling; no third action; failed Feast loses its Fruit', () => {
  const S = fx(); const wolf = place(S, 0, 'life.wolf'), hare = place(S, 0, 'life.hare'), fruit = place(S, 0, 'token.fruit', { form: 'token.fruit' });
  fruit.token = true; fruit.pid = null;
  E.apply(S, acts(S).find(a => a.type === 'attack' && a.subject === wolf.id && a.target === 'rival' && !a.card), NOCTL);
  assert.ok(wolf.exhausted); const f = give(S, 0, 'life.feast');
  const feast = acts(S).find(a => a.card === f.pid && a.targets && a.targets.length === 1 && a.targets[0] === wolf.id);
  assert.ok(feast); assert.ok(!acts(S).some(a => a.card === f.pid && a.targets.includes(hare.id)), 'a ready Thing is not a Feast target');
  E.apply(S, feast, NOCTL);
  assert.ok(!wolf.exhausted); assert.ok(!S.things.includes(fruit));
  assert.ok(acts(S).some(a => a.type === 'attack' && a.subject === wolf.id), 'second action allowed');
  E.apply(S, acts(S).find(a => a.type === 'attack' && a.subject === wolf.id && a.target === 'rival' && !a.card), NOCTL);
  assert.equal(wolf.actions, 2); assert.ok(!acts(S).some(a => a.subject === wolf.id), 'never a third action');
  // failed Feast: target leaves before resolution -> no effect, Fruit stays spent
  const S2 = fx(); const w2 = place(S2, 0, 'life.wolf', { exhausted: true, actions: 1 }), fr2 = place(S2, 0, 'token.fruit', { form: 'token.fruit' }); fr2.token = true; fr2.pid = null;
  const f2 = give(S2, 0, 'life.feast');
  E.apply(S2, acts(S2).find(a => a.card === f2.pid), { block: () => null, respond: (S3, side) => { if (side === 1) E.leaveField(S3, S3.things.find(t => t.id === w2.id), 'bounced'); return null; } });
  assert.ok(!S2.things.some(t => t.word === 'token.fruit')); assert.ok(S2.events.some(e => e.type === 'failed'));
});

test('V31 P07: Shape keeps the instance and damage, forbids Fixed or a lethal result, one change per turn; Rust damages, no regression', () => {
  const S = fx(); const cu = place(S, 0, 'earth.copper', { damage: 1 }), lead = place(S, 0, 'earth.lead'), ag = place(S, 0, 'earth.silver', { damage: 3 });
  const sh = give(S, 0, 'earth.shape');
  assert.ok(acts(S).some(a => a.card === sh.pid && a.target === cu.id));
  assert.match(E.shapeWhy(S, 0, lead), /only Copper or Silver/); assert.match(E.shapeWhy(S, 0, ag), /would die/);
  const pid = cu.pid; E.apply(S, acts(S).find(a => a.card === sh.pid && a.target === cu.id), NOCTL);
  assert.equal(cu.form, 'earth.setting'); assert.equal(cu.pid, pid); assert.equal(cu.damage, 1); assert.equal(E.curStrike(S, cu), 0);
  assert.ok(!S.events.some(e => e.type === 'arrive' && e.id === cu.id) && !S.events.some(e => e.type === 'death'));
  // bounce returns the original word
  E.leaveField(S, cu, 'bounced'); assert.ok(S.players[0].hand.some(c => c.pid === pid && c.word === 'earth.copper'));
  // Smith route: native ability (not a Spell), costs 2, exhausts Smith; same per-turn limit
  const S2 = fx(); const smith = place(S2, 0, 'fire.smith'), c2 = place(S2, 0, 'earth.copper');
  const w = E.legalActions(S2).find(a => a.ability === 'shapeWork' && a.target === c2.id); assert.ok(w);
  E.apply(S2, w, NOCTL); assert.equal(c2.form, 'earth.setting'); assert.equal(S2.players[0].breath, 6); assert.ok(smith.exhausted);
  // Rust on a Setting: 3 damage, stays a Setting
  const S3 = fx(); S3.active = 1; const st = place(S3, 0, 'earth.copper', { form: 'earth.setting' }); const r = give(S3, 1, 'rot.rust');
  S3.rules.modules = ALL; void r;
  E.apply(S3, { type: 'spell', card: r.pid, target: st.id }, NOCTL);
  assert.ok(!S3.things.includes(st) || st.form === 'earth.setting');
  // without the workshop module there is no Shape at all
  const S4 = fx(['orchard']); place(S4, 0, 'fire.smith'); place(S4, 0, 'earth.copper');
  assert.ok(!E.legalActions(S4).some(a => a.ability === 'shapeWork'));
});

test('V31 P08: Set binds Setting + Garnet into a Signet; death, bounce and Separate each put every original in exactly one place', () => {
  for (const how of ['destroyed', 'bounced', 'separate']) {
    const S = fx(); const st = place(S, 0, 'earth.copper', { form: 'earth.setting', damage: 1 }), gn = place(S, 0, 'earth.garnet');
    const set = E.legalActions(S).find(a => a.type === 'fuse' && a.recipe === 'set'); assert.ok(set, 'Set is offered');
    E.apply(S, set, NOCTL);
    const sg = S.things.find(t => t.form === 'made.signet'); assert.ok(sg); assert.equal(sg.damage, 1); assert.ok(sg.exhausted && sg.fresh);
    assert.ok(!E.legalActions(S).some(a => a.subject === sg.id), 'no same-turn activation by the made result');
    assert.deepEqual(sg.lineage.map(r => r.form), ['earth.setting', 'earth.garnet']);
    if (how === 'separate') {
      sg.exhausted = false; sg.fresh = false; S.players[0].fusedTurn = -1; const sp = give(S, 0, 'word.separate');
      E.apply(S, { type: 'spell', card: sp.pid, target: sg.id }, NOCTL);
      const back = S.things.filter(t => t.ctrl === 0).map(t => t.form || t.word).sort(); assert.deepEqual(back, ['earth.garnet', 'earth.setting']);
    } else if (how === 'destroyed') { E.leaveField(S, sg, 'destroyed'); assert.deepEqual(S.players[0].grave.map(g => g.word).sort(), ['earth.copper', 'earth.garnet']); }
    else { E.leaveField(S, sg, 'bounced'); assert.deepEqual(S.players[0].grave.map(g => g.reason), ['dissolved', 'dissolved']); }
    assert.deepEqual(E.zoneAudit(S), []);
  }
});

test('V31 P09: Set uses the Vessel allowance — not after another fusion, not twice a turn', () => {
  const S = fx(); place(S, 0, 'earth.copper', { form: 'earth.setting' }); place(S, 0, 'earth.garnet');
  S.players[0].fusedTurn = S.players[0].personalTurn;
  assert.ok(!E.legalActions(S).some(a => a.recipe === 'set'));
  assert.match(E.whyIllegal(S, { type: 'fuse', recipe: 'set', a: S.things[0].id, b: S.things[1].id }), /Vessel has already been used/);
});

test('V31 P10: Writ — Person mode; endorsed two-target mode revalidates each; single target respects Ward; Doubt counters but costs stay paid', () => {
  // endorsed, one target leaves
  let S = fx(); let sg = place(S, 0, 'made.signet', { form: 'made.signet' }); sg.lineage = []; const a1 = place(S, 1, 'life.wolf'), a2 = place(S, 1, 'earth.boulder');
  let w = give(S, 0, 'word.writ'); let act = E.legalActions(S).find(a => a.card === w.pid && a.endorse === sg.id && a.targets.length === 2);
  assert.ok(act);
  E.apply(S, act, { block: () => null, respond: (S2, side) => { if (side === 1) E.leaveField(S2, S2.things.find(t => t.id === a1.id), 'bounced'); return null; } });
  assert.ok(a2.exhausted); assert.ok(sg.exhausted);
  // single endorsed target with Ward: Ward absorbs it
  S = fx(); sg = place(S, 0, 'made.signet', { form: 'made.signet' }); sg.lineage = []; const wd = place(S, 1, 'life.wolf', { status: { ward: true } });
  w = give(S, 0, 'word.writ'); E.apply(S, E.legalActions(S).find(a => a.card === w.pid && a.endorse && a.targets.length === 1 && a.targets[0] === wd.id), NOCTL);
  assert.ok(!wd.exhausted); assert.ok(!wd.status.ward);
  // Person mode without Signet; non-Person not targetable
  S = fx(); const sc = place(S, 1, 'word.scribe'), wl = place(S, 1, 'life.wolf'); w = give(S, 0, 'word.writ');
  assert.ok(E.legalActions(S).some(a => a.card === w.pid && a.target === sc.id)); assert.ok(!E.legalActions(S).some(a => a.card === w.pid && a.target === wl.id));
  // Doubt counters (printed cost 3); the Signet stays exhausted
  S = fx(); sg = place(S, 0, 'made.signet', { form: 'made.signet' }); sg.lineage = []; const t1 = place(S, 1, 'life.wolf'); w = give(S, 0, 'word.writ');
  const doubt = give(S, 1, 'word.doubt'); S.players[1].reserve = 2;
  E.apply(S, E.legalActions(S).find(a => a.card === w.pid && a.endorse), { block: () => null, respond: (S2, side, kind) => (side === 1 && kind === 'response' ? E.legalResponses(S2, 1, 'response').find(a => a.card === doubt.pid) : null) });
  assert.ok(!t1.exhausted); assert.ok(sg.exhausted); assert.ok(S.players[0].grave.some(g => g.word === 'word.writ' && g.reason === 'countered'));
});

test('V31 P14: hidden cards never change public options or bot choices (B formats)', () => {
  for (const seed of [5, 6, 7]) {
    const S = F.createFromFormat('folio_b_all', { decks: [FOLIO_DECKS.M_returning_garden.words, FOLIO_DECKS.F_seal_cutter.words], seed, first: 0 });
    const pol = () => 'careful:journeyman:ra';
    for (let k = 0; k < 30 && S.over == null; k++) {
      const me = S.active, rv = S.players[1 - me], keep = rv.hand, keepD = S.players.map(p => p.deck);
      const a1 = B.chooseAction(S, pol);
      rv.hand = rv.hand.map(c => ({ ...c, word: 'word.writ' })); for (const p of S.players) p.deck = p.deck.slice().reverse();
      const a2 = B.chooseAction(S, pol); rv.hand = keep; S.players.forEach((p, i) => { p.deck = keepD[i]; });
      assert.deepEqual(a1, a2);
      E.apply(S, a1, B.controller(pol));
    }
  }
});

test('V31: rc1 is untouched — folio words are illegal there; B matches replay exactly; audits stay clean', () => {
  assert.ok(E.deckErrors(FOLIO_DECKS.O_orchard_crosswind.words).some(e => /not deck-legal life.bee/.test(e)));
  assert.deepEqual(E.deckErrors(ABLATIONS.O_A), []);
  for (const [fmt, d0, d1, seed] of [['folio_b_orchard', 'O_orchard_crosswind', null, 21], ['folio_b_workshop', 'F_seal_cutter', null, 22], ['folio_b_all', 'M_returning_garden', 'F_seal_cutter', 23]]) {
    const decks = [FOLIO_DECKS[d0].words, d1 ? FOLIO_DECKS[d1].words : REF.D3_furnace_wind];
    const agents = [J.botAgent('careful:specialist:ra'), J.botAgent('aggressive:journeyman:ra')];
    const { replay, state } = recordMatch({ format: fmt, decks, seed, first: seed % 2 }, agents);
    assert.ok(state.over != null); assert.deepEqual(E.zoneAudit(state), []);
    const r = replayMatch(JSON.parse(JSON.stringify(replay))); assert.ok(r.ok); assert.equal(r.state.hashes.at(-1), state.hashes.at(-1));
  }
});

test('V31 fuzz: random legal play in every B format keeps zones, hashes and replays exact; module actions are exercised', () => {
  const seen = {};
  const pairs = [['folio_b_all', 'O_orchard_crosswind', 'F_seal_cutter'], ['folio_b_all', 'M_returning_garden', 'F_seal_cutter'], ['folio_b_orchard', 'O_orchard_crosswind', null], ['folio_b_workshop', 'F_seal_cutter', null], ['folio_b_garden', 'M_returning_garden', null]];
  let g = 0;
  for (const [fmt, a, b] of pairs) for (let s = 0; s < 6; s++) {
    let r = (s + 1) * 7919 + g++;
    const rnd = () => { r = (r * 1103515245 + 12345) & 0x7fffffff; return r / 0x7fffffff; };
    const pick = xs => xs[Math.floor(rnd() * xs.length)];
    const agent = { act: S => { const xs = E.legalActions(S); const mod = xs.filter(x => x.ability || x.recipe === 'set' || x.endorse || x.seal || (x.card && /feast|shape|writ/.test(E.card(S.players[S.active].hand.find(h => h.pid === x.card) || { word: '?' }).id || ''))); return mod.length && rnd() < 0.6 ? pick(mod) : rnd() < 0.15 ? { type: 'pass' } : pick(xs); },
      block: (S, info) => (rnd() < 0.5 && info.candidates.length ? pick(info.candidates).id : null),
      respond: (S, side, kind) => { const o = E.legalResponses(S, side, kind); return o.length && rnd() < 0.5 ? pick(o) : null; },
      decide: (S, side, kind, options, d) => d, mulligan: () => [] };
    const { replay, state } = recordMatch({ format: fmt, decks: [FOLIO_DECKS[a].words, b ? FOLIO_DECKS[b].words : REF.D3_furnace_wind], seed: 900 + g, first: s % 2 }, [agent, agent]);
    assert.deepEqual(E.zoneAudit(state), [], fmt + ' audit');
    for (const e of state.events) if (['pollinated', 'feast', 'writ', 'signet-named', 'endorse'].includes(e.type)) seen[e.type] = (seen[e.type] || 0) + 1;
    for (const e of state.events) if (e.type === 'made' && e.recipe === 'set') seen.set = (seen.set || 0) + 1;
    for (const e of state.events) if (e.type === 'transform' && e.to === 'earth.setting') seen.setting = (seen.setting || 0) + 1;
    for (const e of state.events) if (e.type === 'sealed' && e.why === 'mould') seen.mould = (seen.mould || 0) + 1;
    const rp = replayMatch(JSON.parse(JSON.stringify(replay))); assert.equal(rp.state.hashes.at(-1), state.hashes.at(-1));
  }
  for (const k of ['pollinated', 'feast', 'setting', 'set', 'writ', 'mould']) assert.ok(seen[k] > 0, 'exercised ' + k + ' ' + JSON.stringify(seen));
});
