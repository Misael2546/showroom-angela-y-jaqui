-- Showroom Angela y Jaqui - Luxury Secure v4.2
-- Ejecutar UNA VEZ desde el SQL Editor de tu proyecto de Supabase.
-- Las clientas solo reciben datos de showroom_catalog, sin costos, ventas ni otros datos privados.

create table if not exists public.showroom_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);

-- Se permite exactamente un usuario administrador.
create unique index if not exists showroom_unico_admin on public.showroom_admins ((true));

create table if not exists public.showroom_state (
  id integer primary key check (id = 1),
  data jsonb not null default '{}'::jsonb,
  revision integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.showroom_catalog (
  id integer primary key check (id = 1),
  payload jsonb not null default '{"products":[],"looks":[]}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.showroom_state(id,data,revision) values(1,'{}'::jsonb,0) on conflict(id) do nothing;
insert into public.showroom_catalog(id,payload) values(1,'{"products":[],"looks":[]}'::jsonb) on conflict(id) do nothing;

alter table public.showroom_admins enable row level security;
alter table public.showroom_state enable row level security;
alter table public.showroom_catalog enable row level security;

-- No crear políticas de escritura para anon. No conceder acceso a ningún otro rol.
revoke all on public.showroom_admins, public.showroom_state, public.showroom_catalog from anon, authenticated;
grant select on public.showroom_admins to authenticated;
grant select on public.showroom_state to authenticated;
grant update on public.showroom_state to authenticated;
grant select on public.showroom_catalog to anon, authenticated;
grant update on public.showroom_catalog to authenticated;

drop policy if exists "propia cuenta de admin" on public.showroom_admins;
create policy "propia cuenta de admin" on public.showroom_admins for select to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "admin lee privado" on public.showroom_state;
create policy "admin lee privado" on public.showroom_state for select to authenticated
  using (exists(select 1 from public.showroom_admins a where a.user_id=(select auth.uid())));
drop policy if exists "admin modifica privado" on public.showroom_state;
create policy "admin modifica privado" on public.showroom_state for update to authenticated
  using (exists(select 1 from public.showroom_admins a where a.user_id=(select auth.uid())))
  with check (exists(select 1 from public.showroom_admins a where a.user_id=(select auth.uid())));

drop policy if exists "vidriera de lectura publica" on public.showroom_catalog;
create policy "vidriera de lectura publica" on public.showroom_catalog for select to anon, authenticated using (true);
drop policy if exists "admin publica vidriera" on public.showroom_catalog;
create policy "admin publica vidriera" on public.showroom_catalog for update to authenticated
  using (exists(select 1 from public.showroom_admins a where a.user_id=(select auth.uid())))
  with check (exists(select 1 from public.showroom_admins a where a.user_id=(select auth.uid())));

-- Seguridad por invocador: se respetan grants y RLS en las DOS tablas.
-- Una transacción actualiza el inventario privado Y la vidriera pública, o ninguno.
create or replace function public.commit_showroom(
  p_expected_revision integer,
  p_admin_data jsonb,
  p_public_data jsonb
) returns integer language plpgsql security invoker set search_path = '' as $$
declare v_revision integer;
begin
  if jsonb_typeof(p_admin_data) <> 'object' or jsonb_typeof(p_public_data) <> 'object' then
    raise exception 'Los datos enviados no son objetos JSON válidos';
  end if;
  update public.showroom_state
     set data=p_admin_data, revision=revision+1, updated_at=now()
   where id=1 and revision=p_expected_revision
   returning revision into v_revision;
  if v_revision is null then
    raise exception 'SHOWROOM_VERSION_CONFLICT';
  end if;
  update public.showroom_catalog set payload=p_public_data, updated_at=now() where id=1;
  if not found then raise exception 'No se encontró showroom_catalog'; end if;
  return v_revision;
end;
$$;
revoke all on function public.commit_showroom(integer,jsonb,jsonb) from public, anon, authenticated;
grant execute on function public.commit_showroom(integer,jsonb,jsonb) to authenticated;

-- Fotos: solo administradores autenticados pueden subir/modificar/borrar imágenes.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('showroom-prendas', 'showroom-prendas', true, 5242880, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

drop policy if exists "admin sube fotos showroom" on storage.objects;
create policy "admin sube fotos showroom" on storage.objects for insert to authenticated
with check (bucket_id='showroom-prendas' and exists(select 1 from public.showroom_admins a where a.user_id=(select auth.uid())));
drop policy if exists "admin modifica fotos showroom" on storage.objects;
create policy "admin modifica fotos showroom" on storage.objects for update to authenticated
using (bucket_id='showroom-prendas' and exists(select 1 from public.showroom_admins a where a.user_id=(select auth.uid()))))
with check (bucket_id='showroom-prendas' and exists(select 1 from public.showroom_admins a where a.user_id=(select auth.uid()))));
drop policy if exists "admin borra fotos showroom" on storage.objects;
create policy "admin borra fotos showroom" on storage.objects for delete to authenticated
using (bucket_id='showroom-prendas' and exists(select 1 from public.showroom_admins a where a.user_id=(select auth.uid()))));

-- IMPORTANTE: ahora crear el administrador en Authentication -> Users.
-- Luego ejecutar supabase/02_asignar_administrador.sql con el UUID de su cuenta.

-- Recargar la caché de PostgREST tras agregar la función de guardado.
notify pgrst, 'reload schema';
