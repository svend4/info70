import { test } from 'node:test';
import assert from 'node:assert/strict';
import { baueErklaerung, leseBfsgProtokoll, markdownZuHtml, KONFORMITAET } from '../logik.mjs';

test('leseBfsgProtokoll: liest „Erfüllt: X von Y“ und leitet Konformität ab', () => {
  assert.deepEqual(leseBfsgProtokoll('BFSG-Check\nErfüllt: 10 von 10\n')?.konformitaet, 'voll');
  assert.deepEqual(leseBfsgProtokoll('Erfüllt: 6 von 10')?.konformitaet, 'teilweise');
  assert.deepEqual(leseBfsgProtokoll('Erfüllt: 2 von 10')?.konformitaet, 'nicht');
  const r = leseBfsgProtokoll('Erfüllt: 7 von 14');
  assert.equal(r.erfuellt, 7);
  assert.equal(r.gesamt, 14);
  assert.equal(leseBfsgProtokoll('kein passender Text'), null);
});

test('baueErklaerung: vollständige Angaben erscheinen im Text', () => {
  const { markdown } = baueErklaerung({
    anbieter: 'Kinder-Werkstatt e. V.', url: 'https://beispiel.example', stand: '18.07.2026',
    konformitaet: 'teilweise', bekannteBarrieren: ['Ein Video hat noch keine Untertitel.'],
    kontaktName: 'Redaktion', kontaktEmail: 'kontakt@beispiel.example',
  });
  assert.match(markdown, /Kinder-Werkstatt e\. V\./);
  assert.match(markdown, /beispiel\.example/);
  assert.match(markdown, /18\.07\.2026/);
  assert.match(markdown, /teilweise konform/);
  assert.match(markdown, /keine Untertitel/);
  assert.match(markdown, /kontakt@beispiel\.example/);
});

test('baueErklaerung: enthält alle Pflichtabschnitte inkl. Leichter Sprache', () => {
  const { markdown, abschnitte } = baueErklaerung({});
  for (const pflicht of ['Stand der Vereinbarkeit', 'Nicht barrierefreie Inhalte', 'In einfacher Sprache', 'Feedback und Kontakt', 'Durchsetzungsverfahren']) {
    assert.ok(abschnitte.includes(pflicht), `Abschnitt fehlt: ${pflicht}`);
  }
  assert.match(markdown, /BFSG/);
  assert.match(markdown, /EN 301 549|WCAG 2\.1/, 'technischer Maßstab');
  assert.match(markdown, /Schlichtungsstelle|Durchsetzungs/, 'Durchsetzungshinweis');
});

test('baueErklaerung: Konformitätsvarianten werden abgebildet', () => {
  assert.match(baueErklaerung({ konformitaet: 'voll' }).markdown, /vollständig konform/);
  assert.match(baueErklaerung({ konformitaet: 'nicht' }).markdown, /nicht konform/);
  // Default (ungültig) -> teilweise
  assert.match(baueErklaerung({ konformitaet: 'quatsch' }).markdown, /teilweise konform/);
  assert.deepEqual(Object.keys(KONFORMITAET).sort(), ['nicht', 'teilweise', 'voll']);
});

test('baueErklaerung: leere Angaben liefern Platzhalter, keinen Absturz', () => {
  const { markdown } = baueErklaerung({});
  assert.match(markdown, /\[Anbieter/);
  assert.match(markdown, /keine wesentlichen Barrieren bekannt/);
});

test('HTML-Ausgabe: gültige Struktur, ohne Script/externe Bezüge', () => {
  const { html } = baueErklaerung({ anbieter: 'Test', bekannteBarrieren: ['a', 'b'] });
  assert.match(html, /<h1>/);
  assert.match(html, /<h2>/);
  assert.match(html, /<ul>[\s\S]*<li>/);
  assert.ok(!/<script/i.test(html), 'kein Script');
  assert.ok(!/https?:\/\/[^\s"]+\.(js|css)/i.test(html), 'keine externen Assets');
  assert.ok(!/ src=| href=/i.test(html), 'keine externen Ressourcen');
});

test('markdownZuHtml: escapt gefährliche Zeichen im Inhalt', () => {
  const html = markdownZuHtml('Ein <script>-Versuch & Co.');
  assert.ok(html.includes('&lt;script&gt;'), 'Winkelklammern escaped');
  assert.ok(!/<script/i.test(html), 'kein echtes Script-Tag');
});
