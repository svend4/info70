import { test } from 'node:test';
import assert from 'node:assert/strict';
import { SEITE_RE, verweiseInZeile, pruefeZitat, normalisiere, seitenAusText, fundstellen } from '../src/seiten-pruefung.mjs';
import { pruefeJsonObjekte, zitateAusZeichenkette, gesamtStatus, pruefeAppSeiten } from '../src/seiten-pruefung.mjs';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Serie C (Plan 18.10, Abschnitt 7): die maschinelle Prüfung der Seitenangaben gegen die Textkopie.
// Die Tests nutzen kleine Fixtures; die Prüfung der echten Apps läuft mit tools/app-seiten-pruefen.mjs.

test('Seitenangaben: S., Seite, стр. und с. mit Bereich; „Abs. 2 S. 1“ ist kein Seitenverweis', () => {
  const treffer = (s) => [...s.matchAll(SEITE_RE)].map((m) => m[0]);
  assert.deepEqual(treffer('(S. 19)'), ['S. 19']);
  assert.deepEqual(treffer('Buchquelle: S. 267–268 (24'), ['S. 267–268']);
  assert.deepEqual(treffer('Seite 5 und с. 81'), ['Seite 5', 'с. 81']);
  assert.deepEqual(treffer('стр. 12'), ['стр. 12']);
  assert.deepEqual(treffer('Art. 28 Abs. 3 S. 1 SGB VIII'), []);
});

test('Verweise je Zeile: Zitat vor oder nach der Seitenangabe, Bereich in Seiten aufgelöst', () => {
  const [v] = verweiseInZeile('«Познать, чтобы воспитывать», S. 19–20 (Kapitel)');
  assert.deepEqual(v.seiten, [19, 20]);
  assert.deepEqual(v.zitate, ['Познать, чтобы воспитывать']);
  const [w] = verweiseInZeile('Bereich S. 267–268 ohne Zitat');
  assert.deepEqual(w.zitate, []);
});

test('Zitat gegen Seiten: wörtlich, nur mit denselben Wörtern, nicht gefunden, kein Zitat', () => {
  const seiten = seitenAusText('Erste Seite mit dem Satz über die Bewegung.\fZweite Seite: Begabungsarten und Temperament der Kinder.');
  assert.equal(pruefeZitat('Bewegung', seiten, [1]).ergebnis, 'wörtlich');
  assert.equal(pruefeZitat('Temperament, Begabungsarten', seiten, [2]).ergebnis, 'Wörter');
  assert.equal(pruefeZitat('Begabungsarten', seiten, [1]).ergebnis, 'nicht gefunden');
  assert.equal(pruefeZitat('  ', seiten, [1]).ergebnis, 'kein Zitat');
});

test('Fundstellen: die Seite, auf der ein Zitat wörtlich steht (zur Hinweisgabe bei falscher Seite)', () => {
  const seiten = seitenAusText('x\fEine Stelle über Begabungsarten\fmehr Text\fnoch einmal Begabungsarten');
  assert.deepEqual(fundstellen('Begabungsarten', seiten), [2, 4]);
});

test('Normalform: Trennstrich am Zeilenende, Satzzeichen und Groß und Klein fallen weg', () => {
  assert.equal(normalisiere('Be-\ngabungs­ arten, „Temperament“!'), 'begabungs arten temperament');
  assert.equal(seitenAusText('a\fb').length, 2);
});

// ---- JSON: objektweise Prüfung (Serie C, Welle 4). Eigene Fixtures mit erfundenem Text, nicht die Textkopie. ----
// Drei Seiten, je eine Zeile; das abschließende Formfeed macht aus drei Seiten vier Abschnitte (Seite n = n-1).
const JSON_SEITEN = seitenAusText('Первая страница: игрушку и мяч рядом.\fВторая страница: песке и воде в ведре.\fТретья страница: пирамидка стоит тут.\f');

test('JSON (a): Zitat und Seite in verschiedenen Zeilen desselben Objekts ergeben belegt', () => {
  const json = '[\n  {\n    "quelltext": "игрушку и мяч",\n    "seite": "S. 1"\n  }\n]';
  const r = pruefeJsonObjekte(json, JSON_SEITEN, 'daten/x.json');
  assert.equal(r.einheiten.length, 1);
  assert.equal(r.einheiten[0].ergebnis, 'belegt');
  assert.equal(r.einheiten[0].pfad, '$[0]');
  assert.deepEqual(r.einheiten[0].seiten, [1]);
});

test('JSON (b): ein richtiges und ein falsches Zitat im selben Objekt ergeben teilweise; das falsche nennt die Fundstelle', () => {
  const json = '{\n  "richtig": "игрушку и мяч",\n  "falsch": "песке и воде",\n  "seite": "S. 1"\n}';
  const [e] = pruefeJsonObjekte(json, JSON_SEITEN, 'daten/x.json').einheiten;
  assert.equal(e.ergebnis, 'teilweise');
  assert.deepEqual(e.zitate.map((z) => z.ergebnis), ['wörtlich', 'nicht gefunden']);
  assert.deepEqual(e.zitate[1].gefunden_auf, [2]);
});

test('JSON (c): eine deutsche Übersetzung ohne Kyrillisch zählt nicht als Zitat', () => {
  const [e] = pruefeJsonObjekte('{ "deutsch": "Spielzeug und Ball im Raum", "seite": "S. 1" }', JSON_SEITEN, 'daten/x.json').einheiten;
  assert.equal(e.ergebnis, 'kein Zitat');
  assert.deepEqual(e.zitate, []);
});

test('JSON (d): ein Objekt ohne Zitat, nur mit Seite, Zahl, Schalter und leer, ergibt kein Zitat', () => {
  const [e] = pruefeJsonObjekte('{ "seite": "S. 2", "anzahl": 3, "aktiv": true, "notiz": null }', JSON_SEITEN, 'daten/x.json').einheiten;
  assert.equal(e.ergebnis, 'kein Zitat');
});

test('JSON Regel 1: eine Seite im Unterobjekt zählt für das Elternobjekt; das Unterobjekt ist keine eigene Einheit', () => {
  const r = pruefeJsonObjekte('[{ "ru": "песке и воде", "quelle": { "seite": "S. 2" } }]', JSON_SEITEN, 'daten/x.json');
  assert.equal(r.einheiten.length, 1);
  assert.equal(r.einheiten[0].pfad, '$[0]');
  assert.deepEqual(r.einheiten[0].seiten, [2]);
  assert.equal(r.einheiten[0].ergebnis, 'belegt');
});

test('JSON Regel 1: die Seiten sind die eigenen und die des Unterobjekts; eine Liste zählt nicht für das Elternobjekt', () => {
  const [e] = pruefeJsonObjekte('{ "ru": "пирамидка стоит", "seite": "S. 1", "quelle": { "seite": "S. 3" } }', JSON_SEITEN, 'daten/x.json').einheiten;
  assert.deepEqual(e.seiten, [1, 3]);
  assert.equal(e.ergebnis, 'belegt');
  const r = pruefeJsonObjekte('{ "ru": "игрушку и мяч", "liste": [{ "seite": "S. 3" }] }', JSON_SEITEN, 'daten/x.json');
  assert.deepEqual(r.einheiten.map((x) => [x.pfad, x.ergebnis]), [['$.liste[0]', 'kein Zitat']]);
  assert.equal(r.ohneEinheit, 1, 'das Zitat der Wurzel hat keine Einheit');
});

test('JSON Regel 2: ein Listenelement mit Seite ist eine tiefere Einheit; ohne Seite gehört es zur Wurzel', () => {
  const json = '{\n  "hinweis": "Die Liste steht auf S. 2.",\n  "karten": [\n    { "quelltext": "песке и воде" },\n    { "quelltext": "пирамидка стоит", "seite": "S. 3" }\n  ]\n}';
  const r = pruefeJsonObjekte(json, JSON_SEITEN, 'daten/x.json');
  assert.equal(r.einheiten.length, 2, 'das Listenelement ohne Seite ist keine Einheit');
  const wurzel = r.einheiten.find((e) => e.pfad === '$');
  const karte = r.einheiten.find((e) => e.pfad === '$.karten[1]');
  assert.deepEqual(wurzel.zitate.map((z) => z.zitat), ['песке и воде'], 'die Zitate der tieferen Einheit fehlen in der Wurzel');
  assert.deepEqual(wurzel.seiten, [2]);
  assert.equal(wurzel.ergebnis, 'belegt');
  assert.deepEqual(karte.seiten, [3]);
  assert.equal(karte.ergebnis, 'belegt');
});

test('JSON Regel 3 (a) und (b): rein kyrillisch ganz; in Anführung nur der kyrillische Teil; Latein in Anführung ist kein Zitat', () => {
  assert.deepEqual(zitateAusZeichenkette('игрушку и мяч'), { zitate: [{ text: 'игрушку и мяч', anfuehrung: false }], gemischt: false });
  assert.deepEqual(zitateAusZeichenkette('Die Quelle nennt „игрушку“ (Spielzeug)'), { zitate: [{ text: 'игрушку', anfuehrung: true }], gemischt: false });
  assert.deepEqual(zitateAusZeichenkette('Er sagt “игрушку” und "мяч"').zitate.map((z) => z.text), ['игрушку', 'мяч']);
  assert.deepEqual(zitateAusZeichenkette('Praleska, „Programm der Vorschule“ (Пралеска)'), { zitate: [], gemischt: false });
});

test('JSON Regel 3 (c): gemischt ohne Anführung ist kein Zitat, wird aber gezählt; eine kyrillische Seitenangabe ist kein Zitat', () => {
  assert.deepEqual(zitateAusZeichenkette('Praleska, Programm, Minsk: НИО, 2007'), { zitate: [], gemischt: true });
  assert.deepEqual(zitateAusZeichenkette('стр. 12'), { zitate: [], gemischt: false });
  const [e] = pruefeJsonObjekte('{ "werk": "Praleska, Programm, Minsk: НИО, 2007", "seite": "S. 1" }', JSON_SEITEN, 'daten/x.json').einheiten;
  assert.equal(e.gemischt, 1);
  assert.equal(e.ergebnis, 'kein Zitat');
});

test('JSON Regel 3: ein nicht gefundener Anführungsteil wird einzeln aufgeführt, mit höchstens sechs Wörtern', () => {
  const r = pruefeJsonObjekte('{ "zitat": "«песке и воде в ведре, на солнце, у реки»", "seite": "S. 1" }', JSON_SEITEN, 'daten/x.json');
  assert.equal(r.nichtGefundeneAnfuehrungsteile.length, 1);
  assert.equal(r.nichtGefundeneAnfuehrungsteile[0].pfad, '$.zitat');
  assert.equal(r.nichtGefundeneAnfuehrungsteile[0].wortlaut, 'песке и воде в ведре, на');
});

test('JSON Gesamtstatus: Rangfolge Seite außerhalb, kein Zitat, belegt, teilweise, nicht gefunden', () => {
  assert.equal(gesamtStatus(['wörtlich', 'nicht gefunden'], true), 'Seite außerhalb des Textes', 'Vorrang vor allem anderen');
  assert.equal(gesamtStatus([], false), 'kein Zitat');
  assert.equal(gesamtStatus(['wörtlich', 'Wörter'], false), 'belegt');
  assert.equal(gesamtStatus(['wörtlich', 'nicht gefunden'], false), 'teilweise');
  assert.equal(gesamtStatus(['nicht gefunden', 'nicht gefunden'], false), 'nicht gefunden');
});

test('JSON: eine Seite außerhalb des Textes (hier ab Seite 4) macht die Einheit zu „Seite außerhalb des Textes“, auch im Bereich', () => {
  const [e] = pruefeJsonObjekte('{ "zitat": "игрушку и мяч", "seite": "S. 2–5" }', JSON_SEITEN, 'daten/x.json').einheiten;
  assert.equal(e.ergebnis, 'Seite außerhalb des Textes');
  assert.deepEqual(e.seiten, [2, 3, 4, 5]);
});

// Stand 29.10.2026 (Welle 4): die Zeilenprüfung löst Bereiche bis 20 Seiten jetzt ebenfalls auf; der Name unten ist überholt.
test('JSON: ein Bereich ab zehn Seiten wird vollständig aufgelöst (die Zeilenprüfung löst ihn nicht auf)', () => {
  const zwoelf = seitenAusText(Array.from({ length: 12 }, (_, i) => `Seite ${i + 1} пирамидка ${i + 1}`).join('\f') + '\f');
  const [e] = pruefeJsonObjekte('{ "zitat": "пирамидка 7", "seite": "S. 1–12" }', zwoelf, 'daten/x.json').einheiten;
  assert.deepEqual(e.seiten, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(e.ergebnis, 'belegt');
});

test('JSON: unlesbares JSON wird als Fehler gemeldet, ohne die Prüfung abzubrechen', () => {
  const r = pruefeJsonObjekte('{ kaputt', JSON_SEITEN, 'daten/x.json');
  assert.match(r.fehler, /JSON nicht lesbar/);
  assert.deepEqual(r.einheiten, []);
});

test('App: .md-Zeilen bleiben Zeilenprüfung, .json wird objektweise geprüft, ein kaputtes .json wird gemeldet', async () => {
  const wurzel = await mkdtemp(join(tmpdir(), 'seiten-pruefung-'));
  try {
    const dir = join(wurzel, 'apps', 'probe');
    await mkdir(join(dir, 'daten'), { recursive: true });
    await writeFile(join(dir, 'README.md'), 'Zitat «игрушку и мяч», S. 1\n');
    await writeFile(join(dir, 'daten', 'gut.json'), '[{\n  "quelltext": "песке и воде",\n  "seite": "S. 2"\n}]');
    await writeFile(join(dir, 'daten', 'kaputt.json'), '{ kaputt');
    const e = await pruefeAppSeiten(wurzel, 'probe', JSON_SEITEN);
    assert.deepEqual(e.verweise.map((v) => [v.datei, v.ergebnis]), [['README.md', 'wörtlich']]);
    assert.deepEqual(e.einheiten.map((x) => [x.datei, x.ergebnis]), [['daten/gut.json', 'belegt']]);
    assert.deepEqual(e.fehler.map((f) => f.datei), ['daten/kaputt.json']);
  } finally {
    await rm(wurzel, { recursive: true, force: true });
  }
});

// ---- Welle 4 (Stand 29.10.2026): Trennstrich am Zeilenende, Bereiche mit „bis“, „Bereich zu groß“ ----

test('Normalform (Welle 4): Trennstrich, Zeilenumbruch und Einzug danach ergeben ein Wort', () => {
  assert.equal(normalisiere('виш-\n        невый, салатовый'), 'вишневый салатовый');
  const seiten = seitenAusText('erste\fвиш-\n        невый, салатовый\f');
  assert.equal(pruefeZitat('вишневый', seiten, [2]).ergebnis, 'wörtlich', 'das Wort steht über den Umbruch getrennt auf Seite 2');
});

test('Seitenangabe mit „bis“ (Welle 4): „S. 265 bis 267“ und „Seiten 113 bis 114“ erkannt; S. n–m bleibt', () => {
  const treffer = (s) => [...s.matchAll(SEITE_RE)].map((m) => m[0]);
  assert.deepEqual(treffer('Quelle S. 265 bis 267 (Tanz)'), ['S. 265 bis 267']);
  assert.deepEqual(treffer('Auf den Seiten 113 bis 114 der Quelle'), ['Seiten 113 bis 114']);
  assert.deepEqual(treffer('S. 300–311'), ['S. 300–311']);
  assert.deepEqual(verweiseInZeile('Quelle S. 265 bis 267')[0].seiten, [265, 266, 267]);
});

test('Bereich (Welle 4): bis 20 Seiten wird vollständig geprüft, über 20 Seiten nicht (Zeile)', () => {
  const [a] = verweiseInZeile('Quelle S. 1 bis 20');
  assert.equal(a.seiten.length, 20);
  assert.equal(a.zuGross, false);
  const [b] = verweiseInZeile('Quelle S. 1–21');
  assert.equal(b.zuGross, true);
  assert.deepEqual(b.seiten, []);
  assert.equal(b.umfang, 21);
});

test('Bereich zu groß (Zeile, Welle 4): die Zeile wird nicht geprüft und als Befund geführt', async () => {
  const wurzel = await mkdtemp(join(tmpdir(), 'seiten-pruefung-'));
  try {
    const dir = join(wurzel, 'apps', 'probe');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'README.md'), 'Quelle «игрушку и мяч», S. 1–40\n');
    const e = await pruefeAppSeiten(wurzel, 'probe', JSON_SEITEN);
    assert.deepEqual(e.verweise.map((v) => v.ergebnis), ['Bereich zu groß']);
    assert.deepEqual(e.verweise[0].zitate.map((z) => z.ergebnis), ['nicht geprüft']);
    assert.deepEqual(e.bereicheZuGross.map((b) => [b.datei, b.zeile, b.text, b.umfang]), [['README.md', 1, 'S. 1–40', 40]]);
  } finally {
    await rm(wurzel, { recursive: true, force: true });
  }
});

test('Bereich zu groß (JSON, Welle 4): bis 20 Seiten wird geprüft; über 20 ist ein Befund, und ohne prüfbare Seite ist die Einheit „Bereich zu groß“', () => {
  const zwanzig = seitenAusText(Array.from({ length: 20 }, (_, i) => `Seite ${i + 1} пирамидка ${i + 1}`).join('\f') + '\f');
  const [voll] = pruefeJsonObjekte('{ "zitat": "пирамидка 20", "seite": "S. 1 bis 20" }', zwanzig, 'daten/x.json').einheiten;
  assert.equal(voll.seiten.length, 20, 'ein Bereich bis 20 Seiten wird vollständig geprüft');
  assert.equal(voll.ergebnis, 'belegt');
  const r = pruefeJsonObjekte('{ "zitat": "пирамидка 5", "seite": "S. 1–21" }', zwanzig, 'daten/x.json');
  assert.equal(r.einheiten[0].ergebnis, 'Bereich zu groß');
  assert.deepEqual(r.einheiten[0].zitate.map((z) => z.ergebnis), ['nicht geprüft']);
  assert.deepEqual(r.bereicheZuGross.map((b) => [b.pfad, b.text, b.umfang, b.einheit]), [['$.seite', 'S. 1–21', 21, '$']]);
  assert.deepEqual(r.nichtGefundeneAnfuehrungsteile, []);
});

test('Bereich zu groß (JSON, Welle 4): mit einer prüfbaren Seite bleibt der Status; der große Bereich wird nur gezählt', () => {
  const [e] = pruefeJsonObjekte('{ "zitat": "игрушку и мяч", "seite": "S. 1", "gross": "S. 1–40" }', JSON_SEITEN, 'daten/x.json').einheiten;
  assert.equal(e.ergebnis, 'belegt');
  assert.deepEqual(e.seiten, [1]);
  assert.deepEqual(e.bereicheZuGross, ['S. 1–40']);
});

// ---- Welle 4, Fassung 3 (Stand 29.10.2026): Sammeleinheit (4b), Regel 1 auf jeder Ebene (4c), Sammelseite (4d) ----

test('Sammeleinheit (4b): eine Einheit ohne eigene Zitate, mit einer tieferen Einheit mit Zitat', () => {
  const r = pruefeJsonObjekte('{ "seite": "S. 1", "liste": [{ "seite": "S. 1", "zitat": "игрушку и мяч" }] }', JSON_SEITEN, 'daten/x.json');
  assert.deepEqual(r.einheiten.map((e) => [e.pfad, e.ergebnis]), [['$', 'Sammeleinheit'], ['$.liste[0]', 'belegt']]);
});

test('Sammeleinheit (4b): ohne tiefere Einheit mit Zitat bleibt es bei „kein Zitat“', () => {
  const r = pruefeJsonObjekte('{ "seite": "S. 1", "liste": [{ "seite": "S. 1", "deutsch": "Ball" }] }', JSON_SEITEN, 'daten/x.json');
  assert.deepEqual(r.einheiten.map((e) => [e.pfad, e.ergebnis]), [['$', 'kein Zitat'], ['$.liste[0]', 'kein Zitat']]);
});

test('Gesamtstatus (4b): „Sammeleinheit“ steht zwischen „Seite außerhalb“ und „kein Zitat“', () => {
  assert.equal(gesamtStatus([], false, true), 'Sammeleinheit');
  assert.equal(gesamtStatus([], true, true), 'Seite außerhalb des Textes');
  assert.equal(gesamtStatus([], false, false), 'kein Zitat');
});

test('Regel 1 auf jeder Ebene (4c): eine Seite zwei Ebenen tief zählt für beide Elternobjekte; das Elternobjekt wird Einheit', () => {
  const r = pruefeJsonObjekte('{ "a": { "zitat": "песке и воде", "b": { "seite": "S. 2" } } }', JSON_SEITEN, 'daten/x.json');
  assert.deepEqual(r.einheiten.map((e) => [e.pfad, e.seiten, e.ergebnis]), [['$', [2], 'Sammeleinheit'], ['$.a', [2], 'belegt']]);
});

test('Regel 1 auf jeder Ebene (4c): das Muster aus fragen.json (Feldobjekt in Feldobjekt) wird erfasst', () => {
  const r = pruefeJsonObjekte('{ "quellen": { "m01": { "quelle": { "seite": "S. 2" } } } }', JSON_SEITEN, 'daten/x.json');
  assert.deepEqual(r.einheiten.map((e) => e.pfad), ['$', '$.quellen', '$.quellen.m01']);
  assert.deepEqual(r.einheiten.map((e) => e.ergebnis), ['kein Zitat', 'kein Zitat', 'kein Zitat']);
});

test('Sammelseite (4d): ein Zitat aus einem Listenelement ohne Seite, nicht gefunden auf der Seite der Wurzel; das Gesamturteil bleibt', () => {
  const r = pruefeJsonObjekte('{ "seite": "S. 1", "eintraege": [{ "zitat": "песке и воде" }] }', JSON_SEITEN, 'daten/x.json');
  assert.equal(r.einheiten[0].ergebnis, 'nicht gefunden');
  assert.deepEqual(r.sammelseiten, [{ datei: 'daten/x.json', einheit: '$', seiten: [1], ergebnis: 'nicht gefunden', zitate: [{ pfad: '$.eintraege[0].zitat', zitat: 'песке и воде' }] }]);
});

test('Sammelseite (4d): ein Zitat aus einem Unterobjekt mit eigener Seite steht nicht auf der Liste', () => {
  const r = pruefeJsonObjekte('{ "seite": "S. 1", "quelle": { "seite": "S. 2", "zitat": "песке и воде" } }', JSON_SEITEN, 'daten/x.json');
  assert.deepEqual(r.sammelseiten, []);
  assert.equal(r.einheiten[0].ergebnis, 'belegt', 'die Seite 2 des Unterobjekts zählt für die Wurzel');
});

test('App (4b): „Sammeleinheit“ wird getrennt von „kein Zitat“ gezählt', async () => {
  const wurzel = await mkdtemp(join(tmpdir(), 'seiten-pruefung-'));
  try {
    const dir = join(wurzel, 'apps', 'probe');
    await mkdir(join(dir, 'daten'), { recursive: true });
    await writeFile(join(dir, 'daten', 'x.json'), '{ "seite": "S. 1", "liste": [{ "seite": "S. 1", "zitat": "игрушку и мяч" }], "leer": [{ "seite": "S. 1", "deutsch": "Ball" }] }');
    const e = await pruefeAppSeiten(wurzel, 'probe', JSON_SEITEN);
    assert.equal(e.einheitenZusammen.Sammeleinheit, 1);
    assert.equal(e.einheitenZusammen['kein Zitat'], 1, 'der Eintrag ohne Zitat bleibt „kein Zitat“, die Wurzel ist Sammeleinheit');
  } finally {
    await rm(wurzel, { recursive: true, force: true });
  }
});

test('Sammelseite (4d, Fassung 4): ein Fund außerhalb der geprüften Seiten zählt nicht; die Einheit bleibt „nicht gefunden“ und steht in der Liste', () => {
  const r = pruefeJsonObjekte('{ "seite": "S. 1", "eintraege": [{ "zitat": "пирамидка стоит" }] }', JSON_SEITEN, 'daten/x.json');
  assert.equal(r.einheiten[0].ergebnis, 'nicht gefunden');
  assert.deepEqual(r.einheiten[0].zitate[0].gefunden_auf, [3], 'die Fundstelle außerhalb der Seitenliste wird nur angezeigt');
  assert.equal(r.sammelseiten.length, 1);
});

// ---- Welle 4, Fassung 5 (Stand 29.10.2026): Wortregel C+ (Stamm, Wortanfang). Bis Fassung 4 galt die Teilfolge. ----

test('C+ (Fassung 5): «нож» trifft „ножи“, aber nicht „множество“; Treffer mitten im Wort zählen nicht', () => {
  assert.equal(pruefeZitat('нож', seitenAusText('ножи\f'), [1]).ergebnis, 'wörtlich');
  assert.equal(pruefeZitat('нож', seitenAusText('множество\f'), [1]).ergebnis, 'nicht gefunden');
  assert.equal(pruefeZitat('вода', seitenAusText('наводнение\f'), [1]).ergebnis, 'nicht gefunden', 'auch ab vier Buchstaben muss der Stamm am Wortanfang stehen');
});

test('C+ (Fassung 5): «арфа» trifft „арфе“, «контрабас» trifft „контрабасе“ (der letzte Buchstabe fällt weg)', () => {
  assert.equal(pruefeZitat('арфа', seitenAusText('играет на арфе\f'), [1]).ergebnis, 'wörtlich');
  assert.equal(pruefeZitat('контрабас', seitenAusText('контрабасе и скрипка\f'), [1]).ergebnis, 'wörtlich');
});

test('C+ (Fassung 5): die Stämme müssen aufeinanderfolgen (wörtlich); sonst „Wörter“; fehlt ein Zitatwort, „nicht gefunden“', () => {
  const seiten = seitenAusText('нож и вилка\f');
  assert.equal(pruefeZitat('нож и вилка', seiten, [1]).ergebnis, 'wörtlich');
  assert.equal(pruefeZitat('вилка нож', seiten, [1]).ergebnis, 'Wörter');
  assert.equal(pruefeZitat('нож ложка', seiten, [1]).ergebnis, 'nicht gefunden');
});

test('C+ (Fassung 5): ein Zitat über zwei Zeilen mit Trennstrich wird weiterhin gefunden (Fassung 2)', () => {
  const seiten = seitenAusText('erste\fпесок и вод-\n    а в ведре\f');
  assert.equal(pruefeZitat('вода в ведре', seiten, [2]).ergebnis, 'wörtlich');
});

test('C+ (Fassung 5): alle Zitatwörter zählen für „Wörter“, auch kurze; ein fehlendes kurzes Wort ergibt „nicht gefunden“', () => {
  assert.equal(pruefeZitat('в нож', seitenAusText('нож\f'), [1]).ergebnis, 'nicht gefunden');
  assert.equal(pruefeZitat('в нож', seitenAusText('в доме нож\f'), [1]).ergebnis, 'Wörter');
});

test('C+ (Fassung 5): Zahl im Zitat bleibt wie bisher (Teilfolge, auch mitten im Wort); Ausnahme von der Wortanfang-Regel', () => {
  assert.equal(pruefeZitat('3 штуки', seitenAusText('две штуки\f'), [1]).ergebnis, 'Wörter');
  assert.equal(pruefeZitat('2 раза', seitenAusText('это было 12 раза\f'), [1]).ergebnis, 'wörtlich');
});

test('C+ (Fassung 5): lateinisches Wort im kyrillischen Zitat bleibt wie bisher (Teilfolge)', () => {
  assert.equal(pruefeZitat('пирамидка Pyramide', seitenAusText('пирамидка pyramide\f'), [1]).ergebnis, 'wörtlich');
  assert.equal(pruefeZitat('пирамидка Pyramide', seitenAusText('пирамидка и pyramide\f'), [1]).ergebnis, 'Wörter');
  assert.equal(pruefeZitat('нож Pyramide', seitenAusText('множество pyramide\f'), [1]).ergebnis, 'Wörter', 'wie bisher, mitten im Wort');
});

test('C+ (Fassung 5): Fundstellen nennen auch die Form am Wortanfang', () => {
  assert.deepEqual(fundstellen('арфа', seitenAusText('x\fна арфе\fарфа и арфе')), [2, 3]);
});

test('C+ (Fassung 5): die Zeilenprüfung (.md) und die JSON-Einheiten nutzen dieselbe Regel', async () => {
  const wurzel = await mkdtemp(join(tmpdir(), 'seiten-pruefung-'));
  try {
    const dir = join(wurzel, 'apps', 'probe');
    await mkdir(join(dir, 'daten'), { recursive: true });
    await writeFile(join(dir, 'README.md'), 'Quelle «арфа», S. 2\n');
    await writeFile(join(dir, 'daten', 'x.json'), '{ "ru": "контрабас", "seite": "S. 3" }');
    const e = await pruefeAppSeiten(wurzel, 'probe', seitenAusText('erste\fиграет на арфе\fконтрабасе и скрипка\f'));
    assert.deepEqual(e.verweise.map((v) => [v.datei, v.ergebnis]), [['README.md', 'wörtlich']]);
    assert.deepEqual(e.einheiten.map((x) => [x.datei, x.ergebnis]), [['daten/x.json', 'belegt']]);
  } finally {
    await rm(wurzel, { recursive: true, force: true });
  }
});

// ---- Welle 4, Fassung 5 (Stand 29.10.2026), wie vom Koordinator entschieden: Wortdefinition B ----

test('B (Fassung 5): ein Sternchen am Wort gehört nicht zum Wort: «обучать» trifft „*обучать“, und das Zitat steht wörtlich', () => {
  const seiten = seitenAusText('erste\fтехнике *обучать ножницами\f');
  assert.equal(pruefeZitat('технике обучать ножницами', seiten, [2]).ergebnis, 'wörtlich');
  assert.equal(pruefeZitat('обучать', seiten, [2]).ergebnis, 'wörtlich');
  assert.equal(pruefeZitat('*обучать*', seiten, [2]).ergebnis, 'wörtlich', 'auch ein Sternchen im Zitat ist kein Teil des Wortes');
});

test('B (Fassung 5): ein Zitat mit „/“: das Zeichen zählt nicht; „Neffe/Nichte“ steht wörtlich, wenn die Wörter nebeneinander stehen', () => {
  assert.equal(pruefeZitat('Художественное восприятие / Задачи', seitenAusText('художественное восприятие задачи\f'), [1]).ergebnis, 'wörtlich');
  assert.equal(pruefeZitat('Художественное восприятие / Задачи', seitenAusText('художественное восприятие / задачи\f'), [1]).ergebnis, 'wörtlich');
  assert.equal(pruefeZitat('Neffe/Nichte', seitenAusText('Neffe Nichte\f'), [1]).ergebnis, 'wörtlich');
});

test('B (Fassung 5): ein Zitat aus Sonderzeichen allein hat kein Wort und ist „kein Zitat“', () => {
  assert.equal(pruefeZitat('**', seitenAusText('текст\f'), [1]).ergebnis, 'kein Zitat');
  assert.equal(pruefeZitat(' / // ', seitenAusText('текст\f'), [1]).ergebnis, 'kein Zitat');
});

test('B (Fassung 5): „упро- щенным“ mit Leerzeichen nach dem Bindestrich bleibt „nicht gefunden“ (Befund der App, Handprüfung)', () => {
  assert.equal(pruefeZitat('упро- щенным', seitenAusText('в упрощенным\f'), [1]).ergebnis, 'nicht gefunden');
});

// ---- Welle 4, Fassung 6 (Stand 29.10.2026): Kontext aus der Vorzeile nur für ein offenes Zitat am Zeilenende ----

test('Kontext (Fassung 6, Test a): ein Zitat über zwei Zeilen wird gefunden; die Seitenangabe steht hinter dem schließenden Zeichen', async () => {
  const wurzel = await mkdtemp(join(tmpdir(), 'seiten-pruefung-'));
  try {
    const dir = join(wurzel, 'apps', 'probe');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'README.md'), '- Er sagt „песок и\nвода в ведре“, S. 2\n');
    const e = await pruefeAppSeiten(wurzel, 'probe', seitenAusText('erste\fпесок и вода в ведре\f'));
    assert.deepEqual(e.verweise.map((v) => [v.zeile, v.seiten, v.ergebnis, v.zitate.map((z) => z.zitat)]), [[2, [2], 'wörtlich', ['песок и вода в ведре']]]);
  } finally {
    await rm(wurzel, { recursive: true, force: true });
  }
});

test('Kontext (Fassung 6, Test b): eine Vorzeile mit geschlossenem Zitat wird nicht übernommen', async () => {
  const wurzel = await mkdtemp(join(tmpdir(), 'seiten-pruefung-'));
  try {
    const dir = join(wurzel, 'apps', 'probe');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'README.md'), '- «игрушку и мяч» steht hier\n- «пирамидка стоит», S. 3\n');
    const e = await pruefeAppSeiten(wurzel, 'probe', seitenAusText('erste\fzweite\fпирамидка стоит тут\f'));
    assert.deepEqual(e.verweise.map((v) => [v.zeile, v.seiten, v.zitate.map((z) => z.zitat)]), [[2, [3], ['пирамидка стоит']]], 'das Zitat der Vorzeile bleibt draußen');
  } finally {
    await rm(wurzel, { recursive: true, force: true });
  }
});

test('Kontext (Fassung 6, Test c): eine Zeile ohne Anführung hat keinen Kontext aus der Vorzeile', async () => {
  const wurzel = await mkdtemp(join(tmpdir(), 'seiten-pruefung-'));
  try {
    const dir = join(wurzel, 'apps', 'probe');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'README.md'), '- Er sagt „песок и\n- Ein Satz ohne Anführung, S. 1\n');
    const e = await pruefeAppSeiten(wurzel, 'probe', seitenAusText('песок и вода\f'));
    assert.deepEqual(e.verweise.map((v) => [v.zeile, v.seiten, v.ergebnis, v.zitate.map((z) => z.zitat)]), [[2, [1], 'kein Zitat', [null]]]);
  } finally {
    await rm(wurzel, { recursive: true, force: true });
  }
});

// ---- Welle 4, Fassung 7 (Stand 29.10.2026): Seitenangabe am Zeilenanfang übernimmt die Zitate einer Vorzeile ohne Angabe ----

test('Zeilenanfang (Fassung 7, Test d): die fünf Zitate der Zeilen 42 und 43 (himmelsgucker, S. 138) werden geprüft', async () => {
  const wurzel = await mkdtemp(join(tmpdir(), 'seiten-pruefung-'));
  try {
    const dir = join(wurzel, 'apps', 'probe');
    await mkdir(dir, { recursive: true });
    // Wortlaut der Zeilen 42 und 43 aus himmelsgucker-sonne-mond-und-sterne/README.md (Fixture, Zeilen 1 und 2).
    // Zeile 42 trägt selbst zwei Angaben „S. 138“; ihre fünf Zitate werden über diese Angaben geprüft.
    await writeFile(join(dir, 'README.md'),
      '  „солнечные лучи“ (S. 138), „полная, неполная, серпом“ (S. 138) und die Einzelwörter „полная“, „неполная“, „серпом“\n' +
      '  (S. 138), „звездное небо“ (S. 114). Die Seiten sind geprüft.\n');
    const seiten = Array.from({ length: 138 }, () => '');
    seiten[113] = 'звездное небо';
    seiten[137] = 'солнечные лучи полная неполная серпом';
    const e = await pruefeAppSeiten(wurzel, 'probe', seiten);
    const wortlaut = e.verweise.filter((v) => v.zeile === 1 && v.seiten.includes(138)).flatMap((v) => v.zitate.filter((z) => z.ergebnis === 'wörtlich').map((z) => z.zitat));
    assert.deepEqual([...new Set(wortlaut)].sort(), ['неполная', 'полная', 'полная, неполная, серпом', 'серпом', 'солнечные лучи'].sort(), 'alle fünf Zitate sind gegen S. 138 wörtlich geprüft');
  } finally {
    await rm(wurzel, { recursive: true, force: true });
  }
});

test('Zeilenanfang (Fassung 7, Test d2): ein Zitat der Vorzeile ohne eigene Angabe gehört zur Angabe am Zeilenanfang, nicht zu den übrigen der Zeile', async () => {
  const wurzel = await mkdtemp(join(tmpdir(), 'seiten-pruefung-'));
  try {
    const dir = join(wurzel, 'apps', 'probe');
    await mkdir(dir, { recursive: true });
    // Wortlaut der Zeilen 190 und 191 aus himmelsgucker-sonne-mond-und-sterne/README.md (Fixture, Zeilen 1 und 2).
    await writeFile(join(dir, 'README.md'),
      '- Altersangabe: die Gruppe „ПОЧЕМУЧКИ“ wird genannt.\n' +
      '  (S. 103: viertes Lebensjahr); die Gruppe „ФАНТАЗЕРЫ“ hat einen Abschnitt (S. 234).\n');
    const seiten = Array.from({ length: 234 }, () => '');
    seiten[102] = 'почемучки viertes lebensjahr';
    seiten[233] = 'фантазеры';
    const e = await pruefeAppSeiten(wurzel, 'probe', seiten);
    const bei103 = e.verweise.find((v) => v.zeile === 2 && v.seiten.includes(103));
    const bei234 = e.verweise.find((v) => v.zeile === 2 && v.seiten.includes(234));
    assert.equal(bei103.zitate.find((z) => z.zitat === 'ПОЧЕМУЧКИ').ergebnis, 'wörtlich', 'das Zitat der Vorzeile steht bei S. 103');
    assert.deepEqual(bei234.zitate.map((z) => z.zitat), ['ФАНТАЗЕРЫ'], 'die Angabe S. 234 bekommt das Zitat der Vorzeile nicht');
  } finally {
    await rm(wurzel, { recursive: true, force: true });
  }
});

test('Zeilenanfang (Fassung 7, Test e): eine Vorzeile mit eigener Seitenangabe gibt nichts ab', async () => {
  const wurzel = await mkdtemp(join(tmpdir(), 'seiten-pruefung-'));
  try {
    const dir = join(wurzel, 'apps', 'probe');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'README.md'), '- «игрушку и мяч», S. 1\n  (S. 3) und mehr Text.\n');
    const e = await pruefeAppSeiten(wurzel, 'probe', seitenAusText('игрушку и мяч\ferste\fдругое\f'));
    const bei3 = e.verweise.find((v) => v.zeile === 2 && v.seiten.includes(3));
    assert.deepEqual(bei3.zitate.map((z) => z.zitat), [null], 'kein Zitat: das Zitat der Vorzeile wird nicht übernommen');
  } finally {
    await rm(wurzel, { recursive: true, force: true });
  }
});

test('Zeilenanfang (Fassung 7, Test f): eine Seitenangabe ab dem einundzwanzigsten Zeichen übernimmt nichts', async () => {
  const wurzel = await mkdtemp(join(tmpdir(), 'seiten-pruefung-'));
  try {
    const dir = join(wurzel, 'apps', 'probe');
    await mkdir(dir, { recursive: true });
    await writeFile(join(dir, 'README.md'), '- «игрушку и мяч»\n- ein Satz mit einer längeren Einleitung, S. 3\n');
    const e = await pruefeAppSeiten(wurzel, 'probe', seitenAusText('игрушку и мяч\ferste\ferste\f'));
    const bei3 = e.verweise.find((v) => v.zeile === 2 && v.seiten.includes(3));
    assert.deepEqual(bei3.zitate.map((z) => z.zitat), [null], 'kein Zitat: die Angabe steht nicht am Zeilenanfang');
  } finally {
    await rm(wurzel, { recursive: true, force: true });
  }
});
