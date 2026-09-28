import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucidePlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { modelIconUrl } from 'ngx-prompt-kit/model-icon';
import {
  PkModelSelectorImports,
  priceTier,
  type SelectorModel,
  type SelectorSection,
} from 'ngx-prompt-kit/model-selector';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';

interface ApiModel {
  id: string;
  name: string;
  shortName: string;
  maker: string;
  description: string;
  capabilities: string[];
  input: number;
  output: number;
  credits: number;
}

// Shaped like a typical backend payload: prices per 1M tokens, credits per typical reply.
const CATALOG: ApiModel[] = [
  {
    id: 'anthropic/claude-opus-5.5',
    name: 'Claude Opus 5.5',
    shortName: 'Opus 5.5',
    maker: 'Anthropic',
    description:
      'Anthropic’s most capable model, for complex reasoning, long documents and difficult code.',
    capabilities: ['Vision', 'Reasoning'],
    input: 15,
    output: 75,
    credits: 45,
  },
  {
    id: 'anthropic/claude-sonnet-5.5',
    name: 'Claude Sonnet 5.5',
    shortName: 'Sonnet 5.5',
    maker: 'Anthropic',
    description: 'Balanced intelligence and speed for writing, coding and everyday work.',
    capabilities: ['Vision'],
    input: 3,
    output: 15,
    credits: 14,
  },
  {
    id: 'anthropic/claude-haiku-4.5',
    name: 'Claude Haiku 4.5',
    shortName: 'Haiku 4.5',
    maker: 'Anthropic',
    description: 'Fast and inexpensive, for quick answers, summaries and lightweight tasks.',
    capabilities: ['Vision'],
    input: 1,
    output: 5,
    credits: 4,
  },
  {
    id: 'anthropic/claude-sonnet-4.5',
    name: 'Claude Sonnet 4.5',
    shortName: 'Sonnet 4.5',
    maker: 'Anthropic',
    description: 'The previous Sonnet generation, strong at coding and agent workflows.',
    capabilities: ['Vision'],
    input: 3,
    output: 15,
    credits: 12,
  },
  {
    id: 'anthropic/claude-opus-4.1',
    name: 'Claude Opus 4.1',
    shortName: 'Opus 4.1',
    maker: 'Anthropic',
    description: 'Previous flagship model with extended thinking for multi-step problems.',
    capabilities: ['Vision', 'Reasoning'],
    input: 15,
    output: 75,
    credits: 60,
  },
  {
    id: 'anthropic/claude-3.5-haiku',
    name: 'Claude 3.5 Haiku',
    shortName: '3.5 Haiku',
    maker: 'Anthropic',
    description: 'Older compact model; the cheapest Claude option for simple tasks.',
    capabilities: [],
    input: 0.8,
    output: 4,
    credits: 3,
  },
  {
    id: 'openai/gpt-5',
    name: 'GPT-5',
    shortName: 'GPT-5',
    maker: 'OpenAI',
    description: 'OpenAI’s flagship for reasoning, writing and code.',
    capabilities: ['Vision', 'Reasoning'],
    input: 1.25,
    output: 10,
    credits: 20,
  },
  {
    id: 'openai/gpt-5-codex',
    name: 'GPT-5 Codex',
    shortName: 'GPT-5 Codex',
    maker: 'OpenAI',
    description: 'A GPT-5 variant tuned for agentic coding in real repositories.',
    capabilities: ['Reasoning'],
    input: 1.25,
    output: 10,
    credits: 18,
  },
  {
    id: 'openai/gpt-5-mini',
    name: 'GPT-5 mini',
    shortName: 'GPT-5 mini',
    maker: 'OpenAI',
    description: 'A smaller, cheaper GPT-5 for well-defined tasks and high volume.',
    capabilities: ['Vision'],
    input: 0.25,
    output: 2,
    credits: 3,
  },
  {
    id: 'google/gemini-3-pro',
    name: 'Gemini 3 Pro',
    shortName: 'Gemini 3 Pro',
    maker: 'Google',
    description: 'Google’s most capable model, great with long context, images and video.',
    capabilities: ['Vision', 'Reasoning'],
    input: 4,
    output: 18,
    credits: 30,
  },
  {
    id: 'google/gemini-3-flash',
    name: 'Gemini 3 Flash',
    shortName: 'Gemini 3 Flash',
    maker: 'Google',
    description: 'Very fast, with a huge context window, at a low price.',
    capabilities: ['Vision'],
    input: 0.3,
    output: 2.5,
    credits: 3,
  },
  {
    id: 'x-ai/grok-4',
    name: 'Grok 4',
    shortName: 'Grok 4',
    maker: 'xAI',
    description: 'xAI’s frontier model with live search and strong math.',
    capabilities: ['Vision', 'Reasoning'],
    input: 3,
    output: 15,
    credits: 16,
  },
  {
    id: 'x-ai/grok-4-fast',
    name: 'Grok 4 Fast',
    shortName: 'Grok 4 Fast',
    maker: 'xAI',
    description: 'A faster, cheaper Grok for everyday chat.',
    capabilities: [],
    input: 0.2,
    output: 0.5,
    credits: 2,
  },
  {
    id: 'mistralai/mistral-large-3',
    name: 'Mistral Large 3',
    shortName: 'Large 3',
    maker: 'Mistral',
    description: 'Mistral’s flagship open-weight model, strong at tool use.',
    capabilities: ['Vision'],
    input: 2,
    output: 6,
    credits: 8,
  },
  {
    id: 'mistralai/codestral',
    name: 'Codestral',
    shortName: 'Codestral',
    maker: 'Mistral',
    description: 'Mistral’s model for code completion and generation, fast and cheap.',
    capabilities: [],
    input: 0.3,
    output: 0.9,
    credits: 2,
  },
  {
    id: 'deepseek/deepseek-v3.2',
    name: 'DeepSeek V3.2',
    shortName: 'V3.2',
    maker: 'DeepSeek',
    description: 'Strong at code and math at a very low price.',
    capabilities: [],
    input: 0.28,
    output: 0.42,
    credits: 2,
  },
  {
    id: 'deepseek/deepseek-r1',
    name: 'DeepSeek R1',
    shortName: 'R1',
    maker: 'DeepSeek',
    description: 'Open reasoning model that shows its thinking.',
    capabilities: ['Reasoning'],
    input: 0.55,
    output: 2.19,
    credits: 4,
  },
];

@Component({
  selector: 'app-model-selector-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkModelSelectorImports, HlmButton, NgIcon],
  providers: [provideIcons({ lucideArrowUp, lucidePlus })],
  template: `
    <app-doc-page
      title="Model Selector"
      [original]="true"
      description="A composer's model switcher: a compact trigger pill that opens a wide panel with search, a maker rail, admin-curated sections, price tiers and credit estimates. On phones it becomes a bottom sheet with maker chips."
    >
      <app-doc-example
        title="In a composer"
        description="The panel opens upward, aligned to and as wide as the composer (via [anchor]). Try typing “code”, the arrow keys and Enter, or resize below 768px for the bottom sheet."
        [code]="composerCode"
      >
        <div class="flex min-h-[620px] flex-col justify-end">
          <div #composer class="bg-background rounded-3xl border p-3 pl-4 shadow-sm">
            <label for="demo-prompt" class="sr-only">Message</label>
            <textarea
              id="demo-prompt"
              rows="1"
              [placeholder]="'Reply to ' + selectedName()"
              class="placeholder:text-muted-foreground w-full resize-none bg-transparent px-0.5 py-1 text-[15px] outline-none"
            ></textarea>
            <div class="mt-1.5 flex items-center gap-1.5">
              <button
                hlmBtn
                variant="outline"
                size="icon-lg"
                type="button"
                aria-label="Attach files"
                class="rounded-full"
              >
                <ng-icon name="lucidePlus" />
              </button>
              <div class="grow"></div>
              <pk-model-selector
                [models]="models"
                [sections]="sections"
                [(value)]="modelId"
                [anchor]="composer"
                (selected)="lastSelected.set($event)"
              >
                <div pkModelSelectorFooter>
                  <span class="hidden md:inline"
                    >Credits are an estimate for a typical reply. Longer answers cost more.</span
                  >
                  <span class="md:hidden">Estimates for a typical reply</span>
                  <span class="text-foreground font-medium">8,406 credits left</span>
                </div>
              </pk-model-selector>
              <button
                hlmBtn
                size="icon-lg"
                type="button"
                aria-label="Send message"
                class="rounded-full"
              >
                <ng-icon name="lucideArrowUp" />
              </button>
            </div>
          </div>
        </div>
        @if (lastSelected(); as id) {
          <p class="text-muted-foreground mt-3 text-xs">
            (selected): <span class="text-foreground font-mono">{{ id }}</span>
          </p>
        }
      </app-doc-example>

      <app-doc-install component="model-selector" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ModelSelectorDemo {
  protected readonly modelId = signal<string | null>('anthropic/claude-sonnet-5.5');
  protected readonly lastSelected = signal<string | null>(null);

  protected readonly models: SelectorModel[] = CATALOG.map((m) => ({
    id: m.id,
    name: m.name,
    shortName: m.shortName,
    maker: m.maker,
    iconUrl: modelIconUrl({ id: m.id }),
    description: m.description,
    capabilities: m.capabilities,
    priceTier: priceTier(m.input, m.output),
    costLabel: `≈ ${m.credits} credits`,
  }));

  protected readonly sections: SelectorSection[] = [
    {
      id: 'default',
      label: 'Best for most tasks',
      description: 'A good default for everyday work',
      modelIds: ['anthropic/claude-sonnet-5.5', 'openai/gpt-5'],
    },
    {
      id: 'cheap',
      label: 'Fast and cheap',
      description: 'Quick answers that barely touch your balance',
      modelIds: ['google/gemini-3-flash', 'anthropic/claude-haiku-4.5'],
    },
    {
      id: 'capable',
      label: 'Most capable',
      description: 'For hard problems, when quality matters most',
      modelIds: ['anthropic/claude-opus-5.5', 'google/gemini-3-pro'],
    },
  ];

  protected selectedName(): string {
    return this.models.find((m) => m.id === this.modelId())?.name ?? 'the model';
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkModelSelector',
      props: [
        {
          name: 'models',
          type: 'readonly SelectorModel[]',
          description:
            'All selectable models (required). Rail order follows first appearance of each maker.',
        },
        {
          name: 'sections',
          type: 'readonly SelectorSection[]',
          default: '[]',
          description:
            'Curated groups shown under one rail entry above the makers. When present, that entry is selected on open.',
        },
        {
          name: 'value',
          type: 'string | null',
          default: 'null',
          description: 'Selected model id. Two-way bindable via [(value)].',
        },
        {
          name: 'anchor',
          type: 'ElementRef | HTMLElement | null',
          default: 'null',
          description:
            'Element the desktop panel aligns to and matches the width of (e.g. the composer). Without it the panel is 784px wide, aligned to the trigger’s end.',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: '"Select model"',
          description: 'Trigger text when nothing is selected.',
        },
        {
          name: 'title',
          type: 'string',
          default: '"Choose a model"',
          description: 'Sheet title and the panel’s accessible name.',
        },
        {
          name: 'sectionsLabel',
          type: 'string',
          default: '"Recommended"',
          description: 'Rail entry / chip label for the curated sections.',
        },
        {
          name: 'searchPlaceholder',
          type: 'string',
          default: '"Search by name or what you need, …"',
          description: 'Desktop search placeholder.',
        },
        {
          name: 'mobileSearchPlaceholder',
          type: 'string',
          default: '"Search models or what you need"',
          description: 'Bottom-sheet search placeholder.',
        },
        {
          name: 'searchLabel',
          type: 'string',
          default: '"Search models"',
          description: 'Accessible label of the search field.',
        },
        {
          name: 'railLabel',
          type: 'string',
          default: '"Model makers"',
          description: 'Accessible label of the maker rail / chip row.',
        },
        {
          name: 'noResultsText',
          type: 'string',
          default: '"No models match “{query}”."',
          description: 'Empty search text; {query} is substituted.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the trigger.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'Outputs & methods',
      props: [
        {
          name: 'selected',
          type: '(id: string) => void',
          description:
            'Fires when a row is picked. The panel closes and focus returns to the trigger.',
        },
        {
          name: 'openChange',
          type: '(open: boolean) => void',
          description: 'Fires when the panel or sheet opens or closes.',
        },
        {
          name: 'open() / close()',
          type: 'void',
          description: 'Imperative control, e.g. from a keyboard shortcut.',
        },
      ],
    },
    {
      name: 'Content projection',
      props: [
        {
          name: '[pkModelSelectorFooter]',
          type: 'element',
          description:
            'Footer strip content (note + balance). Laid out as a space-between row; use md:hidden / hidden md:inline for phone-specific text.',
        },
      ],
    },
    {
      name: 'SelectorModel interface',
      props: [
        {
          name: 'id / name',
          type: 'string',
          description: 'Identifier and display name (required).',
        },
        {
          name: 'maker',
          type: 'string',
          description: 'Grouping key and rail label, e.g. "Anthropic" (required).',
        },
        { name: 'shortName', type: 'string?', description: 'Shorter trigger label on phones.' },
        {
          name: 'iconUrl',
          type: 'string?',
          description: 'Brand icon; modelIconUrl() from model-icon resolves one.',
        },
        {
          name: 'description',
          type: 'string?',
          description: 'One truncated line under the name. Searched.',
        },
        {
          name: 'capabilities',
          type: 'readonly string[]?',
          description: 'Chip labels next to the name. Searched.',
        },
        { name: 'priceTier', type: '1 | 2 | 3', description: 'Renders $, $$ or $$$.' },
        {
          name: 'costLabel',
          type: 'string?',
          description: 'Hint under the price tier, e.g. "≈ 14 credits".',
        },
        { name: 'disabled', type: 'boolean?', description: 'Shown dimmed and not selectable.' },
      ],
    },
    {
      name: 'SelectorSection interface',
      props: [
        { name: 'id / label', type: 'string', description: 'Identifier and group heading.' },
        { name: 'description', type: 'string?', description: 'Muted text next to the heading.' },
        {
          name: 'modelIds',
          type: 'readonly string[]',
          description: 'Models in display order; unknown ids are skipped.',
        },
      ],
    },
    {
      name: 'priceTier(input, output, thresholds?)',
      props: [
        {
          name: 'returns',
          type: '1 | 2 | 3',
          description:
            'Blended price = (3 × input + output) / 4 per 1M tokens; < low → 1, < high → 2, else 3.',
        },
        {
          name: 'thresholds',
          type: 'Partial<{ low; high }>',
          default: '{ low: 2.5, high: 10 }',
          description:
            'Boundaries in your pricing currency. Throws RangeError on negative / non-finite prices.',
        },
      ],
    },
  ];

  protected readonly composerCode = `<div #composer class="rounded-3xl border p-3">
  <textarea …></textarea>
  <div class="flex items-center gap-1.5">
    <div class="grow"></div>
    <pk-model-selector
      [models]="models"
      [sections]="sections"
      [(value)]="modelId"
      [anchor]="composer"
      (selected)="onSelected($event)"
    >
      <div pkModelSelectorFooter>
        <span>Credits are an estimate for a typical reply. Longer answers cost more.</span>
        <span class="text-foreground font-medium">8,406 credits left</span>
      </div>
    </pk-model-selector>
  </div>
</div>

// models: map your API type onto SelectorModel
models = api.map((m) => ({
  id: m.id,
  name: m.name,
  maker: m.maker,
  iconUrl: modelIconUrl({ id: m.id }),
  description: m.description,
  capabilities: m.capabilities,
  priceTier: priceTier(m.inputPricePer1M, m.outputPricePer1M),
  costLabel: \`≈ \${m.credits} credits\`,
}));`;
}
