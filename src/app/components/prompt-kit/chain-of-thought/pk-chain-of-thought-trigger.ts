import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideChevronDown, lucideCircle } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { cn } from '../utils/cn';
import { CHAIN_OF_THOUGHT_STEP_STATE } from './chain-of-thought.state';

@Component({
  selector: 'pk-chain-of-thought-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HlmIconImports],
  providers: [provideIcons({ lucideChevronDown, lucideCircle })],
  template: `
    <button
      type="button"
      [class]="computedClass()"
      [attr.data-state]="state.isOpen() ? 'open' : 'closed'"
      (click)="state.toggle()"
    >
      <div class="flex items-center gap-2">
        @if (leftIcon()) {
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
        } @else {
          <span class="relative inline-flex size-4 items-center justify-center">
            <ng-icon hlm size="xs" name="lucideCircle" class="size-2 fill-current" />
          </span>
        }
        <span><ng-content /></span>
      </div>
      @if (!leftIcon()) {
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
export class PkChainOfThoughtTrigger {
  public readonly leftIcon = input<boolean>(false);
  public readonly swapIconOnHover = input<boolean>(true);
  public readonly class = input<string>('');

  protected readonly state = inject(CHAIN_OF_THOUGHT_STEP_STATE);

  protected readonly computedClass = computed(() =>
    cn(
      'group text-muted-foreground hover:text-foreground flex cursor-pointer items-center justify-start gap-1 text-left text-sm transition-colors',
      this.class(),
    ),
  );
}
