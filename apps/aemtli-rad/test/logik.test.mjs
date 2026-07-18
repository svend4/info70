import { test } from 'node:test';
import assert from 'node:assert/strict';
import { STANDARD_DIENSTE, zuteilung, zugeteilteKinder, jederDienstProKind, baueWochenplan } from '../logik.mjs';

const KINDER = ['Ada', 'Bo', 'Cem', 'Dana'];

test('zuteilung: je Dienst ein Kind, deterministisch', () => {
  const z = zuteilung(KINDER, STANDARD_DIENSTE, 0);
  assert.equal(z.length, STANDARD_DIENSTE.length);
  assert.deepEqual(z, zuteilung(KINDER, STANDARD_DIENSTE, 0), 'gleiche Woche -> gleiche Zuteilung');
  assert.ok(z.every((e) => KINDER.includes(e.kind)));
});

test('Rotation: jede Woche rückt jeder Dienst um ein Kind weiter', () => {
  const w0 = zuteilung(KINDER, ['Tafel'], 0)[0].kind;
  const w1 = zuteilung(KINDER, ['Tafel'], 1)[0].kind;
  const i0 = KINDER.indexOf(w0);
  const i1 = KINDER.indexOf(w1);
  assert.equal(i1, (i0 + 1) % KINDER.length, 'genau eine Position weiter');
});

test('Fairness: über eine volle Runde macht jedes Kind jeden Dienst', () => {
  // gleiche Zahl Dienste wie Kinder -> nach `kinder.length` Wochen alles durch
  const dienste = ['Tafel', 'Blumen', 'Austeilen', 'Aufräumen'];
  const g = jederDienstProKind(KINDER, dienste, KINDER.length);
  for (const [kind, dienstSet] of g) {
    assert.equal(dienstSet.size, dienste.length, `${kind} hatte nicht jeden Dienst`);
  }
});

test('mehr Dienste als Kinder: niemand bleibt ohne Zuteilung (Kind darf mehrfach)', () => {
  const kinder = ['A', 'B'];
  const z = zuteilung(kinder, STANDARD_DIENSTE, 0);
  assert.ok(z.every((e) => e.kind !== null));
  assert.ok(zugeteilteKinder(kinder, STANDARD_DIENSTE, 0).every((k) => kinder.includes(k)));
});

test('keine Kinder: Dienste bleiben leer, kein Absturz', () => {
  const z = zuteilung([], STANDARD_DIENSTE, 3);
  assert.ok(z.every((e) => e.kind === null));
});

test('baueWochenplan: enthält Woche, Dienste, Kinder und Transparenz-Erklärung', () => {
  const t = baueWochenplan(KINDER, ['Tafel', 'Blumen'], 0);
  assert.match(t, /Woche 1/);
  assert.match(t, /Tafel: /);
  assert.match(t, /fair und vorhersagbar|kein Zufall/);
  assert.ok(!/https?:\/\//.test(t), 'keine externen Links');
});
