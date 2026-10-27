import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { speicherBefund, verletzung } from '../../../packages/kinderschutz/src/speicher-regel.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
const startSeite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Szenarienbank: Grundstruktur, IDs, keine Rangschwellen', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 8);
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!('raenge' in daten), 'die Daten haben keine Ränge');
});

test('jedes Szenario: 2/1/0-Muster, Warnung, Erklärung', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 30, `${s.id}: Situation fehlt`);
    assert.ok(s.warnung?.length >= 8, `${s.id}: Warnung-Label fehlt`);
    assert.ok(s.erklaerung?.length >= 80, `${s.id}: Erklärung zu kurz`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert);
    assert.ok(werte.every((w) => [0, 1, 2].includes(w)), `${s.id}: Werte nur 0/1/2`);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN sicherer Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine Fallen-Option`);
  }
});

test('didaktische Balance: auch ein gutes Formular (nur Spitzname) kommt vor', () => {
  const alles = JSON.stringify(daten.szenarien).toLowerCase();
  assert.match(alles, /nur.*spitzname|spitzname und ein passwort/, 'positives Beispiel für Kontrast');
});

test('inhaltliche Abdeckung: die verbotenen Datenabfragen + Warnsignale', () => {
  const alles = JSON.stringify(daten.szenarien).toLowerCase();
  for (const [name, muster] of [
    ['Adresse', /adresse/],
    ['Telefon', /telefon|handynummer/],
    ['Foto', /foto/],
    ['Schule', /schule/],
    ['Pflichtfeld/Sternchen', /sternchen|pflichtfeld|pflicht/],
    ['vorangekreuztes Häkchen', /häkchen|vorangekreuzt/],
    ['versteckte Kosten/Abo', /abo|kostenpflichtig/],
  ]) {
    assert.match(alles, muster, `fehlt: ${name}`);
  }
  assert.match(appQuelle, /hilfeInsel/, 'Hilfe-Insel eingebunden');
});

const MIGRATION = "try { localStorage.removeItem('ff.rekord'); } catch {}";

test('Kinder werden nicht bewertet: kein Zähler, kein Rekord, kein Rang, kein Ergebnissatz', () => {
  const code = appQuelle.split('\n').filter((z) => z.trim() !== MIGRATION).join('\n');
  assert.doesNotMatch(code, /punkte|rekord|\brang\b|raenge|treffer|geschafft|Zum Ergebnis/i, 'app.mjs zählt nichts und stuft nichts ein');
  assert.doesNotMatch(code, /⭐|🌟|🏅|🏆/u, 'keine Sterne, keine Medaille, kein Pokal');
  assert.match(code, /Formular \$\{index \+ 1\} von \$\{szenarien\.length\}/, 'Fortschritt der Runde (Formular N von M) bleibt');
  assert.match(code, /Ende der Runde/, 'das Ende heißt neutral „Ende der Runde“');
  assert.match(code, /option\.wert === 2/, 'die Rückmeldung zu jeder Antwort mit Erklärung bleibt');
  assert.doesNotMatch(startSeite, /rekord|punkte/i, 'die Beschreibung verspricht keine Wertung');
  assert.match(elternSeite, /keine Punkte/, 'die Eltern-Seite sagt, dass nichts gewertet wird');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Löschknopf; der alte Schlüssel wird einmal entfernt', () => {
  const befund = speicherBefund(appQuelle);
  assert.equal(befund.speichert, false, 'kein setItem, keine Sprachwahl mit Schlüssel');
  assert.equal(befund.karte, false, 'ohne Speicher keine Karte „Meine Daten löschen“');
  assert.equal(verletzung(befund), null, 'Speicherregel erfüllt');
  assert.doesNotMatch(appQuelle, /setItem|loescheDaten|datenKarte|daten-karte|sprache\.mjs/, 'kein Schreiben, kein Löschbaustein');
  assert.ok(appQuelle.split('\n').includes(MIGRATION), 'Migration: eine Zeile mit Literal');
  assert.equal((appQuelle.match(/ff\.rekord/g) ?? []).length, 1, 'der alte Schlüssel steht nur in dieser Zeile');
  assert.doesNotMatch(elternSeite, /Meine Daten löschen/, 'die Eltern-Seite kennt keine Löschkarte');
  assert.match(elternSeite, /speichert nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
});
