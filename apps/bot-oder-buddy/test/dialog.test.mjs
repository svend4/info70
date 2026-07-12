import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { TRICK_IDS, trickVorkommen, nachrichtenMitTrick, angebote, bewerteZuordnung, bewertung } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/dialog.json', import.meta.url), 'utf8'));
const appQuelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Dialogbank: Grundstruktur, Bot-Name, 5 Tricks, 12-15 Nachrichten, eindeutige IDs', () => {
  assert.equal(daten.version, 1);
  assert.ok(daten.botName?.length >= 2, 'Bot braucht einen Namen');
  assert.equal(daten.tricks.length, 5, 'genau 5 Simulations-Tricks');
  assert.deepEqual(new Set(daten.tricks.map((t) => t.id)), new Set(TRICK_IDS), 'Trick-IDs muessen den festen 5 entsprechen');
  for (const t of daten.tricks) {
    assert.ok(t.name?.length >= 5, `${t.id}: Trick-Name fehlt`);
    assert.ok(t.kurz?.length >= 10, `${t.id}: Kurzbeschreibung fehlt`);
    assert.ok(t.erklaerung?.length >= 60, `${t.id}: Erklaerung fehlt/zu kurz (dort passiert das Lernen!)`);
  }
  assert.ok(daten.dialog.length >= 12 && daten.dialog.length <= 15, `12-15 Bot-Nachrichten, nicht ${daten.dialog.length}`);
  const ids = daten.dialog.map((n) => n.id);
  assert.equal(new Set(ids).size, ids.length, 'Nachrichten-IDs eindeutig');
});

test('jede Nachricht: Bot-Text, gueltiger Trick, Hinweis bei Trick, 1-3 feste Antwort-Knoepfe', () => {
  for (const n of daten.dialog) {
    assert.ok(n.bot?.length >= 15, `${n.id}: Bot-Text fehlt/zu kurz`);
    assert.ok(n.trick === null || TRICK_IDS.includes(n.trick), `${n.id}: unbekannter Trick "${n.trick}"`);
    if (n.trick !== null) {
      assert.ok(n.hinweis?.length >= 40, `${n.id}: Trick-Nachricht braucht Hinweis >= 40 Zeichen`);
    }
    assert.ok(Array.isArray(n.antworten) && n.antworten.length >= 1 && n.antworten.length <= 3, `${n.id}: 1-3 Antworten`);
    for (const a of n.antworten) {
      assert.ok(a.text?.length >= 3, `${n.id}: Antworttext fehlt`);
    }
  }
});

test('jeder der 5 Simulations-Tricks kommt mindestens 2x im Dialog vor', () => {
  const vorkommen = trickVorkommen(daten.dialog);
  for (const id of TRICK_IDS) {
    assert.ok(vorkommen[id] >= 2, `Trick "${id}" kommt nur ${vorkommen[id]}x vor (mindestens 2x)`);
  }
  assert.equal(
    nachrichtenMitTrick(daten.dialog).length,
    Object.values(vorkommen).reduce((summe, n) => summe + n, 0),
  );
});

test('Bot-Angebote: mindestens 2, je genau ein Annehmen und ein Ablehnen mit lehrreichem Feedback', () => {
  const alleAngebote = angebote(daten.dialog);
  assert.ok(alleAngebote.length >= 2, 'mindestens 2 Angebote zum Annehmen/Ablehnen');
  for (const n of alleAngebote) {
    const arten = n.antworten.map((a) => a.art).sort();
    assert.deepEqual(arten, ['ablehnen', 'annehmen'], `${n.id}: genau ein Annehmen + ein Ablehnen`);
    for (const a of n.antworten) {
      assert.ok(a.feedback?.length >= 40, `${n.id}: Feedback fuer "${a.art}" fehlt/zu kurz`);
    }
  }
});

test('Logik: bewerteZuordnung unterscheidet richtig/falsch/harmlos, bewertung stuft sinnvoll', () => {
  const mitTrick = { trick: 'spiegeln' };
  assert.deepEqual(bewerteZuordnung(mitTrick, 'spiegeln'), { hatTrick: true, richtig: true, tatsaechlich: 'spiegeln' });
  assert.deepEqual(bewerteZuordnung(mitTrick, 'koeder'), { hatTrick: true, richtig: false, tatsaechlich: 'spiegeln' });
  assert.deepEqual(bewerteZuordnung({ trick: null }, 'fragen'), { hatTrick: false, richtig: false, tatsaechlich: null });

  const max = nachrichtenMitTrick(daten.dialog).length;
  assert.ok(bewertung(max, max).titel.length >= 3);
  assert.notEqual(bewertung(max, max).titel, bewertung(0, max).titel, 'Bestwert und Nullwert brauchen verschiedene Raenge');
});

test('kein offenes Eingabefeld und keine Speicherung im App-Code', () => {
  const verboten = [
    '<input', '<textarea',
    "el('input'", 'el("input"', "el('textarea'", 'el("textarea"',
    "createElement('input')", 'createElement("input")',
    "createElement('textarea')", 'createElement("textarea")',
    'contenteditable',
    'localStorage', 'sessionStorage', 'indexedDB', 'document.cookie',
  ];
  for (const muster of verboten) {
    assert.ok(!appQuelle.includes(muster), `app.mjs darf "${muster}" nicht enthalten (kein offener Chat, keine Speicherung)`);
  }
});
