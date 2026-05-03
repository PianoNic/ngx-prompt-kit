import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { DocPage } from '../layout/doc-page';
import { PkMarkdown } from 'prompt-kit-ng/markdown';

@Component({
  selector: 'app-markdown-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, PkMarkdown],
  template: `
    <app-doc-page
      title="Markdown"
      description="Renders markdown content using the marked parser. Sanitized via DomSanitizer. Streams gracefully — partial markdown still renders."
    >
      <app-doc-example title="Rich content" description="Headings, lists, links, emphasis, and inline code.">
        <pk-markdown class="prose prose-sm dark:prose-invert max-w-none w-full" [content]="rich" />
      </app-doc-example>

      <app-doc-example
        title="Streaming snapshot"
        description="A mid-stream chunk where the assistant hasn't finished writing the bullet list yet."
      >
        <pk-markdown
          class="prose prose-sm dark:prose-invert max-w-none w-full"
          [content]="partial"
        />
      </app-doc-example>
    </app-doc-page>
  `,
})
export class MarkdownDemo {
  protected readonly rich = `## Release notes — v0.1.0

This is the first tagged release of **prompt-kit-ng**.

- 11 components plus the \`cn()\` utility
- Built on [Spartan UI](https://www.spartan.ng) primitives
- Distributed via Angular schematics

Run \`ng add @pianonic/prompt-kit-ng\` to get started.`;

  protected readonly partial = `### Steps so far

1. Read the file
2. Parsed the AST
3. Looking up the symbol now`;
}
