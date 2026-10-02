// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HlmBubble, HlmBubbleContent } from '@spartan-ng/helm/bubble';
import { cn } from '../utils/cn';

/** A user's message: a spartan bubble on the right, keeping line breaks as typed. */
@Component({
  selector: 'pk-user-turn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmBubble, HlmBubbleContent],
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    <ng-content select="[pkUserTurnTop]" />
    <div hlmBubble variant="secondary" align="end" class="max-w-[76%]">
      <div
        hlmBubbleContent
        class="rounded-[22px] px-[18px] py-3 text-[15px] leading-[1.55] whitespace-pre-wrap"
      >
        <ng-content />
      </div>
    </div>
  `,
})
export class PkUserTurn {
  public readonly class = input('');

  protected readonly computedClass = computed(() =>
    cn('flex flex-col items-end gap-2', this.class()),
  );
}
