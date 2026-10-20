import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { fundstellen, pruefeDatei, zaehle } from '../src/externe-fakten.mjs';

// Jede App darf höchstens so viele blockierende Fundstellen haben, wie in docs/externe-fakten-stand.json steht.
// Neue Fundstellen schlagen fehl; ein gesunkener Bestand wird gemeldet, damit der Stand nachgezogen wird.
// Gesundheit und Sicherheit (eigene Stichwortliste) zählt der Test zusätzlich. README.md, GDD.md und
// package.json blockieren nicht; sie stehen im Stand nur zur Ausweisung. Der Bestand ist Arbeit, kein Freibrief.
const WURZEL = new URL('../../../', import.meta.url);
const appsDir = new URL('apps/', WURZEL);
const stand = JSON.parse(await readFile(new URL('docs/externe-fakten-stand.json', WURZEL), 'utf8'));

const apps = (await readdir(appsDir, { withFileTypes: true })).filter((o) => o.isDirectory()).map((o) => o.name).sort();
const ist = {};
const gesundheit = {};
const alle = {};
for (const slug of apps) {
  const e = await fundstellen(fileURLToPath(new URL(`${slug}/`, appsDir)).replace(/\/$/, ''));
  const z = zaehle(e);
  if (z.blockierend) ist[slug] = z.blockierend;
  if (z.gesundheit) gesundheit[slug] = z.gesundheit;
  alle[slug] = e;
}

const summe = (o) => Object.values(o).reduce((s, n) => s + n, 0);

test('Bestand: keine neue Fundstelle, Gesundheit gesondert, Dokumentation blockiert nicht, Stand stimmig', (t) => {
  // Nutzerdateien: je App nicht mehr als im Stand. Ein gesunkener Bestand wird nur gemeldet.
  const neu = [];
  for (const [slug, n] of Object.entries(ist)) {
    const erlaubt = stand.apps[slug] ?? 0;
    if (n > erlaubt) neu.push(`${slug}: ${n} statt ${erlaubt}`);
  }
  assert.deepEqual(neu, [], `mehr Fundstellen als im Stand (docs/externe-fakten-stand.json): ${neu.join('; ')}`);
  const gesunken = Object.entries(stand.apps).filter(([slug, n]) => (ist[slug] ?? 0) < n);
  t.diagnostic(`Blockierende Fundstellen: ${summe(ist)} in ${Object.keys(ist).length} Apps (Stand: ${stand.nachherBlockierend})`);
  if (gesunken.length) t.diagnostic(`Stand nachziehen (gesunken): ${gesunken.map(([s]) => s).join(', ')}`);

  // Gesundheit und Sicherheit: eigener Zähler, derselbe Grundsatz.
  t.diagnostic(`Gesundheit und Sicherheit (blockierend): ${summe(gesundheit)} Zeilen in ${Object.keys(gesundheit).length} Apps`);
  const neuGesund = [];
  for (const [slug, n] of Object.entries(gesundheit)) {
    const erlaubt = stand.gesundheit[slug] ?? 0;
    if (n > erlaubt) neuGesund.push(`${slug}: ${n} statt ${erlaubt}`);
  }
  assert.deepEqual(neuGesund, [], `mehr Gesundheitszeilen als im Stand: ${neuGesund.join('; ')}`);

  // Dokumentation: README.md, GDD.md und package.json blockieren nicht.
  const blockiert = Object.values(alle).flat().filter((e) => e.blockierend && /(^|\/)(README\.md|GDD\.md|package\.json)$/.test(e.datei));
  assert.deepEqual(blockiert, []);
  t.diagnostic(`Dokumentation (nicht blockierend): ${summe(stand.dokumentation)} Zeilen in ${Object.keys(stand.dokumentation).length} Apps`);

  // Der Stand selbst: Summen müssen zusammenpassen.
  assert.equal(summe(stand.apps), stand.nachherBlockierend);
  assert.equal(summe(stand.dokumentation), stand.nachherDokumentation);
  assert.equal(stand.nachher, stand.nachherBlockierend + stand.nachherDokumentation);
  assert.equal(summe(stand.dateiart), stand.nachher);
  assert.equal(summe(stand.kategorien), stand.nachher);
});

test('Regeln der Prüfung an Beispielen: Ausnahmen, Belege, Kategorien', () => {
  // Nicht gezählt: inline-CSS, Kommentare, Regex-Konstanten, Variable n im Code, „Who“, druck.css, Kennungen.
  assert.deepEqual(pruefeDatei('app.mjs', [
    "const feld = el('textarea', { style: 'width:100%;min-height:4rem' });",
    '// Studie zeigt: 80 % der Kinder',
    '/**',
    ' * Studie (BZgA, 2024)',
    ' */',
    'const RE = /\\bWHO\\b/;',
    'for (let n = 1; n <= 3; n += 1) zeile(n);',
    "const id = 'rueckenlage'; const datei = 'foerder-fristen.ics';",
    "function feldStil() { return 'width:100%;padding:0.5rem'; }",
  ].join('\n')), []);
  assert.deepEqual(pruefeDatei('daten/x.json', '{"frage": "Who are you?"}'), []);
  assert.deepEqual(pruefeDatei('druck.css', 'p { width: 100%; }'), []);
  assert.deepEqual(pruefeDatei('index.html', '<!-- Studie 80 % -->\n<div style="width:100%">x</div>'), []);

  // Quelle: nur im selben Objekt belegt; ein leeres Feld belegt nicht.
  assert.deepEqual(pruefeDatei('daten/x.json', '[{"text": "Stichprobe n = 120 Kinder", "quelle": "S. 4"}]'), []);
  const nachbar = pruefeDatei('daten/x.json', '[{"text": "Stichprobe n = 120 Kinder"},\n{"quelle": "S. 4"}]');
  assert.deepEqual(nachbar.map((x) => [x.zeile, x.kategorie]), [[1, 'sonstiges']]);
  assert.equal(pruefeDatei('daten/x.json', '[{"text": "Stichprobe n = 120 Kinder", "quelle": ""}]').length, 1);
  assert.deepEqual(pruefeDatei('app.mjs', "const D = {\n  text: 'Studie zeigt X',\n  quelle: 'S. 12',\n};"), []);
  assert.deepEqual(pruefeDatei('app.mjs', "const D = {\n  text: 'Studie zeigt X',\n};\nconst E = { quelle: 'S. 2' };").map((x) => x.zeile), [2]);

  // Kategorien: Recht, Förderung, Gesundheit; Gesundheit geht vor.
  const kat = (datei, text) => pruefeDatei(datei, text).map((x) => x.kategorie);
  assert.deepEqual(kat('daten/x.json', '[{"text": "Angaben nach § 5 DDG"}]'), ['recht']);
  assert.deepEqual(kat('daten/x.json', '[{"text": "Vorsorge nach § 24a JuSchG"}]'), ['recht']);
  assert.deepEqual(kat('daten/x.json', '[{"text": "Der Jugendmedienschutz-Staatsvertrag (MStV) gilt"}]'), ['recht']);
  assert.deepEqual(kat('daten/x.json', '[{"text": "Art. 17 DSGVO verlangt Löschung"}]'), ['recht']);
  assert.deepEqual(kat('daten/x.json', '[{"hoehe": "Zuschuss bis 500 €"}]'), ['finanzierung']);
  assert.deepEqual(kat('daten/x.json', '[{"hoehe": "Förderung bis 80 %"}]'), ['finanzierung']);
  assert.deepEqual(kat('daten/x.json', '[{"text": "Im Notfall 112 anrufen."}]'), ['gesundheit']);
  assert.deepEqual(kat('daten/x.json', '[{"text": "Giftnotruf bei Vergiftung"}]'), ['gesundheit']);
  assert.deepEqual(kat('daten/x.json', '[{"text": "Kleinteile außer Reichweite"}]'), ['gesundheit']);
  assert.deepEqual(kat('daten/x.json', '[{"text": "Nach § 5 Gesetz im Notfall 112"}]'), ['gesundheit']);
  // „fördern“, „förderlich“ und „Schimpfwörter“ lösen nicht aus.
  assert.deepEqual(pruefeDatei('daten/x.json', '[{"text": "Das Spiel fördert Geduld"}]'), []);
  assert.deepEqual(pruefeDatei('daten/x.json', '[{"text": "Was ist entwicklungsförderlich?"}]'), []);
  assert.deepEqual(pruefeDatei('daten/x.json', '[{"text": "Schimpfwörter dazuschreiben"}]'), []);

  // Verneinung und Eigenentwurf-Vermerk.
  assert.deepEqual(pruefeDatei('daten/x.json', '[{"text": "Keine Studie belegt das."}]'), []);
  // Gesundheit: Verneinung entlastet nicht („nicht für Babys“ ist eine Aussage).
  assert.deepEqual(kat('daten/x.json', '[{"text": "Honig lindert Husten (aber nicht für Babys unter einem Jahr)"}]'), ['gesundheit']);
  assert.deepEqual(pruefeDatei('daten/x.json', '[{"text": "Studie 80 % (Eigenentwurf, fachlich nicht geprüft)"}]'), []);

  // HTML und Markdown: Befund mit Kategorie; README nicht blockierend.
  const [h] = pruefeDatei('index.html', '<p>Laut Studie n = 40 Kinder.</p>');
  assert.equal(h.kategorie, 'sonstiges');
  assert.equal(h.blockierend, true);
  const [m] = pruefeDatei('README.md', 'Die Studie zeigt 80 %.');
  assert.equal(m.blockierend, false);
});
