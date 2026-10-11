# Schulanfang und Spiel — Game Design Document

**Nr. 64 der Eltern-Werkzeuge (docs/10). Quelle: Praleska S. 242.**

## 1. Was es ist

Ein Wegweiser in drei Teilen – was gilt und wer entscheidet, was über die Grundlagen fürs Lernen
bekannt ist und wie sicher, und vier Arten zu spielen. Werkzeug für Erwachsene; es speichert nichts.

## 2. Der Titel des Katalogeintrags ist nicht übernommen

Der Eintrag heißt „Spielend schulreif“. „Schulreife“ unterstellte bis in die 1960er-Jahre einen
biologisch bedingten Reifungsvorgang und wurde durch „Schulfähigkeit“ und später
„Schulbereitschaft“ abgelöst; Nordrhein-Westfalen hat auch die Schulfähigkeit als
Einschulungsvoraussetzung ausdrücklich aufgegeben.

`SCHULREIF_ALS_URTEIL` weist jede Konstruktion ab, in der ein Kind schulreif oder nicht schulreif
ist. Der erklärende Absatz muss das Wort tragen dürfen – er steht als benannte Ausnahme in
`NICHT_GEPRUEFT`, und der Validator verlangt umgekehrt, dass er den Begriff wirklich nennt.

## 3. Ein Quellziel ist zurückgewiesen – genau eines

Die Quelle nennt fünf allgemeine Ziele. Nummer 3 lautet, „die reichen Möglichkeiten des Spiels zu
diagnostischen und, falls nötig, zu korrektiven Zwecken zu nutzen“. Ein Kind, das spielt, gibt sich
preis; es dabei zu beobachten, um es einzuschätzen, macht aus dem Spiel eine Prüfung, von der das
Kind nichts weiß.

`pruefeDaten` verlangt **genau ein** zurückgewiesenes Ziel und dass dessen Text das Wort
„diagnostisch“ enthält. Zwei zurückgewiesene Ziele sind ebenso ein Fehler wie keines: die Bilanz
soll die Quelle wiedergeben, nicht die Laune des Autors.

Die übrigen vier: zwei sind gebaut (das Spiel als führende Tätigkeit, die Elternkompetenz – das
zweite zitiert der Katalogeintrag wörtlich), zwei betreffen den Tagesablauf einer Einrichtung.

## 4. Kein bundesweiter Satz

Stichtag, Zurückstellung und Untersuchung sind Landesrecht. Jede Antwort in `wasGilt` trägt ihre
Quelle – der Validator weist eine ohne ab –, und die Länderantwort muss **mindestens zwei
Bundesländer** nennen. Mit nur einem klingt ein Beispiel wie eine Regel für alle; der Test prüft
genau diesen Fall.

## 5. Zu jedem Bereich steht, wie sicher er ist

Die gemeinsame Empfehlung von KMK und JFMK nennt drei basale Bereiche und sagt ausdrücklich, dass
die Liste nicht abschließend ist – `bereicheHinweis` muss das wiedergeben.

Das Feld `sicherheit` ist Pflicht. Beim sozial-emotionalen Bereich steht dort „benannt, nicht
beziffert“, und im Text steht, dass die Empfehlung keine Zahl nennt und diese App keine erfindet.
Ohne diesen Satz entstünde der Eindruck, hier fehle nur die Recherche.

## 6. Jede Spielart sagt, was sie NICHT ist

Sonst wird aus jeder Spielidee eine Übung: der Kaufladen zum Rechnen, das Würfelspiel zum Zählen,
das Theaterstück zur Aufführung. `wasEsNichtIst` ist Pflichtfeld und muss eine Verneinung enthalten.

Und zur Wirkung des Spielens steht ausdrücklich **keine Zahl**: Die Quelle nennt das Spiel die
führende Tätigkeit dieses Alters; belegte Wirkungszahlen zum Zusammenhang von Spiel und späterer
Schulleistung sind beim Bau nicht gefunden worden. Was gefunden wurde, steht bei den drei Bereichen
und betrifft Sprache und Mengen, nicht das Spiel als solches.

## 7. Keine Vorhersage – und warum das keine Vorsicht ist

Selbst das eigens entwickelte, normierte Screening für Leseschwierigkeiten erkannte in unabhängiger
Prüfung meist weniger als die Hälfte der später betroffenen Kinder. Die Kultusministerkonferenz hat
schon 1997 festgehalten, dass rein kognitiv ausgerichtete Schulfähigkeitstests als alleinige
Grundlage der Aufnahmeentscheidung nicht ausreichen. `VORHERSAGE` und `BEWERTUNG` weisen beides ab,
`KOENNENSALTER` zusätzlich jede Angabe, ab welchem Alter ein Kind etwas können müsste.

## 8. Abgrenzung im Korpus

`schulstart-begleiter` ist das Werkzeug für **Fachkräfte** und enthält einen Beobachtungsbogen.
Diese App enthält keinen. Der Verweis darauf steht im Fuß und nennt die Zielgruppe, damit nicht
zwei Apps nebeneinanderstehen, die dasselbe zu tun scheinen – ein Test prüft den Wortlaut.

## 9. Druck

Ein Blatt für die Elternmappe: alles offen, ohne Knöpfe, ohne Haken, ohne Namenszeile. Auf Papier
gibt es kein Aufklappen.

## 10. Grenzen

* Keine Rechtsberatung: die Beispiele nennen zwei Länder, maßgeblich ist das Schulgesetz des
  eigenen Landes.
* Keine Mehrsprachigkeit: Rechtsbegriffe in einer ungeprüften Übersetzung wären bei diesem Thema
  fahrlässig.
* Kein Bericht und kein Export – er wäre ein Bericht über ein Kind.
