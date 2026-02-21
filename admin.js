// --- Panel de administración local (limpio y robusto) ---
function loadAdminFromStorage() {
  try {
    const data = localStorage.getItem("cv_admin_products");
    if (data) {
      const arr = JSON.parse(data);
      if (Array.isArray(arr) && arr.length) {
        products = arr;
      }
    }
  } catch {}
}

function showAdminPanel() {
  const panel = document.getElementById("admin-panel");
  if (!panel) return;
  panel.style.display = "flex";
  loadAdminProducts();
}
function hideAdminPanel() {
  const panel = document.getElementById("admin-panel");
  if (!panel) return;
  panel.style.display = "none";
}
function loadAdminProducts() {
  const select = document.getElementById("admin-product-select");
  select.innerHTML = "";
  products.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = p.name;
    select.appendChild(opt);
  });
  // Opción para nuevo producto
  const optNew = document.createElement("option");
  optNew.value = "new";
  optNew.textContent = "➕ Nuevo producto";
  select.appendChild(optNew);
  select.onchange = () => fillAdminFields(select.value);
  fillAdminFields(select.value);
}
function fillAdminFields(idx) {
  const catSel = document.getElementById("admin-category");
  if (idx === "new") {
    catSel.value = "Tortas";
    document.getElementById("admin-name").value = "";
    document.getElementById("admin-desc").value = "";
    document.getElementById("admin-price").value = "";
    document.getElementById("admin-image").value = "";
    document.getElementById("admin-image-file").value = "";
    updateAdminImagePreview("");
    return;
  }
  const p = products[idx];
  catSel.value = p.category || "Tortas";
  document.getElementById("admin-name").value = p.name;
  document.getElementById("admin-desc").value = p.description;
  document.getElementById("admin-price").value = p.priceFrom || p.price || "";
  document.getElementById("admin-image").value = p.image;
  document.getElementById("admin-image-file").value = "";
  updateAdminImagePreview(p.image);
}
async function saveAdminProduct() {
  const idx = document.getElementById("admin-product-select").value;
  const category = document.getElementById("admin-category").value;
  const name = document.getElementById("admin-name").value;
  const desc = document.getElementById("admin-desc").value;
  const price = Number(document.getElementById("admin-price").value);
  let image = document.getElementById("admin-image").value;
  const fileInput = document.getElementById("admin-image-file");
  if (fileInput && fileInput.files && fileInput.files[0]) {
    image = await toBase64(fileInput.files[0]);
  }
  if (idx === "new") {
    // Crear nuevo producto
    const newProduct = {
      id: `custom-${Date.now()}`,
      category,
      name,
      shortDescription: desc.slice(0, 40),
      description: desc,
      ingredients: [],
      price: price > 0 ? price : null,
      image
    };
    products.push(newProduct);
    localStorage.setItem("cv_admin_products", JSON.stringify(products));
    alert("¡Producto creado! Recarga la página para verlo.");
    loadAdminProducts();
    return;
  }
  // Editar existente
  const p = products[idx];
  p.category = category;
  p.name = name;
  p.description = desc;
  if (!isNaN(price) && price > 0) {
    if (p.priceFrom !== undefined) p.priceFrom = price;
    if (p.price !== undefined) p.price = price;
  }
  p.image = image;
  localStorage.setItem("cv_admin_products", JSON.stringify(products));
  alert("¡Producto actualizado! Recarga la página para ver los cambios.");
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
  if (src && src.length > 5) {
    img.src = src;
    img.style.display = "block";
  } else {
    img.src = "";
    img.style.display = "none";
  }
}
// Inicialización única y atajo global
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof main === "function") main();
    loadAdminFromStorage();
    const closeBtn = document.getElementById("admin-close");
    if (closeBtn) closeBtn.onclick = hideAdminPanel;
    const saveBtn = document.getElementById("admin-save");
    if (saveBtn) saveBtn.onclick = saveAdminProduct;
    // Vista previa de imagen por URL
    const urlInput = document.getElementById("admin-image");
    if (urlInput) urlInput.addEventListener("input", (e) => {
      updateAdminImagePreview(urlInput.value);
    });
    // Vista previa de imagen por archivo
    const fileInput = document.getElementById("admin-image-file");
    if (fileInput) fileInput.addEventListener("change", async (e) => {
      if (fileInput.files && fileInput.files[0]) {
        const base64 = await toBase64(fileInput.files[0]);
        updateAdminImagePreview(base64);
      }
    });
  });
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.altKey && (e.key === "a" || e.key === "A")) {
      e.preventDefault();
      showAdminPanel();
    }
  });
}
