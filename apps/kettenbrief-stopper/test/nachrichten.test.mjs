import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NACHRICHTEN_TYPEN, typNach, baueTyp } from '../nachrichten.mjs';

// einfacher Fake-Übersetzer: gibt den Schlüssel zurück (bzw. Array für lernpunkte)
const fakeT = (k) => (k.endsWith('_lernpunkte') ? [`${k}-1`, `${k}-2`] : k);

test('Struktur: Kettenbrief, Mutprobe und Gerücht mit Options-Flags', () => {
  const ids = NACHRICHTEN_TYPEN.map((t) => t.id);
  assert.deepEqual(ids, ['kettenbrief', 'mutprobe', 'geruecht']);
  const k = typNach('kettenbrief');
  assert.equal(k.hatMelden, false);
  assert.equal(k.hatQuellen, false);
  assert.equal(typNach('mutprobe').hatMelden, true);
  assert.equal(typNach('geruecht').hatQuellen, true);
  for (const t of NACHRICHTEN_TYPEN) assert.ok(t.emoji, `${t.id}: emoji fehlt`);
});

test('typNach: unbekannte id -> erster Typ (Fallback)', () => {
  assert.equal(typNach('gibtsnicht').id, NACHRICHTEN_TYPEN[0].id);
});

test('baueTyp: setzt Struktur + Übersetzung zusammen', () => {
  const t = baueTyp(typNach('geruecht'), fakeT);
  assert.equal(t.id, 'geruecht');
  assert.equal(t.emoji, '🗣️');
  assert.equal(t.nachricht, 'typ_geruecht_nachricht');
  assert.equal(t.melden, 'typ_geruecht_melden', 'Gerücht hat Melden');
  assert.equal(t.quellenHinweis, 'typ_geruecht_quellenHinweis');
  assert.ok(Array.isArray(t.lernpunkte) && t.lernpunkte.length >= 2);
});

test('baueTyp: Kettenbrief ohne Melden/Quellen-Hinweis (null)', () => {
  const t = baueTyp(typNach('kettenbrief'), fakeT);
  assert.equal(t.melden, null);
  assert.equal(t.quellenHinweis, null);
});
