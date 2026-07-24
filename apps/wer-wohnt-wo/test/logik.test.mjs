import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { JAHRESZEITEN, artikelVon, gross, bewohnerFuer, stockwerkVon, wohnFrage, stockwerkFrage, pruefeDaten } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/lebensraeume.json', import.meta.url), 'utf8'));
const wald = daten.lebensraeume.find((r) => r.id === 'wald');

test('Datenbestand ist gültig: 4 Häuser, Wald mit 5 Stockwerken, alle Jahreszeiten', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.lebensraeume.length, 4);
  assert.equal(wald.stockwerke.length, 5);
  assert.equal(JAHRESZEITEN.length, 4);
});

test('Sachunterrichts-Klassiker: Stockwerke von der Baumschicht bis zur Wurzelschicht', () => {
  assert.deepEqual(wald.stockwerke.map((s) => s.id),
    ['baumschicht', 'strauchschicht', 'krautschicht', 'bodenschicht', 'wurzelschicht']);
  assert.equal(stockwerkVon('Specht', wald).id, 'baumschicht');
  assert.equal(stockwerkVon('Regenwurm', wald).id, 'wurzelschicht');
  assert.equal(stockwerkVon('Waldmaus', wald).id, 'bodenschicht');
  assert.equal(stockwerkVon('Stockente', wald), null);
});

test('bewohnerFuer: jeder Lebensraum hat mindestens 3 Quiz-Bewohner', () => {
  for (const r of daten.lebensraeume) {
    assert.ok(bewohnerFuer(r.id, daten.bewohner).length >= 3, `${r.id} hat genug Bewohner`);
  }
});

test('wohnFrage/stockwerkFrage sind deterministisch mit injiziertem Wähler', () => {
  const frosch = wohnFrage(daten.bewohner, (liste) => liste.find((b) => b.name === 'Frosch'));
  assert.equal(frosch.richtig, 'teich');
  const sf = stockwerkFrage(wald, (liste) => liste.find((x) => x.name === 'Fuchs'));
  assert.equal(sf.richtig, 'wurzelschicht');
});

test('Gast-Regeln: wahre und falsche Aussagen, Erklärungen ohne Beschämung', () => {
  assert.ok(daten.gastRegeln.length >= 8);
  assert.ok(daten.gastRegeln.some((g) => g.richtig) && daten.gastRegeln.some((g) => !g.richtig));
  for (const g of daten.gastRegeln) {
    assert.doesNotMatch(g.erklaerung, /dumm|böse|schäm/i, g.id);
  }
  const kaulquappe = daten.gastRegeln.find((g) => g.id === 'kaulquappe');
  assert.equal(kaulquappe.richtig, false);
  assert.match(kaulquappe.erklaerung, /geschützt/);
});

test('Validator meldet Widersprüche (Stockwerk-Tier mit fremdem Lebensraum, doppelte Bewohner)', () => {
  const kaputt = structuredClone(daten);
  kaputt.bewohner.find((b) => b.name === 'Fuchs').lebensraum = 'wiese';
  assert.ok(pruefeDaten(kaputt).some((f) => f.includes('Fuchs')));
  const doppelt = structuredClone(daten);
  doppelt.bewohner.push({ ...doppelt.bewohner[0] });
  assert.ok(pruefeDaten(doppelt).some((f) => f.includes('doppelt')));
});

test('Naturwissen sitzt: Winterschlaf der Haselmaus im Wald-Winter, Nüsse im Herbst, Maulwurfshügel', () => {
  assert.match(wald.jahreszeiten.winter, /Haselmaus/);
  assert.match(wald.jahreszeiten.winter, /Winterschlaf/);
  assert.match(wald.jahreszeiten.herbst, /Nüsse/);
  assert.match(daten.bewohner.find((b) => b.name === 'Maulwurf').tipp, /Hügel|hügel|Gänge/);
  // Nicht alle Insekten überwintern als Ei/Larve/Puppe – Marienkäfer & Co.
  // überwintern als fertiges Tier.
  const wiese = daten.lebensraeume.find((r) => r.id === 'wiese');
  assert.match(wiese.jahreszeiten.winter, /fertiges Tier|erwachsen/);
});

test('Ganze Sätze: Artikel für jeden Namen, Ortsangabe je Haus, Stockwerk-Kurzname', () => {
  assert.equal(artikelVon('Reh', daten.artikel), 'das');
  assert.equal(artikelVon('Specht', daten.artikel), 'der');
  assert.equal(gross(`${artikelVon('Amsel', daten.artikel)} Amsel`), 'Die Amsel');
  for (const r of daten.lebensraeume) assert.ok(r.wo, `${r.id} hat eine Ortsangabe`);
  for (const s of wald.stockwerke) assert.match(s.kurz, /schicht$/, s.id);
  const ohneArtikel = structuredClone(daten);
  delete ohneArtikel.artikel.Fuchs;
  assert.ok(pruefeDaten(ohneArtikel).some((f) => f.includes('Artikel für Fuchs')));
});

test('Gast-Erklärungen loben nicht vorab – sie erscheinen auch nach falscher Antwort', () => {
  for (const g of daten.gastRegeln) {
    assert.doesNotMatch(g.erklaerung, /^(Richtig|Genau|Stimmt|Ja|Super)\b/, g.id);
  }
  const gelobt = structuredClone(daten);
  gelobt.gastRegeln[0].erklaerung = `Richtig! ${gelobt.gastRegeln[0].erklaerung}`;
  assert.ok(pruefeDaten(gelobt).some((f) => f.includes('Bestätigung')));
});
