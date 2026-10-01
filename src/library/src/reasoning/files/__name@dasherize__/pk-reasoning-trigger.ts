import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnCollapsibleTrigger } from '@spartan-ng/brain/collapsible';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-reasoning-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrnCollapsibleTrigger, NgIcon],
  providers: [provideIcons({ lucideChevronDown })],
  template: `
    <button brnCollapsibleTrigger [class]="computedClass()">
      <span class="text-primary"><ng-content /></span>
      <ng-icon
        name="lucideChevronDown"
        aria-hidden="true"
        class="text-[length:--spacing(4)] transition-transform group-data-[state=open]:rotate-180"
      />
    </button>
  `,
})
export class PkReasoningTrigger {
  public readonly class = input<string>('');
  protected readonly computedClass = computed(() =>
    cn('group flex cursor-pointer items-center gap-2', this.class()),
  );
}
