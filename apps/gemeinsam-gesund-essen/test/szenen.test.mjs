import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PRO_SESSION, waehleSzenen } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/szenen.json', import.meta.url), 'utf8'));

// Alle angezeigten/vorlesbaren Texte einer Szene.
function texte(s) {
  return [s.frage, s.gespraech, ...s.optionen.map((o) => o.text)];
}

// Zerlegt einen Text an Satzenden (. ! ?) in einzelne Sätze.
function saetze(text) {
  return String(text).split(/[.!?]+/).map((t) => t.trim()).filter(Boolean);
}

test('Grundstruktur: Version, Zielgruppe 3-5, 8-10 Szenen, eindeutige IDs', () => {
  assert.equal(daten.version, 1);
  assert.equal(daten.zielgruppe, '3-5');
  assert.ok(daten.szenen.length >= 8 && daten.szenen.length <= 10, '8 bis 10 Szenen (Rotation)');
  const ids = daten.szenen.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'IDs müssen eindeutig sein');
});

test('Session-Limit ist eine harte Konstante <= 6, und die Bank reicht dafür', () => {
  assert.equal(typeof PRO_SESSION, 'number');
  assert.ok(PRO_SESSION >= 1 && PRO_SESSION <= 6, 'höchstens 6 Bild-Entscheidungen pro Sitzung');
  assert.ok(daten.szenen.length >= PRO_SESSION, 'Bank muss mindestens PRO_SESSION Szenen haben');
});

test('waehleSzenen: liefert genau PRO_SESSION Szenen, ohne Dubletten, nur aus der Bank', () => {
  const bankIds = new Set(daten.szenen.map((s) => s.id));
  const auswahl = waehleSzenen(daten.szenen);
  assert.equal(auswahl.length, Math.min(PRO_SESSION, daten.szenen.length));
  const auswahlIds = auswahl.map((s) => s.id);
  assert.equal(new Set(auswahlIds).size, auswahlIds.length, 'keine Szene doppelt in einer Sitzung');
  for (const s of auswahl) assert.ok(bankIds.has(s.id), 'nur Szenen aus der Bank');
  assert.equal(daten.szenen.length, bankIds.size, 'die Bank wird nicht verändert');
});

test('jede Szene: Frage, genau 2 Emoji-Optionen, Gesprächsimpuls für Erwachsene', () => {
  for (const s of daten.szenen) {
    assert.ok(s.id?.length >= 1, 'id fehlt');
    assert.ok(s.frage?.length >= 5, `${s.id}: Frage fehlt/zu kurz`);
    assert.ok(s.gespraech?.length >= 10, `${s.id}: Gesprächsimpuls fehlt`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 2, `${s.id}: genau 2 Bild-Optionen`);
    for (const o of s.optionen) {
      assert.ok(o.emoji?.length >= 1, `${s.id}: großes Emoji fehlt`);
      assert.ok(o.text?.length >= 3, `${s.id}: Optionstext fehlt`);
    }
  }
});

test('kein Ranking / keine Wertung: Optionen tragen KEINEN Punktwert (AI Act)', () => {
  for (const s of daten.szenen) {
    for (const o of s.optionen) {
      assert.equal(o.wert, undefined, `${s.id}: Optionen dürfen keinen "wert" haben - kein richtig/falsch`);
      assert.equal(o.punkte, undefined, `${s.id}: Optionen dürfen keine "punkte" haben`);
      assert.equal(o.richtig, undefined, `${s.id}: Optionen dürfen kein "richtig" haben`);
    }
  }
});

test('Ende-Bildschirm: genau 3 Offline-Küchen-Ideen', () => {
  assert.ok(Array.isArray(daten.kuecheIdeen), 'kuecheIdeen fehlt');
  assert.equal(daten.kuecheIdeen.length, 3, 'genau 3 Offline-Ideen für "ab in die Küche"');
  for (const i of daten.kuecheIdeen) assert.ok(i?.length >= 10, 'Idee fehlt/zu kurz');
});

test('sehr einfache Sprache: kein Satz länger als 80 Zeichen', () => {
  const alleTexte = [...daten.kuecheIdeen];
  for (const s of daten.szenen) alleTexte.push(...texte(s));
  for (const text of alleTexte) {
    for (const satz of saetze(text)) {
      assert.ok(satz.length <= 80, `Satz zu lang (${satz.length} Zeichen): "${satz}"`);
    }
  }
});

test('keine echten Namen (Datenschutz/Politik): Kinder bleiben anonym', () => {
  const alles = JSON.stringify(daten);
  // Ganze Wörter prüfen: "Tom" darf nicht in "Tomate" falsch anschlagen.
  for (const name of ['Mia', 'Ben', 'Lena', 'Tim', 'Tom', 'Lisa', 'Max', 'Anna', 'Emma']) {
    assert.ok(!new RegExp(`\\b${name}\\b`).test(alles), `Eigenname "${name}" gefunden - Kinder bleiben anonym`);
  }
});
