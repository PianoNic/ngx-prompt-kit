import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';
import { cn } from '../utils/cn';
import { CHAIN_OF_THOUGHT_STEP_STATE } from './chain-of-thought.state';

@Component({
  selector: 'pk-chain-of-thought-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnCollapsibleContent],
  host: {
    'data-slot': 'cot-content',
    '[class]': 'computedClass()',
  },
  template: `
    <div class="grid grid-cols-[min-content_minmax(0,1fr)] gap-x-4">
      <div class="bg-primary/20 ml-1.75 h-full w-px" [class.hidden]="state.isLast()"></div>
      <div class="ml-1.75 h-full w-px bg-transparent" [class.hidden]="!state.isLast()"></div>
      <div class="mt-2 space-y-2"><ng-content /></div>
    </div>
  `,
})
export class PkChainOfThoughtContent {
  public readonly class = input<string>('');

  protected readonly state = inject(CHAIN_OF_THOUGHT_STEP_STATE);

  // The collapsible measures the content and exposes its height as a CSS variable; the height
  // transition runs between 0 and that.
  protected readonly computedClass = computed(() =>
    cn(
      'text-popover-foreground block overflow-hidden transition-[height] duration-150 ease-out data-[state=closed]:h-0 data-[state=open]:h-(--brn-collapsible-content-height)',
      this.class(),
    ),
  );
}
