# Actualización desde iPhone — GitHub + Render

**Primero:** abrí la app V4.1.3 y entrá a Ajustes → Mis respaldos → Descargar copia completa (.json). Guardala en Archivos/iCloud. No borres historial ni almacenamiento del navegador.

1. Descargá este ZIP y descomprimilo con la app Archivos del iPhone.
2. Prepará el proyecto Supabase con la guía `README.md` antes de publicar: `01_instalar.sql`, cuenta personal en Authentication → Users y `02_asignar_administrador.sql`.
3. Completá `cloud-config.js` con la URL y la clave **publishable/anon** de tu proyecto. En iPhone podés editar el archivo en el repositorio de GitHub usando el ícono del lápiz. **Jamás uses clave secret/service_role**.
4. Abrí `github.com/Misael2546/showroom-angela-y-jaqui` → Code → Add file → Upload files. Subí todos los archivos de la raíz; subí por separado `assets`, `icons`, `vendor` y `supabase` dentro de sus respectivas carpetas. Conservá exactamente los nombres de archivo.
5. Título del commit (menos de 50 caracteres): **Agregar acceso privado y catalogo v4.2**
6. Descripción del commit: **Panel de administración protegido con Supabase Auth y RLS, catálogo público de solo lectura, sincronización del inventario, fotografías y respaldo de datos.**
7. Seleccioná **Commit directly to the main branch** → **Commit changes**.
8. En Render, verificá que haya finalizado el nuevo despliegue.
9. Abrí el dominio público `https://TU-SITIO.onrender.com/`: ahora es la vidriera para clientas. Para administrar usá `https://TU-SITIO.onrender.com/admin.html`.
10. Iniciá sesión y **restaurá tu respaldo JSON** desde Ajustes; luego verificá la sincronización.

### Importante

Publicar el ZIP **sin configurar Supabase** dejará el panel bloqueado y el catálogo vacío: esto es intencional y evita simular seguridad. Hacé el cambio después de tener el respaldo y de preparar Supabase.

Si Render sigue mostrando la interfaz antigua después de un despliegue exitoso, revisá que Auto Deploy esté activo y recargá la página. No borres los datos locales del sitio anterior antes de verificar su migración.
