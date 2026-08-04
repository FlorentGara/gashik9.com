
/**
 * Gashi-k9 CMS Engine
 * Reads saved content from localStorage and injects it into pages.
 * Works on all pages automatically.
 */
(function() {
  var CMS_KEY = 'gashi_cms_content';

  function getContent() {
    try { return JSON.parse(localStorage.getItem(CMS_KEY)) || {}; } catch(e) { return {}; }
  }

  function applyContent() {
    var data = getContent();
    Object.keys(data).forEach(function(key) {
      var els = document.querySelectorAll('[data-cms="' + key + '"]');
      els.forEach(function(el) {
        if (el.tagName === 'IMG') { el.src = data[key]; }
        else if (el.tagName === 'A' && key.includes('_url')) { el.href = data[key]; }
        else { el.innerHTML = data[key]; }
      });
    });
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyContent);
  } else {
    applyContent();
  }

  // Expose globally for dashboard use
  window.GashiCMS = {
    get: getContent,
    set: function(key, value) {
      var data = getContent();
      data[key] = value;
      localStorage.setItem(CMS_KEY, JSON.stringify(data));
    },
    save: function(allData) {
      localStorage.setItem(CMS_KEY, JSON.stringify(allData));
    },
    reset: function() { localStorage.removeItem(CMS_KEY); }
  };
})();
