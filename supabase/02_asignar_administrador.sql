-- SEGUNDO PASO: crear el usuario administrador en Authentication -> Users.
-- Copiar su UUID (ID del usuario), reemplazar el texto de abajo y ejecutar.
-- NO PONGAS LA CONTRASEÑA NI EL CORREO EN NINGÚN ARCHIVO PÚBLICO.
insert into public.showroom_admins(user_id)
values ('REEMPLAZAR_CON_EL_UUID_DEL_ADMIN'::uuid)
on conflict (user_id) do nothing;

-- Si accidentalmente autorizaste otra cuenta, eliminá su fila desde el SQL Editor.
-- select user_id from public.showroom_admins;  -- comprobar que haya SOLO una cuenta autorizada
