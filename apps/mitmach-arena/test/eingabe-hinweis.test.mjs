import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// Quelltext-Prüfung: app.mjs importiert Browser-Module und lässt sich in node nicht ausführen.
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const frageBlock = app.slice(app.indexOf('const frageFeld'), app.indexOf('const optionsFelder'));
const optionenBlock = app.slice(app.indexOf('const optionsFelder'), app.indexOf('zeige(', app.indexOf('const optionsFelder')));
const anlegenBlock = app.slice(app.indexOf('function anlegenBildschirm'), app.indexOf('function abstimmenBildschirm'));

test('Hinweistext steht am Feld: „Keine Namen von Mitschüler*innen eintragen.“', () => {
  assert.match(app, /const EINGABE_HINWEIS = 'Keine Namen von Mitschüler\*innen eintragen\.';/);
  assert.match(app, /const eingabeHinweis = \(id\) => el\('p', \{ id, style:/);
});

test('Hinweis ist sichtbar: nicht versteckt, nicht aria-hidden, nicht sr-only', () => {
  const helfer = app.slice(app.indexOf('const eingabeHinweis'), app.indexOf('function startBildschirm'));
  const hinweisBlock = anlegenBlock.slice(0, anlegenBlock.indexOf('zeige('));
  assert.doesNotMatch(helfer, /display:\s*none|visibility:\s*hidden|sr-only|aria-hidden|hidden/);
  assert.doesNotMatch(hinweisBlock, /display:\s*none|visibility:\s*hidden|sr-only|aria-hidden|hidden/);
  assert.ok(helfer.length > 0 && hinweisBlock.length > 0, 'Block nicht gefunden');
});

test('Hinweis steht direkt vor dem Feld und nicht im label', () => {
  // Label nur mit seinem Text, danach der Hinweis, danach das Feld
  assert.match(anlegenBlock, /el\('label', \{ for: 'frage', style: 'font-weight:600' \}, 'Worüber wird abgestimmt\?'\),\s*eingabeHinweis\('frage-hinweis'\),\s*frageFeld,/);
  assert.match(anlegenBlock, /el\('p', \{ style: 'font-weight:600;margin-bottom:0' \}, 'Möglichkeiten:'\),\s*eingabeHinweis\('optionen-hinweis'\),\s*\.\.\.optionsFelder,/);
  assert.doesNotMatch(app, /'Worüber wird abgestimmt\?'[^;]*Keine Namen/);
});

test('Frage-Feld: maxlength 100 unverändert, verweist per aria-describedby auf den Hinweis', () => {
  assert.match(frageBlock, /maxlength: 100/);
  assert.match(frageBlock, /'aria-describedby': 'frage-hinweis'/);
});

test('Möglichkeiten-Felder: maxlength 60 unverändert, verweisen per aria-describedby auf den Hinweis', () => {
  assert.match(optionenBlock, /maxlength: 60/);
  assert.match(optionenBlock, /'aria-describedby': 'optionen-hinweis'/);
});

test('Hinweis-ids sind eindeutig, jede verwendete id existiert als Hinweis', () => {
  const verwendet = [...app.matchAll(/eingabeHinweis\('([^']+)'\)/g)].map((m) => m[1]);
  assert.deepEqual(verwendet, ['frage-hinweis', 'optionen-hinweis']);
  assert.equal(new Set(verwendet).size, verwendet.length, 'doppelte Hinweis-id');
  const bezogen = [...app.matchAll(/'aria-describedby': '([^']+)'/g)].map((m) => m[1]);
  for (const id of bezogen) assert.ok(verwendet.includes(id), `aria-describedby verweist ins Leere: ${id}`);
});
