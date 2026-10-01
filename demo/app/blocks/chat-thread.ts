import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmMessageImports } from '@spartan-ng/helm/message';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkChatContainerImports } from 'ngx-prompt-kit/chat-container';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';
import { HlmBubbleImports } from '@spartan-ng/helm/bubble';
import { PkMarkdown } from 'ngx-prompt-kit/markdown';

interface Turn {
  id: number;
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-block-chat-thread',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmButton,
    PkChatContainerImports,
    HlmAvatarImports,
    HlmBubbleImports,
    PkMarkdown,
    NgIcon,
    HlmMessageImports,
  ],
  providers: [provideIcons({ lucideChevronDown })],
  template: `
    <app-block-page
      title="Scrollable chat thread"
      description="Full back-and-forth thread inside a chat-container. Auto-sticks to the bottom on new turns; scroll up and a floating spartan button (reading the container's isAtBottom()) takes you back."
    >
      <app-doc-example title="Auto-stick + back-to-bottom button" [code]="code">
        <div class="flex w-full max-w-2xl flex-col gap-3">
          <div class="flex justify-end">
            <button hlmBtn variant="outline" size="sm" type="button" (click)="addTurn()">
              Add turn
            </button>
          </div>
          <div class="border-border h-[420px] rounded-lg border">
            <pk-chat-container-root #thread class="relative h-full p-4">
              <pk-chat-container-content class="gap-4">
                @for (t of turns(); track t.id) {
                  @if (t.role === 'user') {
                    <div hlmMessage align="end">
                      <div hlmMessageContent>
                        <div hlmBubble>
                          <div hlmBubbleContent>{{ t.text }}</div>
                        </div>
                      </div>
                    </div>
                  } @else {
                    <div hlmMessage>
                      <div hlmMessageAvatar>
                        <hlm-avatar>
                          <span hlmAvatarFallback>AI</span>
                        </hlm-avatar>
                      </div>
                      <div hlmMessageContent>
                        <div hlmBubble variant="secondary">
                          <div hlmBubbleContent class="prose dark:prose-invert">
                            <pk-markdown [content]="t.text" />
                          </div>
                        </div>
                      </div>
                    </div>
                  }
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
    </app-block-page>
  `,
})
export class ChatThreadBlock {
  private readonly seed: Turn[] = [
    { id: 1, role: 'user', text: 'What does signal() do that BehaviorSubject does not?' },
    {
      id: 2,
      role: 'assistant',
      text: '**Synchronous reads** and **automatic dependency tracking**. With a `BehaviorSubject` you have to subscribe (or call `.value`) and rebuild your own derived state. With `signal()` you just read it inside another reactive primitive and the framework wires up the graph.',
    },
    { id: 3, role: 'user', text: 'And computed()?' },
    {
      id: 4,
      role: 'assistant',
      text: '`computed()` is the read-only sibling. It memoises the last result and only re-runs when one of its source signals changes — perfect for cheaply-derived view state.',
    },
  ];

  private nextId = this.seed.length + 1;
  protected readonly turns = signal<Turn[]>([...this.seed]);

  protected addTurn(): void {
    const id = this.nextId++;
    const role: 'user' | 'assistant' = id % 2 === 1 ? 'user' : 'assistant';
    const text =
      role === 'user'
        ? 'Tell me one more thing.'
        : `That's turn ${id} — the container should scroll itself to keep this in view.`;
    this.turns.update((list) => [...list, { id, role, text }]);
  }

  protected readonly code = `<pk-chat-container-root #thread class="relative h-full p-4">
  <pk-chat-container-content class="gap-4">
    @for (t of turns(); track t.id) {
      @if (t.role === 'user') {
        <div hlmMessage align="end">
          <div hlmMessageContent>
            <div hlmBubble>
              <div hlmBubbleContent>{{ t.text }}</div>
            </div>
          </div>
        </div>
      } @else {
        <div hlmMessage>
          <div hlmMessageAvatar>
            <hlm-avatar>
              <span hlmAvatarFallback>AI</span>
            </hlm-avatar>
          </div>
          <div hlmMessageContent>
            <div hlmBubble variant="secondary">
              <div hlmBubbleContent class="prose dark:prose-invert">
                <pk-markdown [content]="t.text" />
              </div>
            </div>
          </div>
        </div>
      }
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

// Component
protected readonly turns = signal<Turn[]>([
  { id: 1, role: 'user', text: '...' },
  { id: 2, role: 'assistant', text: '...' },
]);

protected addTurn(): void {
  this.turns.update(list => [...list, newTurn]);
  // chat-container auto-scrolls only if user is at the bottom
}`;
}
