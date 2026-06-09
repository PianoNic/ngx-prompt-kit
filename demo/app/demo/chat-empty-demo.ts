import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCode,
  lucideFileText,
  lucideLightbulb,
  lucidePencilLine,
} from '@ng-icons/lucide';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkChatEmptyImports, type ChatEmptySuggestion } from 'ngx-prompt-kit/chat-empty';

@Component({
  selector: 'app-chat-empty-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkChatEmptyImports],
  providers: [
    provideIcons({ lucideCode, lucideFileText, lucideLightbulb, lucidePencilLine }),
  ],
  template: `
    <app-doc-page
      title="Chat Empty"
      [original]="true"
      description="Landing state for a chat surface — centered hero with optional subtitle and a responsive grid of suggestion cards."
    >
      <app-doc-example
        title="With suggestions"
        description="Pass a suggestions array to render a 1/2/4-column responsive grid below the hero. (suggestionPicked) emits the picked entry; wire prompt into your input."
        [code]="suggestionsCode"
      >
        <pk-chat-empty
          subtitle="Pick a starting point or just start typing."
          [suggestions]="suggestions"
          (suggestionPicked)="onPick($event)"
        />
        @if (lastPick(); as p) {
          <p class="text-muted-foreground mt-4 text-center text-xs">
            Picked: <span class="text-foreground font-mono">{{ p }}</span>
          </p>
        }
      </app-doc-example>

      <app-doc-example
        title="Hero only"
        description="Omit suggestions for a minimal landing — useful when prompts are surfaced elsewhere (e.g. via prompt-suggestion chips above the input)."
        [code]="heroOnlyCode"
      >
        <pk-chat-empty
          title="Welcome back."
          subtitle="What are we shipping today?"
        />
      </app-doc-example>

      <app-doc-install component="chat-empty" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ChatEmptyDemo {
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

  protected readonly lastPick = signal<string | null>(null);

  protected onPick(s: ChatEmptySuggestion): void {
    this.lastPick.set(s.label);
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkChatEmpty',
      props: [
        {
          name: 'title',
          type: 'string',
          default: '"How can I help today?"',
          description: 'The hero heading.',
        },
        {
          name: 'subtitle',
          type: 'string | undefined',
          description: 'Optional muted line beneath the heading.',
        },
        {
          name: 'suggestions',
          type: 'readonly ChatEmptySuggestion[]',
          default: '[]',
          description:
            'Suggestion cards. Empty array renders just the hero. Each entry: { label, icon?, prompt }.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'suggestionPicked',
          type: '(s: ChatEmptySuggestion) => void',
          description: 'Fires when a suggestion card is clicked. Use s.prompt to prefill the input.',
        },
      ],
    },
  ];

  protected readonly suggestionsCode = `<pk-chat-empty
  subtitle="Pick a starting point or just start typing."
  [suggestions]="suggestions"
  (suggestionPicked)="onPick($event)"
/>`;

  protected readonly heroOnlyCode = `<pk-chat-empty
  title="Welcome back."
  subtitle="What are we shipping today?"
/>`;
}
