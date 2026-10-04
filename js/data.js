/*
 * ============================================================
 *  DATOS DE LA VENTA — este es el único archivo que necesitas editar
 * ============================================================
 *  - Precios en pesos colombianos, sin puntos: 2500000
 *  - Imágenes: pon el archivo en img/productos/ con el nombre indicado
 *    en "imagen". Si no existe, se muestra un ícono en su lugar.
 *    "galeria" son fotos extra que se ven en la ficha del producto.
 *  - Para marcar algo como vendido: vendido: true
 *  - cantidad: 2 multiplica el precio de referencia (ej. dos monitores)
 *  - precioReferencia: valor de referencia de la pieza nueva (lo define el vendedor).
 *    Opcional: fuentePrecio muestra de dónde salió el precio en la ficha.
 */
window.VENTA = {
  config: {
    // Número con indicativo de país, sin "+" ni espacios. Ej: 573001234567
    whatsapp: "573207131117",
    mensajeWhatsapp: "¡Hola! Vi tu PC gamer en la página y me interesa. ¿Sigue disponible?",

    // Precio al que vendes TODO el combo. null = aún no definido ("Consultar precio")
    precioVenta: 8990000,

    // ¿Aceptas vender piezas por separado?
    ventaPorPartes: false,

    ubicacion: "Barranquilla, Colombia",
    entrega: "Entrega presencial en Barranquilla",
    estado: "2 años de uso",
    garantia: "Sin garantía vigente",
    moneda: "COP",
    // Texto que acompaña a los precios de referencia en la página
    notaPrecios: "Valores de referencia estimados por el vendedor para equipos nuevos equivalentes.",
  },

  // Fotos reales del equipo: pon los archivos en img/reales/ y agrégalos aquí.
  // Ej: { src: "img/reales/frontal.jpg", texto: "Vista frontal con RGB encendido" }
  fotosReales: [
    { src: "img/reales/setup-1.webp", texto: "El setup completo en uso: 2 monitores, QuadCast S y la torre con RGB" },
    { src: "img/reales/setup-2.webp", texto: "Monitor vertical y principal montados en el brazo doble" },
    { src: "img/reales/setup-3.webp", texto: "Vista lateral con luz ambiente" },
    { src: "img/reales/setup-4.webp", texto: "Teclado K619 y refrigeración líquida encendidos" },
  ],

  componentes: [
    {
      id: "gpu",
      categoria: "Tarjeta gráfica",
      nombre: "MSI GeForce RTX™ 4060 GAMING X NV EDITION 8G",
      corto: "RTX 4060 8G",
      precioReferencia: 2062900,
      imagen: "img/productos/gpu.webp",
      galeria: ["img/productos/gpu-2.webp", "img/productos/gpu-3.webp"],
      link: "https://latam.msi.com/Graphics-Card/GeForce-RTX-4060-GAMING-X-NV-EDITION-8G",
      video: "KumnfpvlW6A",
      destacado: "DLSS 3 + Frame Generation",
      specs: [
        ["Memoria", "8 GB GDDR6 · 128-bit · 17 Gbps"],
        ["Núcleos CUDA", "3072"],
        ["Boost", "2595 MHz"],
        ["Consumo", "115 W"],
        ["Salidas", "3× DisplayPort 1.4a · 1× HDMI 2.1a"],
        ["Refrigeración", "TWIN FROZR 9 · ventiladores TORX 5.0"],
        ["Tamaño", "247 × 130 × 41 mm"],
      ],
    },
    {
      id: "cpu",
      categoria: "Procesador",
      nombre: "Intel® Core™ i5-12600KF",
      corto: "i5-12600KF",
      precioReferencia: 996900,
      imagen: "img/productos/cpu.webp",
      galeria: ["img/productos/cpu-2.webp", "img/productos/cpu-3.webp"],
      link: "https://www.intel.com/content/www/us/en/products/sku/134590/intel-core-i512600kf-processor-20m-cache-up-to-4-90-ghz/specifications.html",
      destacado: "Desbloqueado para overclock",
      specs: [
        ["Núcleos", "10 (6 P-cores + 4 E-cores)"],
        ["Hilos", "16"],
        ["Frecuencia máx.", "4.9 GHz"],
        ["Caché", "20 MB Intel® Smart Cache"],
        ["Potencia", "125 W base · 150 W turbo"],
        ["Socket", "LGA 1700"],
      ],
    },
    {
      id: "mobo",
      categoria: "Board",
      nombre: "GIGABYTE Z690 AORUS ULTRA",
      corto: "Z690 AORUS ULTRA",
      precioReferencia: 1542200,
      imagen: "img/productos/mobo.webp",
      galeria: ["img/productos/mobo-2.webp", "img/productos/mobo-3.webp", "img/productos/mobo-4.webp", "img/productos/mobo-5.webp"],
      link: "https://www.aorus.com/motherboards/z690-aorus-ultra-rev-1x/Key-Features",
      destacado: "PCIe 5.0 + DDR5",
      specs: [
        ["Chipset", "Intel® Z690 · LGA 1700 · ATX"],
        ["VRM", "16+1+2 fases · 105 A"],
        ["Memoria", "DDR5 · 4 ranuras"],
        ["Almacenamiento", "4× M.2 NVMe PCIe 4.0 con disipador"],
        ["Red", "2.5 GbE LAN · Wi-Fi 6 · Bluetooth 5"],
        ["USB", "USB 3.2 Gen2x2 Type-C (20 Gb/s)"],
        ["Audio", "ALC4080 Hi-Fi"],
      ],
    },
    {
      id: "ram",
      categoria: "Memoria RAM",
      nombre: "CORSAIR VENGEANCE RGB DDR5 32 GB (2×16 GB) 6000 MHz C36",
      corto: "32 GB DDR5",
      precioReferencia: 2310400,
      imagen: "img/productos/ram.webp",
      galeria: ["img/productos/ram-2.webp", "img/productos/ram-3.webp", "img/productos/ram-4.webp"],
      link: "https://www.corsair.com/ww/es/p/memory/cmh32gx5m2d6000c36/vengeance-rgb-32gb-2x16gb-ddr5-dram-6000mhz-c36-memory-kit-black-cmh32gx5m2d6000c36",
      destacado: "RGB direccionable",
      specs: [
        ["Capacidad", "32 GB (2 × 16 GB)"],
        ["Velocidad", "DDR5 6000 MHz"],
        ["Latencia", "CL36"],
        ["Perfiles", "Intel® XMP 3.0"],
        ["Iluminación", "RGB controlable con iCUE"],
      ],
    },
    {
      id: "cooler",
      categoria: "Refrigeración líquida",
      nombre: "MSI MAG CORELIQUID C240",
      corto: "AIO 240 mm",
      precioReferencia: 568800,
      imagen: "img/productos/cooler.webp",
      galeria: ["img/productos/cooler-2.webp", "img/productos/cooler-3.webp"],
      link: "https://latam.msi.com/Liquid-Cooling/MAG-CORELIQUID-C240",
      destacado: "ARGB en bloque y ventiladores",
      specs: [
        ["Radiador", "240 mm (276 × 120 × 27 mm)"],
        ["Ventiladores", "2 × 120 mm ARGB · 500–2000 RPM"],
        ["Flujo de aire", "78.73 CFM"],
        ["Bomba", "4200 RPM · 18 dBA"],
        ["Compatibilidad", "LGA 1700"],
      ],
    },
    {
      id: "psu",
      categoria: "Fuente de poder",
      nombre: "CORSAIR RM750x 80 PLUS Gold",
      corto: "750 W Gold",
      precioReferencia: 679000,
      imagen: "img/productos/psu.webp",
      galeria: ["img/productos/psu-2.webp", "img/productos/psu-3.webp", "img/productos/psu-4.webp", "img/productos/psu-5.webp"],
      link: "https://www.corsair.com/lm/es/p/psu/cp-9020179-na/rmx-series-rm750x-750-watt-80-plus-gold-certified-fully-modular-psu-cp-9020179-na",
      destacado: "100 % modular",
      specs: [
        ["Potencia", "750 W"],
        ["Eficiencia", "80 PLUS Gold"],
        ["Cableado", "Totalmente modular"],
        ["Ventilador", "135 mm con modo Zero RPM"],
        ["Condensadores", "Japoneses de 105 °C"],
      ],
    },
    {
      id: "ssd",
      categoria: "Almacenamiento",
      nombre: "Samsung 990 PRO 1 TB PCIe 4.0 NVMe M.2",
      corto: "SSD 1 TB NVMe",
      precioReferencia: 1347500,
      imagen: "img/productos/ssd.webp",
      galeria: ["img/productos/ssd-2.webp", "img/productos/ssd-3.webp", "img/productos/ssd-4.webp", "img/productos/ssd-5.webp"],
      link: "https://www.samsung.com/es/memory-storage/nvme-ssd/990-pro-1tb-nvme-pcie-gen-4-mz-v9p1t0bw/#specs",
      destacado: "Hasta 7450 MB/s",
      specs: [
        ["Capacidad", "1 TB"],
        ["Lectura", "hasta 7450 MB/s"],
        ["Escritura", "hasta 6900 MB/s"],
        ["Interfaz", "PCIe 4.0 x4 · NVMe 2.0"],
        ["Formato", "M.2 2280"],
      ],
    },
    {
      id: "gabinete",
      categoria: "Gabinete",
      nombre: "Cooler Master MasterBox TD500 Mesh V2",
      corto: "TD500 Mesh V2",
      precioReferencia: 486700,
      imagen: "img/productos/gabinete.webp",
      galeria: ["img/productos/gabinete-2.webp", "img/productos/gabinete-3.webp", "img/productos/gabinete-4.webp", "img/productos/gabinete-5.webp"],
      link: "https://www.coolermaster.com/es-global/products/masterbox-td500-mesh-v2.html",
      destacado: "3 ventiladores ARGB",
      specs: [
        ["Formato", "Media torre ATX (E-ATX hasta 12\" × 10.7\")"],
        ["Ventiladores", "3 × SickleFlow 120 ARGB (hasta 7)"],
        ["Frente", "Malla poligonal de alto flujo de aire"],
        ["Lateral", "Vidrio templado"],
        ["GPU", "Hasta 410 mm de largo"],
        ["Radiadores", "Hasta 360 mm al frente y arriba"],
        ["Puertos", "USB 3.2 Gen 2 Type-C en el panel frontal"],
      ],
    },
  ],

  perifericos: [
    {
      id: "monitor",
      categoria: "Monitores",
      nombre: "LG UltraGear 24GQ50F-B",
      cantidad: 2,
      corto: "2× 24\" 165 Hz",
      precioReferencia: 690800,
      imagen: "img/productos/monitor.webp",
      galeria: ["img/productos/monitor-2.webp", "img/productos/monitor-3.webp", "img/productos/monitor-4.webp"],
      link: "https://www.lg.com/es/monitores/monitores-ultragear-gaming/24gq50f-b/",
      destacado: "Doble pantalla · 165 Hz",
      specs: [
        ["Unidades", "2 monitores"],
        ["Pantalla", "24\" Full HD (1920 × 1080) VA"],
        ["Frecuencia", "165 Hz"],
        ["Respuesta", "1 ms (MBR)"],
        ["Sincronización", "AMD FreeSync™ Premium"],
      ],
    },
    {
      id: "soporte",
      categoria: "Soporte de monitor",
      nombre: "HUANUO Soporte doble para monitor",
      corto: "Brazo doble",
      precioReferencia: 410400,
      imagen: "img/productos/soporte.webp",
      galeria: ["img/productos/soporte-2.webp", "img/productos/soporte-3.webp", "img/productos/soporte-4.webp", "img/productos/soporte-5.webp"],
      link: "https://www.amazon.com/dp/B07T5SY43L",
      destacado: "Movimiento completo",
      specs: [
        ["Tipo", "Brazo doble articulado con resorte"],
        ["Pantallas", "De 13\" a 32\""],
        ["Montaje", "VESA 75×75 / 100×100"],
        ["Fijación", "Abrazadera en C o pasacables"],
      ],
    },
    {
      id: "teclado",
      categoria: "Teclado",
      nombre: "Redragon Horus K619",
      corto: "Mecánico low profile",
      precioReferencia: 351700,
      imagen: "img/productos/teclado.webp",
      galeria: ["img/productos/teclado-2.webp", "img/productos/teclado-3.webp", "img/productos/teclado-4.webp", "img/productos/teclado-5.webp"],
      link: "https://redragon.es/products/best-seller/teclado-low-profile-horus-tkl-fullsize-60/",
      destacado: "Switches rojos low profile",
      specs: [
        ["Formato", "Completo (100 %) · 104 teclas"],
        ["Switches", "Red lineales de perfil bajo (40 g)"],
        ["Construcción", "Ultradelgado con placa de aluminio"],
        ["Conexión", "Cableado USB-C"],
        ["Iluminación", "RGB · controles multimedia dedicados"],
      ],
    },
    {
      id: "mic",
      categoria: "Micrófono",
      nombre: "HyperX QuadCast S",
      corto: "QuadCast S",
      precioReferencia: 691800,
      imagen: "img/productos/mic.webp",
      galeria: ["img/productos/mic-2.webp", "img/productos/mic-3.webp", "img/productos/mic-4.webp", "img/productos/mic-5.webp"],
      link: "https://row.hyperx.com/es/products/hyperx-quadcast-s-usb-microphone",
      destacado: "RGB + tap-to-mute",
      specs: [
        ["Conexión", "USB"],
        ["Patrones", "4 (estéreo, omni, cardioide, bidireccional)"],
        ["Extras", "Toque para silenciar · antivibración · filtro pop"],
        ["Iluminación", "RGB personalizable"],
      ],
    },
    {
      id: "cam",
      categoria: "Cámara",
      nombre: "Logitech StreamCam",
      corto: "1080p 60 fps",
      precioReferencia: 745786,
      imagen: "img/productos/cam.webp",
      galeria: ["img/productos/cam-2.webp", "img/productos/cam-3.webp", "img/productos/cam-4.webp", "img/productos/cam-5.webp"],
      link: "https://www.logitech.com/es-ar/shop/p/streamcam.960-001280",
      destacado: "Full HD a 60 fps",
      specs: [
        ["Video", "1080p a 60 fps"],
        ["Conexión", "USB-C"],
        ["Extras", "Encuadre y exposición automáticos"],
        ["Modo vertical", "9:16 para redes sociales"],
      ],
    },
  ],

  // FPS aproximados con esta configuración en 1080p (referencia orientativa,
  // varían según versión del juego, drivers y ajustes).
  rendimiento: [
    { juego: "Valorant", ajustes: "Alto", fps: 350 },
    { juego: "League of Legends", ajustes: "Muy alto", fps: 300 },
    { juego: "Counter-Strike 2", ajustes: "Alto", fps: 220 },
    { juego: "Fortnite", ajustes: "Alto · DLSS", fps: 160 },
    { juego: "Apex Legends", ajustes: "Alto", fps: 150 },
    { juego: "GTA V", ajustes: "Muy alto", fps: 140 },
    { juego: "Cyberpunk 2077", ajustes: "Alto · DLSS 3 FG", fps: 110 },
    { juego: "Call of Duty: Warzone", ajustes: "Alto · DLSS", fps: 110 },
    { juego: "Red Dead Redemption 2", ajustes: "Alto", fps: 75 },
  ],

  usos: [
    { titulo: "Gaming 1080p alto refresco", texto: "Aprovecha los 165 Hz en shooters competitivos, con una segunda pantalla para Discord o stream." },
    { titulo: "Streaming", texto: "Codificador NVENC, QuadCast S y StreamCam: todo listo para transmitir." },
    { titulo: "Edición de video y foto", texto: "32 GB DDR5 y SSD de 7450 MB/s para proyectos pesados." },
    { titulo: "Programación y multitarea", texto: "10 núcleos / 16 hilos para compilar, virtualizar y más." },
  ],
};
