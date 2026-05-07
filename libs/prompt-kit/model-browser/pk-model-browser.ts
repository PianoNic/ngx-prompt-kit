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
import { lucideSearch } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';
import {
  type BrowserFilter,
  type BrowserModel,
  formatBrowserPrice,
} from './pk-model-browser-types';

@Component({
  selector: 'pk-model-browser',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmBadge, HlmIconImports],
  providers: [provideIcons({ lucideSearch })],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <div class="border-border flex min-h-0 flex-col border-r md:w-[55%] md:border-b-0 md:border-r">
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
      @if (filters().length > 0) {
        <div class="border-border flex flex-wrap gap-1.5 border-b px-3 py-2">
          @for (f of filters(); track f.id) {
            <button type="button" (click)="toggleFilter(f.id)" [class]="filterChipClass(f)">
              {{ f.label }}
            </button>
          }
        </div>
      }
      <div class="flex flex-1 flex-col overflow-y-auto py-1">
        @for (group of grouped(); track group.label) {
          @if (group.label) {
            <p
              class="text-muted-foreground px-3 pt-3 pb-1 text-xs font-medium uppercase tracking-wider"
            >
              {{ group.label }}
            </p>
          }
          @for (m of group.items; track m.id) {
            <button
              type="button"
              [disabled]="m.disabled === true"
              (click)="select(m)"
              [class]="rowClass(m)"
            >
              @if (m.iconUrl; as src) {
                <img
                  [src]="src"
                  [alt]="m.name + ' icon'"
                  class="border-border h-7 w-7 shrink-0 rounded-full border bg-white object-cover p-0.5"
                />
              } @else {
                <span
                  class="bg-muted border-border text-muted-foreground flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-[10px] font-medium uppercase"
                  aria-hidden="true"
                >
                  {{ initials(m.name) }}
                </span>
              }
              <div class="flex min-w-0 flex-col">
                <span class="text-foreground truncate text-sm font-medium">{{ m.name }}</span>
                @if (m.provider; as p) {
                  <span class="text-muted-foreground truncate text-xs">{{ p }}</span>
                }
              </div>
            </button>
          }
        }
        @if (filtered().length === 0) {
          <p class="text-muted-foreground px-3 py-6 text-center text-xs">
            No models match your filters.
          </p>
        }
      </div>
    </div>

    <div class="hidden flex-col p-4 md:flex md:w-[45%]">
      @if (selected(); as s) {
        <div class="flex items-center gap-3">
          @if (s.iconUrl; as src) {
            <img
              [src]="src"
              [alt]="s.name + ' icon'"
              class="border-border h-10 w-10 shrink-0 rounded-full border bg-white object-cover p-1"
            />
          } @else {
            <span
              class="bg-muted border-border text-muted-foreground flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-medium uppercase"
              aria-hidden="true"
            >
              {{ initials(s.name) }}
            </span>
          }
          <div class="min-w-0">
            <h3 class="text-foreground truncate text-base font-semibold">{{ s.name }}</h3>
            @if (s.provider; as p) {
              <p class="text-muted-foreground truncate text-xs">{{ p }}</p>
            }
          </div>
        </div>
        @if (s.description; as d) {
          <p class="text-muted-foreground mt-3 text-sm leading-relaxed">{{ d }}</p>
        }
        <div class="mt-4 flex flex-col">
          @if (priceLine(s); as price) {
            <div
              class="border-border flex items-center justify-between gap-3 border-t py-3 text-sm"
            >
              <span class="text-muted-foreground">Pricing</span>
              <span class="text-foreground tabular-nums">{{ price }}</span>
            </div>
          }
          @if (s.metrics?.length) {
            @for (metric of s.metrics; track metric.label) {
              <div
                class="border-border flex items-center justify-between gap-3 border-t py-3 text-sm"
              >
                <span class="text-muted-foreground">{{ metric.label }}</span>
                <span class="text-foreground tabular-nums">{{ metric.value }}</span>
              </div>
            }
          }
        </div>
        @if (selectable()) {
          <button
            type="button"
            (click)="confirm()"
            class="bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
            {{ selectLabel() }}
          </button>
        }
      } @else {
        <p class="text-muted-foreground self-center justify-self-center text-sm italic">
          Pick a model on the left to see its details.
        </p>
      }
    </div>
  `,
})
export class PkModelBrowser {
  public readonly models = input.required<readonly BrowserModel[]>();
  public readonly selectedId = model<string | null>(null);
  public readonly filters = model<readonly BrowserFilter[]>([]);
  public readonly searchPlaceholder = input<string>('Search models');
  public readonly selectable = input<boolean>(true);
  public readonly selectLabel = input<string>('Use this model');
  public readonly locale = input<string | undefined>(undefined);
  public readonly class = input<string>('');

  public readonly changed = output<BrowserModel>();

  protected readonly query = signal('');

  protected readonly hostClass = computed(() =>
    cn(
      'border-border bg-background flex w-full flex-col overflow-hidden rounded-md border md:flex-row md:h-[480px]',
      this.class(),
    ),
  );

  protected readonly activeFilterIds = computed(
    () =>
      new Set(
        this.filters()
          .filter((f) => f.active === true)
          .map((f) => f.id),
      ),
  );

  protected readonly filtered = computed<readonly BrowserModel[]>(() => {
    const q = this.query().trim().toLowerCase();
    const active = this.activeFilterIds();
    return this.models().filter((m) => {
      if (q) {
        const haystack =
          `${m.name} ${m.provider ?? ''} ${m.group ?? ''} ${m.description ?? ''}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      if (active.size > 0) {
        // Filter convention: active filter id must match either the model.group
        // or one of the metric labels. Consumer drives semantics — kit just
        // intersects on the values.
        const hits = m.group ? [m.group] : [];
        const hasHit = hits.some((h) => active.has(h));
        if (!hasHit) return false;
      }
      return true;
    });
  });

  protected readonly grouped = computed<ReadonlyArray<{ label: string; items: BrowserModel[] }>>(
    () => {
      const list = this.filtered();
      const grouped = new Map<string, BrowserModel[]>();
      for (const m of list) {
        const key = m.group ?? '';
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(m);
      }
      return Array.from(grouped.entries()).map(([label, items]) => ({ label, items }));
    },
  );

  protected readonly selected = computed<BrowserModel | null>(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.models().find((m) => m.id === id) ?? null;
  });

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected toggleFilter(id: string): void {
    this.filters.update((list) => list.map((f) => (f.id === id ? { ...f, active: !f.active } : f)));
  }

  protected select(m: BrowserModel): void {
    if (m.disabled === true) return;
    this.selectedId.set(m.id);
  }

  protected confirm(): void {
    const s = this.selected();
    if (!s) return;
    this.changed.emit(s);
  }

  protected rowClass(m: BrowserModel): string {
    return cn(
      'flex items-center gap-3 px-3 py-2 text-left transition-colors',
      m.disabled === true
        ? 'opacity-50 cursor-not-allowed'
        : 'hover:bg-accent focus-visible:bg-accent focus-visible:outline-none',
      m.id === this.selectedId() ? 'bg-accent/60' : '',
    );
  }

  protected filterChipClass(f: BrowserFilter): string {
    return cn(
      'rounded-md border px-2 py-1 text-xs transition-colors',
      f.active
        ? 'bg-primary text-primary-foreground border-primary'
        : 'bg-background border-border text-foreground hover:bg-accent',
    );
  }

  protected priceLine(m: BrowserModel): string | null {
    if (typeof m.inputPricePer1M !== 'number' || typeof m.outputPricePer1M !== 'number') {
      return null;
    }
    const currency = m.currency ?? 'USD';
    const inPrice = formatBrowserPrice(m.inputPricePer1M, currency, this.locale());
    const outPrice = formatBrowserPrice(m.outputPricePer1M, currency, this.locale());
    return `${inPrice} / ${outPrice} per 1M`;
  }

  protected initials(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) return '?';
    const first = trimmed[0];
    const second = trimmed.split(/[\s/:_-]+/)[1]?.[0] ?? '';
    return (first + second).toUpperCase().slice(0, 2);
  }
}
