import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  ZIELGRUPPE, PRO_SESSION, MAX_TEILE, ARTEN_DER_AUFGABE, WENDUNGEN,
  ERLAUBTE_FELDER_VORLAGE, ERLAUBTE_FELDER_TEIL, ERLAUBTE_FELDER_MOEGLICHKEIT,
  vorlageVon, artVon, vorlagen, waehleVorlage, gemischteMoeglichkeiten,
  getauscht, gefuehlsWoerter, pruefeImpuls, pruefeDaten, pruefeReihenfolge,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/geschichten.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const app = await readFile(new URL('../app.mjs', import.meta.url), 'utf8');
// Ohne Kommentare: die Kopfkommentare NENNEN fetch, XMLHttpRequest und
// WebSocket, um zu erklaeren, was der NetzwerkWaechter patcht – ein Test
// auf den rohen Quelltext wuerde seine eigene Erklaerung melden.
const code = app.replace(/^\s*\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');
const druck = await readFile(new URL('../druck.css', import.meta.url), 'utf8');
const paket = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.vorlagen.length >= 6);
  assert.equal(daten.arten.length, 3);
});

test('keine Musterlösung: drei VERSCHIEDENE Wege je Vorlage', () => {
  // „Weiterdenken“ ist divergent – die Vorlage hat nie eine echte Mitte
  // gehabt. Eine einzige Beispielfortsetzung verwandelt die Aufgabe in
  // ein Ratespiel und lehrt das Kind, dass seine Erfindung die falsche war.
  for (const v of daten.vorlagen) {
    assert.ok(v.moeglichkeiten.length >= 3, `${v.id}: nur ${v.moeglichkeiten.length}`);
    const arten = v.moeglichkeiten.map((m) => m.art);
    assert.equal(new Set(arten).size, arten.length, `${v.id}: doppelte Wendung`);
    for (const a of arten) assert.ok(WENDUNGEN.includes(a), `${v.id}: ${a}`);
  }
  const eine = kopie();
  vorlageVon(eine, 'v-schlitten').moeglichkeiten = [vorlageVon(eine, 'v-schlitten').moeglichkeiten[0]];
  assert.ok(pruefeDaten(eine).some((f) => /zum Ratespiel/.test(f)));

  // Zwei Möglichkeiten mit derselben Wendung sind keine zwei Wege.
  const doppelt = kopie();
  const v = vorlageVon(doppelt, 'v-hund');
  v.moeglichkeiten[1].art = v.moeglichkeiten[0].art;
  assert.ok(pruefeDaten(doppelt).some((f) => /kommt zweimal/.test(f)));
});

test('die Wendungen kommen aus einer geschlossenen Liste', () => {
  // Sonst wäre „verschieden“ nur Zeichenketten-Verschiedenheit:
  // „helfer-kommt“ und „helfer-kommt-2“ bestünden die Prüfung.
  assert.ok(WENDUNGEN.length >= 5);
  assert.equal(Object.isFrozen(WENDUNGEN), true);
  const erfunden = kopie();
  vorlageVon(erfunden, 'v-hund').moeglichkeiten[1].art = 'helfer-kommt-2';
  const f = pruefeDaten(erfunden);
  assert.ok(f.some((x) => /steht nicht in der Liste/.test(x)), f.join(' | '));
  assert.ok(f.some((x) => /nur ein Tippfehler/.test(x)));
});

test('die erlaubten Felder sind eine Whitelist, keine Verbotsliste', () => {
  // Eine Blacklist (`loesung`, `richtig`, …) lässt jedes Synonym
  // passieren: original, vorbild, echteMitte, zielEnde, beispiel.
  for (const liste of [ERLAUBTE_FELDER_VORLAGE, ERLAUBTE_FELDER_TEIL, ERLAUBTE_FELDER_MOEGLICHKEIT]) {
    assert.equal(Object.isFrozen(liste), true);
  }
  for (const feld of ['loesung', 'richtig', 'musterloesung', 'erwartet', 'original', 'vorbild',
    'echteMitte', 'zielEnde', 'zielstimmung', 'sollStimmung', 'beispiel', 'punkte', 'bewertung']) {
    const schmuggel = kopie();
    vorlageVon(schmuggel, 'v-schlitten')[feld] = 'etwas';
    const f = pruefeDaten(schmuggel);
    assert.ok(f.some((x) => new RegExp(`unbekanntes Feld „${feld}“`).test(x)), `${feld} rutscht durch`);
  }
  // Auch in den Teilen und in den Möglichkeiten.
  const teil = kopie();
  vorlageVon(teil, 'v-schlitten').teile[0].loesung = 'x';
  assert.ok(pruefeDaten(teil).some((f) => /Teil 0: unbekanntes Feld/.test(f)));
  const moegl = kopie();
  vorlageVon(moegl, 'v-schlitten').moeglichkeiten[0].fortsetzung = 'x';
  assert.ok(pruefeDaten(moegl).some((f) => /unbekanntes Feld „fortsetzung“/.test(f)));
});

test('die Ideen sind Erwachsenen-Material und erscheinen nie beim Start', () => {
  // Steht eine Fortsetzung sichtbar da, bevor das Kind erfunden hat,
  // erfindet es nicht – es wählt, und es behandelt das Angebotene als
  // das vorgesehene Ende.
  const aufgabe = app.slice(app.indexOf('function aufgabeBildschirm'), app.indexOf('function ideenBildschirm'));
  assert.doesNotMatch(aufgabe, /moeglichkeiten|gemischteMoeglichkeiten/, 'die Ideen stehen schon bei der Aufgabe');
  assert.match(aufgabe, /Wir brauchen zusammen eine Idee/);
  // Und dann alle drei gleichzeitig, gemischt.
  assert.match(app, /Das sind drei von vielen Wegen/);
  assert.match(app, /gemischteMoeglichkeiten\(vorlage\)/);
  assert.match(app, /keine davon die vorgesehene/);
  // Das Mischen ist echt.
  const ersten = new Set();
  for (let i = 0; i < 60; i++) ersten.add(gemischteMoeglichkeiten(vorlageVon(daten, 'v-schlitten'))[0].art);
  assert.ok(ersten.size > 1, 'die Ideen werden nicht gemischt');
});

test('höchstens vier Erzählteile, jeder ein Satz', () => {
  // Das Kind HÖRT die Vorlage und muss sie behalten UND verändern.
  // Realistisch sind drei bis vier gleichzeitig gehaltene Elemente;
  // 60-90 Wörter Prosa wären sechs bis zehn Aussagen und die Aufgabe
  // damit nur scheinbar gestellt.
  assert.equal(MAX_TEILE, 4);
  for (const v of daten.vorlagen) {
    assert.ok(v.teile.length <= MAX_TEILE, `${v.id}: ${v.teile.length} Teile`);
    assert.ok(v.teile.length >= 3, v.id);
    for (const [i, t] of v.teile.entries()) {
      assert.equal((t.satz.match(/[.!?]/g) ?? []).length, 1, `${v.id}/Teil ${i}: ${t.satz}`);
    }
  }
  const lang = kopie();
  const v = vorlageVon(lang, 'v-schlitten');
  v.teile.push({ satz: 'Und noch ein Teil.' }, { satz: 'Und noch einer.' });
  assert.ok(pruefeDaten(lang).some((f) => /kann ein Kind nicht hören UND verändern/.test(f)));
  // Jeder Teil ist einzeln wieder hörbar – sonst ist die Aufgabe nur
  // scheinbar gestellt.
  assert.match(app, /Teil \$\{i \+ 1\} noch einmal hören/);
});

test('die drei Operationen sind nicht altersgleich und stehen in Stufen', () => {
  assert.deepEqual(ARTEN_DER_AUFGABE, ['umdrehen', 'luecke', 'tausch']);
  for (const [i, id] of ARTEN_DER_AUFGABE.entries()) {
    assert.equal(artVon(daten, id).stufe, i + 1, id);
    assert.ok(vorlagen(daten, id).length >= 2, `${id}: zu wenige Vorlagen`);
  }
  assert.match(artVon(daten, 'umdrehen').fuerErwachsene, /Fangt hiermit an/);
  assert.match(artVon(daten, 'luecke').fuerErwachsene, /schwerer/);
  // „Neu erfunden statt umgebaut“ ist der normale Entwicklungsstand und
  // kein Fehlversuch – das muss dastehen.
  assert.match(artVon(daten, 'tausch').fuerErwachsene, /kein Fehlversuch/);
  const ohne = kopie();
  artVon(ohne, 'tausch').fuerErwachsene = 'Das ist die schwerste Art.';
  assert.ok(pruefeDaten(ohne).some((f) => /kein Fehlversuch/.test(f)));
  const verdreht = kopie();
  artVon(verdreht, 'tausch').stufe = 1;
  assert.ok(pruefeDaten(verdreht).some((f) => /nicht altersgleich/.test(f)));
});

test('den Tausch führt die APP aus, nicht das Kind', () => {
  // Ein Sortier-Widget würde die Umstrukturierung in eine
  // Anordnungsaufgabe mit richtiger Reihenfolge verwandeln – verdeckte
  // Bewertung. Und Ziehen-und-Ablegen ist auf Touch mit 5-6 unzuverlässig.
  const v = vorlageVon(daten, 'v-vogel');
  const neu = getauscht(v);
  assert.equal(neu.length, v.teile.length);
  assert.notEqual(neu[0].satz, v.teile[0].satz, 'vorn muss etwas anderes stehen');
  assert.ok(neu[0].zeichen, 'auch die getauschte Fassung braucht vorn einen Anker');
  assert.deepEqual(getauscht(null), []);
  assert.deepEqual(getauscht({ teile: [{ satz: 'Nur einer.' }] }), [],
    'ohne tauschTeile gibt es keine getauschte Fassung – kein stiller Rückfall');
  // Keine verschiebbaren Karten.
  assert.doesNotMatch(code, /draggable|dragstart|dragover|pointerdown|sortable/i);
  assert.match(app, /die APP führt ihn aus/);
  // Beide Fassungen bleiben erreichbar – sonst ist der Vergleich zweier
  // Zustände nicht möglich.
  assert.match(app, /Zurück zur ersten/);
  assert.match(app, /Die neue Fassung noch einmal/);
});

test('kein Zielzustand – die Impulse sind Handlungsfragen', () => {
  // „Mach ein fröhliches Ende“ nennt einen Sollwert, den ein Kind dieses
  // Alters nicht beurteilen kann und an dem es trotzdem gemessen würde.
  for (const a of daten.arten) {
    assert.deepEqual(pruefeImpuls(a.kindFrage), [], `${a.id}: ${a.kindFrage}`);
    assert.doesNotMatch(a.kindFrage, /fr[oö]hlich|gl[uü]cklich|besser machen/i, a.id);
  }
  assert.match(artVon(daten, 'umdrehen').kindFrage, /^Was könnte passieren/);
  const soll = kopie();
  artVon(soll, 'umdrehen').kindFrage = 'Mach ein fröhliches Ende?';
  assert.ok(pruefeDaten(soll).some((f) => /nennt einen Sollzustand/.test(f)));
  // Und derselbe Satz als MÖGLICHKEIT: die werden dem Kind wörtlich
  // vorgelesen, der Check lief aber zuerst nur auf kindFrage.
  const sollIdee = kopie();
  sollIdee.vorlagen[0].moeglichkeiten[0].impuls = 'Was muss passieren, damit es fröhlich ausgeht?';
  assert.ok(pruefeDaten(sollIdee).some((f) => /nennt einen Sollzustand/.test(f)),
    'ein Sollzustand in einer Möglichkeit erreicht das Kind genauso');
  assert.deepEqual(pruefeImpuls('Mach ein fröhliches Ende?').filter((m) => /Sollzustand/.test(m)).length, 1);
  assert.match(daten.keinZiel, /kein Ziel/);
  // Keine Selbsteinschätzung, kein Smiley-Abschluss.
  assert.doesNotMatch(app, /Wie gut war|Hat es dir gefallen|Ist dein Ende/);
  assert.match(app, /Es gibt nichts zu treffen/);
});

test('jeder Impuls ist EINE offene Frage ohne Gefühls-Akrobatik', () => {
  for (const v of daten.vorlagen) {
    for (const m of v.moeglichkeiten) {
      assert.deepEqual(pruefeImpuls(m.impuls), [], `${v.id}/${m.art}: ${m.impuls}`);
    }
  }
  // Theory of Mind zweiter Ordnung: typisch erst ab 6-7.
  assert.ok(pruefeImpuls('Was denkt der Wolf, dass das Kind von ihm denkt?')
    .some((m) => /Fremdperspektive/.test(m)));
  // Gemischte Gefühle: erst im Schulalter.
  assert.ok(pruefeImpuls('Ist der Igel traurig und erleichtert zugleich?')
    .some((m) => /gegenläufige Gefühle/.test(m)));
  assert.ok(pruefeImpuls('Warum ist er traurig, obwohl es gut ausging?')
    .some((m) => /gegenläufige/.test(m)));
  // Höchstens ein Gefühlszustand.
  assert.ok(pruefeImpuls('Ist er froh oder wütend?').some((m) => /mehr als einen Gefühlszustand/.test(m)));
  assert.deepEqual(gefuehlsWoerter('Ist er traurig?'), ['traurig']);
  // Zwei Fragen in einem Impuls sind zwei Aufgaben.
  assert.ok(pruefeImpuls('Wer kommt? Und was macht er?').some((m) => /genau eine offene Frage/.test(m)));
  assert.ok(pruefeImpuls('Das ist schön.').some((m) => /genau eine offene Frage/.test(m)));

  const kaputt = kopie();
  vorlageVon(kaputt, 'v-hund').moeglichkeiten[0].impuls = 'Wer kommt? Und was macht er dann?';
  assert.ok(pruefeDaten(kaputt).some((f) => /genau eine offene Frage/.test(f)));
});

test('die Ausgangsstimmung wird NICHT als Etikett am Bildschirm gezeigt', () => {
  // Ein Stimmungs-Etikett neben der Geschichte wäre für das Kind die
  // Setzung einer Autorität: „die App sagt traurig, ich finde es lustig“
  // ist ein Konflikt, den Fünfjährige nicht pluralistisch lösen – sie
  // übernehmen. Stimmung ist ohnehin ein Rezipienten-Konstrukt.
  for (const v of daten.vorlagen) assert.ok(v.ausgangsstimmung, v.id);
  // Im Kind-Teil steht sie nicht; sie steht in der Erwachsenen-Karte.
  const kindTeil = app.slice(app.indexOf('function teileListe'), app.indexOf('erwachsenenKarte(\n        el(\'p\''));
  assert.doesNotMatch(kindTeil, /ausgangsstimmung/);
  assert.match(app, /Das steht nicht als Etikett am Bildschirm/);
  // Und das Gefühl steht als Zustand der FIGUR in der Erzählung.
  assert.match(vorlageVon(daten, 'v-schlitten').teile[3].satz, /Das Kind war traurig/);
});

test('nur Ko-Nutzung 5-7 – kein Allein-Modus, keine 8-12-Dublette', () => {
  // apps/geschichten-werkstatt ist die 8-12-App für Geschichten und hat
  // „Anders erzählen“ schon. Und die ganze Didaktik hier setzt einen
  // Erwachsenen voraus: er liest vor und schreibt mit.
  assert.equal(daten.zielgruppe, ZIELGRUPPE);
  assert.equal(ZIELGRUPPE, 'ko-nutzung 5-7');
  const falsch = kopie();
  falsch.zielgruppe = '5-7 und 8-12';
  assert.ok(pruefeDaten(falsch).some((f) => /apps\/geschichten-werkstatt/.test(f)));
  assert.doesNotMatch(code, /allein|eigenst[aä]ndig/i);
  assert.match(app, /Nur zusammen/);
  assert.match(daten.wirSchreiben, /du schreibst mit/);
  // Und EINE Transformation pro Sitzung.
  assert.equal(PRO_SESSION, 1);
  assert.match(app, /PRO_SESSION !== 1/);
});

test('nichts Erzähltes wird vorgelesen, und es gibt kein Textfeld', () => {
  // vorlesen() benutzt SpeechSynthesis; Web-Speech-Stimmen sind nicht
  // garantiert geräteintern, und der NetzwerkWaechter patcht nur fetch,
  // XMLHttpRequest und WebSocket – speechSynthesis liegt außerhalb.
  // Vorgelesen werden ausschließlich die festen Texte der App.
  const vorleseAufrufe = [...app.matchAll(/vorlesen\(([^)]*)\)/g)].map((m) => m[1]);
  for (const arg of vorleseAufrufe) {
    assert.doesNotMatch(arg, /eingabe|wert|value|diktat|erzaehlt/i, `vorlesen(${arg})`);
  }
  // Kein Eingabefeld: ein Textfeld stellt der Browser selbst wieder her
  // (Session-Restore, Back-Forward-Cache), Autofill merkt sich Eingaben,
  // und mobile Tastaturen lernen getippte Wörter.
  assert.doesNotMatch(code, /<input|'input'|"input"|textarea|contenteditable/i);
  assert.doesNotMatch(code, /localStorage|sessionStorage|indexedDB/);
  assert.doesNotMatch(code, /getUserMedia|MediaRecorder|mikrofon/i);
  assert.match(daten.nichtsGespeichert, /kein Mikrofon/);
  assert.match(daten.nichtsGespeichert, /kein Textfeld/);
  // Und die App sagt, dass sie das Aufgeschriebene nicht vorliest.
  assert.match(app, /Das Vorlesen des Aufgeschriebenen macht die App nicht/);
  // Ohne deutsche Stimme steht „bitte lies du vor“ statt eines toten Knopfs.
  assert.match(app, /keine deutsche Stimme da/);
  assert.match(app, /function stimmeDa/);
});

test('keine KI, keine Netz-API, kein quiz-kern', () => {
  assert.match(daten.keineKi, /keine KI/);
  assert.doesNotMatch(code, /fetch\((?!'daten\/)/, 'fetch nur für die eigene Datendatei');
  assert.doesNotMatch(code, /XMLHttpRequest|WebSocket|EventSource/);
  assert.doesNotMatch(code, /quiz-kern/);
  // Geprueft wird die ABHAENGIGKEIT, nicht das Wort: die Beschreibung
  // sagt ausdruecklich „kein quiz-kern“, und ein stumpfes includes()
  // wuerde genau diesen Satz melden.
  for (const feld of ['dependencies', 'devDependencies', 'peerDependencies']) {
    assert.equal(Object.keys(paket[feld] ?? {}).some((k) => k.includes('quiz-kern')), false, feld);
  }
  const ohne = kopie();
  ohne.keineKi = 'Die App setzt Geschichten zusammen.';
  assert.ok(pruefeDaten(ohne).some((f) => /keine KI benutzt/.test(f)));
});

test('die Vorlagentexte sind Eigenproduktion, das Muster wird benannt', () => {
  // Muster waren nie urheberrechtlich geschützt; der Wortlaut der
  // Grimm-Fassungen ist gemeinfrei, moderne Nacherzählungen sind es
  // nicht. Übernommen wird die Struktur, nie ein Text.
  for (const v of daten.vorlagen) {
    assert.match(v.herkunft, /Eigenproduktion/, v.id);
    assert.ok(v.herkunft.length >= 60, `${v.id}: Herkunft zu knapp`);
  }
  const ohne = kopie();
  vorlageVon(ohne, 'v-turm').herkunft = 'Nach Grimm.';
  assert.ok(pruefeDaten(ohne).some((f) => /Eigenproduktion/.test(f)));
  // Keine Verse, Reime oder Refrains – das ist die Stelle, an der man
  // unbewusst reproduziert. Und keine Eigennamen: eine benannte Figur
  // kann eigenständig geschützt sein.
  const alles = JSON.stringify(daten);
  assert.doesNotMatch(alles, /"vers"|"reim"|"refrain"|"lied"|"melodie"|"audio"/);
  for (const name of ['Rotkäppchen', 'Hänsel', 'Gretel', 'Aschenputtel', 'Dornröschen', 'Schneewittchen']) {
    assert.ok(!alles.includes(name), `Eigenname: ${name}`);
  }
  // ATU-Nummern dürfen als Herkunftsnachweis dastehen – mit Quelle.
  assert.match(alles, /Uther 2004/);
});

test('die Lücke sitzt nur bei Lücken-Vorlagen', () => {
  for (const v of daten.vorlagen) {
    const luecken = v.teile.filter((t) => t.luecke);
    if (v.art === 'luecke') assert.equal(luecken.length, 1, v.id);
    else assert.equal(luecken.length, 0, v.id);
  }
  const ohne = kopie();
  for (const t of vorlageVon(ohne, 'v-turm').teile) delete t.luecke;
  assert.ok(pruefeDaten(ohne).some((f) => /braucht einen Teil mit luecke/.test(f)));
  const falsch = kopie();
  vorlageVon(falsch, 'v-hund').teile[1].luecke = true;
  assert.ok(pruefeDaten(falsch).some((f) => /nur eine Lücken-Vorlage darf eine Lücke haben/.test(f)));
});

test('das Blatt ist ein Familiendokument, keine Urkunde', () => {
  assert.match(app, /window\.print\(\)/);
  assert.match(druck, /@media print/);
  assert.match(druck, /\.gw-nur-bildschirm \{ display: none/);
  assert.match(druck, /height: 1\.1cm/);
  assert.match(app, /class: 'k-karte gw-blatt'/);
  const blattTeil = app.slice(app.indexOf('function blatt()'));
  // „Name“ steht mit in der Liste: die Freigabe-Checkliste in docs/02
  // verbietet eine Namenszeile auf einem Druckblatt ausdrücklich, und das
  // gilt auch für eine freiwillig gemeinte Autorenzeile – vorgedruckt macht
  // sie aus dem Blatt ein vergleichbares. Hier stand „Erzählt von:“ mit
  // Schreiblinie, und ein Test hielt sie sogar fest.
  for (const verboten of ['Urkunde', 'Stern', 'Sticker', 'Medaille', 'geschafft', 'Woche',
    'erledigt', 'Punkte', 'Name', 'Erzählt von']) {
    assert.ok(!blattTeil.includes(verboten), `Blatt enthält ${verboten}`);
  }
  assert.match(blattTeil, /Familiendokument/);
  assert.match(blattTeil, /nicht ins Netz stellen/);
  assert.match(blattTeil, /gw-linie/);
  assert.ok(daten.sicherheit.some((s) => /Familiendokument/.test(s)));
});

test('aufhören ist aus jedem Zustand erreichbar', () => {
  assert.match(daten.abbruch, /jederzeit aufhören/);
  assert.ok((app.match(/aufhoerKnopf\(\)/g) ?? []).length >= 5, 'nicht überall erreichbar');
  assert.match(app, /Für heute reicht es/);
  // Und ein Abbruch sieht nicht wie eine unerledigte Aufgabe aus – der
  // Satz steht in den Daten und wird im Gate und im Schluss gezeigt.
  assert.match(daten.abbruch, /kein Abbruch/);
  assert.ok((app.match(/daten\.abbruch/g) ?? []).length >= 2, 'der Satz wird nicht gezeigt');
});

test('Abschluss und Sicherheit', () => {
  assert.ok(daten.schlussIdeen.length >= 3);
  for (const i of daten.schlussIdeen) assert.ok(i.length >= 40, `zu knapp: ${i}`);
  const sicher = daten.sicherheit.join(' ');
  for (const muss of ['Keine Kerze', 'um den Hals', 'Kinderschere', 'vor dem Schlafen', 'keine Aussagen über Erlebtes', 'Familiendokument']) {
    assert.ok(sicher.includes(muss), `Sicherheitshinweis fehlt: ${muss}`);
  }
  assert.match(app, /Bildschirm aus/);
  const wenig = kopie();
  wenig.sicherheit = ['nur einer'];
  assert.ok(pruefeDaten(wenig).some((f) => /sicherheit/.test(f)));
});

test('waehleVorlage liefert nur Vorlagen der gewählten Art und rotiert', () => {
  for (const a of ARTEN_DER_AUFGABE) {
    const gesehen = new Set();
    for (let i = 0; i < 60; i++) {
      const v = waehleVorlage(daten, a);
      assert.equal(v.art, a, `${a}: falsche Art`);
      gesehen.add(v.id);
    }
    assert.ok(gesehen.size >= 2, `${a}: keine Rotation`);
  }
  assert.equal(waehleVorlage(daten, 'gibtsnicht'), null);
  assert.equal(vorlageVon(daten, 'gibtsnicht'), null);
  assert.equal(artVon(daten, 'gibtsnicht'), null);
});

test('beide Reihenfolgen sind für sich lesbar – kein Bezug zeigt nach vorn', () => {
  // Die erste Fassung tauschte Satz 1 mit Satz 4 maschinell und ließ die
  // Mitte stehen. Heraus kam: „Am Ende stand vor seiner Tür ein Korb … Das
  // Kind gab die Hälfte ab … Ein Kind hatte nur noch ein Stück Brot.“
  // „Am Ende“ als Anfang, „seiner“ ohne Bezug, und „das Kind“ bestimmt,
  // bevor „ein Kind“ eingeführt ist – also scheinbar zwei Kinder. Ein
  // Fünfjähriger kann daraus keine Vorstellung bauen, und die App fragt
  // danach „Wie kam es dazu?“. Darum steht die getauschte Fassung
  // ausgeschrieben in den Daten, und BEIDE Reihenfolgen werden geprüft.
  for (const v of daten.vorlagen) {
    assert.deepEqual(pruefeReihenfolge(v.teile, v.id), [], v.id);
    if (v.art === 'tausch') assert.deepEqual(pruefeReihenfolge(v.tauschTeile, v.id), [], `${v.id}/getauscht`);
  }
  // Gegenprobe: genau die drei Mängel, die der maschinelle Tausch erzeugte.
  const maschinell = [
    { satz: 'Am Ende stand vor seiner Tür ein Korb, und niemand wusste, von wem.' },
    { satz: 'Am Weg saß jemand, der noch gar nichts gegessen hatte.' },
    { satz: 'Das Kind gab die Hälfte ab und ging weiter.' },
    { satz: 'Ein Kind hatte nur noch ein Stück Brot in der Tasche.' },
  ];
  const maengel = pruefeReihenfolge(maschinell, 'x');
  assert.ok(maengel.some((m) => /beginnt rückverweisend/.test(m)), JSON.stringify(maengel));
  assert.ok(maengel.some((m) => /Pronomen/.test(m)), JSON.stringify(maengel));
  assert.ok(maengel.some((m) => /„Kind“ steht bestimmt/.test(m)), JSON.stringify(maengel));
  // Ein Pronomen mit Bezug im SELBEN Satz ist einwandfrei – sonst wäre die
  // Regel so streng, dass sie gutes Deutsch verbietet.
  assert.deepEqual(pruefeReihenfolge([
    { satz: 'Eine alte Frau hatte ihren Schlüssel verloren und suchte überall.' },
    { satz: 'Ein Kind sah etwas in einer Pfütze blinken.' },
  ], 'y'), []);
  // Und die Daten müssen den Tausch wirklich tauschen.
  const gleich = kopie();
  const vb = vorlageVon(gleich, 'v-brot');
  vb.tauschTeile = vb.teile.map((t) => ({ ...t }));
  assert.ok(pruefeDaten(gleich).some((f) => /dann ist nichts getauscht/.test(f)));
  const ohne = kopie();
  delete vorlageVon(ohne, 'v-vogel').tauschTeile;
  assert.ok(pruefeDaten(ohne).some((f) => /braucht tauschTeile/.test(f)));
  const falsch = kopie();
  vorlageVon(falsch, 'v-schlitten').tauschTeile = [{ satz: 'Egal.' }];
  assert.ok(pruefeDaten(falsch).some((f) => /nur bei art tausch/.test(f)));
});

test('Fremdperspektive zweiter Ordnung – auch in der Vergangenheit', () => {
  // Die erste Fassung traf nur `denkt|glaubt|meint`, also das Präsens. Die
  // Vorlagen erzählen aber durchweg in der Vergangenheit, und die beiden
  // vorhandenen Gedanken-Impulse stehen im Partizip („gedacht haben“) –
  // die Formulierung, die beim Weiterschreiben von selbst entsteht, lag
  // damit genau im blinden Fleck.
  for (const satz of [
    'Was denkt der Vogel, dass das Kind will?',
    'Was könnte die Frau gedacht haben, dass das Kind vorhat?',
    'Was glaubte der Nachbar, dass die Kinder gebaut hatten?',
    'Was meinte der Hund, dass die Leute vorhaben?',
  ]) {
    assert.ok(pruefeImpuls(satz).some((m) => /Fremdperspektive/.test(m)), satz);
  }
  // Erster Ordnung bleibt erlaubt – das können Fünfjährige.
  for (const satz of daten.vorlagen.flatMap((v) => v.moeglichkeiten.map((m) => m.impuls))) {
    assert.deepEqual(pruefeImpuls(satz), [], satz);
  }
  assert.ok(daten.vorlagen.some((v) => v.moeglichkeiten.some((m) => /gedacht haben/.test(m.impuls))),
    'das Partizip ist der Hausstil – die Regel muss ihn aushalten');
});
