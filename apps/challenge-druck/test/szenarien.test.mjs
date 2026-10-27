import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const TAKTIK_CODES = Object.keys(daten.taktiken);

test('Taktik-Katalog: 5 Druck-Taktiken mit Erklärungen', () => {
  assert.equal(TAKTIK_CODES.length, 5);
  for (const [code, tk] of Object.entries(daten.taktiken)) {
    assert.ok(tk.name && tk.emoji, `${code}: Name/Emoji fehlt`);
    assert.ok(tk.erklaerung?.length >= 40, `${code}: Erklärung fehlt/zu kurz`);
  }
});

test('jedes Szenario: Eröffnung ohne Taktik, danach alle 5 Taktiken genau einmal', () => {
  assert.ok(daten.szenarien.length >= 3, 'mindestens 3 Szenarien');
  for (const s of daten.szenarien) {
    assert.ok(s.titel && s.chat.length === 6, `${s.id}: 1 Eröffnung + 5 Druck-Nachrichten`);
    assert.equal(s.chat[0].taktik, null, `${s.id}: erste Nachricht ist die Eröffnung`);
    const taktiken = s.chat.slice(1).map((n) => n.taktik).sort();
    assert.deepEqual(taktiken, [...TAKTIK_CODES].sort(), `${s.id}: alle 5 Taktiken genau einmal`);
    for (const n of s.chat) assert.ok(n.von && n.text?.length >= 10, `${s.id}: Nachricht unvollständig`);
  }
});

test('Sicherheits-Leitplanken: keine Anleitungen, Hilfe-Adresse vorhanden', () => {
  const text = JSON.stringify(daten);
  assert.ok(text.includes('116 111'), 'Nummer gegen Kummer muss vorkommen');
  assert.ok(daten.ausstiege.length >= 5, 'mindestens 5 Ausstiegs-Sätze');
  // Der gefährliche Trend wird benannt, aber nie mit Durchführungs-Details beschrieben
  assert.ok(!/so geht('s| es)|anleitung|schritt 1/i.test(text), 'keine Anleitungs-Sprache');
});

const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');

test('Kinder werden nicht bewertet: kein Trefferzähler, kein Ergebnissatz, keine Ampelfarben, kein Held-Symbol', () => {
  assert.doesNotMatch(appQuelle, /treffer|punkte|rekord|rang\b|stark\b|🦸|🏆/i, 'app.mjs zählt nichts und stuft nichts ein');
  assert.doesNotMatch(appQuelle, /von 5 Tricks|Druck am Ende|Geschafft/, 'kein Ergebnissatz am Ende');
  assert.doesNotMatch(appQuelle, /k-rot|k-gruen|f59e0b/, 'der Druck-Messer hat eine Farbe, keine Ampel');
  assert.ok(!('raenge' in daten), 'die Daten haben keine Raenge');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende heißt neutral „Ende der Runde“');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Löschknopf', () => {
  assert.doesNotMatch(appQuelle, /setItem|removeItem|datenKarte|daten-karte|sprache\.mjs|localStorage/, 'kein Speicher, keine Löschkarte, keine Sprachwahl');
  assert.match(elternSeite, /speichert überhaupt nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten löschen/, 'ohne Speicher keine Karte');
});
