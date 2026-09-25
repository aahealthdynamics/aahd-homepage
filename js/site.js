// ==================== Africa Asia Health Dynamics Limited — site.js ====================
// Navigation, hero slider, scroll reveal, language switching (EN / JA / FR),
// microCMS news (Kenya API with Japan fallback) and the contact form.
// Requires js/i18n.js and js/cms-config.js to be loaded first.
// Exposes window.AAHD for news.html (list + article page).

(function () {
  'use strict';

  // Canonical host: send visitors on the old Render URL to the production domain.
  const PRODUCTION_HOST = 'ke.aa-healthdynamics.com';
  if (/\.onrender\.com$/i.test(location.hostname)) {
    location.replace(`https://${PRODUCTION_HOST}${location.pathname}${location.search}${location.hash}`);
    return;
  }

  const STORAGE_KEY = 'aahd-ke-lang';
  const SUPPORTED = ['en', 'ja', 'fr'];
  let currentLang = 'en';
  let cmsItems = null;
  let newsSource = null; // 'ke' | 'jp' | null (static fallback)
  const langListeners = [];

  // ---------- Language ----------
  function detectLang() {
    const param = new URLSearchParams(location.search).get('lang');
    if (SUPPORTED.includes(param)) return param;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.includes(stored)) return stored;
    } catch (e) { /* storage unavailable */ }
    return 'en'; // English is the default; JA / FR only when chosen via the switch or ?lang=
  }

  function applyLang(lang) {
    if (!SUPPORTED.includes(lang)) lang = 'en';
    currentLang = lang;
    const t = I18N[lang];

    document.documentElement.lang = lang;
    const pageTitleKey = document.body.dataset.titleKey || 'meta_title';
    document.title = t[pageTitleKey] || t.meta_title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = t.meta_desc;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = t.meta_title;
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = t.meta_desc;

    document.querySelectorAll('[data-i18n]').forEach(el => {
      const v = t[el.dataset.i18n];
      if (typeof v === 'string') el.textContent = v;
    });
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const v = t[el.dataset.i18nHtml];
      if (typeof v === 'string') el.innerHTML = v; // dictionary values are authored in i18n.js, not user input
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(el => {
      el.dataset.i18nAttr.split(';').forEach(pair => {
        const [attr, key] = pair.split(':');
        if (attr && key && typeof t[key] === 'string') el.setAttribute(attr, t[key]);
      });
    });

    document.querySelectorAll('[data-lang-btn]').forEach(btn => {
      const active = btn.dataset.langBtn === lang;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
    renderNews();
    langListeners.forEach(fn => { try { fn(lang); } catch (e) { console.error(e); } });
  }

  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      applyLang(btn.dataset.langBtn);
    });
  });

  // ---------- Navigation (ported from the Japan site's components.js) ----------
  const nav = document.getElementById('mainNav');
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');
  function closeMenu() {
    nav.classList.remove('menu-open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
  if (nav && hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('menu-open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a:not([data-lang-btn])').forEach(a => a.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('menu-open')) closeMenu(); });
  }

  // ---------- Scroll reveal ----------
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ---------- microCMS helpers ----------
  async function fetchCMS(endpoint, params) {
    if (!CMS_CONFIG || !CMS_CONFIG.serviceDomain || !CMS_CONFIG.apiKey) return null;
    const query = new URLSearchParams(params || {}).toString();
    const url = `https://${CMS_CONFIG.serviceDomain}.microcms.io/api/v1/${endpoint}${query ? '?' + query : ''}`;
    try {
      const res = await fetch(url, { headers: { 'X-MICROCMS-API-KEY': CMS_CONFIG.apiKey } });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.warn('[cms] fetch failed', endpoint, err);
      return null;
    }
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function formatDate(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  }

  // Picks the field for the current language (title_ja, title_fr, …) and falls back to the
  // article's base language: English for the Kenya API, Japanese for the shared Japan API.
  function localized(item, field, source) {
    const base = source === 'ke' ? 'en' : 'ja';
    if (currentLang !== base) {
      const v = item[`${field}_${currentLang}`];
      if (typeof v === 'string' && v.trim()) return { text: v, isFallback: false, base };
    }
    return { text: item[field] || '', isFallback: currentLang !== base, base };
  }

  function categoryLabel(item) {
    const t = I18N[currentLang];
    let cat = item.category;
    if (Array.isArray(cat)) cat = cat[0];
    if (!cat) return '';
    const map = { 'press': 'news_cat_press', 'event': 'news_cat_event', 'partnership': 'news_cat_partnership', 'public-project': 'news_cat_public', 'media': 'news_cat_media', 'other': 'news_cat_other', 'training': 'news_cat_training', 'finance': 'news_cat_finance' };
    return map[cat] && t[map[cat]] ? t[map[cat]] : String(cat);
  }

  function excerpt(html, max) {
    const text = String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return text.length > max ? text.slice(0, max - 1) + '…' : text;
  }

  function articleUrl(item, source) {
    if (item.link && /^https?:/i.test(item.link)) return { href: item.link, external: true };
    if (source === 'ke') return { href: `/news.html?id=${encodeURIComponent(item.id)}`, external: false };
    return { href: `${CMS_CONFIG.sharedArticleBase}/news/${encodeURIComponent(item.id)}.html`, external: true };
  }

  // ---------- Top-page news ----------
  function newsCard(item, source, delayClass) {
    const t = I18N[currentLang];
    const title = localized(item, 'title', source);
    const date = formatDate(item.publishedAt || item.createdAt);
    const link = articleUrl(item, source);
    const thumb = item.thumbnail && item.thumbnail.url
      ? `<img src="${escapeHtml(item.thumbnail.url)}?w=600&h=338&fit=crop" alt="" loading="lazy">`
      : `<div class="news-thumb-placeholder">AAHD</div>`;
    const cat = categoryLabel(item);
    const langTag = title.isFallback ? `<span class="news-lang-tag">${title.base.toUpperCase()}</span>` : '';
    const summary = localized(item, 'summary', source);
    const body = summary.text ? summary.text : excerpt(item.content, 90);
    const target = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `
      <a href="${escapeHtml(link.href)}" class="news-card reveal visible ${delayClass}"${target}>
        <div class="news-thumb">${thumb}</div>
        <div class="news-body">
          ${cat ? `<div class="news-cat">${escapeHtml(cat)}</div>` : ''}
          <div class="news-meta"><div class="news-date">${escapeHtml(date)}</div>${langTag}</div>
          <h3>${escapeHtml(title.text)}</h3>
          ${body ? `<p class="news-excerpt">${escapeHtml(body)}</p>` : ''}
          <div class="news-link">${escapeHtml(t.news_read_more)} <span>→</span></div>
        </div>
      </a>`;
  }

  function renderNews() {
    const grid = document.getElementById('top-news');
    if (!grid) return;
    const t = I18N[currentLang];
    const items = cmsItems || NEWS_FALLBACK;
    const source = cmsItems ? newsSource : 'jp';
    if (!items.length) {
      grid.innerHTML = `<p class="news-empty">${escapeHtml(t.news_empty)}</p>`;
      return;
    }
    const delays = ['', 'reveal-delay-1', 'reveal-delay-2'];
    grid.innerHTML = items.slice(0, 3).map((item, i) => newsCard(item, source, delays[i % 3])).join('');
  }

  async function loadTopNews() {
    if (!document.getElementById('top-news')) return;
    const ke = await fetchCMS(CMS_CONFIG.kenyaEndpoint, { limit: 3, orders: '-publishedAt' });
    if (ke && Array.isArray(ke.contents) && ke.contents.length) {
      cmsItems = ke.contents; newsSource = 'ke'; renderNews(); return;
    }
    const jp = await fetchCMS(CMS_CONFIG.sharedEndpoint, { limit: 3, orders: '-publishedAt' });
    if (jp && Array.isArray(jp.contents) && jp.contents.length) {
      cmsItems = jp.contents; newsSource = 'jp'; renderNews();
    }
  }

  // ---------- Hero slider (crossfade) ----------
  (function initHeroSlider() {
    const slides = Array.from(document.querySelectorAll('.hero-slide'));
    const dotsWrap = document.querySelector('.hero-dots');
    if (slides.length < 2) { if (dotsWrap) dotsWrap.remove(); return; }
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let index = 0, timer = null;
    const dots = slides.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'tab'); b.setAttribute('aria-label', `Photo ${i + 1}`);
      b.addEventListener('click', () => { show(i); restart(); });
      dotsWrap.appendChild(b);
      return b;
    });
    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, k) => s.classList.toggle('is-active', k === index));
      dots.forEach((d, k) => { d.classList.toggle('is-active', k === index); d.setAttribute('aria-selected', String(k === index)); });
    }
    function restart() {
      if (timer) clearInterval(timer);
      if (!reduceMotion) timer = setInterval(() => show(index + 1), 6000);
    }
    show(0);
    restart();
  })();

  // ---------- Contact form (Google Apps Script) ----------
  const form = document.getElementById('contact-form');
  if (form) {
    const submitBtn = form.querySelector('.form-submit');
    const submitLabel = submitBtn.querySelector('[data-i18n="f_submit"]');
    const status = document.getElementById('form-status');

    function showStatus(kind, message) {
      status.hidden = false;
      status.textContent = message;
      status.className = `form-status form-status--${kind}`;
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const t = I18N[currentLang];
      if (!form.checkValidity()) {
        showStatus('error', t.f_invalid);
        form.reportValidity();
        return;
      }
      submitBtn.disabled = true;
      submitLabel.textContent = t.f_sending;
      status.hidden = true;
      try {
        // 'no-cors': Apps Script accepts the POST but the response is opaque, so success is assumed unless the network fails.
        await fetch(CONTACT_FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body: new FormData(form) });
        showStatus('success', t.f_success);
        form.reset();
      } catch (err) {
        console.error('[contact] submission failed', err);
        showStatus('error', t.f_error);
      } finally {
        submitBtn.disabled = false;
        submitLabel.textContent = I18N[currentLang].f_submit;
      }
    });
  }

  // ---------- Public helpers for news.html ----------
  window.AAHD = {
    fetchCMS, escapeHtml, formatDate, localized, categoryLabel, excerpt, articleUrl,
    getLang: () => currentLang,
    t: key => I18N[currentLang][key],
    onLangChange: fn => langListeners.push(fn),
  };

  // ---------- Init ----------
  const year = document.getElementById('copyright-year');
  if (year) year.textContent = new Date().getFullYear();
  applyLang(detectLang());
  loadTopNews();
})();
