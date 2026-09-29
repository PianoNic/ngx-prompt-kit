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
} from '@angular/core';
import { cn } from '../utils/cn';
import { CHAT_CONTAINER_STATE, type ChatContainerState } from './chat-container.state';

const NEAR_BOTTOM_THRESHOLD = 32;

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
  template: `<ng-content />`,
})
export class PkChatContainerRoot implements AfterViewInit, ChatContainerState {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('flex flex-col overflow-y-auto', this.class()),
  );

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  public readonly isAtBottom = signal<boolean>(true);
  private observer?: ResizeObserver;
  private lastScrollTop = 0;

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.scrollToBottom('auto');
    // Following a growing reply scrolls instantly: a smooth scroll is still animating when the next
    // token lands, and the half-way positions it passes through would read as the reader leaving.
    this.observer = new ResizeObserver(() => {
      if (this.isAtBottom()) this.scrollToBottom('auto');
    });
    Array.from(this.host.nativeElement.children).forEach((c) =>
      this.observer!.observe(c as Element),
    );
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  /**
   * Stops following only when the reader scrolls up, and picks it up again once they are back at
   * the bottom. Scrolling down or content growing never counts as leaving.
   */
  protected onScroll(): void {
    const el = this.host.nativeElement;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    if (distance <= NEAR_BOTTOM_THRESHOLD) this.isAtBottom.set(true);
    else if (el.scrollTop < this.lastScrollTop - 1) this.isAtBottom.set(false);
    this.lastScrollTop = el.scrollTop;
  }

  public scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    if (!this.isBrowser) return;
    const el = this.host.nativeElement;
    el.scrollTo({ top: el.scrollHeight, behavior });
    this.lastScrollTop = el.scrollHeight;
    this.isAtBottom.set(true);
  }
}
