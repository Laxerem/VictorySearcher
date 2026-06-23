> Before any changes, read the root `../CLAUDE.md`.

# CLAUDE.md — VictorySearcher.Service

VictorySearcher is an internal HR automation tool with two features: LLM-powered resume scoring (recruiter uploads CVs against a vacancy, gets a ranked list with explanations) and automated daily labor market analytics collected from HH and SuperJob APIs.

## Key docs

| File | When to read |
|------|-------------|
| `docs/TASK.md` | Understanding what the product must do and the acceptance criteria |
| `docs/ARCHITECTURE.md` | Understanding layers, technology choices, and data model groups |
| `docs/technical specification.md` | Original problem statement — read when requirements feel ambiguous |

---

## Tech stack

- **.NET 9 / C# 12** — primary constructors, collection expressions `[]`, file-scoped namespaces
- **PostgreSQL + EF Core 9** — code-first, migrations, Npgsql driver
- **Hangfire** — persistent background jobs with cron scheduling and retry; dashboard at `/hangfire`
- **polza.ai via OpenAI SDK** — LLM scoring; `BaseUrl` overridden in config
- **BCrypt.Net** — password hashing for the single seeded user

---

## Directory structure

```
VictorySearcher.Service/
├── VictorySearcher.Service.Domain/          # Entities, enums, repository interfaces — zero dependencies
│   ├── Entities/
│   ├── Enums/
│   └── Repositories/
├── VictorySearcher.Service.Application/     # Service interfaces, DTOs — depends on Domain only
│   └── <Feature>/
│       └── Dtos/
├── VictorySearcher.Service.Infrastructure/  # EF Core, Hangfire, HTTP clients, job classes, service impls
│   ├── Jobs/
│   ├── Options/
│   ├── Persistence/
│   │   ├── Configurations/
│   │   └── Repositories/
│   └── Services/
└── VictorySearcher.Service.Api/             # Controllers, request models, Program.cs
    ├── Controllers/
    └── Requests/
```

---

## Key patterns

### Clean Architecture — strict dependency rule
Domain has zero external references. Application references Domain only. Infrastructure and Api never reference each other. Each layer self-registers via an `AddX()` extension on `IServiceCollection`; `Program.cs` calls only `AddApplication()` and `AddInfrastructure()`.

### Application — plain service interfaces
Application exposes `IFeatureService` interfaces with `Result<T>` return types — no MediatR, no CQRS. Implementations live in `Infrastructure/Services/`. DTOs are `record` types placed in `Application/<Feature>/Dtos/` alongside the interface they belong to.

### Result<T> — business error handling
Service methods return `Result<T>` for expected failures (not found, invalid state) instead of throwing exceptions. Controllers check `result.IsSuccess` and map to appropriate HTTP status codes. Infrastructure-level exceptions (DB, network) propagate normally and are caught by global middleware.

### Repositories + Unit of Work
Each aggregate root has an interface in `Domain/Repositories/` and an EF Core implementation in `Infrastructure/Repositories/`. Write methods only stage changes (Add/Update/Remove on DbSet) — they never call `SaveChangesAsync`. Persistence is committed once per use case via `IUnitOfWork.SaveChangesAsync()`, injected into Application services alongside the repositories they need.

### EF Core — one configuration class per entity
Every entity has its own `IEntityTypeConfiguration<T>` in `Infrastructure/Persistence/Configurations/`. `AppDbContext.OnModelCreating` only calls `ApplyConfigurationsFromAssembly` — never configure inline.

---

## Conventions

- **Brace style: K&R** — opening brace on the same line for all blocks (class, method, if, foreach, etc.)
- Primary constructors for all classes that receive dependencies via DI
- Expression-bodied members for single-expression methods and properties
- `CancellationToken ct = default` as the last parameter in every `async` method
- `var` for local variables; explicit type only when not obvious from the right-hand side
- `= null!` for required navigation properties; `?` suffix for genuinely optional fields
- No `.Result` or `.Wait()` — always `await`
- Controllers return `IActionResult`; decorate with `[Authorize]` where authentication is required

### What NOT to do

- Do not add business logic to controllers or repositories
- Do not reference `Infrastructure` from `Application`
- Do not call `SaveChangesAsync` inside a repository — stage changes only; commit via `IUnitOfWork`
- Do not hardcode credentials or connection strings — all config goes through the Options pattern

---

## Progress tracking

After implementing any user-visible feature or changing business logic, update `progress.json` — see `../.claude/rules/progress-json.md`.

---

## Post-change checklist

```bash
# After any code change
dotnet build VictorySearcher.Service.slnx

# After adding/changing an entity or EF configuration
dotnet ef migrations add <Name> \
  -p VictorySearcher.Service.Infrastructure \
  -s VictorySearcher.Service.Api
```
