import { InjectionToken, Signal } from '@angular/core';

export interface ReasoningState {
  isOpen: Signal<boolean>;
  toggle: () => void;
}

export const REASONING_STATE = new InjectionToken<ReasoningState>('REASONING_STATE');
