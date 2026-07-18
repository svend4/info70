import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));
const alle = daten.bereiche.flatMap((b) => b.punkte);

test('Katalog: Bereiche und Punkte mit eindeutigen IDs, Erklärkarten', () => {
  assert.ok(daten.bereiche.length >= 4, 'mindestens 4 Bereiche');
  const ids = alle.map((p) => p.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
  assert.ok(alle.length >= 8, `genug Prüfpunkte (ist: ${alle.length})`);
  for (const p of alle) {
    assert.ok(p.frage?.length >= 15, `${p.id}: Frage zu kurz`);
    assert.ok(p.warum?.length >= 40, `${p.id}: Erklärkarte zu kurz`);
  }
});

test('die Kauf-Prüfdimensionen sind abgedeckt', () => {
  const bereiche = daten.bereiche.map((b) => b.id);
  for (const pflicht of ['alter', 'kommunikation', 'kosten', 'daten']) {
    assert.ok(bereiche.includes(pflicht), `Bereich fehlt: ${pflicht}`);
  }
});

test('inhaltliche Abdeckung der Katalog-Themen', () => {
  const text = JSON.stringify(alle).toLowerCase();
  assert.match(text, /usk|pege|pegi|alterskennzeichen/, 'Alterskennzeichen');
  assert.match(text, /chat/, 'Chat abschaltbar');
  assert.match(text, /kaufsperre|passwort/, 'Kaufsperre');
  assert.match(text, /lootbox/, 'Lootbox-Mechaniken');
  assert.match(text, /daten|anmeldung|spitzname/, 'Daten/Anmeldung');
});
