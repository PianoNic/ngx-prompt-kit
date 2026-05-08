// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input, model, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideCheck, lucideChevronDown } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmDropdownMenu,
  HlmDropdownMenuItem,
  HlmDropdownMenuTrigger,
} from '@spartan-ng/helm/dropdown-menu';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';
import { formatModelPrice, type Model, type ModelTier } from './pk-model-types';

@Component({
  selector: 'pk-model-picker',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HlmBadge,
    HlmButton,
    HlmDropdownMenu,
    HlmDropdownMenuItem,
    HlmDropdownMenuTrigger,
    HlmIconImports,
  ],
  providers: [provideIcons({ lucideCheck, lucideChevronDown })],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <button
      hlmBtn
      variant="outline"
      [size]="compact() ? 'sm' : 'default'"
      type="button"
      [hlmDropdownMenuTrigger]="menu"
      class="justify-between gap-2"
    >
      <span class="flex items-center gap-2">
        @if (selected(); as s) {
          @if (s.iconUrl; as src) {
            <img
              [src]="src"
              [alt]="s.name + ' icon'"
              class="h-4 w-4 shrink-0 rounded-sm object-contain dark:invert"
            />
          }
          <span class="text-foreground">{{ s.name }}</span>
          @if (!compact() && s.tier; as t) {
            <span hlmBadge [class]="tierBadgeClass(t)">{{ t }}</span>
          }
        } @else {
          <span class="text-muted-foreground">{{ placeholder() }}</span>
        }
      </span>
      <ng-icon hlm size="xs" name="lucideChevronDown" class="text-muted-foreground" />
    </button>

    <ng-template #menu>
      <hlm-dropdown-menu class="min-w-[280px]">
        @for (m of models(); track m.id) {
          <button
            hlmDropdownMenuItem
            type="button"
            [disabled]="m.disabled === true"
            (triggered)="pick(m)"
            class="flex-col items-start gap-0.5 py-2"
          >
            <div class="flex w-full items-center justify-between gap-2">
              <span class="flex min-w-0 items-center gap-2">
                @if (m.id === selectedId()) {
                  <ng-icon hlm size="xs" name="lucideCheck" class="text-primary shrink-0" />
                } @else {
                  <span class="w-3 shrink-0" aria-hidden="true"></span>
                }
                @if (m.iconUrl; as src) {
                  <img
                    [src]="src"
                    [alt]="m.name + ' icon'"
                    class="h-4 w-4 shrink-0 rounded-sm object-contain dark:invert"
                  />
                }
                <span class="text-foreground font-medium">{{ m.name }}</span>
                @if (m.provider; as p) {
                  <span class="text-muted-foreground text-xs">{{ p }}</span>
                }
              </span>
              @if (m.tier; as t) {
                <span hlmBadge [class]="tierBadgeClass(t)">{{ t }}</span>
              }
            </div>
            @if (m.tagline; as t) {
              <span class="text-muted-foreground pl-8 text-xs">{{ t }}</span>
            }
            @if (priceLine(m); as price) {
              <span class="text-muted-foreground pl-8 text-xs tabular-nums">{{ price }}</span>
            }
          </button>
        }
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class PkModelPicker {
  public readonly models = input.required<readonly Model[]>();
  public readonly selectedId = model<string | null>(null);
  public readonly placeholder = input<string>('Select model');
  public readonly compact = input<boolean>(false);
  public readonly locale = input<string | undefined>(undefined);
  public readonly class = input<string>('');

  public readonly changed = output<Model>();

  protected readonly hostClass = computed(() => cn('inline-block', this.class()));

  protected readonly selected = computed<Model | null>(() => {
    const id = this.selectedId();
    if (!id) return null;
    return this.models().find((m) => m.id === id) ?? null;
  });

  protected pick(m: Model): void {
    if (m.disabled === true) return;
    this.selectedId.set(m.id);
    this.changed.emit(m);
  }

  protected tierBadgeClass(tier: ModelTier): string {
    switch (tier) {
      case 'fast':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'smart':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-secondary text-secondary-foreground border-border';
    }
  }

  protected priceLine(m: Model): string | null {
    if (typeof m.inputPricePer1M !== 'number' || typeof m.outputPricePer1M !== 'number') {
      return null;
    }
    const currency = m.currency ?? 'USD';
    const inPrice = formatModelPrice(m.inputPricePer1M, currency, this.locale());
    const outPrice = formatModelPrice(m.outputPricePer1M, currency, this.locale());
    return `${inPrice} / ${outPrice} per 1M`;
  }
}
