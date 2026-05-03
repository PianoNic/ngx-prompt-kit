import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { BrnTooltipPosition } from '@spartan-ng/brain/tooltip';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';

@Component({
  selector: 'pk-prompt-input-action',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmTooltip],
  template: `
    <ng-template #tip>
      <span [class]="class()">{{ tooltip() }}</span>
    </ng-template>
    <span [hlmTooltip]="tip" [position]="side()" (click)="$event.stopPropagation()">
      <ng-content />
    </span>
  `,
})
export class PkPromptInputAction {
  public readonly tooltip = input.required<string>();
  public readonly side = input<BrnTooltipPosition>('top');
  public readonly class = input<string>('');
}
