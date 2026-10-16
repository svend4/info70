import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as logik from '../logik.mjs';
import {
  ALTER_SCHLUESSEL, BEREICHE, tagesSchluessel, tagesLabel, zaehleBereich, bilanzText,
} from '../logik.mjs';

test('Handlungen: drei Bereiche mit je zwei eigenen Handlungen, Kennungen eindeutig', () => {
  assert.equal(BEREICHE.length, 3);
  for (const b of BEREICHE) assert.equal(b.handlungen.length, 2, b.name);
  const ids = BEREICHE.flatMap((b) => b.handlungen.map((h) => h.id));
  assert.equal(ids.length, 6);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Kennung');
});

test('Die vier festen Vorschläge sind enthalten', () => {
  const namen = BEREICHE.flatMap((b) => b.handlungen.map((h) => h.name));
  for (const pflicht of ['Einzelzeit angeboten', 'Beschwerdeweg erklärt', 'Teamgespräch geführt', 'Elterngespräch angeboten']) {
    assert.ok(namen.includes(pflicht), `fehlt: ${pflicht}`);
  }
});

test('Die Frage am Knopf enthält den Namen der Handlung wörtlich', () => {
  for (const b of BEREICHE) {
    for (const h of b.handlungen) {
      assert.ok(h.frage.includes(h.name), `„${h.frage}“ enthält nicht „${h.name}“`);
    }
  }
});

test('ALTER_SCHLUESSEL ist der Schlüssel der früheren Fassung', () => {
  assert.equal(ALTER_SCHLUESSEL, 'wa.daten');
});

test('Keine Gesamtzahl und keine Bewertung in der Schnittstelle', () => {
  // Nur Zählung je Bereich. Exportnamen mit Summe, Punkt, Score, Ranking,
  // Ampel, Kontext, Woche, Serie, Kürzel oder Kind wären ein Verstoß.
  const verboten = /summe|gesamt|punkt|score|prozent|rang|ampel|kontext|woche|serie|kuerzel|kind/i;
  for (const name of Object.keys(logik)) {
    assert.ok(!verboten.test(name), `verbotener Exportname: ${name}`);
  }
});

test('tagesSchluessel: lokales Datum als JJJJ-MM-TT', () => {
  assert.equal(tagesSchluessel(new Date(2026, 6, 12)), '2026-07-12');
  assert.equal(tagesSchluessel(new Date(2026, 0, 3)), '2026-01-03');
});

test('tagesLabel: Wochentag, Tag, Monat und Jahr ausgeschrieben', () => {
  assert.equal(tagesLabel('2026-10-16'), 'Freitag, 16. Oktober 2026');
  assert.equal(tagesLabel('2026-01-01'), 'Donnerstag, 1. Januar 2026');
  assert.equal(tagesLabel('2026-03-01'), 'Sonntag, 1. März 2026');
});

test('zaehleBereich: zählt nur eigene, bekannte Handlungen des Bereichs', () => {
  const zeit = BEREICHE[0];
  assert.deepEqual(zaehleBereich(zeit, new Set()), { erledigt: 0, gesamt: 2 });
  assert.deepEqual(zaehleBereich(zeit, new Set([zeit.handlungen[0].id])), { erledigt: 1, gesamt: 2 });
  assert.deepEqual(zaehleBereich(zeit, new Set(['gibt-es-nicht'])), { erledigt: 0, gesamt: 2 }, 'unbekannte Kennungen zählen nicht');
  assert.deepEqual(zaehleBereich(zeit, new Set([BEREICHE[1].handlungen[0].id])), { erledigt: 0, gesamt: 2 }, 'andere Bereiche zählen nicht mit');
});

test('bilanzText: „erledigt: X von Y“ je Bereich', () => {
  const team = BEREICHE[2];
  assert.equal(bilanzText(team, new Set()), 'erledigt: 0 von 2');
  assert.equal(bilanzText(team, new Set([team.handlungen[0].id])), 'erledigt: 1 von 2');
  assert.equal(bilanzText(team, new Set(team.handlungen.map((h) => h.id))), 'erledigt: 2 von 2');
});
