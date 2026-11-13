# 🦋 Showroom Angela y Jaqui — Luxury Secure v4.2

**Aplicación web estática para GitHub + Render, con autenticación y datos protegidos en Supabase.** Conserva el diseño Luxury y las funciones principales de la v4.1.3: inventario, fotos, Mujer/Hombre/Niño/Niña/Unisex, QR, ventas, caja, reservas, looks, gastos, WhatsApp y respaldos.

## Qué recibe cada persona

| Dirección | Función | Acceso |
|---|---|---|
| `/` o `/catalogo.html` | Vidriera, precios, talles y consultas por WhatsApp | Público, sin contraseña |
| `/admin.html` | Inventario, altas/bajas, caja, ventas, reservas, estadísticas | **Solo la cuenta autorizada en Supabase** |

El catálogo público **no incluye costos, ventas, datos de clientas, gastos ni ganancias**. El inventario y el catálogo se guardan en tablas distintas. La base de datos aplica Row Level Security (RLS): una contraseña visual en el navegador NO sería suficiente.

## Importante: requiere configuración antes de funcionar

**No está conectado a ninguna cuenta de Supabase**. Por seguridad, `admin.html` permanece bloqueado mientras `cloud-config.js` esté vacío. El catálogo aparecerá sin productos hasta completar la conexión, autorizar al administrador y migrar las prendas. No se incluye ninguna contraseña o credencial secreta en el ZIP.

1. **HACÉ UN RESPALDO JSON** desde la versión anterior **antes** de reemplazar los archivos. Guardalo también fuera del celular.
2. Creá un proyecto propio en [Supabase](https://supabase.com/dashboard).
3. Abrí **SQL Editor** y ejecutá `supabase/01_instalar.sql`.
4. En **Authentication → Users**, creá **una sola cuenta** para vos; copiá su *User ID* (UUID).
5. En `supabase/02_asignar_administrador.sql`, reemplazá `REEMPLAZAR_CON_EL_UUID_DEL_ADMIN` por ese UUID y ejecutá el SQL desde SQL Editor. No pegues la contraseña en ningún archivo. Verificá que haya **solo una** fila en `showroom_admins`.
6. En **Project Settings / Connect / API keys** de Supabase, copiá la URL del proyecto y **solo la clave publishable (`sb_publishable_...`) o `anon` pública** a `cloud-config.js`. **NUNCA** pongas la clave secret/service_role.
7. Subí **todos** los archivos de este ZIP a la raíz del repositorio `Misael2546/showroom-angela-y-jaqui`, incluyendo `admin.html`, `cloud-config.js`, `secure-cloud.js`, `secure.css` y la carpeta `supabase/` (solo SQL sin secretos).
8. Confirmá el commit en `main`. Render debería desplegar desde `main` si Auto Deploy está activado. Verificá `Deploy succeeded`.
9. Abrí `/admin.html` en tu dominio de Render. Iniciá sesión con el usuario creado en Supabase. La primera vez el inventario de la nube estará vacío.
10. Importá una **copia JSON** de la versión anterior usando **Ajustes → Restaurar copia (.json)**, o el botón **Importar datos anteriores** si conservás los datos en ese mismo navegador. **No migres datos sin respaldo**. Esperá al indicador **Sincronizado en la nube**.
11. Abrí la dirección principal del sitio (o `/catalogo.html`) para verificar que el catálogo solo muestra prendas, precios y contactos públicos.

## Cuidado con la migración

- Al reemplazar `index.html`, la página inicial se convierte en **catálogo público**. La administración anterior ahora está en **`/admin.html`**.
- Los datos originales se guardaban en `localStorage` y parte de las fotos en IndexedDB. Para conservar las fotos, hacé la exportación JSON desde la app original en el mismo dispositivo antes del cambio. Comprobá que el archivo exportado contenga las imágenes; si no, conservá el dispositivo original y usá **Importar datos anteriores**.
- La primera sincronización sube las imágenes a Supabase Storage; la duración depende de la conexión y la cantidad de prendas. Evitá cerrar la pestaña hasta ver **Sincronizado en la nube**.
- La migración no debe borrarse ni invalidarse hasta verificar cantidades, precios, fotos y ventas en la nube.
- Si la sincronización falla, la app deja una copia local pendiente y muestra una advertencia. No asumas que la nube se actualizó hasta que el indicador lo confirme.
- Si se detectan cambios simultáneos de otra sesión, la app **evita sobrescribir** el inventario remoto y pide revisión manual.

## Seguridad y alcance técnico

- Supabase Auth valida correo y contraseña.
- La tabla `showroom_admins` tiene que contener **solo tu UUID**; no existe formulario de registro público.
- Las políticas RLS restringen lectura/escritura del estado privado a esa cuenta; el RPC `commit_showroom` es **SECURITY INVOKER**, así que respeta RLS. La publicación del catálogo sucede en la **misma transacción** que el estado privado.
- Las fotos del bucket `showroom-prendas` son **públicas por URL** para mostrarse en la vidriera, pero **solo el administrador puede subirlas, cambiarlas o borrarlas**. No subas fotos privadas.
- La clave *publishable* del proyecto está destinada al navegador; la clave **secret/service_role NO**.
- El acceso a `/admin.html` es un bloqueo visual además del verdadero control backend; el archivo JS es público, pero las credenciales y los datos protegidos **no** lo son.
- La aplicación puede leer datos en diferentes dispositivos **después de iniciar sesión**. No ofrece cobros bancarios, pagos integrados ni reservas automáticas de clientas.
- Para protección de producción, activá MFA para la cuenta administradora donde esté disponible y configurá respaldos de la base de datos según tu plan de Supabase.

## Pruebas de seguridad obligatorias antes de operar

1. Ingresar sin iniciar sesión a `/admin.html`: debe pedir correo y contraseña.
2. Ingresar con una cuenta cualquiera que no esté en `showroom_admins`: debe rechazar la administración.
3. Como anónimo, consultar API `showroom_state`: debe devolver cero filas/denegar acceso.
4. Como anónimo, intentar actualizar `showroom_state` y `showroom_catalog`: debe ser rechazado.
5. Como administrador, agregar una prenda y esperar **Sincronizado en la nube**.
6. Abrir `/catalogo.html` en otro teléfono: debe mostrar esa prenda, sin costo de compra.
7. Agregar una reserva o realizar una venta: recargar catálogo y confirmar disponibilidad.
8. Cambiar foto y verificarla desde otro dispositivo.
9. Exportar respaldo JSON y verificar que contiene prendas, ventas, señas y fotos.
10. Confirmar que solo **una** fila existe en `showroom_admins`.

> Limitación: no fue posible ejecutar estas pruebas contra tu proyecto real de Supabase porque no se proporcionaron sus credenciales ni existe todavía una instancia configurada. **No declares segura la instalación hasta completar estas pruebas.**

Documentación oficial: [Supabase Auth](https://supabase.com/docs/guides/auth), [Supabase RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Supabase Storage](https://supabase.com/docs/guides/storage).
