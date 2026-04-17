// products-module.js - VERSIÓN ESTABLE Y SIMPLE

import { getAllProducts, addOrUpdateProduct } from './db.js';

async function init() {.
  console.log("🚀 Iniciando renderizado de productos...");

  let products = await getAllProducts();

  if (products.length === 0) {
    console.log("🌱 Sembrando productos iniciales...");
    const initialProducts = [
      { id: "torta-vainilla", category: "Tortas", name: "Torta de Vainilla", shortDescription: "Clásica y suave.", description: "Torta artesanal de vainilla...", priceFrom: 25000, image: "tortas-1.jpg" },
      { id: "torta-chocolate", category: "Tortas", name: "Torta de Chocolate", shortDescription: "Intensa y húmeda.", description: "...", priceFrom: 25000, image: "tortas-2.jpg" },
      { id: "pionono", category: "Tortas frías", name: "1/2 lb pionono", shortDescription: "Suave, cremosa y perfecta para servir fría.", description: "Suave, cremosa y perfecta para servir fría.", priceFrom: 45000, image: "pionono.jpg" },
      { id: "galletas-manteca", category: "Galletas", name: "Galletas de Manteca", shortDescription: "Clásicas y crocantes.", description: "...", price: 6500, image: "galletas-1.jpg" },
      { id: "postre-choco", category: "Postres", name: "Postre de Chocolate", shortDescription: "Delicioso y cremoso.", description: "...", price: 12000, image: "postres-1.jpg" },
      { id: "encargo-especial", category: "Encargos especiales", name: "Torta Personalizada", shortDescription: "Según tu idea.", description: "...", priceFrom: 35000, image: "encargos-1.jpg" }
    ];

    for (const p of initialProducts) {
      await addOrUpdateProduct(p);
    }
    products = await getAllProducts();
  }

  console.log(`Total productos cargados: ${products.length}`);

  // Renderizado simple y directo
  renderProductsSimple(products);
}

function renderProductsSimple(products) {
  const container = document.getElementById("dynamic-categories");
  if (!container) {
    console.error("No se encontró el contenedor #dynamic-categories");
    return;
  }

  container.innerHTML = '';

  // Agrupar por categoría
  const grouped = {};
  products.forEach(p => {
    if (!p.category) return;
    if (!grouped[p.category]) grouped[p.category] = [];
    grouped[p.category].push(p);
  });

  // 1. Definir tu orden personalizado
  const ordenDeseado = [
    'Tortas', 
    'Tortas frías', 
    'Postres', 
    'Encargos especiales', 
    'Galletas'
  ];

  // 2. Extraer las categorías que existen y ordenarlas
  const categoriasOrdenadas = Object.keys(grouped).sort((a, b) => {
    let posicionA = ordenDeseado.indexOf(a);
    let posicionB = ordenDeseado.indexOf(b);
    
    // Si creas una categoría nueva que no está en la lista, se va al final (posición 999)
    if (posicionA === -1) posicionA = 999;
    if (posicionB === -1) posicionB = 999;
    
    return posicionA - posicionB;
  });

  // 3. Renderizar en pantalla siguiendo el nuevo orden
  categoriasOrdenadas.forEach(category => {
    const prods = grouped[category];

    const html = `
      <section class="section">
        <div class="container">
          <h2 class="section-title">${category}</h2>
          <div class="product-grid">
            ${prods.map(prod => {
              const price = prod.priceFrom || prod.price || 0;
              return `
                <div class="product-card">
                  <a href="product.html?id=${prod.id}">
                    <img src="${prod.image || 'placeholder.jpg'}" alt="${prod.name}" loading="lazy" style="width:100%; height:200px; object-fit:cover;">
                    <div style="padding:12px;">
                      <h3>${prod.name}</h3>
                      <p style="color:#666; font-size:14px;">${prod.shortDescription || ''}</p>
                      <p style="font-weight:bold; margin:8px 0 0 0;">$${price.toLocaleString('es-CO')}</p>
                    </div>
                  </a>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </section>
    `;

    container.innerHTML += html;
  });

  console.log("Renderizado completado");
}

// Iniciar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}