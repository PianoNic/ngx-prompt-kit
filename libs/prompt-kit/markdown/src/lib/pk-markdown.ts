import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
} from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Component({
  selector: 'pk-markdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div [class]="class()" [innerHTML]="html()"></div>`,
})
export class PkMarkdown {
  public readonly content = input<string>('');
  public readonly class = input<string>('');

  private readonly sanitizer = inject(DomSanitizer);

  protected readonly html = computed<SafeHtml>(() => {
    const parsed = marked.parse(this.content(), {
      async: false,
      breaks: true,
      gfm: true,
    }) as string;
    return this.sanitizer.bypassSecurityTrustHtml(parsed);
  });
}
