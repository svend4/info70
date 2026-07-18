import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/rechte.json', import.meta.url), 'utf8'));
const artikel = daten.artikel;

test('Genug Artikel, jeder vollständig und einem Bereich zugeordnet', () => {
  assert.ok(artikel.length >= 12, `mindestens 12 Artikel (ist: ${artikel.length})`);
  const bereiche = new Set(daten.bereiche.map((b) => b.id));
  const nrs = new Set();
  for (const a of artikel) {
    assert.ok(a.titel && a.emoji && a.leichteSprache, `unvollständig: Art. ${a.nr}`);
    assert.ok(bereiche.has(a.bereich), `Art. ${a.nr}: unbekannter Bereich ${a.bereich}`);
    assert.ok(!nrs.has(a.nr), `Art. ${a.nr}: doppelt`);
    nrs.add(a.nr);
  }
});

test('Alle vier Bereiche (Schutz, Förderung, Mitbestimmung, digital) sind belegt', () => {
  for (const b of ['schutz', 'foerderung', 'mitbestimmung', 'digital']) {
    assert.ok(artikel.some((a) => a.bereich === b), `Bereich ${b} hat keinen Artikel`);
    assert.ok(daten.bereiche.some((x) => x.id === b), `Bereich ${b} fehlt in der Liste`);
  }
});

test('Leichte Sprache: kurze Sätze (ein Gedanke pro Satz)', () => {
  for (const a of artikel) {
    for (const satz of a.leichteSprache.split(/(?<=[.!?])\s+/)) {
      assert.ok(satz.length <= 90, `Art. ${a.nr}: Satz zu lang für Leichte Sprache: ${satz}`);
    }
  }
});

test('Kernrechte vorhanden: Meinung (12), Privatsphäre (16), Schutz vor Gewalt (19), Spiel (31)', () => {
  for (const nr of [12, 16, 19, 31]) {
    assert.ok(artikel.some((a) => a.nr === nr), `Artikel ${nr} fehlt`);
  }
  const schutz19 = artikel.find((a) => a.nr === 19);
  assert.ok(schutz19.leichteSprache.includes('116 111'), 'Schutz-Artikel nennt die Hilfenummer');
});
