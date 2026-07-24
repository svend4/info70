import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  FORMEN, FARBEN, REGELN, formVon, farbeVon, regelVon, kachelGleich, kachelName,
  musterFolge, periodeVon, naechsteKachel, baueAufgabe, aktiveFelder,
  spiegelIndex, istSymmetrisch, pruefeVorlagen,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/vorlagen.json', import.meta.url), 'utf8'));

const A = { form: 'raute', farbe: 'rot' };
const B = { form: 'kreis', farbe: 'blau' };

/** Wähler für baueAufgabe: erst die gewünschte Regel, dann immer das erste. */
function waehler(regel) {
  let n = 0;
  return (liste) => (n++ === 0 ? regel : liste[0]);
}

/** Minimal gültige Vorlagen für die Negativ-Proben. */
const gueltig = () => ({
  version: 1,
  vorlagen: [1, 2, 3, 4].map((n) => ({
    id: `v${n}`,
    name: `Vorlage ${n}`,
    emoji: '🧵',
    spalten: 4,
    idee: 'Leg ringsum einen Rand und dann die Mitte.',
    raster: ['####', '.##.'],
  })),
});

test('Vorlagen sind gültig: 5 Stück, Umrisse spiegelsymmetrisch, genug Felder', () => {
  assert.deepEqual(pruefeVorlagen(daten), []);
  assert.equal(daten.vorlagen.length, 5);
  for (const v of daten.vorlagen) {
    const felder = aktiveFelder(v);
    assert.equal(felder.length, v.spalten * v.raster.length, `${v.id}: Rastergröße`);
    assert.ok(felder.filter(Boolean).length >= 6, `${v.id}: genug Felder`);
    for (let i = 0; i < felder.length; i++) {
      assert.equal(felder[i], felder[spiegelIndex(i, v.spalten)], `${v.id}: Umriss symmetrisch`);
    }
  }
  assert.deepEqual(daten.vorlagen.map((v) => v.id), ['borduere', 'teppich', 'teller', 'hemd', 'osterei']);
});

test('musterFolge legt die Regeln aus – die Periode ist die Musterlänge', () => {
  assert.deepEqual(musterFolge('wiederholung', [A, B], 4), [A, A, A, A]);
  assert.deepEqual(musterFolge('wechsel', [A, B], 4), [A, B, A, B]);
  assert.deepEqual(musterFolge('rhythmus', [A, B], 6), [A, A, B, A, A, B]);
  assert.deepEqual(musterFolge('spiegel', [A, B], 4), [A, B, B, A]);
  assert.deepEqual(musterFolge('gibtsnicht', [A, B], 4), []);
  for (const regel of REGELN) {
    assert.equal(periodeVon(musterFolge(regel.id, [A, B], 12)), regel.muster.length, regel.id);
  }
  assert.equal(periodeVon([A, B, A]), 2);
  assert.equal(periodeVon([A, B, B]), 3); // keine kürzere Periode möglich
  assert.equal(periodeVon([]), 0);
});

test('naechsteKachel setzt die Periode fort', () => {
  assert.deepEqual(naechsteKachel([A, B, A, B]), A);
  assert.deepEqual(naechsteKachel([A, A, B, A, A, B]), A);
  assert.deepEqual(naechsteKachel([A, B, B, A, A, B]), B); // Spiegel-Regel
  assert.deepEqual(naechsteKachel([A]), A);
  assert.equal(naechsteKachel([]), null);
  assert.equal(naechsteKachel(null), null);
});

test('baueAufgabe ist mit injiziertem Wähler bestimmbar und immer lösbar', () => {
  const aufgabe = baueAufgabe(waehler(regelVon('wechsel')));
  assert.equal(aufgabe.regel, 'wechsel');
  assert.equal(aufgabe.gezeigt.length, 6);
  assert.deepEqual(aufgabe.gezeigt[0], { form: 'raute', farbe: 'rot' });
  assert.deepEqual(aufgabe.gezeigt[1], { form: 'quadrat', farbe: 'blau' });
  assert.deepEqual(aufgabe.loesung, aufgabe.gezeigt[0]);
  for (const regel of REGELN) {
    const a = baueAufgabe(waehler(regel));
    assert.deepEqual(naechsteKachel(a.gezeigt), a.loesung, `${regel.id}: Lösung folgt aus dem Gezeigten`);
    assert.deepEqual(a.optionen[0], a.loesung, `${regel.id}: Lösung steht zuerst`);
    assert.equal(a.optionen.length, 4);
  }
});

test('Ablenker sind nie zufällig richtig und nie doppelt', () => {
  for (const regel of REGELN) {
    const a = baueAufgabe(waehler(regel), 8);
    assert.equal(a.gezeigt.length, 8);
    for (const ablenker of a.optionen.slice(1)) {
      assert.equal(kachelGleich(ablenker, a.loesung), false, `${regel.id}: Ablenker ist nicht die Lösung`);
    }
    const namen = a.optionen.map((k) => `${k.form}-${k.farbe}`);
    assert.equal(new Set(namen).size, 4, `${regel.id}: vier verschiedene Antworten`);
  }
});

test('Spiegelachse: spiegelIndex und istSymmetrisch', () => {
  assert.equal(spiegelIndex(0, 4), 3);
  assert.equal(spiegelIndex(1, 4), 2);
  assert.equal(spiegelIndex(4, 4), 7); // zweite Zeile bleibt in ihrer Zeile
  assert.equal(spiegelIndex(2, 5), 2); // ungerade Spaltenzahl: Mitte spiegelt sich selbst
  assert.equal(istSymmetrisch([A, B, B, A], 4), true);
  assert.equal(istSymmetrisch([A, B, null, A], 4), false);
  assert.equal(istSymmetrisch([null, null, null, null], 4), true);
  assert.equal(istSymmetrisch([A, B, A, B, A, B], 3), true); // je Zeile A-B-A
  assert.equal(istSymmetrisch([A, B, B, A, A, B], 3), false);
  assert.equal(istSymmetrisch([A, B, A, B, A, B], 2), false);
  assert.equal(istSymmetrisch([A, A, B, B], 2), true);
});

test('Kachel-Hilfen: Vergleich, Name, unbekannte ids', () => {
  assert.equal(kachelGleich(A, { form: 'raute', farbe: 'rot' }), true);
  assert.equal(kachelGleich(A, { form: 'raute', farbe: 'blau' }), false);
  assert.equal(kachelGleich(null, null), true);
  assert.equal(kachelGleich(A, null), false);
  assert.equal(kachelName(A), 'Raute in Rot');
  assert.equal(kachelName(null), 'leeres Feld');
  assert.equal(kachelName({ form: 'wolke', farbe: 'rot' }), 'unbekannte Kachel');
  assert.equal(formVon('wolke'), null);
  assert.equal(farbeVon('lila'), null);
  assert.equal(regelVon('zufall'), null);
  assert.equal(FORMEN.length, 6);
  assert.equal(FARBEN.length, 4);
  assert.ok(FARBEN.every((f) => /^#[0-9a-f]{6}$/.test(f.wert)));
});

test('pruefeVorlagen schlägt bei kaputten Rastern an', () => {
  assert.deepEqual(pruefeVorlagen(gueltig()), []);

  const zeileZuKurz = gueltig();
  zeileZuKurz.vorlagen[0].raster = ['####', '###'];
  assert.ok(pruefeVorlagen(zeileZuKurz).some((f) => f.includes('4 Zeichen')));

  const schief = gueltig();
  schief.vorlagen[1].raster = ['####', '##..'];
  assert.ok(pruefeVorlagen(schief).some((f) => f.includes('nicht spiegelsymmetrisch')));

  const zuKlein = gueltig();
  zuKlein.vorlagen[2].raster = ['.##.', '.##.'];
  assert.ok(pruefeVorlagen(zuKlein).some((f) => f.includes('mindestens 6 Felder')));

  const fremdeZeichen = gueltig();
  fremdeZeichen.vorlagen[3].raster = ['##x#', '.##.'];
  assert.ok(pruefeVorlagen(fremdeZeichen).some((f) => f.includes("nur '#' und '.'")));

  const zuBreit = gueltig();
  zuBreit.vorlagen[0].spalten = 12;
  assert.ok(pruefeVorlagen(zuBreit).some((f) => f.includes('3 bis 10')));

  const ohneIdee = gueltig();
  ohneIdee.vorlagen[1].idee = 'schön';
  assert.ok(pruefeVorlagen(ohneIdee).some((f) => f.includes('Gestaltungsidee')));

  const doppelt = gueltig();
  doppelt.vorlagen[1].id = 'v1';
  assert.ok(pruefeVorlagen(doppelt).some((f) => f.includes('doppelte Vorlagen-ids')));

  assert.deepEqual(pruefeVorlagen({ vorlagen: [] }), ['vorlagen fehlt oder weniger als 4 Vorlagen']);
});
