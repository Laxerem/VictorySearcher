# external-api.md — Внешние API: обзор

Общая карта: какие эндпоинты каких источников дают данные для каждого аналитического среза.  

Детали запросов и схемы ответов в отдельных документах [здесь](./sources/).

---

## Источники

| Источник | Base URL | Аутентификация |
|----------|----------|---------------|
| HH.ru | `https://api.hh.ru` | OAuth2 `client_credentials`; справочники — без токена |
| SuperJob | `https://api.superjob.ru/2.0` | API-ключ в заголовке `X-Api-App-Id` |

---

## Что собираем и откуда

### 1. Зарплатная вилка (P25 / Median / P75) → `SalaryAggregate`

Срез: роль × грейд × регион.

| Источник | Эндпоинт | Поля |
|----------|----------|------|
| HH.ru | [`GET /vacancies`](./sources/hh/hh.md#get-vacancies--поиск-вакансий) | `salary.from`, `salary.to`, `salary.currency`, `salary.gross` |
| SuperJob | [`GET /vacancies/`](./sources/superjob/superjob.md#get-vacancies--поиск-вакансий) | `payment_from`, `payment_to`, `currency` |

Агрегация (P25/Median/P75) считается на стороне сервиса по собранному массиву значений.  
Фильтры: `professional_role` + `area` + `experience` (HH) / `catalogues` + `town` + `experience` (SJ).

---

### 2. Число активных вакансий + новые за день → `MarketSnapshot.TotalVacancies`

| Источник | Эндпоинт | Поля |
|----------|----------|------|
| HH.ru | [`GET /vacancies`](./sources/hh/hh.md#get-vacancies--поиск-вакансий) `?per_page=1` | `found` — итоговое число без скачивания всех страниц |
| SuperJob | [`GET /vacancies/`](./sources/superjob/superjob.md#get-vacancies--поиск-вакансий) `?count=1` | `total` |

Для тренда — повторяем запрос с `date_from` / `date_to`.  
Новые за день: `date_from=<вчера>` → `found` / `total`.

---

### 3. Навыки / частота требований → `SkillStat`

| Источник | Эндпоинт | Поля |
|----------|----------|------|
| HH.ru | [`GET /vacancies/{id}`](./sources/hh/hh.md#get-vacanciesid--детальная-карточка-вакансии) | `key_skills[].name` — только в детальной карточке, не в листинге |
| SuperJob | [`GET /vacancies/`](./sources/superjob/superjob.md#навыки--особенность-superjob) | нет структурированного поля; парсим `candidat` из основного листинга |

HH: сначала `GET /vacancies` → берём первые 200–500 ID → для каждого `GET /vacancies/{id}`.  
SuperJob: `candidat` доступен прямо в листинге — отдельный запрос по ID не нужен.

---

### 4. Работодатели / доля рынка → `EmployerStat`

| Источник | Эндпоинт | Поля |
|----------|----------|------|
| HH.ru | [`GET /vacancies`](./sources/hh/hh.md#get-vacancies--поиск-вакансий) (листинг) | `employer.id`, `employer.name` — считаем частоту по выборке |
| HH.ru | [`GET /employers/{id}`](./sources/hh/hh.md#get-employersid--информация-о-работодателе) | `open_vacancies` — для топ-N работодателей |
| SuperJob | [`GET /vacancies/`](./sources/superjob/superjob.md#get-vacancies--поиск-вакансий) (листинг) | `firm_name`, `firm_id` |

`MarketShare = VacancyCount / TotalVacancies` считается локально.

---

### 5. Сырые вакансии → `VacanciesAnalysis`

Полная запись каждой собранной вакансии — используется как база для всех агрегатов выше и для дальнейшего анализа без повторных запросов к API.

| Источник | Эндпоинт | Ключевые поля |
|----------|----------|--------------|
| HH.ru | [`GET /vacancies`](./sources/hh/hh.md#get-vacancies--поиск-вакансий) | `id`, `name`, `salary.*`, `experience.id`, `employment.id`, `schedule.id`, `employer.*`, `published_at` |
| HH.ru | [`GET /vacancies/{id}`](./sources/hh/hh.md#get-vacanciesid--детальная-карточка-вакансии) | `description` (HTML), `key_skills[]` |
| SuperJob | [`GET /vacancies/`](./sources/superjob/superjob.md#get-vacancies--поиск-вакансий) | `id`, `profession`, `payment_from`, `payment_to`, `experience`, `firm_name`, `date_published` |

---

## Справочники (однократно при старте `MarketCollectJob`)

Нужны для построения параметров запросов к `/vacancies`. Кэшируются на время выполнения задачи.

| Эндпоинт | Что даёт | Источник |
|----------|---------|---------|
| [`GET /areas`](./sources/hh/hh.md#get-areas--дерево-регионов) | ID регионов → `AnalysisTarget.AreaId` | HH.ru |
| [`GET /professional_roles`](./sources/hh/hh.md#get-professional_roles--профессиональные-роли) | ID ролей → `AnalysisTarget.ProfessionalRoleId` | HH.ru |
| [`GET /dictionaries`](./sources/hh/hh.md#get-dictionaries--общие-справочники) | `experience`, `employment`, `schedule`, `currency.rate` | HH.ru |
| [`GET /catalogues/`](./sources/superjob/superjob.md#get-catalogues--каталог-профессий) | Каталог категорий и профессий | SuperJob |
| [`GET /towns/`](./sources/superjob/superjob.md#get-towns--города) | ID городов | SuperJob |

---

## Схема потока данных

```
AnalysisTarget (roleId, areaId, sources)
        │
        ▼
┌───────────────────────────┐
│     MarketCollectJob      │  (ежедневно, Hangfire cron)
└───────────────────────────┘
        │
        ├─ GET /vacancies (листинг) ──────────────► MarketSnapshot
        │    ↳ found / total                         VacanciesAnalysis
        │    ↳ salary.from / salary.to         ────► SalaryAggregate (per experience)
        │    ↳ employer.id / employer.name     ────► EmployerStat
        │
        └─ GET /vacancies/{id} (детали) ────────────► SkillStat
              ↳ key_skills[].name                     VacanciesAnalysis.DescriptionRaw
```
