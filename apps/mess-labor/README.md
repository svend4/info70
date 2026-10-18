# Mess-Labor 🔬

Kinder-App für 5–7 gemeinsam mit einem Erwachsenen und für 8–12 allein. Grundlage ist der
Katalogeintrag docs/10 (Praleska), Top-30 Nr. 27, „Mess-Labor der kleinen Forscher“.
Zehn Mess-Experimente mit Haushaltsdingen folgen dem Forschungskreis **Vermuten →
Ausprobieren → Schlussfolgern**.

## Was drin ist

- **10 Experimente**: Fuß gegen Unterarm (Schnur), Orange mit und ohne Schale
  (Schwimmen), Apfel gegen Kartoffel (Gewicht), Wie viel passt hinein (Messbecher),
  Zimmer in Schritten, Das große Rollrennen (faire Messung), Das Schmelz-Duell
  (Eis), Warm und kalt im Zimmer (Temperatur), Lupe und Oberfläche, Lineal und Stift.
- **Sprungbrett**: Die App sammelt nur die Vermutung und sagt dann „Gerät weglegen
  und wirklich ausprobieren!“. Das Experiment passiert ohne Bildschirm.
- **Keine Scham**: Eine widerlegte Vermutung wird als Forschungserfolg gefeiert
  (per Test gesichert). Bei Wasser und Küche weist die App auf einen großen
  Menschen hin.
- Nach jedem Experiment: Vergleich, Forscher-Satz und „Warum ist das so?“.
- `logik.mjs` (ohne DOM): `pruefeExperimente`, `vergleicheVermutung`, `forscherSatz`,
  `geraeteOhneExperiment`.
- Eigenentwurf: Die Experimente sind eigene Vorschläge. Nur die Geräteaufzählung
  stammt aus der Quelle (S. 289, im Feld `quelle`).

## Politik

Werbefrei, ohne Konten, ohne Anfragen nach außen (Netzwerk-Wächter). Die App
**speichert nichts** und hat keine Eingabefelder. Es gibt `eltern.html` für die
Begleitung.

## Start und Tests

```bash
npm run dev   # http://localhost:8070/apps/mess-labor/
npm test      # 24 Tests in test/logik.test.mjs und test/regeln.test.mjs
```
