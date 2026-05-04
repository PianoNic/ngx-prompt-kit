// ngx-prompt-kit original — not part of ibelick/prompt-kit
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucidePencil, lucideTrash } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmDropdownMenu,
  HlmDropdownMenuItem,
  HlmDropdownMenuTrigger,
} from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';
import type { Conversation } from './pk-conversation-types';

export interface ConversationRename {
  id: string;
  title: string;
}

@Component({
  selector: 'pk-conversation-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmButton,
    HlmIconImports,
    HlmDropdownMenu,
    HlmDropdownMenuItem,
    HlmDropdownMenuTrigger,
  ],
  providers: [provideIcons({ lucideEllipsis, lucidePencil, lucideTrash })],
  template: `
    <div [class]="rowClass()" class="group relative">
      @if (editing()) {
        <input
          #editInput
          type="text"
          [value]="draft()"
          (input)="onDraftInput($event)"
          (keydown.enter)="commitRename()"
          (keydown.escape)="cancelRename()"
          (blur)="commitRename()"
          class="bg-background border-border focus-visible:ring-ring w-full rounded-md border px-2 py-1.5 text-sm outline-none focus-visible:ring-2"
          aria-label="Rename conversation"
        />
      } @else {
        <button
          type="button"
          (click)="selected.emit(conversation().id)"
          class="flex min-w-0 flex-1 flex-col items-start gap-0.5 overflow-hidden text-left"
        >
          <span class="text-foreground w-full truncate text-sm font-medium">
            {{ conversation().title }}
          </span>
          @if (conversation().preview; as p) {
            <span class="text-muted-foreground w-full truncate text-xs">{{ p }}</span>
          }
        </button>
        <div
          class="opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
        >
          <button
            hlmBtn
            variant="ghost"
            size="icon-sm"
            type="button"
            aria-label="Conversation actions"
            [hlmDropdownMenuTrigger]="menu"
          >
            <ng-icon hlm size="xs" name="lucideEllipsis" />
          </button>
          <ng-template #menu>
            <hlm-dropdown-menu>
              <button hlmDropdownMenuItem type="button" (triggered)="startRename()">
                <ng-icon hlm size="xs" name="lucidePencil" />
                Rename
              </button>
              <button
                hlmDropdownMenuItem
                variant="destructive"
                type="button"
                (triggered)="deleted.emit(conversation().id)"
              >
                <ng-icon hlm size="xs" name="lucideTrash" />
                Delete
              </button>
            </hlm-dropdown-menu>
          </ng-template>
        </div>
      }
    </div>
  `,
})
export class PkConversationItem {
  public readonly conversation = input.required<Conversation>();
  public readonly isActive = input<boolean>(false);
  public readonly class = input<string>('');

  public readonly selected = output<string>();
  public readonly renamed = output<ConversationRename>();
  public readonly deleted = output<string>();

  protected readonly editing = signal(false);
  protected readonly draft = signal('');
  private readonly editInput = viewChild<ElementRef<HTMLInputElement>>('editInput');

  protected readonly rowClass = computed(() =>
    cn(
      'flex items-center gap-1 rounded-md px-2 py-1.5 transition-colors',
      this.isActive() ? 'bg-accent' : 'hover:bg-muted',
      this.class(),
    ),
  );

  protected onDraftInput(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  protected startRename(): void {
    this.draft.set(this.conversation().title);
    this.editing.set(true);
    queueMicrotask(() => this.editInput()?.nativeElement.focus());
  }

  protected commitRename(): void {
    if (!this.editing()) return;
    const next = this.draft().trim();
    const original = this.conversation().title;
    this.editing.set(false);
    if (next.length > 0 && next !== original) {
      this.renamed.emit({ id: this.conversation().id, title: next });
    }
  }

  protected cancelRename(): void {
    this.editing.set(false);
    this.draft.set('');
  }
}
