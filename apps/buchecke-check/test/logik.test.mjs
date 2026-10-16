import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { alleFragen, berichtZeilen, pruefeDaten, zaehle, zustandSetzen } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/checkliste.json', import.meta.url), 'utf8'));
const kopie = (x) => JSON.parse(JSON.stringify(x));

test('die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('vier Bereiche mit fünfzehn Fragen', () => {
  assert.equal(daten.bereiche.length, 4);
  assert.equal(alleFragen(daten).length, 15);
});

test('jede Frage trägt ihre Herkunft – die Form wird geprüft, der Wortlaut nicht (siehe GDD)', () => {
  for (const f of alleFragen(daten)) {
    if (f.quelle === 'Eigenentwurf') assert.equal('zitat' in f, false, f.id);
    else {
      assert.match(f.quelle, /^S\. \d+/, f.id);
      assert.match(f.zitat, /[Ѐ-ӿ]/, f.id);
      assert.ok(f.zitat.length >= 20, f.id);
    }
  }
});

test('sechs Eigenentwurf-Fragen, wie die Quellenangabe sagt', () => {
  const eigen = alleFragen(daten).filter((f) => f.quelle === 'Eigenentwurf');
  assert.equal(eigen.length, 6);
  assert.match(daten.quelle.abweichung, /sechs der fünfzehn Fragen/);
});

test('die Quellen-Seiten sind 155, 186 und 251 – mit der Gruppe, zu der sie gehören', () => {
  const quellen = alleFragen(daten).map((f) => f.quelle).filter((q) => q !== 'Eigenentwurf');
  const seiten = [...new Set(quellen.map((q) => q.match(/\d+/)[0]))].sort((a, b) => a - b);
  assert.deepEqual(seiten, ['155', '186', '251']);
  for (const q of quellen) {
    if (q.startsWith('S. 251')) assert.match(q, /Фантазеры, 5–7/);
    else assert.match(q, /Почемучки, 3–5/);
  }
});

test('das Werkzeug kennt keine Felder über einzelne Kinder', () => {
  const d = kopie(daten);
  d.bereiche[0].fragen[0].kindername = 'Mia';
  assert.match(pruefeDaten(d).join(' '), /Felder über einzelne Kinder: kindername/);
});

test('ein Text, der wie ein Eintrag über ein Kind aussieht, wird abgelehnt', () => {
  const d = kopie(daten);
  d.hinweis = 'Notiz: Mia war heute still. Bitte nachfragen.';
  assert.match(pruefeDaten(d).join(' '), /sieht nach einem Eintrag über ein Kind aus/);
});

test('eine Frage ohne Herkunft wird abgelehnt', () => {
  const d = kopie(daten);
  delete d.bereiche[0].fragen[0].quelle;
  assert.match(pruefeDaten(d).join(' '), /Herkunft fehlt/);
});

test('ein Eigenentwurf mit Zitat wird abgelehnt', () => {
  const d = kopie(daten);
  d.bereiche[0].fragen.find((f) => f.id === 'e1').zitat = 'книжный уголок';
  assert.match(pruefeDaten(d).join(' '), /Eigenentwurf hat kein Zitat/);
});

test('eine Quelle ohne russischen Wortlaut wird abgelehnt', () => {
  const d = kopie(daten);
  d.bereiche[0].fragen[0].zitat = 'Die Buchecke steht im Text.';
  assert.match(pruefeDaten(d).join(' '), /ohne russischen Wortlaut/);
});

test('zustandSetzen setzt, wechselt und hebt auf, ohne die Eingabe zu verändern', () => {
  const z0 = {};
  const z1 = zustandSetzen(daten, z0, 'f1', 'erfuellt');
  assert.deepEqual(z1, { f1: 'erfuellt' });
  assert.deepEqual(z0, {}, 'die Eingabe bleibt unverändert');
  const z2 = zustandSetzen(daten, z1, 'f1', 'nicht');
  assert.deepEqual(z2, { f1: 'nicht' });
  const z3 = zustandSetzen(daten, z2, 'f1', 'nicht');
  assert.deepEqual(z3, {}, 'dieselbe Taste hebt die Antwort auf');
});

test('eine unbekannte Frage oder ein unbekannter Wert ändert nichts', () => {
  const z1 = { f1: 'offen' };
  assert.deepEqual(zustandSetzen(daten, z1, 'gibt-es-nicht', 'erfuellt'), z1);
  assert.deepEqual(zustandSetzen(daten, z1, 'f1', 'vielleicht'), z1);
});

test('zaehle zählt je Bereich und insgesamt, unbeantwortete als ungeprüft', () => {
  const z = zaehle(daten, { f1: 'erfuellt', f2: 'erfuellt', f7: 'offen', e1: 'nicht' });
  const b1 = z.bereiche.find((b) => b.id === 'b1');
  assert.deepEqual([b1.gesamt, b1.erfuellt, b1.offen, b1.nicht, b1.ungeprueft], [5, 2, 1, 1, 1]);
  assert.deepEqual([z.gesamt.gesamt, z.gesamt.erfuellt, z.gesamt.offen, z.gesamt.nicht, z.gesamt.ungeprueft], [15, 2, 1, 1, 11]);
});

test('der Bericht nennt jede Frage mit Stand und Herkunft', () => {
  const zeilen = berichtZeilen(daten, { f1: 'erfuellt', e1: 'nicht' });
  const fragenZeilen = zeilen.filter((z) => z.startsWith('   - '));
  assert.equal(fragenZeilen.length, 15);
  assert.ok(fragenZeilen.some((z) => z.startsWith('   - erfüllt: Die Gruppe hat eine Buchecke') && z.endsWith('(Quelle S. 155 (Почемучки, 3–5))')));
  assert.ok(fragenZeilen.some((z) => z.startsWith('   - trifft nicht zu:') && z.endsWith('(Eigenentwurf)')));
  assert.equal(fragenZeilen.filter((z) => z.startsWith('   - nicht geprüft:')).length, 13);
});

test('der Bericht enthält keine Angaben über einzelne Kinder und keine Bewertung', () => {
  const text = berichtZeilen(daten, { f1: 'erfuellt' }).join('\n');
  assert.match(text, /Keine Angaben über einzelne Kinder/);
  assert.doesNotMatch(text, /Name:|Notiz:|Beobachtung:|Diagnose|Ampel|Rang/);
});

test('die Bilanz im Bericht stimmt mit der Zählung überein', () => {
  const zustand = { f1: 'erfuellt', f2: 'offen', f9: 'nicht' };
  const z = zaehle(daten, zustand);
  const zeilen = berichtZeilen(daten, zustand);
  assert.ok(zeilen.includes(`Insgesamt: ${z.gesamt.erfuellt} von ${z.gesamt.gesamt} erfüllt, ${z.gesamt.offen} noch offen, ${z.gesamt.nicht} trifft nicht zu, ${z.gesamt.ungeprueft} nicht geprüft.`));
});

test('die Abweichung belegt die 14 Ziele: Aufgabenliste mit 14 Punkten auf S. 153–155, die Buchecke ist der elfte', () => {
  assert.match(daten.quelle.abweichung, /14 Punkten auf S\. 153–155/);
  assert.match(daten.quelle.abweichung, /elfte Punkt/);
});

test('eine Kennung wie „constructor“ wird abgelehnt', () => {
  const d = kopie(daten);
  d.bereiche[0].fragen[0].id = 'constructor';
  assert.match(pruefeDaten(d).join(' '), /Frage-Kennung „constructor“/);
});

test('ein Bereich oder eine Frage, die null ist, führt zu einer Fehlermeldung statt zum Abbruch', () => {
  const d = kopie(daten);
  d.bereiche.push(null);
  assert.doesNotThrow(() => pruefeDaten(d));
  assert.ok(pruefeDaten(d).length > 0);
  const e = kopie(daten);
  e.bereiche[0].fragen.push(null);
  assert.doesNotThrow(() => pruefeDaten(e));
  assert.ok(pruefeDaten(e).length > 0);
});

test('ein Datenfile ohne Hinweis ist fehlerhaft', () => {
  const d = kopie(daten);
  delete d.hinweis;
  assert.match(pruefeDaten(d).join(' '), /Hinweis fehlt/);
});

test('auch Anmerkung:, Nachname: und Entwicklung: in Texten werden als Eintrag über ein Kind erkannt', () => {
  for (const satz of ['Anmerkung: Mia war heute still.', 'Nachname: Schmidt braucht Hilfe.', 'Entwicklung: Mia spricht noch wenig.']) {
    const d = kopie(daten);
    d.hinweis = satz;
    assert.match(pruefeDaten(d).join(' '), /sieht nach einem Eintrag über ein Kind aus/, satz);
  }
});

test('eine Kennung wie „constructor“ zählt nicht als beantwortet', () => {
  const d = { titel: 'x', bereiche: [{ id: 'b1', titel: 'B', fragen: [{ id: 'constructor', text: 'Frage.', quelle: 'Eigenentwurf' }] }] };
  assert.equal(zaehle(d, {}).gesamt.ungeprueft, 1);
});

test('eine Kennung als Liste (["f1"]) neben „f1“ ist eine Dublette und wird abgelehnt', () => {
  const d = kopie(daten);
  d.bereiche[0].fragen[1].id = ['f1'];
  assert.ok(pruefeDaten(d).length > 0);
});

test('auch Pluralformen und der Vollbreit-Doppelpunkt gelten als Eintrag über ein Kind', () => {
  for (const satz of ['Notizen: Mia war still.', 'Namen: Mia und Jonas.', 'Notiz\uFF1A Mia war still.', 'Beobachtungen: ruhig.']) {
    const d = kopie(daten);
    d.hinweis = satz;
    assert.match(pruefeDaten(d).join(' '), /sieht nach einem Eintrag über ein Kind aus/, satz);
  }
});
