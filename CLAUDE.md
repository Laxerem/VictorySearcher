# CLAUDE.md — VictorySearcher

Internal HR tool: LLM-based resume scoring + job market analytics.

## Services

| Service | Role |
|---------|------|
| `VictorySearcher.Service` | .NET 8 backend — scoring, jobs, API |
| `VictorySearcher.Web`     | React + TypeScript frontend |
| `VictorySearcher.Design`  | Frontend design mockups (specs, HTML/CSS prototypes, references) |

Each service has its own `CLAUDE.md`. The skills and rules below live in the repo root and apply **across the whole repository** — they are NOT auto-loaded when working inside a service subfolder, so this file must be read first.

## Key docs

| File | When to read |
|------|-------------|
| `docs/TASK.md`             | What the product must do |
| `docs/ARCHITECTURE.md`     | How the code is structured |
| `docs/ai-collaboration.md` | Episode context and rejected decisions |

## Skills (repo-wide)

Located in root `.claude/skills/`, available from any folder in the project.

| Skill | When to use |
|-------|-------------|
| `git-commit` | Any commit — when asked to "закоммить", "сделай коммит", or save changes to git |
| `write-claude-md` | Creating, filling, or reviewing any `CLAUDE.md` |

## Rules (repo-wide)

Located in root `.claude/rules/`. Apply automatically when the condition is met.

| Rule | When to apply |
|------|---------------|
| `.claude/rules/progress-json.md` | After implementing any user-visible feature — update that service's `progress.json` |
| `.claude/rules/ai-collaboration.md` | When the user rejects a significant architectural or code decision — decide whether to log it in `docs/ai-collaboration.md` (always ask the user first) |
| `.claude/rules/task-md.md` | When editing `docs/TASK.md` |

Each service may add local rules in its own `.claude/rules/` that extend these (e.g. `VictorySearcher.Service/.claude/rules/domain-entity-changes.md`).
