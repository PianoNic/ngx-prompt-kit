import { ElementRef, InjectionToken, Signal } from '@angular/core';

export interface FileUploadState {
  isDragging: Signal<boolean>;
  disabled: Signal<boolean>;
  inputRef: Signal<ElementRef<HTMLInputElement> | null>;
  openPicker: () => void;
}

export const FILE_UPLOAD_STATE = new InjectionToken<FileUploadState>('FILE_UPLOAD_STATE');
