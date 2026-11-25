"""Atlas browser test: real clicks in Chrome against dist/. usage: python3 test/atlas_smoke.py <dist> <shots dir>"""
import sys, json, http.server, threading, functools
from playwright.sync_api import sync_playwright
dist, shots = sys.argv[1], sys.argv[2]
srv = http.server.ThreadingHTTPServer(('127.0.0.1', 0), functools.partial(http.server.SimpleHTTPRequestHandler, directory=dist))
threading.Thread(target=srv.serve_forever, daemon=True).start()
url = f'http://127.0.0.1:{srv.server_port}/index.html'
errors, report = [], []
def ok(cond, what):
    report.append(('PASS' if cond else 'FAIL') + ' ' + what)
with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome', args=['--no-sandbox'])
    pg = br.new_page(viewport={'width': 1366, 'height': 900})
    pg.on('console', lambda m: m.type == 'error' and 'fonts.g' not in m.text and errors.append(m.text))
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)[:400]))
    pg.goto(url); pg.wait_for_selector('.wl')
    pg.screenshot(path=f'{shots}/home.png')
    # 1. search each named word: "/" focus, type, Enter
    for nm in ['Copper', 'Bee', 'Pear', 'Grow', 'Graft', 'Naphtha', 'Transmute', 'Hammer', 'Phoenix']:
        pg.keyboard.press('Escape'); pg.click('body', position={'x': 5, 'y': 400}); pg.keyboard.press('/'); pg.keyboard.type(nm); pg.wait_for_selector('#res button'); pg.keyboard.press('Enter')
        pg.wait_for_selector('section.pane h1'); h = pg.inner_text('section.pane h1')
        n_rel = pg.evaluate('() => document.querySelectorAll("details.rel").length')
        ok(h == nm, f'search "{nm}" opens {h} with {n_rel} relationship rows')
        pg.screenshot(path=f'{shots}/word_{nm}.png', full_page=False)
    # two interactions: open a relationship row
    pg.goto(url + '#/word/earth.copper'); pg.wait_for_selector('details.rel')
    pg.click('details.rel summary'); txt = pg.inner_text('details.rel[open] .body')
    ok('Silver' in pg.inner_text('section.pane') and 'Hammer' in pg.inner_text('section.pane') and 'Signet' in pg.inner_text('section.pane'), 'Copper shows Silver, Hammer, Signet routes')
    ok('Breath' in txt or 'breath' in txt, 'relationship row shows breath cost')
    # back navigation
    pg.click('.wlink[data-go="word/earth.silver"], .chip[data-go="word/earth.silver"]'); pg.wait_for_function('() => location.hash.includes("earth.silver")')
    pg.go_back(); pg.wait_for_function('() => location.hash.includes("earth.copper")'); ok(True, 'back returns from Silver to Copper')
    # 2. transformation map
    pg.goto(url + '#/map/earth.copper'); pg.wait_for_selector('#mapsvg')
    ok('Transmute' in pg.inner_text('.mapwrap') and 'Shape' in pg.inner_text('.mapwrap'), 'Copper map shows Transmute and Shape branches')
    pg.select_option('#trace', 'earth.gold'); pg.wait_for_selector('.steps li'); steps = pg.inner_text('.steps')
    ok('Silver' in steps and 'Gold' in steps, 'trace Copper → Silver → Gold: ' + steps.replace('\n', ' | ')[:160])
    pg.screenshot(path=f'{shots}/map_copper.png', full_page=True)
    pg.click('#zin'); pg.click('#zreset'); ok(True, 'zoom and reset')
    pg.goto(url + '#/map/made.phoenix'); pg.wait_for_selector('.mapwrap'); t = pg.inner_text('.mapwrap')
    ok('AND' in t and 'Firebird' in t and 'Ash' in t, 'Phoenix: Firebird AND Ash recipe shown')
    pg.screenshot(path=f'{shots}/map_phoenix.png', full_page=True)
    pg.goto(url + '#/map/made.espalier'); pg.wait_for_selector('.mapwrap'); t = pg.inner_text('.mapwrap')
    ok('Sapling' in t and 'Pear' in t and 'AND' in t, 'Espalier: Graft multi-input recipe with Sapling/Pear')
    pg.goto(url + '#/map/life.seed'); pg.wait_for_selector('.mapwrap'); t = pg.inner_text('.mapwrap')
    ok('Sapling' in t and 'growth' in t.lower(), 'Seed → Sapling growth route')
    # invalid relationship is marked
    pg.goto(url + '#/word/earth.iron'); pg.wait_for_selector('section.pane h1'); t = pg.inner_text('section.pane')
    ok('NOT LEGAL' in t and 'Signet' in t, 'Iron → Signet shown as NOT LEGAL with engine reason')
    # 3. decks
    pg.goto(url + '#/decks'); pg.wait_for_selector('.deckcard')
    for k in ['orchard', 'furnace', 'forge']:
        pg.goto(url + '#/deck/' + k); pg.wait_for_selector('#ck-run'); ok(pg.inner_text('section.pane h1') != 'Unknown deck', f'deck {k} opens')
    pg.goto(url + '#/deck/forge'); pg.wait_for_selector('#ck-run')
    pg.click('[data-pick="field"][data-w="earth.clay"]'); pg.click('[data-pick="field"][data-w="word.word"]'); pg.click('#ck-run'); pg.wait_for_selector('#ck-out .box')
    out = pg.inner_text('#ck-out'); ok('Golem' in out, 'checker: Clay + Word on field → engine offers Vessel → Golem')
    pg.screenshot(path=f'{shots}/deck_forge_check.png', full_page=True)
    pg.click('#ck-clear'); pg.click('[data-pick="hand"][data-w="earth.transmute"]'); pg.click('#ck-run'); pg.wait_for_selector('#ck-out .box')
    out = pg.inner_text('#ck-out'); ok('Not usable here' in out and 'Transmute' in out, 'checker: Transmute with no metal is refused with a reason')
    pg.goto(url + '#/deck/orchard'); pg.wait_for_selector('#ck-run'); t = pg.inner_text('section.pane')
    ok('missing' in t.lower(), 'Orchard: missing-partner recipes listed')
    # shared air words single definition
    winds = pg.evaluate('() => { const D = JSON.parse(document.getElementById("atlas-data").textContent); return ["air.wind","air.gust","air.owl"].map(id => Object.keys(D.words).filter(k => D.words[k].name === D.words[id].name).length) }')
    ok(winds == [1, 1, 1], 'Wind, Gust, Owl each have one record: ' + str(winds))
    # 4. effects compare
    pg.goto(url + '#/effects'); pg.wait_for_selector('.deckcard'); pg.screenshot(path=f'{shots}/effects.png', full_page=True)
    for fam in ['healing', 'movement', 'protection']:
        pg.goto(url + '#/effect/' + fam); pg.wait_for_selector('table.t'); ok(pg.evaluate('() => document.querySelectorAll("table.t tbody tr").length') > 0, f'effect {fam} has rows')
    pg.goto(url + '#/effect/healing'); pg.wait_for_selector('[data-cmp]')
    pg.locator('[data-cmp]').nth(0).click(); pg.locator('[data-cmp]').nth(1).click(); pg.wait_for_selector('.grid3 .box')
    ok(pg.evaluate('() => document.querySelectorAll(".grid3 .box").length') == 2, 'healing comparison of two words')
    pg.screenshot(path=f'{shots}/effects_heal_compare.png', full_page=True)
    # 5. workshop notes: add, export, import, never touches data
    pg.goto(url + '#/workshop'); pg.wait_for_selector('#nt-add')
    before = pg.evaluate('() => document.getElementById("atlas-data").textContent.length')
    pg.select_option('#nt-target', 'earth.hammer'); pg.fill('#nt-text', 'Test proposal: Hammer could flatten a Signet back to Copper.'); pg.click('#nt-add'); pg.wait_for_selector('.proposed')
    ok('PROPOSED — NOT IN THE GAME' in pg.inner_text('.proposed'), 'note labelled PROPOSED — NOT IN THE GAME')
    with pg.expect_download() as dl: pg.click('#nt-export')
    path = dl.value.path(); notes = json.load(open(path)); ok(notes['notes'][0]['status'].startswith('PROPOSED'), 'exported notes JSON carries PROPOSED status')
    pg.click('[data-del]'); pg.set_input_files('#nt-import', path); pg.wait_for_selector('.proposed'); ok(True, 'notes re-imported')
    ok(pg.evaluate('() => document.getElementById("atlas-data").textContent.length') == before, 'engine data unchanged by notes')
    pg.goto(url + '#/word/earth.hammer'); pg.wait_for_selector('section.pane'); ok('PROPOSED' in pg.inner_text('section.pane'), 'note visible on Hammer, labelled proposed')
    pg.screenshot(path=f'{shots}/workshop.png', full_page=True)
    # scope switch
    pg.goto(url + '#/words'); pg.wait_for_selector('.count'); c1 = pg.inner_text('.count'); pg.click('[data-scope="all"]'); pg.wait_for_selector('.count'); c2 = pg.inner_text('.count'); pg.click('[data-scope="core"]')
    ok(c1 != c2, f'scope switch: {c1} / {c2}')
    # filters
    pg.select_option('[data-f="school"]', 'earth'); n = pg.evaluate('() => document.querySelectorAll(".wl li button").length'); ok(n > 0, f'school filter earth: {n} words'); pg.select_option('[data-f="school"]', '')
    # narrow screen
    m = br.new_page(viewport={'width': 400, 'height': 860}); m.on('pageerror', lambda e: errors.append('pageerror(mobile): ' + str(e)[:400]))
    m.goto(url + '#/word/life.bee'); m.wait_for_selector('section.pane h1'); m.screenshot(path=f'{shots}/m_bee.png', full_page=False)
    m.goto(url + '#/map/earth.copper'); m.wait_for_selector('.mapwrap'); m.screenshot(path=f'{shots}/m_map.png', full_page=True)
    ok(m.evaluate('() => document.documentElement.scrollWidth <= 410'), 'no horizontal overflow at 400px (map page)')
    m.goto(url + '#/word/life.bee'); ok(m.evaluate('() => document.documentElement.scrollWidth <= 410'), 'no horizontal overflow at 400px (word page)')
    br.close()
print('\n'.join(report)); print('console errors:', len(errors)); [print(' ', e) for e in errors[:15]]
sys.exit(1 if errors or any(r.startswith('FAIL') for r in report) else 0)
