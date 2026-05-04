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
        loadComponent: () => import('./pages/coming-soon').then((m) => m.ComingSoon),
        data: { title: 'Blocks' },
      },
      {
        path: 'showcase/full-chat',
        loadComponent: () => import('./pages/coming-soon').then((m) => m.ComingSoon),
        data: { title: 'Full Chat' },
      },
      {
        path: 'components/branch-nav',
        loadComponent: () => import('./demo/branch-nav-demo').then((m) => m.BranchNavDemo),
      },
      {
        path: 'components/message',
        loadComponent: () => import('./demo/message-demo').then((m) => m.MessageDemo),
      },
      {
        path: 'components/message-edit',
        loadComponent: () =>
          import('./demo/message-edit-demo').then((m) => m.MessageEditDemo),
      },
      {
        path: 'components/message-actions-bar',
        loadComponent: () =>
          import('./demo/message-actions-bar-demo').then((m) => m.MessageActionsBarDemo),
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
        path: 'components/prompt-input',
        loadComponent: () =>
          import('./demo/prompt-input-demo').then((m) => m.PromptInputDemo),
      },
      {
        path: 'components/response-stream',
        loadComponent: () =>
          import('./demo/response-stream-demo').then((m) => m.ResponseStreamDemo),
      },
      {
        path: 'components/loader',
        loadComponent: () => import('./demo/loader-demo').then((m) => m.LoaderDemo),
      },
      {
        path: 'components/chat-container',
        loadComponent: () =>
          import('./demo/chat-container-demo').then((m) => m.ChatContainerDemo),
      },
      {
        path: 'components/chat-empty',
        loadComponent: () => import('./demo/chat-empty-demo').then((m) => m.ChatEmptyDemo),
      },
      {
        path: 'components/conversation-list',
        loadComponent: () =>
          import('./demo/conversation-list-demo').then((m) => m.ConversationListDemo),
      },
      {
        path: 'components/cost-display',
        loadComponent: () =>
          import('./demo/cost-display-demo').then((m) => m.CostDisplayDemo),
      },
      {
        path: 'components/scroll-button',
        loadComponent: () =>
          import('./demo/chat-container-demo').then((m) => m.ChatContainerDemo),
      },
      {
        path: 'components/prompt-suggestion',
        loadComponent: () =>
          import('./demo/prompt-suggestion-demo').then((m) => m.PromptSuggestionDemo),
      },
      {
        path: 'components/file-upload',
        loadComponent: () =>
          import('./demo/file-upload-demo').then((m) => m.FileUploadDemo),
      },
      {
        path: 'components/reasoning',
        loadComponent: () => import('./demo/reasoning-demo').then((m) => m.ReasoningDemo),
      },
      {
        path: 'components/text-shimmer',
        loadComponent: () => import('./demo/text-shimmer-demo').then((m) => m.TextShimmerDemo),
      },
      {
        path: 'components/thinking-bar',
        loadComponent: () => import('./demo/thinking-bar-demo').then((m) => m.ThinkingBarDemo),
      },
      {
        path: 'components/token-counter',
        loadComponent: () =>
          import('./demo/token-counter-demo').then((m) => m.TokenCounterDemo),
      },
      {
        path: 'components/system-message',
        loadComponent: () =>
          import('./demo/system-message-demo').then((m) => m.SystemMessageDemo),
      },
      {
        path: 'components/steps',
        loadComponent: () => import('./demo/steps-demo').then((m) => m.StepsDemo),
      },
      {
        path: 'components/stream-controls',
        loadComponent: () =>
          import('./demo/stream-controls-demo').then((m) => m.StreamControlsDemo),
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
        loadComponent: () =>
          import('./demo/feedback-bar-demo').then((m) => m.FeedbackBarDemo),
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
    ],
  },
];
