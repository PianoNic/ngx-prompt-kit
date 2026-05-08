import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import {
  PkStreamControlsImports,
  type StreamControlsState,
} from 'ngx-prompt-kit/stream-controls';

@Component({
  selector: 'app-stream-controls-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkStreamControlsImports],
  template: `
    <app-doc-page
      title="Stream Controls"
      [original]="true"
      description="A single button that swaps based on stream state — Stop while a response is streaming, Regenerate after it completes, Try again on error."
    >
      <app-doc-example
        title="Streaming"
        description="State 'streaming' renders a Stop button. Click to abort the active request — wire (stop) to your AbortController."
        [code]="streamingCode"
      >
        <pk-stream-controls state="streaming" (stop)="log('stop')" />
      </app-doc-example>

      <app-doc-example
        title="Idle (after a response)"
        description="State 'idle' renders Regenerate when [canRegenerate]='true' (default). Set false to hide it — useful while there's no prior message to regenerate."
        [code]="idleCode"
      >
        <pk-stream-controls state="idle" (regenerate)="log('regenerate')" />
      </app-doc-example>

      <app-doc-example
        title="Error"
        description="State 'error' renders Try again with destructive styling. Same (regenerate) output — your handler can branch on whether the previous attempt failed."
        [code]="errorCode"
      >
        <pk-stream-controls state="error" (regenerate)="log('retry')" />
      </app-doc-example>

      <app-doc-example
        title="Interactive"
        description="Click through a simulated lifecycle: idle → streaming → idle. Stop transitions to idle; Regenerate transitions back to streaming."
        [code]="interactiveCode"
      >
        <div class="flex w-full flex-col items-center gap-3">
          <pk-stream-controls
            [state]="state()"
            (stop)="state.set('idle')"
            (regenerate)="kickOff()"
          />
          <p class="text-muted-foreground text-xs">
            Current state: <span class="text-foreground font-mono">{{ state() }}</span>
          </p>
        </div>
      </app-doc-example>

      <app-doc-install component="stream-controls" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class StreamControlsDemo {
  protected readonly state = signal<StreamControlsState>('idle');

  protected log(event: string): void {
    console.log('[stream-controls demo]', event);
  }

  protected kickOff(): void {
    this.state.set('streaming');
    setTimeout(() => this.state.set('idle'), 1500);
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkStreamControls',
      props: [
        {
          name: 'state',
          type: '"idle" | "streaming" | "error"',
          description: 'Drives which button renders (required).',
        },
        {
          name: 'canRegenerate',
          type: 'boolean',
          default: 'true',
          description:
            'When false, the idle state renders nothing instead of a Regenerate button.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'stop',
          type: '() => void',
          description: 'Fires when the Stop button is clicked (state="streaming").',
        },
        {
          name: 'regenerate',
          type: '() => void',
          description:
            'Fires when Regenerate or Try again is clicked (state="idle" or "error").',
        },
      ],
    },
  ];

  protected readonly streamingCode = `<pk-stream-controls
  state="streaming"
  (stop)="abortController.abort()"
/>`;

  protected readonly idleCode = `<pk-stream-controls
  state="idle"
  (regenerate)="resend()"
/>`;

  protected readonly errorCode = `<pk-stream-controls
  state="error"
  (regenerate)="retry()"
/>`;

  protected readonly interactiveCode = `<pk-stream-controls
  [state]="streamState()"
  (stop)="abort()"
  (regenerate)="send()"
/>`;
}
