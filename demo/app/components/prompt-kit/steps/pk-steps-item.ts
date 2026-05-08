import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-steps-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'computedClass()' },
  template: `<ng-content />`,
})
export class PkStepsItem {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground text-sm', this.class()),
  );
}
