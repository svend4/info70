// Eltern-Kompass-Sammelband (docs/09, Einheit "Eltern-Kompass-Sammelband"):
// buendelt ALLE Eltern-Kompass-Seiten des Monorepos zu einer druckbaren
// Broschuere - damit Lehrkraefte am Elternabend EIN Dokument austeilen.
// Reine Zusammenstellung: die Kapitel werden zur Laufzeit per Same-Origin-
// fetch aus den vorhandenen eltern.html-Seiten gelesen (keine Kopien, kein
// Pflege-Doppel). Politik: keine externen Anfragen, speichert nichts.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const app = document.getElementById('app');
const liste = await fetch('daten/apps.json').then((r) => r.json());

app.replaceChildren(
  el('section', { class: 'k-karte' },
    el('p', { style: 'margin:0' }, `⏳ Sammelband wird aus ${liste.apps.length} Eltern-Kompass-Seiten zusammengestellt …`)));

async function ladeKapitel(name) {
  try {
    const html = await fetch(`../${name}/eltern.html`).then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    });
    const dok = new DOMParser().parseFromString(html, 'text/html');
    const titel = dok.querySelector('h1')?.textContent?.trim() ?? name;
    const karten = [...dok.querySelectorAll('main section.k-karte')];
    return { name, titel, karten };
  } catch {
    return { name, titel: `👪 ${name}`, karten: null };
  }
}

const kapitel = await Promise.all(liste.apps.map(ladeKapitel));

function kapitelKnoten(k, nummer) {
  const inhalt = k.karten
    ? k.karten.map((karte) => {
        const kopie = karte.cloneNode(true);
        // Links funktionieren im Sammelband-Kontext nicht relativ zur Quell-App:
        // auf die jeweilige App-Seite umbiegen bzw. im Druck ohnehin unsichtbar.
        for (const a of kopie.querySelectorAll('a')) {
          a.setAttribute('href', `../${k.name}/eltern.html`);
          a.classList.add('esb-nur-bildschirm');
        }
        return kopie;
      })
    : [el('section', { class: 'k-karte' },
        el('p', { style: 'margin:0' }, `Diese Seite konnte nicht geladen werden – direkt öffnen: `,
          el('a', { href: `../${k.name}/eltern.html` }, `${k.name}/eltern.html`)))];
  // Die Kapitel werden hier SCHMALER gerendert als in der Quell-App (sie
  // stecken zusaetzlich in diesem article). Lange Komposita –
  // „Barrierefreiheitsstärkungsgesetz“, „Kennzeichnungspflicht“ – passen
  // dann nicht mehr in die Zeile und schoben die ganze Seite bei 360 px
  // nach rechts. Umbruch im Wort erlauben, mit Trennung nach `lang`.
  return el('article', {
    class: 'esb-kapitel', id: `kapitel-${k.name}`, lang: 'de',
    style: 'overflow-wrap:anywhere;hyphens:auto',
  },
    el('h2', { style: 'font-size:1.2rem;margin:1rem 0 0.25rem' }, `${nummer}. ${k.titel.replace('👪 Eltern-Kompass: ', '')}`),
    el('p', { style: 'margin:0 0 0.5rem;font-size:0.85rem;color:#4b5563' }, `App: apps/${k.name}/`),
    ...inhalt);
}

app.replaceChildren(
  el('h1', { class: 'k-titel' }, '📚 Eltern-Kompass-Sammelband'),
  el('p', { class: 'k-untertitel' }, `Alle ${kapitel.length} Eltern-Seiten der Kinder-Werkstatt als eine Broschüre`),
  el('section', { class: 'k-karte esb-nur-bildschirm' },
    el('p', { style: 'margin-top:0' }, 'Für Elternabende und Elternmappen: Dieses Dokument bündelt die Eltern-Kompass-Seite jeder App – worum es geht, welche Daten (nicht) anfallen und wie Sie begleiten. Die Kapitel werden live aus den Original-Seiten zusammengestellt, es gibt also keine veralteten Kopien.'),
    el('div', { class: 'k-antworten' },
      el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Als Broschüre drucken'),
      el('a', { class: 'k-knopf k-knopf--neutral', style: 'text-decoration:none;text-align:center', href: '../elternabend-kit/' }, '🏠 Zum Elternabend-Kit'))),
  el('section', { class: 'k-karte esb-nur-bildschirm' },
    el('h2', { style: 'margin-top:0;font-size:1.1rem' }, 'Inhalt'),
    el('ol', {
      // Zwei Spalten, aber die Namen sind lang und mit Bindestrich
      // („Bewegungspausen-Generator“). Ohne Umbruch im Wort schob das
      // Inhaltsverzeichnis die ganze Seite bei 360 px um 55 px nach
      // rechts – mobile-first ist Pflicht (docs/02).
      style: 'margin:0;padding-left:1.4rem;columns:2;column-gap:2rem;'
        + 'overflow-wrap:anywhere;hyphens:auto',
      lang: 'de',
    },
      ...kapitel.map((k) =>
        el('li', { style: 'margin:0.15rem 0' },
          // Eigenständiger Link: das a-Element selbst braucht 48 px Höhe und Breite (Messung am Element).
          // Eine einzeilige Inline-Box misst nur 21 px, daher inline-flex mit 3rem (18 px Basisschrift = 54 px).
          el('a', {
            href: `#kapitel-${k.name}`,
            style: 'display:inline-flex;align-items:center;box-sizing:border-box;min-height:3rem;min-width:3rem',
          }, k.titel.replace('👪 Eltern-Kompass: ', '')))))),
  ...kapitel.map((k, i) => kapitelKnoten(k, i + 1)),
  el('footer', { class: 'k-fuss' },
    el('span', {}, 'Material für Erwachsene · diese Seite speichert nichts · '),
    el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
