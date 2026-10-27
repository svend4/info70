import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/sachen.json', import.meta.url), 'utf8'));
const sachen = daten.sachen;
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
// Die einmalige Entfernung des alten Schlüssels (Migration) ist die einzige Zeile mit removeItem.
const MIGRATION = /^\s*try \{ localStorage\.removeItem\('dsm\.rekord'\); \} catch \{\}\s*$/;

test('Zielgruppe 6-8, genug Karten, jede vollständig', () => {
  assert.equal(daten.zielgruppe, '6-8');
  assert.ok(sachen.length >= 8, `mindestens 8 Karten (ist: ${sachen.length})`);
  const ids = new Set();
  for (const s of sachen) {
    assert.ok(s.id && s.piktogramm && s.sache, `unvollständig: ${s.id}`);
    assert.equal(typeof s.geheim, 'boolean', `${s.id}: geheim muss true/false sein`);
    assert.ok(s.erklaerung && s.erklaerung.length >= 20, `${s.id}: Erklärung zu kurz`);
    ids.add(s.id);
  }
  assert.equal(ids.size, sachen.length, 'IDs eindeutig');
});

test('Balance: beide Sorten (geheim / darf jeder wissen) kommen vor', () => {
  const geheim = sachen.filter((s) => s.geheim).length;
  const offen = sachen.filter((s) => !s.geheim).length;
  assert.ok(geheim >= 3, 'genug geheime Sachen');
  assert.ok(offen >= 3, 'genug offene Sachen');
});

test('Leichte Sprache: kurze Sätze, kein Fachwort-Wust', () => {
  for (const s of sachen) {
    assert.ok(s.sache.length <= 60, `${s.id}: Sache-Text für 6-8 zu lang`);
    // Erklärung in kurzen Sätzen (kein Satz über ~90 Zeichen)
    for (const satz of s.erklaerung.split(/(?<=[.!?])\s+/)) {
      assert.ok(satz.length <= 90, `${s.id}: Satz zu lang für Leichte Sprache: ${satz}`);
    }
  }
});

test('Kern-Schutzsachen sind als geheim markiert (Passwort, Adresse)', () => {
  const alles = JSON.stringify(sachen);
  assert.match(alles, /Passwort/);
  assert.match(alles, /Adresse/);
  const passwort = sachen.find((s) => /Passwort/.test(s.sache));
  const adresse = sachen.find((s) => /Adresse/.test(s.sache));
  assert.equal(passwort.geheim, true, 'Passwort muss geheim sein');
  assert.equal(adresse.geheim, true, 'Adresse muss geheim sein');
});

test('Kinder werden nicht bewertet: kein Rekord, keine Punkte, kein Pokal, kein Ergebnissatz im App-Code', () => {
  const ohneMigration = appQuelle.split('\n').filter((z) => !MIGRATION.test(z)).join('\n');
  assert.doesNotMatch(ohneMigration, /rekord|bestwert|punkte|\brang\b|raenge|🏆|🌟|⭐/i, 'app.mjs führt weder Zähler noch Rang noch Rekord');
  assert.doesNotMatch(appQuelle, /richtig sortiert|Super gemacht/, 'kein Ergebnissatz am Ende');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende der Runde ist neutral benannt');
  assert.ok(!('raenge' in daten), 'die Daten haben keine Raenge');
  assert.equal(appQuelle.split('\n').filter((z) => MIGRATION.test(z)).length, 1, 'der alte Schlüssel wird mit genau einer Zeile entfernt');
  assert.match(elternSeite, /keine Punkte, keinen Rekord und keine Ränge/, 'die Eltern-Seite sagt, was die App nicht kennt');
});

test('Speicherregel: speichert die App (setItem), gibt es einen Löschknopf; speichert sie nichts, gibt es keine Karte', () => {
  const speichert = /localStorage\.setItem/.test(appQuelle);
  const loeschbar = /Meine Daten l(ö|oe)schen|datenKarte|daten-karte|loescheDaten/.test(appQuelle);
  if (speichert) assert.ok(loeschbar, 'speichert die App, braucht sie einen Löschknopf');
  else assert.ok(!loeschbar, 'speichert die App nichts, hat sie keine Karte Meine Daten löschen');
  assert.ok(!speichert, 'die App speichert nichts');
  assert.doesNotMatch(appQuelle, /sprache\.mjs/, 'keine Sprachwahl mit Speicher');
  assert.match(elternSeite, /es wird nichts gespeichert/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten l(ö|oe)schen|löschbar/, 'ohne Speicher keine Karte und kein Knopf im Text');
});
