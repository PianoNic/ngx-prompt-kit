import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PkPromptSuggestion } from 'prompt-kit-ng/prompt-suggestion';

@Component({
  selector: 'app-prompt-suggestion-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkPromptSuggestion],
  template: `
    <h2 class="text-xl font-semibold mb-4">Prompt Suggestion</h2>
    <div class="flex flex-wrap gap-2 mb-6 max-w-2xl">
      @for (s of suggestions; track s) {
        <pk-prompt-suggestion [content]="s" (clicked)="picked.set(s)" />
      }
    </div>
    <h3 class="font-semibold mb-2">With highlight</h3>
    <input
      class="border rounded px-2 py-1 mb-2 text-sm"
      [value]="filter()"
      (input)="filter.set($any($event.target).value)"
      placeholder="Filter"
    />
    <div class="flex flex-col gap-1 max-w-md">
      @for (s of suggestions; track s) {
        <pk-prompt-suggestion [content]="s" [highlight]="filter()" (clicked)="picked.set(s)" />
      }
    </div>
    <p class="mt-4 text-sm text-muted-foreground">Picked: {{ picked() }}</p>
  `,
})
export class PromptSuggestionDemo {
  protected readonly filter = signal('');
  protected readonly picked = signal('');
  protected readonly suggestions = [
    'Explain quantum entanglement',
    'Write a haiku about debugging',
    'Recommend a book on systems design',
    'Summarize today\'s news',
  ];
}
