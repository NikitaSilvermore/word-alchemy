// Coverage audit of atlas_data.json. usage: node tools/audit.js
'use strict';
const D = require('../data/atlas_data.json'), W = D.words;
const ok = id => W[id] || ['you', 'rival', 'self', 'ground'].includes(id) || String(id).startsWith('ground:');
const dangling = [];
for (const e of D.edges) for (const k of ['from', 'to']) if (!ok(e[k])) dangling.push('edge ' + k + ' ' + e[k]);
for (const t of D.transforms) for (const k of ['from', 'to']) if (!ok(t[k])) dangling.push('transform ' + t[k]);
for (const r of D.recipes) for (const i of r.inputs.concat([r.output])) if (!ok(i.replace(/^ground:/, ''))) dangling.push('recipe ' + i);
for (const c of D.creates) for (const k of ['from', 'to']) if (!ok(c[k])) dangling.push('create ' + c[k]);
const cnt = o => Object.values(W).filter(w => w.origin === o).length;
const deckWords = new Set(Object.values(D.decks).flatMap(d => d.words));
const silent = [...deckWords].filter(id => !D.edges.some(e => e.layers.includes('core') && (e.from === id || e.to === id)) && !D.transforms.some(t => t.from === id || t.to === id || t.op === 'card:' + id) && !D.recipes.some(r => r.inputs.map(i => i.replace(/^ground:/, '')).includes(id) || r.op === 'card:' + id) && !D.creates.some(c => c.from === id || c.to === id));
const neverUsable = Object.entries(D.handUse).filter(([id, h]) => deckWords.has(id) && h.usable === 0).map(([id, h]) => id + ' (held ' + h.held + ')');
const opsWithoutEffects = Object.values(D.ops).filter(o => o.layers.includes('core') && o.source && deckWords.has(o.source) && !D.edges.some(e => e.op === o.id) && !D.transforms.some(t => t.op === o.id) && !D.recipes.some(r => r.op === o.id) && !D.creates.some(c => c.op === o.id)).map(o => o.id);
const res = {
  build: D.build.label + ' · ' + D.build.format + ' · commit ' + D.build.commit + (D.build.gameSourceChanged.length ? ' (game source changed locally: ' + D.build.gameSourceChanged.join(', ') + ')' : ''),
  words: { startingDistinct: cnt('starting'), deckSlots: Object.values(D.decks).reduce((n, d) => n + d.words.length, 0), createdForms: cnt('created'), otherEnabled: cnt('enabled'), formsOfOtherEnabled: cnt('enabled-form'), codeOnly: cnt('code'), total: Object.keys(W).length },
  sharedWords: [...deckWords].filter(id => Object.values(D.decks).filter(d => d.words.includes(id)).length > 1),
  relationships: { effectLinks: D.edges.length, formChanges: D.transforms.length, recipeInstances: D.recipes.length, products: D.creates.length, combatNotes: D.combat.length, coreLayerEffectLinks: D.edges.filter(e => e.layers.includes('core')).length },
  recipeTable: { entries: D.recipeTable.length, neverPerformed: D.recipeTable.filter(r => !r.observed).map(r => r.id) },
  probe: D.probe.core && { core: D.probe.core, vocabulary: D.probe.vocabulary, seconds: D.probe.seconds },
  danglingIds: dangling,
  deckWordsWithNoObservedRelationship: silent,
  deckWordsNeverUsableInProbe: neverUsable,
  deckOperationsWithNoRecordedEffect: opsWithoutEffects,
  engineChecks: D.checks.map(c => c.claim + ' → ' + c.verdict.toUpperCase() + ': ' + c.reason),
};
console.log(JSON.stringify(res, null, 1));
