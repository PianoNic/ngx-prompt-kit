import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkPromptSuggestion } from 'prompt-kit-ng/prompt-suggestion';

@Component({
  selector: 'app-prompt-suggestion-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, PkPromptSuggestion],
  template: `
    <app-doc-page
      title="Prompt Suggestion"
      description="Clickable prompt chips. Two modes: pill (no highlight) and inline list (with substring highlight against a query)."
    >
      <app-doc-example title="Pill chips" description="Default style — outline buttons in a row." [code]="pillsCode">
        <div class="flex w-full max-w-2xl flex-wrap gap-2">
          @for (s of suggestions; track s) {
            <pk-prompt-suggestion [content]="s" (clicked)="picked.set(s)" />
          }
        </div>
      </app-doc-example>

      <app-doc-example
        title="Filterable list"
        description="Pass a highlight string; the matching substring is emphasized."
        [code]="filterableCode"
      >
        <div class="w-full max-w-md">
          <input
            class="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 mb-3 w-full rounded-md border px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-3"
            placeholder="Filter..."
            [value]="filter()"
            (input)="filter.set($any($event.target).value)"
          />
          <div class="flex flex-col gap-1">
            @for (s of suggestions; track s) {
              <pk-prompt-suggestion
                [content]="s"
                [highlight]="filter()"
                (clicked)="picked.set(s)"
              />
            }
          </div>
        </div>
      </app-doc-example>

      @if (picked()) {
        <p class="text-muted-foreground text-sm">
          Picked: <span class="text-foreground font-medium">{{ picked() }}</span>
        </p>
      }
    </app-doc-page>
  `,
})
export class PromptSuggestionDemo {
  protected readonly filter = signal('');
  protected readonly picked = signal('');
  protected readonly suggestions = [
    'Explain quantum entanglement',
    'Write a haiku about debugging',
    'Recommend a book on systems design',
    "Summarize today's news",
    'Outline a 3-week sprint plan',
  ];

  protected readonly pillsCode = `<div class="flex flex-wrap gap-2">
  @for (s of suggestions; track s) {
    <pk-prompt-suggestion [content]="s" (clicked)="onPick(s)" />
  }
</div>`;

  protected readonly filterableCode = `<input
  class="..."
  placeholder="Filter..."
  [value]="filter()"
  (input)="filter.set($any($event.target).value)"
/>
@for (s of suggestions; track s) {
  <pk-prompt-suggestion
    [content]="s"
    [highlight]="filter()"
    (clicked)="onPick(s)"
  />
}`;
}
