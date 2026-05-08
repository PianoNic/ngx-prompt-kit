// ngx-prompt-kit original — not part of ibelick/prompt-kit
export interface BrowserModel {
  id: string;
  name: string;
  iconUrl?: string;
  provider?: string;
  /** Long-form description shown in the detail pane. */
  description?: string;
  /** Optional category/group label — left list groups by this when set. */
  group?: string;
  /** Per-1M-token pricing pair. Both required for the price metric to render. */
  inputPricePer1M?: number;
  outputPricePer1M?: number;
  currency?: string;
  /** Free-form key/value rows shown in the detail pane (Context, Weekly Tokens, etc). */
  metrics?: ReadonlyArray<{ label: string; value: string }>;
  disabled?: boolean;
}

export interface BrowserFilter {
  id: string;
  label: string;
  active?: boolean;
}

export function formatBrowserPrice(amount: number, currency: string, locale?: string): string {
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
