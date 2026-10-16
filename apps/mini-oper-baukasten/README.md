# Mini-Oper-Baukasten (offline, ohne KI)

Ein Werkzeug für Erwachsene: Die Fachkraft legt ein Gerüst für eine kleine Musikszene an,
mit Szenen, Rollen, einer Titelauswahl, Requisiten und einem Klang-Hinweis. Das Gerüst ist
ein Impuls. Die Kinder komponieren mit. Katalogeintrag: docs/10, Nr. 91. Quelle: Praleska,
Musikteil, Gruppe «ФАНТАЗЕРЫ», S. 262, S. 269 und S. 270.

## Was die App ist

- **Szenen:** 3 bis 5 (Eigenentwurf). Die Szenenfolge ist eine Liste leerer Zeilen mit
  Stichwort-Feld.
- **Rollen:** 2 bis 6 Rollenplätze (Eigenentwurf). Sie heißen nur „Rolle 1“, „Rolle 2“ und
  so weiter.
- **Figuren als Vorschlag:** die Beispiele aus S. 262, mit deutschen Namen als Eigenentwurf.
- **Titelauswahl:** 18 Titel aus S. 269, ohne Text und Musik, in der Schreibweise der Quelle.
- **Requisiten:** vier Dinge aus einer festen Liste allgemeiner Dinge, zufällig gezogen, dazu
  eine freie Zeile (Eigenentwurf).
- **Klang-Hinweis** nach S. 270 und optional Beispiele für Instrumente (Eigenentwurf, ohne
  Quellenbezug).
- **Gerüstbogen zum Ausdrucken:** leere Linien für Szenen, Rollen und Requisiten.

## Was die App nicht ist

- **Kein Schreibwerkzeug.** Sie schreibt keine Geschichte, kein Libretto und keinen Text.
  Sie legt nur Platzhalter, leere Zeilen und Listen an.
- **Keine Sammlung aus der Quelle.** Es stehen keine Texte, keine Noten und keine Abbildungen
  darin. Die Titel stehen nur mit Seitenangabe.
- **Keine Figur-Instrument-Zuordnung.** Die Quelle gibt eine solche Zuordnung nicht vor, die
  App macht sie nicht.
- **Kein Werkzeug für Kinder.** Es gibt keinen Kinder-Bildschirm und darum keine `eltern.html`.
- **Keine Bewertung von Kindern und keine Namen von Kindern.** Die Rollen sind Platzhalter.
- **Kein Konto, keine Anbindung an externe Dienste.** Die Seite stellt keine Anfrage an fremde
  Adressen.

## Was gespeichert wird

Nichts. Die Eingaben in den Stichwort-Feldern und die freie Zeile bleiben nur im Speicher der
offenen Seite. Nach dem Neuladen sind sie weg. Der Gerüstbogen zeigt keine Eingaben, nur
leere Linien.

## Quellen und Eigenentwurf

Seitenangaben beziehen sich auf die gedruckte Seitenzahl der Quelle.

| Angabe | Seite | Art |
|---|---|---|
| Aufgabe der Gruppe: zu gemeinsamen Liedimprovisationen und zum Komponieren von Mikroopern nach Märchen anregen | S. 262 | sinngemäß übertragen |
| Figurenbeispiele: стрекоза, муравей, бегемот, журавль, солдат, матрос, физкультурник, снеговик (und andere) | S. 262 | Original; deutsche Namen sind Eigenentwurf |
| Überschrift „Музыкальные инсценировки, сказки-драматизации“ mit 18 Titeln, ohne Text und Musik | S. 269 | Titel in der Schreibweise der Quelle |
| Klangfarbe des Instruments passend zum Charakter der Musik oder zum Teil eines Stücks wählen | S. 270 | sinngemäß übertragen |

**Eigenentwurf, nicht aus der Quelle:**

- die Anzahl der Szenen (3 bis 5) und der Rollenplätze (2 bis 6);
- die Szenenfolge mit Stichwort-Feldern, die Requisitenliste und die freie Zeile;
- die Instrumentenbeispiele, ohne Quellenbezug;
- die deutschen Namen der Figuren;
- der Gerüstbogen, die Oberfläche und die Hinweistexte.

Nicht alle 18 Titel sind Märchen; die Überschrift der Quelle nennt auch andere Formen. Die App
nennt keine Autorinnen und Autoren und trifft keine Aussage zur Gemeinfreiheit.

## Starten

Im Wurzelverzeichnis des Repos:

```
node tools/serve.mjs
```

Dann im Browser die Adresse localhost, Port 8070, Pfad `/apps/mini-oper-baukasten/` öffnen.
Zum Drucken den Knopf „Gerüstbogen drucken“ nutzen; der Browser zeigt dann nur den Bogen.

## Tests

```
node --test apps/mini-oper-baukasten/test/*.test.mjs
```

Die App hat 19 Tests in `test/logik.test.mjs`. Sie prüfen die Szenen- und Rollenzahlen, die
deterministische Auswahl über die übergebene Zufallsquelle, die Titel und Figuren wörtlich mit
ihrer Seite, den Klang-Hinweis ohne Figur-Instrument-Zuordnung sowie, dass die App keine
externen Adressen, keine verbotenen Begriffe, keine Kästchen, Häkchen oder Namenszeile und
keinen Speicherzugriff enthält.
