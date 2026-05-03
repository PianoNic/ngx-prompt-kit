import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { cn } from 'prompt-kit-ng/utils';

@Component({
  selector: 'pk-code-block-code',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (highlightedHtml(); as html) {
      <div [class]="computedClass()" [innerHTML]="html"></div>
    } @else {
      <div [class]="computedClass()">
        <pre><code>{{ code() }}</code></pre>
      </div>
    }
  `,
})
export class PkCodeBlockCode {
  public readonly code = input<string>('');
  public readonly language = input<string>('tsx');
  public readonly theme = input<string>('github-light');
  public readonly class = input<string>('');

  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  protected readonly highlightedHtml = signal<SafeHtml | null>(null);
  protected readonly computedClass = computed(() =>
    cn('w-full overflow-x-auto text-[13px] [&>pre]:px-4 [&>pre]:py-4', this.class()),
  );

  constructor() {
    effect(async () => {
      const code = this.code();
      const lang = this.language();
      const theme = this.theme();
      if (!this.isBrowser) return;
      if (!code) {
        this.highlightedHtml.set(this.sanitizer.bypassSecurityTrustHtml('<pre><code></code></pre>'));
        return;
      }
      try {
        const { codeToHtml } = await import('shiki');
        const html = await codeToHtml(code, { lang, theme });
        this.highlightedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
      } catch {
        this.highlightedHtml.set(null);
      }
    });
  }
}
