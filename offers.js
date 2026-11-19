const OFFERS_DATA_URL = 'offers-data.json';

// Las promociones se definen por día completo en hora de Colombia y se
// comparan contra «hoy» calculado en America/Bogota, para que el estado no
// dependa de la zona horaria del dispositivo del visitante.
const ZONA_HORARIA = 'America/Bogota';
const FECHA_ISO = /^\d{4}-\d{2}-\d{2}$/;
const SIN_FECHA_FIN = '9999-12-31';

// Devuelve la fecha YYYY-MM-DD o '' si el valor no es una fecha real.
// No alcanza con validar la forma: 2026-13-45 o 2026-02-30 también la cumplen.
function normalizaFecha(value) {
  const texto = String(value ?? '').trim();
  if (!FECHA_ISO.test(texto)) return '';
  const [anio, mes, dia] = texto.split('-').map(Number);
  const fecha = new Date(Date.UTC(anio, mes - 1, dia));
  const esReal = fecha.getUTCFullYear() === anio
    && fecha.getUTCMonth() === mes - 1
    && fecha.getUTCDate() === dia;
  return esReal ? texto : '';
}

// «Hoy» como YYYY-MM-DD en Colombia. Al ser ISO, se compara alfabéticamente y
// no hace falta aritmética de offsets (que se corre un día cerca de medianoche).
function hoyEnBogota() {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: ZONA_HORARIA,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).format(new Date());
}

// Estados de una promoción. La página pública muestra solo las vigentes.
function estadoOferta(oferta, hoy) {
  if (oferta.active === false) return 'desactivada';
  const inicio = normalizaFecha(oferta.startsAt);
  const fin = normalizaFecha(oferta.endsAt);
  if (inicio && hoy < inicio) return 'programada';
  if (fin && hoy > fin) return 'vencida';
  return 'vigente';
}

function fechaLegible(fechaISO) {
  // Se ancla a mediodía UTC y se formatea en UTC: así nunca se corre un día.
  const fecha = new Date(`${fechaISO}T12:00:00Z`);
  return new Intl.DateTimeFormat('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC'
  }).format(fecha);
}

function textoVigencia(oferta) {
  const fin = normalizaFecha(oferta.endsAt);
  const inicio = normalizaFecha(oferta.startsAt);
  if (fin) return `Vigente hasta el ${fechaLegible(fin)}`;
  if (inicio) return `Vigente desde el ${fechaLegible(inicio)}`;
  return '';
}

// El campo image es una RUTA/URL de imagen, nunca contenido ejecutable.
// Acepta rutas relativas (jpg, jpeg, png, webp, gif) o URLs absolutas https
// con esa misma extensión. Debe coincidir con la validación de admin.js.
function isValidOfferImage(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return true; // vacío es válido: se usa placeholder.jpg

  if (/^(javascript|data|vbscript|file):/i.test(trimmed)) return false;
  if (/[<>"']/.test(trimmed)) return false;
  if (trimmed.startsWith("//")) return false;

  const hasAllowedExtension = /\.(jpe?g|png|webp|gif)(\?[^\s]*)?(#[^\s]*)?$/i.test(trimmed);

  if (/^https:\/\//i.test(trimmed)) {
    return hasAllowedExtension;
  }

  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed)) return false;

  return hasAllowedExtension;
}

// Valida que una oferta del JSON público tenga el mínimo requerido antes de
// mostrarla: id, title y description presentes; publishedAt ausente/null o
// una fecha válida; image ausente/vacía o una ruta/URL válida.
// Las fechas de vigencia son opcionales: si vienen mal, no se rechaza la
// oferta, simplemente se ignora ese límite (ver normalizaFecha).
function isValidPublicOffer(o) {
  if (!o || typeof o !== 'object') return false;
  if (!o.id || !o.title || !o.description) return false;

  if (o.publishedAt !== null && o.publishedAt !== undefined && o.publishedAt !== "") {
    const parsed = new Date(o.publishedAt);
    if (isNaN(parsed.getTime())) return false;
  }

  if (o.image && !isValidOfferImage(o.image)) return false;

  return true;
}

async function init() {
  const container = document.getElementById("offers-feed");
  if (!container) return;

  let offers = [];
  try {
    // cache: 'no-store' evita que la caché HTTP nativa del navegador
    // devuelva una copia antigua sin pasar por la red, complementando el
    // Network First del Service Worker.
    const response = await fetch(OFFERS_DATA_URL, { cache: 'no-store' });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();

    if (!data || !Array.isArray(data.offers)) {
      throw new Error("offers-data.json inválido: se esperaba { offers: [] }");
    }

    offers = dedupeById(data.offers.filter(isValidPublicOffer));
  } catch (error) {
    console.error("No se pudieron cargar las ofertas:", error);
    renderError(container);
    return;
  }

  const hoy = hoyEnBogota();
  const vigentes = offers.filter((oferta) => estadoOferta(oferta, hoy) === 'vigente');

  // Orden: primero la que vence antes; las promociones sin fecha de fin van al
  // final. A igualdad, la publicada más recientemente y luego el id, para que
  // el orden sea determinista.
  vigentes.sort((a, b) => {
    const finA = normalizaFecha(a.endsAt) || SIN_FECHA_FIN;
    const finB = normalizaFecha(b.endsAt) || SIN_FECHA_FIN;
    if (finA !== finB) return finA < finB ? -1 : 1;
    const pubA = new Date(a.publishedAt || 0).getTime();
    const pubB = new Date(b.publishedAt || 0).getTime();
    if (pubA !== pubB) return pubB - pubA;
    return String(a.id).localeCompare(String(b.id));
  });

  renderOffers(container, vigentes);

  // Las tarjetas se insertan después del DOMContentLoaded, así que el módulo
  // script.js ya había resuelto los enlaces de WhatsApp que existían al cargar.
  // Se vuelve a invocar su función global para armar los botones nuevos, sin
  // repetir el número ni la lógica en este módulo.
  if (typeof window !== 'undefined' && typeof window.initWhatsAppLinks === 'function') {
    window.initWhatsAppLinks();
  }
}

// Detecta y descarta ofertas con id duplicado, conservando la primera
// aparición. Registra un aviso controlado sin romper la página ni
// inventar un id nuevo.
function dedupeById(offers) {
  const seen = new Set();
  const result = [];
  for (const o of offers) {
    if (seen.has(o.id)) {
      console.warn(`offers-data.json: id duplicado ignorado "${o.id}"`);
      continue;
    }
    seen.add(o.id);
    result.push(o);
  }
  return result;
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, ch => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }[ch]));
}

function tarjetaOferta(oferta) {
  const titulo = escapeHtml(oferta.title || '');
  const descripcion = escapeHtml(oferta.description || '');
  const imagen = escapeHtml(oferta.image || 'placeholder.jpg');
  const vigencia = textoVigencia(oferta);
  const mensaje = escapeHtml(`Hola, quiero aprovechar la promoción «${oferta.title}».`);

  return `
      <article class="offer-card">
        <img src="${imagen}" class="offer-img" alt="Promoción de Cocoa & Vainilla: ${titulo}" loading="lazy" data-fallback-applied="false" onerror="if(this.dataset.fallbackApplied==='true'){this.onerror=null;return;} this.dataset.fallbackApplied='true'; this.src='placeholder.jpg';"/>

        <div class="offer-body">
          <h3>${titulo}</h3>
          <p>${descripcion}</p>
          ${vigencia ? `<p class="offer-date">${escapeHtml(vigencia)}</p>` : ''}
          <a class="btn btn-primary offer-cta" href="#" data-whatsapp-link data-whatsapp-message="${mensaje}">Pedir por WhatsApp</a>
        </div>
      </article>
    `;
}

function renderOffers(container, offers) {
  container.innerHTML = '';

  if (!offers.length) {
    renderEmpty(container);
    return;
  }

  container.innerHTML = offers.map(tarjetaOferta).join('');
}

function renderEmpty(container) {
  container.innerHTML = `
      <p class="muted">Ahora mismo no hay promociones vigentes.</p>
      <p class="muted">Mientras tanto podés ver el <a href="products.html">catálogo de productos</a> o <a href="contact.html">escribirnos</a> para consultar por una fecha especial.</p>
    `;
}

function renderError(container) {
  container.innerHTML = '<p class="muted">No fue posible cargar las ofertas en este momento.</p>';
}

document.addEventListener("DOMContentLoaded", init);
