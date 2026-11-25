// The Alchemist's Atlas — read-only projection of the current Word Alchemy engine (Core Duel — Room to Grow).
// Data: atlas_data.json, extracted from the engine registry and observed by running the engine (tools/build_data.js).
// Live checker: the game's own engine, bundled unchanged (window.WAE).
'use strict';
(function () {
const D = JSON.parse(document.getElementById('atlas-data').textContent);
const W = D.words, FAM = D.families;
const $ = s => document.querySelector(s);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const store = { get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } } };
const SCHOOL = { fire: 'Fire', water: 'Water', air: 'Air', earth: 'Earth', life: 'Life', rot: 'Rot', word: 'The Word' };
const TYPE = { thing: 'Thing', action: 'Action', spell: 'Spell', ground: 'Ground', quality: 'Quality', weather: 'Weather (Sky)', burden: 'Burden', category: 'Category', token: 'Token' };
const ORIGIN = { starting: 'In a starting deck', created: 'Created during a duel', enabled: 'Enabled, not in the three decks', 'enabled-form': 'Created from other enabled words', code: 'In code, not enabled in this build' };
const schoolList = s => (Array.isArray(s) ? s : String(s || '').split(/[^a-z]+/i).filter(Boolean)).map(x => SCHOOL[x.toLowerCase()] || x);
const DECKNAME = Object.fromEntries(Object.entries(D.decks).map(([k, d]) => [k, d.name]));
const A = { scope: store.get('atlas.scope', 'core'), showCode: false, crumbs: [], filters: { school: '', type: '', deck: '', origin: '', fam: '' }, q: '', notes: store.get('atlas.notes', []), mapPan: null, check: null };

// ---------- names, scope ----------
function name(id) {
  if (id == null) return '';
  if (id === 'you') return 'you'; if (id === 'rival') return 'the rival'; if (id === 'self') return 'yourself';
  if (String(id).startsWith('ground:')) return 'your Ground (' + name(id.slice(7)) + ')';
  return W[id] ? W[id].name : String(id).split('.').pop();
}
const isWord = id => !!W[id];
const inScope = id => { const w = W[id]; if (!w) return false; if (w.origin === 'code') return A.showCode; return A.scope === 'all' || w.origin === 'starting' || w.origin === 'created'; };
const layerOk = x => A.scope === 'all' || (x.layers || []).includes('core');
const layerTag = x => ((x.layers || []).includes('core') ? '<span class="ev v" title="Seen when the engine ran positions built from the three current decks">engine-verified · three decks</span>' : '<span class="ev vo" title="Seen only in positions built from other enabled words, outside the three decks">engine-verified · other enabled words</span>');
function link(id, label) { if (!isWord(id)) return esc(label || name(id)); const w = W[id]; return `<button class="wlink" data-go="word/${esc(id)}" title="${esc(ORIGIN[w.origin])}">${esc(label || w.name)}</button>`; }
function chip(id, n) { if (!isWord(id)) return `<span class="chip">${esc(name(id))}${n ? ` <span class="n">×${n}</span>` : ''}</span>`; const w = W[id]; return `<button class="chip ${w.school}" data-go="word/${esc(id)}"><span class="dot"></span>${esc(w.name)}${n ? ` <span class="n">×${n}</span>` : ''}</button>`; }
function opLabel(op) {
  if (!op) return '';
  if (op === 'upkeep') return 'Upkeep (start of its controller\'s turn)';
  const [k, a, b] = op.split(':');
  if (k === 'card') return (W[a] ? W[a].name : a) + ' (' + (TYPE[W[a] && W[a].type] || 'word') + ')';
  if (k === 'ability') return (W[a] ? W[a].name : a) + '’s ' + abilityName(b) + ' ability';
  if (k === 'recipe') return 'Vessel fusion: ' + recipeName(a);
  if (k === 'deploy') return 'Bringing forth ' + name(a);
  if (k === 'ground') return 'Laying ' + name(a) + ' as Ground';
  return op;
}
const abilityName = a => ({ pollinate: 'Pollinate', clayShield: 'Shield', tinder: 'Tinder', hammer: 'Hammer', seal: 'Seal', temper: 'Temper', eatFruit: 'Eat' }[a] || (a ? a[0].toUpperCase() + a.slice(1) : ''));
function recipeName(id) { const r = D.recipeTable.find(x => x.id === id); if (!r) return id; if (r.outInThisBuild) return name(r.outInThisBuild); return id[0].toUpperCase() + id.slice(1) + ' (quality)'; }
function opTiming(op) { const o = D.ops[op]; if (!o) return op === 'upkeep' ? 'Upkeep' : 'Main'; if (o.kind === 'card') { const w = W[o.source]; return w && w.response ? 'Main, or as a Response' : 'Main'; } return o.timing; }
const costTxt = c => (c && c.length ? c.sort((a, b) => a - b).join(' or ') + ' breath' : 'no breath observed');
function linkText(text) { // link word names inside card text to their records (exact name match, in-scope words first)
  const names = Object.values(W).filter(w => w.name && w.name.length > 2 && w.origin !== 'code').sort((a, b) => b.name.length - a.name.length);
  let out = esc(text);
  const seen = new Set();
  for (const w of names) { if (seen.has(w.name)) continue; seen.add(w.name); const re = new RegExp('\\b(' + w.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')\\b(?![^<]*>)'); if (re.test(out)) out = out.replace(re, `<button class="wlink" data-go="word/${w.id}">$1</button>`); }
  return out;
}

// ---------- indexes ----------
const IX = { tFrom: {}, tTo: {}, rIn: {}, rOut: {}, cFrom: {}, cTo: {}, eFrom: {}, eTo: {}, combat: {}, checks: {}, opsBy: {} };
const push = (m, k, v) => (m[k] = m[k] || []).push(v);
const mergeR = list => { const m = new Map(); for (const r of list) { const k = r.inputs.slice().sort().join('+') + '>' + r.output + '|' + r.op; if (m.has(k)) { const x = m.get(k); m.set(k, { ...x, n: x.n + r.n, costs: [...new Set(x.costs.concat(r.costs))], layers: [...new Set(x.layers.concat(r.layers))] }); } else m.set(k, r); } return [...m.values()]; };
for (const t of D.transforms) { push(IX.tFrom, t.from, t); push(IX.tTo, t.to, t); }
for (const r of D.recipes) { for (const i of r.inputs) push(IX.rIn, i.replace(/^ground:/, ''), r); push(IX.rOut, r.output, r); }
for (const c of D.creates) { push(IX.cFrom, c.from, c); push(IX.cTo, c.to, c); }
IX.tBy = {}; IX.rBy = {}; for (const t of D.transforms) if (t.op.startsWith('card:') || t.op.startsWith('ability:')) push(IX.tBy, t.op.split(':')[1], t); for (const r of D.recipes) if (r.op.startsWith('card:')) push(IX.rBy, r.op.slice(5), r);
for (const e of D.edges) { push(IX.eFrom, e.from, e); push(IX.eTo, e.to, e); }
for (const c of D.combat) if (c.form) push(IX.combat, c.form, c);
for (const c of D.checks) for (const w of c.words) push(IX.checks, w, c);
for (const [id, o] of Object.entries(D.ops)) if (o.source) push(IX.opsBy, o.source, id);

// ---------- routing ----------
function go(route, replace) { if (replace) history.replaceState(null, '', '#/' + route); else location.hash = '#/' + route; }
function current() { const h = decodeURIComponent(location.hash.replace(/^#\/?/, '')) || 'words'; const [view, ...rest] = h.split('/'); return { view, arg: rest.join('/') }; }
window.addEventListener('hashchange', render);
document.addEventListener('click', ev => {
  const g = ev.target.closest('[data-go]'); if (g) { ev.preventDefault(); go(g.dataset.go); return; }
});

// ---------- header ----------
function header(view) {
  const tabs = [['words', 'Words'], ['map', 'Transformations'], ['decks', 'Decks'], ['effects', 'Effects'], ['workshop', 'Workshop']];
  const crumbs = A.crumbs.slice(-5).map(id => `<button data-go="word/${esc(id)}">${esc(name(id))}</button>`).join('<span aria-hidden="true">›</span>');
  return `<header class="top">
    <div class="brand">The Alchemist’s Atlas<small>${esc(D.build.label)} · engine ${esc(D.build.commit)}${D.build.gameSourceChanged.length ? ' (with local changes)' : ''}</small></div>
    <div class="search" role="search"><svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5" fill="none" stroke="#cfc1aa" stroke-width="1.6"/><path d="M11 11l4 4" stroke="#cfc1aa" stroke-width="1.6"/></svg>
      <input id="q" type="search" placeholder="Search words — Copper, Bee, Graft, Naphtha…" aria-label="Search words" autocomplete="off" value="${esc(A.q)}"><kbd>/</kbd><div id="res" class="results" hidden></div></div>
    <div class="scope" role="group" aria-label="Scope"><button data-scope="core" class="${A.scope === 'core' ? 'on' : ''}" aria-pressed="${A.scope === 'core'}" title="The three current decks and everything they can make">Three decks</button><button data-scope="all" class="${A.scope === 'all' ? 'on' : ''}" aria-pressed="${A.scope === 'all'}" title="Every word enabled in this build">All enabled</button></div>
    <nav class="tabs" aria-label="Views">${tabs.map(([k, l]) => `<a href="#/${k}" class="${view === k || (view === 'word' && k === 'words') || (view === 'deck' && k === 'decks') || (view === 'effect' && k === 'effects') ? 'on' : ''}">${l}</a>`).join('')}
      <span class="crumbs">${A.crumbs.length > 1 ? '<button id="back" title="Back (Alt+←)">← Back</button>' : ''}${crumbs}</span></nav>
  </header>`;
}
function bindHeader() {
  const q = $('#q'), res = $('#res');
  let act = -1;
  const show = () => {
    A.q = q.value; const s = q.value.trim().toLowerCase();
    if (!s) { res.hidden = true; return; }
    const hits = Object.values(W).filter(w => (inScope(w.id) || A.scope === 'all' && w.origin !== 'code') && (w.name.toLowerCase().includes(s) || w.id.toLowerCase().includes(s)))
      .sort((a, b) => (b.name.toLowerCase() === s) - (a.name.toLowerCase() === s) || (b.name.toLowerCase().startsWith(s)) - (a.name.toLowerCase().startsWith(s)) || a.name.localeCompare(b.name)).slice(0, 12);
    const outside = A.scope === 'core' ? Object.values(W).filter(w => !inScope(w.id) && w.origin !== 'code' && w.name.toLowerCase().includes(s)).length : 0;
    res.innerHTML = hits.map((w, k) => `<button data-go="word/${w.id}" class="${w.school}${k === act ? ' act' : ''}"><span class="dot"></span><b>${esc(w.name)}</b> <span class="note">${esc(TYPE[w.type] || w.type)} · ${esc(ORIGIN[w.origin])}</span></button>`).join('')
      + (hits.length ? '' : '<p class="note" style="padding:8px 12px;margin:0">No word in this scope.</p>') + (outside ? `<p class="note" style="padding:6px 12px;margin:0">${outside} more in “All enabled”.</p>` : '');
    res.hidden = false;
  };
  q.addEventListener('input', () => { act = -1; show(); });
  q.addEventListener('keydown', e => {
    const bs = [...res.querySelectorAll('button')];
    if (e.key === 'ArrowDown') { act = Math.min(bs.length - 1, act + 1); show(); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { act = Math.max(0, act - 1); show(); e.preventDefault(); }
    else if (e.key === 'Enter') { const b = bs[Math.max(0, act)]; if (b) { A.q = ''; go(b.dataset.go); } }
    else if (e.key === 'Escape') { res.hidden = true; q.blur(); }
  });
  q.addEventListener('focus', () => q.value && show());
  for (const b of document.querySelectorAll('[data-scope]')) b.onclick = () => { A.scope = b.dataset.scope; store.set('atlas.scope', A.scope); render(); };
  const bk = $('#back'); if (bk) bk.onclick = () => history.back();
}
document.addEventListener('click', e => { const res = $('#res'); if (res && !e.target.closest('.search')) res.hidden = true; });
document.addEventListener('keydown', e => {
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); const q = $('#q'); if (q) q.focus(); }
  if (e.altKey && e.key === 'ArrowLeft') history.back();
});

// ---------- word list ----------
function famsOf(id) { return [...new Set((IX.eFrom[id] || []).filter(layerOk).map(e => e.fam).concat((IX.tFrom[id] || []).length || (IX.tTo[id] || []).length ? ['transformation'] : []).concat((IX.cFrom[id] || []).filter(layerOk).length || (IX.rOut[id] || []).length ? ['creation'] : []))]; }
function listWords() {
  const f = A.filters;
  return Object.values(W).filter(w => inScope(w.id) && (!f.school || w.school === f.school) && (!f.type || w.type === f.type) && (!f.deck || w.decks.includes(f.deck) || (D.decks[f.deck] && D.decks[f.deck].forms.includes(w.id))) && (!f.origin || w.origin === f.origin) && (!f.fam || famsOf(w.id).includes(f.fam)))
    .sort((a, b) => a.school.localeCompare(b.school) || a.name.localeCompare(b.name));
}
function listHTML(sel) {
  const f = A.filters, ws = listWords();
  const opt = (k, pairs, label) => `<select data-f="${k}" aria-label="${label}"><option value="">${label}</option>${pairs.map(([v, l]) => `<option value="${esc(v)}"${f[k] === v ? ' selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  const types = [...new Set(Object.values(W).filter(w => inScope(w.id)).map(w => w.type))];
  return `<aside class="list" aria-label="Words">
    <div class="filters">${opt('school', Object.entries(SCHOOL), 'School')}${opt('type', types.map(t => [t, TYPE[t] || t]), 'Type')}${opt('deck', Object.entries(DECKNAME), 'Deck')}${opt('origin', Object.entries(ORIGIN).filter(([k]) => k !== 'code' || A.showCode).filter(([k]) => A.scope === 'all' || ['starting', 'created', 'code'].includes(k)), 'Origin')}${opt('fam', Object.entries(FAM), 'Effect')}</div>
    <label class="note"><input type="checkbox" id="showcode"${A.showCode ? ' checked' : ''}> include words in code but not enabled</label>
    <p class="count">${ws.length} ${A.scope === 'core' ? 'words in the three decks and their creations' : 'enabled words'}${Object.values(f).some(Boolean) ? ' (filtered)' : ''}</p>
    <ul class="wl">${ws.map(w => `<li><button data-go="word/${w.id}" class="${w.school}${w.id === sel ? ' on' : ''}"><span class="dot"></span>${esc(w.name)}<span class="t">${esc(TYPE[w.type] || w.type)}${w.origin === 'created' ? ' · made' : ''}</span></button></li>`).join('') || '<li class="empty">Nothing matches.</li>'}</ul>
  </aside>`;
}
function bindList() {
  for (const s of document.querySelectorAll('[data-f]')) s.onchange = () => { A.filters[s.dataset.f] = s.value; render(); };
  const sc = $('#showcode'); if (sc) sc.onchange = () => { A.showCode = sc.checked; render(); };
}

// ---------- word view ----------
function cardVisual(w) {
  const frame = ['fire', 'water', 'air', 'earth', 'life', 'rot', 'word'].includes(w.school) ? `<img class="frame" src="assets/frames/tall_${w.school}.webp" alt="">` : '';
  const art = w.art ? `<img src="assets/art/${esc(w.art)}.webp" alt="" loading="lazy">` : `<span aria-hidden="true">${esc(w.name[0])}</span>`;
  const stats = w.type === 'thing' ? `<span>⚔ ${w.strike}</span><span>⛨ ${w.stand}</span>` : w.type === 'ground' ? `<span></span><span>⛨ ${w.stand}</span>` : '';
  return `<div class="cardv ${w.school}" role="img" aria-label="${esc(w.name)} card${w.art ? '' : ' (no painting yet)'}">${frame}<div class="art">${art}</div><span class="nm">${esc(w.name)}</span>${w.cost != null ? `<span class="gem">${w.cost}</span>` : ''}<span class="ty">${esc(TYPE[w.type] || w.type)}${w.response ? ' · Response' : ''}</span><span class="stats">${stats}</span></div>`;
}
function relSentence(e) {
  const F = { healing: 'heals marked damage on', lifegain: 'gives you life', cleansing: 'removes poison from', wetting: 'makes Wet', drying: 'dries', ignition: 'Ignites', extinguish: 'puts out fire on', protection: 'protects', readiness: 'readies', control: 'exhausts or binds', movement: 'returns to its owner’s hand', draw: 'draws for you', growth: 'gives Growth to', strengthening: 'gives Might to', damage: 'damages', destroy: 'destroys', consumption: 'sacrifices', rival: 'damages the rival', poison: 'poisons' }[e.fam] || e.fam;
  return F;
}
function groupFam(list, keyFn) { const g = {}; for (const e of list) (g[keyFn(e)] = g[keyFn(e)] || []).push(e); return g; }
function relDetails(rows, dir) { // rows: edges of one family, grouped by the other word
  const by = groupFam(rows, e => (dir === 'out' ? e.to : e.from));
  return Object.entries(by).sort((a, b) => b[1].reduce((n, e) => n + e.n, 0) - a[1].reduce((n, e) => n + e.n, 0)).map(([other, es]) => {
    const n = es.reduce((k, e) => k + e.n, 0), costs = [...new Set(es.flatMap(e => e.costs))], ops = [...new Set(es.map(e => e.op))], modes = [...new Set(es.map(e => e.mode).filter(Boolean))];
    const cons = [...new Set(es.flatMap(e => e.consumes))], exh = [...new Set(es.flatMap(e => e.exhausts))];
    const co = es[0].co && n >= 4 ? es[0].co.filter(f => f !== other && f !== es[0].from).slice(0, 4) : [];
    return `<details class="rel"><summary>${chip(other, n)} <span class="note">${esc(ops.map(opLabel).join(' / '))}</span> ${layerTag(es[0])}</summary><div class="body"><dl>
      <dt>Operation</dt><dd>${ops.map(o => esc(opLabel(o))).join('<br>')} · ${esc(opTiming(ops[0]))}</dd>
      <dt>Breath spent</dt><dd>${esc(costTxt(costs))}</dd>
      ${modes.length ? `<dt>Mode chosen</dt><dd>${esc(modes.map(modeTxt).join('; '))}</dd>` : ''}
      ${cons.length ? `<dt>Also sacrificed</dt><dd>${cons.map(c => link(c)).join(', ')}</dd>` : ''}
      ${exh.length ? `<dt>Exhausted</dt><dd>${exh.map(c => link(c)).join(', ')}</dd>` : ''}
      ${co.length ? `<dt>Always also on the field</dt><dd>${co.map(c => link(c)).join(', ')} <span class="note">in every observed case (${n}); may be a requirement — read the card text</span></dd>` : ''}
      <dt>Evidence</dt><dd>${n} engine run${n === 1 ? '' : 's'} · ${exampleTxt(es[0].ex)}</dd>
      <dt>Exact source</dt><dd class="note">${esc(srcOfOp(ops[0]))}</dd></dl></div></details>`;
  }).join('');
}
const modeTxt = m => m.replace(/branch:([\w.]+)/, (x, b) => 'becomes ' + name(b)).replace(/mode:(\w+)/, (x, k) => ({ wet: 'make Wet', heal: 'heal', cleanse: 'remove poison', ignite: 'Ignite your own', fan: 'fan (+1 strike, combat ignition)', fruit: 'make a Fruit', life: 'heal 2 life', mend: 'heal a Living Thing' }[k] || k)).replace(/ash:true/, 'make Ash').replace(/ash:false/, 'no Ash').replace('stamped', 'stamped with the Signet').replace(/recipe:(\w+)/, (x, r) => 'recipe ' + r);
function srcOfOp(op) {
  if (!op) return '';
  const [k, a] = op.split(':'); const w = W[a];
  if (op === 'upkeep') return 'engine29/src/engine.js startTurn → upkeep (ladder ageing, Espalier upkeep)';
  if (k === 'recipe') { const r = D.recipeTable.find(x => x.id === a); return r ? r.table + ' · id ' + r.id : op; }
  return w ? [w.src.card, ...(w.src.engine || [])].join(' · ') : op;
}
function exampleTxt(i) {
  const x = D.examples[i]; if (!x) return 'no example stored';
  const fld = x.field ? x.field.filter(f => f.side === 'mine').map(f => name(f.form)).join(', ') : '?';
  const riv = x.field ? x.field.filter(f => f.side === 'theirs').map(f => name(f.form)).join(', ') : '?';
  return `<details style="display:inline"><summary class="note" style="display:inline;cursor:pointer">one example position</summary><div class="note">Your deck: ${esc(DECKNAME[x.d] || x.d)} · your field: ${esc(fld || 'empty')} · rival field: ${esc(riv || 'empty')}${x.resp ? ' · this was a Response on the rival’s turn' : ''}. Engine effects: ${esc(fxTxt(x.fx))}</div></details>`;
}
function fxTxt(fx) { return (fx || []).filter(f => f.k !== 'event' || ['bounce', 'rebirth', 'spill', 'flare', 'ignite', 'shield', 'ward'].includes(f.type)).map(f => f.k === 'transform' ? name(f.from) + '→' + name(f.to) : f.k === 'breath' ? 'paid ' + f.n + ' breath' : f.k === 'event' ? f.type + (f.form ? ' ' + name(f.form) : '') : (f.k + (f.form ? ' ' + name(f.form) : '') + (f.n ? ' ' + f.n : '') + (f.status ? ' ' + f.status : '') + (f.counter ? ' ' + f.counter : '') + (f.side ? ' (' + (f.side === 'mine' ? 'yours' : 'rival’s') + ')' : '') + (f.who ? ' ' + f.who : ''))).join('; '); }

function transformRow(t, dir) {
  const other = dir === 'out' ? t.to : t.from, how = t.op === 'upkeep' ? 'at upkeep, as it ages' : opLabel(t.op);
  const kind = t.op === 'upkeep' || t.op === 'card:life.grow' || t.op === 'card:life.abundance' ? 'growth' : 'in place';
  return `<details class="rel"><summary>${dir === 'out' ? '→ ' : '← '}${chip(other, t.n)} <span class="note">${esc(how)} · ${kind === 'growth' ? 'growth' : 'in-place change'}</span> ${layerTag(t)}</summary><div class="body"><dl>
    <dt>What happens</dt><dd>${link(t.from)} becomes ${link(t.to)}${t.regress ? ' (regression)' : ''}. Same card on the field: it keeps its place${kind === 'in place' ? ' and marked damage' : ''}; no new card is created.</dd>
    <dt>Operation</dt><dd>${esc(how)} · ${esc(t.op === 'upkeep' ? 'Upkeep' : opTiming(t.op))}</dd>
    <dt>Breath spent</dt><dd>${esc(t.op === 'upkeep' ? 'none' : costTxt(t.costs))}</dd>
    ${t.mode ? `<dt>Choice</dt><dd>${esc(modeTxt(t.mode))}</dd>` : ''}
    <dt>Conditions</dt><dd>${conditionText(t)}</dd>
    <dt>Evidence</dt><dd>${t.n} engine run${t.n === 1 ? '' : 's'} · ${exampleTxt(t.ex)}</dd>
    <dt>Exact source</dt><dd class="note">${esc(srcOfOp(t.op))}</dd></dl></div></details>`;
}
function conditionText(t) {
  const w = t.op.startsWith('card:') ? W[t.op.slice(5)] : null;
  const parts = [];
  if (w) parts.push('Card text: “' + esc(w.text) + '”');
  if (t.op === 'upkeep') parts.push(t.from === 'life.seed' ? 'A Seed gains 1 age at its controller’s upkeep and becomes a Sapling at age 2.' : t.from === 'life.sapling' ? 'A Sapling gains 1 age at upkeep; at age 2 it becomes a Willow if its controller’s Ground is Water, otherwise an Oak.' : 'Ladder ageing at upkeep.');
  if (t.op === 'card:earth.transmute' || t.op === 'card:earth.shape3') parts.push('One metal change per turn (shared by Transmute and Shape).');
  return parts.join('<br>') || 'See card text.';
}
function recipeRow(r, focus) {
  const def = D.recipeTable.find(x => x.id === r.recipe);
  const out = r.output, quality = def && !def.out;
  const others = r.inputs.filter(i => i.replace(/^ground:/, '') !== focus);
  return `<details class="rel"><summary>${r.inputs.map(i => chip(i.replace(/^ground:/, ''), 0)).join('<span class="and">AND</span>')} → ${quality ? chip(out) + ' <span class="note">gains ' + esc(recipeName(r.recipe)) + '</span>' : chip(out, r.n)} ${layerTag(r)}</summary><div class="body"><dl>
    <dt>Recipe</dt><dd>${esc(recipeName(r.recipe))} — ${r.op.startsWith('card:') ? 'by speaking ' + link(r.op.slice(5)) + ' (uses your Vessel this turn)' : 'in the Vessel (once per turn)'}${focus && others.length ? '. Needs ' + others.map(o => o.startsWith('ground:') ? 'your Ground: ' + link(o.slice(7)) : link(o)).join(' and ') + ' as well.' : ''}</dd>
    <dt>Both required</dt><dd>Every listed input must be yours and on the field (or your Ground) at once. ${quality ? 'The host stays and gains the quality; the other input is consumed.' : 'The inputs are consumed (no death, no sacrifice) and the made form takes a place.'}</dd>
    <dt>Breath</dt><dd>${esc(costTxt(r.costs))}</dd>
    ${def ? `<dt>Engine predicate</dt><dd class="note">${esc(predTxt(def.a))} + ${esc(predTxt(def.b))}${def.forbid.kw ? ' · not if ' + def.forbid.kw.join('/') : ''}${def.forbid.props ? ' · not if already ' + def.forbid.props.join('/') : ''}${def.mod ? ' · gives ' + esc(modTxt(def.mod)) : ''}</dd>` : ''}
    <dt>Evidence</dt><dd>${r.n} engine run${r.n === 1 ? '' : 's'} · ${exampleTxt(r.ex)}</dd>
    <dt>Exact source</dt><dd class="note">${esc(def ? def.table + ' · id ' + def.id : r.op)}${r.op.startsWith('card:') ? ' · ' + esc(srcOfOp(r.op)) : ''}</dd></dl></div></details>`;
}
const predTxt = p => !p ? '?' : p.form ? (p.ground ? 'Ground ' : '') + name(p.form) : (p.ground ? 'a Ground' : p.token ? 'a token' : 'a Thing') + (p.props ? ' that is ' + p.props.join(' ') : '') + (p.host ? ' (the host)' : '');
const modTxt = m => [m.strike ? '+' + m.strike + ' strike' : '', m.stand ? '+' + m.stand + ' stand' : '', (m.props || []).join(' '), (m.kw || []).join(' '), m.kwRemove ? 'loses ' + m.kwRemove.join(' ') : '', m.igniteOnHit ? 'ignites what it hits' : ''].filter(Boolean).join(', ');
function createRow(c, dir) {
  const other = dir === 'out' ? c.to : c.from;
  const co = c.co && c.n >= 4 ? c.co.filter(f => f !== c.from && f !== c.to) : [];
  return `<details class="rel"><summary>${dir === 'out' ? '→ ' : '← '}${chip(other, c.n)} <span class="note">${esc(opLabel(c.op))}${c.mode ? ' · ' + esc(modeTxt(c.mode)) : ''} · product</span> ${layerTag(c)}</summary><div class="body"><dl>
    <dt>What happens</dt><dd>${link(c.from)} ${c.op === 'upkeep' ? 'makes' : 'creates'} a ${link(c.to)} token on your field (it needs a free place).</dd>
    <dt>Operation</dt><dd>${esc(opLabel(c.op))} · ${esc(c.op === 'upkeep' ? 'Upkeep' : opTiming(c.op))}</dd><dt>Breath</dt><dd>${esc(c.op === 'upkeep' ? 'none' : costTxt(c.costs))}</dd>
    ${co.length ? `<dt>Always also on the field</dt><dd>${co.map(x => link(x)).join(', ')} <span class="note">in every observed case — likely the real trigger; check its card text</span></dd>` : ''}
    <dt>Evidence</dt><dd>${c.n} engine run${c.n === 1 ? '' : 's'} · ${exampleTxt(c.ex)}</dd><dt>Exact source</dt><dd class="note">${esc(srcOfOp(c.op))}</dd></dl></div></details>`;
}
function wordView(id) {
  const w = W[id]; if (!w) return `<section class="pane"><h1>Not found</h1><p>No word with id ${esc(id)} in this build.</p></section>`;
  if (A.crumbs[A.crumbs.length - 1] !== id) { A.crumbs = A.crumbs.filter(x => x !== id); A.crumbs.push(id); }
  const tf = (IX.tFrom[id] || []).filter(layerOk), tt = (IX.tTo[id] || []).filter(layerOk), ri = (IX.rIn[id] || []).filter(layerOk), ro = (IX.rOut[id] || []).filter(layerOk);
  const cf = (IX.cFrom[id] || []).filter(layerOk), ct = (IX.cTo[id] || []).filter(layerOk);
  const ef = (IX.eFrom[id] || []).filter(layerOk), et = (IX.eTo[id] || []).filter(layerOk);
  const sup = ef.filter(e => e.verb === 'supports'), ans = ef.filter(e => e.verb === 'answers'), cons = ef.filter(e => e.verb === 'consumes');
  const benefit = et.filter(e => e.verb === 'supports' && e.from !== id), vuln = et.filter(e => e.verb === 'answers'), consumedBy = et.filter(e => e.verb === 'consumes');
  const fams = list => Object.entries(groupFam(list, e => e.fam)).sort((a, b) => b[1].length - a[1].length);
  const famBlock = (list, dir, title, sub) => list.length ? `<div class="group"><h3>${title} <small>${sub}</small></h3>${fams(list).map(([f, es]) => `<details class="rel"><summary><b>${esc(FAM[f] || f)}</b> <span class="note">${dir === 'out' ? esc(w.name) + ' ' + esc(relSentence(es[0])) : 'by ' + new Set(es.map(e => e.from)).size + ' word(s)'}</span> ${[...new Set(es.map(e => dir === 'out' ? e.to : e.from))].slice(0, 8).map(o => chip(o)).join('')}${new Set(es.map(e => dir === 'out' ? e.to : e.from)).size > 8 ? ' <span class="note">+' + (new Set(es.map(e => dir === 'out' ? e.to : e.from)).size - 8) + ' more</span>' : ''}</summary><div class="body">${relDetails(es, dir)}</div></details>`).join('')}</div>` : '';
  const hu = D.handUse[id];
  const dk = w.decks.map(k => `<button class="tag o-starting" data-go="deck/${k}">In ${esc(DECKNAME[k])}</button>`).join('');
  const madeIn = Object.entries(D.decks).filter(([k, d]) => d.forms.includes(id)).map(([k, d]) => `<button class="tag o-created" data-go="deck/${k}">Can be made in ${esc(d.name)}</button>`).join('');
  const notes = A.notes.filter(n => n.target === id || (n.target || '').includes(id));
  const checks = (IX.checks[id] || []);
  const opsOf = (IX.opsBy[id] || []).filter(o => D.eligibility[o]);
  const combat = IX.combat[id] || [];
  const tb = (IX.tBy[id] || []).filter(layerOk), rb = (IX.rBy[id] || []).filter(layerOk);
  const noRel = !tb.length && !rb.length && !tf.length && !tt.length && !ri.length && !ro.length && !cf.length && !ct.length && !ef.length && !et.length;
  return `<section class="pane">
    <div class="wordhead">${cardVisual(w)}<div>
      <h1>${esc(w.name)}</h1>
      <p class="sub"><span class="dot ${w.school}" style="display:inline-block"></span> ${esc(SCHOOL[w.school] || w.school)} · ${esc(TYPE[w.type] || w.type)}${w.cost != null ? ' · costs ' + w.cost + ' breath' : ''}${w.type === 'thing' ? ' · strike ' + w.strike + ' / stand ' + w.stand : ''}</p>
      <div class="facts"><span class="tag o-${w.origin === 'enabled-form' ? 'enabled' : w.origin}">${esc(ORIGIN[w.origin])}</span>${dk}${madeIn}</div>
      <div class="facts">${w.props.map(p => `<span class="tag">${esc(p)}</span>`).join('')}${w.kw.map(p => `<span class="tag"><b>${esc(p)}</b></span>`).join('')}${w.cap.map(p => `<span class="tag">can ${esc(p)}</span>`).join('')}${w.ladder ? `<span class="tag">${esc(w.ladder)} ladder</span>` : ''}</div>
      <div class="parch">${linkText(w.text || 'No card text in the game for this word.')}<span class="src">Card text as the game shows it · ${esc(w.src.text)} · definition ${esc(w.src.card)}${w.src.engine.length ? ' · engine ' + esc(w.src.engine.join(', ')) : ''}</span></div>
      <div class="row" style="margin-top:10px"><button class="btn" data-go="map/${esc(id)}">Open in the transformation map</button><button class="btn" id="copyw">Copy rules and relationships</button><button class="btn" id="notew">Add a proposal or note</button></div>
      ${hu ? `<p class="note">In hand during ${hu.held} probe positions, the engine offered a legal use in ${hu.usable} (${Math.round(100 * hu.usable / hu.held)}%). Positions are random, so this is a hint about how often it is playable, not a game statistic.</p>` : ''}
    </div></div>
    ${noRel ? `<div class="box" style="margin-top:18px"><b>No relationship observed.</b> <span class="note">${w.origin === 'code' ? 'This word is not enabled in this build, so the engine never offered it.' : 'The engine never applied an action involving this word in the probe positions. It may still matter in combat, as a blocker or attacker, or need a position the probe did not build.'}</span></div>` : ''}
    ${tb.length || rb.length ? `<h2>What it does to other words</h2>${tb.length ? `<div class="group"><h3>Changes forms <small>${esc(w.name)} turns one Thing into another, in place</small></h3>${[...new Map(tb.map(t => [t.from + '>' + t.to, t])).values()].map(t => transformRow(t, 'out').replace('→ ', '<span class="note">' + esc(name(t.from)) + '</span> → ')).join('')}</div>` : ''}${rb.length ? `<div class="group"><h3>Joins Things <small>recipes performed by speaking ${esc(w.name)}</small></h3>${mergeR(rb).map(r => recipeRow(r, null)).join('')}</div>` : ''}` : ''}
    <h2>What it can become and make</h2>
    ${tf.length || cf.length || ri.length ? '' : '<p class="empty">' + (w.type === 'thing' || w.origin === 'created' ? 'No form change, product or recipe starts from this word.' : 'It is not itself transformed or combined.') + '</p>'}
    ${tf.length ? `<div class="group"><h3>Becomes <small>in-place form changes</small></h3>${tf.map(t => transformRow(t, 'out')).join('')}</div>` : ''}
    ${ri.length ? `<div class="group"><h3>Combines with <small>multi-input recipes — every input required</small></h3>${mergeR(ri).map(r => recipeRow(r, id)).join('')}</div>` : ''}
    ${cf.length ? `<div class="group"><h3>Creates <small>products and tokens</small></h3>${cf.map(c => createRow(c, 'out')).join('')}</div>` : ''}
    ${tt.length || ro.length || ct.length ? `<h2>How to get it</h2>${tt.length ? `<div class="group"><h3>Comes from <small>form changes</small></h3>${tt.map(t => transformRow(t, 'in')).join('')}</div>` : ''}${ro.length ? `<div class="group"><h3>Made by recipe <small>AND: all inputs together</small></h3>${mergeR(ro).map(r => recipeRow(r, null)).join('')}</div>` : ''}${ct.length ? `<div class="group"><h3>Created by</h3>${ct.map(c => createRow(c, 'in')).join('')}</div>` : ''}` : ''}
    ${sup.length || ans.length || cons.length ? `<h2>What it does</h2>` : ''}
    ${famBlock(sup, 'out', 'Helps your side', 'effects on your own Things and you')}
    ${famBlock(ans, 'out', 'Acts on the rival', 'effects on rival Things and the rival')}
    ${cons.length ? `<div class="group"><h3>Uses up <small>sacrificed as part of the cost</small></h3>${relDetails(cons, 'out')}</div>` : ''}
    ${benefit.length || vuln.length || consumedBy.length ? `<h2>What acts on it</h2>` : ''}
    ${famBlock(benefit, 'in', 'Benefits from', 'friendly words that help it')}
    ${famBlock(vuln, 'in', 'Vulnerable to', 'rival words observed affecting it')}
    ${consumedBy.length ? `<div class="group"><h3>Can be used up by <small>it is the sacrifice</small></h3>${relDetails(consumedBy, 'in')}</div>` : ''}
    ${combat.length ? `<h2>In combat</h2>${combat.map(c => `<p>${esc({ rebirth: 'Survives destruction once (rebirth).', spill: 'Its attack spills excess damage through a destroyed blocker to the rival.', flare: 'Flares when Ignited.', ignite: 'Was Ignited in combat by a fanned or igniting attacker.', 'bound-miss': 'Bound attacker dealt no damage.', shielded: 'A shield absorbed damage.' }[c.type] || c.type)} <span class="note">${c.n} combat run(s) · ${exampleTxt(c.ex)}</span></p>`).join('')}` : ''}
    ${opsOf.length ? `<h2>Who it can be aimed at</h2><p class="note">For each of its operations: Things the engine offered as a target, and Things that were present at least 5 times but never offered (so not eligible in those positions).</p>${opsOf.map(o => eligHTML(o)).join('')}` : ''}
    ${checks.length ? `<h2>Not possible</h2>${checks.map(c => checkHTML(c)).join('')}` : ''}
    ${notes.length ? `<h2>Proposals and notes</h2>${notes.map(noteHTML).join('')}` : ''}
  </section>`;
}
function eligHTML(op) {
  const e = D.eligibility[op]; if (!e) return '';
  const fmt = obj => Object.entries(obj).map(([k, n]) => { const [side, form] = [k.slice(0, k.indexOf(':')), k.slice(k.indexOf(':') + 1)]; return { side, form, n }; });
  const off = fmt(e.offered), nev = fmt(e.never);
  const part = (arr, side) => arr.filter(x => x.side === side).sort((a, b) => b.n - a.n).map(x => chip(x.form, x.n)).join('') || '<span class="empty">none</span>';
  return `<details class="rel"><summary><b>${esc(opLabel(op))}</b> <span class="note">${off.length} target kinds offered${nev.length ? ' · ' + nev.length + ' never offered' : ''}</span></summary><div class="body"><dl>
    <dt>Offered: yours</dt><dd>${part(off, 'mine')}</dd><dt>Offered: rival’s</dt><dd>${part(off, 'theirs')}</dd>
    ${nev.length ? `<dt>Never offered: yours</dt><dd>${part(nev, 'mine')}</dd><dt>Never offered: rival’s</dt><dd>${part(nev, 'theirs')}</dd>` : ''}</dl>
    <p class="note">Counts are probe positions, not importance. “Never offered” is evidence, not proof: a rarer state might allow it.</p></div></details>`;
}
function checkHTML(c) { return `<div class="box" style="margin:8px 0"><span class="ev x">${c.verdict === 'refused' ? 'NOT LEGAL' : 'LEGAL'}</span> <b>${esc(c.claim)}</b><p class="note" style="margin:6px 0 0">Engine says: ${esc(c.reason || '—')} · checked in a constructed position · ${c.words.map(w => link(w)).join(', ')}</p></div>`; }

// ---------- copy summary ----------
function summaryText(id) {
  const w = W[id], L = [];
  L.push(`${w.name} — ${SCHOOL[w.school]} ${TYPE[w.type] || w.type}${w.cost != null ? ', ' + w.cost + ' breath' : ''}${w.type === 'thing' ? `, ${w.strike}/${w.stand}` : ''} [${w.id}] (${ORIGIN[w.origin]})`);
  L.push('Text: ' + w.text);
  for (const t of (IX.tFrom[id] || []).filter(layerOk)) L.push(`Becomes ${name(t.to)} via ${opLabel(t.op)} (${t.op === 'upkeep' ? 'upkeep' : costTxt(t.costs)})`);
  for (const t of (IX.tTo[id] || []).filter(layerOk)) L.push(`Comes from ${name(t.from)} via ${opLabel(t.op)}`);
  for (const r of (IX.rIn[id] || []).filter(layerOk)) L.push(`Recipe ${recipeName(r.recipe)}: ${r.inputs.map(i => name(i.replace(/^ground:/, ''))).join(' AND ')} → ${name(r.output)}`);
  for (const r of (IX.rOut[id] || []).filter(layerOk)) L.push(`Made by ${recipeName(r.recipe)}: ${r.inputs.map(i => name(i.replace(/^ground:/, ''))).join(' AND ')}`);
  for (const c of (IX.cFrom[id] || []).filter(layerOk)) L.push(`Creates ${name(c.to)} via ${opLabel(c.op)}`);
  const ef = (IX.eFrom[id] || []).filter(layerOk);
  for (const [f, es] of Object.entries(groupFam(ef, e => e.verb + ':' + e.fam))) L.push(`${f.startsWith('supports') ? 'Your side' : f.startsWith('answers') ? 'Rival side' : 'Uses'} — ${FAM[f.split(':')[1]]}: ${[...new Set(es.map(e => name(e.to)))].join(', ')}`);
  for (const c of IX.checks[id] || []) L.push(`Not legal: ${c.claim} — ${c.reason}`);
  L.push(`Source: ${D.build.label}, engine ${D.build.commit}; relationships observed by running the engine (${A.scope === 'core' ? 'three-deck positions' : 'all enabled words'}).`);
  return L.join('\n');
}
function copy(text) { (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(() => toast('Copied'), () => { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); toast('Copied'); } catch (e) { toast('Copy blocked — select the text instead'); } ta.remove(); }); }
function toast(t) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 1600); }

// ---------- transformation map ----------
function routesAround(id) {
  const up = [], down = [];
  for (const t of (IX.tTo[id] || []).filter(layerOk)) up.push({ kind: growthOp(t.op) ? 'growth' : 'form', op: t.op, label: opShort(t.op), cost: t.op === 'upkeep' ? '' : costTxt(t.costs), ins: [t.from], out: id, n: t.n });
  for (const r of (IX.rOut[id] || []).filter(layerOk)) up.push({ kind: 'recipe', op: r.op, label: r.op.startsWith('card:') ? name(r.op.slice(5)) : 'Vessel', cost: costTxt(r.costs), ins: r.inputs, out: id, n: r.n, recipe: r.recipe });
  for (const c of (IX.cTo[id] || []).filter(layerOk)) up.push({ kind: 'product', op: c.op, label: opShort(c.op), cost: c.op === 'upkeep' ? '' : costTxt(c.costs), ins: [c.from], out: id, n: c.n });
  for (const t of (IX.tFrom[id] || []).filter(layerOk)) down.push({ kind: growthOp(t.op) ? 'growth' : 'form', op: t.op, label: opShort(t.op), cost: t.op === 'upkeep' ? '' : costTxt(t.costs), ins: [id], out: t.to, n: t.n });
  for (const r of (IX.rIn[id] || []).filter(layerOk)) down.push({ kind: 'recipe', op: r.op, label: r.op.startsWith('card:') ? name(r.op.slice(5)) : 'Vessel', cost: costTxt(r.costs), ins: r.inputs, out: r.output, n: r.n, recipe: r.recipe, quality: !(D.recipeTable.find(x => x.id === r.recipe) || {}).out });
  for (const c of (IX.cFrom[id] || []).filter(layerOk)) down.push({ kind: 'product', op: c.op, label: opShort(c.op), cost: c.op === 'upkeep' ? '' : costTxt(c.costs), ins: [id], out: c.to, n: c.n });
  // merge routes that differ only by recipe variant id (e.g. the two Pear/Apple Graft orders)
  const merge = arr => { const m = new Map(); for (const r of arr) { const k = [r.kind, r.label, r.ins.slice().sort().join('+'), r.out].join('|'); if (m.has(k)) m.get(k).n += r.n; else m.set(k, { ...r }); } return [...m.values()]; };
  return { up: merge(up), down: merge(down) };
}
const growthOp = op => op === 'upkeep' || op === 'card:life.grow' || op === 'card:life.abundance';
const opShort = op => op === 'upkeep' ? 'Upkeep growth' : op.startsWith('card:') ? name(op.slice(5)) : op.startsWith('ability:') ? abilityName(op.split(':')[2]) : op.startsWith('deploy:') ? 'Arrives' : op.startsWith('recipe:') ? 'Vessel' : op;
const KCOL = { form: '#e6c46a', growth: '#8fcf7a', recipe: '#6fd3b8', product: '#c9d6e3' };
function mapSVG(id) {
  const { up, down } = routesAround(id);
  const rows = Math.max(1, up.length, down.length), H = Math.max(240, rows * 90 + 80), Wd = 960, cy = H / 2;
  const nodes = [], lines = [];
  const node = (x, y, wid, cls = '') => { const w = W[wid]; const lab = name(wid.replace(/^ground:/, '')); nodes.push(`<g class="mn" data-go="map/${esc(wid.replace(/^ground:/, ''))}" style="cursor:pointer" tabindex="0" role="link" aria-label="${esc(lab)}"><rect x="${x - 62}" y="${y - 17}" width="124" height="34" rx="8" fill="${cls === 'center' ? '#3a2c18' : '#211910'}" stroke="${w ? 'var(--' + w.school + ')' : '#4a3a28'}" stroke-width="${cls === 'center' ? 2.5 : 1.3}"/><text x="${x}" y="${y + 5}" text-anchor="middle" font-size="${lab.length > 14 ? 12 : 14}" font-weight="${cls === 'center' ? 700 : 400}">${esc(lab)}</text></g>`); };
  const op = (x, y, r) => { const col = KCOL[r.kind]; nodes.push(`<g><rect x="${x - 58}" y="${y - 20}" width="116" height="40" rx="18" fill="#15100b" stroke="${col}" stroke-dasharray="${r.kind === 'growth' ? '5 4' : r.kind === 'product' ? '2 3' : ''}"/><text x="${x}" y="${y - 3}" text-anchor="middle" font-size="12.5" fill="${col}">${esc(r.label)}</text><text x="${x}" y="${y + 12}" text-anchor="middle" font-size="10.5" fill="#cfc1aa">${esc(r.ins.length > 1 ? 'AND · ' : '')}${esc(r.cost.replace(' breath', 'b').replace('no breath observed', ''))}</text></g>`); };
  const ln = (x1, y1, x2, y2, kind) => lines.push(`<path d="M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}" fill="none" stroke="${KCOL[kind]}" stroke-width="1.6" stroke-dasharray="${kind === 'growth' ? '5 4' : kind === 'product' ? '2 3' : ''}" marker-end="url(#ah-${kind})"/>`);
  node(Wd / 2, cy, id, 'center');
  const place = (arr, side) => arr.forEach((r, k) => {
    const y = arr.length === 1 ? cy : 70 + k * ((H - 110) / Math.max(1, arr.length - 1));
    const ox = side === 'up' ? 300 : 660;
    op(ox, y, r);
    if (side === 'up') {
      r.ins.forEach((inp, j) => { const yy = y + (r.ins.length > 1 ? (j - (r.ins.length - 1) / 2) * 40 : 0); node(95, yy, inp); ln(157, yy, ox - 58, y, r.kind); });
      ln(ox + 58, y, Wd / 2 - 62, cy, r.kind);
    } else {
      ln(Wd / 2 + 62, cy, ox - 58, y, r.kind);
      const co = r.ins.filter(i => i.replace(/^ground:/, '') !== id);
      co.forEach((c, j) => { const yy = y - 34 - j * 30; node(ox, yy - 6, c); lines.push(`<text x="${ox + 66}" y="${yy - 2}" font-size="11" fill="#6fd3b8" font-weight="700">AND</text>`); ln(ox, yy + 11, ox, y - 20, 'recipe'); });
      node(865, y, r.out); ln(ox + 58, y, 865 - 62, y, r.kind);
      if (r.quality) lines.push(`<text x="865" y="${y + 30}" text-anchor="middle" font-size="11" fill="#cfc1aa">+ ${esc(recipeName(r.recipe))}</text>`);
    }
  });
  place(up, 'up'); place(down, 'down');
  const defs = Object.entries(KCOL).map(([k, c]) => `<marker id="ah-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${c}"/></marker>`).join('');
  const vb = A.mapPan && A.mapPan.id === id ? A.mapPan.vb : [0, 0, Wd, H];
  return { svg: `<svg class="mapsvg" id="mapsvg" viewBox="${vb.join(' ')}" data-full="0 0 ${Wd} ${H}" role="img" aria-label="Routes into and out of ${esc(name(id))}"><defs>${defs}</defs><text x="95" y="20" text-anchor="middle" font-size="12" fill="#cfc1aa">needs</text><text x="300" y="20" text-anchor="middle" font-size="12" fill="#cfc1aa">how</text><text x="660" y="20" text-anchor="middle" font-size="12" fill="#cfc1aa">how</text><text x="865" y="20" text-anchor="middle" font-size="12" fill="#cfc1aa">becomes / makes</text>${lines.join('')}${nodes.join('')}</svg>`, up, down };
}
function routeText(r, focus) {
  const ins = r.ins.map(i => i.startsWith('ground:') ? 'your Ground ' + link(i.slice(7)) : link(i)).join(' <span class="and">AND</span> ');
  const kind = { form: 'in-place form change', growth: 'growth over time', recipe: r.quality ? 'combination (host gains a quality)' : 'combination — inputs consumed', product: 'product (new token)' }[r.kind];
  return `${ins} → <b>${esc(r.label)}</b>${r.cost && r.cost !== 'no breath observed' ? ' (' + esc(r.cost) + ')' : ''} → ${link(r.out)}${r.quality ? ' + ' + esc(recipeName(r.recipe)) : ''} <span class="note">· ${kind} · ${r.n} run${r.n === 1 ? '' : 's'}</span>`;
}
function reachable(id) { // forward BFS over routes; returns map form -> path (list of route objects)
  const seen = new Map([[id, []]]), q = [id];
  while (q.length) { const x = q.shift(); for (const r of routesAround(x).down) { if (r.quality) continue; if (!seen.has(r.out)) { seen.set(r.out, seen.get(x).concat([r])); q.push(r.out); } } }
  seen.delete(id); return seen;
}
function makeTree(id, depth = 0, seen = new Set()) { // upstream: how to make it from starting words
  if (depth > 6 || seen.has(id)) return '';
  const w = W[id]; if (w && w.origin === 'starting' && depth > 0) return `<li>${link(id)} <span class="tag o-starting">starting word</span></li>`;
  const { up } = routesAround(id);
  if (!up.length) return depth ? `<li>${link(id)} <span class="note">${w && w.origin === 'starting' ? 'starting word' : 'no observed route in'}</span></li>` : '';
  const s2 = new Set(seen); s2.add(id);
  const alts = up.map(r => `<li>${routeText(r)}${r.ins.some(i => { const ww = W[i.replace(/^ground:/, '')]; return ww && ww.origin !== 'starting'; }) ? `<ul>${r.ins.filter(i => { const ww = W[i.replace(/^ground:/, '')]; return ww && ww.origin !== 'starting'; }).map(i => makeTree(i.replace(/^ground:/, ''), depth + 1, s2)).join('')}</ul>` : ''}</li>`);
  return depth ? `<li>${link(id)} — <span class="or">${up.length > 1 ? 'ONE OF' : ''}</span><ul>${alts.join('')}</ul></li>` : `<ul>${alts.join(up.length > 1 ? '<li class="or" style="list-style:none">OR</li>' : '')}</ul>`;
}
function mapView(id) {
  if (!id || !W[id]) id = 'earth.copper';
  if (A.crumbs[A.crumbs.length - 1] !== id) { A.crumbs = A.crumbs.filter(x => x !== id); A.crumbs.push(id); }
  const { svg, up, down } = mapSVG(id);
  const reach = reachable(id);
  const tgt = A.trace && A.trace.from === id ? A.trace.to : '';
  const path = tgt && reach.get(tgt);
  const starters = ['earth.copper', 'earth.lead', 'life.seed', 'life.pear', 'fire.firebird', 'earth.clay', 'fire.tinder'].filter(inScope);
  return `<section class="pane">
    <h1>Transformations around ${esc(name(id))}</h1>
    <p class="sub">Left: what it can come from. Right: what it can become or help make. Click any word to re-centre. Only routes the engine actually performed are drawn.</p>
    <div class="row" style="margin-bottom:8px">${starters.map(s => `<button class="chip ${W[s].school}" data-go="map/${s}"><span class="dot"></span>${esc(W[s].name)}</button>`).join('')}<button class="btn" data-go="word/${esc(id)}">Word details</button></div>
    <div class="legend"><span><svg width="34" height="8"><path d="M0,4H34" stroke="${KCOL.form}" stroke-width="2"/></svg>in-place form change</span><span><svg width="34" height="8"><path d="M0,4H34" stroke="${KCOL.growth}" stroke-width="2" stroke-dasharray="5 4"/></svg>growth over time</span><span><svg width="34" height="8"><path d="M0,4H34" stroke="${KCOL.recipe}" stroke-width="2"/></svg>combination (AND)</span><span><svg width="34" height="8"><path d="M0,4H34" stroke="${KCOL.product}" stroke-width="2" stroke-dasharray="2 3"/></svg>product (token)</span></div>
    <div class="mapwrap"><div>${up.length || down.length ? svg : '<p class="empty box">No form change, recipe or product touches this word in this scope.</p>'}
      <div class="row" style="margin-top:6px"><button class="btn" id="zin" aria-label="Zoom in">+</button><button class="btn" id="zout" aria-label="Zoom out">−</button><button class="btn" id="zreset">Reset view</button><span class="note">Drag to pan · scroll to zoom</span></div></div>
      <div>
        <h2 style="margin-top:0">Readable routes</h2>
        <h3>Into ${esc(name(id))}</h3>${up.length ? `<ul>${up.map(r => `<li>${routeText(r)}</li>`).join(up.length > 1 ? '<li class="or" style="list-style:none">OR</li>' : '')}</ul>` : '<p class="empty">Nothing makes it: it starts in a deck.</p>'}
        <h3>Out of ${esc(name(id))}</h3>${down.length ? `<ul>${down.map(r => `<li>${routeText(r)}</li>`).join('')}</ul>` : '<p class="empty">No onward form change, recipe or product.</p>'}
        <h3>Trace a route</h3>
        <select class="inp" id="trace" aria-label="Trace to"><option value="">Where can ${esc(name(id))} lead? (${reach.size} forms)</option>${[...reach.keys()].map(k => `<option value="${esc(k)}"${k === tgt ? ' selected' : ''}>${esc(name(k))} — ${reach.get(k).length} step${reach.get(k).length === 1 ? '' : 's'}</option>`).join('')}</select>
        ${path ? `<ol class="steps" style="margin-top:10px">${path.map(r => `<li>${routeText(r)}${r.ins.length > 1 ? '<br><span class="note">Needs the other input on your field at the same time.</span>' : ''}</li>`).join('')}</ol><p class="note">A candidate route, not a promise: drawing the words, timing, free places, breath and the rival’s responses all apply. Each step uses the Vessel or a once-per-turn change at most once per turn where the card says so.</p>` : ''}
        <h3>How to make ${esc(name(id))} from the starting decks</h3>${W[id].origin === 'starting' ? '<p class="note">It is a starting word.</p>' : makeTree(id) || '<p class="empty">No observed route.</p>'}
      </div></div>
  </section>`;
}
function bindMap(id) {
  const t = $('#trace'); if (t) t.onchange = () => { A.trace = { from: id, to: t.value }; render(); };
  const svg = $('#mapsvg'); if (!svg) return;
  const full = svg.dataset.full.split(' ').map(Number);
  let vb = svg.getAttribute('viewBox').split(' ').map(Number);
  const setVB = v => { vb = v; svg.setAttribute('viewBox', v.join(' ')); A.mapPan = { id, vb: v }; };
  const zoom = (f, cx = vb[0] + vb[2] / 2, cy = vb[1] + vb[3] / 2) => setVB([cx - (cx - vb[0]) * f, cy - (cy - vb[1]) * f, vb[2] * f, vb[3] * f]);
  $('#zin').onclick = () => zoom(0.8); $('#zout').onclick = () => zoom(1.25); $('#zreset').onclick = () => setVB(full.slice());
  svg.addEventListener('wheel', e => { e.preventDefault(); const r = svg.getBoundingClientRect(); zoom(e.deltaY > 0 ? 1.12 : 0.89, vb[0] + (e.clientX - r.left) / r.width * vb[2], vb[1] + (e.clientY - r.top) / r.height * vb[3]); }, { passive: false });
  let drag = null;
  svg.addEventListener('pointerdown', e => { if (e.target.closest('.mn')) return; drag = { x: e.clientX, y: e.clientY, vb: vb.slice() }; svg.setPointerCapture(e.pointerId); });
  svg.addEventListener('pointermove', e => { if (!drag) return; const r = svg.getBoundingClientRect(); setVB([drag.vb[0] - (e.clientX - drag.x) / r.width * vb[2], drag.vb[1] - (e.clientY - drag.y) / r.height * vb[3], vb[2], vb[3]]); });
  svg.addEventListener('pointerup', () => { drag = null; });
  for (const g of svg.querySelectorAll('.mn')) g.addEventListener('keydown', e => { if (e.key === 'Enter') go(g.dataset.go); });
}

// ---------- decks ----------
function deckData(k) {
  const d = D.decks[k], pool = new Set(d.words.concat(d.forms));
  const recipes = D.recipes.filter(r => r.layers.includes('core') && r.inputs.every(i => pool.has(i.replace(/^ground:/, ''))));
  const partial = D.recipeTable.map(def => {
    const ins = [def.a, def.b];
    const has = ins.map(p => p && p.form ? pool.has(p.form) : null);
    return { def, has };
  }).filter(x => x.has.some(h => h === true) && x.has.some(h => h === false));
  const trans = D.transforms.filter(t => t.layers.includes('core') && pool.has(t.from));
  const creates = D.creates.filter(c => c.layers.includes('core') && pool.has(c.from));
  const outs = id => (IX.tFrom[id] || []).filter(t => t.layers.includes('core')).length + (IX.rIn[id] || []).filter(r => r.layers.includes('core') && r.inputs.every(i => pool.has(i.replace(/^ground:/, '')))).length;
  const multi = [...pool].filter(id => W[id] && W[id].type === 'thing' || (W[id] && W[id].origin === 'created')).map(id => ({ id, n: new Set([...(IX.tFrom[id] || []).filter(t => t.layers.includes('core')).map(t => t.to), ...(IX.rIn[id] || []).filter(r => r.layers.includes('core')).map(r => r.output)]).size })).filter(x => x.n >= 2);
  const deadEnds = d.forms.filter(f => !outs(f) && !(IX.eFrom[f] || []).some(e => e.layers.includes('core')) && !(IX.cFrom[f] || []).length);
  const nonCombatOps = new Set(Object.values(D.ops).filter(o => o.layers.includes('core') && o.source && pool.has(o.source) && !['deploy', 'ground'].includes(o.kind)).map(o => o.id));
  return { d, pool, recipes, partial, trans, creates, multi, deadEnds, nonCombatOps };
}
function decksView() {
  return `<section class="pane"><h1>The three decks</h1><p class="sub">The current 20-word lists in ${esc(D.build.label)}. Each is a single copy of 20 different words. Shared words (Wind, Gust, Owl) have one definition.</p>
    <div class="grid3">${Object.entries(D.decks).map(([k, d]) => { const x = deckData(k); return `<button class="box deckcard" data-go="deck/${k}"><h3 style="font:21px var(--serif)">${esc(d.name)}</h3><p class="note">${esc(schoolList(d.schools).join(' · '))} · ${d.words.length} different words · ${d.forms.length} forms it can make</p><p>${esc(d.pitch)}</p><p class="note">${x.recipes.length} recipe instance(s), ${new Set(x.trans.map(t => t.from + t.to)).size} form changes, ${x.nonCombatOps.size} non-combat operations seen.</p></button>`; }).join('')}</div>
    <p class="note" style="margin-top:14px">${esc(D.frozenDecks.note)} (${esc(D.frozenDecks.keys.join(', '))} — not shown).</p></section>`;
}
function deckView(k) {
  const x = deckData(k); if (!x.d) return '<section class="pane"><h1>Unknown deck</h1></section>';
  const d = x.d, byType = {};
  for (const w of d.words) (byType[W[w].type] = byType[W[w].type] || []).push(w);
  const chk = A.check && A.check.deck === k ? A.check : (A.check = { deck: k, opp: Object.keys(D.decks).find(o => o !== k), hand: [], field: [], rivalField: [], breath: 8, result: null });
  return `<section class="pane"><h1>${esc(d.name)}</h1><p class="sub">${esc(schoolList(d.schools).join(' · '))} · ${d.words.length} different words · <button class="wlink" id="dcsv">export word table (CSV)</button></p>
    <div class="grid3"><div class="box"><h3>What am I trying to build?</h3><p>${esc(d.pitch)}</p><p class="note">${esc(d.plan)}</p><p class="note"><span class="ev">design interpretation</span> The deck’s own description from the game data, not a proven optimal line.</p></div>
      <div class="box"><h3>Words by type</h3>${Object.entries(byType).map(([t, ws]) => `<p style="margin:4px 0"><b>${esc(TYPE[t] || t)}</b> ${ws.map(w => chip(w)).join('')}</p>`).join('')}</div>
      <div class="box"><h3>Forms this deck can make</h3>${d.forms.map(f => chip(f)).join('') || '<span class="empty">none</span>'}<p class="note">Every form here was produced by the engine from this deck’s own words.</p></div></div>
    <h2>Verified combinations inside this deck</h2>
    ${x.recipes.length ? mergeR(x.recipes).map(r => recipeRow(r, null)).join('') : '<p class="empty">No multi-input recipe uses only this deck’s words.</p>'}
    <h3>Form changes</h3>${[...new Map(x.trans.map(t => [t.from + '>' + t.to + t.op, t])).values()].map(t => transformRow(t, 'out').replace('→ ', '<span class="note">' + esc(name(t.from)) + '</span> → ')).join('') || '<p class="empty">none</p>'}
    <h3>Products</h3>${[...new Map(x.creates.map(c => [c.from + c.to + c.op, c])).values()].map(c => createRow(c, 'out').replace('→ ', '<span class="note">' + esc(name(c.from)) + '</span> → ')).join('') || '<p class="empty">none</p>'}
    <h2>Shape of the deck</h2>
    <div class="grid3">
      <div class="box"><h3>Crossroads <small class="note">forms with two or more onward routes</small></h3>${x.multi.map(m => `<p style="margin:4px 0">${chip(m.id)} <span class="note">${m.n} directions</span></p>`).join('') || '<p class="empty">none</p>'}</div>
      <div class="box"><h3>Missing partner <small class="note">recipes where this deck has one input but not the other</small></h3>${x.partial.map(p => `<p style="margin:4px 0">${esc(recipeName(p.def.id))}: ${[p.def.a, p.def.b].map((pp, i) => p.has[i] ? '<b>' + esc(predTxt(pp)) + '</b>' : '<span style="color:var(--bad)">missing ' + esc(predTxt(pp)) + '</span>').join(' AND ')}</p>`).join('') || '<p class="empty">none</p>'}<p class="note">Only recipes with exact forms are checked here; property-based inputs (“a Living Beast”) are not listed as missing.</p></div>
      <div class="box"><h3>Outputs with no onward use <small class="note">in this deck</small></h3>${x.deadEnds.map(f => chip(f)).join('') || '<p class="empty">none</p>'}<p class="note">A prompt for discussion; a simple end point can be right.</p></div>
    </div>
    <h2>What could I do with these words?</h2>
    <p class="note">Build a position and ask the game’s own engine (bundled unchanged) what is legal. It is your turn, Things are mature and ready unless you say otherwise, and nothing else is in play. This answers “legal in this constructed position”, not “will happen in a real match”.</p>
    <div class="grid3">
      <div class="box"><h3>Your hand</h3><div class="picker" id="pk-hand">${d.words.map(w => `<button data-pick="hand" data-w="${w}" class="${chk.hand.includes(w) ? 'on' : ''}"${chk.field.includes(w) ? ' disabled' : ''}>${esc(name(w))}</button>`).join('')}</div></div>
      <div class="box"><h3>Your field <small class="note">${chk.field.length}/7</small></h3><div class="picker">${d.words.concat(d.forms).filter(w => W[w].type === 'thing' || ['token', 'made'].includes(w.split('.')[0]) || W[w].origin === 'created').map(w => `<button data-pick="field" data-w="${w}" class="${chk.field.includes(w) ? 'on' : ''}"${chk.hand.includes(w) || (!chk.field.includes(w) && chk.field.length >= 7) ? ' disabled' : ''}>${esc(name(w))}</button>`).join('')}</div>
        <p class="note">Options: <label><input type="checkbox" id="ck-wet"${chk.wet ? ' checked' : ''}> your Things are Wet</label> · <label><input type="checkbox" id="ck-dmg"${chk.dmg ? ' checked' : ''}> damaged 1</label> · breath <select id="ck-br">${[0, 1, 2, 3, 4, 5, 6, 8, 10].map(b => `<option${b === chk.breath ? ' selected' : ''}>${b}</option>`).join('')}</select></p></div>
      <div class="box"><h3>Rival field</h3><select id="ck-opp" class="inp">${Object.entries(D.decks).filter(([o]) => o !== k).map(([o, od]) => `<option value="${o}"${o === chk.opp ? ' selected' : ''}>${esc(od.name)}</option>`).join('')}</select><div class="picker" style="margin-top:6px">${D.decks[chk.opp].words.concat(D.decks[chk.opp].forms).filter(w => W[w].type === 'thing' || W[w].origin === 'created').map(w => `<button data-pick="rivalField" data-w="${w}" class="${chk.rivalField.includes(w) ? 'on' : ''}"${!chk.rivalField.includes(w) && chk.rivalField.length >= 7 ? ' disabled' : ''}>${esc(name(w))}</button>`).join('')}</div></div>
    </div>
    <div class="row" style="margin:10px 0"><button class="btn go" id="ck-run">Ask the engine</button><button class="btn" id="ck-clear">Clear</button><span class="note">${window.WAE ? 'Engine loaded.' : 'Engine not available in this copy: the checker is off.'}</span></div>
    <div id="ck-out">${chk.result || ''}</div>
  </section>`;
}
function bindDeck(k) {
  const chk = A.check;
  for (const b of document.querySelectorAll('[data-pick]')) b.onclick = () => { const L = chk[b.dataset.pick], w = b.dataset.w; const i = L.indexOf(w); if (i >= 0) L.splice(i, 1); else L.push(w); chk.result = null; render(); };
  const o = $('#ck-opp'); if (o) o.onchange = () => { chk.opp = o.value; chk.rivalField = []; chk.result = null; render(); };
  const wet = $('#ck-wet'); if (wet) wet.onchange = () => { chk.wet = wet.checked; };
  const dm = $('#ck-dmg'); if (dm) dm.onchange = () => { chk.dmg = dm.checked; };
  const br = $('#ck-br'); if (br) br.onchange = () => { chk.breath = +br.value; };
  const run = $('#ck-run'); if (run) run.onclick = () => { chk.result = runCheck(chk); $('#ck-out').innerHTML = chk.result; };
  const cl = $('#ck-clear'); if (cl) cl.onclick = () => { Object.assign(chk, { hand: [], field: [], rivalField: [], result: null }); render(); };
  const csv = $('#dcsv'); if (csv) csv.onclick = () => download(D.decks[k].name.replace(/\W+/g, '_') + '_words.csv', toCSV([['id', 'name', 'school', 'type', 'cost', 'strike', 'stand', 'text']].concat(D.decks[k].words.concat(D.decks[k].forms).map(w => [w, name(w), W[w].school, W[w].type, W[w].cost, W[w].strike, W[w].stand, W[w].text]))), 'text/csv');
}
function runCheck(chk) {
  if (!window.WAE) return '<p class="box">The engine is not bundled in this copy, so legality cannot be checked here.</p>';
  const { E, F, BY_ID, THREE_DECKS } = window.WAE;
  try {
    const S = F.createFromFormat(D.build.format, { decks: [THREE_DECKS[chk.deck].words, THREE_DECKS[chk.opp].words], seed: 7, first: 0, mulligan: () => [] });
    for (const p of S.players) { p.deck.push(...p.hand); p.hand = []; p.breath = 0; p.reserve = 0; p.personalTurn = Math.max(p.personalTurn, 3); }
    S.active = 0; S.players[0].breath = chk.breath;
    const T = D.probe.templates.core;
    const put = (side, f) => {
      const p = S.players[side], tpl = T[f]; const printed = tpl ? tpl.word : f;
      const k = (tpl && (tpl.token || tpl.lineage)) ? -1 : p.deck.findIndex(c => c.word === printed);
      if (k < 0 && !(tpl && (tpl.token || tpl.lineage))) throw new Error(name(f) + ' needs its printed card ' + name(printed) + ', already used');
      const c = k >= 0 ? p.deck.splice(k, 1)[0] : null;
      const t = { id: 't' + (++S.seq), pid: c ? c.pid : null, word: tpl ? tpl.word : f, owner: side, ctrl: side, entry: S.seq, damage: side === 0 && chk.dmg && (BY_ID[f].stand || 2) > 1 ? 1 : 0, counters: {}, status: side === 0 && chk.wet ? { wet: true } : {}, exhausted: false, fresh: false, actions: 0, arrivedTurn: 0 };
      if (tpl) { if (tpl.form) t.form = tpl.form; if (tpl.token) t.token = true; if (tpl.lineage) t.lineage = JSON.parse(JSON.stringify(tpl.lineage)); }
      S.things.push(t);
    };
    for (const f of chk.field) put(0, f); for (const f of chk.rivalField) put(1, f);
    for (const w of chk.hand) { const p = S.players[0], k = p.deck.findIndex(c => c.word === w); if (k >= 0) p.hand.push(p.deck.splice(k, 1)[0]); }
    const acts = E.legalActions(S).filter(a => a.type !== 'pass');
    const word = pid => { const c = S.players[0].hand.find(h => h.pid === pid); return c ? c.word : null; };
    const tn = id => { const t = S.things.find(x => x.id === id); return t ? name(t.form || t.word) + (t.ctrl === 0 ? '' : ' (rival)') : id === 'ground' ? 'Ground' : id === 'self' ? 'yourself' : id == null ? '' : String(id); };
    const desc = a => { const parts = []; if (a.type === 'combat') return 'Attack with ' + a.attackers.map(tn).join(', '); if (a.type === 'study') return 'Study'; if (a.type === 'fuse') return 'Vessel: ' + tn(a.a) + ' AND ' + tn(a.b) + ' → ' + recipeName(a.recipe);
      if (a.card) parts.push((a.type === 'deploy' ? 'Bring forth ' : a.type === 'ground' ? 'Lay ' : 'Speak ') + name(word(a.card))); if (a.subject) parts.push(tn(a.subject) + ' uses ' + abilityName(a.ability));
      for (const k of ['target', 'a', 'b']) if (a[k]) parts.push('→ ' + tn(a[k])); if (a.targets) parts.push('→ ' + a.targets.map(tn).join(' and ')); if (a.branch) parts.push('(' + (BY_ID[a.branch] ? 'becomes ' + name(a.branch) : a.branch) + ')'); if (a.mode) parts.push('(' + modeTxt('mode:' + a.mode) + ')'); if (a.recipe) parts.push('→ ' + recipeName(a.recipe)); if (a.sacrifice) parts.push('sacrificing ' + tn(a.sacrifice)); if (a.ash) parts.push('making Ash'); if (a.endorse) parts.push('stamped by ' + tn(a.endorse)); return parts.join(' '); };
    const groups = {}; for (const a of acts) { const key = a.card ? name(word(a.card)) : a.subject ? tn(a.subject) : a.type === 'combat' ? 'Attack' : a.type === 'fuse' ? 'Vessel' : a.type === 'study' ? 'Study' : a.type; (groups[key] = groups[key] || []).push(a); }
    const unused = chk.hand.filter(w => !acts.some(a => a.card && word(a.card) === w));
    const why = w => { const typ = BY_ID[w].type; const r = E.whyIllegal(S, { type: typ === 'thing' ? 'deploy' : typ === 'ground' ? 'ground' : typ === 'action' ? 'action' : 'spell', card: (S.players[0].hand.find(h => h.word === w) || {}).pid }); return r && r !== 'not a legal sentence now' ? r : 'no eligible subject or target in this position'; };
    return `<div class="box"><h3>The engine offers ${acts.length} action${acts.length === 1 ? '' : 's'}</h3>${Object.entries(groups).map(([g, as]) => `<details class="rel"${as.length < 6 ? ' open' : ''}><summary><b>${esc(g)}</b> <span class="note">${as.length}</span></summary><div class="body"><ul>${as.slice(0, 40).map(a => `<li>${esc(desc(a))}</li>`).join('')}${as.length > 40 ? `<li class="note">… ${as.length - 40} more combinations</li>` : ''}</ul></div></details>`).join('') || '<p class="empty">Nothing is legal.</p>'}
      ${unused.length ? `<h3>Not usable here</h3><ul>${unused.map(w => `<li>${link(w)} — <span class="note">engine: ${esc(why(w))}</span></li>`).join('')}</ul>` : ''}
      <p class="note">Checked with ${esc(D.build.label)} engine ${esc(D.build.commit)} (bundled). Rival words in hand, reserve and responses are not modelled.</p></div>`;
  } catch (e) { return `<p class="box">The engine refused this position: ${esc(e.message || e)}</p>`; }
}

// ---------- effects ----------
function effectsView(fam) {
  const all = D.edges.filter(layerOk).filter(e => e.verb !== 'consumes' || fam === 'consumption');
  const counts = {}; for (const e of all) (counts[e.fam] = counts[e.fam] || new Set()).add(e.from);
  if (!fam) return `<section class="pane"><h1>Effects</h1><p class="sub">Every effect the engine actually produced, grouped by what it does. Counts are how many different words produce it in this scope.</p>
    <div class="grid3">${Object.entries(FAM).filter(([k]) => counts[k]).sort((a, b) => counts[b[0]].size - counts[a[0]].size).map(([k, l]) => `<button class="box deckcard" data-go="effect/${k}"><h3>${esc(l)}</h3><p class="note">${counts[k].size} word(s): ${[...counts[k]].slice(0, 6).map(id => esc(name(id))).join(', ')}${counts[k].size > 6 ? '…' : ''}</p></button>`).join('')}
    <button class="box deckcard" data-go="effect/creation"><h3>Creation and transformation</h3><p class="note">Products, recipes and form changes — see the transformation map.</p></button></div>
    <h2>Conditions</h2>${conditionsHTML()}</section>`;
  if (fam === 'creation') { go('map/earth.copper', true); return ''; }
  const es = all.filter(e => e.fam === fam);
  const bySrc = groupFam(es, e => e.from);
  const cmp = A.cmp && A.cmp.fam === fam ? A.cmp.ids : [];
  return `<section class="pane"><h1>${esc(FAM[fam] || fam)}</h1><p class="sub">${Object.keys(bySrc).length} words produce this effect in this scope. Tick up to four to compare.</p>
    <table class="t"><thead><tr><th></th><th>Word</th><th>How</th><th>When</th><th>Breath</th><th>Your Things</th><th>Rival Things</th><th>Runs</th></tr></thead><tbody>
    ${Object.entries(bySrc).sort((a, b) => a[0].localeCompare(b[0])).map(([src, xs]) => { const ops = [...new Set(xs.map(e => e.op))]; const mine = [...new Set(xs.filter(e => e.side === 'mine').map(e => e.to))], th = [...new Set(xs.filter(e => e.side === 'theirs').map(e => e.to))];
      return `<tr><td><input type="checkbox" data-cmp="${esc(src)}"${cmp.includes(src) ? ' checked' : ''} aria-label="Compare ${esc(name(src))}"></td><td>${chip(src)}</td><td>${ops.map(o => esc(opLabel(o))).join('<br>')}</td><td>${esc([...new Set(ops.map(opTiming))].join('; '))}</td><td>${esc(costTxt([...new Set(xs.flatMap(e => e.costs))]))}</td><td>${mine.slice(0, 8).map(t => esc(name(t))).join(', ')}${mine.length > 8 ? ` +${mine.length - 8}` : ''}</td><td>${th.slice(0, 8).map(t => esc(name(t))).join(', ')}${th.length > 8 ? ` +${th.length - 8}` : ''}</td><td>${xs.reduce((n, e) => n + e.n, 0)}</td></tr>`; }).join('')}</tbody></table>
    ${cmp.length ? `<h2>Comparison</h2><div class="grid3">${cmp.map(id => { const xs = bySrc[id] || []; const other = [...new Set((IX.eFrom[id] || []).filter(layerOk).map(e => e.fam))].filter(f => f !== fam); return `<div class="box"><h3>${link(id)}</h3><div class="parch" style="font-size:14.5px">${linkText(W[id].text)}</div><p><b>Cost</b> ${W[id].cost} breath to speak / ${esc(costTxt([...new Set(xs.flatMap(e => e.costs))]))} observed</p><p><b>When</b> ${esc([...new Set(xs.map(e => opTiming(e.op)))].join('; '))}</p><p><b>Targets</b> yours: ${[...new Set(xs.filter(e => e.side === 'mine').map(e => name(e.to)))].join(', ') || '—'}; rival’s: ${[...new Set(xs.filter(e => e.side === 'theirs').map(e => name(e.to)))].join(', ') || '—'}</p><p><b>Modes</b> ${esc([...new Set(xs.map(e => e.mode).filter(Boolean).map(modeTxt))].join('; ') || '—')}</p><p><b>Also does</b> ${other.map(f => esc(FAM[f] || f)).join(', ') || '—'}</p></div>`; }).join('')}</div>` : ''}
  </section>`;
}
function conditionsHTML() {
  const st = [['wetting', 'drying', 'Wet'], ['ignition', 'extinguish', 'Burning'], ['protection', null, 'Protected (Ward, Shield, Guard)'], ['control', null, 'Exhausted or Bound']];
  const words = f => [...new Set(D.edges.filter(layerOk).filter(e => e.fam === f).map(e => e.from))];
  const checks = D.checks.filter(c => /Wet|Ward|Ignite/.test(c.claim));
  return `<div class="grid3">${st.map(([add, rem, l]) => `<div class="box"><h3>${esc(l)}</h3><p><b>Applied by</b> ${words(add).map(w => chip(w)).join('') || '—'}</p>${rem ? `<p><b>Removed by</b> ${words(rem).map(w => chip(w)).join('') || '—'}</p>` : ''}</div>`).join('')}</div>
    ${checks.map(checkHTML).join('')}<p class="note">Status interactions are listed only where the engine produced them or refused an action because of them.</p>`;
}
function bindEffects(fam) { for (const c of document.querySelectorAll('[data-cmp]')) c.onchange = () => { A.cmp = A.cmp && A.cmp.fam === fam ? A.cmp : { fam, ids: [] }; const i = A.cmp.ids.indexOf(c.dataset.cmp); if (c.checked && i < 0) { if (A.cmp.ids.length >= 4) { c.checked = false; toast('Up to four'); return; } A.cmp.ids.push(c.dataset.cmp); } else if (!c.checked && i >= 0) A.cmp.ids.splice(i, 1); render(); }; }

// ---------- workshop ----------
function gaps() {
  const ids = Object.keys(W).filter(inScope).filter(id => W[id].origin !== 'code');
  const hasT = id => (IX.tFrom[id] || []).some(layerOk) || (IX.tTo[id] || []).some(layerOk) || (IX.rIn[id] || []).some(layerOk) || (IX.rOut[id] || []).some(layerOk);
  const things = ids.filter(id => W[id].type === 'thing');
  const noPath = things.filter(id => !hasT(id));
  const narrow = ids.filter(id => { const es = (IX.eFrom[id] || []).filter(layerOk); const t = new Set(es.map(e => e.to)); return W[id].type !== 'thing' && es.length && t.size === 1; });
  const single = D.recipeTable.filter(r => r.a && r.b && r.a.form && r.b.form && (r.observedLayers.includes('core') || A.scope === 'all' && r.observed));
  const noOnward = ids.filter(id => ['created', 'enabled-form'].includes(W[id].origin) && !(IX.tFrom[id] || []).some(layerOk) && !(IX.rIn[id] || []).some(layerOk) && !(IX.eFrom[id] || []).some(layerOk) && !(IX.cFrom[id] || []).some(layerOk));
  const unobserved = D.recipeTable.filter(r => !r.observed);
  const deckDev = Object.keys(D.decks).map(k => ({ k, n: deckData(k).nonCombatOps.size }));
  return { noPath, narrow, single, noOnward, unobserved, deckDev };
}
function noteHTML(n) { return `<div class="proposed" style="margin:8px 0"><b class="lbl">PROPOSED — NOT IN THE GAME</b> <span class="note">on ${esc(n.targetLabel || n.target)} · ${esc(n.kind)} · ${esc(n.when.slice(0, 10))}</span><p style="margin:6px 0 0;white-space:pre-wrap">${esc(n.text)}</p><button class="btn" data-del="${esc(n.id)}" style="margin-top:6px">Remove</button></div>`; }
function workshopView() {
  const g = gaps();
  const L = (arr, f = x => chip(x)) => arr.length ? arr.map(f).join('') : '<span class="empty">none</span>';
  return `<section class="pane"><h1>Design workshop</h1><p class="sub">Read-only prompts for discussion. Counts are not rankings of card quality; some simple words should stay simple. Your notes never change the game data.</p>
    <div class="grid3">
      <div class="box"><h3>Things with no transformation path <small class="note">${g.noPath.length}</small></h3>${L(g.noPath)}</div>
      <div class="box"><h3>Words with one narrow use <small class="note">${g.narrow.length} · one kind of target observed</small></h3>${L(g.narrow)}</div>
      <div class="box"><h3>Made or created forms with no onward use <small class="note">${g.noOnward.length}</small></h3>${L(g.noOnward)}</div>
      <div class="box"><h3>Recipes that need two exact words <small class="note">${g.single.length}</small></h3>${g.single.map(r => `<p style="margin:3px 0">${esc(recipeName(r.id))}: ${link(r.a.form)} AND ${link(r.b.form)}</p>`).join('') || '<span class="empty">none</span>'}</div>
      <div class="box"><h3>Recipes in code never performed in this build <small class="note">${g.unobserved.length}</small></h3>${g.unobserved.map(r => `<p style="margin:3px 0"><span class="ev">not verified</span> ${esc(r.id)} → ${esc(r.outInThisBuild ? name(r.outInThisBuild) : 'quality')} <span class="note">(${esc(predTxt(r.a))} + ${esc(predTxt(r.b))}; ${esc(r.table)})</span></p>`).join('')}</div>
      <div class="box"><h3>Ways to develop a field <small class="note">distinct non-combat operations seen per deck</small></h3>${g.deckDev.map(x => `<p style="margin:3px 0">${esc(D.decks[x.k].name)}: <b>${x.n}</b></p>`).join('')}</div>
    </div>
    <h2>Proposals and notes</h2>
    <div class="box"><div class="grid3" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">
      <label>About <select class="inp" id="nt-target">${Object.values(W).filter(w => inScope(w.id)).sort((a, b) => a.name.localeCompare(b.name)).map(w => `<option value="${w.id}"${A.noteTarget === w.id ? ' selected' : ''}>${esc(w.name)}</option>`).join('')}</select></label>
      <label>Kind <select class="inp" id="nt-kind"><option>new relationship</option><option>change to a word</option><option>question</option><option>observation</option></select></label>
      <label>Related word (optional) <select class="inp" id="nt-rel"><option value="">—</option>${Object.values(W).filter(w => w.origin !== 'code').sort((a, b) => a.name.localeCompare(b.name)).map(w => `<option value="${w.id}">${esc(w.name)}</option>`).join('')}</select></label></div>
      <label>Proposal <textarea id="nt-text" rows="3" placeholder="e.g. Hammer could Shape a Signet back into Copper (2 breath)…"></textarea></label>
      <div class="row" style="margin-top:8px"><button class="btn go" id="nt-add">Add proposal</button><button class="btn" id="nt-export">Export notes (JSON)</button><label class="btn">Import notes<input type="file" id="nt-import" accept="application/json" hidden></label><button class="btn" id="nt-show">Show notes as text</button><button class="btn" id="nt-paste">Paste notes</button><button class="btn" id="rt-export">Export recipe table (CSV)</button><span class="note">${store.set('atlas.probe', 1) ? 'Saved in this browser; export to keep them safe.' : 'This browser blocks storage here: notes last until you close the page — export them.'}</span></div></div>
    <div id="nt-io"></div>
    ${A.notes.map(noteHTML).join('') || '<p class="empty">No proposals yet.</p>'}
  </section>`;
}
function saveNotes() { store.set('atlas.notes', A.notes); }
function bindWorkshop() {
  const add = $('#nt-add'); if (!add) return;
  add.onclick = () => { const t = $('#nt-text').value.trim(); if (!t) { toast('Write the proposal first'); return; } const target = $('#nt-target').value, rel = $('#nt-rel').value;
    A.notes.push({ id: 'n' + Date.now().toString(36), status: 'PROPOSED — not in the game', target: rel ? target + '|' + rel : target, targetLabel: name(target) + (rel ? ' + ' + name(rel) : ''), kind: $('#nt-kind').value, text: t, build: D.build.label + ' · ' + D.build.commit, when: new Date().toISOString() }); saveNotes(); render(); };
  $('#nt-export').onclick = () => download('alchemists_atlas_notes.json', JSON.stringify({ schema: 'word-alchemy-atlas-notes/1', status: 'PROPOSED — none of these are in the game', build: D.build, notes: A.notes }, null, 2), 'application/json');
  const importText = s => { const j = JSON.parse(s); const ns = (j.notes || []).filter(n => n && n.id && n.text && n.target); let k = 0; for (const n of ns) if (!A.notes.some(m => m.id === n.id)) { A.notes.push({ ...n, status: 'PROPOSED — not in the game' }); k++; } saveNotes(); toast(k + ' note(s) imported'); render(); };
  $('#nt-import').onchange = e => { const f = e.target.files[0]; if (!f) return; f.text().then(importText).catch(() => toast('That file is not an Atlas notes file')); };
  const notesJSON = () => JSON.stringify({ schema: 'word-alchemy-atlas-notes/1', status: 'PROPOSED — none of these are in the game', build: D.build, notes: A.notes }, null, 2);
  $('#nt-show').onclick = () => { $('#nt-io').innerHTML = '<div class="box"><p class="note">Select all and copy. Paste it back later with “Paste notes”.</p><textarea rows="8" readonly id="nt-out"></textarea></div>'; $('#nt-out').value = notesJSON(); $('#nt-out').select(); };
  $('#nt-paste').onclick = () => { $('#nt-io').innerHTML = '<div class="box"><textarea rows="6" id="nt-in" placeholder="Paste exported notes JSON here"></textarea><button class="btn go" id="nt-in-go" style="margin-top:6px">Import</button></div>'; $('#nt-in-go').onclick = () => { try { importText($('#nt-in').value); } catch (e) { toast('That is not Atlas notes JSON'); } }; };
  $('#rt-export').onclick = () => download('recipe_table.csv', toCSV([['id', 'table', 'input_a', 'input_b', 'output', 'cost', 'observed_runs', 'observed_in']].concat(D.recipeTable.map(r => [r.id, r.table, predTxt(r.a), predTxt(r.b), r.outInThisBuild || 'quality', r.cost, r.observed, r.observedLayers.join(' ')]))), 'text/csv');
}
document.addEventListener('click', e => { const d = e.target.closest('[data-del]'); if (d) { A.notes = A.notes.filter(n => n.id !== d.dataset.del); saveNotes(); render(); } });
function toCSV(rows) { return rows.map(r => r.map(v => { const s = String(v == null ? '' : v); return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; }).join(',')).join('\n'); }
let DL = null; try { if (window.claude && typeof window.claude.use === 'function') window.claude.use('downloads').then(d => { DL = d; }, () => {}); } catch (e) { /* not in the artifact viewer */ }
function download(fn, text, type) {
  if (DL) { DL.save({ filename: fn, data: text }).then(() => toast('Saved'), e => toast(e && e.code === 'declined' ? 'Not saved' : 'Saving is not available here — use “Show notes as text” to copy')); return; }
  return blobDownload(fn, text, type);
}
function blobDownload(fn, text, type) { const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type })); a.download = fn; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }

// ---------- note dialog from a word ----------
function bindWord(id) {
  const c = $('#copyw'); if (c) c.onclick = () => copy(summaryText(id));
  const n = $('#notew'); if (n) n.onclick = () => { A.noteTarget = id; go('workshop'); setTimeout(() => { const t = $('#nt-text'); if (t) t.focus(); }, 50); };
}

// ---------- render ----------
function render() {
  const { view, arg } = current();
  let body = '', layout = 'single';
  if (view === 'word') { body = listHTML(arg) + wordView(arg); layout = 'detail'; }
  else if (view === 'words') body = listHTML(null) + homeView(), layout = 'list';
  else if (view === 'map') body = mapView(arg);
  else if (view === 'decks') body = decksView();
  else if (view === 'deck') body = deckView(arg);
  else if (view === 'effects') body = effectsView(null);
  else if (view === 'effect') body = effectsView(arg);
  else if (view === 'workshop') body = workshopView();
  else body = listHTML(null) + homeView(), layout = 'list';
  $('#app').innerHTML = header(view) + `<main class="${layout === 'single' ? 'single' : layout}">${body}</main>`;
  bindHeader(); bindList();
  if (view === 'map') bindMap(arg || 'earth.copper');
  if (view === 'deck') bindDeck(arg);
  if (view === 'effect') bindEffects(arg);
  if (view === 'workshop') bindWorkshop();
  if (view === 'word') bindWord(arg);
  if (view === 'word' || view === 'map') window.scrollTo(0, 0);
}
function homeView() {
  const n = o => Object.values(W).filter(w => w.origin === o).length;
  return `<section class="pane"><h1>What can each word do?</h1><p class="sub">Search a word, pick one from the list, or start with a deck. Every relationship shown was performed by the game’s own engine in ${D.probe.core.positions + D.probe.vocabulary.positions} constructed positions; nothing is inferred from themes or tags.</p>
    <div class="grid3">${Object.entries(D.decks).map(([k, d]) => `<button class="box deckcard" data-go="deck/${k}"><h3 style="font:21px var(--serif)">${esc(d.name)}</h3><p>${esc(d.pitch)}</p><p class="note">${d.words.length} words · ${d.forms.length} forms it can make</p></button>`).join('')}</div>
    <h2>Try</h2><p>${['earth.copper', 'life.bee', 'life.pear', 'life.grow', 'life.graft3', 'fire.naphtha', 'earth.transmute', 'earth.hammer', 'made.phoenix'].filter(id => W[id]).map(id => chip(id)).join('')}</p>
    <h2>Coverage</h2><p class="note">${n('starting')} different starting words in the three decks (Wind, Gust and Owl are shared) · ${n('created')} forms they can create · ${n('enabled') + n('enabled-form')} further enabled words · ${n('code')} words in code but not enabled. ${D.edges.length} observed effect links, ${D.transforms.length} form changes, ${D.recipes.length} recipe instances, ${D.creates.length} products. Counts describe the projection, not the quality of the game.</p>
    <p class="note">Source: ${esc(D.build.label)} · format ${esc(D.build.format)} · engine commit ${esc(D.build.commit)} · engine.js ${esc(D.build.hashes['engine29/src/engine.js'])} · cards.js ${esc(D.build.hashes['engine29/src/cards.js'])} · generated ${esc(D.build.generated.slice(0, 16).replace('T', ' '))}</p></section>`;
}
render();
})();
