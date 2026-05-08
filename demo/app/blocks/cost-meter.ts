import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUp } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkCostDisplayImports } from 'ngx-prompt-kit/cost-display';
import { PkPromptInputImports } from 'ngx-prompt-kit/prompt-input';
import { PkTokenCounterImports } from 'ngx-prompt-kit/token-counter';

@Component({
  selector: 'app-block-cost-meter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmButton,
    HlmIconImports,
    PkCostDisplayImports,
    PkPromptInputImports,
    PkTokenCounterImports,
  ],
  providers: [provideIcons({ lucideArrowUp })],
  template: `
    <app-block-page
      title="Cost + token meter"
      description="Compose footer for billing-conscious apps. Live token estimate against a budget threshold; running session cost in the corner."
    >
      <app-doc-example title="Live tokens · running cost · per-message estimate" [code]="code">
        <div class="mx-auto flex w-full max-w-2xl flex-col gap-3">
          <div class="flex items-center justify-between">
            <span class="text-muted-foreground text-[10px] font-medium uppercase tracking-wider">
              This session
            </span>
            <pk-cost-display
              display="session-summary"
              currency="USD"
              locale="en-US"
              [costPrecision]="2"
              [inputTokens]="totalInputTokens()"
              [outputTokens]="totalOutputTokens()"
              [inputPricePer1M]="2.5"
              [outputPricePer1M]="10.0"
            />
          </div>

          <pk-prompt-input [(value)]="value" (submitted)="onSend()">
            <pk-prompt-input-textarea placeholder="Type a long prompt to watch the meter..." />
            <pk-prompt-input-actions class="mt-2 justify-between">
              <pk-token-counter
                display="progress"
                [text]="value()"
                [limit]="800"
                class="min-w-0 flex-1"
              />
              <pk-prompt-input-action tooltip="Send">
                <button
                  hlmBtn
                  size="icon-sm"
                  type="button"
                  class="rounded-full"
                  (click)="onSend()"
                  aria-label="Send"
                >
                  <ng-icon hlm size="xs" name="lucideArrowUp" />
                </button>
              </pk-prompt-input-action>
            </pk-prompt-input-actions>
          </pk-prompt-input>

          <div
            class="border-border flex flex-col gap-2 rounded-md border border-dashed p-3 text-xs"
          >
            <p class="text-muted-foreground">
              Sent: <span class="text-foreground font-mono">{{ sentCount() }}</span> · estimated
              cost of next message:
            </p>
            <pk-cost-display
              display="detailed"
              locale="en-US"
              [inputTokens]="estimatedTokens()"
              [outputTokens]="estimatedTokens() * 2"
              [inputPricePer1M]="2.5"
              [outputPricePer1M]="10.0"
            />
          </div>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class CostMeterBlock {
  protected readonly value = signal(
    'Refactor the auth middleware to extract the session refresh helper. Update call sites and add an integration test.',
  );
  protected readonly sentCount = signal(3);
  protected readonly totalInputTokens = signal(2_400);
  protected readonly totalOutputTokens = signal(5_180);

  protected readonly estimatedTokens = computed(() =>
    Math.max(1, Math.ceil(this.value().length / 4)),
  );

  protected onSend(): void {
    const text = this.value().trim();
    if (!text) return;
    const inTok = this.estimatedTokens();
    const outTok = inTok * 2;
    this.totalInputTokens.update((v) => v + inTok);
    this.totalOutputTokens.update((v) => v + outTok);
    this.sentCount.update((v) => v + 1);
    this.value.set('');
  }

  protected readonly code = `<!-- Status bar showing running session cost -->
<div class="flex justify-end">
  <pk-cost-display
    display="session-summary"
    currency="USD"
    [costPrecision]="2"
    [inputTokens]="totalInputTokens()"
    [outputTokens]="totalOutputTokens()"
    [inputPricePer1M]="2.5"
    [outputPricePer1M]="10.0"
  />
</div>

<!-- Compose row with live token meter inside the actions footer -->
<pk-prompt-input [(value)]="value" (submitted)="onSend()">
  <pk-prompt-input-textarea placeholder="Type a prompt..." />
  <pk-prompt-input-actions class="mt-2 justify-between">
    <pk-token-counter
      display="progress"
      [text]="value()"
      [limit]="800"
      class="flex-1"
    />
    <pk-prompt-input-action tooltip="Send">
      <button hlmBtn size="icon-sm" class="rounded-full" (click)="onSend()">
        <ng-icon hlm size="xs" name="lucideArrowUp" />
      </button>
    </pk-prompt-input-action>
  </pk-prompt-input-actions>
</pk-prompt-input>

<!-- Pre-send estimate of just this message -->
<pk-cost-display
  display="detailed"
  [inputTokens]="estimatedTokens()"
  [outputTokens]="estimatedTokens() * 2"
  [inputPricePer1M]="2.5"
  [outputPricePer1M]="10.0"
/>

// Component
protected readonly value = signal('');
protected readonly totalInputTokens = signal(2_400);
protected readonly totalOutputTokens = signal(5_180);
protected readonly estimatedTokens = computed(() =>
  Math.max(1, Math.ceil(this.value().length / 4))
);

protected onSend(): void {
  const tokens = this.estimatedTokens();
  this.totalInputTokens.update(v => v + tokens);
  this.totalOutputTokens.update(v => v + tokens * 2);
  this.value.set('');
}`;
}
