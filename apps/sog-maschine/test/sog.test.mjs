import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MECHANIKEN, mechanik, bewerteSchaetzung, formatSekunden, VIDEOS } from '../sog.mjs';

test('Mechaniken-Katalog: alle 4 Sog-Tricks mit Panel- und Lehr-Text', () => {
  assert.deepEqual(MECHANIKEN.map((m) => m.code).sort(), ['autoplay', 'endlos', 'glitzer', 'streak']);
  for (const m of MECHANIKEN) {
    assert.ok(m.name && m.emoji, `${m.code}: Name/Emoji fehlt`);
    assert.ok(m.panel?.length >= 40, `${m.code}: Panel-Text fehlt`);
    assert.ok(m.lehre?.length >= 40, `${m.code}: Lehre fehlt`);
  }
  assert.throws(() => mechanik('hypnose'));
  assert.equal(mechanik('streak').emoji, '🔥');
});

test('Videos: genug Nachschub für den Demo-Feed, harmlos-fantasievoll', () => {
  assert.ok(VIDEOS.length >= 10);
  assert.equal(new Set(VIDEOS).size, VIDEOS.length, 'keine Duplikate');
});

test('bewerteSchaetzung: Unterschätzen wird als Sog-Effekt erkannt', () => {
  assert.equal(bewerteSchaetzung(30, 90).urteil, 'unterschaetzt');
  assert.equal(bewerteSchaetzung(60, 60).urteil, 'gut');
  assert.equal(bewerteSchaetzung(180, 60).urteil, 'ueberschaetzt');
  assert.equal(bewerteSchaetzung(60, 0).urteil, 'unbekannt');
  // Grenzen
  assert.equal(bewerteSchaetzung(60, 91).urteil, 'unterschaetzt');
  assert.equal(bewerteSchaetzung(90, 60).urteil, 'ueberschaetzt');
});

test('formatSekunden', () => {
  assert.equal(formatSekunden(0), '0:00');
  assert.equal(formatSekunden(65), '1:05');
  assert.equal(formatSekunden(-3), '0:00');
});
