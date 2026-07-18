import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/vorlagen.json', import.meta.url), 'utf8'));

test('Typen: die drei Anzeigenformen, eindeutige Codes, Rechtsbezug', () => {
  assert.ok(daten.typen.length >= 3);
  const codes = daten.typen.map((t) => t.code);
  assert.equal(new Set(codes).size, codes.length, 'eindeutige Codes');
  assert.match(daten.quelle, /JMStV|MStV/, 'Rechtsgrundlage (Trennungsgebot)');
  for (const c of ['banner', 'beitrag', 'kooperation']) {
    assert.ok(codes.includes(c), `Typ fehlt: ${c}`);
  }
});

test('jeder Typ: Beschreibung, Regeln, richtige Vorlage, Negativ-Beispiele', () => {
  for (const t of daten.typen) {
    assert.ok(t.name && t.beschreibung?.length >= 20, `${t.code}: Name/Beschreibung fehlt`);
    assert.ok(Array.isArray(t.regeln) && t.regeln.length >= 2, `${t.code}: zu wenige Regeln`);
    assert.ok(t.richtigHtml?.length >= 30, `${t.code}: richtige Vorlage fehlt`);
    assert.ok(Array.isArray(t.negativ) && t.negativ.length >= 2, `${t.code}: Negativ-Beispiele fehlen`);
    for (const n of t.negativ) assert.ok(n.beispiel && n.warum?.length >= 30, `${t.code}: Negativ-Beispiel unvollständig`);
  }
});

test('die korrekten Vorlagen enthalten ein deutliches Werbe-Label', () => {
  for (const t of daten.typen) {
    assert.match(t.richtigHtml, /Anzeige|Werbung/, `${t.code}: Vorlage ohne klares Label`);
  }
});

test('Sicherheit: die Vorlagen enthalten kein Script und keine externen Verweise', () => {
  const alles = JSON.stringify(daten.typen);
  assert.ok(!/<script/i.test(alles), 'kein Script in den Vorlagen');
  assert.ok(!/https?:\/\/|src=|href=/i.test(alles), 'keine externen Ressourcen/Links in den Vorlagen');
});
