---
name: git-commit
description: >
  How to create git commits in this project. Use this skill whenever the user
  asks to commit, make a commit, or save changes to git — even if they just
  say "закоммить это" or "сделай коммит".
---

# Git Commit

## Message format

```
<type>(<scope>): <short description>
```

**type** — `feat`, `fix`, `refactor`, `docs`, `chore`  
**scope** — `service`, `web`, `api`, `claude`; multiple scopes via `|` (e.g. `service|api`)  
**description** — lowercase, no period at the end

**Examples from the project:**
```
feat(service): resume scoring pipeline
refactor(service): extract LLM client and prompt builder
fix(service|api): bearer token authorization
feat(web|feature): creating vacancy form, file loader
```

## Staging files

Stage specific files by name — never use `git add -A` or `git add .`.
This avoids accidentally including `.env` files, secrets, or large binaries.

## What NOT to do

- **No `Co-Authored-By:` line** — the user does not want author headers added by Claude
- **No `--no-verify`** — never skip hooks unless the user explicitly asks
- **No committing unless asked** — only commit when the user explicitly requests it
