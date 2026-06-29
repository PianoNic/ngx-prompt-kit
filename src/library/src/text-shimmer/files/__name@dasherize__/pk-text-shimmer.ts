/**
 * pk-text-shimmer — animated text gradient that sweeps left→right.
 *
 * Inputs:
 *   text:     string  — body text (alternative: project content via <ng-content>)
 *   duration: number  — animation period in seconds (default 4)
 *   spread:   number  — gradient stop spread, clamped 5..45 (default 20)
 *   class:    string  — extra utility classes
 *
 * Mirrors ibelick/prompt-kit text-shimmer. Pure CSS keyframe (`shimmer`) defined
 * in pk-text-shimmer.css; this component sets ViewEncapsulation.None so the
 * keyframe registers globally and the animation actually runs.
 */
import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
  computed,
  input,
} from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-text-shimmer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  styleUrl: './pk-text-shimmer.css',
  template: `
    <span
      [class]="computedClass()"
      [style.background-image]="backgroundImage()"
      [style.background-size]="'200% auto'"
      [style.-webkit-background-clip]="'text'"
      [style.animation]="animation()"
    >
      @if (text(); as t) {
        {{ t }}
      }
      <ng-content />
    </span>
  `,
})
export class PkTextShimmer {
  public readonly text = input<string>('');
  public readonly duration = input<number>(4);
  public readonly spread = input<number>(20);
  public readonly class = input<string>('');

  private readonly clampedSpread = computed(() => Math.min(Math.max(this.spread(), 5), 45));

  protected readonly computedClass = computed(() =>
    cn('inline-block bg-clip-text font-medium text-transparent', this.class()),
  );

  protected readonly backgroundImage = computed(() => {
    const s = this.clampedSpread();
    return `linear-gradient(to right, var(--muted-foreground) ${50 - s}%, var(--foreground) 50%, var(--muted-foreground) ${50 + s}%)`;
  });

  protected readonly animation = computed(() => `shimmer ${this.duration()}s infinite linear`);
}
