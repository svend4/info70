import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import {
  EINORDNUNGEN, MASSNAHMEN, NICHT_GEPRUEFT, NICHT_GEPRUEFT_FELDER, WIRKVERSPRECHEN,
  BEWERTUNG, DOSIERUNG, ANSCHAFFUNG, massnahmeVon, angebotsTexte, ratschlagTexte, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/massnahmen.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Daten sind gültig und vollständig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.massnahmen.length, MASSNAHMEN);
  assert.equal(daten.oftDazugezaehlt.length, 3);
  assert.equal(daten.wasWirklichHilft.length, 4);
  assert.equal(daten.ausgeschlossen.length, 5);
});

test('die acht Punkte stehen vollständig und im Wortlaut da', () => {
  // Nachgezählt im Original (S. 125): acht Punkte. Die Katalogzahl stimmt.
  assert.deepEqual(daten.massnahmen.map((m) => m.nr), [1, 2, 3, 4, 5, 6, 7, 8]);
  for (const m of daten.massnahmen) {
    assert.ok(m.quellText.length > 25, `${m.id}: quellText zu knapp`);
    assert.ok(EINORDNUNGEN.includes(m.einordnung));
  }
  const k = kopie();
  k.massnahmen = k.massnahmen.filter((m) => m.nr !== 4);
  const f = pruefeDaten(k);
  assert.ok(f.some((x) => /Punkt 4 der Quelle fehlt/.test(x)), f.join(' | '));
});

test('DIE BILANZ: keine der acht ist als Infektvorbeugung belegt', () => {
  // Der Katalogeintrag versprach, „evidenzbasiert gefiltert“ zu übernehmen –
  // also zu zeigen, was die deutsche Präventionsempfehlung STÜTZT. Das
  // Ergebnis der Prüfung ist schärfer: gestützt ist keine.
  assert.match(daten.dieEhrlicheBilanz, /Keine der acht/);
  assert.match(daten.dieEhrlicheBilanz, /keinen Unterschied/, 'die einzige RCT gehört dazu');
  assert.match(daten.dieEhrlicheBilanz, /bei Erwachsenen – nicht jedoch bei Kindern/);
  // Und der Satz, den die App abweist, steht wörtlich da.
  assert.ok(WIRKVERSPRECHEN.test(daten.dieEhrlicheBilanz), 'die Bilanz zitiert das Wirkversprechen nicht');
  const k = kopie();
  k.dieEhrlicheBilanz = 'Die acht Maßnahmen sind unterschiedlich gut belegt.';
  const f = pruefeDaten(k);
  assert.ok(f.some((x) => /sagt nicht, dass keine der acht/.test(x)), f.join(' | '));
  // Die Einordnung selbst: drei gut aus anderem Grund, drei eingeschränkt,
  // zwei nicht übernommen.
  const nach = {};
  for (const e of EINORDNUNGEN) nach[e] = daten.massnahmen.filter((m) => m.einordnung === e).length;
  assert.deepEqual(nach, { belegtAnders: 3, nurEingeschraenkt: 3, nichtUebernommen: 2 });
});

test('keine Einordnung ohne benennbare Quelle', () => {
  for (const m of daten.massnahmen) {
    assert.ok(m.quelle.length > 20, `${m.id}: quelle zu knapp`);
    if (m.einordnung !== 'nichtUebernommen') {
      assert.ok(m.wasStattdessen.length > 20, `${m.id}: wasStattdessen fehlt`);
    }
  }
  const k = kopie();
  delete k.massnahmen[1].quelle;
  assert.ok(pruefeDaten(k).some((f) => /eine Einordnung ohne Quelle ist eine Meinung/.test(f)));
  // Auch das Belegte hat eine Grenze – jede davon steht da.
  for (const h of daten.wasWirklichHilft) {
    assert.ok(h.einschraenkung.length > 40, `${h.id}: einschraenkung zu knapp`);
  }
  const k2 = kopie();
  delete k2.wasWirklichHilft[0].einschraenkung;
  assert.ok(pruefeDaten(k2).some((f) => /auch das Belegte hat eine Grenze/.test(f)));
});

test('kein Wirkversprechen und keine Bewertung in den Angebotstexten', () => {
  for (const [wo, text] of angebotsTexte(daten)) {
    assert.ok(!WIRKVERSPRECHEN.test(text), `${wo}: Wirkversprechen – ${text}`);
    assert.ok(!BEWERTUNG.test(text), `${wo}: Bewertung – ${text}`);
    assert.ok(!/[Ѐ-ӿ]/.test(text), `${wo}: kyrillisch – ${text}`);
  }
  for (const [satz, netz, name] of [
    ['Abhärtung stärkt das Immunsystem.', WIRKVERSPRECHEN, 'WIRKVERSPRECHEN'],
    ['Kalte Güsse beugen Erkältungen vor.', WIRKVERSPRECHEN, 'WIRKVERSPRECHEN (vorbeugen)'],
    ['So wird Ihr Kind seltener krank.', WIRKVERSPRECHEN, 'WIRKVERSPRECHEN (seltener krank)'],
    ['Sie haben 6 von 8 Punkten erreicht.', BEWERTUNG, 'BEWERTUNG'],
    ['Ihre Familie liegt bei 75 %.', BEWERTUNG, 'BEWERTUNG (Prozent)'],
    ['Stufe 2 von 3 erreicht.', BEWERTUNG, 'BEWERTUNG (Stufe)'],
  ]) {
    assert.ok(netz.test(satz), `${name} greift nicht: ${satz}`);
  }
  assert.ok(!WIRKVERSPRECHEN.test('Draußen sein ist gut, aber nicht als Abhärtung.'));
  assert.ok(!BEWERTUNG.test('Nicht mehr als achtzehn Grad in der Nacht.'));
});

test('im RAT steht keine Dosierung – die Zahlen der Quelle stehen im Zitat', () => {
  // Es gibt Arbeiten mit kalten Teilanwendungen bei Kindern; die jüngste ist
  // ein Vorabdruck ohne Begutachtung, bei dem die Zufallszuteilung aufgegeben
  // werden musste. Eine Sekundenangabe daraus wäre eine Genauigkeit, die es
  // nicht gibt.
  for (const [wo, text] of ratschlagTexte(daten)) {
    assert.ok(!DOSIERUNG.test(text), `${wo}: Dosierung – ${text}`);
    assert.ok(!ANSCHAFFUNG.test(text), `${wo}: Anschaffung – ${text}`);
  }
  // Im Zitat der Quelle dürfen die Zeiten stehen, sonst wäre es kein Zitat –
  // und die Quelle schreibt sie AUS, darum trifft das Netz auch Wortzahlen.
  assert.ok(DOSIERUNG.test(massnahmeVon(daten, 'm5-luftbad').quellText), 'fünf bis zwanzig Minuten');
  assert.ok(DOSIERUNG.test(massnahmeVon(daten, 'm6-barfuss').quellText), 'zwei bis zwanzig Minuten');
  assert.ok(DOSIERUNG.test('Armbad 15 Sekunden'), 'Ziffern');
  assert.ok(DOSIERUNG.test('Wassertreten dreißig Sekunden'), 'ausgeschrieben');
  // Die belegte Gradangabe der Nacht bleibt frei – sie gehört in den Rat.
  assert.ok(!DOSIERUNG.test('nachts nicht wärmer als achtzehn Grad'));
  const k = kopie();
  k.massnahmen[0].wasStattdessen = 'Lüften Sie 10 Minuten vor dem Schlafen.';
  assert.ok(pruefeDaten(k).some((f) => /eine Dosierung/.test(f)));
  const k2 = kopie();
  k2.massnahmen[5].wasStattdessen = 'Ein Rippenbrett kaufen und täglich benutzen.';
  assert.ok(pruefeDaten(k2).some((f) => /Anschaffung/.test(f)));
});

test('die Netze decken JEDEN gerenderten Text ab – Ausnahmen einzeln benannt', () => {
  // Beim Bau gelernt: eine ganze Liste auszunehmen, weil EIN Feld darin
  // zitiert, nimmt alle anderen gleich mit. `wasStattdessen` ist ein Rat und
  // muss durch die Netze – ausgenommen ist nur `quellText`.
  assert.deepEqual(Object.keys(NICHT_GEPRUEFT_FELDER), ['quellText']);
  const geprueft = new Set(angebotsTexte(daten).map(([wo]) => wo.split(/[.[]/)[0]));
  for (const feld of Object.keys(daten)) {
    assert.ok(geprueft.has(feld) || feld in NICHT_GEPRUEFT, `${feld} wird weder geprüft noch als Ausnahme benannt`);
  }
  assert.ok(angebotsTexte(daten).length > 80, 'die Deckung ist zu klein – läuft sie noch über die Listen?');
  for (const [feld, grund] of Object.entries(NICHT_GEPRUEFT)) {
    assert.ok(feld in daten, `Ausnahme ${feld} gibt es nicht`);
    assert.ok(grund.length > 10, `Ausnahme ${feld} ohne Grund`);
  }
  const k = kopie();
  k.massnahmen[2].wasStattdessen = 'Das stärkt das Immunsystem.';
  assert.ok(pruefeDaten(k).some((f) => /Wirkversprechen/.test(f)), 'wasStattdessen läuft nicht durch die Netze');
});

test('Sauna, Güsse und Sonnenbäder stehen da – obwohl sie in der Quelle fehlen', () => {
  // Sie stehen nicht in den acht Punkten, aber in den Köpfen. Wer die Liste
  // liest, sucht genau danach.
  const text = daten.oftDazugezaehlt.map((d) => `${d.was} ${d.urteil} ${d.warum}`).join(' ');
  for (const wort of ['Sauna', 'Wechselduschen', 'Sonnen']) {
    assert.ok(text.includes(wort), `„${wort}" fehlt`);
  }
  for (const d of daten.oftDazugezaehlt) {
    assert.match(d.urteil, /[Nn]icht zu empfehlen/, `${d.id}: das Urteil fehlt`);
    assert.ok(d.quelle.length > 20, `${d.id}: quelle zu knapp`);
  }
  const k = kopie();
  k.oftDazugezaehlt = k.oftDazugezaehlt.slice(0, 2);
  assert.ok(pruefeDaten(k).some((f) => /zu wenige Einträge/.test(f)));
});

test('die App speichert nichts und wertet nichts aus', () => {
  assert.ok(!/localStorage|sessionStorage|indexedDB|datenKarte/.test(code), 'die App speichert etwas');
  assert.ok(!/☐|✔️|✓/.test(code), 'ein Haken in der App');
  // Ohne die Überschrift „Die acht Punkte der Quelle": gemeint ist eine
  // Punktzahl, nicht das Wort.
  const ohneUeberschrift = code.replace(/Die acht Punkte der Quelle|ffa-punkte/g, '');
  assert.ok(!/punktzahl|punkte\s*(?:erreicht|gesammelt)|auswert/i.test(ohneUeberschrift), 'eine Auswertung in der App');
  assert.ok(BEWERTUNG.test(daten.keineBewertung), 'keineBewertung benennt die Bewertung nicht');
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

test('das Druckblatt trägt Bilanz, acht Punkte und das Belegte – ohne Knöpfe', () => {
  assert.match(druck, /@media print/);
  assert.match(druck, /\.ffa-nur-bildschirm\s*\{\s*display:\s*none\s*!important/);
  assert.match(druck, /\.ffa-nur-druck\s*\{\s*display:\s*block\s*!important/);
  assert.match(druck, /\.ffa-massnahme button\s*\{\s*display:\s*none\s*!important/);
  assert.ok(!/Name:/.test(druck) && !/Name:/.test(code));
  assert.match(seite, /href="druck\.css"/);
  // Der Punkt steht auf dem Blatt MIT seinem Urteil – sonst wäre das Blatt
  // eine Liste von Abhärtungsregeln ohne Einordnung.
  assert.match(code, /ffa-nur-druck[\s\S]{0,260}einordnungen\[m\.einordnung\]/);
});

test('die Nachbar-Apps, auf die verwiesen wird, gibt es wirklich', async () => {
  const vorhanden = new Set(await readdir(new URL('../../', import.meta.url)));
  for (const treffer of code.matchAll(/href: '\.\.\/([a-z0-9-]+)\/'/g)) {
    assert.ok(vorhanden.has(treffer[1]), `verlinkte App ${treffer[1]} gibt es nicht`);
  }
});

test('die Behörde steht mit beiden Namen da', () => {
  const alles = JSON.stringify(daten);
  assert.ok(alles.includes('BIÖG'), 'BIÖG fehlt');
  assert.ok(alles.includes('BZgA'), 'der frühere Name fehlt – sonst findet niemand das Material wieder');
  // Und nirgends „Nach BZgA-Empfehlung" im Präsens.
  assert.ok(!/BZgA empfiehlt|Nach BZgA-Empfehlung/.test(alles));
});
