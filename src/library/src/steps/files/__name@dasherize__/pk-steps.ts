/**
 * pk-steps — controlled-or-uncontrolled disclosure for an agent-step list.
 *
 * Inputs:
 *   open:        model<boolean | undefined> — uncontrolled when undefined
 *   defaultOpen: boolean — initial state when uncontrolled (default true)
 *   class:       string
 */
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { STEPS_STATE, type StepsState } from './steps.state';

@Component({
  selector: 'pk-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'data-slot': 'steps',
    '[attr.data-state]': "isOpen() ? 'open' : 'closed'",
    '[class]': 'class()',
  },
  providers: [{ provide: STEPS_STATE, useExisting: forwardRef(() => PkSteps) }],
  template: `<ng-content />`,
})
export class PkSteps implements StepsState {
  public readonly open = model<boolean | undefined>(undefined);
  public readonly defaultOpen = input<boolean>(true);
  public readonly class = input<string>('');

  private readonly internalOpen = signal<boolean>(true);

  constructor() {
    // Apply defaultOpen as initial internal state (only used when uncontrolled).
    this.internalOpen.set(this.defaultOpen());
  }

  public readonly isOpen = computed(() => {
    const o = this.open();
    return o !== undefined ? o : this.internalOpen();
  });

  public toggle(): void {
    const isControlled = this.open() !== undefined;
    const next = !this.isOpen();
    if (!isControlled) this.internalOpen.set(next);
    this.open.set(next);
  }
}
