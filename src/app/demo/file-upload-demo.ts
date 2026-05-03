import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import {
  lucideArrowUp,
  lucidePaperclip,
  lucideUpload,
  lucideX,
} from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkFileUploadImports } from 'prompt-kit-ng/file-upload';
import { PkPromptInputImports } from 'prompt-kit-ng/prompt-input';

@Component({
  selector: 'app-file-upload-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocPage,
    DocExample,
    HlmButton,
    HlmIconImports,
    PkFileUploadImports,
    PkPromptInputImports,
  ],
  providers: [
    provideIcons({ lucideArrowUp, lucidePaperclip, lucideUpload, lucideX }),
  ],
  template: `
    <app-doc-page
      title="File Upload"
      description="Drag-and-drop or click-to-pick. Composes with PromptInput so file chips render above the textarea, the attach action wires to the picker, and a full-page drop overlay catches files dropped anywhere."
    >
      <app-doc-example
        title="File Upload with Prompt Input"
        description="Drop a file anywhere on the page or click the paperclip. Submitted files clear after a fake 2-second send."
        [code]="composedCode"
      >
        <pk-file-upload
          #fu
          accept=".jpg,.jpeg,.png,.pdf,.docx"
          (filesAdded)="addFiles($event)"
        >
          <pk-prompt-input
            class="w-full max-w-sm block"
            [(value)]="input"
            [isLoading]="isLoading()"
            (submitted)="onSubmit()"
          >
            @if (files().length) {
              <div class="grid grid-cols-2 gap-2 pb-2">
                @for (f of files(); track $index) {
                  <div
                    class="bg-secondary flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm"
                    (click)="$event.stopPropagation()"
                  >
                    <div class="flex min-w-0 items-center gap-2">
                      <ng-icon hlm size="xs" name="lucidePaperclip" />
                      <span class="truncate">{{ f.name }}</span>
                    </div>
                    <button
                      type="button"
                      class="hover:bg-secondary-foreground/10 rounded-full p-1"
                      (click)="removeFile($index)"
                      [attr.aria-label]="'Remove ' + f.name"
                    >
                      <ng-icon hlm size="xs" name="lucideX" />
                    </button>
                  </div>
                }
              </div>
            }

            <pk-prompt-input-textarea placeholder="Type a message or drop files..." />

            <pk-prompt-input-actions class="mt-2 flex items-center justify-between">
              <pk-prompt-input-action tooltip="Attach files">
                <button
                  hlmBtn
                  variant="ghost"
                  size="icon-sm"
                  type="button"
                  class="rounded-full"
                  aria-label="Attach files"
                  (click)="fu.openPicker(); $event.stopPropagation()"
                >
                  <ng-icon hlm size="sm" name="lucidePaperclip" />
                </button>
              </pk-prompt-input-action>

              <pk-prompt-input-action [tooltip]="isLoading() ? 'Stop' : 'Send'">
                <button
                  hlmBtn
                  size="icon-sm"
                  type="button"
                  class="rounded-full"
                  (click)="onSubmit()"
                  [attr.aria-label]="isLoading() ? 'Stop' : 'Send'"
                >
                  <ng-icon hlm size="xs" name="lucideArrowUp" />
                </button>
              </pk-prompt-input-action>
            </pk-prompt-input-actions>
          </pk-prompt-input>

          <pk-file-upload-content>
            <div class="flex min-h-[200px] w-full items-center justify-center backdrop-blur-sm">
              <div class="bg-background/90 border-border m-4 w-full max-w-md rounded-lg border p-8 shadow-lg">
                <div class="mb-4 flex justify-center">
                  <ng-icon hlm size="lg" name="lucideUpload" class="text-muted-foreground" />
                </div>
                <h3 class="mb-2 text-center text-base font-medium">
                  Drop files to upload
                </h3>
                <p class="text-muted-foreground text-center text-sm">
                  Release to add files to your message
                </p>
              </div>
            </div>
          </pk-file-upload-content>
        </pk-file-upload>
      </app-doc-example>
    </app-doc-page>
  `,
})
export class FileUploadDemo {
  protected readonly input = signal('');
  protected readonly isLoading = signal(false);
  protected readonly files = signal<File[]>([]);

  protected addFiles(newFiles: File[]): void {
    this.files.update((prev) => [...prev, ...newFiles]);
  }

  protected removeFile(index: number): void {
    this.files.update((prev) => prev.filter((_, i) => i !== index));
  }

  protected onSubmit(): void {
    if (!this.input().trim() && this.files().length === 0) return;
    this.isLoading.set(true);
    setTimeout(() => {
      this.isLoading.set(false);
      this.input.set('');
      this.files.set([]);
    }, 2000);
  }

  protected readonly composedCode = `<pk-file-upload
  #fu
  accept=".jpg,.png,.pdf"
  (filesAdded)="addFiles($event)"
>
  <pk-prompt-input
    [(value)]="input"
    [isLoading]="isLoading()"
    (submitted)="onSubmit()"
  >
    @if (files().length) {
      <div class="grid grid-cols-2 gap-2 pb-2">
        @for (f of files(); track $index) {
          <div class="bg-secondary flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm">
            <span class="truncate">{{ f.name }}</span>
            <button (click)="removeFile($index)">
              <ng-icon hlm size="xs" name="lucideX" />
            </button>
          </div>
        }
      </div>
    }

    <pk-prompt-input-textarea placeholder="Type a message or drop files..." />

    <pk-prompt-input-actions class="mt-2 flex items-center justify-between">
      <pk-prompt-input-action tooltip="Attach files">
        <button hlmBtn variant="ghost" size="icon-sm"
                (click)="fu.openPicker(); $event.stopPropagation()">
          <ng-icon hlm size="sm" name="lucidePaperclip" />
        </button>
      </pk-prompt-input-action>
      <pk-prompt-input-action tooltip="Send">
        <button hlmBtn size="icon-sm" (click)="onSubmit()">
          <ng-icon hlm size="xs" name="lucideArrowUp" />
        </button>
      </pk-prompt-input-action>
    </pk-prompt-input-actions>
  </pk-prompt-input>

  <pk-file-upload-content>
    <div class="flex min-h-[200px] w-full items-center justify-center backdrop-blur-sm">
      <div class="bg-background/90 border-border m-4 max-w-md rounded-lg border p-8 shadow-lg text-center">
        <ng-icon hlm size="lg" name="lucideUpload" class="text-muted-foreground" />
        <h3 class="text-base font-medium">Drop files to upload</h3>
        <p class="text-muted-foreground text-sm">Release to add files to your message</p>
      </div>
    </div>
  </pk-file-upload-content>
</pk-file-upload>`;
}
