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

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;
    this.scrollToBottom('auto');
    this.observer = new ResizeObserver(() => {
      if (this.isAtBottom()) this.scrollToBottom('smooth');
    });
    Array.from(this.host.nativeElement.children).forEach((c) =>
      this.observer!.observe(c as Element),
    );
    this.destroyRef.onDestroy(() => this.observer?.disconnect());
  }

  protected onScroll(): void {
    const el = this.host.nativeElement;
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight;
    this.isAtBottom.set(distance <= NEAR_BOTTOM_THRESHOLD);
  }

  public scrollToBottom(behavior: ScrollBehavior = 'smooth'): void {
    if (!this.isBrowser) return;
    const el = this.host.nativeElement;
    el.scrollTo({ top: el.scrollHeight, behavior });
    this.isAtBottom.set(true);
  }
}
