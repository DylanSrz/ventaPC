# 002 — Build parts can't be tapped while hidden or still flying out

- **Status**: DONE
- **Commit**: 2807a19
- **Severity**: HIGH
- **Category**: Purpose & frequency (animation side effect breaking interaction)
- **Estimated scope**: 1 file (`js/app.js`), ~3 lines

## Problem

In the "El build por dentro" section the part buttons (`.node`) start stacked on the centre of the
stage, at `opacity: 0` and `scale(0.35)`, and fly out as the user scrolls. They have `z-index: 3`
while the centre card `#explodeCore` (the CPU) has `z-index: 2`
(`css/styles.css`, `.node` and `.explode__core`). Invisible buttons still receive taps, so a tap on the
centre card hits a hidden part instead.

Reproduced at commit 0dca877: phone viewport 390×844, open `/#build` (section at progress 0), tap the
centre of the "i5-12600KF" card → the sheet that opens is **"Cooler Master MasterBox TD500 Mesh V2"** (the
last node appended), not the CPU.

```js
/* js/app.js:134-138 — current */
nodes.forEach((n, i) => {
  const t = ease(clamp((p - 0.05 - i * 0.05) / 0.55));
  const g = geo[i];
  n.el.style.transform = `translate(-50%,-50%) translate(${g.x * t}px, ${g.y * t}px) rotate(${n.spin * (1 - t)}deg) scale(${0.35 + 0.65 * t})`;
  n.el.style.opacity = clamp(t * 2.2);
```

Hidden buttons are also reachable with the Tab key and by screen readers.

## Target

A part becomes interactive only once it is essentially in place: `t >= 0.9` (fully opaque, ≥ 93%
scale, ≥ 90% of the way out). Below that it is `inert`, which removes it from tapping, Tab focus and
the accessibility tree in one property. Only write the property when the state changes (this runs
every scroll frame).

```js
/* target, inside the same forEach, right after the opacity line */
const listo = t >= 0.9; // solo se puede tocar cuando ya está en su lugar
if (n.el.inert === listo) n.el.inert = !listo;
```

With `prefers-reduced-motion`, `p` is forced to `1`, so every part is `t = 1` and interactive — no change there.

## Repo conventions to follow

- Plain JS inside the IIFE in `js/app.js`; short Spanish comments explaining *why* (e.g. the iOS
  `touchstart` comment near the top of the file).

## Steps

1. `js/app.js`, in `renderExplode`, after `n.el.style.opacity = clamp(t * 2.2);` insert the two
   lines from **Target**.

## Boundaries

- Do NOT change z-index, the explode timings, curves or layout.
- Do NOT touch CSS.
- If the code at the cited lines differs, STOP and report.

## Verification

- **Mechanical**: page loads with no console errors.
- **Feel check** (phone viewport 390×844):
  - Open `/#build` without scrolling, tap the centre card → the sheet is the CPU (i5-12600KF).
  - Scroll until the progress bar under the build is full, tap any part → that part's sheet opens.
  - Halfway through, parts still flying out can't be tapped; the centre card always opens the CPU.
  - Desktop: press Tab from the top — focus never lands on an invisible part.
- **Done when**: the centre card always opens the CPU, and every visible, settled part opens its own sheet.
