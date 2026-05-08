// ngx-prompt-kit original — not part of ibelick/prompt-kit
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  signal,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideChevronDown,
  lucideCircle,
  lucideCircleCheck,
} from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';

export interface PkTodoItem {
  /** Stable identifier emitted with (toggled). */
  id: string;
  /** Visible label. */
  label: string;
  /** Done state. Component is presentational — consumer flips this in their items array. */
  done?: boolean;
  /** Adds a muted "(optional)" suffix after the label. */
  optional?: boolean;
  /** Optional smaller line beneath the label. */
  description?: string;
}

@Component({
  selector: 'pk-todo-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmIconImports],
  providers: [provideIcons({ lucideChevronDown, lucideCircle, lucideCircleCheck })],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <button
      type="button"
      class="hover:bg-muted/40 flex w-full items-center gap-2 px-3 py-2 text-left transition-colors"
      [attr.aria-expanded]="isOpen()"
      (click)="toggleOpen()"
    >
      <ng-icon
        hlm
        size="xs"
        [name]="allDone() ? 'lucideCircleCheck' : 'lucideCircle'"
        [class.text-primary]="allDone()"
        [class.text-muted-foreground]="!allDone()"
      />
      <span class="text-foreground text-sm font-medium">
        {{ doneCount() }} of {{ total() }} {{ title() }} complete
      </span>
      <ng-icon
        hlm
        size="xs"
        name="lucideChevronDown"
        class="text-muted-foreground ml-auto transition-transform duration-200"
        [class.rotate-180]="isOpen()"
      />
    </button>

    @if (isOpen()) {
      <ul class="border-border flex flex-col border-t p-2">
        @for (item of items(); track item.id) {
          <li>
            <button
              type="button"
              class="hover:bg-muted/40 flex w-full items-start gap-2 rounded px-2 py-1.5 text-left transition-colors"
              [attr.aria-pressed]="!!item.done"
              (click)="onItemClick(item)"
            >
              <ng-icon
                hlm
                size="xs"
                class="mt-0.5 shrink-0"
                [name]="item.done ? 'lucideCircleCheck' : 'lucideCircle'"
                [class.text-primary]="item.done"
                [class.text-muted-foreground]="!item.done"
              />
              <span class="flex flex-1 flex-col gap-0.5">
                <span
                  class="text-sm"
                  [class.line-through]="item.done"
                  [class.text-muted-foreground]="item.done"
                >
                  {{ item.label }}@if (item.optional) {
                    <span class="text-muted-foreground"> (optional)</span>
                  }
                </span>
                @if (item.description; as d) {
                  <span class="text-muted-foreground text-xs">{{ d }}</span>
                }
              </span>
            </button>
          </li>
        }
      </ul>
    }
  `,
})
export class PkTodoList {
  /** Items to render. Treat as a controlled prop — flip `done` and pass a fresh array on (toggled). */
  public readonly items = input.required<readonly PkTodoItem[]>();
  /** Word used in the header summary. Defaults to "tasks" → "0 of 3 tasks complete". */
  public readonly title = input<string>('tasks');
  /** Auto-collapse the list when every item is done. Manual header clicks always override. */
  public readonly autoCollapseWhenDone = input<boolean>(true);
  /** Extra classes for the host. */
  public readonly class = input<string>('');

  /** A user clicked an item — consumer updates its items array, optionally calling AI. */
  public readonly toggled = output<PkTodoItem>();
  /** Fires once when the list first reaches 100%. Useful for navigation / next-step triggers. */
  public readonly allCompleted = output<void>();

  /** Manual header override; null = follow auto behavior. */
  private readonly manualOpen = signal<boolean | null>(null);

  protected readonly hostClass = computed(() =>
    cn('border-border bg-background block overflow-hidden rounded-md border', this.class()),
  );

  protected readonly total = computed(() => this.items().length);
  protected readonly doneCount = computed(
    () => this.items().filter((i) => !!i.done).length,
  );
  protected readonly allDone = computed(
    () => this.total() > 0 && this.doneCount() === this.total(),
  );

  /** Effective open state: manual override wins, otherwise collapse-when-done. */
  protected readonly isOpen = computed(() => {
    const manual = this.manualOpen();
    if (manual !== null) return manual;
    return !(this.autoCollapseWhenDone() && this.allDone());
  });

  constructor() {
    // Emit (allCompleted) on the rising edge of allDone(). Effects fire after
    // the first computed evaluation, so the initial-fully-done case is included.
    let prevAllDone = false;
    let firstRun = true;
    effect(() => {
      const now = this.allDone();
      if (firstRun) {
        firstRun = false;
        prevAllDone = now;
        if (now) this.allCompleted.emit();
        return;
      }
      if (now && !prevAllDone) {
        this.allCompleted.emit();
      }
      prevAllDone = now;
    });
  }

  protected toggleOpen(): void {
    this.manualOpen.set(!this.isOpen());
  }

  protected onItemClick(item: PkTodoItem): void {
    this.toggled.emit(item);
  }
}
