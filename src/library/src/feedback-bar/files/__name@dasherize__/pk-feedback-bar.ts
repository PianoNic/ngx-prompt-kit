/**
 * pk-feedback-bar — pill bar with title + thumbs up/down + close.
 *
 * Inputs:
 *   title:    string — label
 *   class:    string
 *
 * Outputs:
 *   helpful:    EventEmitter<void>
 *   notHelpful: EventEmitter<void>
 *   closed:     EventEmitter<void>
 *
 * NOTE: Marked "new" upstream. Mirrors React API faithfully; project a custom
 * leading icon via the `icon` slot if needed (<ng-content select="[icon]">).
 */
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideThumbsDown, lucideThumbsUp, lucideX } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-feedback-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmIconImports],
  providers: [provideIcons({ lucideThumbsUp, lucideThumbsDown, lucideX })],
  template: `
    <div [class]="computedClass()">
      <div class="flex w-full items-center justify-between">
        <div class="flex flex-1 items-center justify-start gap-4 py-3 pl-4">
          <ng-content select="[icon]" />
          <span class="text-foreground font-medium">{{ title() }}</span>
        </div>
        <div class="flex items-center justify-center gap-0.5 px-3 py-0">
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors"
            aria-label="Helpful"
            (click)="helpful.emit()"
          >
            <ng-icon hlm size="sm" name="lucideThumbsUp" />
          </button>
          <button
            type="button"
            class="text-muted-foreground hover:text-foreground flex size-8 items-center justify-center rounded-md transition-colors"
            aria-label="Not helpful"
            (click)="notHelpful.emit()"
          >
            <ng-icon hlm size="sm" name="lucideThumbsDown" />
          </button>
        </div>
        <div class="border-border flex items-center justify-center border-l">
          <button
            type="button"
            (click)="closed.emit()"
            class="text-muted-foreground hover:text-foreground flex items-center justify-center rounded-md p-3"
            aria-label="Close"
          >
            <ng-icon hlm size="sm" name="lucideX" />
          </button>
        </div>
      </div>
    </div>
  `,
})
export class PkFeedbackBar {
  public readonly title = input<string>('');
  public readonly class = input<string>('');

  public readonly helpful = output<void>();
  public readonly notHelpful = output<void>();
  public readonly closed = output<void>();

  protected readonly computedClass = computed(() =>
    cn('bg-background border-border inline-flex rounded-[12px] border text-sm', this.class()),
  );
}
