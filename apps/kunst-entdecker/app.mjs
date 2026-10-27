// Kunst-Entdecker (5-7 in Ko-Nutzung, Ausbau 8-12): Gattungen und Genres
// an eingebetteten gemeinfreien Werken erkennen, dazu eine Galerie zum
// Anschauen. Praleska docs/10 (Kinder-Apps Nr. 21).
// Alle Bilder liegen als data-URI in den Daten (CC0, Met Open Access) –
// die App lädt nichts nach. Politik docs/02: keine externen Anfragen,
// werbefrei, es wird nichts gespeichert; das Kind wird nicht bewertet.
import { el, vorlesen, mischen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { boot as bootAnzeige } from '../../packages/kinder-ui/js/anzeige.mjs';
import { TAFEL, ratbareWerke, gattungVon, genreVon, baueFrage, istRichtig, pruefeDaten } from './logik.mjs';

installiereNetzwerkWaechter();
bootAnzeige();

const app = document.getElementById('app');
const daten = await fetch('daten/werke.json').then((r) => r.json());
const zufall = (liste) => liste[Math.floor(Math.random() * liste.length)];
const tafel = daten.werke.find((w) => w.gattung === TAFEL);

let modus = 'galerie';
let offenes = null;
let frage = null;
let antwort = null;

function bildKachel(w, breite = '100%') {
  return el('img', {
    src: w.bild,
    width: String(w.breite),
    height: String(w.hoehe),
    alt: `${w.titel} von ${w.kuenstler}`,
    style: `width:${breite};max-width:${w.breite}px;height:auto;display:block;margin:0 auto;`
      + 'border:1px solid var(--k-rand);border-radius:0.4rem;background:#fff',
  });
}

function herkunft(w) {
  return el('p', { style: 'font-size:0.85em;margin:0.4rem 0 0;opacity:0.85' },
    `${w.kuenstler}, „${w.titel}“, ${w.jahr}. ${w.quelle.einrichtung}, Inv. ${w.quelle.objektnummer}, ${w.quelle.lizenz}.`);
}

function zeige(...knoten) {
  app.replaceChildren(...[
    el('h1', { class: 'k-titel' }, '🎨 Kunst-Entdecker'),
    el('p', { class: 'k-untertitel' }, 'Was ist das für ein Bild – und was ist darauf zu sehen?'),
    el('div', { class: 'k-antworten', role: 'group', 'aria-label': 'Modus' },
      ...[['galerie', '🖼️ Galerie'], ['gattung', '❓ Welche Gattung?'], ['genre', '❓ Welches Genre?']].map(([id, name]) =>
        el('button', {
          class: `k-knopf k-knopf--klein ${modus === id ? '' : 'k-knopf--neutral'}`,
          'aria-pressed': String(modus === id),
          // Laufende Frage verwerfen, sonst bliebe eine schon beantwortete
          // Frage nach dem Moduswechsel erneut anklickbar.
          onclick: () => { modus = id; frage = null; antwort = null; render(); },
        }, name))),
    ...knoten,
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werbefrei · ohne Anmeldung · offline · nichts wird gespeichert · '),
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'), el('span', {}, ' · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')),
  ].filter(Boolean));
}

// ---------- Modus 1: Galerie ----------
function galerieKarten() {
  const werk = offenes ? daten.werke.find((w) => w.id === offenes) : null;
  return [
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Neun Werke aus einem echten Museum. Tippe eines an, dann siehst du es groß und erfährst, worauf sich das Hinsehen lohnt.'),
      el('div', {
        role: 'group',
        'aria-label': 'Werke',
        style: 'display:grid;grid-template-columns:repeat(auto-fill,minmax(5.5rem,1fr));gap:0.5rem',
      }, ...daten.werke.map((w) => el('button', {
        class: 'k-knopf k-knopf--neutral',
        style: `padding:0.25rem;${offenes === w.id ? 'outline:3px solid var(--k-tinte);outline-offset:2px' : ''}`,
        'aria-pressed': String(offenes === w.id),
        'aria-label': `${w.titel} von ${w.kuenstler}`,
        onclick: () => { offenes = offenes === w.id ? null : w.id; render(); },
      }, el('img', {
        src: w.bild,
        alt: '',
        style: 'width:100%;aspect-ratio:1;object-fit:cover;border-radius:0.3rem;display:block',
      }))))),
    werk
      ? el('section', { class: 'k-karte' },
        bildKachel(werk),
        el('h2', { style: 'font-size:1.1rem;margin:0.6rem 0 0.2rem' }, werk.titel),
        el('p', { style: 'margin:0;font-weight:700' },
          werk.gattung === TAFEL
            ? `${daten.architektur.emoji} ${daten.architektur.name}`
            : `${gattungVon(daten, werk.gattung).emoji} ${gattungVon(daten, werk.gattung).name}${werk.genre ? ` · ${genreVon(daten, werk.genre).emoji} ${genreVon(daten, werk.genre).name}` : ''}`),
        el('p', { style: 'margin:0.5rem 0 0' }, werk.hinsehen),
        werk.gattung === TAFEL ? el('p', { class: 'k-hinweis', style: 'margin-top:0.6rem' }, daten.architektur.hinweis) : null,
        el('button', {
          class: 'k-knopf k-knopf--neutral k-knopf--klein',
          style: 'margin-top:0.5rem',
          onclick: () => vorlesen(`${werk.titel}, von ${werk.kuenstler}. ${werk.hinsehen}`),
        }, '🔊 Vorlesen'),
        herkunft(werk))
      : el('section', { class: 'k-karte' },
        el('h2', { style: 'margin-top:0;font-size:1.05rem' }, `${daten.architektur.emoji} Und die vierte Gattung?`),
        el('p', { style: 'margin:0' }, daten.architektur.merkmal)),
  ];
}

// ---------- Modus 2 und 3: Raten ----------
function neueFrage() {
  frage = baueFrage(daten, modus, zufall, mischen, frage);
  antwort = null;
  render();
}

function antworte(sorte) {
  antwort = sorte;
  render();
}

function rateKarten() {
  const sorteName = modus === 'gattung' ? 'Gattung' : 'Genre';
  if (!frage) {
    const liste = modus === 'gattung' ? daten.gattungen : daten.genres;
    return [
      el('section', { class: 'k-karte' },
        el('p', { style: 'margin-top:0' }, modus === 'gattung'
          ? 'Die Gattung sagt, womit ein Werk gemacht ist: gemalt, gedruckt oder geformt.'
          : 'Das Genre sagt, was darauf zu sehen ist: ein Mensch, eine Gegend oder Dinge.'),
        el('ul', { style: 'margin:0.4rem 0;padding-left:1.2rem' },
          ...liste.map((s) => el('li', {}, el('strong', {}, `${s.emoji} ${s.name}: `), s.merkmal))),
        el('div', { class: 'k-antworten' },
          el('button', { class: 'k-knopf', onclick: neueFrage }, `❓ Erstes Werk`))),
    ];
  }
  const w = frage.werk;
  const loesung = modus === 'gattung' ? gattungVon(daten, w.gattung) : genreVon(daten, w.genre);
  return [
    el('section', { class: 'k-karte' },
      bildKachel(w, '85%'),
      el('p', { style: 'font-weight:700;text-align:center;margin:0.6rem 0 0.3rem' }, `Welche ${sorteName} ist das?`),
      el('button', {
        class: 'k-knopf k-knopf--neutral k-knopf--klein',
        onclick: () => vorlesen(`Welche ${sorteName} ist das? ${frage.optionen.map((s) => s.name).join('. Oder: ')}`),
      }, '🔊 Vorlesen'),
      el('div', { class: 'k-antworten', role: 'group', 'aria-label': `${sorteName} wählen` },
        ...(antwort
          ? [el('button', { class: 'k-knopf', onclick: neueFrage }, 'Nächstes Werk ➡️')]
          : frage.optionen.map((s) => el('button', {
            class: 'k-knopf k-knopf--neutral',
            onclick: () => antworte(s),
          }, `${s.emoji} ${s.name}`)))),
      antwort
        ? el('div', { class: `k-hinweis${istRichtig(frage, antwort.id) ? ' k-hinweis--richtig' : ''}` },
          el('p', { style: 'font-weight:700;margin-top:0' },
            `${istRichtig(frage, antwort.id) ? '👍 Richtig' : '💭 Schau nochmal'} – ${loesung.emoji} ${loesung.name}`),
          el('p', { style: 'margin:0 0 0.4rem' }, loesung.merkmal),
          el('p', { style: 'margin:0' }, w.hinsehen))
        : null,
      antwort ? herkunft(w) : null),
  ];
}

function render() {
  zeige(...(modus === 'galerie' ? galerieKarten() : rateKarten()).filter(Boolean));
}

const fehler = pruefeDaten(daten);
if (fehler.length) {
  app.replaceChildren(el('div', { class: 'k-hinweis k-hinweis--falsch' }, el('p', { style: 'margin:0' }, `Datenfehler: ${fehler[0]}`)));
} else {
  render();
}
