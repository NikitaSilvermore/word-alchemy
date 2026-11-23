import asyncio, threading, functools, http.server, socketserver, json, sys, time
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a): pass
    def handle(self):
        try: super().handle()
        except Exception: pass
socketserver.ThreadingTCPServer.allow_reuse_address=True
PAGE=__import__('os').environ.get('SIMPAGE','sim.html')
PORT=int(sys.argv[3]) if len(sys.argv)>3 else 8811
srv=socketserver.ThreadingTCPServer(('127.0.0.1',PORT),functools.partial(Q,directory='/home/claude/dtest/art')); threading.Thread(target=srv.serve_forever,daemon=True).start()
from playwright.async_api import async_playwright
async def page(b,ver):
    pg=await b.new_page(viewport={'width':1280,'height':720})
    pg.on('pageerror',lambda e:None)
    await pg.route('**/*',lambda r: r.abort() if ('127.0.0.1' not in r.request.url and r.request.url.startswith('http')) else (r.abort() if r.request.resource_type in ('image','media','font') else r.continue_()))
    await pg.add_init_script("try{localStorage.setItem('wa-duel-test-ver','%s');localStorage.setItem('wa-dtv8','1');localStorage.setItem('wa-dtv9','1');localStorage.setItem('wa-dtv10','1');localStorage.setItem('wa-dtv11','1');for(let k=12;k<=40;k++)localStorage.setItem('wa-dtv'+k,'1');}catch(e){}"%ver)
    await pg.goto('http://127.0.0.1:%d/'%PORT+PAGE,wait_until='domcontentloaded',timeout=120000)
    for _ in range(60):
        ok=await pg.evaluate("typeof SIM!=='undefined'&&typeof fresh==='function'&&typeof PF!=='undefined'&&!!PF")
        if ok: break
        await pg.wait_for_timeout(1000)
    await pg.evaluate("window.render=()=>{};window.renderMatch=()=>{};window.sfx=()=>{};window.turnBanner=()=>{};window.sayBanner=()=>{};")
    return pg
async def run(jobs_in, jobs_out, ver, npages=2, extra=None):
    specs=json.load(open(jobs_in)); res=[]
    async with async_playwright() as p:
        b=await p.chromium.launch(args=['--js-flags=--max-old-space-size=2048'])
        pgs=[await page(b,ver) for _ in range(npages)]
        if extra:
            for pg in pgs: await pg.evaluate(extra)
        chunks=[specs[i::npages] for i in range(npages)]
        async def work(pg,ch):
            out=[]
            for i in range(0,len(ch),4):
                out+=await pg.evaluate("s=>SIM.batch(s)",ch[i:i+4])
            return out
        t0=time.time()
        rs=await asyncio.gather(*[work(pgs[i],chunks[i]) for i in range(npages)])
        for r in rs: res+=r
        print('games',len(res),'secs',round(time.time()-t0,1),file=sys.stderr)
        await b.close()
    json.dump(res,open(jobs_out,'w'))
if __name__=='__main__':
    extra=open(sys.argv[4]).read() if len(sys.argv)>4 else None
    asyncio.run(run(sys.argv[1],sys.argv[2],__import__('os').environ.get('VER','10'),2,extra)); srv.shutdown()
