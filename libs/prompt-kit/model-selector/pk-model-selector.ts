// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { CdkConnectedOverlay, type ConnectedPosition } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { NgTemplateOutlet } from '@angular/common';
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  Directive,
  DOCUMENT,
  ElementRef,
  inject,
  Injector,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideCheck,
  lucideChevronDown,
  lucideSearch,
  lucideStar,
  lucideX,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmSheet, HlmSheetContent, HlmSheetPortal, HlmSheetTitle } from '@spartan-ng/helm/sheet';
import { cn } from '../utils/cn';
import {
  highlightSegments,
  type HighlightSegment,
  type PriceTier,
  type SelectorModel,
  type SelectorSection,
} from './pk-model-selector-types';

/**
 * Marks projected content for the panel's footer strip, e.g.
 * `<div pkModelSelectorFooter><span>Estimates…</span><span>8,406 credits left</span></div>`.
 */
@Directive({
  selector: '[pkModelSelectorFooter]',
  host: { class: 'flex w-full items-center justify-between gap-3' },
})
export class PkModelSelectorFooter {}

/** Most rows a search shows; past this the query needs narrowing, and rendering more only lags. */
const MAX_SEARCH_RESULTS = 60;

/** Rail key for the curated sections entry; maker keys are the maker names. */
const SECTIONS_VIEW = '\u0000sections';
/** Tailwind `md` — the panel becomes a bottom sheet below this width. */
const DESKTOP_QUERY = '(min-width: 768px)';

interface Maker {
  name: string;
  iconUrl?: string;
}

interface ListOption {
  model: SelectorModel;
  index: number;
  id: string;
}

interface ListGroup {
  key: string;
  headingId: string;
  label: string;
  description?: string;
  iconUrl?: string;
  /** `title` = the big maker heading in the desktop maker view. */
  headingStyle: 'title' | 'label';
  /** Rows show the brand icon when a group mixes makers (curated sections). */
  showRowIcon: boolean;
  options: ListOption[];
}

let nextId = 0;

/**
 * Drag-to-close for the phone sheet: the sheet follows the finger down from the handle or title,
 * closes when let go far enough down (or flicked), and springs back otherwise. It moves with the
 * `translate` property, which the sheet's own closing animation (a transform) adds to, so closing
 * carries on from where the finger let go.
 */
@Directive({
  selector: '[pkSheetDrag]',
  host: {
    class: 'touch-none',
    '(pointerdown)': 'down($event)',
    '(pointermove)': 'move($event)',
    '(pointerup)': 'up($event)',
    '(pointercancel)': 'up($event)',
  },
})
export class PkSheetDrag {
  public readonly dismissed = output<void>();

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private pointer: number | null = null;
  private startY = 0;
  private startTime = 0;
  private offset = 0;
  private dragging = false;

  private get sheet(): HTMLElement | null {
    return this.host.nativeElement.closest('hlm-sheet-content');
  }

  protected down(event: PointerEvent): void {
    this.pointer = event.pointerId;
    this.startY = event.clientY;
    this.startTime = event.timeStamp;
    this.offset = 0;
    this.dragging = false;
  }

  protected move(event: PointerEvent): void {
    if (event.pointerId !== this.pointer) return;
    const offset = Math.max(0, event.clientY - this.startY);
    // A few pixels before it counts as a drag, so a tap on the close button stays a tap.
    if (!this.dragging && offset < DRAG_SLOP) return;
    const sheet = this.sheet;
    if (!sheet) return;
    if (!this.dragging) {
      this.dragging = true;
      this.host.nativeElement.setPointerCapture(event.pointerId);
      sheet.style.transition = 'none';
    }
    this.offset = offset;
    sheet.style.translate = `0 ${offset}px`;
  }

  protected up(event: PointerEvent): void {
    if (event.pointerId !== this.pointer) return;
    this.pointer = null;
    const sheet = this.sheet;
    if (!this.dragging || !sheet) return;
    this.dragging = false;
    const speed = this.offset / Math.max(1, event.timeStamp - this.startTime);
    if (this.offset > CLOSE_DISTANCE || speed > CLOSE_SPEED) {
      this.dismissed.emit();
      return;
    }
    sheet.style.transition = 'translate 200ms cubic-bezier(0.2, 0, 0, 1)';
    sheet.style.translate = '';
  }
}

/** Px the finger moves before a press on the sheet's top becomes a drag. */
const DRAG_SLOP = 4;
/** Px down, or px per ms on average, at which letting go closes the sheet. */
const CLOSE_DISTANCE = 120;
const CLOSE_SPEED = 0.6;

@Component({
  selector: 'pk-model-selector',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CdkConnectedOverlay,
    CdkTrapFocus,
    PkSheetDrag,
    NgTemplateOutlet,
    NgIcon,
    HlmButton,
    HlmInputGroupImports,
    HlmSheet,
    HlmSheetContent,
    HlmSheetTitle,
    HlmSheetPortal,
  ],
  providers: [provideIcons({ lucideCheck, lucideChevronDown, lucideSearch, lucideStar, lucideX })],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <button
      #trigger
      hlmBtn
      variant="ghost"
      type="button"
      aria-haspopup="dialog"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-label]="triggerLabel()"
      [disabled]="disabled()"
      (click)="toggle()"
      class="h-9 max-w-full gap-2 rounded-full px-2.5 text-sm font-medium"
    >
      @if (selectedModel(); as s) {
        @if (s.iconUrl; as src) {
          <img [src]="src" alt="" class="size-4 shrink-0 object-contain dark:invert" />
        }
        <span class="truncate md:hidden">{{ s.shortName ?? s.name }}</span>
        <span class="hidden truncate md:inline">{{ s.name }}</span>
      } @else {
        <span class="text-muted-foreground truncate">{{ placeholder() }}</span>
      }
      <ng-icon
        name="lucideChevronDown"
        aria-hidden="true"
        [class]="
          cn(
            'text-[length:--spacing(3.5)] shrink-0 transition-transform',
            isOpen() ? 'rotate-180' : ''
          )
        "
      />
    </button>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="anchor() ?? trigger"
      [cdkConnectedOverlayOpen]="desktopOpen()"
      [cdkConnectedOverlayPositions]="positions()"
      [cdkConnectedOverlayMatchWidth]="!!anchor()"
      [cdkConnectedOverlayViewportMargin]="8"
      [cdkConnectedOverlayPush]="true"
      (attach)="onDesktopAttach()"
      (detach)="onDesktopDetach()"
      (overlayOutsideClick)="closeDesktop(false)"
    >
      <div role="dialog" [attr.aria-label]="title()" cdkTrapFocus [class]="desktopPanelClass()">
        <ng-container *ngTemplateOutlet="panel; context: { $implicit: false }" />
      </div>
    </ng-template>

    <hlm-sheet #sheet side="bottom" autoFocus="dialog" (closed)="onSheetClosed()">
      <hlm-sheet-content
        *hlmSheetPortal="let ctx"
        [showCloseButton]="false"
        class="gap-0 rounded-t-[22px] border-0 p-0 data-[side=bottom]:h-[min(680px,88dvh)]"
      >
        <!-- Drag the handle or the title down to close the sheet. -->
        <div pkSheetDrag class="shrink-0" (dismissed)="ctx.close()">
          <div class="flex shrink-0 justify-center pt-2 pb-1" aria-hidden="true">
            <span class="bg-border h-1 w-9 rounded-full"></span>
          </div>
          <div class="flex shrink-0 items-center justify-between py-1 pr-2 pl-[18px]">
            <h2 hlmSheetTitle class="text-[17px] font-semibold">{{ title() }}</h2>
            <button
              hlmBtn
              variant="ghost"
              size="icon-lg"
              type="button"
              aria-label="Close"
              class="size-11 rounded-xl"
              (click)="ctx.close()"
            >
              <ng-icon name="lucideX" aria-hidden="true" class="text-[length:--spacing(5)]" />
            </button>
          </div>
        </div>
        <ng-container *ngTemplateOutlet="panel; context: { $implicit: true }" />
      </hlm-sheet-content>
    </hlm-sheet>

    <!-- Desktop with \`inline\`: the same panel, shown in the page's flow through \`inlinePortal\`. -->
    <ng-template #inlinePanel>
      <div
        role="dialog"
        data-pk-model-selector-inline
        [attr.aria-label]="title()"
        cdkTrapFocus
        [class]="inlinePanelClass()"
        (keydown.escape)="closeInline(true)"
      >
        <ng-container *ngTemplateOutlet="panel; context: { $implicit: false }" />
      </div>
    </ng-template>

    <ng-template #panel let-mobile>
      <div
        [class]="
          mobile
            ? 'shrink-0 px-3.5 pb-2.5'
            : 'flex shrink-0 items-center gap-3 border-b px-3.5 pt-3.5 pb-3'
        "
      >
        <hlm-input-group
          [class]="
            cn('bg-muted dark:bg-muted min-w-0 grow rounded-xl border-0', mobile ? 'h-11' : 'h-10')
          "
        >
          <hlm-input-group-addon class="ps-3">
            <ng-icon name="lucideSearch" aria-hidden="true" />
          </hlm-input-group-addon>
          <input
            hlmInputGroupInput
            #search
            type="text"
            role="combobox"
            autocomplete="off"
            spellcheck="false"
            enterkeyhint="go"
            aria-autocomplete="list"
            aria-expanded="true"
            [attr.aria-label]="searchLabel()"
            [attr.aria-controls]="listboxId"
            [attr.aria-activedescendant]="activeOption()?.id ?? null"
            [placeholder]="mobile ? mobileSearchPlaceholder() : searchPlaceholder()"
            [value]="query()"
            (input)="onSearch($event)"
            (keydown)="onSearchKeydown($event)"
            [class]="mobile ? 'text-base' : 'text-sm'"
          />
          @if (query()) {
            <hlm-input-group-addon align="inline-end">
              <button
                hlmInputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                class="text-muted-foreground"
                (click)="clearSearch(search)"
              >
                <ng-icon name="lucideX" aria-hidden="true" />
              </button>
            </hlm-input-group-addon>
          }
        </hlm-input-group>
      </div>

      @if (mobile && !searching()) {
        <nav
          [attr.aria-label]="railLabel()"
          class="flex shrink-0 gap-2 overflow-x-auto border-b px-3.5 pb-3 [scrollbar-width:none]"
        >
          @if (hasSections()) {
            <button
              hlmBtn
              variant="ghost"
              type="button"
              [attr.aria-pressed]="view() === sectionsView"
              (click)="setView(sectionsView)"
              [class]="chipClass(view() === sectionsView)"
            >
              <ng-icon name="lucideStar" aria-hidden="true" class="text-[length:--spacing(4)]" />
              {{ sectionsLabel() }}
            </button>
          }
          @for (m of makers(); track m.name) {
            <button
              hlmBtn
              variant="ghost"
              type="button"
              [attr.aria-pressed]="view() === m.name"
              (click)="setView(m.name)"
              [class]="chipClass(view() === m.name)"
            >
              @if (m.iconUrl; as src) {
                <img
                  [src]="src"
                  alt=""
                  [class]="
                    cn(
                      'size-4 object-contain',
                      view() === m.name ? 'invert dark:invert-0' : 'dark:invert'
                    )
                  "
                />
              }
              {{ m.name }}
            </button>
          }
        </nav>
      }

      <div class="flex min-h-0 grow">
        <!-- The rail and the footer are drawn in --pk-model-selector-rail-fill, falling back to a muted tint. -->
        @if (!mobile && !searching()) {
          <nav
            [attr.aria-label]="railLabel()"
            class="bg-[var(--pk-model-selector-rail-fill,color-mix(in_oklab,var(--muted)_40%,transparent))] flex w-[196px] shrink-0 flex-col gap-0.5 overflow-y-auto border-r px-2 py-2.5"
          >
            @if (hasSections()) {
              <button
                hlmBtn
                variant="ghost"
                type="button"
                [attr.aria-current]="view() === sectionsView"
                (click)="setView(sectionsView)"
                [class]="railItemClass(view() === sectionsView)"
              >
                <ng-icon
                  name="lucideStar"
                  aria-hidden="true"
                  class="text-[length:--spacing(4)] shrink-0"
                />
                <span class="grow truncate">{{ sectionsLabel() }}</span>
              </button>
              <div class="bg-border mx-1 my-1.5 h-px shrink-0" aria-hidden="true"></div>
            }
            @for (m of makers(); track m.name) {
              <button
                hlmBtn
                variant="ghost"
                type="button"
                [attr.aria-current]="view() === m.name"
                (click)="setView(m.name)"
                [class]="railItemClass(view() === m.name)"
              >
                @if (m.iconUrl; as src) {
                  <img [src]="src" alt="" class="size-4 shrink-0 object-contain dark:invert" />
                } @else {
                  <span class="size-4 shrink-0" aria-hidden="true"></span>
                }
                <span class="grow truncate">{{ m.name }}</span>
              </button>
            }
          </nav>
        }

        <div
          #list
          role="listbox"
          [id]="listboxId"
          [attr.aria-label]="listLabel()"
          [class]="
            cn(
              'flex min-w-0 grow flex-col gap-3.5 overflow-y-auto',
              mobile ? 'px-2 py-2.5' : 'px-2.5 py-3'
            )
          "
        >
          @for (g of groups(); track g.key) {
            <div role="group" [attr.aria-labelledby]="g.headingId" class="flex flex-col gap-0.5">
              @if (g.headingStyle === 'title' && !mobile) {
                <div [id]="g.headingId" class="px-0.5 pb-0.5 text-[15px] font-semibold">
                  {{ g.label }}
                </div>
              } @else {
                <div
                  [id]="g.headingId"
                  [class]="
                    cn(
                      'flex gap-x-2 gap-y-px pb-1.5 pt-0.5',
                      mobile && g.description ? 'flex-col px-2.5' : 'flex-wrap items-center px-3'
                    )
                  "
                >
                  <span class="flex items-center gap-2 text-[13px] font-semibold">
                    @if (g.iconUrl; as src) {
                      <img [src]="src" alt="" class="size-4 object-contain dark:invert" />
                    }
                    {{ g.label }}
                  </span>
                  @if (g.description; as d) {
                    <span class="text-muted-foreground text-xs">{{ d }}</span>
                  }
                </div>
              }
              @for (o of g.options; track o.model.id) {
                <div
                  role="option"
                  [id]="o.id"
                  [attr.aria-selected]="o.model.id === value()"
                  [attr.aria-disabled]="o.model.disabled ? true : null"
                  (click)="choose(o.model)"
                  (pointermove)="onPointerMove(o.index)"
                  [class]="optionClass(o, mobile)"
                >
                  @if (g.showRowIcon) {
                    <span
                      [class]="
                        cn(
                          'bg-muted flex shrink-0 items-center justify-center',
                          mobile ? 'size-8 rounded-[9px]' : 'size-[30px] rounded-lg'
                        )
                      "
                    >
                      @if (o.model.iconUrl; as src) {
                        <img [src]="src" alt="" class="size-4 object-contain dark:invert" />
                      }
                    </span>
                  }
                  <span class="flex min-w-0 grow flex-col gap-[3px]">
                    <span class="flex min-w-0 items-center gap-1.5 overflow-hidden">
                      <span
                        [class]="
                          cn(
                            'max-w-full shrink-0 truncate font-semibold',
                            mobile ? 'text-[15px]' : 'text-sm'
                          )
                        "
                      >
                        <!-- prettier-ignore -->
                        @for (seg of segments(o.model.name); track $index) {@if (seg.match) {<mark [class]="markClass">{{ seg.text }}</mark>} @else {<span>{{ seg.text }}</span>}}
                      </span>
                      @for (cap of o.model.capabilities ?? []; track cap) {
                        <span
                          class="bg-muted text-foreground/70 inline-flex h-5 shrink-0 items-center rounded-full px-2 text-[11px]"
                        >
                          {{ cap }}
                        </span>
                      }
                    </span>
                    @if (o.model.description; as d) {
                      <span [class]="secondaryText + ' truncate text-[13px]'">
                        <!-- prettier-ignore -->
                        @for (seg of segments(d); track $index) {@if (seg.match) {<mark [class]="markClass">{{ seg.text }}</mark>} @else {<span>{{ seg.text }}</span>}}
                      </span>
                    }
                  </span>
                  @if (o.model.priceTier || o.model.costLabel) {
                    <span class="flex shrink-0 flex-col items-end gap-0.5 text-xs">
                      @if (o.model.priceTier; as t) {
                        <span class="font-semibold tracking-[1px]">
                          <span class="sr-only">{{ priceTierLabel(t) }}</span>
                          <span aria-hidden="true"
                            >{{ dollars(t)
                            }}<span class="text-muted-foreground/60">{{
                              dollars(3 - t)
                            }}</span></span
                          >
                        </span>
                      }
                      @if (o.model.costLabel; as c) {
                        <span [class]="secondaryText + ' whitespace-nowrap'">{{ c }}</span>
                      }
                    </span>
                  }
                  <span class="flex w-4 shrink-0 justify-center">
                    @if (o.model.id === value()) {
                      <ng-icon
                        name="lucideCheck"
                        aria-hidden="true"
                        class="text-[length:--spacing(4)]"
                      />
                    }
                  </span>
                </div>
              }
            </div>
          } @empty {
            <p class="text-muted-foreground px-3 py-10 text-center text-sm" role="presentation">
              {{ noResults() }}
            </p>
          }
        </div>
      </div>

      @if (footer()) {
        <div
          [class]="
            cn(
              'text-muted-foreground shrink-0 border-t text-xs',
              mobile
                ? 'px-[18px] pt-2.5 pb-[18px]'
                : 'bg-[var(--pk-model-selector-rail-fill,color-mix(in_oklab,var(--muted)_40%,transparent))] px-4 py-2.5'
            )
          "
        >
          <ng-content select="[pkModelSelectorFooter]" />
        </div>
      }
    </ng-template>
  `,
})
export class PkModelSelector {
  /** All selectable models. Maker order in the rail follows first appearance. */
  public readonly models = input.required<readonly SelectorModel[]>();
  /** Curated groups shown under one rail entry (`sectionsLabel`) above the makers. */
  public readonly sections = input<readonly SelectorSection[]>([]);
  /** Selected model id. Two-way bindable: `[(value)]`. */
  public readonly value = model<string | null>(null);
  public readonly placeholder = input<string>('Select model');
  /** Dialog / sheet title (also the desktop panel's accessible name). */
  public readonly title = input<string>('Choose a model');
  public readonly sectionsLabel = input<string>('Recommended');
  public readonly searchPlaceholder = input<string>(
    'Search by name or what you need, like “code” or “images”',
  );
  public readonly mobileSearchPlaceholder = input<string>('Search models or what you need');
  public readonly searchLabel = input<string>('Search models');
  public readonly railLabel = input<string>('Model makers');
  /** Text for an empty search result; `{query}` is replaced with the query. */
  public readonly noResultsText = input<string>('No models match “{query}”.');
  public readonly disabled = input<boolean>(false);
  /**
   * Element the desktop panel aligns to and matches the width of (e.g. the
   * composer). Defaults to the trigger, with a 784px panel.
   */
  public readonly anchor = input<ElementRef<HTMLElement> | HTMLElement | null>(null);
  /**
   * On desktop, open in the page's flow instead of a floating panel: the page renders
   * `inlinePortal` (a `cdkPortalOutlet`) where the panel belongs, e.g. below a centred composer.
   */
  public readonly inline = input<boolean>(false);
  public readonly class = input<string>('');

  /** Emits the chosen model id after a row is picked (the panel closes). */
  public readonly selected = output<string>();
  public readonly openChange = output<boolean>();

  protected readonly cn = cn;
  protected readonly sectionsView = SECTIONS_VIEW;
  /** Muted text that stays AA on the selected row's accent background. */
  protected readonly secondaryText = 'text-muted-foreground group-aria-selected:text-foreground/70';
  protected readonly markClass =
    'bg-yellow-400/40 text-foreground rounded-[3px] px-px dark:bg-yellow-400/30';

  private readonly uid = `pk-model-selector-${nextId++}`;
  protected readonly listboxId = `${this.uid}-listbox`;

  private readonly document = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly triggerRef = viewChild.required<ElementRef<HTMLButtonElement>>('trigger');
  private readonly sheet = viewChild.required<HlmSheet>('sheet');
  private readonly searchRef = viewChild<ElementRef<HTMLInputElement>>('search');
  private readonly listRef = viewChild<ElementRef<HTMLElement>>('list');
  protected readonly footer = contentChild(PkModelSelectorFooter);

  protected readonly desktopOpen = signal(false);
  private readonly sheetOpen = signal(false);
  private readonly inlineOpen = signal(false);
  protected readonly isOpen = computed(
    () => this.desktopOpen() || this.sheetOpen() || this.inlineOpen(),
  );
  private readonly inlinePanelRef = viewChild.required<TemplateRef<unknown>>('inlinePanel');
  private readonly viewContainer = inject(ViewContainerRef);
  /** The open inline panel, for the page's `cdkPortalOutlet`; null while closed. */
  public readonly inlinePortal = computed(() =>
    this.inlineOpen() ? new TemplatePortal(this.inlinePanelRef(), this.viewContainer) : null,
  );
  /** A pointer down outside the inline panel and the trigger closes it, as one outside the overlay does. */
  private readonly onOutsidePointer = (event: PointerEvent): void => {
    const target = event.target as Element | null;
    if (target?.closest('[data-pk-model-selector-inline]')) return;
    if (this.triggerRef().nativeElement.contains(target)) return;
    this.closeInline(false);
  };
  protected readonly query = signal('');
  protected readonly view = signal<string>('');
  protected readonly activeIndex = signal(-1);
  /** Keyboard navigation is in progress → show the active-row ring. */
  private readonly keyboardNav = signal(false);

  protected readonly hostClass = computed(() => cn('inline-block', this.class()));
  protected readonly desktopPanelClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground flex h-[min(560px,calc(100dvh-6rem))] flex-col overflow-hidden rounded-[12px] border shadow-[0_0_5px_rgb(10_10_10/0.2)] outline-none dark:shadow-[0_0_5px_rgb(0_0_0/0.8)]',
      this.anchor() ? 'w-full' : 'w-[min(784px,calc(100vw-1rem))]',
    ),
  );

  protected readonly inlinePanelClass = computed(() =>
    cn(
      'bg-popover text-popover-foreground flex h-[min(560px,calc(100dvh-22rem))] min-h-80 w-full flex-col overflow-hidden rounded-[12px] border shadow-[0_0_5px_rgb(10_10_10/0.2)] outline-none dark:shadow-[0_0_5px_rgb(0_0_0/0.8)]',
    ),
  );

  protected readonly positions = computed<ConnectedPosition[]>(() => {
    // Opens upward (a composer sits at the bottom of the screen); falls back below.
    const x = this.anchor() ? 'start' : 'end';
    const alt = x === 'start' ? 'end' : 'start';
    return [
      { originX: x, originY: 'top', overlayX: x, overlayY: 'bottom', offsetY: -8 },
      { originX: alt, originY: 'top', overlayX: alt, overlayY: 'bottom', offsetY: -8 },
      { originX: x, originY: 'bottom', overlayX: x, overlayY: 'top', offsetY: 8 },
    ];
  });

  private readonly byId = computed(() => new Map(this.models().map((m) => [m.id, m])));

  protected readonly selectedModel = computed(() => {
    const id = this.value();
    return id ? (this.byId().get(id) ?? null) : null;
  });

  protected readonly triggerLabel = computed(() => {
    const s = this.selectedModel();
    return s ? `Model: ${s.name}` : this.placeholder();
  });

  protected readonly makers = computed<Maker[]>(() => {
    const seen = new Map<string, Maker>();
    for (const m of this.models()) {
      const existing = seen.get(m.maker);
      const icon = m.makerIconUrl ?? m.iconUrl;
      if (!existing) seen.set(m.maker, { name: m.maker, iconUrl: icon });
      else if (m.makerIconUrl) existing.iconUrl = m.makerIconUrl;
      else if (!existing.iconUrl && icon) existing.iconUrl = icon;
    }
    return [...seen.values()];
  });

  /** Each model with its name and its other searchable text, lowercased once rather than per keystroke. */
  private readonly searchIndex = computed(() =>
    this.models().map(
      (m) =>
        [
          m,
          m.name.toLowerCase(),
          [m.maker, m.description ?? '', ...(m.capabilities ?? [])].join(' ').toLowerCase(),
        ] as const,
    ),
  );

  protected readonly hasSections = computed(() => this.sections().length > 0);
  protected readonly searching = computed(() => this.query().trim().length > 0);

  protected readonly groups = computed<ListGroup[]>(() => {
    const q = this.query().trim();
    const makerIcon = new Map(this.makers().map((m) => [m.name, m.iconUrl]));
    let index = 0;
    const toOptions = (models: readonly SelectorModel[]): ListOption[] =>
      models.map((model) => {
        const i = index++;
        return { model, index: i, id: `${this.uid}-opt-${i}` };
      });
    const group = (
      key: string,
      label: string,
      models: readonly SelectorModel[],
      extra: Partial<ListGroup>,
    ): ListGroup => ({
      key,
      headingId: `${this.uid}-group-${key}`,
      label,
      headingStyle: 'label',
      showRowIcon: false,
      ...extra,
      options: toOptions(models),
    });

    if (q) {
      // Models whose name matches come before those matched only by their description, and the
      // list stops at MAX_SEARCH_RESULTS: a one-letter query matches nearly everything.
      const needle = q.toLowerCase();
      const byName: SelectorModel[] = [];
      const byText: SelectorModel[] = [];
      for (const [model, name, text] of this.searchIndex()) {
        if (name.includes(needle)) byName.push(model);
        else if (text.includes(needle)) byText.push(model);
      }
      const byMaker = new Map<string, SelectorModel[]>();
      for (const m of [...byName, ...byText].slice(0, MAX_SEARCH_RESULTS)) {
        const list = byMaker.get(m.maker) ?? [];
        list.push(m);
        byMaker.set(m.maker, list);
      }
      return [...byMaker.entries()].map(([maker, models], i) =>
        group(`s${i}`, maker, models, { iconUrl: makerIcon.get(maker) }),
      );
    }

    const view = this.view();
    if (view === SECTIONS_VIEW) {
      const byId = this.byId();
      return this.sections().map((s, i) =>
        group(
          `c${i}`,
          s.label,
          s.modelIds.map((id) => byId.get(id)).filter((m): m is SelectorModel => !!m),
          { description: s.description, showRowIcon: true },
        ),
      );
    }
    const models = this.models().filter((m) => m.maker === view);
    if (!models.length) return [];
    return [group('m', view, models, { iconUrl: makerIcon.get(view), headingStyle: 'title' })];
  });

  private readonly options = computed(() => this.groups().flatMap((g) => g.options));
  protected readonly activeOption = computed<ListOption | null>(
    () => this.options()[this.activeIndex()] ?? null,
  );

  protected readonly noResults = computed(() =>
    this.searching() ? this.noResultsText().replace('{query}', this.query().trim()) : '',
  );

  protected readonly listLabel = computed(() => {
    if (this.searching()) return 'Search results';
    const view = this.view();
    return view === SECTIONS_VIEW ? this.sectionsLabel() : `${view} models`;
  });

  constructor() {
    // Close when the viewport crosses the breakpoint: the other presentation takes over.
    const win = this.document.defaultView;
    const mql = win?.matchMedia?.(DESKTOP_QUERY);
    if (mql) {
      const onChange = (): void => {
        if (this.desktopOpen()) this.closeDesktop(false);
        if (this.inlineOpen()) this.closeInline(false);
        if (this.sheetOpen()) this.sheet().close();
      };
      mql.addEventListener('change', onChange);
      inject(DestroyRef).onDestroy(() => mql.removeEventListener('change', onChange));
    }
  }

  public open(): void {
    if (this.isOpen() || this.disabled()) return;
    this.resetPanelState();
    if (this.isDesktop() && this.inline()) {
      this.inlineOpen.set(true);
      this.document.addEventListener('pointerdown', this.onOutsidePointer, true);
      this.onDesktopAttach();
    } else if (this.isDesktop()) {
      this.desktopOpen.set(true);
    } else {
      this.sheetOpen.set(true);
      this.sheet().open();
    }
    this.openChange.emit(true);
  }

  public close(): void {
    if (this.desktopOpen()) this.closeDesktop(true);
    if (this.inlineOpen()) this.closeInline(true);
    if (this.sheetOpen()) this.sheet().close();
  }

  protected toggle(): void {
    if (this.isOpen()) this.close();
    else this.open();
  }

  protected closeDesktop(restoreFocus: boolean): void {
    if (!this.desktopOpen()) return;
    this.desktopOpen.set(false);
    this.openChange.emit(false);
    if (restoreFocus) this.triggerRef().nativeElement.focus();
  }

  protected onDesktopAttach(): void {
    afterNextRender(
      () => {
        this.searchRef()?.nativeElement.focus();
        this.scrollActiveIntoView();
      },
      { injector: this.injector },
    );
  }

  protected closeInline(restoreFocus: boolean): void {
    if (!this.inlineOpen()) return;
    this.inlineOpen.set(false);
    this.document.removeEventListener('pointerdown', this.onOutsidePointer, true);
    this.openChange.emit(false);
    if (restoreFocus) this.triggerRef().nativeElement.focus();
  }

  /** CDK detaches on Escape (and on our own close); keep state and focus in sync. */
  protected onDesktopDetach(): void {
    if (!this.desktopOpen()) return;
    this.desktopOpen.set(false);
    this.openChange.emit(false);
    this.triggerRef().nativeElement.focus();
  }

  protected onSheetClosed(): void {
    if (!this.sheetOpen()) return;
    this.sheetOpen.set(false);
    this.openChange.emit(false);
  }

  protected setView(view: string): void {
    this.view.set(view);
    this.keyboardNav.set(false);
    this.activeIndex.set(this.selectedIndexOr(-1));
    this.listRef()?.nativeElement.scrollTo({ top: 0 });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
    this.activeIndex.set(this.firstEnabledIndex());
    this.listRef()?.nativeElement.scrollTo({ top: 0 });
  }

  protected clearSearch(input: HTMLInputElement): void {
    this.query.set('');
    this.activeIndex.set(this.selectedIndexOr(-1));
    input.focus();
  }

  protected onSearchKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        this.keyboardNav.set(true);
        this.move(event.key === 'ArrowDown' ? 1 : -1);
        break;
      }
      case 'Enter': {
        const active = this.activeOption();
        if (active) {
          event.preventDefault();
          this.choose(active.model);
        }
        break;
      }
    }
  }

  protected onPointerMove(index: number): void {
    if (this.activeIndex() !== index) this.activeIndex.set(index);
    this.keyboardNav.set(false);
  }

  protected choose(m: SelectorModel): void {
    if (m.disabled) return;
    this.value.set(m.id);
    this.selected.emit(m.id);
    if (this.desktopOpen()) this.closeDesktop(true);
    if (this.inlineOpen()) this.closeInline(true);
    if (this.sheetOpen()) this.sheet().close();
  }

  protected segments(text: string): HighlightSegment[] {
    return highlightSegments(text, this.query());
  }

  protected dollars(count: number): string {
    return '$'.repeat(Math.max(0, count));
  }

  protected priceTierLabel(tier: PriceTier): string {
    return tier === 1 ? 'Low price' : tier === 2 ? 'Medium price' : 'High price';
  }

  protected chipClass(active: boolean): string {
    return cn(
      'h-9 gap-[7px] rounded-full border px-[13px]',
      active
        ? 'bg-foreground text-background border-foreground hover:bg-foreground hover:text-background dark:hover:bg-foreground'
        : 'border-border hover:bg-accent dark:hover:bg-accent',
    );
  }

  protected railItemClass(active: boolean): string {
    return cn(
      'h-10 justify-start gap-2.5 rounded-[10px] px-2.5 text-left font-normal',
      active
        ? 'bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent font-semibold'
        : 'hover:bg-accent/60 dark:hover:bg-accent/60',
    );
  }

  protected optionClass(o: ListOption, mobile: boolean): string {
    const active = o.index === this.activeIndex();
    const showRing = active && (this.keyboardNav() || this.searching());
    return cn(
      'group flex cursor-pointer items-center text-left select-none',
      mobile
        ? 'min-h-[60px] gap-3 rounded-xl px-2.5 py-2'
        : 'min-h-14 gap-3.5 rounded-[10px] px-3 py-2',
      o.model.id === this.value() ? 'bg-accent' : active ? 'bg-accent/50' : '',
      showRing ? 'ring-ring ring-2 ring-inset' : '',
      o.model.disabled ? 'cursor-not-allowed opacity-50' : '',
    );
  }

  private isDesktop(): boolean {
    return this.document.defaultView?.matchMedia?.(DESKTOP_QUERY).matches ?? true;
  }

  private resetPanelState(): void {
    this.query.set('');
    this.keyboardNav.set(false);
    const selectedMaker = this.selectedModel()?.maker;
    this.view.set(
      this.hasSections() ? SECTIONS_VIEW : (selectedMaker ?? this.makers()[0]?.name ?? ''),
    );
    this.activeIndex.set(this.selectedIndexOr(-1));
  }

  private selectedIndexOr(fallback: number): number {
    const id = this.value();
    const hit = this.options().find((o) => o.model.id === id);
    return hit ? hit.index : fallback;
  }

  private firstEnabledIndex(): number {
    return this.options().find((o) => !o.model.disabled)?.index ?? -1;
  }

  private move(delta: 1 | -1): void {
    const options = this.options();
    if (!options.length) return;
    let i = this.activeIndex();
    for (let step = 0; step < options.length; step++) {
      i =
        i < 0
          ? delta > 0
            ? 0
            : options.length - 1
          : (i + delta + options.length) % options.length;
      if (!options[i].model.disabled) break;
    }
    this.activeIndex.set(i);
    this.scrollActiveIntoView();
  }

  private scrollActiveIntoView(): void {
    const id = this.activeOption()?.id;
    if (!id) return;
    afterNextRender(() => this.document.getElementById(id)?.scrollIntoView({ block: 'nearest' }), {
      injector: this.injector,
    });
  }
}
