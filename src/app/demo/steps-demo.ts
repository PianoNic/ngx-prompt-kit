import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkStepsImports } from 'ngx-prompt-kit/steps';

@Component({
  selector: 'app-steps-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkStepsImports],
  template: `
    <app-doc-page
      title="Steps"
      description="A collapsible numbered/bulleted timeline for tool traces or multi-step agent runs. Vertical bar marks the active section."
    >
      <app-doc-example
        title="Default open"
        description="Steps default to expanded; click the trigger row to collapse."
        [code]="basicCode"
      >
        <pk-steps class="max-w-md w-full">
          <pk-steps-trigger>3 steps completed</pk-steps-trigger>
          <pk-steps-content>
            <pk-steps-item>Resolved the package manifest.</pk-steps-item>
            <pk-steps-item>Walked the dependency graph.</pk-steps-item>
            <pk-steps-item>Wrote the lockfile to disk.</pk-steps-item>
          </pk-steps-content>
        </pk-steps>
      </app-doc-example>

      <app-doc-example
        title="Initially collapsed"
        description="Pass [defaultOpen]=false to start collapsed."
        [code]="closedCode"
      >
        <pk-steps [defaultOpen]="false" class="max-w-md w-full">
          <pk-steps-trigger>5 messages indexed</pk-steps-trigger>
          <pk-steps-content>
            <pk-steps-item>Read inbox.txt</pk-steps-item>
            <pk-steps-item>Tokenized into 5 messages</pk-steps-item>
            <pk-steps-item>Generated 1024-d embeddings</pk-steps-item>
            <pk-steps-item>Inserted rows into vectors table</pk-steps-item>
            <pk-steps-item>Refreshed the HNSW index</pk-steps-item>
          </pk-steps-content>
        </pk-steps>
      </app-doc-example>

      <app-doc-install component="steps" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class StepsDemo {
  protected readonly basicCode = `<pk-steps>
  <pk-steps-trigger>3 steps completed</pk-steps-trigger>
  <pk-steps-content>
    <pk-steps-item>Resolved the package manifest.</pk-steps-item>
    <pk-steps-item>Walked the dependency graph.</pk-steps-item>
    <pk-steps-item>Wrote the lockfile to disk.</pk-steps-item>
  </pk-steps-content>
</pk-steps>`;

  protected readonly closedCode = `<pk-steps [defaultOpen]="false">
  <pk-steps-trigger>5 messages indexed</pk-steps-trigger>
  <pk-steps-content>
    <pk-steps-item>Read inbox.txt</pk-steps-item>
    <!-- ...more steps... -->
  </pk-steps-content>
</pk-steps>`;

  protected readonly api: ApiSection[] = [
    {
      name: 'PkSteps',
      props: [
        { name: 'open', type: 'model<boolean>', description: 'Two-way bound open state. Leave unbound for uncontrolled.' },
        { name: 'defaultOpen', type: 'boolean', default: 'true', description: 'Initial state when uncontrolled.' },
        { name: 'class', type: 'string', description: 'Extra classes for the wrapper.' },
      ],
    },
    {
      name: 'PkStepsTrigger',
      props: [
        { name: 'leftIcon', type: 'boolean', default: 'false', description: 'Reserve space for a left-icon slot (project via [leftIcon] attribute).' },
        { name: 'swapIconOnHover', type: 'boolean', default: 'true', description: 'Swap leftIcon for the chevron on hover.' },
        { name: 'class', type: 'string', description: 'Extra classes for the trigger button.' },
      ],
    },
    {
      name: 'PkStepsContent',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the collapsing wrapper.' },
      ],
    },
    {
      name: 'PkStepsItem',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the item.' },
      ],
    },
  ];
}
