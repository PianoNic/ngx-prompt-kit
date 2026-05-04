import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkCostDisplayImports } from 'ngx-prompt-kit/cost-display';

@Component({
  selector: 'app-cost-display-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkCostDisplayImports],
  template: `
    <app-doc-page
      title="Cost Display"
      [original]="true"
      description="Renders the running USD/EUR/CHF/JPY/… cost of an LLM exchange. Pricing is consumer-supplied — pass the per-million rates and the token counts, the component handles the math and the locale-aware formatting."
    >
      <app-doc-example
        title="Compact · USD"
        description="Default. Just the total. Realistic GPT-4o pricing — $2.50/1M input, $10.00/1M output. Locale pinned to en-US for the canonical $-prefix format; omit [locale] to use the runtime default."
        [code]="compactCode"
      >
        <pk-cost-display
          locale="en-US"
          [inputTokens]="1243"
          [outputTokens]="892"
          [inputPricePer1M]="2.50"
          [outputPricePer1M]="10.00"
        />
      </app-doc-example>

      <app-doc-example
        title="Detailed · EUR"
        description="display='detailed' shows the input/output breakdown. Currency switches to EUR — symbol placement and decimal handling come from the locale."
        [code]="detailedCode"
      >
        <pk-cost-display
          display="detailed"
          currency="EUR"
          locale="de-DE"
          [inputTokens]="1243"
          [outputTokens]="892"
          [inputPricePer1M]="2.30"
          [outputPricePer1M]="9.20"
        />
      </app-doc-example>

      <app-doc-example
        title="Session summary · CHF"
        description="display='session-summary' is a chip designed for status-bar placement. costPrecision=2 to land on the natural 'this session' rounding."
        [code]="summaryCode"
      >
        <pk-cost-display
          display="session-summary"
          currency="CHF"
          locale="de-CH"
          [costPrecision]="2"
          [inputTokens]="42_000"
          [outputTokens]="18_000"
          [inputPricePer1M]="2.20"
          [outputPricePer1M]="8.80"
        />
      </app-doc-example>

      <app-doc-example
        title="Zero-decimal currency · JPY"
        description="Intl.NumberFormat handles currency-specific quirks. JPY has no minor unit — the formatter drops the decimals automatically. Same component, no special-casing in your code."
        [code]="jpyCode"
      >
        <div class="flex flex-col items-center gap-3">
          <pk-cost-display
            currency="JPY"
            locale="ja-JP"
            [inputTokens]="1_243_000"
            [outputTokens]="892_000"
            [inputPricePer1M]="380"
            [outputPricePer1M]="1520"
          />
          <pk-cost-display
            display="detailed"
            currency="JPY"
            locale="ja-JP"
            [inputTokens]="1_243_000"
            [outputTokens]="892_000"
            [inputPricePer1M]="380"
            [outputPricePer1M]="1520"
          />
        </div>
      </app-doc-example>

      <app-doc-example
        title="With cost limit"
        description="Set [costLimit] to drive the same four-tier color state as token-counter (75/90/100%). (overLimit) emits once on each crossing."
        [code]="limitCode"
      >
        <div class="flex flex-col items-start gap-3">
          <span class="text-muted-foreground text-xs uppercase tracking-wider">Under limit</span>
          <pk-cost-display
            [inputTokens]="200_000"
            [outputTokens]="50_000"
            [inputPricePer1M]="2.50"
            [outputPricePer1M]="10.00"
            [costLimit]="2.00"
          />
          <span class="text-muted-foreground mt-2 text-xs uppercase tracking-wider">Near limit</span>
          <pk-cost-display
            [inputTokens]="500_000"
            [outputTokens]="100_000"
            [inputPricePer1M]="2.50"
            [outputPricePer1M]="10.00"
            [costLimit]="2.50"
          />
          <span class="text-muted-foreground mt-2 text-xs uppercase tracking-wider">Over limit</span>
          <pk-cost-display
            [inputTokens]="800_000"
            [outputTokens]="200_000"
            [inputPricePer1M]="2.50"
            [outputPricePer1M]="10.00"
            [costLimit]="2.50"
          />
        </div>
      </app-doc-example>

      <app-doc-install component="cost-display" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class CostDisplayDemo {
  protected readonly api: ApiSection[] = [
    {
      name: 'PkCostDisplay',
      props: [
        { name: 'inputTokens', type: 'number', default: '0', description: 'Prompt/input tokens consumed.' },
        { name: 'outputTokens', type: 'number', default: '0', description: 'Completion/output tokens consumed.' },
        {
          name: 'inputPricePer1M',
          type: 'number | null',
          default: 'null',
          description: 'USD per 1M input tokens (null hides cost). Consumer-supplied — see Notes.',
        },
        {
          name: 'outputPricePer1M',
          type: 'number | null',
          default: 'null',
          description: 'USD per 1M output tokens (null hides cost). Consumer-supplied — see Notes.',
        },
        {
          name: 'currency',
          type: 'string',
          default: '"USD"',
          description:
            "ISO 4217 currency code (e.g. 'USD', 'EUR', 'CHF', 'GBP', 'JPY'). Symbol placement and decimal handling derive from the locale.",
        },
        {
          name: 'locale',
          type: 'string | undefined',
          description:
            'BCP-47 locale tag (e.g. "en-US", "de-CH", "ja-JP"). Defaults to the runtime locale.',
        },
        {
          name: 'costPrecision',
          type: 'number',
          default: '4',
          description:
            'Maximum decimal places. Default 4 handles fractions of a cent; drop to 2 for $0.43-style output.',
        },
        {
          name: 'costLimit',
          type: 'number | null',
          default: 'null',
          description:
            'Optional max cost in the same currency. Drives the four-tier color state and the (overLimit) output.',
        },
        {
          name: 'display',
          type: '"compact" | "detailed" | "session-summary"',
          default: '"compact"',
          description:
            'compact: bare total. detailed: total + input/output breakdown. session-summary: chip-style with "this session" suffix.',
        },
        {
          name: 'showBreakdown',
          type: 'boolean',
          default: 'false',
          description:
            'Force the (in: $X, out: $Y) breakdown in compact / session-summary modes. Detailed mode shows it by default.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'overLimit',
          type: '(over: boolean) => void',
          description:
            'Fires once each time totalCost crosses costLimit (true on cross-over, false on cross-back).',
        },
      ],
    },
  ];

  protected readonly compactCode = `<pk-cost-display
  locale="en-US"
  [inputTokens]="1243"
  [outputTokens]="892"
  [inputPricePer1M]="2.50"
  [outputPricePer1M]="10.00"
/>`;

  protected readonly detailedCode = `<pk-cost-display
  display="detailed"
  currency="EUR"
  locale="de-DE"
  [inputTokens]="1243"
  [outputTokens]="892"
  [inputPricePer1M]="2.30"
  [outputPricePer1M]="9.20"
/>`;

  protected readonly summaryCode = `<pk-cost-display
  display="session-summary"
  currency="CHF"
  locale="de-CH"
  [costPrecision]="2"
  [inputTokens]="42_000"
  [outputTokens]="18_000"
  [inputPricePer1M]="2.20"
  [outputPricePer1M]="8.80"
/>`;

  protected readonly jpyCode = `<pk-cost-display
  currency="JPY"
  locale="ja-JP"
  [inputTokens]="1_243_000"
  [outputTokens]="892_000"
  [inputPricePer1M]="380"
  [outputPricePer1M]="1520"
/>`;

  protected readonly limitCode = `<pk-cost-display
  [inputTokens]="500_000"
  [outputTokens]="100_000"
  [inputPricePer1M]="2.50"
  [outputPricePer1M]="10.00"
  [costLimit]="2.50"
/>`;
}
