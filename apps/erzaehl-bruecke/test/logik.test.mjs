import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pruefeBausteine, waehleElemente, startSatz, baueGeruest } from '../logik.mjs';
import { weilSatz } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/bausteine.json', import.meta.url), 'utf8'));

test('Baustein-Bank gültig: Helden/Orte/Probleme + 4-stufige Treppe', () => {
  assert.deepEqual(pruefeBausteine(daten), []);
  assert.equal(daten.treppe.length, 4);
  const stufenIds = daten.treppe.map((s) => s.id);
  assert.deepEqual(stufenIds, ['anfang', 'los', 'aber', 'ende']);
});

test('Kein Aufnehmen/Speichern: Hinweis nennt das ausdrücklich', () => {
  assert.match(daten.hinweis, /NICHTS.*aufgenommen|kein Mikrofon|erzählt LAUT/i);
});

test('waehleElemente: injizierbarer Wähler liefert Held/Ort/Problem', () => {
  const erste = (l) => l[0];
  const e = waehleElemente(daten, erste);
  assert.equal(e.held, daten.helden[0]);
  assert.equal(e.ort, daten.orte[0]);
  assert.equal(e.problem, daten.probleme[0]);
});

test('startSatz + baueGeruest: Startsatz und 4 Impuls-Stufen', () => {
  const e = { held: 'ein mutiger kleiner Igel', ort: 'in einem tiefen Wald', problem: 'hat etwas verloren' };
  assert.match(startSatz(e), /^Es war einmal ein mutiger kleiner Igel in einem tiefen Wald\./);
  const g = baueGeruest(daten, e);
  assert.equal(g.stufen.length, 4);
  for (const s of g.stufen) assert.ok(s.impuls.length >= 15, `Impuls ${s.id}`);
  assert.match(g.start, /Igel/);
});

test('Vollständigkeit der Impulse: jede Stufe hat Titel und Frage, jede Überraschung endet auf „?“', () => {
  for (const s of daten.treppe) {
    assert.ok(s.titel.trim().length > 0, `Titel ${s.id}`);
    assert.match(s.impuls, /\?/, `Impuls ${s.id} ohne Frage`);
  }
  for (const x of daten.extraImpulse) assert.match(x, /\?$/, `Überraschung ohne Frage: ${x}`);
});

test('Vollständigkeit der Listen: keine leeren und keine doppelten Einträge', () => {
  for (const feld of ['helden', 'orte', 'probleme', 'extraImpulse', 'weilSaetze']) {
    const liste = daten[feld];
    assert.ok(liste.every((t) => t.trim().length > 0), `${feld}: leerer Eintrag`);
    assert.equal(new Set(liste).size, liste.length, `${feld}: doppelter Eintrag`);
  }
});

test('Weil-Satz-Anstöße: jeder endet auf „weil …“, das Kind ergänzt den Grund', () => {
  assert.ok(daten.weilSaetze.length >= 4, 'mindestens vier Anstöße');
  for (const satz of daten.weilSaetze) assert.match(satz, /\bweil …$/, satz);
});

test('weilSatz: zählt die Liste zyklisch durch, ohne Zufall; jeder Anstoß kommt vor', () => {
  const n = daten.weilSaetze.length;
  assert.equal(weilSatz(daten, 0), daten.weilSaetze[0]);
  assert.equal(weilSatz(daten, n), daten.weilSaetze[0]);
  assert.equal(weilSatz(daten, 1 + n), weilSatz(daten, 1));
  const verschieden = new Set(daten.weilSaetze.map((_, i) => weilSatz(daten, i)));
  assert.equal(verschieden.size, n);
});

test('pruefeBausteine: falsche Treppenreihenfolge, fehlende Weil-Sätze und fehlender Hinweis sind Fehler', () => {
  const umgedreht = { ...daten, treppe: [...daten.treppe].reverse() };
  assert.ok(pruefeBausteine(umgedreht).some((f) => /Reihenfolge/.test(f)));
  assert.ok(pruefeBausteine({ ...daten, weilSaetze: [] }).some((f) => /weilSaetze/.test(f)));
  assert.ok(pruefeBausteine({ ...daten, hinweis: 'Hallo.' }).some((f) => /hinweis/i.test(f)));
});

test('pruefeBausteine: der Hinweis muss ausdrücklich sagen, dass nichts aufgenommen wird; „Das Kind erzählt LAUT.“ allein besteht nicht', () => {
  const fehlt = (hinweis) => pruefeBausteine({ ...daten, hinweis }).some((f) => /hinweis/i.test(f));
  assert.equal(fehlt(daten.hinweis), false, 'der Hinweis der Bank muss bestehen');
  assert.equal(fehlt('Das Kind erzählt LAUT.'), true, '„erzählt LAUT“ allein darf nicht bestehen');
  assert.equal(fehlt('Das Kind erzählt LAUT. Kein Mikrofon.'), true, '„Kein Mikrofon“ sagt nicht, dass nichts aufgenommen wird');
  assert.equal(fehlt('Es wird nichts aufgenommen.'), false, 'ein Satz mit „nichts aufgenommen“ besteht');
});
