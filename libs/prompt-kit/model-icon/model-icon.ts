// ngx-prompt-kit original — not part of ibelick/prompt-kit
/**
 * Resolves a brand icon for an AI model from LobeHub's static icon set
 * (https://github.com/lobehub/lobe-icons) — pair it with `pk-model-picker` /
 * `pk-model-list` (which accept an `iconUrl`).
 *
 * Model ids are expected in OpenRouter's `vendor/model` form (e.g.
 * `openai/gpt-4o-mini`). The vendor prefix is normalised (routing markers
 * stripped, aliases mapped to LobeHub's slug); vendors with no brand icon fall
 * back to a neutral, bundled monochrome glyph so every model shows something.
 * The base `<slug>.svg` icons are monochrome and work under a `dark:invert`.
 */

const ICON_BASE = 'https://unpkg.com/@lobehub/icons-static-svg@latest/icons';

/** Neutral fallback: a monochrome cube glyph as a bundled data URI (no network). */
const UNKNOWN_ICON =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" ' +
      'fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" ' +
      'stroke-linejoin="round">' +
      '<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>' +
      '<path d="m3.3 7 8.7 5 8.7-5"/>' +
      '<path d="M12 22V12"/>' +
      '</svg>',
  );

/** OpenRouter vendor prefix → LobeHub icon slug, for cases where they differ. */
const VENDOR_SLUG: Readonly<Record<string, string>> = {
  'meta-llama': 'meta',
  mistralai: 'mistral',
  alibaba: 'qwen',
  'x-ai': 'grok',
  moonshotai: 'moonshot',
  'bytedance-seed': 'bytedance',
  'z-ai': 'zhipu',
  amazon: 'nova',
  'arcee-ai': 'arcee',
  'ibm-granite': 'ibm',
  allenai: 'ai2',
};

/** Vendor slugs that match LobeHub 1:1 — gates the identity fallback so unknown
 *  vendors get the neutral glyph, not a broken image. */
const KNOWN_SLUGS = new Set([
  'openai',
  'anthropic',
  'deepseek',
  'qwen',
  'cohere',
  'perplexity',
  'microsoft',
  'nvidia',
  'mistral',
  'meta',
  'ai21',
  'minimax',
  'baidu',
  'bytedance',
  'tencent',
  'liquid',
  'inception',
  'nousresearch',
  'stepfun',
  'inflection',
  'upstage',
  'openrouter',
]);

function normalizeVendor(id: string, provider?: string): string {
  const raw = id.split('/')[0] || provider || '';
  return raw.toLowerCase().replace(/^[^a-z0-9]+/, '');
}

function slugFor(id: string, provider?: string): string | undefined {
  const vendor = normalizeVendor(id, provider);
  if (!vendor) return undefined;
  // Google ships both Gemini and the open Gemma family under one vendor.
  if (vendor === 'google') return /gemma/i.test(id) ? 'gemma' : 'gemini';
  return VENDOR_SLUG[vendor] ?? (KNOWN_SLUGS.has(vendor) ? vendor : undefined);
}

/**
 * Icon URL for a model: the vendor's LobeHub brand icon, or a neutral generic
 * glyph when the vendor has no known icon. Always returns a URL. Pass the
 * model's `id` (and optionally `provider` as a fallback vendor).
 */
export function modelIconUrl(model: { id: string; provider?: string }): string {
  const slug = slugFor(model.id, model.provider);
  return slug ? `${ICON_BASE}/${slug}.svg` : UNKNOWN_ICON;
}
