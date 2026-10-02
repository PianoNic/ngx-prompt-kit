import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { BrnCollapsibleContent } from '@spartan-ng/brain/collapsible';
import { PkMarkdown } from '../markdown/pk-markdown';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-reasoning-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkMarkdown],
  hostDirectives: [BrnCollapsibleContent],
  host: {
    'data-slot': 'reasoning-content',
    '[class]': 'computedClass()',
  },
  template: `
    <div [class]="innerClass()">
      @if (markdown()) {
        <pk-markdown [content]="content() ?? ''" />
      } @else {
        @if (content(); as c) {
          {{ c }}
        }
        <ng-content />
      }
    </div>
  `,
})
export class PkReasoningContent {
  public readonly markdown = input<boolean>(false);
  public readonly content = input<string | undefined>(undefined);
  public readonly class = input<string>('');
  public readonly contentClass = input<string>('');

  // The collapsible measures the content and exposes its height as a CSS variable; the height
  // transition runs between 0 and that.
  protected readonly computedClass = computed(() =>
    cn(
      'block overflow-hidden transition-[height] duration-150 ease-out data-[state=closed]:h-0 data-[state=open]:h-(--brn-collapsible-content-height)',
      this.class(),
    ),
  );
  protected readonly innerClass = computed(() =>
    cn('text-muted-foreground prose prose-sm dark:prose-invert', this.contentClass()),
  );
}
