(() => {
  const D = window.VENTA;
  const C = D.config;
  const ICON = window.ICONOS;
  const $ = (sel, root = document) => root.querySelector(sel);
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const fmt = (n) => "$" + Math.round(n).toLocaleString("es-CO");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const todos = [...D.componentes, ...D.perifericos];
  const ref = (c) => (c.precioReferencia || 0) * (c.cantidad || 1);
  const titulo = (c) => (c.cantidad > 1 ? `${c.cantidad}× ` : "") + c.nombre;
  const totalRef = todos.reduce((s, c) => s + ref(c), 0);
  const precio = C.precioVenta;
  const ahorro = precio ? Math.max(0, totalRef - precio) : 0;
  const ahorroPct = precio && totalRef ? Math.round((ahorro / totalRef) * 100) : 0;

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
  if (!reduceMotion && matchMedia("(pointer:fine)").matches) {
    addEventListener("pointermove", (e) => {
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
    <article class="card reveal ${c.vendido ? "is-sold" : ""}" style="--d:${i * 60}ms" data-id="${c.id}">
      <div class="card__inner">
        <div class="card__holo"></div>
        ${visual(c, "card__visual")}
        <div class="card__body">
          <div class="card__tags"><span class="tag">${esc(c.categoria)}</span>${c.destacado ? `<span class="tag tag--hl">${esc(c.destacado)}</span>` : ""}</div>
          <h3>${esc(titulo(c))}</h3>
          <ul class="card__specs">${c.specs.slice(0, 3).map(([k, v]) => `<li><span>${esc(k)}</span><b>${esc(v)}</b></li>`).join("")}</ul>
          <div class="card__foot">
            <div class="card__price">${c.precioReferencia ? `<small>Referencia${c.cantidad > 1 ? ` · ${c.cantidad} unidades` : ""}</small>${fmt(ref(c))}` : `<small>Incluido</small>en el combo`}</div>
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

  if (!reduceMotion) {
    document.querySelectorAll(".card").forEach((el) => {
      const inner = el.querySelector(".card__inner");
      el.addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch") return;
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
      addEventListener("deviceorientation", (e) => {
        if (e.gamma == null) return;
        const gx = clamp((e.gamma + 30) / 60), gy = clamp((e.beta - 20) / 60);
        const root = document.documentElement.style;
        root.setProperty("--gmx", `${gx * 100}%`);
        root.setProperty("--gmy", `${gy * 100}%`);
        root.setProperty("--grx", `${(0.5 - gy) * 8}deg`);
        root.setProperty("--gry", `${(gx - 0.5) * 10}deg`);
      });
    }
  }

  /* ---------- Modal ---------- */
  const modal = $("#modal");
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
          <div class="card__price">${c.precioReferencia ? `<small>Precio de referencia${c.cantidad > 1 ? ` · ${c.cantidad} × ${fmt(c.precioReferencia)}` : ""}</small>${fmt(ref(c))}` : `<small>Incluido</small>en el combo`}${c.fuentePrecio ? `<span class="price-src">Fuente: ${esc(c.fuentePrecio)}</span>` : ""}</div>
          <div class="card__btns">
            <a class="btn btn--sm btn--link" href="${esc(c.link)}" target="_blank" rel="noopener">Página oficial ↗</a>
            ${waValido ? `<a class="btn btn--sm btn--wa" href="${waLink(`(Pregunta sobre: ${c.nombre})`)}" target="_blank" rel="noopener">Preguntar</a>` : ""}
          </div>
        </div>
      </div>`;
    modal.showModal();
  };
  modal.addEventListener("click", (e) => {
    if (e.target === modal || e.target.closest("[data-close]")) modal.close();
    const th = e.target.closest("[data-foto]");
    if (th) {
      const img = modal.querySelector(".modal__visual img");
      if (img) img.src = th.dataset.foto;
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
  modal.addEventListener("close", () => ($("#modalBody").innerHTML = ""));

  /* ---------- Rendimiento ---------- */
  const escala = Math.max(...D.rendimiento.map((r) => r.fps), 200) * 1.05;
  const hz = 165;
  $("#perfBars").innerHTML =
    `<div class="perf__hz" style="--x:${hz / escala}"><span>${hz} Hz</span></div>` +
    D.rendimiento
      .map((r, i) => {
        const tier = r.fps >= hz ? "top" : r.fps >= 90 ? "mid" : "ok";
        return `<div class="bar reveal" style="--d:${i * 70}ms">
          <div class="bar__label"><strong>${esc(r.juego)}</strong><small>${esc(r.ajustes)}</small></div>
          <div class="bar__track"><i class="bar__fill bar__fill--${tier}" style="--w:${(r.fps / escala) * 100}%"></i></div>
          <span class="bar__val mono">~${r.fps}<small> fps</small></span>
        </div>`;
      })
      .join("");
  $("#perfUses").innerHTML = D.usos
    .map((u, i) => `<div class="use reveal" style="--d:${i * 80}ms"><h4>${esc(u.titulo)}</h4><p>${esc(u.texto)}</p></div>`)
    .join("");

  /* ---------- Fotos reales ---------- */
  if (D.fotosReales.length) {
    $("#fotos").hidden = false;
    $("#gallery").innerHTML = D.fotosReales
      .map((f, i) => `<button class="shot reveal" type="button" data-shot="${i}" style="--d:${i * 60}ms"><img src="${esc(f.src)}" alt="${esc(f.texto || "Foto real del equipo")}" loading="lazy">${f.texto ? `<span>${esc(f.texto)}</span>` : ""}</button>`)
      .join("");
    $("#gallery").addEventListener("click", (e) => {
      const b = e.target.closest("[data-shot]");
      if (!b) return;
      const f = D.fotosReales[+b.dataset.shot];
      $("#modalBody").innerHTML = `<figure class="modal__photo"><img src="${esc(f.src)}" alt="${esc(f.texto || "")}">${f.texto ? `<figcaption>${esc(f.texto)}</figcaption>` : ""}</figure>`;
      modal.showModal();
    });
  }

  /* ---------- Recibo de precio ---------- */
  const linea = (c) =>
    `<li class="${c.vendido ? "is-sold" : ""}"><span>${esc(titulo(c))}</span><i></i><b>${c.precioReferencia ? fmt(ref(c)) : "Incluido"}</b></li>`;
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
        ? `${ahorro ? `<div class="receipt__tot receipt__tot--save"><span>Descuento</span><b>−${fmt(ahorro)}</b></div>` : ""}
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

  /* ---------- Datos de la venta ---------- */
  const facts = [
    ["Estado", C.estado],
    ["Garantía", C.garantia],
    ["Ubicación", C.ubicacion],
    ["Entrega", C.entrega],
    ["Venta por partes", C.ventaPorPartes ? "Sí, pregunta por la pieza que te interesa" : "Solo el combo completo"],
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
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        const n = en.target.querySelector("[data-count]");
        if (n) countUp(n);
        io.unobserve(en.target);
      }),
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
})();
