import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkModelPickerImports, type Model } from 'ngx-prompt-kit/model-picker';

@Component({
  selector: 'app-model-picker-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkModelPickerImports],
  template: `
    <app-doc-page
      title="Model Picker"
      [original]="true"
      description="Dropdown for selecting an LLM. Items show name, provider, optional tagline, optional tier badge, and optional pricing line. Pricing is consumer-supplied — no model rates are bundled."
    >
      <app-doc-example
        title="Full detail"
        description="Three models with tiers + pricing. Selected model's name and tier badge appear in the trigger; the dropdown shows all metadata. Click a model to switch."
        [code]="fullCode"
      >
        <div class="flex w-full flex-col items-start gap-3">
          <pk-model-picker
            [models]="models"
            [(selectedId)]="selectedId"
            (changed)="lastChange.set($event.id)"
          />
          @if (lastChange(); as id) {
            <p class="text-muted-foreground text-xs">
              Last switched to: <span class="text-foreground font-mono">{{ id }}</span>
            </p>
          }
        </div>
      </app-doc-example>

      <app-doc-example
        title="Compact, in a toolbar"
        description="Set [compact]='true' to drop the tier badge from the trigger and shrink the button. Useful in horizontal toolbars where vertical space matters."
        [code]="compactCode"
      >
        <div class="flex w-full items-center gap-2">
          <span class="text-muted-foreground text-sm">Active model:</span>
          <pk-model-picker [compact]="true" [models]="models" [(selectedId)]="compactSelectedId" />
        </div>
      </app-doc-example>

      <app-doc-example
        title="With a disabled (coming soon) model"
        description="Set disabled: true on a Model entry to grey it out. (changed) does not fire and selectedId does not update if the user clicks it."
        [code]="disabledCode"
      >
        <pk-model-picker [models]="modelsWithDisabled" [(selectedId)]="disabledExampleSelectedId" />
      </app-doc-example>

      <app-doc-example
        title="Searchable (long lists)"
        description="Set [searchable]='true' to add a filter box at the top of the menu — filters by name, provider, and tagline. Ideal for long catalogs like OpenRouter where a flat dropdown is unwieldy."
        [code]="searchableCode"
      >
        <div class="flex w-full flex-col items-start gap-3" data-testid="searchable-picker">
          <pk-model-picker
            [searchable]="true"
            [models]="manyModels"
            [(selectedId)]="searchSelectedId"
            searchPlaceholder="Search models..."
          />
        </div>
      </app-doc-example>

      <app-doc-install component="model-picker" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ModelPickerDemo {
  protected readonly selectedId = signal<string | null>('balanced');
  protected readonly compactSelectedId = signal<string | null>('fast');
  protected readonly disabledExampleSelectedId = signal<string | null>('available');
  protected readonly searchSelectedId = signal<string | null>('gpt-4o');
  protected readonly lastChange = signal<string | null>(null);

  protected readonly models: Model[] = [
    {
      id: 'fast',
      name: 'Quill Fast',
      provider: 'Acme',
      tagline: 'Lowest latency, smaller context',
      tier: 'fast',
      inputPricePer1M: 0.5,
      outputPricePer1M: 2.0,
      currency: 'USD',
    },
    {
      id: 'balanced',
      name: 'Quill Balanced',
      provider: 'Acme',
      tagline: 'Good default for most chat workloads',
      tier: 'balanced',
      inputPricePer1M: 2.5,
      outputPricePer1M: 10.0,
      currency: 'USD',
    },
    {
      id: 'smart',
      name: 'Quill Reason',
      provider: 'Acme',
      tagline: 'Best for complex multi-step reasoning',
      tier: 'smart',
      inputPricePer1M: 15.0,
      outputPricePer1M: 75.0,
      currency: 'USD',
    },
  ];

  protected readonly manyModels: Model[] = [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', tier: 'smart' },
    { id: 'gpt-4o-mini', name: 'GPT-4o mini', provider: 'OpenAI', tier: 'fast' },
    { id: 'claude-opus', name: 'Claude Opus', provider: 'Anthropic', tier: 'smart' },
    { id: 'claude-sonnet', name: 'Claude Sonnet', provider: 'Anthropic', tier: 'balanced' },
    { id: 'claude-haiku', name: 'Claude Haiku', provider: 'Anthropic', tier: 'fast' },
    { id: 'gemini-pro', name: 'Gemini 2.5 Pro', provider: 'Google', tier: 'smart' },
    { id: 'gemini-flash', name: 'Gemini 2.5 Flash', provider: 'Google', tier: 'fast' },
    { id: 'llama-70b', name: 'Llama 3.3 70B', provider: 'Meta', tier: 'balanced' },
    { id: 'mistral-large', name: 'Mistral Large', provider: 'Mistral', tier: 'balanced' },
  ];

  protected readonly modelsWithDisabled: Model[] = [
    {
      id: 'available',
      name: 'Quill Balanced',
      provider: 'Acme',
      tier: 'balanced',
    },
    {
      id: 'preview',
      name: 'Quill Vision',
      provider: 'Acme',
      tagline: 'Coming soon — image + text inputs',
      tier: 'smart',
      disabled: true,
    },
  ];

  protected readonly api: ApiSection[] = [
    {
      name: 'PkModelPicker',
      props: [
        {
          name: 'models',
          type: 'readonly Model[]',
          description: 'The selectable models (required). See Model interface below.',
        },
        {
          name: 'selectedId',
          type: 'string | null',
          default: 'null',
          description:
            'Two-way bindable via [(selectedId)]. Component reflects the selection in the trigger; consumer drives any side effects.',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Select model"',
          description: 'Trigger label when nothing is selected.',
        },
        {
          name: 'compact',
          type: 'boolean',
          default: 'false',
          description:
            'Smaller trigger; drops the tier badge from the trigger button. The dropdown is unaffected.',
        },
        {
          name: 'locale',
          type: 'string | undefined',
          description: 'BCP-47 locale for the price formatter. Defaults to runtime locale.',
        },
        {
          name: 'searchable',
          type: 'boolean',
          default: 'false',
          description:
            'Adds a filter box at the top of the menu (filters by name/provider/tagline).',
        },
        {
          name: 'searchPlaceholder',
          type: 'string',
          default: '"Search models"',
          description: 'Placeholder for the search box when searchable is on.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'Model interface',
      props: [
        { name: 'id', type: 'string', description: 'Stable identifier (required).' },
        { name: 'name', type: 'string', description: 'Display name (required).' },
        { name: 'provider', type: 'string?', description: 'Small muted suffix in the dropdown.' },
        {
          name: 'tagline',
          type: 'string?',
          description: 'One-line description below the name in the dropdown.',
        },
        {
          name: 'tier',
          type: '"fast" | "balanced" | "smart" | undefined',
          description: 'Optional badge — fast (primary), balanced (secondary), smart (amber).',
        },
        {
          name: 'inputPricePer1M / outputPricePer1M',
          type: 'number?',
          description:
            'Per-million-token pricing in `currency`. Both must be set for the price line to render.',
        },
        {
          name: 'currency',
          type: 'string?',
          default: '"USD"',
          description: 'ISO 4217 code; passed to Intl.NumberFormat with the resolved locale.',
        },
        {
          name: 'disabled',
          type: 'boolean?',
          description: 'Greys the item out and suppresses (changed).',
        },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'changed',
          type: '(model: Model) => void',
          description: 'Fires when a non-disabled model is picked. Full Model object emitted.',
        },
      ],
    },
  ];

  protected readonly fullCode = `<pk-model-picker
  [models]="models"
  [(selectedId)]="selectedId"
  (changed)="onChange($event)"
/>`;

  protected readonly compactCode = `<pk-model-picker
  [compact]="true"
  [models]="models"
  [(selectedId)]="selectedId"
/>`;

  protected readonly disabledCode = `const models: Model[] = [
  { id: 'available', name: 'Quill Balanced', provider: 'Acme', tier: 'balanced' },
  {
    id: 'preview',
    name: 'Quill Vision',
    provider: 'Acme',
    tagline: 'Coming soon — image + text inputs',
    tier: 'smart',
    disabled: true,
  },
];

<pk-model-picker [models]="models" [(selectedId)]="selectedId" />`;

  protected readonly searchableCode = `<pk-model-picker
  [searchable]="true"
  [models]="models"
  [(selectedId)]="selectedId"
  searchPlaceholder="Search models..."
/>`;
}
