import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  saetzeTeilen, woerter, wortLaenge, langeSaetze, langeWoerter,
  passivSignale, nominalstil, fremdwoerter, analysiere, bericht,
} from '../logik.mjs';

const regeln = JSON.parse(await readFile(new URL('../daten/regeln.json', import.meta.url), 'utf8'));

test('Regeln-Datei: Grenzwerte, Suffixe, Fremdwortliste, Hinweistexte', () => {
  assert.ok(regeln.grenzwerte.satzWoerterMax >= 8 && regeln.grenzwerte.satzWoerterMax <= 15);
  assert.ok(regeln.grenzwerte.wortZeichenMax >= 10);
  assert.ok(regeln.nominalSuffixe.includes('ung'));
  assert.ok(regeln.fremdwoerter.length >= 15, 'genügend Fremdwörter');
  for (const f of regeln.fremdwoerter) {
    assert.ok(f.wort && f.einfach, 'Fremdwort mit einfacher Alternative');
  }
  assert.match(regeln.quelle, /DIN SPEC 33429|Leichte/i);
});

test('saetzeTeilen: trennt an .!? und Zeilenumbruch', () => {
  assert.deepEqual(saetzeTeilen('Hallo Welt. Wie geht es dir? Gut!'), ['Hallo Welt.', 'Wie geht es dir?', 'Gut!']);
  assert.deepEqual(saetzeTeilen('Zeile eins\nZeile zwei'), ['Zeile eins', 'Zeile zwei']);
  assert.deepEqual(saetzeTeilen('   '), []);
});

test('woerter + wortLaenge', () => {
  assert.equal(woerter('Der Bus-Fahrplan ist da.').length, 4);
  assert.equal(wortLaenge('Bus-Fahrplan'), 8); // längster Teil „Fahrplan“
  assert.equal(wortLaenge('Donaudampfschiff'), 16);
});

test('langeSaetze: nur Sätze über der Wortgrenze', () => {
  const max = regeln.grenzwerte.satzWoerterMax;
  const kurz = 'Das ist kurz.';
  const lang = 'Dieser Satz hat absichtlich sehr viele Wörter und wird deutlich länger als die erlaubte Grenze für gute Lesbarkeit sein.';
  const treffer = langeSaetze(`${kurz} ${lang}`, max);
  assert.equal(treffer.length, 1);
  assert.ok(treffer[0].anzahl > max);
});

test('langeWoerter: dedupliziert, misst längsten Bindestrich-Teil', () => {
  const treffer = langeWoerter('Datenschutzerklärung Datenschutzerklärung Haus Bus-Fahrplan', 12);
  const woerterListe = treffer.map((t) => t.wort);
  assert.ok(woerterListe.includes('Datenschutzerklärung'));
  assert.equal(woerterListe.filter((w) => w === 'Datenschutzerklärung').length, 1, 'dedupliziert');
  assert.ok(!woerterListe.includes('Haus'), 'kurzes Wort nicht');
  assert.ok(!woerterListe.includes('Bus-Fahrplan'), 'getrenntes Wort ist ok');
});

test('passivSignale: erkennt werden-Formen satzweise', () => {
  const t = passivSignale('Das Passwort wird gespeichert. Wir löschen die Daten.');
  assert.equal(t.length, 1);
  assert.equal(t[0].signal, 'wird');
  assert.equal(passivSignale('Wir machen alles selbst.').length, 0);
});

test('nominalstil: großgeschriebene Substantive mit Suffix', () => {
  const t = nominalstil('Die Speicherung und die Prüfung sind wichtig. gehen laufen', regeln.nominalSuffixe);
  assert.ok(t.includes('Speicherung'));
  assert.ok(t.includes('Prüfung'));
  assert.ok(!t.includes('gehen'), 'Verben nicht');
});

test('fremdwoerter: findet Listeneinträge auch flektiert', () => {
  const t = fremdwoerter('Bitte akzeptieren Sie die Cookies und die Informationen.', regeln.fremdwoerter);
  const woerterListe = t.map((e) => e.wort);
  assert.ok(woerterListe.includes('Cookie') || woerterListe.includes('Cookies'.replace('s', '')));
  assert.ok(woerterListe.includes('Information'), 'Information über „Informationen“');
  assert.ok(woerterListe.includes('akzeptieren'));
});

test('analysiere: leerer Text -> grau/leer', () => {
  const a = analysiere('   ', regeln);
  assert.equal(a.leer, true);
  assert.equal(a.ampel, 'grau');
  assert.equal(a.kennzahlen.saetze, 0);
});

test('analysiere: guter Text -> grün, wenige/keine Treffer', () => {
  const a = analysiere('Wir helfen dir. Das ist leicht. Du bist sicher.', regeln);
  assert.equal(a.leer, false);
  assert.equal(a.ampel, 'gruen');
  assert.equal(a.kennzahlen.saetze, 3);
  assert.equal(a.hinweise.length, 0);
});

test('analysiere: schwerer Text -> rot, mehrere Hinweise', () => {
  const text = 'Nach erfolgreicher Registrierung wird die Datenschutzerklärung automatisch akzeptiert und die Speicherung Ihrer personenbezogenen Informationen für die weitere Verarbeitung dauerhaft aktiviert.';
  const a = analysiere(text, regeln);
  assert.equal(a.ampel, 'rot');
  assert.ok(a.hinweise.length >= 3, 'mehrere Regel-Hinweise');
  const regelnGetroffen = a.hinweise.map((h) => h.regel);
  assert.ok(regelnGetroffen.includes('passiv'));
  assert.ok(regelnGetroffen.includes('nominalstil') || regelnGetroffen.includes('langeWoerter'));
});

test('bericht: Kopf, Ergebnis, Hinweise, Blöcke', () => {
  const text = 'Das Passwort wird gespeichert. Bitte akzeptieren Sie die Cookies.';
  const b = bericht(text, regeln);
  assert.match(b, /Leichte-Sprache-Prüfhilfe – Bericht/);
  assert.match(b, /Ergebnis:/);
  assert.match(b, /Passiv-Signale/);
  assert.match(b, /Fremdwörter/);
  assert.match(b, /regelbasierte Hilfe/);
  // leerer Text
  assert.match(bericht('', regeln), /kein Text/);
});
