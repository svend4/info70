import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  antwortVon, alleSchritte, sammleLuecken, zaehle,
  istVollstaendigOhneLuecken, pruefbericht,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/pfad.json', import.meta.url), 'utf8'));
const schritte = alleSchritte(daten);

test('Katalog: Grundlage Art. 8, Schritte mit eindeutigen IDs', () => {
  assert.match(daten.quelle, /Art\. 8/, 'Art. 8 als Grundlage');
  assert.match(daten.hinweis, /kein.*Rechtsrat|Selbst|keine externen/i, 'als Selbstprüfung gekennzeichnet');
  assert.ok(schritte.length >= 8, `mindestens 8 Schritte (ist: ${schritte.length})`);
  const ids = schritte.map((s) => s.id);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Schritt-IDs');
});

test('jeder Schritt: Frage, Hilfe, Bezug, ≥2 Antworten mit eindeutigen Werten', () => {
  for (const s of schritte) {
    assert.ok(s.frage.length >= 20, `${s.id}: Frage zu kurz`);
    assert.ok(s.hilfe.length >= 40, `${s.id}: Hilfe zu kurz`);
    assert.match(s.bezug, /DSGVO|Art\.|ErwG/, `${s.id}: Bezug fehlt`);
    assert.ok(s.antworten.length >= 2, `${s.id}: zu wenige Antworten`);
    const werte = s.antworten.map((a) => a.wert);
    assert.equal(new Set(werte).size, werte.length, `${s.id}: doppelte Antwort-Werte`);
    for (const a of s.antworten) {
      assert.ok(a.text.length >= 2, `${s.id}/${a.wert}: Antworttext fehlt`);
      if (a.luecke) assert.ok((a.hinweis ?? '').length >= 10, `${s.id}/${a.wert}: Lücke ohne Hinweis`);
    }
  }
});

test('inhaltliche Abdeckung der Art.-8-Kernpunkte', () => {
  const text = JSON.stringify(daten).toLowerCase();
  assert.match(text, /16/, 'Altersgrenze 16');
  assert.match(text, /elterlich|eltern/, 'Eltern-Zustimmung');
  assert.match(text, /angemessene anstrengungen|verifik/, 'angemessene Anstrengungen/Verifikation');
  assert.match(text, /widerruf/, 'Widerruf');
  assert.match(text, /datenmin|datensparsam/, 'Datenminimierung');
  assert.match(text, /erwg 65|löschrecht|loeschrecht/, 'starkes Löschrecht');
});

test('antwortVon: findet Option oder null', () => {
  const s = schritte[0];
  assert.equal(antwortVon(s, s.antworten[0].wert), s.antworten[0]);
  assert.equal(antwortVon(s, 'gibt-es-nicht'), null);
});

test('sammleLuecken: nur bewertete Lücken-Antworten zählen', () => {
  // finde einen Schritt mit einer Lücken-Antwort
  const lueckenSchritt = schritte.find((s) => s.antworten.some((a) => a.luecke));
  assert.ok(lueckenSchritt, 'Testdaten enthalten mindestens eine Lücken-Antwort');
  const lueckenAntwort = lueckenSchritt.antworten.find((a) => a.luecke);
  const okSchritt = schritte.find((s) => s.antworten.some((a) => !a.luecke));
  const okAntwort = okSchritt.antworten.find((a) => !a.luecke);

  assert.deepEqual(sammleLuecken(daten, {}), [], 'ohne Antworten keine Lücken');
  const luecken = sammleLuecken(daten, { [lueckenSchritt.id]: lueckenAntwort.wert });
  assert.equal(luecken.length, 1);
  assert.equal(luecken[0].id, lueckenSchritt.id);
  assert.equal(luecken[0].hinweis, lueckenAntwort.hinweis);
  // ok-Antwort erzeugt keine Lücke
  assert.equal(sammleLuecken(daten, { [okSchritt.id]: okAntwort.wert }).length, 0);
});

test('zaehle: gesamt/beantwortet/offen/luecken stimmen', () => {
  const z0 = zaehle(daten, {});
  assert.equal(z0.gesamt, schritte.length);
  assert.equal(z0.beantwortet, 0);
  assert.equal(z0.offen, schritte.length);
  assert.equal(z0.luecken, 0);

  const s = schritte[0];
  const z1 = zaehle(daten, { [s.id]: s.antworten[0].wert });
  assert.equal(z1.beantwortet, 1);
  assert.equal(z1.offen, schritte.length - 1);
});

test('istVollstaendigOhneLuecken: alle beantwortet ohne Lücke', () => {
  const guteAntworten = {};
  for (const s of schritte) {
    const gut = s.antworten.find((a) => !a.luecke) ?? s.antworten[0];
    guteAntworten[s.id] = gut.wert;
  }
  assert.equal(istVollstaendigOhneLuecken(daten, guteAntworten), true);
  assert.equal(istVollstaendigOhneLuecken(daten, {}), false);
});

test('pruefbericht: Kopf, Antworten, Lücken-Liste', () => {
  const lueckenSchritt = schritte.find((s) => s.antworten.some((a) => a.luecke));
  const lueckenAntwort = lueckenSchritt.antworten.find((a) => a.luecke);
  const bericht = pruefbericht(daten, { [lueckenSchritt.id]: lueckenAntwort.wert });
  assert.match(bericht, /Einwilligungs-Prüfpfad Art\. 8 DSGVO/);
  assert.match(bericht, /Beantwortet: 1\//);
  assert.match(bericht, /## Antworten/);
  assert.match(bericht, /## Lücken/);
  assert.match(bericht, /kein offizielles Konformitätsergebnis/);

  // vollständig ohne Lücken -> Ergebnis-Abschnitt, keine Lücken-Liste
  const guteAntworten = {};
  for (const s of schritte) guteAntworten[s.id] = (s.antworten.find((a) => !a.luecke) ?? s.antworten[0]).wert;
  const gut = pruefbericht(daten, guteAntworten);
  assert.match(gut, /Keine offenen Lücken/);
  assert.ok(!/## Lücken/.test(gut), 'ohne Lücken keine Lücken-Liste');
});
