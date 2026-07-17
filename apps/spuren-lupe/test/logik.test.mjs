import { test } from 'node:test';
import assert from 'node:assert/strict';
import { dauerText, geraeteEinschaetzung, SIGNALE, LEKTIONEN } from '../logik.mjs';

test('dauerText: Sekunden und Minuten, korrekte Ein-/Mehrzahl', () => {
  assert.equal(dauerText(0), '0 Sekunden');
  assert.equal(dauerText(1), '1 Sekunde');
  assert.equal(dauerText(8), '8 Sekunden');
  assert.equal(dauerText(60), '1 Minute 0 Sekunden');
  assert.equal(dauerText(125), '2 Minuten 5 Sekunden');
  assert.equal(dauerText(-5), '0 Sekunden', 'nie negativ');
});

test('geraeteEinschaetzung: Touch vs. Maus, keine falsche Gewissheit', () => {
  assert.match(geraeteEinschaetzung(true), /Handy|Tablet|Finger/);
  assert.match(geraeteEinschaetzung(false), /Computer|Maus|Trackpad/);
  // Formuliert als Einschaetzung ("eher"), nicht als Tatsache
  assert.match(geraeteEinschaetzung(true), /eher/);
});

test('SIGNALE: sinnvolle Struktur, jedes Signal erklärt seine Bedeutung', () => {
  assert.ok(SIGNALE.length >= 6);
  const codes = SIGNALE.map((s) => s.code);
  assert.equal(new Set(codes).size, codes.length, 'doppelte Codes');
  for (const s of SIGNALE) {
    assert.ok(s.name && s.emoji, `${s.code}: Name/Emoji fehlt`);
    assert.ok(s.bedeutung?.length >= 40, `${s.code}: Bedeutung zu kurz (dort passiert das Lernen)`);
  }
  // Verhaltensspuren (Dauer, Klicks) müssen dabei sein - der Kern der Idee
  assert.ok(codes.includes('dauer') && codes.includes('klicks'), 'Verhalten ist selbst ein Datum');
});

test('Lektionen: passives Tracking, Fingerabdruck, "sendet nichts", Schutztipps', () => {
  const text = LEKTIONEN.join(' ');
  assert.match(text, /ohne Eingabe|passives Tracking/i, 'Kern-Erkenntnis');
  assert.match(text, /Fingerabdruck/, 'Fingerprinting-Bild');
  assert.match(text, /sendet NICHTS|Netzwerk-Wächter/, 'die lokale Zusage');
  assert.match(text, /Cookie|Tracking-Schutz|Erlaubnis/, 'konkrete Schutztipps');
});
