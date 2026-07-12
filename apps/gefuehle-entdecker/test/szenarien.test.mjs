import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));

// Sammelt alle vorlesbaren/angezeigten Texte einer Szene.
function texte(s) {
  return [s.situation, s.frage, s.lobRichtig, s.lobFalsch, s.tipp, ...s.optionen.map((o) => o.text)];
}

// Zerlegt einen Text an Satzenden (. ! ?) in einzelne Sätze.
function saetze(text) {
  return text.split(/[.!?]+/).map((t) => t.trim()).filter(Boolean);
}

test('Grundstruktur: Version, Zielgruppe, genau 8 Szenen, eindeutige IDs', () => {
  assert.equal(daten.version, 1);
  assert.equal(daten.zielgruppe, '5-7');
  assert.equal(daten.szenarien.length, 8, 'genau 8 Szenen für kurze Vorschul-Sessions');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'IDs müssen eindeutig sein');
});

test('jede Szene: Emoji, Situation, Frage, Feedback, Tipp vorhanden', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.emoji?.length >= 1, `${s.id}: großes Emoji fehlt`);
    assert.ok(s.situation?.length >= 10, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(s.frage?.length >= 3, `${s.id}: Frage fehlt`);
    assert.ok(s.lobRichtig?.length >= 10, `${s.id}: ermutigendes Lob fehlt`);
    assert.ok(s.lobFalsch?.length >= 10, `${s.id}: sanftes Feedback fehlt`);
    assert.ok(s.tipp?.length >= 10, `${s.id}: Tipp fehlt (dort passiert das Lernen)`);
  }
});

test('genau 2 Optionen pro Szene, davon genau eine mit Wert 2 und eine mit Wert 0', () => {
  for (const s of daten.szenarien) {
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 2, `${s.id}: genau 2 Optionen`);
    for (const o of s.optionen) {
      assert.ok(o.text?.length >= 5, `${s.id}: Optionstext fehlt/zu kurz`);
      assert.ok([0, 2].includes(o.wert), `${s.id}: Wert muss 0 oder 2 sein`);
    }
    const werte = s.optionen.map((o) => o.wert);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EINE 2er-Option`);
    assert.equal(werte.filter((w) => w === 0).length, 1, `${s.id}: genau EINE 0er-Option`);
  }
});

test('sehr einfache Sprache: kein Satz länger als 90 Zeichen', () => {
  for (const s of daten.szenarien) {
    for (const text of texte(s)) {
      for (const satz of saetze(text)) {
        assert.ok(satz.length <= 90, `${s.id}: Satz zu lang (${satz.length} Zeichen): "${satz}"`);
      }
    }
  }
});

test('keine echten Namen (Datenschutz/Politik): Kinder bleiben anonym', () => {
  // Keine Kinder-Eigennamen im Content - es wird nur von "einem Kind",
  // "deinem Freund", "deiner Freundin" gesprochen.
  const alles = JSON.stringify(daten.szenarien);
  for (const name of ['Mia', 'Ben', 'Lena', 'Tim', 'Tom', 'Lisa', 'Max']) {
    assert.ok(!alles.includes(name), `Eigenname "${name}" gefunden - Kinder bleiben anonym`);
  }
});
