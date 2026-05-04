// ngx-prompt-kit original — not part of ibelick/prompt-kit
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideSearch } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';
import type { Model } from './pk-model-list-types';

@Component({
  selector: 'pk-model-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmIconImports],
  providers: [provideIcons({ lucideCheck, lucideSearch })],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    @if (showSearch()) {
      <div class="border-border flex items-center gap-2 border-b px-3 py-2">
        <ng-icon hlm size="xs" name="lucideSearch" class="text-muted-foreground shrink-0" />
        <input
          type="text"
          [value]="query()"
          (input)="onSearch($event)"
          [placeholder]="searchPlaceholder()"
          class="text-foreground placeholder:text-muted-foreground w-full bg-transparent text-sm outline-none"
          aria-label="Search models"
        />
      </div>
    }
    <div class="flex max-h-80 flex-col overflow-y-auto py-1">
      @for (m of filtered(); track m.id) {
        <button
          type="button"
          [disabled]="m.disabled === true"
          (click)="pick(m)"
          [class]="rowClass(m)"
        >
          @if (m.iconUrl; as src) {
            <img
              [src]="src"
              [alt]="m.name + ' icon'"
              class="border-border h-6 w-6 shrink-0 rounded-full border bg-white object-cover p-0.5"
            />
          } @else {
            <span
              class="bg-muted border-border text-muted-foreground flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium uppercase"
              aria-hidden="true"
            >
              {{ initials(m.name) }}
            </span>
          }
          <span class="text-foreground min-w-0 truncate text-sm font-medium">{{ m.name }}</span>
          @if (m.tagline; as t) {
            <span class="text-muted-foreground text-xs tabular-nums">{{ t }}</span>
          }
          <span class="ml-auto"></span>
          @if (m.id === selectedId()) {
            <ng-icon hlm size="xs" name="lucideCheck" class="text-primary shrink-0" />
          }
        </button>
      }
      @if (filtered().length === 0) {
        <p class="text-muted-foreground px-3 py-6 text-center text-xs">
          No models match "{{ query() }}".
        </p>
      }
    </div>
  `,
})
export class PkModelList {
  public readonly models = input.required<readonly Model[]>();
  public readonly selectedId = model<string | null>(null);
  public readonly showSearch = input<boolean>(true);
  public readonly searchPlaceholder = input<string>('Search models');
  public readonly class = input<string>('');

  public readonly changed = output<Model>();

  protected readonly query = signal('');

  protected readonly hostClass = computed(() =>
    cn('border-border bg-background flex w-full flex-col rounded-md border', this.class()),
  );

  protected readonly filtered = computed<readonly Model[]>(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.models();
    return this.models().filter((m) => {
      const haystack = `${m.name} ${m.provider ?? ''} ${m.tagline ?? ''}`.toLowerCase();
      return haystack.includes(q);
    });
  });

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected pick(m: Model): void {
    if (m.disabled === true) return;
    this.selectedId.set(m.id);
    this.changed.emit(m);
  }

  protected rowClass(m: Model): string {
    return cn(
      'flex items-center gap-2 px-3 py-2 text-left transition-colors',
      m.disabled === true
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:bg-accent focus-visible:bg-accent focus-visible:outline-none',
      m.id === this.selectedId() ? 'bg-accent/60' : '',
    );
  }

  protected initials(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) return '?';
    const first = trimmed[0];
    const second = trimmed.split(/[\s/:_-]+/)[1]?.[0] ?? '';
    return (first + second).toUpperCase().slice(0, 2);
  }
}
