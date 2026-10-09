import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  ACHSEN, EINORDNUNGEN, ZIELE, NICHT_GEPRUEFT, ABFRAGE, PRUEFURTEIL, DEUTUNG, EINSTUFUNG,
  WIRKVERSPRECHEN, VORGABE, ALTERSSTUFUNG, PREIS, MARKE_ODER_QUELLE, WERK_ODER_URHEBER,
  achseVon, gegenstandVon, zielVon, zielSchluessel, angebotsTexte, alleImpulse,
  blatt, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/achsen.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const logikQuelle = await readFile(new URL('../logik.mjs', import.meta.url), 'utf8');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Daten sind gültig und vollständig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.achsen.length, 5);
  assert.equal(daten.gegenstaende.length, 5);
  assert.equal(daten.regeln.length, 3);
  assert.equal(daten.ziele.length, ZIELE.allgemein + ZIELE.wahrnehmung);
  for (const id of ACHSEN) assert.ok(achseVon(daten, id), `Achse ${id} fehlt`);
});

test('die Achsen stehen in der Reihenfolge der Quelle', () => {
  // Farbe, Form der Hauptteile, Einzelheiten, Material, Klang - und das ist
  // auch die Reihenfolge, in der ein kleines Kind hinschaut.
  assert.deepEqual(daten.achsen.map((a) => a.id), ['a-farbe', 'a-form', 'a-teile', 'a-material', 'a-klang']);
  const vertauscht = kopie();
  [vertauscht.achsen[0], vertauscht.achsen[4]] = [vertauscht.achsen[4], vertauscht.achsen[0]];
  assert.ok(pruefeDaten(vertauscht).some((f) => /Reihenfolge/.test(f)));
});

test('die Bilanz der 13 Quellziele geht auf', () => {
  // Der Katalogeintrag nennt „13 Ziele". Nachgezählt im Original: 7 allgemeine
  // (S. 88) und 6 zur Kunstwahrnehmung (S. 89). Jedes hat genau eine
  // Einordnung, und die Summe muss stimmen - sonst wäre die Abweichungsnotiz
  // eine Behauptung über die eigenen Daten.
  const nach = {};
  for (const e of EINORDNUNGEN) nach[e] = daten.ziele.filter((z) => z.einordnung === e).length;
  assert.deepEqual(nach, { gebaut: 5, alsGanzes: 2, ausgeschlossen: 1, anderesThema: 5 });
  assert.equal(Object.values(nach).reduce((a, b) => a + b, 0), 13);
  assert.equal(daten.ziele.filter((z) => z.gruppe === 'allgemein').length, 7);
  assert.equal(daten.ziele.filter((z) => z.gruppe === 'wahrnehmung').length, 6);
});

test('jedes gebaute Ziel hat sein Stück, und jedes Stück sein Ziel', () => {
  for (const z of daten.ziele.filter((x) => x.einordnung === 'gebaut')) {
    assert.ok(z.belegtDurch.length, `${zielSchluessel(z)} ohne Stück`);
    for (const id of z.belegtDurch) {
      const stueck = achseVon(daten, id) ?? gegenstandVon(daten, id) ?? daten.regeln.find((r) => r.id === id);
      assert.ok(stueck, `${id} gibt es nicht`);
      assert.equal(stueck.quellZiel, z.nr);
    }
  }
  // Gegenprobe in beide Richtungen.
  const ohneStueck = kopie();
  ohneStueck.ziele.find((z) => zielSchluessel(z) === 'wahrnehmung-1').belegtDurch = [];
  assert.ok(pruefeDaten(ohneStueck).some((f) => /belegtDurch ist leer/.test(f)));

  const falschesZiel = kopie();
  falschesZiel.regeln.find((r) => r.id === 'r-aufhoeren').quellZiel = 3;
  const f2 = pruefeDaten(falschesZiel);
  assert.ok(f2.some((f) => /zeigt auf Ziel 3/.test(f)), f2.join(' | '));

  const erfunden = kopie();
  erfunden.ziele.find((z) => zielSchluessel(z) === 'wahrnehmung-4').belegtDurch = ['r-gibtsnicht'];
  assert.ok(pruefeDaten(erfunden).some((f) => /r-gibtsnicht/.test(f)));
});

test('ein fehlendes Ziel fällt auf, auch wenn die Zahl noch stimmt', () => {
  // Der Fehler, den Welle 80 zweimal gemacht hat: die Notiz sagt eine Zahl,
  // die Daten tragen eine andere. Hier wird ein Ziel durch ein erfundenes
  // ersetzt - die Gesamtzahl bleibt 13, die Lücke fällt trotzdem auf.
  const k = kopie();
  k.ziele.find((z) => zielSchluessel(z) === 'allgemein-3').nr = 9;
  const f = pruefeDaten(k);
  assert.ok(f.some((x) => /allgemeines Ziel 3 fehlt/.test(x)), f.join(' | '));
});

test('die Abweichungsnotiz darf nicht von den Daten abdriften', () => {
  const k = kopie();
  // Ein Ziel umgeordnet: 6 gebaut, 4 anderes Thema - die Notiz sagt weiter 5/5.
  const z = k.ziele.find((x) => zielSchluessel(x) === 'allgemein-5');
  z.einordnung = 'gebaut';
  z.belegtDurch = ['r-aufhoeren'];
  const f = pruefeDaten(k);
  assert.ok(f.some((x) => /abweichung nennt die Zahl 6 nicht/.test(x)), f.join(' | '));
});

test('das zurückgewiesene Ziel muss benennen, was es zurückweist', () => {
  const z = daten.ziele.find((x) => x.einordnung === 'ausgeschlossen');
  assert.equal(zielSchluessel(z), 'allgemein-6');
  // Das Netz läuft hier in der GEGENRICHTUNG: der Text MUSS die Deutung
  // nennen. Eine Zurückweisung, die das Zurückgewiesene nicht benennt, ist
  // keine - sie ist ein leeres Versprechen.
  assert.ok(DEUTUNG.test(z.kurz));
  const verharmlost = kopie();
  verharmlost.ziele.find((x) => x.einordnung === 'ausgeschlossen').kurz = 'Kunst für die Arbeit mit Kindern nutzen';
  assert.ok(pruefeDaten(verharmlost).some((f) => /benennt die Deutung nicht/.test(f)));
  assert.ok(DEUTUNG.test(daten.keinDeuten));
  assert.ok(DEUTUNG.test(daten.ausgeschlossen[0].warum));
});

test('kein Angebotstext deutet das Kind oder stuft es ein', () => {
  for (const [wo, text] of angebotsTexte(daten)) {
    assert.ok(!DEUTUNG.test(text), `${wo} deutet: ${text}`);
    assert.ok(!EINSTUFUNG.test(text), `${wo} stuft ein: ${text}`);
    assert.ok(!WIRKVERSPRECHEN.test(text), `${wo} verspricht: ${text}`);
    assert.ok(!VORGABE.test(text), `${wo} gibt vor: ${text}`);
    assert.ok(!ALTERSSTUFUNG.test(text), `${wo} stuft nach Alter: ${text}`);
    assert.ok(!PREIS.test(text), `${wo} nennt einen Preis: ${text}`);
    assert.ok(!MARKE_ODER_QUELLE.test(text), `${wo} nennt Marke/Quelle: ${text}`);
    assert.ok(!WERK_ODER_URHEBER.test(text), `${wo} nennt ein Werk: ${text}`);
    assert.ok(!/[Ѐ-ӿ]/.test(text), `${wo} ist kyrillisch: ${text}`);
  }
  // Die Netze greifen auch wirklich.
  for (const [satz, netz, name] of [
    ['Was ein Kind malt, lässt die innere Welt erkennen.', DEUTUNG, 'DEUTUNG'],
    ['Daran können Sie herauslesen, wie es dem Kind geht.', DEUTUNG, 'DEUTUNG (Konstruktion)'],
    ['Ein besonders begabtes Kind sieht mehr.', EINSTUFUNG, 'EINSTUFUNG'],
    ['Für begabte Kinder gibt es eine zweite Achse.', EINSTUFUNG, 'EINSTUFUNG (flektiert)'],
    ['Das fördert die Wahrnehmung Ihres Kindes.', WIRKVERSPRECHEN, 'WIRKVERSPRECHEN'],
    ['Schauen Sie täglich mindestens 10 Minuten zusammen.', VORGABE, 'VORGABE'],
    ['Diese Achse passt ab 18 Monaten.', ALTERSSTUFUNG, 'ALTERSSTUFUNG'],
    ['Eine Holzfigur kostet etwa 12,90 Euro.', PREIS, 'PREIS'],
    ['Erhältlich bei der Holzkunst GmbH.', MARKE_ODER_QUELLE, 'MARKE'],
    ['Nehmen Sie „Die Wolke" von Petersen.', WERK_ODER_URHEBER, 'WERK'],
    ['Illustrationen von Berger sind besonders klar.', WERK_ODER_URHEBER, 'WERK (Illustrator)'],
  ]) {
    assert.ok(netz.test(satz), `${name} greift nicht: ${satz}`);
  }
  // Und sie dürfen das Richtige NICHT greifen - Falle A, achtzehntes Mal.
  assert.ok(!DEUTUNG.test('Woran Sie erkennen, dass es gerade passt: Ihr Kind schaut noch hin.'));
  assert.ok(!PREIS.test('Kostet nichts und liegt schon da.'));
  assert.ok(!PREIS.test('In der Bibliothek, kostenlos und oft mit Krabbelecke.'));
  assert.ok(!MARKE_ODER_QUELLE.test('Im eigenen Schrank, auf dem Flohmarkt, in der Weihnachtskiste.'));
  assert.ok(!EINSTUFUNG.test('Das Gelb ist hell. Das daneben ist auch gelb, aber dunkler.'));
  assert.ok(!WERK_ODER_URHEBER.test('Die Quelle nennt bemalte Holzfiguren als Volkskunst.'));
});

test('kein Impuls ist eine Prüffrage', () => {
  // Die tragende Entscheidung dieser App. „Welche Farbe ist das?" ist eine
  // Prüfung mit bekannter Antwort; ein Kind, das die Antwort nicht hat, hat
  // verloren. Die Impulse sind Feststellungen.
  const impulse = alleImpulse(daten);
  assert.equal(impulse.length, 15);
  for (const [wo, text] of impulse) {
    assert.ok(!ABFRAGE.test(text), `${wo} fragt ab: ${text}`);
    assert.ok(!PRUEFURTEIL.test(text), `${wo} urteilt: ${text}`);
    assert.ok(!text.includes('?'), `${wo} enthält ein Fragezeichen`);
  }
  for (const satz of ['Welche Farbe ist das?', 'Wie viele Hasen sind da?', 'Zeig mir den Hund.',
    'Wie heißt das hier?', 'Weißt du, was das ist?']) {
    assert.ok(ABFRAGE.test(satz), `ABFRAGE greift nicht: ${satz}`);
  }
  for (const satz of ['Richtig, das ist rot.', 'Nein, das stimmt nicht.', 'Prima gemacht!']) {
    assert.ok(PRUEFURTEIL.test(satz), `PRUEFURTEIL greift nicht: ${satz}`);
  }
  // Gegenprobe über den Validator.
  const k = kopie();
  k.achsen[0].impulse[0] = 'Welche Farbe ist das denn hier?';
  assert.ok(pruefeDaten(k).some((f) => /als Frage gebaut/.test(f)));
  const k2 = kopie();
  k2.achsen[0].impulse[1] = 'Genau so, das ist richtig.';
  assert.ok(pruefeDaten(k2).some((f) => /urteilt/.test(f)));
  // Aber `keinAbfragen` MUSS die Prüffrage zeigen dürfen.
  assert.ok(ABFRAGE.test(daten.keinAbfragen));
  const ohneBeispiel = kopie();
  ohneBeispiel.keinAbfragen = 'Hier wird nichts abgefragt.';
  assert.ok(pruefeDaten(ohneBeispiel).some((f) => /keine Prüffrage/.test(f)));
});

test('jeder Gegenstand sagt, wo er ohne Geld zu finden ist', () => {
  for (const g of daten.gegenstaende) {
    assert.ok(g.woGefunden.length > 20, `${g.id}: woGefunden zu knapp`);
    assert.ok(g.grenze.length > 20, `${g.id}: grenze zu knapp`);
  }
  const k = kopie();
  delete k.gegenstaende[0].woGefunden;
  assert.ok(pruefeDaten(k).some((f) => /ohne Geld/.test(f)));
  const k2 = kopie();
  delete k2.gegenstaende[2].grenze;
  assert.ok(pruefeDaten(k2).some((f) => /In-den-Mund-Nehmen/.test(f)));
});

test('jede Achse ist bei mindestens einem Gegenstand stark', () => {
  // Sonst stünde eine Achse im Nichts: fünf Achsen, aber keine Gelegenheit,
  // bei der der Klang oder das Material wirklich etwas hergibt.
  const gezaehlt = Object.fromEntries(ACHSEN.map((id) => [id, 0]));
  for (const g of daten.gegenstaende) for (const id of g.starkeAchsen) gezaehlt[id] += 1;
  for (const id of ACHSEN) assert.ok(gezaehlt[id] > 0, `${id} ist nirgends stark`);
  const k = kopie();
  for (const g of k.gegenstaende) g.starkeAchsen = g.starkeAchsen.filter((x) => x !== 'a-klang');
  const f = pruefeDaten(k);
  assert.ok(f.some((x) => /a-klang ist bei keinem Gegenstand/.test(x)), f.join(' | '));
});

test('das Blatt trägt alle fünf Achsen, auch die schwachen', () => {
  for (const g of daten.gegenstaende) {
    const b = blatt(daten, g.id);
    assert.equal(b.achsen.length, 5);
    assert.deepEqual(b.achsen.map((a) => a.id), ACHSEN);
    assert.equal(b.achsen.filter((a) => a.stark).length, g.starkeAchsen.length);
    assert.equal(b.regeln.length, 3);
    assert.ok(b.titel.includes(g.name));
    assert.ok(b.sicherheit.length > 50);
  }
  assert.equal(blatt(daten, 'gibt-es-nicht'), null);
});

test('die Netze decken JEDEN gerenderten Text ab, Ausnahmen sind benannt', () => {
  // Review Welle 81: die erste Fassung zählte auf, was geprüft WIRD, und
  // vergaß sechs gerenderte Elterntexte – darunter `sicherheit`, der auf dem
  // Druckblatt steht. Jetzt ist es der Rest: alle Zeichenketten minus eine
  // benannte Ausnahmeliste. Eine vergessene Lücke sieht sonst aus wie eine
  // gewollte.
  const geprueft = new Set(angebotsTexte(daten).map(([wo]) => wo.split(/[.[]/)[0]));
  for (const feld of Object.keys(daten)) {
    assert.ok(geprueft.has(feld) || feld in NICHT_GEPRUEFT,
      `${feld} wird weder geprüft noch als Ausnahme benannt`);
  }
  // Jede Ausnahme braucht einen Grund und muss es wirklich geben.
  for (const [feld, grund] of Object.entries(NICHT_GEPRUEFT)) {
    assert.ok(feld in daten, `Ausnahme ${feld} gibt es in den Daten nicht`);
    assert.ok(grund.length > 10, `Ausnahme ${feld} ohne Grund`);
  }
  const k = kopie();
  delete k.fuenfteilung;
  assert.ok(pruefeDaten(k).some((f) => /NICHT_GEPRUEFT nennt fuenfteilung/.test(f)));
  // Und die neu abgedeckten Felder laufen wirklich durch die Netze.
  const k2 = kopie();
  k2.sicherheit = `${k2.sicherheit} Ein begabtes Kind braucht das nicht.`;
  assert.ok(pruefeDaten(k2).some((f) => /sicherheit: stuft ein Kind ein/.test(f)));
});

test('die Netze treffen die Konstruktion, nicht das harmlose Wort', () => {
  // Drei Fehlalarme, die beim Review gefunden wurden oder beim Fixen
  // entstanden wären – jeder hätte die ganze App auf „Datenfehler" gesetzt.
  assert.ok(!WERK_ODER_URHEBER.test('Nehmen Sie z. B. Holzfiguren.'), 'z. B. ist kein Urheber');
  assert.ok(!WERK_ODER_URHEBER.test('u. a. Tonware aus der Küche'));
  assert.ok(WERK_ODER_URHEBER.test('Bilder von W. Sutejew'), 'eine echte Initiale muss hängen bleiben');
  assert.ok(!EINSTUFUNG.test('zuerst das Auffällige, das Kleine erst beim zweiten Mal'), 'das Bild ist auffällig, nicht das Kind');
  assert.ok(EINSTUFUNG.test('Das Kind wirkt auffällig.'));
  assert.ok(EINSTUFUNG.test('ein entwicklungsauffälliges Kind'));
  // PRUEFURTEIL traf nur die Grundform – „die richtige Antwort" lief durch.
  for (const satz of ['Das war die richtige Antwort.', 'Das ist eine falsche Farbe.', 'Richtig!', 'Brave Antwort.']) {
    assert.ok(PRUEFURTEIL.test(satz), `PRUEFURTEIL greift nicht: ${satz}`);
  }
  assert.ok(!PRUEFURTEIL.test('Hier ist alles rot – und da hinten ein kleines Stück Blau.'));
});

test('die Seitenangaben der Unterabschnitte stimmen', () => {
  // Review Welle 81: zwei der drei Angaben waren falsch. Am PDF Seite für
  // Seite nachgelesen: «Рисование» beginnt auf S. 89 und läuft bis S. 91,
  // «Лепка» S. 91–92, «Аппликация» S. 92–93; S. 90 trägt gar keine
  // Überschrift. Der Validator prüft nur die NAMEN, darum hier die Zahlen.
  for (const stelle of ['«Рисование» S. 89–91', '«Лепка» S. 91–92', '«Аппликация» S. 92–93']) {
    assert.ok(daten.anderesThema.includes(stelle), `fehlt: ${stelle}`);
  }
  assert.ok(!/S\. 89–90|«Лепка» S\. 90/.test(daten.anderesThema), 'die alte, falsche Angabe ist zurück');
});

test('die verlinkte Abfrage-App ist mit ihrer eigenen Zielgruppe genannt', () => {
  // Der Kunst-Entdecker sagt über sich „5–7 in Ko-Nutzung, Ausbau 8–12".
  // „für Schulkinder" legt ihn drei Jahre zu spät weg.
  assert.ok(!/für Schulkinder/.test(JSON.stringify(daten)), '„für Schulkinder" ist zurück');
  assert.ok(!/Schulkindern/.test(code));
  assert.match(daten.keinAbfragen, /fängt bei fünf an/);
});

test('die Fünfteilung ist als eigene Gliederung ausgewiesen, nicht als Wortlaut', () => {
  // Beim Bau nachgelesen: in der Quelle steht «цвет, форму основных частей,
  // деталей, материал, звук». „деталей" ist Genitiv und hängt an „форму" -
  // grammatisch sind es VIER Mittel, nicht fünf. Die erste Fassung dieser
  // Daten behauptete, die fünf Achsen stünden „wörtlich" in der Quelle. Das
  // war falsch und ist jetzt ausgewiesen.
  assert.ok(/vier Mittel/.test(daten.fuenfteilung));
  assert.ok(/Gliederung dieser App/.test(daten.fuenfteilung));
  assert.ok(!/wörtlich/.test(daten.quelle.nachgezaehlt));
  assert.ok(!/fünf Mittel/.test(daten.quelle.rechte));
  // Und die Quellenseiten sind gelesen, nicht vermutet.
  assert.equal(daten.quelle.geprueft, true);
  assert.ok(/88/.test(daten.quelle.werk) && /89/.test(daten.quelle.werk));
});

test('die fünf Ziele des eigenen Tuns nennen den Unterabschnitt der Quelle', () => {
  assert.ok(/Рисование/.test(daten.anderesThema));
  const k = kopie();
  k.anderesThema = 'Das eigene Malen und Kneten steht hier nicht.';
  assert.ok(pruefeDaten(k).some((f) => /nennt keinen der Unterabschnitte/.test(f)));
});

test('keine Buchliste, kein Werk, keine Organisation', () => {
  const nummern = daten.ausgeschlossen.map((x) => x.quellNr);
  assert.deepEqual(nummern, ['x01', 'x02', 'x03', 'x04', 'x05', 'x06', 'x07', 'x08']);
  // Der Katalogeintrag wollte vier Dinge, die hier nicht gebaut sind: eine
  // kuratierte Buchliste, benannte Werke, den Verweis auf eine Organisation
  // und uk/ru-Buchtipps. Jedes muss in der Liste stehen - mit Grund.
  const text = daten.ausgeschlossen.map((x) => `${x.was} ${x.warum}`).join(' ');
  for (const wort of ['Buchliste', 'Schutzfrist', 'Organisation', 'uk/ru']) {
    assert.ok(text.includes(wort), `die Ausschlussliste sagt nichts zu ${wort}`);
  }
  // Keine Titelliste, nirgends: kein Datenfeld trägt einen Buchtitel in
  // Anführungszeichen mit Urheber.
  const alles = JSON.stringify(daten);
  assert.ok(!/Bilderbuchklassiker/.test(alles));
  const k = kopie();
  k.ausgeschlossen = k.ausgeschlossen.slice(0, 3);
  assert.ok(pruefeDaten(k).some((f) => /Ausschlussliste ist zu kurz/.test(f)));
});

test('die App speichert nichts', () => {
  // Ein Haken an einer Achse wäre der Anfang einer Kindakte - und genau das
  // ist das zurückgewiesene Quellziel. Darum kein Speicher, nirgends.
  assert.ok(!/localStorage|sessionStorage|indexedDB|datenKarte/.test(code), 'die App speichert etwas');
  assert.ok(!/document\.cookie/.test(code));
});

test('keine externen Anfragen, kein Konto, kein Bildschirm fürs Kind', () => {
  assert.ok(/installiereNetzwerkWaechter\(\)/.test(code));
  assert.ok(!/https?:\/\//.test(code), 'eine URL im Code');
  assert.ok(!/https?:\/\//.test(JSON.stringify(daten)), 'eine URL in den Daten');
  assert.ok(/default-src 'self'/.test(seite));
  assert.ok(/style-src 'self' 'unsafe-inline'/.test(seite));
  assert.ok(/<noscript>/.test(seite));
  assert.ok(/impressum\.html/.test(code), 'kein Impressum im Fuß');
  // Keine eltern.html: das Kind sieht diese Seite nicht.
  assert.ok(!/eltern\.html/.test(code));
  assert.ok(/Das Gerät ist in Ihrer Hand/.test(daten.hinweis));
});

test('Math.random kommt nicht vor', () => {
  // Ohne Kommentare, sonst trifft die Prüfung ihren eigenen Hinweis -
  // Falle A, siebzehntes Mal (Nr. 59).
  const ohneKommentare = logikQuelle.replace(/^\s*(?:\/\/|\*|\/\*).*$/gm, '');
  assert.ok(!/Math\.random/.test(ohneKommentare));
  assert.ok(!/Math\.random/.test(code));
});

test('das Druckblatt zeigt alle Achsen und keine Knöpfe', () => {
  assert.ok(/@media print/.test(druck));
  assert.ok(/\.kg-nur-bildschirm\s*\{\s*display:\s*none\s*!important/.test(druck));
  assert.ok(/\.kg-nur-druck\s*\{\s*display:\s*block\s*!important/.test(druck));
  // Vorlesegröße für die Impulse: sie werden laut gelesen.
  const impulsGroesse = druck.match(/\.kg-impulse li \{[^}]*font-size:\s*(\d+)pt/);
  assert.ok(impulsGroesse && Number(impulsGroesse[1]) >= 12, 'die Impulse sind auf Papier zu klein');
  // Kein Haken, keine Namenszeile (docs/02).
  assert.ok(!/Name:/.test(druck) && !/Name:/.test(code));
  assert.ok(!/☐|✔|✓/.test(code), 'ein Haken in der App');
  // Die zugeklappten Achsen stehen im Druck offen da.
  assert.ok(/kg-nur-druck/.test(code));
  // Ohne gewählten Gegenstand trägt sonst kein Element eine Druckklasse –
  // das Blatt wäre leer (Review Welle 81).
  assert.match(code, /Wählen Sie zuerst aus, was auf dem Tisch liegt/);
});

test('Zeichen und Grenzen sind überall gesetzt', () => {
  for (const a of daten.achsen) {
    assert.match(a.zeichen, /\p{Extended_Pictographic}/u);
    assert.ok(a.grenze.length > 30, `${a.id}: grenze zu knapp`);
    assert.equal(a.impulse.length, 3);
  }
  for (const g of daten.gegenstaende) assert.match(g.zeichen, /\p{Extended_Pictographic}/u);
  const k = kopie();
  k.achsen[1].zeichen = 'X';
  assert.ok(pruefeDaten(k).some((f) => /zeichen fehlt/.test(f)));
});

test('die Nachbar-Apps, auf die verwiesen wird, gibt es wirklich', async () => {
  const { readdir } = await import('node:fs/promises');
  const vorhanden = new Set(await readdir(new URL('../../', import.meta.url)));
  for (const treffer of code.matchAll(/href: '\.\.\/([a-z0-9-]+)\/'/g)) {
    assert.ok(vorhanden.has(treffer[1]), `verlinkte App ${treffer[1]} gibt es nicht`);
  }
  // Der Text nennt zwei Apps namentlich - sie müssen existieren.
  assert.ok(vorhanden.has('kunst-entdecker'), 'keinAbfragen verweist auf Kunst-Entdecker');
  assert.ok(vorhanden.has('vorlese-kompass'), 'keineBuchliste verweist auf den Vorlese-Kompass');
  assert.ok(vorhanden.has('spielzeug-check-u3'), 'sicherheit verweist auf den Spielzeug-Check U3');
});

test('zielVon und zielSchluessel finden, was es gibt', () => {
  assert.equal(zielVon(daten, 'wahrnehmung-5').einordnung, 'gebaut');
  assert.equal(zielVon(daten, 'allgemein-6').einordnung, 'ausgeschlossen');
  assert.equal(zielVon(daten, 'wahrnehmung-9'), null);
  assert.equal(zielSchluessel({ gruppe: 'allgemein', nr: 2 }), 'allgemein-2');
  assert.equal(achseVon(daten, 'a-klang').name, 'Klang');
  assert.equal(gegenstandVon(daten, 'g-stoff').starkeAchsen.length, 3);
  assert.equal(achseVon(daten, 'a-nix'), null);
});
