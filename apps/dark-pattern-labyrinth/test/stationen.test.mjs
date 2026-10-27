import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/stationen.json', import.meta.url), 'utf8'));

test('Stationenbank: Grundstruktur, genau 7 Stationen, eindeutige IDs, keine Ränge', () => {
  assert.equal(daten.version, 1);
  assert.equal(daten.stationen.length, 7, 'genau 7 Stationen (7 Dark Patterns)');
  const ids = daten.stationen.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'IDs müssen eindeutig sein');
  assert.ok(!('raenge' in daten), 'das Kind wird nicht bewertet: keine Rang- oder Punkteschwellen in den Daten');
});

test('jede Station: Schema (id, name, situation, optionen[{text,istFalle}], erklaerung >= 40) + genau EINE ehrliche Option', () => {
  for (const s of daten.stationen) {
    assert.ok(typeof s.id === 'string' && s.id.length >= 2, `${s.id}: id fehlt/zu kurz`);
    assert.ok(typeof s.name === 'string' && s.name.length >= 5, `${s.id}: Muster-Name fehlt/zu kurz`);
    assert.ok(typeof s.situation === 'string' && s.situation.length >= 20, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(typeof s.erklaerung === 'string' && s.erklaerung.length >= 40, `${s.id}: Erklärung fehlt/zu kurz (dort passiert das Lernen!)`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length >= 2 && s.optionen.length <= 4, `${s.id}: 2 bis 4 Optionen`);
    for (const o of s.optionen) {
      assert.ok(typeof o.text === 'string' && o.text.length >= 5, `${s.id}: Optionstext fehlt/zu kurz`);
      assert.equal(typeof o.istFalle, 'boolean', `${s.id}: istFalle muss boolean sein`);
    }
    assert.equal(s.optionen.filter((o) => !o.istFalle).length, 1, `${s.id}: genau EINE ehrliche Option`);
    assert.ok(s.optionen.some((o) => o.istFalle), `${s.id}: mindestens eine Falle`);
  }
});

test('die 7 verabredeten Dark Patterns sind alle vertreten (je genau eine Station)', () => {
  const muster = [
    [/countdown|zeitdruck/i, 'Countdown-Angebot'],
    [/häkchen|haekchen/i, 'vorangekreuzte Häkchen'],
    [/confirmshaming/i, 'Confirmshaming'],
    [/versteckt|schließen|schliessen/i, 'versteckter Schließen-Knopf'],
    [/badge|benachrichtigung/i, 'Fake-Benachrichtigungs-Badge'],
    [/werbe|werbung/i, 'Belohnung fürs Werbung schauen'],
    [/kündigung|kuendigung|abo/i, 'Kündigungs-Labyrinth'],
  ];
  for (const [regex, label] of muster) {
    assert.equal(daten.stationen.filter((s) => regex.test(s.name)).length, 1, `Muster „${label}“ muss genau einmal vorkommen`);
  }
});

test('Politik: keine Links und keine echten Marken in der Kinder-Contentbank', () => {
  const alles = JSON.stringify(daten);
  assert.ok(!/https?:/i.test(alles), 'keine Links in der Contentbank');
  assert.ok(!/tiktok|youtube|instagram|fortnite|roblox/i.test(alles), 'keine echten Marken - die Fake-App heißt Glitzi');
});

test('Keine Wertung und Speicherregel: ohne setItem keine Löschkarte, nur die Migration des alten Schlüssels', async () => {
  const lies = (datei) => readFile(new URL(`../${datei}`, import.meta.url), 'utf8');
  // Ohne Kommentarzeilen prüfen: Erklärungen über das Verbotene zählen nicht.
  const code = ['app.mjs', 'spiel.mjs'].map(lies);
  const quelle = (await Promise.all(code)).join('\n').split('\n').filter((z) => !/^\s*\/\//.test(z)).join('\n');
  const ohneMigration = quelle.split('\n').filter((z) => !/^try \{ localStorage\.removeItem\('dpl\.rekord'\); \} catch \{\}$/.test(z.trim())).join('\n');
  assert.doesNotMatch(ohneMigration, /raenge|rekord|punkte|Geschafft/i, 'App-Code ohne Rekord, Rang und Punkte');
  const speichert = /\.setItem\(/.test(quelle);
  const hatLoeschknopf = /daten-karte\.mjs|datenKarte\(|Meine Daten löschen/.test(quelle);
  if (speichert) assert.ok(hatLoeschknopf || /\.removeItem\(/.test(quelle), 'wer speichert, hat einen Löschknopf');
  else assert.ok(!hatLoeschknopf, 'wer nichts speichert, hat keine Karte „Meine Daten löschen“');
  assert.equal(speichert, false, 'die App speichert nichts');
  const migration = quelle.split('\n').filter((z) => /removeItem/.test(z));
  assert.deepEqual(migration.map((z) => z.trim()), ["try { localStorage.removeItem('dpl.rekord'); } catch {}"], 'genau eine Zeile entfernt den alten Rekord');
  assert.doesNotMatch(await lies('eltern.html'), /Meine Daten löschen|löschbar/, 'ohne Speicher kein Löschknopf in der Eltern-Seite');
  assert.doesNotMatch(JSON.stringify(daten), /geschafft|Punkte|🏆/i, 'die Stationen-Texte enthalten keine Wertung');
});
