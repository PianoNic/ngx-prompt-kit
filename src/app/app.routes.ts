import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell').then((m) => m.Shell),
    children: [
      { path: '', loadComponent: () => import('./pages/landing').then((m) => m.Landing) },
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
        path: 'components/message',
        loadComponent: () => import('./demo/message-demo').then((m) => m.MessageDemo),
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
    ],
  },
];
