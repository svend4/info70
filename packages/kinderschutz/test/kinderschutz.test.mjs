import { test } from 'node:test';
import assert from 'node:assert/strict';
import { KRITERIEN, istBekanntesKriterium, istEigenerOrigin, installiereNetzwerkWaechter } from '../src/index.mjs';

test('Kriterienkatalog: IDs eindeutig, Pflichtfelder vorhanden', () => {
  const ids = KRITERIEN.map((k) => k.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Kriterien-IDs');
  for (const k of KRITERIEN) {
    assert.ok(k.id && k.quelle && k.text, `Kriterium unvollständig: ${JSON.stringify(k)}`);
  }
  assert.ok(istBekanntesKriterium('werbefrei'));
  assert.ok(!istBekanntesKriterium('gibt-es-nicht'));
});

test('istEigenerOrigin unterscheidet eigene und fremde URLs', () => {
  const origin = 'https://kinder.example';
  assert.ok(istEigenerOrigin('/daten/fragen.json', origin));
  assert.ok(istEigenerOrigin('https://kinder.example/pfad', origin));
  assert.ok(!istEigenerOrigin('https://tracker.example/pixel', origin));
  assert.ok(!istEigenerOrigin('nicht-mal-eine-url', ''));
});

test('NetzwerkWaechter blockiert fremde fetch-Anfragen und erlaubt eigene', async () => {
  const aufrufe = [];
  const fakeWin = {
    location: { origin: 'https://kinder.example' },
    fetch: async (url) => {
      aufrufe.push(String(url));
      return { ok: true };
    },
  };
  const verstoesse = installiereNetzwerkWaechter(fakeWin, () => {});

  const eigene = await fakeWin.fetch('https://kinder.example/daten.json');
  assert.ok(eigene.ok);
  await assert.rejects(() => fakeWin.fetch('https://cdn.example/lib.js'), /blockiert/);

  assert.deepEqual(aufrufe, ['https://kinder.example/daten.json']);
  assert.deepEqual(verstoesse(), ['https://cdn.example/lib.js']);
});
