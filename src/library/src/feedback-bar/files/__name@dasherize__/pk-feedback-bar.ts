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
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideThumbsDown, lucideThumbsUp, lucideX } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-feedback-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, NgIcon],
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
            hlmBtn
            variant="ghost"
            size="icon"
            type="button"
            class="text-muted-foreground"
            aria-label="Helpful"
            (click)="helpful.emit()"
          >
            <ng-icon name="lucideThumbsUp" class="text-[length:--spacing(4)]" />
          </button>
          <button
            hlmBtn
            variant="ghost"
            size="icon"
            type="button"
            class="text-muted-foreground"
            aria-label="Not helpful"
            (click)="notHelpful.emit()"
          >
            <ng-icon name="lucideThumbsDown" class="text-[length:--spacing(4)]" />
          </button>
        </div>
        <div class="border-border flex items-center justify-center border-l">
          <button
            hlmBtn
            variant="ghost"
            size="icon"
            type="button"
            (click)="closed.emit()"
            class="text-muted-foreground m-1"
            aria-label="Close"
          >
            <ng-icon name="lucideX" class="text-[length:--spacing(4)]" />
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
