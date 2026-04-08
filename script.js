// Contador de visitas global usando countapi.xyz
function initVisitCounter() {
  const el = document.querySelector('[data-visit-count]');
  if (!el) return;
  // Cambia la key por algo único de tu sitio
  const namespace = 'cocoayvainilla';
  const key = 'visitas';
  fetch(`https://api.countapi.xyz/hit/${namespace}/${key}`)
    .then(r => r.json())
    .then(data => {
      el.textContent = data.value;
    })
    .catch(() => {
      el.textContent = 'N/A';
    });
}
// Inicializa los enlaces de WhatsApp en la página de contacto y otros lugares
function initWhatsAppLinks() {
  const links = document.querySelectorAll('[data-whatsapp-link]');
  links.forEach(link => {
    let msg = link.getAttribute('data-whatsapp-message') || 'Hola, estoy interesado en sus productos de repostería.';
    link.href = buildWhatsAppLink(msg);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
  });
}

// Construye el enlace de WhatsApp con el número y mensaje
function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
// Renderiza una tarjeta de producto para el catálogo
function renderProductCard(product) {
  return `
    <div class="product-card">
      <a href="product.html?id=${encodeURIComponent(product.id)}" class="product-card-link">
        <img src="${product.image}" alt="${escapeHtml(product.name)}" class="product-card-img" />
        <div class="product-card-body">
          <h3 class="product-card-title">${escapeHtml(product.name)}</h3>
          <p class="product-card-desc">${escapeHtml(product.shortDescription)}</p>
          <p class="product-card-price">${product.priceFrom ? formatPriceARS(product.priceFrom) : (product.price ? formatPriceARS(product.price) : "")}</p>
        </div>
      </a>
    </div>
  `;
}

// Formatea el precio en pesos colombianos
function formatPriceARS(price) {
  return "$ " + price.toLocaleString("es-CO");
}
/*
  Cocoa & Vainilla — JS básico
  - Menú móvil
  - Render de productos por categoría
  - Página de producto individual por querystring (?id=...)
  - Links de WhatsApp con mensaje predefinido
  - Animación simple de aparición (fade-in)

  Personalización rápida:
  - Reemplazá WHATSAPP_NUMBER por tu número con código de país.
    Ej: Argentina: 54911XXXXXXXX
*/

const WHATSAPP_NUMBER = "573222391967"; // Número real en formato wa.me: código país + número, sin + ni espacios.

let products = [
  {
    id: "torta-rosa",
    category: "Tortas",
    name: "Torta de Vainilla",
    shortDescription: "Clásica, suave y perfecta para compartir.",
    description:
      "Torta artesanal de vainilla con miga suave y sabor casero. Ideal para cumpleaños y celebraciones.",
    ingredients: ["Harina", "Vainilla", "Mantequilla", "Huevos", "Leche"],
    price: null,
    priceFrom: 25000,
    priceOptions: [
      { label: "1/4 lb", price: 25000 },
      { label: "1/2 lb", price: 45000 },
      { label: "1 lb", price: 65000 },
    ],
    image: "tortas-1.jpg",
  },
  {
    id: "torta-limon",
    category: "Tortas",
    name: "Torta de Chocolate",
    shortDescription: "Intensa, húmeda y con cacao real.",
    description:
      "Torta artesanal de chocolate con sabor profundo a cacao. Un clásico que siempre queda bien.",
    ingredients: ["Harina", "Cacao", "Chocolate", "Mantequilla", "Huevos", "Leche"],
    price: null,
    priceFrom: 25000,
    priceOptions: [
      { label: "1/4 lb", price: 25000 },
      { label: "1/2 lb", price: 45000 },
      { label: "1 lb", price: 65000 },
    ],
    image: "tortas-2.jpg",
  },
      {
        id: "torta-yogurt",
        category: "Tortas",
        name: "Torta Yogurt",
        shortDescription: "Suave, fresca y muy esponjosa.",
        description:
          "Torta artesanal de yogurt: ligera, húmeda y con un sabor delicado. Ideal para quienes prefieren opciones más frescas.",
        ingredients: ["Harina", "Yogurt", "Mantequilla", "Huevos", "Leche"],
        price: null,
        priceFrom: 25000,
        priceOptions: [
          { label: "1/4 lb", price: 25000 },
          { label: "1/2 lb", price: 45000 },
          { label: "1 lb", price: 65000 },
        ],
        image: "tortas-3.jpg",
      },
      {
        id: "torta-leche-fresas",
        category: "Tortas",
        name: "Torta de Leche (dulce y fresas)",
        shortDescription: "Relleno de dulce de leche y fresas.",
        description:
          "Torta artesanal de leche con relleno de dulce de leche y fresas. Equilibrada, cremosa y perfecta para celebraciones.",
        ingredients: ["Harina", "Leche", "Mantequilla", "Huevos", "Dulce de leche", "Fresas"],
        price: null,
        priceFrom: 25000,
        priceOptions: [
          { label: "1/4 lb", price: 25000 },
          { label: "1/2 lb", price: 45000 },
          { label: "1 lb", price: 65000 },
        ],
        image: "tortas-4.jpg",
      },
      {
        id: "torta-fria",
        category: "Tortas",
        name: "Torta fría",
        shortDescription: "Suave, cremosa y perfecta para servir fría.",
        description:
          "Torta fría artesanal, ideal para celebraciones y reuniones. Textura suave y un sabor delicioso para compartir.",
        ingredients: ["Leche", "Crema", "Biscocho", "Arequipe"],
        price: null,
        priceFrom: 25000,
        priceOptions: [
          { label: "1/4 lb", price: 25000 },
          { label: "1/2 lb", price: 45000 },
          { label: "1 lb", price: 65000 },
        ],
        image: "tortas-frias-1.jpg",
      },
      {
        id: "galletas-manteca",
        category: "Galletas",
        name: "Galletas de Manteca",
        shortDescription: "Clásicas, crocantes y delicadas.",
        description:
          "Galletas de manteca con textura crocante y sabor casero. Perfectas para el café o para regalar.",
        ingredients: ["Manteca", "Harina", "Azúcar", "Vainilla"],
        price: 6500,
        image: "galletas-1.jpg",
      },

      {
        id: "galletas-choco",
        category: "Galletas",
        name: "Galletas con Chips",
        shortDescription: "Chocolate real, en cada mordida.",
        description:
          "Galletas con chips de chocolate, doradas por fuera y tiernas por dentro. Un favorito absoluto.",
        ingredients: ["Harina", "Manteca", "Azúcar", "Chips de chocolate"],
        price: 7000,
        image: "galletas-2.jpg"
      }
];


function initProductGrids() {
  const grids = document.querySelectorAll("[data-product-grid]");
  if (!grids.length) return;

  grids.forEach((grid) => {
    const category = grid.getAttribute("data-category");
    const list = products.filter((p) => p.category === category);

    grid.innerHTML = list.map(renderProductCard).join("");
  });
}

function initProductDetail() {
  const host = document.querySelector("[data-product-detail]");
  if (!host) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  const product = products.find((p) => p.id === id);
  if (!product) {
    host.innerHTML = `
      <div class="card">
        <h1 class="card-title">Producto no encontrado</h1>
        <p class="muted">Volvé a la lista para elegir otro producto.</p>
        <a class="btn btn-primary" href="products.html">Ver productos</a>
      </div>
    `;
    return;
  }

  document.title = `${product.name} • Cocoa & Vainilla`;

  const message = `Hola, estoy interesado en sus productos de repostería. Producto: ${product.name}. ¿Me pasás disponibilidad y formas de entrega?`;

  const basePrice = getProductBasePrice(product);
  const hasOptions = Array.isArray(product.priceOptions) && product.priceOptions.length;

  const priceLine = hasOptions
    ? `<p class="muted"><strong>Precio:</strong> Desde ${escapeHtml(formatPriceARS(basePrice))}</p>`
    : `<p class="muted"><strong>Precio:</strong> ${escapeHtml(formatPriceARS(basePrice))}</p>`;

  const priceOptionsBlock = hasOptions
    ? `
      <div class="ingredients" style="margin-top: 14px;">
        <h3>Tamaños y precios</h3>
        <ul>
          ${product.priceOptions
            .map((opt) => `<li><strong>${escapeHtml(opt.label)}:</strong> ${escapeHtml(formatPriceARS(opt.price))}</li>`)
            .join("")}
        </ul>
      </div>
    `
    : "";

  host.innerHTML = `
    <div class="product-detail-media">
      <img src="${product.image}" alt="${escapeHtml(product.name)}" />
    </div>

    <div class="product-detail-copy">
      <h1>${escapeHtml(product.name)}</h1>
      <p class="muted"><strong>Categoría:</strong> ${escapeHtml(product.category)}</p>
      ${priceLine}
      <p>${escapeHtml(product.description)}</p>

      <div class="ingredients">
        <h3>Ingredientes principales</h3>
        <ul>
          ${product.ingredients.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}
        </ul>
      </div>

      ${priceOptionsBlock}

      <a class="btn btn-primary" href="${buildWhatsAppLink(message)}">Pedir por WhatsApp</a>
    </div>
  `;
}

function initFadeIn() {
  const items = document.querySelectorAll("[data-animate]");
  if (!items.length) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => io.observe(el));
}

function escapeHtml(input) {
  return String(input)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


// Menú móvil: abre/cierra el menú en móviles
function initMobileNav() {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');
  if (!header || !nav || !toggle) return;

  function closeMenu() {
    header.classList.remove('nav-open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  function openMenu() {
    header.classList.add('nav-open');
    toggle.setAttribute('aria-expanded', 'true');
  }

  toggle.addEventListener('click', () => {
    if (header.classList.contains('nav-open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Cierra el menú al hacer clic en un enlace de navegación
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Cierra el menú al hacer scroll o cambiar de tamaño
  window.addEventListener('scroll', closeMenu);
  window.addEventListener('resize', closeMenu);
}


function main() {
  //initYear();
  initMobileNav();
  initWhatsAppLinks();
  initVisitCounter();
  initProductGrids();
  initProductDetail();
  initFadeIn();
}

document.addEventListener("DOMContentLoaded", () => {
  main();
  // --- Panel de administración local ---
    loadAdminFromStorage();
  const closeBtn = document.getElementById("admin-close");
  if (closeBtn) closeBtn.onclick = hideAdminPanel;
  const saveBtn = document.getElementById("admin-save");
  if (saveBtn) saveBtn.onclick = saveAdminProduct;
});

// Atajo global SIEMPRE activo
window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.altKey && (e.key === "a" || e.key === "A")) {
    e.preventDefault();
    showAdminPanel();
  }
});


