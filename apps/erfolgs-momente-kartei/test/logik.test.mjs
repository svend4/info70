import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  BEDINGUNGEN, SEITE, ZITAT_LABEL, pruefeKarten, auswahlUmschalten, druckKarten, druckTexte, wortzahl,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/karten.json', import.meta.url), 'utf8'));

// Gegenproben arbeiten mit einer Kopie, die echten Daten bleiben unverändert.
const kopie = () => structuredClone(daten);

test('Daten: 8 Tätigkeitskarten und 1 Quellenkarte, das Set ist gültig', () => {
  assert.equal(daten.karten.length, 8);
  assert.ok(daten.quelle, 'Quellenkarte fehlt');
  assert.deepEqual(pruefeKarten(daten), []);
});

test('Jede Tätigkeitskarte: offene Rolle für alle Kinder und 2 bis 3 Impulsfragen', () => {
  for (const k of daten.karten) {
    assert.match(k.rolle, /Jedes Kind darf/, `${k.id}: Rolle nicht offen`);
    assert.ok(k.impulse.length >= 2 && k.impulse.length <= 3, `${k.id}: ${k.impulse.length} Impulse`);
    for (const i of k.impulse) assert.ok(BEDINGUNGEN.includes(i.bedingung), `${k.id}: ${i.bedingung}`);
  }
});

test('Quelle je Eintrag: Seitenform „S. N“, Seiten 15, 16, 15 in dieser Reihenfolge', () => {
  const seiten = daten.quelle.eintraege.map((e) => e.seite);
  assert.deepEqual(seiten, ['S. 15', 'S. 16', 'S. 15']);
  for (const e of daten.quelle.eintraege) assert.match(e.seite, SEITE);
});

test('Jede Anregung und jede Impulsfrage trägt eine Seitenangabe', () => {
  for (const k of daten.karten) {
    assert.match(k.anregung, SEITE, `${k.id}: Anregung ohne Seite`);
    for (const i of k.impulse) assert.match(i.seite, SEITE, `${k.id}: Impuls „${i.frage}“ ohne Seite`);
  }
});

test('Eigenentwurf-Kennzeichnung: jede Tätigkeitskarte und jede Übertragung ist markiert', () => {
  for (const k of daten.karten) assert.equal(k.einordnung, 'Eigenentwurf', k.id);
  for (const e of daten.quelle.eintraege) assert.equal(e.uebertragung, 'Eigenentwurf', e.seite);
});

test('Zitate: höchstens 12 Wörter und russischer Text, nichts sonst aus der Quelle', () => {
  for (const e of daten.quelle.eintraege) {
    for (const z of e.zitate) {
      assert.ok(wortzahl(z) <= 12, `Zitat zu lang: ${z}`);
      assert.match(z, /[Ѐ-ӿ]/, `kein russischer Text: ${z}`);
    }
  }
});

test('Gegenprobe: pruefeKarten meldet Verstöße (Frage nach einem Kind, fehlende Seite, falsche Kartenzahl)', () => {
  const eins = kopie();
  eins.karten[0].impulse[0].frage = 'Wie geht es dieses Kind im Kreis?';
  assert.ok(pruefeKarten(eins).some((f) => /einzelnen Kindern/.test(f)), 'Frage nach einem Kind nicht erkannt');

  const zwei = kopie();
  delete zwei.karten[1].anregung;
  assert.ok(pruefeKarten(zwei).some((f) => /Seitenangabe/.test(f)), 'fehlende Seite nicht erkannt');

  const drei = kopie();
  drei.karten.pop();
  assert.ok(pruefeKarten(drei).some((f) => /Tätigkeitskarten/.test(f)), 'falsche Kartenzahl nicht erkannt');
});

test('auswahlUmschalten schaltet eine Karte um, ohne die Eingabe zu verändern', () => {
  const vorher = ['morgenkreis'];
  const nachher = auswahlUmschalten(vorher, 'essen');
  assert.deepEqual(nachher, ['morgenkreis', 'essen']);
  assert.deepEqual(auswahlUmschalten(nachher, 'morgenkreis'), ['essen']);
  assert.deepEqual(vorher, ['morgenkreis'], 'die Eingabe wurde verändert');
});

test('druckKarten: nur die gewählten Karten, in Datenreihenfolge, unbekannte IDs fallen weg', () => {
  const gedruckt = druckKarten(daten, ['quelle', 'essen', 'morgenkreis', 'gibtsnicht']);
  assert.deepEqual(gedruckt.map((k) => k.titel),
    ['Morgenkreis', 'Gemeinsam essen', 'Quellenkarte: Erfolg in der Gruppe']);
  assert.deepEqual(druckKarten(daten, []), []);
});

test('druckTexte: Tätigkeitskarte mit Rolle, Impulsen und Fuß, Quellenkarte mit ihren Seiten', () => {
  const texte = druckTexte(druckKarten(daten, ['singen']));
  assert.equal(texte[0], 'Singen im Kreis');
  assert.ok(texte.includes('Offene Rolle für alle Kinder'));
  assert.ok(texte.some((t) => t.startsWith('Zeit: ') && t.endsWith('(S. 16)')), 'Impuls ohne Bedingung oder Seite');
  assert.equal(texte.at(-1), 'Eigenentwurf – Anregung: S. 16');

  const quelle = druckTexte(druckKarten(daten, ['quelle']));
  assert.ok(quelle.includes('S. 15 – Erfolg in gemeinsamer Tätigkeit'));
  assert.ok(quelle.includes('S. 16 – Anerkennung als Gruppenhaltung'));
  assert.ok(quelle.some((t) => t.startsWith(`${ZITAT_LABEL}: „`)), 'kein Zitat im Druck');
});
