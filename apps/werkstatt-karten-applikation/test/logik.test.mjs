import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/karten.json' with { type: 'json' };
import {
  alleGewaehlt, alleKennungen, alleKnopfKennungen, auswahlKennung, filterKennung, gewaehlteKarten,
  kannDrucken, kartenText, sichtbar, sichtbareAbwaehlen, sichtbareWaehlen, umschalten, zaehlerText, zeileText,
} from '../logik.mjs';

// Prüft Daten und Auswahl. Die Regeln der Umgebung (Eingabefelder, Speicherung,
// Netz, Druckzeichen, Fokus, Testzahl) stehen in test/regeln.test.mjs.

const TECHNIK = daten.karten.filter((k) => k.art === 'technik');
const ERGAENZUNG = daten.karten.filter((k) => k.art === 'ergaenzung');
const THEMEN = daten.karten.filter((k) => k.art === 'thema');

// Seiten, die in der Quelle belegt sind: 6 und 9 (Gruppe, Stundenplan), 126 (Sicherheit),
// 181 (Applikation), 197 (Ergebnisindikator), 282 und 283 (Gruppe 5 bis 7).
const ERLAUBTE_SEITEN = [6, 9, 126, 181, 197, 282, 283];
const SEITE = /^(Eigenentwurf(, (Quelle|Anregung) S\. \d+)?|S\. \d+(–\d+)?)$/;

// Die 25 Werkthemen aus der Quelle, S. 181, in Listenfolge (nur die Titel).
const QUELLTITEL_LISTE = [
  'Приключения Колобка', 'Я и щенок', 'Я еду на поезде (машине, автобусе)', 'Я лечу на самолете',
  'Мы с папой идем за грибами', 'Что сверху видит солнышко', 'Праздник зверей',
  'Натюрморт (овощи и фрукты)', 'Цыпленок и бабочка', 'Ромашковый луг', 'Радуга над моим домом',
  'Яблоня в цвету', 'Плывут кораблики', 'Полет ракеты', 'Веселый хоровод', 'В подарок маме (бабушке)',
  'К нам с юга птицы прилетели', 'Шапочка и варежки для куклы', 'Лесная красавица',
  'Сказочные лошадки', 'Веселая дудочка', 'Платочек для бабушки, веночек для внучки',
  'Красивая одежда', 'Для чего такой узор', 'Жар-птица',
];

// Alle Seitennummern einer Angabe, auch die beiden Enden eines Bereichs „S. n–m“.
function seitenIn(text) {
  const nummern = [];
  for (const m of text.matchAll(/S\. (\d+)(?:–(\d+))?/g)) {
    nummern.push(Number(m[1]));
    if (m[2]) nummern.push(Number(m[2]));
  }
  return nummern;
}

test('Daten: 3 Technikkarten, 1 Ergänzungskarte, 25 Themenkarten; IDs eindeutig; Pflichtfelder gesetzt', () => {
  assert.equal(TECHNIK.length, 3, 'es müssen 3 Technikkarten sein');
  assert.equal(ERGAENZUNG.length, 1, 'es muss genau eine Ergänzungskarte geben');
  assert.equal(THEMEN.length, 25, 'es müssen 25 Themenkarten sein');
  const ids = alleKennungen(daten);
  assert.equal(new Set(ids).size, ids.length, 'doppelte Kennungen');
  for (const k of daten.karten) {
    assert.ok(k.titel && k.quelle && k.fuss, `${k.id}: Titel, Quelle oder Fußzeile fehlt`);
    assert.ok(Array.isArray(k.abschnitte) && k.abschnitte.length >= 1, `${k.id}: keine Abschnitte`);
    for (const a of k.abschnitte) {
      assert.ok(a.ueberschrift && a.zeilen.length >= 1, `${k.id}: Abschnitt ohne Überschrift oder Zeilen`);
    }
  }
});

test('Reihenfolge: Technikkarten, dann Ergänzung, dann die Themen in Listenfolge 1 bis 25 mit den Quelltiteln aus S. 181', () => {
  assert.deepEqual(alleKennungen(daten).slice(0, 4), ['schneiden', 'reissen', 'kleben', 'ergaenzung-collage-flora']);
  assert.deepEqual(THEMEN.map((t) => t.nr), Array.from({ length: 25 }, (_, i) => i + 1));
  assert.deepEqual(THEMEN.map((t) => t.quelltitel), QUELLTITEL_LISTE);
});

test('Quelle je Karte beginnt mit „Praleska, S.“ und nennt nur Seiten, die in der Quelle belegt sind', () => {
  for (const k of daten.karten) {
    assert.match(k.quelle, /^Praleska, S\. \d+/, `${k.id}: Quelle beginnt falsch`);
    for (const n of seitenIn(k.quelle)) {
      assert.ok(ERLAUBTE_SEITEN.includes(n), `${k.id}: S. ${n} ist nicht belegt`);
    }
  }
});

test('jede Zeile trägt eine belegte Seite oder die Kennzeichnung Eigenentwurf', () => {
  for (const k of daten.karten) {
    for (const a of k.abschnitte) {
      for (const z of a.zeilen) {
        assert.ok(z.seite, `${k.id}: Zeile ohne Seitenangabe: ${z.text}`);
        assert.match(z.seite, SEITE, `${k.id}: Seitenangabe „${z.seite}“ hat ein falsches Format`);
        for (const n of seitenIn(z.seite)) {
          assert.ok(ERLAUBTE_SEITEN.includes(n), `${k.id}: S. ${n} ist nicht belegt`);
        }
      }
    }
  }
});

test('russische Zitate haben höchstens 12 Wörter; jeder Quelltitel steht als Zitat auf seiner Karte', () => {
  for (const k of daten.karten) {
    for (const [, zitat] of kartenText(k).matchAll(/„([^“]+)“/g)) {
      const woerter = zitat.trim().split(/\s+/).length;
      assert.ok(woerter <= 12, `${k.id}: Zitat mit ${woerter} Wörtern: ${zitat}`);
    }
  }
  for (const t of THEMEN) {
    assert.ok(kartenText(t).includes(`„${t.quelltitel}“`), `${t.id}: Quelltitel nicht als Zitat`);
  }
});

test('Eigenentwurf ist gekennzeichnet: jede Karte, jede Schrittfolge, jede Übertragung eines Thementitels', () => {
  for (const k of daten.karten) {
    assert.match(kartenText(k), /Eigenentwurf/, `${k.id}: ohne Kennzeichnung als Eigenentwurf`);
    for (const a of k.abschnitte.filter((x) => x.art === 'schritte')) {
      assert.match(a.ueberschrift, /Eigenentwurf/, `${k.id}: Schrittfolge nicht als Eigenentwurf gekennzeichnet`);
      for (const z of a.zeilen) {
        assert.match(z.seite, /^Eigenentwurf/, `${k.id}: Schritt ohne Kennzeichnung: ${z.text}`);
      }
    }
  }
  for (const t of THEMEN) {
    assert.ok(
      t.abschnitte[0].zeilen.some((z) => z.seite === 'Eigenentwurf' && /Übertragung/.test(z.text)),
      `${t.id}: Übertragung des Titels nicht als Eigenentwurf gekennzeichnet`,
    );
  }
});

test('Schneiden: Lehrziel S. 181, Ergebnisindikator S. 197, Sicherheitssatz als Eigenentwurf mit Quelle S. 126', () => {
  const karte = daten.karten.find((k) => k.id === 'schneiden');
  const zeilen = karte.abschnitte.flatMap((a) => a.zeilen);
  assert.ok(
    zeilen.some((z) => z.seite === 'S. 181' && z.text.includes('„обучать технике работы с ножницами“')),
    'Lehrziel S. 181 fehlt',
  );
  assert.ok(
    zeilen.some((z) => z.seite === 'S. 197' && z.text.includes('„умеет резать ножницами по прямой, частично по кривой“')),
    'Ergebnisindikator S. 197 fehlt',
  );
  const sicherheit = karte.abschnitte.find((a) => /Sicherheitssatz/.test(a.ueberschrift));
  assert.ok(sicherheit, 'Sicherheitssatz fehlt');
  assert.match(sicherheit.ueberschrift, /Eigenentwurf.*S\. 126/);
  assert.ok(sicherheit.zeilen.some((z) => z.seite === 'Eigenentwurf, Quelle S. 126'), 'Sicherheitssatz nicht als Eigenentwurf gekennzeichnet');
  assert.ok(
    sicherheit.zeilen.some((z) => z.seite === 'S. 126' && z.text.includes('„при работе с ножницами и другими острыми предметами“')),
    'Quellenzitat S. 126 fehlt',
  );
});

test('Technikbereiche ohne Reihenfolge: die drei Technikkarten nennen weder Collage, Naturmaterial noch Flora oder Gruppe 5', () => {
  for (const k of TECHNIK) {
    assert.ok(!/Collage|Naturmaterial|Flora|Gruppe 5/i.test(kartenText(k)), `${k.id}: Inhalt der Ergänzung auf einer Technikkarte`);
    assert.ok(/ohne Reihenfolge/.test(k.fuss), `${k.id}: Fußzeile sagt nicht „ohne Reihenfolge“`);
  }
  const [erg] = ERGAENZUNG;
  assert.match(erg.titel, /Gruppe 5–7, S\. 282–283/);
  assert.ok(
    erg.abschnitte.some((a) => a.zeilen.some((z) => z.seite === 'S. 282–283' && /Naturmaterial/.test(z.text))),
    'Naturmaterial-Collage ist nicht der Gruppe 5 bis 7 zugeordnet',
  );
  assert.match(kartenText(erg), /Eigenentwurf/);
});

test('jede Themenkarte hat eine vorhandene Gruppe, und jede Gruppe ist belegt', () => {
  const gruppenIds = daten.gruppen.map((g) => g.id);
  for (const t of THEMEN) {
    assert.ok(gruppenIds.includes(t.gruppe), `${t.id}: unbekannte Gruppe ${t.gruppe}`);
  }
  for (const id of gruppenIds) {
    assert.ok(THEMEN.some((t) => t.gruppe === id), `Gruppe ${id} ist leer`);
  }
});

test('Auswahl: nur gewählte Karten, feste Reihenfolge, unbekannte Kennungen ignoriert, keine Dubletten', () => {
  const karten = gewaehlteKarten(daten, ['thema-kolobok', 'schneiden', 'unbekannt', 'schneiden']);
  assert.deepEqual(karten.map((k) => k.id), ['schneiden', 'thema-kolobok']);
  const alle = alleGewaehlt(daten);
  assert.equal(alle.size, daten.karten.length);
  const ohne = umschalten(alle, 'kleben');
  assert.equal(ohne.has('kleben'), false);
  assert.equal(alle.has('kleben'), true, 'das Original darf nicht verändert werden');
  assert.equal(umschalten(ohne, 'kleben').has('kleben'), true);
});

test('Filter: der Technik-Filter wirkt nur auf Technikkarten, der Themen-Filter nur auf Themenkarten', () => {
  assert.equal(sichtbar(daten).length, 29, 'ohne Filter sind alle Karten sichtbar');
  const schneiden = sichtbar(daten, { technik: 'schneiden' });
  assert.deepEqual(schneiden.filter((k) => k.art !== 'thema').map((k) => k.id), ['schneiden']);
  assert.equal(schneiden.filter((k) => k.art === 'thema').length, 25, 'der Technik-Filter darf Themen nicht ausblenden');
  const tiere = sichtbar(daten, { gruppe: 'tiere-maerchen' });
  assert.equal(tiere.filter((k) => k.art !== 'thema').length, 4, 'der Themen-Filter darf Technikkarten nicht ausblenden');
  assert.equal(tiere.filter((k) => k.art === 'thema').length, 7);
  const kombi = sichtbar(daten, { technik: 'kleben', gruppe: 'unterwegs' });
  assert.deepEqual(kombi.map((k) => k.id), ['kleben', 'thema-fahrzeuge', 'thema-flugzeug', 'thema-schiffe', 'thema-rakete']);
});

test('Alle sichtbaren wählen und abwählen: nur die sichtbaren Karten ändern sich', () => {
  const sichtbare = sichtbar(daten, { gruppe: 'unterwegs' }).map((k) => k.id);
  const leer = new Set();
  const gewaehlt = sichtbareWaehlen(leer, sichtbare);
  assert.deepEqual([...gewaehlt].sort(), [...sichtbare].sort());
  assert.equal(leer.size, 0, 'das Original bleibt leer');
  // thema-kolobok ist bei diesem Filter nicht sichtbar und darf unverändert bleiben.
  const mitAnderen = sichtbareWaehlen(new Set(['thema-kolobok']), sichtbare);
  assert.equal(mitAnderen.has('thema-kolobok'), true);
  assert.deepEqual([...sichtbareAbwaehlen(mitAnderen, sichtbare)], ['thema-kolobok']);
});

test('Druck entspricht der Auswahl: n gewählte Karten ergeben genau n Karten; ohne Auswahl kein Druck', () => {
  const alle = alleKennungen(daten);
  for (let n = 0; n <= alle.length; n++) {
    const karten = gewaehlteKarten(daten, alle.slice(0, n));
    assert.equal(karten.length, n, `bei ${n} gewählten Karten`);
    assert.equal(kannDrucken(karten), n > 0, `kannDrucken bei ${n} Karten`);
  }
});

test('zeileText hängt die Seite in Klammern an; zaehlerText nennt Zahl und Blattregel', () => {
  assert.equal(zeileText({ text: 'Lehrziel', seite: 'S. 181' }), 'Lehrziel (S. 181)');
  assert.equal(zeileText({ text: 'ohne Seite' }), 'ohne Seite');
  assert.equal(zaehlerText(3, 29), '3 von 29 Karten gewählt. Jede Karte kommt auf ein eigenes Blatt A4 quer.');
});

test('Knopf-Kennungen: jede Kennung ist eindeutig; jede Karte hat einen Auswahlknopf; Filter sind vollständig', () => {
  const kennungen = alleKnopfKennungen(daten);
  assert.equal(new Set(kennungen).size, kennungen.length, 'doppelte Knopf-Kennung');
  for (const k of daten.karten) {
    assert.ok(kennungen.includes(auswahlKennung(k.id)), `${k.id}: kein Auswahlknopf`);
  }
  assert.ok(kennungen.includes(filterKennung('technik', 'ergaenzung')));
  assert.ok(kennungen.includes(filterKennung('gruppe', 'feste-muster')));
});

test('Quellenhinweise: Altersgruppe 3 bis 5 Jahre (S. 6), Ausgabe der Quelle, Katalogeintrag Einheit №17 aus Zeile 483', () => {
  assert.equal(daten.titel, 'Werkstatt-Karten: Schneiden, Reissen, Kleben');
  assert.match(daten.untertitel, /3 bis 5 Jahre \(Praleska, S\. 6\)/);
  assert.match(daten.quellenHinweis, /Minsk: НИО \(Национальный институт образования\), 2007\. ISBN 978-985-465-244-3/);
  assert.match(daten.katalog, /^Katalogeintrag docs\/10, Abschnitt Printmaterialien, Einheit №17 \(Zeile 483\)\./);
});
