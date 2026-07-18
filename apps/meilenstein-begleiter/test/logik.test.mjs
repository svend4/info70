import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { alleIds, pruefeKatalog, zaehleFenster, offene, bericht } from '../logik.mjs';

const katalog = JSON.parse(await readFile(new URL('../daten/meilensteine.json', import.meta.url), 'utf8'));

test('Katalog: gültig, U-Fenster mit eindeutigen Ids, Warnhinweis', () => {
  assert.deepEqual(pruefeKatalog(katalog), []);
  assert.ok(katalog.fenster.length >= 4, 'U3–U6');
  assert.equal(new Set(alleIds(katalog)).size, alleIds(katalog).length, 'Ids eindeutig');
  assert.match(katalog.hinweis, /keine Diagnose|kein Ersatz|Richtwert/i);
  assert.match(katalog.hinweis, /keine Namen|keine Daten/i);
});

test('inhaltliche Abdeckung: U3–U6 und mehrere Entwicklungsbereiche', () => {
  const ids = katalog.fenster.map((f) => f.id);
  assert.deepEqual(ids, ['u3', 'u4', 'u5', 'u6']);
  const bereiche = new Set(katalog.fenster.flatMap((f) => f.meilensteine.map((m) => m.bereich)));
  for (const b of ['Motorik', 'Sprache', 'Sozial']) assert.ok(bereiche.has(b), `Bereich ${b}`);
  const alles = JSON.stringify(katalog).toLowerCase();
  assert.match(alles, /pinzettengriff|greift/, 'Greifentwicklung');
  assert.match(alles, /silben|wort/, 'Sprachentwicklung');
});

test('zaehleFenster / offene', () => {
  const f = katalog.fenster[0];
  assert.deepEqual(zaehleFenster(f, {}), { beobachtet: 0, gesamt: f.meilensteine.length });
  const b = { [f.meilensteine[0].id]: true };
  assert.equal(zaehleFenster(f, b).beobachtet, 1);
  assert.equal(offene(f, b).length, f.meilensteine.length - 1);
});

test('bericht: Kopf mit U-Heft-Hinweis, Fenster, Checkboxen', () => {
  const b = { [katalog.fenster[0].meilensteine[0].id]: true };
  const text = bericht(katalog, b, null, '18.07.2026');
  assert.match(text, /Meilenstein-Begleiter 1\. Lebensjahr/);
  assert.match(text, /U-Untersuchungen|U-Heft/);
  assert.match(text, /Stand: 18\.07\.2026/);
  assert.match(text, /☑/);
  assert.match(text, /☐/);
  // ein einzelnes Fenster
  const nurU3 = bericht(katalog, {}, 'u3', 's');
  assert.match(nurU3, /U3/);
  assert.ok(!/U6/.test(nurU3), 'nur gewähltes Fenster');
});
