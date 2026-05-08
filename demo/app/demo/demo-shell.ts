import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-demo-shell',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  template: `
    <div class="flex min-h-screen">
      <aside class="w-56 border-r border-border p-4 space-y-1 text-sm">
        <h1 class="font-semibold mb-3">ngx-prompt-kit</h1>
        @for (l of links; track l.path) {
          <a
            [routerLink]="l.path"
            routerLinkActive="bg-accent text-accent-foreground"
            class="block rounded px-2 py-1 hover:bg-muted"
            >{{ l.label }}</a
          >
        }
      </aside>
      <main class="flex-1 p-6 overflow-auto">
        <router-outlet />
      </main>
    </div>
  `,
})
export class DemoShell {
  protected readonly links = [
    { path: 'message', label: 'Message' },
    { path: 'markdown', label: 'Markdown' },
    { path: 'code-block', label: 'Code Block' },
    { path: 'prompt-input', label: 'Prompt Input' },
    { path: 'response-stream', label: 'Response Stream' },
    { path: 'loader', label: 'Loader' },
    { path: 'chat-container', label: 'Chat Container' },
    { path: 'prompt-suggestion', label: 'Prompt Suggestion' },
    { path: 'file-upload', label: 'File Upload' },
    { path: 'reasoning', label: 'Reasoning' },
  ];
}
