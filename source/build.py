import base64,glob,json,os
p='/home/claude/wordgame/'
r=lambda f:open(p+f,encoding='utf8').read()
mt={'jpg':'image/jpeg','png':'image/png','webp':'image/webp'}
inl={}
fs=[]
for pat in ['fd/*_m.jpg','tk/*_m.jpg','ic/*.png','og/*.png','ach/s[0-9].webp','rv/*.jpg','em/*.jpg','rd/*.webp','mk/*.png']: fs+=sorted(glob.glob(p+'assets/'+pat))
fs+=[f for f in sorted(glob.glob(p+'assets/fx/*.webp')) if not os.path.basename(f).startswith(('fx_','seal_','wisp','rune_'))]
for f in fs:
    inl[f[len(p)+7:]]='data:'+mt[f.rsplit('.',1)[1]]+';base64,'+base64.b64encode(open(f,'rb').read()).decode()
inlset=set(fs)
# packs, for the artifact only: card art in 8 packs, small interface pictures in 2
groups={}
art=sorted(glob.glob(p+'assets/art/*.*'))
for i,f in enumerate(art): groups.setdefault('art%d'%(i*8//len(art)),[]).append(f)
for d in ['ds','fr','pf','ui','lt','fn','ach']:
    groups.setdefault('ui',[]).extend(f for f in sorted(glob.glob(p+'assets/'+d+'/*.*')) if f not in inlset)
groups['ui']+=sorted(glob.glob(p+'assets/*.jpg')+glob.glob(p+'assets/*.webp'))
for d in ['end','wx','me']:
    groups.setdefault('misc',[]).extend(f for f in sorted(glob.glob(p+'assets/'+d+'/*.*')) if f not in inlset)
os.makedirs(p+'assets/pack',exist_ok=True)
for f in glob.glob(p+'assets/pack/*.json'): os.remove(f)
pmap={}
for g in groups: groups[g]=[f for f in groups[g] if f.rsplit('.',1)[1] in mt]
for g,lst in groups.items():
    o={}
    for f in lst:
        k=f[len(p):]; o[k]=[mt[f.rsplit('.',1)[1]],base64.b64encode(open(f,'rb').read()).decode()]; pmap[k]=g
    json.dump(o,open(p+'assets/pack/'+g+'.json','w'))
json.dump(sorted(pmap),open(p+'assets/pack/_packed.json.list','w'))
body=r('engine.js')
tail='<script>\nconst INL='+json.dumps(inl)+';\n'+r('ui.js')+'</script>\n</body>\n</html>\n'
web=r('head.html')+'<script id="engine">\n'+body+'</script>\n\n'+tail
open(p+'index_web.html','w',encoding='utf8').write(web)
pack='<script>const PACKMAP='+json.dumps(pmap)+';\n'+open('/home/claude/wgtest/packjs.js').read()+'</script>\n'
h=r('head.html'); i=h.index('<body')
i=h.index('>',i)+1
open(p+'index.html','w',encoding='utf8').write(h[:i]+pack+h[i:]+'<script id="engine">\n'+body+'</script>\n\n'+tail)
print(len(inl),len(pmap),{g:len(l) for g,l in groups.items()},os.path.getsize(p+'index.html'))
