import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { BrnCollapsibleTrigger } from '@spartan-ng/brain/collapsible';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-steps-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BrnCollapsibleTrigger, NgIcon],
  providers: [provideIcons({ lucideChevronDown })],
  template: `
    <button brnCollapsibleTrigger [class]="computedClass()">
      <div class="flex items-center gap-2">
        @if (hasLeftIcon()) {
          <span class="relative inline-flex size-4 items-center justify-center">
            <span
              class="flex items-center justify-center transition-opacity"
              [class.group-hover:opacity-0]="swapIconOnHover()"
            >
              <ng-content select="[leftIcon]" />
            </span>
            @if (swapIconOnHover()) {
              <ng-icon
                name="lucideChevronDown"
                class="text-[length:--spacing(3)] absolute opacity-0 transition-opacity group-hover:opacity-100 group-data-[state=open]:rotate-180"
              />
            }
          </span>
        }
        <span><ng-content /></span>
      </div>
      @if (!hasLeftIcon()) {
        <ng-icon
          name="lucideChevronDown"
          class="text-[length:--spacing(3)] transition-transform group-data-[state=open]:rotate-180"
        />
      }
    </button>
  `,
})
export class PkStepsTrigger {
  public readonly leftIcon = input<boolean>(false);
  public readonly swapIconOnHover = input<boolean>(true);
  public readonly class = input<string>('');

  protected readonly hasLeftIcon = computed(() => this.leftIcon());
  protected readonly computedClass = computed(() =>
    cn(
      'group text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center justify-start gap-1 text-sm transition-colors',
      this.class(),
    ),
  );
}
