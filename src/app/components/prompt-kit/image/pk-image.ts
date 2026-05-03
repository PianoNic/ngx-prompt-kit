/**
 * pk-image — display an AI-generated image from base64 / Uint8Array bytes,
 * or a regular src URL via Angular's NgOptimizedImage.
 *
 * Inputs:
 *   alt:        string — required
 *   src:        string — regular URL; uses NgOptimizedImage (skip if base64/uint8Array given)
 *   base64:     string — base64 payload
 *   uint8Array: Uint8Array — binary payload
 *   mediaType:  string — default 'image/png'
 *   width:      number — required when src is set (NgOptimizedImage requirement)
 *   height:     number — required when src is set
 *   class:      string
 *
 * Notes:
 *   - For data: URLs (base64) and blob: URLs (Uint8Array), NgOptimizedImage is
 *     incompatible (Angular limitation). Falls back to a native <img>.
 *   - For real URLs (src), NgOptimizedImage handles lazy-loading + priority.
 */
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { cn } from '../utils/cn';

@Component({
  selector: 'pk-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  template: `
    @if (resolvedSrc(); as s) {
      @if (src()) {
        <img
          [ngSrc]="s"
          [alt]="alt()"
          [width]="width() ?? 1024"
          [height]="height() ?? 1024"
          [class]="imageClass()"
        />
      } @else {
        <img [src]="s" [alt]="alt()" [class]="imageClass()" />
      }
    } @else {
      <div [attr.aria-label]="alt()" role="img" [class]="placeholderClass()"></div>
    }
  `,
})
export class PkImage {
  public readonly alt = input.required<string>();
  public readonly src = input<string | undefined>(undefined);
  public readonly base64 = input<string | undefined>(undefined);
  public readonly uint8Array = input<Uint8Array | undefined>(undefined);
  public readonly mediaType = input<string>('image/png');
  public readonly width = input<number | undefined>(undefined);
  public readonly height = input<number | undefined>(undefined);
  public readonly class = input<string>('');

  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);

  private readonly objectUrl = signal<string | undefined>(undefined);

  constructor() {
    effect((onCleanup) => {
      const bytes = this.uint8Array();
      const mt = this.mediaType();
      if (bytes && this.isBrowser) {
        const blob = new Blob([bytes as BlobPart], { type: mt });
        const url = URL.createObjectURL(blob);
        this.objectUrl.set(url);
        onCleanup(() => URL.revokeObjectURL(url));
      } else {
        this.objectUrl.set(undefined);
      }
    });
    this.destroyRef.onDestroy(() => {
      const url = this.objectUrl();
      if (url) URL.revokeObjectURL(url);
    });
  }

  protected readonly resolvedSrc = computed<string | undefined>(() => {
    if (this.src()) return this.src();
    const b64 = this.base64();
    if (b64) return `data:${this.mediaType()};base64,${b64}`;
    return this.objectUrl();
  });

  protected readonly imageClass = computed(() =>
    cn('h-auto max-w-full overflow-hidden rounded-md', this.class()),
  );

  protected readonly placeholderClass = computed(() =>
    cn(
      'h-auto max-w-full animate-pulse overflow-hidden rounded-md bg-gray-100 dark:bg-neutral-800',
      this.class(),
    ),
  );
}
