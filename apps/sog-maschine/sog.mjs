// Sog-Maschine: reine Logik (ohne DOM), testbar.
// Vier Bindungs-Mechaniken aus echten Apps - hier zuschaltbar und benannt,
// damit Kinder SPUEREN, welcher Trick gerade zieht.

export const MECHANIKEN = Object.freeze([
  { code: 'autoplay', name: 'Autoplay', emoji: '🤖', panel: 'Autoplay zieht dich weiter - du hast gar nicht entschieden, das nächste Video zu sehen.', lehre: 'Autoplay nimmt dir die Stopp-Entscheidung ab. Ausschalten gibt sie dir zurück.' },
  { code: 'endlos', name: 'Endlos-Scroll', emoji: '🌀', panel: 'Der Feed hat absichtlich kein Ende - ohne Boden kein natürlicher Ausstieg.', lehre: 'Ehrliche Apps sagen dir, wann Schluss ist. Endlos-Feeds wollen, dass du es vergisst.' },
  { code: 'streak', name: 'Serien-Druck (Streak)', emoji: '🔥', panel: 'Die Serie will nicht abreißen - das Feuer-Symbol arbeitet mit deiner Angst, etwas zu verlieren.', lehre: 'Eine Streak ist kein Erfolg, sondern eine Leine. Du verlierst nichts Echtes, wenn sie reißt.' },
  { code: 'glitzer', name: 'Überraschungs-Belohnung', emoji: '✨', panel: 'Mal gibt es Bonus-Sterne, mal nicht - genau diese Ungewissheit macht süchtig (wie ein Glücksspielautomat).', lehre: 'Zufällige Belohnungen sind der stärkste Sog-Trick. Erkenne das Muster: Es belohnt dein Bleiben, nicht dich.' },
]);

export const VIDEOS = Object.freeze([
  '🐙 Krake öffnet ein Gurkenglas', '🛹 Skateboard-Trick in Zeitlupe', '🧁 Mini-Küche: winziger Kuchen',
  '🐶 Welpe entdeckt seinen Schatten', '🌋 Brause-Vulkan im Garten', '🎨 Malen mit beiden Händen',
  '🤹 Jonglieren lernen in 30 Sekunden', '🚀 Papierrakete fliegt 20 Meter', '🐢 Schildkröte frisst Erdbeere',
  '⚽ Latten-Challenge im Park', '🎈 Ballon-Hund selbst gemacht', '🧊 Eiswürfel-Experiment',
]);

/** @param {string} code */
export function mechanik(code) {
  const m = MECHANIKEN.find((x) => x.code === code);
  if (!m) throw new Error(`unbekannte Mechanik: ${code}`);
  return m;
}

/**
 * Bewertet die Zeit-Schaetzung des Kindes gegen die echte Sitzungsdauer.
 * Der Sog laesst Zeit meist KUERZER wirken, als sie war.
 * @param {number} geschaetztSek @param {number} echtSek
 */
export function bewerteSchaetzung(geschaetztSek, echtSek) {
  if (echtSek <= 0) return { urteil: 'unbekannt', satz: 'Diesmal war die Runde zu kurz zum Messen.' };
  const faktor = geschaetztSek / echtSek;
  if (faktor <= 0.67) return { urteil: 'unterschaetzt', satz: 'Du hast die Zeit deutlich UNTERSCHÄTZT - genau das macht der Sog: Er lässt Minuten wie Sekunden wirken.' };
  if (faktor >= 1.5) return { urteil: 'ueberschaetzt', satz: 'Du hast die Zeit überschätzt - ohne Sog spürt man jede Minute ehrlicher.' };
  return { urteil: 'gut', satz: 'Starke Zeit-Wahrnehmung! Wer die Uhr im Gefühl behält, dem kann der Sog wenig anhaben.' };
}

/** Formatiert Sekunden als "M:SS". */
export function formatSekunden(sek) {
  const s = Math.max(0, Math.round(sek));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
