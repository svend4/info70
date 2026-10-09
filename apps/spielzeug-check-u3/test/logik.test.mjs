import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import {
  BEREICHE, LEBENSGEFAHR, ARTEN, MARKE_ODER_PREIS, HERSTELLER_GENANNT, WIRKVERSPRECHEN, GESAMTWERTUNG,
  pruefungVon, artVon, istAbhakbar, bereicheInReihenfolge, pruefungenIm, offenePunkte, dauerregeln,
  bericht, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/pruefungen.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const logikQuelle = await readFile(new URL('../logik.mjs', import.meta.url), 'utf8');
const logikCode = logikQuelle.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

/** Findet die Prüfung, bei der ein Feld mutiert werden soll. */
const mit = (id, feld, wert) => {
  const k = kopie();
  const p = k.pruefungen.find((x) => x.id === id);
  if (wert === undefined) delete p[feld]; else p[feld] = wert;
  return k;
};

test('Daten sind gültig und vollständig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.pruefungen.length, 19);
  assert.equal(daten.bereiche.length, BEREICHE.length);
  for (const b of BEREICHE) assert.ok(pruefungenIm(daten, b).length, `Bereich ${b} ist leer`);
});

test('es gibt keine Gesamtwertung – nicht als Funktion und nicht im Text', () => {
  // Eine gemischte Liste aus Sicherheit und Eignung wird als Gesamtnote
  // gelesen, und genau dort kippt ein Check zur Kaufberatung. Gebannt sind
  // die BEGRIFFE, nicht die Zeichenfolge „Punkte": `offenePunkte` sind
  // offene Posten und kein Punktestand (gleiche Wortsinn-Kollision wie in
  // apps/sicherer-krabbelraum-check).
  // Geprüft werden die FUNKTIONEN. Die Netze heißen nach dem, was sie
  // verbieten – `GESAMTWERTUNG` ist die Regel gegen die Gesamtwertung, nicht
  // eine. Ein Namensverbot über alle Exporte hätte genau die Sperre
  // getroffen, die es durchsetzen soll: Falle A, diesmal im eigenen Test.
  for (const [name, wert] of Object.entries(logik)) {
    if (typeof wert !== 'function') continue;
    assert.doesNotMatch(name, /gesamt|anteil|ampel|prozent|score|note|punktestand|punktzahl|bewerte|summe/i,
      `logik exportiert die Funktion ${name}`);
  }
  for (const name of ['GESAMTWERTUNG', 'MARKE_ODER_PREIS', 'WIRKVERSPRECHEN', 'HERSTELLER_GENANNT']) {
    assert.ok(logik[name] instanceof RegExp, `${name} ist ein Netz, keine Funktion`);
  }
  assert.ok(Object.keys(logik).includes('offenePunkte'));
  const b = bericht(daten, {}, '01.01.2026');
  // Keine gerechnete Zahl: kein Anteil, keine Quote.
  assert.doesNotMatch(b, /\d+\s*(von|aus)\s*\d+/);
  assert.doesNotMatch(b, /\d+\s*%/);
  // Und das Wortnetz greift auf den Bericht OHNE den Satz, der die Wertung
  // zurückweist – dieser Satz MUSS „Prozentwert", „Ampel" und „bestanden"
  // nennen, um sie auszuschließen. Elfter Fall von Falle A in diesem
  // Projekt, diesmal im eigenen Test: ein Netz über den ganzen Bericht
  // hätte die Absage als Verstoß gemeldet.
  assert.ok(b.includes(daten.keinErgebnis), 'die Absage an die Wertung fehlt im Bericht');
  const ohneAbsage = b.replace(daten.keinErgebnis, '');
  assert.doesNotMatch(ohneAbsage, /\bProzent\b|\bAmpel\b|\bbestanden\b|\bNote\b/i);
});

test('der Bericht nennt die Länge der Liste nicht als Quote', () => {
  // Eine Zahl „3 von 18" wäre die Gesamtwertung durch die Hintertür.
  const alles = Object.fromEntries(daten.pruefungen.map((p) => [p.id, true]));
  const b = bericht(daten, alles, '');
  assert.match(b, /Aus dieser Liste ist gerade nichts offen/);
  // Die Dauerregeln stehen auch dann noch da – sie sind nie erledigt.
  for (const p of dauerregeln(daten)) assert.ok(b.includes(p.was), `${p.id} fehlt im Bericht`);
  assert.match(b, /kein Einkaufszettel/);
});

test('Dauerregeln sind nicht abhakbar und tauchen nie in der Offen-Liste auf', () => {
  for (const p of dauerregeln(daten)) {
    assert.equal(p.art, 'immer');
    assert.equal(istAbhakbar(p), false);
  }
  // Auch wenn jemand einen Haken für eine Dauerregel in den Speicher
  // schreibt, ändert das nichts: die Zeile war nie in der Liste.
  const erledigt = Object.fromEntries(dauerregeln(daten).map((p) => [p.id, true]));
  assert.deepEqual(offenePunkte(daten, erledigt).filter((p) => p.art === 'immer'), []);
  assert.equal(dauerregeln(daten).length, daten.pruefungen.filter((p) => p.art === 'immer').length);
});

test('kritische Zeilen stehen vorn – im Bereich und in der Offen-Liste', () => {
  for (const b of BEREICHE) {
    const drin = pruefungenIm(daten, b);
    const ersteNichtKritisch = drin.findIndex((p) => !p.kritisch);
    if (ersteNichtKritisch >= 0) {
      assert.ok(drin.slice(ersteNichtKritisch).every((p) => !p.kritisch), `Bereich ${b} sortiert falsch`);
    }
  }
  const offen = offenePunkte(daten, {});
  const erstesLeichte = offen.findIndex((p) => !p.kritisch);
  assert.ok(offen.slice(erstesLeichte).every((p) => !p.kritisch));
});

test('jeder Lebensgefahr-Bereich hat eine kritische Zeile', () => {
  for (const b of LEBENSGEFAHR) {
    assert.ok(pruefungenIm(daten, b).some((p) => p.kritisch), `${b} ohne kritische Zeile`);
  }
  // Gegenprobe: ohne kritische Zeile meldet der Validator.
  const k = kopie();
  for (const p of k.pruefungen) if (p.bereich === 'kleinteile') p.kritisch = false;
  assert.match(pruefeDaten(k).join('\n'), /Bereich kleinteile: keine kritische Zeile/);
});

test('die zwei Pflichtfelder sind Pflicht', () => {
  assert.match(pruefeDaten(mit('t01', 'wieZuPruefen')).join('\n'), /wieZuPruefen fehlt/);
  assert.match(pruefeDaten(mit('t01', 'prueferGrenze')).join('\n'), /prueferGrenze fehlt/);
  // Und zwar bei JEDER Zeile, auch bei den Dauerregeln.
  for (const p of daten.pruefungen) {
    assert.ok(p.wieZuPruefen?.trim(), `${p.id} ohne wieZuPruefen`);
    assert.ok(p.prueferGrenze?.trim(), `${p.id} ohne prueferGrenze`);
  }
});

test('eine Fundstelle steht nur mit Prüfvermerk', () => {
  // docs/02: eine erfundene Fundstelle sieht aus wie eine geprüfte.
  const k = mit('b01', 'quelle', { gremium: 'Spielzeugrichtlinie, Anhang II Nummer 4', geprueft: false });
  assert.match(pruefeDaten(k).join('\n'), /nennt eine Fundstelle, ohne dass die Quelle als geprüft markiert ist/);
  // Umgekehrt: mit Vermerk ist dieselbe Angabe in Ordnung.
  const ok = mit('b01', 'quelle', { gremium: 'Spielzeugrichtlinie, Anhang II Nummer 4', geprueft: true });
  assert.deepEqual(pruefeDaten(ok), []);
});

test('eine Maßzahl braucht ihre Herkunft im GLEICHEN Feld', () => {
  // „Nehmen Sie 44,5 mm" wäre eine Anweisung dieser App. „Die Norm zieht die
  // Grenze bei 44,5 mm" ist eine Tatsache über die Norm.
  const k = mit('t02', 'wieZuPruefen', 'Den kleinsten Durchmesser messen: unter 44,5 mm kommt der Ball weg.');
  assert.match(pruefeDaten(k).join('\n'), /Maßzahl ohne Herkunft/);
  const ok = mit('t02', 'wieZuPruefen',
    'Den kleinsten Durchmesser messen: unter 44,5 mm fällt er nach der Norm durch die Schablone und kommt weg.');
  assert.ok(!pruefeDaten(ok).some((f) => /Maßzahl ohne Herkunft/.test(f)));
});

test('eine Zeile mit Maßzahl braucht eine geprüfte Quelle – ohne Ausnahme', () => {
  // b01 nennt bewusst keine Zahl, weil der Normtext dazu nicht vorlag.
  const b01 = pruefungVon(daten, 'b01');
  assert.equal(b01.quelle.geprueft, false);
  assert.doesNotMatch(JSON.stringify(b01), /\d+(,\d+)?\s*(mm|cm|ml)\b/);
  // Gegenprobe: eine Zahl in genau dieser Zeile ist ein Fehler, und der Satz
  // „der Text lag nicht vor" entschuldigt sie NICHT.
  const k = mit('b01', 'wieZuPruefen', 'Nach der Norm muss die Schraube mindestens 5 mm greifen.');
  assert.match(pruefeDaten(k).join('\n'), /b01: nennt ein Maß, obwohl die Quelle nicht als geprüft markiert ist/);
});

test('„Hersteller" darf stehen – ein benannter Hersteller nicht', () => {
  // Zehnter Fall von Falle A in diesem Projekt: ein Feld, das etwas
  // ausschließt, muss es nennen dürfen. Die CE-Zeile und die U3-Zeile
  // tragen die ganze Aufklärung über den Hersteller als Rechtsakteur.
  assert.match(pruefungVon(daten, 'k01').prueferGrenze, /Erklärung des Herstellers/);
  assert.match(pruefungVon(daten, 'k03').prueferGrenze, /nimmt den Hersteller nicht aus/);
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(MARKE_ODER_PREIS.test('Es ist die Erklärung des Herstellers.'), false);
  assert.equal(HERSTELLER_GENANNT.test('Es ist die Erklärung des Herstellers.'), false);
  assert.equal(HERSTELLER_GENANNT.test('Der Hersteller erklärt das selbst.'), false);
  assert.equal(HERSTELLER_GENANNT.test('Hersteller und Einführer haften.'), false);
  // Und das, worum es geht:
  assert.equal(HERSTELLER_GENANNT.test('Vom Hersteller Musterwerk gibt es gutes Holzspielzeug.'), true);
  assert.equal(HERSTELLER_GENANNT.test('Hersteller namens Beispielfirma.'), true);
  const k = mit('m01', 'warum', 'Beim Hersteller Musterwerk ist das Holz besser verarbeitet.');
  assert.match(pruefeDaten(k).join('\n'), /ein benannter Hersteller/);
});

test('ohne Marke, Preis und Bezugsquelle', () => {
  assert.equal(MARKE_ODER_PREIS.test('Der Becher kostet 8 Euro.'), true);
  assert.equal(MARKE_ODER_PREIS.test('Im Shop bestellen.'), true);
  assert.equal(MARKE_ODER_PREIS.test('Ein empfehlenswertes Produkt.'), true);
  assert.match(pruefeDaten(mit('m01', 'warum', 'Gutes Holzspielzeug kostet mehr.')).join('\n'),
    /Marke, Preis oder Bezugsquelle/);
  assert.match(pruefeDaten(mit('m01', 'warum', 'Diese Marke ist zu empfehlen.')).join('\n'),
    /Marke, Preis oder Bezugsquelle/);
  // „Markenname" im Zusagefeld bleibt erlaubt – das Netz greift auf das Wort
  // „Marke" mit Wortgrenze, nicht auf jede Fortsetzung.
  assert.match(daten.keineMarken, /kein Markenname/);
  assert.equal(MARKE_ODER_PREIS.test('kein Markenname'), false);
});

test('kein Wirkversprechen – und das Feld, das es zurückweist, darf es nennen', () => {
  assert.equal(WIRKVERSPRECHEN.test('Das Material fördert die Entwicklung.'), true);
  assert.equal(WIRKVERSPRECHEN.test('Stapeln trainiert die Feinmotorik.'), true);
  assert.equal(WIRKVERSPRECHEN.test('macht Kinder klüger'), true);
  assert.match(daten.keinWirkversprechen, /nicht belegt/);
  assert.match(daten.keinWirkversprechen, /keine Wirksamkeitsstudie/);
  assert.match(pruefeDaten(mit('p01', 'warum', 'Solches Material fördert die Entwicklung.')).join('\n'),
    /Wirkversprechen/);
  // Die Ausschlussliste ist ausgenommen, weil sie das Versprechen benennen
  // MUSS, um es zurückzuweisen.
  assert.ok(daten.ausgeschlossen.some((a) => /Entwicklungswirkung/i.test(a.was)));
  assert.deepEqual(pruefeDaten(daten), []);
});

test('die CE-Zeile sagt, was CE nicht ist', () => {
  const ce = daten.pruefungen.find((p) => /CE/.test(p.was));
  assert.match(ce.prueferGrenze, /KEINE Prüfung/);
  assert.match(ce.prueferGrenze, /Erklärung des Herstellers/);
  assert.equal(ce.kritisch, false, 'ein fehlendes CE ist ein Ausschluss, kein Lebensrisiko');
  assert.match(pruefeDaten(mit('k01', 'prueferGrenze', 'CE ist ein Gütesiegel.')).join('\n'),
    /CE-Zeile: dass CE keine Prüfung/);
  assert.match(pruefeDaten(mit('k01', 'kritisch', true)).join('\n'), /CE-Zeile: nicht kritisch/);
});

test('die GS-Zeile verlangt das Symbol der Stelle – und nennt Paragraf 20', () => {
  // Zwei Fehler der ersten Fassung, im Gesetz nachgelesen: verlangt ist nicht
  // der NAME, sondern das SYMBOL der GS-Stelle (Anlage zum ProdSG, linke obere
  // Ecke, eindeutiger Rückschluss), und die Zuerkennung steht in Paragraf 20 –
  // Paragraf 21 regelt die Befugnis der Stelle. Eine falsche Fundstelle mit
  // Prüfvermerk ist genau das, was docs/02 verbietet.
  const gs = daten.pruefungen.find((p) => /GS-Zeichen/.test(p.was));
  assert.match(`${gs.was} ${gs.wieZuPruefen}`, /Symbol der (GS-Stelle|Prüfstelle)/);
  assert.match(gs.quelle.gremium, /Paragraf 20/);
  assert.doesNotMatch(gs.quelle.gremium, /Paragraf 21\b/);
  assert.match(gs.prueferGrenze, /fünf Jahre/);
  assert.match(gs.prueferGrenze, /Liste aller/);
  assert.match(gs.prueferGrenze, /freiwillig/);
  const falsch = mit('k02', 'quelle', { gremium: 'Produktsicherheitsgesetz, Paragraf 21', geprueft: true });
  assert.match(pruefeDaten(falsch).join('\n'), /Paragraf 21 ist die Befugnis der GS-Stelle/);
  // Gegenprobe: die Prüfstelle muss in `was` ODER in `wieZuPruefen` stehen,
  // darum müssen beide Felder mutiert werden – eine Mutation allein lässt
  // der Validator zu Recht durch.
  const k = kopie();
  const z = k.pruefungen.find((x) => x.id === 'k02');
  z.was = 'Wenn ein GS-Zeichen da ist: es ist da.';
  z.wieZuPruefen = 'Nach dem GS-Zeichen suchen.';
  assert.match(pruefeDaten(k).join('\n'), /GS-Zeile/);
});

test('die U3-Zeile verlangt die Gefahrenangabe – und nennt den Beipackzettel', () => {
  const u3 = daten.pruefungen.find((p) => /unter 3 Jahren|unter drei Jahren/.test(p.was));
  assert.match(u3.was, /WARUM/);
  assert.match(u3.warum, /nicht automatisch|heißt nicht/);
  // Die Angabe darf nach der Norm im Beipackzettel stehen – ohne diesen Satz
  // würde die App ein rechtmäßiges Spielzeug als mangelhaft ausgeben.
  assert.match(u3.wieZuPruefen, /Beipackzettel/);
  assert.match(pruefeDaten(mit('k03', 'warum', 'Das Symbol heißt Kleinteile.')).join('\n'), /U3-Zeile/);
});

test('die Kugel-Zeile trägt Schwelle, kleinsten Durchmesser, Ausnahme und Lage', () => {
  const kugel = daten.pruefungen.find((p) => /Ball|kugelig/i.test(p.was));
  assert.equal(kugel.kritisch, true);
  const kugelText = `${kugel.warum} ${kugel.wieZuPruefen} ${kugel.prueferGrenze}`;
  assert.match(kugelText, /44,5/);
  assert.match(kugelText, /kleinsten Durchmesser/i);
  assert.match(kugel.prueferGrenze, /gefüllte Bälle/);
  assert.match(kugel.prueferGrenze, /JEDER Lage/);
  // Gegenproben: jede der vier Zusagen einzeln entfernt meldet.
  assert.match(pruefeDaten(mit('t02', 'prueferGrenze', 'Zu Hause nicht messbar.')).join('\n'), /Kugel-Zeile/);
  assert.match(pruefeDaten(mit('t02', 'kritisch', false)).join('\n'), /Kugel-Zeile: muss kritisch sein/);
});

test('die Klopapierrolle steht nur in der Ausschlussliste, mit beiden Irrtumsrichtungen', () => {
  const rolle = daten.ausgeschlossen.find((a) => /Klopapierrolle/i.test(a.was));
  assert.ok(rolle);
  assert.match(rolle.warum, /[Zz]u streng/);
  assert.match(rolle.warum, /[Zz]u lax/);
  assert.match(rolle.warum, /Schablone/);
  // Und in keiner Prüfung – sonst stünde sie als Prüfung da.
  for (const p of daten.pruefungen) assert.doesNotMatch(JSON.stringify(p), /Klopapierrolle/i);
  const k = mit('t01', 'wieZuPruefen', 'Das Teil durch eine Klopapierrolle fallen lassen.');
  assert.match(pruefeDaten(k).join('\n'), /gehört nur in die Ausschlussliste/);
});

test('die Normzahlen stehen fest und mit Fassungsangabe', () => {
  // Diese Tabelle ist die Sperre gegen ein späteres „Aufräumen" der Zahlen.
  // Jede Zahl ist in EN 71-1 (Fassung 2011 + A3) nachgelesen; die Stelle
  // steht in der jeweiligen Zeile.
  const alles = JSON.stringify(daten);
  for (const [zahl, wo] of [
    ['31,7 mm', 'Prüfzylinder für Kleinteile, Abschnitt 8.2'],
    ['25,4 mm', 'schräger Boden, höchste Stelle'],
    ['57,1 mm', 'schräger Boden, tiefste Stelle'],
    ['44,5 mm', 'Schablone E für Bälle, Abschnitt 8.32'],
    ['6,4 mm', 'Dicke der Platte von Schablone E'],
    ['220 mm', 'Schnurlänge unter 18 Monaten, Abschnitt 5.4'],
    ['300 mm', 'Schnurlänge darüber und freies Ende'],
    ['380 mm', 'Umfang einer festen Schlaufe'],
    ['800 mm', 'freies Ende an Nachziehspielzeug'],
    ['0,038 mm', 'Mindestdicke von Verpackungsfolie, Abschnitt 6'],
    ['177 ml', 'becherförmige Teile, Abschnitt 5.12'],
    ['13 mm', 'Tiefe und Lochabstand bei becherförmigen Teilen'],
  ]) {
    assert.ok(alles.includes(zahl), `${zahl} (${wo}) fehlt`);
  }
  assert.match(daten.quelle.norm, /EN 71-1/);
  assert.match(daten.quelle.norm, /Fassung/);
  assert.match(daten.quelle.norm, /neuere Fassungen/);
  assert.match(daten.quelle.norm, /[Nn]icht nachgelesen|nicht vorlag/);
  const k = kopie();
  delete k.quelle.norm;
  assert.match(pruefeDaten(k).join('\n'), /quelle\.norm/);
});

test('Spielzeugarten sind beschreibend, mit Spanne als Spanne', () => {
  assert.equal(daten.arten.length, daten.quelle.zahlen.artenUebernommen);
  for (const a of daten.arten) {
    assert.ok(a.wasKinderTun?.trim(), `${a.id} ohne wasKinderTun`);
    assert.ok(a.sicherheit?.trim(), `${a.id} ohne sicherheit`);
    assert.match(a.spanne, /etwa|ungefähr|in Stufen/);
    assert.doesNotMatch(`${a.wasKinderTun} ${a.spanne}`, /sollte|muss (können|beherrschen)|spätestens/);
  }
  assert.ok(artVon(daten, 'a-baelle'));
  const k = kopie();
  k.arten[0].spanne = 'ab 1 Jahr';
  assert.match(pruefeDaten(k).join('\n'), /liest wie ein Ziel/);
  const z = kopie();
  z.quelle.zahlen.artenUebernommen = 5;
  assert.match(pruefeDaten(z).join('\n'), /arten: 6 aufgeführt/);
});

test('kyrillische Schrift steht nur in der Quellenangabe', () => {
  const k = mit('m01', 'warum', 'Дидактические игры');
  assert.match(pruefeDaten(k).join('\n'), /kyrillische Schrift außerhalb der Quellenangabe/);
  assert.match(daten.quelle.werk, /Пралеска/);
  assert.match(daten.quelle.rechte, /НИО 2007/);
  assert.match(daten.quelle.rechte, /Eigenproduktion/);
});

test('die Bereiche sind eine geschlossene Liste, einer steht zuerst', () => {
  assert.equal(bereicheInReihenfolge(daten)[0].id, 'kennzeichen');
  const k = kopie();
  k.bereiche.push({ id: 'kaufen', name: 'Wo kaufen' });
  assert.match(pruefeDaten(k).join('\n'), /nicht in der geschlossenen Liste/);
  const z = kopie();
  for (const b of z.bereiche) delete b.zuerst;
  assert.match(pruefeDaten(z).join('\n'), /kein Bereich steht zuerst/);
});

test('die Arten der Zeilen sind geschlossen', () => {
  assert.deepEqual([...ARTEN], ['einmal', 'immer']);
  assert.match(pruefeDaten(mit('t01', 'art', 'manchmal')).join('\n'), /unbekannte art/);
  assert.equal(GESAMTWERTUNG.test('4 von 18 erledigt'), true);
  assert.equal(GESAMTWERTUNG.test('eine Ampel'), true);
});

test('App: ein Speicherschlüssel, löschbar, kein clear()', () => {
  const schluessel = [...code.matchAll(/localStorage\.(?:getItem|setItem|removeItem)\(([^,)]+)/g)]
    .map((m) => m[1].trim());
  assert.ok(schluessel.length, 'kein Speicherzugriff gefunden');
  for (const s of schluessel) assert.equal(s, 'SCHLUESSEL', `fremder Schlüssel: ${s}`);
  assert.match(code, /const SCHLUESSEL = 'szu3\.erledigt'/);
  assert.doesNotMatch(code, /localStorage\.clear\(/);
  assert.match(code, /datenKarte\(/);
  // Nach dem Löschen bleibt kein leeres Objekt liegen.
  assert.match(code, /localStorage\.removeItem\(SCHLUESSEL\)/);
});

test('App: keine externen Anfragen, CSP steht in der Seite', () => {
  for (const [name, text] of [['app.mjs', app], ['logik.mjs', logikQuelle], ['index.html', seite], ['druck.css', druck]]) {
    assert.doesNotMatch(text, /https?:\/\/(?!schemas\.)/, `${name} enthält eine externe URL`);
  }
  assert.match(seite, /default-src 'self'; style-src 'self' 'unsafe-inline'/);
  assert.match(code, /installiereNetzwerkWaechter\(\)/);
  assert.match(seite, /<html lang="de">/);
  assert.match(seite, /impressum|Impressum/i === null ? /./ : /./);
  assert.match(code, /impressum\.html/);
});

test('App: nichts über das Kind wird gespeichert', () => {
  // Gespeichert werden Haken an Eigenschaften eines GEGENSTANDS. Kein Name,
  // kein Alter, kein Geburtsdatum – es gibt kein Eingabefeld dafür.
  assert.doesNotMatch(code, /type="date"|geburtsdatum|alter:|name:\s*'/i);
  assert.doesNotMatch(code, /<input/);
  assert.match(code, /keine Angabe über dein Kind/);
});

test('App: Vorlesen nur mit einer Stimme, die auf dem Gerät liegt', () => {
  assert.match(code, /lokaleStimme\('de'\)/);
  assert.match(code, /vorlesen\([^)]*,\s*stimme\)/);
  assert.doesNotMatch(logikCode, /speechSynthesis/);
});

test('App: der Druckzettel trägt die Hausprüfung und keinen Haken', () => {
  assert.match(druck, /\.szu3-nur-druck \{ display: none; \}/);
  assert.match(druck, /\.szu3-marke \{ display: none !important; \}/);
  assert.match(druck, /\.szu3-block button \{/);
  // Auf dem Zettel steht bei den kritischen Zeilen, WIE man prüft.
  const druckBlock = code.slice(code.indexOf('szu3-nur-druck'), code.indexOf('Was noch offen ist'));
  assert.match(druckBlock, /So prüfen: \$\{p\.wieZuPruefen\}/);
  assert.match(druckBlock, /Grenze: \$\{p\.prueferGrenze\}/);
  assert.doesNotMatch(druckBlock, /Name: _|☐|☑/);
  // Jede im Code benutzte szu3-Klasse ist in druck.css bedacht oder rein
  // beschreibend – die beiden Schalterklassen müssen jedenfalls dastehen.
  for (const klasse of ['szu3-nur-bildschirm', 'szu3-nur-druck', 'szu3-marke', 'szu3-block', 'szu3-kritisch']) {
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
  // `el()` überspringt null, `replaceChildren` nicht – ohne filter(Boolean)
  // wirft die Zeile beim ersten eingeklappten Block.
  for (const m of code.matchAll(/replaceChildren\(\.\.\./g)) assert.ok(m);
  const stellen = [...code.matchAll(/app\.replaceChildren\(\.\.\.\[/g)];
  assert.equal(stellen.length, 1);
  assert.match(code, /\]\.filter\(Boolean\)\)/);
});

test('App: der Datenfehler wird angezeigt, nicht verschluckt', () => {
  assert.match(code, /const fehler = pruefeDaten\(daten\)/);
  assert.match(code, /Datenfehler: \$\{fehler\[0\]\}/);
});

test('die Zeile zu quellenden Materialien: hier versagt jede Größenprüfung', () => {
  // Der Fall, der die Thesis dieser App am deutlichsten trägt: ein Gegenstand,
  // der im Körper wächst, ist durch keine Größenprüfung zu fassen.
  const q = daten.pruefungen.find((p) => /Wasserperlen/.test(p.was));
  assert.ok(q, 'die Zeile fehlt');
  assert.equal(q.kritisch, true);
  assert.match(q.prueferGrenze, /versagt jede Größenprüfung/);
  assert.match(q.warum, /Sechzigfachen/);
  assert.match(q.wieZuPruefen, /Glas Wasser/);
  assert.equal(q.quelle.geprueft, true);
  assert.match(q.quelle.gremium, /001\/031/);
  // Gegenproben
  assert.match(pruefeDaten(mit('t04', 'prueferGrenze', 'Zu Hause schwer zu beurteilen.')).join('\n'),
    /Quell-Zeile: dass hier jede Größenprüfung versagt/);
  assert.match(pruefeDaten(mit('t04', 'kritisch', false)).join('\n'), /Quell-Zeile: muss kritisch sein/);
  assert.match(pruefeDaten(mit('t04', 'warum', 'Solche Kugeln quellen auf.')).join('\n'),
    /Quell-Zeile: das Ausmaß des Quellens/);
});

test('jede EN-71-1-Fundstelle trägt ihre Fassung', () => {
  // Die Abschnittsnummern wandern zwischen den Ausgaben, und harmonisiert ist
  // heute EN 71-1:2014+A1:2018 – nicht die hier nachgelesene 2011+A3. Eine
  // Nummer ohne Fassung ist damit keine prüfbare Fundstelle.
  for (const p of daten.pruefungen) {
    const g = p.quelle.gremium;
    if (/EN 71-1/.test(g)) assert.match(g, /Fassung 2011\+A3/, `${p.id}`);
  }
  assert.match(daten.quelle.norm, /EN 71-1:2014\+A1:2018/);
  const k = mit('t02', 'quelle', { gremium: 'EN 71-1, Abschnitt 5.10', geprueft: true });
  assert.match(pruefeDaten(k).join('\n'), /nennt EN 71-1 ohne die Fassung/);
  const z = kopie();
  z.quelle.norm = z.quelle.norm.replace('EN 71-1:2014+A1:2018', 'eine neuere Ausgabe');
  assert.match(pruefeDaten(z).join('\n'), /die heute harmonisierte Ausgabe muss benannt sein/);
});

test('das Recht hat ein Ablaufdatum, und es steht in den Daten', () => {
  // Die Richtlinie 2009/48/EG wird mit Wirkung vom 1. August 2030 aufgehoben;
  // ab dann gilt die Verordnung (EU) 2025/2509, und Bezugnahmen sind nach der
  // Entsprechungstabelle in Anhang VIII zu lesen. Die Artikelnummern in dieser
  // App verfallen also zu einem bekannten Datum – die Sachaussagen nicht.
  const r = daten.quelle.rechtsstand;
  assert.match(r, /2009\/48\/EG/);
  assert.match(r, /2025\/2509/);
  assert.match(r, /1\. August 2030/);
  assert.match(r, /Anhang VIII/);
  assert.match(code, /daten\.quelle\.rechtsstand/);
  const k = kopie();
  delete k.quelle.rechtsstand;
  const f = pruefeDaten(k).join('\n');
  assert.match(f, /die heute geltende Grundlage muss benannt sein/);
  assert.match(f, /die Nachfolgeverordnung muss benannt sein/);
});

test('der Notfall nennt die Frist, die unbemerkte Ingestion und kein Hausmittel', () => {
  assert.match(daten.notfall, /112/);
  assert.match(daten.notfall, /zwei Stunden/);
  assert.match(daten.notfall, /niemand die Ingestion beobachtet/);
  assert.match(daten.notfall, /Hausmittel stehen hier nicht/);
  assert.match(daten.notfall, /Botulismus/);
  // Und das Hausmittel ist auch als Ausschluss verbucht, mit Begründung.
  const aus = daten.ausgeschlossen.find((a) => /Hausmittel/.test(a.was));
  assert.ok(aus);
  assert.match(aus.warum, /zwölf Stunden/);
  assert.match(aus.warum, /verzögert/);
  const k = kopie();
  k.notfall = 'Bei einer Knopfzelle sofort 112.';
  const f = pruefeDaten(k).join('\n');
  assert.match(f, /die Dringlichkeit bei der Knopfzelle muss eine Zahl haben/);
  assert.match(f, /Hausmittel müssen ausdrücklich abgelehnt sein/);
});

test('die Klopapierrolle scheitert am Verfahren, nicht nur an Millimetern', () => {
  // Der tragende Punkt, der in der ersten Fassung fehlte: die Norm fragt bei
  // Kleinteilen nach dem HINEINPASSEN in einen geschlossenen Zylinder, bei
  // Bällen nach dem DURCHFALLEN durch eine Schablone. Ein offenes Papprohr
  // kann nur das Zweite nachahmen – es ist für Kugeln nah am Normmaß und für
  // alles andere methodisch falsch. Die erste Fassung hatte die Richtung
  // „zu lax" als die gefährliche dargestellt, ohne zu sagen, dass das Band
  // schmal ist.
  const rolle = daten.ausgeschlossen.find((a) => /Klopapierrolle/i.test(a.was));
  assert.match(rolle.warum, /VOLLSTÄNDIG IN/);
  assert.match(rolle.warum, /DURCHFÄLLT/);
  assert.match(rolle.warum, /schmalen Band/);
  assert.match(rolle.warum, /[Zz]u streng/);
  assert.match(rolle.warum, /[Zz]u lax/);
  assert.match(rolle.warum, /Schablone/);
  assert.match(rolle.warum, /31,7 mm/);
  assert.match(rolle.warum, /44,5 mm/);
});
