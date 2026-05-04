import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import {
  PkAttachmentPreviewImports,
  type Attachment,
} from 'ngx-prompt-kit/attachment-preview';

const SAMPLE_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#ec4899"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/></svg>`,
  );

const ALT_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0ea5e9"/><stop offset="1" stop-color="#10b981"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/></svg>`,
  );

const TERTIARY_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f59e0b"/><stop offset="1" stop-color="#dc2626"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/></svg>`,
  );

const QUATERNARY_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#64748b"/><stop offset="1" stop-color="#1e293b"/></linearGradient></defs><rect width="40" height="40" fill="url(#g)"/></svg>`,
  );

@Component({
  selector: 'app-attachment-preview-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkAttachmentPreviewImports],
  template: `
    <app-doc-page
      title="Attachment Preview"
      [original]="true"
      description="Horizontal chip row for staged attachments above a prompt input. Image type renders an inline thumbnail; file/audio/video render an icon + filename + size. Hover or focus a chip to reveal its remove button."
    >
      <app-doc-example
        title="Mixed types"
        description="Image with thumbnail, plus a PDF and an audio attachment. Filename truncates inside the chip; full size is rendered via Intl.NumberFormat."
        [code]="mixedCode"
      >
        <div class="flex w-full flex-col gap-3">
          <pk-attachment-preview
            [attachments]="mixed()"
            (clicked)="lastEvent.set('clicked: ' + $event)"
            (removed)="onRemove('mixed', $event)"
          />
          @if (lastEvent(); as e) {
            <p class="text-muted-foreground text-xs">
              Last event: <span class="text-foreground font-mono">{{ e }}</span>
            </p>
          }
        </div>
      </app-doc-example>

      <app-doc-example
        title="Image-heavy"
        description="Four images in a row. Each thumbnail is the actual click target — wire (clicked) to your lightbox or preview pane."
        [code]="imagesCode"
      >
        <pk-attachment-preview
          [attachments]="images()"
          (clicked)="lastEvent.set('clicked: ' + $event)"
          (removed)="onRemove('images', $event)"
        />
      </app-doc-example>

      <app-doc-example
        title="Overflow with maxVisible"
        description="When [maxVisible] > 0 and the attachments array is longer, surplus chips collapse into a square '+N' pill that matches the chip height. The pill is non-interactive — consumers wire whatever (e.g., open a gallery) at the host level."
        [code]="overflowCode"
      >
        <pk-attachment-preview
          [attachments]="many()"
          [maxVisible]="3"
          (clicked)="lastEvent.set('clicked: ' + $event)"
          (removed)="onRemove('many', $event)"
        />
      </app-doc-example>

      <app-doc-install component="attachment-preview" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class AttachmentPreviewDemo {
  protected readonly lastEvent = signal<string | null>(null);

  protected readonly mixed = signal<Attachment[]>([
    {
      id: 'm1',
      name: 'storyboard-frame-04.png',
      type: 'image',
      thumbnailUrl: SAMPLE_IMAGE,
      size: 184_320,
      mimeType: 'image/png',
    },
    {
      id: 'm2',
      name: 'q4-financials-final.pdf',
      type: 'file',
      size: 2_457_600,
      mimeType: 'application/pdf',
    },
    {
      id: 'm3',
      name: 'voice-memo-2026-05-04.m4a',
      type: 'audio',
      size: 4_915_200,
      mimeType: 'audio/m4a',
    },
  ]);

  protected readonly images = signal<Attachment[]>([
    { id: 'i1', name: 'cover.png', type: 'image', thumbnailUrl: SAMPLE_IMAGE, size: 81_920 },
    { id: 'i2', name: 'banner.png', type: 'image', thumbnailUrl: ALT_IMAGE, size: 153_600 },
    { id: 'i3', name: 'icon.png', type: 'image', thumbnailUrl: TERTIARY_IMAGE, size: 24_576 },
    { id: 'i4', name: 'thumb.png', type: 'image', thumbnailUrl: QUATERNARY_IMAGE, size: 51_200 },
  ]);

  protected readonly many = signal<Attachment[]>([
    { id: 'a', name: 'screenshot-1.png', type: 'image', thumbnailUrl: SAMPLE_IMAGE, size: 102_400 },
    { id: 'b', name: 'screenshot-2.png', type: 'image', thumbnailUrl: ALT_IMAGE, size: 81_920 },
    { id: 'c', name: 'transcript.txt', type: 'file', size: 12_288 },
    { id: 'd', name: 'meeting.mp4', type: 'video', size: 87_654_321 },
    { id: 'e', name: 'notes.md', type: 'file', size: 4_096 },
    { id: 'f', name: 'scratch.png', type: 'image', thumbnailUrl: TERTIARY_IMAGE, size: 32_768 },
    { id: 'g', name: 'voice.m4a', type: 'audio', size: 1_572_864 },
    { id: 'h', name: 'spec.pdf', type: 'file', size: 524_288 },
  ]);

  protected onRemove(which: 'mixed' | 'images' | 'many', id: string): void {
    this.lastEvent.set(`removed: ${id}`);
    const target = which === 'mixed' ? this.mixed : which === 'images' ? this.images : this.many;
    target.update((list) => list.filter((a) => a.id !== id));
  }

  protected readonly api: ApiSection[] = [
    {
      name: 'PkAttachmentPreview',
      props: [
        {
          name: 'attachments',
          type: 'readonly Attachment[]',
          description: 'The attachments to render (required).',
        },
        {
          name: 'maxVisible',
          type: 'number',
          default: '0',
          description: 'When > 0, only the first N chips render and the surplus collapses into a "+N more" pill. 0 shows all.',
        },
        {
          name: 'removable',
          type: 'boolean',
          default: 'true',
          description: 'When false, chips do not show the remove (X) button.',
        },
        {
          name: 'locale',
          type: 'string | undefined',
          description: 'BCP-47 locale for the byte size formatter. Defaults to runtime locale.',
        },
        { name: 'class', type: 'string', description: 'Extra classes for the host.' },
      ],
    },
    {
      name: 'PkAttachmentChip',
      props: [
        { name: 'attachment', type: 'Attachment', description: 'Single attachment to render (required).' },
        { name: 'removable', type: 'boolean', default: 'true', description: 'Show the remove button.' },
        { name: 'locale', type: 'string | undefined', description: 'Forwarded to the byte size formatter.' },
      ],
    },
    {
      name: 'Outputs',
      props: [
        {
          name: 'clicked',
          type: '(id: string) => void',
          description: 'Chip body clicked — wire to your preview/lightbox handler.',
        },
        {
          name: 'removed',
          type: '(id: string) => void',
          description: 'Remove (X) button clicked.',
        },
      ],
    },
  ];

  protected readonly mixedCode = `<pk-attachment-preview
  [attachments]="attachments()"
  (clicked)="openPreview($event)"
  (removed)="remove($event)"
/>`;

  protected readonly imagesCode = `<pk-attachment-preview
  [attachments]="images()"
  (clicked)="openLightbox($event)"
  (removed)="remove($event)"
/>`;

  protected readonly overflowCode = `<pk-attachment-preview
  [attachments]="attachments()"
  [maxVisible]="3"
  (clicked)="openPreview($event)"
  (removed)="remove($event)"
/>`;
}
