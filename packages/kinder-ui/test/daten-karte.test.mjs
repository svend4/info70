import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DATEN_TEXTE, schluesselListe, loescheDaten, istBelegt, setzeMerkerZurueck } from '../js/daten-karte.mjs';

function fakeSpeicher(init = {}) {
  const m = new Map(Object.entries(init));
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, v),
    removeItem: (k) => m.delete(k),
    _map: m,
  };
}

test('Texte: der Knopf verspricht Löschen, die Rückmeldung bestätigt es', () => {
  assert.match(DATEN_TEXTE.knopf, /löschen/i);
  assert.match(DATEN_TEXTE.bestaetigung, /Gelöscht/);
  assert.match(DATEN_TEXTE.nichts, /keine Namen|keine Werbung/);
  // Kein Tadel, keine Drohung, keine externe Adresse
  const alles = Object.values(DATEN_TEXTE).join(' ');
  assert.ok(!/https?:\/\//.test(alles), 'keine externen Links');
  assert.ok(!/Achtung|Warnung|unwiderruflich/i.test(alles), 'kein Angst-Ton für Kinder');
});

test('schluesselListe nimmt einen Schlüssel oder viele und wirft Leeres weg', () => {
  assert.deepEqual(schluesselListe('a.b'), ['a.b']);
  assert.deepEqual(schluesselListe(['a', 'b']), ['a', 'b']);
  assert.deepEqual(schluesselListe(['a', '', null, undefined, 'b']), ['a', 'b']);
  assert.deepEqual(schluesselListe(undefined), []);
  assert.deepEqual(schluesselListe(42), []);
});

test('loescheDaten entfernt genau die eigenen Schlüssel – nichts daneben', () => {
  const s = fakeSpeicher({ 'cc.rekord': '7', 'kui.anzeige': 'kontrast', 'andere.app': 'x' });
  const n = loescheDaten('cc.rekord', s);
  assert.equal(n, 1);
  assert.equal(s.getItem('cc.rekord'), null);
  // Die Anzeige-Einstellungen und die Nachbar-App bleiben stehen: ein Kind,
  // das hohen Kontrast braucht, darf ihn nicht mitverlieren.
  assert.equal(s.getItem('kui.anzeige'), 'kontrast');
  assert.equal(s.getItem('andere.app'), 'x');
});

test('loescheDaten zählt nur, was wirklich dalag', () => {
  const s = fakeSpeicher({ 'a': '1' });
  assert.equal(loescheDaten(['a', 'b'], s), 1, 'b lag nicht da');
  assert.equal(loescheDaten(['a', 'b'], s), 0, 'jetzt liegt nichts mehr da');
  assert.equal(loescheDaten([], s), 0);
});

test('loescheDaten übersteht einen gesperrten Speicher', () => {
  const kaputt = {
    getItem() { throw new Error('privates Fenster'); },
    removeItem() { throw new Error('privates Fenster'); },
  };
  assert.equal(loescheDaten('a', kaputt), 0, 'kein Absturz, nur nichts getan');
  assert.equal(loescheDaten('a', undefined), 0, 'auch ohne Speicher kein Absturz');
  assert.equal(istBelegt('a', kaputt), false);
});

test('istBelegt sagt, ob überhaupt etwas zu löschen ist', () => {
  const s = fakeSpeicher({ 'x': '0' });
  assert.equal(istBelegt('x', s), true, 'auch der String "0" ist ein Eintrag');
  assert.equal(istBelegt('y', s), false);
  assert.equal(istBelegt(['y', 'x'], s), true);
  assert.equal(istBelegt([], s), false);
});

test('der Merker für die Bestätigung ist zurücksetzbar', () => {
  // Die Karte zeigt die Bestätigung erst NACH dem Neuzeichnen – der
  // Meldungsknoten der alten Karte ist da schon weg. Der Merker trägt die
  // Meldung über diesen Takt. Für Tests muss er sauber zurückgehen.
  setzeMerkerZurueck();
  assert.equal(typeof setzeMerkerZurueck, 'function');
});
