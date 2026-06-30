// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideImage, lucideMusic, lucidePaperclip, lucideVideo, lucideX } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';
import { type Attachment, formatAttachmentSize } from './pk-attachment-types';

@Component({
  selector: 'pk-attachment-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, HlmIconImports],
  providers: [provideIcons({ lucideImage, lucideMusic, lucidePaperclip, lucideVideo, lucideX })],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    @if (isImageWithThumb()) {
      <button
        type="button"
        (click)="clicked.emit(attachment().id)"
        [attr.aria-label]="'Preview ' + attachment().name"
        class="border-border bg-muted block h-12 w-12 overflow-hidden rounded-md border focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
      >
        <img
          [src]="attachment().thumbnailUrl"
          [alt]="attachment().name"
          class="h-full w-full object-cover"
        />
      </button>
    } @else {
      <button
        type="button"
        (click)="clicked.emit(attachment().id)"
        [attr.aria-label]="'Preview ' + attachment().name"
        class="border-border bg-muted hover:bg-accent flex h-12 max-w-xs items-center gap-2 rounded-md border px-3 text-left transition-colors focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none"
      >
        <ng-icon hlm size="sm" [name]="iconName()" class="text-muted-foreground shrink-0" />
        <div class="flex min-w-0 flex-col leading-tight">
          <span class="text-foreground truncate text-sm">{{ attachment().name }}</span>
          @if (formattedSize(); as s) {
            <span class="text-muted-foreground text-[11px]">{{ s }}</span>
          }
        </div>
      </button>
    }

    @if (removable()) {
      <button
        hlmBtn
        variant="secondary"
        size="icon-sm"
        type="button"
        (click)="removed.emit(attachment().id)"
        [attr.aria-label]="'Remove ' + attachment().name"
        class="bg-background border-border absolute -right-1.5 -top-1.5 size-5 rounded-full border opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
      >
        <ng-icon hlm size="xs" name="lucideX" />
      </button>
    }
  `,
})
export class PkAttachmentChip {
  public readonly attachment = input.required<Attachment>();
  public readonly removable = input<boolean>(true);
  public readonly locale = input<string | undefined>(undefined);
  public readonly class = input<string>('');

  public readonly clicked = output<string>();
  public readonly removed = output<string>();

  protected readonly hostClass = computed(() =>
    cn('group relative inline-flex shrink-0', this.class()),
  );

  protected readonly isImageWithThumb = computed(
    () => this.attachment().type === 'image' && !!this.attachment().thumbnailUrl,
  );

  protected readonly iconName = computed(() => {
    switch (this.attachment().type) {
      case 'image':
        return 'lucideImage';
      case 'audio':
        return 'lucideMusic';
      case 'video':
        return 'lucideVideo';
      default:
        return 'lucidePaperclip';
    }
  });

  protected readonly formattedSize = computed<string | null>(() => {
    const size = this.attachment().size;
    if (typeof size !== 'number') return null;
    return formatAttachmentSize(size, this.locale());
  });
}
