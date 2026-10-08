import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  PRO_SESSION, GRUNDFARBEN_ANZAHL, TRAEGER, WARM_KALT_GELTUNG,
  farbeVon, mischungVon, kanaele, relativeHelligkeit, lichtSumme,
  istSubtraktiv, istAdditiv, farbtonPaar, vomTraeger,
  mischungFuer, mischbareFarben, offeneFarben,
  partnerFuer, erreichbareMischungen, warmKaltEinordnung, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/farben.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.equal(daten.grundfarben.length, GRUNDFARBEN_ANZAHL);
  assert.ok(vomTraeger(daten, 'pigment').length >= 4);
  assert.ok(vomTraeger(daten, 'licht').length >= 3);
});

test('ZWEI ORTE: dasselbe Farbpaar geht am Bildschirm und im Kasten verschieden aus', () => {
  // Das ist die tragende Regel. Ohne sie behauptet die App stillschweigend
  // EINE Mischregel – und schickt das Kind mit einem Bildschirmergebnis
  // an den Maltisch, wo es etwas anderes bekommt und für seine richtige
  // Beobachtung korrigiert wird.
  const pigment = new Map(vomTraeger(daten, 'pigment').map((m) => [farbtonPaar(daten, m), farbeVon(daten, m.ergebnis).farbton]));
  const licht = new Map(vomTraeger(daten, 'licht').map((m) => [farbtonPaar(daten, m), farbeVon(daten, m.ergebnis).farbton]));
  const gemeinsam = [...pigment.keys()].filter((p) => licht.has(p));
  assert.ok(gemeinsam.length >= 1, 'kein Paar kommt an beiden Orten vor');
  for (const paar of gemeinsam) {
    assert.notEqual(pigment.get(paar), licht.get(paar), `${paar}: an beiden Orten dasselbe Ergebnis`);
  }
  // Rot + Grün ist der Klassiker: Licht → Gelb, Pigment → Braun.
  assert.equal(pigment.get('gruen+rot'), 'braun');
  assert.equal(licht.get('gruen+rot'), 'gelb');

  // Fällt das gemeinsame Paar weg, muss der Validator es melden.
  const nurEineWelt = kopie();
  nurEineWelt.mischungen = nurEineWelt.mischungen.filter((m) => m.traeger === 'pigment');
  nurEineWelt.zweiOrte = [];
  const fehler = pruefeDaten(nurEineWelt);
  assert.ok(fehler.some((f) => /an BEIDEN Orten vorkommt/.test(f)), fehler.join(' | '));
});

test('Pigment ist subtraktiv – das Ergebnis ist dunkler als die hellere Zutat', () => {
  for (const m of vomTraeger(daten, 'pigment')) {
    assert.ok(istSubtraktiv(daten, m), `${m.id}: nicht subtraktiv`);
    const hell = Math.max(...m.aus.map((id) => relativeHelligkeit(farbeVon(daten, id).hex)));
    assert.ok(relativeHelligkeit(farbeVon(daten, m.ergebnis).hex) < hell, m.id);
  }
  // Ein addiert aussehendes Ergebnis muss abgelehnt werden: Gelb und Blau
  // zu einem leuchtenden Hellgrün – so verhält sich Licht, nicht Farbe.
  const addiert = kopie();
  addiert.farben.find((f) => f.id === 'gruen').hex = '#B9F6B0';
  assert.ok(pruefeDaten(addiert).some((f) => /so mischt Licht, nicht Farbe/.test(f)));
});

test('Licht ist additiv – und zwar nachgerechnet, nicht behauptet', () => {
  // Lichtmischungen DARF die App rechnen: sie sind nachprüfbar. Der
  // Validator prüft sie gegen die geklammerte Summe im linearen Licht.
  assert.equal(lichtSumme('#FF0000', '#00FF00'), '#FFFF00');
  assert.equal(lichtSumme('#FF0000', '#0000FF'), '#FF00FF');
  assert.equal(lichtSumme('#00FF00', '#0000FF'), '#00FFFF');
  assert.equal(lichtSumme('#FFFFFF', '#FFFFFF'), '#FFFFFF', 'Summe wird geklammert');
  assert.equal(lichtSumme('kein hex', '#000000'), null);
  for (const m of vomTraeger(daten, 'licht')) {
    assert.ok(istAdditiv(daten, m), `${m.id}: nicht die Lichtsumme`);
    const hell = Math.max(...m.aus.map((id) => relativeHelligkeit(farbeVon(daten, id).hex)));
    assert.ok(relativeHelligkeit(farbeVon(daten, m.ergebnis).hex) > hell, `${m.id}: Licht wird beim Mischen heller`);
  }
  const verdreht = kopie();
  verdreht.farben.find((f) => f.id === 'licht-gelb').hex = '#AAAA00';
  assert.ok(pruefeDaten(verdreht).some((f) => /geklammerte Lichtsumme/.test(f)));
});

test('die App rechnet keine Pigment-Mischung – jedes Ergebnis steht in den Daten', () => {
  // Es darf keine Kanal-Arithmetik im Anwendungscode geben. Die Rechnerei
  // lebt in logik.mjs und dient nur dem Validator.
  assert.doesNotMatch(app, /kanaele|relativeHelligkeit|lichtSumme/, 'die App rechnet mit Farbkanälen');
  assert.doesNotMatch(app, /mix-blend-mode|filter:\s*(hue|saturate|invert)/, 'die App mischt per CSS');
  for (const m of vomTraeger(daten, 'pigment')) {
    assert.ok(m.giltFuer, `${m.id}: giltFuer fehlt`);
    assert.ok(m.wennAnders, `${m.id}: wennAnders fehlt`);
  }
  // Und die Herkunft der Werte ist deklariert: Richtung, nicht Messung.
  assert.match(daten.herkunftDerWerte, /Richtung, keine Messung/);
  const ohne = kopie();
  delete ohne.mischungen.find((m) => m.traeger === 'pigment').wennAnders;
  assert.ok(pruefeDaten(ohne).some((f) => /kein Fehler des Kindes/.test(f)));
  const stumm = kopie();
  stumm.herkunftDerWerte = 'Geprüfte Werte.';
  assert.ok(pruefeDaten(stumm).some((f) => /Richtung und keine Messung/.test(f)));
});

test('Licht und Pigment werden nie miteinander gemischt', () => {
  const quer = kopie();
  quer.mischungen.push({
    id: 'm-quer', traeger: 'pigment', aus: ['gelb', 'licht-blau'], ergebnis: 'gruen',
    wasPassiert: 'x', mengeAendert: 'x', giltFuer: 'x', wennAnders: 'x', suchauftrag: 'x', gespraech: 'x?',
  });
  assert.ok(pruefeDaten(quer).some((f) => /Zutat vom falschen Ort/.test(f)));
  const falschesErgebnis = kopie();
  falschesErgebnis.mischungen.find((m) => m.id === 'p-gruen').ergebnis = 'licht-gelb';
  assert.ok(pruefeDaten(falschesErgebnis).some((f) => /liegt am anderen Ort/.test(f)));
});

test('die Zwei-Orte-Karten vergleichen wirklich dasselbe Paar', () => {
  for (const o of daten.zweiOrte) {
    const l = mischungVon(daten, o.lichtMischung);
    const p = mischungVon(daten, o.pigmentMischung);
    assert.equal(l.traeger, 'licht', o.id);
    assert.equal(p.traeger, 'pigment', o.id);
    assert.equal(farbtonPaar(daten, l), farbtonPaar(daten, p), `${o.id}: verschiedene Ausgangsfarben`);
    assert.ok(o.frage.endsWith('?'), o.id);
  }
  const schief = kopie();
  schief.zweiOrte[0].lichtMischung = 'l-cyan';
  assert.ok(pruefeDaten(schief).some((f) => /vergleicht die Karte nichts/.test(f)));
  // Und die App stellt die Frage, bevor sie antwortet – und nennt beide
  // Antworten richtig.
  assert.match(app, /Beide Antworten sind richtig/);
});

test('alle drei Grundfarben-Paare sind da, keines doppelt', () => {
  const paare = daten.grundfarben.flatMap((a, i) => daten.grundfarben.slice(i + 1).map((b) => [a, b]));
  assert.equal(paare.length, 3);
  for (const [a, b] of paare) {
    const m = mischungFuer(daten, a, b);
    assert.ok(m, `kein Ergebnis für ${a}+${b}`);
    assert.equal(mischungFuer(daten, b, a).id, m.id, 'Reihenfolge darf nichts ändern');
  }
  assert.equal(mischungFuer(daten, 'gelb', 'gelb'), null, 'dieselbe Farbe zweimal mischt nichts');
  // mischungFuer liefert nur Pigment – eine Lichtmischung darf hier nie
  // herauskommen, sonst landete ein Lichtergebnis im Maltisch-Teil.
  assert.equal(mischungFuer(daten, 'licht-rot', 'licht-gruen'), null);
  const doppelt = kopie();
  doppelt.mischungen.push({ ...doppelt.mischungen[0], id: 'm-dubl' });
  assert.ok(pruefeDaten(doppelt).some((f) => /an diesem Ort schon da/.test(f)));
});

test('jedes Pigment-Ergebnis nennt, dass die Menge es verändert – und nur „ein bisschen/viel“', () => {
  for (const m of vomTraeger(daten, 'pigment')) {
    assert.ok(m.mengeAendert, `${m.id}: mengeAendert fehlt`);
    // Mengenverhältnisse wie „zwei Teile Rot auf einen Teil Blau“ sind in
    // diesem Alter nicht beherrschbar.
    assert.doesNotMatch(`${m.mengeAendert} ${m.wasPassiert}`, /\b(zwei|drei) Teile?\b|\d\s*:\s*\d/, m.id);
    assert.match(m.mengeAendert, /ein bisschen|viel|anders gemischt/, m.id);
  }
  const ohne = kopie();
  delete ohne.mischungen.find((m) => m.traeger === 'pigment').mengeAendert;
  assert.ok(pruefeDaten(ohne).some((f) => /„das“ Grün gibt es nicht/.test(f)));
});

test('warm und kalt ist eine Abmachung, kein Messwert – mit Grenzfällen', () => {
  assert.equal(daten.warmKalt.geltung, WARM_KALT_GELTUNG);
  assert.match(daten.warmKalt.erklaerung, /nachmessen/);
  // Die Begründung „weil Feuer heiß ist“ bricht beim ersten Nachsehen
  // zusammen – die App nennt die blaue Flamme selbst.
  assert.match(daten.warmKalt.erklaerung, /blaue Flamme/);
  assert.ok(daten.warmKalt.strittigeFarben.length >= 1, 'ohne Grenzfall sieht die Einteilung klarer aus als sie ist');
  assert.equal(warmKaltEinordnung(daten, 'rot'), 'warm');
  assert.equal(warmKaltEinordnung(daten, 'blau'), 'kalt');
  assert.equal(warmKaltEinordnung(daten, 'gruen'), 'strittig');
  assert.equal(warmKaltEinordnung(daten, 'violett'), 'strittig');
  assert.equal(warmKaltEinordnung(daten, 'gibtsnicht'), null);

  const messbar = kopie();
  messbar.warmKalt.geltung = 'pruefbar';
  assert.ok(pruefeDaten(messbar).some((f) => /kann man nicht nachmessen/.test(f)));
  const ohneGrenzfall = kopie();
  ohneGrenzfall.warmKalt.strittigeFarben = [];
  assert.ok(pruefeDaten(ohneGrenzfall).some((f) => /strittige Farbe/.test(f)));
  const beides = kopie();
  beides.warmKalt.kalt = [...beides.warmKalt.kalt, 'rot'];
  assert.ok(pruefeDaten(beides).some((f) => /steht in beiden Listen/.test(f)));
  const einsortiert = kopie();
  einsortiert.warmKalt.warm = [...einsortiert.warmKalt.warm, 'gruen'];
  assert.ok(pruefeDaten(einsortiert).some((f) => /strittig und trotzdem einsortiert/.test(f)));
});

test('hell und dunkel: zwei verschiedene Wege, und jeder sagt wofür er gilt', () => {
  // Wasser und Deckweiß sind nicht dasselbe – ein Bau, der Helligkeit als
  // einen Schieberegler modelliert, macht aus zwei Sachverhalten einen.
  for (const h of daten.hellDunkel) {
    assert.ok(h.nurBei, `${h.id}: nurBei fehlt`);
    assert.ok(['heller', 'dunkler'].includes(h.richtung), h.id);
  }
  const heller = daten.hellDunkel.filter((h) => h.richtung === 'heller');
  assert.ok(heller.length >= 2, 'heller geht auf zwei Wege – beide müssen da sein');
  assert.equal(new Set(heller.map((h) => h.nurBei)).size, heller.length, 'die Wege gelten für verschiedene Kästen');
  assert.match(daten.hellDunkel.find((h) => h.id === 'h-wasser').wasPassiert, /völlig anderes|weniger Farbe/);
  // Und beide Karten stehen auf einem Bildschirm, nicht rotierend.
  assert.match(app, /daten\.hellDunkel\.map\(karte\)/);
  const ohne = kopie();
  delete ohne.hellDunkel[0].nurBei;
  assert.ok(pruefeDaten(ohne).some((f) => /hellen verschieden auf/.test(f)));
  const einseitig = kopie();
  einseitig.hellDunkel = einseitig.hellDunkel.filter((h) => h.richtung === 'heller');
  assert.ok(pruefeDaten(einseitig).some((f) => /beide Richtungen/.test(f)));
});

test('„Mischen macht dunkler“ steht nie als allgemeines Gesetz da', () => {
  // Falsch für Licht, und sogar im Kasten falsch, sobald Deckweiß im
  // Spiel ist. Richtig ist: Buntfarbe zu Buntfarbe macht dunkler.
  const alle = JSON.stringify(daten);
  // Nur die PIGMENT-Texte: der Lichttext darf „nicht dunkler“ sagen, das ist
  // ja genau der Unterschied.
  for (const m of vomTraeger(daten, 'pigment')) {
    if (/dunkler/.test(m.wasPassiert)) {
      assert.match(m.wasPassiert, /Buntfarben/, `${m.id}: „dunkler“ ohne die Einschränkung auf Buntfarben`);
    }
  }
  assert.doesNotMatch(alle, /Mischen wird es (immer )?dunkler/);
  assert.doesNotMatch(alle, /nie heller/);
});

test('die App stellt richtig: nicht alle Farben lassen sich mischen', () => {
  assert.match(daten.nichtMischbar.satz, /nicht alle/);
  assert.ok(daten.nichtMischbar.beispiele.length >= 3);
  assert.match(JSON.stringify(daten.nichtMischbar), /Weiß/);
  const falsch = kopie();
  falsch.nichtMischbar.satz = 'Aus Gelb, Rot und Blau kann man alle Farben mischen.';
  assert.ok(pruefeDaten(falsch).some((f) => /NICHT alle Farben mischen/.test(f)));
  // Und kein Text behauptet das Gegenteil.
  assert.doesNotMatch(JSON.stringify(daten), /alle (anderen )?Farben mischen/);
});

test('Farbe ist nie der einzige Informationsträger', () => {
  // Rund jeder zwölfte Junge sieht Rot und Grün anders. Jede Fläche in
  // der App bekommt darum ihren Namen – und ein aria-label.
  for (const f of daten.farben) {
    assert.ok(f.name, `${f.id}: name fehlt`);
    assert.ok(kanaele(f.hex), `${f.id}: hex ungültig`);
    assert.ok(f.farbton, `${f.id}: farbton fehlt`);
    assert.ok(TRAEGER.includes(f.traeger), `${f.id}: traeger`);
  }
  assert.match(app, /'aria-label': farbe\.name/, 'der Farbfleck hat kein aria-label');
  assert.match(app, /el\('span', \{ style: 'font-weight:700;text-align:center' \}, farbe\.name\)/, 'der Name steht nicht am Fleck');
  const ohneName = kopie();
  delete ohneName.farben[0].name;
  assert.ok(pruefeDaten(ohneName).some((f) => /Farbe allein trägt die Information nicht/.test(f)));
});

test('Farbnamen dreisprachig – und die App sagt, wo die Sprachen anders schneiden', () => {
  const uk = { gelb: 'жовтий', rot: 'червоний', blau: 'синій', gruen: 'зелений', orange: 'оранжевий', violett: 'фіолетовий', braun: 'коричневий' };
  const ru = { gelb: 'жёлтый', rot: 'красный', blau: 'синий', gruen: 'зелёный', orange: 'оранжевый', violett: 'фиолетовый', braun: 'коричневый' };
  for (const f of daten.farben.filter((x) => x.traeger === 'pigment')) {
    assert.equal(f.ukName, uk[f.id], `${f.id}: uk`);
    assert.equal(f.ruName, ru[f.id], `${f.id}: ru`);
  }
  // Eine stille 1:1-Liste wäre sachlich falsch: Russisch und Ukrainisch
  // haben für Blau ZWEI Grundfarbwörter.
  const b = farbeVon(daten, 'blau');
  assert.ok(b.sprachHinweis, 'blau ohne Sprachhinweis');
  assert.match(b.sprachHinweis, /блакитний/);
  assert.match(b.sprachHinweis, /голубой/);
  const ohneHinweis = kopie();
  for (const f of ohneHinweis.farben) delete f.sprachHinweis;
  assert.ok(pruefeDaten(ohneHinweis).some((f) => /anders einteilen/.test(f)));
});

test('Sitzungsgrenze: der Zähler in der App begrenzt, nicht eine Auswahlfunktion', () => {
  // Frueher stand hier ein Test auf waehleMischungen() – eine Funktion,
  // die die App gar nicht aufrief: die Mischungen entstehen interaktiv
  // aus zwei getippten Farben. Der Test bewachte also toten Code.
  assert.ok(PRO_SESSION <= 4);
  assert.match(app, /fertigeMischungen \+= 1/);
  assert.match(app, /const fertig = fertigeMischungen >= PRO_SESSION/);
  assert.match(app, /Mischung \$\{fertigeMischungen \+ 1\} von \$\{PRO_SESSION\}/);
  // Und die Lichtmischungen landen nie im Maltisch-Teil.
  for (const a of offeneFarben(daten, mischbareFarben(daten))) {
    assert.equal(farbeVon(daten, a).traeger, 'pigment', a);
  }
  // Alle Pigment-Mischungen sind in PRO_SESSION Schritten erreichbar:
  // Braun braucht Gruen, also zwei Mischungen vorher.
  assert.ok(vomTraeger(daten, 'pigment').length >= PRO_SESSION);
  assert.ok(erreichbareMischungen(daten).length === vomTraeger(daten, 'pigment').length);
});

test('die warm/kalt-Anzeige kommt aus warmKaltEinordnung, nicht aus drei Listen', () => {
  // Sonst koennten Anzeige und Logik auseinanderlaufen – und
  // warmKaltEinordnung waere toter Code, den nur der Test anfasst.
  assert.match(app, /warmKaltEinordnung\(daten, f\.id\) === art/);
  assert.match(app, /reihe\('warm'/);
  assert.match(app, /reihe\('kalt'/);
  assert.match(app, /reihe\('strittig'/);
});

test('Ton, Sicherheit und Abschluss am Papier', () => {
  const text = JSON.stringify(daten).toLowerCase();
  for (const wort of ['dumm', 'blöd', 'leider', 'punkte', 'sternchen', 'gewonnen', 'verloren', 'belohnung']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort: ${wort}`);
  }
  for (const m of vomTraeger(daten, 'pigment')) {
    assert.ok(m.gespraech.trim().endsWith('?'), `${m.id}: Impuls ist keine Frage`);
    assert.ok(m.wasPassiert.length >= 60, `${m.id}: Erklärung zu knapp`);
  }
  assert.ok(daten.malauftraege.length >= 3);
  for (const a of daten.malauftraege) assert.ok(a.length >= 40, `Malauftrag zu knapp: ${a}`);
  // Die Sicherheitshinweise, die wirklich zählen.
  const sicher = daten.sicherheit.join(' ');
  for (const muss of ['Gerät weg', 'Schraubglas', 'CE', 'EN 71', 'drei Jahren', 'Hände waschen']) {
    assert.ok(sicher.includes(muss), `Sicherheitshinweis fehlt: ${muss}`);
  }
  const wenig = kopie();
  wenig.sicherheit = ['nur einer'];
  assert.ok(pruefeDaten(wenig).some((f) => /sicherheit/.test(f)));
  // Die App sagt selbst, wo ihre Grenze ist, und endet am Papier.
  assert.match(daten.ehrlichkeit, /Licht/);
  assert.match(app, /Bildschirm aus/);
  // Kein Entmischen-Knopf: Mischen ist nicht umkehrbar.
  assert.doesNotMatch(app, /\b(entmisch\w*|rückgängig|zurückmischen)/i);
  assert.match(app, /Von vorn wählen/);
});

test('jede Mischung ist von den Grundfarben aus erreichbar', () => {
  // Der Browser-Durchlauf hat das gefunden: „Rot und Grün gibt Braun“ war
  // gar nicht erreichbar, weil der Kasten nur die drei Grundfarben
  // anbot – Grün liegt da nicht drin. Ein Datensatz, den kein Kind je
  // sieht, ist kein Datensatz.
  const erreichbar = erreichbareMischungen(daten);
  assert.equal(erreichbar.length, vomTraeger(daten, 'pigment').length);
  for (const m of vomTraeger(daten, 'pigment')) assert.ok(erreichbar.includes(m.id), m.id);

  // Und die Reihenfolge stimmt: Braun geht erst, wenn Grün gemischt ist.
  assert.deepEqual(offeneFarben(daten, []).sort(), ['blau', 'gelb', 'rot']);
  assert.ok(offeneFarben(daten, ['gruen']).includes('gruen'));
  // Orange ist Ergebnis, aber keine Zutat – es wandert nicht in den Kasten.
  assert.equal(offeneFarben(daten, ['orange']).includes('orange'), false);
  assert.deepEqual(mischbareFarben(daten).sort(), ['blau', 'gelb', 'gruen', 'rot']);

  // Eine Zutat, die weder Grundfarbe noch Ergebnis ist, liegt nie im
  // Kasten – die Mischung damit ist unerreichbar.
  const unerreichbar = kopie();
  unerreichbar.farben.push(
    { id: 'gold', traeger: 'pigment', farbton: 'gold', name: 'Gold', hex: '#8A6A1F', ukName: 'золотий', ruName: 'золотой' },
    { id: 'tuerkis', traeger: 'pigment', farbton: 'tuerkis', name: 'Türkis', hex: '#0E6B6B', ukName: 'бірюзовий', ruName: 'бирюзовый' },
  );
  unerreichbar.mischungen.push({
    id: 'p-tuerkis', traeger: 'pigment', aus: ['gold', 'blau'], ergebnis: 'tuerkis',
    wasPassiert: 'Ein langer Satz, der mindestens sechzig Zeichen hat, damit der Tontest hier nicht greift.',
    mengeAendert: 'ein bisschen anders gemischt', giltFuer: 'Schulmalfarben',
    wennAnders: 'Anders ist auch gut.', suchauftrag: 'Sucht etwas Türkises.', gespraech: 'Magst du Türkis?',
  });
  assert.equal(erreichbareMischungen(unerreichbar).includes('p-tuerkis'), false);
  const fehler = pruefeDaten(unerreichbar);
  assert.ok(fehler.some((f) => /nicht erreichbar/.test(f)), fehler.join(' | '));
});

test('angeboten wird nur, wofür es ein Ergebnis gibt – keine Sackgasse', () => {
  const start = offeneFarben(daten, []);
  for (const a of start) {
    const partner = partnerFuer(daten, a, start);
    assert.ok(partner.length >= 1, `${a}: kein Partner`);
    for (const b of partner) assert.ok(mischungFuer(daten, a, b), `${a}+${b}`);
    assert.equal(partner.includes(a), false, 'sich selbst');
  }
  // Mit Grün im Kasten kommt Rot ein Partner mehr dazu.
  assert.equal(partnerFuer(daten, 'rot', offeneFarben(daten, [])).length, 2);
  assert.equal(partnerFuer(daten, 'rot', offeneFarben(daten, ['gruen'])).length, 3);
  // Gelb und Grün haben keine Mischung – und werden darum nicht angeboten.
  assert.equal(mischungFuer(daten, 'gelb', 'gruen'), null);
  assert.equal(partnerFuer(daten, 'gelb', offeneFarben(daten, ['gruen'])).includes('gruen'), false);
  // Die App deaktiviert solche Knöpfe statt in keinePaarung zu laufen.
  assert.match(app, /partnerFuer\(daten, ersteWahl, kasten\.map/);
  assert.match(app, /dafür gibt es hier keine Mischung/);
});

test('der Zähler zählt fertige Mischungen, nicht verschiedene', () => {
  // Sonst käme ein Kind, das dasselbe Paar dreimal nimmt, nie zum Ende –
  // genau das ist im Browser-Durchlauf passiert.
  assert.match(app, /fertigeMischungen \+= 1/);
  assert.match(app, /fertigeMischungen >= PRO_SESSION/);
  assert.doesNotMatch(app, /gemischt\.size/);
  assert.match(app, /erreicht = \[\.\.\.erreicht, m\.ergebnis\]/);
});
