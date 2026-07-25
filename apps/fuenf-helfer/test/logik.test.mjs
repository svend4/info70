import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PRO_SESSION, helferVon, waehleAufgaben, baueAufgabe, istRichtig, pruefeDaten } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/helfer.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const ohneMischen = (l) => [...l];

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('genau die fünf Sinne, jeder mit Können, Pflege und Mitmach-Idee', () => {
  assert.equal(daten.helfer.length, 5);
  for (const id of ['augen', 'nase', 'ohren', 'zunge', 'haut']) {
    const h = helferVon(daten, id);
    assert.ok(h, `Helfer fehlt: ${id}`);
    assert.ok(h.kann.length >= 40 && h.pflege.length >= 30 && h.spiel.length >= 30, `${id}: Texte zu knapp`);
  }
  assert.equal(helferVon(daten, 'quatsch'), null);
  const vier = kopie();
  vier.helfer.pop();
  assert.ok(pruefeDaten(vier).some((f) => /genau 5 erwartet/.test(f)));
});

test('jeder Helfer kommt mindestens zweimal als Lösung vor – sonst bleibt einer ungeübt', () => {
  for (const h of daten.helfer) {
    const n = daten.aufgaben.filter((a) => a.helfer === h.id).length;
    assert.ok(n >= 2, `${h.id}: nur ${n} Aufgabe`);
  }
  const einseitig = kopie();
  einseitig.aufgaben = einseitig.aufgaben.filter((a) => a.helfer !== 'zunge');
  assert.ok(pruefeDaten(einseitig).some((f) => /Helfer zunge: nur 0 Aufgabe/.test(f)));
});

test('Sitzungsgrenze: höchstens fünf Fragen, ohne Dubletten, mit Rotation', () => {
  assert.ok(PRO_SESSION <= 6, 'für 3-5 muss die Sitzung kurz bleiben');
  const gesehen = new Set();
  for (let i = 0; i < 60; i++) {
    const runde = waehleAufgaben(daten.aufgaben);
    assert.equal(runde.length, PRO_SESSION);
    assert.equal(new Set(runde.map((a) => a.id)).size, PRO_SESSION, 'Frage doppelt in einer Sitzung');
    for (const a of runde) gesehen.add(a.id);
  }
  assert.ok(gesehen.size > PRO_SESSION, 'keine Rotation über mehrere Sitzungen');
});

test('die Auswahl verrät nichts: immer alle fünf Helfer zur Wahl', () => {
  for (const a of daten.aufgaben) {
    const f = baueAufgabe(daten, a, ohneMischen);
    assert.equal(f.optionen.length, 5, `${a.id}: nicht alle Helfer angeboten`);
    assert.deepEqual(f.optionen.map((o) => o.id).sort(), daten.helfer.map((h) => h.id).sort());
    assert.equal(f.loesung.id, a.helfer);
    assert.equal(istRichtig(f, a.helfer), true);
    assert.equal(istRichtig(f, 'quatsch'), false);
  }
});

test('Inklusion: Hilfsmittel werden nie als Mangel beschrieben', () => {
  assert.ok(daten.hilfen.length >= 4);
  for (const h of daten.hilfen) {
    assert.ok(!/kaputt|krank|arm|behindert|leidet/i.test(h.text), `${h.id}: beschreibt einen Mangel`);
    assert.ok(h.text.length >= 50, `${h.id}: Text zu knapp`);
  }
  // Brille, Hörgerät, Gebärdensprache und Langstock gehören dazu
  const ids = daten.hilfen.map((h) => h.id);
  for (const noetig of ['brille', 'hoergeraet', 'gebaerden', 'stock']) {
    assert.ok(ids.includes(noetig), `Hilfe fehlt: ${noetig}`);
  }
  // Gebärdensprache wird als richtige Sprache benannt, nicht als Ersatz
  assert.match(daten.hilfen.find((h) => h.id === 'gebaerden').text, /richtige Sprache/);
  const abwertend = kopie();
  abwertend.hilfen[0].text = 'Manche Augen sind kaputt und brauchen eine Brille.';
  assert.ok(pruefeDaten(abwertend).some((f) => /als Mangel/.test(f)));
});

test('die Regel „fragen statt anstarren“ steht in den Daten', () => {
  assert.match(daten.hilfenRegel, /anstarren/i);
  assert.match(daten.hilfenRegel, /fragen/i);
  // und wer nicht antworten will, darf Nein sagen
  assert.match(daten.hilfenRegel, /Nein sagen/);
  const ohne = kopie();
  ohne.hilfenRegel = 'Alle Menschen sind verschieden.';
  assert.ok(pruefeDaten(ohne).some((f) => /nicht anstarren/.test(f)));
});

test('Sicherheit und Hygiene stehen drin, ohne Angst zu machen', () => {
  const alles = JSON.stringify(daten);
  assert.match(alles, /Hände waschen/);
  assert.match(alles, /Zähne putzen/);
  assert.match(alles, /nie in die Sonne schauen/);
  // Wattestäbchen-Warnung für die Ohren
  assert.match(daten.helfer.find((h) => h.id === 'ohren').pflege, /Wattestäbchen/);
  const text = alles.toLowerCase();
  for (const wort of ['falsch', 'dumm', 'blöd', 'schlimm', 'gefährlich krank', 'stirbst', 'blind wirst', 'taub wirst']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort: ${wort}`);
  }
});

test('jede Aufgabe endet mit einer Frage an die Erwachsenen, die Sitzung endet offline', () => {
  for (const a of daten.aufgaben) {
    assert.ok(a.gespraech.trim().endsWith('?'), `${a.id}: Impuls ist keine Frage`);
    assert.ok(a.erklaerung.length >= 40, `${a.id}: Erklärung zu knapp`);
  }
  assert.ok(daten.schlussIdeen.length >= 3);
  for (const i of daten.schlussIdeen) assert.ok(i.length >= 40, `Schlussidee zu knapp: ${i}`);
});
