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

English is the default. `?lang=ja` / `?lang=fr` (or the switch in the nav) change the language; the choice is remembered in `localStorage`. Browser language is used on first visit.

## News

News lives in the same microCMS service as the Japan site, in a Kenya-specific list API (`news-ke`, English first). `docs/microcms-kenya-news.md` lists the fields to create. The top page shows the latest three items; `news.html` lists all items (9 per page) and renders an article at `news.html?id=<id>`. The top-page section is hidden until `news-ke` has published items; the Japan site's news is never shown here.

## Contact form

Posts to the existing Google Apps Script endpoint (`CONTACT_FORM_ENDPOINT` in `js/i18n.js`) with fields `name`, `email`, `subject`, `message`.

## To do

- Confirm the production domain and update `canonical`, `og:url` and the JSON-LD in `index.html` (proposal: `ke.aa-healthdynamics.com`).
- Optional: add `title_en` / `title_fr` fields in microCMS for bilingual news titles.

## Local preview

```sh
python3 -m http.server 8080
# open http://localhost:8080/
```
