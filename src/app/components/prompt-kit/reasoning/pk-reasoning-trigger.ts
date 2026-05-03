import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { cn } from '../utils/cn';
import { REASONING_STATE } from './reasoning.state';

@Component({
  selector: 'pk-reasoning-trigger',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button type="button" [class]="computedClass()" (click)="state.toggle()">
      <span class="text-primary"><ng-content /></span>
      <span
        class="transform transition-transform"
        [class.rotate-180]="state.isOpen()"
        aria-hidden="true"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </span>
    </button>
  `,
})
export class PkReasoningTrigger {
  public readonly class = input<string>('');
  protected readonly state = inject(REASONING_STATE);
  protected readonly computedClass = computed(() =>
    cn('flex cursor-pointer items-center gap-2', this.class()),
  );
}
