import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCopy, lucideThumbsDown, lucideThumbsUp } from '@ng-icons/lucide';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';
import { PkMessageImports } from 'ngx-prompt-kit/message';

@Component({
  selector: 'app-message-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocPage,
    DocExample,
    DocInstall,
    DocApi,
    HlmButton,
    HlmIconImports,
    PkMessageImports,
    HlmMessageImports,
    PkCodeBlockImports,
  ],
  providers: [provideIcons({ lucideCopy, lucideThumbsUp, lucideThumbsDown })],
  template: `
    <app-doc-page
      title="Message"
      description="A row in a chat thread. Pairs an avatar with content; supports plain text or markdown, plus a row of inline actions."
    >
      <!-- Basic conversation -->
      <app-doc-example
        title="Basic conversation"
        description="A back-and-forth exchange. User messages align right, assistant messages align left with an avatar."
        [code]="basicCode"
      >
        <div class="flex w-full flex-col gap-4">
          <div hlmMessage align="end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="Could you summarize the latest commit log into release notes?"
            />
          </div>
          <div hlmMessage>
            <pk-message-avatar
              src="https://avatars.githubusercontent.com/u/0?v=4"
              alt="Assistant"
              fallback="AI"
            />
            <pk-message-content
              content="I can help with that — pull the commit range and I'll group them into features, fixes, and chores."
            />
          </div>
        </div>
      </app-doc-example>

      <!-- With markdown -->
      <app-doc-example
        title="With markdown"
        description="Set [markdown]=true on the content to render headings, lists, code, and emphasis."
        [code]="markdownCode"
      >
        <div class="flex w-full flex-col gap-4">
          <div hlmMessage align="end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="Give me the v0.1.0 changelog as markdown."
            />
          </div>
          <div hlmMessage>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <pk-message-content
              [markdown]="true"
              content="**v0.1.0**

- Refactored the auth middleware
- Added \`session.refresh()\` helper
- Fixed an off-by-one in pagination

Want me to group by author next time?"
            />
          </div>
        </div>
      </app-doc-example>

      <!-- With actions -->
      <app-doc-example
        title="With actions"
        description="MessageActions and MessageAction add interactive controls below an assistant message — copy, regenerate, thumbs up/down."
        [code]="actionsCode"
      >
        <div class="flex w-full flex-col gap-4">
          <div hlmMessage align="end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="Explain the difference between signal() and computed()."
            />
          </div>
          <div class="flex flex-col gap-1">
            <div hlmMessage>
              <pk-message-avatar src="" alt="Assistant" fallback="AI" />
              <pk-message-content
                content="signal() holds writable state. computed() derives a read-only value from one or more signals; it re-evaluates lazily when its dependencies change."
              />
            </div>
            <div hlmMessageFooter class="ml-11">
              <pk-message-action tooltip="Copy">
                <button hlmBtn variant="ghost" size="icon-sm" type="button" aria-label="Copy">
                  <ng-icon hlm size="xs" name="lucideCopy" />
                </button>
              </pk-message-action>
              <pk-message-action tooltip="Good response">
                <button hlmBtn variant="ghost" size="icon-sm" type="button" aria-label="Thumbs up">
                  <ng-icon hlm size="xs" name="lucideThumbsUp" />
                </button>
              </pk-message-action>
              <pk-message-action tooltip="Bad response">
                <button
                  hlmBtn
                  variant="ghost"
                  size="icon-sm"
                  type="button"
                  aria-label="Thumbs down"
                >
                  <ng-icon hlm size="xs" name="lucideThumbsDown" />
                </button>
              </pk-message-action>
            </div>
          </div>
        </div>
      </app-doc-example>

      <section class="mt-10">
        <h2 class="text-xl font-semibold tracking-tight">Upgrading to v22.1</h2>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          The major version tracks the Angular major it targets, so breaking component changes ship
          in minors. This one needs a template edit.
        </p>
        <p class="text-muted-foreground mt-2 text-sm leading-relaxed">
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >pk-message</code
          >
          and
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >pk-message-actions</code
          >
          were removed in favour of Spartan's own message primitives, which provide the alignment
          context the surrounding slots rely on. Generate them with
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >ng g &#64;spartan-ng/cli:ui message</code
          >, then swap the wrappers:
        </p>
        <div class="mt-3">
          <pk-code-block>
            <pk-code-block-code [code]="migrationCode" language="html" />
          </pk-code-block>
        </div>
        <p class="text-muted-foreground mt-3 text-sm leading-relaxed">
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >pk-message-content</code
          >,
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >pk-message-avatar</code
          >
          and
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >pk-message-action</code
          >
          are unchanged — keep using them inside
          <code class="bg-muted text-foreground rounded px-1 py-0.5 font-mono text-xs"
            >hlmMessage</code
          >.
        </p>
      </section>

      <app-doc-install component="message" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class MessageDemo {
  protected readonly api: ApiSection[] = [
    {
      name: 'HlmMessage (spartan)',
      props: [
        {
          name: 'align',
          type: '"start" | "end"',
          default: '"start"',
          description: 'Row direction. Use "end" for user messages. Replaces PkMessage.',
        },
      ],
    },
    {
      name: 'PkMessageAvatar',
      props: [
        { name: 'src', type: 'string', description: 'Avatar image URL (required).' },
        { name: 'alt', type: 'string', description: 'Alt text for the image (required).' },
        { name: 'fallback', type: 'string', description: 'Initials shown if the image fails.' },
        { name: 'class', type: 'string', description: 'Extra classes for the avatar.' },
      ],
    },
    {
      name: 'PkMessageContent',
      props: [
        {
          name: 'content',
          type: 'string',
          description: 'The text content. Optional — you can also project markup via ng-content.',
        },
        {
          name: 'markdown',
          type: 'boolean',
          default: 'false',
          description: 'Render content as markdown via pk-markdown.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the bubble.' },
      ],
    },
    {
      name: 'HlmMessageFooter (spartan)',
      props: [
        {
          name: '—',
          type: '—',
          description: 'Action row; auto-aligns for align="end". Replaces PkMessageActions.',
        },
      ],
    },
    {
      name: 'PkMessageAction',
      props: [
        {
          name: 'tooltip',
          type: 'string',
          description: 'Tooltip label shown on hover (required).',
        },
        {
          name: 'side',
          type: '"top" | "bottom" | "left" | "right"',
          default: '"top"',
          description: 'Tooltip placement.',
        },
        {
          name: 'class',
          type: 'string',
          description: 'Extra classes applied to the tooltip content.',
        },
      ],
    },
  ];

  protected readonly migrationCode = `<!-- before -->
<pk-message class="justify-end">…</pk-message>
<pk-message-actions>…</pk-message-actions>

<!-- after -->
<div hlmMessage align="end">…</div>
<div hlmMessageFooter>…</div>`;

  protected readonly basicCode = `<div hlmMessage align="end">
  <pk-message-content
    class="bg-primary text-primary-foreground"
    content="Could you summarize the latest commit log into release notes?"
  />
</div>

<div hlmMessage>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <pk-message-content
    content="I can help with that — pull the commit range and I'll group them..."
  />
</div>`;

  protected readonly markdownCode = `<div hlmMessage>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <pk-message-content
    [markdown]="true"
    content="**v0.1.0**

- Refactored the auth middleware
- Added \\\`session.refresh()\\\` helper"
  />
</div>`;

  protected readonly actionsCode = `<div hlmMessage>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <pk-message-content content="signal() holds writable state..." />
</div>

<div hlmMessageFooter class="ml-11">
  <pk-message-action tooltip="Copy">
    <button hlmBtn variant="ghost" size="icon-sm">
      <svg>...</svg>
    </button>
  </pk-message-action>
  <pk-message-action tooltip="Good response">...</pk-message-action>
  <pk-message-action tooltip="Bad response">...</pk-message-action>
</div>`;
}
