import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  model,
  signal,
} from '@angular/core';
import { REASONING_STATE, type ReasoningState } from './reasoning.state';

@Component({
  selector: 'pk-reasoning',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'class()',
  },
  providers: [{ provide: REASONING_STATE, useExisting: forwardRef(() => PkReasoning) }],
  template: `<ng-content />`,
})
export class PkReasoning implements ReasoningState {
  public readonly open = model<boolean | undefined>(undefined);
  public readonly isStreaming = input<boolean>(false);
  public readonly class = input<string>('');

  private readonly internalOpen = signal<boolean>(false);
  private wasAutoOpened = false;

  public readonly isOpen = computed(() => {
    const o = this.open();
    return o !== undefined ? o : this.internalOpen();
  });

  constructor() {
    effect(() => {
      const streaming = this.isStreaming();
      const isControlled = this.open() !== undefined;
      if (streaming && !this.wasAutoOpened) {
        if (!isControlled) this.internalOpen.set(true);
        this.wasAutoOpened = true;
      } else if (!streaming && this.wasAutoOpened) {
        if (!isControlled) this.internalOpen.set(false);
        this.wasAutoOpened = false;
      }
    });
  }

  public toggle(): void {
    const isControlled = this.open() !== undefined;
    const next = !this.isOpen();
    if (!isControlled) this.internalOpen.set(next);
    this.open.set(next);
  }
}
