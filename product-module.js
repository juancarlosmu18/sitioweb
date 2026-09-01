// product-module.js
import { getAllProducts } from './db.js';

// Carga el catálogo desde el JSON (misma fuente que products-module.js).
// IndexedDB solo se usa como respaldo offline, nunca como fuente autoritativa.
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

async function initProductDetail() {
  const host = document.querySelector('[data-product-detail]');
  if (!host) return;

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');

  let products = await loadProductsFromJSON();
  if (!products || products.length === 0) {
    products = await getAllProducts();
  }
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

  document.title = `${product.name} • Cocoa & Vainilla`;
  const basePrice = product.priceFrom || product.price || 0;
  
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
      <p class="muted"><strong>Precio:</strong> $${basePrice.toLocaleString('es-CO')}</p>
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
