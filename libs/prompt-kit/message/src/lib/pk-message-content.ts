import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PkMarkdown } from 'prompt-kit-ng/markdown';
import { cn } from 'prompt-kit-ng/utils';

@Component({
  selector: 'pk-message-content',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkMarkdown],
  template: `
    @if (markdown()) {
      <pk-markdown [content]="content() ?? ''" [class]="computedClass()" />
    } @else {
      <div [class]="computedClass()">
        @if (content(); as c) {
          {{ c }}
        }
        <ng-content />
      </div>
    }
  `,
})
export class PkMessageContent {
  public readonly markdown = input<boolean>(false);
  public readonly content = input<string | undefined>(undefined);
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn(
      'rounded-lg p-2 text-foreground bg-secondary prose break-words whitespace-normal',
      this.class(),
    ),
  );
}
