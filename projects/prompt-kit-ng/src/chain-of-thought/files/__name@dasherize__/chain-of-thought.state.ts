import { InjectionToken, Signal } from '@angular/core';

export interface ChainOfThoughtStepState {
  isOpen: Signal<boolean>;
  isLast: Signal<boolean>;
  toggle: () => void;
}

export const CHAIN_OF_THOUGHT_STEP_STATE = new InjectionToken<ChainOfThoughtStepState>(
  'CHAIN_OF_THOUGHT_STEP_STATE',
);
