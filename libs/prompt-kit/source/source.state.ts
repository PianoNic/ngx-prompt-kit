import { InjectionToken, Signal } from '@angular/core';

export interface SourceState {
  href: Signal<string>;
  domain: Signal<string>;
}

export const SOURCE_STATE = new InjectionToken<SourceState>('SOURCE_STATE');
