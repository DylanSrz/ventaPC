# 006 — Lighter top bar: frosted glass, divider only when content scrolls under it

- **Status**: DONE
- **Commit**: 278d244
- **Severity**: LOW
- **Category**: Materials & depth (apple-design §12)
- **Estimated scope**: 2 files (`css/styles.css`, `js/app.js`), ~10 lines

## Problem

```css
/* css/styles.css:90-96 — current */
.nav {
  position: sticky; top: 0; z-index: 50;
  …
  background: rgba(7,7,12,.6); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
}
```

- A fixed 1px divider is drawn even at the very top of the page, where nothing is under the bar,
  so the bar reads as a separate heavy strip instead of a floating layer.
- `blur(14px)` with no saturation makes the content underneath turn into flat grey: the purple/cyan
  glow of the page is lost through the bar.

## Target

- Material: `background: rgba(7,7,12,.55)`, `backdrop-filter: blur(20px) saturate(180%)` (and the
  `-webkit-` prefix). Content scrolling under the bar shows through as soft colour.
- Scroll edge: the divider is transparent at the top and appears only once the page has scrolled
  (`scrollY > 2`), fading in/out with `border-color 200ms ease` (colour change → `ease`).
- `.nav.is-scrolled { border-bottom-color: var(--line); }` — class toggled from JS.

```css
/* target */
.nav {
  …unchanged layout…
  background: rgba(7,7,12,.55);
  backdrop-filter: blur(20px) saturate(180%); -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid transparent;
  transition: border-color .2s ease;
}
.nav.is-scrolled { border-bottom-color: var(--line); }
```
```js
/* target — js/app.js, next to the existing scroll listener */
// Barra superior: la línea de abajo solo aparece cuando hay contenido pasando por detrás
const nav = $(".nav");
const marcaNav = () => nav.classList.toggle("is-scrolled", scrollY > 2);
addEventListener("scroll", marcaNav, { passive: true });
marcaNav();
```

## Repo conventions to follow

- Passive scroll listeners, short Spanish comments (`js/app.js` "Explosión del build" section).

## Steps

1. `css/styles.css`: in `.nav`, replace the `background`/`backdrop-filter` line and the `border-bottom` line with the target values; add the `transition` line; add the `.nav.is-scrolled` rule right after `.nav`.
2. `js/app.js`: add the target JS right after `addEventListener("scroll", onScroll, { passive: true });`.

## Boundaries

- Do NOT change the bar's height, padding, links, button or sticky behaviour (the build section depends on its 64px height).
- Reduced transparency (`prefers-reduced-transparency`) is a separate finding (plan for point 8); don't add it here.

## Verification

- **Mechanical**: no console errors; at `scrollY = 0` the nav's `border-bottom-color` is transparent; after scrolling it is `rgba(255, 255, 255, 0.08)`.
- **Feel check**:
  - At the top of the page: no line under the bar; the bar blends into the hero.
  - Scroll a little: a thin line fades in under the bar; scroll back to the top: it fades out.
  - Scroll over the purple glow and the coloured cards: their colour shows softly through the bar.
- **Done when**: the divider only exists while content is under the bar, and the bar shows colour through it.
