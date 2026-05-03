import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-message',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class PkMessage {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('flex gap-3', this.class()));
}
