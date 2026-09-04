const OFFERS_DATA_URL = 'offers-data.json';

// El campo image es una RUTA/URL de imagen, nunca contenido ejecutable.
// Acepta rutas relativas (jpg, jpeg, png, webp, gif) o URLs absolutas https
// con esa misma extensión. Debe coincidir con la validación de admin.js.
function isValidOfferImage(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return true; // vacío es válido: se usa placeholder.jpg

  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return false;
  if (/[<>"']/.test(trimmed)) return false;
  if (trimmed.startsWith("//")) return false;

  const hasAllowedExtension = /\.(jpe?g|png|webp|gif)(\?[^\s]*)?(#[^\s]*)?$/i.test(trimmed);

  if (/^https:\/\//i.test(trimmed)) {
    return hasAllowedExtension;
  }

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return false;

  return hasAllowedExtension;
}

// Valida que una oferta del JSON público tenga el mínimo requerido antes de
// mostrarla: id, title y description presentes; publishedAt ausente/null o
// una fecha válida; image ausente/vacía o una ruta/URL válida.
function isValidPublicOffer(o) {
  if (!o || typeof o !== 'object') return false;
  if (!o.id || !o.title || !o.description) return false;

  if (o.publishedAt !== null && o.publishedAt !== undefined && o.publishedAt !== "") {
    const parsed = new Date(o.publishedAt);
    if (isNaN(parsed.getTime())) return false;
  }

  if (o.image && !isValidOfferImage(o.image)) return false;

  return true;
}

async function init() {
  const container = document.getElementById("offers-feed");
  if (!container) return;

  let offers = [];
  try {
    // cache: 'no-store' evita que la caché HTTP nativa del navegador
    // devuelva una copia antigua sin pasar por la red, complementando el
    // Network First del Service Worker.
    const response = await fetch(OFFERS_DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (!data || !Array.isArray(data.offers)) {
      throw new Error("offers-data.json inválido: se esperaba { offers: [] }");
    }

    offers = dedupeById(data.offers.filter(isValidPublicOffer));
  } catch (error) {
    console.error("No se pudieron cargar las ofertas:", error);
    renderError(container);
    return;
  }

  // Ordenar: más reciente primero; si dos ofertas comparten publishedAt,
  // se usa el id como criterio secundario determinista.
  offers.sort((a, b) => {
    const dateDiff = new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
    if (dateDiff !== 0) return dateDiff;
    return String(a.id).localeCompare(String(b.id));
  });

  renderOffers(container, offers);
}

// Detecta y descarta ofertas con id duplicado, conservando la primera
// aparición. Registra un aviso controlado sin romper la página ni
// inventar un id nuevo.
function dedupeById(offers) {
  const seen = new Set();
  const result = [];
  for (const o of offers) {
    if (seen.has(o.id)) {
      console.warn(`offers-data.json: id duplicado ignorado "${o.id}"`);
      continue;
    }
    seen.add(o.id);
    result.push(o);
  }
  return result;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

function renderOffers(container, offers) {
  container.innerHTML = '';

  if (!offers.length) {
    renderEmpty(container);
    return;
  }

  offers.forEach(o => {
    const image = escapeHtml(o.image || 'placeholder.jpg');
    const title = escapeHtml(o.title || '');
    const description = escapeHtml(o.description || '');
    const publishedAt = o.publishedAt ? escapeHtml(new Date(o.publishedAt).toLocaleDateString('es-CO')) : '';

    const html = `
      <div class="offer-card">
        <img src="${image}" class="offer-img" alt="${title}" data-fallback-applied="false" onerror="if(this.dataset.fallbackApplied==='true'){this.onerror=null;return;} this.dataset.fallbackApplied='true'; this.src='placeholder.jpg';"/>

        <div class="offer-body">
          <h3>${title}</h3>
          <p>${description}</p>
          <span class="offer-date">
            ${publishedAt}
          </span>
        </div>
      </div>
    `;

    container.innerHTML += html;
  });
}

function renderEmpty(container) {
  container.innerHTML = '<p class="muted">Por ahora no hay ofertas publicadas.</p>';
}

function renderError(container) {
  container.innerHTML = '<p class="muted">No fue posible cargar las ofertas en este momento.</p>';
}

document.addEventListener("DOMContentLoaded", init);
