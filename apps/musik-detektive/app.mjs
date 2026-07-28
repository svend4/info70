// Musik-Detektive (4-6, NUR gemeinsam mit einem Erwachsenen):
// Lied, Marsch und Tanz heraushören und Stimmungen vergleichen.
// Praleska docs/10 (Ko-Nutzung Nr. 15).
//
// Alle Klänge entstehen hier im Browser aus Oszillatoren. Es gibt keine
// Audiodateien, keine fremden Melodien und keine externen Anfragen.
//
// Zu jedem Klang laufen Puls-Punkte mit, die aus DEMSELBEN Zeitplan
// kommen wie der Ton (`zeitplan()`): Beide können damit nicht
// auseinanderlaufen. Die Punkte wachsen und schrumpfen, sie blinken
// nicht – ein Helligkeitswechsel im Sekundentakt wäre für lichtempfindliche
// Menschen ein Risiko (WCAG 2.3.1).
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  PRO_SESSION, TOENE, MAX_LAUTSTAERKE, gruppierungVon, stueckVon,
  zeitplan, ohneHoeren, istNachvollziehbar, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/musik.json').then((r) => r.json());

let audio = null;      // AudioContext erst nach der ersten Nutzer-Geste
let master = null;
let laeuft = [];       // laufende Timer für die Puls-Punkte
let klingt = [];       // bereits eingeplante Oszillatoren
let spuren = [];       // alle Puls-Reihen des aktuellen Bildschirms
let aufgaben = [];
let index = 0;

function ton() {
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)();
    master = audio.createGain();
    // Der Deckel liegt in der App: Kinder regeln die Lautstärke nicht selbst,
    // und die Lautstärke des Geräts kann die App nicht auslesen.
    master.gain.value = MAX_LAUTSTAERKE;
    master.connect(audio.destination);
  }
  if (audio.state === 'suspended') audio.resume();
  return audio;
}

/**
 * `t0` ist eine ABSOLUTE Zeit auf der Audio-Uhr. Würde jeder Ton beim
 * Einplanen `currentTime` neu lesen, verschöbe sich jeder spätere Ton um
 * die Zeit, die das Einplanen der vorherigen gekostet hat – der Rhythmus
 * liefe langsam auseinander. Deshalb rechnet `spiele()` den Nullpunkt
 * einmal aus und alle Töne beziehen sich darauf.
 */
function klang(hertz, t0, dauer, staerke, wellenform = 'triangle') {
  const a = ton();
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = wellenform;
  osc.frequency.value = hertz;
  // Mindestens 10 ms Ein- und Ausblenden – sonst knackt es hörbar.
  const ende = t0 + Math.max(dauer, 0.06);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(staerke, t0 + 0.012);
  g.gain.setValueAtTime(staerke, ende - 0.03);
  g.gain.linearRampToValueAtTime(0, ende);
  osc.connect(g); g.connect(master);
  osc.start(t0);
  osc.stop(ende + 0.02);
  // Merken, um ihn notfalls vorzeitig abzuwürgen: Ein Oszillator ist ab
  // dem Einplanen im Graphen. Nur die Timer zu löschen würde den Klang
  // beim Bildschirmwechsel weiterlaufen lassen.
  klingt.push({ osc, g });
  osc.onended = () => { klingt = klingt.filter((k) => k.osc !== osc); };
}

function stopAlles() {
  for (const t of laeuft) clearTimeout(t);
  laeuft = [];
  const jetzt = audio ? audio.currentTime : 0;
  for (const { osc, g } of klingt) {
    try {
      // Kurz ausblenden statt hart abschneiden – sonst knackt es.
      g.gain.cancelScheduledValues(jetzt);
      g.gain.setValueAtTime(g.gain.value, jetzt);
      g.gain.linearRampToValueAtTime(0, jetzt + 0.02);
      osc.stop(jetzt + 0.03);
    } catch {
      // Ein Oszillator, der schon vorbei ist, lässt sich nicht mehr stoppen.
    }
  }
  klingt = [];
  // Auch die Punkte der anderen Reihe zurücksetzen: Sonst bliebe die
  // Reihe, die gerade unterbrochen wurde, mitten in der Bewegung stehen.
  for (const punkte of spuren) zeigePuls(punkte, -1);
}

/** Begleitung: der hörbarste Unterschied zwischen Zweier und Dreier. */
function begleitung(stueck, plan, t0) {
  const halb = stueck.tonart === 'moll' ? [TOENE.Es4, TOENE.G4] : [TOENE.E4, TOENE.G4];
  if (stueck.begleitung === 'liegend') {
    // Ein liegender, leiser Akkord pro Takt nimmt den Antrieb heraus.
    for (const s of plan.schlaege) {
      if (s.imTakt !== 0) continue;
      const lang = plan.dauer * stueck.schlaegeProTakt * 0.95;
      klang(TOENE.C3, t0 + s.beginn, lang, 0.16, 'sine');
      for (const h of halb) klang(h, t0 + s.beginn, lang, 0.05, 'sine');
    }
    return;
  }
  for (const s of plan.schlaege) {
    const bass = stueck.schlaegeProTakt === 4 ? s.imTakt % 2 === 0 : s.imTakt === 0;
    if (bass) {
      klang(s.imTakt === 0 ? TOENE.C3 : TOENE.G2, t0 + s.beginn, plan.dauer * 0.45, 0.3, 'sine');
    } else {
      for (const h of halb) klang(h, t0 + s.beginn, plan.dauer * 0.28, 0.07, 'sine');
    }
  }
}

/** Spielt ein Stück und lässt die Puls-Punkte mitlaufen. */
function spiele(stueck, punkte) {
  stopAlles();
  const plan = zeitplan(stueck);
  // Ein Nullpunkt für alles. Der kleine Vorlauf gibt dem Einplanen Zeit.
  const t0 = ton().currentTime + 0.06;
  for (const n of plan.noten) klang(n.hertz, t0 + n.beginn, n.dauer, 0.45);
  begleitung(stueck, plan, t0);
  if (!punkte) return;
  for (const s of plan.schlaege) {
    laeuft.push(setTimeout(() => zeigePuls(punkte, s.imTakt), (s.beginn + 0.06) * 1000));
  }
  laeuft.push(setTimeout(() => zeigePuls(punkte, -1), (plan.gesamt + 0.06) * 1000));
}

// Größenänderung statt Blinken: kein Helligkeitswechsel (WCAG 2.3.1).
function zeigePuls(punkte, aktiv) {
  punkte.forEach((p, i) => {
    const gross = i === 0;
    const an = i === aktiv;
    p.style.width = an ? (gross ? '2.2rem' : '1.6rem') : (gross ? '1.5rem' : '1rem');
    p.style.height = p.style.width;
    p.style.background = gross ? 'var(--k-blau-dunkel)' : 'var(--k-blau)';
  });
}

function pulsReihe(stueck) {
  const punkte = [];
  for (let i = 0; i < stueck.schlaegeProTakt; i++) {
    punkte.push(el('span', {
      style: 'display:inline-block;border-radius:50%;background:var(--k-blau);transition:width .08s,height .08s',
    }));
  }
  zeigePuls(punkte, -1);
  const reihe = el('div', {
    role: 'img',
    'aria-label': `Puls: ${gruppierungVon(stueck.schlaegeProTakt) === 'dreier' ? 'drei' : 'zwei'} Schläge, der erste ist der schwere`,
    style: 'display:flex;align-items:center;justify-content:center;gap:0.6rem;height:2.6rem;margin:0.4rem 0',
  }, ...punkte);
  spuren.push(punkte);
  return { reihe, punkte };
}

/**
 * Die Puls-Reihe zeigt schon vor dem ersten Ton, ob zwei oder drei
 * Schläge im Takt sind – und genau danach fragen die Muster-Rätsel
 * indirekt. Deshalb gibt es sie dort NICHT: Sie ist der Zweitkanal für
 * die Takt-Fragen und für die Rückmeldung, nicht für alles.
 */
function hoerKarte(stueck, beschriftung = '🔊 Anhören', mitPuls = true) {
  const { reihe, punkte } = mitPuls ? pulsReihe(stueck) : { reihe: null, punkte: null };
  return el('div', {},
    reihe,
    el('button', {
      class: 'k-knopf k-knopf--neutral',
      onclick: () => spiele(stueck, punkte),
    }, beschriftung));
}

// ------------------------------------------------------------- Bildschirme
function zeige(...knoten) {
  stopAlles();
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🎼 Musik-Detektive'),
    el('p', { class: 'k-untertitel' }, 'Für Kind und Erwachsene – zusammen.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  // Aufräumen erst NACH dem Einhängen: Die Reihen des neuen Bildschirms
  // entstehen schon beim Auswerten der Argumente, hängen aber erst jetzt
  // im Dokument. Alles, was nicht mehr drinhängt, ist vom alten Bildschirm.
  spuren = spuren.filter((punkte) => punkte[0]?.isConnected);
  app.querySelector('button')?.focus();
}

function gate() {
  const intro = 'Diese App spielt ihr zusammen: ein Kind und ein Erwachsener. Ihr hört kurze Muster und ratet, ob man dazu marschiert, tanzt oder singt. Es gibt keine Punkte. Stellt die Lautstärke bitte leise ein und hört über den Lautsprecher, damit ihr gemeinsam hört.';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Bitte gemeinsam spielen.'),
      el('p', {}, 'Diese App ist für ein Kind UND einen Erwachsenen zusammen.'),
      el('p', {}, 'Ihr hört kurze Muster: Passt das zum Marschieren, zum Tanzen oder zum Singen? Und wie fühlt es sich an?'),
      el('p', {}, 'Es gibt keine Punkte. Nach jeder Aufgabe redet ihr miteinander – und bewegt euch dazu.'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0' }, '🔈 Bitte leise anfangen und über den Lautsprecher hören, nicht über Kopfhörer – so hört ihr gemeinsam.')),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(intro) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          onclick: () => klang(TOENE.G4, ton().currentTime + 0.05, 0.6, 0.4),
        }, '🔈 Erst einen Ton probieren'),
        el('button', { class: 'k-knopf', onclick: starteRunde }, '👪 Ein Erwachsener ist dabei – los!'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: regelBildschirm }, '📖 Woran erkennt man das?'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, `👉 Höchstens ${PRO_SESSION} Aufgaben – danach sucht ihr Musik ohne Bildschirm.`)));
}

function regelBildschirm() {
  const zahl = ohneHoeren(daten.raetsel);
  zeige(
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0' }, '📖 Woran erkennt man das?'),
      ...daten.regeln.map((r) => el('div', { style: 'margin:0.8rem 0;padding-top:0.6rem;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'font-weight:700;margin:0' }, `${r.typ === 'meinung' ? '💭 ' : ''}${r.text}`),
        el('p', { style: 'margin:0.3rem 0 0;font-size:0.95em' }, `👪 Grenze: ${r.gilt}`))),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(daten.regeln.map((r) => r.text).join(' ')),
      }, '🔊 Vorlesen')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0' }, '👂 Was diese App kann und was nicht'),
      el('p', { style: 'margin-top:0' }, daten.hinweis),
      // Die Zahl wird gerechnet, nicht behauptet.
      el('p', {}, `${zahl} von ${daten.raetsel.length} Rätseln gehen auch ohne Hören: Bei den Takt-Fragen laufen die Puls-Punkte mit.`),
      el('p', { style: 'margin-bottom:0' }, daten.barrierefreiheit)),
    el('section', { class: 'k-karte' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '▶️ Losraten'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏠 Zum Start'))));
}

function starteRunde() {
  // Rätsel und Stimmungsfragen kommen gemischt, aber die Stimmungsfragen
  // sind ausdrücklich keine Rätsel – sie haben keine Lösung.
  const alle = [
    ...daten.raetsel.map((r) => ({ art: 'raetsel', ...r })),
    ...daten.stimmung.map((s) => ({ art: 'stimmung', ...s })),
  ];
  aufgaben = mischen(alle).slice(0, PRO_SESSION);
  index = 0;
  frageBildschirm();
}

function kopfZeile() {
  return [
    el('p', { class: 'k-untertitel' }, `Aufgabe ${index + 1} von ${aufgaben.length}`),
    el('div', {
      class: 'k-fortschritt', role: 'progressbar',
      'aria-valuemin': '0', 'aria-valuemax': String(aufgaben.length), 'aria-valuenow': String(index),
    }, el('div', { style: `width:${(index / aufgaben.length) * 100}%` })),
  ];
}

function frageBildschirm() {
  const a = aufgaben[index];
  return a.art === 'raetsel' ? raetselBildschirm(a) : stimmungsBildschirm(a);
}

function raetselBildschirm(r) {
  const stueck = stueckVon(daten, r.stueck);
  zeige(
    el('section', { class: 'k-karte' },
      ...kopfZeile(),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, r.frage),
      // Puls-Punkte nur bei den Takt-Fragen: dort sind sie der erklärte
      // Zweitkanal. Bei den Muster-Fragen wären sie ein Spickzettel.
      hoerKarte(stueck, `🔊 ${stueck.name} anhören`, r.ohneHoerenLoesbar),
      el('p', { style: 'text-align:center;margin:0.4rem 0 0;font-size:0.95em' }, 'So oft ihr wollt.'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Antwort wählen' },
        ...mischen([...r.optionen]).map((o) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          style: 'min-height:4rem',
          onclick: () => waehleRaetsel(r, stueck, o),
        }, o.text)))));
}

function waehleRaetsel(r, stueck, gewaehlt) {
  const richtig = Boolean(gewaehlt.richtig);
  // Muster C zählt in Zweiern wie ein Marsch. Wer danach „marschieren“
  // sagt, hat die Regel richtig angewendet – das ist kein Fehler.
  const fast = istNachvollziehbar(r, gewaehlt);
  const kopf = richtig ? '🌟 Ja, genau!' : fast ? '👍 Fast – gut gehört!' : '🔎 Hör noch einmal:';
  const letzte = index + 1 >= aufgaben.length;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, richtig ? '🌟' : fast ? '👍' : '🔎'),
      el('div', { class: `k-hinweis${richtig ? ' k-hinweis--richtig' : ''}` },
        el('p', { style: 'font-weight:700;margin-top:0' }, kopf),
        el('p', { style: 'margin-bottom:0' }, fast ? `${r.nachvollziehbarText} ${r.erklaerung}` : r.erklaerung)),
      hoerKarte(stueck, '🔊 Noch einmal anhören'),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene – macht es zusammen:'),
        el('p', { style: 'margin-bottom:0' }, r.gespraech)),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${kopf} ${r.erklaerung} Für Erwachsene: ${r.gespraech}`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

// Stimmungsfragen sehen absichtlich anders aus als Rätsel: kein Häkchen,
// kein Kreuz, keine Auswertung. Es gibt hier nichts zu treffen.
function stimmungsBildschirm(f) {
  const paar = daten.paare.find((p) => p.id === f.paar);
  const a = stueckVon(daten, paar.a);
  const b = stueckVon(daten, paar.b);
  zeige(
    el('section', { class: 'k-karte' },
      ...kopfZeile(),
      el('p', { class: 'k-gross' }, '💭'),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, 'Zweimal dasselbe – einmal anders.'),
      el('p', { style: 'text-align:center;margin:0' }, paar.wasAnders),
      el('div', { style: 'display:flex;gap:0.6rem;flex-wrap:wrap;justify-content:center;margin-top:0.6rem' },
        el('div', { style: 'flex:1;min-width:9rem' },
          el('p', { style: 'text-align:center;font-weight:700;margin:0' }, '1️⃣ Zuerst'), hoerKarte(a, '🔊 Erstes anhören')),
        el('div', { style: 'flex:1;min-width:9rem' },
          el('p', { style: 'text-align:center;font-weight:700;margin:0' }, '2️⃣ Dann'), hoerKarte(b, '🔊 Zweites anhören'))),
      el('p', { style: 'font-weight:700;text-align:center;margin-top:0.8rem' }, f.frage),
      el('p', { style: 'text-align:center;margin:0' }, 'Hier gibt es nichts Richtiges und nichts Falsches.'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Deine Antwort' },
        ...f.antworten.map((o) => el('button', {
          class: 'k-knopf k-knopf--neutral',
          onclick: () => antworteStimmung(f),
        }, o.text)))));
}

function antworteStimmung(f) {
  const letzte = index + 1 >= aufgaben.length;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '💭'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '💭 Deine Antwort zählt – und wird nicht gezählt.'),
        el('p', { style: 'margin-bottom:0' }, f.erklaerung)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene – redet zusammen:'),
        el('p', { style: 'margin-bottom:0' }, f.gespraech)),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen(`${f.erklaerung} Für Erwachsene: ${f.gespraech}`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: weiter }, letzte ? 'Fertig 🏁' : 'Weiter ➡️'))));
}

function weiter() {
  index++;
  if (index < aufgaben.length) frageBildschirm();
  else mischformBildschirm();
}

// Die Pointe am Ende jeder Runde: Die Dreiteilung ist keine saubere
// Einteilung. Deshalb wird dieses Stück nie abgefragt.
function mischformBildschirm() {
  const stueck = daten.stuecke.find((s) => s.zweck === 'zeigen');
  const regel = daten.regeln.find((r) => r.id === 'r-mischform');
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🎶'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Und jetzt etwas Verzwicktes:'),
      hoerKarte(stueck, `🔊 ${stueck.name} anhören`),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '⚠️ Hier wären zwei Antworten richtig:'),
        el('p', { style: 'margin:0' }, 'Das kann man mitsingen – es ist ein Lied. Und man kann dazu marschieren – es ist ein Marsch. Beides stimmt. Solche Marschlieder gibt es wirklich.'),
        el('p', { style: 'margin-bottom:0' }, `👪 ${regel.gilt}`)),
      el('button', {
        class: 'k-knopf k-knopf--neutral',
        onclick: () => vorlesen('Das kann man mitsingen – es ist ein Lied. Und man kann dazu marschieren – es ist ein Marsch. Beides stimmt.'),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: schluss }, 'Weiter ➡️'))));
}

function schluss() {
  const ideen = daten.schlussIdeen;
  const text = `Bildschirm aus – jetzt hört ihr selbst! ${ideen.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '👂'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'jetzt hört ihr selbst!'),
      el('p', { style: 'text-align:center' }, 'Drei Ideen für euch beide:'),
      el('ul', {}, ...ideen.map((i) => el('li', { style: 'margin-bottom:0.5rem' }, i))),
      el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text) }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starteRunde }, '🔁 Noch einmal'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: regelBildschirm }, '📖 Woran erkennt man das?'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏠 Zum Start'))));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  gate();
}
