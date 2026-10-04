# 001 — Press feedback on every tappable element, no sticky hover on touch

- **Status**: DONE
- **Commit**: 0dca877
- **Severity**: HIGH
- **Category**: Physicality & origin (press feedback) + Accessibility (hover gating)
- **Estimated scope**: 2 files (`css/styles.css`, `js/app.js`), ~30 lines

## Problem

Nothing on the page reacts when it is pressed, and hover effects stick on phones.

1. **No press feedback anywhere.** There is no `:active` rule in `css/styles.css`. Tapping
   "Escríbeme por WhatsApp" shows no change until WhatsApp opens, so the tap feels unregistered.
2. **Ungated hover motion sticks after a tap on touch screens** (touch fires a false hover that
   stays until you tap elsewhere):

   ```css
   /* css/styles.css:73 — current */
   .btn:hover { transform: translateY(-2px); }
   /* css/styles.css:78-79 — current */
   .btn--wa:hover { box-shadow: 0 16px 40px -10px rgba(37,211,102,.9); }
   .btn--ghost:hover { border-color: var(--cyan); background: rgba(0,229,255,.08); }
   /* css/styles.css:95 — current */
   .nav__links a:hover { color: var(--text); }
   /* css/styles.css:204 — current */
   .node:hover { border-color: var(--cyan); box-shadow: 0 0 30px rgba(0,229,255,.3); }
   /* css/styles.css:301 — current */
   .card:hover .visual img { transform: scale(1.05) translateZ(0); }
   /* css/styles.css:341 — current */
   .shot:hover img { transform: scale(1.04); }
   /* css/styles.css:429 — current */
   .thumb:hover { transform: translateY(-2px); }
   ```
3. **Default tap highlight**: mobile browsers flash a gray/blue box over links and buttons on tap.
4. **iOS Safari ignores `:active` on touch** unless a `touchstart` listener exists on the page.
   `js/app.js` has none.

## Target

- Press feedback: `scale: 0.97` (buttons) on `:active`. Pressing in takes `100ms`, releasing takes `160ms`, both with
  `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`.
- Use the individual CSS `scale` property (not `transform`) so the press composes with transforms
  that are already set elsewhere: `.node` gets an inline `transform` from JS every scroll frame,
  `.wa-float` has a `transform` keyframe animation (`bob`), `.explode__core` uses `translate`.
- Larger surfaces press less: photos (`.shot`) `scale: 0.98`; round floating button (`.wa-float`) `scale: 0.92`.
- All hover motion/colour rules wrapped in `@media (hover: hover) and (pointer: fine)`.
- `-webkit-tap-highlight-color: transparent` on `a, button` (safe because every tappable now has its own feedback).
- An empty passive `touchstart` listener so iOS applies `:active`.

## Repo conventions to follow

- Design tokens live in the `:root` block at the top of `css/styles.css` (`--radius`, `--gutter`…). Add the curve there.
- Plain CSS, no build step, no libraries. JS lives in the IIFE in `js/app.js`; small helpers sit near the top.

## Steps

1. `css/styles.css` `:root` (after `--gutter`): add `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);`
2. `css/styles.css` after the `a { color: inherit; }` line: add
   `a, button { -webkit-tap-highlight-color: transparent; }`
3. `.btn` (line 70): change the transition to
   `transition: transform .2s, scale 160ms var(--ease-out), background .2s, box-shadow .2s, border-color .2s;`
4. Replace lines 73, 78, 79 hover rules with the same rules inside
   `@media (hover: hover) and (pointer: fine) { … }`, and add right after:
   ```css
   .btn:active { scale: .97; transition-duration: .2s, 100ms, .2s, .2s, .2s; }
   ```
5. Wrap `.nav__links a:hover` (line 95) in the same media query.
6. Wrap `.node:hover` (line 204) in the media query. Add `scale 160ms var(--ease-out)` to `.node`'s transition and
   `.node:active { scale: .96; transition-duration: .2s, .2s, 100ms; }`.
7. `.explode__core`: add `transition: scale 160ms var(--ease-out);` and `.explode__core:active { scale: .97; transition-duration: 100ms; }`.
8. Wrap `.card:hover .visual img` (line 301) and `.shot:hover img` (line 341) in the media query.
   `.shot`: add `transition: scale 160ms var(--ease-out);` and `.shot:active { scale: .98; transition-duration: 100ms; }`.
9. `.thumb` (line 428): add `scale 160ms var(--ease-out)` to its transition; wrap `.thumb:hover` in the media
   query; add `.thumb:active { scale: .94; }` with `transition-duration` of 100ms for `scale`.
10. `.modal__close`, `.yt`: add `transition: scale 160ms var(--ease-out);` and `:active { scale: .94; transition-duration: 100ms; }` (`.yt` uses `.98`).
11. `.wa-float`: add `transition: scale 160ms var(--ease-out);` and `.wa-float:active { scale: .92; transition-duration: 100ms; }`.
    Do not touch its `bob` / `ripple` animations.
12. `js/app.js`, after the helper constants: add
    `document.addEventListener("touchstart", () => {}, { passive: true }); // iOS: activa :active al tocar`

## Boundaries

- Do NOT touch the floating button's `bob`/`ripple` animations, the modal animation, reveal timing,
  nav background, or reduced-motion block — those are separate findings.
- Do NOT change markup.
- Under `prefers-reduced-motion` the existing global rule removes transitions; the press state still
  applies instantly (feedback without motion). Leave that as is.

## Verification

- **Mechanical**: open the page; no console errors; `css/styles.css` still parses (DevTools shows no invalid rules on `.btn`).
- **Feel check**:
  - Phone (or DevTools device mode with touch): press and hold "Escríbeme por WhatsApp" — it shrinks
    slightly the instant the finger lands, before release. No gray/blue flash.
  - Tap "Ficha" on a card, close the sheet: the button and the card photo are back to normal — nothing stays lifted or zoomed.
  - Desktop mouse: hover still lifts buttons and zooms card photos; clicking also presses them in.
  - The floating WhatsApp button still bobs, and shrinks on press.
  - Scroll the build section halfway, press a part: it presses in without jumping out of position.
- **Done when**: every button-like element shrinks on press, and no hover effect survives a tap on touch.
