import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { PkFileUploadImports } from 'prompt-kit-ng';

@Component({
  selector: 'app-file-upload-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkFileUploadImports],
  template: `
    <h2 class="text-xl font-semibold mb-4">File Upload</h2>
    <pk-file-upload (filesAdded)="onFiles($event)">
      <pk-file-upload-trigger
        class="rounded bg-primary text-primary-foreground px-3 py-1 text-sm"
      >
        Choose files
      </pk-file-upload-trigger>
      <pk-file-upload-content>
        <div class="rounded-lg border-2 border-dashed border-primary p-8 text-lg">
          Drop files anywhere
        </div>
      </pk-file-upload-content>
    </pk-file-upload>
    @if (files().length) {
      <ul class="mt-4 text-sm">
        @for (f of files(); track f.name) {
          <li>{{ f.name }} ({{ f.size }} bytes)</li>
        }
      </ul>
    }
  `,
})
export class FileUploadDemo {
  protected readonly files = signal<File[]>([]);
  protected onFiles(files: File[]): void {
    this.files.set(files);
  }
}
