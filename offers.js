const OFFERS_DATA_URL = 'offers-data.json';

async function init() {
  const container = document.getElementById("offers-feed");
  if (!container) return;

  let offers = [];
  try {
    const response = await fetch(OFFERS_DATA_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    offers = Array.isArray(data?.offers) ? data.offers : [];
  } catch (error) {
    console.error("No se pudieron cargar las ofertas:", error);
    renderError(container);
    return;
  }

  // Ordenar: más reciente primero
  offers.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

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
