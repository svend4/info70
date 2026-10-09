// Tier-Tanz-Impulse (3-5 und 5-7, nur gemeinsam).
// Praleska docs/10 (Ko-Nutzung Nr. 20).
//
// Der ERWACHSENE bedient das Gerät, das Kind bewegt sich im Raum. Der
// Bildschirm macht nichts vor und bewertet nichts; wahrheitsfähig ist
// allein, was die Karte über das Tier behauptet (siehe logik.mjs).
// Die Motive sind Rhythmus auf höchstens zwei Tonhöhen – keine Melodie.
// Politik docs/02: keine externen Anfragen.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  PRO_SESSION, MAX_LAUTSTAERKE, GELTUNGEN, tierVon, kindTextVon,
  karten, waehleKarten, zeitplan, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/karten.json').then((r) => r.json());

let audio = null;
let master = null;
let klingt = [];      // eingeplante Oszillatoren
let laeuft = [];      // Timer der sichtbaren Puls-Punkte
let spuren = [];      // Puls-Reihen des aktuellen Bildschirms
let mitTon = true;    // der stille Weg ist gleichwertig, nicht Notfall
let jahreszeit = null;
let deck = [];
let index = 0;

const tempoVon = (id) => daten.tempi.find((t) => t.id === id);
const dynVon = (id) => daten.dynamiken.find((d) => d.id === id);
const artVon = (id) => daten.artikulationen.find((a) => a.id === id);
const ortVon = (id) => daten.orte.find((o) => o.id === id);
const jzVon = (id) => daten.jahreszeiten.find((j) => j.id === id);

function ton() {
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)();
    master = audio.createGain();
    // Der Deckel liegt schon in jedem Schlag (zeitplan() multipliziert den
    // Anteil mit MAX_LAUTSTAERKE). Hier noch einmal zu dämpfen hieße, ihn
    // zweimal anzuwenden – darum steht der Master auf 1.
    master.gain.value = 1;
    master.connect(audio.destination);
  }
  if (audio.state === 'suspended') audio.resume();
  return audio;
}

/** Ein Schlag. Mindestens 12 ms Ein- und Ausblenden, sonst knackt es. */
function schlag(hertz, t0, dauer, staerke) {
  const a = ton();
  const osc = a.createOscillator();
  const g = a.createGain();
  osc.type = 'triangle';
  osc.frequency.value = hertz;
  const ende = t0 + Math.max(dauer, 0.06);
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(staerke, t0 + 0.012);
  g.gain.setValueAtTime(staerke, ende - 0.03);
  g.gain.linearRampToValueAtTime(0, ende);
  osc.connect(g); g.connect(master);
  osc.start(t0);
  osc.stop(ende + 0.02);
  // Ein eingeplanter Oszillator liegt ab jetzt im Graphen. Nur die Timer
  // zu löschen würde den Klang beim Bildschirmwechsel weiterlaufen lassen.
  klingt.push({ osc, g });
  osc.onended = () => { klingt = klingt.filter((k) => k.osc !== osc); };
}

function stopAlles() {
  for (const t of laeuft) clearTimeout(t);
  laeuft = [];
  const jetzt = audio ? audio.currentTime : 0;
  for (const { osc, g } of klingt) {
    try {
      g.gain.cancelScheduledValues(jetzt);
      g.gain.setValueAtTime(g.gain.value, jetzt);
      g.gain.linearRampToValueAtTime(0, jetzt + 0.02);
      osc.stop(jetzt + 0.03);
    } catch {
      // Ein Oszillator, der schon vorbei ist, lässt sich nicht stoppen.
    }
  }
  klingt = [];
  for (const punkte of spuren) zeigePuls(punkte, -1);
}

/** Hat die Person „weniger Bewegung“ eingestellt? */
const wenigerBewegung = () =>
  Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches);

/**
 * Der sichtbare Puls. GRÖSSE und Deckkraft werden gerampt, nichts wird
 * ein- und ausgeschaltet: bei 138 bpm läge ein An/Aus-Puls bei 2,3 Hz
 * und damit nahe an der Flackergrenze (WCAG 2.3.1, 3-55 Hz).
 *
 * ABER: die Rampe ist nur eine CSS-`transition`, und kinder.css schaltet
 * unter `prefers-reduced-motion: reduce` jede Transition mit `!important`
 * ab – eine `!important`-Regel aus dem Stylesheet schlägt den einfachen
 * Inline-Wert. Genau für die Menschen, die „weniger Bewegung“ eingestellt
 * haben, wäre der Puls also exakt der An/Aus-Sprung geworden, den der Satz
 * oben ausschließt. Darum gibt es für sie einen zweiten Weg: die Punkte
 * füllen sich NACHEINANDER und bleiben gefüllt (eine fortschreitende Reihe
 * statt eines blinkenden Punkts). Dann wechselt überhaupt nichts
 * periodisch, und die Reihe bleibt genauso lesbar.
 */
function zeigePuls(punkte, aktiv) {
  if (wenigerBewegung()) {
    punkte.forEach((p, i) => {
      const erreicht = aktiv >= 0 && i <= aktiv;
      p.style.transform = 'scale(1)';
      p.style.opacity = erreicht ? '1' : '0.45';
    });
    return;
  }
  punkte.forEach((p, i) => {
    const an = i === aktiv;
    p.style.transform = an ? 'scale(1.55)' : 'scale(1)';
    p.style.opacity = an ? '1' : '0.45';
  });
}

function zeige(...knoten) {
  // ACHTUNG, Auswertungsreihenfolge: die Knoten sind ARGUMENTE und werden
  // gebaut, BEVOR dieser Rumpf läuft. Ein `spuren = []` an dieser Stelle
  // würde also die Puls-Reihe löschen, die pulsReihe() gerade eingetragen
  // hat – und spiele() fände nichts mehr. (Dieselbe Falle wie in Welle 74
  // bei apps/musik-detektive.) Darum SETZT pulsReihe() `spuren`, und hier
  // wird nichts zurückgesetzt; stopAlles() räumt nur die Timer und die
  // Oszillatoren auf.
  stopAlles();
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🐿️ Tier-Tanz'),
    el('p', { class: 'k-untertitel' }, 'Der Bildschirm gibt den Impuls – bewegt wird im Zimmer.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  app.querySelector('button:not([disabled])')?.focus();
}

const vorlesenKnopf = (text) =>
  el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text) }, '🔊 Vorlesen');

const erwachsenenKarte = (text) => el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
  el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene:'),
  el('p', { style: 'margin-bottom:0' }, text));

// ---------------------------------------------------------------- Gate
function gate() {
  const intro = `${daten.ehrlichkeit} ${daten.ohneTon}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Das Gerät bedienst du.'),
      el('p', {}, 'Du ziehst eine Karte, dein Kind bewegt sich dazu. Der Bildschirm bleibt bei dir in der Hand – nicht auf dem Boden.'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '💡 Was die App über sich selbst sagt:'),
        el('p', { style: 'margin:0' }, daten.ehrlichkeit),
        el('p', { style: 'margin:0.4rem 0 0' }, daten.keineMelodie)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '🧹 Zuerst die Fläche:'),
        el('p', { style: 'margin:0' }, 'Räum frei und sag die Grenze laut – „bis zum Teppichrand“. Barfuß oder rutschfeste Sohle: Socken rutschen auf Laminat und Parkett.')),
      // Die Sicherheitshinweise standen nur im Schluss-Bildschirm, unter der
      // Überschrift „Vorher einmal lesen“ – also NACH den Karten. Zwei von
      // ihnen sind aber genau die, die vorher gelten müssen: beide Füße am
      // Boden beim Stehenbleiben, und das Deckeln der Drehungen. Darum hier,
      // vor der ersten Bewegung, aufklappbar statt als Textwand.
      el('details', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('summary', { style: 'font-weight:700;cursor:pointer;min-height:2.8rem;display:flex;align-items:center' },
          '🛟 Sicherheit – einmal lesen, bevor es losgeht'),
        el('ul', { style: 'margin:0.4rem 0 0;padding-left:1.2rem' },
          ...daten.sicherheit.map((t) => el('li', { style: 'margin-bottom:0.3rem' }, t)))),
      vorlesenKnopf(intro),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: tonBildschirm }, '👪 Fläche ist frei – weiter'))));
}

// Der stille Weg ist gleichwertig: schlafendes Geschwisterkind, gehörlose
// Familie, Rücksicht auf Nachbarn. Darum stehen beide Knöpfe gleich groß
// nebeneinander und der stille zuerst.
function tonBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔇🔊'),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, 'Mit Ton oder ohne?'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0' }, daten.ohneTon)),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Ton wählen' },
        el('button', {
          class: 'k-knopf', style: 'min-height:4.2rem',
          onclick: () => { mitTon = false; jahreszeitBildschirm(); },
        }, '🔇 Ohne Ton – ich spreche und klatsche'),
        el('button', {
          class: 'k-knopf', style: 'min-height:4.2rem',
          onclick: () => { mitTon = true; probeBildschirm(); },
        }, '🔊 Mit Ton')),
      erwachsenenKarte('Deine Stimme muss lauter sein als die App. Das Gerät gibt den Impuls, du bist die Bremse. Lautsprecher, keine Kopfhörer – die Umgebung muss hörbar bleiben.')));
}

function probeBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔊'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Erst ein Probeton'),
      el('p', {}, 'Stell die Lautstärke so ein, dass du beim Sprechen noch deutlich lauter bist. Die App kann die Lautstärke des Geräts nicht auslesen.'),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf k-knopf--neutral',
          onclick: () => {
            const a = ton();
            const t0 = a.currentTime + 0.05;
            // Mittlere Dynamik, denselben Weg wie ein echter Schlag.
            schlag(220, t0, 0.3, 0.5 * MAX_LAUTSTAERKE);
            schlag(220, t0 + 0.5, 0.3, 0.5 * MAX_LAUTSTAERKE);
          },
        }, '▶️ Probeton'),
        el('button', { class: 'k-knopf', onclick: jahreszeitBildschirm }, 'Passt – weiter ➡️'))));
}

// Eine Jahreszeit pro Sitzung. Der Igel fehlt im Winter von sich aus: er
// hält Winterschlaf, und ein Igel im Schnee ist kein Winterbild, sondern
// ein Notfall.
function jahreszeitBildschirm() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🌱☀️🍂❄️'),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, 'Welche Jahreszeit ist jetzt?'),
      el('p', { style: 'text-align:center;margin-top:0' }, 'Es kommen nur Tiere, die jetzt wirklich draußen unterwegs sind.'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Jahreszeit wählen' },
        ...daten.jahreszeiten.map((j) => el('button', {
          class: 'k-knopf k-knopf--neutral', style: 'min-height:4rem',
          onclick: () => starte(j.id),
        }, `${j.emoji} ${j.name} (${Math.min(karten(daten, j.id).length, PRO_SESSION)} Karten)`))),
      erwachsenenKarte('Im Winter schläft der Igel. Darum ist er im Winter-Deck nicht dabei – ein Igel im Schnee ist ein Notfall und kein Winterbild.')));
}

function starte(jz) {
  jahreszeit = jz;
  deck = waehleKarten(daten, jz);
  index = 0;
  karteBildschirm();
}

// -------------------------------------------------------------- Karten
function pulsReihe(karte) {
  const muster = karte.motiv.muster;
  const punkte = muster.map((an) => el('span', {
    style: 'display:inline-block;width:1.1rem;height:1.1rem;border-radius:50%;'
      + `background:${an ? 'var(--k-blau-dunkel)' : 'var(--k-rand)'};`
      + 'transition:transform 0.09s linear, opacity 0.09s linear;opacity:0.45',
  }));
  // Setzen, nicht anhängen – siehe den Hinweis zur Auswertungsreihenfolge
  // in zeige(). Pro Bildschirm gibt es genau eine Puls-Reihe.
  spuren = [punkte];
  return el('div', {
    role: 'img',
    'aria-label': `Rhythmus: ${muster.map((a) => (a ? 'Schlag' : 'Pause')).join(', ')}`,
    style: 'display:flex;gap:0.5rem;justify-content:center;align-items:center;margin:0.6rem 0',
  }, ...punkte);
}

function spiele(karte) {
  // Ein zweites Antippen darf nicht übereinander spielen: sonst laufen
  // zwei Zeitpläne gleichzeitig, der sichtbare Punkt springt zwischen
  // ihnen hin und her, und die Lautstärke addiert sich. Auf Touch ist der
  // Doppeltipp der Normalfall, nicht die Ausnahme.
  stopAlles();
  const plan = zeitplan(daten, karte, 3);
  if (!plan.length) return;
  const muster = karte.motiv.muster;
  if (mitTon) {
    const a = ton();
    const t0 = a.currentTime + 0.08;
    for (const n of plan) schlag(n.hertz, t0 + n.zeit, n.dauer, n.staerke);
  }
  // Der sichtbare Puls kommt aus DEMSELBEN Zeitplan wie der Ton – sie
  // können nicht auseinanderlaufen. Er läuft auch ohne Ton.
  const punkte = spuren[0];
  if (!punkte) return;
  const leise = wenigerBewegung();
  plan.forEach((n) => {
    const stelle = Math.round(n.zeit / (60 / tempoVon(karte.tempo).bpm)) % muster.length;
    laeuft.push(setTimeout(() => zeigePuls(punkte, stelle), n.zeit * 1000));
    // Bei „weniger Bewegung“ bleibt der Punkt gefüllt – ein Rücksetzen nach
    // jedem Schlag wäre wieder ein periodischer Wechsel. Zurückgesetzt wird
    // dort nur zum Anfang einer Runde (stelle === 0).
    if (!leise) {
      laeuft.push(setTimeout(() => zeigePuls(punkte, -1), (n.zeit + n.dauer) * 1000));
    } else if (stelle === 0 && n.zeit > 0) {
      // n.zeit > 0 ist Pflicht: beim ersten Schlag wäre die Verzögerung
      // max(0, -40) === 0, also dieselbe wie die des Füll-Timers. Timer mit
      // gleicher Verzögerung feuern in Registrierungsreihenfolge, der
      // Füll-Timer wird zuerst gepusht – der Reset hätte den ersten Schlag
      // jeder Wiedergabe sofort wieder gelöscht.
      laeuft.push(setTimeout(() => zeigePuls(punkte, -1), n.zeit * 1000 - 40));
    }
  });
}

function karteBildschirm() {
  const k = deck[index];
  const tier = k.tier ? tierVon(daten, k.tier) : null;
  const ort = ortVon(k.ort);
  const letzte = index + 1 >= deck.length;
  const vorlese = `${k.titel}. ${kindTextVon(k)} ${k.bewegungsAuftrag}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' },
        `${jzVon(jahreszeit).emoji} Karte ${index + 1} von ${deck.length}`),
      el('p', { class: 'k-gross', role: 'img', 'aria-label': k.titel }, k.zeichen),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0.2rem' }, k.titel),
      // Die Geltung steht VOR allem anderen: eine Spielabmachung darf
      // nicht wie eine Tierbeobachtung aussehen.
      el('p', {
        class: 'k-hinweis',
        style: 'text-align:center;font-weight:700;margin:0.4rem 0',
      }, k.geltung === 'naturgetreu' ? '🔍 So macht das Tier es wirklich'
        : (k.geltung === 'ausgemacht' ? '🤝 Das machen wir im Spiel so aus' : '💨 Das bewegt sich nicht selbst')),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0' }, kindTextVon(k))),
      k.wirklich
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'font-weight:700;margin-top:0' }, '🔍 Und wie ist es wirklich?'),
          el('p', { style: 'margin-bottom:0' }, k.wirklich))
        : null,
      k.impulsQuelle
        ? el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
          el('p', { style: 'margin:0' }, `👐 Den Anstoß gibst du: ${k.impulsQuelle === 'wind' ? 'der Wind' : (k.impulsQuelle === 'luft' ? 'die Luft' : 'du')} schiebt, nicht das Kind selbst.`))
        : null,
      tier?.zeichenArt === 'bewegung'
        ? el('p', { style: 'margin:0.4rem 0;font-size:0.9em' }, `👀 ${tier.zeichenGrund}`)
        : null,
      el('div', { style: 'margin-top:0.8rem;padding-top:0.6rem;border-top:1px solid var(--k-rand)' },
        el('p', { style: 'font-weight:700;margin:0' }, `🏃 ${k.bewegungsAuftrag}`),
        el('p', { style: 'margin:0.3rem 0 0' },
          `${tempoVon(k.tempo).name} · ${dynVon(k.dynamik).name} · ${artVon(k.artikulation).kindWort}`),
        el('p', { style: 'margin:0.2rem 0 0;font-size:0.95em' }, `📍 ${ort.name} – ${ort.hinweis}`)),
      pulsReihe(k),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => spiele(k) },
          mitTon ? '▶️ Impuls geben' : '▶️ Puls zeigen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(k.wortImpuls) }, '🗣️ Was du sagst'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: stopAlles }, '✋ Stopp – stehenbleiben')),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'margin:0' }, `🗣️ „${k.wortImpuls}“`),
        el('p', { style: 'margin:0.3rem 0 0' }, `👏 ${k.klatschImpuls}`)),
      erwachsenenKarte(k.erwachsenenHinweis),
      vorlesenKnopf(vorlese),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { if (letzte) schluss(); else { index += 1; karteBildschirm(); } } },
          letzte ? 'Fertig 🏁' : 'Nächste Karte ➡️'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: schluss }, '🏁 Für heute reicht es'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0;font-size:0.95em' },
        `👉 Höchstens ${PRO_SESSION} Karten. Eine Bewegung dauert eine halbe bis anderthalb Minuten – aufhören, solange es noch Spaß macht.`)));
}

// -------------------------------------------------------------- Schluss
function schluss() {
  const text = `Bildschirm aus – jetzt bewegt ihr euch ohne Gerät! ${daten.schlussIdeen.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🏃'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'das geht auch ohne Gerät!'),
      el('ul', {}, ...daten.schlussIdeen.map((i) => el('li', { style: 'margin-bottom:0.5rem' }, i))),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Vorher einmal lesen:'),
        el('ul', { style: 'margin:0;padding-left:1.2rem' },
          ...daten.sicherheit.map((s) => el('li', { style: 'margin-bottom:0.3rem' }, s)))),
      vorlesenKnopf(text),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: jahreszeitBildschirm }, '🔁 Andere Jahreszeit'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏡 Zum Start'))));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  // GELTUNGEN ist in der Anzeige vollständig abgedeckt – ein Blick in
  // karteBildschirm zeigt alle drei Fälle.
  if (GELTUNGEN.length !== 3) throw new Error('Geltungsarten und Anzeige sind auseinandergelaufen');
  gate();
}
