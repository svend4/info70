import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import {
  NOTRUFNUMMERN, nurZiffern, istNotrufnummer, pruefeAnruf, rueckmeldung,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/situationen.json', import.meta.url), 'utf8'));
const situationen = daten.situationen;
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const MIGRATION = /^try \{ localStorage\.removeItem\('notruf\.rekord'\); \} catch \{\}$/m;
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');

test('Daten: Situationen mit gültiger Notrufnummer, Warum, Schritte', () => {
  assert.ok(situationen.length >= 6, `mindestens 6 Situationen (ist: ${situationen.length})`);
  const ids = situationen.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'IDs eindeutig');
  for (const s of situationen) {
    assert.ok(NOTRUFNUMMERN.includes(s.nummer), `${s.id}: gültige Nummer`);
    assert.ok(s.situation?.length >= 15, `${s.id}: Situation`);
    assert.ok(s.warum?.length >= 20, `${s.id}: Warum`);
    assert.ok(s.emoji?.length >= 1, `${s.id}: Emoji`);
  }
  // beide Nummern kommen vor
  const nummern = new Set(situationen.map((s) => s.nummer));
  assert.ok(nummern.has('112') && nummern.has('110'), 'sonst lernt das Kind nur eine Nummer');
  assert.ok(Array.isArray(daten.notrufSchritte) && daten.notrufSchritte.length >= 4, 'Notruf-Schritte');
  assert.equal(daten.nummern['112'], 'Feuerwehr und Rettungsdienst');
  assert.equal(daten.nummern['110'], 'Polizei');
});

test('nurZiffern: säubert Eingaben', () => {
  assert.equal(nurZiffern('1 1 2'), '112');
  assert.equal(nurZiffern('11a2'), '112');
  assert.equal(nurZiffern(''), '');
});

test('istNotrufnummer', () => {
  assert.equal(istNotrufnummer('112'), true);
  assert.equal(istNotrufnummer('110'), true);
  assert.equal(istNotrufnummer('911'), false);
  assert.equal(istNotrufnummer('11'), false);
});

test('pruefeAnruf: ok / andere Notrufnummer / keine', () => {
  const a = pruefeAnruf('112', '112');
  assert.equal(a.ok, true);
  assert.equal(a.istNotruf, true);
  assert.equal(a.andereNotruf, false);

  const b = pruefeAnruf('110', '112');
  assert.equal(b.ok, false);
  assert.equal(b.andereNotruf, true);

  const c = pruefeAnruf('123', '112');
  assert.equal(c.ok, false);
  assert.equal(c.istNotruf, false);
});

test('rueckmeldung: passende Texte', () => {
  assert.match(rueckmeldung('112', '112', daten.nummern), /Richtig/);
  assert.match(rueckmeldung('110', '112', daten.nummern), /Fast/);
  assert.match(rueckmeldung('999', '112', daten.nummern), /keine Notrufnummer/);
});

test('Kinder werden nicht bewertet: keine Runden-Auswertung, kein Zaehler, kein Rekord im App-Code', () => {
  assert.equal(logik.bewerteRunde, undefined, 'logik.mjs zaehlt keine richtigen Wahlen mehr');
  const ohneMigration = appQuelle.replace(MIGRATION, '');
  assert.doesNotMatch(ohneMigration, /bewerteRunde|rekord|punkte|\brang\b|raenge|eingaben|richtig,? gesamt|gesamt\b/i, 'app.mjs fuehrt weder Zaehler noch Rang noch Rekord; nur die Migrationszeile nennt den alten Schluessel');
  assert.doesNotMatch(appQuelle, /richtig gewählt`|von \$\{gesamt\}/, 'kein Ergebnissatz "N von M richtig gewaehlt"');
  assert.doesNotMatch(appQuelle, /Geschafft|🏆|🏅|🌟|⭐/, 'kein Titel Geschafft, kein Pokal, keine Medaille, kein Stern');
  assert.match(appQuelle, /'Richtig gewählt!'/, 'die Rueckmeldung zu jeder Antwort bleibt');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Loeschknopf; nur der alte Schluessel wird einmal entfernt', () => {
  assert.doesNotMatch(appQuelle, /setItem|getItem|datenKarte|daten-karte|sprache\.mjs/, 'kein Speicher, keine Loeschkarte, keine Sprachwahl');
  assert.doesNotMatch(appQuelle, /Meine Daten l(ö|oe)schen/, 'ohne Speicher keine Karte');
  assert.match(appQuelle, MIGRATION, 'der alte Rekord-Schluessel wird beim Start in einer eigenen Zeile entfernt');
  assert.match(elternSeite, /speichert <strong>nichts<\/strong>/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten l(ö|oe)schen/, 'ohne Speicher keine Karte');
});
