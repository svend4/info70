import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import { pruefeSzenarien } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const logikQuelle = await readFile(new URL('../logik.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');

test('Szenarien sind gültig: je Szene genau eine 2er- und mindestens eine 0er-Option', () => {
  assert.deepEqual(pruefeSzenarien(daten), []);
  assert.equal(daten.szenarien.length, 10);
});

test('Tierschutz-Kernbotschaften sitzen: nie einzeln, nachtaktiv, nicht hochheben, Tierarzt', () => {
  const je = Object.fromEntries(daten.szenarien.map((s) => [s.id, s]));
  assert.match(je.t01.erklaerung, /Artgenossen/);
  assert.match(je.t02.erklaerung, /nachtaktiv/);
  assert.match(je.t03.erklaerung, /Fluchttiere|Angst/);
  assert.match(je.t08.erklaerung, /Tierärzt|Tierarzt/);
  assert.match(je.t10.erklaerung, /nicht schwitzen/);
});

test('Die beste Option ist nie Wegschauen: Texte mit Wert 2 enthalten aktives Handeln', () => {
  for (const s of daten.szenarien) {
    const beste = s.optionen.find((o) => o.wert === 2);
    assert.ok(beste.text.length > 20, `${s.id}: beste Option ist konkret`);
    assert.doesNotMatch(beste.text, /^Nichts/, s.id);
  }
});

test('Keine Ränge: die Daten haben keine raenge, die Logik hat keine Rang-, Punkte- oder Ergebnisfunktion', () => {
  assert.ok(!('raenge' in daten), 'die Daten haben keine Ränge: das Kind wird nicht bewertet');
  assert.deepEqual(Object.keys(logik), ['pruefeSzenarien'], 'die Logik prüft nur die Szenarien');
  assert.doesNotMatch(logikQuelle, /rang|maxPunkte|ergebnisSatz/i, 'kein Rang, keine Höchstpunktzahl, kein Ergebnissatz');
  assert.deepEqual(pruefeSzenarien({ ...daten, raenge: undefined }), [], 'ohne Ränge sind die Daten gültig');
});

test('Validator meldet kaputte Szenen (zwei Optionen mit Wert 2, keine mit Wert 0)', () => {
  const kaputt = structuredClone(daten);
  kaputt.szenarien[0].optionen[1].wert = 2;
  assert.ok(pruefeSzenarien(kaputt).some((f) => f.includes('genau EINE')));
  const ohneNull = structuredClone(daten);
  for (const o of ohneNull.szenarien[1].optionen) if (o.wert === 0) o.wert = 1;
  assert.ok(pruefeSzenarien(ohneNull).some((f) => f.includes('mindestens eine')));
});

test('Teilwert 1 nur für halb richtige Handlungen: Spiegel und Wecken geben 0', () => {
  const spiegel = daten.szenarien.flatMap((s) => s.optionen.filter((o) => /Spiegel/.test(o.text)));
  assert.ok(spiegel.length >= 2, 'Spiegel kommt als Scheinlösung vor');
  for (const o of spiegel) assert.equal(o.wert, 0, 'ein Spiegel ersetzt keinen Artgenossen');
  const hamster = daten.szenarien.find((s) => s.id === 't02');
  for (const o of hamster.optionen.filter((o) => /weck|hole ihn/i.test(o.text))) {
    assert.equal(o.wert, 0, 'nachtaktives Tier am Tag wecken ist nie halb richtig');
  }
});

test('Kein Beschämen in Erklärungen, Erwachsene werden bei Gefahr einbezogen', () => {
  for (const s of daten.szenarien) {
    assert.doesNotMatch(s.erklaerung, /dumm|böse|schäm|Versager/i, s.id);
  }
  for (const id of ['t07', 't08', 't10']) {
    const s = daten.szenarien.find((x) => x.id === id);
    const beste = s.optionen.find((o) => o.wert === 2);
    assert.match(beste.text + s.erklaerung, /Erwachsen|Tierärzt|Tierarzt/, `${id}: Erwachsene im Boot`);
  }
});

test('Kinder werden nicht bewertet: kein Zähler, kein Rang, kein Rekord, kein Ergebnissatz im App-Code', () => {
  assert.doesNotMatch(appQuelle, /\bpunkte\b|maxPunkte|\brang\b|rangFuer|raenge|ergebnisSatz|REKORD|Dein Rekord|Tierfreund-Punkten/, 'weder Punkte noch Rang noch Rekord');
  assert.doesNotMatch(appQuelle, /🏅|🌟|🏆|Geschafft/, 'kein Pokal, kein Stern, kein Geschafft');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende heißt neutral „Ende der Runde“');
  // 2/1/0 bleibt die Rückmeldung zu jeder Antwort, es wird aber nichts addiert.
  assert.doesNotMatch(appQuelle, /\+=\s*option\.wert/, 'die Werte der Optionen werden nicht summiert');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Löschknopf; der alte Schlüssel wird einmal entfernt', () => {
  assert.doesNotMatch(appQuelle, /setItem|getItem|datenKarte|loescheDaten|daten-karte|sprache\.mjs/, 'kein Speicher, keine Löschkarte, keine Sprachwahl');
  const zeilen = appQuelle.split('\n').filter((z) => z.includes('removeItem'));
  assert.deepEqual(zeilen, ["try { localStorage.removeItem('tier.rekord'); } catch {}"], 'genau eine Zeile: der alte Schlüssel, als Literal');
  assert.doesNotMatch(appQuelle, /Meine Daten löschen|Rekord löschen/, 'ohne Speicher keine Karte und kein Löschknopf');
  assert.match(elternSeite, /speichert nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten löschen|Rekord löschen/, 'ohne Speicher keine Karte');
});
