import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PAKETE, ITEMS, preisPro100, guenstigsterKauf, wahrerPreis, cent, LEKTIONEN } from '../logik.mjs';

test('Pakete & Items: plausible Struktur', () => {
  assert.ok(PAKETE.length >= 3);
  for (const p of PAKETE) {
    assert.ok(Number.isInteger(p.juwelen) && p.juwelen > 0);
    assert.ok(Number.isInteger(p.cent) && p.cent > 0);
  }
  assert.ok(ITEMS.length >= 4);
  for (const it of ITEMS) assert.ok(it.name && it.emoji && it.juwelen > 0, `${it.code}: Feld fehlt`);
});

test('preisPro100: großes Paket ist pro Juwel günstiger (die "Mengenrabatt"-Lockung)', () => {
  const klein = PAKETE[0];
  const gross = PAKETE[PAKETE.length - 1];
  assert.ok(preisPro100(gross) < preisPro100(klein), 'sonst gäbe es die Überkauf-Verlockung nicht');
});

test('guenstigsterKauf: erreicht mindestens das Ziel, Rest ist nie negativ', () => {
  for (const it of ITEMS) {
    const k = guenstigsterKauf(it.juwelen);
    assert.ok(k.erhalten >= it.juwelen, `${it.code}: zu wenig Juwelen`);
    assert.ok(k.rest >= 0, `${it.code}: negativer Rest`);
    assert.ok(k.cent > 0 && Number.isFinite(k.cent));
    const summe = Object.values(k.pakete).reduce((s, n) => s + n, 0);
    assert.ok(summe >= 1, `${it.code}: kein Paket gewählt`);
  }
});

test('guenstigsterKauf ist wirklich minimal (kein billigerer Weg per Brute Force)', () => {
  // Kleines Ziel, damit Brute Force über bis zu 6 Pakete je Sorte reicht.
  const ziel = 350;
  const dp = guenstigsterKauf(ziel);
  let best = Infinity;
  const [a, b, c, d] = PAKETE;
  for (let na = 0; na <= 6; na++) for (let nb = 0; nb <= 3; nb++)
    for (let nc = 0; nc <= 2; nc++) for (let nd = 0; nd <= 1; nd++) {
      const jw = na * a.juwelen + nb * b.juwelen + nc * c.juwelen + nd * d.juwelen;
      if (jw >= ziel) best = Math.min(best, na * a.cent + nb * b.cent + nc * c.cent + nd * d.cent);
    }
  assert.equal(dp.cent, best, 'DP muss den günstigsten Kauf finden');
});

test('Kern-Aussage: es bleibt IMMER ein Rest (kein Item geht exakt auf)', () => {
  // Die Pakete sind bewusst so gewählt, dass keine Ziel-Summe glatt aufgeht.
  const restlos = ITEMS.filter((it) => guenstigsterKauf(it.juwelen).rest === 0);
  assert.equal(restlos.length, 0, 'jedes Item hinterlässt einen Lock-Rest');
});

test('wahrerPreis: liefert Schein- und Echtpreis für die Anzeige', () => {
  const w = wahrerPreis(ITEMS[0]);
  assert.equal(w.scheinPreis, `${ITEMS[0].juwelen} 💎`);
  assert.match(w.centText, /€/);
  assert.equal(cent(99), '0,99 €');
  assert.equal(cent(1499), '14,99 €');
});

test('Lektionen: Währung versteckt Geld, Rest ist Absicht, Bonus ist Lockmittel, umrechnen', () => {
  const text = LEKTIONEN.join(' ');
  assert.match(text, /echtes Geld/);
  assert.match(text, /Rest ist Absicht|Rest bleibt/);
  assert.match(text, /Lockmittel|extra/);
  assert.match(text, /umrechnen|Euro/);
  assert.match(text, /Eltern|sperren/);
});
