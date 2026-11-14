/* Showroom Angela y Jaqui · detalle público de prenda, Secure 4.2.6
   Mejora exclusivamente de interfaz. No modifica datos, RLS, usuarios ni el almacenamiento.
   Usa la información pública que catalogo.js ya recibió de showroom_catalog.
*/
(() => {
  'use strict';
  const grid = document.getElementById('catProducts');
  if (!grid) return;

  const markup = `
    <dialog class="aj-detail-dialog" id="ajProductDetail" aria-labelledby="ajDetailTitle" aria-describedby="ajDetailDescription">
      <div class="aj-detail-layout">
        <div class="aj-detail-media">
          <button type="button" class="aj-detail-image-action" id="ajDetailImageAction" aria-label="Ampliar fotografía de la prenda">
            <img id="ajDetailImage" alt="" />
            <span class="aj-detail-noimage" id="ajDetailNoImage" hidden>🦋<small>Fotografía no disponible</small></span>
            <span class="aj-detail-expand" id="ajDetailExpand"><span aria-hidden="true">⤢</span> Ampliar foto</span>
          </button>
          <span class="aj-detail-photo-counter" id="ajDetailPhotoCount" hidden></span>
          <div class="aj-detail-thumbs" id="ajDetailThumbs" aria-label="Fotografías de la prenda" hidden></div>
          <a class="aj-detail-whatsapp" id="ajDetailWhatsApp" target="_blank" rel="noopener noreferrer" href="#catalogo">Consulta por WhatsApp</a>
        </div>
        <div class="aj-detail-info">
          <button type="button" class="aj-detail-close" id="ajDetailClose" aria-label="Cerrar detalle de prenda">✕</button>
          <p class="aj-detail-eyebrow">SHOWROOM ANGELA Y JAQUI · DETALLES</p>
          <span class="aj-detail-condition" id="ajDetailCondition"></span>
          <h2 class="aj-detail-title" id="ajDetailTitle"></h2>
          <p class="aj-detail-meta" id="ajDetailMeta"></p>
          <p class="aj-detail-price" id="ajDetailPrice"></p>
          <div class="aj-detail-rule"></div>
          <h3 class="aj-detail-section-heading">Descripción</h3>
          <p class="aj-detail-description" id="ajDetailDescription"></p>
          <dl class="aj-detail-fields" id="ajDetailFields"></dl>
          <p class="aj-detail-code" id="ajDetailCode"></p>
          <p class="aj-detail-fineprint">El precio y la disponibilidad se confirman al consultar.</p>
        </div>
      </div>
    </dialog>
    <dialog class="aj-detail-photo-dialog" id="ajPhotoViewer" aria-label="Fotografía ampliada de la prenda">
      <button type="button" id="ajPhotoClose" class="aj-detail-photo-close" aria-label="Cerrar foto ampliada">✕</button>
      <img id="ajPhotoLarge" alt="" />
      <span id="ajPhotoLabel" class="aj-detail-photo-label"></span>
    </dialog>`;
  document.body.insertAdjacentHTML('beforeend', markup);

  const $ = id => document.getElementById(id);
  const detail = $('ajProductDetail'), photo = $('ajPhotoViewer');
  const image = $('ajDetailImage'), bigImage = $('ajPhotoLarge');
  const thumbs = $('ajDetailThumbs');
  let currentProduct = null;
  let gallery = [], photoIndex = 0;
  let lastFocus = null;

  const titleSafe = value => String(value ?? '').trim();
  function validImage(value) {
    return typeof value === 'string' && /^(https:\/\/|data:image\/(?:jpeg|jpg|png|webp|gif);base64,)/i.test(value.trim()) ? value.trim() : '';
  }
  function availableProducts() {
    try { return typeof catData !== 'undefined' && Array.isArray(catData.products) ? catData.products : []; }
    catch (_) { return []; }
  }
  function currentSelection(card) {
    const items = availableProducts();
    if (!items.length) return null;
    // Preferimos el enlace existente (incluye el SKU único) para resolver la prenda
    // incluso si en el futuro cambia el orden de visualización de las tarjetas.
    const anchor = card.querySelector('a.cat-button[href]');
    const targetHref = anchor?.getAttribute('href');
    if (targetHref && typeof productLink === 'function') {
      const found = items.find(p => productLink(p) === targetHref);
      if (found) return found;
    }
    // Compatibilidad con el catálogo Secure 4.2 y sus filtros actuales.
    const q = String($('catSearch')?.value || '').toLocaleLowerCase('es-AR').trim();
    const cat = $('catCategory')?.value || 'Todas';
    const cond = $('catCondition')?.value || 'Todas';
    const audience = $('catAudience')?.value || 'Todas';
    const audienceValue = p => ['Mujer','Hombre','Niño','Niña','Unisex'].includes(p?.audience) ? p.audience : 'Sin especificar';
    const filtered = items.filter(p =>
      (cat === 'Todas' || p.category === cat) &&
      (cond === 'Todas' || p.condition === cond) &&
      (audience === 'Todas' || audienceValue(p) === audience) &&
      [p.name,p.size,p.color,p.sku,p.category,audienceValue(p)].some(v => String(v || '').toLocaleLowerCase('es-AR').includes(q))
    );
    const position = [...grid.querySelectorAll('.cat-card')].indexOf(card);
    return filtered[position] || null;
  }
  function addField(label, value) {
    if (!titleSafe(value)) return;
    const dt = document.createElement('dt'); dt.textContent = label;
    const dd = document.createElement('dd'); dd.textContent = titleSafe(value);
    $('ajDetailFields').append(dt, dd);
  }
  function setPhoto(index) {
    photoIndex = index;
    const url = gallery[index];
    image.hidden = !url;
    $('ajDetailNoImage').hidden = !!url;
    $('ajDetailExpand').hidden = !url;
    $('ajDetailImageAction').disabled = !url;
    if (url) {image.src = url; image.alt = 'Fotografía de ' + titleSafe(currentProduct?.name);}
    else image.removeAttribute('src');
    $('ajDetailPhotoCount').hidden = gallery.length < 2;
    $('ajDetailPhotoCount').textContent = `${index + 1} de ${gallery.length}`;
    thumbs.querySelectorAll('button').forEach((b, i) => {b.setAttribute('aria-pressed', String(i === index));});
  }
  function openProduct(p, card) {
    if (!p || !detail || !detail.showModal) return;
    currentProduct = p;
    lastFocus = document.activeElement;
    $('ajDetailTitle').textContent = titleSafe(p.name) || 'Prenda del showroom';
    $('ajDetailCondition').textContent = titleSafe(p.condition) || 'Prenda disponible';
    $('ajDetailMeta').textContent = [p.category, p.audience && p.audience !== 'Sin especificar' ? p.audience : null].filter(Boolean).join(' · ');
    $('ajDetailPrice').textContent = typeof cash === 'function' ? cash(p.price) : '$ ' + (Number(p.price) || 0).toLocaleString('es-AR');
    $('ajDetailCode').textContent = p.sku ? 'Código: ' + titleSafe(p.sku) : '';
    const description = titleSafe(p.publicDescription || p.description);
    const details = [p.category ? 'Categoría: ' + p.category : '', p.condition ? 'Estado: ' + p.condition.toLocaleLowerCase('es-AR') : '', p.audience && p.audience !== 'Sin especificar' ? 'Para: ' + p.audience : '', p.size ? 'Talle ' + p.size : '', p.color ? 'Color ' + p.color : ''].filter(Boolean);
    $('ajDetailDescription').textContent = description || (details.length ? details.join(' · ') + '. Consultá por WhatsApp para conocer más detalles y confirmar disponibilidad.' : 'Consultá por WhatsApp para conocer más detalles y confirmar disponibilidad.');
    $('ajDetailFields').replaceChildren();
    addField('Categoría', p.category);
    addField('Estado', p.condition);
    if (p.audience && p.audience !== 'Sin especificar') addField('Sección', p.audience);
    addField('Talle', p.size);
    addField('Color', p.color);

    const existingLink = card?.querySelector('a.cat-button[href]');
    const link = existingLink?.href || (typeof productLink === 'function' ? productLink(p) : '#catalogo');
    $('ajDetailWhatsApp').href = link;
    gallery = [p.image, ...(Array.isArray(p.images) ? p.images : [])].map(x => typeof x === 'string' ? x : x?.url).map(validImage).filter((x, i, a) => !!x && a.indexOf(x) === i);
    thumbs.replaceChildren();
    gallery.forEach((src, i) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'aj-detail-thumb';
      b.setAttribute('aria-label', `Ver fotografía ${i + 1}`);
      const img = document.createElement('img'); img.src = src; img.alt = ''; img.loading = 'lazy';
      b.appendChild(img); b.addEventListener('click', () => setPhoto(i)); thumbs.appendChild(b);
    });
    thumbs.hidden = gallery.length < 2;
    setPhoto(0);
    detail.showModal();
    $('ajDetailClose').focus();
  }
  function closeProduct() { if (photo.open) photo.close(); if (detail.open) detail.close(); }
  grid.addEventListener('click', e => {
    if (e.target.closest('a,button,input,select,textarea')) return; // WhatsApp sigue siendo directo.
    const card = e.target.closest('.cat-card');
    if (!card || !grid.contains(card)) return;
    openProduct(currentSelection(card), card);
  });
  grid.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const hit = e.target.closest('.cat-photo[role="button"]');
    if (!hit || !grid.contains(hit)) return;
    e.preventDefault();
    const card = hit.closest('.cat-card');
    openProduct(currentSelection(card), card);
  });
  function markCards() {
    grid.querySelectorAll('.cat-card .cat-photo').forEach(el => {
      if (el.hasAttribute('tabindex')) return;
      el.setAttribute('role','button'); el.tabIndex = 0;
      const productName = el.closest('.cat-card')?.querySelector('h3')?.textContent || 'prenda';
      el.setAttribute('aria-label','Ver foto ampliada y detalles de ' + productName);
      el.setAttribute('title','Ver foto y detalles');
    });
  }
  new MutationObserver(markCards).observe(grid, {childList:true,subtree:false});
  markCards();
  $('ajDetailClose').addEventListener('click', closeProduct);
  detail.addEventListener('close', () => {lastFocus?.focus?.();});
  detail.addEventListener('click', e => {if (e.target === detail) closeProduct();});
  $('ajDetailImageAction').addEventListener('click', () => {
    if (!gallery[photoIndex]) return;
    bigImage.src = gallery[photoIndex];
    bigImage.alt = 'Fotografía ampliada de ' + titleSafe(currentProduct?.name);
    $('ajPhotoLabel').textContent = titleSafe(currentProduct?.name) + (gallery.length > 1 ? ` · ${photoIndex + 1} de ${gallery.length}` : '');
    photo.showModal();
    $('ajPhotoClose').focus();
  });
  $('ajPhotoClose').addEventListener('click', () => photo.close());
  photo.addEventListener('click', e => {if (e.target === photo) photo.close();});
  photo.addEventListener('close', () => $('ajDetailImageAction').focus());
})();
