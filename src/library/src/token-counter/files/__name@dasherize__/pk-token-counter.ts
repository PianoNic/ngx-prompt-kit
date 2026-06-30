// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { cn } from '../utils/cn';

export type TokenCounterMode = 'chars' | 'tokens' | 'both';
export type TokenCounterDisplay =
  | 'hidden'
  | 'compact'
  | 'progress'
  | 'detailed'
  | 'remaining'
  | 'footer';

type ThresholdState = 'normal' | 'warn' | 'danger' | 'over';

const defaultEstimator = (text: string): number => Math.ceil(text.length / 4);
const fmt = new Intl.NumberFormat();

@Component({
  selector: 'pk-token-counter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    'aria-live': 'polite',
  },
  template: `
    @if (visible()) {
      @if (display() === 'progress') {
        <div class="flex w-full items-center justify-between gap-2">
          <span [class]="textClass()">{{ primaryText() }}</span>
          @if (secondaryText(); as s) {
            <span class="text-muted-foreground text-xs tabular-nums">{{ s }}</span>
          }
        </div>
        <div class="bg-muted mt-1 h-1.5 w-full overflow-hidden rounded-full">
          <div
            class="h-full transition-all"
            [class]="barClass()"
            [style.width.%]="barPercent()"
          ></div>
        </div>
      } @else {
        <span [class]="textClass()">{{ primaryText() }}</span>
        @if (secondaryText(); as s) {
          <span
            class="text-muted-foreground ml-1 tabular-nums"
            [class.text-xs]="display() !== 'footer'"
            [class.text-[10px]]="display() === 'footer'"
            >{{ s }}</span
          >
        }
      }
    }
  `,
})
export class PkTokenCounter {
  public readonly text = input.required<string>();
  public readonly mode = input<TokenCounterMode>('chars');
  public readonly display = input<TokenCounterDisplay>('compact');
  public readonly limit = input<number | null>(null);
  public readonly appearAt = input<number>(0.75);
  public readonly estimateTokens = input<(text: string) => number>(defaultEstimator);
  public readonly class = input<string>('');

  public readonly overLimit = output<boolean>();

  protected readonly chars = computed(() => this.text().length);
  protected readonly tokens = computed(() => this.estimateTokens()(this.text()));

  /** The metric the limit constrains. 'chars'/'both' constrain chars; 'tokens' constrains tokens. */
  protected readonly primaryValue = computed(() =>
    this.mode() === 'tokens' ? this.tokens() : this.chars(),
  );

  protected readonly remainingValue = computed(() => {
    const lim = this.limit();
    return lim == null ? 0 : Math.max(0, lim - this.primaryValue());
  });

  protected readonly visible = computed(() => {
    if (this.display() !== 'hidden') return true;
    const lim = this.limit();
    if (lim == null) return false;
    return this.primaryValue() / lim >= this.appearAt();
  });

  protected readonly state = computed<ThresholdState>(() => {
    const lim = this.limit();
    if (lim == null) return 'normal';
    const ratio = this.primaryValue() / lim;
    if (this.display() === 'remaining') {
      // Inverse framing: color from how little headroom is left.
      if (ratio > 1) return 'over';
      const remainingRatio = 1 - ratio;
      if (remainingRatio < 0.1) return 'danger';
      if (remainingRatio < 0.25) return 'warn';
      return 'normal';
    }
    if (ratio > 1) return 'over';
    if (ratio >= 0.9) return 'danger';
    if (ratio >= 0.75) return 'warn';
    return 'normal';
  });

  protected readonly barPercent = computed(() => {
    const lim = this.limit();
    if (lim == null) return 0;
    return Math.min(100, (this.primaryValue() / lim) * 100);
  });

  protected readonly primaryText = computed(() => {
    const lim = this.limit();
    const value = this.primaryValue();
    const display = this.display();
    const isBoth = this.mode() === 'both';

    if (display === 'remaining') {
      const r = this.remainingValue();
      return lim == null
        ? `${fmt.format(r)} remaining`
        : `${fmt.format(r)} / ${fmt.format(lim)} remaining`;
    }

    if (display === 'footer') {
      // Leading separator; value only (no limit/percent — footer is post-response context).
      return `· ${fmt.format(value)}`;
    }

    if (lim == null) {
      const base = fmt.format(value);
      return isBoth ? `${base} chars` : base;
    }

    const base = `${fmt.format(value)} / ${fmt.format(lim)}`;
    if (display === 'detailed' || display === 'progress') {
      const pct = Math.round((value / lim) * 100);
      return `${base} (${pct}%)`;
    }
    return base;
  });

  protected readonly secondaryText = computed<string | null>(() => {
    if (this.mode() !== 'both') return null;
    if (this.display() === 'remaining') return null;
    return `· ${fmt.format(this.tokens())} tokens`;
  });

  protected readonly textClass = computed(() => {
    const state = this.state();
    const isFooter = this.display() === 'footer';
    const tone =
      state === 'over'
        ? 'text-destructive font-semibold'
        : state === 'danger'
          ? 'text-destructive'
          : state === 'warn'
            ? 'text-amber-600 dark:text-amber-500'
            : 'text-muted-foreground';
    return cn(isFooter ? 'text-[10px]' : 'text-xs', 'tabular-nums', tone);
  });

  protected readonly barClass = computed(() => {
    const state = this.state();
    return state === 'over' || state === 'danger'
      ? 'bg-destructive'
      : state === 'warn'
        ? 'bg-amber-500'
        : 'bg-primary';
  });

  protected readonly hostClass = computed(() =>
    cn(
      this.display() === 'progress' ? 'flex w-full flex-col' : 'inline-flex items-center',
      this.class(),
    ),
  );

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
