import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');

test('Szenarienbank: Grundstruktur, IDs, keine Ränge in den Daten', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 10, 'mindestens 10 Szenarien');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!('raenge' in daten), 'die Daten haben keine Ränge');
});

test('jedes Szenario: Situation, Erklärung, genau ein stärkster Zug (wert 2), eine Falle (wert 0)', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 20, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(s.erklaerung?.length >= 40, `${s.id}: Erklärung fehlt/zu kurz (dort passiert das Lernen!)`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    for (const o of s.optionen) {
      assert.ok(o.text?.length >= 5, `${s.id}: Optionstext fehlt`);
      assert.ok([0, 1, 2].includes(o.wert), `${s.id}: wert muss 0, 1 oder 2 sein`);
    }
    const werte = s.optionen.map((o) => o.wert);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN stärkster Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine Option, die es schwerer macht`);
  }
});

test('didaktische Schwerpunkte: Pause, Plan/Schritte, Hilfe holen kommen als Strategien vor', () => {
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/pause/i.test(alles), 'Strategie „erst Pause“ muss vorkommen');
  assert.ok(/plan|schritt/i.test(alles), 'Strategie „Plan / kleine Schritte“ muss vorkommen');
  assert.ok(/hilfe/i.test(alles), 'Strategie „um Hilfe bitten“ muss vorkommen');
});

test('Kinder werden nicht bewertet: kein Zähler, kein Rang, kein Ergebnis im App-Code; am Ende „Ende der Runde“', () => {
  assert.doesNotMatch(appQuelle, /punkte|maxPunkte|raenge|rang\b|🏆|🌟/i, 'app.mjs führt weder Zähler noch Rang noch Stern');
  assert.doesNotMatch(appQuelle, /Ergebnis|Geschafft/, 'kein „Ergebnis“ und kein „Geschafft“ im Text');
  assert.doesNotMatch(appQuelle, /🧗🧗/, 'die Rückmeldung zählt keine Symbole');
  assert.match(appQuelle, /Situation \$\{index \+ 1\} von \$\{szenarien\.length\}/, 'der Fortschritt der Runde („Situation n von m“) bleibt');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende der Runde ist neutral benannt');
  assert.match(appQuelle, /Starker Zug!/, 'die Rückmeldung zu jeder Antwort bleibt');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Löschknopf; der alte Schlüssel wird einmal entfernt', () => {
  assert.doesNotMatch(appQuelle, /setItem|getItem|datenKarte|loescheDaten|daten-karte|sprache\.mjs/, 'kein Speicher, keine Löschkarte, keine Sprachwahl');
  assert.doesNotMatch(appQuelle, /Meine Daten l(ö|oe)schen/, 'ohne Speicher keine Karte');
  assert.match(appQuelle, /^try \{ localStorage\.removeItem\('isd\.rekord'\); \} catch \{\}$/m, 'der alte Rekord-Schlüssel wird beim Start in einer Zeile entfernt');
  assert.equal((appQuelle.match(/isd\.rekord/g) ?? []).length, 1, 'der alte Schlüssel steht nur in dieser Zeile');
  assert.match(elternSeite, /speichert nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten l(ö|oe)schen/, 'ohne Speicher keine Karte');
});
