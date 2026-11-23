import json,sys,collections,statistics as st
R=json.load(open(sys.argv[1]));r=[x for x in R if not x.get('err')]
print('games',len(r),'errors',len(R)-len(r))
if len(R)>len(r):print(' first err:',[x for x in R if x.get('err')][0]['err'][:200])
S=['fire','water','air','earth','life','rot','word'];W=collections.defaultdict(lambda:[0,0]);D=collections.defaultdict(collections.Counter)
for x in r:
    t=x.get('tag','');
    if '|' not in t:continue
    a,b=t.split('|')
    for side,sc in ((0,a),(1,b)):
        if x['win'] in (0,1):W[sc][0]+=x['win']==side;W[sc][1]+=1
        for k,v in (x.get('dmg') or [{},{}])[side].items():D[sc][k]+=v
dec=[x for x in r if x['win'] in (0,1)]
print('rounds med',st.median([x['rounds'] for x in r]),'| >=13 rounds',f"{sum(x['rounds']>=13 for x in r)/len(r):.0%}",'| draws',sum(x['win'] not in (0,1) for x in r),'| first wins',f"{sum(x['win']==x['first'] for x in dec)/max(1,len(dec)):.0%}",'| seat0 wins',f"{sum(x['win']==0 for x in dec)/max(1,len(dec)):.0%}",'| fusions/player',round(st.mean([sum(x['fuse'])/2 for x in r]),2))
OWN={'fire':'burn','water':'tide','air':'over','earth':'crush','life':None,'rot':'poison','word':None}
for s in S:
    if not W[s][1]:continue
    tot=sum(D[s].values()) or 1;top=', '.join(f'{k} {v/tot:.0%}' for k,v in D[s].most_common(4))
    print(f"{s:6} win {W[s][0]/W[s][1]:.0%}  own route {D[s][OWN[s]]/tot:.0%} " if OWN[s] else f"{s:6} win {W[s][0]/W[s][1]:.0%}  ",'|',top)
