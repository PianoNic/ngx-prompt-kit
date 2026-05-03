import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./demo/demo-shell').then((m) => m.DemoShell),
    children: [
      { path: '', redirectTo: 'message', pathMatch: 'full' },
      {
        path: 'message',
        loadComponent: () => import('./demo/message-demo').then((m) => m.MessageDemo),
      },
      {
        path: 'markdown',
        loadComponent: () => import('./demo/markdown-demo').then((m) => m.MarkdownDemo),
      },
      {
        path: 'code-block',
        loadComponent: () => import('./demo/code-block-demo').then((m) => m.CodeBlockDemo),
      },
      {
        path: 'prompt-input',
        loadComponent: () => import('./demo/prompt-input-demo').then((m) => m.PromptInputDemo),
      },
      {
        path: 'response-stream',
        loadComponent: () =>
          import('./demo/response-stream-demo').then((m) => m.ResponseStreamDemo),
      },
      {
        path: 'loader',
        loadComponent: () => import('./demo/loader-demo').then((m) => m.LoaderDemo),
      },
      {
        path: 'chat-container',
        loadComponent: () =>
          import('./demo/chat-container-demo').then((m) => m.ChatContainerDemo),
      },
      {
        path: 'prompt-suggestion',
        loadComponent: () =>
          import('./demo/prompt-suggestion-demo').then((m) => m.PromptSuggestionDemo),
      },
      {
        path: 'file-upload',
        loadComponent: () =>
          import('./demo/file-upload-demo').then((m) => m.FileUploadDemo),
      },
      {
        path: 'reasoning',
        loadComponent: () => import('./demo/reasoning-demo').then((m) => m.ReasoningDemo),
      },
    ],
  },
];
