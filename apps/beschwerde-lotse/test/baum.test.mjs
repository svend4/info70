import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/baum.json', import.meta.url), 'utf8'));

test('Baum-Integrität: Start existiert, alle Ziele existieren, keine Waisen', () => {
  assert.ok(daten.knoten[daten.start], 'Start-Knoten fehlt');
  const zieleGesamt = new Set();
  for (const [id, k] of Object.entries(daten.knoten)) {
    assert.ok(k.frage?.length >= 10, `${id}: Frage fehlt`);
    assert.ok(k.optionen?.length >= 2, `${id}: mindestens 2 Optionen`);
    for (const o of k.optionen) {
      assert.ok(o.text?.length >= 10, `${id}: Optionstext fehlt`);
      const existiert = daten.knoten[o.ziel] || daten.blaetter[o.ziel];
      assert.ok(existiert, `${id}: Ziel ${o.ziel} existiert nicht`);
      zieleGesamt.add(o.ziel);
    }
  }
  // Jeder Knoten (ausser Start) und jedes Blatt ist von irgendwo erreichbar
  for (const id of Object.keys(daten.knoten)) {
    if (id !== daten.start) assert.ok(zieleGesamt.has(id), `Knoten ${id} ist verwaist`);
  }
  for (const id of Object.keys(daten.blaetter)) {
    assert.ok(zieleGesamt.has(id), `Blatt ${id} ist verwaist`);
  }
});

test('jedes Blatt: Titel + 4-5 konkrete Schritte', () => {
  for (const [id, b] of Object.entries(daten.blaetter)) {
    assert.ok(b.titel?.length >= 10, `${id}: Titel fehlt`);
    assert.ok(b.schritte.length >= 4 && b.schritte.length <= 5, `${id}: 4-5 Schritte`);
    for (const s of b.schritte) assert.ok(s.length >= 25, `${id}: Schritt zu kurz`);
  }
});

test('Hilfewege abgedeckt: 116 111 überall wo emotional, Beweis-Sichern, jugendschutz.net, kein Alleingang bei Straftaten', () => {
  const alles = JSON.stringify(daten.blaetter);
  const mit116 = Object.values(daten.blaetter).filter((b) => JSON.stringify(b).includes('116 111')).length;
  assert.ok(mit116 >= 6, 'Nummer gegen Kummer muss in den meisten Plänen stehen');
  assert.ok(/Screenshot|Beweis/i.test(alles), 'Beweise sichern muss vorkommen');
  assert.ok(alles.includes('jugendschutz.net'), 'offizielle Beschwerdestelle muss vorkommen');
  assert.ok(/Polizei/.test(alles), 'Straftat-Weg (über Erwachsene) muss vorkommen');
  assert.ok(/Melden ist kein Petzen/.test(alles), 'der Kernsatz muss vorkommen');
});
