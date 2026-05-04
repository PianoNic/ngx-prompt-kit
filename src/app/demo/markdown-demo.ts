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
      description="Renders markdown content using the marked parser. Sanitized via DomSanitizer. Streams gracefully — partial markdown still renders. Optional LaTeX (KaTeX) and Mermaid rendering, both opt-in."
    >
      <app-doc-example
        title="Rich content"
        description="Headings, lists, links, emphasis, and inline code."
        [code]="richCode"
      >
        <pk-markdown class="prose prose-sm dark:prose-invert w-full" [content]="rich" />
      </app-doc-example>

      <app-doc-example
        title="Streaming snapshot"
        description="A mid-stream chunk where the assistant hasn't finished writing the bullet list yet."
        [code]="partialCode"
      >
        <pk-markdown
          class="prose prose-sm dark:prose-invert w-full"
          [content]="partial"
        />
      </app-doc-example>

      <p class="text-muted-foreground text-xs italic">
        Math and diagram rendering are opt-in via [enableMath] and [enableDiagrams].
        KaTeX (~280 KB) and Mermaid (~600 KB) lazy-load only when these flags are
        true — the default markdown bundle stays light. KaTeX additionally requires
        its stylesheet (<code class="font-mono">node_modules/katex/dist/katex.min.css</code>)
        in your <code class="font-mono">angular.json</code> styles array.
      </p>

      <app-doc-example
        title="Math (LaTeX via KaTeX)"
        description="Set [enableMath]='true' to render inline ($…$) and block ($$…$$) math. Bad LaTeX renders as source text rather than throwing — safe for streamed model output."
        [code]="mathCode"
      >
        <pk-markdown
          class="prose prose-sm dark:prose-invert w-full"
          [enableMath]="true"
          [content]="math"
        />
      </app-doc-example>

      <app-doc-example
        title="Mermaid diagram"
        description="Set [enableDiagrams]='true' to render Mermaid blocks. Theme detection is automatic against the .dark class on documentElement; pass [mermaidTheme] explicitly to override. Failed diagrams fall back to the source as a code block."
        [code]="diagramCode"
      >
        <pk-markdown
          class="prose prose-sm dark:prose-invert w-full"
          [enableDiagrams]="true"
          [content]="diagram"
        />
      </app-doc-example>

      <app-doc-example
        title="Math + diagrams together"
        description="Both flags can be enabled on the same component. They run in independent post-render passes (~300ms debounce) so they coexist without interference."
        [code]="bothCode"
      >
        <pk-markdown
          class="prose prose-sm dark:prose-invert w-full"
          [enableMath]="true"
          [enableDiagrams]="true"
          [content]="both"
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
        {
          name: 'enableMath',
          type: 'boolean',
          default: 'false',
          description: 'Lazy-load KaTeX and render LaTeX math. Requires katex.min.css in your global styles.',
        },
        {
          name: 'enableDiagrams',
          type: 'boolean',
          default: 'false',
          description: 'Lazy-load Mermaid and render ```mermaid blocks. Mermaid initializes with securityLevel:strict.',
        },
        {
          name: 'mathInlineDelimiter',
          type: '"$" | "\\(" | "both"',
          default: '"$"',
          description: 'Inline math delimiter style. "both" accepts either dollar or LaTeX-style.',
        },
        {
          name: 'mathBlockDelimiter',
          type: '"$$" | "\\[" | "both"',
          default: '"$$"',
          description: 'Block math delimiter style. "both" accepts either dollar or LaTeX-style.',
        },
        {
          name: 'mermaidTheme',
          type: '"auto" | "default" | "dark"',
          default: '"auto"',
          description: 'Mermaid theme. "auto" detects via the .dark class on documentElement; pass explicitly for bespoke theme management.',
        },
      ],
    },
  ];

  protected readonly rich = `## Release notes — v21.0.4

This is the latest patch of **ngx-prompt-kit**.

- 26 components plus the \`cn()\` utility
- Built on [Spartan UI](https://www.spartan.ng) primitives
- Distributed via Angular schematics

Run \`ng add ngx-prompt-kit\` to get started.`;

  protected readonly partial = `### Steps so far

1. Read the file
2. Parsed the AST
3. Looking up the symbol now`;

  protected readonly math = `The quadratic formula solves any second-degree polynomial:

$$x = \\frac{-b \\pm \\sqrt{b^{2} - 4ac}}{2a}$$

Inline expressions work too — Euler's identity, $e^{i\\pi} + 1 = 0$, sits naturally in a sentence.

Maxwell's first equation in differential form:

$$\\nabla \\cdot \\mathbf{E} = \\frac{\\rho}{\\varepsilon_{0}}$$`;

  protected readonly diagram = `A typical streaming-response cycle in a chat app:

\`\`\`mermaid
sequenceDiagram
  participant User
  participant App
  participant LLM
  User->>App: Send prompt
  App->>LLM: Forward request
  LLM-->>App: Stream tokens
  App-->>User: Render incrementally
\`\`\`

The diagram above re-renders only when its source changes — identical sources share a stable id.`;

  protected readonly both = `### Pricing rationale

For a single round-trip with $T_{in}$ input tokens and $T_{out}$ output tokens at rates $p_{in}$ and $p_{out}$ (USD per million):

$$\\text{cost} = \\frac{T_{in} \\cdot p_{in} + T_{out} \\cdot p_{out}}{10^{6}}$$

Cost flows through a typical session like this:

\`\`\`mermaid
flowchart LR
  A[User prompt] --> B[Tokenize]
  B --> C[Model call]
  C --> D[Streamed response]
  D --> E[Settle cost]
\`\`\`

The two passes (math + diagram) run independently after marked emits HTML.`;

  protected readonly richCode = `<pk-markdown
  class="prose prose-sm dark:prose-invert max-w-none"
  [content]="markdownString"
/>`;

  protected readonly partialCode = `<pk-markdown
  class="prose prose-sm dark:prose-invert max-w-none"
  [content]="partialMarkdown"
/>`;

  protected readonly mathCode = `<pk-markdown
  class="prose prose-sm dark:prose-invert max-w-none"
  [enableMath]="true"
  [content]="markdownWithMath"
/>`;

  protected readonly diagramCode = `<pk-markdown
  class="prose prose-sm dark:prose-invert max-w-none"
  [enableDiagrams]="true"
  [content]="markdownWithMermaid"
/>`;

  protected readonly bothCode = `<pk-markdown
  class="prose prose-sm dark:prose-invert max-w-none"
  [enableMath]="true"
  [enableDiagrams]="true"
  [content]="markdownWithBoth"
/>`;
}
