import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import {
  BEREICHE, MERKMALE_JE_BEREICH, EINORDNUNGEN, CHECKLISTE, EINSTUFUNG, DEUTUNG,
  WIRKVERSPRECHEN, VORGABE, ALTERSSTUFUNG, PREIS, MARKE_ODER_QUELLE, FREMDTEXT,
  ideeVon, materialVon, merkmalVon, ideenFuer, karte, angebotsTexte, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/ideen.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const logikQuelle = await readFile(new URL('../logik.mjs', import.meta.url), 'utf8');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Daten sind gültig und vollständig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.ideen.length, 8);
  assert.equal(daten.material.length, 10);
  assert.equal(daten.merkmale.length, 19);
  assert.equal(daten.ausgeschlossen.length, 6);
});

test('die 19 Merkmale sind nachgezählt: 4 + 8 + 7', () => {
  for (const b of BEREICHE) {
    assert.equal(daten.merkmale.filter((m) => m.bereich === b).length, MERKMALE_JE_BEREICH[b]);
  }
  assert.equal(Object.values(MERKMALE_JE_BEREICH).reduce((a, b) => a + b, 0), 19);
  assert.equal(daten.quelle.zahlen.merkmale, 19);
  const k = kopie();
  k.merkmale = k.merkmale.filter((m) => m.id !== 'm12');
  const f = pruefeDaten(k);
  assert.ok(f.some((x) => /7 Merkmale im Bereich musik/.test(x)), f.join(' | '));
});

test('jedes Merkmal hat genau eine Einordnung, und die Bilanz geht auf', () => {
  const nach = {};
  for (const e of EINORDNUNGEN) nach[e] = daten.merkmale.filter((m) => m.einordnung === e).length;
  assert.deepEqual(nach, { ideeDa: 7, anderesWerkzeug: 6, nichtUebernommen: 5, beschreibend: 1 });
  assert.equal(Object.values(nach).reduce((a, b) => a + b, 0), 19);
});

test('jedes Merkmal mit Karte hat seine Karte, und jede Karte ihr Merkmal', () => {
  for (const m of daten.merkmale.filter((x) => x.einordnung === 'ideeDa')) {
    assert.ok(ideenFuer(daten, m.id).length, `${m.id} ohne Karte`);
  }
  for (const i of daten.ideen) {
    assert.ok(i.quellMerkmale.length, `${i.id} ohne Quellmerkmal`);
    for (const id of i.quellMerkmale) {
      assert.equal(merkmalVon(daten, id).einordnung, 'ideeDa');
    }
  }
  // Gegenprobe in beide Richtungen.
  const ohneKarte = kopie();
  ohneKarte.merkmale.find((m) => m.id === 'm17').einordnung = 'ideeDa';
  ohneKarte.ideen = ohneKarte.ideen.filter((i) => i.id !== 'i-formen');
  assert.ok(pruefeDaten(ohneKarte).some((f) => /m17.*keine Karte/.test(f)));

  const falschesMerkmal = kopie();
  falschesMerkmal.ideen[0].quellMerkmale = ['m06'];
  const f = pruefeDaten(falschesMerkmal);
  assert.ok(f.some((x) => /m06.*nichtUebernommen/.test(x)), f.join(' | '));

  const erfunden = kopie();
  erfunden.ideen[0].quellMerkmale = ['m99'];
  assert.ok(pruefeDaten(erfunden).some((x) => /m99 gibt es nicht/.test(x)));
});

test('KEINE CHECKLISTE – und beide Gründe stehen in der App', () => {
  // Der Katalogeintrag wollte „19 Meilensteine … als Checkliste". Das ist die
  // größte Abweichung dieser App, und sie hängt an zwei nachprüfbaren Dingen:
  // dem Zeitpunkt in der Quelle und dem Fehlen einer deutschen Referenzliste.
  assert.ok(/Grenzsteine/.test(daten.keinMeilenstein));
  assert.ok(/dritten Lebensjahr/.test(daten.keinMeilenstein));
  assert.ok(/dritten Lebensjahr/.test(daten.zeitpunkt));
  for (const fehlend of ['Grenzsteine', 'dritten Lebensjahr']) {
    const k = kopie();
    k.keinMeilenstein = k.keinMeilenstein.replace(new RegExp(fehlend, 'g'), 'etwas');
    assert.ok(pruefeDaten(k).length, `ohne „${fehlend}" bleibt der Validator still`);
  }
  // Und keine Karte und kein Material redet wie eine Checkliste.
  for (const [wo, text] of angebotsTexte(daten)) {
    assert.ok(!CHECKLISTE.test(text), `${wo} klingt nach Checkliste: ${text}`);
  }
  for (const satz of ['Das können Sie abhaken.', 'Mit zwei Jahren sollte Ihr Kind das können.',
    'Der nächste Meilenstein ist das Kneten.', 'Prüfen Sie den Entwicklungsstand.',
    'Ihr Kind ist hier noch nicht so weit.']) {
    assert.ok(CHECKLISTE.test(satz), `CHECKLISTE greift nicht: ${satz}`);
  }
  // Falle A, neunzehntes Mal: `keinMeilenstein` MUSS das Wort benutzen dürfen.
  assert.ok(CHECKLISTE.test(daten.keinMeilenstein), 'der Absatz nennt nicht, was er ausschließt');
  assert.ok(CHECKLISTE.test(daten.ausgeschlossen[0].warum) || /Checkliste/.test(daten.ausgeschlossen[0].was));
});

test('keine Karte stuft ein, deutet, verspricht oder gibt vor', () => {
  for (const [wo, text] of angebotsTexte(daten)) {
    assert.ok(!EINSTUFUNG.test(text), `${wo} stuft ein: ${text}`);
    assert.ok(!DEUTUNG.test(text), `${wo} deutet: ${text}`);
    assert.ok(!WIRKVERSPRECHEN.test(text), `${wo} verspricht: ${text}`);
    assert.ok(!VORGABE.test(text), `${wo} gibt vor: ${text}`);
    assert.ok(!ALTERSSTUFUNG.test(text), `${wo} nennt ein Alter: ${text}`);
    assert.ok(!PREIS.test(text), `${wo} nennt einen Preis: ${text}`);
    assert.ok(!MARKE_ODER_QUELLE.test(text), `${wo} nennt Marke/Quelle: ${text}`);
    assert.ok(!FREMDTEXT.test(text), `${wo} nennt einen fremden Text: ${text}`);
    assert.ok(!/[Ѐ-ӿ]/.test(text), `${wo} ist kyrillisch: ${text}`);
  }
  for (const [satz, netz, name] of [
    ['Ein besonders begabtes Kind malt hier schon Kreise.', EINSTUFUNG, 'EINSTUFUNG'],
    ['Die Farbwahl verrät viel über das Kind.', DEUTUNG, 'DEUTUNG'],
    ['Das Bild zeigt die innere Welt.', DEUTUNG, 'DEUTUNG (Wort)'],
    ['Fingermalen fördert die Feinmotorik.', WIRKVERSPRECHEN, 'WIRKVERSPRECHEN'],
    ['Malen Sie täglich mit Ihrem Kind.', VORGABE, 'VORGABE'],
    ['Nehmen Sie sich zehn Minuten.', VORGABE, 'VORGABE (Wort)'],
    ['Diese Idee passt ab 18 Monaten.', ALTERSSTUFUNG, 'ALTERSSTUFUNG'],
    ['Ein Set kostet etwa 8,50 Euro.', PREIS, 'PREIS'],
    ['Erhältlich bei der Farben GmbH.', MARKE_ODER_QUELLE, 'MARKE'],
    ['Singen Sie die zweite Strophe.', FREMDTEXT, 'FREMDTEXT'],
    ['Hier steht ein überlieferter Text.', FREMDTEXT, 'FREMDTEXT (Wortanfang mit Umlaut)'],
  ]) {
    assert.ok(netz.test(satz), `${name} greift nicht: ${satz}`);
  }
  // Das Richtige darf NICHT getroffen werden.
  assert.ok(!DEUTUNG.test('Kein Deuten – warum, steht oben und ausführlich im Kunst-Gucken.'));
  assert.ok(!VORGABE.test('Ein Esslöffel Mehl oder Grieß auf ein Tablett, dünn verteilt.'));
  assert.ok(!PREIS.test('Kostet so gut wie nichts und ist schnell weggewischt.'));
  assert.ok(!CHECKLISTE.test('Ihr Kind zieht von selbst weiter Striche, auch wenn Sie nichts sagen.'));
  // Kein Zweig darf tot sein. Beim Bau hat die Gegenprobe zwei gefunden:
  // „sollte … können" mit dem Subjekt dazwischen, und `\büber`, das nach einem
  // Leerzeichen nie trifft, weil „ü" kein Wortzeichen ist. Die Korpusregel
  // packages/kinderschutz/test/wortgrenze-umlaut.test.mjs hält das jetzt
  // überall heraus.
  assert.ok(DEUTUNG.test('Was es formt, sagt etwas über das Kind.'));
  assert.ok(CHECKLISTE.test('Bis zum dritten Geburtstag müsste sie das beherrschen.'));
  // Und `keinDeuten` muss die Deutung benennen dürfen.
  assert.ok(DEUTUNG.test(daten.keinDeuten));
});

test('jede Karte sagt, woran man sieht, dass es passt – und wann Schluss ist', () => {
  // An die Stelle des Meilensteins tritt eine beobachtbare Handlung. Gleiche
  // Lösung wie in Nr. 55, 58 und 59.
  for (const i of daten.ideen) {
    assert.ok(i.woranSieSehen.length > 20, `${i.id}: woranSieSehen zu knapp`);
    assert.ok(i.aufhoeren.length > 20, `${i.id}: aufhoeren zu knapp`);
    assert.ok(i.wennSie.length > 20, `${i.id}: wennSie zu knapp`);
    assert.ok(i.wasSieTun.length >= 2);
  }
  for (const feld of ['woranSieSehen', 'aufhoeren', 'wennSie']) {
    const k = kopie();
    delete k.ideen[2][feld];
    assert.ok(pruefeDaten(k).some((f) => new RegExp(feld, 'i').test(f)), `${feld} wird nicht geprüft`);
  }
});

test('jedes Material hat seinen eigenen Sicherheitssatz', () => {
  // In diesem Alter kommt alles in den Mund - eine Lücke hier wäre die
  // gefährlichste Lücke der App.
  for (const m of daten.material) {
    assert.ok(m.sicherheit.length >= 30, `${m.id}: sicherheit zu knapp`);
    assert.ok(m.woGefunden.length > 15, `${m.id}: woGefunden zu knapp`);
  }
  const k = kopie();
  k.material.find((m) => m.id === 'm-knetmasse').sicherheit = 'Vorsicht.';
  assert.ok(pruefeDaten(k).some((f) => /sicherheit fehlt oder ist zu knapp/.test(f)));
  // Kein totes Material.
  const k2 = kopie();
  k2.material.push({ id: 'm-glitzer', name: 'Glitzer', zeichen: '✨', woGefunden: 'Im Bastelladen, überall.', sicherheit: 'Glitzer ist fein genug, um eingeatmet zu werden, und er geht nie wieder weg.' });
  assert.ok(pruefeDaten(k2).some((f) => /von keiner Idee benutzt/.test(f)));
  // Und die Regel, die immer gilt, benennt die Gefahr.
  assert.match(daten.sicherheitImmer, /verschluck|Kleinteil|in den Mund/i);
  assert.ok(/Spielzeug-Check U3/.test(daten.sicherheitImmer));
});

test('die Plastiktüte ist ausdrücklich ausgeschlossen', () => {
  // Eine Handpuppe aus einer Tüte ist eine naheliegende Idee und eine
  // Erstickungsgefahr. Die Karte und das Material sagen es beide.
  const socke = materialVon(daten, 'm-socke');
  assert.ok(/[Kk]eine Plastiktüte/.test(socke.sicherheit));
  assert.ok(/[Kk]eine Plastiktüte/.test(ideeVon(daten, 'i-handpuppe').grenze));
  // Und keine Karte schlägt eine Tüte vor.
  for (const [wo, text] of angebotsTexte(daten)) {
    assert.ok(!/Plastiktüte über/.test(text) || /[Kk]eine Plastiktüte/.test(text), `${wo}: ${text}`);
  }
});

test('die zweite Zahl des Katalogeintrags ist als falsch ausgewiesen', () => {
  // „19 Indikatoren" stimmt - nachgezählt. „9 Aktivitätsformen" lässt sich an
  // dieser Stelle nicht nachzählen; die Neun gehört zu den neun empfohlenen
  // Werkgruppen auf S. 89.
  assert.ok(/Aktivitätsformen/.test(daten.quelle.abweichung));
  assert.ok(/S\. 89/.test(daten.quelle.abweichung));
  assert.ok(/19/.test(daten.quelle.nachgezaehlt));
  const k = kopie();
  k.quelle.abweichung = 'Alles übernommen.';
  assert.ok(pruefeDaten(k).some((f) => /Aktivitätsformen/.test(f)));
});

test('die Bildschirmregel ist richtig zugeordnet – die Drei-Jahres-Grenze ist deutsch', () => {
  // Beim Bau nachgeschlagen: die WHO-Leitlinie für Kinder unter fünf Jahren
  // (2019) kennt KEINE Drei-Jahres-Grenze – sie rät Einjährigen von
  // Bildschirmzeit ab und lässt Zweijährigen bis zu einer Stunde. Die Grenze
  // bei drei Jahren ist eine deutsche Empfehlung. In „Sprich mit mir!" stand
  // die WHO als Beleg dafür; das war falsch und ist in Welle 81 berichtigt.
  assert.match(daten.keinBildschirm, /BIÖG/);
  assert.match(daten.keinBildschirm, /BZgA/, 'ohne den alten Namen findet niemand die Empfehlung wieder');
  assert.match(daten.keinBildschirm, /027-075/);
  assert.match(daten.keinBildschirm, /kennt sie nicht/);
  assert.ok(/Zweijährigen bis zu einer Stunde/.test(daten.keinBildschirm),
    'die WHO-Ausnahme für Zweijährige muss dastehen, sonst klingt es nach WHO-Verbot');
});

test('die Sicherheitsangaben behaupten kein Gesetz und keine Unbedenklichkeit', () => {
  const farbe = materialVon(daten, 'm-fingerfarbe').sicherheit;
  // EN 71-7 ist eine harmonisierte Norm, kein Gesetz. Und die Norm sagt
  // nichts über die Unbedenklichkeit beim Verschlucken – sie begrenzt Stoffe
  // und verlangt Kennzeichnung.
  assert.match(farbe, /EN 71-7/);
  assert.ok(!/gesetzlich|Gesetz|vorgeschrieben durch das/.test(farbe), 'eine Norm ist kein Gesetz');
  // Mit Lookbehind, damit die VERNEINUNG stehen bleiben darf: „bitter heißt
  // nicht ungiftig und nicht essbar" ist gerade der Satz, auf den es ankommt.
  const BEHAUPTET_HARMLOS = /(?<!nicht\s)(?:unbedenklich|essbar|ungiftig)/;
  assert.ok(!BEHAUPTET_HARMLOS.test(farbe), 'die Norm trägt keine Unbedenklichkeitsaussage');
  assert.ok(BEHAUPTET_HARMLOS.test('Die Farbe ist essbar.'), 'die Prüfung greift nicht');
  assert.ok(!BEHAUPTET_HARMLOS.test('bitter heißt nicht ungiftig und nicht essbar'));
  assert.ok(!/verhindert, dass/.test(farbe), 'für die Wirkung des Bitterstoffs gibt es keinen Beleg');
  // Der Warnhinweis „Nicht für Kinder unter 3 Jahren geeignet" ist eine
  // Warnung, kein Gütezeichen - das ist die häufigste Verwechslung.
  assert.match(farbe, /kein Gütezeichen|eine Warnung/);
  // Salzteig: keine erfundene Mengenschwelle.
  const salz = daten.ausgeschlossen.find((x) => /Salzteig/.test(x.was));
  assert.ok(salz, 'Salzteig muss in der Ausschlussliste stehen');
  assert.ok(!/\d+\s*(?:g\b|Gramm|Teelöffel|Esslöffel|Prozent)/.test(salz.warum),
    'eine Mengenschwelle, die es nicht gibt');
  assert.match(salz.warum, /nennt.*nicht|keine Mengenschwelle|bewusst nicht/);
});

test('die Begründung gegen die Checkliste nennt beide geprüften Belege', () => {
  assert.match(daten.keinMeilenstein, /Kinder-Richtlinie/);
  assert.match(daten.keinMeilenstein, /Diagnoseinstrument/);
  assert.match(daten.keinMeilenstein, /U7/);
  // Und keine Monatsangabe zu einer Tätigkeit, für die es keine gibt.
  for (const [wo, text] of angebotsTexte(daten)) {
    assert.ok(!/\b\d{1,2}\.\s*(?:Monat|Lebensmonat)/.test(text), `${wo} nennt einen Monat: ${text}`);
  }
});

test('die App speichert nichts und erzeugt keinen Bericht', () => {
  // Berichtet würde hier über ein Kind - das ist die Einstufung, die diese
  // App nicht macht.
  assert.ok(!/localStorage|sessionStorage|indexedDB|datenKarte/.test(code), 'die App speichert etwas');
  assert.ok(!/document\.cookie/.test(code));
  assert.ok(!/Bericht erzeugen|Bericht speichern|downloadBericht/.test(code));
  assert.ok(!/☐|✔|✓/.test(code), 'ein Haken in der App');
  assert.ok(!/Name:/.test(code) && !/Name:/.test(druck), 'eine Namenszeile');
});

test('keine externen Anfragen, kein Konto, kein Bildschirm fürs Kind', () => {
  assert.ok(/installiereNetzwerkWaechter\(\)/.test(code));
  assert.ok(!/https?:\/\//.test(code), 'eine URL im Code');
  assert.ok(!/https?:\/\//.test(JSON.stringify(daten)), 'eine URL in den Daten');
  assert.ok(/default-src 'self'/.test(seite));
  assert.ok(/style-src 'self' 'unsafe-inline'/.test(seite));
  assert.ok(/<noscript>/.test(seite));
  assert.ok(/impressum\.html/.test(code));
  assert.ok(!/eltern\.html/.test(code));
  assert.ok(/Das Gerät ist in Ihrer Hand/.test(daten.hinweis));
});

test('Math.random kommt nicht vor', () => {
  const ohneKommentare = logikQuelle.replace(/^\s*(?:\/\/|\*|\/\*).*$/gm, '');
  assert.ok(!/Math\.random/.test(ohneKommentare));
  assert.ok(!/Math\.random/.test(code));
});

test('gedruckt wird die offene Karte, nicht die ganze Kartei', () => {
  assert.ok(/@media print/.test(druck));
  assert.ok(/\.ek-idee:not\(\.ek-offen\)\s*\{\s*display:\s*none\s*!important/.test(druck));
  assert.ok(/\.ek-nur-bildschirm\s*\{\s*display:\s*none\s*!important/.test(druck));
  const schrittGroesse = druck.match(/\.ek-schritte li \{[^}]*font-size:\s*(\d+)pt/);
  assert.ok(schrittGroesse && Number(schrittGroesse[1]) >= 12, 'die Schritte sind auf Papier zu klein');
  assert.ok(/ek-offen/.test(code), 'die App setzt die Klasse ek-offen nicht');
});

test('die Nachbar-Apps, auf die verwiesen wird, gibt es wirklich', async () => {
  const vorhanden = new Set(await readdir(new URL('../../', import.meta.url)));
  for (const treffer of code.matchAll(/href: '\.\.\/([a-z0-9-]+)\/'/g)) {
    assert.ok(vorhanden.has(treffer[1]), `verlinkte App ${treffer[1]} gibt es nicht`);
  }
  // Die Merkmale verweisen auf Apps - jede muss es geben, sonst zeigt der
  // Anhang ins Leere.
  for (const m of daten.merkmale.filter((x) => x.einordnung === 'anderesWerkzeug')) {
    for (const a of m.apps) assert.ok(vorhanden.has(a), `${m.id} nennt ${a}, das es nicht gibt`);
  }
});

test('karte, ideenFuer und die Nachschlagefunktionen', () => {
  const k = karte(daten, 'i-kleben');
  assert.equal(k.titel, 'Kleben, wobei Sie den Kleber behalten');
  assert.equal(k.material.length, 3);
  assert.ok(k.sicherheitImmer.length > 50);
  assert.equal(karte(daten, 'gibt-es-nicht'), null);
  assert.equal(ideeVon(daten, 'i-bauen').zeichen, '🧱');
  assert.equal(materialVon(daten, 'm-socke').name, 'Eine Socke oder ein Waschlappen');
  assert.equal(merkmalVon(daten, 'm19').bereich, 'kunst');
  assert.equal(merkmalVon(daten, 'm99'), null);
  assert.equal(ideenFuer(daten, 'm15').length, 2);
  assert.equal(ideenFuer(daten, 'm06').length, 0);
});
