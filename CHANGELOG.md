# Historial de versiones

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
