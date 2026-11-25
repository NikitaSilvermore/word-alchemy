// V30 playtest match controller (no DOM). The engine stays authoritative and synchronous; whenever it asks the
// human for something (mulligan, block, response, answer, a resolution decision) the controller stops, restores the
// state from just before the operation, shows the prompt on a read-only view of the paused state, and re-runs the
// whole operation deterministically with the collected answers. Every input — human and bot — is logged in the
// same order as src/replay.js records it, so an exported replay re-runs with replayMatch().
'use strict';
const E = require('../../engine29/src/engine');
const B = require('../../engine29/src/bots');
const F = require('../../engine29/src/formats');
const RP = require('../../engine29/src/replay');

class NeedInput { constructor(req) { this.req = req; } }

function snap(S) { const r = S.rand; delete S.rand; const c = structuredClone(S); if (r) S.rand = r; return c; }

function createController(cfg, hooks = {}) {
  // cfg: { format, decks:[human, bot], seed, first, humanSide (0), botPolicy 'careful:journeyman', fixture? }
  const C = {
    cfg, S: null, view: null, inputs: [], queue: [], pending: null, op: null, error: null, chronicle: [],
    human: cfg.humanSide == null ? 0 : cfg.humanSide, auto: { passWhenNoOption: true, passAll: false },
  };
  const bot = 1 - C.human;
  const botPol = () => cfg.botPolicy || 'careful:journeyman';
  const polOf = side => (side === bot ? botPol() : 'careful:journeyman');
  const botCtl = B.controller(polOf), botDec = B.decider(polOf);

  function io(log) {
    let qi = 0;
    const take = req => { if (qi < C.queue.length) return C.queue[qi++]; throw new NeedInput(req); };
    const ctl = {
      block: (S, info) => {
        const side = 1 - info.attacker.ctrl;
        const v = side === C.human ? take({ type: 'block', side, attacker: info.attacker.id, verb: info.verb, target: info.target ? info.target.id : (info.ground ? 'ground' : 'rival'), candidates: info.candidates.map(b => b.id), bonus: info.bonus, group: info.group || null }) : botCtl.block(S, info);
        log.push({ kind: 'block', side, value: v }); return v;
      },
      respond: (S, side, kind) => {
        let v;
        if (side === C.human) {
          const options = E.legalResponses(S, side, kind);
          v = (!options.length && C.auto.passWhenNoOption) || C.auto.passAll ? null : take({ type: 'respond', side, kind, options });
        } else v = botCtl.respond ? botCtl.respond(S, side, kind) : null;
        log.push({ kind: 'respond:' + kind, side, value: v }); return v;
      },
    };
    const decide = (S, side, kind, options, dflt) => {
      const v = side === C.human ? take({ type: 'decide', side, kind, options, dflt }) : botDec(S, side, kind, options, dflt);
      log.push({ kind: 'decide:' + kind, side, value: v }); return v;
    };
    const mulligan = (S, i) => {
      const v = i === C.human ? take({ type: 'mulligan', side: i, hand: S.players[i].hand.map(c => ({ pid: c.pid, word: c.word })) }) : B.mulligan(S, i);
      log.push({ kind: 'mulligan', side: i, value: v }); return v;
    };
    return { ctl, decide, mulligan };
  }

  function chronicleFrom(before, after, actor, act) {
    const lines = after.log.slice(before.log.length);
    const packets = after.stats.packets.slice(before.stats.packets.length);
    const events = after.events.slice(before.events.length);
    C.chronicle.push({ round: after.round, turn: after.turn, actor, act, lines, packets, events: events.filter(e => ['failed', 'cancelled', 'ward', 'reveal', 'rebirth', 'made', 'transform', 'token', 'sealed', 'recover', 'revive', 'control', 'bounce', 'mulligan', 'buy', 'law', 'sky', 'attach', 'decision', 'quick', 'echoed', 'sky-expired', 'law-ended'].includes(e.type)) });
  }

  // run one operation: { kind:'create' } | { kind:'act', act }
  function run(op) {
    C.op = op; C.error = null;
    const before = C.S ? snap(C.S) : null;
    const log = [];
    const x = io(log);
    try {
      if (op.kind === 'create') {
        C.S = cfg.fixture ? cfg.fixture.build(x.mulligan) : F.createFromFormat(cfg.format, { decks: cfg.decks, seed: cfg.seed, first: cfg.first, mulligan: x.mulligan });
        E.setDecider(C.S, x.decide);
        C.S.ptFormat = cfg.format;
      } else {
        E.setDecider(C.S, x.decide);
        log.unshift({ kind: 'act', side: C.S.active, value: op.act });
        const actor = C.S.active;
        E.apply(C.S, op.act, x.ctl);
        chronicleFrom(before, C.S, actor, op.act);
      }
      C.inputs.push(...log); C.queue = []; C.pending = null; C.view = null; C.op = null;
      if (hooks.changed) hooks.changed(C);
      return true;
    } catch (e) {
      if (e instanceof NeedInput) {
        C.view = C.S; // read-only paused state for the prompt
        C.S = before; if (C.S) E.setDecider(C.S, x.decide);
        C.pending = e.req;
        if (hooks.prompt) hooks.prompt(C);
        return false;
      }
      C.S = before; C.view = null; C.pending = null; C.queue = []; C.error = e.message || String(e);
      if (hooks.error) hooks.error(C, e);
      return false;
    }
  }

  C.start = () => run({ kind: 'create' });
  C.act = act => run({ kind: 'act', act });
  C.answer = value => { C.queue.push(value); const op = C.op; C.pending = null; return run(op); };
  C.answerMany = values => { C.queue.push(...values); const op = C.op; C.pending = null; return run(op); }; // several answers confirmed together (End cleanup)
  C.botAct = () => run({ kind: 'act', act: B.chooseAction(C.S, polOf) });
  C.isBotTurn = () => C.S && C.S.over == null && !C.pending && C.S.active === bot;
  C.state = () => C.view || C.S;
  C.replay = () => ({ format: cfg.format, formatVersion: F.resolveFormat(cfg.format).version, decks: cfg.decks, seed: cfg.seed, first: cfg.first, humanSide: C.human, botPolicy: botPol(), inputs: C.inputs, result: C.S ? C.S.over : null, finalHash: C.S && C.S.hashes.length ? C.S.hashes[C.S.hashes.length - 1] : null, fixture: cfg.fixture ? cfg.fixture.id : null, scenario: cfg.fixture && cfg.fixture.id === 'scenario' ? cfg.fixture.spec : null });
  return C;
}

// Rebuild a controller from a saved replay (resume or review). `upto` = number of 'act' inputs to apply (default all).
function restoreController(rep, hooks = {}, fixtures = {}, upto = Infinity) {
  const cfg = { format: rep.format, decks: rep.decks, seed: rep.seed, first: rep.first, humanSide: rep.humanSide || 0, botPolicy: rep.botPolicy, fixture: rep.scenario && fixtures.__fromSpec ? fixtures.__fromSpec(rep.scenario) : rep.fixture ? fixtures[rep.fixture] : null };
  if (rep.fixture && !cfg.fixture) throw new Error('this replay uses a fixture this build does not have: ' + rep.fixture);
  const C = createController(cfg, hooks);
  // feed every recorded input back in order through the same paths
  let k = 0, acts = 0;
  const inputs = rep.inputs;
  const next = (kind, side) => { const x = inputs[k++]; if (!x || x.kind !== kind || x.side !== side) throw new Error(`replay diverged at input ${k - 1}`); return x.value; };
  const log = [];
  let S;
  try {
    S = cfg.fixture ? cfg.fixture.build((S0, i) => { const v = next('mulligan', i); log.push({ kind: 'mulligan', side: i, value: v }); return v; })
      : F.createFromFormat(cfg.format, { decks: cfg.decks, seed: cfg.seed, first: cfg.first, mulligan: (S0, i) => { const v = next('mulligan', i); log.push({ kind: 'mulligan', side: i, value: v }); return v; } });
  } catch (e) { // saved while the opening hand was still on offer: the seeded deal is identical, so simply start again
    if (k >= inputs.length) { const C2 = createController(cfg, hooks); C2.start(); Object.assign(C2, { restoredActs: 0, totalActs: 0 }); return C2; }
    throw e;
  }
  E.setDecider(S, (S0, side, kind) => { const v = next('decide:' + kind, side); log.push({ kind: 'decide:' + kind, side, value: v }); return v; });
  const ctl = {
    block: (S0, info) => { const side = 1 - info.attacker.ctrl; const v = next('block', side); log.push({ kind: 'block', side, value: v }); return v; },
    respond: (S0, side, kind) => { const v = next('respond:' + kind, side); log.push({ kind: 'respond:' + kind, side, value: v }); return v; },
  };
  while (S.over == null && k < inputs.length && acts < upto) {
    const a = next('act', S.active); log.push({ kind: 'act', side: S.active, value: a });
    const before = snap(S), k0 = k, log0 = log.length;
    try { E.apply(S, a, ctl); } catch (e) { // saved part-way through a sentence: resume just before it
      if (k < inputs.length) throw e;
      const r = S.rand; S = before; if (r) S.rand = r; log.length = log0 - 1; void k0; break;
    }
    acts++;
    C.chronicle.push({ round: S.round, turn: S.turn, actor: before.active, act: a, lines: S.log.slice(before.log.length), packets: S.stats.packets.slice(before.stats.packets.length), events: [] });
  }
  C.S = S; C.inputs = log; C.S.ptFormat = cfg.format;
  Object.assign(C, { restoredActs: acts, totalActs: inputs.filter(x => x.kind === 'act').length });
  return C;
}

module.exports = { createController, restoreController, NeedInput, snap, RP };
