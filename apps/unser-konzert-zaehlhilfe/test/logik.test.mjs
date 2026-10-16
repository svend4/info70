import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as logik from '../logik.mjs';
import {
  ANREGUNGEN, ARTEN, BOGEN_TEXTE, MAX_TITEL_ZEICHEN, MAX_VORSCHLAEGE, TEXTE,
  darfHinzugefuegtWerden, istGueltigeArt, neuerVorschlag, programmTextdatei,
  programmTitel, pruefeTitel, zaehleHandzeichen, zaehlbogenZeilen,
} from '../logik.mjs';

test('Vorschlagsliste: höchstens zwölf, bei elf darf noch einer dazukommen', () => {
  assert.equal(MAX_VORSCHLAEGE, 12);
  for (let n = 0; n < MAX_VORSCHLAEGE; n += 1) {
    assert.ok(darfHinzugefuegtWerden(n), `bei ${n} müsste noch einer dazukommen`);
  }
  assert.ok(!darfHinzugefuegtWerden(MAX_VORSCHLAEGE), 'bei zwölf darf keiner mehr dazukommen');
  assert.ok(!darfHinzugefuegtWerden(-1), 'eine negative Anzahl ist ungültig');
  const voll = Array.from({ length: MAX_VORSCHLAEGE }, (_, i) => ({ titel: `Lied ${i}`, art: 'lied', handzeichen: 0 }));
  assert.deepEqual(neuerVorschlag('Noch eins', 'lied', voll), { ok: false, grund: 'voll' });
});

test('Titel ist nötig: leer und nur Leerraum werden abgelehnt', () => {
  assert.deepEqual(pruefeTitel(''), { ok: false, grund: 'leer' });
  assert.deepEqual(pruefeTitel('   \t '), { ok: false, grund: 'leer' });
  assert.deepEqual(pruefeTitel(undefined), { ok: false, grund: 'leer' });
  assert.deepEqual(pruefeTitel('  Frühlingslied  '), { ok: true, titel: 'Frühlingslied' });
});

test('Titel höchstens 60 Zeichen, gezählt als Zeichen und nicht als Bytes', () => {
  assert.equal(MAX_TITEL_ZEICHEN, 60);
  assert.deepEqual(pruefeTitel('ä'.repeat(60)), { ok: true, titel: 'ä'.repeat(60) });
  assert.deepEqual(pruefeTitel('ä'.repeat(61)), { ok: false, grund: 'zu-lang' });
});

test('doppelte Titel werden abgelehnt, ohne Unterschied bei Groß- und Kleinschreibung', () => {
  const vorhanden = [{ titel: 'Lied vom Frühling' }];
  assert.deepEqual(pruefeTitel('lied vom frühling', vorhanden), { ok: false, grund: 'doppelt' });
  assert.deepEqual(pruefeTitel('Lied vom Sommer', vorhanden), { ok: true, titel: 'Lied vom Sommer' });
});

test('Art ist gültig nur als Lied, Tanz oder Festprogramm', () => {
  assert.deepEqual(ARTEN.map((a) => a.id), ['lied', 'tanz', 'festprogramm']);
  for (const gueltig of ['lied', 'tanz', 'festprogramm']) assert.ok(istGueltigeArt(gueltig), gueltig);
  for (const falsch of ['Lied', 'kind', '', undefined]) assert.ok(!istGueltigeArt(falsch), String(falsch));
  assert.deepEqual(neuerVorschlag('Titel', 'unbekannt', []), { ok: false, grund: 'art' });
});

test('ein neuer Vorschlag beginnt ohne Handzeichen', () => {
  assert.deepEqual(neuerVorschlag('Hallo Welt', 'tanz', []), {
    ok: true,
    eintrag: { titel: 'Hallo Welt', art: 'tanz', handzeichen: 0 },
  });
});

test('Zählung: ein Handzeichen mehr oder weniger je Schritt', () => {
  assert.equal(zaehleHandzeichen(3, 1), 4);
  assert.equal(zaehleHandzeichen(3, -1), 2);
});

test('Zählung wird nie negativ', () => {
  assert.equal(zaehleHandzeichen(0, -1), 0, 'bei null bleibt die Zählung null');
  assert.equal(zaehleHandzeichen(1, -1), 0);
  // Feste Folge von Tastendrücken, kein Zufall: keiner darf unter null führen.
  const folge = [1, -1, -1, 1, -1, -1, -1, 1, 1, -1];
  let stand = 0;
  const verlauf = [];
  for (const schritt of folge) {
    stand = zaehleHandzeichen(stand, schritt);
    verlauf.push(stand);
  }
  assert.deepEqual(verlauf, [1, 0, 0, 1, 0, 0, 0, 1, 2, 1]);
  assert.ok(verlauf.every((n) => n >= 0), 'eine Zählung ist unter null gefallen');
});

test('Programmliste: nach Handzeichen absteigend, bei Gleichstand nach der Eingabe', () => {
  const liste = [
    { titel: 'A', handzeichen: 0 },
    { titel: 'B', handzeichen: 2 },
    { titel: 'C', handzeichen: 2 },
    { titel: 'D', handzeichen: 1 },
  ];
  assert.deepEqual(programmTitel(liste), ['B', 'C', 'D', 'A']);
  assert.deepEqual(programmTitel([{ titel: 'X', handzeichen: 1 }, { titel: 'Y', handzeichen: 1 }]), ['X', 'Y']);
  assert.deepEqual(programmTitel([]), []);
});

test('Programmliste zeigt nur Titel, keine Zahlen', () => {
  const liste = [{ titel: 'Lied vom Frühling', handzeichen: 5 }, { titel: 'Tanz im Kreis', handzeichen: 0 }];
  const ausgabe = programmTitel(liste);
  for (const zeile of ausgabe) {
    assert.equal(typeof zeile, 'string');
    assert.ok(!/\d/.test(zeile), `Zahl in der Ausgabe: ${zeile}`);
  }
  assert.ok(!ausgabe.some((z) => z.includes('5')), 'die Zählung darf nicht in der Ausgabe stehen');
});

test('Textdatei: Kopfzeile, Leerzeile, dann die Titel in Reihenfolge, ohne Zahlen', () => {
  const liste = [
    { titel: 'A', handzeichen: 0 },
    { titel: 'B', handzeichen: 2 },
    { titel: 'C', handzeichen: 2 },
    { titel: 'D', handzeichen: 1 },
  ];
  const text = programmTextdatei(liste);
  assert.equal(text, 'Programmliste: Unser Konzert\n\nB\nC\nD\nA\n');
  assert.ok(!/\d/.test(text), 'die Textdatei enthält eine Zahl');
});

test('Zählbogen: zwölf leere Zeilen mit je einem Feld für den Titel und einem für die Striche', () => {
  const zeilen = zaehlbogenZeilen();
  assert.equal(zeilen.length, 12);
  for (const z of zeilen) assert.deepEqual(z, { titel: '', strich: '' });
});

test('Druck-Texte: keine Zahl, kein Kästchen, keine Zeile für einen Namen', () => {
  const alle = JSON.stringify([BOGEN_TEXTE, zaehlbogenZeilen()]);
  assert.ok(!/\d/.test(alle), 'eine Zahl auf dem Druckbogen');
  assert.ok(!/[☐☑☒□■▢✓✔✗✘★☆]/u.test(alle), 'ein Kästchen oder Häkchen auf dem Druckbogen');
  assert.ok(!/Name\s*:|Namenszeile|Namensfeld/i.test(alle), 'eine Zeile für den Namen');
});

test('die Schnittstelle nennt keine Summe, keine Bewertung und kein Kind', () => {
  // Nur Zählung je Vorschlag. Namen mit Summe, Punkt, Score, Rang, Ampel,
  // Kontext, Woche, Serie, Kürzel oder Kind wären ein Verstoß.
  const verboten = /summe|gesamt|punkt|score|prozent|rang|ampel|kontext|woche|serie|kuerzel|kind/i;
  for (const name of Object.keys(logik)) {
    assert.ok(!verboten.test(name), `verbotener Exportname: ${name}`);
  }
});

test('der Hinweis sagt, dass die Abstimmung offen ist, und behauptet keine Anonymität', () => {
  assert.equal(
    TEXTE.hinweis,
    'Ob Kinder mitentscheiden, entscheidet der Träger bzw. das Team. Das Werkzeug hilft nur nach einer Abstimmung in der Gruppe. Handzeichen sind für die Gruppe sichtbar, die Abstimmung ist also offen. Die Zählung ordnet keine Stimme einem Kind zu und hält keine Namen fest.',
  );
  assert.doesNotMatch(TEXTE.hinweis, /verdeckt|anonym|geheim/i);
});

test('Anregungen: drei Seiten aus Praleska, als Anregung und nicht als Vorgabe', () => {
  assert.deepEqual(ANREGUNGEN.map((a) => a.seite), [262, 265, 272]);
  for (const a of ANREGUNGEN) {
    assert.ok(a.text.length > 20, `Anregung zu kurz: S. ${a.seite}`);
    assert.ok(!/\b(muss|müssen|soll|sollen|verpflichtend|Pflicht)\b/i.test(a.text), `Vorgabe statt Anregung: S. ${a.seite}`);
  }
  assert.ok(TEXTE.anregungenTitel.includes('keine Vorgaben'));
});


test('Titel: NFD und NFC gelten als derselbe Titel; Zeichen ohne Buchstaben und Ziffern sind leer', () => {
  const nfc = 'Fr\u00FChling';
  const nfd = 'Fr\u0075\u0308hling';
  assert.equal(pruefeTitel(nfd).titel, nfc);
  assert.deepEqual(pruefeTitel(nfd, [{ titel: nfc }]), { ok: false, grund: 'doppelt' });
  assert.deepEqual(pruefeTitel('\u200B'), { ok: false, grund: 'leer' });
});
