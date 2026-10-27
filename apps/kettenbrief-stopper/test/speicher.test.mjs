import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { erstelleSprache } from '../../../packages/kinder-ui/js/sprache.mjs';
import { loescheDaten } from '../../../packages/kinder-ui/js/daten-karte.mjs';
import { speicherBefund, verletzung } from '../../../packages/kinderschutz/src/speicher-regel.mjs';

// Speicherregel (Entscheidung 30б): Die App merkt sich die Sprachwahl (Schlüssel ks.sprache),
// also hat sie einen Löschknopf dafür. Gespeichert wird sonst nichts.
const lese = (name) => readFile(new URL(`../${name}`, import.meta.url), 'utf8');
const kataloge = JSON.parse(await lese('daten/sprachen.json'));
const SCHLUESSEL = 'ks.sprache';

function attrappenSpeicher(start = {}) {
  const daten = new Map(Object.entries(start));
  return {
    daten,
    getItem: (k) => (daten.has(k) ? daten.get(k) : null),
    setItem: (k, v) => { daten.set(k, String(v)); },
    removeItem: (k) => { daten.delete(k); },
  };
}

test('Speicher und Löschknopf gehören zusammen: der Schlüssel der Sprachwahl wird gelöscht, sonst nichts', async () => {
  const app = await lese('app.mjs');
  assert.ok(app.includes(`const SPRACH_SCHLUESSEL = '${SCHLUESSEL}';`), 'ein Schlüssel als Konstante');
  assert.ok(app.includes('speicherSchluessel: SPRACH_SCHLUESSEL'), 'die Sprachwahl nutzt diesen Schlüssel');
  assert.ok(app.includes('loescheDaten(SPRACH_SCHLUESSEL)'), 'der Löschknopf löscht genau diesen Schlüssel');
  assert.ok(app.includes("from '../../packages/kinder-ui/js/daten-karte.mjs'"), 'gemeinsamer Baustein zum Löschen');
  assert.equal((app.match(/\.setItem\(/g) ?? []).length, 0, 'App-Code schreibt nicht selbst');
  const befund = speicherBefund(app);
  assert.equal(befund.speichert, true, 'die Sprachwahl wird gespeichert');
  assert.equal(befund.loeschbar, true, 'und lässt sich löschen');
  assert.equal(verletzung(befund), null, 'Speicherregel erfüllt');
});

test('Löschknopf: entfernt die Sprachwahl vom Gerät, andere Einträge bleiben', () => {
  const vorher = globalThis.localStorage;
  const speicher = attrappenSpeicher({ 'andere.app': 'bleibt' });
  globalThis.localStorage = speicher;
  try {
    const sprache = erstelleSprache({ kataloge, standard: 'de', speicherSchluessel: SCHLUESSEL });
    assert.equal(sprache.setze('en'), true);
    assert.equal(speicher.getItem(SCHLUESSEL), 'en', 'die Sprachwahl liegt unter ks.sprache');
    assert.equal(sprache.setze('de-ls'), true);
    assert.equal(speicher.getItem(SCHLUESSEL), 'de-ls', 'auch die Leichte Sprache liegt unter demselben Schlüssel');
    assert.equal(loescheDaten(SCHLUESSEL, speicher), 1, 'ein Eintrag war belegt');
    assert.equal(speicher.getItem(SCHLUESSEL), null, 'die Sprachwahl ist weg');
    assert.equal(speicher.getItem('andere.app'), 'bleibt', 'Einträge anderer Apps bleiben');
    assert.deepEqual([...speicher.daten.keys()], ['andere.app'], 'sonst liegt nichts auf dem Gerät');
    // Nach dem Löschen startet eine neue Sitzung wieder mit der Standardsprache.
    assert.equal(erstelleSprache({ kataloge, standard: 'de', speicherSchluessel: SCHLUESSEL }).aktuelle(), 'de');
  } finally {
    if (vorher === undefined) delete globalThis.localStorage; else globalThis.localStorage = vorher;
  }
});

test('Texte: Hinweis, Knopf und Meldung gibt es in jeder Fassung; keine Aussage „speichert nichts“ mehr', () => {
  for (const code of Object.keys(kataloge)) {
    for (const schluessel of ['daten_hinweis', 'daten_loeschen', 'daten_geloescht']) {
      assert.ok(typeof kataloge[code][schluessel] === 'string' && kataloge[code][schluessel].length >= 10, `${code}/${schluessel}`);
    }
    assert.equal(kataloge[code].speichert_nichts, undefined, `${code}: alter Satz „speichert nichts“ ist ersetzt`);
    assert.ok(!/speichert nichts|saves nothing/i.test(JSON.stringify(kataloge[code])), `${code}: falsche Aussage über den Speicher`);
    assert.match(kataloge[code].daten_hinweis, /Sprach|language/i, `${code}: der Hinweis nennt, was gespeichert wird`);
  }
  assert.equal(kataloge.de.daten_loeschen, 'Meine Daten löschen');
  assert.equal(kataloge.en.daten_loeschen, 'Delete my data');
});

test('Eltern-Seite und Startseite: sagen, dass nur die Sprachwahl gespeichert wird und wie man sie löscht', async () => {
  const eltern = await lese('eltern.html');
  assert.ok(!eltern.includes('speichert überhaupt nichts'), 'eltern.html: alter Satz entfernt');
  assert.ok(eltern.includes('Gespeichert wird nur die Sprachwahl'), 'eltern.html nennt den Speicher');
  assert.ok(eltern.includes('Meine Daten löschen'), 'eltern.html nennt den Löschknopf');
  const index = await lese('index.html');
  assert.ok(!/speichert nichts/.test(index), 'index.html: keine falsche Aussage');
});
