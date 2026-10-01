import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-steps-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnCollapsibleContent],
  host: {
    'data-slot': 'steps-content',
    '[class]': 'computedClass()',
  },
  template: `
    <div
      class="grid max-w-full min-w-0 grid-cols-[min-content_minmax(0,1fr)] items-start gap-x-3 pt-3"
    >
      <div class="bg-muted ml-1.5 h-full w-[2px] self-stretch" aria-hidden="true"></div>
      <div class="min-w-0 space-y-2"><ng-content /></div>
    </div>
  `,
})
export class PkStepsContent {
  public readonly class = input<string>('');

  // The collapsible measures the content and exposes its height as a CSS variable; the height
  // transition runs between 0 and that.
  protected readonly computedClass = computed(() =>
    cn(
      'text-popover-foreground block overflow-hidden transition-[height] duration-150 ease-out data-[state=closed]:h-0 data-[state=open]:h-(--brn-collapsible-content-height)',
      this.class(),
    ),
  );
}
