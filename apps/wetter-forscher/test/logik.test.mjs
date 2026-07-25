import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  TAGE_IM_RUECKBLICK, JAHRESZEITEN, datumsSchluessel, letzteTage, beschneide,
  jahreszeitFuer, zaehleWetter, haeufigstesWetter, anzahlEintraege, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/wetter.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));

test('Wetterdaten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.wetter.length >= 5);
});

test('datumsSchluessel nutzt das lokale Datum, nicht UTC', () => {
  assert.equal(datumsSchluessel(new Date(2026, 6, 24, 23, 30)), '2026-07-24');
  assert.equal(datumsSchluessel(new Date(2026, 0, 5, 0, 15)), '2026-01-05');
});

test('letzteTage und beschneide über Monats- und Jahresgrenzen', () => {
  const tage = letzteTage(TAGE_IM_RUECKBLICK, new Date(2026, 0, 3));
  assert.equal(tage.length, 28);
  assert.equal(tage.at(-1), '2026-01-03');
  assert.equal(tage[0], '2025-12-07', 'Jahreswechsel muss stimmen');
  assert.deepEqual(tage, [...tage].sort(), 'aufsteigend');
  // Schaltjahr
  assert.equal(letzteTage(2, new Date(2028, 2, 1))[0], '2028-02-29');
  const gekuerzt = beschneide({
    '2026-01-03': { wetter: 'sonne' },
    '2025-12-07': { wetter: 'schnee' },
    '2025-12-06': { wetter: 'regen' },
    '2020-01-01': { wetter: 'wind' },
  }, new Date(2026, 0, 3));
  assert.deepEqual(Object.keys(gekuerzt).sort(), ['2025-12-07', '2026-01-03']);
  assert.deepEqual(beschneide(undefined, new Date()), {}, 'leerer Speicher ist kein Fehler');
});

test('meteorologische Jahreszeiten: jeder Monat gehört zu genau einer', () => {
  const zuordnung = new Map();
  for (let m = 1; m <= 12; m++) {
    const j = jahreszeitFuer(new Date(2026, m - 1, 15));
    assert.ok(j, `Monat ${m} ohne Jahreszeit`);
    zuordnung.set(m, j.id);
  }
  // Meteorologische Einteilung, wie in Deutschland üblich
  assert.equal(zuordnung.get(3), 'fruehling');
  assert.equal(zuordnung.get(5), 'fruehling');
  assert.equal(zuordnung.get(6), 'sommer');
  assert.equal(zuordnung.get(8), 'sommer');
  assert.equal(zuordnung.get(9), 'herbst');
  assert.equal(zuordnung.get(11), 'herbst');
  assert.equal(zuordnung.get(12), 'winter');
  assert.equal(zuordnung.get(1), 'winter');
  assert.equal(zuordnung.get(2), 'winter');
  // Alle vier kommen vor, keine Lücke, keine Überschneidung
  assert.equal(new Set(zuordnung.values()).size, 4);
  assert.equal(JAHRESZEITEN.flatMap((j) => j.monate).length, 12);
  assert.equal(new Set(JAHRESZEITEN.flatMap((j) => j.monate)).size, 12);
});

test('zaehleWetter zählt beschreibend und meldet leere Tage als offen', () => {
  const fenster = letzteTage(3, new Date(2026, 6, 24));
  const tage = {
    '2026-07-22': { wetter: 'sonne' },
    '2026-07-24': { wetter: 'regen' },
  };
  const z = zaehleWetter(tage, fenster, daten.wetter);
  assert.equal(z.sonne, 1);
  assert.equal(z.regen, 1);
  assert.equal(z.schnee, 0);
  assert.equal(z.offen, 1);
  // unbekannte Wettersorten zählen als offen, nicht als Treffer
  assert.equal(zaehleWetter({ '2026-07-24': { wetter: 'quatsch' } }, fenster, daten.wetter).offen, 3);
  assert.equal(anzahlEintraege(tage, fenster, daten.wetter), 2);
  // Ein verfälschter Eintrag zählt NICHT mit: sonst meldete die App Tage,
  // zu denen sie nichts anzeigen kann, und die Bilanz widerspräche sich.
  const kaputt = { '2026-07-24': { wetter: 'quatsch' } };
  assert.equal(anzahlEintraege(kaputt, fenster, daten.wetter), 0);
  assert.equal(haeufigstesWetter(kaputt, fenster, daten.wetter), null);
});

test('haeufigstesWetter meldet null, solange nichts eingetragen ist', () => {
  const fenster = letzteTage(5, new Date(2026, 6, 24));
  assert.equal(haeufigstesWetter({}, fenster, daten.wetter), null);
  const tage = {
    '2026-07-24': { wetter: 'regen' },
    '2026-07-23': { wetter: 'regen' },
    '2026-07-22': { wetter: 'sonne' },
  };
  assert.equal(haeufigstesWetter(tage, fenster, daten.wetter).id, 'regen');
});

test('jede Wettersorte schickt nach draußen: Wenn-dann-Beobachtung mit Frage', () => {
  for (const w of daten.wetter) {
    assert.ok(w.beobachtung.length >= 60, `${w.id}: Beobachtung zu knapp`);
    assert.match(w.beobachtung, /\?/, `${w.id}: keine Frage`);
  }
  // Die Katalog-Beispiele sind da: Regen -> Pfützen
  assert.match(daten.wetter.find((w) => w.id === 'regen').beobachtung, /Pfützen/);
  assert.match(daten.wetter.find((w) => w.id === 'sonne').beobachtung, /Schatten/);
  const ohne = kopie();
  ohne.wetter[0].beobachtung = 'Es ist sonnig.';
  assert.ok(pruefeDaten(ohne).some((f) => /Beobachtung fehlt oder ist zu knapp/.test(f)));
  const ohneFrage = kopie();
  ohneFrage.wetter[0].beobachtung = 'Bei Sonne gibt es Schatten, das kann man draußen gut sehen und nachgehen.';
  assert.ok(pruefeDaten(ohneFrage).some((f) => /soll eine Frage stellen/.test(f)));
});

test('jede Jahreszeit hat Merkmale zum Suchen und einen Gesprächsimpuls', () => {
  assert.equal(daten.jahreszeiten.length, 4);
  for (const j of daten.jahreszeiten) {
    assert.ok(j.merkmale.length >= 4, `${j.id}: zu wenige Merkmale`);
    for (const m of j.merkmale) assert.ok(m.length >= 25 && /[.!?]$/.test(m), `${j.id}: Merkmal „${m}“`);
    assert.ok(j.impuls.trim().endsWith('?'), `${j.id}: impuls ist keine Frage`);
  }
  // Deutsche Standard-Phänomene aus dem Katalog
  const alles = JSON.stringify(daten.jahreszeiten);
  assert.match(alles, /Schneeglöckchen/);
  assert.match(alles, /Blätter färben sich/);
  const zuWenig = kopie();
  zuWenig.jahreszeiten[0].merkmale = ['zu wenig'];
  assert.ok(pruefeDaten(zuWenig).some((f) => /mindestens 4 Merkmale/.test(f)));
});

test('gezählt wird das Wetter, nie das Kind: keine Bewertung in den Daten', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['punkte', 'richtig', 'falsch', 'gut gemacht', 'besser als', 'rekord', 'gewonnen', 'note']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort im Datensatz: ${wort}`);
  }
  assert.match(daten.hinweis, /nie das Kind/);
});
