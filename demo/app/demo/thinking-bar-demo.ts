import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkThinkingBar } from 'ngx-prompt-kit/thinking-bar';

@Component({
  selector: 'app-thinking-bar-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkThinkingBar],
  template: `
    <app-doc-page
      title="Thinking Bar"
      description="A compact 'still working' indicator — combine the shimmer label with optional click-to-expand or stop affordances."
    >
      <app-doc-example
        title="Static label"
        description="Just the shimmer text. No interaction."
        [code]="staticCode"
      >
        <pk-thinking-bar text="Generating answer" class="max-w-md" />
      </app-doc-example>

      <app-doc-example
        title="With stop button"
        description="Add a stop affordance for cancellable streams."
        [code]="stopCode"
      >
        <pk-thinking-bar
          text="Streaming response"
          stopLabel="Stop"
          [showStop]="true"
          (stopped)="lastEvent.set('stopped')"
          class="max-w-md"
        />
      </app-doc-example>

      <app-doc-example
        title="Clickable + stop"
        description="Bar itself becomes clickable with a chevron — open a thinking panel or a tool drawer on click."
        [code]="clickableCode"
      >
        <pk-thinking-bar
          text="Inspecting 14 functions"
          stopLabel="Skip"
          [clickable]="true"
          [showStop]="true"
          (clicked)="lastEvent.set('clicked')"
          (stopped)="lastEvent.set('stopped')"
          class="max-w-md"
        />
      </app-doc-example>

      @if (lastEvent()) {
        <p class="text-muted-foreground text-sm">
          Last event: <span class="text-foreground font-mono">{{ lastEvent() }}</span>
        </p>
      }

      <app-doc-install component="thinking-bar" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ThinkingBarDemo {
  protected readonly lastEvent = signal('');

  protected readonly staticCode = `<pk-thinking-bar text="Generating answer" />`;
  protected readonly stopCode = `<pk-thinking-bar
  text="Streaming response"
  stopLabel="Stop"
  [showStop]="true"
  (stopped)="onStop()"
/>`;
  protected readonly clickableCode = `<pk-thinking-bar
  text="Inspecting 14 functions"
  [clickable]="true"
  [showStop]="true"
  (clicked)="onOpen()"
  (stopped)="onStop()"
/>`;

  protected readonly api: ApiSection[] = [
    {
      name: 'PkThinkingBar',
      props: [
        { name: 'text', type: 'string', default: "'Thinking'", description: 'Shimmer label.' },
        {
          name: 'stopLabel',
          type: 'string',
          default: "'Answer now'",
          description: 'Stop button label.',
        },
        {
          name: 'showStop',
          type: 'boolean',
          default: 'false',
          description: 'Render the stop button.',
        },
        {
          name: 'clickable',
          type: 'boolean',
          default: 'false',
          description: 'Render the label as a click target with chevron.',
        },
        {
          name: 'stopped',
          type: 'output<void>',
          description: 'Fires when the stop button is clicked.',
        },
        {
          name: 'clicked',
          type: 'output<void>',
          description: 'Fires when the bar is clicked (when clickable).',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the wrapper.' },
      ],
    },
  ];
}
