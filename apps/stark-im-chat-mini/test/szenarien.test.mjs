import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const szenarien = daten.szenarien;
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');

test('Zielgruppe 6-8, genug Szenarien, jedes vollständig', () => {
  assert.equal(daten.zielgruppe, '6-8');
  assert.ok(szenarien.length >= 6, `mindestens 6 Szenarien (ist: ${szenarien.length})`);
  const ids = new Set();
  for (const s of szenarien) {
    assert.ok(s.id && s.piktogramm && s.situation, `unvollständig: ${s.id}`);
    assert.ok(s.erklaerung && s.erklaerung.length >= 20, `${s.id}: Erklärung zu kurz`);
    ids.add(s.id);
  }
  assert.equal(ids.size, szenarien.length, 'IDs eindeutig');
});

test('Genau ZWEI Optionen je Szenario (6-8), eine gut (2), eine schwach (0)', () => {
  for (const s of szenarien) {
    assert.equal(s.optionen.length, 2, `${s.id}: für 6-8 genau zwei Antworten`);
    const werte = s.optionen.map((o) => o.wert).sort();
    assert.deepEqual(werte, [0, 2], `${s.id}: eine gute (2) und eine schwache (0) Antwort`);
    for (const o of s.optionen) assert.ok(o.text && o.text.length >= 5, `${s.id}: Optionstext fehlt`);
  }
});

test('Leichte Sprache: kurze Sätze in Situation und Erklärung', () => {
  for (const s of szenarien) {
    assert.ok(s.situation.length <= 90, `${s.id}: Situation für 6-8 zu lang`);
    for (const satz of s.erklaerung.split(/(?<=[.!?])\s+/)) {
      assert.ok(satz.length <= 90, `${s.id}: Satz zu lang für Leichte Sprache: ${satz}`);
    }
  }
});

test('Kernbotschaften: Stopp sagen, nett sein, Erwachsene holen', () => {
  const alles = JSON.stringify(szenarien);
  assert.match(alles, /erwachsene Person|Lehrkraft|Mama|Papa/, 'Erwachsene holen kommt vor');
  assert.match(alles, /Hör auf|Stopp|nicht mit|nett/, 'Stopp/Nett-sein kommt vor');
});

test('Kinder werden nicht bewertet: kein Zähler, kein Rang, kein Rekord, kein Ergebnissatz im App-Code', () => {
  assert.doesNotMatch(appQuelle, /\bpunkte\b|maxPunkte|\brang\b|raenge|REKORD|Bestwert|Stark-Punkten/, 'weder Punkte noch Rang noch Rekord noch Bestwert');
  assert.doesNotMatch(appQuelle, /🏆|⭐|🌟|Super gemacht|Geschafft/, 'kein Pokal, kein Stern, kein Ergebnissatz am Ende');
  assert.ok(!('raenge' in daten), 'die Daten haben keine Ränge');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende heißt neutral „Ende der Runde“');
  // 2/0 bleibt die Rückmeldung zu jeder Antwort, es wird aber nichts addiert.
  assert.doesNotMatch(appQuelle, /\+=\s*o\.wert/, 'die Werte der Optionen werden nicht summiert');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Löschknopf; der alte Schlüssel wird einmal entfernt', () => {
  assert.doesNotMatch(appQuelle, /setItem|getItem|datenKarte|loescheDaten|daten-karte|sprache\.mjs/, 'kein Speicher, keine Löschkarte, keine Sprachwahl');
  const zeilen = appQuelle.split('\n').filter((z) => z.includes('removeItem'));
  assert.deepEqual(zeilen, ["try { localStorage.removeItem('scm.rekord'); } catch {}"], 'genau eine Zeile: der alte Schlüssel, als Literal');
  assert.doesNotMatch(appQuelle, /Meine Daten löschen/, 'ohne Speicher keine Karte');
  assert.match(elternSeite, /speichert nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten löschen/, 'ohne Speicher keine Karte');
});
