#!/usr/bin/env node
// Pre-renders Kenya news from microCMS into static HTML so search engines index it
// without running JavaScript:
//   1. news/<id>.html   one page per article (title, description, Open Graph,
//                       NewsArticle + BreadcrumbList JSON-LD, full body)
//   2. news.html        the article list, between <!-- build:news-list --> markers
//   3. index.html       the latest three cards, between <!-- build:top-news --> markers
// Pages for articles that were unpublished are deleted.
//
// Usage: node scripts/build-news.mjs   (repo root, Node 18+)
// Run daily (and on microCMS webhook) by .github/workflows/sitemap.yml.
// On a network error it changes nothing and exits 0, so the site never loses content.

import fs from 'node:fs';
import vm from 'node:vm';

const ROOT = new URL('..', import.meta.url);
const SITE = 'https://ke.aa-healthdynamics.com';
const read = p => fs.readFileSync(new URL(p, ROOT), 'utf8');
const write = (p, s) => fs.writeFileSync(new URL(p, ROOT), s);

// ---------- Config (single source of truth: js/cms-config.js) ----------
const ctx = {};
vm.createContext(ctx);
vm.runInContext(read('js/cms-config.js') + ';this.CMS_CONFIG = CMS_CONFIG;', ctx);
const { serviceDomain, apiKey, kenyaEndpoint } = ctx.CMS_CONFIG;

// ---------- Helpers ----------
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const stripHtml = s => String(s ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
const clip = (s, n) => (s.length > n ? s.slice(0, n - 1).trimEnd() + '…' : s);
const fmtDate = iso => {
  const d = new Date(iso);
  return isNaN(d) ? '' : `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
};
const CATEGORY = { training: 'Training', finance: 'Finance', partnership: 'Partnership', event: 'Event', press: 'Press Release', media: 'Media', other: 'News', 'public-project': 'Public Project' };
const category = item => {
  const c = Array.isArray(item.category) ? item.category[0] : item.category;
  return c ? (CATEGORY[c] || String(c)) : '';
};
const description = item => clip(stripHtml(item.summary) || stripHtml(item.content), 155);
const pagePath = item => `/news/${encodeURIComponent(item.id)}.html`;
const isExternal = item => item.link && /^https?:/i.test(item.link);
const href = item => (isExternal(item) ? item.link : pagePath(item));
const thumb = (item, w, h) => (item.thumbnail && item.thumbnail.url ? `${item.thumbnail.url}?w=${w}${h ? `&h=${h}&fit=crop` : ''}&fm=webp` : '');

function replaceBlock(html, name, inner) {
  const re = new RegExp(`(<!-- build:${name} -->)[\\s\\S]*?(<!-- /build:${name} -->)`);
  if (!re.test(html)) throw new Error(`markers build:${name} not found`);
  return html.replace(re, `$1${inner}$2`);
}

// ---------- Fetch ----------
async function fetchAll() {
  const items = [];
  let offset = 0, total = 0;
  do {
    const res = await fetch(`https://${serviceDomain}.microcms.io/api/v1/${kenyaEndpoint}?limit=100&offset=${offset}&orders=-publishedAt`, {
      headers: { 'X-MICROCMS-API-KEY': apiKey },
    });
    if (!res.ok) throw new Error(`microCMS responded ${res.status}`);
    const data = await res.json();
    total = data.totalCount || 0;
    items.push(...(data.contents || []));
    offset += 100;
  } while (offset < total);
  return items;
}

// ---------- Card markup (mirrors js/site.js and js/news-page.js) ----------
function topCard(item, i) {
  const delay = ['', ' reveal-delay-1', ' reveal-delay-2'][i % 3];
  const img = thumb(item, 600, 338);
  const ext = isExternal(item) ? ' target="_blank" rel="noopener noreferrer"' : '';
  const cat = category(item);
  const body = clip(stripHtml(item.summary) || stripHtml(item.content), 90);
  return `
      <a href="${esc(href(item))}" class="news-card reveal visible${delay}"${ext}>
        <div class="news-thumb">${img ? `<img src="${esc(img)}" alt="" width="600" height="338" loading="lazy">` : '<div class="news-thumb-placeholder">AAHD</div>'}</div>
        <div class="news-body">
          ${cat ? `<div class="news-cat">${esc(cat)}</div>` : ''}
          <div class="news-meta"><div class="news-date">${fmtDate(item.publishedAt || item.createdAt)}</div></div>
          <h3>${esc(item.title)}</h3>
          ${body ? `<p class="news-excerpt">${esc(body)}</p>` : ''}
          <div class="news-link">Read More <span>→</span></div>
        </div>
      </a>`;
}

function listCard(item, i) {
  const delay = ['', ' reveal-delay-1', ' reveal-delay-2'][i % 3];
  const img = thumb(item, 600, 338);
  const ext = isExternal(item) ? ' target="_blank" rel="noopener noreferrer"' : '';
  const cat = category(item);
  return `
      <a href="${esc(href(item))}" class="news-list-card reveal visible${delay}"${ext}>
        <div class="news-list-thumb">${img ? `<img src="${esc(img)}" alt="" width="600" height="338" loading="lazy" style="width:100%;height:100%;object-fit:cover;">` : '<div class="news-list-thumb-placeholder">AAHD</div>'}</div>
        <div class="news-list-body">
          <div class="news-list-meta">
            <span class="news-list-date">${fmtDate(item.publishedAt || item.createdAt)}</span>
            ${cat ? `<span class="news-list-category">${esc(cat)}</span>` : ''}
          </div>
          <h2 class="news-list-title">${esc(item.title)}</h2>
        </div>
      </a>`;
}

// ---------- Article page (built from news.html so nav/footer stay in sync) ----------
function articlePage(template, item) {
  const url = SITE + pagePath(item);
  const title = `${item.title} | Africa Asia Health Dynamics`;
  const desc = description(item);
  // Open Graph image: JPEG/PNG 1200x630 (some social apps still ignore WebP).
  const image = item.thumbnail && item.thumbnail.url ? `${item.thumbnail.url}?w=1200&h=630&fit=crop` : `${SITE}/assets/images/ogp.jpg`;
  const published = item.publishedAt || item.createdAt;
  const cat = category(item);

  const ld = [
    {
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      mainEntityOfPage: { '@type': 'WebPage', '@id': url },
      headline: clip(item.title, 110),
      description: desc,
      image: [image],
      datePublished: published,
      dateModified: item.updatedAt || published,
      inLanguage: 'en',
      author: { '@type': 'Organization', name: 'Africa Asia Health Dynamics Limited', url: `${SITE}/` },
      publisher: {
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: 'Africa Asia Health Dynamics Limited',
        logo: { '@type': 'ImageObject', url: `${SITE}/assets/images/logo-black.png` },
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'News', item: `${SITE}/news.html` },
        { '@type': 'ListItem', position: 3, name: item.title, item: url },
      ],
    },
  ];

  let h = template;
  const sub = (re, val) => {
    if (!re.test(h)) throw new Error(`template pattern not found: ${re}`);
    h = h.replace(re, val);
  };
  sub(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`);
  sub(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(desc)}">`);
  sub(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${url}">`);
  sub(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(title)}">`);
  sub(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(desc)}">`);
  sub(/<meta property="og:type" content="[^"]*">/, `<meta property="og:type" content="article">\n<meta property="article:published_time" content="${esc(published)}">`);
  sub(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${url}">`);
  sub(/<meta property="og:image" content="[^"]*">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">/, `<meta property="og:image" content="${esc(image)}">`);
  sub(/<meta name="twitter:image" content="[^"]*">/, `<meta name="twitter:image" content="${esc(image)}">`);
  sub(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, ld.map(o => `<script type="application/ld+json">\n${JSON.stringify(o, null, 1)}\n</script>`).join('\n'));
  sub(/<body[^>]*>/, '<body data-page="article">');
  // Hero: article title as the page h1 is in the article itself, so the hero shows the section name.
  sub(/<h1 id="page-hero-title" data-i18n="news_page_title">News<\/h1>/, '<p class="page-hero-kicker" id="page-hero-title" data-i18n="news_page_title">News</p>');
  sub(/\s*<p id="page-hero-intro"[^>]*>[^<]*<\/p>/, '');
  sub(/<!-- NEWS LIST -->[\s\S]*?<!-- ARTICLE -->/, '<!-- ARTICLE -->');
  sub(/<section class="article-detail" id="article-section" hidden>\s*<div class="article-detail-inner" id="article-detail"><\/div>\s*<\/section>/, `<article class="article-detail" id="article-section">
  <div class="article-detail-inner" id="article-detail">
    <div class="article-detail-meta"><time class="article-detail-date" datetime="${esc(published)}">${fmtDate(published)}</time>${cat ? `<span class="article-detail-category">${esc(cat)}</span>` : ''}</div>
    <h1 class="article-detail-title">${esc(item.title)}</h1>
    ${item.thumbnail && item.thumbnail.url ? `<div class="article-detail-thumbnail"><img src="${esc(thumb(item, 1200))}" alt="${esc(item.title)}" width="1200" loading="eager"></div>` : ''}
    <div class="article-detail-body">${item.content || ''}</div>
    <a href="/news.html" class="article-detail-back">← <span data-i18n="news_back">Back to News</span></a>
  </div>
</article>`);
  sub(/\s*<script src="\/js\/news-page\.js"><\/script>/, '');
  sub(/<a href="\/news\.html" class="active"/, '<a href="/news.html" class="active" aria-current="page"');
  return `<!-- Generated by scripts/build-news.mjs from microCMS (${kenyaEndpoint}/${item.id}). Do not edit by hand. -->\n` + h;
}

// ---------- Main ----------
let items;
try {
  items = await fetchAll();
} catch (err) {
  console.warn('[build-news] skipped, CMS unreachable:', err.message);
  process.exit(0);
}

const template = read('news.html');
fs.mkdirSync(new URL('news/', ROOT), { recursive: true });

const keep = new Set();
for (const item of items) {
  if (!item.title || isExternal(item)) continue;
  const file = `news/${item.id}.html`;
  write(file, articlePage(template, item));
  keep.add(`${item.id}.html`);
}
for (const f of fs.readdirSync(new URL('news/', ROOT))) {
  if (f.endsWith('.html') && !keep.has(f)) fs.unlinkSync(new URL(`news/${f}`, ROOT));
}

const listed = items.filter(i => i.title);
write('news.html', replaceBlock(template, 'news-list', listed.map(listCard).join('') + (listed.length ? '\n    ' : '')));
write('index.html', replaceBlock(read('index.html'), 'top-news', listed.slice(0, 3).map(topCard).join('') + (listed.length ? '\n    ' : '')));

console.log(`[build-news] ${keep.size} article pages, ${listed.length} list items`);
