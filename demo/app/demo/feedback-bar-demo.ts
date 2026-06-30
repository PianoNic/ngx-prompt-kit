import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideMessageSquare } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkFeedbackBar } from 'ngx-prompt-kit/feedback-bar';

@Component({
  selector: 'app-feedback-bar-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, HlmIconImports, PkFeedbackBar],
  providers: [provideIcons({ lucideMessageSquare })],
  template: `
    <app-doc-page
      title="Feedback Bar"
      description="A pill bar prompting the user to rate an assistant response. Thumbs up / thumbs down / dismiss."
    >
      <app-doc-example
        title="Default"
        description="Plain title plus the three action buttons."
        [code]="basicCode"
      >
        @if (visible1()) {
          <pk-feedback-bar
            title="Was this helpful?"
            (helpful)="onAction('helpful')"
            (notHelpful)="onAction('not-helpful')"
            (closed)="visible1.set(false)"
          />
        } @else {
          <p class="text-muted-foreground text-sm">
            Closed.
            <button
              class="text-foreground underline underline-offset-4"
              type="button"
              (click)="visible1.set(true)"
            >
              Show again
            </button>
          </p>
        }
      </app-doc-example>

      <app-doc-example
        title="With a custom leading icon"
        description="Project an icon into the [icon] slot — use any Spartan ng-icon hlm."
        [code]="iconCode"
      >
        @if (visible2()) {
          <pk-feedback-bar
            title="Tell us how the model did."
            (helpful)="onAction('helpful')"
            (notHelpful)="onAction('not-helpful')"
            (closed)="visible2.set(false)"
          >
            <ng-icon icon hlm size="sm" name="lucideMessageSquare" />
          </pk-feedback-bar>
        } @else {
          <p class="text-muted-foreground text-sm">
            Closed.
            <button
              class="text-foreground underline underline-offset-4"
              type="button"
              (click)="visible2.set(true)"
            >
              Show again
            </button>
          </p>
        }
      </app-doc-example>

      @if (lastEvent()) {
        <p class="text-muted-foreground text-sm">
          Last event: <span class="text-foreground font-mono">{{ lastEvent() }}</span>
        </p>
      }

      <app-doc-install component="feedback-bar" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class FeedbackBarDemo {
  protected readonly visible1 = signal(true);
  protected readonly visible2 = signal(true);
  protected readonly lastEvent = signal('');

  protected onAction(label: string): void {
    this.lastEvent.set(label);
    // eslint-disable-next-line no-console
    console.log('[feedback-bar]', label);
  }

  protected readonly basicCode = `<pk-feedback-bar
  title="Was this helpful?"
  (helpful)="onUp()"
  (notHelpful)="onDown()"
  (closed)="onClose()"
/>`;

  protected readonly iconCode = `<pk-feedback-bar title="Tell us how the model did." ...>
  <ng-icon icon hlm size="sm" name="lucideMessageSquare" />
</pk-feedback-bar>`;

  protected readonly api: ApiSection[] = [
    {
      name: 'PkFeedbackBar',
      props: [
        { name: 'title', type: 'string', default: "''", description: 'Bar label.' },
        { name: 'helpful', type: 'output<void>', description: 'Fires on thumbs-up click.' },
        { name: 'notHelpful', type: 'output<void>', description: 'Fires on thumbs-down click.' },
        { name: 'closed', type: 'output<void>', description: 'Fires on the X close click.' },
        { name: 'class', type: 'string', description: 'Extra classes for the wrapper.' },
        {
          name: '[icon] slot',
          type: 'ng-content',
          description: 'Project a leading icon (any element with the icon attribute).',
        },
      ],
    },
  ];
}
