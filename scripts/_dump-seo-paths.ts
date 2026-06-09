// Tiny bun-runnable script that loads the SEO map and prints the URL list as
// JSON for generate-sitemap.js to consume. Lives next to the JS generator so
// changes to seo-data.ts automatically propagate to the sitemap.
import { ALL_PAGE_PATHS, SITE, metaForUrl } from '../demo/app/seo/seo-data';

const entries = ALL_PAGE_PATHS.map((p) => {
  const m = metaForUrl(p);
  return {
    path: m.path,
    changefreq: m.changefreq ?? 'monthly',
    priority: m.priority ?? 0.5,
  };
});

process.stdout.write(JSON.stringify({ baseUrl: SITE.baseUrl, entries }));
