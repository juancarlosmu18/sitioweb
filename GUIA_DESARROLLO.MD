Guía de desarrollo — Cocoa & Vainilla

Repositorio: "juancarlosmu18/sitioweb"
Proyecto: Sitio web público de Cocoa & Vainilla
Rama principal: "main"
Estado: Guía operativa de desarrollo
Última revisión: septiembre de 2026

---

1. Propósito

Esta guía establece el procedimiento para desarrollar, modificar, probar, revisar y publicar cambios en el sitio web.

Debe utilizarse junto con:

- "OBJETIVOS_PROYECTO.md"
- "ARQUITECTURA.md"
- "FUNCIONALIDADES.md"
- "CATALOG.md"
- "REGLAS_PROYECTO.md"

La documentación define el contexto y las reglas.

Esta guía define el proceso de trabajo.

---

2. Principio general

Todo cambio debe seguir este ciclo:

ENTENDER
   ↓
PLANIFICAR
   ↓
IMPLEMENTAR
   ↓
PROBAR
   ↓
REVISAR DIFF
   ↓
DOCUMENTAR
   ↓
PUBLICAR

No se debe saltar directamente de:

"Quiero cambiar X"

a:

"Modificar código"

sin analizar previamente el impacto.

---

3. Antes de comenzar una tarea

Antes de modificar el repositorio se debe:

3.1. Definir el objetivo

Escribir claramente:

- Qué problema se quiere solucionar.
- Qué comportamiento se espera.
- Qué archivos probablemente estén involucrados.
- Qué no forma parte de la tarea.

3.2. Revisar documentación

Consultar cuando corresponda:

OBJETIVOS_PROYECTO.md
ARQUITECTURA.md
FUNCIONALIDADES.md
CATALOG.md
REGLAS_PROYECTO.md

3.3. Inspeccionar el código

Buscar:

- Funciones existentes.
- Módulos relacionados.
- Fuentes de datos.
- Dependencias.
- Referencias cruzadas.
- Código duplicado.
- Posibles efectos secundarios.

---

4. No comenzar por la solución

Antes de decidir cómo implementar algo, describir primero:

«Qué debe conseguir el usuario.»

Después:

«Qué solución técnica mínima permite conseguirlo.»

Esto evita diseñar primero una tecnología y después buscar un problema para justificarla.

---

5. Clasificación de la tarea

Antes de comenzar, clasificar el cambio.

Tipo A — Corrección

Ejemplo:

- Botón que no funciona.
- Imagen que no carga.
- Error JavaScript.

Tipo B — Mejora

Ejemplo:

- Mejorar navegación.
- Mejorar presentación.
- Optimizar rendimiento.

Tipo C — Nueva funcionalidad

Ejemplo:

- Nueva sección.
- Nuevo filtro.
- Nueva interacción.

Tipo D — Cambio de datos

Ejemplo:

- Productos.
- Precios.
- Categorías.
- Ofertas.

Tipo E — Cambio arquitectónico

Ejemplo:

- Backend.
- API.
- Base de datos.
- Autenticación.
- Nueva infraestructura.

Los cambios de tipo E requieren una revisión especial.

---

6. Rama de trabajo

Los cambios importantes no deben realizarse directamente sobre "main".

Se recomienda:

main
 │
 ├── feature/nombre-funcionalidad
 ├── fix/nombre-problema
 ├── refactor/nombre-refactor
 └── docs/nombre-documentacion

Regla

"main" debe representar una versión razonablemente estable del proyecto.

---

7. Nombramiento de ramas

Utilizar nombres claros.

Ejemplos:

feature/mejorar-catalogo
feature/filtro-categorias
fix/error-whatsapp
fix/carga-ofertas
refactor/catalog-utils
docs/documentacion-arquitectura

Evitar nombres ambiguos:

cambios
prueba
nuevo
test2
arreglo
final
final2

---

8. Commits

Los commits deben representar cambios comprensibles.

Ejemplos:

feat: mejorar navegación del catálogo
fix: corregir enlace de WhatsApp
fix: validar imagen de ofertas
refactor: centralizar lógica de precios
docs: actualizar arquitectura

No utilizar mensajes como:

cambios
arreglos
update
prueba
cosas
final

---

9. Un commit debe tener un propósito

Evitar mezclar en un mismo commit:

- Cambio visual.
- Refactorización.
- Cambio de precios.
- SEO.
- Nueva funcionalidad.

cuando no estén relacionados.

Un commit debe responder:

«¿Qué cambió y por qué?»

---

10. Trabajo con GitHub Copilot

Copilot debe recibir primero el contexto necesario.

Antes de solicitar modificaciones importantes, indicarle:

- Qué archivo se está trabajando.
- Qué comportamiento se necesita.
- Qué documentos debe respetar.
- Qué restricciones existen.
- Qué archivos no debe modificar.

---

11. Instrucción recomendada para Copilot

Para tareas importantes puede utilizarse:

Antes de modificar código:

1. Inspecciona la implementación actual.
2. Identifica los archivos afectados.
3. Explica qué problema encontraste.
4. Propón la solución mínima.
5. Indica qué archivos modificarías.
6. Identifica posibles efectos secundarios.
7. No modifiques todavía el código.

Debes respetar:
- OBJETIVOS_PROYECTO.md
- ARQUITECTURA.md
- FUNCIONALIDADES.md
- CATALOG.md
- REGLAS_PROYECTO.md

No introduzcas nuevas dependencias ni cambios arquitectónicos sin justificarlo.

Después de revisar la propuesta se puede autorizar la implementación.

---

12. No permitir cambios no solicitados

Si una tarea consiste en:

«"Corregir el botón de WhatsApp"»

Copilot no debe aprovecharla para:

- Cambiar toda la navegación.
- Reescribir el sistema de productos.
- Cambiar el CSS completo.
- Introducir un framework.
- Modificar precios.
- Cambiar URLs.

Si descubre otro problema:

«Debe documentarlo y solicitar autorización para abordarlo.»

---

13. Antes de modificar datos comerciales

Para modificar:

- Productos.
- Precios.
- Categorías.
- Ofertas.

se debe consultar "CATALOG.md".

Los cambios comerciales deben diferenciarse de los cambios técnicos.

---

14. Cambios de precios

Un precio nunca debe modificarse como consecuencia accidental de:

- Refactorización.
- Migración.
- Limpieza de datos.
- Optimización.
- Cambio de estructura.

Todo cambio de precio debe ser deliberado.

---

15. Modificación del catálogo

Antes de modificar "products-data.json":

1. Identificar el producto.
2. Confirmar su ID.
3. Confirmar categoría.
4. Confirmar tipo.
5. Confirmar modelo de precio.
6. Confirmar imagen.
7. Revisar que no exista otro registro contradictorio.

Después:

8. Validar JSON.
9. Probar listado.
10. Probar detalle.
11. Probar WhatsApp.
12. Revisar SEO del producto cuando corresponda.

---

16. Modificación de ofertas

Antes de modificar "offers-data.json":

- Validar estructura.
- Validar ID.
- Validar imagen.
- Validar fechas.
- Validar contenido.
- Evitar IDs duplicados.

Después:

- Probar carga.
- Probar visualización.
- Probar estado sin ofertas.
- Probar comportamiento ante datos inválidos.

---

17. Cambios de arquitectura

Antes de introducir una modificación arquitectónica se debe elaborar una propuesta.

Debe responder:

Problema:
¿Por qué necesitamos cambiar?

Situación actual:
¿Cómo funciona ahora?

Limitación:
¿Qué no puede hacer la arquitectura actual?

Propuesta:
¿Qué cambia?

Beneficios:
¿Qué obtenemos?

Costos:
¿Qué complejidad añadimos?

Riesgos:
¿Qué puede romperse?

Alternativas:
¿Qué soluciones más sencillas existen?

Migración:
¿Cómo pasamos del sistema actual al nuevo?

Reversión:
¿Cómo volvemos atrás si falla?

No se debe implementar directamente una arquitectura nueva sin esta evaluación.

---

18. Dependencias nuevas

Antes de instalar una dependencia:

1. Verificar si ya existe una solución.
2. Verificar si el navegador puede resolver el problema.
3. Evaluar tamaño.
4. Evaluar seguridad.
5. Evaluar mantenimiento.
6. Revisar licencia.
7. Evaluar impacto en rendimiento.

La dependencia debe aportar un beneficio suficientemente importante.

---

19. Pruebas funcionales

Después de cada cambio debe probarse la funcionalidad afectada.

Como mínimo:

¿Carga?
¿Funciona?
¿Se ve correctamente?
¿Los datos son correctos?
¿Los enlaces funcionan?
¿Hay errores JavaScript?

---

20. Pruebas de regresión

Después de cambios importantes se deben comprobar las áreas relacionadas.

Como mínimo:

Navegación

- Inicio.
- Productos.
- Ofertas.
- Sobre nosotros.
- Contacto.

Catálogo

- Categorías.
- Tarjetas.
- Detalle.
- Precios.
- Imágenes.

Conversión

- WhatsApp.
- Enlaces de contacto.

Técnico

- Consola JavaScript.
- Carga de recursos.
- Responsive.

---

21. Pruebas móviles

Todo cambio visual debe revisarse en móvil.

Especialmente:

- Menú.
- Tarjetas.
- Botones.
- Imágenes.
- Texto.
- WhatsApp.
- Formularios.
- Espaciado.

La experiencia móvil tiene prioridad debido a la naturaleza comercial del proyecto.

---

22. SEO después de cambios

Después de modificar una página comprobar:

- "title".
- Description.
- Canonical.
- Open Graph.
- Imagen.
- Encabezados.
- URLs.
- Datos estructurados cuando corresponda.

No asumir que el SEO permanece intacto después de modificar JavaScript.

---

23. Revisión del diff

Antes de hacer merge:

git diff

o utilizar la interfaz de comparación de GitHub.

Revisar:

- Archivos modificados.
- Líneas eliminadas.
- Líneas agregadas.
- Archivos nuevos.
- Archivos eliminados.
- Cambios de datos.
- Cambios de precios.
- Cambios de URLs.
- Dependencias.
- Configuración.

---

24. Pregunta obligatoria antes del merge

«¿El diff contiene exclusivamente los cambios que pretendíamos realizar?»

Si la respuesta es no:

«No hacer merge.»

---

25. Pull Request

Los cambios importantes deben utilizar Pull Request.

El PR debe explicar:

Qué se hizo

Descripción breve.

Por qué

Problema que se resolvió.

Archivos principales

Archivos modificados.

Pruebas realizadas

Qué se comprobó.

Riesgos

Posibles efectos secundarios.

Documentación

Qué documentos se actualizaron.

---

26. Checklist del Pull Request

Antes del merge:

[ ] Objetivo definido
[ ] Documentación revisada
[ ] Código inspeccionado
[ ] Cambio implementado
[ ] Pruebas realizadas
[ ] Móvil revisado
[ ] SEO revisado si aplica
[ ] Catálogo revisado si aplica
[ ] Consola sin errores relevantes
[ ] Diff revisado
[ ] No existen secretos
[ ] No hay cambios no solicitados
[ ] Documentación actualizada

---

27. Merge

No hacer merge si:

- Hay errores conocidos importantes.
- El diff contiene cambios no explicados.
- Se modificaron datos comerciales accidentalmente.
- Se introdujeron secretos.
- No se entiende qué cambió.
- No se han probado las funcionalidades afectadas.

---

28. Después del merge

Después de integrar un cambio importante:

1. Comprobar "main".
2. Comprobar que la aplicación carga.
3. Comprobar la funcionalidad modificada.
4. Revisar errores.
5. Comprobar el despliegue.
6. Registrar problemas encontrados.

---

29. Documentación durante el desarrollo

Si una modificación cambia el comportamiento documentado:

Actualizar:

FUNCIONALIDADES.md

Si cambia arquitectura:

Actualizar:

ARQUITECTURA.md

Si cambia una regla comercial del catálogo:

Actualizar:

CATALOG.md

Si cambia una decisión importante:

Actualizar:

DECISIONES_ARQUITECTURA.md

---

30. Protocolo para problemas encontrados

Si durante una tarea aparece un problema que no forma parte del objetivo:

1. No modificarlo inmediatamente.
2. Documentar el problema.
3. Evaluar impacto.
4. Clasificar prioridad.
5. Crear una tarea independiente.

Esto evita que las tareas crezcan sin control.

---

31. Protocolo para errores críticos

Si una modificación rompe una funcionalidad importante:

DETENER
   ↓
Identificar causa
   ↓
Evaluar rollback
   ↓
Restaurar funcionamiento
   ↓
Investigar
   ↓
Corregir
   ↓
Volver a probar

La prioridad es restaurar la estabilidad.

---

32. Rollback

Todo cambio importante debe ser razonablemente reversible.

No se deben eliminar definitivamente datos o estructuras importantes sin tener:

- Copia.
- Commit anterior.
- Estrategia de reversión.

---

33. Cambios de datos

Antes de realizar cambios masivos en:

- "products-data.json"
- "offers-data.json"
- Otros archivos de datos.

se debe conservar una versión anterior mediante Git.

---

34. Archivos temporales

No deben incorporarse al repositorio:

- Logs.
- Capturas innecesarias.
- Archivos temporales.
- Datos de prueba.
- Credenciales.
- Archivos generados sin propósito.
- Copias de seguridad locales.

Si un archivo temporal es necesario para desarrollo, debe permanecer fuera del repositorio cuando corresponda.

---

35. Calidad del código

El código nuevo debe:

- Ser comprensible.
- Mantener responsabilidades claras.
- Evitar duplicación.
- Utilizar nombres descriptivos.
- Respetar las convenciones existentes.
- No introducir complejidad innecesaria.

No es obligatorio reescribir código antiguo que funciona solamente para hacerlo "más bonito".

---

36. Refactorizaciones

Una refactorización debe realizarse separadamente cuando sea posible.

Evitar:

Nueva funcionalidad
+
Refactorización completa
+
Cambio visual
+
Migración de datos

en una sola modificación.

Preferir:

Commit 1 → Refactor
Commit 2 → Nueva funcionalidad
Commit 3 → Ajustes

cuando la naturaleza del cambio lo permita.

---

37. Uso responsable de IA

La IA puede:

- Analizar.
- Proponer.
- Generar código.
- Detectar problemas.
- Ayudar a probar.

La IA no debe decidir unilateralmente:

- Arquitectura.
- Precios.
- Estrategia comercial.
- Eliminación de funcionalidades.
- Cambios importantes de datos.
- Incorporación de servicios externos.

Estas decisiones requieren revisión humana.

---

38. No confiar únicamente en la respuesta de la IA

Si Copilot indica:

«"Todo está correcto."»

eso no constituye una prueba.

Debe comprobarse mediante:

- Código.
- Tests.
- Navegador.
- Diff.
- GitHub.
- Comportamiento real.

---

39. Auditorías

Periódicamente se debe realizar una auditoría del proyecto para comprobar:

- Documentación.
- Dependencias.
- Seguridad.
- SEO.
- Rendimiento.
- Catálogo.
- Funcionalidades.
- Código muerto.
- Duplicación.
- Arquitectura.

Una auditoría no implica necesariamente modificar código.

---

40. Regla de no intervención

Una auditoría puede concluir:

«No hacer cambios.»

Encontrar una posible mejora no significa que deba implementarse.

---

41. Prioridad de resolución

Cuando existan varios problemas:

1. Seguridad
2. Pérdida de datos
3. Funciones comerciales rotas
4. Errores de navegación
5. SEO crítico
6. Rendimiento
7. Accesibilidad
8. Mantenibilidad
9. Mejoras visuales
10. Mejoras cosméticas

La prioridad puede cambiar si existe una razón comercial concreta.

---

42. Registro de decisiones

Las decisiones importantes deben quedar documentadas.

Ejemplos:

- Mantener arquitectura estática.
- Utilizar JSON como fuente publicada.
- Utilizar IndexedDB local.
- Mantener WhatsApp como canal de conversión.
- No incorporar backend todavía.
- Mantener separado el sistema interno.

Esto evita volver a discutir las mismas decisiones sin contexto.

---

43. Criterio para cerrar una tarea

Una tarea está terminada cuando:

[ ] El objetivo se cumplió
[ ] El código funciona
[ ] No se rompieron funcionalidades existentes
[ ] Se realizaron las pruebas necesarias
[ ] El diff fue revisado
[ ] No existen cambios accidentales
[ ] La documentación está actualizada
[ ] El cambio puede explicarse claramente

---

44. Principio final

El desarrollo del sitio debe buscar:

«Cambios pequeños, objetivos claros, pruebas reales, documentación actualizada y control sobre cada modificación.»

La velocidad de desarrollo no debe conseguirse sacrificando la comprensión del sistema.

Regla final

«Entender antes de modificar. Probar antes de afirmar. Revisar antes de integrar. Documentar antes de olvidar.»