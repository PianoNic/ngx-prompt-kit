import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-code-block-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class PkCodeBlockGroup {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('flex items-center justify-between', this.class()),
  );
}
