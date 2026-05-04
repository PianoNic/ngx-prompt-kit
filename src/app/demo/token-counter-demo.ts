import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmTextarea } from '@spartan-ng/helm/textarea';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkMessageImports } from 'ngx-prompt-kit/message';
import { PkTokenCounterImports } from 'ngx-prompt-kit/token-counter';

@Component({
  selector: 'app-token-counter-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocPage,
    DocExample,
    DocInstall,
    DocApi,
    HlmTextarea,
    PkMessageImports,
    PkTokenCounterImports,
  ],
  template: `
    <app-doc-page
      title="Token Counter"
      [original]="true"
      description="Inline character / token counter for a prompt input. Six display modes — compact, detailed, progress, remaining, hidden, footer — and a four-tier threshold inspired by IDE-style token meters."
    >
      <app-doc-example
        title="Compact, no limit"
        description="Default. Just the number — pair with a prompt input where the limit is implicit (or unset)."
        [code]="compactCode"
      >
        <div class="flex w-full flex-col gap-2">
          <textarea
            hlmTextarea
            class="min-h-20 w-full"
            placeholder="Type something..."
            [value]="text1()"
            (input)="text1.set($any($event.target).value)"
          ></textarea>
          <div class="flex justify-end">
            <pk-token-counter [text]="text1()" />
          </div>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Compact with limit"
        description="Pass a [limit] to render the running ratio. Color steps through muted → amber (≥75%) → destructive (≥90%) → bold destructive (>100%)."
        [code]="compactLimitCode"
      >
        <div class="flex w-full flex-col gap-2">
          <textarea
            hlmTextarea
            class="min-h-20 w-full"
            [value]="text2()"
            (input)="text2.set($any($event.target).value)"
          ></textarea>
          <div class="flex items-center justify-between">
            @if (limitWarning(); as msg) {
              <span class="text-destructive text-xs">{{ msg }}</span>
            } @else {
              <span></span>
            }
            <pk-token-counter
              [text]="text2()"
              [limit]="200"
              (overLimit)="onOverLimit($event)"
            />
          </div>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Detailed mode, both metrics"
        description="Set [display]='detailed' for thousand separators and a percentage. With [mode]='both' the secondary token count renders alongside."
        [code]="detailedCode"
      >
        <div class="flex w-full flex-col gap-2">
          <textarea
            hlmTextarea
            class="min-h-32 w-full"
            [value]="text3()"
            (input)="text3.set($any($event.target).value)"
          ></textarea>
          <div class="flex justify-end">
            <pk-token-counter
              display="detailed"
              mode="both"
              [text]="text3()"
              [limit]="4000"
            />
          </div>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Progress mode — threshold trio"
        description="Static side-by-side comparison of the three colored states. Use this mode when you want a permanent visual budget indicator (IDE-style budget pattern)."
        [code]="progressCode"
      >
        <div class="flex w-full flex-col gap-6">
          <div>
            <p class="text-muted-foreground mb-2 text-xs uppercase tracking-wider">Normal · 30%</p>
            <pk-token-counter display="progress" [text]="filler30()" [limit]="200" />
          </div>
          <div>
            <p class="text-muted-foreground mb-2 text-xs uppercase tracking-wider">Near limit · 85%</p>
            <pk-token-counter display="progress" [text]="filler85()" [limit]="200" />
          </div>
          <div>
            <p class="text-muted-foreground mb-2 text-xs uppercase tracking-wider">Over limit · 105%</p>
            <pk-token-counter display="progress" [text]="filler105()" [limit]="200" />
          </div>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Remaining mode — inverse framing"
        description="Shows headroom rather than usage. Thresholds invert: amber when remaining < 25% of limit, destructive when remaining < 10%. Reads more naturally for 'running low' contexts."
        [code]="remainingCode"
      >
        <div class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="border-border bg-background rounded-lg border p-4">
            <p class="text-muted-foreground mb-2 text-xs uppercase tracking-wider">Healthy</p>
            <pk-token-counter display="remaining" [text]="filler25Pct()" [limit]="4000" />
          </div>
          <div class="border-border bg-background rounded-lg border p-4">
            <p class="text-muted-foreground mb-2 text-xs uppercase tracking-wider">Low</p>
            <pk-token-counter display="remaining" [text]="filler94Pct()" [limit]="4000" />
          </div>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Hidden mode — surface on threshold"
        description="ChatGPT-style. Renders nothing until usage crosses [appearAt] (default 0.75 of limit). Use this to keep the UI quiet until the user actually needs to know."
        [code]="hiddenCode"
      >
        <div class="grid w-full grid-cols-1 gap-6 sm:grid-cols-2">
          <div class="border-border bg-background flex min-h-24 flex-col rounded-lg border p-4">
            <p class="text-muted-foreground mb-2 text-xs uppercase tracking-wider">
              50% usage · threshold not crossed
            </p>
            <div class="flex flex-1 items-end justify-end">
              <pk-token-counter display="hidden" [text]="filler50Pct()" [limit]="200" />
              <span class="text-muted-foreground/60 text-[10px] italic">(nothing renders)</span>
            </div>
          </div>
          <div class="border-border bg-background flex min-h-24 flex-col rounded-lg border p-4">
            <p class="text-muted-foreground mb-2 text-xs uppercase tracking-wider">
              80% usage · threshold crossed
            </p>
            <div class="flex flex-1 items-end justify-end">
              <pk-token-counter display="hidden" [text]="filler80Pct()" [limit]="200" />
            </div>
          </div>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Footer mode — post-response usage"
        description="Vercel AI SDK Playground pattern. Quieter than compact, designed for placement below a completed message rather than next to a live input. Leading separator and reduced size."
        [code]="footerCode"
      >
        <div class="flex w-full flex-col gap-1">
          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <pk-message-content
              content="Refactor complete — the auth middleware now delegates to a SessionService, and the integration tests cover both branches."
            />
          </pk-message>
          <div class="ml-11 flex items-center">
            <span class="text-muted-foreground text-[10px]">Response</span>
            <pk-token-counter display="footer" mode="tokens" [text]="footerSampleText()" />
          </div>
        </div>
      </app-doc-example>

      <app-doc-install component="token-counter" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class TokenCounterDemo {
  protected readonly text1 = signal('Summarize the latest commit log.');
  protected readonly text2 = signal(
    'A medium prompt that sits comfortably under the limit, leaving room for the user to keep typing.',
  );
  protected readonly text3 = signal(
    'Refactor the auth middleware to extract the session refresh helper into its own service. Update the call sites in the API layer, regenerate the OpenAPI spec, and add an integration test that exercises both the success and the expired-token branches. Document the migration in CHANGELOG.md.',
  );
  protected readonly limitWarning = signal<string | null>(null);

  protected readonly filler30 = signal('a'.repeat(60));
  protected readonly filler85 = signal('a'.repeat(170));
  protected readonly filler105 = signal('a'.repeat(210));

  // remaining-mode fillers (against limit=4000)
  protected readonly filler25Pct = signal('a'.repeat(1000)); // 1000/4000 used → 75% remaining → muted
  protected readonly filler94Pct = signal('a'.repeat(3760)); // 3760/4000 used → 6% remaining → destructive

  // hidden-mode fillers (against limit=200)
  protected readonly filler50Pct = signal('a'.repeat(100));
  protected readonly filler80Pct = signal('a'.repeat(160));

  // footer-mode sample (≈ 308 tokens worth of text)
  protected readonly footerSampleText = signal('a'.repeat(1232));

  protected onOverLimit(over: boolean): void {
    this.limitWarning.set(over ? 'Over the 200-character limit.' : null);
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkTokenCounter',
      props: [
        { name: 'text', type: 'string', description: 'The text to count (required).' },
        {
          name: 'mode',
          type: '"chars" | "tokens" | "both"',
          default: '"chars"',
          description:
            'Which metric(s) to render. In "both" mode the limit/percentage applies to chars; tokens render as a secondary span.',
        },
        {
          name: 'display',
          type: '"hidden" | "compact" | "progress" | "detailed" | "remaining" | "footer"',
          default: '"compact"',
          description:
            'compact: bare numbers. detailed: separators + percentage. progress: detailed + bar. remaining: inverse framing (headroom). hidden: appears at appearAt threshold. footer: small muted post-response style.',
        },
        {
          name: 'limit',
          type: 'number | null',
          default: 'null',
          description:
            'Optional max. Drives the four-tier color state, the progress fill, and the (overLimit) output. Required for hidden and remaining modes to render meaningfully.',
        },
        {
          name: 'appearAt',
          type: 'number',
          default: '0.75',
          description:
            'Hidden mode only — usage ratio (0–1) above which the counter starts rendering. Ignored for other display modes.',
        },
        {
          name: 'estimateTokens',
          type: '(text: string) => number',
          default: 'Math.ceil(text.length / 4)',
          description: 'Token estimator. Swap in tiktoken or any model-specific tokenizer.',
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
            'Fires once each time the active count crosses the limit threshold (true on cross-over, false on cross-back).',
        },
      ],
    },
  ];

  protected readonly compactCode = `<pk-token-counter [text]="value()" />`;

  protected readonly compactLimitCode = `<pk-token-counter
  [text]="value()"
  [limit]="200"
  (overLimit)="onOverLimit($event)"
/>`;

  protected readonly detailedCode = `<pk-token-counter
  display="detailed"
  mode="both"
  [text]="value()"
  [limit]="4000"
/>`;

  protected readonly progressCode = `<pk-token-counter
  display="progress"
  [text]="value()"
  [limit]="200"
/>`;

  protected readonly remainingCode = `<pk-token-counter
  display="remaining"
  [text]="value()"
  [limit]="4000"
/>`;

  protected readonly hiddenCode = `<pk-token-counter
  display="hidden"
  [text]="value()"
  [limit]="200"
  [appearAt]="0.75"
/>`;

  protected readonly footerCode = `<pk-token-counter
  display="footer"
  mode="tokens"
  [text]="responseText"
/>`;
}
