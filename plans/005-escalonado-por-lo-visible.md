# 005 — Stagger by what appears together, not by list position

- **Status**: DONE
- **Commit**: f4fa9fd
- **Severity**: MEDIUM
- **Category**: Cohesion & tokens (stagger) + Purpose (stagger must never delay content)
- **Estimated scope**: 1 file (`js/app.js`), ~15 lines

## Problem

Scroll-reveal delays are fixed by each element's index in its list, not by what is on screen:

```js
/* js/app.js:188 */ <article class="card reveal …" style="--d:${i * 60}ms" …>
/* js/app.js:334 */ <div class="bar reveal" style="--d:${i * 70}ms">
/* js/app.js:342 */ <div class="use reveal" style="--d:${i * 80}ms">
/* js/app.js:349 */ <button class="shot reveal" … style="--d:${i * 60}ms">
```
```css
/* css/styles.css:476 */ .reveal { …; transition: opacity .7s ease var(--d, 0ms), transform .7s cubic-bezier(.2,.8,.2,1) var(--d, 0ms); }
```

On a phone the grid is one column, so each card enters the viewport alone, yet card 9 still waits
480ms before it starts to appear — the page feels slow exactly when the user is scrolling to it.
Stagger is decorative and must never delay content. The steps (60/70/80ms) are also inconsistent.

## Target

- An element's delay = its position **among the elements that become visible in the same observer
  callback** × **60ms**, capped at 5 steps (max **300ms**). An element that appears alone has **0ms**.
- One step for every list (60ms, inside the 30–80ms stagger range).
- The stats counter (`[data-count]`) starts counting after the same delay, so it doesn't count while invisible.
- Remove the fixed `style="--d:…"` from the four templates; the observer sets `--d` instead.
- The bar fill transition (`css/styles.css:324`) keeps reading `--d` from its `.bar` parent, so it follows automatically.

```js
/* target — reveal observer */
const io = new IntersectionObserver((entries) => {
  let k = 0; // orden entre los que aparecen juntos
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const d = Math.min(k++, 5) * 60;
    en.target.style.setProperty("--d", `${d}ms`);
    en.target.classList.add("in");
    const n = en.target.querySelector("[data-count]");
    if (n) setTimeout(() => countUp(n), d);
    io.unobserve(en.target);
  });
}, { threshold: 0.15 });
```

## Repo conventions to follow

- Same observer (`io`) in the "Aparición al hacer scroll" section of `js/app.js`; short Spanish comments.

## Steps

1. Remove ` style="--d:${i * 60}ms"` (card), ` style="--d:${i * 70}ms"` (bar), ` style="--d:${i * 80}ms"` (use) and ` style="--d:${i * 60}ms"` (shot) from the templates. If a `map` callback no longer uses `i`, leave the parameter — don't refactor.
2. Replace the reveal observer body with **Target**.

## Boundaries

- Do NOT change reveal durations, curves, distances or the threshold — only the delay logic.
- Do NOT touch CSS.

## Verification

- **Mechanical**: no console errors.
- **Feel check**:
  - Phone (390×844): scroll slowly through "Componentes" — every card starts appearing as soon as it
    enters the screen; the last card has no extra wait.
  - Desktop (1280×800): a row of three cards appearing together still cascades left → right (0, 60, 120ms).
  - "Rendimiento": bars that appear together fill in a short cascade.
  - Stats: numbers start counting when each one appears.
- **Done when**: no element ever waits more than 300ms, and a lone element never waits at all.
