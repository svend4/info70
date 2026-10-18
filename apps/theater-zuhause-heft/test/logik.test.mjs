import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/heft.json' with { type: 'json' };
import {
  anzahlSaetze, begriffZeilen, druckSeiten, filterName, filterWerte, filtern, passendeSzenenZeilen,
  seiteBloecke, seiteText,
} from '../logik.mjs';

// Prüft Daten und Logik. Die Regeln der Umgebung (Eingabefelder, Speicherung,
// Netz, Druckzeichen, Pflichtmarkierung je Seite, Testzahl) stehen in test/regeln.test.mjs.
// Die Quellenzitate sind hier wörtlich festgehalten; geprüft gegen die Seiten 73, 72, 6 und 2
// der maschinellen Arbeitskopie (Praleska, Minsk 2007).

const PFLICHT = 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.';
const SEITEN_IDS = ['umschlag', 'fingertheater', 'tischtheater', 'handpuppe',
  'szene-1', 'szene-2', 'szene-3', 'szene-4', 'szene-5'];
const FORMEN = { fingertheater: 'пальчикового', tischtheater: 'настольного', handpuppe: 'театра Петрушки' };
const SEITE = Object.fromEntries(druckSeiten(daten).map((s) => [s.id, s]));
const ids = (liste) => liste.map((s) => s.id);

test('Aufbau: ein Umschlag, drei Formen, fünf Szenen; die Druckreihenfolge ist fest', () => {
  assert.equal(daten.formen.length, 3);
  assert.equal(daten.szenen.length, 5);
  assert.deepEqual(ids(druckSeiten(daten)), SEITEN_IDS);
  assert.equal(new Set(ids(druckSeiten(daten))).size, SEITEN_IDS.length, 'doppelte Seitenkennungen');
});

test('die drei Formen sind Fingertheater, Tischtheater und Handpuppe (Kasper)', () => {
  assert.deepEqual(daten.formen.map((f) => f.id), ['fingertheater', 'tischtheater', 'handpuppe']);
  assert.deepEqual(daten.formen.map((f) => f.name), ['Fingertheater', 'Tischtheater', 'Handpuppe (Kasper)']);
});

test('jede Form nennt ihren Begriff aus S. 73 wörtlich, mit Seite', () => {
  for (const f of daten.formen) {
    assert.equal(f.begriff.quelltext, FORMEN[f.id], `${f.id}: Quelltext weicht ab`);
    assert.equal(f.begriff.seite, 'S. 73', `${f.id}: Seite des Begriffs`);
    assert.equal(f.quelle, 'Praleska, S. 73', `${f.id}: Quellenzeile`);
  }
  // Die drei Wörter stehen wörtlich auf S. 73 (Anregung an die Eltern).
  assert.equal(daten.umschlag.anregung.includes('Praleska, S. 73'), true);
});

test('jede Form-Seite druckt die Quellenzeile „Praleska, S. 73“ und den Vermerk „Bastelschritte: Eigenentwurf“', () => {
  for (const f of daten.formen) {
    const text = seiteText(daten, SEITE[f.id]);
    assert.ok(text.includes('Quelle: Praleska, S. 73'), `${f.id}: Quellenzeile fehlt`);
    assert.ok(text.includes('Bastelschritte: Eigenentwurf'), `${f.id}: Vermerk Bastelschritte fehlt`);
  }
});

test('jede Form hat drei bis sechs Bastelschritte, keiner leer', () => {
  for (const f of daten.formen) {
    assert.ok(f.schritte.length >= 3 && f.schritte.length <= 6, `${f.id}: ${f.schritte.length} Schritte`);
    for (const s of f.schritte) assert.ok(s.trim().length > 10, `${f.id}: leerer Schritt`);
  }
});

test('passende Szenen: jede Kennung gibt es, jede Szene gehört zu mindestens einer Form, keine Lücke im Druck', () => {
  const genannt = new Set();
  for (const f of daten.formen) {
    for (const id of f.passendeSzenen) {
      assert.ok(daten.szenen.some((s) => s.id === id), `${f.id}: unbekannte Szene ${id}`);
      genannt.add(id);
    }
    assert.ok(!passendeSzenenZeilen(daten, f).some((z) => z.includes('UNBEKANNT')), `${f.id}: UNBEKANNT`);
  }
  assert.deepEqual([...genannt].sort(), daten.szenen.map((s) => s.id).sort());
});

test('fünf Szenen mit drei bis sechs Sätzen, Rollen benannt, offenes Ende', () => {
  assert.equal(daten.szenen.length, 5);
  for (const s of daten.szenen) {
    const saetze = anzahlSaetze(s.text);
    assert.ok(saetze >= 3 && saetze <= 6, `${s.id}: ${saetze} Sätze`);
    const rollen = s.rollen.split(', ');
    assert.ok(rollen.length >= 2 && rollen.every((r) => r.trim().length > 0), `${s.id}: Rollen fehlen`);
    assert.match(s.ende, /bleibt offen/, `${s.id}: das Ende ist nicht offen`);
  }
});

test('jede Szene ist als Eigenentwurf gekennzeichnet und trägt keine Quellenangabe', () => {
  for (const s of daten.szenen) {
    const seite = SEITE[s.id];
    assert.ok(seite.art === 'szene');
    const text = seiteText(daten, seite);
    assert.ok(text.includes(`${s.titel} (Eigenentwurf)`), `${s.id}: Titel ohne Eigenentwurf`);
    assert.ok(text.includes('Quelle: Eigenentwurf'), `${s.id}: Quellenzeile fehlt`);
    assert.ok(!/Praleska/.test(text), `${s.id}: Szene nennt die Quelle`);
  }
});

test('Filter „alle“ liefert alle neun Seiten in Druckreihenfolge', () => {
  assert.deepEqual(ids(filtern(daten, 'alle')), SEITEN_IDS);
  assert.deepEqual(ids(filtern(daten)), SEITEN_IDS, 'ohne Angabe ist der Filter „alle“');
});

test('Filter „umschlag“ und jede Form liefern genau diese eine Seite', () => {
  assert.deepEqual(ids(filtern(daten, 'umschlag')), ['umschlag']);
  for (const f of daten.formen) {
    assert.deepEqual(ids(filtern(daten, f.id)), [f.id], `Filter ${f.id}`);
  }
});

test('Filter „szenen“ liefert die fünf Szenen in Druckreihenfolge', () => {
  assert.deepEqual(ids(filtern(daten, 'szenen')), ['szene-1', 'szene-2', 'szene-3', 'szene-4', 'szene-5']);
});

test('ein unbekannter Filter liefert nichts', () => {
  assert.deepEqual(filtern(daten, 'gibtsnicht'), []);
});

test('jede Filterauswahl ist eine Teilmenge; Umschlag, Formen und Szenen ergeben zusammen alle Seiten', () => {
  const alle = new Set(SEITEN_IDS);
  const zusammen = new Set();
  for (const w of filterWerte(daten)) {
    if (w === 'alle') continue;
    for (const s of filtern(daten, w)) {
      assert.ok(alle.has(s.id), `${w}: Seite außerhalb des Heftes`);
      zusammen.add(s.id);
    }
  }
  assert.deepEqual([...zusammen].sort(), [...SEITEN_IDS].sort());
});

test('die Druckreihenfolge bleibt stabil: gleiche Ausgabe bei jedem Aufruf, Filter ändert sie nicht', () => {
  assert.deepEqual(ids(druckSeiten(daten)), ids(druckSeiten(daten)));
  assert.deepEqual(ids(filtern(daten, 'alle')), ids(druckSeiten(daten)));
  const reihenfolge = SEITEN_IDS;
  for (const w of ['szenen', 'tischtheater']) {
    const teil = ids(filtern(daten, w));
    const positionen = teil.map((id) => reihenfolge.indexOf(id));
    assert.deepEqual(positionen, [...positionen].sort((a, b) => a - b), `${w}: Reihenfolge verdreht`);
  }
});

test('jede Seite endet mit der Pflichtmarkierung, und sie steht in jedem Text', () => {
  assert.equal(daten.pflichtmarkierung, PFLICHT);
  for (const seite of druckSeiten(daten)) {
    const bloecke = seiteBloecke(daten, seite);
    assert.deepEqual(bloecke.at(-1), { typ: 'pflicht', text: PFLICHT }, `${seite.id}: Pflicht nicht am Ende`);
    assert.ok(seiteText(daten, seite).includes(PFLICHT), `${seite.id}: Pflicht fehlt im Text`);
  }
});

test('die Quelle steht nur dort, wo sie belegt ist: Anregung auf S. 73, Freizeitspiele auf S. 72, Gruppe auf S. 6', () => {
  const u = daten.umschlag;
  assert.ok(u.anregung.includes('(Praleska, S. 73)'), 'Anregung ohne S. 73');
  assert.ok(u.figuren.includes('(Praleska, S. 72)'), 'Freizeitspiele ohne S. 72');
  assert.ok(u.zielgruppe.includes('(Praleska, S. 6)'), 'Altersgruppe ohne S. 6');
  assert.equal(u.quelle, 'Praleska, S. 6, S. 72 und S. 73');
});

test('der Hinweis „kein Bildschirm“ steht unter „Eigenentwurf“, nicht unter der Anregung der Quelle', () => {
  const bloecke = seiteBloecke(daten, SEITE.umschlag);
  const hinweis = bloecke.find((b) => b.typ === 'abschnitt' && b.ueberschrift === 'Hinweis für Eltern (Eigenentwurf)');
  const anregung = bloecke.find((b) => b.typ === 'abschnitt' && b.ueberschrift === 'Anregung der Quelle');
  assert.ok(hinweis && hinweis.zeilen.join(' ').includes('keinen Bildschirm'), 'Hinweis fehlt');
  assert.ok(!anregung.zeilen.join(' ').includes('Bildschirm'), 'der Bildschirm-Satz steht bei der Quelle');
});

test('Zitate aus der Quelle haben höchstens zwölf Wörter', () => {
  for (const f of daten.formen) {
    const woerter = f.begriff.quelltext.trim().split(/\s+/).length;
    assert.ok(woerter <= 12, `„${f.begriff.quelltext}“ hat ${woerter} Wörter`);
  }
});

test('Eigenentwurf-Kennzeichnung: jeder Begriff mit deutscher Entsprechung und der Sicherheitssatz sind als Eigenentwurf benannt', () => {
  for (const f of daten.formen) {
    const zeilen = begriffZeilen(f);
    assert.ok(zeilen.every((z) => z.endsWith('(Eigenentwurf)')), `${f.id}: Begriff ohne Eigenentwurf`);
  }
  assert.ok(daten.sicherheitssatz.endsWith('(Eigenentwurf).'), 'Sicherheitssatz ohne Eigenentwurf');
  assert.ok(daten.sprachen.includes('Eigenentwurf'), 'Sprachenvermerk ohne Eigenentwurf');
});

test('Ziffern im Druck nur dort, wo Quelle oder Impressum sie belegen (Seitenangaben, Erscheinungsjahr, ISBN)', () => {
  const text = druckSeiten(daten).map((s) => seiteText(daten, s)).join('\n');
  const rest = text
    .replace(/S\. \d+/g, '')
    .replace(/2007/g, '')
    .replace(/978-985-465-244-3/g, '');
  assert.ok(!/\d/.test(rest), `Ziffer ohne Beleg: ${rest.match(/.{0,30}\d.{0,10}/)?.[0]}`);
});

test('die Szenen enthalten keine Entwicklungsangaben und keine Bewertung', () => {
  const muster = /Entwicklung|Meilenstein|Monat|Woche|Lebensjahr|Stufe|Punkte|Sterne|Ampel|Rangliste/i;
  for (const seite of druckSeiten(daten)) {
    assert.ok(!muster.test(seiteText(daten, seite)), `${seite.id}: ${seiteText(daten, seite).match(muster)?.[0]}`);
  }
});

test('filterWerte und filterName: jede Auswahl hat einen Namen', () => {
  assert.deepEqual(filterWerte(daten), ['alle', 'umschlag', 'fingertheater', 'tischtheater', 'handpuppe', 'szenen']);
  for (const w of filterWerte(daten)) assert.ok(filterName(daten, w).length > 0, `${w}: ohne Namen`);
  assert.equal(filterName(daten, 'handpuppe'), 'Handpuppe (Kasper)');
});

test('anzahlSaetze zählt Satzenden, auch vor schließenden Anführungszeichen', () => {
  assert.equal(anzahlSaetze('Eins. Zwei?'), 2);
  assert.equal(anzahlSaetze('Der Igel ruft: „Wo ist die Sonne?“ Die Schnecke kommt.'), 2);
  assert.equal(anzahlSaetze('„Vielleicht war sie am Teich?“, fragt Kasper.'), 1);
  assert.equal(anzahlSaetze('Ohne Satzende'), 1);
});
