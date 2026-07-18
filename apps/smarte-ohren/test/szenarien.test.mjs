import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));

test('Szenarien: mind. 6, eindeutige IDs, Abschlusstext', () => {
  assert.ok(daten.szenarien.length >= 6);
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
  assert.ok(daten.ende?.length >= 30, 'ermutigender Abschluss');
});

test('jede Szene: Emoji, Situation, Frage, genau eine gute Option, immer ermutigend', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.emoji, `${s.id}: Emoji fehlt`);
    assert.ok(s.situation?.length >= 15, `${s.id}: Situation fehlt`);
    assert.ok(s.frage?.length >= 5, `${s.id}: Frage fehlt`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 2, `${s.id}: genau 2 Optionen (für 6-8)`);
    assert.equal(s.optionen.filter((o) => o.gut === true).length, 1, `${s.id}: genau eine gute Option`);
    assert.equal(s.optionen.filter((o) => o.gut === false).length, 1, `${s.id}: eine weitere Option`);
    assert.ok(s.lobGut?.length >= 15 && s.lobWeiter?.length >= 15, `${s.id}: beides Feedback muss ermutigend sein`);
    // Keine Scham-Sprache im "weiter"-Feedback
    assert.ok(!/falsch|dumm|nein!/i.test(s.lobWeiter), `${s.id}: kein Scham-Feedback`);
  }
});

test('Leichte Sprache: kurze Sätze (ein Gedanke pro Satz)', () => {
  const texte = daten.szenarien.flatMap((s) => [s.situation, s.frage, s.lobGut, s.lobWeiter, s.tipp].filter(Boolean));
  texte.push(daten.ende);
  for (const t of texte) {
    const saetze = t.split(/(?<=[.!?])\s+/).filter((x) => /\w/.test(x));
    const maxWorte = Math.max(...saetze.map((x) => x.split(/\s+/).length));
    assert.ok(maxWorte <= 11, `Satz zu lang für Leichte Sprache (${maxWorte} Wörter): "${t}"`);
  }
});

test('Datensparsamkeit-Themen: Name/Adresse, Geheimnis/Passwort, Kaufen, Hilfe holen', () => {
  const alles = JSON.stringify(daten.szenarien).toLowerCase();
  assert.match(alles, /adresse|wohnst|schule/, 'private Orte');
  assert.match(alles, /passwort|geheim/, 'Geheimnisse/Passwort');
  assert.match(alles, /kauf/, 'Kaufen kostet echtes Geld');
  assert.match(alles, /erwachsene/, 'Hilfe bei Erwachsenen holen');
});
