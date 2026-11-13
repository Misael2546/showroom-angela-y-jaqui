# Luxury Secure v4.2 — Cambios sobre v4.1.3

- `index.html`: se convierte en entrada al **catálogo público**.
- `admin.html`: conserva la aplicación completa, pero protegida por inicio de sesión y verificación de autorización.
- `secure.css`: nuevo diseño de acceso privado y estado de sincronización.
- `secure-cloud.js`: login, refresh de sesión, verificación de permisos, sincronización y fotos en Supabase Storage, detección de conflictos y migración manual.
- `cloud-config.js`: configuración local del proyecto (URL y clave publishable, nunca secretos).
- `supabase/01_instalar.sql`: tablas y políticas RLS, transacción de guardado y políticas para fotos.
- `supabase/02_asignar_administrador.sql`: autorización explícita de una cuenta propia.
- `catalogo.js`: consulta el snapshot público a Supabase (ya no lee los datos privados ni depende de subir `catalogo.json`).
- `app.js`, `features-v4.js`: muestran fotos remotas HTTPS y estado de sincronización.
- `service-worker.js`: nueva versión de caché solo para recursos estáticos, sin guardar datos de Supabase.
- No se eliminan los módulos Luxury existentes ni las opciones de prendas Mujer, Hombre, Niño, Niña, Unisex.

## Aclaración
La seguridad efectiva depende de **ejecutar correctamente el SQL, autorizar solo tu UUID y probar los permisos**. Antes de eso, el panel se mantiene cerrado.
