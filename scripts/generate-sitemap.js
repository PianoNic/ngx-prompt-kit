#!/usr/bin/env node
/* eslint-disable */
// Generates demo/public/sitemap.xml from the SEO map. Runs as a prebuild step
// so the bundled assets always include a fresh sitemap. Reads the same source
// of truth that SeoService consults at runtime, via a tiny bun-friendly
// transpile through bun's loader.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ROOT = path.resolve(__dirname, '..');
const SCRIPT = path.join(ROOT, 'scripts', '_dump-seo-paths.ts');

// Run the small TS dumper via bun (bun is the project's package manager and
// can execute TypeScript directly). Falls back gracefully if bun is missing.
function runDumper() {
  const out = spawnSync('bun', ['run', SCRIPT], {
    cwd: ROOT,
    encoding: 'utf-8',
  });
  if (out.status !== 0) {
    throw new Error(
      `[sitemap] bun run ${SCRIPT} exited ${out.status}\n${out.stderr}`,
    );
  }
  return JSON.parse(out.stdout);
}

const { baseUrl, entries } = runDumper();

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...entries.map((e) =>
    [
      '  <url>',
      `    <loc>${baseUrl}${e.path}</loc>`,
      `    <changefreq>${e.changefreq}</changefreq>`,
      `    <priority>${e.priority.toFixed(1)}</priority>`,
      '  </url>',
    ].join('\n'),
  ),
  '</urlset>',
  '',
].join('\n');

const outPath = path.join(ROOT, 'demo', 'public', 'sitemap.xml');
fs.writeFileSync(outPath, xml, 'utf-8');
console.log(`wrote ${path.relative(ROOT, outPath)} (${entries.length} urls)`);
