import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { appGruende, appTreffer, appTrefferIn, kernTreffer, vergleiche } from '../src/bewertung-stand.mjs';

// Ergebnis-Wertung (Rekord, Punkte, Ränge, Treffer). Der Stand in docs/bewertung-stand.json schrumpft nur;
// node tools/bewertung-stand.mjs --schreiben streicht erledigte Einträge. Neue Einträge brauchen --erweitern
// und eine Entscheidung.
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));

const stand = async () => JSON.parse(await readFile(join(WURZEL, 'docs', 'bewertung-stand.json'), 'utf8'));

test('Ergebnis-Wertung: quiz-kern und Apps stimmen mit dem Stand überein, nichts Neues ohne Entscheidung', async () => {
  const probleme = vergleiche(await stand(), await kernTreffer(WURZEL), await appTreffer(WURZEL));
  assert.deepEqual(probleme, [], probleme.join('\n'));
});

test('Ausnahmen im Stand haben eine Begründung', async () => {
  const s = await stand();
  for (const [app, grund] of Object.entries({ ...s.ausnahmen, ...s.ausnahmen_vorgeschlagen })) {
    assert.ok(grund.length > 20, `Ausnahme ${app} braucht eine Begründung`);
  }
});

test('Verneinungen zählen nicht; ein Rang in den Daten zählt', () => {
  assert.equal(appTrefferIn('app.mjs', '// Rekord im Kommentar\nkein Rekord, keine Ränge\n'), 0);
  assert.equal(appTrefferIn('app.mjs', 'const r = daten.raenge;\n'), 1);
  assert.equal(appTrefferIn('app.mjs', 'el(\'p\', {}, `Dein Rekord: ${rekord}`);\n'), 1);
  assert.equal(appTrefferIn('index.html', '<p>Gespeichert wird nur der Punkte-Rekord.</p>\n'), 1);
});

test('Groß- und Kleinschreibung: REKORD als Konstante und im Aufruf zählt', () => {
  assert.ok(appTrefferIn('app.mjs', "const REKORD = 'dsm.rekord';\nlocalStorage.getItem(REKORD);\n") >= 1);
  assert.ok(appTrefferIn('app.mjs', "const REKORD_SCHLUESSEL = 'cc.rekord';\n") >= 1);
});

test('Verneinung gilt nur für die drei Wörter davor, nicht für die ganze Zeile', () => {
  // Der Rekord wird behauptet, nur das Urteil dahinter ist anders: das bleibt ein Treffer.
  assert.equal(appTrefferIn('index.html', '<p>Dein Rekord: 5, nicht schlecht.</p>'), 1);
  // Ein Verneinungswort in Reichweite hebt den Treffer auf.
  assert.equal(appTrefferIn('app.mjs', 'kein Rekord'), 0);
  assert.equal(appTrefferIn('app.mjs', 'Die Punkte, ohne Rekord'), 0);
  // Ein Verneinungswort, das weiter als drei Wörter entfernt steht, hebt ihn nicht auf.
  assert.equal(appTrefferIn('index.html', '<p>Es gibt keinen Grund zur Sorge, dass wir den Rekord brechen.</p>'), 1);
});

test('Migration: die Konfiguration rekordSchluessel nennt nur den alten Schlüssel und zählt nicht', () => {
  assert.deepEqual(appGruende('app.mjs', "  rekordSchluessel: 'imp.rekord',\n"), []);
  // Ein Lesezugriff auf denselben Schlüssel zählt dagegen.
  assert.ok(appGruende('app.mjs', "localStorage.getItem('imp.rekord');\n").length >= 1, 'ein Lesezugriff auf den Schlüssel zählt');
  assert.ok(appGruende('app.mjs', 'localStorage.getItem(rekordSchluessel);\n').length >= 1, 'ein Lesezugriff über die Konfiguration zählt');
});

test('Prüfmuster mit Rangliste zählen, bis sie als Ausnahme mit Begründung im Stand stehen', () => {
  assert.ok(appTrefferIn('logik.mjs', 'export const G = /\\bRangliste\\b|\\bRanking\\b/i;') >= 1);
});

// Regressionen aus der Gegenprobe (Workflow stand-gegenprobe): jeder Fall ist ein echter Fehler gewesen.
test('Escape \\b in einem Prüfmuster ist keine Wortgrenze für den Begriff dahinter', () => {
  assert.ok(appTrefferIn('logik.mjs', 'const r = /\\brang\\b/;') >= 1, '\\brang\\b muss zählen');
  assert.ok(appTrefferIn('logik.mjs', 'const r = /\\bränge\\b/;') >= 1, '\\bränge\\b muss zählen');
  assert.equal(appTrefferIn('app.mjs', 'kein Wert ist \\brekord'), 0, 'kein gilt auch über den Escape hinweg');
});

test('Satzteil: Komma, Punkt und Doppelpunkt beenden die Verneinung', () => {
  assert.ok(appTrefferIn('app.mjs', 'kein Rekord, dein Rang: 5') >= 1, 'nach dem Komma zählt der Rang');
  assert.ok(appTrefferIn('index.html', '<p>Kein Rekord, dein Rekord: 5</p>') >= 1, 'der zweite Rekord zählt');
  assert.ok(appTrefferIn('index.html', '<p>Nicht schlecht. Dein Rekord: 5</p>') >= 1, 'nach dem Punkt zählt der Rekord');
});

test('Migration gilt nur für die Konfigurationszeile allein, nicht für eine Zeile mit Lesezugriff', () => {
  assert.ok(appTrefferIn('app.mjs', "rekordSchluessel: 'dsm.rekord', x: localStorage.getItem('dsm.rekord'),") >= 1);
});

test('Kommentare nach Code zählen nicht', () => {
  assert.equal(appTrefferIn('app.mjs', 'const a = 1; // Dein Rekord: 5'), 0);
  assert.ok(appTrefferIn('app.mjs', "const url = 'https://x.de'; const REKORD = 1;") >= 1, 'https:// ist kein Kommentar');
});

test('Zähler im Aufruf zählt, Anzahl mit .length nicht', () => {
  assert.ok(appTrefferIn('app.mjs', 'Bisher ${beobachtungsWort(summen[feld.id])} in diesem Feld.') >= 1);
  assert.equal(appTrefferIn('app.mjs', 'const t = `${summen.length} Sachen`;'), 0);
});

test('Impressum: die Aussage über Rekorde fällt erst, wenn der Stand keine Apps mehr führt', async () => {
  const s = await stand();
  const impressum = await readFile(join(WURZEL, 'impressum.html'), 'utf8');
  if (s.apps.length === 0) {
    assert.doesNotMatch(impressum, /Rekorde und Fortschritt/, 'impressum.html nennt noch „Rekorde und Fortschritt“, obwohl keine App mehr einen Rekord führt');
    assert.doesNotMatch(impressum, /dein\s+Rekord/i, 'impressum.html nennt noch „dein Rekord“, obwohl keine App mehr einen Rekord führt');
  }
});
