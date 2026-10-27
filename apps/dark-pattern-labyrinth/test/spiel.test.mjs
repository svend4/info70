import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as spiel from '../spiel.mjs';
import { neuesSpiel, waehle, istVorbei, ehrlicheOption, lexikon } from '../spiel.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/stationen.json', import.meta.url), 'utf8'));

test('waehle: jede Wahl führt zur nächsten Station, es wird nichts gezählt; Stand ist unveränderlich', () => {
  const start = neuesSpiel(7);
  assert.deepEqual(start, { index: 0, anzahl: 7 }, 'der Stand kennt nur Station und Anzahl, keine Punkte');
  const nachWahl = waehle(start);
  assert.deepEqual(nachWahl, { index: 1, anzahl: 7 });
  const nachZweiter = waehle(nachWahl, true);
  assert.deepEqual(nachZweiter, { index: 2, anzahl: 7 }, 'Falle oder ehrlicher Ausweg: derselbe Schritt');
  assert.deepEqual(start, neuesSpiel(7), 'waehle darf den alten Stand nicht verändern');
});

test('kompletter Lauf: nach 7 Entscheidungen vorbei, gleich wie gewählt wurde', () => {
  let stand = neuesSpiel(daten.stationen.length);
  for (const s of daten.stationen) {
    assert.ok(!istVorbei(stand), `${s.id}: Lauf darf noch nicht vorbei sein`);
    stand = waehle(stand);
  }
  assert.ok(istVorbei(stand));
  assert.equal(stand.index, daten.stationen.length);
  assert.equal(Object.keys(stand).sort().join(), 'anzahl,index', 'am Ende steht keine Wertung im Stand');
  assert.equal(waehle(stand).index, stand.index, 'nach dem Ende ändert waehle nichts mehr');
});

test('ehrlicheOption liefert für jede Station genau die Nicht-Falle', () => {
  for (const s of daten.stationen) {
    const o = ehrlicheOption(s);
    assert.ok(o, `${s.id}: ehrliche Option fehlt`);
    assert.equal(o.istFalle, false, s.id);
  }
});

test('Abwesenheit: die Spiel-Logik kennt keinen Rang, und die Daten haben keine Ränge', () => {
  assert.equal(spiel.rang, undefined, 'spiel.mjs führt keine Rang-Funktion mehr');
  assert.ok(!('raenge' in daten), 'die Daten haben keine Rang- oder Punkteschwellen');
});

test('lexikon: alle 7 Muster mit Name und Erklärung für den Abschluss-Bildschirm', () => {
  const eintraege = lexikon(daten.stationen);
  assert.equal(eintraege.length, daten.stationen.length);
  for (const e of eintraege) {
    assert.ok(e.name.length >= 5 && e.erklaerung.length >= 40);
  }
});
