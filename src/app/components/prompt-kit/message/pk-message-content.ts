import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PkMarkdown } from '../markdown/pk-markdown';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-message-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkMarkdown],
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    @if (markdown()) {
      <pk-markdown [content]="content() ?? ''" />
    } @else {
      @if (content(); as c) {
        {{ c }}
      }
      <ng-content />
    }
  `,
})
export class PkMessageContent {
  public readonly markdown = input<boolean>(false);
  public readonly content = input<string | undefined>(undefined);
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn(
      'inline-block rounded-xl px-3 py-2 text-foreground bg-secondary prose break-words whitespace-normal',
      this.class(),
    ),
  );
}
