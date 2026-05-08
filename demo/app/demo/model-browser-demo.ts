import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import {
  PkModelBrowserImports,
  type BrowserFilter,
  type BrowserModel,
} from 'ngx-prompt-kit/model-browser';

const ICON = (name: string) =>
  `https://unpkg.com/@lobehub/icons-static-svg@latest/icons/${name}.svg`;

@Component({
  selector: 'app-model-browser-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkModelBrowserImports],
  template: `
    <app-doc-page
      title="Model Browser"
      [original]="true"
      description="OpenRouter-style split-pane model picker. Search + optional filter chips on the left, model list grouped by category, and a detail pane on the right showing description, pricing, and arbitrary metric rows. The marketplace pattern when a single dropdown isn't enough."
    >
      <app-doc-example
        title="Full marketplace"
        description="Search, click a filter chip to narrow by group, click a model to inspect. The Use this model button at the bottom of the detail pane fires (changed)."
        [code]="fullCode"
      >
        <pk-model-browser
          [models]="models"
          [(selectedId)]="selectedId"
          [(filters)]="filters"
          (changed)="lastChange.set($event.id)"
        />
        @if (lastChange(); as id) {
          <p class="text-muted-foreground mt-3 text-xs">
            Confirmed: <span class="text-foreground font-mono">{{ id }}</span>
          </p>
        }
      </app-doc-example>

      <app-doc-install component="model-browser" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ModelBrowserDemo {
  protected readonly selectedId = signal<string | null>('claude-opus');
  protected readonly lastChange = signal<string | null>(null);

  protected readonly filters = signal<BrowserFilter[]>([
    { id: 'Frontier', label: 'Frontier' },
    { id: 'Open Source', label: 'Open Source' },
    { id: 'Local', label: 'Local' },
  ]);

  protected readonly models: BrowserModel[] = [
    {
      id: 'gpt-5',
      name: 'GPT-5',
      iconUrl: ICON('openai'),
      provider: 'OpenAI',
      group: 'Frontier',
      description:
        'OpenAI flagship model with 256K context window and improved reasoning. Best general-purpose chat model in the GPT family for May 2026 workloads.',
      inputPricePer1M: 5.0,
      outputPricePer1M: 20.0,
      currency: 'USD',
      metrics: [
        { label: 'Context', value: '256K' },
        { label: 'Weekly tokens', value: '12.4B' },
      ],
    },
    {
      id: 'claude-opus',
      name: 'Claude Opus 4.7',
      iconUrl: ICON('anthropic'),
      provider: 'Anthropic',
      group: 'Frontier',
      description:
        "Anthropic's most capable model. 1M context window in extended mode, leading reasoning benchmarks, strong coding performance.",
      inputPricePer1M: 15.0,
      outputPricePer1M: 75.0,
      currency: 'USD',
      metrics: [
        { label: 'Context', value: '1M' },
        { label: 'Weekly tokens', value: '8.7B' },
      ],
    },
    {
      id: 'gemini-pro',
      name: 'Gemini 2.5 Pro',
      iconUrl: ICON('gemini'),
      provider: 'Google',
      group: 'Frontier',
      description:
        "Google's frontier model with native 2M context. Strong on long-document tasks and multimodal inputs.",
      inputPricePer1M: 2.5,
      outputPricePer1M: 10.0,
      currency: 'USD',
      metrics: [
        { label: 'Context', value: '2M' },
        { label: 'Weekly tokens', value: '15.1B' },
      ],
    },
    {
      id: 'qwen3-235b',
      name: 'Qwen3 235B',
      iconUrl: ICON('qwen'),
      provider: 'Alibaba',
      group: 'Open Source',
      description:
        'Open-weight 235B-parameter model from Alibaba. Apache 2.0 licensed; competitive with frontier closed models on reasoning benchmarks.',
      inputPricePer1M: 0.6,
      outputPricePer1M: 2.4,
      currency: 'USD',
      metrics: [
        { label: 'Parameters', value: '235B' },
        { label: 'License', value: 'Apache 2.0' },
      ],
    },
    {
      id: 'llama4-70b',
      name: 'Llama 4 70B',
      iconUrl: ICON('meta'),
      provider: 'Meta',
      group: 'Open Source',
      description:
        "Meta's open-weight 70B model. Llama community license. Drop-in replacement for hosted models when self-serving.",
      inputPricePer1M: 0.35,
      outputPricePer1M: 1.4,
      currency: 'USD',
      metrics: [
        { label: 'Parameters', value: '70B' },
        { label: 'License', value: 'Llama community' },
      ],
    },
    {
      id: 'mistral-large',
      name: 'Mistral Large',
      iconUrl: ICON('mistral'),
      provider: 'Mistral',
      group: 'Open Source',
      description:
        "Mistral's flagship open model with strong tool-use performance. Apache 2.0.",
      inputPricePer1M: 2.0,
      outputPricePer1M: 6.0,
      currency: 'USD',
      metrics: [
        { label: 'Context', value: '128K' },
        { label: 'License', value: 'Apache 2.0' },
      ],
    },
    {
      id: 'local-gemma',
      name: 'gemma3:270m',
      provider: 'Local · Ollama',
      group: 'Local',
      description:
        'Tiny model for on-device inference. Useful for autocomplete, classification, and other low-latency tasks where round-trip cost matters more than quality.',
      metrics: [
        { label: 'Parameters', value: '270M' },
        { label: 'Runtime', value: 'Ollama' },
      ],
    },
    {
      id: 'local-llama',
      name: 'llama3.1:latest',
      provider: 'Local · Ollama',
      group: 'Local',
      description: 'Meta Llama 3.1 8B running locally via Ollama.',
      metrics: [
        { label: 'Parameters', value: '8.0B' },
        { label: 'Runtime', value: 'Ollama' },
      ],
    },
  ];

  protected readonly api: ApiSection[] = [
    {
      name: 'PkModelBrowser',
      props: [
        { name: 'models', type: 'readonly BrowserModel[]', description: 'The browseable models (required).' },
        {
          name: 'selectedId',
          type: 'string | null',
          default: 'null',
          description: 'Two-way bindable via [(selectedId)]. Selecting a row updates this; (changed) only fires on confirm.',
        },
        {
          name: 'filters',
          type: 'readonly BrowserFilter[]',
          default: '[]',
          description: "Two-way bindable via [(filters)]. Active filter ids are matched against each model's group.",
        },
        {
          name: 'searchPlaceholder',
          type: 'string',
          default: '"Search models"',
          description: 'Placeholder text for the search input.',
        },
        {
          name: 'selectable',
          type: 'boolean',
          default: 'true',
          description: 'Whether to render the confirmation button in the detail pane.',
        },
        {
          name: 'selectLabel',
          type: 'string',
          default: '"Use this model"',
          description: 'Label for the confirmation button.',
        },
        {
          name: 'locale',
          type: 'string?',
          description: 'Locale for the price formatter.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'BrowserModel interface',
      props: [
        { name: 'id', type: 'string', description: 'Stable identifier (required).' },
        { name: 'name', type: 'string', description: 'Display name (required).' },
        { name: 'iconUrl', type: 'string?', description: 'Logo source; falls back to initials.' },
        { name: 'provider', type: 'string?', description: 'Small muted line beneath the name.' },
        { name: 'description', type: 'string?', description: 'Long-form text in the detail pane.' },
        { name: 'group', type: 'string?', description: 'Category label — list groups by this and filter ids match against it.' },
        { name: 'inputPricePer1M / outputPricePer1M', type: 'number?', description: 'Both required for the price metric to render.' },
        { name: 'currency', type: 'string?', default: '"USD"', description: 'ISO 4217 code; passed to Intl.NumberFormat.' },
        { name: 'metrics', type: 'ReadonlyArray<{ label, value }>?', description: 'Free-form key/value rows in the detail pane.' },
        { name: 'disabled', type: 'boolean?', description: 'Greys the row and suppresses (changed).' },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'changed',
          type: '(model: BrowserModel) => void',
          description: 'Fires when the consumer confirms via the action button (selectable=true) — not on row click.',
        },
      ],
    },
  ];

  protected readonly fullCode = `<pk-model-browser
  [models]="models"
  [(selectedId)]="selectedId"
  [(filters)]="filters"
  (changed)="onConfirm($event)"
/>`;
}
