import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkSourceImports } from 'ngx-prompt-kit/source';

@Component({
  selector: 'app-source-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkSourceImports],
  template: `
    <app-doc-page
      title="Source"
      description="Citation pill for RAG answers. Hover the chip to preview the title + description in a hover card."
    >
      <app-doc-example
        title="Inline citation chip"
        description="Hover the chip to preview the source. Click to open in a new tab."
        [code]="basicCode"
      >
        <p class="text-sm">
          Vector databases use approximate nearest neighbor search to scale to millions of embeddings
          <pk-source href="https://en.wikipedia.org/wiki/Nearest_neighbor_search">
            <pk-source-trigger label="1" />
            <pk-source-content
              title="Nearest neighbor search — Wikipedia"
              description="An approach to optimization in metric spaces, used by HNSW, IVF, and other vector index structures."
            />
          </pk-source>
          while keeping query latency under ~10ms.
        </p>
      </app-doc-example>

      <app-doc-example
        title="With favicon and custom label"
        description="Set [showFavicon]=true to fetch the site's favicon next to the label."
        [code]="faviconCode"
      >
        <div class="flex flex-wrap items-center gap-2">
          <pk-source href="https://angular.dev/guide/signals">
            <pk-source-trigger [showFavicon]="true" label="angular.dev" />
            <pk-source-content
              title="Signals · Angular"
              description="Reactive primitives for tracking state and propagating change in Angular applications."
            />
          </pk-source>
          <pk-source href="https://www.spartan.ng">
            <pk-source-trigger [showFavicon]="true" />
            <pk-source-content
              title="Spartan UI"
              description="Headless and styled Angular UI primitives. The brain handles behavior, helm handles the look."
            />
          </pk-source>
        </div>
      </app-doc-example>

      <app-doc-install component="source" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class SourceDemo {
  protected readonly basicCode = `<pk-source href="https://en.wikipedia.org/wiki/Nearest_neighbor_search">
  <pk-source-trigger label="1" />
  <pk-source-content
    title="Nearest neighbor search — Wikipedia"
    description="An approach to optimization in metric spaces..."
  />
</pk-source>`;

  protected readonly faviconCode = `<pk-source href="https://angular.dev/guide/signals">
  <pk-source-trigger [showFavicon]="true" label="angular.dev" />
  <pk-source-content
    title="Signals · Angular"
    description="Reactive primitives for tracking state..."
  />
</pk-source>`;

  protected readonly api: ApiSection[] = [
    {
      name: 'PkSource',
      props: [
        { name: 'href', type: 'string', description: 'Required URL. The hostname is auto-extracted as the default label.' },
      ],
    },
    {
      name: 'PkSourceTrigger',
      props: [
        { name: 'label', type: 'string | number', description: 'Override the default (domain) label.' },
        { name: 'showFavicon', type: 'boolean', default: 'false', description: 'Show the site favicon next to the label.' },
        { name: 'class', type: 'string', description: 'Extra classes for the chip.' },
      ],
    },
    {
      name: 'PkSourceContent',
      props: [
        { name: 'title', type: 'string', description: 'Card title (required).' },
        { name: 'description', type: 'string', description: 'Card description (required).' },
        { name: 'class', type: 'string', description: 'Extra classes for the hover card.' },
      ],
    },
  ];
}
