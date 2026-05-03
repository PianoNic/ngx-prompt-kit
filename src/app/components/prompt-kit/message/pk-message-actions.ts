import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-message-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class PkMessageActions {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('text-muted-foreground flex items-center gap-2', this.class()),
  );
}
