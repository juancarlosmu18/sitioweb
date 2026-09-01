# Modelo comercial del catálogo

`products-data.json` es la fuente publicada del catálogo. `pricing` es la
fuente semántica principal y prevalece sobre los campos históricos `price` y
`priceFrom`, que se conservan únicamente por compatibilidad. Sus tipos posibles
son `fixed`, `from`, `variable`, `custom` y `quote`; `amount` es opcional cuando
el precio se cotiza.

Para tortas estándar, `pricing` fija las referencias vigentes por tamaño:
1/4 lb COP 28.000, 1/2 lb COP 48.000 y 1 lb COP 68.000. Los productos
personalizados usan `productType: "custom"` y `pricing.type: "custom"`; su
importe, cuando exista, es de referencia y puede variar o cotizarse según el
encargo.

Cada producto puede definir `productType` (`standard` o `custom`), `size` y
`productName` sin cambiar su ID ni su nombre histórico. Las categorías
publicadas se registran una vez en `categories`; las categorías creadas
localmente desde el panel se guardan en IndexedDB y se combinan con las
categorías de los productos, por lo que no hay una lista cerrada en JavaScript.
Los cambios locales del panel se combinan con el catálogo publicado para su
vista local; publicarlos requiere exportar el JSON y actualizar el repositorio.

El sitio está alojado estáticamente y no cuenta con backend ni almacenamiento
de archivos. Por ello el panel no convierte archivos en Base64 ni los guarda
en el catálogo: una imagen debe ser una ruta ya publicada. Una futura subida de
archivos requiere infraestructura de almacenamiento y un backend.

El archivo residual `imagenes` no tiene referencias en el código ni en los
datos al momento de esta documentación. Puede evaluarse para eliminación en una
decisión posterior; no se elimina en Sprint 1.
