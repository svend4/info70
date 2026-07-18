import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  KOFFER_ART, KOFFER_VERSION, WERKZEUGE, nameVon,
  packeKoffer, pruefeKoffer, vorhandeneWerkzeuge, fortschritt, gesamtbericht,
} from '../logik.mjs';

test('WERKZEUGE-Katalog: die Kern-Prüfwerkzeuge sind enthalten', () => {
  const ids = WERKZEUGE.map((w) => w.id);
  for (const id of ['art8', 'dsa', 'bfsg', 'aiact', 'juschg24a', 'cria']) {
    assert.ok(ids.includes(id), `${id} fehlt`);
  }
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
});

test('packeKoffer: Struktur, Trim, leere Berichte werden verworfen', () => {
  const k = packeKoffer('  Meine Kinderseite  ', [
    { werkzeug: 'art8', text: '  Bericht A  ' },
    { werkzeug: 'dsa', text: '   ' },
    { werkzeug: 'bfsg', text: 'Bericht B' },
  ], '18.07.2026');
  assert.equal(k.art, KOFFER_ART);
  assert.equal(k.version, KOFFER_VERSION);
  assert.equal(k.angebot, 'Meine Kinderseite');
  assert.equal(k.erstellt, '18.07.2026');
  assert.equal(k.berichte.length, 2, 'leerer dsa-Bericht verworfen');
  assert.equal(k.berichte[0].text, 'Bericht A', 'getrimmt');
});

test('pruefeKoffer: gültig -> leer, ungültig -> Fehler', () => {
  const gut = packeKoffer('X', [{ werkzeug: 'art8', text: 'a' }], 's');
  assert.deepEqual(pruefeKoffer(gut), []);
  assert.deepEqual(pruefeKoffer(null), ['Keine gültige Koffer-Datei']);
  assert.ok(pruefeKoffer({ art: 'falsch', version: 1, angebot: 'x', berichte: [] }).length >= 1);
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 99, angebot: 'x', berichte: [] }).some((f) => /Version/.test(f)));
  assert.ok(pruefeKoffer({ art: KOFFER_ART, version: 1, angebot: 'x', berichte: [{ werkzeug: 1 }] }).some((f) => /Berichte/.test(f)));
});

test('Roundtrip: packen -> JSON -> parsen -> prüfen', () => {
  const k = packeKoffer('Seite', [{ werkzeug: 'cria', text: 'KRIA-Bericht' }], 's');
  const wieder = JSON.parse(JSON.stringify(k));
  assert.deepEqual(pruefeKoffer(wieder), []);
  assert.deepEqual(wieder.berichte, k.berichte);
});

test('vorhandeneWerkzeuge / fortschritt', () => {
  const k = packeKoffer('S', [{ werkzeug: 'art8', text: 'a' }, { werkzeug: 'dsa', text: 'b' }], 's');
  assert.deepEqual(vorhandeneWerkzeuge(k).sort(), ['art8', 'dsa']);
  const f = fortschritt(k);
  assert.equal(f.vorhanden, 2);
  assert.equal(f.gesamt, WERKZEUGE.length);
});

test('nameVon', () => {
  assert.equal(nameVon('art8'), 'Einwilligungs-Prüfpfad Art. 8');
  assert.equal(nameVon('unbekannt'), 'unbekannt');
});

test('gesamtbericht: Kopf, Abdeckung, Sektionen, offene Liste', () => {
  const k = packeKoffer('Meine Seite', [
    { werkzeug: 'art8', text: 'Art-8-Bericht-Inhalt' },
    { werkzeug: 'bfsg', text: 'BFSG-Bericht-Inhalt' },
  ], '18.07.2026');
  const b = gesamtbericht(k);
  assert.match(b, /Compliance-Koffer – Gesamtbericht/);
  assert.match(b, /Angebot: Meine Seite/);
  assert.match(b, new RegExp(`Enthaltene Prüfwerkzeuge: 2/${WERKZEUGE.length}`));
  assert.match(b, /## Abdeckung/);
  assert.match(b, /✔️ Einwilligungs-Prüfpfad Art\. 8/);
  assert.match(b, /Art-8-Bericht-Inhalt/);
  assert.match(b, /## Noch offen/);
  assert.match(b, /kein offizielles Konformitätsergebnis/);
});
