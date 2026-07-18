import { test } from 'node:test';
import assert from 'node:assert/strict';
import { BAUSTEINE, baueDatenschutz } from '../logik.mjs';

test('Bausteine: die im Katalog genannten Optionen, eindeutige Codes', () => {
  const codes = BAUSTEINE.map((b) => b.code);
  assert.equal(new Set(codes).size, codes.length, 'eindeutige Codes');
  for (const pflicht of ['localstorage', 'kontaktformular', 'newsletter', 'medien', 'analyse']) {
    assert.ok(codes.includes(pflicht), `Baustein fehlt: ${pflicht}`);
  }
  for (const b of BAUSTEINE) {
    assert.ok(b.name && b.juristisch?.length >= 40 && b.kinder?.length >= 20, `${b.code}: Text fehlt`);
  }
});

test('baueDatenschutz: ohne Auswahl nur Grundgerüst mit Datenminimierung + Rechten', () => {
  const { juristisch, kinder } = baueDatenschutz([]);
  assert.match(juristisch, /Datenminimierung/);
  assert.match(juristisch, /Art\. 15, 16, 17 DSGVO/, 'Betroffenenrechte');
  assert.match(juristisch, /Art\. 77 DSGVO/, 'Beschwerderecht');
  assert.match(kinder, /Was wir über dich wissen/);
  assert.match(kinder, /116 111/, 'Hilfe in der Kinder-Version');
});

test('baueDatenschutz: gewählte Bausteine erscheinen in BEIDEN Texten', () => {
  const { juristisch, kinder } = baueDatenschutz(['kontaktformular', 'newsletter']);
  assert.match(juristisch, /Kontaktformular/);
  assert.match(juristisch, /Art\. 6 Abs\. 1 lit\. a DSGVO/, 'Newsletter-Rechtsgrundlage');
  assert.match(kinder, /Newsletter/);
  // nicht gewählte Bausteine fehlen
  assert.ok(!/Reichweiten/.test(juristisch), 'Analyse nicht gewählt -> nicht enthalten');
});

test('Kinder-Version ist einfacher als die juristische (kürzere Sätze)', () => {
  const { juristisch, kinder } = baueDatenschutz(BAUSTEINE.map((b) => b.code));
  const maxWorte = (t) => Math.max(...t.split(/(?<=[.!?])\s+/).filter((s) => /\w/.test(s)).map((s) => s.split(/\s+/).length));
  assert.ok(maxWorte(kinder) < maxWorte(juristisch), 'Kinder-Sätze kürzer als juristische');
  assert.ok(maxWorte(kinder) <= 16, 'Kinder-Version bleibt einfach');
});

test('Sicherheit: erzeugte Texte enthalten keine externen Links/Skripte', () => {
  const { juristisch, kinder } = baueDatenschutz(BAUSTEINE.map((b) => b.code));
  for (const t of [juristisch, kinder]) {
    assert.ok(!/https?:\/\//.test(t), 'keine externen Links');
    assert.ok(!/<script/i.test(t), 'kein Script');
  }
});
