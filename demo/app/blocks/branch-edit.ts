import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideCopy,
  lucidePencil,
  lucideRefreshCw,
  lucideThumbsDown,
  lucideThumbsUp,
} from '@ng-icons/lucide';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkBranchNavImports } from 'ngx-prompt-kit/branch-nav';
import { PkMessageImports } from 'ngx-prompt-kit/message';
import { PkMessageEdit, PkMessageEditImports } from 'ngx-prompt-kit/message-edit';
import {
  DEFAULT_ASSISTANT_ACTIONS,
  DEFAULT_USER_ACTIONS,
  PkMessageActionsBarImports,
  type MessageAction,
} from 'ngx-prompt-kit/message-actions-bar';

@Component({
  selector: 'app-block-branch-edit',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    PkBranchNavImports,
    PkMessageImports,
    PkMessageEditImports,
    PkMessageActionsBarImports,
  ],
  providers: [
    provideIcons({
      lucideCopy,
      lucidePencil,
      lucideRefreshCw,
      lucideThumbsUp,
      lucideThumbsDown,
    }),
  ],
  template: `
    <app-block-page
      title="Branch navigation + edit"
      description="ChatGPT-style edit-and-regenerate. Edit the user message inline; the assistant has multiple sibling responses you can swap with branch-nav. Both messages have hover-revealed action bars."
    >
      <app-doc-example title="Edit user → swap assistant branches" [code]="code">
        <div class="flex w-full max-w-2xl flex-col gap-4">
          <div class="group flex flex-col items-end gap-1">
            <pk-message class="justify-end">
              <pk-message-edit
                #userEditor
                editTrigger="hidden"
                [content]="userMessage()"
                (saved)="onSaveUser($event)"
              >
                <pk-message-content
                  class="bg-primary text-primary-foreground"
                  [content]="userMessage()"
                />
              </pk-message-edit>
            </pk-message>
            <pk-message-actions-bar
              [actions]="userActions"
              (actionPicked)="onUserAction($event, userEditor)"
            />
          </div>

          <div class="group flex flex-col gap-1">
            <pk-message>
              <pk-message-avatar src="" alt="Assistant" fallback="AI" />
              <pk-message-content [content]="currentBranch()" />
            </pk-message>
            <div class="ml-11 flex flex-wrap items-center justify-between gap-2">
              <pk-branch-nav
                [current]="branchIdx()"
                [total]="branches.length"
                (changed)="branchIdx.set($event)"
              />
              <pk-message-actions-bar
                [actions]="assistantActions()"
                (actionPicked)="onAssistantAction($event)"
              />
            </div>
          </div>

          @if (lastEvent(); as e) {
            <p class="text-muted-foreground text-xs">
              Last event: <span class="text-foreground font-mono">{{ e }}</span>
            </p>
          }
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class BranchEditBlock {
  protected readonly userMessage = signal(
    'Explain the difference between signal() and computed().',
  );

  protected readonly branches = [
    'signal() holds writable state; computed() derives a read-only value from one or more signals and re-evaluates lazily when its dependencies change.',
    "computed() caches its last result and only recomputes when one of the signals it reads from changes. Reading the computed value twice in a row hits the cache.",
    'Think of signal() as a writable cell and computed() as a formula in a spreadsheet — the formula updates automatically when the cells it reads change.',
  ];

  protected readonly branchIdx = signal(1);
  protected readonly currentBranch = computed(
    () => this.branches[this.branchIdx() - 1] ?? this.branches[0],
  );

  protected readonly userActions = DEFAULT_USER_ACTIONS;
  protected readonly thumbsUp = signal(false);
  protected readonly assistantActions = computed<MessageAction[]>(() =>
    DEFAULT_ASSISTANT_ACTIONS.map((a) =>
      a.id === 'thumbs-up' ? { ...a, active: this.thumbsUp() } : a,
    ),
  );

  protected readonly lastEvent = signal<string | null>(null);

  protected onUserAction(action: MessageAction, editor: PkMessageEdit): void {
    this.lastEvent.set('user: ' + action.id);
    if (action.id === 'edit') editor.startEdit();
  }

  protected onSaveUser(next: string): void {
    this.userMessage.set(next);
    this.lastEvent.set('user message edited');
    this.branchIdx.set(1);
  }

  protected onAssistantAction(action: MessageAction): void {
    this.lastEvent.set('assistant: ' + action.id);
    if (action.id === 'thumbs-up') this.thumbsUp.update((v) => !v);
    if (action.id === 'regenerate') {
      this.branchIdx.set(this.branches.length);
    }
  }

  protected readonly code = `<!-- User message: edit-trigger=hidden, programmatically opened from the actions bar -->
<div class="group flex flex-col items-end gap-1">
  <pk-message class="justify-end">
    <pk-message-edit #userEditor editTrigger="hidden"
      [content]="userMessage()" (saved)="onSaveUser($event)">
      <pk-message-content
        class="bg-primary text-primary-foreground"
        [content]="userMessage()"
      />
    </pk-message-edit>
  </pk-message>
  <pk-message-actions-bar
    [actions]="DEFAULT_USER_ACTIONS"
    (actionPicked)="onUserAction($event, userEditor)"
  />
</div>

<!-- Assistant message with sibling branches -->
<div class="group flex flex-col gap-1">
  <pk-message>
    <pk-message-avatar src="" alt="Assistant" fallback="AI" />
    <pk-message-content [content]="currentBranch()" />
  </pk-message>
  <div class="ml-11 flex items-center justify-between gap-2">
    <pk-branch-nav
      [current]="branchIdx()"
      [total]="branches.length"
      (changed)="branchIdx.set($event)"
    />
    <pk-message-actions-bar
      [actions]="assistantActions()"
      (actionPicked)="onAssistantAction($event)"
    />
  </div>
</div>

// Component
protected readonly userMessage = signal('Explain the difference...');
protected readonly branches = ['...', '...', '...'];
protected readonly branchIdx = signal(1);
protected readonly currentBranch = computed(
  () => this.branches[this.branchIdx() - 1]
);

protected onUserAction(action: MessageAction, editor: PkMessageEdit) {
  if (action.id === 'edit') editor.startEdit();
}
protected onSaveUser(next: string) {
  this.userMessage.set(next);
  this.branchIdx.set(1); // reset to the first sibling
}
protected onAssistantAction(action: MessageAction) {
  if (action.id === 'regenerate') {
    this.branchIdx.set(this.branches.length); // pretend a new branch was added
  }
}`;
}
