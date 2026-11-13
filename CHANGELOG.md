## v4.1.3 · Ropa infantil
- Se incorporan **Niño** y **Niña** al campo «Para quién es», tanto para cargar como para editar prendas.
- Se agregan los dos filtros en el inventario y en el catálogo público.
- Las fichas, etiquetas, exportaciones y mensajes de WhatsApp reconocen las nuevas secciones.
- No modifica precios, stock ni ventas ya guardadas. Las prendas sin clasificación siguen como «Sin especificar».
- Para publicar prendas nuevas o reclasificadas en la vidriera, exportá otra vez `catalogo.json` y subilo al repositorio.

## v4.1.2 · Sección de indumentaria
- Nuevo selector «Para quién es»: Mujer, Hombre, Unisex o Sin especificar.
- Nuevo filtro para inventario y catálogo público; visible en las tarjetas.
- Se conserva el campo en respaldos JSON, CSV, WhatsApp y exportación del catálogo.
- Prendas antiguas quedan «Sin especificar», sin inventar su clasificación.
- Cambio limitado a la UI y datos; no cambia la clave de localStorage.

## 4.1.1 · Corrección de selector de fotos en iPhone

- El selector de imagen de una prenda ahora permite elegir una foto existente de la fototeca de iOS, en vez de abrir la cámara directamente.
- La cámara sigue disponible como opción cuando la ofrece el sistema.
- Se ajustó el texto de ayuda.
- No se modificó la estructura del inventario, la caja, los datos locales ni las funciones de ventas.

# Historial de versiones

## v4.1 · Luxury Edition (rediseño visual)

- Identidad boutique marfil, azul noche y frambuesa sobria, sin fuentes ni servicios externos.
- Nueva composición editorial en Inicio, panel de indicadores con mayor jerarquía y mejor presentación de estadísticas.
- Perchero con tarjetas de producto y fotos más protagonistas; barras de filtros, empty states y botones refinados.
- Caja y ticket con superficies más legibles y navegación inferior táctil diferenciando Caja.
- Modales, notificaciones y estados de enfoque revisados; animaciones discretas con soporte para movimiento reducido.
- Vidriera pública con identidad consistente en la nueva capa `catalogo-luxury.css`.
- Nuevos archivos de presentación `luxury.css` y `catalogo-luxury.css` sin cambios de esquema de datos ni de reglas de stock.
- Caché de la PWA versionado para que una actualización recupere también los nuevos CSS.
- Prueba automatizada de navegación y flujo carga → carrito → descuento → venta en navegador simulado; comprobación de anchos 320, 390, 820 y 1440 px sin desbordamientos horizontales.
- Actualización desde el mismo repositorio GitHub y Static Site Render documentada en `ACTUALIZAR_GITHUB_RENDER.md`.

## v4.0 · Reservas, looks, QR y catálogo público

- Agregado módulo **Reservas y señas**: aparta unidades, fecha de vencimiento, clienta, anticipo y conversión a venta sin transformar la seña en descuento.
- Disponibilidad calculada como stock físico menos unidades en reservas activas y no vencidas, para evitar vender la misma unidad dos veces en un solo navegador.
- Protección al editar o eliminar una prenda con reservas activas.
- Agregado **Armá tu look**: conjuntos de 2–4 prendas, descuentos, WhatsApp y venta desde POS.
- **QR real** impreso en etiquetas, generador incluido y escáner con fallback de ingreso manual.
- Agregado catálogo público independiente `catalogo.html`, filtros, looks y consultas por WhatsApp; publicación del catálogo por JSON **manual**, sin exponer costos, ventas ni clientas.
- Exportación JSON segura de datos públicos, botón para copiar enlace de vidriera.
- Mejoras de UI con secciones de reservas, tarjetas de looks, accesos rápidos y modales adaptados al celular.
- Conserva la clave `showroom-angela-jaque-v1` para leer datos de v3.2; respalda y restaura reservas y looks nuevos.
- Caché PWA actualizado, archivos separados y corregido el fallback de navegación del catálogo.
- No se incluye sincronización multiusuario, login ni procesamiento de pagos: eso requiere un backend adicional.

## v3.2 · Base conservada

- Inventario con fotos, caja rápida, carrito, ventas, gastos, ideas, reportes CSV y respaldos JSON.
- Estética navy/frambuesa, navegación táctil, ticket flotante, modales y estados vacíos.
