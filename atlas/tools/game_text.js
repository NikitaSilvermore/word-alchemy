// Reads the live card text and display names from the game's own UI source (playtest/src/main.js) without changing it:
// the text tables and textOf()/nm() are evaluated verbatim in a sandbox with the Room to Grow modules switched on.
'use strict';
const fs = require('fs'), vm = require('vm'), path = require('path');
const ROOT = path.resolve(__dirname, '../..');
function loadGameText(modules) {
  const src = fs.readFileSync(ROOT + '/playtest/src/main.js', 'utf8').split('\n');
  const start = src.findIndex(l => l.startsWith('const SPEC_BY = {}')), end = src.findIndex(l => l.startsWith('function textOf('));
  if (start < 0 || end < 0) throw new Error('text tables not found in main.js');
  const block = src.slice(start, end + 1).join('\n');
  const ctx = { SPEC: require(ROOT + '/engine29/data/spec_catalogue.json'), BY_ID: require(ROOT + '/engine29/src/cards').BY_ID,
    A: { C: { S: { rules: { modules } } } }, isThree: () => modules.includes('three'), isCore: () => modules.includes('core'), out: {} };
  vm.createContext(ctx);
  vm.runInContext(block + '\nout.textOf = textOf; out.nm = nm;', ctx);
  return { textOf: ctx.out.textOf, nm: ctx.out.nm, lines: [start + 1, end + 1] };
}
module.exports = { loadGameText };
