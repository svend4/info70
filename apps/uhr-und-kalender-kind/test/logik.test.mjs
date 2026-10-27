import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import { zeigerWinkel, uhrText, uhrOptionen, pruefeFragen } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');

test('zeigerWinkel: Stunden- und Minutenzeiger stimmen', () => {
  assert.deepEqual(zeigerWinkel(3, 0), { minute: 0, stunde: 90 });
  assert.deepEqual(zeigerWinkel(6, 30), { minute: 180, stunde: 195 });
  assert.deepEqual(zeigerWinkel(9, 45), { minute: 270, stunde: 292.5 });
  assert.deepEqual(zeigerWinkel(12, 0), { minute: 0, stunde: 0 });
});

test('uhrText: kindgerechte Sprache (voll, halb, Viertel nach/vor)', () => {
  assert.equal(uhrText(3, 0), '3 Uhr');
  assert.equal(uhrText(4, 30), 'halb 5');
  assert.equal(uhrText(2, 15), 'Viertel nach 2');
  assert.equal(uhrText(5, 45), 'Viertel vor 6');
  assert.equal(uhrText(12, 30), 'halb 1', 'Übergang über 12');
  assert.equal(uhrText(12, 0), '12 Uhr');
});

test('Fragenbank gültig: beide Typen, Uhr-Minuten nur 0/15/30/45, Optionen eindeutig', () => {
  assert.deepEqual(pruefeFragen(daten), []);
  assert.ok(daten.fragen.filter((q) => q.typ === 'uhr').length >= 5);
  assert.ok(daten.fragen.filter((q) => q.typ === 'kalender').length >= 5);
});

test('uhrOptionen: erste Option ist die richtige Zeit', () => {
  const q = daten.fragen.find((x) => x.id === 'u03');
  const opt = uhrOptionen(q);
  assert.equal(opt[0], 'halb 5');
  assert.equal(opt.length, 3);
  assert.equal(new Set(opt).size, 3);
});

test('Kalender-Wissen stimmt (Stichproben)', () => {
  const woche = daten.fragen.find((q) => /Tage hat eine Woche/.test(q.frage ?? ''));
  assert.equal(woche.antworten[woche.korrekt], 'Sieben');
  const dienstag = daten.fragen.find((q) => /nach dem Dienstag/.test(q.frage ?? ''));
  assert.equal(dienstag.antworten[dienstag.korrekt], 'Der Mittwoch');
  const jahreszeiten = daten.fragen.find((q) => /Jahreszeiten/.test(q.frage ?? ''));
  assert.equal(jahreszeiten.antworten[jahreszeiten.korrekt], 'Vier');
});

test('pruefeFragen erkennt kaputte Uhr-Frage (Ablenker == richtige Zeit)', () => {
  const kaputt = { fragen: [...daten.fragen, { id: 'x', typ: 'uhr', zeit: { stunde: 3, minute: 0 }, ablenker: [{ stunde: 3, minute: 0 }, { stunde: 5, minute: 0 }], erklaerung: 'Ablenker gleich richtige Zeit – ungültig' }] };
  assert.ok(pruefeFragen(kaputt).some((f) => /klingt wie die richtige/.test(f)));
});

test('Kinder werden nicht bewertet: keine Rang-Funktion, keine Ränge in den Daten, kein Zähler im App-Code', () => {
  assert.equal(logik.rangFuer, undefined, 'logik.mjs hat keine Rang-Funktion mehr');
  assert.ok(!('raenge' in daten), 'die Daten haben keine Rang- oder Punkteschwellen');
  assert.doesNotMatch(appQuelle, /punkte|rangFuer|raenge|von \$\{fragen\.length\} richtig/i, 'app.mjs zählt nichts und zeigt keinen Rang');
  assert.doesNotMatch(appQuelle, /Geschafft|🏆|🌟/, 'kein Geschafft-Titel, kein Pokal, kein Stern');
  assert.match(appQuelle, /Ende der Runde/, 'am Ende steht ein neutraler Titel');
});

test('Speicherregel: speichert die App (setItem), gibt es einen Löschknopf; speichert sie nichts, gibt es keine Karte', () => {
  const speichert = /\.setItem\(/.test(appQuelle);
  const hatKarte = /datenKarte\(|Meine Daten l(ö|oe)schen/.test(appQuelle);
  if (speichert) assert.ok(hatKarte || /removeItem/.test(appQuelle), 'wer speichert, lässt auch löschen');
  else assert.equal(hatKarte, false, 'ohne Speicher keine Karte „Meine Daten löschen“');
  assert.equal(speichert, false, 'diese App speichert nichts');
  assert.doesNotMatch(elternSeite, /Meine Daten l(ö|oe)schen/, 'auch die Eltern-Seite verspricht keinen Löschknopf');
  assert.match(elternSeite, /speichert <strong>nichts<\/strong>/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  // Migration (Entscheidung 33а): der alte Rekord-Schlüssel wird beim Start einmal entfernt, in einer eigenen Zeile.
  assert.ok(appQuelle.split('\n').some((z) => z.trim() === "try { localStorage.removeItem('uhr.rekord'); } catch {}"));
});
