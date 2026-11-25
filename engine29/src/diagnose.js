// V32 diagnostics: why an interaction is not being made. For the side to act, each interaction family is classified as
//   unavailable  — no legal action now, and more breath/spark would not change that (the engine's own reason is shown)
//   unaffordable — it would be legal with more breath or spark
//   too slow     — not legal now, but legal at this side's next Main if nothing else happens (null-move rival turn)
//   inferior     — legal now, but the bounded planner values its best line below the best line overall
//   best         — legal now and the planner's choice (or within 0.25 of it)
// Uses only what the acting side can see: the redacted view from bots.redact.
'use strict';
const E = require('./engine');
const B = require('./bots');

function familyOf(S, a) {
  if (a.type === 'invite') return 'invite ' + a.kind; if (a.type === 'hotwork') return 'borrow heat'; if (a.type === 'claim') return 'declare work (W5)';
  if (a.type === 'ability') return a.ability === 'visit' ? 'visit orchard' : a.ability === 'eatFruit' ? 'eat Fruit' : a.ability === 'signet' ? 'Signet' : a.ability === 'shapeWork' ? 'Smith shapes' : a.ability === 'pollinate' ? 'pollinate' : 'ability ' + a.ability;
  if (a.type === 'fuse') return 'fuse ' + (a.recipe || ''); if (a.type === 'attack') return 'attack'; if (a.type === 'deploy') return 'deploy'; if (a.type === 'buy') return 'buy';
  if (a.card) { const c = S.players[S.active].hand.find(h => h.pid === a.card); if (c) { const id = E.card(c).id; if (['earth.shape', 'life.feast', 'word.writ'].includes(id)) return id.split('.')[1][0].toUpperCase() + id.split('.')[1].slice(1); } }
  return null;
}
const WATCH = ['attack', 'deploy', 'pollinate', 'eat Fruit', 'Feast', 'Shape', 'Smith shapes', 'fuse set', 'Signet', 'Writ', 'invite orchard', 'invite heat', 'visit orchard', 'borrow heat', 'declare work (W5)', 'fuse swamp', 'fuse life', 'fuse world_tree'];

function reasonFor(S, side, fam) { // the engine's own explanation for the nearest candidate
  const mine = S.things.filter(t => t.ctrl === side), foes = S.things.filter(t => t.ctrl !== side), first = xs => xs.find(Boolean) || null;
  if (fam === 'invite orchard') { const trees = mine.filter(h => E.trait(S, h, 'pollination') === 'insect'); return trees.length ? first(trees.map(h => E.invitationWhy(S, side, 'orchard', h.id))) : 'you have no insect-pollinated orchard tree (Pear) on the field'; }
  if (fam === 'invite heat') return E.invitationWhy(S, side, 'heat');
  if (fam === 'visit orchard') { const bees = mine.filter(t => E.card(t).id === 'life.bee'); if (!bees.length) return 'you have no Bee'; return first(bees.flatMap(b => foes.map(h => E.visitWhy(S, side, b, h)))) || 'no opposing tree to visit'; }
  if (fam === 'borrow heat') { const m = mine.filter(t => ['earth.copper', 'earth.silver'].includes(E.card(t).id)); return m.length ? first(m.map(x => E.hotworkWhy(S, side, x))) : (E.hotworkWhy(S, side, null) || 'you have no Copper or Silver'); }
  if (fam === 'declare work (W5)') { const tr = mine.filter(t => E.card(t).id === 'made.world_tree'); if (!tr.length) return E.w5Why(S, side, null, null); return first(tr.flatMap(t => mine.map(b => E.w5Why(S, side, t, b)))); }
  if (fam === 'fuse set') return S.things.some(t => t.ctrl === side && E.card(t).id === 'earth.setting') ? 'a Setting and a Garnet must both be ready and one mature, with 2 breath, one fusion per turn' : 'Set needs a Setting: work the Copper or Silver first (Shape, Smith or borrowed heat); the made Setting is Fresh until your next turn';
  if (fam === 'Signet') return S.things.some(t => t.ctrl === side && E.card(t).id === 'made.signet') ? 'the Signet must be mature and ready' : 'no Signet yet: Setting + Garnet in the Vessel, two turns at the earliest';
  if (fam === 'Writ' || fam === 'Shape' || fam === 'Feast') { const c = S.players[side].hand.find(h => E.card(h).id === { Writ: 'word.writ', Shape: 'earth.shape', Feast: 'life.feast' }[fam]); const r = c && E.whyIllegal(S, { type: 'spell', card: c.pid }); return r && r !== 'not a legal sentence now' ? r : fam === 'Writ' ? 'no ready rival Person or Speaker to exhaust, and no ready Signet to endorse it' : 'no legal target for it now'; }
  if (fam === 'attack') return mine.length ? 'none of your Things can strike now (fresh, exhausted, or not permitted)' : 'you have no Things';
  return 'no legal action of this kind in this position';
}
const famsOf = (S, acts) => new Set(acts.map(a => familyOf(S, a)).filter(Boolean));

function diagnose(S0, policyOf) {
  const side = S0.active, S = B.redact(S0, side);
  if (S0.over != null) return { side, rows: [], note: 'the duel is over' };
  const acts = E.legalActions(S), now = famsOf(S, acts);
  const rich = B.redact(S0, side); rich.players[side].breath += 6; rich.players[side].spark = Math.min(5, rich.players[side].spark + 3);
  const richF = famsOf(rich, E.legalActions(rich));
  // next Main after a null-move rival turn
  let later = new Set();
  try { const c = B.redact(S0, side); const t0 = c.players[side].personalTurn; for (let k = 0; k < 4 && c.over == null; k++) { if (c.active === side && c.players[side].personalTurn > t0) break; E.apply(c, { type: 'pass' }, { block: () => null, respond: null }); } if (c.over == null && c.active === side) later = famsOf(c, E.legalActions(c)); } catch (e) { /* hidden cards drawn: leave empty */ }
  const plan = B.planRank(S0, policyOf, a => familyOf(S, a)), bestPlan = plan.ranked.length ? plan.ranked[0].plan : 0;
  const famBest = {}, famLethal = {}; for (const o of plan.ranked) { const f = familyOf(S, o.a) || (o.a.type === 'pass' ? 'pass' : 'other'); if (famBest[f] === undefined || o.plan > famBest[f]) { famBest[f] = o.plan; famLethal[f] = o.lethal; } }
  const oneBest = {}; for (const o of plan.oneply) { const f = familyOf(S, o.a); if (f && (oneBest[f] === undefined || o.v > oneBest[f])) oneBest[f] = o.v; }
  const mods = S.rules.modules || [];
  const inHand = id => S.players[side].hand.some(h => E.card(h).id === id), onField = id => S.things.some(t => t.ctrl === side && E.card(t).id === id);
  const present = { Writ: inHand('word.writ'), Shape: inHand('earth.shape'), Feast: inHand('life.feast'), 'fuse set': onField('earth.garnet'), Signet: onField('earth.garnet') || onField('made.signet') };
  const relevant = WATCH.filter(f => now.has(f) || richF.has(f) || later.has(f) || present[f] || (/invite orchard|visit/.test(f) && (mods.includes('visit') || mods.includes('visit_draw'))) || (/heat/.test(f) && mods.includes('heat')) || (/W5/.test(f) && mods.includes('w5')));
  const rows = relevant.map(f => {
    if (now.has(f)) {
      const v = famBest[f], gap = v === undefined ? null : bestPlan - v;
      const status = gap != null && gap <= 0.25 ? 'best' : 'inferior';
      const warn = famLethal[f] ? ' — but after this line the rival\'s visible attackers can take your remaining life first' : '';
      return { family: f, status, warn, detail: gap == null ? 'legal, but every line starting with it failed to evaluate' : status === 'best' ? 'legal; the planner\'s best line starts here' + warn : `legal; the planner values its best line ${gap.toFixed(2)} below the best (${familyOf(S, plan.ranked[0].a) || plan.ranked[0].a.type})` + warn };
    }
    if (richF.has(f)) return { family: f, status: 'unaffordable', detail: reasonFor(S, side, f) };
    if (later.has(f)) return { family: f, status: 'too slow', detail: 'not legal now; legal at your next Main if the rival does nothing — ' + reasonFor(S, side, f) };
    return { family: f, status: 'unavailable', detail: reasonFor(S, side, f) };
  });
  return { side, rows, best: plan.ranked[0] ? { act: plan.ranked[0].a, family: familyOf(S, plan.ranked[0].a), plan: plan.ranked[0].plan, line: plan.ranked[0].line, threat: plan.ranked[0].threat } : null };
}
module.exports = { diagnose, familyOf };
