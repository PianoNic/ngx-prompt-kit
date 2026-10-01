import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  inject,
  input,
  model,
  OnInit,
  untracked,
} from '@angular/core';
import { BrnCollapsible } from '@spartan-ng/brain/collapsible';
import {
  CHAIN_OF_THOUGHT_STEP_STATE,
  type ChainOfThoughtStepState,
} from './chain-of-thought.state';

/** One step of the timeline: a spartan brain collapsible with the line down to the next step. */
@Component({
  selector: 'pk-chain-of-thought-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnCollapsible],
  host: {
    'data-slot': 'cot-step',
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
export class PkChainOfThoughtStep implements ChainOfThoughtStepState, OnInit {
  public readonly open = model<boolean | undefined>(undefined);
  public readonly defaultOpen = input<boolean>(false);
  public readonly last = input<boolean>(false);

  private readonly collapsible = inject(BrnCollapsible);
  private syncing = false;

  public readonly isOpen = computed(() => this.collapsible.expanded());
  public readonly isLast = computed(() => this.last());

  constructor() {
    // The trigger toggles the collapsible directly; report that through `open`.
    this.collapsible.expanded.subscribe((expanded) => {
      if (!this.syncing) this.open.set(expanded);
    });
    effect(() => {
      const open = this.open();
      if (open !== undefined) untracked(() => this.setExpanded(open));
    });
  }

  ngOnInit(): void {
    if (this.open() === undefined) this.setExpanded(this.defaultOpen());
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
