import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/bausteine.json' with { type: 'json' };
import {
  PFLICHTMARKIERUNG, alleKombinationen, anzahlBausteine, orteFuer, startzustand,
  vollstaendig, vorlesetext, vorlesetextAlsText, waehleJungtier, waehleOrt, waehleTierart, zustandsText,
} from '../logik.mjs';

// Prüft Daten, Zuordnung und Text. Die Regeln der Umgebung (Eingabefelder, Speicherung,
// Netz, Druckzeichen, Testzahl) stehen in test/regeln.test.mjs.

const SEITE = /^S\. (\d+)(?:–(\d+))?$/;
const seitenImBereich = (text) => {
  const m = text.match(SEITE);
  if (!m) return false;
  const von = Number(m[1]);
  const bis = m[2] ? Number(m[2]) : von;
  return von >= 113 && bis <= 114 && von <= bis;
};

test('Daten: 6 Tierarten, 4 Orte, 3 Jungtier-Themen; IDs je Liste eindeutig, Pflichtfelder gesetzt', () => {
  assert.equal(daten.tierarten.length, 6);
  assert.equal(daten.orte.length, 4);
  assert.equal(daten.jungtiere.length, 3);
  for (const liste of [daten.tierarten, daten.orte, daten.jungtiere]) {
    const ids = liste.map((e) => e.id);
    assert.equal(new Set(ids).size, ids.length, `doppelte Kennungen: ${ids.join(', ')}`);
    for (const e of liste) {
      assert.ok(e.id && e.name && e.seite && e.begriff, `${e.id ?? '?'}: Pflichtfeld fehlt`);
    }
  }
  for (const t of daten.tierarten) {
    assert.ok(t.einleitung && t.einleitung.length > 10, `${t.id}: Einleitung fehlt`);
  }
});

test('Quelle je Eintrag: Tierarten, Orte und Jungtier-Themen tragen eine Seite (113 bis 114) und einen Quellenbegriff; Quellenzeile nennt das Institut; Hinweis nennt die Altersmarkierung', () => {
  for (const e of [...daten.tierarten, ...daten.orte, ...daten.jungtiere]) {
    assert.ok(seitenImBereich(e.seite), `${e.id}: Seite „${e.seite}“ ist nicht gültig`);
    assert.match(e.begriff, /[а-яё]/i, `${e.id}: Quellenbegriff ist nicht russisch oder fehlt`);
  }
  assert.match(daten.quelle, /Praleska\. Minsk: НИО \(Национальный институт образования\), 2007\. Nationales Institut für Bildung \(Minsk\)\. ISBN 978-985-465-244-3\. Sachbezug: S\. 113 bis 114\./);
  assert.ok(daten.hinweis.includes('Die Abschnitte auf S. 113 bis 114 sind in der Quelle für ältere Kinder der Gruppe markiert.'), 'Hinweis ohne Altersmarkierung der Quelle');
  assert.match(daten.katalog, /^Katalogeintrag docs\/10, .*Content-Pack 5\.$/);
});

test('Orte nur mit Quellenbezug: genau Bau, Höhle, Nest und Stall (S. 114); jede Tierart verweist auf vorhandene Orte', () => {
  assert.deepEqual(daten.orte.map((o) => o.id), ['bau', 'hoehle', 'nest', 'stall']);
  assert.deepEqual(daten.orte.map((o) => o.begriff), ['нора', 'берлога', 'гнезда', 'коровник, курятник']);
  for (const o of daten.orte) assert.equal(o.seite, 'S. 114', `${o.id}: Ort nicht auf S. 114`);
  for (const t of daten.tierarten) {
    assert.ok(t.orte.length >= 1, `${t.id}: kein Ort`);
    for (const id of t.orte) {
      assert.ok(daten.orte.some((o) => o.id === id), `${t.id}: Ort „${id}“ gibt es nicht`);
    }
  }
});

test('Zuordnung Tierart und Ort entspricht der Quelle: Fuchs und Wolf Bau, Bär Höhle, Vogel Nest, Kuh und Huhn Stall', () => {
  const erwartet = {
    fuchs: ['bau'], wolf: ['bau'], baer: ['hoehle'], vogel: ['nest'], kuh: ['stall'], huhn: ['stall'],
  };
  for (const [id, orte] of Object.entries(erwartet)) {
    const t = daten.tierarten.find((x) => x.id === id);
    assert.deepEqual(t.orte, orte, `${id}: falscher Ort`);
  }
});

test('Jungtier „Frühling und Sommer“: der Text nennt beide Jahreszeiten, nicht nur den Frühling', () => {
  const j = daten.jungtiere.find((x) => x.id === 'fruehling');
  assert.ok(j.text.includes('im Frühling und im Sommer'), 'Frühling und Sommer fehlen im Text');
  assert.ok(!/im Frühling(?! und im Sommer)/.test(j.text), 'nur Frühling genannt');
  assert.equal(j.seite, 'S. 114');
});

test('Schluss und Kuschel-Sachfrage: ohne Quellenseite, als Eigenentwurf ohne Quelle gekennzeichnet', () => {
  const t = vorlesetext(daten, { tierart: 'fuchs', ort: 'bau', jungtier: 'eltern' });
  assert.ok(t, 'Text fehlt');
  const schluss = t.absaetze.find((a) => a.schritt === 'Schluss');
  const sach = t.absaetze.find((a) => a.schritt === 'Sachfrage');
  assert.equal(schluss.seite, null, 'Schluss trägt eine Quellenseite');
  assert.equal(sach.seite, null, 'Sachfrage trägt eine Quellenseite');
  assert.equal(schluss.kennzeichnung, 'Eigenentwurf, ohne Quelle.');
  assert.equal(sach.kennzeichnung, 'Kuschel-Sachfrage. Eigenentwurf, ohne Quelle.');
});

test('Auswahl: Start unvollständig; Tierart setzt einen passenden Ort; fremder Ort wird abgelehnt; Original bleibt', () => {
  const start = startzustand();
  const mitTierart = waehleTierart(daten, start, 'baer');
  assert.equal(mitTierart.tierart, 'baer');
  assert.equal(mitTierart.ort, 'hoehle', 'Bär braucht die Höhle');
  assert.equal(start.tierart, null, 'das Original darf nicht verändert werden');
  const abgelehnt = waehleOrt(daten, mitTierart, 'nest');
  assert.equal(abgelehnt.ort, 'hoehle', 'Nest passt nicht zum Bären');
  const neuerTier = waehleTierart(daten, mitTierart, 'vogel');
  assert.equal(neuerTier.ort, 'nest', 'Ort wird an die neue Tierart angepasst');
  assert.equal(waehleJungtier(daten, neuerTier, 'unbekannt').jungtier, null);
});

test('vollstaendig verlangt Tierart, passenden Ort und Jungtier-Thema; ohne vollständige Auswahl liefert vorlesetext null', () => {
  const ohneJungtier = { tierart: 'kuh', ort: 'stall', jungtier: null };
  assert.equal(vollstaendig(daten, ohneJungtier), false);
  assert.equal(vorlesetext(daten, ohneJungtier), null);
  const falscherOrt = { tierart: 'kuh', ort: 'nest', jungtier: 'eltern' };
  assert.equal(vollstaendig(daten, falscherOrt), false, 'Ort passt nicht zur Kuh');
  assert.equal(vorlesetext(daten, falscherOrt), null);
  assert.equal(vollstaendig(daten, { tierart: 'kuh', ort: 'stall', jungtier: 'eltern' }), true);
});

test('Vorlesetext aus festen Bausteinen: fünf Absätze in fester Reihenfolge; Ort und Jungtier stimmen mit der Auswahl überein', () => {
  const t = vorlesetext(daten, { tierart: 'huhn', ort: 'stall', jungtier: 'wachsen' });
  assert.deepEqual(t.absaetze.map((a) => a.schritt), ['Einleitung', 'Ort', 'Jungtier', 'Schluss', 'Sachfrage']);
  assert.equal(t.absaetze[0].text, daten.tierarten.find((x) => x.id === 'huhn').einleitung);
  assert.equal(t.absaetze[1].text, daten.orte.find((x) => x.id === 'stall').text);
  assert.equal(t.absaetze[2].text, daten.jungtiere.find((x) => x.id === 'wachsen').text);
  assert.equal(t.bezeichnung, 'Tierart: Huhn. Ort: Stall. Jungtier-Thema: Groß werden.');
});

test('Alle gültigen Kombinationen (18) ergeben je einen Vorlesetext ohne Rest wie undefined, null oder [object]', () => {
  const kombis = alleKombinationen(daten);
  assert.equal(kombis.length, 18, 'erwartet 6 Tierarten × 1 Ort × 3 Jungtier-Themen');
  for (const k of kombis) {
    const t = vorlesetext(daten, k);
    assert.ok(t, `${JSON.stringify(k)}: kein Text`);
    const text = vorlesetextAlsText(t);
    assert.ok(!/undefined|null|\[object/.test(text), `${JSON.stringify(k)}: Rest im Text`);
  }
});

test('Jeder Absatz trägt die Kennzeichnung Eigenentwurf; jeder Absatz mit Sachbezug trägt seine Seite', () => {
  for (const k of alleKombinationen(daten)) {
    const t = vorlesetext(daten, k);
    for (const a of t.absaetze) {
      assert.match(a.kennzeichnung, /Eigenentwurf/, `${a.schritt}: ohne Eigenentwurf`);
      if (a.seite) {
        assert.ok(seitenImBereich(a.seite), `${a.schritt}: Seite fehlt oder ist ungültig`);
        assert.ok(a.kennzeichnung.includes(a.seite), `${a.schritt}: Seite steht nicht in der Kennzeichnung`);
      }
    }
  }
});

test('Jeder gedruckte Vorlesetext trägt die Pflichtmarkierung und den Hinweis auf die Altersmarkierung, für alle Kombinationen', () => {
  assert.equal(PFLICHTMARKIERUNG, 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.');
  for (const k of alleKombinationen(daten)) {
    const t = vorlesetext(daten, k);
    assert.equal(t.pflicht, PFLICHTMARKIERUNG, `${JSON.stringify(k)}: Pflichtmarkierung fehlt`);
    assert.ok(t.hinweis.includes('für ältere Kinder der Gruppe markiert.'), `${JSON.stringify(k)}: Altersmarkierung fehlt auf dem Blatt`);
    assert.ok(vorlesetextAlsText(t).includes(PFLICHTMARKIERUNG));
  }
});

test('Keine Lesart als Quelle: kein Winterschlaf, kein „heimisch“, keine Höchst- oder Grenzangabe, keine Lage „unter der Erde“ (Quelle nennt nur нора)', () => {
  const alles = JSON.stringify(daten) + alleKombinationen(daten)
    .map((k) => vorlesetextAlsText(vorlesetext(daten, k))).join('\n');
  const verboten = /Winterschlaf|heimisch|Höchst|Grenzwert|Mindestabstand|mindestens|höchstens|maximal|Sicherheit|unter der Erde/i;
  assert.ok(!verboten.test(alles), `verbotene Angabe gefunden: ${alles.match(verboten)?.[0]}`);
});

test('mindestens 12 eigene Bausteine (Einleitung, Ort, Jungtier, Schluss, Sachfrage)', () => {
  assert.ok(anzahlBausteine(daten) >= 12, `nur ${anzahlBausteine(daten)} Bausteine`);
  assert.equal(anzahlBausteine(daten), 6 + 4 + 3 + 2);
});

test('zustandsText nennt die offenen Stellen und meldet die vollständige Auswahl', () => {
  assert.equal(zustandsText(startzustand()), 'Noch offen: Tierart, Ort, Jungtier-Thema.');
  assert.equal(zustandsText({ tierart: 'wolf', ort: 'bau', jungtier: null }), 'Noch offen: Jungtier-Thema.');
  assert.equal(zustandsText({ tierart: 'wolf', ort: 'bau', jungtier: 'eltern' }), 'Alles gewählt.');
  assert.deepEqual(orteFuer(daten, 'gibtsnicht'), []);
});
