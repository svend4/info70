import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { baueKennzeichnung, textSchluessel, escapeHtml } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/texte.json', import.meta.url), 'utf8'));

test('Typen und Stufen: die im Katalog genannten Optionen, eindeutige IDs', () => {
  const typIds = daten.typen.map((t) => t.id);
  assert.deepEqual(typIds.sort(), ['bild', 'chatbot', 'medien', 'text']);
  const stufen = daten.stufen.map((s) => s.id);
  assert.deepEqual(stufen, ['klein', 'mittel', 'gross'], '6-8 / 8-12 / 13-15');
  assert.match(daten.stufen.map((s) => s.name).join(' '), /6.*8.*8.*12.*13.*15/);
  for (const t of daten.typen) assert.ok(t.emoji && t.name && /Art\. 50/.test(t.hinweis), `${t.id}: Meta/AI-Act-Hinweis fehlt`);
});

test('i18n: de/uk/ru decken exakt dieselben Schlüssel ab (Vollständigkeit)', () => {
  assert.deepEqual(Object.keys(daten.texte).sort(), ['de', 'ru', 'uk']);
  const deKeys = Object.keys(daten.texte.de).sort();
  // 4 Typen x 3 Stufen = 12 Kombinationen
  assert.equal(deKeys.length, 12, 'genau 12 Texte je Sprache');
  for (const code of ['uk', 'ru']) {
    assert.deepEqual(Object.keys(daten.texte[code]).sort(), deKeys, `${code}: Schlüssel weichen von de ab`);
  }
});

test('jede Typ/Stufe/Sprache-Kombination liefert einen nicht leeren Text', () => {
  for (const t of daten.typen) {
    for (const s of daten.stufen) {
      for (const code of ['de', 'uk', 'ru']) {
        const wert = daten.texte[code][textSchluessel(t.id, s.id)];
        assert.ok(typeof wert === 'string' && wert.length >= 10, `${code}/${t.id}/${s.id}: Text fehlt`);
      }
    }
  }
});

test('kindgerechte Abstufung: kleiner Text kürzer als der große (je Typ, de)', () => {
  for (const t of daten.typen) {
    const klein = daten.texte.de[textSchluessel(t.id, 'klein')];
    const gross = daten.texte.de[textSchluessel(t.id, 'gross')];
    assert.ok(klein.length < gross.length, `${t.id}: kleiner Text sollte einfacher/kürzer sein`);
  }
});

test('baueKennzeichnung: Text + eigenständiges HTML-Badge, ohne externe Bezüge/Script', () => {
  for (const code of ['de', 'uk', 'ru']) {
    const { text, html, emoji } = baueKennzeichnung(daten, { typ: 'chatbot', stufe: 'mittel', sprache: code });
    assert.ok(text.length >= 10, 'Text vorhanden');
    assert.ok(html.includes(escapeHtml(text)), 'Text steckt im Badge');
    assert.ok(html.includes(emoji), 'Emoji im Badge');
    assert.ok(/style="[^"]*border/.test(html), 'inline-Styling (selbsttragend, keine externe CSS)');
    assert.ok(!/https?:\/\//.test(html), 'kein externer Link');
    assert.ok(!/<script/i.test(html), 'kein Script');
    assert.ok(!/ src=| href=/i.test(html), 'keine externen Ressourcen');
    assert.match(html, new RegExp(`lang="${code}"`), 'Sprach-Attribut gesetzt');
  }
});

test('Chatbot-Badge trägt die Kernaussage „Maschine, kein Mensch“ (Art. 50)', () => {
  const { text } = baueKennzeichnung(daten, { typ: 'chatbot', stufe: 'klein', sprache: 'de' });
  assert.match(text, /Roboter|Maschine|kein.*Mensch/i);
});

test('escapeHtml neutralisiert gefährliche Zeichen', () => {
  assert.equal(escapeHtml('<b>"&"</b>'), '&lt;b&gt;&quot;&amp;&quot;&lt;/b&gt;');
});
