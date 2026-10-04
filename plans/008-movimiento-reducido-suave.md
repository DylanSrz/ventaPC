# 008 — Reduced motion means gentle fades, not everything snapping; reduced transparency gets solid surfaces

- **Status**: DONE
- **Commit**: 0ba24ac
- **Severity**: MEDIUM
- **Category**: Accessibility
- **Estimated scope**: 2 files (`css/styles.css`, `js/app.js`), ~30 lines

## Problem

```css
/* css/styles.css:483-488 — current */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .reveal { opacity: 1; transform: none; }
  .bar__fill { transform: none; }
  html { scroll-behavior: auto; }
}
```

- It removes **all** transitions, including the opacity/colour ones that help people follow what
  changed: the product sheet and its backdrop appear/disappear in one frame, the "Link copiado ✔"
  toast blinks, hover colour changes snap, photos swap abruptly. Reduced motion should mean fewer and
  gentler animations (no movement), not zero feedback.
- JS mirrors it: `cerrarModal()` closes instantly (`js/app.js:278`), thumbnails skip their fade (`js/app.js:323`).
- The build section keeps its **280vh** scroll height (`css/styles.css:182`) even though, with reduced
  motion, the parts are shown already spread out (`p = 1`): ~3 screens of scrolling over a still picture,
  with a "Scroll para desarmar" label and a progress bar that mean nothing.
- `prefers-reduced-transparency` is not handled: the top bar, build parts and sheet backdrop stay blurred and see-through.

## Target

Inside `@media (prefers-reduced-motion: reduce)` (keep `animation: none` and `transition: none` as the base, then re-enable fades only):

```css
.reveal { transform: none; transition: opacity .4s ease var(--d, 0ms) !important; } /* aparece sin moverse */
.bar__fill { transform: none; }
.modal { transform: none; transition: opacity 200ms ease !important; }
.toast { translate: -50% 0; transition: opacity .3s ease !important; }
.btn, .nav, .nav__links a, .node, .thumb { transition: color .2s ease, background-color .2s ease, border-color .2s ease, box-shadow .2s ease !important; }
.explode { height: auto; }
.explode__sticky { position: relative; top: auto; }
.explode__progress { display: none; }
html { scroll-behavior: auto; }
```
(`.modal::backdrop` is not matched by `*::before/*::after`, so its existing opacity transition keeps working.)

JS:
- `cerrarModal()`: remove the `if (reduceMotion) return modal.close();` line — the opacity fade ends with `transitionend` as usual.
- Thumbnail swap: remove the `!reduceMotion` condition (it is an opacity-only fade).
- When `reduceMotion`, change the build label to `"Toca una pieza para ver su ficha"`.

New block:
```css
@media (prefers-reduced-transparency: reduce) {
  :root { --surface: #141422; }
  .nav { background: var(--bg); backdrop-filter: none; -webkit-backdrop-filter: none; }
  .node { backdrop-filter: none; -webkit-backdrop-filter: none; }
  .modal::backdrop { background: rgba(3,3,8,.9); backdrop-filter: none; }
  .modal__close { background: #000; }
}
```

## Repo conventions to follow

- Media blocks live at the end of `css/styles.css`; `reduceMotion` constant at the top of `js/app.js`.

## Steps

1. Replace the reduced-motion block with the base rule + **Target** rules.
2. Add the reduced-transparency block after it.
3. `js/app.js`: the three JS changes above (the label change goes next to the build section code).

## Boundaries

- Do NOT re-enable any movement (transform, translate, scale) or any infinite animation under reduced motion.
- Do NOT change behaviour for people without these preferences.

## Verification

- Emulate `prefers-reduced-motion: reduce` (DevTools → Rendering):
  - Open "Ficha": it fades in without moving; ✕ fades it out (not instant).
  - "Compartir esta página" → toast fades in place.
  - Cards fade in without sliding.
  - Build section is one screen tall, label says "Toca una pieza…", no progress bar, all parts in place and tappable.
  - No infinite animation runs anywhere.
- Emulate `prefers-reduced-transparency: reduce`: top bar solid, no blur behind the sheet.
- **Done when**: reduced motion shows fades but no movement, and reduced transparency shows solid surfaces.
