# 003 — Floating WhatsApp button stays still; one ripple when the visitor reaches the price

- **Status**: DONE
- **Commit**: daa9a8b
- **Severity**: HIGH
- **Category**: Purpose & frequency
- **Estimated scope**: 2 files (`css/styles.css`, `js/app.js`), ~10 lines

## Problem

The floating WhatsApp button (`.wa-float`) is on screen for the whole visit and moves forever:
it bobs up and down every 3s and emits a ripple ring every 2.4s.

```css
/* css/styles.css:418-429 — current */
.wa-float {
  …
  animation: bob 3s ease-in-out infinite;
  transition: scale 160ms var(--ease-out);
}
.wa-float::after { content: ""; position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--wa); animation: ripple 2.4s infinite; }
@keyframes bob { 50% { transform: translateY(-4px); } }
@keyframes ripple { from { transform: scale(1); opacity: .8; } to { transform: scale(1.6); opacity: 0; } }
```

Motion that never stops on an element seen constantly has no purpose after the first second. It pulls
the eye away from prices and specs while people read, and the slow loop is exactly the kind of
oscillation Apple asks to avoid. Being always visible already makes the button findable.

## Target

- No idle motion: remove `bob` entirely; the ring is invisible at rest.
- One ripple, once per visit, at a meaningful moment: when the price section (`#precio`) is at least
  30% visible — the moment the visitor is deciding. The ring scales `1 → 1.6` while fading `.8 → 0`
  over `1.4s` with `--ease-out` (`cubic-bezier(0.23, 1, 0.32, 1)`, token already in `:root`). One iteration.
- `prefers-reduced-motion`: no ripple (the existing global rule already disables animations; JS also skips adding the class).

```css
/* target */
.wa-float::after { content: ""; position: absolute; inset: 0; border-radius: 50%; border: 2px solid var(--wa); opacity: 0; pointer-events: none; }
.wa-float.is-calling::after { animation: ripple 1.4s var(--ease-out); }
@keyframes ripple { from { transform: scale(1); opacity: .8; } to { transform: scale(1.6); opacity: 0; } }
```

## Repo conventions to follow

- Scroll-triggered behaviour already uses `IntersectionObserver` in `js/app.js` (section
  "Aparición al hacer scroll", `io`). Follow the same pattern: observe, act once, unobserve/disconnect.
- `reduceMotion` constant already exists at the top of `js/app.js`.

## Steps

1. `css/styles.css` `.wa-float`: delete the line `animation: bob 3s ease-in-out infinite;`.
2. Replace the `.wa-float::after` rule and delete `@keyframes bob`, giving the three rules in **Target**.
3. `js/app.js`, after the reveal observer (before the closing `})();`), add:
   ```js
   /* ---------- Botón flotante: una sola onda al llegar al precio ---------- */
   const waFloat = $(".wa-float"), precioSec = $("#precio");
   if (!reduceMotion && waFloat && precioSec) {
     const avisa = new IntersectionObserver(([en]) => {
       if (!en.isIntersecting) return;
       waFloat.classList.add("is-calling");
       avisa.disconnect();
     }, { threshold: 0.3 });
     avisa.observe(precioSec);
   }
   ```

## Boundaries

- Do NOT change the button's size, colour, shadow, position or the press feedback from plan 001
  (`transition: scale…`, `.wa-float:active`).
- Do NOT touch other infinite animations on the page (tower, title, borders) — separate finding.

## Verification

- **Mechanical**: no console errors; `getComputedStyle(.wa-float).animationName` is `none`.
- **Feel check**:
  - Load the page and watch the green button for 10s: it does not move and no ring appears.
  - Scroll down to "Lo que te ahorras": exactly one ring expands and fades once. Scroll up and back
    down: no second ring.
  - Pressing the button still shrinks it (plan 001).
  - With reduced motion on: no ring ever.
- **Done when**: the button is still at rest and the ripple fires once, only at the price section.
