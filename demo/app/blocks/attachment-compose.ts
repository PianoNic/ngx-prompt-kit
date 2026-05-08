import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideArrowUp, lucidePaperclip, lucideUpload } from '@ng-icons/lucide';
import { HlmButton } from '@spartan-ng/helm/button';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import {
  PkAttachmentPreviewImports,
  type Attachment,
} from 'ngx-prompt-kit/attachment-preview';
import { PkFileUploadImports } from 'ngx-prompt-kit/file-upload';
import { PkPromptInputImports } from 'ngx-prompt-kit/prompt-input';

const SAMPLE_THUMB =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/></svg>`,
  );

@Component({
  selector: 'app-block-attachment-compose',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    BlockPage,
    DocExample,
    HlmButton,
    HlmIconImports,
    PkAttachmentPreviewImports,
    PkFileUploadImports,
    PkPromptInputImports,
  ],
  providers: [provideIcons({ lucideArrowUp, lucidePaperclip, lucideUpload })],
  template: `
    <app-block-page
      title="Attachments above input"
      description="Multimodal compose row. Drag a file anywhere on the preview or click the paperclip — chips appear in the attachment-preview row above the textarea."
    >
      <app-doc-example title="Drop-anywhere multimodal compose" [code]="code">
        <pk-file-upload
          #fu
          accept="image/*,application/pdf"
          (filesAdded)="onFilesAdded($event)"
          class="block w-full"
        >
          <div class="mx-auto flex w-full max-w-xl flex-col gap-3">
            @if (attachments().length) {
              <pk-attachment-preview
                [attachments]="attachments()"
                (removed)="onRemove($event)"
              />
            }

            <pk-prompt-input
              [(value)]="value"
              [isLoading]="isSending()"
              (submitted)="onSubmit()"
            >
              <pk-prompt-input-textarea
                placeholder="Describe what you want or drop files anywhere..."
              />
              <pk-prompt-input-actions class="mt-2 justify-between">
                <pk-prompt-input-action tooltip="Attach files">
                  <button
                    hlmBtn
                    size="icon-sm"
                    variant="ghost"
                    type="button"
                    class="rounded-full"
                    aria-label="Attach"
                    (click)="fu.openPicker(); $event.stopPropagation()"
                  >
                    <ng-icon hlm size="sm" name="lucidePaperclip" />
                  </button>
                </pk-prompt-input-action>
                <pk-prompt-input-action tooltip="Send">
                  <button
                    hlmBtn
                    size="icon-sm"
                    type="button"
                    class="rounded-full"
                    (click)="onSubmit()"
                    aria-label="Send"
                  >
                    <ng-icon hlm size="xs" name="lucideArrowUp" />
                  </button>
                </pk-prompt-input-action>
              </pk-prompt-input-actions>
            </pk-prompt-input>

            @if (lastSent(); as msg) {
              <p class="text-muted-foreground text-center text-xs">Sent {{ msg }}</p>
            }
          </div>

          <pk-file-upload-content>
            <div class="flex min-h-[200px] w-full items-center justify-center backdrop-blur-sm">
              <div
                class="bg-background/90 border-border m-4 w-full max-w-md rounded-lg border p-8 shadow-lg"
              >
                <div class="mb-3 flex justify-center">
                  <ng-icon hlm size="lg" name="lucideUpload" class="text-muted-foreground" />
                </div>
                <h3 class="mb-1 text-center text-base font-medium">Drop files to attach</h3>
                <p class="text-muted-foreground text-center text-sm">
                  They'll appear above the textarea as chips.
                </p>
              </div>
            </div>
          </pk-file-upload-content>
        </pk-file-upload>
      </app-doc-example>
    </app-block-page>
  `,
})
export class AttachmentComposeBlock {
  protected readonly value = signal('');
  protected readonly isSending = signal(false);
  protected readonly attachments = signal<Attachment[]>([
    {
      id: 'seed',
      name: 'storyboard-frame-04.png',
      type: 'image',
      thumbnailUrl: SAMPLE_THUMB,
      size: 184_320,
      mimeType: 'image/png',
    },
  ]);
  protected readonly lastSent = signal<string | null>(null);

  protected onFilesAdded(files: File[]): void {
    const next: Attachment[] = files.map((f, i) => ({
      id: `${Date.now()}-${i}`,
      name: f.name,
      type: f.type.startsWith('image/')
        ? 'image'
        : f.type.startsWith('audio/')
          ? 'audio'
          : f.type.startsWith('video/')
            ? 'video'
            : 'file',
      size: f.size,
      mimeType: f.type,
    }));
    this.attachments.update((list) => [...list, ...next]);
  }

  protected onRemove(id: string): void {
    this.attachments.update((list) => list.filter((a) => a.id !== id));
  }

  protected onSubmit(): void {
    const text = this.value().trim();
    const count = this.attachments().length;
    if (!text && count === 0) return;
    this.isSending.set(true);
    setTimeout(() => {
      this.lastSent.set(`${count} attachment(s)${text ? ' + message' : ''}`);
      this.isSending.set(false);
      this.value.set('');
      this.attachments.set([]);
    }, 800);
  }

  protected readonly code = `<pk-file-upload
  #fu
  accept="image/*,application/pdf"
  (filesAdded)="onFilesAdded($event)"
>
  @if (attachments().length) {
    <pk-attachment-preview
      [attachments]="attachments()"
      (removed)="onRemove($event)"
    />
  }

  <pk-prompt-input [(value)]="value" (submitted)="onSubmit()">
    <pk-prompt-input-textarea placeholder="Describe what you want or drop files..." />
    <pk-prompt-input-actions class="mt-2 justify-between">
      <pk-prompt-input-action tooltip="Attach files">
        <button hlmBtn size="icon-sm" variant="ghost"
                (click)="fu.openPicker(); $event.stopPropagation()">
          <ng-icon hlm size="sm" name="lucidePaperclip" />
        </button>
      </pk-prompt-input-action>
      <pk-prompt-input-action tooltip="Send">
        <button hlmBtn size="icon-sm" class="rounded-full" (click)="onSubmit()">
          <ng-icon hlm size="xs" name="lucideArrowUp" />
        </button>
      </pk-prompt-input-action>
    </pk-prompt-input-actions>
  </pk-prompt-input>

  <pk-file-upload-content>
    <!-- drag-state overlay -->
  </pk-file-upload-content>
</pk-file-upload>

// Component
protected readonly value = signal('');
protected readonly attachments = signal<Attachment[]>([]);

protected onFilesAdded(files: File[]): void {
  const next: Attachment[] = files.map((f, i) => ({
    id: \`\${Date.now()}-\${i}\`,
    name: f.name,
    type: f.type.startsWith('image/') ? 'image' : 'file',
    size: f.size,
    mimeType: f.type,
  }));
  this.attachments.update(list => [...list, ...next]);
}

protected onRemove(id: string): void {
  this.attachments.update(list => list.filter(a => a.id !== id));
}`;
}
