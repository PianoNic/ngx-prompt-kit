// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { cn } from '../utils/cn';

export type CostDisplayMode = 'compact' | 'detailed' | 'session-summary';

type ThresholdState = 'normal' | 'warn' | 'danger' | 'over';

@Component({
  selector: 'pk-cost-display',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    'aria-live': 'polite',
  },
  template: `
    @if (display() === 'session-summary') {
      <span [class]="primaryClass()">
        {{ formattedTotal() }}
        <span class="text-muted-foreground ml-1 text-xs font-normal">this session</span>
      </span>
      @if (effectiveBreakdown()) {
        <span class="text-muted-foreground ml-2 text-xs tabular-nums">{{ breakdownText() }}</span>
      }
    } @else {
      <span [class]="primaryClass()">{{ formattedTotal() }}</span>
      @if (effectiveBreakdown()) {
        <span
          class="text-muted-foreground ml-1 tabular-nums"
          [class.text-xs]="display() !== 'detailed'"
        >
          {{ breakdownText() }}
        </span>
      }
    }
  `,
})
export class PkCostDisplay {
  public readonly inputTokens = input<number>(0);
  public readonly outputTokens = input<number>(0);
  public readonly inputPricePer1M = input<number | null>(null);
  public readonly outputPricePer1M = input<number | null>(null);
  /** ISO 4217 currency code (e.g. 'USD', 'EUR', 'CHF', 'GBP', 'JPY'). */
  public readonly currency = input<string>('USD');
  /** BCP-47 locale tag (e.g. 'en-US', 'de-CH', 'ja-JP'). Defaults to the runtime locale. */
  public readonly locale = input<string | undefined>(undefined);
  public readonly costPrecision = input<number>(4);
  public readonly costLimit = input<number | null>(null);
  public readonly display = input<CostDisplayMode>('compact');
  public readonly showBreakdown = input<boolean>(false);
  public readonly class = input<string>('');

  public readonly overLimit = output<boolean>();

  protected readonly inputCost = computed(() => {
    const price = this.inputPricePer1M();
    return price == null ? 0 : (this.inputTokens() / 1_000_000) * price;
  });

  protected readonly outputCost = computed(() => {
    const price = this.outputPricePer1M();
    return price == null ? 0 : (this.outputTokens() / 1_000_000) * price;
  });

  protected readonly totalCost = computed(() => this.inputCost() + this.outputCost());

  /** Detailed mode shows breakdown by default; other modes opt in via showBreakdown. */
  protected readonly effectiveBreakdown = computed(
    () => this.showBreakdown() || this.display() === 'detailed',
  );

  private readonly formatter = computed(() => {
    const currency = this.currency();
    const locale = this.locale();
    // Probe the currency's natural fraction-digit defaults. Zero-decimal currencies
    // (JPY, KRW, etc) keep their integer-only formatting; otherwise we extend
    // maximumFractionDigits to costPrecision so sub-cent amounts render legibly.
    const probe = new Intl.NumberFormat(locale, { style: 'currency', currency }).resolvedOptions();
    if (probe.maximumFractionDigits === 0) {
      return new Intl.NumberFormat(locale, { style: 'currency', currency });
    }
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: this.costPrecision(),
    });
  });

  protected readonly formattedTotal = computed(() => this.formatter().format(this.totalCost()));

  protected readonly breakdownText = computed(
    () =>
      `(in: ${this.formatter().format(this.inputCost())}, out: ${this.formatter().format(this.outputCost())})`,
  );

  protected readonly state = computed<ThresholdState>(() => {
    const lim = this.costLimit();
    if (lim == null || lim <= 0) return 'normal';
    const ratio = this.totalCost() / lim;
    if (ratio > 1) return 'over';
    if (ratio >= 0.9) return 'danger';
    if (ratio >= 0.75) return 'warn';
    return 'normal';
  });

  protected readonly primaryClass = computed(() => {
    const state = this.state();
    const isSummary = this.display() === 'session-summary';
    const tone =
      state === 'over'
        ? 'text-destructive font-semibold'
        : state === 'danger'
          ? 'text-destructive'
          : state === 'warn'
            ? 'text-amber-600 dark:text-amber-500'
            : isSummary
              ? 'text-foreground'
              : 'text-muted-foreground';
    const size = isSummary ? 'text-base font-medium' : 'text-xs';
    return cn(size, 'tabular-nums', tone);
  });

  protected readonly hostClass = computed(() => {
    const isSummary = this.display() === 'session-summary';
    return cn(
      isSummary
        ? 'border-border bg-background inline-flex items-center rounded-full border px-3 py-1.5'
        : 'inline-flex items-center',
      this.class(),
    );
  });

  constructor() {
    let prevOver = false;
    effect(() => {
      const isOver = this.state() === 'over';
      if (isOver !== prevOver) {
        prevOver = isOver;
        this.overLimit.emit(isOver);
      }
    });
  }
}
