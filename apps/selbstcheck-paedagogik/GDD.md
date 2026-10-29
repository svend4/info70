# 🪞 Selbstcheck pädagogisches Ich — Kurz-GDD

## 1. Феномен / потребность (Warum)
Какому явлению отвечает: профессиональная саморефлексия — обязательная часть
качественной педагогической работы (§ 22a SGB VIII Qualitätsentwicklung,
эвалюационные требования всех земельных Bildungspläne; рефлексия компетенций —
ядро DQR-профиля Erzieher*in). Источник идеи: Каталог №2 (docs/10, Praleska) —
«Autodiagnostik des beruflichen Ich» (S. 19-20). Что происходит без
приложения: рефлексия случается только «сверху» (Jahresgespräch, оценка
руководителем) — с эффектом социальной желательности; честный взгляд на себя
негде сделать безопасно. Коммерческие «тесты для педагогов» собирают данные
и выдают сомнительные баллы.

## 2. Игрок и обещание (Wer + Kernerlebnis)
Возраст: Fachkräfte (Erzieher*innen, педагоги; B2B-мультипликатор).
Одно предложение: «Фахкрафт наедине с собой честно проходит 24 утверждения
о своём профессиональном „я" и уходит с приватным, доброжелательным отчётом:
мои сильные стороны + один конкретный импульс роста на область».

## 3. Движок и петля (Wie)
Движок: checkliste/bericht (родитель: kriterien-check), но вместо чекбокса —
4-ступенчатая самооценка (trifft zu / eher / eher nicht / nicht).
Основная петля: утверждение → самооценка одним тапом → прогресс «отвечено
X von 24» → приватный отчёт растёт на глазах внизу → импульс роста →
через несколько месяцев новый заход (сравнение только с собой, в голове).
Реиграбельность: повторная рефлексия во времени; кнопка-переключатель
позволяет пересматривать ответы; бэкап-файл переносит стенд на новое
устройство.

## 4. Lernziele / Nutzwert (проверяемые!)
1. Фахкрафт может **назвать** свои сильные стороны в 4 областях
   (отчёт формулирует их явно, wertschätzend).
2. Фахкрафт может **выбрать** один конкретный шаг развития — импульс
   недельного масштаба («попробуй на этой неделе…»), не абстракцию.
3. Фахкрафт может **объяснить** разницу между саморефлексией и оценкой:
   в инструменте нет баллов, сравнения и «правильных» ответов.
(Проверка в Praxistest: «покажи, что тебе дал отчёт», «что попробуешь?»)

## 5. Контент-план
Единица контента: рефлексивное утверждение с тремя текстами.
MVP: 24 утверждения = 4 области × 6 (`daten/fragen.json`). Схема данных:
`stufen[{id,text}]` (4 ступени),
`bereiche[{id,name,emoji,fokus,impulsWennStark,aussagen[{id,text,staerke,impuls}]}]`.
Дидактический анти-шаблон-тест (node:test): ровно 4×6, все тексты ≥ 20
знаков, ступени ровно 4 и известны логике, запрет оценочной лексики
(Score/Ranking/Diagnose/Bewertung/Defizit…) во всём датасете; отчёт без
процентов и «Punkte».

## 6. Политика соответствия (Pflicht, docs/02)
[x] Werbefrei / без покупок  [x] Без аккаунтов и персональных данных
(анонимно; никакие имена — ни детей, ни коллег — не вводятся вовсе)
[x] Без внешних запросов (CSP `default-src 'self'` + installiereNetzwerkWaechter)
[x] localStorage: только ответы `sp.status` + кнопка «Alle Daten löschen»
[x] Privacy by default (ноль запросов привилегий; «Nur für dich» в UI и отчёте)
[x] Mobile First 360px/48px (kinder-ui-классы)
[ ] Vorlesen — n/a: инструмент для взрослых без детского контента
(по образцу kriterien-check/kita-wochenplaner)
[x] Offline после загрузки  [x] eltern.html как Info für Träger & Leitung
[x] Impressum/DSGVO (ссылка ../../impressum.html)
Особые риски темы: инструмент касается САМОГО работника → главный риск —
превращение в инструмент контроля работодателя. Ответ: технически нет
сервера/экспорта к третьим лицам, отчёт только текстом на устройстве;
eltern.html фиксирует добровольность и Betriebsrat/MAV-дружественность
(§ 87 Abs. 1 Nr. 6 BetrVG — не Überwachungseinrichtung). Без Score/Ranking
(дух EU AI Act, хотя KI здесь нет — только правила). Urheberrecht: из
Праляски взята только концепция, все 72+ текста написаны заново.

## 7. Стандарты и финансирование (Wofür)
Стандарты: DSGVO (ноль передаваемых данных) · § 22a SGB VIII /
Landes-Bildungspläne (Qualitätsentwicklung, Selbstevaluation) · BetrVG/MVG
(не средство контроля) · EU AI Act (никакого скоринга людей) · BFSG
(aria-Labels, крупные тач-цели). Förder-Fit: B2B-мультипликатор
(Träger, Fachschulen, Fortbildung — см. docs/10 «B2B-Multiplikatoren»);
козырь против облачных HR-инструментов: «lokal, anonym, gratis».

## 8. Аджайл-оценка
Aufwand: S (контент-пак + тонкая обвязка на готовых паттернах).
Что переиспользуем: kinder-ui (el, CSS), kinderschutz (NetzwerkWaechter),
паттерн отчёта kriterien-check, koffer-муster mitmach-arena, схемные тесты
foerder-navigator/kita-wochenplaner. Первый срез (playable): 24 утверждения +
4 ступени + отчёт + удаление + бэкап (готово в MVP).

## 9. Praxistest-гипотезы
Что проверяем на 5-8 фахкрафтах: верят ли в приватность (или боятся, что
«начальство увидит»)? Достаточно ли одного импульса на область — или хочется
весь список? Не читается ли «Auf gutem Weg» как оценка? Возвращаются ли через
месяцы (нужно ли напоминание — и как без пушей)? Понятен ли повторный клик
как «убрать ответ»?

## Vorlesen (Entscheidung 28а)

Keine Vorlese-Pflicht. Dieses Werkzeug richtet sich an Erwachsene. Die Zeile „есть озвучивание“ der Checkliste in `docs/02-anforderungen.md` gilt für Kinder-Apps (Ergänzung 28а vom 27.10.2026, am 29.10.2026 in die GDD übernommen).

## Seitenangaben (Serie C, Pilot 29.10.2026)

Seitenangaben maschinell gegen den Quelltext geprüft, noch nicht von einem Menschen geprüft.

Geprüft wurden alle Seitenangaben dieser Datei gegen die Textkopie der Pralęska (`tools/app-seiten-pruefen.mjs`, Urteil je Angabe im Lauf vom 29.10.2026). Das ist eine maschinelle Prüfung, keine Prüfung durch einen Menschen.

Ergebnis: Die Angaben (S. 19 bis 20) stimmen als Übersetzung des Abschnitts «Autodiagnostik des beruflichen Ich». Keine Korrektur.
