**Actualización 4.1.1:** permite elegir fotos desde la biblioteca del iPhone sin abrir forzosamente la cámara. Para aplicar únicamente esta corrección, basta reemplazar `index.html` en GitHub.

# 🦋 Showroom Angela y Jaqui · Luxury Edition v4.1

Aplicación web instalable (PWA) para llevar una feria de ropa nueva y usada: inventario, fotos, caja rápida, historial, gastos, reservas con señas, looks, etiquetas con QR y vidriera para WhatsApp.

**Este paquete funciona sin instalar Node, npm ni servicios pagos:** son archivos estáticos que podés subir a GitHub Pages. **No tiene inicio de sesión ni base de datos en la nube.** El inventario administrativo permanece en el navegador del dispositivo que lo usa.

> **Actualización desde GitHub + Render:** leé primero `ACTUALIZAR_GITHUB_RENDER.md`. Conservá el mismo repositorio y sitio de Render; descargá un respaldo privado antes de sustituir archivos.

## Archivos principales

```text
index.html           Aplicación de gestión (uso local del showroom)
app.js               Inventario, ventas, gastos, POS, ideas y respaldos
features-v4.js       Reservas, señas, looks, QR y exportación del catálogo
qr.js                Generador QR incluido (MIT, sin conexión)
styles.css           Estilos funcionales de la app, responsive y design tokens
luxury.css           Capa visual Luxury Edition para la administración
catalogo.html        Vidriera pública para clientas
catalogo.js          Filtros y consultas por WhatsApp
catalogo.css         Estilos originales de la vidriera pública
catalogo-luxury.css  Capa visual Luxury Edition para la vidriera
catalogo.json        Copia pública inicial vacía; se actualiza manualmente
assets/              Imagen de marca
icons/               Iconos para instalar la app
manifest.webmanifest, service-worker.js  PWA / caché de interfaz
CHANGELOG.md         Registro de mejoras
GUIA_DE_USO.md        Guía de operación diaria
ACTUALIZAR_GITHUB_RENDER.md  Guía para reemplazar la v4 desde iPhone
.nojekyll             Compatibilidad con GitHub Pages
```

## Instalación en GitHub Pages

1. Descargá y descomprimí el ZIP.
2. En GitHub, entrá al repositorio donde ya publicaste la v3.2 (recomendado: **el mismo repositorio y la misma URL**).
3. Abrí la carpeta descomprimida. Subí **los archivos de adentro** (no el ZIP) a la raíz del repositorio. Reemplazá los archivos anteriores y agregá los nuevos.
4. Verificá que `index.html`, `catalogo.html`, `catalogo.json`, `features-v4.js` y `qr.js` hayan quedado en la raíz.
5. En **Settings → Pages**, elegí **Deploy from a branch**, rama `main` y carpeta `/(root)`. Si ya estaba activado, mantené la configuración.
6. La app administrativa queda en `https://TU-USUARIO.github.io/NOMBRE-REPOSITORIO/`. La vidriera pública queda en `https://TU-USUARIO.github.io/NOMBRE-REPOSITORIO/catalogo.html`.
7. Si el celular muestra la versión vieja, cerrá la aplicación instalada y volvé a abrirla; la actualización del caché puede necesitar una recarga.

### ¡Antes de actualizar, hacé respaldo!

En la v3.2, entrá a **Ajustes → Descargar copia completa (.json)** en el navegador donde realmente están las prendas. Guardalo fuera del teléfono. Repetí el respaldo desde la v4.0 antes de comenzar a operar.

La v4 reutiliza **la misma clave de datos** (`showroom-angela-jaque-v1`), por lo que una actualización en la **misma dirección web y navegador** conserva la información normalmente. Una pestaña privada, un navegador distinto, un nuevo dominio, otro celular o borrar los datos del sitio puede hacer que no aparezca el inventario. En esos casos usá **Ajustes → Restaurar copia**.

## Funcionalidades nuevas

### 1. Reservas y señas 🎟️

- En **Prendas**, tocá el botón `♡` junto a la prenda, o entrá a **Reservas → Nueva reserva**.
- Elegí prenda, unidades, clienta, fecha de vencimiento, seña recibida y medio de pago.
- La cantidad reservada se **resta de la disponibilidad**, pero se mantiene en el stock físico hasta la venta.
- Las reservas vencidas **dejan de apartar stock automáticamente**. Si todavía querés guardarla, tocá *Renovar reserva* y comprobá que haya stock.
- Tocá **Concretar venta** para convertirla en una venta del precio total y registrar la seña como dinero ya recibido. El ticket muestra cuánto queda por cobrar. No se toma la seña como descuento.
- Si cancelás una reserva con seña, la app **no devuelve dinero**: registrá por separado si reintegraste o retuviste ese importe. El reporte actual no calcula ingresos/egresos reales por señas.

**Importante:** *Ventas* muestra el importe total de cada operación concretada; sus importes por medio de pago **no equivalen a un arqueo de efectivo** cuando hubo señas previas.

### 2. Looks o conjuntos 🎀

- **Más → Armá tu look**: seleccioná entre dos y cuatro prendas disponibles.
- Definí nombre, descuento en pesos opcional y mensaje de promoción.
- Compartí el look por WhatsApp o agregalo al ticket. El descuento del conjunto se incluye en el campo descuento de Caja.
- No se aparta stock al crear un look; se verifica cuando lo sumás a una venta.
- Si se modifica un precio, el valor del look se recalcula con el precio vigente.

### 3. Etiquetas QR ▦

- En **Prendas**, tocá el botón de etiqueta 🏷 para imprimir el nombre, precio, talle, código y **QR real del SKU**.
- Para buscar, tocá **Escanear QR** en Prendas, Caja o Más.
- En navegadores compatibles con `BarcodeDetector` podés activar la cámara (**requiere HTTPS y permiso**). Si no está disponible, podés escribir el código manualmente. **No todos los celulares/iPhone admiten escaneo automático**.
- Al encontrar la prenda, la app abre su edición; si estás en Caja y tiene disponibilidad, la suma al ticket.
- Los QR contienen el identificador de la prenda, **no** datos privados ni enlaces a la administración.

### 4. Vidriera pública 🌐

Esta versión incluye una **página separada** (`catalogo.html`) para que las clientas vean prendas, fotos, precio, talle, estado y looks, con botones de WhatsApp.

**Para actualizarla desde la app administrativa:**

1. En **Ajustes**, cargá el número de WhatsApp comercial con código de país, si querés publicarlo.
2. En **Más → Catálogo público**, descargá el archivo `catalogo.json`.
3. En GitHub, reemplazá únicamente el archivo **`catalogo.json` de la raíz** por el que acabás de descargar.
4. Luego de la publicación, compartí el enlace `/catalogo.html` (opción **Más → Enlace a la vidriera**).
5. Volvé a exportarlo después de ventas, reservas, altas o cambios de precio. **El catálogo no se actualiza solo.** Confirmá la disponibilidad por WhatsApp antes de aceptar una venta.

El JSON público contiene únicamente **nombre, SKU, categoría, talle, color, estado, precio, imagen, looks y WhatsApp comercial optativo**. **No incluye** costos, ventas, notas internas, gastos, señas ni datos de clientas. Si agregás fotos, el archivo exportado puede pesar más y GitHub puede tener límites de tamaño de carga.

**No subas nunca a un repositorio público el respaldo completo de la app**, porque sí contiene información comercial y datos de clientas.

## Límites reales y seguridad

- GitHub Pages es un alojamiento de archivos estáticos: **no sincroniza stock ni reservas entre teléfonos**. Cada navegador tiene sus propios registros locales.
- La app administrativa no tiene autenticación. Al publicarla cualquiera puede abrir una instancia local vacía, pero **no** puede leer las ventas del navegador de Angela desde GitHub Pages. No confundas esto con un sistema multiusuario seguro.
- Para trabajar con **Angela y Jaqui desde dos celulares con un único inventario** necesitás un backend con autenticación, base de datos, control de concurrencia y fotos compartidas (por ejemplo, Supabase o Firebase). **Esa sincronización todavía no está implementada.**
- `localStorage` e `IndexedDB` pueden borrarse por configuración o limpieza del navegador; descargá respaldos y guardalos por fuera de la aplicación.
- La cámara y ciertas funciones PWA requieren `https:` o un origen seguro. El escáner puede no estar disponible según el navegador.
- Este producto no procesa pagos, reintegros ni reservas online; anota manualmente operaciones de una feria presencial.
- La venta y el costo de mercadería se registran como en la versión original; los resultados siguen siendo estimaciones, sin impuestos ni costos no registrados.

## Verificaciones técnicas

Probado en Chromium con automatización de navegador: carga y edición, reserva con seña y control de stock, venta desde reserva, looks y descuento en caja, salida de `catalogo.json` sin costos ni clientas, navegación móvil, catálogo público vacío, generación real de QR decodificada mediante OpenCV y diseño responsive en anchos de **320 a 1440 px**.

**Alcance:** pruebas locales automatizadas; no incluyen un despliegue dentro de tu cuenta de GitHub ni pruebas de cámara sobre celulares físicos. Recomendamos registrar primero prendas y ventas de prueba y descargar un respaldo antes de empezar a operar.
