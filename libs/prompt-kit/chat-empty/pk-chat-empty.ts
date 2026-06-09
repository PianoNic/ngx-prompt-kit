// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';

export interface ChatEmptySuggestion {
  label: string;
  /** Lucide icon name. Consumer must register it via provideIcons() at usage site. */
  icon?: string;
  /** Prompt text emitted with (suggestionPicked); useful for prefilling the input. */
  prompt: string;
}

@Component({
  selector: 'pk-chat-empty',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmCard, HlmCardContent, HlmIconImports],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <div class="flex flex-col items-center text-center">
      <h2 class="text-foreground text-3xl font-medium tracking-tight">{{ title() }}</h2>
      @if (subtitle(); as s) {
        <p class="text-muted-foreground mt-2 max-w-md text-sm">{{ s }}</p>
      }
    </div>

    @if (suggestions().length > 0) {
      <!-- Flex-wrap with justify-center so 1-4 cards sit centered without
           a stranded empty column. Sizing matches the previous 1/2/4-col
           grid at the same breakpoints. -->
      <div class="mt-8 flex w-full max-w-3xl flex-wrap justify-center gap-3">
        @for (s of suggestions(); track s.label) {
          <button
            type="button"
            (click)="suggestionPicked.emit(s)"
            class="basis-full text-left sm:basis-[calc(50%-0.375rem)] lg:basis-[170px]"
          >
            <div hlmCard class="hover:bg-accent h-full transition-colors">
              <div hlmCardContent class="flex flex-col gap-2">
                @if (s.icon; as icon) {
                  <ng-icon hlm size="sm" [name]="icon" class="text-muted-foreground" />
                }
                <span class="text-foreground text-sm font-medium leading-snug">
                  {{ s.label }}
                </span>
              </div>
            </div>
          </button>
        }
      </div>
    }
  `,
})
export class PkChatEmpty {
  public readonly title = input<string>('How can I help today?');
  public readonly subtitle = input<string | undefined>(undefined);
  public readonly suggestions = input<readonly ChatEmptySuggestion[]>([]);
  public readonly class = input<string>('');

  public readonly suggestionPicked = output<ChatEmptySuggestion>();

  protected readonly hostClass = computed(() =>
    cn('flex w-full flex-col items-center justify-center px-4 py-12', this.class()),
  );
}
