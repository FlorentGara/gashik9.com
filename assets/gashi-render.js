(function() {
  const storeKey = 'gashi_k9_content_v1';
  let data = null;

  try {
    const saved = localStorage.getItem(storeKey);
    data = saved ? JSON.parse(saved) : window.GASHI_DEFAULT_CONTENT;
  } catch (e) {
    data = window.GASHI_DEFAULT_CONTENT;
  }

  if (!data) return;

  function asset(src) {
    if (!src) return '';
    if (/^(http|data:|#)/.test(src)) return src;
    
    // Determine depth based on current path
    const depth = window.location.pathname.split('/').length - 2; // naive approach
    const prefix = depth > 0 && !window.location.pathname.endsWith('index.html') && !window.location.pathname.endsWith('/') 
      ? '../'.repeat(depth) 
      : (window.location.pathname.includes('/') && window.location.pathname.split('/').pop() !== 'index.html' && window.location.pathname.split('/').length > 2 ? '../' : '');
      
    // A safer way since most pages are exactly 1 folder deep (e.g. /puppies/index.html)
    // If we are at root index.html, prefix is ''
    const isRoot = window.location.pathname.endsWith('/netlify-site/') || window.location.pathname.endsWith('index.html') && window.location.pathname.split('/').slice(-2)[0] === 'netlify-site';
    const pfx = isRoot ? '' : '../';
    
    return pfx + src;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // 1. Inject Settings Icon
    const nav = document.querySelector('.nav');
    const uicoreMenus = document.querySelectorAll('.uicore-menu'); // For the homepage Elementor header
    
    const isRoot = window.location.pathname.endsWith('/netlify-site/') || (window.location.pathname.endsWith('index.html') && window.location.pathname.split('/').slice(-2)[0] === 'netlify-site');
    const dashUrl = isRoot ? 'dashboard/index.html' : '../dashboard/index.html';
    
    if (nav) {
      const iconHTML = `
        <a href="${dashUrl}" class="admin-icon" title="Dashboard" style="">
          <svg viewBox="0 0 24 24"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path></svg>
        </a>
        <style>@media(max-width:1120px){.admin-icon{display:none!important;}}</style>
      `;
      nav.insertAdjacentHTML('beforeend', iconHTML);
    } else if (uicoreMenus.length > 0) {
      // If we are on the homepage, inject it into all Elementor menu ULs as a list item
      const iconHTML = `
        <li class="menu-item" style="display: flex; align-items: center;">
          <a href="${dashUrl}" title="Dashboard" style="display:flex; align-items:center; padding: 0 15px; opacity: 1; transform: translateY(2px);">
            <svg viewBox="0 0 24 24" style="width: 22px; height: 22px; fill: #f37423;"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.06-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.73,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.06,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.43-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.49-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"></path></svg>
          </a>
        </li>
      `;
      uicoreMenus.forEach(menu => menu.insertAdjacentHTML('beforeend', iconHTML));
    }

    // 2. Inject Social Footer
    const elementorFooter = document.getElementById('uicore-tb-footer');
    if (elementorFooter) {
      const ig = data.brand?.instagram || '#';
      const wa = data.brand?.whatsapp || '#';
      const socialHTML = `
        <div class="footer-socials" style="position: absolute; bottom: 30px; right: 30px; z-index: 50;">
          <a href="${wa}" target="_blank" title="WhatsApp"><svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>
          <a href="${ig}" target="_blank" title="Instagram"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
        </div>
      `;
      elementorFooter.style.position = 'relative'; // Ensure absolute positioning context
      elementorFooter.insertAdjacentHTML('beforeend', socialHTML);
    }

    // 3. Render page specific content
    const pageId = document.body.dataset.page;
    if (!pageId) return;

    if (['puppies', 'dogs-for-sale', 'services', 'expecting-dogs'].includes(pageId)) {
      const grid = document.querySelector('.dogs-grid');
      if (!grid) return;
      
      const categoryMap = {
        'puppies': 'puppies',
        'dogs-for-sale': 'sale',
        'services': 'dogs',
        'expecting-dogs': 'litters'
      };
      
      const key = categoryMap[pageId];
      if (data[key] && data[key].items) {
        grid.innerHTML = data[key].items.map(item => {
          const badge = item.status || item.date || item.tag;
          const badgeClass = badge?.toLowerCase().includes('reserved') || badge?.toLowerCase().includes('sold') ? 'reserved' : 'available';
          return `
            <div class="dog-card">
              <img src="${asset(item.image)}" alt="${item.name}">
              <div class="dog-info">
                <h3>${item.name}</h3>
                <span class="status ${badgeClass}">${badge}</span>
                <p style="margin-top:10px">${item.description}</p>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  });
})();
