import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import { baueKarten, pruefeFragenListe } from '../karten.mjs';

const DECKS = ['app-rechte-quiz', 'kinderrechte-entdecker', 'koeder-quiz', 'darf-ich-posten'];

test('baueKarten: binaer -> Frage vorne, Antwort + Erklärung hinten', () => {
  const karten = baueKarten([{ typ: 'binaer', kategorie: 'Test', aussage: 'Katzen können fliegen', korrekt: 'nein', erklaerung: 'Nein, Katzen fliegen nicht.' }]);
  assert.equal(karten.length, 1);
  assert.match(karten[0].vorne, /Katzen können fliegen/);
  assert.equal(karten[0].antwort, '❌ Stimmt nicht');
  assert.match(karten[0].hinten, /Stimmt nicht/);
  assert.match(karten[0].hinten, /fliegen nicht/);
  assert.equal(karten[0].nr, 1);
});

test('baueKarten: wahl -> Frage mit Optionen vorne, richtige Antwort hinten', () => {
  const karten = baueKarten([{ typ: 'wahl', kategorie: 'Test', frage: 'Was tun?', antworten: ['Melden', 'Ignorieren'], korrekt: 0, erklaerung: 'Melden hilft.' }]);
  assert.match(karten[0].vorne, /Was tun\?/);
  assert.match(karten[0].vorne, /A\) Melden/);
  assert.equal(karten[0].antwort, 'Melden');
  assert.match(karten[0].hinten, /Richtig: Melden/);
});

test('pruefeFragenListe: leere Liste und kaputte Fragen werden erkannt', () => {
  assert.deepEqual(pruefeFragenListe([]), ['Keine Fragen gefunden']);
  assert.ok(pruefeFragenListe([{ typ: 'binaer', aussage: 'x', korrekt: 'vielleicht', erklaerung: 'e' }]).length >= 1);
  assert.ok(pruefeFragenListe([{ typ: 'binaer', aussage: 'x', korrekt: 'ja' }]).some((f) => /Erklärung fehlt/.test(f)));
});

test('Alle angebotenen Decks existieren und ergeben gültige Karten', async () => {
  for (const deck of DECKS) {
    const url = new URL(`../../${deck}/daten/fragen.json`, import.meta.url);
    await assert.doesNotReject(access(url), `Deck fehlt: ${deck}`);
    const daten = JSON.parse(await readFile(url, 'utf8'));
    const fragen = daten.fragen ?? daten;
    assert.deepEqual(pruefeFragenListe(fragen), [], `Deck ${deck} hat ungültige Fragen`);
    const karten = baueKarten(fragen);
    assert.equal(karten.length, fragen.length);
    assert.ok(karten.every((k) => k.vorne && k.hinten), `Deck ${deck}: leere Kartenseite`);
  }
});
