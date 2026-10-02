import { InjectionToken, Signal } from '@angular/core';

export interface ChatContainerState {
  isAtBottom: Signal<boolean>;
  /** Whether there is content below the view, the room kept under a pinned message not counted. */
  canScrollDown: Signal<boolean>;
  scrollToBottom: (behavior?: ScrollBehavior) => void;
  /** Holds a turn at the top of the view while the reply below it grows, as Claude does with a sent message. */
  pinToTop: (element: HTMLElement, offset?: number) => void;
}

export const CHAT_CONTAINER_STATE = new InjectionToken<ChatContainerState>('CHAT_CONTAINER_STATE');
