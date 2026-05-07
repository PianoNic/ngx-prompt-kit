import { InjectionToken, Signal } from '@angular/core';

export interface ChatContainerState {
  isAtBottom: Signal<boolean>;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
}

export const CHAT_CONTAINER_STATE = new InjectionToken<ChatContainerState>('CHAT_CONTAINER_STATE');
