(function () {
  const root = window.GASHI_ROOT || '../';
  const storeKey = 'gashi_k9_content_v1';
  const clone = (value) => JSON.parse(JSON.stringify(value));
  let data = load();
  let active = 'brand';
  const rootEl = document.getElementById('dashboard-root');
  const asset = (src) => !src ? '' : (/^(data:|https?:|mailto:|tel:|#)/.test(src) ? src : root + src);
  const sections = [
    ['brand', 'Brand'],
    ['home', 'Home'],
    ['about', 'Who We Are'],
    ['dogs', 'Our Dogs'],
    ['sale', 'Available Adults'],
    ['litters', 'Expecting Litters'],
    ['puppies', 'Puppies'],
    ['clients', 'Our Clients'],
    ['contact', 'Get In Touch']
  ];

  function load() {
    const saved = localStorage.getItem(storeKey);
    return saved ? JSON.parse(saved) : clone(window.GASHI_DEFAULT_CONTENT);
  }

  function save() {
    localStorage.setItem(storeKey, JSON.stringify(data));
    render();
  }

  function reset() {
    if (!confirm('Reset dashboard content back to the original site content?')) return;
    localStorage.removeItem(storeKey);
    data = clone(window.GASHI_DEFAULT_CONTENT);
    render();
  }

  function field(label, path, type = 'text') {
    const value = get(path);
    const tag = type === 'textarea' ? 'textarea' : 'input';
    const attrs = tag === 'input' ? `type="${type}" value="${escapeAttr(value)}"` : '';
    return `<div class="field"><label>${label}</label><${tag} data-path="${path}" ${attrs}>${tag === 'textarea' ? escapeHtml(value) : ''}</${tag}></div>`;
  }

  function imageField(label, path) {
    const value = get(path);
    const options = data.imageLibrary.map((src) => `<option value="${escapeAttr(src)}" ${src === value ? 'selected' : ''}>${src.split('/').pop()}</option>`).join('');
    return `<div class="field image-field" data-image-path="${path}">
      <label>${label}</label>
      <select data-path="${path}"><option value="${escapeAttr(value)}">Current image</option>${options}</select>
      <div class="drop" data-drop="${path}">Drop image here or click to upload<input type="file" accept="image/*" hidden></div>
      <img class="preview" src="${asset(value)}" alt="">
      <p class="help">Uploaded images are stored in this browser for preview. Use Export JSON to keep a backup.</p>
    </div>`;
  }

  function listEditor(sectionKey, fields) {
    const section = data[sectionKey];
    return `<div class="edit-card full">
      <h2>${escapeHtml(section.title)}</h2>
      <div class="dash-grid">
        ${field('Page title', `${sectionKey}.title`)}
        ${field('Subtitle', `${sectionKey}.subtitle`)}
        ${field('Intro text', `${sectionKey}.intro`, 'textarea')}
      </div>
      <div class="edit-list">
        ${(section.items || []).map((item, index) => itemEditor(sectionKey, index, fields)).join('')}
      </div>
      <p><button class="btn" data-add="${sectionKey}">Add New</button></p>
    </div>`;
  }

  function itemEditor(sectionKey, index, fields) {
    const base = `${sectionKey}.items.${index}`;
    return `<div class="item-editor" draggable="true" data-item="${sectionKey}:${index}">
      <div class="dash-grid">
        ${fields.map(([label, key, type]) => key === 'image' ? imageField(label, `${base}.${key}`) : field(label, `${base}.${key}`, type || 'text')).join('')}
      </div>
      <div class="item-actions">
        <button class="btn light" data-up="${sectionKey}:${index}">Move Up</button>
        <button class="btn light" data-down="${sectionKey}:${index}">Move Down</button>
        <button class="btn dark" data-remove="${sectionKey}:${index}">Remove</button>
      </div>
    </div>`;
  }

  function renderPanel() {
    if (active === 'brand') {
      return `<div class="dash-grid">
        <div class="edit-card">${field('Brand name', 'brand.name')}${field('Brand suffix', 'brand.suffix')}${field('Phone', 'brand.phone')}${field('Email', 'brand.email')}${field('Location', 'brand.location')}${field('WhatsApp link', 'brand.whatsapp')}${field('Instagram link', 'brand.instagram')}</div>
        <div class="edit-card">${imageField('Logo', 'brand.logo')}</div>
      </div>`;
    }
    if (active === 'home') {
      return `<div class="dash-grid">
        <div class="edit-card">${field('Headline', 'home.headline')}${field('Intro', 'home.intro', 'textarea')}${field('Feature title', 'home.featureTitle')}${field('Feature text', 'home.featureText', 'textarea')}</div>
        <div class="edit-card">${imageField('Hero image', 'home.image')}${statFields()}</div>
      </div>`;
    }
    if (active === 'about') {
      return `<div class="dash-grid">
        <div class="edit-card">${field('Title', 'about.title')}${field('Subtitle', 'about.subtitle')}${field('Text', 'about.text', 'textarea')}${pointsEditor()}</div>
        <div class="edit-card">${imageField('Page image', 'about.image')}</div>
      </div>`;
    }
    if (active === 'contact') {
      return `<div class="dash-grid">
        <div class="edit-card">${field('Title', 'contact.title')}${field('Subtitle', 'contact.subtitle')}${field('Text', 'contact.text', 'textarea')}</div>
        <div class="edit-card">${imageField('Contact image', 'contact.image')}</div>
      </div>`;
    }
    const fieldMap = {
      dogs: [['Name', 'name'], ['Label', 'tag'], ['Image', 'image'], ['Description', 'description', 'textarea']],
      sale: [['Name', 'name'], ['Status', 'status'], ['Image', 'image'], ['Description', 'description', 'textarea']],
      litters: [['Name', 'name'], ['Date or status', 'date'], ['Image', 'image'], ['Description', 'description', 'textarea']],
      puppies: [['Name', 'name'], ['Status', 'status'], ['Image', 'image'], ['Description', 'description', 'textarea']],
      clients: [['Name', 'name'], ['Location', 'location'], ['Image', 'image'], ['Description', 'description', 'textarea']]
    };
    return listEditor(active, fieldMap[active]);
  }

  function statFields() {
    return `<h3>Stats</h3>${data.home.stats.map((_, i) => `<div class="dash-grid">${field('Number', `home.stats.${i}.0`)}${field('Label', `home.stats.${i}.1`)}</div>`).join('')}`;
  }

  function pointsEditor() {
    return `<h3>About points</h3>${data.about.points.map((_, i) => `<div class="field"><label>Point ${i + 1}</label><input data-path="about.points.${i}" value="${escapeAttr(data.about.points[i])}"></div>`).join('')}`;
  }

  function render() {
    rootEl.innerHTML = `<div class="dashboard">
      <aside class="dash-side">
        <h1>Gashi K9 Dashboard</h1>
        <p class="help">Edit the site, add images, reorder cards, then preview the public pages.</p>
        <div class="dash-nav">${sections.map(([key, label]) => `<button class="${key === active ? 'active' : ''}" data-tab="${key}">${label}</button>`).join('')}</div>
      </aside>
      <main class="dash-main">
        <div class="dash-top">
          <div><p class="eyebrow">Site editor</p><h2>${sections.find(([key]) => key === active)[1]}</h2></div>
          <div class="item-actions">
            <a class="btn light" href="${root}index.html">Preview Site</a>
            <button class="btn light" data-export>Export JSON</button>
            <button class="btn light" data-import>Import JSON</button>
            <button class="btn dark" data-reset>Reset</button>
          </div>
        </div>
        <p class="notice">This static dashboard saves edits in the browser and the public pages read them instantly on this same browser. For live multi-user editing on Netlify, connect this content to Netlify CMS/Git later.</p>
        ${renderPanel()}
      </main>
    </div>`;
    bind();
  }

  function bind() {
    rootEl.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => { active = button.dataset.tab; render(); }));
    rootEl.querySelectorAll('[data-path]').forEach((input) => input.addEventListener('input', () => { set(input.dataset.path, input.value); localStorage.setItem(storeKey, JSON.stringify(data)); updatePreviews(input.dataset.path, input.value); }));
    rootEl.querySelectorAll('[data-add]').forEach((button) => button.addEventListener('click', () => addItem(button.dataset.add)));
    rootEl.querySelectorAll('[data-remove]').forEach((button) => button.addEventListener('click', () => removeItem(button.dataset.remove)));
    rootEl.querySelectorAll('[data-up]').forEach((button) => button.addEventListener('click', () => moveItem(button.dataset.up, -1)));
    rootEl.querySelectorAll('[data-down]').forEach((button) => button.addEventListener('click', () => moveItem(button.dataset.down, 1)));
    rootEl.querySelector('[data-reset]')?.addEventListener('click', reset);
    rootEl.querySelector('[data-export]')?.addEventListener('click', exportJson);
    rootEl.querySelector('[data-import]')?.addEventListener('click', importJson);
    bindDrops();
  }

  function bindDrops() {
    rootEl.querySelectorAll('[data-drop]').forEach((drop) => {
      const input = drop.querySelector('input');
      drop.addEventListener('click', () => input.click());
      drop.addEventListener('dragover', (event) => { event.preventDefault(); drop.classList.add('drag'); });
      drop.addEventListener('dragleave', () => drop.classList.remove('drag'));
      drop.addEventListener('drop', (event) => {
        event.preventDefault();
        drop.classList.remove('drag');
        readImage(event.dataTransfer.files[0], drop.dataset.drop);
      });
      input.addEventListener('change', () => readImage(input.files[0], drop.dataset.drop));
    });
  }

  function readImage(file, path) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      set(path, reader.result);
      if (!data.imageLibrary.includes(reader.result)) data.imageLibrary.unshift(reader.result);
      save();
    };
    reader.readAsDataURL(file);
  }

  function addItem(key) {
    const first = data[key].items[0] || {};
    data[key].items.push({ ...clone(first), name: 'New item', description: 'Write description here.' });
    save();
  }

  function removeItem(token) {
    const [key, index] = token.split(':');
    data[key].items.splice(Number(index), 1);
    save();
  }

  function moveItem(token, direction) {
    const [key, indexText] = token.split(':');
    const index = Number(indexText);
    const next = index + direction;
    if (next < 0 || next >= data[key].items.length) return;
    const [item] = data[key].items.splice(index, 1);
    data[key].items.splice(next, 0, item);
    save();
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'gashi-k9-content.json';
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function importJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        data = JSON.parse(reader.result);
        localStorage.setItem(storeKey, JSON.stringify(data));
        render();
      };
      reader.readAsText(file);
    });
    input.click();
  }

  function get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], data) ?? '';
  }

  function set(path, value) {
    const parts = path.split('.');
    let obj = data;
    while (parts.length > 1) obj = obj[parts.shift()];
    obj[parts[0]] = value;
  }

  function updatePreviews(path, value) {
    rootEl.querySelectorAll(`[data-image-path="${CSS.escape(path)}"] .preview`).forEach((img) => { img.src = asset(value); });
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]));
  }

  function escapeAttr(value) {
    return escapeHtml(value).replaceAll('\n', '&#10;');
  }

  render();
})();
