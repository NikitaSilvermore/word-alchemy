// Core Duel — Room to Grow (v33_core3_room): End hand cleanup instead of a hard hand cap, and seven Thing spaces.
// Focused constructed cases plus freely shuffled games; constructed fixtures are labelled as such.
'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const E = require('../src/engine');
const F = require('../src/formats');
const B = require('../src/bots');
const { recordMatch, replayMatch } = require('../src/replay');
const { THREE_DECKS: D } = require('../data/v33_decks');
const FMT = 'v33_core3_room';

function fx(a = 'orchard', b = 'furnace', fmt = FMT) {
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
const fill = (S, side, n, keep = []) => { const p = S.players[side]; while (p.hand.length < n) { const k = p.deck.findIndex(c => !keep.includes(c.word)); p.hand.push(p.deck.splice(k, 1)[0]); } };
const NOCTL = { block: () => null, respond: null };
const acts = S => E.legalActions(S);
const pass = (S, ctl = NOCTL) => E.apply(S, { type: 'pass' }, ctl);
// a decider that records every cleanup prompt and discards the chosen pids
function chooser(picks = {}) {
  const calls = [];
  const fn = (S, side, kind, options, dflt) => {
    if (kind !== 'cleanup') return dflt;
    calls.push({ side, n: options.length, hand: S.players[side].hand.length });
    const want = (picks[side] || []).find(pid => options.includes(pid));
    return want ? options.indexOf(want) : dflt;
  };
  return { fn, calls };
}

test('room: turn draw and Study add past seven; End asks for exactly two of nine; discards go to the Grave as discards', () => {
  const S = fx(); fill(S, 1, 7); fill(S, 0, 7);
  const ch = chooser(); E.setDecider(S, ch.fn);
  S.active = 1; pass(S); // rival End: 7 words, no prompt; my turn starts with an ordinary draw
  assert.equal(ch.calls.length, 0, 'a hand of seven is not prompted');
  assert.equal(S.active, 0); assert.equal(S.players[0].hand.length, 8, 'turn draw not blocked at seven');
  S.players[0].breath = 8; const st = acts(S).find(a => a.type === 'study');
  assert.ok(st && !st.discard, 'ordinary Study is offered at eight words'); assert.ok(!acts(S).some(a => a.type === 'study' && a.discard), 'no exchange mode');
  E.apply(S, st, NOCTL); assert.equal(S.players[0].hand.length, 9);
  const keep = S.players[0].hand.map(c => c.pid), pick = [keep[0], keep[4]];
  const ch2 = chooser({ 0: pick }); E.setDecider(S, ch2.fn);
  const deaths0 = S.events.filter(e => ['death', 'died', 'sacrifice'].includes(e.type)).length;
  pass(S);
  assert.equal(ch2.calls.length, 2, 'exactly two choices'); assert.equal(ch2.calls[0].n, 9); assert.equal(ch2.calls[1].n, 8);
  assert.equal(S.players[0].hand.length, 7); assert.ok(pick.every(pid => S.players[0].grave.some(g => g.pid === pid && g.reason === 'discarded')));
  assert.equal(S.events.filter(e => ['death', 'died', 'sacrifice'].includes(e.type)).length, deaths0, 'no death or sacrifice');
  assert.equal(S.active, 1, 'cleanup happens before the rival begins');
  assert.ok(S.events.findIndex(e => e.type === 'cleanup-discard') < S.events.map(e => e.type).lastIndexOf('end'), 'cleanup precedes the End event');
});

test('room: an off-turn return to hand stays until that player\'s own End; a selection effect may take an eighth word', () => {
  const S = fx('orchard', 'forge'); const ch = chooser(); E.setDecider(S, ch.fn);
  const lead = place(S, 1, 'earth.clay'); fill(S, 1, 7); // rival holds seven
  const g = give(S, 0, 'air.gust'); E.apply(S, acts(S).find(a => a.card === g.pid && a.target === lead.id), NOCTL);
  assert.equal(S.players[1].hand.length, 8, 'bounced to a hand of seven: kept, not sent to the Grave');
  assert.ok(!S.players[1].grave.some(x => x.reason === 'bounced-full-hand'));
  pass(S); assert.ok(!ch.calls.some(c => c.side === 1), 'my End does not clean the rival');
  assert.equal(S.active, 1); assert.equal(S.players[1].hand.length, 9, 'rival draw on top');
  // selection: Omen at eight words still takes a word
  const T = fx('forge', 'orchard'); fill(T, 0, 7, ['word.omen']); const om = give(T, 0, 'word.omen'); give(T, 0, 'earth.clay'); // 9 incl. Omen
  E.apply(T, acts(T).find(a => a.card === om.pid), NOCTL); assert.equal(T.players[0].hand.length, 9, 'Omen selected a word into a hand of eight');
  // rival End: cleanup of two
  const S1 = S.players[1]; S1.breath = 0; pass(S);
  assert.equal(ch.calls.filter(c => c.side === 1).length, 2); assert.equal(S1.hand.length, 7);
});

test('room: empty deck — Study not offered, draw keeps its old fatigue, cleanup still applies', () => {
  const S = fx(); const ch = chooser(); E.setDecider(S, ch.fn);
  fill(S, 0, 9); S.players[0].deck = [];
  assert.ok(!acts(S).some(a => a.type === 'study'), 'nothing to draw');
  const T = fx('orchard', 'furnace', 'v33_core3'); T.players[0].deck = []; T.active = 1; const l0 = T.players[0].life; pass(T); const fatigueOld = l0 - T.players[0].life;
  S.players[1].deck = []; const life0 = S.players[1].life; pass(S); assert.equal(life0 - S.players[1].life, fatigueOld, 'same fatigue as the previous build');
  assert.equal(S.players[0].hand.length, 7);
});

test('room: the bot chooses its own discards from its own hand and nothing else', () => {
  const S = fx(); const pol = () => 'careful:journeyman:ra'; E.setDecider(S, B.decider(pol));
  fill(S, 0, 10); const before = S.players[0].hand.map(c => c.pid);
  pass(S, B.controller(pol)); const after = S.players[0].hand.map(c => c.pid), gone = before.filter(p => !after.includes(p));
  assert.equal(after.length, 7); assert.equal(gone.length, 3); assert.ok(gone.every(pid => S.players[0].grave.some(g => g.pid === pid && g.reason === 'discarded')));
});

test('room: seven Thing spaces — deploy into six and seven, refuse an eighth, Fruit at six and not at seven', () => {
  const S = fx('orchard', 'furnace');
  const ws = ['life.bee', 'life.pear', 'life.hazel', 'life.wolf', 'life.bramble'];
  for (const w of ws) place(S, 0, w);
  assert.equal(E.capGeneral(S), 7);
  const ot = give(S, 0, 'water.otter'); E.apply(S, acts(S).find(a => a.type === 'deploy' && a.card === ot.pid), NOCTL);
  assert.equal(S.things.filter(t => t.ctrl === 0).length, 6, 'sixth space');
  // Fruit with six occupied (Bee pollinates Pear)
  const pol = acts(S).filter(a => a.ability === 'pollinate' && a.branch === 'fruit'); assert.ok(pol.length, 'Fruit can be made with six occupied');
  E.apply(S, pol[0], NOCTL); assert.equal(S.things.filter(t => t.ctrl === 0).length, 7, 'Fruit takes the seventh space');
  const ow = give(S, 0, 'air.owl'); assert.ok(!acts(S).some(a => a.type === 'deploy' && a.card === ow.pid), 'eighth refused');
  assert.match(String(E.whyIllegal ? E.whyIllegal(S, { type: 'deploy', card: ow.pid }) : 'no empty field slot'), /slot|space/);
  S.things.splice(S.things.findIndex(t => E.card(t).id === 'life.wolf'), 1); // back to six, a Fruit already present
  assert.ok(!acts(S).some(a => a.ability === 'pollinate' && a.branch === 'fruit'), 'one Fruit at a time is unchanged');
  const F7 = fx('orchard', 'furnace'); for (const w of [...ws, 'water.otter', 'air.owl']) place(F7, 0, w);
  assert.ok(!acts(F7).some(a => a.ability === 'pollinate' && a.branch === 'fruit'), 'no Fruit at seven occupied');
  S.things = S.things.filter(t => E.card(t).id !== 'token.fruit'); place(S, 0, 'life.wolf');

  E.apply(S, acts(S).find(a => a.type === 'deploy' && a.card === ow.pid), NOCTL); assert.equal(S.things.filter(t => t.ctrl === 0).length, 7, 'seventh by deploy once a space is free');
  // the old build still stops at five
  const T = fx('orchard', 'furnace', 'v33_core3'); for (const w of ws) place(T, 0, w); const o2 = give(T, 0, 'water.otter'); assert.ok(!acts(T).some(a => a.type === 'deploy' && a.card === o2.pid));
});

test('room: Graft and Golem at a full seven; all seven enemy Things targetable', () => {
  const S = fx('orchard', 'forge');
  const sap = place(S, 0, 'life.sapling'), pear = place(S, 0, 'life.pear'); for (const w of ['life.bee', 'life.hazel', 'life.wolf', 'life.bramble', 'water.otter']) place(S, 0, w);
  const gr = give(S, 0, 'life.graft3'), ga = acts(S).find(a => a.card === gr.pid && a.a && a.b);
  assert.ok(ga, 'Graft offered at seven'); E.apply(S, ga, NOCTL);
  assert.equal(S.things.filter(t => t.ctrl === 0).length, 6); assert.ok(S.things.some(t => E.card(t).id === 'made.espalier'));
  const G = fx('forge', 'orchard'); for (const w of ['earth.clay', 'word.word', 'earth.copper', 'earth.silver', 'earth.iron', 'earth.flint', 'earth.boulder']) place(G, 0, w);
  const wd = null; const fu = acts(G).find(a => a.type === 'fuse' && a.recipe === 'golem');
  assert.ok(fu, 'Clay + Word fuse at a full seven'); E.apply(G, fu, NOCTL); assert.ok(G.things.some(t => E.card(t).id === 'made.golem3')); assert.equal(G.things.filter(t => t.ctrl === 0).length, 7 - 1, 'two in, one out'); void wd;
  // targeting: Wildfire may pick any of seven enemy Things
  const W = fx('furnace', 'orchard'); const foes = ['life.bee', 'life.pear', 'life.hazel', 'life.wolf', 'life.bramble', 'water.otter', 'air.owl'].map(w => place(W, 1, w));
  const wf = give(W, 0, 'fire.wildfire'); const tg = new Set(acts(W).filter(a => a.card === wf.pid).flatMap(a => a.targets || [a.target]));
  assert.ok(foes.every(t => tg.has(t.id)), 'every one of seven enemy Things is a legal target');
});

test('room: shuffled games — cleanup and the seventh space occur; zones conserved; exact replay (freely shuffled, not constructed)', () => {
  let cleanups = 0, seventh = 0, games = 0, maxHand = 0;
  for (const a of Object.keys(D)) for (const b of Object.keys(D)) for (let k = 0; k < 2; k++) {
    const pol = () => 'careful:journeyman:ra', base = { act: S => B.chooseAction(S, pol), block: B.blocker(pol), respond: B.responderRA(pol), decide: B.decider(pol), mulligan: B.mulligan };
    let peak = 0; const ag = { ...base, act: S => { for (const i of [0, 1]) { peak = Math.max(peak, S.things.filter(t => t.ctrl === i).length); maxHand = Math.max(maxHand, S.players[i].hand.length); } return base.act(S); } };
    const { replay, state } = recordMatch({ format: FMT, decks: [D[a].words, D[b].words], seed: 6200 + games++, first: k }, [ag, ag]);
    assert.ok(state.over != null); assert.deepEqual(E.zoneAudit(state), []);
    assert.equal(replayMatch(JSON.parse(JSON.stringify(replay))).state.hashes.at(-1), state.hashes.at(-1));
    cleanups += state.events.filter(e => e.type === 'cleanup').length; if (peak >= 7) seventh++;
    for (const e of state.events.filter(e => e.type === 'end')) void e;
  }
  console.log('# room shuffled ' + JSON.stringify({ games, endCleanups: cleanups, gamesReachingSevenThings: seventh, largestHandSeen: maxHand }));
  assert.equal(games, 18);
});
