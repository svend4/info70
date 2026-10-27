import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import { rueckmeldungFuer, pruefeSzenarien } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
const szene = (id) => daten.szenarien.find((s) => s.id === id);
const beste = (s) => s.optionen.find((o) => o.wert === 2);
const halbe = (s) => s.optionen.find((o) => o.wert === 1);
const schlechteste = (s) => s.optionen.find((o) => o.wert === 0);

test('Szenarien sind gültig', () => {
  assert.deepEqual(pruefeSzenarien(daten), []);
});

test('Rückmeldung zu jeder Antwort: Titel und Emoji je Option, nur die beste färbt den Hinweis', () => {
  assert.deepEqual(rueckmeldungFuer({ wert: 2 }), { gut: true, emoji: '😊', titel: 'Genau die richtigen Worte!' });
  assert.deepEqual(rueckmeldungFuer({ wert: 1 }), { gut: false, emoji: '👍', titel: 'Fast – geht noch freundlicher.' });
  assert.deepEqual(rueckmeldungFuer({ wert: 0 }), { gut: false, emoji: '💭', titel: 'Schau nochmal hin.' });
  assert.equal(rueckmeldungFuer(undefined).titel, 'Schau nochmal hin.', 'ohne Option die neutrale Rückfrage');
  for (const s of daten.szenarien) for (const o of s.optionen) {
    assert.ok(rueckmeldungFuer(o).titel.length >= 3, `${s.id}: Rückmeldung`);
    assert.ok(s.erklaerung.length >= 150, `${s.id}: Erklärung zu jeder Antwort`);
  }
});

test('Kinder werden nicht bewertet: keine Rang-, Punkte- oder Ergebnis-Funktion, keine Ränge in den Daten, kein Zähler im App-Code', () => {
  for (const name of ['maxPunkte', 'rangFuer', 'ergebnisSatz']) {
    assert.equal(logik[name], undefined, `logik.mjs hat kein ${name} mehr`);
  }
  assert.ok(!('raenge' in daten), 'die Daten haben keine Ränge');
  assert.doesNotMatch(appQuelle, /punkte|maxPunkte|rangFuer|ergebnisSatz|raenge|rang\b|🌟|🏅|🏆/i, 'app.mjs führt weder Zähler noch Rang noch Stern');
  assert.doesNotMatch(appQuelle, /Geschafft/, 'kein „Geschafft“ als Titel');
  assert.match(appQuelle, /Situation \$\{index \+ 1\} von \$\{szenarien\.length\}/, 'der Fortschritt der Runde („Situation n von m“) bleibt');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende der Runde ist neutral benannt');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Löschknopf; der alte Schlüssel wird einmal entfernt', () => {
  assert.doesNotMatch(appQuelle, /setItem|getItem|datenKarte|daten-karte|sprache\.mjs/, 'kein Speicher, keine Löschkarte, keine Sprachwahl');
  assert.doesNotMatch(appQuelle, /(Meine Daten|Rekord) l(ö|oe)schen/, 'ohne Speicher keine Karte und kein Löschknopf');
  assert.match(appQuelle, /^try \{ localStorage\.removeItem\('hoeflich\.rekord'\); \} catch \{\}$/m, 'der alte Rekord-Schlüssel wird beim Start in einer Zeile entfernt');
  assert.equal((appQuelle.match(/hoeflich\.rekord/g) ?? []).length, 1, 'der alte Schlüssel steht nur in dieser Zeile');
  assert.match(elternSeite, /speichert nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten l(ö|oe)schen/, 'ohne Speicher keine Karte');
});

test('Validator greift: fehlende oder falsch gewichtete Optionen fallen auf', () => {
  const kaputt = JSON.parse(JSON.stringify(daten));
  kaputt.szenarien[0].optionen[1].wert = 2; // zwei beste Optionen
  assert.ok(pruefeSzenarien(kaputt).some((f) => /EINE beste Option/.test(f)));
  const ohneNull = JSON.parse(JSON.stringify(daten));
  ohneNull.szenarien[0].optionen[2].wert = 1;
  assert.ok(pruefeSzenarien(ohneNull).some((f) => /EINE ungünstige Option/.test(f)));
  const doppelt = JSON.parse(JSON.stringify(daten));
  doppelt.szenarien[1].kategorie = doppelt.szenarien[0].kategorie;
  assert.ok(pruefeSzenarien(doppelt).some((f) => /Kategorie .* doppelt/.test(f)));
});

test('inhaltliche Abdeckung: die Sprechhandlungen des Katalogs kommen vor', () => {
  const kategorien = new Set(daten.szenarien.map((s) => s.kategorie));
  for (const noetig of ['Danken', 'Entschuldigen', 'Gratulieren', 'Mitgefühl', 'Bewundern', 'Grenze setzen']) {
    assert.ok(kategorien.has(noetig), `Kategorie fehlt: ${noetig}`);
  }
  assert.ok(daten.szenarien.length >= 12, 'genug Szenen für abwechslungsreiche Runden');
});

test('Grenze setzen: ein freundliches Nein ist die beste Antwort, nicht die schlechteste', () => {
  const s = daten.szenarien.find((x) => x.kategorie === 'Grenze setzen');
  // Die beste Option verweigert die Umarmung und bietet eine Alternative an.
  assert.match(beste(s).text, /lieber die Hand/);
  // Die schlechteste Option ist NICHT das Neinsagen, sondern das stumme Mitmachen.
  assert.match(schlechteste(s).text, /obwohl du dich unwohl fühlst/);
  assert.ok(!/Nein|nein/.test(schlechteste(s).text), 'ein Nein darf nie die ungünstigste Antwort sein');
  assert.match(s.erklaerung, /entscheidest du/);
  assert.match(s.erklaerung, /vertraust/, 'Verweis auf eine Vertrauensperson fehlt');
});

test('die mittlere Antwort gibt es nur für wirklich halb richtige Antworten', () => {
  // Trauer zulassen ist halb richtig (echt, aber nicht im Moment),
  // den Sieg kleinreden ist es nicht.
  assert.match(halbe(szene('h03')).text, /traurig/);
  assert.match(schlechteste(szene('h03')).text, /nur Glück/);
  // Gut gemeinter, aber abwiegelnder Trost = 1; den Verlust kleinmachen = 0.
  assert.match(halbe(szene('h04')).text, /neuen/);
  assert.match(schlechteste(szene('h04')).text, /nur ein Hund/);
  // Kurzes Danke = 1 (der Dank ist echt, kommt nur kaum an);
  // die Mühe abwerten = 0.
  assert.match(halbe(szene('h01')).text, /^„Danke\.“/);
  assert.match(schlechteste(szene('h01')).text, /hässlich/);
});

test('Sicherheitsregeln: Telefon und Notfall stehen ausdrücklich in den Erklärungen', () => {
  const tel = szene('h10');
  assert.match(schlechteste(tel).text, /allein zu Hause/);
  assert.match(tel.erklaerung, /Adresse/);
  assert.match(tel.erklaerung, /Auflegen ist erlaubt/);
  // Unterbrechen: im Notfall gilt die Höflichkeitsregel nicht
  assert.match(szene('h08').erklaerung, /Gefahr|verletzt/);
});

test('Ton: keine Beschämung, keine Gehorsams-Botschaft', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['dumm', 'blöd', 'frech', 'unerzogen', 'schäm', 'brav sein', 'gehorch', 'widersprich nicht']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort im Datensatz: ${wort}`);
  }
  for (const s of daten.szenarien) {
    assert.ok(s.erklaerung.length >= 150, `${s.id}: Erklärung zu knapp (${s.erklaerung.length})`);
    assert.match(s.erklaerung, /[.!?]$/, `${s.id}: Erklärung endet ohne Satzzeichen`);
  }
  const ids = daten.szenarien.map((s) => s.id);
  assert.deepEqual(ids, [...ids].sort(), 'ids in Reihenfolge');
});
