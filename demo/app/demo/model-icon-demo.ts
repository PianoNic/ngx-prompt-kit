import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';
import { modelIconUrl } from 'ngx-prompt-kit/model-icon';

const SAMPLE_IDS = [
  'openai/gpt-4o-mini',
  'anthropic/claude-3.5-sonnet',
  'google/gemini-2.0-flash',
  'google/gemma-2-9b',
  'meta-llama/llama-3.3-70b',
  'mistralai/mistral-large',
  'deepseek/deepseek-chat',
  'qwen/qwen-2.5-72b',
  'x-ai/grok-2',
  'amazon/nova-pro',
  'somevendor/mystery-model',
];

@Component({
  selector: 'app-model-icon-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, PkCodeBlockImports],
  template: `
    <app-doc-page
      title="Model Icon"
      [original]="true"
      description="modelIconUrl() resolves a brand icon for an AI model from LobeHub's static icon set — pair it with pk-model-picker / pk-model-list. Vendors with no brand icon get a neutral generic glyph, so every model shows something."
    >
      <app-doc-example
        title="Vendor → icon"
        description="Each row is modelIconUrl({ id }). Monochrome icons work under dark:invert; the last row (unknown vendor) falls back to the generic glyph."
        [code]="usageCode"
      >
        <div class="grid w-full max-w-xl grid-cols-1 gap-1 sm:grid-cols-2" data-testid="icon-grid">
          @for (id of ids; track id) {
            <div
              class="flex items-center gap-2 rounded-md border p-2 text-sm"
              data-testid="icon-row"
            >
              <img
                [src]="icon(id)"
                [alt]="id + ' icon'"
                class="h-5 w-5 shrink-0 object-contain dark:invert"
              />
              <span class="text-muted-foreground truncate font-mono text-xs">{{ id }}</span>
            </div>
          }
        </div>
      </app-doc-example>

      <section class="mt-12">
        <h2 class="text-xl font-semibold tracking-tight">Installation</h2>
        <p class="text-muted-foreground mt-1 text-sm leading-relaxed">
          Add the model-icon utility to your project.
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="installCmd" language="bash" />
          </pk-code-block>
        </div>
      </section>
    </app-doc-page>
  `,
})
export class ModelIconDemo {
  protected readonly ids = SAMPLE_IDS;
  protected icon(id: string): string {
    return modelIconUrl({ id });
  }

  protected readonly installCmd = 'ng generate ngx-prompt-kit:model-icon';

  protected readonly usageCode = `import { modelIconUrl } from 'ngx-prompt-kit/model-icon';

// Feed pk-model-picker / pk-model-list:
const models = apiModels.map((m) => ({ ...m, iconUrl: modelIconUrl(m) }));`;
}
