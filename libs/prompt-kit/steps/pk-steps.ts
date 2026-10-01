/**
 * pk-steps — controlled-or-uncontrolled disclosure for an agent-step list, built on spartan's
 * brain collapsible.
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
  effect,
  forwardRef,
  inject,
  input,
  model,
  OnInit,
  untracked,
} from '@angular/core';
import { BrnCollapsible } from '@spartan-ng/brain/collapsible';
import { STEPS_STATE, type StepsState } from './steps.state';

@Component({
  selector: 'pk-steps',
  changeDetection: ChangeDetectionStrategy.OnPush,
  hostDirectives: [BrnCollapsible],
  host: {
    'data-slot': 'steps',
    '[class]': 'class()',
  },
  providers: [{ provide: STEPS_STATE, useExisting: forwardRef(() => PkSteps) }],
  template: `<ng-content />`,
})
export class PkSteps implements StepsState, OnInit {
  public readonly open = model<boolean | undefined>(undefined);
  public readonly defaultOpen = input<boolean>(true);
  public readonly class = input<string>('');

  private readonly collapsible = inject(BrnCollapsible);
  private syncing = false;

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
