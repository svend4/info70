import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { BEREICHE, MONATE, HERKUNFT, FESTE_QUELLE, FEST_SEITE, FESTE_VORSCHLAEGE, KENNZEICHNUNG_VORSCHLAG, TITEL_MAX, SCHLUESSEL, leererStand, pruefeStueck, fuegeStueckHinzu, entferneStueck, umschalteHaken, istHaken, zaehleProMonat, zaehlWort, normalisiereStand, ladeStand, druckGliederung, sortiereStuecke, naechsteId, gespeicherterStand } from '../logik.mjs';

const dateiText = (name) => readFile(new URL(`../${name}`, import.meta.url), 'utf8');
const gutes = { titel: 'Herbstlied', bereich: 'singen', monat: 10, herkunft: 'eigenes-lied' };

test('die fünf Bereiche stehen in der Reihenfolge der Quelle mit ihren Seitenspannen', () => {
  assert.deepEqual(BEREICHE.map((b) => b.id), ['hoeren', 'singen', 'rhythmus', 'instrumente', 'alltag']);
  assert.deepEqual(BEREICHE.map((b) => b.seiten), ['160–162', '162–165', '166–170', '170–172', '172–174']);
});

test('die Überschriften der Bereiche stimmen wörtlich mit der Quelle überein', () => {
  assert.deepEqual(BEREICHE.map((b) => b.quelle), [
    'Слушание музыки',
    'Пение',
    'Музыкально-ритмическая деятельность',
    'Обучение элементам нотной грамоты, игре на музыкальных инструментах',
    'Музыка в повседневной жизни',
  ]);
});

test('alle Seitenspannen liegen auf S. 160 bis 174 und laufen vorwärts', () => {
  for (const b of BEREICHE) {
    const [von, bis] = b.seiten.split('–').map(Number);
    assert.ok(von >= 160 && bis <= 174 && von < bis, `${b.name}: ${b.seiten}`);
  }
});

test('die Festbeispiele sind die fünf aus S. 174, wörtlich', () => {
  assert.equal(FEST_SEITE, 174);
  assert.deepEqual(FESTE_QUELLE.map((f) => f.name), [
    'Новый год', 'Мамин день — 8 Марта', 'Осень золотая', 'Праздник урожая', 'Весна-красна',
  ]);
});

test('Festvorschläge sind als Vorschlag gekennzeichnet und tragen keine Quellenseite', () => {
  assert.ok(FESTE_VORSCHLAEGE.length > 0);
  assert.equal(KENNZEICHNUNG_VORSCHLAG, 'Vorschlag, nicht aus der Quelle');
  for (const v of FESTE_VORSCHLAEGE) assert.ok(!/S\.\s*\d/.test(v), v);
});

test('die vier Herkunftsoptionen sind die festen Texte', () => {
  assert.deepEqual(HERKUNFT.map((h) => h.text), [
    'eigenes Lied',
    'Volkslied, Fachkraft prüft die Gemeinfreiheit',
    'lizenziert, Fachkraft prüft',
    'andere Herkunft, Fachkraft notiert',
  ]);
});

test('keine Herkunftsoption behauptet, ein Werk sei gemeinfrei', () => {
  for (const h of HERKUNFT) {
    if (/gemeinfrei/i.test(h.text)) assert.match(h.text, /prüft/, h.text);
  }
});

test('pruefeStueck nimmt ein vollständiges Stück an und trimmt den Titel', () => {
  const r = pruefeStueck({ ...gutes, titel: '  Herbstlied  ' });
  assert.equal(r.ok, true);
  assert.deepEqual(r.stueck, gutes);
});

test('pruefeStueck verlangt einen Titel und begrenzt seine Länge', () => {
  assert.equal(pruefeStueck({ ...gutes, titel: '   ' }).ok, false);
  assert.equal(pruefeStueck({ ...gutes, titel: 'x'.repeat(TITEL_MAX + 1) }).ok, false);
  assert.equal(pruefeStueck({ ...gutes, titel: 'x'.repeat(TITEL_MAX) }).ok, true);
});

test('pruefeStueck nimmt nur feste Bereiche und Herkunftsoptionen an', () => {
  assert.equal(pruefeStueck({ ...gutes, bereich: 'tanz' }).ok, false);
  assert.equal(pruefeStueck({ ...gutes, herkunft: 'frei' }).ok, false);
});

test('pruefeStueck nimmt Monate nur als ganze Zahl von 1 bis 12', () => {
  for (const monat of [0, 13, 2.5, '10']) {
    assert.equal(pruefeStueck({ ...gutes, monat }).ok, false, String(monat));
  }
  assert.equal(pruefeStueck({ ...gutes, monat: 1 }).ok, true);
  assert.equal(pruefeStueck({ ...gutes, monat: 12 }).ok, true);
});

test('pruefeStueck meldet alle Fehler auf einmal', () => {
  const r = pruefeStueck({});
  assert.equal(r.ok, false);
  assert.equal(r.fehler.length, 4);
});

test('naechsteId ist die größte Nummer plus eins, bei leerer Liste eins', () => {
  assert.equal(naechsteId([]), 1);
  assert.equal(naechsteId([{ id: 4 }, { id: 2 }]), 5);
});

test('fuegeStueckHinzu vergibt fortlaufende Nummern, ohne den alten Stand zu ändern', () => {
  const a = leererStand();
  const b = fuegeStueckHinzu(a, gutes).stand;
  const c = fuegeStueckHinzu(b, { ...gutes, titel: 'Zweites' }).stand;
  assert.deepEqual(a.stuecke, []);
  assert.deepEqual(c.stuecke.map((s) => s.id), [1, 2]);
});

test('fuegeStueckHinzu gibt bei Fehlern den Stand unverändert zurück', () => {
  const a = leererStand();
  const r = fuegeStueckHinzu(a, { ...gutes, titel: '' });
  assert.equal(r.stand, a);
  assert.ok(r.fehler.length > 0);
});

test('entferneStueck entfernt genau das eine Stück und lässt den alten Stand stehen', () => {
  const s = fuegeStueckHinzu(fuegeStueckHinzu(leererStand(), gutes).stand, { ...gutes, titel: 'Zwei' }).stand;
  const r = entferneStueck(s, 1);
  assert.deepEqual(r.stuecke.map((x) => x.titel), ['Zwei']);
  assert.equal(s.stuecke.length, 2);
});

test('umschalteHaken setzt und löst das Häkchen eines Monats und Bereichs', () => {
  const a = leererStand();
  const b = umschalteHaken(a, 3, 'hoeren');
  assert.equal(istHaken(b, 3, 'hoeren'), true);
  assert.equal(istHaken(b, 4, 'hoeren'), false);
  const c = umschalteHaken(b, 3, 'hoeren');
  assert.equal(istHaken(c, 3, 'hoeren'), false);
  assert.deepEqual(c.haken, {});
  assert.deepEqual(a.haken, {});
});

test('umschalteHaken ignoriert ungültige Monate und Bereiche', () => {
  const a = leererStand();
  assert.equal(umschalteHaken(a, 13, 'hoeren'), a);
  assert.equal(umschalteHaken(a, 3, 'tanz'), a);
});

test('zaehleProMonat zählt je Monat, Januar ist Platz eins, Oktober Platz zehn', () => {
  let s = leererStand();
  s = fuegeStueckHinzu(s, { ...gutes, monat: 10 }).stand;
  s = fuegeStueckHinzu(s, { ...gutes, monat: 10, titel: 'Zweites' }).stand;
  s = fuegeStueckHinzu(s, { ...gutes, monat: 1 }).stand;
  const z = zaehleProMonat(s);
  assert.equal(z.length, 12);
  assert.equal(MONATE[9], 'Oktober');
  assert.equal(z[0], 1);
  assert.equal(z[9], 2);
  assert.equal(z[1], 0);
});

test('zaehlWort schreibt ein Stück im Singular und sonst im Plural', () => {
  assert.equal(zaehlWort(0), '0 Stücke');
  assert.equal(zaehlWort(1), '1 Stück');
  assert.equal(zaehlWort(3), '3 Stücke');
});

test('sortiereStuecke ordnet nach Monat, dann Bereich, dann Titel', () => {
  const s = [
    { id: 1, titel: 'B', bereich: 'singen', monat: 2, herkunft: 'eigenes-lied' },
    { id: 2, titel: 'A', bereich: 'hoeren', monat: 2, herkunft: 'eigenes-lied' },
    { id: 3, titel: 'C', bereich: 'hoeren', monat: 1, herkunft: 'eigenes-lied' },
  ];
  assert.deepEqual(sortiereStuecke(s).map((x) => x.id), [3, 2, 1]);
  assert.deepEqual(s.map((x) => x.id), [1, 2, 3], 'Original bleibt unverändert');
});

test('normalisiereStand verwirft fremde Felder und ungültige Stücke', () => {
  const roh = {
    stuecke: [
      { id: 1, ...gutes },
      { id: 2, ...gutes, kind: 'Mia' },
      { id: 3, ...gutes, monat: 14 },
      { id: 4, ...gutes, name: 'Mia' },
      'kein Objekt',
    ],
    haken: {},
    kind: 'Mia',
  };
  const s = normalisiereStand(roh);
  assert.deepEqual(s.stuecke, [{ id: 1, ...gutes }]);
  assert.deepEqual(Object.keys(s).sort(), ['haken', 'stuecke']);
});

test('normalisiereStand verwirft doppelte Nummern und unbekannte Häkchen', () => {
  const roh = {
    stuecke: [{ id: 1, ...gutes }, { id: 1, ...gutes, titel: 'Doppelt' }],
    haken: { '3:hoeren': true, '3:tanz': true, '13:hoeren': true, '4:singen': 'ja', x: true },
  };
  const s = normalisiereStand(roh);
  assert.equal(s.stuecke.length, 1);
  assert.deepEqual(s.haken, { '3:hoeren': true });
});

test('ladeStand ergibt bei fehlendem oder kaputtem Text den leeren Stand, ohne Absturz', () => {
  assert.deepEqual(ladeStand(null), leererStand());
  assert.deepEqual(ladeStand('{kaputt'), leererStand());
  assert.deepEqual(ladeStand('[1,2]'), leererStand());
});

test('ladeStand liest zurück, was normalisiert gespeichert wurde', () => {
  const s = fuegeStueckHinzu(umschalteHaken(leererStand(), 5, 'singen'), gutes).stand;
  assert.deepEqual(ladeStand(JSON.stringify(s)), s);
});

test('druckGliederung hat zwölf Monate mit je fünf Bereichen und ohne Zählung', () => {
  const g = druckGliederung();
  assert.equal(g.length, 12);
  assert.equal(g[9].name, 'Oktober');
  for (const m of g) assert.equal(m.bereiche.length, 5);
  assert.ok(!JSON.stringify(g).includes('Stück'), 'Zählung im Druckbogen');
});

test('der Druckbogen trägt weder Kästchen noch Häkchen noch Namenszeile', async () => {
  const text = JSON.stringify(druckGliederung());
  assert.ok(!/[☐☒☑✓✔]/.test(text), 'Kästchen oder Häkchen in der Gliederung');
  assert.ok(!/Name\s*:/.test(text), 'Namenszeile in der Gliederung');
  const css = await dateiText('druck.css');
  assert.ok(!/[☐☒☑✓✔]/.test(css), 'Kästchen oder Häkchen in druck.css');
});

test('druck.css blendet den Bildschirm im Druck aus und zeigt den Bogen', async () => {
  const css = await dateiText('druck.css');
  assert.match(css, /@media\s+print/);
  assert.match(css, /\.mjp-nur-bildschirm\s*\{\s*display:\s*none\s*!important/);
  assert.match(css, /\.mjp-nur-druck\s*\{\s*display:\s*block\s*!important/);
});

test('der Quelltext der App enthält keine Netzadresse', async () => {
  for (const datei of ['app.mjs', 'logik.mjs', 'index.html', 'druck.css']) {
    assert.ok(!/https?:\/\//.test(await dateiText(datei)), `Netzadresse in ${datei}`);
  }
});

test('der Quelltext nennt keine Gesamtzahl der Quelle', async () => {
  // Keine Zahl nach „über“: so beginnt jede Gesamtangabe der Quelle.
  for (const datei of ['app.mjs', 'logik.mjs', 'index.html']) {
    const t = await dateiText(datei);
    assert.ok(!/über\s+\d/.test(t), `Gesamtangabe in ${datei}`);
  }
});

test('app.mjs nutzt Netzwächter, Daten-Karte, Umschalter mit aria-pressed und den Druckknopf', async () => {
  const app = await dateiText('app.mjs');
  assert.match(app, /installiereNetzwerkWaechter\(\);/);
  assert.match(app, /datenKarte\(\{/);
  assert.match(app, /'aria-pressed'/);
  assert.match(app, /window\.print\(\)/);
});

test('index.html hat die Pflichtteile der Vorlage: lang, CSP, Stylesheets, Skript, Hauptbereich', async () => {
  const html = await dateiText('index.html');
  assert.match(html, /<html lang="de">/);
  assert.match(html, /default-src 'self'; style-src 'self' 'unsafe-inline'/);
  assert.match(html, /href="\.\.\/\.\.\/packages\/kinder-ui\/css\/kinder\.css"/);
  assert.match(html, /href="druck\.css"/);
  assert.match(html, /<script type="module" src="app\.mjs">/);
  assert.match(html, /<main class="k-app" id="app" aria-live="polite">/);
});

test('der Speicherschlüssel sieht nicht nach personenbezogenen Daten aus', () => {
  assert.ok(!/name|mail|geburt|adresse|telefon|foto|standort|gps/i.test(SCHLUESSEL));
});

test('gespeicherterStand gibt nie Titel in den Speicher, nur die Häkchen', () => {
  const stand = { stuecke: [{ id: 1, titel: 'Mia – Abschiedslied', bereich: 'hoeren', monat: 3, herkunft: 'eigenes Lied' }], haken: { '3:hoeren': true } };
  const gespeichert = gespeicherterStand(stand);
  assert.deepEqual(gespeichert.stuecke, []);
  assert.deepEqual(gespeichert.haken, { '3:hoeren': true });
});
