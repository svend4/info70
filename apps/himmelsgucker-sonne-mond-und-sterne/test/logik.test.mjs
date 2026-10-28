import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/himmel.json' with { type: 'json' };
import {
  ANZAHL_OPTIONEN, MAX_BEOBACHTUNG, MODUL_HIMMEL, MODUL_MOND, NAMEN_UND_TAGE, SEITENZAHL, STARTAUSWAHL,
  VERBOTENE_ZEICHEN, aendereAnzahl, anzahlBlaetter, beantworteMondphase, beantworteTageszeit, beobachtungsblaetter,
  blattHtml, druckBlaetterHtml, druckeBeobachtungsblatt, fuelle, gewaehltText, htmlText, kartenImModul, karteMitId,
  ladeHimmel, mischen, mondblatt, mondphasenFrage, mondphasenRunde, pruefeBlattHtml, pruefeBlattText,
  schalteBeobachtung, schalteMond, tageszeitFrage, vorlesetext, zufallsIndex,
} from '../logik.mjs';
import { BILD_IDS, DRUCK_BILD_IDS, MONDGESTALTEN, bildSvg, lichtAnteil, lichtPfad } from '../bilder.mjs';

// Prüft Daten, Logik und Bilder. Die Regeln der Umgebung (Eingabefelder, Speicherung, Netz, Druckzeichen,
// Zufall nur in app.mjs, Fokus, Testzahl) stehen in test/regeln.test.mjs.
//
// Die Zitate und Seiten sind in dieser Aufgabe maschinell gegen die Textkopie der Quelle geprüft (lokal,
// nicht im Repo). Dieser Test prüft, dass die Daten dem entsprechen, was dort geprüft wurde.

const KARTEN = ladeHimmel(daten);
const REIHENFOLGE = ['sonne', 'mond', 'sternenhimmel', 'mond-voll', 'mond-teilweise', 'mond-sichel'];

// Die Zitate je Karte, wörtlich aus dem Quelltext, in der Reihenfolge der Daten.
const ZITATE = {
  sonne: [['всходят и заходят', 'S. 138'], ['солнечные лучи', 'S. 138']],
  mond: [['всходят и заходят', 'S. 138'], ['полная, неполная, серпом', 'S. 138']],
  sternenhimmel: [['звездное небо', 'S. 114'], ['Солнце, Луна, звезды', 'S. 138']],
  'mond-voll': [['полная', 'S. 138']],
  'mond-teilweise': [['неполная', 'S. 138']],
  'mond-sichel': [['серпом', 'S. 138']],
};
const QUELLSEITE = { sonne: 'S. 138', mond: 'S. 138', sternenhimmel: 'S. 114', 'mond-voll': 'S. 138', 'mond-teilweise': 'S. 138', 'mond-sichel': 'S. 138' };

// Eine feste Folge von Zufallszahlen; sie läuft im Kreis.
const folge = (werte) => {
  let i = 0;
  return () => werte[i++ % werte.length];
};

// Hilfen für die Blätter als HTML-Text.
const blaetterIn = (html) => (html.match(/<section class="k-karte hg-blatt">/g) ?? []).length;
const titelIn = (html) => [...html.matchAll(/<h2 class="hg-blatttitel">([^<]*)<\/h2>/g)].map((m) => m[1]);
const einzelneBlaetter = () => [blattHtml(mondblatt(daten)), ...beobachtungsblaetter(MAX_BEOBACHTUNG, daten).map(blattHtml)];

// Prüft, dass ein HTML-Text wohlgeformt ist (jedes Element wird geschlossen, jedes "<" öffnet ein Element) und nur
// diese Elemente und Attribute trägt. Liefert die Namen der Elemente in der Reihenfolge, in der sie öffnen.
const ERLAUBTE_ELEMENTE = new Set(['section', 'div', 'span', 'p', 'h2', 'h3', 'svg', 'g', 'rect', 'circle', 'path', 'line']);
const LEERE_ELEMENTE = new Set(['rect', 'circle', 'path', 'line']);
const ERLAUBTE_ATTRIBUTE = new Set([
  'class', 'viewBox', 'aria-hidden', 'focusable', 'role', 'aria-label', 'd', 'cx', 'cy', 'r', 'fill', 'stroke',
  'stroke-width', 'stroke-linejoin', 'stroke-linecap', 'transform', 'x', 'y', 'width', 'height', 'rx', 'x1', 'y1', 'x2', 'y2',
]);
function pruefeAufbau(html) {
  const tags = [...html.matchAll(/<(\/?)([a-z][a-z0-9]*)((?:\s+[a-zA-Z][\w:-]*="[^"<>]*")*)\s*(\/?)>/g)];
  assert.equal(tags.length, (html.match(/</g) ?? []).length, 'ein "<" gehört zu keinem Element');
  const offen = [];
  for (const [, schliessend, name, attribute, selbst] of tags) {
    assert.ok(ERLAUBTE_ELEMENTE.has(name), `Element ${name} gehört nicht auf ein Blatt`);
    for (const [, attribut] of attribute.matchAll(/\s([a-zA-Z][\w:-]*)="/g)) {
      assert.ok(ERLAUBTE_ATTRIBUTE.has(attribut), `Attribut ${attribut} an ${name}`);
    }
    if (schliessend) assert.equal(offen.pop(), name, `${name} wird geschlossen, ohne offen zu sein`);
    else if (selbst) assert.ok(LEERE_ELEMENTE.has(name), `${name} ist nicht leer`);
    else {
      assert.ok(!LEERE_ELEMENTE.has(name), `${name} wird nicht geschlossen`);
      offen.push(name);
    }
  }
  assert.deepEqual(offen, [], 'nicht geschlossene Elemente');
  return tags.filter((t) => !t[1]).map((t) => t[2]);
}

// Ersetzt jeden Text eines Blatts durch einen feindlichen Text; Kennungen, Arten und Bilder bleiben.
const KEIN_TEXT = new Set(['typ', 'id', 'art', 'bild', 'nr']);
function vergifte(wert, boese, schluessel = '') {
  if (typeof wert === 'string') return KEIN_TEXT.has(schluessel) ? wert : boese + schluessel;
  if (Array.isArray(wert)) return wert.map((w) => vergifte(w, boese, schluessel));
  if (wert && typeof wert === 'object') {
    return Object.fromEntries(Object.entries(wert).map(([k, v]) => [k, vergifte(v, boese, k)]));
  }
  return wert;
}

test('Daten: sechs Karten in fester Reihenfolge, Kennungen eindeutig, Pflichtfelder und Module gesetzt', () => {
  assert.deepEqual(KARTEN.map((k) => k.id), REIHENFOLGE);
  assert.equal(new Set(KARTEN.map((k) => k.id)).size, KARTEN.length, 'doppelte Kennungen');
  assert.deepEqual(kartenImModul(KARTEN, MODUL_HIMMEL).map((k) => k.id), ['sonne', 'mond', 'sternenhimmel']);
  assert.deepEqual(kartenImModul(KARTEN, MODUL_MOND).map((k) => k.id), ['mond-voll', 'mond-teilweise', 'mond-sichel']);
  for (const k of KARTEN) {
    assert.ok(k.titel && k.erklaerung && k.modul && k.bild, `${k.id}: Titel, Erklärung, Modul oder Bild fehlt`);
    assert.ok(BILD_IDS.includes(k.bild), `${k.id}: unbekanntes Bild ${k.bild}`);
    assert.equal(k.eigenentwurf, true, `${k.id}: nicht als Eigenentwurf gekennzeichnet`);
  }
  assert.equal(new Set(kartenImModul(KARTEN, MODUL_MOND).map((k) => k.titel)).size, 3, 'die drei Mondtitel unterscheiden sich');
  assert.equal(daten.titel, 'Himmelsgucker: Sonne, Mond und Sterne', 'Titel weicht vom Katalog ab');
});

test('ladeHimmel: lehnt eine Karte ohne Quelle und ohne Eigenentwurf-Kennung ab', () => {
  const ohne = { id: 'x', titel: 'X', modul: MODUL_MOND, erklaerung: 'Ein Satz.' };
  assert.throws(() => ladeHimmel([ohne]), /Quelle fehlt und kein Eigenentwurf: x/);
  assert.throws(() => ladeHimmel([{ ...ohne, eigenentwurf: false }]), /Quelle fehlt/, 'eigenentwurf: false zählt nicht');
  assert.throws(() => ladeHimmel({ karten: [...KARTEN, ohne] }), /Quelle fehlt/, 'eine schlechte Karte unter guten bricht ab');
});

test('ladeHimmel: Quelle allein oder Eigenentwurf allein genügt; Pflichtfelder, Dubletten und falsche Seiten brechen ab', () => {
  const basis = { id: 'x', titel: 'X', modul: MODUL_MOND, erklaerung: 'Ein Satz.' };
  assert.equal(ladeHimmel([{ ...basis, quelle: { seite: 'S. 138' } }]).length, 1, 'Quelle allein');
  assert.equal(ladeHimmel([{ ...basis, eigenentwurf: true }]).length, 1, 'Eigenentwurf allein');
  for (const feld of ['id', 'titel', 'modul', 'erklaerung']) {
    assert.throws(() => ladeHimmel([{ ...basis, [feld]: '', eigenentwurf: true }]), new RegExp(`Feld fehlt: ${feld}`));
  }
  assert.throws(() => ladeHimmel([{ ...basis, eigenentwurf: true }, { ...basis, eigenentwurf: true }]), /doppelte Kennung/);
  assert.throws(() => ladeHimmel([{ ...basis, quelle: { seite: '138' }, eigenentwurf: true }]), /Seitenangabe falsch/);
  assert.throws(() => ladeHimmel([]), /keine Karten/);
  assert.throws(() => ladeHimmel(undefined), /keine Karten/);
});

test('Quelle: jede Karte nennt die geprüfte Seite, und die Zitate sind die geprüften Wortlaute mit höchstens sechs Wörtern', () => {
  for (const k of KARTEN) {
    assert.equal(k.quelle.seite, QUELLSEITE[k.id], `${k.id}: Seite weicht ab`);
    assert.deepEqual(k.begriffe.map((b) => [b.quelltext, b.seite]), ZITATE[k.id], `${k.id}: Zitate weichen ab`);
    for (const b of k.begriffe) {
      const woerter = b.quelltext.trim().split(/\s+/).length;
      assert.ok(woerter <= 6, `„${b.quelltext}“ hat ${woerter} Wörter`);
      assert.match(b.seite, /^S\. (114|138)$/, `${k.id}: Seite ${b.seite} liegt außerhalb der geprüften Seiten`);
    }
    assert.ok(k.begriffe.some((b) => b.seite === k.quelle.seite), `${k.id}: kein Begriff belegt die Seite der Karte`);
  }
  assert.deepEqual(daten.quelle.begriffe.map((b) => [b.quelltext, b.seite]),
    [['Астрономия (введение)', 'S. 138'], ['Солнце, Луна, звезды', 'S. 138']]);
  assert.match(daten.quelle.mitSeite, /\(S\. 138\)/);
  assert.ok(!/S\. \d/.test(daten.quelle.kurz), 'die Kurzform der Quelle trägt keine Seitenzahl');
});

test('Zufallsindex: 0 liefert den ersten, knapp unter 1 den letzten Eintrag; Werte außerhalb werden begrenzt', () => {
  assert.equal(zufallsIndex(7, () => 0), 0);
  assert.equal(zufallsIndex(7, () => 0.5), 3);
  assert.equal(zufallsIndex(7, () => 0.9999999999), 6);
  assert.equal(zufallsIndex(7, () => 1), 6, 'der Wert 1 darf nicht außerhalb der Liste liegen');
  assert.equal(zufallsIndex(7, () => -0.3), 0, 'ein negativer Wert darf nicht außerhalb der Liste liegen');
  assert.equal(zufallsIndex(7, () => Number.NaN), 0, 'ein fehlender Wert ergibt den ersten Eintrag');
});

test('Zufallsindex und mischen: ungültige Eingaben werfen einen Fehler, statt still zu wählen', () => {
  assert.throws(() => zufallsIndex(0, () => 0), RangeError);
  assert.throws(() => zufallsIndex(2.5, () => 0), RangeError);
  assert.throws(() => zufallsIndex(3, undefined), TypeError);
  assert.throws(() => mischen([1, 2, 3], undefined), TypeError);
  assert.throws(() => mondphasenFrage(KARTEN, undefined), TypeError);
  assert.throws(() => mondphasenRunde(KARTEN, undefined), TypeError);
});

test('mischen: das Original bleibt unverändert, jede Anordnung von drei Einträgen ist erreichbar', () => {
  const original = ['a', 'b', 'c'];
  const anordnungen = new Set();
  for (const x of [0, 0.4, 0.9]) {
    for (const y of [0, 0.6]) anordnungen.add(mischen(original, folge([x, y])).join(''));
  }
  assert.deepEqual(original, ['a', 'b', 'c']);
  assert.equal(anordnungen.size, 6, `nur ${anordnungen.size} von 6 Anordnungen: ${[...anordnungen].join(' ')}`);
  assert.deepEqual([...mischen(original, () => 0.5)].sort(), ['a', 'b', 'c'], 'nichts geht verloren');
});

test('mondphasenFrage: bei fester Zufallsfolge genau eine richtige Option und drei verschiedene Optionen', () => {
  const titel = kartenImModul(KARTEN, MODUL_MOND).map((k) => k.titel);
  for (const werte of [[0.1, 0.3, 0.8], [0.5, 0.5, 0.5], [0.99, 0.01, 0.4], [0.34, 0.7, 0.2]]) {
    const frage = mondphasenFrage(KARTEN, folge(werte));
    assert.equal(frage.optionen.length, ANZAHL_OPTIONEN);
    assert.equal(new Set(frage.optionen).size, 3, 'drei verschiedene Optionen');
    assert.equal(frage.optionen.filter((o) => o === frage.richtig).length, 1, 'genau eine richtige Option');
    assert.deepEqual([...frage.optionen].sort(), [...titel].sort(), 'die Optionen sind die drei Mondtitel');
    const karte = karteMitId(KARTEN, frage.id);
    assert.equal(frage.richtig, karte.titel);
    assert.equal(frage.erklaerung, karte.erklaerung);
    assert.deepEqual(frage.optionenIds.map((id) => karteMitId(KARTEN, id).titel), frage.optionen, 'Kennungen und Titel passen zusammen');
  }
});

test('mondphasenFrage: Zufall 0 wählt die erste, knapp unter 1 die letzte Mondkarte; jede Mondkarte ist erreichbar', () => {
  assert.equal(mondphasenFrage(KARTEN, () => 0).id, 'mond-voll');
  assert.equal(mondphasenFrage(KARTEN, () => 0.9999999999).id, 'mond-sichel');
  const erreicht = new Set([0, 0.4, 0.8].map((x) => mondphasenFrage(KARTEN, () => x).id));
  assert.deepEqual([...erreicht].sort(), ['mond-sichel', 'mond-teilweise', 'mond-voll']);
});

test('mondphasenFrage: der Platz der richtigen Option ist nicht fest, und jede Gestalt ist einmal die richtige', () => {
  // Alle Kombinationen aus drei Zufallswerten: das Muster aus dem Pseudocode darf keine feste Lage haben.
  const plaetze = new Set();
  const richtige = new Set();
  const werte = [0.05, 0.5, 0.95];
  for (const a of werte) {
    for (const b of werte) {
      for (const c of werte) {
        const frage = mondphasenFrage(KARTEN, folge([a, b, c]));
        plaetze.add(frage.optionen.indexOf(frage.richtig));
        richtige.add(frage.richtig);
      }
    }
  }
  assert.deepEqual([...plaetze].sort(), [0, 1, 2], 'die richtige Option steht an jedem Platz');
  assert.equal(richtige.size, 3, 'jede Gestalt ist einmal die gesuchte');
});

test('mondphasenFrage: mit zwei Optionen genau eine richtige und zwei verschiedene; ungültige Anzahl wirft', () => {
  for (const x of [0, 0.4, 0.9]) {
    const frage = mondphasenFrage(KARTEN, folge([x, 0.7, 0.2]), 2);
    assert.equal(frage.optionen.length, 2);
    assert.equal(new Set(frage.optionen).size, 2);
    assert.equal(frage.optionen.filter((o) => o === frage.richtig).length, 1);
  }
  for (const falsch of [0, 1, 4, 2.5, '3']) {
    assert.throws(() => mondphasenFrage(KARTEN, () => 0, falsch), RangeError, `Anzahl ${falsch}`);
  }
  assert.throws(() => mondphasenFrage(kartenImModul(KARTEN, MODUL_HIMMEL), () => 0), RangeError, 'ohne Mondkarten');
});

test('mondphasenRunde: drei Fragen, jede Mondgestalt genau einmal, die Reihenfolge kommt vom Zufall', () => {
  const reihenfolgen = new Set();
  for (const werte of [[0, 0], [0.5, 0.2], [0.9, 0.9], [0.3, 0.8, 0.1]]) {
    const runde = mondphasenRunde(KARTEN, folge(werte));
    assert.equal(runde.length, 3);
    assert.deepEqual(runde.map((f) => f.id).sort(), ['mond-sichel', 'mond-teilweise', 'mond-voll'], 'jede Gestalt einmal');
    for (const frage of runde) {
      assert.equal(new Set(frage.optionen).size, 3);
      assert.equal(frage.optionen.filter((o) => o === frage.richtig).length, 1);
    }
    reihenfolgen.add(runde.map((f) => f.id).join('>'));
  }
  assert.ok(reihenfolgen.size >= 3, `die Reihenfolge wechselt (${reihenfolgen.size} verschiedene)`);
});

test('beantworteMondphase: liefert genau zwei Felder, kein Punktefeld, und die Erklärung der Karte', () => {
  const frage = mondphasenFrage(KARTEN, () => 0);
  const passend = beantworteMondphase(frage, frage.richtig);
  assert.deepEqual(Object.keys(passend).sort(), ['erklaerung', 'richtig']);
  assert.equal(passend.richtig, true);
  assert.equal(passend.erklaerung, 'Der Mond ist ganz rund zu sehen.');
  const andere = frage.optionen.find((o) => o !== frage.richtig);
  const anders = beantworteMondphase(frage, andere);
  assert.deepEqual(anders, { richtig: false, erklaerung: passend.erklaerung }, 'dieselbe Erklärung, ohne Zähler');
  for (const antwort of [passend, anders]) {
    assert.ok(!Object.keys(antwort).some((k) => /punkt|rang|rekord|serie|prozent|stufe|summe/i.test(k)), 'kein Wertungsfeld');
  }
  assert.throws(() => beantworteMondphase(frage, 'Neumond'), RangeError);
});

test('beantworteMondphase: ändert die Frage nicht und führt keinen Zustand (zweimal dieselbe Antwort)', () => {
  const frage = mondphasenFrage(KARTEN, () => 0.5);
  const vorher = JSON.stringify(frage);
  const a = beantworteMondphase(frage, frage.optionen[0]);
  const b = beantworteMondphase(frage, frage.optionen[0]);
  assert.deepEqual(a, b);
  assert.equal(JSON.stringify(frage), vorher, 'die Frage bleibt unverändert');
  assert.equal(beantworteTageszeit, beantworteMondphase);
});

test('tageszeitFrage: Sonne am Tag, Sterne in der Nacht; beide Reihenfolgen sind erreichbar', () => {
  const sonne = karteMitId(KARTEN, 'sonne');
  const sterne = karteMitId(KARTEN, 'sternenhimmel');
  for (const [karte, passend] of [[sonne, 'Am Tag'], [sterne, 'In der Nacht']]) {
    const reihenfolgen = new Set();
    for (const x of [0, 0.9]) {
      const frage = tageszeitFrage(karte, () => x);
      reihenfolgen.add(frage.optionen.join('|'));
      assert.deepEqual([...frage.optionen].sort(), ['Am Tag', 'In der Nacht']);
      assert.equal(frage.richtig, passend);
      assert.equal(frage.id, karte.id);
      assert.deepEqual(Object.keys(beantworteTageszeit(frage, frage.richtig)).sort(), ['erklaerung', 'richtig']);
    }
    assert.equal(reihenfolgen.size, 2, `${karte.id}: beide Reihenfolgen`);
  }
  assert.equal(tageszeitFrage(sonne, () => 0).antwortTitel, 'Die Sonne siehst du am Tag.');
});

test('tageszeitFrage: eine Karte ohne Frage oder mit falschen Antworten wirft', () => {
  const mond = karteMitId(KARTEN, 'mond');
  assert.throws(() => tageszeitFrage(mond, () => 0), /Karte ohne Frage: mond/);
  const eine = { id: 'x', frage: { text: 'F?', antworten: ['A'], passend: 'A' } };
  assert.throws(() => tageszeitFrage(eine, () => 0), /zwei Antworten/);
  const fremd = { id: 'x', frage: { text: 'F?', antworten: ['A', 'B'], passend: 'C' } };
  assert.throws(() => tageszeitFrage(fremd, () => 0), /eine davon passend/);
});

// Wörter, die ein Kind bewerten oder loben, und Vermerke, die nicht in einen Kindertext gehören.
const WERTUNG = /richtig|falsch|super|toll|prima|bravo|gut gemacht|leider|schade|nicht ganz|Eigenentwurf|fachlich/i;

// Alle Texte, die ein Kind sieht oder hört, mit ihrem Pfad in den Daten: die Karten, die Oberfläche (daten.texte) und die
// Blätter (daten.blaetter). Ausgenommen sind nur, was für Erwachsene geschrieben ist (die Ansicht „Für Erwachsene“, der Kasten
// auf den Karten, ihre Quellen und Begriffe) und der Vermerk „Eigenentwurf“ im Blattkopf. Alles andere, auch ein neuer Text,
// wird geprüft.
const KEIN_KINDERTEXT = /^(?:texte\.(?:erwachsene|karte)(?![\w])|.*\.kopf2$|karten\[\d+\]\.(?:id|modul|bild|icon|eigenentwurf|quelle|begriffe|erwachsene)(?![\w]))/;
function kindertexte(d) {
  const aus = [];
  const sammle = (wert, pfad) => {
    if (typeof wert === 'string') {
      if (!KEIN_KINDERTEXT.test(pfad)) aus.push({ pfad, text: wert });
    } else if (Array.isArray(wert)) {
      wert.forEach((w, i) => sammle(w, `${pfad}[${i}]`));
    } else if (wert && typeof wert === 'object') {
      for (const [schluessel, w] of Object.entries(wert)) sammle(w, pfad ? `${pfad}.${schluessel}` : schluessel);
    }
  };
  for (const schluessel of ['titel', 'kurztitel', 'untertitel', 'karten', 'texte', 'blaetter']) sammle(d[schluessel], schluessel);
  return aus;
}
const wertungsfunde = (d) => kindertexte(d).filter(({ text }) => WERTUNG.test(text)).map(({ pfad, text }) => `${pfad}: „${text}“`);

test('Texte für das Kind: kurze vollständige Sätze, ohne Wertungswörter, ohne Hinweise für Erwachsene', () => {
  for (const k of KARTEN) {
    const saetze = [...(k.text ?? []), k.erklaerung, k.benennung, k.frage?.text, k.frage?.antwortTitel, k.frage?.erklaerung]
      .filter(Boolean);
    assert.ok(saetze.length >= 2, `${k.id}: zu wenig Text`);
    for (const satz of saetze) {
      assert.match(satz, /^[A-ZÄÖÜ]/, `${k.id}: Satz beginnt nicht mit einem Großbuchstaben: „${satz}“`);
      assert.match(satz, /[.?!]$/, `${k.id}: Satz endet ohne Satzzeichen: „${satz}“`);
      assert.ok(satz.length <= 110, `${k.id}: Satz zu lang: „${satz}“`);
      assert.ok(!WERTUNG.test(satz), `${k.id}: Wertungswort oder Vermerk im Kindertext: „${satz}“`);
      assert.ok(!/ {2}|\s$/.test(satz), `${k.id}: Leerzeichen zu viel: „${satz}“`);
    }
  }
});

test('Texte der Oberfläche und der Blätter für das Kind: ohne Wertungswörter und ohne Vermerke; die Probe schlägt an, wenn ein Text lobt oder wertet (docs/02 Z. 141–146)', () => {
  const texte = kindertexte(daten);
  const pfade = texte.map((t) => t.pfad);
  // Die Suche reicht über Karten, Oberfläche und Blätter; die Ansicht für Erwachsene und die Vermerke sind nicht dabei.
  assert.ok(texte.length >= 100, `nur ${texte.length} Texte gefunden: greift die Suche noch?`);
  for (const pfad of ['titel', 'untertitel', 'karten[0].unterzeile', 'karten[1].bildText', 'karten[0].frage.text', 'texte.start.aufforderung',
    'texte.start.vorlesen', 'texte.knoepfe.weiter', 'texte.frage.mondAufgabe', 'texte.frage.angetippt', 'texte.ende.text', 'texte.fuss.text',
    'blaetter.mondblatt.anleitung[0]', 'blaetter.beobachtung.felder[0].aufgabe', 'blaetter.beobachtung.felder[0].keine']) {
    assert.ok(pfade.includes(pfad), `${pfad} wird nicht geprüft`);
  }
  for (const pfad of pfade) {
    assert.ok(!/^texte\.(?:erwachsene|karte)\b|\.kopf2$|\.erwachsene\[|\.begriffe\[|\.quelle\./.test(pfad), `${pfad}: Text für Erwachsene in der Prüfung`);
  }
  assert.deepEqual(wertungsfunde(daten), [], 'Wertungswort oder Vermerk in einem Text für das Kind');

  // Gegenprobe: dieselben Daten mit je einem lobenden oder wertenden Satz an drei Stellen der Oberfläche.
  const proben = [
    ['texte.ende.text', 'Das habt ihr toll gemacht!'],
    ['texte.start.aufforderung', 'Super, dass ihr da seid.'],
    ['texte.frage.mondAufgabe', 'Welches ist das richtige Wort?'],
    ['texte.knoepfe.weiter', 'Prima, weiter'],
    ['blaetter.beobachtung.felder[0].aufgabe', 'Welchen Mond siehst du? Gut gemacht.'],
    ['karten[2].unterzeile', 'Leider nicht ganz hell'],
  ];
  for (const [pfad, satz] of proben) {
    const kopie = structuredClone(daten);
    const schluessel = pfad.split(/\.|\[(\d+)\]/).filter((s) => s !== undefined && s !== '');
    let ziel = kopie;
    for (const s of schluessel.slice(0, -1)) ziel = ziel[s];
    ziel[schluessel.at(-1)] = satz;
    const funde = wertungsfunde(kopie);
    assert.equal(funde.length, 1, `Probe „${satz}“ in ${pfad} wird nicht gefunden (${funde.length} Funde)`);
    assert.ok(funde[0].startsWith(`${pfad}: `), `Fund an falscher Stelle: ${funde[0]}`);
  }
  // Für Erwachsene bleibt der Vermerk erlaubt: Die Ansicht „Für Erwachsene“ und der Blattkopf nennen den Eigenentwurf.
  const erwachsene = structuredClone(daten);
  erwachsene.texte.erwachsene.abschnitte[0].absaetze[0] = 'Fachlich nicht geprüft (Eigenentwurf).';
  erwachsene.texte.karte.eigenentwurf = 'Text und Bild sind Eigenentwurf.';
  assert.deepEqual(wertungsfunde(erwachsene), []);
  assert.match(daten.blaetter.beobachtung.kopf2, /Eigenentwurf/);
});

test('vorlesetext: Titel und Sätze der Karte, ohne die Hinweise für Erwachsene', () => {
  const sonne = karteMitId(KARTEN, 'sonne');
  const text = vorlesetext(sonne);
  assert.ok(text.startsWith('Die Sonne. Die Sonne geht am Morgen auf'));
  for (const satz of sonne.text) assert.ok(text.includes(satz));
  for (const hinweis of sonne.erwachsene) assert.ok(!text.includes(hinweis), 'ein Hinweis für Erwachsene wird vorgelesen');
  assert.ok(!/Eigenentwurf|fachlich/.test(text), 'ein Vermerk für Erwachsene wird vorgelesen');
});

test('fuelle: ersetzt Platzhalter und wirft bei einem fehlenden Wert', () => {
  assert.equal(fuelle('Bild {nr} von {von}', { nr: 2, von: 3 }), 'Bild 2 von 3');
  assert.equal(fuelle('ohne Platzhalter'), 'ohne Platzhalter');
  assert.throws(() => fuelle('Bild {nr}', {}), /Wert fehlt für \{nr\}/);
  assert.equal(fuelle(daten.texte.frage.mondFortschritt, { nr: 1, von: 3 }), 'Bild 1 von 3');
  assert.equal(fuelle(daten.texte.frage.angetippt, { auswahl: 'Mondsichel' }), 'Du hast „Mondsichel“ angetippt.');
});

test('Auswahl für den Druck: Blätter umschalten, Anzahl von 1 bis 3, Zahl der Blätter gleich Auswahl', () => {
  assert.deepEqual(STARTAUSWAHL, { mond: false, beobachtung: false, anzahl: 1 });
  assert.equal(anzahlBlaetter(STARTAUSWAHL), 0);
  let a = schalteMond(STARTAUSWAHL);
  assert.equal(anzahlBlaetter(a), 1);
  a = schalteBeobachtung(a);
  assert.equal(anzahlBlaetter(a), 2);
  a = aendereAnzahl(aendereAnzahl(aendereAnzahl(a, 1), 1), 1);
  assert.equal(a.anzahl, MAX_BEOBACHTUNG, 'nicht über das Maximum');
  assert.equal(anzahlBlaetter(a), 1 + MAX_BEOBACHTUNG);
  a = aendereAnzahl(aendereAnzahl(aendereAnzahl(a, -1), -1), -1);
  assert.equal(a.anzahl, 1, 'nicht unter eins');
  assert.equal(anzahlBlaetter(schalteMond(a)), 1, 'Mondblatt wieder abgewählt');
  assert.equal(anzahlBlaetter(aendereAnzahl({ mond: false, beobachtung: false, anzahl: 1 }, 1)), 0, 'ohne Wahl zählt die Anzahl nicht');
  assert.ok(Object.isFrozen(STARTAUSWAHL) && STARTAUSWAHL.anzahl === 1, 'die Startauswahl bleibt unverändert');
});

test('mondblatt: drei Zeilen in der Reihenfolge der Mondkarten, die Wörter stehen in anderer Reihenfolge', () => {
  const blatt = mondblatt(daten);
  const mond = kartenImModul(KARTEN, MODUL_MOND);
  assert.deepEqual(blatt.zeilen.map((z) => z.bild), mond.map((k) => k.bild));
  assert.deepEqual(blatt.zeilen.map((z) => z.wort).sort(), mond.map((k) => k.titel).sort(), 'jedes Wort genau einmal');
  blatt.zeilen.forEach((z, i) => assert.notEqual(z.wort, mond[i].titel, `Zeile ${i + 1}: Bild und Wort stehen auf gleicher Höhe`));
  assert.equal(blatt.typ, 'mondblatt');
  assert.ok(blatt.kopf2.includes('Eigenentwurf'));
  const kaputt = structuredClone(daten);
  kaputt.blaetter.mondblatt.zeilen[0].wort = 'Neumond';
  assert.throws(() => mondblatt(kaputt), /passen nicht zu den Mondkarten/);
  const doppelt = structuredClone(daten);
  doppelt.blaetter.mondblatt.zeilen[1].wort = doppelt.blaetter.mondblatt.zeilen[0].wort;
  assert.throws(() => mondblatt(doppelt), /passen nicht zu den Mondkarten/, 'ein Wort darf nicht doppelt stehen');
});

test('beobachtungsblaetter: n nummerierte Blätter mit den Feldern Mondgestalt, Himmelsrichtung, Wetter und einem Mal-Kasten', () => {
  for (const n of [1, 2, MAX_BEOBACHTUNG]) {
    const blaetter = beobachtungsblaetter(n, daten);
    assert.equal(blaetter.length, n);
    blaetter.forEach((b, i) => {
      assert.equal(b.nr, i + 1);
      assert.equal(b.titel, `Abendhimmel, Beobachtung Nr. ${i + 1}`);
      assert.deepEqual(b.felder.map((f) => f.id), ['mondgestalt', 'himmelsrichtung', 'wetter', 'malen']);
    });
  }
  const [blatt] = beobachtungsblaetter(1, daten);
  const mondfeld = blatt.felder[0];
  assert.deepEqual(mondfeld.auswahl.map((a) => a.wort), kartenImModul(KARTEN, MODUL_MOND).map((k) => k.titel));
  assert.deepEqual(mondfeld.auswahl.map((a) => a.bild), DRUCK_BILD_IDS.slice());
  const kreuz = blatt.felder[1];
  assert.deepEqual([kreuz.oben, kreuz.links, kreuz.rechts, kreuz.unten], ['Norden', 'Westen', 'Osten', 'Süden']);
  assert.equal(blatt.felder[3].art, 'rahmen');
});

test('beobachtungsblaetter: null Blätter ergeben eine leere Liste; zu viele oder eine Bruchzahl werfen', () => {
  assert.deepEqual(beobachtungsblaetter(0, daten), []);
  for (const falsch of [-1, MAX_BEOBACHTUNG + 1, 1.5, '2', undefined]) {
    assert.throws(() => beobachtungsblaetter(falsch, daten), RangeError, `Anzahl ${falsch}`);
  }
});

test('druckeBeobachtungsblatt: liefert HTML-Text mit n Blättern, nummeriert in der Reihenfolge, ohne Daten mit der mitgelieferten Datei', () => {
  for (const n of [1, 2, MAX_BEOBACHTUNG]) {
    const html = druckeBeobachtungsblatt(n);
    assert.equal(typeof html, 'string');
    assert.equal(blaetterIn(html), n, `${n} Blätter`);
    assert.deepEqual(titelIn(html), Array.from({ length: n }, (_, i) => `Abendhimmel, Beobachtung Nr. ${i + 1}`));
    assert.equal(html, druckeBeobachtungsblatt(n, daten), 'Standard: die mitgelieferte Datei');
    pruefeAufbau(html);
  }
  const html = druckeBeobachtungsblatt(1);
  const text = htmlText(html);
  for (const wort of ['Mondgestalt', 'Himmelsrichtung', 'Wetter', 'Voller Mond', 'Halber Mond', 'Mondsichel', 'Norden', 'Westen', 'Osten', 'Süden', 'klar', 'wolkig', 'Regen']) {
    assert.ok(text.includes(wort), `${wort} fehlt auf dem Blatt`);
  }
  assert.equal((html.match(/class="hg-rahmen"/g) ?? []).length, 1, 'ein Kasten zum Malen');
  assert.equal((html.match(/<svg /g) ?? []).length, 3, 'drei Mondbilder zum Einkreisen');
  assert.ok(!html.includes('role="img"') && (html.match(/aria-hidden="true"/g) ?? []).length === 3, 'die Bilder sind Schmuck, das Wort daneben nennt sie');
});

test('druckeBeobachtungsblatt: null Blätter ergeben einen leeren Text; zu viele oder eine Bruchzahl werfen', () => {
  assert.equal(druckeBeobachtungsblatt(0), '');
  assert.equal(druckeBeobachtungsblatt(0, daten), '');
  for (const falsch of [-1, MAX_BEOBACHTUNG + 1, 1.5, '2', undefined]) {
    assert.throws(() => druckeBeobachtungsblatt(falsch), RangeError, `Anzahl ${falsch}`);
  }
});

test('htmlText: ohne Elemente und Attribute, eine Zeile je Element, mit den ursprünglichen Zeichen', () => {
  assert.equal(htmlText('<p class="a">Eins &amp; zwei</p><div><span>drei</span><span>vier</span></div>'), 'Eins & zwei\ndrei\nvier');
  assert.equal(htmlText('<svg aria-label="nicht sichtbar"></svg>'), '');
  assert.equal(htmlText('<p>&lt;b&gt; &quot;x&quot; &#39;y&#39;</p>'), '<b> "x" \'y\'');
  assert.equal(htmlText('<span>Am</span><span>Tag</span>'), 'Am\nTag', 'Wörter in zwei Elementen bleiben zwei Wörter');
});

test('pruefeBlattHtml: erkennt Eingabefelder, Skripte, Verweise, Stil in der Zeile, Ereignisse und Druckzeichen im Quelltext', () => {
  assert.deepEqual(pruefeBlattHtml('<p class="hg-kopf">Himmelsgucker</p>'), []);
  const zeichen = String.fromCodePoint(0x2610);
  for (const schlecht of [
    '<input class="x">', '<textarea></textarea>', '<select></select>', '<form></form>', '<button>a</button>', '<script>1</script>',
    '<a href="x">y</a>', '<img src="x">', '<iframe></iframe>', '<link rel="x">', '<p onclick="x()">a</p>', '<p style="color:red">a</p>',
    '<p data-x="javascript:1">a</p>', '<svg><use xlink:href="x"></use></svg>', `<p aria-label="${zeichen}">a</p>`, '<p>Name: ______</p>',
    '<p>Datum</p>', '<p>Seite S. 138</p>', '<p>undefined</p>',
  ]) {
    assert.ok(pruefeBlattHtml(schlecht).length > 0, `nicht erkannt: ${schlecht}`);
  }
  // Ein Wort im Text, das wie ein Attribut aussieht, ist kein Verstoß: geprüft werden die Elemente, nicht der Text.
  assert.deepEqual(pruefeBlattHtml('<p>onerror=1 und href=x</p>'), []);
});

test('Blatt-HTML: wohlgeformt, nur eigene Elemente und Attribute, kein Eingabefeld, kein Verweis, kein Skript', () => {
  const alle = einzelneBlaetter();
  assert.equal(alle.length, 1 + MAX_BEOBACHTUNG);
  for (const html of alle) {
    const tags = pruefeAufbau(html);
    assert.equal(tags[0], 'section');
    assert.ok(!tags.some((t) => ['input', 'textarea', 'select', 'form', 'button', 'a', 'img', 'script', 'style'].includes(t)));
    assert.match(html, /^<section class="k-karte hg-blatt">.*<\/section>$/s);
    assert.equal((html.match(/<section/g) ?? []).length, 1, 'ein Blatt ist ein Element');
    assert.ok(!/ id=|aria-labelledby/.test(html), 'Vorschau und Druck zeigen dasselbe Blatt: keine Kennung, die doppelt vorkäme');
  }
});

test('blattHtml: jeder Text eines Blatts wird maskiert, auch ein feindlicher Text in jedem Feld', () => {
  const boese = '<img src=x onerror=1>"\'&';
  for (const blatt of [mondblatt(daten), ...beobachtungsblaetter(1, daten)]) {
    const html = blattHtml(vergifte(blatt, boese));
    pruefeAufbau(html);
    assert.ok(!html.includes('<img') && !html.includes('onerror=1>'), `${blatt.id}: Text wurde zu Markup`);
    assert.ok(html.includes('&lt;img src=x onerror=1&gt;&quot;&#39;&amp;'), `${blatt.id}: maskierter Text fehlt`);
    const text = htmlText(html);
    const felder = text.split('\n').filter((z) => z.startsWith(boese)).length;
    assert.ok(felder >= 8, `${blatt.id}: nur ${felder} Textfelder kamen unverändert an`);
  }
  const html = blattHtml({ ...mondblatt(daten), titel: 'Mond & "Sterne" <hell>' });
  assert.ok(html.includes('<h2 class="hg-blatttitel">Mond &amp; &quot;Sterne&quot; &lt;hell&gt;</h2>'));
  assert.equal(htmlText(html).split('\n').includes('Mond & "Sterne" <hell>'), true);
});

test('blattHtml: bricht ab, wenn ein Blatt gegen die Druckregeln verstößt oder unvollständig ist', () => {
  const gut = mondblatt(daten);
  assert.ok(blattHtml(gut).length > 500, 'das gute Blatt geht durch');
  const verstoesse = [
    ['titel', 'Mondblatt vom Datum', /Namenszeile oder Tagesfeld/],
    ['hinweis', 'Hier Name: ______', /Namenszeile oder Tagesfeld/],
    ['anleitung', [`Kreuze an: ${String.fromCodePoint(0x2610)}`], /Druckzeichen/],
    ['quelle', 'Quelle: Praleska, S. 138', /Seitenzahl/],
    ['kopf', undefined, /Rest im Text/],
  ];
  for (const [feld, wert, muster] of verstoesse) {
    assert.throws(() => blattHtml({ ...gut, [feld]: wert }), muster, `Feld ${feld}`);
  }
  const beobachtung = beobachtungsblaetter(1, daten)[0];
  assert.throws(() => blattHtml({ ...beobachtung, felder: [{ id: 'x', art: 'unbekannt', titel: 'T', aufgabe: 'A' }] }), /unbekannte Art/);
  assert.throws(() => blattHtml({ ...gut, zeilen: [{ bild: 'sonne', wort: 'Sonne' }] }), RangeError, 'im Druck nur Mondgestalten');
});

test('Druckblätter: keine Zeichen der Sperrliste, keine Emojis, keine Namenszeile, kein Datum, keine Tagesfelder, keine Seitenzahl', () => {
  const alle = einzelneBlaetter();
  for (const [i, html] of alle.entries()) {
    const text = htmlText(html);
    assert.deepEqual(pruefeBlattHtml(html), [], `Blatt ${i + 1}`);
    assert.ok(!VERBOTENE_ZEICHEN.test(html) && !NAMEN_UND_TAGE.test(text) && !SEITENZAHL.test(text), `Blatt ${i + 1}`);
    assert.ok(text.includes('Eigenentwurf'), `Blatt ${i + 1}: ohne Kennzeichnung`);
    assert.ok(text.includes('Quelle: Praleska'), `Blatt ${i + 1}: ohne Quellenzeile`);
    assert.ok(!/Menschen geprüft/.test(text), `Blatt ${i + 1}: die Marke gehört dorthin, wo die Seiten stehen`);
  }
  // Gegenprobe: jede Regel schlägt an, wenn man sie verletzt.
  const schlecht = ['Haken \u2713', 'Stern \u2605', 'Kasten \u2610', 'Emoji \u{1F319}', 'Name: ______', 'Datum', 'Montag', 'am Tag', 'S. 138', 'undefined'];
  for (const s of schlecht) assert.ok(pruefeBlattText(s).length > 0, `nicht erkannt: ${s}`);
  assert.deepEqual(pruefeBlattText('Verbinde das Bild. Kreise ein. Dem Mond einen Namen geben.'), [], 'Namen im Fließtext bleiben erlaubt');
});

test('druckBlaetterHtml: die Zahl der Blätter ist die Zahl der Auswahl, das Mondblatt kommt zuerst, dann die Beobachtungsblätter nach Nummer', () => {
  for (const mond of [false, true]) {
    for (const beobachtung of [false, true]) {
      for (let anzahl = 1; anzahl <= MAX_BEOBACHTUNG; anzahl += 1) {
        const auswahl = { mond, beobachtung, anzahl };
        const html = druckBlaetterHtml(daten, auswahl);
        assert.equal(blaetterIn(html), anzahlBlaetter(auswahl), JSON.stringify(auswahl));
        const erwartet = [
          ...(mond ? [daten.blaetter.mondblatt.titel] : []),
          ...(beobachtung ? Array.from({ length: anzahl }, (_, i) => fuelle(daten.blaetter.beobachtung.titel, { nr: i + 1 })) : []),
        ];
        assert.deepEqual(titelIn(html), erwartet, JSON.stringify(auswahl));
        pruefeAufbau(html);
      }
    }
  }
  assert.equal(druckBlaetterHtml(daten, STARTAUSWAHL), '', 'ohne Auswahl bleibt der Druckbereich leer');
  const voll = { mond: true, beobachtung: true, anzahl: MAX_BEOBACHTUNG };
  assert.equal(druckBlaetterHtml(daten, voll), blattHtml(mondblatt(daten)) + druckeBeobachtungsblatt(MAX_BEOBACHTUNG, daten));
});

test('gewaehltText: keins, ein Blatt, mehrere Blätter', () => {
  const t = daten.texte.druck;
  assert.equal(gewaehltText(t, 0), 'Noch kein Blatt gewählt.');
  assert.equal(gewaehltText(t, 1), 'Gewählt: 1 Blatt.');
  assert.equal(gewaehltText(t, 4), 'Gewählt: 4 Blätter.');
});

test('Bilder: der helle Anteil nimmt von voll über halb zur Sichel ab, die Pfade unterscheiden sich', () => {
  assert.equal(lichtAnteil('voll'), 1);
  assert.equal(lichtAnteil('halb'), 0.5);
  assert.ok(lichtAnteil('sichel') > 0 && lichtAnteil('sichel') < 0.3, `Sichel ${lichtAnteil('sichel')}`);
  assert.equal(lichtPfad('voll'), null);
  assert.notEqual(lichtPfad('halb'), lichtPfad('sichel'));
  assert.match(lichtPfad('sichel'), /^M50 6A44 44 0 0 1 50 94A24 44 0 0 0 50 6Z$/);
  assert.deepEqual(MONDGESTALTEN, ['voll', 'halb', 'sichel']);
  assert.throws(() => lichtAnteil('neu'), RangeError);
  assert.throws(() => lichtPfad('neu'), RangeError);
});

test('Bilder: jedes Bild ist ein SVG mit viewBox, Label oder aria-hidden, ohne Adresse und ohne Skript', () => {
  assert.deepEqual([...BILD_IDS].sort(), KARTEN.map((k) => k.bild).sort(), 'jede Karte hat ihr Bild, und es gibt kein Bild ohne Karte');
  for (const id of BILD_IDS) {
    const mit = bildSvg(id, { label: `Bild ${id}` });
    assert.match(mit, /^<svg viewBox="0 0 \d+ \d+" role="img" aria-label="Bild [a-z-]+" focusable="false">.*<\/svg>$/s, id);
    const schmuck = bildSvg(id);
    assert.match(schmuck, /^<svg viewBox="0 0 \d+ \d+" aria-hidden="true" focusable="false">/, id);
    for (const svg of [mit, schmuck]) {
      assert.ok(!/https?:|xlink|<script|on[a-z]+=|<text|<image|<style/i.test(svg), `${id}: Adresse, Skript, Text oder Bild im SVG`);
      assert.ok(!VERBOTENE_ZEICHEN.test(svg), `${id}: Zeichen der Sperrliste`);
    }
  }
  assert.ok(bildSvg('sonne', { label: 'a"b<c' }).includes('a&quot;b&lt;c'), 'Labels werden maskiert');
});

test('Bilder: im Druck nur die drei Mondgestalten, mit schwarzer Linie, weißer heller Fläche und ohne Hintergrund', () => {
  for (const id of DRUCK_BILD_IDS) {
    const svg = bildSvg(id, { modus: 'druck', label: 'Mond' });
    assert.ok(svg.includes('stroke="#000000"'), `${id}: ohne schwarze Linie`);
    assert.ok(svg.includes('fill="#ffffff"'), `${id}: ohne weiße helle Fläche`);
    assert.ok(!svg.includes('<rect'), `${id}: Hintergrund im Druck`);
    assert.ok(!/#1e293b|#fde68a/.test(svg), `${id}: Bildschirmfarben im Druck`);
  }
  assert.ok(bildSvg('mond-voll', { modus: 'druck' }).includes('<circle'));
  assert.ok(!bildSvg('mond-voll', { modus: 'druck' }).includes('#d1d5db'), 'der volle Mond hat keine dunkle Fläche');
  assert.ok(bildSvg('mond-sichel', { modus: 'druck' }).includes('#d1d5db'), 'die Sichel hat eine dunkle Fläche zum Unterscheiden');
  assert.throws(() => bildSvg('sonne', { modus: 'druck' }), RangeError);
  assert.throws(() => bildSvg('mond', { modus: 'druck' }), RangeError);
  assert.throws(() => bildSvg('komet'), RangeError);
  assert.throws(() => bildSvg('sonne', { modus: 'farbig' }), RangeError);
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
