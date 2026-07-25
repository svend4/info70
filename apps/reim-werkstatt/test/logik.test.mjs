import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  letztesWort, reimtSich, familieVon, reimpartner,
  baueRaetsel, baueQuatsch, quatschVielfalt, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/reime.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const erster = (liste) => liste[0];
const ohneMischen = (liste) => [...liste];

test('Reimdaten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.familien.length >= 10);
  assert.ok(quatschVielfalt(daten) >= 12);
});

test('letztesWort schneidet Satzzeichen ab, auch bei Ausrufe- und Fragezeichen', () => {
  assert.equal(letztesWort('sitzt am Abend gern am Tisch.'), 'Tisch');
  assert.equal(letztesWort('Jetzt komm ich raus!'), 'raus');
  assert.equal(letztesWort('Wir bauen Burgen, weißt du wo?'), 'wo');
  assert.equal(letztesWort('gute Nacht'), 'Nacht');
  assert.equal(letztesWort('   '), '');
});

test('reimtSich prüft die Endung unabhängig von Groß- und Kleinschreibung', () => {
  assert.equal(reimtSich('Haus', 'aus'), true);
  assert.equal(reimtSich('raus', 'aus'), true);
  assert.equal(reimtSich('Winterwonne', 'onne'), true, 'zusammengesetzte Wörter zählen mit');
  assert.equal(reimtSich('Platz', 'atze'), false, 'Platz reimt sich nicht auf Katze');
  assert.equal(reimtSich('Baum', 'aus'), false);
});

test('jedes Wort jeder Familie reimt sich wirklich – daran hängt der ganze Nutzen', () => {
  for (const f of daten.familien) {
    for (const w of f.woerter) {
      assert.ok(reimtSich(w, f.endung), `${f.id}: „${w}“ endet nicht auf „-${f.endung}“`);
    }
  }
  // und der Validator merkt es, wenn eines nicht passt
  const falsch = kopie();
  falsch.familien.find((f) => f.id === 'atze').woerter.push('Platz');
  assert.ok(pruefeDaten(falsch).some((f) => /reimt sich nicht/.test(f)));
});

test('Reimrätsel: erste Zeile gibt den Reim vor, die Lösung steht nirgends im Text', () => {
  for (const r of daten.raetsel) {
    const f = familieVon(daten, r.familie);
    const vorbild = letztesWort(r.zeile1);
    assert.ok(reimtSich(vorbild, f.endung), `${r.id}: erste Zeile endet auf „${vorbild}“ – kein Reimvorbild`);
    assert.notEqual(vorbild.toLowerCase(), r.loesung.toLowerCase(), `${r.id}: erste Zeile nennt die Lösung`);
    assert.ok(f.woerter.includes(r.loesung), `${r.id}: Lösung nicht in der Familie`);
    assert.ok(
      !`${r.zeile1} ${r.zeile2Vor}`.toLowerCase().includes(r.loesung.toLowerCase()),
      `${r.id}: die Lösung steht schon im Text – es gibt nichts zu raten`,
    );
    for (const a of r.ablenker) {
      assert.ok(!reimtSich(a, f.endung), `${r.id}: Ablenker „${a}“ reimt sich auch`);
    }
  }
});

test('Validator greift bei den vier Rätsel-Fehlern, die den Sinn zerstören', () => {
  const ohneVorbild = kopie();
  ohneVorbild.raetsel[0].zeile1 = 'Es wohnt ein kleines graues Tier';
  assert.ok(pruefeDaten(ohneVorbild).some((f) => /gibt keinen Reim vor/.test(f)));

  const loesungVerraten = kopie();
  loesungVerraten.raetsel[0].zeile2Vor = 'ganz still in ihrem Haus, nämlich im';
  assert.ok(pruefeDaten(loesungVerraten).some((f) => /Lösung steht schon im Text/.test(f)));

  const zweiRichtige = kopie();
  zweiRichtige.raetsel[0].ablenker[0] = 'Klaus';
  assert.ok(pruefeDaten(zweiRichtige).some((f) => /zwei richtige Antworten/.test(f)));

  const fremdeLoesung = kopie();
  fremdeLoesung.raetsel[0].loesung = 'Baum';
  assert.ok(pruefeDaten(fremdeLoesung).some((f) => /gehört nicht zur Familie/.test(f)));
});

test('Quatschreime: jede Reimzeile endet wirklich auf die Endung der Familie', () => {
  for (const q of daten.quatschRahmen) {
    const f = familieVon(daten, q.familie);
    for (const e of q.endungen) {
      assert.ok(reimtSich(letztesWort(e), f.endung), `${q.id}: „${letztesWort(e)}“ reimt sich nicht`);
    }
  }
  const kaputt = kopie();
  kaputt.quatschRahmen[0].endungen[0] = 'und geht dann in den Garten.';
  assert.ok(pruefeDaten(kaputt).some((f) => /reimt sich nicht auf/.test(f)));
});

test('baueRaetsel und baueQuatsch wiederholen sich nicht und bleiben lösbar', () => {
  const erstes = baueRaetsel(daten, erster, ohneMischen);
  const zweites = baueRaetsel(daten, erster, ohneMischen, erstes);
  assert.notEqual(erstes.raetsel.id, zweites.raetsel.id);
  let vorher = null;
  for (let i = 0; i < 200; i++) {
    const r = baueRaetsel(daten, (l) => l[Math.floor(Math.random() * l.length)], (l) => [...l].reverse(), vorher);
    assert.equal(r.optionen.length, 3);
    assert.ok(r.optionen.includes(r.raetsel.loesung), 'Lösung fehlt unter den Optionen');
    assert.equal(new Set(r.optionen).size, 3, 'doppelte Option');
    assert.equal(r.familie.id, r.raetsel.familie);
    if (vorher) assert.notEqual(vorher.raetsel.id, r.raetsel.id);
    vorher = r;
  }
  let vorherQ = null;
  for (let i = 0; i < 100; i++) {
    const q = baueQuatsch(daten, (l) => l[Math.floor(Math.random() * l.length)], vorherQ);
    assert.ok(q.rahmen.endungen.includes(q.endung));
    assert.equal(q.familie.id, q.rahmen.familie);
    if (vorherQ) assert.notEqual(vorherQ.rahmen.id, q.rahmen.id);
    vorherQ = q;
  }
});

test('reimpartner findet die Familie zu einem Wort und lässt das Wort selbst weg', () => {
  const r = reimpartner(daten, 'Maus');
  assert.equal(r.familie.id, 'aus');
  assert.ok(!r.partner.includes('Maus'));
  assert.ok(r.partner.includes('Haus'));
  assert.equal(reimpartner(daten, 'maus').familie.id, 'aus', 'Groß- und Kleinschreibung egal');
  assert.equal(reimpartner(daten, 'Elefant'), null);
});

test('Herkunft erklärt: keine erfundenen Wörter', () => {
  assert.match(daten.hinweis, /Eigenproduktion/);
  assert.match(daten.hinweis, /keine Wörter erfunden/);
  // Alle Reimwörter bestehen aus normalen Buchstaben – keine Fantasieketten
  for (const f of daten.familien) {
    for (const w of f.woerter) assert.match(w, /^[A-Za-zÄÖÜäöüß]{3,14}$/u, `verdächtiges Wort: ${w}`);
  }
});
