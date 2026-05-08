import { isPlatformBrowser } from '@angular/common';
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
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { cn } from '../utils/cn';

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
  /**
   * Shiki theme name. Defaults to 'auto' — detects the .dark class on
   * document.documentElement (Tailwind v4 / Spartan default) and uses
   * darkTheme or lightTheme accordingly. Pass an explicit Shiki theme
   * name (e.g. 'github-dark', 'one-dark-pro') to opt out of detection.
   */
  public readonly theme = input<string>('auto');
  public readonly lightTheme = input<string>('github-light');
  public readonly darkTheme = input<string>('dark-plus');
  public readonly class = input<string>('');

  private readonly sanitizer = inject(DomSanitizer);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly destroyRef = inject(DestroyRef);
  /** Bumped on .dark class toggles so the highlight effect re-runs. */
  private readonly themeRev = signal(0);

  protected readonly highlightedHtml = signal<SafeHtml | null>(null);
  protected readonly computedClass = computed(() =>
    cn('w-full overflow-x-auto text-[13px] [&>pre]:px-4 [&>pre]:py-4', this.class()),
  );

  private resolvedTheme(): string {
    const t = this.theme();
    if (t !== 'auto') return t;
    if (!this.isBrowser) return this.lightTheme();
    return document.documentElement.classList.contains('dark')
      ? this.darkTheme()
      : this.lightTheme();
  }

  constructor() {
    effect(async () => {
      const code = this.code();
      const lang = this.language();
      // Track theme inputs and the doc-class revision so re-highlighting
      // happens on either a prop change or a documentElement.class toggle.
      this.theme();
      this.lightTheme();
      this.darkTheme();
      this.themeRev();
      if (!this.isBrowser) return;
      if (!code) {
        this.highlightedHtml.set(
          this.sanitizer.bypassSecurityTrustHtml('<pre><code></code></pre>'),
        );
        return;
      }
      try {
        const { codeToHtml } = await import('shiki');
        const html = await codeToHtml(code, { lang, theme: this.resolvedTheme() });
        this.highlightedHtml.set(this.sanitizer.bypassSecurityTrustHtml(html));
      } catch {
        this.highlightedHtml.set(null);
      }
    });

    if (this.isBrowser) {
      const observer = new MutationObserver(() => {
        this.themeRev.update((v) => v + 1);
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      this.destroyRef.onDestroy(() => observer.disconnect());
    }
  }
}
