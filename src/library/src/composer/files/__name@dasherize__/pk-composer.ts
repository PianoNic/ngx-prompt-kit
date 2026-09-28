// ngx-prompt-kit original — not part of ibelick/prompt-kit
import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideMaximize2, lucideMinimize2, lucidePlus } from '@ng-icons/lucide';
import { cn } from '../utils/cn';

let nextId = 0;

/**
 * A chat composer: a textarea that grows with its content up to `maxHeight` and then scrolls, a row
 * of actions underneath, and a send button that turns into a stop button while `busy`.
 *
 * Enter sends and Shift+Enter adds a line. On touch screens Enter always adds a line, since there
 * is no Shift key to reach for; the send button is right there.
 *
 * Slots: `[pkComposerTop]` above the text (attachment chips), `[pkComposerStart]` after the attach
 * button, `[pkComposerEnd]` before the send button (a model selector).
 */
@Component({
  selector: 'pk-composer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  providers: [provideIcons({ lucideArrowUp, lucideMaximize2, lucideMinimize2, lucidePlus })],
  host: {
    '[class]': 'computedClass()',
    '(click)': 'focusFromChrome($event)',
  },
  template: `
    <ng-content select="[pkComposerTop]" />

    <div class="relative flex">
      <label class="sr-only" [for]="textareaId">{{ label() }}</label>
      <textarea
        #textarea
        rows="1"
        [id]="textareaId"
        [value]="value()"
        [placeholder]="placeholder()"
        [disabled]="disabled()"
        [attr.aria-describedby]="describedBy() || null"
        [class]="textareaClass()"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
      ></textarea>
      @if (overflowing() || expanded()) {
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground focus-visible:ring-ring/50 absolute end-0 top-0 flex size-8 items-center justify-center rounded-lg outline-none focus-visible:ring-3"
          [attr.aria-label]="expanded() ? 'Shrink message box' : 'Expand message box'"
          [attr.aria-pressed]="expanded()"
          (click)="expanded.set(!expanded())"
        >
          <ng-icon
            [name]="expanded() ? 'lucideMinimize2' : 'lucideMaximize2'"
            class="text-[length:--spacing(4)]"
          />
        </button>
      }
    </div>

    <div class="flex items-center gap-1.5">
      @if (attachable()) {
        <button
          type="button"
          class="border-input hover:bg-accent focus-visible:ring-ring/50 flex size-9 shrink-0 items-center justify-center rounded-full border outline-none focus-visible:ring-3 disabled:opacity-50"
          aria-label="Attach files"
          [disabled]="disabled()"
          (click)="fileInput.click()"
        >
          <ng-icon name="lucidePlus" class="text-[length:--spacing(4.5)]" />
        </button>
        <input
          #fileInput
          type="file"
          class="hidden"
          tabindex="-1"
          aria-hidden="true"
          multiple
          [accept]="accept()"
          (change)="onFiles(fileInput)"
        />
      }
      <ng-content select="[pkComposerStart]" />
      <div class="flex-1"></div>
      <ng-content select="[pkComposerEnd]" />
      @if (busy()) {
        <button
          type="button"
          class="bg-primary text-primary-foreground focus-visible:ring-ring/50 flex size-9 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-3"
          aria-label="Stop generating"
          (click)="stopped.emit()"
        >
          <svg class="size-3.5" viewBox="0 0 24 24" aria-hidden="true">
            <rect x="5" y="5" width="14" height="14" rx="2.5" fill="currentColor" />
          </svg>
        </button>
      } @else {
        <button
          type="button"
          class="bg-primary text-primary-foreground focus-visible:ring-ring/50 flex size-9 shrink-0 items-center justify-center rounded-full outline-none transition-opacity focus-visible:ring-3 disabled:opacity-30"
          aria-label="Send message"
          [disabled]="!canSend()"
          (click)="send()"
        >
          <ng-icon name="lucideArrowUp" class="text-[length:--spacing(4.5)]" />
        </button>
      }
    </div>
  `,
})
export class PkComposer {
  /** The draft. Two-way bindable, so a draft can survive navigation. */
  public readonly value = model('');
  public readonly placeholder = input('Message');
  /** Accessible name for the text box. */
  public readonly label = input('Message');
  /** A reply is being generated: the send button becomes a stop button. */
  public readonly busy = input(false);
  public readonly disabled = input(false);
  /** Keeps the send button disabled, e.g. while attachments upload. */
  public readonly sendBlocked = input(false);
  /** Height in px the text box grows to before it scrolls. */
  public readonly maxHeight = input(200);
  /** Shows the attach button, which opens a file picker. */
  public readonly attachable = input(false);
  /** File types the picker offers, as for `<input type="file" accept>`. */
  public readonly accept = input('');
  public readonly describedBy = input('');
  public readonly class = input('');

  /** The trimmed draft, on Enter or the send button. The draft is cleared. */
  public readonly submitted = output<string>();
  public readonly stopped = output<void>();
  /** Files picked through the attach button. */
  public readonly filesPicked = output<File[]>();

  /** The composer's element, e.g. to anchor a model selector's panel to the whole composer. */
  public readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  /** The text box is grown to most of the viewport, for long drafts. */
  public readonly expanded = signal(false);
  protected readonly overflowing = signal(false);
  protected readonly textareaId = `pk-composer-${nextId++}`;

  private readonly textarea = viewChild.required<ElementRef<HTMLTextAreaElement>>('textarea');
  private readonly coarsePointer =
    typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;

  protected readonly canSend = computed(
    () => this.value().trim().length > 0 && !this.disabled() && !this.sendBlocked(),
  );

  protected readonly computedClass = computed(() =>
    cn('flex cursor-text flex-col gap-1.5 py-3 ps-4 pe-3', this.class()),
  );

  protected readonly textareaClass = computed(() =>
    cn(
      'placeholder:text-muted-foreground w-full resize-none bg-transparent py-1 ps-0.5 text-[15px] leading-normal outline-none disabled:cursor-not-allowed',
      (this.overflowing() || this.expanded()) && 'pe-9',
    ),
  );

  constructor() {
    // Size to the content after every render that could change it: typing, a draft set from
    // outside, or toggling the expanded state.
    afterRenderEffect(() => {
      this.value();
      const expanded = this.expanded();
      const element = this.textarea().nativeElement;
      const cap = expanded ? Math.round(window.innerHeight * 0.6) : this.maxHeight();

      element.style.height = 'auto';
      const natural = element.scrollHeight;
      element.style.height = `${expanded ? cap : Math.min(natural, cap)}px`;
      // Scroll only once the text is taller than the box; below that, sub-pixel rounding would
      // otherwise show a scrollbar on a single line.
      element.style.overflowY = natural > cap ? 'auto' : 'hidden';
      this.overflowing.set(natural > this.maxHeight());
    });
  }

  focus(): void {
    this.textarea().nativeElement.focus();
  }

  protected onInput(event: Event): void {
    this.value.set((event.target as HTMLTextAreaElement).value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing || this.coarsePointer) return;
    event.preventDefault();
    if (!this.busy()) this.send();
  }

  protected send(): void {
    if (!this.canSend()) return;
    this.submitted.emit(this.value().trim());
    this.value.set('');
    // If Enter lands before the last keystroke has rendered, the [value] binding sees '' before
    // and after and leaves the sent text in the box, so clear the box directly.
    this.textarea().nativeElement.value = '';
    this.expanded.set(false);
  }

  protected onFiles(input: HTMLInputElement): void {
    const files = Array.from(input.files ?? []);
    input.value = '';
    if (files.length) this.filesPicked.emit(files);
  }

  /** A click on the composer's padding focuses the text box, like a click inside it. */
  protected focusFromChrome(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.focus();
  }
}
