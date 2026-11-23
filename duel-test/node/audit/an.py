import json,collections,sys
R=json.load(open(sys.argv[1]))
errs=[r for r in R if r.get('err')];print('games',len(R),'errors',len(errs),[e['err'][:200] for e in errs[:3]])
c=collections.Counter();ex={}
for r in R:
  for v in r.get('viol',[]):
    k=(v['type'],v['card'],v['msg'][:40]);c[k]+=1;ex.setdefault(k,v)
print('--- violations',sum(c.values()))
for k,n in c.most_common(int(sys.argv[2]) if len(sys.argv)>2 else 50): print(n,k[:2],ex[k]['msg'][:160],'| ACT',ex[k]['act'][:80])
b=collections.Counter();bt=0
for r in R:
  for x in r.get('blocks',[]): bt+=1;b[(x['ok'],x['via'],x['bad'][:100])]+=1
print('--- blocks',bt)
for k,n in b.most_common(25):print(n,k)
