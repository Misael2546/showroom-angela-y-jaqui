# Guía de uso: versión 4.2 segura

**Clientas:** abrir el enlace principal de Render o `/catalogo.html`. Allí pueden ver prendas, talles, precios y consultar por WhatsApp. No hay formulario para modificar ropa.

**Administrador:** abrir `/admin.html`, iniciar sesión con el correo y contraseña que configuraste en Supabase. Después de entrar, vas a encontrar las mismas secciones que tenías: Inventario, Caja, Ventas, Gastos, Reservas, Looks, Vidriera y Ajustes.

**Agregar prenda:** Nueva prenda → nombre → categoría → para quién es (Mujer/Hombre/Niño/Niña/Unisex) → costo → precio → stock → foto de fototeca o cámara → Guardar. Esperá a ver **Sincronizado en la nube**.

**Editar o eliminar:** Inventario → abrir una prenda → editar o eliminar. Solo el administrador puede guardar cambios.

**Ventas y reservas:** funcionan desde las pantallas originales. Al guardar, la vidriera se actualizará en la base de datos; las clientas verán los cambios al recargarla.

**Fotos:** se almacenan en Supabase Storage para poder verlas desde otros celulares. Son accesibles mediante sus enlaces públicos.

**Migrar registros existentes:** realizá un respaldo JSON ANTES de actualizar. Después del primer login, en Ajustes usá **Restaurar copia (.json)**. Si migrás desde el mismo navegador y conserva datos anteriores, podés usar **Importar datos anteriores**. Esperá confirmación de sincronización.

**Cerrar sesión:** tocá **Cerrar sesión**. No uses computadores compartidos para gestionar datos sensibles sin cerrar sesión.

**Conexión:** si aparece **Sin sincronizar**, tus cambios todavía no están confirmados en el servidor. No vendas la misma prenda desde otro dispositivo hasta resolverlo. Podés tocar **↻ Sincronizar** para reintentar.

**Recomendación de seguridad:** habilitar MFA en el proveedor de identidad si está disponible y mantener respaldos verificados.
