import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import {
  ARTEN, TAGE_FENSTER, NOTIZ_SCHLUESSEL, ZIELE_QUELLE, BEWERTUNG, REAKTION_DES_KINDES,
  DAUER_ALS_VORGABE, istTag, tagAus, fensterTage, pruefeNotiz, beschneide, notizenAm,
  tageMitNotiz, artenImFenster, fensterSatz, bericht, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/rituale.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const logikQuelle = await readFile(new URL('../logik.mjs', import.meta.url), 'utf8');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

const HEUTE = '2026-10-09';
const notiz = (tag, gelegenheit = 'r-aufwachen', art = 'a-gesungen') => ({ tag, gelegenheit, art });

test('Daten sind gültig und vollständig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.rituale.length, 10);
  assert.equal(daten.arten.length, ARTEN.length);
  for (const id of ARTEN) assert.ok(daten.arten.some((a) => a.id === id), `Art ${id} fehlt`);
});

test('eine Notiz trägt genau drei Angaben – nichts über das Kind', () => {
  assert.deepEqual([...NOTIZ_SCHLUESSEL], ['tag', 'gelegenheit', 'art']);
  assert.equal(pruefeNotiz(notiz(HEUTE), daten), true);
  // Das ist der Kern: ein Feld über das Kind kommt nicht durch – auch nicht
  // als harmlos aussehende Zusatzangabe.
  for (const extra of [{ reaktion: 'gefallen' }, { gefallen: true }, { kind: 'Mia' },
    { alter: 2 }, { bewertung: 3 }, { notiz: 'war schön' }]) {
    assert.equal(pruefeNotiz({ ...notiz(HEUTE), ...extra }, daten), false,
      `${Object.keys(extra)[0]} kam durch`);
  }
  // Und auch nicht über den Umweg des Speichers: beschneide wirft sie weg.
  const mitExtra = [{ ...notiz(HEUTE), reaktion: 'gefallen' }];
  assert.deepEqual(beschneide(mitExtra, HEUTE, daten), []);
  // Fehlende Angaben, falsche Art, falsche Gelegenheit: alles abgelehnt.
  assert.equal(pruefeNotiz({ tag: HEUTE, art: 'a-gesungen' }, daten), false);
  assert.equal(pruefeNotiz(notiz(HEUTE, 'r-aufwachen', 'a-erfunden'), daten), false);
  assert.equal(pruefeNotiz(notiz(HEUTE, 'r-erfunden'), daten), false);
});

test('der Tag kommt aus der LOKALEN Zeit, nicht aus UTC', () => {
  // Um 00:30 Ortszeit nennt toISOString() in Deutschland noch den Vortag –
  // und das ist genau die Uhrzeit, zu der jemand das Einschlaflied notiert.
  const spaet = new Date(2026, 9, 9, 0, 30, 0);
  assert.equal(tagAus(spaet), '2026-10-09');
  assert.equal(tagAus(new Date(2026, 0, 1, 23, 59, 0)), '2026-01-01');
  assert.equal(tagAus(new Date('kaputt')), '');
  assert.doesNotMatch(logikQuelle.replace(/^\s*\*.*$/gm, ''), /toISOString\(\)\.slice\(0, 10\)[\s\S]{0,40}new Date\(\)/);
  assert.match(code, /tagAus\(new Date\(\)\)/);
});

test('das Fenster hat sieben Tage, älteste zuerst', () => {
  assert.equal(TAGE_FENSTER, 7);
  const tage = fensterTage(HEUTE);
  assert.equal(tage.length, 7);
  assert.equal(tage[6], HEUTE);
  assert.equal(tage[0], '2026-10-03');
  assert.deepEqual(fensterTage('unsinn'), []);
  assert.equal(istTag('2026-02-30'), false, 'ein Datum, das es nicht gibt');
  assert.equal(istTag('2026-10-9'), false);
});

test('beschneide wirft Älteres weg – und zwar wirklich weg', () => {
  const alt = [notiz('2026-09-01'), notiz('2026-10-02'), notiz('2026-10-03'), notiz(HEUTE)];
  const neu = beschneide(alt, HEUTE, daten);
  assert.deepEqual(neu.map((n) => n.tag), ['2026-10-03', HEUTE]);
  // Doppelt antippen erzeugt keine Menge.
  assert.equal(beschneide([notiz(HEUTE), notiz(HEUTE)], HEUTE, daten).length, 1);
  // Dieselbe Gelegenheit mit anderer Art ist eine zweite Notiz.
  assert.equal(beschneide([notiz(HEUTE), notiz(HEUTE, 'r-aufwachen', 'a-gesummt')], HEUTE, daten).length, 2);
  assert.deepEqual(beschneide('kaputt', HEUTE, daten), []);
  // In der App läuft es an BEIDEN Stellen – sonst wächst der Speicher weiter.
  assert.match(code, /beschneide\(JSON\.parse\(rohText \?\? '\[\]'\), heute, daten\)/);
  // Und das Beschnittene muss ZURÜCKGESCHRIEBEN werden: beschneidet die App
  // nur ihre eigene Liste, bleibt das Alte auf der Platte liegen, und die
  // Zusage „beim Öffnen gelöscht" ist falsch. Die Browserprobe hat genau das
  // gefunden – eine Notiz von 2020 überlebte das Neuladen.
  assert.match(code, /if \(rohText !== null && JSON\.stringify\(notizen\) !== rohText\) speichere\(\);/);
  assert.match(code, /notizen = beschneide\(notizen, heute, daten\);[\s\S]{0,120}setItem/);
});

test('gezählt wird beschreibend – keine Quote, keine Serie', () => {
  // Keine exportierte Funktion rechnet eine Folge oder einen Anteil aus.
  for (const [name, wert] of Object.entries(logik)) {
    if (typeof wert !== 'function') continue;
    assert.doesNotMatch(name, /serie|streak|straehne|strähne|folge|quote|anteil|prozent|ampel|score|note|punkt|bewerte/i,
      `logik exportiert die Funktion ${name}`);
  }
  const drei = [notiz('2026-10-07'), notiz('2026-10-08'), notiz(HEUTE)];
  assert.equal(tageMitNotiz(drei, HEUTE), 3);
  const satz = fensterSatz(drei, HEUTE);
  assert.match(satz, /an 3 Tagen/);
  assert.doesNotMatch(satz, /\d+\s*von\s*\d+|\d+\s*%|nur |schon wieder|Serie|in Folge/i);
  // Ein leeres Fenster ist kein Befund.
  assert.match(fensterSatz([], HEUTE), /keine Lücke/);
  assert.doesNotMatch(fensterSatz([], HEUTE), /0 /);
});

test('die Stille ist eine Art – und sagt, warum', () => {
  assert.ok(ARTEN.includes('a-stille'));
  const stille = daten.arten.find((a) => a.id === 'a-stille');
  assert.match(stille.ohneKoennen, /mehr ist besser|kein leerer Tag/);
  // Ein Tag mit nur Stille ist ein Tag mit Notiz – das ist der Punkt.
  const nurStille = [notiz(HEUTE, 'r-warten', 'a-stille')];
  assert.equal(tageMitNotiz(nurStille, HEUTE), 1);
  assert.deepEqual(artenImFenster(nurStille, HEUTE), ['a-stille']);
  // Gegenprobe: ohne die Begründung meldet der Validator.
  const k = kopie();
  k.arten.find((a) => a.id === 'a-stille').ohneKoennen = 'Geht immer.';
  assert.match(pruefeDaten(k).join('\n'), /Stille-Art muss sagen, warum/);
});

test('jedes der acht Quellziele kommt vor – gebaut, begründet oder als Ganzes', () => {
  assert.equal(ZIELE_QUELLE, 8);
  assert.equal(daten.quelle.zahlen.zieleQuelle, 8);
  assert.deepEqual(daten.quelle.zahlen.uebernommeneZiele, [2, 3, 5, 6, 8]);
  assert.deepEqual(daten.quelle.zahlen.nichtUebernommeneZiele, [1, 4, 7]);
  assert.equal(daten.zielAlsGanzes.ziel, 8);
  assert.match(daten.zielAlsGanzes.warum, /Einlösung/);
  // Gegenproben: ein Ziel verschwinden lassen, und der Validator merkt es.
  const k = kopie();
  k.ausgeschlossen = k.ausgeschlossen.filter((a) => a.quellZiel !== 7);
  assert.match(pruefeDaten(k).join('\n'), /Quellziel 7: weder übernommen noch im Ausschluss begründet/);
  const z = kopie();
  delete z.zielAlsGanzes;
  assert.match(pruefeDaten(z).join('\n'), /Quellziel 8/);
  const g = kopie();
  g.zielAlsGanzes.warum = 'Passt schon.';
  assert.match(pruefeDaten(g).join('\n'), /zielAlsGanzes: es muss dastehen/);
  // Und ein Ziel, das als nicht übernommen gilt, darf nicht doch in einer
  // Zeile stehen – sonst widerspricht die Bilanz den Daten.
  const w = kopie();
  w.rituale[0].quellZiel = 7;
  assert.match(pruefeDaten(w).join('\n'), /Ziel 7 gilt als nicht übernommen und steht trotzdem/);
});

test('der Erwachsene ist in jeder Zeile der Handelnde', () => {
  for (const r of daten.rituale) assert.match(r.wasDuTust, /\bSie\b/, `${r.id}`);
  for (const a of daten.arten) assert.match(a.wasSieTun, /\bSie\b/, `${a.id}`);
  const k = kopie();
  k.rituale[0].wasDuTust = 'Das Kind singt beim Aufwachen mit.';
  assert.match(pruefeDaten(k).join('\n'), /nennt nicht SIE als die Handelnde/);
});

test('die Reaktion des Kindes ist verboten – das Absagefeld darf sie nennen', () => {
  // Falle A, zwölftes Mal im Projekt: das Feld, das etwas ausschließt, muss
  // es nennen dürfen. `keineReaktion` tut genau das.
  assert.match(daten.keineReaktion, /gefallen/);
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(REAKTION_DES_KINDES.test('Hat es Ihrem Kind gefallen?'), true);
  assert.equal(REAKTION_DES_KINDES.test('Wie hat Ihr Kind reagiert?'), true);
  assert.equal(REAKTION_DES_KINDES.test('Ihr Kind sang mit.'), true);
  assert.equal(REAKTION_DES_KINDES.test('Sie summen dicht am Ohr.'), false);
  const k = kopie();
  k.rituale[0].warumHier = 'Hat es gefallen, merkt man es gleich.';
  assert.match(pruefeDaten(k).join('\n'), /Reaktion des Kindes/);
});

test('keine Bewertung in den Zeilen – die Absagen nennen sie', () => {
  assert.equal(BEWERTUNG.test('eine Ampel'), true);
  assert.equal(BEWERTUNG.test('3 von 7 Tagen'), true);
  assert.equal(BEWERTUNG.test('vier Tage in Folge'), true);
  assert.match(daten.keineAmpel, /keine Ampel/);
  assert.match(daten.keineAmpel, /keine rote Stufe/);
  assert.match(daten.keineSerie, /in Folge/);
  const k = kopie();
  k.arten[0].ohneKoennen = 'Drei Tage in Folge sind ein guter Anfang.';
  assert.match(pruefeDaten(k).join('\n'), /Bewertung in Art/);
});

test('die Minutenzahl der Quelle steht als Angabe der Quelle', () => {
  assert.match(daten.minutenInDerQuelle, /1–2 bis 5 Minuten/);
  assert.match(daten.minutenInDerQuelle, /Angabe der Quelle/);
  assert.match(daten.minutenInDerQuelle, /keine Dauer/);
  assert.match(daten.minutenInDerQuelle, /abwendet/);
  // In einer Gelegenheit wäre dieselbe Zahl eine Vorgabe.
  assert.equal(DAUER_ALS_VORGABE.test('täglich 5 Minuten hören'), true);
  assert.equal(DAUER_ALS_VORGABE.test('mindestens 3 Minuten'), true);
  const k = kopie();
  k.rituale.find((r) => /Hör-Insel/.test(r.name)).wasDuTust = 'Sie hören täglich 5 Minuten zusammen Musik.';
  assert.match(pruefeDaten(k).join('\n'), /Dauer als Vorgabe/);
  // Und die Hör-Insel sagt an der Zeile selbst, dass sie keine Dauer hat.
  const insel = daten.rituale.find((r) => /Hör-Insel/.test(r.name));
  assert.match(insel.grenze, /[Kk]eine Dauer/);
  const z = kopie();
  delete z.rituale.find((r) => /Hör-Insel/.test(r.name)).grenze;
  assert.match(pruefeDaten(z).join('\n'), /Hör-Insel: die fehlende Dauer/);
});

test('keine Lieder, keine erfundene Übersetzung, und die Nachbarn sind benannt', () => {
  assert.match(daten.keineLiederliste, /Musikmomente 1–3/);
  assert.match(daten.keineLiederliste, /Familienschatz/);
  assert.match(daten.keineUebersetzung, /Behauptung/);
  assert.ok(daten.ausgeschlossen.some((a) => /Liederlisten/.test(a.was)));
  assert.match(code, /\.\.\/musikmomente-1-3\//);
  assert.match(code, /\.\.\/familienschatz-reime\//);
  // Kein Liedtext und kein Titel in den Zeilen.
  const k = kopie();
  k.rituale[0].wasDuTust = 'Sie singen die Strophe von gestern.';
  assert.match(pruefeDaten(k).join('\n'), /ein Lied in/);
});

test('die Gelegenheit zum Trösten nennt das Schütteln', () => {
  const t = daten.rituale.find((r) => /Trösten/.test(r.name));
  assert.match(t.grenze, /[Ss]chütteln/);
  const k = kopie();
  k.rituale.find((r) => /Trösten/.test(r.name)).grenze = 'Nichts weiter.';
  assert.match(pruefeDaten(k).join('\n'), /ohne den Satz zum Schütteln/);
});

test('die Bildschirmaussage ist die des Korpus', () => {
  assert.match(daten.bildschirm, /Für Kinder unter drei Jahren ist Bildschirmzeit nicht empfohlen/);
  const k = kopie();
  k.bildschirm = 'Musik ist besser als Fernsehen.';
  assert.match(pruefeDaten(k).join('\n'), /bildschirm/);
});

test('der Bericht trägt die Absagen mit', () => {
  const b = bericht(daten, [notiz(HEUTE)], HEUTE);
  assert.match(b, /mein eigenes Tun/);
  assert.match(b, /- Aufwachen: Selbst gesungen/);
  assert.ok(b.includes(daten.keinZiel));
  assert.ok(b.includes(daten.keineReaktion));
  // Leere Tage stehen nicht als Lücke im Bericht.
  assert.doesNotMatch(b, /2026-10-05/);
  assert.equal(notizenAm([notiz(HEUTE)], '2026-10-05').length, 0);
});

test('kyrillische Schrift steht nur in der Quellenangabe', () => {
  const k = kopie();
  k.rituale[0].name = 'Музыка';
  assert.match(pruefeDaten(k).join('\n'), /kyrillische Schrift außerhalb der Quellenangabe/);
  assert.match(daten.quelle.werk, /Пралеска/);
  assert.match(daten.quelle.rechte, /Eigenproduktion/);
});

test('App: ein Speicherschlüssel, löschbar, kein clear()', () => {
  const schluessel = [...code.matchAll(/localStorage\.(?:getItem|setItem|removeItem)\(([^,)]+)/g)].map((m) => m[1].trim());
  assert.ok(schluessel.length);
  for (const s of schluessel) assert.equal(s, 'SCHLUESSEL', `fremder Schlüssel: ${s}`);
  assert.match(code, /const SCHLUESSEL = 'mab\.notizen'/);
  assert.doesNotMatch(code, /localStorage\.clear\(/);
  assert.match(code, /datenKarte\(/);
  assert.match(code, /localStorage\.removeItem\(SCHLUESSEL\)/);
});

test('App: nichts über das Kind, kein Eingabefeld, kein Datumsfeld', () => {
  assert.doesNotMatch(code, /<input|type="date"|geburtsdatum/i);
  assert.match(code, /nichts über Ihr Kind/);
  // Gespeichert wird nur die Form aus logik.mjs.
  assert.match(code, /\{ tag: heute, gelegenheit, art \}/);
});

test('App: keine externen Anfragen, CSP steht in der Seite', () => {
  for (const [name, text] of [['app.mjs', app], ['logik.mjs', logikQuelle], ['index.html', seite], ['druck.css', druck]]) {
    assert.doesNotMatch(text, /https?:\/\//, `${name} enthält eine externe URL`);
  }
  assert.match(seite, /default-src 'self'; style-src 'self' 'unsafe-inline'/);
  assert.match(code, /installiereNetzwerkWaechter\(\)/);
  assert.match(seite, /<html lang="de">/);
  assert.match(code, /impressum\.html/);
});

test('App: Vorlesen nur mit einer Stimme, die auf dem Gerät liegt', () => {
  assert.match(code, /lokaleStimme\('de'\)/);
  assert.match(code, /vorlesen\([^)]*,\s*stimme\)/);
});

test('App: der Druckzettel ist ein Rückblick, keine Leistungsliste', () => {
  assert.match(druck, /\.mab-nur-druck \{ display: none; \}/);
  assert.match(druck, /\.mab-block button \{/);
  const block = code.slice(code.indexOf('mab-nur-druck'), code.indexOf('Zehn Gelegenheiten'));
  assert.match(block, /fensterSatz\(notizen, heute\)/);
  assert.match(block, /daten\.keinZiel/);
  assert.match(block, /daten\.keineReaktion/);
  assert.doesNotMatch(block, /Name: _|☐|☑|🔴/);
  for (const klasse of ['mab-nur-bildschirm', 'mab-nur-druck', 'mab-block']) {
    assert.ok(code.includes(klasse), `${klasse} wird nie benutzt`);
    assert.ok(druck.includes(klasse), `${klasse} fehlt in druck.css`);
  }
});

test('App: keine eltern.html, weil es keinen Kinderbildschirm gibt', async () => {
  const dateien = await readdir(new URL('../', import.meta.url));
  assert.ok(!dateien.includes('eltern.html'));
  assert.doesNotMatch(code, /eltern\.html/);
  assert.match(code, /kein Bildschirm fürs Kind/);
});

test('App: replaceChildren bekommt nur echte Knoten', () => {
  assert.equal([...code.matchAll(/app\.replaceChildren\(\.\.\.\[/g)].length, 1);
  assert.match(code, /\]\.filter\(Boolean\)\)/);
  assert.match(code, /const fehler = pruefeDaten\(daten\)/);
  assert.match(code, /Datenfehler: \$\{fehler\[0\]\}/);
});
