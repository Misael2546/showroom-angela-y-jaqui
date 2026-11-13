# Actualizar Showroom Angela y Jaqui a Luxury 4.1 desde el iPhone

La v4.1 es un **rediseño visual** que conserva la lógica y la clave de almacenamiento de la v4.0. No hay que crear un repositorio ni otro sitio de Render.

## Antes de actualizar

1. Abrí la v4.0 desde el **mismo enlace de Render** que venís usando.
2. Entrá a **Ajustes → Descargar copia completa (.json)** y guardá el respaldo en Archivos/iCloud, fuera de GitHub. Es un respaldo PRIVADO con ventas y datos de clientas; **no se sube al repositorio público**.
3. Descomprimí el ZIP de la v4.1 desde la app Archivos de tu iPhone.

## En GitHub

Repositorio utilizado: `Misael2546/showroom-angela-y-jaqui`.

1. Abrí el repositorio y confirmá que estás en la rama `main`.
2. En la raíz, reemplazá los archivos de la v4.0 por los de la v4.1. Subí también los dos archivos **NUEVOS** `luxury.css` y `catalogo-luxury.css` (en la raíz, junto a `index.html`).
3. Si conservás las mismas carpetas, no es necesario volver a crear `assets`, `icons` o `vendor`; su contenido sigue siendo el mismo.
4. Si GitHub solicita un mensaje de confirmación, usá `Actualizar Showroom a Luxury 4.1` y seleccioná **Commit directly to main**.
5. Si GitHub te limita al subir varios archivos desde el teléfono, podés actualizar por tandas. No elimines archivos durante el proceso: `index.html`, `styles.css`, `app.js`, `features-v4.js`, `qr.js`, `catalogo.html`, `catalogo.css`, `catalogo.js`, `catalogo.json`, `manifest.webmanifest` y `service-worker.js` deben mantenerse.

## En Render

1. Abrí el **mismo Static Site** que ya tenés creado.
2. Si Auto-Deploy está activado y sigue conectado a `main`, Render debería desplegar el nuevo commit automáticamente. Si no está activado, usá **Manual Deploy → Deploy latest commit**.
3. Confirmá el estado `Deploy succeeded | Live`.
4. Abrí el **mismo enlace `.onrender.com`** de antes. La dirección no debería cambiar.
5. Si seguís viendo el diseño anterior, recargá la página. Si usás el acceso instalado en la pantalla de inicio, cerrá la aplicación y volvé a abrirla para que tome el caché nuevo. No borres datos del sitio ni desinstales sin respaldo.

## Comprobación recomendada

- Verificá el saludo **Hola Angela y Jaqui** y el nuevo diseño beige/marfil.
- Abrí **Prendas**, **Caja**, **Reservas** y **Más**.
- Confirmá que las prendas reales sigan presentes.
- Revisá en otro navegador solo la vidriera pública `catalogo.html`. Recordá que `catalogo.json` no se sincroniza con el inventario en tiempo real: se actualiza manualmente.

## Qué NO cambia

- No hay sincronización entre teléfonos ni inicio de sesión.
- El inventario y las ventas siguen guardados en el navegador y origen web actual (`localStorage`/`IndexedDB`). **Si cambiás el dominio, los datos no se trasladan automáticamente.**
- La versión 4.1 agrega una capa de estilos nueva y no modifica las reglas de stock, señas, ventas ni respaldos.
