import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeKatalog, zaehleJeFeld, haeufigsteFelder, aendereMarkierung, gesamtZahl } from '../logik.mjs';

const katalog = JSON.parse(await readFile(new URL('../daten/beobachtungen.json', import.meta.url), 'utf8'));

test('Katalog-Schema: genau 4 Stärkenfelder à 8 Momente und je 5 Spiel-Impulse', () => {
  assert.deepEqual(pruefeKatalog(katalog), []);
  assert.equal(katalog.felder.length, 4, 'genau 4 Felder');
  for (const feld of katalog.felder) {
    assert.equal(feld.momente.length, 8, `${feld.id}: genau 8 beobachtbare Momente`);
    assert.equal(feld.impulse.length, 5, `${feld.id}: genau 5 Spiel-Impulse`);
    assert.ok(feld.name && feld.emoji && feld.beschreibung, `${feld.id}: Pflichtfeld fehlt`);
  }
  const momentIds = katalog.felder.flatMap((f) => f.momente.map((m) => m.id));
  assert.equal(new Set(momentIds).size, momentIds.length, 'Moment-Ids global eindeutig');
});

test('die vier Felder decken Denken/Kreativ/Sozial/Bewegung ab', () => {
  assert.deepEqual(katalog.felder.map((f) => f.id), ['denken', 'kreativ', 'sozial', 'bewegung']);
});

test('Spiel-Impulse sind bildschirmfrei formuliert (kein App/Video/Bildschirm & Co.)', () => {
  const verboten = [/\bapps?\b/i, /video/i, /bildschirm/i, /fernseh/i, /tablet/i, /handy/i, /smartphone/i, /konsole/i, /computer/i, /internet/i, /online/i];
  for (const feld of katalog.felder) {
    for (const impuls of feld.impulse) {
      for (const muster of verboten) {
        assert.ok(!muster.test(impuls), `${feld.id}: Impuls "${impuls}" enthält ${muster}`);
      }
    }
  }
});

test('Impulse und Momente sind neu formulierte, nicht-leere Texte', () => {
  for (const feld of katalog.felder) {
    for (const impuls of feld.impulse) assert.ok(impuls.trim().length >= 20, `${feld.id}: Impuls zu kurz`);
    for (const moment of feld.momente) assert.ok(moment.text.trim().length >= 10, `${feld.id}: Moment zu kurz`);
  }
});

test('pruefeKatalog erkennt kaputte Kataloge', () => {
  assert.ok(pruefeKatalog(null).length > 0);
  assert.ok(pruefeKatalog({}).length > 0);
  assert.ok(pruefeKatalog({ felder: [] }).some((f) => f.includes('4')));
  const zuWenigMomente = structuredClone(katalog);
  zuWenigMomente.felder[0].momente.pop();
  assert.ok(pruefeKatalog(zuWenigMomente).some((f) => f.includes('8 beobachtbare Momente')));
  const zuVieleImpulse = structuredClone(katalog);
  zuVieleImpulse.felder[2].impulse.push('Noch eine Idee für draußen und drinnen.');
  assert.ok(pruefeKatalog(zuVieleImpulse).some((f) => f.includes('5 Spiel-Impulse')));
  const doppelteId = structuredClone(katalog);
  doppelteId.felder[1].momente[0].id = doppelteId.felder[0].momente[0].id;
  assert.ok(pruefeKatalog(doppelteId).some((f) => f.includes('doppelt')));
});

test('zaehleJeFeld: zählt nur Häufigkeit je Feld, fehlende Momente zählen 0', () => {
  const leer = zaehleJeFeld(katalog.felder, {});
  assert.deepEqual(leer, { denken: 0, kreativ: 0, sozial: 0, bewegung: 0 });
  const markierungen = { 'denken-1': 2, 'denken-3': 1, 'sozial-1': 4 };
  const summen = zaehleJeFeld(katalog.felder, markierungen);
  assert.equal(summen.denken, 3);
  assert.equal(summen.sozial, 4);
  assert.equal(summen.kreativ, 0);
  assert.equal(summen.bewegung, 0);
});

test('haeufigsteFelder: höchstens 2, nur Felder mit Markierungen, Häufigkeit entscheidet', () => {
  assert.deepEqual(haeufigsteFelder(katalog.felder, {}), []);
  assert.deepEqual(haeufigsteFelder(katalog.felder, { 'kreativ-2': 1 }), ['kreativ'], 'nur ein Feld markiert -> nur ein Feld');
  const markierungen = { 'denken-1': 1, 'sozial-1': 3, 'sozial-2': 2, 'bewegung-5': 2 };
  assert.deepEqual(haeufigsteFelder(katalog.felder, markierungen), ['sozial', 'bewegung']);
});

test('haeufigsteFelder: bei Gleichstand entscheidet die Katalog-Reihenfolge (kein Ranking-Urteil)', () => {
  const gleichstand = { 'bewegung-1': 2, 'denken-1': 2, 'kreativ-1': 2 };
  assert.deepEqual(haeufigsteFelder(katalog.felder, gleichstand), ['denken', 'kreativ']);
});

test('aendereMarkierung: erhöht, senkt nicht unter 0, räumt Nulleinträge weg, Original bleibt', () => {
  const start = { 'denken-1': 1 };
  const plus = aendereMarkierung(start, 'denken-1', +1);
  assert.deepEqual(plus, { 'denken-1': 2 });
  assert.deepEqual(start, { 'denken-1': 1 }, 'Original unverändert');
  const neu = aendereMarkierung(start, 'sozial-1', +1);
  assert.deepEqual(neu, { 'denken-1': 1, 'sozial-1': 1 });
  const weg = aendereMarkierung(start, 'denken-1', -1);
  assert.deepEqual(weg, {}, 'Nulleintrag wird entfernt');
  assert.deepEqual(aendereMarkierung({}, 'denken-1', -1), {}, 'nie unter 0');
});

test('gesamtZahl summiert alle Markierungen', () => {
  assert.equal(gesamtZahl({}), 0);
  assert.equal(gesamtZahl(null), 0);
  assert.equal(gesamtZahl({ 'denken-1': 2, 'sozial-1': 3 }), 5);
});
