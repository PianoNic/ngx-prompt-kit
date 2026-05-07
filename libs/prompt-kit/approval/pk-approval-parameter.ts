// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-approval-parameter',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    <span class="text-muted-foreground shrink-0 text-xs">{{ label() }}</span>
    <code [class]="valueClass()">{{ value() }}</code>
  `,
})
export class PkApprovalParameter {
  public readonly label = input.required<string>();
  public readonly value = input.required<string>();
  public readonly truncate = input<boolean>(true);
  public readonly class = input<string>('');

  protected readonly hostClass = computed(() =>
    cn('flex items-baseline gap-3 text-sm', this.class()),
  );

  protected readonly valueClass = computed(() =>
    cn(
      'text-foreground bg-muted min-w-0 flex-1 rounded px-1.5 py-0.5 font-mono text-xs',
      this.truncate() ? 'truncate' : 'break-all',
    ),
  );
}
