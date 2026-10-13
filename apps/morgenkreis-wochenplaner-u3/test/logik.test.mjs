import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { EINHEIT_SCHLUESSEL, PLAN_ART, PLAN_SCHLUESSEL, abweichungen, bausteinVon, einheitAendern, einheitEntfernen,
  einheitHinzufuegen, neuerPlan, packePlan, pruefeDaten, pruefePlan, zaehleBereiche } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/plan.json', import.meta.url), 'utf8'));
const kopie = (x) => JSON.parse(JSON.stringify(x));

/** Ein Plan, der jeden Richtwert genau trifft: zehn Einheiten, zwei je Tag. */
function richtigerPlan() {
  const einheiten = daten.richtwerte.flatMap((r) => Array.from({ length: r.anzahl }, () => r.bereich));
  let plan = neuerPlan(daten);
  let i = 0;
  for (const tag of daten.tage) {
    for (let k = 0; k < 2 && i < einheiten.length; k++, i++) plan = einheitHinzufuegen(daten, plan, tag, einheiten[i]);
  }
  return plan;
}

test('die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeDaten(daten), []);
});

test('die Richtwerte ergeben zehn Einheiten in sieben Bereichen (S. 8–9)', () => {
  assert.equal(daten.richtwerte.length, 7);
  assert.equal(daten.richtwerte.reduce((a, r) => a + r.anzahl, 0), 10);
  assert.equal(daten.richtwerte.find((r) => r.bereich === 'bewegung').anzahl, 3);
  assert.equal(daten.richtwerte.find((r) => r.bereich === 'musik').anzahl, 2);
});

test('die Musik-Bausteine sind die dreizehn Gattungen der Kartei 78', () => {
  const musik = daten.bereiche.find((b) => b.id === 'musik');
  assert.equal(musik.bausteine.length, 13);
  assert.equal(musik.bausteine[6].id, 'g07');
  assert.equal(musik.bausteine[6].titel, 'Reigen (Хороводы)');
});

test('ein Baustein gehört zu genau einem Bereich; fremde Kennungen liefern null', () => {
  assert.equal(bausteinVon(daten, 'bewegung', 'b-gehen-laufen-1').titel, 'Иди ко мне');
  assert.equal(bausteinVon(daten, 'musik', 'b-gehen-laufen-1'), null);
  assert.equal(bausteinVon(daten, 'sprache', 'irgendwas'), null);
});

test('der leere Plan hat fünf Tage ohne Einheiten und meldet alle Richtwerte als offen', () => {
  const plan = neuerPlan(daten);
  assert.equal(plan.woche.length, 5);
  assert.ok(plan.woche.every((z) => z.einheiten.length === 0));
  assert.equal(abweichungen(daten, plan).length, 8);
});

test('ein Plan, der jeden Richtwert trifft, hat keine Abweichung', () => {
  const plan = richtigerPlan();
  assert.deepEqual(abweichungen(daten, plan), []);
  assert.equal(zaehleBereiche(plan).bewegung, 3);
});

test('eine Einheit wird angehängt; ist der Tag voll, bleibt der Plan unverändert', () => {
  let plan = neuerPlan(daten);
  for (let k = 0; k < daten.hoechstensProTag; k++) plan = einheitHinzufuegen(daten, plan, 'Montag', 'musik');
  assert.equal(plan.woche[0].einheiten.length, daten.hoechstensProTag);
  const voll = einheitHinzufuegen(daten, plan, 'Montag', 'bewegung');
  assert.equal(voll, plan);
});

test('einen Bereich ändern löscht den Baustein; einen Baustein setzen lässt den Bereich', () => {
  let plan = einheitHinzufuegen(daten, neuerPlan(daten), 'Montag', 'bewegung');
  plan = einheitAendern(plan, 'Montag', 0, 'baustein', 'b-gehen-laufen-1');
  assert.equal(plan.woche[0].einheiten[0].baustein, 'b-gehen-laufen-1');
  plan = einheitAendern(plan, 'Montag', 0, 'bereich', 'musik');
  assert.deepEqual(plan.woche[0].einheiten[0], { bereich: 'musik', baustein: null });
});

test('eine Einheit entfernen lässt die anderen stehen', () => {
  let plan = neuerPlan(daten);
  plan = einheitHinzufuegen(daten, plan, 'Dienstag', 'musik');
  plan = einheitHinzufuegen(daten, plan, 'Dienstag', 'zeichnen');
  plan = einheitEntfernen(plan, 'Dienstag', 0);
  assert.deepEqual(plan.woche[1].einheiten.map((e) => e.bereich), ['zeichnen']);
});

test('die Datei enthält nur Form, Tage, Bereiche und Bausteine – und liest sich zurück', () => {
  const plan = richtigerPlan();
  const inhalt = JSON.parse(packePlan(plan));
  assert.deepEqual(Object.keys(inhalt).sort(), [...PLAN_SCHLUESSEL].sort());
  for (const z of inhalt.woche) for (const e of z.einheiten) {
    assert.deepEqual(Object.keys(e).sort(), [...EINHEIT_SCHLUESSEL].sort());
  }
  assert.deepEqual(pruefePlan(inhalt, daten), []);
  assert.equal(inhalt.art, PLAN_ART);
});

test('eine Datei mit einem Namensfeld wird abgewiesen – sie beträfe ein Kind', () => {
  const inhalt = JSON.parse(packePlan(richtigerPlan()));
  inhalt.name = 'Mustermann';
  assert.ok(pruefePlan(inhalt, daten).some((f) => /keine Angaben über Kinder/.test(f)));
});

test('eine Datei mit falscher Art, Version oder Tagesreihenfolge wird abgewiesen', () => {
  const inhalt = JSON.parse(packePlan(richtigerPlan()));
  const art = kopie(inhalt); art.art = 'anderes';
  assert.ok(pruefePlan(art, daten).some((f) => /keine Wochenplan-Datei/.test(f)));
  const ver = kopie(inhalt); ver.version = 2;
  assert.ok(pruefePlan(ver, daten).some((f) => /Version 2/.test(f)));
  const reihe = kopie(inhalt); [reihe.woche[0], reihe.woche[1]] = [reihe.woche[1], reihe.woche[0]];
  assert.ok(pruefePlan(reihe, daten).some((f) => /erwartet/.test(f)));
});

test('ein Baustein aus einem anderen Bereich wird abgewiesen', () => {
  const inhalt = JSON.parse(packePlan(richtigerPlan()));
  const falsch = inhalt.woche.find((z) => z.einheiten.length > 0);
  falsch.einheiten[0] = { bereich: 'musik', baustein: 'b-gehen-laufen-1' };
  assert.ok(pruefePlan(inhalt, daten).some((f) => /gehört nicht zu/.test(f)));
});

test('mehr Einheiten als erlaubt an einem Tag werden abgewiesen', () => {
  const inhalt = JSON.parse(packePlan(neuerPlan(daten)));
  inhalt.woche[0].einheiten = Array.from({ length: daten.hoechstensProTag + 1 }, () => ({ bereich: 'musik', baustein: null }));
  assert.ok(pruefePlan(inhalt, daten).some((f) => /mehr als/.test(f)));
});

test('eine Abweichung vom Richtwert ist keine Ablehnung der Datei', () => {
  const plan = neuerPlan(daten);
  const inhalt = JSON.parse(packePlan(einheitHinzufuegen(daten, plan, 'Montag', 'musik')));
  assert.deepEqual(pruefePlan(inhalt, daten), []);
  assert.ok(abweichungen(daten, plan).length > 0);
});

test('Gegenprobe Daten: eine Summe ungleich zehn wird abgewiesen', () => {
  const d = kopie(daten);
  d.richtwerte[0].anzahl = 4;
  assert.ok(pruefeDaten(d).some((f) => /ergeben 11 Einheiten/.test(f)));
});

test('Gegenprobe Daten: ein Autor im Baustein-Titel wird abgewiesen', () => {
  const d = kopie(daten);
  d.bereiche[2].bausteine[0].titel = 'Бобик, муз. Попатенко';
  assert.ok(pruefeDaten(d).some((f) => /Autoren- oder Notenangabe/.test(f)));
});

test('Gegenprobe Daten: ein fremdes Feld im Baustein wird abgewiesen', () => {
  const d = kopie(daten);
  d.bereiche[0].bausteine[0].kind = 'Mia';
  assert.ok(pruefeDaten(d).some((f) => /fremdem Feld „kind“/.test(f)));
});

test('die Einheit-Felder sind genau bereich und baustein', () => {
  assert.deepEqual([...EINHEIT_SCHLUESSEL], ['bereich', 'baustein']);
});

test('ein Zusatzfeld auf Tagesebene – etwa ein Name oder eine Notiz – wird abgewiesen', () => {
  const inhalt = JSON.parse(packePlan(richtigerPlan()));
  inhalt.woche[1].name = 'Mia';
  assert.ok(pruefePlan(inhalt, daten).some((f) => /Tag 2: unbekanntes Feld „name“/.test(f)));
  const notiz = JSON.parse(packePlan(richtigerPlan()));
  notiz.woche[0].notiz = 'schläft schlecht';
  assert.ok(pruefePlan(notiz, daten).some((f) => /Tag 1: unbekanntes Feld „notiz“/.test(f)));
});

test('ein Autor im Baustein wird auch mit großem Anfangsbuchstaben erkannt', () => {
  const d = kopie(daten);
  d.bereiche[0].bausteine[0].titel = 'Иди ко мне, Муз. Иванова';
  assert.ok(pruefeDaten(d).some((f) => /Autoren- oder Notenangabe/.test(f)));
});
