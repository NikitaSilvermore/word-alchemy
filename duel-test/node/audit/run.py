import asyncio,sys,json,os,functools,http.server,socketserver,threading
from playwright.async_api import async_playwright
ROOT=os.environ.get('ROOT','/home/claude/wa/duel-test')
class Q(http.server.SimpleHTTPRequestHandler):
    def log_message(self,*a):pass
socketserver.ThreadingTCPServer.allow_reuse_address=True
srv=socketserver.ThreadingTCPServer(('127.0.0.1',0),functools.partial(Q,directory=ROOT));PORT=srv.server_address[1]
threading.Thread(target=srv.serve_forever,daemon=True).start()
async def main(js_files,out):
  async with async_playwright() as p:
    b=await p.chromium.launch(args=['--no-proxy-server','--js-flags=--max-old-space-size=4096'])
    pg=await b.new_page(viewport={'width':1280,'height':800})
    errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.on('console',lambda m: print('[c]',m.text[:300]) if os.environ.get('CON') else None)
    await pg.route('**/*',lambda r: r.abort() if (r.request.resource_type in ('image','media','font') or ('127.0.0.1' not in r.request.url and r.request.url.startswith('http'))) else r.continue_())
    await pg.add_init_script("try{localStorage.setItem('wa-duel-test-ver','19');}catch(e){}")
    await pg.goto(f'http://127.0.0.1:{PORT}/index.html?v=19',wait_until='domcontentloaded',timeout=180000)
    for _ in range(90):
      if await pg.evaluate("typeof fresh==='function'&&typeof W!=='undefined'&&typeof PF!=='undefined'&&!!PF"):break
      await pg.wait_for_timeout(1000)
    await pg.evaluate("window.render=()=>{};window.renderMatch=()=>{};window.sfx=()=>{};window.turnBanner=()=>{};window.sayBanner=()=>{};")
    res={}
    for f in js_files:
      res[f]=await pg.evaluate(open(f).read())
    res['_pageerrors']=errs[:20]
    json.dump(res,open(out,'w'),indent=1)
    await b.close()
asyncio.run(main(sys.argv[2:],sys.argv[1]))
