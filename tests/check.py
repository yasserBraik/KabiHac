"""Smoke and accessibility checks for both editions of the Gazette.
Usage: python3 tests/check.py [index.html|ar.html ...]"""
import sys, re
from playwright.sync_api import sync_playwright

import os, pathlib
HERE = pathlib.Path(__file__).resolve().parent.parent
AXE = open(os.environ.get('AXE_PATH', 'node_modules/axe-core/axe.min.js')).read()  # npm i axe-core
ROOT = HERE.as_uri() + '/'

def run(page_name, b, vp):
    pg = b.new_page(viewport=vp, reduced_motion='reduce'); errs = []
    pg.on('pageerror', lambda e: errs.append('pageerror: ' + str(e)))
    pg.on('requestfailed', lambda r: errs.append('failed: ' + r.url.split('/')[-1] + ' ' + str(r.failure)) if r.url.startswith('file') else None)
    pg.goto(ROOT + page_name); pg.wait_for_timeout(1200)
    res = {'errors': errs}
    res['overflow'] = pg.evaluate('document.documentElement.scrollWidth-innerWidth')
    pg.add_script_tag(content=AXE)
    res['axe'] = pg.evaluate("axe.run(document,{preload:false,runOnly:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}).then(r=>r.violations.map(v=>v.id+' '+v.nodes.slice(0,2).map(n=>n.target.join(' ')).join(' | ')))")
    # every section rendered its data
    res['rendered'] = pg.evaluate("['#numbers dt','#run a','#biz article','#ventures article','#feat-grid .feat','#ads .ad','#patents li','#pubs li','#talks li','#roll li','#notices .notice'].map(s=>s+':'+document.querySelectorAll(s).length).join(' ')")
    # reader: opens, focus moves in, Escape closes and returns focus
    pg.locator('[data-open="2"]').first.click(); pg.wait_for_timeout(500)
    res['reader_focus'] = pg.evaluate("document.getElementById('reader').contains(document.activeElement)")
    res['reader_axe'] = pg.evaluate("axe.run(document.getElementById('reader'),{preload:false,runOnly:['wcag2a','wcag2aa']}).then(r=>r.violations.map(v=>v.id))")
    pg.keyboard.press('Escape'); pg.wait_for_timeout(300)
    res['reader_closed'] = not pg.evaluate("document.getElementById('reader').classList.contains('open')")
    # filters
    pg.locator('#class-tools button').nth(1).click()
    res['skills_filter'] = pg.evaluate("document.querySelectorAll('.ad[data-l]:not(.hide)').length")
    pg.locator('#cert-filters button').nth(4).click()
    res['cert_filter'] = pg.evaluate("[...document.querySelectorAll('.notice')].filter(n=>!n.classList.contains('hide')).length")
    # letter form: empty submit flags errors, valid submit seals the letter
    pg.locator('#letter [type=submit]').click(); pg.wait_for_timeout(200)
    res['form_errors'] = pg.evaluate("[...document.querySelectorAll('#letter .err')].filter(e=>e.textContent).length")
    pg.fill('#l-name', 'Sam Recruiter'); pg.fill('#l-email', 'sam@company.com')
    pg.select_option('#l-topic', index=1); pg.fill('#l-msg', 'We would like to talk about a principal engineering role in Riyadh.')
    pg.locator('#letter [type=submit]').click(); pg.wait_for_timeout(300)
    res['letter_sealed'] = pg.evaluate("document.getElementById('sealed').classList.contains('show') && document.getElementById('sealed-mail').href.startsWith('mailto:')")
    pg.close()
    return res

with sync_playwright() as p:
    b = p.chromium.launch(executable_path=os.environ.get('CHROME_PATH') or None)
    for name in (sys.argv[1:] or ['index.html']):
        for vp in ({'width': 1440, 'height': 900}, {'width': 390, 'height': 844}):
            print(name, vp['width'], run(name, b, vp))
    b.close()
