import { test } from 'node:test';
import assert from 'node:assert/strict';
import { AUSBREITUNG, kopienZahl, radiere, LEKTIONEN, MUSTER_SATZ } from '../radiergummi.mjs';

test('Ausbreitungs-Netz: Startknoten + mehrere Kopien, genau eine unlöschbare', () => {
  assert.ok(AUSBREITUNG.length >= 5, 'mindestens 5 Stationen');
  assert.equal(AUSBREITUNG.filter((k) => k.typ === 'du').length, 1, 'genau ein Du-Knoten');
  assert.equal(AUSBREITUNG[0].id, 'du', 'Ausbreitung beginnt bei dir');
  const unloeschbar = AUSBREITUNG.filter((k) => k.loeschbar === false);
  assert.equal(unloeschbar.length, 1, 'genau EINE Kopie, die das Löschrecht nicht erreicht');
  assert.equal(unloeschbar[0].typ, 'kopie');
  for (const k of AUSBREITUNG) assert.ok(k.satz?.length >= 30, `${k.id}: Erzähl-Satz fehlt`);
});

test('kopienZahl zählt alles außer dem eigenen Handy', () => {
  assert.equal(kopienZahl(), AUSBREITUNG.length - 1);
});

test('radiere: Server und Partner werden gelöscht, der Screenshot bleibt', () => {
  const { geloescht, bleibt } = radiere();
  assert.ok(geloescht.length >= 3, 'Löschrecht wirkt auf mehrere Stationen');
  assert.ok(geloescht.every((k) => ['server', 'partner'].includes(k.typ)));
  assert.equal(bleibt.length, 1);
  assert.equal(bleibt[0].id, 'screenshot');
});

test('Lektionen: Recht + Grenze + Prävention + Hilfe', () => {
  const text = LEKTIONEN.join(' ');
  assert.ok(/Artikel 17|DSGVO/.test(text), 'Rechtsgrundlage benannt');
  assert.ok(/Screenshot/.test(text), 'Grenze des Löschrechts benannt');
  assert.ok(/ERST denken|DANN posten/i.test(text), 'Prävention vor Reaktion');
  assert.ok(text.includes('116 111'), 'Hilfeadresse vorhanden');
  assert.ok(MUSTER_SATZ.includes('Artikel 17'), 'Muster-Satz zitiert die Rechtsgrundlage');
});
