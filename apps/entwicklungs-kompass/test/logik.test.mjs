import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  kuerzelOk, normalisiereKuerzel, MAX_KUERZEL,
  zaehleDokumentiert, berichtFuerKind,
} from '../logik.mjs';

const katalog = JSON.parse(await readFile(new URL('../daten/indikatoren.json', import.meta.url), 'utf8'));
const ind = (bereich, i) => katalog.bereiche.find((b) => b.id === bereich).indikatoren[i];

test('kuerzelOk: 1..3 Zeichen sind gültig, Namen (zu lang) werden abgelehnt', () => {
  assert.ok(kuerzelOk('A'));
  assert.ok(kuerzelOk('AB'));
  assert.ok(kuerzelOk('L2'));
  assert.equal(MAX_KUERZEL, 3);
  assert.ok(!kuerzelOk(''), 'leer ist ungültig');
  assert.ok(!kuerzelOk('   '), 'nur Leerzeichen ist ungültig');
  assert.ok(!kuerzelOk('Anna'), 'ein Name (>3 Zeichen) ist ungültig');
  assert.ok(!kuerzelOk(42), 'nur Strings sind gültig');
});

test('normalisiereKuerzel: trimmt und kappt hart bei MAX_KUERZEL Zeichen', () => {
  assert.equal(normalisiereKuerzel('  ab '), 'ab');
  assert.equal(normalisiereKuerzel('Annalena'), 'Ann', 'ein Name wird auf 3 Zeichen gekappt (keine Namen)');
  assert.equal(normalisiereKuerzel(null), '');
  assert.equal(normalisiereKuerzel(123), '');
});

test('zaehleDokumentiert: zählt nur gültige Stufen, fremde/kaputte Einträge zählen nicht', () => {
  assert.equal(zaehleDokumentiert(katalog, {}), 0);
  assert.equal(zaehleDokumentiert(katalog, undefined), 0);
  const beob = { [ind('bewegung', 0).id]: 'sicher', [ind('sprache', 1).id]: 'manchmal' };
  assert.equal(zaehleDokumentiert(katalog, beob), 2);
  // unbekannte Stufe und unbekannter Indikator dürfen nicht mitzählen:
  const muell = { [ind('denken', 0).id]: 'super', fremd: 'sicher', toString: 'sicher' };
  assert.equal(zaehleDokumentiert(katalog, muell), 0);
});

test('berichtFuerKind: Text je Kind mit Kürzel, Datum und Diagnose-Abgrenzung', () => {
  const beob = { [ind('bewegung', 0).id]: 'sicher', [ind('sozial', 2).id]: 'noch-nicht' };
  const bericht = berichtFuerKind(katalog, 'AB', beob, '12.07.2026');
  assert.ok(bericht.includes('Kürzel): AB'), 'Kürzel fehlt');
  assert.ok(bericht.includes('12.07.2026'), 'Datum fehlt');
  assert.ok(bericht.includes('Beobachtung, keine Diagnose'), 'Diagnose-Abgrenzung fehlt');
  assert.ok(bericht.includes('Frühförderstellen'), 'Hinweis auf Frühförderstellen fehlt');
  for (const b of katalog.bereiche) assert.ok(bericht.includes(b.name), `Bereich ${b.name} fehlt`);
  // dokumentierte Stufe erscheint als Marke am passenden Indikator:
  assert.ok(bericht.includes(`[sicher] ${ind('bewegung', 0).text}`), 'dokumentierte Stufe fehlt');
  assert.ok(bericht.includes(`[noch nicht] ${ind('sozial', 2).text}`), 'Stufe „noch nicht“ fehlt');
});

test('berichtFuerKind: nicht Dokumentiertes ist "(offen)", keine Zahlenwertung', () => {
  const bericht = berichtFuerKind(katalog, 'CD', {}, '12.07.2026');
  const offen = bericht.match(/\[offen\]/g) ?? [];
  assert.equal(offen.length, 30, 'ohne Beobachtung sind alle 30 Indikatoren offen');
  assert.ok(!bericht.includes('%'), 'keine Prozentwerte im Bericht');
  assert.ok(!/\bPunkte?\b/i.test(bericht), 'kein Punktestand im Bericht');
  assert.ok(!/\bScore\b/i.test(bericht), 'kein Score im Bericht');
});
