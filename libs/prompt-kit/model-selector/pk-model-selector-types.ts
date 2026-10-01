// ngx-prompt-kit original — not part of ibelick/prompt-kit

/** A model the selector can offer. Deliberately API-agnostic: map your own types onto it. */
export interface SelectorModel {
  id: string;
  name: string;
  /** Shorter label for the trigger on narrow screens (e.g. `Sonnet 5.5`). Falls back to `name`. */
  shortName?: string;
  /** Grouping key and rail/chip label, e.g. `Anthropic`. */
  maker: string;
  /** Brand icon (URL or data URI). `providerIconUrl` from `../model-icon` resolves one from an id. */
  iconUrl?: string;
  /** The maker's own icon for the rail, when a model's icon is a sub-brand's (Gemma under Google). Falls back to the first model's `iconUrl`. */
  makerIconUrl?: string;
  /** One line shown under the name (truncated). Also searched. */
  description?: string;
  /** Small chip labels next to the name, e.g. `Vision`, `Reasoning`. Also searched. */
  capabilities?: readonly string[];
  /** Relative price: 1 = `$`, 2 = `$$`, 3 = `$$$`. See `priceTier()`. */
  priceTier?: PriceTier;
  /** Cost hint under the price tier, e.g. `≈ 14 credits`. */
  costLabel?: string;
  disabled?: boolean;
}

/** A curated group (e.g. "Best for most tasks") shown under the sections rail entry. */
export interface SelectorSection {
  id: string;
  label: string;
  /** Muted text next to the label, e.g. `A good default for everyday work`. */
  description?: string;
  /** Model ids in display order. Unknown ids are skipped. */
  modelIds: readonly string[];
}

export type PriceTier = 1 | 2 | 3;

/**
 * Blended per-1M-token price boundaries (in your pricing currency, USD by default).
 * `blended < low` → 1, `blended < high` → 2, otherwise 3.
 */
export interface PriceTierThresholds {
  low: number;
  high: number;
}

/**
 * Defaults tuned on 2026 list prices: cheap/fast models (Haiku, Flash, mini) land
 * under $2.50, mainstream models (Sonnet, GPT-5) under $10, flagships above.
 */
export const DEFAULT_PRICE_TIER_THRESHOLDS: PriceTierThresholds = { low: 2.5, high: 10 };

/** Input tokens weighted 3:1 against output — the usual chat traffic mix. */
const INPUT_WEIGHT = 3;
const OUTPUT_WEIGHT = 1;

/**
 * Buckets a model into a `$` / `$$` / `$$$` tier from its per-1M-token prices.
 *
 * The blended price is `(3 × input + 1 × output) / 4`, compared against
 * `thresholds` (default `{ low: 2.5, high: 10 }`, see
 * `DEFAULT_PRICE_TIER_THRESHOLDS`). Throws a `RangeError` for negative or
 * non-finite prices, or when `low > high`.
 */
export function priceTier(
  inputPricePer1M: number,
  outputPricePer1M: number,
  thresholds: Partial<PriceTierThresholds> = {},
): PriceTier {
  const { low, high } = { ...DEFAULT_PRICE_TIER_THRESHOLDS, ...thresholds };
  for (const [label, value] of [
    ['inputPricePer1M', inputPricePer1M],
    ['outputPricePer1M', outputPricePer1M],
  ] as const) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError(`${label} must be a finite, non-negative number (got ${value}).`);
    }
  }
  if (!Number.isFinite(low) || !Number.isFinite(high) || low > high) {
    throw new RangeError(`Invalid thresholds: low (${low}) must not exceed high (${high}).`);
  }
  const blended =
    (inputPricePer1M * INPUT_WEIGHT + outputPricePer1M * OUTPUT_WEIGHT) /
    (INPUT_WEIGHT + OUTPUT_WEIGHT);
  if (blended < low) return 1;
  if (blended < high) return 2;
  return 3;
}

/** A run of text, flagged when it matches the search query. */
export interface HighlightSegment {
  text: string;
  match: boolean;
}

/** Splits `text` around every case-insensitive occurrence of `query`. */
export function highlightSegments(text: string, query: string): HighlightSegment[] {
  const q = query.trim().toLowerCase();
  if (!q) return [{ text, match: false }];
  const lower = text.toLowerCase();
  const out: HighlightSegment[] = [];
  let from = 0;
  let at = lower.indexOf(q, from);
  while (at !== -1) {
    if (at > from) out.push({ text: text.slice(from, at), match: false });
    out.push({ text: text.slice(at, at + q.length), match: true });
    from = at + q.length;
    at = lower.indexOf(q, from);
  }
  if (from < text.length) out.push({ text: text.slice(from), match: false });
  return out;
}

/** Case-insensitive match on name, maker, description and capabilities. */
export function modelMatches(model: SelectorModel, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [model.name, model.maker, model.description ?? '', ...(model.capabilities ?? [])]
    .join('\n')
    .toLowerCase();
  return haystack.includes(q);
}
