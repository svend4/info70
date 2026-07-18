import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { ampelBericht, zaehle, AMPEL, STANDARD } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));
const alle = daten.bereiche.flatMap((b) => b.kriterien);

test('Katalog: § 24a-Bereiche, eindeutige IDs, Ampel-Hinweis', () => {
  assert.ok(daten.bereiche.length >= 4, 'mindestens 4 Bereiche');
  assert.match(daten.quelle, /24a JuSchG/, '§ 24a JuSchG als Grundlage');
  assert.match(daten.hinweis, /Ampel|Selbstaudit|kein offizielles/i, 'als Selbstaudit gekennzeichnet');
  const ids = alle.map((k) => k.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte IDs');
  assert.ok(alle.length >= 8, `mindestens 8 Kriterien (ist: ${alle.length})`);
});

test('die Vorsorge-Dimensionen des § 24a sind abgedeckt', () => {
  const bereiche = daten.bereiche.map((b) => b.id);
  for (const pflicht of ['voreinstellungen', 'melden', 'information', 'risiko']) {
    assert.ok(bereiche.includes(pflicht), `Bereich fehlt: ${pflicht}`);
  }
});

test('jedes Kriterium: Aussage, Hilfe, JuSchG/DSA-Bezug', () => {
  for (const k of alle) {
    assert.ok(k.text.length >= 40, `${k.id}: Aussage zu kurz`);
    assert.ok(k.hilfe.length >= 60, `${k.id}: Hilfe zu kurz`);
    assert.match(k.bezug, /JuSchG|DSA|DSGVO|UN-KRK/, `${k.id}: Bezug fehlt`);
  }
});

test('inhaltliche Abdeckung der Vorsorgemaßnahmen', () => {
  const text = JSON.stringify(alle).toLowerCase();
  assert.match(text, /voreinstellung|voreingestellt|standardmäßig/, 'sichere Voreinstellungen');
  assert.match(text, /melde/, 'Meldeverfahren');
  assert.match(text, /eltern/, 'Elterninformationen');
  assert.match(text, /standort/, 'Standort aus');
  assert.match(text, /chat|fremdkontakt/, 'Risiko-Features');
  assert.match(text, /116 111/, 'Hinweis auf Hilfe');
});

test('Ampel: drei Zustände, Standard offen, zaehle mischt korrekt', () => {
  assert.deepEqual(Object.keys(AMPEL).sort(), ['grau', 'gruen', 'rot']);
  assert.equal(STANDARD, 'rot');
  assert.equal(zaehle(alle, {}).rot, alle.length);
  const z = zaehle(alle, { [alle[0].id]: 'gruen', [alle[1].id]: 'grau' });
  assert.equal(z.gruen, 1);
  assert.equal(z.grau, 1);
  assert.equal(z.rot, alle.length - 2);
});

test('ampelBericht: Zählung, Übernahme, offene Liste, JuSchG-Bezug', () => {
  const bericht = ampelBericht(daten, { [alle[0].id]: 'gruen' });
  assert.match(bericht, /🟢 erfüllt: 1/);
  assert.match(bericht, new RegExp(`🔴 offen: ${alle.length - 1}`));
  assert.match(bericht, /Offen – als Nächstes umsetzen/);
  assert.match(bericht, /JuSchG § 24a/, 'Bezug im Bericht');
  const allesGruen = Object.fromEntries(alle.map((k) => [k.id, 'gruen']));
  assert.ok(!/Offen – als Nächstes/.test(ampelBericht(daten, allesGruen)));
});
