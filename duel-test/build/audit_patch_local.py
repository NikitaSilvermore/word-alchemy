import re
p='/home/claude/dtest/art/index.html';s=open(p,encoding='utf8').read()
s=s.replace('load(PK[m]).then(again)','load(PK[m]).then(()=>{if(U[m])again();})')
for sid in ['v19rules','rulescheck']: s=re.sub(r'<script id="'+sid+r'">.*?</script>\n','',s,flags=re.S)
fix=open('/home/claude/dtest/v19rules.js',encoding='utf8').read();rc=open('/home/claude/dtest/rules.js',encoding='utf8').read()
i=s.index('/* v18: your deck.');j=s.index('</script>',i)+len('</script>\n')
s=s[:j]+'<script id="v19rules">'+fix+'</script>\n<script id="rulescheck">'+rc+'</script>\n'+s[j:]
open(p,'w',encoding='utf8').write(s);print('audit layer in',len(s))
