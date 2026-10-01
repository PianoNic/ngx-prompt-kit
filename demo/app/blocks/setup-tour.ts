import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideKey, lucideRocket, lucideUserPlus } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card';
import { HlmEmptyImports } from '@spartan-ng/helm/empty';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkTodoListImports, type PkTodoItem } from 'ngx-prompt-kit/todo-list';

interface Suggestion {
  label: string;
  icon: string;
  /** Id of the setup task the card ticks off. */
  task: string;
}

@Component({
  selector: 'app-block-setup-tour',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmButton,
    HlmCard,
    HlmCardContent,
    HlmEmptyImports,
    NgIcon,
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
          <hlm-empty class="p-0">
            <hlm-empty-header>
              <h2 hlmEmptyTitle class="text-3xl font-medium tracking-tight">
                Welcome to ngx-prompt-kit
              </h2>
              <p hlmEmptyDescription>Three quick steps to get you streaming.</p>
            </hlm-empty-header>
            <hlm-empty-content class="max-w-3xl flex-row flex-wrap justify-center gap-3">
              @for (s of suggestions; track s.label) {
                <button
                  type="button"
                  (click)="onPick(s)"
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

  protected readonly suggestions: Suggestion[] = [
    { label: 'Add your API key', icon: 'lucideKey', task: 'auth' },
    { label: 'Pick a default model', icon: 'lucideRocket', task: 'pick' },
    { label: 'Invite a teammate', icon: 'lucideUserPlus', task: 'invite' },
  ];

  protected onToggle(item: PkTodoItem): void {
    this.items.update((list) =>
      list.map((it) => (it.id === item.id ? { ...it, done: !it.done } : it)),
    );
  }

  protected onPick(s: Suggestion): void {
    this.items.update((list) =>
      list.map((it) => (it.id === s.task ? { ...it, done: !it.done } : it)),
    );
  }

  protected onAllDone(): void {
    this.allDone.set(true);
  }

  protected reset(): void {
    this.allDone.set(false);
    this.items.update((list) => list.map((it) => ({ ...it, done: false })));
  }

  protected readonly code = `<!-- spartan empty state with a card per task -->
<hlm-empty>
  <hlm-empty-header>
    <h2 hlmEmptyTitle>Welcome to ngx-prompt-kit</h2>
    <p hlmEmptyDescription>Three quick steps to get you streaming.</p>
  </hlm-empty-header>
  <hlm-empty-content class="flex-row flex-wrap justify-center gap-3">
    @for (s of suggestions; track s.label) {
      <button type="button" (click)="onPick(s)" class="text-left">
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
