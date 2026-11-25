"""V33 Core Duel browser test: the ordinary flow only (front page -> pick decks -> Play), whole matches by clicking.
usage: python3 test/core_smoke.py <dist dir> [games]"""
import sys, random, http.server, threading, functools, json, time
from playwright.sync_api import sync_playwright
dist = sys.argv[1]; games = int(sys.argv[2]) if len(sys.argv) > 2 else 3
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=dist))
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/index.html'
errors = []; rnd = random.Random(33); report = []
def vis(page, sel): return [e for e in page.query_selector_all(sel) if e.is_visible() and e.is_enabled()]
def step(page):
    if page.evaluate('() => { const C = WA30.A.C; return C && C.S ? C.S.over : null }') is not None: return 'over'
    for sel, name in [('#mu-keep', 'mull')]:
        b = vis(page, sel)
        if b: b[0].click(); return name
    b = vis(page, '[data-block]')
    if b: rnd.choice(b).click(); return 'block'
    b = vis(page, '[data-decide]')
    if b: rnd.choice(b).click(); return 'decide'
    if vis(page, '#c-all'):
        if rnd.random() < .7: vis(page, '#c-all')[0].click()
        else:
            ch = vis(page, '[data-atk]')
            if ch: rnd.choice(ch).click()
        b = vis(page, '#c-go')
        if b: b[0].click(); return 'attack'
        vis(page, '#a-cancel')[0].click(); return 'cancel'
    b = vis(page, '#a-confirm')
    if b: b[0].click(); return 'confirm'
    b = vis(page, '[data-choose]')
    if b: rnd.choice(b).click(); return 'choose'
    b = vis(page, '[data-respond]')
    if b: (b[-1] if rnd.random() < .5 else rnd.choice(b)).click(); return 'respond'
    if vis(page, '#a-cancel'):
        vis(page, '#a-cancel')[0].click(); return 'cancel'
    end = vis(page, '#a-end')
    if end:
        r = rnd.random(); hand = vis(page, '.card.hand.hi')
        if r < .5 and hand: hand[rnd.randrange(len(hand))].click(position={'x': 40, 'y': 60}); return 'hand'
        at = vis(page, '#a-attack')
        if r < .75 and at: at[0].click(); return 'attack-open'
        st = vis(page, '#a-study')
        if r < .82 and st: st[0].click(); return 'study'
        v = vis(page, '#a-vessel')
        if r < .86 and v: v[0].click(); return 'vessel'
        end[0].click(); return 'end'
    page.wait_for_timeout(100); return 'wait'
with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    for width in (1280, 400):
        page = br.new_page(viewport={'width': width, 'height': 900})
        page.on('console', lambda m: m.type == 'error' and 'fonts.g' not in m.text and errors.append(m.text))
        page.on('pageerror', lambda e: errors.append('pageerror: ' + (e.stack or str(e))[:600]))
        page.goto(url); page.wait_for_selector('.corelob')
        assert 'format' not in page.inner_text('.corelob').lower() and 'journeyman' not in page.inner_text('.corelob').lower(), 'no engineering terms on the front page'
        page.screenshot(path=f'/tmp/core_{width}_lobby.png', full_page=True)
        decks = ['orchard', 'furnace', 'forge']
        for g in range(games if width == 1280 else 1):
            page.goto(url); page.wait_for_selector('.corelob, .match')
            if page.query_selector('.match'): page.click('#m-lobby'); page.wait_for_selector('.corelob')
            page.click(f'[data-pick="mine:{decks[g % 3]}"]'); page.click(f'[data-pick="theirs:{decks[(g + 1) % 3]}"]'); page.click('#c-play')
            page.wait_for_selector('.match, .mull'); page.evaluate('() => { WA30.A.speed = 0 }')
            t0 = time.time(); kinds = {}
            for k in range(5000):
                s = step(page); kinds[s] = kinds.get(s, 0) + 1
                if s == 'over': break
                if k == 40 and g == 0: page.screenshot(path=f'/tmp/core_{width}_match.png', full_page=True)
            st = page.evaluate('() => { const C = WA30.A.C, S = C.S; return { over: S.over, round: S.round, audit: WA30.E.zoneAudit(S), study: S.events.filter(e => e.type === "study").length, combats: S.events.filter(e => e.type === "declare" && e.act.type === "combat").length } }')
            report.append({'width': width, 'game': g, 'mine': decks[g % 3], **st, 'secs': round(time.time() - t0), 'steps': kinds})
            assert st['over'] is not None, ('game did not finish', st, kinds)
            page.screenshot(path=f'/tmp/core_{width}_end{g}.png')
            page.click('#m-export'); rep = json.loads(page.input_value('#ex-t')); page.keyboard.press('Escape')
            assert rep['format'] == 'v33_core'
            page.goto(url); page.wait_for_selector('.corelob'); page.click('#c-dev'); page.click('#l-load'); page.fill('#ld-t', json.dumps(rep)); page.click('#ld-resume'); page.wait_for_selector('.match')
            assert page.evaluate('() => WA30.A.C.S.hashes.slice(-1)[0]') == rep['finalHash'], 'replay hash'
        # leave mid-match and come back: the match continues
        page.goto(url); page.wait_for_selector('.corelob, .match')
        if page.query_selector('.match'): page.click('#m-lobby'); page.wait_for_selector('.corelob')
        page.click('#c-play'); page.wait_for_selector('.match, .mull'); page.evaluate('() => { WA30.A.speed = 0 }')
        for k in range(30):
            if step(page) == 'over': break
        h = page.evaluate('() => WA30.A.C.S.hashes.slice(-1)[0]'); saved = page.evaluate('() => localStorage.getItem("wa33.last") && JSON.parse(localStorage.getItem("wa33.last")).result')
        left = page.evaluate('() => localStorage.getItem("wa33.left")')
        if saved is not None: report.append({'width': width, 'resume_after_reload': 'skipped: the match had already ended'}); page.close(); continue
        page.goto(url)
        try: page.wait_for_selector('.match, .mull', timeout=8000)
        except Exception:
            page.screenshot(path=f'/tmp/core_{width}_resumefail.png'); raise AssertionError(('no resume', saved, left, page.inner_text('body')[:300]))
        ok = page.evaluate('h => WA30.A.C.S.hashes.includes(h)', h)
        report.append({'width': width, 'resume_after_reload': ok}); assert ok, 'leaving and returning lost the match'
        page.close()
    import os
    open(os.path.join(dist, '_sandbox.html'), 'w').write('<iframe id=f sandbox="allow-scripts allow-same-origin" src="index.html" style="width:1200px;height:900px"></iframe>')
    page = br.new_page(viewport={'width': 1240, 'height': 940}); page.on('pageerror', lambda e: errors.append('pageerror: ' + (e.stack or str(e))[:600]))
    page.goto(f'http://127.0.0.1:{srv.server_port}/_sandbox.html'); fr = page.frame_locator('#f')
    fr.locator('#c-play, #m-lobby').first.wait_for(timeout=5000)
    report.append({'sandboxed_frame': 'ok'}); os.remove(os.path.join(dist, '_sandbox.html'))
    br.close()
print(json.dumps(report, indent=1)); print('console errors:', len(errors)); [print(' ', e[:300]) for e in errors[:20]]
sys.exit(1 if errors else 0)
