import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as L from '../logik.mjs';
import {
  ARTEN, MAX_LAUT, MAX_GEMEINT, MAX_SPRACHE, MAX_WO,
  ZAHL_MIT_ALTER, BEWERTUNG, ZWECK_KIPPT,
  artVon, baueEintrag, istEintrag, nachDatum, nachArt, nachSprache,
  exportText, packe, pruefePaket, vereinige, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/tagebuch.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const logikQuelle = await readFile(new URL('../logik.mjs', import.meta.url), 'utf8');
const logikCode = logikQuelle.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const druckRegeln = druck.replace(/\/\*[\s\S]*?\*\//g, '');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

const e = (x) => baueEintrag({ art: 'wort', datum: '2026-10-01', laut: 'x', ...x });
const beispiele = [
  e({ laut: 'wauwau', gemeint: 'Hund', sprache: 'Deutsch', art: 'lautmalerei', datum: '2026-10-01' }),
  e({ laut: 'nane', gemeint: 'Banane', sprache: 'Deutsch', art: 'wort', datum: '2026-10-05' }),
  e({ laut: 'ba-ba-ba', art: 'lallen-kanonisch', datum: '2026-09-20' }),
  e({ laut: 'kot', gemeint: 'Katze', sprache: 'Ukrainisch', art: 'wort', datum: '2026-10-07' }),
];

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.arten.length, ARTEN.length);
});

test('es wird nirgends gezählt – und das ist die tragende Entscheidung', () => {
  // „Unter 50 Wörter mit 24 Monaten" ist das fachliche Warnzeichen. Eine
  // App, die eine Wortzahl neben ein Alter stellt, führt genau dieses
  // Screening durch - ohne Zuständigkeit und bei einem mehrsprachigen Kind
  // ohne gültigen Vergleichsmaßstab.
  // Gezielt auf FUNKTIONEN: die Regex, die eine Wortzahl neben einem Alter
  // ERKENNT, heißt notwendig ZAHL_MIT_ALTER - ein Netz auf den bloßen
  // Namen traf sie mit. Dieselbe Falle wie überall in diesem Projekt.
  for (const [name, wert] of Object.entries(L)) {
    if (typeof wert !== 'function') continue;
    assert.doesNotMatch(name, /^(zaehle|anzahl|summe|wortzahl|zahl|gesamt|count)/i, `Zählfunktion exportiert: ${name}`);
  }
  // Kein `.length` erreicht die Oberfläche als Zahl.
  assert.doesNotMatch(code, /\$\{[^}]*\.length[^}]*\}/, 'eine Länge wird in einen Text interpoliert');
  assert.doesNotMatch(code, /eintraege\.length\s*\}/);
  // Der Satz dazu steht da, und zwar als Entscheidung, nicht als Lücke.
  assert.match(daten.keineZahl, /bewusste Entscheidung/);
  assert.match(daten.wasEsIst, /nichts (wird )?gezählt|nichts gezählt/);
  // Eine Wortzahl neben einer Altersangabe wird in den Daten abgewiesen.
  const mut = kopie();
  mut.wasEsIst = 'Mit 24 Monaten sollten es 50 Wörter sein.';
  assert.ok(pruefeDaten(mut).some((f) => /Wortzahl neben einer Altersangabe/.test(f)));
  assert.match('50 Wörter mit 24 Monaten', ZAHL_MIT_ALTER);
  assert.match('mit 24 Monaten 50 Worte', ZAHL_MIT_ALTER);
  assert.doesNotMatch('Wörter in mehreren Sprachen', ZAHL_MIT_ALTER);
});

test('kein Geburtsdatum, kein Alter, kein Name – auch nicht durch die Hintertür', () => {
  // docs/02: ein Monatsraster braucht ein gespeichertes Geburtsdatum und
  // behauptet einen Entwicklungsplan, den es nicht gibt.
  assert.match(daten.keinAlter, /kein Geburtsdatum/);
  const eintrag = e({ laut: 'mama', art: 'wort', datum: '2026-10-01' });
  assert.deepEqual(Object.keys(eintrag).sort(), ['art', 'datum', 'gemeint', 'id', 'laut', 'sprache', 'wo']);
  // Ein Import kann die verbotenen Felder nicht hereinschmuggeln.
  for (const feld of ['geburtsdatum', 'alter', 'name', 'monate']) {
    assert.equal(istEintrag({ ...eintrag, [feld]: 'x' }), false, feld);
  }
  // Und keine Art trägt eine Altersangabe.
  const mut = kopie();
  mut.arten[0].erklaerung = 'Kommt ab 3 Monaten.';
  assert.ok(pruefeDaten(mut).some((f) => /Altersangabe in der Art/.test(f)));
});

test('die Arten sind keine Leiter', () => {
  // Ein allgemein anerkanntes Stufenmodell der frühen Lautentwicklung gibt
  // es im deutschen Fachschrifttum nicht: die Benennungen gehen
  // auseinander, die einzige Leitlinie mit Zweiphasen-Einteilung ist
  // abgelaufen, und die Quelle trennt zwei Gurrstufen, für die es im
  // Deutschen nur eine gibt.
  assert.match(daten.keinStufenmodell, /keine Leiter/);
  assert.match(daten.keinStufenmodell, /gibt es im deutschen Fachschrifttum nicht/);
  assert.match(daten.quelle.abweichung, /eine Gurrphase/);
  // Genau EINE Gurrphase in den Arten.
  assert.equal(daten.arten.filter((a) => /Gurren/.test(a.name)).length, 1);
  // Der Satz steht in der Einleitung, nicht nur in der Art-Ansicht - sonst
  // sieht man die Reihenfolge, bevor man die Einschränkung liest.
  assert.match(code, /keinStufenmodell/);
  const vorkommen = (code.match(/daten\.keinStufenmodell/g) ?? []).length;
  assert.ok(vorkommen >= 2, `keinStufenmodell nur ${vorkommen}× gerendert`);
  // Eine leere Art verschwindet NICHT: die Lücke wäre ein stilles Urteil.
  const gruppen = nachArt(daten, [beispiele[0]]);
  assert.equal(gruppen.length, ARTEN.length);
  assert.ok(gruppen.some((g) => g.eintraege.length === 0));
});

test('Sprachen werden getrennt geführt und nicht summiert', () => {
  // Vergleichsmaßstäbe bestehen nur für Kinder, die einsprachig deutsch
  // aufwachsen. Dass der Wortschatz über alle Sprachen zusammen zählt,
  // steht als SATZ da - und nicht als Zahl.
  const gruppen = nachSprache(beispiele);
  assert.deepEqual(gruppen.map((g) => g.sprache), ['Deutsch', 'Ukrainisch', '—']);
  for (const g of gruppen) assert.ok(Array.isArray(g.eintraege));
  assert.match(daten.keineSumme, /getrennt geführt/);
  assert.match(daten.mehrsprachig, /über alle seine Sprachen zusammen aber nicht weniger/);
  // Die fachliche Lage genau so, wie sie ist: nicht häufiger, aber möglich,
  // und dann in allen Sprachen.
  assert.match(daten.mehrsprachigKeinRisiko, /nicht häufiger/);
  assert.match(daten.mehrsprachigKeinRisiko, /Möglich ist sie/);
  assert.match(daten.mehrsprachigKeinRisiko, /alle Sprachen/);
  // Weder „unbedenklich" noch „verursacht".
  assert.doesNotMatch(daten.mehrsprachigKeinRisiko, /unbedenklich|verursacht/);
  // Beide falschen Richtungen werden abgewiesen: „unbedenklich" ist so
  // falsch wie „verursacht".
  const zuStark = kopie();
  zuStark.mehrsprachigKeinRisiko = 'Mehrsprachigkeit ist völlig unbedenklich und nicht häufiger, alle Sprachen. Möglich ist sie.';
  assert.ok(pruefeDaten(zuStark).some((f) => /„unbedenklich“ ist zu stark/.test(f)));
  const alsUrsache = kopie();
  alsUrsache.mehrsprachigKeinRisiko = 'Mehrsprachigkeit verursacht nicht häufiger Probleme in allen Sprachen. Möglich ist sie.';
  assert.ok(pruefeDaten(alsUrsache).some((f) => /als Ursache/.test(f)));
  const ohneLage = kopie();
  ohneLage.mehrsprachigKeinRisiko = 'Sprechen Sie Ihre Sprache.';
  assert.ok(pruefeDaten(ohneLage).some((f) => /fachliche Lage zur Mehrsprachigkeit/.test(f)));
});

test('kein Bewertungsvokabular – außer in den Feldern, die es ausschließen', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  // Die Zusagefelder MÜSSEN die Wörter nennen dürfen, um sie
  // auszuschließen („keine Ampel", „keine Prozente"). Ein Netz auf das
  // nackte Wort trifft die eigene Ausnahmeklausel.
  assert.match(daten.wasEsIst, BEWERTUNG);
  assert.match(daten.keinScreening, /kein Entwicklungstest/);
  // In einem anderen Feld ist dasselbe Wort ein Fehler.
  const mut = kopie();
  mut.speicherGrenzen = `${mut.speicherGrenzen} Der Punktwert bleibt erhalten.`;
  assert.ok(pruefeDaten(mut).some((f) => /Bewertungsvokabular/.test(f)));
  // Und in einer Art ebenso.
  const mut2 = kopie();
  mut2.arten[1].erklaerung = 'Ein auffälliges Zeichen.';
  assert.ok(pruefeDaten(mut2).some((f) => /Art gurren: Bewertungsvokabular/.test(f)));
  assert.match('Perzentil 15', BEWERTUNG);
  assert.doesNotMatch('das Kind sagt etwas', BEWERTUNG);
});

test('„Früherkennung“ und „Prävention“ stehen nirgends außer in einer Verneinung', () => {
  // Diese zwei Wörter ordnen eine Software einer strengeren Regel zu - sie
  // dürfen auch dann nicht dastehen, wenn die App sie gar nicht leistet.
  assert.deepEqual(pruefeDaten(daten), []);
  const mut = kopie();
  mut.arten[0].erklaerung = 'Gut zur Früherkennung.';
  assert.ok(pruefeDaten(mut).some((f) => /kippt die Zweckbestimmung/.test(f)));
  const mut2 = kopie();
  mut2.speicherGrenzen = 'Diese App dient der Prävention.';
  assert.ok(pruefeDaten(mut2).some((f) => /Früherkennung“ oder „Prävention/.test(f)));
  assert.match('Früherkennung', ZWECK_KIPPT);
  assert.match('Praevention', ZWECK_KIPPT);
});

test('nur für Eltern – die Tagespflege ist ausdrücklich ausgenommen', () => {
  // Wer beruflich Aufzeichnungen über fremde Kinder führt, hat Pflichten
  // gegenüber den Familien, die ein Heft wie dieses nicht erfüllt.
  assert.match(daten.nurEltern, /nicht für die Kindertagespflege/);
  assert.match(daten.nurEltern, /getrennte Akten je Kind|Auskunft auf Verlangen/);
  const mut = kopie();
  mut.nurEltern = 'Auch für die Tagespflege geeignet.';
  assert.ok(pruefeDaten(mut).some((f) => /Abgrenzung muss ausgesprochen sein/.test(f)));
});

test('gespeichert wird erst auf Knopfdruck, nicht beim Tippen und nicht beim Laden', () => {
  assert.match(daten.speichernAufKnopf, /erst, wenn/);
  // Kein Schreiben an einem Eingabe-Ereignis.
  assert.doesNotMatch(code, /oninput|onkeyup|onkeydown/);
  // `speichere()` wird nur aus Klick-Handlern und dem Import gerufen, nie
  // im Modulrumpf.
  const rumpf = code.slice(code.lastIndexOf('const fehler = pruefeDaten'));
  assert.doesNotMatch(rumpf, /speichere\(\)/);
  // Keine Geräte- oder Nutzerkennung im Speicher: nur ein Inhaltsschlüssel.
  assert.match(code, /'ewt\.eintraege'/);
  assert.doesNotMatch(code, /randomUUID|Math\.random|navigator\.userAgent/);
  assert.doesNotMatch(code, /localStorage\.clear/);
});

test('die technischen Grenzen stehen sichtbar da', () => {
  assert.match(daten.speicherGrenzen, /privates Fenster/);
  assert.match(daten.speicherGrenzen, /einzige Sicherung/);
  assert.match(daten.speicherGrenzen, /Browserdaten/);
  assert.match(daten.tastaturHinweis, /Tastatur/);
  assert.match(daten.tastaturHinweis, /außerhalb dieser Seite/);
  // Und der Hinweis auf Dritte ist konkret.
  assert.match(daten.ueberDritte, /anderen Elternteil/);
  const mut = kopie();
  mut.speicherGrenzen = 'Alles bleibt lokal.';
  const f = pruefeDaten(mut);
  assert.ok(f.some((x) => /technischen Grenzen/.test(x)));
  assert.ok(f.some((x) => /einzige Sicherung/.test(x)));
});

test('Einträge werden gekürzt, getrimmt und ohne Beiwerk gebaut', () => {
  assert.equal(baueEintrag({}), null);
  assert.equal(baueEintrag({ laut: 'x', art: 'gibtsnicht', datum: '2026-01-01' }), null);
  assert.equal(baueEintrag({ laut: '   ', art: 'wort', datum: '2026-01-01' }), null);
  assert.equal(baueEintrag({ laut: 'x', art: 'wort' }), null);
  const lang = e({ laut: 'a'.repeat(200), gemeint: 'b'.repeat(200), sprache: 'c'.repeat(200), wo: 'd'.repeat(200) });
  assert.equal(lang.laut.length, MAX_LAUT);
  assert.equal(lang.gemeint.length, MAX_GEMEINT);
  assert.equal(lang.sprache.length, MAX_SPRACHE);
  assert.equal(lang.wo.length, MAX_WO);
  assert.equal(e({ laut: '  mama  ' }).laut, 'mama');
  assert.equal(e({ laut: 'mama', gemeint: '   ' }).gemeint, '');
});

test('Chronologie: neueste zuerst, und der Export ist eine Rohliste', () => {
  const sortiert = nachDatum(beispiele);
  assert.deepEqual(sortiert.map((x) => x.datum), ['2026-10-07', '2026-10-05', '2026-10-01', '2026-09-20']);
  const txt = exportText(daten, beispiele, '2026-10-09');
  assert.match(txt, /kein Testergebnis/);
  assert.match(txt, /Liste erstellt am 2026-10-09/);
  assert.match(txt, /„wauwau“ = Hund \(Deutsch\) · Laut für eine Sache/);
  // Keine Summe, keine Zahl, keine Auffälligkeitsaussage.
  assert.doesNotMatch(txt, /\d+\s*(Einträge|Eintrag|Wörter|Worte)/);
  assert.doesNotMatch(txt, /insgesamt|Summe|davon/i);
  assert.doesNotMatch(txt, BEWERTUNG);
  assert.match(exportText(daten, [], '2026-10-09'), /\(noch kein Eintrag\)/);
});

test('Datei sichern und wieder einlesen – mit Prüfung VOR der Übernahme', () => {
  const paket = packe(beispiele);
  const p = pruefePaket(paket);
  assert.ok(p.ok);
  assert.equal(p.eintraege.length, beispiele.length);
  assert.equal(pruefePaket('kein json').ok, false);
  assert.equal(pruefePaket('{}').ok, false);
  assert.equal(pruefePaket(JSON.stringify({ art: 'etwas-anderes', eintraege: [] })).ok, false);
  assert.equal(pruefePaket(JSON.stringify({ art: 'erste-woerter-tagebuch', eintraege: 'nein' })).ok, false);
  // Ein Fremdfeld wird verworfen, nicht übernommen.
  const mitName = JSON.stringify({
    art: 'erste-woerter-tagebuch', version: 1,
    eintraege: [{ ...beispiele[0], name: 'Mia', geburtsdatum: '2024-01-01' }, beispiele[1]],
  });
  const p2 = pruefePaket(mitName);
  assert.ok(p2.ok);
  assert.equal(p2.eintraege.length, 1);
  assert.equal(p2.verworfen, 1);
  assert.ok(!JSON.stringify(p2.eintraege).includes('Mia'));
  // Zusammenführen ohne Dubletten.
  assert.equal(vereinige(beispiele, beispiele).length, beispiele.length);
  assert.equal(vereinige([], beispiele).length, beispiele.length);
  assert.equal(vereinige(beispiele, []).length, beispiele.length);
  // Der Export geht über einen Download-Anker, nicht über eine Navigation.
  assert.match(code, /URL\.createObjectURL/);
  assert.match(code, /revokeObjectURL/);
  assert.doesNotMatch(code, /window\.open|location\.href\s*=/);
});

test('Löschen: je Eintrag ohne Papierkorb, und alles über die gemeinsame Karte', () => {
  assert.match(code, /datenKarte\(/);
  assert.match(code, /löschen\? Das lässt sich nicht zurückholen/);
  assert.doesNotMatch(code, /Papierkorb|wiederherstell|rückgängig/i);
  assert.doesNotMatch(code, /localStorage\.clear/);
  // Der Löschknopf je Eintrag trägt einen zugänglichen Namen mit dem Wort.
  assert.match(code, /aria-label.*löschen/);
});

test('vorgelesen werden nur die Rahmentexte, nie die Einträge', () => {
  // Die Wörter des Kindes können in jeder Familiensprache sein, und
  // `vorlesen()` setzt nur die Sprachkennung - eine deutsche Stimme würde
  // sie falsch lesen.
  assert.match(code, /localService/);
  const rufe = [...code.matchAll(/vorleseKnopf\(([^,]+),/g)].map((m) => m[1].trim());
  assert.ok(rufe.length >= 1);
  for (const r of rufe) {
    assert.doesNotMatch(r, /eintraege|eintrag|laut|gemeint/i, `Eintrag geht durch die Sprachausgabe: ${r}`);
  }
  assert.doesNotMatch(code, /vorlesen\([^)]*,\s*'(uk|ru|tr|ar|pl)/);
});

test('Druckblatt und Politik', () => {
  assert.match(code, /window\.print\(\)/);
  assert.match(druck, /@media print/);
  assert.match(druckRegeln, /\.ewt-nur-bildschirm \{ display: none !important/);
  assert.match(druckRegeln, /\.ewt-nur-druck \{ display: block !important/);
  for (const verboten of ['Haken', 'Häkchen', 'Stern', 'Urkunde', 'Name:', 'Punkte']) {
    assert.ok(!druckRegeln.includes(verboten), `eine Druckregel erzeugt „${verboten}“`);
  }
  assert.doesNotMatch(druckRegeln, /content:\s*["'][^"']*[☐☑★⭐✔]/);
  const druckTeil = code.slice(code.indexOf('ewt-nur-druck'), code.indexOf('werkzeuge()'));
  assert.doesNotMatch(druckTeil, /[☐☑★⭐]|Name:/);
  // Politik
  assert.match(seite, /default-src 'self'; style-src 'self' 'unsafe-inline'/);
  assert.match(seite, /<html lang="de">/);
  assert.match(seite, /<noscript>/);
  assert.match(seite, /aria-live/);
  assert.match(code, /installiereNetzwerkWaechter\(\)/);
  assert.match(code, /impressum\.html/);
  assert.doesNotMatch(JSON.stringify(daten), /https?:\/\//);
  // Keine Paragrafen, Leitliniennummern oder Jahreszahlen in der Oberfläche:
  // die Rechtslage um ein solches Heft ist in Bewegung.
  const mut = kopie();
  mut.keinScreening = `${mut.keinScreening} Siehe § 25 TDDDG.`;
  assert.ok(pruefeDaten(mut).some((f) => /Paragrafen oder Leitliniennummern/.test(f)));
  // Fachfragebogen namentlich, aber nicht nachgebaut.
  assert.match(daten.fragebogen, /baut keinen davon nach/);
  assert.match(daten.fragebogen, /keine Wortliste/);
  // Nachbarschaft wird verlinkt, nicht wiederholt.
  for (const nachbar of ['meilenstein-begleiter', 'sprich-mit-mir', 'familienschatz-reime', 'herkunftssprachen-bruecke', 'staerken-tagebuch']) {
    assert.match(code, new RegExp(nachbar), `Verweis auf ${nachbar} fehlt`);
  }
  // Das Gerät gehört dem Erwachsenen.
  assert.match(daten.hinweis, /in Ihrer Hand/);
  assert.match(daten.hinweis, /sieht keinen Bildschirm/);
});

test('Hilfsfunktionen', () => {
  assert.equal(artVon(daten, 'wort').name, 'Wort');
  assert.equal(artVon(daten, 'gibtsnicht'), null);
  assert.deepEqual(nachDatum(null), []);
  assert.deepEqual(nachSprache(null), []);
  assert.deepEqual(nachArt(null, null).length, 0);
  assert.equal(istEintrag(null), false);
  assert.equal(istEintrag({ laut: 'x', art: 'wort', datum: '2026-01-01' }), true);
  assert.equal(istEintrag({ laut: 'x'.repeat(99), art: 'wort', datum: '2026-01-01' }), false);
  assert.ok(logikCode.includes('export function pruefeDaten'));
});
