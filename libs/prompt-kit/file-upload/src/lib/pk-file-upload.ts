import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  forwardRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FILE_UPLOAD_STATE, type FileUploadState } from './file-upload.state';

@Component({
  selector: 'pk-file-upload',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: FILE_UPLOAD_STATE, useExisting: forwardRef(() => PkFileUpload) }],
  template: `
    <input
      type="file"
      #fileInput
      class="hidden"
      [multiple]="multiple()"
      [attr.accept]="accept() || null"
      [disabled]="disabled()"
      aria-hidden="true"
      (change)="onFileSelect($event)"
    />
    <ng-content />
  `,
})
export class PkFileUpload implements AfterViewInit, FileUploadState {
  public readonly multiple = input<boolean>(true);
  public readonly accept = input<string | undefined>(undefined);
  public readonly disabled = input<boolean>(false);
  public readonly filesAdded = output<File[]>();

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileInputEl = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  public readonly inputRef = signal<ElementRef<HTMLInputElement> | null>(null);
  public readonly isDragging = signal<boolean>(false);
  private dragCounter = 0;

  ngAfterViewInit(): void {
    this.inputRef.set(this.fileInputEl());
    if (!this.isBrowser) return;

    const handleDrag = (e: DragEvent): void => {
      e.preventDefault();
      e.stopPropagation();
    };
    const handleDragIn = (e: DragEvent): void => {
      handleDrag(e);
      this.dragCounter++;
      if (e.dataTransfer?.items.length) this.isDragging.set(true);
    };
    const handleDragOut = (e: DragEvent): void => {
      handleDrag(e);
      this.dragCounter--;
      if (this.dragCounter === 0) this.isDragging.set(false);
    };
    const handleDrop = (e: DragEvent): void => {
      handleDrag(e);
      this.isDragging.set(false);
      this.dragCounter = 0;
      if (e.dataTransfer?.files.length) this.handleFiles(e.dataTransfer.files);
    };
    window.addEventListener('dragenter', handleDragIn);
    window.addEventListener('dragleave', handleDragOut);
    window.addEventListener('dragover', handleDrag);
    window.addEventListener('drop', handleDrop);
    this.destroyRef.onDestroy(() => {
      window.removeEventListener('dragenter', handleDragIn);
      window.removeEventListener('dragleave', handleDragOut);
      window.removeEventListener('dragover', handleDrag);
      window.removeEventListener('drop', handleDrop);
    });
  }

  public openPicker(): void {
    this.inputRef()?.nativeElement.click();
  }

  protected onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.handleFiles(input.files);
      input.value = '';
    }
  }

  private handleFiles(files: FileList): void {
    const arr = Array.from(files);
    this.filesAdded.emit(this.multiple() ? arr : arr.slice(0, 1));
  }
}
