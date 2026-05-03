import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkChatContainerImports } from 'prompt-kit-ng/chat-container';
import { PkMessageImports } from 'prompt-kit-ng/message';
import { PkScrollButton } from 'prompt-kit-ng/scroll-button';

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
    PkMessageImports,
    PkScrollButton,
  ],
  template: `
    <app-doc-page
      title="Chat Container"
      description="A scroll area that auto-sticks to the bottom on new content — but only if the user is already there. Pair with ScrollButton for a back-to-bottom affordance."
    >
      <app-doc-example
        title="Auto-scroll on new messages"
        description="Add a message; the container scrolls to keep up. Scroll up manually and the auto-scroll yields to you — the floating button takes you back."
        [code]="autoScrollCode"
      >
        <div class="w-full max-w-2xl">
          <button hlmBtn variant="outline" size="sm" type="button" class="mb-3" (click)="addMessage()">
            Add message
          </button>
          <div class="border-border h-[360px] rounded-lg border">
            <pk-chat-container-root class="relative h-full p-4">
              <pk-chat-container-content class="gap-3">
                @for (m of messages(); track m.id) {
                  <pk-message>
                    <pk-message-avatar src="" alt="User" fallback="U" />
                    <pk-message-content [content]="m.text" />
                  </pk-message>
                }
              </pk-chat-container-content>
              <pk-chat-container-scroll-anchor />
              <div class="sticky bottom-2 ml-auto w-fit pr-1">
                <pk-scroll-button />
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
        { name: 'isAtBottom', type: 'Signal<boolean>', description: 'Read-only signal exposed via CHAT_CONTAINER_STATE.' },
        { name: 'scrollToBottom()', type: '(behavior?: ScrollBehavior) => void', description: 'Method to programmatically scroll to bottom.' },
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
        { name: 'class', type: 'string', description: 'Extra classes for the 1-pixel anchor element.' },
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
    this.messages.set([
      ...list,
      { id: list.length, text: `Message ${list.length + 1}` },
    ]);
  }

  protected readonly autoScrollCode = `<pk-chat-container-root class="relative h-[360px] p-4">
  <pk-chat-container-content class="gap-3">
    @for (m of messages(); track m.id) {
      <pk-message>
        <pk-message-avatar [src]="m.avatar" alt="" />
        <pk-message-content [content]="m.text" />
      </pk-message>
    }
  </pk-chat-container-content>
  <pk-chat-container-scroll-anchor />
  <div class="sticky bottom-2 ml-auto w-fit pr-1">
    <pk-scroll-button />
  </div>
</pk-chat-container-root>`;
}
