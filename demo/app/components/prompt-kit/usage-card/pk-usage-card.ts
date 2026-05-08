// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import { cn } from '../utils/cn';

export type UsageCardDisplay = 'ring' | 'inline' | 'card';
type ThresholdState = 'normal' | 'warn' | 'over';

@Component({
  selector: 'pk-usage-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, HlmCard, HlmTooltip],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    @switch (display()) {
      @case ('ring') {
        <ng-template #ringTip>
          <span>{{ tooltipText() }}</span>
        </ng-template>
        <div [hlmTooltip]="ringTip" class="flex items-center gap-3" [attr.aria-label]="ariaLabel()">
          <div
            class="relative shrink-0"
            [style.width.px]="ringSize()"
            [style.height.px]="ringSize()"
          >
            <svg
              [attr.width]="ringSize()"
              [attr.height]="ringSize()"
              [attr.viewBox]="'0 0 ' + ringSize() + ' ' + ringSize()"
              aria-hidden="true"
            >
              <circle
                [attr.cx]="ringSize() / 2"
                [attr.cy]="ringSize() / 2"
                [attr.r]="ringRadius()"
                [attr.stroke-width]="ringStroke()"
                fill="none"
                class="stroke-muted"
              />
              @if (hasLimit()) {
                <circle
                  [attr.cx]="ringSize() / 2"
                  [attr.cy]="ringSize() / 2"
                  [attr.r]="ringRadius()"
                  [attr.stroke-width]="ringStroke()"
                  fill="none"
                  stroke-linecap="round"
                  [class]="ringFgClass()"
                  [attr.stroke-dasharray]="ringCircumference()"
                  [attr.stroke-dashoffset]="ringDashOffset()"
                  [attr.transform]="'rotate(-90 ' + ringSize() / 2 + ' ' + ringSize() / 2 + ')'"
                  style="transition: stroke-dashoffset 200ms ease-out;"
                />
              }
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              @if (avatar(); as src) {
                <img
                  [src]="src"
                  [alt]="name() || 'Avatar'"
                  class="rounded-full object-cover"
                  [style.width.px]="avatarInnerSize()"
                  [style.height.px]="avatarInnerSize()"
                />
              } @else {
                <span
                  class="bg-muted text-muted-foreground flex items-center justify-center rounded-full text-[10px] font-medium uppercase"
                  [style.width.px]="avatarInnerSize()"
                  [style.height.px]="avatarInnerSize()"
                  aria-hidden="true"
                >
                  {{ initials() }}
                </span>
              }
            </div>
          </div>
          @if (name() || sublabel()) {
            <div class="flex min-w-0 flex-col leading-tight">
              @if (name(); as n) {
                <span class="text-foreground truncate text-sm font-medium">{{ n }}</span>
              }
              @if (sublabel(); as s) {
                <span class="text-muted-foreground truncate text-xs">{{ s }}</span>
              }
            </div>
          }
        </div>
      }
      @case ('inline') {
        <div class="flex w-full items-center gap-3" [attr.aria-label]="ariaLabel()">
          @if (avatar() || name()) {
            <div class="shrink-0">
              @if (avatar(); as src) {
                <img
                  [src]="src"
                  [alt]="name() || 'Avatar'"
                  class="h-9 w-9 rounded-full object-cover"
                />
              } @else {
                <span
                  class="bg-muted text-muted-foreground flex h-9 w-9 items-center justify-center rounded-full text-xs font-medium uppercase"
                  aria-hidden="true"
                >
                  {{ initials() }}
                </span>
              }
            </div>
          }
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            @if (name() || sublabel() || hasLimit()) {
              <div class="flex items-baseline justify-between gap-2 leading-tight">
                <div class="flex min-w-0 flex-col">
                  @if (name(); as n) {
                    <span class="text-foreground truncate text-sm font-medium">{{ n }}</span>
                  }
                  @if (sublabel(); as s) {
                    <span class="text-muted-foreground truncate text-xs">{{ s }}</span>
                  }
                </div>
                @if (hasLimit()) {
                  <span [class]="numberClass()">{{ readout() }}</span>
                }
              </div>
            }
            @if (hasLimit()) {
              <div class="bg-muted h-1.5 w-full overflow-hidden rounded-full">
                <div
                  class="h-full transition-[width] duration-200 ease-out"
                  [class]="barFillClass()"
                  [style.width.%]="percent()"
                ></div>
              </div>
            }
          </div>
        </div>
      }
      @default {
        <!-- card mode -->
        <div hlmCard class="flex flex-col gap-3 p-4" [attr.aria-label]="ariaLabel()">
          @if (avatar() || name() || sublabel()) {
            <div class="flex items-center gap-2">
              @if (avatar(); as src) {
                <img
                  [src]="src"
                  [alt]="name() || 'Avatar'"
                  class="h-7 w-7 shrink-0 rounded-full object-cover"
                />
              } @else if (name()) {
                <span
                  class="bg-muted text-muted-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-medium uppercase"
                  aria-hidden="true"
                >
                  {{ initials() }}
                </span>
              }
              <div class="flex min-w-0 flex-col leading-tight">
                @if (name(); as n) {
                  <span class="text-foreground truncate text-sm font-medium">{{ n }}</span>
                }
                @if (sublabel(); as s) {
                  <span class="text-muted-foreground truncate text-xs">{{ s }}</span>
                }
              </div>
            </div>
          }
          <div class="flex items-baseline justify-between gap-2">
            <span class="text-muted-foreground text-xs uppercase tracking-wider">
              {{ label() }}
            </span>
            @if (hasLimit()) {
              <span [class]="numberClass()">{{ readout() }}</span>
            } @else {
              <span class="text-foreground text-xs tabular-nums"
                >{{ formatNumber(used()) }} {{ unit() }}</span
              >
            }
          </div>
          @if (hasLimit()) {
            <div class="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div
                class="h-full transition-[width] duration-200 ease-out"
                [class]="barFillClass()"
                [style.width.%]="percent()"
              ></div>
            </div>
          }
          @if (topUpLabel(); as cta) {
            <div class="flex justify-end">
              <button
                hlmBtn
                variant="outline"
                size="sm"
                type="button"
                (click)="topUpClicked.emit()"
              >
                {{ cta }}
              </button>
            </div>
          }
        </div>
      }
    }
  `,
})
export class PkUsageCard {
  public readonly used = input.required<number>();
  public readonly limit = input.required<number | null>();
  public readonly display = input<UsageCardDisplay>('ring');
  public readonly avatar = input<string | undefined>(undefined);
  public readonly name = input<string | undefined>(undefined);
  public readonly sublabel = input<string | undefined>(undefined);
  public readonly label = input<string>('Usage');
  public readonly unit = input<string>('tokens');
  public readonly showPercentage = input<boolean>(true);
  public readonly locale = input<string | undefined>(undefined);
  public readonly ringSize = input<number>(40);
  public readonly ringStroke = input<number>(2.5);
  /**
   * When true, drops the threshold-color traffic-light in favor of a single
   * neutral foreground color across ring stroke, bar fill, and number text.
   * Adapts to theme — reads as near-white in dark mode, near-black in light.
   * Useful when usage is informational rather than actionable.
   */
  public readonly monochrome = input<boolean>(false);
  /**
   * When set, the card-mode renders a Top-up button with this label and emits
   * (topUpClicked) on press. Null (default) hides the button entirely — no
   * dead CTA when consumers haven't wired anything.
   */
  public readonly topUpLabel = input<string | null>(null);
  public readonly class = input<string>('');

  public readonly topUpClicked = output<void>();

  protected readonly hostClass = computed(() => {
    const d = this.display();
    return cn(d === 'card' || d === 'inline' ? 'block w-full' : 'inline-block', this.class());
  });

  protected readonly hasLimit = computed(() => {
    const l = this.limit();
    return typeof l === 'number' && l > 0;
  });

  protected readonly percent = computed(() => {
    const l = this.limit();
    if (typeof l !== 'number' || l <= 0) return 0;
    return Math.min(100, Math.max(0, (this.used() / l) * 100));
  });

  protected readonly state = computed<ThresholdState>(() => {
    if (!this.hasLimit()) return 'normal';
    const ratio = this.used() / (this.limit() as number);
    if (ratio >= 1) return 'over';
    if (ratio >= 0.9) return 'over';
    if (ratio >= 0.75) return 'warn';
    return 'normal';
  });

  protected readonly ringRadius = computed(() => this.ringSize() / 2 - this.ringStroke() / 2);
  protected readonly ringCircumference = computed(() => 2 * Math.PI * this.ringRadius());
  protected readonly ringDashOffset = computed(() => {
    const c = this.ringCircumference();
    return c - (this.percent() / 100) * c;
  });

  /** Inner avatar diameter inside the ring — leaves a small gap between stroke and avatar. */
  protected readonly avatarInnerSize = computed(() =>
    Math.max(0, this.ringSize() - 2 * this.ringStroke() - 4),
  );

  protected readonly ringFgClass = computed(() => {
    if (this.monochrome()) return 'stroke-foreground';
    switch (this.state()) {
      case 'over':
        return 'stroke-destructive';
      case 'warn':
        return 'stroke-amber-500';
      default:
        return 'stroke-primary';
    }
  });

  protected readonly barFillClass = computed(() => {
    if (this.monochrome()) return 'bg-foreground';
    switch (this.state()) {
      case 'over':
        return 'bg-destructive';
      case 'warn':
        return 'bg-amber-500';
      default:
        return 'bg-primary';
    }
  });

  protected readonly numberClass = computed(() => {
    if (this.monochrome()) return 'text-foreground text-xs tabular-nums';
    const tone =
      this.state() === 'over'
        ? 'text-destructive font-semibold'
        : this.state() === 'warn'
          ? 'text-amber-600 dark:text-amber-500'
          : 'text-foreground';
    return cn('text-xs tabular-nums', tone);
  });

  protected readonly readout = computed(() => {
    const used = this.formatNumber(this.used());
    const limit = this.formatNumber(this.limit() ?? 0);
    const pct = this.showPercentage() ? ` · ${Math.round(this.percent())}%` : '';
    return `${used} / ${limit}${pct}`;
  });

  protected readonly tooltipText = computed(() => {
    if (!this.hasLimit()) {
      return `${this.label()}: ${this.formatNumber(this.used())} ${this.unit()}`;
    }
    return `${this.label()}: ${this.readout()}`;
  });

  protected readonly ariaLabel = computed(() => this.tooltipText());

  protected readonly initials = computed(() => {
    const n = this.name()?.trim();
    if (!n) return '?';
    const first = n[0];
    const second = n.split(/\s+/)[1]?.[0] ?? '';
    return (first + second).toUpperCase().slice(0, 2);
  });

  protected formatNumber(n: number): string {
    return new Intl.NumberFormat(this.locale()).format(n);
  }
}
