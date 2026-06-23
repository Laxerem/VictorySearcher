# ARCHITECTURE.md — VictorySearcher

> Живой документ. Обновляется при изменении архитектурных решений.

---

## Обзор

Внутренний инструмент для HR: скоринг резюме (LLM) + аналитика рынка труда (HH, SuperJob).  
Монолит. Деплой — Docker Compose на машине предприятия.

---

## VictorySearcher.Service

### Архитектурный паттерн

**Clean Architecture** — 4 слоя, зависимости направлены строго внутрь:

```
API → Application → Domain
Infrastructure → Application → Domain
```

| Слой | Проект | Ответственность |
|------|--------|-----------------|
| Domain | `*.Domain` | Сущности, перечисления, интерфейсы репозиториев |
| Application | `*.Application` | Use cases, команды/запросы, бизнес-логика |
| Infrastructure | `*.Infrastructure` | EF Core, Hangfire, LLM-клиент, парсеры, HTTP-клиенты HH/SuperJob |
| API | `*.Api` | HTTP-эндпоинты, auth middleware, конфигурация DI |

### Стек

| Компонент | Выбор | Причина |
|-----------|-------|---------|
| Runtime | .NET 8 | Основной стек команды |
| БД | PostgreSQL + EF Core | Реляционные данные, снимки рынка, задачи Hangfire |
| Фоновые задачи | **Hangfire** | Persistence при рестарте, cron, retry, встроенный dashboard |
| LLM | polza.ai (OpenAI SDK) | OpenAI-совместимый → смена провайдера без рефакторинга |
| Парсинг резюме | PdfPig + DocumentFormat.OpenXml | PDF и DOCX без внешних зависимостей |
| Авторизация | JWT из `appsettings.json` | Один внутренний аккаунт, без регистрации |

### Ключевые сущности (Domain)

- **Vacancy** — вакансия рекрутёра
- **Resume** — загруженный файл резюме
- **ScoringRequest** — сессия скоринга (1 вакансия → N резюме)
- **ScoringResult** — оценка одного резюме (overall / experience / skills / extra / reasoning)
- **User** — один системный пользователь

### Фоновые задачи (Hangfire)

```
ScoringJob       — запускается вручную рекрутёром; обрабатывает резюме батчами через LLM
MarketCollectJob — cron ежедневно; собирает вакансии с HH + SuperJob, строит снимок
```

### Схема БД (логические группы)

```
[Скоринг]            [Аналитика рынка]
Vacancies            MarketRoles
Resumes              MarketSnapshots
ScoringRequests      MarketVacancies
ScoringResults
```

Hangfire хранит свои таблицы в том же PostgreSQL.

### Репозитории и Unit of Work

Репозитории только стейджируют изменения в `DbContext` (Add/Update/Remove) — `SaveChangesAsync` не вызывается. Сохранение выполняется в Application-сервисах через `IUnitOfWork.SaveChangesAsync()` один раз на use case.

### Внешние интеграции

| Сервис | Метод доступа | Ограничения |
|--------|--------------|-------------|
| HH (api.hh.ru) | GET без OAuth (публичные вакансии) | Задержки 1–2 с, кэш снимков 24 ч |
| SuperJob (api.superjob.ru) | API-ключ приложения | Задержки 1–2 с, кэш снимков 24 ч |
| polza.ai | OpenAI SDK, переопределённый BaseUrl | Structured output (json_object) |

---

## Нефункциональные требования

- **Автономность** — фоновые задачи работают по расписанию без ручного вмешательства
- **Безопасность данных** — все данные (резюме, зарплаты) хранятся локально
- **Rate limit compliance** — задержки и кэш при обращении к внешним API
- **Расширяемость** — новый источник рынка = новый `IMarketCollector` в Infrastructure
