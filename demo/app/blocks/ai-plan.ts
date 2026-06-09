import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkSystemMessage } from 'ngx-prompt-kit/system-message';
import { PkThinkingBar } from 'ngx-prompt-kit/thinking-bar';
import { PkTodoListImports, type PkTodoItem } from 'ngx-prompt-kit/todo-list';

interface PlannedTodo extends PkTodoItem {
  /** Simulated time the agent spends on this step. */
  durationMs: number;
}

const PLAN: PlannedTodo[] = [
  { id: 'fetch', label: 'Fetch the open issue list', durationMs: 900 },
  { id: 'group', label: 'Group issues by label and priority', durationMs: 1100 },
  { id: 'draft', label: 'Draft the weekly status update', durationMs: 1300 },
  { id: 'post', label: 'Post the update to #engineering', durationMs: 800 },
];

@Component({
  selector: 'app-block-ai-plan',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmButton,
    PkSystemMessage,
    PkThinkingBar,
    PkTodoListImports,
  ],
  template: `
    <app-block-page
      title="AI-driven plan"
      description="The agent emits a todo list, then walks it. The thinking bar narrates the active step; pk-todo-list ticks each item off as it lands. The user can also click items to override the agent. Once everything is done the list auto-collapses."
    >
      <app-doc-example title="Agent plans → executes → checks off" [code]="code">
        <div class="mx-auto flex w-full max-w-md flex-col gap-3">
          @if (state() === 'planning' || state() === 'executing') {
            <pk-thinking-bar
              [text]="currentLabel()"
              stopLabel="Stop"
              [showStop]="true"
              (stopped)="stop()"
            />
          }

          @if (state() === 'done') {
            <pk-system-message
              text="Plan complete. Update posted."
              variant="action"
              [fill]="false"
            />
          }

          @if (items().length > 0) {
            <pk-todo-list
              title="plan steps"
              [items]="items()"
              (toggled)="onUserToggle($event)"
              (allCompleted)="onAllDone()"
            />
          }

          <div class="flex justify-end gap-2">
            <button hlmBtn variant="outline" size="sm" type="button" (click)="reset()">
              Reset
            </button>
            @if (state() === 'idle' && items().length > 0) {
              <button hlmBtn size="sm" type="button" (click)="run()">
                Run agent
              </button>
            }
          </div>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class AiPlanBlock {
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private timer: ReturnType<typeof setTimeout> | null = null;

  protected readonly items = signal<PkTodoItem[]>([]);
  protected readonly activeId = signal<string | null>(null);
  protected readonly state = signal<'idle' | 'planning' | 'executing' | 'done'>('idle');

  protected readonly currentLabel = computed(() => {
    if (this.state() === 'planning') return 'Drafting the plan…';
    const id = this.activeId();
    if (!id) return 'Working…';
    const item = this.items().find((it) => it.id === id);
    return item ? item.label : 'Working…';
  });

  constructor() {
    this.destroyRef.onDestroy(() => this.cancelTimer());
    if (this.isBrowser) {
      // Auto-start so the block looks alive when the user lands on it.
      this.timer = setTimeout(() => this.run(), 400);
    }
  }

  protected run(): void {
    if (!this.isBrowser) return;
    this.cancelTimer();
    this.state.set('planning');
    this.activeId.set(null);
    this.items.set([]);

    // Phase 1 — agent emits the plan, one item at a time.
    let i = 0;
    const emitNext = (): void => {
      if (i >= PLAN.length) {
        this.state.set('executing');
        this.runStep(0);
        return;
      }
      const next = PLAN[i++];
      this.items.update((list) => [...list, { ...next, done: false }]);
      this.timer = setTimeout(emitNext, 350);
    };
    this.timer = setTimeout(emitNext, 400);
  }

  /** Phase 2 — flip each item to done with a per-step delay. */
  private runStep(index: number): void {
    if (this.state() !== 'executing') return;
    if (index >= PLAN.length) {
      this.activeId.set(null);
      this.state.set('done');
      return;
    }
    const step = PLAN[index];
    this.activeId.set(step.id);
    this.timer = setTimeout(() => {
      this.items.update((list) =>
        list.map((it) => (it.id === step.id ? { ...it, done: true } : it)),
      );
      this.runStep(index + 1);
    }, step.durationMs);
  }

  protected onUserToggle(item: PkTodoItem): void {
    // Manual override — flip the item without disturbing the agent's progress.
    this.items.update((list) =>
      list.map((it) => (it.id === item.id ? { ...it, done: !it.done } : it)),
    );
  }

  protected onAllDone(): void {
    this.state.set('done');
    this.activeId.set(null);
  }

  protected stop(): void {
    this.cancelTimer();
    this.state.set('idle');
    this.activeId.set(null);
  }

  protected reset(): void {
    this.cancelTimer();
    this.state.set('idle');
    this.activeId.set(null);
    this.items.set([]);
  }

  private cancelTimer(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }

  protected readonly code = `// AI-driven plan: model emits a todo list, walks it, and the user can intervene.

@if (state() === 'planning' || state() === 'executing') {
  <pk-thinking-bar
    [text]="currentLabel()"
    stopLabel="Stop"
    [showStop]="true"
    (stopped)="stop()"
  />
}

@if (items().length > 0) {
  <pk-todo-list
    title="plan steps"
    [items]="items()"
    (toggled)="onUserToggle($event)"
    (allCompleted)="onAllDone()"
  />
}

// Component
const PLAN = [
  { id: 'fetch', label: 'Fetch the open issue list', durationMs: 900 },
  { id: 'group', label: 'Group by label and priority', durationMs: 1100 },
  { id: 'draft', label: 'Draft the weekly status update', durationMs: 1300 },
  { id: 'post',  label: 'Post the update to #engineering', durationMs: 800 },
];

protected readonly items = signal<PkTodoItem[]>([]);
protected readonly state = signal<'idle' | 'planning' | 'executing' | 'done'>('idle');

protected run(): void {
  this.state.set('planning');
  // Phase 1 — agent emits each plan item with a small delay
  let i = 0;
  const emit = () => {
    if (i >= PLAN.length) {
      this.state.set('executing');
      this.runStep(0);
      return;
    }
    this.items.update(list => [...list, { ...PLAN[i++], done: false }]);
    setTimeout(emit, 350);
  };
  setTimeout(emit, 400);
}

private runStep(index: number): void {
  if (index >= PLAN.length) { this.state.set('done'); return; }
  const step = PLAN[index];
  setTimeout(() => {
    this.items.update(list =>
      list.map(it => it.id === step.id ? { ...it, done: true } : it)
    );
    this.runStep(index + 1);
  }, step.durationMs);
}

// User can also override the agent
protected onUserToggle(item: PkTodoItem): void {
  this.items.update(list =>
    list.map(it => it.id === item.id ? { ...it, done: !it.done } : it)
  );
}`;
}
