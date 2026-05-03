import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkImage } from 'prompt-kit-ng/image';

// 1x1 transparent PNG (smallest valid base64 payload).
const TRANSPARENT_PNG_BASE64 =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// 64x64 generated SVG converted to base64 (a soft gradient placeholder).
const GRADIENT_SVG_BASE64 =
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJnIiB4MT0iMCIgeTE9IjAiIHgyPSIxIiB5Mj0iMSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjOWVjMmZmIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSIjZmY5ZWNlIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiByeD0iOCIgZmlsbD0idXJsKCNnKSIvPjwvc3ZnPg==';

@Component({
  selector: 'app-image-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkImage],
  template: `
    <app-doc-page
      title="Image"
      description="Display an AI-generated image from base64 / Uint8Array bytes, or a regular URL via Angular's NgOptimizedImage."
    >
      <app-doc-example
        title="From a URL"
        description="When you pass [src], the inner img uses NgOptimizedImage — Angular handles lazy-loading and priority hints."
        [code]="urlCode"
      >
        <pk-image
          src="https://images.unsplash.com/photo-1538935732373-f7a495fea3f6?w=320&h=320&fit=crop"
          alt="Sample landscape"
          [width]="320"
          [height]="320"
          class="rounded-lg"
        />
      </app-doc-example>

      <app-doc-example
        title="From base64 (e.g. an LLM image generation)"
        description="Pass [base64] and [mediaType]; falls back to a native img tag because NgOptimizedImage does not accept data: URLs."
        [code]="base64Code"
      >
        <div class="flex items-center gap-6">
          <pk-image
            [base64]="gradient"
            mediaType="image/svg+xml"
            alt="Gradient placeholder"
            class="size-24"
          />
          <pk-image
            [base64]="transparent"
            mediaType="image/png"
            alt="Transparent placeholder"
            class="size-24 border border-border"
          />
        </div>
      </app-doc-example>

      <app-doc-example
        title="Loading placeholder"
        description="When neither src, base64, nor uint8Array is provided, an aria-labeled pulse box stands in."
        [code]="placeholderCode"
      >
        <pk-image alt="Pending generation" class="size-32" />
      </app-doc-example>

      <app-doc-install component="image" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ImageDemo {
  protected readonly transparent = TRANSPARENT_PNG_BASE64;
  protected readonly gradient = GRADIENT_SVG_BASE64;

  protected readonly urlCode = `<pk-image
  src="https://images.example.com/photo.jpg"
  alt="Sample landscape"
  [width]="320"
  [height]="320"
/>`;

  protected readonly base64Code = `<pk-image
  [base64]="bytesFromLLM"
  mediaType="image/png"
  alt="Generated image"
/>`;

  protected readonly placeholderCode = `<pk-image alt="Pending generation" />`;

  protected readonly api: ApiSection[] = [
    {
      name: 'PkImage',
      props: [
        { name: 'alt', type: 'string', description: 'Alt text (required).' },
        { name: 'src', type: 'string', description: 'Regular image URL — uses NgOptimizedImage. Width and height required.' },
        { name: 'base64', type: 'string', description: 'Base64 payload (renders as data: URL via plain img).' },
        { name: 'uint8Array', type: 'Uint8Array', description: 'Binary payload (rendered as a blob: URL, revoked on destroy).' },
        { name: 'mediaType', type: 'string', default: "'image/png'", description: 'MIME type for base64 / blob payloads.' },
        { name: 'width', type: 'number', description: 'Required when src is set.' },
        { name: 'height', type: 'number', description: 'Required when src is set.' },
        { name: 'class', type: 'string', description: 'Extra classes for the img / placeholder.' },
      ],
    },
  ];
}
