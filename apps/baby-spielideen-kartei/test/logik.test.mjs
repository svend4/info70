import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/spielideen.json' with { type: 'json' };
import {
  alleKennungen, begriffZeilen, filtern, gegenstandZeilen, gewaehlteKarten, hinzufuegen,
  kannDrucken, kartenText, umschalten,
} from '../logik.mjs';

// Prüft Daten und Logik. Die Regeln der Umgebung (Eingabefelder, Speicherung,
// Netz, Druckzeichen, Pflichtmarkierung je Karte, Testzahl) stehen in test/regeln.test.mjs.

// Die siebzehn Nennungen der Handlungsliste, wörtlich aus der Quelle, S. 40.
const LISTE_S40 = [
  'удержать', 'махать', 'отправить в рот', 'потрогать', 'потрясти',
  'перекладывание игрушки из руки в руку', 'постукивание о поверхность', 'нанизывание',
  'вкладывание', 'открывание', 'сжимание', 'разъединение', 'скручивание',
  'кольца пирамидки нанизывает на стержень', 'кубики накладывает один на другой',
  'юлу — «заводит»', 'мяч — катает по полу',
];

// Die acht Gegenstände aus der Quelle mit ihrem Wortlaut.
const GEGENSTAENDE_QUELLE = {
  Pyramide: 'пирамидки',
  Würfel: 'кубики',
  Kreisel: 'юлу',
  Ball: 'мяч',
  Holzfass: 'бочонок',
  Holzei: 'деревянным яйцом',
  Pilz: 'грибком',
  Spielwagen: 'коляску',
};

const KARTEN_REIHENFOLGE = [
  'festhalten', 'schwenken', 'in-den-mund-nehmen', 'betasten', 'schuetteln', 'von-hand-zu-hand',
  'klopfen', 'aufreihen', 'einlegen', 'oeffnen', 'zusammendruecken', 'auseinandernehmen',
  'drehen', 'aufeinanderlegen', 'anwerfen', 'rollen',
];

const alleBegriffe = () => daten.karten.flatMap((k) => k.begriffe);
const alleGegenstandsbezuege = () => daten.karten.flatMap((k) => k.gegenstaende);

test('Daten: 16 Karten in fester Reihenfolge, IDs eindeutig, Pflichtfelder gesetzt', () => {
  assert.equal(daten.karten.length, 16, 'es müssen 16 Karten sein');
  assert.deepEqual(alleKennungen(daten), KARTEN_REIHENFOLGE);
  assert.equal(new Set(alleKennungen(daten)).size, 16, 'doppelte Kennungen');
  for (const k of daten.karten) {
    assert.ok(k.handlung && k.quelle && k.spielidee, `${k.id}: Handlung, Quelle oder Spielidee fehlt`);
    assert.ok(Array.isArray(k.begriffe) && k.begriffe.length >= 1, `${k.id}: keine Begriffe`);
    assert.ok(Array.isArray(k.gegenstaende), `${k.id}: Gegenstände fehlen als Liste`);
  }
  assert.ok(daten.titel === 'Spielideen-Kartei: Was kann mein Baby mit...?', 'Titel wurde verändert');
});

test('Handlungsliste: 17 Nennungen wörtlich aus S. 40, daraus 16 Karten (Aufreihen steht zweimal)', () => {
  const liste = alleBegriffe().filter((b) => b.liste).map((b) => b.quelltext);
  assert.equal(liste.length, 17, `Nennungen: ${liste.length}`);
  assert.deepEqual([...liste].sort(), [...LISTE_S40].sort());
  const aufreihen = daten.karten.find((k) => k.id === 'aufreihen');
  assert.equal(aufreihen.begriffe.filter((b) => b.liste).length, 2, 'Aufreihen braucht genau zwei Nennungen');
  assert.equal(daten.karten.length, 17 - 1, '17 Nennungen ergeben 16 Karten');
});

test('Quelle je Karte: „Praleska, S. 40“; jede Seitenangabe liegt auf S. 40 oder S. 41', () => {
  for (const k of daten.karten) {
    assert.equal(k.quelle, 'Praleska, S. 40', `${k.id}: Quellenangabe`);
  }
  for (const b of [...alleBegriffe(), ...daten.gegenstaende]) {
    assert.match(b.seite, /^S\. (40|41)$/, `Seite fehlt oder liegt außerhalb: ${b.quelltext} (${b.seite})`);
  }
  for (const bezug of alleGegenstandsbezuege()) {
    assert.match(bezug.seite, /^S\. (40|41)$/, `Gegenstandsbezug ohne gültige Seite: ${bezug.id}`);
  }
});

test('Gegenstände: genau die acht aus der Quelle, mit Wortlaut und Seite; Schneebesen und Stapelbecher fehlen', () => {
  const namen = daten.gegenstaende.map((g) => g.name).sort();
  assert.deepEqual(namen, Object.keys(GEGENSTAENDE_QUELLE).sort());
  for (const g of daten.gegenstaende) {
    assert.equal(g.quelltext, GEGENSTAENDE_QUELLE[g.name], `${g.name}: Wortlaut weicht ab`);
  }
  assert.equal(daten.gegenstaende.find((g) => g.name === 'Spielwagen').seite, 'S. 41');
  const roh = JSON.stringify(daten);
  assert.ok(!/Schneebesen|Stapelbecher/i.test(roh), 'Gegenstand ohne Quelle gefunden');
  for (const bezug of alleGegenstandsbezuege()) {
    assert.ok(daten.gegenstaende.some((g) => g.id === bezug.id), `Verknüpfung auf unbekannten Gegenstand: ${bezug.id}`);
  }
});

test('Glossen: вкладывание ist einlegen, nicht einfüllen; строит дом ist Haus bauen; Turm nur mit Verweis auf S. 41', () => {
  const roh = JSON.stringify(daten);
  assert.ok(!/einfüllen/i.test(roh), 'die falsche Glosse „einfüllen“ steht im Text');
  const einlegen = daten.karten.find((k) => k.id === 'einlegen').begriffe[0];
  assert.equal(einlegen.quelltext, 'вкладывание');
  assert.match(einlegen.deutsch, /^Einlegen, Ineinanderstecken$/);
  const bauen = daten.karten.find((k) => k.id === 'aufeinanderlegen').begriffe.find((b) => b.quelltext === 'строит дом');
  assert.equal(bauen.deutsch, 'Haus bauen');
  for (const k of daten.karten) {
    const text = kartenText(daten, k);
    if (/Turm/.test(text)) {
      assert.ok(k.begriffe.some((b) => b.verweis && b.seite === 'S. 41' && b.quelltext === 'строить башню'),
        `${k.id}: „Turm“ ohne Verweis auf S. 41 („строить башню“)`);
    }
    assert.ok(!/Turm/.test(k.spielidee), `${k.id}: „Turm“ in der Spielidee`);
  }
});

test('Quellenhinweis: Ausgabe wie in der Quelle, Katalogeintrag, Sprachen und „и т. д.“-Hinweis', () => {
  assert.match(daten.quellenHinweis, /Minsk: НИО \(Национальный институт образования\), 2007\. ISBN 978-985-465-244-3\./);
  assert.match(daten.quellenHinweis, /S\. 39 bis 41/);
  assert.match(daten.katalog, /^Katalogeintrag docs\/10, Content-Pack 2\./);
  assert.ok(daten.sprachen.includes('uk und ru: nicht vorhanden, offen.'), 'Sprachenvermerk fehlt');
  assert.ok(daten.listenHinweis.includes('„и т. д.“ (S. 40)'), 'der Hinweis auf „и т. д.“ fehlt');
});

test('Russische Zitate höchstens 12 Wörter', () => {
  for (const text of [...alleBegriffe(), ...daten.gegenstaende].map((x) => x.quelltext)) {
    const woerter = text.trim().split(/\s+/).length;
    assert.ok(woerter <= 12, `„${text}“ hat ${woerter} Wörter`);
  }
});

test('Eigenentwurf-Kennzeichnung: jede Übertragung trägt das Wort; die Sicherheit steht als Eigenentwurf', () => {
  for (const k of daten.karten) {
    for (const b of k.begriffe.filter((x) => x.deutsch)) {
      assert.ok(begriffZeilen(k).some((z) => z.includes(b.deutsch) && z.endsWith('(Eigenentwurf)')),
        `${k.id}: Glosse „${b.deutsch}“ nicht als Eigenentwurf gekennzeichnet`);
    }
    assert.match(kartenText(daten, k), /Eigenentwurf/, `${k.id}: ohne Kennzeichnung`);
  }
  assert.ok(daten.sicherheitssatz.endsWith('(Eigenentwurf).'), 'Sicherheitssatz ohne Eigenentwurf');
});

test('Sicherheitssatz wörtlich; keine Norm, keine Verschluckgefahr als Quellenaussage, keine Zahl der Entwicklungsschritte in den Daten', () => {
  assert.equal(daten.sicherheitssatz, 'Kleine Teile nur mit Erwachsenen; Gegenstände vor jeder Nutzung prüfen (Eigenentwurf).');
  const roh = JSON.stringify(daten);
  assert.ok(!/DIN\b|EN 71|Verschluck|Entwicklungsschritt/i.test(roh), 'Norm oder Quellenaussage ohne Quelle gefunden');
});

test('Filter nach Gegenstand und Handlung (UND); „alle“ hebt den Filter auf', () => {
  const ids = (f) => filtern(daten, f).map((k) => k.id);
  assert.equal(ids({}).length, 16);
  assert.deepEqual(ids({ gegenstand: 'alle', handlung: 'alle' }), KARTEN_REIHENFOLGE);
  assert.deepEqual(ids({ gegenstand: 'ball' }), ['festhalten', 'rollen']);
  assert.deepEqual(ids({ gegenstand: 'spielwagen' }), ['rollen']);
  assert.deepEqual(ids({ gegenstand: 'wuerfel', handlung: 'festhalten' }), ['festhalten']);
  assert.deepEqual(ids({ gegenstand: 'wuerfel', handlung: 'rollen' }), []);
  assert.deepEqual(ids({ gegenstand: 'gibtsnicht' }), []);
  assert.deepEqual(ids({ handlung: 'schwenken' }), ['schwenken']);
});

test('Auswahl: umschalten und hinzufuegen ändern nur die neue Menge, keine Dubletten', () => {
  const alle = new Set(['festhalten', 'rollen']);
  const ohneRollen = umschalten(alle, 'rollen');
  assert.equal(ohneRollen.has('rollen'), false);
  assert.equal(alle.has('rollen'), true, 'das Original darf nicht verändert werden');
  assert.equal(umschalten(ohneRollen, 'rollen').has('rollen'), true);
  const erweitert = hinzufuegen(alle, ['rollen', 'anwerfen']);
  assert.deepEqual([...erweitert].sort(), ['anwerfen', 'festhalten', 'rollen']);
});

test('Druck: gewählte Karten in fester Reihenfolge, Unbekanntes ignoriert, n Auswahl ergibt n Karten', () => {
  const karten = gewaehlteKarten(daten, ['rollen', 'festhalten', 'unbekannt', 'rollen']);
  assert.deepEqual(karten.map((k) => k.id), ['festhalten', 'rollen']);
  const alle = alleKennungen(daten);
  for (let n = 0; n <= alle.length; n++) {
    assert.equal(gewaehlteKarten(daten, alle.slice(0, n)).length, n, `bei ${n} gewählten Karten`);
  }
  assert.equal(kannDrucken(gewaehlteKarten(daten, [])), false, 'ohne Auswahl darf nicht gedruckt werden');
  assert.equal(kannDrucken(gewaehlteKarten(daten, ['schwenken'])), true);
});

test('Gegenstandszeilen: Gegenstand mit Seite; ohne Gegenstand steht das ausdrücklich da', () => {
  const rollen = daten.karten.find((k) => k.id === 'rollen');
  assert.deepEqual(gegenstandZeilen(daten, rollen), [
    'Ball („мяч“, S. 40)',
    'Spielwagen („коляску“, S. 41)',
  ]);
  const schwenken = daten.karten.find((k) => k.id === 'schwenken');
  assert.deepEqual(gegenstandZeilen(daten, schwenken), [
    'Die Quelle nennt bei dieser Handlung keinen Gegenstand (S. 40).',
  ]);
});

test('Kartentext: enthält die Pflichtmarkierung, keine Reste wie undefined, null oder [object', () => {
  for (const k of daten.karten) {
    const text = kartenText(daten, k);
    assert.ok(text.includes(daten.pflichtmarkierung), `${k.id}: Pflichtmarkierung fehlt im Druck`);
    assert.ok(!/undefined|null|\[object|UNBEKANNT/.test(text), `${k.id}: Rest im Text`);
  }
});

test('Keine uk- oder ru-Felder: in den Daten steht kein Schlüssel uk oder ru', () => {
  const schluessel = [];
  const sammle = (wert) => {
    if (Array.isArray(wert)) wert.forEach(sammle);
    else if (wert && typeof wert === 'object') {
      for (const [k, v] of Object.entries(wert)) {
        schluessel.push(k);
        sammle(v);
      }
    }
  };
  sammle(daten);
  assert.ok(!schluessel.some((k) => /^(uk|ru)(_|$)/i.test(k)), `Sprachfeld gefunden: ${schluessel.join(', ')}`);
});
