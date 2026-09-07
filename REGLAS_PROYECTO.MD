Reglas del proyecto — Cocoa & Vainilla

Repositorio: "juancarlosmu18/sitioweb"
Proyecto: Sitio web público de Cocoa & Vainilla
Estado: Documento rector de desarrollo
Última revisión: septiembre de 2026

---

1. Propósito de este documento

Este documento establece las reglas que deben respetarse al analizar, modificar, refactorizar o ampliar el sitio web de Cocoa & Vainilla.

Estas reglas aplican tanto al desarrollo manual como al uso de herramientas de Inteligencia Artificial, incluyendo GitHub Copilot.

Su objetivo es evitar:

- Cambios innecesarios.
- Pérdida de funcionalidades existentes.
- Complejidad innecesaria.
- Duplicación de datos.
- Exposición de información privada.
- Alteraciones comerciales accidentales.
- Problemas de SEO.
- Degradación del rendimiento.
- Decisiones arquitectónicas difíciles de revertir.

---

2. Regla fundamental

«Primero entender el sistema actual; después proponer cambios; finalmente modificar código.»

No se debe modificar código antes de comprender:

1. Qué hace actualmente.
2. Qué archivos intervienen.
3. Qué datos utiliza.
4. Qué dependencias existen.
5. Qué otras funcionalidades podrían verse afectadas.

---

3. No asumir funcionalidades

La existencia de un archivo, función o módulo no significa que una funcionalidad esté correctamente implementada.

Antes de afirmar que algo funciona se debe:

- Revisar el código.
- Identificar sus dependencias.
- Ejecutarlo cuando sea posible.
- Probar el comportamiento.
- Registrar las limitaciones conocidas.

---

4. No modificar por modificar

No debe realizarse una modificación simplemente porque:

- El código podría escribirse de otra manera.
- Existe una tecnología más moderna.
- Una IA recomienda otra arquitectura.
- Una librería nueva parece más conveniente.
- El código puede reducirse en número de líneas.

Debe existir una razón concreta.

Pregunta obligatoria

«¿Qué problema real estamos solucionando?»

Si no existe una respuesta clara, el cambio debe cuestionarse.

---

5. Prioridad de estabilidad

Cuando una modificación compita con una funcionalidad existente, se debe priorizar conservar el funcionamiento actual.

No se debe sacrificar una funcionalidad comercial estable para conseguir una mejora técnica marginal.

---

6. No introducir complejidad prematuramente

No incorporar:

- Backend.
- API.
- Base de datos servidor.
- Framework adicional.
- Sistema de autenticación.
- Microservicios.
- Contenedores.
- Servicios externos.
- Nuevas dependencias.

salvo que exista una necesidad demostrable.

Principio

«La complejidad debe ser consecuencia de una necesidad, no de una anticipación.»

---

7. Separación entre web pública y sistema interno

El sitio web público y el sistema interno de ventas y producción son proyectos diferentes.

No se debe:

- Copiar la base de datos privada.
- Copiar la lógica interna de producción.
- Publicar código privado.
- Exponer información interna.
- Incorporar módulos administrativos innecesarios.
- Convertir la web pública en una réplica del sistema interno.

Las futuras integraciones deben diseñarse de forma controlada.

---

8. Seguridad del repositorio

El repositorio público debe tratarse como información pública.

Está prohibido almacenar:

- Contraseñas.
- Tokens secretos.
- API keys privadas.
- Credenciales.
- Cookies privadas.
- Información personal de clientes.
- Bases de datos privadas.
- Archivos de configuración secretos.
- Información sensible del negocio.

Antes de realizar un commit se debe comprobar que no se esté exponiendo información sensible.

---

9. Fuente de verdad de los datos

Cada tipo de información debe tener una fuente de verdad claramente definida.

No se deben crear copias independientes de:

- Productos.
- Precios.
- Categorías.
- Ofertas.
- Información comercial.

si esas copias pueden terminar divergiendo.

Cuando exista más de una fuente por razones técnicas, debe documentarse:

- Cuál es la fuente principal.
- Cuál es una copia.
- Cómo se sincronizan.
- Qué ocurre si existen diferencias.

---

10. Precios

Los precios son información comercial crítica.

Nunca deben modificarse:

- Por suposición.
- Para "hacerlos consistentes".
- Durante una refactorización.
- Automáticamente mediante una IA.

Un cambio de precio requiere una decisión comercial explícita.

La lógica técnica debe respetar los tipos de precio existentes.

---

11. Productos personalizados

No se debe transformar automáticamente un producto personalizado en un producto de precio fijo.

Si el precio depende del diseño, tamaño, complejidad u otras condiciones, debe mantenerse esa naturaleza.

No se deben crear precios ficticios para completar campos.

---

12. Catálogo

Antes de modificar:

- "products-data.json"
- Categorías.
- Productos.
- Precios.
- Imágenes.
- Tipos de producto.

se debe revisar "CATALOG.md".

Las reglas del catálogo deben respetarse.

---

13. Imágenes

Las imágenes deben:

- Existir realmente.
- Utilizar rutas válidas.
- Mantener nombres coherentes.
- Estar optimizadas cuando sea posible.
- No incorporar información innecesaria.
- No exponerse mediante rutas inseguras.

No se debe convertir automáticamente todo el sistema de imágenes a Base64.

Una solución centralizada de imágenes requiere una decisión arquitectónica independiente.

---

14. SEO

Ningún cambio de frontend debe ignorar el SEO.

Antes de modificar una página se debe comprobar si afecta:

- "title".
- "description".
- Canonical.
- Open Graph.
- Twitter Cards.
- Datos estructurados.
- URLs.
- Contenido indexable.
- Enlaces internos.

No se deben eliminar metadatos existentes sin justificarlo.

---

15. URLs

No se deben cambiar URLs públicas sin evaluar:

- Enlaces existentes.
- Marcadores.
- Indexación.
- Compartidos en redes.
- SEO.

Si una URL debe cambiar, se debe definir una estrategia de redirección o compatibilidad cuando sea necesaria.

---

16. JavaScript

Cada módulo debe mantener una responsabilidad clara.

Antes de crear un nuevo archivo ".js" se debe preguntar:

«¿La funcionalidad realmente necesita un módulo independiente?»

No se debe duplicar lógica existente.

Antes de crear una función nueva se debe buscar si ya existe una función equivalente.

---

17. CSS

No se deben introducir estilos duplicados si ya existe una regla reutilizable.

No se debe modificar globalmente un estilo para resolver un problema local sin evaluar sus efectos sobre otras páginas.

Los cambios visuales deben comprobarse al menos en:

- Móvil.
- Tablet.
- Escritorio.

---

18. IndexedDB

IndexedDB es almacenamiento local del navegador.

No debe tratarse como una base de datos central.

Los cambios realizados en IndexedDB:

- No son automáticamente compartidos.
- No son automáticamente publicados.
- No deben considerarse sincronizados con GitHub.

Cualquier cambio en el modelo de IndexedDB debe considerar compatibilidad con datos existentes.

---

19. Panel administrativo

El panel administrativo local debe considerarse una herramienta de edición local, no un CMS central.

No se debe ampliar su complejidad sin demostrar que existe una necesidad real.

Antes de convertirlo en:

- CMS.
- Sistema multiusuario.
- Sistema con login.
- Sistema con backend.

se debe realizar una evaluación arquitectónica independiente.

---

20. Dependencias

No se debe incorporar una librería externa si la funcionalidad puede resolverse razonablemente con el código existente y sin generar una complejidad significativa.

Toda nueva dependencia debe justificar:

- Qué problema resuelve.
- Por qué no se puede resolver con lo existente.
- Tamaño/impacto.
- Mantenimiento.
- Seguridad.
- Licencia.
- Beneficio real.

---

21. Cambios pequeños y reversibles

Cuando sea posible, los cambios deben realizarse de forma:

- Pequeña.
- Aislada.
- Comprensible.
- Reversible.
- Fácil de probar.

Se deben evitar modificaciones masivas que mezclen:

- Refactorización.
- Diseño.
- SEO.
- Datos.
- Arquitectura.

en un mismo cambio.

---

22. No mezclar problemas

Si se encuentra un problema durante una tarea, no se debe aprovechar automáticamente para modificar otras áreas.

Ejemplo:

«Si estamos corrigiendo una tarjeta de producto y descubrimos un problema de SEO, primero se documenta el problema y después se decide si forma parte de la tarea.»

Esto evita que un cambio pequeño termine convirtiéndose en una refactorización completa.

---

23. Antes de modificar

Toda tarea importante debe seguir este proceso:

1. Inspeccionar
       ↓
2. Comprender
       ↓
3. Identificar impacto
       ↓
4. Proponer solución
       ↓
5. Revisar riesgos
       ↓
6. Implementar
       ↓
7. Probar
       ↓
8. Revisar diff
       ↓
9. Documentar

---

24. Después de modificar

Después de un cambio importante se debe verificar:

- Que la funcionalidad original continúa funcionando.
- Que no aparecen errores JavaScript.
- Que no se rompen enlaces.
- Que las imágenes cargan.
- Que el catálogo funciona.
- Que WhatsApp funciona.
- Que SEO no se deterioró.
- Que móvil continúa funcionando.
- Que no aparecen secretos en el repositorio.
- Que el cambio realizado coincide con lo solicitado.

---

25. Revisar siempre el diff

Antes de aceptar un cambio significativo se debe revisar el diff.

La pregunta no es únicamente:

«"¿Funciona?"»

También:

«"¿Qué cambió realmente?"»

El diff debe revisarse para detectar:

- Archivos modificados accidentalmente.
- Eliminaciones inesperadas.
- Cambios de precios.
- Cambios de URLs.
- Cambios de configuración.
- Código duplicado.
- Dependencias nuevas.
- Archivos innecesarios.

---

26. Prohibición de cambios silenciosos

Una IA o desarrollador no debe:

- Eliminar funcionalidades sin informarlo.
- Cambiar precios sin informarlo.
- Cambiar arquitectura sin informarlo.
- Cambiar URLs sin informarlo.
- Cambiar estructura de datos sin informarlo.
- Incorporar dependencias sin informarlo.

Todo cambio relevante debe ser explícito.

---

27. IA y GitHub Copilot

Copilot es una herramienta de asistencia, no la autoridad del proyecto.

Las sugerencias de Copilot deben evaluarse contra:

- "OBJETIVOS_PROYECTO.md"
- "ARQUITECTURA.md"
- "FUNCIONALIDADES.md"
- "CATALOG.md"
- "REGLAS_PROYECTO.md"

Una propuesta técnicamente correcta puede ser incorrecta para este proyecto.

---

28. Regla contra la sobreingeniería

Una solución más compleja no es automáticamente una solución mejor.

Cuando existan dos soluciones que cumplen correctamente el objetivo:

«Se debe preferir la solución más sencilla, mantenible y reversible.»

---

29. Regla contra la "modernización" innecesaria

No se debe actualizar una tecnología, reorganizar archivos o reemplazar una implementación estable solamente porque existe una alternativa más moderna.

Debe existir un beneficio concreto.

---

30. Pruebas antes de declarar terminado

Una tarea no debe considerarse terminada porque:

- El código compila.
- No aparecen errores inmediatamente.
- La IA indica que está terminado.

Debe comprobarse el comportamiento esperado.

Cuando una prueba no pueda realizarse, debe indicarse explícitamente:

«No verificado.»

Nunca debe afirmarse que algo funciona sin haberlo comprobado.

---

31. Documentación

Cuando una modificación cambia significativamente:

- Arquitectura.
- Modelo de datos.
- Flujo de publicación.
- Seguridad.
- SEO.
- Integraciones.

se debe actualizar la documentación correspondiente.

La documentación debe reflejar la realidad del código.

---

32. Estados de funcionalidad

Las funcionalidades deben clasificarse como:

🟢 Implementada y verificada

Funciona y ha sido comprobada.

🟡 Implementada parcialmente

Existe pero tiene limitaciones conocidas.

🟠 Implementada pero requiere auditoría

Existe código, pero todavía no se ha verificado completamente.

🔴 Problemática

Existe una funcionalidad pero presenta un problema conocido.

⚪ Planeada

Todavía no está implementada.

---

33. Cambios arquitectónicos

Cualquier cambio que introduzca:

- Backend.
- API.
- Base de datos central.
- Autenticación.
- Sistema de usuarios.
- Servicio externo crítico.
- Nuevo framework.
- Nuevo sistema de almacenamiento.

debe considerarse un cambio arquitectónico.

No debe incorporarse como una modificación secundaria.

---

34. Criterio comercial

Las decisiones técnicas deben estar subordinadas al objetivo comercial del sitio.

La tecnología debe servir al negocio.

No se debe construir una funcionalidad porque:

«"Sería interesante tenerla."»

Debe existir una necesidad real o una oportunidad claramente identificada.

---

35. Criterio de seguridad

Ante una elección entre dos soluciones equivalentes, se debe preferir la que:

- Exponga menos información.
- Tenga menos superficie de ataque.
- Requiera menos permisos.
- Tenga menos dependencias.
- Sea más sencilla de mantener.

---

36. Criterio de rendimiento

Toda funcionalidad nueva debe considerar:

- Peso de JavaScript.
- Peso de imágenes.
- Número de solicitudes.
- Tiempo de carga.
- Rendimiento móvil.

No se debe aceptar una funcionalidad pesada por una mejora visual marginal.

---

37. Regla de accesibilidad

Las modificaciones visuales deben procurar mantener:

- HTML semántico.
- Navegación mediante teclado.
- Contraste adecuado.
- Textos alternativos.
- Etiquetas comprensibles.
- Elementos interactivos accesibles.

La accesibilidad no debe sacrificarse para conseguir únicamente una apariencia visual.

---

38. Regla de compatibilidad

Antes de eliminar una función, archivo o campo aparentemente obsoleto se debe verificar:

- Quién lo utiliza.
- Qué módulos dependen de él.
- Si existen datos antiguos.
- Si forma parte del flujo de publicación.
- Si existe compatibilidad que deba conservarse.

---

39. Regla de transparencia

Cuando exista incertidumbre, se debe declarar.

Es preferible decir:

«"No está verificado."»

que afirmar:

«"Está funcionando."»

sin pruebas suficientes.

---

40. Regla final

El objetivo no es producir la mayor cantidad de código.

El objetivo es construir una web:

- Útil.
- Comercialmente efectiva.
- Rápida.
- Segura.
- Mantenible.
- Comprensible.
- Escalable cuando realmente sea necesario.

Principio rector

«No construir lo que no necesitamos. No romper lo que funciona. No ocultar los cambios. No asumir que una solución técnicamente sofisticada es una solución mejor.»

---

Documentos que deben consultarse

Antes de realizar cambios importantes se deben considerar:

1. "OBJETIVOS_PROYECTO.md"
2. "ARQUITECTURA.md"
3. "FUNCIONALIDADES.md"
4. "CATALOG.md"
5. "REGLAS_PROYECTO.md"

Estos documentos deben mantenerse coherentes entre sí y con el código real del proyecto.