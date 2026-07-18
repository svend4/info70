import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));
const alle = daten.bereiche.flatMap((b) => b.kriterien);

test('Katalog: AVV-Bereiche, eindeutige IDs, Entscheidungshilfe-Hinweis', () => {
  assert.ok(daten.bereiche.length >= 4, 'mindestens 4 Bereiche');
  assert.match(daten.quelle, /Art\. 28 DSGVO|Auftragsverarbeitung/, 'Art. 28 als Grundlage');
  assert.match(daten.hinweis, /kein offizielles|Entscheidungshilfe|Checkliste/i, 'als Checkliste/Hilfe gekennzeichnet');
  const ids = alle.map((k) => k.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
  assert.ok(alle.length >= 10, `mindestens 10 Kriterien (ist: ${alle.length})`);
});

test('die AVV-Prüfdimensionen sind abgedeckt', () => {
  const bereiche = daten.bereiche.map((b) => b.id);
  for (const pflicht of ['pflichtinhalte', 'standort', 'subunternehmer', 'kinder']) {
    assert.ok(bereiche.includes(pflicht), `Bereich fehlt: ${pflicht}`);
  }
});

test('jedes Kriterium: Aussage, Hilfe, DSGVO-Bezug', () => {
  for (const k of alle) {
    assert.ok(k.text.length >= 40, `${k.id}: Aussage zu kurz`);
    assert.ok(k.hilfe.length >= 40, `${k.id}: Hilfe zu kurz`);
    assert.match(k.bezug, /DSGVO Art\. \d/, `${k.id}: DSGVO-Bezug fehlt`);
  }
});

test('inhaltliche Abdeckung der Art.-28-Kernpunkte', () => {
  const text = JSON.stringify(alle).toLowerCase();
  assert.match(text, /weisung/, 'Weisungsgebundenheit');
  assert.match(text, /art\. 32|technische und organisatorische/, 'TOMs');
  assert.match(text, /eu\/im ewr|ewr|serverstandort|server stehen/, 'EU-Serverstandort');
  assert.match(text, /drittland/, 'Drittlandtransfer');
  assert.match(text, /subunternehmer/, 'Subunternehmerkette');
  assert.match(text, /datenminimierung|wenige daten|tracking/, 'kinderspezifische Datensparsamkeit');
});
