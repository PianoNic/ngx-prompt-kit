import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkMarkdown } from 'ngx-prompt-kit/markdown';

@Component({
  selector: 'app-markdown-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkMarkdown],
  template: `
    <app-doc-page
      title="Markdown"
      description="Renders markdown content using the marked parser. Sanitized via DomSanitizer. Streams gracefully — partial markdown still renders."
    >
      <app-doc-example
        title="Rich content"
        description="Headings, lists, links, emphasis, and inline code."
        [code]="richCode"
      >
        <pk-markdown class="prose prose-sm dark:prose-invert max-w-none w-full" [content]="rich" />
      </app-doc-example>

      <app-doc-example
        title="Streaming snapshot"
        description="A mid-stream chunk where the assistant hasn't finished writing the bullet list yet."
        [code]="partialCode"
      >
        <pk-markdown
          class="prose prose-sm dark:prose-invert max-w-none w-full"
          [content]="partial"
        />
      </app-doc-example>

      <app-doc-install component="markdown" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class MarkdownDemo {
  protected readonly api: ApiSection[] = [
    {
      name: 'PkMarkdown',
      props: [
        { name: 'content', type: 'string', default: "''", description: 'The markdown source to render.' },
        { name: 'class', type: 'string', description: 'Extra classes for the rendered container.' },
      ],
    },
  ];

  protected readonly rich = `## Release notes — v0.1.0

This is the first tagged release of **ngx-prompt-kit**.

- 11 components plus the \`cn()\` utility
- Built on [Spartan UI](https://www.spartan.ng) primitives
- Distributed via Angular schematics

Run \`ng add ngx-prompt-kit\` to get started.`;

  protected readonly partial = `### Steps so far

1. Read the file
2. Parsed the AST
3. Looking up the symbol now`;

  protected readonly richCode = `<pk-markdown
  class="prose prose-sm dark:prose-invert max-w-none"
  [content]="markdownString"
/>`;

  protected readonly partialCode = `<pk-markdown
  class="prose prose-sm dark:prose-invert max-w-none"
  [content]="partialMarkdown"
/>`;
}
