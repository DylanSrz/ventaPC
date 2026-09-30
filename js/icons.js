/* Ilustraciones de respaldo (se muestran si falta la imagen del producto) */
window.ICONOS = (() => {
  const s = (body) =>
    `<svg viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
  return {
    gpu: s(`<rect x="4" y="18" width="52" height="26" rx="3"/><circle cx="20" cy="31" r="8"/><circle cx="40" cy="31" r="8"/><path d="M20 23v16M12 31h16M40 23v16M32 31h16"/><path d="M56 22h4v18h-4M10 44v6h22v-6"/>`),
    cpu: s(`<rect x="16" y="16" width="32" height="32" rx="3"/><rect x="24" y="24" width="16" height="16" rx="1"/><path d="M24 8v8M32 8v8M40 8v8M24 48v8M32 48v8M40 48v8M8 24h8M8 32h8M8 40h8M48 24h8M48 32h8M48 40h8"/>`),
    mobo: s(`<rect x="8" y="6" width="48" height="52" rx="3"/><rect x="16" y="14" width="14" height="14" rx="1"/><path d="M38 12v20M42 12v20M46 12v20M50 12v20"/><path d="M14 38h36M14 44h36"/><rect x="16" y="50" width="10" height="4"/><circle cx="44" cy="52" r="2"/>`),
    ram: s(`<rect x="4" y="18" width="56" height="22" rx="2"/><path d="M10 40v6M16 40v6M22 40v6M28 40v6M36 40v6M42 40v6M48 40v6M54 40v6"/><rect x="10" y="24" width="8" height="10"/><rect x="22" y="24" width="8" height="10"/><rect x="34" y="24" width="8" height="10"/><rect x="46" y="24" width="8" height="10"/><path d="M4 18c8-6 48-6 56 0" opacity=".6"/>`),
    cooler: s(`<rect x="4" y="8" width="56" height="26" rx="3"/><circle cx="18" cy="21" r="9"/><circle cx="46" cy="21" r="9"/><path d="M18 12c4 4 4 14 0 18M46 12c4 4 4 14 0 18"/><path d="M26 34c0 8 4 12 10 12M38 34c0 6-2 10-4 12"/><circle cx="32" cy="50" r="7"/><circle cx="32" cy="50" r="3"/>`),
    psu: s(`<rect x="6" y="12" width="52" height="40" rx="3"/><circle cx="26" cy="32" r="13"/><path d="M26 19v26M13 32h26M17 23l18 18M35 23 17 41"/><path d="M46 20h6M46 26h6M46 32h6"/><rect x="45" y="40" width="8" height="6"/>`),
    ssd: s(`<rect x="4" y="22" width="56" height="20" rx="2"/><path d="M4 28h4v8H4"/><rect x="14" y="26" width="10" height="12" rx="1"/><rect x="28" y="26" width="10" height="12" rx="1"/><rect x="42" y="27" width="8" height="10" rx="1"/><circle cx="56" cy="32" r="2"/>`),
    gabinete: s(`<rect x="14" y="4" width="36" height="56" rx="3"/><rect x="19" y="9" width="22" height="46" rx="1"/><circle cx="30" cy="20" r="5"/><circle cx="30" cy="32" r="5"/><circle cx="30" cy="44" r="5"/><path d="M45 10v44"/>`),
    monitor: s(`<rect x="4" y="8" width="56" height="36" rx="3"/><path d="M10 38 22 24l8 8 8-12 16 18"/><path d="M26 44l-2 8h16l-2-8M18 56h28"/>`),
    soporte: s(`<rect x="2" y="8" width="24" height="16" rx="2"/><rect x="38" y="8" width="24" height="16" rx="2"/><path d="M14 24v4l12 8h12l12-8v-4"/><path d="M32 36v18M24 56h16"/><circle cx="32" cy="36" r="2"/>`),
    teclado: s(`<rect x="2" y="18" width="60" height="28" rx="3"/><path d="M8 25h4M16 25h4M24 25h4M32 25h4M40 25h4M48 25h8M8 32h6M18 32h4M26 32h4M34 32h4M42 32h4M50 32h6M8 39h8M20 39h24M48 39h8"/>`),
    mic: s(`<rect x="22" y="4" width="20" height="32" rx="10"/><path d="M22 14h20M22 20h20M22 26h20"/><path d="M14 26c0 10 8 18 18 18s18-8 18-18"/><path d="M32 44v10M22 58h20"/>`),
    cam: s(`<rect x="10" y="12" width="44" height="30" rx="12"/><circle cx="32" cy="27" r="9"/><circle cx="32" cy="27" r="4"/><circle cx="48" cy="18" r="1.5"/><path d="M26 42l-4 12h20l-4-12"/>`),
  };
})();
