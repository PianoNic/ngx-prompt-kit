// ngx-prompt-kit original — not part of ibelick/prompt-kit
import {
  createFlexibleConnectedPositionStrategy,
  createOverlayRef,
  createRepositionScrollStrategy,
  type OverlayRef,
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import {
  afterNextRender,
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  Directive,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  untracked,
  type ComponentRef,
} from '@angular/core';
import {
  emojiForShortcode,
  findCompleteShortcode,
  findEmojiToken,
  loadEmojiIndex,
  searchEmoji,
  type EmojiIndex,
  type EmojiMatch,
  type EmojiToken,
} from './emoji-search';

let nextId = 0;

/** The list the autocomplete shows above its text box. Created by `pkEmojiAutocomplete`. */
@Component({
  selector: 'pk-emoji-autocomplete-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'block w-full' },
  template: `
    @let ac = autocomplete();
    <div class="bg-popover text-popover-foreground overflow-hidden rounded-lg border p-1 shadow-md">
      <div [id]="ac.listId + '-label'" class="text-muted-foreground px-2 pt-1 pb-1.5 text-xs">
        Emoji matching <span class="text-foreground font-medium">:{{ ac.query() }}</span>
      </div>
      <ul
        role="listbox"
        [id]="ac.listId"
        [attr.aria-labelledby]="ac.listId + '-label'"
        class="max-h-72 overflow-y-auto"
      >
        @for (match of ac.matches(); track match.emoji; let i = $index) {
          <li
            role="option"
            [id]="ac.listId + '-' + i"
            [attr.aria-selected]="i === ac.activeIndex()"
            class="flex cursor-default items-center gap-2.5 rounded-md px-2 py-1.5 text-sm select-none"
            [class.bg-accent]="i === ac.activeIndex()"
            [class.text-accent-foreground]="i === ac.activeIndex()"
            (mousedown)="$event.preventDefault()"
            (mousemove)="ac.activeIndex.set(i)"
            (click)="ac.insert(match)"
          >
            <span class="text-lg leading-none">{{ match.emoji }}</span>
            <span>:{{ match.shortcode }}:</span>
          </li>
        }
      </ul>
    </div>
  `,
})
export class PkEmojiAutocompleteList {
  public readonly autocomplete = input.required<PkEmojiAutocomplete>();
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    // Keep the highlighted row in view when the arrow keys move past the visible rows.
    afterRenderEffect(() => {
      const ac = this.autocomplete();
      const id = `${ac.listId}-${ac.activeIndex()}`;
      this.element.nativeElement
        .querySelector(`[id="${id}"]`)
        ?.scrollIntoView({ block: 'nearest' });
    });
  }
}

/**
 * Discord-style emoji shortcodes for a text box. Typing `:so` (a colon at the start or after a
 * space, then at least two letters) lists matching emoji above the box; Arrow Up and Down move the
 * highlight, Enter or Tab inserts the emoji in place of `:so`, Escape closes the list, and a click
 * on a row inserts it. A whole `:sob:` turns into its emoji on the closing colon.
 *
 * While the list is open it takes Enter, Tab, Escape and the arrow keys before anything else on
 * the text box sees them, so Enter picks an emoji instead of sending.
 *
 * Put it on a `<textarea>` (or `<input>`), or on an element that contains one, such as
 * `<pk-composer pkEmojiAutocomplete>`. Text is inserted through the native box and announced with
 * an `input` event, so `[(value)]`, `ngModel` and reactive forms all pick it up.
 *
 * The emoji list (gemoji) is loaded with a dynamic import the first time a shortcode is typed.
 */
@Directive({
  selector: '[pkEmojiAutocomplete]',
  exportAs: 'pkEmojiAutocomplete',
})
export class PkEmojiAutocomplete {
  /** Most rows the list shows. */
  public readonly maxResults = input(8);
  /** Characters after the colon before the list opens. */
  public readonly minChars = input(2);
  /** Turns the autocomplete off without removing the directive. */
  public readonly emojiAutocompleteDisabled = input(false);

  /** An emoji was inserted, from the list or from a typed `:shortcode:`. */
  public readonly emojiInserted = output<EmojiMatch>();

  public readonly listId = `pk-emoji-autocomplete-${nextId++}`;
  /** Highlighted row. */
  public readonly activeIndex = signal(0);

  private readonly token = signal<EmojiToken | null>(null);
  private readonly emojiIndex = signal<EmojiIndex | null>(null);

  /** What follows the colon, e.g. `so`. */
  public readonly query = computed(() => this.token()?.query ?? '');
  public readonly matches = computed<EmojiMatch[]>(() => {
    const token = this.token();
    const index = this.emojiIndex();
    return token && index ? searchEmoji(index, token.query, this.maxResults()) : [];
  });
  /** The list is showing. */
  public readonly open = computed(() => this.matches().length > 0);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private textbox: HTMLTextAreaElement | HTMLInputElement | null = null;
  private overlayRef: OverlayRef | null = null;
  private listRef: ComponentRef<PkEmojiAutocompleteList> | null = null;
  /** Start of a token closed with Escape; it stays closed until that token is gone. */
  private dismissedAt = -1;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const host = this.host.nativeElement;
      const box =
        host instanceof HTMLTextAreaElement || host instanceof HTMLInputElement
          ? host
          : (host.querySelector('textarea') ?? host.querySelector('input'));
      if (!box) return;
      this.textbox = box;
      box.setAttribute('aria-autocomplete', 'list');
      const target: HTMLElement = box;

      const onKeydown = (event: KeyboardEvent) => this.onKeydown(event);
      const onInput = (event: Event) => this.onInput(event);
      const refresh = () => this.refresh();
      const onKeyup = (event: KeyboardEvent) => {
        if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) this.refresh();
      };
      const close = () => this.token.set(null);
      // Capture, so the list sees keys before the box's own handlers (a composer sends on Enter).
      target.addEventListener('keydown', onKeydown, true);
      target.addEventListener('input', onInput);
      target.addEventListener('click', refresh);
      target.addEventListener('keyup', onKeyup);
      target.addEventListener('blur', close);
      destroyRef.onDestroy(() => {
        target.removeEventListener('keydown', onKeydown, true);
        target.removeEventListener('input', onInput);
        target.removeEventListener('click', refresh);
        target.removeEventListener('keyup', onKeyup);
        target.removeEventListener('blur', close);
      });
    });

    effect(() => {
      const open = this.open();
      const active = this.activeIndex();
      const box = this.textbox;
      if (box) {
        if (open) {
          box.setAttribute('aria-controls', this.listId);
          box.setAttribute('aria-activedescendant', `${this.listId}-${active}`);
        } else {
          box.removeAttribute('aria-controls');
          box.removeAttribute('aria-activedescendant');
        }
      }
      untracked(() => (open ? this.show() : this.hide()));
    });

    destroyRef.onDestroy(() => this.overlayRef?.dispose());
  }

  /** Puts `match.emoji` in place of the typed `:query` and closes the list. */
  public insert(match: EmojiMatch): void {
    const token = this.token();
    if (!token) return;
    this.replace(token.start, token.end, match);
  }

  /** Closes the list until the current shortcode is gone. */
  public dismiss(): void {
    this.dismissedAt = this.token()?.start ?? -1;
    this.token.set(null);
  }

  private onKeydown(event: KeyboardEvent): void {
    if (!this.open() || event.isComposing) return;
    const count = this.matches().length;
    switch (event.key) {
      case 'ArrowDown':
        this.activeIndex.update((i) => (i + 1) % count);
        break;
      case 'ArrowUp':
        this.activeIndex.update((i) => (i - 1 + count) % count);
        break;
      case 'Enter':
      case 'Tab':
        if (event.shiftKey) return;
        this.insert(this.matches()[Math.min(this.activeIndex(), count - 1)]);
        break;
      case 'Escape':
        this.dismiss();
        break;
      default:
        return;
    }
    event.preventDefault();
    event.stopImmediatePropagation();
  }

  private onInput(event: Event): void {
    const box = this.textbox;
    if (!box || this.emojiAutocompleteDisabled()) return;
    // A whole `:shortcode:` turns into its emoji when the closing colon is typed.
    const index = this.emojiIndex();
    if (index && event instanceof InputEvent && event.data?.endsWith(':')) {
      const complete = findCompleteShortcode(box.value, box.selectionStart ?? 0);
      const emoji = complete && emojiForShortcode(index, complete.shortcode);
      if (complete && emoji) {
        this.replace(complete.start, complete.end, { emoji, shortcode: complete.shortcode });
        return;
      }
    }
    this.refresh();
  }

  private refresh(): void {
    const box = this.textbox;
    if (!box || this.emojiAutocompleteDisabled() || box.selectionStart !== box.selectionEnd) {
      this.token.set(null);
      return;
    }
    const token = findEmojiToken(box.value, box.selectionStart ?? 0, this.minChars());
    if (!token) this.dismissedAt = -1;
    if (token && token.start === this.dismissedAt) {
      this.token.set(null);
      return;
    }
    if (token?.query !== this.token()?.query) this.activeIndex.set(0);
    this.token.set(token);
    if (token && !this.emojiIndex()) {
      void loadEmojiIndex().then((index) => {
        this.emojiIndex.set(index);
      });
    }
  }

  private replace(start: number, end: number, match: EmojiMatch): void {
    const box = this.textbox;
    if (!box) return;
    box.focus();
    box.setRangeText(match.emoji, start, end, 'end');
    this.token.set(null);
    box.dispatchEvent(new Event('input', { bubbles: true }));
    this.emojiInserted.emit(match);
  }

  private show(): void {
    this.overlayRef ??= createOverlayRef(this.injector, {
      positionStrategy: createFlexibleConnectedPositionStrategy(this.injector, this.host)
        .withPositions([
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -8 },
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
        ])
        .withViewportMargin(8)
        .withPush(false),
      scrollStrategy: createRepositionScrollStrategy(this.injector),
    });
    if (!this.listRef) {
      this.listRef = this.overlayRef.attach(
        new ComponentPortal(PkEmojiAutocompleteList, null, this.injector),
      );
      this.listRef.setInput('autocomplete', this);
    }
    this.overlayRef.updateSize({ width: this.host.nativeElement.getBoundingClientRect().width });
    this.overlayRef.updatePosition();
  }

  private hide(): void {
    if (!this.listRef) return;
    this.overlayRef?.detach();
    this.listRef = null;
  }
}
