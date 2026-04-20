// products-module.js - VERSIÓN ULTRA SIMPLE Y ROBUSTA (2026)

import { getAllProducts, addOrUpdateProduct } from './db.js';

async function init() {
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

    for (const p of initialProducts) await addOrUpdateProduct(p);
    products = await getAllProducts();
  }

  console.log(`Total productos: ${products.length}`);
  renderAll(products);
}

function renderAll(products) {
  const container = document.getElementById("dynamic-categories");
  if (!container) {
    console.error("❌ No se encontró #dynamic-categories");
    return;
  }

  container.innerHTML = '';

  // Agrupar por categoría
  const grouped = {};
  products.forEach(p => {
    const cat = p.category || "Sin categoría";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  // Orden deseado
  const order = ["Tortas", "Tortas frías", "Galletas", "Postres", "Encargos especiales"];

  const sortedCategories = Object.keys(grouped).sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    if (ia === -1) return 1;
    if (ib === -1) return -1;
    return ia - ib;
  });

  sortedCategories.forEach(cat => {
    const prods = grouped[cat];

    let cards = '';
    prods.forEach(prod => {
      const price = prod.priceFrom || prod.price || 0;
      cards += `
        <div style="background:#fff; border:1px solid #eee; border-radius:12px; overflow:hidden; margin-bottom:20px; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <a href="product.html?id=${prod.id}" style="text-decoration:none; color:inherit;">
            <img src="${prod.image || 'placeholder.jpg'}" style="width:100%; height:220px; object-fit:cover;" alt="${prod.name}" loading="lazy">
            <div style="padding:16px;">
              <h3 style="margin:0 0 8px 0; font-size:19px;">${prod.name}</h3>
              <p style="margin:0 0 12px 0; color:#666; font-size:14px;">${prod.shortDescription || ''}</p>
              <div style="font-weight:700; color:#2b1d16;">$${price.toLocaleString('es-CO')}</div>
            </div>
          </a>
        </div>
      `;
    });

    const sectionHTML = `
      <section style="padding:40px 0; border-bottom:1px solid #eee;">
        <div style="max-width:1120px; margin:0 auto; padding:0 20px;">
          <h2 style="font-family:'Playfair Display',serif; font-size:32px; margin-bottom:24px; color:#2b1d16;">${cat}</h2>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;">
            ${cards}
          </div>
        </div>
      </section>
    `;

    container.innerHTML += sectionHTML;
  });

  console.log(`✅ Renderizadas ${sortedCategories.length} categorías correctamente`);
}

// Al final del archivo, reemplaza la parte de iniciar por:
document.addEventListener('DOMContentLoaded', init);