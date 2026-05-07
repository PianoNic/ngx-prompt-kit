import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-code-block',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'computedClass()',
  },
  template: `<ng-content />`,
})
export class PkCodeBlock {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn(
      'not-prose flex w-full flex-col overflow-clip border',
      'border-border bg-card text-card-foreground rounded-xl',
      this.class(),
    ),
  );
}
