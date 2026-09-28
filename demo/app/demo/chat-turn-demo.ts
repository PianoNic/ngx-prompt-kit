import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucidePaperclip, lucideRefreshCw } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { PkChatTurnImports } from 'ngx-prompt-kit/chat-turn';
import { PkMarkdown } from 'ngx-prompt-kit/markdown';
import { modelIconUrl } from 'ngx-prompt-kit/model-icon';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';

const FIRST_REPLY = `For a small SaaS, a common starting point is **14 daily, 8 weekly and 12 monthly** backups.

The simplest way to prune in S3 is a lifecycle rule rather than a script:

\`\`\`bash
aws s3api put-bucket-lifecycle-configuration \\
  --bucket tessaly-backups \\
  --lifecycle-configuration file://lifecycle.json
\`\`\`

Keep the monthly copies under their own prefix so the 14-day rule never touches them.`;

const SECOND_REPLY =
  'Yes. The built-in job keeps the newest `Backup:RetentionCount` dumps, 14 by default, and deletes older ones after each run.';

const STREAMED_REPLY = `Here is what changes when you raise the retention count:

- **Storage** grows linearly, roughly one dump per day.
- **Restore options** go further back, which helps with late-noticed bad deploys.
- **Nothing else** changes: the prune step still runs after every backup.

For most teams, 30 is a comfortable ceiling.`;

@Component({
  selector: 'app-chat-turn-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, HlmButton, NgIcon, PkChatTurnImports, PkMarkdown],
  providers: [provideIcons({ lucidePaperclip, lucideRefreshCw })],
  template: `
    <app-doc-page
      title="Chat Turn"
      [original]="true"
      description="The two halves of a conversation: pk-user-turn is a soft right-aligned bubble that keeps line breaks, and pk-assistant-turn shows which model answered, the reply, and a row with a copy button, extra actions and details such as cost."
    >
      <app-doc-example
        title="Conversation"
        description="Assistant replies render through pk-markdown. The model icon comes from modelIconUrl(), and [pkAssistantTurnMeta] holds what the reply cost."
        [code]="conversationCode"
      >
        <div class="flex w-full flex-col gap-8">
          <pk-user-turn>
            <span
              pkUserTurnTop
              class="text-muted-foreground flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs"
            >
              <ng-icon name="lucidePaperclip" aria-hidden="true" />
              lifecycle.json
            </span>
            <span>How long should I keep daily Postgres backups for a small SaaS, and how do I prune old ones from S3?</span>
          </pk-user-turn>

          <pk-assistant-turn modelName="Claude Sonnet 5.5" [iconUrl]="sonnetIcon" [copyText]="firstReply">
            <pk-markdown [class]="markdownClass" [content]="firstReply" />
            <button
              pkAssistantTurnActions
              hlmBtn
              variant="ghost"
              size="icon-sm"
              type="button"
              aria-label="Regenerate"
              class="text-muted-foreground"
            >
              <ng-icon name="lucideRefreshCw" />
            </button>
            <span pkAssistantTurnMeta>14 credits · 1.2k tokens</span>
          </pk-assistant-turn>

          <pk-user-turn>Can Tessaly's built-in backup job do that instead?</pk-user-turn>

          <pk-assistant-turn modelName="GPT-5" [iconUrl]="gptIcon" [copyText]="secondReply">
            <pk-markdown [class]="markdownClass" [content]="secondReply" />
            <span pkAssistantTurnMeta>20 credits · 310 tokens</span>
          </pk-assistant-turn>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Streaming"
        description="While [streaming] is true the action row is held back, since there is nothing final to copy yet. It appears once the reply is done."
        [code]="streamingCode"
      >
        <div class="flex w-full flex-col gap-6">
          <div>
            <button hlmBtn variant="outline" size="sm" type="button" (click)="stream()">
              {{ streaming() ? 'Restart' : 'Stream a reply' }}
            </button>
          </div>
          <pk-user-turn>What changes if I raise the retention count?</pk-user-turn>
          <pk-assistant-turn
            modelName="Claude Sonnet 5.5"
            [iconUrl]="sonnetIcon"
            [streaming]="streaming()"
            [copyText]="streamed()"
          >
            @if (streamed()) {
              <pk-markdown [class]="markdownClass" [content]="streamed()" />
            } @else {
              <span class="text-muted-foreground animate-pulse">Thinking…</span>
            }
            <span pkAssistantTurnMeta>9 credits · 640 tokens</span>
          </pk-assistant-turn>
        </div>
      </app-doc-example>

      <app-doc-install component="chat-turn" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ChatTurnDemo {
  // The demo has no typography plugin, so give the rendered markdown a little rhythm by hand.
  protected readonly markdownClass =
    'block [&_p]:my-3 [&_p:first-child]:mt-0 [&_p:last-child]:mb-0 [&_ul]:my-3 [&_ul]:list-disc [&_ul]:ps-5 [&_li]:my-1';
  protected readonly sonnetIcon = modelIconUrl({ id: 'anthropic/claude-sonnet-5.5' });
  protected readonly gptIcon = modelIconUrl({ id: 'openai/gpt-5' });
  protected readonly firstReply = FIRST_REPLY;
  protected readonly secondReply = SECOND_REPLY;

  protected readonly streaming = signal(false);
  protected readonly streamed = signal(STREAMED_REPLY);
  private timer: ReturnType<typeof setInterval> | undefined;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearInterval(this.timer));
  }

  protected stream(): void {
    clearInterval(this.timer);
    const words = STREAMED_REPLY.split(/(?<=\s)/);
    let next = 0;
    this.streamed.set('');
    this.streaming.set(true);
    this.timer = setInterval(() => {
      this.streamed.update((text) => text + words[next++]);
      if (next >= words.length) {
        clearInterval(this.timer);
        this.streaming.set(false);
      }
    }, 60);
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkUserTurn',
      props: [
        { name: 'class', type: 'string', default: "''", description: 'Extra classes for the host (a right-aligned column).' },
        { name: '(content)', type: 'text', description: 'The message, in a bubble up to 76% wide that keeps line breaks as typed.' },
        { name: '[pkUserTurnTop]', type: 'element', description: 'Above the bubble, e.g. attachment chips.' },
      ],
    },
    {
      name: 'PkAssistantTurn',
      props: [
        { name: 'modelName', type: 'string', default: "''", description: 'Name of the model that answered, shown above the reply. No header without it.' },
        { name: 'iconUrl', type: 'string | undefined', default: 'undefined', description: 'Brand icon for the model, e.g. from modelIconUrl(). Monochrome icons invert in dark mode.' },
        { name: 'copyText', type: 'string', default: "''", description: 'The text the copy button puts on the clipboard; no copy button without it.' },
        { name: 'streaming', type: 'boolean', default: 'false', description: 'Holds back the action row while the reply is still arriving.' },
        { name: 'class', type: 'string', default: "''", description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'PkAssistantTurn content projection',
      props: [
        { name: '(content)', type: 'element', description: 'The reply, e.g. a pk-markdown.' },
        { name: '[pkAssistantTurnActions]', type: 'element', description: 'Extra actions in the row under the reply, after copy (e.g. regenerate, branch nav).' },
        { name: '[pkAssistantTurnMeta]', type: 'element', description: 'Details at the end of the row, e.g. what the reply cost.' },
      ],
    },
  ];

  protected readonly conversationCode = `<pk-user-turn>
  <span pkUserTurnTop>lifecycle.json</span>
  How long should I keep daily Postgres backups…?
</pk-user-turn>

<pk-assistant-turn
  modelName="Claude Sonnet 5.5"
  [iconUrl]="modelIconUrl({ id: 'anthropic/claude-sonnet-5.5' })"
  [copyText]="reply"
>
  <pk-markdown class="prose dark:prose-invert max-w-none" [content]="reply" />
  <button pkAssistantTurnActions hlmBtn variant="ghost" size="icon-sm" aria-label="Regenerate">
    <ng-icon name="lucideRefreshCw" />
  </button>
  <span pkAssistantTurnMeta>14 credits · 1.2k tokens</span>
</pk-assistant-turn>`;

  protected readonly streamingCode = `<pk-assistant-turn
  modelName="Claude Sonnet 5.5"
  [iconUrl]="icon"
  [streaming]="streaming()"
  [copyText]="text()"
>
  <pk-markdown [content]="text()" />
  <span pkAssistantTurnMeta>9 credits · 640 tokens</span>
</pk-assistant-turn>`;
}
