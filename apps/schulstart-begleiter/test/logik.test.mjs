import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  pruefeKatalog, stand, setzeAuswahl, bilanzBereich, bilanzText, druckMarken,
  eigenentwurfsHinweis, bereinigeAltbestand, ALTER_SCHLUESSEL, AUSWAHL,
} from '../logik.mjs';

const katalog = JSON.parse(await readFile(new URL('../daten/indikatoren.json', import.meta.url), 'utf8'));
const bereich = (id) => katalog.bereiche.find((b) => b.id === id);
const kopie = () => structuredClone(katalog);

test('pruefeKatalog: gültiger Katalog ist fehlerfrei, fehlende Daten werden abgelehnt', () => {
  assert.deepEqual(pruefeKatalog(katalog), []);
  assert.ok(pruefeKatalog(null).length > 0);
  assert.ok(pruefeKatalog({}).length > 0);
});

test('pruefeKatalog erkennt Strukturfehler (Anzahl, Präfix, doppelte Kennung, Textlänge, Auswahl)', () => {
  const zuWenig = kopie();
  zuWenig.bereiche[0].angebote.pop();
  assert.ok(pruefeKatalog(zuWenig).some((f) => f.includes('6 Angebote')));

  const zuVieleAuswahl = kopie();
  zuVieleAuswahl.auswahl.push({ id: 'extra', text: 'zu viel' });
  assert.ok(pruefeKatalog(zuVieleAuswahl).some((f) => f.includes('3 Auswahl')));

  const fehltAuswahl = kopie();
  fehltAuswahl.auswahl = fehltAuswahl.auswahl.filter((a) => a.id !== AUSWAHL.nichtZu);
  assert.ok(pruefeKatalog(fehltAuswahl).some((f) => f.includes('fehlt: nicht-zutreffend')));

  const doppelt = kopie();
  doppelt.bereiche[1].angebote[0].id = doppelt.bereiche[0].angebote[0].id;
  assert.ok(pruefeKatalog(doppelt).some((f) => f.includes('doppelt')));

  const praefix = kopie();
  praefix.bereiche[2].angebote[0].id = 'fremd-a1';
  assert.ok(pruefeKatalog(praefix).some((f) => f.includes('gehören')));

  const kurz = kopie();
  kurz.bereiche[3].angebote[1].text = 'zu kurz';
  assert.ok(pruefeKatalog(kurz).some((f) => f.includes('kürzer')));
});

test('pruefeKatalog erkennt Merkmal-Fehler (fehlend, fremder Bereich, doppelt verwendet)', () => {
  const ohneMerkmal = kopie();
  delete ohneMerkmal.bereiche[0].angebote[0].quelleMerkmal;
  assert.ok(pruefeKatalog(ohneMerkmal).some((f) => f.includes('quelleMerkmal')));

  const fremd = kopie();
  fremd.bereiche[0].angebote[0].quelleMerkmal = 'mathe-1';
  assert.ok(pruefeKatalog(fremd).some((f) => f.includes('muss ein Merkmal dieses Bereichs sein')));

  const doppeltMerkmal = kopie();
  doppeltMerkmal.bereiche[0].angebote[1].quelleMerkmal = 'sprache-1';
  assert.ok(pruefeKatalog(doppeltMerkmal).some((f) => f.includes('doppelt verwendet')));
});

test('stand: ohne Angabe oder mit unbekanntem Wert gilt „offen“, gültige Wahl zählt', () => {
  assert.equal(stand(undefined, 'sprache-a1'), AUSWAHL.offen);
  assert.equal(stand({}, 'sprache-a1'), AUSWAHL.offen);
  assert.equal(stand({ 'sprache-a1': 'quatsch' }, 'sprache-a1'), AUSWAHL.offen);
  assert.equal(stand({ 'sprache-a1': AUSWAHL.angeboten }, 'sprache-a1'), AUSWAHL.angeboten);
});

test('setzeAuswahl: liefert ein neues Objekt, verwirft unbekannte Werte', () => {
  const vorher = { 'sprache-a1': AUSWAHL.offen };
  const nachher = setzeAuswahl(vorher, 'sprache-a1', AUSWAHL.nichtZu);
  assert.equal(nachher['sprache-a1'], AUSWAHL.nichtZu);
  assert.equal(vorher['sprache-a1'], AUSWAHL.offen, 'das Original bleibt unverändert');
  const unveraendert = setzeAuswahl(vorher, 'sprache-a1', 'quatsch');
  assert.equal(unveraendert['sprache-a1'], AUSWAHL.offen);
});

test('bilanzBereich zählt nur die Angebote des Bereichs, unbekannte Werte gelten als offen', () => {
  const b = bereich('motorik');
  const [a1, a2, a3, a4] = b.angebote.map((p) => p.id);
  const auswahl = {
    [a1]: AUSWAHL.angeboten,
    [a2]: AUSWAHL.angeboten,
    [a3]: AUSWAHL.nichtZu,
    [a4]: 'quatsch',
    'sprache-a1': AUSWAHL.angeboten,
    fremd: AUSWAHL.angeboten,
  };
  assert.deepEqual(bilanzBereich(b, auswahl), { angeboten: 2, offen: 3, nichtZu: 1, gesamt: 6 });
  assert.deepEqual(bilanzBereich(b, {}), { angeboten: 0, offen: 6, nichtZu: 0, gesamt: 6 });
  assert.deepEqual(bilanzBereich(b, undefined), { angeboten: 0, offen: 6, nichtZu: 0, gesamt: 6 });
});

test('bilanzText: Zählung je Bereich im Wortlaut, ohne Prozentwert und ohne Gesamtzahl', () => {
  const text = bilanzText({ angeboten: 3, offen: 2, nichtZu: 1, gesamt: 6 });
  assert.equal(text, 'angeboten: 3 von 6 · noch offen: 2 · trifft nicht zu: 1');
  assert.ok(!text.includes('%'));
  assert.ok(!text.includes('von 30'), 'keine Gesamtzahl über alle Bereiche');
});

test('druckMarken: genau ein gefülltes Kästchen für die gewählte Auswahl', () => {
  const optionen = katalog.auswahl;
  assert.deepEqual(druckMarken(optionen, AUSWAHL.offen), ['☐ angeboten', '☒ noch offen', '☐ trifft nicht zu']);
  assert.deepEqual(druckMarken(optionen, AUSWAHL.angeboten), ['☒ angeboten', '☐ noch offen', '☐ trifft nicht zu']);
});

test('eigenentwurfsHinweis: nennt die Merkmal-Kennung und ist für jedes Angebot gesetzt', () => {
  assert.equal(eigenentwurfsHinweis('sprache-1'), 'Eigenentwurf nach Merkmal sprache-1');
  for (const b of katalog.bereiche) {
    for (const p of b.angebote) {
      assert.equal(eigenentwurfsHinweis(p.quelleMerkmal), `Eigenentwurf nach Merkmal ${p.quelleMerkmal}`);
    }
  }
});

test('ALTER_SCHLUESSEL ist ssb.daten; bereinigeAltbestand entfernt nur diesen Schlüssel und schreibt nie', () => {
  assert.equal(ALTER_SCHLUESSEL, 'ssb.daten');
  const aufrufe = [];
  const speicher = {
    removeItem: (k) => aufrufe.push(['remove', k]),
    setItem: () => { throw new Error('setItem darf nicht aufgerufen werden'); },
  };
  assert.equal(bereinigeAltbestand(speicher), true);
  assert.deepEqual(aufrufe, [['remove', 'ssb.daten']]);
});

test('bereinigeAltbestand: gesperrter Speicher bricht nichts ab', () => {
  const gesperrt = { removeItem: () => { throw new Error('SecurityError'); } };
  assert.equal(bereinigeAltbestand(gesperrt), false);
});
