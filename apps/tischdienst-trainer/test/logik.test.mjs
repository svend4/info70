import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  GELTUNGEN, SEITEN_ZONEN, MAX_HANDLUNGEN, ANKER, GESPERRTE_RAUMWOERTER,
  varianteVon, schrittVon, unterlageVon, zonenVon, brauchtSeiten,
  darfJetzt, unterlageFehlt, anzahlReihenfolgen, allePermutationen,
  positionenJeSchritt, istAmPlatz, waehleLage, austeilenFertig,
  angeboteneSchritte, seiteOhneAnker, gesperrtesRaumwort, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/tischdienst.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const kita = varianteVon(daten, 'kita');
const zuhause = varianteVon(daten, 'zuhause');

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.varianten.length >= 2);
  for (const v of daten.varianten) assert.ok(v.schritte.length <= MAX_HANDLUNGEN, v.id);
});

test('liegtUnter ist ein ENDZUSTAND – jede Reihenfolge ist erlaubt', () => {
  // Physisch zwingend ist nur, dass die Decke am Ende unten liegt, nicht
  // dass sie zuerst kommt: man hebt den Teller an und schiebt sie
  // darunter. Genau das tun Fünfjährige am echten Tisch. Eine App, die
  // die Decke zuletzt ablehnt, behauptet eine Unwahrheit.
  for (const v of daten.varianten) {
    assert.equal(anzahlReihenfolgen(v), allePermutationen(v.schritte.length), v.id);
  }
  assert.equal(anzahlReihenfolgen(kita), 120);
  assert.equal(anzahlReihenfolgen(zuhause), 720);
  // Auch die Unterlage als Letztes ist erlaubt.
  const ohneSet = kita.schritte.filter((s) => s.geltung !== 'pruefbar').map((s) => s.id);
  assert.equal(darfJetzt(kita, 'set', ohneSet), true);
  assert.equal(darfJetzt(kita, 'brettchen', []), true, 'ohne Set darf trotzdem gelegt werden');
  // Und die App lehnt nichts ab: es gibt keinen Zurückgleit-Pfad.
  assert.doesNotMatch(app, /gelegt\.delete|zurück in die Hand/);
});

test('die Reihenfolgen-Invariante ist eine Strukturgleichheit, keine Schwelle', async () => {
  // Eine Schwelle „mehr als eine Reihenfolge“ wäre wirkungslos: bei 6
  // Schritten gibt es 720 Permutationen, und ein Datenstand, der 718
  // davon ablehnt und zwei zulässt, bestünde sie – wäre aber faktisch
  // die eine richtige Reihenfolge. Geprüft wird daher Gleichheit mit n!.
  for (const v of daten.varianten) {
    assert.equal(anzahlReihenfolgen(v), allePermutationen(v.schritte.length), v.id);
  }

  // Dass diese Gleichheit keine Identität ist, zeigt eine Gegenrechnung
  // mit derselben Zählfunktion über eine künstlich verketteten Variante:
  const kette = {
    schritte: kita.schritte.map((s, i, alle) => ({
      ...s, liegtUnter: alle.slice(i + 1).map((x) => x.id),
    })),
  };
  const mitVorbedingung = (variante, id, gelegt) => {
    const liegen = new Set(gelegt);
    if (liegen.has(id)) return false;
    return !variante.schritte.some((s) => (s.liegtUnter ?? []).includes(id) && !liegen.has(s.id));
  };
  const zaehleMitKette = (variante) => {
    const ids = variante.schritte.map((s) => s.id);
    const gehe = (gelegt) => {
      if (gelegt.length === ids.length) return 1;
      return ids.filter((id) => mitVorbedingung(variante, id, gelegt))
        .reduce((summe, id) => summe + gehe([...gelegt, id]), 0);
    };
    return gehe([]);
  };
  assert.equal(zaehleMitKette(kette), 1, 'eine Kette lässt genau eine Reihenfolge übrig');
  assert.ok(zaehleMitKette(kette) < allePermutationen(kita.schritte.length));

  // Und der Grund, warum die echte Zahl n! ist: darfJetzt fragt
  // `liegtUnter` überhaupt nicht ab. Diese Zusicherung ist das, was die
  // Invariante bewacht – wer eine Vorbedingung einbaut, lässt die
  // Gleichheit platzen.
  const quelle = await readFile(new URL('../logik.mjs', import.meta.url), 'utf8');
  const darf = quelle.slice(quelle.indexOf('export function darfJetzt'));
  assert.doesNotMatch(darf.slice(0, darf.indexOf('\n}')), /liegtUnter/,
    'darfJetzt darf liegtUnter nicht als Vorbedingung lesen');

  // Zweite Strukturprüfung: jeder Schritt kann an mehreren Positionen
  // stehen – ein Schritt mit nur einer Position wäre festgenagelt.
  for (const variante of daten.varianten) {
    for (const [id, stellen] of positionenJeSchritt(variante)) {
      assert.equal(stellen.size, variante.schritte.length, `${variante.id}/${id}`);
    }
  }
});

test('die später gelegte Decke wird untergeschoben, nicht abgelehnt', () => {
  const u = unterlageVon(kita);
  assert.ok(u.spaeterText, 'spaeterText fehlt');
  assert.match(u.spaeterText, /schiebe|drunter/);
  assert.match(u.grund, /geht nicht|Probier/);
  // unterlageFehlt meldet nur, dass sie noch kommen muss – es lehnt nichts ab.
  assert.equal(unterlageFehlt(kita, []), false, 'ohne gelegte Teile fehlt nichts');
  assert.equal(unterlageFehlt(kita, ['brettchen']), true);
  assert.equal(unterlageFehlt(kita, ['set', 'brettchen']), false);
  const ohne = kopie();
  delete varianteVon(ohne, 'kita').schritte.find((s) => s.geltung === 'pruefbar').spaeterText;
  assert.ok(pruefeDaten(ohne).some((f) => /untergeschoben/.test(f)));
  // Die App benutzt den Satz auch.
  assert.match(app, /s\.spaeterText/);
});

test('die Geltungsarten heißen wie in design-entdecker', () => {
  assert.deepEqual(GELTUNGEN, ['pruefbar', 'ausgemacht', 'geschmack']);
  for (const v of daten.varianten) {
    for (const s of v.schritte) assert.ok(GELTUNGEN.includes(s.geltung), `${v.id}/${s.id}`);
  }
  // Nur pruefbar darf eine Relation tragen.
  for (const v of daten.varianten) {
    for (const s of v.schritte) {
      if (s.liegtUnter) assert.equal(s.geltung, 'pruefbar', `${v.id}/${s.id}`);
    }
  }
  const erfunden = kopie();
  varianteVon(erfunden, 'kita').schritte.find((s) => s.id === 'brettchen').liegtUnter = ['becher'];
  assert.ok(pruefeDaten(erfunden).some((f) => /erfundene Zwangsfolge/.test(f)));
});

test('Abmachungen werden gesagt, nicht benotet – und der Rahmensatz steht einmal', () => {
  // Ein Teilstring-Test auf jeden Kindertext wäre eine Scheinprüfung und
  // würde sechs Mal „bei uns ist ausgemacht“ pro Sitzung erzwingen –
  // genau der Etikette-Vortrag, der vermieden werden soll.
  assert.match(daten.rahmenSatz, /bei uns/i);
  assert.match(daten.rahmenSatz, /anders sein/i);
  assert.match(app, /daten\.rahmenSatz/);
  assert.equal((app.match(/daten\.rahmenSatz/g) ?? []).length, 2, 'Rahmensatz einmal anzeigen, einmal vorlesen');
  for (const v of daten.varianten) {
    for (const s of v.schritte.filter((x) => x.geltung === 'ausgemacht')) {
      assert.ok(s.geltungsbereich, `${v.id}/${s.id}: geltungsbereich fehlt`);
      assert.doesNotMatch(s.kindText, /\b(richtig|falsch|schön|schlecht|besser)\b/i, `${v.id}/${s.id}`);
    }
  }
  const bewertend = kopie();
  varianteVon(bewertend, 'kita').schritte.find((s) => s.id === 'becher').kindText = 'So ist es richtig.';
  assert.ok(pruefeDaten(bewertend).some((f) => /gesagt, nicht benotet/.test(f)));
});

test('links und rechts stehen nie ohne den Anker – in KEINEM Text', () => {
  // Die erste Fassung hatte genau diesen Fehler: drei Texte nannten eine
  // Seite, obwohl nur die Zonen-Objekte geprüft wurden.
  assert.equal(seiteOhneAnker('Das Messer liegt rechts.'), true);
  assert.equal(seiteOhneAnker(`Das Messer liegt rechts ${ANKER}.`), false);
  assert.equal(seiteOhneAnker('Der Becher kommt daneben.'), false);
  for (const z of daten.zonen) {
    for (const feld of ['name', 'frage', 'anker']) {
      assert.equal(seiteOhneAnker(z[feld]), false, `Zone ${z.id}.${feld}: ${z[feld]}`);
    }
  }
  for (const v of daten.varianten) {
    for (const s of v.schritte) {
      for (const feld of ['name', 'kindText', 'grund', 'spaeterText', 'geltungsbereich']) {
        if (feld === 'geltungsbereich') continue; // Erwachsenentext, darf erklären
        assert.equal(seiteOhneAnker(s[feld]), false, `${v.id}/${s.id}.${feld}: ${s[feld]}`);
      }
    }
  }
  const ohneAnker = kopie();
  varianteVon(ohneAnker, 'zuhause').schritte.find((s) => s.id === 'messer').kindText = 'Das Messer liegt rechts.';
  assert.ok(pruefeDaten(ohneAnker).some((f) => /ohne den Anker/.test(f)));
  assert.match(daten.blickrichtung, /immer unten am Bildschirm/);
  assert.match(app, /Sitzplatz immer unten|immer unten/);
  assert.doesNotMatch(app, /gegenüber|spiegel/i);
});

test('„oben“ und „über“ sind gesperrt – wie in grammatik-zwerge', () => {
  // In einer flachen Draufsicht gibt es zwei verteidigbare Antworten:
  // aus Sicht der sitzenden Person ist das Glas nicht über dem Teller,
  // sondern weiter weg. Zwei Apps derselben Reihe dürfen sich nicht
  // widersprechen.
  assert.ok(GESPERRTE_RAUMWOERTER.includes('oben'));
  assert.ok(GESPERRTE_RAUMWOERTER.includes('über'));
  assert.equal(gesperrtesRaumwort('Der Becher steht oben rechts.'), 'oben');
  assert.equal(gesperrtesRaumwort('Das Glas steht weiter weg.'), null);
  for (const z of daten.zonen) {
    for (const feld of ['name', 'frage', 'anker']) {
      assert.equal(gesperrtesRaumwort(z[feld]), null, `Zone ${z.id}.${feld}`);
    }
  }
  for (const v of daten.varianten) {
    for (const s of v.schritte) {
      for (const feld of ['name', 'kindText', 'grund', 'spaeterText']) {
        assert.equal(gesperrtesRaumwort(s[feld]), null, `${v.id}/${s.id}.${feld}: ${s[feld]}`);
      }
    }
  }
  const mitOben = kopie();
  varianteVon(mitOben, 'zuhause').schritte.find((s) => s.id === 'glas').kindText = 'Das Glas steht oben.';
  assert.ok(pruefeDaten(mitOben).some((f) => /als Raumwort gesperrt/.test(f)));
  // Und die Zone heißt entsprechend.
  assert.ok(daten.zonen.some((z) => z.id === 'weiterWeg'));
});

test('die 4-5-Schiene braucht kein links/rechts', () => {
  // Links/rechts am eigenen Körper sitzt typischerweise erst mit 5-7.
  // Der Katalogeintrag nennt „Besteck links/rechts“ für 4-5 – das wäre
  // eine Aufgabe, die die Hauptzielgruppe planmäßig nicht lösen kann.
  assert.equal(kita.ab, '4-5');
  assert.equal(brauchtSeiten(kita), false, 'die 4-5-Variante benutzt Seitenzonen');
  assert.equal(zuhause.ab, '5-7');
  assert.equal(brauchtSeiten(zuhause), true);
  const nurSeiten = kopie();
  varianteVon(nurSeiten, 'kita').schritte.find((s) => s.id === 'becher').zone = 'nebenRechts';
  const f = pruefeDaten(nurSeiten);
  assert.ok(f.some((x) => /4-5 darf keine Seitenzone/.test(x)), f.join(' | '));
  // Gezeichnet werden nur die Zonen, die die Variante braucht.
  assert.equal(zonenVon(daten, kita).some((z) => SEITEN_ZONEN.includes(z.id)), false);
});

test('Geschmack hat gar kein Richtig – technisch', () => {
  for (const v of daten.varianten) {
    for (const s of v.schritte.filter((x) => x.geltung === 'geschmack')) {
      assert.equal('zone' in s, false, `${v.id}/${s.id}: Geschmack mit zone`);
      assert.equal('richtig' in s, false, `${v.id}/${s.id}`);
      assert.equal(istAmPlatz(s, 'mitte'), null, `${v.id}/${s.id}`);
      assert.equal(istAmPlatz(s, 'neben'), null, `${v.id}/${s.id}`);
    }
  }
  const mitZone = kopie();
  varianteVon(mitZone, 'kita').schritte.find((s) => s.id === 'serviette-kita').zone = 'neben';
  assert.ok(pruefeDaten(mitZone).some((f) => /Geschmack darf keine zone haben/.test(f)));
  assert.equal(istAmPlatz(schrittVon(zuhause, 'gabel'), 'nebenLinks'), true);
  assert.equal(istAmPlatz(schrittVon(zuhause, 'gabel'), 'nebenRechts'), false);
});

test('die Arten werden über ALLE Varianten geprüft, nicht je Variante', () => {
  // Eine Pflicht je Variante hätte die Redaktion gezwungen, einen
  // Deko-Schritt zu erfinden – obwohl in vielen Kitas gar keine Blumen
  // auf dem Tisch stehen.
  const ohneGeschmack = kopie();
  const v = varianteVon(ohneGeschmack, 'kita');
  v.schritte = v.schritte.filter((s) => s.geltung !== 'geschmack');
  assert.deepEqual(pruefeDaten(ohneGeschmack), [], 'eine Variante ohne Deko muss grün sein dürfen');
  const garKeiner = kopie();
  for (const variante of garKeiner.varianten) {
    variante.schritte = variante.schritte.filter((s) => s.geltung !== 'geschmack');
  }
  assert.ok(pruefeDaten(garKeiner).some((f) => /Geltung geschmack/.test(f)));
});

test('Austeilen ordnet zu und zählt NICHT', () => {
  // „Heute fehlt eines, also brauchst du eins weniger“ ist Subtraktion
  // und mit 4-5 nicht verfügbar. Geprüft wird nur: jede Figur hat eins.
  const a = daten.austeilen;
  assert.doesNotMatch(JSON.stringify(a), /wie viele/i);
  assert.doesNotMatch(JSON.stringify(a), /eins weniger|einer weniger/i);
  for (const l of a.lagen) {
    assert.ok(l.figuren >= 3 && l.figuren <= 5, l.id);
    assert.ok(l.leer >= 1, l.id);
    assert.equal('ablenker' in l, false, `${l.id}: Zahlen-Antwortfeld`);
  }
  assert.ok(new Set(a.lagen.map((l) => l.figuren)).size >= 2, 'immer dieselbe Anzahl');
  assert.equal(austeilenFertig({ figuren: 3 }, [0, 1, 2]), true);
  assert.equal(austeilenFertig({ figuren: 3 }, [0, 1]), false);
  assert.equal(austeilenFertig({ figuren: 3 }, [0, 1, 1, 2]), true, 'doppeltes Tippen zählt einmal');
  assert.equal(austeilenFertig({ figuren: 0 }, []), false);
  for (let i = 0; i < 40; i++) assert.ok(a.lagen.includes(waehleLage(daten)));

  const gerechnet = kopie();
  gerechnet.austeilen.aufgabe = 'Wie viele Brettchen brauchst du?';
  assert.ok(pruefeDaten(gerechnet).some((f) => /nicht gezählt/.test(f)));
  // Die App zeigt keine Zahlenknöpfe.
  assert.doesNotMatch(app, /String\(n\)|antwortZahlen/);
});

test('zwei vollständige Gedecke – das Kita-Frühstück ist kein kleineres', () => {
  assert.match(kita.hinweis, /vollständig und richtig/);
  assert.doesNotMatch(kita.hinweis, /einfacher|weniger|nur /);
  // Kein Messerzwang: die Kita-Variante hat einen Löffel, und der
  // Geltungstext sagt, dass viele Gruppen gar kein Messer austeilen.
  assert.equal(kita.schritte.some((s) => /Messer/.test(s.name)), false);
  assert.match(schrittVon(kita, 'loeffel').geltungsbereich, /kein unvollständiges Gedeck/);
  const eine = kopie();
  eine.varianten = [eine.varianten[0]];
  assert.ok(pruefeDaten(eine).some((f) => /kein kleineres Gedeck/.test(f)));
});

test('nur gemeinsam – und die App sagt, warum', () => {
  // Allein ausgeliefert wird aus „bei uns ausgemacht“ für das Kind doch
  // wieder „so ist es richtig“: es gibt niemanden, der die
  // Einschränkung einlöst.
  assert.match(daten.zielgruppe, /nur gemeinsam/);
  assert.match(daten.nurGemeinsam, /nur zum gemeinsamen/);
  assert.match(app, /daten\.nurGemeinsam/);
  const solo = kopie();
  solo.nurGemeinsam = 'Geht auch allein.';
  assert.ok(pruefeDaten(solo).some((f) => /nicht allein gelassen/.test(f)));
  assert.match(daten.ehrlichkeit, /kann ein Bildschirm nicht üben/);
  assert.match(daten.fuerAndere, /für die anderen/);
});

test('Tippen statt Ziehen, und jede Zone ist ein Knopf', () => {
  // Ziehen ist für Vierjährige unzuverlässig, mit Tastatur nicht
  // bedienbar und bricht bei Bildschirmlupe. Im ganzen Korpus benutzt
  // kein app.mjs draggable.
  assert.doesNotMatch(app, /draggable|dragstart|dragover|pointerdown/);
  assert.match(app, /onclick: \(\) => \(inDerHand \? legeAb\(z\.id\) : vorlesen\(z\.frage\)\)/);
  assert.match(app, /el\('button', \{\n\s+class: 'k-knopf k-knopf--neutral',\n\s+'aria-label': `\$\{z\.frage\}/);
  // Keine Präzision, kein Zeitdruck, kein Zähler.
  assert.doesNotMatch(app, /setTimeout|setInterval/);
  assert.doesNotMatch(app, /\b(versuche|fehlerZahl|punkte|zaehler)\s*(=|\+\+|\+=)/i);
  assert.doesNotMatch(app, /localStorage/);
  assert.match(app, /Es gibt keine Punkte und keine Sterne/);
});

test('das Platzset ist eine Schablone – kein Belohnungsblatt', () => {
  assert.match(app, /window\.print\(\)/);
  assert.match(druck, /@media print/);
  assert.match(druck, /\.tdt-nur-bildschirm \{ display: none/);
  assert.match(druck, /min-height: 3\.2cm/);
  assert.match(app, /class: 'k-karte tdt-platzset'/);
  // Keine Häkchen-, Punkte-, Stern-, Tages- oder Namensfelder: das wäre
  // ein Vergleichssystem auf Papier, mit Kindernamen an der Wand.
  const platzsetTeil = app.slice(app.indexOf('function platzset'));
  for (const verboten of ['Haken', 'Häkchen', 'Stern', 'Punkte', 'Name', 'Woche', 'Urkunde', 'geschafft']) {
    assert.ok(!platzsetTeil.includes(verboten), `Platzset enthält ${verboten}`);
  }
});

test('Wörter dreisprachig, und kein Vorlese-Versprechen', () => {
  const soll = {
    'der Teller': ['тарілка', 'тарелка'],
    'die Gabel': ['виделка', 'вилка'],
    'der Löffel': ['ложка', 'ложка'],
    'das Messer': ['ніж', 'нож'],
    'die Serviette': ['серветка', 'салфетка'],
  };
  for (const w of daten.woerter) {
    assert.ok(soll[w.de], `unerwartetes Wort: ${w.de}`);
    assert.deepEqual([w.uk, w.ru], soll[w.de], w.de);
  }
  // vorlesen() setzt nur utterance.lang. Ohne uk/ru-Stimme auf dem Gerät
  // liest eine deutsche Stimme Kyrillisch – darum werden die Wörter nur
  // angezeigt, nie vorgelesen, und die App sagt das.
  assert.doesNotMatch(app, /vorlesen\([^)]*,\s*'(uk|ru)/);
  assert.match(app, /Gerätestimme kann sie nicht immer/);
});

test('Abschluss am echten Tisch, Sicherheit ohne Rangbehauptung', () => {
  assert.ok(daten.schlussIdeen.length >= 3);
  for (const i of daten.schlussIdeen) assert.ok(i.length >= 40, `zu knapp: ${i}`);
  assert.ok(daten.schlussIdeen.some((i) => /[Aa]bräumen/.test(i)));
  const sicher = daten.sicherheit.join(' ');
  for (const muss of ['Kindermesser', 'zwei Händen', 'Heißes', 'Kerze', 'steigen', 'drei Jahren', 'Hände waschen']) {
    assert.ok(sicher.includes(muss), `Sicherheitshinweis fehlt: ${muss}`);
  }
  // Keine Häufigkeits-Rangbehauptung: Verbrühungen häufen sich unter 3,
  // bei 4-7 dominieren Stürze. Eine falsche Begründung schwächt die
  // richtige Regel.
  assert.doesNotMatch(sicher, /häufigst|meisten Unfälle/i);
  const rang = kopie();
  rang.sicherheit.push('Verbrennungen sind der häufigste Unfall.');
  assert.ok(pruefeDaten(rang).some((f) => /Rangbehauptung/.test(f)));
  assert.match(app, /Bildschirm aus/);
});

test('angeboteneSchritte lässt nichts doppelt anbieten und rotiert', () => {
  assert.equal(angeboteneSchritte(kita, []).length, kita.schritte.length);
  const rest = angeboteneSchritte(kita, ['set', 'becher']);
  assert.equal(rest.length, kita.schritte.length - 2);
  assert.equal(rest.some((s) => s.id === 'set'), false);
  const ersten = new Set();
  for (let i = 0; i < 60; i++) ersten.add(angeboteneSchritte(kita, [])[0].id);
  assert.ok(ersten.size > 1, 'keine Rotation im Angebot');
});
