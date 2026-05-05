import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUp,
  lucideChevronsUpDown,
  lucideCopy,
  lucideLogOut,
  lucideMic,
  lucidePaperclip,
  lucidePencil,
  lucidePlus,
  lucideRefreshCw,
  lucideSearch,
  lucideSettings,
  lucideThumbsDown,
  lucideThumbsUp,
  lucideUserRound,
  lucideX,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmDropdownMenu,
  HlmDropdownMenuItem,
  HlmDropdownMenuSeparator,
  HlmDropdownMenuTrigger,
} from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { type Attachment, PkAttachmentPreviewImports } from 'ngx-prompt-kit/attachment-preview';
import { PkChatContainerImports } from 'ngx-prompt-kit/chat-container';
import {
  type Conversation,
  PkConversationListImports,
} from 'ngx-prompt-kit/conversation-list';
import { PkLoader } from 'ngx-prompt-kit/loader';
import { PkMessageImports } from 'ngx-prompt-kit/message';
import {
  DEFAULT_ASSISTANT_ACTIONS,
  DEFAULT_USER_ACTIONS,
  type MessageAction,
  PkMessageActionsBarImports,
} from 'ngx-prompt-kit/message-actions-bar';
import { PkMessageEdit, PkMessageEditImports } from 'ngx-prompt-kit/message-edit';
import { type Model, PkModelPickerImports } from 'ngx-prompt-kit/model-picker';
import { PkPromptInputImports } from 'ngx-prompt-kit/prompt-input';
import { PkResponseStream } from 'ngx-prompt-kit/response-stream';
import { PkScrollButton } from 'ngx-prompt-kit/scroll-button';
import { PkTokenCounter } from 'ngx-prompt-kit/token-counter';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  markdown?: boolean;
  streaming?: boolean;
  attachments?: Attachment[];
}

const ICON = (n: string) => `https://unpkg.com/@lobehub/icons-static-svg@latest/icons/${n}.svg`;

const SAMPLE_ATTACHMENT_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/></svg>`,
  );

@Component({
  selector: 'app-full-chat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    HlmButton,
    HlmDropdownMenu,
    HlmDropdownMenuItem,
    HlmDropdownMenuSeparator,
    HlmDropdownMenuTrigger,
    HlmIconImports,
    PkAttachmentPreviewImports,
    PkChatContainerImports,
    PkConversationListImports,
    PkLoader,
    PkMessageImports,
    PkMessageActionsBarImports,
    PkMessageEditImports,
    PkModelPickerImports,
    PkPromptInputImports,
    PkResponseStream,
    PkScrollButton,
    PkTokenCounter,
  ],
  providers: [
    provideIcons({
      lucideArrowUp,
      lucideChevronsUpDown,
      lucideCopy,
      lucideLogOut,
      lucideMic,
      lucidePaperclip,
      lucidePencil,
      lucidePlus,
      lucideRefreshCw,
      lucideSearch,
      lucideSettings,
      lucideThumbsDown,
      lucideThumbsUp,
      lucideUserRound,
      lucideX,
    }),
  ],
  template: `
    <div
      class="border-border bg-background mx-auto flex h-[calc(100vh-7.5rem)] max-w-6xl flex-col overflow-hidden rounded-lg border md:flex-row"
    >
      <!-- Conversation sidebar -->
      <aside
        class="border-border hidden h-full min-h-0 w-64 shrink-0 flex-col border-r md:flex"
      >
        <div class="border-border flex items-center justify-between border-b px-3 py-2">
          <span class="text-foreground text-sm font-medium">Conversations</span>
          <button
            hlmBtn
            variant="ghost"
            size="icon-sm"
            type="button"
            aria-label="New conversation"
            (click)="newConversation()"
          >
            <ng-icon hlm size="xs" name="lucidePlus" />
          </button>
        </div>
        <div class="border-border border-b px-2 py-2">
          <div
            class="bg-muted/40 focus-within:ring-ring flex items-center gap-2 rounded-md px-2 focus-within:ring-2"
          >
            <ng-icon
              hlm
              size="xs"
              name="lucideSearch"
              class="text-muted-foreground shrink-0"
            />
            <input
              type="search"
              [(ngModel)]="searchQueryInput"
              (ngModelChange)="searchQuery.set($event)"
              placeholder="Search chats..."
              aria-label="Search conversations"
              class="text-foreground placeholder:text-muted-foreground h-8 w-full bg-transparent text-sm outline-none"
            />
            @if (searchQuery().length > 0) {
              <button
                type="button"
                aria-label="Clear search"
                class="text-muted-foreground hover:text-foreground shrink-0"
                (click)="clearSearch()"
              >
                <ng-icon hlm size="xs" name="lucideX" />
              </button>
            }
          </div>
        </div>
        @if (filteredConversations().length === 0) {
          <p class="text-muted-foreground flex-1 px-3 py-6 text-center text-xs">
            No conversations match "{{ searchQuery() }}"
          </p>
        } @else {
          <pk-conversation-list
            [conversations]="filteredConversations()"
            [activeId]="selectedConvoId()"
            (selected)="selectedConvoId.set($event)"
            (renamed)="onRename($event)"
            (deleted)="onDelete($event)"
            class="min-h-0 flex-1"
          />
        }
        <div class="border-border border-t p-2">
          <button
            type="button"
            [hlmDropdownMenuTrigger]="userMenu"
            side="top"
            align="start"
            class="hover:bg-muted focus-visible:ring-ring flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2"
            aria-label="Account menu"
          >
            <img
              [src]="userAvatar"
              alt=""
              aria-hidden="true"
              class="h-8 w-8 shrink-0 rounded-full object-cover"
            />
            <div class="flex min-w-0 flex-1 flex-col">
              <span class="text-foreground truncate text-sm font-medium">Niclas</span>
              <span class="text-muted-foreground truncate text-xs">Pro plan</span>
            </div>
            <ng-icon
              hlm
              size="xs"
              name="lucideChevronsUpDown"
              class="text-muted-foreground shrink-0"
            />
          </button>
          <ng-template #userMenu>
            <hlm-dropdown-menu class="min-w-[220px]">
              <button hlmDropdownMenuItem type="button" (triggered)="onMenu('account')">
                <ng-icon hlm size="xs" name="lucideUserRound" />
                Account
              </button>
              <button hlmDropdownMenuItem type="button" (triggered)="onMenu('settings')">
                <ng-icon hlm size="xs" name="lucideSettings" />
                Settings
              </button>
              <hlm-dropdown-menu-separator />
              <button
                hlmDropdownMenuItem
                variant="destructive"
                type="button"
                (triggered)="onMenu('signout')"
              >
                <ng-icon hlm size="xs" name="lucideLogOut" />
                Sign out
              </button>
            </hlm-dropdown-menu>
          </ng-template>
        </div>
      </aside>

      <!-- Main chat column -->
      <section class="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <!-- Header -->
        <header class="border-border flex items-center justify-between gap-3 border-b px-4 py-2">
          <pk-model-picker
            [compact]="true"
            [models]="models"
            [(selectedId)]="selectedModelId"
          />
          <span class="text-muted-foreground truncate text-xs">
            {{ currentConvoTitle() }}
          </span>
        </header>

        <!-- Message thread -->
        <pk-chat-container-root class="relative flex-1 px-4 py-4">
          <pk-chat-container-content class="gap-6">
            @for (m of currentMessages(); track m.id) {
              @if (m.role === 'user') {
                <div class="group flex max-w-[80%] flex-col items-end gap-1 self-end">
                  <pk-message class="justify-end">
                    <pk-message-edit
                      #userEditor
                      editTrigger="hidden"
                      [content]="m.content"
                      (saved)="onMessageSaved(m.id, $event)"
                    >
                      <pk-message-content
                        class="bg-primary text-primary-foreground"
                        [content]="m.content"
                      />
                    </pk-message-edit>
                  </pk-message>
                  @if (m.attachments?.length) {
                    <pk-attachment-preview
                      [attachments]="m.attachments ?? []"
                      [removable]="false"
                    />
                  }
                  <pk-message-actions-bar
                    [actions]="userActions"
                    (actionPicked)="onUserAction($event, m, userEditor)"
                  />
                </div>
              } @else {
                <div class="group flex max-w-[85%] flex-col gap-1 self-start">
                  <pk-message>
                    <pk-message-avatar src="" alt="Assistant" fallback="AI" />
                    @if (m.streaming) {
                      <pk-message-content>
                        <pk-response-stream
                          mode="typewriter"
                          [speed]="60"
                          [textStream]="m.content"
                          (completed)="onStreamCompleted(m.id)"
                        />
                      </pk-message-content>
                    } @else {
                      <pk-message-content
                        [markdown]="m.markdown === true"
                        [content]="m.content"
                      />
                    }
                  </pk-message>
                  @if (!m.streaming) {
                    <pk-message-actions-bar
                      class="ml-11"
                      [actions]="assistantActionsFor(m.id)"
                      (actionPicked)="onAssistantAction($event, m)"
                    />
                  }
                </div>
              }
            }
            @if (isStreaming()) {
              <div class="flex items-center gap-3 pl-11">
                <pk-loader variant="text-shimmer" text="Thinking..." />
              </div>
            }
          </pk-chat-container-content>
          <pk-chat-container-scroll-anchor />
          <div class="sticky bottom-2 ml-auto w-fit pr-1">
            <pk-scroll-button />
          </div>
        </pk-chat-container-root>

        <!-- Composer -->
        <div class="border-border border-t px-4 py-3">
          @if (stagedAttachments().length > 0) {
            <pk-attachment-preview
              class="mb-2"
              [attachments]="stagedAttachments()"
              (removed)="onStagedRemoved($event)"
            />
          }
          <pk-prompt-input [(value)]="inputValue" (submitted)="send()">
            <pk-prompt-input-textarea placeholder="Ask anything..." />
            <pk-prompt-input-actions class="mt-2 justify-between">
              <div class="flex items-center gap-1">
                <pk-prompt-input-action tooltip="Attach files">
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon-sm"
                    type="button"
                    aria-label="Attach files"
                    (click)="addSampleAttachment()"
                  >
                    <ng-icon hlm size="sm" name="lucidePaperclip" />
                  </button>
                </pk-prompt-input-action>
                <pk-prompt-input-action tooltip="Voice input">
                  <button
                    hlmBtn
                    variant="ghost"
                    size="icon-sm"
                    type="button"
                    aria-label="Voice input"
                  >
                    <ng-icon hlm size="sm" name="lucideMic" />
                  </button>
                </pk-prompt-input-action>
                <pk-token-counter
                  class="ml-2"
                  display="compact"
                  [text]="inputValue()"
                  [limit]="2000"
                />
              </div>
              <pk-prompt-input-action tooltip="Send message">
                <button
                  hlmBtn
                  size="icon-sm"
                  type="button"
                  class="rounded-full"
                  aria-label="Send message"
                  [disabled]="!canSend()"
                  (click)="send()"
                >
                  <ng-icon hlm size="xs" name="lucideArrowUp" />
                </button>
              </pk-prompt-input-action>
            </pk-prompt-input-actions>
          </pk-prompt-input>
        </div>
      </section>
    </div>
  `,
})
export class FullChat {
  protected readonly userAvatar =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#10b981"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/></svg>`,
    );

  protected readonly models: Model[] = [
    {
      id: 'claude-opus',
      name: 'Claude Opus 4.7',
      iconUrl: ICON('anthropic'),
      provider: 'Anthropic',
      tier: 'smart',
      tagline: 'Best for complex multi-step reasoning',
      inputPricePer1M: 15,
      outputPricePer1M: 75,
    },
    {
      id: 'claude-sonnet',
      name: 'Claude Sonnet 4.6',
      iconUrl: ICON('anthropic'),
      provider: 'Anthropic',
      tier: 'balanced',
      tagline: 'Default for most workloads',
      inputPricePer1M: 3,
      outputPricePer1M: 15,
    },
    {
      id: 'gpt-5',
      name: 'GPT-5',
      iconUrl: ICON('openai'),
      provider: 'OpenAI',
      tier: 'smart',
      inputPricePer1M: 5,
      outputPricePer1M: 20,
    },
    {
      id: 'qwen3',
      name: 'Qwen3 235B',
      iconUrl: ICON('qwen'),
      provider: 'Alibaba',
      tier: 'fast',
      inputPricePer1M: 0.6,
      outputPricePer1M: 2.4,
    },
  ];

  protected readonly conversations = signal<Conversation[]>([
    {
      id: 'c1',
      title: 'Release notes from latest commits',
      updatedAt: new Date(Date.now() - 30 * 60 * 1000),
      preview: 'Group commits into features, fixes, chores',
    },
    {
      id: 'c2',
      title: 'Signal vs computed primer',
      updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
      preview: 'Writable state vs derived read-only',
    },
    {
      id: 'c3',
      title: 'Auth middleware migration plan',
      updatedAt: new Date(Date.now() - 26 * 60 * 60 * 1000),
    },
    {
      id: 'c4',
      title: 'Tailwind v4 upgrade gotchas',
      updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      preview: '@theme directive replaces config',
    },
  ]);

  protected readonly selectedConvoId = signal<string | null>('c1');
  protected readonly selectedModelId = signal<string | null>('claude-sonnet');
  protected readonly inputValue = signal('');
  protected readonly stagedAttachments = signal<Attachment[]>([
    {
      id: 'a1',
      name: 'commit-log.txt',
      type: 'file',
      size: 14_336,
    },
  ]);
  protected readonly isStreaming = signal(false);
  protected readonly thumbsActive = signal<Record<string, boolean>>({});

  protected readonly userActions = DEFAULT_USER_ACTIONS;

  protected assistantActionsFor(messageId: string): readonly MessageAction[] {
    const active = this.thumbsActive()[messageId] === true;
    return DEFAULT_ASSISTANT_ACTIONS.map((a) =>
      a.id === 'thumbs-up' ? { ...a, active } : a,
    );
  }

  private readonly threadsByConvo = signal<Record<string, ChatMessage[]>>({
    c1: [
      {
        id: 'c1-1',
        role: 'user',
        content: 'Group the latest commits into release notes — features, fixes, chores.',
        attachments: [{ id: 'c1-a', name: 'commit-log.txt', type: 'file', size: 14_336 }],
      },
      {
        id: 'c1-2',
        role: 'assistant',
        content:
          "Clean grouping for v21.0.6 → v21.0.7. Features: seven new originals (approval, attachment-preview, message-actions-bar, branch-nav, model-picker, model-list, model-browser) plus usage-card with three display modes in v21.0.7. Fixes: prompt-input dark-mode textarea backdrop, model-browser detail-pane spacing. Chores: code-block now defaults darkTheme to dark-plus, router scrolls to top on navigation. Want me to draft the GitHub release body in the same shape?",
      },
      {
        id: 'c1-3',
        role: 'user',
        content: 'Yes — keep the bullets terse, no preamble.',
      },
    ],
    c2: [
      {
        id: 'c2-1',
        role: 'user',
        content: 'When should I reach for computed() vs deriving inside an effect?',
      },
      {
        id: 'c2-2',
        role: 'assistant',
        markdown: true,
        content: `Short version: **computed for values, effects for side effects.**

\`\`\`ts
// Good — derived value
const fullName = computed(() => first() + ' ' + last());

// Bad — using effect to "derive"
effect(() => {
  fullNameSignal.set(first() + ' ' + last());
});
\`\`\`

Effects re-run on every dependency change but don't memoize. Computed signals memoize and lazily evaluate. If you find yourself calling .set() inside an effect, that's almost always a hint to use computed instead.`,
      },
    ],
    c3: [
      {
        id: 'c3-1',
        role: 'user',
        content: 'What\'s the safest path to migrate the auth middleware off the old session cookie?',
      },
      {
        id: 'c3-2',
        role: 'assistant',
        content:
          'Two-phase rollout: ship the new SessionService alongside the old middleware, dual-read for one release, then flip the write path. The dual-read window catches consumers that hold legacy sessions in flight without forcing a hard cutover.',
      },
    ],
    c4: [
      {
        id: 'c4-1',
        role: 'user',
        content: 'Tailwind v4 — what bit you the hardest?',
      },
      {
        id: 'c4-2',
        role: 'assistant',
        content:
          'The @theme directive moving config into CSS surprised me — color tokens that lived in tailwind.config.js need to be redeclared in styles.css. Also: PostCSS plugin renamed to @tailwindcss/postcss.',
      },
    ],
  });

  protected readonly currentMessages = computed<ChatMessage[]>(() => {
    const id = this.selectedConvoId();
    if (!id) return [];
    return this.threadsByConvo()[id] ?? [];
  });

  protected readonly searchQuery = signal('');
  protected searchQueryInput = '';

  protected readonly filteredConversations = computed(() => {
    const q = this.searchQuery().trim().toLowerCase();
    const all = this.conversations();
    if (!q) return all;
    return all.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.preview ?? '').toLowerCase().includes(q),
    );
  });

  protected clearSearch(): void {
    this.searchQuery.set('');
    this.searchQueryInput = '';
  }

  protected readonly currentConvoTitle = computed(() => {
    const id = this.selectedConvoId();
    return this.conversations().find((c) => c.id === id)?.title ?? '';
  });

  protected readonly canSend = computed(
    () => this.inputValue().trim().length > 0 && !this.isStreaming(),
  );

  protected newConversation(): void {
    const id = `c-${Date.now()}`;
    const fresh: Conversation = {
      id,
      title: 'New conversation',
      updatedAt: new Date(),
    };
    this.conversations.update((list) => [fresh, ...list]);
    this.threadsByConvo.update((map) => ({ ...map, [id]: [] }));
    this.selectedConvoId.set(id);
  }

  protected onRename({ id, title }: { id: string; title: string }): void {
    this.conversations.update((list) =>
      list.map((c) => (c.id === id ? { ...c, title, updatedAt: new Date() } : c)),
    );
  }

  protected onDelete(id: string): void {
    this.conversations.update((list) => list.filter((c) => c.id !== id));
    this.threadsByConvo.update((map) => {
      const next = { ...map };
      delete next[id];
      return next;
    });
    if (this.selectedConvoId() === id) {
      this.selectedConvoId.set(this.conversations()[0]?.id ?? null);
    }
  }

  protected addSampleAttachment(): void {
    this.stagedAttachments.update((list) => [
      ...list,
      {
        id: `att-${Date.now()}`,
        name: 'screenshot.png',
        type: 'image',
        thumbnailUrl: SAMPLE_ATTACHMENT_IMAGE,
        size: 81_920,
      },
    ]);
  }

  protected onStagedRemoved(id: string): void {
    this.stagedAttachments.update((list) => list.filter((a) => a.id !== id));
  }

  protected send(): void {
    if (!this.canSend()) return;
    const convoId = this.selectedConvoId();
    if (!convoId) return;
    const text = this.inputValue().trim();
    const attachments = this.stagedAttachments();
    const userMessage: ChatMessage = {
      id: `${convoId}-u-${Date.now()}`,
      role: 'user',
      content: text,
      attachments: attachments.length > 0 ? attachments : undefined,
    };
    this.threadsByConvo.update((map) => ({
      ...map,
      [convoId]: [...(map[convoId] ?? []), userMessage],
    }));
    this.inputValue.set('');
    this.stagedAttachments.set([]);
    this.simulateAssistantReply(convoId);
  }

  private simulateAssistantReply(convoId: string): void {
    this.isStreaming.set(true);
    const replyId = `${convoId}-a-${Date.now()}`;
    setTimeout(() => {
      const reply: ChatMessage = {
        id: replyId,
        role: 'assistant',
        streaming: true,
        content:
          "Mocked reply — this showcase doesn't call a real model. In production you'd push token chunks into pk-response-stream's textStream signal as they arrive from your backend; the typewriter animation here is driven by that same component.",
      };
      this.threadsByConvo.update((map) => ({
        ...map,
        [convoId]: [...(map[convoId] ?? []), reply],
      }));
      this.isStreaming.set(false);
    }, 600);
  }

  protected onStreamCompleted(messageId: string): void {
    this.threadsByConvo.update((map) => {
      const next: Record<string, ChatMessage[]> = {};
      for (const [k, list] of Object.entries(map)) {
        next[k] = list.map((m) => (m.id === messageId ? { ...m, streaming: false } : m));
      }
      return next;
    });
  }

  protected onMessageSaved(id: string, newContent: string): void {
    const convoId = this.selectedConvoId();
    if (!convoId) return;
    this.threadsByConvo.update((map) => ({
      ...map,
      [convoId]: (map[convoId] ?? []).map((m) =>
        m.id === id ? { ...m, content: newContent } : m,
      ),
    }));
  }

  protected onUserAction(action: MessageAction, m: ChatMessage, editor: PkMessageEdit): void {
    if (action.id === 'edit') editor.startEdit();
    if (action.id === 'copy') this.copyToClipboard(m.content);
  }

  protected onAssistantAction(action: MessageAction, m: ChatMessage): void {
    if (action.id === 'copy') this.copyToClipboard(m.content);
    if (action.id === 'regenerate') this.simulateAssistantReply(this.selectedConvoId() ?? 'c1');
    if (action.id === 'thumbs-up') {
      this.thumbsActive.update((map) => ({ ...map, [m.id]: !map[m.id] }));
    }
  }

  protected onMenu(action: 'account' | 'settings' | 'signout'): void {
    console.log('[full-chat showcase] menu action:', action);
  }

  private copyToClipboard(text: string): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => undefined);
    }
  }
}
