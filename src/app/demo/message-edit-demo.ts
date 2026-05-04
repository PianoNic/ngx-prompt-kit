import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkMessageImports } from 'ngx-prompt-kit/message';
import { PkMessageEditImports } from 'ngx-prompt-kit/message-edit';

@Component({
  selector: 'app-message-edit-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkMessageImports, PkMessageEditImports],
  template: `
    <app-doc-page
      title="Message Edit"
      [original]="true"
      description="Inline edit affordance for a user message. Wraps message content via projection — hover (or focus the row) to reveal a pencil; click to swap into a textarea with Save / Cancel."
    >
      <app-doc-example
        title="Edit a user message"
        description="Hover the bubble to reveal the pencil. Click to enter edit mode. Cmd/Ctrl+Enter saves; Esc cancels. (saved) emits the new content; the parent decides what to do with it."
        [code]="editCode"
      >
        <div class="flex w-full flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-edit
              [content]="userContent()"
              (saved)="userContent.set($event)"
            >
              <pk-message-content
                class="bg-primary text-primary-foreground"
                [content]="userContent()"
              />
            </pk-message-edit>
          </pk-message>
          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <pk-message-content
              content="Sure — let me know what you'd like to change and I'll update my reply."
            />
          </pk-message>
          @if (lastSaved(); as s) {
            <p class="text-muted-foreground text-center text-xs">
              Last saved: <span class="text-foreground font-mono">{{ s }}</span>
            </p>
          }
        </div>
      </app-doc-example>

      <app-doc-install component="message-edit" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class MessageEditDemo {
  protected readonly userContent = signal(
    'Could you summarize the latest commit log into release notes?',
  );
  protected readonly lastSaved = signal<string | null>(null);

  constructor() {
    // Wire saved → lastSaved as a side effect of the user setter
    // (kept simple: the template binds directly, this just tracks the most recent commit)
  }

  protected onSaved(next: string): void {
    this.userContent.set(next);
    this.lastSaved.set(next);
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
          description: 'Gates the pencil affordance. When false, the projected content is read-only.',
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
          description: 'Fires when Save is clicked or Cmd/Ctrl+Enter pressed, only if the value changed.',
        },
        {
          name: 'cancelled',
          type: '() => void',
          description: 'Fires when Cancel is clicked or Escape pressed in the textarea.',
        },
      ],
    },
  ];

  protected readonly editCode = `<pk-message class="justify-end">
  <pk-message-edit
    [content]="userContent()"
    (saved)="userContent.set($event)"
  >
    <pk-message-content
      class="bg-primary text-primary-foreground"
      [content]="userContent()"
    />
  </pk-message-edit>
</pk-message>`;
}
