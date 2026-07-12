import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { baueKarte, baueSchlagzeile, grossAnfang, naechsterTeilenWert, dauerText, pruefeBausteine, KENNZEICHNUNG } from '../studio.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/bausteine.json', import.meta.url), 'utf8'));

// Deterministischer Zufall (LCG), damit die Tests reproduzierbar sind
function lcg(saat = 42) {
  let zustand = saat;
  return () => {
    zustand = (zustand * 1664525 + 1013904223) % 4294967296;
    return zustand / 4294967296;
  };
}

test('grossAnfang und baueSchlagzeile setzen die Schlagzeile korrekt zusammen', () => {
  assert.equal(grossAnfang('der bürgermeister'), 'Der bürgermeister');
  assert.equal(grossAnfang(''), '');
  assert.equal(
    baueSchlagzeile('ein popstar', 'sammelt heimlich alle linken Socken der Stadt'),
    'Ein popstar sammelt heimlich alle linken Socken der Stadt!');
});

test('baueKarte: Kennzeichnung "ERFUNDEN" ist IMMER dabei (AI-Act-Regel der App)', () => {
  const zufall = lcg();
  const alleAus = baueKarte({ werId: 'w01', wasId: 't01' }, daten, zufall);
  const alleAn = baueKarte({ werId: 'w03', wasId: 't06', mitFoto: true, mitAugenzeuge: true, mitKommentaren: true, mitTeilen: true }, daten, zufall);
  assert.equal(alleAus.kennzeichnung, KENNZEICHNUNG);
  assert.equal(alleAn.kennzeichnung, KENNZEICHNUNG);
  assert.equal(KENNZEICHNUNG, 'ERFUNDEN');
});

test('baueKarte: Beweis-Optik erscheint nur, wenn sie gewählt wurde', () => {
  const ohne = baueKarte({ werId: 'w01', wasId: 't01' }, daten, lcg(1));
  assert.equal(ohne.fotoEmojis, null);
  assert.equal(ohne.augenzeuge, null);
  assert.deepEqual(ohne.kommentare, []);
  assert.equal(ohne.teilen, null);

  const mit = baueKarte({ werId: 'w02', wasId: 't02', mitFoto: true, mitAugenzeuge: true, mitKommentaren: true, mitTeilen: true }, daten, lcg(2));
  assert.equal(mit.fotoEmojis, '🏅🦆');
  assert.ok(daten.augenzeugen.includes(mit.augenzeuge));
  assert.equal(mit.kommentare.length, 2);
  assert.notEqual(mit.kommentare[0].name, mit.kommentare[1].name, 'Kommentare kommen von verschiedenen Fake-Konten');
  assert.ok(mit.teilen >= 12 && mit.teilen < 42, `Teilen-Start ${mit.teilen} im erwarteten Bereich`);
});

test('baueKarte: unbekannter Baustein wirft einen Fehler', () => {
  assert.throws(() => baueKarte({ werId: 'gibtsnicht', wasId: 't01' }, daten), /unbekannter Baustein/);
});

test('naechsterTeilenWert wächst immer (um 1 bis 6)', () => {
  const zufall = lcg(7);
  let wert = 12;
  for (let i = 0; i < 50; i++) {
    const neu = naechsterTeilenWert(wert, zufall);
    assert.ok(neu >= wert + 1 && neu <= wert + 6, `Schritt ${neu - wert} liegt zwischen 1 und 6`);
    wert = neu;
  }
});

test('dauerText: rundet, Minimum 1 Sekunde, korrekter Singular/Plural', () => {
  assert.equal(dauerText(0), '1 Sekunde');
  assert.equal(dauerText(1400), '1 Sekunde');
  assert.equal(dauerText(6800), '7 Sekunden');
  assert.equal(dauerText(59400), '59 Sekunden');
});

test('pruefeBausteine meldet kaputte Daten', () => {
  assert.ok(pruefeBausteine(null).length > 0);
  assert.ok(pruefeBausteine({}).length > 0);
  const kaputt = structuredClone(daten);
  kaputt.wer[0].text = 'Der Bürgermeister von Wolkenstadt'; // groß statt klein
  kaputt.wer[1].id = kaputt.wer[2].id; // doppelte id
  kaputt.kommentare = [];
  const fehler = pruefeBausteine(kaputt);
  assert.ok(fehler.some((f) => f.includes('klein beginnen')), 'Großschreibung wird erkannt');
  assert.ok(fehler.some((f) => f.includes('doppelt')), 'doppelte id wird erkannt');
  assert.ok(fehler.some((f) => f.includes('kommentare')), 'leere Kommentare werden erkannt');
});
