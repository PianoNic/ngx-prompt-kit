import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucidePaperclip, lucideUpload, lucideX } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmInputGroupImports } from '@spartan-ng/helm/input-group';
import { HlmTooltip } from '@spartan-ng/helm/tooltip';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkFileUploadImports } from 'ngx-prompt-kit/file-upload';

@Component({
  selector: 'app-file-upload-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DocPage,
    DocExample,
    DocInstall,
    DocApi,
    HlmButton,
    HlmInputGroupImports,
    HlmTooltip,
    NgIcon,
    PkFileUploadImports,
  ],
  providers: [provideIcons({ lucideArrowUp, lucidePaperclip, lucideUpload, lucideX })],
  template: `
    <app-doc-page
      title="File Upload"
      description="Drag-and-drop or click-to-pick. Composes with a spartan input-group so file chips render above the textarea, the attach action wires to the picker, and a full-page drop overlay catches files dropped anywhere."
    >
      <app-doc-example
        title="File Upload with an input group"
        description="Drop a file anywhere on the page or click the paperclip. Submitted files clear after a fake 2-second send."
        [code]="composedCode"
      >
        <pk-file-upload #fu accept=".jpg,.jpeg,.png,.pdf,.docx" (filesAdded)="addFiles($event)">
          <div hlmInputGroup class="w-full max-w-sm rounded-3xl">
            @if (files().length) {
              <div hlmInputGroupAddon align="block-start" class="grid grid-cols-2 gap-2 px-3 pt-3">
                @for (f of files(); track $index) {
                  <div
                    class="bg-secondary text-secondary-foreground flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-normal"
                  >
                    <div class="flex min-w-0 items-center gap-2">
                      <ng-icon name="lucidePaperclip" class="text-[length:--spacing(3)]" />
                      <span class="truncate">{{ f.name }}</span>
                    </div>
                    <button
                      hlmBtn
                      variant="ghost"
                      size="icon-xs"
                      type="button"
                      class="rounded-full"
                      (click)="removeFile($index)"
                      [attr.aria-label]="'Remove ' + f.name"
                    >
                      <ng-icon name="lucideX" class="text-[length:--spacing(3)]" />
                    </button>
                  </div>
                }
              </div>
            }

            <textarea
              hlmInputGroupTextarea
              class="max-h-60 px-4 pt-3"
              placeholder="Type a message or drop files..."
              aria-label="Message"
              [value]="input()"
              [disabled]="isLoading()"
              (input)="input.set($any($event.target).value)"
              (keydown.enter)="onEnter($event)"
            ></textarea>

            <div hlmInputGroupAddon align="block-end" class="justify-between px-3 pb-3">
              <button
                hlmBtn
                variant="ghost"
                size="icon-sm"
                type="button"
                class="rounded-full"
                hlmTooltip="Attach files"
                aria-label="Attach files"
                (click)="fu.openPicker(); $event.stopPropagation()"
              >
                <ng-icon name="lucidePaperclip" class="text-[length:--spacing(4)]" />
              </button>

              <button
                hlmBtn
                size="icon-sm"
                type="button"
                class="rounded-full"
                [hlmTooltip]="isLoading() ? 'Stop' : 'Send'"
                (click)="onSubmit()"
                [attr.aria-label]="isLoading() ? 'Stop' : 'Send'"
              >
                <ng-icon name="lucideArrowUp" class="text-[length:--spacing(3)]" />
              </button>
            </div>
          </div>

          <pk-file-upload-content>
            <div class="flex min-h-[200px] w-full items-center justify-center backdrop-blur-sm">
              <div
                class="bg-background/90 border-border m-4 w-full max-w-md rounded-lg border p-8 shadow-lg"
              >
                <div class="mb-4 flex justify-center">
                  <ng-icon
                    name="lucideUpload"
                    class="text-[length:--spacing(8)] text-muted-foreground"
                  />
                </div>
                <h3 class="mb-2 text-center text-base font-medium">Drop files to upload</h3>
                <p class="text-muted-foreground text-center text-sm">
                  Release to add files to your message
                </p>
              </div>
            </div>
          </pk-file-upload-content>
        </pk-file-upload>
      </app-doc-example>

      <app-doc-install component="file-upload" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class FileUploadDemo {
  protected readonly api: ApiSection[] = [
    {
      name: 'PkFileUpload',
      props: [
        {
          name: 'multiple',
          type: 'boolean',
          default: 'true',
          description: 'Allow selecting multiple files at once.',
        },
        {
          name: 'accept',
          type: 'string',
          description: 'Standard accept attribute (e.g. ".jpg,.png").',
        },
        {
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          description: 'Disable the picker and ignore drops.',
        },
        {
          name: 'filesAdded',
          type: 'output<File[]>',
          description: 'Fires when files are picked or dropped.',
        },
        {
          name: 'openPicker()',
          type: '() => void',
          description: 'Programmatically open the native file picker.',
        },
      ],
    },
    {
      name: 'PkFileUploadTrigger',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the trigger button.' },
      ],
    },
    {
      name: 'PkFileUploadContent',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the drag-state overlay.' },
      ],
    },
  ];

  protected readonly input = signal('');
  protected readonly isLoading = signal(false);
  protected readonly files = signal<File[]>([]);

  protected addFiles(newFiles: File[]): void {
    this.files.update((prev) => [...prev, ...newFiles]);
  }

  protected removeFile(index: number): void {
    this.files.update((prev) => prev.filter((_, i) => i !== index));
  }

  protected onEnter(event: Event): void {
    if ((event as KeyboardEvent).shiftKey) return;
    event.preventDefault();
    this.onSubmit();
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
  <!-- spartan input-group: chips above, textarea, actions below -->
  <div hlmInputGroup class="rounded-3xl">
    @if (files().length) {
      <div hlmInputGroupAddon align="block-start" class="grid grid-cols-2 gap-2">
        @for (f of files(); track $index) {
          <div class="bg-secondary flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm">
            <span class="truncate">{{ f.name }}</span>
            <button hlmBtn variant="ghost" size="icon-xs" (click)="removeFile($index)">
              <ng-icon name="lucideX" class="text-[length:--spacing(3)]" />
            </button>
          </div>
        }
      </div>
    }

    <textarea
      hlmInputGroupTextarea
      placeholder="Type a message or drop files..."
      [value]="input()"
      (input)="input.set($any($event.target).value)"
      (keydown.enter)="onEnter($event)"
    ></textarea>

    <div hlmInputGroupAddon align="block-end" class="justify-between">
      <button hlmBtn variant="ghost" size="icon-sm" hlmTooltip="Attach files"
              (click)="fu.openPicker(); $event.stopPropagation()">
        <ng-icon name="lucidePaperclip" class="text-[length:--spacing(4)]" />
      </button>
      <button hlmBtn size="icon-sm" hlmTooltip="Send" (click)="onSubmit()">
        <ng-icon name="lucideArrowUp" class="text-[length:--spacing(3)]" />
      </button>
    </div>
  </div>

  <pk-file-upload-content>
    <div class="flex min-h-[200px] w-full items-center justify-center backdrop-blur-sm">
      <div class="bg-background/90 border-border m-4 max-w-md rounded-lg border p-8 shadow-lg text-center">
        <ng-icon name="lucideUpload" class="text-[length:--spacing(8)] text-muted-foreground" />
        <h3 class="text-base font-medium">Drop files to upload</h3>
        <p class="text-muted-foreground text-sm">Release to add files to your message</p>
      </div>
    </div>
  </pk-file-upload-content>
</pk-file-upload>`;
}
