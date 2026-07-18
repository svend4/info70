import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  STUFEN, empfohleneStufe, technischeMittel, stufeLabel, ageDeXml, metaTag, bericht,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/einstufung.json', import.meta.url), 'utf8'));

test('Katalog: Stufen, Merkmale mit minStufe, Interaktionsrisiken', () => {
  assert.match(daten.quelle, /JMStV/);
  assert.deepEqual(daten.altersstufen.map((a) => a.stufe), STUFEN);
  assert.ok(daten.merkmale.length >= 5);
  for (const m of daten.merkmale) {
    assert.ok(STUFEN.includes(m.minStufe), `${m.id}: minStufe gültig`);
    assert.ok(m.text.length >= 20 && m.hilfe.length >= 20);
  }
  assert.ok(daten.interaktion.length >= 3);
});

test('empfohleneStufe: null ohne Auswahl, sonst Maximum', () => {
  assert.equal(empfohleneStufe(daten, [], []), null);
  assert.equal(empfohleneStufe(daten, ['m-harmlos'], []), 0);
  assert.equal(empfohleneStufe(daten, ['m-harmlos', 'm-angst'], []), 12);
  assert.equal(empfohleneStufe(daten, ['m-jugendgef'], []), 18);
});

test('empfohleneStufe: Chat-Interaktion hebt auf mind. 12', () => {
  assert.equal(empfohleneStufe(daten, ['m-harmlos'], ['i-chat']), 12);
  // Kauf-Interaktion hebt nicht an (hebtAuf 0), zählt aber als Auswahl
  assert.equal(empfohleneStufe(daten, [], ['i-kauf']), 0);
});

test('technischeMittel: gestuft, mit Interaktions-Mitteln', () => {
  const m0 = technischeMittel(daten, 0, []);
  assert.ok(m0.some((t) => /Keine Alterskennzeichnung zwingend/.test(t)));
  const m12 = technischeMittel(daten, 12, []);
  assert.ok(m12.some((t) => /age-de\.xml/.test(t)));
  const m16 = technischeMittel(daten, 16, []);
  assert.ok(m16.length > m12.length, '16 verlangt mehr als 12');
  const mChat = technischeMittel(daten, 12, ['i-chat']);
  assert.ok(mChat.some((t) => /moderation|Meldeweg/i.test(t)));
});

test('stufeLabel', () => {
  assert.match(stufeLabel(daten, 12), /ab 12/);
  assert.match(stufeLabel(daten, 0), /ohne Altersbeschränkung/);
});

test('ageDeXml: wohlgeformt, enthält minimum-age und URL', () => {
  const xml = ageDeXml(12, 'https://kinderseite.de');
  assert.match(xml, /^<\?xml version="1\.0" encoding="UTF-8"\?>/);
  assert.match(xml, /<minimum-age>12<\/minimum-age>/);
  assert.match(xml, /<url>https:\/\/kinderseite\.de<\/url>/);
  assert.match(xml, /age-declaration>[\s]*$/);
  // Fallback-URL
  assert.match(ageDeXml(6, '   '), /example\.org/);
});

test('metaTag', () => {
  assert.equal(metaTag(16), '<meta name="age-de.xml" content="age=16" />');
});

test('bericht: Stufe, Merkmale, Mittel, Label und Warnung bei 18', () => {
  const b = bericht(daten, ['m-angst'], ['i-chat'], 'https://kinderseite.de');
  assert.match(b, /Empfohlene Altersstufe/);
  assert.match(b, /Technische Mittel/);
  assert.match(b, /<minimum-age>12<\/minimum-age>/);
  assert.match(b, /kein offizielles Konformitätsergebnis/);

  const leer = bericht(daten, [], []);
  assert.match(leer, /Noch keine Merkmale/);

  const b18 = bericht(daten, ['m-jugendgef'], []);
  assert.match(b18, /Stufe 18/);
  assert.match(b18, /unzulässig/);
});
