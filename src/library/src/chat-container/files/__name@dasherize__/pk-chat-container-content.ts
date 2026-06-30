import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-chat-container-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class PkChatContainerContent {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() => cn('flex w-full flex-col', this.class()));
}
