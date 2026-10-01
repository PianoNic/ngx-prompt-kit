import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { PkChatTurnImports } from 'ngx-prompt-kit/chat-turn';
import { PkComposerImports } from 'ngx-prompt-kit/composer';
import { modelIconUrl } from 'ngx-prompt-kit/model-icon';
import { PkModelSelectorImports, type SelectorModel } from 'ngx-prompt-kit/model-selector';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';

interface Turn {
  role: 'user' | 'assistant';
  text: string;
}

const LONG_DRAFT = `Here is the incident timeline I want to turn into a post-mortem:

09:12 Deploy 4.18.0 goes out to all regions.
09:14 Error rate on /api/checkout climbs from 0.2% to 7%.
09:15 Pager fires for the payments on-call.
09:21 On-call spots a missing index on orders.customer_id in the new migration.
09:26 Rollback to 4.17.3 starts.
09:31 Error rate back under 0.5%.
09:40 Index added by hand, deploy retried at 10:05 without problems.

Please write a blameless summary, the customer impact, the root cause, and three follow-ups we can actually ship this sprint.`;

const MODELS: SelectorModel[] = [
  {
    id: 'anthropic/claude-sonnet-5.5',
    name: 'Claude Sonnet 5.5',
    shortName: 'Sonnet 5.5',
    maker: 'Anthropic',
    priceTier: 2,
    costLabel: '≈ 14 credits',
  },
  {
    id: 'anthropic/claude-haiku-4.5',
    name: 'Claude Haiku 4.5',
    shortName: 'Haiku 4.5',
    maker: 'Anthropic',
    priceTier: 1,
    costLabel: '≈ 4 credits',
  },
  {
    id: 'openai/gpt-5',
    name: 'GPT-5',
    shortName: 'GPT-5',
    maker: 'OpenAI',
    priceTier: 2,
    costLabel: '≈ 20 credits',
  },
  {
    id: 'google/gemini-3-flash',
    name: 'Gemini 3 Flash',
    shortName: 'Gemini 3 Flash',
    maker: 'Google',
    priceTier: 1,
    costLabel: '≈ 3 credits',
  },
].map((m) => ({ ...m, iconUrl: modelIconUrl({ id: m.id }) }) as SelectorModel);

@Component({
  selector: 'app-composer-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocPage,
    DocExample,
    DocInstall,
    DocApi,
    HlmButton,
    PkComposerImports,
    PkChatTurnImports,
    PkModelSelectorImports,
  ],
  template: `
    <app-doc-page
      title="Composer"
      [original]="true"
      description="A chat composer whose text box grows with the draft and then scrolls, with an expand toggle for long drafts, an optional attach button, slots for chips and a model selector, and a send button that becomes stop while a reply streams. pk-composer-dock holds it as a card, as plain content, or docked into the bottom of a chat panel."
    >
      <app-doc-example
        title="Empty state"
        description='variant="card" for a composer centred in an empty chat. Enter sends, Shift+Enter adds a line; the + button opens a file picker.'
        [code]="cardCode"
      >
        <div class="flex min-h-[320px] flex-col items-center justify-center gap-6">
          <h2 class="text-center text-2xl font-semibold tracking-tight">What can I help with?</h2>
          <pk-composer-dock variant="card" class="max-w-2xl">
            <pk-composer
              placeholder="Ask anything"
              [attachable]="true"
              [(value)]="cardDraft"
              (submitted)="cardSent.set($event)"
              (filesPicked)="cardFiles.set($event)"
            />
          </pk-composer-dock>
          @if (cardSent() || cardFiles().length) {
            <p class="text-muted-foreground text-xs">
              @if (cardSent(); as text) {
                (submitted): <span class="text-foreground font-mono">{{ text }}</span>
              }
              @if (cardFiles().length) {
                (filesPicked):
                <span class="text-foreground font-mono">{{ fileNames(cardFiles()) }}</span>
              }
            </p>
          }
        </div>
      </app-doc-example>

      <app-doc-example
        title="Docked in a chat panel"
        description="The dock draws a band in the page colour with a raised notch around the composer. The panel is relative and clips; its bottom corners stay rounded, since they meet the band in the page colour. (occupied) reports how much of the panel the band covers, so the thread pads its bottom by that much."
        [code]="dockedCode"
      >
        <div
          class="bg-background overflow-hidden rounded-2xl px-2 pt-2 [--background:var(--muted)]"
        >
          <div
            class="bg-card relative h-[480px] overflow-hidden rounded-[18px] shadow-[inset_0_2px_10px_-2px_rgb(10_10_10/0.14),inset_0_0_0_1px_rgb(10_10_10/0.05)] dark:shadow-[inset_0_2px_12px_-2px_rgb(0_0_0/0.85),inset_0_0_0_1px_rgb(255_255_255/0.04)]"
          >
            <div
              class="flex h-full flex-col gap-6 overflow-y-auto px-4 pt-5 md:px-6"
              [style.padding-bottom.px]="occupied() + 24"
            >
              @for (turn of thread(); track $index) {
                @if (turn.role === 'user') {
                  <pk-user-turn>{{ turn.text }}</pk-user-turn>
                } @else {
                  <pk-assistant-turn
                    modelName="Claude Sonnet 5.5"
                    [iconUrl]="sonnetIcon"
                    [copyText]="turn.text"
                  >
                    {{ turn.text }}
                  </pk-assistant-turn>
                }
              }
            </div>
            <pk-composer-dock (occupied)="occupied.set($event)">
              <pk-composer
                placeholder="Reply to Claude Sonnet 5.5"
                [attachable]="true"
                [(value)]="dockedDraft"
                (submitted)="reply($event)"
              />
            </pk-composer-dock>
          </div>
        </div>
        <p class="text-muted-foreground mt-3 text-xs">
          (occupied): <span class="text-foreground font-mono">{{ occupied() }}px</span>
        </p>
      </app-doc-example>

      <app-doc-example
        title="Busy and stop"
        description="While busy, the send button becomes a stop button that emits (stopped). Typing still works, but Enter won't send until the reply is done."
        [code]="busyCode"
      >
        <div class="flex w-full flex-col gap-4">
          <div class="flex items-center gap-3">
            <button hlmBtn variant="outline" size="sm" type="button" (click)="busy.set(!busy())">
              {{ busy() ? 'Finish reply' : 'Start a reply' }}
            </button>
            <span class="text-muted-foreground text-xs" aria-live="polite">{{ busyLog() }}</span>
          </div>
          <pk-composer-dock variant="card">
            <pk-composer
              [busy]="busy()"
              [(value)]="busyDraft"
              (submitted)="busy.set(true); busyLog.set('(submitted) ' + $event)"
              (stopped)="busy.set(false); busyLog.set('(stopped)')"
            />
          </pk-composer-dock>
        </div>
      </app-doc-example>

      <app-doc-example
        title="Long drafts"
        description="The text box grows up to maxHeight (here 160px) and then scrolls. Once it overflows, an expand toggle in the corner grows it to 60% of the viewport; sending shrinks it again."
        [code]="longCode"
      >
        <pk-composer-dock variant="card">
          <pk-composer [maxHeight]="160" [(value)]="longDraft" />
        </pk-composer-dock>
      </app-doc-example>

      <app-doc-example
        title="With a model selector"
        description="Project a pk-model-selector into [pkComposerEnd] and anchor its panel to the whole composer via the public element."
        [code]="selectorCode"
      >
        <div class="flex min-h-[620px] flex-col justify-end">
          <pk-composer-dock variant="card">
            <pk-composer
              #composer
              [placeholder]="'Reply to ' + selectedName()"
              [attachable]="true"
              [(value)]="selectorDraft"
            >
              <pk-model-selector
                pkComposerEnd
                [models]="models"
                [anchor]="composer.element"
                [(value)]="modelId"
              />
            </pk-composer>
          </pk-composer-dock>
        </div>
      </app-doc-example>

      <app-doc-install component="composer" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ComposerDemo {
  protected readonly sonnetIcon = modelIconUrl({ id: 'anthropic/claude-sonnet-5.5' });
  protected readonly models = MODELS;

  protected readonly cardDraft = signal('');
  protected readonly cardSent = signal('');
  protected readonly cardFiles = signal<File[]>([]);

  protected readonly dockedDraft = signal('');
  protected readonly occupied = signal(0);
  protected readonly thread = signal<Turn[]>([
    { role: 'user', text: 'How long should I keep daily Postgres backups for a small SaaS?' },
    {
      role: 'assistant',
      text: 'A common starting point is 14 daily, 8 weekly and 12 monthly backups. That covers a bad deploy you notice late, without paying to store every day forever.',
    },
    { role: 'user', text: 'And how do I prune the old ones from S3?' },
    {
      role: 'assistant',
      text: 'Use a lifecycle rule on the bucket rather than a script: expire objects under daily/ after 14 days, and keep weekly and monthly copies under their own prefixes so the rule never touches them.',
    },
  ]);

  protected readonly busy = signal(false);
  protected readonly busyDraft = signal('');
  protected readonly busyLog = signal('');

  protected readonly longDraft = signal(LONG_DRAFT);

  protected readonly selectorDraft = signal('');
  protected readonly modelId = signal<string | null>('anthropic/claude-sonnet-5.5');

  protected selectedName(): string {
    return this.models.find((m) => m.id === this.modelId())?.name ?? 'the model';
  }

  protected fileNames(files: File[]): string {
    return files.map((f) => f.name).join(', ');
  }

  protected reply(text: string): void {
    this.thread.update((turns) => [
      ...turns,
      { role: 'user', text },
      {
        role: 'assistant',
        text: 'This is a demo, so here is a canned reply. Keep typing to watch the thread scroll above the dock.',
      },
    ]);
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkComposer',
      props: [
        {
          name: 'value',
          type: 'string',
          default: "''",
          description:
            'The draft. Two-way bindable via [(value)], so a draft can survive navigation.',
        },
        {
          name: 'placeholder',
          type: 'string',
          default: "'Message'",
          description: 'Placeholder of the text box.',
        },
        {
          name: 'label',
          type: 'string',
          default: "'Message'",
          description: 'Accessible name for the text box (a visually hidden label).',
        },
        {
          name: 'busy',
          type: 'boolean',
          default: 'false',
          description:
            'A reply is being generated: the send button becomes a stop button and Enter no longer sends.',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disables the text box, the attach button and sending.',
        },
        {
          name: 'sendBlocked',
          type: 'boolean',
          default: 'false',
          description: 'Keeps the send button disabled, e.g. while attachments upload.',
        },
        {
          name: 'maxHeight',
          type: 'number',
          default: '200',
          description:
            'Height in px the text box grows to before it scrolls and the expand toggle appears.',
        },
        {
          name: 'attachable',
          type: 'boolean',
          default: 'false',
          description: 'Shows the attach (+) button, which opens a file picker.',
        },
        {
          name: 'accept',
          type: 'string',
          default: "''",
          description: 'File types the picker offers, as for <input type="file" accept>.',
        },
        {
          name: 'describedBy',
          type: 'string',
          default: "''",
          description: 'Id(s) for the text box’s aria-describedby, e.g. a hint or error.',
        },
        {
          name: 'class',
          type: 'string',
          default: "''",
          description: 'Extra classes for the host.',
        },
      ],
    },
    {
      name: 'PkComposer outputs & members',
      props: [
        {
          name: 'submitted',
          type: '(text: string) => void',
          description:
            'The trimmed draft, on Enter or the send button. The draft is then cleared and the box shrinks back.',
        },
        {
          name: 'stopped',
          type: '() => void',
          description: 'The stop button was pressed while busy.',
        },
        {
          name: 'filesPicked',
          type: '(files: File[]) => void',
          description: 'Files picked through the attach button.',
        },
        {
          name: 'element',
          type: 'ElementRef<HTMLElement>',
          description:
            'The composer’s element, e.g. to anchor a model selector’s panel to the whole composer.',
        },
        {
          name: 'expanded',
          type: 'WritableSignal<boolean>',
          description: 'Whether the text box is grown to 60% of the viewport for long drafts.',
        },
        {
          name: 'focus()',
          type: 'void',
          description: 'Focuses the text box. Clicks on the composer’s padding do this too.',
        },
      ],
    },
    {
      name: 'PkComposer content projection',
      props: [
        {
          name: '[pkComposerTop]',
          type: 'element',
          description: 'Above the text, e.g. attachment chips or an upload error.',
        },
        {
          name: '[pkComposerStart]',
          type: 'element',
          description: 'In the action row, after the attach button.',
        },
        {
          name: '[pkComposerEnd]',
          type: 'element',
          description: 'In the action row, before the send button, e.g. a model selector.',
        },
      ],
    },
    {
      name: 'PkComposerDock',
      props: [
        {
          name: 'variant',
          type: "'docked' | 'card' | 'plain'",
          default: "'docked'",
          description:
            'docked: pinned to the bottom of a relative, clipping panel with a band and raised notch in the page colour. card: a bordered, softly shadowed card for an empty chat. plain: no chrome, e.g. on phones.',
        },
        {
          name: 'contentClass',
          type: 'string',
          default: "''",
          description:
            'Extra classes for the card or notch content wrapper, e.g. a dashed border for an incognito chat.',
        },
        {
          name: 'class',
          type: 'string',
          default: "''",
          description: 'Extra classes for the host.',
        },
        {
          name: 'occupied',
          type: '(px: number) => void',
          description:
            'Output. Px of the panel’s height the docked band covers (0 for the other variants), so the thread can pad its bottom.',
        },
        {
          name: 'data-variant',
          type: 'attribute',
          description:
            'Host attribute mirroring variant, e.g. to style the panel while a composer is docked in it.',
        },
        {
          name: '--pk-composer-dock-fill',
          type: 'CSS variable',
          default: 'var(--background)',
          description:
            'Colour of the docked band and of the wrapper over its notch. Set it to the page colour around the panel when that is not --background, e.g. var(--sidebar) in a sidebar layout.',
        },
      ],
    },
  ];

  protected readonly cardCode = `<h2>What can I help with?</h2>
<pk-composer-dock variant="card" class="max-w-2xl">
  <pk-composer
    placeholder="Ask anything"
    [attachable]="true"
    [(value)]="draft"
    (submitted)="send($event)"
    (filesPicked)="upload($event)"
  />
</pk-composer-dock>`;

  protected readonly dockedCode = `<!-- The page: its colour is --background, which the band is drawn in. -->
<div class="bg-background px-2 pt-2">
  <!-- The panel: relative and clips. Its rounded bottom corners meet the band in the page colour. -->
  <main class="bg-card relative h-[480px] overflow-hidden rounded-[18px] shadow-[inset_…]">
    <div class="h-full overflow-y-auto" [style.padding-bottom.px]="occupied() + 24">
      @for (turn of thread(); track $index) { … }
    </div>

    <pk-composer-dock (occupied)="occupied.set($event)">
      <pk-composer [attachable]="true" [(value)]="draft" (submitted)="send($event)" />
    </pk-composer-dock>
  </main>
</div>

occupied = signal(0);`;

  protected readonly busyCode = `<pk-composer-dock variant="card">
  <pk-composer
    [busy]="busy()"
    [(value)]="draft"
    (submitted)="send($event)"
    (stopped)="stop()"
  />
</pk-composer-dock>

// e.g. with readChatStream(events$, adapt, handlers, controller.signal)
send(text: string) { this.busy.set(true); … }
stop() { this.controller.abort(); this.busy.set(false); }`;

  protected readonly longCode = `<pk-composer-dock variant="card">
  <pk-composer [maxHeight]="160" [(value)]="draft" />
</pk-composer-dock>`;

  protected readonly selectorCode = `<pk-composer-dock variant="card">
  <pk-composer #composer [attachable]="true" [(value)]="draft">
    <pk-model-selector
      pkComposerEnd
      [models]="models"
      [anchor]="composer.element"
      [(value)]="modelId"
    />
  </pk-composer>
</pk-composer-dock>`;
}
