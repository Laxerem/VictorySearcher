---
description: Rules for maintaining docs/ai-collaboration.md — the AI collaboration log that captures episode context and rejected decisions
paths:
  - "*/ai-collaboration.md"
---

# docs/ai-collaboration.md — Maintenance Rules

`docs/ai-collaboration.md` is a living log of the collaboration between the user and Claude. It records what happened during each development episode and which significant decisions were rejected.

## File structure

```markdown
# История работы с ИИ

## Эпизоды

### <Episode title>

**Контекст:** <What was happening in this episode — general direction, what the user was working on. 2–4 sentences, no implementation details.>

#### Отказ от решений

1. Claude предлагал <X> — отвергнуто, потому что <reason>
2. ...
```

## Episodes

- An episode = a chapter of development (general focus area, not step-by-step details)
- **Max 10 episodes for the entire project**
- Claude decides when to propose a new episode — but always asks the user before creating one
- The **Context** block is filled by Claude based on the conversation; it describes what the user was doing at a high level

## When to add a rejection entry

**Add** when the user rejects a decision that:
- Changes the overall direction of implementation
- Concerns architecture, patterns, key libraries, or approach
- Would leave future context incomplete without this record

**Do NOT add** for:
- Minor style, formatting, or naming changes
- Small implementation details
- Anything that doesn't affect the big picture

## Procedure

1. User rejects a solution (architectural or code)
2. Claude judges: does this rejection change the course of implementation?
3. If **yes** — Claude asks the user: should this be logged, and in which episode?
4. If the user confirms — Claude adds the entry

**Never write to the file automatically. Always ask the user first.**

## Entry format

```
<number>. Claude предлагал <X> — отвергнуто, потому что <reason given by user>
```
