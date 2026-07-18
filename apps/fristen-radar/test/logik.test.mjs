import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { mitTermin, sortiereNachFrist, tageBis, icsDatum, icsEscape, baueICS } from '../logik.mjs';

// echte Programmdaten des Förder-Navigators (gemeinsame Quelle)
const daten = JSON.parse(await readFile(new URL('../../foerder-navigator/daten/programme.json', import.meta.url), 'utf8'));

test('mitTermin: nur Programme mit fristStatus "termin" und ISO-Datum', () => {
  const mt = mitTermin(daten.programme);
  assert.ok(mt.length >= 1, 'mindestens ein Termin in den echten Daten');
  for (const p of mt) {
    assert.equal(p.fristStatus, 'termin');
    assert.match(p.naechsteFrist, /^\d{4}-\d{2}-\d{2}$/);
  }
});

test('sortiereNachFrist: aufsteigend nach Datum', () => {
  const s = sortiereNachFrist(daten.programme);
  for (let i = 1; i < s.length; i++) {
    assert.ok(s[i - 1].naechsteFrist <= s[i].naechsteFrist, 'frühester Termin zuerst');
  }
});

test('tageBis: ganze Tage, negativ wenn vorbei', () => {
  assert.equal(tageBis('2026-07-20', '2026-07-18'), 2);
  assert.equal(tageBis('2026-07-18', '2026-07-18'), 0);
  assert.equal(tageBis('2026-07-10', '2026-07-18'), -8);
});

test('icsDatum und icsEscape', () => {
  assert.equal(icsDatum('2026-09-11'), '20260911');
  assert.equal(icsEscape('a, b; c\\d\ne'), 'a\\, b\\; c\\\\d\\ne');
});

test('baueICS: gültige VCALENDAR-Struktur mit VEVENT je Termin', () => {
  const ics = baueICS(daten.programme, { dtstamp: '20260718T000000Z' });
  assert.match(ics, /^BEGIN:VCALENDAR\r\n/);
  assert.match(ics, /VERSION:2\.0/);
  assert.match(ics, /END:VCALENDAR\r\n$/);
  const eventCount = (ics.match(/BEGIN:VEVENT/g) || []).length;
  assert.equal(eventCount, mitTermin(daten.programme).length, 'ein VEVENT je Termin-Programm');
  assert.ok(/BEGIN:VEVENT/.test(ics) && /END:VEVENT/.test(ics));
  assert.match(ics, /DTSTART;VALUE=DATE:\d{8}/);
  assert.match(ics, /SUMMARY:Frist: /);
  assert.match(ics, /DTSTAMP:20260718T000000Z/);
  // CRLF-Zeilenenden (RFC 5545)
  assert.ok(ics.includes('\r\n'), 'CRLF-Zeilenenden');
});

test('baueICS: Termine sind im Kalender chronologisch', () => {
  const ics = baueICS(daten.programme, { dtstamp: '20260718T000000Z' });
  const daten8 = [...ics.matchAll(/DTSTART;VALUE=DATE:(\d{8})/g)].map((m) => m[1]);
  const sortiert = [...daten8].sort();
  assert.deepEqual(daten8, sortiert, 'DTSTART-Werte aufsteigend');
});
