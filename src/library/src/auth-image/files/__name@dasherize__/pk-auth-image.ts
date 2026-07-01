// ngx-prompt-kit original — not part of ibelick/prompt-kit
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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

/**
 * Renders an image from an auth-protected endpoint. Fetches `url` via
 * `HttpClient` (so your auth interceptor attaches the token), shows the blob as
 * an object URL, and revokes it on change/destroy. Shows a skeleton while
 * loading and a fallback (project `[error]` content to customise) on failure.
 *
 * Requires `provideHttpClient()` in the app. SSR-safe: it only fetches in the
 * browser. The endpoint URL is consumer-supplied, so the component stays
 * backend-agnostic.
 */
@Component({
  selector: 'pk-auth-image',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClass()',
  },
  template: `
    @if (objectUrl(); as src) {
      <img [src]="src" [alt]="alt()" class="h-full w-full object-cover" />
    } @else if (failed()) {
      <div
        class="bg-muted text-muted-foreground flex h-full w-full items-center justify-center text-xs"
      >
        <ng-content select="[error]">Failed to load</ng-content>
      </div>
    } @else {
      <div class="bg-muted h-full w-full animate-pulse"></div>
    }
  `,
})
export class PkAuthImage {
  public readonly url = input.required<string>();
  public readonly alt = input<string>('');
  public readonly class = input<string>('');

  private readonly http = inject(HttpClient);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly objectUrl = signal<string | null>(null);
  protected readonly failed = signal(false);
  protected readonly hostClass = computed(() => cn('block overflow-hidden', this.class()));

  constructor() {
    let current: string | null = null;
    const revoke = (): void => {
      if (current) {
        URL.revokeObjectURL(current);
        current = null;
      }
    };

    effect((onCleanup) => {
      const url = this.url();
      this.objectUrl.set(null);
      this.failed.set(false);
      revoke();
      if (!this.isBrowser || !url) return;

      const sub = this.http.get(url, { responseType: 'blob' }).subscribe({
        next: (blob) => {
          revoke();
          current = URL.createObjectURL(blob);
          this.objectUrl.set(current);
        },
        error: () => this.failed.set(true),
      });
      onCleanup(() => sub.unsubscribe());
    });

    inject(DestroyRef).onDestroy(revoke);
  }
}
