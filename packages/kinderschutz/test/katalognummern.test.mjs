import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';

// Viele Apps nennen im Kopfkommentar ihre Herkunft als „docs/09 Nr. N".
// Nachgezaehlt in Welle 82: `docs/ideen-katalog.json` traegt 139 Ideen, die
// Apps zitieren aber 52 verschiedene Nummern, davon 28 ueber 139. Diese 28
// stammen aus einer frueheren, groesseren Fassung des Katalogs und sind heute
// nicht mehr aufloesbar. Rekonstruieren laesst sich die alte Nummerierung
// nicht - eine erfundene Zuordnung waere schlimmer als eine fehlende.
//
// Was diese Regel kann: verhindern, dass die Luecke WAECHST. Der Altbestand
// ist eingefroren; jede NEUE Nummer muss sich im Katalog auflösen lassen.
const wurzel = new URL('../../../', import.meta.url);
const ZITAT = /docs\/09 Nr\.\s*(\d+)/g;

// Eingefroren am 09.10.2026. Diese Liste darf nur kuerzer werden.
const ALTBESTAND = new Set([
  144, 147, 154, 155, 156, 162, 163, 166, 168, 169, 172, 174, 175, 177, 188,
  189, 204, 205, 209, 219, 220, 223, 224, 242, 243, 244, 246, 257,
]);

const katalog = JSON.parse(await readFile(new URL('docs/ideen-katalog.json', wurzel), 'utf8'));
const anzahl = katalog.ideen.length;

const appsDir = new URL('apps/', wurzel);
const neu = [];
const gefunden = new Set();
for (const eintrag of await readdir(appsDir, { withFileTypes: true })) {
  if (!eintrag.isDirectory()) continue;
  const appDir = new URL(`${eintrag.name}/`, appsDir);
  for (const datei of (await readdir(appDir)).filter((d) => d.endsWith('.mjs'))) {
    const quelle = await readFile(new URL(datei, appDir), 'utf8');
    for (const m of quelle.matchAll(ZITAT)) {
      const n = Number(m[1]);
      gefunden.add(n);
      if (n > anzahl && !ALTBESTAND.has(n)) {
        neu.push(`apps/${eintrag.name}/${datei}: „docs/09 Nr. ${n}" – der Katalog hat ${anzahl} Einträge, und die Nummer steht nicht im Altbestand`);
      }
    }
  }
}

test('keine neue unauflösbare Katalognummer', () => {
  assert.deepEqual(neu, [], neu.join('\n'));
  // Plausibilität: die Regel darf nicht grün werden, weil sie nichts findet.
  assert.ok(gefunden.size >= 40, `nur ${gefunden.size} Katalognummern gefunden – greift das Muster noch?`);
});

test('der eingefrorene Altbestand schrumpft, wächst aber nicht', () => {
  // Jede Nummer der Liste muss auch wirklich noch irgendwo zitiert werden -
  // sonst steht hier eine Ausnahme für ein Problem, das es nicht mehr gibt.
  const verwaist = [...ALTBESTAND].filter((n) => !gefunden.has(n));
  assert.deepEqual(verwaist, [], `verwaiste Ausnahmen: ${verwaist.join(', ')} – aus der Liste streichen`);
  assert.equal(ALTBESTAND.size, 28, 'der Altbestand hat sich geändert – wurde er kleiner, gehört die Zahl hier angepasst');
});
