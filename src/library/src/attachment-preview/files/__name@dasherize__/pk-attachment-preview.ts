// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { cn } from '../utils/cn';
import { PkAttachmentChip } from './pk-attachment-chip';
import type { Attachment } from './pk-attachment-types';

@Component({
  selector: 'pk-attachment-preview',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkAttachmentChip],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    @for (a of visible(); track a.id) {
      <pk-attachment-chip
        [attachment]="a"
        [removable]="removable()"
        [locale]="locale()"
        (clicked)="clicked.emit($event)"
        (removed)="removed.emit($event)"
      />
    }
    @if (overflowCount() > 0) {
      <span
        class="border-border bg-muted text-muted-foreground inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md border text-sm font-medium"
        [attr.aria-label]="overflowCount() + ' more'"
      >
        +{{ overflowCount() }}
      </span>
    }
  `,
})
export class PkAttachmentPreview {
  public readonly attachments = input.required<readonly Attachment[]>();
  /** 0 means show all. When > 0, surplus chips collapse into a "+N more" pill. */
  public readonly maxVisible = input<number>(0);
  public readonly removable = input<boolean>(true);
  public readonly locale = input<string | undefined>(undefined);
  public readonly class = input<string>('');

  public readonly clicked = output<string>();
  public readonly removed = output<string>();

  protected readonly hostClass = computed(() =>
    cn('flex items-center gap-2 overflow-x-auto', this.class()),
  );

  protected readonly visible = computed<readonly Attachment[]>(() => {
    const max = this.maxVisible();
    if (max <= 0) return this.attachments();
    return this.attachments().slice(0, max);
  });

  protected readonly overflowCount = computed(() => {
    const max = this.maxVisible();
    if (max <= 0) return 0;
    return Math.max(0, this.attachments().length - max);
  });
}
