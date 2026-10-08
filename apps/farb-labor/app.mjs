// Farb-Labor (5-7, nur gemeinsam mit einem Erwachsenen).
// Praleska docs/10 (Ko-Nutzung Nr. 21).
//
// Zwei Orte, zwei Ergebnisse (siehe logik.mjs). Der Bildschirm zeigt bei
// Farbe nur eine VORHERSAGE und sagt das auch; gerechnet wird allein die
// Lichtmischung, und die ist nachprüfbar. Jede Farbfläche trägt ihren
// Namen, weil Farbe allein die Information nicht tragen darf.
// Politik docs/02: keine externen Anfragen.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import {
  PRO_SESSION, farbeVon, mischungVon, mischungFuer,
  offeneFarben, partnerFuer, warmKaltEinordnung, pruefeDaten,
} from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await fetch('daten/farben.json').then((r) => r.json());

let gewaehlt = [];      // bis zu zwei Farben aus dem Kasten
let fertigeMischungen = 0; // so viele Mischungen sind durch
let erreicht = [];      // selbst gemischte Farben – sie wandern in den Kasten
let ortsKarte = null;   // die Zwei-Orte-Karte dieser Sitzung

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🎨 Farb-Labor'),
    el('p', { class: 'k-untertitel' }, 'Mischen, hell und dunkel, warm und kalt – für Kind und Erwachsene.'),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · keine Namen · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
  // Nicht einfach das erste button: die schon gewählte Farbe ist
  // deaktiviert, und focus() auf einem deaktivierten Knopf tut nichts –
  // der Tastaturfokus landete dann nirgendwo.
  app.querySelector('button:not([disabled])')?.focus();
}

/** Ein Farbfleck – immer mit Namen daneben, nie Farbe allein. */
function fleck(farbe, groesse = '3.4rem') {
  return el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:0.3rem' },
    el('div', {
      role: 'img', 'aria-label': farbe.name,
      style: `width:${groesse};height:${groesse};border-radius:var(--k-radius);`
        + `background:${farbe.hex};border:3px solid var(--k-rand)`,
    }),
    el('span', { style: 'font-weight:700;text-align:center' }, farbe.name));
}

function erwachsenenKarte(text) {
  return el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
    el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Für Erwachsene – redet zusammen:'),
    el('p', { style: 'margin-bottom:0' }, text));
}

function vorlesenKnopf(text) {
  return el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => vorlesen(text) }, '🔊 Vorlesen');
}

function gate() {
  const intro = `Dieses Labor macht ihr zusammen. ${daten.ehrlichkeit} Es gibt keine Punkte.`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🧑‍🍼🧒'),
      el('p', { style: 'font-weight:700;text-align:center;font-size:1.2em' }, 'Am besten gemeinsam.'),
      el('p', {}, 'Ihr wählt zwei Farben, und die App sagt, was daraus werden müsste. Danach mischt ihr es mit echten Farben nach – und schaut, ob es stimmt.'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '💡 Was die App über sich selbst sagt:'),
        el('p', { style: 'margin-bottom:0' }, daten.ehrlichkeit)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'margin:0' }, '🖌️ Legt am besten jetzt schon Farbkasten, Pinsel, Wasser und Papier bereit.')),
      vorlesenKnopf(intro),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starte }, '👪 Wir sind zusammen – los!'))),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin:0' }, `👉 ${PRO_SESSION} Mischungen, dann ein Rätsel, dann hell und dunkel und warm und kalt – und dann wird gemalt.`)));
}

function starte() {
  gewaehlt = [];
  fertigeMischungen = 0;
  erreicht = [];
  ortsKarte = mischen(daten.zweiOrte)[0];
  waehlBildschirm();
}

// ------------------------------------------------------- Pigment mischen
function waehlBildschirm() {
  // Der Kasten wächst: eine selbst gemischte Farbe, mit der es
  // weitergeht, liegt danach mit drin. Sonst wäre „Rot und Grün gibt
  // Braun“ nie erreichbar – Grün liegt nicht im Kasten (siehe logik.mjs).
  const kasten = offeneFarben(daten, erreicht).map((id) => farbeVon(daten, id));
  const ersteWahl = gewaehlt[0] ?? null;
  // Angeboten wird nur, wofür es ein geprüftes Ergebnis gibt – ein Kind
  // soll nicht in eine Sackgasse laufen.
  const moeglich = ersteWahl ? new Set(partnerFuer(daten, ersteWahl, kasten.map((f) => f.id))) : null;
  const frage = ersteWahl ? 'Und welche kommt dazu?' : 'Welche Farbe nimmst du zuerst?';
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-untertitel' }, `Mischung ${fertigeMischungen + 1} von ${PRO_SESSION}`),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, frage),
      el('p', { style: 'text-align:center;margin-top:0' },
        // Nur behaupten, was stimmt: Orange und Violett wandern NICHT in
        // den Kasten (mit ihnen wird hier nicht weitergemischt). Geprüft
        // wird also der Kasten selbst, nicht die Zahl der Mischungen.
        kasten.length > daten.grundfarben.length
          ? 'Eine selbst gemischte Farbe liegt jetzt mit im Kasten.'
          : 'Diese drei liegen im Kasten – aus ihnen machst du viele andere.'),
      el('div', {
        role: 'group', 'aria-label': 'Farbe wählen',
        style: 'display:flex;flex-wrap:wrap;gap:0.8rem;justify-content:center;margin:1rem 0',
      }, ...kasten.map((f) => {
        const schonGewaehlt = gewaehlt.includes(f.id);
        const aus = ersteWahl ? (schonGewaehlt || !moeglich.has(f.id)) : false;
        return el('button', {
          class: 'k-knopf k-knopf--neutral',
          style: 'min-height:4.5rem;display:flex;align-items:center;gap:0.6rem',
          disabled: aus ? '' : null,
          // Zwei verschiedene Gründe, zwei verschiedene Sätze.
          'aria-label': !aus ? f.name
            : (schonGewaehlt ? `${f.name} – die hast du schon` : `${f.name} – dafür gibt es hier keine Mischung`),
          onclick: () => waehle(f.id),
        }, el('span', {
          role: 'img', 'aria-label': f.name,
          style: `display:inline-block;width:2rem;height:2rem;border-radius:0.4rem;background:${f.hex};border:2px solid var(--k-rand)`,
        }), el('span', {}, f.name));
      })),
      gewaehlt.length
        ? el('div', { class: 'k-hinweis' },
          el('p', { style: 'margin:0' }, `Gewählt: ${gewaehlt.map((id) => farbeVon(daten, id).name).join(' und ')}`))
        : null,
      vorlesenKnopf(`${frage} ${kasten.map((f) => f.name).join(', ')}.`),
      gewaehlt.length
        ? el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { gewaehlt = []; waehlBildschirm(); } }, '↩️ Von vorn wählen'))
        : null));
}

function waehle(id) {
  if (gewaehlt.includes(id)) return;
  gewaehlt = [...gewaehlt, id];
  if (gewaehlt.length < 2) { waehlBildschirm(); return; }
  const m = mischungFuer(daten, gewaehlt[0], gewaehlt[1]);
  if (m) ergebnisBildschirm(m);
  else keinePaarung();
}

// Alle drei Paare der Grundfarben stehen in den Daten – dieser Fall kann
// nur eintreten, wenn jemand die Daten kürzt. Dann wird nichts erfunden.
function keinePaarung() {
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🤔'),
      el('p', { style: 'text-align:center;font-weight:700' }, 'Dieses Paar steht nicht im Labor.'),
      el('p', {}, 'Die App denkt sich keine Mischung aus – sie zeigt nur, was geprüft ist. Probiert ein anderes Paar.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => { gewaehlt = []; waehlBildschirm(); } }, '↩️ Noch einmal wählen'))));
}

function ergebnisBildschirm(m) {
  // Gezählt werden fertige Mischungen, nicht verschiedene: wer dasselbe
  // Paar zweimal nimmt, kommt sonst nie zum Ende.
  fertigeMischungen += 1;
  if (!erreicht.includes(m.ergebnis)) erreicht = [...erreicht, m.ergebnis];
  const zutaten = m.aus.map((id) => farbeVon(daten, id));
  const ergebnis = farbeVon(daten, m.ergebnis);
  const fertig = fertigeMischungen >= PRO_SESSION;
  const text = `${zutaten.map((f) => f.name).join(' und ')} geben ${ergebnis.name}. ${m.wasPassiert} ${m.wennAnders}`;
  const sprachen = [ergebnis, ...zutaten].filter((f) => f.sprachHinweis);
  zeige(
    el('section', { class: 'k-karte' },
      el('div', { style: 'display:flex;align-items:center;justify-content:center;gap:0.6rem;flex-wrap:wrap;margin-bottom:0.8rem' },
        fleck(zutaten[0]),
        el('span', { style: 'font-size:2rem;font-weight:700' }, '+'),
        fleck(zutaten[1]),
        el('span', { style: 'font-size:2rem;font-weight:700' }, '='),
        fleck(ergebnis, '4.4rem')),
      // Der Fleck ist eine Vorhersage, keine Messung – und das steht dabei.
      el('p', { style: 'text-align:center;font-weight:700;margin:0' }, `So ungefähr wird es: ${ergebnis.name}`),
      el('p', { style: 'text-align:center;margin-top:0.2rem' }, 'Genau siehst du es erst auf dem Papier.'),
      el('div', { class: 'k-hinweis k-hinweis--richtig' },
        el('p', { style: 'margin:0' }, m.wasPassiert)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '⚖️ Es gibt nicht „das“ eine Ergebnis:'),
        el('p', { style: 'margin-bottom:0' }, `Es kommt auf die Menge an – ${m.mengeAendert}.`)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '🖌️ Jetzt ihr:'),
        el('p', { style: 'margin:0' }, `Mischt ${ergebnis.name} aus ${zutaten.map((f) => f.name).join(' und ')}.`),
        el('p', { style: 'margin:0.3rem 0 0' }, m.wennAnders)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'margin:0' }, `🔎 Für später, wenn der Bildschirm aus ist: ${m.suchauftrag}`)),
      erwachsenenKarte(`${m.gespraech} (Der Wert hier gilt für ${m.giltFuer}. ${daten.herkunftDerWerte})`),
      el('div', { style: 'margin-top:0.6rem' },
        el('p', { style: 'margin:0;font-size:0.95em' },
          `🗣️ ${ergebnis.name} · ${ergebnis.ukName} (uk) · ${ergebnis.ruName} (ru)`),
        ...sprachen.map((f) => el('p', { style: 'margin:0.3rem 0 0;font-size:0.95em' }, `💬 ${f.sprachHinweis}`))),
      vorlesenKnopf(text),
      el('div', { class: 'k-antworten' },
        el('button', {
          class: 'k-knopf',
          onclick: () => { gewaehlt = []; if (fertig) ortsBildschirm(); else waehlBildschirm(); },
        }, fertig ? 'Weiter zum Rätsel ➡️' : 'Noch eine Mischung ➡️'))));
}

// ------------------------------------------------- Zwei Orte, zwei Ergebnisse
// Das Herzstück. Dieselben zwei Farben, zwei Orte – und die App stellt
// die Frage, bevor sie antwortet. Es gibt hier keine falsche Antwort:
// beide Ergebnisse sind richtig, nur an verschiedenen Orten.
function ortsBildschirm() {
  const o = ortsKarte;
  const l = mischungVon(daten, o.lichtMischung);
  const p = mischungVon(daten, o.pigmentMischung);
  const zutaten = p.aus.map((id) => farbeVon(daten, id));
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🤔'),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, o.frage),
      el('div', { style: 'display:flex;align-items:center;justify-content:center;gap:0.6rem;margin:0.8rem 0' },
        fleck(zutaten[0]), el('span', { style: 'font-size:2rem;font-weight:700' }, '+'), fleck(zutaten[1])),
      el('p', { style: 'text-align:center;margin:0' }, 'Ratet erst zusammen. Dann tippt weiter.'),
      vorlesenKnopf(`${o.frage} Ratet erst zusammen.`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => ortsAufloesung(o, l, p) }, 'Auflösung zeigen ➡️'))));
}

function ortsAufloesung(o, l, p) {
  const seite = (titel, zeichen, m, satz) => el('div', {
    style: 'flex:1 1 9rem;min-width:9rem;padding:0.6rem;border:3px solid var(--k-rand);border-radius:var(--k-radius)',
  },
    el('p', { style: 'font-weight:700;margin:0 0 0.4rem;text-align:center' }, `${zeichen} ${titel}`),
    el('div', { style: 'display:flex;justify-content:center' }, fleck(farbeVon(daten, m.ergebnis), '3rem')),
    el('p', { style: 'margin:0.4rem 0 0' }, satz));
  const text = `${o.aufloesung} ${l.wasPassiert} ${p.wasPassiert}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🖥️🎨'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, 'Beide Antworten sind richtig!'),
      el('div', { style: 'display:flex;gap:0.6rem;flex-wrap:wrap;margin:0.8rem 0' },
        seite('Auf dem Bildschirm', '🖥️', l, l.wasPassiert),
        seite('Im Farbkasten', '🎨', p, p.wasPassiert)),
      el('div', { class: 'k-hinweis k-hinweis--richtig' },
        el('p', { style: 'margin:0' }, o.aufloesung)),
      el('div', { class: 'k-hinweis', style: 'margin-top:0.6rem' },
        el('p', { style: 'margin:0' }, '👉 Wer das weiß, lässt sich vom Bildschirm nicht mehr ärgern: für dein Papier gilt immer der Farbkasten.')),
      erwachsenenKarte(o.gespraech),
      vorlesenKnopf(text),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: hellDunkelBildschirm }, 'Weiter ➡️'))));
}

// --------------------------------------------------------- hell/dunkel
// Alle drei Karten auf EINEM Bildschirm: „heller“ geht auf zwei ganz
// verschiedene Weisen (Weiß dazu / weniger Farbe aufs Papier). Würde die
// App pro Sitzung nur eine zeigen, wäre genau dieser Unterschied
// manchmal nicht zu sehen.
function hellDunkelBildschirm() {
  const karte = (h) => el('div', { style: 'margin:0.8rem 0;padding-top:0.6rem;border-top:1px solid var(--k-rand)' },
    el('p', { style: 'font-weight:700;margin:0' }, `${h.richtung === 'heller' ? '🌕' : '🌑'} ${h.titel}`),
    el('p', { style: 'margin:0.3rem 0' }, h.wasPassiert),
    el('p', { style: 'margin:0;font-weight:700' }, `Womit: ${h.mittel} · gilt für ${h.nurBei}`),
    el('p', { style: 'margin:0.3rem 0 0;font-size:0.95em' }, `👪 ${h.gespraech}`));
  const text = daten.hellDunkel.map((h) => `${h.titel}. ${h.wasPassiert}`).join(' ');
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🌕🌑'),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, 'Heller und dunkler'),
      el('p', { style: 'text-align:center;margin-top:0' }, 'Heller geht auf zwei Wege – schaut nach, was ihr dahabt.'),
      ...daten.hellDunkel.map(karte),
      vorlesenKnopf(text),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: warmKaltBildschirm }, 'Weiter ➡️'))));
}

// ----------------------------------------------------------- warm/kalt
// Kein Quiz: Es gibt hier nichts zu treffen. Diese Funktion kennt gar
// keinen Begriff von „richtig“ – genauso wie die Geschmacksfragen im
// Design-Entdecker.
function warmKaltBildschirm() {
  const wk = daten.warmKalt;
  // Die Zuordnung kommt aus EINER Funktion, nicht aus drei Listen im
  // Anzeigecode: so koennen Anzeige und Logik nicht auseinanderlaufen.
  const nach = (art) => daten.farben
    .filter((f) => f.traeger === 'pigment' && warmKaltEinordnung(daten, f.id) === art);
  const reihe = (art, titel, zeichen) => {
    const farben = nach(art);
    return farben.length
      ? el('div', { style: 'margin:0.8rem 0' },
        el('p', { style: 'font-weight:700;margin:0 0 0.4rem' }, `${zeichen} ${titel}`),
        el('div', { style: 'display:flex;gap:0.6rem;flex-wrap:wrap' },
          ...farben.map((f) => fleck(f, '2.6rem'))))
      : null;
  };
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🔥❄️'),
      el('p', { style: 'font-weight:700;font-size:1.25em;text-align:center' }, 'Warme und kalte Farben'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '🤝 Das haben Menschen so ausgemacht:'),
        el('p', { style: 'margin-bottom:0' }, wk.erklaerung)),
      reihe('warm', 'Nennt man warm', '🔥'),
      reihe('kalt', 'Nennt man kalt', '❄️'),
      reihe('strittig', 'Darüber ist man sich nicht einig', '🤔'),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'margin:0' }, wk.strittig)),
      erwachsenenKarte(wk.gespraech),
      vorlesenKnopf(`Warme und kalte Farben. ${wk.erklaerung} ${wk.strittig}`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: grenzBildschirm }, 'Weiter ➡️'))));
}

// --------------------------------------------- was sich NICHT mischen lässt
// „Aus den drei Grundfarben kann man alle Farben mischen“ ist falsch.
// Die App stellt es selbst richtig, statt es stehen zu lassen.
function grenzBildschirm() {
  const nm = daten.nichtMischbar;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🚫'),
      el('p', { style: 'font-weight:700;font-size:1.2em;text-align:center' }, nm.satz),
      el('ul', {}, ...nm.beispiele.map((b) => el('li', { style: 'margin-bottom:0.4rem' }, b))),
      erwachsenenKarte(nm.gespraech),
      vorlesenKnopf(`${nm.satz} ${nm.beispiele.join(' ')}`),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: schluss }, 'Weiter ➡️'))));
}

// -------------------------------------------------------------- Schluss
function schluss() {
  const auftraege = daten.malauftraege;
  const text = `Bildschirm aus – jetzt wird gemalt! ${auftraege.join(' ')}`;
  zeige(
    el('section', { class: 'k-karte' },
      el('p', { class: 'k-gross' }, '🖌️'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-bottom:0' }, 'Bildschirm aus –'),
      el('p', { style: 'font-weight:700;font-size:1.3em;text-align:center;margin-top:0' }, 'jetzt wird gemalt!'),
      el('p', { style: 'text-align:center' }, 'Auf dem Bildschirm war es nur Licht. Jetzt kommt die Farbe:'),
      el('ul', {}, ...auftraege.map((a) => el('li', { style: 'margin-bottom:0.5rem' }, a))),
      el('div', { class: 'k-hinweis' },
        el('p', { style: 'font-weight:700;margin-top:0' }, '👪 Erwachsene, vorher einmal lesen:'),
        el('ul', { style: 'margin:0;padding-left:1.2rem' }, ...daten.sicherheit.map((s) => el('li', { style: 'margin-bottom:0.3rem' }, s)))),
      vorlesenKnopf(text),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: starte }, '🔁 Noch einmal mischen'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: gate }, '🏡 Zum Start'))));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  gate();
}
