---
name: adr-core
description: Ключевые архитектурные решения (ADR) по проекту VictorySearcher
metadata:
  type: project
---

## ADR-001: Clean Architecture Monolith
- 4 слоя: Domain / Application / Infrastructure / API
- **Why:** 3-дневный дедлайн, внутренний сервис, малая нагрузка. Монолит быстрее в разработке и проще в деплое.

## ADR-002: Hangfire для фоновых задач
- Вместо BackgroundService / IHostedService
- **Why:** Persistence (задачи не теряются при рестарте), retry-политики, cron-расписание, dashboard (/hangfire). Критично для скоринга N резюме и ежедневного сбора данных.
- Хранится в том же PostgreSQL.

## ADR-003: polza.ai через OpenAI SDK
- NuGet: `OpenAI` SDK, переопределяем BaseUrl на polza.ai endpoint
- Structured output (response_format: json_object) для скоринга
- **Why:** OpenAI-совместимый провайдер → легко сменить в будущем.

## ADR-004: User в БД, seed из конфига (JWT)
- Username/Password в appsettings.json (JwtOptions)
- При старте `AppDbContextSeed` создаёт User в БД если его нет (BCrypt.Net-Next для хэша)
- JWT-авторизация валидирует против конфига (не DB-запрос при каждом логине)
- User в БД нужен для FK-целостности: `Vacancy.CreatedById` = Guid → User.Id
- **Why:** FK-целостность на уровне БД. Пользователь принял решение хранить User в БД.

## ADR-005: HH + SuperJob официальные API
- HH: api.hh.ru/vacancies (GET без OAuth для публичных вакансий)
- SuperJob: api.superjob.ru (регистрация приложения → API ключ)
- Rate limit: задержки 1-2с, кэш снимков в БД на 24ч
- **Why:** Легальный путь, уважение лимитов — явное требование ТЗ.

## Схема БД (реализованные таблицы — миграция InitialCreate от 2026-06-23)
**Скоринг:** Users, Vacancies, Resumes, ScoringRequests, ScoringResults
**Аналитика (запланировано):** MarketRoles, MarketSnapshots, MarketVacancies

## Реализованный стек (Infrastructure)
- `Npgsql.EntityFrameworkCore.PostgreSQL 9.0.4` (не 10.x — требует net10.0)
- `BCrypt.Net-Next 4.2.0` — хэш пароля при seed
- `Microsoft.Extensions.Options.ConfigurationExtensions` — нужен для `Configure<T>(section)` в DI
- EF конфиги через `IEntityTypeConfiguration<T>`, применяются через `ApplyConfigurationsFromAssembly`
- `ScoringResult.Incongruity: bool` — флаг критического несоответствия (вместо IsRedFlagged)

## ADR-006: Unit of Work вместо SaveChangesAsync в репозиториях
- `IUnitOfWork` (в Domain/Repositories) + реализация `UnitOfWork` (в Infrastructure/Persistence)
- Репозитории только стейджируют изменения; Application-сервис вызывает `IUnitOfWork.SaveChangesAsync()` один раз на use case
- **Why:** Атомарность: несколько репозиторных операций в рамках одного use case сохраняются одной транзакцией. Чистое разделение ответственности.

## Метрики аналитики рынка
- Средняя / медианная ЗП (min/max/median по роли)
- Динамика ЗП по времени (хранить снимки в MarketSnapshots)
- Топ навыков в вакансиях (частота)
- Количество вакансий / количество компаний-нанимателей
