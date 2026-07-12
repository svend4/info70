import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));

test('Struktur: 4 Bereiche mit je 5 Aussagen, eindeutige IDs', () => {
  assert.equal(daten.bereiche.length, 4, 'genau 4 Bereiche');
  const alle = daten.bereiche.flatMap((b) => b.aussagen);
  assert.equal(alle.length, 20, '20 Aussagen insgesamt');
  for (const b of daten.bereiche) {
    assert.ok(b.id && b.name, 'Bereich braucht id und name');
    assert.equal(b.aussagen.length, 5, `${b.name}: genau 5 Aussagen`);
  }
  const ids = alle.map((a) => a.id);
  assert.equal(new Set(ids).size, ids.length, 'Aussagen-IDs eindeutig');
});

test('jede Aussage: Text und Handlungsimpuls vorhanden und ausreichend lang', () => {
  for (const a of daten.bereiche.flatMap((b) => b.aussagen)) {
    assert.ok(a.text?.length >= 20, `${a.id}: Aussage zu kurz`);
    assert.ok(a.impuls?.length >= 30, `${a.id}: Handlungsimpuls fehlt/zu kurz`);
  }
});

test('Datenschutz-Selbstbindung: kein kindbezogenes Vokabular in den Aussagen', () => {
  const text = JSON.stringify(daten.bereiche).toLowerCase();
  for (const wort of ['name des kindes', 'soziogramm', 'rangliste', 'punkte pro kind']) {
    assert.ok(!text.includes(wort), `verbotenes Konzept: ${wort}`);
  }
  assert.ok(daten.hinweis?.toLowerCase().includes('keine kindbezogenen daten'));
});
