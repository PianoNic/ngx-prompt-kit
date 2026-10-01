import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  untracked,
} from '@angular/core';
import { BrnCollapsible } from '@spartan-ng/brain/collapsible';
import { REASONING_STATE, type ReasoningState } from './reasoning.state';

/**
 * A collapsible block for a model's reasoning, built on spartan's brain collapsible.
 *
 * Uncontrolled by default; bind `[(open)]` to control it. While `isStreaming` it opens on its own
 * and closes again when streaming ends, until the reader toggles it themselves.
 */
@Component({
  selector: 'pk-reasoning',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnCollapsible],
  host: {
    'data-slot': 'reasoning',
    '[class]': 'class()',
  },
  providers: [{ provide: REASONING_STATE, useExisting: forwardRef(() => PkReasoning) }],
  template: `<ng-content />`,
})
export class PkReasoning implements ReasoningState {
  public readonly open = model<boolean | undefined>(undefined);
  public readonly isStreaming = input<boolean>(false);
  public readonly class = input<string>('');

  private readonly collapsible = inject(BrnCollapsible);
  private syncing = false;
  private wasAutoOpened = false;

  public readonly isOpen = computed(() => this.collapsible.expanded());

  constructor() {
    // The trigger toggles the collapsible directly; report that through `open`.
    this.collapsible.expanded.subscribe((expanded) => {
      if (!this.syncing) this.open.set(expanded);
    });
    effect(() => {
      const open = this.open();
      if (open !== undefined) untracked(() => this.setExpanded(open));
    });
    effect(() => {
      const streaming = this.isStreaming();
      untracked(() => {
        const isControlled = this.open() !== undefined;
        if (streaming && !this.wasAutoOpened) {
          if (!isControlled) this.setExpanded(true);
          this.wasAutoOpened = true;
        } else if (!streaming && this.wasAutoOpened) {
          if (!isControlled) this.setExpanded(false);
          this.wasAutoOpened = false;
        }
      });
    });
  }

  public toggle(): void {
    this.collapsible.toggle();
  }

  private setExpanded(expanded: boolean): void {
    this.syncing = true;
    this.collapsible.expanded.set(expanded);
    this.syncing = false;
  }
}
