import json,sys,collections,statistics as st
r=[x for x in json.load(open(sys.argv[1])) if 'err' not in x or not x.get('err')]
errs=[x for x in json.load(open(sys.argv[1])) if x.get('err')]
print('games',len(r),'errors',len(errs))
if errs: print(errs[0]['err'][:300])
def summ(rs,name):
    if not rs: return
    T=[x['turns'] for x in rs]; dec=[x for x in rs if x['win']>=0]
    fw=sum(1 for x in dec if x['win']==x['first'])/max(1,len(dec))
    cb=sum(1 for x in dec if x['behind']<=-8)/max(1,len(dec))
    big=[max(x['maxHit']) for x in rs]
    oneh=sum(1 for b in big if b>=15)/len(rs)
    in812=sum(1 for t in T if 8<=t<=12)/len(T)
    print(f"{name}: n={len(rs)} turns med {st.median(T)} (8-12: {in812:.0%}, <8: {sum(1 for t in T if t<8)/len(T):.0%}, >12: {sum(1 for t in T if t>12)/len(T):.0%}) | first wins {fw:.0%} | comebacks(>=8 behind) {cb:.0%} | biggest hit med {st.median(big)} | hit>=15 {oneh:.0%} | draws {sum(1 for x in rs if x['win']<0)} | fuse/g {st.mean([sum(x['fuse']) for x in rs]):.1f} evo/g {st.mean([sum(x['evo']) for x in rs]):.1f}")
by=collections.defaultdict(list)
for x in r: by[x['tag'].split(':')[0]].append(x)
for k,v in by.items(): summ(v,k)
# mono matrix
S=['fire','water','earth','air','life','rot','word']
M=collections.defaultdict(lambda:[0,0])
for x in by.get('mono',[]):
    _,a,b=x['tag'].split(':')
    if a==b or x['win']<0: continue
    w=a if x['win']==0 else b; l=b if x['win']==0 else a
    M[(w,l)][0]+=1
tot=collections.Counter(); wins=collections.Counter()
for (w,l),v in M.items(): wins[w]+=v[0]; tot[w]+=v[0]; tot[l]+=v[0]
if tot:
    print('\nmono school win rate vs other schools:')
    for s_ in sorted(S,key=lambda s_:-wins[s_]/max(1,tot[s_])): print(f'  {s_:6s} {wins[s_]/max(1,tot[s_]):.0%} ({tot[s_]} games)')
    print('matrix row beats col (%):')
    print('       '+' '.join(f'{c[:5]:>6s}' for c in S))
    for a in S:
        row=[]
        for b in S:
            if a==b: row.append('     -');continue
            n=M[(a,b)][0]+M[(b,a)][0]; row.append(f'{(M[(a,b)][0]/n*100 if n else 0):6.0f}')
        print(f'{a:6s} '+' '.join(row))
duo=collections.defaultdict(lambda:[0,0])
for x in by.get('duo',[]):
    if x['win']<0: continue
    duo[x['tag'][4:]][0]+= (x['win']==0); duo[x['tag'][4:]][1]+=1
if duo:
    print('\ntwo-school decks vs random decks:')
    for k,v in sorted(duo.items(),key=lambda kv:-kv[1][0]/kv[1][1]): print(f'  {k:12s} {v[0]/v[1]:.0%} ({v[1]})')
# card win rates (deck inclusion), all games
cw=collections.defaultdict(lambda:[0,0])
for x in r:
    if x['win']<0 or 'd' not in x: continue
    for i in (0,1):
        for w in set(x['d'][i]): cw[w][0]+=(x['win']==i); cw[w][1]+=1
rows=[(w,v[0]/v[1],v[1]) for w,v in cw.items() if v[1]>=40]
rows.sort(key=lambda z:-z[1])
print('\ncards: top 15 by win rate when in deck'); [print(f'  {w:18s} {p:.0%} ({n})') for w,p,n in rows[:15]]
print('cards: bottom 15'); [print(f'  {w:18s} {p:.0%} ({n})') for w,p,n in rows[-15:]]
json.dump({'cards':rows},open(sys.argv[1]+'.cards.json','w'))
