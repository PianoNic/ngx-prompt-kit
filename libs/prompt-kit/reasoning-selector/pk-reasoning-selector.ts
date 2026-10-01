// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { type BooleanInput } from '@angular/cdk/coercion';
import { CdkMenu, CdkMenuItem } from '@angular/cdk/menu';
import {
  afterNextRender,
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  Directive,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideSparkles } from '@ng-icons/lucide';
import { type MenuAlign, type MenuSide } from '@spartan-ng/brain/core';
import { HlmButton } from '@spartan-ng/helm/button';
import {
  HlmDropdownMenu,
  HlmDropdownMenuGroup,
  HlmDropdownMenuLabel,
  HlmDropdownMenuRadio,
  HlmDropdownMenuRadioIndicator,
  HlmDropdownMenuSeparator,
  HlmDropdownMenuTrigger,
} from '@spartan-ng/helm/dropdown-menu';
import { cn } from '../utils/cn';

/** How hard a level thinks: 0 to 4 filled bars, or `'auto'` (sparkle) when the model decides. */
export type ReasoningStrength = 0 | 1 | 2 | 3 | 4 | 'auto';

/** A relative rating on a five-segment meter. */
export type ReasoningRating = 1 | 2 | 3 | 4 | 5;

export interface ReasoningLevelOption<T extends string = string> {
  /** The value emitted when picked; `null` is "let the model decide". */
  value: T | null;
  label: string;
  description?: string;
  strength: ReasoningStrength;
  /** How quickly it answers, 1 (slowest) to 5 (fastest). Shown in the menu's footer. */
  speed?: ReasoningRating;
  /** How much it costs, 1 (cheapest) to 5 (dearest). Shown in the menu's footer. */
  credits?: ReasoningRating;
}

/** Auto plus five named levels, valued with the effort names most providers use. */
export const DEFAULT_REASONING_LEVELS: readonly ReasoningLevelOption[] = [
  {
    value: null,
    label: 'Auto',
    description: 'The model decides how long to think',
    strength: 'auto',
  },
  {
    value: 'none',
    label: 'Off',
    description: 'Answers straight away',
    strength: 0,
    speed: 5,
    credits: 1,
  },
  {
    value: 'low',
    label: 'Light',
    description: 'A quick check first',
    strength: 1,
    speed: 4,
    credits: 2,
  },
  {
    value: 'medium',
    label: 'Balanced',
    description: 'Thinks things through',
    strength: 2,
    speed: 3,
    credits: 3,
  },
  {
    value: 'high',
    label: 'Deep',
    description: 'For hard problems',
    strength: 3,
    speed: 2,
    credits: 4,
  },
  {
    value: 'max',
    label: 'Maximum',
    description: 'As long as it takes',
    strength: 4,
    speed: 1,
    credits: 5,
  },
];

const BARS = [
  { x: 0, y: 8, height: 4 },
  { x: 4.3, y: 5, height: 7 },
  { x: 8.6, y: 2.5, height: 9.5 },
  { x: 12.9, y: 0, height: 12 },
] as const;

const SEGMENTS = [1, 2, 3, 4, 5] as const;

/**
 * A level's strength glyph: four rising bars, filled up to the strength, or a sparkle for auto.
 * Decorative unless given a `label`.
 */
@Component({
  selector: 'pk-reasoning-glyph',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgIcon],
  providers: [provideIcons({ lucideSparkles })],
  host: {
    class: 'inline-flex size-4 shrink-0 items-center justify-center',
    '[attr.role]': 'label() ? "img" : null',
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-hidden]': 'label() ? null : "true"',
  },
  template: `
    @if (strength() === 'auto') {
      <ng-icon name="lucideSparkles" class="text-[length:--spacing(4)]" />
    } @else {
      <svg width="16" height="12" viewBox="0 0 16 12" aria-hidden="true">
        @for (bar of bars; track $index) {
          <rect
            [attr.x]="bar.x"
            [attr.y]="bar.y"
            width="3"
            [attr.height]="bar.height"
            rx="1"
            fill="currentColor"
            [attr.opacity]="$index < filled() ? 1 : 0.28"
          />
        }
      </svg>
    }
  `,
})
export class PkReasoningGlyph {
  public readonly strength = input.required<ReasoningStrength>();
  /** Accessible name; leave empty when text next to the glyph already says the level. */
  public readonly label = input<string>('');
  protected readonly bars = BARS;
  protected readonly filled = computed(() => {
    const strength = this.strength();
    return strength === 'auto' ? 0 : strength;
  });
}

/** Moves the menu's keyboard focus to the selected row once the menu has rendered. */
@Directive({ selector: '[pkReasoningSelectorStart]' })
export class PkReasoningSelectorStart {
  public readonly pkReasoningSelectorStart = input(false);

  constructor() {
    const item = inject(CdkMenuItem);
    const menu = inject(CdkMenu, { optional: true });
    afterNextRender(() => {
      if (this.pkReasoningSelectorStart()) menu?.setActiveMenuItem(item);
    });
  }
}

/**
 * A composer-toolbar picker for how long the model reasons: a strength glyph with the level's name,
 * opening a spartan dropdown menu of levels. The menu's footer rates the highlighted level's speed
 * and credits.
 *
 *   levels:   ReasoningLevelOption[]   (defaults to DEFAULT_REASONING_LEVELS)
 *   value:    model<T | null>          (two-way; null = auto)
 *   disabled: boolean
 *   label:    string                   ('Reasoning'; the menu's heading and the trigger's name)
 *   side:     'top' | 'bottom' | ...   ('top')
 *   align:    'start' | 'center' | 'end' ('start')
 *   class:    string                   (host classes)
 */
@Component({
  selector: 'pk-reasoning-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgIcon,
    HlmButton,
    HlmDropdownMenu,
    HlmDropdownMenuGroup,
    HlmDropdownMenuLabel,
    HlmDropdownMenuRadio,
    HlmDropdownMenuRadioIndicator,
    HlmDropdownMenuSeparator,
    HlmDropdownMenuTrigger,
    PkReasoningGlyph,
    PkReasoningSelectorStart,
  ],
  providers: [provideIcons({ lucideChevronDown })],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <button
      hlmBtn
      variant="ghost"
      type="button"
      class="aria-expanded:bg-accent aria-expanded:text-accent-foreground h-9 gap-2 rounded-full px-3 text-sm font-medium"
      [disabled]="disabled()"
      [attr.aria-label]="label() + ': ' + (selected()?.label ?? '')"
      [hlmDropdownMenuTrigger]="menu"
      [side]="side()"
      [align]="align()"
      (hlmDropdownMenuClosed)="highlighted.set(null)"
    >
      @if (selected(); as level) {
        <pk-reasoning-glyph [strength]="level.strength" />
        <span class="max-sm:hidden">{{ level.label }}</span>
      }
      <ng-icon
        name="lucideChevronDown"
        aria-hidden="true"
        class="text-[length:--spacing(3.5)] motion-safe:transition-transform group-aria-expanded/button:rotate-180"
      />
    </button>

    <ng-template #menu>
      <hlm-dropdown-menu
        class="border-border w-[300px] max-w-[calc(100vw-2rem)] rounded-xl border p-1.5 shadow-[0_0_5px_rgba(10,10,10,0.2)] ring-0 dark:shadow-[0_0_5px_rgba(0,0,0,0.8)]"
        [attr.aria-label]="label()"
      >
        <hlm-dropdown-menu-label class="px-2.5 pt-2 pb-1.5" aria-hidden="true">
          {{ label() }}
        </hlm-dropdown-menu-label>
        <hlm-dropdown-menu-group>
          @for (level of levels(); track level.value) {
            <button
              hlmDropdownMenuRadio
              type="button"
              class="data-checked:bg-accent data-checked:text-accent-foreground gap-2.5 rounded-lg py-2 ps-2.5 pe-9"
              [checked]="level === selected()"
              [keepOpen]="false"
              [pkReasoningSelectorStart]="level === selected()"
              (triggered)="value.set(level.value)"
              (focus)="highlighted.set(level)"
            >
              <span class="flex w-5 shrink-0 justify-center">
                <pk-reasoning-glyph [strength]="level.strength" />
              </span>
              <span class="flex min-w-0 flex-col gap-px text-start">
                <span class="text-sm" [class.font-medium]="level === selected()">
                  {{ level.label }}
                </span>
                @if (level.description) {
                  <!-- Muted, but darker on a filled row so it keeps AA contrast. -->
                  <span
                    class="text-muted-foreground group-hover/dropdown-menu-radio:text-accent-foreground/70! group-focus/dropdown-menu-radio:text-accent-foreground/70! group-data-checked/dropdown-menu-radio:text-accent-foreground/70! text-xs"
                    >{{ level.description }}</span
                  >
                }
                @if (level.speed && level.credits) {
                  <span class="sr-only">
                    Speed {{ level.speed }} of 5, credits {{ level.credits }} of 5
                  </span>
                }
              </span>
              <hlm-dropdown-menu-radio-indicator class="end-2.5" />
            </button>
            @if (level.strength === 'auto' && !$last) {
              <hlm-dropdown-menu-separator role="separator" class="mx-1.5 my-1" />
            }
          }
        </hlm-dropdown-menu-group>
        @if (rated()) {
          <div
            aria-hidden="true"
            class="bg-muted/50 text-muted-foreground mx-1 mt-1 mb-0.5 grid grid-cols-[auto_1fr_auto_1fr] items-center gap-x-2.5 gap-y-1.5 rounded-lg px-2.5 pt-2.5 pb-2 text-xs"
          >
            <span>Speed</span>
            <span class="flex gap-[3px]">
              @for (segment of segments; track segment) {
                <span
                  class="h-[5px] w-3.5 rounded-[3px]"
                  [class]="segment <= (shown()?.speed ?? 0) ? 'bg-foreground' : 'bg-foreground/10'"
                ></span>
              }
            </span>
            <span>Credits</span>
            <span class="flex gap-[3px]">
              @for (segment of segments; track segment) {
                <span
                  class="h-[5px] w-3.5 rounded-[3px]"
                  [class]="
                    segment <= (shown()?.credits ?? 0) ? 'bg-foreground' : 'bg-foreground/10'
                  "
                ></span>
              }
            </span>
          </div>
        }
      </hlm-dropdown-menu>
    </ng-template>
  `,
})
export class PkReasoningSelector<T extends string = string> {
  public readonly levels = input<readonly ReasoningLevelOption<T>[]>(
    DEFAULT_REASONING_LEVELS as readonly ReasoningLevelOption<T>[],
  );
  /** The picked level's value; `null` is auto. */
  public readonly value = model<T | null>(null);
  public readonly disabled = input<boolean, BooleanInput>(false, { transform: booleanAttribute });
  public readonly label = input<string>('Reasoning');
  public readonly side = input<MenuSide>('top');
  public readonly align = input<MenuAlign>('start');
  public readonly class = input<string>('');

  protected readonly segments = SEGMENTS;
  /** The row under the pointer or keyboard focus while the menu is open. */
  protected readonly highlighted = signal<ReasoningLevelOption<T> | null>(null);

  protected readonly selected = computed<ReasoningLevelOption<T> | undefined>(() => {
    const levels = this.levels();
    return (
      levels.find((level) => level.value === this.value()) ??
      levels.find((level) => level.value === null) ??
      levels[0]
    );
  });
  /** The footer follows the highlighted row, and the selected one before anything is highlighted. */
  protected readonly shown = computed(() => this.highlighted() ?? this.selected());
  protected readonly rated = computed(() =>
    this.levels().some((level) => level.speed !== undefined || level.credits !== undefined),
  );
  protected readonly hostClass = computed(() => cn('inline-flex shrink-0', this.class()));
}
