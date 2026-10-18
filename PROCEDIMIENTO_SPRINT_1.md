# Procedimiento — Sprint 1: correcciones visibles

**Repositorio:** `juancarlosmu18/sitioweb`
**Rama base:** `main` en `9e20997` (2026-09-08)
**Sitio publicado:** https://reposteriacocoayvainilla.co
**Estado:** procedimiento listo para ejecutar · **sin cambios de código aplicados**
**Creado:** 18 de octubre de 2026, a partir de la auditoría `AUDITORIA-sitioweb-2026-10-18.md`

---

## 1. Objetivo del sprint

Eliminar los defectos que ve un visitante real y que hoy restan credibilidad o claridad comercial, **sin cambiar la arquitectura, sin tocar precios por decisión propia y sin refactorizaciones**.

Al terminar el sprint, un cliente debería poder decir:

- Que la página de contacto parece de un negocio, no de una plantilla.
- Que entiende cuánto cuesta lo que ve.
- Que no encuentra texto cortado por la mitad.
- Que el pie de página no está incompleto.

---

## 2. Alcance

### Dentro

| ID | Tarea | Tipo | Hallazgo |
|---|---|---|---|
| T1 | Año del pie de página vacío | A — corrección | D2.1 |
| T2 | Textos de desarrollo visibles en Contacto | A — corrección | D2.3 |
| T3 | Precio `custom` mostrado como precio fijo | A — corrección | D3.1 |
| T4 | Descripciones cortas cortadas a mitad de palabra | A + D | D3.2 |
| T5 | Estado de error del catálogo | A — corrección | D2.5 |
| T6 | Logo del encabezado a 192 px y tinte fuera de paleta | B — mejora | D2.2 / D9.6 |
| T7 | Página 404 con la identidad del sitio | C — nueva pieza | D2.4 |

### Fuera del sprint (no tocar)

- Precios, importes y modelo de precios más allá de la etiqueta de T3.
- Sitemap, URLs de producto, previsualización social (Sprint 2).
- Service Worker y estrategia de caché (Sprint 2).
- Optimización y limpieza de imágenes (Sprint 3).
- `accesorios.html` / `accesorios-module.js`: permanecen en la rama `chore/recuperar-accesorios`, sin publicar.
- El panel de administración (salvo que se decida moverlo, que exigiría su propia evaluación).

---

## 3. Precondiciones

Antes del primer commit, comprobar:

```powershell
git -C C:\Users\cocoa\Proyectos\siitioweb status           # debe estar limpio
git -C C:\Users\cocoa\Proyectos\siitioweb log -1 --oneline # debe ser 9e20997
git -C C:\Users\cocoa\Proyectos\siitioweb config user.email # cocoacakereposteria@gmail.com
git -C C:\Users\cocoa\Proyectos\siitioweb branch -vv
```

- [ ] `main` limpio en `9e20997`
- [ ] identidad de Git correcta
- [ ] remoto = `https://github.com/juancarlosmu18/sitioweb.git`
- [ ] la rama `chore/recuperar-accesorios` existe y no se toca

Una rama por sprint, no por tarea:

```powershell
git switch -c fix/sprint-1-visibles
```

---

## 4. Orden de ejecución

Por riesgo creciente. Cada tarea termina con su propia verificación antes de pasar a la siguiente.

1. T1 — año (riesgo nulo)
2. T2 — textos de Contacto (riesgo bajo)
3. T5 — estado de error del catálogo (riesgo bajo)
4. T3 — etiqueta de precio (riesgo comercial: requiere decisión previa)
5. T4 — descripciones (riesgo medio: toca datos publicados)
6. T6 — logo y header (riesgo visual: requiere medición previa)
7. T7 — 404 (riesgo nulo, pieza nueva)

---

## 5. Tareas

### T1 — Año del pie de página

**Problema.** `script.js:128` invoca `//initYear();` comentada y la función **no existe**. Los siete HTML tienen `<span data-year></span>` que nunca se rellena: el pie dice «© Cocoa & Vainilla» sin año.

**Archivos.** `script.js` (único archivo a modificar). El HTML ya está preparado.

**Cambio.**

Añadir antes de `function main()`:

```js
function initYear() {
  const targets = document.querySelectorAll("[data-year]");
  if (!targets.length) return;
  const year = new Date().getFullYear();
  targets.forEach((el) => { el.textContent = year; });
}
```

Y en `main()`, reemplazar `//initYear();` por `initYear();`.

**Verificación.**

- [ ] `index.html`, `products.html`, `product.html`, `ofertas.html`, `about.html`, `contact.html` muestran el año en el pie.
- [ ] Sin errores en consola.
- [ ] `Select-String -Path *.html -Pattern 'data-year'` sigue devolviendo 6 coincidencias y ninguna quedó vacía en el render.

**Commit.**

```
fix: mostrar el año actual en el pie de página
```

**Diff esperado.** +8 líneas, 1 archivo.

---

### T2 — Textos de desarrollo en la página de Contacto

**Problema.** Cuatro frases de plantilla son visibles para el cliente, en la página con mayor intención comercial.

**Archivos.** `contact.html` (líneas 68, 78, 98, 103 y 120).

**Cambios exactos.**

| Línea | Texto actual | Acción |
|---|---|---|
| 68 | `WhatsApp directo, redes sociales y ubicación (si aplica).` | Quitar «(si aplica)» → `WhatsApp directo, redes sociales y ubicación.` |
| 78 | `<p class="tip">Podés editar el número y el mensaje en <span class="kbd">script.js</span>.</p>` | **Eliminar la línea completa** |
| 98 | `<p class="tip">Links configurados: Instagram, Facebook y TikTok.</p>` | **Eliminar la línea completa** |
| 103 | `Si tenés punto de retiro o zona de entrega.` | Reemplazar por texto real — **requiere confirmación del negocio** (ver §7) |
| 120 | `<p class="tip">Se abre en una nueva pestaña.</p>` | **Decisión:** es ayuda de plantilla; se recomienda eliminar |

**Verificación.**

- [ ] La página no contiene `script.js`, «Links configurados», «si aplica» ni «Si tenés».
- [ ] Los enlaces de Instagram, Facebook, TikTok y Google Maps siguen funcionando.
- [ ] Ningún `<p class="tip">` queda huérfano sin texto útil.
- [ ] Revisar en móvil que no queden huecos de espaciado.

**Commit.**

```
fix: quitar textos de desarrollo de la página de contacto
```

**Diff esperado.** −4 a −6 líneas, 1 archivo.

---

### T5 — Estado de error del catálogo

**Problema.** Si `products-data.json` no carga, `products-module.js:16-25` devuelve `null` y `products.html` queda vacía, sin mensaje. El módulo de ofertas sí resuelve esto (`offers.js:136-142`).

**Archivos.** `products-module.js`.

**Cambio.** En `init()`, distinguir los tres casos: catálogo nulo, catálogo vacío y catálogo con productos. Añadir dos funciones siguiendo el patrón de `offers.js`, con clases ya existentes (`.muted`, `.card`, `.btn`):

```js
function renderError(container) {
  container.innerHTML = '<p class="muted">No fue posible cargar el catálogo en este momento. Escribinos por WhatsApp y te pasamos los precios.</p>';
}

function renderEmpty(container) {
  container.innerHTML = '<p class="muted">Por ahora no hay productos publicados.</p>';
}
```

Colocar el mensaje dentro de un `.container` para que respete el ancho de la página.

**Verificación.**

- [ ] Renombrar temporalmente `products-data.json` → comprobar que aparece el mensaje de error (y no una página vacía).
- [ ] Restaurar el archivo.
- [ ] Con datos válidos, el catálogo se ve exactamente igual que antes.

**Commit.**

```
fix: mostrar un estado de error si el catálogo no carga
```

---

### T3 — El precio de los productos personalizados

**Problema.** `catalog-utils.js:12` tiene etiquetas para `from`, `variable` y `quote`, pero **no para `custom`**. Por eso Mickey, Paw Patrol, Masha, Princesa y Barbie muestran «$98.000» como si fuera un precio cerrado, cuando el dato es de referencia («Precio según diseño y complejidad»). La aclaración solo aparece en el detalle.

**Archivos.** `catalog-utils.js` (línea 12). Opcionalmente `products-module.js` para mostrar `pricing.note` en la tarjeta.

**Decisión pendiente del negocio (bloqueante).** Elegir una etiqueta; no modificar precios:

- **Opción A (recomendada, conservadora):** `custom: 'Referencia: '` → «Referencia: $98.000».
- **Opción B:** `custom: 'Desde '` → «Desde $98.000». **Solo válida si 98.000 es realmente el mínimo**; hoy no está documentado.

Cualquiera de las dos se aplica así:

```js
const labels = { from: 'Desde ', variable: 'Precio variable', quote: 'Cotizar', custom: 'Referencia: ' };
```

**Verificación.**

- [ ] En `products.html`, las 5 tarjetas de «Encargos especiales» muestran la etiqueta.
- [ ] Las tarjetas de tortas estándar **no** cambian (siguen mostrando «Desde $48.000» o su valor).
- [ ] En el detalle, la nota «Precio según diseño y complejidad» sigue visible.
- [ ] Ningún importe numérico cambió: `git diff products-data.json` debe estar vacío.

**Commit.**

```
fix: aclarar que el precio de los productos personalizados es de referencia
```

---

### T4 — Descripciones cortas truncadas

**Problema.** `admin.js:140` genera `shortDescription` con `desc.slice(0, 80)`, que corta a mitad de palabra. El defecto ya está en los datos publicados: 14 de 19 productos muestran fragmentos como «…una torta que **destac**».

Esta tarea **separa código y datos** (reglas 13 y 14 de `REGLAS_PROYECTO.MD`).

**Paso 1 — código.** En `admin.js`:

```js
function buildShortDescription(text, max = 80) {
  const clean = String(text || "").replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 40 ? cut.slice(0, lastSpace) : cut).trim()}…`;
}
```

Usarla en lugar de `desc.slice(0, 80)`.

**Paso 2 — datos (commit aparte, deliberado).** Regenerar los `shortDescription` de `products-data.json` **a partir de su propio campo `description`**, que es la fuente de verdad. No se redacta contenido nuevo: se re-deriva un campo dependiente. Revisar el diff uno por uno antes de commitear.

**Verificación.**

- [ ] Ninguna `shortDescription` termina en sílaba truncada.
- [ ] Ninguna supera ~80 caracteres visibles.
- [ ] El texto de `description` no cambió en ningún producto.
- [ ] Los importes no cambiaron.
- [ ] Las 19 tarjetas se ven completas en móvil y escritorio.

**Commits.**

```
fix: cortar las descripciones cortas en límite de palabra
data: regenerar shortDescription a partir de la descripción completa
```

---

### T6 — Logo del encabezado y tinte

**Problema.** `styles.css:113-120` fija `.brand img { width:192px; height:192px }` (152 px en escritorio), mientras el HTML declara `width="28" height="28"`. Además el header usa `rgba(255, 247, 251, 0.72)` (rosado), fuera de la paleta beige.

**Esta tarea no se ejecuta a ciegas.**

**Paso 1 — medir.** Abrir el sitio en el navegador y comprobar en DevTools el tamaño real del logo en móvil (375 px) y escritorio (1280 px). **No se pudo verificar visualmente en el entorno de auditoría.**

**Paso 2 — decidir.** Dos caminos excluyentes:

- **(a) Fue una regresión:** el logo debe verse chico. Cambiar a `width:48px; height:48px` (y 56 px en el media query de 760 px). Verificar que el header no salte y que el texto de marca quede alineado.
- **(b) Es intencional:** el logo grande es parte del diseño. No tocar el tamaño; sí optimizar la imagen (pesa 159 KB) — pero eso es Sprint 3.

Registrar la decisión en §7.

**Paso 3 — tinte.** Alinear el fondo del header con la paleta, por ejemplo `rgba(255, 255, 255, 0.72)` o un tono derivado de `--bg`.

**Verificación.**

- [ ] Header a 375 px sin desborde ni scroll horizontal.
- [ ] Header a 1280 px alineado con el contenedor.
- [ ] El logo no se deforma (`object-fit` correcto).
- [ ] El menú móvil sigue abriendo y cerrando.

**Commit.**

```
style: ajustar tamaño del logo y tinte del encabezado
```

---

### T7 — Página 404

**Problema.** No existe `404.html`; GitHub Pages sirve su pantalla genérica en inglés.

**Archivos.** Crear `404.html` reutilizando el header y footer de `about.html`, con:

- Título y descripción propios, `<meta name="robots" content="noindex">`.
- Mensaje breve y dos salidas: «Ver productos» y «Escribir por WhatsApp».
- `script.js` para los enlaces de WhatsApp y el año.

**Verificación.**

- [ ] Abrir una URL inexistente devuelve la página nueva.
- [ ] Los enlaces de WhatsApp del 404 funcionan.
- [ ] No rompe el Service Worker (no hace falta agregarla a `ASSETS`).

**Commit.**

```
feat: página 404 con la identidad del sitio
```

---

## 6. Verificación transversal (antes del PR)

Checklist de `GUIA_DESARROLLO.MD` §19–§22:

**Funcional**
- [ ] Las 6 páginas cargan sin errores de consola.
- [ ] Catálogo: categorías, tarjetas, precios e imágenes correctos.
- [ ] Detalle de producto: abre, muestra precio y la nota cuando corresponde.
- [ ] Ofertas: se ven y el estado vacío sigue funcionando.
- [ ] WhatsApp: todos los botones abren con mensaje.
- [ ] Navegación: los 5 enlaces y el menú móvil.

**Móvil**
- [ ] 375 px: header, tarjetas, botones, pie y botón flotante.

**SEO**
- [ ] `title`, `description`, canónica y Open Graph sin cambios en las 6 páginas (salvo el 404).
- [ ] `git diff` no muestra alteraciones en metadatos de páginas que no debían cambiar.

**Datos y precios**
- [ ] `git diff products-data.json` limitado a `shortDescription` si se aplicó T4; ningún importe modificado.
- [ ] `git diff offers-data.json` vacío.

**Higiene**
- [ ] `git diff` contiene solo lo previsto: sin `.venv`, sin imágenes nuevas, sin secretos.
- [ ] No se agregaron dependencias.
- [ ] No se renombraron archivos ni URLs.

**Pregunta obligatoria del §24:** «¿El diff contiene exclusivamente los cambios que pretendíamos realizar?» Si no → no mergear.

---

## 7. Decisiones pendientes (bloquean tareas)

| # | Decisión | Bloquea | Recomendación |
|---|---|---|---|
| 1 | Etiqueta de precio `custom`: «Referencia: » o «Desde » | T3 | Opción A, salvo que 98.000 sea el mínimo real |
| 2 | Texto de ubicación de Contacto (línea 103) | T2 | Redactarlo el negocio; no inventar |
| 3 | Logo: ¿28-56 px o tamaño grande intencional? | T6 | Medir primero en navegador |
| 4 | ¿Eliminar «Se abre en una nueva pestaña.»? | T2 | Sí |
| 5 | ¿Publicar `accesorios.*` en algún momento? | — | Fuera de este sprint |

---

## 8. Criterios de terminado

El sprint está cerrado cuando:

- [ ] Las 7 tareas están aplicadas y verificadas.
- [ ] Cada commit corresponde a una sola tarea.
- [ ] `git status` limpio y `main` actualizado por PR.
- [ ] El sitio publicado refleja los cambios (verificado tras el despliegue).
- [ ] `FUNCIONALIDADES.MD` no requiere cambios por este sprint (ninguna funcionalidad nueva, salvo el 404).
- [ ] El diff final se revisó completo.

---

## 9. Rollback

- Todo el sprint vive en una rama: `git switch main` y la rama se descarta sin efecto en producción.
- Si algo llega a `main` y se publica: `git revert <sha>` (nunca `reset` sobre `main`).
- Nada de este sprint borra datos ni cambia precios, así que un revert es seguro.

---

## 10. Prohibiciones específicas de este sprint

- No modificar importes ni el modelo de precios.
- No tocar `sw.js`, `sitemap.xml` ni las URLs de producto.
- No refactorizar los módulos de catálogo.
- No optimizar imágenes (Sprint 3).
- No agregar dependencias ni frameworks.
- No mezclar en un commit dos tareas distintas.
- Si aparece un defecto nuevo: documentarlo y proponerlo, **no corregirlo dentro de este sprint** (§30 de `GUIA_DESARROLLO.MD`).

---

## 11. Anexo — comandos de trabajo

```powershell
$repo = "C:\Users\cocoa\Proyectos\siitioweb"

git -C $repo switch -c fix/sprint-1-visibles
# ... aplicar T1 ... verificar ... commit
# ... aplicar T2 ... verificar ... commit

# revisión antes del PR
git -C $repo log --oneline main..HEAD
git -C $repo diff --stat main..HEAD
git -C $repo diff main..HEAD -- products-data.json

# publicación de la rama
git -C $repo push -u origin fix/sprint-1-visibles
```

---

## 12. Nota sobre verificación

Este procedimiento se redactó a partir de la lectura del código publicado (`main` en `9e20997`) y de la auditoría del 18/10/2026.

**No verificado** en el entorno de auditoría: el render real en navegador (el navegador headless estaba bloqueado por el sandbox) y el comportamiento del Service Worker con caché previa. Por eso T6 exige medir antes de cambiar y la verificación final de cada tarea debe hacerse en el navegador.
