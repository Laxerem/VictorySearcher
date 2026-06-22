---
name: write-claude-md
description: Guides how to create or improve a CLAUDE.md file for a Claude Code project. Use when asked to write, create, fill, or review a CLAUDE.md, or when setting up project context for Claude agents.
when_to_use: Trigger when the user says "create CLAUDE.md", "write CLAUDE.md", "add CLAUDE.md", "update CLAUDE.md", or asks how to document a project for Claude Code.
---

## Purpose of CLAUDE.md

CLAUDE.md is loaded automatically into every Claude Code session. Its job is to give Claude enough context to work in the project **without asking** — understanding the structure, conventions, and rules it must follow.

Think of it as onboarding docs for a new developer who already knows the tech stack but has never seen this codebase.

---

## Language

Always write CLAUDE.md in **English**. It is read by Claude agents across sessions and must be consistent with the rest of the project's technical documentation.

---

## What to include

| Category | Examples |
|----------|---------|
| **Project overview** | What the product does, in 1–3 sentences |
| **Key docs references** | Where to find the spec, architecture doc, design system |
| **Directory structure** | Top-level folders and what each owns — not every file |
| **Key patterns** | Data flow, naming conventions, important constraints |
| **Code conventions** | Style rules that differ from language defaults |
| **Post-change verification** | Commands to run after editing code (lint, build, tests) |
| **What NOT to do** | Explicit prohibitions (hardcode, bypass, etc.) |

---

## What NOT to include

- **Implementation details** — architecture, ADRs, component inventories belong in separate docs (e.g., `ARCHITECTURE.md`). Link to them instead.
- **Every file and component** — enumerate folders, not leaves.
- **Things derivable from the code** — linting rules, type signatures, obvious patterns.
- **Procedures and checklists** — move those into a Skill (they load only when needed, saving context).
- **Motivation and history** — "we chose X because…" belongs in ADRs, not CLAUDE.md.

---

## Structure template

```markdown
# CLAUDE.md — <Project Name>

<One-paragraph product description.>

## Key docs

| File | When to read |
|------|-------------|
| `path/to/spec.md`          | Understanding what the product should do |
| `path/to/ARCHITECTURE.md`  | Understanding how the code is structured  |

---

## Tech stack

- **<Language/Framework>** — <version or note if relevant>
- **<Key library>** — <purpose>

---

## Directory structure

```
src/
├── <folder>/   # <one-line responsibility>
├── <folder>/   # <one-line responsibility>
└── <key-file>  # <one-line purpose>
```

---

## Key patterns

### <Pattern name>
<2–4 sentences describing the pattern and why it matters for writing correct code here.>

---

## Conventions

- <Rule 1>
- <Rule 2>
- <Explicit prohibition>

---

## Post-change checklist

```bash
# Run after every code change — add the actual commands for this project
<lint command>   # e.g. npm run lint
<build command>  # e.g. npm run build / tsc --noEmit
```

- <What passing lint means for this project>
- <What a clean build guarantees>
```

---

## Sizing guidelines

- **Hard limit: ~150 lines.** Beyond that, split content into linked docs or Skills.
- Each pattern description: 2–4 sentences max.
- Folder descriptions: one line each.
- If a section grows into a procedure → move it to `.claude/skills/<name>/SKILL.md`.

---

## Writing checklist

Before finishing a CLAUDE.md, verify:

- [ ] An agent reading only this file can navigate the codebase without asking "where does X go?"
- [ ] No file or component is listed that isn't a folder boundary or a uniquely important entry point
- [ ] Every "do this" rule has a corresponding "don't do that" counterpart where the opposite is tempting
- [ ] Linked docs exist at the paths referenced
- [ ] The file stays under the line limit
- [ ] The file is written in English
- [ ] A post-change checklist with project-specific commands is included (if available)
