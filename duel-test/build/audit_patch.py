"""Rules audit layer (23 Nov): put src/v19rules.js (the V19 fixes) and src/rules.js (the Rules check) into index.html, after v18.js.
   Idempotent: replaces the blocks if they are already there. Also keeps the art loader from looping when a pack is missing."""
import re, sys, os
H = os.path.dirname(os.path.abspath(__file__)) + '/..'
p = H + '/index.html'
s = open(p, encoding='utf8').read()
s = s.replace('load(PK[m]).then(again)', 'load(PK[m]).then(()=>{if(U[m])again();})')
for sid in ['v19rules', 'rulescheck']:
    s = re.sub(r'<script id="' + sid + r'">.*?</script>\n', '', s, flags=re.S)
fix = open(H + '/src/v19rules.js', encoding='utf8').read()
rc = open(H + '/src/rules.js', encoding='utf8').read()
anchor = '/* v18: your deck.'
i = s.index(anchor); j = s.index('</script>', i) + len('</script>\n')
s = s[:j] + '<script id="v19rules">' + fix + '</script>\n<script id="rulescheck">' + rc + '</script>\n' + s[j:]
open(p, 'w', encoding='utf8').write(s)
print('patched', len(s))
