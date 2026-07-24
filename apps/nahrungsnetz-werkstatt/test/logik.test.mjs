import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeNetze, startBestand, simuliere, artName, erklaere } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/netze.json', import.meta.url), 'utf8'));
const wald = daten.netze.find((n) => n.id === 'wald');

test('Netze gültig: Produzent vorhanden, Ketten verweisen auf echte Arten', () => {
  assert.deepEqual(pruefeNetze(daten), []);
  assert.ok(daten.netze.length >= 3);
});

test('inhaltliche Abdeckung: mitteleuropäische Arten, Rote-Liste-Markierung', () => {
  const alles = JSON.stringify(daten).toLowerCase();
  assert.match(alles, /reh|wolf|fuchs/, 'Waldarten');
  assert.match(alles, /rote liste|geschützt|schutz/i, 'Rote Liste / Schutz benannt');
  assert.ok(daten.netze.flatMap((n) => n.arten).some((a) => a.geschuetzt), 'mind. eine geschützte Art');
  assert.match(daten.hinweis, /vereinfachtes Modell|keine echte Vorhersage/i, 'Modell-Grenze ehrlich benannt');
});

test('startBestand: alle Arten auf Startwert', () => {
  const b = startBestand(wald, daten);
  assert.equal(b.reh, 3);
  assert.equal(Object.keys(b).length, wald.arten.length);
});

test('Klassiker: Wolf weg → Reh nimmt zu (weil kein Räuber), Pflanze bleibt eine Ebene', () => {
  const b = startBestand(wald, daten);
  const nachher = simuliere(wald, b, 'wolf', -2);
  assert.equal(nachher.wolf, 1, 'Wolf sinkt um 2');
  assert.equal(nachher.reh, 4, 'Reh steigt (Räuber fehlt) um 1');
  // ein Schritt: Pflanze reagiert (noch) nicht direkt auf Wolf
  assert.equal(nachher.pflanze, b.pflanze);
});

test('mehr Reh → Wolf bekommt mehr Futter (steigt), Pflanze wird stärker gefressen (sinkt)', () => {
  const b = startBestand(wald, daten);
  const nachher = simuliere(wald, b, 'reh', +1);
  assert.equal(nachher.reh, 4);
  assert.equal(nachher.wolf, 4, 'Räuber Wolf folgt der Beute nach oben');
  assert.equal(nachher.pflanze, 2, 'Pflanze wird mehr gefressen');
});

test('Bestände werden auf 0..max begrenzt; simuliere lässt Original unverändert', () => {
  const b = { ...startBestand(wald, daten), reh: 0 };
  const nachher = simuliere(wald, b, 'reh', -2, 5);
  assert.equal(nachher.reh, 0, 'nicht unter 0');
  assert.equal(b.reh, 0, 'Original unverändert');
  const voll = { ...startBestand(wald, daten), pflanze: 5 };
  assert.equal(simuliere(wald, voll, 'pflanze', +2, 5).pflanze, 5, 'nicht über max');
});

test('erklaere: nennt Richtung, Ketten-Folgen und warnt bei Verschwinden', () => {
  const b = startBestand(wald, daten);
  const e = erklaere(wald, b, 'reh', +1);
  assert.equal(e.richtung, 'mehr');
  assert.ok(e.folgen.some((f) => /Wolf/.test(f)));
  assert.ok(e.folgen.some((f) => /Eicheln|Bucheckern/.test(f)));
  assert.equal(e.warnung, null);
  // Verschwinden
  const knapp = { ...b, maus: 1 };
  const e2 = erklaere(wald, knapp, 'fuchs', +1);
  assert.match(e2.warnung ?? '', /verschwunden/);
});

test('artName', () => {
  assert.match(artName(wald, 'wolf'), /🐺 Wolf/);
  assert.equal(artName(wald, 'gibtnicht'), 'gibtnicht');
});
