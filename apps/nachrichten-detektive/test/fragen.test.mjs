import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/fragen.json', import.meta.url), 'utf8'));

test('Fragenbank: Grundstruktur', () => {
  assert.equal(daten.version, 1);
  assert.ok(Array.isArray(daten.fragen) && daten.fragen.length >= 10, 'mindestens 10 Fragen');
  assert.ok(Array.isArray(daten.raenge) && daten.raenge.length >= 3, 'mindestens 3 Ränge');
  assert.equal(daten.raenge[0].ab, 0, 'erster Rang beginnt bei 0 Punkten');
});

test('Fragenbank: IDs eindeutig', () => {
  const ids = daten.fragen.map((f) => f.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('Fragenbank: jede Frage ist vollständig und korrekt typisiert', () => {
  for (const f of daten.fragen) {
    assert.ok(f.id && f.kategorie, `id/kategorie fehlt: ${JSON.stringify(f)}`);
    assert.ok(f.erklaerung?.length >= 20, `${f.id}: Erklärung fehlt oder zu kurz (dort passiert das Lernen!)`);
    if (f.typ === 'echt-fake') {
      assert.ok(f.meldung?.length > 10, `${f.id}: Meldung fehlt`);
      assert.ok(['echt', 'fake'].includes(f.korrekt), `${f.id}: korrekt muss "echt" oder "fake" sein`);
    } else if (f.typ === 'wahl') {
      assert.ok(f.frage?.length > 10, `${f.id}: Frage fehlt`);
      assert.ok(Array.isArray(f.antworten) && f.antworten.length >= 2, `${f.id}: mindestens 2 Antworten`);
      assert.ok(Number.isInteger(f.korrekt) && f.korrekt >= 0 && f.korrekt < f.antworten.length, `${f.id}: korrekt-Index außerhalb`);
      assert.equal(new Set(f.antworten).size, f.antworten.length, `${f.id}: doppelte Antworten`);
    } else {
      assert.fail(`${f.id}: unbekannter Typ ${f.typ}`);
    }
  }
});

test('Fragenbank: beide Fragetypen und beide echt/fake-Antworten kommen vor', () => {
  const typen = new Set(daten.fragen.map((f) => f.typ));
  assert.ok(typen.has('echt-fake') && typen.has('wahl'));
  const efAntworten = new Set(daten.fragen.filter((f) => f.typ === 'echt-fake').map((f) => f.korrekt));
  assert.ok(efAntworten.has('echt') && efAntworten.has('fake'), 'sonst lernt das Kind ein Muster statt Prüfen');
});
