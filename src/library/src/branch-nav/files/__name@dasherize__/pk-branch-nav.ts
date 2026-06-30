// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronLeft, lucideChevronRight } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-branch-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, HlmIconImports],
  providers: [provideIcons({ lucideChevronLeft, lucideChevronRight })],
  host: {
    '[class]': 'hostClass()',
    '(keydown.arrowleft)': 'onArrowLeft($event)',
    '(keydown.arrowright)': 'onArrowRight($event)',
    tabindex: '0',
  },
  template: `
    @if (total() > 1) {
      <button
        hlmBtn
        variant="ghost"
        size="icon-sm"
        type="button"
        [disabled]="atStart()"
        (click)="prev()"
        aria-label="Previous branch"
      >
        <ng-icon hlm size="xs" name="lucideChevronLeft" />
      </button>
      <span class="text-muted-foreground tabular-nums select-none text-xs">
        {{ label() }}
      </span>
      <button
        hlmBtn
        variant="ghost"
        size="icon-sm"
        type="button"
        [disabled]="atEnd()"
        (click)="next()"
        aria-label="Next branch"
      >
        <ng-icon hlm size="xs" name="lucideChevronRight" />
      </button>
    }
  `,
})
export class PkBranchNav {
  public readonly current = input.required<number>();
  public readonly total = input.required<number>();
  public readonly compact = input<boolean>(false);
  public readonly class = input<string>('');

  public readonly changed = output<number>();

  protected readonly hostClass = computed(() =>
    cn(
      // Empty when total === 1 — only the @if children render the inline-flex layout.
      this.total() > 1 ? 'inline-flex items-center gap-1 outline-none' : 'hidden',
      this.class(),
    ),
  );

  protected readonly atStart = computed(() => this.current() <= 1);
  protected readonly atEnd = computed(() => this.current() >= this.total());

  protected readonly label = computed(() =>
    this.compact()
      ? `${this.current()} / ${this.total()}`
      : `Branch ${this.current()} of ${this.total()}`,
  );

  protected prev(): void {
    if (this.atStart()) return;
    this.changed.emit(this.current() - 1);
  }

  protected next(): void {
    if (this.atEnd()) return;
    this.changed.emit(this.current() + 1);
  }

  protected onArrowLeft(event: Event): void {
    if (this.atStart()) return;
    event.preventDefault();
    this.changed.emit(this.current() - 1);
  }

  protected onArrowRight(event: Event): void {
    if (this.atEnd()) return;
    event.preventDefault();
    this.changed.emit(this.current() + 1);
  }
}
