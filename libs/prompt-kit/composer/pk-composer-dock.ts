// ngx-prompt-kit original — not part of ibelick/prompt-kit
import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { cn } from '../utils/cn';

export type ComposerDockVariant = 'docked' | 'card' | 'plain';

/** Widest the notch gets, in px; narrower panels keep 24px of band either side of it. */
const NOTCH_MAX = 784;
/** Height of the band either side of the notch, from the panel's bottom edge, in px. */
const SIDE_HEIGHT = 84;
/** Corner radius of every curve in the band, in px. */
const R = 12;

/**
 * Holds a `pk-composer` in one of three shapes:
 *
 * - `docked`: pinned to the bottom of a content panel (the host is absolutely positioned, so put
 *   it in a `relative` panel that clips). A band in the page colour rises from the panel's bottom
 *   edge with a raised notch around the composer, so the composer reads as sitting in the page
 *   rather than floating over the thread. The notch grows with the composer; the sides don't.
 * - `card`: a bordered, softly shadowed card, for a composer centred in an empty chat.
 * - `plain`: no chrome, for a composer laid straight on the page, as on phones.
 *
 * A docked band replaces the panel's bottom corners with its own curves, so square them off, e.g.
 * `has-[pk-composer-dock[data-variant=docked]]:rounded-b-none` on the panel.
 *
 * The band is drawn in `--pk-composer-dock-fill`, falling back to `--background`; set it to the
 * colour of the page around the panel when that differs, e.g. a sidebar layout's `--sidebar`.
 *
 * `occupied` reports how many px of the panel the docked band covers, so the thread can pad its
 * bottom and keep the last message clear of it.
 */
@Component({
  selector: 'pk-composer-dock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
    '[attr.data-variant]': 'variant()',
  },
  template: `
    @if (variant() === 'docked' && width() > 0) {
      <svg
        aria-hidden="true"
        class="pointer-events-none fill-[var(--pk-composer-dock-fill,var(--background))] absolute -start-3 -bottom-3 block drop-shadow-[0_0_5px_rgb(10_10_10/0.2)] dark:drop-shadow-[0_0_5px_rgb(0_0_0/0.8)]"
        [attr.width]="width() + 2 * R"
        [attr.height]="bandHeight()"
        [attr.viewBox]="'0 0 ' + (width() + 2 * R) + ' ' + bandHeight()"
      >
        <path [attr.d]="path()" />
      </svg>
    }
    <div #content [class]="contentClass()">
      <ng-content />
    </div>
  `,
})
export class PkComposerDock {
  public readonly variant = input<ComposerDockVariant>('docked');
  /** Extra classes for the card or notch content wrapper, e.g. a dashed border for incognito. */
  public readonly contentClassName = input('', { alias: 'contentClass' });
  public readonly class = input('');

  /** Px of the panel's height the docked band covers; 0 for the other variants. */
  public readonly occupied = output<number>();

  protected readonly R = R;
  protected readonly width = signal(0);
  private readonly contentHeight = signal(0);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');

  protected readonly hostClass = computed(() =>
    cn(
      this.variant() === 'docked'
        ? 'pointer-events-none absolute inset-x-0 bottom-0 flex justify-center'
        : 'block w-full',
      this.class(),
    ),
  );

  protected readonly contentClass = computed(() =>
    cn(
      'relative',
      this.variant() === 'docked' && 'pointer-events-auto w-[min(784px,calc(100%-48px))]',
      this.variant() === 'card' &&
        'bg-card rounded-[26px] border shadow-[0_4px_16px_rgb(10_10_10/0.05)]',
      this.contentClassName(),
    ),
  );

  protected readonly bandHeight = computed(() => this.contentHeight() + R);

  protected readonly path = computed(() => {
    const w = this.width();
    const h = this.bandHeight();
    const notch = Math.min(NOTCH_MAX, w - 48);
    // Everything is in the SVG's space, which overhangs the panel by R on the left, right and
    // bottom so the band's drop shadow never shows at the panel's edges.
    const left = R + (w - notch) / 2;
    const right = left + notch;
    const side = Math.max(2 * R, h - SIDE_HEIGHT - R);
    const edge = w + 2 * R;
    return [
      `M0 ${side - R} L${R} ${side - R} Q${R} ${side} ${2 * R} ${side}`,
      `L${left - R} ${side} Q${left} ${side} ${left} ${side - R}`,
      `L${left} ${R} Q${left} 0 ${left + R} 0`,
      `L${right - R} 0 Q${right} 0 ${right} ${R}`,
      `L${right} ${side - R} Q${right} ${side} ${right + R} ${side}`,
      `L${w} ${side} Q${w + R} ${side} ${w + R} ${side - R}`,
      `L${edge} ${side - R} L${edge} ${h} L0 ${h} Z`,
    ].join(' ');
  });

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const observer = new ResizeObserver(() => {
        this.width.set(this.host.nativeElement.clientWidth);
        this.contentHeight.set(this.content().nativeElement.offsetHeight);
        this.occupied.emit(this.variant() === 'docked' ? this.contentHeight() : 0);
      });
      observer.observe(this.host.nativeElement);
      observer.observe(this.content().nativeElement);
      destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
