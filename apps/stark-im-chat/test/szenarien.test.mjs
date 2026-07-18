import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));

test('Szenarienbank: Grundstruktur, IDs, erreichbare Ränge', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 10, 'mindestens 10 Szenarien');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal(daten.raenge[0].ab, 0);
  assert.ok(Math.max(...daten.raenge.map((r) => r.ab)) <= daten.szenarien.length * 2);
});

test('jedes Szenario: Situation, Erklärung, genau ein stärkster Zug (wert 2), eine Falle (wert 0)', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 20, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(s.erklaerung?.length >= 40, `${s.id}: Erklärung fehlt/zu kurz (dort passiert das Lernen!)`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    for (const o of s.optionen) {
      assert.ok(o.text?.length >= 5, `${s.id}: Optionstext fehlt`);
      assert.ok([0, 1, 2].includes(o.wert), `${s.id}: wert muss 0, 1 oder 2 sein`);
    }
    const werte = s.optionen.map((o) => o.wert);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN stärkster Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine Option, die es schlimmer macht`);
  }
});

test('Chat-Rechte-Pack (Katalog Nr. 138): Chat-Situationen als Rechtsfragen', () => {
  assert.ok(daten.szenarien.length >= 16, 'Rechte-Pack ergänzt (mindestens 16 Szenarien)');
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/Artikel 13|Meinungsfreiheit/.test(alles), 'Meinung sagen ist Art. 13 – beleidigen nicht');
  assert.ok(/DSA|digitale Dienste/.test(alles), 'Melden als Recht (DSA Art. 16/20)');
  assert.ok(/kein Petzen/.test(alles), 'Melden ist kein Petzen');
  assert.ok(/Artikel 12|gehört zu werden|gehört werden/.test(alles), 'Recht auf Gehört-werden (Art. 12)');
  assert.ok(/Hassrede/.test(alles), 'Hassrede als meldbarer Fall');
});

test('didaktische Schwerpunkte: Melden, Beweise sichern, Hilfe holen (116 111) kommen vor', () => {
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/melde/i.test(alles), 'Melde-Funktion muss vorkommen');
  assert.ok(/screenshot|beweis/i.test(alles), 'Beweise sichern muss vorkommen');
  assert.ok(alles.includes('116 111'), 'Nummer gegen Kummer muss vorkommen');
  assert.ok(/blockier/i.test(alles), 'Blockieren muss vorkommen');
});
