import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideCircleAlert, lucideInfo, lucideRotateCcw, lucideSquare } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkFeedbackBar } from 'ngx-prompt-kit/feedback-bar';

type Phase = 'error' | 'recovering' | 'recovered';

@Component({
  selector: 'app-block-system-retry',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, HlmAlertImports, HlmButton, NgIcon, PkFeedbackBar],
  providers: [provideIcons({ lucideCircleAlert, lucideInfo, lucideRotateCcw, lucideSquare })],
  template: `
    <app-block-page
      title="System notice + retry"
      description="The error-and-recover lane. A failed stream surfaces a spartan alert, the button switches to Try again, and once we recover, a feedback-bar prompts for a rating."
    >
      <app-doc-example title="Error → retry → feedback" [code]="code">
        <div class="flex w-full max-w-xl flex-col gap-4">
          @switch (phase()) {
            @case ('error') {
              <div hlmAlert variant="destructive">
                <ng-icon name="lucideCircleAlert" />
                <p hlmAlertDescription>Stream failed: upstream timeout after 30s.</p>
                <div hlmAlertAction>
                  <button
                    hlmBtn
                    variant="outline"
                    size="xs"
                    type="button"
                    (click)="lastEvent.set('details requested')"
                  >
                    Details
                  </button>
                </div>
              </div>
              <div class="flex justify-end">
                <button
                  hlmBtn
                  variant="outline"
                  size="sm"
                  type="button"
                  class="text-destructive border-destructive/40 hover:bg-destructive/10"
                  (click)="retry()"
                >
                  <ng-icon name="lucideRotateCcw" />
                  Try again
                </button>
              </div>
            }

            @case ('recovering') {
              <div hlmAlert>
                <ng-icon name="lucideInfo" />
                <p hlmAlertDescription>Retrying with the same prompt...</p>
              </div>
              <div class="flex justify-end">
                <button hlmBtn variant="secondary" size="sm" type="button" (click)="abort()">
                  <ng-icon name="lucideSquare" />
                  Stop
                </button>
              </div>
            }

            @case ('recovered') {
              <div hlmAlert>
                <ng-icon name="lucideInfo" />
                <p hlmAlertDescription>Response delivered.</p>
              </div>
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
    <div hlmAlert variant="destructive">
      <ng-icon name="lucideCircleAlert" />
      <p hlmAlertDescription>Stream failed: upstream timeout after 30s.</p>
      <div hlmAlertAction>
        <button hlmBtn variant="outline" size="xs" (click)="showDetails()">Details</button>
      </div>
    </div>
    <button
      hlmBtn
      variant="outline"
      size="sm"
      type="button"
      class="text-destructive border-destructive/40 hover:bg-destructive/10"
      (click)="retry()"
    >
      <ng-icon name="lucideRotateCcw" />
      Try again
    </button>
  }

  @case ('recovering') {
    <div hlmAlert>
      <ng-icon name="lucideInfo" />
      <p hlmAlertDescription>Retrying with the same prompt...</p>
    </div>
    <button hlmBtn variant="secondary" size="sm" type="button" (click)="abort()">
      <ng-icon name="lucideSquare" />
      Stop
    </button>
  }

  @case ('recovered') {
    <div hlmAlert>
      <ng-icon name="lucideInfo" />
      <p hlmAlertDescription>Response delivered.</p>
    </div>
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
