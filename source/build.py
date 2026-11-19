import base64,glob,json,os
p='/home/claude/wordgame/'
r=lambda f:open(p+f,encoding='utf8').read()
mt={'jpg':'image/jpeg','png':'image/png','webp':'image/webp'}
inl={}
fs=[]
for pat in ['fd/*_m.jpg','tk/*_m.jpg','ic/*.png','og/*.png','ach/s[0-9].webp','rv/*.jpg','em/*.jpg','rd/*.webp']: fs+=sorted(glob.glob(p+'assets/'+pat))
fs+=[f for f in sorted(glob.glob(p+'assets/fx/*.webp')) if not os.path.basename(f).startswith(('fx_','seal_','wisp','rune_'))]
for f in fs:
    inl[f[len(p)+7:]]='data:'+mt[f.rsplit('.',1)[1]]+';base64,'+base64.b64encode(open(f,'rb').read()).decode()
open(p+'index.html','w',encoding='utf8').write(r('head.html')+'<script id="engine">\n'+r('engine.js')+'</script>\n\n<script>\nconst INL='+json.dumps(inl)+';\n'+r('ui.js')+'</script>\n</body>\n</html>\n')
print(len(inl),os.path.getsize(p+'index.html'))
