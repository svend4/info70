import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  PRO_SESSION, regelFuer, bewegungVon, folgtRegel,
  waehleTiere, baueAufgabe, istRichtig, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/bewegung.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const ohneMischen = (l) => [...l];
const tier = (id) => daten.tiere.find((t) => t.id === id);

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.tiere.length >= 8);
});

test('die vier Aha-Regeln des Katalogs stehen drin', () => {
  assert.equal(daten.regeln.length, 4);
  const paare = daten.regeln.map((r) => `${r.id}->${r.bewegung}`).sort();
  assert.deepEqual(paare, ['fluegel->fliegen', 'gleich->laufen', 'hinterbeine->springen', 'keine->kriechen']);
  for (const r of daten.regeln) {
    assert.ok(r.beispiel.length >= 40, `${r.id}: Beispiel zu knapp`);
    assert.ok(r.regel.length >= 25, `${r.id}: Regel zu knapp`);
  }
});

test('jedes Tier folgt seiner Regel – oder ist erklärte Ausnahme', () => {
  for (const t of daten.tiere) {
    if (folgtRegel(daten, t)) {
      assert.ok(!t.ausnahme, `${t.id}: als Ausnahme markiert, folgt aber der Regel`);
    } else {
      assert.equal(t.ausnahme, true, `${t.id}: widerspricht der Regel ohne Ausnahme-Markierung`);
      assert.match(t.erklaerung, /Regel/, `${t.id}: Ausnahme ohne Erklärung`);
    }
  }
  // Ein stillschweigendes Gegenbeispiel muss der Validator melden
  const still = kopie();
  still.tiere.find((t) => t.id === 'hase').bewegung = 'kriechen';
  assert.ok(pruefeDaten(still).some((f) => /widerspricht seiner Regel/.test(f)));
  // Eine falsch gesetzte Ausnahme ebenfalls
  const falsch = kopie();
  falsch.tiere.find((t) => t.id === 'hase').ausnahme = true;
  assert.ok(pruefeDaten(falsch).some((f) => /als Ausnahme markiert, folgt der Regel aber/.test(f)));
});

test('es gibt mindestens eine Ausnahme – der Fisch', () => {
  const ausnahmen = daten.tiere.filter((t) => t.ausnahme);
  assert.ok(ausnahmen.length >= 1, 'eine Regel ohne Gegenbeispiel wirkt größer, als sie ist');
  const fisch = tier('fisch');
  assert.equal(fisch.koerperbau, 'keine');
  assert.equal(fisch.bewegung, 'schwimmen');
  assert.equal(folgtRegel(daten, fisch), false);
  assert.match(fisch.erklaerung, /Regel nicht|Regeln gelten/);
  // Ohne jede Ausnahme meckert der Validator
  const ohne = kopie();
  ohne.tiere = ohne.tiere.filter((t) => !t.ausnahme);
  assert.ok(pruefeDaten(ohne).some((f) => /keine einzige Ausnahme/.test(f)));
  // Der Grund für die Ausnahme steht in den DATEN, nicht im Code – sonst
  // müsste die App ihn raten, sobald eine zweite Ausnahme dazukommt.
  for (const a of ausnahmen) {
    assert.ok(a.ausnahmeGrund && a.ausnahmeGrund.length >= 30, `${a.id}: kein ausnahmeGrund`);
  }
  const ohneGrund = kopie();
  delete ohneGrund.tiere.find((t) => t.ausnahme).ausnahmeGrund;
  assert.ok(pruefeDaten(ohneGrund).some((f) => /braucht einen eigenen ausnahmeGrund/.test(f)));
  const grundlos = kopie();
  grundlos.tiere.find((t) => t.id === 'hase').ausnahmeGrund = 'Steht hier zu Unrecht, ganz ohne Ausnahme.';
  assert.ok(pruefeDaten(grundlos).some((f) => /ausnahmeGrund ohne Ausnahme/.test(f)));
});

test('jede Regel wird von mindestens einem Tier gezeigt', () => {
  for (const r of daten.regeln) {
    assert.ok(
      daten.tiere.some((t) => t.koerperbau === r.id && !t.ausnahme),
      `Regel ${r.id}: kein Tier, das sie zeigt`,
    );
  }
  const leer = kopie();
  leer.tiere = leer.tiere.filter((t) => t.koerperbau !== 'gleich');
  assert.ok(pruefeDaten(leer).some((f) => /Regel gleich: kein Tier/.test(f)));
});

test('Sitzungsgrenze: höchstens fünf Tiere, ohne Dubletten, mit Rotation', () => {
  assert.ok(PRO_SESSION <= 6, 'für 3-5 muss die Sitzung kurz bleiben');
  const gesehen = new Set();
  for (let i = 0; i < 60; i++) {
    const runde = waehleTiere(daten.tiere);
    assert.equal(runde.length, PRO_SESSION);
    assert.equal(new Set(runde.map((t) => t.id)).size, PRO_SESSION, 'Tier doppelt in einer Sitzung');
    for (const t of runde) gesehen.add(t.id);
  }
  assert.ok(gesehen.size > PRO_SESSION, 'keine Rotation über mehrere Sitzungen');
});

test('die Auswahl verrät nichts: immer alle Bewegungsarten', () => {
  for (const t of daten.tiere) {
    const a = baueAufgabe(daten, t, ohneMischen);
    assert.equal(a.optionen.length, daten.bewegungen.length);
    assert.deepEqual(a.optionen.map((o) => o.id).sort(), daten.bewegungen.map((b) => b.id).sort());
    assert.equal(a.loesung.id, t.bewegung);
    assert.ok(a.regel, `${t.id}: keine Regel zugeordnet`);
    assert.equal(istRichtig(a, t.bewegung), true);
    assert.equal(istRichtig(a, 'quatsch'), false);
  }
  assert.equal(regelFuer(daten, 'quatsch'), null);
  assert.equal(bewegungVon(daten, 'quatsch'), null);
});

test('Blindschleiche: keine Schlange, sondern eine Echse ohne Beine', () => {
  const b = tier('blindschleiche');
  assert.equal(b.koerperbau, 'keine');
  assert.equal(b.bewegung, 'kriechen');
  assert.match(b.erklaerung, /Echse/);
  assert.match(b.erklaerung, /blind ist sie auch nicht/);
});

test('Pflanzen bewegen sich auch – mit einem Versuch zum Selbermachen', () => {
  assert.ok(daten.pflanzen.length >= 3);
  for (const p of daten.pflanzen) {
    assert.ok(p.bewegung.length >= 60, `${p.id}: Bewegungstext zu knapp`);
    assert.ok(p.versuch.length >= 50, `${p.id}: Versuch zu knapp`);
  }
  // Die Sonnenblume ist korrekt beschrieben: nur die JUNGE Knospe dreht mit
  const sonne = daten.pflanzen.find((p) => p.id === 'sonnenblume');
  assert.match(sonne.bewegung, /jung/);
  assert.match(sonne.bewegung, /Osten/);
  assert.match(sonne.bewegung, /bleibt sie nach Osten stehen|fertig aufgeblüht/);
});

test('Ton: kein Tadel, jede Frage an die Erwachsenen, Schluss offline', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['falsch', 'leider', 'dumm', 'blöd', 'punkte', 'gewonnen', 'verloren', 'ekelig']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort im Datensatz: ${wort}`);
  }
  for (const t of daten.tiere) {
    assert.ok(t.gespraech.trim().endsWith('?'), `${t.id}: Impuls ist keine Frage`);
    assert.ok(t.erklaerung.length >= 60, `${t.id}: Erklärung zu knapp`);
  }
  assert.ok(daten.schlussIdeen.length >= 3);
  for (const i of daten.schlussIdeen) assert.ok(i.length >= 40, `Schlussidee zu knapp: ${i}`);
});
