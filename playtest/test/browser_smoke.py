"""Browser smoke test: plays whole matches through the real UI by clicking, in headless Chrome.
usage: python3 test/browser_smoke.py <dist dir> [games]"""
import sys, random, http.server, threading, functools, json
from playwright.sync_api import sync_playwright

dist = sys.argv[1]; games = int(sys.argv[2]) if len(sys.argv) > 2 else 3
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=dist))
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/index.html'
errors = []; rnd = random.Random(7); report = []

def lobby(page):  # an unfinished match now resumes on load: go back to the lobby on purpose
    page.goto(url); page.wait_for_selector('#lob, .match')
    if page.query_selector('.match'): page.click('#m-lobby')
    page.wait_for_selector('#lob')

def visible(page, sel):
    return [e for e in page.query_selector_all(sel) if e.is_visible() and e.is_enabled()]

def step(page):
    over = page.evaluate('() => { const C = WA30.A.C; return C && C.S ? C.S.over : null }')
    if over is not None: return 'over'
    for sel in ['#mu-keep']:
        b = visible(page, sel)
        if b: b[0].click(); return 'mull'
    b = visible(page, '[data-block]')
    if b: rnd.choice(b).click(); return 'block'
    b = visible(page, '[data-decide]')
    if b: rnd.choice(b).click(); return 'decide'
    b = visible(page, '#a-confirm')
    if b: b[0].click(); return 'confirm'
    b = visible(page, '[data-choose]')
    if b: rnd.choice(b).click(); return 'choose'
    b = visible(page, '[data-respond]')
    if b: (b[-1] if rnd.random() < .5 else rnd.choice(b)).click(); return 'respond'
    if visible(page, '#a-cancel'):
        visible(page, '#a-cancel')[0].click(); visible(page, '#a-end') and visible(page, '#a-end')[0].click(); return 'cancel+end'
    end = visible(page, '#a-end')
    if end:
        r = rnd.random()
        hand = visible(page, '.card.hand.hi'); mine = visible(page, '.row.mine .card.board:not(.back)')
        if r < .55 and hand: hand[rnd.randrange(len(hand))].click(position={'x': 40, 'y': 60}); return 'hand'
        if r < .7 and mine: mine[rnd.randrange(len(mine))].click(position={'x': 30, 'y': 40}); return 'thing'
        v = visible(page, '#a-vessel')
        if r < .8 and v: v[0].click(); return 'vessel'
        buy = visible(page, '[data-buy]')
        if r < .88 and buy: buy[0].click(); return 'buy'
        end[0].click(); return 'end'
    page.wait_for_timeout(120); return 'wait'

with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    for width in (1280, 400):
        page = br.new_page(viewport={'width': width, 'height': 900})
        page.on('console', lambda m: m.type == 'error' and 'fonts.g' not in m.text and errors.append(m.text))
        page.on('pageerror', lambda e: errors.append('pageerror: ' + (e.stack or str(e))[:600]))
        lobby(page)
        for g in range(games if width == 1280 else 1):
            lobby(page)
            decks = page.eval_on_selector_all('#l-mine option', 'o => o.map(x => x.value)')
            page.select_option('#l-mine', rnd.choice(decks)); page.select_option('#l-theirs', rnd.choice(decks))
            page.select_option('#l-tier', rnd.choice(['apprentice', 'journeyman', 'expert']))
            page.select_option('#l-seat', rnd.choice(['first', 'second']))
            page.fill('#l-seed', str(1000 + g)); page.click('#l-start')
            page.wait_for_selector('.match, .mull', timeout=5000)
            page.evaluate('() => { WA30.A.speed = 0 }')
            kinds = {}
            for k in range(4000):
                s = step(page); kinds[s] = kinds.get(s, 0) + 1
                if s == 'over': break
            st = page.evaluate('() => { const C = WA30.A.C, S = C.S; return { over: S.over, round: S.round, inputs: C.inputs.length, audit: WA30.E.zoneAudit(S) } }')
            report.append({'width': width, 'game': g, **st, 'steps': kinds})
            assert st['over'] is not None, ('game did not finish', st, kinds)
            # export, reload, resume
            page.click('#m-export'); txt = page.input_value('#ex-t'); rep = json.loads(txt); page.keyboard.press('Escape')
            lobby(page); page.click('#l-resume'); page.wait_for_selector('.reviewbar')
            h = page.evaluate('() => WA30.A.C.S.hashes.slice(-1)[0]')
            assert h == rep['finalHash'], ('resume hash mismatch', h, rep['finalHash'])
            page.click('#rv-0'); page.click('#rv-n'); page.click('#rv-e')
        # fixtures and inspector
        lobby(page); page.click('#l-fix')
        n = len(page.query_selector_all('[data-fx]'))
        for k in range(n):
            lobby(page); page.click('#l-fix'); page.query_selector_all('[data-fx]')[k].click()
            page.wait_for_selector('.match'); page.evaluate('() => { WA30.A.speed = 0 }')
            info = visible(page, '.info')
            if info: info[0].click(); page.wait_for_selector('.inspect'); page.keyboard.press('Escape')
            for j in range(40):
                if step(page) == 'over': break
        report.append({'width': width, 'fixtures': n})
        lobby(page); page.click('#l-editor'); page.wait_for_selector('.ed-grid'); page.click('[data-f=fire]')
        page.screenshot(path=f'/tmp/smoke_{width}_editor.png')
        lobby(page); page.click('#l-start'); page.wait_for_timeout(400)
        page.screenshot(path=f'/tmp/smoke_{width}_match.png', full_page=True)
        page.close()
    # artifact viewers run the page in a sandboxed frame without form submission: start a match there too
    import os
    open(os.path.join(dist, '_sandbox.html'), 'w').write('<iframe id=f sandbox="allow-scripts allow-same-origin" src="index.html" style="width:1200px;height:900px"></iframe>')
    page = br.new_page(viewport={'width': 1240, 'height': 940}); page.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    page.goto(f'http://127.0.0.1:{srv.server_port}/_sandbox.html'); fr = page.frame_locator('#f')
    fr.locator('#l-start').click(); fr.locator('.match, .mull').first.wait_for(timeout=5000)
    report.append({'sandboxed_frame_start': 'ok'}); os.remove(os.path.join(dist, '_sandbox.html'))
    br.close()
print(json.dumps(report, indent=1))
print('console errors:', len(errors)); [print(' ', e[:300]) for e in errors[:20]]
sys.exit(1 if errors else 0)
