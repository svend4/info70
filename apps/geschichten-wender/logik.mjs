// Geschichten-Wender – reine Logik (ohne DOM), testbar mit node --test.
// Ko-Nutzungs-App für 5-7. Praleska docs/10 (Ko-Nutzung Nr. 19).
//
// Wie die anderen Apps dieses Abschnitts bewusst NICHT auf quiz-kern:
// der bringt Punkte, einen Rekord im localStorage, „⭐“ und Ränge mit.
//
// ABGRENZUNG. apps/erzaehl-bruecke würfelt Held, Ort und Problem und gibt
// eine leere Vierstufen-Form – das ist KONSTRUKTION aus nichts. Diese App
// setzt eine fertige kurze Geschichte voraus und lässt daran eine
// Operation ausführen – das ist TRANSFORMATION von etwas Vorhandenem.
// Darum gibt es hier keine Held/Ort/Problem-Würfel, sondern `vorlagen`.
// Und apps/geschichten-werkstatt ist die 8-12-App für Geschichten (mit
// „Anders erzählen“) – deshalb ist diese hier ausdrücklich NUR 5-7 in
// Ko-Nutzung und hat keinen Allein-Modus.
//
// FÜNF TRAGENDE ENTSCHEIDUNGEN
//
// 1. Es gibt keine Musterlösung. „Weiterdenken“ ist divergent: die
//    Vorlage hat nie eine echte Mitte gehabt. Eine einzige
//    Beispielfortsetzung verwandelt die Aufgabe in ein Ratespiel und
//    lehrt das Kind, dass seine Erfindung die falsche war. Darum braucht
//    jede Vorlage MINDESTENS DREI Möglichkeiten mit paarweise
//    VERSCHIEDENER `art` – und `art` kommt aus einer geschlossenen
//    Whitelist, damit „helfer-kommt“ und „helfer-kommt-2“ nicht als
//    verschieden durchgehen.
//
// 2. Die erlaubten Schlüssel sind eine WHITELIST, keine Blacklist. Eine
//    Verbotsliste (`loesung`, `richtig`, …) lässt jedes Synonym passieren:
//    `original`, `vorbild`, `echteMitte`, `zielEnde`, `beispiel`. Hier
//    wird stattdessen jeder unbekannte Schlüssel abgewiesen.
//
// 3. Die Möglichkeiten sind ERWACHSENEN-Material und erscheinen nie beim
//    Aufgabenstart. Steht eine Fortsetzung sichtbar auf dem Bildschirm,
//    bevor das Kind erfunden hat, erfindet es nicht – es wählt, und es
//    behandelt das Angebotene als das vorgesehene Ende. Sie liegen darum
//    hinter einem Knopf des Erwachsenen und werden dann ALLE DREI
//    gleichzeitig und gemischt gezeigt.
//
// 4. Nichts wird vorgelesen, was das Kind erzählt hat. `vorlesen()`
//    benutzt SpeechSynthesis, und Web-Speech-Stimmen sind nicht
//    garantiert geräteintern – auf vielen Geräten sind sie Netzstimmen.
//    `installiereNetzwerkWaechter()` patcht nur fetch, XMLHttpRequest und
//    WebSocket; speechSynthesis liegt außerhalb, und die CSP greift dort
//    auch nicht. Vorgelesen werden ausschließlich die festen Texte der
//    App. Das Zurücklesen des Diktats macht der MENSCH.
//
// 5. Kein Zielzustand. „Mach ein fröhliches Ende“ nennt einen Sollwert,
//    den ein Kind dieses Alters nicht beurteilen kann und an dem es
//    trotzdem gemessen würde. Die Impulse sind Handlungsfragen („Was
//    könnte passieren, damit …“). Bleibt das Ende traurig, folgt ohne
//    Bemerkung der nächste Schritt.
import { mischen } from '../../packages/kinder-ui/js/komponenten.mjs';

/** Diese App ist nur zum gemeinsamen Anschauen gedacht. */
export const ZIELGRUPPE = 'ko-nutzung 5-7';

/** EINE Transformation pro Sitzung – mehrere erzeugen Abbruch. */
export const PRO_SESSION = 1;

/**
 * Höchstens vier Erzählteile. Das Kind hört die Vorlage, es liest sie
 * nicht, und es muss sie behalten UND verändern. Realistisch sind drei
 * bis vier gleichzeitig gehaltene Erzählelemente – 60 bis 90 Wörter
 * Prosa wären sechs bis zehn Aussagen und die Aufgabe damit nur scheinbar
 * gestellt.
 */
export const MAX_TEILE = 4;

/** Die drei Operationen, nach Schwierigkeit geordnet. */
export const ARTEN_DER_AUFGABE = ['umdrehen', 'luecke', 'tausch'];

/**
 * Geschlossene Liste der Wendungen. Siehe Entscheidung 1: ohne sie wäre
 * „verschieden“ nur Zeichenketten-Verschiedenheit.
 */
export const WENDUNGEN = Object.freeze([
  'helfer-kommt',
  'missverstaendnis-klaert-sich',
  'verlorenes-wird-gefunden',
  'jemand-entschuldigt-sich',
  'figur-aendert-sich',
  'etwas-wird-geteilt',
]);

/** Whitelist der Schlüssel – siehe Entscheidung 2. */
export const ERLAUBTE_FELDER_VORLAGE = Object.freeze([
  'id', 'art', 'ausgangsstimmung', 'titel', 'herkunft', 'teile', 'moeglichkeiten',
  // Nur bei art === 'tausch': die vertauschte Fassung AUSGESCHRIEBEN.
  // Siehe getauscht() – ein maschineller Satztausch liefert kein Deutsch.
  'tauschTeile',
]);
export const ERLAUBTE_FELDER_TEIL = Object.freeze(['satz', 'zeichen', 'luecke']);
export const ERLAUBTE_FELDER_MOEGLICHKEIT = Object.freeze(['art', 'impuls']);

/** Ein Impuls ist eine einzige offene Frage. */
const EINE_FRAGE = /^[^?]*\?$/;
/**
 * Fremdperspektive zweiter Ordnung – typisch erst ab 6-7.
 *
 * Die erste Fassung traf nur `denkt|glaubt|meint`, also die Präsensformen.
 * Die Vorlagen erzählen aber durchweg in der Vergangenheit, und die beiden
 * vorhandenen Gedanken-Impulse stehen im Partizip („gedacht haben“) – die
 * Formulierung, die beim Weiterschreiben von selbst entsteht, lag damit
 * genau im blinden Fleck. Darum alle Stämme und die Partizipien.
 */
const FREMDPERSPEKTIVE = /\b(denk\w*|glaub\w*|mein\w*|gedacht|geglaubt|gemeint|dachte\w*)\b[^?]*\bdass\b/i;
/** Gemischte oder gegenläufige Gefühle – erst im Schulalter. */
const GLEICHZEITIG = /\b(zugleich|gleichzeitig|obwohl|einerseits|andererseits|trotzdem)\b/i;
/** Gefühlswörter – höchstens eines pro Impuls. */
const GEFUEHLE = /\b(traurig|fr[oö]hlich|w[uü]tend|[aä]ngstlich|froh|gl[uü]cklich|erleichtert|entt[aä]uscht|stolz)\w*/gi;

/** Eine Vorlage holen. */
export function vorlageVon(daten, id) {
  return (daten?.vorlagen ?? []).find((v) => v.id === id) ?? null;
}

/** Eine Aufgabenart holen. */
export function artVon(daten, id) {
  return (daten?.arten ?? []).find((a) => a.id === id) ?? null;
}

/** Die Vorlagen einer Aufgabenart. */
export function vorlagen(daten, art) {
  return (daten?.vorlagen ?? []).filter((v) => v.art === art);
}

/** Eine Vorlage der gewählten Art, zufällig – ohne Gedächtnis. */
export function waehleVorlage(daten, art) {
  return mischen(vorlagen(daten, art))[0] ?? null;
}

/**
 * Die Möglichkeiten in gemischter Reihenfolge. Gemischt, damit keine
 * Reihenfolge eine erste Wahl suggeriert (Entscheidung 3).
 */
export function gemischteMoeglichkeiten(vorlage) {
  return mischen(vorlage?.moeglichkeiten ?? []);
}

/**
 * Die vertauschte Fassung. Den Tausch führt die APP aus, nicht das Kind:
 * ein Sortier-Widget würde die Umstrukturierung in eine Anordnungsaufgabe
 * mit richtiger Reihenfolge verwandeln, und Ziehen-und-Ablegen ist auf
 * Touch mit 5-6 Jahren unzuverlässig.
 *
 * Aber: ein MASCHINELLER Satztausch liefert kein Deutsch. Die erste Fassung
 * tauschte Satz 1 mit Satz 4 und ließ die Mitte stehen – heraus kam
 * „Am Ende stand vor seiner Tür ein Korb … Ein Kind hatte nur noch ein
 * Stück Brot“: „Am Ende“ als Anfang, „seiner“ ohne Bezug, und „das Kind“
 * bestimmt, bevor „ein Kind“ eingeführt ist, also scheinbar zwei Kinder.
 * Ein Fünfjähriger kann daraus keine Vorstellung bauen, und die App fragt
 * danach „Wie kam es dazu?“. Darum steht die vertauschte Fassung
 * AUSGESCHRIEBEN in den Daten (`tauschTeile`), und `pruefeDaten` prüft
 * beide Reihenfolgen auf Bezüge, die nach vorn zeigen.
 */
export function getauscht(vorlage) {
  return [...(vorlage?.tauschTeile ?? [])];
}

/** Rückverweisende Satzanfänge – als ERSTER Satz einer Fassung unmöglich. */
const RUECKVERWEIS_ANFANG = /^(Am Ende|Zuletzt|Danach|Deshalb|Darum|Trotzdem|Dann|Später)\b/i;
/** Dritte Person – im ersten Satz einer Fassung ohne Bezug. */
const PRONOMEN = /(^|[^a-zäöüß])(er|sie|es|ihn|ihm|ihr|ihnen|seine?[nmrs]?|ihre?[nmrs]?)($|[^a-zäöüß])/i;
// Der Artikel darf gross stehen (Satzanfang), das Nomen MUSS gross stehen –
// im Deutschen ist das die Probe auf ein Nomen. Höchstens zwei Adjektive
// dazwischen, sonst liest der Ausdruck über das Satzende hinweg.
/** „ein/eine/einen/einem/einer [Adjektive] Nomen“ – eine Einführung. */
// KEIN /i: das Flag würde `[A-ZÄÖÜ]` auch auf Kleinbuchstaben passen
// lassen, und dann griffe der Ausdruck das erstbeste Wort statt des Nomens
// („eine ganze Sammlung“ ergab „auf“). Darum steht der Artikel mit beiden
// Schreibungen da und das Nomen bleibt gross.
const EINFUEHRUNG = /\b[Ee]in(?:e|en|em|er)?\s+(?:[a-zäöüß]+\s+){0,2}([A-ZÄÖÜ][a-zäöüß]+)/g;
/** „das/der/die/dem/den [Adjektive] Nomen“ – ein Rückverweis. */
const BESTIMMT = /\b(?:[Dd]as|[Dd]er|[Dd]ie|[Dd]em|[Dd]en)\s+(?:[a-zäöüß]+\s+){0,2}([A-ZÄÖÜ][a-zäöüß]+)/g;

/**
 * Prüft EINE Reihenfolge auf Bezüge, die nach vorn zeigen.
 *
 * Erstens: der erste Satz führt ein. Er beginnt nicht mit „Am Ende“ und
 * enthält kein Pronomen der dritten Person – beides hätte keinen Bezug.
 * Zweitens: wer in dieser Reihenfolge überhaupt unbestimmt eingeführt wird
 * („ein Kind“), muss dort auch ZUERST unbestimmt vorkommen; „das Kind“
 * davor wäre ein zweites Kind. Nomen, die nie eingeführt werden (die Luft,
 * der Boden, die Tür), bleiben unberührt – sie sind situativ eindeutig.
 */
export function pruefeReihenfolge(teile, wo) {
  const fehler = [];
  const saetze = (teile ?? []).map((t) => String(t?.satz ?? ''));
  if (!saetze.length) return [`${wo}: keine Teile`];
  if (RUECKVERWEIS_ANFANG.test(saetze[0].trim())) {
    fehler.push(`${wo}: der erste Satz beginnt rückverweisend („${saetze[0].slice(0, 24)}…“)`);
  }
  // Ein Pronomen im ersten Satz ist erlaubt, SOLANGE sein Bezug vorher im
  // selben Satz eingeführt wird: „Eine alte Frau hatte ihren Schlüssel
  // verloren“ ist einwandfrei. „Am Ende stand vor seiner Tür ein Korb“ ist
  // es nicht – dort steht das Pronomen vor jeder Einführung.
  const ersterSatz = saetze[0];
  const pronomen = ersterSatz.match(PRONOMEN);
  if (pronomen) {
    const bezug = ersterSatz.match(new RegExp(EINFUEHRUNG.source));
    if (bezug === null || bezug.index > pronomen.index) {
      fehler.push(`${wo}: der erste Satz enthält ein Pronomen („${pronomen[2]}“) ohne Bezug`);
    }
  }
  const text = saetze.join(' ');
  const eingefuehrt = new Set([...text.matchAll(EINFUEHRUNG)].map((m) => m[1]));
  for (const nomen of eingefuehrt) {
    const ersteEinfuehrung = [...text.matchAll(EINFUEHRUNG)]
      .filter((m) => m[1] === nomen).map((m) => m.index)[0];
    const ersterRueckverweis = [...text.matchAll(BESTIMMT)]
      .filter((m) => m[1] === nomen).map((m) => m.index)[0];
    if (ersterRueckverweis !== undefined && ersterRueckverweis < ersteEinfuehrung) {
      fehler.push(`${wo}: „${nomen}“ steht bestimmt, bevor es eingeführt ist`);
    }
  }
  return fehler;
}

/** Wie viele Gefühlswörter nennt der Text? */
export function gefuehlsWoerter(text) {
  return [...String(text ?? '').matchAll(GEFUEHLE)].map((m) => m[0].toLowerCase());
}

/** Sollzustand – ein Ziel, das das Kind nicht beurteilen kann. */
const SOLLZUSTAND = /mach (ein|die)|soll .* werden|damit es fr[oö]hlich|muss .* (fr[oö]hlich|gut|sch[oö]n) (aus|)gehen|damit es gut ausgeht/i;

/**
 * Taugt der Text als Impuls für dieses Alter? Liste der Mängel.
 *
 * Der Sollzustands-Check stand ursprünglich nur in der `arten`-Schleife und
 * lief damit allein auf den drei `kindFrage`-Strings. Die achtzehn
 * `moeglichkeiten[].impuls` werden dem Kind aber WÖRTLICH vorgelesen
 * (`ideenBildschirm`), also hätte ein Sollzustand dort das Kind erreicht,
 * ohne dass der Validator etwas meldet. Darum steht er hier, wo beide Wege
 * durchlaufen.
 */
export function pruefeImpuls(text) {
  const maengel = [];
  const satz = String(text ?? '').trim();
  if (!EINE_FRAGE.test(satz)) maengel.push('muss genau eine offene Frage sein');
  if (satz.length > 90) maengel.push('zu lang für eine Frage an ein Kind');
  if (FREMDPERSPEKTIVE.test(satz)) maengel.push('verlangt eine Fremdperspektive zweiter Ordnung');
  if (GLEICHZEITIG.test(satz)) maengel.push('verlangt gegenläufige Gefühle gleichzeitig');
  if (new Set(gefuehlsWoerter(satz)).size > 1) maengel.push('nennt mehr als einen Gefühlszustand');
  if (SOLLZUSTAND.test(satz)) {
    maengel.push('nennt einen Sollzustand – das Kind kann ihn nicht beurteilen und würde daran gemessen');
  }
  return maengel;
}

/**
 * Validiert die Daten. Alle fünf tragenden Regeln stehen hier und nicht
 * in der Redaktion.
 */
export function pruefeDaten(daten) {
  const fehler = [];

  // Entscheidung 4 und die Abgrenzung nach oben: nur Ko-Nutzung 5-7.
  if (daten?.zielgruppe !== ZIELGRUPPE) {
    fehler.push(`zielgruppe muss ${ZIELGRUPPE} sein – für 8-12 gibt es apps/geschichten-werkstatt`);
  }
  for (const [feld, muster, was] of [
    ['keineKi', /keine KI/, 'die App muss sagen, dass sie keine KI benutzt'],
    ['nichtsGespeichert', /kein Mikrofon/, 'es muss dastehen, dass nichts aufgenommen wird'],
    ['wirSchreiben', /du schreibst mit/, 'es muss dastehen, dass der Erwachsene schreibt'],
    ['keinZiel', /kein Ziel/, 'es muss dastehen, dass es kein zu erreichendes Ziel gibt'],
    ['abbruch', /jederzeit aufh/, 'das Aufhören muss ausdrücklich erlaubt sein'],
  ]) {
    if (!muster.test(daten?.[feld] ?? '')) fehler.push(`${feld}: ${was}`);
  }

  const arten = daten?.arten;
  if (!Array.isArray(arten) || arten.length !== ARTEN_DER_AUFGABE.length) {
    fehler.push(`arten: genau ${ARTEN_DER_AUFGABE.length} erwartet`);
  }
  const artIds = new Set();
  for (const a of arten ?? []) {
    const wo = `art ${a.id || '?'}`;
    if (!ARTEN_DER_AUFGABE.includes(a.id)) fehler.push(`${wo}: unbekannte Aufgabenart`);
    artIds.add(a.id);
    if (a.stufe !== ARTEN_DER_AUFGABE.indexOf(a.id) + 1) {
      fehler.push(`${wo}: stufe muss ${ARTEN_DER_AUFGABE.indexOf(a.id) + 1} sein – die Arten sind nicht altersgleich`);
    }
    if (!a.name || !a.fuerErwachsene || !a.kindFrage) fehler.push(`${wo}: name/fuerErwachsene/kindFrage fehlt`);
    // Entscheidung 5: Handlungsfrage, kein Sollzustand.
    for (const m of pruefeImpuls(a.kindFrage)) fehler.push(`${wo}.kindFrage: ${m}`);
  }
  // Die schwerste Art muss sagen, dass eine neu erfundene Geschichte in
  // Ordnung ist – sonst wird der normale Entwicklungsstand zum Fehlversuch.
  const tausch = (arten ?? []).find((a) => a.id === 'tausch');
  if (tausch && !/kein Fehlversuch/.test(tausch.fuerErwachsene ?? '')) {
    fehler.push('art tausch: der Erwachsenentext muss sagen, dass eine neu erfundene Geschichte kein Fehlversuch ist');
  }

  const liste = daten?.vorlagen;
  if (!Array.isArray(liste) || liste.length < 6) fehler.push('vorlagen: mindestens 6 erwartet');
  const ids = new Set();
  for (const v of liste ?? []) {
    const wo = `Vorlage ${v.id || '?'}`;
    // Entscheidung 2: Whitelist.
    for (const schluessel of Object.keys(v)) {
      if (!ERLAUBTE_FELDER_VORLAGE.includes(schluessel)) {
        fehler.push(`${wo}: unbekanntes Feld „${schluessel}“ – erlaubt sind nur ${ERLAUBTE_FELDER_VORLAGE.join(', ')}`);
      }
    }
    if (!v.id || ids.has(v.id)) fehler.push(`${wo}: id fehlt oder doppelt`);
    ids.add(v.id);
    if (!artIds.has(v.art)) fehler.push(`${wo}: art ${v.art} unbekannt`);
    if (!v.titel || !v.ausgangsstimmung) fehler.push(`${wo}: titel/ausgangsstimmung fehlt`);
    // Die Vorlagentexte sind Eigenproduktion; das Muster darf benannt
    // werden, der Wortlaut nicht übernommen.
    if (!/Eigenproduktion/.test(v.herkunft ?? '')) {
      fehler.push(`${wo}: herkunft muss „Eigenproduktion“ aussprechen und das Muster nennen`);
    }

    const teile = v.teile;
    if (!Array.isArray(teile) || teile.length < 3) fehler.push(`${wo}: mindestens 3 Teile erwartet`);
    else if (teile.length > MAX_TEILE) {
      fehler.push(`${wo}: ${teile.length} Teile – mehr als ${MAX_TEILE} kann ein Kind nicht hören UND verändern`);
    }
    for (const [i, t] of (teile ?? []).entries()) {
      for (const schluessel of Object.keys(t)) {
        if (!ERLAUBTE_FELDER_TEIL.includes(schluessel)) fehler.push(`${wo}/Teil ${i}: unbekanntes Feld „${schluessel}“`);
      }
      if (!t.satz) fehler.push(`${wo}/Teil ${i}: satz fehlt`);
      // Jeder Teil ist EIN Satz – er ist der Gedächtnisanker.
      else if ((t.satz.match(/[.!?]/g) ?? []).length !== 1) {
        fehler.push(`${wo}/Teil ${i}: muss genau ein Satz sein`);
      }
    }
    // Beide Reihenfolgen müssen für sich lesbar sein – die Begründung steht
    // bei getauscht(). Die vertauschte Fassung ist ausgeschrieben, weil ein
    // maschineller Satztausch kein Deutsch ergibt.
    for (const m of pruefeReihenfolge(teile, `${wo}/teile`)) fehler.push(m);
    if (v.art === 'tausch') {
      const neu = v.tauschTeile;
      if (!Array.isArray(neu) || neu.length !== (teile ?? []).length) {
        fehler.push(`${wo}: eine Tausch-Vorlage braucht tauschTeile mit genauso vielen Teilen`);
      } else {
        for (const [i, t] of neu.entries()) {
          for (const schluessel of Object.keys(t)) {
            if (!ERLAUBTE_FELDER_TEIL.includes(schluessel)) fehler.push(`${wo}/tauschTeil ${i}: unbekanntes Feld „${schluessel}“`);
          }
          if (!t.satz) fehler.push(`${wo}/tauschTeil ${i}: satz fehlt`);
          else if ((t.satz.match(/[.!?]/g) ?? []).length !== 1) {
            fehler.push(`${wo}/tauschTeil ${i}: muss genau ein Satz sein`);
          }
        }
        for (const m of pruefeReihenfolge(neu, `${wo}/tauschTeile`)) fehler.push(m);
        // Es muss wirklich ein Tausch sein und keine zweite Fassung
        // derselben Reihenfolge: der Ausgang steht jetzt vorn.
        if (neu[0]?.satz === teile[0]?.satz) {
          fehler.push(`${wo}: tauschTeile fängt mit demselben Satz an – dann ist nichts getauscht`);
        }
        // Und jeder Teil braucht vorn einen Gedächtnisanker.
        if (!neu[0]?.zeichen) fehler.push(`${wo}: tauschTeile braucht vorn ein zeichen als Gedächtnisanker`);
      }
    } else if (v.tauschTeile !== undefined) {
      fehler.push(`${wo}: tauschTeile gibt es nur bei art tausch`);
    }
    if (v.art === 'luecke' && !(teile ?? []).some((t) => t.luecke)) {
      fehler.push(`${wo}: eine Lücken-Vorlage braucht einen Teil mit luecke: true`);
    }
    if (v.art !== 'luecke' && (teile ?? []).some((t) => t.luecke)) {
      fehler.push(`${wo}: nur eine Lücken-Vorlage darf eine Lücke haben`);
    }

    // Entscheidung 1.
    const moeglich = v.moeglichkeiten;
    if (!Array.isArray(moeglich) || moeglich.length < 3) {
      fehler.push(`${wo}: mindestens 3 Möglichkeiten erwartet – mit einer wird „weiterdenken“ zum Ratespiel`);
    }
    const gesehen = new Set();
    for (const m of moeglich ?? []) {
      for (const schluessel of Object.keys(m)) {
        if (!ERLAUBTE_FELDER_MOEGLICHKEIT.includes(schluessel)) {
          fehler.push(`${wo}: unbekanntes Feld „${schluessel}“ in einer Möglichkeit`);
        }
      }
      if (!WENDUNGEN.includes(m.art)) {
        fehler.push(`${wo}: Wendung „${m.art}“ steht nicht in der Liste – sonst wäre „verschieden“ nur ein Tippfehler`);
      }
      if (gesehen.has(m.art)) fehler.push(`${wo}: die Wendung „${m.art}“ kommt zweimal – dann sind es nicht drei verschiedene Wege`);
      gesehen.add(m.art);
      // Die Möglichkeiten sind Impulse, keine fertigen Fortsetzungen.
      for (const mangel of pruefeImpuls(m.impuls)) fehler.push(`${wo}/${m.art}: ${mangel}`);
    }
  }
  // Jede Aufgabenart braucht mindestens zwei Vorlagen, sonst kommt bei
  // der zweiten Sitzung dieselbe wieder.
  for (const a of ARTEN_DER_AUFGABE) {
    if (vorlagen(daten, a).length < 2) fehler.push(`art ${a}: mindestens 2 Vorlagen erwartet`);
  }

  const impulse = daten?.erwachseneImpulse;
  if (!Array.isArray(impulse) || impulse.length < 3) fehler.push('erwachseneImpulse: mindestens 3 erwartet');
  if (!Array.isArray(daten?.schlussIdeen) || daten.schlussIdeen.length < 3) {
    fehler.push('schlussIdeen: mindestens 3 erwartet');
  }
  if (!Array.isArray(daten?.sicherheit) || daten.sicherheit.length < 5) {
    fehler.push('sicherheit: mindestens 5 Hinweise erwartet');
  }
  // Das Blatt ist ein Familiendokument, keine Urkunde.
  if (!(daten?.sicherheit ?? []).some((s) => /Familiendokument/.test(s))) {
    fehler.push('sicherheit: der Satz zum Familiendokument fehlt (Kinderrechte, docs/11)');
  }
  return fehler;
}
