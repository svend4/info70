import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import {
  FORMEN, VARIANTEN, EINTEILUNG, WIRKVERSPRECHEN, VORGABE, FREMDTEXT,
  letztesWort, reimtSich, artikelVon, stoffVon, formVon, umfaengeVon,
  erzeuge, alleTexte, textBlock, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/stoffe.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const logikQuelle = await readFile(new URL('../logik.mjs', import.meta.url), 'utf8');
// Ohne Kommentare: der Kommentar, der `Math.random` verbietet, nennt es -
// Falle A, siebzehntes Mal, und diesmal im Test.
const logikCode = logikQuelle.replace(/^\s*(?:\/\/|\*|\/\*).*$/gm, '');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const texte = alleTexte(daten);

const mitStoff = (id, feld, wert) => {
  const k = kopie();
  const s = k.stoffe.find((x) => x.id === id);
  if (wert === undefined) delete s[feld]; else s[feld] = wert;
  return k;
};

test('Daten sind gültig und vollständig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.stoffe.length, 6);
  assert.equal(daten.formen.length, FORMEN.length);
  for (const id of FORMEN) assert.ok(formVon(daten, id), `Form ${id} fehlt`);
});

test('ALLES ist Eigenproduktion – über den ganzen Ausgaberaum geprüft', () => {
  // Das ist die tragende Zusage dieser App, und sie ist hier nicht behauptet,
  // sondern nachgezählt: der Ausgaberaum ist endlich, also vollständig
  // prüfbar. Ein Erzeuger, der irgendwann eine überlieferte Zeile ausspuckt,
  // fällt auf, bevor jemand sie ausdruckt.
  assert.equal(texte.length, 288);
  const zeilen = texte.flatMap((t) => t.zeilen);
  assert.equal(zeilen.length, 1776);
  const flach = (s) => s.toLowerCase().replace(/[^a-zäöüß ]/g, ' ').replace(/\s+/g, ' ');
  const treffer = [];
  for (const z of zeilen) {
    for (const a of daten.bekannteAnfaenge) if (flach(z).includes(flach(a))) treffer.push(`${a} → ${z}`);
  }
  assert.deepEqual(treffer, [], treffer.join(' | '));
  // Und die Sperre selbst muss greifen: ein eingeschmuggelter Anfang fällt auf.
  const k = kopie();
  k.vorlagen.klanggeschichte.anfang = ['Backe, backe Kuchen, der Bäcker hat gerufen.'];
  const geschmuggelt = alleTexte(k).flatMap((t) => t.zeilen)
    .some((z) => flach(z).includes('backe backe kuchen'));
  assert.equal(geschmuggelt, true, 'die Probe findet den eingeschmuggelten Anfang nicht');
  assert.match(daten.eigenproduktion, /auch nicht in Teilen/);
});

test('der Erzeuger ist deterministisch – kein Math.random', () => {
  assert.doesNotMatch(logikCode, /Math\.random/);
  assert.doesNotMatch(code, /Math\.random/);
  const a = erzeuge(daten, { stoff: 's-hof', form: 'klanggeschichte', umfang: 3, variante: 2 });
  const b = erzeuge(daten, { stoff: 's-hof', form: 'klanggeschichte', umfang: 3, variante: 2 });
  assert.deepEqual(a, b);
  // Eine andere Variante gibt einen anderen Text – sonst wäre der Knopf
  // „Noch eine" eine Lüge.
  const c = erzeuge(daten, { stoff: 's-hof', form: 'klanggeschichte', umfang: 3, variante: 3 });
  assert.notDeepEqual(a.zeilen, c.zeilen);
  // Und die Variante läuft im Kreis.
  const d = erzeuge(daten, { stoff: 's-hof', form: 'klanggeschichte', umfang: 3, variante: VARIANTEN + 2 });
  assert.deepEqual(a.zeilen, d.zeilen);
  assert.match(code, /variante = \(variante \+ 1\) % VARIANTEN/);
});

test('die Klanggeschichte hat so viele Bilder wie bestellt – und zu jedem einen Körperklang', () => {
  for (const n of umfaengeVon(daten, 'klanggeschichte')) {
    for (const s of daten.stoffe) {
      const t = erzeuge(daten, { stoff: s.id, form: 'klanggeschichte', umfang: n, variante: 0 });
      // Anfang + n Bilder + Schluss
      assert.equal(t.zeilen.length, n + 2, `${s.id} mit ${n}`);
      assert.equal(t.klaenge.length, n);
      for (const k of t.klaenge) assert.ok(k.trim().length, 'Klang leer');
    }
  }
  // Ohne Körperklang braucht die Geschichte ein Instrument – das wehrt der Validator ab.
  const k = kopie();
  delete k.stoffe[0].figuren[0].koerperklang;
  assert.match(pruefeDaten(k).join('\n'), /ohne koerperklang/);
});

test('Frage und Antwort reimt sich – und der Validator rechnet es nach', () => {
  for (const s of daten.stoffe) {
    for (const r of s.reimpaare) {
      assert.equal(reimtSich(r.frage, r.antwort), true,
        `${s.id}: ${letztesWort(r.frage)} / ${letztesWort(r.antwort)}`);
      assert.match(r.frage, /\?$/);
    }
  }
  // Die Regel: gemeinsame Endung ab zwei Zeichen, mit einem Vokal darin.
  assert.equal(reimtSich('Wer ruft im Haus?', 'Da sitzt die Maus.'), true);
  assert.equal(reimtSich('Wer schiebt die Wolken rauf?', 'Der Wind legt noch was drauf.'), true);
  assert.equal(reimtSich('Wer nimmt dich mit?', 'Es geht Schritt für Schritt.'), false, 'mit/Schritt ist kein Treffer der Regel');
  assert.equal(reimtSich('Wer schaut?', 'Ganz leise, kaum.'), false);
  // Dasselbe Wort ist kein Reim, sondern eine Wiederholung.
  assert.equal(reimtSich('Wer kocht?', 'Der Topf kocht.'), false);
  const k = mitStoff('s-hof', 'reimpaare', [
    { frage: 'Wer ruft so früh im Haus?', antwort: 'Der Hahn ruft kikeriki, ganz laut.' },
    { frage: 'Wer liegt im Stall?', antwort: 'Die Kuh macht muuuh.' },
    { frage: 'Wer schleicht umher?', antwort: 'Die Katze macht miau.' },
  ]);
  assert.match(pruefeDaten(k).join('\n'), /reimen sich nicht/);
});

test('der Kettenreim wächst, und die Grammatik stimmt', () => {
  const t = erzeuge(daten, { stoff: 's-hof', form: 'kettenreim', umfang: 4, variante: 0 });
  // Anfang + 4 Glieder + Schluss
  assert.equal(t.zeilen.length, 6);
  // Jede Zeile ist länger als die davor – das ist die Form der Quelle.
  const kern = t.zeilen.slice(0, 5);
  for (let i = 1; i < kern.length; i++) {
    assert.ok(kern[i].length > kern[i - 1].length, `Zeile ${i + 1} ist nicht länger`);
  }
  // Die letzte Zeile trägt alle Glieder.
  assert.match(kern[4], /der auf dem Eimer steht\.$/);
  // Relativpronomen passt zum Artikel des eigenen Nomens.
  for (const s of daten.stoffe) {
    for (const g of s.kette.glieder) {
      assert.equal(artikelVon(g.satzteil), artikelVon(g.wer), `${s.id}: ${g.wer} / ${g.satzteil}`);
    }
  }
  const k = kopie();
  k.stoffe[0].kette.glieder[1].satzteil = 'der den Hahn anschaut';
  assert.match(pruefeDaten(k).join('\n'), /das Relativpronomen passt nicht zum Artikel/);
});

test('jede Zeile fängt groß an', () => {
  // Die Figurennamen stehen mit Artikel in den Daten („die Kuh"), und eine
  // Vorlage, die mit {figur} anfängt, hätte sonst einen kleinen Satzanfang –
  // beim Bau aufgefallen an „die Kuh kommt: muuuh.".
  const klein = texte.flatMap((t) => t.zeilen)
    .filter((z) => z && /[a-zäöü]/.test(z[0]) && z[0] === z[0].toLowerCase());
  assert.deepEqual(klein, []);
});

test('keine Einteilung von Kindern – das Absagefeld darf sie nennen', () => {
  // Falle A, sechzehntes Mal: `keinNiveau` MUSS „Niveau der Musikalität"
  // nennen, um die Einteilung der Quelle auszuschließen.
  assert.match(daten.keinNiveau, /Niveau der Musikalität/);
  assert.deepEqual(pruefeDaten(daten), []);
  // Ohne abschließendes `\b`: `musikalisch\b` trifft „musikalische" nicht.
  assert.equal(EINTEILUNG.test('für musikalische Kinder'), true);
  assert.equal(EINTEILUNG.test('ein begabtes Kind'), true);
  assert.equal(EINTEILUNG.test('ein unmusikalisches Kind'), true);
  assert.equal(EINTEILUNG.test('Niveau der Musikalität'), true);
  assert.equal(EINTEILUNG.test('Sie machen den Klang mit der Hand'), false);
  const k = mitStoff('s-hof', 'name', 'Auf dem Hof (für musikalische Kinder)');
  assert.match(pruefeDaten(k).join('\n'), /Einteilung eines Kindes/);
  // Statt des Niveaus steht bei jeder Form eine beobachtbare Handlung.
  for (const f of daten.formen) assert.ok(f.woranSieSehen?.trim(), `${f.id}`);
  const z = kopie();
  delete z.formen[0].woranSieSehen;
  assert.match(pruefeDaten(z).join('\n'), /woranSieSehen fehlt/);
});

test('kein Wirkversprechen, keine Dauer, keine Dezibelzahl', () => {
  assert.equal(WIRKVERSPRECHEN.test('Das fördert die Sprachentwicklung.'), true);
  assert.equal(VORGABE.test('täglich zehn Minuten'), true);
  assert.equal(VORGABE.test('nicht über 85 dB'), true);
  assert.match(daten.keinWirkversprechen, /verspricht nichts/);
  assert.match(daten.keineDauer, /abwendet/);
  assert.match(daten.lautstaerke, /ohne Stimmheben/);
  assert.doesNotMatch(daten.lautstaerke, /\d+\s*(dB|Dezibel)/);
  assert.match(pruefeDaten(mitStoff('s-hof', 'ort', 'im Stall, täglich 10 Minuten')).join('\n'), /Vorgabe in/);
  assert.match(pruefeDaten(mitStoff('s-hof', 'ort', 'im Stall – das fördert die Sprache')).join('\n'),
    /Wirkversprechen in/);
  // Und im ganzen Ausgaberaum steht keine Vorgabe.
  for (const t of texte) {
    for (const z of t.zeilen) {
      assert.doesNotMatch(z, VORGABE, `Vorgabe im erzeugten Text: ${z}`);
      assert.doesNotMatch(z, WIRKVERSPRECHEN, `Wirkversprechen im erzeugten Text: ${z}`);
      assert.doesNotMatch(z, EINTEILUNG, `Einteilung im erzeugten Text: ${z}`);
    }
  }
});

test('keine fremden Texte, keine erfundene Übersetzung', () => {
  assert.equal(FREMDTEXT.test('Die zweite Strophe lautet …'), true);
  assert.match(pruefeDaten(mitStoff('s-hof', 'ort', 'im Stall, Strophe 2')).join('\n'), /ein fremder Text/);
  assert.match(daten.keineUebersetzung, /Behauptung/);
  assert.ok(daten.ausgeschlossen.some((a) => /ukrainische/i.test(a.was)));
  // Kyrillisch steht nur in der Quellenangabe und in den Ausschlussgründen,
  // die die Märchen der Quelle benennen müssen.
  assert.match(pruefeDaten(mitStoff('s-hof', 'name', 'Репка')).join('\n'),
    /kyrillische Schrift außerhalb der Quellenangabe/);
  assert.match(daten.quelle.werk, /Пралеска/);
});

test('die Quellbilanz ist nachgezählt', () => {
  assert.equal(daten.quelle.zahlen.zieleGesangskreativitaet, 4);
  assert.equal(daten.quelle.zahlen.zieleInstrumente, 6);
  assert.equal(daten.quelle.zahlen.zieleMitZeichen, 2);
  assert.match(daten.quelle.nachgezaehlt, /Fußnote mit dieser Bedeutung steht auf S\. 79/);
  assert.match(daten.quelle.abweichung, /Marschak/);
  const k = kopie();
  k.quelle.zahlen.zieleInstrumente = 5;
  assert.match(pruefeDaten(k).join('\n'), /S\. 86 trägt 6 Ziele/);
});

test('jeder Stoff trägt jede Form – kein Knopf ohne Text', () => {
  for (const s of daten.stoffe) {
    for (const f of daten.formen) {
      for (const n of f.umfaenge) {
        const t = erzeuge(daten, { stoff: s.id, form: f.id, umfang: n, variante: 0 });
        assert.ok(t, `${s.id}/${f.id}/${n} liefert nichts`);
        assert.ok(t.zeilen.length >= 3, `${s.id}/${f.id}/${n} ist zu kurz`);
        for (const z of t.zeilen) assert.doesNotMatch(z, /\{\w+\}/, `offene Lücke: ${z}`);
      }
    }
  }
  // Ein Stoff mit zu wenigen Figuren fällt auf.
  const k = kopie();
  k.stoffe[0].figuren = k.stoffe[0].figuren.slice(0, 2);
  assert.match(pruefeDaten(k).join('\n'), /Figuren, die Klanggeschichte braucht/);
});

test('ein unbekannter Stoff oder eine unbekannte Form gibt nichts', () => {
  assert.equal(erzeuge(daten, { stoff: 'gibt-es-nicht', form: 'klanggeschichte', umfang: 3 }), null);
  assert.equal(erzeuge(daten, { stoff: 's-hof', form: 'gibt-es-nicht', umfang: 3 }), null);
  // Ein Umfang, den die Form nicht kennt, fällt auf den ersten zurück.
  const t = erzeuge(daten, { stoff: 's-hof', form: 'klanggeschichte', umfang: 99, variante: 0 });
  assert.equal(t.zeilen.length, umfaengeVon(daten, 'klanggeschichte')[0] + 2);
  assert.equal(stoffVon(daten, 'gibt-es-nicht'), null);
});

test('der Textblock trägt die Absagen mit', () => {
  const b = textBlock(daten, { stoff: 's-abend', form: 'frage-antwort', umfang: 2, variante: 0 });
  assert.match(b, /Frage und Antwort: Am Abend/);
  assert.ok(b.includes(daten.keineDauer));
  assert.ok(b.includes(daten.lautstaerke));
  assert.ok(b.includes(daten.eigenproduktion));
  assert.equal(textBlock(daten, { stoff: 'gibt-es-nicht', form: 'klanggeschichte', umfang: 3 }), '');
});

test('App: speichert nichts', () => {
  assert.doesNotMatch(code, /localStorage|sessionStorage|indexedDB/i);
  assert.match(code, /speichert nichts/);
  assert.doesNotMatch(code, /datenKarte/);
  assert.doesNotMatch(code, /<input|type="date"/i);
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
  assert.match(code, /voiceschanged/);
});

test('App: das Druckblatt ist ein Vorleseblatt', () => {
  assert.match(druck, /\.kge-nur-druck \{ display: none; \}/);
  assert.match(druck, /\.kge-block button \{/);
  // Vorlesegröße: der Text muss größer sein als die übliche 10pt-Liste.
  assert.match(druck, /\.kge-block p \{ font-size: 14pt/);
  assert.doesNotMatch(druck, /Name: _/);
  for (const klasse of ['kge-nur-bildschirm', 'kge-nur-druck', 'kge-block']) {
    assert.ok(code.includes(klasse) || druck.includes(klasse), `${klasse} fehlt`);
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
  // Keine exportierte Funktion, die ein Kind bewertet.
  for (const [name, wert] of Object.entries(logik)) {
    if (typeof wert !== 'function') continue;
    assert.doesNotMatch(name, /bewerte|note|score|niveau|einstuf|rang/i, `logik exportiert ${name}`);
  }
});
