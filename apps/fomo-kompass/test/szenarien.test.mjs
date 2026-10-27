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
  assert.ok(daten.szenarien.length >= 10, 'mindestens 10 Szenarien');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!('raenge' in daten), 'die Daten haben keine Ränge');
});

test('jedes Szenario: 2/1/0-Muster mit genau je einem 0/1/2, Mechanik + Tipp', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 40, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(s.mechanik?.length >= 25, `${s.id}: FOMO-Mechanik muss benannt sein`);
    assert.ok(s.tipp?.length >= 60, `${s.id}: Tipp zu kurz (dort passiert das Lernen)`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert).sort();
    assert.deepEqual(werte, [0, 1, 2], `${s.id}: Werte müssen genau 0, 1 und 2 sein`);
    for (const o of s.optionen) assert.ok(o.text?.length >= 10, `${s.id}: Optionstext fehlt`);
  }
});

test('Mechanik-Breite: Streak, Autoplay/Endlos, Countdown/Verknappung, Lesebestätigung, Likes, Benachrichtigung', () => {
  const alles = JSON.stringify(daten.szenarien).toLowerCase();
  for (const [name, muster] of [
    ['Streak', /streak/],
    ['Autoplay/Endlos', /autoplay|endlos/],
    ['Countdown/Verknappung', /countdown|verknappung|einmalig/],
    ['Lesebestätigung', /gelesen|lesebest/],
    ['Likes', /like/],
    ['Benachrichtigung', /benachrichtigung/],
  ]) {
    assert.match(alles, muster, `Mechanik fehlt: ${name}`);
  }
});

test('Didaktik: stärkster Zug ist Grenze/Selbstschutz, nie Rückzug aus Wut; Hilfe 116 111', () => {
  for (const s of daten.szenarien) {
    const beste = s.optionen.find((o) => o.wert === 2).text.toLowerCase();
    assert.ok(!/(dumm|hasse|rache|löschen aus wut)/.test(beste), `${s.id}: stärkster Zug soll ruhig/selbstbestimmt sein`);
  }
  assert.ok(appQuelle.includes('116 111'), 'Hilfeadresse in der App');
  assert.match(appQuelle, /jetzt oder nie/i, 'Kernbotschaft „fast nichts ist jetzt oder nie“');
});

const MIGRATION = "try { localStorage.removeItem('fomo.rekord'); } catch {}";

test('Kinder werden nicht bewertet: kein Zähler, kein Rekord, kein Rang, kein Ergebnissatz', () => {
  const code = appQuelle.split('\n').filter((z) => z.trim() !== MIGRATION).join('\n');
  assert.doesNotMatch(code, /punkte|rekord|\brang\b|raenge|treffer|geschafft|Zum Ergebnis/i, 'app.mjs zählt nichts und stuft nichts ein');
  assert.doesNotMatch(code, /⭐|🌟|🏅|🏆/u, 'keine Sterne, keine Medaille, kein Pokal');
  assert.match(code, /Situation \$\{index \+ 1\} von \$\{szenarien\.length\}/, 'Fortschritt der Runde (Situation N von M) bleibt');
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
  assert.doesNotMatch(appQuelle, /Meine Daten löschen/, 'kein Löschknopf ohne Speicher');
  assert.ok(appQuelle.split('\n').includes(MIGRATION), 'Migration: eine Zeile mit Literal');
  assert.equal((appQuelle.match(/fomo\.rekord/g) ?? []).length, 1, 'der alte Schlüssel steht nur in dieser Zeile');
  assert.doesNotMatch(elternSeite, /Meine Daten löschen/, 'die Eltern-Seite kennt keine Löschkarte');
  assert.match(elternSeite, /speichert nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
});
