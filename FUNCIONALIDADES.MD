Funcionalidades del sitio web — Cocoa & Vainilla

Repositorio: "juancarlosmu18/sitioweb"
Estado de referencia: septiembre de 2026

Este documento describe las funcionalidades observadas en el código actual del proyecto.

No representa funcionalidades futuras ni deseos de desarrollo.

---

1. Sistema de navegación

Estado: 🟢 Implementada

El sitio dispone de navegación entre las principales áreas:

- Inicio.
- Productos.
- Ofertas.
- Sobre nosotros.
- Contacto.
- Detalle de producto.

La navegación constituye la estructura principal de acceso al contenido comercial.

---

2. Página de inicio

Estado: 🟢 Implementada

La página principal presenta:

- Identidad de Cocoa & Vainilla.
- Propuesta comercial.
- Acceso al catálogo.
- Categorías de productos.
- Ofertas.
- Información sobre el negocio.
- Contacto.
- Acceso a WhatsApp.

Su función principal es servir como punto de entrada y dirigir al visitante hacia productos o contacto comercial.

---

3. Catálogo de productos

Estado: 🟢 Implementada

El sitio dispone de un catálogo publicado mediante "products-data.json".

El catálogo contiene información como:

- ID.
- Categoría.
- Nombre.
- Descripción corta.
- Descripción.
- Precio.
- Precio desde.
- Imagen.
- Tamaño.
- Nombre del producto.
- Tipo de producto.
- Modelo de precio.

El archivo contiene categorías y productos publicados.

---

4. Categorías

Estado: 🟢 Implementada

Los productos pueden organizarse mediante categorías.

Actualmente el catálogo contiene categorías como:

- Tortas.
- Tortas frías.
- Encargos especiales.
- Encargos especiales para niña.

Las categorías pueden proceder tanto del catálogo publicado como del almacenamiento local utilizado por el panel administrativo.

---

5. Tarjetas de productos

Estado: 🟢 Implementada

El listado de productos genera tarjetas dinámicamente.

Las tarjetas pueden mostrar:

- Imagen.
- Nombre.
- Categoría.
- Precio.
- Información resumida.
- Acceso al detalle.

El usuario puede seleccionar un producto para acceder a su página individual.

---

6. Detalle individual de producto

Estado: 🟢 Implementada

Cada producto puede abrirse mediante una URL con su identificador.

Conceptualmente:

product.html?id=ID_DEL_PRODUCTO

El módulo correspondiente obtiene el producto y genera dinámicamente su contenido.

---

7. Tipos de producto

Estado: 🟢 Implementada

El modelo de datos diferencia productos estándar y productos personalizados.

Esto permite que el sitio trate de manera diferente productos cuyo precio es fijo frente a aquellos cuyo precio puede depender del diseño o encargo.

---

8. Sistema de precios

Estado: 🟢 Implementada

La web dispone de una utilidad centralizada para interpretar los precios.

Contempla diferentes situaciones:

- Precio fijo.
- Precio desde.
- Precio variable.
- Precio a cotizar.
- Precio personalizado.

La función de formato convierte estos modelos en una representación comprensible para el usuario.

Esto permite evitar que cada página implemente por separado la lógica de precios.

---

9. WhatsApp

Estado: 🟢 Implementada

WhatsApp funciona como canal de conversión comercial.

Se utiliza para facilitar el contacto relacionado con los productos y el negocio.

El objetivo del flujo es:

Producto
   ↓
Interés
   ↓
WhatsApp
   ↓
Consulta
   ↓
Pedido

---

10. Ofertas

Estado: 🟢 Implementada

Existe un sistema independiente para mostrar ofertas.

Fuente:

offers-data.json

Módulo:

offers.js

El sistema:

- Carga las ofertas.
- Comprueba que tengan los campos mínimos.
- Valida las imágenes.
- Descarta IDs duplicados.
- Ordena por fecha.
- Renderiza las tarjetas.
- Muestra un estado cuando no existen ofertas.
- Muestra un mensaje de error cuando no puede cargar los datos.

---

11. Validación de imágenes de ofertas

Estado: 🟢 Implementada

Las imágenes utilizadas por las ofertas pasan por una validación.

Se rechazan determinados esquemas potencialmente peligrosos, como:

- "javascript:"
- "data:"
- "vbscript:"
- "file:"

También se comprueba la extensión de la imagen.

Esto reduce el riesgo de introducir contenido no esperado mediante los datos de las ofertas.

---

12. Página de contacto

Estado: 🟢 Implementada

Existe una sección/página específica para facilitar el contacto con Cocoa & Vainilla.

Su finalidad principal es transformar el interés generado por el sitio en comunicación directa con el negocio.

---

13. Información del negocio

Estado: 🟢 Implementada

Existe una sección "Sobre nosotros" destinada a presentar información institucional y comercial de Cocoa & Vainilla.

---

14. SEO dinámico

Estado: 🟢 Implementada

Las páginas de producto pueden modificar dinámicamente información SEO.

Entre los elementos contemplados están:

- Título.
- Descripción.
- URL canónica.
- Open Graph.
- Imagen.
- Datos estructurados.

Esto permite que cada producto pueda presentar información específica ante buscadores y plataformas de compartir contenido.

---

15. Open Graph / redes sociales

Estado: 🟢 Implementada

El sitio utiliza metadatos orientados a compartir páginas en plataformas sociales.

Los productos pueden generar información específica para la página que se está compartiendo.

---

16. Persistencia local de productos

Estado: 🟢 Implementada

Existe almacenamiento mediante IndexedDB.

Base local:

cv_catalogo

Almacén:

productos

Se dispone de funciones para:

- Abrir la base.
- Obtener todos los productos.
- Crear o actualizar productos.
- Eliminar productos.

Limitación

Esta información es local al navegador.

No representa una base de datos central del negocio.

---

17. Persistencia local de categorías

Estado: 🟢 Implementada

Existe una segunda base IndexedDB:

cv_catalogo_categorias

con un almacén denominado:

categorias

Permite:

- Obtener categorías.
- Crear categorías.
- Actualizar categorías.
- Eliminar categorías.

---

18. Panel administrativo local

Estado: 🟡 Implementada, con limitaciones

El proyecto contiene funcionalidad administrativa local para gestionar información del catálogo.

Permite trabajar con:

- Productos.
- Categorías.
- Ofertas.

La administración ocurre en el navegador mediante almacenamiento local.

No es actualmente

- Un CMS centralizado.
- Un panel multiusuario.
- Un sistema conectado a una base de datos servidor.
- Un sistema de administración remoto.

---

19. Exportación de información

Estado: 🟢 Implementada

El panel administrativo puede trabajar con información local y preparar datos para su posterior publicación.

El flujo conceptual es:

Edición local
      ↓
IndexedDB
      ↓
Exportación
      ↓
JSON
      ↓
Repositorio
      ↓
Publicación

La publicación no ocurre automáticamente desde IndexedDB.

---

20. Combinación de productos publicados y locales

Estado: 🟢 Implementada

El código contempla la combinación de productos publicados con productos locales.

La función "mergeProducts()" utiliza el ID del producto para combinar las fuentes y resolver duplicados.

Esto confirma que el proyecto contempla explícitamente dos contextos:

Productos publicados
        +
Productos locales
        ↓
Catálogo utilizado por la interfaz

---

21. Diseño responsive

Estado: 🟢 Implementada

La interfaz está diseñada para funcionar en diferentes tamaños de pantalla, con especial importancia para dispositivos móviles.

Esto es crítico debido a que buena parte del tráfico comercial esperado procede de teléfonos.

---

22. PWA

Estado: 🟡 Implementada / requiere verificación integral

El proyecto contempla funcionalidades relacionadas con Progressive Web App.

La presencia de componentes PWA debe considerarse una funcionalidad técnica existente, pero su funcionamiento completo debe verificarse mediante pruebas específicas de:

- Manifest.
- Service Worker.
- Caché.
- Instalabilidad.
- Actualización de recursos.
- Comportamiento offline.

No debe asumirse que la presencia de archivos PWA significa automáticamente que toda la experiencia PWA está correctamente implementada.

---

23. Estados de error

Estado: 🟢 Implementada

Algunos módulos contemplan estados controlados cuando los datos no pueden cargarse.

Por ejemplo, el sistema de ofertas muestra mensajes específicos cuando:

- No existen ofertas.
- No puede cargarse el archivo de ofertas.
- Los datos no tienen la estructura esperada.

---

24. Protección frente a contenido HTML no confiable

Estado: 🟢 Implementada en módulos revisados

El sistema de ofertas utiliza escape de HTML antes de insertar determinados valores provenientes de los datos.

Esto reduce el riesgo de que contenido almacenado en el JSON sea interpretado directamente como HTML.

---

25. Funcionalidades que NO están implementadas como sistema central

Estado: ⚪ No implementadas

Actualmente no debe considerarse que el sitio disponga de:

- Backend propio.
- API propia.
- Base de datos central.
- Sistema de usuarios.
- Autenticación centralizada.
- Pedidos online completos.
- Carrito de compras centralizado.
- Pasarela de pago integrada.
- Gestión centralizada de inventario.
- Gestión centralizada de producción.
- Sincronización automática con el sistema interno de ventas.
- Gestión multiusuario del catálogo.
- Almacenamiento centralizado de imágenes.

---

26. Integración con el sistema interno

Estado: ⚪ No implementada

El sitio público no debe considerarse conectado actualmente al sistema interno de ventas y producción.

La futura integración debe diseñarse como una funcionalidad independiente.

No debe incorporarse directamente la base de datos privada ni la lógica interna al repositorio público.

---

27. Clasificación general

🟢 Implementado

- Navegación.
- Página de inicio.
- Catálogo.
- Categorías.
- Tarjetas de productos.
- Detalle de productos.
- Tipos de producto.
- Sistema de precios.
- WhatsApp.
- Ofertas.
- Validación de ofertas.
- Contacto.
- Información del negocio.
- SEO dinámico.
- Open Graph.
- IndexedDB de productos.
- IndexedDB de categorías.
- Exportación.
- Combinación de datos locales/publicados.
- Responsive.
- Manejo de errores en módulos revisados.

🟡 Implementado pero requiere auditoría/pruebas

- Panel administrativo local.
- PWA.
- Flujo completo de publicación.
- Sincronización entre datos locales y publicados.

⚪ No implementado

- Backend.
- API.
- Base de datos central.
- Usuarios.
- Autenticación.
- Carrito centralizado.
- Checkout.
- Pagos online.
- Pedidos online completos.
- Inventario online.
- Integración con sistema interno.

---

28. Regla de interpretación

Este documento describe el estado funcional observado en el código.

La existencia de código relacionado con una funcionalidad no significa necesariamente que dicha funcionalidad esté completamente terminada.

Cuando una funcionalidad sea crítica para el negocio, deberá verificarse mediante pruebas antes de considerarla completamente operativa.

---

29. Regla para futuras funcionalidades

Toda nueva funcionalidad deberá registrarse aquí indicando:

- Nombre.
- Propósito.
- Estado.
- Dependencias.
- Limitaciones.
- Fecha de incorporación, cuando sea relevante.

Las funcionalidades futuras no deben marcarse como implementadas hasta que hayan sido verificadas.