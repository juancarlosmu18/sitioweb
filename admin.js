// admin.js - Versión FINAL con botón Exportar JSON (verificada)

import { getAllProducts, addOrUpdateProduct, deleteProduct } from './db.js';
import { getAllCategories, getCategoryNames, addCategory } from './categories-db.js';
import { getAllOffers, saveOffer, deleteOffer } from './offers-db.js';
import { mergeProducts } from './catalog-utils.js';

let products = [];
let categories = [];
let offers = [];
let publishedCategories = [];

// ==================== MOSTRAR / OCULTAR PANEL ====================
window.showAdminPanel = async function() {
  const panel = document.getElementById("admin-panel");
  if (!panel) return;
  panel.style.display = "flex";

  await loadAdminFromStorage();
  await refreshCategories();
  await loadAdminOffers();
  loadAdminProducts();
};

window.hideAdminPanel = function() {
  const panel = document.getElementById("admin-panel");
  if (panel) panel.style.display = "none";
};

// ==================== CATEGORÍAS ====================
async function refreshCategories() {
  categories = await getAllCategories().catch(() => []);
  renderCategoryOptions();
}

function renderCategoryOptions() {
  const select = document.getElementById('admin-category');
  if (!select) return;
  select.innerHTML = '';

  const allCats = getCategoryNames(products, [...publishedCategories, ...categories]);

  allCats.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

// ==================== PRODUCTOS ====================
async function loadAdminFromStorage() {
  const [catalog, localProducts] = await Promise.all([
    loadPublishedCatalog(),
    getAllProducts().catch(() => [])
  ]);
  publishedCategories = catalog?.categories || [];
  products = mergeProducts(catalog?.products || [], localProducts);
}

async function loadPublishedCatalog() {
  try {
    const response = await fetch(`products-data.json?v=${Date.now()}`);
    return response.ok ? await response.json() : null;
  } catch (error) {
    return null;
  }
}

function loadAdminProducts() {
  const select = document.getElementById("admin-product-select");
  if (!select) return;

  select.innerHTML = "";
  products.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${p.category || 'Sin categoría'} - ${p.name}`;
    select.appendChild(opt);
  });

  const optNew = document.createElement("option");
  optNew.value = "new";
  optNew.textContent = "➕ Nuevo producto";
  select.appendChild(optNew);

  select.onchange = () => fillAdminFields(select.value);
  fillAdminFields("0");
}

function fillAdminFields(idx) {
  const deleteBtn = document.getElementById("admin-delete");
  if (deleteBtn) deleteBtn.style.display = (idx === "new") ? "none" : "block";

  const p = (idx === "new") ? null : products[idx];

  document.getElementById("admin-name").value = p ? (p.name || "") : "";
  document.getElementById("admin-desc").value = p ? (p.description || p.shortDescription || "") : "";
  document.getElementById("admin-price").value = p ? (p.pricing?.amount ?? p.priceFrom ?? p.price ?? "") : "";
  document.getElementById("admin-image").value = p ? (p.image || "") : "";

  const catSelect = document.getElementById("admin-category");
  if (catSelect && p?.category) catSelect.value = p.category;

  updateAdminImagePreview(p ? p.image : "");
}

async function saveAdminProduct() {
  const idx = document.getElementById("admin-product-select").value;
  const category = document.getElementById("admin-category").value.trim();
  const name = document.getElementById("admin-name").value.trim();
  const desc = document.getElementById("admin-desc").value.trim();
  const price = Number(document.getElementById("admin-price").value) || null;

  let image = document.getElementById("admin-image").value.trim();
  const fileInput = document.getElementById("admin-image-file");
  if (fileInput.files && fileInput.files[0]) {
    alert("La carga de archivos no está disponible: el sitio no tiene un servidor para almacenar imágenes. Usa una ruta publicada.");
    return;
  }

  if (!name || !category) {
    alert("❌ Nombre y categoría son obligatorios");
    return;
  }

  const existingProduct = idx === "new" ? {} : products[idx];
  const isCustomCategory = category.startsWith('Encargos especiales');
  const productType = isCustomCategory
    ? 'custom'
    : (existingProduct.productType || 'standard');
  const productData = {
    ...existingProduct,
    id: idx === "new" ? `prod-${Date.now()}` : products[idx].id,
    category,
    name,
    productName: existingProduct.productName || name,
    size: existingProduct.size || null,
    productType,
    shortDescription: desc.slice(0, 80),
    description: desc,
    price: price,
    priceFrom: price,
    pricing: {
      ...(existingProduct.pricing || {}),
      type: productType === 'custom'
        ? 'custom'
        : (existingProduct.pricing?.type || 'fixed'),
      amount: price,
      currency: 'COP'
    },
    image: image || "placeholder.jpg"
  };

  try {
    await addOrUpdateProduct(productData);
    alert(idx === "new" ? "✅ Nuevo producto creado correctamente" : "✅ Producto actualizado correctamente");
    hideAdminPanel();
    setTimeout(() => location.reload(), 800);
  } catch (e) {
    console.error(e);
    alert("Error al guardar: " + e.message);
  }
}

async function deleteAdminProduct() {
  const idx = document.getElementById("admin-product-select").value;
  if (idx === "new") return;
  const p = products[idx];
  if (!confirm(`¿Eliminar "${p.name}"?`)) return;

  try {
    await deleteProduct(p.id);
    alert("Producto eliminado");
    hideAdminPanel();
    setTimeout(() => location.reload(), 800);
  } catch (e) {
    alert("Error al eliminar");
  }
}

// ==================== BOTÓN EXPORTAR JSON ====================
async function exportProductsToJSON() {
  try {
    const allProducts = await getAllProducts();
    
    const data = {
      lastUpdated: new Date().toISOString(),
      categories: getExportCategories(),
      products
    };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'products-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ Archivo products-data.json descargado correctamente.\n\nAhora súbelo a la raíz de tu repositorio en GitHub.`);
  } catch (e) {
    alert("Error al exportar: " + e.message);
  }

  function getExportCategories() {
    const categoryNames = getCategoryNames(products, [...publishedCategories, ...categories]);
    return categoryNames.map(name =>
      publishedCategories.find(category => category.name === name)
      || categories.find(category => category.name === name)
      || { name }
    );
  }
}

// ==================== OFERTAS ====================
// El campo image es una RUTA/URL de imagen, nunca una subida de archivo ni
// contenido ejecutable. Acepta rutas relativas (jpg, jpeg, png, webp, gif)
// o URLs absolutas https con esa misma extensión.
function isValidOfferImage(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return true; // vacío es válido: la web pública usa placeholder.jpg

  // Bloquear esquemas peligrosos y marcado HTML embebido.
  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return false;
  if (/[<>"']/.test(trimmed)) return false;
  if (trimmed.startsWith("//")) return false;

  const hasAllowedExtension = /\.(jpe?g|png|webp|gif)(\?[^\s]*)?(#[^\s]*)?$/i.test(trimmed);

  if (/^https:\/\//i.test(trimmed)) {
    return hasAllowedExtension;
  }

  // Cualquier otro esquema absoluto (http:, ftp:, etc.) no está permitido.
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return false;

  // Ruta relativa: debe terminar en una extensión de imagen permitida.
  return hasAllowedExtension;
}

// Normaliza una oferta almacenada localmente al modelo público:
// { id, title, description, image, publishedAt }
// Migra registros antiguos (date -> publishedAt, note -> description como respaldo)
// sin eliminar los datos originales de IndexedDB.
// No inventa publishedAt: si no existe fecha conocida, se exporta como null.
function normalizeOffer(o) {
  const rawImage = String(o.image || "").trim();
  return {
    id: o.id,
    title: o.title || "",
    description: o.description || o.note || "",
    image: isValidOfferImage(rawImage) ? rawImage : "",
    publishedAt: o.publishedAt || o.date || null
  };
}

async function loadAdminOffers() {
  const rawOffers = await getAllOffers().catch(() => []);
  offers = rawOffers.map(normalizeOffer);
  const select = document.getElementById("admin-offer-select");
  if (!select) return;

  select.innerHTML = "";
  offers.forEach((o, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = o.title;
    select.appendChild(opt);
  });

  const optNew = document.createElement("option");
  optNew.value = "new";
  optNew.textContent = "➕ Nueva oferta";
  select.appendChild(optNew);

  select.onchange = () => fillOfferFields(select.value);
  fillOfferFields("new");
}

function fillOfferFields(idx) {
  const deleteBtn = document.getElementById("admin-offer-delete");
  if (deleteBtn) deleteBtn.style.display = (idx === "new") ? "none" : "block";

  const imageInput = document.getElementById("admin-offer-image");

  if (idx === "new") {
    document.getElementById("admin-offer-title").value = "";
    document.getElementById("admin-offer-desc").value = "";
    if (imageInput) imageInput.value = "";
    return;
  }

  const o = offers[idx];
  if (o) {
    document.getElementById("admin-offer-title").value = o.title || "";
    document.getElementById("admin-offer-desc").value = o.description || "";
    if (imageInput) imageInput.value = o.image || "";
  }
}

async function handleSaveOffer() {
  const idx = document.getElementById("admin-offer-select").value;
  const title = document.getElementById("admin-offer-title").value.trim();
  const description = document.getElementById("admin-offer-desc").value.trim();
  const imageInput = document.getElementById("admin-offer-image");
  const image = imageInput ? imageInput.value.trim() : "";

  if (!title) return alert("El título es obligatorio");

  if (image && !isValidOfferImage(image)) {
    alert("❌ La imagen debe ser una ruta relativa (jpg, jpeg, png, webp o gif) o una URL https con esa extensión.");
    return;
  }

  const offerData = {
    id: idx === "new" ? `off-${Date.now()}` : offers[idx].id,
    title,
    description,
    image,
    publishedAt: new Date().toISOString()
  };

  await saveOffer(offerData);
  alert("✅ Oferta guardada");
  hideAdminPanel();
  setTimeout(() => location.reload(), 700);
}

// ==================== BOTÓN EXPORTAR OFERTAS JSON ====================
async function exportOffersToJSON() {
  try {
    const rawOffers = await getAllOffers();
    const normalizedOffers = rawOffers.map(normalizeOffer);

    const data = { offers: normalizedOffers };

    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'offers-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    alert(`✅ Archivo offers-data.json descargado correctamente.\n\nAhora súbelo a la raíz de tu repositorio en GitHub.`);
  } catch (e) {
    alert("Error al exportar ofertas: " + e.message);
  }
}

async function handleDeleteOffer() {
  const idx = document.getElementById("admin-offer-select").value;
  if (idx === "new") return;
  if (!confirm("¿Eliminar esta oferta?")) return;

  await deleteOffer(offers[idx].id);
  alert("Oferta eliminada");
  hideAdminPanel();
  setTimeout(() => location.reload(), 700);
}

function updateAdminImagePreview(src) {
  const img = document.getElementById("admin-image-preview");
  if (!img) return;
  img.style.display = (src && src.length > 20) ? "block" : "none";
  if (src && src.length > 20) img.src = src;
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    // Botones de Productos
    const saveBtn = document.getElementById("admin-save");
    const deleteBtn = document.getElementById("admin-delete");
    const closeBtn = document.getElementById("admin-close");
    const addCatBtn = document.getElementById("admin-add-category");

    if (saveBtn) saveBtn.addEventListener("click", saveAdminProduct);
    if (deleteBtn) deleteBtn.addEventListener("click", deleteAdminProduct);
    if (closeBtn) closeBtn.addEventListener("click", hideAdminPanel);

    if (addCatBtn) {
      addCatBtn.addEventListener("click", async () => {
        const input = document.getElementById('admin-new-category');
        const val = input.value.trim();
        if (val) {
          await addCategory(val);
          await refreshCategories();
          input.value = '';
        }
      });
    }

    // Botones de Ofertas
    const offerSaveBtn = document.getElementById("admin-offer-save");
    const offerDeleteBtn = document.getElementById("admin-offer-delete");
    if (offerSaveBtn) offerSaveBtn.addEventListener("click", handleSaveOffer);
    if (offerDeleteBtn) offerDeleteBtn.addEventListener("click", handleDeleteOffer);

    // Campo de imagen de la oferta (agregado dinámicamente, ruta/URL relativa,
    // nunca base64) justo antes de los botones Guardar/Eliminar oferta.
    if (!document.getElementById("admin-offer-image") && offerSaveBtn) {
      const offerImageInput = document.createElement("input");
      offerImageInput.id = "admin-offer-image";
      offerImageInput.placeholder = "Ruta de imagen (ej: placeholder.jpg)";
      offerImageInput.style.cssText = "width:100%; margin-bottom:10px; padding:10px;";
      const offerButtonsRow = offerSaveBtn.parentElement;
      if (offerButtonsRow) {
        offerButtonsRow.parentElement.insertBefore(offerImageInput, offerButtonsRow);
      }
    }

    // ==================== BOTÓN EXPORTAR JSON ====================
    const exportBtn = document.createElement("button");
    exportBtn.textContent = "📤 Exportar productos a JSON";
    exportBtn.style.cssText = `
      width:100%; 
      padding:14px; 
      margin-top:20px; 
      background:#2b1d16; 
      color:white; 
      border:none; 
      border-radius:8px; 
      font-weight:bold; 
      cursor:pointer;
      font-size:16px;
    `;
    exportBtn.onclick = exportProductsToJSON;

    const exportOffersBtn = document.createElement("button");
    exportOffersBtn.textContent = "📤 Exportar ofertas a JSON";
    exportOffersBtn.style.cssText = `
      width:100%; 
      padding:14px; 
      margin-top:10px; 
      background:#4CAF50; 
      color:white; 
      border:none; 
      border-radius:8px; 
      font-weight:bold; 
      cursor:pointer;
      font-size:16px;
    `;
    exportOffersBtn.onclick = exportOffersToJSON;

    const panelContent = document.querySelector("#admin-panel > div");
    if (panelContent) {
      panelContent.appendChild(exportBtn);
      panelContent.appendChild(exportOffersBtn);
    }

    console.log("✅ Admin.js inicializado correctamente con botón Exportar");
  }, 500);
});