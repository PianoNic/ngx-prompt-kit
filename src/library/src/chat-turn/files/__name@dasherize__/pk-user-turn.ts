// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

/** A user's message: a soft bubble on the right, keeping line breaks as typed. */
@Component({
  selector: 'pk-user-turn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    <ng-content select="[pkUserTurnTop]" />
    <div
      class="bg-secondary text-secondary-foreground max-w-[76%] rounded-[22px] px-[18px] py-3 text-[15px] leading-[1.55] break-words whitespace-pre-wrap"
    >
      <ng-content />
    </div>
  `,
})
export class PkUserTurn {
  public readonly class = input('');

  protected readonly computedClass = computed(() =>
    cn('flex flex-col items-end gap-2', this.class()),
  );
}
