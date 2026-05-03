import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';
import { STEPS_STATE } from './steps.state';

@Component({
  selector: 'pk-steps-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmIconImports],
  providers: [provideIcons({ lucideChevronDown })],
  template: `
    <button
      type="button"
      [class]="computedClass()"
      [attr.data-state]="state.isOpen() ? 'open' : 'closed'"
      (click)="state.toggle()"
    >
      <div class="flex items-center gap-2">
        @if (hasLeftIcon()) {
          <span class="relative inline-flex size-4 items-center justify-center">
            <span class="transition-opacity" [class.group-hover:opacity-0]="swapIconOnHover()">
              <ng-content select="[leftIcon]" />
            </span>
            @if (swapIconOnHover()) {
              <ng-icon
                hlm
                size="xs"
                name="lucideChevronDown"
                class="absolute opacity-0 transition-opacity group-hover:opacity-100 group-data-[state=open]:rotate-180"
              />
            }
          </span>
        }
        <span><ng-content /></span>
      </div>
      @if (!hasLeftIcon()) {
        <ng-icon
          hlm
          size="xs"
          name="lucideChevronDown"
          class="transition-transform group-data-[state=open]:rotate-180"
        />
      }
    </button>
  `,
})
export class PkStepsTrigger {
  public readonly leftIcon = input<boolean>(false);
  public readonly swapIconOnHover = input<boolean>(true);
  public readonly class = input<string>('');

  protected readonly state = inject(STEPS_STATE);
  protected readonly hasLeftIcon = computed(() => this.leftIcon());
  protected readonly computedClass = computed(() =>
    cn(
      'group text-muted-foreground hover:text-foreground flex w-full cursor-pointer items-center justify-start gap-1 text-sm transition-colors',
      this.class(),
    ),
  );
}
