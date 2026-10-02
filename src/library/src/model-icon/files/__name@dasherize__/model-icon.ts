// ngx-prompt-kit original — not part of ibelick/prompt-kit
/**
 * An icon for the maker of a model, from the set the `model-icon` schematic copies into the app
 * (`public/model-icons` by default, set by its `assetsPath` option; see SOURCES.md there for where
 * each icon comes from and its licence): one monochrome SVG per OpenRouter vendor, the part of the
 * model id before the slash. Served with the app, so nothing is fetched from a third party. Vendors
 * added to OpenRouter later get the neutral box until their icon is added.
 *
 * The set also has an icon per inference provider, the platform serving the model (`groq`,
 * `azure`, `bedrock`, `ollama`, ...; SOURCES.md lists them): get those by file name with
 * the `iconUrl()` function.
 *
 * Feed the results to pk-model-selector (`iconUrl`, `makerIconUrl`) or pk-model-browser
 * (`iconUrl`). The icons are black on transparent: render them with `dark:invert`.
 */

/** Where the icons are served from. The schematic sets this to match its `assetsPath` option. */
const ICON_BASE = '/model-icons';

/** The OpenRouter vendors with an icon of their own. Anything else gets `unknown.svg`. */
export const VENDORS: ReadonlySet<string> = new Set([
  'aion-labs',
  'amazon',
  'anthracite-org',
  'anthropic',
  'arcee-ai',
  'baidu',
  'bytedance',
  'bytedance-seed',
  'cognitivecomputations',
  'cohere',
  'deepseek',
  'dots-studio',
  'fireworks',
  'google',
  'gryphe',
  'ibm-granite',
  'inception',
  'inclusionai',
  'inference-net',
  'kwaipilot',
  'liquid',
  'mancer',
  'meituan',
  'meta',
  'meta-llama',
  'microsoft',
  'minimax',
  'mistralai',
  'moonshotai',
  'morph',
  'nex-agi',
  'nousresearch',
  'nvidia',
  'openai',
  'openrouter',
  'perceptron',
  'perplexity',
  'poolside',
  'prism-ml',
  'qwen',
  'rekaai',
  'relace',
  'sakana',
  'sao10k',
  'stealth',
  'stepfun',
  'tencent',
  'thedrummer',
  'thinkingmachines',
  'typesafe',
  'unbiased',
  'undi95',
  'upstage',
  'writer',
  'x-ai',
  'xiaomi',
  'z-ai',
]);

/** A model as the helpers read it: an OpenRouter-style `vendor/model` id, with `provider` as the
 *  vendor when the id has no prefix. */
export interface IconModel {
  id: string;
  provider?: string;
}

/** The model's icon: its vendor's, with Google's Gemma models getting Gemma's own. */
export function providerIconUrl(model: IconModel): string {
  if (vendorOf(model) === 'google' && /gemma/i.test(model.id)) return `${ICON_BASE}/gemma.svg`;
  return makerIconUrl(model);
}

/** The vendor's own icon, without sub-brands: what pk-model-selector's maker rail shows. */
export function makerIconUrl(model: IconModel): string {
  const vendor = vendorOf(model);
  return `${ICON_BASE}/${VENDORS.has(vendor) ? vendor : 'unknown'}.svg`;
}

/** The icon with this file name (without `.svg`), e.g. `iconUrl('groq')`: for providers, which
 *  are not keyed by model id. Does not check that the file exists. */
export function iconUrl(name: string): string {
  return `${ICON_BASE}/${name}.svg`;
}

/** @deprecated Use `providerIconUrl`; kept so existing callers keep working. */
export const modelIconUrl = providerIconUrl;

// "~anthropic/..." is OpenRouter's alias form of the same vendor.
function vendorOf(model: IconModel): string {
  const vendor = model.id.includes('/') ? model.id.split('/')[0] : (model.provider ?? '');
  return vendor.replace(/^~/, '').toLowerCase();
}
