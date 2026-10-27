import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  RICHTUNGEN, MERKSATZ, richtungVon, imUhrzeigersinn, gegenrichtung,
  verschiebe, imFeld, ortAn, alleAufgaben, baueAufgabe, aufgabenText, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/karte.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
const erster = (liste) => liste[0];
const ohneMischen = (liste) => [...liste];

test('Kartendaten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('Norden ist oben: die Vorzeichen stimmen mit der Kartenkonvention überein', () => {
  const mitte = { zeile: 2, spalte: 2 };
  // Norden verringert die Zeile (nach oben), Süden erhöht sie
  assert.deepEqual(verschiebe(mitte, 'norden', 1), { zeile: 1, spalte: 2 });
  assert.deepEqual(verschiebe(mitte, 'sueden', 1), { zeile: 3, spalte: 2 });
  // Osten erhöht die Spalte (nach rechts), Westen verringert sie
  assert.deepEqual(verschiebe(mitte, 'osten', 2), { zeile: 2, spalte: 4 });
  assert.deepEqual(verschiebe(mitte, 'westen', 2), { zeile: 2, spalte: 0 });
  assert.equal(verschiebe(mitte, 'nordwesten', 1), null, 'unbekannte Richtung');
  // Hin und zurück landet wieder am Start
  for (const r of RICHTUNGEN) {
    const hin = verschiebe(mitte, r.id, 2);
    assert.deepEqual(verschiebe(hin, gegenrichtung(r.id).id, 2), mitte, `${r.id} ist nicht umkehrbar`);
  }
});

test('Uhrzeigersinn und Gegenrichtung', () => {
  assert.deepEqual(RICHTUNGEN.map((r) => r.id), ['norden', 'osten', 'sueden', 'westen']);
  assert.equal(imUhrzeigersinn('norden').id, 'osten');
  assert.equal(imUhrzeigersinn('westen').id, 'norden', 'muss umlaufen');
  assert.equal(gegenrichtung('norden').id, 'sueden');
  assert.equal(gegenrichtung('osten').id, 'westen');
  assert.equal(richtungVon('quatsch'), null);
  assert.match(MERKSATZ, /Nie ohne Seife waschen/);
});

test('imFeld und ortAn arbeiten am Planrand korrekt', () => {
  assert.equal(imFeld({ zeile: 0, spalte: 0 }, 5), true);
  assert.equal(imFeld({ zeile: 4, spalte: 4 }, 5), true);
  assert.equal(imFeld({ zeile: -1, spalte: 2 }, 5), false);
  assert.equal(imFeld({ zeile: 2, spalte: 5 }, 5), false);
  assert.equal(ortAn(daten.orte, { zeile: 1, spalte: 1 }).id, 'schule');
  assert.equal(ortAn(daten.orte, { zeile: 2, spalte: 0 }), null);
});

test('alleAufgaben zählt nur Wege auf, die wirklich auf einem Ort enden', () => {
  const aufgaben = alleAufgaben(daten.orte, daten.groesse);
  assert.ok(aufgaben.length >= 12, `zu wenige Aufgaben: ${aufgaben.length}`);
  for (const a of aufgaben) {
    const start = daten.orte.find((o) => o.id === a.startId);
    const ziel = verschiebe(start, a.richtungId, a.schritte);
    assert.ok(imFeld(ziel, daten.groesse), 'Ziel außerhalb des Plans');
    assert.equal(ortAn(daten.orte, ziel).id, a.zielId, 'Ziel stimmt nicht');
    assert.notEqual(a.zielId, a.startId, 'Start und Ziel gleich');
    assert.ok(a.schritte >= 1);
  }
  // Gegenprobe: die Umkehrung jeder Aufgabe ist ebenfalls eine gültige Aufgabe
  for (const a of aufgaben) {
    const zurueck = { startId: a.zielId, richtungId: gegenrichtung(a.richtungId).id, schritte: a.schritte, zielId: a.startId };
    assert.ok(
      aufgaben.some((x) => x.startId === zurueck.startId && x.richtungId === zurueck.richtungId
        && x.schritte === zurueck.schritte && x.zielId === zurueck.zielId),
      `Rückweg fehlt für ${a.startId} -> ${a.zielId}`,
    );
  }
});

test('baueAufgabe liefert immer eine lösbare Aufgabe mit dem Ziel unter den Optionen', () => {
  let vorher = null;
  for (let i = 0; i < 400; i++) {
    const a = baueAufgabe(daten, (l) => l[Math.floor(Math.random() * l.length)], ohneMischen, vorher);
    const ziel = verschiebe(a.start, a.richtung.id, a.schritte);
    assert.equal(ortAn(daten.orte, ziel).id, a.ziel.id, 'Aufgabe ist nicht lösbar');
    assert.equal(a.optionen.length, 3);
    assert.ok(a.optionen.some((o) => o.id === a.ziel.id), 'Ziel fehlt unter den Optionen');
    assert.equal(new Set(a.optionen.map((o) => o.id)).size, 3, 'doppelte Option');
    assert.ok(!a.optionen.some((o) => o.id === a.start.id), 'der Startort darf keine Antwort sein');
    if (vorher) {
      const gleich = vorher.start.id === a.start.id && vorher.richtung.id === a.richtung.id && vorher.schritte === a.schritte;
      assert.ok(!gleich, 'zweimal dieselbe Aufgabe hintereinander');
    }
    vorher = a;
  }
});

test('jeder Ort kann Ablenker werden – sonst verrät sich die Lösung', () => {
  // Würden die Ablenker der Dateireihenfolge folgen, könnten die hinteren
  // Orte nie falsche Antwort sein: Sobald einer auftaucht, wäre er ohne
  // jede Himmelsrichtung als Lösung erkennbar.
  const alsAblenker = new Map(daten.orte.map((o) => [o.id, 0]));
  for (let i = 0; i < 3000; i++) {
    const a = baueAufgabe(daten, (l) => l[Math.floor(Math.random() * l.length)], (l) => {
      const k = [...l];
      for (let j = k.length - 1; j > 0; j--) {
        const t = Math.floor(Math.random() * (j + 1));
        [k[j], k[t]] = [k[t], k[j]];
      }
      return k;
    });
    for (const o of a.optionen) if (o.id !== a.ziel.id) alsAblenker.set(o.id, alsAblenker.get(o.id) + 1);
  }
  for (const [id, anzahl] of alsAblenker) {
    assert.ok(anzahl > 0, `${id} kommt nie als falsche Antwort vor – die Lösung wäre erkennbar`);
  }
});

test('aufgabenText benutzt Einzahl und Mehrzahl richtig', () => {
  const a = baueAufgabe(daten, erster, ohneMischen);
  const eins = aufgabenText({ ...a, schritte: 1 });
  const drei = aufgabenText({ ...a, schritte: 3 });
  assert.match(eins, /ein Feld nach/);
  assert.match(drei, /3 Felder nach/);
  assert.match(eins, /Wo bist du\?$/);
});

test('Validator greift: kaputte Pläne und Quizfragen fallen auf', () => {
  const doppeltesFeld = kopie();
  doppeltesFeld.orte[1].zeile = doppeltesFeld.orte[0].zeile;
  doppeltesFeld.orte[1].spalte = doppeltesFeld.orte[0].spalte;
  assert.ok(pruefeDaten(doppeltesFeld).some((f) => /demselben Feld/.test(f)));

  const draussen = kopie();
  draussen.orte[0].spalte = 9;
  assert.ok(pruefeDaten(draussen).some((f) => /außerhalb des Plans/.test(f)));

  const zeigtInsLeere = kopie();
  zeigtInsLeere.quiz[0].korrekt = 5;
  assert.ok(pruefeDaten(zeigtInsLeere).some((f) => /zeigt ins Leere/.test(f)));

  const ohneBereich = kopie();
  ohneBereich.quiz = ohneBereich.quiz.filter((q) => q.bereich !== 'welt');
  assert.ok(pruefeDaten(ohneBereich).some((f) => /Bereich welt fehlt/.test(f)));

  const doppelteAntwort = kopie();
  doppelteAntwort.quiz[0].antworten[1] = doppelteAntwort.quiz[0].antworten[0];
  assert.ok(pruefeDaten(doppelteAntwort).some((f) => /doppelte Antwort/.test(f)));
});

test('Geographie: die belegten Zahlen und Zuordnungen stehen fest', () => {
  const q = (id) => daten.quiz.find((x) => x.id === id);
  assert.match(q('d04').antworten[q('d04').korrekt], /Sechzehn/);
  assert.match(q('d06').antworten[q('d06').korrekt], /Neun/);
  // Alle neun Nachbarn werden namentlich genannt
  for (const land of ['Dänemark', 'Niederlande', 'Belgien', 'Luxemburg', 'Frankreich', 'Schweiz', 'Österreich', 'Tschechien', 'Polen']) {
    assert.match(q('d06').erklaerung, new RegExp(land), `Nachbarland fehlt: ${land}`);
  }
  // Der Superlativ muss die Einschränkung tragen: Russland hat mehr
  // Nachbarn, liegt aber nicht ganz in Europa – sonst wäre der Satz falsch.
  assert.match(q('d06').erklaerung, /ganz in Europa/);
  assert.ok(!JSON.stringify(daten).includes('Kein anderes Land in Europa'), 'unhaltbarer Superlativ');
  for (const treffer of JSON.stringify(daten).match(/.{0,60}so viele hat[^"]{0,80}/g) || []) {
    assert.match(treffer, /ganz in Europa/, `Superlativ ohne Einschränkung: „…${treffer}“`);
  }
  // Die Donau ist der Fluss, der nach Osten fließt
  assert.match(q('d08').antworten[q('d08').korrekt], /Donau/);
  assert.match(q('d08').erklaerung, /Schwarze Meer/);
  // Nordpol Meereis, Südpol Festland
  assert.match(q('d11').antworten[q('d11').korrekt], /Eis auf dem Meer.*Festland/);
  assert.match(q('d10').antworten[q('d10').korrekt], /Sieben/);
});

test('Länderkarten sind sachlich und ohne Kriegsinhalte', () => {
  const ukraine = daten.laender.find((l) => l.id === 'ukraine');
  assert.ok(ukraine, 'Ukraine-Karte fehlt (Katalogvorgabe)');
  assert.match(ukraine.fakten.join(' '), /Kyjiw/);
  assert.match(ukraine.fakten.join(' '), /Dnipro/);
  assert.match(ukraine.fakten.join(' '), /Schwarze Meer/);
  const text = JSON.stringify(daten.laender).toLowerCase();
  for (const wort of ['krieg', 'flucht', 'geflüchtet', 'soldat', 'bombe', 'angriff', 'besetzt']) {
    assert.ok(!text.includes(wort), `Länderkarte darf das nicht enthalten: ${wort}`);
  }
});

test('Kinder werden nicht bewertet: kein Zähler, keine Punkte, kein Rekord, kein Stern im App-Code', () => {
  assert.doesNotMatch(appQuelle, /punkte|rekord|\brang\b|raenge|geschafft|Gefundene Wege|Richtig beantwortet|🌟|⭐|🏆/i, 'app.mjs führt weder Zähler noch Rang noch Rekord');
  assert.ok(!('raenge' in daten), 'die Daten haben keine Raenge');
  assert.match(elternSeite, /keine Punkte, keinen Rekord und keine Ränge/, 'die Eltern-Seite sagt, was die App nicht kennt');
});

test('Speicherregel: speichert die App (setItem), gibt es einen Löschknopf; speichert sie nichts, gibt es keine Karte', () => {
  const speichert = /localStorage\.setItem/.test(appQuelle);
  const loeschbar = /Meine Daten l(ö|oe)schen|datenKarte|daten-karte|loescheDaten|removeItem/.test(appQuelle);
  if (speichert) assert.ok(loeschbar, 'speichert die App, braucht sie einen Löschknopf');
  else assert.ok(!loeschbar, 'speichert die App nichts, hat sie keine Karte und keinen Löschknopf');
  assert.ok(!speichert, 'die App speichert nichts');
  assert.doesNotMatch(appQuelle, /sprache\.mjs/, 'keine Sprachwahl mit Speicher');
  assert.match(elternSeite, /speichert <strong>nichts<\/strong>/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
});
