import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkSystemMessage } from 'ngx-prompt-kit/system-message';

@Component({
  selector: 'app-system-message-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkSystemMessage],
  template: `
    <app-doc-page
      title="System Message"
      description="Out-of-band notice for actions, errors, and warnings. Distinct from a regular chat message; supports an optional CTA."
    >
      <app-doc-example
        title="Variants"
        description="action / error / warning. Default 'action' looks neutral; the others use semantic color."
        [code]="variantsCode"
      >
        <div class="flex w-full max-w-xl flex-col gap-3">
          <pk-system-message text="Connected to model gpt-4o." variant="action" />
          <pk-system-message text="Rate limit reached. Try again in 30s." variant="error" />
          <pk-system-message
            text="Some tool calls were skipped due to permissions."
            variant="warning"
          />
        </div>
      </app-doc-example>

      <app-doc-example
        title="Filled background"
        description="[fill]=true uses a solid tinted background instead of just a border."
        [code]="filledCode"
      >
        <div class="flex w-full max-w-xl flex-col gap-3">
          <pk-system-message text="Saved to your history." variant="action" [fill]="true" />
          <pk-system-message text="Network error — retrying..." variant="error" [fill]="true" />
        </div>
      </app-doc-example>

      <app-doc-example
        title="With CTA"
        description="Pass ctaLabel to add a Spartan button on the right."
        [code]="ctaCode"
      >
        <pk-system-message
          text="A new model is available."
          variant="action"
          [fill]="true"
          ctaLabel="Switch"
          (ctaClicked)="lastEvent.set('switch')"
          class="max-w-xl"
        />
        @if (lastEvent()) {
          <p class="text-muted-foreground mt-3 text-sm">
            Last event: <span class="text-foreground font-mono">{{ lastEvent() }}</span>
          </p>
        }
      </app-doc-example>

      <app-doc-install component="system-message" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class SystemMessageDemo {
  protected readonly lastEvent = signal('');

  protected readonly variantsCode = `<pk-system-message text="Connected to model gpt-4o." variant="action" />
<pk-system-message text="Rate limit reached. Try again in 30s." variant="error" />
<pk-system-message text="Some tool calls were skipped." variant="warning" />`;

  protected readonly filledCode = `<pk-system-message text="Saved to your history." variant="action" [fill]="true" />
<pk-system-message text="Network error — retrying..." variant="error" [fill]="true" />`;

  protected readonly ctaCode = `<pk-system-message
  text="A new model is available."
  variant="action"
  [fill]="true"
  ctaLabel="Switch"
  (ctaClicked)="onSwitch()"
/>`;

  protected readonly api: ApiSection[] = [
    {
      name: 'PkSystemMessage',
      props: [
        {
          name: 'text',
          type: 'string',
          default: "''",
          description: 'Main label (or project via ng-content).',
        },
        {
          name: 'variant',
          type: '"action" | "error" | "warning"',
          default: '"action"',
          description: 'Color treatment.',
        },
        {
          name: 'fill',
          type: 'boolean',
          default: 'false',
          description: 'Solid tinted background instead of a border.',
        },
        {
          name: 'icon',
          type: 'boolean',
          default: 'true',
          description: 'Show the default lucide icon for the variant.',
        },
        {
          name: 'ctaLabel',
          type: 'string',
          default: "''",
          description: 'When set, renders a Spartan button on the right.',
        },
        {
          name: 'ctaClicked',
          type: 'output<void>',
          description: 'Fires when the CTA button is clicked.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the wrapper.' },
      ],
    },
  ];
}
