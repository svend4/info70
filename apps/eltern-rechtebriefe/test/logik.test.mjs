import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BRIEFE, findeBrief, baueBrief } from '../logik.mjs';

const appQuelle = await (await import('node:fs/promises')).readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Briefe: die drei Muster mit richtigen Artikeln', () => {
  const ids = BRIEFE.map((b) => b.id);
  assert.deepEqual(ids.sort(), ['auskunft', 'loeschung', 'widerruf']);
  assert.match(findeBrief('auskunft').artikel, /Art\. 15/);
  assert.match(findeBrief('loeschung').artikel, /Art\. 17/);
  assert.match(findeBrief('widerruf').artikel, /Art\. 7/);
  for (const b of BRIEFE) assert.ok(b.betreff && b.einleitung && b.kern, `${b.id}: Feld fehlt`);
});

test('baueBrief: übernimmt Angaben, richtiger Betreff und Fristhinweis', () => {
  const t = baueBrief('auskunft', { empfaenger: 'Datenschutz GmbH', dienst: 'KinderApp', absender: 'Erika Muster', adresse: 'Musterweg 1', datum: '18.07.2026', betroffene: 'Kind Muster' });
  assert.match(t, /Auskunftsersuchen nach Art\. 15 DSGVO/);
  assert.match(t, /Erika Muster/);
  assert.match(t, /KinderApp/);
  assert.match(t, /Kind Muster/);
  assert.match(t, /innerhalb eines Monats/, 'Frist Art. 12 Abs. 3');
  assert.match(t, /Art\. 77 DSGVO/, 'Beschwerderecht');
});

test('Löschantrag: Hinweis auf besonders starkes Löschrecht bei Kinderdaten', () => {
  const t = baueBrief('loeschung', {});
  assert.match(t, /Löschung/);
  assert.match(t, /Erwägungsgrund 65|Kindesalter/, 'starkes Kinder-Löschrecht');
});

test('Widerruf: Zweck wird eingesetzt', () => {
  const t = baueBrief('widerruf', { einwilligung: 'Newsletter-Versand' });
  assert.match(t, /Art\. 7 Abs\. 3/);
  assert.match(t, /Newsletter-Versand/);
  assert.ok(!/\{einwilligung\}/.test(t), 'Platzhalter ersetzt');
});

test('leere Angaben liefern Platzhalter, keine externen Links', () => {
  const t = baueBrief('auskunft', {});
  assert.match(t, /\[Ihr Name\]/);
  assert.ok(!/https?:\/\//.test(t), 'keine externen Links');
});

test('Datenvermeidung: Angaben werden nicht gespeichert', () => {
  assert.match(appQuelle, /nicht gespeichert|nur.*Ausdruck|NICHT gespeichert/i, 'Zusage im Code');
  assert.ok(!/setItem\(/i.test(appQuelle), 'kein localStorage.setItem');
});
