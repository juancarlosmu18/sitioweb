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
    const response = await fetch(OFFERS_DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (!data || !Array.isArray(data.offers)) {
      throw new Error("offers-data.json inválido: se esperaba { offers: [] }");
    }

    offers = data.offers.filter(isValidPublicOffer);
  } catch (error) {
    console.error("No se pudieron cargar las ofertas:", error);
    renderError(container);
    return;
  }

  // Ordenar: más reciente primero
  offers.sort((a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0));

  renderOffers(container, offers);
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
        <img src="${image}" class="offer-img" alt="${title}"/>

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
