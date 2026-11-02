import { TestBed } from '@angular/core/testing';
import { PkMarkdown } from 'ngx-prompt-kit/markdown';

const EMOJI = /\p{Extended_Pictographic}/u;

async function render(content: string, inputs: Record<string, unknown> = {}): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(PkMarkdown);
  fixture.componentRef.setInput('content', content);
  for (const [name, value] of Object.entries(inputs)) fixture.componentRef.setInput(name, value);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

const IMAGES = [
  '![external](https://evil.example/a.png)',
  `![same site](${location.origin}/logo.png)`,
  '![relative](/logo.png)',
  '![inline](data:image/png;base64,iVBORw0KGgo=)',
  '![blob](blob:https://x.example/1234)',
  '<img src="https://evil.example/raw.png" alt="raw">',
].join('\n\n');

describe('PkMarkdown externalImages', () => {
  it('load (default) keeps images', async () => {
    const el = await render('![a](https://evil.example/a.png)');
    expect(el.querySelectorAll('img').length).toBe(1);
  });

  it('link turns external images into text links without an emoji', async () => {
    const el = await render('![a cat](https://evil.example/a.png)', { externalImages: 'link' });
    expect(el.querySelector('img')).toBeNull();
    const link = el.querySelector('a') as HTMLAnchorElement;
    expect(link.textContent).toBe('Image: a cat (evil.example)');
    expect(EMOJI.test(el.textContent ?? '')).toBe(false);
  });

  it('link keeps data: images', async () => {
    const el = await render('![i](data:image/png;base64,iVBORw0KGgo=)', { externalImages: 'link' });
    expect(el.querySelectorAll('img').length).toBe(1);
  });

  it('none emits no img and no link for any source', async () => {
    const el = await render(IMAGES, { externalImages: 'none' });
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('a')).toBeNull();
    expect(el.innerHTML).not.toContain('evil.example/a.png');
    expect(el.innerHTML).not.toContain('data:image');
    const text = el.textContent ?? '';
    for (const alt of ['external', 'same site', 'relative', 'inline', 'blob', 'raw']) {
      expect(text).toContain(`Image: ${alt}`);
    }
    expect(EMOJI.test(text)).toBe(false);
  });

  it('none uses a fallback label when there is no alt text', async () => {
    const el = await render('![](https://evil.example/a.png)', { externalImages: 'none' });
    expect(el.textContent).toContain('Image: image');
  });
});

describe('PkMarkdown rawHtml', () => {
  it('sanitize (default) parses safe HTML and strips scripts', async () => {
    const el = await render('<b>bold</b><script>window.__x=1</script>');
    expect(el.querySelector('b')).not.toBeNull();
    expect(el.querySelector('script')).toBeNull();
  });

  it('escape shows block and inline HTML as literal text', async () => {
    const el = await render('<div class="x">block</div>\n\nhello <b>inline</b> there', {
      rawHtml: 'escape',
    });
    expect(el.querySelector('div.x')).toBeNull();
    expect(el.querySelector('b')).toBeNull();
    expect(el.textContent).toContain('<div class="x">block</div>');
    expect(el.textContent).toContain('<b>inline</b>');
  });

  it('escape neutralises script and event handlers', async () => {
    const el = await render('<img src=x onerror=alert(1)>\n\n<script>alert(1)</script>', {
      rawHtml: 'escape',
    });
    expect(el.querySelector('img, script')).toBeNull();
    expect(el.textContent).toContain('<script>alert(1)</script>');
  });
});

describe('PkMarkdown linkPolicy', () => {
  it('default leaves links as written', async () => {
    const el = await render('[go](https://example.com)');
    const link = el.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('target')).toBeNull();
    expect(link.getAttribute('title')).toBeNull();
  });

  it('strict opens links safely with a title', async () => {
    const el = await render('[https://example.com/x](https://example.com/x)', {
      linkPolicy: 'strict',
    });
    const link = el.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer nofollow');
    expect(link.getAttribute('title')).toBe('example.com');
    expect(el.querySelector('span.text-muted-foreground')).toBeNull();
  });

  it('strict shows the real host when the text differs', async () => {
    const el = await render('[click here](https://evil.example/path)', { linkPolicy: 'strict' });
    const label = el.querySelector('span.text-muted-foreground.text-xs') as HTMLElement;
    expect(label.textContent).toBe(' (evil.example)');
    expect(label.previousElementSibling?.tagName).toBe('A');
  });

  it('strict keeps mailto links and titles them with the address', async () => {
    const el = await render('[mail me](mailto:a@b.example)', { linkPolicy: 'strict' });
    const link = el.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('title')).toBe('a@b.example');
    expect(el.querySelector('span.text-muted-foreground')?.textContent).toBe(' (a@b.example)');
  });

  it('strict drops javascript:, data:, relative and protocol-relative links to plain text', async () => {
    const md = [
      '[js](javascript:alert(1))',
      '[data](data:text/html;base64,PHNjcmlwdD4=)',
      '[rel](/local)',
      '[proto](//evil.example/x)',
      '<a href="javascript:alert(1)">raw js</a>',
    ].join('\n\n');
    const el = await render(md, { linkPolicy: 'strict' });
    expect(el.querySelector('a')).toBeNull();
    const text = el.textContent ?? '';
    for (const t of ['js', 'data', 'rel', 'proto', 'raw js']) expect(text).toContain(t);
  });

  it('strict also hardens raw HTML anchors', async () => {
    const el = await render('<a href="https://evil.example">hi</a>', { linkPolicy: 'strict' });
    const link = el.querySelector('a') as HTMLAnchorElement;
    expect(link.getAttribute('rel')).toBe('noopener noreferrer nofollow');
  });
});

describe('PkMarkdown combined strict mode', () => {
  it('renders untrusted output with no image, no raw HTML and hardened links', async () => {
    const el = await render(
      '![x](https://evil.example/leak?q=secret) <iframe src="https://evil.example"></iframe> [a](javascript:1) [b](https://ok.example)',
      { externalImages: 'none', rawHtml: 'escape', linkPolicy: 'strict' },
    );
    expect(el.querySelector('img, iframe')).toBeNull();
    expect(el.querySelectorAll('a').length).toBe(1);
  });
});

describe('PkMarkdown code blocks', () => {
  it('keeps fenced code as an escaped fallback until highlighting loads', async () => {
    const el = await render('```ts\nconst a = 1;\n```');
    expect(el.querySelector('.pk-code-container code')?.textContent).toContain('const a = 1;');
  });
});
