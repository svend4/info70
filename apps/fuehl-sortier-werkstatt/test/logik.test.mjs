import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/werkstatt.json' with { type: 'json' };
import {
  begriffZeilen, filtern, gegenstandZeilen, gewaehlteKarten, hinzufuegen, kannDrucken,
  kartenAufbau, kartenText, umschalten, zielZeile,
} from '../logik.mjs';

// Prüft Daten und Logik. Die Regeln der Umgebung (Eingabefelder, Speicherung,
// Netz, Druckzeichen, Pflichtmarkierung je Karte, Testzahl) stehen in test/regeln.test.mjs.

// Zitate wörtlich aus der Quelle (Praleska, S. 6, 52 und 53), mit Seite. Zeilenumbrüche
// mit Trennstrich sind aufgelöst. Die Seiten sind gegen den Quelltext abgeglichen.
const ZITATE_QUELLE = new Map([
  ['дерево', 'S. 52'],
  ['бумага', 'S. 52'],
  ['ткань', 'S. 52'],
  ['сделанных из различного материала (дерево, бумага, ткань)', 'S. 52'],
  ['имеющих одинаковый и разный цвет', 'S. 52'],
  ['шубка — из меха, она мягкая', 'S. 52'],
  ['по форме, цвету, величине, назначению', 'S. 53'],
  ['быть осторожными с острыми, холодными, горячими предметами', 'S. 53'],
  ['от одного года до трех лет', 'S. 6'],
]);

// Ziele der Quelle mit Sternchen gelten für ältere Kinder (Fußnote S. 53) und dürfen nicht
// als Ziel für diese App aufgenommen werden. Die Wortstämme stehen hier nur zum Verbieten.
const STERN_ZIELE_RUS = [
  'транспорт', 'автомоб', 'автобус', 'сделаны человеком', 'бережного отношения',
  'использованию ранее полученных', 'художественной',
];

const KARTEN_REIHENFOLGE = ['holz', 'papier', 'stoff', 'farbe', 'form', 'material', 'weich-hart', 'sicherheit'];
const MATERIAL_IDS = ['holz', 'papier', 'stoff'];
const QUELLENWORT = { holz: 'дерево', papier: 'бумага', stoff: 'ткань' };

const karte = (id) => daten.karten.find((k) => k.id === id);

test('Daten: acht Karten in fester Reihenfolge: drei Material, vier Sortieraufträge, eine Sicherheit', () => {
  assert.equal(daten.karten.length, 8, 'es müssen 8 Karten sein');
  assert.deepEqual(daten.karten.map((k) => k.id), KARTEN_REIHENFOLGE);
  assert.equal(new Set(daten.karten.map((k) => k.id)).size, 8, 'doppelte Kennungen');
  const arten = daten.karten.map((k) => k.art);
  assert.equal(arten.filter((a) => a === 'material').length, 3);
  assert.equal(arten.filter((a) => a === 'sortierung').length, 4);
  assert.equal(arten.filter((a) => a === 'sicherheit').length, 1);
  for (const k of daten.karten) {
    assert.ok(k.titel && k.ziel && k.ziel.quelltext && k.ziel.seite && k.ziel.deutsch, `${k.id}: Titel oder Ziel fehlt`);
    assert.ok(Array.isArray(k.materialien), `${k.id}: Materialien fehlen als Liste`);
  }
  assert.equal(daten.titel, 'Fühl- und Sortier-Werkstatt: Holz, Papier, Stoff', 'Titel wurde verändert');
});

test('Materialkarten: Holz, Papier, Stoff; je ein Material, Begriff aus der Quelle, zwei bis drei Gegenstände, eine Frage', () => {
  const mat = daten.karten.filter((k) => k.art === 'material');
  assert.deepEqual(mat.map((k) => k.id), MATERIAL_IDS);
  for (const k of mat) {
    assert.deepEqual(k.materialien, [k.id], `${k.id}: genau dieses Material`);
    assert.equal(k.begriffe.length, 1, `${k.id}: ein Begriff aus der Quelle`);
    assert.equal(k.begriffe[0].quelltext, QUELLENWORT[k.id], `${k.id}: Quellenwort`);
    assert.ok(k.gegenstaende.length >= 2 && k.gegenstaende.length <= 3,
      `${k.id}: ${k.gegenstaende.length} Gegenstände, erwartet zwei bis drei`);
    assert.ok(k.frage && k.frage.endsWith('?'), `${k.id}: keine Frage an das Kind`);
  }
});

test('Sortieraufträge: vier, je eine Sortierung aus daten.sortierungen; Aufgabe, Frage und alle drei Materialien', () => {
  const sort = daten.karten.filter((k) => k.art === 'sortierung');
  assert.deepEqual(sort.map((k) => k.sortierung), ['farbe', 'form', 'material', 'weich-hart']);
  assert.deepEqual(daten.sortierungen.map((s) => s.id), ['farbe', 'form', 'material', 'weich-hart']);
  for (const k of sort) {
    assert.ok(k.aufgabe && k.frage, `${k.id}: Aufgabe oder Frage fehlt`);
    assert.deepEqual(k.materialien, MATERIAL_IDS, `${k.id}: Materialien`);
  }
});

test('Sicherheitskarte: Ziel S. 53 ohne Stern, Vorsicht-Satz als Übertragung, Kleinteile-Hinweis mit Fachkraft-Prüfung', () => {
  const s = daten.karten.filter((k) => k.art === 'sicherheit');
  assert.equal(s.length, 1, 'genau eine Sicherheitskarte');
  assert.equal(s[0].ziel.quelltext, 'быть осторожными с острыми, холодными, горячими предметами');
  assert.equal(s[0].ziel.seite, 'S. 53');
  assert.equal(s[0].ziel.deutsch, 'Vorsicht mit scharfen, kalten und heißen Gegenständen');
  assert.equal(s[0].hinweis, 'Kleinteile außer Reichweite lassen (Eigenentwurf, Fachkraft prüft).');
});

test('Lernziele und Begriffe stehen wörtlich in der Quelle, mit der angegebenen Seite', () => {
  for (const k of daten.karten) {
    assert.equal(ZITATE_QUELLE.get(k.ziel.quelltext), k.ziel.seite,
      `${k.id}: Ziel „${k.ziel.quelltext}“ steht nicht mit dieser Seite in der Quelle`);
    for (const b of k.begriffe ?? []) {
      assert.equal(ZITATE_QUELLE.get(b.quelltext), b.seite,
        `${k.id}: Begriff „${b.quelltext}“ steht nicht mit dieser Seite in der Quelle`);
    }
  }
  assert.ok(daten.altersHinweis.includes('„от одного года до трех лет“ (S. 6)'), 'Altersangabe der Quelle ohne Seite');
});

test('Quellenzeile je Karte: „Praleska, S. 52“, bei Ziel auf S. 53 entsprechend; nur S. 52 und S. 53', () => {
  for (const k of daten.karten) {
    assert.match(k.ziel.seite, /^S\. (52|53)$/, `${k.id}: Seite ${k.ziel.seite} liegt außerhalb von S. 52 bis 53`);
    assert.equal(kartenAufbau(daten, k).quelle, `Quelle: Praleska, ${k.ziel.seite}`, `${k.id}: Quellenzeile`);
  }
  assert.deepEqual(daten.karten.filter((k) => k.ziel.seite === 'S. 53').map((k) => k.id), ['form', 'sicherheit']);
  assert.equal(kartenAufbau(daten, karte('holz')).quelle, 'Quelle: Praleska, S. 52');
});

test('Sternchen-Ziele kommen nicht vor: weder die russische Fassung noch Begriffe aus den Sternchen-Zielen', () => {
  const roh = JSON.stringify(daten);
  for (const teil of STERN_ZIELE_RUS) {
    assert.ok(!roh.includes(teil), `Sternchen-Ziel gefunden: „${teil}“`);
  }
  assert.doesNotMatch(roh, /Transport|Fahrzeug|Autobus|Selbstbedien|Selbstversorg|Kunst/i, 'deutscher Begriff aus einem Sternchen-Ziel');
});

test('Russische Zitate höchstens 12 Wörter', () => {
  for (const k of daten.karten) {
    for (const text of [k.ziel.quelltext, ...(k.begriffe ?? []).map((b) => b.quelltext)]) {
      const woerter = text.trim().split(/\s+/).length;
      assert.ok(woerter <= 12, `${k.id}: „${text}“ hat ${woerter} Wörter`);
    }
  }
});

test('Eigenentwurf-Kennzeichnung: jede Übertragung und jeder Begriff trägt das Wort; jeder Kartentext enthält es', () => {
  for (const k of daten.karten) {
    assert.ok(zielZeile(k).endsWith('(Eigenentwurf)'), `${k.id}: Lernziel ohne Eigenentwurf`);
    for (const z of begriffZeilen(k)) {
      assert.ok(z.endsWith('(Eigenentwurf)'), `${k.id}: Begriff „${z}“ ohne Eigenentwurf`);
    }
    assert.match(kartenText(daten, k), /\(Eigenentwurf\)/, `${k.id}: ohne Kennzeichnung`);
  }
  assert.ok(daten.sprachen.includes('Eigenentwurf'), 'Sprachenvermerk ohne Eigenentwurf');
});

test('Filter nach Material und Sortierauftrag (UND); „alle“ hebt den Filter auf', () => {
  const ids = (f) => filtern(daten, f).map((k) => k.id);
  assert.deepEqual(ids({}), KARTEN_REIHENFOLGE);
  assert.deepEqual(ids({ material: 'alle', sortierung: 'alle' }), KARTEN_REIHENFOLGE);
  assert.deepEqual(ids({ material: 'holz' }), ['holz', 'farbe', 'form', 'material', 'weich-hart']);
  assert.deepEqual(ids({ material: 'papier' }), ['papier', 'farbe', 'form', 'material', 'weich-hart']);
  assert.deepEqual(ids({ sortierung: 'farbe' }), ['farbe']);
  assert.deepEqual(ids({ material: 'holz', sortierung: 'form' }), ['form']);
  assert.deepEqual(ids({ material: 'stoff', sortierung: 'weich-hart' }), ['weich-hart']);
  assert.deepEqual(ids({ material: 'gibtsnicht' }), []);
  assert.deepEqual(ids({ sortierung: 'gibtsnicht' }), []);
});

test('Karten ohne Material (Sicherheit) und Materialkarten ohne Sortierung erscheinen nur bei „alle“', () => {
  const ids = (f) => filtern(daten, f).map((k) => k.id);
  assert.ok(ids({}).includes('sicherheit'));
  for (const f of [{ material: 'holz' }, { material: 'papier' }, { material: 'stoff' },
    { sortierung: 'farbe' }, { sortierung: 'form' }, { sortierung: 'material' }, { sortierung: 'weich-hart' }]) {
    assert.ok(!ids(f).includes('sicherheit'), `Sicherheit bei ${JSON.stringify(f)} sichtbar`);
  }
  for (const f of [{ sortierung: 'farbe' }, { sortierung: 'form' }, { sortierung: 'material' }, { sortierung: 'weich-hart' }]) {
    assert.deepEqual(ids(f).filter((x) => MATERIAL_IDS.includes(x)), [], `Materialkarte bei ${JSON.stringify(f)} sichtbar`);
  }
});

test('Auswahl: umschalten und hinzufuegen ändern nur die neue Menge, keine Dubletten', () => {
  const alle = new Set(['holz', 'form']);
  const ohneForm = umschalten(alle, 'form');
  assert.equal(ohneForm.has('form'), false);
  assert.equal(alle.has('form'), true, 'das Original darf nicht verändert werden');
  assert.equal(umschalten(ohneForm, 'form').has('form'), true);
  const erweitert = hinzufuegen(alle, ['form', 'farbe']);
  assert.deepEqual([...erweitert].sort(), ['farbe', 'form', 'holz']);
});

test('Druck: gewählte Karten in fester Reihenfolge, Unbekanntes ignoriert, n Auswahl ergibt n Karten', () => {
  const gewaehlt = gewaehlteKarten(daten, ['sicherheit', 'holz', 'unbekannt', 'holz']);
  assert.deepEqual(gewaehlt.map((k) => k.id), ['holz', 'sicherheit']);
  for (let n = 0; n <= KARTEN_REIHENFOLGE.length; n++) {
    assert.equal(gewaehlteKarten(daten, KARTEN_REIHENFOLGE.slice(0, n)).length, n, `bei ${n} gewählten Karten`);
  }
});

test('Ohne Auswahl wird nicht gedruckt; schon eine gewählte Karte genügt', () => {
  assert.equal(kannDrucken(gewaehlteKarten(daten, [])), false, 'ohne Auswahl darf nicht gedruckt werden');
  assert.equal(kannDrucken(gewaehlteKarten(daten, ['farbe'])), true);
});

test('Kartentext: Kopf, Quellenzeile, Pflichtmarkierung; keine Reste wie undefined, null, [object oder UNBEKANNT', () => {
  for (const k of daten.karten) {
    const text = kartenText(daten, k);
    assert.ok(text.includes(daten.pflichtmarkierung), `${k.id}: Pflichtmarkierung fehlt im Druck`);
    assert.ok(text.includes(`Quelle: Praleska, ${k.ziel.seite}`), `${k.id}: Quellenzeile fehlt`);
    assert.doesNotMatch(text, /undefined|null|\[object|UNBEKANNT/, `${k.id}: Rest im Text`);
  }
});

test('Im Kartentext steht keine Zahl außer den Seitenangaben (keine erfundenen Zahlen)', () => {
  for (const k of daten.karten) {
    const ohneSeiten = kartenText(daten, k).replace(/S\. (6|52|53)\b/g, '');
    assert.doesNotMatch(ohneSeiten, /\d/, `${k.id}: Zahl im Kartentext`);
  }
});

test('Keine Entwicklungsstufen, Normen oder Verschluck-Aussagen; keine Bewertung von Kindern', () => {
  const roh = JSON.stringify(daten);
  assert.doesNotMatch(roh, /\bDIN\b|EN 71|Verschluck|Entwicklung|\bNormen?\b/i, 'Norm, Entwicklungsangabe oder Quellenaussage ohne Quelle');
  assert.doesNotMatch(roh, /Punkte|Rangliste|Einstufung|richtig|falsch/i, 'Wertung von Kindern');
});

test('Vermerke: Quellenhinweis mit ISBN, Altershinweis mit Quelle S. 6, Katalogeintrag, Sprachen', () => {
  assert.match(daten.quellenHinweis, /Minsk: НИО \(Национальный институт образования\), 2007\. ISBN 978-985-465-244-3\./);
  assert.match(daten.quellenHinweis, /S\. 52 und 53/);
  assert.ok(daten.altersHinweis.includes('Katalog docs/10'), 'Altersangabe ohne Katalogverweis');
  assert.match(daten.katalog, /^Katalogeintrag docs\/10, Abschnitt/);
  assert.match(daten.katalog, /Nr\. 7\./);
  assert.ok(daten.sprachen.includes('uk und ru: nicht vorhanden, offen.'), 'Sprachenvermerk fehlt');
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

test('Zeilenformate: Begriff mit Quellenwort und Seite; Gegenstände als Liste; Sortierkarten ohne Begriff und Gegenstand', () => {
  assert.deepEqual(gegenstandZeilen(karte('holz')), ['Holzlöffel', 'Holzklötze', 'Holzschale']);
  assert.deepEqual(begriffZeilen(karte('holz')), ['„дерево“ (S. 52): Holz (Eigenentwurf)']);
  assert.deepEqual(begriffZeilen(karte('farbe')), []);
  assert.deepEqual(gegenstandZeilen(karte('sicherheit')), []);
});

test('Aufbau: Kopf je Art; Abschnitte nur mit Zeilen', () => {
  const holz = kartenAufbau(daten, karte('holz'));
  assert.equal(holz.kopf, 'Materialkarte (Eigenentwurf)');
  assert.ok(holz.abschnitte.some(([u]) => u === 'Begriff in der Quelle'));
  const farbe = kartenAufbau(daten, karte('farbe'));
  assert.equal(farbe.kopf, 'Sortierauftrag (Eigenentwurf)');
  assert.ok(!farbe.abschnitte.some(([u]) => u === 'Begriff in der Quelle'));
  assert.ok(!farbe.abschnitte.some(([u]) => u.startsWith('Gegenstände')));
  const sicher = kartenAufbau(daten, karte('sicherheit'));
  assert.equal(sicher.kopf, 'Sicherheitskarte (Eigenentwurf)');
  assert.deepEqual(sicher.abschnitte.map(([u]) => u), ['Lernziel aus der Quelle', 'Hinweis (Eigenentwurf)']);
});
