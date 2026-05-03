import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from 'prompt-kit-ng/utils';

@Component({
  selector: 'pk-chat-container-scroll-anchor',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'aria-hidden': 'true',
    '[class]': 'computedClass()',
  },
  template: ``,
})
export class PkChatContainerScrollAnchor {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('h-px w-full shrink-0 scroll-mt-4', this.class()),
  );
}
