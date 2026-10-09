import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, access } from 'node:fs/promises';

// Nennt ein README oder GDD die Zahl der Tests einer App, muss sie stimmen.
//
// In Welle 77 stand in GDD und README von tier-tanz-impulse 24, die Datei
// hatte 25, und die Aufzählung im GDD liess den letzten aus. Ein Dokument,
// das seine eigene Prüfmenge falsch angibt, ist genau dort nicht nachprüfbar,
// wo es Nachprüfbarkeit zusagt – und die Zahl wandert bei jeder Welle.
// Derselbe Fehler lag in drei älteren Apps (deutschland-kompass,
// erfinder-werkstatt, woerter-sortierer), jeweils um eins.
//
// Eine App MUSS die Zahl nicht nennen; 153 von 183 tun es nicht. Geprüft
// wird nur, wer sie nennt.
const appsDir = new URL('../../../apps/', import.meta.url);
const ZAHL_IM_BEFEHL = /#\s*(\d+)\s*(?:тест|Test)/g;
const ZAHL_AN_DER_DATEI = /\.test\.mjs`?\s*\((\d+)\)/g;

const vorhanden = async (url) => { try { await access(url); return true; } catch { return false; } };

const ordner = (await readdir(appsDir, { withFileTypes: true }))
  .filter((o) => o.isDirectory()).map((o) => o.name).sort();

const befunde = [];
let geprueft = 0;
for (const name of ordner) {
  const testDir = new URL(`${name}/test/`, appsDir);
  if (!(await vorhanden(testDir))) continue;
  const dateien = (await readdir(testDir)).filter((d) => d.endsWith('.test.mjs'));
  if (!dateien.length) continue;
  let echt = 0;
  for (const d of dateien) {
    const quelle = await readFile(new URL(d, testDir), 'utf8');
    echt += (quelle.match(/^test\(/gm) ?? []).length;
  }
  for (const doc of ['README.md', 'GDD.md']) {
    const url = new URL(`${name}/${doc}`, appsDir);
    if (!(await vorhanden(url))) continue;
    const s = await readFile(url, 'utf8');
    for (const muster of [ZAHL_IM_BEFEHL, ZAHL_AN_DER_DATEI]) {
      for (const m of s.matchAll(muster)) {
        geprueft += 1;
        if (Number(m[1]) !== echt) befunde.push(`apps/${name}/${doc} nennt ${m[1]} Tests, es sind ${echt}`);
      }
    }
  }
}

test('jede genannte Testzahl stimmt mit der Testdatei überein', () => {
  assert.deepEqual(befunde, [], befunde.join(' | '));
  // Plausibilität: die Regel darf nicht dadurch grün werden, dass sie nichts
  // mehr findet (ein geänderter Wortlaut der Befehlszeile zum Beispiel).
  assert.ok(geprueft >= 25, `nur ${geprueft} Zahlangaben gefunden – greift das Muster noch?`);
});
