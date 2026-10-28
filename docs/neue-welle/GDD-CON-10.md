# Musik-Wörter-Bilderlexikon (Content-Pack) — Kurz-GDD (Entwurf)

> Черновик без кода (решение Max 11а, Stand 27.10.2026; Stufe 1 в `docs/plan-neue-welle.md`). Основа: Bauauftrag
> `docs/bauauftraege/CON-10-musik-woerter-bilderlexikon.md`, запись каталога «Musik-Woerter-Bilderlexikon»
> (`docs/praleska-katalog.json`; в Baukasten — `docs/10`, Z. 457) и `docs/plan-neue-welle.md`, Abschnitt 3 (Tore). Папка
> будущего приложения: `apps/musik-woerter-bilderlexikon/` (имя из Bauauftrag). Всё, что не взято из этих источников,
> помечено «(Eigenentwurf)», недоказанное — «(offen)». Страницы Praleska — только как их ведёт Bauauftrag; цитат длиннее
> 6 слов нет, источник пересказан. «Abschnitt N» — раздел Bauauftrag, «п. N» — этого GDD. «Моя сверка» — сверка с текстовой
> копией Praleska вне репозитория (`tools/quelle-holen.sh`; PDF лежит на ветке `main`, не на рабочей); человеком страницы не
> проверены (A18).

> **Stand der Prüfung (28.10.2026, zwei Prüfrunden):** Entwurf mit bekannten Abweichungen; der Bauauftrag und `docs/plan-neue-welle.md` gehen vor. Die Prüfer haben zuletzt noch diese Punkte gefunden (im Text unten teils veraltet oder zu stark formuliert):
> - Tor 8 ist unvollständig: Die Prüfung ist `packages/kinderschutz/test/seitenmarke.test.mjs`. `quelle.seite` in den Daten zählt als Seitenangabe; entweder steht die Marke „Seitenangaben nicht von einem Menschen geprüft.“ in einer Nutzerdatei (eltern.html, Fuß, Datenfeld) oder die App steht mit Begründung unter `ausnahmen` in `docs/seitenmarke-stand.json` (nur wenn die Seite nirgends angezeigt wird).
> - „Druck, 360 px und CSP für Bilder im Repo nicht erprobt“ ist überzogen: Das gemeinsame `packages/kinder-ui/img/favicon.svg` wird in allen Seiten gleichen Ursprungs unter derselben CSP geladen. Nicht erprobt sind Bilder in App-Ordnern, im Druck und bei 360 px.
> - „siehe letzte Zeile von Abschnitt 10“ meint die vorletzte Zeile (uk und ru); die letzte ist der Seiten-Vermerk.
> - A3/Favicon und 22а sind erledigt (21а: gemeinsame SVG gleichen Ursprungs in allen Seiten; 22а: Marken in 29 alten Apps). Offen ist nur, ob Max statt der Datei ein eingebettetes `data:`-Icon will (`docs/fragen-und-hinweise.md`, 21а).
> - Länge: über 30 KB für ein „Kurz-GDD“; der Schreiber der App kürzt beim Anlegen des endgültigen `GDD.md`.

## 1. Феномен / потребность (Warum)
Источник — Praleska, S. 260: раздел «Развиваемся в деятельности» (S. 259), группа «ФАНТАЗЕРЫ» (S. 260), слушание музыки. Среди
задач страница называет освоение «музыкальными терминами» (S. 260) и знакомство с инструментами. Bauauftrag цитирует шесть
терминов — «солист», «аккомпанемент», «дирижер», «композитор», «мелодия», «опера» (S. 260) — и семь инструментов: «арфе»,
«контрабасе», «виолончели», «клавесине», «органе», «фортепиано», «кларнете» (S. 260; на странице они стоят в предложном
падеже). Перечень терминов состоит, по моей сверке, из 16 слов через запятую и кончается открыто; десять остальных в
Bauauftrag не процитированы (п. 5, п. 10).
Потребность (Eigenentwurf, не измерена — offen): ребёнок 5–7 лет слышит слова «Dirigent», «Solist», «Oper», «Harfe», но у него
и у взрослого нет короткого словаря с рисунком и простым объяснением. Приложение даёт такой словарь без рекламы, без оценки
ребёнка и без сохранения данных. Katalog добавляет «Deutsche Fachbegriffe in einfacher Sprache» (BFSG/Leichte-Sprache-Nähe: это
не знак Leichte Sprache, проверка — offen), пары слов de/uk/ru (готовых нет, п. 10), европейскую традицию оркестра и
собственные рисунки без внешних медиа (docs/10 Z. 457).

## 2. Игрок и обещание (Wer + Kernerlebnis)
**Zielgruppe: beide: Kinder 5–7 Jahre (Katalog: 5–9), mit einem Erwachsenen oder allein.** Belege:
- Bauauftrag Abschnitt 2: Kinder 5 bis 9 Jahre (docs/10 Z. 457); Verwendung Bildschirm («Lexikon, gemeinsam mit Erwachsenen oder
  allein») und Druck. Lernziel 1: «Kind wählt» einen Begriff; Lernziel 2: «Erwachsener zeigt» die sieben Instrumente und
  «liest vor»; Lernziel 3: «Erwachsener druckt». Katalog (docs/10 Z. 457): Alter «5-9», Typ S.
- Quelle: Gruppe «ФАНТАЗЕРЫ» (S. 260) hat die Altersstufe 5 bis 7 Jahre (S. 199–200; моя сверка: «sechstes bis siebtes
  Lebensjahr» названо в этих пределах). Spanne 8–9 aus dem Katalog hat keinen Beleg (п. 10).
- Рамка адаптации в docs/10 (Rechtsrahmen, Punkt 2): 5–7 лет — короткие самостоятельные сессии.
- Дети названы пользователями → по решению 34а это Kinder-App: действуют Vorlesen (28а) и правило «ребёнок не оценивается»
  (п. 6).
Одно предложение (Eigenentwurf): «Ребёнок, один или со взрослым, выбирает слово из списка — Dirigent, Solist, Melodie, Harfe —
видит слово, рисунок и объяснение в одном-двух предложениях, слышит его и, если хочет, печатает карточку на лист A4».
Соседи (Eigenentwurf): `rhythmus-orchester` и `tonleiter-treppe` (5–7; Fachlernen Musik), `klang-detektive`
(3–5 и 5–7: hoch/tief, laut/leise, schnell/langsam), `musik-detektive` (4–6), `mini-oper-baukasten` (Fachkräfte; «Oper»).

## 3. Движок и петля (Wie)
Петля по Bauauftrag Abschnitt 3: стартовый список с тремя категориями (Musik, Orchester, Instrumente) → список слов категории →
Begriffskarte (слово, рисунок, объяснение) → Vorlesen → по желанию печать; отдельные экраны Instrumentenansicht (семь
инструментов) и Druckvorschau. Каждый шаг — выбор, свободного текста нет (Eigenentwurf). Рисунки — свои, в папке приложения,
внешних медиа нет; до рисунков стоит заглушка с названием (Eigenentwurf). Печать: одна Lexikon-Karte на лист A4 портрет — слово,
рисунок, объяснение; без номера страницы, без строки для имени, без знаков из Sperrliste (`docs/druck-symbole-liste.md`).
Ни очков, ни рангов, ни рекорда; ничего не сохраняется. Случайность не нужна (Eigenentwurf): порядок записей — как в файле.
Дополнения (Eigenentwurf; в Bauauftrag их нет): если ребёнок ещё не читает свободно (допущение), слово в списке читается вслух
по нажатию, а кнопка списка несёт рисунок; нужны ли лимит сессии и Gate для 5–7, решает Max (Rahmen Punkt 2: «короткие
самостоятельные сессии») — offen.

**Два пути для движка (решение за Max).**
- **Weg A — `quiz-kern` без оценки.** В плане «empfohlen» (`docs/plan-neue-welle.md`, Abschnitt 5, Frage 1), в Katalog
  «quiz-kern (Content-Pack)», Aufwand S. Даёт готовый раунд, Vorlesen на экранах вопроса и разбора, Erklärung после ответа;
  движок ничего не записывает: `removeItem` старого ключа (`quiz.mjs` Z. 56–59) выполняется, только если передан
  `rekordSchluessel`, а `boot` лишь читает настройку показа `ui.anzeige`; Tor 4 проверяется инструментом. Чего нет (проверено
  по `packages/quiz-kern/src/quiz.mjs` и `schema.mjs`):
  (1) ответ — строка, кнопка рисует только текст: рисунок, суть «Bilderlexikon», показать нельзя, остаётся слово или Emoji;
  (2) экраны Bauauftrag — категории, список слов, Begriffskarte с рисунком, Instrumentenansicht, печать — лежат вне движка;
  стартовый экран фиксирован и несёт карточки «Klassen-Modus», «Duett» и «Staffel» (Z. 97–123), настройкой их не отключить;
  (3) в Bauauftrag нет ни одного вопроса: Lernziele 1–3 — выбрать, показать, напечатать. Банк вопросов (не меньше 10, варианты
  ответа, Erklärung от 20 знаков, `schema.mjs` Z. 14, 17, 25, 27, 30) пришлось бы придумать, из 23 записей это возможно, но это
  другой продукт и больше Fachprüfung (Eigenentwurf);
  (4) справочник «найти слово и прочитать» — не «верно/неверно»: слово «Dirigent» не вопрос;
  (5) тексты по умолчанию «Richtig!», «Nicht ganz …» и «Geschafft!» (Z. 23–24, 27) заменяются через `texte` («Geschafft» —
  слово Tor 1; `stark-und-gesund` ставит «Ende der Runde»); `rekordSchluessel` не передавать: его имя
  `tools/leistungs-woerter.mjs` ловит как «rekord»;
  (6) в Fuß движка стоит «Daten bleiben auf diesem Gerät» (Z. 76), хотя он ничего не хранит.
- **Weg B — собственное Karten-App** на `kinder-ui`. Образцы: `puppentheater-werkstatt` (карточка, печать, `druck.css`,
  `regeln.test.mjs` — на него ссылается Bauauftrag Abschnitt 7), `kindertaenze-europa` (Kartei с фильтром и печатью, для
  Fachkräfte), `dinge-des-alltags` (Kinder-Bildschirm Ko-Nutzung). Повторяет Bauauftrag экран за экраном: категории, список,
  Begriffskarte с рисунком, Instrumentenansicht, печать; Vorlesen с `lang` и проверкой `lokaleStimme` (образец
  `architektur-spaziergang`). Цена: больше кода и, главное, 23 рисунка (M, Eigenentwurf); Tor 4 не применим —
  `tools/quiz-durchlauf.mjs` отклоняет приложения без импорта `quiz-kern` (Exit 64); проверки берёт `test/regeln.test.mjs`
  (Bauauftrag Abschnitt 7; там же «kein Import von quiz-kern»).
**Рекомендация (Eigenentwurf): Weg B.** Причины: (1) единица называется «Bilderlexikon», а `quiz-kern` рисунков показать не
умеет; (2) ни одного из пяти экранов Bauauftrag движок не даёт, а вопроса в Bauauftrag нет; (3) лексикон — справочник, поэтому квиз стал бы
другим продуктом, с новым банком вопросов и новой проверкой. Weg A допустим, если Max хочет быстрый текстовый квиз по словам:
тогда рисунки, Instrumentenansicht и печать отпадают (печать — отдельная страница для взрослых), правятся Abschnitt 3, 6, 7 и
9 Bauauftrag («ohne quiz-kern»). Позже квиз по тем же записям возможен как второй шаг, особенно для 8–9 лет (Eigenentwurf).
Рекомендация отличается от плана и касается только этой единицы.

## 4. Lernziele (проверяемые!)
Из Bauauftrag Abschnitt 2 (все — Eigenentwurf); после каждой цели — чем проверяется:
1. Ребёнок выбирает слово из списка и видит слово, рисунок и короткое объяснение (`begriffKarte`). Проверка: у каждой записи
   есть слово, рисунок в папке приложения и объяснение не длиннее двух предложений (Bauauftrag Abschnitt 5); понял ли ребёнок
   слово — только Kindertest (п. 9).
2. Взрослый показывает семь инструментов в отдельном экране и читает объяснения вслух. Проверка: экран показывает ровно семь
   записей с S. 260 (`pruefeBegriffe`), у каждой есть текст для Vorlesen.
3. Взрослый печатает одну Lexikon-Karte на лист A4 без знаков из Sperrliste и без строки для имени. Проверка:
   `test/regeln.test.mjs` по образцу `puppentheater-werkstatt` — число листов равно выбору; в тексте листа нет запрещённых
   знаков, Emoji, строки имени и полей по дням.

## 5. Контент-план
Единица контента: Begriff. Файл `daten/begriffe.json` (Bauauftrag Abschnitt 4). Схема: `id, de, ru, uk, kategorie, bild,
erklaerung, quelle{seite}, eigenentwurf`; `kategorie` ∈ {musik, orchester, instrument}; `bild` — путь внутри папки приложения;
`uk` — `null`, пока перевод не проверен; запись без `quelle.seite` и без `eigenentwurf: true` отклоняется. 23 записи (16 + 7):
- Begriffe (16; Zählung — Eigenentwurf: вокальная и инструментальная музыка, духовой и струнный оркестры считаются порознь).
  Немецкие имена (Eigenentwurf; в порядке источника, по моей сверке): Vokalmusik, Instrumentalmusik, Solist, Begleitung,
  Dirigent, Komponist, Interpret (слово offen), Melodie, Rhythmus, Tempo, Dynamik, Ballett, Oper, Konzert, Blasorchester,
  Streichorchester. Шесть процитированы в Bauauftrag (Solist, Begleitung, Dirigent, Komponist, Melodie, Oper, S. 260); для
  остальных десяти `quelle.seite` «S. 260» опирается на мою сверку, а не на цитату Bauauftrag.
- Kategorien: Bauauftrag Abschnitt 3 называет три категории; из 16 слов раскладку по musik и orchester задаёт только пример
  Abschnitt 4 — solist в `musik`, остальные 15 не разложены. Вариант (Eigenentwurf, offen; Solist — как в примере Bauauftrag):
  musik — Vokalmusik, Instrumentalmusik, Solist, Komponist, Interpret, Melodie, Rhythmus, Tempo, Dynamik, Oper, Ballett (11);
  orchester — Dirigent, Begleitung, Konzert, Blasorchester, Streichorchester (5).
- Instrumente (7; S. 260): Harfe, Kontrabass, Violoncello, Cembalo, Orgel, Klavier, Klarinette — немецкие имена Eigenentwurf;
  поле `ru` в начальной форме (на странице — предложный падеж, п. 10).
- Erklärungen: одно-два предложения простым языком, все Eigenentwurf (fachlich nicht geprüft); тон — как в `klang-detektive` и
  `rhythmus-orchester` для слов Tempo, Dynamik, Rhythmus (Wortlaut сверить, п. 10).
- Рисунки: 23 файла .svg (Eigenentwurf). Для абстрактных слов (Tempo, Dynamik, Rhythmus, Melodie, Begleitung) нужна идея
  рисунка — offen. В `apps/` сейчас нет ни одного файла-изображения; `schwungblatt-generator` и `filter-spiegel` строят SVG из
  кода.
- Не берём: страница называет ещё другие инструменты симфонического оркестра и народные инструменты без названий (S. 260);
  Bauauftrag их не берёт; «7+» в Katalog позволяет добавить свои записи (Eigenentwurf, `eigenentwurf: true`, без `quelle`).
Анти-шаблон-тест (Eigenentwurf): квиза в Weg B нет, тест не применяется.

## 6. Политика соответствия (Pflicht, docs/02 Z. 22–24, Z. 79–82, Z. 141–146)
Кода нет, поэтому ни один пункт не отмечен: это Tore из `docs/plan-neue-welle.md` (Abschnitt 3) и правила Bauauftrag
(Abschnitt 6); номера строк других правил сюда не переносятся.
- [ ] **Tor 1 — kein Kind wird bewertet** (docs/02 Z. 141–146): ни Punkte, Rekord, Rang, Serie, Prozent, «richtig von»,
  «geschafft», ни Sterne und Pokal; допустим нейтральный счётчик найденного. Проверка: `node tools/leistungs-woerter.mjs
  musik-woerter-bilderlexikon` без необъяснённого попадания; `node tools/bewertung-stand.mjs` — «Stand stimmt.», в
  `docs/bewertung-stand.json` у приложения нет записи. Лексикон ребёнка не проверяет; объяснения не говорят «ты уже знаешь»
  или «ты ещё не знаешь» (Eigenentwurf).
- [ ] **Tor 2 — Speicherregel:** Speicher ⇒ Löschknopf, kein Speicher ⇒ keine Karte «Meine Daten löschen»
  (`packages/kinderschutz/test/speicher-regel.test.mjs`). Единица ничего не сохраняет → карточки удаления нет; нет
  sessionStorage, IndexedDB, Cookie, Cache. Выбор языка только в памяти страницы: `erstelleSprache` пишет в localStorage лишь
  при `speicherSchluessel`, а тест `datenschutz-zusage` считает это хранением (решение 27а) — ключ не задавать.
- [ ] **Tor 3 — Berührziele ≥ 48 px, kein Überlauf bei 360 px, Fokus nach Klick:** `data-kennung` у каждой кнопки и возврат
  фокуса (как в `puppentheater-werkstatt`), при смене экрана фокус на заголовок (Bauauftrag Abschnitt 8);
  `node tools/browser-tor.mjs musik-woerter-bilderlexikon` без роста — новое приложение должно быть чистым. Рисунки не должны
  давать горизонтальной прокрутки при 360 px.
- [ ] **Tor 4 — Quiz-Durchlauf:** `node tools/quiz-durchlauf.mjs musik-woerter-bilderlexikon --modus alle` зелёный — только при
  Weg A; при Weg B инструмент отклоняет приложение (Exit 64), проверки переходят в `test/regeln.test.mjs`.
- [ ] **Tor 5 — Druck** (docs/02 Z. 79–82): Fuß и Bildschirmteile скрыты (`druck.css` с `@media print`, подключён в
  `index.html`), строки для имени нет, на листе нет Kästchen, Haken и Sterne (список — `docs/druck-symbole-liste.md`), нет
  Emoji и полей по дням; рисунок печатается вместе со словом и объяснением, лист читается и без рисунка.
- [ ] **Tor 6 — Fakten:** каждое утверждение о праве, деньгах или здоровье — с источником или пометкой «(Eigenentwurf, fachlich
  nicht geprüft)». Таких утверждений в единице не планируется; музыковедческие объяснения и рисунки инструментов тоже
  Eigenentwurf и требуют Fachprüfung (Musikpädagogik) — не проводилась.
- [ ] **Tor 7 — Vorlesen:** Kinder-App → Vorlesen на каждом экране (`vorlesen()` из `kinder-ui`). Вариант (Eigenentwurf), как в
  `architektur-spaziergang`: без локального немецкого голоса (`lokaleStimme('de')`) кнопку не показывать и сказать об этом, иначе
  браузер выберет голос сам, и он может быть сетевым. Как голос читает Violoncello, Cembalo, Kontrabass, Klarinette, не
  проверено (offen). uk/ru — п. 10.
- [ ] **Tor 8 — Seiten der Quelle:** только с пометкой «maschinell geprüft, noch nicht von einem Menschen geprüft»; по
  стандарту A18 номеров страниц на листе нет, они только в данных (`quelle.seite`) и в документации.
- [ ] **Tor 9 — keine Modellnamen, keine fremden Adressen, keine Zitate über sechs Wörter.**
Правила Bauauftrag и репозитория сверх Tore:
- [ ] Werbefrei, без аккаунтов и покупок; без внешних запросов (docs/02 Z. 22–24): CSP `default-src 'self'`, рисунки лежат в
  папке приложения, `installiereNetzwerkWaechter()`; keine Eingabefelder; kein Service Worker (решение 9б).
- [ ] `eltern.html` (шаблон; в Bauauftrag не назван — Eigenentwurf) и ссылка `../../impressum.html` в Fuß
  (`packages/kinderschutz/test/impressum-link.test.mjs`). При Weg A `quiz-kern` сам ставит в Fuß ссылку на `eltern.html`,
  файл обязателен.
- [ ] Hilfe-Insel не нужна: Fachlernen Musik, как у `tonleiter-treppe` и `rhythmus-orchester` в списке «bewusst ohne» теста
  `hilfe-insel-abdeckung`.
- [ ] Рисунки: у каждого `alt`-текст или `role="img"` с `aria-label` (Eigenentwurf); слово всегда текстом рядом с рисунком.
- [ ] uk und ru: см. последнюю строку п. 10.
Особые риски темы (Eigenentwurf; Fachprüfung offen): слишком простые объяснения становятся неверными (Fachprüfung); на рисунках
людей (Dirigent, Solist, Komponist) без клише и без реальных лиц; рисунки инструментов должны быть узнаваемыми и точными.

## 7. Стандарты и финансирование (Wofür)
Всё ниже взято из репозитория и юридически не перепроверено (Fachprüfung не проводилась — offen).
- Рамка адаптации (docs/10, «Правовая и этическая рамка адаптации», п. 1–4): заимствуются понятия и структура, ни одного
  дословного текста; 5–7 лет — короткие самостоятельные сессии; линия языков происхождения uk/ru; DSGVO Art. 8 (ноль детских
  данных), AI Act, BFSG, привязка к Bildungspläne. Без пометки «проверено человеком» — offen.
- Katalog (docs/10 Z. 457): «BFSG/Leichte-Sprache-Nähe», «europäische Orchestertradition» — формулировки Katalog, не проверены
  (offen). «Einfache Sprache» в Bauauftrag — не заявка на соответствие Leichte Sprache.
- Förder-Fit: (offen) — ни Bauauftrag, ни Katalog программу не называют; суммы, сроки и доли не приводятся. Детали —
  foerder-navigator.

## 8. Аджайл-оценка
Aufwand: Katalog — S. Оценка (Eigenentwurf): Weg B — M; код по объёму близок к `puppentheater-werkstatt` (`app.mjs` 94, `logik.mjs`
122 строки, `druck.css` 70) и `dinge-des-alltags` (135 и 83 строки), но 23 рисунка и тексты объяснений тяжелее кода; Weg A — S
(оболочка вроде `stark-und-gesund`, `app.mjs` 33 строки), без рисунков, Instrumentenansicht и печати.
Переиспользуем: `kinder-ui` (`el`, `vorlesen`, `lokaleStimme`, при необходимости `erstelleSprache`, `kinder.css`),
`kinderschutz` (`installiereNetzwerkWaechter`), при Weg A — `quiz-kern`. Набор файлов (Eigenentwurf, по образцу): `index.html`,
`app.mjs`, `logik.mjs`, `druck.css`, `eltern.html`, `daten/begriffe.json`, `bilder/*.svg`, `test/logik.test.mjs`,
`test/regeln.test.mjs`, `package.json`, `README.md`, `GDD.md`.
Первый срез (playable, Eigenentwurf): список категорий → категория Instrumente (семь записей, рисунки-заглушки) →
Begriffskarte с Vorlesen. Остальные категории, настоящие рисунки, печать и uk/ru — следующие срезы.
Abnahme (Bauauftrag Abschnitt 8): `npm test` в папке приложения зелёный; браузер при 360 px (нет переполнения, кнопки не меньше
48 px, фокус после клика, хранилище пусто, запросы только к `localhost`); печать: одна карточка на лист, число напечатанных
карточек равно выбору. Число тестов называть только после сборки и сверять с `packages/kinderschutz/test/testzahlen.test.mjs`.
Регистрацию (Hub, README, Impressum с пересчётом чисел, `docs/10`, Katalog) делает только Koordinator.

## 9. Kindertest-гипотезы
Что проверяем на 5–8 детях 5–7 лет (и, если диапазон останется, 8–9), один и со взрослым (протокол — docs/05, метод 5; без имён
детей); результатов нет, это гипотезы (Eigenentwurf):
1. Понимают ли дети объяснение в одном-двух предложениях без помощи взрослого? Какие слова (Begleitung, Komponist) остаются
   чужими?
2. Находит ли пятилетний слово по рисунку и по услышанному слову, если читать ещё не умеет? Пользуется ли списком или теряется?
3. Помогают ли рисунки абстрактным словам (Tempo, Dynamik, Rhythmus) или сбивают? Узнаёт ли ребёнок инструмент по рисунку?
4. Скучно ли без звука: ждёт ли ребёнок, что инструмент «зазвучит»? Что делает взрослый, чтобы его услышать?
5. Правильно ли читает голос иностранные слова (Violoncello, Cembalo); хочет ли ребёнок слышать слово ещё раз?
6. Что делают с распечатанной карточкой — вешают, играют «в оркестр», показывают дома? Не звучит ли что-то как проверка
   («а ты знаешь, кто такой дирижёр?»)?

## 10. Offen / Zweifel
Проверено при составлении: `node tools/bauauftrag-pruefen.mjs` даёт для этого Bauauftrag «ok» (16 цитат); S. 259, S. 260 и
S. 199–200 я сверил с текстовой копией ещё раз. Файл-источник лежит на ветке `main`, не на рабочей; человеком страницы не проверены
(A18).

**Widersprüche (Bauauftrag vs. Katalog vs. Plan vs. Quelle vs. Code)**
- Veraltet nach A7: Bauauftrag Abschnitt 3 («Die App nimmt ihn nicht an»), 6 («Kein quiz-kern (A7)»), 7 (тест «kein Import von
  quiz-kern») и 9 («Bauen erst nach Entscheidung A7») vs. шапка Bauauftrag и план (Abschnitt 1): A7 выполнен (шапка сама называет
  эти утверждения устаревшими). То же в `docs/plan-praleska-umsetzung.md` Z. 52. `docs/10` Z. 444 («quiz-kern, Regelkonflikt») и
  Z. 446 («9 und 10 nur mit quiz-kern, Regelkonflikt») говорят о том же конфликте, но Z. 446 читает его как «только с
  quiz-kern». Какие места править, зависит от выбора Weg A или B (п. 3).
- Faktenstand: индекс `docs/bauauftraege/index.json` «nur Katalogtext» vs. Bauauftrag Abschnitt 1 «geprüft» (цитаты сверены с
  текстовой копией). Пометка в индексе устарела.
- Alter: Katalog «5-9» vs. Quelle: «ФАНТАЗЕРЫ» — 5–7 (S. 199–200); Bauauftrag Abschnitt 2 и 9 это знают и оставляют вопрос открытым.
  Для 8–9 источника нет. Lernziel 1 («Kind wählt aus einer Liste») для пятилетнего без Vorlesen и рисунков невыполнимо.
- Zählung 16: верна только при раздельном счёте вокальной и инструментальной музыки, духового и струнного оркестров (в
  Bauauftrag так и сказано); перечень на странице кончается открыто. Bauauftrag цитирует шесть слов из 16, а `pruefeBegriffe`
  требует ровно 16 записей с «S. 260»: десять без цитаты опираются на мою сверку. Katalog называет Rhythmus и Tempo, в цитатах
  Bauauftrag их нет (на странице они есть).
- «Orchesterinstrumente» (Katalog, Bauauftrag Abschnitt 1) vs. данные: категория записей — `instrument`, не `orchester`. Страница
  объединяет семь названий с другими инструментами симфонического оркестра и народными; Cembalo, Orgel и Klavier —
  Tasteninstrumente (моя классификация, Eigenentwurf, не из источника), и считаются ли они Orchesterinstrumente, решает
  Fachprüfung (Musikpädagogik) — offen.
- Формы слов: источник даёт инструменты в предложном падеже, пример данных (Abschnitt 4) — «солист» в именительном; начальная
  форма «арфа», «контрабас» … — Eigenentwurf.
- Kategorien: пример Abschnitt 4 ставит solist в `musik`; для остальных 15 из 16 Begriffe правила раскладки по двум категориям
  (musik, orchester) нет (п. 5; вариант п. 5 следует примеру). Instrumentenansicht (экран 4) и категория «Instrumente»
  (экраны 1–2) ведут к одним и тем же семи записям; различие не описано.
- ru и uk: Abschnitt 4 — пример с заполненным `ru` vs. Abschnitt 6 — «uk und ru: nicht vorhanden, offen». Образец
  `puppentheater-werkstatt` запрещает ключи `uk` и `ru` в данных (`test/regeln.test.mjs`, тест «keine uk- und ru-Fassung
  erfunden»). Решить: показывать `ru` шести цитированных слов уже в первом срезе или только после проверки носителем языка
  (рекомендация Eigenentwurf: после). `begriffKarte` меняет только слово, объяснение остаётся немецким.
- Sprache: Pseudocode знает `sprache` и пропускает при печати карточки с `wort == null`, а в Abschnitt 3 нет экрана выбора
  языка и места, где выбор живёт. Без `speicherSchluessel` выбор действует до перезагрузки (Eigenentwurf). Пока `uk` пуст, ни
  выбор, ни печать не должны предлагать uk.
- Vorlesen: Abschnitt 3 («vorlesen (F2 offen)») и Abschnitt 9 («gilt die Regel für diese Werkzeuge?») vs. план (Tor 7) и решение
  28а: у Kinder-App Vorlesen есть; `docs/fragen-und-hinweise.md` всё ещё ведёт F2 как вопрос. Для слов uk/ru: `vorlesen()` берёт
  язык из вызова, `quiz-kern` его не передаёт; `farb-labor` uk/ru только показывает и не читает, потому что без голоса для
  этого языка немецкий голос читал бы кириллицу.
- Bilder: `ladeBegriffe` требует `bild` у каждой записи, Abschnitt 3 разрешает заглушку до рисунка, а файла-заглушки в модели
  данных нет. Файлов-изображений в `apps/` ещё нет ни в одном приложении (п. 5): Druck, 360 px и CSP для картинок в этом
  репозитории не опробованы.
- Muster-Tests vs. Bauauftrag: образец `puppentheater-werkstatt` требует Pflichtmarkierung на каждом листе и в Fuß
  (`test/regeln.test.mjs`, тест «Pflichtmarkierung»), а стандарт A18 и Bauauftrag Abschnitt 6 её опускают, потому что лист не
  несёт номера страницы. Тот же образец требует слова «Eigenentwurf» на каждом листе (тест «Eigenentwurf-Kennzeichnung»);
  Bauauftrag этого не называет, хотя объяснения — Eigenentwurf. Тест «Pflichtmarkierung» ищет в GDD заголовок «## Offen», а
  здесь раздел называется «10. Offen / Zweifel» (по заданию) — при сборке править тест или заголовок. Список запрещённых слов
  в данных и коде (тест «keine Bewertung von Kindern im Code und in den Daten») включает «Note/Noten» и «Platz»: в
  музыкальном словаре они естественны («Noten» в объяснении Komponist) и не значат школьную оценку — слово обойти или тест
  сузить. Любой Emoji и знаки вроде средней точки в файлах кода образец запрещает (тест «keine Druckzeichen»).

**Offene Fragen (für Max / Redaktion)**
- Motor: Weg A oder Weg B (п. 3) — решение Max.
- Alter: 5–7 (Quelle) oder 5–9 (Katalog)? Allein, со взрослым или оба? Gate и лимит сессии для 5–7?
- Begriffe: раскладка остальных 15 слов по категориям (solist → musik задан примером Bauauftrag); слово для «исполнитель»
  (Interpret?); добавлять ли свои инструменты («7+») и народные инструменты стран происхождения семей (Eigenentwurf, offen).
- Рисунки: кто рисует, в каком стиле, откуда идея для абстрактных слов, `alt`-тексты, лицензия рисунков (offen); первые файлы
  изображений в `apps/`.
- Звук: приложение без звука (внешних медиа нет); нужен ли звуковой пример инструмента — собственный синтез, как в
  `klang-detektive`, или отсылка к взрослому (Eigenentwurf, offen).
- Fachprüfung (Musikpädagogik): объяснения, рисунки, ярлык «Orchesterinstrument», произношение голоса — не проводилась.
- uk и ru: когда и кем проверяются; показывать один язык или оба названия сразу.
- Согласовать формулировки Tempo, Dynamik, Rhythmus, Oper с `rhythmus-orchester`, `klang-detektive`, `mini-oper-baukasten`.
- Слово «Noten» в объяснениях: сузить тест-образец или обойти слово.
- Quelle im Repo nicht prüfbar: PDF лежит только на `main`; сверка страниц и цитат идёт вне репозитория
  (`tools/quelle-holen.sh`, F3), человеком не сделана (A18).
- Seitenangaben: A18 (на листе их нет); граница цитат A10 (b) — 12 или 6 слов: здесь 6.
- Имя: папка `apps/musik-woerter-bilderlexikon/` следует названию единицы (Eigenentwurf).
- Kindertest не проводился.

uk und ru: nicht vorhanden, offen.

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.
