import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import {
  PkModelBrowserImports,
  type BrowserFilter,
  type BrowserModel,
} from 'ngx-prompt-kit/model-browser';

const ICON = (name: string) =>
  `https://unpkg.com/@lobehub/icons-static-svg@latest/icons/${name}.svg`;

@Component({
  selector: 'app-block-model-marketplace',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, PkModelBrowserImports],
  template: `
    <app-block-page
      title="Model marketplace"
      description="OpenRouter-style split-pane model picker. Search left, model list grouped by tier in the middle, full detail pane right with description, pricing, and metrics."
    >
      <app-doc-example title="Browse · filter · confirm" [code]="code">
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
    </app-block-page>
  `,
})
export class ModelMarketplaceBlock {
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
      description: 'OpenAI flagship with 256K context window and improved reasoning.',
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
        "Anthropic's most capable model. 1M context in extended mode, leading reasoning benchmarks.",
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
      description: "Google's frontier model with native 2M context. Strong on long-document tasks.",
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
      description: 'Open-weight 235B-parameter model under Apache 2.0.',
      inputPricePer1M: 0.6,
      outputPricePer1M: 2.4,
      currency: 'USD',
      metrics: [
        { label: 'Parameters', value: '235B' },
        { label: 'License', value: 'Apache 2.0' },
      ],
    },
    {
      id: 'llama-405b',
      name: 'Llama 3.5 405B',
      iconUrl: ICON('meta'),
      provider: 'Meta',
      group: 'Open Source',
      description: "Meta's flagship open weights, strong on instruction following.",
      inputPricePer1M: 1.2,
      outputPricePer1M: 4.8,
      currency: 'USD',
      metrics: [
        { label: 'Parameters', value: '405B' },
        { label: 'Context', value: '128K' },
      ],
    },
    {
      id: 'phi4-local',
      name: 'Phi-4 14B',
      iconUrl: ICON('microsoft'),
      provider: 'Microsoft',
      group: 'Local',
      description: '14B SLM that runs comfortably on a workstation GPU. MIT licensed.',
      metrics: [
        { label: 'Parameters', value: '14B' },
        { label: 'License', value: 'MIT' },
      ],
    },
  ];

  protected readonly code = `<pk-model-browser
  [models]="models"
  [(selectedId)]="selectedId"
  [(filters)]="filters"
  (changed)="onModelConfirmed($event)"
/>

// Component
protected readonly selectedId = signal<string | null>('claude-opus');
protected readonly filters = signal<BrowserFilter[]>([
  { id: 'Frontier', label: 'Frontier' },
  { id: 'Open Source', label: 'Open Source' },
  { id: 'Local', label: 'Local' },
]);

protected readonly models: BrowserModel[] = [
  {
    id: 'gpt-5',
    name: 'GPT-5',
    provider: 'OpenAI',
    group: 'Frontier',
    description: 'OpenAI flagship with 256K context.',
    inputPricePer1M: 5.0,
    outputPricePer1M: 20.0,
    metrics: [{ label: 'Context', value: '256K' }],
  },
  // ...more models
];`;
}
