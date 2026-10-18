import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/stationen.json' with { type: 'json' };
import {
  alleGewaehlt, alleKennungen, gewaehlteKarten, kannDrucken, kartenText, umschalten, zeileText,
} from '../logik.mjs';

// Prüft Daten und Auswahl. Die Regeln der Umgebung (Eingabefelder, Speicherung,
// Netz, Druckzeichen, Testzahl) stehen in test/regeln.test.mjs.

const ART = (art) => daten.karten.filter((k) => k.art === art);
const ALLE_ZEILEN = (karte) => karte.abschnitte.flatMap((a) => a.zeilen);
const QUELLE_FORMAT = /^Praleska, S\. (\d+)(?:–(\d+))?$/;
const ZIEL = 'Ziel: Spiel nach vereinfachten Regeln (S. 229–230)';
const ERLAUBTE_SEITEN = new Set([6, 224, 225, 226, 227, 228, 229, 230]);

// Gültige Seite: „S. n“ oder „S. n–m“. Erlaubt sind die Seite 6 und die Seiten 224 bis 230.
function seiteGueltig(text) {
  const m = text.match(/^S\. (\d+)(?:–(\d+))?$/);
  if (!m) return false;
  const von = Number(m[1]);
  const bis = m[2] ? Number(m[2]) : von;
  if (von > bis) return false;
  for (let s = von; s <= bis; s++) {
    if (!ERLAUBTE_SEITEN.has(s)) return false;
  }
  return true;
}

test('Daten: 22 Karten nach Art (8 Sportspiele, 5 Sportübungen, 6 benannte Spiele, 2 Wettbewerbe, 1 Übersicht), IDs eindeutig, Pflichtfelder gesetzt', () => {
  assert.equal(ART('sportspiel').length, 8, 'Sportspiele');
  assert.equal(ART('sportuebung').length, 5, 'Sportübungen');
  assert.equal(ART('benanntes-spiel').length, 6, 'benannte Spiele');
  assert.equal(ART('wettbewerb').length, 2, 'Wettbewerbe');
  assert.equal(ART('uebersicht').length, 1, 'Übersicht');
  assert.equal(daten.karten.length, 22);
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

test('feste Reihenfolge: Übersicht, dann Sportspiele, Sportübungen, benannte Spiele, Wettbewerbe', () => {
  assert.deepEqual(alleKennungen(daten), [
    'uebersicht',
    'gorodki', 'basketball', 'tischtennis', 'badminton', 'handball', 'fussball', 'hockey', 'lapta',
    'schlittenfahren', 'gleiten-eisbahn', 'skilaufen', 'fahrrad', 'schwimmen',
    'kto-pervyj', 'slalom', 'dogoni', 'shire-shag', 'ne-zadenj', 'po-sledam',
    'wettbewerb-rollen', 'wettbewerb-prellen',
  ]);
});

test('Quelle je Karte: „Praleska, S. n“ oder „S. n–m“; jede Zeilenseite gültig (Seite 6 und 224 bis 230)', () => {
  for (const k of daten.karten) {
    assert.match(k.quelle, QUELLE_FORMAT, `${k.id}: Quelle „${k.quelle}“ hat nicht das Format`);
    assert.ok(seiteGueltig(k.quelle.replace('Praleska, ', '')), `${k.id}: Seite außerhalb der Quelle`);
    for (const z of ALLE_ZEILEN(k)) {
      if (z.seite) assert.ok(seiteGueltig(z.seite), `${k.id}: ungültige Seite „${z.seite}“`);
    }
  }
  assert.match(daten.quellenHinweis, /Minsk: НИО \(Национальный институт образования\), 2007\. ISBN 978-985-465-244-3\./);
  assert.match(daten.katalog, /^Katalogeintrag docs\/10, Z\. 484 \(Einheit 18\)/);
});

test('jede Karte nennt eine Seite; Spiel-, Übungs- und Wettbewerbskarten tragen sie zusätzlich in einer Zeile', () => {
  for (const k of daten.karten) {
    assert.match(kartenText(k), /S\. \d+/, `${k.id}: keine Seitenangabe`);
    if (k.art !== 'uebersicht') {
      assert.ok(ALLE_ZEILEN(k).some((z) => z.seite), `${k.id}: keine Seite an einer Zeile`);
    }
  }
});

test('Ziel-Zeile „Ziel: Spiel nach vereinfachten Regeln (S. 229–230)“ nur auf den acht Sportspielkarten; Übungen, benannte Spiele und Wettbewerbe haben sie nicht', () => {
  const mitZiel = daten.karten.filter((k) => ALLE_ZEILEN(k).some((z) => zeileText(z) === ZIEL)).map((k) => k.id);
  assert.deepEqual(mitZiel, ART('sportspiel').map((k) => k.id), 'Ziel-Zeile nicht genau auf den Sportspielen');
  for (const k of [...ART('sportuebung'), ...ART('benanntes-spiel'), ...ART('wettbewerb')]) {
    assert.ok(!kartenText(k).includes('vereinfachten Regeln'), `${k.id}: „vereinfachten Regeln“ steht ohne Quellenbeleg auf der Karte`);
    assert.ok(!k.abschnitte.some((a) => a.ueberschrift === 'Einordnung'), `${k.id}: Einordnung ohne Quellenbeleg`);
  }
  // Auf der Basketballkarte steht das Wort aus der Quelle („командную игру по упрощенным правилам“).
  assert.ok(kartenText(daten.karten.find((k) => k.id === 'basketball')).includes('Mannschaftsspiel nach vereinfachten Regeln'));
});

test('Namen aus der Quelle: jede Karte nennt den russischen Namen so, wie die Quelle ihn schreibt', () => {
  const namen = {
    gorodki: 'Городки', basketball: 'Баскетбол', tischtennis: 'Настольный теннис', badminton: 'Бадминтон',
    handball: 'Ручной мяч', fussball: 'Футбол', hockey: 'хоккей на траве', lapta: 'Русская лапта',
    schlittenfahren: 'Катание на санках', 'gleiten-eisbahn': 'Скольжение по ледяным дорожкам',
    skilaufen: 'Ходьба на лыжах', fahrrad: 'Катание на двухколесном велосипеде', schwimmen: 'Подготовка к плаванию',
    'kto-pervyj': 'Кто первый повернется', slalom: 'Слалом', dogoni: 'Догони', 'shire-shag': 'Шире шаг',
    'ne-zadenj': 'Не задень', 'po-sledam': 'По следам',
    'wettbewerb-rollen': 'Кто быстрее прокатит мяч',
    'wettbewerb-prellen': 'Кто большее количество раз отобьет мяч об пол',
  };
  for (const [id, wort] of Object.entries(namen)) {
    const karte = daten.karten.find((k) => k.id === id);
    assert.ok(karte, `${id}: Karte fehlt`);
    assert.ok(kartenText(karte).toLowerCase().includes(wort.toLowerCase()), `${id}: Name „${wort}“ fehlt`);
  }
});

test('Eigenentwurf-Kennzeichnung: jede Karte trägt das Wort; jede Spiel-, Übungs- und Wettbewerbsform ist so überschrieben; Klammer-Titel sind als Übertragung gekennzeichnet', () => {
  for (const k of daten.karten) {
    assert.match(kartenText(k), /Eigenentwurf/, `${k.id}: ohne Kennzeichnung`);
  }
  for (const k of daten.karten.filter((x) => x.art !== 'uebersicht')) {
    assert.ok(k.abschnitte.some((a) => /\(Eigenentwurf\)/.test(a.ueberschrift)),
      `${k.id}: Spiel- oder Übungsform nicht als Eigenentwurf überschrieben`);
  }
  // Deutscher Titel in Klammern (Hockey hat „(Sportart offen)“, das ist keine Übertragung).
  const klammern = daten.karten.filter((k) => /^\S.*\(.+\)$/.test(k.titel) && !/Sportart offen/.test(k.titel));
  for (const id of ['dogoni', 'ne-zadenj', 'wettbewerb-rollen', 'wettbewerb-prellen']) {
    assert.ok(klammern.some((k) => k.id === id), `${id}: Klammer-Titel nicht erkannt`);
  }
  for (const k of klammern) {
    assert.ok(kartenText(k).includes('Der Titel in Klammern ist eine Übertragung (Eigenentwurf).'), `${k.id}: Klammer-Titel nicht als Übertragung gekennzeichnet`);
  }
});

test('Sicherheit: die Quelle nennt Sicherheitsaufgaben nur auf S. 224 (Schlittenfahren, Gehen auf Glatteis, Skilaufen); bei Fahrrad und Schwimmen nennt sie keine Regel, nur das allgemeine Ziel auf S. 222; sonst ist Sicherheit Eigenentwurf; keine Aussage „keine Sicherheitsregeln“', () => {
  const aus224 = ['schlittenfahren', 'gleiten-eisbahn', 'skilaufen'];
  const ohneRegel = ['fahrrad', 'schwimmen'];
  const satzOhneRegel = 'Die Quelle nennt keine Regel speziell für diese Übung; allgemein nennt sie auf S. 222 als Aufgabe das Einhalten von Regeln der Bewegungssicherheit. Konkrete Regeln sind Eigenentwurf.';
  for (const k of daten.karten) {
    const text = kartenText(k);
    assert.ok(!/keine Sicherheitsregeln/.test(text), `${k.id}: falsche Aussage „keine Sicherheitsregeln“`);
    if (aus224.includes(k.id)) {
      assert.ok(text.includes('S. 224') && /sichere Fallen/.test(text), `${k.id}: Sicherheitsaufgabe aus S. 224 fehlt`);
    } else if (ohneRegel.includes(k.id)) {
      assert.ok(text.includes(satzOhneRegel), `${k.id}: Satz „keine Regel speziell für diese Übung“ mit S. 222 fehlt`);
    } else {
      assert.match(text, /Sicherheit[^.]*Eigenentwurf/, `${k.id}: Sicherheit nicht als Eigenentwurf gekennzeichnet`);
    }
  }
  for (const k of ART('sportuebung')) {
    assert.ok(k.fuss.includes('Die Fachkraft entscheidet über Eignung und Ort.'), `${k.id}: Entscheidung der Fachkraft fehlt`);
  }
});

test('Hockey: die Sportart bleibt offen; der Titel legt keine Sportart fest', () => {
  const hockey = daten.karten.find((k) => k.id === 'hockey');
  assert.match(hockey.titel, /Sportart offen/);
  assert.ok(!/Eishockey|Feldhockey/.test(hockey.titel), 'Titel legt die Sportart fest');
  assert.ok(kartenText(hockey).includes('хоккей на траве'), 'Quellenname fehlt');
});

test('Rangliste nur verneint: kein Sieger, keine Punktzahl, kein Rang; jede Wettbewerbskarte trägt „ohne Rangliste (Eigenentwurf)“', () => {
  const alles = daten.karten.map(kartenText).join('\n');
  assert.ok(!/(?<!ohne |Ohne )Rangliste/.test(alles), 'Rangliste ohne Verneinung');
  assert.ok(!/Sieger|Gewinner|Punktzahl|Rang \d|Platz \d/i.test(alles), 'Wertung als Rang');
  for (const k of ART('wettbewerb')) {
    assert.ok(kartenText(k).includes('ohne Rangliste (Eigenentwurf)'), `${k.id}: Wettbewerb ohne Kennzeichnung`);
  }
});

test('Übersicht: Ziel der Quelle, Sportliche Freizeiten und Sportfeste (S. 226), Olympische Thematik (S. 225) und Altersgruppe (S. 6); „Nachmittage“ steht auf keiner Karte', () => {
  const text = kartenText(daten.karten.find((k) => k.id === 'uebersicht'));
  assert.ok(text.includes('Spiele nach vereinfachten Regeln und elementare Wettbewerbe mit Gleichaltrigen (S. 229–230)'));
  assert.ok(text.includes('Sportliche Freizeiten: 2 bis 4 Mal im Monat (S. 226)'), 'Sportliche Freizeiten (S. 226) fehlt');
  assert.ok(text.includes('Sportfeste: 2 bis 4 Mal im Jahr (S. 226)'));
  assert.ok(text.includes('Die olympische Thematik in Sportfeste und Feste einbeziehen (S. 225)'));
  assert.ok(text.includes('Altersgruppe 5 bis 7 Jahre') && text.includes('(S. 6)'));
  assert.ok(!/Nachmittag/.test(daten.karten.map(kartenText).join('\n')), '„Nachmittage“ steht nicht in der Quelle');
});

test('Auswahl: nur gewählte Karten, feste Reihenfolge, unbekannte Kennungen ignoriert, keine Dubletten', () => {
  const karten = gewaehlteKarten(daten, ['lapta', 'uebersicht', 'unbekannt', 'uebersicht']);
  assert.deepEqual(karten.map((k) => k.id), ['uebersicht', 'lapta']);
});

test('der Druck entspricht der Auswahl: n gewählte Karten ergeben genau n Karten', () => {
  const alle = alleKennungen(daten);
  for (let n = 0; n <= alle.length; n++) {
    assert.equal(gewaehlteKarten(daten, alle.slice(0, n)).length, n, `bei ${n} gewählten Karten`);
  }
});

test('alleGewaehlt wählt alle Karten; umschalten ändert nur die neue Menge; Druck erst bei einer gewählten Karte', () => {
  const alle = alleGewaehlt(daten);
  assert.equal(alle.size, daten.karten.length);
  const ohneLapta = umschalten(alle, 'lapta');
  assert.equal(ohneLapta.has('lapta'), false);
  assert.equal(alle.has('lapta'), true, 'das Original darf nicht verändert werden');
  assert.equal(umschalten(ohneLapta, 'lapta').has('lapta'), true);
  assert.equal(kannDrucken(gewaehlteKarten(daten, [])), false);
  assert.equal(kannDrucken(gewaehlteKarten(daten, ['uebersicht'])), true);
});

test('zeileText hängt die Seite in Klammern an; ohne Seite bleibt der Text; der Ausgabetext enthält keine Reste', () => {
  assert.equal(zeileText({ text: 'Sportfeste: 2 bis 4 Mal im Jahr', seite: 'S. 226' }), 'Sportfeste: 2 bis 4 Mal im Jahr (S. 226)');
  assert.equal(zeileText({ text: 'Ohne Seite' }), 'Ohne Seite');
  for (const k of daten.karten) {
    assert.ok(!/undefined|null|\[object/.test(kartenText(k)), `${k.id}: Rest im Text`);
  }
});
