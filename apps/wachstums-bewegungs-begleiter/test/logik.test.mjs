import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import {
  BLOECKE, ZIELE, NICHT_GEPRUEFT, AMPEL, EINSTUFUNG, KOERPERMASS, WIRKVERSPRECHEN,
  MEHRSTELLIGE_ZAHL, blockVon, wertVon, werteFuerAlter, angebotsTexte, handlungsTexte, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/begleiter.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const logikQuelle = await readFile(new URL('../logik.mjs', import.meta.url), 'utf8');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Daten sind gültig und vollständig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.bloecke.length, 4);
  assert.equal(daten.bewegungswerte.length, 4);
  assert.equal(daten.gelegenheiten.length, 8);
  assert.equal(daten.ausgeschlossen.length, 8);
  for (const id of BLOECKE) assert.ok(blockVon(daten, id), `Block ${id} fehlt`);
});

test('jede der vier Quellfragen ist umgedreht', () => {
  // Die tragende Entscheidung: die Quelle fragt das KIND nach seinem Körper
  // („Wie ist deine Haltung?"), diese App fragt die ERWACHSENEN nach den
  // Bedingungen. Ein Block ohne diese Umdrehung wäre wieder eine Prüfung.
  for (const b of daten.bloecke) {
    assert.match(b.quellFrage, /\?$/, `${b.id}: die Quellfrage ist keine Frage`);
    assert.match(b.wasStattdessen, /Die Frage an die Erwachsenen lautet/, `${b.id}: nicht umgedreht`);
    assert.ok(b.nichtUebernommen.length > 30, `${b.id}: nichtUebernommen zu knapp`);
    assert.ok(b.woEsHingehoert.length > 30, `${b.id}: woEsHingehoert zu knapp`);
  }
  const k = kopie();
  k.bloecke[0].wasStattdessen = 'Prüfen Sie die Haltung Ihres Kindes im Stehen.';
  assert.ok(pruefeDaten(k).some((f) => /keine Frage an die Erwachsenen/.test(f)));
  // Und alle vier Quellziele sind abgedeckt (Ziel 1 ist das allgemeine).
  assert.deepEqual(daten.bloecke.map((b) => b.quellZiel), [2, 3, 4, 5]);
  assert.equal(ZIELE.mitFrage, 4);
  const k2 = kopie();
  k2.bloecke[2].quellZiel = 2;
  assert.ok(pruefeDaten(k2).some((f) => /Quellziel 4 hat keinen Block/.test(f)));
});

test('jede Zahl steht bei ihrer Quelle, und die Quelle trägt ein Jahr', () => {
  for (const w of daten.bewegungswerte) {
    assert.match(w.quelle, /\b(?:19|20)\d\d\b/, `${w.id}: Quelle ohne Jahr`);
    assert.ok(w.einschraenkung.length > 40, `${w.id}: einschraenkung zu knapp`);
  }
  const k = kopie();
  k.bewegungswerte[0].quelle = 'Weltgesundheitsorganisation';
  assert.ok(pruefeDaten(k).some((f) => /Quelle trägt kein Jahr/.test(f)));
  // Auf der Handlungsseite steht überhaupt keine mehrstellige Zahl.
  for (const [wo, text] of handlungsTexte(daten)) {
    assert.ok(!MEHRSTELLIGE_ZAHL.test(text), `${wo} trägt eine mehrstellige Zahl: ${text}`);
  }
  const k2 = kopie();
  k2.gelegenheiten[0].text = 'Den Weg zu Fuß gemacht – mindestens 20 Minuten';
  assert.ok(pruefeDaten(k2).some((f) => /mehrstellige Zahl/.test(f)));
});

test('die Katalogzahl „180 Min/Tag für 3-5" gibt es in keiner Quelle', () => {
  // Nachgeschlagen: den Altersblock 3-5 verwendet keine der Quellen. Die WHO
  // nennt 180 Minuten für 3-4, die Nationalen Empfehlungen für 4-6, und ab
  // fünf gilt bei der WHO eine andere Leitlinie mit 60 Minuten im
  // Wochendurchschnitt. Die App zeigt die Werte deshalb getrennt.
  const who34 = wertVon(daten, 'w-who34');
  assert.match(who34.alter, /3 bis 4/);
  assert.match(who34.wert, /180 Minuten/);
  assert.match(who34.wert, /jeder Intensität/);
  assert.match(who34.einschraenkung, /sehr niedriger Evidenzqualität/);
  const nebb = wertVon(daten, 'w-nebb46');
  assert.match(nebb.alter, /4 bis 6/);
  assert.match(nebb.quelle, /Rütten|Pfeifer/);
  const who5 = wertVon(daten, 'w-who5');
  assert.match(who5.wert, /Wochendurchschnitt|im Wochendurchschnitt/);
  // Kein Feld behauptet „180 Minuten für 3 bis 5".
  assert.ok(!/180[^.]{0,30}3 bis 5|3-5[^.]{0,30}180/.test(JSON.stringify(daten)));
});

test('für jedes Alter der Zielgruppe gibt es einen Wert – und die Überschneidung ist benannt', () => {
  assert.deepEqual(werteFuerAlter(daten, 3).map((w) => w.id), ['w-who34']);
  assert.deepEqual(werteFuerAlter(daten, 4).map((w) => w.id), ['w-who34', 'w-nebb46']);
  assert.deepEqual(werteFuerAlter(daten, 6).map((w) => w.id), ['w-nebb46', 'w-who5', 'w-nebb611']);
  assert.deepEqual(werteFuerAlter(daten, 7).map((w) => w.id), ['w-who5', 'w-nebb611']);
  // Sechs Jahre trägt zwei deutsche Zahlen (180 im Block 4-6, 90 im Block
  // 6-11). Die Quelle löst das nicht auf – die App sagt das, statt zu wählen.
  assert.match(daten.werteHinweise.ueberschneidung, /sechsjährige|6/i);
  assert.match(daten.werteHinweise.ueberschneidung, /löst das nicht auf|Entscheidung dieser App/);
  const k = kopie();
  delete k.werteHinweise.ueberschneidung;
  assert.ok(pruefeDaten(k).some((f) => /ueberschneidung fehlt/.test(f)));
});

test('jede fachliche Aussage trägt ihre Leitlinie mit Jahr', () => {
  // Die Umdrehung der vier Fragen ist eine Entscheidung – sie braucht Belege,
  // sonst ist sie eine Meinung. Besonders beim Fuß: die Leitlinie nennt als
  // Vorbeugung genau das, was in der Frage an die Erwachsenen steht.
  assert.ok(daten.fachliches.length >= 4);
  for (const f of daten.fachliches) {
    assert.match(f.quelle, /\b(?:19|20)\d\d\b/, `${f.id}: Quelle ohne Jahr`);
    assert.ok(blockVon(daten, f.block), `${f.id}: Block ${f.block} gibt es nicht`);
    assert.ok(f.aussage.length > 60, `${f.id}: aussage zu knapp`);
  }
  assert.ok(daten.fachliches.some((f) => /Knick-Senkfuß/.test(f.quelle)), 'die Fußleitlinie fehlt');
  // Das Gehen auf den Zehen, das die Quelle als Übung vorschlägt, ist in der
  // Leitlinie eine UNTERSUCHUNGSPOSITION. Korrektur nach der Gegenprobe: die
  // erste Fassung schrieb, es sei dort ein Zeichen für eine neurologische
  // Ursache – das Wort „Zehenspitzengang" kommt in der Leitlinie aber gar
  // nicht vor. Was vorkommt, ist der funktionelle Zehenstand als Testposition.
  const zeh = daten.fachliches.find((f) => /Zehen/.test(f.aussage));
  assert.ok(zeh, 'der Zehenstand ist nicht eingeordnet');
  assert.match(zeh.aussage, /Untersuchungsposition/);
  assert.ok(!/neurologische Ursache/.test(zeh.aussage), 'die zurückgezogene Begründung ist zurück');
  const k = kopie();
  k.fachliches[0].quelle = 'eine Leitlinie';
  assert.ok(pruefeDaten(k).some((f) => /trägt kein Jahr/.test(f)));
  const k2 = kopie();
  k2.fachliches[1].block = 'b-gibtsnicht';
  assert.ok(pruefeDaten(k2).some((f) => /gehört zu keinem Block/.test(f)));
});

test('keine Ampel, keine Einstufung, kein Körpermaß, kein Wirkversprechen', () => {
  for (const [wo, text] of angebotsTexte(daten)) {
    assert.ok(!AMPEL.test(text), `${wo}: Ampel – ${text}`);
    assert.ok(!EINSTUFUNG.test(text), `${wo}: Einstufung – ${text}`);
    assert.ok(!KOERPERMASS.test(text), `${wo}: Körpermaß – ${text}`);
    assert.ok(!WIRKVERSPRECHEN.test(text), `${wo}: Wirkversprechen – ${text}`);
    assert.ok(!/[Ѐ-ӿ]/.test(text), `${wo}: kyrillisch – ${text}`);
  }
  for (const [satz, netz, name] of [
    ['Heute war ein roter Tag.', AMPEL, 'AMPEL'],
    ['Ihr Kind hat 3 von 8 Punkten.', AMPEL, 'AMPEL (Punkte)'],
    ['Das sind 60 Prozent der Empfehlung.', AMPEL, 'AMPEL (Prozent)'],
    ['Ihr Kind bewegt sich zu wenig.', EINSTUFUNG, 'EINSTUFUNG'],
    ['Ein unsportliches Kind braucht mehr.', EINSTUFUNG, 'EINSTUFUNG (flektiert)'],
    ['Tragen Sie die Größe in cm ein: 104 cm.', KOERPERMASS, 'KOERPERMASS'],
    ['Der BMI liegt im Normbereich.', KOERPERMASS, 'KOERPERMASS (BMI)'],
    ['Hochspringen macht größer.', WIRKVERSPRECHEN, 'WIRKVERSPRECHEN'],
    ['Diese Übung verbessert die Haltung.', WIRKVERSPRECHEN, 'WIRKVERSPRECHEN (Haltung)'],
  ]) {
    assert.ok(netz.test(satz), `${name} greift nicht: ${satz}`);
  }
  // Das Richtige bleibt frei.
  assert.ok(!AMPEL.test('Draußen gewesen, bei jedem Wetter'));
  assert.ok(!EINSTUFUNG.test('Selbst mitgemacht statt danebengesessen'));
  assert.ok(!KOERPERMASS.test('Ein Strich mit Datum am Türrahmen'));
  // Und die kein…-Absätze MÜSSEN benennen, was sie ausschließen.
  assert.ok(AMPEL.test(daten.keineAmpel));
  assert.ok(KOERPERMASS.test(daten.keinKoerperdatum));
  assert.ok(WIRKVERSPRECHEN.test(daten.keinWachstumstrick));
  assert.match(daten.keinSchrittzaehler, /Schrittzähler/);
  for (const feld of ['keineAmpel', 'keinKoerperdatum', 'keinWachstumstrick']) {
    const k = kopie();
    k[feld] = 'Das macht diese App nicht.';
    assert.ok(pruefeDaten(k).some((f) => new RegExp(feld, 'i').test(f)), `${feld} wird nicht in Gegenrichtung geprüft`);
  }
});

test('die Netze decken JEDEN gerenderten Text ab, Ausnahmen sind benannt', () => {
  const geprueft = new Set(angebotsTexte(daten).map(([wo]) => wo.split(/[.[]/)[0]));
  for (const feld of Object.keys(daten)) {
    assert.ok(geprueft.has(feld) || feld in NICHT_GEPRUEFT, `${feld} wird weder geprüft noch als Ausnahme benannt`);
  }
  for (const [feld, grund] of Object.entries(NICHT_GEPRUEFT)) {
    assert.ok(feld in daten, `Ausnahme ${feld} gibt es nicht`);
    assert.ok(grund.length > 10, `Ausnahme ${feld} ohne Grund`);
  }
  const k = kopie();
  k.wasEsIst = `${k.wasEsIst} Ihr Kind bewegt sich zu wenig.`;
  assert.ok(pruefeDaten(k).some((f) => /wasEsIst: stuft ein Kind ein/.test(f)));
});

test('die Liste der Gelegenheiten lässt auch Ruhe zu', () => {
  // Ohne diesen Eintrag wäre die Liste eine Pflichtenliste, und das Ankreuzen
  // würde zur Tagesbilanz – genau das, was die Ampel sein sollte.
  assert.ok(daten.gelegenheiten.some((g) => /Ruhe/.test(g.text)));
  const k = kopie();
  k.gelegenheiten = k.gelegenheiten.filter((g) => !/Ruhe/.test(g.text));
  assert.ok(pruefeDaten(k).some((f) => /Pflichtenliste/.test(f)));
});

test('gespeichert wird nur der heutige Tag, mit Löschknopf', () => {
  // Kein Verlauf: eine Reihe von Tagen wäre eine Kurve über ein Kind.
  assert.match(code, /datenKarte\(/);
  assert.match(code, /wbb-heute/);
  assert.ok(!/localStorage\.clear/.test(code), 'localStorage.clear() ist verboten');
  assert.match(code, /roh\.tag !== tagHeute\(\)/, 'ein alter Tag muss verworfen werden');
  // Lokale Zeit, nicht toISOString (Review Welle 80).
  assert.ok(!/toISOString/.test(code), 'toISOString schreibt kurz nach Mitternacht das gestrige Datum');
  assert.match(code, /getFullYear\(\)/);
});

test('keine externen Anfragen, kein Konto, kein Bildschirm fürs Kind', () => {
  assert.match(code, /installiereNetzwerkWaechter\(\)/);
  assert.ok(!/https?:\/\//.test(code), 'eine URL im Code');
  assert.ok(!/https?:\/\//.test(JSON.stringify(daten)), 'eine URL in den Daten');
  assert.match(seite, /default-src 'self'/);
  assert.match(seite, /style-src 'self' 'unsafe-inline'/);
  assert.match(seite, /<noscript>/);
  assert.match(code, /impressum\.html/);
  assert.ok(!/eltern\.html/.test(code));
  assert.match(daten.hinweis, /Das Gerät ist in Ihrer Hand/);
  assert.ok(!/Math\.random/.test(logikQuelle.replace(/^\s*(?:\/\/|\*|\/\*).*$/gm, '')));
});

test('der Druckzettel trägt die Werte und die Gelegenheiten, aber keinen Haken', () => {
  assert.match(druck, /@media print/);
  assert.match(druck, /\.wbb-nur-bildschirm\s*\{\s*display:\s*none\s*!important/);
  assert.match(druck, /\.wbb-block\s*\{\s*display:\s*none\s*!important/);
  const groesse = druck.match(/\.wbb-gelegenheiten li \{[^}]*font-size:\s*([\d.]+)pt/);
  assert.ok(groesse && Number(groesse[1]) >= 11, 'die Gelegenheiten sind auf Papier zu klein');
  assert.ok(!/Name:/.test(druck) && !/Name:/.test(code));
  assert.ok(!/☐|✓/.test(code), 'ein Haken-Zeichen in der App');
  // Die Haken stehen nur auf dem Bildschirm; im Druck ist es eine Liste.
  assert.match(code, /wbb-nur-druck/);
  assert.match(seite, /href="druck\.css"/);
});

test('die Nachbar-Apps, auf die verwiesen wird, gibt es wirklich', async () => {
  const vorhanden = new Set(await readdir(new URL('../../', import.meta.url)));
  for (const treffer of code.matchAll(/href: '\.\.\/([a-z0-9-]+)\/'/g)) {
    assert.ok(vorhanden.has(treffer[1]), `verlinkte App ${treffer[1]} gibt es nicht`);
  }
});

test('die Behörde steht mit beiden Namen da', () => {
  // Seit dem 13.02.2025 BIÖG; ohne den alten Namen findet niemand das
  // Material wieder.
  assert.match(daten.werteHinweise.bioeg, /BIÖG/);
  assert.match(daten.werteHinweise.bioeg, /BZgA|Bundeszentrale/);
  const k = kopie();
  k.werteHinweise.bioeg = 'Das BIÖG empfiehlt drei Stunden und mehr.';
  assert.ok(pruefeDaten(k).some((f) => /beide Namen/.test(f)));
  // Und der Stand der Nationalen Empfehlungen ist genannt, samt Fortschreibung.
  assert.match(daten.werteHinweise.stand, /2016/);
  assert.match(daten.werteHinweise.stand, /2027/);
});
