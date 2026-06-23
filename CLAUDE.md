# CLAUDE.md — VictorySearcher

Internal HR tool: LLM-based resume scoring + job market analytics.

## Services

| Service | Role |
|---------|------|
| `VictorySearcher.Service` | .NET 8 backend — scoring, jobs, API |
| `VictorySearcher.Web`     | Frontend |

## Key docs

| File | When to read |
|------|-------------|
| `docs/TASK.md`             | What the product must do |
| `docs/ARCHITECTURE.md`     | How the code is structured |
| `docs/ai-collaboration.md` | Episode context and rejected decisions |

## AI Collaboration log

When the user rejects a significant architectural or code decision, follow `.claude/rules/ai-collaboration.md` to decide whether and how to log it.
