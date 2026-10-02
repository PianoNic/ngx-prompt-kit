// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideImage, lucideMusic, lucidePaperclip, lucideVideo, lucideX } from '@ng-icons/lucide';
import { HlmAttachmentImports } from '@spartan-ng/helm/attachment';
import { cn } from '../utils/cn';
import { type Attachment, formatAttachmentSize } from './pk-attachment-types';

/**
 * One attachment as a spartan `hlm-attachment`: an image thumbnail, or an icon with the file's
 * name and size. The whole chip previews it (`clicked`); the remove action (`removed`) sits in the
 * chip's actions.
 */
@Component({
  selector: 'pk-attachment-chip',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmAttachmentImports, NgIcon],
  providers: [provideIcons({ lucideImage, lucideMusic, lucidePaperclip, lucideVideo, lucideX })],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <div hlmAttachment size="sm" [class]="attachmentClass()">
      @if (isImageWithThumb()) {
        <div hlmAttachmentMedia variant="image">
          <img [src]="attachment().thumbnailUrl" [alt]="attachment().name" />
        </div>
      } @else {
        <div hlmAttachmentMedia>
          <ng-icon [name]="iconName()" class="text-muted-foreground" />
        </div>
        <div hlmAttachmentContent>
          <span hlmAttachmentTitle class="font-normal">{{ attachment().name }}</span>
          @if (formattedSize(); as s) {
            <span hlmAttachmentDescription>{{ s }}</span>
          }
        </div>
      }
      <button
        hlmAttachmentTrigger
        class="rounded-[inherit]"
        (click)="clicked.emit(attachment().id)"
        [attr.aria-label]="'Preview ' + attachment().name"
      ></button>
      @if (removable()) {
        <div hlmAttachmentActions>
          <button
            hlmAttachmentAction
            (click)="removed.emit(attachment().id)"
            [attr.aria-label]="'Remove ' + attachment().name"
          >
            <ng-icon name="lucideX" />
          </button>
        </div>
      }
    </div>
  `,
})
export class PkAttachmentChip {
  public readonly attachment = input.required<Attachment>();
  public readonly removable = input<boolean>(true);
  public readonly locale = input<string | undefined>(undefined);
  public readonly class = input<string>('');

  public readonly clicked = output<string>();
  public readonly removed = output<string>();

  protected readonly hostClass = computed(() => cn('inline-flex shrink-0', this.class()));

  protected readonly isImageWithThumb = computed(
    () => this.attachment().type === 'image' && !!this.attachment().thumbnailUrl,
  );

  protected readonly attachmentClass = computed(() =>
    // No fixed height: name and size need their room, and a box shorter than that pushes them off centre.
    this.isImageWithThumb() ? 'min-w-fit' : 'max-w-xs',
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
