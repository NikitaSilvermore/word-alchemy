import asyncio,sys,json,os,functools,http.server,socketserver,threading,time,random
from playwright.async_api import async_playwright
ROOT=os.environ.get('ROOT','/home/claude/wa/duel-test')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
    def handle(self):
        try: super().handle()
        except Exception: pass
socketserver.ThreadingTCPServer.allow_reuse_address=True
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),functools.partial(Q,directory=ROOT));PORT=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
N=int(sys.argv[1]);OUT=sys.argv[2];NP=int(os.environ.get('NP','4'));PAGE=os.environ.get('PAGE','index.html')
INJ=os.environ.get('INJ','1')=='1'
SCH=os.environ.get('SCH','fire,water,air,earth,life,rot,word').split(',')
specs=[]
RAND=int(os.environ.get('RAND','0'))
for k in range(RAND):
  specs.append({'d0':{'gen':'rand'},'d1':{'gen':'rand'},'tag':'rand','opt':{'first':k%2}})
for k in range(N):
  a=SCH[k%len(SCH)];b=SCH[(k//len(SCH))%len(SCH)]
  specs.append({'d0':{'gen':'starter','s':a},'d1':{'gen':'starter','s':b},'tag':a+'-'+b,'opt':{'first':k%2}})
async def page(b):
  pg=await b.new_page(viewport={'width':1280,'height':720})
  pg.on('pageerror',lambda e:print('PAGEERR',str(e)[:200],file=sys.stderr))
  async def rt(r):
    if r.request.resource_type in ('image','media','font') or ('127.0.0.1' not in r.request.url and r.request.url.startswith('http')): await r.abort()
    else: await r.continue_()
  await pg.route('**/*',rt)
  await pg.add_init_script("window.RCSIM=1;try{localStorage.setItem('wa-duel-test-ver','19');}catch(e){}")
  await pg.goto(f'http://127.0.0.1:{PORT}/{PAGE}?v=19',wait_until='domcontentloaded',timeout=180000)
  for _ in range(90):
    if await pg.evaluate("typeof fresh==='function'&&typeof PF!=='undefined'&&!!PF"):break
    await pg.wait_for_timeout(1000)
  await pg.evaluate("window.render=()=>{};window.renderMatch=()=>{};window.sfx=()=>{};window.turnBanner=()=>{};window.sayBanner=()=>{};")
  if INJ: await pg.evaluate(open(ROOT+'/src/rules.js').read())
  await pg.evaluate("RC.on=true;")
  await pg.evaluate(open(ROOT+'/node/sim.js').read())
  return pg
async def main():
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--no-proxy-server','--js-flags=--max-old-space-size=4096'])
    pgs=[await page(b) for _ in range(NP)]
    chunks=[specs[i::NP] for i in range(NP)]
    res=[]
    async def work(pg,ch):
      out=[]
      for i in range(0,len(ch),5):
        r=await pg.evaluate("s=>{RC.log=[];RC.blocks=[];const out=[];for(const sp of s){RC.log=[];RC.blocks=[];const r=SIM.batch([sp])[0];r.viol=RC.log.slice();r.blocks=RC.blocks.slice();delete r.dmg;out.push(r);}return out;}",ch[i:i+5])
        out+=r
      return out
    t0=time.time()
    rs=await asyncio.gather(*[work(pgs[i],chunks[i]) for i in range(NP)])
    for r in rs: res+=r
    print('games',len(res),'secs',round(time.time()-t0,1),file=sys.stderr)
    await b.close()
  json.dump(res,open(OUT,'w'))
asyncio.run(main())
