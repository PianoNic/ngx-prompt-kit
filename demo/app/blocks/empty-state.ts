import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideArrowUp,
  lucideCode,
  lucideFileText,
  lucideLightbulb,
  lucidePencilLine,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkPromptSuggestion } from 'ngx-prompt-kit/prompt-suggestion';

interface Suggestion {
  label: string;
  /** Lucide icon name, registered with provideIcons(). */
  icon: string;
  /** Text put in the input when the card is picked. */
  prompt: string;
}

@Component({
  selector: 'app-block-empty-state',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmEmptyImports,
    HlmInputGroupImports,
    HlmTooltip,
    NgIcon,
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
          <hlm-empty class="w-full p-0">
            <hlm-empty-header>
              <h2 hlmEmptyTitle class="text-3xl font-medium tracking-tight">
                How can I help today?
              </h2>
              <p hlmEmptyDescription>Pick a starting point or just start typing.</p>
            </hlm-empty-header>
            <hlm-empty-content class="max-w-3xl flex-row flex-wrap justify-center gap-3">
              @for (s of suggestions; track s.label) {
                <button
                  type="button"
                  (click)="prefill(s.prompt)"
                  class="basis-full text-left sm:basis-[calc(50%-0.375rem)] lg:basis-[170px]"
                >
                  <div hlmCard class="hover:bg-accent h-full transition-colors">
                    <div hlmCardContent class="flex flex-col gap-2">
                      <ng-icon
                        [name]="s.icon"
                        class="text-[length:--spacing(4)] text-muted-foreground"
                      />
                      <span class="text-foreground text-sm font-medium leading-snug">
                        {{ s.label }}
                      </span>
                    </div>
                  </div>
                </button>
              }
            </hlm-empty-content>
          </hlm-empty>

          <div class="flex w-full max-w-2xl flex-col gap-3">
            <div class="flex flex-wrap justify-center gap-2">
              @for (q of quickPrompts; track q) {
                <pk-prompt-suggestion [content]="q" (clicked)="prefill(q)" />
              }
            </div>

            <div hlmInputGroup class="rounded-3xl">
              <textarea
                hlmInputGroupTextarea
                class="max-h-60 px-4 pt-3"
                placeholder="Ask anything..."
                aria-label="Message"
                [value]="value()"
                (input)="value.set($any($event.target).value)"
                (keydown.enter)="onEnter($event)"
              ></textarea>
              <div hlmInputGroupAddon align="block-end" class="justify-end px-3 pb-3">
                <button
                  hlmBtn
                  size="icon-sm"
                  type="button"
                  class="rounded-full"
                  hlmTooltip="Send"
                  (click)="onSubmit()"
                  aria-label="Send"
                >
                  <ng-icon name="lucideArrowUp" class="text-[length:--spacing(3)]" />
                </button>
              </div>
            </div>

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

  protected readonly suggestions: Suggestion[] = [
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

  protected onEnter(event: Event): void {
    if ((event as KeyboardEvent).shiftKey) return;
    event.preventDefault();
    this.onSubmit();
  }

  protected onSubmit(): void {
    const v = this.value().trim();
    if (!v) return;
    this.lastSent.set(v);
    this.value.set('');
  }

  protected readonly code = `<!-- spartan empty state with suggestion cards -->
<hlm-empty>
  <hlm-empty-header>
    <h2 hlmEmptyTitle>How can I help today?</h2>
    <p hlmEmptyDescription>Pick a starting point or just start typing.</p>
  </hlm-empty-header>
  <hlm-empty-content class="flex-row flex-wrap justify-center gap-3">
    @for (s of suggestions; track s.label) {
      <button type="button" (click)="prefill(s.prompt)" class="text-left">
        <div hlmCard class="hover:bg-accent h-full">
          <div hlmCardContent class="flex flex-col gap-2">
            <ng-icon [name]="s.icon" />
            <span class="text-sm font-medium">{{ s.label }}</span>
          </div>
        </div>
      </button>
    }
  </hlm-empty-content>
</hlm-empty>

<div class="flex flex-wrap justify-center gap-2">
  @for (q of quickPrompts; track q) {
    <pk-prompt-suggestion [content]="q" (clicked)="prefill(q)" />
  }
</div>

<!-- spartan input-group: textarea plus a block-end addon -->
<div hlmInputGroup class="rounded-3xl">
  <textarea
    hlmInputGroupTextarea
    placeholder="Ask anything..."
    [value]="value()"
    (input)="value.set($any($event.target).value)"
    (keydown.enter)="onEnter($event)"
  ></textarea>
  <div hlmInputGroupAddon align="block-end" class="justify-end">
    <button hlmBtn size="icon-sm" class="rounded-full" hlmTooltip="Send" (click)="onSubmit()">
      <ng-icon name="lucideArrowUp" class="text-[length:--spacing(3)]" />
    </button>
  </div>
</div>

// In the component
protected readonly value = signal('');
protected readonly suggestions = [
  { label: 'Draft release notes...', icon: 'lucideFileText', prompt: '...' },
  // ...
];
protected readonly quickPrompts = ['Summarise', 'Translate', 'Shorter'];
protected prefill(p: string) { this.value.set(p); }
protected onEnter(event: Event) {
  if ((event as KeyboardEvent).shiftKey) return; // Shift+Enter adds a line
  event.preventDefault();
  this.onSubmit();
}
protected onSubmit() {
  const v = this.value().trim();
  if (!v) return;
  this.value.set('');
}`;
}
