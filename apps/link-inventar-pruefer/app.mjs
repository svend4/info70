// Link-Inventar-Prüfer (für Betreiber, docs/09 Nr. 166). HTML-Datei(en) oder
// eingefügtes HTML importieren → alle Links werden lokal extrahiert und
// klassifiziert; je externem Link eine Prüfliste. Bericht als Datei. KEIN
// Netzwerkzugriff. Politik docs/02: alles lokal.
import { el } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';
import { extrahiereLinks, statistik, bericht, PRUEFPUNKTE } from './logik.mjs';

installiereNetzwerkWaechter();

const STATUS_SCHLUESSEL = 'lip.status';
const app = document.getElementById('app');
const KAT_EMOJI = { extern: '🔗', video: '🎬', social: '📱', appstore: '📲', shop: '🛒', intern: '🏠', mailto: '✉️', tel: '📞' };

let links = []; // aktueller Import (nur im Speicher der Seite)
const ladeStatus = () => JSON.parse(localStorage.getItem(STATUS_SCHLUESSEL) ?? '{}');
const speichereStatus = (s) => localStorage.setItem(STATUS_SCHLUESSEL, JSON.stringify(s));

const herunterladen = (inhalt, name) => { const url = URL.createObjectURL(new Blob([inhalt], { type: 'text/plain;charset=utf-8' })); const a = el('a', { href: url, download: name }); a.click(); URL.revokeObjectURL(url); };

function verarbeite(html) {
  links = extrahiereLinks(html);
  render();
}

function render() {
  const status = ladeStatus();
  const s = statistik(links);
  const externe = links.filter((l) => l.extern);

  const datei = el('input', { type: 'file', accept: '.html,.htm,text/html', multiple: true, style: 'display:block;margin-top:0.3rem', 'aria-label': 'HTML-Dateien importieren' });
  datei.addEventListener('change', async () => {
    const texte = await Promise.all([...(datei.files ?? [])].map((f) => f.text()));
    verarbeite(texte.join('\n'));
  });

  const einfuegeFeld = el('textarea', { style: 'width:100%;min-height:5rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem;font-family:monospace;font-size:0.78rem', 'aria-label': 'HTML einfügen', placeholder: '… oder HTML hier einfügen' });

  const linkKarten = externe.map((l) =>
    el('div', { style: 'padding:0.5rem 0;border-top:1px solid var(--k-rand)' },
      el('p', { style: 'margin:0 0 0.3rem;font-weight:600;word-break:break-all' }, `${KAT_EMOJI[l.art] ?? '🔗'} ${l.url}`),
      el('small', { style: 'color:#4b5563' }, `Kategorie: ${l.art}`),
      el('div', { style: 'margin-top:0.3rem' }, ...PRUEFPUNKTE.map((p) => {
        const key = `${l.url}::${p.id}`;
        const box = el('input', { type: 'checkbox', id: `lip-${key}`, style: 'width:1.3rem;height:1.3rem;flex-shrink:0' });
        box.checked = Boolean(status[key]);
        box.addEventListener('change', () => { const st = ladeStatus(); st[key] = box.checked; speichereStatus(st); const z = app.querySelector('#lip-bericht'); if (z) z.value = bericht(links, st); });
        return el('label', { for: `lip-${key}`, style: 'display:flex;gap:0.5rem;align-items:center;padding:0.15rem 0;font-size:0.9rem' }, box, el('span', {}, p.text));
      }))));

  const berichtsFeld = el('textarea', { id: 'lip-bericht', readonly: true, style: 'width:100%;min-height:10rem;font-family:monospace;font-size:0.78rem;border:2px solid var(--k-rand);border-radius:0.5rem;padding:0.5rem', 'aria-label': 'Bericht' });
  berichtsFeld.value = bericht(links, status);

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🔗 Link-Inventar-Prüfer'),
    el('p', { class: 'k-untertitel' }, 'HTML importieren → externe Links lokal prüfen (kein Netzwerkzugriff, für Betreiber)'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'font-weight:600;margin-top:0' }, '📥 HTML importieren'),
      el('p', { style: 'font-size:0.88rem;color:#4b5563;margin-top:0' }, 'Exportierte HTML-Dateien laden oder Quelltext einfügen. Nichts wird gesendet – die Analyse läuft nur in Ihrem Browser.'),
      datei,
      einfuegeFeld,
      el('button', { class: 'k-knopf k-knopf--klein', style: 'margin-top:0.4rem', onclick: () => verarbeite(einfuegeFeld.value) }, '🔍 Eingefügtes HTML prüfen')),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, links.length ? `Gefunden: ${s.gesamt} Links, davon ${s.extern} extern.` : 'Noch nichts importiert.'),
      externe.length
        ? el('div', {}, el('h2', { style: 'font-size:1.1rem' }, 'Externe Links prüfen'), ...linkKarten)
        : (links.length ? el('p', { style: 'color:#4b5563' }, 'Keine externen Links – gut für eine Kinderseite.') : '')),
    el('section', { class: 'k-karte' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, '📋 Bericht'),
      berichtsFeld,
      el('div', { class: 'k-antworten' },
        el('button', { class: 'k-knopf k-knopf--klein', onclick: () => herunterladen(berichtsFeld.value, 'link-inventar-bericht.txt') }, '💾 Als Datei speichern'),
        el('button', { class: 'k-knopf k-knopf--klein', onclick: (ev) => { berichtsFeld.select(); navigator.clipboard?.writeText(berichtsFeld.value); ev.target.textContent = '✔️ Kopiert!'; } }, '📋 Kopieren'),
        el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', onclick: () => { localStorage.removeItem(STATUS_SCHLUESSEL); render(); } }, '🧹 Prüf-Haken zurücksetzen'))),
    el('footer', { class: 'k-fuss' },
      el('span', {}, 'Werkzeug für Erwachsene · läuft offline · kein Netzwerkzugriff · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
