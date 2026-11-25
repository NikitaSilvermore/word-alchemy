// Builds the Atlas into dist/: one index.html (data + app + the game's engine, bundled unchanged) and the game's art.
// usage: node build.js   (run tools/build_data.js first)
'use strict';
const fs = require('fs'), path = require('path');
const esbuild = require(path.resolve(__dirname, '../playtest/node_modules/esbuild'));
const out = path.join(__dirname, 'dist');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
const eng = esbuild.buildSync({ entryPoints: [path.join(__dirname, 'src/engine_entry.js')], bundle: true, format: 'iife', platform: 'browser', target: 'es2020', write: false, minify: true, define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' }, legalComments: 'none' }).outputFiles[0].text;
const app = fs.readFileSync(path.join(__dirname, 'src/app.js'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, 'src/style.css'), 'utf8');
const data = fs.readFileSync(path.join(__dirname, 'data/atlas_data.json'), 'utf8');
const safe = s => s.replace(/<\/(script)/gi, '<\\/$1').replace(/<!--/g, '<\\!--');
const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>The Alchemist’s Atlas — Word Alchemy</title>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22%3E%3Ccircle cx=%228%22 cy=%228%22 r=%227%22 fill=%22%23e6c46a%22/%3E%3C/svg%3E">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;700;800&family=IM+Fell+English&display=swap" rel="stylesheet">
<style>${css}</style></head>
<body><div id="app"><p style="padding:20px">Opening the Atlas…</p></div>
<script type="application/json" id="atlas-data">${safe(data)}</script>
<script>${safe(eng)}</script>
<script>${safe(app)}</script>
</body></html>
`;
fs.writeFileSync(path.join(out, 'index.html'), html);
for (const sub of ['frames', 'art']) { fs.mkdirSync(path.join(out, 'assets', sub), { recursive: true }); for (const f of fs.readdirSync(path.resolve(__dirname, '../playtest/assets', sub))) fs.copyFileSync(path.resolve(__dirname, '../playtest/assets', sub, f), path.join(out, 'assets', sub, f)); }
console.log('built', (fs.statSync(path.join(out, 'index.html')).size / 1e6).toFixed(2), 'MB index.html');
