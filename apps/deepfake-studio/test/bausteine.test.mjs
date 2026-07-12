import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeBausteine, baueSchlagzeile } from '../studio.mjs';

const roh = await readFile(new URL('../daten/bausteine.json', import.meta.url), 'utf8');
const daten = JSON.parse(roh);

test('Bausteinbank: Schema gültig', () => {
  assert.deepEqual(pruefeBausteine(daten), []);
});

// Politik-Kern dieser App: NUR fiktive Rollen. Kein Baustein darf nach einer
// realen, bekannten Person klingen - die Liste deckt Politik, Sport, Musik,
// Tech und Netz-Prominenz ab und ist bewusst konservativ breit.
test('nur fiktive Rollen: keine bekannten Realnamen-Wörter in der Bausteinbank', () => {
  const realnamen = [
    'merkel', 'scholz', 'merz', 'habeck', 'lindner', 'baerbock', 'steinmeier', 'söder', 'soeder',
    'trump', 'biden', 'obama', 'clinton', 'putin', 'selenskyj', 'zelensky', 'macron', 'erdogan',
    'musk', 'gates', 'bezos', 'zuckerberg', 'jobs', 'altman',
    'ronaldo', 'messi', 'neymar', 'mbappe', 'mbappé', 'haaland', 'musiala', 'wirtz', 'neuer',
    'kroos', 'müller', 'mueller', 'klopp', 'nagelsmann', 'flick', 'beckham', 'bolt', 'djokovic',
    'swift', 'bieber', 'beyonce', 'beyoncé', 'drake', 'eminem', 'rihanna', 'shakira', 'sheeran',
    'gaga', 'apored', 'montanablack', 'gronkh', 'knossi', 'mrbeast', 'kardashian', 'ronaldinho',
  ];
  for (const name of realnamen) {
    const muster = new RegExp(`\\b${name}\\b`, 'iu');
    assert.ok(!muster.test(roh), `Realname "${name}" in bausteine.json gefunden - nur fiktive Rollen erlaubt!`);
  }
});

test('WER-Rollen sind erkennbar fiktiv verankert (Fantasie-Ort oder generische Rolle)', () => {
  for (const b of daten.wer) {
    const generisch = /^(ein|eine|der|die|das)\s/u.test(b.text);
    assert.ok(generisch, `wer "${b.text}" muss mit Artikel beginnen (generische/fiktive Rolle, keine Namensnennung)`);
    assert.ok(!/[A-ZÄÖÜ][a-zäöüß]+ [A-ZÄÖÜ][a-zäöüß]+$/u.test(b.text), `wer "${b.text}" sieht aus wie Vor- und Nachname`);
  }
  assert.ok(daten.wer.some((b) => b.text.includes('Wolkenstadt')), 'mindestens eine Rolle verankert den Fantasie-Ort Wolkenstadt');
});

test('WAS-Taten sind harmlos: keine Gewalt-/Angstwörter', () => {
  const verboten = /tot|umgebracht|gestorben|blut|waffe|entführt|krank|unfall|feuer\b|gestohlen/iu;
  for (const b of daten.was) {
    assert.ok(!verboten.test(b.text), `was "${b.text}" enthält ein Gewalt-/Angstwort`);
  }
});

test('jede WER+WAS-Kombination ergibt eine saubere Schlagzeile', () => {
  for (const wer of daten.wer) {
    for (const was of daten.was) {
      const schlagzeile = baueSchlagzeile(wer.text, was.text);
      assert.match(schlagzeile, /^[A-ZÄÖÜ]/u, `Schlagzeile beginnt groß: ${schlagzeile}`);
      assert.match(schlagzeile, /!$/u, `Schlagzeile endet mit Ausrufezeichen: ${schlagzeile}`);
      assert.ok(!schlagzeile.includes('  '), `keine doppelten Leerzeichen: ${schlagzeile}`);
    }
  }
});
