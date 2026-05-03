import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkFileUploadImports } from 'prompt-kit-ng/file-upload';

@Component({
  selector: 'app-file-upload-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, PkFileUploadImports],
  template: `
    <app-doc-page
      title="File Upload"
      description="Drop files anywhere on the page or pick them via the trigger. Emits a File[] — does not upload anything itself."
    >
      <app-doc-example
        title="Trigger + drop overlay"
        description="The dashed overlay appears anywhere on the page while a drag is in progress."
        [code]="uploadCode"
      >
        <div class="flex w-full flex-col items-start gap-4">
          <pk-file-upload (filesAdded)="onFiles($event)">
            <pk-file-upload-trigger
              class="border-input hover:bg-muted rounded-md border bg-background px-3 py-2 text-sm shadow-xs"
            >
              Choose files
            </pk-file-upload-trigger>
            <pk-file-upload-content>
              <div
                class="border-primary text-primary rounded-xl border-2 border-dashed bg-background/90 px-12 py-10 text-lg font-medium shadow-lg"
              >
                Drop files anywhere
              </div>
            </pk-file-upload-content>
          </pk-file-upload>
          @if (files().length) {
            <ul class="text-sm">
              @for (f of files(); track f.name) {
                <li class="font-mono">
                  {{ f.name }}
                  <span class="text-muted-foreground">({{ f.size }} bytes)</span>
                </li>
              }
            </ul>
          } @else {
            <p class="text-muted-foreground text-xs">
              No files yet. Click the button or drag files into the page.
            </p>
          }
        </div>
      </app-doc-example>
    </app-doc-page>
  `,
})
export class FileUploadDemo {
  protected readonly files = signal<File[]>([]);
  protected onFiles(files: File[]): void {
    this.files.set(files);
  }

  protected readonly uploadCode = `<pk-file-upload (filesAdded)="onFiles($event)">
  <pk-file-upload-trigger class="...">
    Choose files
  </pk-file-upload-trigger>
  <pk-file-upload-content>
    <div class="border-primary text-primary rounded-xl border-2 border-dashed px-12 py-10">
      Drop files anywhere
    </div>
  </pk-file-upload-content>
</pk-file-upload>`;
}
