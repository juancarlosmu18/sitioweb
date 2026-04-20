// admin.js - VERSIÓN CORREGIDA Y ROBUSTA (Botón Guardar debe funcionar)

import { getAllProducts, addOrUpdateProduct, deleteProduct } from './db.js';
import { getAllCategories, addCategory } from './categories-db.js';
import { getAllOffers, saveOffer, deleteOffer } from './offers-db.js';

let products = [];
let categories = [];
let offers = [];

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

  const defaultCats = ['Tortas', 'Tortas frías', 'Galletas', 'Postres', 'Encargos especiales'];
  const allCats = [...new Set([...defaultCats, ...categories.map(c => c.name)])];

  allCats.forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });
}

// ==================== PRODUCTOS ====================
async function loadAdminFromStorage() {
  products = await getAllProducts().catch(() => []);
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
  document.getElementById("admin-price").value = p ? (p.priceFrom || p.price || "") : "";
  document.getElementById("admin-image").value = p ? (p.image || "") : "";

  const catSelect = document.getElementById("admin-category");
  if (catSelect && p && p.category) catSelect.value = p.category;

  updateAdminImagePreview(p ? p.image : "");
}

async function saveAdminProduct() {
  console.log("🔵 Botón Guardar presionado - intentando guardar..."); // Para depurar

  const idx = document.getElementById("admin-product-select").value;
  const category = document.getElementById("admin-category").value.trim();
  const name = document.getElementById("admin-name").value.trim();
  const desc = document.getElementById("admin-desc").value.trim();
  const price = Number(document.getElementById("admin-price").value) || null;

  let image = document.getElementById("admin-image").value.trim();
  const fileInput = document.getElementById("admin-image-file");
  if (fileInput.files && fileInput.files[0]) {
    image = await toBase64(fileInput.files[0]);
  }

  if (!name || !category) {
    alert("❌ Nombre y categoría son obligatorios");
    return;
  }

  const productData = {
    id: idx === "new" ? `prod-${Date.now()}` : products[idx].id,
    category,
    name,
    shortDescription: desc.slice(0, 80),
    description: desc,
    price: price,
    priceFrom: price,
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

// ==================== ELIMINAR PRODUCTO ====================
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

// ==================== OFERTAS (se mantiene todo) ====================
async function loadAdminOffers() {
  offers = await getAllOffers().catch(() => []);
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

  if (idx === "new") {
    document.getElementById("admin-offer-title").value = "";
    document.getElementById("admin-offer-desc").value = "";
    return;
  }

  const o = offers[idx];
  if (o) {
    document.getElementById("admin-offer-title").value = o.title || "";
    document.getElementById("admin-offer-desc").value = o.description || "";
  }
}

async function handleSaveOffer() {
  const idx = document.getElementById("admin-offer-select").value;
  const title = document.getElementById("admin-offer-title").value.trim();
  const description = document.getElementById("admin-offer-desc").value.trim();

  if (!title) return alert("El título es obligatorio");

  const offerData = {
    id: idx === "new" ? `off-${Date.now()}` : offers[idx].id,
    title,
    description,
    date: new Date().toISOString()
  };

  await saveOffer(offerData);
  alert("✅ Oferta guardada");
  hideAdminPanel();
  setTimeout(() => location.reload(), 700);
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

// ==================== UTILIDADES ====================
function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function updateAdminImagePreview(src) {
  const img = document.getElementById("admin-image-preview");
  if (!img) return;
  img.style.display = (src && src.length > 20) ? "block" : "none";
  if (src && src.length > 20) img.src = src;
}

// ==================== INICIALIZACIÓN DE BOTONES ====================
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

    // Vista previa imagen
    const urlInput = document.getElementById("admin-image");
    if (urlInput) urlInput.addEventListener("input", () => updateAdminImagePreview(urlInput.value));

    const fileInput = document.getElementById("admin-image-file");
    if (fileInput) fileInput.addEventListener("change", async () => {
      if (fileInput.files[0]) {
        const base64 = await toBase64(fileInput.files[0]);
        updateAdminImagePreview(base64);
      }
    });

    console.log("✅ Admin.js inicializado correctamente");
  }, 500);
});