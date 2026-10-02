// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';

/**
 * "‹ 2/3 ›": which version of a turn is shown, when it was edited or retried, with buttons to the
 * previous and next one. `index` counts from 0; `selected` gives the index to show.
 */
@Component({
  selector: 'pk-turn-versions',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, NgIcon],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  host: { class: 'text-muted-foreground inline-flex items-center text-xs tabular-nums' },
  template: `
    <button
      hlmBtn
      variant="ghost"
      size="icon-sm"
      type="button"
      aria-label="Previous version"
      [disabled]="disabled() || index() <= 0"
      (click)="selected.emit(index() - 1)"
    >
      <ng-icon name="lucideChevronLeft" class="text-[length:--spacing(4)]" />
    </button>
    <span aria-live="polite">{{ index() + 1 }}/{{ count() }}</span>
    <button
      hlmBtn
      variant="ghost"
      size="icon-sm"
      type="button"
      aria-label="Next version"
      [disabled]="disabled() || index() >= count() - 1"
      (click)="selected.emit(index() + 1)"
    >
      <ng-icon name="lucideChevronRight" class="text-[length:--spacing(4)]" />
    </button>
  `,
})
export class PkTurnVersions {
  public readonly index = input.required<number>();
  public readonly count = input.required<number>();
  public readonly disabled = input(false);
  public readonly selected = output<number>();
}
