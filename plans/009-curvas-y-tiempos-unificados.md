# 009 — One set of motion tokens: a single ease-out curve and named durations

- **Status**: DONE
- **Commit**: 8d1cd16
- **Severity**: LOW
- **Category**: Cohesion & tokens
- **Estimated scope**: 2 files (`css/styles.css`, `js/app.js`), ~25 replacements, no new behaviour

## Problem

Two different "ease-out" curves are in use, and every duration is typed by hand:

- `cubic-bezier(.2,.8,.2,1)` (soft ease-out) — tower tilt (`css/styles.css:138`), card tilt return (`:270`),
  FPS bar fill (`:325`), scroll reveal (`:477`).
- `var(--ease-out)` = `cubic-bezier(0.23, 1, 0.32, 1)` (strong ease-out) — press feedback, floating button
  ripple, product sheet (plans 001, 003, 004).
- The same curve is also hard-coded as a string in JS: `js/app.js:324`
  (`easing: "cubic-bezier(0.23, 1, 0.32, 1)"`).
- Press durations `160ms` (release) ×8 and `100ms` (press-in) ×8, and sheet durations `280ms`/`200ms`, are repeated literals.

Two almost-identical curves make some parts settle softer than others, and changing the feel later means hunting literals.

## Target

Tokens in `:root` (next to the existing `--ease-out`):

```css
--dur-press-in: 100ms;   /* al hundirse con el dedo */
--dur-press: 160ms;      /* al soltar */
--dur-in: 280ms;         /* ficha que entra */
--dur-out: 200ms;        /* ficha que sale (más rápido que entrar) */
```

- Every `cubic-bezier(.2,.8,.2,1)` → `var(--ease-out)` (one ease-out for everything that enters or settles).
- Every `scale 160ms var(--ease-out)` → `scale var(--dur-press) var(--ease-out)`.
- In `:active` rules, every `100ms` in `transition-duration` → `var(--dur-press-in)`.
- Sheet: `200ms var(--ease-out)` → `var(--dur-out) var(--ease-out)`; `transition-duration: 280ms` → `var(--dur-in)` (in `.modal`, `.modal.is-open`, `.modal::backdrop`, `.modal.is-open::backdrop`).
- JS: read the curve from CSS once — `const EASE_OUT = getComputedStyle(document.documentElement).getPropertyValue("--ease-out").trim();` — and use `easing: EASE_OUT`.

Untouched on purpose: `ease-in-out` on the infinite tower loops (constant oscillation is correct there),
hover `.2s` colour transitions (plain `ease` is right for colour), the reduced-motion block's literal fades,
and the JS `ease()` cubic used to map scroll position in the build (not a timed animation).

## Steps

1. Add the four duration tokens to `:root`.
2. Apply the replacements above in `css/styles.css`.
3. `js/app.js`: add `EASE_OUT` next to the other top-level constants; use it in the thumbnail fade.

## Boundaries

- Pure refactor except the curve unification: no duration value changes, no new animations.
- Do NOT touch the reduced-motion / reduced-transparency blocks.

## Verification

- **Mechanical**: no console errors; `grep -c "cubic-bezier(.2,.8,.2,1)" css/styles.css` → 0; `grep -c "160ms\|100ms\|280ms" css/styles.css` → only the token definitions (and comments).
- **Feel check**: press feedback, sheet open/close and ripple feel identical to before. Scroll reveal, FPS bars and the
  card tilt return now start a little quicker and settle more gently (same ease-out as the rest of the page).
- **Done when**: one ease-out curve and named durations everywhere.
