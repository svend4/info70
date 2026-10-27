import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');
const CODES = ['geben', 'ablehnen', 'fragen'];
// Die einmalige Entfernung des alten Schlüssels (Migration) ist die einzige Zeile mit removeItem.
const MIGRATION = /^\s*try \{ localStorage\.removeItem\('ds\.rekord'\); \} catch \{\}\s*$/;

test('Szenarienbank: Grundstruktur und eindeutige IDs', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 10, 'mindestens 10 Szenarien');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!('raenge' in daten), 'die Daten haben keine Raenge: Kinder werden nicht bewertet');
});

test('jedes Szenario: vollständig, beste/auchOk konsistent', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 20, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(s.erklaerung?.length >= 30, `${s.id}: Erklärung fehlt/zu kurz (dort passiert das Lernen!)`);
    assert.ok(CODES.includes(s.beste), `${s.id}: beste muss ${CODES.join('/')} sein`);
    assert.ok(Array.isArray(s.auchOk), `${s.id}: auchOk fehlt`);
    for (const code of s.auchOk) {
      assert.ok(CODES.includes(code), `${s.id}: unbekannter auchOk-Code ${code}`);
      assert.notEqual(code, s.beste, `${s.id}: beste darf nicht in auchOk stehen`);
    }
  }
});

test('didaktische Balance: alle drei Antworttypen kommen als beste Antwort vor', () => {
  const beste = new Set(daten.szenarien.map((s) => s.beste));
  for (const code of CODES) {
    assert.ok(beste.has(code), `"${code}" ist nie die beste Antwort - Kinder lernen sonst ein starres Muster statt Abwägen`);
  }
});

test('Kostenfallen-Paket vorhanden (Pipeline-Idee 11, Gefährdungsatlas-Kapitel)', () => {
  const kostenfallen = daten.szenarien.filter((s) => /€|abo|juwel|lootbox|truhe|kauf/i.test(JSON.stringify(s)));
  assert.ok(kostenfallen.length >= 5, 'mindestens 5 Kostenfallen-Szenarien');
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/lootbox/i.test(alles), 'Lootbox-Mechanik muss vorkommen');
  assert.ok(/abo/i.test(alles), 'Abo-Trick muss vorkommen');
});

test('Familien-Datenschatz-Pack (Katalog Nr. 225): Familiensituationen inkl. Privatsphäre auch gegenüber Eltern', () => {
  assert.ok(daten.szenarien.length >= 30, 'Familien-Pack ergänzt (mindestens 30 Szenarien)');
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/Sprachassistent|Smart Speaker|mithört|zuhört/i.test(alles), 'Smart Speaker im Kinderzimmer');
  assert.ok(/wo du gerade bist|Ortung|Standort.*Eltern/i.test(alles), 'Ortungs-App');
  assert.ok(/Artikel 16/.test(alles), 'Privatsphäre-Recht (Art. 16), auch gegenüber Eltern');
  // elterliche Überwachung wird als Privatsphäre-Frage thematisiert (nicht blind verweigern -> beste = fragen)
  const ortung = daten.szenarien.find((s) => /wo du gerade bist|Ortung/i.test(s.situation));
  assert.equal(ortung.beste, 'fragen', 'Ortung: gemeinsam besprechen statt blind ablehnen');
});

test('Account-Diebstahl-Pack "Wer bist du wirklich?" (Katalog Nr. 234)', () => {
  assert.ok(daten.szenarien.length >= 24, 'Account-Pack ergänzt (mindestens 24 Szenarien)');
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/Phishing|Fake-Login|komisch aus/i.test(alles), 'gefälschte Login-Seite / Phishing');
  assert.ok(/Passwort/i.test(alles), 'Passwörter sind privat');
  assert.ok(/Identitätsdiebstahl|Profil mit deinem Foto|tut so, als wärst du/i.test(alles), 'fremdes Profil mit eigenem Foto');
  // Verdachtsfälle: mindestens ein Account-Szenario verweist auf Erwachsene (beste = fragen)
  const meldeFaelle = daten.szenarien.filter((s) => s.beste === 'fragen' && /Profil|Konto|Account|Nachrichten/i.test(s.situation));
  assert.ok(meldeFaelle.length >= 1, 'Verdachtsfälle Erwachsenen melden');
});

test('Kinder werden nicht bewertet: kein Rekord, keine Punkte, kein Rang, kein Pokal im App-Code', () => {
  const ohneMigration = appQuelle.split('\n').filter((z) => !MIGRATION.test(z)).join('\n');
  assert.doesNotMatch(ohneMigration, /rekord|punkte|\brang\b|raenge|🏆|💎/i, 'app.mjs führt weder Zähler noch Rang noch Rekord');
  assert.doesNotMatch(appQuelle, /Zum Ergebnis|Geschafft/, 'das Ende heißt neutral');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende der Runde ist neutral benannt');
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
  assert.match(elternSeite, /Es wird nichts gespeichert/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten l(ö|oe)schen|löschbar/, 'ohne Speicher keine Karte und kein Knopf im Text');
});
