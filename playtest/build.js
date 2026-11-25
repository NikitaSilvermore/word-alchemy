// Bundles the playtest into dist/ (index.html + app.js + assets). Rules code is engine29, unchanged.
const fs = require('fs'), path = require('path'), esbuild = require('esbuild');
const out = path.join(__dirname, 'dist');
fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(path.join(out, 'assets/frames'), { recursive: true });
esbuild.buildSync({ entryPoints: [path.join(__dirname, 'src/main.js')], bundle: true, format: 'iife', platform: 'browser', target: 'es2020', outfile: path.join(out, 'app.js'), define: { 'process.env.NODE_ENV': '"production"', 'process.env': '{}' }, minify: false, legalComments: 'none' });
const css = fs.readFileSync(path.join(__dirname, 'src/style.css'), 'utf8');
const html = `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 16 16%22%3E%3Ccircle cx=%228%22 cy=%228%22 r=%227%22 fill=%22%23e6c46a%22/%3E%3C/svg%3E"><title>Word Alchemy — The Workshop (V32 research)</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Alegreya+Sans:wght@400;700;800&family=IM+Fell+English&display=swap" rel="stylesheet">
<style>${css}</style></head>
<body><div id="app"><p style="padding:20px">Loading The Workshop…</p></div><script src="app.js"></script></body></html>
`;
fs.writeFileSync(path.join(out, 'index.html'), html);
for (const f of fs.readdirSync(path.join(__dirname, 'assets/frames'))) fs.copyFileSync(path.join(__dirname, 'assets/frames', f), path.join(out, 'assets/frames', f));
console.log('built', fs.statSync(path.join(out, 'app.js')).size, 'bytes app.js');
fs.mkdirSync(path.join(out, 'assets/art'), { recursive: true });
for (const f of fs.readdirSync(path.join(__dirname, 'assets/art'))) fs.copyFileSync(path.join(__dirname, 'assets/art', f), path.join(out, 'assets/art', f));
