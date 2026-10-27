import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Szenarienbank: Grundstruktur, IDs, keine Ränge (das Kind wird nicht bewertet)', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 8);
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!('raenge' in daten), 'die Daten haben keine Rang- oder Punkteschwellen');
});

test('jedes Szenario: 2/1/0-Muster, benanntes Muster, Erklärung', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 25, `${s.id}: Situation fehlt`);
    assert.ok(s.muster?.length >= 8, `${s.id}: Muster-Name fehlt (Kern: benennen!)`);
    assert.ok(s.erklaerung?.length >= 80, `${s.id}: Erklärung zu kurz`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert);
    assert.ok(werte.every((w) => [0, 1, 2].includes(w)), `${s.id}: Werte nur 0/1/2`);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN selbstbestimmter Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine Falle`);
  }
});

test('Muster-Breite: die typischen Dark Patterns sind benannt', () => {
  const muster = daten.szenarien.map((s) => s.muster.toLowerCase()).join(' | ');
  assert.match(muster, /countdown/, 'Countdown-Druck');
  assert.match(muster, /häkchen/, 'vorangekreuztes Häkchen');
  assert.match(muster, /schließen|versteckt/, 'versteckter Schließen-Knopf');
  assert.match(muster, /schäme|confirmshaming/, 'Confirmshaming');
  assert.match(muster, /verknappung/, 'künstliche Verknappung');
});

test('Kern-Idee: Muster benennen macht wiedererkennbar; Hilfe-Insel eingebunden', () => {
  // Jede Auflösung zeigt den Muster-Namen (im Code) und ein Szenario übt das Weitergeben.
  assert.match(appQuelle, /Der Trick heißt/, 'Muster wird in der Auflösung benannt');
  const alles = JSON.stringify(daten.szenarien);
  assert.match(alles, /Wissen weitergeben|erklären|Trick namens/, 'Wissen weitergeben als Szenario');
  assert.match(appQuelle, /hilfeInsel/, 'Hilfe-Insel eingebunden');
});

test('Keine Wertung und Speicherregel: ohne setItem keine Löschkarte, nur die Migration des alten Schlüssels', async () => {
  // Ohne Kommentarzeilen prüfen: Erklärungen über das Verbotene zählen nicht.
  const code = appQuelle.split('\n').filter((z) => !/^\s*\/\//.test(z)).join('\n');
  const ohneMigration = code.split('\n').filter((z) => !/^try \{ localStorage\.removeItem\('dpd\.rekord'\); \} catch \{\}$/.test(z.trim())).join('\n');
  assert.doesNotMatch(ohneMigration, /raenge|rekord|punkte|Geschafft/i, 'App-Code ohne Rekord, Rang und Punkte');
  const speichert = /\.setItem\(/.test(code);
  const hatLoeschknopf = /daten-karte\.mjs|datenKarte\(|Meine Daten löschen/.test(code);
  if (speichert) assert.ok(hatLoeschknopf || /\.removeItem\(/.test(code), 'wer speichert, hat einen Löschknopf');
  else assert.ok(!hatLoeschknopf, 'wer nichts speichert, hat keine Karte „Meine Daten löschen“');
  assert.equal(speichert, false, 'die App speichert nichts');
  const migration = code.split('\n').filter((z) => /removeItem/.test(z));
  assert.deepEqual(migration.map((z) => z.trim()), ["try { localStorage.removeItem('dpd.rekord'); } catch {}"], 'genau eine Zeile entfernt den alten Rekord');
  const eltern = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
  assert.doesNotMatch(eltern, /Meine Daten löschen|löschbar/, 'ohne Speicher kein Löschknopf in der Eltern-Seite');
});
