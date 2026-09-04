// product-module.js
import { formatPrice, getPricing } from './catalog-utils.js';

// Carga el catálogo desde el JSON (misma fuente que products-module.js).
async function loadProductsFromJSON() {
  try {
    const response = await fetch(`products-data.json?v=${Date.now()}`);
    if (!response.ok) return null;
    const data = await response.json();
    return data.products || [];
  } catch (e) {
    return null;
  }
}

const SITE_URL = 'https://reposteriacocoayvainilla.co';

function setMetaByName(name, content) {
  const el = document.querySelector(`meta[name="${name}"]`);
  if (el) el.setAttribute('content', content);
}

function setMetaByProperty(property, content) {
  const el = document.querySelector(`meta[property="${property}"]`);
  if (el) el.setAttribute('content', content);
}

function setCanonical(href) {
  const el = document.querySelector('link[rel="canonical"]');
  if (el) el.setAttribute('href', href);
}

function absoluteImageUrl(image) {
  const src = image || 'placeholder.jpg';
  return /^https?:\/\//i.test(src) ? src : `${SITE_URL}/${src}`;
}

function updateSeoMetadata(product) {
  const title = `${product.name} | Cocoa & Vainilla`;
  const description = (product.shortDescription || product.description || '').trim();
  const canonicalUrl = `${SITE_URL}/product.html?id=${encodeURIComponent(product.id)}`;
  const imageUrl = absoluteImageUrl(product.image);

  document.title = title;
  setMetaByName('description', description);
  setCanonical(canonicalUrl);

  setMetaByProperty('og:title', title);
  setMetaByProperty('og:description', description);
  setMetaByProperty('og:url', canonicalUrl);
  setMetaByProperty('og:image', imageUrl);
  setMetaByProperty('og:type', 'product');
}

function injectProductStructuredData(product, pricing) {
  const existing = document.getElementById('product-structured-data');
  if (existing) existing.remove();

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = 'product-structured-data';

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: (product.shortDescription || product.description || '').trim(),
    image: absoluteImageUrl(product.image),
    category: product.category,
    url: `${SITE_URL}/product.html?id=${encodeURIComponent(product.id)}`,
  };

  const amount = Number(pricing.amount);
  if (Number.isFinite(amount) && amount > 0) {
    data.offers = {
      '@type': 'Offer',
      priceCurrency: pricing.currency || 'COP',
      price: amount,
      availability: 'https://schema.org/InStock',
      url: data.url,
    };
  }

  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

async function initProductDetail() {
  const host = document.querySelector('[data-product-detail]');
  if (!host) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  const products = await loadProductsFromJSON() || [];
  const product = products.find((p) => p.id === id);

  if (!product) {
    host.innerHTML = `
      <div class="card">
        <h1 class="card-title">Producto no encontrado</h1>
        <p class="muted">Volvé a la lista para elegir otro producto.</p>
        <a class="btn btn-primary" href="products.html">Ver productos</a>
      </div>`;
    return;
  }

  const pricing = getPricing(product);
  updateSeoMetadata(product);
  injectProductStructuredData(product, pricing);

  // Construir mensaje de WhatsApp
  const phone = "573222391967"; 
  const msg = `Hola, estoy interesado en: ${product.name}. ¿Me pasás disponibilidad?`;
  const waLink = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;

  host.innerHTML = `
    <div class="product-detail-media">
      <img src="${product.image || 'placeholder.jpg'}" alt="${product.name}" />
    </div>
    <div class="product-detail-copy">
      <h1>${product.name}</h1>
      <p class="muted"><strong>Categoría:</strong> ${product.category}</p>
      <p class="muted"><strong>Precio:</strong> ${formatPrice(pricing)}</p>
      ${pricing.note ? `<p class="muted">${pricing.note}</p>` : ''}
      <p>${product.description}</p>
      <a class="btn btn-primary" href="${waLink}" target="_blank">Pedir por WhatsApp</a>
    </div>
  `;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initProductDetail);
} else {
  initProductDetail();
}
