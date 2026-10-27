import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');

test('Szenarienbank: Grundstruktur, IDs, keine Ränge', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 8);
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!('raenge' in daten), 'die Daten haben keine Ränge: das Kind wird nicht bewertet');
});

test('jedes Szenario: 2/1/0-Muster, Schutzmerkmal-Label, Erklärung', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 30, `${s.id}: Situation fehlt`);
    assert.ok(s.schutzmerkmal?.length >= 5, `${s.id}: Schutzmerkmal-Label fehlt`);
    assert.ok(s.erklaerung?.length >= 80, `${s.id}: Erklärung zu kurz`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert);
    assert.ok(werte.every((w) => [0, 1, 2].includes(w)), `${s.id}: Werte nur 0/1/2`);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN sicherer Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine unsichere Option`);
  }
});

test('die drei Schutzmerkmale + Gegenbeispiele kommen vor', () => {
  const alles = JSON.stringify(daten.szenarien).toLowerCase();
  assert.match(alles, /moderation|moderiert/, 'Moderation');
  assert.match(alles, /melde/, 'Melde-Funktion');
  assert.match(alles, /spitzname/, 'Spitzname statt echtem Namen');
  assert.match(alles, /offener.*chat|ohne aufsicht/, 'Gegenbeispiel: unmoderiert');
});

test('kein Grooming-Inhalt: reines Kriterien-Training, Hilfe-Insel eingebunden', () => {
  // Warnzeichen werden benannt (Foto-Aufforderung), aber keine Täter-Dialoge/Details.
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(!/treffen wir uns|wo genau wohnst|unser geheimnis/i.test(alles), 'keine Grooming-Dialoge');
  assert.match(alles, /116 111/, 'Hilfeadresse bei Foto-Aufforderung');
  assert.match(appQuelle, /hilfeInsel/, 'Hilfe-Insel-Baustein eingebunden');
});

test('Kinder werden nicht bewertet: kein Zähler, kein Rang, kein Rekord, kein Ergebnissatz im App-Code', () => {
  assert.doesNotMatch(appQuelle, /\bpunkte\b|maxPunkte|\brang\b|raenge|REKORD_SCHLUESSEL|Dein Rekord|Rekord:/, 'weder Punkte noch Rang noch Rekord');
  assert.doesNotMatch(appQuelle, /Punkten|Geschafft|Zum Ergebnis/, 'kein Ergebnissatz am Ende');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende heißt neutral „Ende der Runde“');
  // 2/1/0 bleibt die Rückmeldung zu jeder Antwort, es wird aber nichts addiert.
  assert.doesNotMatch(appQuelle, /\+=\s*option\.wert/, 'die Werte der Optionen werden nicht summiert');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Löschknopf; der alte Schlüssel wird einmal entfernt', () => {
  assert.doesNotMatch(appQuelle, /setItem|getItem|datenKarte|daten-karte|sprache\.mjs/, 'kein Speicher, keine Löschkarte, keine Sprachwahl');
  const zeilen = appQuelle.split('\n').filter((z) => z.includes('removeItem'));
  assert.deepEqual(zeilen, ["try { localStorage.removeItem('cc.rekord'); } catch {}"], 'genau eine Zeile: der alte Schlüssel, als Literal');
  assert.doesNotMatch(appQuelle, /Meine Daten löschen/, 'ohne Speicher keine Karte');
  assert.match(elternSeite, /speichert nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten löschen/, 'ohne Speicher keine Karte');
});
