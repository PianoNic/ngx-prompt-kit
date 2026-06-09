/**
 * pk-thinking-bar — compact "still thinking..." indicator with optional click + stop.
 *
 * Inputs:
 *   text:       string — label, default "Thinking"
 *   stopLabel:  string — label of the stop button, default "Answer now"
 *   showStop:   boolean — show the stop affordance, default false
 *   clickable:  boolean — render as a clickable button (with chevron), default false
 *   class:      string
 *
 * Outputs:
 *   stopped:    EventEmitter<void> — when stop is clicked
 *   clicked:    EventEmitter<void> — when the bar itself is clicked (only when clickable)
 *
 * Note: React used callback presence (onStop, onClick) as the toggle. We expose
 * explicit boolean inputs (showStop, clickable) and always-defined outputs to
 * keep the API signal-friendly.
 */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronRight } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';
import { PkTextShimmer } from '../text-shimmer/pk-text-shimmer';

@Component({
  selector: 'pk-thinking-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmIconImports, PkTextShimmer],
  providers: [provideIcons({ lucideChevronRight })],
  template: `
    <div [class]="computedClass()">
      @if (clickable()) {
        <button
          type="button"
          (click)="clicked.emit()"
          class="flex items-center gap-1 text-sm transition-opacity hover:opacity-80"
        >
          <pk-text-shimmer class="font-medium" [text]="text()" />
          <ng-icon hlm size="xs" name="lucideChevronRight" class="text-muted-foreground" />
        </button>
      } @else {
        <pk-text-shimmer class="cursor-default font-medium" [text]="text()" />
      }
      @if (showStop()) {
        <button
          type="button"
          (click)="stopped.emit()"
          class="text-muted-foreground hover:text-foreground border-muted-foreground/50 hover:border-foreground border-b border-dotted text-sm transition-colors"
        >
          {{ stopLabel() }}
        </button>
      }
    </div>
  `,
})
export class PkThinkingBar {
  public readonly text = input<string>('Thinking');
  public readonly stopLabel = input<string>('Answer now');
  public readonly showStop = input<boolean>(false);
  public readonly clickable = input<boolean>(false);
  public readonly class = input<string>('');

  public readonly stopped = output<void>();
  public readonly clicked = output<void>();

  protected readonly computedClass = computed(() =>
    cn('flex w-full items-center justify-between', this.class()),
  );
}
