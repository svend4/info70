import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import daten from '../daten/begriffe.json' with { type: 'json' };
import {
  ANZAHL_FACHWOERTER, ANZAHL_INSTRUMENTE, DRUCKZEICHEN, KATEGORIEN, MAX_SAETZE, SEITE_QUELLE, alleGewaehlt, alleVorlesetext,
  begriffKarte, begriffMitId, begriffeFuer, blaetterFuer, blattText, druckBlaetter, fuelle, gewaehlteBegriffe, gewaehltText,
  istBildPfad, kannDrucken, ladeBegriffe, listeVorlesetext, nachbar, pruefeBegriffe, pruefeBlatt, saetze, schalte,
  schalteKategorie, sprachStuecke, vorlesetext, zaehleWoerter,
} from '../logik.mjs';

// Prüft Daten und Logik. Die Regeln der Umgebung (Eingabefelder, Speicherung, Netz, Druckzeichen im Code, Fokus,
// Vorlesen, Marke bei der Quelle, Testzahl) stehen in test/regeln.test.mjs.

const BILDER = new URL('../bilder/', import.meta.url);

// Die sechzehn Fachwörter in der Reihenfolge der Liste auf S. 260 (die Quelle zählt sie mit „und andere“ auf).
const FACHWOERTER = [
  'vokalmusik', 'instrumentalmusik', 'solist', 'begleitung', 'dirigent', 'komponist', 'interpret', 'melodie',
  'rhythmus', 'tempo', 'dynamik', 'ballett', 'oper', 'konzert', 'blasorchester', 'streichorchester',
];
// Die sieben Instrumente in der Reihenfolge der Quelle (S. 260).
const INSTRUMENTE = ['harfe', 'kontrabass', 'violoncello', 'cembalo', 'orgel', 'klavier', 'klarinette'];

// Das Wort, wie es auf S. 260 steht. Wortlaut und Reihenfolge sind in der Aufgabe gegen die Textkopie der Quelle
// geprüft (Textkopie aus tools/quelle-holen.sh, außerhalb des Repos, F3); die Tests prüfen, dass die Daten diesen Wortlauten entsprechen.
const QUELLTEXT = {
  vokalmusik: 'вокальная',
  instrumentalmusik: 'инструментальная музыка',
  solist: 'солист',
  begleitung: 'аккомпанемент',
  dirigent: 'дирижер',
  komponist: 'композитор',
  interpret: 'исполнитель',
  melodie: 'мелодия',
  rhythmus: 'ритм',
  tempo: 'темп',
  dynamik: 'динамика',
  ballett: 'балет',
  oper: 'опера',
  konzert: 'концерт',
  blasorchester: 'духовой',
  streichorchester: 'струнный оркестры',
  harfe: 'арфе',
  kontrabass: 'контрабасе',
  violoncello: 'виолончели',
  cembalo: 'клавесине',
  orgel: 'органе',
  klavier: 'фортепиано',
  klarinette: 'кларнете',
};

// Die Begriffe in Anführungszeichen aus Abschnitt 1 des Bauauftrags, die als Einträge vorkommen (sechs Fachwörter, sieben Instrumente).
const ZITATE_BAUAUFTRAG = [
  'солист', 'аккомпанемент', 'дирижер', 'композитор', 'мелодия', 'опера',
  'арфе', 'контрабасе', 'виолончели', 'клавесине', 'органе', 'фортепиано', 'кларнете',
];

const MUSIK = ['vokalmusik', 'instrumentalmusik', 'solist', 'komponist', 'interpret', 'melodie', 'rhythmus', 'tempo', 'dynamik', 'ballett', 'oper'];
const ORCHESTER = ['begleitung', 'dirigent', 'konzert', 'blasorchester', 'streichorchester'];

const kopie = () => structuredClone(daten);
const ids = (liste) => liste.map((b) => b.id);
const alle = ladeBegriffe(daten);

test('Daten: 23 Wörter in der Reihenfolge der Quelle, Kennungen eindeutig, Pflichtfelder gesetzt', () => {
  assert.equal(alle.length, 23, 'es müssen 23 Wörter sein');
  assert.deepEqual(ids(alle), [...FACHWOERTER, ...INSTRUMENTE]);
  assert.equal(new Set(ids(alle)).size, 23, 'doppelte Kennungen');
  for (const b of alle) {
    for (const feld of ['id', 'de', 'kategorie', 'bild', 'bildText', 'erklaerung']) {
      assert.ok(typeof b[feld] === 'string' && b[feld].trim(), `${b.id}: ${feld} fehlt`);
    }
    assert.ok(Object.hasOwn(b, 'ru') && Object.hasOwn(b, 'uk'), `${b.id}: ru und uk gehören zum Schema des Bauauftrags`);
  }
  assert.equal(daten.titel, 'Musik-Wörter-Bilderlexikon', 'Titel wie im Katalog');
});

test('ladeBegriffe: weist Einträge ohne Pflichtfeld, mit unbekannter Kategorie und doppelter Kennung ab', () => {
  for (const feld of ['id', 'de', 'kategorie', 'bild', 'erklaerung']) {
    const d = kopie();
    delete d.begriffe[3][feld];
    assert.throws(() => ladeBegriffe(d), new RegExp(feld), `ohne ${feld}`);
  }
  const unbekannt = kopie();
  unbekannt.begriffe[0].kategorie = 'tanz';
  assert.throws(() => ladeBegriffe(unbekannt), /Kategorie/);
  const doppelt = kopie();
  doppelt.begriffe[1].id = doppelt.begriffe[0].id;
  assert.throws(() => ladeBegriffe(doppelt), /doppelte Kennung/);
  const ruZahl = kopie();
  ruZahl.begriffe[0].ru = 5;
  assert.throws(() => ladeBegriffe(ruZahl), /ru ist weder Text noch null/);
  assert.throws(() => ladeBegriffe({}), /fehlt oder ist leer/);
  assert.throws(() => ladeBegriffe({ begriffe: [] }), /fehlt oder ist leer/);
});

test('ladeBegriffe: bricht ab, wenn ein Bild nicht unter bilder/ in dieser App liegt (keine externen Medien)', () => {
  const schlecht = [
    'https://beispiel.example/a.svg', 'http://beispiel.example/a.svg', '//beispiel.example/a.svg', '/bilder/solist.svg',
    '../solist.svg', 'bilder/../solist.svg', '../../packages/kinder-ui/img/favicon.svg', 'bilder/solist.png', 'bilder/Solist.svg',
    'data:image/svg+xml,<svg/>', ' bilder/solist.svg', 'bilder/solist.svg ', 'solist.svg', 'bilder\\solist.svg', 'bilder/a/b.svg', 'bilder/.svg', '',
  ];
  for (const pfad of schlecht) {
    assert.equal(istBildPfad(pfad), false, `„${pfad}“ darf kein Bildpfad sein`);
    const d = kopie();
    d.begriffe[2].bild = pfad;
    assert.throws(() => ladeBegriffe(d), /Bild|bild/, `„${pfad}“ wurde nicht abgewiesen`);
  }
  for (const pfad of ['bilder/solist.svg', 'bilder/streich-orchester.svg', 'bilder/a1.svg']) assert.equal(istBildPfad(pfad), true, pfad);
  assert.equal(istBildPfad(undefined), false);
  assert.equal(istBildPfad(null), false);
});

test('ladeBegriffe: gibt die Einträge in der Reihenfolge der Datei zurück und lässt die Daten unverändert', () => {
  const geladen = ladeBegriffe(daten);
  assert.deepEqual(geladen, daten.begriffe);
  geladen.pop();
  assert.equal(daten.begriffe.length, 23, 'die Liste ist eine Kopie');
});

test('pruefeBegriffe: die Daten bestehen; 16 Fachwörter und 7 Instrumente tragen S. 260', () => {
  assert.deepEqual(pruefeBegriffe(daten), []);
  assert.equal(SEITE_QUELLE, 'S. 260');
  assert.equal(ANZAHL_FACHWOERTER, 16);
  assert.equal(ANZAHL_INSTRUMENTE, 7);
  const aufSeite = daten.begriffe.filter((b) => b.quelle?.seite === SEITE_QUELLE);
  assert.equal(aufSeite.filter((b) => b.kategorie !== 'instrument').length, 16);
  assert.equal(aufSeite.filter((b) => b.kategorie === 'instrument').length, 7);
  assert.equal(daten.quelle.seite, SEITE_QUELLE, 'die Seite in den Daten ist die der Prüfung');
});

test('pruefeBegriffe: jede Abweichung von 16 Fachwörtern und 7 Instrumenten wird gemeldet (Gegenproben)', () => {
  const eins = kopie();
  eins.begriffe = eins.begriffe.filter((b) => b.id !== 'tempo');
  assert.ok(pruefeBegriffe(eins).some((f) => /Fachwörter mit S\. 260: 15 statt 16/.test(f)));
  const zu = kopie();
  zu.begriffe.push({ ...zu.begriffe[0], id: 'extra', quelle: { seite: 'S. 260', text: 'x' } });
  assert.ok(pruefeBegriffe(zu).some((f) => /Fachwörter mit S\. 260: 17 statt 16/.test(f)));
  const ohneSeite = kopie();
  ohneSeite.begriffe.find((b) => b.id === 'harfe').quelle = { seite: 'S. 261' };
  assert.ok(pruefeBegriffe(ohneSeite).some((f) => /Instrumente mit S\. 260: 6 statt 7/.test(f)));
  const achtes = kopie();
  achtes.begriffe.push({ ...achtes.begriffe.find((b) => b.id === 'orgel'), id: 'laute', quelle: { seite: 'S. 260', text: 'лютне' } });
  assert.ok(pruefeBegriffe(achtes).some((f) => /Instrumente mit S\. 260: 8 statt 7/.test(f)));
});

test('pruefeBegriffe: ein Eintrag braucht Seite oder eigenentwurf; ein eigenes Instrument ohne Quelle trägt eigenentwurf: true', () => {
  const d = kopie();
  const t = d.begriffe.find((b) => b.id === 'tempo');
  delete t.quelle;
  t.eigenentwurf = false;
  assert.ok(pruefeBegriffe(d).some((f) => /tempo: weder quelle\.seite noch eigenentwurf/.test(f)));
  t.eigenentwurf = true;
  assert.ok(!pruefeBegriffe(d).some((f) => /tempo:/.test(f)), 'mit eigenentwurf: true und ohne Seite ist ein Eintrag zulässig');
  // Die Zahl der Fachwörter mit Quelle sinkt dann auf 15: auch das wird gemeldet.
  assert.ok(pruefeBegriffe(d).some((f) => /15 statt 16/.test(f)));
  const inst = kopie();
  const h = inst.begriffe.find((b) => b.id === 'harfe');
  delete h.quelle;
  h.eigenentwurf = false;
  assert.ok(pruefeBegriffe(inst).some((f) => /harfe: Instrument ohne Quelle ohne eigenentwurf: true/.test(f)));
  h.eigenentwurf = true;
  assert.ok(!pruefeBegriffe(inst).some((f) => /harfe:/.test(f)));
  // Ein zusätzliches eigenes Instrument (Katalog: 7+) ändert die Zahl der Instrumente aus der Quelle nicht.
  const plus = kopie();
  plus.begriffe.push({ id: 'floete', de: 'Flöte', ru: null, uk: null, kategorie: 'instrument', bild: 'bilder/floete.svg', erklaerung: 'Eine Flöte klingt hell.', eigenentwurf: true });
  assert.deepEqual(pruefeBegriffe(plus), []);
});

test('pruefeBegriffe: Erklärung höchstens zwei Sätze mit höchstens 25 Wörtern, Zitat höchstens sechs Wörter', () => {
  const drei = kopie();
  drei.begriffe[0].erklaerung = 'Eins. Zwei. Drei.';
  assert.ok(pruefeBegriffe(drei).some((f) => /vokalmusik: Erklärung mit 3 Sätzen/.test(f)));
  const leer = kopie();
  leer.begriffe[0].erklaerung = '';
  assert.ok(pruefeBegriffe(leer).some((f) => /Erklärung mit 0 Sätzen/.test(f)));
  const lang = kopie();
  lang.begriffe[0].erklaerung = `${'Wort '.repeat(26).trim()}.`;
  assert.ok(pruefeBegriffe(lang).some((f) => /mehr als 25 Wörter/.test(f)));
  const zitat = kopie();
  zitat.begriffe[0].quelle.text = 'eins zwei drei vier fünf sechs sieben';
  assert.ok(pruefeBegriffe(zitat).some((f) => /Zitat der Quelle hat mehr als 6 Wörter/.test(f)));
  assert.equal(MAX_SAETZE, 2);
  assert.deepEqual(saetze('Eins. Zwei! Drei? Vier'), ['Eins.', 'Zwei!', 'Drei?', 'Vier']);
  assert.equal(zaehleWoerter('  eins   zwei\ndrei '), 3);
});

test('Quelle S. 260: die Zitate des Bauauftrags stehen als Wortlaut in den Daten, je höchstens sechs Wörter', () => {
  const texte = new Set(daten.begriffe.map((b) => b.quelle.text));
  for (const z of ZITATE_BAUAUFTRAG) assert.ok(texte.has(z), `Zitat „${z}“ fehlt in den Daten`);
  assert.equal(ZITATE_BAUAUFTRAG.length, 13, 'sechs Fachwörter und sieben Instrumente (das Zitat „музыкальными терминами“ ist ein Titel, kein Eintrag)');
  for (const b of daten.begriffe) {
    assert.equal(b.quelle.text, QUELLTEXT[b.id], `${b.id}: Wortlaut weicht ab`);
    assert.equal(b.quelle.seite, 'S. 260', `${b.id}: Seite`);
    assert.ok(zaehleWoerter(b.quelle.text) <= 6, `${b.id}: Zitat zu lang`);
  }
});

test('Reihenfolge: erst die 16 Fachwörter in der Reihenfolge der Liste, dann die sieben Instrumente wie in der Quelle', () => {
  assert.deepEqual(ids(alle.slice(0, 16)), FACHWOERTER);
  assert.deepEqual(ids(alle.slice(16)), INSTRUMENTE);
  assert.ok(alle.slice(0, 16).every((b) => b.kategorie !== 'instrument'));
  assert.ok(alle.slice(16).every((b) => b.kategorie === 'instrument'));
});

test('Kategorien: drei, nur musik, orchester, instrument; solist steht in musik wie im Beispiel des Bauauftrags', () => {
  assert.deepEqual(KATEGORIEN, ['musik', 'orchester', 'instrument']);
  assert.deepEqual(daten.kategorien.map((k) => k.id), KATEGORIEN);
  assert.deepEqual(daten.kategorien.map((k) => k.name), ['Musik', 'Orchester', 'Instrumente']);
  assert.deepEqual(ids(begriffeFuer(alle, 'musik')), MUSIK);
  assert.deepEqual(ids(begriffeFuer(alle, 'orchester')), ORCHESTER);
  assert.deepEqual(ids(begriffeFuer(alle, 'instrument')), INSTRUMENTE);
  assert.equal(begriffMitId(alle, 'solist').kategorie, 'musik');
  assert.deepEqual(begriffeFuer(alle, 'tanz'), []);
  for (const k of daten.kategorien) {
    const bild = alle.find((b) => b.bild === k.bild);
    assert.ok(bild, `Bild der Kategorie ${k.id} gehört zu keinem Wort`);
    assert.equal(bild.kategorie, k.id, `Bild der Kategorie ${k.id} zeigt ein Wort aus ${bild.kategorie}`);
  }
});

test('begriffKarte: deutsches Wort, Erklärung und Bild; ru gibt das Wort der Quelle; uk gibt null, solange uk leer ist', () => {
  const solist = begriffMitId(alle, 'solist');
  assert.deepEqual(begriffKarte(solist, 'de'), { wort: 'Solist', erklaerung: solist.erklaerung, bild: 'bilder/solist.svg', sprache: 'de' });
  assert.deepEqual(begriffKarte(solist), begriffKarte(solist, 'de'), 'Standard ist de');
  assert.equal(begriffKarte(solist, 'ru').wort, 'солист');
  assert.equal(begriffKarte(solist, 'ru').sprache, 'ru');
  assert.equal(begriffKarte(solist, 'uk').wort, null, 'uk ist leer');
  assert.equal(begriffKarte(solist, 'uk').erklaerung, solist.erklaerung, 'die Erklärung bleibt deutsch');
  assert.throws(() => begriffKarte(solist, 'fr'), /Sprache/);
  assert.throws(() => begriffKarte(solist, 'DE'), /Sprache/);
  // Ein Wert null in einer Sprache macht das Wort null; ein fehlender Schlüssel auch.
  assert.equal(begriffKarte({ ...solist, ru: null }, 'ru').wort, null);
  const ohne = { ...solist };
  delete ohne.ru;
  assert.equal(begriffKarte(ohne, 'ru').wort, null);
});

test('Sprachen: uk ist überall null, ru überall das kyrillische Wort der Quelle; nichts ist erfunden', () => {
  for (const b of daten.begriffe) {
    assert.equal(b.uk, null, `${b.id}: uk muss null bleiben, bis die Übersetzung geprüft ist`);
    assert.match(b.ru, /^[а-яё]+(?: [а-яё]+)?$/, `${b.id}: ru ist kein kyrillisches Wort`);
    // Das Wort ru ist das Wort der Quelle; bei den sieben Instrumenten steht es in der Grundform (die Quelle hat den Präpositiv).
    if (b.kategorie !== 'instrument') {
      assert.ok(b.ru.includes(b.quelle.text.split(' ')[0]) || b.quelle.text.includes(b.ru), `${b.id}: ru und Quellenwort passen nicht zusammen`);
    }
  }
  // Auf uk gibt es keine Blätter, solange es leer ist.
  assert.deepEqual(blaetterFuer(daten, ids(alle), 'uk'), []);
  assert.equal(blaetterFuer(daten, ids(alle), 'ru').length, 23);
});

test('Erklärungen: ein bis zwei kurze Sätze in einfacher Sprache, ohne Klammern, Zahlen und Abkürzungen', () => {
  const alleLaengen = [];
  for (const b of daten.begriffe) {
    const s = saetze(b.erklaerung);
    assert.ok(s.length >= 1 && s.length <= MAX_SAETZE, `${b.id}: ${s.length} Sätze`);
    for (const satz of s) {
      const n = zaehleWoerter(satz);
      alleLaengen.push(n);
      assert.ok(n <= 25, `${b.id}: Satz mit ${n} Wörtern`);
      assert.ok(satz.endsWith('.'), `${b.id}: Satz ohne Punkt am Ende`);
    }
    assert.ok(!/[()\[\];:]|\d|z\. ?B\.|usw|u\. ?a\./.test(b.erklaerung), `${b.id}: Klammer, Zahl oder Abkürzung in der Erklärung`);
  }
  const mittel = alleLaengen.reduce((a, n) => a + n, 0) / alleLaengen.length;
  assert.ok(mittel <= 15, `Sätze im Mittel ${mittel.toFixed(1)} Wörter, einfache Sprache braucht kürzere`);
});

test('Erklärungen: keine Wertung eines Kindes, keine Anrede, kein Prüfen („Weißt du …?“)', () => {
  const wertung = /richtig|falsch|Punkt|Rang(?![a-zäöüß])|Stufe|Platz|Prozent|Stern|Ergebnis|gewonnen|verloren|geschafft|brav|klug|Fehler/i;
  const anrede = /(?<![a-zäöüß])(?:[Dd]u|[Dd]ir|[Dd]ich|[Dd]ein\w*|[Ee]uch)(?![a-zäöüß])/;
  for (const b of daten.begriffe) {
    assert.ok(!wertung.test(b.erklaerung), `${b.id}: ${b.erklaerung.match(wertung)?.[0]}`);
    assert.ok(!anrede.test(b.erklaerung), `${b.id}: spricht das Kind an`);
    assert.ok(!b.erklaerung.includes('?'), `${b.id}: eine Frage prüft das Kind`);
  }
});

test('Eigenentwurf: jeder Eintrag trägt eigenentwurf: true; das Wort der Quelle trägt die Seite, die deutschen Wörter und Erklärungen sind Eigenentwurf', () => {
  for (const b of daten.begriffe) {
    assert.equal(b.eigenentwurf, true, `${b.id}: eigenentwurf fehlt`);
    assert.ok(b.quelle?.seite, `${b.id}: Seite fehlt`);
  }
  assert.ok(daten.eigenentwurf.startsWith('Wort, Erklärung und Bild: Eigenentwurf'), 'der Vermerk auf Karte und Blatt');
  assert.ok(daten.eigenentwurf.includes('fachlich nicht geprüft'));
});

test('Bilder: 23 SVG-Dateien in bilder/, jede gehört zu einem Wort, keine bleibt übrig', async () => {
  const dateien = (await readdir(BILDER)).sort();
  assert.equal(dateien.length, 23);
  assert.ok(dateien.every((d) => d.endsWith('.svg')), 'nur SVG');
  const referenziert = daten.begriffe.map((b) => b.bild.replace('bilder/', '')).sort();
  assert.deepEqual(dateien, referenziert, 'jede Datei gehört zu genau einem Wort');
  assert.equal(new Set(referenziert).size, 23, 'zwei Wörter teilen sich ein Bild');
  for (const b of daten.begriffe) assert.equal(b.bild, `bilder/${b.id}.svg`, `${b.id}: Dateiname folgt der Kennung`);
});

test('Bilder: nur Zeichnung, kein Skript, kein Verweis nach außen, kein Text, klein; Titel gleich Bildtext', async () => {
  for (const b of daten.begriffe) {
    const svg = await readFile(new URL(`../${b.bild}`, import.meta.url), 'utf8');
    assert.match(svg, /^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 200 200"/, `${b.id}: Kopf`);
    assert.ok(svg.trimEnd().endsWith('</svg>'), `${b.id}: Ende`);
    assert.ok(svg.length <= 12000, `${b.id}: ${svg.length} Zeichen sind zu viel`);
    // Die einzige Adresse ist der Namensraum von SVG.
    const adressen = [...svg.matchAll(/https?:\/\/[^"\s)]+/g)].map((m) => m[0]);
    assert.deepEqual(adressen, ['http://www.w3.org/2000/svg'], `${b.id}: Adresse außer dem Namensraum`);
    assert.ok(!/<script|<foreignObject|<image|<use|<a[ >]|<style|<text|<iframe|href=|xlink|on[a-z]+=/i.test(svg), `${b.id}: verbotenes Element oder Attribut`);
    assert.equal((svg.match(/<g[ >]/g) ?? []).length, (svg.match(/<\/g>/g) ?? []).length, `${b.id}: <g> nicht ausgeglichen`);
    assert.equal(svg.match(/<title>([^<]*)<\/title>/)?.[1], b.bildText, `${b.id}: Titel der Zeichnung und Bildtext der Daten unterscheiden sich`);
    assert.ok(svg.includes(`aria-label="${b.bildText}"`), `${b.id}: aria-label`);
  }
});

test('Bildtexte: kurz, beschreiben das Bild und fangen nicht mit „Bild“ oder „Zeichnung“ an', () => {
  for (const b of daten.begriffe) {
    assert.ok(b.bildText.length >= 15 && b.bildText.length <= 90, `${b.id}: ${b.bildText.length} Zeichen`);
    assert.ok(!/^(?:Bild|Zeichnung|Foto|Grafik)/i.test(b.bildText), `${b.id}: ${b.bildText}`);
    assert.ok(!/[.!?]$/.test(b.bildText), `${b.id}: Bildtext ohne Satzzeichen am Ende`);
  }
  assert.equal(new Set(daten.begriffe.map((b) => b.bildText)).size, 23, 'zwei Bilder mit demselben Text');
});

test('begriffeFuer, begriffMitId und nachbar: Kategorie in Dateireihenfolge, vorheriges und nächstes Wort, am Ende von vorn', () => {
  for (const kat of KATEGORIEN) {
    const gruppe = begriffeFuer(alle, kat);
    assert.ok(gruppe.every((b) => b.kategorie === kat));
    gruppe.forEach((b, i) => {
      assert.equal(nachbar(alle, b.id, 1).id, gruppe[(i + 1) % gruppe.length].id, `${b.id}: nächstes`);
      assert.equal(nachbar(alle, b.id, -1).id, gruppe[(i - 1 + gruppe.length) % gruppe.length].id, `${b.id}: vorheriges`);
      assert.equal(nachbar(alle, b.id, 0).id, b.id);
      assert.equal(nachbar(alle, b.id, gruppe.length).id, b.id, 'ein voller Umlauf führt zurück');
    });
  }
  assert.equal(nachbar(alle, 'oper', 1).id, 'vokalmusik', 'nach dem letzten Wort der Kategorie kommt das erste');
  assert.equal(nachbar(alle, 'vokalmusik', -1).id, 'oper');
  assert.equal(nachbar(alle, 'klarinette', 1).id, 'harfe');
  assert.equal(begriffMitId(alle, 'harfe').de, 'Harfe');
  assert.equal(begriffMitId(alle, 'gibtsnicht'), undefined);
  assert.throws(() => nachbar(alle, 'gibtsnicht', 1), /Kennung/);
});

test('Auswahl: schalte und schalteKategorie ändern nur die neue Menge; alleGewaehlt; keine Dubletten', () => {
  const start = new Set(['solist', 'harfe']);
  const ohneHarfe = schalte(start, 'harfe');
  assert.equal(ohneHarfe.has('harfe'), false);
  assert.equal(start.has('harfe'), true, 'das Original darf nicht verändert werden');
  assert.equal(schalte(ohneHarfe, 'harfe').has('harfe'), true);
  assert.equal(alleGewaehlt(start, alle, 'instrument'), false);
  const alleInstrumente = schalteKategorie(start, alle, 'instrument');
  assert.equal(alleGewaehlt(alleInstrumente, alle, 'instrument'), true);
  assert.equal(alleInstrumente.size, 8, 'Solist und sieben Instrumente, Harfe nur einmal');
  assert.equal(start.size, 2, 'das Original darf nicht verändert werden');
  const wieder = schalteKategorie(alleInstrumente, alle, 'instrument');
  assert.deepEqual([...wieder], ['solist'], 'zweites Schalten wählt die Kategorie wieder ab');
  assert.equal(alleGewaehlt([], alle, 'gibtsnicht'), false, 'eine Kategorie ohne Wörter gilt nicht als gewählt');
});

test('Druck: n gewählte Wörter ergeben n Blätter in der Reihenfolge der Datei; Unbekanntes wird ignoriert', () => {
  const gewaehlt = gewaehlteBegriffe(alle, ['klarinette', 'solist', 'gibtsnicht', 'solist']);
  assert.deepEqual(ids(gewaehlt), ['solist', 'klarinette']);
  const kennungen = ids(alle);
  for (let n = 0; n <= kennungen.length; n += 1) {
    assert.equal(gewaehlteBegriffe(alle, kennungen.slice(0, n)).length, n, `bei ${n} gewählten Wörtern`);
    assert.equal(blaetterFuer(daten, kennungen.slice(0, n)).length, n, `bei ${n} gewählten Wörtern: Blätter`);
  }
  assert.equal(kannDrucken(gewaehlteBegriffe(alle, [])), false, 'ohne Auswahl darf nicht gedruckt werden');
  assert.equal(kannDrucken(gewaehlteBegriffe(alle, ['tempo'])), true);
  const blaetter = blaetterFuer(daten, ['harfe', 'dirigent']);
  assert.deepEqual(blaetter.map((b) => b.wort), ['Dirigent', 'Harfe']);
  assert.deepEqual(blaetter.map((b) => b.thema), ['Orchester', 'Instrumente']);
  assert.deepEqual(blaetter.map((b) => b.bild), ['bilder/dirigent.svg', 'bilder/harfe.svg']);
});

test('druckBlaetter: je Karte ein Blatt A4 hoch; eine Karte ohne Wort (zum Beispiel uk) wird übersprungen', () => {
  const karten = alle.slice(0, 4).map((b) => begriffKarte(b, 'de'));
  const blaetter = druckBlaetter(karten);
  assert.equal(blaetter.length, 4);
  assert.deepEqual(Object.keys(blaetter[0]).sort(), ['bild', 'bildText', 'erklaerung', 'thema', 'wort'], 'ein Blatt trägt nur diese Felder: keine Namenszeile, kein Datum, keine Seite');
  const mitLuecke = [karten[0], { ...karten[1], wort: null }, karten[2]];
  assert.deepEqual(druckBlaetter(mitLuecke).map((b) => b.wort), ['Vokalmusik', 'Solist']);
  assert.deepEqual(druckBlaetter([null, undefined]), []);
  assert.deepEqual(druckBlaetter(alle.map((b) => begriffKarte(b, 'uk'))), [], 'solange uk leer ist, gibt es kein Blatt');
  assert.equal(druckBlaetter(alle.map((b) => begriffKarte(b, 'de'))).length, 23);
});

test('druckBlaetter und pruefeBlatt: Zeichen der Sperrliste, Emojis, Namenszeile, Tagesfelder und Seitenzahlen werden abgewiesen', () => {
  const gut = { wort: 'Solist', erklaerung: 'Ein Solist singt allein.', bild: 'bilder/solist.svg', bildText: 'Eine Person', thema: 'Musik' };
  assert.deepEqual(pruefeBlatt(gut), []);
  const schlecht = [
    ['wort', 'Solist ★'], ['wort', 'Solist ✓'], ['erklaerung', 'Ein Kästchen ☐ zum Ankreuzen'], ['erklaerung', 'Hier ☑'],
    ['erklaerung', 'Ein Pfeil → nach rechts'], ['erklaerung', 'Ein Punkt • in der Liste'], ['erklaerung', 'Mittelpunkt · im Text'],
    ['erklaerung', 'Musik 🎵'], ['wort', '😀'], ['thema', 'Musik ❌'],
    ['erklaerung', 'Name: ______'], ['erklaerung', 'Dein Name'], ['erklaerung', 'Datum'], ['erklaerung', 'Montag'], ['erklaerung', 'jeden Tag'],
    ['erklaerung', 'Seite S. 260'], ['bildText', 'siehe S. 12'],
  ];
  for (const [feld, text] of schlecht) {
    assert.ok(pruefeBlatt({ ...gut, [feld]: text }).length > 0, `${feld}: „${text}“ wurde nicht abgewiesen`);
    assert.throws(() => druckBlaetter([{ ...gut, [feld]: text }]), /Blatt/, `${feld}: „${text}“ bricht den Druck nicht ab`);
  }
  // Normaler deutscher Text mit Anführungszeichen, Gedankenstrich und Umlauten bleibt frei.
  assert.deepEqual(pruefeBlatt({ ...gut, erklaerung: 'Ein „Solist“ – oder eine Solistin – spielt für Größe und Übung.' }), []);
});

test('DRUCKZEICHEN: erkennt jedes Zeichen der Sperrliste aus docs/02 und die Emojis, lässt deutschen Text frei', () => {
  const sperrliste = '☐☒☑✓✔✗✘✅❌★☆•●○◦·∙‧▪▫◾◽■□';
  for (const z of sperrliste) assert.ok(DRUCKZEICHEN.test(z), `„${z}“ wird nicht erkannt`);
  for (const z of '←→↑↓⇒➜➡▶◀♪♫🎵🎶😀👪🏆⭐') assert.ok(DRUCKZEICHEN.test(z), `„${z}“ wird nicht erkannt`);
  for (const text of ['Äpfel und Öl, Straße, Größe – „zitiert“ …', 'Die Harfe (kurz: Harfe) hat 47 Saiten.', 'Oper, Ballett & Konzert', 'Тест вокальная музыка']) {
    assert.ok(!DRUCKZEICHEN.test(text), `Fehlalarm bei „${text}“`);
  }
});

test('Blatt: der Text besteht aus Kopf, Thema, Wort, Erklärung und Vermerk; keine Seitenangabe, darum auch keine Pflichtmarkierung', () => {
  for (const b of alle) {
    const blatt = blaetterFuer(daten, [b.id])[0];
    const text = blattText(blatt, daten);
    assert.equal(text, [daten.titel, blatt.thema, b.de, b.erklaerung, daten.eigenentwurf].join('\n'), `${b.id}: Blatt`);
    assert.ok(!/S\.\s?\d/.test(text), `${b.id}: Seitenangabe auf dem Blatt`);
    assert.ok(!/von einem Menschen geprüft/.test(text), `${b.id}: Pflichtmarkierung ohne Seitenangabe`);
    assert.ok(text.includes('Eigenentwurf'), `${b.id}: Eigenentwurf nicht benannt`);
    assert.ok(!/undefined|null|\[object|NaN/.test(text), `${b.id}: Rest im Text`);
  }
});

test('Vorlesen: Text aus Wort und Erklärung; leer ohne Wort; alle Instrumente zusammen; Liste mit Namen', () => {
  const harfe = begriffKarte(begriffMitId(alle, 'harfe'), 'de');
  assert.equal(vorlesetext(harfe), `Harfe. ${harfe.erklaerung}`);
  assert.equal(vorlesetext({ ...harfe, wort: null }), '');
  const instrumente = begriffeFuer(alle, 'instrument').map((b) => begriffKarte(b, 'de'));
  const alles = alleVorlesetext(instrumente);
  for (const k of instrumente) assert.ok(alles.includes(vorlesetext(k)), `${k.wort} fehlt im Text für alle`);
  assert.equal(alleVorlesetext([{ ...harfe, wort: null }]), '');
  assert.equal(listeVorlesetext(daten.texte.liste.vorlesen, 'Musik', ['A', 'B']), 'Musik. Die Wörter: A, B.');
  for (const b of alle) assert.ok(!/[<>{}]/.test(vorlesetext(begriffKarte(b, 'de'))), `${b.id}: Auszeichnung im Vorlesetext`);
});

test('fuelle und gewaehltText: Platzhalter werden ersetzt, Unbekanntes bleibt; der Zähler nennt nur, was gewählt ist', () => {
  assert.equal(fuelle('{n} Wörter', { n: 11 }), '11 Wörter');
  assert.equal(fuelle('Thema: {name}', { name: 'Musik' }), 'Thema: Musik');
  assert.equal(fuelle('{x} bleibt', {}), '{x} bleibt');
  assert.equal(fuelle('ohne Platzhalter', { n: 1 }), 'ohne Platzhalter');
  const D = daten.texte.druck;
  assert.equal(gewaehltText(D, 0), 'Noch keine Karte gewählt.');
  assert.equal(gewaehltText(D, 1), 'Gewählt: 1 Karte.');
  assert.equal(gewaehltText(D, 9), 'Gewählt: 9 Karten.');
});

test('Texte der Oberfläche: Zahlen und Quellenangaben stimmen mit den Daten überein', () => {
  const erwachsene = JSON.stringify(daten.texte.erwachsene);
  assert.ok(erwachsene.includes(`${daten.begriffe.length} Wörter`), '23 Wörter');
  assert.ok(erwachsene.includes(`${ANZAHL_FACHWOERTER} Fachwörter`), '16 Fachwörter');
  assert.ok(erwachsene.includes('sieben Instrumente'), 'sieben Instrumente');
  assert.equal(ANZAHL_INSTRUMENTE, 7);
  const q = daten.quelle;
  assert.equal(q.seite, 'S. 260');
  assert.equal(q.abschnitt, '„Развиваемся в деятельности“, S. 259');
  assert.equal(q.gruppe, '„ФАНТАЗЕРЫ“, S. 260');
  assert.equal(q.alter, 'S. 199 bis 200');
  assert.match(q.werk, /^Praleska, Minsk: НИО, 2007, ISBN 978-985-465-244-3\.$/);
  const satz = fuelle(daten.texte.erwachsene.abschnitte[1].absaetze[0], q);
  assert.equal(satz, 'Die Wortliste folgt der Praleska, S. 260 (Abschnitt „Развиваемся в деятельности“, S. 259, Gruppe „ФАНТАЗЕРЫ“, S. 260). Sie hat 16 Fachwörter der Musik (Zählung: Eigenentwurf) und sieben Instrumente, jeweils in der Reihenfolge der Quelle. Die Aufzählung der Fachwörter auf der Seite endet mit „и др.“ und ist nicht abschließend; Vokal- und Instrumentalmusik sowie Blas- und Streichorchester sind hier einzeln gezählt.');
  // Die Zahl 16 ist eine Zählung der App (Bauauftrag, Abschnitt 1), keine Aussage der Quelle: wo der Text die Quelle nennt,
  // steht der Vermerk bei der Zahl.
  for (const a of daten.texte.erwachsene.abschnitte.filter((x) => x.marke)) {
    for (const text of a.absaetze.filter((t) => /\b16 Fachwörter/.test(t))) {
      assert.match(text, /16 Fachwörter der Musik \(Zählung: Eigenentwurf\)/, `Abschnitt „${a.titel}“: die Zahl 16 ohne Vermerk`);
    }
  }
  assert.equal(daten.texte.start.wortzahl, '{n} Wörter');
  assert.equal(daten.sprachen, 'uk und ru: nicht vorhanden, offen.');
});

test('Zahl der Wörter je Kategorie: 11, 5 und 7 – zusammen 23, wie der Zähler auf dem Startbildschirm sie nennt', () => {
  const zahlen = daten.kategorien.map((k) => begriffeFuer(alle, k.id).length);
  assert.deepEqual(zahlen, [11, 5, 7]);
  assert.equal(zahlen.reduce((a, n) => a + n, 0), 23);
  assert.deepEqual(daten.kategorien.map((k) => fuelle(daten.texte.start.wortzahl, { n: begriffeFuer(alle, k.id).length })), ['11 Wörter', '5 Wörter', '7 Wörter']);
});

test('sprachStuecke: kyrillische Stücke bekommen die Sprache ru, der deutsche Text bleibt ohne Angabe', () => {
  assert.deepEqual(sprachStuecke('Abschnitt „Развиваемся в деятельности“, S. 259'), [
    { text: 'Abschnitt „', lang: null },
    { text: 'Развиваемся в деятельности', lang: 'ru' },
    { text: '“, S. 259', lang: null },
  ]);
  assert.deepEqual(sprachStuecke('Gruppe „ФАНТАЗЕРЫ“ und „арфе“'), [
    { text: 'Gruppe „', lang: null }, { text: 'ФАНТАЗЕРЫ', lang: 'ru' }, { text: '“ und „', lang: null }, { text: 'арфе', lang: 'ru' }, { text: '“', lang: null },
  ]);
  assert.deepEqual(sprachStuecke('Nur deutscher Text, 23 Wörter.'), [{ text: 'Nur deutscher Text, 23 Wörter.', lang: null }]);
  assert.deepEqual(sprachStuecke(''), []);
  assert.equal(sprachStuecke('„шестой—седьмой годы жизни“').filter((s) => s.lang === 'ru').length, 1, 'ein Gedankenstrich trennt kein Stück');
  // Nichts geht verloren: die Stücke ergeben wieder den Text.
  for (const a of daten.texte.erwachsene.abschnitte) {
    for (const satz of a.absaetze) {
      const text = fuelle(satz, { ...daten.quelle, sprachen: daten.sprachen });
      assert.equal(sprachStuecke(text).map((s) => s.text).join(''), text);
    }
  }
  assert.equal(sprachStuecke(daten.quelle.werk).filter((s) => s.lang === 'ru').map((s) => s.text).join(), 'НИО');
});
