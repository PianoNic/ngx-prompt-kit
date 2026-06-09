import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkMarkdown } from 'ngx-prompt-kit/markdown';
import { PkMessageImports } from 'ngx-prompt-kit/message';

const RICH_DOC = `# How vector search works

Vector search relies on **dense embeddings** — high-dimensional float arrays where semantic similarity maps to geometric proximity.

## The math

Given a query vector \\(q\\) and document vectors \\(d_1, d_2, \\ldots, d_n\\), the cosine similarity is

$$\\text{sim}(q, d_i) = \\frac{q \\cdot d_i}{\\|q\\| \\, \\|d_i\\|}$$

For unit-normalised vectors this collapses to the dot product, which modern hardware can chew through at hundreds of millions of comparisons per second.

## Pipeline

\`\`\`mermaid
flowchart LR
    Q[Query text] --> E[Embedder]
    E --> V[Query vector]
    V --> S[ANN index search]
    S --> R[Top-k results]
    R --> O[Reranker]
\`\`\`

## In code

\`\`\`ts
import { embed } from './embeddings';
import { db } from './db';

async function search(query: string, k = 10) {
  const [vec] = await embed([query]);
  return db.execute(
    'SELECT id, text FROM docs ORDER BY embedding <=> $1 LIMIT $2',
    [vec, k],
  );
}
\`\`\`

The \`<=>\` operator is pgvector's cosine-distance shorthand. For a 1M-row corpus, an HNSW index keeps this query under 10ms p95.`;

@Component({
  selector: 'app-block-markdown-showcase',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, PkMarkdown, PkMessageImports],
  template: `
    <app-block-page
      title="Markdown showcase"
      description="One assistant message exercising every pk-markdown feature at once: headings, fenced code, inline + block math, and a Mermaid diagram. Math + diagrams lazy-load only when the flags are on."
    >
      <app-doc-example title="Math · code · Mermaid in one reply" [code]="code">
        <div class="flex w-full max-w-3xl flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="Explain how vector search works — formulas + a pipeline diagram + sample code."
            />
          </pk-message>

          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <pk-markdown
              class="prose prose-sm dark:prose-invert min-w-0 flex-1"
              [enableMath]="true"
              [enableDiagrams]="true"
              [content]="doc"
            />
          </pk-message>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class MarkdownShowcaseBlock {
  protected readonly doc = RICH_DOC;

  protected readonly code = `<pk-message>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <pk-markdown
    class="prose prose-sm dark:prose-invert flex-1"
    [enableMath]="true"
    [enableDiagrams]="true"
    [content]="doc"
  />
</pk-message>

// Component
protected readonly doc = \`# How vector search works

Given a query vector \\(q\\) and document vectors \\(d_1, ..., d_n\\),
cosine similarity is

$$\\text{sim}(q, d_i) = \\frac{q \\cdot d_i}{\\|q\\| \\|d_i\\|}$$

\\\`\\\`\\\`mermaid
flowchart LR
    Q[Query text] --> E[Embedder] --> V[Query vector] --> S[ANN search]
\\\`\\\`\\\`

\\\`\\\`\\\`ts
async function search(query: string, k = 10) {
  const [vec] = await embed([query]);
  return db.execute(
    'SELECT id, text FROM docs ORDER BY embedding <=> $1 LIMIT $2',
    [vec, k],
  );
}
\\\`\\\`\\\`
\`;

// Reminder: KaTeX needs the stylesheet in angular.json:
//   "node_modules/katex/dist/katex.min.css"
// and Mermaid auto-loads only when [enableDiagrams]="true".`;
}
