import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import {
  STUFEN, BEREICHE, ZIELE_QUELLE, ZIELE_MIT_KIND_HANDLUNG, BEWERTUNG, LOB_ALS_GRUND,
  ALTERSANGABE, DREIUNDZWANZIG, zeileVon, zeilenIm, bereicheInReihenfolge, pruefeStand,
  beschneide, stufeVon, gesetzteStufe, inBewegung, naechsteGelegenheiten, bericht, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/leiter.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const logikQuelle = await readFile(new URL('../logik.mjs', import.meta.url), 'utf8');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

const mit = (id, feld, wert) => {
  const k = kopie();
  const z = k.zeilen.find((x) => x.id === id);
  if (wert === undefined) delete z[feld]; else z[feld] = wert;
  return k;
};

test('Daten sind gültig und vollständig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.zeilen.length, 18);
  assert.equal(daten.bereiche.length, BEREICHE.length);
  for (const b of BEREICHE) assert.ok(zeilenIm(daten, b).length, `Bereich ${b} ist leer`);
});

test('es gibt keine Gesamtstufe – nicht als Funktion und nicht im Text', () => {
  // Eine Ampel über die Selbstständigkeit eines Kindes ist eine Einstufung
  // des Kindes. Geprüft werden die FUNKTIONEN; die Netze heißen nach dem,
  // was sie verbieten (`BEWERTUNG` ist die Regel gegen die Bewertung).
  for (const [name, wert] of Object.entries(logik)) {
    if (typeof wert !== 'function') continue;
    // Gebannt sind die Begriffe einer Gesamtwertung. NICHT gebannt ist das
    // Wort „Stand": `pruefeStand` prüft den gespeicherten Stand, also die
    // Zuordnung Zeile → Stufe, und ist keine Rangliste. Ein Netz auf
    // /stand$/ hätte genau diese Prüffunktion getroffen – Falle A, und
    // diesmal im selben Test, der sie verhindern soll.
    assert.doesNotMatch(name, /gesamtstand|gesamtstufe|summe|anteil|prozent|ampel|score|note|punkt|bewerte|rang/i,
      `logik exportiert die Funktion ${name}`);
  }
  assert.match(daten.wasEsIst, /keine Gesamtstufe/);
  const b = bericht(daten, { 'es-loeffel': 'sicher', 'es-becher': 'manchmal' });
  assert.doesNotMatch(b, /\d+\s*von\s*\d+|\d+\s*%|\bAmpel\b|\bStufe \d/i);
});

test('die drei Stufen sind Formen, keine Farben – und gehen zurück', () => {
  assert.deepEqual([...STUFEN], ['noch-nicht', 'manchmal', 'sicher']);
  for (const s of STUFEN) assert.ok(daten.stufenTexte[s], `Text für ${s} fehlt`);
  // Kein rotes Zeichen, keine Farbnamen in der Anzeige.
  assert.doesNotMatch(code, /🔴|🟢|🟡|rot|gruen|grün/i);
  assert.match(code, /STUFEN_ZEICHEN = \{ 'noch-nicht': '○', manchmal: '◐', sicher: '●' \}/);
  // Noch einmal auf dieselbe Stufe tippen nimmt sie zurück – es gibt keinen
  // Code, der eine erreichte Stufe festhält.
  assert.match(code, /if \(neu\[id\] === stufe\) delete neu\[id\]; else neu\[id\] = stufe;/);
  assert.doesNotMatch(code, /Math\.max|hoechste|höchste|nurVorwaerts/);
  assert.match(daten.keinRueckstand, /beide Richtungen/);
});

test('„noch nicht“ ist kein Befund', () => {
  assert.equal(stufeVon({}, 'es-loeffel'), 'noch-nicht');
  assert.equal(stufeVon({ 'es-loeffel': 'quatsch' }, 'es-loeffel'), 'noch-nicht');
  assert.match(daten.keinRueckstand, /noch nicht gesehen/);
  assert.match(bericht(daten, {}), /kein Befund/);
  // Die Wörter, die ein Defizit behaupten, sind in den Zeilen verboten –
  // im Absagefeld müssen sie stehen. Falle A, dreizehntes Mal.
  assert.equal(BEWERTUNG.test('Rückstand'), true);
  assert.equal(BEWERTUNG.test('zu spät'), true);
  assert.match(daten.keinRueckstand, /Rückstand/);
  assert.deepEqual(pruefeDaten(daten), []);
  assert.match(pruefeDaten(mit('es-becher', 'gelegenheit', 'Sie merken, ob es zu spät ist.')).join('\n'),
    /Bewertung in Zeile/);
});

test('das Kind handelt in jeder Zeile, der Erwachsene in jeder Gelegenheit', () => {
  for (const z of daten.zeilen) {
    assert.doesNotMatch(z.was, /\bSie\b|\bdu\b/, `${z.id}: was nennt den Erwachsenen`);
    assert.match(z.gelegenheit, /\bSie\b/, `${z.id}: gelegenheit ohne Erwachsenen`);
    assert.doesNotMatch(z.gelegenheit, /üben|trainier|Übung|beibringen/i, `${z.id}: Übung statt Gelegenheit`);
  }
  assert.match(pruefeDaten(mit('es-becher', 'was', 'Sie geben einen Becher.')).join('\n'),
    /was nennt den Erwachsenen/);
  assert.match(pruefeDaten(mit('es-becher', 'gelegenheit', 'Das Trinken üben.')).join('\n'),
    /gelegenheit nennt nicht SIE|Gelegenheit ist ein Angebot/);
  assert.match(pruefeDaten(mit('es-becher', 'gelegenheit', 'Sie üben das Trinken mit ihm.')).join('\n'),
    /die Gelegenheit ist ein Angebot, keine Übung/);
});

test('die Leiter ist ein Wald von Voraussetzungen, keine Altersfolge', () => {
  assert.deepEqual(zeilenIm(daten, 'anziehen').map((z) => z.id),
    ['an-schuhe-aus', 'an-socken-aus', 'an-jacke-aus', 'an-knopf', 'an-hose-an',
      'an-richtig-drehen', 'an-unordnung']);
  // Mehrere Ketten je Bereich sind erlaubt. Die erste Fassung erzwang genau
  // eine und hat damit eine Behauptung erzeugt, die nicht stimmte: dass
  // Händewaschen eine Voraussetzung des Aufräumens sei (Review Welle 80).
  for (const b of BEREICHE) {
    const drin = daten.zeilen.filter((z) => z.bereich === b);
    assert.ok(drin.some((z) => !z.vorher), `${b}: keine Wurzel`);
    assert.equal(zeilenIm(daten, b).length, drin.length, `${b}: nicht alle Zeilen erreichbar`);
    for (const z of drin) {
      if (!z.vorher) continue;
      assert.equal(zeileVon(daten, z.vorher).bereich, b, `${z.id}: vorher im anderen Bereich`);
    }
  }
  assert.match(daten.keineZahlen, /Reihenfolge der Voraussetzungen/);
  // Gegenproben: ein Kreis, ein Sprung über Bereichsgrenzen und ein Verweis
  // ins Leere fallen auf.
  const kreis = kopie();
  kreis.zeilen.find((z) => z.id === 'an-schuhe-aus').vorher = 'an-unordnung';
  assert.match(pruefeDaten(kreis).join('\n'), /von keiner Wurzel aus erreichbar/);
  assert.match(pruefeDaten(mit('es-becher', 'vorher', 'an-knopf')).join('\n'),
    /vorher liegt in einem anderen Bereich/);
  assert.match(pruefeDaten(mit('es-becher', 'vorher', 'gibt-es-nicht')).join('\n'), /gibt es nicht/);
});

test('nur drei Zeilen tragen ein Alter – und zwar das amtliche, mit Toleranz', () => {
  const amtliche = daten.zeilen.filter((z) => z.amtlich);
  assert.equal(amtliche.length, 3);
  // Wortlaut, Untersuchung, Fenster, Toleranz und Rubrik, wie im Volltext
  // der Kinder-Richtlinie nachgelesen.
  const erwartet = {
    'es-loeffel': ['Kann mit dem Löffel selber essen.', 'U7', '21. bis 24. Lebensmonat',
      '20. bis 27. Lebensmonat', 'Soziale/emotionale Kompetenz'],
    'an-knopf': ['Öffnet große Knöpfe selbst.', 'U7a', '34. bis 36. Lebensmonat',
      '33. bis 38. Lebensmonat', 'Perzeption/Kognition'],
    'ha-mitmachen': ['Beteiligt sich an häuslichen Tätigkeiten, will mithelfen.', 'U7a',
      '34. bis 36. Lebensmonat', '33. bis 38. Lebensmonat', 'Soziale/emotionale Kompetenz'],
  };
  for (const [id, [wortlaut, u, zeitraum, toleranz, rubrik]] of Object.entries(erwartet)) {
    const z = zeileVon(daten, id);
    assert.equal(z.was, wortlaut, `${id}: Wortlaut`);
    assert.equal(z.amtlich.wortlaut, wortlaut);
    assert.equal(z.amtlich.untersuchung, u);
    assert.equal(z.amtlich.zeitraum, zeitraum);
    assert.equal(z.amtlich.toleranz, toleranz);
    assert.equal(z.amtlich.rubrik, rubrik);
  }
  // Keine Zeile ohne amtliche Fundstelle nennt ein Alter.
  for (const z of daten.zeilen) {
    if (z.amtlich) continue;
    assert.doesNotMatch(`${z.was} ${z.gelegenheit} ${z.grenze ?? ''}`, ALTERSANGABE, `${z.id}`);
  }
  assert.match(pruefeDaten(mit('es-becher', 'gelegenheit', 'Sie zeigen es ab 2 Jahren.')).join('\n'),
    /Altersangabe ohne amtliche Fundstelle/);
  // Ohne Toleranzgrenze wird aus dem Fenster ein Punktalter.
  const k = kopie();
  delete k.zeilen.find((z) => z.id === 'es-loeffel').amtlich.toleranz;
  assert.match(pruefeDaten(k).join('\n'), /amtlich.toleranz fehlt/);
  // Und der Wortlaut muss mit der Zeile übereinstimmen – sonst steht ein
  // amtlicher Satz neben einem anderen Text.
  assert.match(pruefeDaten(mit('es-loeffel', 'was', 'Isst selbst mit dem Löffel.')).join('\n'),
    /der amtliche Wortlaut muss mit der Zeile übereinstimmen/);
});

test('ein solches Fenster ist eine späte Grenze, kein Durchschnitt', () => {
  assert.match(daten.amtlichErklaert, /SPÄTE Grenzen/);
  assert.match(daten.amtlichErklaert, /Toleranz/);
  assert.match(daten.amtlichErklaert, /nicht unter „Selbstständigkeit“/);
  // Das Wort „Grenzstein“ kommt in der Richtlinie nicht vor – das steht da.
  assert.match(daten.quelle.amtlich, /Grenzstein/);
  assert.match(daten.quelle.amtlich, /nicht die letzte sein/);
  const k = kopie();
  k.amtlichErklaert = 'Drei Sätze stehen in der Kinder-Richtlinie.';
  const f = pruefeDaten(k).join('\n');
  assert.match(f, /späte Grenze/);
});

test('die Katalogzahl „23 Fertigkeiten“ ist zurückgewiesen – und neun ist nachgezählt', () => {
  assert.equal(ZIELE_QUELLE, 23);
  // KORRIGIERT im Review der Welle 80: hier stand 4, und das war die Zahl der
  // eigenen GRUPPEN, nicht der Ziele. Nachgezählt im Quelltext S. 94-96 sind
  // es neun, die eine konkrete Handlung des Kindes benennen.
  assert.equal(ZIELE_MIT_KIND_HANDLUNG, 9);
  assert.equal(daten.quelle.zahlen.zieleQuelle, 23);
  assert.equal(daten.quelle.zahlen.abschnitte, 5);
  assert.equal(daten.quelle.zahlen.zieleMitKindHandlung, 9);
  assert.equal(daten.quelle.kindHandlungen.length, 9);
  assert.match(daten.quelle.nachgezaehlt, /benennen davon neun/);
  assert.match(daten.quelle.nachgezaehlt, /ein einziges Ziel/);
  assert.ok(daten.ausgeschlossen.some((a) => /23/.test(a.was)));
  assert.equal(DREIUNDZWANZIG.test('23 lebenspraktische Fertigkeiten'), true);
  assert.match(pruefeDaten(mit('es-becher', 'gelegenheit', 'Sie gehen die 23 Fertigkeiten durch.')).join('\n'),
    /Fehllesung/);
  // Jedes der neun Ziele steht in einer Zeile ODER im Ausschluss, und keines
  // in beidem. Gebaut sind sieben, begründet nicht übernommen zwei.
  const benutzt = new Set(daten.zeilen.map((z) => z.quellZiel).filter(Number.isInteger));
  const abgelehnt = new Set(daten.ausgeschlossen.map((a) => a.quellZiel).filter(Number.isInteger));
  assert.equal(benutzt.size, 7);
  assert.deepEqual([...abgelehnt].sort(), [7, 8]);
  for (let n = 1; n <= 9; n++) {
    assert.ok(benutzt.has(n) || abgelehnt.has(n), `Quellziel ${n} fehlt`);
  }
  const k = kopie();
  for (const z of k.zeilen) if (z.quellZiel === 9) z.quellZiel = 5;
  assert.match(pruefeDaten(k).join('\n'), /Quellziel 9 mit Kind-Handlung: weder in einer Zeile noch im Ausschluss/);
  // Und eine Zeile ohne Quellziel muss sagen, woher sie kommt.
  for (const z of daten.zeilen) {
    if (z.quellZiel === null) assert.ok(z.eigen, `${z.id} ohne eigen`);
  }
  const e = kopie();
  delete e.zeilen.find((z) => z.id === 'es-becher').eigen;
  assert.match(pruefeDaten(e).join('\n'), /dann muss „eigen“ sagen, woher die Zeile kommt/);
});

test('kein Handgriff wird mit der Freude des Erwachsenen begründet', () => {
  // Das Motiv der Quelle, das nicht übertragbar ist: damit wird das Gefallen
  // des Erwachsenen zum Zweck der Hygiene.
  assert.equal(LOB_ALS_GRUND.test('damit Mama sich freut'), true);
  assert.equal(LOB_ALS_GRUND.test('weil Sie stolz sind'), true);
  assert.equal(LOB_ALS_GRUND.test('Sie setzen sich daneben und warten'), false);
  assert.ok(daten.ausgeschlossen.some((a) => /freuen/i.test(a.was)));
  assert.match(pruefeDaten(mit('ha-haende', 'gelegenheit', 'Sie waschen mit, damit Sie sich freuen können.')).join('\n'),
    /Gefallen des Erwachsenen als Grund/);
});

test('kein Lohn: keine Tafel, keine Sterne, keine Serie', () => {
  assert.match(daten.keinLohn, /keine Belohnungstafel/);
  assert.match(daten.keinLohn, /keine Serie|keine Funktion, die aufeinanderfolgende Tage zählt/);
  for (const [name, wert] of Object.entries(logik)) {
    if (typeof wert !== 'function') continue;
    // „Folge" allein ist harmlos: `bereicheInReihenfolge` ordnet Bereiche.
    // Gemeint ist die Konstruktion „Tage in Folge".
    assert.doesNotMatch(name, /serie|streak|strähne|inFolge|folgeTage|belohn|stern/i,
      `logik exportiert ${name}`);
  }
  assert.ok(daten.ausgeschlossen.some((a) => /Belohnungstafel/i.test(a.was)));
});

test('der Nutzen steckt in „manchmal“ – und das Nächste kommt aus der Kette', () => {
  assert.match(daten.wozuDasGut, /manchmal/);
  assert.deepEqual(inBewegung(daten, { 'ha-haende': 'manchmal' }).map((z) => z.id), ['ha-haende']);
  // Das Nächste ist abgeleitet, nicht vorhergesagt: Voraussetzung sicher,
  // die Zeile selbst noch nicht gesehen.
  assert.deepEqual(naechsteGelegenheiten(daten, { 'na-giessen': 'sicher' }).map((z) => z.id), ['na-fuettern']);
  // Eine Zeile ohne Voraussetzung gilt nie als „nächste“ – sonst stünden beim
  // ersten Öffnen vier Aufgaben da.
  assert.deepEqual(naechsteGelegenheiten(daten, {}), []);
  // Und was schon sicher ist, taucht nicht wieder auf.
  assert.deepEqual(naechsteGelegenheiten(daten, { 'na-giessen': 'sicher', 'na-fuettern': 'sicher' })
    .map((z) => z.id), ['na-ernten']);
});

test('der Speicher trägt nur Zeile und Stufe', () => {
  assert.equal(pruefeStand({ 'es-loeffel': 'sicher' }, daten), true);
  assert.equal(pruefeStand({ 'es-loeffel': 'super' }, daten), false);
  assert.equal(pruefeStand({ name: 'Mia' }, daten), false);
  assert.deepEqual(beschneide({ 'es-loeffel': 'sicher', name: 'Mia', 'gibt-es-nicht': 'sicher' }, daten),
    { 'es-loeffel': 'sicher' });
  assert.deepEqual(beschneide(null, daten), {});
  // In der App läuft das beim Laden UND beim Speichern, und das Beschnittene
  // wird zurückgeschrieben – der Defekt, den die Browserprobe in Nr. 57 fand.
  assert.match(code, /beschneide\(JSON\.parse\(rohText \?\? '\{\}'\), daten\)/);
  assert.match(code, /if \(rohText !== null && JSON\.stringify\(stand\) !== rohText\) speichere\(\);/);
  assert.match(code, /stand = beschneide\(stand, daten\);/);
});

test('keine Erste-Hilfe-Anleitung, aber die zuständige Stelle', () => {
  assert.match(daten.keineErsteHilfe, /keine Erste-Hilfe-Anleitung/);
  assert.match(daten.keineErsteHilfe, /112/);
  assert.match(daten.keineErsteHilfe, /bundesweite Nummer dafür gibt es nicht/);
  assert.ok(daten.ausgeschlossen.some((a) => /Erste-Hilfe/i.test(a.was)));
  // Keine Behandlungsanweisung in den Zeilen.
  for (const z of daten.zeilen) {
    assert.doesNotMatch(`${z.grenze ?? ''}`, /kühl\w*|Minuten (kalt|unter)|Milch geben|Erbrechen/i, `${z.id}`);
  }
});

test('die Sicherheitsgrenzen nennen Gefahr und Vorsorge, keine Zahl ohne Quelle', () => {
  const teller = zeileVon(daten, 'es-teller');
  assert.match(teller.grenze, /Wassertemperatur steht hier absichtlich nicht/);
  assert.match(teller.grenze, /Leitlinie zu Verbrennungen/);
  const wischen = zeileVon(daten, 'ha-wischen');
  assert.match(wischen.grenze, /nie ein Putzmittel/);
  assert.match(wischen.grenze, /umgefüllt in eine Getränkeflasche/);
  const giessen = zeileVon(daten, 'na-giessen');
  assert.match(giessen.grenze, /nicht das Gießen, sondern die Pflanze/);
  // Korrigiert im Review der Welle 80: hier stand „Kinder unter zehn Jahren
  // machen den größten Teil der Pflanzenvergiftungen aus" und eine
  // Bundesanzeiger-Fundstelle. Beides war nicht nachgelesen, und das
  // ausgeschriebene Zahlwort brach zugleich die eigene Zusage „kein Alter".
  assert.match(giessen.grenze, /führt keine Pflanzenliste/);
  assert.match(giessen.grenze, /Giftinformationszentrum/);
  assert.doesNotMatch(giessen.grenze, /Bundesanzeiger|zehn Jahren/);
  assert.ok(daten.ausgeschlossen.some((a) => /Liste giftiger Pflanzen/i.test(a.was)));
  const haende = zeileVon(daten, 'ha-haende');
  assert.match(haende.grenze, /Kaltes Wasser genügt/);
  assert.match(haende.grenze, /rechtlich nicht bindend/);
  assert.ok(daten.ausgeschlossen.some((a) => /Wassertemperatur/i.test(a.was)));
});

test('kyrillische Schrift steht nur in der Quellenangabe', () => {
  assert.match(pruefeDaten(mit('es-becher', 'was', 'Пьёт из чашки.')).join('\n'),
    /kyrillische Schrift außerhalb der Quellenangabe/);
  assert.match(daten.quelle.werk, /Пралеска/);
  assert.match(daten.quelle.rechte, /Eigenproduktion/);
  // Auch die Ausschlussliste bleibt deutsch – der Tischdienst wird
  // beschrieben, nicht zitiert.
  for (const a of daten.ausgeschlossen) assert.doesNotMatch(a.warum, /[Ѐ-ӿ]/);
});

test('App: ein Speicherschlüssel, löschbar, kein clear()', () => {
  const schluessel = [...code.matchAll(/localStorage\.(?:getItem|setItem|removeItem)\(([^,)]+)/g)].map((m) => m[1].trim());
  assert.ok(schluessel.length);
  for (const s of schluessel) assert.equal(s, 'SCHLUESSEL', `fremder Schlüssel: ${s}`);
  assert.match(code, /const SCHLUESSEL = 'ssl\.stand'/);
  assert.doesNotMatch(code, /localStorage\.clear\(/);
  assert.match(code, /datenKarte\(/);
  assert.match(code, /localStorage\.removeItem\(SCHLUESSEL\)/);
  assert.doesNotMatch(code, /<input|type="date"|geburtsdatum/i);
});

test('App: keine externen Anfragen, CSP steht in der Seite', () => {
  for (const [name, text] of [['app.mjs', app], ['logik.mjs', logikQuelle], ['index.html', seite], ['druck.css', druck]]) {
    assert.doesNotMatch(text, /https?:\/\//, `${name} enthält eine externe URL`);
  }
  assert.match(seite, /default-src 'self'; style-src 'self' 'unsafe-inline'/);
  assert.match(code, /installiereNetzwerkWaechter\(\)/);
  assert.match(seite, /<html lang="de">/);
  assert.match(code, /impressum\.html/);
  assert.match(code, /lokaleStimme\('de'\)/);
  assert.match(code, /vorlesen\([^)]*,\s*stimme\)/);
});

test('App: auf dem Papier stehen keine Stufen', () => {
  // Ein Blatt mit drei Kreisen pro Zeile wäre ein Befund über ein Kind.
  const block = code.slice(code.indexOf('ssl-nur-druck'), code.indexOf('Die drei amtlichen Sätze'));
  assert.doesNotMatch(block, /STUFEN_ZEICHEN|stufenTexte/);
  assert.match(block, /daten\.keinRueckstand/);
  assert.match(block, /daten\.keinScreening/);
  assert.doesNotMatch(block, /Name: _|☐|☑/);
  assert.match(druck, /\.ssl-nur-druck \{ display: none; \}/);
  for (const klasse of ['ssl-nur-bildschirm', 'ssl-nur-druck', 'ssl-block']) {
    assert.ok(code.includes(klasse), `${klasse} wird nie benutzt`);
    assert.ok(druck.includes(klasse), `${klasse} fehlt in druck.css`);
  }
});

test('App: keine eltern.html, replaceChildren sauber, Datenfehler sichtbar', async () => {
  const dateien = await readdir(new URL('../', import.meta.url));
  assert.ok(!dateien.includes('eltern.html'));
  assert.doesNotMatch(code, /eltern\.html/);
  assert.match(code, /kein Bildschirm fürs Kind/);
  assert.equal([...code.matchAll(/app\.replaceChildren\(\.\.\.\[/g)].length, 1);
  assert.match(code, /\]\.filter\(Boolean\)\)/);
  assert.match(code, /const fehler = pruefeDaten\(daten\)/);
  assert.match(code, /Datenfehler: \$\{fehler\[0\]\}/);
  assert.equal(bereicheInReihenfolge(daten)[0].id, 'anziehen');
});

test('ALTERSANGABE trifft auch die Notation der Richtlinie und Zahlwörter', () => {
  // Die erste Fassung liess genau das durch, was sie verhindern sollte
  // (Review Welle 80).
  for (const t of ['34. bis 36. Lebensmonat', 'nach 30 Monaten', 'im 3. Lebensjahr',
    'bis etwa 3 Jahren', 'Kinder unter zehn Jahren', 'ab 2 Jahren', 'mit 24 Monaten']) {
    assert.equal(ALTERSANGABE.test(t), true, `durchgelassen: ${t}`);
  }
  // Und keine der 18 Zeilen ohne amtliche Fundstelle enthält eine.
  for (const z of daten.zeilen) {
    if (z.amtlich) continue;
    assert.doesNotMatch(`${z.was} ${z.gelegenheit} ${z.grenze ?? ''} ${z.eigen ?? ''}`,
      ALTERSANGABE, `${z.id}`);
  }
  assert.match(pruefeDaten(mit('es-becher', 'gelegenheit', 'Sie zeigen es im 3. Lebensjahr.')).join('\n'),
    /Altersangabe ohne amtliche Fundstelle/);
});

test('„nicht angetippt“ ist nicht dasselbe wie „auf noch nicht gesetzt“', () => {
  // Die erste Fassung meldete beim ersten Öffnen alle Zeilen als „noch nicht,
  // gedrückt" (Review Welle 80).
  assert.equal(gesetzteStufe({}, 'es-loeffel'), null);
  assert.equal(gesetzteStufe({ 'es-loeffel': 'noch-nicht' }, 'es-loeffel'), 'noch-nicht');
  assert.equal(gesetzteStufe({ 'es-loeffel': 'quatsch' }, 'es-loeffel'), null);
  // Für die Auswertung bleibt der Vorgabewert, weil ein leeres Feld kein
  // Befund ist – aber die Anzeige unterscheidet.
  assert.equal(stufeVon({}, 'es-loeffel'), 'noch-nicht');
  assert.match(code, /const jetzt = gesetzteStufe\(stand, z\.id\);/);
});

test('das amtliche Detail nennt die späte Grenze – auch auf dem Papier', () => {
  // `amtlichErklaert` steht nur in einem Abschnitt, der zugeklappt startet
  // und nicht mitdruckt; das Detail an der Zeile druckt mit (Review Welle 80).
  assert.match(code, /Ein solches Fenster ist eine SPÄTE `/);
  assert.match(code, /Grenze und kein Durchschnitt/);
  assert.match(code, /z\.eigen/);
  assert.match(code, /klasse: 'ssl-nur-bildschirm'/);
  assert.match(code, /voiceschanged/);
});

test('die Quellenangabe nennt den Abschnitt, der wirklich dort steht', () => {
  // «Трудовое воспитание» kommt im Quelltext NULL Mal vor; der Abschnitt auf
  // S. 94 heißt «ПРИОБЩАЕМСЯ К ТРУДУ» (Review Welle 80, selbst nachgezählt).
  assert.match(daten.quelle.werk, /ПРИОБЩАЕМСЯ К ТРУДУ/);
  assert.doesNotMatch(daten.quelle.werk, /Трудовое воспитание/);
  assert.match(daten.quelle.werk, /S\. 94–96/);
  for (const text of [logikQuelle, app]) assert.doesNotMatch(text, /Трудовое воспитание/);
});
