import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    children: [
      { path: '', loadComponent: () => import('./pages/landing').then((m) => m.Landing) },
      {
        path: 'installation',
        loadComponent: () => import('./pages/installation').then((m) => m.Installation),
      },
      {
        path: 'blocks',
        loadComponent: () => import('./blocks/blocks-index').then((m) => m.BlocksIndex),
      },
      {
        path: 'blocks/empty-state',
        loadComponent: () => import('./blocks/empty-state').then((m) => m.EmptyStateBlock),
      },
      {
        path: 'blocks/streaming-message',
        loadComponent: () =>
          import('./blocks/streaming-message').then((m) => m.StreamingMessageBlock),
      },
      {
        path: 'blocks/tool-approval',
        loadComponent: () => import('./blocks/tool-approval').then((m) => m.ToolApprovalBlock),
      },
      {
        path: 'blocks/reasoning-pane',
        loadComponent: () => import('./blocks/reasoning-pane').then((m) => m.ReasoningPaneBlock),
      },
      {
        path: 'blocks/branch-edit',
        loadComponent: () => import('./blocks/branch-edit').then((m) => m.BranchEditBlock),
      },
      {
        path: 'blocks/attachment-compose',
        loadComponent: () =>
          import('./blocks/attachment-compose').then((m) => m.AttachmentComposeBlock),
      },
      {
        path: 'blocks/sidebar-header',
        loadComponent: () => import('./blocks/sidebar-header').then((m) => m.SidebarHeaderBlock),
      },
      {
        path: 'blocks/source-citations',
        loadComponent: () =>
          import('./blocks/source-citations').then((m) => m.SourceCitationsBlock),
      },
      {
        path: 'blocks/cost-meter',
        loadComponent: () => import('./blocks/cost-meter').then((m) => m.CostMeterBlock),
      },
      {
        path: 'blocks/system-retry',
        loadComponent: () => import('./blocks/system-retry').then((m) => m.SystemRetryBlock),
      },
      {
        path: 'blocks/chat-thread',
        loadComponent: () => import('./blocks/chat-thread').then((m) => m.ChatThreadBlock),
      },
      {
        path: 'blocks/model-marketplace',
        loadComponent: () =>
          import('./blocks/model-marketplace').then((m) => m.ModelMarketplaceBlock),
      },
      {
        path: 'blocks/image-result',
        loadComponent: () => import('./blocks/image-result').then((m) => m.ImageResultBlock),
      },
      {
        path: 'blocks/voice-input',
        loadComponent: () => import('./blocks/voice-input').then((m) => m.VoiceInputBlock),
      },
      {
        path: 'blocks/code-review',
        loadComponent: () => import('./blocks/code-review').then((m) => m.CodeReviewBlock),
      },
      {
        path: 'blocks/setup-tour',
        loadComponent: () => import('./blocks/setup-tour').then((m) => m.SetupTourBlock),
      },
      {
        path: 'blocks/agent-task',
        loadComponent: () => import('./blocks/agent-task').then((m) => m.AgentTaskBlock),
      },
      {
        path: 'blocks/notification-stack',
        loadComponent: () =>
          import('./blocks/notification-stack').then((m) => m.NotificationStackBlock),
      },
      {
        path: 'blocks/markdown-showcase',
        loadComponent: () =>
          import('./blocks/markdown-showcase').then((m) => m.MarkdownShowcaseBlock),
      },
      {
        path: 'blocks/regenerate-variants',
        loadComponent: () =>
          import('./blocks/regenerate-variants').then((m) => m.RegenerateVariantsBlock),
      },
      {
        path: 'blocks/ai-plan',
        loadComponent: () => import('./blocks/ai-plan').then((m) => m.AiPlanBlock),
      },
      {
        path: 'spartan-replacements',
        loadComponent: () =>
          import('./pages/spartan-replacements').then((m) => m.SpartanReplacements),
      },
      // Removed in favour of spartan/ui; old links land on the page that names the replacement.
      ...[
        'loader',
        'text-shimmer',
        'scroll-button',
        'message',
        'system-message',
        'chat-empty',
        'prompt-input',
        'model-picker',
        'model-list',
        'stream-controls',
        'thinking-bar',
      ].map((component) => ({
        path: `components/${component}`,
        data: { component },
        loadComponent: () =>
          import('./pages/spartan-replacements').then((m) => m.SpartanReplacements),
      })),
      {
        path: 'showcase/full-chat',
        loadComponent: () => import('./pages/full-chat').then((m) => m.FullChat),
      },
      {
        path: 'components/branch-nav',
        loadComponent: () => import('./demo/branch-nav-demo').then((m) => m.BranchNavDemo),
      },
      {
        path: 'components/message-edit',
        loadComponent: () => import('./demo/message-edit-demo').then((m) => m.MessageEditDemo),
      },
      {
        path: 'components/message-actions-bar',
        loadComponent: () =>
          import('./demo/message-actions-bar-demo').then((m) => m.MessageActionsBarDemo),
      },
      {
        path: 'components/model-browser',
        loadComponent: () => import('./demo/model-browser-demo').then((m) => m.ModelBrowserDemo),
      },
      {
        path: 'components/model-selector',
        loadComponent: () => import('./demo/model-selector-demo').then((m) => m.ModelSelectorDemo),
      },
      {
        path: 'components/composer',
        loadComponent: () => import('./demo/composer-demo').then((m) => m.ComposerDemo),
      },
      {
        path: 'components/emoji-autocomplete',
        loadComponent: () =>
          import('./demo/emoji-autocomplete-demo').then((m) => m.EmojiAutocompleteDemo),
      },
      {
        path: 'components/chat-turn',
        loadComponent: () => import('./demo/chat-turn-demo').then((m) => m.ChatTurnDemo),
      },
      {
        path: 'components/usage-card',
        loadComponent: () => import('./demo/usage-card-demo').then((m) => m.UsageCardDemo),
      },
      {
        path: 'components/markdown',
        loadComponent: () => import('./demo/markdown-demo').then((m) => m.MarkdownDemo),
      },
      {
        path: 'components/code-block',
        loadComponent: () => import('./demo/code-block-demo').then((m) => m.CodeBlockDemo),
      },
      {
        path: 'components/response-stream',
        loadComponent: () =>
          import('./demo/response-stream-demo').then((m) => m.ResponseStreamDemo),
      },
      {
        path: 'components/chat-container',
        loadComponent: () => import('./demo/chat-container-demo').then((m) => m.ChatContainerDemo),
      },
      {
        path: 'components/conversation-list',
        loadComponent: () =>
          import('./demo/conversation-list-demo').then((m) => m.ConversationListDemo),
      },
      {
        path: 'components/cost-display',
        loadComponent: () => import('./demo/cost-display-demo').then((m) => m.CostDisplayDemo),
      },
      {
        path: 'components/prompt-suggestion',
        loadComponent: () =>
          import('./demo/prompt-suggestion-demo').then((m) => m.PromptSuggestionDemo),
      },
      {
        path: 'components/file-upload',
        loadComponent: () => import('./demo/file-upload-demo').then((m) => m.FileUploadDemo),
      },
      {
        path: 'components/reasoning',
        loadComponent: () => import('./demo/reasoning-demo').then((m) => m.ReasoningDemo),
      },
      {
        path: 'components/reasoning-selector',
        loadComponent: () =>
          import('./demo/reasoning-selector-demo').then((m) => m.ReasoningSelectorDemo),
      },
      {
        path: 'components/token-counter',
        loadComponent: () => import('./demo/token-counter-demo').then((m) => m.TokenCounterDemo),
      },
      {
        path: 'components/steps',
        loadComponent: () => import('./demo/steps-demo').then((m) => m.StepsDemo),
      },
      {
        path: 'components/image',
        loadComponent: () => import('./demo/image-demo').then((m) => m.ImageDemo),
      },
      {
        path: 'components/source',
        loadComponent: () => import('./demo/source-demo').then((m) => m.SourceDemo),
      },
      {
        path: 'components/feedback-bar',
        loadComponent: () => import('./demo/feedback-bar-demo').then((m) => m.FeedbackBarDemo),
      },
      {
        path: 'components/approval',
        loadComponent: () => import('./demo/approval-demo').then((m) => m.ApprovalDemo),
      },
      {
        path: 'components/attachment-preview',
        loadComponent: () =>
          import('./demo/attachment-preview-demo').then((m) => m.AttachmentPreviewDemo),
      },
      {
        path: 'components/chain-of-thought',
        loadComponent: () =>
          import('./demo/chain-of-thought-demo').then((m) => m.ChainOfThoughtDemo),
      },
      {
        path: 'components/tool',
        loadComponent: () => import('./demo/tool-demo').then((m) => m.ToolDemo),
      },
      {
        path: 'components/tool-steps',
        loadComponent: () => import('./demo/tool-steps-demo').then((m) => m.ToolStepsDemo),
      },
      {
        path: 'utilities/streaming',
        loadComponent: () => import('./demo/streaming-demo').then((m) => m.StreamingDemo),
      },
      {
        path: 'utilities/streaming-message',
        loadComponent: () =>
          import('./demo/streaming-message-demo').then((m) => m.StreamingMessageDemo),
      },
      {
        path: 'utilities/http-error',
        loadComponent: () => import('./demo/http-error-demo').then((m) => m.HttpErrorDemo),
      },
      {
        path: 'utilities/model-icon',
        loadComponent: () => import('./demo/model-icon-demo').then((m) => m.ModelIconDemo),
      },
      {
        path: 'utilities/auth-image',
        loadComponent: () => import('./demo/auth-image-demo').then((m) => m.AuthImageDemo),
      },
      {
        path: 'utilities/chat-stream',
        loadComponent: () => import('./demo/chat-stream-demo').then((m) => m.ChatStreamDemo),
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
