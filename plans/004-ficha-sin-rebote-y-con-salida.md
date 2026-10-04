# 004 — Product sheet: no bounce on open, animated close, fading backdrop, crossfaded photos

- **Status**: DONE
- **Commit**: 721cd98
- **Severity**: MEDIUM
- **Category**: Easing & duration + Interruptibility + Missed opportunities
- **Estimated scope**: 2 files (`css/styles.css`, `js/app.js`), ~40 lines

## Problem

The product sheet (`<dialog id="modal">`, opened from "Ficha", the build parts and the real photos):

1. **Opens with an overshoot** — the curve's last control point is `1.2`, so it grows past its size and
   settles back. Overshoot is for things the user threw; a sheet that appears on its own should land and stop.
   ```css
   /* css/styles.css:434-435 — current */
   .modal[open] { animation: pop .35s cubic-bezier(.2,.9,.3,1.2); }
   @keyframes pop { from { opacity: 0; transform: translateY(20px) scale(.96); } }
   ```
2. **Closes instantly** — `modal.close()` removes it in one frame (`js/app.js:274`), and Escape does the
   same. It arrives along a path but leaves along none.
3. **Backdrop pops** in and out (`css/styles.css:433` has no transition).
4. **Thumbnail clicks swap the big photo in one frame** (`js/app.js:277-278`: `img.src = th.dataset.foto`).
5. Opening is a keyframe: it cannot be reversed mid-way.

## Target

- Open: `opacity 0 → 1` and `translateY(20px) scale(.97) → none`, **280ms**, `var(--ease-out)`
  (`cubic-bezier(0.23, 1, 0.32, 1)`, token in `:root`). No overshoot.
- Close: the exact reverse path, faster — **200ms**, same curve (the system's response snaps).
- Backdrop fades with the sheet (same durations).
- Driven by CSS **transitions** on an `is-open` class, so a close interrupted by a re-open reverses from
  wherever it is instead of restarting.
- Close paths (✕ button, backdrop click, Escape) all go through one `cerrarModal()` that removes
  `is-open`, then calls `modal.close()` on `transitionend` (fallback timer 260ms).
- Re-opening while a close is in flight cancels the pending close (never call `showModal()` on an open dialog — it throws).
- Thumbnail: preload + `decode()` the new photo, swap, then fade it in `opacity .35 → 1`, **220ms**, `var(--ease-out)`.
- `prefers-reduced-motion`: open/close are instant (existing global rule removes transitions; JS closes
  immediately instead of waiting) and the photo swap does not animate.

```css
/* target */
.modal { …existing…; opacity: 0; transform: translateY(20px) scale(.97);
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out); }
.modal.is-open { opacity: 1; transform: none; transition-duration: 280ms; }
.modal::backdrop { background: rgba(3,3,8,.7); backdrop-filter: blur(6px); opacity: 0; transition: opacity 200ms var(--ease-out); }
.modal.is-open::backdrop { opacity: 1; transition-duration: 280ms; }
```

## Repo conventions to follow

- Plain JS in the IIFE of `js/app.js`; `reduceMotion` constant exists at the top; short Spanish comments.
- `--ease-out` token added by plan 001.

## Steps

1. `css/styles.css`: replace lines 432-435 (`.modal`, `.modal::backdrop`, `.modal[open]`, `@keyframes pop`) with the **Target** CSS (keep every existing `.modal` declaration).
2. `js/app.js`, Modal section: add `abrirModal()` (cancel pending close, `showModal()` if not open,
   force a reflow, add `is-open`) and `cerrarModal()` (as described in Target). Replace both
   `modal.showModal()` calls (product sheet and real-photo gallery) with `abrirModal()`.
3. In the modal click handler, replace `modal.close()` with `cerrarModal()`.
4. Add a `cancel` listener: `e.preventDefault(); cerrarModal();` (Escape).
5. In the `close` listener also remove `is-open`.
6. Thumbnail branch: preload/decode the new `src`, then swap and `img.animate([{opacity:.35},{opacity:1}], {duration:220, easing:"cubic-bezier(0.23, 1, 0.32, 1)"})` unless `reduceMotion`.

## Boundaries

- Do NOT change the sheet's layout, size, centering or content. (Bottom sheet on phones is a separate idea, not this plan.)
- Do NOT touch the close button's press feedback (plan 001) or anything outside the Modal section and the gallery's open call.

## Verification

- **Mechanical**: no console errors; open → close → open quickly in a row never throws.
- **Feel check**:
  - Tap "Ficha": the sheet rises a little and fades in, and stops without growing past its size.
  - Close with ✕, by tapping outside, and with Escape: it sinks back down and fades, and the dark background fades too.
  - Close and immediately tap "Ficha" again: it comes back from where it was, no jump.
  - Thumbnails: the big photo fades into the new one instead of jumping.
  - DevTools Animations panel at 10%: no frame where the sheet is larger than its final size.
  - Reduced motion: open/close are instant, no delay on close.
- **Done when**: every open and close path animates along the same route, without overshoot.
