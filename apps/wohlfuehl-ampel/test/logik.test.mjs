import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  AMPELN, AMPEL_WERTE, KONTEXTE, KONTEXT_WERTE, MAX_KINDER,
  tagesSchluessel, verschiebeTag, wochenSicht, ampelSerie, brauchtImpuls, pruefeKuerzel,
} from '../logik.mjs';

test('Feste Listen: drei Ampelstufen, fünf Kontexte, kein Freitext-Schlupfloch', () => {
  assert.deepEqual(AMPEL_WERTE, ['gruen', 'gelb', 'rot']);
  assert.equal(KONTEXTE.length, 5);
  assert.deepEqual(KONTEXT_WERTE, ['eingewoehnung', 'konflikt', 'muede', 'abschied', 'neu']);
  for (const a of AMPELN) assert.ok(a.name.length > 0 && a.punkt.length > 0);
});

test('tagesSchluessel: lokales Datum als JJJJ-MM-TT', () => {
  assert.equal(tagesSchluessel(new Date(2026, 6, 12)), '2026-07-12');
  assert.equal(tagesSchluessel(new Date(2026, 0, 3)), '2026-01-03');
});

test('verschiebeTag: kalenderfest über Monats- und Jahresgrenzen', () => {
  assert.equal(verschiebeTag('2026-07-12', -1), '2026-07-11');
  assert.equal(verschiebeTag('2026-07-01', -1), '2026-06-30');
  assert.equal(verschiebeTag('2026-01-01', -1), '2025-12-31');
  assert.equal(verschiebeTag('2026-02-28', 1), '2026-03-01');
});

test('wochenSicht: 7 Tage, ältester zuerst, Lücken als null', () => {
  const eintraege = {
    '2026-07-12': { ampel: 'rot', kontext: 'muede' },
    '2026-07-10': { ampel: 'gruen', kontext: null },
  };
  const woche = wochenSicht(eintraege, '2026-07-12');
  assert.equal(woche.length, 7);
  assert.equal(woche[0].datum, '2026-07-06');
  assert.equal(woche[6].datum, '2026-07-12');
  assert.deepEqual(woche[6], { datum: '2026-07-12', ampel: 'rot', kontext: 'muede' });
  assert.deepEqual(woche[4], { datum: '2026-07-10', ampel: 'gruen', kontext: null });
  assert.deepEqual(woche[5], { datum: '2026-07-11', ampel: null, kontext: null });
});

test('ampelSerie: zählt Rot am Ende, Grün/Gelb unterbricht', () => {
  assert.equal(ampelSerie(['gruen', 'rot', 'rot', 'rot']), 3);
  assert.equal(ampelSerie(['rot', 'rot', 'gruen']), 0);
  assert.equal(ampelSerie(['rot', 'gelb', 'rot']), 1);
  assert.equal(ampelSerie([]), 0);
  assert.equal(ampelSerie(['gruen', 'gruen'], 'gruen'), 2);
});

test('ampelSerie: undokumentierte Tage (null) zählen nicht und unterbrechen nicht', () => {
  // Wochenende ohne Doku beendet die Rot-Serie nicht:
  assert.equal(ampelSerie(['rot', 'rot', null, null, 'rot']), 3);
  assert.equal(ampelSerie([null, null, null]), 0);
  // funktioniert auch mit wochenSicht-Objekten:
  const woche = wochenSicht({
    '2026-07-09': { ampel: 'rot', kontext: null },
    '2026-07-10': { ampel: 'rot', kontext: 'konflikt' },
    '2026-07-12': { ampel: 'rot', kontext: null },
  }, '2026-07-12');
  assert.equal(ampelSerie(woche), 3);
});

test('brauchtImpuls: ab 3 dokumentierten Rot-Tagen in Folge', () => {
  assert.equal(brauchtImpuls(['rot', 'rot']), false);
  assert.equal(brauchtImpuls(['rot', 'rot', 'rot']), true);
  assert.equal(brauchtImpuls(['rot', 'gruen', 'rot', 'rot']), false);
  assert.equal(brauchtImpuls(['gelb', 'rot', null, 'rot', 'rot']), true);
  assert.equal(brauchtImpuls(['rot', 'rot', 'rot', 'gruen']), false, 'Serie muss am Ende stehen');
  assert.equal(brauchtImpuls(['rot', 'rot'], 2), true, 'Schwelle einstellbar');
});

test('pruefeKuerzel: 1-3 Zeichen, einmalig, keine Namen, max 20 Kinder', () => {
  assert.equal(pruefeKuerzel('MO', []), null);
  assert.equal(pruefeKuerzel('  LI ', []), null, 'Leerraum wird toleriert (wird getrimmt)');
  assert.ok(pruefeKuerzel('', []));
  assert.ok(pruefeKuerzel('   ', []));
  assert.ok(pruefeKuerzel('MORITZ', []), 'mehr als 3 Zeichen = abgelehnt (keine Namen)');
  assert.ok(pruefeKuerzel('MO', ['MO']));
  const volle = Array.from({ length: MAX_KINDER }, (_, i) => `K${i}`);
  assert.ok(pruefeKuerzel('NEU', volle));
  assert.equal(pruefeKuerzel('NEU', volle.slice(0, MAX_KINDER - 1)), null);
});
