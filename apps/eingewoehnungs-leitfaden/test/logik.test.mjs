import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as logik from '../logik.mjs';

const { pruefeConfig, schluessel, bilanz, bilanzZahlen, druckBlatt, PHASEN_IDS } = logik;

const config = JSON.parse(await readFile(new URL('../daten/config.json', import.meta.url), 'utf8'));
const phase = (id) => config.phasen.find((p) => p.id === id);
const haken = (...liste) => new Set(liste);

test('Config: vier Phasen in der Reihenfolge der Eingewöhnung, ohne Fehler', () => {
  assert.deepEqual(config.phasen.map((p) => p.id), PHASEN_IDS);
  assert.deepEqual(config.phasen.map((p) => p.name), ['Grundphase', 'Erster Trennungsversuch', 'Stabilisierungsphase', 'Schlussphase']);
  assert.deepEqual(pruefeConfig(config), []);
});

test('Config: jede Handlung ist eine Frage an die Fachkraft, nie nach einem Kind', () => {
  for (const p of config.phasen) {
    const kennungen = p.handlungen.map((h) => h.id);
    assert.equal(new Set(kennungen).size, kennungen.length, `${p.id}: Kennung doppelt`);
    assert.ok(p.handlungen.length >= 4, `${p.id}: mindestens vier Handlungen`);
    for (const h of p.handlungen) {
      assert.ok(h.frage.endsWith('?'), `${p.id}: keine Frage: ${h.frage}`);
      assert.ok(!/\bKind\b|Kindes|Kinder/.test(h.frage), `${p.id}: Frage nach einem Kind: ${h.frage}`);
    }
  }
});

test('Config: keine Ampel-, Stufen- oder Empfehlungsfelder; Herkunft als Eigenentwurf benannt', () => {
  for (const feld of ['ampeln', 'trennungen', 'empfehlungen']) assert.equal(config[feld], undefined, feld);
  assert.match(config.hinweis, /keine Namen/);
  assert.match(config.herkunft, /Eigenentwurf/);
  assert.match(config.herkunft, /docs\/10/);
});

test('pruefeConfig: meldet fehlende Phase, Handlung ohne Fragezeichen und doppelte Kennung', () => {
  const ohneZweite = { phasen: config.phasen.filter((p) => p.id !== 'trennungsversuch') };
  assert.ok(pruefeConfig(ohneZweite).length >= 1);
  assert.ok(pruefeConfig(null).length >= 1);
  const kaputt = structuredClone(config);
  kaputt.phasen[0].handlungen[0].frage = 'Bezugsperson besprochen';
  assert.ok(pruefeConfig(kaputt).some((f) => /keine Frage/.test(f)));
  const doppelt = structuredClone(config);
  doppelt.phasen[0].handlungen[1].id = doppelt.phasen[0].handlungen[0].id;
  assert.ok(pruefeConfig(doppelt).some((f) => /doppelt/.test(f)));
});

test('schluessel: je Phase und Handlung eindeutig', () => {
  const alle = config.phasen.flatMap((p) => p.handlungen.map((h) => schluessel(p.id, h.id)));
  assert.equal(new Set(alle).size, alle.length);
  assert.equal(schluessel('grundphase', 'bezugsperson'), 'grundphase/bezugsperson');
});

test('bilanz: zählt nur die Haken dieser Phase, ohne Prozent und ohne Summe über Phasen', () => {
  const g = phase('grundphase');
  const n = g.handlungen.length;
  assert.equal(bilanz(g, haken()), `erledigt: 0 von ${n}`);
  assert.equal(bilanz(g, haken(schluessel('grundphase', g.handlungen[0].id))), `erledigt: 1 von ${n}`);
  const fremd = haken(schluessel('schlussphase', phase('schlussphase').handlungen[0].id));
  assert.equal(bilanz(g, fremd), `erledigt: 0 von ${n}`, 'Haken anderer Phasen zählen hier nicht');
  assert.match(bilanz(g, haken()), /^erledigt: \d+ von \d+$/);
  assert.deepEqual(bilanzZahlen(g, haken()), { erledigt: 0, gesamt: n });
});

test('Exporte: keine Funktion für Summen, Scores, Ampeln, Kürzel, Koffer oder Verläufe', () => {
  const verboten = /summe|gesamt|score|prozent|ampel|kuerzel|koffer|trend|empfehlung|verlauf|bericht|rang/i;
  for (const name of Object.keys(logik)) assert.ok(!verboten.test(name), `Export ${name}`);
});

test('druckBlatt: Titel mit Phasennummer, nur die Haken dieser Sitzung, keine Namenszeile', () => {
  const stab = phase('stabilisierung');
  const b = druckBlatt(config, 'stabilisierung', haken(schluessel('stabilisierung', stab.handlungen[0].id)));
  assert.equal(b.titel, 'Eingewöhnung – Phase 3: Stabilisierungsphase');
  assert.equal(b.punkte.length, stab.handlungen.length);
  assert.equal(b.punkte[0].erledigt, true);
  assert.ok(b.punkte.slice(1).every((p) => p.erledigt === false));
  assert.equal(b.bilanz, `erledigt: 1 von ${stab.handlungen.length}`);
  assert.ok(!/_{3,}|Name\s*:|Namenszeile/i.test(JSON.stringify(b)), 'keine Namenszeile');
  assert.throws(() => druckBlatt(config, 'gibt-es-nicht', haken()));
});

test('druckBlatt: vier verschiedene Blätter, eines je Phase', () => {
  const titel = PHASEN_IDS.map((id) => druckBlatt(config, id, haken()).titel);
  assert.equal(new Set(titel).size, 4);
});
