import { ChangeDetectionStrategy, Component } from '@angular/core';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkChainOfThoughtImports } from 'prompt-kit-ng/chain-of-thought';

@Component({
  selector: 'app-chain-of-thought-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, PkChainOfThoughtImports],
  template: `
    <app-doc-page
      title="Chain Of Thought"
      description="Vertical reasoning timeline. Each step is independently expandable; the connecting line stops at the last step."
    >
      <app-doc-example
        title="Three-step reasoning"
        description="Mark the final step with [last]=true so the connecting line ends cleanly."
        [code]="basicCode"
      >
        <pk-chain-of-thought class="max-w-md w-full">
          <pk-chain-of-thought-step>
            <pk-chain-of-thought-trigger>Read the input prompt</pk-chain-of-thought-trigger>
            <pk-chain-of-thought-content>
              <pk-chain-of-thought-item>
                Parsed 3 paragraphs and 2 code blocks. Detected language: TypeScript.
              </pk-chain-of-thought-item>
            </pk-chain-of-thought-content>
          </pk-chain-of-thought-step>

          <pk-chain-of-thought-step>
            <pk-chain-of-thought-trigger>Walk the AST</pk-chain-of-thought-trigger>
            <pk-chain-of-thought-content>
              <pk-chain-of-thought-item>
                Visited 14 functions, found one cycle in the auth middleware between
                <code class="font-mono text-xs">refreshSession</code> and <code class="font-mono text-xs">verifyToken</code>.
              </pk-chain-of-thought-item>
            </pk-chain-of-thought-content>
          </pk-chain-of-thought-step>

          <pk-chain-of-thought-step [last]="true">
            <pk-chain-of-thought-trigger>Compose the answer</pk-chain-of-thought-trigger>
            <pk-chain-of-thought-content>
              <pk-chain-of-thought-item>
                Recommend extracting the token-refresh path into a separate module so the cycle is
                broken at the import boundary.
              </pk-chain-of-thought-item>
            </pk-chain-of-thought-content>
          </pk-chain-of-thought-step>
        </pk-chain-of-thought>
      </app-doc-example>

      <app-doc-install component="chain-of-thought" />
      <app-doc-api [sections]="api" />
    </app-doc-page>
  `,
})
export class ChainOfThoughtDemo {
  protected readonly basicCode = `<pk-chain-of-thought>
  <pk-chain-of-thought-step>
    <pk-chain-of-thought-trigger>Read the input prompt</pk-chain-of-thought-trigger>
    <pk-chain-of-thought-content>
      <pk-chain-of-thought-item>Parsed 3 paragraphs and 2 code blocks.</pk-chain-of-thought-item>
    </pk-chain-of-thought-content>
  </pk-chain-of-thought-step>

  <pk-chain-of-thought-step>
    <pk-chain-of-thought-trigger>Walk the AST</pk-chain-of-thought-trigger>
    <pk-chain-of-thought-content>
      <pk-chain-of-thought-item>Visited 14 functions, found one cycle.</pk-chain-of-thought-item>
    </pk-chain-of-thought-content>
  </pk-chain-of-thought-step>

  <pk-chain-of-thought-step [last]="true">
    <pk-chain-of-thought-trigger>Compose the answer</pk-chain-of-thought-trigger>
    <pk-chain-of-thought-content>
      <pk-chain-of-thought-item>Recommend extracting the token-refresh path.</pk-chain-of-thought-item>
    </pk-chain-of-thought-content>
  </pk-chain-of-thought-step>
</pk-chain-of-thought>`;

  protected readonly api: ApiSection[] = [
    {
      name: 'PkChainOfThought',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the wrapper.' },
      ],
    },
    {
      name: 'PkChainOfThoughtStep',
      props: [
        { name: 'open', type: 'model<boolean>', description: 'Two-way bound open state. Leave unbound for uncontrolled.' },
        { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial expanded state when uncontrolled.' },
        { name: 'last', type: 'boolean', default: 'false', description: 'Marks the final step so the connecting line stops here.' },
      ],
    },
    {
      name: 'PkChainOfThoughtTrigger',
      props: [
        { name: 'leftIcon', type: 'boolean', default: 'false', description: 'Reserve a left-icon slot (project via [leftIcon] attribute).' },
        { name: 'swapIconOnHover', type: 'boolean', default: 'true', description: 'Swap leftIcon for the chevron on hover.' },
        { name: 'class', type: 'string', description: 'Extra classes for the trigger.' },
      ],
    },
    {
      name: 'PkChainOfThoughtContent',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the collapsing wrapper.' },
      ],
    },
    {
      name: 'PkChainOfThoughtItem',
      props: [
        { name: 'class', type: 'string', description: 'Extra classes for the item.' },
      ],
    },
  ];
}
