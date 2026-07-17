import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));
const alle = daten.bereiche.flatMap((b) => b.kriterien);

test('KRIA-Katalog: 7 GC25-Bereiche, eindeutige IDs, mindestens 20 Prüfpunkte', () => {
  assert.equal(daten.bereiche.length, 7);
  assert.match(daten.quelle, /General Comment No\. 25/, 'GC25 als Grundlage benannt');
  assert.match(daten.hinweis, /VOR/, 'Hinweis: Prüfung VOR Start/Beschaffung');
  const bereichIds = daten.bereiche.map((b) => b.id);
  assert.equal(new Set(bereichIds).size, bereichIds.length, 'doppelte Bereichs-IDs');
  const ids = alle.map((k) => k.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Kriterien-IDs');
  assert.ok(alle.length >= 20, `mindestens 20 Prüfpunkte (ist: ${alle.length})`);
  for (const b of daten.bereiche) {
    assert.ok(b.name && b.emoji, `${b.id}: Name/Emoji fehlt`);
    assert.ok(b.kriterien.length >= 3, `${b.id}: mindestens 3 Prüfpunkte`);
  }
});

test('Jeder Prüfpunkt: Aussage, Prüf-Hilfe (dort passiert das Lernen), Rechtsbezug', () => {
  for (const k of alle) {
    assert.ok(k.text.length >= 40, `${k.id}: Aussage zu kurz`);
    assert.ok(k.hilfe.length >= 80, `${k.id}: Hilfe zu kurz - die Hilfe trägt das Wissen`);
    assert.match(k.bezug, /KRK|GC25|DSGVO|DSA|JuSchG|JMStV|BFSG|AI Act|DDG|UWG|WCAG|Seitenstark|BzKJ/,
      `${k.id}: Rechts-/Kriterienbezug fehlt`);
  }
});

test('Die 5 Kernthemen aus dem Katalog (docs/09 №30) sind abgedeckt', () => {
  const text = alle.map((k) => `${k.text} ${k.hilfe}`).join(' ');
  assert.match(text, /Kindeswohl/, 'Kindeswohlvorrang');
  assert.match(text, /[Dd]atenminimierung|unvermeidbare Minimum/, 'Datenminimierung');
  assert.match(text, /Dark Patterns/, 'Dark Patterns');
  assert.match(text, /[Bb]eschwerde/, 'Beschwerdeweg');
  assert.match(text, /Alterseignung/, 'Alterseignung (nicht nur Altersfreigabe)');
  assert.ok(text.includes('116 111'), 'anbieterunabhängige Hilfe (116 111)');
});

test('Politik-Wächter: keine Anleitung zur Datensammlung über Kinder', () => {
  for (const k of alle) {
    const t = `${k.text} ${k.hilfe}`;
    assert.ok(!/Klarname|Geburtsdatum erheben|Adresse erfassen/.test(t),
      `${k.id}: klingt nach Datensammel-Anleitung`);
  }
});
