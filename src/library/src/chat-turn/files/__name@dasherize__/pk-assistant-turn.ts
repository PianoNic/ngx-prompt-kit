// ngx-prompt-kit original — not part of ibelick/prompt-kit
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideCopy } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { cn } from '../utils/cn';

const COPIED_FOR_MS = 1500;

/**
 * An assistant's reply: which model answered, the reply itself (projected), and a row underneath
 * with a copy button on the left and room on the right for details such as what the reply cost
 * (`[pkAssistantTurnMeta]`). Extra actions go in `[pkAssistantTurnActions]`, after copy.
 *
 * While `streaming`, the action row is held back, since there is nothing final to copy yet.
 */
@Component({
  selector: 'pk-assistant-turn',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, NgIcon],
  providers: [provideIcons({ lucideCheck, lucideCopy })],
  host: {
    '[class]': 'computedClass()',
  },
  template: `
    @if (modelName()) {
      <div class="text-muted-foreground flex items-center gap-2 text-[13px]">
        @if (iconUrl(); as src) {
          <img [src]="src" alt="" class="size-4 dark:invert" />
        }
        {{ modelName() }}
      </div>
    }

    <div class="text-[15px] leading-[1.65]">
      <ng-content />
    </div>

    @if (!streaming()) {
      <div class="text-muted-foreground -ms-2 flex items-center gap-0.5">
        @if (copyText()) {
          <button
            hlmBtn
            variant="ghost"
            size="icon"
            type="button"
            [attr.aria-label]="copied() ? 'Copied' : 'Copy'"
            (click)="copy()"
          >
            <ng-icon
              [name]="copied() ? 'lucideCheck' : 'lucideCopy'"
              class="text-[length:--spacing(4)]"
            />
          </button>
        }
        <ng-content select="[pkAssistantTurnActions]" />
        <span class="flex-1"></span>
        <span class="text-xs"><ng-content select="[pkAssistantTurnMeta]" /></span>
      </div>
    }
    <span class="sr-only" aria-live="polite">{{ copied() ? 'Copied to clipboard' : '' }}</span>
  `,
})
export class PkAssistantTurn {
  /** Name of the model that answered, shown above the reply. */
  public readonly modelName = input('');
  /** Brand icon for the model (e.g. from `modelIconUrl`). Monochrome icons invert in dark mode. */
  public readonly iconUrl = input<string | undefined>(undefined);
  /** The text the copy button puts on the clipboard; no copy button without it. */
  public readonly copyText = input('');
  public readonly streaming = input(false);
  public readonly class = input('');

  protected readonly copied = signal(false);
  private timer: ReturnType<typeof setTimeout> | undefined;

  protected readonly computedClass = computed(() => cn('flex flex-col gap-3', this.class()));

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.copyText());
    this.copied.set(true);
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.copied.set(false), COPIED_FOR_MS);
  }
}
