import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeExperimente, vergleicheVermutung, forscherSatz, geraeteOhneExperiment } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/experimente.json', import.meta.url), 'utf8'));

test('Experiment-Bank gültig: ≥10 Experimente mit 3 Vermutungen/Ergebnissen + Erkenntnis', () => {
  assert.deepEqual(pruefeExperimente(daten), []);
  assert.ok(daten.experimente.length >= 10);
  assert.deepEqual(daten.schritte, ['Vermuten', 'Ausprobieren', 'Schlussfolgern'], 'Forschungskreis-Didaktik');
});

test('Sprungbrett-Prinzip + Sicherheit: Bildschirm-weg-Botschaft und Erwachsenen-Hinweis bei Wasser', () => {
  assert.match(daten.hinweis, /echte Experiment|Sprungbrett|zurück/i);
  assert.match(daten.hinweis, /dürfen falsch sein/i, 'keine Scham bei falscher Vermutung');
  const mitWasser = daten.experimente.filter((e) => /Wasser/i.test(e.material));
  assert.ok(mitWasser.length >= 2);
  for (const e of mitWasser) {
    assert.match(e.material, /großen Menschen|Erwachsen/i, `${e.id}: Erwachsenen-Hinweis bei Wasser`);
  }
});

test('Mess-Themen abgedeckt: Länge, Gewicht, Volumen, Zeit/Temperatur, faire Messung', () => {
  const alles = JSON.stringify(daten.experimente).toLowerCase();
  assert.match(alles, /schnur|schritte/, 'Länge ohne Zahlen');
  assert.match(alles, /schwerer|waage/, 'Gewicht');
  assert.match(alles, /becher.*flasche|volumen/, 'Volumen mit Mess-Einheit');
  assert.match(alles, /schmilzt|thermometer|kälter/, 'Zeit/Temperatur');
  assert.match(alles, /gleicher startpunkt|nicht anschieben|faire messung/, 'faire Messbedingungen');
  assert.match(alles, /meter|einheit/, 'Warum feste Einheiten');
});

test('vergleicheVermutung: beide Wege sind positive Botschaften', () => {
  const treffer = vergleicheVermutung(1, 1);
  assert.equal(treffer.stimmte, true);
  assert.match(treffer.botschaft, /gestimmt/);
  const anders = vergleicheVermutung(0, 2);
  assert.equal(anders.stimmte, false);
  assert.match(anders.botschaft, /Überraschung/);
  assert.ok(!/falsch gemacht|leider|schade/i.test(anders.botschaft), 'keine Beschämung');
});

test('forscherSatz nennt Vermutung und Ergebnis', () => {
  const e = daten.experimente[0];
  const satz = forscherSatz(e, 0, 2);
  assert.ok(satz.includes(e.vermutungen[0]));
  assert.ok(satz.includes(e.ergebnisse[2]));
  assert.match(satz, /^Ich habe vermutet/);
});

test('Geräte-Abdeckung: Waage, Messbecher, Schnur oder Lineal, Thermometer und Lupe kommen je in einem Experiment vor', () => {
  assert.deepEqual(geraeteOhneExperiment(daten), []);
  assert.ok(daten.experimente.some((e) => e.id === 'lupe-oberflaeche'), 'Lupe-Experiment fehlt');
  assert.ok(daten.experimente.some((e) => e.id === 'lineal-stift'), 'Lineal-Experiment fehlt');
});

test('Prüfung schlägt an: fehlendes Gerät und fehlender Erwachsenen-Hinweis bei Küche werden gemeldet', () => {
  const ohneLupe = structuredClone(daten);
  ohneLupe.experimente[8] = { ...ohneLupe.experimente[8], material: 'ein Blatt Papier', anleitung: ['Schau genau hin.', 'Vergleiche.'] };
  assert.ok(pruefeExperimente(ohneLupe).includes('Gerät ohne Experiment: Lupe'));
  const kuechenTest = structuredClone(daten);
  kuechenTest.experimente[2].material = 'eine Küchenwaage';
  assert.ok(pruefeExperimente(kuechenTest).some((f) => /Erwachsenen-Hinweis/.test(f)));
  const zuWenig = { experimente: daten.experimente.slice(0, 9) };
  assert.deepEqual(pruefeExperimente(zuWenig), ['zu wenige Experimente']);
});

test('Eigenentwurf oder Quelle: jedes Experiment mit eigenentwurf false hat eine Seitenangabe', () => {
  for (const e of daten.experimente) {
    if (e.eigenentwurf === false) assert.match(e.quelle?.seite ?? '', /^S\. \d+$/, `${e.id}: Seitenangabe fehlt`);
  }
});
