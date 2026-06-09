import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideKey,
  lucideRocket,
  lucideUserPlus,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkChatEmptyImports, type ChatEmptySuggestion } from 'ngx-prompt-kit/chat-empty';
import { PkTodoListImports, type PkTodoItem } from 'ngx-prompt-kit/todo-list';

@Component({
  selector: 'app-block-setup-tour',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmButton,
    PkChatEmptyImports,
    PkTodoListImports,
  ],
  providers: [provideIcons({ lucideKey, lucideRocket, lucideUserPlus })],
  template: `
    <app-block-page
      title="Onboarding tour"
      description="First-run experience for an AI app: hero with task suggestions and a pk-todo-list checklist. Click any task to mark it complete; the list auto-collapses when everything is done. The same component works for AI-driven todo plans — model emits items, toggles them as it works."
    >
      <app-doc-example title="Hero + checklist with auto-collapse" [code]="code">
        <div class="flex w-full flex-col gap-6">
          <pk-chat-empty
            title="Welcome to ngx-prompt-kit"
            subtitle="Three quick steps to get you streaming."
            [suggestions]="suggestions"
            (suggestionPicked)="onPick($event)"
          />

          <div class="mx-auto w-full max-w-md">
            <pk-todo-list
              title="setup tasks"
              [items]="items()"
              (toggled)="onToggle($event)"
              (allCompleted)="onAllDone()"
            />

            @if (allDone()) {
              <div class="mt-4 flex justify-center">
                <button hlmBtn type="button" (click)="reset()">Run again</button>
              </div>
            }
          </div>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class SetupTourBlock {
  protected readonly items = signal<PkTodoItem[]>([
    { id: 'auth', label: 'Add your API key' },
    { id: 'pick', label: 'Pick a default model' },
    { id: 'invite', label: 'Invite a teammate', optional: true },
  ]);
  protected readonly allDone = signal(false);

  protected readonly suggestions: ChatEmptySuggestion[] = [
    { label: 'Add your API key', icon: 'lucideKey', prompt: 'auth' },
    { label: 'Pick a default model', icon: 'lucideRocket', prompt: 'pick' },
    { label: 'Invite a teammate', icon: 'lucideUserPlus', prompt: 'invite' },
  ];

  protected onToggle(item: PkTodoItem): void {
    this.items.update((list) =>
      list.map((it) => (it.id === item.id ? { ...it, done: !it.done } : it)),
    );
  }

  protected onPick(s: ChatEmptySuggestion): void {
    if (s.prompt) {
      this.items.update((list) =>
        list.map((it) => (it.id === s.prompt ? { ...it, done: !it.done } : it)),
      );
    }
  }

  protected onAllDone(): void {
    this.allDone.set(true);
  }

  protected reset(): void {
    this.allDone.set(false);
    this.items.update((list) => list.map((it) => ({ ...it, done: false })));
  }

  protected readonly code = `<pk-chat-empty
  title="Welcome to ngx-prompt-kit"
  subtitle="Three quick steps to get you streaming."
  [suggestions]="suggestions"
  (suggestionPicked)="onPick($event)"
/>

<pk-todo-list
  title="setup tasks"
  [items]="items()"
  (toggled)="onToggle($event)"
  (allCompleted)="onAllDone()"
/>

@if (allDone()) {
  <button hlmBtn type="button" (click)="reset()">Run again</button>
}

// Component
protected readonly items = signal<PkTodoItem[]>([
  { id: 'auth', label: 'Add your API key' },
  { id: 'pick', label: 'Pick a default model' },
  { id: 'invite', label: 'Invite a teammate', optional: true },
]);

// Toggle handler — works for both clicks and AI-driven updates
protected onToggle(item: PkTodoItem): void {
  this.items.update(list =>
    list.map(it => it.id === item.id ? { ...it, done: !it.done } : it)
  );
}

// Auto-collapses when allDone hits 100% (autoCollapseWhenDone defaults to true).
// (allCompleted) emits once on the rising edge — wire it to a redirect, a
// confetti burst, or in an agent context to "next step" branching.`;
}
