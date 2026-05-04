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
import { lucideEllipsis, lucidePencil } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmDropdownMenu,
  HlmDropdownMenuItem,
  HlmDropdownMenuTrigger,
} from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { cn } from '../utils/cn';

export type MessageEditTrigger =
  | 'pencil-below'
  | 'pencil-below-persistent'
  | 'icon-below'
  | 'pencil-overlay'
  | 'menu-overlay'
  | 'hidden';

@Component({
  selector: 'pk-message-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmButton,
    HlmIconImports,
    HlmTextarea,
    HlmDropdownMenu,
    HlmDropdownMenuItem,
    HlmDropdownMenuTrigger,
  ],
  providers: [provideIcons({ lucidePencil, lucideEllipsis })],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    @if (editing()) {
      <div class="flex w-full flex-col gap-2">
        <textarea
          #editTextarea
          hlmTextarea
          class="max-h-64 w-full"
          [value]="draft()"
          (input)="onDraftInput($event)"
          (keydown.escape)="cancel()"
          (keydown.control.enter)="save()"
          (keydown.meta.enter)="save()"
          aria-label="Edit message"
        ></textarea>
        <div class="flex items-center justify-end gap-2">
          <button hlmBtn variant="ghost" size="sm" type="button" (click)="cancel()">Cancel</button>
          <button hlmBtn size="sm" type="button" [disabled]="!canSave()" (click)="save()">
            Save
          </button>
        </div>
      </div>
    } @else {
      <div [class]="viewClass()">
        <div class="relative inline-block">
          <ng-content />
          @if (editable() && editTrigger() === 'pencil-overlay') {
            <button
              hlmBtn
              variant="ghost"
              size="icon-sm"
              type="button"
              (click)="startEdit()"
              aria-label="Edit message"
              class="bg-background border-border absolute -right-2 -top-2 rounded-full border opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <ng-icon hlm size="xs" name="lucidePencil" />
            </button>
          }
          @if (editable() && editTrigger() === 'menu-overlay') {
            <button
              hlmBtn
              variant="ghost"
              size="icon-sm"
              type="button"
              [hlmDropdownMenuTrigger]="menu"
              aria-label="Message actions"
              class="bg-background border-border absolute -right-2 -top-2 rounded-full border opacity-0 shadow-sm transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
            >
              <ng-icon hlm size="xs" name="lucideEllipsis" />
            </button>
            <ng-template #menu>
              <hlm-dropdown-menu>
                <button hlmDropdownMenuItem type="button" (triggered)="startEdit()">
                  <ng-icon hlm size="xs" name="lucidePencil" />
                  Edit
                </button>
              </hlm-dropdown-menu>
            </ng-template>
          }
        </div>
        @if (editable() && editTrigger() === 'pencil-below') {
          <div
            class="flex justify-end opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <button
              hlmBtn
              variant="ghost"
              size="sm"
              type="button"
              (click)="startEdit()"
              aria-label="Edit message"
            >
              <ng-icon hlm size="xs" name="lucidePencil" />
              Edit
            </button>
          </div>
        }
        @if (editable() && editTrigger() === 'pencil-below-persistent') {
          <div class="flex justify-end">
            <button
              hlmBtn
              variant="ghost"
              size="sm"
              type="button"
              (click)="startEdit()"
              aria-label="Edit message"
            >
              <ng-icon hlm size="xs" name="lucidePencil" />
              Edit
            </button>
          </div>
        }
        @if (editable() && editTrigger() === 'icon-below') {
          <div
            class="flex justify-end opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <button
              hlmBtn
              variant="ghost"
              size="icon-sm"
              type="button"
              (click)="startEdit()"
              aria-label="Edit message"
            >
              <ng-icon hlm size="xs" name="lucidePencil" />
            </button>
          </div>
        }
      </div>
    }
  `,
})
export class PkMessageEdit {
  public readonly content = input.required<string>();
  public readonly editable = input<boolean>(true);
  public readonly editTrigger = input<MessageEditTrigger>('pencil-overlay');
  public readonly class = input<string>('');

  public readonly saved = output<string>();
  public readonly cancelled = output<void>();

  protected readonly editing = signal(false);
  protected readonly draft = signal('');
  private readonly editTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('editTextarea');

  protected readonly canSave = computed(() => this.draft().trim().length > 0);

  protected readonly hostClass = computed(() => {
    if (this.editing()) {
      return cn('flex w-full flex-col', this.class());
    }
    const t = this.editTrigger();
    const isBelow = t === 'pencil-below' || t === 'pencil-below-persistent' || t === 'icon-below';
    return cn(isBelow ? 'flex w-fit flex-col' : 'inline-block w-fit', this.class());
  });

  protected readonly viewClass = computed(() => {
    const t = this.editTrigger();
    const isBelow = t === 'pencil-below' || t === 'pencil-below-persistent' || t === 'icon-below';
    return isBelow ? 'group flex flex-col items-stretch gap-1' : 'group inline-block';
  });

  protected onDraftInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  /**
   * Switch into edit mode programmatically. Useful when
   * editTrigger='hidden' and the consumer wires their own affordance
   * (a global keyboard shortcut, a separate menu item, etc).
   */
  public startEdit(): void {
    if (!this.editable()) return;
    this.draft.set(this.content());
    this.editing.set(true);
    queueMicrotask(() => {
      const el = this.editTextarea()?.nativeElement;
      if (el) {
        el.focus();
        el.setSelectionRange(el.value.length, el.value.length);
      }
    });
  }

  protected save(): void {
    if (!this.editing() || !this.canSave()) return;
    const next = this.draft();
    this.editing.set(false);
    if (next !== this.content()) {
      this.saved.emit(next);
    }
  }

  protected cancel(): void {
    if (!this.editing()) return;
    this.editing.set(false);
    this.draft.set('');
    this.cancelled.emit();
  }
}
