import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import * as logik from '../logik.mjs';
import {
  PROFILE, ARTEN, LEITER, kriteriumVon, giltFuer, kriterienFuer, istAbhakbar,
  stufenBis, bereicheInReihenfolge, offenePunkte, dauerregeln, bericht, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/kriterien.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const logikQuelle = await readFile(new URL('../logik.mjs', import.meta.url), 'utf8');
const logikCode = logikQuelle.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const seite = await readFile(new URL('../index.html', import.meta.url), 'utf8');

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.kriterien.length >= 20);
});

test('es gibt keine Gesamtwertung – nirgends', () => {
  // „Die Wohnung ist zu 82 Prozent sicher“ ist eine falsche Aggregation
  // nicht austauschbarer Risiken und eine Einladung, aufzuhören. Die
  // Engine-Vorbilder im Korpus rechnen genau das: apps/kria-check druckt
  // „Erfüllt: n von m“, apps/kita-familien-bruecke liefert eine Ampel.
  // Gebannt sind die BEGRIFFE einer Wertung, nicht die Zeichenfolge
  // „Punkte“: `offenePunkte` sind offene Posten und kein Punktestand. Ein
  // Netz auf /punkte/ hätte die eigene Kernfunktion getroffen – dieselbe
  // Wortsinn-Kollision wie „Wenige Punkte“ in apps/sprich-mit-mir, und es
  // ist das vierte Mal in dieser Welle, dass ein pauschales Wortverbot
  // einen harmlosen Wortsinn trifft.
  for (const name of Object.keys(logik)) {
    assert.doesNotMatch(name, /gesamt|anteil|ampel|prozent|score|note|punktestand|punktzahl|bewerte/i,
      `logik exportiert ${name}`);
  }
  assert.ok(Object.keys(logik).includes('offenePunkte'), 'offene Posten heißen weiterhin so');
  // Geprüft wird der Teil VOR `pruefeDaten`: der Validator muss die Wörter
  // nennen dürfen, die er verbietet („keinErgebnis muss ‚keine Ampel‘
  // enthalten“) – das ist dieselbe Lage wie `nichtBeruhigen` in
  // apps/sprich-mit-mir und die Öle in der Bewegungs-Kartei, nur zum
  // fünften Mal. Deshalb wird hier die Rechnung gesucht, nicht das Wort.
  const ohneValidator = logikCode.slice(0, logikCode.indexOf('export function pruefeDaten'));
  assert.ok(ohneValidator.length > 500, 'der Schnitt muss den Rechenteil wirklich enthalten');
  assert.doesNotMatch(ohneValidator, /Math\.round\([^)]*\/[^)]*\* ?100/);
  assert.doesNotMatch(ohneValidator, /anteil|ampel|prozent|punktestand|punktzahl/i);
  assert.doesNotMatch(ohneValidator, /\.reduce\(/, 'kein Summieren über die Kriterien');
  // Und im Validator stehen die Wörter nur als Pflicht-Muster.
  assert.match(logikCode, /keine Note\|keinen Prozentwert\|keine Ampel/);
  // Der Bericht selbst trägt kein n von m und kein Prozent.
  for (const ausloeser of [[], ['robbt-kriecht'], ['zieht-sich-hoch', 'laeuft-an-moebeln']]) {
    for (const p of PROFILE) {
      const b = bericht(daten, p, ausloeser, {});
      // Gesucht wird ein WERT, nicht das Wort: der Bericht zitiert seine
      // eigene Zusage „keinen Prozentwert“ und muss das Wort dafür nennen.
      assert.doesNotMatch(b, /\d+\s*von\s*\d+/, `${p}: n von m im Bericht`);
      assert.doesNotMatch(b, /\d+\s*(%|Prozent)/, `${p}: ein Prozentwert im Bericht`);
      assert.doesNotMatch(b, /bestanden|erfüllt:/i, `${p}: Erfüllungsgrad im Bericht`);
      assert.match(b, /keinen Prozentwert/, `${p}: die Zusage muss im Bericht stehen`);
    }
  }
  // Auch die Anzeige zählt nur die offenen Zeilen, nie „x von y“.
  assert.doesNotMatch(code, /von \$\{liste\.length\}/);
  assert.match(code, /offen\.length/);
});

test('eine leere Liste ist keine Freigabe', () => {
  // Alle Haken gesetzt: der Bericht darf nicht nach „fertig“ klingen.
  const alle = Object.fromEntries(daten.kriterien.map((k) => [k.id, true]));
  const b = bericht(daten, 'zuhause', ['laeuft-an-moebeln'], alle);
  assert.match(b, /Nichts offen aus dieser Liste/);
  assert.match(b, /nicht, dass der Raum sicher ist/);
  assert.match(b, /Momentaufnahme/);
  const mut = kopie();
  mut.nichtFertig = 'Fertig!';
  assert.ok(pruefeDaten(mut).some((f) => /nicht als Freigabe/.test(f)));
});

test('Dauerregeln sind nicht abhakbar', () => {
  // „Beim Baden nie weggehen“ ist keine Maßnahme, die man einmal erledigt.
  // Ein Haken daran würde eine Dauerregel als erledigt ausgeben.
  assert.deepEqual([...ARTEN], ['einmal', 'immer']);
  const immer = daten.kriterien.filter((k) => k.art === 'immer');
  assert.ok(immer.length >= 5, 'es gibt wirklich Dauerregeln');
  for (const k of immer) assert.equal(istAbhakbar(k), false, k.id);
  // Sie erscheinen nie in der Offen-Liste, egal was angehakt ist.
  const alle = Object.fromEntries(daten.kriterien.map((k) => [k.id, true]));
  for (const erledigt of [{}, alle]) {
    const offen = offenePunkte(daten, 'zuhause', ['robbt-kriecht'], erledigt);
    assert.ok(offen.every(istAbhakbar), 'eine Dauerregel steht in der Offen-Liste');
  }
  assert.ok(dauerregeln(daten, 'zuhause', ['robbt-kriecht']).length >= 4);
  // Und im Markup hat eine Dauerregel keinen Knopf.
  assert.match(code, /istAbhakbar\(k\)/);
  assert.match(code, /role: 'checkbox'/);
});

test('der Gegenstand ist der Raum, nie das Kind', () => {
  // Die wahrscheinlichste Abdrift, weil meilenstein-begleiter dieselbe
  // Zielgruppe hat: „Kind zieht sich hoch“, „Baby robbt schon“,
  // „Kind schläft durch“.
  for (const k of daten.kriterien) {
    assert.doesNotMatch(k.was, /^(Dein|Ihr|Das|Mein) Kind\b/, k.id);
    assert.doesNotMatch(k.was, /\bKind (kann|schläft durch|robbt schon|krabbelt schon)\b/, k.id);
  }
  for (const satz of ['Dein Kind zieht sich hoch.', 'Das Kind schläft durch in seinem Bett.', 'Mein Kind fühlt sich hier geborgen.']) {
    const mut = kopie();
    mut.kriterien[0].was = satz;
    assert.ok(pruefeDaten(mut).some((f) => /Subjekt des Kriteriums/.test(f)), satz);
  }
  // Die Fähigkeitsfrage lebt getrennt, als reiner Filter.
  assert.ok(daten.ausloeser.every((a) => a.frage));
  assert.match(code, /nur ein Filter/);
});

test('„psychische Geborgenheit“ ist in Raum-Eigenschaften übersetzt', () => {
  // Das vierte Quellziel. Als Checkbox wäre es eine Beurteilung von Person
  // und Bindung – gegen die Projektregel und fachlich nicht prüfbar.
  const g = daten.kriterien.filter((k) => k.bereich === 'geborgenheit');
  assert.ok(g.length >= 3);
  for (const k of g) {
    // Jede Zeile nennt eine prüfbare Eigenschaft des Raums.
    assert.match(k.was, /Ecke|Bildschirm|sehen|hören|abdunkeln|Zugluft|Durchgangsverkehr|Schlafplatz/i, k.id);
    assert.doesNotMatch(k.was, /Bindung|feinfühlig|liebevoll|geborgen fühlt/i, k.id);
  }
  assert.ok(g.some((k) => /kein Bildschirm|kein Dauerradio/.test(k.was)));
});

test('der Schlafplatz steht zuerst und ohne Ausnahmeklausel', () => {
  // Jedes „wenn … dann ist auch … in Ordnung“ ist hier tödlich:
  // „Bauchlage ist okay, sobald das Baby den Kopf halten kann.“
  assert.equal(bereicheInReihenfolge(daten)[0].id, 'schlafen');
  const schlaf = daten.kriterien.filter((k) => k.bereich === 'schlafen');
  assert.ok(schlaf.length >= 5);
  for (const k of schlaf) {
    assert.doesNotMatch(`${k.was} ${k.warum}`, /\bsobald\b|\bsolange\b|ist (okay|in Ordnung), (wenn|sobald)/i, k.id);
  }
  for (const pflicht of [/Rücken/, /Schlafsack/, /eigene[sn]? Bett/, /geraucht|rauchfrei/]) {
    assert.ok(schlaf.some((k) => pflicht.test(k.was)), `fehlt: ${pflicht}`);
  }
  const mut = kopie();
  mut.kriterien.find((k) => k.bereich === 'schlafen').warum += ' Bauchlage ist okay, sobald das Baby den Kopf halten kann.';
  assert.ok(pruefeDaten(mut).some((f) => /Ausnahmeklausel/.test(f)));
  // Nichts Weiches im Bett, und das Nestchen ist eigens genannt.
  assert.ok(schlaf.some((k) => /Nestchen|Bettumrandung/.test(k.warum)));
});

test('Auslöser sind Fähigkeiten, nicht Monate', () => {
  // Ein Treppenschutzgitter ist für ein Neugeborenes irrelevant und für ein
  // robbendes Kind dringend. Das Gefahrenprofil macht die Motorik.
  for (const a of daten.ausloeser) assert.doesNotMatch(`${a.name} ${a.frage}`, /Monat|Woche|\d/, a.id);
  const neu = kriterienFuer(daten, 'zuhause', []);
  const mobil = kriterienFuer(daten, 'zuhause', ['robbt-kriecht', 'zieht-sich-hoch']);
  assert.ok(mobil.length > neu.length, 'mehr Fähigkeiten müssen mehr Zeilen auslösen');
  assert.ok(!neu.some((k) => /Treppe/.test(k.was)), 'das Treppengitter darf nicht von Anfang an stehen');
  assert.ok(mobil.some((k) => /Treppe/.test(k.was)));
  assert.ok(neu.every((k) => k.ausloeser === 'immer'));
});

test('Kindertagespflege hat ein eigenes Profil', () => {
  // Eine Privatwohnung mit beruflicher Verantwortung und eigenem
  // Unfallversicherungsträger – sie fällt weder unter „Zuhause“ noch unter
  // „Krippe“.
  assert.deepEqual([...PROFILE], ['zuhause', 'tagespflege', 'krippe']);
  assert.ok(daten.profile.some((p) => p.id === 'tagespflege'));
  assert.match(daten.profile.find((p) => p.id === 'tagespflege').beschreibung, /beide Spalten|beruflicher Verantwortung/);
  for (const p of PROFILE) assert.ok(kriterienFuer(daten, p, ['robbt-kriecht']).length >= 10, p);
  // Mindestens ein Kriterium ist profil-spezifisch in beide Richtungen.
  assert.ok(daten.kriterien.some((k) => !giltFuer(k, 'krippe')));
  assert.ok(daten.kriterien.some((k) => k.giltFuer.length === 1 && k.giltFuer[0] === 'krippe'));
  const mut = kopie();
  mut.kriterien[0].giltFuer = ['buero'];
  assert.ok(pruefeDaten(mut).some((f) => /unbekanntes Profil/.test(f)));
});

test('jede Zeile nennt die Stelle – und keine erfundene Fundstelle', () => {
  // Eine erfundene Fundstelle sieht genauso aus wie eine geprüfte. Darum
  // darf ein Kapitel- oder Paragrafenverweis nur dastehen, wenn die Quelle
  // als geprüft markiert ist.
  for (const k of daten.kriterien) assert.ok(k.quelle?.gremium, k.id);
  const mut = kopie();
  mut.kriterien[0].warum += ' Siehe Kap. 4.2.';
  mut.kriterien[0].quelle.geprueft = false;
  assert.ok(pruefeDaten(mut).some((f) => /ohne dass die Quelle als geprüft/.test(f)));
  assert.match(daten.quellenHinweis, /nicht Seitenzahlen/);
  assert.match(daten.quellenHinweis, /Keine der genannten Stellen hat diesen Check geprüft oder freigegeben/);
  // Die eine Regel, die wirklich nachgesehen ist: 102-602 hat 102-002
  // ersetzt, die 2020 zurückgezogen wurde – docs/10 nennt noch die alte.
  assert.match(daten.quellenKorrektur, /102-602/);
  assert.match(daten.quellenKorrektur, /102-002/);
  assert.match(daten.quellenKorrektur, /zurückgezogen/);
  assert.ok(daten.kriterien.some((k) => /102-602/.test(k.quelle.gremium) && k.quelle.geprueft === true));
});

test('keine Erste Hilfe, keine Überwachungstechnik, keine erfundene Nummer', () => {
  const alles = JSON.stringify(daten.kriterien);
  assert.doesNotMatch(alles, /Heimlich|Erbrechen ausl|Salzwasser|Reanimation|Honig/i);
  assert.doesNotMatch(alles, /Babyphone|Sensormatte|Atemmonitor|Wearable/i);
  for (const [feld, text] of [['warum', 'Bei Verschlucken das Heimlich-Manöver anwenden.'], ['warum', 'Eine Sensormatte warnt rechtzeitig.']]) {
    const mut = kopie();
    mut.kriterien[0][feld] = `${mut.kriterien[0][feld]} ${text}`;
    assert.ok(pruefeDaten(mut).length > 0, text);
  }
  assert.match(daten.keineErsteHilfe, /112/);
  assert.match(daten.keineTechnik, /kein Sicherheitsmerkmal/);
  // Es gibt keine bundesweite Giftnotruf-Nummer – also wird keine gedruckt.
  assert.match(daten.gift, /gibt es nicht/);
  assert.match(daten.gift, /regionale Giftinformationszentren/);
  const mut = kopie();
  mut.gift += ' Rufen Sie 030 19240 an.';
  assert.ok(pruefeDaten(mut).some((f) => /Telefonnummer steht in den Daten/.test(f)));
});

test('kritische Zeilen stehen zuerst und sind in jedem Lebensgefahr-Bereich vorhanden', () => {
  const offen = offenePunkte(daten, 'zuhause', ['robbt-kriecht', 'zieht-sich-hoch'], {});
  const erstesUnkritisch = offen.findIndex((k) => !k.kritisch);
  if (erstesUnkritisch >= 0) {
    assert.ok(offen.slice(erstesUnkritisch).every((k) => !k.kritisch), 'kritische und unkritische sind vermischt');
  }
  for (const b of ['schlafen', 'stuerzen', 'ersticken', 'verbrennen', 'vergiften', 'ertrinken']) {
    assert.ok(daten.kriterien.some((k) => k.bereich === b && k.kritisch), b);
    const mut = kopie();
    for (const k of mut.kriterien) if (k.bereich === b) delete k.kritisch;
    assert.ok(pruefeDaten(mut).some((f) => f.startsWith(b)), b);
  }
  // Die Knopfzelle hat eine eigene Zeile, nicht „unter Kleinteile“.
  const knopf = daten.kriterien.find((k) => /Knopfzelle/.test(k.was));
  assert.ok(knopf?.kritisch);
  assert.match(knopf.warum, /Speiseröhre/);
});

test('Steckdosen: die Dose, nicht der Aufkleber – und kein „kindersicher“', () => {
  // Der Katalogeintrag legt „Steckdosensicherung aufkleben“ nahe. Was
  // belegbar ist: die Dose mit erhöhtem Berührungsschutz nach DIN VDE 0620,
  // nachgerüstet von einer Elektrofachkraft. Dass eine Dose „kindersicher“
  // sei, darf nicht behauptet werden – der VDE hat sein Verfahren nach
  // einem tödlichen Unfall in einer Kita verschärft. Ob ein aufgeklebter
  // Einsatz schützt, kann dieser Check nicht beurteilen, und er behauptet
  // es auch nicht in die andere Richtung.
  const s = daten.kriterien.find((k) => /Steckdose/.test(k.was));
  assert.ok(s);
  assert.match(s.was, /erhöhtem Berührungsschutz/);
  assert.match(s.was, /DIN VDE 0620/);
  assert.match(s.was, /Elektrofachkraft/);
  assert.match(s.warum, /kein absoluter Schutz/);
  assert.match(s.warum, /kann dieser Check nicht beurteilen/);
  assert.doesNotMatch(JSON.stringify(daten).replace(/„kindersicher“ sei[^.]*\./g, ''), /ist kindersicher|sind kindersicher/);
  assert.equal(s.quelle.geprueft, true);
});

test('ein Schlüssel, löschbar, kein Kind-Datum', () => {
  assert.equal((code.match(/localStorage\.setItem/g) ?? []).length, 1);
  assert.match(code, /localStorage\.removeItem\(SCHLUESSEL\)/);
  assert.doesNotMatch(code, /localStorage\.clear/);
  assert.match(code, /Haken löschen/);
  // Die Haken liegen JE PROFIL in demselben einen Schlüssel: 33 von 34
  // Zeilen gelten für alle drei Profile, und vorher sah eine nie
  // besichtigte Krippe als erledigt aus, wenn zuhause abgehakt war.
  assert.match(code, /stand\[profil\]/);
  assert.match(code, /\[profil\]: e/);
  // Der Stand liegt im Arbeitsspeicher, der Speicher ist die Kopie – sonst
  // tut jedes Antippen bei gesperrtem localStorage sichtbar nichts.
  assert.match(code, /let stand =/);
  assert.match(code, /speicherSperre/);
  assert.match(code, /kann gerade nichts behalten/);
  // Und der Fokus bleibt auf der getippten Zeile.
  assert.match(code, /render\(id\)/);
  assert.match(code, /getElementById\(`skc-\$\{fokusId\}`\)\?\.focus\(\)/);
  assert.doesNotMatch(code, /Geburtsdatum|new Date|Date\.now/);
  assert.doesNotMatch(code, /<input|<textarea/);
  assert.match(code, /el\('textarea'/, 'das Berichtsfeld ist readonly und kein Eingabefeld');
  assert.match(code, /readonly: true/);
  assert.doesNotMatch(code, /hilfeInsel|hilfe-insel|116\s?111/);
});

test('Druckblatt und Politik', () => {
  assert.match(code, /window\.print\(\)/);
  assert.match(druck, /@media print/);
  assert.match(druck, /\.skc-nur-bildschirm \{ display: none/);
  assert.match(druck, /break-inside: avoid/);
  const druckTeil = druck.slice(druck.indexOf('@media print'));
  for (const verboten of ['Name', 'Woche', 'Stern', 'Prozent']) {
    assert.ok(!druckTeil.includes(verboten), `Druck enthält ${verboten}`);
  }
  // Auf dem Papier steht die Offen-Liste als Text, und das Häkchen-Zeichen
  // der Klickliste ist aus: ein Haken auf einem Druckblatt ist nach docs/02
  // verboten, und vorher trug jede Zeile eines.
  assert.match(druck, /\.skc-marke \{ display: none/);
  assert.match(druck, /\.skc-nur-druck \{ display: block/);
  assert.match(code, /class: 'skc-marke'/);
  assert.match(code, /skc-nur-druck/);
  const druckBlock = code.slice(code.indexOf('skc-nur-druck'), code.indexOf("skc-block skc-nur-bildschirm"));
  assert.match(druckBlock, /Offene Punkte/);
  assert.match(druckBlock, /Regeln für jedes Mal/);
  assert.match(druckBlock, /daten\.nichtFertig/);
  assert.match(seite, /lang="de"/);
  assert.match(seite, /<title>/);
  assert.match(seite, /width=device-width/);
  assert.match(seite, /default-src 'self'/);
  assert.match(seite, /<main/);
  assert.match(seite, /<noscript>/);
  assert.match(seite, /aria-live/);
  assert.match(code, /installiereNetzwerkWaechter\(\)/);
  assert.match(code, /impressum\.html/);
  assert.doesNotMatch(JSON.stringify(daten), /https?:\/\//);
  assert.match(code, /bewegungs-kartei-erstes-jahr/);
  assert.match(code, /meilenstein-begleiter/);
});

test('die Fähigkeiten sind eine kumulative Leiter', () => {
  // Der schwerste Fehler der Welle: der Filter verglich exakt. Ein Kind, das
  // schon an Möbeln läuft, bekam EINE zusätzliche Zeile statt aller
  // darunter – kein Treppengitter, kein Herdschutz, keine Fenstersicherung.
  // Wer eine Stufe nennt, hat die darunter hinter sich.
  assert.deepEqual(stufenBis([]), ['immer']);
  assert.deepEqual(stufenBis(['dreht-sich']), ['immer', 'dreht-sich']);
  assert.deepEqual(stufenBis(['laeuft-an-moebeln']), ['immer', ...LEITER]);
  // Die oberste Stufe allein schaltet jede Stufe darunter mit.
  assert.deepEqual(stufenBis(['laeuft-an-moebeln']), stufenBis([...LEITER]));
  // Eine unbekannte Angabe senkt die Leiter nicht.
  assert.deepEqual(stufenBis(['fliegt']), ['immer']);
  assert.deepEqual(stufenBis(['fliegt', 'sitzt-frei']), ['immer', 'dreht-sich', 'robbt-kriecht', 'sitzt-frei']);

  for (const profil of PROFILE) {
    // 1. Monoton: eine höhere Stufe zeigt nie weniger als eine niedrigere.
    let vorher = kriterienFuer(daten, profil, []).length;
    for (const stufe of LEITER) {
      const jetzt = kriterienFuer(daten, profil, [stufe]).length;
      assert.ok(jetzt >= vorher, `${profil}/${stufe}: ${jetzt} < ${vorher}`);
      vorher = jetzt;
    }
    // 2. Die oberste Stufe zeigt alles, was das Profil überhaupt hat.
    const alles = daten.kriterien.filter((k) => giltFuer(k, profil));
    assert.equal(kriterienFuer(daten, profil, ['laeuft-an-moebeln']).length, alles.length, profil);
    // 3. Jede angebotene Fähigkeit schaltet in mindestens einem Profil
    //    etwas frei – ein Filter ohne Wirkung wäre eine Frage zum Kind,
    //    auf die nichts folgt.
  }
  for (const stufe of LEITER) {
    const wirkt = PROFILE.some((profil) => {
      const ohne = new Set(kriterienFuer(daten, profil, [stufe]).map((k) => k.id));
      const davor = kriterienFuer(daten, profil, LEITER.slice(0, LEITER.indexOf(stufe)));
      return davor.length < ohne.size;
    });
    assert.ok(wirkt, `${stufe} schaltet nichts frei`);
  }
  // Die Zeilen, die erst mit Mobilität dazukommen, sind namentlich da.
  const laeuft = kriterienFuer(daten, 'zuhause', ['laeuft-an-moebeln']).map((k) => k.was).join(' ');
  for (const pflicht of ['Schutzgitter', 'Fenster und Balkontüren', 'Herd und Backofen', 'Pflanzen', 'Eimer']) {
    assert.match(laeuft, new RegExp(pflicht), pflicht);
  }
  // Was immer gilt, hängt an keiner Stufe: eine robbende Hand erreicht die
  // Steckdose vor jedem Hochziehen.
  assert.equal(kriteriumVon(daten, 'g04').ausloeser, 'immer');
  assert.match(kriterienFuer(daten, 'zuhause', []).map((k) => k.was).join(' '), /Steckdosen/);
});

test('Hilfsfunktionen', () => {
  assert.ok(kriteriumVon(daten, 's01'));
  assert.equal(kriteriumVon(daten, 'x'), null);
  assert.equal(giltFuer(kriteriumVon(daten, 's07'), 'zuhause'), false);
  assert.equal(giltFuer(kriteriumVon(daten, 's07'), 'krippe'), true);
  assert.equal(giltFuer(null, 'zuhause'), false);
  assert.ok(bericht(daten, 'krippe', ['sitzt-frei'], {}).includes('Krippe'));
});
