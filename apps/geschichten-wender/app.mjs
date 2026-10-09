// Geschichten-Wender (5-7, nur gemeinsam mit einem Erwachsenen).
// Praleska docs/10 (Ko-Nutzung Nr. 19).
//
// Der Erwachsene liest vor und schreibt mit. Die Möglichkeiten sind
// Erwachsenen-Material und erscheinen nie beim Aufgabenstart. Es gibt
// kein Textfeld: das Diktat lebt auf dem ausgedruckten Blatt, mit dem
// Stift geschrieben (siehe logik.mjs).
//
// WICHTIG: Es wird NICHTS vorgelesen, was das Kind erzählt hat.
// vorlesen() benutzt SpeechSynthesis, und Web-Speech-Stimmen sind nicht
// garantiert geräteintern – der NetzwerkWaechter patcht nur fetch,
// XMLHttpRequest und WebSocket, speechSynthesis liegt außerhalb.
// Politik docs/02: keine externen Anfragen.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  PRO_SESSION, ARTEN_DER_AUFGABE, artVon, waehleVorlage, getauscht,
  gemischteMoeglichkeiten, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/geschichten.json').then((r) => r.json());

let art = null;
let vorlage = null;
let getauschtGezeigt = false;

/**
 * Gibt es überhaupt eine deutsche Stimme auf diesem Gerät? Ohne sie
 * bleibt der Vorlese-Knopf stumm, und in dieser App IST die Vorlage die
 * Aufgabe – ein toter Knopf wäre hier schlimmer als keiner. Dann sagt
 * die App „bitte vorlesen“ an den Erwachsenen.
 */
function stimmeDa() {
  if (!('speechSynthesis' in globalThis)) return false;
  const stimmen = speechSynthesis.getVoices?.() ?? [];
  // Vor dem ersten Laden ist die Liste leer – dann nicht vorschnell
  // verneinen, der Knopf darf es versuchen.
  if (!stimmen.length) return true;
  return stimmen.some((s) => String(s.lang ?? '').toLowerCase().startsWith('de'));
}

function zeige(...knoten) {
  app.replaceChildren(...[
    el('div', { class: 'gw-nur-bildschirm' },
      el('h1', { class: 'k-titel' }, '🔄 Geschichten-Wender'),
      el('p', { class: 'k-untertitel' }, 'Eine Geschichte ist schon da – ihr baut sie um.')),
    ...knoten,
    el('footer', { class: 'k-fuss gw-nur-bildschirm' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button:not([disabled])')?.focus();
}

/** Vorlesen – nur für feste Texte der App, nie für Erzähltes. */
function vorleseKnopf(text, beschriftung = '🔊 Vorlesen') {
  if (!stimmeDa()) {
    return el('p', { class: 'k-hinweis', style: 'margin:0.6rem 0' },
      '🗣️ Auf diesem Gerät ist keine deutsche Stimme da. Bitte lies du vor.');
  }
  return el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text) }, beschriftung);
}

const erwachsenenKarte = (...inhalt) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene:'),
  ...inhalt);

/** „Für heute reicht es“ ist aus jedem Zustand erreichbar. */
const aufhoerKnopf = () =>
  el('button', { class: 'k-knopf k-knopf--neutral', onclick: schluss }, '🏁 Für heute reicht es');

// ---------------------------------------------------------------- Gate
function gate() {
  const intro = `${daten.wirSchreiben} ${daten.keinZiel} ${daten.abbruch}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Nur zusammen – und du liest vor.'),
      el('p', {}, 'Die App zeigt eine kurze Geschichte. Du liest sie vor, dein Kind baut sie um und erzählt – und du schreibst mit.'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '✍️ Warum du schreibst:'),
        el('p', { style: 'margin:0' }, daten.wirSchreiben)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '🎯 Es gibt kein Ziel:'),
        el('p', { style: 'margin:0' }, daten.keinZiel),
        el('p', { style: 'margin:0.4rem 0 0' }, daten.abbruch)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'margin:0' }, `🤖 ${daten.keineKi}`),
        el('p', { style: 'margin:0.4rem 0 0' }, `🔒 ${daten.nichtsGespeichert}`)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'margin:0' }, '📝 Legt am besten Papier und Stift bereit – oder druckt am Ende das Blatt aus.')),
      vorleseKnopf(intro),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: artBildschirm }, '👪 Wir sind zusammen – los!'))));
}

// --------------------------------------------- Aufgabenart (Erwachsene)
// Das Kind wählt die Art NICHT: „Umdrehen“, „Lücke“, „Tauschen“ sind
// Bezeichnungen von Operationen auf einer Geschichte, also
// metasprachliche Begriffe – die haben vor der Schule keinen Haftpunkt.
// Hier darf Text stehen, weil hier der Erwachsene liest.
function artBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔄'),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, 'Was macht ihr heute?'),
      el('p', { style: 'text-align:center;margin-top:0' }, 'Du wählst – dein Kind sieht danach nur eine Aufgabe.'),
      ...ARTEN_DER_AUFGABE.map((id) => {
        const a = artVon(daten, id);
        return el('div', { style: 'margin:0.8rem 0;padding-top:0.6rem;border-top:1px solid var(--k-rand)' },
          el('button', {
            class: 'k-knopf', style: 'min-height:3.6rem;width:100%',
            onclick: () => starte(id),
          }, `${a.stufe}. ${a.name}`),
          el('p', { style: 'margin:0.4rem 0 0;font-size:0.95em' }, a.fuerErwachsene));
      }),
      el('div', { class: 'k-antworten' }, aufhoerKnopf())));
}

function starte(id) {
  art = artVon(daten, id);
  vorlage = waehleVorlage(daten, id);
  getauschtGezeigt = false;
  vorlageBildschirm();
}

// ------------------------------------------------------------- Vorlage
/** Die Teile einzeln – jeder mit einem Antippen wieder hörbar. */
function teileListe(teile) {
  return el('div', {},
    ...teile.map((t, i) => el('div', {
      style: 'display:flex;gap:0.6rem;align-items:flex-start;margin:0.6rem 0',
    },
      el('span', {
        role: 'img', 'aria-label': `Teil ${i + 1}`,
        style: 'font-size:1.6rem;line-height:1.3;min-width:1.8rem',
      }, t.zeichen ?? (t.luecke ? '❓' : '•')),
      el('div', { style: 'flex:1' },
        el('p', { style: `margin:0${t.luecke ? ';font-weight:700' : ''}` }, t.satz),
        stimmeDa()
          ? el('button', {
            class: 'k-knopf k-knopf--neutral k-knopf--klein',
            style: 'margin-top:0.3rem',
            'aria-label': `Teil ${i + 1} noch einmal hören`,
            onclick: () => vorlesen(t.satz),
          }, '🔊 noch einmal')
          : null))));
}

function vorlageBildschirm() {
  const teile = vorlage.teile;
  const ganzeGeschichte = teile.map((t) => t.satz).join(' ');
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `${art.stufe}. ${art.name}`),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center' }, vorlage.titel),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0' }, '👪 Lies deinem Kind die Geschichte vor. Jeder Teil lässt sich einzeln noch einmal hören.')),
      teileListe(teile),
      vorleseKnopf(ganzeGeschichte, '🔊 Ganze Geschichte vorlesen'),
      erwachsenenKarte(
        el('p', { style: 'margin:0' }, `Der Ausgangston dieser Geschichte: ${vorlage.ausgangsstimmung}. Das steht nicht als Etikett am Bildschirm: wie die Geschichte wirkt, darf dein Kind selbst sagen – in der Geschichte ist nur erzählt, wie es der Figur geht.`),
        el('p', { style: 'margin:0.4rem 0 0;font-size:0.95em' }, vorlage.herkunft)),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          onclick: () => (art.id === 'tausch' ? tauschBildschirm() : aufgabeBildschirm()),
        }, 'Weiter ➡️'),
        aufhoerKnopf())));
}

// Der Tausch: die APP führt ihn aus. Ein Sortier-Widget würde die
// Umstrukturierung in eine Anordnungsaufgabe mit richtiger Reihenfolge
// verwandeln – also verdeckte Bewertung –, und gezieltes Ziehen und
// Ablegen ist auf Touch mit 5-6 Jahren unzuverlässig.
function tauschBildschirm() {
  getauschtGezeigt = true;
  const neu = getauscht(vorlage);
  const text = neu.map((t) => t.satz).join(' ');
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔃'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Jetzt von hinten nach vorn'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0' }, '👪 Lies die Geschichte noch einmal vor – diesmal fängt sie mit dem Ende an.')),
      teileListe(neu),
      vorleseKnopf(text, '🔊 So vorlesen'),
      erwachsenenKarte(el('p', { style: 'margin:0' },
        'Beide Fassungen bleiben hörbar: „Zurück zur ersten“ liest wieder die alte. Zwei Zustände zu vergleichen geht nur, wenn beide erreichbar sind.')),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: aufgabeBildschirm }, 'Weiter ➡️'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: vorlageBildschirm }, '↩️ Zurück zur ersten'),
        aufhoerKnopf())));
}

// ------------------------------------------------------------- Aufgabe
function aufgabeBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '💭'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center' }, art.kindFrage),
      el('p', { style: 'text-align:center' }, 'Erzähl einfach. Es gibt nichts zu treffen.'),
      vorleseKnopf(art.kindFrage, '🔊 Frage vorlesen'),
      erwachsenenKarte(
        el('p', { style: 'margin:0' }, 'Warte ab und sag nichts vor. Offene Nachfragen, falls es stockt:'),
        el('ul', { style: 'margin:0.3rem 0 0;padding-left:1.2rem' },
          ...daten.erwachseneImpulse.map((i) => el('li', {}, `„${i}“`))),
        el('p', { style: 'margin:0.4rem 0 0' }, daten.keinZiel)),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: blattBildschirm }, '📝 Wir schreiben es auf'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: ideenBildschirm }, '💡 Wir brauchen zusammen eine Idee'),
        aufhoerKnopf()),
      getauschtGezeigt
        ? el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: tauschBildschirm }, '🔃 Die neue Fassung noch einmal'),
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: vorlageBildschirm }, '↩️ Die erste Fassung noch einmal'))
        : el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: vorlageBildschirm }, '↩️ Geschichte noch einmal hören'))));
}

// Die Möglichkeiten sind ERWACHSENEN-Material. Sie erscheinen nie beim
// Aufgabenstart: stünde eine Fortsetzung sichtbar da, bevor das Kind
// erfunden hat, würde es nicht erfinden, sondern wählen – und das
// Angebotene als das vorgesehene Ende behandeln. Darum alle drei
// gleichzeitig, gemischt, und mit dem Satz „drei von vielen Wegen“.
function ideenBildschirm() {
  const ideen = gemischteMoeglichkeiten(vorlage);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '💡'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Das sind drei von vielen Wegen'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0' }, '👪 Frag eine davon – oder alle drei. Es ist keine davon die vorgesehene.')),
      el('ul', {}, ...ideen.map((m) => el('li', { style: 'margin-bottom:0.5rem' }, m.impuls))),
      vorleseKnopf(`Das sind drei von vielen Wegen. ${ideen.map((m) => m.impuls).join(' ')}`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: aufgabeBildschirm }, '↩️ Zurück zur Frage'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: blattBildschirm }, '📝 Wir schreiben es auf'),
        aufhoerKnopf())));
}

// --------------------------------------------------------------- Blatt
// Kein Textfeld. Ein Eingabefeld wird vom Browser selbst
// wiederhergestellt (Session-Restore, Back-Forward-Cache), Autofill
// merkt sich Eingaben, und mobile Tastaturen nehmen getippte Wörter in
// ihr Lernwörterbuch auf – „es wird nichts gespeichert“ wäre damit keine
// wahre Aussage. Darum: Papier und Stift.
function blattBildschirm() {
  zeige(
    el('section', { class: 'k-karte gw-nur-bildschirm' },
      el('p', { class: 'k-gross' }, '📝'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Jetzt schreibst du mit'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0' }, '1. Druck das Blatt aus oder nimm ein leeres Papier.'),
        el('p', { style: 'margin:0.3rem 0 0' }, '2. Schreib auf, was dein Kind erzählt hat – mit seinen Worten, nicht mit deinen.'),
        el('p', { style: 'margin:0.3rem 0 0' }, '3. Lies es ihm vor. Dann hört es seine eigene Geschichte und kann sagen, ob es so gemeint war.')),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'margin:0' }, `🔒 ${daten.nichtsGespeichert}`),
        el('p', { style: 'margin:0.4rem 0 0' }, '🗣️ Das Vorlesen des Aufgeschriebenen macht die App nicht – das machst du. Sie liest nur ihre eigenen Texte.')),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Blatt drucken'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: schluss }, 'Fertig ➡️'))),
    blatt());
}

/**
 * Das Blatt: ein neutrales Familiendokument. Kein Urkunden-Wortlaut,
 * keine Sterne, Sticker oder Medaillen, kein Zähler erledigter Vorlagen –
 * und KEINE Namenszeile. Die Freigabe-Checkliste in docs/02 verbietet sie
 * ausdrücklich („это была бы система сравнения детей на бумаге“), und das
 * gilt auch, wenn sie als freiwillige Autorenzeile gemeint ist: ein
 * vorgedrucktes Namensfeld macht aus einem Blatt ein vergleichbares.
 * Wer seinen Namen draufschreiben will, hat das ganze Blatt dafür.
 */
function blatt() {
  const teile = getauschtGezeigt ? getauscht(vorlage) : vorlage.teile;
  const linie = () => el('div', { class: 'gw-linie' });
  return el('section', { class: 'k-karte gw-blatt' },
    el('h2', { style: 'margin-top:0;font-size:1.15em' }, `Unsere Geschichte: ${vorlage.titel}`),
    el('p', { style: 'margin:0 0 0.6rem;font-size:0.95em' }, 'So fing sie an:'),
    el('ul', { style: 'margin:0 0 0.8rem' }, ...teile.map((t) => el('li', {}, t.satz))),
    el('p', { style: 'margin:0 0 0.3rem;font-weight:700' }, `${art.kindFrage}`),
    linie(), linie(), linie(), linie(), linie(), linie(),
    el('p', { style: 'margin:0.8rem 0 0;font-size:0.9em' },
      'Familiendokument – bitte nicht ins Netz stellen. Kinder haben ein Recht darauf, gefragt zu werden, bevor Erwachsene ihre Geschichten zeigen.'));
}

// -------------------------------------------------------------- Schluss
function schluss() {
  const ideen = mischen(daten.schlussIdeen).slice(0, 3);
  const text = `Bildschirm aus – jetzt erzählt ihr ohne Gerät! ${ideen.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte gw-nur-bildschirm' },
      el('p', { class: 'k-gross' }, '🗣️'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'jetzt erzählt ihr selbst!'),
      el('p', { style: 'text-align:center' }, daten.abbruch),
      el('ul', {}, ...ideen.map((i) => el('li', { style: 'margin-bottom:0.5rem' }, i))),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Vorher einmal lesen:'),
        el('ul', { style: 'margin:0;padding-left:1.2rem' },
          ...daten.sicherheit.map((s) => el('li', { style: 'margin-bottom:0.3rem' }, s)))),
      vorleseKnopf(text),
      el('div', { class: 'k-antworten' },
        ...[
          vorlage ? el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Blatt drucken') : null,
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: artBildschirm }, '🔁 Etwas anderes machen'),
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏡 Zum Start'),
        ].filter(Boolean))),
    vorlage ? blatt() : null);
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else if (PRO_SESSION !== 1) {
  throw new Error('Eine Transformation pro Sitzung – mehr erzeugt Abbruch statt Übung');
} else {
  gate();
}
