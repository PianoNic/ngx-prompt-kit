import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PkMarkdown } from 'prompt-kit-ng/markdown';

@Component({
  selector: 'app-markdown-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PkMarkdown],
  template: `
    <h2 class="text-xl font-semibold mb-4">Markdown</h2>
    <pk-markdown class="prose max-w-none" [content]="md" />
  `,
})
export class MarkdownDemo {
  protected readonly md = `# Heading

Some **bold** and *italic* text. Visit [Angular](https://angular.dev).

- Item one
- Item two

\`\`\`ts
const x: number = 42;
\`\`\``;
}
