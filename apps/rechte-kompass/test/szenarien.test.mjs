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

test('jedes Szenario: 2/1/0-Muster mit genau einem stärksten Zug und einer Falle', () => {
  for (const s of daten.szenarien) {
    assert.ok(s.situation?.length >= 30, `${s.id}: Situation fehlt/zu kurz`);
    assert.ok(s.erklaerung?.length >= 80, `${s.id}: Erklärung zu kurz (dort passiert das Lernen!)`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    const werte = s.optionen.map((o) => o.wert).sort();
    assert.deepEqual(werte, [0, 1, 2], `${s.id}: Werte müssen genau 0, 1 und 2 sein`);
    for (const o of s.optionen) assert.ok(o.text?.length >= 10, `${s.id}: Optionstext fehlt`);
  }
});

test('Kern-Idee: jedes Szenario nennt KRK-Artikel und schenkt einen Mut-Satz', () => {
  for (const s of daten.szenarien) {
    assert.ok(Number.isInteger(s.artikel) && s.artikel >= 1 && s.artikel <= 54, `${s.id}: KRK hat Artikel 1-54`);
    assert.ok(s.artikelName?.length >= 10, `${s.id}: Artikel braucht einen verständlichen Namen`);
    assert.ok(s.satz?.length >= 15, `${s.id}: Mut-Satz fehlt`);
    assert.ok(!/verklagen|Anwalt|Polizei/.test(s.satz), `${s.id}: Mut-Satz ist Selbstvertretung, keine Drohung`);
  }
});

test('Artikel-Breite: mehrere Rechte, Pflichtartikel 12 (Gehör), 16 (Privatsphäre), 31 (Spiel)', () => {
  const artikel = new Set(daten.szenarien.map((s) => s.artikel));
  assert.ok(artikel.size >= 5, `mindestens 5 verschiedene KRK-Artikel (ist: ${artikel.size})`);
  for (const pflicht of [12, 16, 31]) assert.ok(artikel.has(pflicht), `Artikel ${pflicht} fehlt`);
});

test('Didaktik: Rechte gegen NAHE Menschen (Eltern/Familie) UND Institutionen; Hilfe 116 111', () => {
  const alles = JSON.stringify(daten.szenarien);
  assert.ok(/Mama|Papa|Eltern|Bruder|Schwester/.test(alles), 'auch Familien-Situationen (schwerster Fall!)');
  assert.ok(/Schule|Rathaus|Gericht|Ärztin|Arzt/.test(alles), 'auch Institutionen-Situationen');
  assert.ok(/Sharenting/.test(alles), 'Sharenting benannt (Gefährdungsatlas)');
  assert.ok(appQuelle.includes('116 111'), 'Hilfeadresse in der App');
});

test('Kinder werden nicht bewertet: kein Zähler, kein Rang, kein Rekord, kein Ergebnissatz im App-Code', () => {
  assert.doesNotMatch(appQuelle, /\bpunkte\b|maxPunkte|\brang\b|raenge|REKORD_SCHLUESSEL|Dein Rekord|Rekord:/, 'weder Punkte noch Rang noch Rekord');
  assert.doesNotMatch(appQuelle, /Kompass-Punkten|Geschafft|Zum Ergebnis/, 'kein Ergebnissatz am Ende');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende heißt neutral „Ende der Runde“');
  // 2/1/0 bleibt die Rückmeldung zu jeder Antwort, es wird aber nichts addiert.
  assert.doesNotMatch(appQuelle, /\+=\s*option\.wert/, 'die Werte der Optionen werden nicht summiert');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Löschknopf; der alte Schlüssel wird einmal entfernt', () => {
  assert.doesNotMatch(appQuelle, /setItem|getItem|datenKarte|loescheDaten|daten-karte|sprache\.mjs/, 'kein Speicher, keine Löschkarte, keine Sprachwahl');
  const zeilen = appQuelle.split('\n').filter((z) => z.includes('removeItem'));
  assert.deepEqual(zeilen, ["try { localStorage.removeItem('rk.rekord'); } catch {}"], 'genau eine Zeile: der alte Schlüssel, als Literal');
  assert.doesNotMatch(appQuelle, /Meine Daten löschen/, 'ohne Speicher keine Karte');
  assert.match(elternSeite, /speichert nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten löschen/, 'ohne Speicher keine Karte');
});
