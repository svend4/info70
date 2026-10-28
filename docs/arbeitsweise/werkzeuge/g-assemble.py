#!/usr/bin/env python3 -I
# Baut die Listen zu Strang Г aus den Vorschlägen der Schreiber und den Korrekturen der Gegenprobe.
# Aufruf: python3 -I g-assemble.py <ausgabeordner>   (liest das Journal des Laufs)
import json, sys, collections, re, os
# S: Ordner mit g-liste-schreiber.json; J: Journal des Laufs (Umgebungsvariablen SCRATCH und JOURNAL).
S = os.environ.get('SCRATCH', '.').rstrip('/') + '/'
J = os.environ.get('JOURNAL', 'journal.jsonl')
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
vorschlaege = json.load(open(S + 'g-liste-schreiber.json', encoding='utf8'))
started = {}; korr = {}; geprueft = {}
for l in open(J, encoding='utf8'):
    o = json.loads(l)
    if o['type'] == 'started': started[o['agentId']] = o['label']
    elif o['type'] == 'result':
        lab = started.get(o['agentId'], '')
        if lab.startswith('gegenprobe:'):
            r = o['result']
            geprueft[int(lab.split(':')[1])] = r.get('geprueft')
            for k in r.get('korrekturen', []): korr[(k['app'], k['datei'], k['zeile'])] = (int(lab.split(':')[1]), k)
nkorr = 0
for v in vorschlaege:
    k = korr.get((v['app'], v['datei'], v['zeile']))
    v['korrigiert'] = False
    if k:
        paket, c = k
        v['ursprung'] = {'handlung': v['handlung'], 'quelle_vorschlag': v['quelle_vorschlag'], 'neuer_text': v['neuer_text']}
        v['korrigiert'] = True; nkorr += 1
        alt = v['handlung']; v['handlung'] = c['neue_handlung']
        if c['neue_quelle']: v['quelle_vorschlag'] = c['neue_quelle']
        elif c['neue_handlung'] in ('eigenentwurf', 'streichen', 'fehlalarm'): v['quelle_vorschlag'] = ''
        v['neuer_text'] = ''  # der Wortlaut des Schreibers passt nicht mehr zur korrigierten Quelle; er wird nach dem „да“ neu gebildet
        v['grund'] = (v['grund'] + ' Gegenprobe: ' + c['grund']).strip()
json.dump(vorschlaege, open(out + '/externe-fakten-vorschlaege.json', 'w', encoding='utf8'), ensure_ascii=False, indent=1)

NAMEN = {'quelle': 'Quelle ergänzen', 'maschinell': 'Quelle und Vermerk „maschinell nachgelesen“', 'eigenentwurf': 'Vermerk „Eigenentwurf, fachlich nicht geprüft“', 'streichen': 'Streichen', 'fehlalarm': 'Fehlalarm, nichts ändern'}
def esc(s, n=None):
    s = (s or '').replace('\n', ' ').replace('|', '\\|').replace('`', "'")
    s = re.sub(r'\s+', ' ', s).strip()
    if n and len(s) > n: s = s[:n - 1] + '…'
    return s
def liste(titel, kats, datei, einleitung):
    zeilen = [v for v in vorschlaege if v['kategorie'] in kats]
    z = collections.Counter(v['handlung'] for v in zeilen)
    apps = sorted({v['app'] for v in zeilen})
    L = [f'# {titel}', '', einleitung, '',
         f'**{len(zeilen)} Zeilen in {len(apps)} Apps.** Vorschläge je Handlung: ' + ', '.join(f'{NAMEN[h]} {z[h]}' for h in NAMEN if z[h]) + '.', '',
         'Befunde, die über fehlende Fundstellen hinausgehen (falsche oder unsichere Aussagen), sind in `docs/externe-fakten-befunde.md` gesammelt. Die Liste ändert nichts am Repo. Jede Zeile hat genau einen Vorschlag; Änderungen und Streichungen geschehen erst nach dem „да“ von Max (je Liste oder je App). Den vollen Wortlaut aller Vorschläge enthält `docs/externe-fakten-vorschlaege.json` (Feld `neuer_text`).', '',
         '| Handlung | Bedeutung |', '|---|---|',
         '| Quelle ergänzen | die Aussage ist belegbar; die Fundstelle steht in der Spalte „Quelle / Neuer Text“ |',
         '| Quelle und Vermerk | die Norm wurde gegen den Wortlaut nachgelesen; Quelle plus vorgeschlagener Vermerk „Wortlaut maschinell nachgelesen, nicht durch Menschen geprüft“ |',
         '| Vermerk Eigenentwurf | eigener, fachlich nicht geprüfter Text; „(Eigenentwurf, fachlich nicht geprüft)“ wird angehängt, der Inhalt bleibt |',
         '| Streichen | die Zeile trägt nichts, was die App braucht, und ist nicht zu belegen |',
         '| Fehlalarm | der Zähler irrt (andere Bedeutung, Verneinung, Prüfmuster); die Zeile bleibt, der Zähler wird angepasst |', '']
    for app in apps:
        zs = [v for v in zeilen if v['app'] == app]
        L += [f'## {app} ({len(zs)})', '', '| Zeile | Text | Vorschlag | Quelle / Neuer Text | Begründung |', '|---|---|---|---|---|']
        for v in zs:
            q = esc(v['neuer_text'], 260) if v['neuer_text'] else esc(v['quelle_vorschlag'], 260)
            gr = esc(v['grund'], 260) + (f' **Hinweis:** {esc(v["hinweis"], 200)}' if v['hinweis'] else '') + (' *(durch die Gegenprobe geändert)*' if v['korrigiert'] else '')
            L.append(f"| `{v['datei']}:{v['zeile']}` | {esc(v['text'], 150)} | {NAMEN[v['handlung']]} | {q} | {gr} |")
        L.append('')
    open(out + '/' + datei, 'w', encoding='utf8').write('\n'.join(L))
    return len(zeilen), len(apps), z
r1 = liste('Externe Fakten, Liste 1: Recht und Geld', ('recht', 'finanzierung'), 'externe-fakten-liste-1-recht-geld.md',
           'Stand 27.10.2026, Strang Г (Entscheidung Max 12а): Zeilen in Nutzerdateien der Apps (HTML, MJS, daten/*.json), die der Zähler externer Fakten als Aussage über Recht oder Förderung ohne Fundstelle und ohne Vermerk zählt (`packages/kinderschutz/src/externe-fakten.mjs`). Reihenfolge: zuerst Recht und Geld, danach Gesundheit (Liste 2).')
r2 = liste('Externe Fakten, Liste 2: Gesundheit', ('gesundheit',), 'externe-fakten-liste-2-gesundheit.md',
           'Stand 27.10.2026, Strang Г (Entscheidungen Max 12а, 13а): Aussagen zu Gesundheit und Entwicklung ohne Fundstelle. Für diese Zeilen gilt: „(Eigenentwurf, fachlich nicht geprüft)“ anhängen, der Inhalt geht nicht verloren (13а); Streichen nur nach dem „да“ von Max für die einzelne Zeile. spielzeug-check-u3 behält 54 % und 95 % mit dem Vermerk (14в), familien-notfall-fahrplan behält den Hinweis auf § 164 TKG (15а).')
r3 = liste('Externe Fakten, Liste 3: Sonstiges', ('sonstiges',), 'externe-fakten-liste-3-sonstiges.md',
           'Stand 27.10.2026, Strang Г: Normen (DIN, EN, ISO), Verbände und Studien ohne Fundstelle.')
print('Korrekturen angewendet:', nkorr, '| Gegenprobe geprüft je Paket:', geprueft)
print('Liste 1', r1[:2], dict(r1[2])); print('Liste 2', r2[:2], dict(r2[2])); print('Liste 3', r3[:2], dict(r3[2]))
