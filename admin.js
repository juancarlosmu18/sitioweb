// admin.js - Versión FINAL corregida (respeta "Tortas frías")

import { getAllProducts, addOrUpdateProduct, deleteProduct } from './db.js';
import { getAllCategories, addCategory } from './categories-db.js';

let products = [];
let categories = [];

// ==================== GLOBALES ====================
window.showAdminPanel = async function() {
  const panel = document.getElementById("admin-panel");
  if (!panel) return;
  panel.style.display = "flex";

  await loadAdminFromStorage();
  await refreshCategories();
  loadAdminProducts();
};

window.hideAdminPanel = function() {
  const panel = document.getElementById("admin-panel");
  if (panel) panel.style.display = "none";
};

// ==================== CATEGORÍAS ====================
async function refreshCategories() {
  categories = await getAllCategories();
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
  fillAdminFields(select.value || "0");
}

function fillAdminFields(idx) {
  const deleteBtn = document.getElementById("admin-delete");
  const catSel = document.getElementById("admin-category");

  if (idx === "new") {
    if (deleteBtn) deleteBtn.style.display = "none";
    document.getElementById("admin-name").value = "";
    document.getElementById("admin-desc").value = "";
    document.getElementById("admin-price").value = "";
    document.getElementById("admin-image").value = "";
    document.getElementById("admin-image-file").value = "";
    updateAdminImagePreview("");
    return;
  }

  if (deleteBtn) deleteBtn.style.display = "block";
  const p = products[idx];
  if (!p) return;

  // Importante: Respetamos exactamente la categoría guardada
  if (catSel && p.category) catSel.value = p.category;

  document.getElementById("admin-name").value = p.name || "";
  document.getElementById("admin-desc").value = p.description || "";
  document.getElementById("admin-price").value = p.priceFrom || p.price || "";
  document.getElementById("admin-image").value = p.image || "";
  updateAdminImagePreview(p.image || "");
}

// ==================== GUARDAR ====================
async function saveAdminProduct() {
  const idx = document.getElementById("admin-product-select").value;
  const category = document.getElementById("admin-category").value.trim();   // ← Categoría exacta seleccionada
  const name = document.getElementById("admin-name").value.trim();
  const desc = document.getElementById("admin-desc").value.trim();
  const price = Number(document.getElementById("admin-price").value) || null;

  let image = document.getElementById("admin-image").value;
  const fileInput = document.getElementById("admin-image-file");
  if (fileInput.files && fileInput.files[0]) {
    image = await toBase64(fileInput.files[0]);
  }

  if (!name || !category) {
    alert("Nombre y categoría son obligatorios");
    return;
  }

  if (idx === "new") {
    const newProduct = {
      id: `custom-${Date.now()}`,
      category,
      name,
      shortDescription: desc.slice(0, 60),
      description: desc || "",
      price: price,
      priceFrom: price,
      image: image || "placeholder.jpg"
    };
    await addOrUpdateProduct(newProduct);
    alert("✅ Producto creado!");
  } else {
    const p = products[idx];
    p.category = category;           // ← Guardamos exactamente lo seleccionado
    p.name = name;
    p.description = desc || "";
    p.shortDescription = desc.slice(0, 60);
    if (price !== null) p.price = p.priceFrom = price;
    if (image) p.image = image;

    await addOrUpdateProduct(p);
    alert("✅ Producto actualizado!");
  }

  hideAdminPanel();
  setTimeout(() => location.reload(), 700);
}

// ==================== ELIMINAR ====================
async function deleteAdminProduct() {
  const idx = document.getElementById("admin-product-select").value;
  if (idx === "new") return;

  const p = products[idx];
  if (!confirm(`¿Eliminar "${p.name}"?`)) return;

  await deleteProduct(p.id);
  alert("Producto eliminado");
  hideAdminPanel();
  setTimeout(() => location.reload(), 700);
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function updateAdminImagePreview(src) {
  const img = document.getElementById("admin-image-preview");
  if (!img) return;
  img.style.display = (src && src.length > 20) ? "block" : "none";
  if (src && src.length > 20) img.src = src;
}

// ==================== INICIALIZACIÓN ====================
document.addEventListener("DOMContentLoaded", () => {
  // Esperar un momento para que el HTML del panel esté cargado
  setTimeout(() => {
    const closeBtn = document.getElementById("admin-close");
    const saveBtn = document.getElementById("admin-save");
    const deleteBtn = document.getElementById("admin-delete");
    const addCatBtn = document.getElementById("admin-add-category");

    if (closeBtn) closeBtn.onclick = hideAdminPanel;
    if (saveBtn) saveBtn.onclick = saveAdminProduct;
    if (deleteBtn) deleteBtn.onclick = deleteAdminProduct;

    if (addCatBtn) {
      addCatBtn.onclick = async () => {
        const input = document.getElementById('admin-new-category');
        const val = input.value.trim();
        if (val) {
          await addCategory(val);
          await refreshCategories();
          input.value = '';
        }
      };
    }

    // Vista previa de imagen
    const urlInput = document.getElementById("admin-image");
    if (urlInput) urlInput.addEventListener("input", () => updateAdminImagePreview(urlInput.value));

    const fileInput = document.getElementById("admin-image-file");
    if (fileInput) fileInput.addEventListener("change", async () => {
      if (fileInput.files[0]) {
        const base64 = await toBase64(fileInput.files[0]);
        updateAdminImagePreview(base64);
      }
    });
  }, 300); // pequeño delay para asegurar que el HTML esté cargado
});
