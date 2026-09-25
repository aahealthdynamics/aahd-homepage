#!/usr/bin/env node
// Regenerates sitemap.xml from the static pages plus every published Kenya news article.
// Usage: node scripts/build-sitemap.mjs   (run from the repo root; Node 18+)
// Also run daily by .github/workflows/sitemap.yml.

import fs from 'node:fs';
import vm from 'node:vm';

const SITE = 'https://ke.aa-healthdynamics.com';

// Reuse the browser config file so there is a single source of truth for the CMS settings.
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(new URL('../js/cms-config.js', import.meta.url), 'utf8') + ';this.CMS_CONFIG = CMS_CONFIG;', ctx);
const { serviceDomain, apiKey, kenyaEndpoint } = ctx.CMS_CONFIG;

const today = new Date().toISOString().slice(0, 10);
const urls = [
  { loc: `${SITE}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
  { loc: `${SITE}/news.html`, lastmod: today, changefreq: 'daily', priority: '0.7' },
];

try {
  let offset = 0, total = 0;
  do {
    const res = await fetch(`https://${serviceDomain}.microcms.io/api/v1/${kenyaEndpoint}?limit=100&offset=${offset}&fields=id,publishedAt,updatedAt,link`, {
      headers: { 'X-MICROCMS-API-KEY': apiKey },
    });
    if (!res.ok) throw new Error(`microCMS responded ${res.status}`);
    const data = await res.json();
    total = data.totalCount || 0;
    for (const c of data.contents || []) {
      if (c.link) continue; // external articles have no page here
      urls.push({
        loc: `${SITE}/news.html?id=${encodeURIComponent(c.id)}`,
        lastmod: String(c.updatedAt || c.publishedAt || today).slice(0, 10),
        changefreq: 'monthly',
        priority: '0.6',
      });
    }
    offset += 100;
  } while (offset < total);
} catch (err) {
  console.warn('News articles skipped:', err.message);
}

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(new URL('../sitemap.xml', import.meta.url), xml);
console.log(`sitemap.xml written with ${urls.length} URLs`);
