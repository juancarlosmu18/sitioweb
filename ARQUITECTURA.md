Arquitectura del sitio web — Cocoa & Vainilla

Repositorio: "juancarlosmu18/sitioweb"
Tipo de aplicación: sitio web frontend estático con funcionalidades dinámicas en el navegador
Backend: no existe actualmente
Base de datos servidor: no existe actualmente
Persistencia local: IndexedDB
Fuente publicada principal del catálogo: "products-data.json"

---

1. Descripción general

El sitio web de Cocoa & Vainilla es una aplicación frontend que se ejecuta principalmente en el navegador del visitante.

La arquitectura actual combina:

- HTML.
- CSS.
- JavaScript.
- JSON como fuente de datos publicados.
- IndexedDB para almacenamiento local.
- WhatsApp como canal de contacto y conversión.
- GitHub como mecanismo de publicación del contenido estático.
- Funcionalidades SEO implementadas en las páginas.
- Un panel administrativo local para gestionar información antes de exportarla/publicarla.

Actualmente no existe un backend propio ni una base de datos centralizada accesible por el sitio público.

---

2. Arquitectura conceptual

                    ┌─────────────────────────┐
                    │        GitHub            │
                    │     Repositorio web      │
                    └────────────┬────────────┘
                                 │
                                 │ publicación
                                 ▼
                    ┌─────────────────────────┐
                    │      Sitio público       │
                    │ Cocoa & Vainilla         │
                    └────────────┬────────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
        HTML / CSS          JavaScript            JSON
              │                  │                  │
              │                  │                  ├── products-data.json
              │                  │                  └── offers-data.json
              │                  │
              │                  ▼
              │             IndexedDB
              │                  │
              │        ┌─────────┴─────────┐
              │        │                   │
              │    Productos            Categorías
              │
              ▼
        Navegador del cliente
              │
              ├── Catálogo
              ├── Detalle producto
              ├── Ofertas
              ├── Contacto
              └── WhatsApp

---

3. Capas del sistema

3.1. Capa de presentación

Está formada principalmente por las páginas HTML y "styles.css".

Responsabilidades:

- Estructura visual.
- Navegación.
- Contenido estático.
- Accesibilidad básica.
- Llamados a la acción.
- Presentación de productos y ofertas.

Páginas principales:

index.html
products.html
product.html
ofertas.html
about.html
contact.html

---

4. Página de inicio

"index.html" funciona como página principal del sitio.

Actualmente contiene:

- Identidad de Cocoa & Vainilla.
- Presentación principal.
- Acceso al catálogo.
- Contacto por WhatsApp.
- Beneficios.
- Presentación del negocio.
- Acceso a categorías.
- Feed de ofertas.
- Contacto.
- Navegación principal.
- Pie de página.
- Panel administrativo local.

La página principal carga módulos JavaScript para funcionalidades dinámicas.

---

5. Sistema de catálogo

El catálogo publicado utiliza:

products-data.json

Este archivo representa la fuente publicada de productos.

Los módulos que consumen esta información no deben mantener una segunda copia independiente del catálogo.

Flujo

products-data.json
        │
        ├── products.html
        │       │
        │       └── products-module.js
        │
        └── product.html
                │
                └── product-module.js

---

6. Listado de productos

"products-module.js":

- Carga "products-data.json".
- Obtiene los productos.
- Obtiene las categorías.
- Agrupa productos por categoría.
- Ordena categorías.
- Genera las tarjetas de producto.
- Enlaza cada producto con "product.html?id=...".

La carga se realiza desde el navegador.

No existe actualmente una API de productos.

---

7. Detalle de producto

"product.html" utiliza:

product-module.js

El módulo:

1. Obtiene el parámetro "id" de la URL.
2. Carga el catálogo.
3. Busca el producto correspondiente.
4. Obtiene su información de precio.
5. Genera el detalle.
6. Genera el enlace de WhatsApp.
7. Actualiza metadatos SEO.
8. Genera datos estructurados Schema.org para el producto cuando corresponde.

Ejemplo conceptual:

product.html?id=producto-123
             │
             ▼
      product-module.js
             │
             ▼
      products-data.json
             │
             ▼
        Producto
             │
       ┌─────┴─────┐
       ▼           ▼
      SEO       WhatsApp

---

8. Modelo de precios

El proyecto utiliza "catalog-utils.js" para centralizar la interpretación y presentación de precios.

Actualmente contempla tipos como:

fixed
from
variable
quote
custom

La función "getPricing()" permite mantener compatibilidad con campos históricos como "price" y "priceFrom".

La función "formatPrice()" transforma el modelo de precio en una representación apropiada para el usuario.

Esto evita que cada módulo tenga que implementar su propia lógica de precios.

---

9. Persistencia local

El sitio dispone de almacenamiento local mediante IndexedDB.

Actualmente existe una base:

cv_catalogo

con el almacén:

productos

Este almacenamiento es utilizado por el panel administrativo local.

Importante:

«IndexedDB pertenece al navegador del usuario. No es una base de datos central del negocio.»

Los cambios realizados allí no modifican automáticamente "products-data.json" en GitHub.

---

10. Categorías locales

Existe una segunda base IndexedDB:

cv_catalogo_categorias

con el almacén:

categorias

Las categorías pueden provenir de:

1. El catálogo publicado.
2. El almacenamiento local.

El sistema combina ambas fuentes para la experiencia del panel local.

Las categorías locales no se convierten automáticamente en categorías públicas.

---

11. Panel administrativo

El proyecto contiene un panel administrativo local implementado principalmente mediante:

admin.js
db.js
categories-db.js
offers-db.js

El panel permite trabajar localmente con:

- Productos.
- Categorías.
- Ofertas.

Puede:

- Crear productos.
- Editar productos.
- Eliminar productos.
- Crear categorías.
- Gestionar ofertas.
- Exportar información a JSON.

Limitación crítica

El panel no es un administrador web centralizado.

No existe actualmente:

Usuario
   ↓
Servidor
   ↓
Base de datos

En cambio:

Navegador
   ↓
IndexedDB local
   ↓
Exportación JSON
   ↓
GitHub
   ↓
Publicación

Por tanto, los cambios locales no son automáticamente visibles para otros dispositivos o usuarios.

---

12. Flujo de publicación del catálogo

El flujo actual puede representarse como:

                    CATÁLOGO PUBLICADO
                           │
                           ▼
                  products-data.json
                           │
                           ▼
                    Sitio público
                           ▲
                           │
                    publicación
                           │
                    GitHub
                           ▲
                           │
                    exportación
                           │
                    Panel local
                           ▲
                           │
                       IndexedDB

Esto significa que el panel funciona actualmente como una herramienta de edición local, no como un CMS centralizado.

---

13. Sistema de ofertas

Las ofertas tienen una arquitectura independiente del catálogo.

Fuente pública:

offers-data.json

Módulo:

offers.js

El sistema:

- Carga las ofertas.
- Valida su estructura.
- Valida las imágenes.
- Elimina duplicados por ID.
- Ordena por fecha.
- Renderiza las ofertas.
- Muestra estados de error o ausencia de ofertas.

El panel administrativo permite gestionar ofertas localmente y posteriormente exportarlas para publicación.

---

14. Imágenes

El sitio utiliza imágenes almacenadas como archivos/rutas accesibles por el frontend.

Actualmente no existe un servicio propio de almacenamiento de archivos.

Por esta razón:

«Una imagen utilizada por el catálogo debe estar disponible mediante una ruta publicada.»

El panel no debe intentar convertir imágenes en Base64 para almacenarlas en el catálogo.

Una futura solución de carga de imágenes requeriría infraestructura adicional.

---

15. WhatsApp

WhatsApp funciona como uno de los principales mecanismos de conversión.

Se utiliza desde:

- Inicio.
- Contacto.
- Detalle de producto.
- Otros llamados a la acción.

En el detalle de producto se genera un mensaje contextual asociado al producto seleccionado.

Arquitectura:

Producto
   ↓
Botón "Pedir por WhatsApp"
   ↓
Mensaje contextual
   ↓
WhatsApp
   ↓
Conversación comercial

---

16. SEO

El proyecto incorpora SEO tanto estático como dinámico.

Entre los elementos utilizados se encuentran:

- "title".
- "meta description".
- Canonical.
- Open Graph.
- Twitter Card.
- Datos estructurados de productos.

Las páginas de producto pueden modificar dinámicamente:

- Título.
- Descripción.
- URL canónica.
- Imagen Open Graph.
- Tipo Open Graph.
- Datos estructurados Schema.org.

Por tanto, el SEO no está completamente contenido en los archivos HTML estáticos.

---

17. Separación entre datos públicos y privados

El repositorio es público.

Por tanto, todo aquello almacenado en él debe considerarse información potencialmente pública.

No deben almacenarse aquí:

- Credenciales.
- Contraseñas.
- Tokens privados.
- Información sensible de clientes.
- Datos internos del negocio.
- Bases de datos privadas.
- Lógica privada del sistema interno de ventas y producción.

---

18. Relación con el sistema de ventas y producción

La página web y el sistema interno de ventas/producción deben mantenerse como sistemas independientes.

Web pública

Marketing
Catálogo
SEO
Ofertas
Contacto
WhatsApp
Conversión

Sistema interno

Ventas
Producción
Inventario
Compras
Recetas
Clientes
Proveedores
Reportes
Operación

Una futura integración debe realizarse mediante una interfaz claramente definida.

No debe copiarse la base de datos ni la lógica interna del sistema de ventas al repositorio público.

---

19. Dependencias principales

La arquitectura actual depende fundamentalmente de:

HTML
CSS
JavaScript
JSON
IndexedDB
Navegador web
GitHub / hosting estático
WhatsApp

La arquitectura no requiere actualmente:

Servidor backend
API propia
Base de datos servidor
Sistema de autenticación
Servidor de archivos

---

20. Principios arquitectónicos

Principio 1 — Fuente única

Los datos publicados deben tener una fuente claramente definida.

Principio 2 — Separación

Los datos locales no deben confundirse con los datos públicos.

Principio 3 — Simplicidad

No introducir infraestructura de servidor mientras no exista una necesidad real.

Principio 4 — Seguridad

El repositorio público nunca debe contener secretos.

Principio 5 — Modularidad

Las responsabilidades deben mantenerse separadas entre:

- Catálogo.
- Productos.
- Ofertas.
- Persistencia local.
- Presentación.
- SEO.

Principio 6 — Evolución controlada

Una modificación arquitectónica importante debe documentarse antes o junto con su implementación.

---

21. Limitaciones actuales

La arquitectura actual tiene limitaciones conocidas:

- No existe backend.
- No existe base de datos central.
- IndexedDB es local al navegador.
- El panel administrativo no es multiusuario.
- La publicación requiere exportación y actualización del repositorio.
- Las imágenes no tienen un sistema de subida centralizado.
- La sincronización entre dispositivos no existe.
- La integración automática con el sistema interno todavía no existe.

Estas limitaciones no son necesariamente errores.

Son consecuencias de la decisión actual de mantener una arquitectura principalmente estática.

---

22. Regla para futuras modificaciones

Antes de introducir una nueva tecnología o modificar la arquitectura debe responderse:

1. ¿Qué problema actual resuelve?
2. ¿Por qué la arquitectura existente no es suficiente?
3. ¿Qué complejidad añade?
4. ¿Qué mantenimiento requerirá?
5. ¿Qué coste tendrá?
6. ¿Qué riesgos introduce?
7. ¿Afecta al catálogo?
8. ¿Afecta al SEO?
9. ¿Afecta al rendimiento?
10. ¿Afecta la separación con el sistema interno?

Si no existe una necesidad clara, debe mantenerse la solución más sencilla.

---

23. Estado arquitectónico

Estado actual:

«Sitio frontend estático con datos publicados mediante JSON y capacidades locales mediante IndexedDB.»

Backend: No implementado.

Base de datos central: No implementada.

CMS centralizado: No implementado.

Integración con sistema interno: No implementada.

Panel local: Implementado.

Catálogo dinámico: Implementado.

Ofertas dinámicas: Implementado.

Detalle dinámico de productos: Implementado.

SEO dinámico de productos: Implementado.

WhatsApp: Implementado.

---

Documento de referencia

Este archivo describe la arquitectura observada en el código del repositorio y no debe utilizarse para asumir funcionalidades futuras que todavía no hayan sido implementadas.

Las nuevas decisiones arquitectónicas deben documentarse cuando modifiquen significativamente alguno de estos componentes.