import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import {
  CHAIN_OF_THOUGHT_STEP_STATE,
  type ChainOfThoughtStepState,
} from './chain-of-thought.state';

@Component({
  selector: 'pk-chain-of-thought-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'cot-step',
    '[attr.data-state]': "isOpen() ? 'open' : 'closed'",
    '[attr.data-last]': 'last()',
    class: 'group block',
  },
  providers: [
    { provide: CHAIN_OF_THOUGHT_STEP_STATE, useExisting: forwardRef(() => PkChainOfThoughtStep) },
  ],
  template: `
    <ng-content />
    @if (!last()) {
      <div class="flex justify-start">
        <div class="bg-primary/20 ml-1.75 h-4 w-px"></div>
      </div>
    }
  `,
})
export class PkChainOfThoughtStep implements ChainOfThoughtStepState {
  public readonly open = model<boolean | undefined>(undefined);
  public readonly defaultOpen = input<boolean>(false);
  public readonly last = input<boolean>(false);

  private readonly internalOpen = signal<boolean>(false);

  constructor() {
    this.internalOpen.set(this.defaultOpen());
  }

  public readonly isOpen = computed(() => {
    const o = this.open();
    return o !== undefined ? o : this.internalOpen();
  });

  public readonly isLast = computed(() => this.last());

  public toggle(): void {
    const isControlled = this.open() !== undefined;
    const next = !this.isOpen();
    if (!isControlled) this.internalOpen.set(next);
    this.open.set(next);
  }
}
