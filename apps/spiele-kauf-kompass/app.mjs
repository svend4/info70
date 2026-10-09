// Spiele-Kauf-Kompass (Familie, Eltern+Kind 6-15, docs/09 Nr. 223). Checkliste,
// die Familie vor Kauf/Installation eines Spiels gemeinsam durchgeht: Alters-
// kennzeichen, Chat, Kosten/Lootboxen, Daten – jede Position mit kindgerechter
// Erklärkarte und Vorlesen. Am Ende eine Empfehlung. kriterien-check-Muster,
// neuer Katalog. Politik docs/02: keine externen Anfragen; alles lokal.
import { el, vorlesen } from '../../packages/kinder-ui/js/komponenten.mjs';
import { installiereNetzwerkWaechter } from '../../packages/kinderschutz/src/index.mjs';

installiereNetzwerkWaechter();

const SCHLUESSEL = 'skk.status';
const app = document.getElementById('app');
const daten = await fetch('daten/kriterien.json').then((r) => r.json());
const ALLE = daten.bereiche.flatMap((b) => b.punkte);

const ladeStatus = () => JSON.parse(localStorage.getItem(SCHLUESSEL) ?? '{}');
const speichereStatus = (s) => localStorage.setItem(SCHLUESSEL, JSON.stringify(s));

function empfehlung(erledigt) {
  const anteil = erledigt / ALLE.length;
  if (erledigt === ALLE.length) return { emoji: '🟢', text: 'Alles gemeinsam geprüft! Wenn alle Punkte gut aussehen, spricht nichts gegen den Kauf. Stellt Chat und Kaufsperre gleich richtig ein.' };
  if (anteil >= 0.5) return { emoji: '🟡', text: 'Ihr seid auf einem guten Weg. Klärt die offenen Punkte, bevor ihr euch entscheidet.' };
  return { emoji: '🔴', text: 'Noch viele offene Punkte. Geht sie in Ruhe gemeinsam durch – lieber vor dem Kauf als danach ärgern.' };
}

function render() {
  const status = ladeStatus();
  const erledigt = ALLE.filter((p) => status[p.id]).length;
  const anteil = Math.round((erledigt / ALLE.length) * 100);
  const e = empfehlung(erledigt);

  const bereichsKarten = daten.bereiche.map((b) => {
    const ok = b.punkte.filter((p) => status[p.id]).length;
    // `skk-blatt`: der Merkzettel sind die Fragen mit ihrem Warum. Haken und
    // Zaehlstand bleiben auf dem Bildschirm - ein Blatt mit Haken waere eine
    // Bewertung auf Papier (docs/02).
    return el('section', { class: 'k-karte skk-blatt' },
      el('h2', { style: 'margin-top:0;font-size:1.1rem' }, `${b.emoji} ${b.name}`, el('span', { class: 'skk-nur-bildschirm' }, ` (${ok}/${b.punkte.length})`)),
      ...b.punkte.map((p) => {
        const box = el('input', { type: 'checkbox', id: `skk-${p.id}`, style: 'width:1.5rem;height:1.5rem;flex-shrink:0;margin-top:0.15rem' });
        box.checked = Boolean(status[p.id]);
        box.addEventListener('change', () => { const s = ladeStatus(); s[p.id] = box.checked; speichereStatus(s); render(); });
        return el('div', { style: 'padding:0.4rem 0' },
          el('div', { style: 'display:flex;gap:0.6rem;align-items:flex-start' },
            box,
            el('label', { for: `skk-${p.id}`, style: 'flex:1;font-weight:600' }, p.frage)),
          el('div', { style: 'margin:0.2rem 0 0 2.1rem' },
            el('p', { style: 'font-size:0.9rem;color:#374151;margin:0.2rem 0' }, p.warum),
            el('button', { class: 'k-knopf k-knopf--klein k-knopf--neutral', onclick: () => vorlesen(`${p.frage}. ${p.warum}`) }, '🔊 Vorlesen')));
      }));
  });

  app.replaceChildren(
    el('h1', { class: 'k-titel' }, '🎮 Spiele-Kauf-Kompass'),
    el('p', { class: 'k-untertitel' }, 'Vor dem Kauf gemeinsam prüfen – Eltern und Kind zusammen'),
    el('section', { class: 'k-karte' },
      el('p', { style: 'margin-top:0' }, daten.hinweis),
      el('p', { style: 'margin-bottom:0.3rem' }, `Geprüft: ${erledigt} von ${ALLE.length} (${anteil} %)`),
      el('div', { class: 'k-fortschritt', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': ALLE.length, 'aria-valuenow': erledigt },
        el('div', { style: `width:${anteil}%` })),
      el('p', { style: 'margin:0.5rem 0 0;font-weight:600' }, `${e.emoji} ${e.text}`)),
    ...bereichsKarten,
    el('section', { class: 'k-karte' },
      el('button', { class: 'k-knopf', onclick: () => window.print() }, '🖨️ Als Merkzettel drucken'),
      el('button', { class: 'k-knopf k-knopf--neutral k-knopf--klein', style: 'margin-left:0.4rem', onclick: () => { localStorage.removeItem(SCHLUESSEL); render(); } }, '🧹 Zurücksetzen'),
      el('p', { style: 'font-size:0.85rem;color:#4b5563;margin-bottom:0' }, 'Tipp: Chat auf „nur Freunde“, Kaufsperre an, Standort aus – am besten gleich zusammen einstellen.')),
    el('footer', { class: 'k-fuss' },
      el('a', { href: 'eltern.html' }, '👪 Für Eltern'),
      el('span', {}, ' · werbefrei · läuft offline · '),
      el('a', { href: '../../impressum.html' }, 'Impressum & Datenschutz')));
}

render();
