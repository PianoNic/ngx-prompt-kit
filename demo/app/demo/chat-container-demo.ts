import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkChatContainerImports } from 'ngx-prompt-kit/chat-container';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';

@Component({
  selector: 'app-chat-container-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocPage,
    DocExample,
    DocInstall,
    DocApi,
    HlmButton,
    PkChatContainerImports,
    HlmAvatarImports,
    HlmBubbleImports,
    NgIcon,
    HlmMessageImports,
  ],
  providers: [provideIcons({ lucideChevronDown })],
  template: `
    <app-doc-page
      title="Chat Container"
      description="A scroll area that auto-sticks to the bottom on new content — but only if the user is already there. For a back-to-bottom affordance, bind a spartan hlmBtn to the container's canScrollDown() and scrollToBottom(); pinToTop() holds a just-sent message at the top while the reply comes in."
    >
      <app-doc-example
        title="Auto-scroll on new messages"
        description="Add a message; the container scrolls to keep up. Scroll up manually and the auto-scroll yields to you — the floating button takes you back."
        [code]="autoScrollCode"
      >
        <div class="w-full max-w-2xl">
          <button
            hlmBtn
            variant="outline"
            size="sm"
            type="button"
            class="mb-3"
            (click)="addMessage()"
          >
            Add message
          </button>
          <div class="border-border h-[360px] rounded-lg border">
            <pk-chat-container-root #thread class="relative h-full p-4">
              <pk-chat-container-content class="gap-3">
                @for (m of messages(); track m.id) {
                  <div hlmMessage>
                    <div hlmMessageAvatar>
                      <hlm-avatar>
                        <span hlmAvatarFallback>U</span>
                      </hlm-avatar>
                    </div>
                    <div hlmMessageContent>
                      <div hlmBubble variant="secondary">
                        <div hlmBubbleContent>{{ m.text }}</div>
                      </div>
                    </div>
                  </div>
                }
              </pk-chat-container-content>
              <pk-chat-container-scroll-anchor />
              <div class="sticky bottom-2 ml-auto w-fit pr-1">
                <button
                  hlmBtn
                  variant="outline"
                  size="icon"
                  type="button"
                  aria-label="Scroll to bottom"
                  class="size-10 rounded-full transition-all duration-150 ease-out data-[hidden=true]:pointer-events-none data-[hidden=true]:translate-y-4 data-[hidden=true]:scale-95 data-[hidden=true]:opacity-0"
                  [attr.data-hidden]="thread.isAtBottom()"
                  (click)="thread.scrollToBottom()"
                >
                  <ng-icon name="lucideChevronDown" />
                </button>
              </div>
            </pk-chat-container-root>
          </div>
        </div>
      </app-doc-example>

      <app-doc-install component="chat-container" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ChatContainerDemo {
  protected readonly api: ApiSection[] = [
    {
      name: 'PkChatContainerRoot',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the scroll container.' },
        {
          name: 'isAtBottom',
          type: 'Signal<boolean>',
          description: 'Read-only signal exposed via CHAT_CONTAINER_STATE.',
        },
        {
          name: 'scrollToBottom()',
          type: '(behavior?: ScrollBehavior) => void',
          description: 'Method to programmatically scroll to bottom. Ends a pin.',
        },
        {
          name: 'canScrollDown',
          type: 'Signal<boolean>',
          description:
            'Whether there is content below the view (the room kept under a pinned turn not counted). Bind a spartan hlmBtn to it for a back-to-bottom button.',
        },
        {
          name: 'pinToTop()',
          type: '(element: HTMLElement, offset?: number) => void',
          description:
            'Scrolls a turn to the top of the view, offset px below the edge (16 by default), and holds it there while the reply below grows, keeping room under it as long as the reply is shorter than the view. Call it with a message the user just sent, as Claude does.',
        },
      ],
    },
    {
      name: 'PkChatContainerContent',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the inner flex column.' },
      ],
    },
    {
      name: 'PkChatContainerScrollAnchor',
      props: [
        {
          name: 'class',
          type: 'string',
          description: 'Extra classes for the 1-pixel anchor element.',
        },
      ],
    },
  ];

  protected readonly messages = signal(
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      text: `Message ${i + 1} — chat scrolls to follow as new content arrives.`,
    })),
  );
  protected addMessage(): void {
    const list = this.messages();
    this.messages.set([...list, { id: list.length, text: `Message ${list.length + 1}` }]);
  }

  protected readonly autoScrollCode = `<pk-chat-container-root #thread class="relative h-[360px] p-4">
  <pk-chat-container-content class="gap-3">
    @for (m of messages(); track m.id) {
      <div hlmMessage>
        <div hlmMessageAvatar>
          <hlm-avatar>
            <img hlmAvatarImage [src]="m.avatar" alt="" />
            <span hlmAvatarFallback>AI</span>
          </hlm-avatar>
        </div>
        <div hlmMessageContent>
          <div hlmBubble variant="secondary">
            <div hlmBubbleContent>{{ m.text }}</div>
          </div>
        </div>
      </div>
    }
  </pk-chat-container-content>
  <pk-chat-container-scroll-anchor />
  <div class="sticky bottom-2 ml-auto w-fit pr-1">
    <button
      hlmBtn
      variant="outline"
      size="icon"
      type="button"
      aria-label="Scroll to bottom"
      class="size-10 rounded-full transition-all duration-150 ease-out data-[hidden=true]:pointer-events-none data-[hidden=true]:translate-y-4 data-[hidden=true]:scale-95 data-[hidden=true]:opacity-0"
      [attr.data-hidden]="thread.isAtBottom()"
      (click)="thread.scrollToBottom()"
    >
      <ng-icon name="lucideChevronDown" />
    </button>
  </div>
</pk-chat-container-root>`;
}
