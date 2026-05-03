import { ElementRef, InjectionToken, Signal, signal } from '@angular/core';

export interface PromptInputState {
  isLoading: Signal<boolean>;
  disabled: Signal<boolean>;
  value: Signal<string>;
  maxHeight: Signal<number | string>;
  setValue: (v: string) => void;
  submit: () => void;
  registerTextarea: (ref: ElementRef<HTMLTextAreaElement>) => void;
  textareaRef: Signal<ElementRef<HTMLTextAreaElement> | null>;
}

export const PROMPT_INPUT_STATE = new InjectionToken<PromptInputState>('PROMPT_INPUT_STATE');

export function createPromptInputStateSignals() {
  return {
    textareaRef: signal<ElementRef<HTMLTextAreaElement> | null>(null),
  };
}
