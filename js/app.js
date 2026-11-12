(() => {
  const D = window.VENTA;
  const C = D.config;
  const ICON = window.ICONOS;
  const $ = (sel, root = document) => root.querySelector(sel);
  // Movimiento reducido: se respeta en vivo (si la persona lo activa con la página abierta, también)
  const movReducido = matchMedia("(prefers-reduced-motion: reduce)");
  let reduceMotion = movReducido.matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const EASE_OUT = getComputedStyle(document.documentElement).getPropertyValue("--ease-out").trim(); // misma curva que el CSS
  const fmt = (n) => "$" + Math.round(n).toLocaleString("es-CO");
  // iOS solo aplica :active (la respuesta al tocar) si la página escucha toques
  document.addEventListener("touchstart", () => {}, { passive: true });
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const todos = [...D.componentes, ...D.perifericos];
  const ref = (c) => (c.precioReferencia || 0) * (c.cantidad || 1);
  const titulo = (c) => (c.cantidad > 1 ? `${c.cantidad}× ` : "") + c.nombre;
  const totalRef = todos.reduce((s, c) => s + ref(c), 0);
  const precio = C.precioVenta;
  const ahorro = precio ? Math.max(0, totalRef - precio) : 0;
  const ahorroPct = precio && totalRef ? Math.round((ahorro / totalRef) * 100) : 0;

  // Precio de cada pieza dentro del combo: el mismo descuento para todas, proporcional a su
  // valor de referencia. Se redondea a centenas repartiendo el sobrante para que la suma dé
  // exactamente el precio de venta.
  const enCombo = new Map();
  if (precio && totalRef) {
    const con = todos.filter((c) => ref(c) > 0);
    const partes = con.map((c) => ({ c, x: (ref(c) * precio) / totalRef / 100 }));
    let sobra = Math.round(precio / 100) - partes.reduce((s, p) => s + Math.floor(p.x), 0);
    [...partes].sort((a, b) => (b.x % 1) - (a.x % 1)).forEach((p) => (p.extra = sobra-- > 0 ? 1 : 0));
    partes.forEach((p) => enCombo.set(p.c.id, (Math.floor(p.x) + p.extra) * 100));
  }
  // Venta por partes (sección "Arma tu oferta"): la torre completa o cada periférico
  const partesOn = !!(C.ventaPorPartes && precio);
  const interesDe = (c) => (D.componentes.includes(c) ? "torre" : c.id); // una pieza de la torre = la torre completa
  // Bloque de precio de una pieza: precio en el combo y, debajo, la referencia tachada
  const precioPieza = (c, etiquetaRef) =>
    enCombo.has(c.id)
      ? `<small>En el combo${c.cantidad > 1 ? ` · ${c.cantidad} unidades` : ""}</small>${fmt(enCombo.get(c.id))}<span class="card__ref">${etiquetaRef} <s>${fmt(ref(c))}</s></span>`
      : null;

  /* ---------- Toast ---------- */
  const toast = (msg) => {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => t.classList.remove("show"), 2600);
  };

  /* ---------- WhatsApp ---------- */
  const waValido = /^\d{8,15}$/.test(C.whatsapp || "");
  const waLink = (extra = "") =>
    `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(C.mensajeWhatsapp + (extra ? " " + extra : ""))}`;
  document.querySelectorAll(".js-wa").forEach((a) => {
    if (waValido) a.href = waLink();
    else {
      a.removeAttribute("target");
      a.addEventListener("click", (e) => {
        e.preventDefault();
        toast("Falta configurar el número de WhatsApp en js/data.js");
      });
    }
  });

  /* ---------- Binds simples ---------- */
  document.querySelectorAll("[data-bind]").forEach((el) => (el.textContent = C[el.dataset.bind] || ""));

  /* ---------- Hero ---------- */
  $("#heroPrice").innerHTML = precio
    ? `<div class="price">
         <span class="price__label">Precio del combo completo</span>
         <strong class="price__big">${fmt(precio)}</strong>
         <span class="price__ref">Valor en piezas: <s>${fmt(totalRef)}</s></span>
         ${ahorro ? `<span class="save-chip">Ahorras ${fmt(ahorro)} · ${ahorroPct}%</span>` : ""}
       </div>`
    : `<div class="price">
         <span class="price__label">Valor de referencia de las piezas</span>
         <strong class="price__big">${fmt(totalRef)}</strong>
         <span class="price__ref">Precio de venta: consúltalo por WhatsApp</span>
       </div>`;

  $("#heroChips").innerHTML = D.componentes.map((c) => `<li>${esc(c.corto)}</li>`).join("");

  // Parallax de la torre
  const tower = $("#tower");
  if (matchMedia("(pointer:fine)").matches) {
    addEventListener("pointermove", (e) => {
      if (reduceMotion) return;
      const x = e.clientX / innerWidth - 0.5;
      const y = e.clientY / innerHeight - 0.5;
      tower.style.setProperty("--ty", `${-22 + x * 18}deg`);
      tower.style.setProperty("--tx", `${6 - y * 10}deg`);
    });
  }

  /* ---------- Visual de producto (imagen con respaldo) ---------- */
  const visual = (c, cls = "") =>
    `<div class="visual ${cls}" data-id="${c.id}">
       <div class="visual__icon">${ICON[c.id] || ""}</div>
       <img src="${esc(c.imagen)}" alt="${esc(c.nombre)}" loading="lazy" onload="this.parentNode.classList.add('has-img')" onerror="this.remove()">
     </div>`;

  /* ---------- Explosión del build ---------- */
  const explode = $("#build");
  const stage = $("#explodeStage");
  const lines = $("#explodeLines");
  const partes = D.componentes.filter((c) => c.id !== "cpu");
  const nodes = partes.map((c, i) => {
    const n = document.createElement("button");
    n.type = "button";
    n.className = "node";
    n.style.setProperty("--i", i);
    n.innerHTML = `<span class="node__icon">${ICON[c.id] || ""}</span>
      <span class="node__txt"><small>${esc(c.categoria)}</small><strong>${esc(c.corto)}</strong></span>`;
    n.addEventListener("click", () => openModal(c));
    stage.appendChild(n);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    lines.appendChild(line);
    return { el: n, line, spin: (i % 2 ? 1 : -1) * (20 + i * 9) };
  });
  const cpu = D.componentes.find((c) => c.id === "cpu");
  // Con movimiento reducido el build ya aparece desarmado: no hay nada que deslizar
  const etiquetaBuild = $("#build .eyebrow"), etiquetaOriginal = etiquetaBuild.textContent;
  const ponerEtiqueta = () => (etiquetaBuild.textContent = reduceMotion ? "Toca una pieza para ver su ficha" : etiquetaOriginal);
  ponerEtiqueta();
  $("#explodeCore").addEventListener("click", () => openModal(cpu));

  let geo = null;
  const layout = () => {
    const w = stage.clientWidth, h = stage.clientHeight;
    const nw = Math.max(...nodes.map((n) => n.el.offsetWidth)), nh = Math.max(...nodes.map((n) => n.el.offsetHeight));
    const rx = Math.max(60, Math.min(w / 2 - nw / 2 - 4, 470));
    const ry = Math.max(60, Math.min(h / 2 - nh / 2 - 4, 250));
    lines.setAttribute("viewBox", `0 0 ${w} ${h}`);
    const core = $("#explodeCore").offsetHeight;
    const half = Math.ceil(nodes.length / 2);
    const gap = 10;
    // Pantallas angostas: columna arriba y abajo del núcleo en zigzag; si no, elipse
    const vertical = w < 640 && core / 2 + half * (nh + gap) <= h / 2;
    geo = nodes.map((_, i) => {
      if (vertical) {
        const top = i < half, k = top ? half - 1 - i : i - half;
        const dy = core / 2 + gap + nh / 2 + k * (nh + gap);
        const dx = Math.min(24, (w - nw) / 2) * (i % 2 ? 1 : -1);
        return { x: dx, y: top ? -dy : dy, cx: w / 2, cy: h / 2 };
      }
      const a = (i / nodes.length) * Math.PI * 2 - Math.PI / 2 + Math.PI / nodes.length;
      return { x: Math.cos(a) * rx, y: Math.sin(a) * ry, cx: w / 2, cy: h / 2 };
    });
  };

  const renderExplode = () => {
    if (!geo) layout();
    const r = explode.getBoundingClientRect();
    const total = explode.offsetHeight - innerHeight;
    const p = reduceMotion ? 1 : clamp(-r.top / (total || 1));
    $("#explodeBar").style.transform = `scaleX(${p})`;
    nodes.forEach((n, i) => {
      const t = ease(clamp((p - 0.05 - i * 0.05) / 0.55));
      const g = geo[i];
      n.el.style.transform = `translate(-50%,-50%) translate(${g.x * t}px, ${g.y * t}px) rotate(${n.spin * (1 - t)}deg) scale(${0.35 + 0.65 * t})`;
      n.el.style.opacity = clamp(t * 2.2);
      // Mientras la pieza está oculta o saliendo no se puede tocar (si no, tapa al núcleo)
      const listo = t >= 0.9;
      if (n.el.inert === listo) n.el.inert = !listo;
      n.line.setAttribute("x1", g.cx);
      n.line.setAttribute("y1", g.cy);
      n.line.setAttribute("x2", g.cx + g.x * t);
      n.line.setAttribute("y2", g.cy + g.y * t);
      n.line.style.opacity = t * 0.9;
    });
    $("#explodeCore").style.setProperty("--p", p);
  };
  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { renderExplode(); ticking = false; });
  };
  addEventListener("scroll", onScroll, { passive: true });
  // Barra superior: la línea de abajo solo aparece cuando hay contenido pasando por detrás
  const nav = $(".nav");
  const marcaNav = () => nav.classList.toggle("is-scrolled", scrollY > 2);
  addEventListener("scroll", marcaNav, { passive: true });
  marcaNav();
  addEventListener("resize", () => { layout(); renderExplode(); });
  if (document.fonts) document.fonts.ready.then(() => { layout(); renderExplode(); });
  layout();
  renderExplode();

  /* ---------- Contadores ---------- */
  const stats = [
    { n: 10, suf: "", label: "Núcleos CPU", sub: "6P + 4E" },
    { n: 16, suf: "", label: "Hilos", sub: "hasta 4.9 GHz" },
    { n: 8, suf: " GB", label: "VRAM GDDR6", sub: "RTX 4060" },
    { n: 32, suf: " GB", label: "RAM DDR5", sub: "6000 MHz" },
    { n: 7450, suf: "", label: "MB/s lectura", sub: "Samsung 990 PRO" },
    { n: 165, suf: " Hz", label: "2 monitores", sub: "LG UltraGear 24\"" },
  ];
  $("#stats").innerHTML = stats
    .map((s) => `<div class="stat reveal"><strong data-count="${s.n}" data-suf="${s.suf}">0${s.suf}</strong><span>${s.label}</span><small>${s.sub}</small></div>`)
    .join("");
  const countUp = (el) => {
    const end = +el.dataset.count, suf = el.dataset.suf;
    if (reduceMotion) { el.textContent = end.toLocaleString("es-CO") + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const step = (t) => {
      const k = ease(clamp((t - t0) / dur));
      el.textContent = Math.round(end * k).toLocaleString("es-CO") + suf;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- Tarjetas holográficas ---------- */
  const card = (c, i) => `
    <article class="card reveal ${c.vendido ? "is-sold" : ""}" data-id="${c.id}">
      <div class="card__inner">
        <div class="card__holo"></div>
        ${visual(c, "card__visual")}
        ${partesOn && !c.vendido ? `<button class="interes" type="button" data-interes="${interesDe(c)}" aria-pressed="false"${interesDe(c) === "torre" ? ' title="La torre se vende completa"' : ""}><span>＋ Me interesa</span></button>` : ""}
        <div class="card__body">
          <div class="card__tags"><span class="tag">${esc(c.categoria)}</span>${c.destacado ? `<span class="tag tag--hl">${esc(c.destacado)}</span>` : ""}</div>
          <h3>${esc(titulo(c))}</h3>
          <ul class="card__specs">${c.specs.slice(0, 3).map(([k, v]) => `<li><span>${esc(k)}</span><b>${esc(v)}</b></li>`).join("")}</ul>
          <div class="card__foot">
            <div class="card__price">${precioPieza(c, "Ref.") || (c.precioReferencia ? `<small>Referencia${c.cantidad > 1 ? ` · ${c.cantidad} unidades` : ""}</small>${fmt(ref(c))}` : `<small>Incluido</small>en el combo`)}</div>
            <div class="card__btns">
              <button class="btn btn--sm btn--ghost" type="button" data-open="${c.id}">Ficha</button>
              <a class="btn btn--sm btn--link" href="${esc(c.link)}" target="_blank" rel="noopener" aria-label="Página oficial de ${esc(c.nombre)}">Oficial ↗</a>
            </div>
          </div>
        </div>
        ${c.vendido ? `<div class="sold">VENDIDO</div>` : ""}
      </div>
    </article>`;
  $("#cardsComponentes").innerHTML = D.componentes.map(card).join("");
  $("#cardsPerifericos").innerHTML = D.perifericos.map(card).join("");

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-open]");
    if (b) openModal(todos.find((c) => c.id === b.dataset.open));
  });

  {
    document.querySelectorAll(".card").forEach((el) => {
      const inner = el.querySelector(".card__inner");
      el.addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch" || reduceMotion) return;
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        inner.style.setProperty("--rx", `${(0.5 - y) * 14}deg`);
        inner.style.setProperty("--ry", `${(x - 0.5) * 16}deg`);
        inner.style.setProperty("--mx", `${x * 100}%`);
        inner.style.setProperty("--my", `${y * 100}%`);
        el.classList.add("is-hover");
      });
      el.addEventListener("pointerleave", () => {
        ["--rx", "--ry", "--mx", "--my"].forEach((p) => inner.style.removeProperty(p));
        el.classList.remove("is-hover");
      });
    });

    // En celular: el brillo holográfico sigue la inclinación del teléfono
    if (matchMedia("(pointer:coarse)").matches && "DeviceOrientationEvent" in window) {
      // Solo se actualizan las tarjetas que están en pantalla, una vez por cuadro
      // (antes se recalculaba toda la página en cada movimiento del teléfono)
      const visibles = new Set();
      const ojo = new IntersectionObserver((entries) =>
        entries.forEach((en) => (en.isIntersecting ? visibles.add(en.target) : visibles.delete(en.target))));
      document.querySelectorAll(".card").forEach((el) => ojo.observe(el));
      let giro = null;
      addEventListener("deviceorientation", (e) => {
        if (e.gamma == null || reduceMotion) return;
        const pendiente = giro;
        giro = { gx: clamp((e.gamma + 30) / 60), gy: clamp((e.beta - 20) / 60) };
        if (pendiente) return;
        requestAnimationFrame(() => {
          const { gx, gy } = giro;
          giro = null;
          visibles.forEach((el) => {
            el.style.setProperty("--gmx", `${gx * 100}%`);
            el.style.setProperty("--gmy", `${gy * 100}%`);
            el.style.setProperty("--grx", `${(0.5 - gy) * 8}deg`);
            el.style.setProperty("--gry", `${(gx - 0.5) * 10}deg`);
          });
        });
      });
    }
  }

  /* ---------- Modal ---------- */
  const modal = $("#modal");
  const enHoja = matchMedia("(max-width: 720px)"); // en celular la ficha es una hoja que sube desde abajo
  let cierre = null;
  // Recuerda dónde se tocó por última vez, para que la ficha nazca desde ahí
  let toque = null;
  addEventListener("pointerdown", (e) => (toque = { x: e.clientX, y: e.clientY, t: e.timeStamp }), { capture: true, passive: true });
  const origenDesde = () => {
    if (enHoja.matches) return;
    const reciente = toque && performance.now() - toque.t < 1500;
    const f = document.activeElement;
    let p = reciente ? toque : null;
    if (!p && f && f !== document.body) { const r = f.getBoundingClientRect(); p = { x: r.left + r.width / 2, y: r.top + r.height / 2 }; }
    if (!p) { modal.style.transformOrigin = ""; return; }
    modal.style.transition = "none";
    modal.style.transform = "none"; // mide la ficha en su lugar final
    const r = modal.getBoundingClientRect();
    modal.style.transformOrigin = `${p.x - r.left}px ${p.y - r.top}px`;
    modal.style.transform = "";
    modal.offsetWidth;
    modal.style.transition = "";
  };
  const abrirModal = () => {
    clearTimeout(cierre); // si se estaba cerrando, vuelve desde donde iba
    if (!modal.open) { modal.showModal(); modal.scrollTop = 0; origenDesde(); modal.offsetWidth; } // reflow: parte del estado cerrado
    modal.classList.add("is-open");
  };
  const cerrarModal = () => {
    if (!modal.open) return;
    modal.classList.remove("is-open");
    clearTimeout(cierre);
    cierre = setTimeout(() => modal.close(), 450); // respaldo por si no llega transitionend
  };
  modal.addEventListener("transitionend", (e) => {
    if (e.target === modal && (e.propertyName === "opacity" || e.propertyName === "transform") && !modal.classList.contains("is-open")) {
      clearTimeout(cierre);
      modal.close();
    }
  });

  // Arrastrar la hoja hacia abajo para cerrarla (celular). Sigue al dedo 1:1;
  // hacia arriba resiste cada vez más; un tirón rápido basta para cerrarla.
  const agarre = $(".modal__grab");
  let arrastre = null;
  const resistencia = (o, d) => (o * d * 0.55) / (d + 0.55 * Math.abs(o));
  agarre.addEventListener("pointerdown", (e) => {
    if (!enHoja.matches) return;
    agarre.setPointerCapture(e.pointerId);
    arrastre = { y0: e.clientY, dy: 0, alto: modal.offsetHeight, muestras: [[e.timeStamp, 0]] };
    modal.style.transition = "none";
  });
  agarre.addEventListener("pointermove", (e) => {
    if (!arrastre) return;
    const dy = e.clientY - arrastre.y0;
    arrastre.dy = dy;
    arrastre.muestras = [...arrastre.muestras.filter(([t]) => e.timeStamp - t < 100), [e.timeStamp, dy]]; // últimos 100ms
    modal.style.transform = `translateY(${dy > 0 ? dy : resistencia(dy, arrastre.alto)}px)`;
  });
  const soltar = (e) => {
    if (!arrastre) return;
    const { dy, alto, muestras } = arrastre;
    arrastre = null;
    // velocidad al soltar (px/ms), con lo que el dedo hizo en los últimos 100ms
    const [t1, y1] = muestras[0], [t2, y2] = muestras[muestras.length - 1];
    const velocidad = e.timeStamp - t1 < 100 && t2 > t1 ? (y2 - y1) / (t2 - t1) : 0;
    const cierra = e.type === "pointerup" && dy > 24 && (dy > alto * 0.3 || velocidad > 0.11);
    modal.style.transition = "";
    // anima desde donde quedó el dedo; con movimiento reducido se desvanece ahí mismo
    if (!(cierra && reduceMotion)) modal.style.transform = "";
    if (cierra) cerrarModal();
  };
  agarre.addEventListener("pointerup", soltar);
  agarre.addEventListener("pointercancel", soltar);
  modal.addEventListener("cancel", (e) => { e.preventDefault(); cerrarModal(); }); // tecla Escape
  const openModal = (c) => {
    if (!c) return;
    const fotos = [c.imagen, ...(c.galeria || [])];
    $("#modalBody").innerHTML = `
      <div class="modal__media">
        ${visual(c, "modal__visual")}
        ${fotos.length > 1 ? `<div class="thumbs">${fotos.map((f, i) => `<button class="thumb${i ? "" : " on"}" type="button" data-foto="${esc(f)}" aria-label="Ver foto ${i + 1}"><img src="${esc(f)}" alt="" loading="lazy"></button>`).join("")}</div>` : ""}
      </div>
      <div class="modal__info">
        <span class="tag">${esc(c.categoria)}</span>
        <h3>${esc(titulo(c))}</h3>
        <table class="spec-table">${c.specs.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("")}</table>
        ${c.video ? `<button class="yt" type="button" data-yt="${esc(c.video)}" style="background-image:url(https://i.ytimg.com/vi/${esc(c.video)}/hqdefault.jpg)"><span>▶</span><em>Ver video del producto</em></button>` : ""}
        <div class="modal__foot">
          <div class="card__price">${precioPieza(c, `Precio de referencia${c.cantidad > 1 ? ` (${c.cantidad} × ${fmt(c.precioReferencia)})` : ""}`) || (c.precioReferencia ? `<small>Precio de referencia${c.cantidad > 1 ? ` · ${c.cantidad} × ${fmt(c.precioReferencia)}` : ""}</small>${fmt(ref(c))}` : `<small>Incluido</small>en el combo`)}${c.fuentePrecio ? `<span class="price-src">Fuente: ${esc(c.fuentePrecio)}</span>` : ""}</div>
          <div class="card__btns">
            ${partesOn && !c.vendido ? `<button class="btn btn--sm btn--ghost interes-btn" type="button" data-interes="${interesDe(c)}" aria-pressed="false"><span>＋ Me interesa</span></button>` : ""}
            <a class="btn btn--sm btn--link" href="${esc(c.link)}" target="_blank" rel="noopener">Página oficial ↗</a>
            ${waValido ? `<a class="btn btn--sm btn--wa" href="${waLink(`(Pregunta sobre: ${c.nombre})`)}" target="_blank" rel="noopener">Preguntar</a>` : ""}
          </div>
        </div>
      </div>`;
    abrirModal();
  };
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) cerrarModal();
    const th = e.target.closest("[data-foto]");
    if (th) {
      const img = modal.querySelector(".modal__visual img");
      if (img) {
        // Carga la foto nueva antes de cambiarla y la funde, en vez de saltar de golpe
        const nueva = new Image();
        nueva.src = th.dataset.foto;
        nueva.decode().catch(() => {}).then(() => {
          img.src = nueva.src;
          img.animate([{ opacity: 0.35 }, { opacity: 1 }], { duration: 220, easing: EASE_OUT });
        });
      }
      modal.querySelectorAll(".thumb").forEach((t) => t.classList.toggle("on", t === th));
    }
    const yt = e.target.closest("[data-yt]");
    if (yt) {
      const f = document.createElement("iframe");
      f.src = `https://www.youtube-nocookie.com/embed/${yt.dataset.yt}?autoplay=1&rel=0`;
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      f.className = "yt yt--on";
      f.title = "Video del producto";
      yt.replaceWith(f);
    }
  });
  modal.addEventListener("close", () => {
    clearTimeout(cierre);
    modal.style.transform = "";
    modal.classList.remove("is-open");
    $("#modalBody").innerHTML = "";
  });

  /* ---------- Rendimiento ---------- */
  const escala = Math.max(...D.rendimiento.map((r) => r.fps), 200) * 1.05;
  const hz = 165;
  $("#perfBars").innerHTML =
    `<div class="perf__hz" style="--x:${hz / escala}"><span>${hz} Hz</span></div>` +
    D.rendimiento
      .map((r, i) => {
        const tier = r.fps >= hz ? "top" : r.fps >= 90 ? "mid" : "ok";
        return `<div class="bar reveal">
          <div class="bar__label"><strong>${esc(r.juego)}</strong><small>${esc(r.ajustes)}</small></div>
          <div class="bar__track"><i class="bar__fill bar__fill--${tier}" style="--w:${(r.fps / escala) * 100}%"></i></div>
          <span class="bar__val mono">~${r.fps}<small> fps</small></span>
        </div>`;
      })
      .join("");
  $("#perfUses").innerHTML = D.usos
    .map((u, i) => `<div class="use reveal"><h4>${esc(u.titulo)}</h4><p>${esc(u.texto)}</p></div>`)
    .join("");

  /* ---------- Fotos reales ---------- */
  if (D.fotosReales.length) {
    $("#fotos").hidden = false;
    $("#gallery").innerHTML = D.fotosReales
      .map((f, i) => `<button class="shot reveal" type="button" data-shot="${i}"><img src="${esc(f.src)}" alt="${esc(f.texto || "Foto real del equipo")}" loading="lazy">${f.texto ? `<span>${esc(f.texto)}</span>` : ""}</button>`)
      .join("");
    $("#gallery").addEventListener("click", (e) => {
      const b = e.target.closest("[data-shot]");
      if (!b) return;
      const f = D.fotosReales[+b.dataset.shot];
      $("#modalBody").innerHTML = `<figure class="modal__photo"><img src="${esc(f.src)}" alt="${esc(f.texto || "")}">${f.texto ? `<figcaption>${esc(f.texto)}</figcaption>` : ""}</figure>`;
      abrirModal();
    });
  }

  /* ---------- Recibo de precio ---------- */
  const linea = (c) =>
    enCombo.has(c.id)
      ? `<li class="has-ref ${c.vendido ? "is-sold" : ""}"><div class="receipt__row"><span>${esc(titulo(c))}</span><i></i><b>${fmt(enCombo.get(c.id))}</b></div><small class="receipt__was">Ref. <s>${fmt(ref(c))}</s></small></li>`
      : `<li class="${c.vendido ? "is-sold" : ""}"><span>${esc(titulo(c))}</span><i></i><b>${c.precioReferencia ? fmt(ref(c)) : "Incluido"}</b></li>`;
  const barcode = Array.from({ length: 48 }, (_, i) => `<i style="width:${1 + ((i * 7) % 4)}px"></i>`).join("");
  $("#receipt").innerHTML = `
    <div class="receipt__paper">
      <header><strong>VENTA·PC</strong><span class="mono">${new Date().toLocaleDateString("es-CO")} · ${esc(C.ubicacion || "")}</span></header>
      <p class="receipt__sec">Torre</p>
      <ul>${D.componentes.map(linea).join("")}</ul>
      <p class="receipt__sec">Periféricos</p>
      <ul>${D.perifericos.map(linea).join("")}</ul>
      <div class="receipt__tot"><span>Valor de referencia</span><b class="${precio ? "strike" : ""}">${fmt(totalRef)}</b></div>
      ${precio
        ? `${ahorro ? `<div class="receipt__tot receipt__tot--save"><span>Descuento (${ahorroPct}%)</span><b>−${fmt(ahorro)}</b></div>` : ""}
           <div class="receipt__tot receipt__tot--big"><span>Total a pagar</span><b>${fmt(precio)}</b></div>`
        : `<div class="receipt__tot receipt__tot--big"><span>Precio de venta</span><b>Consultar</b></div>`}
      ${C.notaPrecios ? `<p class="receipt__note">* ${esc(C.notaPrecios)}</p>` : ""}
      <div class="barcode">${barcode}</div>
    </div>`;

  const incluidos = todos.filter((c) => !c.precioReferencia).map((c) => c.categoria.toLowerCase()).join(", ").replace(/, ([^,]*)$/, " y $1");
  $("#deal").innerHTML = precio
    ? `<div class="ring reveal" style="--pct:${ahorroPct}"><div><strong>${ahorroPct}%</strong><span>de ahorro</span></div></div>
       <p>${incluidos ? "Solo las piezas con precio de referencia ya suman" : "El valor de referencia de todo el combo es"} <b>${fmt(totalRef)}</b>. Te llevas todo, armado y listo, por <b class="grad">${fmt(precio)}</b>.</p>
       ${incluidos ? `<p class="muted small">Además van incluidos sin costo adicional: ${esc(incluidos)}.</p>` : ""}
       <a class="btn btn--wa js-wa-deal" href="${waValido ? waLink() : "#contacto"}" ${waValido ? 'target="_blank" rel="noopener"' : ""}>Lo quiero</a>`
    : `<div class="ring ring--idle reveal" style="--pct:100"><div><strong>${D.componentes.length + D.perifericos.length}</strong><span>piezas</span></div></div>
       <p>${incluidos ? "Las piezas con precio de referencia suman" : "El valor de referencia de todo el combo es"} <b>${fmt(totalRef)}</b>.</p>
       ${incluidos ? `<p class="muted small">Además van incluidos: ${esc(incluidos)}.</p>` : ""}
       <a class="btn btn--wa" href="${waValido ? waLink() : "#contacto"}" ${waValido ? 'target="_blank" rel="noopener"' : ""}>Consultar precio</a>`;

  /* ---------- Arma tu oferta (venta por partes) ---------- */
  if (partesOn) {
    const P = C.partes || {};
    const DESC = P.descuentoPct ?? 30, AVISO = P.avisoOfertaBajaPct ?? 15;
    const centena = (n) => Math.round(n / 100) * 100;
    const gab = D.componentes.find((c) => c.id === "gabinete") || D.componentes[0];
    // Lo que se puede elegir: la torre entera y cada periférico
    const elegibles = [
      { id: "torre", nombre: "Torre completa", detalle: D.componentes.map((c) => c.corto).join(" · "), ref: D.componentes.reduce((s, c) => s + ref(c), 0), imagen: gab.imagen, vendido: D.componentes.some((c) => c.vendido) },
      ...D.perifericos.map((c) => ({ id: c.id, nombre: titulo(c), detalle: c.categoria, ref: ref(c), imagen: c.imagen, vendido: c.vendido })),
    ].map((it) => ({ ...it, suelto: centena(it.ref * (1 - DESC / 100)) }));
    const disponibles = elegibles.filter((it) => !it.vendido);
    const porId = new Map(elegibles.map((it) => [it.id, it]));

    // Estado: lo marcado y la oferta escrita. Se recuerda si la persona vuelve (si el navegador lo permite).
    const CLAVE = "ventapc-oferta";
    const sel = new Set();
    let oferta = 0;
    try {
      const g = JSON.parse(localStorage.getItem(CLAVE) || "null");
      if (g) { (g.sel || []).forEach((id) => porId.has(id) && !porId.get(id).vendido && sel.add(id)); oferta = +g.oferta || 0; }
    } catch (_) { /* sin almacenamiento: empieza vacío */ }
    const guardar = () => { try { localStorage.setItem(CLAVE, JSON.stringify({ sel: [...sel], oferta })); } catch (_) {} };

    const calcular = () => {
      const items = disponibles.filter((it) => sel.has(it.id));
      const todo = items.length === disponibles.length && items.length > 0;
      const suma = items.reduce((s, it) => s + it.suelto, 0);
      const sugerido = todo ? precio : suma;
      return { items, todo, suma, sugerido, faltan: disponibles.length - items.length };
    };
    const corto = ({ items, todo }) =>
      todo ? "Combo completo" : items.length === 1 ? items[0].nombre : `${items.length} elementos`;
    const mensaje = (k) => {
      const lineas = ["¡Hola! Vi tu PC gamer en la página y quiero hacerte una oferta."];
      if (k.todo) lineas.push("Me interesa el combo completo.");
      else lineas.push("Me interesa:", ...k.items.map((it) => `• ${it.nombre}`));
      lineas.push(`Precio sugerido en la página: ${fmt(k.sugerido)}`);
      lineas.push(oferta ? `Mi oferta: ${fmt(oferta)}` : "¿Qué precio me dejas?");
      return lineas.join("\n");
    };

    // Lista + resumen. Se usa en la sección y, en el celular, dentro de la hoja que sube desde abajo.
    const vistaOferta = () => `
      <div class="oferta">
        <div class="oferta__elegir">
          <div class="oferta__atajos">
            <button class="chip" type="button" data-preset="torre">Torre completa</button>
            <button class="chip" type="button" data-preset="perifericos">Solo periféricos</button>
            <button class="chip" type="button" data-preset="todo">Todo (combo)</button>
            <button class="chip chip--suave" type="button" data-preset="limpiar">Limpiar</button>
          </div>
          <ul class="oferta__lista">${elegibles.map((it) => `
            <li><button class="oferta__item" type="button" data-interes="${it.id}" aria-pressed="false"${it.vendido ? " disabled" : ""}>
              <span class="oferta__foto"><img src="${esc(it.imagen)}" alt="" loading="lazy" onerror="this.remove()"></span>
              <span class="oferta__txt"><b>${esc(it.nombre)}</b><small>${it.vendido ? "Vendido" : esc(it.detalle)}</small></span>
              <span class="oferta__precio">${it.vendido ? "—" : fmt(it.suelto)}<small>Ref. <s>${fmt(it.ref)}</s></small></span>
              <span class="oferta__check" aria-hidden="true"></span>
            </button></li>`).join("")}
          </ul>
        </div>
        <div class="oferta__resumen">
          <small class="oferta__label" data-o="corto"></small>
          <strong class="oferta__sugerido" data-o="sugerido"></strong>
          <p class="oferta__nota" data-o="nota"></p>
          <div class="oferta__campo" data-o="campo">
            <label class="oferta__label">Tu oferta
              <span class="oferta__input"><span aria-hidden="true">$</span><input class="js-oferta-input" type="text" inputmode="numeric" autocomplete="off" enterkeyhint="done" placeholder="Escribe tu oferta"></span>
            </label>
            <div class="oferta__rapidos">
              <button class="chip" type="button" data-rapido="0">Sugerido</button>
              <button class="chip" type="button" data-rapido="5">−5%</button>
              <button class="chip" type="button" data-rapido="10">−10%</button>
            </div>
            <p class="oferta__aviso" data-o="aviso" aria-live="polite"></p>
          </div>
          <div class="oferta__acciones">
            <a class="btn btn--wa" data-o-enviar target="_blank" rel="noopener"><svg viewBox="0 0 24 24" aria-hidden="true"><use href="#i-wa"/></svg>Enviar oferta por WhatsApp</a>
            <button class="btn btn--ghost" type="button" data-o-copiar>Copiar mensaje</button>
          </div>
          <p class="oferta__legal">Tu oferta no es un compromiso de compra: la confirmamos juntos por WhatsApp.</p>
        </div>
      </div>`;

    $("#oferta").hidden = false;
    $("#ofertaBox").innerHTML = vistaOferta();
    const barra = $("#ofertaBarra");
    let seccionVisible = false;

    // Pinta todo lo que depende de la selección. Sin animaciones: se toca muchas veces seguidas.
    const pintar = () => {
      const k = calcular();
      const hay = k.items.length > 0;
      document.querySelectorAll("[data-interes]").forEach((b) => {
        const on = sel.has(b.dataset.interes);
        b.setAttribute("aria-pressed", on);
        b.classList.toggle("on", on);
        const t = b.querySelector(":scope > span");
        if (t && (b.classList.contains("interes") || b.classList.contains("interes-btn"))) t.textContent = on ? "✓ En tu oferta" : "＋ Me interesa";
      });
      document.querySelectorAll('[data-o="corto"]').forEach((e) => (e.textContent = hay ? corto(k) : "Tu selección"));
      document.querySelectorAll('[data-o="sugerido"]').forEach((e) => (e.textContent = hay ? fmt(k.sugerido) : "—"));
      document.querySelectorAll('[data-o="nota"]').forEach((e) => {
        if (!hay) e.textContent = "Marca lo que te interesa para ver el precio sugerido.";
        else if (k.todo) e.textContent = `Es el combo completo, el mejor precio: ahorras ${fmt(ahorro)} frente a las piezas nuevas.`;
        else if (k.suma >= precio) e.innerHTML = `Por ${fmt(precio)} te llevas <b>todo el combo</b>: sale más barato que tu selección. <button class="chip chip--combo" type="button" data-preset="todo">Llevar el combo</button>`;
        else e.innerHTML = `Por <b>${fmt(precio - k.suma)}</b> más te llevas todo el combo (${k.faltan} ${k.faltan === 1 ? "elemento" : "elementos"} más). <button class="chip chip--combo" type="button" data-preset="todo">Llevar el combo</button>`;
      });
      const baja = hay && oferta > 0 && oferta < k.sugerido * (1 - AVISO / 100);
      document.querySelectorAll('[data-o="aviso"]').forEach((e) => (e.textContent = baja ? "Es una oferta baja; puede que no se acepte, pero igual puedes enviarla." : ""));
      document.querySelectorAll('[data-o="campo"]').forEach((e) => e.classList.toggle("is-off", !hay));
      document.querySelectorAll(".js-oferta-input").forEach((i) => {
        if (document.activeElement !== i) i.value = oferta ? oferta.toLocaleString("es-CO") : "";
        i.disabled = !hay;
      });
      const texto = hay ? mensaje(k) : "";
      document.querySelectorAll("[data-o-enviar]").forEach((a) => {
        a.href = waValido && hay ? `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(texto)}` : "#oferta";
        a.classList.toggle("is-disabled", !hay);
        a.setAttribute("aria-disabled", !hay);
      });
      document.querySelectorAll("[data-o-copiar]").forEach((b) => (b.disabled = !hay));
      barra.classList.toggle("is-visible", hay && !seccionVisible);
      guardar();
    };

    const toggle = (id, desdeTarjeta) => {
      const it = porId.get(id);
      if (!it || it.vendido) return;
      oferta = 0; // la oferta escrita era para otra selección
      if (sel.has(id)) sel.delete(id);
      else {
        sel.add(id);
        if (desdeTarjeta && id === "torre") toast("La torre se vende completa: la agregué a tu oferta");
      }
      pintar();
    };
    const preset = (p) => {
      sel.clear();
      oferta = 0;
      if (p === "torre") sel.add("torre");
      if (p === "perifericos") D.perifericos.forEach((c) => sel.add(c.id));
      if (p === "todo") elegibles.forEach((it) => sel.add(it.id));
      disponibles.length !== elegibles.length && elegibles.forEach((it) => it.vendido && sel.delete(it.id));
      pintar();
    };

    document.addEventListener("click", (e) => {
      const b = e.target.closest("[data-interes]");
      if (b) { toggle(b.dataset.interes, !b.classList.contains("oferta__item")); return; }
      const pr = e.target.closest("[data-preset]");
      if (pr) { preset(pr.dataset.preset); return; }
      const r = e.target.closest("[data-rapido]");
      if (r) {
        const k = calcular();
        if (k.items.length) { oferta = Math.round((k.sugerido * (1 - +r.dataset.rapido / 100)) / 10000) * 10000; pintar(); }
        return;
      }
      const env = e.target.closest("[data-o-enviar]");
      if (env && (!calcular().items.length || !waValido)) {
        e.preventDefault();
        if (!waValido && calcular().items.length) toast("Falta configurar el número de WhatsApp en js/data.js");
        return;
      }
      if (e.target.closest("[data-o-copiar]")) {
        const k = calcular();
        if (!k.items.length) return;
        navigator.clipboard?.writeText(mensaje(k)).then(() => toast("Mensaje copiado ✔"), () => toast("No se pudo copiar"));
        return;
      }
      if (e.target.closest("[data-o-abrir]")) {
        if (enHoja.matches) {
          // Celular: la oferta se abre en la hoja que sube desde abajo
          $("#modalBody").innerHTML = `<div class="modal__oferta"><h3>Tu oferta</h3>${vistaOferta()}</div>`;
          abrirModal();
          pintar();
        } else $("#oferta").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    });
    // El campo de la oferta: solo números, con puntos de miles mientras se escribe
    document.addEventListener("input", (e) => {
      const i = e.target.closest(".js-oferta-input");
      if (!i) return;
      oferta = +i.value.replace(/\D/g, "").slice(0, 10) || 0;
      i.value = oferta ? oferta.toLocaleString("es-CO") : "";
      document.querySelectorAll(".js-oferta-input").forEach((o) => o !== i && (o.value = i.value));
      pintar();
    });
    // La barrita se esconde mientras la sección de la oferta está en pantalla
    new IntersectionObserver(([en]) => { seccionVisible = en.isIntersecting; pintar(); }, { threshold: 0.05 }).observe($("#oferta"));
    modal.addEventListener("close", pintar);
    // Cada vez que se abre una ficha, su botón "Me interesa" muestra el estado actual
    new MutationObserver(pintar).observe($("#modalBody"), { childList: true });
    pintar();
  }

  /* ---------- Datos de la venta ---------- */
  const facts = [
    ["Estado", C.estado],
    ["Garantía", C.garantia],
    ["Ubicación", C.ubicacion],
    ["Entrega", C.entrega],
    ["Venta por partes", C.ventaPorPartes ? "Periféricos por separado; la torre, completa" : "Solo el combo completo"],
  ].filter(([, v]) => v);
  $("#facts").innerHTML = facts.map(([k, v]) => `<li><small>${esc(k)}</small><b>${esc(v)}</b></li>`).join("");

  /* ---------- Compartir ---------- */
  $("#shareBtn").addEventListener("click", async () => {
    const data = { title: document.title, text: "Mira este PC gamer en venta", url: location.href };
    try {
      if (navigator.share) await navigator.share(data);
      else { await navigator.clipboard.writeText(location.href); toast("Link copiado ✔"); }
    } catch (_) { /* cancelado */ }
  });

  /* ---------- Aparición al hacer scroll ---------- */
  // El escalonado depende de lo que aparece junto, no del puesto en la lista:
  // lo que entra solo aparece al instante; en grupo, 60ms entre uno y otro (máx. 300ms)
  const io = new IntersectionObserver(
    (entries) => {
      let k = 0;
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const d = Math.min(k++, 5) * 60;
        en.target.style.setProperty("--d", `${d}ms`);
        en.target.classList.add("in");
        const n = en.target.querySelector("[data-count]");
        if (n) setTimeout(() => countUp(n), d);
        io.unobserve(en.target);
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- Botón flotante: una sola onda al llegar al precio ---------- */
  const waFloat = $(".wa-float"), precioSec = $("#precio");
  if (waFloat && precioSec) {
    const avisa = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting || reduceMotion) return;
      waFloat.classList.add("is-calling");
      avisa.disconnect();
    }, { threshold: 0.3 });
    avisa.observe(precioSec);
  }

  /* ---------- Pausar animaciones decorativas fuera de pantalla ---------- */
  const fuera = new IntersectionObserver((entries) =>
    entries.forEach((en) => en.target.classList.toggle("is-off", !en.isIntersecting)));
  document.querySelectorAll("main section").forEach((s) => fuera.observe(s));

  /* ---------- Si cambia la preferencia de movimiento con la página abierta ---------- */
  movReducido.addEventListener("change", () => {
    reduceMotion = movReducido.matches;
    ponerEtiqueta();
    if (reduceMotion) {
      // todo vuelve a su posición de reposo
      ["--tx", "--ty"].forEach((p) => tower.style.removeProperty(p));
      document.querySelectorAll(".card").forEach((el) => {
        el.classList.remove("is-hover");
        ["--gmx", "--gmy", "--grx", "--gry"].forEach((p) => el.style.removeProperty(p));
        ["--rx", "--ry", "--mx", "--my"].forEach((p) => el.querySelector(".card__inner").style.removeProperty(p));
      });
    }
    requestAnimationFrame(() => { layout(); renderExplode(); }); // el build cambia de alto
  });
})();
