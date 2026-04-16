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

  // === ORDEN PERSONALIZADO ===
  const priorityOrder = [
    "Tortas",
    "Tortas frías",
    "Galletas",
    "Postres",
    "Encargos especiales"
  ];

  // Ordenar: primero las prioritarias, luego el resto alfabéticamente
  categories.sort((a, b) => {
    const indexA = priorityOrder.indexOf(a);
    const indexB = priorityOrder.indexOf(b);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;     // ambas prioritarias
    if (indexA !== -1) return -1;                                   // a es prioritaria → primero
    if (indexB !== -1) return 1;                                    // b es prioritaria → primero
    return a.localeCompare(b);                                      // resto en orden alfabético
  });

  console.log("Categorías ordenadas:", categories);

  // Renderizar cada categoría
  categories.forEach(cat => {
    const filtered = products.filter(p => p.category === cat);

    const sectionHTML = `
      <section class="section" style="padding: 26px 0;">
        <div class="container" style="max-width: 1120px; margin: 0 auto; padding: 0 16px;">
          <h2 style="font-family: 'Playfair Display', serif; font-size: 28px; margin: 0 0 20px 0;">${cat}</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
    `;

    let cardsHTML = '';

    filtered.forEach(prod => {
      const price = prod.priceFrom || prod.price || 0;
      cardsHTML += `
        <div style="background: #f4e7cf; border: 1px solid rgba(43,29,22,0.1); border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(43,29,22,0.1);">
          <a href="product.html?id=${prod.id}" style="text-decoration: none; color: inherit;">
            <img src="${prod.image || 'placeholder.jpg'}" style="width:100%; height:220px; object-fit: cover;" alt="${prod.name}" loading="lazy">
            <div style="padding: 16px;">
              <h3 style="margin: 0 0 8px 0; font-size: 20px;">${prod.name}</h3>
              <p style="margin: 0 0 12px 0; color: #6a5144; font-size: 15px;">${prod.shortDescription || ''}</p>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="font-weight: 700; color: #2b1d16;">$${price.toLocaleString('es-CO')}</span>
                <span style="background: #c7a56b; color: white; padding: 6px 12px; border-radius: 999px; font-size: 14px;">Ver detalle</span>
              </div>
            </div>
          </a>
        </div>
      `;
    });

    const closingHTML = `</div></div></section>`;
    
    container.innerHTML += sectionHTML + cardsHTML + closingHTML;
  });

  console.log(`✅ Se renderizaron ${categories.length} categorías en orden correcto`);
}

// Iniciar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
