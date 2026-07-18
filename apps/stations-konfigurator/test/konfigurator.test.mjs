import { test } from 'node:test';
import assert from 'node:assert/strict';
import { baueStation, pruefeStation, stationsLink, kodiere, dekodiere, konfigLink, ausHash, gesamtdauer, baueLaufzettel } from '../konfigurator.mjs';

test('baueStation: normalisiert Felder, Minuten nie negativ', () => {
  const st = baueStation({ name: '  Detektiv-Ecke ', app: 'nachrichten-detektive', modul: 'werbung', aufgabe: '3 Meldungen prüfen', minuten: -5 });
  assert.equal(st.name, 'Detektiv-Ecke');
  assert.equal(st.app, 'nachrichten-detektive');
  assert.equal(st.minuten, 0);
  const leer = baueStation();
  assert.deepEqual(leer, { name: '', app: '', modul: '', aufgabe: '', minuten: 0 });
});

test('pruefeStation: Name und App sind Pflicht', () => {
  assert.deepEqual(pruefeStation(baueStation({ name: 'A', app: 'x' })), []);
  const fehler = pruefeStation(baueStation({}));
  assert.ok(fehler.some((f) => /Name/.test(f)));
  assert.ok(fehler.some((f) => /App/.test(f)));
});

test('stationsLink: pinnt App auf Modul und sperrt Navigation', () => {
  const link = stationsLink(baueStation({ name: 'Ecke 1', app: 'daten-schatz', modul: 'account' }), '../..');
  assert.match(link, /\/apps\/daten-schatz\/#/);
  assert.match(link, /modul=account/);
  assert.match(link, /gesperrt=1/);
  assert.match(link, /station=Ecke\+1/);
});

test('kodiere/dekodiere: Round-Trip auch mit Umlauten/Emoji', () => {
  const obj = { v: 1, stationen: [{ name: 'Prüf-Straße 🌟', aufgabe: 'Über Fälschungen sprechen' }] };
  const roh = kodiere(obj);
  assert.equal(typeof roh, 'string');
  assert.deepEqual(dekodiere(roh), obj);
});

test('konfigLink + ausHash: Round-Trip der ganzen Stationsliste', () => {
  const stationen = [
    baueStation({ name: 'Station 1', app: 'feed-forscher', modul: 'blase', aufgabe: 'Feed kippen lassen', minuten: 15 }),
    baueStation({ name: 'Station 2', app: 'lootbox-labor', aufgabe: 'Wahrscheinlichkeiten notieren', minuten: 20 }),
  ];
  const link = konfigLink(stationen, 'http://localhost:8070/apps/stations-konfigurator/');
  assert.match(link, /#konfig=/);
  const zurueck = ausHash('#' + link.split('#')[1]);
  assert.equal(zurueck.length, 2);
  assert.equal(zurueck[0].name, 'Station 1');
  assert.equal(zurueck[0].app, 'feed-forscher');
  assert.equal(zurueck[1].minuten, 20);
});

test('ausHash: leerer oder kaputter Hash -> leere Liste', () => {
  assert.deepEqual(ausHash(''), []);
  assert.deepEqual(ausHash('#foo=bar'), []);
  assert.deepEqual(ausHash('#konfig=nichtbase64!!!'), []);
});

test('gesamtdauer + baueLaufzettel', () => {
  const stationen = [
    baueStation({ name: 'A', app: 'x', aufgabe: 'Tu dies', minuten: 15 }),
    baueStation({ name: 'B', app: 'y', minuten: 10 }),
  ];
  assert.equal(gesamtdauer(stationen), 25);
  const zettel = baueLaufzettel(stationen);
  assert.match(zettel, /Station 1: A \(15 min\)/);
  assert.match(zettel, /Aufgabe: Tu dies/);
  assert.match(zettel, /Gesamt: 2 Stationen · 25 min/);
});
