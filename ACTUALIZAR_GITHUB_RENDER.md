## Actualizar a v4.1.3 desde v4.1.2

1. Descargá una copia de seguridad JSON desde la app actual en el mismo navegador donde tenés las prendas.
2. En la raíz del repositorio de GitHub `Misael2546/showroom-angela-y-jaqui`, subí los archivos de `Solo_Actualizacion.zip` descomprimidos y reemplazá los anteriores. Para la funcionalidad son indispensables **`index.html`, `app.js`, `catalogo.html`, `catalogo.js` y `service-worker.js`**.
3. Elegí **Commit directly to main** y confirmá.
4. Comprobá el nuevo despliegue en Render y abrí la aplicación: el campo «Para quién es» debe incluir **Niño** y **Niña**.
5. Para renovar los productos que ven las clientas, exportá un nuevo `catalogo.json` desde el módulo de catálogo de la app y subilo a la raíz de GitHub. Esto es manual porque el stock no se sincroniza.

No borres los datos del sitio para forzar la actualización; eso puede borrar el inventario local. El administrador y la vidriera son sitios estáticos y no comparten una base de datos centralizada.

## Actualizar a v4.1.2 desde GitHub y Render

1. **Descargá una copia JSON** desde la aplicación publicada antes de actualizar.
2. En GitHub, rama `main`, reemplazá los archivos `index.html`, `app.js`, `features-v4.js`, `catalogo.html`, `catalogo.js` y `service-worker.js`. Si preferís, reemplazá el paquete completo sin cambiar la estructura de carpetas.
3. Seleccioná «Commit directly to main» y guardá.
4. Render, si tiene Auto-Deploy activado, debería desplegar el nuevo commit. Revisá que el deploy figure «Live».
5. Abrí la app en el **mismo navegador y el mismo dominio**. Entrá a Nueva prenda y revisá el selector «Para quién es».
6. Las prendas antiguas quedan «Sin especificar» hasta que las edites.
7. Si querés reflejar la sección en la **vidriera pública**, exportá un nuevo `catalogo.json` desde la app administrativa y subilo a GitHub. Nunca subas al repositorio un respaldo JSON privado con costos, ventas o clientas.

**Importante:** GitHub/Render publican el código, pero no sincronizan el inventario entre dispositivos. El almacenamiento de la aplicación continúa siendo local al navegador.

### Parche 4.1.1 — Selección de fotografías (iPhone)

Para corregir únicamente el selector de imágenes, reemplazá SOLO `index.html` en la raíz de tu repositorio GitHub. No necesitás reemplazar otros archivos ni crear carpetas nuevas. Render debería actualizarse cuando detecte el commit en `main`, si tiene Auto-Deploy activado. Si no, en Render hacé Manual Deploy → Deploy latest commit. Si Safari sigue mostrando la versión anterior, cerrá y volvé a abrir la web con conexión a internet. Los datos locales no se modifican por este cambio de código, pero siempre conviene tener un respaldo JSON.

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
