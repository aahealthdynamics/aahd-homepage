// ==================== news.html — list and article page ====================
// Reads the Kenya news API (CMS_CONFIG.kenyaEndpoint). While that API does not
// exist yet, the list falls back to the Japan site's news. Requires site.js.

(function () {
  'use strict';

  const A = window.AAHD;
  const LIMIT = 9;
  const params = new URLSearchParams(location.search);
  const articleId = params.get('id');
  const page = Math.max(1, parseInt(params.get('page'), 10) || 1);

  const listSection = document.getElementById('news-list-section');
  const listEl = document.getElementById('news-list');
  const detailSection = document.getElementById('article-section');
  const detailEl = document.getElementById('article-detail');
  const heroTitle = document.getElementById('page-hero-title');
  const heroIntro = document.getElementById('page-hero-intro');

  let listData = null;   // { contents, totalCount, source }
  let article = null;    // { item, source }

  function listCard(item, source, delayClass) {
    const title = A.localized(item, 'title', source);
    const date = A.formatDate(item.publishedAt || item.createdAt);
    const link = A.articleUrl(item, source);
    const cat = A.categoryLabel(item);
    const thumb = item.thumbnail && item.thumbnail.url
      ? `<img src="${A.escapeHtml(item.thumbnail.url)}?w=600&h=338&fit=crop" alt="" loading="lazy" style="width:100%;height:100%;object-fit:cover;">`
      : `<div class="news-list-thumb-placeholder">AAHD</div>`;
    const target = link.external ? ' target="_blank" rel="noopener noreferrer"' : '';
    const langTag = title.isFallback ? `<span class="news-list-category">${title.base.toUpperCase()}</span>` : '';
    return `
      <a href="${A.escapeHtml(link.href)}" class="news-list-card reveal visible ${delayClass}"${target}>
        <div class="news-list-thumb">${thumb}</div>
        <div class="news-list-body">
          <div class="news-list-meta">
            <span class="news-list-date">${A.escapeHtml(date)}</span>
            ${cat ? `<span class="news-list-category">${A.escapeHtml(cat)}</span>` : ''}
            ${langTag}
          </div>
          <h3>${A.escapeHtml(title.text)}</h3>
        </div>
      </a>`;
  }

  function pagination(totalCount) {
    const pages = Math.ceil(totalCount / LIMIT);
    if (pages <= 1) return '';
    let html = '<div class="pagination">';
    for (let i = 1; i <= pages; i++) {
      html += i === page ? `<span class="current">${i}</span>` : `<a href="?page=${i}">${i}</a>`;
    }
    return html + '</div>';
  }

  function renderList() {
    if (!listData) return;
    const delays = ['', 'reveal-delay-1', 'reveal-delay-2'];
    const items = listData.contents;
    listEl.innerHTML = items.length
      ? items.map((it, i) => listCard(it, listData.source, delays[i % 3])).join('')
      : `<p class="news-empty">${A.escapeHtml(A.t('news_empty'))}</p>`;
    const old = listSection.querySelector('.pagination');
    if (old) old.remove();
    listEl.insertAdjacentHTML('afterend', pagination(listData.totalCount));
  }

  function renderArticle() {
    if (!article) return;
    const { item, source } = article;
    const title = A.localized(item, 'title', source);
    const content = A.localized(item, 'content', source);
    const date = A.formatDate(item.publishedAt || item.createdAt);
    const cat = A.categoryLabel(item);
    let html = `<div class="article-detail-meta"><span class="article-detail-date">${A.escapeHtml(date)}</span>`;
    if (cat) html += `<span class="article-detail-category">${A.escapeHtml(cat)}</span>`;
    html += `</div><h1 class="article-detail-title">${A.escapeHtml(title.text)}</h1>`;
    if (item.thumbnail && item.thumbnail.url) {
      html += `<div class="article-detail-thumbnail"><img src="${A.escapeHtml(item.thumbnail.url)}?w=1200" alt=""></div>`;
    }
    // Rich-text body comes from our own microCMS and is rendered as HTML, as on the Japan site.
    html += `<div class="article-detail-body">${content.text || ''}</div>`;
    html += `<a href="/news.html" class="article-detail-back">← ${A.escapeHtml(A.t('news_back'))}</a>`;
    detailEl.innerHTML = html;
    if (heroTitle) heroTitle.textContent = title.text;
    document.title = `${title.text} | Africa Asia Health Dynamics`;
    applyArticleSeo(item, source, title.text, content.text);
  }

  // Canonical, description, Open Graph and NewsArticle JSON-LD for the article being viewed.
  function setMeta(selector, attr, name, value) {
    let el = document.querySelector(selector);
    if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el); }
    el.setAttribute('content', value);
  }

  function applyArticleSeo(item, source, titleText, contentHtml) {
    const url = `${location.origin}/news.html?id=${encodeURIComponent(item.id)}`;
    const summary = A.localized(item, 'summary', source).text;
    const desc = summary || A.excerpt(contentHtml, 150);
    const image = item.thumbnail && item.thumbnail.url ? `${item.thumbnail.url}?w=1200` : `${location.origin}/assets/images/ogp.jpg`;
    const fullTitle = `${titleText} | Africa Asia Health Dynamics`;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) { canonical = document.createElement('link'); canonical.rel = 'canonical'; document.head.appendChild(canonical); }
    canonical.href = url;

    setMeta('meta[name="description"]', 'name', 'description', desc);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:type"]', 'property', 'og:type', 'article');
    setMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMeta('meta[property="og:description"]', 'property', 'og:description', desc);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    document.querySelectorAll('meta[property="og:image:width"], meta[property="og:image:height"]').forEach(m => m.remove());

    const ld = {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      headline: titleText,
      description: desc,
      image: [image],
      datePublished: item.publishedAt || item.createdAt,
      dateModified: item.updatedAt || item.publishedAt || item.createdAt,
      inLanguage: A.getLang(),
      author: { '@type': 'Organization', name: 'Africa Asia Health Dynamics Limited', url: `${location.origin}/` },
      publisher: {
        '@type': 'Organization',
        '@id': `${location.origin}/#organization`,
        name: 'Africa Asia Health Dynamics Limited',
        logo: { '@type': 'ImageObject', url: `${location.origin}/assets/images/logo-black.png` },
      },
    };
    let script = document.getElementById('article-ld');
    if (!script) { script = document.createElement('script'); script.type = 'application/ld+json'; script.id = 'article-ld'; document.head.appendChild(script); }
    script.textContent = JSON.stringify(ld);
  }

  function notFound() {
    detailEl.innerHTML = `<p class="article-detail-loading">${A.escapeHtml(A.t('news_not_found'))}</p><a href="/news.html" class="article-detail-back">← ${A.escapeHtml(A.t('news_back'))}</a>`;
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex, follow'; document.head.appendChild(m);
  }

  async function init() {
    if (articleId) {
      listSection.hidden = true;
      detailSection.hidden = false;
      if (heroIntro) heroIntro.hidden = true;
      detailEl.innerHTML = `<p class="article-detail-loading">${A.escapeHtml(A.t('news_loading'))}</p>`;
      const item = await A.fetchCMS(`${CMS_CONFIG.kenyaEndpoint}/${encodeURIComponent(articleId)}`);
      if (item && item.title) { article = { item, source: 'ke' }; renderArticle(); }
      else notFound();
      return;
    }

    listSection.hidden = false;
    detailSection.hidden = true;
    listEl.innerHTML = `<p class="news-empty">${A.escapeHtml(A.t('news_loading'))}</p>`;
    const q = { limit: LIMIT, offset: (page - 1) * LIMIT, orders: '-publishedAt' };
    const ke = await A.fetchCMS(CMS_CONFIG.kenyaEndpoint, q);
    listData = ke && Array.isArray(ke.contents)
      ? { contents: ke.contents, totalCount: ke.totalCount || 0, source: 'ke' }
      : { contents: [], totalCount: 0, source: 'ke' };
    renderList();
  }

  A.onLangChange(() => { renderList(); renderArticle(); });
  init();
})();
