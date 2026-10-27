import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');

test('Szenarienbank: Grundstruktur, IDs, keine Ränge', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.szenarien.length >= 10, 'mindestens 10 Szenarien');
  const ids = daten.szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(!('raenge' in daten), 'die Daten haben keine Ränge: das Kind wird nicht bewertet');
});

test('jedes Szenario: Situation, Erklärung, genau ein stärkster Zug (wert 2), eine Falle (wert 0)', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 20, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(s.erklaerung?.length >= 40, `${s.id}: Erklärung fehlt/zu kurz (dort passiert das Lernen!)`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    for (const o of s.optionen) {
      assert.ok(o.text?.length >= 5, `${s.id}: Optionstext fehlt`);
      assert.ok([0, 1, 2].includes(o.wert), `${s.id}: wert muss 0, 1 oder 2 sein`);
    }
    const werte = s.optionen.map((o) => o.wert);
    assert.equal(werte.filter((w) => w === 2).length, 1, `${s.id}: genau EIN stärkster Zug`);
    assert.ok(werte.includes(0), `${s.id}: mindestens eine Option, die es schlimmer macht`);
  }
});

test('Chat-Rechte-Pack (Katalog Nr. 138): Chat-Situationen als Rechtsfragen', () => {
  assert.ok(daten.szenarien.length >= 16, 'Rechte-Pack ergänzt (mindestens 16 Szenarien)');
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/Artikel 13|Meinungsfreiheit/.test(alles), 'Meinung sagen ist Art. 13 – beleidigen nicht');
  assert.ok(/DSA|digitale Dienste/.test(alles), 'Melden als Recht (DSA Art. 16/20)');
  assert.ok(/kein Petzen/.test(alles), 'Melden ist kein Petzen');
  assert.ok(/Artikel 12|gehört zu werden|gehört werden/.test(alles), 'Recht auf Gehört-werden (Art. 12)');
  assert.ok(/Hassrede/.test(alles), 'Hassrede als meldbarer Fall');
});

test('Game-Chat-Training-Pack (Katalog Nr. 238): Szenarien aus Spiele-Chats', () => {
  assert.ok(daten.szenarien.length >= 28, 'Game-Chat-Pack ergänzt (mindestens 28 Szenarien)');
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/Voice-Chat|Spiele-Chat|Game-Chat|Mitspieler|Team/i.test(alles), 'Spiele-Chat-Kontext');
  assert.ok(/stummschalten|nur Freunde|blockier/i.test(alles), 'Chat-Einstellungen als Selbstschutz');
  assert.ok(/echten Namen|Spitznamen|wo du wohnst/i.test(alles), 'keine echten Daten an Fremde');
  assert.ok(/Kaufdruck|teuren Skin|Kaufdruck|Skin/i.test(alles), 'Team-/Kaufdruck');
});

test('Stopp-Hassrede-Pack (Katalog Nr. 237): Zeugen-Szenarien zu Hasskommentaren', () => {
  assert.ok(daten.szenarien.length >= 22, 'Hassrede-Pack ergänzt (mindestens 22 Szenarien)');
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/Hasskommentar|Hassrede|angefeindet|anfeind/i.test(alles), 'Hasskommentare thematisiert');
  assert.ok(/Hautfarbe|Religion|solche Leute/i.test(alles), 'gruppenbezogene Anfeindung');
  assert.ok(/beistehen|beistand|auf deiner Seite|zuhören/i.test(alles), 'Betroffene stärken');
  assert.ok(/Melde-Knopf|melden|Melde-\/Blockier/i.test(alles), 'kindgerecht erklärte Meldewege');
});

test('didaktische Schwerpunkte: Melden, Beweise sichern, Hilfe holen (116 111) kommen vor', () => {
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/melde/i.test(alles), 'Melde-Funktion muss vorkommen');
  assert.ok(/screenshot|beweis/i.test(alles), 'Beweise sichern muss vorkommen');
  assert.ok(alles.includes('116 111'), 'Nummer gegen Kummer muss vorkommen');
  assert.ok(/blockier/i.test(alles), 'Blockieren muss vorkommen');
});

test('Kinder werden nicht bewertet: kein Zähler, kein Rang, kein Rekord, kein Ergebnissatz im App-Code', () => {
  assert.doesNotMatch(appQuelle, /\bpunkte\b|maxPunkte|\brang\b|raenge|REKORD_SCHLUESSEL|Dein Rekord|Rekord:/, 'weder Punkte noch Rang noch Rekord');
  assert.doesNotMatch(appQuelle, /Mut-Punkten|Geschafft|Zum Ergebnis/, 'kein Ergebnissatz am Ende');
  assert.match(appQuelle, /Situation \$\{index \+ 1\} von \$\{szenarien\.length\}/, 'der Fortschritt der Runde („Situation n von m“) bleibt');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende heißt neutral „Ende der Runde“');
  // 2/1/0 bleibt die Rückmeldung zu jeder Antwort, es wird aber nichts addiert.
  assert.doesNotMatch(appQuelle, /\+=\s*option\.wert/, 'die Werte der Optionen werden nicht summiert');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Löschknopf; der alte Schlüssel wird einmal entfernt', () => {
  assert.doesNotMatch(appQuelle, /setItem|getItem|datenKarte|loescheDaten|daten-karte|sprache\.mjs/, 'kein Speicher, keine Löschkarte, keine Sprachwahl');
  const zeilen = appQuelle.split('\n').filter((z) => z.includes('removeItem'));
  assert.deepEqual(zeilen, ["try { localStorage.removeItem('sic.rekord'); } catch {}"], 'genau eine Zeile: der alte Schlüssel, als Literal');
  assert.doesNotMatch(appQuelle, /Meine Daten löschen/, 'ohne Speicher keine Karte');
  assert.match(elternSeite, /speichert nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten löschen/, 'ohne Speicher keine Karte');
});
