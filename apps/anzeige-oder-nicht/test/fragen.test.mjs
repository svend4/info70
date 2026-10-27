import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeFragen } from '../../../packages/quiz-kern/src/schema.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Schema gültig (quiz-kern)', () => {
  assert.deepEqual(pruefeFragen(daten, { mindestFragen: 12 }), []);
});

test('didaktische Balance: beide binaer-Antworten kommen vor', () => {
  const antworten = new Set(daten.fragen.filter((f) => f.typ === 'binaer').map((f) => f.korrekt));
  assert.ok(antworten.has('ja') && antworten.has('nein'), 'sonst lernt das Kind "alles ist Werbung"');
});

test('Mischung aus Aussagen und Wissensfragen', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('binaer') && typen.has('wahl'));
});

test('inhaltliche Abdeckung: Werbeformen + Meinung-vs-Werbung + Kennzeichnung', () => {
  const kat = (name) => daten.fragen.filter((f) => f.kategorie === name);
  assert.ok(kat('Werbeformen').length >= 3, 'Merch, Produktplatzierung, Affiliate');
  assert.ok(kat('Meinung vs. Werbung').length >= 2, 'ehrliche Meinung abgrenzen');
  assert.ok(kat('Kennzeichnung').length >= 2, 'Kennzeichnungspflicht');
});

test('die Influencer-Werbeformen sind benannt', () => {
  const alles = JSON.stringify(daten.fragen).toLowerCase();
  assert.match(alles, /#anzeige|anzeige|werbung/, 'Kennzeichnung #anzeige');
  assert.match(alles, /merch/, 'Merch-Verkauf');
  assert.match(alles, /produktplatzierung/, 'Produktplatzierung');
  assert.match(alles, /affiliate|rabattcode|code/, 'Affiliate/Rabattcode');
  assert.match(alles, /meinung/, 'Werbung von Meinung trennen');
});

test('Kinder werden nicht bewertet: die Daten haben keine Ränge, die 12er-Runde bleibt möglich', () => {
  assert.ok(!('raenge' in daten), 'keine Rang- oder Punkteschwellen in den Daten');
  assert.ok(daten.fragen.length >= 12);
});

test('App-Code und Eltern-Seite: keine Wertung, kein Speicher, keine Karte „Meine Daten löschen“', async () => {
  const code = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  const eltern = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
  assert.doesNotMatch(code, /ergebnisSatz|raenge|Geschafft/, 'kein Ergebnissatz, keine Ränge, kein „Geschafft“');
  assert.doesNotMatch(code, /setItem|datenKarte|daten-karte/, 'die App speichert nichts und hat keine Löschkarte');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar per Knopf/, 'ohne Speicher kein Löschknopf');
});
