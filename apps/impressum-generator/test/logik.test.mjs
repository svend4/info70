import { test } from 'node:test';
import assert from 'node:assert/strict';
import { FELDER, RECHTSFORMEN, rechtsform, sichtbareFelder, pflichtFelder, fehlendeFelder, baueImpressum, baueImpressumHtml, HINWEISE } from '../logik.mjs';

test('Rechtsformen & Felder: vollständig definiert', () => {
  assert.ok(RECHTSFORMEN.length >= 4);
  const codes = RECHTSFORMEN.map((r) => r.code);
  assert.deepEqual(new Set(codes).size, codes.length, 'eindeutige Codes');
  for (const r of RECHTSFORMEN) {
    assert.ok(r.name, `${r.code}: Name fehlt`);
    for (const f of r.felder) assert.ok(FELDER[f], `${r.code}: Feld ${f} nicht im Katalog`);
    // Basis-Pflichten
    for (const p of ['name', 'strasse', 'plz_ort', 'email']) assert.ok(r.felder.includes(p), `${r.code}: ${p} fehlt`);
  }
});

test('sichtbareFelder: redaktionelle Zusatzfelder nur bei Bedarf', () => {
  assert.ok(!sichtbareFelder('privat', false).includes('redakteur'));
  assert.ok(sichtbareFelder('privat', true).includes('redakteur'));
  assert.ok(sichtbareFelder('privat', true).includes('redakteur_adresse'));
});

test('pflichtFelder: optionale (Telefon, USt-ID) sind NICHT Pflicht', () => {
  const p = pflichtFelder('ggmbh', false);
  assert.ok(!p.includes('telefon'), 'Telefon optional');
  assert.ok(!p.includes('ustid'), 'USt-ID optional');
  assert.ok(p.includes('register'), 'Register ist Pflicht bei gGmbH');
});

test('fehlendeFelder: erkennt leere Pflichtfelder', () => {
  assert.deepEqual(fehlendeFelder('privat', false, { name: 'A', strasse: 'B', plz_ort: 'C', email: 'd@e.f' }), []);
  const fehlt = fehlendeFelder('privat', false, { name: 'A' });
  assert.ok(fehlt.includes('strasse') && fehlt.includes('plz_ort') && fehlt.includes('email'));
});

test('baueImpressum: enthält Pflichtangaben und § 5 DDG', () => {
  const text = baueImpressum('verein', false, {
    name: 'Kinder-Verein e. V.', strasse: 'Musterstr. 1', plz_ort: '12345 Musterstadt',
    email: 'kontakt@verein.de', vertretung: '1. Vorsitzende Mia Muster', register: 'VR 1234 Amtsgericht Musterstadt',
  });
  assert.match(text, /§ 5 DDG/);
  assert.match(text, /Kinder-Verein e\. V\./);
  assert.match(text, /Vertreten durch: 1\. Vorsitzende Mia Muster/);
  assert.match(text, /Register: VR 1234/);
  assert.match(text, /E-Mail: kontakt@verein\.de/);
});

test('baueImpressum: redaktionelle Zusatzangabe nach § 18 MStV', () => {
  const text = baueImpressum('privat', true, {
    name: 'Mia Muster', strasse: 'Weg 2', plz_ort: '1 Ort', email: 'a@b.de',
    redakteur: 'Mia Muster', redakteur_adresse: 'Weg 2, 1 Ort',
  });
  assert.match(text, /§ 18 Abs\. 2 MStV/);
  assert.match(text, /Verantwortlich für den Inhalt/);
  // ohne redaktionell darf die Zeile fehlen
  const ohne = baueImpressum('privat', false, { name: 'M', strasse: 'W', plz_ort: 'O', email: 'a@b.de' });
  assert.ok(!/MStV/.test(ohne));
});

test('baueImpressumHtml: valides einfaches HTML mit h1 und p', () => {
  const html = baueImpressumHtml('privat', false, { name: 'M', strasse: 'W', plz_ort: 'O', email: 'a@b.de' });
  assert.match(html, /<h1>Impressum/);
  assert.match(html, /<p>/);
  assert.ok(!/<script/i.test(html), 'kein Script im generierten HTML');
});

test('Hinweise: die häufig vergessenen Kinderseiten-Angaben', () => {
  const text = HINWEISE.join(' ');
  assert.match(text, /§ 18 MStV/, 'redaktionelle Verantwortung');
  assert.match(text, /ladungsfähige Anschrift/, 'echte Adresse');
});
