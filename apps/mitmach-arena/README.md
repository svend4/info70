# 🗳️ Mitmach-Arena

Инструмент детского участия: голосования для школьного класса (Klassenrat) и семьи.
Тема — фокус BzKJ 2026: **Teilhabe, Demokratiefähigkeit, Interaktion**.

**Статус: рабочий MVP.** Модель — «передай устройство»: взрослый/класс создаёт вопрос,
устройство идёт по кругу, каждый голосует одним нажатием, результат смотрят вместе
(наглядные столбики). Плюс **📦 Klassen-Koffer**: сбор голосов с нескольких устройств
без сервера.

## Klassen-Koffer (идея №6 из docs/05)

Экспорт результата в JSON-файл → файлы с разных устройств переносятся на устройство
учителя (USB-носитель, школьное файлохранилище) → импорт суммирует голоса при
совпадении вопроса и вариантов. Логика — чистый модуль `koffer.mjs`
(`packeKoffer`/`pruefeKoffer`/`vereinigeKoffer`), покрыт тестами, включая отказ от
чужих голосований и повреждённых файлов.

Почему так: критерий fragFINN «Chats» делает любой серверный обмен зоной риска
(модерация, персональные данные). Файловый обмен через взрослого даёт групповую
работу с нулевой инфраструктурой и нулевыми данными — в файле только вопрос,
варианты и числа голосов.

## Lernziele
1. Опыт демократической процедуры: предложение → голосование → принятие результата.
2. Наглядность большинства/меньшинства (столбики, проценты).
3. Культура обсуждения в классе (Klassenrat-практика); материалы для взрослых — `eltern.html`.

## Eingabefelder (Kinder-App mit Freitext)
Frage (maxlength 100) und Möglichkeiten (maxlength 60) sind Freitext. Vor dem Frage-Feld steht
sichtbar der Hinweis „Keine Namen von Mitschüler*innen eintragen.“; vor den vier Möglichkeiten-Feldern steht er
einmal gemeinsam für alle vier (eigene Elemente, nicht im label).
Das Frage-Feld verweist per `aria-describedby` auf `frage-hinweis`, die Möglichkeiten-Felder auf
`optionen-hinweis`. Der Hinweis verhindert keine Eingabe; die
Feldlängen bleiben unverändert. Tests: `test/eingabe-hinweis.test.mjs` (Quelltext-Prüfung).

## План развития (docs/04, этап 3)
- Режимы: рейтинговое голосование, «светофор».
- Кандидат в заявку BzKJ-2027 (пакет «Demokratie & KI»).

## Запуск и тесты
```bash
npm run dev   # → http://localhost:8070/apps/mitmach-arena/
npm test      # 15 Tests: Klassen-Koffer, Vorlagen, Eingabehinweis
```
