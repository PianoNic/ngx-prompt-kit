import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucideInfo, lucidePaperclip } from '@ng-icons/lucide';
import { HlmAlertImports } from '@spartan-ng/helm/alert';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import { HlmSpinner } from '@spartan-ng/helm/spinner';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import { map } from 'rxjs';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';

/** The components that were removed because spartan/ui ships them, and what to use instead. */
const REMOVED: Readonly<Record<string, string>> = {
  loader: 'hlm-spinner, or the shimmer utility for text',
  'text-shimmer': 'the shimmer utility',
  'scroll-button': 'hlmBtn bound to pk-chat-container-root, or hlm-message-scroller',
  message: 'hlm-message with hlm-bubble and hlm-avatar',
  'system-message': 'hlm-alert',
  'chat-empty': 'hlm-empty',
  'prompt-input': 'hlm-input-group with hlmInputGroupTextarea, or pk-composer',
};

@Component({
  selector: 'app-spartan-replacements',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocPage,
    DocExample,
    NgIcon,
    HlmAlertImports,
    HlmAvatarImports,
    HlmBubbleImports,
    HlmButton,
    HlmEmptyImports,
    HlmInputGroupImports,
    HlmMessageImports,
    HlmSpinner,
    HlmTooltip,
  ],
  providers: [provideIcons({ lucideArrowUp, lucideInfo, lucidePaperclip })],
  template: `
    <app-doc-page
      title="Spartan replacements"
      description="Components that spartan/ui now ships were removed from ngx-prompt-kit. Add the spartan helm component with its CLI (ng g @spartan-ng/cli:ui) and compose it as below."
    >
      @if (removed(); as r) {
        <div hlmAlert>
          <ng-icon name="lucideInfo" />
          <h4 hlmAlertTitle>{{ r.name }} was removed</h4>
          <p hlmAlertDescription>Use {{ r.replacement }} instead.</p>
        </div>
      }

      <app-doc-example
        title="loader → hlm-spinner"
        description="pk-loader's spinner variants are hlm-spinner; its text variants are a span with spartan's shimmer utility."
        [code]="loaderCode"
        [centered]="true"
      >
        <div class="flex items-center gap-6">
          <hlm-spinner />
          <span class="shimmer text-sm font-medium">Thinking</span>
        </div>
      </app-doc-example>

      <app-doc-example
        title="text-shimmer → shimmer"
        description="Spartan's tailwind preset ships a shimmer utility. Tune it with --shimmer-duration, --shimmer-spread and --shimmer-color."
        [code]="shimmerCode"
        [centered]="true"
      >
        <span class="shimmer text-muted-foreground text-sm font-medium">Searching the web…</span>
      </app-doc-example>

      <app-doc-example
        title="message → hlm-message + hlm-bubble"
        description="hlmMessage lays out the row, hlmMessageAvatar the avatar, hlmBubble the bubble. Render markdown with pk-markdown inside the bubble content."
        [code]="messageCode"
      >
        <div class="flex w-full flex-col gap-4">
          <div hlmMessage align="end">
            <div hlmMessageContent>
              <div hlmBubble variant="secondary">
                <div hlmBubbleContent>What's the capital of France?</div>
              </div>
            </div>
          </div>
          <div hlmMessage>
            <div hlmMessageAvatar>
              <hlm-avatar>
                <span hlmAvatarFallback>AI</span>
              </hlm-avatar>
            </div>
            <div hlmMessageContent>
              <div hlmBubble variant="muted">
                <div hlmBubbleContent>Paris.</div>
              </div>
            </div>
          </div>
        </div>
      </app-doc-example>

      <app-doc-example
        title="system-message → hlm-alert"
        description="An out-of-band notice is an hlm-alert; put the call to action in hlmAlertAction."
        [code]="systemMessageCode"
      >
        <div hlmAlert class="w-full">
          <ng-icon name="lucideInfo" />
          <h4 hlmAlertTitle>Model switched</h4>
          <p hlmAlertDescription>Replies now come from a faster model.</p>
          <div hlmAlertAction>
            <button hlmBtn size="sm" type="button">Undo</button>
          </div>
        </div>
      </app-doc-example>

      <app-doc-example
        title="chat-empty → hlm-empty"
        description="The empty state of a chat is hlm-empty; suggestions go in hlm-empty-content."
        [code]="emptyCode"
      >
        <hlm-empty class="w-full">
          <hlm-empty-header>
            <h3 hlmEmptyTitle>How can I help today?</h3>
            <p hlmEmptyDescription>Ask anything, or start from a suggestion.</p>
          </hlm-empty-header>
          <hlm-empty-content class="flex-row flex-wrap justify-center">
            <button hlmBtn variant="outline" size="sm" class="rounded-full" type="button">
              Summarise a document
            </button>
            <button hlmBtn variant="outline" size="sm" class="rounded-full" type="button">
              Plan a trip
            </button>
          </hlm-empty-content>
        </hlm-empty>
      </app-doc-example>

      <app-doc-example
        title="prompt-input → hlm-input-group"
        description="A textarea in an input group with a block-end addon for the actions. For a full chat composer (autosize, Enter to send, stop button, attachments) use pk-composer."
        [code]="promptInputCode"
      >
        <div hlmInputGroup class="w-full rounded-2xl">
          <textarea hlmInputGroupTextarea placeholder="Ask anything…"></textarea>
          <div hlmInputGroupAddon align="block-end" class="justify-between">
            <button hlmInputGroupButton size="icon-sm" hlmTooltip="Attach" aria-label="Attach">
              <ng-icon name="lucidePaperclip" />
            </button>
            <button
              hlmInputGroupButton
              variant="default"
              size="icon-sm"
              class="rounded-full"
              aria-label="Send"
            >
              <ng-icon name="lucideArrowUp" />
            </button>
          </div>
        </div>
      </app-doc-example>

      <app-doc-example
        title="scroll-button → hlmBtn"
        description="A scroll-to-bottom button is an hlmBtn that calls the chat container. With spartan's hlm-message-scroller, use its hlmMessageScrollerButton instead."
        [code]="scrollButtonCode"
        language="html"
        [centered]="true"
      >
        <button
          hlmBtn
          variant="outline"
          size="icon"
          class="rounded-full"
          type="button"
          aria-label="Scroll to bottom"
        >
          <ng-icon name="lucideArrowUp" class="rotate-180" />
        </button>
      </app-doc-example>
    </app-doc-page>
  `,
})
export class SpartanReplacements {
  private readonly component = toSignal(
    inject(ActivatedRoute).data.pipe(map((d) => d['component'] as string | undefined)),
  );

  protected readonly removed = computed(() => {
    const name = this.component();
    return name ? { name: `pk-${name}`, replacement: REMOVED[name] } : null;
  });

  protected readonly loaderCode = `<hlm-spinner />
<span class="shimmer text-sm font-medium">Thinking</span>

import { HlmSpinner } from '@spartan-ng/helm/spinner';`;

  protected readonly shimmerCode = `<span class="shimmer text-muted-foreground">Searching the web…</span>

<!-- needs spartan's preset in styles.css -->
@import '@spartan-ng/brain/hlm-tailwind-preset.css';`;

  protected readonly messageCode = `<div hlmMessage align="end">
  <div hlmMessageContent>
    <div hlmBubble variant="secondary">
      <div hlmBubbleContent>What's the capital of France?</div>
    </div>
  </div>
</div>
<div hlmMessage>
  <div hlmMessageAvatar>
    <hlm-avatar><span hlmAvatarFallback>AI</span></hlm-avatar>
  </div>
  <div hlmMessageContent>
    <div hlmBubble variant="muted">
      <div hlmBubbleContent>
        <pk-markdown [content]="reply()" />
      </div>
    </div>
  </div>
</div>

import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { HlmMessageImports } from '@spartan-ng/helm/message';`;

  protected readonly systemMessageCode = `<div hlmAlert>
  <ng-icon name="lucideInfo" />
  <h4 hlmAlertTitle>Model switched</h4>
  <p hlmAlertDescription>Replies now come from a faster model.</p>
  <div hlmAlertAction>
    <button hlmBtn size="sm" (click)="undo()">Undo</button>
  </div>
</div>

import { HlmAlertImports } from '@spartan-ng/helm/alert';`;

  protected readonly emptyCode = `<hlm-empty>
  <hlm-empty-header>
    <h3 hlmEmptyTitle>How can I help today?</h3>
    <p hlmEmptyDescription>Ask anything, or start from a suggestion.</p>
  </hlm-empty-header>
  <hlm-empty-content class="flex-row flex-wrap justify-center">
    @for (s of suggestions; track s) {
      <button hlmBtn variant="outline" size="sm" class="rounded-full" (click)="pick(s)">
        {{ s }}
      </button>
    }
  </hlm-empty-content>
</hlm-empty>

import { HlmEmptyImports } from '@spartan-ng/helm/empty';`;

  protected readonly promptInputCode = `<div hlmInputGroup class="rounded-2xl">
  <textarea
    hlmInputGroupTextarea
    placeholder="Ask anything…"
    [value]="draft()"
    (input)="draft.set($any($event.target).value)"
    (keydown.enter)="onEnter($event)"
  ></textarea>
  <div hlmInputGroupAddon align="block-end" class="justify-between">
    <button hlmInputGroupButton size="icon-sm" hlmTooltip="Attach" aria-label="Attach">
      <ng-icon name="lucidePaperclip" />
    </button>
    <button hlmInputGroupButton variant="default" size="icon-sm" class="rounded-full"
            aria-label="Send" (click)="send()">
      <ng-icon name="lucideArrowUp" />
    </button>
  </div>
</div>

import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';`;

  protected readonly scrollButtonCode = `<pk-chat-container-root #thread class="relative h-96">
  <pk-chat-container-content>…</pk-chat-container-content>
</pk-chat-container-root>
<button
  hlmBtn
  variant="outline"
  size="icon"
  class="rounded-full transition-all"
  [class.opacity-0]="thread.isAtBottom()"
  [class.pointer-events-none]="thread.isAtBottom()"
  aria-label="Scroll to bottom"
  (click)="thread.scrollToBottom()"
>
  <ng-icon name="lucideChevronDown" />
</button>`;
}
