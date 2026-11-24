// Parse the V29 spec §8 catalogue tables into JSON (name, school, type, cost, R flag, strike/stand, text).
'use strict';
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8').split('\n');
const SCHOOLS = { '8.1': 'fire', '8.2': 'water', '8.3': 'air', '8.4': 'earth', '8.5': 'life', '8.6': 'rot', '8.7': 'word', '8.8': 'legacy' };
let school = null; const out = [];
for (const line of src) {
  const h = line.match(/^### (8\.\d)/); if (h) { school = SCHOOLS[h[1]]; continue; }
  if (/^## 9\./.test(line)) break;
  if (!school || !line.startsWith('| ') || /^\|---/.test(line)) continue;
  const c = line.split('|').slice(1, -1).map(x => x.trim());
  if (school === 'legacy') { out.push({ name: c[0], school: 'legacy', raw: c.slice(1).join(' | ') }); continue; }
  if (c[1] === 'Type / cost') continue;
  const m = c[1].match(/^([A-Z])(\/R)?\s+(\d+)$/);
  if (!m) continue;
  const st = c[2].match(/^(\d+|—)\/(\d+)$/);
  out.push({ name: c[0], school, type: { T: 'thing', A: 'action', S: 'spell', G: 'ground', Q: 'quality', W: 'weather', C: 'category', B: 'burden' }[m[1]], r: !!m[2], cost: +m[3],
    strike: st && st[1] !== '—' ? +st[1] : null, stand: st ? +st[2] : null, text: c[3] });
}
fs.writeFileSync(process.argv[3], JSON.stringify(out, null, 1));
const n = {}; out.forEach(x => n[x.school] = (n[x.school] || 0) + 1); console.log(out.length, n);
