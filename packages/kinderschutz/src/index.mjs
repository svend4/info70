// kinderschutz: Laufzeit-Werkzeuge zur Durchsetzung der Monorepo-Politik
// (docs/02-anforderungen.md). Ohne Abhängigkeiten, läuft im Browser.

export { KRITERIEN, istBekanntesKriterium } from './kriterien.mjs';

/**
 * Prüft, ob eine URL zum eigenen Origin gehört.
 * Relative URLs gelten als eigen.
 * @param {string|URL} url @param {string} eigenerOrigin
 */
export function istEigenerOrigin(url, eigenerOrigin = globalThis.location?.origin ?? '') {
  try {
    return new URL(url, eigenerOrigin).origin === eigenerOrigin;
  } catch {
    return false;
  }
}

/**
 * Netzwerk-Wächter: blockiert in der Laufzeit jede Anfrage an fremde Hosts
 * (fetch, XMLHttpRequest, WebSocket) und meldet Verstöße. Damit wird die
 * Regel "keine externen Anfragen" nicht nur versprochen, sondern erzwungen.
 * Im Produktivbetrieb zusätzlich per CSP absichern:
 * default-src 'self'; style-src 'self' 'unsafe-inline' (Inline-Styles ja, Inline-Skripte nein).
 * @param {Window & typeof globalThis} win
 * @param {(url: string) => void} [beiVerstoss]
 * @returns {() => string[]} Funktion, die die Liste der Verstöße liefert
 */
export function installiereNetzwerkWaechter(win = globalThis, beiVerstoss = (url) => console.error('[kinderschutz] Externe Anfrage blockiert:', url)) {
  const verstoesse = [];
  const melden = (url) => {
    verstoesse.push(String(url));
    beiVerstoss(String(url));
  };

  const originalFetch = win.fetch?.bind(win);
  if (originalFetch) {
    win.fetch = (eingabe, init) => {
      const url = typeof eingabe === 'string' || eingabe instanceof URL ? eingabe : eingabe.url;
      if (!istEigenerOrigin(url, win.location.origin)) {
        melden(url);
        return Promise.reject(new Error('kinderschutz: externe Anfrage blockiert'));
      }
      return originalFetch(eingabe, init);
    };
  }

  if (win.XMLHttpRequest) {
    const originalOpen = win.XMLHttpRequest.prototype.open;
    win.XMLHttpRequest.prototype.open = function (methode, url, ...rest) {
      if (!istEigenerOrigin(url, win.location.origin)) {
        melden(url);
        throw new Error('kinderschutz: externe Anfrage blockiert');
      }
      return originalOpen.call(this, methode, url, ...rest);
    };
  }

  if (win.WebSocket) {
    const OriginalWebSocket = win.WebSocket;
    win.WebSocket = new Proxy(OriginalWebSocket, {
      construct(ziel, argumente) {
        melden(argumente[0]);
        throw new Error('kinderschutz: WebSocket zu fremdem Host blockiert');
      },
    });
  }

  return () => [...verstoesse];
}

/**
 * Speicher-Audit: findet localStorage-Schlüssel, die nach personenbezogenen
 * Daten aussehen (Name, E-Mail, Geburtstag …). Solche Daten dürfen laut
 * Politik gar nicht erst entstehen.
 * @param {Storage} speicher
 * @returns {string[]} verdächtige Schlüssel
 */
export function pruefeSpeicherNutzung(speicher = globalThis.localStorage) {
  if (!speicher) return [];
  const verdaechtig = /name|mail|geburt|adresse|telefon|foto|standort|gps/i;
  const funde = [];
  for (let i = 0; i < speicher.length; i++) {
    const schluessel = speicher.key(i) ?? '';
    if (verdaechtig.test(schluessel)) funde.push(schluessel);
  }
  return funde;
}
