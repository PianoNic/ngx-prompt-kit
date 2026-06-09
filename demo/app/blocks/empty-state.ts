import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUp,
  lucideCode,
  lucideFileText,
  lucideLightbulb,
  lucidePencilLine,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkChatEmptyImports, type ChatEmptySuggestion } from 'ngx-prompt-kit/chat-empty';
import { PkPromptInputImports } from 'ngx-prompt-kit/prompt-input';
import { PkPromptSuggestion } from 'ngx-prompt-kit/prompt-suggestion';

@Component({
  selector: 'app-block-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmButton,
    HlmIconImports,
    PkChatEmptyImports,
    PkPromptInputImports,
    PkPromptSuggestion,
  ],
  providers: [
    provideIcons({
      lucideArrowUp,
      lucideCode,
      lucideFileText,
      lucideLightbulb,
      lucidePencilLine,
    }),
  ],
  template: `
    <app-block-page
      title="Empty-state onboarding"
      description="The 'first message' surface every chat app needs. A hero with suggestion cards, plus a row of pill chips above a working prompt input. Picking a card or chip pre-fills the input."
    >
      <app-doc-example title="Onboarding hero with prefill" [code]="code">
        <div class="flex w-full flex-col items-center gap-8">
          <pk-chat-empty
            subtitle="Pick a starting point or just start typing."
            [suggestions]="suggestions"
            (suggestionPicked)="prefill($event.prompt)"
            class="w-full"
          />

          <div class="flex w-full max-w-2xl flex-col gap-3">
            <div class="flex flex-wrap justify-center gap-2">
              @for (q of quickPrompts; track q) {
                <pk-prompt-suggestion [content]="q" (clicked)="prefill(q)" />
              }
            </div>

            <pk-prompt-input [(value)]="value" (submitted)="onSubmit()">
              <pk-prompt-input-textarea placeholder="Ask anything..." />
              <pk-prompt-input-actions class="mt-2 justify-end">
                <pk-prompt-input-action tooltip="Send">
                  <button
                    hlmBtn
                    size="icon-sm"
                    type="button"
                    class="rounded-full"
                    (click)="onSubmit()"
                    aria-label="Send"
                  >
                    <ng-icon hlm size="xs" name="lucideArrowUp" />
                  </button>
                </pk-prompt-input-action>
              </pk-prompt-input-actions>
            </pk-prompt-input>

            @if (lastSent(); as msg) {
              <p class="text-muted-foreground text-center text-xs">
                Sent: <span class="text-foreground font-mono">{{ msg }}</span>
              </p>
            }
          </div>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class EmptyStateBlock {
  protected readonly value = signal('');
  protected readonly lastSent = signal<string | null>(null);

  protected readonly suggestions: ChatEmptySuggestion[] = [
    {
      label: 'Draft release notes from the latest commit log',
      icon: 'lucideFileText',
      prompt: 'Group the latest commits into release notes by feature, fix, and chore.',
    },
    {
      label: 'Explain a snippet of code line by line',
      icon: 'lucideCode',
      prompt: 'Walk me through this code snippet line by line.',
    },
    {
      label: 'Brainstorm names for a new feature',
      icon: 'lucideLightbulb',
      prompt: 'Brainstorm five product names for a feature that...',
    },
    {
      label: 'Polish a paragraph for clarity and tone',
      icon: 'lucidePencilLine',
      prompt: 'Tighten this paragraph for clarity and a confident tone.',
    },
  ];

  protected readonly quickPrompts = [
    'Summarise this thread',
    'Translate to French',
    'Make it shorter',
    'Add tests',
  ];

  protected prefill(prompt: string): void {
    this.value.set(prompt);
  }

  protected onSubmit(): void {
    const v = this.value().trim();
    if (!v) return;
    this.lastSent.set(v);
    this.value.set('');
  }

  protected readonly code = `<pk-chat-empty
  subtitle="Pick a starting point or just start typing."
  [suggestions]="suggestions"
  (suggestionPicked)="prefill($event.prompt)"
/>

<div class="flex flex-wrap justify-center gap-2">
  @for (q of quickPrompts; track q) {
    <pk-prompt-suggestion [content]="q" (clicked)="prefill(q)" />
  }
</div>

<pk-prompt-input [(value)]="value" (submitted)="onSubmit()">
  <pk-prompt-input-textarea placeholder="Ask anything..." />
  <pk-prompt-input-actions class="mt-2 justify-end">
    <pk-prompt-input-action tooltip="Send">
      <button hlmBtn size="icon-sm" class="rounded-full" (click)="onSubmit()">
        <ng-icon hlm size="xs" name="lucideArrowUp" />
      </button>
    </pk-prompt-input-action>
  </pk-prompt-input-actions>
</pk-prompt-input>

// In the component
protected readonly value = signal('');
protected readonly suggestions: ChatEmptySuggestion[] = [
  { label: 'Draft release notes...', icon: 'lucideFileText', prompt: '...' },
  // ...
];
protected readonly quickPrompts = ['Summarise', 'Translate', 'Shorter'];
protected prefill(p: string) { this.value.set(p); }
protected onSubmit() {
  const v = this.value().trim();
  if (!v) return;
  this.value.set('');
}`;
}
