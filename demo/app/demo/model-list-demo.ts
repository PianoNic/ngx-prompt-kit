import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkModelListImports, type Model } from 'ngx-prompt-kit/model-list';

const ICON = (name: string) =>
  `https://unpkg.com/@lobehub/icons-static-svg@latest/icons/${name}.svg`;

@Component({
  selector: 'app-model-list-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkModelListImports],
  template: `
    <app-doc-page
      title="Model List"
      [original]="true"
      description="Inline searchable list of models. Open WebUI / Ollama style — circular icon, name, optional inline metadata. Renders as a list, not a dropdown — wrap in your own popover/dialog if you need that surface."
    >
      <app-doc-example
        title="Searchable list"
        description="Type to filter by name, provider, or tagline. Selected row gets a soft accent background and a check icon. Models without iconUrl fall back to two-letter initials."
        [code]="searchableCode"
      >
        <div class="w-full max-w-md">
          <pk-model-list
            [models]="models"
            [(selectedId)]="selectedId"
            (changed)="lastChange.set($event.id)"
          />
          @if (lastChange(); as id) {
            <p class="text-muted-foreground mt-3 text-xs">
              Last switched to: <span class="text-foreground font-mono">{{ id }}</span>
            </p>
          }
        </div>
      </app-doc-example>

      <app-doc-example
        title="Without search"
        description="Set [showSearch]='false' for short, fixed lists where filtering would be noise."
        [code]="plainCode"
      >
        <div class="w-full max-w-md">
          <pk-model-list
            [models]="shortList"
            [(selectedId)]="plainSelectedId"
            [showSearch]="false"
          />
        </div>
      </app-doc-example>

      <app-doc-install component="model-list" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ModelListDemo {
  protected readonly selectedId = signal<string | null>('claude-opus');
  protected readonly plainSelectedId = signal<string | null>('gpt-5');
  protected readonly lastChange = signal<string | null>(null);

  protected readonly models: Model[] = [
    {
      id: 'gpt-5',
      name: 'GPT-5',
      iconUrl: ICON('openai'),
      provider: 'OpenAI',
      tagline: '256K ctx',
    },
    {
      id: 'gpt-5-mini',
      name: 'GPT-5 Mini',
      iconUrl: ICON('openai'),
      provider: 'OpenAI',
      tagline: '128K ctx',
    },
    {
      id: 'claude-opus',
      name: 'Claude Opus 4.7',
      iconUrl: ICON('anthropic'),
      provider: 'Anthropic',
      tagline: '200K ctx',
    },
    {
      id: 'claude-sonnet',
      name: 'Claude Sonnet 4.6',
      iconUrl: ICON('anthropic'),
      provider: 'Anthropic',
      tagline: '200K ctx',
    },
    {
      id: 'gemini-pro',
      name: 'Gemini 2.5 Pro',
      iconUrl: ICON('gemini'),
      provider: 'Google',
      tagline: '1M ctx',
    },
    {
      id: 'qwen3',
      name: 'Qwen3 235B',
      iconUrl: ICON('qwen'),
      provider: 'Alibaba',
      tagline: '235B',
    },
    {
      id: 'llama4',
      name: 'Llama 4 70B',
      iconUrl: ICON('meta'),
      provider: 'Meta',
      tagline: '70B',
    },
    {
      id: 'mistral-large',
      name: 'Mistral Large',
      iconUrl: ICON('mistral'),
      provider: 'Mistral',
      tagline: '128K ctx',
    },
    {
      id: 'local-only',
      name: 'huihui_ai/orchestrator',
      provider: 'Local',
      tagline: '8.2B',
    },
  ];

  protected readonly shortList: Model[] = [
    { id: 'gpt-5', name: 'GPT-5', iconUrl: ICON('openai'), provider: 'OpenAI' },
    {
      id: 'claude-opus',
      name: 'Claude Opus 4.7',
      iconUrl: ICON('anthropic'),
      provider: 'Anthropic',
    },
    { id: 'gemini-pro', name: 'Gemini 2.5 Pro', iconUrl: ICON('gemini'), provider: 'Google' },
  ];

  protected readonly api: ApiSection[] = [
    {
      name: 'PkModelList',
      props: [
        { name: 'models', type: 'readonly Model[]', description: 'Selectable models (required).' },
        {
          name: 'selectedId',
          type: 'string | null',
          default: 'null',
          description: 'Two-way bindable via [(selectedId)].',
        },
        {
          name: 'showSearch',
          type: 'boolean',
          default: 'true',
          description: 'Renders the search input at the top of the list.',
        },
        {
          name: 'searchPlaceholder',
          type: 'string',
          default: '"Search models"',
          description: 'Placeholder text for the search input.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'Model interface',
      props: [
        { name: 'id', type: 'string', description: 'Stable identifier (required).' },
        { name: 'name', type: 'string', description: 'Display name (required).' },
        {
          name: 'iconUrl',
          type: 'string?',
          description: 'Logo image source. Falls back to initials when absent.',
        },
        {
          name: 'provider',
          type: 'string?',
          description: 'Searchable but not displayed in this layout.',
        },
        {
          name: 'tagline',
          type: 'string?',
          description: 'Inline metadata — parameter size, context length, etc.',
        },
        {
          name: 'disabled',
          type: 'boolean?',
          description: 'Greys the row out and suppresses (changed).',
        },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'changed',
          type: '(model: Model) => void',
          description: 'Fires when a non-disabled model is picked.',
        },
      ],
    },
  ];

  protected readonly searchableCode = `<pk-model-list
  [models]="models"
  [(selectedId)]="selectedId"
  (changed)="onChange($event)"
/>`;

  protected readonly plainCode = `<pk-model-list
  [models]="models"
  [(selectedId)]="selectedId"
  [showSearch]="false"
/>`;
}
