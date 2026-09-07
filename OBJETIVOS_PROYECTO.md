Objetivos del proyecto — Cocoa & Vainilla

Proyecto: Sitio web público de Cocoa & Vainilla
Repositorio: "juancarlosmu18/sitioweb"
Rama principal: "main"
Dominio: "reposteriacocoayvainilla.co"

---

1. Propósito del proyecto

El sitio web de Cocoa & Vainilla debe funcionar como un canal comercial digital propio, orientado principalmente a presentar la oferta de productos, generar confianza, facilitar el contacto con clientes y convertir visitas en consultas y pedidos.

La web no debe considerarse únicamente una vitrina digital ni debe convertirse en una copia del sistema interno de ventas y producción.

Su función principal es:

«Atraer, informar, convencer y facilitar el contacto comercial con Cocoa & Vainilla.»

---

2. Objetivos principales

2.1. Objetivo comercial

Incrementar las oportunidades de venta provenientes de Internet mediante:

- Presentación clara de productos.
- Información de precios cuando corresponda.
- Presentación de productos personalizados.
- Promociones y ofertas.
- Llamados a la acción claros.
- Contacto directo por WhatsApp.
- Información de ubicación y contacto.
- Generación de confianza en la marca.

La web debe priorizar la conversión de visitantes en consultas y pedidos reales.

---

2.2. Objetivo de experiencia del usuario

El visitante debe poder responder rápidamente:

1. ¿Qué vende Cocoa & Vainilla?
2. ¿Cuánto cuesta?
3. ¿Qué opciones existen?
4. ¿Puedo pedir algo personalizado?
5. ¿Cómo contacto al negocio?
6. ¿Dónde está ubicado?
7. ¿Cómo hago mi pedido?

La navegación debe ser especialmente buena en dispositivos móviles.

---

2.3. Objetivo de posicionamiento local

La web debe fortalecer la presencia digital de Cocoa & Vainilla en:

- Montería.
- Córdoba.
- Búsquedas relacionadas con repostería.
- Tortas.
- Postres.
- Galletas.
- Productos personalizados.
- Encargos para eventos.

El SEO local debe utilizar información real del negocio y evitar contenido creado únicamente para manipular los buscadores.

---

3. Objetivos funcionales

La web debe permitir, progresivamente:

- Explorar el catálogo.
- Filtrar o categorizar productos.
- Consultar detalles de cada producto.
- Consultar precios o referencias de precio.
- Identificar productos estándar y personalizados.
- Consultar promociones.
- Contactar directamente por WhatsApp.
- Consultar información del negocio.
- Acceder correctamente desde dispositivos móviles.
- Compartir productos y páginas en redes sociales.

Las funcionalidades deben justificarse por su aporte a alguno de estos objetivos.

---

4. Catálogo de productos

El catálogo debe mantener una fuente de información coherente y controlada.

Actualmente "products-data.json" constituye la fuente publicada del catálogo y "CATALOG.md" documenta las reglas comerciales asociadas a dicho modelo.

Los cambios relacionados con productos, precios, categorías o tipos de producto deben respetar esas reglas.

No deben existir múltiples fuentes contradictorias para el mismo precio o información comercial.

Regla fundamental

«La información comercial publicada debe tener una única fuente de verdad claramente identificada.»

Los campos históricos que existan por compatibilidad no deben convertirse nuevamente en fuentes independientes de información.

---

5. Productos personalizados

La web debe diferenciar correctamente entre:

- Productos estándar.
- Productos personalizados.
- Productos cuyo precio depende del encargo.
- Productos cuyo precio debe cotizarse.

No se debe presentar como precio fijo aquello que realmente depende de:

- Tamaño.
- Diseño.
- Decoración.
- Número de porciones.
- Ingredientes.
- Complejidad.
- Fecha.
- Requerimientos especiales.

La finalidad es evitar que la web genere expectativas comerciales incorrectas.

---

6. WhatsApp como canal de conversión

WhatsApp es uno de los principales mecanismos de conversión del sitio.

Los llamados a la acción deben facilitar que el usuario pase desde:

Producto → interés → consulta → pedido.

Cuando sea útil, el mensaje enviado a WhatsApp debe contener contexto suficiente para que el negocio pueda identificar qué producto está consultando el cliente.

No se debe dificultar innecesariamente el contacto mediante formularios complejos si WhatsApp resuelve mejor la necesidad comercial.

---

7. Analítica y medición

La evolución de la web debe basarse progresivamente en datos.

Se deben medir, cuando la infraestructura disponible lo permita:

- Usuarios.
- Visitas.
- Páginas más visitadas.
- Productos más consultados.
- Fuentes de tráfico.
- Interacciones con WhatsApp.
- Interacciones con promociones.
- Conversiones.
- Rendimiento móvil.
- Búsquedas y posicionamiento orgánico.

Principio

«No debemos asumir que una funcionalidad funciona simplemente porque visualmente parece buena.»

Debe existir una forma razonable de comprobar si aporta valor.

---

8. Rendimiento

El sitio debe priorizar:

- Carga rápida.
- Buen funcionamiento en redes móviles.
- Imágenes optimizadas.
- JavaScript necesario y no excesivo.
- CSS mantenible.
- Minimización de recursos innecesarios.
- Buenas métricas de experiencia de usuario.

Las imágenes son especialmente importantes porque el proyecto utiliza numerosas fotografías de productos.

No se deben incorporar recursos pesados sin evaluar su impacto.

---

9. SEO

El SEO debe ser tratado como una función del producto y no como una colección de etiquetas.

Debe mantenerse:

- "title" adecuado.
- "meta description".
- Open Graph.
- URLs comprensibles.
- Contenido relevante.
- Jerarquía semántica correcta.
- Información local coherente.
- Enlaces internos útiles.
- Imágenes con información apropiada.
- Sitemap cuando corresponda.
- "robots.txt" cuando corresponda.
- Datos estructurados cuando realmente sean aplicables.

No se debe generar contenido artificial o repetitivo únicamente para posicionamiento.

---

10. Arquitectura

La arquitectura debe permanecer sencilla mientras las necesidades del negocio no justifiquen mayor complejidad.

Actualmente el sitio tiene una arquitectura principalmente estática y el propio "CATALOG.md" establece que no existe un backend ni almacenamiento de archivos.

Por lo tanto:

«No debe introducirse un backend, base de datos, sistema de usuarios o infraestructura de servidor únicamente porque técnicamente sea posible.»

Cada nueva pieza de infraestructura debe tener una necesidad comercial o técnica demostrable.

---

11. Relación con el sistema interno de ventas y producción

El sitio web público y el sistema interno de ventas y producción son proyectos relacionados pero diferentes.

Sitio web

Responsable principalmente de:

- Marketing.
- Catálogo.
- SEO.
- Información pública.
- Captación.
- Contacto.
- Conversión.

Sistema interno

Responsable principalmente de:

- Ventas.
- Producción.
- Inventario.
- Compras.
- Clientes.
- Proveedores.
- Recetas.
- Reportes.
- Operación interna.

Regla de separación

«La web no debe convertirse en una copia del sistema interno.»

Cuando posteriormente se necesite integración entre ambos sistemas, se debe diseñar mediante una interfaz o mecanismo de integración apropiado, evitando duplicar innecesariamente la lógica interna.

La información sensible o lógica privada del sistema interno no debe exponerse en el repositorio público.

---

12. Seguridad

El repositorio es público, por lo que todo archivo incluido debe considerarse potencialmente visible para terceros.

Nunca deben almacenarse en el repositorio:

- Contraseñas.
- Tokens privados.
- Claves API secretas.
- Credenciales.
- Información privada de clientes.
- Información sensible del sistema interno.
- Configuraciones secretas.

Antes de publicar una nueva funcionalidad debe revisarse qué información queda expuesta al navegador.

---

13. Mantenibilidad

El código debe poder ser entendido y modificado posteriormente sin depender de conocimiento implícito.

Se debe evitar:

- Código duplicado.
- Funciones innecesariamente grandes.
- Variables ambiguas.
- Dependencias sin justificación.
- Soluciones temporales que se convierten en permanentes.
- Archivos que realizan responsabilidades incompatibles.
- Refactorizaciones masivas sin necesidad.

La simplicidad es una característica deseable.

---

14. Regla para utilizar IA y Copilot

Las herramientas de IA pueden proponer cambios, pero sus propuestas no constituyen automáticamente decisiones del proyecto.

Antes de aceptar una modificación importante se debe comprobar:

1. ¿Qué problema resuelve?
2. ¿Qué objetivo del proyecto mejora?
3. ¿Existe una necesidad real?
4. ¿Qué complejidad añade?
5. ¿Qué puede romper?
6. ¿Afecta SEO?
7. ¿Afecta rendimiento?
8. ¿Afecta seguridad?
9. ¿Afecta el catálogo?
10. ¿Afecta la separación entre web pública y sistema interno?
11. ¿Cómo se comprobará que el cambio funciona?

---

15. Clasificación de cambios

🔴 Crítico

Problemas que afectan:

- Seguridad.
- Disponibilidad.
- Pedidos.
- Contacto.
- Información comercial incorrecta.
- Errores graves de navegación.
- Pérdida de datos.

🟠 Importante

Mejoras relacionadas directamente con:

- Conversión.
- SEO.
- Rendimiento.
- Accesibilidad.
- Experiencia móvil.
- Catálogo.

🟡 Mejora

Cambios de:

- Diseño.
- Organización.
- Código.
- Usabilidad secundaria.

🟢 Futuro

Funcionalidades que pueden ser útiles pero que todavía no tienen prioridad o justificación suficiente.

---

16. Criterio de aceptación

Una modificación no debe aceptarse simplemente porque:

- El código queda más moderno.
- Utiliza una tecnología nueva.
- Reduce algunas líneas.
- "Se ve más profesional".
- Una IA la recomienda.

Debe existir una razón verificable.

Principio rector

«Primero necesidad, después solución técnica.»

---

17. Prioridades estratégicas

El desarrollo debe seguir aproximadamente este orden:

1. Que la web funcione correctamente.
2. Que el cliente encuentre fácilmente los productos.
3. Que el cliente pueda contactar y pedir.
4. Que la información comercial sea confiable.
5. Que Google pueda entender y encontrar el sitio.
6. Que la web sea rápida y accesible.
7. Que podamos medir los resultados.
8. Después, agregar funcionalidades avanzadas.

No se debe invertir el orden.

---

18. Roadmap conceptual

Fase 1 — Fundamentos

- Catálogo consistente.
- Navegación.
- Contacto.
- WhatsApp.
- Información comercial.
- Responsive.
- SEO técnico básico.
- Seguridad básica.

Fase 2 — Conversión

- Mejoras de llamadas a la acción.
- Promociones.
- Experiencia de producto.
- Seguimiento de conversiones.
- Optimización de páginas de mayor tráfico.

Fase 3 — Inteligencia comercial

- Analítica más profunda.
- Identificación de productos de mayor interés.
- Personalización de ofertas.
- Integraciones con sistemas internos cuando exista una necesidad real.

Fase 4 — Integración

Solo cuando esté justificado:

- Integración con sistema de ventas.
- Disponibilidad.
- Pedidos.
- Automatizaciones.
- Otros servicios externos.

---

19. Qué NO es el objetivo del proyecto

Este proyecto no tiene como objetivo:

- Convertirse en el sistema administrativo de Cocoa & Vainilla.
- Sustituir el software interno de ventas y producción.
- Incorporar tecnologías por moda.
- Crear una arquitectura innecesariamente compleja.
- Almacenar información privada del negocio.
- Resolver problemas que todavía no existen.
- Construir funcionalidades sin comprobar su utilidad.

---

20. Principio rector final

Toda decisión importante sobre el sitio debe poder responder afirmativamente a esta pregunta:

«¿Esta modificación ayuda de manera demostrable a que Cocoa & Vainilla atraiga clientes, informe mejor, convierta más, funcione mejor o pueda mantenerse de forma segura y sostenible?»

Si la respuesta es no, la modificación debe cuestionarse antes de implementarse.

---

Estado: Documento rector del proyecto.

Última revisión: septiembre de 2026.