// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import { cn } from '../utils/cn';
import type { MessageAction } from './pk-message-actions-bar-types';

@Component({
  selector: 'pk-message-actions-bar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmButton, HlmIconImports, HlmTooltip],
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    @for (action of actions(); track action.id) {
      <ng-template #tip>
        <span>{{ action.label }}</span>
      </ng-template>
      <button
        [hlmTooltip]="tip"
        hlmBtn
        variant="ghost"
        size="icon-sm"
        type="button"
        [disabled]="action.disabled === true"
        [attr.aria-label]="action.label"
        [attr.aria-pressed]="action.active === true ? 'true' : null"
        [class]="buttonClass(action)"
        (click)="actionPicked.emit(action)"
      >
        <ng-icon hlm size="xs" [name]="action.icon" />
      </button>
    }
  `,
})
export class PkMessageActionsBar {
  public readonly actions = input.required<readonly MessageAction[]>();
  public readonly visible = input<'hover' | 'always'>('hover');
  public readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  public readonly class = input<string>('');

  public readonly actionPicked = output<MessageAction>();

  protected readonly hostClass = computed(() => {
    const layout =
      this.orientation() === 'vertical' ? 'flex flex-col gap-0.5' : 'flex items-center gap-0.5';
    const reveal =
      this.visible() === 'hover'
        ? 'opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100'
        : '';
    return cn(layout, reveal, this.class());
  });

  protected buttonClass(action: MessageAction): string {
    const active = action.active === true ? 'bg-accent text-primary' : '';
    const variant =
      action.variant === 'destructive' ? 'text-destructive hover:text-destructive' : '';
    return cn(active, variant);
  }
}
