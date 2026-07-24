import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { akkusativ, akkusativPhrase, baueAuftrag, auftragsVielfalt, baueBionikFrage, pruefeDaten } from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/werkstatt.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const erster = (liste) => liste[0];

test('Werkstatt-Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(auftragsVielfalt(daten) >= 60, `zu wenig Kombinationen: ${auftragsVielfalt(daten)}`);
});

test('Artikel: der/die/das werden korrekt in den Akkusativ gesetzt', () => {
  assert.equal(akkusativ('der'), 'den');
  assert.equal(akkusativ('die'), 'die');
  assert.equal(akkusativ('das'), 'das');
  assert.equal(akkusativ('dem'), null);
  assert.equal(akkusativPhrase({ artikel: 'der', name: 'Tisch' }), 'den Tisch');
  assert.equal(akkusativPhrase({ artikel: 'die', name: 'Lampe' }), 'die Lampe');
  assert.equal(akkusativPhrase({ artikel: 'das', name: 'Buch' }), 'das Buch');
  // Jeder Gegenstand im Datensatz trägt einen brauchbaren Artikel
  for (const g of daten.gegenstaende) assert.ok(akkusativ(g.artikel), `${g.id}: Artikel ${g.artikel}`);
});

test('baueAuftrag setzt den Platzhalter überall ein und lässt keinen stehen', () => {
  const auftrag = baueAuftrag(daten, erster);
  assert.equal(auftrag.gegenstand.id, daten.gegenstaende[0].id);
  assert.equal(auftrag.karte.id, daten.karten[0].id);
  assert.equal(auftrag.fragen.length, daten.fragen.length);
  for (const f of auftrag.fragen) assert.ok(!f.includes('{akkusativ}'), `Platzhalter geblieben: ${f}`);
  assert.match(auftrag.fragen[0], /den Tisch/);
  assert.equal(auftrag.titel, `${daten.karten[0].name}: ${daten.gegenstaende[0].name}`);
});

test('baueAuftrag wiederholt nie dieselbe Paarung direkt hintereinander', () => {
  const erste = baueAuftrag(daten, erster);
  const zweite = baueAuftrag(daten, erster, erste);
  assert.ok(
    erste.gegenstand.id !== zweite.gegenstand.id || erste.karte.id !== zweite.karte.id,
    'zweimal exakt derselbe Auftrag',
  );
  // Auch bei echtem Zufall bleibt jeder Auftrag wohlgeformt
  let vorher = null;
  for (let i = 0; i < 300; i++) {
    const a = baueAuftrag(daten, (l) => l[Math.floor(Math.random() * l.length)], vorher);
    assert.ok(a.gegenstand && a.karte && a.fragen.length >= 3);
    if (vorher) assert.ok(vorher.gegenstand.id !== a.gegenstand.id || vorher.karte.id !== a.karte.id);
    vorher = a;
  }
});

test('baueBionikFrage zeigt genau drei Möglichkeiten, darunter das Vorbild', () => {
  for (const p of daten.bionik) {
    const frage = baueBionikFrage(p, (l) => [...l].reverse());
    assert.equal(frage.optionen.length, 3);
    assert.ok(frage.optionen.includes(p.vorbild), `${p.id}: Vorbild fehlt in den Optionen`);
    assert.equal(new Set(frage.optionen).size, 3, `${p.id}: doppelte Option`);
  }
});

test('„abgeschaut“ braucht einen Beleg – „ähnlich“ darf keine Erfindungsgeschichte erzählen', () => {
  // ohne Beleg darf nichts „abgeschaut“ heißen
  const ohneBeleg = kopie();
  const echt = ohneBeleg.bionik.find((p) => p.art === 'abgeschaut');
  delete echt.beleg;
  assert.ok(pruefeDaten(ohneBeleg).some((f) => /braucht einen konkreten Beleg/.test(f)));
  // ein Ähnlichkeitsfall darf keinen Beleg tragen
  const mitBeleg = kopie();
  mitBeleg.bionik.find((p) => p.art === 'aehnlich').beleg = 'Jemand hat das angeblich abgeschaut.';
  assert.ok(pruefeDaten(mitBeleg).some((f) => /darf keinen Erfindungs-Beleg tragen/.test(f)));
  // und er muss ausdrücklich sagen, dass nicht abgeschaut wurde
  const ohneWarnung = kopie();
  ohneWarnung.bionik.find((p) => p.art === 'aehnlich').erklaerung = 'Sieht sich ziemlich ähnlich, oder?';
  assert.ok(pruefeDaten(ohneWarnung).some((f) => /muss in der Erklärung sagen/.test(f)));
  // Ablenker dürfen das Vorbild nicht wiederholen
  const doppelt = kopie();
  doppelt.bionik[0].andere[0] = doppelt.bionik[0].vorbild;
  assert.ok(pruefeDaten(doppelt).some((f) => /Ablenker wiederholt das Vorbild/.test(f)));
  // Ein Ähnlichkeits-Fall darf kein Lebewesen als richtige Antwort führen:
  // Die Frage lautet „Wovon ist das abgeschaut?“ – ein Tier als Lösung würde
  // genau die Verwechslung belohnen, die die App auflösen soll.
  const tierAlsLoesung = kopie();
  tierAlsLoesung.bionik.find((p) => p.art === 'aehnlich').vorbild = 'Die Fledermaus';
  assert.ok(pruefeDaten(tierAlsLoesung).some((f) => /muss als Vorbild „Niemand/.test(f)));
});

test('jeder Ähnlichkeits-Fall antwortet „Niemand“ – auch im echten Datensatz', () => {
  for (const p of daten.bionik.filter((x) => x.art === 'aehnlich')) {
    assert.match(p.vorbild, /^Niemand\b/, `${p.id}: „${p.vorbild}“ würde als Abschauen gewertet`);
    // und das Lebewesen, das nur ähnlich ist, steht als Ablenker daneben
    assert.ok(p.andere.length === 2, `${p.id}: Ablenker fehlen`);
  }
});

test('im echten Datensatz stehen beide Sorten – und die Belege nennen Konkretes', () => {
  const abgeschaut = daten.bionik.filter((p) => p.art === 'abgeschaut');
  const aehnlich = daten.bionik.filter((p) => p.art === 'aehnlich');
  assert.ok(abgeschaut.length >= 4, 'zu wenige echte Vorbilder');
  assert.ok(aehnlich.length >= 4, 'zu wenige Ähnlichkeits-Fälle – gerade die sind der Lernstoff');
  for (const p of abgeschaut) {
    // Ein Beleg muss eine Person, eine Jahreszahl oder eine konkrete Verwendung nennen
    assert.match(p.beleg, /\d{4}|\d{4}er|Ingenieur|Botaniker|Patent|Standardbauteil/, `${p.id}: Beleg bleibt vage`);
  }
  // Der Klassiker Klettverschluss ist dabei und richtig zugeordnet
  const klett = daten.bionik.find((p) => /Klettverschluss/.test(p.erfindung));
  assert.equal(klett.art, 'abgeschaut');
  assert.match(klett.vorbild, /Klette/);
  // Das Rad ist der Gegenbeweis: In der Natur gibt es keins
  const rad = daten.bionik.find((p) => p.erfindung === 'Das Rad');
  assert.equal(rad.art, 'aehnlich');
  assert.match(rad.erklaerung, /kein Tier hat ein Rad|Kein Tier hat ein Rad/);
});

test('Veränderungskarten decken die Katalog-Methoden ab und denken Barrierefreiheit mit', () => {
  const ids = daten.karten.map((k) => k.id);
  for (const noetig of ['groesser', 'material', 'weglassen', 'dazu']) {
    assert.ok(ids.includes(noetig), `Methode fehlt: ${noetig}`);
  }
  const fuerAndere = daten.karten.find((k) => k.id === 'andere');
  assert.match(fuerAndere.anweisung, /nicht greifen|nichts sieht|Rollstuhl/);
  for (const k of daten.karten) {
    assert.ok(k.anweisung.length >= 40, `${k.id}: Anweisung zu knapp`);
    assert.ok(k.beispiel.length >= 30, `${k.id}: Beispiel zu knapp`);
  }
});
