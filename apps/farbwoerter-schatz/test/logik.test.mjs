import { test } from 'node:test';
import assert from 'node:assert/strict';
import daten from '../daten/farbwoerter.json' with { type: 'json' };
import {
  BLATT_EIGEN, BLATT_KOPF, GRUPPEN, HINWEIS, PRO_SITZUNG, QUELLSEITE, VERBOTENE_ZEICHEN,
  alleKennungen, darfOeffnen, druckBlaetter, farbkarte, gewaehlteFarbwoerter, gruppeFuer,
  kartenText, ladeFarbwoerter, merkeAngesehen, pruefeFarbwoerter, rundeVoll, umschalten, vorlesetext,
} from '../logik.mjs';

// Prüft Daten und Logik. Die Regeln der Umgebung (Eingabefelder, Speicherung, Netz, Druckzeichen,
// Seitenmarke, Fokus, Vorlesen, Testzahl) stehen in test/regeln.test.mjs.
//
// Die Begriffe und die Seite der Quelle sind gegen die Textkopie der Praleska geprüft (maschinell,
// außerhalb des Repos). Dieser Test prüft, dass die Daten dem entsprechen, was dort geprüft wurde.

// Die sechs Begriffe aus dem Bauauftrag CON-9, Abschnitt 1, wörtlich aus S. 178.
const BEGRIFFE = ['вишневый', 'салатовый', 'малиновый', 'лимонный', 'абрикосовый', 'цвет морской волны'];
// Die sechs deutschen Namen aus dem Bauauftrag (Eigenentwurf nach docs/10, Z. 456).
const NAMEN_BAUAUFTRAG = ['kirschrot', 'zitronengelb', 'aprikosenfarben', 'meergrün', 'himbeerrot', 'tannengrün'];

const farbwoerter = ladeFarbwoerter(daten);
const nachDe = (de) => farbwoerter.find((f) => f.de === de);
const alleKarten = farbwoerter.map((f) => farbkarte(f));
const kopie = () => structuredClone(daten);

test('Bank gültig: Kennungen eindeutig, Pflichtfelder id, de und gruppe gesetzt, Reihenfolge wie in der Datei', () => {
  assert.equal(daten.titel, 'Farbwörter-Schatz', 'Titel weicht ab');
  assert.deepEqual(farbwoerter.map((f) => f.id), daten.farbwoerter.map((f) => f.id));
  assert.equal(new Set(farbwoerter.map((f) => f.id)).size, farbwoerter.length, 'doppelte Kennungen');
  for (const f of farbwoerter) {
    assert.ok(f.id && f.de && f.gruppe, `${f.id}: Pflichtfeld fehlt`);
    assert.match(f.id, /^[a-z]+(?:-[a-z]+)*$/, `${f.id}: Kennung nur aus kleinen ASCII-Buchstaben`);
  }
});

test('ladeFarbwoerter bricht ab, wenn ein Pflichtfeld fehlt oder die Gruppe keine der vier ist', () => {
  assert.throws(() => ladeFarbwoerter({}), /farbwoerter/);
  for (const feld of ['id', 'de', 'gruppe']) {
    const k = kopie();
    delete k.farbwoerter[0][feld];
    assert.throws(() => ladeFarbwoerter(k), new RegExp(`Pflichtfeld fehlt: ${feld}`), `${feld} fehlt`);
  }
  const leer = kopie();
  leer.farbwoerter[2].de = '  ';
  assert.throws(() => ladeFarbwoerter(leer), /Pflichtfeld fehlt: de/);
  const fremd = kopie();
  fremd.farbwoerter[1].gruppe = 'bunt';
  assert.throws(() => ladeFarbwoerter(fremd), /Gruppe unbekannt: bunt/);
});

test('vier Gruppen: warm, kalt, kontrast, neutral; jede kommt in den Daten vor, die Gruppentexte stehen in der Datei', () => {
  assert.deepEqual([...GRUPPEN], ['warm', 'kalt', 'kontrast', 'neutral']);
  assert.deepEqual(daten.gruppen.map((g) => g.id), [...GRUPPEN], 'Gruppen der Daten weichen ab');
  for (const g of daten.gruppen) {
    assert.ok(g.name && g.text, `${g.id}: Name oder Text fehlt`);
    assert.ok(gruppeFuer(farbwoerter, g.id).length >= 1, `${g.id}: kein Farbwort`);
  }
  assert.deepEqual([...new Set(farbwoerter.map((f) => f.gruppe))].sort(), [...GRUPPEN].sort());
});

test('Bauauftrag: die sechs deutschen Namen stehen in den Daten, kirschrot gehört zur Gruppe warm', () => {
  for (const name of NAMEN_BAUAUFTRAG) assert.ok(nachDe(name), `${name} fehlt in den Daten`);
  assert.equal(nachDe('kirschrot').gruppe, 'warm', 'Beispielzeile des Bauauftrags: kirschrot ist warm');
  assert.equal(nachDe('kirschrot').ru, 'вишневый');
  assert.equal(nachDe('kirschrot').quelle.seite, 'S. 178');
  assert.equal(nachDe('kirschrot').eigenentwurf, true);
});

test('Quelle: die sechs Begriffe aus S. 178, höchstens 6 Wörter; jeder ru-Wert ist so ein Begriff und steht mit der Seite', () => {
  assert.deepEqual(daten.quelle.begriffe, BEGRIFFE);
  assert.equal(daten.quelle.seite, 'S. 178');
  assert.equal(QUELLSEITE, 'S. 178');
  assert.equal(daten.quelle.abschnitt, '„Рисование“');
  assert.equal(daten.quelle.gruppe, '„ПОЧЕМУЧКИ“');
  assert.equal(daten.quelle.offeneListe, 'и т. д.');
  for (const b of daten.quelle.begriffe) {
    assert.ok(b.trim().split(/\s+/).length <= 6, `„${b}“ hat mehr als 6 Wörter`);
  }
  for (const f of farbwoerter) {
    if (f.ru === null) continue;
    assert.ok(BEGRIFFE.includes(f.ru), `${f.id}: ru „${f.ru}“ ist kein Begriff der Quelle`);
    assert.equal(f.quelle?.seite, 'S. 178', `${f.id}: ru-Wert ohne Seite`);
  }
  const benutzt = farbwoerter.map((f) => f.ru).filter(Boolean);
  assert.equal(new Set(benutzt).size, benutzt.length, 'ein Begriff der Quelle steht bei zwei Farbwörtern');
});

test('Quellseite: jeder Eintrag mit quelle trägt genau „S. 178“, jeder ohne quelle ist Eigenentwurf', () => {
  for (const f of farbwoerter) {
    if (f.quelle) {
      assert.deepEqual(Object.keys(f.quelle), ['seite'], `${f.id}: quelle hat mehr als die Seite`);
      assert.equal(f.quelle.seite, 'S. 178', `${f.id}: Seite weicht ab`);
    }
    assert.equal(f.eigenentwurf, true, `${f.id}: die deutschen Namen sind Eigenentwurf`);
  }
});

test('uk bleibt leer: jedes uk ist null, und die Farbkarte liefert für uk keinen Namen', () => {
  for (const f of farbwoerter) {
    assert.equal(f.uk, null, `${f.id}: uk ist nicht null`);
    assert.equal(farbkarte(f, 'uk').name, null, `${f.id}: uk-Name ist nicht null`);
  }
});

test('pruefeFarbwoerter: die Daten sind in Ordnung', () => {
  assert.deepEqual(pruefeFarbwoerter(daten), []);
  assert.deepEqual(pruefeFarbwoerter({}), ['farbwoerter fehlt oder ist leer']);
  assert.deepEqual(pruefeFarbwoerter({ farbwoerter: [] }), ['farbwoerter fehlt oder ist leer']);
});

test('pruefeFarbwoerter findet Einträge ohne Quelle und ohne Eigenentwurf-Kennung, mit Quelle oder mit Kennung allein ist ein Eintrag gültig', () => {
  const k = kopie();
  const bloss = k.farbwoerter.find((f) => f.id === 'eisblau');
  delete bloss.eigenentwurf;
  assert.deepEqual(pruefeFarbwoerter(k), ['eisblau: weder quelle.seite noch eigenentwurf: true']);
  bloss.eigenentwurf = false;
  assert.equal(pruefeFarbwoerter(k).length, 1, 'eigenentwurf: false zählt nicht');
  bloss.quelle = { seite: 'S. 178' };
  assert.deepEqual(pruefeFarbwoerter(k), [], 'quelle.seite allein genügt');
  bloss.quelle = undefined;
  bloss.eigenentwurf = true;
  assert.deepEqual(pruefeFarbwoerter(k), [], 'eigenentwurf: true allein genügt');
});

test('pruefeFarbwoerter findet eine fremde Seite, eine fünfte Gruppe, eine doppelte Kennung, ru ohne Quelle, eine kaputte Farbe und ein falsches Paar', () => {
  const fehler = (aendere) => { const k = kopie(); aendere(k.farbwoerter); return pruefeFarbwoerter(k); };
  assert.match(fehler((l) => { l[0].quelle.seite = 'S. 179'; })[0], /kirschrot: quelle\.seite „S\. 179“ ist nicht „S\. 178“/);
  assert.match(fehler((l) => { l[1].gruppe = 'bunt'; })[0], /himbeerrot: Gruppe „bunt“ ist keine der vier Gruppen/);
  assert.match(fehler((l) => { l[2].id = 'kirschrot'; })[0], /kirschrot: doppelte Kennung/);
  assert.match(fehler((l) => { l.find((f) => f.id === 'eisblau').ru = 'вишневый'; })[0], /eisblau: ru-Wert ohne quelle\.seite/);
  assert.match(fehler((l) => { l[3].farbe = 'gelb'; })[0], /zitronengelb: farbe ist kein Hex-Wert/);
  assert.match(fehler((l) => { l[3].satz = ''; })[0], /zitronengelb: satz fehlt/);
  assert.match(fehler((l) => { l.find((f) => f.gruppe === 'kontrast').farbe = ['#B0102A']; })[0], /farbe braucht zwei Hex-Werte/);
  assert.match(fehler((l) => { l.find((f) => f.gruppe === 'kontrast').teile = ['kirschrot']; })[0], /teile braucht zwei Namen/);
  assert.match(fehler((l) => { l.find((f) => f.gruppe === 'kontrast').de = 'rot und grün'; })[0], /de ist nicht „zitronengelb und nachtblau“/);
});

test('gruppeFuer liefert nur die gewählte Gruppe in der Reihenfolge der Datei; eine unbekannte Gruppe liefert eine leere Liste', () => {
  for (const g of GRUPPEN) {
    const liste = gruppeFuer(farbwoerter, g);
    assert.ok(liste.length > 0);
    assert.ok(liste.every((f) => f.gruppe === g), `${g}: fremdes Farbwort in der Liste`);
    assert.deepEqual(liste.map((f) => f.id), farbwoerter.filter((f) => f.gruppe === g).map((f) => f.id));
  }
  const alle = GRUPPEN.flatMap((g) => gruppeFuer(farbwoerter, g));
  assert.equal(alle.length, farbwoerter.length, 'jedes Farbwort gehört zu genau einer Gruppe');
  assert.deepEqual(gruppeFuer(farbwoerter, 'bunt'), []);
  assert.deepEqual(gruppeFuer(farbwoerter, undefined), []);
  assert.deepEqual(gruppeFuer([], 'warm'), []);
  assert.deepEqual(gruppeFuer(farbwoerter, 'warm').map((f) => f.de).slice(0, 4), ['kirschrot', 'himbeerrot', 'aprikosenfarben', 'zitronengelb']);
});

test('farbkarte: Name, Fläche und Hinweis; warm und kalt als Hinweis, bei Kontrast und neutral der Gruppenname', () => {
  const kirsche = farbkarte(nachDe('kirschrot'));
  assert.equal(kirsche.name, 'kirschrot');
  assert.deepEqual(kirsche.flaeche, ['#B0102A']);
  assert.equal(kirsche.hinweis, 'warm');
  assert.equal(kirsche.sprache, 'de');
  assert.equal(kirsche.satz, 'Kirschrot ist so rot wie eine reife Kirsche.');
  assert.deepEqual(kirsche.teile, []);
  assert.equal(farbkarte(nachDe('eisblau')).hinweis, 'kalt');
  assert.equal(farbkarte(nachDe('zitronengelb und nachtblau')).hinweis, 'Kontrast');
  assert.equal(farbkarte(nachDe('aschgrau')).hinweis, 'neutral');
  assert.deepEqual({ ...HINWEIS }, { warm: 'warm', kalt: 'kalt', kontrast: 'Kontrast', neutral: 'neutral' });
  for (const k of alleKarten) {
    assert.equal(k.hinweis, HINWEIS[k.gruppe], `${k.id}: Hinweis weicht ab`);
    assert.ok(k.name && k.flaeche.length >= 1 && k.satz, `${k.id}: Karte unvollständig`);
  }
});

test('farbkarte: ein Kontrast-Paar hat zwei Flächen und zwei Teile, die Teile sind Farbwörter der Daten mit derselben Farbe', () => {
  const paare = farbwoerter.filter((f) => f.gruppe === 'kontrast');
  assert.ok(paare.length >= 1);
  for (const p of paare) {
    const k = farbkarte(p);
    assert.equal(k.flaeche.length, 2, `${p.id}: zwei Flächen`);
    assert.equal(k.teile.length, 2, `${p.id}: zwei Teile`);
    assert.equal(k.name, k.teile.join(' und '));
    k.teile.forEach((teil, i) => {
      const einzel = nachDe(teil);
      assert.ok(einzel, `${p.id}: Teil „${teil}“ ist kein Farbwort der Daten`);
      assert.notEqual(einzel.gruppe, 'kontrast', `${p.id}: Teil „${teil}“ ist selbst ein Paar`);
      assert.equal(einzel.farbe, k.flaeche[i], `${p.id}: Farbe von „${teil}“ weicht ab`);
    });
    assert.notEqual(k.flaeche[0], k.flaeche[1], `${p.id}: beide Flächen haben dieselbe Farbe`);
  }
});

test('farbkarte: ru liefert den Begriff der Quelle oder null, eine unbekannte Sprache oder Gruppe wirft einen Fehler', () => {
  assert.equal(farbkarte(nachDe('kirschrot'), 'ru').name, 'вишневый');
  assert.equal(farbkarte(nachDe('eisblau'), 'ru').name, null);
  assert.equal(farbkarte(nachDe('kirschrot'), 'ru').hinweis, 'warm', 'der Hinweis bleibt deutsch');
  assert.throws(() => farbkarte(nachDe('kirschrot'), 'fr'), /Sprache unbekannt: fr/);
  assert.throws(() => farbkarte({ id: 'x', de: 'x', gruppe: 'bunt', farbe: '#000000' }), /Gruppe unbekannt: bunt/);
  assert.throws(() => farbkarte(undefined), /Gruppe unbekannt/);
});

test('Grenzfall: meergrün und tannengrün sagen, dass Grün zwischen warm und kalt liegt; der Satz steht in der Karte und im Vorlesetext', () => {
  const gruen = farbwoerter.filter((f) => f.grenzfall);
  assert.deepEqual(gruen.map((f) => f.de).sort(), ['meergrün', 'tannengrün']);
  for (const f of gruen) {
    assert.match(f.grenzfall, /^Grün liegt zwischen warm und kalt\./);
    assert.match(f.grenzfall, /hat nicht unrecht\.$/);
    const k = farbkarte(f);
    assert.equal(k.grenzfall, f.grenzfall);
    assert.ok(vorlesetext(k).endsWith(f.grenzfall), `${f.id}: der Grenzfall fehlt im Vorlesetext`);
  }
  assert.equal(farbkarte(nachDe('kirschrot')).grenzfall, null);
});

test('vorlesetext: Name, Hinweis und Satz; ohne Namen in dieser Sprache gibt es nichts vorzulesen', () => {
  assert.equal(
    vorlesetext(farbkarte(nachDe('kirschrot'))),
    'kirschrot. Das ist eine warme Farbe. Kirschrot ist so rot wie eine reife Kirsche.',
  );
  assert.match(vorlesetext(farbkarte(nachDe('aschgrau'))), /^aschgrau\. Das ist eine neutrale Farbe\./);
  assert.match(vorlesetext(farbkarte(nachDe('zitronengelb und nachtblau'))), /^zitronengelb und nachtblau\. Diese Farben sind ein Kontrast\./);
  assert.equal(vorlesetext(farbkarte(nachDe('kirschrot'), 'uk')), '');
  for (const k of alleKarten) {
    const text = vorlesetext(k);
    assert.ok(text.startsWith(`${k.name}.`) && text.includes(k.hinweisSatz) && text.includes(k.satz), `${k.id}: Vorlesetext unvollständig`);
  }
});

test('druckBlaetter: je Karte ein Blatt in der Reihenfolge der Karten; Karten ohne Namen werden nicht gedruckt', () => {
  const blaetter = druckBlaetter(alleKarten);
  assert.equal(blaetter.length, farbwoerter.length);
  assert.deepEqual(blaetter.map((b) => b.id), farbwoerter.map((f) => f.id));
  const ausgewaehlt = ['rabenschwarz', 'kirschrot'].map((id) => farbkarte(farbwoerter.find((f) => f.id === id)));
  assert.deepEqual(druckBlaetter(ausgewaehlt).map((b) => b.id), ['rabenschwarz', 'kirschrot'], 'Zahl und Reihenfolge wie die Auswahl');
  assert.deepEqual(druckBlaetter([]), []);
  // uk ist leer: keine Karte, kein Blatt. ru hat nur bei den Begriffen der Quelle einen Namen.
  assert.deepEqual(druckBlaetter(farbwoerter.map((f) => farbkarte(f, 'uk'))), []);
  assert.deepEqual(druckBlaetter(farbwoerter.map((f) => farbkarte(f, 'ru'))).map((b) => b.id), farbwoerter.filter((f) => f.ru).map((f) => f.id));
});

test('Druckblatt: Kopf, Fläche, Name, Hinweis, Satz und Kennzeichnung; ohne Seitenzahl, ohne Pflichtmarkierung, ohne Namenszeile', () => {
  const [blatt] = druckBlaetter([farbkarte(nachDe('kirschrot'))]);
  assert.deepEqual(blatt.flaeche, ['#B0102A']);
  assert.equal(blatt.name, 'kirschrot');
  assert.deepEqual(blatt.zeilen, {
    kopf: BLATT_KOPF,
    name: 'kirschrot',
    teile: [],
    hinweis: 'warm',
    satz: 'Kirschrot ist so rot wie eine reife Kirsche.',
    grenzfall: null,
    eigen: BLATT_EIGEN,
  });
  assert.equal(kartenText(blatt), ['Farbwörter-Schatz', 'kirschrot', 'warm', 'Kirschrot ist so rot wie eine reife Kirsche.', 'Farbwort, Farbfläche und Hinweis: Eigenentwurf.'].join('\n'));
  for (const b of druckBlaetter(alleKarten)) {
    const text = kartenText(b);
    assert.doesNotMatch(text, /S\. \d|Seite \d/, `${b.id}: Seitenzahl auf dem Blatt`);
    assert.doesNotMatch(text, /geprüft/, `${b.id}: Pflichtmarkierung auf dem Blatt`);
    assert.doesNotMatch(text, /Praleska|Рисование/, `${b.id}: das Blatt nennt die Quelle`);
    assert.match(text, /Eigenentwurf/, `${b.id}: ohne Kennzeichnung`);
  }
});

test('Druckblatt eines Paars: beide Farbflächen, beide Namen als Text, der Hinweis Kontrast', () => {
  const [blatt] = druckBlaetter([farbkarte(nachDe('schneeweiß und rabenschwarz'))]);
  assert.deepEqual(blatt.flaeche, ['#FFFFFF', '#1A1A1D']);
  assert.deepEqual(blatt.zeilen.teile, ['schneeweiß', 'rabenschwarz']);
  assert.equal(blatt.zeilen.hinweis, 'Kontrast');
  assert.match(kartenText(blatt), /schneeweiß\nrabenschwarz\nschneeweiß und rabenschwarz\nKontrast/);
});

test('Druckblatt eines Grenzfalls trägt den Satz zu Grün', () => {
  const [blatt] = druckBlaetter([farbkarte(nachDe('tannengrün'))]);
  assert.match(kartenText(blatt), /Grün liegt zwischen warm und kalt\./);
  assert.equal(blatt.zeilen.hinweis, 'kalt');
});

test('druckBlaetter wirft bei einem verbotenen Zeichen und bei einer Seitenzahl im Blatt', () => {
  const karte = farbkarte(nachDe('kirschrot'));
  for (const zeichen of ['☐', '☑', '✓', '✔', '★', '☆', '\u{1F352}', '•', '→']) {
    assert.throws(() => druckBlaetter([{ ...karte, satz: `Kirsche ${zeichen}` }]), /Druckzeichen im Blatt kirschrot/, `U+${zeichen.codePointAt(0).toString(16)}`);
    assert.ok(VERBOTENE_ZEICHEN.test(zeichen));
  }
  assert.throws(() => druckBlaetter([{ ...karte, satz: 'Siehe S. 178.' }]), /Seitenzahl im Blatt kirschrot/);
  assert.throws(() => druckBlaetter([{ ...karte, satz: 'Siehe Seite 178.' }]), /Seitenzahl im Blatt kirschrot/);
  assert.doesNotThrow(() => druckBlaetter([{ ...karte, satz: 'Kein Zeichen, keine Zahl.' }]));
});

test('Druckblätter aller Farbwörter: keine Zeichen aus der Sperrliste, keine Emojis, jede Zeile ist ein Text', () => {
  for (const b of druckBlaetter(alleKarten)) {
    assert.ok(!VERBOTENE_ZEICHEN.test(kartenText(b)), `${b.id}: Druckzeichen im Blatt`);
    assert.ok(b.zeilen.name && b.zeilen.hinweis && b.zeilen.satz, `${b.id}: Blatt unvollständig`);
  }
});

test('umschalten fügt hinzu oder entfernt, ohne Dubletten und ohne die Eingabe zu verändern', () => {
  const leer = [];
  const eins = umschalten(leer, 'kirschrot');
  assert.deepEqual(eins, ['kirschrot']);
  assert.deepEqual(leer, [], 'die Eingabe bleibt unverändert');
  const zwei = umschalten(eins, 'eisblau');
  assert.deepEqual(zwei, ['kirschrot', 'eisblau']);
  assert.deepEqual(umschalten(zwei, 'kirschrot'), ['eisblau']);
  assert.deepEqual(umschalten(umschalten(zwei, 'aschgrau'), 'aschgrau'), zwei, 'zweimal umschalten ist die Ausgangslage');
  assert.deepEqual(zwei, ['kirschrot', 'eisblau']);
});

test('gewaehlteFarbwoerter und alleKennungen: Reihenfolge der Datei, unbekannte Kennungen werden ignoriert', () => {
  const gewaehlt = gewaehlteFarbwoerter(farbwoerter, ['rabenschwarz', 'kirschrot', 'gibt-es-nicht', 'kirschrot']);
  assert.deepEqual(gewaehlt.map((f) => f.id), ['kirschrot', 'rabenschwarz']);
  assert.deepEqual(gewaehlteFarbwoerter(farbwoerter, []), []);
  assert.deepEqual(alleKennungen(farbwoerter), farbwoerter.map((f) => f.id));
  assert.equal(gewaehlteFarbwoerter(farbwoerter, alleKennungen(farbwoerter)).length, farbwoerter.length);
});

test('Runde: höchstens PRO_SITZUNG verschiedene Farbwörter; ein schon gesehenes darf immer geöffnet werden', () => {
  assert.ok(Number.isInteger(PRO_SITZUNG) && PRO_SITZUNG >= 3, 'PRO_SITZUNG ist eine kleine ganze Zahl');
  assert.ok(PRO_SITZUNG < farbwoerter.length, 'die Grenze muss bei dieser Bank greifen');
  let angesehen = [];
  assert.equal(rundeVoll(angesehen), false);
  const ids = alleKennungen(farbwoerter);
  for (let i = 0; i < PRO_SITZUNG; i += 1) {
    assert.equal(darfOeffnen(angesehen, ids[i]), true, `Farbwort ${i + 1} darf geöffnet werden`);
    angesehen = merkeAngesehen(angesehen, ids[i]);
  }
  assert.equal(angesehen.length, PRO_SITZUNG);
  assert.equal(rundeVoll(angesehen), true);
  assert.equal(darfOeffnen(angesehen, ids[PRO_SITZUNG]), false, 'ein neues Farbwort in der vollen Runde');
  assert.equal(darfOeffnen(angesehen, ids[0]), true, 'ein schon gesehenes bleibt offen');
  assert.deepEqual(merkeAngesehen(angesehen, ids[0]), angesehen, 'keine Dublette');
  assert.equal(rundeVoll(merkeAngesehen(angesehen.slice(0, 2), ids[0])), false);
});

test('merkeAngesehen verändert die Eingabe nicht', () => {
  const vorher = ['kirschrot'];
  const nachher = merkeAngesehen(vorher, 'eisblau');
  assert.deepEqual(vorher, ['kirschrot']);
  assert.deepEqual(nachher, ['kirschrot', 'eisblau']);
  assert.notEqual(merkeAngesehen(vorher, 'kirschrot'), vorher, 'auch ohne Änderung eine neue Liste');
});

test('Farben: gültige Hex-Werte, jedes Einzelwort hat eine eigene Farbe, die Farben bleiben unterscheidbar', () => {
  const einzel = farbwoerter.filter((f) => !Array.isArray(f.farbe));
  for (const f of farbwoerter) {
    for (const farbe of [f.farbe].flat()) assert.match(farbe, /^#[0-9A-F]{6}$/, `${f.id}: ${farbe}`);
  }
  const farben = einzel.map((f) => f.farbe);
  assert.equal(new Set(farben).size, farben.length, 'zwei Einzelwörter haben dieselbe Farbe');
  // Rot, Orange und Gelb liegen in der Gruppe warm, Blau liegt in der Gruppe kalt: grobe Probe am Rotanteil.
  const rot = (hex) => Number.parseInt(hex.slice(1, 3), 16);
  const blau = (hex) => Number.parseInt(hex.slice(5, 7), 16);
  for (const f of gruppeFuer(farbwoerter, 'warm')) assert.ok(rot(f.farbe) > blau(f.farbe), `${f.id}: warm mit mehr Blau als Rot`);
  for (const name of ['eisblau', 'nachtblau']) assert.ok(blau(nachDe(name).farbe) > rot(nachDe(name).farbe), `${name} ist blau`);
});

test('Kontrast-Paare unterscheiden sich in der Helligkeit oder auf der Blau-Gelb-Achse, nicht nur in Rot gegen Grün', () => {
  // Eigenentwurf, nicht fachlich geprüft: so bleibt der Kontrast auch für Kinder und Erwachsene sichtbar, die Rot und Grün
  // schlecht unterscheiden. Die Helligkeit folgt der relativen Leuchtdichte (WCAG), die Achse ist Blau minus Mittel aus Rot und Grün.
  const kanal = (hex, i) => Number.parseInt(hex.slice(1 + 2 * i, 3 + 2 * i), 16);
  const linear = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
  const leucht = (hex) => 0.2126 * linear(kanal(hex, 0)) + 0.7152 * linear(kanal(hex, 1)) + 0.0722 * linear(kanal(hex, 2));
  const achse = (hex) => kanal(hex, 2) - (kanal(hex, 0) + kanal(hex, 1)) / 2;
  for (const p of farbwoerter.filter((f) => f.gruppe === 'kontrast')) {
    const [a, b] = p.farbe;
    const verhaeltnis = (Math.max(leucht(a), leucht(b)) + 0.05) / (Math.min(leucht(a), leucht(b)) + 0.05);
    const abstand = Math.abs(achse(a) - achse(b));
    assert.ok(verhaeltnis >= 1.4 || abstand >= 100, `${p.id}: Helligkeit ${verhaeltnis.toFixed(2)}, Blau-Gelb-Abstand ${abstand.toFixed(0)}`);
  }
});

test('Sätze der Daten: groß geschrieben, mit Satzzeichen am Ende, ohne doppelte Leerzeichen, kurz genug zum Vorlesen', () => {
  const saetze = [
    ...farbwoerter.map((f) => [f.id, f.satz]),
    ...farbwoerter.filter((f) => f.grenzfall).map((f) => [`${f.id} (Grenzfall)`, f.grenzfall]),
    ...daten.gruppen.map((g) => [g.id, g.text]),
    ['start', daten.start.text],
  ];
  for (const [wo, satz] of saetze) {
    assert.match(satz, /^[A-ZÄÖÜ]/, `${wo}: beginnt nicht mit einem Großbuchstaben`);
    assert.match(satz, /[.?!]$/, `${wo}: endet ohne Satzzeichen`);
    assert.ok(!/ {2}|\s$/.test(satz), `${wo}: Leerzeichen zu viel`);
    assert.ok(satz.length <= 160, `${wo}: zu lang zum Vorlesen (${satz.length} Zeichen)`);
  }
  for (const [i, text] of daten.start.erwachsene.entries()) {
    assert.match(text, /^[A-ZÄÖÜ].*[.]$/, `Hinweis für Erwachsene ${i + 1}: Satzanfang oder Satzende`);
    assert.ok(!/ {2}|\s$/.test(text), `Hinweis für Erwachsene ${i + 1}: Leerzeichen zu viel`);
  }
  for (const f of farbwoerter.filter((x) => !x.teile)) {
    assert.ok(f.satz.startsWith(`${f.de[0].toUpperCase()}${f.de.slice(1)} `), `${f.id}: der Satz nennt das Farbwort nicht am Anfang`);
  }
});

test('Start: der Hinweis auf die Rundengrenze hat einen Platz für die Zahl, die App setzt PRO_SITZUNG ein', () => {
  const mitZahl = daten.start.erwachsene.filter((t) => t.includes('{n}'));
  assert.equal(mitZahl.length, 1, 'genau ein Satz nennt die Zahl');
  assert.ok(!daten.start.erwachsene.some((t) => /\d/.test(t.replace('{n}', '').replace(/3 bis 5 Jahren/, '').replace(/A4/, ''))), 'sonst steht keine feste Zahl im Text (außer dem Alter und A4)');
});

test('Marke und Sprachen: die Pflichtmarkierung hat den belegten Wortlaut, der Vermerk zu uk und ru steht in den Daten', () => {
  assert.equal(daten.pflichtmarkierung, 'Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.');
  assert.ok(daten.sprachen.includes('uk und ru: nicht vorhanden, offen.'));
  assert.match(daten.eigenentwurf, /Eigenentwurf/);
  assert.match(daten.quelle.werk, /Praleska/);
  assert.match(daten.quelle.werk, /Eigenentwurf/, 'der übertragene Titel ist als Eigenentwurf gekennzeichnet');
});
