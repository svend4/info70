import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  zeichenraum, entropieBits, knackSekunden, knackzeitText, kombiniere,
  VERSUCHE_PRO_SEKUNDE, SEKUNDEN_PRO_JAHR, UNIVERSUM_ALTER_JAHRE,
} from '../logik.mjs';

test('zeichenraum: erkennt Zeichenarten und summiert sie', () => {
  assert.equal(zeichenraum(''), 0);
  assert.equal(zeichenraum('abc'), 26);
  assert.equal(zeichenraum('ABC'), 26);
  assert.equal(zeichenraum('123'), 10);
  assert.equal(zeichenraum('a1'), 36);
  assert.equal(zeichenraum('Aa1'), 62);
  assert.equal(zeichenraum('Aa1!'), 95);
  assert.equal(zeichenraum('ö'), 33, 'Nicht-ASCII zählt als Sonderzeichen');
});

test("entropieBits: '1234' ist winzig, leere Eingabe null", () => {
  assert.equal(entropieBits(''), 0);
  const bits = entropieBits('1234');
  assert.ok(Math.abs(bits - 4 * Math.log2(10)) < 1e-9, `bits=${bits}`);
  assert.ok(bits < 14, 'vier Ziffern müssen winzig bleiben');
});

test('entropieBits: Drei-Wörter-Satz ist groß', () => {
  const satz = kombiniere(['Blauer', 'Dachs', 42, 'Regenschirm']);
  assert.equal(satz, 'BlauerDachs42Regenschirm');
  const bits = entropieBits(satz);
  assert.ok(bits > 120, `nur ${bits} Bits`);
  assert.ok(Math.abs(bits - satz.length * Math.log2(62)) < 1e-9);
});

test('Monotonie: länger = mehr Bits (gleiche Zeichenart)', () => {
  let vorher = 0;
  for (let laenge = 1; laenge <= 24; laenge++) {
    const bits = entropieBits('a'.repeat(laenge));
    assert.ok(bits > vorher, `Bits wachsen nicht bei Länge ${laenge}`);
    vorher = bits;
  }
});

test('Monotonie: mehr Zeichenarten = mehr Bits (gleiche Länge)', () => {
  const stufen = ['aaaaaaaa', 'aaaaaaaA', 'aaaaaa1A', 'aaaaa!1A'];
  let vorher = 0;
  for (const passwort of stufen) {
    const bits = entropieBits(passwort);
    assert.ok(bits > vorher, `"${passwort}" müsste stärker sein als die Stufe davor`);
    vorher = bits;
  }
});

test('knackSekunden: bekannte Werte und Rate', () => {
  assert.equal(knackSekunden(10), 1024 / VERSUCHE_PRO_SEKUNDE);
  assert.equal(knackSekunden(10, 1024), 1);
  assert.equal(VERSUCHE_PRO_SEKUNDE, 10_000_000_000);
});

test('knackzeitText: bekannte Fälle von winzig bis Universum', () => {
  const winzig = knackzeitText(entropieBits('1234'));
  assert.equal(winzig.stufe, 'rot');
  assert.ok(winzig.text.includes('blinzeln'), '1234 fällt sofort');

  // 39 Bits → ~55 Sekunden → Schildkröten-Bereich
  const kurz = knackzeitText(39);
  assert.equal(kurz.stufe, 'rot');
  assert.ok(kurz.text.includes('Schildkröte'));

  // 'Schatz123' → Tage bis Monate → gelb
  const mittel = knackzeitText(entropieBits('Schatz123'));
  assert.equal(mittel.stufe, 'gelb');

  const satz = knackzeitText(entropieBits('BlauerDachs42Regenschirm'));
  assert.equal(satz.stufe, 'gruen');
  assert.ok(satz.text.includes('Universum'), 'der Beispiel-Passsatz überdauert das Universum');
  assert.ok(satz.sekunden / SEKUNDEN_PRO_JAHR > UNIVERSUM_ALTER_JAHRE);
});

test('knackzeitText: Ampel fällt nie zurück, wenn Bits wachsen', () => {
  const rang = { rot: 0, gelb: 1, gruen: 2 };
  let vorher = 0;
  for (let bits = 0; bits <= 200; bits++) {
    const stufe = rang[knackzeitText(bits).stufe];
    assert.ok(stufe !== undefined, `unbekannte Stufe bei ${bits} Bits`);
    assert.ok(stufe >= vorher, `Ampel fällt bei ${bits} Bits zurück`);
    vorher = stufe;
  }
});

test('kombiniere: Großbuchstabe je Teil, Zahl bleibt, Leerraum verschwindet', () => {
  assert.equal(kombiniere(['blauer', 'dachs', 42, 'regenschirm']), 'BlauerDachs42Regenschirm');
  assert.equal(kombiniere(['Lila', 'Igel', 7, 'Roller']), 'LilaIgel7Roller');
  assert.equal(kombiniere([' otter ', '', 'kissen']), 'OtterKissen');
  assert.equal(kombiniere(['Panda', '', 'Muffin']), 'PandaMuffin', 'leere Zahl fällt einfach weg');
  assert.equal(kombiniere([]), '');
});

test('Politik: app.mjs fasst keinen Browser-Speicher an (Passwörter nur im Arbeitsspeicher)', async () => {
  const quelle = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
  assert.ok(
    !/localStorage|sessionStorage|indexedDB|document\.cookie/.test(quelle),
    'app.mjs darf keinerlei Browser-Speicher benutzen - Eingaben dürfen nirgends persistiert werden',
  );
  assert.ok(quelle.includes('installiereNetzwerkWaechter()'), 'Netzwerk-Wächter muss installiert werden');
  assert.ok(
    quelle.indexOf('installiereNetzwerkWaechter()') < quelle.indexOf('fetch('),
    'Netzwerk-Wächter muss vor dem ersten fetch stehen',
  );
});

test("Politik: index.html erzwingt CSP default-src 'self'", async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.ok(html.includes("default-src 'self'"), 'CSP-Meta fehlt');
  assert.ok(html.includes('lang="de"'));
});
