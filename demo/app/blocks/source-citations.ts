import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocExample } from '../layout/doc-example';
import { BlockPage } from './block-page';
import { PkMessageImports } from 'ngx-prompt-kit/message';
import { PkSourceImports } from 'ngx-prompt-kit/source';

@Component({
  selector: 'app-block-source-citations',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BlockPage, DocExample, PkMessageImports, PkSourceImports],
  template: `
    <app-block-page
      title="Source-attributed answer"
      description="RAG-style answer with inline citations. Each chip is hover-previewable; click to open the source. Numbered footer summarises everything cited."
    >
      <app-doc-example title="Inline cites + sources footer" [code]="code">
        <div class="flex w-full max-w-2xl flex-col gap-4">
          <pk-message class="justify-end">
            <pk-message-content
              class="bg-primary text-primary-foreground"
              content="What's the difference between HNSW and IVF vector indexes?"
            />
          </pk-message>

          <pk-message>
            <pk-message-avatar src="" alt="Assistant" fallback="AI" />
            <div class="flex min-w-0 flex-1 flex-col gap-3">
              <p class="text-sm leading-relaxed">
                HNSW (Hierarchical Navigable Small World) builds a layered graph where each layer
                skips long-distance connections, so search descends through layers narrowing the
                candidate set
                <pk-source href="https://en.wikipedia.org/wiki/Hierarchical_navigable_small_world">
                  <pk-source-trigger label="1" />
                  <pk-source-content
                    title="HNSW — Wikipedia"
                    description="A graph-based ANN structure with O(log N) average query complexity, popular in pgvector and FAISS."
                  />
                </pk-source>
                . IVF (Inverted File) clusters vectors with k-means and only searches a handful of
                nearby clusters at query time
                <pk-source href="https://www.pinecone.io/learn/series/faiss/vector-indexes/">
                  <pk-source-trigger label="2" />
                  <pk-source-content
                    title="Vector indexes · Pinecone"
                    description="A practical comparison of IVF, HNSW, and PQ — covering recall/latency tradeoffs and tuning parameters."
                  />
                </pk-source>
                . HNSW typically gets higher recall at the same latency, but IVF uses less memory
                and is easier to update incrementally
                <pk-source href="https://github.com/facebookresearch/faiss/wiki/Faiss-indexes">
                  <pk-source-trigger label="3" />
                  <pk-source-content
                    title="Faiss indexes wiki"
                    description="Reference matrix of all index types with their memory, build time, and search complexity tradeoffs."
                  />
                </pk-source>
                .
              </p>

              <div class="border-border flex flex-col gap-2 border-t pt-3">
                <span
                  class="text-muted-foreground text-[10px] font-medium uppercase tracking-wider"
                >
                  Sources
                </span>
                <div class="flex flex-wrap gap-2">
                  <pk-source
                    href="https://en.wikipedia.org/wiki/Hierarchical_navigable_small_world"
                  >
                    <pk-source-trigger [showFavicon]="true" label="wikipedia.org" />
                    <pk-source-content
                      title="HNSW — Wikipedia"
                      description="A graph-based ANN structure with O(log N) average query complexity."
                    />
                  </pk-source>
                  <pk-source href="https://www.pinecone.io/learn/series/faiss/vector-indexes/">
                    <pk-source-trigger [showFavicon]="true" label="pinecone.io" />
                    <pk-source-content
                      title="Vector indexes · Pinecone"
                      description="A practical comparison of IVF, HNSW, and PQ."
                    />
                  </pk-source>
                  <pk-source href="https://github.com/facebookresearch/faiss/wiki/Faiss-indexes">
                    <pk-source-trigger [showFavicon]="true" label="github.com" />
                    <pk-source-content
                      title="Faiss indexes wiki"
                      description="Reference matrix of all index types with their tradeoffs."
                    />
                  </pk-source>
                </div>
              </div>
            </div>
          </pk-message>
        </div>
      </app-doc-example>
    </app-block-page>
  `,
})
export class SourceCitationsBlock {
  protected readonly code = `<pk-message>
  <pk-message-avatar src="" alt="Assistant" fallback="AI" />
  <div class="flex flex-1 flex-col gap-3">
    <p class="text-sm leading-relaxed">
      HNSW builds a layered graph
      <pk-source href="https://en.wikipedia.org/wiki/Hierarchical_navigable_small_world">
        <pk-source-trigger label="1" />
        <pk-source-content
          title="HNSW — Wikipedia"
          description="A graph-based ANN structure with O(log N) query complexity."
        />
      </pk-source>
      . IVF clusters vectors
      <pk-source href="https://www.pinecone.io/learn/series/faiss/vector-indexes/">
        <pk-source-trigger label="2" />
        <pk-source-content title="Vector indexes" description="..." />
      </pk-source>
      .
    </p>

    <div class="border-t pt-3">
      <span class="text-xs uppercase">Sources</span>
      <div class="flex flex-wrap gap-2">
        <pk-source href="https://en.wikipedia.org/wiki/...">
          <pk-source-trigger [showFavicon]="true" label="wikipedia.org" />
          <pk-source-content title="..." description="..." />
        </pk-source>
        <!-- ...more sources... -->
      </div>
    </div>
  </div>
</pk-message>`;
}
