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
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideEllipsis, lucidePencil, lucideTrash } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmDropdownMenu,
  HlmDropdownMenuItem,
  HlmDropdownMenuTrigger,
} from '@spartan-ng/helm/dropdown-menu';
import { cn } from '../utils/cn';
import type { Conversation } from './pk-conversation-types';

export interface ConversationRename {
  id: string;
  title: string;
}

/** The row's main control stretches over the whole row, so the full row is clickable. */
const ROW_TARGET =
  'min-w-0 flex-1 py-2 text-left outline-none after:absolute after:inset-0 after:rounded-[inherit] focus-visible:after:ring-2 focus-visible:after:ring-ring/50';

@Component({
  selector: 'pk-conversation-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    HlmButton,
    NgIcon,
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
          class="bg-background border-border focus-visible:ring-ring my-1 w-full rounded-md border px-2 py-1 text-sm outline-none focus-visible:ring-2"
          aria-label="Rename conversation"
        />
      } @else {
        @if (link(); as path) {
          <a
            [routerLink]="path"
            [attr.aria-current]="isActive() ? 'page' : null"
            (click)="selected.emit(conversation().id)"
            [class]="rowTarget"
            class="truncate text-sm"
          >
            {{ conversation().title }}
          </a>
        } @else {
          <button
            type="button"
            [attr.aria-current]="isActive() ? 'page' : null"
            (click)="selected.emit(conversation().id)"
            [class]="rowTarget"
            class="flex flex-col items-start gap-0.5 overflow-hidden"
          >
            <span class="w-full truncate text-sm">{{ conversation().title }}</span>
            @if (conversation().preview; as p) {
              <span class="text-muted-foreground w-full truncate text-xs">{{ p }}</span>
            }
          </button>
        }
        <div
          class="relative opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 has-aria-expanded:opacity-100"
        >
          <button
            hlmBtn
            variant="ghost"
            size="icon-sm"
            type="button"
            aria-label="Conversation actions"
            [hlmDropdownMenuTrigger]="menu"
          >
            <ng-icon name="lucideEllipsis" class="text-[length:--spacing(3)]" />
          </button>
          <ng-template #menu>
            <hlm-dropdown-menu>
              <button hlmDropdownMenuItem type="button" (triggered)="startRename()">
                <ng-icon name="lucidePencil" class="text-[length:--spacing(3)]" />
                Rename
              </button>
              <button
                hlmDropdownMenuItem
                variant="destructive"
                type="button"
                (triggered)="deleted.emit(conversation().id)"
              >
                <ng-icon name="lucideTrash" class="text-[length:--spacing(3)]" />
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
  /** Router path to open the conversation; the row renders as a link when set. */
  public readonly link = input<string | readonly unknown[] | null>(null);
  public readonly class = input<string>('');

  public readonly selected = output<string>();
  public readonly renamed = output<ConversationRename>();
  public readonly deleted = output<string>();

  protected readonly rowTarget = ROW_TARGET;
  protected readonly editing = signal(false);
  protected readonly draft = signal('');
  private readonly editInput = viewChild<ElementRef<HTMLInputElement>>('editInput');

  protected readonly rowClass = computed(() =>
    cn(
      'flex items-center gap-1 rounded-[10px] ps-2.5 pe-1 transition-colors',
      this.isActive() ? 'bg-accent font-medium' : 'hover:bg-accent/60',
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
