import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideBookmark,
  lucideCopy,
  lucidePencil,
  lucideRefreshCw,
  lucideShare2,
  lucideThumbsDown,
  lucideThumbsUp,
} from '@ng-icons/lucide';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkMessageImports } from 'ngx-prompt-kit/message';
import { PkMessageEdit, PkMessageEditImports } from 'ngx-prompt-kit/message-edit';
import {
  DEFAULT_ASSISTANT_ACTIONS,
  DEFAULT_USER_ACTIONS,
  PkMessageActionsBarImports,
  type MessageAction,
} from 'ngx-prompt-kit/message-actions-bar';

@Component({
  selector: 'app-message-actions-bar-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocPage,
    DocExample,
    DocInstall,
    DocApi,
    PkMessageImports,
    PkMessageEditImports,
    PkMessageActionsBarImports,
  ],
  providers: [
    provideIcons({
      lucideBookmark,
      lucideCopy,
      lucidePencil,
      lucideRefreshCw,
      lucideShare2,
      lucideThumbsDown,
      lucideThumbsUp,
    }),
  ],
  template: `
    <app-doc-page
      title="Message Actions Bar"
      [original]="true"
      description="A row of icon-only buttons with tooltips, intended to sit beneath a settled message. Hover-or-focus revealed by default; switch to visible='always' for persistent toolbars. Default action sets exported as DEFAULT_ASSISTANT_ACTIONS and DEFAULT_USER_ACTIONS — spread them and add your own."
    >
      <app-doc-example
        title="Assistant — default actions"
        description="DEFAULT_ASSISTANT_ACTIONS: copy, regenerate, thumbs-up, thumbs-down. The wrapping pk-message + group container drives the hover-reveal."
        [code]="assistantCode"
      >
        <div class="group flex w-full flex-col gap-1">
          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <pk-message-content
              content="Yes — Tailwind's color tokens flow through Spartan's CSS variables, so the kit picks up your theme without extra configuration."
            />
          </pk-message>
          <pk-message-actions-bar
            class="ml-11"
            [actions]="assistantActions"
            (actionPicked)="lastEvent.set('assistant: ' + $event.id)"
          />
        </div>
      </app-doc-example>

      <app-doc-example
        title="User — default actions"
        description="DEFAULT_USER_ACTIONS: copy, edit. Wrap the user bubble in a group container the same way."
        [code]="userCode"
      >
        <div class="group flex w-full flex-col items-end gap-1">
          <pk-message class="justify-end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="Does the kit pick up my Spartan theme automatically?"
            />
          </pk-message>
          <pk-message-actions-bar
            [actions]="userActions"
            (actionPicked)="lastEvent.set('user: ' + $event.id)"
          />
        </div>
      </app-doc-example>

      <app-doc-example
        title="Custom set with active state"
        description="Spread the defaults and add your own (Bookmark + Share). The active flag lights the button with bg-accent + text-primary — consumer manages active state in its own signal."
        [code]="customCode"
      >
        <div class="group flex w-full flex-col gap-2">
          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <pk-message-content
              content="Click thumbs-up to see the active state — it persists across hover-reveal so the consumer can read 'this message was rated good'."
            />
          </pk-message>
          <pk-message-actions-bar
            class="ml-11"
            visible="always"
            [actions]="customActions()"
            (actionPicked)="onCustomPick($event)"
          />
          @if (lastEvent(); as e) {
            <p class="text-muted-foreground ml-11 text-xs">
              Last event: <span class="text-foreground font-mono">{{ e }}</span>
            </p>
          }
        </div>
      </app-doc-example>

      <app-doc-example
        title="Composed with pk-message-edit"
        description="When composing with pk-message-edit, suppress its built-in pencil via editTrigger='hidden' and call editor.startEdit() from the edit action's handler. The edit state machine stays in pk-message-edit; this component just emits intent."
        [code]="composedCode"
      >
        <div class="group flex w-full flex-col items-end gap-1">
          <pk-message class="justify-end">
            <pk-message-edit
              #composedEditor
              editTrigger="hidden"
              [content]="composedContent()"
              (saved)="composedContent.set($event)"
            >
              <pk-message-content
                class="bg-primary text-primary-foreground"
                [content]="composedContent()"
              />
            </pk-message-edit>
          </pk-message>
          <pk-message-actions-bar
            [actions]="userActions"
            (actionPicked)="onComposedAction($event, composedEditor)"
          />
        </div>
      </app-doc-example>

      <app-doc-install component="message-actions-bar" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class MessageActionsBarDemo {
  protected readonly lastEvent = signal<string | null>(null);
  protected readonly thumbsUpActive = signal(false);
  protected readonly bookmarkActive = signal(false);
  protected readonly composedContent = signal(
    'Could you summarise the latest commit log into release notes?',
  );

  protected readonly assistantActions = DEFAULT_ASSISTANT_ACTIONS;
  protected readonly userActions = DEFAULT_USER_ACTIONS;

  protected readonly customActions = computed<MessageAction[]>(() => [
    { id: 'copy', label: 'Copy', icon: 'lucideCopy' },
    { id: 'regenerate', label: 'Regenerate', icon: 'lucideRefreshCw' },
    {
      id: 'thumbs-up',
      label: 'Good response',
      icon: 'lucideThumbsUp',
      active: this.thumbsUpActive(),
    },
    { id: 'thumbs-down', label: 'Bad response', icon: 'lucideThumbsDown' },
    { id: 'bookmark', label: 'Save', icon: 'lucideBookmark', active: this.bookmarkActive() },
    { id: 'share', label: 'Share', icon: 'lucideShare2' },
  ]);

  protected onCustomPick(action: MessageAction): void {
    this.lastEvent.set('custom: ' + action.id);
    if (action.id === 'thumbs-up') this.thumbsUpActive.update((v) => !v);
    if (action.id === 'bookmark') this.bookmarkActive.update((v) => !v);
  }

  protected onComposedAction(action: MessageAction, editor: PkMessageEdit): void {
    this.lastEvent.set('composed: ' + action.id);
    if (action.id === 'edit') editor.startEdit();
    // 'copy' would call navigator.clipboard.writeText(this.composedContent()) in a real app.
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkMessageActionsBar',
      props: [
        {
          name: 'actions',
          type: 'readonly MessageAction[]',
          description: 'Buttons to render (required).',
        },
        {
          name: 'visible',
          type: '"hover" | "always"',
          default: '"hover"',
          description:
            'hover: opacity-0 with group-hover/group-focus-within reveal — consumer wraps the message + bar in a group div. always: no transition.',
        },
        {
          name: 'orientation',
          type: '"horizontal" | "vertical"',
          default: '"horizontal"',
          description: 'Vertical lays the buttons in a column for sidebar-style placements.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'MessageAction interface',
      props: [
        {
          name: 'id',
          type: 'string',
          description: 'Stable identifier — track-by + emitted from (actionPicked).',
        },
        { name: 'label', type: 'string', description: 'Tooltip text + aria-label.' },
        {
          name: 'icon',
          type: 'string',
          description: 'Lucide icon name; consumer must register via provideIcons().',
        },
        {
          name: 'variant',
          type: '"default" | "destructive"',
          default: '"default"',
          description: 'destructive paints the icon red.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Greys the button and prevents (actionPicked).',
        },
        {
          name: 'active',
          type: 'boolean',
          default: 'false',
          description: 'Lights the button with bg-accent + text-primary; sets aria-pressed="true".',
        },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'actionPicked',
          type: '(action: MessageAction) => void',
          description: 'The picked action (full object, not just id).',
        },
      ],
    },
    {
      name: 'Exports',
      props: [
        {
          name: 'DEFAULT_ASSISTANT_ACTIONS',
          type: 'readonly MessageAction[]',
          description: 'copy, regenerate, thumbs-up, thumbs-down.',
        },
        {
          name: 'DEFAULT_USER_ACTIONS',
          type: 'readonly MessageAction[]',
          description: 'copy, edit.',
        },
      ],
    },
  ];

  protected readonly assistantCode = `<div class="group flex flex-col gap-1">
  <pk-message>
    <pk-message-avatar src="" alt="Assistant" fallback="AI" />
    <pk-message-content content="..." />
  </pk-message>
  <pk-message-actions-bar
    class="ml-11"
    [actions]="DEFAULT_ASSISTANT_ACTIONS"
    (actionPicked)="handle($event)"
  />
</div>`;

  protected readonly userCode = `<div class="group flex flex-col items-end gap-1">
  <pk-message class="justify-end">
    <pk-message-content content="..." />
  </pk-message>
  <pk-message-actions-bar
    [actions]="DEFAULT_USER_ACTIONS"
    (actionPicked)="handle($event)"
  />
</div>`;

  protected readonly composedCode = `// Suppress pk-message-edit's built-in pencil; let the actions bar own the trigger.
<div class="group flex flex-col items-end gap-1">
  <pk-message class="justify-end">
    <pk-message-edit
      #editor
      editTrigger="hidden"
      [content]="content()"
      (saved)="content.set($event)"
    >
      <pk-message-content [content]="content()" />
    </pk-message-edit>
  </pk-message>
  <pk-message-actions-bar
    [actions]="DEFAULT_USER_ACTIONS"
    (actionPicked)="onAction($event, editor)"
  />
</div>

// Handler — no edit state lives here, just route the intent
onAction(action: MessageAction, editor: PkMessageEdit): void {
  if (action.id === 'edit') editor.startEdit();
  if (action.id === 'copy') navigator.clipboard.writeText(content());
}`;

  protected readonly customCode = `// Spread defaults + add custom actions
const customActions = computed<MessageAction[]>(() => [
  ...DEFAULT_ASSISTANT_ACTIONS.map(a =>
    a.id === 'thumbs-up' ? { ...a, active: thumbsUpActive() } : a
  ),
  { id: 'bookmark', label: 'Save', icon: 'lucideBookmark', active: bookmarkActive() },
  { id: 'share', label: 'Share', icon: 'lucideShare2' },
]);

// Template — visible="always" pins the toolbar
<pk-message-actions-bar
  visible="always"
  [actions]="customActions()"
  (actionPicked)="onPick($event)"
/>`;
}
