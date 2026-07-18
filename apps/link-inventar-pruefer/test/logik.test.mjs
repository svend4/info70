import { test } from 'node:test';
import assert from 'node:assert/strict';
import { extrahiereLinks, klassifiziere, statistik, bericht, PRUEFPUNKTE } from '../logik.mjs';

test('klassifiziere: Muster ohne Netzwerk', () => {
  assert.equal(klassifiziere('/intern/seite.html'), 'intern');
  assert.equal(klassifiziere('seite.html'), 'intern');
  assert.equal(klassifiziere('https://example.org/x'), 'extern');
  assert.equal(klassifiziere('https://www.youtube.com/watch?v=1'), 'video');
  assert.equal(klassifiziere('https://instagram.com/x'), 'social');
  assert.equal(klassifiziere('https://play.google.com/store/apps/x'), 'appstore');
  assert.equal(klassifiziere('https://amazon.de/x'), 'shop');
  assert.equal(klassifiziere('mailto:a@b.de'), 'mailto');
  assert.equal(klassifiziere('#kapitel'), 'anker');
});

test('extrahiereLinks: findet href und src, dedupliziert, filtert Anker', () => {
  const html = `
    <a href="/start">intern</a>
    <a href="https://example.org">extern</a>
    <img src="bild.png">
    <a href="https://youtube.com/x">video</a>
    <a href="https://example.org">dublette</a>
    <a href="#oben">anker</a>
    <script src="https://cdn.fremd.com/a.js"></script>`;
  const links = extrahiereLinks(html);
  const urls = links.map((l) => l.url);
  assert.ok(urls.includes('/start'));
  assert.ok(urls.includes('https://example.org'));
  assert.ok(urls.includes('bild.png'));
  assert.ok(urls.includes('https://youtube.com/x'));
  assert.ok(urls.includes('https://cdn.fremd.com/a.js'), 'auch script-src erfasst');
  assert.equal(urls.filter((u) => u === 'https://example.org').length, 1, 'dedupliziert');
  assert.ok(!urls.includes('#oben'), 'Anker ignoriert');
});

test('extern-Flag: nur echte externe Ziele', () => {
  const links = extrahiereLinks('<a href="/x">a</a><a href="https://amazon.de">s</a>');
  assert.equal(links.find((l) => l.url === '/x').extern, false);
  assert.equal(links.find((l) => l.url === 'https://amazon.de').extern, true);
});

test('statistik: zählt gesamt/extern/Kategorien', () => {
  const links = extrahiereLinks('<a href="/a">a</a><a href="https://youtube.com/1">v</a><a href="https://shop.example/x">s</a>');
  const s = statistik(links);
  assert.equal(s.gesamt, 3);
  assert.equal(s.extern, 2);
  assert.equal(s.kategorien.video, 1);
});

test('Prüfpunkte: die Katalog-Kriterien je Link', () => {
  const ids = PRUEFPUNKTE.map((p) => p.id);
  for (const pflicht of ['kindgeeignet', 'gekennzeichnet']) assert.ok(ids.includes(pflicht), `Prüfpunkt fehlt: ${pflicht}`);
  for (const p of PRUEFPUNKTE) assert.ok(p.text && p.bezug, `${p.id}: Text/Bezug fehlt`);
});

test('bericht: listet externe Links mit Prüfpunkten, ehrlich bei 0', () => {
  const links = extrahiereLinks('<a href="https://example.org">e</a><a href="/intern">i</a>');
  const b = bericht(links, { 'https://example.org::kindgeeignet': true });
  assert.match(b, /Links gesamt: 2, davon extern: 1/);
  assert.match(b, /## https:\/\/example\.org/);
  assert.match(b, /\[x\] Ziel ist kindgeeignet/);
  assert.match(b, /\[ \] Als externer Link gekennzeichnet/);
  assert.ok(!/intern/.test(b.split('##')[1] ?? ''), 'interne Links nicht als extern gelistet');

  const leer = bericht(extrahiereLinks('<a href="/nur/intern">x</a>'));
  assert.match(leer, /Keine externen Links gefunden/);
});

test('Sicherheit: Logik macht keinen Netzwerkzugriff (rein textbasiert)', () => {
  // extrahiereLinks darf mit beliebigem Text nicht werfen und nichts nachladen.
  assert.doesNotThrow(() => extrahiereLinks('<a href=ohne-quotes>x</a> plain text'));
  const links = extrahiereLinks('<a href=ohne-quotes>x</a>');
  assert.ok(links.some((l) => l.url === 'ohne-quotes'));
});
