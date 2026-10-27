import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import { rueckmeldungFuer } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/szenarien.json', import.meta.url), 'utf8'));
const szenarien = daten.szenarien;
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const elternSeite = await readFile(new URL('../eltern.html', import.meta.url), 'utf8');

function saetze(text) {
  return text.split(/[.!?]+/).map((t) => t.trim()).filter(Boolean);
}

test('Grundstruktur: Version, ≥12 Szenen, eindeutige IDs, keine Ränge in den Daten', () => {
  assert.equal(daten.version, 1);
  assert.ok(szenarien.length >= 12, `mindestens 12 Szenen (ist: ${szenarien.length})`);
  const ids = szenarien.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'IDs eindeutig');
  assert.ok(!('raenge' in daten), 'die Daten haben keine Ränge');
});

test('jede Szene: genau 3 Optionen, genau EINE mit Wert 2, Werte 0/1/2', () => {
  for (const s of szenarien) {
    assert.ok(s.emoji?.length >= 1, `${s.id}: Emoji`);
    assert.ok(s.situation?.length >= 15, `${s.id}: Situation`);
    assert.ok(s.frage?.length >= 3, `${s.id}: Frage`);
    assert.ok(s.erklaerung?.length >= 30, `${s.id}: Erklärung (dort passiert das Lernen)`);
    assert.ok(Array.isArray(s.optionen) && s.optionen.length === 3, `${s.id}: genau 3 Optionen`);
    for (const o of s.optionen) {
      assert.ok(o.text?.length >= 5, `${s.id}: Optionstext`);
      assert.ok([0, 1, 2].includes(o.wert), `${s.id}: Wert 0/1/2`);
    }
    assert.equal(s.optionen.filter((o) => o.wert === 2).length, 1, `${s.id}: genau EINE beste Option`);
    assert.ok(s.optionen.some((o) => o.wert === 0), `${s.id}: eine unsichere Option`);
  }
});

test('inhaltliche Abdeckung: Straße, Fremde, Feuer/Notruf 112/110, Gift, Tiere', () => {
  const alles = JSON.stringify(szenarien).toLowerCase();
  assert.match(alles, /ampel|zebrastreifen|straße/, 'Verkehr');
  assert.match(alles, /fremd/, 'fremde Personen');
  assert.match(alles, /112/, 'Notruf 112');
  assert.match(alles, /110/, 'Notruf 110');
  assert.match(alles, /tablette|medikament|giftig/, 'Gift/Medikamente');
  assert.match(alles, /hund/, 'fremde Tiere');
});

test('einfache Sprache: kein Satz länger als 120 Zeichen', () => {
  for (const s of szenarien) {
    const texte = [s.situation, s.frage, s.erklaerung, ...s.optionen.map((o) => o.text)];
    for (const t of texte) for (const satz of saetze(t)) {
      assert.ok(satz.length <= 120, `${s.id}: Satz zu lang (${satz.length}): "${satz}"`);
    }
  }
});

test('Rückmeldung zu jeder Antwort: Titel und Emoji je Option, nur die beste färbt den Hinweis', () => {
  assert.deepEqual(rueckmeldungFuer({ wert: 2 }), { gut: true, emoji: '😊', titel: 'Genau richtig!' });
  assert.equal(rueckmeldungFuer({ wert: 1 }).titel, 'Fast!');
  assert.equal(rueckmeldungFuer({ wert: 1 }).gut, false);
  assert.equal(rueckmeldungFuer({ wert: 0 }).titel, 'Denk nochmal mit.');
  assert.equal(rueckmeldungFuer(undefined).titel, 'Denk nochmal mit.', 'ohne Option die neutrale Rückfrage');
  for (const s of szenarien) for (const o of s.optionen) {
    assert.ok(rueckmeldungFuer(o).titel.length >= 3, `${s.id}: Rückmeldung`);
    assert.ok(s.erklaerung.length >= 30, `${s.id}: Erklärung zu jeder Antwort`);
  }
});

test('Kinder werden nicht bewertet: keine Rang-, Punkte- oder Ergebnis-Funktion, kein Zähler, kein Rekord im App-Code', () => {
  for (const name of ['punkteFuer', 'maxPunkte', 'rangFuer', 'ergebnisSatz']) {
    assert.equal(logik[name], undefined, `logik.mjs hat kein ${name} mehr`);
  }
  assert.doesNotMatch(appQuelle, /punkte|maxPunkte|rangFuer|ergebnisSatz|raenge|rang\b|🌟|🏆|🏅/i, 'app.mjs führt weder Zähler noch Rang noch Stern');
  assert.match(appQuelle, /Situation \$\{index \+ 1\} von \$\{szenarien\.length\}/, 'der Fortschritt der Runde („Situation n von m“) bleibt');
  assert.doesNotMatch(appQuelle.slice(appQuelle.indexOf('function ende()')), /\$\{/, 'am Ende steht kein berechneter Wert');
  assert.doesNotMatch(appQuelle, /Geschafft/, 'kein „Geschafft“ als Titel');
  assert.match(appQuelle, /Ende der Runde/, 'das Ende der Runde ist neutral benannt');
});

test('Speicherregel: die App speichert nichts, darum keine Karte und kein Löschknopf; der alte Schlüssel wird einmal entfernt', () => {
  assert.doesNotMatch(appQuelle, /setItem|getItem|datenKarte|daten-karte|sprache\.mjs/, 'kein Speicher, keine Löschkarte, keine Sprachwahl');
  assert.doesNotMatch(appQuelle, /Meine Daten l(ö|oe)schen/, 'ohne Speicher keine Karte');
  assert.match(appQuelle, /^try \{ localStorage\.removeItem\('sicher\.rekord'\); \} catch \{\}$/m, 'der alte Rekord-Schlüssel wird beim Start in einer Zeile entfernt');
  assert.equal((appQuelle.match(/sicher\.rekord/g) ?? []).length, 1, 'der alte Schlüssel steht nur in dieser Zeile');
  assert.match(elternSeite, /speichert nichts/, 'die Eltern-Seite sagt, dass nichts gespeichert wird');
  assert.doesNotMatch(elternSeite, /Meine Daten l(ö|oe)schen/, 'ohne Speicher keine Karte');
});
