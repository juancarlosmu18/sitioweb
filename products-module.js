// products-module.js - Versión ULTRA SEGURA con estilos inline

import { getAllProducts, addOrUpdateProduct } from './db.js';

async function init() {
  console.log("🚀 Iniciando renderizado dinámico...");

  let products = await getAllProducts();

  if (products.length === 0) {
    console.log("🌱 Sembrando iniciales...");
    const initial = [
      { id: "torta-vainilla", category: "Tortas", name: "Torta de Vainilla", shortDescription: "Clásica y suave.", priceFrom: 25000, image: "tortas-1.jpg" },
      { id: "torta-chocolate", category: "Tortas", name: "Torta de Chocolate", shortDescription: "Intensa y húmeda.", priceFrom: 25000, image: "tortas-2.jpg" },
      { id: "pionono", category: "Tortas frías", name: "1/2 lb pionono", shortDescription: "Suave, cremosa y perfecta para servir fría.", priceFrom: 45000, image: "pionono.jpg" },
      { id: "galletas-manteca", category: "Galletas", name: "Galletas de Manteca", shortDescription: "Clásicas y crocantes.", price: 6500, image: "galletas-1.jpg" },
      { id: "postre-choco", category: "Postres", name: "Postre de Chocolate", shortDescription: "Delicioso y cremoso.", price: 12000, image: "postres-1.jpg" },
      { id: "encargo-especial", category: "Encargos especiales", name: "Torta Personalizada", shortDescription: "Según tu idea.", priceFrom: 35000, image: "encargos-1.jpg" }
    ];
    for (const p of initial) await addOrUpdateProduct(p);
    products = await getAllProducts();
  }

  console.log(`Total productos: ${products.length}`);
  renderDynamic(products);
}

function renderDynamic(products) {
  const container = document.getElementById("dynamic-categories");
  if (!container) {
    console.error("❌ No se encontró #dynamic-categories");
    return;
  }

  container.innerHTML = '';

  // Obtener categorías únicas
  let categories = [...new Set(products.map(p => p.category).filter(Boolean))];

  // Orden personalizado
  const priorityOrder = ["Tortas", "Tortas frías", "Galletas", "Postres", "Encargos especiales"];

  categories.sort((a, b) => {
    const indexA = priorityOrder.indexOf(a);
    const indexB = priorityOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });

  console.log("Categorías ordenadas:", categories);

  categories.forEach(cat => {
    // Filtrado más flexible (ignora mayúsculas/minúsculas y espacios extra)
    const filtered = products.filter(p => {
      if (!p.category) return false;
      return p.category.toString().trim().toLowerCase() === cat.toString().trim().toLowerCase();
    });

    console.log(`Categoría "${cat}": ${filtered.length} productos encontrados`);

    const section = document.createElement('section');
    section.className = 'section';
    section.innerHTML = `
      <div class="container" data-animate>
        <h2 class="section-title">${cat}</h2>
        <div class="product-grid" data-category="${cat}"></div>
      </div>
    `;

    container.appendChild(section);

    const grid = section.querySelector('.product-grid');

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="muted">Sin productos en esta categoría.</p>`;
      return;
    }

    filtered.forEach(prod => {
      const price = prod.priceFrom || prod.price || 0;
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <a href="product.html?id=${encodeURIComponent(prod.id)}" class="product-link">
          <div class="product-image-wrap">
            <img class="product-image" src="${prod.image || 'placeholder.jpg'}" alt="${prod.name}" loading="lazy" />
          </div>
          <div class="product-info">
            <h3>${prod.name}</h3>
            <p class="product-desc">${prod.shortDescription || prod.description || ''}</p>
            <div class="product-meta">
              ${price ? `<span class='product-price'>$${price.toLocaleString('es-CO')}</span>` : ''}
              <span class="btn btn-primary btn-sm">Ver detalle</span>
            </div>
          </div>
        </a>
      `;
      grid.appendChild(card);
    });
  });

  console.log(`✅ Se renderizaron ${categories.length} categorías`);
}

// Iniciar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
