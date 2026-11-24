// Random legal play across every deck-legal word: zone audit after every step, coverage of words and events.
// node tools/fuzz.js [games=200]
'use strict';
const E = require('../src/engine');
const { CARDS } = require('../src/cards');
const legal = CARDS.filter(c => c.deckLegal);
const SCH = ['fire', 'water', 'air', 'earth', 'life', 'rot', 'word'];
function rnd(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
function run(games) {
  const played = {}, events = {}, errors = [];
  for (let g = 1; g <= games; g++) {
    const r = rnd(g);
    const deck = () => { const sch = SCH.slice().sort(() => r() - 0.5).slice(0, 3); const pool = legal.filter(c => sch.includes(c.school)).map(c => c.id).sort(() => r() - 0.5); return pool.slice(0, 20); };
    const S = E.createMatch({ decks: [deck(), deck()], seed: g });
    let k = 0;
    try {
      while (S.over == null && k < 600) {
        const acts = E.legalActions(S);
        const nonPass = acts.filter(a => a.type !== 'pass');
        const a = nonPass.length && r() < 0.85 ? nonPass[Math.floor(r() * nonPass.length)] : { type: 'pass' };
        E.apply(S, a, { block: (S2, i) => (r() < 0.5 ? i.candidates[0].id : null), respond: (S2, side, kind) => { const o = E.legalResponses(S2, side, kind); return o.length && r() < 0.5 ? o[Math.floor(r() * o.length)] : null; } });
        k++;
        const z = E.zoneAudit(S); if (z.length) { errors.push({ g, k, z: z.slice(0, 3), a }); break; }
      }
    } catch (e) { errors.push({ g, k, err: e.message.slice(0, 300) }); }
    for (const e of S.events) {
      events[e.type] = (events[e.type] || 0) + 1;
      if (e.type === 'declare' && e.act.card) { const w = (S.players[e.side].grave.concat(S.players[e.side].sealed, S.players[e.side].hand).find(c => c.pid === e.act.card) || {}).word; if (w) played[w] = (played[w] || 0) + 1; }
    }
    for (const t of S.things) played[t.word] = (played[t.word] || 0) + 0;
  }
  return { played, events, errors };
}
if (require.main === module) {
  const res = run(+(process.argv[2] || 200));
  const never = legal.filter(c => !res.played[c.id] && c.type !== 'thing' && c.type !== 'ground').map(c => c.id);
  console.log('errors', res.errors.length, JSON.stringify(res.errors.slice(0, 5), null, 1));
  console.log('non-permanent words never resolved/played:', never.join(' '));
  console.log('events:', JSON.stringify(res.events));
}
module.exports = { run };
