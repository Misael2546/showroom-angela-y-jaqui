/* Showroom Luxury Secure 4.2 - Supabase Auth + RLS-backed state.
   Nunca incluir claves secret/service_role en el frontend. */
'use strict';
(() => {
  const cfg = window.SHOWROOM_CLOUD || {};
  const base = String(cfg.url || '').replace(/\/$/, '');
  const key = String(cfg.anonKey || '');
  const sessionKey = 'showroom-secure-auth-v42';
  const pendingKey = 'showroom-secure-pending-v42';
  const message = document.getElementById('secureMessage');
  const form = document.getElementById('secureLoginForm');
  let auth = null, revision = 0, ready = false, saving = false, dirty = false, lockedConflict = false, sequence = 0;
  let oldLocal = null, remoteHasData = false;
  const api = window.SecureShowroom = {
    get ready() { return ready; },
    changed() {
      if (!ready || lockedConflict) return;
      sequence++;
      dirty = true;
      localStorage.setItem(pendingKey, '1');
      status('Cambios pendientes · sincronizando…');
      flush();
    }
  };
  function configured() { return /^https:\/\/[a-z\d-]+\.supabase\.co$/i.test(base) && !!key && !/secret|service_role/i.test(key); }
  function showMessage(text, type = '') {
    message.textContent = text;
    message.className = 'secure-message' + (type ? ' ' + type : '');
  }
  function status(text, problem = false) {
    const s = document.getElementById('saveStatus');
    if (s) s.textContent = text;
    const extra = document.getElementById('secureStatus');
    if (extra) { extra.textContent = text; extra.classList.toggle('sync-error', problem); }
  }
  function headers(withAuth = true, json = true) {
    const h = { apikey: key };
    if (json) h['Content-Type'] = 'application/json';
    if (withAuth && auth?.access_token) h.Authorization = 'Bearer ' + auth.access_token;
    return h;
  }
  async function parseResponse(res) {
    if (!res.ok) {
      let e = {};
      try { e = await res.json(); } catch (_) { e.message = await res.text().catch(() => ''); }
      throw new Error(e.msg || e.message || e.error_description || e.error || ('Error HTTP ' + res.status));
    }
    const t = await res.text();
    try { return t ? JSON.parse(t) : null; } catch (_) { return t; }
  }
  async function refreshToken() {
    if (!auth?.refresh_token) throw Error('Tu sesión venció. Iniciá sesión nuevamente.');
    const res = await fetch(base + '/auth/v1/token?grant_type=refresh_token', {
      method: 'POST', headers: headers(false),
      body: JSON.stringify({ refresh_token: auth.refresh_token })
    });
    const next = await parseResponse(res);
    auth = { ...next, expiry: Date.now() + (next.expires_in || 3600) * 1000 };
    sessionStorage.setItem(sessionKey, JSON.stringify(auth));
  }
  async function request(path, options = {}, withAuth = true) {
    if (withAuth && (!auth || !auth.access_token)) throw Error('Sesión no iniciada.');
    if (withAuth && Date.now() > (auth.expiry || 0) - 60000) await refreshToken();
    let res = await fetch(base + path, { ...options, headers: { ...headers(withAuth, !(options.body instanceof Blob)), ...(options.headers || {}) }, cache: 'no-store' });
    if (withAuth && res.status === 401) {
      await refreshToken();
      res = await fetch(base + path, { ...options, headers: { ...headers(true, !(options.body instanceof Blob)), ...(options.headers || {}) }, cache: 'no-store' });
    }
    return parseResponse(res);
  }
  function schemaSafe(value) {
    if (!value || !Array.isArray(value.products) || !Array.isArray(value.sales) || !value.settings) return blankDB();
    return { ...blankDB(), ...value,
      products: value.products.map(x => ({ ...x, audience: productAudience(x) })),
      sales: value.sales, expenses: Array.isArray(value.expenses) ? value.expenses : [],
      reservations: Array.isArray(value.reservations) ? value.reservations : [],
      looks: Array.isArray(value.looks) ? value.looks : [] };
  }
  function countData(data) { return data && ((data.products?.length || 0) || (data.sales?.length || 0) || (data.reservations?.length || 0) || (data.expenses?.length || 0)); }
  async function getLocalWithPhotos() {
    let cached;
    try { cached = JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (_) { return null; }
    if (!cached || !Array.isArray(cached.products)) return null;
    // La versión anterior guardaba fotos en IndexedDB y el inventario aparte.
    if (typeof photoCache === 'object') cached.products.forEach(p => {
      if (!p.image && photoCache[p.id]) p.image = photoCache[p.id];
    });
    return cached;
  }
  async function login(email, password) {
    const res = await fetch(base + '/auth/v1/token?grant_type=password', {
      method: 'POST', headers: headers(false),
      body: JSON.stringify({ email, password })
    });
    const data = await parseResponse(res);
    auth = { ...data, expiry: Date.now() + (data.expires_in || 3600) * 1000 };
    sessionStorage.setItem(sessionKey, JSON.stringify(auth));
    await boot();
  }
  async function boot() {
    const admins = await request('/rest/v1/showroom_admins?select=user_id&limit=1');
    if (!Array.isArray(admins) || admins.length !== 1) {
      auth = null; sessionStorage.removeItem(sessionKey);
      throw Error('Esta cuenta no tiene permiso de administración. Verificá el usuario autorizado en Supabase.');
    }
    const rows = await request('/rest/v1/showroom_state?select=data,revision&id=eq.1');
    if (!Array.isArray(rows) || rows.length !== 1) throw Error('No se encontró la tabla showroom_state o no tenés permiso. Ejecutá el SQL de instalación.');
    oldLocal = await getLocalWithPhotos();
    db = schemaSafe(rows[0].data);
    remoteHasData = Boolean(countData(db));
    revision = Number(rows[0].revision) || 0;
    ready = true;
    document.body.classList.remove('secure-locked');
    document.body.classList.add('secure-ready');
    addTools();
    state.cart = [];
    render();
    status('Conectado · versión segura');
    // Los cambios fallidos se conservaron como copia local; no se descartan silenciosamente.
    if (localStorage.getItem(pendingKey) === '1' && oldLocal && countData(oldLocal)) {
      if (confirm('Hay cambios anteriores pendientes de sincronización en este dispositivo. ¿Querés recuperarlos y enviarlos a la nube? Elegí Cancelar para cargar solamente lo guardado en la nube.')) {
        db = schemaSafe(oldLocal); render(); api.changed();
      } else {
        localStorage.removeItem(pendingKey);
        localStorage.setItem(STORE_KEY, JSON.stringify(db));
      }
    } else if (!remoteHasData && oldLocal && countData(oldLocal)) {
      status('Hay datos anteriores para importar');
      const b = document.getElementById('secureMigrate');
      if (b) b.hidden = false;
    }
  }
  function addTools() {
    if (document.getElementById('secureTools')) return;
    const bar = document.createElement('div');
    bar.id = 'secureTools'; bar.className = 'secure-tools';
    bar.innerHTML = '<span id="secureStatus" title="Estado de la sincronización">● Conectado</span><button type="button" id="secureRetry" title="Reintentar cambios pendientes">↻ Sincronizar</button><button type="button" id="secureMigrate" hidden>⇧ Importar datos anteriores</button><button type="button" id="secureLogout">Cerrar sesión ↗</button>';
    document.querySelector('.topbar').appendChild(bar);
    document.getElementById('secureRetry').addEventListener('click', () => {
      if (lockedConflict) { alert('Hay una modificación más reciente en la nube. Antes de sobrescribirla, descargá una copia local JSON. Después recargá y compará los datos.'); return; }
      dirty = true; flush();
    });
    document.getElementById('secureMigrate').addEventListener('click', async () => {
      if (!oldLocal || !countData(oldLocal)) return;
      if (!confirm('Se va a REEMPLAZAR el inventario en la nube por los datos anteriores de este celular. ¿Ya descargaste una copia JSON y querés continuar?')) return;
      db = schemaSafe(await getLocalWithPhotos()); render();
      api.changed();
      document.getElementById('secureMigrate').hidden = true;
    });
    document.getElementById('secureLogout').addEventListener('click', async () => {
      if ((dirty || saving) && !confirm('Hay cambios sin confirmar en la nube. ¿Cerrar sesión de todos modos?')) return;
      const token = auth?.access_token;
      auth = null; ready = false;
      sessionStorage.removeItem(sessionKey);
      localStorage.removeItem(STORE_KEY);
      localStorage.removeItem(pendingKey);
      try { if (token) await fetch(base + '/auth/v1/logout', { method: 'POST', headers: { apikey: key, Authorization: 'Bearer ' + token } }); } catch (_) {}
      try { idb?.close?.(); indexedDB.deleteDatabase('showroom-photos'); } catch (_) {}
      location.reload();
    });
  }
  function publicSnapshot(dataset) {
    const now = new Date();
    const date = [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
    const held = id => (dataset.reservations || []).filter(r => r.status === 'activa' && r.due >= date && r.productId === id)
      .reduce((sum, r) => sum + (Number(r.qty) || 0), 0);
    const products = (dataset.products || []).filter(p => Number(p.qty || 0) - held(p.id) > 0).map(p => ({
      id: p.id, sku: p.sku, name: p.name, category: p.category, condition: p.condition,
      audience: productAudience(p), size: p.size, color: p.color, price: p.price,
      image: /^https:\/\//i.test(p.image || '') ? p.image : '', lastUpdated: p.updatedAt || p.createdAt
    }));
    const ids = new Set(products.map(p => p.id));
    return { schema: 2, store: String(dataset.settings?.store || 'Angela y Jaqui').slice(0, 60),
      currency: dataset.settings?.currency || 'ARS', whatsapp: String(dataset.settings?.whatsapp || '').replace(/\D/g, '').slice(0, 15),
      exportedAt: new Date().toISOString(), products, looks: (dataset.looks || []).filter(l => (l.products || []).every(pid => ids.has(pid)))
        .map(l => ({ id: l.id, name: l.name, products: l.products, discount: l.discount, note: l.note })) };
  }
  async function uploadImage(data, productId) {
    const blob = await (await fetch(data)).blob();
    const safeId = String(productId).replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 60) || 'prenda';
    const path = 'prendas/' + safeId + '-' + crypto.randomUUID() + '.jpg';
    await request('/storage/v1/object/showroom-prendas/' + path, {
      method: 'POST', body: blob, headers: { 'Content-Type': 'image/jpeg', 'x-upsert': 'false' }
    });
    return base + '/storage/v1/object/public/showroom-prendas/' + path;
  }
  async function flush() {
    if (!ready || saving || !dirty || lockedConflict) return;
    saving = true;
    while (dirty && ready) {
      dirty = false;
      const gen = sequence;
      try {
        const snapshot = JSON.parse(JSON.stringify(db));
        for (const p of snapshot.products) {
          if (typeof p.image === 'string' && p.image.startsWith('data:image/')) {
            const original = p.image;
            p.image = await uploadImage(original, p.id);
            const live = db.products.find(x => x.id === p.id);
            if (live && live.image === original) {
              live.image = p.image;
              // Actualiza la copia en este navegador sin disparar otra sincronización.
              localStorage.setItem(STORE_KEY, JSON.stringify(db));
              if (photosReady) syncPhotos();
            }
          }
        }
        const payload = { p_expected_revision: revision, p_admin_data: snapshot, p_public_data: publicSnapshot(snapshot) };
        const newRev = await request('/rest/v1/rpc/commit_showroom', { method: 'POST', body: JSON.stringify(payload) });
        if (!Number.isSafeInteger(Number(newRev))) throw Error('La base de datos no confirmó la revisión.');
        revision = Number(newRev);
        if (sequence !== gen) dirty = true;
        if (!dirty) {
          localStorage.removeItem(pendingKey);
          status('● Sincronizado en la nube');
        }
      } catch (error) {
        dirty = true;
        const msg = String(error.message || error);
        if (msg.includes('SHOWROOM_VERSION_CONFLICT')) lockedConflict = true;
        status(lockedConflict ? '⚠ Conflicto: guardá copia JSON y revisá' : '⚠ Sin sincronizar · tocá Reintentar', true);
        notify(lockedConflict ? 'Otra sesión cambió el inventario. No se sobrescribió la nube. Descargá un respaldo JSON.' : 'No se pudo guardar en la nube. Tus cambios siguen en este navegador. Reintentá con conexión.');
        break;
      }
    }
    saving = false;
  }
  async function start() {
    if (!configured()) {
      showMessage('Falta configurar cloud-config.js y ejecutar la instalación SQL de Supabase. El panel administrativo permanece bloqueado por seguridad.', 'error');
      form.querySelector('button').disabled = true;
      return;
    }
    const stored = sessionStorage.getItem(sessionKey);
    if (stored) {
      try { auth = JSON.parse(stored); await boot(); return; }
      catch (_) { sessionStorage.removeItem(sessionKey); auth = null; }
    }
    showMessage('Iniciá sesión con la cuenta autorizada en Supabase.');
  }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!configured()) return;
    const button = form.querySelector('button');
    button.disabled = true;
    showMessage('Comprobando cuenta y permisos…');
    try {
      await login(document.getElementById('secureEmail').value.trim(), document.getElementById('securePassword').value);
      document.getElementById('securePassword').value = '';
    } catch (error) {
      showMessage(error.message || 'No se pudo iniciar sesión.', 'error');
    } finally { button.disabled = false; }
  });
  start();
})();
