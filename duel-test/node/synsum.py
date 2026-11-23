import sys,re,collections
cur=None;T=collections.Counter();L=collections.Counter()
for line in sys.stdin:
    m=re.match(r'== (\w+) bodies',line)
    if m:cur=m.group(1);continue
    m=re.match(r'\s+(\S.*?) (verb|adj|clime|cat|noun) (typed|against) (.*)',line)
    if m and cur:
        vals=dict(x.split(':') for x in m.group(4).split())
        k=cur[:2]
        if m.group(3)=='against':continue
        T[cur]+=1
        if m.group(3)=='typed' and int(vals.get(k,0))>=40:L[cur]+=1
for s in T:print(f"{s:6} linked {L[s]}/{T[s]} = {L[s]/T[s]:.0%}")
