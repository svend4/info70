import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  PRO_SESSION, KATEGORIEN, TOENE, LIED_TIEFSTER, LIED_HOECHSTER, MAX_LAUTSTAERKE,
  gruppierungVon, stueckVon, schlaegeGesamt, schlagDauer, melodieHertz, zeitplan,
  etikettPasst, istSingbar, unterschiede, eindeutig, ohneHoeren, istNachvollziehbar, pruefeDaten,
} from '../logik.mjs';

const daten = JSON.parse(await readFile(new URL('../daten/musik.json', import.meta.url), 'utf8'));
const kopie = () => JSON.parse(JSON.stringify(daten));
const s = (id) => stueckVon(daten, id);

test('Daten sind gültig', () => {
  assert.deepEqual(pruefeDaten(daten), []);
  assert.ok(daten.stuecke.length >= 6);
  assert.ok(daten.raetsel.length >= 5);
});

test('deutsche Tonnamen: H4 ist h’, B4 ist b’ – die beiden dürfen nie verwechselt werden', () => {
  assert.equal(TOENE.H4, 493.88);
  assert.equal(TOENE.B4, 466.16);
  assert.notEqual(TOENE.H4, TOENE.B4);
  assert.equal(LIED_TIEFSTER, TOENE.C4);
  assert.equal(LIED_HOECHSTER, TOENE.H4);
});

test('der Puls wird gerechnet, nicht behauptet – und das Etikett muss dazu passen', () => {
  assert.equal(gruppierungVon(2), 'zweier');
  assert.equal(gruppierungVon(4), 'zweier');
  assert.equal(gruppierungVon(3), 'dreier');
  assert.equal(gruppierungVon(5), null);
  for (const st of daten.stuecke) {
    assert.ok(etikettPasst(st), `${st.id}: Etikett und Puls passen nicht`);
    assert.equal(schlaegeGesamt(st) % st.schlaegeProTakt, 0, `${st.id}: Takte gehen nicht auf`);
  }
  assert.equal(gruppierungVon(s('marsch').schlaegeProTakt), 'zweier');
  assert.equal(gruppierungVon(s('walzer').schlaegeProTakt), 'dreier');
  const falsch = kopie();
  falsch.stuecke.find((x) => x.id === 'marsch').schlaegeProTakt = 3;
  assert.ok(pruefeDaten(falsch).some((f) => /der Puls passt aber nicht dazu/.test(f)));
});

test('„Lied“ wird gerechnet: singbarer Bereich und Atempausen', () => {
  const lied = s('lied');
  assert.equal(istSingbar(lied), true);
  for (const h of melodieHertz(lied)) {
    assert.ok(h >= LIED_TIEFSTER && h <= LIED_HOECHSTER, `Ton ${h} liegt außerhalb von c’–h’`);
  }
  // Zu hoch: nicht mehr mitsingbar
  const hoch = kopie();
  const l = hoch.stuecke.find((x) => x.id === 'lied');
  l.melodie[0].ton = 'C5';
  assert.ok(pruefeDaten(hoch).some((f) => /heißt Lied, ist aber nicht mitsingbar/.test(f)));
  // Ohne Atempause ebenfalls nicht
  const ohnePause = kopie();
  const l2 = ohnePause.stuecke.find((x) => x.id === 'lied');
  l2.melodie = l2.melodie.map((n) => (n.pause ? { ton: 'G4', schlaege: n.schlaege } : n));
  assert.ok(pruefeDaten(ohnePause).some((f) => /nicht mitsingbar/.test(f)));
  // Der Marsch ist bewusst kein Lied und wird auch nicht so genannt
  assert.equal(s('marsch').kategorien.includes('lied'), false);
});

test('die Mischform ist Pflicht und wird nie abgefragt', () => {
  const misch = daten.stuecke.filter((x) => (x.kategorien?.length ?? 0) >= 2);
  assert.ok(misch.length >= 1, 'kein Stück gehört zu zwei Sorten');
  const marschlied = s('marschlied');
  assert.deepEqual([...marschlied.kategorien].sort(), ['lied', 'marsch']);
  assert.equal(marschlied.zweck, 'zeigen');
  assert.equal(eindeutig(marschlied), false);
  for (const r of daten.raetsel) {
    assert.ok(eindeutig(s(r.stueck)), `${r.id}: fragt ein mehrdeutiges Stück ab`);
  }
  const ohne = kopie();
  ohne.stuecke = ohne.stuecke.filter((x) => (x.kategorien?.length ?? 0) < 2);
  assert.ok(pruefeDaten(ohne).some((f) => /kein Stück gehört zu zwei Sorten/.test(f)));
  const abgefragt = kopie();
  abgefragt.raetsel[0].stueck = 'marschlied';
  assert.ok(pruefeDaten(abgefragt).some((f) => /gehört zu mehreren Sorten/.test(f)));
});

test('Rätsel sind selbstkonsistent: die Lösung folgt aus dem Stück', () => {
  for (const r of daten.raetsel) {
    const st = s(r.stueck);
    const loesung = r.optionen.find((o) => o.richtig).wert;
    if (r.typ === 'muster') assert.equal(loesung, st.kategorien[0], r.id);
    else assert.equal(loesung, gruppierungVon(st.schlaegeProTakt), r.id);
    assert.equal(r.optionen.filter((o) => o.richtig).length, 1, r.id);
    for (const o of r.optionen) assert.ok(KATEGORIEN.includes(o.wert) || ['zweier', 'dreier'].includes(o.wert), `${r.id}: ${o.wert}`);
  }
  const vertauscht = kopie();
  const q = vertauscht.raetsel.find((r) => r.id === 'q1');
  q.optionen.find((o) => o.wert === 'marsch').richtig = false;
  q.optionen.find((o) => o.wert === 'tanz').richtig = true;
  assert.ok(pruefeDaten(vertauscht).some((f) => /Lösung „tanz“, das Stück ist aber marsch/.test(f)));
});

test('am Tempo erkennt man einen Marsch nicht', () => {
  // Zwei Märsche mit sehr verschiedenem Tempo – sonst lernt das Kind
  // „schnell = Marsch“ statt der Gruppierung.
  const maersche = daten.stuecke.filter((x) => x.kategorien?.includes('marsch'));
  const tempi = maersche.map((x) => x.bpm);
  assert.ok(Math.max(...tempi) - Math.min(...tempi) >= 40, `Tempi liegen zu nah beieinander: ${tempi}`);
  assert.equal(s('marsch-langsam').bpm, 60);
  assert.equal(gruppierungVon(s('marsch-langsam').schlaegeProTakt), 'zweier');
  // Und die Regel nennt einen Bereich, keine Schwelle
  const regel = daten.regeln.find((r) => r.id === 'r-marsch');
  assert.ok(regel.bpmVon < regel.bpmBis);
  const schwelle = kopie();
  const r = schwelle.regeln.find((x) => x.id === 'r-marsch');
  r.bpmVon = 112; r.bpmBis = 112;
  assert.ok(pruefeDaten(schwelle).some((f) => /Tempo muss ein Bereich sein/.test(f)));
});

test('die Motive sind Eigenproduktion – kein bekanntes Lied als Tonfolge', () => {
  // Die erste Fassung des Walzers war Ton für Ton der Anfang von
  // „London Bridge Is Falling Down“ (Stufen 5-6-5-4-3-4-5). Solche
  // unbewussten Zitate entstehen genau dort, wo man sie nicht vermutet –
  // deshalb stehen die Tonfolgen hier fest und werden bei jeder Änderung
  // wieder von Hand geprüft.
  const stufen = (id) => melodieHertz(s(id)).map((h) => Object.keys(TOENE).find((n) => Math.abs(TOENE[n] - h) < 0.01));
  assert.deepEqual(stufen('marsch'), ['C4', 'E4', 'G4', 'E4', 'C4', 'E4', 'G4']);
  assert.deepEqual(stufen('walzer'), ['A4', 'G4', 'F4', 'E4', 'D4', 'E4', 'F4']);
  assert.deepEqual(stufen('lied'), ['G4', 'G4', 'A4', 'G4', 'E4', 'F4', 'E4', 'D4', 'E4', 'C4']);
  // Und ausdrücklich nicht mehr die alte Walzer-Folge
  assert.notDeepEqual(stufen('walzer'), ['G4', 'A4', 'G4', 'F4', 'E4', 'F4', 'G4']);
});

test('eine gut gedachte, aber nicht gemeinte Antwort ist kein Fehler', () => {
  // Muster C zählt in Zweiern wie ein Marsch. Wer danach „marschieren“
  // sagt, hat die Regel richtig angewendet.
  const q3 = daten.raetsel.find((r) => r.id === 'q3');
  assert.equal(q3.nachvollziehbar, 'marsch');
  assert.ok(q3.nachvollziehbarText.length > 40);
  assert.equal(gruppierungVon(s(q3.stueck).schlaegeProTakt), 'zweier', 'sonst wäre der Eintrag unbegründet');
  const marschOption = q3.optionen.find((o) => o.wert === 'marsch');
  assert.equal(istNachvollziehbar(q3, marschOption), true);
  assert.equal(istNachvollziehbar(q3, q3.optionen.find((o) => o.richtig)), false);
  assert.equal(istNachvollziehbar(daten.raetsel.find((r) => r.id === 'q1'), marschOption), false);
  const loesung = kopie();
  loesung.raetsel.find((r) => r.id === 'q3').nachvollziehbar = 'lied';
  assert.ok(pruefeDaten(loesung).some((f) => /ist die Lösung selbst/.test(f)));
  const fremd = kopie();
  fremd.raetsel.find((r) => r.id === 'q3').nachvollziehbar = 'quatsch';
  assert.ok(pruefeDaten(fremd).some((f) => /steht gar nicht zur Wahl/.test(f)));
  // Die Marsch-Regel nennt beide Merkmale, nicht nur das Zählen
  assert.match(daten.regeln.find((r) => r.id === 'r-marsch').text, /ohne Pause durch/);
});

test('Stimmungsfragen haben keine Lösung – strukturell, nicht per Absprache', () => {
  assert.ok(daten.stimmung.length >= 3);
  for (const f of daten.stimmung) {
    assert.ok(!('korrekt' in f), `${f.id}: hat eine hinterlegte Lösung`);
    for (const a of f.antworten) assert.ok(!('richtig' in a), `${f.id}: eine Antwort ist als richtig markiert`);
    assert.ok(f.antworten.length >= 2);
  }
  const geschummelt = kopie();
  geschummelt.stimmung[0].antworten[0].richtig = true;
  assert.ok(pruefeDaten(geschummelt).some((f) => /keine Lösung stehen/.test(f)));
  const korrekt = kopie();
  korrekt.stimmung[0].korrekt = 'ruhiger';
  assert.ok(pruefeDaten(korrekt).some((f) => /keine Lösung stehen/.test(f)));
  // Und die Regel dazu ist als Meinung markiert
  assert.equal(daten.regeln.find((r) => r.id === 'r-stimmung').typ, 'meinung');
});

test('Vergleichspaare ändern genau ein Merkmal – sonst wäre die Ursache erfunden', () => {
  assert.ok(daten.paare.length >= 3);
  for (const p of daten.paare) {
    const anders = unterschiede(s(p.a), s(p.b));
    assert.deepEqual(anders, [p.geaendert], `${p.id}: ${anders}`);
    // Nur beim Tongeschlecht darf die Melodie selbst wechseln
    if (p.geaendert !== 'tonart') {
      assert.deepEqual(s(p.a).melodie, s(p.b).melodie, `${p.id}: unterschiedliche Melodie`);
    }
  }
  const zwei = kopie();
  zwei.stuecke.find((x) => x.id === 'lied-langsam').artikulation = 'kurz';
  assert.ok(pruefeDaten(zwei).some((f) => /unterscheidet sich in 2 Merkmalen/.test(f)));
  // Ein heimlich getauschter Ton fällt ebenfalls auf
  const getauscht = kopie();
  getauscht.stuecke.find((x) => x.id === 'lied-kurz').melodie[0].ton = 'A4';
  assert.ok(pruefeDaten(getauscht).some((f) => /die Melodie ist nicht dieselbe/.test(f)));
});

test('der Zeitplan trägt Klang und Puls-Punkte – aus einer Quelle', () => {
  const plan = zeitplan(s('walzer'));
  assert.equal(plan.schlaege.length, schlaegeGesamt(s('walzer')));
  assert.equal(plan.schlaege.filter((x) => x.betont).length, 4, 'vier Takte, vier schwere Schläge');
  assert.equal(plan.schlaege[0].betont, true);
  assert.equal(plan.schlaege[1].betont, false);
  assert.equal(plan.dauer, 60 / 150);
  assert.equal(schlagDauer(s('marsch')), 60 / 112);
  // Pausen erzeugen keinen Ton, verschieben aber die Zeit
  const lied = zeitplan(s('lied'));
  assert.equal(lied.noten.length, melodieHertz(s('lied')).length);
  assert.ok(lied.gesamt > 0);
  // Kurze Töne klingen wirklich kürzer als gebundene
  const kurz = zeitplan(s('lied-kurz')).noten[0].dauer;
  const gebunden = zeitplan(s('lied')).noten[0].dauer;
  assert.ok(kurz < gebunden * 0.6, 'Stupser-Töne sind nicht kürzer');
  // Die tiefere Lage ist genau eine Oktave tiefer
  const tief = melodieHertz(s('lied-tief'));
  const normal = melodieHertz(s('lied'));
  tief.forEach((h, i) => assert.ok(Math.abs(h * 2 - normal[i]) < 0.01, `Ton ${i} ist keine Oktave tiefer`));
});

test('Selbstauskunft zur Zugänglichkeit wird gerechnet', () => {
  const zahl = ohneHoeren(daten.raetsel);
  assert.ok(zahl >= 1, 'kein einziges Rätsel geht ohne Hören');
  assert.ok(zahl < daten.raetsel.length, 'die App darf sich nicht barrierefrei nennen');
  // Genau die Takt-Fragen sind es – dort laufen die Puls-Punkte mit
  for (const r of daten.raetsel) {
    assert.equal(r.ohneHoerenLoesbar, r.typ === 'gruppierung', `${r.id}`);
  }
  assert.match(daten.barrierefreiheit, /kein Hörtest/);
  const ohneFeld = kopie();
  delete ohneFeld.raetsel[0].ohneHoerenLoesbar;
  assert.ok(pruefeDaten(ohneFeld).some((f) => /ohneHoerenLoesbar fehlt/.test(f)));
});

test('Lautstärke und Sitzungsgrenze bleiben klein', () => {
  assert.ok(MAX_LAUTSTAERKE <= 0.25, 'der Deckel muss in der App liegen');
  assert.ok(PRO_SESSION <= 5, 'für 4-6 muss die Sitzung kurz bleiben');
  for (const st of daten.stuecke) {
    const plan = zeitplan(st);
    assert.ok(plan.gesamt <= 20, `${st.id}: ${plan.gesamt}s sind zu lang für ein Muster`);
    assert.ok(plan.gesamt >= 2, `${st.id}: zu kurz zum Wiedererkennen`);
  }
});

test('Ton und Abschluss: kein Tadel, Frage an die Erwachsenen, Schluss offline', () => {
  const roh = JSON.stringify(daten);
  const text = roh.toLowerCase();
  for (const wort of ['dumm', 'blöd', 'leider', 'gewonnen', 'verloren', 'falsch', 'trauermarsch']) {
    assert.ok(!text.includes(wort), `unerwünschtes Wort: ${wort}`);
  }
  // „Punkte“ nur als Puls-Punkte – nie als Zählerei.
  assert.ok(!/(?<!Puls-)Punkte/.test(roh), 'im Datensatz wird gepunktet');
  for (const r of [...daten.raetsel, ...daten.stimmung]) {
    assert.ok(r.gespraech.trim().endsWith('?'), `${r.id}: Impuls ist keine Frage`);
    assert.ok(r.erklaerung.length >= 40, `${r.id}: Erklärung zu knapp`);
  }
  assert.ok(daten.schlussIdeen.length >= 3);
  for (const i of daten.schlussIdeen) assert.ok(i.length >= 40, `Schlussidee zu knapp: ${i}`);
  // Die App nennt sich selbst ein Muster, kein Musikstück
  assert.match(daten.hinweis, /Muster, keine echten Musikstücke/);
});
