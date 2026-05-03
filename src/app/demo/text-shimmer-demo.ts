import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkTextShimmer } from 'ngx-prompt-kit/text-shimmer';

@Component({
  selector: 'app-text-shimmer-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkTextShimmer],
  template: `
    <app-doc-page
      title="Text Shimmer"
      description="A subtle gradient sweep across text — useful for placeholders, status labels, and 'thinking' states."
    >
      <app-doc-example
        title="Default"
        description="Pass a text input or project content via ng-content."
        [code]="basicCode"
      >
        <pk-text-shimmer text="Computing the optimal route..." class="text-base" />
      </app-doc-example>

      <app-doc-example
        title="Tuned duration and spread"
        description="Slower 6s sweep with a tighter 8% gradient stop."
        [code]="tunedCode"
      >
        <pk-text-shimmer
          text="Loading model weights..."
          class="text-base"
          [duration]="6"
          [spread]="8"
        />
      </app-doc-example>

      <app-doc-install component="text-shimmer" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class TextShimmerDemo {
  protected readonly basicCode = `<pk-text-shimmer text="Computing the optimal route..." />`;
  protected readonly tunedCode = `<pk-text-shimmer
  text="Loading model weights..."
  [duration]="6"
  [spread]="8"
/>`;
  protected readonly api: ApiSection[] = [
    {
      name: 'PkTextShimmer',
      props: [
        { name: 'text', type: 'string', default: "''", description: 'Text content (alternative: project via ng-content).' },
        { name: 'duration', type: 'number', default: '4', description: 'Animation period in seconds.' },
        { name: 'spread', type: 'number', default: '20', description: 'Gradient stop spread, clamped to 5..45.' },
        { name: 'class', type: 'string', description: 'Extra classes for the host span.' },
      ],
    },
  ];
}
