import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FRAGEN, relevanteFragen, fertig, bewerte } from '../logik.mjs';

test('Fragen: die vier Entscheidungsschritte, eindeutige IDs', () => {
  const ids = FRAGEN.map((f) => f.id);
  assert.deepEqual(ids, ['personen', 'einverstanden', 'hintergrund', 'peinlich']);
  assert.equal(new Set(ids).size, ids.length);
  for (const f of FRAGEN) assert.ok(f.text.length >= 15, `${f.id}: Text zu kurz`);
});

test('relevanteFragen: „einverstanden“ nur, wenn andere Personen drauf sind', () => {
  assert.ok(!relevanteFragen({ personen: false }).some((f) => f.id === 'einverstanden'), 'ohne andere Personen entfällt die Einverständnis-Frage');
  assert.ok(relevanteFragen({ personen: true }).some((f) => f.id === 'einverstanden'), 'mit anderen Personen wird gefragt');
});

test('fertig: erst wenn alle relevanten Fragen beantwortet sind', () => {
  assert.ok(!fertig({}));
  assert.ok(fertig({ personen: false, hintergrund: false, peinlich: false }), 'ohne Personen reichen 3 Antworten');
  assert.ok(!fertig({ personen: true, hintergrund: false, peinlich: false }), 'mit Personen fehlt einverstanden');
  assert.ok(fertig({ personen: true, einverstanden: true, hintergrund: false, peinlich: false }));
});

test('bewerte: Peinliches/Badekleidung → ROT', () => {
  const r = bewerte({ personen: false, hintergrund: false, peinlich: true });
  assert.equal(r.ampel, 'rot');
  assert.ok(r.gruende.some((g) => /Badekleidung|Peinliches/.test(g)));
});

test('bewerte: andere ohne Einverständnis → ROT (Recht am eigenen Bild)', () => {
  const r = bewerte({ personen: true, einverstanden: false, hintergrund: false, peinlich: false });
  assert.equal(r.ampel, 'rot');
  assert.ok(r.gruende.some((g) => /Recht am eigenen Bild|Ja.*von allen/.test(g)));
});

test('bewerte: verräterischer Hintergrund → GELB', () => {
  const r = bewerte({ personen: false, hintergrund: true, peinlich: false });
  assert.equal(r.ampel, 'gelb');
  assert.ok(r.gruende.some((g) => /Hintergrund/.test(g)));
});

test('bewerte: alles sicher → GRÜN', () => {
  const r = bewerte({ personen: false, hintergrund: false, peinlich: false });
  assert.equal(r.ampel, 'gruen');
  assert.match(r.tipp, /privat/);
});

test('Kinderrecht: bei Rot darf das Kind auch Eltern-Fotos ablehnen', () => {
  const r = bewerte({ personen: true, einverstanden: false, hintergrund: false, peinlich: false });
  assert.match(r.tipp, /Eltern|dein Nein zählt/);
});
