/*
 * ============================================================
 *  DATOS DE LA VENTA — este es el único archivo que necesitas editar
 * ============================================================
 *  - Precios en pesos colombianos, sin puntos: 2500000
 *  - Imágenes: pon el archivo en img/productos/ con el nombre indicado
 *    en "imagen". Si no existe, se muestra un ícono en su lugar.
 *  - Para marcar algo como vendido: vendido: true
 */
window.VENTA = {
  config: {
    // Número con indicativo de país, sin "+" ni espacios. Ej: 573001234567
    whatsapp: "57XXXXXXXXXX",
    mensajeWhatsapp: "¡Hola! Vi tu PC gamer en la página y me interesa. ¿Sigue disponible?",

    // Precio al que vendes TODO el combo. null = aún no definido ("Consultar precio")
    precioVenta: null,

    // ¿Aceptas vender piezas por separado?
    ventaPorPartes: false,

    ubicacion: "Colombia",       // Ej: "Bogotá, Colombia"
    entrega: null,               // Ej: "Entrega en persona en Bogotá · Envíos a todo el país"
    estado: "2 años de uso",
    garantia: "Sin garantía vigente",
    moneda: "COP",
  },

  // Fotos reales del equipo: pon los archivos en img/reales/ y agrégalos aquí.
  // Ej: { src: "img/reales/frontal.jpg", texto: "Vista frontal con RGB encendido" }
  fotosReales: [],

  componentes: [
    {
      id: "gpu",
      categoria: "Tarjeta gráfica",
      nombre: "MSI GeForce RTX™ 4060 GAMING X NV EDITION 8G",
      corto: "RTX 4060 8G",
      precioReferencia: 2500000,
      imagen: "img/productos/gpu.webp",
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
      precioReferencia: 950000,
      imagen: "img/productos/cpu.webp",
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
      precioReferencia: 2500000,
      imagen: "img/productos/mobo.webp",
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
      precioReferencia: 2200000,
      imagen: "img/productos/ram.webp",
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
      precioReferencia: 700000,
      imagen: "img/productos/cooler.webp",
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
      precioReferencia: 750000,
      imagen: "img/productos/psu.webp",
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
      precioReferencia: 1200000,
      imagen: "img/productos/ssd.webp",
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
  ],

  perifericos: [
    {
      id: "monitor",
      categoria: "Monitor",
      nombre: "LG UltraGear 24GQ50F-B",
      corto: "24\" 165 Hz",
      precioReferencia: null,
      imagen: "img/productos/monitor.webp",
      link: "https://www.lg.com/es/monitores/monitores-ultragear-gaming/24gq50f-b/",
      destacado: "165 Hz · 1 ms",
      specs: [
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
      precioReferencia: null,
      imagen: "img/productos/soporte.webp",
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
      nombre: "Redragon Horus Low Profile",
      corto: "Mecánico low profile",
      precioReferencia: null,
      imagen: "img/productos/teclado.webp",
      link: "https://redragon.es/products/best-seller/teclado-low-profile-horus-tkl-fullsize-60/",
      destacado: "Switches rojos low profile",
      specs: [
        ["Tipo", "Mecánico ultradelgado"],
        ["Switches", "Red lineales de perfil bajo"],
        ["Iluminación", "RGB"],
        ["Extras", "Controles multimedia dedicados"],
      ],
    },
    {
      id: "mic",
      categoria: "Micrófono",
      nombre: "HyperX QuadCast S",
      corto: "QuadCast S",
      precioReferencia: null,
      imagen: "img/productos/mic.webp",
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
      precioReferencia: null,
      imagen: "img/productos/cam.webp",
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
    { titulo: "Gaming 1080p alto refresco", texto: "Aprovecha los 165 Hz del monitor en shooters competitivos." },
    { titulo: "Streaming", texto: "Codificador NVENC, QuadCast S y StreamCam: todo listo para transmitir." },
    { titulo: "Edición de video y foto", texto: "32 GB DDR5 y SSD de 7450 MB/s para proyectos pesados." },
    { titulo: "Programación y multitarea", texto: "10 núcleos / 16 hilos para compilar, virtualizar y más." },
  ],
};
