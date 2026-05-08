import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkFeedbackBar } from 'ngx-prompt-kit/feedback-bar';
import { PkStreamControlsImports } from 'ngx-prompt-kit/stream-controls';
import { PkSystemMessage } from 'ngx-prompt-kit/system-message';

type Phase = 'error' | 'recovering' | 'recovered';

@Component({
  selector: 'app-block-system-retry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    PkFeedbackBar,
    PkStreamControlsImports,
    PkSystemMessage,
  ],
  template: `
    <app-block-page
      title="System notice + retry"
      description="The error-and-recover lane. A failed stream surfaces a system-message, stream-controls switches to Try again, and once we recover, a feedback-bar prompts for a rating."
    >
      <app-doc-example title="Error → retry → feedback" [code]="code">
        <div class="flex w-full max-w-xl flex-col gap-4">
          @switch (phase()) {
            @case ('error') {
              <pk-system-message
                text="Stream failed: upstream timeout after 30s."
                variant="error"
                [fill]="true"
                ctaLabel="Details"
                (ctaClicked)="lastEvent.set('details requested')"
              />
              <div class="flex justify-end">
                <pk-stream-controls state="error" (regenerate)="retry()" />
              </div>
            }

            @case ('recovering') {
              <pk-system-message
                text="Retrying with the same prompt..."
                variant="action"
                [fill]="true"
              />
              <div class="flex justify-end">
                <pk-stream-controls state="streaming" (stop)="abort()" />
              </div>
            }

            @case ('recovered') {
              <pk-system-message text="Response delivered." variant="action" [fill]="false" />
              @if (showFeedback()) {
                <pk-feedback-bar
                  title="How was that response after the retry?"
                  (helpful)="onFeedback('helpful')"
                  (notHelpful)="onFeedback('not-helpful')"
                  (closed)="showFeedback.set(false)"
                />
              } @else {
                <p class="text-muted-foreground text-xs">
                  Feedback dismissed.
                  <button
                    type="button"
                    class="text-foreground underline underline-offset-4"
                    (click)="showFeedback.set(true)"
                  >
                    Show again
                  </button>
                </p>
              }
            }
          }

          @if (lastEvent(); as e) {
            <p class="text-muted-foreground text-xs">
              Last event: <span class="text-foreground font-mono">{{ e }}</span>
            </p>
          }

          <div class="text-muted-foreground flex items-center justify-end gap-2 text-xs">
            <span>Phase:</span>
            <span class="text-foreground font-mono">{{ phase() }}</span>
            <button
              class="text-foreground underline underline-offset-4"
              type="button"
              (click)="reset()"
            >
              reset
            </button>
          </div>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class SystemRetryBlock {
  protected readonly phase = signal<Phase>('error');
  protected readonly showFeedback = signal(true);
  protected readonly lastEvent = signal<string | null>(null);

  protected retry(): void {
    this.phase.set('recovering');
    this.lastEvent.set('retry kicked off');
    setTimeout(() => {
      this.phase.set('recovered');
      this.showFeedback.set(true);
    }, 1500);
  }

  protected abort(): void {
    this.phase.set('error');
    this.lastEvent.set('retry aborted');
  }

  protected onFeedback(kind: 'helpful' | 'not-helpful'): void {
    this.lastEvent.set('feedback: ' + kind);
    this.showFeedback.set(false);
  }

  protected reset(): void {
    this.phase.set('error');
    this.showFeedback.set(true);
    this.lastEvent.set(null);
  }

  protected readonly code = `@switch (phase()) {
  @case ('error') {
    <pk-system-message
      text="Stream failed: upstream timeout after 30s."
      variant="error" [fill]="true"
      ctaLabel="Details"
      (ctaClicked)="showDetails()"
    />
    <pk-stream-controls state="error" (regenerate)="retry()" />
  }

  @case ('recovering') {
    <pk-system-message
      text="Retrying with the same prompt..."
      variant="action" [fill]="true"
    />
    <pk-stream-controls state="streaming" (stop)="abort()" />
  }

  @case ('recovered') {
    <pk-system-message text="Response delivered." variant="action" />
    <pk-feedback-bar
      title="How was that response after the retry?"
      (helpful)="rate('helpful')"
      (notHelpful)="rate('not-helpful')"
      (closed)="showFeedback.set(false)"
    />
  }
}

// Component
type Phase = 'error' | 'recovering' | 'recovered';
protected readonly phase = signal<Phase>('error');

protected retry(): void {
  this.phase.set('recovering');
  setTimeout(() => this.phase.set('recovered'), 1500);
}`;
}
