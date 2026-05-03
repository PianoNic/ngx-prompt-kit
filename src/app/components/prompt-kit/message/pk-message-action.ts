import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import type { BrnTooltipPosition } from '@spartan-ng/brain/tooltip';

@Component({
  selector: 'pk-message-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmTooltip],
  template: `
    <ng-template #tip>
      <span [class]="class()">{{ tooltip() }}</span>
    </ng-template>
    <span [hlmTooltip]="tip" [position]="side()">
      <ng-content />
    </span>
  `,
})
export class PkMessageAction {
  public readonly tooltip = input.required<string>();
  public readonly side = input<BrnTooltipPosition>('top');
  public readonly class = input<string>('');
}
