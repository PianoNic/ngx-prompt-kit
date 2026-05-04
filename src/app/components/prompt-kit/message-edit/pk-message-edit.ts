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
import { lucidePencil } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-message-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, HlmIconImports, HlmTextarea],
  providers: [provideIcons({ lucidePencil })],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    @if (editing()) {
      <div class="flex w-full flex-col gap-2">
        <textarea
          #editTextarea
          hlmTextarea
          class="w-full"
          [value]="draft()"
          (input)="onDraftInput($event)"
          (keydown.escape)="cancel()"
          (keydown.control.enter)="save()"
          (keydown.meta.enter)="save()"
          aria-label="Edit message"
        ></textarea>
        <div class="flex items-center justify-end gap-2">
          <button hlmBtn variant="ghost" size="sm" type="button" (click)="cancel()">Cancel</button>
          <button hlmBtn size="sm" type="button" (click)="save()">Save</button>
        </div>
      </div>
    } @else {
      <div class="group relative inline-block">
        <ng-content />
        @if (editable()) {
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
      </div>
    }
  `,
})
export class PkMessageEdit {
  public readonly content = input.required<string>();
  public readonly editable = input<boolean>(true);
  public readonly class = input<string>('');

  public readonly saved = output<string>();
  public readonly cancelled = output<void>();

  protected readonly editing = signal(false);
  protected readonly draft = signal('');
  private readonly editTextarea = viewChild<ElementRef<HTMLTextAreaElement>>('editTextarea');

  protected readonly hostClass = computed(() =>
    cn(this.editing() ? 'flex w-full flex-col' : 'inline-block w-fit', this.class()),
  );

  protected onDraftInput(event: Event): void {
    this.draft.set((event.target as HTMLTextAreaElement).value);
  }

  protected startEdit(): void {
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
    if (!this.editing()) return;
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
