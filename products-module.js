// products-module.js - Versión con soporte JSON + IndexedDB (Opción A)

import { getAllProducts, addOrUpdateProduct } from './db.js';

async function init() {
  console.log("🚀 Iniciando renderizado de productos...");

  // 1. Intentar cargar desde JSON (archivo estático en GitHub)
  let products = await loadProductsFromJSON();

  // 2. Si el JSON falla o está vacío, usar IndexedDB
  if (!products || products.length === 0) {
    products = await getAllProducts();
  }

  // 3. Si aún no hay nada, sembrar iniciales
  if (products.length === 0) {
    console.log("🌱 Sembrando productos iniciales...");
    const initialProducts = [ /* tus productos iniciales aquí */ ];
    for (const p of initialProducts) await addOrUpdateProduct(p);
    products = await getAllProducts();
  }

  console.log(`Total productos cargados: ${products.length}`);
  renderAll(products);
}

// Cargar desde products-data.json (prioridad alta)
async function loadProductsFromJSON() {
  try {
    const response = await fetch('products-data.json?v=' + Date.now());
    if (!response.ok) throw new Error('JSON no encontrado');
    const data = await response.json();
    console.log("✅ Productos cargados desde JSON");
    return data.products || [];
  } catch (e) {
    console.log("JSON no disponible, usando IndexedDB");
    return [];
  }
}

function renderAll(products) {
  const container = document.getElementById("dynamic-categories");
  if (!container) return;

  container.innerHTML = '';

  const grouped = {};
  products.forEach(p => {
    const cat = p.category || "Sin categoría";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(p);
  });

  const order = ["Tortas", "Tortas frías", "Galletas", "Postres", "Encargos especiales"];

  const sortedCats = Object.keys(grouped).sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  sortedCats.forEach(cat => {
    const prods = grouped[cat];
    let cardsHTML = prods.map(prod => {
      const price = prod.priceFrom || prod.price || 0;
      return `
        <div style="background:#fff; border:1px solid #eee; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.05);">
          <a href="product.html?id=${prod.id}">
            <img src="${prod.image || 'placeholder.jpg'}" style="width:100%; height:220px; object-fit:cover;" alt="${prod.name}" loading="lazy">
            <div style="padding:16px;">
              <h3 style="margin:0 0 8px;">${prod.name}</h3>
              <p style="color:#666; font-size:14px; margin:0 0 12px;">${prod.shortDescription || ''}</p>
              <div style="font-weight:700;">$${price.toLocaleString('es-CO')}</div>
            </div>
          </a>
        </div>
      `;
    }).join('');

    container.innerHTML += `
      <section style="padding:40px 0;">
        <div style="max-width:1120px; margin:0 auto; padding:0 20px;">
          <h2 style="font-size:32px; margin-bottom:24px;">${cat}</h2>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:24px;">
            ${cardsHTML}
          </div>
        </div>
      </section>
    `;
  });
}

// Iniciar
document.addEventListener('DOMContentLoaded', init);