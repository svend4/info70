import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/stationen.json' with { type: 'json' };
import {
  PFLICHTMARKIERUNG, alleGewaehlt, alleKennungen, gewaehlteKarten, kannDrucken, kartenText, markierungFuer,
  pruefeMarkierung, pruefeMasse, umschalten, zeileText,
} from '../logik.mjs';

// Prüft Daten und Auswahl. Die Regeln der Umgebung (Eingabefelder, Speicherung,
// Netz, Druckzeichen, Testzahl) stehen in test/regeln.test.mjs.

const STATIONEN = daten.karten.filter((k) => k.art === 'station');
const AUFSICHT = daten.karten.filter((k) => k.art === 'aufsicht');
const ALLE_ZEILEN = (karte) => karte.abschnitte.flatMap((a) => a.zeilen);
const QUELLE_FORMAT = /^Praleska, S\. (\d+)(?:–(\d+))?$/;

// Gültige Seite: „S. n“ oder „S. n–m“, beides im Bereich 57 bis 60.
function seitenImBereich(text) {
  const m = text.match(/^S\. (\d+)(?:–(\d+))?$/);
  if (!m) return false;
  const von = Number(m[1]);
  const bis = m[2] ? Number(m[2]) : von;
  return von >= 57 && bis <= 60 && von <= bis;
}

test('Daten: 7 Stationen und eine Aufsichtskarte, IDs eindeutig, Pflichtfelder gesetzt', () => {
  assert.equal(STATIONEN.length, 7, 'es müssen 7 Stationen sein');
  assert.equal(AUFSICHT.length, 1, 'es muss genau eine Aufsichtskarte geben');
  const ids = alleKennungen(daten);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Kennungen');
  for (const k of daten.karten) {
    assert.ok(k.titel && k.quelle && k.fuss, `${k.id}: Titel, Quelle oder Fußzeile fehlt`);
    assert.ok(Array.isArray(k.abschnitte) && k.abschnitte.length >= 1, `${k.id}: keine Abschnitte`);
    for (const a of k.abschnitte) {
      assert.ok(a.ueberschrift, `${k.id}: Abschnitt ohne Überschrift`);
      assert.ok(a.zeilen.length >= 1, `${k.id}: Abschnitt „${a.ueberschrift}“ ohne Zeilen`);
    }
  }
});

test('feste Reihenfolge der Karten: Stationen in der Quellenfolge, dann die Aufsicht', () => {
  assert.deepEqual(alleKennungen(daten), [
    'kriechen', 'klettern', 'schiefe-ebene', 'zielwurf-horizontal',
    'zielwurf-vertikal', 'durchkriechen', 'balancierweg', 'aufsicht',
  ]);
});

test('Quelle je Karte: „Praleska, S. n“ oder „S. n–m“, nur auf den Seiten 57 bis 60; Ausgabe und Katalogeintrag belegt', () => {
  for (const k of daten.karten) {
    assert.match(k.quelle, QUELLE_FORMAT, `${k.id}: Quelle „${k.quelle}“ hat nicht das Format`);
    assert.ok(seitenImBereich(k.quelle.replace('Praleska, ', '')), `${k.id}: Seite außerhalb 57 bis 60`);
  }
  // Ausgabe wie auf der Titelseite der Textdatei (Verlag, Jahr, ISBN); Katalog ohne Nummer.
  assert.match(daten.quellenHinweis, /Minsk: НИО \(Национальный институт образования\), 2007\. ISBN 978-985-465-244-3\./);
  assert.match(daten.katalog, /^Katalogeintrag docs\/10, Abschnitt Printmaterialien\./);
  assert.ok(!/Einheit/.test(daten.katalog), 'Katalog: Einheitennummer ist nicht belegt');
});

test('jede Maßzeile trägt ihre Seite, im Bereich 57 bis 60', () => {
  for (const k of STATIONEN) {
    const maße = k.abschnitte.find((a) => a.ueberschrift === 'Übungsmaß laut Quelle');
    assert.ok(maße, `${k.id}: Abschnitt „Übungsmaß laut Quelle“ fehlt`);
    for (const z of maße.zeilen) {
      assert.ok(z.seite && seitenImBereich(z.seite), `${k.id}: Maßzeile ohne gültige Seite: ${z.text}`);
    }
  }
});

test('Zahlen stimmen mit den Quellenseiten überein', () => {
  const erwartet = [
    ['klettern', 'S. 58', ['1,2 m']],
    ['klettern', 'S. 59', ['1,5 m']],
    ['klettern', 'S. 60', ['1,7 bis 2 m']],
    ['schiefe-ebene', 'S. 59', ['10 bis 30 cm', '15 bis 20 cm', '150 bis 200 cm']],
    ['zielwurf-horizontal', 'S. 59', ['50 cm', '50 bis 60 cm']],
    ['zielwurf-vertikal', 'S. 60', ['50 bis 60 cm', '80 bis 100 cm']],
  ];
  for (const [id, seite, teile] of erwartet) {
    const karte = daten.karten.find((k) => k.id === id);
    const zeilen = ALLE_ZEILEN(karte).filter((z) => z.seite === seite).map((z) => z.text).join(' ');
    for (const teil of teile) {
      assert.ok(zeilen.includes(teil), `${id} auf ${seite}: „${teil}“ fehlt, gefunden: „${zeilen}“`);
    }
  }
});

test('keine Lesart als Grenze: kein Höchstwert, DGUV, Tunnel, Aufbauplan, Baukasten oder 100–125-cm-Angabe', () => {
  const alles = JSON.stringify(daten) + daten.karten.map(kartenText).join('\n');
  const verboten = /Höchst|Grenzwert|Mindestabstand|mindestens|höchstens|maximal|DGUV|Tunnel|Aufbauplan|Baukasten|Zeichnung|100 bis 125|100–125/i;
  assert.ok(!verboten.test(alles), `verbotene Angabe gefunden: ${alles.match(verboten)?.[0]}`);
});

test('Eigenentwurf-Kennzeichnung: jede Karte trägt das Wort, jede Durchführung ist so überschrieben', () => {
  for (const k of daten.karten) {
    assert.match(kartenText(k), /Eigenentwurf/, `${k.id}: ohne Kennzeichnung als Eigenentwurf`);
  }
  for (const k of STATIONEN) {
    assert.ok(
      k.abschnitte.some((a) => a.ueberschrift === 'Durchführung (Eigenentwurf)'),
      `${k.id}: Durchführung nicht als Eigenentwurf gekennzeichnet`,
    );
  }
});

test('Aufsichtskarte: Quelle S. 57, die zwei Hinweise und der Satz zu Geräten wörtlich', () => {
  const [aufsicht] = AUFSICHT;
  assert.equal(aufsicht.quelle, 'Praleska, S. 57');
  assert.deepEqual(aufsicht.abschnitte[0].zeilen.map(zeileText), [
    '„das Kind nicht aus dem Blick der Erwachsenen lassen“ (S. 57)',
    '„potenziell gefährliche Gegenstände aus der Reichweite entfernen“ (S. 57)',
  ]);
  assert.deepEqual(aufsicht.abschnitte[1].zeilen.map((z) => z.text), [
    'Geräte, Höhen und Untergrund prüft der Träger; diese Angaben sind Übungsmaße und keine Sicherheitsgrenzen.',
  ]);
});

test('Auswahl: nur gewählte Karten, feste Reihenfolge, unbekannte Kennungen ignoriert, keine Dubletten', () => {
  const karten = gewaehlteKarten(daten, ['balancierweg', 'kriechen', 'unbekannt', 'kriechen']);
  assert.deepEqual(karten.map((k) => k.id), ['kriechen', 'balancierweg']);
});

test('der Druck entspricht der Auswahl: n gewählte Karten ergeben genau n Karten', () => {
  const alle = alleKennungen(daten);
  for (let n = 0; n <= alle.length; n++) {
    assert.equal(gewaehlteKarten(daten, alle.slice(0, n)).length, n, `bei ${n} gewählten Karten`);
  }
});

test('alleGewaehlt wählt alle Karten; umschalten ändert nur die neue Menge', () => {
  const alle = alleGewaehlt(daten);
  assert.equal(alle.size, daten.karten.length);
  const ohneKriechen = umschalten(alle, 'kriechen');
  assert.equal(ohneKriechen.has('kriechen'), false);
  assert.equal(alle.has('kriechen'), true, 'das Original darf nicht verändert werden');
  assert.equal(umschalten(ohneKriechen, 'kriechen').has('kriechen'), true);
});

test('Druck erst bei mindestens einer gewählten Karte', () => {
  assert.equal(kannDrucken(gewaehlteKarten(daten, [])), false);
  assert.equal(kannDrucken(gewaehlteKarten(daten, ['aufsicht'])), true);
});

test('zeileText hängt die Seite in Klammern an; ohne Seite bleibt der Text', () => {
  assert.equal(zeileText({ text: 'Abstand 50 bis 60 cm', seite: 'S. 59' }), 'Abstand 50 bis 60 cm (S. 59)');
  assert.equal(zeileText({ text: 'Durchführung ohne Seite' }), 'Durchführung ohne Seite');
});

test('jede Stationskarte nennt Quelle, Übungsmaß und Durchführung; ihre Fußzeile sagt „keine Sicherheitsgrenze“; die Aufsicht die Hinweise', () => {
  for (const k of STATIONEN) {
    const text = kartenText(k);
    assert.ok(text.includes(k.quelle), `${k.id}: Quelle fehlt`);
    assert.ok(text.includes('Übungsmaß laut Quelle'), `${k.id}: Übungsmaß fehlt`);
    assert.ok(text.includes('Durchführung (Eigenentwurf)'), `${k.id}: Durchführung fehlt`);
    assert.ok(k.fuss.startsWith('Übungsmaß laut Quelle, keine Sicherheitsgrenze.'), `${k.id}: Fußzeile ohne Sicherheitsgrenze-Satz`);
  }
  assert.ok(kartenText(AUFSICHT[0]).includes('Hinweise laut Quelle'), 'Aufsicht: Hinweise fehlen');
});

test('der Ausgabetext enthält keine Reste wie undefined oder null', () => {
  for (const k of daten.karten) {
    assert.ok(!/undefined|null|\[object/.test(kartenText(k)), `${k.id}: Rest im Text`);
  }
});

test('pruefeMasse: jede Maßzeile mit Zahl und Einheit trägt eine Seite von 58 bis 60; die Daten bestehen', () => {
  for (const k of daten.karten) {
    assert.deepEqual(pruefeMasse(k), [], `${k.id}: Maßzeile ohne Seite`);
  }
  const ohneSeite = { id: 'probe', abschnitte: [{ ueberschrift: 'Übungsmaß laut Quelle', zeilen: [{ text: 'Höhe 20 cm' }] }] };
  assert.equal(pruefeMasse(ohneSeite).length, 1, 'Gegenprobe: Maßzahl ohne Seite wird gemeldet');
  const aufSeite57 = { id: 'probe', abschnitte: [{ ueberschrift: 'Übungsmaß laut Quelle', zeilen: [{ text: 'Höhe 20 cm', seite: 'S. 57' }] }] };
  assert.equal(pruefeMasse(aufSeite57).length, 1, 'Gegenprobe: Seite 57 ist keine Maßseite');
  const ohneZahl = { id: 'probe', abschnitte: [{ ueberschrift: 'Übungsmaß laut Quelle', zeilen: [{ text: 'Keine Maße genannt' }] }] };
  assert.deepEqual(pruefeMasse(ohneZahl), [], 'Zeile ohne Maßzahl braucht keine Maßseite');
});

test('Pflichtmarkierung: jede Karte mit Seitenangabe trägt sie im Drucktext; pruefeMarkierung findet nichts zu beanstanden', () => {
  for (const k of daten.karten) {
    assert.equal(markierungFuer(k), PFLICHTMARKIERUNG, `${k.id}: Markierung fehlt`);
    assert.ok(kartenText(k).includes(PFLICHTMARKIERUNG), `${k.id}: Drucktext ohne Markierung`);
  }
  assert.deepEqual(pruefeMarkierung(daten.karten), []);
  const ohneSeite = { id: 'probe', quelle: 'Eigenentwurf', abschnitte: [{ ueberschrift: 'Hinweis', zeilen: [{ text: 'ohne Seite' }] }], fuss: 'Eigenentwurf' };
  assert.equal(markierungFuer(ohneSeite), null, 'Gegenprobe: ohne Seitenangabe keine Markierung');
  assert.deepEqual(pruefeMarkierung([ohneSeite]), [], 'Gegenprobe: ohne Seitenangabe keine Beanstandung');
});

test('Pflichtmarkierung im Wortlaut: maschinell geprüft, noch nicht von einem Menschen', () => {
  assert.equal(PFLICHTMARKIERUNG, 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.');
});
