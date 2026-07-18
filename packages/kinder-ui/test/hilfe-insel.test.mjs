import { test } from 'node:test';
import assert from 'node:assert/strict';
import { HILFE_NUMMER, ELTERN_NUMMER, HILFE_TEXTE } from '../js/hilfe-insel.mjs';

test('Nummern: die kostenlosen, anonymen Hilfe-Nummern sind korrekt', () => {
  assert.equal(HILFE_NUMMER, '116 111');
  assert.equal(ELTERN_NUMMER, '0800 111 0 550');
});

test('Hilfe-Texte: Recht auf Hilfe, kein Chat/Petzen-Ton, Anonymität betont', () => {
  assert.match(HILFE_TEXTE.ermutigung, /Recht auf Hilfe/, 'Kernbotschaft: Recht auf Hilfe');
  assert.match(HILFE_TEXTE.ermutigung, /mutig/, 'ermutigend, nicht beschämend');
  assert.match(HILFE_TEXTE.wasTun, /Erwachsene/, 'Vertrauensperson zuerst');
  assert.match(HILFE_TEXTE.hinweis, /anonym/, 'Anonymität als Schwellen-Senker');
  assert.ok(HILFE_TEXTE.nummer === HILFE_NUMMER);
  assert.ok(HILFE_TEXTE.eltern.includes(ELTERN_NUMMER), 'Elterntelefon dabei');
});

test('Baustein-Charakter: rein textlich, keine URLs/externen Verweise', () => {
  const alles = Object.values(HILFE_TEXTE).join(' ');
  assert.ok(!/https?:\/\//.test(alles), 'keine externen Links (kein Request, kein Chat)');
});
