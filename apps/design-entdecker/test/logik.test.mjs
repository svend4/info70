import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  PRO_SESSION, GELTUNGEN, MERKMALSARTEN, MAX_GRAD,
  waehleFragen, hatLoesung, istRichtig, nachGeltung,
  amHausErkennbar, nichtAmHaus, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/design.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const frage = (id) => daten.fragen.find((f) => f.id === id);
const vonGeltung = (g) => daten.fragen.filter((f) => f.geltung === g);

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.fragen.length >= 10);
  assert.ok(daten.gebaeude.length >= 5);
});

test('alle drei Geltungsarten kommen vor', () => {
  const zahlen = nachGeltung(daten.fragen);
  for (const g of GELTUNGEN) assert.ok(zahlen[g] >= 1, `${g}: keine einzige Frage`);
  // Ohne „ausgemacht“ würde eine Vereinbarung als Naturgesetz durchgehen,
  // ohne „geschmack“ wäre die App wieder ein reines Wissensquiz.
  for (const g of GELTUNGEN) {
    const ohne = kopie();
    ohne.fragen = ohne.fragen.filter((f) => f.geltung !== g);
    assert.ok(pruefeDaten(ohne).some((f) => new RegExp(`geltung ${g}: kommt gar nicht vor`).test(f)), g);
  }
});

test('Geschmack hat keine Lösung – und kann technisch keine bekommen', () => {
  const geschmack = vonGeltung('geschmack');
  assert.ok(geschmack.length >= 2);
  for (const f of geschmack) {
    assert.equal(hatLoesung(f), false, f.id);
    assert.equal(istRichtig(f, f.optionen[0]), null, `${f.id}: istRichtig gibt eine Wertung zurück`);
    assert.ok(!('antwortText' in f), `${f.id}: hat eine Lösung hinterlegt`);
    assert.ok(!('korrekt' in f), `${f.id}: hat eine Lösung hinterlegt`);
    for (const o of f.optionen) {
      // Nicht einmal `richtig: false` – das Feld darf gar nicht existieren.
      assert.ok(!('richtig' in o), `${f.id}: eine Option trägt ein Feld „richtig“`);
    }
    // Bewertet wird das Begründen, nicht die Wahl.
    assert.match(f.gespraech, /Warum|Weshalb|Wieso/, `${f.id}: fragt nicht nach dem Warum`);
  }
  const geschummelt = kopie();
  geschummelt.fragen.find((f) => f.id === 'f-tasse-geschmack').optionen[0].richtig = false;
  assert.ok(pruefeDaten(geschummelt).some((f) => /keine Antwort ein Feld „richtig“/.test(f)));
  const mitLoesung = kopie();
  mitLoesung.fragen.find((f) => f.id === 'f-tasse-geschmack').antwortText = 'Die gestreifte.';
  assert.ok(pruefeDaten(mitLoesung).some((f) => /keine Lösung hinterlegt/.test(f)));
});

test('„schön“ steht nur dort, wo es nichts zu treffen gibt', () => {
  for (const f of daten.fragen) {
    if (f.geltung === 'geschmack') continue;
    assert.ok(!/schön|hässlich/.test(JSON.stringify(f)), `${f.id}: „schön“ in einer Frage mit Lösung`);
  }
  const vermischt = kopie();
  vermischt.fragen.find((f) => f.id === 'f-henkel').optionen[1].text = 'Damit sie schöner aussieht';
  assert.ok(pruefeDaten(vermischt).some((f) => /„schön“ steht in einer Frage, die eine richtige Antwort hat/.test(f)));
});

test('Vereinbarungen nennen ihren Geltungsbereich – im Kindertext', () => {
  const ausgemacht = vonGeltung('ausgemacht');
  assert.ok(ausgemacht.length >= 2);
  for (const f of ausgemacht) {
    assert.match(f.antwortText, /bei uns/, `${f.id}: sagt nicht, wo das gilt`);
    assert.match(f.antwortText, /ausgemacht|vereinbart|festgelegt/, `${f.id}`);
    assert.ok(f.geltungsbereich && f.geltungsbereich.length > 30, `${f.id}: Erwachsenen-Text fehlt`);
  }
  // Die Feuerwehr ist rot, WEIL es ausgemacht ist – nicht, weil Rot
  // besonders gut sichtbar wäre. Diese Verwechslung ist der Kern.
  const feuerwehr = frage('f-feuerwehr');
  assert.match(feuerwehr.optionen.find((o) => o.richtig).text, /ausgemacht/);
  assert.ok(feuerwehr.optionen.some((o) => !o.richtig && /am weitesten sieht/.test(o.text)),
    'der Ablenker „am besten sichtbar“ fehlt – genau das ist der verbreitete Irrtum');
  const ohneOrt = kopie();
  ohneOrt.fragen.find((f) => f.id === 'f-feuerwehr').antwortText = 'Weil das so ausgemacht ist.';
  assert.ok(pruefeDaten(ohneOrt).some((f) => /sagt nicht, wo das gilt/.test(f)));
});

test('prüfbare Fragen brauchen zwei Gründe, eine Probe und einen Plan B', () => {
  const pruefbar = vonGeltung('pruefbar');
  assert.ok(pruefbar.length >= 5);
  for (const f of pruefbar) {
    assert.ok(f.gruende.length >= 2, `${f.id}: nur ein Grund`);
    assert.ok(f.probe && f.erwartet && f.wennAnders, `${f.id}: Probe unvollständig`);
    // Verneinungen drehen Kinder beim Wiedergeben um – der erste Grund
    // sagt deshalb, was das Ding KANN.
    assert.ok(!/\bnicht\b|\bkein/.test(f.gruende[0]), `${f.id}: erster Grund ist verneint`);
  }
  // Der Kochlöffel ist der Musterfall: Wärme allein wäre unvollständig.
  const loeffel = frage('f-loeffel');
  assert.ok(loeffel.gruende.some((g) => /kratz|kaputt|weicher/.test(g)),
    'der zweite Grund (Holz schont die Pfanne) fehlt');
  const einGrund = kopie();
  einGrund.fragen.find((f) => f.id === 'f-loeffel').gruende = ['Holz leitet die Wärme schlecht.'];
  assert.ok(pruefeDaten(einGrund).some((f) => /mindestens zwei Gründe/.test(f)));
  const verneint = kopie();
  verneint.fragen.find((f) => f.id === 'f-loeffel').gruende[0] = 'Der Griff wird nicht warm.';
  assert.ok(pruefeDaten(verneint).some((f) => /erste Grund ist verneint/.test(f)));
  const ohnePlanB = kopie();
  delete ohnePlanB.fragen.find((f) => f.id === 'f-loeffel').wennAnders;
  assert.ok(pruefeDaten(ohnePlanB).some((f) => /dass etwas anderes herauskommt/.test(f)));
});

test('keine Probe verlangt etwas Gefährliches', () => {
  for (const f of daten.fragen.filter((x) => x.probe)) {
    assert.ok(!/heiß|Herd|Backofen|kochend|Kerze|Messer/i.test(f.probe), `${f.id}: gefährliche Probe`);
    if (/Wasser/.test(f.probe)) {
      assert.ok(f.maxGrad && f.maxGrad <= MAX_GRAD, `${f.id}: Wasserversuch ohne Temperaturgrenze`);
    }
  }
  const heiss = kopie();
  heiss.fragen.find((f) => f.id === 'f-loeffel').probe = 'Stellt den Löffel in einen Topf mit heißem Wasser auf dem Herd.';
  const fehler = pruefeDaten(heiss);
  assert.ok(fehler.some((f) => /etwas Gefährliches/.test(f)));
  const zuHeiss = kopie();
  zuHeiss.fragen.find((f) => f.id === 'f-loeffel').maxGrad = 80;
  assert.ok(pruefeDaten(zuHeiss).some((f) => /zu heiß für einen Kinderversuch/.test(f)));
});

test('jede Allaussage bringt ihr Gegenbeispiel mit', () => {
  for (const f of daten.fragen.filter((x) => x.typologie)) {
    assert.ok(f.gegenbeispiel && f.gegenbeispiel.length > 30, `${f.id}`);
  }
  // Nicht jede Tasse hat einen Henkel, nicht jeder Kinderstuhl ist ein
  // geschrumpfter Erwachsenenstuhl.
  assert.match(frage('f-henkel').gegenbeispiel, /Becher/);
  assert.match(frage('f-stuhl').gegenbeispiel, /kein kleiner Erwachsenenstuhl/);
  const ohne = kopie();
  delete ohne.fragen.find((f) => f.id === 'f-henkel').gegenbeispiel;
  assert.ok(pruefeDaten(ohne).some((f) => /Allaussage braucht ihr Gegenbeispiel/.test(f)));
});

test('Materialaussagen nennen auch, was das Material schlecht kann', () => {
  for (const f of daten.fragen.filter((x) => x.material)) {
    assert.ok(f.grenze && f.grenze.length > 25, `${f.id}: keine Grenze`);
  }
  assert.match(frage('f-loeffel').grenze, /saugt|reißen|Spülmaschine/);
  const ohne = kopie();
  delete ohne.fragen.find((f) => f.id === 'f-loeffel').grenze;
  assert.ok(pruefeDaten(ohne).some((f) => /Materialien haben Eigenschaften, keine Tugenden/.test(f)));
});

test('nur Bauformen werden abgefragt – Kita und Bahnhof ausdrücklich nicht', () => {
  for (const m of MERKMALSARTEN) assert.ok(typeof m === 'string');
  const abfragbar = amHausErkennbar(daten.gebaeude);
  assert.ok(abfragbar.length >= 3);
  for (const g of abfragbar) {
    assert.equal(g.merkmalsart, 'bauform');
    assert.equal(g.optionen.filter((o) => o.richtig).length, 1, g.id);
    assert.ok(g.gegenbeispiel, `${g.id}: ein Erkennungsmerkmal ist typisch, nicht notwendig`);
  }
  const gezeigt = nichtAmHaus(daten.gebaeude);
  assert.ok(gezeigt.length >= 2, 'die Grenze des Formwissens fehlt');
  for (const g of gezeigt) {
    assert.ok(!g.optionen, `${g.id}: wird abgefragt, obwohl es keine Bauform ist`);
    assert.ok(g.warumNicht.length > 40, `${g.id}`);
  }
  assert.ok(gezeigt.some((g) => g.id === 'g-bahnhof'));
  assert.ok(gezeigt.some((g) => g.id === 'g-kita'));
  const abgefragt = kopie();
  abgefragt.gebaeude.find((g) => g.id === 'g-kita').optionen = [{ text: 'a', richtig: true }, { text: 'b', richtig: false }];
  assert.ok(pruefeDaten(abgefragt).some((f) => /kein Formwissen/.test(f)));
  const glatt = kopie();
  glatt.gebaeude = glatt.gebaeude.filter((g) => g.merkmalsart === 'bauform');
  assert.ok(pruefeDaten(glatt).some((f) => /zu glatt, um wahr zu sein/.test(f)));
});

test('keine Jahreszahlen, keine Ritter, keine Farbregel für Fachwerk', () => {
  const text = JSON.stringify(daten);
  assert.ok(!/\b1[0-9]{3}\b|\b20[0-9]{2}\b/.test(text), 'Jahreszahl im Kindertext');
  assert.ok(!/Jahrhundert|Ritter|Mittelalter|Gotik/.test(text), 'Epochenbegriff im Kindertext');
  // Fachwerk wird an den sichtbaren Balken erkannt, nicht an schwarz-weiß
  const fachwerk = daten.gebaeude.find((g) => g.id === 'g-fachwerk');
  assert.match(fachwerk.merkmal, /Holzbalken.*sichtbar|sichtbar.*Balken/);
  assert.match(fachwerk.gegenbeispiel, /nicht immer dunkel/);
  // Backstein: die Reihung ist das Merkmal, nicht die Farbe
  const backstein = daten.gebaeude.find((g) => g.id === 'g-backstein');
  assert.match(backstein.gegenbeispiel, /gelbe|dunkle/);
  assert.match(backstein.optionen.find((o) => o.richtig).text, /Reihen|Steine/);
  const datiert = kopie();
  datiert.gebaeude.find((g) => g.id === 'g-fachwerk').vertiefung = 'Solche Häuser baute man im Mittelalter.';
  assert.ok(pruefeDaten(datiert).some((f) => /Datierung oder Ritter-Erzählung/.test(f)));
});

test('die Sortenanzeige ist vollständig und die Lösung wandert', () => {
  for (const g of GELTUNGEN) assert.ok(daten.geltungTexte[g], `Text für ${g} fehlt`);
  const ohne = kopie();
  delete ohne.geltungTexte.ausgemacht;
  assert.ok(pruefeDaten(ohne).some((f) => /Text für „ausgemacht“ fehlt/.test(f)));
  // Zweite Sicherung: Die App mischt vor dem Anzeigen UND liest dieselbe
  // gemischte Liste vor. Eine feste Position wäre trotzdem ein Spickzettel,
  // sobald irgendwo einmal roh ausgegeben würde.
  const mit = [...daten.fragen, ...daten.gebaeude].filter((x) => Array.isArray(x.optionen) && x.optionen.some((o) => o.richtig));
  const stellen = new Set(mit.map((x) => x.optionen.findIndex((o) => o.richtig)));
  assert.ok(stellen.size > 1, `alle Lösungen stehen an Stelle ${[...stellen]}`);
  const gleich = kopie();
  for (const x of [...gleich.fragen, ...gleich.gebaeude]) {
    if (!Array.isArray(x.optionen)) continue;
    const i = x.optionen.findIndex((o) => o.richtig);
    if (i > 0) [x.optionen[0], x.optionen[i]] = [x.optionen[i], x.optionen[0]];
  }
  assert.ok(pruefeDaten(gleich).some((f) => /überall an derselben Stelle/.test(f)));
});

test('Sitzungsgrenze: höchstens sechs Fragen, ohne Dubletten, mit Rotation', () => {
  assert.ok(PRO_SESSION <= 6);
  const gesehen = new Set();
  for (let i = 0; i < 60; i++) {
    const runde = waehleFragen(daten.fragen);
    assert.equal(runde.length, PRO_SESSION);
    assert.equal(new Set(runde.map((f) => f.id)).size, PRO_SESSION);
    for (const f of runde) gesehen.add(f.id);
  }
  assert.ok(gesehen.size > PRO_SESSION, 'keine Rotation');
});

test('Ton und Abschluss: kein Tadel, Frage an die Erwachsenen, Schluss offline', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['dumm', 'blöd', 'leider', 'punkte', 'gewonnen', 'verloren', 'besser als', 'wertvoller']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort: ${wort}`);
  }
  for (const f of daten.fragen) {
    assert.ok(f.gespraech.trim().endsWith('?'), `${f.id}: Impuls ist keine Frage`);
  }
  for (const g of daten.gebaeude) {
    assert.ok(g.gespraech.trim().endsWith('?'), `${g.id}: Impuls ist keine Frage`);
  }
  assert.ok(daten.schlussIdeen.length >= 3);
  for (const i of daten.schlussIdeen) assert.ok(i.length >= 40, `Schlussidee zu knapp: ${i}`);
  assert.match(daten.hinweis, /Geschmack – das hat gar keine Antwort/);
});
