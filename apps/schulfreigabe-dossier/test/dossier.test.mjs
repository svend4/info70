import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FELDER, PRUEFPUNKTE, baueDossier, baueDossierHtml, escapeHtml } from '../dossier.mjs';

test('baueDossier: enthält die zentralen technischen Aussagen', () => {
  const text = baueDossier({});
  assert.match(text, /Null-Daten-Nachweis/);
  assert.match(text, /Content-Security-Policy/);
  assert.match(text, /Keine externen Requests/);
  assert.match(text, /Kein Tracking/);
  assert.match(text, /keine personenbezogenen Daten/);
  assert.match(text, /löschbar/);
  assert.match(text, /Verfahrensbeschreibung/);
  assert.match(text, /BFSG\/EAA/);
});

test('baueDossier: leere Felder werden zu Platzhaltern in [Klammern]', () => {
  const text = baueDossier({});
  for (const code of Object.keys(FELDER)) {
    assert.match(text, new RegExp(`\\[${FELDER[code].platzhalter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\]`), `Platzhalter für ${code} fehlt`);
  }
});

test('baueDossier: ausgefüllte Felder erscheinen im Text, ohne Platzhalter', () => {
  const text = baueDossier({ schule: 'Grundschule Musterstadt', dsb: 'A. Beispiel', datum: '18.07.2026', traeger: 'Stadt Musterstadt', angebot: 'info70' });
  assert.match(text, /Schule: Grundschule Musterstadt/);
  assert.match(text, /Datenschutzbeauftragte\*r: A\. Beispiel/);
  assert.match(text, /Datum der Prüfung: 18\.07\.2026/);
  assert.ok(!text.includes('[Name der Schule]'), 'kein Platzhalter mehr, wenn ausgefüllt');
});

test('baueDossier: ist eine reine Funktion der Eingabe (deterministisch)', () => {
  const eingabe = { schule: 'X', datum: '01.01.2026' };
  assert.equal(baueDossier(eingabe), baueDossier(eingabe));
});

test('Checkliste: mindestens 8 Prüfpunkte, jeder als [x] im Dossier', () => {
  assert.ok(PRUEFPUNKTE.length >= 8);
  const text = baueDossier({});
  for (const p of PRUEFPUNKTE) assert.ok(text.includes(`[x] ${p}`), 'Prüfpunkt fehlt als [x]');
});

test('escapeHtml + baueDossierHtml: Sonderzeichen werden entschärft', () => {
  assert.equal(escapeHtml('<b>&</b>'), '&lt;b&gt;&amp;&lt;/b&gt;');
  const html = baueDossierHtml({ schule: 'A & B <Schule>' });
  assert.match(html, /<h1>/);
  assert.match(html, /A &amp; B &lt;Schule&gt;/);
  assert.ok(!/<script/i.test(html));
});
