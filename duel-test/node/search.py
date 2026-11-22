import asyncio, json, random, sys, time, os
sys.argv=[sys.argv[0]]+sys.argv[1:]
import drv
from playwright.async_api import async_playwright
GENS=int(os.environ.get('GENS','8')); POP=16; GAMES=int(os.environ.get('GAMES','12'))
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch()
        pgs=[await drv.page(b,'10') for _ in range(2)]
        info=await pgs[0].evaluate("""(()=>{const pool=SIM.pool();const k=w=>W[w].t===NOUN?(W[w].props.includes('ground')?'g':W[w].props.includes('spell')||W[w].props.includes('event')?'s':'n'):W[w].t===VERB?'v':W[w].t===ADJ?'a':'o';return {pool:pool.map(w=>[w,k(w),schoolOf(w)]),gauntlet:Array.from({length:12},()=>SIM.randDeck())};})()""")
        pool=info['pool']; G=info['gauntlet']; kind={w:k for w,k,s in pool}; byk={}
        for w,k,s in pool: byk.setdefault(k,[]).append(w)
        S7=['fire','water','earth','air','life','rot','word']
        seeds=await pgs[0].evaluate("""(()=>{const o=[];const S=['fire','water','earth','air','life','rot','word'];for(let i=0;i<8;i++){const a=S[Math.floor(Math.random()*6)],b=S[Math.floor(Math.random()*7)];o.push(SIM.schoolDeck(a===b?[a]:[a,b]));}for(let i=0;i<8;i++)o.push(SIM.randDeck());return o;})()""")
        pop=[{'d':d,'w':0,'n':0} for d in seeds]
        def mutate(d):
            d=d[:]
            for _ in range(random.choice([1,2,2,3])):
                i=random.randrange(len(d)); k=kind.get(d[i],'n'); c=[w for w in byk.get(k,[]) if w not in d]
                if c: d[i]=random.choice(c)
            return d
        async def evaluate(ind):
            specs=[]
            for j in range(GAMES):
                g=G[j%len(G)]
                specs.append({'d0':ind['d'],'d1':g,'tag':'s'})
            return specs
        log=[]
        for gen in range(GENS):
            t0=time.time()
            jobs=[]
            for ind in pop:
                for s in await evaluate(ind): jobs.append((ind,s))
            ch=[jobs[i::2] for i in range(2)]
            async def work(pg,js):
                out=[]
                for i in range(0,len(js),6):
                    rs=await pg.evaluate("s=>SIM.batch(s)",[s for _,s in js[i:i+6]])
                    out+=list(zip([ind for ind,_ in js[i:i+6]],rs))
                return out
            res=await asyncio.gather(*[work(pgs[i],ch[i]) for i in range(2)])
            for part in res:
                for ind,r in part:
                    if r.get('err') or r['win']<0: continue
                    ind['n']+=1; ind['w']+=(r['win']==0)
            pop.sort(key=lambda x:-(x['w']+1)/(x['n']+2))
            best=pop[0]; log.append({'gen':gen,'best':best['d'],'rate':best['w']/max(1,best['n']),'n':best['n']})
            print(f"gen {gen} best {best['w']}/{best['n']} {round(time.time()-t0)}s", ' '.join(best['d']), file=sys.stderr, flush=True)
            elite=pop[:6]
            kids=[{'d':mutate(random.choice(elite)['d']),'w':0,'n':0} for _ in range(POP-6)]
            pop=elite+kids
        # final: top 6 elites, re-test with 36 games each vs fresh random decks
        fin=[]
        for ind in pop[:6]:
            specs=[{'d0':ind['d'],'d1':{'gen':'rand'},'tag':'f'} for _ in range(36)]
            rs=(await pgs[0].evaluate("s=>SIM.batch(s)",specs[:18]))+(await pgs[1].evaluate("s=>SIM.batch(s)",specs[18:]))
            w=sum(1 for r in rs if not r.get('err') and r['win']==0); n=sum(1 for r in rs if not r.get('err') and r['win']>=0)
            sch={}
            for c in ind['d']:
                s_=[s for w,k,s in pool if w==c]; s_=s_[0] if s_ else '?'; sch[s_]=sch.get(s_,0)+1
            fin.append({'deck':ind['d'],'win':w/max(1,n),'n':n,'schools':sch})
        json.dump({'log':log,'final':fin},open(os.environ.get('OUT','search_out.json'),'w'),indent=1)
        await b.close()
asyncio.run(main())
