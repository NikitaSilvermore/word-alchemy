// V29 benchmark (spec §14.4 G): deterministic headless runs, paired seeds, damage/resource logs, coverage.
//   node sim/bench.js decks  <set> <tier> <gamesPerPairing> <seed> <out.json> [shard i/n]
//   node sim/bench.js ladder <set> <gamesPerTierPair> <seed> <out.json> [tiers comma list] [shard i/n]
//   node sim/bench.js report <out.md> <in.json> [in.json ...]
// Every game is reproducible from (decks, seed, first player, policies). Each record carries the final state hash.
'use strict';
const fs = require('fs');
const { playOne, SETS } = require('./run');
const { TIER_ORDER } = require('../src/bots');
const { CARDS } = require('../src/cards');

const STYLES = ['careful', 'aggressive'];
const shardOf = arg => { if (!arg) return [0, 1]; const [i, n] = arg.split('/').map(Number); return [i, n]; };

function deckBench(set, tier, n, seed0, shard, opts = {}) {
  const names = Object.keys(SETS[set]), out = [];
  const [si, sn] = shardOf(shard); let job = 0;
  for (let i = 0; i < names.length; i++) for (let j = i; j < names.length; j++) for (let g = 0; g < n; g++) {
    if (job++ % sn !== si) continue;
    const seed = seed0 + i * 100000 + j * 1000 + (g >> 1); // mirrored pairs: same seed, starting player swapped
    const st = STYLES[(g >> 1) % 2], pols = [st + ':' + tier, st + ':' + tier];
    out.push({ mode: 'decks', variant: opts.label || 'spec', ...playOne(names[i], names[j], seed, 'v29', g % 2, pols, { set, ...opts }) });
  }
  return out;
}

// Tier ladder: every pair of tiers on the same deal four ways (decks swapped, seats swapped) so neither deck nor seat favours a tier.
function ladder(set, n, seed0, tiers, shard, opts = {}) {
  const names = Object.keys(SETS[set]), out = [];
  const [si, sn] = shardOf(shard); let job = 0;
  for (let a = 0; a < tiers.length; a++) for (let b = a + 1; b < tiers.length; b++) for (let g = 0; g < n; g += 4) {
    const seed = seed0 + a * 100000 + b * 1000 + g;
    const mix = v => { let h = Math.imul(v ^ 0x9e3779b9, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; return h >>> 0; };
    const x = names[mix(seed) % names.length], y = names[mix(seed + 77) % names.length]; // well-mixed, reproducible deck draw
    for (let v = 0; v < 4; v++) {
      if (job++ % sn !== si) continue;
      const swapDecks = v >> 1, first = v % 2;
      const d = swapDecks ? [y, x] : [x, y];
      const pols = ['careful:' + tiers[a], 'careful:' + tiers[b]];
      out.push({ mode: 'ladder', tiers: [tiers[a], tiers[b]], ...playOne(d[0], d[1], seed, 'v29', first, pols, { set, ...opts }) });
    }
  }
  return out;
}

// ---------- report ----------
const pct = (k, n) => n ? (100 * k / n).toFixed(1) + '%' : '–';
const ci = (k, n) => { if (!n) return '–'; const p = k / n, h = 1.96 * Math.sqrt(p * (1 - p) / n); return `${(100 * p).toFixed(1)}% ±${(100 * h).toFixed(1)}`; };
const median = a => { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const avg = a => a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0;
function digest(records) { const t = JSON.stringify(records.map(r => [r.d, r.seed, r.first, r.pols, r.win, r.hash])); let h = 2166136261; for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(16); }

function report(records, title) {
  const L = [];
  const dec = records.filter(r => r.win === 0 || r.win === 1);
  L.push(`# ${title}`, '', `Games: ${records.length} · decisive ${dec.length} · draws ${records.length - dec.length} · digest \`${digest(records)}\``, '');
  L.push('## Summary', '', '| Measure | Value |', '|---|---|');
  L.push(`| First player wins | ${ci(dec.filter(r => r.win === r.first).length, dec.length)} |`);
  L.push(`| Median rounds (p10–p90) | ${median(records.map(r => r.rounds))} (${percentile(records.map(r => r.rounds), 0.1)}–${percentile(records.map(r => r.rounds), 0.9)}) |`);
  const td = records.flatMap(r => r.turnDamage || []);
  L.push(`| Damage to a player in one turn: median / p95 / max | ${median(td)} / ${percentile(td, 0.95)} / ${Math.max(0, ...td)} |`);
  L.push(`| Games with a 20+ damage turn | ${pct(records.filter(r => r.maxTurnDamage >= 20).length, records.length)} |`);
  L.push(`| Lethal by round 3 | ${pct(records.filter(r => r.lethalByR3).length, records.length)} |`);
  L.push(`| Responses / answers per game | ${avg(records.map(r => r.responses)).toFixed(2)} / ${avg(records.map(r => r.answers)).toFixed(2)} |`);
  L.push(`| Fusions per game (games with one) | ${avg(records.map(r => r.fusions)).toFixed(2)} (${pct(records.filter(r => r.fusions > 0).length, records.length)}) |`);
  L.push('');
  // resources per player per own turn
  const res = records.flatMap(r => r.res.map(x => ({ ...x, turns: Math.ceil(r.turns / 2) })));
  const per = k => avg(res.map(x => x[k] / Math.max(1, x.turns))).toFixed(2);
  L.push('## Resources (per player, per own turn)', '', '| Breath spent | Breath wasted | Reserve kept | Reserve used | Spark gained | Spark spent | Drawn | Bought |', '|---|---|---|---|---|---|---|---|');
  L.push(`| ${per('breathSpent')} | ${per('breathWasted')} | ${per('reserveKept')} | ${per('reserveUsed')} | ${per('sparkGained')} | ${per('sparkSpent')} | ${per('drawn')} | ${per('bought')} |`, '');
  const lost = {}; for (const x of res) for (const [k, v] of Object.entries(x.lifeLost)) lost[k] = (lost[k] || 0) + v;
  const lostTot = Object.values(lost).reduce((a, b) => a + b, 0);
  L.push('## Life lost by cause', '', '| Cause | Share |', '|---|---|', ...Object.entries(lost).sort((a, b) => b[1] - a[1]).map(([k, v]) => `| ${k} | ${pct(v, lostTot)} |`), '');
  // decks
  const decks = [...new Set(records.flatMap(r => r.d))];
  const w = {}; for (const r of dec) for (const s of [0, 1]) { if (r.d[0] === r.d[1]) continue; const k = r.d[s]; w[k] = w[k] || [0, 0]; w[k][1]++; if (r.win === s) w[k][0]++; }
  if (records[0].mode === 'decks') {
    L.push('## Deck win rates (mirror matches excluded)', '', '| Deck | Win rate | Games |', '|---|---|---|');
    for (const k of decks.sort((a, b) => (w[b] ? w[b][0] / w[b][1] : 0) - (w[a] ? w[a][0] / w[a][1] : 0))) if (w[k]) L.push(`| ${k} | ${ci(w[k][0], w[k][1])} | ${w[k][1]} |`);
    L.push('', '## Matchups (row deck win rate vs column)', '', '| | ' + decks.map(d => d.split('_')[0]).join(' | ') + ' |', '|---|' + decks.map(() => '---').join('|') + '|');
    for (const a of decks) {
      const cells = decks.map(b => { if (a === b) return '·'; const g = dec.filter(r => (r.d[0] === a && r.d[1] === b) || (r.d[0] === b && r.d[1] === a)); const k = g.filter(r => r.d[r.win] === a).length; return g.length ? Math.round(100 * k / g.length) : '–'; });
      L.push(`| ${a.split('_')[0]} | ${cells.join(' | ')} |`);
    }
    L.push('');
  }
  if (records[0].mode === 'ladder') {
    const tiers = [...new Set(records.flatMap(r => r.tiers))].sort((a, b) => TIER_ORDER.indexOf(a) - TIER_ORDER.indexOf(b));
    const tw = {}; for (const r of dec) for (const s of [0, 1]) { const t = r.tiers[s]; tw[t] = tw[t] || [0, 0]; tw[t][1]++; if (r.win === s) tw[t][0]++; }
    L.push('## Tier ladder (same deals, decks and seats swapped)', '', '| Tier | Win rate | Games |', '|---|---|---|', ...tiers.map(t => `| ${t} | ${ci(tw[t][0], tw[t][1])} | ${tw[t][1]} |`), '');
    L.push('| Row beats column | ' + tiers.join(' | ') + ' |', '|---|' + tiers.map(() => '---').join('|') + '|');
    for (const a of tiers) L.push(`| ${a} | ` + tiers.map(b => { if (a === b) return '·'; const g = dec.filter(r => r.tiers.includes(a) && r.tiers.includes(b)); const k = g.filter(r => r.tiers[r.win] === a).length; return g.length ? Math.round(100 * k / g.length) + '%' : '–'; }).join(' | ') + ' |');
    L.push('');
  }
  // coverage
  const played = {}; for (const r of records) for (const x of r.res) for (const [k, v] of Object.entries(x.played)) played[k] = (played[k] || 0) + v;
  const inDecks = new Set(decks.flatMap(d => SETS[records[0].set || 'REF'] && SETS[records[0].set || 'REF'][d] || []));
  const legal = CARDS.filter(c => c.deckLegal);
  const never = legal.filter(c => !played[c.id]).map(c => c.id);
  const schools = {}; for (const c of legal) { schools[c.school] = schools[c.school] || [0, 0]; schools[c.school][1]++; if (played[c.id]) schools[c.school][0]++; }
  L.push('## Coverage', '', `Words played at least once: ${legal.length - never.length} of ${legal.length}.`, '', '| School | Words played |', '|---|---|', ...Object.entries(schools).map(([k, [a, b]]) => `| ${k} | ${a} / ${b} |`), '');
  if (never.length) L.push(`Never played: ${never.join(', ')}.`, '');
  const made = {}; for (const r of records) for (const [k, v] of Object.entries(r.made || {})) made[k] = (made[k] || 0) + v;
  L.push(`Made forms: ${Object.entries(made).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}.`, '');
  const ds = {}; for (const r of records) for (const [k, v] of Object.entries(r.decisions || {})) ds[k] = (ds[k] || 0) + v;
  L.push(`Decisions raised: ${Object.entries(ds).map(([k, v]) => `${k} ${v}`).join(', ') || 'none'}.`, '');
  const ev = {}; for (const r of records) for (const k of Object.keys(r.eventTypes || {})) ev[k] = (ev[k] || 0) + 1;
  L.push(`Event types seen: ${Object.keys(ev).length} (${Object.keys(ev).sort().join(', ')}).`, '');
  void inDecks;
  return L.join('\n');
}
function percentile(a, q) { const s = a.slice().sort((x, y) => x - y); return s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : 0; }

if (require.main === module) {
  const [mode, ...rest] = process.argv.slice(2);
  if (mode === 'decks') {
    const [set, tier, n, seed, out, shard, initiative = 'spec', marketBreath = '0', variantJson = '{}'] = rest;
    const variant = JSON.parse(variantJson);
    const r = deckBench(set, tier, +n, +seed, shard, { initiative, marketBreath: +marketBreath, variant, label: initiative + (+marketBreath ? '+mb' + marketBreath : '') + (variantJson !== '{}' ? variantJson : '') + (process.env.WA_PATCH ? '+' + process.env.WA_PATCH : '') }).map(x => ({ ...x, set })); fs.writeFileSync(out, JSON.stringify(r)); console.log(out, r.length);
  } else if (mode === 'fdecks') { // format-pinned deck benchmark: fdecks <set> <tier> <n> <seed> <out> <shard> <formatId>
    const [set, tier, n, seed, out, shard, formatId = 'grammar_v30_rc1'] = rest;
    const f = require('../src/formats').resolveFormat(formatId);
    const t0 = Date.now();
    const r = deckBench(set, tier, +n, +seed, shard, { initiative: f.initiative, variant: f.variant, marketBreath: f.marketBreath, label: formatId }).map(x => ({ ...x, set, format: formatId, formatVersion: f.version }));
    fs.writeFileSync(out, JSON.stringify(r)); console.log(out, r.length, ((Date.now() - t0) / 1000).toFixed(0) + 's');
  } else if (mode === 'ladder') {
    const [set, n, seed, out, tiers, shard, formatId] = rest;
    const f = formatId ? require('../src/formats').resolveFormat(formatId) : null;
    const r = ladder(set, +n, +seed, (tiers || TIER_ORDER.join(',')).split(','), shard, f ? { initiative: f.initiative, variant: f.variant, marketBreath: f.marketBreath, label: formatId } : {}).map(x => ({ ...x, set })); fs.writeFileSync(out, JSON.stringify(r)); console.log(out, r.length);
  } else if (mode === 'report') {
    const [out, ...ins] = rest;
    const recs = ins.flatMap(f => JSON.parse(fs.readFileSync(f, 'utf8')));
    fs.writeFileSync(out, report(recs, rest[0].split('/').pop().replace('.md', ''))); console.log(out);
  }
}
module.exports = { deckBench, ladder, report, digest };
