// ngx-prompt-kit original — not part of ibelick/prompt-kit
export type ModelTier = 'fast' | 'balanced' | 'smart';

export interface Model {
  id: string;
  name: string;
  provider?: string;
  tagline?: string;
  tier?: ModelTier;
  /** Per-1M-token pricing in `currency`. Both prices must be set for the price line to render. */
  inputPricePer1M?: number;
  outputPricePer1M?: number;
  currency?: string;
  disabled?: boolean;
}

/** Locale-aware currency formatter; respects zero-decimal currencies (JPY, KRW, etc). */
export function formatModelPrice(amount: number, currency: string, locale?: string): string {
  const probe = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions();
  if (probe.maximumFractionDigits === 0) {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
