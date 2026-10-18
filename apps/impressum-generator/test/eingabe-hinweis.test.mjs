import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { FELDER, KINDER_HINWEIS, RECHTSFORMEN, sichtbareFelder } from '../logik.mjs';

// Quelltext-Prüfung für app.mjs: die Datei importiert Browser-Module und lässt sich in node nicht ausführen.
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Hinweistext steht als Konstante: „Keine Namen von Kindern eingeben.“', () => {
  assert.equal(KINDER_HINWEIS, 'Keine Namen von Kindern eingeben.');
});

test('Hinweis an allen freien Feldern: jedes Feld des Katalogs und jedes sichtbare Feld in allen Rechtsformen', () => {
  const ohne = Object.keys(FELDER).filter((f) => FELDER[f].hinweis !== true);
  assert.deepEqual(ohne, [], 'Felder ohne Hinweis im Katalog');
  for (const r of RECHTSFORMEN) {
    for (const redaktionell of [false, true]) {
      for (const f of sichtbareFelder(r.code, redaktionell)) {
        assert.equal(FELDER[f].hinweis, true, `${r.code}/redaktionell=${redaktionell}: ${f} ohne Hinweis`);
      }
    }
  }
});

test('Hinweis gilt auch für E-Mail, Telefon, Vertretung und USt-ID (dort können ebenfalls Kindernamen stehen)', () => {
  for (const f of ['email', 'telefon', 'vertretung', 'ustid']) {
    assert.equal(FELDER[f].hinweis, true, `${f} hat keinen Hinweis`);
  }
});

test('Hinweis ist sichtbar: nicht versteckt, nicht aria-hidden, nicht sr-only', () => {
  const zeile = app.match(/hinweis \? el\('span'[^\n]*/);
  assert.ok(zeile, 'Hinweis-Element in app.mjs nicht gefunden');
  assert.doesNotMatch(zeile[0], /display:\s*none|visibility:\s*hidden|sr-only|aria-hidden|hidden/);
});

test('Hinweis steht als eigenes Element mit id direkt vor dem Eingabefeld, nicht im label-Text', () => {
  assert.match(app, /hinweis \? el\('span', \{ id: `ig-hinweis-\$\{f\}`, style: '[^']*' \}, KINDER_HINWEIS\) : null,\s*eingabe\);/);
});

test('Eingabefeld verweist per aria-describedby auf den Hinweis; Feldname (aria-label) bleibt FELDER[f].label', () => {
  assert.match(app, /\.\.\.\(hinweis \? \{ 'aria-describedby': `ig-hinweis-\$\{f\}` \} : \{\}\)/);
  assert.match(app, /'aria-label': FELDER\[f\]\.label,/);
});
