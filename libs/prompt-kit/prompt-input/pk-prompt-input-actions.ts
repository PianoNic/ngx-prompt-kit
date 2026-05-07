import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-prompt-input-actions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class PkPromptInputActions {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('flex items-center gap-2', this.class()));
}
