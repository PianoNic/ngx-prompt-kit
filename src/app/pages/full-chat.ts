import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
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
import { HlmTabsImports } from '@spartan-ng/helm/tabs';
import { PkCodeBlockImports } from 'ngx-prompt-kit/code-block';
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
import { FULL_CHAT_HTML_SOURCE } from './full-chat.source';
import { ScriptedLlmService } from '../services/scripted-llm.service';

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
    HlmTabsImports,
    PkAttachmentPreviewImports,
    PkCodeBlockImports,
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
  templateUrl: './full-chat.html',
})
export class FullChat {
  protected readonly userAvatar = 'https://avatars.githubusercontent.com/u/79938743?v=4';
  protected readonly fullChatHtmlSource = FULL_CHAT_HTML_SOURCE;

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
  private readonly scripted = inject(ScriptedLlmService);

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
    const lastUserText = this.lastUserMessageIn(convoId);
    const replyText = this.scripted.reply(lastUserText);
    setTimeout(() => {
      const reply: ChatMessage = {
        id: replyId,
        role: 'assistant',
        streaming: true,
        content: replyText,
      };
      this.threadsByConvo.update((map) => ({
        ...map,
        [convoId]: [...(map[convoId] ?? []), reply],
      }));
      this.isStreaming.set(false);
    }, 600);
  }

  private lastUserMessageIn(convoId: string): string {
    const thread = this.threadsByConvo()[convoId] ?? [];
    for (let i = thread.length - 1; i >= 0; i--) {
      if (thread[i].role === 'user') return thread[i].content;
    }
    return '';
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
