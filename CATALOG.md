# Modelo comercial del catálogo

`products-data.json` es la fuente publicada del catálogo. Conserva los campos
históricos `price` y `priceFrom` por compatibilidad y usa `pricing` como
referencia semántica. Sus tipos posibles son `fixed`, `from`, `variable`,
`custom` y `quote`; `amount` es opcional cuando el precio se cotiza.

Cada producto puede definir `productType` (`standard` o `custom`), `size` y
`productName` sin cambiar su ID ni su nombre histórico. Las categorías
publicadas se registran una vez en `categories`; las categorías creadas
localmente desde el panel se guardan en IndexedDB y se combinan con las
categorías de los productos, por lo que no hay una lista cerrada en JavaScript.

El sitio está alojado estáticamente y no cuenta con backend ni almacenamiento
de archivos. Por ello el panel no convierte archivos en Base64 ni los guarda
en el catálogo: una imagen debe ser una ruta ya publicada. Una futura subida de
archivos requiere infraestructura de almacenamiento y un backend.

El archivo residual `imagenes` no tiene referencias en el código ni en los
datos al momento de esta documentación. Puede evaluarse para eliminación en una
decisión posterior; no se elimina en Sprint 1.
