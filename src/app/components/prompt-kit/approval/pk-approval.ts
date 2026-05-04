// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLoaderCircle } from '@ng-icons/lucide';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmCard } from '@spartan-ng/helm/card';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';
import { PkApprovalParameter } from './pk-approval-parameter';
import type { ApprovalParameter, ApprovalSeverity } from './pk-approval-types';

@Component({
  selector: 'pk-approval',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmBadge, HlmButton, HlmCard, HlmIconImports, PkApprovalParameter],
  providers: [provideIcons({ lucideLoaderCircle })],
  host: {
    '[class]': 'hostClass()',
    '(keydown.enter)': 'onEnterKey($event)',
    '(keydown.escape)': 'onEscapeKey($event)',
    tabindex: '-1',
  },
  template: `
    <div hlmCard [class]="cardClass()">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0 flex-1">
          <h3 class="text-foreground text-base font-medium leading-tight">{{ title() }}</h3>
          @if (description(); as d) {
            <p class="text-muted-foreground mt-1 text-sm">{{ d }}</p>
          }
        </div>
        @if (action(); as a) {
          <span hlmBadge [class]="badgeClass()">{{ a }}</span>
        }
      </div>

      @if (parameters().length > 0) {
        <div class="border-border mt-4 flex flex-col gap-2 border-t pt-3">
          @for (p of parameters(); track p.label) {
            <pk-approval-parameter
              [label]="p.label"
              [value]="p.value"
              [truncate]="p.truncate ?? true"
            />
          }
        </div>
      }

      <div class="mt-4 flex items-center justify-end gap-2">
        <button
          hlmBtn
          variant="ghost"
          size="sm"
          type="button"
          [disabled]="pending()"
          (click)="rejected.emit()"
        >
          {{ rejectLabel() }}
        </button>
        <button
          hlmBtn
          [variant]="approveVariant()"
          size="sm"
          type="button"
          [disabled]="pending()"
          (click)="approved.emit()"
        >
          @if (pending()) {
            <ng-icon hlm size="xs" name="lucideLoaderCircle" class="animate-spin" />
          }
          {{ approveLabel() }}
        </button>
      </div>
    </div>
  `,
})
export class PkApproval {
  public readonly title = input.required<string>();
  public readonly description = input<string | undefined>(undefined);
  public readonly action = input<string | undefined>(undefined);
  public readonly severity = input<ApprovalSeverity>('info');
  public readonly parameters = input<readonly ApprovalParameter[]>([]);
  public readonly approveLabel = input<string>('Approve');
  public readonly rejectLabel = input<string>('Reject');
  public readonly pending = input<boolean>(false);
  public readonly class = input<string>('');

  public readonly approved = output<void>();
  public readonly rejected = output<void>();

  protected readonly hostClass = computed(() => cn('block outline-none', this.class()));

  protected readonly cardClass = computed(() => 'p-4');

  protected readonly badgeClass = computed(() => {
    const sev = this.severity();
    if (sev === 'destructive') return 'bg-destructive/10 text-destructive border-destructive/20';
    if (sev === 'warning')
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    return 'bg-primary/10 text-primary border-primary/20';
  });

  protected readonly approveVariant = computed<'default' | 'destructive'>(() =>
    this.severity() === 'destructive' ? 'destructive' : 'default',
  );

  protected onEnterKey(event: Event): void {
    if (this.pending()) return;
    event.preventDefault();
    this.approved.emit();
  }

  protected onEscapeKey(event: Event): void {
    if (this.pending()) return;
    event.preventDefault();
    this.rejected.emit();
  }
}
