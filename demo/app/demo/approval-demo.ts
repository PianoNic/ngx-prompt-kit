import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkApprovalImports } from 'ngx-prompt-kit/approval';

@Component({
  selector: 'app-approval-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkApprovalImports],
  template: `
    <app-doc-page
      title="Approval"
      [original]="true"
      description="A confirmation card for tool execution. Three severity tiers (info / warning / destructive) drive the action badge color and the Approve button variant."
    >
      <app-doc-example
        title="Minimal — yes / no question"
        description="Just a title and the two buttons. Use when there's nothing to disclose beyond the question itself — tool name, parameters, and severity all elided."
        [code]="minimalCode"
      >
        <pk-approval
          title="Allow the assistant to access your clipboard?"
          (approved)="lastChoice.set('approved minimal')"
          (rejected)="lastChoice.set('rejected minimal')"
        />
      </app-doc-example>

      <app-doc-example
        title="Info — read-only tool call"
        description="Default severity. Use for low-risk actions: querying data, reading a file, listing resources. Approve gets the default button styling."
        [code]="infoCode"
      >
        <pk-approval
          title="Run database query"
          description="The assistant wants to read from the analytics warehouse. No mutation will occur."
          action="execute"
          severity="info"
          [parameters]="infoParams"
          (approved)="lastChoice.set('approved info')"
          (rejected)="lastChoice.set('rejected info')"
        />
      </app-doc-example>

      <app-doc-example
        title="Warning — side effects"
        description="Use for actions with reversible-but-noisy side effects: sending notifications, creating records, calling rate-limited APIs."
        [code]="warningCode"
      >
        <pk-approval
          title="Send email to 247 recipients"
          description="The assistant prepared a marketing campaign. Recipients are filtered to verified addresses only."
          action="send"
          severity="warning"
          [parameters]="warningParams"
          (approved)="lastChoice.set('approved warning')"
          (rejected)="lastChoice.set('rejected warning')"
        />
      </app-doc-example>

      <app-doc-example
        title="Destructive — irreversible"
        description="Use for hard-to-reverse actions. The Approve button switches to destructive variant. Pending state shows a spinner and disables both buttons."
        [code]="destructiveCode"
      >
        <div class="flex w-full flex-col gap-3">
          <pk-approval
            title="Delete repository"
            description="Removes the repository, all branches, and all associated CI history. This cannot be undone."
            action="delete"
            severity="destructive"
            [parameters]="destructiveParams"
            [pending]="deleting()"
            approveLabel="Delete forever"
            (approved)="confirmDelete()"
            (rejected)="lastChoice.set('rejected destructive')"
          />
          @if (lastChoice(); as c) {
            <p class="text-muted-foreground text-center text-xs">
              Last action: <span class="text-foreground font-mono">{{ c }}</span>
            </p>
          }
        </div>
      </app-doc-example>

      <app-doc-install component="approval" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ApprovalDemo {
  protected readonly lastChoice = signal<string | null>(null);
  protected readonly deleting = signal(false);

  protected readonly infoParams = [
    { label: 'table', value: 'events_2026_05' },
    { label: 'limit', value: '10000' },
  ];

  protected readonly warningParams = [
    { label: 'list', value: 'q2-newsletter' },
    { label: 'recipients', value: '247 (verified only)' },
    { label: 'subject', value: 'Your Q2 update is here — three new releases inside' },
  ];

  protected readonly destructiveParams = [
    { label: 'org', value: 'PianoNic' },
    { label: 'repo', value: 'ngx-prompt-kit' },
    { label: 'branches', value: '14' },
    { label: 'workflow runs', value: '1,243' },
  ];

  protected confirmDelete(): void {
    this.lastChoice.set('approved destructive');
    this.deleting.set(true);
    setTimeout(() => this.deleting.set(false), 2000);
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkApproval',
      props: [
        { name: 'title', type: 'string', description: 'The action being requested (required).' },
        {
          name: 'description',
          type: 'string | undefined',
          description: 'Optional context shown beneath the title.',
        },
        {
          name: 'action',
          type: 'string | undefined',
          description: 'Verb shown in the badge — e.g. "execute", "send", "delete".',
        },
        {
          name: 'severity',
          type: '"info" | "warning" | "destructive"',
          default: '"info"',
          description: 'Drives the action badge tint and the Approve button variant.',
        },
        {
          name: 'parameters',
          type: 'readonly ApprovalParameter[]',
          default: '[]',
          description:
            'Label/value rows shown beneath the description. Each: { label, value, truncate? }.',
        },
        {
          name: 'approveLabel',
          type: 'string',
          default: '"Approve"',
          description: 'Approve button label.',
        },
        {
          name: 'rejectLabel',
          type: 'string',
          default: '"Reject"',
          description: 'Reject button label.',
        },
        {
          name: 'pending',
          type: 'boolean',
          default: 'false',
          description:
            'Disables both buttons and shows a spinner on Approve while an async action is in flight.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'PkApprovalParameter',
      props: [
        { name: 'label', type: 'string', description: 'Parameter name (required).' },
        {
          name: 'value',
          type: 'string',
          description: 'Parameter value, rendered in monospace (required).',
        },
        {
          name: 'truncate',
          type: 'boolean',
          default: 'true',
          description: 'Truncate long values with ellipsis.',
        },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'approved',
          type: '() => void',
          description: 'Approve clicked, or Enter pressed while focused.',
        },
        {
          name: 'rejected',
          type: '() => void',
          description: 'Reject clicked, or Esc pressed while focused.',
        },
      ],
    },
  ];

  protected readonly minimalCode = `<pk-approval
  title="Allow the assistant to access your clipboard?"
  (approved)="allow()"
  (rejected)="cancel()"
/>`;

  protected readonly infoCode = `<pk-approval
  title="Run database query"
  description="The assistant wants to read from the analytics warehouse."
  action="execute"
  severity="info"
  [parameters]="[
    { label: 'table', value: 'events_2026_05' },
    { label: 'limit', value: '10000' },
  ]"
  (approved)="run()"
  (rejected)="cancel()"
/>`;

  protected readonly warningCode = `<pk-approval
  title="Send email to 247 recipients"
  action="send"
  severity="warning"
  [parameters]="campaignParams"
  (approved)="send()"
  (rejected)="cancel()"
/>`;

  protected readonly destructiveCode = `<pk-approval
  title="Delete repository"
  description="Removes the repository, all branches, and all associated CI history."
  action="delete"
  severity="destructive"
  [parameters]="repoParams"
  [pending]="deleting()"
  approveLabel="Delete forever"
  (approved)="confirmDelete()"
  (rejected)="cancel()"
/>`;
}
