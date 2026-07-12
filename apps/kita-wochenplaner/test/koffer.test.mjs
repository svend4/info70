import { test } from 'node:test';
import assert from 'node:assert/strict';
import { packeKoffer, pruefeKoffer, vereinigeKoffer, KOFFER_ART, KOFFER_VERSION } from '../koffer.mjs';

const plan = {
  woche: 'KW 29 · Igelgruppe',
  angebote: [
    { id: 'a1', tag: 'mo', bereich: 'bewegung', alter: '3-5', dauer: 15, titel: 'Balancier-Parcours' },
    { id: 'a2', tag: 'di', bereich: 'sprache', alter: '1-3', dauer: 10, titel: '' },
  ],
};

test('packeKoffer -> pruefeKoffer: Rundreise ist gültig', () => {
  const geparst = JSON.parse(packeKoffer(plan));
  assert.equal(geparst.art, KOFFER_ART);
  assert.equal(geparst.version, KOFFER_VERSION);
  assert.deepEqual(pruefeKoffer(geparst), []);
  assert.deepEqual(
    pruefeKoffer(geparst, { bereichIds: ['bewegung', 'sprache'], alterIds: ['1-3', '3-5'] }),
    [],
    'auch mit ID-Listen gültig',
  );
});

test('pruefeKoffer erkennt kaputte Dateien', () => {
  assert.ok(pruefeKoffer(null).length > 0);
  assert.ok(pruefeKoffer('text').length > 0);
  assert.ok(pruefeKoffer({ art: 'anders' }).some((f) => f.includes('keine Kita-Wochenplaner-Datei')));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 99, woche: '', angebote: [] }).some((f) => f.includes('Version')));

  const kaputteDauer = JSON.parse(packeKoffer(plan));
  kaputteDauer.angebote[0].dauer = -5;
  assert.ok(pruefeKoffer(kaputteDauer).some((f) => f.includes('Dauer')));

  const falscherTag = JSON.parse(packeKoffer(plan));
  falscherTag.angebote[1].tag = 'sa';
  assert.ok(pruefeKoffer(falscherTag).some((f) => f.includes('Tag')));

  const fremderBereich = JSON.parse(packeKoffer(plan));
  fremderBereich.angebote[0].bereich = 'zauberei';
  assert.ok(
    pruefeKoffer(fremderBereich, { bereichIds: ['bewegung', 'sprache'] }).some((f) => f.includes('Bildungsbereich')),
  );

  const fremdesAlter = JSON.parse(packeKoffer(plan));
  fremdesAlter.angebote[0].alter = '8-10';
  assert.ok(pruefeKoffer(fremdesAlter, { alterIds: ['1-3', '3-5', '5-7'] }).some((f) => f.includes('Altersgruppe')));
});

test('vereinigeKoffer ergänzt neue Angebote, gleiche Kennung nur einmal', () => {
  const anderesGeraet = {
    woche: 'Spätdienst',
    angebote: [
      { ...plan.angebote[0] },
      { id: 'a3', tag: 'fr', bereich: 'musik-kunst', alter: '5-7', dauer: 20, titel: 'Singkreis' },
    ],
  };
  const ergebnis = vereinigeKoffer(plan, anderesGeraet);
  assert.deepEqual(ergebnis.angebote.map((a) => a.id), ['a1', 'a2', 'a3']);
  assert.equal(ergebnis.woche, plan.woche, 'laufender Wochen-Titel bleibt');
  assert.equal(plan.angebote.length, 2, 'Original bleibt unverändert');
  assert.notEqual(ergebnis.angebote[0], plan.angebote[0], 'Kopie, keine Referenz');
});

test('vereinigeKoffer: ohne laufenden Plan wird der Import übernommen', () => {
  const ergebnis = vereinigeKoffer(null, plan);
  assert.deepEqual(ergebnis.angebote, plan.angebote);
  assert.notEqual(ergebnis.angebote, plan.angebote, 'Kopie, keine Referenz');
  assert.equal(ergebnis.woche, plan.woche);

  const leerLaufend = vereinigeKoffer({ woche: '', angebote: [] }, plan);
  assert.equal(leerLaufend.woche, plan.woche, 'leerer Titel wird vom Import gefüllt');
  assert.equal(leerLaufend.angebote.length, 2);
});
