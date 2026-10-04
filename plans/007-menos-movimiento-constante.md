# 007 — Less constant motion: stop distracting loops, pause the rest off-screen, cheaper phone tilt

- **Status**: DONE
- **Commit**: 16fed11
- **Severity**: MEDIUM
- **Category**: Purpose & frequency + Performance
- **Estimated scope**: 2 files (`css/styles.css`, `js/app.js`), ~30 lines

## Problem

The page runs a dozen infinite animations at once, everywhere, for the whole visit:

| Where | Rule (`css/styles.css`) | Issue |
| --- | --- | --- |
| Hero title gradient | `.grad--anim { … animation: slide 6s linear infinite; }` (45-46) | Text moving while it is read |
| Build connector lines | `.explode__lines line { … animation: dash 1s linear infinite; }` (189-190) | Marching ants, pure decoration |
| Contact box border | `.contact__box::before { … animation: spin 5s linear infinite; }` (410) | Spinning border around the call to action |
| Tower (fans, block, RAM, GPU fans, front strip, float), "En venta" dot, build core border, idle ring | lines 112, 141, 155, 159-167, 203, 403 | Keep running when their section is off-screen |

Several animate the `@property --ang` inside `conic-gradient` + `mask` + `drop-shadow`, which forces a
repaint every frame — on mid-range phones that is battery, heat and scroll jank, even when nobody sees it.

Phone tilt (`js/app.js:241-249`) writes four custom properties on `document.documentElement` on every
`deviceorientation` event (~60/s). Inherited custom properties on the root force a style recalculation
of the entire document each time, even when no card is on screen.

## Target

1. **Remove** the three distracting loops: title gradient (static gradient stays), build line dash
   (lines stay dashed, still), contact border spin (border stays, still).
2. **Keep** the hero tower and its details, the "En venta" dot, the build core border and the idle ring
   — they are first-impression/delight moments — but **pause every animation inside a section that is
   off-screen**:
   ```css
   /* Las animaciones decorativas se pausan cuando su sección no está en pantalla (js: is-off) */
   .is-off *, .is-off *::before, .is-off *::after { animation-play-state: paused !important; }
   ```
   ```js
   const fuera = new IntersectionObserver((entries) =>
     entries.forEach((en) => en.target.classList.toggle("is-off", !en.isIntersecting)));
   document.querySelectorAll("main section").forEach((s) => fuera.observe(s));
   ```
3. **Phone tilt**: write the four properties only on cards currently on screen (tracked with an
   `IntersectionObserver`), batched to one write per animation frame. The CSS already reads them by
   inheritance (`.card__inner { --rx: var(--grx, 0deg); … }`), so setting them on `.card` is enough.

## Repo conventions to follow

- `IntersectionObserver` is the existing pattern (reveal observer). Short Spanish comments.

## Steps

1. `css/styles.css`: delete `.grad--anim { … }` and `@keyframes slide { … }` (lines 45-46). (The `grad--anim` class stays in the HTML, harmless.)
2. Delete `animation: dash 1s linear infinite;` from `.explode__lines line` and the `@keyframes dash` line.
3. Delete `animation: spin 5s linear infinite;` from `.contact__box::before`.
4. Add the `.is-off` rule (Target 2) right before the `@media (prefers-reduced-motion: reduce)` block.
5. `js/app.js`: add the off-screen observer (Target 2) before the closing `})();`.
6. Replace the `deviceorientation` block with: a `Set` of visible `.card` elements kept by an
   `IntersectionObserver`; the handler stores the latest angles and schedules one `requestAnimationFrame`
   that sets `--gmx/--gmy/--grx/--gry` on each visible card.

## Boundaries

- Do NOT change any animation's speed, curve or look; only remove the three listed and pause off-screen ones.
- Do NOT touch the floating button, modal, reveal or build scroll logic.

## Verification

- **Mechanical**: no console errors. `document.getAnimations().filter(a => a.playState === "running").length`
  at the "Componentes" section drops to (close to) 0; at the top it is the tower/dot set only.
- **Feel check**:
  - Top of the page: the tower still spins/floats; the title gradient is still.
  - Build section: lines are still dashed but don't move; the core border still turns.
  - Contact box: border visible, not turning.
  - Scroll back to the top: the tower picks up where it was.
  - Android phone: tilting still moves the holographic shine on the cards you're looking at.
- **Done when**: only the hero tower, status dot, build core and idle ring animate, and only while on screen.
