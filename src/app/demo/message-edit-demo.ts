import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkMessageImports } from 'ngx-prompt-kit/message';
import { PkMessageEdit, PkMessageEditImports } from 'ngx-prompt-kit/message-edit';

@Component({
  selector: 'app-message-edit-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocPage,
    DocExample,
    DocInstall,
    DocApi,
    HlmButton,
    PkMessageImports,
    PkMessageEditImports,
  ],
  template: `
    <app-doc-page
      title="Message Edit"
      [original]="true"
      description="Inline edit affordance for a user message. Once edit mode is active the layout is the same: textarea swaps in for the bubble, Save/Cancel below. The trigger — how the user enters edit mode — is the configurable axis."
    >
      <app-doc-example
        title="Pencil overlay (default)"
        description="Pencil chip floats at the bubble's top-right corner, hover-or-focus revealed. The shipped v21.0.3 default — preserved here so upgrades don't shift the visual."
        [code]="overlayCode"
      >
        <div class="flex w-full flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-edit
              [content]="overlayContent()"
              (saved)="overlayContent.set($event)"
            >
              <pk-message-content
                class="bg-primary text-primary-foreground"
                [content]="overlayContent()"
              />
            </pk-message-edit>
          </pk-message>
          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <pk-message-content
              content="Sure — let me know what you'd like to change and I'll update my reply."
            />
          </pk-message>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Pencil below"
        description="editTrigger='pencil-below' renders the trigger as a labelled Edit button in a row beneath the bubble. Useful when the inline-corner chip would crowd a narrow layout."
        [code]="belowCode"
      >
        <div class="flex w-full flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-edit
              editTrigger="pencil-below"
              [content]="belowContent()"
              (saved)="belowContent.set($event)"
            >
              <pk-message-content
                class="bg-primary text-primary-foreground"
                [content]="belowContent()"
              />
            </pk-message-edit>
          </pk-message>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Pencil below, persistent"
        description="editTrigger='pencil-below-persistent' renders the same labelled Edit button below the bubble, but always visible — no hover-or-focus reveal. Useful for surfaces where discoverability matters more than visual quiet."
        [code]="persistentCode"
      >
        <div class="flex w-full flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-edit
              editTrigger="pencil-below-persistent"
              [content]="persistentContent()"
              (saved)="persistentContent.set($event)"
            >
              <pk-message-content
                class="bg-primary text-primary-foreground"
                [content]="persistentContent()"
              />
            </pk-message-edit>
          </pk-message>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Icon below"
        description="editTrigger='icon-below' renders an icon-only button below the bubble (no label), hover-or-focus revealed. Quietest of the below variants."
        [code]="iconBelowCode"
      >
        <div class="flex w-full flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-edit
              editTrigger="icon-below"
              [content]="iconBelowContent()"
              (saved)="iconBelowContent.set($event)"
            >
              <pk-message-content
                class="bg-primary text-primary-foreground"
                [content]="iconBelowContent()"
              />
            </pk-message-edit>
          </pk-message>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Menu overlay — extension point"
        description="editTrigger='menu-overlay' renders a three-dot kebab in place of the pencil. Click opens a dropdown with Edit as the first item — a natural extension point if you later add Copy / Regenerate / Delete without forcing a UX choice up front."
        [code]="menuCode"
      >
        <div class="flex w-full flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-edit
              editTrigger="menu-overlay"
              [content]="menuContent()"
              (saved)="menuContent.set($event)"
            >
              <pk-message-content
                class="bg-primary text-primary-foreground"
                [content]="menuContent()"
              />
            </pk-message-edit>
          </pk-message>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Hidden — programmatic trigger"
        description="editTrigger='hidden' removes the built-in trigger entirely. Wire your own affordance — here, a separate Edit button outside the component calls editor.startEdit() directly via a viewChild reference."
        [code]="hiddenCode"
      >
        <div class="flex w-full flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-edit
              #hiddenEditor
              editTrigger="hidden"
              [content]="hiddenContent()"
              (saved)="hiddenContent.set($event)"
            >
              <pk-message-content
                class="bg-primary text-primary-foreground"
                [content]="hiddenContent()"
              />
            </pk-message-edit>
          </pk-message>
          <div class="flex justify-end">
            <button hlmBtn variant="outline" size="sm" type="button" (click)="triggerHidden()">
              Edit last message
            </button>
          </div>
          <p class="text-muted-foreground text-center text-xs">
            The button above is rendered by the consumer, not by pk-message-edit. It calls
            <span class="text-foreground font-mono">editor.startEdit()</span> on the component
            via a viewChild reference.
          </p>
        </div>
      </app-doc-example>

      <app-doc-install component="message-edit" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class MessageEditDemo {
  protected readonly overlayContent = signal(
    'Could you summarize the latest commit log into release notes?',
  );
  protected readonly belowContent = signal(
    'Walk me through the migration plan for the auth middleware refactor.',
  );
  protected readonly persistentContent = signal(
    'Refactor the auth middleware to extract the session refresh helper.',
  );
  protected readonly iconBelowContent = signal(
    'Document the migration in CHANGELOG.md when the bump lands.',
  );
  protected readonly menuContent = signal(
    'Draft a one-paragraph announcement for the v21.0.4 release.',
  );
  protected readonly hiddenContent = signal(
    'Tighten this paragraph for clarity and a confident tone.',
  );

  private readonly hiddenEditor = viewChild<PkMessageEdit>('hiddenEditor');

  protected triggerHidden(): void {
    this.hiddenEditor()?.startEdit();
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkMessageEdit',
      props: [
        { name: 'content', type: 'string', description: 'The current message content (required).' },
        {
          name: 'editable',
          type: 'boolean',
          default: 'true',
          description: 'Gates the trigger affordance. When false, the projected content is read-only.',
        },
        {
          name: 'editTrigger',
          type: '"pencil-overlay" | "pencil-below" | "pencil-below-persistent" | "icon-below" | "menu-overlay" | "hidden"',
          default: '"pencil-overlay"',
          description:
            'How the user enters edit mode. pencil-overlay: floating chip on the bubble corner. pencil-below: hover-revealed labelled Edit row beneath the bubble. pencil-below-persistent: same row, always visible. icon-below: hover-revealed icon-only button beneath the bubble. menu-overlay: kebab opening a dropdown (extension point for multi-action menus). hidden: no built-in trigger — call startEdit() programmatically.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'saved',
          type: '(newContent: string) => void',
          description:
            'Fires when Save is clicked or Cmd/Ctrl+Enter pressed, only if the value changed and is non-empty.',
        },
        {
          name: 'cancelled',
          type: '() => void',
          description: 'Fires when Cancel is clicked or Escape pressed in the textarea.',
        },
      ],
    },
    {
      name: 'Public methods',
      props: [
        {
          name: 'startEdit()',
          type: '() => void',
          description:
            'Switch into edit mode programmatically. Use with editTrigger="hidden" to wire your own trigger (a global shortcut, a menu item, etc).',
        },
      ],
    },
  ];

  protected readonly overlayCode = `<pk-message class="justify-end">
  <pk-message-edit
    [content]="content()"
    (saved)="content.set($event)"
  >
    <pk-message-content
      class="bg-primary text-primary-foreground"
      [content]="content()"
    />
  </pk-message-edit>
</pk-message>`;

  protected readonly belowCode = `<pk-message-edit
  editTrigger="pencil-below"
  [content]="content()"
  (saved)="content.set($event)"
>
  <pk-message-content [content]="content()" />
</pk-message-edit>`;

  protected readonly persistentCode = `<pk-message-edit
  editTrigger="pencil-below-persistent"
  [content]="content()"
  (saved)="content.set($event)"
>
  <pk-message-content [content]="content()" />
</pk-message-edit>`;

  protected readonly iconBelowCode = `<pk-message-edit
  editTrigger="icon-below"
  [content]="content()"
  (saved)="content.set($event)"
>
  <pk-message-content [content]="content()" />
</pk-message-edit>`;

  protected readonly menuCode = `<pk-message-edit
  editTrigger="menu-overlay"
  [content]="content()"
  (saved)="content.set($event)"
>
  <pk-message-content [content]="content()" />
</pk-message-edit>`;

  protected readonly hiddenCode = `<pk-message-edit
  #editor
  editTrigger="hidden"
  [content]="content()"
  (saved)="content.set($event)"
>
  <pk-message-content [content]="content()" />
</pk-message-edit>

<button (click)="editor.startEdit()">Edit last message</button>`;
}
