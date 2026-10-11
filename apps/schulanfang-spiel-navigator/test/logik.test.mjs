import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import {
  EINORDNUNGEN, ZIELE, NICHT_GEPRUEFT, SCHULREIF_ALS_URTEIL, VORHERSAGE, BEWERTUNG,
  WIRKVERSPRECHEN, KOENNENSALTER, bereichVon, spielartVon, angebotsTexte, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/navigator.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Daten sind gültig und vollständig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.wasGilt.length, 6);
  assert.equal(daten.bereiche.length, 3);
  assert.equal(daten.spielarten.length, 4);
  assert.equal(daten.ziele.length, ZIELE);
  assert.equal(daten.ausgeschlossen.length, 6);
});

test('„schulreif“ kommt nur als Begriff aus der Geschichte vor', () => {
  // Der Katalogeintrag heißt „Spielend schulreif“. Das Konstrukt unterstellte
  // einen biologischen Reifungsvorgang und wurde abgelöst; Nordrhein-Westfalen
  // hat auch die „Schulfähigkeit“ als Einschulungsvoraussetzung aufgegeben.
  assert.match(daten.warumNichtSchulreif, /Reifungsvorgang/);
  assert.match(daten.warumNichtSchulreif, /Schulfähigkeit/);
  assert.match(daten.warumNichtSchulreif, /aufgegeben/);
  for (const [wo, text] of angebotsTexte(daten)) {
    assert.ok(!SCHULREIF_ALS_URTEIL.test(text), `${wo}: „schulreif“ als Urteil – ${text}`);
  }
  for (const satz of ['Ihr Kind ist schulreif.', 'Das Kind ist noch nicht schulfähig.',
    'Ein schulreifes Kind kann stillsitzen.']) {
    assert.ok(SCHULREIF_ALS_URTEIL.test(satz), `greift nicht: ${satz}`);
  }
  // Der erklärende Absatz muss das Wort tragen dürfen.
  assert.ok('warumNichtSchulreif' in NICHT_GEPRUEFT);
  const k = kopie();
  k.warumNichtSchulreif = 'Dieses Wort benutzen wir nicht.';
  assert.ok(pruefeDaten(k).some((f) => /nennt den Begriff nicht/.test(f)));
});

test('das diagnostische Quellziel ist zurückgewiesen – genau eines', () => {
  const z = daten.ziele.find((x) => x.einordnung === 'zurueckgewiesen');
  assert.equal(z.nr, 3);
  assert.match(z.kurz, /diagnostisch/);
  assert.match(daten.quellZielAbgelehnt, /diagnostisch/);
  assert.equal(daten.ziele.filter((x) => x.einordnung === 'zurueckgewiesen').length, 1);
  const nach = {};
  for (const e of EINORDNUNGEN) nach[e] = daten.ziele.filter((x) => x.einordnung === e).length;
  assert.deepEqual(nach, { gebaut: 2, einrichtung: 2, zurueckgewiesen: 1 });
  // Gegenprobe: zwei zurückgewiesene Ziele sind auch ein Fehler.
  const k = kopie();
  k.ziele[1].einordnung = 'zurueckgewiesen';
  k.ziele[1].kurz = `${k.ziele[1].kurz} (diagnostisch)`;
  assert.ok(pruefeDaten(k).some((f) => /2 zurückgewiesene Ziele/.test(f)));
  // Und eine Zurückweisung, die das Zurückgewiesene nicht benennt.
  const k2 = kopie();
  k2.ziele[2].kurz = 'Die Möglichkeiten des Spiels nutzen';
  assert.ok(pruefeDaten(k2).some((f) => /benennt die Diagnose nicht/.test(f)));
});

test('keine Vorhersage, keine Bewertung, kein Wirkversprechen', () => {
  for (const [wo, text] of angebotsTexte(daten)) {
    assert.ok(!VORHERSAGE.test(text), `${wo}: Vorhersage – ${text}`);
    assert.ok(!BEWERTUNG.test(text), `${wo}: Bewertung – ${text}`);
    assert.ok(!WIRKVERSPRECHEN.test(text), `${wo}: Wirkversprechen – ${text}`);
    assert.ok(!KOENNENSALTER.test(text), `${wo}: Könnensalter – ${text}`);
    assert.ok(!/[Ѐ-ӿ]/.test(text), `${wo}: kyrillisch – ${text}`);
  }
  for (const [satz, netz, name] of [
    ['Daran erkennen Sie, ob Ihr Kind später Schwierigkeiten bekommt.', VORHERSAGE, 'VORHERSAGE'],
    ['Das Risiko für Leseschwierigkeiten ist erhöht.', VORHERSAGE, 'VORHERSAGE (Risiko)'],
    ['Ihr Kind hat 12 von 30 Merkmalen.', BEWERTUNG, 'BEWERTUNG'],
    ['Im Vergleich zu Gleichaltrigen liegt es zurück.', BEWERTUNG, 'BEWERTUNG (Vergleich)'],
    ['Rollenspiel fördert die Schulleistung.', WIRKVERSPRECHEN, 'WIRKVERSPRECHEN'],
    ['Das macht Ihr Kind fit für die Schule.', WIRKVERSPRECHEN, 'WIRKVERSPRECHEN (fit)'],
    ['Mit 6 Jahren sollte ein Kind seinen Namen schreiben.', KOENNENSALTER, 'KOENNENSALTER'],
  ]) {
    assert.ok(netz.test(satz), `${name} greift nicht: ${satz}`);
  }
  assert.ok(!BEWERTUNG.test('Die drei Bereiche sind keine Prüfpunkte.'));
  assert.ok(!WIRKVERSPRECHEN.test('Die Quelle nennt das Spiel die führende Tätigkeit dieses Alters.'));
  // Und die Absage muss die Bewertung benennen dürfen.
  assert.ok(BEWERTUNG.test(daten.keineBeurteilung));
  const k = kopie();
  k.keineBeurteilung = 'Wir beurteilen nicht.';
  assert.ok(pruefeDaten(k).some((f) => /benennt die Bewertung nicht/.test(f)));
});

test('keine Rechtsauskunft ohne Quelle – und kein bundesweiter Satz', () => {
  for (const g of daten.wasGilt) {
    assert.ok(g.quelle.length > 15, `${g.id}: quelle zu knapp`);
    assert.match(g.frage, /\?$/);
  }
  // Die Länderantwort muss mindestens zwei Länder nennen, sonst klingt ein
  // Beispiel wie eine Regel für alle.
  const l = daten.wasGilt.find((g) => g.id === 'g-laender');
  assert.ok(l.antwort.includes('Nordrhein-Westfalen') && l.antwort.includes('Bayern'));
  assert.match(l.antwort, /30\. Juni|30\. September/);
  const k = kopie();
  k.wasGilt.find((g) => g.id === 'g-laender').antwort = 'In Deutschland gilt der 30. Juni als Stichtag.';
  const f = pruefeDaten(k);
  assert.ok(f.some((x) => /klingt es wie eine bundesweite Regel/.test(x)), f.join(' | '));
  const k2 = kopie();
  delete k2.wasGilt[0].quelle;
  assert.ok(pruefeDaten(k2).some((x) => /ohne Quelle ist keine/.test(x)));
});

test('zu jedem Bereich steht, wie sicher er ist – und dass die Liste offen ist', () => {
  for (const b of daten.bereiche) {
    assert.ok(b.sicherheit.length > 5, `${b.id}: sicherheit fehlt`);
    assert.ok(b.quelle.length > 15, `${b.id}: quelle zu knapp`);
  }
  // Der sozial-emotionale Bereich hat ausdrücklich KEINE Zahl – das muss
  // dastehen, sonst entsteht der Eindruck, hier fehle nur die Recherche.
  assert.match(bereichVon(daten, 'b-sozial').wasBekanntIst, /nennt die Empfehlung nicht|erfindet keine/);
  assert.match(bereichVon(daten, 'b-sprache').wasBekanntIst, /schwächer als/);
  assert.match(bereichVon(daten, 'b-mathe').wasBekanntIst, /ein Viertel/);
  assert.match(daten.bereicheHinweis, /nicht abschließende|keine abschließende/);
  const k = kopie();
  k.bereicheHinweis = 'Die drei Bereiche im Überblick.';
  assert.ok(pruefeDaten(k).some((f) => /keine abschließende Liste/.test(f)));
});

test('jede Spielart sagt, was sie NICHT ist', () => {
  // Sonst wird aus jeder Spielidee eine Übung – genau der Fehler, den die
  // App vermeiden soll.
  for (const s of daten.spielarten) {
    assert.match(s.wasEsNichtIst, /[Kk]ein/);
    assert.ok(s.quellBezug.length > 25, `${s.id}: quellBezug zu knapp`);
  }
  assert.match(spielartVon(daten, 's-rolle').wasEsNichtIst, /Abfragen|Unterricht/);
  const k = kopie();
  k.spielarten[0].wasEsNichtIst = 'Das Rollenspiel ist vielseitig.';
  assert.ok(pruefeDaten(k).some((f) => /grenzt nichts ab/.test(f)));
  // Und zur Wirkung des Spielens steht ausdrücklich keine Zahl da.
  assert.match(daten.spielHinweis, /nicht als Zahl|keine Zahl|nicht gefunden/);
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
  assert.ok(angebotsTexte(daten).length > 70, 'die Deckung ist zu klein');
  const k = kopie();
  k.spielarten[1].wasSieTun = `${k.spielarten[1].wasSieTun} Das fördert die Konzentration.`;
  assert.ok(pruefeDaten(k).some((f) => /Wirkversprechen/.test(f)));
});

test('wohin mit Fragen: die drei Stellen stehen da', () => {
  for (const stelle of ['Schulleitung', 'Gesundheitsamt', 'Kinderarzt', 'Schulgesetz']) {
    assert.ok(new RegExp(stelle, 'i').test(daten.wohinMitFragen), `${stelle} fehlt`);
  }
  const k = kopie();
  k.wohinMitFragen = 'Fragen Sie in der Kita.';
  assert.ok(pruefeDaten(k).some((f) => /wohinMitFragen nennt/.test(f)));
});

test('die App speichert nichts und erzeugt keinen Bericht', () => {
  assert.ok(!/localStorage|sessionStorage|indexedDB|datenKarte/.test(code), 'die App speichert etwas');
  assert.ok(!/Bericht|export|download/i.test(code), 'ein Bericht oder Export in der App');
  assert.ok(!/☐|✔️|✓/.test(code), 'ein Haken in der App');
});

test('keine externen Anfragen, Impressum, kein Bildschirm fürs Kind', () => {
  assert.match(code, /installiereNetzwerkWaechter\(\)/);
  assert.ok(!/https?:\/\//.test(code), 'eine URL im Code');
  assert.ok(!/https?:\/\//.test(JSON.stringify(daten)), 'eine URL in den Daten');
  assert.match(seite, /default-src 'self'/);
  assert.match(seite, /<noscript>/);
  assert.match(code, /impressum\.html/);
  assert.ok(!/eltern\.html/.test(code));
  assert.match(daten.hinweis, /Das Gerät ist in Ihrer Hand/);
});

test('das Druckblatt zeigt alles offen und ohne Knöpfe', () => {
  assert.match(druck, /@media print/);
  assert.match(druck, /\.ssn-nur-bildschirm\s*\{\s*display:\s*none\s*!important/);
  assert.match(druck, /\.ssn-zu\s*\{\s*display:\s*block\s*!important/);
  assert.ok(!/Name:/.test(druck) && !/Name:/.test(code));
  assert.match(seite, /href="druck\.css"/);
});

test('die Nachbar-Apps, auf die verwiesen wird, gibt es wirklich', async () => {
  const vorhanden = new Set(await readdir(new URL('../../', import.meta.url)));
  for (const treffer of code.matchAll(/href: '\.\.\/([a-z0-9-]+)\/'/g)) {
    assert.ok(vorhanden.has(treffer[1]), `verlinkte App ${treffer[1]} gibt es nicht`);
  }
  // Der Schulstart-Begleiter ist das Fachkraft-Werkzeug – die Abgrenzung
  // muss stimmen, sonst stehen zwei Apps nebeneinander, die dasselbe zu tun
  // scheinen.
  assert.ok(vorhanden.has('schulstart-begleiter'));
  assert.match(code, /Für Fachkräfte, mit Beobachtungsbogen/);
});
