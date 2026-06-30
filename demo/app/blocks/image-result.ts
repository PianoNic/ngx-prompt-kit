import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkImage } from 'ngx-prompt-kit/image';
import { PkMessageImports } from 'ngx-prompt-kit/message';

// Pre-encoded base64 SVGs (200x200 rounded gradient squares) — three palettes.
const ART_SUNSET =
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmNTllMGIiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNkYzI2MjYiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgcng9IjE2IiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+';
const ART_VIOLET =
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiM3YzNhZWQiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNlYzQ4OTkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgcng9IjE2IiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+';
const ART_OCEAN =
  'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwIiB5MT0iMCIgeDI9IjEiIHkyPSIxIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiMwZWE1ZTkiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMxMGI5ODEiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgcng9IjE2IiBmaWxsPSJ1cmwoI2cpIi8+PC9zdmc+';

@Component({
  selector: 'app-block-image-result',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, PkImage, PkMessageImports],
  template: `
    <app-block-page
      title="Image generation result"
      description="Assistant returns a grid of generated images. pk-image handles base64 payloads natively (NgOptimizedImage doesn't accept data: URLs)."
    >
      <app-doc-example title="Generated images in a chat reply" [code]="code">
        <div class="flex w-full max-w-2xl flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="Generate four cover variants in a sunset palette."
            />
          </pk-message>

          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <div class="flex min-w-0 flex-1 flex-col gap-3">
              <p class="text-sm leading-relaxed">
                Here are four variants — each runs the same prompt through a different seed. Click
                any image to upscale.
              </p>
              <div class="grid grid-cols-2 gap-2">
                <pk-image
                  [base64]="art1"
                  mediaType="image/svg+xml"
                  alt="Variant 1"
                  class="aspect-square w-full rounded-md"
                />
                <pk-image
                  [base64]="art2"
                  mediaType="image/svg+xml"
                  alt="Variant 2"
                  class="aspect-square w-full rounded-md"
                />
                <pk-image
                  [base64]="art3"
                  mediaType="image/svg+xml"
                  alt="Variant 3"
                  class="aspect-square w-full rounded-md"
                />
                <pk-image alt="Pending generation" class="aspect-square w-full rounded-md" />
              </div>
              <p class="text-muted-foreground text-xs">
                Pending: variant 4 — waiting for the queue.
              </p>
            </div>
          </pk-message>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class ImageResultBlock {
  protected readonly art1 = ART_SUNSET;
  protected readonly art2 = ART_VIOLET;
  protected readonly art3 = ART_OCEAN;

  protected readonly code = `<pk-message>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <div class="flex flex-1 flex-col gap-3">
    <p>Here are four variants — each runs through a different seed.</p>
    <div class="grid grid-cols-2 gap-2">
      <pk-image
        [base64]="art1Base64"
        mediaType="image/png"
        alt="Variant 1"
        class="aspect-square w-full rounded-md"
      />
      <pk-image
        [base64]="art2Base64"
        mediaType="image/png"
        alt="Variant 2"
        class="aspect-square w-full rounded-md"
      />
      <pk-image
        [base64]="art3Base64"
        mediaType="image/png"
        alt="Variant 3"
        class="aspect-square w-full rounded-md"
      />
      <pk-image alt="Pending generation" class="aspect-square w-full rounded-md" />
    </div>
  </div>
</pk-message>`;
}
