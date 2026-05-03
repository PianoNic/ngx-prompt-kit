import { ChangeDetectionStrategy, Component } from '@angular/core';
import { provideIcons } from '@ng-icons/core';
import { lucideLightbulb, lucideSearch, lucideTarget } from '@ng-icons/lucide';
import { HlmIconImports } from '@spartan-ng/helm/icon';
import { DocApi, type ApiSection } from '../layout/doc-api';
import { DocExample } from '../layout/doc-example';
import { DocInstall } from '../layout/doc-install';
import { DocPage } from '../layout/doc-page';
import { PkChainOfThoughtImports } from 'ngx-prompt-kit/chain-of-thought';

@Component({
  selector: 'app-chain-of-thought-demo',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DocPage, DocExample, DocInstall, DocApi, HlmIconImports, PkChainOfThoughtImports],
  providers: [provideIcons({ lucideSearch, lucideLightbulb, lucideTarget })],
  template: `
    <app-doc-page
      title="Chain Of Thought"
      description="Vertical reasoning timeline. Each step is independently expandable; the connecting line stops at the last step."
    >
      <app-doc-example
        title="Three-step reasoning"
        description="Default circle markers. Mark the final step with [last]=true so the connecting line ends cleanly."
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

      <app-doc-example
        title="With per-step icons"
        description="Set [leftIcon]=true on the trigger and project a custom icon via the [leftIcon] attribute slot. Hover swaps it for the chevron."
        [code]="iconCode"
      >
        <pk-chain-of-thought class="max-w-md w-full">
          <pk-chain-of-thought-step>
            <pk-chain-of-thought-trigger [leftIcon]="true">
              <ng-icon leftIcon hlm size="xs" name="lucideSearch" />
              Research phase: Understanding the problem space
            </pk-chain-of-thought-trigger>
            <pk-chain-of-thought-content>
              <pk-chain-of-thought-item>
                Surveyed 12 prior implementations. Two recurring patterns: explicit step markers and
                implicit timeline animation.
              </pk-chain-of-thought-item>
            </pk-chain-of-thought-content>
          </pk-chain-of-thought-step>

          <pk-chain-of-thought-step>
            <pk-chain-of-thought-trigger [leftIcon]="true">
              <ng-icon leftIcon hlm size="xs" name="lucideLightbulb" />
              Analysis: Identifying optimization opportunities
            </pk-chain-of-thought-trigger>
            <pk-chain-of-thought-content>
              <pk-chain-of-thought-item>
                Hot path: ResizeObserver re-measure on every step toggle. Batched into a single
                rAF dispatch.
              </pk-chain-of-thought-item>
            </pk-chain-of-thought-content>
          </pk-chain-of-thought-step>

          <pk-chain-of-thought-step [last]="true">
            <pk-chain-of-thought-trigger [leftIcon]="true">
              <ng-icon leftIcon hlm size="xs" name="lucideTarget" />
              Solution: Implementing targeted improvements
            </pk-chain-of-thought-trigger>
            <pk-chain-of-thought-content>
              <pk-chain-of-thought-item>
                Replaced per-step observers with a single shared one keyed by element. Memory
                footprint dropped 40%.
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

  <!-- ...more steps... -->

  <pk-chain-of-thought-step [last]="true">
    <pk-chain-of-thought-trigger>Compose the answer</pk-chain-of-thought-trigger>
    <pk-chain-of-thought-content>
      <pk-chain-of-thought-item>Recommend extracting the token-refresh path.</pk-chain-of-thought-item>
    </pk-chain-of-thought-content>
  </pk-chain-of-thought-step>
</pk-chain-of-thought>`;

  protected readonly iconCode = `<pk-chain-of-thought-step>
  <pk-chain-of-thought-trigger [leftIcon]="true">
    <ng-icon leftIcon hlm size="xs" name="lucideSearch" />
    Research phase: Understanding the problem space
  </pk-chain-of-thought-trigger>
  <pk-chain-of-thought-content>
    <pk-chain-of-thought-item>...</pk-chain-of-thought-item>
  </pk-chain-of-thought-content>
</pk-chain-of-thought-step>`;

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
        { name: 'leftIcon', type: 'boolean', default: 'false', description: 'Reserve a left-icon slot. Project the icon via the [leftIcon] attribute (e.g. <ng-icon leftIcon hlm name="lucideSearch" />).' },
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
