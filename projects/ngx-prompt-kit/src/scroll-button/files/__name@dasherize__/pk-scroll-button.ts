import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { HlmButton, type ButtonVariants } from '@spartan-ng/helm/button';
import { CHAT_CONTAINER_STATE } from '../chat-container/chat-container.state';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-scroll-button',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton],
  template: `
    <button
      hlmBtn
      [variant]="variant()"
      [size]="size()"
      [class]="computedClass()"
      (click)="onClick()"
      type="button"
      aria-label="Scroll to bottom"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </button>
  `,
})
export class PkScrollButton {
  public readonly variant = input<ButtonVariants['variant']>('outline');
  public readonly size = input<ButtonVariants['size']>('icon-sm');
  public readonly class = input<string>('');

  private readonly state = inject(CHAT_CONTAINER_STATE);

  protected readonly computedClass = computed(() =>
    cn(
      'h-10 w-10 rounded-full transition-all duration-150 ease-out',
      this.state.isAtBottom()
        ? 'pointer-events-none translate-y-4 scale-95 opacity-0'
        : 'translate-y-0 scale-100 opacity-100',
      this.class(),
    ),
  );

  protected onClick(): void {
    this.state.scrollToBottom();
  }
}
