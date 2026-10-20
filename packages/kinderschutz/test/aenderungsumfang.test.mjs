import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pruefeDiff, zusammenfassung } from '../src/aenderungsumfang.mjs';

const kopf = (datei) => `diff --git a/${datei} b/${datei}\nindex 1111111..2222222 100644\n--- a/${datei}\n+++ b/${datei}\n`;

test('erlaubt: die Entfernung von Rekord, Rang und Punkten ist kein Befund, Klammern zählen als Struktur', () => {
  const diff = kopf('apps/x/app.mjs') +
    '@@ -3 +3 @@\n-const rekord = 5;\n+const bestand = 5;\n' +
    '@@ -10,2 +10,0 @@\n-el(\'p\', {}, `Dein Rang: ${rang}`);\n-  ],\n' +
    '@@ -20 +20 @@\n-Halbe Punkte: 1\n+Ein Hinweis\n';
  const [d] = pruefeDiff(diff);
  assert.deepEqual(d.befunde, []);
  assert.equal(d.strukturell, 1);
});

test('Kontrolle: eine Entfernung außerhalb der Liste (Impressum) wird gemeldet', () => {
  const diff = kopf('apps/x/index.html') + '@@ -5 +5 @@\n-<p>Impressum: Max Mustermann</p>\n+<p>Impressum</p>\n';
  const [d] = pruefeDiff(diff);
  assert.equal(d.befunde.length, 1);
  assert.equal(d.befunde[0].art, 'Entfernung außerhalb der erlaubten Liste');
});

test('offen: die Karte „Meine Daten löschen“ und removeItem werden gemeldet, nicht entschieden', () => {
  const diff = kopf('apps/x/app.mjs') +
    '@@ -7 +7 @@\n-import { datenKarte } from \'../../packages/kinder-ui/js/daten-karte.mjs\';\n' +
    '@@ -40 +40 @@\n-  el(\'button\', {}, \'Meine Daten löschen\'),\n' +
    '@@ -60 +60 @@\n-localStorage.removeItem(\'x.rekord\');\n';
  const [d] = pruefeDiff(diff);
  assert.equal(d.befunde.length, 3);
  assert.ok(d.befunde.every((b) => b.art === 'offen (Entscheidung Max)'));
});

const befundeVon = (datei, zeile) => pruefeDiff(kopf(datei) + `@@ -1 +1 @@\n-${zeile}\n+x\n`)[0].befunde;

test('Rang: „range“ ist kein Rang, Wörter aus dem Motor (rangSymbol, rangWort) und Rangliste schon', () => {
  // Kontrolle: das alte Muster \brang trifft „range“ im Eingabefeld.
  assert.ok(/\brang/i.test('<input type="range" min="0">'), 'Kontrolle: das alte Muster traf range');
  assert.equal(befundeVon('apps/x/index.html', '<input type="range" min="0">').length, 1, 'Schieberegler: Befund');
  assert.equal(befundeVon('apps/x/app.mjs', 'const rangSymbol = pick(stufen);').length, 0, 'rangSymbol bleibt erlaubt');
  assert.equal(befundeVon('apps/x/app.mjs', 'const rangWort = stufe.wort;').length, 0, 'rangWort bleibt erlaubt');
  assert.equal(befundeVon('apps/x/app.mjs', 'el(\'p\', {}, \'Rangliste\');').length, 0, 'Rangliste: kein Befund');
  assert.equal(befundeVon('apps/x/app.mjs', 'el(\'p\', {}, \'Dein Rang: 5\');').length, 0, 'Dein Rang: kein Befund');
});

test('Prozent: CSS-Wert (width: 100%, translate(-50%)) ist ein Befund, Text mit „85 %“ nicht', () => {
  // Kontrolle: das alte Muster \d\s?% zählte den CSS-Wert als erlaubt; die Prüfung muss ihn jetzt melden.
  assert.equal(befundeVon('apps/x/index.html', '  width: 100%;').length, 1, 'CSS-Wert in einer HTML-Datei: Befund');
  assert.equal(befundeVon('apps/x/style.css', '  width: 100%;').length, 1, 'CSS-Datei: Befund');
  assert.equal(befundeVon('apps/x/app.mjs', 'el(\'div\', { style: \'transform:translate(-50%)\' });').length, 1, 'translate(-50%): Befund');
  assert.equal(befundeVon('apps/x/app.mjs', 'el(\'p\', {}, \'Trefferquote 85 %\');').length, 0, 'Text „85 %“: kein Befund');
  assert.equal(befundeVon('apps/x/app.mjs', 'el(\'p\', {}, \'Zu 85% gelöst\');').length, 0, 'Text „85%“: kein Befund');
});

test('Datei gelöscht wird gemeldet', () => {
  const diff = `diff --git a/apps/x/druck.css b/apps/x/druck.css\ndeleted file mode 100644\nindex 1111111..0000000\n--- a/apps/x/druck.css\n+++ /dev/null\n@@ -1,2 +0,0 @@\n-a {}\n-b {}\n`;
  const [d] = pruefeDiff(diff);
  assert.equal(d.geloescht, true);
  assert.ok(d.befunde.some((b) => b.art === 'Datei gelöscht'));
});

test('Test ohne Ersatz wird gemeldet, Test mit Ersatz nicht', () => {
  // Zwei entfernt, einer neu: einer fehlt als Ersatz.
  const ohne = kopf('apps/x/test/a.test.mjs') + '@@ -4,2 +4,0 @@\n-test(\'alt\', () => {});\n-test(\'alt 2\', () => {});\n+test(\'neu\', () => {});\n';
  const [a] = pruefeDiff(ohne);
  assert.equal(a.testsEntfernt, 2);
  assert.equal(a.testsHinzu, 1);
  assert.deepEqual(a.befunde.map((x) => x.art), ['Test ohne Ersatz entfernt']);
  // Ein Test wird durch einen Abwesenheits-Test ersetzt: kein Befund.
  const mit = kopf('apps/x/test/b.test.mjs') + '@@ -4 +4 @@\n-test(\'Rang-Pruefung\', () => {});\n+test(\'keine Raenge\', () => {});\n';
  const [b] = pruefeDiff(mit);
  assert.deepEqual(b.befunde, []);
});

test('Zusammenfassung zählt Zeilen und Befunde', () => {
  const diff = kopf('apps/x/app.mjs') + '@@ -1 +1 @@\n-a Impressum\n+b\n@@ -2 +2 @@\n-Rekord\n+c\n';
  const z = zusammenfassung(pruefeDiff(diff));
  assert.deepEqual(z, { dateien: 1, entfernt: 2, hinzu: 2, befunde: 1 });
});

test('Kontrollfall in einer temporären Git-Kopie: eine Löschung außerhalb der Liste wird gefunden', () => {
  const tmp = mkdtempSync(join(tmpdir(), 'aenderungsumfang-'));
  try {
    const git = (...a) => execFileSync('git', a, { cwd: tmp, stdio: ['ignore', 'pipe', 'pipe'] }).toString();
    git('init', '-q');
    git('config', 'user.email', 'test@example.invalid');
    git('config', 'user.name', 'test');
    mkdirSync(join(tmp, 'apps', 'x'), { recursive: true });
    const datei = join(tmp, 'apps', 'x', 'index.html');
    writeFileSync(datei, '<p>Impressum: Max</p>\n<p>Punkte: 5</p>\n');
    git('add', '.');
    git('commit', '-q', '-m', 'stand');
    // Die Änderung: der Impressum-Satz verschwindet (nicht erlaubt), die Punkte-Zeile darf weg.
    writeFileSync(datei, '<p>Hallo</p>\n');
    const diff = git('diff', '-U0', '--no-color', 'HEAD', '--', 'apps/x');
    const [d] = pruefeDiff(diff);
    assert.equal(d.befunde.length, 1, 'genau die Impressum-Zeile ist ein Befund');
    assert.match(d.befunde[0].zeile, /Impressum/);
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

test('Wirklicher Bestand: eine unveränderte App hat keinen Befund', () => {
  const wurzel = new URL('../../../', import.meta.url).pathname;
  const diff = execFileSync('git', ['diff', '-U0', '--no-color', 'HEAD', '--', 'apps/chat-rechte'], { cwd: wurzel }).toString();
  assert.deepEqual(pruefeDiff(diff), []);
});
