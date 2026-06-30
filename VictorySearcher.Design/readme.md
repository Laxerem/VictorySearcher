# Victory Group — Design System

**Victory Group** (also seen as *VictorySearch*) is a Russian IT & performance-marketing
agency. It sells a bundle of digital growth services — **лидогенерация** (lead-gen),
**реклама** (paid ads / performance), **SEO-продвижение**, **управление репутацией**
(reputation / ORM), **digital**, and **разработка** (brand identity + websites) — to
businesses that want "взрывной рост" (explosive growth). The brand voice is confident,
results-driven, and quantified ("Передали целевых клиентов нашим партнёрам: > 3 000 000").

The visual language is **premium dark / near-black**, with heavy geometric uppercase
display type, dark metallic 3D objects, faint engineering-grid textures, and **restrained
neon accents** (one per service category) used only as glowing labels and map hotspots —
never as backgrounds. The logo is a sharp **chevron / arrow "V"** mark beside a techno
"VICTORY group" wordmark.

## Sources provided
- Six reference screenshots of the production marketing site (`uploads/1.png`…`6.png`),
  copied into `assets/`:
  - `1.png` → CTA block "Пора переходить от слов к делу" (phone + interest checkboxes)
  - `2.png` → homepage hero, neon Russia map ("IT-решения для эффективного маркетинга")
  - `3.png` → "Наша история" timeline (2021→2025 growth metrics)
  - `4.png` → "Комплексное продвижение вашего бизнеса" services grid
  - `5.png` → "Все кейсы компании Victory Group" (cases listing)
  - `6.png` → Victory Group logo
- No codebase, Figma, or live URL was provided. Recreations here are built from the
  screenshots + brand inference, not from production source — treat exact pixel values as
  close approximations, not canon.

---

## CONTENT FUNDAMENTALS

**Language:** Russian. UI/marketing copy only — no English except product/tech names
(SEO, Digital, VDL Service, Performance, 2GIS, Google).

**Tone:** assertive, benefit-first, slightly aggressive growth-sales energy. Speaks to a
business owner. Promises outcomes, backs them with big round numbers.

**Person & address:** addresses the reader as **вы / ваш** ("продвижение **вашего**
бизнеса", "приведём **вам** клиентов"). The agency speaks as **мы** through verbs in
1st-person-plural future: **"Разработаем… Укрепим… Подключим… Увеличим… Настроим…"** —
a signature pattern: an offering = a single confident future-tense verb.

**Casing:** Headings are **ALL-UPPERCASE** display type. Eyebrows/overlines are uppercase,
wide-tracked ("ГОТОВЫ К ВЗРЫВНОМУ РОСТУ?", "НАША ИСТОРИЯ"). Body and form labels are
sentence case. Buttons are uppercase ("ОТПРАВИТЬ", "ХОЧУ БОЛЬШЕ КЛИЕНТОВ").

**Numbers:** big, formatted with spaces as thousands separators and a leading `>`
("> 3 000 000", "20 000", "+91%", "ДРР ~20%"). Used as proof.

**Emoji:** none. The brand never uses emoji. Energy comes from type, contrast, and neon —
not decoration.

**Example copy:**
- Eyebrow → heading → action: *"Готовы к взрывному росту?" → "Пора переходить от слов к
  делу" → [Отправить]*
- Hero: *"IT-решения для эффективного маркетинга" / "Выбирайте работать с лучшими" /
  [Хочу больше клиентов]*
- Offering: *"Укрепим доверие — Поднимем рейтинг на Яндекс.Картах, Google, 2GIS и других
  сервисах, чтобы ваши клиенты не сомневались в выборе."*

---

## VISUAL FOUNDATIONS

**Color.** Foundation is a ladder of near-blacks (`--vg-ink-900` page `#050506` →
`--vg-ink-500` hairline `#26262b`); pure `#000` exists for max-contrast panels. Text is a
warm-neutral gray ramp (strong `#f4f4f5` → faint `#6a6a71`). The primary **action** color
is, counter-intuitively, **light** (`#e9e9ea`) — buttons are light rectangles with dark
text on the dark field. **Neon accents** are a 4-color category set — orange `#ff6a1a`
(Реклама), cyan `#1e9cff` (Лидогенерация), magenta `#c026d3` (Digital), green `#3bdc6b`
(Репутация) — applied *only* as glowing text/labels/hotspots, never as fills or gradients
behind content. Use at most one accent in a given view; keep them rare so the glow reads
as special.

**Type.** Two families. Display = **Unbounded** (geometric, heavy, uppercase, slight
negative tracking) for all headings. Text/UI = **Manrope** (clean geometric humanist sans).
> ⚠️ **Font substitution.** The production site uses a proprietary techno grotesque (a
> TT-style custom family) that isn't publicly licensable. Unbounded + Manrope are the
> closest free Google matches. **If you have the real brand font files, drop them in and
> update `tokens/fonts.css` — please send them so we can swap.**

**Spacing & layout.** 4px base grid. 1280px max container, 40px gutters, ~112px section
rhythm. Generous vertical breathing room; left-aligned editorial blocks.

**Backgrounds.** Always dark. Layered: (1) base near-black, (2) optional faint engineering
**grid** texture (`--bg-grid`, 64px, ~3.5% white lines), (3) dark **metallic / 3D**
photographic imagery (cool, desaturated, high-contrast specular highlights, often a single
hard "lens-flare" streak — see the timeline 2.png/3.png). Imagery vibe = cool, monochrome,
moody, no warmth except a deliberate neon. No gradient *fills* behind text; gradients exist
only as subtle card top-lighting and as photo→ink dissolve overlays.

**Corners & cards.** **Sharp.** Radii are tiny (`--radius-sm` 4px on chrome, 2px on
checkboxes); cards are essentially square. A card = subtle top-lit dark gradient
(`--grad-card`) + 1px hairline border (`#26262b`) + deep soft shadow
(`0 24px 60px -24px #000`). On the services grid, card chrome is **invisible until
hover/active** — only the highlighted block gets the gradient + border.

**Shadows.** Dark-on-dark and deep: card `--shadow-card`, raised `--shadow-raised`, button
`--shadow-btn`. Plus neon **glows** (`--glow-*`, a soft 24px colored halo) reserved for
accent labels/icons.

**Borders.** Hairlines everywhere (1px `#26262b`) — they divide the header into cells,
outline cards, and underline inputs. Stronger `#3a3a41` for checkboxes / secondary buttons.

**Motion.** Restrained and crisp. `--ease-out` for entrances/hover, 140–240ms. No bounce,
no parallax gimmickry, no infinite loops. Hover = lighten fill / brighten border / -2px
lift on cards. Press = `scale(0.94)` (icon buttons) or `translateY(1px)` (buttons).

**Transparency & blur.** Sticky header uses `rgba(5,5,6,0.82)` + `backdrop-filter: blur`.
Photo sections use linear ink-gradient scrims so text stays legible over imagery. Floating
contact buttons use translucent dark circles with hairline borders.

---

## ICONOGRAPHY

The production site uses a small set of **line (stroke) icons**, ~1.5px weight, square-ish
caps — most visibly the floating **contact rail** (WhatsApp / Telegram / phone) as outlined
circles on the right edge, a 3×3 **dot grid** glyph in the "Все продукты" mega-menu trigger,
small **chevron "›"** affordances in service-card corners, and dropdown caret chevrons in
the nav. No icon font or sprite was available from the (absent) source.

**Approach in this system:** icons are inline SVG in `ui_kits/website/shared.jsx`
(`IconChat`, `IconSend`, `IconPhone`, `IconGrid`, `IconArrow`, `IconChevDown`) — thin
1.5px strokes, `currentColor`, square line-caps to match the brand.
> ⚠️ **Substitution.** These are hand-matched stand-ins, not the brand's real icon set.
> For production, swap in a consistent 1.5px line set (e.g. **Lucide** / **Tabler** via CDN,
> both close in weight) or the brand's own SVGs if you have them. Keep stroke weight ~1.5px,
> square caps, monochrome. **No emoji, no unicode-glyph icons.**

---

## Index / manifest

**Root**
- `styles.css` — entry point; `@import`s all tokens (link this one file).
- `tokens/` — `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `fonts.css`.
- `assets/` — `logo.png`, `hero-map.png`, `bg-metal.png`, `cases-banner.png`, `cta-block.png`.
- `SKILL.md` — Agent-Skill wrapper.

**Components** (`components/`) — bundled & namespaced for consumers:
- `buttons/` — `Button` (primary / secondary / ghost; sm/md/lg), `IconButton` (square / circle).
- `forms/` — `Input` (underline / box), `Checkbox`.
- `display/` — `Eyebrow`, `Badge` (neutral + 4 neon accents), `Card`, `ServiceCard`.

**UI kit** (`ui_kits/website/`) — interactive marketing-site recreation:
- `index.html` (Header · Hero · Services · CTA form), `shared.jsx`, `Header.jsx`,
  `Hero.jsx`, `Services.jsx`, `CtaForm.jsx`.

**Foundation cards** (`guidelines/`) — Design System tab specimens for Colors, Type,
Spacing, Brand.
