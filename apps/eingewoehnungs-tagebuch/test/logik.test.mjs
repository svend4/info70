import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  MAX_KUERZEL, normalisiereKuerzel, kuerzelOk, pruefeConfig, pruefeEintrag,
  trend, empfehlung, verlaufZeilen, bericht,
} from '../logik.mjs';

const config = JSON.parse(await readFile(new URL('../daten/config.json', import.meta.url), 'utf8'));

const eintrag = (tag, phase, ampel, trennung) => ({ tag, phase, ampel, trennung });

test('Config: Phasen (Berliner Modell), Ampeln gut/wackelig/schwer, Trennungen', () => {
  assert.deepEqual(pruefeConfig(config), []);
  assert.ok(config.phasen.length >= 4, 'vier Phasen');
  const phasenIds = config.phasen.map((p) => p.id);
  assert.ok(phasenIds.includes('grundphase') && phasenIds.includes('schlussphase'));
  assert.match(config.hinweis, /keine Namen|keine Diagnose/i);
});

test('Kürzel: max 3 Zeichen, keine Namen', () => {
  assert.equal(MAX_KUERZEL, 3);
  assert.equal(normalisiereKuerzel(' ABCDE '), 'ABC');
  assert.equal(kuerzelOk('AB'), true);
  assert.equal(kuerzelOk('ABCD'), false);
});

test('pruefeEintrag: nur gültige strukturierte Felder', () => {
  assert.deepEqual(pruefeEintrag(config, eintrag(1, 'grundphase', 'gut', 'keine')), []);
  assert.ok(pruefeEintrag(config, eintrag(0, 'grundphase', 'gut', 'keine')).some((f) => /Tag/.test(f)));
  assert.ok(pruefeEintrag(config, eintrag(1, 'x', 'gut', 'keine')).some((f) => /Phase/.test(f)));
  assert.ok(pruefeEintrag(config, eintrag(1, 'grundphase', 'x', 'keine')).some((f) => /Ampel/.test(f)));
  assert.ok(pruefeEintrag(config, eintrag(1, 'grundphase', 'gut', 'x')).some((f) => /Trennung/.test(f)));
});

test('trend: aufwärts / schwierig / zu-wenig', () => {
  assert.equal(trend([]), 'zu-wenig');
  assert.equal(trend([eintrag(1, 'grundphase', 'schwer', 'keine')]), 'zu-wenig');
  const auf = [
    eintrag(1, 'grundphase', 'schwer', 'keine'),
    eintrag(2, 'trennungsversuch', 'wackelig', 'kurz'),
    eintrag(3, 'stabilisierung', 'gut', 'lang'),
    eintrag(4, 'schlussphase', 'gut', 'lang'),
  ];
  assert.equal(trend(auf), 'aufwaerts');
  const schwer = [
    eintrag(1, 'grundphase', 'gut', 'keine'),
    eintrag(2, 'trennungsversuch', 'schwer', 'abbruch'),
    eintrag(3, 'trennungsversuch', 'schwer', 'abbruch'),
  ];
  assert.equal(trend(schwer), 'schwierig');
});

test('empfehlung: Trennungsabbruch hat Vorrang vor der Ampel', () => {
  assert.match(empfehlung(config, [eintrag(1, 'trennungsversuch', 'gut', 'abbruch')]), /zurück|Grundphase/i);
  assert.match(empfehlung(config, [eintrag(1, 'schlussphase', 'gut', 'lang')]), /nächsten Schritt|behutsam/i);
  assert.equal(empfehlung(config, []), '');
});

test('verlaufZeilen: chronologisch, mit Ampel/Phase/Trennung', () => {
  const z = verlaufZeilen(config, [eintrag(2, 'trennungsversuch', 'wackelig', 'kurz'), eintrag(1, 'grundphase', 'gut', 'keine')]);
  assert.equal(z.length, 2);
  assert.match(z[0], /^Tag 1:/, 'sortiert');
  assert.match(z[1], /Tag 2:.*wackelig/);
});

test('bericht: Kopf, Verlauf, Tendenz, keine Namen/keine Zahlenwertung', () => {
  const e = [eintrag(1, 'grundphase', 'gut', 'keine'), eintrag(2, 'trennungsversuch', 'wackelig', 'kurz')];
  const b = bericht(config, 'AB', e, '18.07.2026');
  assert.match(b, /Eingewöhnungs-Tagebuch/);
  assert.match(b, /Kürzel\): AB/);
  assert.match(b, /## Tagesverlauf/);
  assert.match(b, /## Tendenz/);
  assert.match(b, /keine Diagnose/);
  assert.ok(!/%|Punkte|Score/.test(b), 'kein Score');
  // leer
  assert.match(bericht(config, 'CD', [], 's'), /noch keine Tage/);
});
