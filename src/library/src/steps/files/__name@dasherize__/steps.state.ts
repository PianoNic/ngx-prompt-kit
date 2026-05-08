import { InjectionToken, Signal } from '@angular/core';

export interface StepsState {
  isOpen: Signal<boolean>;
  toggle: () => void;
}

export const STEPS_STATE = new InjectionToken<StepsState>('STEPS_STATE');
