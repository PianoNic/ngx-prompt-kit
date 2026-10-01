/**
 * pk-text-shimmer — animated text gradient that sweeps left→right.
 *
 * Inputs:
 *   text:     string  — body text (alternative: project content via <ng-content>)
 *   duration: number  — animation period in seconds (default 4)
 *   spread:   number  — gradient stop spread, clamped 5..45 (default 20)
 *   class:    string  — extra utility classes
 *
 * Mirrors ibelick/prompt-kit text-shimmer. Under reduced motion it is plain muted text. It is only
 * the look: put `role="status"` on the element around it where screen readers should hear it.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-text-shimmer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      [class]="computedClass()"
      [style.--pk-shimmer-gradient]="backgroundImage()"
      [style.--pk-shimmer-duration]="duration() + 's'"
    >
      @if (text(); as t) {
        {{ t }}
      }
      <ng-content />
    </span>
  `,
  styles: `
    span {
      color: var(--muted-foreground);
    }
    @media (prefers-reduced-motion: no-preference) {
      span {
        color: transparent;
        background: var(--pk-shimmer-gradient) 0 0 / 200% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        animation: pk-text-shimmer var(--pk-shimmer-duration) linear infinite;
      }
    }
    @keyframes pk-text-shimmer {
      from {
        background-position: 200% 0;
      }
      to {
        background-position: -200% 0;
      }
    }
  `,
})
export class PkTextShimmer {
  public readonly text = input<string>('');
  public readonly duration = input<number>(4);
  public readonly spread = input<number>(20);
  public readonly class = input<string>('');

  private readonly clampedSpread = computed(() => Math.min(Math.max(this.spread(), 5), 45));

  protected readonly computedClass = computed(() => cn('inline-block font-medium', this.class()));

  protected readonly backgroundImage = computed(() => {
    const s = this.clampedSpread();
    return `linear-gradient(to right, var(--muted-foreground) ${50 - s}%, var(--foreground) 50%, var(--muted-foreground) ${50 + s}%)`;
  });
}
