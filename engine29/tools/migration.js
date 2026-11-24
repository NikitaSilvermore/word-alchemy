// Migration table: V21 web build card list (duel-test-source:duel-test/build/web21.json, the newest card data in git)
// against the V29 registry. Classifies every word; never deletes. The live V28 definitions are not in git (see §15 Q11).
// node tools/migration.js /path/to/web21.json
'use strict';
const fs = require('fs');
const { CARDS, MADE, TOKENS } = require('../src/cards');
const old = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).cards;
const v29 = {}; for (const c of CARDS) v29[c.id.split('.')[1]] = c;
const madeNames = new Set(MADE.map(m => m.id.split('.')[1]).concat(TOKENS.map(t => t.id.split('.')[1])));
const rows = [];
for (const [name, o] of Object.entries(old).sort()) {
  const key = name.toLowerCase().replace(/[^a-z]+/g, '_');
  const n = v29[key];
  let status;
  if (n && n.school === o.sch) status = n.deckLegal ? 'kept' : 'kept (transformed-only)';
  else if (n) status = `school changed (${o.sch} → ${n.school})`;
  else if (madeNames.has(key)) status = 'now made-only / token';
  else status = 'legacy — not in the 150 (keep ID, disable in V29 format)';
  rows.push({ word: name, v21School: o.sch, v21Tier: o.tier, v29Id: n ? n.id : null, status });
}
const added = CARDS.filter(c => !Object.keys(old).some(w => w.toLowerCase().replace(/[^a-z]+/g, '_') === c.id.split('.')[1])).map(c => c.id);
const sum = rows.reduce((a, r) => { const k = r.status.split(' (')[0].split(' —')[0]; a[k] = (a[k] || 0) + 1; return a; }, {});
fs.writeFileSync('data/migration_v21_to_v29.json', JSON.stringify({ source: 'duel-test-source:duel-test/build/web21.json', summary: sum, newInV29: added, rows }, null, 1));
const md = ['# Migration: V21 card list → V29 registry', '', `Source: \`duel-test-source:duel-test/build/web21.json\` (${rows.length} words). The live V28 definitions are only in the artifact and were not compared.`, '',
  '| Status | Words |', '|---|---|', ...Object.entries(sum).map(([k, v]) => `| ${k} | ${v} |`), '',
  `New in V29 (not in the V21 list): ${added.length} — ${added.join(', ')}.`, '',
  '| V21 word | V21 school | V29 id | Status |', '|---|---|---|---|', ...rows.map(r => `| ${r.word} | ${r.v21School} | ${r.v29Id || '—'} | ${r.status} |`)];
fs.writeFileSync('MIGRATION.md', md.join('\n'));
console.log(sum, 'new', added.length);
