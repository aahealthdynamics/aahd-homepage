# Africa Asia Health Dynamics Limited — Kenya site

Static one-page site for Africa Asia Health Dynamics Limited (Nairobi), the Kenyan subsidiary of AA Health Dynamics Inc. (Tokyo). Served by nginx via the `Dockerfile`; no build step.

## Structure

| Path | Purpose |
| --- | --- |
| `index.html` | The page. Layout follows the previously deployed Kenya site (hero, About / Mission / Values / Team, Partners, Services, News, Impact, Contact, Footer). |
| `css/style.css` | Copied from aa-healthdynamics.com (tone & manner: colours, type, buttons, nav, forms). Keep untouched so it can be re-synced from the Japan site. |
| `css/site.css` | Kenya-only layout rules and overrides. Edit this, not `style.css`. |
| `js/i18n.js` | All copy in EN (main), JA and FR. Elements reference keys via `data-i18n`, `data-i18n-html` and `data-i18n-attr`. |
| `js/cms-config.js` | Shared microCMS service domain + GET-only key (same as the Japan site). |
| `js/site.js` | Nav, hero slider, scroll reveal, language switching, news rendering, contact form. |
| `assets/images/` | Logos, team photos, partner logos, hero and service photos. |

## Hero photos

The hero crossfades `assets/images/pocus-training-1.jpg`, `-2.jpg` and `-3.jpg` every 6 seconds (paused when the visitor prefers reduced motion). To change the photos, replace those files or edit the `<img class="hero-slide">` list in `index.html`.

## Languages

English is always the default. `?lang=ja` / `?lang=fr` (or the EN / JP / FR switch in the nav) change the language; the choice is remembered in `localStorage`.

## News

News lives in the same microCMS service as the Japan site, in a Kenya-specific list API (`news-ke`, English first). `docs/microcms-kenya-news.md` lists the fields to create. The top page shows the latest three items; `news.html` lists all items (9 per page) and renders an article at `news.html?id=<id>`. The top-page section is hidden until `news-ke` has published items; the Japan site's news is never shown here.

## Contact form

Posts to the existing Google Apps Script endpoint (`CONTACT_FORM_ENDPOINT` in `js/i18n.js`) with fields `name`, `email`, `subject`, `message`.

## To do

- Production URL is https://ke.aa-healthdynamics.com/ (CNAME to Render). The old Render URL redirects there.
- Optional: add `title_en` / `title_fr` fields in microCMS for bilingual news titles.

## SEO and hosting

- `robots.txt` and `sitemap.xml` are served from the root.
- `scripts/build-news.mjs` pre-renders Kenya news into static HTML: one page per article at `news/<id>.html`, plus the cards in `news.html` and `index.html` (between `<!-- build:... -->` markers). `scripts/build-sitemap.mjs` then regenerates the sitemap. `.github/workflows/sitemap.yml` runs both daily and on a microCMS webhook, and commits changes (which triggers a deploy). Do not edit `news/*.html` or the marked blocks by hand.
- Images are served as resized WebP from `assets/images/opt/` (originals stay in `assets/images/`). Fonts load without blocking first paint.
- `index.html` declares `hreflang` alternates for this site (`en-KE`) and the Japan site (`ja`, `en`). The Japan site lists `en-KE` in return (added 2026-10-01).
- Article pages (`news/<id>.html`) carry their own title, description, canonical, Open Graph tags and `NewsArticle` + `BreadcrumbList` JSON-LD in the static HTML. Old `news.html?id=…` links still work and point their canonical at the static page.
- `nginx.conf` enables gzip, sets cache headers (images 30 days, CSS/JS 1 day, HTML no-cache) and serves `404.html`.

## Local preview

```sh
python3 -m http.server 8080
# open http://localhost:8080/
```
