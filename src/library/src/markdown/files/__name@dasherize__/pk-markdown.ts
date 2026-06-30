import { isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  input,
  PLATFORM_ID,
  signal,
  viewChild,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { Marked, type Tokens } from 'marked';
// Types come from @types/katex (auto-installed by the schematic).

export type MathInlineDelimiter = '$' | '\\(' | 'both';
export type MathBlockDelimiter = '$$' | '\\[' | 'both';
export type MermaidThemeMode = 'auto' | 'default' | 'dark';

interface KatexDelimiter {
  left: string;
  right: string;
  display: boolean;
}

@Component({
  selector: 'pk-markdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div #content [class]="class()" [innerHTML]="html()"></div>`,
})
export class PkMarkdown {
  public readonly content = input<string>('');
  public readonly class = input<string>('');
  public readonly enableMath = input<boolean>(false);
  public readonly enableDiagrams = input<boolean>(false);
  public readonly mathInlineDelimiter = input<MathInlineDelimiter>('$');
  public readonly mathBlockDelimiter = input<MathBlockDelimiter>('$$');
  /**
   * 'auto' detects dark mode via the .dark class on document.documentElement
   * (Tailwind v4 / Spartan default). For consumers with bespoke theme
   * management, pass 'default' or 'dark' explicitly.
   */
  public readonly mermaidTheme = input<MermaidThemeMode>('auto');

  private readonly platformId = inject(PLATFORM_ID);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly destroyRef = inject(DestroyRef);
  private readonly contentEl = viewChild<ElementRef<HTMLDivElement>>('content');
  private renderTimer: ReturnType<typeof setTimeout> | null = null;
  private renderSeq = 0;
  /**
   * Bumped whenever the host theme toggles (via MutationObserver on the
   * documentElement class attribute). Tracked by the enhancement effect so
   * Mermaid re-renders with the new theme. KaTeX uses color:inherit so
   * adapts without re-rendering, but the re-trigger is harmless.
   */
  private readonly themeRev = signal(0);

  private readonly md = computed<Marked>(() => {
    const m = new Marked({ breaks: true, gfm: true });
    const enableDiagrams = this.enableDiagrams();
    m.use({
      renderer: {
        code(token: Tokens.Code): string | false {
          // Mermaid takes priority when enabled — emits its own placeholder
          // that applyDiagrams() turns into an SVG.
          if (enableDiagrams && token.lang === 'mermaid') {
            const source = token.text;
            const id = `pk-mermaid-${djb2(source)}`;
            const escaped = escapeHtml(source);
            return `<div class="pk-mermaid-container" data-mermaid-id="${id}" data-mermaid-source="${escaped}">${escaped}</div>`;
          }
          // Every other fenced block becomes a placeholder that
          // applyCodeBlocks() upgrades to a Shiki-highlighted block with a
          // language tag and a Copy button. The inner pre/code is the
          // fallback shown until Shiki finishes loading (or if it fails).
          const lang = (token.lang || 'text').trim() || 'text';
          const langAttr = escapeHtml(lang);
          const escaped = escapeHtml(token.text);
          return `<div class="pk-code-container" data-code-lang="${langAttr}"><pre><code class="language-${langAttr}">${escaped}</code></pre></div>`;
        },
      },
    });
    return m;
  });

  protected readonly html = computed<SafeHtml>(() => {
    const parsed = this.md().parse(this.content(), { async: false }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(parsed);
  });

  private readonly delimiters = computed<KatexDelimiter[]>(() => {
    const out: KatexDelimiter[] = [];
    const block = this.mathBlockDelimiter();
    const inline = this.mathInlineDelimiter();
    // Block delimiters first so $$ matches before single $
    if (block === '$$' || block === 'both') {
      out.push({ left: '$$', right: '$$', display: true });
    }
    if (block === '\\[' || block === 'both') {
      out.push({ left: '\\[', right: '\\]', display: true });
    }
    if (inline === '$' || inline === 'both') {
      out.push({ left: '$', right: '$', display: false });
    }
    if (inline === '\\(' || inline === 'both') {
      out.push({ left: '\\(', right: '\\)', display: false });
    }
    return out;
  });

  constructor() {
    // Content / flag effect — debounced so streamed markdown doesn't try to
    // render partial math like "$x^" before the closing delimiter arrives.
    effect(() => {
      this.html();
      this.enableMath();
      this.enableDiagrams();
      this.mathInlineDelimiter();
      this.mathBlockDelimiter();
      this.mermaidTheme();

      if (!isPlatformBrowser(this.platformId)) return;

      if (this.renderTimer) clearTimeout(this.renderTimer);
      this.renderTimer = setTimeout(() => this.runEnhancements(), 300);
    });

    // Theme effect — content is settled when this fires (theme toggled by
    // user gesture, not mid-stream), so skip the debounce. Re-highlights
    // code blocks against the new theme, and re-renders diagrams when
    // enabled. KaTeX uses color:inherit and adapts without re-rendering.
    let firstThemeRun = true;
    effect(() => {
      this.themeRev();
      if (firstThemeRun) {
        firstThemeRun = false;
        return;
      }
      if (!isPlatformBrowser(this.platformId)) return;
      const el = this.contentEl()?.nativeElement;
      if (!el) return;
      queueMicrotask(() => this.rehighlightCodeBlocks(el));
      if (this.enableDiagrams()) {
        queueMicrotask(() => this.applyDiagrams(el));
      }
    });

    // Watch documentElement.class for theme toggles. Same default detection
    // path as resolvedMermaidTheme — when the .dark class flips, bump
    // themeRev so the theme effect re-runs immediately.
    if (isPlatformBrowser(this.platformId)) {
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

  private async runEnhancements(): Promise<void> {
    const el = this.contentEl()?.nativeElement;
    if (!el) return;
    // Code blocks first — Shiki only loads when the rendered HTML actually
    // contains fenced blocks, so prose-only content stays light.
    await this.applyCodeBlocks(el);
    if (this.enableMath()) {
      await this.applyMath(el);
    }
    if (this.enableDiagrams()) {
      await this.applyDiagrams(el);
    }
  }

  private async applyCodeBlocks(el: HTMLElement): Promise<void> {
    const containers = el.querySelectorAll<HTMLElement>('.pk-code-container');
    if (containers.length === 0) return;
    try {
      // Lazy-load: Shiki (~250KB) only enters the bundle when content has fenced blocks
      const { codeToHtml } = await import('shiki');
      const isDark =
        isPlatformBrowser(this.platformId) && document.documentElement.classList.contains('dark');
      const theme = isDark ? 'dark-plus' : 'github-light';

      for (const container of Array.from(containers)) {
        if (container.dataset['enhanced'] === 'true') continue;
        const codeEl = container.querySelector('code');
        const code = codeEl?.textContent ?? '';
        const lang = container.dataset['codeLang'] || 'text';

        const wrapper = buildCodeBlockShell(lang);
        wrapper.dataset['enhanced'] = 'true';
        // Store the source so the theme effect can re-highlight on dark/light
        // toggle without re-parsing the markdown.
        wrapper.dataset['codeSource'] = code;
        wrapper.dataset['codeLang'] = lang;

        const body = wrapper.querySelector<HTMLElement>('.pk-code-body');
        if (body) {
          let parsed: Document;
          try {
            const html = await codeToHtml(code, { lang, theme });
            parsed = new DOMParser().parseFromString(html, 'text/html');
          } catch {
            const pre = document.createElement('pre');
            const codeNode = document.createElement('code');
            codeNode.textContent = code;
            pre.appendChild(codeNode);
            body.appendChild(pre);
            attachCopyHandler(wrapper, code);
            container.replaceWith(wrapper);
            continue;
          }
          const pre = parsed.body.querySelector('pre');
          if (pre) body.appendChild(pre);
        }

        attachCopyHandler(wrapper, code);
        container.replaceWith(wrapper);
      }
    } catch {
      // Shiki missing or failed; fenced blocks stay as the escaped <pre><code> fallback
    }
  }

  /**
   * Re-highlight already-enhanced code blocks against the current theme.
   * Cheaper than re-parsing the markdown — just reads the source from the
   * dataset and swaps the highlighted <pre> in the body.
   */
  private async rehighlightCodeBlocks(el: HTMLElement): Promise<void> {
    const blocks = el.querySelectorAll<HTMLElement>('.pk-code-block[data-enhanced="true"]');
    if (blocks.length === 0) return;
    try {
      const { codeToHtml } = await import('shiki');
      const isDark =
        isPlatformBrowser(this.platformId) && document.documentElement.classList.contains('dark');
      const theme = isDark ? 'dark-plus' : 'github-light';

      for (const block of Array.from(blocks)) {
        const code = block.dataset['codeSource'] ?? '';
        const lang = block.dataset['codeLang'] ?? 'text';
        const body = block.querySelector<HTMLElement>('.pk-code-body');
        if (!body) continue;
        try {
          const html = await codeToHtml(code, { lang, theme });
          const parsed = new DOMParser().parseFromString(html, 'text/html');
          const pre = parsed.body.querySelector('pre');
          if (pre) body.replaceChildren(pre);
        } catch {
          // unknown lang or shiki failure — leave the existing render in place
        }
      }
    } catch {
      // shiki failed to load; existing renders stay
    }
  }

  private async applyMath(el: HTMLElement): Promise<void> {
    try {
      // Lazy-load: KaTeX (~280KB) only enters the bundle when enableMath is true.
      // KaTeX styles must be added separately to the consumer's angular.json
      // styles array or imported in the global stylesheet:
      //   "styles": ["node_modules/katex/dist/katex.min.css", ...]
      // Without the stylesheet, math renders unstyled (no fonts, no layout).
      const { default: renderMathInElement } = await import('katex/contrib/auto-render');
      renderMathInElement(el, {
        delimiters: this.delimiters(),
        throwOnError: false, // bad LaTeX renders as source text, not as an error
      });
    } catch {
      // KaTeX missing or failed; leave content as the raw markdown source
    }
  }

  private async applyDiagrams(el: HTMLElement): Promise<void> {
    const containers = el.querySelectorAll<HTMLElement>('.pk-mermaid-container');
    if (containers.length === 0) return;
    try {
      // Lazy-load: Mermaid (~600KB) only enters the bundle when enableDiagrams is true
      const { default: mermaid } = await import('mermaid');
      mermaid.initialize({
        // securityLevel:'strict' is non-negotiable — disables click handlers,
        // links, and HTML labels that LLM-generated Mermaid sometimes includes.
        securityLevel: 'strict',
        startOnLoad: false,
        theme: this.resolvedMermaidTheme(),
      });
      for (const container of Array.from(containers)) {
        const source = decodeHtml(container.getAttribute('data-mermaid-source') ?? '');
        if (!source) continue;
        // Fresh id per render call. Stable-id caching collides with re-render
        // (Mermaid's render() injects a temp element under the id; second call
        // with the same id finds the prior SVG still in the DOM and errors).
        // Re-render reactivity matters more than the caching optimization
        // because theme toggles need to repaint the diagram.
        const id = `pk-mermaid-${djb2(source)}-${++this.renderSeq}`;
        try {
          const { svg } = await mermaid.render(id, source);
          // Parse the SVG string into a real DOM tree via DOMParser, then
          // swap children. Layered protection:
          //  (1) securityLevel:'strict' (above) sanitizes Mermaid's output
          //      and blocks click handlers/links/HTML labels;
          //  (2) DOMParser builds an XML tree from a known-shape SVG payload
          //      rather than treating the string as raw HTML — script tags
          //      embedded in image/svg+xml are inert by spec;
          //  (3) source string is treated as opaque renderer input, never
          //      concatenated into a template;
          //  (4) on render failure (catch branch), the source is shown as
          //      textContent in a code block — never injected as HTML.
          const doc = new DOMParser().parseFromString(svg, 'image/svg+xml');
          const root = doc.documentElement;
          if (root && root.nodeName.toLowerCase() === 'svg') {
            container.replaceChildren(root);
          }
        } catch {
          const fallback = document.createElement('pre');
          const code = document.createElement('code');
          code.className = 'language-mermaid';
          code.textContent = source;
          fallback.appendChild(code);
          container.replaceWith(fallback);
        }
      }
    } catch {
      // Mermaid missing or failed to load; containers stay as escaped source text
    }
  }

  private resolvedMermaidTheme(): 'default' | 'dark' {
    const t = this.mermaidTheme();
    if (t !== 'auto') return t;
    if (!isPlatformBrowser(this.platformId)) return 'default';
    return document.documentElement.classList.contains('dark') ? 'dark' : 'default';
  }
}

/** djb2 hash — stable per-source-content id so identical diagrams share the same id and aren't re-rendered. */
function djb2(str: string): string {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
  }
  return (hash >>> 0).toString(36);
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildCodeBlockShell(lang: string): HTMLDivElement {
  const wrapper = document.createElement('div');
  wrapper.className =
    'pk-code-block border-border bg-background my-3 overflow-hidden rounded-md border';

  const header = document.createElement('div');
  header.className =
    'border-border bg-muted/40 text-muted-foreground flex items-center justify-between border-b px-3 py-1.5 text-[11px]';

  const langSpan = document.createElement('span');
  langSpan.className = 'font-mono uppercase tracking-wider';
  langSpan.textContent = lang;
  header.appendChild(langSpan);

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className =
    'pk-code-copy hover:text-foreground inline-flex items-center gap-1 transition-colors';
  copyBtn.textContent = 'Copy';
  header.appendChild(copyBtn);

  const body = document.createElement('div');
  body.className =
    'pk-code-body w-full overflow-x-auto text-[13px] [&>pre]:!m-0 [&>pre]:!bg-transparent [&>pre]:px-4 [&>pre]:py-3';

  wrapper.appendChild(header);
  wrapper.appendChild(body);
  return wrapper;
}

function attachCopyHandler(wrapper: HTMLElement, code: string): void {
  const btn = wrapper.querySelector<HTMLButtonElement>('.pk-code-copy');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const writer = navigator.clipboard?.writeText(code);
    if (!writer) return;
    void writer.then(() => {
      btn.textContent = 'Copied';
      setTimeout(() => {
        btn.textContent = 'Copy';
      }, 1500);
    });
  });
}

function decodeHtml(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&');
}
