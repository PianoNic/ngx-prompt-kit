import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkReasoningImports } from 'prompt-kit-ng/reasoning';

@Component({
  selector: 'app-reasoning-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, HlmButton, PkReasoningImports],
  template: `
    <app-doc-page
      title="Reasoning"
      description="A collapsible thinking block for assistants that show their work. Auto-expands while streaming and collapses when done."
    >
      <app-doc-example
        title="Click to expand"
        description="The trigger toggles open/closed. Content height animates."
        [code]="basicCode"
      >
        <pk-reasoning class="block w-full max-w-xl rounded-lg border p-4">
          <pk-reasoning-trigger>Show reasoning</pk-reasoning-trigger>
          <pk-reasoning-content
            [markdown]="true"
            content="The answer is **42**.

1. Considered the question.
2. Recalled the canonical reference.
3. Returned the established result."
          />
        </pk-reasoning>
      </app-doc-example>

      <app-doc-example
        title="Streaming auto-expand"
        description="Toggle 'streaming' on — the block auto-opens. Toggle off — it auto-collapses."
        [code]="streamingCode"
      >
        <div class="flex w-full max-w-xl flex-col gap-3">
          <button hlmBtn variant="outline" size="sm" type="button" (click)="streaming.update((s) => !s)">
            {{ streaming() ? 'Stop streaming' : 'Start streaming' }}
          </button>
          <pk-reasoning class="block rounded-lg border p-4" [isStreaming]="streaming()">
            <pk-reasoning-trigger>{{ streaming() ? 'Thinking…' : 'Show reasoning' }}</pk-reasoning-trigger>
            <pk-reasoning-content
              content="Walking the call graph from the entry point. Traced 14 functions, found one cycle in the auth middleware. Suggesting we extract the token-refresh path into its own module."
            />
          </pk-reasoning>
        </div>
      </app-doc-example>
    </app-doc-page>
  `,
})
export class ReasoningDemo {
  protected readonly streaming = signal(false);

  protected readonly basicCode = `<pk-reasoning class="block rounded-lg border p-4">
  <pk-reasoning-trigger>Show reasoning</pk-reasoning-trigger>
  <pk-reasoning-content
    [markdown]="true"
    content="The answer is **42**.

1. Considered the question.
2. Recalled the canonical reference.
3. Returned the established result."
  />
</pk-reasoning>`;

  protected readonly streamingCode = `<pk-reasoning [isStreaming]="streaming()" class="block rounded-lg border p-4">
  <pk-reasoning-trigger>
    {{ streaming() ? 'Thinking…' : 'Show reasoning' }}
  </pk-reasoning-trigger>
  <pk-reasoning-content content="Walking the call graph..." />
</pk-reasoning>`;
}
