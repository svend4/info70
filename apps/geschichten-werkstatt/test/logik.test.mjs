import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HELDEN, ORTE, PROBLEME, STEMPEL, ERKLAER, WAS_WAERE_WENN, erzeugeGeschichte } from '../logik.mjs';

test('Bausteine: Helden, Orte, Probleme vorhanden', () => {
  assert.ok(HELDEN.length >= 3 && ORTE.length >= 3 && PROBLEME.length >= 3);
});

test('erzeugeGeschichte: enthält gewählten Helden, Ort und Ereignis', () => {
  const wahl = { held: HELDEN[0], ort: ORTE[1], problem: PROBLEME[2] };
  const text = erzeugeGeschichte(wahl, (arr) => arr[0]); // deterministisch
  assert.ok(text.includes(HELDEN[0]), 'Held im Text');
  assert.ok(text.includes(ORTE[1]), 'Ort im Text');
  assert.ok(text.includes(PROBLEME[2]), 'Ereignis im Text');
  assert.ok(text.length >= 80, 'zusammenhängende Geschichte');
});

test('KI-Stempel „Von der Maschine gebaut“ (Katalog Nr. 242)', () => {
  assert.match(STEMPEL, /Maschine gebaut/);
});

test('Erklärung legt die Baustein-Generierung offen und ordnet Maschinen-Text ein', () => {
  assert.match(ERKLAER, /kein Mensch|Baustein/i, 'Baustein-Generierung offengelegt');
  assert.match(ERKLAER, /KI/, 'Bezug zur KI');
  assert.match(ERKLAER, /Entwurf|nicht die Wahrheit|Mit-Autor/i, 'Maschinen-Text als Entwurf, nicht Wahrheit');
});

test('Pack "Mut & Anderssein" (Katalog Nr. 243): Bausteine + Was-wäre-wenn-Karten', () => {
  const alles = JSON.stringify([...HELDEN, ...ORTE, ...PROBLEME]).toLowerCase();
  assert.match(alles, /anders|rollstuhl|neu in der klasse/, 'Anderssein-Held vorhanden');
  assert.match(alles, /nein zu sagen|ausgelacht|superkraft|beisteht|bei, den alle ärgern/, 'Mut-Ereignis vorhanden');
  assert.ok(WAS_WAERE_WENN.length >= 4, 'genug Was-wäre-wenn-Karten');
  for (const k of WAS_WAERE_WENN) assert.match(k, /^Was wäre, wenn/, 'Impuls-Format');
});

test('Auswahlfunktion ist injizierbar (reine Funktion)', () => {
  const wahl = { held: 'H', ort: 'O', problem: 'P' };
  const a = erzeugeGeschichte(wahl, (arr) => arr[0]);
  const b = erzeugeGeschichte(wahl, (arr) => arr[0]);
  assert.equal(a, b, 'gleiche Auswahl -> gleicher Text (deterministisch testbar)');
});
