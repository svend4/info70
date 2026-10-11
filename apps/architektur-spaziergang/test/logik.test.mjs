import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  ARTEN, SICHERHEITEN, EINORDNUNGEN, ZIELE, DENKMAELER_DER_QUELLE, KLEINE_FORMEN_DER_QUELLE,
  DRUCK_ABSAETZE, ERWARTUNG, BEWERTUNG, EINSTUFUNG, WIRKVERSPRECHEN, JAHRESZAHL, EPOCHE, ORTSNAME,
  NICHT_GEPRUEFT, angebotsTexte, kartenTexte, kinderfragen, karteVon, kartenNachArt, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/spaziergang.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));

test('die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('siebzehn Quellziele, vollständig und eindeutig eingeordnet', () => {
  assert.equal(daten.ziele.length, ZIELE);
  assert.deepEqual([...daten.ziele.map((z) => z.nr)].sort((a, b) => a - b),
    Array.from({ length: ZIELE }, (_, i) => i + 1));
  for (const z of daten.ziele) assert.ok(EINORDNUNGEN.includes(z.einordnung), z.nr);
  // Genau eines ist eingeschraenkt (das ueber Aussehen und Bestimmung),
  // zwei sind zurueckgewiesen (Werbung, Bewertung von Massenproduktion).
  assert.equal(daten.ziele.filter((z) => z.einordnung === 'nurEingeschraenkt').length, 1);
  // Drei sind zurueckgewiesen: die Fachwortliste (11), die Werbung (16) und
  // die Bewertung von Massenproduktion (17).
  assert.equal(daten.ziele.filter((z) => z.einordnung === 'nichtUebernommen').length, 3);
});

test('ein eingeschränktes Ziel ohne Bezug auf Aussehen und Bestimmung fällt auf', () => {
  const d = kopie();
  const z = d.ziele.find((x) => x.einordnung === 'nurEingeschraenkt');
  z.kurz = 'irgendein Ziel über Farben';
  assert.ok(pruefeDaten(d).some((f) => /eingeschränkt/.test(f)));
});

test('eine zurückgewiesene Werbung, die die Werbung nicht benennt, fällt auf', () => {
  const d = kopie();
  for (const z of d.ziele.filter((x) => x.einordnung === 'nichtUebernommen')) {
    z.warum = 'gehört hier nicht her.';
  }
  assert.ok(pruefeDaten(d).some((f) => /benennt die Werbung/.test(f)));
});

test('jede Karte trägt eine der fünf Arten, und die dritte Gruppe ist besetzt', () => {
  for (const k of daten.karten) assert.ok(ARTEN.includes(k.art), k.id);
  assert.ok(kartenNachArt(daten, 'nichtErkennbar').length >= 3);
  assert.ok(kartenNachArt(daten, 'bauform').length >= 5);
  assert.ok(kartenNachArt(daten, 'ausstattung').length >= 2);
});

test('ohne die Karten „nicht erkennbar" wird die App abgelehnt', () => {
  const d = kopie();
  d.karten = d.karten.filter((k) => k.art !== 'nichtErkennbar');
  assert.ok(pruefeDaten(d).some((f) => /alles ablesen/.test(f)));
});

test('eine Erklärung, die sich „belegt" nennt, braucht ihre Quelle', () => {
  const d = kopie();
  const k = d.karten.find((x) => x.fuerErwachsene);
  k.sicherheit = 'belegt';
  delete k.quelle;
  assert.ok(pruefeDaten(d).some((f) => /dann ist es nicht belegt/.test(f)));
  k.quelle = 'Irgendeine nachprüfbare Fundstelle.';
  assert.deepEqual(pruefeDaten(d), []);
});

test('jeder Sicherheitsgrad ist einer der drei und hat seinen Satz', () => {
  for (const k of daten.karten) {
    if (!k.fuerErwachsene) { assert.equal(k.sicherheit, undefined, k.id); continue; }
    assert.ok(SICHERHEITEN.includes(k.sicherheit), k.id);
    assert.ok((k.sicherheitText ?? '').length > 10, k.id);
    if (k.sicherheit === 'belegt') assert.ok(k.quelle, k.id);
  }
});

test('eine Karte am Bau ohne Gegenbeispiel fällt auf', () => {
  const d = kopie();
  delete d.karten.find((k) => k.art === 'bauform').gegenbeispiel;
  assert.ok(pruefeDaten(d).some((f) => /Gesetz/.test(f)));
});

test('eine Karte „nicht erkennbar" darf nichts erklären', () => {
  const d = kopie();
  const k = d.karten.find((x) => x.art === 'nichtErkennbar');
  k.fuerErwachsene = 'Man erkennt es am Giebel.';
  k.sicherheit = 'offen';
  k.sicherheitText = 'Irgendwas.';
  assert.ok(pruefeDaten(d).some((f) => /dann ist sie erkennbar/.test(f)));
});

test('die drei kleinen Formen der Quelle sind da und als genannt markiert', () => {
  for (const form of KLEINE_FORMEN_DER_QUELLE) {
    const k = daten.karten.find((x) => x.art === 'kleineForm' && x.name.includes(form));
    assert.ok(k, form);
    assert.equal(k.quellBezug, 'genannt', form);
  }
  // Was von uns ist, ist als unser gekennzeichnet.
  assert.ok(daten.karten.some((k) => k.quellBezug === 'ergaenzt'));
});

test('eine eigene Ergänzung, die als Quellpunkt ausgegeben wird, fällt auf', () => {
  const d = kopie();
  const k = d.karten.find((x) => x.art === 'kleineForm' && x.name.includes('Laterne'));
  k.quellBezug = 'ergaenzt';
  assert.ok(pruefeDaten(d).some((f) => /als Ergänzung ausgegeben/.test(f)));
});

test('jede Frage ist eine Frage und erwartet keine Antwort', () => {
  const fragen = kinderfragen(daten);
  assert.equal(fragen.length, daten.karten.length);
  for (const [wo, text] of fragen) {
    assert.ok(text.trim().endsWith('?'), wo);
    assert.ok(!ERWARTUNG.test(text), `${wo}: ${text}`);
  }
});

test('die Einschränkung nennt eine Karte, bei der das Ziel nicht gilt', () => {
  assert.ok(kartenNachArt(daten, 'nichtErkennbar').some((k) => daten.nurManchmal.includes(k.name)));
  const d = kopie();
  d.nurManchmal = 'Das gilt nicht immer, aber meistens schon.';
  assert.ok(pruefeDaten(d).some((f) => /Floskel/.test(f)));
});

test('die nicht übernommene Vorbildliste nennt Zahl, Ort und die Begründung der Quelle', () => {
  assert.match(daten.keineVorbildliste, /vierzehn/);
  assert.match(daten.keineVorbildliste, /Belarus/);
  assert.equal(DENKMAELER_DER_QUELLE, 14);
  for (const weg of [/vierzehn/, /Belarus/]) {
    const d = kopie();
    // Global ersetzen: „vierzehn" steht zweimal darin, und eine einzelne
    // Ersetzung liesse das Netz weiter greifen.
    d.keineVorbildliste = d.keineVorbildliste.replace(new RegExp(weg.source, 'g'), 'etwas');
    assert.ok(pruefeDaten(d).length > 0, String(weg));
  }
});

test('die Regel für unterwegs steht auf dem Zettel, nicht nur auf dem Bildschirm', () => {
  assert.ok(DRUCK_ABSAETZE.includes('sicherheitImmer'));
  for (const feld of DRUCK_ABSAETZE) assert.ok((daten[feld] ?? '').length > 20, feld);
  // Und sie nennt die drei Dinge, die draussen gelten.
  for (const muster of [/Gehweg|Fahrbahn/, /klingel/i, /fotografier/i]) {
    assert.match(daten.sicherheitImmer, muster);
  }
});

test('die Textnetze greifen – Erwartung, Bewertung, Einstufung, Wirkversprechen', () => {
  assert.ok(ERWARTUNG.test('Ihr Kind soll erkennen, welches Haus das ist.'));
  assert.ok(ERWARTUNG.test('Die richtige Antwort steht unten.'));
  assert.ok(ERWARTUNG.test('Danach können Sie die Karte abhaken.'));
  assert.ok(!ERWARTUNG.test('Was ist an dieser Laterne anders als an der nächsten?'));
  assert.ok(BEWERTUNG.test('Für jede erkannte Bauform gibt es Punkte zu sammeln.'));
  assert.ok(BEWERTUNG.test('Ihr Kind steht bei Stufe 2.'));
  assert.ok(BEWERTUNG.test('ein Vergleich mit anderen Kindern'));
  assert.ok(!BEWERTUNG.test('Drei oder vier Karten sind genug.'));
  assert.ok(EINSTUFUNG.test('Ein besonders begabtes Kind sieht das sofort.'));
  assert.ok(EINSTUFUNG.test('Das ist normal für sein Alter.'));
  assert.ok(WIRKVERSPRECHEN.test('Der Spaziergang fördert die Wahrnehmung Ihres Kindes.'));
  assert.ok(WIRKVERSPRECHEN.test('Das schult die Konzentration.'));
  assert.ok(!WIRKVERSPRECHEN.test('Die Höhe erzeugt den Druck in der Leitung.'));
});

test('Jahreszahlen und Epochennamen sind in den Karten gesperrt', () => {
  assert.ok(JAHRESZAHL.test('Erbaut 1873.'));
  assert.ok(JAHRESZAHL.test('Im Jahr 2019 umgebaut.'));
  assert.ok(EPOCHE.test('ein gotisches Fenster'));
  assert.ok(EPOCHE.test('So haben die Ritter gewohnt.'));
  assert.ok(EPOCHE.test('Gründerzeit'));
  for (const [wo, text] of kartenTexte(daten)) {
    assert.ok(!EPOCHE.test(text), `${wo}: ${text}`);
    assert.ok(!JAHRESZAHL.test(text), `${wo}: ${text}`);
  }
});

test('der Ortsname-Netz trifft Städte, aber nicht die weite Halle', () => {
  assert.ok(ORTSNAME.test('wie das Rathaus in Bremen'));
  assert.ok(ORTSNAME.test('In Nordrhein-Westfalen ist das anders.'));
  // Halle, Essen und Hof sind auch gewoehnliche Woerter (Falle A).
  assert.ok(!ORTSNAME.test('Ein sehr weites Dach ohne Stütze in der Mitte – eine Halle.'));
  assert.ok(!ORTSNAME.test('Ein Hof mit Markierungen und Fahrradständen.'));
  assert.ok(!ORTSNAME.test('Nehmen Sie etwas zum Essen mit.'));
  assert.ok(ORTSNAME.test('ein Wasserturm in Halle'));
});

test('kein Text der App verletzt die Netze', () => {
  for (const [wo, text] of angebotsTexte(daten)) {
    assert.ok(!ERWARTUNG.test(text), `${wo}: Erwartung`);
    assert.ok(!BEWERTUNG.test(text), `${wo}: Bewertung`);
    assert.ok(!EINSTUFUNG.test(text), `${wo}: Einstufung`);
    assert.ok(!WIRKVERSPRECHEN.test(text), `${wo}: Wirkversprechen`);
    assert.ok(!JAHRESZAHL.test(text), `${wo}: Jahreszahl`);
    assert.ok(!ORTSNAME.test(text), `${wo}: Ortsname`);
  }
  // Die Pruefung ist umgedreht: geprueft wird der REST.
  assert.ok(angebotsTexte(daten).length > 200);
  for (const feld of Object.keys(NICHT_GEPRUEFT)) assert.ok(feld in daten, feld);
});

test('karteVon findet und findet nicht', () => {
  assert.equal(karteVon(daten, 'n-rathaus').art, 'nichtErkennbar');
  assert.equal(karteVon(daten, 'gibt-es-nicht'), null);
  assert.equal(karteVon(null, 'n-rathaus'), null);
});

test('die Quelle ist geprüft und nennt ihre Zählung', () => {
  assert.equal(daten.quelle.geprueft, true);
  assert.match(daten.quelle.nachgezaehlt, /четырнадцать|14/);
  assert.match(daten.quelle.rechte, /НИО 2007/);
  assert.match(daten.quelle.abweichung, /своей\s+местности/);
});
