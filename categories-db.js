// categories-db.js
const CAT_DB_NAME = 'cv_catalogo_categorias';
const CAT_STORE = 'categorias';
const CAT_DB_VERSION = 1;

export function openCatDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(CAT_DB_NAME, CAT_DB_VERSION);
    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(CAT_STORE)) {
        db.createObjectStore(CAT_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };
    req.onsuccess = e => resolve(e.target.result);
    req.onerror = e => reject(e.target.error);
  });
}

export async function getAllCategories() {
  const db = await openCatDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CAT_STORE, 'readonly');
    const store = tx.objectStore(CAT_STORE);
    const req = store.getAll();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function addCategory(name) {
  const db = await openCatDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CAT_STORE, 'readwrite');
    const store = tx.objectStore(CAT_STORE);
    const req = store.add({ name });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function deleteCategory(id) {
  const db = await openCatDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CAT_STORE, 'readwrite');
    const store = tx.objectStore(CAT_STORE);
    const req = store.delete(id);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function updateCategory(id, name) {
  const db = await openCatDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(CAT_STORE, 'readwrite');
    const store = tx.objectStore(CAT_STORE);
    const req = store.put({ id, name });
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
