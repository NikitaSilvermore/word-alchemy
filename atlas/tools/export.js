// Tabular exports of atlas_data.json for other tools. usage: node tools/export.js <outdir>
'use strict';
const fs = require('fs'), path = require('path');
const D = require('../data/atlas_data.json'), out = process.argv[2] || 'exports';
fs.mkdirSync(out, { recursive: true });
const csv = rows => rows.map(r => r.map(v => { const s = String(v == null ? '' : Array.isArray(v) ? v.join(' ') : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',')).join('\n') + '\n';
const nm = id => (D.words[id] ? D.words[id].name : id);
fs.writeFileSync(path.join(out, 'words.csv'), csv([['id', 'name', 'school', 'type', 'cost', 'strike', 'stand', 'origin', 'decks', 'properties', 'keywords', 'capabilities', 'response', 'card_text', 'source_definition', 'source_text']].concat(Object.values(D.words).map(w => [w.id, w.name, w.school, w.type, w.cost, w.strike, w.stand, w.origin, w.decks, w.props, w.kw, w.cap, w.response, w.text, w.src.card, w.src.text]))));
const rel = [['kind', 'verb_or_family', 'from', 'to', 'inputs_all_required', 'operation', 'mode', 'side', 'breath_observed', 'also_sacrificed', 'witness_runs', 'layers', 'always_co_present']];
for (const t of D.transforms) rel.push(['form change', 'becomes', t.from, t.to, '', t.op, t.mode, 'mine', t.costs, t.consumes, t.n, t.layers, t.co || '']);
for (const r of D.recipes) rel.push(['recipe', r.recipe, r.inputs.join(' AND '), r.output, r.inputs.join(' AND '), r.op, '', 'mine', r.costs, '', r.n, r.layers, r.co || '']);
for (const c of D.creates) rel.push(['product', 'creates', c.from, c.to, '', c.op, c.mode, 'mine', c.costs, c.consumes, c.n, c.layers, c.co || '']);
for (const e of D.edges) rel.push(['effect', e.verb + ':' + e.fam, e.from, e.to, '', e.op, e.mode, e.side, e.costs, e.consumes, e.n, e.layers, e.co || '']);
fs.writeFileSync(path.join(out, 'relationships.csv'), csv(rel));
fs.writeFileSync(path.join(out, 'recipe_table.csv'), csv([['id', 'source_table', 'input_a', 'input_b', 'output_in_this_build', 'breath', 'observed_runs', 'observed_layers']].concat(D.recipeTable.map(r => [r.id, r.table, JSON.stringify(r.a), JSON.stringify(r.b), r.outInThisBuild || 'quality (host keeps its form)', r.cost, r.observed, r.observedLayers]))));
fs.writeFileSync(path.join(out, 'decks.csv'), csv([['deck', 'name', 'word_id', 'word', 'kind']].concat(Object.entries(D.decks).flatMap(([k, d]) => d.words.map(w => [k, d.name, w, nm(w), 'starting']).concat(d.forms.map(f => [k, d.name, f, nm(f), 'can create']))))));
fs.writeFileSync(path.join(out, 'engine_checks.json'), JSON.stringify(D.checks, null, 1));
console.log('exported', fs.readdirSync(out).join(', '), 'rows', rel.length - 1);
