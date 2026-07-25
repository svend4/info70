// Wie bewegen sich Tiere und Pflanzen? (3-5, NUR gemeinsam mit einem
// Erwachsenen): vier Aha-Regeln vom Körperbau zur Bewegung, dazu die
// Überraschung, dass auch Pflanzen sich bewegen.
// Praleska docs/10 (Ko-Nutzung Nr. 6).
//
// Ko-Nutzungs-Design: Erwachsenen-Gate, höchstens PRO_SESSION Tiere,
// danach zwingend Schluss. Keine Punkte, kein Rekord, nichts gespeichert.
// Politik docs/02: keine externen Anfragen.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { PRO_SESSION, waehleTiere, baueAufgabe, istRichtig, folgtRegel, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/bewegung.json').then((r) => r.json());

let tiere = [];
let index = 0;
let aufgabe = null;

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🐰 Wie bewegt sich das?'),
    el('p', { class: 'k-untertitel' }, 'Für Kind und Erwachsene – zusammen.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button')?.focus();
}

function gate() {
  const intro = 'Diese App spielt ihr zusammen: ein Kind und ein Erwachsener. Schaut euch die Beine an – dann wisst ihr, wie sich ein Tier bewegt. Es gibt keine Punkte.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Bitte gemeinsam spielen.'),
      el('p', {}, 'Diese App ist für ein Kind UND einen Erwachsenen zusammen.'),
      el('p', {}, 'Ihr schaut Tiere an und ratet, wie sie sich bewegen. Der Trick: erst auf die Beine schauen!'),
      el('p', {}, 'Es gibt keine Punkte. Nach jedem Tier redet ihr miteinander.'),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '👪 Ein Erwachsener ist dabei – los!'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: regelBildschirm }, '📖 Erst die Regeln ansehen'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, `👉 Höchstens ${PRO_SESSION} Tiere – danach geht ihr selbst auf die Suche.`)));
}

// Die vier Aha-Regeln zum Nachlesen.
function regelBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0' }, '📖 Die vier Regeln'),
      el('p', { style: 'margin-top:0' }, 'Schau auf die Beine – dann weißt du fast immer, wie es sich bewegt.'),
      ...daten.regeln.map((r) => el('div', { style: 'margin:0.8rem 0;padding-top:0.6rem;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'font-weight:700;margin:0;font-size:1.1em' }, `${r.emoji} ${r.koerper}`),
        el('p', { style: 'margin:0.2rem 0' }, `➡️ ${r.regel}`),
        el('p', { style: 'margin:0' }, r.beispiel))),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(daten.regeln.map((r) => `${r.koerper}. ${r.regel} ${r.beispiel}`).join(' ')),
      }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Tiere raten'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: pflanzenBildschirm }, '🌻 Und die Pflanzen?'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏠 Zum Start'))));
}

// Die Überraschung: Pflanzen bewegen sich auch.
function pflanzenBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🌻'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.15em' }, 'Auch Pflanzen bewegen sich!'),
      el('p', {}, 'Man sieht es nur nicht sofort, weil sie es ganz langsam tun. Man muss zweimal hinschauen – mit Abstand.'),
      ...daten.pflanzen.map((p) => el('div', { style: 'margin:0.8rem 0;padding-top:0.6rem;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'font-weight:700;margin:0;font-size:1.1em' }, `${p.emoji} ${p.name}`),
        el('p', { style: 'margin:0.2rem 0' }, p.bewegung),
        el('div', { class: 'k-hinweis' },
          el('p', { style: 'margin:0' }, `🔬 Probiert es aus: ${p.versuch}`)))),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`Auch Pflanzen bewegen sich. ${daten.pflanzen.map((p) => `${p.name}. ${p.bewegung} ${p.versuch}`).join(' ')}`),
      }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Tiere raten'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: regelBildschirm }, '📖 Zu den Regeln'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏠 Zum Start'))));
}

function starteRunde() {
  tiere = waehleTiere(daten.tiere);
  index = 0;
  frageBildschirm();
}

function frageBildschirm() {
  aufgabe = baueAufgabe(daten, tiere[index], mischen);
  const t = aufgabe.tier;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Tier ${index + 1} von ${tiere.length}`),
      el('div', {
        class: 'k-fortschritt', role: 'progressbar',
        'aria-valuemin': '0', 'aria-valuemax': String(tiere.length), 'aria-valuenow': String(index),
      }, el('div', { style: `width:${(index / tiere.length) * 100}%` })),
      el('p', { class: 'k-gross' }, t.emoji),
      el('p', { style: 'font-weight:700;font-size:1.35em;text-align:center' }, `Wie bewegt sich ${t.name.toLowerCase()}?`),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`Wie bewegt sich ${t.name.toLowerCase()}? ${aufgabe.optionen.map((o) => o.name).join('. Oder: ')}?`),
      }, '🔊 Frage vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Bewegung wählen' },
        ...aufgabe.optionen.map((o) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          style: 'min-height:5.5rem',
          'aria-label': o.name,
          onclick: () => waehle(o),
        },
        el('span', { style: 'font-size:2.2em;display:block;line-height:1.1' }, o.emoji),
        el('span', {}, o.name))))));
}

function waehle(gewaehlt) {
  const richtig = istRichtig(aufgabe, gewaehlt.id);
  const t = aufgabe.tier;
  const kopf = richtig ? '🌟 Ja, genau!' : '🔎 Schau mal:';
  const satz = richtig ? t.erklaerung : `${aufgabe.loesung.emoji} ${aufgabe.loesung.name}. ${t.erklaerung}`;
  const letzte = index + 1 >= tiere.length;
  const zeigtRegel = folgtRegel(daten, t);
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, richtig ? '🌟' : '🔎'),
      el('div', { class: `k-hinweis${richtig ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, kopf),
        el('p', { style: 'margin-bottom:0' }, satz)),
      // Bei einer Ausnahme steht das ausdrücklich da, statt die Regel
      // stillschweigend zu verbiegen.
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' },
          zeigtRegel ? `${aufgabe.regel.emoji} Die Regel dazu:` : '⚠️ Hier gilt die Regel nicht:'),
        el('p', { style: 'margin-bottom:0' },
          zeigtRegel ? aufgabe.regel.regel : `${aufgabe.regel.regel} ${t.ausnahmeGrund}`)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene – redet zusammen:'),
        el('p', { style: 'margin-bottom:0' }, t.gespraech)),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${kopf} ${satz} ${aufgabe.regel.regel} Für Erwachsene: ${t.gespraech}`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function weiter() {
  index++;
  if (index < tiere.length) frageBildschirm();
  else schluss();
}

function schluss() {
  const ideen = daten.schlussIdeen;
  const text = `Bildschirm aus – jetzt sucht ihr selbst! ${ideen.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔍'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'jetzt sucht ihr selbst!'),
      el('p', { style: 'text-align:center' }, 'Drei Ideen für euch beide:'),
      el('ul', {}, ...ideen.map((i) => el('li', { style: 'margin-bottom:0.5rem' }, i))),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: pflanzenBildschirm }, '🌻 Pflanzen ansehen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏠 Zum Start'))));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  gate();
}
