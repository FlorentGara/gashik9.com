(function () {
  const root = window.GASHI_ROOT || './';
  const page = window.GASHI_PAGE || 'home';
  const storeKey = 'gashi_k9_content_v1';
  const saved = localStorage.getItem(storeKey);
  const content = saved ? JSON.parse(saved) : window.GASHI_DEFAULT_CONTENT;
  const $ = (value) => value == null ? '' : String(value);
  const asset = (src) => !src ? '' : (/^(data:|https?:|mailto:|tel:|#)/.test(src) ? src : root + src);
  const route = (href) => root + href;
  const nav = content.nav.map(([label, href]) => {
    const active = (page === 'home' && href === 'index.html') || location.pathname.replaceAll('\\', '/').includes(href.replace('/index.html', ''));
    return `<a class="${active ? 'active' : ''}" href="${route(href)}">${$(label)}</a>`;
  }).join('');

  function header() {
    return `<header class="topbar">
      <div class="shell nav">
        <a class="brand" href="${route('index.html')}">
          <img class="brand-logo" src="${asset(content.brand.logo)}" alt="${$(content.brand.name)} logo">
          <span class="brand-mark"><span>${$(content.brand.name)}</span><span>${$(content.brand.suffix)}</span></span>
        </a>
        <nav class="menu" id="menu">${nav}</nav>
        <div class="nav-actions">
          <a class="pill ghost" href="${route('get-in-touch/index.html')}">Contact</a>
          <button class="mobile-toggle" id="menu-toggle" aria-label="Open menu">+</button>
        </div>
      </div>
    </header>`;
  }

  function footer() {
    return `<footer class="footer">
      <div class="shell footer-grid">
        <div>
          <strong>${$(content.brand.name)} ${$(content.brand.suffix)}</strong><br>
          <span>${$(content.brand.location)} | ${$(content.brand.phone)} | ${$(content.brand.email)}</span>
        </div>
        <a class="dashboard-link" href="${route('dashboard/index.html')}">Dashboard</a>
      </div>
    </footer>`;
  }

  function pageHero(section) {
    return `<section class="page-hero">
      <div class="shell">
        <p class="eyebrow">${$(content.brand.location)}</p>
        <h1>${$(section.title)}</h1>
        <p class="lead">${$(section.subtitle || section.intro || section.text)}</p>
      </div>
    </section>`;
  }

  function card(item, variant = 'tag') {
    const label = item.tag || item.status || item.date || item.location || 'Gashi K9';
    return `<article class="card">
      <img class="card-img" src="${asset(item.image)}" alt="${$(item.name)}">
      <div class="card-body">
        <span class="tag">${$(label)}</span>
        <h3>${$(item.name)}</h3>
        <p>${$(item.description)}</p>
      </div>
    </article>`;
  }

  function collection(section, kind = 'cards') {
    const items = section.items || [];
    if (kind === 'gallery') {
      return `${pageHero(section)}<section class="section"><div class="shell">
        <div class="section-head"><h2 class="section-title">Placed with care</h2><p class="section-copy">${$(section.intro)}</p></div>
        <div class="gallery">${items.map((item) => `<article class="gallery-card">
          <img src="${asset(item.image)}" alt="${$(item.name)}">
          <div><h3>${$(item.name)}</h3><p>${$(item.location)} - ${$(item.description)}</p></div>
        </article>`).join('')}</div>
      </div></section>`;
    }
    return `${pageHero(section)}<section class="section"><div class="shell">
      <div class="section-head"><h2 class="section-title">${kind === 'four' ? 'Kennel dogs' : 'Current list'}</h2><p class="section-copy">${$(section.intro)}</p></div>
      <div class="cards ${kind === 'four' ? 'four' : ''}">${items.map(card).join('')}</div>
    </div></section>${ctaBand()}`;
  }

  function ctaBand() {
    return `<section class="section soft"><div class="shell split">
      <div><h2 class="section-title">Ready to talk?</h2><p class="section-copy">Tell us your goal and we will guide you toward the right dog, litter, or waitlist option.</p></div>
      <div><a class="pill" href="${route('get-in-touch/index.html')}">Contact Gashi-k9</a></div>
    </div></section>`;
  }

  function home() {
    const h = content.home;
    return `<section class="hero">
      <div class="shell hero-grid">
        <div>
          <p class="eyebrow">${$(content.brand.location)}</p>
          <h1>${$(h.headline).replace('Gashi-k9', '<span class="accent">Gashi-k9</span>')}</h1>
          <p class="lead">${$(h.intro)}</p>
          <p><a class="pill" href="${route('services/index.html')}">Meet Available Adults</a></p>
        </div>
        <div class="hero-media"><span class="ring"></span><img class="hero-img" src="${asset(h.image)}" alt="Gashi-k9 working dog"></div>
      </div>
      <div class="shell stats-band">${(h.stats || []).map(([num, label]) => `<div class="stat"><strong>${$(num)}</strong><span>${$(label)}</span></div>`).join('')}</div>
    </section>
    <section class="section">
      <div class="shell split">
        <img class="portrait" src="${asset(content.about.image)}" alt="Gashi-k9 kennel">
        <div class="panel">
          <p class="eyebrow">About the kennel</p>
          <h2 class="section-title">${$(h.featureTitle)}</h2>
          <p class="section-copy">${$(h.featureText)}</p>
          <ul class="checklist">${content.about.points.map((point) => `<li>${$(point)}</li>`).join('')}</ul>
        </div>
      </div>
    </section>
    <section class="section soft"><div class="shell">
      <div class="section-head"><h2 class="section-title">Featured dogs</h2><p class="section-copy">${$(content.dogs.intro)}</p></div>
      <div class="cards four">${content.dogs.items.slice(0, 4).map(card).join('')}</div>
    </div></section>`;
  }

  function about() {
    const a = content.about;
    return `${pageHero(a)}<section class="section"><div class="shell split">
      <img class="portrait" src="${asset(a.image)}" alt="${$(a.title)}">
      <div class="panel"><h2 class="section-title">${$(a.subtitle)}</h2><p>${$(a.text)}</p>
      <ul class="checklist">${a.points.map((point) => `<li>${$(point)}</li>`).join('')}</ul></div>
    </div></section>${ctaBand()}`;
  }

  function contact() {
    const c = content.contact;
    return `${pageHero(c)}<section class="section"><div class="shell contact-grid">
      <div class="contact-card">
        <div><p class="eyebrow">Direct contact</p><h2 class="section-title">Let's find the right match.</h2><p>${$(c.text)}</p></div>
        <div>
          <p><strong>Phone:</strong> ${$(content.brand.phone)}</p>
          <p><strong>Email:</strong> ${$(content.brand.email)}</p>
          <p><strong>Location:</strong> ${$(content.brand.location)}</p>
          <a class="pill" href="${asset(content.brand.whatsapp)}">WhatsApp</a>
        </div>
      </div>
      <form class="contact-form" method="POST" name="contact" data-netlify="true" action="${route('thank-you/index.html')}">
        <input type="hidden" name="form-name" value="contact">
        <div class="field"><label>Name</label><input name="name" required></div>
        <div class="field"><label>Email</label><input type="email" name="email" required></div>
        <div class="field"><label>What are you looking for?</label><select name="interest"><option>Working dog</option><option>Dog for sale</option><option>Puppy</option><option>Future litter</option></select></div>
        <div class="field"><label>Message</label><textarea name="message" required></textarea></div>
        <button class="btn" type="submit">Send Message</button>
      </form>
    </div></section>`;
  }

  function thanks() {
    return `<section class="thanks shell"><div><p class="eyebrow">Message sent</p><h1>Thank you</h1><p class="lead">We received your message and will get back to you soon.</p><p><a class="pill" href="${route('index.html')}">Back Home</a></p></div></section>`;
  }

  const views = {
    home,
    about,
    dogs: () => collection(content.dogs, 'four'),
    sale: () => collection(content.sale),
    litters: () => collection(content.litters),
    puppies: () => collection(content.puppies),
    clients: () => collection(content.clients, 'gallery'),
    contact,
    thanks
  };

  document.getElementById('site-root').innerHTML = `<div class="site">${header()}<main>${(views[page] || home)()}</main>${footer()}</div>`;
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('menu');
  toggle && toggle.addEventListener('click', () => menu.classList.toggle('open'));
})();
