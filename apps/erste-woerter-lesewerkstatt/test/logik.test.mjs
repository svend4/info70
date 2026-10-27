import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { istLautgetreu, pruefeMaterial, hoerOptionen, bildOptionen, silbenTeilen } from '../logik.mjs';
import { speicherBefund, verletzung } from '../../../packages/kinderschutz/src/speicher-regel.mjs';

const lese = (name) => readFile(new URL(`../${name}`, import.meta.url), 'utf8');
const daten = JSON.parse(await lese('daten/material.json'));
const appQuelle = await lese('app.mjs');
const logikQuelle = await lese('logik.mjs');
const elternSeite = await lese('eltern.html');
const startSeite = await lese('index.html');

test('Material gültig: 5 Vokale, 8 Konsonanten, KV-Silben, lautgetreue Wörter', () => {
  assert.deepEqual(pruefeMaterial(daten), []);
  assert.deepEqual(daten.vokale, ['A', 'E', 'I', 'O', 'U']);
  assert.equal(daten.konsonanten.length, 8);
  assert.ok(daten.woerter.length >= 10);
});

test('istLautgetreu: erlaubt OMA/ESEL, verbietet Dehnungs-h und Doppelbuchstaben', () => {
  assert.equal(istLautgetreu('OMA'), true);
  assert.equal(istLautgetreu('ESEL'), true);
  assert.equal(istLautgetreu('TOMATE'), true);
  assert.equal(istLautgetreu('FAHNE'), false, 'Dehnungs-h nach A');
  assert.equal(istLautgetreu('BALL'), false, 'Doppelbuchstabe');
  assert.equal(istLautgetreu('QUARK'), false, 'Q nicht im Anfangs-Alphabet');
  assert.equal(istLautgetreu('HOSE'), true, 'H am Wortanfang ist erlaubt');
});

test('hoerOptionen: 3 eindeutige, richtige an Position 0', () => {
  const erste = (l) => l[0];
  const opt = hoerOptionen('A', daten.vokale, erste);
  assert.equal(opt.length, 3);
  assert.equal(opt[0], 'A');
  assert.equal(new Set(opt).size, 3);
  assert.ok(opt.every((o) => daten.vokale.includes(o)));
});

test('bildOptionen: richtiges Emoji + 2 fremde, keine Duplikate', () => {
  const erste = (l) => l[0];
  const oma = daten.woerter.find((w) => w.wort === 'OMA');
  const opt = bildOptionen(oma, daten.woerter, erste);
  assert.equal(opt.length, 3);
  assert.equal(opt[0].richtig, true);
  assert.equal(opt[0].emoji, '👵');
  assert.equal(opt.filter((o) => o.richtig).length, 1);
  assert.equal(new Set(opt.map((o) => o.emoji)).size, 3);
});

test('silbenTeilen: KV-Silbenbögen (OMA→O-MA, TOMATE→TO-MA-TE, MOND bleibt ganz)', () => {
  assert.deepEqual(silbenTeilen('OMA'), ['O', 'MA']);
  assert.deepEqual(silbenTeilen('MAMA'), ['MA', 'MA']);
  assert.deepEqual(silbenTeilen('TOMATE'), ['TO', 'MA', 'TE']);
  assert.deepEqual(silbenTeilen('BANANE'), ['BA', 'NA', 'NE']);
  assert.deepEqual(silbenTeilen('MOND'), ['MOND']);
  assert.deepEqual(silbenTeilen('ESEL'), ['E', 'SEL']);
});

test('jedes Wort der Bank lässt sich in Silben teilen (nicht leer)', () => {
  for (const w of daten.woerter) {
    const teile = silbenTeilen(w.wort);
    assert.ok(teile.length >= 1, w.wort);
    assert.equal(teile.join(''), w.wort, `${w.wort}: Silben ergeben das Wort`);
  }
});

const MIGRATION = "try { localStorage.removeItem('lese.rekord'); } catch {}";

test('Kinder werden nicht bewertet: kein Zähler, kein Rekord, keine Sterne, kein Ergebnissatz', () => {
  const code = (appQuelle + '\n' + logikQuelle).split('\n').filter((z) => z.trim() !== MIGRATION).join('\n');
  assert.doesNotMatch(code, /punkte|rekord|\brang\b|treffer|geschafft/i, 'App-Code zählt nichts und stuft nichts ein');
  assert.doesNotMatch(code, /⭐|🌟|🏅|🏆/u, 'keine Sterne, keine Medaille, kein Pokal');
  assert.match(appQuelle, /Aufgabe \$\{index \+ 1\} von \$\{aufgaben\.length\}/, 'Fortschritt der Runde (Aufgabe N von M) bleibt');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende heißt neutral „Ende der Runde“');
  assert.ok(!('raenge' in daten), 'die Daten haben keine Ränge');
  assert.doesNotMatch(startSeite, /rekord|punkte/i, 'die Beschreibung verspricht keine Wertung');
  assert.match(elternSeite, /keine Punkte/, 'die Eltern-Seite sagt, dass nichts gewertet wird');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Löschknopf; der alte Schlüssel wird einmal entfernt', () => {
  const code = appQuelle + '\n' + logikQuelle;
  const befund = speicherBefund(code);
  assert.equal(befund.speichert, false, 'kein setItem, keine Sprachwahl mit Schlüssel');
  assert.equal(befund.karte, false, 'ohne Speicher keine Karte „Meine Daten löschen“');
  assert.equal(verletzung(befund), null, 'Speicherregel erfüllt');
  assert.doesNotMatch(code, /setItem|datenKarte|daten-karte|sprache\.mjs/, 'kein Schreiben, keine gemeinsame Löschkarte');
  assert.ok(appQuelle.split('\n').includes(MIGRATION), 'Migration: eine Zeile mit Literal');
  assert.equal((appQuelle.match(/lese\.rekord/g) ?? []).length, 1, 'der alte Schlüssel steht nur in dieser Zeile');
  assert.doesNotMatch(elternSeite, /Meine Daten löschen/, 'die Eltern-Seite kennt keine Löschkarte');
  assert.match(elternSeite, /speichert nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
});
