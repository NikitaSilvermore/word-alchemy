// Reproducible replays (§14.5): a replay is the format id, decks, seed, starting player and the ordered list of
// every input a player supplied — mulligan, Main sentences, blocks, responses and resolution decisions.
// Replaying feeds the same inputs back and must reach the same state hash after every action.
'use strict';
const E = require('./engine');
const { createFromFormat, resolveFormat } = require('./formats');

function replayId(rep) {
  const t = JSON.stringify([rep.format, rep.decks, rep.seed, rep.first, rep.inputs]);
  let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); }
  return 'rp_' + (h >>> 0).toString(16);
}

// agents[i] = { mulligan(S,i), act(S), block(S,info), respond(S,side,kind), decide(S,side,kind,options,dflt) }
function recordMatch({ format, decks, seed, first = 0 }, agents, maxSteps = 3000) {
  const inputs = [];
  const log = (kind, side, value) => { inputs.push({ kind, side, value }); return value; };
  const S = createFromFormat(format, { decks, seed, first, mulligan: (S0, i) => log('mulligan', i, agents[i].mulligan ? agents[i].mulligan(S0, i) : []) });
  E.setDecider(S, (S0, side, kind, options, dflt) => log('decide:' + kind, side, agents[side].decide ? agents[side].decide(S0, side, kind, options, dflt) : dflt));
  const ctl = {
    block: (S0, info) => { const side = 1 - info.attacker.ctrl; return log('block', side, agents[side].block ? agents[side].block(S0, info) : null); },
    respond: (S0, side, kind) => log('respond:' + kind, side, agents[side].respond ? agents[side].respond(S0, side, kind) : null),
  };
  const hashes = [];
  for (let k = 0; k < maxSteps && S.over == null; k++) { const a = log('act', S.active, agents[S.active].act(S)); E.apply(S, a, ctl); hashes.push(S.hashes[S.hashes.length - 1]); }
  const rep = { format, formatVersion: resolveFormat(format).version, engineRevision: E.REVISION.id, decks, seed, first, inputs, hashes, result: S.over };
  rep.id = replayId(rep);
  return { replay: rep, state: S };
}

function replayMatch(rep) {
  const cur = resolveFormat(rep.format).version;
  if (rep.formatVersion && rep.formatVersion !== cur) throw new Error(`replay is for ${rep.format} ${rep.formatVersion}; this engine has ${cur}`);
  const rev = rep.engineRevision || 'r30.0';
  try { return { ...replayMatch0(rep), revision: rev, sameRevision: rev === E.REVISION.id }; }
  catch (e) { if (rev !== E.REVISION.id) e.message += ` (recorded under engine ${rev}; changes since: ${E.REVISION.log.filter(r => r.id > rev).map(r => r.id + ' ' + r.note).join(' | ')})`; throw e; }
}
function replayMatch0(rep) {
  let k = 0;
  const next = (kind, side) => {
    const x = rep.inputs[k++];
    if (!x || x.kind !== kind || x.side !== side) throw new Error(`replay diverged at input ${k - 1}: expected ${kind}/${side}, found ${x ? x.kind + '/' + x.side : 'end'}`);
    return x.value;
  };
  const S = createFromFormat(rep.format, { decks: rep.decks, seed: rep.seed, first: rep.first, mulligan: (S0, i) => next('mulligan', i) });
  E.setDecider(S, (S0, side, kind) => next('decide:' + kind, side));
  const ctl = { block: (S0, info) => next('block', 1 - info.attacker.ctrl), respond: (S0, side, kind) => next('respond:' + kind, side) };
  let step = 0;
  while (S.over == null && k < rep.inputs.length) {
    E.apply(S, next('act', S.active), ctl);
    if (rep.hashes && rep.hashes[step] !== S.hashes[S.hashes.length - 1]) throw new Error('replay hash mismatch at action ' + step);
    step++;
  }
  return { state: S, ok: S.over === rep.result && k === rep.inputs.length };
}

module.exports = { recordMatch, replayMatch, replayId };
