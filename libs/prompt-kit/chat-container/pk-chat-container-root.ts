import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  computed,
  forwardRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { cn } from '../utils/cn';
import { CHAT_CONTAINER_STATE, type ChatContainerState } from './chat-container.state';

const NEAR_BOTTOM_THRESHOLD = 32;

/**
 * The scrolling log of a chat. It follows a growing reply while the reader is at the bottom, or,
 * after `pinToTop()`, keeps a just-sent message at the top of the view the way Claude does, with
 * room below it that shrinks as the reply fills it.
 */
@Component({
  selector: 'pk-chat-container-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'log',
    '[class]': 'computedClass()',
    '(scroll)': 'onScroll()',
  },
  providers: [
    { provide: CHAT_CONTAINER_STATE, useExisting: forwardRef(() => PkChatContainerRoot) },
  ],
  template: `<ng-content />
    <div #spacer aria-hidden="true" class="shrink-0"></div>`,
})
export class PkChatContainerRoot implements AfterViewInit, ChatContainerState {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('flex flex-col overflow-y-auto', this.class()),
  );

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly spacer = viewChild.required<ElementRef<HTMLElement>>('spacer');

  public readonly isAtBottom = signal<boolean>(true);
  /** Whether there is content below the view (the room kept under a pinned message not counted). */
  public readonly canScrollDown = signal<boolean>(false);

  private observer?: ResizeObserver;
  private lastScrollTop = 0;
  /** The message held at the top, and how far below the view's top edge it sits. */
  private pinned: { element: HTMLElement; offset: number } | null = null;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.scrollToBottom('auto');
    // Following a growing reply scrolls instantly: a smooth scroll is still animating when the next
    // token lands, and the half-way positions it passes through would read as the reader leaving.
    this.observer = new ResizeObserver(() => {
      if (this.pinned) this.fitSpacer();
      else if (this.isAtBottom()) this.scrollToBottom('auto');
      this.measure();
    });
    const spacer = this.spacer().nativeElement;
    Array.from(this.host.nativeElement.children)
      .filter((child) => child !== spacer)
      .forEach((child) => this.observer!.observe(child));
    this.observer.observe(this.host.nativeElement);
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  /**
   * Stops following only when the reader scrolls up, and picks it up again once they are back at
   * the bottom. Scrolling down or content growing never counts as leaving.
   */
  protected onScroll(): void {
    const el = this.host.nativeElement;
    const distance = this.contentHeight() - el.scrollTop - el.clientHeight;
    if (distance <= NEAR_BOTTOM_THRESHOLD && !this.pinned) this.isAtBottom.set(true);
    else if (el.scrollTop < this.lastScrollTop - 1) this.isAtBottom.set(false);
    this.lastScrollTop = el.scrollTop;
    this.measure();
  }

  public scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    if (!this.isBrowser) return;
    this.pinned = null;
    this.setSpacer(0);
    const el = this.host.nativeElement;
    el.scrollTo({ top: el.scrollHeight, behavior });
    this.lastScrollTop = el.scrollHeight;
    this.isAtBottom.set(true);
    this.measure();
  }

  /**
   * Scrolls `element` (a turn inside the container) to the top of the view, `offset` pixels below
   * the edge, and keeps it there while the content below grows, instead of following the bottom.
   * Room is kept below it as long as the content is too short to fill the view.
   */
  public pinToTop(element: HTMLElement, offset = 16): void {
    if (!this.isBrowser) return;
    this.pinned = { element, offset };
    this.isAtBottom.set(false);
    this.fitSpacer();
    const el = this.host.nativeElement;
    el.scrollTo({ top: Math.max(0, this.topOf(element) - offset), behavior: 'smooth' });
    this.measure();
  }

  /** The room under the pinned message: enough for it to reach the top, none once the reply fills the view. */
  private fitSpacer(): void {
    if (!this.pinned) return;
    const el = this.host.nativeElement;
    const below = this.contentHeight() - (this.topOf(this.pinned.element) - this.pinned.offset);
    this.setSpacer(Math.max(0, el.clientHeight - below));
  }

  private setSpacer(height: number): void {
    this.spacer().nativeElement.style.height = `${height}px`;
  }

  /** The scroll height without the room kept under a pinned message. */
  private contentHeight(): number {
    return this.host.nativeElement.scrollHeight - this.spacer().nativeElement.offsetHeight;
  }

  /** Where `element` sits in the scrolled content. */
  private topOf(element: HTMLElement): number {
    const el = this.host.nativeElement;
    return element.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop;
  }

  private measure(): void {
    const el = this.host.nativeElement;
    this.canScrollDown.set(
      this.contentHeight() - el.scrollTop - el.clientHeight > NEAR_BOTTOM_THRESHOLD,
    );
  }
}
