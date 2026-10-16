import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  pruefeKatalog, bilanzBereich, bilanzText, naechsterStand, druckMarken,
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

test('pruefeKatalog erkennt Strukturfehler (Anzahl, Präfix, Doppelte, Textlänge)', () => {
  const zuWenig = kopie();
  zuWenig.bereiche[0].angebote.pop();
  assert.ok(pruefeKatalog(zuWenig).some((f) => f.includes('6 Prüfpunkte')));

  const zuVieleAuswahl = kopie();
  zuVieleAuswahl.auswahl.push({ id: 'extra', text: 'zu viel' });
  assert.ok(pruefeKatalog(zuVieleAuswahl).some((f) => f.includes('3 Auswahl')));

  const doppelt = kopie();
  doppelt.bereiche[1].angebote[0].id = doppelt.bereiche[0].angebote[0].id;
  assert.ok(pruefeKatalog(doppelt).some((f) => f.includes('doppelt')));

  const praefix = kopie();
  praefix.bereiche[2].angebote[0].id = 'fremd-1';
  assert.ok(pruefeKatalog(praefix).some((f) => f.includes('gehören')));

  const kurz = kopie();
  kurz.bereiche[3].angebote[1].text = 'zu kurz';
  assert.ok(pruefeKatalog(kurz).some((f) => f.includes('kürzer')));
});

test('pruefeKatalog erkennt Merkmal-Fehler (Verweis, Seite, Kennung, Wortlaut, ungenutzt)', () => {
  const ohneMerkmal = kopie();
  delete ohneMerkmal.bereiche[0].angebote[0].quelleMerkmal;
  assert.ok(pruefeKatalog(ohneMerkmal).some((f) => f.includes('Merkmal-Register')));

  const falscheSeite = kopie();
  falscheSeite.merkmale['S18.6'].seite = 17;
  assert.ok(pruefeKatalog(falscheSeite).some((f) => f.includes('Seite passt nicht')));

  const kaputteKennung = kopie();
  kaputteKennung.merkmale['X1'] = { seite: 1, wortlaut: 'x' };
  assert.ok(pruefeKatalog(kaputteKennung).some((f) => f.includes('Kennung ungültig')));

  const ohneWortlaut = kopie();
  ohneWortlaut.merkmale['S18.6'].wortlaut = '';
  assert.ok(pruefeKatalog(ohneWortlaut).some((f) => f.includes('Wortlaut fehlt')));

  const ungenutzt = kopie();
  ungenutzt.merkmale['S17.1'] = { seite: 17, wortlaut: 'определение физического состояния, здоровья' };
  assert.ok(pruefeKatalog(ungenutzt).some((f) => f.includes('wird aber von keinem')));
});

test('bilanzBereich zählt nur eigene, bekannte Angaben des Bereichs', () => {
  const b = bereich('bewegung');
  const [p1, p2, p3, p4] = b.angebote.map((p) => p.id);
  const auswahl = {
    [p1]: AUSWAHL.umgesetzt,
    [p2]: AUSWAHL.umgesetzt,
    [p3]: AUSWAHL.offen,
    [p4]: AUSWAHL.nichtZu,
    fremd: AUSWAHL.umgesetzt,
    toString: AUSWAHL.umgesetzt,
  };
  assert.deepEqual(bilanzBereich(b, auswahl), { erfuellt: 2, offen: 1, nichtZu: 1, gesamt: 6 });
  assert.deepEqual(bilanzBereich(b, {}), { erfuellt: 0, offen: 0, nichtZu: 0, gesamt: 6 });
  assert.deepEqual(bilanzBereich(b, undefined), { erfuellt: 0, offen: 0, nichtZu: 0, gesamt: 6 });
});

test('bilanzText: Zählung je Bereich im Wortlaut, ohne Prozentwert', () => {
  const text = bilanzText({ erfuellt: 3, offen: 1, nichtZu: 0, gesamt: 6 });
  assert.equal(text, 'erfüllt: 3 von 6 · noch offen: 1 · trifft nicht zu: 0');
  assert.ok(!text.includes('%'));
});

test('naechsterStand: gleiche Wahl nimmt sie zurück, andere Wahl ersetzt sie, erste Wahl setzt sie', () => {
  assert.equal(naechsterStand(undefined, AUSWAHL.umgesetzt), AUSWAHL.umgesetzt);
  assert.equal(naechsterStand(AUSWAHL.umgesetzt, AUSWAHL.umgesetzt), null);
  assert.equal(naechsterStand(AUSWAHL.offen, AUSWAHL.nichtZu), AUSWAHL.nichtZu);
});

test('druckMarken: ohne Wahl nur leere Kästchen, mit Wahl genau ein gefülltes', () => {
  const optionen = katalog.auswahl;
  assert.deepEqual(druckMarken(optionen, null), ['☐ umgesetzt', '☐ noch offen', '☐ trifft nicht zu']);
  assert.deepEqual(druckMarken(optionen, AUSWAHL.offen), ['☐ umgesetzt', '☒ noch offen', '☐ trifft nicht zu']);
});

test('eigenentwurfsHinweis: nennt die Merkmal-Kennung und ist für jeden Prüfpunkt gesetzt', () => {
  assert.equal(eigenentwurfsHinweis('S18.6'), 'Eigenentwurf nach Merkmal S18.6');
  for (const b of katalog.bereiche) {
    for (const p of b.angebote) {
      assert.ok(eigenentwurfsHinweis(p.quelleMerkmal).startsWith('Eigenentwurf nach Merkmal S'));
    }
  }
});

test('bereinigeAltbestand: entfernt nur den Altbestand und schreibt nie', () => {
  const aufrufe = [];
  const speicher = {
    removeItem: (k) => aufrufe.push(['remove', k]),
    setItem: () => { throw new Error('setItem darf nicht aufgerufen werden'); },
  };
  assert.equal(bereinigeAltbestand(speicher), true);
  assert.deepEqual(aufrufe, [['remove', ALTER_SCHLUESSEL]]);
  assert.equal(ALTER_SCHLUESSEL, 'ek.daten');
});

test('bereinigeAltbestand: gesperrter oder fehlender Speicher bricht nichts ab', () => {
  const gesperrt = { removeItem: () => { throw new Error('SecurityError'); } };
  assert.equal(bereinigeAltbestand(gesperrt), false);
  assert.equal(bereinigeAltbestand(null), false, 'ohne localStorage in der Testumgebung: kein Absturz');
});
