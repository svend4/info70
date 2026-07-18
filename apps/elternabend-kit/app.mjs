// Elternabend-Kit "Digital daheim" (docs/09 Nr. 24): komplettes Material fuer
// einen 60-Minuten-Elternabend. Zielgruppe: Lehrkraefte/Fachkraefte als
// Moderation, Eltern als Publikum. Drei Teile:
//   1) Moderations-Ansicht (Agenda, Module, Demo-Drehbuecher, Karten)
//   2) Folien-Modus fuer den Beamer (grosse Schrift, Weiter/Zurueck)
//   3) Handout dreisprachig de/uk/ru -> eigene Seite handout.html
// Politik: keine externen Anfragen, speichert NICHTS.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const kit = await fetch('daten/kit.json').then((r) => r.json());

function zeige(...knoten) {
  app.replaceChildren(...knoten);
}

function kopf() {
  return [
    el('h1', { class: 'k-titel' }, '🏠 Elternabend-Kit „Digital daheim“'),
    el('p', { class: 'k-untertitel' }, '60 Minuten, fertig vorbereitet – für Lehrkräfte und Elternvertretungen'),
  ];
}

function fuss() {
  return el('footer', { class: 'k-fuss' },
    el('span', {}, 'Material für Erwachsene · diese Seite speichert nichts · '),
    el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz'));
}

// ---------- Folien-Modus ----------

function folien() {
  const f = [
    { titel: '🏠 Digital daheim', punkte: ['Ein Abend über das Netz unserer Kinder', 'Ohne Panik. Ohne Vorträge über „die Jugend von heute“.', 'Mit Dingen, die Sie diese Woche umsetzen können.'] },
    ...kit.module.map((m) => ({
      titel: `${m.emoji} ${m.titel}`,
      punkte: m.folienPunkte,
      demo: m.demoApp ? `💻 Live-Demo: ${m.demoApp}` : null,
    })),
    { titel: '🗣️ Ihre Runde', punkte: kit.diskussionskarten.slice(0, 3).map((k) => k.frage) },
    { titel: '💛 Wenn etwas passiert ist', punkte: kit.hilfen },
    { titel: '🎯 Zum Mitnehmen', punkte: ['Eine Sache aussuchen und diese Woche ausprobieren.', 'Das Handout gibt es auf Deutsch, Englisch, Ukrainisch und Russisch.', 'Danke, dass Sie da waren!'] },
  ];
  let i = 0;

  function folieZeigen() {
    const aktuelle = f[i];
    zeige(
      el('section', { class: 'k-karte', style: 'min-height:70vh;display:flex;flex-direction:column;justify-content:center;text-align:center;cursor:pointer', onclick: weiter },
        el('h1', { style: 'font-size:2.2rem;margin:0 0 1.5rem' }, aktuelle.titel),
        ...aktuelle.punkte.map((p) => el('p', { style: 'font-size:1.35rem;margin:0.6rem 0' }, p)),
        aktuelle.demo ? el('p', { style: 'font-size:1.1rem;margin-top:1.5rem;color:var(--k-blau-dunkel);font-weight:700' }, aktuelle.demo) : ''),
      el('div', { class: 'k-antworten', style: 'flex-direction:row;justify-content:center' },
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: (ev) => { ev.stopPropagation(); zurueck(); } }, '⬅️ Zurück'),
        el('span', { style: 'align-self:center;font-size:0.9rem;color:#4b5563' }, `${i + 1} / ${f.length}`),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { ev.stopPropagation(); weiter(); } }, 'Weiter ➡️'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: (ev) => { ev.stopPropagation(); moderationsBildschirm(); } }, '✕ Beenden')));
  }

  function weiter() { if (i < f.length - 1) { i++; folieZeigen(); } else moderationsBildschirm(); }
  function zurueck() { if (i > 0) { i--; folieZeigen(); } }

  folieZeigen();
}

// ---------- Moderations-Ansicht ----------

function moderationsBildschirm() {
  const gesamt = kit.agenda.reduce((s, a) => s + a.minuten, 0);
  zeige(
    ...kopf(),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, 'Alles für einen Elternabend ohne Vorbereitung am Wochenende: Ablauf, Folien für den Beamer, zwei Live-Demos mit Drehbuch, Diskussionskarten und ein dreisprachiges Handout. Ein Beamer und dieser Browser genügen – alles läuft offline.'),
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf', onclick: folien }, '📽️ Folien-Modus starten (Beamer)'),
        el('a', { class: 'k-knopf k-knopf--neutral', style: 'text-decoration:none;text-align:center', href: 'handout.html' }, '📄 Handout ansehen & drucken (de/en/uk/ru)'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => window.print() }, '🖨️ Diese Moderations-Seite drucken'))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `🕐 Ablauf (${gesamt} Minuten)`),
      el('table', { style: 'width:100%;border-collapse:collapse;font-size:0.92rem' },
        el('tbody', {},
          ...kit.agenda.map((a) =>
            el('tr', {},
              el('td', { style: 'border-bottom:1px solid var(--k-rand);padding:0.3rem;width:3.5rem;vertical-align:top;font-weight:600' }, `${a.minuten}′`),
              el('td', { style: 'border-bottom:1px solid var(--k-rand);padding:0.3rem' }, a.punkt)))))),
    ...kit.module.map((m) =>
      el('section', { class: 'k-karte' },
        el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${m.emoji} ${m.titel}`),
        el('p', { style: 'margin:0 0 0.5rem' }, el('strong', {}, 'Kernbotschaft: '), m.kernbotschaft),
        el('ul', { style: 'margin:0;padding-left:1.2rem' },
          ...m.folienPunkte.map((p) => el('li', { style: 'margin:0.25rem 0' }, p))),
        m.demoApp
          ? el('div', { style: 'margin-top:0.6rem;background:var(--k-hell, #eef6ff);border-radius:0.5rem;padding:0.6rem' },
              el('p', { style: 'margin:0 0 0.4rem;font-weight:700' }, '💻 Live-Demo-Drehbuch:'),
              el('ol', { style: 'margin:0;padding-left:1.2rem' },
                ...m.demoDrehbuch.map((d) => el('li', { style: 'margin:0.25rem 0' }, d))),
              el('p', { class: 'eak-nur-bildschirm', style: 'margin:0.5rem 0 0' },
                el('a', { class: 'k-knopf k-knopf--klein', style: 'text-decoration:none', href: `../${m.demoApp}/`, target: '_blank', rel: 'noopener' }, `▶️ ${m.demoApp} öffnen`)))
          : '')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '🗣️ Diskussionskarten (eine je Tisch, ausschneiden oder abschreiben)'),
      ...kit.diskussionskarten.map((k) =>
        el('div', { style: 'border:2px dashed var(--k-rand);border-radius:0.5rem;padding:0.5rem 0.7rem;margin:0.4rem 0' },
          el('p', { style: 'margin:0;font-weight:700' }, k.frage),
          el('p', { style: 'margin:0.25rem 0 0;font-size:0.85rem;color:#4b5563' }, `Moderations-Hinweis: ${k.hinweis}`)))),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '💛 Hilfe-Adressen (stehen auch auf dem Handout)'),
      el('ul', { style: 'margin:0;padding-left:1.2rem' },
        ...kit.hilfen.map((h) => el('li', { style: 'margin:0.25rem 0' }, h)))),
    fuss());
}

moderationsBildschirm();
