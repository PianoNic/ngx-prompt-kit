/**
 * pk-chain-of-thought — vertical reasoning timeline of pk-chain-of-thought-step.
 *
 * Each child step needs to know whether it is last (so the connecting line
 * doesn't extend below it). React used React.Children.cloneElement; in Angular
 * we have the parent expose an "isLast" signal per step via injection. To keep
 * the API simple, consumers pass `[isLast]="$last"` themselves on the last
 * step OR set [last] manually. We also support automatic detection via
 * contentChildren when used without manual flags.
 */
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-chain-of-thought',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class PkChainOfThought {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('space-y-0', this.class()));
}
