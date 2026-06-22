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

## ADR-004: Один пользователь из конфига (JWT)
- Username/Password в appsettings.json → JWT при /api/auth/login
- Без БД пользователей, без регистрации
- **Why:** Внутренний сервис, малое число пользователей, экономия времени.

## ADR-005: HH + SuperJob официальные API
- HH: api.hh.ru/vacancies (GET без OAuth для публичных вакансий)
- SuperJob: api.superjob.ru (регистрация приложения → API ключ)
- Rate limit: задержки 1-2с, кэш снимков в БД на 24ч
- **Why:** Легальный путь, уважение лимитов — явное требование ТЗ.

## Схема БД (ключевые таблицы)
- Vacancies, ScoringSessions, Resumes, ScoringResults (скоринг)
- MarketRoles, MarketSnapshots, MarketVacancies (аналитика)

## Метрики аналитики рынка
- Средняя / медианная ЗП (min/max/median по роли)
- Динамика ЗП по времени (хранить снимки в MarketSnapshots)
- Топ навыков в вакансиях (частота)
- Количество вакансий / количество компаний-нанимателей
