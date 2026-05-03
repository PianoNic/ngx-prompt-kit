import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-chain-of-thought-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class PkChainOfThoughtItem {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground text-sm', this.class()),
  );
}
