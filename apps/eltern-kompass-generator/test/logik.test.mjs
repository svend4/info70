import { test } from 'node:test';
import assert from 'node:assert/strict';
import { baueSektionen, baueSeite, escapeHtml } from '../logik.mjs';

const voll = {
  appName: 'Rechte-Kompass', altersgruppe: '8–12 Jahre',
  worum: 'Kinder üben, ihr Recht auszusprechen.',
  lernziele: ['Rechte kennen', 'Mut-Sätze üben'],
  daten: ['nur Ihre Eingaben im Formular, nur auf diesem Gerät, löschbar per Knopf'],
  interaktion: 'Keine Interaktion mit Fremden.', kostenfrei: true,
  hinweise: 'Klassen-Modus für den Unterricht.',
};

test('baueSektionen: alle Angaben erscheinen', () => {
  const html = baueSektionen(voll);
  assert.match(html, /Eltern-Kompass: Rechte-Kompass/);
  assert.match(html, /8–12 Jahre/);
  assert.match(html, /Recht auszusprechen/);
  assert.match(html, /<li>Rechte kennen<\/li>/);
  assert.match(html, /Eingaben im Formular, nur auf diesem Gerät, löschbar/);
  assert.match(html, /Klassen-Modus/);
  assert.match(html, /116 111/, 'Hilfenummer immer dabei');
});

test('baueSektionen: Pflicht-Struktur (Worum, Daten, gut zu wissen)', () => {
  const html = baueSektionen({});
  for (const ueberschrift of ['Worum geht es', 'Was Ihr Kind lernt', 'Welche Daten', 'Gut zu wissen']) {
    assert.ok(html.includes(ueberschrift), `Abschnitt fehlt: ${ueberschrift}`);
  }
  assert.match(html, /keine personenbezogenen Daten/, 'Daten-Default datensparsam');
  assert.match(html, /\[Name des Angebots\]/, 'Platzhalter bei leerem Namen');
});

test('kostenfrei-Schalter wirkt', () => {
  assert.match(baueSektionen({ kostenfrei: true }), /Kostenfrei nutzbar/);
  assert.match(baueSektionen({ kostenfrei: false }), /Angaben des Anbieters/);
});

test('baueSeite: vollständiges Dokument mit head/körper/footer', () => {
  const doc = baueSeite(voll);
  assert.match(doc, /^<!DOCTYPE html>/);
  assert.match(doc, /<html lang="de">/);
  assert.match(doc, /Content-Security-Policy/, 'CSP self');
  assert.match(doc, /<title>Für Eltern – Rechte-Kompass<\/title>/);
  assert.match(doc, /kinder-ui\/css\/kinder\.css/, 'Stylesheet lokal');
  assert.match(doc, /Impressum & Datenschutz|Impressum &amp; Datenschutz/);
  assert.match(doc, /<\/html>\s*$/);
});

test('Sicherheit: Nutzereingaben werden escaped, kein Script/kein externer Host', () => {
  const boese = baueSeite({ appName: '<script>alert(1)</script>', worum: 'a & b <c>', lernziele: ['<img onerror=x>'] });
  assert.ok(!/<script>alert/.test(boese), 'Script-Eingabe neutralisiert');
  assert.ok(boese.includes('&lt;script&gt;'), 'Winkelklammern escaped');
  assert.ok(!/<img onerror/.test(boese), 'kein aktives img');
  // einziger erlaubter Verweis ist die lokale, gleichnamige Stylesheet-/Impressum-Referenz
  assert.ok(!/https?:\/\//.test(boese), 'kein externer Host');
});

test('escapeHtml deckt die vier kritischen Zeichen ab', () => {
  assert.equal(escapeHtml('<a b="c" & d>'), '&lt;a b=&quot;c&quot; &amp; d&gt;');
});
