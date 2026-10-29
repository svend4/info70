import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { erzeugeGruppe2Stand, docs10Zeilen, STUFE_1, STUFE_2, UNKLAR, NICHT_BAUEN } from '../src/gruppe-2-stand.mjs';

// Der Stand der 131 Einheiten (Plan 18.10, Index 27.10, Ergänzung 29.10) folgt aus den Quellen. Der Test hält fest, dass
// die JSON-Datei und die Statuszeilen in docs/10 genau dieser Ableitung entsprechen (Serie D, Befund Abgleich 29.10.2026).
const WURZEL = fileURLToPath(new URL('../../../', import.meta.url));
const { ausgabe, fehler } = erzeugeGruppe2Stand(WURZEL);

test('Gruppe 2: alle Prüfungen der Ableitung stimmen (Bilanz 27.10, Stufen, Ordner, Bauaufträge)', () => {
  assert.deepEqual(fehler, [], fehler.join(' | '));
});

test('Gruppe 2: Zählungen gleich der Bilanz des Index (63 gebaut, 62 teilweise, 3 unklar, 3 nicht bauen)', () => {
  const z = ausgabe.zahlen;
  assert.equal(z.gesamt, 131);
  assert.equal(z.gebaut, 63);
  assert.equal(z.teilweise, 62);
  assert.equal(z.unklar, 3);
  assert.equal(z.nicht_bauen, 3);
  assert.equal(z.davon_variante_a, 4);
});

test('Gruppe 2: Stufen 1 bis 3 wie im Plan 27.10 (4, 9 und 53 Einheiten), unklar und nicht bauen getrennt', () => {
  const z = ausgabe.zahlen;
  assert.deepEqual([z.stufe_1, z.stufe_2, z.stufe_3], [4, 9, 53]);
  assert.equal(STUFE_1.length, 4);
  assert.equal(STUFE_2.length, 9);
  assert.equal(UNKLAR.length + NICHT_BAUEN.length, 6);
  for (const id of UNKLAR) assert.equal(ausgabe.einheiten.find((e) => e.id === id).status, 'unklar', id);
  for (const id of NICHT_BAUEN) assert.equal(ausgabe.einheiten.find((e) => e.id === id).status, 'nicht bauen', id);
});

test('Gruppe 2: die Stufe-3-Reihenfolge nennt geprüfte Quellen zuerst (Plan 27.10, Abschnitt 2, Punkt 3)', () => {
  const reihe = ausgabe.stufe_3_reihenfolge.map((id) => ausgabe.einheiten.find((e) => e.id === id));
  assert.equal(reihe.length, 53);
  const rang = { 'faktengeprüft': 1, 'nur Katalogtext': 2, 'Quelle nicht im Repo prüfbar': 3 };
  for (let i = 1; i < reihe.length; i += 1) {
    assert.ok(rang[reihe[i - 1].faktenstand] <= rang[reihe[i].faktenstand], `${reihe[i - 1].id} vor ${reihe[i].id}`);
  }
});

test('Gruppe 2: die JSON-Datei docs/status-gruppe-2-2026-10-29.json ist die aktuelle Ableitung', () => {
  const gespeichert = JSON.parse(readFileSync(new URL('docs/status-gruppe-2-2026-10-29.json', `file://${WURZEL}`), 'utf8'));
  assert.deepEqual(gespeichert, JSON.parse(JSON.stringify(ausgabe)), 'node tools/gruppe-2-stand.mjs --schreiben ausführen');
});

test('Gruppe 2: docs/10 trägt die Statuszeilen je Abschnitt aus der Ableitung (Serie D)', () => {
  const text = readFileSync(new URL('docs/10-praleska-baukasten.md', `file://${WURZEL}`), 'utf8');
  for (const [kennung, zeilen] of Object.entries(docs10Zeilen(ausgabe))) {
    assert.ok(text.includes(zeilen), `Statuszeilen ${kennung} fehlen oder weichen ab: node tools/gruppe-2-stand.mjs --docs10`);
  }
});
