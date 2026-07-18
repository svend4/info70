import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));
const alle = daten.bereiche.flatMap((b) => b.kriterien);

test('Katalog: Seitenstark-Bereiche, eindeutige IDs, Selbst-Check-Hinweis', () => {
  assert.ok(daten.bereiche.length >= 5, 'mindestens 5 Qualitätsbereiche');
  assert.match(daten.quelle, /Seitenstark/, 'Seitenstark als Grundlage');
  assert.match(daten.hinweis, /kein offizielles|Selbst-Check/i, 'als Selbst-Check gekennzeichnet');
  const bIds = daten.bereiche.map((b) => b.id);
  assert.equal(new Set(bIds).size, bIds.length, 'doppelte Bereichs-IDs');
  const ids = alle.map((k) => k.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Kriterien-IDs');
  assert.ok(alle.length >= 10, `mindestens 10 Kriterien (ist: ${alle.length})`);
});

test('die fünf Seitenstark-Qualitätsdimensionen sind abgedeckt', () => {
  const bereiche = daten.bereiche.map((b) => b.id);
  for (const pflicht of ['transparenz', 'redaktion', 'interaktion', 'werbung', 'barrierefreiheit']) {
    assert.ok(bereiche.includes(pflicht), `Bereich fehlt: ${pflicht}`);
  }
});

test('jedes Kriterium: Aussage, Hilfe (was Seitenstark erwartet), Bezug', () => {
  for (const k of alle) {
    assert.ok(k.text.length >= 40, `${k.id}: Aussage zu kurz`);
    assert.ok(k.hilfe.length >= 60, `${k.id}: Hilfe zu kurz`);
    assert.match(k.bezug, /Seitenstark|JMStV|JuSchG|DSGVO|DSA|DDG|MStV|BFSG|UN-KRK|WCAG/, `${k.id}: Bezug fehlt`);
  }
});

test('inhaltliche Abdeckung der Seitenstark-Kernthemen', () => {
  const text = JSON.stringify(alle).toLowerCase();
  assert.match(text, /impressum/, 'Transparenz/Impressum');
  assert.match(text, /moderiert|fremdkontakt/, 'Interaktionsschutz');
  assert.match(text, /melde/, 'Meldeweg');
  assert.match(text, /werbung.*getrennt|gekennzeichnet|werbefrei/, 'Werbung');
  assert.match(text, /kontrast|barriere|vorlese|einfache sprache/, 'Barrierefreiheit');
  assert.match(text, /spitzname|datensparsam|wenig/, 'Datensparsamkeit');
});
