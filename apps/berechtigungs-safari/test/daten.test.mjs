import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/berechtigungen.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Stationen: die wichtigen Berechtigungen, eindeutige Codes', () => {
  assert.ok(daten.stationen.length >= 5);
  const codes = daten.stationen.map((s) => s.code);
  assert.equal(new Set(codes).size, codes.length, 'doppelte Codes');
  for (const pflicht of ['mikrofon', 'standort', 'kontakte']) {
    assert.ok(codes.includes(pflicht), `Pflicht-Berechtigung fehlt: ${pflicht}`);
  }
});

test('jede Station: erklärt, gibt sinnvolle UND verdächtige Beispiele, stellt eine Frage', () => {
  for (const s of daten.stationen) {
    assert.ok(s.emoji && s.name, `${s.code}: Name/Emoji fehlt`);
    assert.ok(s.was?.length >= 15, `${s.code}: "Was heißt das" fehlt`);
    assert.match(s.brauchtWer ?? '', /[Ss]innvoll/, `${s.code}: sinnvolle Nutzung fehlt`);
    assert.match(s.verdaechtig ?? '', /[Vv]erdächtig|zu oft/, `${s.code}: verdächtige Nutzung fehlt`);
    assert.ok(s.frage?.length >= 15, `${s.code}: Detektiv-Frage fehlt`);
  }
});

test('Anleitungs-Charakter: Finde-Hinweis (Android/iPhone) und Abschluss (ausschalten)', () => {
  assert.match(daten.findenHinweis, /Android/, 'Android-Weg');
  assert.match(daten.findenHinweis, /iPhone|iPad/, 'iOS-Weg');
  assert.match(daten.abschluss, /ausschalten|aus/, 'zum Ausschalten anleiten');
});

test('Politik-Wächter: App liest NICHTS vom Gerät aus (reine Anleitung)', () => {
  assert.match(daten.hinweis, /liest NICHTS|liest nichts/i, 'Zusage im Datensatz');
  // Keine Geräte-Ausleseversuche im Code
  assert.ok(!/navigator\.permissions|getUserMedia|geolocation|navigator\.contacts/.test(appQuelle),
    'App darf keine echten Berechtigungen abfragen/auslesen');
});
