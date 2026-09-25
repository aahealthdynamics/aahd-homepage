// ==================== microCMS Configuration ====================
// Same microCMS service as the Japan site (aa-healthdynamics.com).
// The key below is a GET-only key; keep it that way.

const CMS_CONFIG = {
  serviceDomain: 'g2nm6x9p1n',
  apiKey: '1IW5vujN5MhDvVN2sWYsaBTTMkE0zqK4AhfM',

  // Kenya news: its own list API in microCMS (English first). See docs/microcms-kenya-news.md
  // for the fields to create. Articles are rendered by this site at /news.html?id=<id>.
  kenyaEndpoint: 'news-ke',

  // Japan site, used only when an article's "link" points there.
  sharedArticleBase: 'https://aa-healthdynamics.com',
};
