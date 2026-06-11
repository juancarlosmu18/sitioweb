// Registro del Service Worker para PWA (solo en HTTPS)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registrado', reg.scope))
      .catch(err => console.error('Error registrando SW', err));
  });
}
// ==================== CONTADOR DE VISITAS ====================
// Comentado temporalmente porque la API da error (nombre incorrecto)
function initVisitCounter() {
  const el = document.querySelector('[data-visit-count]');
  if (!el) return;
  
  // Mostramos un valor por defecto mientras arreglamos
  el.textContent = "—";
  console.log("Contador de visitas desactivado temporalmente");
}

// Si quieres dejarla pero corregida, usa esta versión:
async function initVisitCounter() {
  const el = document.querySelector('[data-visit-count]');
  if (!el) return;
  
  try {
    const resp = await fetch('https://api.countapi.xyz/hit/cocoayvainilla/visitas', {
      method: 'GET',
      signal: AbortSignal.timeout(4000)
    });
    
    if (resp.ok) {
      const data = await resp.json();
      el.textContent = data.value || "0";
    } else {
      el.textContent = "—";
    }
  } catch (err) {
    el.textContent = "—";
    console.log("Contador de visitas no disponible");
  }
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
 // initVisitCounter();
 // initProductGrids();
 // initProductDetail();
  initFadeIn();
}

document.addEventListener("DOMContentLoaded", () => {
  main();
  // Panel de administración local SOLO debe inicializarse desde admin.js
});

// ====================== ATAJO GLOBAL ADMIN ======================
// Funciona en TODAS las páginas: index, products, about, contact, etc.

window.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.altKey && (e.key === "a" || e.key === "A")) {
    e.preventDefault();

    // Intenta abrir el panel de forma segura
    if (typeof window.showAdminPanel === "function") {
      window.showAdminPanel();
    } 
    else {
      // Fallback: si admin.js no cargó la función, abrimos el panel manualmente
      const panel = document.getElementById("admin-panel");
      if (panel) {
        panel.style.display = "flex";
        console.log("Panel abierto manualmente (fallback)");
        
        // Intentamos cargar admin.js dinámicamente si es necesario
        if (!document.querySelector('script[src="admin.js"]')) {
          const script = document.createElement("script");
          script.src = "admin.js";
          script.type = "module";   // importante porque admin.js usa import
          document.body.appendChild(script);
        }
      } else {
        alert("No se encontró el panel de administración en esta página.");
      }
    }
  }
});

