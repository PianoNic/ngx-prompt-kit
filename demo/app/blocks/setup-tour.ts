import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideCircle,
  lucideKey,
  lucideRocket,
  lucideUserPlus,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkChatEmptyImports, type ChatEmptySuggestion } from 'ngx-prompt-kit/chat-empty';
import { PkStepsImports } from 'ngx-prompt-kit/steps';

@Component({
  selector: 'app-block-setup-tour',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmButton,
    HlmIconImports,
    PkChatEmptyImports,
    PkStepsImports,
  ],
  providers: [
    provideIcons({ lucideCheck, lucideCircle, lucideKey, lucideRocket, lucideUserPlus }),
  ],
  template: `
    <app-block-page
      title="Onboarding tour"
      description="First-run experience for an AI app: hero with task suggestions and a progress timeline showing what's done and what's still to do. Click any task to mark it complete."
    >
      <app-doc-example title="Hero + checklist" [code]="code">
        <div class="flex w-full flex-col gap-6">
          <pk-chat-empty
            title="Welcome to ngx-prompt-kit"
            subtitle="Three quick steps to get you streaming."
            [suggestions]="suggestions"
            (suggestionPicked)="onPick($event)"
          />

          <div class="mx-auto w-full max-w-md">
            <pk-steps>
              <pk-steps-trigger [leftIcon]="true">
                <ng-icon
                  leftIcon
                  hlm
                  size="xs"
                  [name]="allDone() ? 'lucideCheck' : 'lucideCircle'"
                />
                <span>{{ doneCount() }} of {{ tasks.length }} setup tasks complete</span>
              </pk-steps-trigger>
              <pk-steps-content>
                @for (t of tasks; track t.id) {
                  <pk-steps-item>
                    <button
                      type="button"
                      class="hover:bg-muted -mx-1 flex w-[calc(100%+0.5rem)] items-center justify-between rounded px-1 py-0.5 text-left"
                      (click)="toggle(t.id)"
                    >
                      <span [class.line-through]="completed().has(t.id)">{{ t.label }}</span>
                      <ng-icon
                        hlm
                        size="xs"
                        [class.text-primary]="completed().has(t.id)"
                        [class.text-muted-foreground]="!completed().has(t.id)"
                        [name]="completed().has(t.id) ? 'lucideCheck' : 'lucideCircle'"
                      />
                    </button>
                  </pk-steps-item>
                }
              </pk-steps-content>
            </pk-steps>

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
  protected readonly tasks = [
    { id: 'auth', label: 'Add your API key' },
    { id: 'pick', label: 'Pick a default model' },
    { id: 'invite', label: 'Invite a teammate (optional)' },
  ];

  protected readonly suggestions: ChatEmptySuggestion[] = [
    { label: 'Add your API key', icon: 'lucideKey', prompt: 'auth' },
    { label: 'Pick a default model', icon: 'lucideRocket', prompt: 'pick' },
    { label: 'Invite a teammate', icon: 'lucideUserPlus', prompt: 'invite' },
  ];

  protected readonly completed = signal(new Set<string>());

  protected readonly doneCount = computed(() => this.completed().size);
  protected readonly allDone = computed(() => this.doneCount() === this.tasks.length);

  protected toggle(id: string): void {
    this.completed.update((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  protected onPick(s: ChatEmptySuggestion): void {
    if (s.prompt) this.toggle(s.prompt);
  }

  protected reset(): void {
    this.completed.set(new Set());
  }

  protected readonly code = `<pk-chat-empty
  title="Welcome to ngx-prompt-kit"
  subtitle="Three quick steps to get you streaming."
  [suggestions]="setupSuggestions"
  (suggestionPicked)="onPick($event)"
/>

<pk-steps>
  <pk-steps-trigger [leftIcon]="true">
    <ng-icon leftIcon hlm size="xs"
             [name]="allDone() ? 'lucideCheck' : 'lucideCircle'" />
    <span>{{ doneCount() }} of {{ tasks.length }} setup tasks complete</span>
  </pk-steps-trigger>
  <pk-steps-content>
    @for (t of tasks; track t.id) {
      <pk-steps-item>
        <button type="button" (click)="toggle(t.id)">
          <span [class.line-through]="completed().has(t.id)">{{ t.label }}</span>
          <ng-icon hlm size="xs"
                   [name]="completed().has(t.id) ? 'lucideCheck' : 'lucideCircle'" />
        </button>
      </pk-steps-item>
    }
  </pk-steps-content>
</pk-steps>

// Component
protected readonly tasks = [
  { id: 'auth', label: 'Add your API key' },
  { id: 'pick', label: 'Pick a default model' },
  { id: 'invite', label: 'Invite a teammate (optional)' },
];
protected readonly completed = signal(new Set<string>());
protected readonly doneCount = computed(() => this.completed().size);
protected readonly allDone = computed(() => this.doneCount() === this.tasks.length);

protected toggle(id: string): void {
  this.completed.update(s => {
    const next = new Set(s);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
}`;
}
