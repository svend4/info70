// Kita-Familien-Brücke (Erzieher*innen / Kita-Leitung): Team-Selbstcheck
// Erziehungspartnerschaft – 12 Kriterien in 4 Bereichen, Ampel-Auswertung,
// Maßnahmenkatalog und druckbarer Team-Bericht. Bewertet wird die eigene
// TEAMPRAXIS – niemals einzelne Familien, Eltern oder Kinder. Am besten
// gemeinsam in der Teamsitzung durchgehen. Praleska docs/10 (Top-30 Nr. 30).
// Politik docs/02: keine externen Anfragen, speichert nichts.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { alleKriterien, bewerte, massnahmenKatalog, pruefeKriterien } from './logik.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const daten = await (await fetch('daten/kriterien.json')).json();
const KRITERIEN = alleKriterien(daten.bereiche);

const AMPEL = {
  gruen: { emoji: '🟢', text: 'läuft gut' },
  gelb: { emoji: '🟡', text: 'auf dem Weg' },
  rot: { emoji: '🔴', text: 'braucht Aufmerksamkeit' },
};

let phase = 'intro';   // intro | check | ergebnis
let index = 0;
let antworten = {};

function fusszeile() {
  return el('footer', { class: 'k-fuss kfb-nur-bildschirm' },
    el('span', {}, 'Werkzeug für Kita-Teams · bewertet Teampraxis, nie Familien oder Kinder · nichts wird gespeichert · '),
    el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
    el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz'));
}

function introKarte() {
  return el('section', { class: 'k-karte kfb-nur-bildschirm' },
    el('p', { style: 'margin-top:0' }, el('strong', {}, 'Erziehungspartnerschaft'), ' – die Zusammenarbeit von Kita und Familien auf Augenhöhe – ist in allen Landes-Bildungsplänen als fachlicher Standard beschrieben. Dieser Selbstcheck hilft dem Team, die eigene Praxis ehrlich anzuschauen: Wie gut kennen wir die Familien? Wie informieren und beteiligen wir sie? Und mit welcher Haltung sprechen wir über sie?'),
    el('ul', { style: 'margin:0.4rem 0;padding-left:1.2rem' },
      el('li', {}, el('strong', {}, '12 Aussagen in 4 Bereichen'), ' – je Aussage: Trifft zu / Teilweise / Noch nicht.'),
      el('li', {}, el('strong', {}, 'Am besten gemeinsam'), ' in der Teamsitzung besprechen – der Weg zur Antwort ist wertvoller als die Ampel.'),
      el('li', {}, el('strong', {}, 'Ergebnis:'), ' Ampel je Bereich, Maßnahmen-Vorschläge und ein druckbarer Team-Bericht.')),
    el('p', { class: 'k-hinweis', style: 'margin:0.4rem 0' }, '🛡️ Bewertet wird ausschließlich die eigene Teampraxis – niemals einzelne Familien, Eltern oder Kinder. Es wird nichts gespeichert oder übertragen.'),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf', onclick: () => { phase = 'check'; index = 0; antworten = {}; render(); } }, '🚀 Selbstcheck starten')));
}

function checkKarte() {
  const k = KRITERIEN[index];
  return el('section', { class: 'k-karte kfb-nur-bildschirm' },
    el('p', { style: 'margin:0;color:#6b7280;font-size:0.9rem' }, `${k.bereichEmoji} ${k.bereichName} · Aussage ${index + 1} von ${KRITERIEN.length}`),
    el('p', { style: 'margin:0.4rem 0;font-weight:700;font-size:1.05rem' }, k.these),
    el('p', { style: 'margin:0.2rem 0 0;font-size:0.9rem;color:#4b5563' }, 'Woran erkennbar:'),
    el('ul', { style: 'margin:0.15rem 0 0.5rem;padding-left:1.2rem;font-size:0.9rem;color:#4b5563' },
      ...k.woran.map((w) => el('li', {}, w))),
    el('div', { class: 'k-antworten' },
      ...daten.skala.map((s) => {
        const gewaehlt = antworten[k.id] === s.wert;
        return el('button', {
          class: 'k-knopf' + (gewaehlt ? '' : ' k-knopf--neutral'),
          'aria-pressed': String(gewaehlt),
          onclick: () => {
            antworten[k.id] = s.wert;
            if (index + 1 < KRITERIEN.length) { index += 1; } else { phase = 'ergebnis'; }
            render();
          },
        }, `${s.emoji} ${s.text}`);
      })),
    index > 0 ? el('div', { class: 'k-antworten', style: 'margin-top:0.3rem' },
      el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => { index -= 1; render(); } }, '◀ zurück')) : null);
}

function ergebnisKarten() {
  const e = bewerte(antworten, daten.bereiche);
  const katalog = massnahmenKatalog(antworten, daten.bereiche);
  const gesamt = AMPEL[e.gesamt.ampel];
  return [
    el('section', { class: 'k-karte kfb-nur-bildschirm' },
      el('h2', { style: 'margin:0 0 0.3rem;font-size:1.05rem' }, '🚦 Auswertung'),
      el('p', { style: 'margin:0;font-weight:700;font-size:1.1rem' }, `${gesamt.emoji} Gesamt: ${e.gesamt.punkte} von ${e.gesamt.max} Punkten – ${gesamt.text}`),
      el('ul', { style: 'margin:0.4rem 0 0;padding-left:1.2rem' },
        ...e.jeBereich.map((b) => el('li', { style: 'margin:0.15rem 0' }, `${AMPEL[b.ampel].emoji} ${b.emoji} ${b.name}: ${b.punkte}/${b.max} – ${AMPEL[b.ampel].text}`))),
      el('p', { style: 'margin:0.5rem 0 0;font-size:0.9rem;color:#4b5563' }, 'Die Ampel ist ein Gesprächsanlass, kein Zeugnis: Entscheidend ist, was das Team daraus macht.')),
    katalog.length ? el('section', { class: 'k-karte kfb-nur-bildschirm' },
      el('h2', { style: 'margin:0 0 0.3rem;font-size:1.05rem' }, '🧰 Maßnahmen-Vorschläge'),
      el('p', { style: 'margin:0 0 0.3rem;font-size:0.9rem;color:#4b5563' }, 'Für jede Aussage mit „Teilweise“ oder „Noch nicht“ – als Ideen, nicht als Pflicht. Tipp: höchstens 2–3 Maßnahmen je Runde auswählen.'),
      ...katalog.map((m) => el('div', { style: 'border:1px solid #e5e7eb;border-radius:0.6rem;padding:0.5rem;margin-top:0.4rem' },
        el('p', { style: 'margin:0;font-weight:600;font-size:0.95rem' }, `${m.bereichEmoji} ${m.these}`),
        el('ul', { style: 'margin:0.2rem 0 0;padding-left:1.2rem;font-size:0.9rem' },
          ...m.massnahmen.map((x) => el('li', { style: 'margin:0.1rem 0' }, x)))))) : null,
    el('section', { class: 'k-karte kfb-nur-bildschirm' },
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Team-Bericht drucken'),
        el('button', { class: 'k-knopf k-knopf--neutral', onclick: () => { phase = 'intro'; antworten = {}; index = 0; render(); } }, '🔄 Neu starten'))),
    berichtKarte(e, katalog),
  ];
}

// Druckbarer Team-Bericht (nur im Druck sichtbar formatiert; auf dem
// Bildschirm als Vorschau am Seitenende).
function berichtKarte(e, katalog) {
  const gesamt = AMPEL[e.gesamt.ampel];
  return el('section', { class: 'k-karte kfb-blatt' },
    el('p', { style: 'margin:0;font-weight:700;font-size:1.15rem' }, '🤝 Team-Bericht: Selbstcheck Erziehungspartnerschaft'),
    el('p', { style: 'margin:0.2rem 0 0;color:#6b7280' }, 'Kita/Team: ______________ · Datum: __________ · Anwesend: ______________'),
    el('p', { style: 'margin:0.5rem 0 0;font-weight:600' }, `Gesamt: ${gesamt.emoji} ${e.gesamt.punkte}/${e.gesamt.max} Punkte (${gesamt.text})`),
    el('ul', { style: 'margin:0.2rem 0 0;padding-left:1.2rem' },
      ...e.jeBereich.map((b) => el('li', { style: 'margin:0.1rem 0' }, `${AMPEL[b.ampel].emoji} ${b.name}: ${b.punkte}/${b.max}`))),
    el('p', { style: 'margin:0.5rem 0 0;font-weight:600' }, 'Das nehmen wir uns vor (höchstens 2–3 Maßnahmen):'),
    ...(katalog.length
      ? katalog.slice(0, 6).map((m) => el('p', { style: 'margin:0.25rem 0 0;font-size:0.92rem' },
        `☐ ${m.bereichEmoji} ${m.massnahmen[0]} `, el('span', { style: 'color:#6b7280' }, '· Verantwortlich: ________ · Bis: ________')))
      : [el('p', { style: 'margin:0.25rem 0 0' }, 'Alle Bereiche im grünen Bereich – dranbleiben und den Check im Jahresplan wiederholen.')]),
    el('p', { style: 'margin:0.3rem 0 0;font-size:0.92rem' }, '☐ Eigene Idee: ________________________________________'),
    el('p', { style: 'margin:0.5rem 0 0;font-size:0.8rem;color:#6b7280' }, 'info70-Team-Bericht · frei nutzbar (OER) · bewertet Teampraxis, nie Familien oder Kinder · nichts wurde digital gespeichert'));
}

function render() {
  const kinder = [
    el('h1', { class: 'k-titel kfb-nur-bildschirm' }, '🤝 Kita-Familien-Brücke'),
    el('p', { class: 'k-untertitel kfb-nur-bildschirm' }, 'Team-Selbstcheck Erziehungspartnerschaft – kennen, informieren, beteiligen, Haltung'),
  ];
  if (phase === 'intro') kinder.push(introKarte());
  if (phase === 'check') kinder.push(checkKarte());
  if (phase === 'ergebnis') kinder.push(...ergebnisKarten());
  if (phase !== 'ergebnis') {
    // Sonst wäre ein Ausdruck (Strg+P) vor der Auswertung komplett leer.
    kinder.push(el('p', { class: 'kfb-nur-druck' }, 'Team-Bericht: erst nach Abschluss des Selbstchecks druckbar – den Selbstcheck im Browser abschließen, dann drucken.'));
  }
  kinder.push(fusszeile());
  app.replaceChildren(...kinder.filter(Boolean));
}

const fehler = pruefeKriterien(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
