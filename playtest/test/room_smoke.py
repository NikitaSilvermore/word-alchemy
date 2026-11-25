"""Core Duel — Room to Grow browser test. (1) A constructed fixture (labelled): deploy a seventh Thing, Study past seven,
End cleanup with select / deselect / clear / reload-cancel / confirm, then the match is played out by clicking.
(2) Freely shuffled matches through the ordinary flow (front page -> pick decks -> Play).
usage: python3 test/room_smoke.py <dist dir> [games] <fixture.json>"""
import sys, random, http.server, threading, functools, json, time
from playwright.sync_api import sync_playwright
dist = sys.argv[1]; games = int(sys.argv[2]) if len(sys.argv) > 2 else 3; SPEC = json.load(open(sys.argv[3]))
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=dist))
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/index.html'
errors = []; rnd = random.Random(35); report = []; cleanups = []
def vis(page, sel): return [e for e in page.query_selector_all(sel) if e.is_visible() and e.is_enabled()]
def step(page):
    if page.evaluate('() => { const C = WA30.A.C; return C && C.S ? C.S.over : null }') is not None: return 'over'
    for sel, name in [('#mu-keep', 'mull')]:
        b = vis(page, sel)
        if b: b[0].click(); return name
    b = vis(page, '[data-block]')
    if b: rnd.choice(b).click(); return 'block'
    if page.query_selector('#cl-go'):
        need = page.evaluate('() => WA30.A.C.state().players[WA30.A.C.human].hand.length - 7')
        bs = vis(page, '[data-clean]'); assert len(bs) == need + 7, 'every word is offered'
        bs[0].click(); vis(page, '[data-clean]')[0].click()  # select then deselect
        for b in rnd.sample(range(len(bs)), need): vis(page, '[data-clean]')[b].click()
        assert vis(page, '#cl-go'), 'confirm enabled at exactly the surplus'
        vis(page, '#cl-go')[0].click(); cleanups.append(need); return 'cleanup'
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
        ins = vis(page, '.board .info')
        if ins and r < .55:
            rnd.choice(ins).click(); page.wait_for_selector('.inspect'); page.keyboard.press('Escape'); return 'inspect'
        st = vis(page, '#a-study')
        if r < .82 and st: st[0].click(); return 'study'
        v = vis(page, '#a-vessel')
        if r < .86 and v: v[0].click(); return 'vessel'
        end[0].click(); return 'end'
    page.wait_for_timeout(100); return 'wait'
with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])

    # ---------- (1) constructed fixture ----------
    page = br.new_page(viewport={'width': 1280, 'height': 900})
    page.on('console', lambda m: m.type == 'error' and 'fonts.g' not in m.text and errors.append(m.text))
    page.on('pageerror', lambda e: errors.append('pageerror: ' + (e.stack or str(e))[:600]))
    page.goto(url); page.wait_for_selector('.corelob')
    page.evaluate('spec => { WA30.A.speed = 0; WA30.startFixture("scenario", WA30.SC.asFixture(spec)) }', SPEC); page.wait_for_selector('.match, .mull')
    if page.query_selector('#mu-keep'): page.click('#mu-keep')
    page.wait_for_selector('#a-end')
    count = lambda: page.evaluate('() => { const S = WA30.A.C.state(), h = WA30.A.C.human; return { hand: S.players[h].hand.length, field: S.things.filter(t => t.ctrl === h).length, slots: document.querySelectorAll(".row.mine .slot:not(.ground)").length, theirSlots: document.querySelectorAll(".row.theirs .slot:not(.ground)").length } }')
    c0 = count(); assert c0['slots'] == 7 and c0['theirSlots'] == 7, ('seven spaces drawn each side', c0)
    owl = page.evaluate('() => { const S = WA30.A.C.S; return S.players[0].hand.find(c => c.word === "air.owl").pid }')
    page.click(f'[data-card="{owl}"]', position={'x': 40, 'y': 60}); page.wait_for_timeout(400)
    if vis(page, '#a-confirm'): vis(page, '#a-confirm')[0].click()
    for k in range(20):
        if page.query_selector('#a-end') and vis(page, '#a-end'): break
        step(page)
    c1 = count(); assert c1['field'] == 7, ('seventh Thing deployed', c1)
    page.screenshot(path='/tmp/room_fixture_seven.png', full_page=True)
    vis(page, '#a-study')[0].click(); page.wait_for_selector('#a-end')
    c2 = count(); assert c2['hand'] == 9, ('Study past seven', c2)
    vis(page, '#a-end')[0].click(); page.wait_for_selector('#cl-go')
    txt = page.inner_text('.panel, aside, body'); assert 'discard down to 7' in txt and 'choose 2' in txt.lower() or 'choose <b>2</b>' in txt, txt[:400]
    assert not vis(page, '#cl-go'), 'confirm disabled before any choice'
    hi = vis(page, '.card.hand.hi'); assert len(hi) == 9, ('all nine words selectable in hand', len(hi))
    for i in range(3): page.locator('.hand.mine .card.hand').nth(i).click(position={'x': 40, 'y': 60})
    assert not vis(page, '#cl-go') and 'deselect 1' in page.inner_text('body'), 'three chosen: must deselect one'
    vis(page, '#cl-clear')[0].click(); assert 'choose 2 more' in page.inner_text('body')
    page.screenshot(path='/tmp/room_fixture_cleanup.png', full_page=True)
    # unconfirmed choice + reload: nothing discarded, the turn is still open
    vis(page, '[data-clean]')[0].click()
    pre = page.evaluate('() => WA30.A.C.S.players[0].grave.length')
    page.goto(url); page.wait_for_selector('.match, .corelob')
    if page.query_selector('#c-resume'): page.click('#c-resume'); page.wait_for_selector('.match')
    page.evaluate('() => { WA30.A.speed = 0 }')
    after = page.evaluate('() => ({ grave: WA30.A.C.S.players[0].grave.length, hand: WA30.A.C.S.players[0].hand.length, active: WA30.A.C.S.active, pending: !!WA30.A.C.pending })')
    assert after['grave'] == pre and after['hand'] == 9 and after['active'] == 0, ('unconfirmed cleanup cancelled by reload, turn open', after)
    vis(page, '#a-end')[0].click(); page.wait_for_selector('#cl-go'); assert 'choose 2 more' in page.inner_text('body'), 'selection not carried over'
    words = [b.inner_text() for b in vis(page, '[data-clean]')]
    vis(page, '[data-clean]')[3].click(); vis(page, '[data-clean]')[5].click(); vis(page, '#cl-go')[0].click()
    for k in range(10):
        if not page.query_selector('#cl-go'): break
        page.wait_for_timeout(100)
    st = page.evaluate('() => { const S = WA30.A.C.S; return { hand: S.players[0].hand.length, discards: S.players[0].grave.filter(g => g.reason === "discarded").map(g => g.word), active: S.active } }')
    assert st['hand'] == 7 and len(st['discards']) == 2, ('cleanup confirmed', st)
    for k in range(5000):
        s_ = step(page)
        if s_ == 'over': break
    fin = page.evaluate('() => { const S = WA30.A.C.S; return { over: S.over, round: S.round, audit: WA30.E.zoneAudit(S), cleanup: S.events.filter(e => e.type === "cleanup").length } }')
    assert fin['over'] is not None, fin
    page.click('#m-export'); rep = json.loads(page.input_value('#ex-t')); page.keyboard.press('Escape')
    open('/tmp/room_fixture_replay.json', 'w').write(json.dumps(rep, indent=1))
    page.goto(url); page.wait_for_selector('.corelob'); page.click('#c-dev'); page.click('#l-load'); page.fill('#ld-t', json.dumps(rep)); page.click('#ld-resume'); page.wait_for_selector('.match')
    assert page.evaluate('() => WA30.A.C.S.hashes.slice(-1)[0]') == rep['finalHash'], 'fixture replay hash'
    report.append({'constructed_fixture': True, 'seventh_thing': c1, 'study_to': c2['hand'], 'cleanup_discarded': st['discards'], 'reload_cancelled_unconfirmed': True, **fin, 'replay_hash_ok': True})
    page.close()
    # ---------- (2) freely shuffled matches ----------
    for width in (1280, 400):
        page = br.new_page(viewport={'width': width, 'height': 900})
        page.on('console', lambda m: m.type == 'error' and 'fonts.g' not in m.text and errors.append(m.text))
        page.on('pageerror', lambda e: errors.append('pageerror: ' + (e.stack or str(e))[:600]))
        page.goto(url); page.wait_for_selector('.corelob')
        assert 'format' not in page.inner_text('.corelob').lower() and 'journeyman' not in page.inner_text('.corelob').lower(), 'no engineering terms on the front page'
        page.screenshot(path=f'/tmp/room_{width}_lobby.png', full_page=True)
        decks = ['orchard', 'furnace', 'forge']
        assert all(page.inner_text(f'[data-pick="mine:{d}"]').lower().count('plan') for d in decks), 'deck plans visible'
        for g in range(games if width == 1280 else 1):
            page.goto(url); page.wait_for_selector('.corelob, .match')
            if page.query_selector('.match'): page.click('#m-lobby'); page.wait_for_selector('.corelob')
            page.click(f'[data-pick="mine:{decks[g % 3]}"]'); page.click(f'[data-pick="theirs:{decks[(g + 1) % 3]}"]'); page.click('#c-play')
            page.wait_for_selector('.match, .mull'); page.evaluate('() => { WA30.A.speed = 0 }')
            t0 = time.time(); kinds = {}
            for k in range(5000):
                s = step(page); kinds[s] = kinds.get(s, 0) + 1
                if s == 'over': break
                if k == 40 and g == 0: page.screenshot(path=f'/tmp/room_{width}_match.png', full_page=True)
            st = page.evaluate('() => { const C = WA30.A.C, S = C.S; return { over: S.over, round: S.round, audit: WA30.E.zoneAudit(S), study: S.events.filter(e => e.type === "study").length, cleanup: S.events.filter(e => e.type === "cleanup").length, maxField: Math.max(0, ...[0,1].map(i => S.things.filter(t => t.ctrl === i).length)), flagship: S.events.filter(e => ["pollinated","shield","naphtha","rebirth","golem-spill","shaped","cleanup-discard"].includes(e.type)).map(e => e.type), combats: S.events.filter(e => e.type === "declare" && e.act.type === "combat").length } }')
            report.append({'width': width, 'game': g, 'mine': decks[g % 3], **st, 'secs': round(time.time() - t0), 'steps': kinds})
            assert st['over'] is not None, ('game did not finish', st, kinds)
            page.screenshot(path=f'/tmp/room_{width}_end{g}.png')
            page.click('#m-export'); rep = json.loads(page.input_value('#ex-t')); page.keyboard.press('Escape')
            assert rep['format'] == 'v33_core3_room'
            page.goto(url); page.wait_for_selector('.corelob'); page.click('#c-dev'); page.click('#l-load'); page.fill('#ld-t', json.dumps(rep)); page.click('#ld-resume'); page.wait_for_selector('.match')
            assert page.evaluate('() => WA30.A.C.S.hashes.slice(-1)[0]') == rep['finalHash'], 'replay hash'
        # leave mid-match and come back: the match continues
        page.goto(url); page.wait_for_selector('.corelob, .match')
        if page.query_selector('.match'): page.click('#m-lobby'); page.wait_for_selector('.corelob')
        page.click('#c-play'); page.wait_for_selector('.match, .mull'); page.evaluate('() => { WA30.A.speed = 0 }')
        for k in range(30):
            if step(page) == 'over': break
        h = page.evaluate('() => WA30.A.C.S.hashes.slice(-1)[0]'); saved = page.evaluate('() => localStorage.getItem("wa35.last") && JSON.parse(localStorage.getItem("wa35.last")).result')
        left = page.evaluate('() => localStorage.getItem("wa35.left")')
        if saved is not None: report.append({'width': width, 'resume_after_reload': 'skipped: the match had already ended'}); page.close(); continue
        page.goto(url)
        try: page.wait_for_selector('.match, .mull', timeout=8000)
        except Exception:
            page.screenshot(path=f'/tmp/room_{width}_resumefail.png'); raise AssertionError(('no resume', saved, left, page.inner_text('body')[:300]))
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
print(json.dumps(report, indent=1)); print('human cleanups in shuffled matches:', cleanups); print('console errors:', len(errors)); [print(' ', e[:300]) for e in errors[:20]]
sys.exit(1 if errors else 0)
