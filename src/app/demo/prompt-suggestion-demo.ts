import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkPromptSuggestion } from 'prompt-kit-ng/prompt-suggestion';

@Component({
  selector: 'app-prompt-suggestion-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkPromptSuggestion],
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

      <app-doc-install component="prompt-suggestion" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class PromptSuggestionDemo {
  protected readonly api: ApiSection[] = [
    {
      name: 'PkPromptSuggestion',
      props: [
        { name: 'content', type: 'string', default: "''", description: 'The suggestion text.' },
        { name: 'highlight', type: 'string', default: "''", description: 'When non-empty, switches to inline list mode and highlights this substring inside content.' },
        { name: 'variant', type: 'ButtonVariants["variant"]', description: 'Override the underlying hlmBtn variant.' },
        { name: 'size', type: 'ButtonVariants["size"]', description: 'Override the underlying hlmBtn size.' },
        { name: 'clicked', type: 'output<void>', description: 'Fires when the chip is clicked.' },
        { name: 'class', type: 'string', description: 'Extra classes for the button.' },
      ],
    },
  ];

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
